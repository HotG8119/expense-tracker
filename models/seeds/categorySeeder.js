const mongoose = require("mongoose");
const Category = require("../category");
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
  const CATEGORY = {
    housing: "https://fontawesome.com/icons/home?style=solid",
    transportation: "https://fontawesome.com/icons/shuttle-van?style=solid",
    leisure: "https://fontawesome.com/icons/grin-beam?style=solid",
    food: "https://fontawesome.com/icons/utensils?style=solid",
    other: "https://fontawesome.com/icons/pen?style=solid",
  };
  try {
    for (const [name, iconUrl] of Object.entries(CATEGORY)) {
      await Category.create({ name, iconUrl });
    }
    console.log("新增成功！");
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.disconnect();
  }
});
