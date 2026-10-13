import React from 'react';
import {
  Flame,
  LayoutGrid,
  Table as TableIcon,
  Bike,
  Wallet,
  BarChart3,
  RefreshCw,
  Settings,
  Database,
  Globe,
} from 'lucide-react';
import { isMockEnabled } from '../../services/api';

export type NavTab = 'kanban' | 'tabela' | 'entregadores' | 'caixa' | 'metricas';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pedidosCountAguardando: number;
  pedidosCountProntos: number;
  isFetching: boolean;
  onRefresh: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  pedidosCountAguardando,
  pedidosCountProntos,
  isFetching,
  onRefresh,
  onOpenSettings,
}) => {
  const isMock = isMockEnabled();
  const totalAtencao = pedidosCountAguardando + pedidosCountProntos;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-700 via-green-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-green-600/20 shrink-0">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <h1 className="font-extrabold text-xl text-slate-900 tracking-tight leading-none m-0">
              Brasil Gás
            </h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => onTabChange('kanban')}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                currentTab === 'kanban'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Painel de Pedidos</span>
              {totalAtencao > 0 && (
                <span
                  className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                    currentTab === 'kanban'
                      ? 'bg-white text-blue-700'
                      : 'bg-orange-500 text-white animate-pulse'
                  }`}
                >
                  {totalAtencao}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('tabela')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                currentTab === 'tabela'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Tabela & Histórico</span>
            </button>

            <button
              onClick={() => onTabChange('entregadores')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                currentTab === 'entregadores'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Entregadores</span>
            </button>

            <button
              onClick={() => onTabChange('caixa')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                currentTab === 'caixa'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Fechamento Caixa</span>
            </button>

            <button
              onClick={() => onTabChange('metricas')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                currentTab === 'metricas'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Métricas</span>
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Indicador de Modo Atual (apenas visualização) */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border cursor-default select-none ${
                isMock
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              {isMock ? (
                <>
                  <Database className="w-3.5 h-3.5 text-amber-600" />
                  <span>Modo Simulação</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>API Real</span>
                </>
              )}
            </div>

            {/* Refresh button */}
            <button
              onClick={onRefresh}
              className={`p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition active:scale-95 ${
                isFetching ? 'text-blue-600 bg-blue-50' : ''
              }`}
              title="Atualizar pedidos"
            >
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? 'animate-spin text-blue-600' : ''}`}
              />
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition active:scale-95"
              title="Configurações da API"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
