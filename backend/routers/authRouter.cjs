// imports
const { Router } = require("express");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const {
  handleAddUser,
  handleFindUser,
} = require("../controllers/accController.cjs");
const root = "C:/Users/erhab/OneDrive/chat";
const router = Router();
dotenv.config();

// constants and variables
const db = process.env.DB;
const saltRounds = 10;
const isEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// loads the sign in page
router.get("/", (req, res, next) => {
  if (req.session.isAuth) {
    res.redirect(301, "/home");
  } else {
    res.sendFile("./frontend/index.html", { root });
  }
});

// destroys current client session
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    res.redirect(301, "/");
  });
});

// gets sign in data from client
router.post("/signin", async (req, res) => {
  const body = Object.assign({}, req.body);
  const email = body.email;
  const password = body.password;
  if (isEmail(email)) {
    const user = await handleFindUser({ email });
    if (user) {
      bcrypt.compare(password, user.password).then((val) => {
        if (val) {
          req.session.uid = user._id;
          req.session.isAuth = true;
          res.redirect(301, "/home");
        } else {
          res.send("incorrect username or password");
        }
      });
    } else {
      res.send("you don't currently have an account with this email address");
    }
  }
});

// gets data from client and creates an account
router.post("/signup", async (req, res) => {
  const body = Object.assign({}, req.body);
  const email = body.email;
  const plainTextPassword = body.password;
  const values = Object.values(body).filter((val) => {
    return val !== "";
  });
  if (isEmail(email) && values.length === 5) {
    const user = await handleFindUser({ email });
    if (user) {
      bcrypt.hash(plainTextPassword, saltRounds).then(async (password) => {
        body.password = password;
        await handleAddUser(body);
        res.redirect(301, "/");
      });
    } else {
      res.send("unable to create your account please check the fields");
    }
  } else {
    res.send("This email address is already associated with an account");
  }
});

module.exports = router;
