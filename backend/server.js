var handlers = require('./handlers');
var sys = require("sys");
var util = require('util');

var io = require('socket.io').listen(8080);

_callbacks = {};

io.sockets.on('connection', function (socket) {
    socket.on('message', function (msg) {
        message = JSON.parse(msg);
        
        data = handlers.execute(message, function() {
            _args = [];
            for(i in arguments) 
                _args.push(arguments[i]);
            
            result = {
                args: _args,
                request_id: message.request_id
            };
            
            socket.send(JSON.stringify(result));
        });
    });
    
    socket.on('disconnect', function () {
        
    });
});