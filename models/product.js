const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Product {
  constructor(image, price, description) {
    this.image = image;
    this.price = price;
    this.description = description;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .catch((err) => console.log(err));
  }

  static fetchAll(offset, limit) {
    const db = getDb();

    return db
      .collection("products")
      .find()
      .skip(offset)
      .limit(limit)
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then((product) => product)
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
