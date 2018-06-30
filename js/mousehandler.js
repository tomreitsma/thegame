mousehandler = {
    // TODO:
    // Rewrite this. This is crap.
    
    // Set up key bindings
    CLICK_LEFT: 0,
    CLICK_RIGHT: 2,
    
    // Event codes
    EVENT_CLICK_LEFT: 0,
    EVENT_CLICK_RIGHT: 2,
    EVENT_MOUSEMOVE: 999,
    
    EVENT_UP: 'EVENT_UP',
    EVENT_DOWN: 'EVENT_DOWN',
    
    listeners: {},
    
    init: function(){
        var __mousehandler = this;
        
        // Set up hooks
        document.onmousedown = function(event) {
            main.mousehandler.onmousedown(event);
        };
        
        document.onmouseup = function(event) {
            main.mousehandler.onmouseup(event);
        }
        
        document.onmousemove = function(event) {
            main.mousehandler.onmousemove(event);
        };
        
        document.oncontextmenu = function(event) {
            //return false;
        }
        
        /*$.extendObject(this, main.keyhandler, {
            keys: ['addListener'],
            allowOverride: false
        });*/
        
        
    },
    
    addListener: function(buttoncode, scope, callback, options) {
        if(this.listeners[buttoncode]) {
            return false;
        }
        
        this.listeners[buttoncode] = {scope:scope, callback:callback};
    },
    
    removeListener: function(buttonCode) {
        this.listeners[buttonCode] = null;
    },
    
    onmousedown: function(event) {
        if(this.listeners[event.button]) {
            this.listeners[event.button].callback.apply(this.listeners[event.button].scope, [event, this.EVENT_DOWN]);
        }
    },
    
    onmouseup: function(event) {
        if(this.listeners[event.button]) {
            this.listeners[event.button].callback.apply(this.listeners[event.button].scope, [event, this.EVENT_UP]);
        }
    },
    
    onmousemove: function(event) {
        if(this.listeners[this.EVENT_MOUSEMOVE]) {
            this.listeners[this.EVENT_MOUSEMOVE].callback.apply(this.listeners[this.EVENT_MOUSEMOVE].scope, [event, this.EVENT_MOUSEMOVE]);
        }
    },
}