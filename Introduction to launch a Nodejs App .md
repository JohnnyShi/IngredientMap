---
typora-copy-images-to: ./doc images
---

# How to launch a Nodejs App
##Initilization

For every nodejs app, the first step is using express generator to generate a

template.

```shell
npm install express-generator -g
```

Then create a project

```shell
express myapp --view=ejs
```

After that, cd to target folder and install default dependency

```
cd myapp
npm install
```

At last, start the project locally

```
DEBUG=myapp npm start
```

## Details in app.js

In app.js, we define `app` as an instance, `__dirname` as a global variable for current address. In the code below, we set folder `views` as location folder to store views files, aka ejs files, and we set view engine as ejs. Also, we set public folder to store static files, like images, js and css.

```
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
```

```
app.use(express.static(path.join(__dirname, 'public')));
```

Another important line is:

```
module.exports = app;
```

like returning a value for other files.

For the rest part, there are codes for routering:

```
app.use('/', routes);
```

and codes for rendering:

```
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
```

So for an elegant design, we move routering to a router file, and rendering to ejs files.

At last, app.js should be:

```
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routes(app);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
```

And index.js should be:

```
module.exports = function(app) {
  app.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
  });
};
```

## Rules for routering

In express, multiple http requests are encapsulated, and most of the time we use `app.get()` and `app.post()`.

`req.query` gets parameters for `get` request.

```
// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse  
req.query.order  
// => "desc"
```

`req.body` gets parameters for `post` request.

```
// POST user[name]=tobi&user[email]=tobi@learnboost.com  
req.body.user.name  
// => "tobi"  
```

`req.params` gets parameters from `get` and `post`.

Both `get` and `post` have two paramters, the first is the address of the request, the second one is a callback function which has two parameters called req and res.

## Template Engine

The templeate engine combines model and data together and renders html pages, like the view role in MVC.

In `ejs` engine, it has three tags:

`<% code %>`: JavaScript Code.

`<%= code %>`: The content will be replaced by the variable in the code.

`<%- code %>`: Original HTML contents.

Also, when building layout of the page, the `include` is convenient:

```
<%- include a %>
hello,world!
<%- include b %>
```

## Connect to MongoDB

###Download and install

```
brew install mongodb
```

Or downloads and install a `tgz` file manually:

```
tar -zxvf mongodb-osx-x86_64-3.4.2
```

Then move the file to a default root directory:

```
mv -n ~/Downloads/mongodb-osx-x86_64-2.4.6 ~/Applications/mongodb/
```

Next, create a `data/db` directory to place data of mongodb

```
sudo mkdir -p /data/db
sudo chown -R  johny /data
```

After that, start mongodb service:

```
sudo mongod
```

At this point, you can visit `http://localhost:27017/`, and it should print:

```
It looks like you are trying to access MongoDB over HTTP on the native driver port.
```

This means the server is listening. And finally, open another terminal and input

```
cd Applications/mongodb/bin
mongo
```

At this point, the mongodb database should be connected successfully.

###Connect mongoDB with project

Firstly, install dependency.

```
npm install mongodb --save
```

After that, create a `settings.js` file in root directory of the project, to store configuration data for the project, including database information. The code is like:

```
module.exports = { 
  cookieSecret: 'myapp', 
  db: 'myapp', 
  host: 'localhost',
  port: 27017
}; 
```

Then create a `models` directory and new a `db.js` in it:

```
var settings = require('../settings'),
  Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host, settings.port), {safe: true});
```

This file exports a database instance, which can be used for read and write once we require this file. And in app.js, add this line:

```
var settings = require('./settings');
```

## Session and Cookie

Session is a web protocol for interaction between server and client, which may include multiple connections, from registering into the system to logout the system. 

Since each http request and response is independent, the server needs a merchanism to distinguish between users, so cookie is used to store user status and identifies a user.

When a user first visits a website, the server know nothing about a user, so it sends a cookie to the user and save in the browser. After that, each time the user sends request to this website, the http request will take this cookie together, which will help the server to identify this user.

In express, there is a middleware `express-session` to save session id. Also, we want to save cookie in database, so another module called `connect-mongo` is used.

After installing the dependencies, in `app.js`, add this code block:

```
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port
  })
}));
```

## Register and Login module

### Initialize routering and views

Normally every complex system should have a user system. The first step is to add get and post request in router. After that, define some `ejs` pages for basic requirements, like username and password.

A useful module is `connect-flash`, which can be used in redirection to show if the request is successful or not. So in `app.js`:

```
var flash = require('connect-flash');
app.use(flash());
```

### Register

In `models` directory, create a `user.js`. 

Firstly, new a mongodb instance and a user instance:

```
var mongodb = require('./db');
function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};
module.exports = User;
```

Next, save a new user:

```
User.prototype.save = function(callback) {
  //user document to be saved
  var user = {
      name: this.name,
      password: this.password,
      email: this.email
  };
  //open database
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //open users collection
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //insert user
      collection.insert(user, {
        safe: true
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, user[0]);//successful! err = null, return collection
      });
    });
  });
};
```

Also, we need to check if the user is already created:

```
User.get = function(name, callback) {
  //open database
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //open users collection
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //find a user using name
      collection.findOne({
        name: name
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, user);//successful! return user information
      });
    });
  });
};
```

Then, in `index.js`, we use `crypto` module to hash the password.

In index.js, add the post of register:

```
app.post('/reg', function (req, res) {
  var name = req.body.name,
      password = req.body.password,
      password_re = req.body['password-repeat'];
  //check if these two passwords are the same.
  if (password_re != password) {
    req.flash('error', 'password unmatches'); 
    return res.redirect('/reg');
  }
  //generate md5 of password
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  var newUser = new User({
      name: name,
      password: password,
      email: req.body.email
  });
  //check if user is existed
  User.get(newUser.name, function (err, user) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    if (user) {
      req.flash('error', 'user existed!');
      return res.redirect('/reg');
    }
    //add new user
    newUser.save(function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      req.session.user = user;//save information into session
      req.flash('success', 'register successful');
      res.redirect('/');
    });
  });
});
```

Finally, to show the error and success message in ejs pages, simply add the following codes to all the `index.ejs`, `login.ejs`, and `reg.egs`.

```
<% if (success) { %>
  <div><%= success %></div>
<% } %>
<% if (error) { %>
  <div><%= error %> </div>
<% } %>
```

Modify routering of index page:

```
app.get('/', function (req, res) {
  res.render('index', {
    title: 'main page',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
```

And register page:

```
app.get('/reg', function (req, res) {
  res.render('reg', {
    title: 'register',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
```

In general, after a user's registration, we save the user information into session, then when rendering `index.js`, it will show different navigation information.

## Login

Modify `app.post('/login')` and `app.get('/login')`:

```
app.post('/login', function (req, res) {
  //generate md5 password
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  User.get(req.body.name, function (err, user) {
    if (!user) {
      req.flash('error', 'user unexisted!'); 
      return res.redirect('/login');
    }
    if (user.password != password) {
      req.flash('error', 'wrong password!'); 
      return res.redirect('/login');
    }
    req.session.user = user;
    req.flash('success', 'successully login');
    res.redirect('/');
  });
});
```

```
app.get('/login', function (req, res) {
    res.render('login', {
        title: 'login',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()});
});
```

Then implements the logout response

```
app.get('/logout', function (req, res) {
  req.session.user = null;
  req.flash('success', 'logout successfully!');
  res.redirect('/');
});
```