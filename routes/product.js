const express = require("express");
const productController = require("../controllers/product");

const router = express.Router();

router.get("/get-products", productController.getProducts);

module.exports = router;
