const express = require("express");
const router = express.Router();

const Record = require("../../models/record");

router.get("/", (req, res) => {
  const userId = req.user._id;
  let totalAmount = 0;

  Record.find({ userId })
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

router.get("/category/:categoryBy", (req, res) => {
  const userId = req.user._id;
  const categoryBy = req.params.categoryBy;
  let totalAmount = 0;

  Record.find({ category: categoryBy, userId })
    .lean()
    .then(records => {
      records.forEach(record => {
        //轉換日期格式
        const date = record.date.toISOString().slice(0, 10);
        record.date = date;
        //加總金額
        totalAmount += record.amount;
      });

      res.render("index", { records, categoryBy, totalAmount });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
