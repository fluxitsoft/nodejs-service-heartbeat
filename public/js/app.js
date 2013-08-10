angular.module('phonecat', ['phonecatFilters', 'phonecatServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/phones', {templateUrl: 'partial/phone-list.html',   controller: PhoneListCtrl}).
      when('/phones/:phoneId', {templateUrl: 'partial/phone-detail.html', controller: PhoneDetailCtrl}).
      otherwise({redirectTo: '/phones'});
}]);



angular.module('servicesAdmin', ['servicesAdminServices']).
config(['$routeProvider', function($routeProvider) {
$routeProvider.
    when('/admin', {templateUrl: 'partial/services-list.html',   controller: ServiceListCtrl}).
    when('/admin/:serviceId', {templateUrl: 'partial/service-detail.html', controller: ServiceDetailCtrl}).
    when('/admin/new', {templateUrl: 'partial/service-detail.html', controller: ServiceDetailCtrl}).
    otherwise({redirectTo: '/admin'});
}]);


