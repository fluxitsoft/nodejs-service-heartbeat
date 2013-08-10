
function ServiceListCtrl($scope, Service) {
	$scope.services= Service.query();
	 $scope.orderProp = 'name';
}

//function PhoneListCtrl($scope, $http) {
function PhoneListCtrl($scope, Phone) {
	$scope.phones = Phone.query();
	 $scope.orderProp = 'age';
	                
	                
}


function ServiceDetailCtrl($scope,$routeParams,Service)  {
//function PhoneDetailCtrl($scope, $routeParams, $http)  {
	
	$scope.types = ["web", "ping","telnet", "hudson", "sonar", "jmx"];
	
	$scope.service = Service.get({serviceId: $routeParams.serviceId}, 
		function(service) {
	    	//$scope.mainImageUrl = service.images[0];
			console.log('service '+service.name);
	  	},

		function(error){
	  		console.log("error ", error);
	  		}
	
	
	);	
	
	/*
	
	 $http.get('js/' + $routeParams.phoneId + '.json').success(function(data) {
		 	
		    $scope.phone = data;
		    $scope.mainImageUrl = data.images[0];
		  });

	 */
	 $scope.setImage = function(imageUrl) {
		    $scope.mainImageUrl = imageUrl;
		  }	 
	 
	 
	 $scope.update= function(){
		 console.log('update service '+$scope.service);
		 console.log('IID '+ $scope.service._id);
		 
		 s = new Service($scope.service);
		 
		 
		 if ($scope.service._id){
			 s.$update({serviceId: $scope.service._id},
					 function(data, headers){
				 			console.log('ok update service '+data.name);
				 		}, 
					 function(err){console.log(err)}
			);
		 }else {
			 //es nuevo
			 
			 s.$save({serviceId: $scope.service._id},
					 function(service, headers){
				 			console.log('ok insert service '+service.name +  ' ID '+service._id);
				 			$scope.service=service;
				 		}, 
					 function(err){console.log(err)}
					 );
			 
		 }
		 /*
		 Service.update({serviceId: $scope.service._id},  $scope.service, function (data) {
			 	console.log(data);
         		}, function ($http) {
         					console.log('Couldn\'t save document.');
         				})
		 */
		 
	 }
	 
}


function PhoneDetailCtrl($scope,$routeParams,Phone)  {
//function PhoneDetailCtrl($scope, $routeParams, $http)  {
	
	$scope.phone = Phone.get({phoneId: $routeParams.phoneId}, 
			function(phone) {
	    		$scope.mainImageUrl = phone.images[0];
	  		}
	);	
	
	/*
	
	 $http.get('js/' + $routeParams.phoneId + '.json').success(function(data) {
		 	
		    $scope.phone = data;
		    $scope.mainImageUrl = data.images[0];
		  });

	 */
	 $scope.setImage = function(imageUrl) {
		    $scope.mainImageUrl = imageUrl;
		  }	 
	 
	 
}