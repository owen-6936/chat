// imports
const client = require("../auth/client.cjs");
const { Router } = require("express");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
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
  const email = req.body.email;
  const password = req.body.password;
  if (isEmail(email)) {
    await client.connect();
    const data = await client.db(db).collection("users").findOne({ email });
    console.log(data);
    if (data) {
    } else {
    }
    await client.close();
    res.end();
  }
});

router.post("/signup", (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;
  const firstName = body.firstName;
  const lastName = body.lastName;
  const username = body.username;
  if (isEmail(email)) {
    res.send("success");
    console.log(req.body, email);
  }
});

module.exports = router;
