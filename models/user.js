const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    if (id) {
      this.id = id;
    }
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) });
  }

  addToCart(product) {
    const cartProduct = this.cart.items.find((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    const updatedCartItems = [...this.cart.items];
    if (cartProduct !== undefined) {
      throw {
        success: false,
        message: `Item Already in Cart, ${product.description} (ID #${product._id}) `,
      };
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this.id) },
        { $set: { cart: updatedCart } }
      )
      .then((result) => result)
      .catch((err) => {
        console.log(err);
      });
  }

  getCartItemCount() {
    return this.cart.items.length;
  }

  getCart(offset, limit) {
    const db = getDb();
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .skip(offset)
      .limit(limit)
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getCartAll() {
    const db = getDb();
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });

    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this.id) },
        { $set: { cart: updatedCart } }
      )
      .then((result) => result)
      .catch((err) => {
        console.log(err);
      });
  }

  addOrder(totalPrice, products) {
    const db = getDb();
    const order = {
      items: products,
      user: {
        _id: new mongodb.ObjectId(this.id),
        name: this.name,
      },
      total: totalPrice,
      createdAt: new Date(),
    };

    let newOrder;
    return db
      .collection("orders")
      .insertOne(order)
      .then((result) => {
        newOrder = result;
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new mongodb.ObjectId(this.id) },
            { $set: { cart: this.cart } }
          );
      })
      .then((result) => {
        console.log(result);
        return newOrder;
      });
  }

  getOrders(sortBy, orderType) {
    const val = orderType === "ASC" ? 1 : -1;
    const db = getDb();

    if (sortBy === "total") {
      return db
        .collection("orders")
        .find({ "user._id": new mongodb.ObjectId(this.id) })
        .sort({ total: val })
        .toArray();
    } else {
      return db
        .collection("orders")
        .find({ "user._id": new mongodb.ObjectId(this.id) })
        .sort({ createdAt: val })
        .toArray();
    }
  }
}

module.exports = User;
