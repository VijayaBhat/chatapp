App.controller('ChatRoomCtrl', ['$scope', 'SocketService', '$rootScope', function($scope, SocketService, $rootScope) {
	$scope.socket = SocketService;
	$scope.arrMsg = [];

	//once you successfully logged in, you will get response from server socket
	$scope.userLogin = function(){
		$scope.arrMsg.push({
			type : 'notification',
			msg  : 'Welcome...' + SocketService.userName + '..there are...' + (SocketService.numUsers === 1 ? '..no other' :  SocketService.numUsers) + '..particpants' 
		});
		// console.log($scope.arrMsg) 
	};

	$scope.$on('joinOtherPerson' , function(event, args) {
		// console.log(event, args)
		$scope.arrMsg.push({
			type : 'notification',
			msg  : args.data.username + 'Joined to chat' + args.data.numUsers + 'of particpants' 
		});
	});

	$scope.$on('messageSent', function(event, args){
		$scope.arrMsg.push({
			type : 'user-message',
			msg  : args.data.msg,
			user : 'You : '
		});
	});

	$scope.$on('newMessage', function(event, args) {
		$scope.arrMsg.push({
			type : 'other-user-message',
			msg  : args.data.msg,
			user : args.data.username + ': '
		});
	});

	$scope.sendMessage = function($event) {
		// console.log((($event && $event.keyCode === 13) || !$event) ,($scope.currentMessage));
		if( (($event && $event.keyCode === 13) || !$event) && ($scope.currentMessage))  {
			SocketService.sendMessage($scope.currentMessage);
			$scope.currentMessage = '';
		}
	};

	$scope.userLogin();
}]);