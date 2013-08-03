//Create a chat module to use.

	charts= [];
    
	
	function plot2(service){
		var name = service.name.replace(/ /g, '') ;
		var chartName = 'chart-'+name;

  	    var msg = '<div class="msg" id="'+name+'"></div>'+
  	    			'<span class="name" id="name">'+service.name+'</span>: '+
  	    			"<span class='text' id='status"+name+"'>aaaa</span>" +
  	    			"<div id='chart"+name+"' class='plot' style='width:320px;height:210px;'></div>";
		
		
		if ($('#'+name).length<1){
			//no existe el div
			$('#messages').append($(msg));
		}
		 $('#status'+name).html(service.status.status+  ' TIME['+ service.status.time+ '] type['+service.type+ ']' );
		 chartName = 'chart'+name; 
		if (service.status.status == 'ERROR'){
			//$('#errorImage'+name).show();
			$('#'+chartName).children().remove();
			$('#'+chartName).append("<img src='error.jpg' id='errorImage"+name+"' width=200px height=130px/>")
			//charts[chartName].destroy();
			
		}else { 
			$('#'+chartName).children().remove();
			
			if (charts[chartName]){
				charts[chartName].destroy();	
			}
			
			plotC = createGauge(chartName, service);
		
			charts[chartName] = plotC;
		}
		
	}
    

	function createGauge(chartName, service){
		
		
		
		min = 0;
		max = 1500;
		intervals = [200, 600, 900, 1500];
		label = 'ms';
		colors = ['#66cc66', '#93b75f', '#E7E658', '#cc6666']
		
		if (service.type == 'ping' || service.type == 'telnet'){
			max = 500;
			intervals = [100, 200, 400, 500];
		}
		if (service.type == 'hudson'){
			//Es el rate de errores sobre los test
			max = 100;
			intervals = [70, 80, 90, 100];
			label = 'tests';
			colors = [  '#cc6666', '#E7E658','#93b75f','#66cc66']
		}
		if (service.type == 'sonar'){
			//OUT OF COVERAGE
			max = 100;
			intervals = [30, 50, 60, 100];
			label = 'coverage';
			colors = [  '#cc6666', '#E7E658','#93b75f','#66cc66']
		}

		if (service.type == 'jmx'){
			//OUT OF COVERAGE
			max = 50000;
			intervals = [8000, 15000, 30000, 50000];
			label = 'KB';
			//colors = [  '#cc6666', '#E7E658','#93b75f','#66cc66']
		}
		
		
		
		plotC = $.jqplot(chartName,[[service.status.time]],{
		 	title: service.name,
	       
	       seriesDefaults: {
	           renderer: $.jqplot.MeterGaugeRenderer,
	           rendererOptions: {
	        	   label: label,
	               min: min,
	               max: max,
	               intervals:intervals,
	               intervalColors:colors
	           }
	       }
		});
		return plotC;
		
	}
	
		

(function () {
  window.Chat = {
    socket : null,
  
    initialize : function(socketURL) {
      this.socket = io.connect(socketURL);

      //Send message on button click or enter
      $('#send').click(function() {
        Chat.send();
      });

      //Send message on button click or enter
      $('#register').click(function() {
        Chat.register();
      });
      
      $('#message').keyup(function(evt) {
        if ((evt.keyCode || evt.which) == 13) {
          Chat.send();
          return false;
        }
      });

      //Process any incoming messages
      this.socket.on('service-update', this.add);
    },

    //Adds a new message to the chat.
    add : function(data) {
      var name = data.name.replace(/ /g, '') ;
      
       plot2(data);
    },
 
    //Sends a message to the server,
    //then clears it from the textarea
    send : function() {
      this.socket.emit('msg', {
        name: $('#name').val(),
        msg: $('#message').val()
      });
      $('#message').val('');
      return false;
    }
,
    register: function() {
        this.socket.emit('register', {
          name: $('#name').val()
        });
        return false;
      }

    
  };
}());