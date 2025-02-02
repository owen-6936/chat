const { Router } = require("express");

const root = "C:/Users/erhab/OneDrive/chat";
const mainRouter = Router();

// prevents unauthorised user from the home page
mainRouter.get("/home", (req, res, next) => {
  if (!req.session.isAuth) {
    res.redirect(301, "/");
  } else {
    res.sendFile("./frontend/home.html", { root });
  }
});

module.exports = mainRouter;
