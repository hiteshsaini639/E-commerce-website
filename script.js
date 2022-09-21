const nav = document.querySelector(".nav");
const close = document.getElementById("close");
const popupImage = document.getElementById("popup-image");
window.addEventListener("scroll", fixNav);
const cardContainer = document.querySelector(".card-container");
const popupContainer = document.getElementById("popup-container");
function fixNav() {
  if (window.scrollY > nav.offsetHeight + 150) {
    nav.classList.add("active");
  } else {
    nav.classList.remove("active");
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
