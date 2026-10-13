# 🚀 Gás do Povo - Front-end Web (Painel de Gestão e Entregas)

Interface web moderna, rápida e responsiva construída especificamente para o atendimento e a gestão operacional da distribuidora de gás, integrando com o backend Spring Boot e os fluxos de mensagens WhatsApp.

---

## 🛠️ Stack Tecnológica

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Gerenciamento de Estado de Servidor & Polling:** [@tanstack/react-query](https://tanstack.com/query)
- **Cliente HTTP:** [Axios](https://axios-http.com/)
- **Ícones & UI:** [Lucide React](https://lucide.dev/)
- **Gráficos & Dashboards:** [Recharts](https://recharts.org/)

---

## 📋 Funcionalidades Implementadas

### 1. 🔄 Fluxo 1: Pedido Normal (Padrão)
- O pedido chega da API com status `PENDENTE` ("Pronto para Despacho").
- O atendente clica em **[Despachar]** e escolhe um dos entregadores **ativos** no modal.
- O sistema chama `PUT /api/admin/pedidos/{id}/despachar` com `{ entregadorId }` e o status vai para `DESPACHADO`.
- Quando o motoboy conclui a entrega, o atendente clica em **[Marcar Entregue]** (`PUT /api/admin/pedidos/{id}/entregue`), que finaliza o pedido e soma o valor ao caixa do dia do entregador (se Dinheiro ou Cartão).

### 2. 🛡️ Fluxo 2: Pedido "Gás do Povo" (Validação de CPF)
- O pedido cai com status `AGUARDANDO_VALIDACAO_CPF`.
- Coluna em destaque no Kanban com o CPF do cliente e botão de cópia rápida.
- **[Aprovar CPF]**: `PUT /api/admin/pedidos/{id}/aprovar-cpf` -> muda status para `PENDENTE` (entra na fila de despacho).
- **[Reprovar CPF]**: `PUT /api/admin/pedidos/{id}/reprovar-cpf` -> muda status para `CPF_REPROVADO` (pedido encerrado).

### 3. ❌ Fluxo 3: Cancelamento de Pedidos
- Em qualquer momento antes da entrega ou reprovação, o atendente pode clicar em **[Cancelar Pedido]** (`PUT /api/admin/pedidos/{id}/cancelar`).

### 4. 🛵 Gestão de Entregadores
- Listagem completa (`GET /api/entregadores`) com badges de status (Ativo / Inativo).
- **Cadastro**: formulário modal (`POST /api/entregadores`) com nome e telefone.
- **Ativar/Desativar**: `PUT /api/entregadores/{id}/ativar` e `/desativar`. Entregadores inativos não aparecem no select de despacho!

### 5. 💰 Fechamento de Caixa do Dia (Acerto Físico)
- Consulta `GET /api/admin/entregadores/caixa` para fechamento individual por motoboy.
- Soma dinheiro e cartão em espécie para prestação de contas no fim do expediente.
- Destaque claro de que valores via **PIX** caem na conta da empresa e não são cobrados do motoboy.
- Botão de **Imprimir Acerto** pronto para o acerto físico.

### 6. 📊 Métricas e Painel de Indicadores
- Total de pedidos, faturamento do dia, distribuição por forma de pagamento (barras) e comparativo de Normal vs Benefício Gás do Povo (pizza).

### 7. ⚡ Modo Simulação / Demonstração Integrado
- Um botão no topo permite alternar entre **API Real (`http://localhost:8080`)** e **Modo Simulação**.
- Se o backend do primo ainda não estiver rodando no computador, o sistema avisa amigavelmente e permite testar todo o fluxo com dados em tempo real no navegador!

---

## 🏃 Como Rodar o Projeto

1. Certifique-se de ter o Node.js instalado.
2. Na pasta do projeto, execute:
   ```bash
   npm run dev
   ```
3. Abra a URL exibida no navegador (geralmente `http://localhost:5173`).

---

## 🌐 Configuração do Backend

Por padrão, a aplicação conecta em:
```env
VITE_API_BASE_URL=http://localhost:8080
```
Você também pode clicar no botão ⚙️ **(Configurações)** no canto superior direito da tela para trocar o endereço da API em tempo real sem precisar reiniciar o projeto!
