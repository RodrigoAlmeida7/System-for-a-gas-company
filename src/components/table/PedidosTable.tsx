import React, { useState, useMemo } from 'react';
import type { Pedido } from '../../types';
import {
  formatCurrency,
  formatPhone,
  formatCPF,
  formatDateTime,
  STATUS_CONFIG,
  PAYMENT_METHOD_CONFIG,
} from '../../utils/formatters';
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  Send,
  Check,
  Ban,
  Bike,
  Flame,
} from 'lucide-react';

interface PedidosTableProps {
  pedidos: Pedido[];
  onAprovarCpf: (pedido: Pedido) => void;
  onReprovarCpf: (pedido: Pedido) => void;
  onDespachar: (pedido: Pedido) => void;
  onMarcarEntregue: (pedido: Pedido) => void;
  onCancelar: (pedido: Pedido) => void;
}

export const PedidosTable: React.FC<PedidosTableProps> = ({
  pedidos,
  onAprovarCpf,
  onReprovarCpf,
  onDespachar,
  onMarcarEntregue,
  onCancelar,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');

  const filteredPedidos = useMemo(() => {
    return pedidos.filter((pedido) => {
      const matchSearch =
        pedido.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.cliente.telefone.includes(searchTerm) ||
        (pedido.cliente.cpf && pedido.cliente.cpf.includes(searchTerm)) ||
        pedido.enderecoEntrega.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(pedido.id).includes(searchTerm);

      const matchStatus = statusFilter === 'ALL' || pedido.status === statusFilter;
      const matchType = typeFilter === 'ALL' || pedido.tipoPedido === typeFilter;
      const matchPayment = paymentFilter === 'ALL' || pedido.formaPagamento === paymentFilter;

      return matchSearch && matchStatus && matchType && matchPayment;
    });
  }, [pedidos, searchTerm, statusFilter, typeFilter, paymentFilter]);

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Cliente',
      'Telefone',
      'CPF',
      'Tipo',
      'Status',
      'Forma Pagamento',
      'Valor Total',
      'Entregador',
      'Endereço',
      'Data Criação',
    ];

    const rows = filteredPedidos.map((p) => [
      p.id,
      `"${p.cliente.nome.replace(/"/g, '""')}"`,
      p.cliente.telefone,
      p.cliente.cpf || '',
      p.tipoPedido,
      p.status,
      p.formaPagamento,
      p.valorTotal.toFixed(2),
      `"${p.entregador?.nome || ''}"`,
      `"${p.enderecoEntrega.replace(/"/g, '""')}"`,
      p.dataCriacao,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pedidos_brasil_gas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
      {/* Filtros e Ações */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, CPF, telefone ou ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="ALL">Todos os Status</option>
            <option value="AGUARDANDO_VALIDACAO_CPF">Aguardando CPF</option>
            <option value="PENDENTE">Pronto p/ Despacho (Pendente)</option>
            <option value="DESPACHADO">Despachado (Na Rua)</option>
            <option value="ENTREGUE">Entregue</option>
            <option value="CPF_REPROVADO">CPF Reprovado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="ALL">Todos os Tipos</option>
            <option value="GAS_DO_POVO">Gás do Povo</option>
            <option value="NORMAL">Normal</option>
          </select>

          {/* Payment filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="ALL">Todas Formas de Pgto</option>
            <option value="DINHEIRO">Dinheiro</option>
            <option value="PIX">PIX</option>
            <option value="CARTAO_CREDITO">Cartão Crédito</option>
            <option value="CARTAO_DEBITO">Cartão Débito</option>
          </select>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs active:scale-95"
            title="Exportar para CSV"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Cliente / Contato</th>
              <th className="py-3 px-4">Tipo & Benefício</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Pagamento & Valor</th>
              <th className="py-3 px-4">Entregador</th>
              <th className="py-3 px-4">Data / Hora</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPedidos.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  Nenhum pedido encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredPedidos.map((pedido) => {
                const statusConf = STATUS_CONFIG[pedido.status];
                const paymentConf = PAYMENT_METHOD_CONFIG[pedido.formaPagamento];
                const isGasDoPovo = pedido.tipoPedido === 'GAS_DO_POVO';

                return (
                  <tr
                    key={pedido.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      #{pedido.id}
                    </td>

                    {/* Cliente */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{pedido.cliente.nome}</div>
                      <div className="text-xs text-slate-500">
                        {formatPhone(pedido.cliente.telefone)}
                      </div>
                      {isGasDoPovo && pedido.cliente.cpf && (
                        <div className="text-[11px] text-orange-700 font-medium mt-0.5">
                          CPF: {formatCPF(pedido.cliente.cpf)}
                        </div>
                      )}
                    </td>

                    {/* Tipo */}
                    <td className="py-3 px-4">
                      {isGasDoPovo ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800 border border-orange-200">
                          <Flame className="w-3 h-3 text-orange-600" />
                          Gás do Povo
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-100 text-slate-700">
                          Normal
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg border ${statusConf.badgeClass}`}
                      >
                        {statusConf.label}
                      </span>
                    </td>

                    {/* Pagamento e Valor */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {formatCurrency(pedido.valorTotal)}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <span>{paymentConf.icon}</span>
                        <span>{paymentConf.label}</span>
                      </div>
                      {pedido.precisaTrocoPara && (
                        <div className="text-[10px] text-amber-700 font-medium">
                          Troco: {formatCurrency(pedido.precisaTrocoPara)}
                        </div>
                      )}
                    </td>

                    {/* Entregador */}
                    <td className="py-3 px-4">
                      {pedido.entregador ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-900">
                          <Bike className="w-3.5 h-3.5 text-purple-600" />
                          <span>{pedido.entregador.nome}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Não atribuído</span>
                      )}
                    </td>

                    {/* Data */}
                    <td className="py-3 px-4 text-xs text-slate-500">
                      {formatDateTime(pedido.dataCriacao)}
                    </td>

                    {/* Ações */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {pedido.status === 'AGUARDANDO_VALIDACAO_CPF' && (
                          <>
                            <button
                              onClick={() => onAprovarCpf(pedido)}
                              className="p-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg transition"
                              title="Aprovar CPF"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onReprovarCpf(pedido)}
                              className="p-1.5 bg-rose-100 text-rose-800 hover:bg-rose-200 rounded-lg transition"
                              title="Reprovar CPF"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {pedido.status === 'PENDENTE' && (
                          <button
                            onClick={() => onDespachar(pedido)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                            title="Despachar pedido"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Despachar</span>
                          </button>
                        )}

                        {pedido.status === 'DESPACHADO' && (
                          <button
                            onClick={() => onMarcarEntregue(pedido)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                            title="Marcar como entregue"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Entregue</span>
                          </button>
                        )}

                        {pedido.status !== 'ENTREGUE' &&
                          pedido.status !== 'CANCELADO' &&
                          pedido.status !== 'CPF_REPROVADO' && (
                            <button
                              onClick={() => onCancelar(pedido)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Cancelar pedido"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
