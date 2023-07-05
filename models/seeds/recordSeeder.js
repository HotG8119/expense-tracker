const mongoose = require("mongoose");
const Record = require("../record");
const recordList = require("./date/records.json");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", () => {
  console.log("mongodb error!");
});

db.once("open", async () => {
  console.log("mongodb connected!");
  try {
    await Record.create(recordList);
    console.log("新增成功！");
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.disconnect();
  }
});
