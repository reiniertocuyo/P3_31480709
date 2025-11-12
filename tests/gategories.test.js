const request = require('supertest');
const app = require('../app');

const testEmail = `cat_${Date.now()}@example.com`;
const testPassword = 'clave123';
let validToken = '';
let createdCategoryId = '';

describe('Pruebas de rutas protegidas /categories', () => {
  beforeAll(async () => {
    // Registrar usuario y obtener token
    await request(app)
      .post('/register')
      .send({
        fullName: 'Usuario Categorías',
        email: testEmail,
        password: testPassword
      });

    const loginRes = await request(app)
      .post('/login')
      .send({
        email: testEmail,
        password: testPassword
      });

    validToken = loginRes.body.data.token;
  });

  test('Acceso a /categories sin token debe ser rechazado', async () => {
    const res = await request(app).get('/categories');
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('fail');
  });

  test('Crear categoría con token válido', async () => {
    const res = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        name: 'Tooncast',
        description: 'Series distribuidas por el subcanal de tooncast, una division para series ya finalizadas'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    createdCategoryId = res.body.data.id;
  });

  test('Obtener categorías con token válido', async () => {
    const res = await request(app)
      .get('/categories')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('Actualizar categoría existente', async () => {
    const res = await request(app)
      .put(`/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({ name: 'Boomberang' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });

  test('Eliminar categoría existente', async () => {
    const res = await request(app)
      .delete(`/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });
});
