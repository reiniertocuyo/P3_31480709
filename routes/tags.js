const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const tagController = require('../controllers/tagController');

router.use(authMiddleware);

// Rutas protegidas (CRUD)
router.get('/', tagController.getAllTags);
router.get('/:id', tagController.getTagById);
router.post('/', tagController.createTag);
router.put('/:id', tagController.updateTag);
router.delete('/:id', tagController.deleteTag);

module.exports = router;
