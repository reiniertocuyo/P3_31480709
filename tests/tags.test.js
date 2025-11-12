const request = require('supertest');
const app = require('../app');

const testEmail = `tag_${Date.now()}@example.com`;
const testPassword = 'clave123';
let validToken = '';
let createdTagId = '';

describe('Pruebas de rutas protegidas /tags', () => {
  beforeAll(async () => {
    // Registrar usuario y obtener token
    await request(app)
      .post('/register')
      .send({
        fullName: 'Usuario Tags',
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

  test('Acceso a /tags sin token debe ser rechazado', async () => {
    const res = await request(app).get('/tags');
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('fail');
  });

  test('Crear tag con token válido', async () => {
    const res = await request(app)
      .post('/tags')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ name: 'Gaming' });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    createdTagId = res.body.data.id;
  });

  test('Obtener tags con token válido', async () => {
    const res = await request(app)
      .get('/tags')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('Actualizar tag existente', async () => {
    const res = await request(app)
      .put(`/tags/${createdTagId}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({ name: 'Gaming Actualizado' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });

  test('Eliminar tag existente', async () => {
    const res = await request(app)
      .delete(`/tags/${createdTagId}`)
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });
});
