"use strict";
window.onload = () => {
  // defining variables
  const body = document.querySelector("body");
  const loginLink = document.querySelector(".create-acc-link");
  const regLink = document.querySelector(".login-acc-link");
  const regForm = document.querySelector(".reg-form");
  const loginForm = document.querySelector(".login-form");
  const signinbtn = document.querySelector(".signin-btn");
  const signupbtn = document.querySelector(".signup-btn");

  // check authentication status
  (() => {
    fetch("/isAuth", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      redirect: "follow",
    })
      .then(async (res) => {
        res = await res.json();
        if (!res.error) {
          localStorage.setItem("username", res.username);
          location.href = "/home";
        }
      })
      .catch((Err) => {
        console.error(Err);
      });
  })();
  // defining functions
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  function displayError(formNode, text) {
    const error = formNode.querySelector(".error-msg");
    error.textContent = text;
    error.classList.remove("d-none");
  }
  function hideError(text) {
    document.querySelector(".error-msg").classList.add("d-none");
  }

  const signin = () => {
    const emailInput = document.querySelector(".signin-email");
    const email = emailInput.value;
    const pwInput = document.querySelector(".signin-pw");
    const pw = pwInput.value;
    hideError();
    if (emailInput.checkValidity() && pwInput.checkValidity()) {
      if (validateEmail(email)) {
        const body = JSON.stringify({
          email,
          password: pw,
        });
        emailInput.value = "";
        pwInput.value = "";
        fetch("/signin", {
          body,
          method: "POST",
          headers: { "Content-type": "application/json" },
          redirect: "follow",
        }).then(async (res) => {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            res = await res.json();
            if (res.error) {
              displayError(loginForm, res.message);
            } else {
              sessionStorage.setItem("username", res.username);
              location.href = "/home";
            }
          }
        });
      } else {
        emailInput.reportValidity();
        pwInput.reportValidity();
      }
    } else {
      emailInput.checkValidity()
        ? pwInput.reportValidity()
        : emailInput.reportValidity();
    }
  };

  const signup = () => {
    const inputs = regForm.querySelectorAll("input");
    const vals = [];
    const body = {};
    const values = [];
    inputs.forEach((input) => {
      values.push(input.value);
      body[input.name] = input.value;
      vals.unshift(input);
    });
    const nonEmptyValues = values.filter((val) => {
      return val !== "";
    });
    if (nonEmptyValues.length === 5) {
      fetch("/signup", {
        body: JSON.stringify(body),
        method: "POST",
        headers: { "Content-type": "application/json" },
      })
        .then(async (res) => {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            res = await res.json();
            if (res.error) {
              displayError(regForm, res.message);
            } else {
              location.href = "/";
            }
          }
        })
        .catch((err) => console.error("error", err));
    } else {
      vals.map((input) => {
        if (!input.checkValidity()) {
          input.focus({ preventScroll: false });
          input.reportValidity();
        }
      });
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
  signinbtn.addEventListener("click", (e) => {
    e.preventDefault();
    signin();
  });
  signupbtn.addEventListener("click", (e) => {
    e.preventDefault();
    signup();
  });
};
