const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI_CLOUD);
  } catch (error) {
    console.log("data base connection failed", error);
  }
};

module.exports = connectDb;
