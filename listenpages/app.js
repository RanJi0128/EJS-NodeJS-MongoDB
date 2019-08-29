var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
//var referrer = require('referrer')

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var artists = require('./routes/artists');
var listen = require("./controllers/ListenController");


var app = express();

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.json());
app.use(bodyParser.text());

app.use('/', artists);

//app.use(referrer.middleware);

app.get('/favicon.ico', (req, res) => res.status(204));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  listen.show(req, res)
  // console.log("*****************");
  // next(createError(404));
});

mongoose.connect('mongodb://localhost/product')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

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
