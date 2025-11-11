const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const tagController = require('../controllers/tagController');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Gestión de etiquetas asociadas a productos
 */

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Obtener todas las etiquetas
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de etiquetas
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.get('/', tagController.getAllTags);

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     summary: Obtener una etiqueta por ID
 *     tags: [Tags]
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
 *         description: Etiqueta encontrada
 *       404:
 *         description: Etiqueta no encontrada
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.get('/:id', tagController.getTagById);

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Crear una nueva etiqueta
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Etiqueta creada
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.post('/', tagController.createTag);

/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     summary: Actualizar una etiqueta existente
 *     tags: [Tags]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Etiqueta actualizada
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Etiqueta no encontrada
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.put('/:id', tagController.updateTag);

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Eliminar una etiqueta
 *     tags: [Tags]
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
 *         description: Etiqueta eliminada
 *       404:
 *         description: Etiqueta no encontrada
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.delete('/:id', tagController.deleteTag);

module.exports = router;
