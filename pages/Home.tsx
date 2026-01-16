
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Transaction } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, categories, currentUser, updateTransaction, deleteTransaction } = useAppStore();
  const [monthFilter, setMonthFilter] = useState(new Date().toISOString().slice(0, 7));
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => t.date.startsWith(monthFilter))
      .filter(t => 
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        categories.find(c => c.id === t.categoryId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [transactions, monthFilter, searchTerm, categories]);

  const summary = useMemo(() => {
    const receitas = filteredTransactions
      .filter(t => t.type === 'receita')
      .reduce((acc, t) => acc + t.value, 0);
    const despesas = filteredTransactions
      .filter(t => t.type === 'despesa')
      .reduce((acc, t) => acc + t.value, 0);
    return { receitas, despesas, saldo: receitas - despesas };
  }, [filteredTransactions]);

  const toggleStatus = (t: Transaction) => {
    updateTransaction(t.id, { 
      status: t.status === 'pago' ? 'pendente' : 'pago',
      paidAt: t.status === 'pendente' ? new Date().toISOString() : undefined
    });
  };

  const duplicateTransaction = (t: Transaction) => {
    const newT = { ...t, id: crypto.randomUUID(), date: new Date().toISOString() };
    navigate('/add', { state: { transaction: newT } });
  };

  const shortcuts = [
    { name: 'Mercado', icon: '🛒', cat: 'Mercado' },
    { name: 'Comida', icon: '🍔', cat: 'Alimentação' },
    { name: 'Combustível', icon: '⛽', cat: 'Combustível' },
    { name: 'Contas', icon: '🏠', cat: 'Contas Casa' },
  ];

  return (
    <div className="flex flex-col dark:bg-gray-900 transition-colors">
      <div className="bg-blue-600 dark:bg-blue-800 text-white p-6 pb-20 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <h1 className="text-sm font-medium opacity-80">Olá, {currentUser}! 👋</h1>
            <p className="text-xl font-bold">Nosso Controle</p>
          </div>
          <div className="flex bg-white/20 rounded-full px-4 py-2 items-center space-x-2 backdrop-blur-md">
             <span className="text-xs font-medium">{monthFilter}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 relative z-10">
          <div className="text-center p-2 rounded-xl bg-white/10 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-wider opacity-80">Receitas</p>
            <p className="text-sm font-bold text-emerald-300">R$ {summary.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/10 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-wider opacity-80">Despesas</p>
            <p className="text-sm font-bold text-red-300">R$ {summary.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/20 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-wider opacity-80">Saldo</p>
            <p className="text-sm font-bold text-white">R$ {summary.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-12 space-y-6 relative z-20 pb-10">
        {/* Quick Search & Voice */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-3 flex items-center border border-gray-100 dark:border-gray-700">
          <span className="ml-2 mr-3 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar ou ditar..."
            className="flex-1 bg-transparent text-sm outline-none dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={() => navigate('/add', { state: { voiceEntry: true } })}
            className="w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            🎤
          </button>
        </div>

        {/* Shortcuts */}
        <div className="flex justify-between space-x-2 overflow-x-auto no-scrollbar py-1">
          {shortcuts.map(s => (
            <button 
              key={s.name}
              onClick={() => {
                const catId = categories.find(c => c.name.includes(s.cat))?.id;
                navigate('/add', { state: { initialCategory: catId, description: s.name } });
              }}
              className="flex-shrink-0 bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center space-y-1 active:bg-blue-50 transition-colors"
            >
              <span className="text-xl">{s.icon}</span>
              <span className="text-[10px] font-bold text-gray-500">{s.name}</span>
            </button>
          ))}
          <Link 
            to="/settlement" 
            className="flex-shrink-0 bg-amber-50 dark:bg-amber-900/30 px-4 py-3 rounded-2xl shadow-sm border border-amber-100 dark:border-amber-700 flex flex-col items-center space-y-1"
          >
            <span className="text-xl">🤝</span>
            <span className="text-[10px] font-bold text-amber-600">Acerto</span>
          </Link>
        </div>

        {/* Transactions List */}
        <div>
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Lançamentos</h2>
            <Link to="/relatorios" className="text-xs text-blue-600 font-medium">Análise completa</Link>
          </div>

          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-400 border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-3xl mb-2">🍃</p>
                Nenhum lançamento encontrado.
              </div>
            ) : (
              filteredTransactions.map(t => {
                const cat = categories.find(c => c.id === t.categoryId);
                return (
                  <div key={t.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center shadow-sm border border-gray-100 dark:border-gray-700 group hover:border-blue-200 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${cat?.color || 'bg-gray-100'}`}>
                      {cat?.icon || '❓'}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                           <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-none">{t.description || cat?.name}</h3>
                           <p className="text-[10px] text-gray-400 mt-1">
                             {new Date(t.date).toLocaleDateString('pt-BR')} • {t.paidBy} ➔ {t.assignedTo}
                           </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${t.type === 'receita' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {t.type === 'receita' ? '+' : '-'} R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <div className="flex space-x-2 mt-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => duplicateTransaction(t)} className="text-[8px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">DUPLICAR</button>
                            <button onClick={() => deleteTransaction(t.id)} className="text-[8px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">EXCLUIR</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleStatus(t)}
                      className={`ml-4 w-6 h-6 rounded-md border flex items-center justify-center text-xs transition-colors ${
                        t.status === 'pago' ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 dark:border-gray-600 text-transparent'
                      }`}
                    >
                      ✓
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <Link 
        to="/add" 
        className="fixed bottom-24 right-6 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-blue-700 transition-all active:scale-90 z-50 ring-4 ring-white dark:ring-gray-900"
      >
        <span className="text-4xl font-light">+</span>
      </Link>
    </div>
  );
};

export default Home;
