const root = "C:/Users/erhab/OneDrive/chat";

function mainRouter(app) {
  app.get("/home", (req, res) => {
    res.sendFile("frontend/home.html", { root });
  });
}

function loginRouter(app) {
  app
    .get("/", (req, res) => {
      res.sendFile("frontend/index.html", { root });
    })
    .post("/", (req, res) => {
      console.log(req.body);
    });
}

module.exports = { mainRouter, loginRouter };
