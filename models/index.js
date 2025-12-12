const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Conexión a SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

// Cargar modelos
const User = require('./user')(sequelize, DataTypes);
const Category = require('./category')(sequelize, DataTypes);
const Tag = require('./tag')(sequelize, DataTypes);
const Product = require('./product')(sequelize, DataTypes);
const Order = require('./order')(sequelize, DataTypes);
const OrderItem = require('./orderItem')(sequelize, DataTypes);

// Definir relaciones existentes
Category.associate({ Product });
Tag.associate({ Product });
Product.associate({ Category, Tag });

// Definir relaciones nuevas
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Exportar todo (manteniendo tu estilo original)
module.exports = {
  sequelize,
  Sequelize,
  User,
  Category,
  Tag,
  Product,
  Order,
  OrderItem
};
