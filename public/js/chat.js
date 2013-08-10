//Create a chat module to use.

	charts= [];
    
	
	function plot2(service){
		var name = service.name.replace(/ /g, '') ;
		//console.log('plot '+name);
		if (charts[name]){
			//ya existe a lo sumo lo actualizo

			charts[name].refresh(service.status.time);
			//TODO: Manejo de errores
		}else {
			//no existe lo tengo que crear
			
	    	  var divChart = $('<div class="gauge" id="'+name+ '"></div>');
    		  $('#monitor').append(divChart );

    		  	min = 0;
    		  	max = 1000;
    		  	label = 'ms.';
    		  	colors = ["#a9d70b","#f9c802","#ff0000"]
    		  	
    			if (service.type == 'hudson'){
    				max = 100;
    				min = 0; 
    				label = 'tests';
    				colors = ["#ff0000", "#f9c802","#a9d70b"];
    				
    			}
    			if (service.type == 'ping'){
    				max = 300;
    				min = 0; 
    				label = 'ms';
    				
    			}

    			if (service.type == 'sonar'){
    				max = 100;
    				min = -1;
    				colors = ["#ff0000", "#f9c802","#a9d70b"];
    				
    				label = 'coverage';
    			}

    			if (service.type == 'jmx'){
    				max = 50000;
    				min = 1000;
    				label = 'KB';
    			}
    			
    			
    		  
    		  
    		  var c= new JustGage({
  	            id: name, 
  	            value: service.status.time, 
  	            min: min,
  	            max: max,
  	            title: service.name,
  	            label: label,
  	            levelColorsGradient: false,
  	            startAnimationTime: 2000,
  	            startAnimationType: ">",
  	            refreshAnimationTime: 1000,
  	            refreshAnimationType: "bounce",
  	            levelColors: colors
  	          });    		  
    		  
    		  charts[name] = c;
			
			
		}
		
	}
	
		

(function () {
  window.Chat = {
    socket : null,
  
    initialize : function(socketURL) {
    	console.log('initializing '+socketURL);
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