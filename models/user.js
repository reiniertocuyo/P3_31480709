/**
 * @swagger
 * /about:
 *   get:
 *     summary: Modelo user
 *     responses:
 *       200:
 *         description: Define el modelo User con los campos requeridos, Aplica validaciones (email único, formato válido), Incluye timestamps para createdAt y updatedAt
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = User;
