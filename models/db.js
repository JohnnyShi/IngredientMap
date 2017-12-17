const MongoClient = require('mongodb').MongoClient;
const mongoURI = 'mongodb://johny:abk123321@ds135926.mlab.com:35926/ingredientmap';

module.exports = {
	connectToServer: function(callback){
		MongoClient.connect(mongoURI, function(err, database){
			module.exports.db = database;
			callback(err);
		});
	}
}