import React from 'react';
import type { Pedido, Entregador } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  TrendingUp,
  CheckCircle,
  Clock,
  Bike,
  Package,
  AlertCircle,
  DollarSign,
  Truck,
} from 'lucide-react';

interface DashboardMetricsProps {
  pedidos: Pedido[];
  entregadores?: Entregador[];
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  pedidos,
}) => {
  // KPIs
  const totalPedidos = pedidos.length;
  const pedidosEntregues = pedidos.filter((p) => p.status === 'ENTREGUE');
  const pedidosPendentes = pedidos.filter((p) => p.status === 'PENDENTE');
  const pedidosNaRua = pedidos.filter((p) => p.status === 'DESPACHADO');
  const pedidosCpf = pedidos.filter((p) => p.status === 'AGUARDANDO_VALIDACAO_CPF');
  const pedidosCancelados = pedidos.filter(
    (p) => p.status === 'CANCELADO' || p.status === 'CPF_REPROVADO'
  );

  const faturamentoTotal = pedidosEntregues.reduce((acc, p) => acc + p.valorTotal, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Indicadores e Resumo Operacional
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Acompanhe o volume do atendimento, entregas em andamento e valores do dia.
          </p>
        </div>
      </div>

      {/* Grid de Cards de Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total de Pedidos */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total de Pedidos
            </span>
            <div className="text-3xl font-black text-slate-900 mt-2">{totalPedidos}</div>
            <p className="text-xs text-slate-500 mt-1">Registrados no sistema hoje</p>
          </div>
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Análise de CPF */}
        <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Triagem de CPF
            </span>
            <div className="text-3xl font-black text-amber-700 mt-2">{pedidosCpf.length}</div>
            <p className="text-xs text-amber-700 mt-1">Gás do Povo aguardando aprovação</p>
          </div>
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Prontos p/ Despacho */}
        <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
              Prontos para Despacho
            </span>
            <div className="text-3xl font-black text-blue-700 mt-2">{pedidosPendentes.length}</div>
            <p className="text-xs text-blue-600 mt-1">Aguardando vincular entregador</p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Na Rua / Em Rota */}
        <div className="bg-white p-6 rounded-2xl border border-purple-200 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
              Entregas em Rota
            </span>
            <div className="text-3xl font-black text-purple-700 mt-2">{pedidosNaRua.length}</div>
            <p className="text-xs text-purple-600 mt-1">Na rua com os motoboys</p>
          </div>
          <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
            <Bike className="w-6 h-6" />
          </div>
        </div>

        {/* Pedidos Entregues */}
        <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Entregas Concluídas
            </span>
            <div className="text-3xl font-black text-emerald-700 mt-2">{pedidosEntregues.length}</div>
            <p className="text-xs text-emerald-600 mt-1">Botijões entregues com sucesso</p>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Faturamento */}
        <div className="bg-white p-6 rounded-2xl border border-green-300 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-green-800">
              Faturamento Concluído
            </span>
            <div className="text-3xl font-black text-green-700 mt-2">
              {formatCurrency(faturamentoTotal)}
            </div>
            <p className="text-xs text-green-600 mt-1">Total recebido dos pedidos entregues</p>
          </div>
          <div className="p-3 bg-green-100 text-green-700 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Resumo Rápido da Operação */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-slate-500" />
          Status Geral da Operação Hoje
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="text-slate-500 font-medium">Pedidos em Andamento:</div>
            <div className="text-xl font-bold text-slate-800 mt-1">
              {pedidosPendentes.length + pedidosNaRua.length + pedidosCpf.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Ainda precisam ser despachados ou concluídos
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="text-slate-500 font-medium">Taxa de Conclusão:</div>
            <div className="text-xl font-bold text-slate-800 mt-1">
              {totalPedidos > 0
                ? `${Math.round((pedidosEntregues.length / totalPedidos) * 100)}%`
                : '0%'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Dos pedidos criados hoje já foram finalizados
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="text-slate-500 font-medium">Cancelados / Reprovados:</div>
            <div className="text-xl font-bold text-slate-800 mt-1">
              {pedidosCancelados.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Pedidos que foram cancelados ou tiveram CPF negado
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
