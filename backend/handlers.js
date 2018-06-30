var sys = require('sys');
var fs = require('fs');
var $ = require('./tools');

var CommandHandler = function() {
	this.init();
}

/**
 * TODO:
 * 
 * Implement _public_methods: '__all__'
 *
 */



CommandHandler.prototype = {
	commands: {},
	
	init: function() {
		
	},
	
	/**
	 * Registers either an object or a command and a function
	 * The command class needs these attributes:
	 *
	 * _public_name
	 * _public_methods
	 */
	register: function(object, func) {
		if(object.prototype) {
			console.log('registering object ' + object.prototype._public_name);
			this.commands[object.prototype._public_name] = object;
		} else {
			console.log('registering method ' + object);
			this.commands[object] = func;
		}
	},
	
	execute: function(message, __callback) {
		sys.puts(console.log(arguments));
		
		args = [];
		for(i in message['arguments']) {
			args.push(message['arguments'][i]);
		}
		
		message['arguments'] = args;
		
		ca = args[0].split('_');
		handler = ca[0];
		method = ca[1];
		
		name = handler + '_' + method
		sys.puts('Executing handler: ' + handler + ', method: ' + method);
		
		if(!this.commands[handler]) {
			sys.puts('Command ' + handler + '_' + method + ' does not exist.')
			return false;
		}
		
		console.log('prototype ['+handler+']: ' + this.commands[handler].prototype);
		
		message['arguments'].shift();
		
		if(!method) {
			handler = this.commands[handler];
			handler.callback = __callback;
			return handler.apply(handler, message['arguments']);
		}
		
		if(this.commands[handler].prototype) {
			handler = new this.commands[handler];
			handler.callback = __callback;
			return handler[method].apply(handler, message['arguments'][0]);
		}
	}
}

var ch = new CommandHandler();

/*var Test = function(){};
Test.prototype = {
	_public_name: 'test',
	_public_methods: ['test'],
	
	test: function(arg1, arg2){
		return [arg1 + 1, arg2 + 1];
	}
}

ch.register(Test);*/

Function.prototype.bind = function(context){
	if (arguments.length < 2 && arguments[0] == undefined) return this;
	var __method = this, args = Array.prototype.slice.call(arguments, 1);
	return function() {
		var a = $.tools.merge(args, arguments);
		return __method.apply(context, a);
	}
}

var Data = function(){};
Data.prototype = {
	_public_name: 'data',
	_public_methods: ['get', 'set', 'exists', 'wut'],
	
	get: function(key, fdsa, asdf) {
		try {
			fs.statSync(process.cwd() + '/storage/'+key)
		} catch(e) {
			console.log(e);
			console.log('data does not exist');
			return this.callback(null);
		}
		
		fs.readFile(process.cwd() + '/storage/'+key, function (err, data) {
			if (err) return this.callback(null, true);
			data = JSON.parse(data);
			console.log(data)
			return this.callback(data, true);
		}.bind(this));
	},
	
	set: function(key, data) {
		data = JSON.stringify(data);
		handle = fs.open(process.cwd() + '/storage/'+key, 'w+', undefined, function(err, fd){
			console.log('err:' + err);
			fs.write(fd, data, undefined, undefined, undefined, function(err, written){
				fd.close();
			});
		});
		
		return {};
	}, // function(){}.returns('var1', 'var2')
	
	exists: function(key) {
		console.log('Data exists!');
		return true;
	}
};

ch.register(Data);

var Rpc = function(){};
Rpc.prototype = {
	_public_name: 'rpc',
	_public_methods: ['init'],
	
	init: function() {
		command_data = { objects: {}, methods: {} };
		
		for(command in ch.commands) {
			if(ch.commands[command].prototype._public_name) {
				command_data['objects'][command] = ch.commands[command].prototype._public_methods;
			} else {
				command_data['methods'][command] = true;
			}
		}
		
		this.callback(command_data, true);
	}
}

ch.register(Rpc);

ch.register('ping', function(timestamp) {
	this.callback(new Date().getTime() - timestamp);
});

ch.register('tools_getResourceMap', function(data) {
	this.callback({"tools":["dirt_tile_01.png","grass_tile_01.png","grassdirt_cornerconc01.png","grassdirt_cornerconc02.png","grassdirt_cornerconc03.png","grassdirt_cornerconc04.png","grassdirt_cornerconv01.png","grassdirt_cornerconv02.png","grassdirt_cornerconv03.png","grassdirt_cornerconv04.png","pavedirt_cornerconc01.png","pavedirt_cornerconc02.png","pavedirt_cornerconc03.png","pavedirt_cornerconc04.png","pavedirt_cornerconv01.png","pavedirt_cornerconv02.png","pavedirt_cornerconv03.png","pavedirt_cornerconv04.png"]});
});

function in_array(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

var Main = function(){};
Main.prototype = {
	_public_name: 'main',
	_public_methods: ['loadManifest', 'getAppdef', 'authenticate'],
	
	skip: [
		'.svn', '__manifest.js', 'backend.js', '__settings.js', 'ai_scripts',
		'socket.io.js'
	],
	
	authenticate: function(user, pass) {
		console.log('logging in user ' + user + ' pass ' + pass);
		this.callback(true, false);
	},
	
	__readAppDir: function(app) {
		
	},
	
	loadManifest: function() {
		output = {
			libraries: [],
			application: { name: 'builder' }
		};
		files = fs.readdirSync(process.cwd() + '/js/');
		
		for(i in files) {
			if(!in_array(files[i],this.skip)) {
				output.libraries.push(files[i]);
			}
		}
		
		this.callback(output);
	},
	
	getAppdef: function(data) {
		this.callback({"files":["menubuilder.js","gridbuilder.js","__init__.js"]});
	}
};

ch.register(Main);

exports.execute = function (name, data) {
	return ch.execute(name, data);
}