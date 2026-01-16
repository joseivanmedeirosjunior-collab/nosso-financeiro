
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/orcamentos', label: 'Metas', icon: '🎯' },
    { path: '/contas', label: 'Fixas', icon: '🔁' },
    { path: '/relatorios', label: 'Gráficos', icon: '📈' },
    { path: '/config', label: 'Ajustes', icon: '⚙️' },
  ];

  const hideNav = location.pathname === '/add' || location.pathname === '/settlement';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 max-w-md mx-auto relative shadow-2xl overflow-hidden selection:bg-blue-100">
      <main className={`flex-1 ${hideNav ? '' : 'pb-24'} overflow-y-auto no-scrollbar`}>
        {children}
      </main>
      
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-700 flex justify-around items-center px-2 py-4 safe-bottom z-50 max-w-md mx-auto rounded-t-[40px] shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center space-y-1.5 transition-all w-16 ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-300 dark:text-gray-600'
                }`}
              >
                <span className={`text-xl transition-transform ${isActive ? 'scale-125' : 'scale-100'}`}>{item.icon}</span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default Layout;
