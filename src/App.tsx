import React, { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { ToastProvider, useToast } from './components/common/ToastContext';
import { Navbar, type NavTab } from './components/common/Navbar';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { PedidosTable } from './components/table/PedidosTable';
import { EntregadoresView } from './components/entregadores/EntregadoresView';
import { FechamentoCaixaView } from './components/caixa/FechamentoCaixaView';
import { DashboardMetrics } from './components/metrics/DashboardMetrics';
import { DespacharModal } from './components/modals/DespacharModal';
import {
  ConfirmActionModal,
  type ActionModalType,
} from './components/modals/ConfirmActionModal';
import { CadastrarEntregadorModal } from './components/modals/CadastrarEntregadorModal';
import { ApiConfigModal } from './components/modals/ApiConfigModal';
import {
  apiService,
  getErrorMessage,
  isMockEnabled,
  setMockEnabled,
} from './services/api';
import type { Pedido, Entregador } from './types';
import { formatCurrency, formatCPF } from './utils/formatters';
import { AlertTriangle, Database, RefreshCw } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

function GasDeliveryApp() {
  const toast = useToast();
  const qc = useQueryClient();

  const [currentTab, setCurrentTab] = useState<NavTab>('kanban');

  // Modals state
  const [despacharPedido, setDespacharPedido] = useState<Pedido | null>(null);
  const [cadastrarEntregadorOpen, setCadastrarEntregadorOpen] = useState(false);
  const [apiConfigOpen, setApiConfigOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: ActionModalType;
    title: string;
    description: string;
    pedidoId?: number;
    extraDetails?: React.ReactNode;
    confirmText?: string;
    action: () => Promise<void>;
  }>({
    isOpen: false,
    type: 'cancelar',
    title: '',
    description: '',
    action: async () => {},
  });

  // Queries
  const {
    data: pedidos = [],
    isLoading: isLoadingPedidos,
    isFetching: isFetchingPedidos,
    error: pedidosError,
    refetch: refetchPedidos,
  } = useQuery({
    queryKey: ['pedidos'],
    queryFn: () => apiService.getPedidos(),
    // Sem polling automático — o funcionário clica em "Atualizar" quando precisar
  });

  const {
    data: entregadores = [],
    refetch: refetchEntregadores,
  } = useQuery({
    queryKey: ['entregadores'],
    queryFn: () => apiService.getEntregadores(),
  });

  const {
    data: entregadoresAtivos = [],
  } = useQuery({
    queryKey: ['entregadores-ativos'],
    queryFn: () => apiService.getEntregadoresAtivos(),
  });

  const {
    data: caixaMap = {},
    isLoading: isLoadingCaixa,
    refetch: refetchCaixa,
  } = useQuery({
    queryKey: ['caixa-do-dia'],
    queryFn: () => apiService.getCaixaDoDia(),
  });

  const refreshAll = () => {
    refetchPedidos();
    refetchEntregadores();
    refetchCaixa();
    qc.invalidateQueries({ queryKey: ['entregadores-ativos'] });
    toast.info('Pedidos e entregadores atualizados.', 'Atualizado');
  };

  // Helper para invalidar e recarregar
  const invalidateAndRefresh = async () => {
    qc.invalidateQueries({ queryKey: ['pedidos'] });
    qc.invalidateQueries({ queryKey: ['entregadores'] });
    qc.invalidateQueries({ queryKey: ['entregadores-ativos'] });
    qc.invalidateQueries({ queryKey: ['caixa-do-dia'] });
    await Promise.all([
      refetchPedidos(),
      refetchEntregadores(),
      refetchCaixa(),
    ]);
  };

  // ---- AÇÕES DO FLUXO DE NEGÓCIOS ----

  // Fluxo 2: Aprovar CPF
  const handleAprovarCpf = (pedido: Pedido) => {
    setConfirmModal({
      isOpen: true,
      type: 'aprovar-cpf',
      title: 'Aprovar Benefício Gás do Povo?',
      description: `Confirma que o cliente tem direito ao benefício social? O status do pedido mudará para PENDENTE e o cliente receberá confirmação no WhatsApp.`,
      pedidoId: pedido.id,
      extraDetails: (
        <div>
          <div>
            <strong>Cliente:</strong> {pedido.cliente.nome}
          </div>
          <div>
            <strong>CPF:</strong> {formatCPF(pedido.cliente.cpf)}
          </div>
          <div>
            <strong>Endereço:</strong> {pedido.enderecoEntrega}
          </div>
        </div>
      ),
      confirmText: 'Aprovar CPF',
      action: async () => {
        try {
          await apiService.aprovarCpf(pedido.id);
          toast.success(
            `CPF de ${pedido.cliente.nome} aprovado com sucesso! O pedido está pronto para despacho.`,
            'Benefício Aprovado'
          );
          invalidateAndRefresh();
        } catch (err) {
          toast.error(getErrorMessage(err), 'Erro ao Aprovar');
        }
      },
    });
  };

  // Fluxo 2: Reprovar CPF
  const handleReprovarCpf = (pedido: Pedido) => {
    setConfirmModal({
      isOpen: true,
      type: 'reprovar-cpf',
      title: 'Reprovar Benefício Gás do Povo?',
      description: `Atenção: Ao reprovar o CPF, o pedido será encerrado com status CPF_REPROVADO e o cliente receberá uma notificação no WhatsApp informando que o benefício foi negado.`,
      pedidoId: pedido.id,
      extraDetails: (
        <div>
          <div>
            <strong>Cliente:</strong> {pedido.cliente.nome}
          </div>
          <div>
            <strong>CPF:</strong> {formatCPF(pedido.cliente.cpf)}
          </div>
        </div>
      ),
      confirmText: 'Sim, Reprovar CPF',
      action: async () => {
        try {
          await apiService.reprovarCpf(pedido.id);
          toast.warning(
            `CPF do cliente ${pedido.cliente.nome} foi reprovado. Mensagem de encerramento enviada.`,
            'CPF Reprovado'
          );
          invalidateAndRefresh();
        } catch (err) {
          toast.error(getErrorMessage(err), 'Erro ao Reprovar');
        }
      },
    });
  };

  // Fluxo 1: Despachar Pedido
  const handleOpenDespachar = (pedido: Pedido) => {
    setDespacharPedido(pedido);
  };

  const handleConfirmDespachar = async (pedidoId: number, entregadorId: number) => {
    try {
      await apiService.despacharPedido(pedidoId, entregadorId);
      const motoboy = entregadores.find((e) => e.id === entregadorId);
      toast.success(
        `Pedido #${pedidoId} despachado com sucesso para ${motoboy?.nome || 'o entregador'}! WhatsApp enviado ao cliente.`,
        'Pedido em Rota'
      );
      invalidateAndRefresh();
    } catch (err) {
      toast.error(getErrorMessage(err), 'Erro ao Despachar');
      throw err;
    }
  };

  // Fluxo 1: Marcar Entregue
  const handleMarcarEntregue = (pedido: Pedido) => {
    const isDinheiroOuCartao =
      pedido.formaPagamento === 'DINHEIRO' ||
      pedido.formaPagamento.startsWith('CARTAO');

    setConfirmModal({
      isOpen: true,
      type: 'entregue',
      title: 'Confirmar Conclusão da Entrega?',
      description: `Confirma que o botijão foi entregue ao cliente? ${
        isDinheiroOuCartao
          ? `O valor de ${formatCurrency(pedido.valorTotal)} será somado ao caixa físico do entregador ${
              pedido.entregador?.nome || ''
            }.`
          : 'Pagamento via PIX confirmado na conta da empresa.'
      }`,
      pedidoId: pedido.id,
      confirmText: 'Sim, Marcar Entregue',
      action: async () => {
        try {
          await apiService.marcarEntregue(pedido.id);
          toast.success(
            `Pedido #${pedido.id} finalizado! Cliente agradecido via WhatsApp.`,
            'Entrega Concluída'
          );
          invalidateAndRefresh();
        } catch (err) {
          toast.error(getErrorMessage(err), 'Erro ao Finalizar');
        }
      },
    });
  };

  // Fluxo 3: Cancelar Pedido
  const handleCancelarPedido = (pedido: Pedido) => {
    setConfirmModal({
      isOpen: true,
      type: 'cancelar',
      title: 'Deseja Cancelar este Pedido?',
      description: `O pedido #${pedido.id} de ${pedido.cliente.nome} será marcado como CANCELADO e uma notificação de cancelamento será enviada ao cliente.`,
      pedidoId: pedido.id,
      confirmText: 'Sim, Cancelar Pedido',
      action: async () => {
        try {
          await apiService.cancelarPedido(pedido.id);
          toast.info(
            `Pedido #${pedido.id} cancelado com sucesso.`,
            'Pedido Cancelado'
          );
          invalidateAndRefresh();
        } catch (err) {
          toast.error(getErrorMessage(err), 'Erro ao Cancelar');
        }
      },
    });
  };

  // Entregadores handlers
  const handleCadastrarEntregador = async (data: { nome: string; telefone: string }) => {
    try {
      const novo = await apiService.cadastrarEntregador(data);
      qc.setQueryData<Entregador[]>(['entregadores'], (old) =>
        old ? [...old, novo] : [novo]
      );
      qc.setQueryData<Entregador[]>(['entregadores-ativos'], (old) =>
        old ? [...old, novo] : [novo]
      );
      toast.success(
        `Entregador ${data.nome} cadastrado com sucesso!`,
        'Cadastro Realizado'
      );
      await invalidateAndRefresh();
    } catch (err) {
      toast.error(getErrorMessage(err), 'Erro no Cadastro');
      throw err;
    }
  };

  const handleAtivarEntregador = (entregador: Entregador) => {
    setConfirmModal({
      isOpen: true,
      type: 'ativar-entregador',
      title: 'Ativar Entregador?',
      description: `Deseja ativar o entregador "${entregador.nome}"? Ele voltará a ficar disponível para receber novos despachos de botijões.`,
      confirmText: 'Sim, Ativar Entregador',
      action: async () => {
        try {
          await apiService.ativarEntregador(entregador.id);
          qc.setQueryData<Entregador[]>(['entregadores'], (old) =>
            old ? old.map((e) => (e.id === entregador.id ? { ...e, ativo: true } : e)) : []
          );
          qc.setQueryData<Entregador[]>(['entregadores-ativos'], (old) =>
            old ? (old.some((e) => e.id === entregador.id) ? old : [...old, { ...entregador, ativo: true }]) : [{ ...entregador, ativo: true }]
          );
          toast.success(
            `Entregador ${entregador.nome} ativado e disponível para despachos!`,
            'Entregador Ativado'
          );
          await invalidateAndRefresh();
        } catch (err) {
          toast.error(getErrorMessage(err), 'Erro ao Ativar');
        }
      },
    });
  };

  const handleDesativarEntregador = (entregador: Entregador) => {
    setConfirmModal({
      isOpen: true,
      type: 'inativar-entregador',
      title: 'Inativar Entregador?',
      description: `Atenção: Ao inativar o entregador "${entregador.nome}", ele não aparecerá na lista de motoboys para novos despachos até ser reativado.`,
      confirmText: 'Sim, Inativar Entregador',
      action: async () => {
        try {
          await apiService.desativarEntregador(entregador.id);
          qc.setQueryData<Entregador[]>(['entregadores'], (old) =>
            old ? old.map((e) => (e.id === entregador.id ? { ...e, ativo: false } : e)) : []
          );
          qc.setQueryData<Entregador[]>(['entregadores-ativos'], (old) =>
            old ? old.filter((e) => e.id !== entregador.id) : []
          );
          toast.info(
            `Entregador ${entregador.nome} foi inativado.`,
            'Entregador Inativado'
          );
          await invalidateAndRefresh();
        } catch (err) {
          toast.error(getErrorMessage(err), 'Erro ao Inativar');
        }
      },
    });
  };

  const handleExcluirEntregador = (entregador: Entregador) => {
    const pedidosAtivos = pedidos.filter(
      (p) => p.status === 'DESPACHADO' && p.entregador?.id === entregador.id
    );

    if (pedidosAtivos.length > 0) {
      toast.warning(
        `Não é possível excluir ${entregador.nome} pois ele possui ${pedidosAtivos.length} pedido(s) em rota na rua. Finalize ou cancele as entregas antes de excluí-lo.`,
        'Entregas em Andamento'
      );
      return;
    }

    setConfirmModal({
      isOpen: true,
      type: 'excluir-entregador',
      title: 'Excluir Cadastro do Entregador?',
      description: `Atenção: Esta ação é definitiva e removerá "${entregador.nome}" do sistema. Se desejar apenas pausar temporariamente as corridas dele, prefira usar a opção "Inativar".`,
      confirmText: 'Sim, Excluir Cadastro',
      action: async () => {
        try {
          await apiService.excluirEntregador(entregador.id);
          
          // Remove imediatamente da tela/estado local
          qc.setQueryData<Entregador[]>(['entregadores'], (old) =>
            old ? old.filter((e) => e.id !== entregador.id) : []
          );
          qc.setQueryData<Entregador[]>(['entregadores-ativos'], (old) =>
            old ? old.filter((e) => e.id !== entregador.id) : []
          );

          toast.success(
            `Entregador ${entregador.nome} excluído com sucesso!`,
            'Cadastro Excluído'
          );
          await invalidateAndRefresh();
        } catch (err) {
          toast.error(getErrorMessage(err), 'Erro ao Excluir');
        }
      },
    });
  };

  const handleSwitchToMock = () => {
    setMockEnabled(true);
    refreshAll();
    toast.info('Modo Simulação ativado! Agora você pode testar todas as funcionalidades.');
  };

  // Contadores para o header
  const pedidosAguardando = pedidos.filter(
    (p) => p.status === 'AGUARDANDO_VALIDACAO_CPF'
  ).length;
  const pedidosProntos = pedidos.filter((p) => p.status === 'PENDENTE').length;

  const isOffline = !!pedidosError && !isMockEnabled();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        pedidosCountAguardando={pedidosAguardando}
        pedidosCountProntos={pedidosProntos}
        isFetching={isFetchingPedidos}
        onRefresh={refreshAll}
        onOpenSettings={() => setApiConfigOpen(true)}
      />

      {/* Alerta caso o backend não esteja respondendo */}
      {isOffline && (
        <div className="bg-amber-500 text-white px-4 py-3 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 font-medium">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>
                <strong>Atenção:</strong> Não foi possível conectar ao servidor backend em{' '}
                <code className="bg-amber-700/60 px-1 py-0.5 rounded font-mono">
                  http://localhost:8080
                </code>
                . O backend do seu primo ainda não foi iniciado na máquina.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSwitchToMock}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-amber-900 font-bold rounded-xl shadow-xs hover:bg-amber-50 transition active:scale-95 text-xs"
              >
                <Database className="w-4 h-4 text-amber-700" />
                <span>Ativar Modo Demonstração (Testar Agora)</span>
              </button>
              <button
                onClick={() => refetchPedidos()}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                title="Tentar reconectar"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {isLoadingPedidos && pedidos.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4" />
            <h3 className="font-bold text-slate-800 text-lg">Carregando painel de entregas...</h3>
            <p className="text-xs text-slate-500 mt-1">
              Conectando aos serviços do Brasil Gás
            </p>
          </div>
        ) : (
          <>
            {currentTab === 'kanban' && (
              <KanbanBoard
                pedidos={pedidos}
                onAprovarCpf={handleAprovarCpf}
                onReprovarCpf={handleReprovarCpf}
                onDespachar={handleOpenDespachar}
                onMarcarEntregue={handleMarcarEntregue}
                onCancelar={handleCancelarPedido}
              />
            )}

            {currentTab === 'tabela' && (
              <PedidosTable
                pedidos={pedidos}
                onAprovarCpf={handleAprovarCpf}
                onReprovarCpf={handleReprovarCpf}
                onDespachar={handleOpenDespachar}
                onMarcarEntregue={handleMarcarEntregue}
                onCancelar={handleCancelarPedido}
              />
            )}

            {currentTab === 'entregadores' && (
              <EntregadoresView
                entregadores={entregadores}
                onOpenCadastrarModal={() => setCadastrarEntregadorOpen(true)}
                onAtivar={handleAtivarEntregador}
                onDesativar={handleDesativarEntregador}
                onExcluir={handleExcluirEntregador}
              />
            )}

            {currentTab === 'caixa' && (
              <FechamentoCaixaView
                caixaMap={caixaMap}
                entregadores={entregadores}
                pedidos={pedidos}
                onRefresh={refreshAll}
                isLoading={isLoadingCaixa}
              />
            )}

            {currentTab === 'metricas' && (
              <DashboardMetrics
                pedidos={pedidos}
                entregadores={entregadores}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <DespacharModal
        pedido={despacharPedido}
        entregadoresAtivos={entregadoresAtivos}
        isLoading={false}
        onClose={() => setDespacharPedido(null)}
        onConfirm={handleConfirmDespachar}
      />

      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        title={confirmModal.title}
        description={confirmModal.description}
        pedidoId={confirmModal.pedidoId}
        extraDetails={confirmModal.extraDetails}
        confirmText={confirmModal.confirmText}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.action}
      />

      <CadastrarEntregadorModal
        isOpen={cadastrarEntregadorOpen}
        onClose={() => setCadastrarEntregadorOpen(false)}
        onConfirm={handleCadastrarEntregador}
      />

      <ApiConfigModal
        isOpen={apiConfigOpen}
        onClose={() => setApiConfigOpen(false)}
        onSaved={refreshAll}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <GasDeliveryApp />
      </ToastProvider>
    </QueryClientProvider>
  );
}
