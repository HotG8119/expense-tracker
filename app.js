const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const port = 3000;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb error!");
});

db.once("open", () => {
  console.log("mongodb connected!");
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});
