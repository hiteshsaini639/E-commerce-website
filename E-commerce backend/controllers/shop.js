const { JSON } = require("sequelize");
const Product = require("../models/product");

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  const product = Product.findByPk(prodId);
  req.user
    .getCart()
    .then((cart) => {
      return cart.addProduct(prodId);
    })
    .then(() => {
      res.send(product);
    })
    .catch((err) => console.log(err));
};

const PRODUCT_PER_PAGE = 2;

exports.getCartItems = (req, res, next) => {
  const page = +req.query.page;
  let fetchedCart, productCount;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.countProducts();
    })
    .then((count) => {
      productCount = count;
      return fetchedCart.getProducts({
        offset: (page - 1) * PRODUCT_PER_PAGE,
        limit: PRODUCT_PER_PAGE,
      });
    })
    .then((products) => {
      const hasNextPage = page * PRODUCT_PER_PAGE < productCount;
      res.json({ hasNextPage: hasNextPage, cartItems: products });
    })
    .catch((err) => console.log(err));
};
