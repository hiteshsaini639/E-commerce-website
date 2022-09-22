const nav = document.querySelector(".nav");
const close = document.getElementById("close");
const popupImage = document.getElementById("popup-image");
const cardContainer = document.getElementById("card-container");
const popupContainer = document.getElementById("popup-container");
const notification = document.getElementById("notification");
const cartItems = document.getElementById("cart-items");
const cart = document.getElementById("cart");
const cartBtn = document.querySelector(".cart-btn");

cartBtn.addEventListener("click", () => {
  cart.classList.toggle("active-cart");
});

window.addEventListener("scroll", fixNav);
function fixNav() {
  if (window.scrollY > nav.offsetHeight + 150) {
    nav.classList.add("active");
  } else {
    nav.classList.remove("active");
  }
}

window.addEventListener("DOMContentLoaded", getDataLoad);

async function getDataLoad() {
  try {
    const products = await axios.get("http://localhost:3000/get-products");
    products.data.forEach((product) => {
      showProduct(product);
    });
  } catch (err) {
    console.log(err);
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
    const imgElement =
      e.target.parentElement.previousElementSibling.firstElementChild;
    createNotification(imgElement.alt);
    addToCart(imgElement);
  }
});

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
    <img class="cart-img" src="${item.src}" alt="" />
    <span>${item.alt}</span>
  </span>
  <span class="cart-price cart-column">${item.dataset.price}</span>
  <span class="cart-quantity cart-column">
    <input type="number" value="1" />
    <button>REMOVE</button>
  </span>
</div>`;
  console.log(cartItems);
  cartItems.innerHTML += newItem;
}