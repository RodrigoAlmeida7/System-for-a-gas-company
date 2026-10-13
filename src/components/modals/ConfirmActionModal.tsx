import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Check, Power, Trash2 } from 'lucide-react';
import { useLockBodyScroll } from '../../utils/useLockBodyScroll';

export type ActionModalType =
  | 'aprovar-cpf'
  | 'reprovar-cpf'
  | 'cancelar'
  | 'entregue'
  | 'ativar-entregador'
  | 'inativar-entregador'
  | 'excluir-entregador';

interface ConfirmActionModalProps {
  isOpen: boolean;
  type: ActionModalType;
  title: string;
  description: string;
  pedidoId?: number;
  extraDetails?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  type,
  title,
  description,
  pedidoId,
  extraDetails,
  confirmText,
  cancelText = 'Cancelar',
  onClose,
  onConfirm,
}) => {
  useLockBodyScroll(isOpen);

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await onConfirm();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const config = {
    'aprovar-cpf': {
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
      bgIcon: 'bg-emerald-100',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
      defaultConfirm: 'Sim, Aprovar Benefício',
    },
    'reprovar-cpf': {
      icon: <XCircle className="w-8 h-8 text-rose-600" />,
      bgIcon: 'bg-rose-100',
      btnColor: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
      defaultConfirm: 'Sim, Reprovar CPF',
    },
    'cancelar': {
      icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
      bgIcon: 'bg-amber-100',
      btnColor: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
      defaultConfirm: 'Sim, Cancelar Pedido',
    },
    'entregue': {
      icon: <Check className="w-8 h-8 text-emerald-600" />,
      bgIcon: 'bg-emerald-100',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
      defaultConfirm: 'Confirmar Entrega',
    },
    'ativar-entregador': {
      icon: <Power className="w-8 h-8 text-emerald-600" />,
      bgIcon: 'bg-emerald-100',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
      defaultConfirm: 'Sim, Ativar Entregador',
    },
    'inativar-entregador': {
      icon: <Power className="w-8 h-8 text-rose-600" />,
      bgIcon: 'bg-rose-100',
      btnColor: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
      defaultConfirm: 'Sim, Inativar Entregador',
    },
    'excluir-entregador': {
      icon: <Trash2 className="w-8 h-8 text-rose-600" />,
      bgIcon: 'bg-rose-100',
      btnColor: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
      defaultConfirm: 'Sim, Excluir Cadastro',
    },
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-2xl ${config.bgIcon} shrink-0`}>
              {config.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">{title}</h3>
              {pedidoId && (
                <span className="text-xs font-semibold text-slate-500">
                  Pedido #{pedidoId}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-4">{description}</p>

          {extraDetails && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs mb-4">
              {extraDetails}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting}
              className={`px-5 py-2.5 text-sm font-bold rounded-xl shadow-md transition active:scale-95 disabled:opacity-50 ${config.btnColor}`}
            >
              {submitting ? 'Processando...' : confirmText || config.defaultConfirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
