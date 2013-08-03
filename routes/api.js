
var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db2;

var conn = new MongoClient(new Server('localhost', 27017));

/* 
Se conecta con la DB y chequea si existe la base de datos
inicializa todas las variables de conexión con mongo
*/
conn.open(function(err, mongoClient) {
	db2 = mongoClient.db("services-status");
	console.log('conectado');
});


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




