const { Order, OrderItem, Product, User } = require('../models');

class OrderRepository {
  // Crear una orden con sus items
  async createOrder(userId, items, totalAmount, status, transaction) {
    const order = await Order.create(
      { userId, totalAmount, status },
      { transaction }
    );

    // Crear los OrderItems asociados
    for (const item of items) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        },
        { transaction }
      );
    }

    return order;
  }

  // Buscar todas las órdenes de un usuario (con paginación)
  async getOrdersByUser(userId, page = 1, limit = 10) {
    return await Order.findAndCountAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ],
      offset: (page - 1) * limit,
      limit
    });
  }

  // Buscar detalle de una orden específica
  async getOrderById(orderId, userId) {
    return await Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        { model: User, as: 'user' }
      ]
    });
  }
}

module.exports = new OrderRepository();
