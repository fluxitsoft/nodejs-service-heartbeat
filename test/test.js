//var checker = require('../routes/service-check.js');
var hb = require('../routes/services.js');


var servicesToCheck = [
{"name": "Sitio Web de Fluxit", "type": "web", "url": "www.fluxit.com.ar", "status": {"status":"ok", "time": 0, "message": ""}}
,
/*
{"name": "Jenkins Tomcat-7.x", "type": "hudson", "url": "Tomcat-7.x", "status": {"status":"ok", "time": 0, "message":""},  
	"params":{ "user":"usr", "password": "pwd", "host":"builds.apache.org", "path":"/", "https":true}}
*/ 
{"name": "Jenkins  maven 3", "type": "hudson", "url": "maven-3.x", "status": {"status":"ok", "time": 0, "message":""},  
	"params":{ "host":"builds.apache.org", "path":"/", "https":true}}

,
{"name": "Ping Test", "type": "ping", "url": "www.google.com.ar", "status": {"status":"", "time": 0, "message":""}}
,
{"name": "Telnet to Goole", "type": "telnet", "url": "www.google.com.ar", "status": {"status":"", "time": 0, "message":""}}
,

{"name": "Sonar Ejemplo Jboss", "type": "sonar", "url": "176173", "status": {"status":"ok", "time": 0, "message":""},  
	"params":{ "host":"nemo.sonarqube.org", "path":"/", "https":false}}


]

	

function okCallBack(service, status){
	console.log('TEST OK TYPE '+service.type+ ' NAME ' +service.name + ' status '+status.status + ' time '+status.time);
}

function errorCallBack(service, error){
	console.log('TEST ERROR TYPE '+service.type+ ' NAME ' +service.name + ' error '+error);
}

servicesToCheck.forEach(function(e, i){
			hb.check(e, okCallBack, errorCallBack)
		}
);


//hb.check(serviceTelnet);
//service.checkWeb(serviceWeb,okCallBack, errorCallBack);
//checker.checkHudson(serviceHudson,okCallBack, errorCallBack);
//service.checkPing(servicePing,okCallBack, errorCallBack);


