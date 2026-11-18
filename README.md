# Gestão de Estoque · Supermercado

Aplicação fullstack para controle de estoque de produtos de um supermercado: API REST em Node.js/Express com MongoDB e interface web em Next.js (React).

## Funcionalidades

- Listagem dos produtos com nome, preço unitário, quantidade em estoque e ações
- Cadastro de produto com validação no cliente e no servidor
- Edição de um produto já salvo
- Exclusão com confirmação
- Listagem atualizada na tela após cadastrar, editar ou excluir, sem recarregar a página
- Tratamento de erros com status HTTP adequados (400, 404, 413, 500)
- Testes automatizados da API com banco MongoDB em memória

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16 (App Router), React 19 |
| Backend | Node.js 20+, Express 5 |
| Banco de dados | MongoDB com Mongoose 9 |
| Testes | `node:test` (nativo do Node), Supertest, mongodb-memory-server |

## Estrutura de pastas

```
gestao-estoque/
├── backend/
│   ├── src/
│   │   ├── config/database.js          # conexão com o MongoDB
│   │   ├── constants/produto.js        # regras compartilhadas (tamanho do nome)
│   │   ├── controllers/produtoController.js
│   │   ├── middlewares/
│   │   │   ├── tratamentoErros.js      # 404 de rota e tratamento central de erros
│   │   │   ├── validarCorpoProduto.js
│   │   │   └── validarId.js
│   │   ├── models/Produto.js           # schema do Mongoose
│   │   ├── routes/produtoRoutes.js
│   │   ├── validators/produtoValidator.js
│   │   ├── app.js                      # configuração do Express (sem subir servidor)
│   │   └── server.js                   # conecta no banco e sobe a API
│   ├── tests/
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── app/                        # layout, página e estilos globais
    │   ├── components/                 # Estoque, ProdutoForm, ProdutoTabela
    │   ├── hooks/useProdutos.js        # estado e operações da lista
    │   ├── services/produtoService.js  # chamadas HTTP à API
    │   └── utils/formatadores.js
    └── .env.example
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior (recomendado: versão LTS)
- Um banco MongoDB, por uma destas opções:
  - **MongoDB Atlas** (nuvem, plano gratuito): crie um cluster, um usuário do banco e libere seu IP em *Network Access*. Copie a string de conexão em *Connect > Drivers*.
  - **MongoDB local**: instale o [MongoDB Community Server](https://www.mongodb.com/try/download/community).

## Como rodar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/faelherkmann/gestao-estoque.git
cd gestao-estoque
```

### 2. Backend (API)

```bash
cd backend
npm install
cp .env.example .env      # no Prompt de Comando do Windows: copy .env.example .env
```

Abra o `.env` e ajuste a `MONGODB_URI` (local ou Atlas). Depois:

```bash
npm run dev
```

A API sobe em `http://localhost:3333`. Para conferir: `http://localhost:3333/api/health` deve responder `{"status":"ok"}`.

### 3. Frontend

Em outro terminal, a partir da raiz do projeto:

```bash
cd frontend
npm install
cp .env.example .env.local   # no Prompt de Comando do Windows: copy .env.example .env.local
npm run dev
```

Acesse `http://localhost:3000`.

### Variáveis de ambiente

| Arquivo | Variável | Descrição | Padrão |
|---|---|---|---|
| `backend/.env` | `PORT` | Porta da API | `3333` |
| `backend/.env` | `MONGODB_URI` | String de conexão do MongoDB | obrigatória |
| `backend/.env` | `CORS_ORIGIN` | Origem do frontend liberada no CORS | `http://localhost:3000` |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | URL base da API | `http://localhost:3333/api` |

## Endpoints da API

Base: `http://localhost:3333/api`

| Método | Rota | Descrição | Sucesso | Erros |
|---|---|---|---|---|
| GET | `/produtos` | Lista todos os produtos (mais recentes primeiro) | 200 | 500 |
| GET | `/produtos/:id` | Detalha um produto | 200 | 400, 404, 500 |
| POST | `/produtos` | Cadastra um produto | 201 | 400, 500 |
| PUT | `/produtos/:id` | Atualiza um produto (envia os 3 campos) | 200 | 400, 404, 500 |
| DELETE | `/produtos/:id` | Remove um produto | 204 | 400, 404, 500 |

Exemplo de corpo para POST e PUT:

```json
{ "nome": "Arroz Integral 1kg", "preco": 6.89, "quantidade": 45 }
```

Regras: `nome` texto obrigatório (até 120 caracteres), `preco` número maior que zero, `quantidade` inteiro maior ou igual a zero.

Exemplo de resposta de erro (400):

```json
{
  "erro": "Dados inválidos",
  "detalhes": ["O campo preco deve ser maior que zero"]
}
```

## Testes

```bash
cd backend
npm test
```

Os testes de integração sobem um MongoDB em memória com o `mongodb-memory-server`, então não usam nem alteram o seu banco. Na primeira execução ele baixa o binário do MongoDB (precisa de internet e pode levar alguns minutos).

## Decisões técnicas

- **Camadas no backend** (rotas, middlewares, controller, model): cada arquivo tem uma responsabilidade, o que facilita testar e manter.
- **Validação em duas camadas**: o middleware valida tipos e regras antes de tocar no banco e devolve mensagens claras; o schema do Mongoose garante as mesmas regras no nível dos dados.
- **Lista de campos permitidos no controller**: só `nome`, `preco` e `quantidade` são gravados, evitando que o cliente altere `_id` ou crie campos extras.
- **`app.js` separado de `server.js`**: os testes importam o app sem abrir porta nem conectar no banco de desenvolvimento.
- **Hook `useProdutos`**: concentra o estado da lista e as chamadas à API; após cada operação o estado local é atualizado com a resposta do servidor, sem novo GET.
- **Formulário reiniciado via `key`**: ao trocar o produto em edição, o React recria o formulário com os dados certos, sem precisar de `useEffect` para sincronizar estado.

## Possíveis melhorias

- Paginação e busca por nome na listagem
- Testes de componentes no frontend (React Testing Library)
- Tratamento de concorrência na edição (versão do documento)
- Autenticação para proteger as rotas de escrita
