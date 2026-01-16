
import React from 'react';
import { Category, Account } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Alimentação', type: 'despesa', icon: '🍔', color: 'bg-orange-500' },
  { id: '2', name: 'Mercado', type: 'despesa', icon: '🛒', color: 'bg-green-600' },
  { id: '3', name: 'Transporte', type: 'despesa', icon: '🚗', color: 'bg-blue-500' },
  { id: '4', name: 'Contas Casa', type: 'despesa', icon: '🏠', color: 'bg-purple-600' },
  { id: '5', name: 'Saúde', type: 'despesa', icon: '🏥', color: 'bg-red-500' },
  { id: '6', name: 'Lazer', type: 'despesa', icon: '🎭', color: 'bg-yellow-500' },
  { id: '7', name: 'Assinaturas', type: 'despesa', icon: '📺', color: 'bg-indigo-500' },
  { id: '8', name: 'Investimentos', type: 'despesa', icon: '📈', color: 'bg-teal-600' },
  { id: '9', name: 'Salário', type: 'receita', icon: '💰', color: 'bg-emerald-500' },
  { id: '10', name: 'Extra', type: 'receita', icon: '💵', color: 'bg-lime-500' },
  { id: '11', name: 'Outros', type: 'ambos', icon: '📦', color: 'bg-gray-400' },
];

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'a1', name: 'Dinheiro (Casa)', type: 'dinheiro', owner: 'Casa', initialBalance: 0 },
  { id: 'a2', name: 'Nubank (Junior)', type: 'pix', owner: 'Junior', initialBalance: 0 },
  { id: 'a3', name: 'Nubank (Rosângela)', type: 'pix', owner: 'Rosângela', initialBalance: 0 },
  { id: 'a4', name: 'Cartão (Junior)', type: 'crédito', owner: 'Junior', initialBalance: 0 },
  { id: 'a5', name: 'Cartão (Rosângela)', type: 'crédito', owner: 'Rosângela', initialBalance: 0 },
];
