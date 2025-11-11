const slugify = require('slugify');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    stock: DataTypes.INTEGER,
    format: DataTypes.STRING,
    series: DataTypes.STRING,
    season: DataTypes.INTEGER,
    language: DataTypes.STRING,
    release_year: DataTypes.INTEGER,
    publisher: DataTypes.STRING,
    slug: { type: DataTypes.STRING, unique: true }
  });

  Product.associate = models => {
    Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
    Product.belongsToMany(models.Tag, {
      through: 'ProductTags',
      foreignKey: 'productId',
      otherKey: 'tagId'
    });
  };

  Product.beforeCreate(product => {
    product.slug = slugify(product.name, { lower: true });
  });

  Product.beforeUpdate(product => {
    product.slug = slugify(product.name, { lower: true });
  });

  return Product;
};
