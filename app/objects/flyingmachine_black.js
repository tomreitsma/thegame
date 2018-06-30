flyingmachine_black = function(){};
flyingmachine_black.prototype = {
    src:'Black_flying_machine.png',
    pos_x: 50,
    pos_y: 50,
    direction: false,
    moving: false, 
    initialized: false,
    moveStep: 50,
    following: true,
    
    sprites: new Spritesheet({
        width: 64,
        height: 100,
        sprites: {
            down_1: { x: 0, y: 0 },
            down_2: { x: 0, y: 0 },
            down_3: { x: 0, y: 0 },
            down_4: { x: 0, y: 0 },
            
            left_1: { x: 0, y: 100 },
            left_2: { x: 0, y: 100 },
            left_3: { x: 0, y: 100 },
            left_4: { x: 0, y: 100 },
            
            right_1: { x: 0, y: 200 },
            right_2: { x: 0, y: 200 },
            right_3: { x: 0, y: 200 },
            right_4: { x: 0, y: 200 },
            
            up_1: { x: 0, y: 300 },
            up_2: { x: 0, y: 300 },
            up_3: { x: 0, y: 300 },
            up_4: { x: 0, y: 300 }
        }
    }),
    
    init: function(canvas){
        this.canvas = canvas;
        
        this.direction = 'down';
        this.animation = this.getAnimation(this.direction);
        
        this.movementAnimation = new Animation([{time:1}], undefined);
        
        // See if we can actually GET a context/scope from a given function
        // E.g.: context = getScope(Blaat.fdsa)
        // SOOOOLVED! Function.bind!
        main.keyhandler.addListener(main.keyhandler.KEY_UP, this.move.bind(this));
        main.keyhandler.addListener(main.keyhandler.KEY_LEFT, this.move.bind(this));
        main.keyhandler.addListener(main.keyhandler.KEY_RIGHT, this.move.bind(this));
        main.keyhandler.addListener(main.keyhandler.KEY_DOWN, this.move.bind(this));
        this.initialized = true;
        
        // REMOVEME
        main.nais.attachScript(this, 'path', args = {
            coords: [0, 20, 50],
            stepTime: 1
        });
        
        this.pos_x = 350;//__app.canvas.width / 2;
        this.pos_y = 300//__app.canvas.height / 2;
    },
    
    draw: function() {
        /*this.movementAnimation.animate();
        if(!this.movementAnimation.getNextFrame()) {
            return true;
        }*/
        
        if(this.moving) {
            if(collision = main.boundary.hasCollided(this)) {
                
            }
            
            switch(this.direction) {
                case 'up':
                    if(!this.following) this.pos_y -= this.moveStep
                    __app.maphandler.setViewportOffsetY(__app.maphandler.viewport_offset_y + this.moveStep);
                    break;
                case 'down':
                    if(!this.following) this.pos_y += this.moveStep;
                    __app.maphandler.setViewportOffsetY(__app.maphandler.viewport_offset_y - this.moveStep);
                    break;
                case 'right':
                    if(!this.following) this.pos_x += this.moveStep;
                    __app.maphandler.setViewportOffsetX(__app.maphandler.viewport_offset_x - this.moveStep);
                    break;
                case 'left':
                    if(!this.following) this.pos_x -= this.moveStep;
                    __app.maphandler.setViewportOffsetX(__app.maphandler.viewport_offset_x + this.moveStep);
                    break;
                default:
                    //console.log('direction not set');
            }
        }
    },
    
    getAnimation: function(direction) {
        animation = new Animation([
            { sprite: direction + '_1', time: 0.1 },
            { sprite: direction + '_2', time: 0.1 },
            { sprite: direction + '_3', time: 0.1 },
            { sprite: direction + '_4', time: 0.1 },
        ], this.sprites);
        return animation;
    },
    
    move: function(event, updown) {
        if(updown == keyhandler.EVENT_KEY_UP) {
            this.moving = false;
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
        
        this.animation = this.getAnimation(this.direction);
    }
}
