const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');


/**
 * @swagger
 * /p/{id}-{slug}:
 *   get:
 *     summary: Obtener producto público por ID y slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado con slug correcto
 *       301:
 *         description: Redirección permanente a la URL correcta si el slug no coincide
 *         headers:
 *           Location:
 *             description: URL corregida del producto
 *             schema:
 *               type: string
 *       404:
 *         description: Producto no encontrado
 */
router.get('/p/:id-:slug', controller.getByIdAndSlug);



/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener productos con filtros públicos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *           description: IDs separados por coma (ej. 1,2,3)
 *       - in: query
 *         name: price_min
 *         schema:
 *           type: number
 *       - in: query
 *         name: price_max
 *         schema:
 *           type: number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *       - in: query
 *         name: publisher
 *         schema:
 *           type: string
 *       - in: query
 *         name: release_year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de productos filtrados
 *       400:
 *         description: Parámetros inválidos
 */
router.get('/', controller.getAllPublicProducts);



//apartir de aqui abajo empiezan las rutas protegidas y esas cosas
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión de productos con relaciones y atributos personalizados
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
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
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               format:
 *                 type: string
 *               series:
 *                 type: string
 *               season:
 *                 type: integer
 *               language:
 *                 type: string
 *               release_year:
 *                 type: integer
 *               publisher:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Datos inválidos o categoría no encontrada
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.post('/', controller.create);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Products]
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
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags: [Products]
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               format:
 *                 type: string
 *               series:
 *                 type: string
 *               season:
 *                 type: integer
 *               language:
 *                 type: string
 *               release_year:
 *                 type: integer
 *               publisher:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       400:
 *         description: Datos inválidos o categoría no encontrada
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Products]
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
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.delete('/:id', controller.remove);

module.exports = router;
