angular.module('phonecatServices', ['ngResource']).
    factory('Phone', function($resource){
  return $resource('js/data/:phoneId.json', {}, {
    query: {method:'GET', params:{phoneId:'data'}, isArray:true}
  });
});


angular.module('servicesAdminServices', ['ngResource']).
	factory('Service', function($resource){
		
		return $resource('/services/:serviceId', {}, {
				query: {method:'GET', params:{serviceId:''}, isArray:true},
				update:{method:'PUT', params:{serviceId:''},data:{}, isArray:false},
				save:{method:'POST', params:{serviceId:''},data:{}, isArray:false}
		});
		
		
});


