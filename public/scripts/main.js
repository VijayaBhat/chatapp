//Chat App Started on 3-02-2016, Author: Saikumar Padamati
//load Application main module
var App = angular.module('ChatApp', ['ngRoute']);

//configure Routing For Applicatiion
App.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/login', {
		templateUrl: 'views/login.html'
	})
	.when('/chatRoom', {
		templateUrl: 'views/chatRoom.html'
	})
	.otherwise({'redirectTo': '/login'});
}]);

//Run method For Application.
App.run(['$rootScope', '$location',  function($rootScope, $location){
 	//initialaize any Global/$rootScope Variable
 	$location.path('/login');
 	$rootScope.safeApply = function(fn) {
	  var phase = this.$root.$$phase;
	  if(phase == '$apply' || phase == '$digest') {
	    if(fn && (typeof(fn) === 'function')) {
	      fn();
	    }
	  } else {
	    this.$apply(fn);
	  }
	};

}]);