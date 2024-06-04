var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const RateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local");

require("dotenv").config();
// MongoDB Connection Setup //
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// Rate Limiter //
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
});

// Router //
var indexRouter = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
    cookie: {
      maxAge: 1000 * 30,
    },
  })
);
app.use(passport.session()); // authentication

app.use("/", indexRouter);

// Authentication Strat //
// authentication strategy //
const User = require("./models/user");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // check for username
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "no username found" });
      }
      // compare passwords
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "password does not match" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// rate limiter
app.use(limiter);

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
