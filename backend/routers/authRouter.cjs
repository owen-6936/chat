// imports
const { Router } = require("express");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const {
  handleAddUser,
  handleFindUser,
  handleAddSocket,
} = require("../controllers/accController.cjs");
const { initializeMessages } = require("../controllers/messageController.cjs");
const { uid } = require("uid");
const root = "C:/Users/erhab/OneDrive/chat";
const router = Router();
dotenv.config();
// constants and variables
const saltRounds = 10;
const isEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

router.post("/isAuth", (req, res) => {
  if (req.session.isAuth) {
    res.json({
      message: "login successful",
      username: req.session.username,
      error: false,
    });
  } else {
    res.json({
      message: "you are not authenticated",
      error: true,
    });
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
          req.session.uid = user.uid;
          req.session.isAuth = true;
          req.session.username = user.username;
          res.json({
            message: "login successful",
            username: user.username,
            error: false,
          });
        } else {
          res.json({
            message: "incorrect username or password",
            error: true,
          });
        }
      });
    } else {
      res.json({
        message: "You don't currently have an account with this email address",
        error: true,
      });
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
    if (!user) {
      bcrypt.hash(plainTextPassword, saltRounds).then(async (password) => {
        const _uid = uid(16);
        body.uid = _uid;
        body.reg_date = Date();
        body.password = password;
        await handleAddUser(body);
        await initializeMessages({ username: body.username, uid: body.uid });
        const randomId = uid(16);
        await handleAddSocket({
          username: body.username,
          sid: randomId,
          uid: body.uid,
        });
        res.json({
          message: "login successful",
          error: false,
        });
      });
    } else {
      res.json({
        message: "This email address is already associated with an account",
        error: true,
      });
    }
  } else {
    res.json({
      message: "check all fields are filled in correctly",
      error: true,
    });
  }
});
module.exports = router;
