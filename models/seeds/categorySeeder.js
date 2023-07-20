if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const Category = require("../category");
const db = require("../../config/mongoose");

const CATEGORY = require("./date/category.json");

db.on("error", () => {
  console.log("mongodb error!");
});

db.once("open", () => {
  Promise.all(CATEGORY.map(category => Category.create(category)))
    .then(() => {
      console.log("create category done");
      process.exit();
    })
    .catch(err => console.log(err));
});
