const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Record = require("./models/record");

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
app.use(bodyParser.urlencoded({ extended: true }));

const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb error!");
});

db.once("open", () => {
  console.log("mongodb connected!");
});

app.get("/", (req, res) => {
  Record.find()
    .lean()
    .then(records => {
      records.forEach(record => {
        record.date = record.date.toLocaleDateString("en-US");
      });
      res.render("index", { records });
    })
    .catch(err => console.log(err));
});

app.get("/records/new", (req, res) => {
  res.render("new");
});

app.post("/records", (req, res) => {
  const record = Record({
    name: req.body.name,
    category: req.body.category,
    date: req.body.date,
    amount: req.body.amount,
  });
  return Record.create(record)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err));
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});
