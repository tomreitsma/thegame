/**
 * TODO:
 *
 * Throw this out. Need to replace this with something more sensible and abstract.
 * Something like a core event handler that can define event areas or subscribe to
 * registered objects
 */

eventhandler = function(field) { this.init2(field); }
eventhandler.prototype = {
    _subscriptions: {},
    events: [
        'onkeydown',
        'onmousedown',
        'onmouseup',
        'onmousemove',
        'onkeyup',
        'onchange',
        'oncontextmenu',
        'onblur',
        'onfocus',
        'onclick',
        'onsubmit'
    ],
    
    init2: function(field) {
        this._subscriptions = {};
        this.field = field; 
        //this.field.eventHandler = this;
    },
    
    inject: function(event) {
        this.field[event] = function(e) {
            return this.notify(event, e);
        }.bind(this);
    },
    
    notify: function(name, event) {
        if(this._subscriptions[name]) {
            for(i in this._subscriptions[name]) {
                if($.isFunction(callback = this._subscriptions[name][i])) {
                    if(callback(event) === false) return false;
                }
            };
        }
    },
    
    subscribe: function(event, callback) {
        this.inject(event);
        
        if(!this._subscriptions[event]) this._subscriptions[event] = [];
        this._subscriptions[event].push(callback);
    },
    
    unsubscribeAll: function() {
        this._subscriptions = {};
        tools.each(this.events, function(event){
            this.field[event] = null;
            delete this.field[event];
        }.bind(this));
    }
}