
export type TransactionType = 'receita' | 'despesa';
export type UserOwner = 'Junior' | 'Rosângela' | 'Casa';
export type AccountType = 'dinheiro' | 'débito' | 'crédito' | 'pix';
export type RecurrenceType = 'mensal' | 'semanal' | 'anual' | 'única';
export type TransactionStatus = 'pago' | 'pendente';

export interface Category {
  id: string;
  name: string;
  type: 'receita' | 'despesa' | 'ambos';
  icon: string;
  color: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  owner: UserOwner;
  initialBalance: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  value: number;
  date: string;
  categoryId: string;
  accountId: string;
  description: string;
  recurring: boolean;
  recurrenceType: RecurrenceType;
  status: TransactionStatus;
  dueDate?: string;
  paidAt?: string;
  createdBy: 'Junior' | 'Rosângela';
  paidBy: 'Junior' | 'Rosângela';
  assignedTo: UserOwner;
  installments?: {
    current: number;
    total: number;
  };
  paymentMethod: AccountType;
  tags?: string[];
}

export interface Budget {
  id: string;
  monthYear: string; // YYYY-MM
  categoryId: string;
  limit: number;
  owner: UserOwner;
  alertPercentage: number;
}

export interface FixedBill {
  id: string;
  description: string;
  value: number;
  categoryId: string;
  accountId: string;
  assignedTo: UserOwner;
  dayOfMonth: number;
  active: boolean;
}

export interface Settlement {
  id: string;
  monthYear: string;
  from: 'Junior' | 'Rosângela';
  to: 'Junior' | 'Rosângela';
  amount: number;
  date: string;
}
