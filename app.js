const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config({path:'./.env'});
const port = process.env.PORT;
require("./src/database/connection");
const mainRoute = require("./src/routes/main");

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("", mainRoute);

app.listen(port, () => {
  console.log(`Server is runnig on ${port}`);
});