//Lógica de autenticación

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { success, fail, error } = require('../utils/jsend');

const JWT_SECRET = 'tu_clave_secreta_segura'; // cámbiala en producción
const JWT_EXPIRES_IN = '1h';

exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json(fail({ message: 'Email ya registrado' }));

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashedPassword });

    const safeUser = { id: user.id, fullName: user.fullName, email: user.email };
    res.status(201).json(success(safeUser));
  } catch (err) {
    res.status(500).json(error('Error al registrar usuario'));
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json(fail({ message: 'Credenciales inválidas' }));

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json(fail({ message: 'Credenciales inválidas' }));

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json(success({ token }));
  } catch (err) {
    res.status(500).json(error('Error al iniciar sesión'));
  }
};
