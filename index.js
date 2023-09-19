import { SELECTION } from "./constant.js";

const slider = document.querySelector(".slider");
const browseSelection = document.querySelector(".browse-selection");
const badge = document.querySelector(".badge");
const badgeCount = document.querySelector(".badge-count");
const cart = document.querySelector("#cart");

let isDown = false;
let startX;
let scrollLeft;

//utility classes
const displayBadge = () => {
  if (
    JSON.parse(localStorage.getItem("cart") !== null) &&
    JSON.parse(localStorage.getItem("cart")).length > 0
  ) {
    badge.classList.remove("hidden");
    badgeCount.textContent = JSON.parse(localStorage.getItem("cart")).length;
  } else badge.classList.add("hidden");
};

const notify = () => {
  const alertContainer = document.querySelector(".alert-container");
  const alert = document.querySelector(".alert-success");
  const alertCopy = alert.cloneNode(true);
  const alertClose = alertCopy.children[2];

  alertClose.addEventListener("click", (_) => {
    alertCopy.remove();
  });

  alertCopy.classList.remove("hidden");
  alertContainer.appendChild(alertCopy);
  setTimeout(() => {
    alertCopy.classList.add("fade");
  }, 2000);
  setTimeout(() => {
    alertCopy.remove();
  }, 3000);
};

//---------------------//

displayBadge();

cart.addEventListener("click", (_) => {
  const cartOverlay = document.querySelector(".cart-overlay");
  const overlayDummy = document.querySelector(".overlay-dummy");
  const close = document.querySelector("img.close");
  const cartDetails = document.querySelector(".cart-details");
  const cartTotal = document.querySelector(".total");
  const gridContent = document.querySelector(".grid-content");
  const checkout = document.querySelector(".checkout-btn");
  let total = 0;

  cartDetails.removeChild(gridContent);

  const gridContentNew = document.createElement("div");
  gridContentNew.classList.add("grid-content");
  cartDetails.appendChild(gridContentNew);

  cartOverlay.style.display = "flex";
  overlayDummy.addEventListener("click", (_) => {
    cartOverlay.style.display = "none";
  });
  close.addEventListener("click", (_) => {
    cartOverlay.style.display = "none";
  });

  const emptyMsg = document.createElement("p");
  const cart = !JSON.parse(localStorage.getItem("cart"))
    ? []
    : JSON.parse(localStorage.getItem("cart"));
  if (cart.length === 0) {
    emptyMsg.textContent = "Your cart is empty!";
    emptyMsg.style.width = "100%";
    emptyMsg.style.textAlign = "center";
    emptyMsg.style.fontSize = "1rem";
    emptyMsg.style.paddingTop = "1rem";
    gridContentNew.appendChild(emptyMsg);
  } else {
    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-grid");
      cartItem.classList.add("cart-item");

      const img = document.createElement("img");
      const name = document.createElement("p");
      const price = document.createElement("p");
      const qty = document.createElement("p");
      const subTotal = document.createElement("p");

      img.src = item.urlSmall;
      img.classList.add("cart-item-img");

      name.textContent = item.name;
      name.classList.add("cart-item-name");

      price.textContent = `₱${item.price.toLocaleString()}`;
      qty.textContent = item.count;
      subTotal.textContent = `₱${(item.count * item.price).toLocaleString()}`;
      total += item.count * item.price;
      cartItem.appendChild(img);
      cartItem.appendChild(name);
      cartItem.appendChild(price);
      cartItem.appendChild(qty);
      cartItem.appendChild(subTotal);
      gridContentNew.appendChild(cartItem);
    });
    cartTotal.textContent = `₱${total.toLocaleString()}`;
  }

  checkout.addEventListener("click", () => {
    cartOverlay.style.display = "none";
    localStorage.setItem("cart", JSON.stringify([]));
    displayBadge();
  });
});

SELECTION.forEach((e) => {
  const li = document.createElement("li");
  li.classList.add("slider-item");

  const sliderItemContent = document.createElement("div");
  sliderItemContent.classList.add("slider-item-content");
  sliderItemContent.style.backgroundImage = `-webkit-linear-gradient(
    rgba(0, 0, 0, 0) 30%,
    rgba(0, 5, 1, 1) 90%
  ), url(${e.url})`;

  //Left half of the slider-item-content
  const sCLeft = document.createElement("div");
  sCLeft.classList.add("slider-item-content-left");

  const name = document.createElement("h3");
  name.classList.add("product-name");

  const price = document.createElement("h1");
  const desc = document.createElement("p");
  desc.textContent = e.description;
  name.textContent = e.name;
  price.textContent = `₱${e.price.toLocaleString()}`;
  price.style.fontSize = "3rem";

  sCLeft.appendChild(price);
  sCLeft.appendChild(name);
  sCLeft.appendChild(desc);
  //------------------//

  //right half of the slider-item-content
  const sCRight = document.createElement("div");
  sCRight.classList.add("slider-item-content-right");

  const addToCartBtn = document.createElement("button");
  addToCartBtn.textContent = "Add to Cart";
  addToCartBtn.classList.add("btn");
  addToCartBtn.id = e.id;
  addToCartBtn.type = "button";
  // --------- //

  addToCartBtn.addEventListener("click", (_) => {
    const tempStore =
      JSON.parse(localStorage.getItem("cart")) !== null
        ? JSON.parse(localStorage.getItem("cart"))
        : [];
    const itemIndex = tempStore.findIndex((item) => item.id == e.id);
    if (itemIndex === -1) tempStore.push({ ...e, count: 1 });
    else tempStore[itemIndex].count++;

    localStorage.setItem("cart", JSON.stringify(tempStore));
    displayBadge();
    notify();
  });

  sCRight.appendChild(addToCartBtn);
  sliderItemContent.appendChild(sCLeft);
  sliderItemContent.appendChild(sCRight);

  li.appendChild(sliderItemContent);

  li.style.fontSize = "1rem";
  slider.appendChild(li);
});
// ------------- //

SELECTION.forEach((e) => {
  const li = document.createElement("li");
  li.classList.add("browse-item");
  li.classList.add("mb-2");

  const price = document.createElement("h1");
  price.textContent = `₱${e.price.toLocaleString()}`;

  const name = document.createElement("h6");
  name.textContent = e.name;
  name.style.fontWeight = 300;

  const img = document.createElement("img");
  img.src = e.urlSmall;
  img.classList.add("browse-item-img");

  const addToCartBtn = document.createElement("button");
  addToCartBtn.textContent = "Add to Cart";
  addToCartBtn.classList.add("btn");
  addToCartBtn.classList.add("mt-2");
  addToCartBtn.id = e.id;

  li.appendChild(img);
  li.appendChild(price);
  li.appendChild(name);
  li.appendChild(addToCartBtn);

  browseSelection.appendChild(li);
  addToCartBtn.addEventListener("click", (_) => {
    const tempStore =
      JSON.parse(localStorage.getItem("cart")) !== null
        ? JSON.parse(localStorage.getItem("cart"))
        : [];
    const itemIndex = tempStore.findIndex((item) => item.id == e.id);
    if (itemIndex === -1) tempStore.push({ ...e, count: 1 });
    else tempStore[itemIndex].count++;

    localStorage.setItem("cart", JSON.stringify(tempStore));
    displayBadge();
    notify();
  });
});

//Slider script
slider.addEventListener("mousedown", (e) => {
  isDown = true;
  slider.classList.add("active");
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
slider.addEventListener("mouseleave", (_) => {
  isDown = false;
  slider.classList.remove("active");
});
slider.addEventListener("mouseup", (_) => {
  isDown = false;
  slider.classList.remove("active");
});
slider.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const SCROLL_SPEED = 3;
  const walk = (x - startX) * SCROLL_SPEED;
  slider.scrollLeft = scrollLeft - walk;
});
