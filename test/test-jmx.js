var jmx = require("jmx");


var hb = require('../lib/service-check.js');


serv = {"name": "Memory Ussage JMX", "type": "jmx", "url": "java.lang:type=Memory", "status": {"status":"ok", "time": 0, "message":""},  
		"params":{ "object":"java.lang:type=Memory", "property":"HeapMemoryUsage", "host":"localhost", "port":"8999", "secure":false, "user":"user", "pwd": "pwd"}}




function ok(service, status){
	console.log('TEST OK TYPE '+service.type+ ' NAME ' +service.name + ' status '+status.status + ' time '+status.time);
}

function error(service, error){
	console.log('TEST ERROR TYPE '+service.type+ ' NAME ' +service.name + ' error '+error);
}

hb.checkJMX(serv, ok, error);

