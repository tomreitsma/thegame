var fdsa = {
    wut:'test'
}

/**
 *
 * TODO:
 *
 * Eventhandler for serverside events.
 *
 * backend.addListener(<str event>, <func callback>);
 * 
 */

backend = {
    _callbacks: {},
    method: 'GET',    
    
    init: function() {
        try {
            this.ws_enabled = true;
            var host = "ws://localhost:8080";
            
            var socket = io.connect('ws://localhost:8080');
            this.socket = socket;
            
            socket.on('connect', function () {
                backend.ws_open = true;
                this.connectionEstablished();
            }.bind(this));
            
            socket.on('message', function (msg) {
                console.dir({gotmessage:msg});
                _data = JSON.parse(msg);
                
                if(callback = this._callbacks[_data.request_id]) {
                    args = _data.args;
                    
                    callback.apply(callback, args);
                }
            }.bind(this));
            
            /*try {
                this.socket = new WebSocket(host);
            } catch (e) {
                console.log('falling back on MozWebSocket');
                this.socket = new MozWebSocket(host);
            }
            
            socket = this.socket;*/
            
            /*this.socket.onopen = function(){
                backend.ws_open = true;
                
                this.connectionEstablished();
            }.bind(this);*/
            
            
            
            /*backend.socket.onmessage = function(msg){
                _data = JSON.parse(msg.data);
                
                if(callback = this._callbacks[_data.request_id]) {
                    args = _data.args;
                    
                    callback.apply(callback, args);
                }
            }.bind(this);*/
            
            this.socket.onclose = function(){  
                console.log('Socket Status: '+this.socket.readyState+' (Closed)');  
            }.bind(this);
            
            this.socket.onerror = function(fdsa) {
                console.dir({error:fdsa});
            }
            
            this.socket = socket;
        } catch(e) {
            console.log('ERROR!!!')
            console.log(e)
        }
        
        return {
            addCallback: function(callback) {
                this._init_callback = callback;
            }.bind(this)
        }
    },
    
    connectionEstablished: function() {
        this.call('rpc_init', 'fdsa').addCallback(function(data){
            backend.rpc = {};
            
            for(object in data['objects']) {
                backend.rpc[object] = {};
                for(method in data['objects'][object]) {
                    method = data['objects'][object][method];
                    backend.rpc[object][method] = function(object, method) {
                        fargs = Array.prototype.slice.call(arguments, 2);
                        
                        return this.call.apply(this, [object+'_'+method, fargs]);
                    }.bind(this, object, method);
                }
            }
            
            f=function(methods) {
                for(_method in methods) {
                    this.rpc[_method] = function(_method) {
                        arguments = Array.prototype.slice.call(arguments, 1);
                        return this.call.apply(this, $.update([_method], arguments));
                    }.bind(this, _method);
                }
            }.bind(this)(data['methods']);
            
            ping = function() {
                this.rpc.ping(new Date().getTime()).addCallback(function(pong, wut){
                    //console.dir({pong: pong, wut: wut});
                });
                setTimeout(ping, 60000);
            }.bind(this);
            ping();
            
            if(this._init_callback) 
                this._init_callback();
        }.bind(this));
    },
    
    _write: function() {
        data = {arguments: arguments};
        data.request_id = tools.randomString(20);
        data.timestamp = new Date().getTime();
        
        this.socket.send(JSON.stringify(data));
        
        return {
            addCallback: function(func) {
                this._callbacks[data.request_id] = func;
            }.bind(this)
        };
    },
    
    call: function(ca, args) {
        if(backend.ws_open == true) {
            if(!(typeof args == typeof [])) {
                args = [args]
            }
            
            a = [ca];
            if(args)
                a.push(args);
            
            return this._write.apply(this, a);
        } else {
            console.log(ca +': nope');
        }
    }
}
