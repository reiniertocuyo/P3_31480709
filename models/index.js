const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Conexión a SQLite
const sequelize = new Sequelize({
 dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
   logging: false
});

// Cargar modelos
const User = require('./user'); // Mantenemos esta línea, asumiendo que ya importa el modelo definido.
                               // Sin embargo, para que funcione la asociación, necesitamos que 'User' tenga los métodos.
// --- INICIO DE CORRECCIÓN (Carga de Modelos y Agrupación) ---
const models = { // Creamos un objeto para agrupar los modelos
    User, // User ya está cargado como objeto modelo (según tu user.js)
    Category: require('./category')(sequelize, DataTypes),
    Tag: require('./tag')(sequelize, DataTypes),
    Product: require('./product')(sequelize, DataTypes),
    Order: require('./order')(sequelize, DataTypes),
    OrderItem: require('./orderItem')(sequelize, DataTypes)
};

// Desestructuramos para la compatibilidad con el código más abajo
const { Category, Tag, Product, Order, OrderItem } = models;

// Definir relaciones existentes (Estas ya se definen correctamente con el .associate que has usado para Cat/Tag/Prod)
Category.associate(models); // Usamos 'models' para darle acceso a todos (Order, OrderItem, etc.)
Tag.associate(models);
Product.associate(models);


// Definir relaciones nuevas (Sólo relaciones del lado de User, el resto son redundantes)
// La línea Order.belongsTo(User, { as: 'user' }) de abajo causa el error, porque ya está en order.js

// 1. Ejecutar las asociaciones definidas dentro de los modelos de compra
// Ya que 'User' no tiene .associate, debemos hacer las dos partes de la relación por separado.
// Para que esto funcione, necesitamos forzar la asociación de User a Order.

// --- INICIO DE CAMBIOS ---

// 2. Definir manualmente las asociaciones de compra que involucren a User, ya que su modelo no tiene .associate
// Solo definimos la parte User -> Order, ya que Order -> User ya está en Order.js y se ejecuta en la línea de abajo.

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

// ESTA LÍNEA DEBE ELIMINARSE PORQUE DUPLICA LA ASOCIACIÓN CON EL ALIAS 'user'
// Order.belongsTo(User, { foreignKey: 'userId', as: 'user' }); 

// Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' }); // ESTAS YA ESTÁN EN order.js
// OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' }); // ESTAS YA ESTÁN EN orderItem.js

// Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' }); // ESTAS YA ESTÁN EN product.js
// OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' }); // ESTAS YA ESTÁN EN orderItem.js

// Ejecutamos las asociaciones de Order y OrderItem para que funcionen con User/Product
Order.associate(models); 
OrderItem.associate(models); 
// Nota: Si Product.associate ya asocia OrderItem, se puede omitir OrderItem.associate.

// --- FIN DE CAMBIOS ---

// Exportar todo (manteniendo tu estilo original)
module.exports = {
   sequelize,
   Sequelize,
   ...models, // Exportamos todos los modelos desde el objeto 'models'
};