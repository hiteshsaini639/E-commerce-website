const { JSON } = require("sequelize");
const Product = require("../models/product");
const Cart = require("../models/cart");
const CartItem = require("../models/cart-item");
const Order = require("../models/order");
// const OrderItem = require("../models/order-item");
const User = require("../models/user");

exports.postOrder = (req, res, next) => {
  let cartProducts, fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      cartProducts = products;
      const totalPrice = products.reduce((prev, curr) => prev + curr.price, 0);
      return req.user.createOrder({ total: totalPrice });
    })
    .then((order) => {
      return order.addProducts(
        cartProducts.map((product) => {
          product.orderItems = { quantity: req.body[product.id] };
          return product;
        })
      );
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.send(orders);
    })
    .catch((err) => console.log(err));
};
