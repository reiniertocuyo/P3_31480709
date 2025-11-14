const { Product, Category, Tag } = require('../models');
const { success, fail, error } = require('../utils/jsend');
const { Op } = require('sequelize');

exports.create = async (req, res) => {
  try {
    const { name, description, price, stock, format, series, season, language, release_year, publisher, categoryId, tagIds } = req.body;

    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(400).json(fail({ message: 'Categoría no válida' }));

    const product = await Product.create({
      name, description, price, stock, format, series, season, language, release_year, publisher, categoryId
    });

    if (Array.isArray(tagIds) && tagIds.length > 0) {
      const tags = await Tag.findAll({ where: { id: tagIds } });
      await product.setTags(tags);
    }

    const result = await Product.findByPk(product.id, { include: [Category, Tag] });
    res.status(201).json(success(result));
  } catch (err) {
    res.status(500).json(error('Error al crear producto'));
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: [Category, Tag] });
    if (!product) return res.status(404).json(fail({ message: 'Producto no encontrado' }));
    res.json(success(product));
  } catch (err) {
    res.status(500).json(error('Error al obtener producto'));
  }
};

exports.update = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json(fail({ message: 'Producto no encontrado' }));

    const { name, description, price, stock, format, series, season, language, release_year, publisher, categoryId, tagIds } = req.body;

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) return res.status(400).json(fail({ message: 'Categoría no válida' }));
    }

    await product.update({
      name, description, price, stock, format, series, season, language, release_year, publisher, categoryId
    });

    if (Array.isArray(tagIds)) {
      const tags = await Tag.findAll({ where: { id: tagIds } });
      await product.setTags(tags);
    }

    const updated = await Product.findByPk(product.id, { include: [Category, Tag] });
    res.json(success(updated));
  } catch (err) {
    res.status(500).json(error('Error al actualizar producto'));
  }
};

exports.remove = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json(fail({ message: 'Producto no encontrado' }));

    await product.destroy();
    res.json(success({ message: 'Producto eliminado' }));
  } catch (err) {
    res.status(500).json(error('Error al eliminar producto'));
  }
};

const productRepository = require('../repositories/productRepository');
exports.getAllPublicProducts = async (req, res) => {
  try {
    const filters = req.query;
    const result = await productRepository.findWithFilters(filters);
    res.json(success(result));
  } catch (err) {
    res.status(500).json(error('Error al obtener productos'));
  }
};


const { buildProductUrl } = require('../utils/url');

exports.getByIdAndSlug = async (req, res) => {
  try {
    const { id, slug } = req.params;

    const product = await Product.findByPk(id, { include: [Category, Tag] });
    if (!product) {
      console.log('No se encontró producto, devolviendo fail');
      return res.status(404).json(fail({ message: 'Producto no encontrado' }));
    }

    if (product.slug !== slug) {
      const correctUrl = buildProductUrl(product.id, product.slug);
      return res.redirect(301, correctUrl);
    }

    return res.json(success(product));
  } catch (err) {
    return res.status(500).json(error('Error al obtener producto público'));
  }
};


//const { Product, Category, Tag } = require('../models');
exports.getAllProductsRaw = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [Category, Tag]
    });
    return res.json({
      status: 'success',
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener productos',
      data: error.message
    });
  }
};
