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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total de Pedidos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total de Pedidos
            </span>
            <Package className="w-5 h-5 text-slate-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {totalPedidos}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Registrados no sistema hoje.
          </div>
        </div>

        {/* Análise de CPF */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Triagem de CPF
            </span>
            <AlertCircle className="w-5 h-5 text-slate-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {pedidosCpf.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Gás do Povo aguardando aprovação.
          </div>
        </div>

        {/* Prontos p/ Despacho */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Prontos para Despacho
            </span>
            <Clock className="w-5 h-5 text-slate-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {pedidosPendentes.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Aguardando vincular entregador.
          </div>
        </div>

        {/* Na Rua / Em Rota */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Entregas em Rota
            </span>
            <Bike className="w-5 h-5 text-slate-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {pedidosNaRua.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Na rua com os motoboys.
          </div>
        </div>

        {/* Pedidos Entregues */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Entregas Concluídas
            </span>
            <CheckCircle className="w-5 h-5 text-slate-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {pedidosEntregues.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Botijões entregues com sucesso.
          </div>
        </div>

        {/* Faturamento */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Faturamento Concluído
            </span>
            <DollarSign className="w-5 h-5 text-slate-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {formatCurrency(faturamentoTotal)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Total recebido dos pedidos entregues.
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
