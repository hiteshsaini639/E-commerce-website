const { JSON } = require("sequelize");
const Product = require("../models/product");

exports.deleteCartItem = (req, res, next) => {
  const itemId = req.params.itemId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: itemId } });
    })
    .then((products) => {
      const product = products[0];
      product.cartItems.destroy();
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.params.productId;
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
  let fetchedCart, productCount, totalPrice;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      productCount = products.length;
      totalPrice = products.reduce((prev, curr) => prev + curr.price, 0);
      return fetchedCart.getProducts({
        offset: (page - 1) * PRODUCT_PER_PAGE,
        limit: PRODUCT_PER_PAGE,
      });
    })
    .then((products) => {
      const hasNextPage = page * PRODUCT_PER_PAGE < productCount;
      res.json({
        hasNextPage: hasNextPage,
        cartItems: products,
        total: totalPrice,
        totalCartItems: productCount,
      });
    })
    .catch((err) => console.log(err));
};
