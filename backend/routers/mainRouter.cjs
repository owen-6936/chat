const { Router } = require("express");

const root = "C:/Users/erhab/OneDrive/chat";
const mainRouter = Router();

// loads the sign in page
mainRouter.get("/", (req, res, next) => {
  res.sendFile("./frontend/index.html", { root });
});

// prevents unauthorised user from the home page
mainRouter.get("/home", (req, res, next) => {
  if (!req.session.isAuth) {
    res.redirect(301, "/");
  } else {
    res.sendFile("./frontend/home.html", { root });
  }
});

module.exports = mainRouter;
