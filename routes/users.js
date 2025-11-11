const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // protege todas las rutas

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios registrados
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.get('/', usersController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.get('/:id', usersController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear nuevo usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.post('/', usersController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.put('/:id', usersController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.delete('/:id', usersController.deleteUser);

module.exports = router;
