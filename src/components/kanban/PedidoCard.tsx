import React, { useState } from 'react';
import type { Pedido } from '../../types';
import {
  formatCurrency,
  formatPhone,
  formatCPF,
  formatTimeAgo,
  PAYMENT_METHOD_CONFIG,
} from '../../utils/formatters';
import {
  User,
  MapPin,
  Clock,
  Bike,
  Copy,
  Check,
  Send,
  CheckCircle,
  XCircle,
  Flame,
  PhoneCall,
  Banknote,
  Ban,
} from 'lucide-react';

interface PedidoCardProps {
  pedido: Pedido;
  onAprovarCpf: (pedido: Pedido) => void;
  onReprovarCpf: (pedido: Pedido) => void;
  onDespachar: (pedido: Pedido) => void;
  onMarcarEntregue: (pedido: Pedido) => void;
  onCancelar: (pedido: Pedido) => void;
}

export const PedidoCard: React.FC<PedidoCardProps> = ({
  pedido,
  onAprovarCpf,
  onReprovarCpf,
  onDespachar,
  onMarcarEntregue,
  onCancelar,
}) => {
  const [copiedCpf, setCopiedCpf] = useState(false);

  const handleCopyCpf = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pedido.cliente.cpf) {
      navigator.clipboard.writeText(pedido.cliente.cpf);
      setCopiedCpf(true);
      setTimeout(() => setCopiedCpf(false), 2000);
    }
  };

  const isGasDoPovo = pedido.tipoPedido === 'GAS_DO_POVO';
  const paymentInfo = PAYMENT_METHOD_CONFIG[pedido.formaPagamento];

  return (
    <div
      className={`group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border ${
        isGasDoPovo
          ? 'border-orange-200/80 hover:border-orange-300 ring-1 ring-orange-400/10'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Top badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
            #{pedido.id}
          </span>
          {isGasDoPovo ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs">
              <Flame className="w-3 h-3 fill-white" />
              Gás do Povo
            </span>
          ) : (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">
              Normal
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <Clock className="w-3 h-3" />
          <span>{formatTimeAgo(pedido.dataCriacao)}</span>
        </div>
      </div>

      {/* Cliente */}
      <div className="mb-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 leading-snug line-clamp-1">
                {pedido.cliente.nome}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{formatPhone(pedido.cliente.telefone)}</span>
                {pedido.cliente.telefone && (
                  <a
                    href={`https://wa.me/${pedido.cliente.telefone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Conversar no WhatsApp"
                    className="text-emerald-600 hover:text-emerald-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <PhoneCall className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Highlight de CPF no Gás do Povo */}
        {isGasDoPovo && pedido.cliente.cpf && (
          <div className="mt-2 p-2 bg-orange-50/80 border border-orange-200/90 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-orange-900 font-semibold">CPF: </span>
              <span className="font-mono font-bold text-orange-950">
                {formatCPF(pedido.cliente.cpf)}
              </span>
            </div>
            <button
              onClick={handleCopyCpf}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-orange-700 hover:bg-orange-100 rounded-lg transition"
              title="Copiar CPF"
            >
              {copiedCpf ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Endereço */}
      <div className="flex items-start gap-2 mb-3 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
        <span className="leading-snug line-clamp-2">{pedido.enderecoEntrega}</span>
      </div>

      {/* Entregador atribuído (se despachado ou entregue) */}
      {pedido.entregador && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-purple-50/70 border border-purple-200/70 rounded-xl text-xs text-purple-900">
          <Bike className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <div className="truncate">
            <span className="text-purple-700">Entregador: </span>
            <strong className="font-bold">{pedido.entregador.nome}</strong>
          </div>
        </div>
      )}

      {/* Financeiro e Pagamento */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mb-3 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] font-medium">TOTAL</span>
          <span className="font-bold text-slate-900 text-sm">
            {formatCurrency(pedido.valorTotal)}
          </span>
        </div>

        <div className="text-right">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-medium border text-[11px] ${paymentInfo.badgeClass}`}
          >
            <span>{paymentInfo.icon}</span>
            <span>{paymentInfo.label}</span>
          </span>
          {pedido.precisaTrocoPara && (
            <div className="text-[10px] font-semibold text-amber-700 mt-0.5 flex items-center justify-end gap-1">
              <Banknote className="w-3 h-3 text-amber-600" />
              Troco p/ {formatCurrency(pedido.precisaTrocoPara)}
            </div>
          )}
        </div>
      </div>

      {/* Ações contextuais conforme Seção 6 da Documentação */}
      <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100">
        {/* Status: AGUARDANDO_VALIDACAO_CPF */}
        {pedido.status === 'AGUARDANDO_VALIDACAO_CPF' && (
          <div className="w-full flex items-center gap-1.5">
            <button
              onClick={() => onAprovarCpf(pedido)}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition"
              title="Aprovar CPF para despacho"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Aprovar CPF</span>
            </button>
            <button
              onClick={() => onReprovarCpf(pedido)}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-2.5 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition"
              title="Reprovar CPF e encerrar pedido"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reprovar</span>
            </button>
            <button
              onClick={() => onCancelar(pedido)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              title="Cancelar Pedido"
            >
              <Ban className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Status: PENDENTE */}
        {pedido.status === 'PENDENTE' && (
          <div className="w-full flex items-center gap-1.5">
            <button
              onClick={() => onDespachar(pedido)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Despachar</span>
            </button>
            <button
              onClick={() => onCancelar(pedido)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              title="Cancelar Pedido"
            >
              <Ban className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Status: DESPACHADO */}
        {pedido.status === 'DESPACHADO' && (
          <div className="w-full flex items-center gap-1.5">
            <button
              onClick={() => onMarcarEntregue(pedido)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-500/20 transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Marcar Entregue</span>
            </button>
            <button
              onClick={() => onCancelar(pedido)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              title="Cancelar Pedido"
            >
              <Ban className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Status Finalizados: ENTREGUE, CPF_REPROVADO, CANCELADO */}
        {(pedido.status === 'ENTREGUE' ||
          pedido.status === 'CPF_REPROVADO' ||
          pedido.status === 'CANCELADO') && (
          <div className="w-full py-1 text-center text-xs font-semibold text-slate-400">
            {pedido.status === 'ENTREGUE' && '✓ Pedido finalizado com sucesso'}
            {pedido.status === 'CPF_REPROVADO' && '✕ Benefício negado (CPF reprovado)'}
            {pedido.status === 'CANCELADO' && '✕ Pedido cancelado'}
          </div>
        )}
      </div>
    </div>
  );
};
