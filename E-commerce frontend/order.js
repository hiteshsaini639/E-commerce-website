const ordersEle = document.getElementById("orders");

// get orders on dom load
window.addEventListener("DOMContentLoaded", getOrders);

//get orders
async function getOrders() {
  try {
    const { data } = await axios.get("http://localhost:3000/get-orders");
    ordersEle.innerHTML = "";
    if (data.length === 0) {
      ordersEle.innerHTML = "<h1 style='font-size:3rem'>No Orders Yet</h1>";
    } else {
      data.forEach((order) => {
        showOrder(order);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// formating date local
function formatDate(date) {
  const daysPassed = Math.round((new Date() - date) / (1000 * 60 * 60 * 24));
  if (daysPassed === 0) return "Today";
  else if (daysPassed === 1) return "Yesterday";
  // else if (daysPassed <= 3) return `${daysPassed} days ago`;
  else {
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-IN", options).format(date);
  }
}

function showOrder(order) {
  const productsRows = order.products
    .map(function (product) {
      return ` <div class="cart-row">
        <span class="cart-item cart-column">
          <img class="cart-img" src="${product.image}" alt="" />
          <span>${product.description}</span>
        </span>
        <span class="cart-price cart-column"><i class="fa fa-indian-rupee-sign">${product.price}</i></span>
        <span class="cart-quantity cart-column">${product.orderItems.quantity}</span>
      </div>`;
    })
    .join("");
  const orderPlacedOn = formatDate(new Date(order.createdAt));
  const newOrder = `<div class="order">
    <div class="order-header">
      <div class="order-placed">
        <span>ORDER PLACED</span>
        <span>${orderPlacedOn}</span>
      </div>
      <div class="order-total">
        <span>TOTAL</span>
        <span><i class="fa fa-indian-rupee-sign">${order.total}</i></span>
      </div>
      <div class="order-id">
        <span>ORDER-ID</span>
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

  ordersEle.insertAdjacentHTML("afterbegin", newOrder);
}
