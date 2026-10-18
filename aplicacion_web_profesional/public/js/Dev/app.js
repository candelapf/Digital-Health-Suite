var MyApp = angular.module('LabApp', ['ui.bootstrap','doctorService', 'ngdicomviewer']) 

MyApp.controller('mainController', function($scope,Doctor, $timeout) {

    // VARIABLES
    $scope.patientData=0; 
    $scope.doctorList = { 
    Doctors: [] 
    };
    $scope.showImage=0;
    $scope.urlData; 
    $scope.imageData=0;
    $scope.loading = false; // Mejora: mensaje de carga

    // FUNCIONES
    Doctor.allDoctors() 
    .success(function(data) {
        $scope.doctors=data; 
        for(i=0;i<$scope.doctors.length;i++){
            var dataDoc={
                name:$scope.doctors[i].MED_NOMBRE, 
                id:$scope.doctors[i].MED_ID 
            } 
            $scope.doctorList.Doctors.push(dataDoc); 
        } 
    });

    $scope.doctorVisits=function(id){
        $scope.loading = true; // Activa el mensaje de carga (Mejora)
        Doctor.associatedPatients(id) 
        .success(function(data) { 
            $scope.visits=data;
            $scope.loading = false; // Desactiva al recibir los datos
        })
        .error(function() { $scope.loading = false; }); // Desactiva también en caso de error
    }

    $scope.selectedPatient=function(id){
        $scope.loading = true; // Activa mensaje carga (Mejora)
        $scope.patientData=1; 
        Doctor.selectedPatient(id) 
        .success(function(data) {
            $scope.patient=data.personalData[0]; 
            $scope.studieData=data.studies[0]; 
            $scope.seriesData=data.series;
            $scope.loading = false;
        })
        .error(function() { $scope.loading = false; });
    }
    
    $scope.comeBack=function(){ 
        $scope.patientData=0; 
        $scope.showImage=0; 
    }

    $scope.selectImage=function(id){ 
        $scope.urlData='http://localhost:8080/images/'+id; 
        $scope.showImage=1; 
    }

    $scope.closeImage = function() {
        // Cambia el estado para el feedback visual en el botón
        $scope.isClosing = true;
        $timeout(function() {
            $scope.showImage = 0; // Oculta el visor
            $scope.imageData = 0; // Oculta la tabla de metadatos
            $scope.isClosing = false; // Resetea el estado para la próxima vez
        }, 500); 
    };

    $scope.showTable=function(){ 
        $scope.imageData=1;
    }


});
