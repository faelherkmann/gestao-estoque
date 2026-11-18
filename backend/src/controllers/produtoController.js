const Produto = require('../models/Produto');

const MENSAGEM_NAO_ENCONTRADO = { erro: 'Produto não encontrado' };

// Copia só os campos permitidos. Assim o cliente não consegue gravar _id, createdAt ou campos extras.
function camposPermitidos({ nome, preco, quantidade }) {
  return { nome: nome.trim(), preco, quantidade };
}

async function listar(req, res) {
  const produtos = await Produto.find().sort({ createdAt: -1 }).lean();
  return res.status(200).json(produtos);
}

async function buscarPorId(req, res) {
  const produto = await Produto.findById(req.params.id).lean();

  if (!produto) {
    return res.status(404).json(MENSAGEM_NAO_ENCONTRADO);
  }

  return res.status(200).json(produto);
}

async function criar(req, res) {
  const produto = await Produto.create(camposPermitidos(req.body));
  return res.status(201).json(produto);
}

async function atualizar(req, res) {
  const produto = await Produto.findByIdAndUpdate(req.params.id, camposPermitidos(req.body), {
    returnDocument: 'after',
    runValidators: true,
  }).lean();

  if (!produto) {
    return res.status(404).json(MENSAGEM_NAO_ENCONTRADO);
  }

  return res.status(200).json(produto);
}

async function remover(req, res) {
  const produto = await Produto.findByIdAndDelete(req.params.id);

  if (!produto) {
    return res.status(404).json(MENSAGEM_NAO_ENCONTRADO);
  }

  return res.status(204).send();
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };