
import React, { useMemo } from 'react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';

const Settlement: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, currentUser } = useAppStore();
  const currentMonth = new Date().toISOString().slice(0, 7);

  const stats = useMemo(() => {
    let juniorOwes = 0;
    let rosangelaOwes = 0;

    transactions
      .filter(t => t.date.startsWith(currentMonth) && t.type === 'despesa')
      .forEach(t => {
        if (t.assignedTo === 'Casa') {
          // Shared expenses - each pays 50%
          if (t.paidBy === 'Junior') rosangelaOwes += t.value / 2;
          else juniorOwes += t.value / 2;
        } else if (t.assignedTo === 'Junior' && t.paidBy === 'Rosângela') {
          // Junior's personal expense paid by Rosângela
          juniorOwes += t.value;
        } else if (t.assignedTo === 'Rosângela' && t.paidBy === 'Junior') {
          // Rosângela's personal expense paid by Junior
          rosangelaOwes += t.value;
        }
      });

    const diff = juniorOwes - rosangelaOwes;
    return { juniorOwes, rosangelaOwes, diff };
  }, [transactions, currentMonth]);

  return (
    <div className="p-6 pb-20 dark:bg-gray-900 min-h-full">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="text-gray-400 mb-2">← Voltar</button>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white">Acerto do Mês</h1>
          <p className="text-sm text-gray-500">{currentMonth}</p>
        </div>
        <div className="text-4xl">🤝</div>
      </header>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Junior deve</p>
             <p className="text-lg font-black text-red-500">R$ {stats.juniorOwes.toLocaleString('pt-BR')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Rosângela deve</p>
             <p className="text-lg font-black text-emerald-500">R$ {stats.rosangelaOwes.toLocaleString('pt-BR')}</p>
          </div>
        </div>

        <div className="bg-blue-600 text-white p-8 rounded-[40px] text-center shadow-xl shadow-blue-200 dark:shadow-none relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400 to-transparent opacity-20"></div>
           <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Resultado Final</p>
           {stats.diff === 0 ? (
             <h2 className="text-2xl font-black">Ninguém deve nada! ✨</h2>
           ) : stats.diff > 0 ? (
             <>
               <h2 className="text-3xl font-black">Junior deve pagar</h2>
               <p className="text-5xl font-black mt-2">R$ {Math.abs(stats.diff).toLocaleString('pt-BR')}</p>
               <p className="text-sm font-medium mt-4 opacity-70">Para Rosângela</p>
             </>
           ) : (
             <>
               <h2 className="text-3xl font-black">Rosângela deve pagar</h2>
               <p className="text-5xl font-black mt-2">R$ {Math.abs(stats.diff).toLocaleString('pt-BR')}</p>
               <p className="text-sm font-medium mt-4 opacity-70">Para Junior</p>
             </>
           )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 space-y-4">
           <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-wider">Como funciona?</h3>
           <ul className="text-xs text-gray-500 space-y-3">
              <li className="flex items-start">
                <span className="mr-2">🏠</span>
                <span>Despesas <b>Compartilhadas</b> dividem o valor em 50% para cada.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">👤</span>
                <span>Despesas <b>Pessoais</b> pagas pelo outro somam 100% da dívida.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>O acerto é calculado subtraindo o que um pagou pelo outro.</span>
              </li>
           </ul>
        </div>
        
        <button 
          onClick={() => alert('Acerto registrado!')}
          className="w-full py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg active:scale-95 transition-all"
        >
          Marcar como Acertado
        </button>
      </div>
    </div>
  );
};

export default Settlement;
