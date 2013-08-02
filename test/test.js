var checker = require('../routes/service-check.js');


serviceWeb = {"name": "Sitio Web de Fluxit", "type": "web", "url": "www.fluxit.com.ar", "status": {"status":"ok", "time": 0, "message": ""}};

serviceHudson=    {"name": "Agile-PROSAMSEG-20Min", "type": "hudson", "url": "Agile-PROSAMSEG-20Min", "status": {"status":"ok", "time": 0, "message":""}, 
		"params":{ "user":"usr", "password": "pwd"}} ;


servicePing=  {"name": "Ping Test", "type": "ping", "url": "192.168.0.81", "status": {"status":"", "time": 0, "message":""}};

function okCallBack(service, status){
	console.log('OK '+service.name + ' status '+status.status + ' time '+status.time);
}

function errorCallBack(service, error){
	console.log('ERROR '+service.name + ' error '+error);
}


checker.checkWeb(serviceWeb,okCallBack, errorCallBack);
checker.checkHudson(serviceHudson,okCallBack, errorCallBack);
checker.checkPing(servicePing,okCallBack, errorCallBack);


