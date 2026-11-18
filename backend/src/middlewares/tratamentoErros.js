const mongoose = require('mongoose');

function rotaNaoEncontrada(req, res) {
  res.status(404).json({ erro: 'Rota não encontrada' });
}

// O Express reconhece um middleware de erro pelos 4 parâmetros (err, req, res, next)
function tratarErros(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON malformado no corpo da requisição' });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ erro: 'Corpo da requisição excede o tamanho permitido' });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const detalhes = Object.values(err.errors).map((erroCampo) => erroCampo.message);
    return res.status(400).json({ erro: 'Dados inválidos', detalhes });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ erro: `Valor inválido para o campo ${err.path}` });
  }

  // Erro inesperado: registra o detalhe no servidor, mas devolve ao cliente uma mensagem genérica
  console.error(err);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}

module.exports = { rotaNaoEncontrada, tratarErros };