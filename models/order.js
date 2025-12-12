module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    status: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'CANCELED', 'PAYMENT_FAILED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    }
  }, {});

  Order.associate = (models) => {
    // Un Order pertenece a un User
    Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

    // Un Order tiene muchos OrderItems
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
  };

  return Order;
};
