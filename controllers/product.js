const Product = require("../models/product");
const getDb = require("../util/database").getDb;

const PRODUCT_PER_PAGE = 6;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page;
  if (!page) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid URL (Page no. is Missing)" });
  }

  fun();
  async function fun() {
    const totalCartItems = req.user.getCartItemCount();
    const offset = (page - 1) * PRODUCT_PER_PAGE;
    const limit = PRODUCT_PER_PAGE;
    const db = getDb();
    const productCount = await db.collection("products").count();
    const hasNextPage = page * PRODUCT_PER_PAGE < productCount;
    Product.fetchAll(offset, limit).then((products) => {
      res.status(200).send({
        hasNextPage: hasNextPage,
        products: products,
        totalCartItems: totalCartItems,
      });
    });
  }
};
