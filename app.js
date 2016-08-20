var express = require('express'),
	open = require('open'),
	app  = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
  serveStatic = require('serve-static');

// global.app = express().createServer();
// global.io  = require('http').createServer(global.app);



app.use(serveStatic('public', {'index': ['index.html']}));
server.listen(3000);
open("http://localhost:3000");


var numberOfUsers = 0;
io.on('connect', function(socket) {
	var userAdded = false;
	socket.on('addUser', function (data) {
		if(userAdded) return;
	 
		socket.username = data.username;
		userAdded = true;
		++numberOfUsers;
		socket.emit('loginSuccess', {
		  numUsers : numberOfUsers 
		});

		socket.broadcast.emit('joinuser', {
			username: socket.username,
			numUsers: numberOfUsers
		});
	});

	socket.on('newMessage', function(data){

		socket.emit('messageSent', {msg : data});
		
		socket.broadcast.emit('newMessage', {
			username : socket.username,
			msg : data
		});
	});

	socket.on('disconnect', function(){
		if(userAdded){
			--numberOfUsers;
		}
	});
});








