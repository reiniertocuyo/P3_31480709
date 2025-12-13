class PaymentStrategy {
  /**
   * Ejecuta un pago con los datos proporcionados.
   * @param {Object} paymentData - Datos requeridos por la API externa.
   * @param {string} paymentData['full-name'] - Nombre completo del titular.
   * @param {string} paymentData['card-number'] - Número de tarjeta.
   * @param {string} paymentData['expiration-month'] - Mes de expiración (MM).
   * @param {string} paymentData['expiration-year'] - Año de expiración (YYYY).
   * @param {string} paymentData.cvv - Código de seguridad.
   * @param {number} paymentData.amount - Monto total de la transacción.
   * @param {string} paymentData.currency - Moneda (ej. USD).
   * @param {string} paymentData.description - Descripción de la transacción.
   * @returns {Promise<Object>} Resultado del pago
   * {
   *   success: boolean,
   *   reference: string|null, // transaction_id de fakePayment
   *   message: string,
   *   data?: object // datos adicionales de la transacción
   * }
   */
  async pay(paymentData) {
    throw new Error('Método pay() debe ser implementado por la estrategia concreta');
  }
}

module.exports = PaymentStrategy;

