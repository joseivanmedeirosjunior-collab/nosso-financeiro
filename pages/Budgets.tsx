
import React, { useMemo } from 'react';
import { useAppStore } from '../store';

const Budgets: React.FC = () => {
  const { transactions, budgets, categories, addBudget } = useAppStore();
  const currentMonth = new Date().toISOString().slice(0, 7);

  const budgetStats = useMemo(() => {
    return categories
      .filter(c => c.type !== 'receita')
      .map(cat => {
        const budget = budgets.find(b => b.categoryId === cat.id && b.monthYear === currentMonth);
        const spent = transactions
          .filter(t => t.categoryId === cat.id && t.date.startsWith(currentMonth) && t.type === 'despesa')
          .reduce((acc, t) => acc + t.value, 0);
        
        return {
          category: cat,
          limit: budget?.limit || 0,
          spent,
          percent: budget?.limit ? (spent / budget.limit) * 100 : 0
        };
      });
  }, [transactions, budgets, categories, currentMonth]);

  const handleSetBudget = (categoryId: string) => {
    const limitStr = prompt('Defina o limite mensal para esta categoria (R$):');
    if (limitStr) {
      const limit = parseFloat(limitStr.replace(',', '.'));
      if (!isNaN(limit)) {
        addBudget({
          id: crypto.randomUUID(),
          categoryId,
          limit,
          monthYear: currentMonth,
          owner: 'Casa',
          alertPercentage: 80
        });
      }
    }
  };

  return (
    <div className="p-6 pb-20">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Orçamentos</h1>
        <p className="text-sm text-gray-500">Mês de Referência: {currentMonth}</p>
      </header>

      <div className="space-y-6">
        {budgetStats.map(stat => (
          <div key={stat.category.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${stat.category.color}`}>
                  {stat.category.icon}
                </span>
                <div>
                   <h3 className="text-sm font-bold text-gray-800">{stat.category.name}</h3>
                   <p className="text-[10px] text-gray-400">R$ {stat.spent.toLocaleString('pt-BR')} de R$ {stat.limit > 0 ? stat.limit.toLocaleString('pt-BR') : 'Sem limite'}</p>
                </div>
              </div>
              <button 
                onClick={() => handleSetBudget(stat.category.id)}
                className="text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1 rounded-lg"
              >
                EDITAR
              </button>
            </div>

            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  stat.percent >= 100 ? 'bg-red-500' : stat.percent >= 80 ? 'bg-amber-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(stat.percent, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between mt-2">
               <span className="text-[10px] font-medium text-gray-400">{stat.percent.toFixed(0)}% utilizado</span>
               <span className="text-[10px] font-medium text-gray-400">R$ {Math.max(0, stat.limit - stat.spent).toLocaleString('pt-BR')} restante</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Budgets;
