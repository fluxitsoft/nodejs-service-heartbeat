var fs = require('fs');
var http = require('http');
var https = require('https');
var request = require("request");
var check = require("./service-check");

var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db2;

var conn = new MongoClient(new Server('localhost', 27017));


/* Chequea un servicio web, corresponde a una pagina web vía http normal */ 
var checkWeb = function(service, coll){
		check.checkWeb(service,okService, errorService);
}

/* chequea un servicio en base al API publica de jenkins */
var checkHudsonProject = function(service, coll){
	check.checkHudson(service,okService, errorService);
}

/* Funcion que actualiza el estado del servicio si el check fue ok */
function okService(service, status){
	console.log('OK ['+service.url + '] TYPE['+service.type + '] TIME['+status.time+ '] STATUS['+status.status+ ']')
	service.status = status;
	updateService(service);
}

/* Funcion que actualiza el estado del servicio si el check fue ok */
function errorService(service, errorMessage){
	console.log('ERROR ['+service.url + '] TYPE['+service.type + '] ERROR ['+errorMessage+ ']')
	service.status.status = "error";
	service.status.time = 0;
	service.status.message= errorMessage;
	updateService(service);	
	
}



/* Mapa que contiene todos los cheequeadores por tipo que es la propiedad 'type' del objeto service que se guarda en el mongo */
var checkers=[];
	checkers['web'] = checkWeb;
	checkers['hudson'] = checkHudsonProject;


console.log('conectando ....');

/* 
Se conecta con la DB y chequea si existe la base de datos
inicializa todas las variables de conexión con mongo
*/
conn.open(function(err, mongoClient) {
	
	db2 = mongoClient.db("services-status");
	console.log(checkers);
	console.log('conectado');
    	//elimino todo
    	//db2.collection('services', function(err, collection){   collection.remove({},function(err, removed){console.log(removed);});   });
	//Lleno todoo
    	//populateDB();
	/*
		  db2.collection('services', {strict:true}, function(err, collection) {
			if (err) {
			    console.log("La base de datos de servicios esta vacia");
			    populateDB();
			}
		    });

		*/	
	
});



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
                			status = checkService(service, coll);
                	}); 
            	});
	})

};

/* Determina como se chequea cada servicio y llama a la funcion correspondiente */
function checkService(service, coll){
	checkers[service.type](service,coll);	
}


/* REST API to read the service definitions*/
exports.findAll = function(req, res) {
    var name = req.query["name"];
    db2.collection('services', function(err, collection) {
        if (name) {
            collection.find({"name": new RegExp(name, "i")}).toArray(function(err, items) {
                res.jsonp(items);
            });
        } else {
            collection.find().toArray(function(err, items) {
                res.jsonp(items);
            });
        }
    });
};


/* REST API to check the status of the services */
exports.status= function(req, res) {
	console.log("consultando status")
	db2.collection('services', function(err, collection) {
		console.log("collection "+collection)
    	collection.find().toArray(function(err, items) {
    		console.log("items "+items)
    		statuses = [];
    		items.forEach( function(service, index){
    			  status = {"name":service.name,"type": service.type, "status":service.status.status, "time":service.status.time, "message":service.status.message}
    			  console.log(status);
    			  statuses.push(status);
    			});
    		res.jsonp(statuses);
    		});
    })
}




