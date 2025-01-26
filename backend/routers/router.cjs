const root = "C:/Users/erhab/OneDrive/chat";

function loginRouter(app) {
  app
    .get("/", (req, res) => {
      res.sendFile("frontend/index.html", { root });
    })
    .post("/", (req, res) => {
      console.log(req.body);
    });
}

module.exports = { loginRouter };
