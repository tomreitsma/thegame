maphandler = {
    viewport_offset_x: null,
    viewport_offset_y: null,
    
    map: {
        id: 1,
        tile_height: 40,
        tile_width: 40,
        
        resource_map: {
			1: 'dirt_tile_01.png',
			2: 'grass_tile_01.png',
			3: 'grassdirt_cornerconc01.png',
			4: 'grassdirt_cornerconc02.png',
			5: 'grassdirt_cornerconc03.png',
			6: 'grassdirt_cornerconc04.png',
			7: 'grassdirt_cornerconv01.png',
			8: 'grassdirt_cornerconv02.png',
			9: 'grassdirt_cornerconv03.png',
			10: 'grassdirt_cornerconv04.png',
			11: 'deco_bush_square01.png',
			12: 'deco_bush_square02.png'
		},
        
        floaters: [
            
        ]
    },
    
    viewport: {
        
    },
    
    init: function() {
		backend.rpc.data.get('test_mapdata').addCallback(function(map_data){
			//this.map.tiles = map_data;
			
			this.map = map_data;
			
			/*backend.rpc.data.get('test_floaters').addCallback(function(floaters){
				this.map.floaters = floaters;
			}.bind(this));*/
		}.bind(this));
		
		main.http.eval('app/objects/flyingmachine_black.js', {noCache: true});
        main.http.eval('app/objects/footman_red.js', {noCache: true});
        main.http.eval('app/objects/burningman.js', {noCache: true});
        
        this.mapFloaters = [
            new flyingmachine_black(),
        ];
		
		/*for(i=0; i<20; i++) {
            for(i2=0; i2<20; i2++) {
                fm = new footman_red();
                fm.pos_x = i2*50;
                fm.pos_y = i *50;
                this.mapFloaters.push(fm);
            }
        }*/
		
        this.viewport_offset_x = 200;
        this.viewport_offset_y = 10;
        this.viewport_max_x = __app.canvas.width;
        this.viewport_max_y = __app.canvas.height;
        
        main.keyhandler.addListener(main.keyhandler.KEY_UP, this.move.bind(this));
        main.keyhandler.addListener(main.keyhandler.KEY_LEFT, this.move.bind(this));
        main.keyhandler.addListener(main.keyhandler.KEY_RIGHT, this.move.bind(this));
        main.keyhandler.addListener(main.keyhandler.KEY_DOWN, this.move.bind(this));
    },
    
    move: function(event, updown) {
        if(updown == keyhandler.EVENT_KEY_UP) {
            this.moving = false;
        }
        
        if(updown == keyhandler.EVENT_KEY_DOWN) {
            this.moving = true;
            switch(event.keyCode) {
                case main.keyhandler.KEY_UP:
                    this.viewport_offset_y += 40;
                    this.addTiles([
                        { id: 5, resource_id: 1, x: 0, y: -(this.viewport_offset_y / 40) },
                        { id: 5, resource_id: 1, x: 1, y: -(this.viewport_offset_y / 40) },
                        { id: 5, resource_id: 1, x: 2, y: -(this.viewport_offset_y / 40) },
                        { id: 5, resource_id: 1, x: 3, y: -(this.viewport_offset_y / 40) },
                        { id: 5, resource_id: 1, x: 4, y: -(this.viewport_offset_y / 40) },
                        { id: 5, resource_id: 1, x: 5, y: -(this.viewport_offset_y / 40) }
                    ]);
                    break;
                case main.keyhandler.KEY_LEFT:
                    this.viewport_offset_x += 40;
                    this.addTiles([
                        { id: 5, resource_id: 1, x: -(this.viewport_offset_x / 40), y: 0 },
                        { id: 5, resource_id: 1, x: -(this.viewport_offset_x / 40), y: 1 },
                        { id: 5, resource_id: 1, x: -(this.viewport_offset_x / 40), y: 2 },
                        { id: 5, resource_id: 1, x: -(this.viewport_offset_x / 40), y: 3 },
                        { id: 5, resource_id: 1, x: -(this.viewport_offset_x / 40), y: 4 },
                        { id: 5, resource_id: 1, x: -(this.viewport_offset_x / 40), y: 5 }
                    ]);
                    break;
                case main.keyhandler.KEY_RIGHT:
                    this.viewport_offset_x -= 40;
                    break;
                case main.keyhandler.KEY_DOWN:
                    this.viewport_offset_y -= 40;
                    break;
                case main.keyhandler.KEY_SPACE:
                    this.direction = 'stationary';
                    break;
            }
        }
        
        if(this.viewport_offset_x < 0) {
            this.getTiles(this.viewport_offset_x, this.viewport_offset_y, this.viewport_offset_y + __app.canvas.height);
        }
    },
    
    addTiles: function(tiles) {
        tools.each(tiles, function(tile){
            this.push(tile);
        }.bind(this.map.tiles));
    },
    
	/*
	 * To be implemented
	 */
    within_viewport: function(object) {
        return true;
    },
    
    getTiles: function(tl_x, tr_x, b_y) {
        mapdata = backend.call('maphandler_getChunk', {
            tl_x: tl_x,
            tr_x: tr_x,
            b_y: b_y
        });
    },
    
    // draw is called from __app.draw(), where the main loop is running
    draw: function(frameTimer) {
		tools.each(this.mapFloaters, function(object){
            var obj = object;
            if(obj.initialized) {
                animation = obj.animation;
                animation.animate(frameTimer.getSeconds());
                frame = animation.getSprite();
                
                obj.draw();
                
                if(!obj._image) {
                    obj._image = image.load(obj.src);
                } else {
                    this.canvas.drawImage(
                        obj._image,
                        frame.x,
                        frame.y,
                        obj.sprites._width,
                        obj.sprites._height,
                        obj.pos_x, 
                        obj.pos_y,
                        obj.sprites._width,
                        obj.sprites._height
                    );
                    
                    // Draw selection square
                    if(obj.selected) {
                        this.canvas.fillRect (
                            obj.pos_x,
                            obj.pos_y,
                            obj.sprites._width,
                            obj.sprites._height
                        );
                        
                        /*__app.ctx.beginPath();
                        __app.ctx.arc(obj.pos_x, obj.pos_y, 20, 0, Math.PI*2, true);
                        __app.ctx.closePath();
                        __app.ctx.stroke()*/
                    }
                }
            } else {
                obj.init(this.canvas);
                //this.mapFloaters[object].initialized = true;
            }
        }.bind(this));
		
        tools.each(this.map.tiles, function(object){
            if(!this.within_viewport(object)) return true;
            if(!(object.resource_id > 0)) return true;
            
            img = image.load(this.map.resource_map[object.resource_id]);
            
            x = (object.x * this.map.tile_width) + this.viewport_offset_x;
            y = (object.y * this.map.tile_height) + this.viewport_offset_y;
            
            this.canvas.drawImage(img, x, y);
        }.bind(this));
    }
};