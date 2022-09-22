const express = require("express");
const shopController = require("../controllers/shop");

const router = express.Router();

router.post("/add-to-cart", shopController.postCart);

router.get("/get-cartItems",shopController.getCartItems);

module.exports = router;
