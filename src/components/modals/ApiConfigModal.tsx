import React, { useState } from 'react';
import { Settings, X, Globe, Database, CheckCircle, RefreshCw } from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, isMockEnabled, setMockEnabled, resetMockData } from '../../services/api';
import { useLockBodyScroll } from '../../utils/useLockBodyScroll';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  useLockBodyScroll(isOpen);

  const [url, setUrl] = useState(getApiBaseUrl());
  const [mockMode, setMockMode] = useState(isMockEnabled());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiBaseUrl(url.trim());
    setMockEnabled(mockMode);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSaved();
      onClose();
    }, 400);
  };

  const handleResetDemoData = () => {
    resetMockData();
    alert('Dados de demonstração restaurados para os valores padrão!');
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 rounded-xl">
              <Settings className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Configurações de Conexão</h3>
              <p className="text-slate-400 text-xs">Ajuste o endpoint da API do backend</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Configurações salvas com sucesso!
            </div>
          )}

          {/* Modo de Execução */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Ambiente de Dados
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMockMode(false)}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition ${
                  !mockMode
                    ? 'border-blue-600 bg-blue-50/60 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Globe className="w-4 h-4 text-blue-600" />
                  API Real (Backend)
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  Conecta ao Spring Boot via HTTP Axios
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMockMode(true)}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition ${
                  mockMode
                    ? 'border-orange-500 bg-orange-50/60 text-orange-900 ring-2 ring-orange-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Database className="w-4 h-4 text-orange-600" />
                  Modo Simulação
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  Dados interativos sem precisar ligar o backend
                </div>
              </button>
            </div>
          </div>

          {/* URL da API */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              URL Base da API (Backend Spring Boot)
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="http://localhost:8080"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Padrão: <code className="text-slate-600 font-bold">http://localhost:8080</code>
            </p>
          </div>

          {mockMode && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <div>
                <strong>Modo Simulação ativado:</strong> As ações (aprovar CPF, despachar, marcar entregue) modificam o estado localmente no navegador em tempo real.
              </div>
              <button
                type="button"
                onClick={handleResetDemoData}
                className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-semibold hover:text-amber-950 underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restaurar dados de teste padrão
              </button>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Fechar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md transition active:scale-95"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
