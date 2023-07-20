// const mongoose = require("mongoose");
// const Record = require("../record");
// const recordList = require("./date/records.json");

// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on("error", () => {
//   console.log("mongodb error!");
// });

// db.once("open", async () => {
//   console.log("mongodb connected!");
//   try {
//     await Record.create(recordList);
//     console.log("新增成功！");
//   } catch (err) {
//     console.log(err);
//   } finally {
//     mongoose.disconnect();
//   }
// });

const bcrypt = require("bcryptjs");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const Record = require("../record");
const User = require("../user");
const db = require("../../config/mongoose");

const SEED_RECORDS = require("./date/records.json");
const SEED_USERS = require("./date/users.json");

db.on("error", () => {
  console.log("mongodb error!");
});

db.once("open", () => {
  const createRecords = (userId, recordIds) => {
    return Promise.all(
      recordIds.map(id =>
        Record.create({
          ...SEED_RECORDS[id],
          userId,
        })
      )
    );
  };

  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USERS[0].password, salt))
    .then(hash =>
      User.create({
        name: SEED_USERS[0].name,
        email: SEED_USERS[0].email,
        password: hash,
      })
    )
    .then(user => createRecords(user._id, SEED_USERS[0].recordId))

    .then(() => bcrypt.genSalt(10))
    .then(salt => bcrypt.hash(SEED_USERS[1].password, salt))
    .then(hash =>
      User.create({
        name: SEED_USERS[1].name,
        email: SEED_USERS[1].email,
        password: hash,
      })
    )
    .then(user => createRecords(user._id, SEED_USERS[1].recordId))

    .then(() => {
      console.log("create seed done"), process.exit();
    });
});
