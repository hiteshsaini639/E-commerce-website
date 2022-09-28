const ordersEle = document.getElementById("orders");
const searchInput = document.getElementById("search");
const daysSelect = document.getElementById("days");
const sortSelect = document.getElementById("sort");
const orderNumber = document.getElementById("order-number");
const noResult = document.getElementById("no-result");
const noOrder = document.getElementById("no-order");

////////////////////////// sorting in order according to input/////////////////////////////
sortSelect.addEventListener("change", (e) => {
  if (e.target.value == "newest") {
    getOrders("createdAt", "ASC");
  } else if (e.target.value == "oldest") {
    getOrders("createdAt", "DESC");
  } else if (e.target.value == "totalAsc") {
    getOrders("total", "DESC");
  } else if (e.target.value == "totalDesc") {
    getOrders("total", "ASC");
  }
});

/////////////////////////////////order in last x days//////////////////////////////////////
daysSelect.addEventListener("change", (e) => {
  noResult.style.display = "none";
  searchInput.value = "";
  const ordersArr = document.querySelectorAll(".order");
  let count = 0;
  ordersArr.forEach((order) => {
    if (order.dataset.dayspassed <= +e.target.value) {
      order.style.display = "block";
      count++;
    } else {
      order.style.display = "none";
    }
  });
  orderNumber.innerText = count;
  if (count === 0) {
    noOrder.innerHTML = `<h1>No Orders in Last ${e.target.value} Days</h1>`;
  } else {
    noOrder.innerText = "";
  }
});

//////////////////////////////////////filter orders////////////////////////////////////////
searchInput.addEventListener("keyup", (e) => {
  let count = 0;
  noOrder.innerText = "";
  const text = e.target.value.toLowerCase();
  const ordersArr = document.querySelectorAll(".order");
  ordersArr.forEach((order) => {
    if (order.id.indexOf(text) != -1) {
      order.style.display = "block";
      count++;
    } else {
      const itemsInOrder = order.querySelectorAll(".productDesc");
      for (let item of itemsInOrder) {
        if (item.innerText.toLowerCase().indexOf(text) != -1) {
          order.style.display = "block";
          count++;
          break;
        } else {
          order.style.display = "none";
        }
      }
    }
  });
  if (count == 0) {
    noResult.style.display = "flex";
  } else {
    noResult.style.display = "none";
  }
});

// /////////////////////////////////get orders on dom load//////////////////////////////
window.addEventListener("DOMContentLoaded", getOrders("createdAt", "ASC"));

//get orders
async function getOrders(sortBy, orderType) {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/get-orders?sortBy=${sortBy}&in=${orderType}`
    );
    ordersEle.innerHTML = "";
    if (data.length === 0) {
      noOrder.innerHTML = "<h1>No Orders Yet</h1>";
    } else {
      orderNumber.innerText = data.length;
      daysSelect.value = 30;
      noResult.style.display = "none";
      noOrder.innerText = "";
      searchInput.value = "";
      data.forEach((order) => {
        showOrder(order);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// formating date local
function formatDate(date, daysPassed) {
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
  const date = new Date(order.createdAt);
  const daysPassed = Math.round((new Date() - date) / (1000 * 60 * 60 * 24));
  const orderPlacedOn = formatDate(date, daysPassed);
  const productRows = order.products
    .map(function (product) {
      return `<hr> <div class="order-row">
        <span class="order-item order-column">
          <img class="order-img" src="${product.image}" alt="" />
          <span class="productDesc">${product.description}</span>
        </span>
        <span class="order-price order-column"><i class="fa fa-inr" aria-hidden="true"></i>${product.price}</span>
        <span class="order-quantity order-column">${product.orderItems.quantity}</span>
      </div>`;
    })
    .join("");
  const newOrder = `<div data-dayspassed="${daysPassed}" id="${order.id}" class="order">
    <div class="order-header-info">
      <div class="order-placed">
        <span>ORDER PLACED</span>
        <span><strong>${orderPlacedOn}</strong></span>
      </div>
      <div class="order-total">
        <span>TOTAL</span>
        <span><i class="fa fa-inr" aria-hidden="true"></i><strong>${order.total}</strong></span>
      </div>
      <div class="order-id">
        <span>ORDER-ID</span>
        <span><strong>#${order.id}</strong></span>
      </div>
    </div>
    <div class="order-items">
      <div class="order-row order-header">
        <span class="order-item order-column">ITEM</span>
        <span class="order-price order-column">PRICE</span>
        <span class="order-quantity order-column">QUANTITY</span>
      </div>
    </div>
    <div id="order-items">${productRows}</div>
  </div>`;

  ordersEle.insertAdjacentHTML("afterbegin", newOrder);
}
