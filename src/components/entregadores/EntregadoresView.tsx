import React from 'react';
import type { Entregador } from '../../types';
import { formatCurrency, formatPhone } from '../../utils/formatters';
import {
  Bike,
  Plus,
  Power,
  Phone,
  Wallet,
  ShieldCheck,
  ShieldAlert,
  Trash2,
} from 'lucide-react';

interface EntregadoresViewProps {
  entregadores: Entregador[];
  onOpenCadastrarModal: () => void;
  onAtivar: (entregador: Entregador) => void;
  onDesativar: (entregador: Entregador) => void;
  onExcluir: (entregador: Entregador) => void;
}

export const EntregadoresView: React.FC<EntregadoresViewProps> = ({
  entregadores,
  onOpenCadastrarModal,
  onAtivar,
  onDesativar,
  onExcluir,
}) => {
  const totalAtivos = entregadores.filter((e) => e.ativo).length;
  const totalInativos = entregadores.length - totalAtivos;
  const totalCaixaGeral = entregadores.reduce(
    (acc, curr) => acc + (curr.caixaAtual || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Cards */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bike className="w-6 h-6 text-orange-500" />
            Gestão da Equipe de Entregadores
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Controle de motoboys, disponibilidade para despacho e saldos do dia.
          </p>
        </div>

        <button
          onClick={onOpenCadastrarModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Entregador</span>
        </button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">
              Entregadores Ativos
            </div>
            <div className="text-2xl font-black text-slate-900">{totalAtivos}</div>
            <div className="text-[11px] text-slate-500 font-medium">
              Prontos para receber despacho
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">
              Entregadores Inativos
            </div>
            <div className="text-2xl font-black text-slate-900">{totalInativos}</div>
            <div className="text-[11px] text-slate-500 font-medium">
              Ocultados no select de despacho
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">
              Caixa Físico Acumulado
            </div>
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(totalCaixaGeral)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Dinheiro e Cartão na rua
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Cards dos Entregadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entregadores.map((entregador) => {
          return (
            <div
              key={entregador.id}
              className={`bg-white rounded-2xl p-5 border transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
                entregador.ativo
                  ? 'border-slate-200 hover:border-blue-300'
                  : 'border-slate-200/60 bg-slate-50/70 opacity-75'
              }`}
            >
              <div>
                {/* Header card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        entregador.ativo
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <Bike className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 leading-tight">
                        {entregador.nome}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        ID #{entregador.id}
                      </span>
                    </div>
                  </div>

                  {entregador.ativo ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                      Inativo
                    </span>
                  )}
                </div>

                {/* Telefone */}
                <div className="space-y-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      Telefone / WhatsApp:
                    </span>
                    <span className="font-bold text-slate-800">
                      {formatPhone(entregador.telefone)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5" />
                      Caixa Acumulado Hoje:
                    </span>
                    <span className="font-bold text-emerald-700 text-sm">
                      {formatCurrency(entregador.caixaAtual || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão de Ativação / Desativação e Exclusão */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  {entregador.ativo ? 'Disponível' : 'Bloqueado'}
                </span>

                <div className="flex items-center gap-1.5">
                  {entregador.ativo ? (
                    <button
                      onClick={() => onDesativar(entregador)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition active:scale-95"
                      title="Inativar entregador"
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>Inativar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onAtivar(entregador)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition active:scale-95"
                      title="Ativar entregador"
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>Ativar</span>
                    </button>
                  )}

                  <button
                    onClick={() => onExcluir(entregador)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Excluir cadastro do entregador"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
