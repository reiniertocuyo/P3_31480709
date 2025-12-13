const PaymentStrategy = require('./PaymentStrategy');
const axios = require('axios');

class CreditCardPaymentStrategy extends PaymentStrategy {
  async pay(paymentData) {
    try {
      console.log('Payload enviado a FakePayments:', {
        'full-name': paymentData['full-name'],
        'card-number': paymentData['card-number'],
        'expiration-month': paymentData['expiration-month'],
        'expiration-year': paymentData['expiration-year'],
        cvv: paymentData.cvv,
        amount: Number(paymentData.amount),
        currency: paymentData.currency,
        description: paymentData.description
      });

      // 1. Obtener API key
      const apiKeyResponse = await axios.get(`${process.env.PAYMENT_API_URL}/payments/api-key`);
      const apiKey = apiKeyResponse.data.apiKey;

      // 2. Ejecutar pago (aceptamos 302 como válido)
      const paymentResponse = await axios.post(
        `${process.env.PAYMENT_API_URL}/payments`,
        {
          'full-name': paymentData['full-name'],
          'card-number': paymentData['card-number'],
          'expiration-month': paymentData['expiration-month'],
          'expiration-year': paymentData['expiration-year'],
          cvv: paymentData.cvv,
          amount: Number(paymentData.amount),
          currency: paymentData.currency,
          description: paymentData.description
        },
        {
          headers: { Authorization: `Bearer ${apiKey}` },
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 400 // aceptar 302 como éxito
        }
      );

      console.log('Payment Response:', paymentResponse.status, paymentResponse.data, paymentResponse.headers);

      // 3. Extraer transaction_id desde la cabecera Location del redirect
      const location = paymentResponse.headers.location;
      const transactionId = location ? location.split('/').pop() : null;

      if (!transactionId) {
        return {
          success: false,
          statusCode: 400,
          reference: null,
          message: 'No se recibió transactionId en el redirect',
          data: paymentResponse.data
        };
      }

      // 4. Consultar detalle de la transacción
      const detailResponse = await axios.get(
        `${process.env.PAYMENT_API_URL}/payments/${transactionId}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );

      return {
        success: true,
        statusCode: 201, // éxito → Created
        reference: transactionId,
        message: detailResponse.data.message,
        data: detailResponse.data.data
      };
    } catch (error) {
      if (error.response) {
        console.log('Error en FakePayments:', error.response.status, error.response.data);

        // Mapeo de equivalencias
        let mappedStatus = 500;
        if (error.response.status === 400) mappedStatus = 402; // Payment Required
        else if (error.response.status === 401) mappedStatus = 401;
        else if (error.response.status === 403) mappedStatus = 403;
        else if (error.response.status === 404) mappedStatus = 404;

        return {
          success: false,
          statusCode: mappedStatus,
          reference: null,
          message: error.response.data?.message || `Error de pago (${error.response.status})`,
          data: error.response.data
        };
      }

      return {
        success: false,
        statusCode: 500,
        reference: null,
        message: error.message,
        data: null
      };
    }
  }
}

module.exports = CreditCardPaymentStrategy;
