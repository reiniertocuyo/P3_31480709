module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
  });

  Tag.associate = models => {
    Tag.belongsToMany(models.Product, {
      through: 'ProductTags',
      foreignKey: 'tagId',
      otherKey: 'productId'
    });
  };

  return Tag;
};
