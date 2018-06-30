path = function (object, args) { this.init(object, args); };
path.prototype = {
    init: function (object, args) {
        this.object = object;
        this.args = args;
        
        return main.throwException('[NAIS] Path script disabled');
        //this.doThings();
    },
    
    doThings: function() {
        this.object.pos_x += 1;
        this.object.pos_y += 1;
        setTimeout($.hitch(this, function(){
            this.doThings();
        }), 100);
    }
}