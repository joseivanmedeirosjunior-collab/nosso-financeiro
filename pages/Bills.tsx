
import React, { useMemo } from 'react';
import { useAppStore } from '../store';
import { Transaction } from '../types';

const Bills: React.FC = () => {
  const { transactions, updateTransaction, categories } = useAppStore();

  const pendingBills = useMemo(() => {
    return transactions
      .filter(t => t.status === 'pendente')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transactions]);

  const totalPending = useMemo(() => {
    return pendingBills.reduce((acc, t) => acc + t.value, 0);
  }, [pendingBills]);

  const handlePay = (t: Transaction) => {
    updateTransaction(t.id, { status: 'pago', paidAt: new Date().toISOString() });
  };

  return (
    <div className="p-6 pb-20 bg-gray-50 min-h-full">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contas a Pagar</h1>
          <p className="text-xs text-gray-500">Controle seus vencimentos</p>
        </div>
        <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-center">
          <p className="text-[10px] font-bold uppercase">Total</p>
          <p className="text-sm font-bold">R$ {totalPending.toLocaleString('pt-BR')}</p>
        </div>
      </header>

      <div className="space-y-4">
        {pendingBills.length === 0 ? (
          <div className="text-center py-20">
             <div className="text-5xl mb-4">🎉</div>
             <p className="text-gray-500 font-medium">Tudo em dia por aqui!</p>
          </div>
        ) : (
          pendingBills.map(bill => {
            const cat = categories.find(c => c.id === bill.categoryId);
            return (
              <div key={bill.id} className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-amber-400 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${cat?.color}`}>
                     {cat?.icon}
                   </div>
                   <div>
                     <h3 className="text-sm font-bold text-gray-800">{bill.description || cat?.name}</h3>
                     <p className="text-[10px] text-gray-400">Vencimento: {new Date(bill.date).toLocaleDateString('pt-BR')}</p>
                   </div>
                </div>
                <div className="text-right flex flex-col items-end">
                   <p className="text-sm font-bold text-red-600 mb-2">R$ {bill.value.toLocaleString('pt-BR')}</p>
                   <button 
                     onClick={() => handlePay(bill)}
                     className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md"
                   >
                     PAGO
                   </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default Bills;
