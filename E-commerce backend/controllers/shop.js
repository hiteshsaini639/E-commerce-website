const { JSON } = require("sequelize");
const Product = require("../models/product");

exports.removeCartItem = (req, res, next) => {
  const itemId = req.params.itemId;
  let productDes;
  if (!itemId) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid URL (Item ID is Missing)" });
  }
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: itemId } });
    })
    .then((products) => {
      const product = products[0];
      productDes = product.description;
      return product.cartItems.destroy();
    })
    .then(() => {
      res.status(200).send({
        success: true,
        message: `Item Removed From The Cart, ${productDes} (ID #${itemId})`,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = +req.params.productId;
  if (!prodId) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid URL (Product ID is Missing)" });
  }
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      for (let product of products) {
        if (product.id === prodId) {
          throw {
            success: false,
            message: `Item Already in Cart, ${product.description} (ID #${prodId}) `,
          };
        }
      }
      return fetchedCart;
    })
    .then((cart) => {
      return cart.addProduct(prodId);
    })
    .then(() => {
      return Product.findByPk(prodId);
    })
    .then((product) => {
      res.status(201).send({
        success: true,
        message: `Item, ${product.description} (ID #${prodId}) Added to The Cart`,
      });
    })
    .catch((err) => {
      if (err.success === false) {
        res.status(200).send(err);
      } else {
        console.log(err);
      }
    });
};

const PRODUCT_PER_PAGE = 2;

exports.getCartItems = (req, res, next) => {
  const page = +req.query.page;
  if (!page) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid URL (Page no. is Missing)" });
  }
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
      res.status(200).send({
        hasNextPage: hasNextPage,
        cartItems: products,
        total: totalPrice,
        totalCartItems: productCount,
      });
    })
    .catch((err) => console.log(err));
};
