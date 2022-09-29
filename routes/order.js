const express = require("express");

const orderController = require("../controllers/order");

const router = express.Router();

router.post("/place-order", orderController.postOrder);

router.get("/get-orders",orderController.getOrders);

module.exports = router;
