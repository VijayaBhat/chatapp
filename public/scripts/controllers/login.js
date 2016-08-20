App.controller('LoginCtrl', ['$scope', 'SocketService', function($scope, SocketService){

	$scope.submitUserName = function($event) {
		if( (($event && $event.keyCode === 13) || !$event) && ($scope.userName))  {
			SocketService.userName = $scope.userName;
			SocketService.addUser();
		}
	};	
}]);