__app = {
    media_path: 'app/images/',
    stylesheet: 'app/styles/default.css',
    
    /**
     * In between renders this will be executed.
     * 
     * Usage:
     *
     * __app.executeStack.push({
     *     func: function(str) { alert(str); },
     *     args: [ str='test!' ]
     * })
     */
    executeStack: {
        pointer: 0,
        stack: {},
        remove: function(id) { delete __app.executeStack.stack[id] },
        push: function(object) { __app.executeStack.pointer++; __app.executeStack.stack[__app.pointer] = object; },
        handle: function() {
            for(executable in __app.executeStack.stack) {
                __app.executeStack.stack[executable].func.apply(__app, __app.executeStack.stack[executable].args);
                if(!__app.dragging) delete __app.executeStack.stack[executable];
            }
        }
    },
    
    __init: function(main) {
        this.main = main;
        this.load();
        
        main.loadCSS(this.stylesheet);
    },
    
    _loadExclude: ['images', 'maphandler'],
    load: function() {
        this.canvas = $.createElement('canvas');
        this.canvas.id = 'main_canvas';
        this.width = this.canvas.width = window.innerWidth - 8;
        this.height = this.canvas.height = window.innerHeight - 8;
        this.images = main.http.eval('app/images.js');
        this.ctx = this.canvas.getContext('2d');
        
        $.html.appendChild(this.canvas);
        
        this.frameTimer = new Frametimer();
        this.frameTimer.tick();
        
        imagehandler.preloadImages(this.media_path, this.images, callback = function(){
            __app.maphandler = main.http.eval('app/maphandler.js');
            __app.maphandler.canvas = __app.ctx;
            __app.maphandler.init();
            __app.loadComplete();
            
            this.__drawInterval = setInterval(function(){ this.draw(); }.bind(this),33);
        }.bind(this));
        console.log('test')
    },
    
    loadComplete: function() {
        main.mousehandler.addListener(main.mousehandler.CLICK_LEFT, this, function(event, type){
            this.handleClick(event, type);
        });
        
        main.mousehandler.addListener(main.mousehandler.EVENT_MOUSEMOVE, this, function(event, type){
            this.onDrag(event, type);
        });
    },
    
    handleClick: function(event, type) {
        if(type == main.mousehandler.EVENT_DOWN) {
            this.dragging = true;
            this.dragging_start_x = event.clientX;
            this.dragging_start_y = event.clientY;
            
            console.dir({start_x: event.clientX, start_y: event.clientY});
            console.dir({floaters:this.maphandler.mapFloaters})
            
            for(index in this.maphandler.mapFloaters) {
                object = this.maphandler.mapFloaters[index];
                //if(object.pos_x > __app.dragging_start_x && object.pos_x - object.sprites._width < event.clientX &&
                //   object.pos_y > __app.dragging_start_y && object.pos_y - object.sprites._height < event.clientY) {
                if(object.pos_x > __app.dragging_start_x && object.pos_x < (__app.dragging_start_x + object.pos_x) &&
                   object.pos_y > __app.dragging_start_y && object.pos_y < (__app.dragging_start_y + object.pos_y)) {
                    object.selected = true;
                }
            }
        } else {
            $.foreach(this.maphandler.mapFloaters, function(object){ object.selected = false; });
            
            if(this.dragging) {
                // Do actual selection
                for(index in this.maphandler.mapFloaters) {
                    object = this.maphandler.mapFloaters[index];
                    //if(object.pos_x > __app.dragging_start_x && object.pos_x - object.sprites._width < event.clientX &&
                    //   object.pos_y > __app.dragging_start_y && object.pos_y - object.sprites._height < event.clientY) {
                    if(object.pos_x > __app.dragging_start_x && object.pos_x < event.clientX &&
                       object.pos_y > __app.dragging_start_y && object.pos_y < event.clientY) {
                        object.selected = true;
                    }
                }
            }
            
            this.dragging = false;
        }
    },
    
    onDrag: function(event) {
        if(!this.dragging) return false;
        
        this.executeStack.push({func: function(event){
            this.ctx.fillStyle = "rgba(55, 55, 55, 0.5)";
            this.ctx.fillRect (
                this.dragging_start_x,
                this.dragging_start_y,
                event.clientX - this.dragging_start_x,
                event.clientY - this.dragging_start_y
            );
            
            this.ctx.fillStyle = "rgba(100, 200, 50, 1.5)";
            
            this.ctx.strokeRect (
                this.dragging_start_x,
                this.dragging_start_y,
                event.clientX - this.dragging_start_x,
                event.clientY - this.dragging_start_y
            );
            
        }.bind(this), args: [event]});
    },
    
    draw: function() {
        var ctx = this.ctx;
        
        ctx.globalCompositeOperation = 'destination-over';
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.save();
        
        this.executeStack.handle();
        
        this.maphandler.draw(this.frameTimer);
        this.frameTimer.tick();
    },
    
    _unload: function() {
        clearInterval(this.__drawInterval);
        $.html.removeChild(this.canvas);
        main.mousehandler.removeListener(main.mousehandler.EVENT_MOUSEMOVE);
        main.mousehandler.removeListener(main.mousehandler.CLICK_LEFT);
    }
}
