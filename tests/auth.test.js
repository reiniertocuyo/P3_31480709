//pruebas de registro y login
const request = require('supertest');
const app = require('../app'); // Asegúrate de que este sea tu archivo principal de Express

// Genera un email único para cada test usando timestamp
const uniqueEmail = () => `user_${Date.now()}@example.com`;

describe('Pruebas de Registro y Login', () => {
  let testEmail;
  const testPassword = 'clave123';

  beforeEach(() => {
    testEmail = uniqueEmail();
  });

  test('Registro exitoso con datos válidos', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        fullName: 'Usuario Test',
        email: testEmail,
        password: testPassword
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.email).toBe(testEmail);
  });

  test('Reegistro con email duplicado', async () => {
    // Primero registramos
    await request(app)
      .post('/auth/register')
      .send({
        fullName: 'Usuario Duplicado',
        email: testEmail,
        password: testPassword
      });

    // Luego intentamos registrar el mismo email otra vez
    const res = await request(app)
      .post('/auth/register')
      .send({
        fullName: 'Usuario Duplicado',
        email: testEmail,
        password: testPassword
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
    expect(res.body.data.message).toMatch(/Email ya registrado/i);
  });

  test('Login exitoso con credenciales válidas', async () => {
    // Registramos primero
    await request(app)
      .post('/auth/register')
      .send({
        fullName: 'Usuario Login',
        email: testEmail,
        password: testPassword
      });

    // Luego hacemos login
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: testEmail,
        password: testPassword
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.token).toBeDefined();
  });

  test('Login con email incorrecto', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'noexiste@example.com',
        password: testPassword
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('fail');
    expect(res.body.data.message).toMatch(/Credenciales inválidas/i);
  });

  test('Login con contraseña incorrecta', async () => {
    // Registramos primero
    await request(app)
      .post('/auth/register')
      .send({
        fullName: 'Usuario Contraseña Incorrecta',
        email: testEmail,
        password: testPassword
      });

    // Intentamos login con contraseña incorrecta
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: testEmail,
        password: 'claveIncorrecta'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('fail');
    expect(res.body.data.message).toMatch(/Credenciales inválidas/i);
  });
});
