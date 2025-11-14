const { Category } = require('../models');
const { success, fail, error } = require('../utils/jsend');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(success(categories));
  } catch (err) {
    res.status(500).json(error('Error al obtener categorías'));
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json(fail({ message: 'Categoría no encontrada' }));
    res.json(success(category));
  } catch (err) {
    res.status(500).json(error('Error al obtener categoría'));
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json(success(category));
  } catch (err) {
    res.status(400).json(error('Error al crear categoría'));
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json(fail({ message: 'Categoría no encontrada' }));

    const { name, description } = req.body;
    await category.update({ name, description });
    res.json(success(category));
  } catch (err) {
    res.status(400).json(error('Error al actualizar categoría'));
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json(fail({ message: 'Categoría no encontrada' }));

    await category.destroy();
    res.json(success({ message: 'Categoría eliminada' }));
  } catch (err) {
    res.status(500).json(error('Error al eliminar categoría'));
  }
};
