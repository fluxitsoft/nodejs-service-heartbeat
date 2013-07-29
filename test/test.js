var checker = require('../routes/service-check.js');


serviceWeb = {"name": "Sitio Web de Fluxit", "type": "web", "url": "www.fluxit.com.ar", "status": {"status":"ok", "time": 0, "message": ""}};

serviceHudson=  {"name": "Hadoop-trunk-Commit", "type": "hudson", "url": "Hadoop-trunk-Commit", "status": {"status":"ok", "time": 0, "message":""}};


function okCallBack(service, status){
	console.log('OK '+service.name + ' status '+status.status + ' time '+status.time);
}

function errorCallBack(service, error){
	console.log('ERROR '+service.name + ' error '+error);
}


checker.checkWeb(serviceWeb,okCallBack, errorCallBack);
checker.checkHudson(serviceHudson,okCallBack, errorCallBack);


