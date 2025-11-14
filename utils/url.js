/**
 * Construye la URL pública de un producto con formato /p/:id-:slug
 * @param {number} id - ID del producto
 * @param {string} slug - Slug actual del producto
 * @returns {string} URL pública del producto
 */
function buildProductUrl(id, slug) {
  return `/p/${id}-${slug}`;
}

module.exports = { buildProductUrl };
