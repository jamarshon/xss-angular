var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var compression   = require('compression');
var express       = require('express');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var mime          = require('mime');
var path          = require('path');

var routes = require('./routes/routes');

var app = express();

app.use(compression());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
var isProduction = app.get('env') === 'production';
var publicPath = isProduction ? 'public/dist' : 'public';
var oneYear = 31536000;
var productionCache = {setHeaders: function (res, path) {
    var type = mime.lookup(path);
    if(type === 'application/javascript' || type === 'text/css') {
      res.setHeader('Cache-Control', 'public, max-age=' + oneYear);
    }
  }
};
var options = isProduction ? productionCache : {};

app.use(favicon(path.join(__dirname, publicPath, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, publicPath), options));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
