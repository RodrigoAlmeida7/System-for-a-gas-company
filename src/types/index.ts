export type OrderStatus =
  | 'AGUARDANDO_VALIDACAO_CPF'
  | 'PENDENTE'
  | 'DESPACHADO'
  | 'ENTREGUE'
  | 'CPF_REPROVADO'
  | 'CANCELADO';

export type OrderType = 'NORMAL' | 'GAS_DO_POVO';

export type PaymentMethod = 'DINHEIRO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'PIX';

export interface Cliente {
  id: number;
  telefone: string;
  nome: string;
  cpf?: string | null;
  enderecoPadrao?: string | null;
  dataCadastro?: string;
}

export interface Entregador {
  id: number;
  nome: string;
  telefone: string;
  ativo: boolean;
  caixaAtual?: number;
}

export interface Pedido {
  id: number;
  cliente: Cliente;
  status: OrderStatus;
  tipoPedido: OrderType;
  formaPagamento: PaymentMethod;
  precisaTrocoPara?: number | null;
  enderecoEntrega: string;
  valorTotal: number;
  dataCriacao: string;
  dataAtualizacao: string;
  entregador?: Entregador | null;
}

export type CaixaDiario = Record<string, number>;

export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
}
