class PaymentStrategy {
  async pay(paymentData) {
    throw new Error('Método pay() debe ser implementado por la estrategia concreta');
  }
}

module.exports = PaymentStrategy;
