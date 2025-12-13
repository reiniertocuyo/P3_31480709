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
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentReference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: true
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
