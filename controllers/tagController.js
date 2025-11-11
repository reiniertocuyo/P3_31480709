const { Tag } = require('../models');
const { success, fail, error } = require('../utils/jsend');

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.json(success(tags));
  } catch (err) {
    res.status(500).json(error('Error al obtener etiquetas'));
  }
};

exports.getTagById = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) return res.status(404).json(fail({ message: 'Etiqueta no encontrada' }));
    res.json(success(tag));
  } catch (err) {
    res.status(500).json(error('Error al obtener etiqueta'));
  }
};

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await Tag.create({ name });
    res.status(201).json(success(tag));
  } catch (err) {
    res.status(400).json(error('Error al crear etiqueta'));
  }
};

exports.updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) return res.status(404).json(fail({ message: 'Etiqueta no encontrada' }));

    const { name } = req.body;
    await tag.update({ name });
    res.json(success(tag));
  } catch (err) {
    res.status(400).json(error('Error al actualizar etiqueta'));
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) return res.status(404).json(fail({ message: 'Etiqueta no encontrada' }));

    await tag.destroy();
    res.json(success({ message: 'Etiqueta eliminada' }));
  } catch (err) {
    res.status(500).json(error('Error al eliminar etiqueta'));
  }
};
