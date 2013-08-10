  
var MongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID,
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


exports.findById= function(req, res) {
    console.log(req.params);
    var id = req.params.id;
    console.log('findById: ' + id);
    db2.collection('services', function(err, collection) {
        collection.findOne({_id: new ObjectID(id)}, function(err, item) {
            console.log('Result '+item);
            res.jsonp(item);
        });
    });
};


exports.updateService= function(request, response) {
	console.log('req:'+ request+ ' method:'+request.method+' body:'+request.body);
	var id = request.params.id;

	
		var service = request.body;
		delete service._id;
		console.log('Save Service: '+id+ ' JSON:' + service);
		
	    db2.collection('services', function(err, collection) {
	        collection.update({_id: new ObjectID(id)}, service, {safe:true}, function(err, result) {
	            if (err) {
	                console.log('Error updating service: ' + err);
	                response.send({'error':'An error has occurred'});
	            } else {
	                console.log('' + result + ' document(s) updated');
	                response.send(service);
	            }
	        });
		 
		
		
		
		
	})
}



exports.saveService= function(request, res) {
	
	var service = request.body;	 
	 console.log('save service' + request.id + ' body '+service);
	 console.log('save Service: '+request.id+ ' JSON:' + JSON.stringify(service));
	 
	 
	    db2.collection('services', function(err, collection) {
	        collection.insert(service, {safe:true}, function(err, result) {
	            if (err) {
	                res.send({'error':'An error has occurred'});
	            } else {
	                console.log('Success: ' + JSON.stringify(result[0]));
	                res.send(result[0]);
	            }
	        });
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







