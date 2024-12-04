const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const flash = require("connect-flash");

const helpers = require("./helpers");
const handlers = require("./middlewares/handlers.middleware");
const router = require("./routes/index");
const session = require("./session");

const app = express();

// setting session
app.use(session);

app.use(flash());
// thanks to wesbos
// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);

// error handler
app.use(handlers.notFound);
app.use(handlers.errorHandler);

module.exports = app;
