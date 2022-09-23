const { JSON } = require("sequelize");
const Product = require("../models/product");
const Cart = require("../models/cart");
const CartItem = require("../models/cart-item");
const Order = require("../models/order");
// const OrderItem = require("../models/order-item");
const User = require("../models/user");

exports.postOrder = (req, res, next) => {
  let cartProducts;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      cartProducts = products;
      return req.user.createOrder();
    })
    .then((order) => {
      return order.addProducts(
        cartProducts.map((product) => {
          product.orderItems = { quantity: req.body[product.id] };
          return product;
        })
      );
    })
    .catch((err) => console.log(err));
};
