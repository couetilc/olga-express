var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var category = require('./routes/category');

var app = express();

var config = require('./.config.json'); // hidden configuration variables

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); //Handlebars view engine

/***    Middleware for all requests    ***/

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Setting app environment indicator variable.
if (process.env.NODE_ENV === 'production') {
    app.set('env', 'production');
} else {
    app.use(logger('dev'));
    app.set('env', 'development');
}

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/***    Main routes for website.  Handled in routes/ directory    ***/
app.use('/', index);
app.use('/category', category);

/***    Error Handling when no routes are matched.    ****/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});

module.exports = app;
