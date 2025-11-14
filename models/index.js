const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Conexión a SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

// Cargar modelos
//const User = require('./user')(sequelize, DataTypes);
const Category = require('./category')(sequelize, DataTypes);
const Tag = require('./tag')(sequelize, DataTypes);
const Product = require('./product')(sequelize, DataTypes);

// Definir relaciones
Category.associate({ Product });
Tag.associate({ Product });
Product.associate({ Category, Tag });

// Exportar todo
module.exports = {
  sequelize,
  Sequelize,
  Category,
  Tag,
  Product
};
