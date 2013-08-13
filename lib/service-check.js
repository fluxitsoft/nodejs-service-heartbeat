var fs = require('fs');
var http = require('http');
var https = require('https');
var request = require("request");
var net = require('net');
var jmx = require("jmx");







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


try{	
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

	}catch (err){
		console.log("ERROR WEB "+ err);
		errorCallback(service, err.message);
	}

	
}



/* 
 * SERVICE CHECK - HUDSON PROJECT 
 * Check the status of a jenkins project
 * */
exports.checkHudson = function(service, okCallBack, errorCallback){
	
	projectName = service.url;
	host = service.params.host || 'ci.intranet.fluxit.com.ar';
	pathInstall = service.params.path || '/hudson/';
	isHttps = service.params.https || false;
	port = 80;
	if (isHttps) port = 443;
	//console.log('Jenkins '+host + ' path '+pathInstall+projectName+ '/lastBuild/api/json');
	
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

	try{	
	
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
		    		//En time retorna la tasa de test de unidad con exito
		    		service.status.time = 100;
			    	
		    		
			    	data.actions.forEach(function(a){
			    		if (a.totalCount){
			    			//success rate
			    			if (a.failCount == 0){
			    				service.status.time  = 100;
			    			}else {
			    				service.status.time  = (a.totalCount / a.failCount)	
			    			}
			    			
			    			
			    		}
			    	});
			    	
			    	
			    	okCallBack(service, service.status);
		    	}else {
		    		errorCallback(service, data.result);
		    		//service.status.status = 'ERROR';
		    		//service.status.message = data.result;
		    	}
		  }
			catch(err)
  			{
					
	    			errorCallback(service, "error parsing response");
  			}
	    })
	    res.on('error', function(e) {
	    	console.log(body);
	    	errorCallback(service, e.message);
	    });
	});
	}catch (err){
		console.log("ERROR HUDSON "+host + " "+ err);
		errorCallback(service, err.message);
	}

}



/*t 
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
	host = service.url;
	port = 80;
	if (service.params){
		port = service.params.port | 80;	
	}
	

	try{	
		var stream = net.createConnection(port, host);
		stream.on('connect', function() {
		  stream.end(); 
			service.status.status = 'OK';
			service.status.time = (new Date().getTime()) - inicio;
			service.status.message = '';
			okCallBack(service, service.status);
		  
		  
		});
		stream.on('error', function(error) {
		  stream.destroy(); // note: we use destroy() because of the errors
		  errorCallback(service, error);
		})
	}catch (err){
		console.log("ERROR Telnet "+host + " "+ err);
		errorCallback(service, err.message);
	}
	
}


//http://docs.codehaus.org/pages/viewpage.action?pageId=229743280

exports.checkSonar = function(service, okCallBack, errorCallback){
	
	projectName = service.url;
	host = service.params.host || 'intra2.intranet.fluxit.com.ar';
	pathInstall = service.params.path || '/sonar/';
	isHttps = service.params.https || false;
	port = 80;
	if (isHttps) port = 443;
	
	fullPath='/api/resources?resource='+service.url+'&metrics=coverage,tests,test_success_density';
	
	
	var options = {
	   // esta es la instalacion de flux	
	   host: host,
	   //host: 'builds.apache.org',
	   //en flux esta en el puerto 80	
	   port: port,
	    // esta es la instalacion de flux
	    path: fullPath,
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
	
try{
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
		    		service.status.status = 'OK';
		    		service.status.message = "";
		    		//Por ahora retorno el density de errores
		    		data[0].msr.forEach(function(a){
		    			if (a.key == 'coverage'){
		    				//Retorno la tasa de test con errores
		    				service.status.time = a.val;		
		    			}
		    		});
		    		
		    		
			    	
		    		
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
	    	console.log(body);
	    	errorCallback(service, e.message);
	    });
	});
	}catch (err){
		console.log("ERROR SONAR "+host + " "+ err);
		errorCallback(service, err.message);
	}


}


var jmx = require("jmx");
//https://github.com/onddo/node-jmx
exports.checkJMX = function(service, okCallBack, errorCallback){ 
	
	var jmx = require("jmx");
	//https://github.com/onddo/node-jmx

	/*
	client = jmx.createClient({
		  service: "service:jmx:rmi:///jndi/rmi://localhost:3000/jmxrmi"
		});
		*/
	try{
		client = jmx.createClient({
			host: "localhost", // optional
			port: 8999
		});

		client.on("error", function(err){
			errorCallback(service, err.message);
			});
		

		client.connect();
		
		
		client.on("connect", function() {
		
		  //client.getAttribute("java.lang:type=Memory", "HeapMemoryUsage", function(data) {
			client.getAttribute(service.params.object, service.params.property, function(data) {
		    var used = data.getSync('used');
		    //console.log("HeapMemoryUsage used: " + Math.round(used.longValue/1024) + ' Kb');

		    service.status.status = "OK";
		    service.status.time = Math.round(used.longValue/1024);
		    service.status.message = "";
		    okCallBack(service, service.status);
		  });
		/*
		  client.setAttribute("java.lang:type=Memory", "Verbose", true, function() {
		    console.log("Memory verbose on"); // callback is optional
		  });
		
		  client.invoke("java.lang:type=Memory", "gc", [], function(data) {
		    console.log("gc() done");
		  });
		*/
		});
		
		

		}catch(err){
			console.log("*********************** ERROR "+err);
			errorCallback(service, err);
		}
}



