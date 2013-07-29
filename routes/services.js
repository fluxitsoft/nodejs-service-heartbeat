var fs = require('fs');
var http = require('http');
var https = require('https');
var request = require("request");

var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db2;

var conn = new MongoClient(new Server('localhost', 27017));


/* Chequea un servicio web, corresponde a una pagina web vía http normal */ 
var checkWeb = function(service, coll){
	inicio = new Date().getTime();
	console.log('inicio check web a '+service.url);
	var options = {
	    host: service.url,
	    port: 80,
	    path: '/'   
	};
	request = http.get(options, function(res){
	    var body = "";
	    res.on('data', function(data) {
		body += data;
	    });
	    res.on('end', function() {
		time = new Date().getTime() - inicio;


		service.status.status = 'ok';
		service.status.time = time;
		console.log('WEB ['+service.url + '] time['+service.status.time+ '] ');
		coll.update({_id:service._id}, service, function(err, doc){});

	    })
	    res.on('error', function(e) {
		console.log("Got error: " + e.message);
	    });
	})
	.on('error', function(e) {
		service.status.status = 'error';
		service.status.time = 0;
		service.status.message = e.message;
		console.log('WEB ['+service.url + '] error['+service.status.message+ '] ');
		coll.update({_id:service._id}, service, function(err, doc){});
	});


}

/* chequea un servicio en base al API publica de jenkins */
var checkHudsonProject = function(service, coll){
	
	exports.privateCheckHudson(service, coll);
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
    	db2.collection('services', function(err, collection){   collection.remove({},function(err, removed){console.log(removed);});   });
	//Lleno todoo
    	populateDB();
	/*
		  db2.collection('services', {strict:true}, function(err, collection) {
			if (err) {
			    console.log("La base de datos de servicios esta vacia");
			    populateDB();
			}
		    });

		*/	
	
});



/* Chequea un proyecto en hudson en base al api de hudson */
exports.privateCheckHudson = function(service, coll){
	projectName = service.url;
	var options = {
	   // esta es la instalacion de flux	
	   // host: 'ci.intranet.fluxit.com.ar',
	   host: 'builds.apache.org',
	   //en flux esta en el puerto 80	
	    port: 443,
	    // esta es la instalacion de flux
	    //path: '/hudson-2.0.1/job/'+projectName+ '/lastBuild/api/json',
	    path: '/job/'+projectName+ '/lastBuild/api/json',
	   /*
		En caso de que se requiera instalacion descomentar esta linea
		 headers: {
		     'Authorization': 'Basic ' + new Buffer('usruario_ejemplo' + ':' + 'password_ejemplo').toString('base64')
		   }    
	   */
	};
	//ver como configurar si es http o https
	request = https.get(options, function(res){
	    var body = "";
	    res.on('data', function(data) {
		body += data;
	    });
	    res.on('end', function() {
		 data = JSON.parse(body);

		console.log('Hudon Proyecto['+data.fullDisplayName+ '] status['+data.result+'] ');
		service.status.status = data.result;
		service.status.time = data.duration;
		coll.update({_id:service._id}, service, function(err, doc){});

	    })
	    res.on('error', function(e) {
		console.log("Got error: " + e.message);
	    });
	});

}

/* Iterador que recupera todos los servicios y llama a la función checkService que determina como se chequea cada uno */
exports.checkServices = function() {
	db2.collection('services', function(err, coll) {
  		coll.find().toArray(function(err, items) {
                	items.forEach( function(service, index){
				//console.log('chequeando ... type['+service.type + '] dest ['+service.url)
				status = checkService(service, coll);
			}); 

            	});
		
	})

};

/* Determina como se chequea cada servicio y llama a la funcion correspondiente */
function checkService(service, coll){
	checkers[service.type](service,coll);	
}


/* Funciones para retornar con http/json el status de los servicios */

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



/* llena la base de datos con servicios de ejemplo */
var populateDB = function() {
 
    console.log("Llenando base de servicios ");
    var services = [
        {"name": "Sitio Web de Fluxit", "type": "web", "url": "www.fluxit.com.ar", "status": {"status":"ok", "time": 0, "message": ""}} ,
        {"name": "RunRun", "type": "web", "url": "runrun.fluxit.com.ar", "status": {"status":"ok", "time": 0, "message": ""}},
        {"name": "Hadoop-trunk-Commit", "type": "hudson", "url": "Hadoop-trunk-Commit", "status": {"status":"ok", "time": 0, "message":""}} 
	];
 
    db2.collection('services', function(err, collection) {
        collection.insert(services, {safe:true}, function(err, result) {});
    });
 

};
