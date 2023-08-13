require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

//internal imports

const { logger, logEvents } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const corsOptions = require("./config/corsOptions");
const connectDb = require("./config/dbConn");

const app = express();

connectDb();
//connecting to db

app.use(logger);

//cors mw : making api public

app.use(cors(corsOptions));

//parsing json
app.use(express.json());

//cookie parser
app.use(cookieParser());

const PORT = process.env.PORT || 3500;

//setting static folder: built-in middleware

app.use("/", express.static(path.join(__dirname, "/public")));

//this also works

// app.use(express.static("public"));

app.use("/", require("./routes/root"));

app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/notes", require("./routes/notesRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found" });
  } else {
    res.type("text").send("404 not found");
  }
});

//error  handling middleware
app.use(errorHandler);

//database connection listener

mongoose.connection.once("open", () => {
  console.log("Connected to DB");
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);

  logEvents(`${err.no}:${err.code} \t${err.syscall}`);
});
