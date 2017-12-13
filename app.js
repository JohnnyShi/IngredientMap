var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// store session in mongodb
app.use(session({
    secret: 'a4f8071f-c873-4447-8ee2',
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        storage: 'mongodb',
        db: 'ingredientMap',
        collection: 'sessions',
        url: 'mongodb://johny:abk123321@ds135926.mlab.com:35926/ingredientmap'
    })
}));

// routing function
function routing(){
    var routes = require('./routes/index');
    routes(app);
}

var mongo = require('./models/db');

function connect(callback){
    mongo.connectToServer( function( err ) {
        if (err){
            throw err;
        }
// app.listen(app.get('port'), function() {
//   console.log('Express server listening on port ' + app.get('port'));
// });
        app.listen(process.env.PORT || 5000);
        callback();
    });
}
connect(routing);

module.exports = app;
