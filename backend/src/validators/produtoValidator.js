const { NOME_TAMANHO_MAXIMO } = require('../constants/produto');

function estaAusente(valor) {
  return valor === undefined || valor === null;
}

function validarProduto(dados) {
  if (dados === null || typeof dados !== 'object' || Array.isArray(dados)) {
    return ['O corpo da requisição deve ser um objeto JSON'];
  }

  const { nome, preco, quantidade } = dados;
  const erros = [];

  if (estaAusente(nome)) {
    erros.push('O campo nome é obrigatório');
  } else if (typeof nome !== 'string' || nome.trim() === '') {
    erros.push('O campo nome deve ser um texto não vazio');
  } else if (nome.trim().length > NOME_TAMANHO_MAXIMO) {
    erros.push(`O nome deve ter no máximo ${NOME_TAMANHO_MAXIMO} caracteres`);
  }

  if (estaAusente(preco)) {
    erros.push('O campo preco é obrigatório');
  } else if (typeof preco !== 'number' || !Number.isFinite(preco)) {
    erros.push('O campo preco deve ser um número');
  } else if (preco <= 0) {
    erros.push('O campo preco deve ser maior que zero');
  }

  if (estaAusente(quantidade)) {
    erros.push('O campo quantidade é obrigatório');
  } else if (!Number.isInteger(quantidade)) {
    erros.push('O campo quantidade deve ser um número inteiro');
  } else if (quantidade < 0) {
    erros.push('O campo quantidade não pode ser negativo');
  }

  return erros;
}

module.exports = { validarProduto };