const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validarProduto } = require('../src/validators/produtoValidator');

const produtoValido = { nome: 'Arroz Integral 1kg', preco: 6.89, quantidade: 45 };

describe('validarProduto', () => {
  it('não retorna erros para um produto válido', () => {
    assert.deepEqual(validarProduto(produtoValido), []);
  });

  it('aceita quantidade igual a zero', () => {
    assert.deepEqual(validarProduto({ ...produtoValido, quantidade: 0 }), []);
  });

  it('acusa todos os campos ausentes', () => {
    assert.deepEqual(validarProduto({}), [
      'O campo nome é obrigatório',
      'O campo preco é obrigatório',
      'O campo quantidade é obrigatório',
    ]);
  });

  it('rejeita corpo que não é objeto', () => {
    assert.equal(validarProduto(undefined).length, 1);
    assert.equal(validarProduto([produtoValido]).length, 1);
  });

  const casosInvalidos = [
    ['nome numérico', { nome: 123 }, 'O campo nome deve ser um texto não vazio'],
    ['nome só com espaços', { nome: '   ' }, 'O campo nome deve ser um texto não vazio'],
    ['nome longo demais', { nome: 'a'.repeat(121) }, 'O nome deve ter no máximo 120 caracteres'],
    ['preco como texto', { preco: '6.89' }, 'O campo preco deve ser um número'],
    ['preco zero', { preco: 0 }, 'O campo preco deve ser maior que zero'],
    ['preco negativo', { preco: -1 }, 'O campo preco deve ser maior que zero'],
    ['quantidade decimal', { quantidade: 1.5 }, 'O campo quantidade deve ser um número inteiro'],
    ['quantidade como texto', { quantidade: '10' }, 'O campo quantidade deve ser um número inteiro'],
    ['quantidade negativa', { quantidade: -3 }, 'O campo quantidade não pode ser negativo'],
  ];

  for (const [descricao, alteracao, mensagemEsperada] of casosInvalidos) {
    it(`rejeita ${descricao}`, () => {
      assert.deepEqual(validarProduto({ ...produtoValido, ...alteracao }), [mensagemEsperada]);
    });
  }
});