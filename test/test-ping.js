var pingModule = require('../lib/ping');
//exec("ping -c 4 " + host, callback);

pingModule.ping('app.engagefull.com.ar', 
		function(err, data){
	if (err){
		console.log(err.code);
	}else {
		console.log(data);
	}
		
			}
)

