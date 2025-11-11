module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    description: { type: DataTypes.TEXT }
  });

  Category.associate = models => {
    Category.hasMany(models.Product, { foreignKey: 'categoryId' });
  };

  return Category;
};
