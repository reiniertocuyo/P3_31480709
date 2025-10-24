/**
 * @swagger
 * /about:
 *   get:
 *     summary: Crea una instancia de Sequelize usando SQLite como motor
 *     responses:
 *       200:
 *         description: Guarda los datos en un archivo local database.sqlite
 */

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false, // Opcional: silencia logs de SQL
});

module.exports = sequelize;