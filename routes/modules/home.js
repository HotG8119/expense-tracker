const express = require("express");
const router = express.Router();

const Record = require("../../models/record");

router.get("/", (req, res) => {
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

module.exports = router;
