keyhandler = {
    KEY_UP: 38,
    KEY_DOWN: 40,
    KEY_LEFT: 37,
    KEY_RIGHT: 39,
    KEY_SPACE: 32,
    KEY_RETURN: 13,
    
    KEY_ANY: 'w00t',
    
    listeners: {},
    
    EVENT_KEY_UP: 'keyup',
    EVENT_KEY_DOWN: 'keydown',
    
    init: function() {
        var __keyhandler = this;
        
        // Set up hooks
        document.onkeydown = function(event){
            main.keyhandler.onKeyDown(event);
        };
        
        document.onkeyup = function(event){
            main.keyhandler.onKeyUp(event);
        };
    },
    
    addListener: function(keycode, callback, options) {
        if(this.listeners[keycode]) {
            return false;
        }
        
        //this.listeners[keycode] = {scope:scope, callback:callback};
        this.listeners[keycode] = callback;
    },
    
    removeListener: function(keycode) {
        delete this.listeners[keycode];
    },
    
    onKeyDown: function(event) {
        if(this.listeners[event.keyCode]) {
            //this.listeners[event.keyCode].callback.apply(this.listeners[event.keyCode].scope, [event, this.EVENT_KEY_DOWN]);
            this.listeners[event.keyCode](event, this.EVENT_KEY_DOWN);
        }
    },
    
    onKeyUp: function(event) {
        if(this.listeners[event.keyCode]) {
            //this.listeners[event.keyCode].callback.apply(this.listeners[event.keyCode].scope, [event, this.EVENT_KEY_UP]);
            //this.listeners[event.keyCode](event, this.EVENT_KEY_UP);
        }
    }
}