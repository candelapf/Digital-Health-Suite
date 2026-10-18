angular.module('patientService', [])

.factory('Patient', function($http) {


	// create a new object
	var patientFactory = {};

	// log a user in 
	patientFactory.login = function(username, password) { 
		return $http.post('/api/authenticate', {username: username,password: password}); 
	};

	// get associated weights 
	patientFactory.Weights = function(id) { 
		return $http.get('/api/weights/'+id); 
	};

	// petición post al servidor
	patientFactory.addWeight = function(weightData) {
    	return $http.post('/api/weights', weightData);
	};

	// Función para eliminar un peso enviando IDs de peso y paciente
	patientFactory.deleteWeight = function(weightID, patientID) { 
		return $http.delete('/api/deleteWeights/' + weightID + '/' + patientID); 
	};

	// Obtener visitas asociadas al paciente
	patientFactory.associatedVisits = function(id) {
		return $http.get('/api/associatedVisits/' + id);
	};

	// return our entire userFactory object
	return patientFactory;

});
