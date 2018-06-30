Projectile = function(args) { this.id = Math.random(); this.initialize(); }
Projectile.prototype = {
    pos_x: 50,
    pos_y: 50,
    movement_speed: 1, // px per 50 ms
    interval_speed: 50,
    
    // 10 seconds total
    
    initialize: function() {
        this.frametimer = new Frametimer();
        this.move();
        
        setInterval(function(){
            this.pos_x += this.movement_speed;
            this.move();
        }.bind(this), this.interval_speed);
    },
    
    move: function() {
        this.frametimer.tick();
        
        __app.executeStack.push({
            func: function(){
                //__app.ctx.fillStyle = "rgba(0, 200, 50, 0.5)";
                __app.ctx.fillRect (
                    this.pos_x,
                    this.pos_y,
                    10,
                    10
                );
            }.bind(this),
            args: []
        });
    }
}
