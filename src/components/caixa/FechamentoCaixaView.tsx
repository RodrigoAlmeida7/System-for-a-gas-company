import React from 'react';
import type { Entregador, Pedido } from '../../types';
import { formatCurrency, formatPhone } from '../../utils/formatters';
import {
  Wallet,
  Printer,
  Coins,
  CreditCard,
  Building,
  Info,
  Bike,
} from 'lucide-react';

interface FechamentoCaixaViewProps {
  caixaMap: Record<string, number>;
  entregadores: Entregador[];
  pedidos: Pedido[];
  onRefresh: () => void;
  isLoading: boolean;
}

export const FechamentoCaixaView: React.FC<FechamentoCaixaViewProps> = ({
  caixaMap,
  entregadores,
  pedidos,
  onRefresh,
  isLoading,
}) => {
  // Pedidos entregues no dia
  const pedidosEntregues = pedidos.filter((p) => p.status === 'ENTREGUE');

  // Total acumulado em dinheiro e cartão por todos os motoboys
  const totalFisicoGeral = Object.values(caixaMap).reduce(
    (acc, val) => acc + (val || 0),
    0
  );

  // Total recebido via PIX (cai direto na conta bancária)
  const totalPix = pedidosEntregues
    .filter((p) => p.formaPagamento === 'PIX')
    .reduce((acc, p) => acc + p.valorTotal, 0);

  // Total geral faturado
  const totalGeralDia = totalFisicoGeral + totalPix;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-600" />
            Fechamento de Caixa do Dia (Acerto Físico)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Conferência dos valores recebidos em Dinheiro e Cartão por cada entregador no expediente.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition"
          >
            {isLoading ? 'Atualizando...' : 'Recarregar Caixa'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Acerto</span>
          </button>
        </div>
      </div>

      {/* Informativo de Regra de Negócio */}
      <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start gap-3.5 text-xs text-blue-900">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Regra de Acerto de Contas: </strong>
          O valor calculado para o motoboy contempla exclusivamente entregas finalizadas (
          <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-800 font-mono">ENTREGUE</code>)
          com pagamento em <strong>Dinheiro</strong> ou <strong>Cartão (Maquininha)</strong>.
          Valores recebidos por <strong>PIX</strong> caem de forma instantânea na conta bancária da distribuidora e <em>não entram na cobrança do entregador</em>.
        </div>
      </div>

      {/* Resumo Consolidado do Dia */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Físico (Dinheiro + Cartão)
            </span>
            <Coins className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700">
            {formatCurrency(totalFisicoGeral)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            A ser recolhido fisicamente dos entregadores hoje.
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-teal-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-teal-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Recebido via PIX (Conta)
            </span>
            <Building className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-teal-700">
            {formatCurrency(totalPix)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Depositado direto na conta da empresa.
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Faturamento Total Entregue
            </span>
            <CreditCard className="w-5 h-5 text-slate-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {formatCurrency(totalGeralDia)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Soma de todos os {pedidosEntregues.length} pedidos entregues.
          </div>
        </div>
      </div>

      {/* Tabela de Acerto por Entregador */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Bike className="w-4 h-4 text-slate-600" />
            Acerto Individual por Motoboy
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {entregadores.map((motoboy) => {
            const valorCaixa = caixaMap[String(motoboy.id)] ?? 0;
            const entregasDoMotoboy = pedidosEntregues.filter(
              (p) => p.entregador?.id === motoboy.id
            );

            return (
              <div key={motoboy.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                      <Bike className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        {motoboy.nome}
                        {!motoboy.ativo && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                            Inativo
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {formatPhone(motoboy.telefone)} • ID #{motoboy.id}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
                    <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      Valor a Prestar Contas
                    </div>
                    <div className="text-2xl font-black text-emerald-700">
                      {formatCurrency(valorCaixa)}
                    </div>
                  </div>
                </div>

                {/* Detalhamento das entregas deste motoboy */}
                {entregasDoMotoboy.length > 0 ? (
                  <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-200/60">
                    <div className="text-xs font-bold text-slate-600 mb-2">
                      Entregas Concluídas Hoje ({entregasDoMotoboy.length}):
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {entregasDoMotoboy.map((p) => {
                        const isPix = p.formaPagamento === 'PIX';
                        return (
                          <div
                            key={p.id}
                            className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-slate-800">
                                #{p.id} • {p.cliente.nome}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {p.formaPagamento} {isPix && '(Não entra no caixa)'}
                              </div>
                            </div>
                            <div className="font-bold text-slate-900">
                              {formatCurrency(p.valorTotal)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    Nenhuma entrega finalizada para este entregador hoje.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
