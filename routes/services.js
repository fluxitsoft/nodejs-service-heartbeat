var fs = require('fs');
var http = require('http');
var https = require('https');
var request = require("request");
var check = require("../lib/service-check");

var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db2;

var conn = new MongoClient(new Server('localhost', 27017));

conn.open(function(err, mongoClient) {
	db2 = mongoClient.db("services-status");
	console.log(checkers);
	console.log('conectado');
});




/* Chequea un servicio web, corresponde a una pagina web vía http normal */ 
var checkWeb = function(service, ok, error){
		check.checkWeb(service,ok, error);
}

/* chequea un servicio en base al API publica de jenkins */
var checkHudsonProject = function(service, ok, error){
	check.checkHudson(service,ok, error);
}

/* chequea un servicio en base al API publica de jenkins */
var checkPing = function(service, ok, error){
	check.checkPing(service, ok, error);
}

/* chequea un servicio via telnet */
var checkTelnet = function(service, ok, error){
	check.checkTelnet(service, ok, error);
}


/* DEFAULT OK CALLBACK FUNCTION
 * Funcion que actualiza el estado del servicio si el check fue ok 
 * */
function okService(service, status){
	console.log('OK ['+service.url + '] TYPE['+service.type + '] TIME['+status.time+ '] STATUS['+status.status+ ']')
	service.status = status;
	updateService(service);
}

/* 
 * DEFAULT ERROR CALLBACK FUNCTION
 * Funcion que actualiza el estado del servicio si el check fue ok 
 * */
function errorService(service, errorMessage){
	console.log('ERROR ['+service.url + '] TYPE['+service.type + '] ERROR ['+errorMessage+ ']')
	service.status.status = "ERROR";
	service.status.time = 0;
	service.status.message= errorMessage;
	updateService(service);	
	
}



/* 
 * Mapa que contiene todos los cheequeadores por tipo que es la propiedad 'type' 
 * del objeto service que se guarda en el mongo 
 * */
var checkers=[];
	checkers['web'] = checkWeb;
	checkers['hudson'] = checkHudsonProject;
	checkers['ping'] = checkPing;
	checkers['telnet'] = checkTelnet;



/* 
* CORE FUNCTION
* Take a service and find the appropiated checket to use based on the type of the service
* ok is a callback function, optional. If not passed the deafult is used (store into mongo)
* error, is a callback function, optional. if not passed then default is used
* */
function checkService(service, ok, error){
	
	if (ok){okCb = ok;} else {okCb = okService};
	if (error) errorCb = error; else errorCb = errorService
	checkers[service.type](service, okCb, errorCb);	
}

exports.check = checkService;
	



/* Update service in persistent store */
function updateService(service){
	db2.collection('services', function(err, coll) {
		coll.update({_id:service._id}, service, function(err, doc){});
	})
	
}

/* Iterador que recupera todos los servicios y llama a la función checkService que determina como se chequea cada uno */
exports.checkServices = function() {
	db2.collection('services', function(err, coll) {
  		coll.find().toArray(function(err, items) {
                	items.forEach( function(service, index){
                			checkService(service);
                	}); 
            	});
	})

};

