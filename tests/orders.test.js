const request = require('supertest');
const app = require('../app');
// Importar los modelos necesarios para la inicialización
const { Product, Category } = require('../models'); 

const testEmail = 'reinier@example.com';
const testPassword = 'clave123';
let validToken = '';
let createdOrderId = '';
let testProductId = ''; // Variable para almacenar el ID del producto creado dinámicamente

jest.setTimeout(15000); // todos los tests tendrán 15 segundos

describe('Pruebas de rutas protegidas /orders', () => {
  beforeAll(async () => {
    // --- 1. Lógica de login/registro ---
    const loginRes = await request(app)
      .post('/login')
      .send({
        email: testEmail,
        password: testPassword
      });

    // Si el login falla, registrar y reintentar
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
    
    // --- 2. Inicialización de Datos Críticos para el Test (Fallo 400) ---
    
    // Garantizar que la Categoría 1 exista (FK obligatoria)
    await Category.upsert({
        id: 1, 
        name: 'Categoría Base de Prueba', 
        description: 'Necesaria para FK',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    // Crear el Producto (SIN ID HARDCODED) y capturar el ID asignado automáticamente
    // Usamos upsert para insertarlo o actualizarlo
    await Product.upsert({ 
        // ID no se especifica, Sequelize lo asignará automáticamente
        name: "Producto Coleccionista Test",
        description: "Producto con stock suficiente para test.",
        price: 29.99,
        stock: 50, 
        categoryId: 1, 
        format: 'DVD',
        series: 'Test Series',
        season: 1,
        language: 'Español',
        release_year: 2002,
        publisher: 'Test Publisher',
        createdAt: new Date(),
        updatedAt: new Date(),
    });
     
     // BUSCAMOS EL PRODUCTO CREADO (el último insertado con ese nombre)
     const productInstance = await Product.findOne({ 
         where: { name: "Producto Coleccionista Test" },
         order: [['id', 'DESC']] // Aseguramos capturar el ID si ya existían productos
     });
     
     if (productInstance) {
        testProductId = productInstance.id; // CAPTURAMOS EL ID DINÁMICO
     } else {
        throw new Error("ERROR: No se pudo crear el producto de prueba para la orden.");
     }
    // ----------------------------------------------------
  });

  test('Acceso a /orders sin token debe ser rechazado', async () => {
    const res = await request(app).get('/orders');
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('fail');
  });

  test('Checkout exitoso con token válido', async () => {
    // Utilizamos el ID dinámico: testProductId
    expect(testProductId).toBeTruthy(); 
    
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        items: [{ productId: testProductId, quantity: 1 }], // << USO DEL ID DINÁMICO
        paymentMethod: 'credit_card',
        paymentDetails: {
          'full-name': 'John Doe',
          'card-number': '5555555555554444', 
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
    // Aseguramos que un producto inexistente o una cantidad muy alta falle con 400
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        items: [{ productId: testProductId, quantity: 1000 }], // Usamos un stock imposible
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
    // Este test verificará la corrección del error 500 de asociación
    const res = await request(app)
      .get('/orders?page=1&limit=5')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('Detalle de orden existente', async () => {
    // Este test depende de que createdOrderId se haya capturado del test anterior
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