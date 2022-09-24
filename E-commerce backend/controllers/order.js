const { JSON } = require("sequelize");

exports.postOrder = (req, res, next) => {
  const qtyObj = req.body;
  if (!qtyObj || Object.keys(qtyObj).length === 0) {
    return res
      .status(400)
      .send({ success: false, message: "Order Cannot be Placed Without Item" });
  }
  for (key in qtyObj) {
    let error = false,
      errMsg;
    if (qtyObj[key] === "") {
      error = true;
      errMsg = "empty";
    } else if (Number(qtyObj[key]) === 0) {
      error = true;
      errMsg = "zero";
    } else if (Number(qtyObj[key]) < 0) {
      error = true;
      errMsg = "negative";
    }
    if (error) {
      return res.status(400).send({
        success: false,
        message: `Item Quantity Cannot Be ${errMsg} (Item ID #${key})`,
      });
    }
  }
  let cartProducts, fetchedCart, orderId;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      cartProducts = products;
      const totalPrice = products.reduce(
        (prev, curr) => prev + curr.price * qtyObj[curr.id],
        0
      );
      return req.user.createOrder({ total: totalPrice });
    })
    .then((order) => {
      orderId = order.id;
      return order.addProducts(
        cartProducts.map((product) => {
          product.orderItems = { quantity: qtyObj[product.id] };
          return product;
        })
      );
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.status(201).send({
        success: true,
        message: `Order Sucessfully Placed With Order ID #${orderId}`,
      });
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.status(200).send(orders);
    })
    .catch((err) => console.log(err));
};
