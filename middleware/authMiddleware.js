// Protección con JWT

const jwt = require('jsonwebtoken'); // Importa la librería JWT para verificar y decodificar tokens
const { fail } = require('../utils/jsend'); // Importa la función 'fail' para responder con formato JSend en caso de error

// Clave secreta usada para firmar y verificar los tokens JWT
const JWT_SECRET = 'tu_clave_secreta_segura'; // misma clave que en el controlador

// Exporta el middleware como una función que recibe la petición, respuesta y next
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization; // Extrae el header 'Authorization' de la petición
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(fail({ message: 'Token no proporcionado' }));
  }

  const token = authHeader.split(' ')[1];// Extrae el token quitando la palabra 'Bearer '
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json(fail({ message: 'Token inválido o expirado' })); // Si el token es inválido o expiró, responde con 401 y mensaje de error
  }
};
