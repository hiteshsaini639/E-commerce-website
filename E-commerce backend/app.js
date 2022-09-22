const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/product");
const sequelize = require("./util/database");
const Product = require("./models/product");

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.use(productRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
