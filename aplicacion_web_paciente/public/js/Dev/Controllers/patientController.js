// users page specific controller
MyApp.controller('patientController', function($scope,$window, $http, $location,Patient, $timeout) {

    // VARIABLES
    $scope.addWeight=0; 
    $scope.showGraph=1;
    $scope.PatientID=$window.localStorage.getItem('PatientID'); 
    // Definir el objeto de datos 
    $scope.WeightData = {
        peso: "",
        fecha: ""
    };
    // Paginación
    $scope.currentPage = 0;
    $scope.pageSize = 10; // Número de registros por "diapositiva"
    $scope.Math = window.Math; // cálculos en el html


    //FUNCIONES
    $scope.loadWeights = function() {
        Patient.Weights($scope.PatientID).success(function(data) {
            // Ordenamos el array 'data' antes de procesarlo para la tabla y la gráfica
            data.sort(function(a, b) {
                return new Date(a.FECHA) - new Date(b.FECHA);  // Convertimos las fechas a objetos Date para compararlas
            });

            $scope.weightsList = data;
            $scope.allData = data; // Guardamos todos para paginar
            $scope.myChartObject = {};
            $scope.myChartObject.type = "ColumnChart";
            
            $scope.updateChart(); // Llamamos a la función que dibuja la página actual
        });
    };

    // FUNCIÓN PARA ACTUALIZAR LA DIAPOSITIVA DEL GRÁFICO
    $scope.updateChart = function() {
        $scope.myChartObject = { type: "ColumnChart" };
        
        // Calculamos qué trozo del array mostrar
        var start = $scope.currentPage * $scope.pageSize;
        var end = start + $scope.pageSize;
        var pagedData = $scope.allData.slice(start, end);

        var chartRows = [];
        for (var i = 0; i < pagedData.length; i++) {
            chartRows.push({
                c: [{ v: pagedData[i].FECHA_ALTER }, { v: pagedData[i].PESO }]
            });
        }

        $scope.myChartObject.data = {
            "cols": [
                { id: "t", label: "Día", type: "string" },
                { id: "s", label: "Peso", type: "number" }
            ],
            "rows": chartRows
        };

        $scope.myChartObject.options = {
            'title': 'Histórico de Pesos (Pág. ' + ($scope.currentPage + 1) + ')',
            'titleTextStyle': { 'color': '#2c3e50', 'fontSize': 24, 'bold': true },
            'legend': { 'position': 'top', 'alignment': 'center' },
            'chartArea': { 'width': '80%', 'height': '50%', 'top': 100, 'bottom': 80 },
            'series': { 0: { 'color': '#34495e' } },
            'animation': { 'duration': 500, 'easing': 'out', 'startup': true } // Efecto visual al cambiar
        };
    };

    // FUNCIONES PARA LAS FLECHAS 
    $scope.nextPage = function() {
        if (($scope.currentPage + 1) * $scope.pageSize < $scope.allData.length) {
            $scope.currentPage++;
            $scope.updateChart();
        }
    };

    $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            $scope.updateChart();
        }
    };

    // Carga inicial
    $scope.loadWeights();

    // Funciones de navegación
    $scope.logout=function(){
        if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            $window.localStorage.removeItem('PatientID'); 
            $location.path('/');
        }
    };

    // Mostrar el formulario (botón Añadir)
    $scope.showForm = function() {
         $scope.addWeight = 1; 
    };

    $scope.cancelNewWeight = function() {
        $scope.addWeight = 0;
        $scope.WeightData = { peso: "", fecha: "" };
    };

    
    // Crear registro actualizado
    $scope.createNewWeight = function() {
        if ($scope.WeightData.peso && $scope.WeightData.fecha) {
            var date = new Date($scope.WeightData.fecha);
            date.setHours(date.getHours() + 2);

            var newWeightData = {
                PAC_ID: $scope.PatientID,
                PESO: $scope.WeightData.peso,
                FECHA: date
            };

            Patient.addWeight(newWeightData).success(function(data) {
                $scope.successMsg = "El registro de peso se ha creado correctamente.";
                $scope.addWeight = 0;
                $scope.showGraph = 0;
                
                // Recargamos datos sin refrescar página
                $scope.loadWeights(); 
                
                $timeout(function() { $scope.successMsg = null; }, 3000);
            });
            $scope.WeightData = { peso: "", fecha: "" };
        } else {
            alert("Para guardar un nuevo peso debes rellenar todos los campos");
        }
    };


    // Función para conmutar entre vista de Gráfico (1) y Listado (0)
    $scope.changeView = function(view) {
        $scope.showGraph = view;
    };

    // Borrar registro actualizado
    $scope.deleteWeight = function(weightID, patientID) {
        if (confirm("¿Estás seguro de que deseas eliminar este registro de peso?")) {
            Patient.deleteWeight(weightID, patientID).success(function(data) {
                $scope.successMsg = "El registro de peso se ha eliminado correctamente.";
                $scope.showGraph = 0;
                
                // Recargamos datos sin refrescar página
                $scope.loadWeights(); 
                
                $timeout(function() { $scope.successMsg = null; }, 3000);
            });
        }
    };


    // Función para cargar visitas 
    $scope.getVisits = function() {
        Patient.associatedVisits($scope.PatientID).success(function(data) {
            $scope.visitsList = data;
        }).error(function(err) {
            console.log("Error al obtener visitas: ", err);
        });
    };
    $scope.getVisits();


});
