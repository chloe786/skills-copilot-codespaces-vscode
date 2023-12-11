// Create web server
var express = require('express');
var app = express();
// Create server
var server = require('http').createServer(app);
// Create socket
var io = require('socket.io')(server);
// Create path
var path = require('path');
// Create body-parser
var bodyParser = require('body-parser');
// Create cookie-parser
var cookieParser = require('cookie-parser');
// Create session
var session = require('express-session');
// Create flash
var flash = require('connect-flash');
// Create passport
var passport = require('passport');
// Create method-override
var methodOverride = require('method-override');
// Create moment
var moment = require('moment');
// Create mongoose
var mongoose = require('mongoose');
// Create multer
var multer = require('multer');
// Create fs
var fs = require('fs');

// Create config
var config = require('./config/config');

// Connect to database
mongoose.connect(config.database, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});

// Require models
var User = require('./models/user');
var Message = require('./models/message');

// Require passport
require('./config/passport')(passport);

// Require routes
var index = require('./routes/index');
var auth = require('./routes/auth')(passport);
var message = require('./routes/message');
var user = require('./routes/user');

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set cookie-parser
app.use(cookieParser());

// Set session
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
}));

// Set flash
app.use(flash());

// Set passport
app.use(passport.initialize());
app.use(passport.session());

// Set method-override
app.use(methodOverride('_method'));

// Set moment
app.locals.moment = require('moment');

// Set multer
app.use(multer({ dest: './uploads/'}).single('image'));

// Set routes
app.use('/', index);
app.use('/auth', auth);
app.use('/message', message);
app.use('/user', user);

//