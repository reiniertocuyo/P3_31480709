var express = require('express'); //Carga el framework Express, que te permite crear servidores web y APIs fácilmente.
var path = require('path'); //Módulo nativo de Node.js para manejar rutas de archivos. Lo usas para servir archivos estáticos.
var cookieParser = require('cookie-parser'); //Middleware que permite leer cookies en las peticiones HTTP. Útil si tu API necesita sesiones o autenticación.
var logger = require('morgan'); //Middleware que imprime en consola cada petición que llega al servidor (método, ruta, tiempo, etc.). Muy útil para depurar.

//No entiendo que hacen estos, algo con las rutas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var endpointsRouter = require('./routes/endpoints');


const authRouter = require('./routes/auth');

var app = express(); //Crea una instancia de la aplicación Express. Aquí es donde defines cómo responde tu servidor

const setupSwagger = require('./swagger');// Esto carga el swagger
setupSwagger(app);//Esto activa el swagger

app.use(logger('dev')); //Activa el logger para mostrar en consola cada petición entrante.
app.use(express.json()); //Permite que tu servidor entienda cuerpos JSON en las peticiones (por ejemplo, cuando alguien hace un POST con datos).
app.use(express.urlencoded({ extended: false })); //Permite procesar datos enviados en formularios HTML (formato application/x-www-form-urlencoded).
app.use(cookieParser()); //Activa el middleware para leer cookies en las peticiones.
app.use(express.static(path.join(__dirname, 'public'))); //Sirve archivos estáticos (HTML, CSS, imágenes) desde la carpeta public

app.use('/auth', authRouter);

app.use('/', indexRouter); //Conecta el archivo routes/index.js a la ruta raíz /.
app.use('/users', usersRouter);//Conecta el archivo routes/users.js a la ruta /users.

//El metodo para modularizar sera Express Router
//Aqui empiezan mis modificaciones
app.use('/', endpointsRouter);//basicamente esto le pide a la aplicación que use la ruta de los endpoints que creamos anteriormente

module.exports = app; //Exporta la instancia de Express para que otros archivos (como bin/www o tus pruebas con Jest) puedan usarla.
