const Product = require("../models/product");

exports.removeCartItem = (req, res, next) => {
  const itemId = req.params.itemId;
  if (!itemId) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid URL (Item ID is Missing)" });
  }

  req.user
    .deleteItemFromCart(itemId)
    .then(() => {
      res.status(200).send({
        success: true,
        message: `Item Removed From The Cart, (ID #${itemId})`,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.params.productId;
  if (!prodId) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid URL (Product ID is Missing)" });
  }

  Product.findById(prodId).then((product) => {
    try {
      req.user.addToCart(product).then((result) => {
        res.status(201).send({
          success: true,
          message: `Item, ${product.description} (ID #${prodId}) Added to The Cart`,
        });
      });
    } catch (err) {
      if (err.success === false) {
        res.status(200).send(err);
      } else {
        console.log(err);
      }
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

  const offset = (page - 1) * PRODUCT_PER_PAGE;
  const limit = PRODUCT_PER_PAGE;

  req.user
    .getCart(offset, limit)
    .then((products) => {
      const productCount = req.user.getCartItemCount();
      const hasNextPage = page * PRODUCT_PER_PAGE < productCount;
      const totalPrice = products.reduce((prev, curr) => prev + +curr.price, 0);
      res.status(200).send({
        hasNextPage: hasNextPage,
        cartItems: products,
        total: totalPrice,
        totalCartItems: productCount,
      });
    })
    .catch((err) => console.log(err));
};
