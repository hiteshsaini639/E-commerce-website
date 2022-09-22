const { JSON } = require("sequelize");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.send(products);
    })
    .catch((err) => console.log(err));
};
