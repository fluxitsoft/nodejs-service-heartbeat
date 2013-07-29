var fs = require('fs');
var http = require('http');
var https = require('https');
var request = require("request");

// Check if a service represented by a web application is up and return a status object (status code and time)
exports.checkWeb = function(service, okCallBack, errorCallback){
	inicio = new Date().getTime();
	//console.log('inicio check web a '+service.url);
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
		//console.log('WEB ['+service.url + '] time['+service.status.time+ '] ');
		okCallBack(service, service.status);

	    })
	    res.on('error', function(e) {
	    	console.log("Got error: " + e.message);
	    	errorCallback(service, e.message);
	    });
	})
	.on('error', function(e) {
		service.status.status = 'error';
		service.status.time = 0;
		service.status.message = e.message;
		//console.log('WEB ['+service.url + '] error['+service.status.message+ '] ');
		errorCallback(service, e.message);
	});
;
	
}



/* Check the status of a jenkins project*/
exports.checkHudson = function(service, okCallBack, errorCallback){
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
	    	//console.log('Hudon Proyecto['+data.fullDisplayName+ '] status['+data.result+'] ');
	    	service.status.status = data.result;
	    	service.status.time = data.duration;
	    	okCallBack(service, service.status);
	    })
	    res.on('error', function(e) {
	    	//console.log("Got error: " + e.message);
	    	errorCallback(service, e.message);
	    });
	});

}



