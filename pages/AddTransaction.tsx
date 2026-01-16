
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { Transaction, TransactionType, UserOwner, RecurrenceType } from '../types';

const AddTransaction: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addTransaction, categories, accounts, currentUser } = useAppStore();

  const [type, setType] = useState<TransactionType>('despesa');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState(accounts[0].id);
  const [assignedTo, setAssignedTo] = useState<UserOwner>('Casa');
  const [paidBy, setPaidBy] = useState<'Junior' | 'Rosângela'>('Junior');
  const [isRecurring, setIsRecurring] = useState(false);
  const [status, setStatus] = useState<'pago' | 'pendente'>('pago');
  const [quickInput, setQuickInput] = useState('');

  useEffect(() => {
    const state = location.state as any;
    if (state?.initialCategory) setCategoryId(state.initialCategory);
    if (state?.description) setDescription(state.description);
    if (state?.transaction) {
      const t = state.transaction;
      setType(t.type);
      setValue(t.value.toString());
      setDescription(t.description);
      setCategoryId(t.categoryId);
      setAccountId(t.accountId);
      setAssignedTo(t.assignedTo);
      setPaidBy(t.paidBy);
      setStatus(t.status);
    }
    if (!categoryId) {
        setCategoryId(categories.find(c => c.type === (type === 'receita' ? 'receita' : 'despesa'))?.id || '');
    }
    if (state?.voiceEntry) {
        // In a real app we'd trigger browser STT here.
    }
    setPaidBy(currentUser as 'Junior' | 'Rosângela');
  }, [location.state, categories, currentUser]);

  const parseQuickInput = () => {
    const text = quickInput.toLowerCase();
    
    // Extract value
    const valMatch = text.match(/(\d+([,.]\d+)?)/);
    if (valMatch) setValue(valMatch[0].replace(',', '.'));

    // Extract user
    if (text.includes('junior')) setPaidBy('Junior');
    if (text.includes('rosângela') || text.includes('rosangela')) setPaidBy('Rosângela');

    // Extract category
    categories.forEach(cat => {
      if (text.includes(cat.name.toLowerCase())) setCategoryId(cat.id);
    });

    // Extract type
    if (text.includes('ganhei') || text.includes('recebi') || text.includes('salario')) {
        setType('receita');
        setCategoryId(categories.find(c => c.name === 'Salário')?.id || '');
    }

    // Extract description (crude but fast)
    const words = quickInput.split(' ');
    if (words.length > 2) setDescription(quickInput);

    setQuickInput('');
  };

  const handleSave = () => {
    const numValue = parseFloat(value.replace(',', '.'));
    if (!numValue || numValue <= 0 || !categoryId || !accountId) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type,
      value: numValue,
      description,
      categoryId,
      accountId,
      date: new Date().toISOString(),
      recurring: isRecurring,
      recurrenceType: isRecurring ? 'mensal' : 'única',
      status,
      assignedTo,
      paidBy,
      createdBy: currentUser as 'Junior' | 'Rosângela',
      paymentMethod: accounts.find(a => a.id === accountId)?.type || 'dinheiro',
    };

    addTransaction(newTransaction);
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 animate-in slide-in-from-right duration-300 overflow-hidden">
      {/* Header */}
      <div className={`p-6 pb-12 text-white transition-colors duration-500 shadow-lg ${type === 'receita' ? 'bg-emerald-600' : 'bg-red-600'}`}>
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-2xl font-light p-2 -m-2">✕</button>
          <h1 className="text-lg font-bold">Novo Lançamento</h1>
          <button onClick={handleSave} className="font-bold text-xs bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/20">SALVAR</button>
        </div>

        <div className="flex justify-center space-x-2 mb-6">
           <button 
             onClick={() => { setType('despesa'); setStatus('pago'); }}
             className={`px-6 py-2 rounded-full text-[10px] font-bold border transition-all ${type === 'despesa' ? 'bg-white text-red-600 border-white' : 'border-white/40 text-white'}`}
           >
             DESPESA
           </button>
           <button 
             onClick={() => { setType('receita'); setStatus('pago'); }}
             className={`px-6 py-2 rounded-full text-[10px] font-bold border transition-all ${type === 'receita' ? 'bg-white text-emerald-600 border-white' : 'border-white/40 text-white'}`}
           >
             RECEITA
           </button>
        </div>

        <div className="text-center relative py-4">
          <span className="text-xl absolute left-4 top-1/2 -translate-y-1/2 opacity-60">R$</span>
          <input 
            type="text" 
            placeholder="0,00"
            className="bg-transparent text-6xl font-black w-full text-center outline-none placeholder:text-white/30"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/[^0-9,.]/g, ''))}
            autoFocus
          />
        </div>
      </div>

      {/* Quick Input Bar */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center">
        <input 
          type="text" 
          placeholder="Diga: 'mercado 32 junior'..."
          className="flex-1 bg-transparent text-xs outline-none dark:text-gray-300"
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && parseQuickInput()}
        />
        <button onClick={parseQuickInput} className="text-blue-600 font-bold text-[10px] ml-2">PARSAR</button>
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl -mt-6 p-6 space-y-6 flex-1 shadow-2xl overflow-y-auto no-scrollbar">
        <div>
          <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">O que foi isso?</label>
          <input 
            type="text" 
            placeholder="Ex: Mercado da semana, Netflix..."
            className="w-full border-b border-gray-100 dark:border-gray-800 py-3 outline-none text-gray-800 dark:text-gray-200 bg-transparent"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">Quem pagou?</label>
            <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-xl">
              <button 
                onClick={() => setPaidBy('Junior')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${paidBy === 'Junior' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-300' : 'text-gray-400'}`}
              >
                Junior
              </button>
              <button 
                onClick={() => setPaidBy('Rosângela')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${paidBy === 'Rosângela' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-300' : 'text-gray-400'}`}
              >
                Rosângela
              </button>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">Para quem?</label>
            <select 
              className="w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl text-xs border-none outline-none dark:text-gray-300"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value as UserOwner)}
            >
              <option value="Casa">Casa 🏠</option>
              <option value="Junior">Junior 👨</option>
              <option value="Rosângela">Rosângela 👩</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 block">Categoria</label>
          <div className="grid grid-cols-4 gap-2">
            {categories.filter(c => c.type === type || c.type === 'ambos').map(cat => (
              <button 
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-2xl border-2 transition-all ${categoryId === cat.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent opacity-60'}`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[8px] font-black text-center leading-tight uppercase tracking-tighter dark:text-gray-300">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <div className="flex items-center space-x-3">
             <span className="text-xl">💳</span>
             <div>
               <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Status</p>
               <p className="text-[10px] text-gray-400">{status === 'pago' ? 'Confirmado' : 'Agendar pagamento'}</p>
             </div>
          </div>
          <button 
            onClick={() => setStatus(status === 'pago' ? 'pendente' : 'pago')}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-colors ${status === 'pago' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
          >
            {status.toUpperCase()}
          </button>
        </div>
      </div>
      
      <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800">
         <button 
           onClick={handleSave}
           className={`w-full py-4 rounded-2xl font-black text-white shadow-xl active:scale-95 transition-all uppercase tracking-widest ${type === 'receita' ? 'bg-emerald-600 shadow-emerald-200 dark:shadow-none' : 'bg-red-600 shadow-red-200 dark:shadow-none'}`}
         >
           Confirmar R$ {value || '0,00'}
         </button>
      </div>
    </div>
  );
};

export default AddTransaction;
