const PaymentStrategy = require('./PaymentStrategy');
const axios = require('axios');

class CreditCardPaymentStrategy extends PaymentStrategy {
  async pay({ amount, userId }) {
    try {
      // Simulación de llamada a API externa de pago
      const response = await axios.post('https://fakepayment.example.com/pay', {
        userId,
        amount,
        method: 'credit_card'
      });

      return {
        success: response.data.success,
        reference: response.data.reference,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        reference: null,
        message: error.message
      };
    }
  }
}

module.exports = CreditCardPaymentStrategy;
