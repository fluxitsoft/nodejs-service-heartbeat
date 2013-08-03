
var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db2;
var conn = new MongoClient(new Server('localhost', 27017));

conn.open(function(err, mongoClient) {
	
	db2 = mongoClient.db("services-status");
	
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


/* llena la base de datos con servicios de ejemplo */
var populateDB = function() {
 
    console.log("Llenando base de servicios ");
    var services = [
        {"name": "Sitio Web de Fluxit", "type": "web", "url": "www.fluxit.com.ar", "status": {"status":"ok", "time": 0, "message": ""}} ,
        {"name": "RunRun", "type": "web", "url": "runrun.fluxit.com.ar", "status": {"status":"ok", "time": 0, "message": ""}},
        {"name": "Agile-PROSAMSEG-20Min", "type": "hudson", "url": "Agile-PROSAMSEG-20Min", "status": {"status":"ok", "time": 0, "message":""}, 
		"params":{ "user":"usr", "password": "pwd"}} 
        {"name": "Google by ping", "type": "ping", "url": "www.google.com.ar", "status": {"status":"ok", "time": 0, "message":""}}
        {"name": "Telnet port", "type": "telnet", "url": "www.google.com.ar:80", "status": {"status":"ok", "time": 0, "message":""}}
	];
 
    db2.collection('services', function(err, collection) {
        collection.insert(services, {safe:true}, function(err, result) {});
    });
 

};