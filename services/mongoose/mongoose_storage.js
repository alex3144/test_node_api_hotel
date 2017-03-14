var mongodb = require('mongodb').MongoClient;
var Q = require('Q');
var ObjectID = require('mongodb').ObjectID;


///// GESTION DE LA CONNEXION A MONGO DB/////

var url = "mongodb://127.0.0.1:27017/tasks";
var connection = mongodb.connect(url);


//LISTE///

var list = function(){
	var d = Q.defer();
	connection.then(function(db){
		db.collection("hotels").find().toArray(function(err, result) {
	       d.resolve(result);
	  	});	
	})
	return d.promise;
}

///FIND BY ID////

var find_by_id = function(id){
	var d = Q.defer();
		connection.then(function(db){
			db.collection('hotels').find({_id: new ObjectID(id)}).toArray(function(err, result) {
			    d.resolve(result);
			});	
	})
	return d.promise
}

///FIND BY CITY ///

var find_by_city = function(code_postal){
	var d = Q.defer()
		connection.then(function(db){
			db.collection('hotels').find({"fields.code_postal": code_postal}).toArray(function(err, result) {
				console.log(result)
			    d.resolve(result);
			});	
	})
	return d.promise
}

///FIND BY DISTANCE ///

var find_by_distance = function(code_postal, distance){
	var d = Q.defer();
	connection.then(function(db){
		db.collection('code_postal').find({code_postal: code_postal}).toArray(function(err, result) {
			db.collection('hotels').find({
				"geometry" : {
			     	$near: {
			       		$geometry: {
			          		type: "Point" ,
			          		coordinates: result[0].geometry.coordinates
			       		},
			       		///DISTANCE EN METRE ///
			       		$maxDistance: distance,
			    	}
		    	}
			}).toArray(function(err, result) {
	    		d.resolve(result);
	  		});	
		})	
	})
	return d.promise
}

//// AVARAGE FOR CAPACITY ///

var average_capacity = function(code_postal){
	var d = Q.defer();
	connection.then(function(db){
		db.collection('hotels').aggregate(
			[	
				{
					$match : 
						{
							"fields.code_postal" : code_postal
						}
				},
				{ 
					$group : 
						{ 	
							_id: "capacite_d_accueil_par_ville" , moyenne: {$avg : "$fields.capacite_d_accueil_personnes"}
						}
				}
			],
			function (err, result) {
        		d.resolve(result);
    		}
		);
	})
	return d.promise
}

//// AVARAGE FOR NOTE ///

var average_note = function(code_postal){
	var d = Q.defer();
	connection.then(function(db){
		db.collection('hotels_average').aggregate(
			[	
				{
					$match : 
						{
							"code_postal" : code_postal
						}
				},
				{ 
					$group : 
						{ 	
							_id: "nombre_étoiles_par_ville" , moyenne: {$avg : "$classement_fixnum"}
						}
				}
			],
			function (err, result) {
        		d.resolve(result);
    		}
		);
	})

	return d.promise
}

//// INSERT COMMENT ////

var post_comment = function(id, comment, author ){
	connection.then(function(db){
		db.collection('hotels').find({_id: new ObjectID(id)}).toArray(function(err, result) {
			if(result.length > 0) {
				db.collection('comments').insert({comment : {"content": comment,"author": author, "date": new Date, "hotel_id": result[0]._id}});
			}
		});
	})
}


/// LISTER TOUS LES MESSAGES D'UN HOTEL ////

var list_comment = function(id){
	var d = Q.defer();
	connection.then(function(db){
		db.collection('comments').find({_id: new ObjectID(id)}).toArray(function(err, result) {
			d.resolve(result)
		})
	})
	return d.promise
}


/// GESTION DES EXPORTS DE TOUTES LES FONCTIONS DE MON FICHIER ////
  
exports.list = list;
exports.find_by_id = find_by_id;
exports.find_by_city = find_by_city;
exports.find_by_distance = find_by_distance;
exports.average_capacity = average_capacity;
exports.average_note = average_note;
exports.connection = connection;
exports.post_comment = post_comment;
exports.list_comment = list_comment;

        