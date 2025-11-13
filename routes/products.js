const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, controller.create);
router.get('/:id', auth, controller.getById);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
