const mongoose = require('mongoose');

function validarId(req, res, next) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  return next();
}

module.exports = validarId;