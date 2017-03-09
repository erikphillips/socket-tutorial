var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

var clients = 0;

io.on('connection', function(socket) {
	console.log("A user connected");

	clients++;

	io.sockets.emit('broadcast', { description: clients + ' clients connected.' });

	socket.emit('newclientconnect',{ description: 'Hey, welcome!'});
	socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})

	setTimeout(function () {
		// This can be used to send a message via socket - not very useful
		// socket.send('Sent a message 4 seconds after connection!');
		// socket.emit('testerEvent', { description: 'A custom event named testerEvent!' });
	}, 4000);

	socket.on('disconnect', function () {
		clients--;
		io.sockets.emit('broadcast', { description: clients + ' clients connected.' });
		console.log("A user disconnected");
	});

	socket.on('clientEvent', function ( data ) {
		console.log(data);
  	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
