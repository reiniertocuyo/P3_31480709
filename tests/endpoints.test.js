const request = require('supertest'); //una herramienta que permite simular peticiones HTTP sin necesidad de abrir el navegador
const app = require('../app'); //Importa el servidor desde el app.js

describe('GET /ping', () => {
  it('debe responde rcon 200 y cuerpo vacío', async () => { //define una prueba específica.
    const res = await request(app).get('/ping'); //Simula una peticion
    expect(res.statusCode).toBe(200); //Verifica si el servidor arroja un 200
    expect(res.text).toBe(''); //verifica si el cuerpo de la respuesta esta vacio
  });
});

describe('GET /about', () => {
  it('debe responder con 200 y objeto JSend', async () => { 
    const res = await request(app).get('/about');
    expect(res.statusCode).toBe(200); //Espera recibir una respuesta 200 del servidor
    expect(res.body).toEqual({ //espera recibir el .json
      status: 'success',
      data: {
        nombreCompleto: 'Reinier Tocuyo',
        cedula: '31480709',
        seccion: 'Sección 1'
      }
    });
  });
});
