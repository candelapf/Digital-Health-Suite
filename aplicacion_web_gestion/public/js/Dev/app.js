// name our angular app
var MyApp = angular.module('LabApp', ['ui.bootstrap','managementService'])

MyApp.controller('mainController', function($scope, Management) {

//VARIABLES
    // Pacientes
    $scope.newPatient=0;
    $scope.PatientData={ 
        patientName:"", 
        patientBirthdate:"", 
        patientAddress:"", 
        patientPhone:"" 
    }
    $scope.editPatId;
    $scope.editing=0;

    // Médicos
    $scope.newDoctor=0;
    $scope.DoctorData={ 
        doctorName:"", 
        doctorBirthdate:"", 
        doctorAddress:"", 
        doctorPhone:"" 
    }
    $scope.editDocId;
    $scope.editing=0;

    // Visitas
    $scope.newVisit=0;
    $scope.VisitData={
        patientName:"", 
        doctorName:"", 
        visitDiagnosis:"", 
        visitDate:"" 
    } 
    $scope.patientList = {
        Patients: [] 
    }; 
    $scope.doctorList = { 
        Doctors: [] 
    };
    $scope.editVisId;
    $scope.editing=0;


//FUNCIONES
    // PACIENTES

    // Da al botón Añadir paciente
    $scope.addNewPatient=function(){
        $scope.newPatient=1;
        $scope.editing = 0; 
    }

    // Da al botón Crear
    $scope.createNewPatient=function(){
        var telStr = $scope.PatientData.patientPhone ? $scope.PatientData.patientPhone.toString() : "";
     
        if($scope.PatientData.patientName && $scope.PatientData.patientBirthdate && $scope.PatientData.patientAddress){

            // Campo teléfono 9 dígitos
            if (!/^\d{9}$/.test(telStr)) {
            alert("El teléfono debe tener exactamente 9 dígitos.");
            return;
            }
            $scope.newPatient=0; 

            var date=new Date($scope.PatientData.patientBirthdate); 
            date.setHours(date.getHours()+1); 

            var newPatientData={ 
                NOMBRE:$scope.PatientData.patientName, 
                FECHA_NAC:date, 
                DIRECCION:$scope.PatientData.patientAddress, 
                TELEFONO:$scope.PatientData.patientPhone 
            }            
            Management.addPatient(newPatientData) 
                .success(function(data) { 
                    $scope.patients=data;
                    alert("Paciente creado con éxito");
                    $scope.PatientData={ 
                        patientName:"", 
                        patientBirthdate:"", 
                        patientAddress:"", 
                        patientPhone:"" 
                    };
                });
            
        } else{ 
            alert("Para guardar un nuevo usuario debes rellenar todos los campos"); 
        } 
    }

    // Da al botón Cancelar (operación Crear)
    $scope.cancelNewPatient=function(){ 
        $scope.newPatient=0; 
        $scope.PatientData={ 
        patientName:"", 
        patientBirthdate:"", 
        patientAddress:"", 
        patientPhone:"" 
        } 
    }

    // Da al botón Eliminar
    $scope.deletePatient=function(id){
        var respuesta = confirm("¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer.");
        console.log(id)
        if (respuesta) {
             Management.deletePat(id) 
            .success(function(data) { 
                $scope.patients=data;
                alert("Paciente eliminado con éxito");
            })
            .error(function(data, status) {
                if (status === 409) {
                    alert("No se puede borrar este registro porque tiene visitas asociadas.");
                } else {
                    alert("Error al intentar borrar el registro.");
                }
            });
        }
       
    }

    // Da al botón Editar (aparecen datos previamente escritos)
    $scope.selectedPatient=function(patient){ 
        var date=new Date(patient.FECHA_NAC);  
        $scope.PatientData.patientName=patient.NOMBRE; 
        $scope.PatientData.patientBirthdate=date; 
        $scope.PatientData.patientAddress=patient.DIRECCION; 
        $scope.PatientData.patientPhone=parseInt(patient.TELEFONO); 
        $scope.editPatId=patient.PAC_ID; 
        $scope.editing=1; 
        $scope.newPatient=1; 
    }

    // Hacer uso de la llamada UPDATE del servicio una vez pulsado botón editar
    $scope.editPatient=function(){ 
        // Editar campo teléfono 9 dígitos
        var telStr = $scope.PatientData.patientPhone ? $scope.PatientData.patientPhone.toString() : "";

        if (!/^\d{9}$/.test(telStr)) {
            alert("El teléfono debe tener exactamente 9 dígitos.");
            return;
        }
 
        var updatePatientData={ 
            NOMBRE:$scope.PatientData.patientName, 
            FECHA_NAC:$scope.PatientData.patientBirthdate, 
            DIRECCION:$scope.PatientData.patientAddress, 
            TELEFONO:$scope.PatientData.patientPhone 
        } 
 
        Management.editPat($scope.editPatId,updatePatientData) 
        .success(function(data) { 
            $scope.patients=data; 
            $scope.editing=0; 
            $scope.newPatient=0;
            alert("Datos del paciente actualizados correctamente");
            $scope.PatientData = {         
                patientName: "",
                patientBirthdate: "",
                patientAddress: "",
                patientPhone: ""
            };
        }); 
    } 


    // MÉDICOS
     $scope.addNewDoctor=function(){
        $scope.newDoctor=1;
        $scope.editing = 0;
    }

    $scope.createNewDoctor=function(){ 

        if($scope.DoctorData.doctorName.length>0&&$scope.DoctorData.doctorService.length>0){ 
            $scope.newDoctor=0;  

            var newDoctorData={ 
                MED_NOMBRE:$scope.DoctorData.doctorName, 
                SERVICIO: $scope.DoctorData.doctorService
            }            
            Management.addDoctor(newDoctorData) 
                .success(function(data) { 
                $scope.doctors=data;
                alert("Médico añadido al sistema");
                $scope.DoctorData={ 
                    doctorName:"", 
                    doctorService:""
                } 
            }); 

        } else{ 
            alert("Para guardar un nuevo usuario debes rellenar todos los campos"); 
        } 
    }

    $scope.cancelNewDoctor=function(){ 
        $scope.newDoctor=0; 
        $scope.DoctorData={ 
        doctorName:"", 
        doctorService:"" 
        } 
    }

    $scope.deleteDoctor=function(id){
        var respuesta = confirm("¿Estás seguro de que deseas eliminar este médico? Esta acción no se puede deshacer.");
        console.log(id)
        if(respuesta) {
            Management.deleteDoc(id) 
            .success(function(data) { 
                $scope.doctors=data;
                alert("Médico eliminado con éxito");
            })
            .error(function(data, status) {
                if (status === 409) {
                    alert("No se puede borrar este registro porque tiene visitas asociadas.");
                } else {
                    alert("Error al intentar borrar el registro.");
                }
            });
        }        
    }

     // Da al botón Editar (aparecen datos previamente escritos)
    $scope.selectedDoctor=function(doctor){   
        $scope.DoctorData.doctorName=doctor.MED_NOMBRE; 
        $scope.DoctorData.doctorService=doctor.SERVICIO; 
        $scope.editDocId=doctor.MED_ID; 
        $scope.editing=1; 
        $scope.newDoctor=1; 
    }

    // Hacer uso de la llamada UPDATE del servicio una vez pulsado botón editar
    $scope.editDoctor=function(){ 
 
      var updateDoctorData={ 
        MED_NOMBRE:$scope.DoctorData.doctorName, 
        SERVICIO:$scope.DoctorData.doctorService
      } 
 
        Management.editDoc($scope.editDocId,updateDoctorData) 
        .success(function(data) { 
          $scope.doctors=data; 
          $scope.editing=0; 
          $scope.newDoctor=0;
          alert("Información del médico actualizada");
          $scope.DoctorData={ 
                doctorName:"", 
                doctorService:""
            } 
      }); 
    } 



    // VISITAS
    $scope.addNewVisit=function(){
        $scope.newVisit=1;
        $scope.editing = 0;
        $scope.VisitData.selectedService = ""; // Limpiamos el servicio previamente seleccionado

        Management.allPatients()   // Mostrar pestaña con los pacientes y los médicos que puedes incluir en la visita
        .success(function(data) {
            for(i=0;i<data.length;i++){ 
                var dataPat={ 
                    name:data[i].NOMBRE, 
                    id:data[i].PAC_ID 
                } 
                $scope.patientList.Patients.push(dataPat) 
            } 
        });

        Management.allDoctors() 
        .success(function(data) {
            for(i=0;i<data.length;i++){ 
                var dataDoc={ 
                    name:data[i].MED_NOMBRE, 
                    id:data[i].MED_ID,
                    service: data[i].SERVICIO // Filtro por servicio funcione al crear una visita (MEJORA)
                } 
                $scope.doctorList.Doctors.push(dataDoc) 
            } 
        });
    }


    $scope.createNewVisit=function(){ 

        if($scope.VisitData.patientName && $scope.VisitData.doctorName && $scope.VisitData.visitDiagnosis.length > 0 && $scope.VisitData.visitDate){ 
            $scope.newVisit=0;

            var date=new Date($scope.VisitData.visitDate); 
            date.setHours(date.getHours()+1); 

            var newVisitData={
                PAC_ID:$scope.VisitData.patientName.id,
                MED_ID:$scope.VisitData.doctorName.id, 
                DIAGNOSTICO:$scope.VisitData.visitDiagnosis, 
                FECHA_VIS: date
            }            
            Management.addVisit(newVisitData) 
                .success(function(data) { 
                $scope.visits=data;
                alert("Nueva visita registrada correctamente");
                $scope.VisitData={ 
                    patientName:"", 
                    doctorName:"", 
                    visitDiagnosis:"", 
                    visitDate:"" 
                }
            }); 

             $scope.patientList = { 
                Patients: [] 
            };
            $scope.doctorList = {
                Doctors: [] 
            }; 
        } else{ 
            alert("Para guardar un nuevo usuario debes rellenar todos los campos"); 
        } 
    }

    $scope.cancelNewVisit=function(){ 
        $scope.newVisit=0; 
        $scope.VisitData={
            patientName:"", 
            doctorName:"", 
            visitDiagnosis:"", 
            visitDate:"" 
        } 
        $scope.patientList = { 
            Patients: [] 
        };
        $scope.doctorList = {
            Doctors: [] 
        }; 
    } 

    $scope.deleteVisit=function(id){
        var respuesta = confirm("¿Estás seguro de que deseas eliminar esta visita médica? Esta acción no se puede deshacer.");
        console.log(id)
        if(respuesta) {
            Management.deleteVis(id) 
            .success(function(data) { 
                $scope.visits=data;
                alert("Visita eliminada con éxito");
            });
        }
    }

    // Da al botón Editar (aparecen datos previamente escritos)
    $scope.selectedVisit=function(visit){
        // Cargar los datos
        $scope.VisitData.visitDiagnosis=visit.DIAGNOSTICO; 
        $scope.VisitData.visitDate= new Date(visit.FECHA_VIS); 
        $scope.editVisId=visit.VISITA_ID;
        
        //Limpiar las listas
        $scope.patientList.Patients = [];
        $scope.doctorList.Doctors = [];

        // Cargar listado de pacientes (desplegable)
        for(i=0;i<$scope.patients.length;i++){
            var dataPat={
                name:$scope.patients[i].NOMBRE,
                id:$scope.patients[i].PAC_ID 
            }
            $scope.patientList.Patients.push(dataPat)  
        }
        // Cargar listado de médicos (desplegable)
        for(i=0;i<$scope.doctors.length;i++){ 
            var dataDoc={
                name:$scope.doctors[i].MED_NOMBRE, 
                id:$scope.doctors[i].MED_ID,
                service: $scope.doctors[i].SERVICIO // Desplegable servicio (MEJORA: filtro de médicos por servicio)
            }
            $scope.doctorList.Doctors.push(dataDoc) 
        }
        // Valor previo en la tabla aparezca preseleccionado (línea subrayada azul en desplegable)
        for(i=0;i<$scope.patientList.Patients.length;i++){
            if($scope.patientList.Patients[i].id==visit.PAC_ID){ 
                $scope.VisitData.patientName=$scope.patientList.Patients[i];  
            } 
        } 
        for(i=0;i<$scope.doctorList.Doctors.length;i++){ 
            if($scope.doctorList.Doctors[i].id==visit.MED_ID){ 
                $scope.VisitData.doctorName=$scope.doctorList.Doctors[i];
                $scope.VisitData.selectedService = $scope.doctorList.Doctors[i].service; // (MEJORA: filtro médicos servicio)
            } 
        } 
      
        $scope.editing=1; 
        $scope.newVisit=1; 
    }

    // Hacer uso de la llamada UPDATE del servicio una vez pulsado botón editar
    $scope.editVisit=function(){ 
 
        var updateVisitData={ 
        DIAGNOSTICO:$scope.VisitData.visitDiagnosis, 
        FECHA_VIS:$scope.VisitData.visitDate,
        PAC_ID: $scope.VisitData.patientName.id,
        MED_ID: $scope.VisitData.doctorName.id
        }
 
        Management.editVis($scope.editVisId,updateVisitData) 
        .success(function(data) {
            $scope.visits=data; 
            $scope.editing=0; 
            $scope.newVisit=0;
            alert("La visita ha sido modificada con éxito");
            $scope.VisitData={ 
                patientName:"", 
                doctorName:"", 
                visitDiagnosis:"", 
                visitDate:"" 
            }
            $scope.patientList = { 
            Patients: [] 
            }; 
            $scope.doctorList = { 
            Doctors: [] 
            };
        });
    }

    // Función para obtener los servicios existentes de la lista de médicos (MEJORA filtro de médicos por servicio)
    $scope.getUniqueServices = function() {
        var uniqueServices = [];
        // Usamos la lista de médicos de la BBDD 
        angular.forEach($scope.doctors, function(doctor) {
            // Si el servicio no está ya en nuestra lista temporal, lo añadimos
            if (doctor.SERVICIO && uniqueServices.indexOf(doctor.SERVICIO) === -1) {
                uniqueServices.push(doctor.SERVICIO);
            }
        });
        return uniqueServices;
    };



// Llamada para obtener pacientes (Entradas que utilizan el servicio y la api)
    Management.allPatients() 
      .success(function(data) {
//      alert(JSON.stringify(data));
        $scope.patients=data;
    });

// Llamada para obtener médicos
    Management.allDoctors()
    .success(function(data) {
        $scope.doctors = data; // Esta variable 'doctors' es la que usa el ng-repeat
    });

// Llamada para obtener visitas
    Management.allVisits()
    .success(function(data) {
        $scope.visits = data;
    });

});
