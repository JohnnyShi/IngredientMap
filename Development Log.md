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



