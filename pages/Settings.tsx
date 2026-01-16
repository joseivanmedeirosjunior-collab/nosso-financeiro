
import React from 'react';
import { useAppStore } from '../store';

const Settings: React.FC = () => {
  const { currentUser, setCurrentUser, categories, accounts, theme, setTheme } = useAppStore();

  const handleExport = () => {
    const data = {
        transactions: localStorage.getItem('nc_transactions'),
        budgets: localStorage.getItem('nc_budgets'),
        settlements: localStorage.getItem('nc_settlements')
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nosso-controle-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  return (
    <div className="p-6 pb-20 dark:bg-gray-900 transition-colors">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-gray-800 dark:text-white">Ajustes</h1>
        <p className="text-sm text-gray-500">Configurações do Lar</p>
      </header>

      <div className="space-y-8">
        {/* User Selection */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Perfil Ativo</h2>
          <div className="flex space-x-3">
             {['Junior', 'Rosângela'].map(u => (
               <button 
                key={u}
                onClick={() => setCurrentUser(u as any)}
                className={`flex-1 py-4 rounded-3xl border-2 transition-all font-black text-sm ${
                  currentUser === u ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-50 dark:border-gray-700 text-gray-300 dark:text-gray-600'
                }`}
               >
                 {u}
               </button>
             ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center">
           <div>
              <p className="text-sm font-black text-gray-800 dark:text-white">Modo Escuro</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Cansa menos a vista</p>
           </div>
           <button 
             onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
             className={`w-14 h-8 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'}`}
           >
             <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all flex items-center justify-center text-[10px] shadow-md ${theme === 'dark' ? 'left-7' : 'left-1'}`}>
               {theme === 'dark' ? '🌙' : '☀️'}
             </div>
           </button>
        </div>

        {/* Action List */}
        <div className="bg-white dark:bg-gray-800 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-50 dark:divide-gray-700/50">
           <button className="w-full p-5 flex items-center justify-between text-left group">
              <div className="flex items-center space-x-4">
                <span className="text-xl">📊</span>
                <span className="text-sm font-black text-gray-700 dark:text-gray-300 group-active:text-blue-600">Categorias</span>
              </div>
              <span className="text-gray-300">›</span>
           </button>
           <button className="w-full p-5 flex items-center justify-between text-left group">
              <div className="flex items-center space-x-4">
                <span className="text-xl">💳</span>
                <span className="text-sm font-black text-gray-700 dark:text-gray-300 group-active:text-blue-600">Minhas Contas</span>
              </div>
              <span className="text-gray-300">›</span>
           </button>
           <button 
            onClick={handleExport}
            className="w-full p-5 flex items-center justify-between text-left group"
           >
              <div className="flex items-center space-x-4">
                <span className="text-xl">📥</span>
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">Exportar Backup (.json)</span>
              </div>
              <span className="text-blue-200">›</span>
           </button>
        </div>

        <div className="text-center space-y-1 py-4 opacity-40">
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-800 dark:text-white">Nosso Controle Turbo v2.0</p>
           <p className="text-[9px] font-bold text-gray-400">Desenvolvido para Junior & Rosângela</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
