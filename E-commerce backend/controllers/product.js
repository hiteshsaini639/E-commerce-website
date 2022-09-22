const { JSON } = require("sequelize");
const Product = require("../models/product");

const PRODUCT_PER_PAGE = 4;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page;
  let productCount;
  Product.count()
    .then((count) => {
      productCount = count;
      return Product.findAll({
        offset: (page - 1) * PRODUCT_PER_PAGE,
        limit: PRODUCT_PER_PAGE,
      });
    })
    .then((products) => {
      const hasNextPage = page * PRODUCT_PER_PAGE < productCount;
      res.json({ hasNextPage: hasNextPage, products: products });
    })
    .catch((err) => console.log(err));
};
