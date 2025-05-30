var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/cellphones")
  .then(() => console.log("Connect successful"))
  .catch((err) => console.log("Connect fail", err));

var cors = require("cors");

var corsOptionsDelegate = function (req, callback) {
  var corsOptions = { origin: true };
  callback(null, corsOptions);
};

var indexRouter = require("./routes/index");
var categoryRouter = require("./routes/category");
var productRouter = require("./routes/product");
var userRouter = require("./routes/user");
var authRouter = require("./routes/auth");
var uploadRouter = require("./routes/upload");

var app = express();

app.use(cors(corsOptionsDelegate));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/upload", uploadRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
