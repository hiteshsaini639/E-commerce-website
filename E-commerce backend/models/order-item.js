const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const OrderItem = sequelize.define("orderItems", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  quantity: {
    type: Sequelize.INTEGER.UNSIGNED,
  },
});

module.exports = OrderItem;
