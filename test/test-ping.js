var pingModule = require('../lib/ping');
//exec("ping -c 4 " + host, callback);

pingModule.ping('www.google.com.ar', 
		function(err, data){
	if (err){
		console.log(err.code);
	}else {
		console.log(data);
	}
		
			}
)

