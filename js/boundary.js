/*
    TODO:
    Find a more efficient way to parse the boundaries, EG: putting the boundaries in map-parts.
    This way, you can determine if an object is within a boundary region and execute the boundary
    checking more efficiently.
    
    Also, when an actor is moving in a certain direction at a certain speed,
    it should be possible to determine when the collision will occur.
*/

boundary = {
    init: function() {
        this.boundaryData = {
            boundaries: [
                {id:1, x:100, y:100},
                {id:2, x:200, y:100},
                {id:3, x:300, y:100},
                {id:4, x:400, y:100},
                {id:5, x:500, y:100},
                {id:6, x:600, y:100},
                {id:7, x:700, y:100},
                {id:8, x:800, y:100},
                {id:9, x:900, y:100}
            ],
            
            boundaryChunkSize: 1000
        }
    },
    
    attachObject: function(boundary_id, object) {
        if(!$.isFunction(object.trigger)) {
            return main.throwException('Tried to attach boundary object but it didnt have the trigger method implemented');
        }
        
        $.foreach(this.boundaryData.boundaries, function(boundary) {
            if(boundary.id == boundary_id) {
                boundary.object = object;
            }
        });
    },
    
    hasCollided: function(object) {
        for(boundary in this.boundaryData.boundaries) {
            boundary = this.boundaryData.boundaries[boundary];
            if((object.pos_x >= boundary.x) && (object.pos_x <= boundary.x + this.boundaryData.boundaryChunkSize) &&
               (object.pos_y >= boundary.y) && (object.pos_y <= boundary.y + this.boundaryData.boundaryChunkSize)) {
                
                if($.isObject(boundary.object) && $.isFunction(boundary.object.trigger)) {
                    boundary.object.trigger(object, boundary);
                }
                
                return boundary;
            }
        };
        
        return false;
    }
};