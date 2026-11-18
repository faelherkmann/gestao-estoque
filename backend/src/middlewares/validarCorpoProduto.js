const { validarProduto } = require('../validators/produtoValidator');

function validarCorpoProduto(req, res, next) {
  const erros = validarProduto(req.body);

  if (erros.length > 0) {
    return res.status(400).json({ erro: 'Dados inválidos', detalhes: erros });
  }

  return next();
}

module.exports = validarCorpoProduto;