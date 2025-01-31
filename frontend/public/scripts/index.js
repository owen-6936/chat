// defining variables
const body = document.querySelector("body");
const loginLink = document.querySelector(".create-acc-link");
const regLink = document.querySelector(".login-acc-link");
const regForm = document.querySelector(".reg-form");
const loginForm = document.querySelector(".login-form");
const signinbtn = document.querySelector(".signin-btn");
const signupbtn = document.querySelector(".signup-btn");

// defining functions
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const signin = () => {
  const email = document.querySelector(".signin-email").value;
  const pw = document.querySelector(".signin-pw").value;
  if (email !== "" && pw !== "") {
    if (validateEmail(email)) {
      const body = JSON.stringify({
        email,
        password: pw,
      });
      fetch("/signin", {
        body,
        method: "POST",
        headers: { "Content-type": "application/json" },
      }).catch((err) => console.error("error", err));
    } else {
      alert("invalid email address");
    }
  } else {
    alert("please fill in all fields");
  }
};

const signup = () => {
  const inputs = regForm.querySelectorAll("input");
  const body = {};
  const values = [];
  inputs.forEach((input) => {
    values.push(input.value);
    body[input.name] = input.value;
  });
  const nonEmptyValues = values.filter((val) => {
    return val !== "";
  });
  if (nonEmptyValues.length === 5) {
    fetch("/signup", {
      body: JSON.stringify(body),
      method: "POST",
      headers: { "Content-type": "application/json" },
    }).catch((err) => console.error("error", err));
  } else {
    alert("please fill in all fields");
  }
};
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
signinbtn.addEventListener("click", () => signin());
signupbtn.addEventListener("click", (e) => {
  e.preventDefault();
  signup();
});
