const express = require("express");
const { loginRouter } = require("./routes/router.cjs");
const app = express();
var port = 5500;

loginRouter(app);

app.listen(port, () => {
  console.log(`express application running on port ${port}`);
});
