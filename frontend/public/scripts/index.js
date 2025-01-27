// defining variables
const body = document.querySelector("body");
const loginLink = document.querySelector(".create-acc-link");
const regLink = document.querySelector(".login-acc-link");
const regForm = document.querySelector(".reg-form");
const loginForm = document.querySelector(".login-form");
// event listeners
loginLink.addEventListener("click", () => {
  loginForm.classList.add("d-none");
  regForm.classList.remove("d-none");
  body.style.margin = 0;
});
regLink.addEventListener("click", () => {
  loginForm.classList.remove("d-none");
  regForm.classList.add("d-none");
  body.style.margin = "8px";
});
