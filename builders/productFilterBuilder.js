const { Op } = require('sequelize');

module.exports = (params) => {
  const where = {};
  const include = [];

  // Paginación
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 10;
  const offset = (page - 1) * limit;

  // Búsqueda textual
  if (params.search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${params.search}%` } },
      { description: { [Op.iLike]: `%${params.search}%` } },
      { series: { [Op.iLike]: `%${params.search}%` } }
    ];
  }

  // Filtros numéricos
  if (params.price_min || params.price_max) {
    where.price = {};
    if (params.price_min) where.price[Op.gte] = parseFloat(params.price_min);
    if (params.price_max) where.price[Op.lte] = parseFloat(params.price_max);
  }

  if (params.release_year) {
    where.release_year = parseInt(params.release_year);
  }

  // Filtros exactos
  if (params.format) {
    where.format = params.format;
  }

  if (params.publisher) {
    where.publisher = params.publisher;
  }

  if (params.category) {
    include.push({
      model: require('../models').Category,
      where: { name: params.category },
      required: true
    });
  }

  if (params.tags) {
    const tagIds = params.tags.split(',').map(id => parseInt(id));
    include.push({
      model: require('../models').Tag,
      where: { id: { [Op.in]: tagIds } },
      through: { attributes: [] },
      required: true
    });
  }

  return { where, include, limit, offset };
};
