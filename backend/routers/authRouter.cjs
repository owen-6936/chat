// imports
const client = require("../auth/client.cjs");
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
router.get("/", (req, res) => {
  res.sendFile("./frontend/index.html", { root });
});

// gets sign in data from client
router.post("/signin", async (req, res) => {
  const body = req.body;
  const email = req.body.email;
  const password = req.body.password;
  const query = { body };
  if (isEmail(email)) {
    const user = await handleFindUser(body);
  }
});

router.post("/signup", (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;
  const firstName = body.firstName;
  const lastName = body.lastName;
  const username = body.username;
  const values = Object.values(body).filter((val) => {
    return val !== "";
  });
  if (isEmail(email) && values.length === 5) {
    res.send("success");
  } else {
    res.send("unable to create your account check the fields");
  }
});

module.exports = router;
