Frametimer = function() {
    this._lastTick = (new Date()).getTime();
}

Frametimer.prototype = {
    getSeconds: function() {
        var seconds = this._frameSpacing / 1000;
        if(isNaN(seconds)) {
            return 0;
        }
 
        return seconds;
    },
 
    tick: function() {
        var currentTick = (new Date()).getTime();
        this._frameSpacing = currentTick - this._lastTick;
        this._lastTick = currentTick;
    },
    
    getDelta: function() {
        return this._frameSpacing;
    }
}