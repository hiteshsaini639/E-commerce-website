const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/product");
const shopRoutes = require("./routes/shop");
const orderRoutes = require("./routes/order");
const User = require("./models/user");

const mongoConnect = require("./util/database").mongoConnect;

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.use((req, res, next) => {
  User.findById("6373435191b6373d9d373e8e")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use(productRoutes);
app.use(shopRoutes);
app.use(orderRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

app.use("/", (req, res, next) => {
  res.status(404).json({ success: false, message: "Oops...Page Not Found" });
});

mongoConnect(() => {
  app.listen(3000);
});
