import type { OrderStatus, OrderType, PaymentMethod } from '../types';

export function formatCurrency(value?: number | null): string {
  if (value === undefined || value === null) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatPhone(phone?: string | null): string {
  if (!phone) return '-';
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 13 && clean.startsWith('55')) {
    const ddd = clean.substring(2, 4);
    const num = clean.substring(4);
    return `(${ddd}) ${num.slice(0, 5)}-${num.slice(5)}`;
  }
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }
  return phone;
}

export function formatCPF(cpf?: string | null): string {
  if (!cpf) return 'Não informado';
  const clean = cpf.replace(/\D/g, '');
  if (clean.length === 11) {
    return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`;
  }
  return cpf;
}

export function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatTimeAgo(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins === 1) return 'Há 1 min';
    if (diffMins < 60) return `Há ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return 'Há 1 hora';
    if (diffHours < 24) return `Há ${diffHours}h`;
    
    return formatDateTime(dateStr);
  } catch {
    return '';
  }
}

export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; badgeClass: string; borderClass: string; bgLight: string }
> = {
  AGUARDANDO_VALIDACAO_CPF: {
    label: 'Aguardando CPF',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    borderClass: 'border-amber-400',
    bgLight: 'bg-amber-50/60',
  },
  PENDENTE: {
    label: 'Pronto p/ Despacho',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    borderClass: 'border-blue-400',
    bgLight: 'bg-blue-50/60',
  },
  DESPACHADO: {
    label: 'Na Rua (Em Rota)',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    borderClass: 'border-purple-400',
    bgLight: 'bg-purple-50/60',
  },
  ENTREGUE: {
    label: 'Entregue',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    borderClass: 'border-emerald-400',
    bgLight: 'bg-emerald-50/60',
  },
  CPF_REPROVADO: {
    label: 'CPF Reprovado',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    borderClass: 'border-rose-400',
    bgLight: 'bg-rose-50/60',
  },
  CANCELADO: {
    label: 'Cancelado',
    badgeClass: 'bg-slate-200 text-slate-700 border-slate-300',
    borderClass: 'border-slate-300',
    bgLight: 'bg-slate-100/60',
  },
};

export const PAYMENT_METHOD_CONFIG: Record<
  PaymentMethod,
  { label: string; icon: string; badgeClass: string }
> = {
  DINHEIRO: {
    label: 'Dinheiro',
    icon: '💵',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  CARTAO_CREDITO: {
    label: 'Cartão de Crédito',
    icon: '💳',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  CARTAO_DEBITO: {
    label: 'Cartão de Débito',
    icon: '💳',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  PIX: {
    label: 'PIX',
    icon: '⚡',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
  },
};

export const ORDER_TYPE_CONFIG: Record<
  OrderType,
  { label: string; badgeClass: string }
> = {
  NORMAL: {
    label: 'Pedido Normal',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  GAS_DO_POVO: {
    label: 'Gás do Povo (Benefício)',
    badgeClass: 'bg-orange-100 text-orange-800 font-bold border-orange-300',
  },
};
