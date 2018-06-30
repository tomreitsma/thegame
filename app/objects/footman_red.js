footman_red = function(){};
footman_red.prototype = {
    src:'app/images/Fighter%20red.png',
    pos_x: 50,
    pos_y: 50,
    direction: false,
    moving: false, 
    initialized: false,
    moveStep: 10,
    oldDirectionData: {},
    
    sprites: new Spritesheet({
        width: 50,
        height: 50,
        sprites: {
            down_1: { x: 0, y: 0 },
            down_2: { x: 0, y: 0 },
            down_3: { x: 0, y: 0 },
            down_4: { x: 0, y: 0 }
        }
    }),
    
    init: function(canvas){
        this.canvas = canvas;
        
        this.direction = 'down';
        this.animation = this.getAnimation(this.direction);
        
        // See if we can actually GET a context/scope from a given function
        // E.g.: context = getScope(Blaat.fdsa)
        main.keyhandler.addListener(main.keyhandler.KEY_UP, this.move);
        main.keyhandler.addListener(main.keyhandler.KEY_LEFT, this.move);
        main.keyhandler.addListener(main.keyhandler.KEY_RIGHT, this.move);
        main.keyhandler.addListener(main.keyhandler.KEY_DOWN, this.move);
        this.initialized = true;
    },
    
    draw: function() {
        if(this.moving) {
            switch(this.direction) {
                case 'up':
                    this.pos_y -= this.moveStep;
                    break;
                case 'down':
                    this.pos_y += this.moveStep;
                    break;
                case 'right':
                    this.pos_x += this.moveStep;
                    break;
                case 'left':
                    this.pos_x -= this.moveStep;
                    break;
                default:
                    //console.log('direction not set');
            }
        }
    },
    
    getAnimation: function(direction) {
        if(this.oldDirectionData.direction == direction) {
            return this.oldDirectionData.animation;
        }
        
        animation = new Animation([
            { sprite: direction + '_1', time: 0.1 },
            { sprite: direction + '_2', time: 0.1 },
            { sprite: direction + '_3', time: 0.1 },
            { sprite: direction + '_4', time: 0.1 },
        ], this.sprites);
        
        this.oldDirectionData = { animation:animation, direction:direction };
        return animation;
    },
    
    move: function(event, updown) {
        if(updown == keyhandler.EVENT_KEY_UP) {
            this.moving = false;
            this.animation = this.getAnimation('stationary');
        }
        
        if(updown == keyhandler.EVENT_KEY_DOWN) {
            this.moving = true;
            switch(event.keyCode) {
                case main.keyhandler.KEY_UP:
                    this.direction = 'up';
                    break;
                case main.keyhandler.KEY_LEFT:
                    this.direction = 'left';
                    break;
                case main.keyhandler.KEY_RIGHT:
                    this.direction = 'right';
                    break;
                case main.keyhandler.KEY_DOWN:
                    this.direction = 'down';
                    break;
                case main.keyhandler.KEY_SPACE:
                    this.direction = 'stationary';
                    break;
            }
        }
    }
}