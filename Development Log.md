### 12/05/2017

Finish documentation of initilization, and rigister and login module.

Use the `crypto` module to save password as md5.

TODO: check legalization dynamically

Pay special attention to mongodb connection. For now I deploy it locally, and I need to use `sudo mongod` to initialize the database, which brings the following warning:

```
Server has startup warnings: 
2017-12-06T21:16:48.509-0500 I CONTROL  [initandlisten] 
2017-12-06T21:16:48.509-0500 I CONTROL  [initandlisten] ** WARNING: Access control is not enabled for the database.
2017-12-06T21:16:48.509-0500 I CONTROL  [initandlisten] **          Read and write access to data and configuration is unrestricted.
2017-12-06T21:16:48.509-0500 I CONTROL  [initandlisten] ** WARNING: You are running this process as the root user, which is not recommended.
2017-12-06T21:16:48.509-0500 I CONTROL  [initandlisten] 
2017-12-06T21:16:48.509-0500 I CONTROL  [initandlisten] 
2017-12-06T21:16:48.509-0500 I CONTROL  [initandlisten] ** WARNING: soft rlimits too low. Number of files is 256, should be at least 1000
```

Although I can still manipulate the database, this problem is to be solved later.

### 12/06/2017

Finish Navigation Bar module, with `Bootstrap` framework.

Pay special attention to `class="navbar-brand"`, solve the bug of combine logo image and name together.

There are several ways claim to solve the problems:

1. Official Document, Not working

```
<!-- Image and text -->
<nav class="navbar navbar-light bg-faded">
  <a class="navbar-brand" href="#">
    <img src="/assets/brand/bootstrap-solid.svg" width="30" height="30" class="d-inline-block align-top" alt="">
    Bootstrap
  </a>
</nav>
```

2. Customized css, working

```
<a href="/" class="navbar-brand">
  <span><img src="/images/brand/logo.svg" alt=""></span>
  ingredientMap
</a>
```

```
.navbar-brand span img {
	height: 30px;
	width: 30px;
}
```

The height and width shoud use absolute value.



Also, notice that if I use `navbar-fixed-top` class as the nav bar style, then it will cover the contents of the top page. To solve this, simply add `padding-top` of 65px to `body`.

### 12/07/2017

Learn to align elements in css. 

With this link, <https://css-tricks.com/centering-css-complete-guide/>, you can align both vertically and horizontally for any inline or block elements.

4 common ways for CSS layouts:

1. max-width + margin auto + box-sizing
2. position
3. float + clear + percentage width + responsive media query
4. display:inline-block + width & height + vertical-align
5. flex

### 12/08/2017

Learn to deal with all situations of form validation.

To validate a form, there are 2 kinds of validation:

1. Server validation

The validation takes place on the Server during a post back session. The server sends a feedback of a new generated web page. This is safer because users can't access the validation procedure. It needs a php or asp script to test.

2. Client Validation

The validation doesn't need to go a round trip to server, which can save time and traffic. It's more user friendly, but vulnerable to malicious attacks. The validation of invalid email address or password is detected by JavaScript via the browser.

In general, for a better user experience, we should use client validation, as well as the server validation for a more secured protection.

#### BootStrap Form

For the form components, the first thing is the skeleton.

```
<div class="container">
	<form class="my-form">
		<div class="form-group">
			<label for="exampleInputEmail" class="control-label">Email Address</label>
			<input type="email" class="form-control id="exampleInputEmail"/>
		</div>
	</form>
</div>			
		
```

Usually place several divs of `form-group` class in a form.

Add class `form-control` to textual contents like `<input>`, `<textarea>` and `<select>` for general appearance and sizing. If the input is a file, change to `form-control-file`.

Correspondingly, for checkboxes and radios, we place `form-check` for divs. Add `form-check-inline` to make it inline.

A form can be made in vertical, horizontal and inline ways.

#### Validation

HTML form validation is based on two CSS pseudo-classes, `:invalid` and `:valid`, which apply to textual elements. Also known as `is-invalid` and `is-valid`.

For client validation, it is more user-friendly to check validation dynamically.

In a js file, First we define a prototype of function `CustomValidation`, which is a function that takes in the content of an input element, then find what kind of validityCheck to perform, collect the invalid information, then add a listener.

```
function CustomValidation(input){
	this.invalidities = []; // array of invalid messages
	this.validityChecks = []; // items to be checked
	this.inputNode = input; // add reference to the input node
	this.registerListener(); // trigger method to attach the listener
}
```

After that, add method to this prototype:

```
CustomValidation.prototype = {
  	addInvalidity:function(message){},//push into array
  	getInvalidity:function(message){},//get a string with '/n'
  	checkInvalidity:function(input){},//add valid or invalid class to <li> element
  	checkInput:function(){},//use build-in setCustomValidity function to show invalidity message
  	registerListener:function(){}//add keyup listener to call checkInput()
}
```

And next step, is to define the input array to be checked. Each element in the array has three things:

```
{
  	isInvalid:function(input){},
  	invalidityMessage: '',
  	element: //the <li> element to be checked
}
```

Then finally, for each usernameInput, passwordInput and so on, create CustomValidation on them and use corresponding input array. Also, add listener to double check when submit the form.

#### Difference between id and name attribute

`name` doesn't have to be unique, and can't be referenced in URL or used as anchor. It is referenced in JS with `getElementsByName()`. The most important function is __only input tag with a `name` attribute are submitted to the server__.

`id` should be unique in the pages, and can be used as anchor reference, using `getElementById()` in JS and `$(#<id>)` in jQuery.

#### Difference between explicit and implicit label

Implicit way:

```
<label>First name: <input type="text" name="firstname"/></label>
```

Explicit way:

```
<label for="firstname">First name:</label>
<input type="text" name="firstname" id="firstname"/>
```

The explicit way is supported in most of the browsers, and is friendly to screen readers.

#### JavaScript Prototypes

All Javascript objects inherit the properties and methods from their prototype.

Objects created using an object literal, like `new Object()`, inherits from `Object.prototype()`.

We can construct an object using Constructor:

```
function Person(first, last, age, eyecolor) {
    this.firstName = first;
    this.lastName = last;
    this.age = age;
    this.eyeColor = eyecolor;
}
```

Then use `new` to create instance:

```
var myFather = new Person("John", "Doe", 50, "blue");
```

To add a property of a method to one instance, simply add:

```
myFather.nationality = "English";
myFather.name = function () {
    return this.firstName + " " + this.lastName;
};
```

But to add properties or method to an object, it needs to be defined in constructor. Otherwise, we need to use `Person.prototype.name` to define the function.

````
Person.prototype.name = function() {
    return this.firstName + " " + this.lastName;
};
````

In addtion, to find out the prototype object of an instance, using the `__proto__` member. Every instance has `__proto__` attribute, but only function instance has `prototype` attribute.

```
var two = new Object();
two.__proto__ === Object.prototype // true
```

#### CSS selector

1. class selector `.class`
2. id selector `#id`
3. All selector `*`
4. Element `p`, `div, p`, `div p`, `div > p`. With a `>`, it finds `p` only when `div` is the direct father
5. Attribute `p[title=""]`.
6. Pseudo classes and elements `:active`, `:hover`, `:nth-child(n)`.

#### setCustomValidity

The `HTMLSelectElement.setCustomValidity()` method sets the custom validity message for the selection element to the specified message. Use the empty string to indicate that the element does *not* have a custom validity error.



#### 12/11/2017

Set mongodb database on mLab

Since on mLab, a free mongodb database is in a shared plan, which means we are not the admin of this database, which limits our usage in the database `ingredientmap` itself, and that's why some instructions work locally but not online. If it shows `not authoriszed on *** to execute command`, probably you work beyond your own database.

#### Connect mongodb

There are two ways to open/connect to the mongodb server.

1. Export a db instance, then open and close for each operation

In a `mongo.js` file, exporting a database object to use in other files.

```
module.exports = new Db(settings.db, new Server(settings.host, settings.port),{safe: true}); 
```

Typically this is used locally, in which `settings.db` is the db name, `host` is `localhost`, and port is `27017`. After that, just `var mongodb = require('mongo.js')` then it can be used in other files.

But obviously, the `connect` operation costs too much, and typically to use in an online site, it should open the connection only once and link to an online host.

2. Export function, connect in the `app.js`, then use db in other files.

In `mongo.js` file, exporting functions use mongoClient:

```
const MongoClient = require('mongodb').MongoClient;
const mongoURI = 'mongodb://username:password@ds135926.mlab.com:35926/ingredientmap';

module.exports = {
	connectToServer: function(callback){
		MongoClient.connect(mongoURI, function(err, database){
			module.exports.db = database;
			callback(err);
		});
	}
}
```

After that, in `app.js` file, connect to database, and remember to put synchronization codes in a callback function, because the connection needs to be opened before accessing db object:

```
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
        app.listen(process.env.PORT || 5000);
        callback();
    });
}
connect(routing);
```

After that, access the db object in other files:

```
var mongo = require('./db');
var mongodb = mongo.db;
//open users collection
    mongodb.collection('users', function (err, collection) {
        if (err) {
            return callback(err);
        }
        //insert user
        collection.insert(user, {safe: true}, function (err, user) {
            if (err) {
                return callback(err);
            }
            callback(null, user[0]);//successful! err = null, return collection
        });
    });
```

3. In the future project, I may try `mongoose` or other modules, but for now I use the native mongo client.

#### Cookie Session



#### 12/13/2017

#### Relative path and Absolute path in express

There are 5 types of file path in node, including `__dirname`, `__filename`, `process.cwd()`, `./` and `../`, among which the first three are absolute, and the rest are relative path.

`__dirname` always returns the absolute path of the directory of the executed file, and `__filename` always returns the path of the executed file.

`process.cwd()` returns the path of the directory when running the `node` command.

In node, when using `require()`, the `./` locates in `__dirname`, while for other circumstance, `./` locates in the same place as `process.cwd()`.



#### 12/15/2017

#### HTML Self close tag

In HTML5, tags like `link`, `img`, `br` are self-closing tags, which has no use to add the `/`, and should not be added

#### Float an element

When implementing moving the caps lock icon in the input box, I first use `float: right` to align the icon at the right border, then move the icon up. Now, if I only set `top: -5px` and `right: -5px`, the block moves up, but due to the ability of float, it will pass around the input block and append to the right. To achieve our goal, we modify the margin-top as negative value to move it up, then using the border with the same direction of the float, aka positive right value. And since we also set `position:relative`, it will cover the background input block.

To move an element over another one, it's conveneint to use `float` + `margin-top` / `margin-right`.

#### event and originalEvent in jQuery

In a jQuery function, like:

```
$('.mask').on('wheel', function (event) {
    let offset = event.deltaY
    ...
}) 
```

It will alert 'event does not have the deltaY attribute'.

That's because event in jQuery is not exactly like the original event object. And to visit the original event element, using:

```
let offset = event.originalEvent.deltaY
```

#### Check keyboard key

`keypress` only detects keys that generates numbers or characters, while `keyup` and `keydown` are more generally.

To check whether a specific key is pressed on keyboard, use `event.getModifierState(key)`. The `keycode` and `charcode` attributes are deprecated, instead using `key` and `code` in string format. 