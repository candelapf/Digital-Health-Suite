angular.module('managementService', [])

.factory('Management', function($http) {


	// create a new object
	var managementFactory = {};


	// get all patients 
	managementFactory.allPatients = function() { 
		return $http.get('/api/patients/');
	};

	// add new patient 
	managementFactory.addPatient = function(patientData) { 
		return $http.post('/api/patients/', patientData); 
	}; 

	// delete a patient 
	managementFactory.deletePat = function(id) { 
		return $http.delete('/api/patients/' + id); 
	};

	// update a patient
	managementFactory.editPat = function(id, Data) {
		return $http.put('/api/patients/' + id, Data); 
	};


	// get all doctors
	managementFactory.allDoctors = function() { 
		return $http.get('/api/doctors/');
	};

	// add new doctor 
	managementFactory.addDoctor = function(doctorData) { 
		return $http.post('/api/doctors/', doctorData); 
	};

	// delete a doctor
	managementFactory.deleteDoc = function(id) { 
		return $http.delete('/api/doctors/' + id); 
	};

	// update a doctor 
	managementFactory.editDoc = function(id, Data) {
		return $http.put('/api/doctors/' + id, Data); 
	};


	// get all visits
	managementFactory.allVisits = function() { 
		return $http.get('/api/visits/');
	};

	// add new visit 
	managementFactory.addVisit = function(visitData) { 
		return $http.post('/api/visits/', visitData); 
	}; 

	// delete a visit
	managementFactory.deleteVis = function(id) { 
		return $http.delete('/api/visits/' + id); 
	};

	// update a visit 
	managementFactory.editVis = function(id, Data) {
		return $http.put('/api/visits/' + id, Data); 
	};


	// return our entire userFactory object
	return managementFactory;

});