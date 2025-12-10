var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const passport = require("passport"); // ✅ Ensure this is correct



require("./config/passport");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var categoryRouter = require('./routes/category');
var subCategoryRouter = require('./routes/subCategory');
var userMailRouter = require('./routes/userMail');
var sliderRouter = require('./routes/slideImgRoutes');
var cartRoutes = require('./routes/cart');
var favoriteRoutes = require('./routes/favorites');
var orderRoutes = require('./routes/order')

const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
.then(() => console.log('connected'));


var app = express();
// 
app.use(cors());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use("/images", express.static(path.join(__dirname, "public/images")));

// Initialize passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true, sameSite: "none" }, // Adjust based on deployment
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product',productRouter);
app.use('/category',categoryRouter);
app.use('/subCategory',subCategoryRouter);
app.use('/usermail',userMailRouter)
app.use("/auth", authRoutes);
app.use('/slider',sliderRouter);

app.use("/cart", cartRoutes);
app.use("/favorites", favoriteRoutes);

app.use("/api/order", orderRoutes);


// app.use('/currency',currencyRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
