//logica de cada endpoint

const User = require('../models/user');
const { success, fail, error } = require('../utils/jsend');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(success(users));
  } catch (err) {
    res.status(500).json(error('Error al obtener usuarios'));
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json(fail({ message: 'Usuario no encontrado' }));
    res.json(success(user));
  } catch (err) {
    res.status(500).json(error('Error al obtener usuario'));
  }
};

exports.createUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const user = await User.create({ fullName, email, password });
    const safeUser = { id: user.id, fullName: user.fullName, email: user.email };
    res.status(201).json(success(safeUser));
  } catch (err) {
    res.status(400).json(error('Error al crear usuario'));
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json(fail({ message: 'Usuario no encontrado' }));

    const { fullName, email } = req.body;
    await user.update({ fullName, email });
    const safeUser = { id: user.id, fullName: user.fullName, email: user.email };
    res.json(success(safeUser));
  } catch (err) {
    res.status(400).json(error('Error al actualizar usuario'));
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json(fail({ message: 'Usuario no encontrado' }));

    await user.destroy();
    res.json(success({ message: 'Usuario eliminado' }));
  } catch (err) {
    res.status(500).json(error('Error al eliminar usuario'));
  }
};
