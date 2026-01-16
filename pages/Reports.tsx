
import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppStore } from '../store';

const Reports: React.FC = () => {
  const { transactions, categories } = useAppStore();
  const [filterUser, setFilterUser] = useState<'Todos' | 'Junior' | 'Rosângela' | 'Casa'>('Todos');
  const currentMonth = new Date().toISOString().slice(0, 7);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const isMonth = t.date.startsWith(currentMonth);
      const isUser = filterUser === 'Todos' || t.assignedTo === filterUser;
      return isMonth && isUser;
    });
  }, [transactions, currentMonth, filterUser]);

  const monthExpenses = useMemo(() => {
    return filteredTransactions.filter(t => t.type === 'despesa');
  }, [filteredTransactions]);

  const pieData = useMemo(() => {
    const grouped = monthExpenses.reduce((acc, t) => {
      const cat = categories.find(c => c.id === t.categoryId);
      const name = cat?.name || 'Outros';
      acc[name] = (acc[name] || 0) + t.value;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(grouped).map(name => ({
      name,
      value: grouped[name]
    })).sort((a,b) => b.value - a.value);
  }, [monthExpenses, categories]);

  const dailyAvg = useMemo(() => {
    const total = monthExpenses.reduce((acc, t) => acc + t.value, 0);
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    return total / daysInMonth;
  }, [monthExpenses]);

  const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="p-6 pb-20 dark:bg-gray-900 transition-colors overflow-x-hidden">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-gray-800 dark:text-white">Análise de Gastos</h1>
        <div className="flex space-x-2 mt-4 overflow-x-auto no-scrollbar py-1">
          {['Todos', 'Junior', 'Rosângela', 'Casa'].map(u => (
            <button 
              key={u}
              onClick={() => setFilterUser(u as any)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all flex-shrink-0 ${filterUser === u ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-700'}`}
            >
              {u}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Média Diária</p>
              <p className="text-xl font-black text-gray-800 dark:text-white">R$ {dailyAvg.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
           </div>
           <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Mês</p>
              <p className="text-xl font-black text-red-500">R$ {monthExpenses.reduce((a,b) => a+b.value, 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
           </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700">
           <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Divisão por Categoria</h2>
           <div className="h-64 relative">
              {pieData.length > 0 ? (
                <>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Top Gasto</span>
                    <span className="text-sm font-black text-gray-800 dark:text-white">{pieData[0].name}</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        animationDuration={1500}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR')}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-xs italic">Sem dados suficientes</div>
              )}
           </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
           <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 flex justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Maiores Gastos</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor</span>
           </div>
           <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
             {pieData.map((item, idx) => (
               <div key={item.name} className="p-4 flex justify-between items-center group active:bg-blue-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-bold">{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white font-black">R$ {item.value.toLocaleString('pt-BR')}</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
