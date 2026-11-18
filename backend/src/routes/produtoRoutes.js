const { Router } = require('express');
const produtoController = require('../controllers/produtoController');
const validarId = require('../middlewares/validarId');
const validarCorpoProduto = require('../middlewares/validarCorpoProduto');

const router = Router();

router.get('/', produtoController.listar);
router.post('/', validarCorpoProduto, produtoController.criar);
router.get('/:id', validarId, produtoController.buscarPorId);
router.put('/:id', validarId, validarCorpoProduto, produtoController.atualizar);
router.delete('/:id', validarId, produtoController.remover);

module.exports = router;