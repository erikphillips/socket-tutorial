var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

var clients = 0;
var roomno = 1;

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

	//Increase roomno 2 clients are present in a room.
  	if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1)
    	roomno++;
  	socket.join("room-"+roomno);

	//Send this event to everyone in the room.
	io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);

});

var nsp = io.of('/my-namespace');
nsp.on('connection', function (socket) {
	console.log('someone connected to namespace');
	nsp.emit('hi', 'Hello, Everyone!');
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});
