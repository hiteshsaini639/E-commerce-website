const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/product");
const shopRoutes = require("./routes/shop");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(productRoutes);
app.use(shopRoutes);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  .sync()
  .then((result) => User.findByPk(1))
  .then((user) => {
    if (!user) {
      return User.create({ name: "Hitesh", email: "hiteshsaini639@gmail.com" });
    }
    return user;
  })
  .then((user) => user.createCart())
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
