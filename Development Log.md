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