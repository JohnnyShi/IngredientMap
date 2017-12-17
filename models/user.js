var mongo = require('./db');
var mongodb = mongo.db;

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
    this.imgUrl = user.imgUrl;
};

module.exports = User;

User.prototype.save = function(callback) {
    //user document to be saved
    var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        imgUrl: this.imgUrl
    };
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
};

User.get = function(name, callback) {
    //open users collection
    mongodb.collection('users', function (err, collection) {
        if (err) {
            return callback(err);
        }
        //find a user using name
        collection.findOne({name: name}, function (err, user) {
            if (err) {
                return callback(err);
            }
            callback(null, user);//successful! return user information
        });
    });
};