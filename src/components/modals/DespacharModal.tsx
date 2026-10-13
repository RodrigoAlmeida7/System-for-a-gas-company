import React, { useState } from 'react';
import type { Pedido, Entregador } from '../../types';
import { formatCurrency, formatPhone } from '../../utils/formatters';
import { Bike, X, MapPin, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useLockBodyScroll } from '../../utils/useLockBodyScroll';

interface DespacharModalProps {
  pedido: Pedido | null;
  entregadoresAtivos: Entregador[];
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (pedidoId: number, entregadorId: number) => Promise<void>;
}

export const DespacharModal: React.FC<DespacharModalProps> = ({
  pedido,
  entregadoresAtivos,
  isLoading,
  onClose,
  onConfirm,
}) => {
  useLockBodyScroll(!!pedido);

  const [selectedEntregadorId, setSelectedEntregadorId] = useState<number | null>(
    entregadoresAtivos.length > 0 ? entregadoresAtivos[0].id : null
  );
  const [submitting, setSubmitting] = useState(false);

  if (!pedido) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntregadorId) return;
    try {
      setSubmitting(true);
      await onConfirm(pedido.id, selectedEntregadorId);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Despachar Pedido #{pedido.id}</h3>
              <p className="text-blue-100 text-xs">Vincule um motoboy para levar o botijão</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Resumo do Pedido */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex items-start gap-2 text-slate-700">
              <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-900">{pedido.cliente.nome}</span>
                <span className="text-slate-500 text-xs ml-2">
                  ({formatPhone(pedido.cliente.telefone)})
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-600 leading-relaxed font-medium">
                {pedido.enderecoEntrega}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 text-xs font-medium">
              <span className="text-slate-500">Valor a cobrar:</span>
              <span className="font-bold text-slate-900 text-sm">
                {formatCurrency(pedido.valorTotal)}
                <span className="text-xs text-slate-500 font-normal ml-1">
                  ({pedido.formaPagamento})
                </span>
              </span>
            </div>

            {pedido.precisaTrocoPara && (
              <div className="bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between border border-amber-200">
                <span>⚠️ Levar troco para:</span>
                <span>{formatCurrency(pedido.precisaTrocoPara)}</span>
              </div>
            )}
          </div>

          {/* Seleção do Entregador */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Selecione o Entregador Disponível *
            </label>

            {entregadoresAtivos.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <div className="font-semibold">Nenhum entregador ativo no momento!</div>
                  <div className="text-xs text-amber-700">
                    Cadastre ou ative um entregador na aba "Gestão de Entregadores" para poder despachar este pedido.
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                {entregadoresAtivos.map((motoboy) => {
                  const isSelected = selectedEntregadorId === motoboy.id;
                  return (
                    <label
                      key={motoboy.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="entregador"
                          checked={isSelected}
                          onChange={() => setSelectedEntregadorId(motoboy.id)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            {motoboy.nome}
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatPhone(motoboy.telefone)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <span className="text-slate-400">Caixa hoje:</span>{' '}
                        <span className="font-semibold text-slate-700">
                          {formatCurrency(motoboy.caixaAtual || 0)}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="text-xs text-slate-500 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            💡 Ao confirmar o despacho, a API enviará automaticamente uma mensagem no WhatsApp do cliente informando que o entregador saiu para a entrega.
          </div>

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={submitting || isLoading || !selectedEntregadorId || entregadoresAtivos.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition active:scale-95 disabled:pointer-events-none"
            >
              {submitting ? (
                <span>Despachando...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirmar Despacho</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
