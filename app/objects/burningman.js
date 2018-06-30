burningman = function(){};
burningman.prototype = {
    src:'burning-763398.png',
    pos_x: 200,
    pos_y: 200,
    direction: false,
    moving: false, 
    initialized: false,
    moveStep: 10,
    
    sprites: new Spritesheet({
        width: 67,
        height: 64,
        x_offset: undefined,
        sprites: [
            { name: 'frame_1', x: 0, y: 0 },
            { name: 'frame_2', x: 1, y: 0 },
            { name: 'frame_3', x: 2, y: 0 },
            { name: 'frame_4', x: 3, y: 0 },
            { name: 'frame_5', x: 4, y: 0 },
            { name: 'frame_6', x: 5, y: 0 },
            { name: 'frame_7', x: 6, y: 0 },
            
            { name: 'frame_8', x: 0, y: 2 },
            { name: 'frame_9', x: 1, y: 2 },
            { name: 'frame_10', x: 2, y: 2 },
            { name: 'frame_11', x: 3, y: 2 },
            { name: 'frame_12', x: 4, y: 2 },
            { name: 'frame_13', x: 5, y: 2 },
            { name: 'frame_14', x: 6, y: 2 },
            
            { name: 'up_1', x: 0, y: 3 },
            { name: 'up_2', x: 0, y: 3 },
            { name: 'up_3', x: 0, y: 3 },
            { name: 'up_4', x: 0, y: 3 },
        ]
    }),
    
    init: function(canvas){
        this.canvas = canvas;
        
        this.direction = 'right';
        this.animation = this.getAnimation(this.direction);
        this.initialized = true;
    },
    
    draw: function() {
        // this page left blank intentionally
    },
    
    getAnimation: function(direction) {
        return new Animation([
            { sprite: 'frame_1', time: 0.1 },
            { sprite: 'frame_2', time: 0.1 },
            { sprite: 'frame_3', time: 0.1 },
            { sprite: 'frame_4', time: 0.1 },
            { sprite: 'frame_5', time: 0.1 },
            { sprite: 'frame_6', time: 0.1 },
            { sprite: 'frame_7', time: 0.1 },
            { sprite: 'frame_8', time: 0.1 },
            { sprite: 'frame_9', time: 0.1 },
            { sprite: 'frame_10', time: 0.1 },
            { sprite: 'frame_11', time: 0.1 },
            { sprite: 'frame_12', time: 0.1 },
            { sprite: 'frame_13', time: 0.1 },
            { sprite: 'frame_14', time: 0.1 },
        ], this.sprites);
    },
}