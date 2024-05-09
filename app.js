var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dayjs = require("dayjs");
const { getTokenRule } = require("./common/jwt");
const { query } = require("./common/mysql");
var indexRouter = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.all("*", function (req, res, next) {
  //Set the domain names that are allowed to cross domains. *means that any domain name is allowed to cross domains.
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  // //Allowed header types
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  // //Cross-domain request methods allowed
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  // Can bring cookies
  res.header("Access-Control-Allow-Credentials", true);
  if (req.method == "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(getTokenRule()); // jwt permission settings
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    next(createError(401));
  }
});
app.use("/api/react-ant-admin", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let url = req.url;
  let time = dayjs().format("YYYY-MM-DD HH:mm:ss");
  let statusCode = err.status || 500;
  ip = ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
  let sql = "insert into statistics values(null,?,?,?,?)";
  let params = [ip, url, time, statusCode];
  query(sql, params, function (err) {
    console.log(err);
  });
  // render the error page
  res.status(statusCode);
  res.render("error");
});

module.exports = app;
