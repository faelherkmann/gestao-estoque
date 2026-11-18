const mongoose = require('mongoose');

async function conectarBanco(uri) {
  if (!uri) {
    throw new Error(
      'MONGODB_URI não definida. Copie o arquivo .env.example para .env e preencha a string de conexão.'
    );
  }

  await mongoose.connect(uri);
  console.log('Conectado ao MongoDB');
}

module.exports = { conectarBanco };