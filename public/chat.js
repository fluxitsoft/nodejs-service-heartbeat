//Create a chat module to use.

	charts= [];
    
	
	function plot2(service){
		var name = service.name.replace(/ /g, '') ;
		var chartName = 'chart-'+name;
		
/*
  	    var msg = $('<div class="msg" id="'+name+'"></div>')
  	    msg.append('<span class="name" id="name">'+service.name+'</span>: ')
  	    	.append('<span class="text" id="status"></span>')
  	    	.append("<div id='chart"+name+"' class='plot' style='width:320px;height:210px;'></div>");

  */	    

  	    var msg = '<div class="msg" id="'+name+'"></div>'+
  	    			'<span class="name" id="name">'+service.name+'</span>: '+
  	    			"<span class='text' id='status"+name+"'>aaaa</span>" +
  	    			"<div id='chart"+name+"' class='plot' style='width:320px;height:210px;'></div>";
		
		
		if ($('#'+name).length<1){
			//console.log('no existe '+name);
			//no existe el div
			$('#messages').append($(msg));
			//addToGrid(service, msg);
		}
		//console.log('actualizando '+name +' TIME['+ service.status.time+ ']' );
		 //console.log($('#status'+name));
		 $('#status'+name).html(service.status.status+  ' TIME['+ service.status.time+ '] type['+service.type+ ']' );
		
		 chartName = 'chart'+name; 
		 //console.log($("#errorImage"+name).lenght);
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
			plotC = $.jqplot(chartName,[[service.status.time]],{
			 	title: service.name,
		       
		       seriesDefaults: {
		           renderer: $.jqplot.MeterGaugeRenderer,
		           rendererOptions: {
		        	   label: 'Seconds',
		               min: 0,
		               max: 2500,
		               intervals:[200, 800, 1500, 2500],
		               intervalColors:['#66cc66', '#93b75f', '#E7E658', '#cc6666']
		           }
		       }
			});
			charts[chartName] = plotC;
		}
		
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
        
      /*
      if ($('#'+name).length<1){
    	  var msg = $('<div class="msg" id="'+name+'"></div>')
    	  
    	  if (data.status.status == 'OK'){
	    	  msg
	            .append('<span class="name" id="name">' + name + '</span>: ')
	            .append('<span class="text" id="status">' + data.status.status+ ' TIME['+ data.status.time+ ']</span>');
	    	  $('#messages')
	          .append(msg)
	          .animate({scrollTop: $('#messages').prop('scrollHeight')}, 0);
	    	  
	    	  def = "<div id='chart"+name+"' class='plot' style='width:320px;height:210px;'></div>"
	    	  $(def).appendTo('#messages #'+name);
	    	  
	    	  
	    	  
	          plot(data.status.time, 'chart'+name, data);
	          
	          

    	  }else {
    		  msg
	            .append('<span class="name" id="name">' + name + '</span>: ')
	            .append("<div id='chart"+name+"' class='plot' style='width:320px;height:210px;'></div>")
	            //.appemdd("<div id='chart"+name+"' class='plot' style='width:320px;height:210px;'></div>")
	    	  $('#messages')
	          .append(msg)
	          .animate({scrollTop: $('#messages').prop('scrollHeight')}, 0);
    	  }
    	  
    	  $("<img src='error.jpg' id='errorImage"+name+"'/>").appendTo('#messages #'+name).hide();
    	  
      }else {
    	  //console.log($('#'+name+' #name'));
    	  $('#messages #'+name+' #status').html(data.status.status+  ' TIME['+ data.status.time+ ']' );
          plot(data.status.time, 'chart'+name, data);
      }
      
        */    
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