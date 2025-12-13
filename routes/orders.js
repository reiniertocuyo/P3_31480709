const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestión de órdenes y checkout transaccional
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear una nueva orden (checkout transaccional)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - paymentMethod
 *               - paymentDetails
 *             properties:
 *               items:
 *                 type: array
 *                 description: Productos a comprar
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *               paymentMethod:
 *                 type: string
 *                 example: credit_card
 *                 description: Método de pago seleccionado
 *               paymentDetails:
 *                 type: object
 *                 description: Datos requeridos por fakePayment (POST /payments)
 *                 required:
 *                   - full-name
 *                   - card-number
 *                   - expiration-month
 *                   - expiration-year
 *                   - cvv
 *                   - amount
 *                   - currency
 *                   - description
 *                 properties:
 *                   full-name:
 *                     type: string
 *                     example: John Doe
 *                   card-number:
 *                     type: string
 *                     example: "4111111111111111"
 *                   expiration-month:
 *                     type: string
 *                     example: "12"
 *                   expiration-year:
 *                     type: string
 *                     example: "2026"
 *                   cvv:
 *                     type: string
 *                     example: "123"
 *                   amount:
 *                     type: number
 *                     example: 29.99
 *                   currency:
 *                     type: string
 *                     example: USD
 *                   description:
 *                     type: string
 *                     example: "Compra de DVD edición coleccionista"
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *       400:
 *         description: Error de validación de datos de pago o productos
 *       401:
 *         description: Token no proporcionado o inválido
 *       402:
 *         description: Pago rechazado (fondos insuficientes, tarjeta inválida, etc.)
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', authMiddleware, orderController.checkout);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Obtener historial de órdenes del usuario autenticado
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Lista de órdenes
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.get('/', authMiddleware, orderController.getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obtener detalle de una orden específica
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Detalle de la orden
 *       404:
 *         description: Orden no encontrada
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.get('/:id', authMiddleware, orderController.getOrderById);

module.exports = router;
