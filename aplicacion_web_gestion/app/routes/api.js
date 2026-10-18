var bodyParser = require('body-parser');  // get body-parser
var jwt        = require('jsonwebtoken'); // para trabajar el token
var fs         = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function(app, express) {

  var apiRouter = express.Router();


  // on routes that end in /patients 
  // ---------------------------------------------------- 
  apiRouter.route('/patients') 

  // GET Patients 
  .get(function(req, res) { 

    req.getConnection(function(err,conn){ 

      if (err) return next("Cannot Connect"); 

      //Obtener datos de pacientes 
      var query = conn.query('SELECT * FROM tbpacientes',function(err,patients){ 

        if(err){ 
          console.log(err); 
          return next("Mysql error, check your query"); 
        } 
        res.json(patients); 
      }); 

    }); 
  })

  // POST Patients
  .post(function(req, res) { 

    req.getConnection(function (err, conn){ 

      if (err) return next("Cannot Connect"); 

      // Guardamos los datos del nuevo paciente 
      var query = conn.query("INSERT INTO tbpacientes set ?", req.body, function(err, newPatient){ 

        if(err){ 
          console.log(err); 
          return next("Mysql error, check your query"); 
        } 

        var query = conn.query('SELECT * FROM tbpacientes', function(err, patients){ 

          if(err){
            console.log(err); 
            return next("Mysql error, check your query"); 
          } 
 
          res.json(patients); 
 
        }); 
      }); 
    }); 
  });


  // on routes that end in /patients 
  // ---------------------------------------------------- 
  apiRouter.route('/patients/:patientId')

  // DELETE Patients
  .delete(function(req, res) { 

    var patientId = req.params.patientId; 
    
    req.getConnection(function(err,conn){ 

      if (err) return next("Cannot Connect"); 
      var query = conn.query("DELETE FROM tbpacientes  WHERE PAC_ID = ?",patientId, function(err,patientDeleted) { 

        if(err){
          // Si el error es por registros asociados (FK Constraint)
          if (err.errno === 1451) {
            return res.status(409).json({ message: "Asociado" });
          }
          console.log(err); 
          return next("Mysql error, check your query");
        } 
 
        var query = conn.query("SELECT * FROM tbpacientes",function(err,patientList){ 
 
          if(err){ 
            console.log(err); 
            return next("Mysql error, check your query"); 
          } 
                 
          res.json(patientList); 

        }); 
      }); 
    }); 
  })

  // UPDATE Patients
  .put(function(req, res) {

    var patientId = req.params.patientId; 

    req.getConnection(function (err, conn){ 

      if (err) return next("Cannot Connect"); 
      var query = conn.query("UPDATE tbpacientes set ? WHERE PAC_ID = ?",[req.body,patientId], function(err, rows){ 

        if(err){
          console.log(err);
          return next("Mysql error, check your query"); 
        } 

        var query = conn.query("SELECT * FROM tbpacientes", function(err, patientsList){ 

          if(err){ 
            console.log(err); 
            return next("Mysql error, check your query"); 
          } 
          res.json(patientsList); 
        }); 
      }); 
    }); 
  }); 



  // on routes that end in /doctors 
  // ---------------------------------------------------- 
  apiRouter.route('/doctors') 

  // GET Doctors 
  .get(function(req, res) { 

    req.getConnection(function(err,conn){ 

      if (err) return next("Cannot Connect"); 

      //Obtener datos de pacientes 
      var query = conn.query('SELECT * FROM tbmedicos',function(err,doctors){ 

        if(err){ 
          console.log(err); 
          return next("Mysql error, check your query"); 
        } 
        res.json(doctors); 
      }); 

    }); 
  })

  // POST Doctors
  .post(function(req, res) { 

    req.getConnection(function (err, conn){ 

      if (err) return next("Cannot Connect"); 

      // Guardamos los datos del nuevo médico
      var query = conn.query("INSERT INTO tbmedicos set ?", req.body, function(err, newDoctor){ 

        if(err){ 
          console.log(err); 
          return next("Mysql error, check your query"); 
        } 

        var query = conn.query('SELECT * FROM tbmedicos', function(err, doctors){ 

          if(err){
            console.log(err); 
            return next("Mysql error, check your query"); 
          } 
 
          res.json(doctors); 
 
        }); 
      }); 
    }); 
  });



  // on routes that end in /doctors
  // ---------------------------------------------------- 
  apiRouter.route('/doctors/:doctorId')

  // DELETE Doctors
  .delete(function(req, res) { 

    var doctorId = req.params.doctorId; 
    
    req.getConnection(function(err,conn){ 

      if (err) return next("Cannot Connect"); 
      var query = conn.query("DELETE FROM tbmedicos  WHERE MED_ID = ?",doctorId, function(err,doctorDeleted) { 

        if(err){
           // Si el error es por registros asociados (FK Constraint)
          if (err.errno === 1451) {
            return res.status(409).json({ message: "Asociado" });
          }
          console.log(err); 
          return next("Mysql error, check your query");
        } 
 
        var query = conn.query("SELECT * FROM tbmedicos",function(err,doctorList){ 
 
          if(err){ 
            console.log(err); 
            return next("Mysql error, check your query"); 
          } 
                 
          res.json(doctorList); 

        }); 
      }); 
    }); 
  })

   // UPDATE Doctors
  .put(function(req, res) {

    var doctorId = req.params.doctorId; 

    req.getConnection(function (err, conn){ 

      if (err) return next("Cannot Connect"); 
      var query = conn.query("UPDATE tbmedicos set ? WHERE MED_ID = ?",[req.body,doctorId], function(err, rows){ 

        if(err){
          console.log(err);
          return next("Mysql error, check your query"); 
        } 

        var query = conn.query("SELECT * FROM tbmedicos", function(err, doctorsList){ 

          if(err){ 
            console.log(err); 
            return next("Mysql error, check your query"); 
          } 
          res.json(doctorsList); 
        }); 
      }); 
    }); 
  }); 



  // on routes that end in /visits 
  // ---------------------------------------------------- 
  apiRouter.route('/visits') 

  // GET Visits 
  .get(function(req, res) { 

    req.getConnection(function(err,conn){ 

      if (err) return next("Cannot Connect"); 

      //Obtener datos de visitas 
      var query = conn.query(
        'SELECT v.*, p.NOMBRE, m.MED_NOMBRE ' +
        'FROM tbvisitas v ' +
        'JOIN tbpacientes p ON v.PAC_ID = p.PAC_ID ' +
        'JOIN tbmedicos m ON v.MED_ID = m.MED_ID',function(err,visits){ 

        if(err){ 
          console.log(err); 
          return next("Mysql error, check your query"); 
        } 
        res.json(visits); 
      }); 
    }); 
  })

  // POST Visits
  .post(function(req, res) { 

    req.getConnection(function (err, conn){ 

      if (err) return next("Cannot Connect"); 

      // Guardamos los datos de la nueva visita
      var query = conn.query("INSERT INTO tbvisitas set ?", req.body, function(err, newVisit){ 

        if(err){ 
          console.log(err); 
          return next("Mysql error, check your query"); 
        } 

        var query = conn.query(
          'SELECT v.*, p.NOMBRE, m.MED_NOMBRE ' +
          'FROM tbvisitas v ' +
          'JOIN tbpacientes p ON v.PAC_ID = p.PAC_ID ' +
          'JOIN tbmedicos m ON v.MED_ID = m.MED_ID', function(err, visits){ 

          if(err){
            console.log(err); 
            return next("Mysql error, check your query"); 
          } 
 
          res.json(visits); 
 
        }); 
      }); 
    }); 
  });

  // on routes that end in /visits
  // ---------------------------------------------------- 
  apiRouter.route('/visits/:visitId')

  // DELETE Visits
  .delete(function(req, res) { 

    var visitId = req.params.visitId; 
    
    req.getConnection(function(err,conn){ 

      if (err) return next("Cannot Connect"); 
      var query = conn.query("DELETE FROM tbvisitas  WHERE VISITA_ID = ?",visitId, function(err,visitDeleted) { 

        if(err){ 
          console.log(err); 
          return next("Mysql error, check your query");
        } 
 
        var query = conn.query(
          'SELECT v.*, p.NOMBRE, m.MED_NOMBRE ' +
          'FROM tbvisitas v ' +
          'JOIN tbpacientes p ON v.PAC_ID = p.PAC_ID ' +
          'JOIN tbmedicos m ON v.MED_ID = m.MED_ID', function(err,visitList){ 
 
          if(err){ 
            console.log(err); 
            return next("Mysql error, check your query"); 
          } 
                 
          res.json(visitList); 

        }); 
      }); 
    }); 
  })

  // UPDATE Visits
  .put(function(req, res) {

    var visitId = req.params.visitId; 

    req.getConnection(function (err, conn){ 

      if (err) return next("Cannot Connect"); 
      var query = conn.query("UPDATE tbvisitas set ? WHERE VISITA_ID = ?",[req.body,visitId], function(err, rows){ 

        if(err){
          console.log(err);
          return next("Mysql error, check your query"); 
        } 

        var query = conn.query(
          'SELECT v.*, p.NOMBRE, m.MED_NOMBRE ' +
          'FROM tbvisitas v ' +
          'JOIN tbpacientes p ON v.PAC_ID = p.PAC_ID ' +
          'JOIN tbmedicos m ON v.MED_ID = m.MED_ID', function(err, visitsList){ 

          if(err){ 
            console.log(err); 
            return next("Mysql error, check your query"); 
          } 
          res.json(visitsList); 
        }); 
      }); 
    }); 
  }); 

	  return apiRouter;
  
};
