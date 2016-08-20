App.factory('SocketService', ['$rootScope', '$location',  function($rootScope, $location){
	var SocketService = io(); 
	// SocketService = null;
	SocketService.addUser = function() {
		SocketService.emit('addUser', {username: SocketService.userName})
	};

	SocketService.on('loginSuccess', function(data) {
		console.log(data);
		SocketService.numUsers = data.numUsers;
		SocketService.redirectToChatRoom();
		// $rootScope.$broadcast('userLogin', {data : data});
	});

	SocketService.on('joinuser', function(data){
		$rootScope.$broadcast('joinOtherPerson', {data: data});
		$rootScope.safeApply();	
	});

	SocketService.on('messageSent', function(data){
		$rootScope.$broadcast('messageSent', {data: data});
		$rootScope.safeApply();	
	});

	SocketService.on('newMessage', function(data) {
		$rootScope.$broadcast('newMessage', {data: data});
		$rootScope.safeApply();	
	});

	SocketService.redirectToChatRoom = function() {
		$location.path('/chatRoom');
		$rootScope.safeApply();
	};

	SocketService.sendMessage = function(data) {
		SocketService.emit('newMessage', data);
	};

	return SocketService;
}]);