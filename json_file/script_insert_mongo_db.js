var mongodb = require('mongodb').MongoClient;
var hotels = require('./hotel.json');
var records = require('./correspondance-code-insee-code-postal.json');



mongodb.connect("mongodb://127.0.0.1:27017/tasks", function(err,db){
	for ( hotel in hotels) {
		var reg = hotels[hotel].fields.classement.match('([0-9]{1})');
		if (reg){
			db.collection('hotels_average').insert({code_postal: hotels[hotel].fields.code_postal, classement_fixnum: parseInt(reg[0])});
		} 		
	}
})



mongodb.connect("mongodb://127.0.0.1:27017/tasks", function(err,db){
	for (record in records) {
		db.collection('code_postal').insert({code_postal: records[record].fields.postal_code, geometry: records[record].geometry});
	}
})
