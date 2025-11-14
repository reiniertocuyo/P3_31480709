const request = require('supertest');
const app = require('../app');

const testEmail = `public_${Date.now()}@example.com`;
const testPassword = 'clave123';
let validToken = '';
let createdCategoryId = '';
let createdTagId = '';
let createdProduct = null;

describe('Pruebas de rutas públicas /products y /p/:id-:slug', () => {
  beforeAll(async () => {
    // Registrar usuario y obtener token
    await request(app)
      .post('/register')
      .send({
        fullName: 'Usuario Público',
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
    if (!validToken) throw new Error('No se obtuvo token válido');

    // Crear categoría de prueba con nombre único
    const categoryRes = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        name: 'Cartoon Network ' + Date.now(),
        description: 'Animación'
      });

    expect(categoryRes.statusCode).toBe(201);
    expect(categoryRes.body.status).toBe('success');
    createdCategoryId = categoryRes.body.data.id;

    // Crear etiqueta de prueba con nombre único
    const tagRes = await request(app)
      .post('/tags')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ name: 'Acción ' + Date.now() });

    expect(tagRes.statusCode).toBe(201);
    expect(tagRes.body.status).toBe('success');
    createdTagId = tagRes.body.data.id;

    // Crear producto público
    const productRes = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        name: 'Ben 10 Volumen 1'+ Date.now(),
        description: 'DVD original',
        price: 19.99,
        stock: 10,
        format: 'DVD',
        series: 'Ben 10',
        season: 1,
        language: 'Español',
        release_year: 2005,
        publisher: 'Cartoon Network Studios',
        categoryId: createdCategoryId,
        tagIds: [createdTagId]
      });

    expect(productRes.statusCode).toBe(201);
    expect(productRes.body.status).toBe('success');
    createdProduct = productRes.body.data;
  });

  test('GET /products sin filtros devuelve productos paginados', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data.data)).toBe(true);
  });

  test('GET /products con filtro search devuelve coincidencias', async () => {
    const res = await request(app).get('/products?search=ben');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.data.some(p => p.name.toLowerCase().includes('ben'))).toBe(true);
  });

  test('GET /products con filtro release_year devuelve coincidencias', async () => {
    const res = await request(app).get('/products?release_year=2005');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.data.every(p => p.release_year === 2005)).toBe(true);
  });

  test('GET /p/:id-:slug con slug correcto devuelve producto', async () => {
    const res = await request(app).get(`/p/${createdProduct.id}-${createdProduct.slug}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.id).toBe(createdProduct.id);
  });

  test('GET /p/:id-:slug con slug incorrecto redirige con 301', async () => {
    const res = await request(app).get(`/p/${createdProduct.id}-slug-equivocado`);
    expect(res.statusCode).toBe(301);
    expect(res.headers.location).toBe(`/p/${createdProduct.id}-${createdProduct.slug}`);
  });

  test('GET /p/:id-:slug con ID inexistente devuelve 404', async () => {
    const res = await request(app).get('/p/999999-ben-10');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('fail');
  });

  //Pruebas extras

test('GET /products con filtro price_min devuelve productos con precio mayor o igual', async () => {
  const res = await request(app).get('/products?price_min=10');
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('success');
  expect(res.body.data.data.every(p => p.price >= 10)).toBe(true);
});

test('GET /products con filtro language devuelve coincidencias', async () => {
  const res = await request(app).get('/products?language=Español');
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('success');
  expect(res.body.data.data.every(p => p.language === 'Español')).toBe(true);
});

test('GET /products con filtro season devuelve coincidencias', async () => {
  const res = await request(app).get('/products?season=1');
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('success');
  expect(res.body.data.data.every(p => p.season === 1)).toBe(true);
});

test('GET /products con filtro category devuelve coincidencias', async () => {
  const res = await request(app).get(`/products?category=${createdCategoryId}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('success');
  expect(res.body.data.data.every(p => p.categoryId === createdCategoryId)).toBe(true);
});

test('GET /products con filtro tags devuelve coincidencias', async () => {
  const res = await request(app).get(`/products?tags=${createdTagId}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('success');
  expect(res.body.data.data.every(p => p.Tags.some(t => t.id === createdTagId))).toBe(true);
});

test('GET /products con paginación devuelve número correcto de elementos', async () => {
  const res = await request(app).get('/products?page=1&limit=5');
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('success');
  expect(res.body.data.limit).toBe(5);
});


//final
});
