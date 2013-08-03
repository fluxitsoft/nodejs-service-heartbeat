var fs = require('fs');
var http = require('http');
var https = require('https');
var request = require("request");
var net = require('net');








/*
 * SERVICE CHECK - WEB APPLICATION
 * Check if a service represented by a web application is up and return a status object (status code and time)
 */ 
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


		service.status.status = 'OK';
		service.status.time = time;
		service.status.message = "";
		 
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



/* 
 * SERVICE CHECK - HUDSON PROJECT 
 * Check the status of a jenkins project
 * */
exports.checkHudson = function(service, okCallBack, errorCallback){
	
	projectName = service.url;
	host = service.params.host || 'ci.intranet.fluxit.com.ar';
	pathInstall = service.params.path || '/hudson-2.0.1/job/';
	isHttps = service.params.https || false;
	port = 80;
	if (isHttps) port = 443;
	console.log('Jenkins '+host + ' path '+pathInstall+projectName+ '/lastBuild/api/json');
	
	var options = {
	   // esta es la instalacion de flux	
	   host: host,
	   //host: 'builds.apache.org',
	   //en flux esta en el puerto 80	
	   port: port,
	    // esta es la instalacion de flux
	    path: pathInstall+'/job/'+projectName+ '/lastBuild/api/json',
	    //path: '/job/'+projectName+ '/lastBuild/api/json',
		//En caso de que se requiera auth descomentar esta linea
	    headers: {}
	   /*
		 headers: {
		     'Authorization': 'Basic ' + new Buffer(service.params.user + ':' + service.params.password).toString('base64')
		   }    
	   */
	};
	
	
	if (service.params.user){
		options.headers.Authorization = 'Basic ' + new Buffer(service.params.user + ':' + service.params.password).toString('base64');
	}

	var requester = http;
	if (isHttps ){
		requester = https;
	}
	
	
	//ver como configurar si es http o https
	request = requester.get(options, function(res){
	    var body = "";
	    res.on('data', function(data) {
	    	body += data;
	    });
	    res.on('end', function() {
		try
		  {
		    	data = JSON.parse(body);
		    	
		    	if (data.result == 'SUCCESS'){
		    		service.status.status = 'OK';
		    		service.status.message = "";
			    	service.status.time = data.duration;
			    	okCallBack(service, service.status);
		    	}else {
		    		errorCallback(service, data.result);
		    		//service.status.status = 'ERROR';
		    		//service.status.message = data.result;
		    	}
		  }
			catch(err)
  			{
					console.log(err);
					console.log(body);
	    			errorCallback(service, "error parsing response");
  			}
	    })
	    res.on('error', function(e) {
	    	console.log(body);
	    	errorCallback(service, e.message);
	    });
	});

}



/*
 * SERVICE CHECK - PING SERVICE
 * Used to check if a ping to any host or server response.
 * 
 */
var pingModule = require('../lib/ping');
exports.checkPing = function(service, okCallBack, errorCallback){
	pingModule.ping(service.url, 
	function(err, data){
		if (err){
			errorCallback(service, err.code);
		}else {
			service.status.status = 'OK';
			service.status.time = data.time;
			service.status.message = 'IP '+data.ip + ' TTL '+data.ttl;
			okCallBack(service, service.status);
		}
			
	});	
}



/*
 * SERVICE CHECK - TELNET SERVICE
 * Used to check any type of services using telnet protocol
 */

exports.checkTelnet = function(service, okCallBack, errorCallback){
	inicio = new Date().getTime();
	
	if (service.url.indexOf(':') != -1){
		url = service.url.substring(0, service.url.indexOf(':'));
		port = service.url.substring(service.url.indexOf(':') + 1, service.url.lenght);
	}else {
		url = service.url;
		port = 80;
	}
	
	
	
	//console.log( ' url '+url + ' port '+port);
	var stream = net.createConnection(port, url);
	// listen for connection
	stream.on('connect', function() {
	  // connection success
	  //console.log('connected');
	  stream.end(); 
		service.status.status = 'OK';
		service.status.time = (new Date().getTime()) - inicio;
		service.status.message = '';
		okCallBack(service, service.status);
	  
	  
	});
	// listen for any errors
	stream.on('error', function(error) {
	  console.log('error: ' + error);
	  stream.destroy(); // note: we use destroy() because of the errors
		errorCallback(service, error);
	})
	
}

