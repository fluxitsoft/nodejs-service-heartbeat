var net = require('net');

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
/*
var conn = net.createConnection(80, 'www.fluxit.com.ar',
	    function() { 
	  console.log('client connected ');
	  
	});
conn.on('data', function (data) {console.log('data: '+data.toString())});
conn.on('error', function (err) {console.log('error',err.code)});
conn.on('end', function() {console.log('client disconnected');});
conn.on('connect', function() {console.log('entro ');});
*/