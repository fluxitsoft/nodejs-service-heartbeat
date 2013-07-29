var express = require('express'),
    //wines = require('./routes/employee');
    services = require('./routes/services');
    http = require('http'); 
var app = express();

//app.get('/employees/:id/reports', wines.findByManager);
//app.get('/employees/:id', wines.findById);
//app.get('/employees', wines.findAll);
app.get('/services', services.findAll);

app.listen(3000);

running = false;


setInterval(function(){
		services.checkServices();
}, 5000);



console.log('Listening on port 3000...');
