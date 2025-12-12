const orderService = require('../services/orderService');
const { success, fail, error } = require('../utils/jsend');

// Checkout transaccional
exports.checkout = async (req, res) => {
  try {
    const userId = req.user.id; // viene del authMiddleware
    const { items, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json(fail({ message: 'Items requeridos para el checkout' }));
    }
    if (!paymentMethod) {
      return res.status(400).json(fail({ message: 'Método de pago requerido' }));
    }

    const result = await orderService.checkout(userId, items, paymentMethod);
    return res.status(201).json(success(result));
  } catch (err) {
    return res.status(500).json(error({ message: err.message }));
  }
};

// Historial con paginación
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const orders = await orderService.getOrdersByUser(userId, parseInt(page), parseInt(limit));
    return res.json(success(orders));
  } catch (err) {
    return res.status(500).json(error({ message: err.message }));
  }
};

// Detalle de orden
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await orderService.getOrderById(orderId, userId);
    if (!order) {
      return res.status(404).json(fail({ message: 'Orden no encontrada' }));
    }

    return res.json(success(order));
  } catch (err) {
    return res.status(500).json(error({ message: err.message }));
  }
};
