const { describe, it, before, after, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Produto = require('../src/models/Produto');

const ROTA = '/api/produtos';
const ID_INEXISTENTE = '507f1f77bcf86cd799439011';
const produtoValido = { nome: 'Arroz Integral 1kg', preco: 6.89, quantidade: 45 };

let mongoServer;

before(async () => {
  // Sobe um MongoDB em memória só para os testes: não toca no banco de desenvolvimento
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  mock.restoreAll();
  await Produto.deleteMany({});
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

async function cadastrar(dados = produtoValido) {
  const resposta = await request(app).post(ROTA).send(dados);
  return resposta.body;
}

describe('POST /api/produtos', () => {
  it('cria um produto e retorna 201', async () => {
    const resposta = await request(app).post(ROTA).send(produtoValido);

    assert.equal(resposta.status, 201);
    assert.equal(resposta.body.nome, produtoValido.nome);
    assert.equal(resposta.body.preco, produtoValido.preco);
    assert.equal(resposta.body.quantidade, produtoValido.quantidade);
    assert.ok(resposta.body._id);
  });

  it('ignora campos que não fazem parte do produto', async () => {
    const resposta = await request(app)
      .post(ROTA)
      .send({ ...produtoValido, _id: ID_INEXISTENTE, desconto: 50 });

    assert.equal(resposta.status, 201);
    assert.notEqual(resposta.body._id, ID_INEXISTENTE);
    assert.equal(resposta.body.desconto, undefined);
  });

  it('retorna 400 quando faltam campos obrigatórios', async () => {
    const resposta = await request(app).post(ROTA).send({ nome: 'Feijão' });

    assert.equal(resposta.status, 400);
    assert.deepEqual(resposta.body.detalhes, [
      'O campo preco é obrigatório',
      'O campo quantidade é obrigatório',
    ]);
  });

  it('retorna 400 para tipos inválidos', async () => {
    const resposta = await request(app)
      .post(ROTA)
      .send({ nome: 'Feijão', preco: '7.50', quantidade: 2.5 });

    assert.equal(resposta.status, 400);
  });

  it('retorna 400 para JSON malformado', async () => {
    const resposta = await request(app)
      .post(ROTA)
      .set('Content-Type', 'application/json')
      .send('{"nome":');

    assert.equal(resposta.status, 400);
    assert.equal(resposta.body.erro, 'JSON malformado no corpo da requisição');
  });
});

describe('GET /api/produtos', () => {
  it('retorna a lista de produtos', async () => {
    await cadastrar();
    await cadastrar({ nome: 'Feijão Carioca 1kg', preco: 8.49, quantidade: 30 });

    const resposta = await request(app).get(ROTA);

    assert.equal(resposta.status, 200);
    assert.equal(resposta.body.length, 2);
  });
});

describe('GET /api/produtos/:id', () => {
  it('retorna o produto pelo id', async () => {
    const criado = await cadastrar();

    const resposta = await request(app).get(`${ROTA}/${criado._id}`);

    assert.equal(resposta.status, 200);
    assert.equal(resposta.body.nome, produtoValido.nome);
  });

  it('retorna 404 para id inexistente', async () => {
    const resposta = await request(app).get(`${ROTA}/${ID_INEXISTENTE}`);
    assert.equal(resposta.status, 404);
  });

  it('retorna 400 para id em formato inválido', async () => {
    const resposta = await request(app).get(`${ROTA}/abc`);
    assert.equal(resposta.status, 400);
  });
});

describe('PUT /api/produtos/:id', () => {
  it('atualiza o produto e retorna a versão nova', async () => {
    const criado = await cadastrar();
    const novosDados = { nome: 'Arroz Integral 5kg', preco: 29.9, quantidade: 12 };

    const resposta = await request(app).put(`${ROTA}/${criado._id}`).send(novosDados);

    assert.equal(resposta.status, 200);
    assert.equal(resposta.body.nome, novosDados.nome);
    assert.equal(resposta.body.preco, novosDados.preco);
    assert.equal(resposta.body.quantidade, novosDados.quantidade);
  });

  it('retorna 400 quando o corpo está incompleto', async () => {
    const criado = await cadastrar();

    const resposta = await request(app).put(`${ROTA}/${criado._id}`).send({ preco: 1 });

    assert.equal(resposta.status, 400);
  });

  it('retorna 404 para id inexistente', async () => {
    const resposta = await request(app).put(`${ROTA}/${ID_INEXISTENTE}`).send(produtoValido);
    assert.equal(resposta.status, 404);
  });
});

describe('DELETE /api/produtos/:id', () => {
  it('remove o produto e retorna 204', async () => {
    const criado = await cadastrar();

    const resposta = await request(app).delete(`${ROTA}/${criado._id}`);

    assert.equal(resposta.status, 204);
    assert.equal(await Produto.findById(criado._id), null);
  });

  it('retorna 404 para id inexistente', async () => {
    const resposta = await request(app).delete(`${ROTA}/${ID_INEXISTENTE}`);
    assert.equal(resposta.status, 404);
  });
});

describe('erros gerais', () => {
  it('retorna 500 sem expor detalhes quando o banco falha', async () => {
    mock.method(Produto, 'find', () => {
      throw new Error('conexão perdida');
    });
    const logDeErro = mock.method(console, 'error', () => {});

    const resposta = await request(app).get(ROTA);

    assert.equal(resposta.status, 500);
    assert.deepEqual(resposta.body, { erro: 'Erro interno do servidor' });
    assert.equal(logDeErro.mock.callCount(), 1);
  });

  it('retorna 404 para rota inexistente', async () => {
    const resposta = await request(app).get('/api/nao-existe');
    assert.equal(resposta.status, 404);
  });
});