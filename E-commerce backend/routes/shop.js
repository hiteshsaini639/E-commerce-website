const express = require("express");
const shopController = require("../controllers/shop");

const router = express.Router();

router.post("/add-to-cart/:productId", shopController.postCart);

router.get("/get-cartItems", shopController.getCartItems);

router.delete("/delete-item/:itemId",shopController.deleteCartItem);

module.exports = router;
