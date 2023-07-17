const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const routes = require("./routes");

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb error!");
});

db.once("open", () => {
  console.log("mongodb connected!");
});

// setting static files
app.use(express.static("public"), express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(routes);

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});
