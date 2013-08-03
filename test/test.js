//var checker = require('../routes/service-check.js');
var hb = require('../routes/services.js');


var servicesToCheck = [
{"name": "Sitio Web de Fluxit", "type": "web", "url": "www.fluxit.com.ar", "status": {"status":"ok", "time": 0, "message": ""}}
,
{"name": "Agile-PROSAMSEG-20Min", "type": "hudson", "url": "Agile-PROSAMSEG-20Min", "status": {"status":"ok", "time": 0, "message":""},  "params":{ "user":"usr", "password": "pwd"}} 
,
{"name": "Ping Test", "type": "ping", "url": "awww.google.com.ar", "status": {"status":"", "time": 0, "message":""}}
,
{"name": "Telnet ", "type": "telnet", "url": "www.google.com.ar", "status": {"status":"", "time": 0, "message":""}}
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


