    var api= require('./routes/api');
	var services = require('./routes/services');
	
	
	var express = require('express');
	var app = express();
	var server = require('http').createServer(app);
	var io = require('socket.io').listen(server);
	
	
//app.get('/employees/:id/reports', wines.findByManager);
//app.get('/employees/:id', wines.findById);
//app.get('/employees', wines.findAll);

//app.listen(3000);
server.listen(3000);

//API to read the status of the services
app.use(express.bodyParser())
app.get('/services', api.findAll);
app.get('/services/:id', api.findById); //Get by name	
app.post('/services', api.saveService); //add new or upate	
app.put('/services/:id', api.updateService); //update service	


app.get('/status', api.status);

app.use("/", express.static(__dirname + '/public'));



//Configure the push notificator for the service checker module
services.configuration.notificator = function(service){
	io.sockets.emit('service-update', service);
};


//Call the check service in a background loop

setInterval(function(){
		services.checkServices();
}, 5000);



io.sockets.on('connection', function (socket) {
	console.log('connected');
	  socket.on('register', function (data) {
		    console.log('register '+data.name);
		  });
});




console.log('Listening on port 3000...access to /services to see the status');
