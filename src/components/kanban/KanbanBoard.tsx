import React, { useState, useMemo } from 'react';
import type { Pedido } from '../../types';
import { PedidoCard } from './PedidoCard';
import {
  Search,
  Flame,
  CheckCircle2,
  Clock,
  Bike,
  Archive,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface KanbanBoardProps {
  pedidos: Pedido[];
  onAprovarCpf: (pedido: Pedido) => void;
  onReprovarCpf: (pedido: Pedido) => void;
  onDespachar: (pedido: Pedido) => void;
  onMarcarEntregue: (pedido: Pedido) => void;
  onCancelar: (pedido: Pedido) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  pedidos,
  onAprovarCpf,
  onReprovarCpf,
  onDespachar,
  onMarcarEntregue,
  onCancelar,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'GAS_DO_POVO' | 'NORMAL'>('ALL');

  // Filtragem dos pedidos
  const filteredPedidos = useMemo(() => {
    return pedidos.filter((pedido) => {
      const matchSearch =
        pedido.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.cliente.telefone.includes(searchTerm) ||
        (pedido.cliente.cpf && pedido.cliente.cpf.includes(searchTerm)) ||
        pedido.enderecoEntrega.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(pedido.id).includes(searchTerm);

      const matchType =
        filterType === 'ALL' || pedido.tipoPedido === filterType;

      return matchSearch && matchType;
    });
  }, [pedidos, searchTerm, filterType]);

  // Agrupamento em colunas conforme o fluxo de negócio
  const colValidacaoCpf = useMemo(
    () => filteredPedidos.filter((p) => p.status === 'AGUARDANDO_VALIDACAO_CPF'),
    [filteredPedidos]
  );

  const colProntoDespacho = useMemo(
    () => filteredPedidos.filter((p) => p.status === 'PENDENTE'),
    [filteredPedidos]
  );

  const colNaRua = useMemo(
    () => filteredPedidos.filter((p) => p.status === 'DESPACHADO'),
    [filteredPedidos]
  );

  const colFinalizados = useMemo(
    () =>
      filteredPedidos.filter(
        (p) =>
          p.status === 'ENTREGUE' ||
          p.status === 'CPF_REPROVADO' ||
          p.status === 'CANCELADO'
      ),
    [filteredPedidos]
  );

  return (
    <div className="space-y-4">
      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, telefone, CPF, endereço ou #ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Tipo:</span>
          </div>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterType === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({pedidos.length})
          </button>
          <button
            onClick={() => setFilterType('GAS_DO_POVO')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterType === 'GAS_DO_POVO'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Gás do Povo
          </button>
          <button
            onClick={() => setFilterType('NORMAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterType === 'NORMAL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Normal
          </button>
        </div>
      </div>

      {/* Grid de Colunas Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {/* Coluna 1: Análise de CPF */}
        <div className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-col min-h-[580px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shadow-xs">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Análise de CPF</h3>
                <p className="text-[11px] text-slate-500 font-medium">Benefício Gás do Povo</p>
              </div>
            </div>
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center">
              {colValidacaoCpf.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[720px] pr-1">
            {colValidacaoCpf.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-dashed border-slate-200 text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mb-1" />
                <p className="text-xs font-medium">Nenhum CPF pendente de análise!</p>
              </div>
            ) : (
              colValidacaoCpf.map((pedido) => (
                <PedidoCard
                  key={pedido.id}
                  pedido={pedido}
                  onAprovarCpf={onAprovarCpf}
                  onReprovarCpf={onReprovarCpf}
                  onDespachar={onDespachar}
                  onMarcarEntregue={onMarcarEntregue}
                  onCancelar={onCancelar}
                />
              ))
            )}
          </div>
        </div>

        {/* Coluna 2: Prontos p/ Despacho */}
        <div className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-col min-h-[580px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Para Despachar</h3>
                <p className="text-[11px] text-slate-500 font-medium">Aguardando motoboy</p>
              </div>
            </div>
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center">
              {colProntoDespacho.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[720px] pr-1">
            {colProntoDespacho.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-dashed border-slate-200 text-slate-400">
                <Clock className="w-8 h-8 text-slate-300 mb-1" />
                <p className="text-xs font-medium">Nenhum pedido aguardando despacho!</p>
              </div>
            ) : (
              colProntoDespacho.map((pedido) => (
                <PedidoCard
                  key={pedido.id}
                  pedido={pedido}
                  onAprovarCpf={onAprovarCpf}
                  onReprovarCpf={onReprovarCpf}
                  onDespachar={onDespachar}
                  onMarcarEntregue={onMarcarEntregue}
                  onCancelar={onCancelar}
                />
              ))
            )}
          </div>
        </div>

        {/* Coluna 3: Na Rua (Em Rota) */}
        <div className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-col min-h-[580px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shadow-xs">
                <Bike className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Na Rua (Em Rota)</h3>
                <p className="text-[11px] text-slate-500 font-medium">Com o entregador</p>
              </div>
            </div>
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center">
              {colNaRua.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[720px] pr-1">
            {colNaRua.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-dashed border-slate-200 text-slate-400">
                <Bike className="w-8 h-8 text-slate-300 mb-1" />
                <p className="text-xs font-medium">Nenhuma entrega em rota agora.</p>
              </div>
            ) : (
              colNaRua.map((pedido) => (
                <PedidoCard
                  key={pedido.id}
                  pedido={pedido}
                  onAprovarCpf={onAprovarCpf}
                  onReprovarCpf={onReprovarCpf}
                  onDespachar={onDespachar}
                  onMarcarEntregue={onMarcarEntregue}
                  onCancelar={onCancelar}
                />
              ))
            )}
          </div>
        </div>

        {/* Coluna 4: Finalizados / Concluídos */}
        <div className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-col min-h-[580px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shadow-xs">
                <Archive className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Finalizados</h3>
                <p className="text-[11px] text-slate-500 font-medium">Entregues e encerrados</p>
              </div>
            </div>
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center">
              {colFinalizados.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[720px] pr-1">
            {colFinalizados.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-dashed border-slate-200 text-slate-400">
                <Archive className="w-8 h-8 text-slate-300 mb-1" />
                <p className="text-xs font-medium">Nenhum pedido finalizado ainda.</p>
              </div>
            ) : (
              colFinalizados.map((pedido) => (
                <PedidoCard
                  key={pedido.id}
                  pedido={pedido}
                  onAprovarCpf={onAprovarCpf}
                  onReprovarCpf={onReprovarCpf}
                  onDespachar={onDespachar}
                  onMarcarEntregue={onMarcarEntregue}
                  onCancelar={onCancelar}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
