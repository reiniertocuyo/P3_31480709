const { sequelize } = require('../models');
const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const CreditCardPaymentStrategy = require('../payments/CreditCardPaymentStrategy');

class OrderService {
  /**
   * Checkout completo (Facade)
   * @param {number} userId - ID del usuario
   * @param {Array} items - [{ productId, quantity }]
   * @param {string} paymentMethod - 'credit_card' (por ahora)
   */
  async checkout(userId, items, paymentMethod) {
    return await sequelize.transaction(async (transaction) => {
      // 1. Verificación de stock
      for (const item of items) {
        const hasStock = await productRepository.hasSufficientStock(item.productId, item.quantity);
        if (!hasStock) {
          throw new Error(`Stock insuficiente para producto ${item.productId}`);
        }
      }

      // 2. Cálculo de total
      let totalAmount = 0;
      const enrichedItems = [];
      for (const item of items) {
        const product = await productRepository.reduceStock(item.productId, item.quantity, transaction);
        const unitPrice = product.price; // precio actual del producto
        totalAmount += unitPrice * item.quantity;

        enrichedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice
        });
      }

      // 3. Selección de estrategia de pago
      let paymentResult;
      if (paymentMethod === 'credit_card') {
        const strategy = new CreditCardPaymentStrategy();
        paymentResult = await strategy.pay({ amount: totalAmount, userId });
      } else {
        throw new Error(`Método de pago no soportado: ${paymentMethod}`);
      }

      if (!paymentResult.success) {
        throw new Error(`Pago fallido: ${paymentResult.message}`);
      }

      // 4. Creación de orden e items
      const order = await orderRepository.createOrder(
        userId,
        enrichedItems,
        totalAmount,
        'COMPLETED',
        transaction
      );

      return {
        orderId: order.id,
        status: 'COMPLETED',
        totalAmount,
        paymentReference: paymentResult.reference,
        items: enrichedItems
      };
    });
  }
}

module.exports = new OrderService();
