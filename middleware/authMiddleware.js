// Protección con JWT

const jwt = require('jsonwebtoken');
const { fail } = require('../utils/jsend');

const JWT_SECRET = 'tu_clave_secreta_segura'; // misma clave que en el controlador

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(fail({ message: 'Token no proporcionado' }));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // puedes usar req.user en rutas protegidas
    next();
  } catch (err) {
    return res.status(401).json(fail({ message: 'Token inválido o expirado' }));
  }
};
