const express = require('express');
const cors = require('cors');
const produtoRoutes = require('./routes/produtoRoutes');
const { rotaNaoEncontrada, tratarErros } = require('./middlewares/tratamentoErros');

const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/produtos', produtoRoutes);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

module.exports = app;