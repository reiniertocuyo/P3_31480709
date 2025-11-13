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
