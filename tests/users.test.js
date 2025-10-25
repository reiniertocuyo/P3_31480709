//pruebas de rutas protegidas
const request = require('supertest');
const app = require('../app');

const testEmail = `auth_${Date.now()}@example.com`;
const testPassword = 'clave123';
let validToken = '';

describe('Pruebas de autorización en rutas protegidas', () => {
  beforeAll(async () => {
    // Registramos un usuario y obtenemos un token válido
    await request(app)
      .post('/auth/register')
      .send({
        fullName: 'Usuario Autorizado',
        email: testEmail,
        password: testPassword
      });

    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: testEmail,
        password: testPassword
      });

    validToken = loginRes.body.data.token;
  });

  test('Acceso a /users sin token debe ser rechazado', async () => {
    const res = await request(app).get('/users');

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('fail');
    expect(res.body.data.message).toMatch(/Token no proporcionado/i);
  });

  test('Acceso a /users con token inválido debe ser rechazado', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer token_falso');

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('fail');
    expect(res.body.data.message).toMatch(/Token inválido/i);
  });

  test('Acceso a /users con token válido debe ser permitido', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true); // Asumiendo que devuelve lista de usuarios
  });
});
