var express = require('express');
var router = express.Router();


/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Verifica si el servidor está activo
 *     description: Endpoint de prueba que responde con codigo 200 ssi el servidor está funcionando correctamente.
 *     responses:
 *       200:
 *         description: El servidor respondio exitosamente
 */

router.get('/ping', (req, res) => {
  res.status(200).send();//APARENTEMENTE 200 ES UN ESTANDAR EN LA INDUSTRIA O ALGO ASI
});

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Informacion del autor del proyecto
 *     description: Devuelve los datos personales del estudiante responsable del del proyecto.
 *     responses:
 *       200:
 *         description: Datos del autor en formato JSON
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     nombreCompleto:
 *                       type: string
 *                       example: Reinier Tocuyo
 *                     cedula:
 *                       type: string
 *                       example: 31480709
 *                     seccion:
 *                       type: string
 *                       example: Sección 1
 */


router.get('/about', (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      nombreCompleto: "Reinier Tocuyo",
      cedula: "31480709",
      seccion: "Sección 1"
    }
  });
});

module.exports = router;