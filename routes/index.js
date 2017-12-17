var crypto = require('crypto');
var User = require('../models/user.js');
var request = require('request');
var bodyParser = require('body-parser');

var fs = require('fs');
const defaultImgDir = './public/images/portraits/';

// An array of default user portraits
var defaultImgArray = fs.readdirSync(defaultImgDir);

// get a random portrait
function getImgUrl(){
    var index = Math.floor((Math.random() * defaultImgArray.length + 1))-1;
    var img = defaultImgDir + defaultImgArray[index];
    return img;
}



module.exports = function(app) {
    app.get('/', function (req, res) {
        res.render('index', {
            title: 'Main Page',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: 'Register',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/reg', function (req, res) {
        var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'],
        imgUrl = getImgUrl(),
        recaptcha = req.body['g-recaptcha'];
        console.log(recaptcha);
        console.log(req.body);
        //check racaptcha
        if (recaptcha === undefined || recaptcha === '' || recaptcha === null){
            return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"})
        }
        var secretKey = "6Lcq0TwUAAAAALFsshRJr6ypSZ50OzlPUUj4ufwV";
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey 
        + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

        // Hitting GET request to the URL, Google will respond with success or error scenario.
        request(verificationUrl,function(error,response,body) {
            body = JSON.parse(body);
            // Success will be true or false depending upon captcha validation.
            if(body.success !== undefined && !body.success) {
                return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
            }
            res.json({"responseCode" : 0,"responseDesc" : "Success"});
        });

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
            email: req.body.email,
            imgUrl: imgUrl
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
    app.get('/login', function (req, res) {
        res.render('login', {
            title: 'login',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()});
        });
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
            req.flash('success', 'successfully login');
            res.redirect('/');
        });
    });
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', 'successfully logout!');
        res.redirect('/');
    });
};
