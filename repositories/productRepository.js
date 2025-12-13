const { Product, Category, Tag } = require('../models');
const buildProductFilters = require('../builders/productFilterBuilder');

exports.findWithFilters = async (queryParams) => {
  const { where, include, limit, offset } = buildProductFilters(queryParams);

  const products = await Product.findAndCountAll({
    where,
    include,
    limit,
    offset,
    distinct: true
  });

  return {
    total: products.count,
    page: Math.floor((offset || 0) / (limit || 10)) + 1,
    limit: limit || 10,
    data: products.rows
  };
};


// Verificar stock disponible
exports.hasSufficientStock = async (productId, quantity) => {
  const product = await Product.findByPk(productId);
  if (!product) return false;
  return product.stock >= quantity;
};

// Reducir stock después de una compra
exports.reduceStock = async (productId, quantity, transaction) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Producto no encontrado');

  if (product.stock < quantity) throw new Error('Stock insuficiente');

  product.stock -= quantity;
  
  // CORRECCIÓN CLAVE: Usamos 'fields' para asegurar que SOLO se actualice el campo 'stock'.
  // Esto evita que el hook que genera/valida el slug se ejecute.
  await product.save({ 
    transaction,
    fields: ['stock'] // <--- ¡Esto soluciona el problema del slug!
  });
  
  return product;
};