const ordersEle = document.getElementById("orders");

window.addEventListener("DOMContentLoaded", getOrders);

async function getOrders() {
  try {
    const orders = await axios.get("http://localhost:3000/get-orders");
    console.log(orders);
    ordersEle.innerHTML = "";
    orders.data.forEach((order) => {
      showOrder(order);
    });
  } catch (err) {
    console.log(err);
  }
}

function showOrder(order) {
  const total = order.products.reduce((prev, curr) => prev + curr.price, 0);
  const productsRows = order.products
    .map(function (product) {
      return ` <div class="cart-row">
        <span class="cart-item cart-column">
          <img class="cart-img" src="${product.image}" alt="" />
          <span>${product.description}</span>
        </span>
        <span class="cart-price cart-column">${product.price}</span>
        <span class="cart-quantity cart-column">${product.orderItems.quantity}</span>
      </div>`;
    })
    .join("");
  const newOrder = `<div class="order">
    <div class="order-header">
      <div class="order-placed">
        <span>Order placed</span>
        <span>${order.createdAt}</span>
      </div>
      <div class="order-total">
        <span>Total</span>
        <span>${total}</span>
      </div>
      <div class="order-id">
        <span>Order-ID</span>
        <span>#${order.id}</span>
      </div>
    </div>
    <div class="order-items">
      <div class="cart-row cart-header">
        <span class="cart-item cart-column">ITEM</span>
        <span class="cart-price cart-column">PRICE</span>
        <span class="cart-quantity cart-column">QUANTITY</span>
      </div>
    </div>
    <div id="cart-items">${productsRows}</div>
  </div>`;

  ordersEle.innerHTML += newOrder;
}
