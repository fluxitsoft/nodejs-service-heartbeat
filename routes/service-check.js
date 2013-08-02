var fs = require('fs');
var http = require('http');
var https = require('https');
var request = require("request");
var pingModule = require('../lib/ping');
//var ping = require ("net-ping");

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
	var options = {
	   // esta es la instalacion de flux	
	   host: 'ci.intranet.fluxit.com.ar',
	   //host: 'builds.apache.org',
	   //en flux esta en el puerto 80	
	   port: 80,
	    // esta es la instalacion de flux
	    path: '/hudson-2.0.1/job/'+projectName+ '/lastBuild/api/json',
	    //path: '/job/'+projectName+ '/lastBuild/api/json',
	   
		//En caso de que se requiera auth descomentar esta linea
		 headers: {
		     'Authorization': 'Basic ' + new Buffer(service.params.user + ':' + service.params.password).toString('base64')
		   }    
	   
	};

	//ver como configurar si es http o https
	request = http.get(options, function(res){
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
		    	}else {
		    		service.status.status = 'ERROR';
		    		service.status.message = data.result;
		    	}
		    	
		    	
		    	service.status.time = data.duration;
		    	
		    	okCallBack(service, service.status);
		  }
			catch(err)
  			{
					console.log(err);
					console.log(body);
	    			errorCallback(service, "error parsing response");
  			}
	    })
	    res.on('error', function(e) {
	    	
	    	errorCallback(service, e.message);
	    });
	});

}



/*
 * SERVICE CHECK - PING SERVICE
 * Used to check if a ping to any host or server response.
 * 
 */
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


	//create the TCP stream to the server
	var stream = net.createConnection(80, 'www.fluxit.com.ar');
	// listen for connection
	stream.on('connect', function() {
	  // connection success
	  console.log('connected');
	  stream.end(); // close the stream
	});
	// listen for any errors
	stream.on('error', function(error) {
	  console.log('error: ' + error);
	  stream.destroy(); // close the stream
	  // note: we use destroy() because of the errors
	})
	
}

