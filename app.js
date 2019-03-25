/* MTI CONFIDENTIAL INFORMATION */
// vendor libraries
var express = require('express');
var path = require('path');
var expressSession = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var useragent = require('express-useragent');
var bcrypt = require('bcryptjs');
var expressSessionStore = new expressSession.MemoryStore;
var compression = require('compression');
var passportSocketIo = require("passport.socketio");
var ioServer = require('socket.io');

// custom libraries
// routes
var routes = require('./routes/index');
//libs
var passport = require('./libs/passport');
var skio = require('./libs/skio');
var libConfiguration = require('./libs/libConfiguration'); //Add by Roy for add language package, 2019-02-15.

var app = express();

app.use(compression());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(favicon(__dirname + '/public/MTI.ico'));
app.use(logger('dev'));

// body-parser for retrieving form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(expressSession({
  store: expressSessionStore,
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(useragent.express());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use(flash());

app.use(function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('Client IP:', ip);
  next();
});
//Add by Roy for add language package, 2019-02-15.
app.get('/language', function (req, res, next) {
    next();
}, function (req, res, next) {
    var DBNum = 1, DBCount = 0;
    var lang;

    libConfiguration.getDBConfLang(function (result) {
        lang = result;
        DBCount++;
    });

    response = function () {
        if (DBCount < DBNum) {
            setTimeout(response, 100);
        } else {
            DBCount = 0;
            res.json(lang);
        }
    }
    response();
})
//End by Roy for add language package, 2019-02-15.
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
    res.render('error.html', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error.html', {
    message: err.message,
    error: {}
  });
});

var debug = require('debug')('mti_iot_catchers_server');
var http = require('http');

// Https
var fs = require('fs');
var https = require('https');
var options = {
  key: fs.readFileSync(__dirname + '/ssl/file.pem'),
  cert: fs.readFileSync(__dirname + '/ssl/file.crt')
};

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
var httpsPort = normalizePort(process.env.HTTPSPORT || '3443');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Create HTTPS server
 */
var serverHttps = https.createServer(options, app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

serverHttps.listen(httpsPort);
serverHttps.on('error', onError);
serverHttps.on('listening', onListening);

/**
 * Create Socket.
 */
var io = new ioServer();

io.attach(server);
io.attach(serverHttps);

skio.init(io, passportSocketIo, expressSessionStore);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

console.log('RIOT app started on port %d', 3000);
