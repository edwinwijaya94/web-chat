var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//init MySQL pool connection
require('./utils/mysql').init();

//init RabbitMQ connection
require('./utils/rabbitmq').init(function(){
  require('./consumers').startListeners();
});

//include middlewares
var routes = require('./routes/index');
var api = require('./api');

//create app
var app = express();

//init server socket
var server = require('http').Server(app);
module.exports = {app: app, server: server};

var io = require('socket.io')(server);
app.set('clientSocket', {});

// Init auth for socket io and retain mapping between uid and corresponding socket
require('socketio-auth')(io, {
  authenticate: function (socket, data, callback) {
    var id = data.id;

    console.log('Receive socket connection ; ID : ' + id);

    if (uid) {
        app.get('clientSocket')[uid] = socket;
        callback(null, true);
    } else {
      callback(new Error("Not Authorized"));
    }
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', api);
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));

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
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


module.exports = app;
