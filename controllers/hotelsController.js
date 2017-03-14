var mong = require('../services/mongoose/mongoose_storage.js');
var mong = require('../services/mongoose/mongoose_storage');
var trait = require('../services/traitement/traitement');


module.exports.controller = function(app) {

	////AFFICHER TOUS LES HOTELS ////

	app.get('/hotels', function(req, res) {
		mong.list().then(function(result){
			res.send({hotels: trait.traitement(result)});
		}).catch(function(err){
			console.log("Désolé nous avons rencontré le problème suivant :" + " " + err)
		})
	});

	//// TROUVER PAR ID ////

	app.get('/hotels/:id', function (req, res) {
		mong.find_by_id(req.params.id).then(function(result){
			if(result != null) {
				res.send({hotel: result})
			}
			else{
				console.log("Nous n'avons aucun résultat a vous proposer")
			}	
		})
	});


	////TROUVER PAR CODE POSTAL ////


	app.get('/ville/:codePostal/hotels', function(req, res){
		mong.find_by_city(parseInt(req.params.codePostal)).then(function(result){
			if(result != null) {
				console.log(result);
				res.send({hotels: result})
			}
			else{
				console.log("Nous n'avons aucun résultat a vous proposer")
			}	
		})
		
	})


	////TROUVER PAR CODE POSTAL ET DISTANCE DISTANCE EN METRE///

	app.get('/distance/:codePostal/:distance', function(req, res){
		mong.find_by_distance(req.params.codePostal, parseInt(req.params.distance)).then(function(result){
			if(result != "undefined"){
				console.log(result)
				res.send({hotels: result})
			}
			else{
				console.log("Nous n'avons aucun résultat a vous proposer")
			}

		})
	})

	////REALISER MOYENNE DES NOTE D'HOTEL PAR VILLE////

	app.get('/hotels/:codePostal/statistique/moyenne', function(req, res){
		mong.average_note(parseInt(req.params.codePostal)).then(function(result){
			if(result != "undefined"){
				res.send({moyenne_note_hotel: result});
			}
			else{
				console.log("Nous n'avons aucun résultat a vous proposer")
			}
		})
	})

	///REALISER MOYENNE CAPACITE HOTEL PAR VILLE////

	app.get('/hotels/:codePostal/statistique/capacite', function(req, res){
		mong.average_capacity(parseInt(req.params.codePostal)).then(function(result){
			if(result != "undefined"){
				res.send({average_population_hotel: result});
			}
			else{
				console.log("Nous n'avons aucun résultat a vous proposer")
			}
		})
	});

	///POST COMMENTAIRE////// UTILISER "LIMITER MIDDLEWARE " POUR LIMITER LE NOMBRE DE REQUETE PAR USER

	app.post('/hotels/:id/comment', function (req, res) {
	    if (req.method == 'POST') {
	    	if((req.body.author != "") && (req.body.comment_contenu.lenght != "")) {
	    		mong.post_comment(req.params.id, req.body.comment_contenu, req.body.author)
	    		console.log("ajouter en bdd")
	    	}else{
	    		console.log("il vous manque des champs a completer")
	    	}
	    }
	})

	///LISTER COMMENTAIRE ///

	app.get('/hotels/:id/comment', function (req, res) {
	    mong.list_comment(req.params.id).then(function(results){
	    	res.send({comments: results})
	    })
	})

}
