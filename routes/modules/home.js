const express = require("express");
const router = express.Router();

const Record = require("../../models/record");
const Category = require("../../models/category");

router.get("/", (req, res) => {
  const userId = req.user._id;
  let totalAmount = 0;

  Record.find({ userId })
    .sort({ date: -1 })
    .lean()
    .then(records => {
      Category.find()
        .lean()
        .then(categories => {
          //加入圖示
          records.forEach(record => {
            categories.forEach(category => {
              if (category.name === record.category) {
                record.icon = category.icon;
              }
            });
            //轉換日期格式
            record.date = record.date.toISOString().slice(0, 10);
            //加總金額
            totalAmount += record.amount;
          });

          res.render("index", { records, totalAmount });
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
});

router.get("/category/:categoryBy", (req, res) => {
  const userId = req.user._id;
  const categoryBy = req.params.categoryBy;
  let totalAmount = 0;

  Record.find({ category: categoryBy, userId })
    .sort({ date: -1 })
    .lean()
    .then(records => {
      Category.find()
        .lean()
        .then(categories => {
          //加入圖示
          records.forEach(record => {
            categories.forEach(category => {
              if (category.name === record.category) {
                record.icon = category.icon;
              }
            });
            //轉換日期格式
            record.date = record.date.toISOString().slice(0, 10);
            //加總金額
            totalAmount += record.amount;
          });

          res.render("index", { records, categoryBy, totalAmount });
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
});

module.exports = router;
