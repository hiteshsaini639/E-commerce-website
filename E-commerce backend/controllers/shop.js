const { JSON } = require("sequelize");
const Product = require("../models/product");
const Cart = require("../models/cart");
const CartItem = require("../models/cart-item");

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  const product = Product.findByPk(prodId);
  req.user
    .getCart()
    .then((cart) => {
      return cart.addProduct(prodId);
    })
    .then(() => {
      res.json({ message: "added successfully" });
    })
    .catch((err) => console.log(err));
};

exports.getCartItems = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.send(products);
    })
    .catch((err) => console.log(err));
};
