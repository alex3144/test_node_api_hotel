////TRAITEMENT EFFECTUER SUR LE LISTING DES HOTELS 
//// A.N: ON AURAIT PU FAIRE UN FIND SELON LES NOM ET NOMBRE D'ETOILE DIRECTEMENT DEPUIS MONGODB'
var traitement = function(result){
	var hotels = [];
	result.forEach(function(hot){
		hotels.push({name: hot.fields.nom_commercial, etoiles: hot.fields.classement})
	})
	return hotels
}

exports.traitement = traitement;