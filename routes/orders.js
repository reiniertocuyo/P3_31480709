const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');

// Checkout transaccional
router.post('/orders', authMiddleware, orderController.checkout);

// Historial con paginación
router.get('/orders', authMiddleware, orderController.getOrders);

// Detalle de orden
router.get('/orders/:id', authMiddleware, orderController.getOrderById);

module.exports = router;
