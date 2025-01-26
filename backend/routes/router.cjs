function loginRouter(app) {
  app.get("/", (req, res) => {
    res.send("<h1>This is going to be used as the login page</h1>");
  });
}

module.exports = { loginRouter };
