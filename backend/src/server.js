// Carrega o .env antes de qualquer outro módulo ler process.env
require('dotenv').config({ quiet: true });

const app = require('./app');
const { conectarBanco } = require('./config/database');

const PORT = Number(process.env.PORT) || 3333;

async function iniciar() {
  try {
    await conectarBanco(process.env.MONGODB_URI);

    app.listen(PORT, (erro) => {
      if (erro) {
        throw erro;
      }
      console.log(`API rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error('Falha ao iniciar a API:', erro.message);
    process.exit(1);
  }
}

iniciar();