const request = require('supertest');
const app = require('../app');

const testEmail = `prod_${Date.now()}@example.com`;
const testPassword = 'clave123';
let validToken = '';
let createdCategoryId = '';
let createdTagIds = [];
let createdProductId = '';

describe('Pruebas de rutas protegidas /products', () => {
  beforeAll(async () => {
    // Registrar usuario y obtener token
    await request(app)
      .post('/register')
      .send({
        fullName: 'Usuario Productos',
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

    // Crear categoría de prueba
    const categoryRes = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        name: 'Cartoon Network TEST'+ Date.now(),
        description: 'Series animadas distribuidas por Cartoon Network'
      });

      expect(categoryRes.statusCode).toBe(201);
      expect(categoryRes.body.status).toBe('success');
      expect(categoryRes.body.data).toBeDefined();
    createdCategoryId = categoryRes.body.data.id;

    // Crear etiquetas de prueba
    const tagRes1 = await request(app)
      .post('/tags')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ name: 'Acción TEST'+ Date.now() });

    const tagRes2 = await request(app)
      .post('/tags')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ name: 'Aventura TEST'+ Date.now() });

    createdTagIds = [tagRes1.body.data.id, tagRes2.body.data.id];
  });

  test('Acceso a /products sin token debe ser rechazado', async () => {
    const res = await request(app).get('/products/1');
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('fail');
  });

  test('Crear producto con token válido y relaciones válidas', async () => {
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        name: 'Ben 10 Temporada 1',
        description: 'DVD original con los primeros episodios de Ben 10',
        price: 19.99,
        stock: 50,
        format: 'DVD',
        series: 'Ben 10',
        season: 1,
        language: 'Español',
        release_year: 2005,
        publisher: 'Cartoon Network Studios',
        categoryId: createdCategoryId,
        tagIds: createdTagIds
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    createdProductId = res.body.data.id;
  });

  test('Obtener producto por ID con token válido', async () => {
    const res = await request(app)
      .get(`/products/${createdProductId}`)
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.name).toBe('Ben 10 Temporada 1');
  });

  test('Actualizar producto existente', async () => {
    const res = await request(app)
      .put(`/products/${createdProductId}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({ name: 'Ben 10 Temporada 1 - Edición Especial' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.name).toContain('Edición Especial');
  });

  test('Eliminar producto existente', async () => {
    const res = await request(app)
      .delete(`/products/${createdProductId}`)
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });
});
