const nav = document.querySelector(".nav");
const close = document.getElementById("close");
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

pagination.addEventListener("click", (e) => {
  if (e.target.matches("button")) {
    const page = +e.target.innerText;
    getDataLoad(page);
  }
});

cartPagination.addEventListener("click", (e) => {
  if (e.target.matches("button")) {
    const page = +e.target.innerText;
    getCartData(page);
  }
});

cartBtn.addEventListener("click", () => {
  cart.classList.toggle("active-cart");
  if (cart.classList.contains("active-cart")) {
    getCartData(1);
  }
});

async function getCartData(page) {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/get-cartItems?page=${page}`
    );
    cartItems.innerHTML = "";
    data.cartItems.forEach((cartItem) => {
      addToCart(cartItem);
    });
    showCartPage(page, data.hasNextPage);
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener("scroll", fixNav);
function fixNav() {
  if (window.scrollY > nav.offsetHeight + 150) {
    nav.classList.add("active");
  } else {
    nav.classList.remove("active");
  }
}

window.addEventListener("DOMContentLoaded", getDataLoad(1));

async function getDataLoad(page) {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/get-products?page=${page}`
    );
    cardContainer.innerHTML = "";
    data.products.forEach((product) => {
      showProduct(product);
    });
    showPage(page, data.hasNextPage);
  } catch (err) {
    console.log(err);
  }
}

function showPage(page, hasNextPage) {
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
function showCartPage(page, hasNextPage) {
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

function showProduct(product) {
  const newProduct = `<div class="card">
  <div class="card-header">
    <img
    id="${product.id}"
      src="${product.image}"
      alt="${product.description}"
      data-price="${product.price}"
    />
  </div>
  <div class="card-content">
    <h3 class="card-title">${product.description}</h3>
    <i class="fa fa-indian-rupee-sign">${product.price}</i>
    <button type="submit">ADD TO CART</button>
  </div>
</div>`;
  cardContainer.innerHTML += newProduct;
}

cardContainer.addEventListener("click", (e) => {
  if (e.target.matches("button")) {
    const productId =
      e.target.parentElement.previousElementSibling.firstElementChild.id;
    addToDBcart(productId);
    // createNotification(imgElement.alt);
    // addToCart(imgElement);
  }
});

async function addToDBcart(productId) {
  try {
    const product = await axios.post(`http://localhost:3000/add-to-cart`, {
      productId: productId,
    });
    console.log(product.data);
    createNotification(product.data.description);
    addToCart(product.data);
  } catch (err) {
    console.log(err);
  }
}

cardContainer.addEventListener("dblclick", (e) => {
  if (e.target.matches("img")) {
    popupImage.src = e.target.src;
    popupContainer.classList.add("popup-active");
  }
});

close.addEventListener("click", () => {
  popupContainer.classList.remove("popup-active");
  popupImage.src = "";
});

function createNotification(notificationMsg) {
  const div = document.createElement("div");
  div.classList.add("show");
  div.innerText = `Image:${notificationMsg} is added to the cart`;
  notification.appendChild(div);
  (() => {
    setTimeout(() => {
      div.remove();
    }, 3000);
  })();
}

function addToCart(item) {
  const newItem = `<div class="cart-row">
  <span class="cart-item cart-column">
    <img class="cart-img" src="${item.image}" alt="" />
    <span>${item.description}</span>
  </span>
  <span class="cart-price cart-column">${item.price}</span>
  <span class="cart-quantity cart-column">
    <input type="number" value="1" />
    <button>REMOVE</button>
  </span>
</div>`;
  cartItems.innerHTML += newItem;
}
