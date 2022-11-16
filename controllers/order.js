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

  req.user.getCartAll().then((products) => {
    const totalPrice = products.reduce(
      (prev, curr) => prev + +curr.price * +qtyObj[curr._id.toString()],
      0
    );
    const newProducts = [...products];
    newProducts.forEach((product) => {
      product.quantity = +qtyObj[product._id.toString()];
    });

    return req.user
      .addOrder(totalPrice, products)
      .then((result) => {
        res.status(201).send({
          success: true,
          message: `Order Sucessfully Placed With Order ID #${result.insertedId}`,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getOrders = (req, res, next) => {
  const sortBy = req.query.sortBy;
  const orderType = req.query.in;
  req.user
    .getOrders(sortBy, orderType)
    .then((orders) => {
      res.status(200).send(orders);
    })
    .catch((err) => console.log(err));
};
