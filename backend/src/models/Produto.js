const { Schema, model } = require('mongoose');
const { NOME_TAMANHO_MAXIMO } = require('../constants/produto');

const produtoSchema = new Schema(
  {
    nome: {
      type: String,
      required: [true, 'O campo nome é obrigatório'],
      trim: true,
      maxlength: [NOME_TAMANHO_MAXIMO, `O nome deve ter no máximo ${NOME_TAMANHO_MAXIMO} caracteres`],
    },
    preco: {
      type: Number,
      required: [true, 'O campo preco é obrigatório'],
      validate: {
        validator: (valor) => valor > 0,
        message: 'O campo preco deve ser maior que zero',
      },
    },
    quantidade: {
      type: Number,
      required: [true, 'O campo quantidade é obrigatório'],
      min: [0, 'O campo quantidade não pode ser negativo'],
      validate: {
        validator: Number.isInteger,
        message: 'O campo quantidade deve ser um número inteiro',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model('Produto', produtoSchema);