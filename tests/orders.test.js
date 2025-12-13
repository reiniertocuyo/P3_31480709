const request = require('supertest');
const app = require('../app');

const testEmail = 'reinier@example.com';
const testPassword = 'clave123';
let validToken = '';
let createdOrderId = '';

jest.setTimeout(15000); // todos los tests tendrán 15 segundos

describe('Pruebas de rutas protegidas /orders', () => {
  beforeAll(async () => {
    // Intentar login directamente con el usuario fijo
    const loginRes = await request(app)
      .post('/login')
      .send({
        email: testEmail,
        password: testPassword
      });

    // Si el login falla porque el usuario no existe, lo registramos
    if (loginRes.statusCode !== 200) {
      await request(app)
        .post('/register')
        .send({
          fullName: 'Usuario Órdenes',
          email: testEmail,
          password: testPassword
        });

      const retryLogin = await request(app)
        .post('/login')
        .send({
          email: testEmail,
          password: testPassword
        });

      validToken = retryLogin.body.data.token;
    } else {
      validToken = loginRes.body.data.token;
    }
  });

  test('Acceso a /orders sin token debe ser rechazado', async () => {
    const res = await request(app).get('/orders');
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('fail');
  });

  test('Checkout exitoso con token válido', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        items: [{ productId: 1, quantity: 1 }],
        paymentMethod: 'credit_card',
        paymentDetails: {
          'full-name': 'John Doe',
          'card-number': '5555555555554444', // Mastercard válida
          'expiration-month': '12',
          'expiration-year': '2026',
          cvv: '123',
          currency: 'USD',
          description: 'Compra de prueba'
        }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('orderId');
    createdOrderId = res.body.data.orderId;
  });

  test('Fallo por stock insuficiente', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        items: [{ productId: 9999, quantity: 1000 }],
        paymentMethod: 'credit_card',
        paymentDetails: {
          'full-name': 'John Doe',
          'card-number': '4111111111111111',
          'expiration-month': '12',
          'expiration-year': '2026',
          cvv: '123',
          amount: 9999.99,
          currency: 'USD',
          description: 'Compra con stock insuficiente'
        }
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
  });

  test('Historial de órdenes con paginación', async () => {
    const res = await request(app)
      .get('/orders?page=1&limit=5')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('Detalle de orden existente', async () => {
    expect(createdOrderId).toBeTruthy();
    const res = await request(app)
      .get(`/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });

  test('Detalle de orden inexistente', async () => {
    const res = await request(app)
      .get('/orders/999999')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('fail');
  });
});
