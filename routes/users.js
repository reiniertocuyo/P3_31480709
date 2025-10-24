var express = require('express');
var router = express.Router();

const usersController = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware'); // lo definiremos en el bloque 3

router.use(authMiddleware); // protege todas las rutas

router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
