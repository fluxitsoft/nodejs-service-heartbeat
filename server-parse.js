//https://github.com/Leveton/node-parse-api

var Parse = require('node-parse-api').Parse;
var APP_ID = 'aXtNkiQbTrJibzaEoc3EO74qkJFRAKH87ZcIhZYY';
var MASTER_KEY = 'lLfMipl1pS243O163yhp2EVM6fNHohwjAVeKKXvs';

var app = new Parse(APP_ID, MASTER_KEY);


//
//populateDB();

	app.findMany('Service', { }, function (err, response) {
		response.results.forEach(function(service, index){
			console.log(service);
		});

		});

	




/* llena la base de datos con servicios de ejemplo */
function populateDB() {
    console.log("Llenando base de servicios ");
    var services = [
        {"name": "Sitio Web de Fluxit", "type": "web", "url": "www.fluxit.com.ar", "status": {"status":"ok", "time": 0, "message": ""}} ,
        {"name": "RunRun", "type": "web", "url": "runrun.fluxit.com.ar", "status": {"status":"ok", "time": 0, "message": ""}},
        {"name": "Hadoop-trunk-Commit", "type": "hudson", "url": "Hadoop-trunk-Commit", "status": {"status":"ok", "time": 0, "message":""}} 
	];

/*
	app.findMany('Service', { }, function (err, response) {
		response.results.forEach(function(service, index){
			app.delete('Service', service.objectId, function(err, response){});
		});

		});

*/
	
	services.forEach( function(service, index){
			app.insert('Service',service , function (err, response) {
			  console.log(response);
			});			
		}); 
	
};
