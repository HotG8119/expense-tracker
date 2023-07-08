const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Record = require("./models/record");
const Category = require("./models/category");

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
  let totalAmount = 0;
  Record.find()
    .lean()
    .then(records => {
      records.forEach(record => {
        //轉換日期格式
        const date = record.date.toISOString().slice(0, 10);
        record.date = date;
        //加總金額
        totalAmount += record.amount;
      });
      res.render("index", { records, totalAmount });
    })
    .catch(err => console.log(err));
});

//create
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

//edit
app.get("/records/:id/edit", (req, res) => {
  const id = req.params.id;
  return Record.findById(id)
    .lean()
    .sort({ date: "desc" })
    .then(record => {
      //轉換日期格式
      const date = record.date.toISOString().slice(0, 10);
      record.date = date;
      res.render("edit", { record });
    })
    .catch(err => console.log(err));
});

app.post("/records/:id/edit", (req, res) => {
  const id = req.params.id;
  const updatedRecord = {
    name: req.body.name,
    category: req.body.category,
    date: req.body.date,
    amount: req.body.amount,
  };

  return Record.findByIdAndUpdate(id, updatedRecord)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err));
});

//delete
app.post("/records/:id/delete", (req, res) => {
  const id = req.params.id;
  return Record.findByIdAndRemove(id)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err));
});

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});
