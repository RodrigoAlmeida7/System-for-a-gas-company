import React, { useState } from 'react';
import { Bike, X, User, Phone, CheckCircle } from 'lucide-react';

interface CadastrarEntregadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { nome: string; telefone: string }) => Promise<void>;
}

export const CadastrarEntregadorModal: React.FC<CadastrarEntregadorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Máscara simples para telefone brasileiro: (XX) 9XXXX-XXXX
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.substring(0, 11);

    if (val.length <= 2) {
      setTelefone(val ? `(${val}` : '');
    } else if (val.length <= 7) {
      setTelefone(`(${val.slice(0, 2)}) ${val.slice(2)}`);
    } else {
      setTelefone(`(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nome.trim()) {
      setErrorMsg('Por favor, informe o nome do entregador.');
      return;
    }

    const digitsOnly = telefone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setErrorMsg('Informe um telefone válido com DDD (mínimo 10 dígitos).');
      return;
    }

    // A API espera o formato com 55 ou número completo (ex: 5581988887777)
    const formattedToApi = digitsOnly.startsWith('55') ? digitsOnly : `55${digitsOnly}`;

    try {
      setSubmitting(true);
      await onConfirm({
        nome: nome.trim(),
        telefone: formattedToApi,
      });
      setNome('');
      setTelefone('');
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao cadastrar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Novo Entregador</h3>
              <p className="text-orange-100 text-xs">Cadastre um motoboy para entregas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Nome Completo *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Carlos 'Veloz' Silva"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Telefone / WhatsApp *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={telefone}
                onChange={handleTelefoneChange}
                placeholder="(81) 98888-7777"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              O número será utilizado para o contato operacional e identificação.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg transition active:scale-95"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{submitting ? 'Salvando...' : 'Salvar Entregador'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
