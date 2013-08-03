var express = require('express'),
	//use this module to check the services
    api= require('./routes/api');
	services = require('./routes/services');


var app = express();

//app.get('/employees/:id/reports', wines.findByManager);
//app.get('/employees/:id', wines.findById);
//app.get('/employees', wines.findAll);

//API to read the status of the services
app.get('/services', api.findAll);
app.get('/status', api.status);


app.listen(3000);

//Call the check service in a background loop
setInterval(function(){
		services.checkServices();
}, 5000);



console.log('Listening on port 3000...access to /services to see the status');
