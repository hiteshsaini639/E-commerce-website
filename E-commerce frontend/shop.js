const closeBtn = document.getElementById("close-btn");
const popupImage = document.getElementById("popup-image");
const cardContainer = document.getElementById("card-container");
const popupContainer = document.getElementById("popup-container");
const notification = document.getElementById("notification");
const cartItems = document.getElementById("cart-items");
const cart = document.getElementById("cart");
const cartBtn = document.querySelector(".cart-btn");
const pagination = document.getElementById("pagination");
const previous = document.getElementById("previous");
const current = document.getElementById("current");
const next = document.getElementById("next");
const cartPagination = document.getElementById("cart-pagination");
const cartPrevious = document.getElementById("cart-previous");
const cartCurrent = document.getElementById("cart-current");
const cartNext = document.getElementById("cart-next");
const cartTotal = document.getElementById("total-value");
const cartNumber = document.getElementById("cart-number");
const orderBtn = document.getElementById("order-btn");

let qtyObj;
//////////////////////////////popup Image on dbclick and close////////////////////////

//show Image on dbclick
cardContainer.addEventListener("dblclick", (e) => {
  if (e.target.matches("img")) {
    popupImage.src = e.target.src;
    popupContainer.classList.add("popup-active");
  }
});

//close image
closeBtn.addEventListener("click", () => {
  popupContainer.classList.remove("popup-active");
  popupImage.src = "";
});

//////////////////////////////get shop data on load/pagination///////////////////////
window.addEventListener("DOMContentLoaded", getDataOnLoad(1));

//pagination
pagination.addEventListener("click", (e) => {
  if (e.target.matches("button")) {
    const page = +e.target.innerText;
    getDataOnLoad(page);
  }
});

// get products data from backend
async function getDataOnLoad(page = 1) {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/get-products?page=${page}`
    );
    cardContainer.innerHTML = "";
    cartNumber.innerText = data.totalCartItems;
    data.products.forEach((product) => {
      showProducts(product);
    });
    qtyObj = JSON.parse(localStorage.getItem("quantityObject"));
    qtyObj = qtyObj == null ? {} : qtyObj;
    showPageBtn(page, data.hasNextPage);
  } catch (errorObj) {
    createNotification(errorObj.response.data);
    console.log(errorObj);
  }
}

//show products data on frontend
function showProducts(product) {
  const newProduct = `<div class="card">
  <div class="card-header">
    <img
      src="${product.image}"
      alt="${product.description}"
      data-price="${product.price}"
    />
  </div>
  <div class="card-content">
    <h3 class="card-title">${product.description}</h3>
    <i class="fa fa-indian-rupee-sign">${product.price}</i>
    <button id="${product.id}" type="submit">ADD TO CART</button>
  </div>
</div>`;
  cardContainer.innerHTML += newProduct;
}

//show pagination btn
function showPageBtn(page, hasNextPage) {
  current.innerText = page;
  previous.innerText = page - 1;
  next.innerText = page + 1;
  if (page == 1) {
    previous.style.visibility = "hidden";
  } else {
    previous.style.visibility = "visible";
  }
  if (!hasNextPage) {
    next.style.visibility = "hidden";
  } else {
    next.style.visibility = "visible";
  }
}

//////////////////////////////on quatity change/////////////////////////////////////
cartItems.addEventListener("click", (e) => {
  if (e.target.matches("input")) {
    e.target.addEventListener("input", (e) => {
      qtyObj = JSON.parse(localStorage.getItem("quantityObject"));
      qtyObj = qtyObj == null ? {} : qtyObj;
      qtyObj[e.target.id] = e.target.value;
      localStorage.setItem("quantityObject", JSON.stringify(qtyObj));
    });
  }
});

//////////////////////////////get cart data on load/pagination///////////////////////
cartBtn.addEventListener("click", () => {
  cart.classList.toggle("active-cart");
  if (cart.classList.contains("active-cart")) {
    qtyObj = JSON.parse(localStorage.getItem("quantityObject"));
    qtyObj = qtyObj == null ? {} : qtyObj;
    getCartData(1);
  }
});

//cart pagination
cartPagination.addEventListener("click", (e) => {
  if (e.target.matches("button")) {
    qtyObj = JSON.parse(localStorage.getItem("quantityObject"));
    qtyObj = qtyObj == null ? {} : qtyObj;
    const page = +e.target.innerText;
    getCartData(page);
  }
});

//get cart data from backend
async function getCartData(page = 1) {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/get-cartItems?page=${page}`
    );
    cartItems.innerText = "";
    cartNumber.innerText = data.totalCartItems;
    cartTotal.innerText = data.total;
    data.cartItems.forEach((cartItem) => {
      showCart(cartItem);
    });
    showCartPageBtn(page, data.hasNextPage);
  } catch (errorObj) {
    createNotification(errorObj.response.data);
    console.log(errorObj);
  }
}

//show cart data on frontend
function showCart(item) {
  const newItem = `<div class="cart-row">
  <span class="cart-item cart-column">
    <img class="cart-img" src="${item.image}" alt="" />
    <span>${item.description}</span>
  </span>
  <span class="cart-price cart-column"><i class="fa fa-indian-rupee-sign">${item.price}</i></span>
  <span class="cart-quantity cart-column">
    <input id=${item.id} type="number" value="${
    !qtyObj[item.id] ? "" : qtyObj[item.id]
  }" />
    <button id=${item.id}>REMOVE</button>
  </span>
</div>`;
  cartItems.innerHTML += newItem;
}

//show pagination btns
function showCartPageBtn(page, hasNextPage) {
  cartCurrent.innerText = page;
  cartPrevious.innerText = page - 1;
  cartNext.innerText = page + 1;
  if (page == 1) {
    cartPrevious.style.visibility = "hidden";
  } else {
    cartPrevious.style.visibility = "visible";
  }
  if (!hasNextPage) {
    cartNext.style.visibility = "hidden";
  } else {
    cartNext.style.visibility = "visible";
  }
}

//////////////////////////////delete from cart///////////////////////////////////////
cartItems.addEventListener("click", (e) => {
  if (e.target.matches("button")) {
    removeItemFromCart(e.target.id);
  }
});

async function removeItemFromCart(itemId) {
  try {
    const response = await axios.delete(
      `http://localhost:3000/remove-item/${itemId}`
    );
    if (response.status == 200) {
      createNotification(response.data);
      delete qtyObj[itemId];
      localStorage.setItem("quantityObject", JSON.stringify(qtyObj));
    } else {
      throw new Error({ response: response });
    }
  } catch (errorObj) {
    createNotification(errorObj.response.data);
    console.log(errorObj);
  }
}

//////////////////////////////adding product to cart///////////////////////////////////
cardContainer.addEventListener("click", (e) => {
  if (e.target.matches("button")) {
    qtyObj = JSON.parse(localStorage.getItem("quantityObject"));
    qtyObj = qtyObj == null ? {} : qtyObj;
    qtyObj[e.target.id] = 1;
    localStorage.setItem("quantityObject", JSON.stringify(qtyObj));
    addToDBcart(e.target.id);
  }
});

async function addToDBcart(productId) {
  try {
    const response = await axios.post(
      `http://localhost:3000/add-to-cart/${productId}`
    );
    if (response.status == 200) {
      createNotification(response.data);
    } else {
      throw new Error({ response: response });
    }
  } catch (errorObj) {
    createNotification(errorObj.response.data);
    console.log(errorObj);
  }
}

//////////////////////////////place order///////////////////////////////////////////////
orderBtn.addEventListener("click", placeOrder);

async function placeOrder() {
  try {
    const response = await axios.post(
      "http://localhost:3000/place-order",
      qtyObj
    );
    if (response.status == 201) {
      createNotification(response.data);
      localStorage.setItem("quantityObject", JSON.stringify({}));
    } else {
      throw new Error({ response: response });
    }
  } catch (errorObj) {
    createNotification(errorObj.response.data);
    console.log(errorObj);
  }
  // catch (error) {
  //   if (error.response) {
  //     createNotification(error.response.data);
  //   } else if (error.request) {
  //     createNotification(error.response.data);
  //   } else {
  //     createNotification(error.message);
  //     console.log("Error ", error);
  //   }
  // }
}

//////////////////////////////notify user//////////////////////////////////////////////
function createNotification(notificationObj) {
  const div = document.createElement("div");
  div.classList.add("show");
  div.innerText = notificationObj.message;
  notification.appendChild(div);
  (() => {
    setTimeout(() => {
      div.remove();
    }, 3000);
  })();
}
