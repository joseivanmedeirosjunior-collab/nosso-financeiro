
import { useState, useEffect } from 'react';
import { Transaction, Budget, Account, Category, UserOwner, FixedBill, Settlement } from './types';
import { DEFAULT_CATEGORIES, DEFAULT_ACCOUNTS } from './constants';

export function useAppStore() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('nc_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('nc_budgets');
    return saved ? JSON.parse(saved) : [];
  });

  const [fixedBills, setFixedBills] = useState<FixedBill[]>(() => {
    const saved = localStorage.getItem('nc_fixed_bills');
    return saved ? JSON.parse(saved) : [];
  });

  const [settlements, setSettlements] = useState<Settlement[]>(() => {
    const saved = localStorage.getItem('nc_settlements');
    return saved ? JSON.parse(saved) : [];
  });

  const [accounts] = useState<Account[]>(DEFAULT_ACCOUNTS);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [currentUser, setCurrentUser] = useState<UserOwner>(() => {
      return (localStorage.getItem('nc_user') as UserOwner) || 'Junior';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('nc_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('nc_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('nc_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('nc_fixed_bills', JSON.stringify(fixedBills));
  }, [fixedBills]);

  useEffect(() => {
    localStorage.setItem('nc_settlements', JSON.stringify(settlements));
  }, [settlements]);

  useEffect(() => {
    localStorage.setItem('nc_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nc_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  };

  const updateTransaction = (id: string, updated: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addBudget = (b: Budget) => {
      setBudgets(prev => [...prev.filter(x => x.categoryId !== b.categoryId || x.monthYear !== b.monthYear || x.owner !== b.owner), b]);
  };

  const addFixedBill = (fb: FixedBill) => {
    setFixedBills(prev => [...prev, fb]);
  };

  const removeFixedBill = (id: string) => {
    setFixedBills(prev => prev.filter(b => b.id !== id));
  };

  const addSettlement = (s: Settlement) => {
    setSettlements(prev => [...prev, s]);
  };

  return {
    transactions,
    budgets,
    fixedBills,
    settlements,
    accounts,
    categories,
    currentUser,
    setCurrentUser,
    theme,
    setTheme,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    addFixedBill,
    removeFixedBill,
    addSettlement
  };
}
