// WUT:
// Why is this being overwritten by the Grid class?
gridbuilder = {
	createGrid: function( options ){
		g = new Grid(options);
		
		return g;
	}
};
// END WUT

Grid = function(options){
	Object.extend(this, options);
	this.init(options);
};

Grid.prototype = {
	height: 0,
	width: 0,
	cellsize: 0,
	_cells: {},
	_floaters: {},
	_pointer: 0,
	
	cellClicked: null,
	
	init: function(options){
		if(options.tools) {
			this.tools = options.tools;
		}
		
		/*if(!options.grid){
			this.createGrid();
		} else {
			this._cells = options.grid;
		}*/
		
		this.hook();
	},
	
	createGrid: function() {
		// cells
		for(y = 0; y <= this.height-1; y++) {
			for(x = 0; x <= this.width-1; x++) {
				this._pointer += 1;
				
				o = {
					id: this._pointer,
					cell_x: x, cell_y: y,
					cellsize: this.cellsize,
					innerRender: [] // When rendering cell, this will be called
				};
				
				// TODO:
				// Clean up when not high.
				// Also rename to sensible variables
				_x = x * this.cellsize;
				_xm = _x + this.cellsize;
				_y = y * this.cellsize;
				_ym = _y + this.cellsize;
				
				o._x = _x = this.x + _x;
				o._xm = _xm = this.x + _xm;
				o._y = _y = this.y + _y;
				o._ym = _ym = this.y + _ym;
				
				this._cells[o.id] = o;
			}
		}
	},
	
	hook: function () {
		console.log('hooking eventhandler');
		
		console.dir({eh: this.canvas.onmousedown});
		this.canvas.onmousedown = null;
		console.dir({eh: this.canvas.onmousedown});
		
		e = new eventhandler(this.canvas);
		this.eventhandler = e;
		
		console.dir({})
		
		this.eventhandler.subscribe('onmousedown', function(event) {
			this._clicked = true;
			floaterFound = null;
			
			x_pos = Math.floor(event.pageX - this.canvas.offsetLeft);
			y_pos = Math.floor(event.pageY - this.canvas.offsetTop);
			
			tools.each(this._floaters, function(floater, i){
				if(x_pos >= floater._x && x_pos <= floater._xm &&
				   y_pos >= floater._y && y_pos <= floater._ym) {
					
					this._selectedFloater = i;
					this._floaters[i].clicked = true;
					
					floaterFound = true;
					
					return -1;
				}
			}.bind(this));
			
			if(floaterFound) {
				return true;
			}
			
			tools.each(this._cells, function(cell){
				if(x_pos >= cell._x && x_pos <= cell._xm &&
				   y_pos >= cell._y && y_pos <= cell._ym) {
					if($.isFunction(this.cellClicked)) this.cellClicked(cell);
					
					return -1;
				}
			}.bind(this));
		}.bind(this));
		
		this.eventhandler.subscribe('onmouseup', function(){
			this._clicked = false;
			this._selectedFloater = null;
		}.bind(this));
		
		onmousemove = function(event) {
			if(!this._clicked) return false;
			
			x_pos = Math.floor(event.pageX - this.canvas.offsetLeft);
			y_pos = Math.floor(event.pageY - this.canvas.offsetTop);
			
			if(this._selectedFloater) {
				floater = this._floaters[this._selectedFloater];
				floater._x = x_pos - floater.contents.image.width;
				floater._y = y_pos - floater.contents.image.height;
				floater._xm = x_pos// + floater.contents.image.width;
				floater._ym = y_pos// + floater.contents.image.height;
				
				this._floaters[this._selectedFloater] = floater;
				return true;
			}
			
			tools.each(this._cells, function(cell){
				if(x_pos >= cell._x && x_pos <= cell._xm &&
				   y_pos >= cell._y && y_pos <= cell._ym) {
					if($.isFunction(this.cellClicked)) this.cellClicked(cell);
					
					return -1;
				}
			}.bind(this));
		}.bind(this);
		
		this.eventhandler.subscribe('onmousemove', onmousemove);
		
		/*this.eventhandler.subscribe('oncontextmenu', function(event){
			x_pos = Math.floor(event.pageX); //- this.canvas.offsetLeft);
			y_pos = Math.floor(event.pageY); //- this.canvas.offsetTop);
			
			//cell = this._cells[];
			/*console.log({
				fdsa:Math.floor(y_pos / this.cellsize) * this.width +
					Math.floor(x_pos / this.cellsize)});
			
			tools.each(this._cells, function(cell){
				if(x_pos >= cell._x && x_pos <= cell._xm &&
				   y_pos >= cell._y && y_pos <= cell._ym) {
					if($.isFunction(this.cellRightClicked)) this.cellRightClicked(cell);
					
					return -1;
				}
			}.bind(this));
			
			return false;
		}.bind(this));*/
	},
	
	unhook: function() {
		this.eventhandler.unsubscribeAll();
	},
	
	setCell: function(cell) {
		this._cells[cell.id] = cell;
	},
	
	save: function() {
		console.dir({savinggrid: this._cells});
		for(i in this._cells) {
			if(this._cells[i].contents && this._cells[i].contents.image) {
				this._cells[i].contents.image = this._cells[i].contents.image.src;
			}
		}
		
		backend.rpc.data.set('test_cells', JSON.stringify(this._cells));
		
		for(i in this._floaters) {
			if(this._floaters[i].contents && this._floaters[i].contents.image) {
				this._floaters[i].contents.image = this._floaters[i].contents.image.src;
			}
		}
		
		backend.rpc.data.set('test_floaters', JSON.stringify(this._floaters));
	},
	
	render: function() {
		ctx = this.canvas.ctx;
		
		// box
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x, (this.height * this.cellsize) + this.y);
		ctx.lineTo((this.height * this.cellsize) +
				   this.x, (this.height * this.cellsize) + this.y);
		ctx.lineTo((this.height * this.cellsize) + this.x, this.y);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();
		
		// Draw floaters first
		tools.each(this._floaters, function(floater) {
			if(floater.contents && floater.contents.image) {
				try {
					ctx.drawImage(floater.contents.image, floater._x, floater._y);
				} catch (e) {
					main.throwException('Failed drawing image');
					clearInterval(builder.__drawInterval);
				}
			} /*else {
				ctx.fillStyle = "rgba(0, 200, 50, 0.5)";
				ctx.fillRect(cell._x + 1, cell._y + 1, cell.cellsize - 2, cell.cellsize - 2);
			}*/
		}.bind(this));
		
		tools.each(this._cells, function(cell) {
			ctx.beginPath();
			
			ctx.moveTo(cell._x, cell._y);
			ctx.lineTo(cell._x, cell._ym);
			ctx.lineTo(cell._xm, cell._ym);
			ctx.lineTo(cell._xm, cell._y);
			ctx.lineTo(cell._x, cell._y);
			ctx.stroke();
			
			if(cell.innerRender && cell.innerRender.length > 0) {
				tools.each(cell.innerRender, function(f) { f(); }.bind(this));
			}
			
			if(cell.contents && cell.contents.image) {
				try {
					ctx.drawImage(cell.contents.image, cell._x, cell._y);
				} catch (e) {
					main.throwException('Failed drawing image');
					clearInterval(builder.__drawInterval);
					
					main.quit();
				}
				
			} /*else {
				ctx.fillStyle = "rgba(0, 200, 50, 0.5)";
				ctx.fillRect(cell._x + 1, cell._y + 1, cell.cellsize - 2, cell.cellsize - 2);
			}*/
		}.bind(this));
	},
	
	import_mapdata: function(mapdata) { // WE GET MAPDATA HERE
		// The floaters should be handled separately.
		// This should allow the gridbuilder to be compatible with its own export function...
		
		if(!mapdata) {
			this.createGrid();
			return true;
		}
		
		_d = mapdata.tiles;
		
		for(i in _d) {
			if(_d[i].resource_id > 0) {
				resource = this.tools.resourceMap[_d[i].resource_id];
				img = image.load('app/images/'+resource);
				
				_d[i].contents = {
					image: img
				}
			}
		}
		
		this._cells = _d;
	},
	
	export_as_mapdata: function() {
		tmp_cells = this._cells;
		for(id in tmp_cells) {
			tmp_cells[id].x = tmp_cells[id].cell_x;
			tmp_cells[id].y = tmp_cells[id].cell_y;
			
			if(tmp_cells[id].tool) {
				tmp_cells[id].resource_id = tmp_cells[id].tool.resource;
			} else {
				tmp_cells[id].resource_id = -1;
			}
		}
		
		output = {
			tiles: tmp_cells,
			tile_height: this.cellsize,
	        tile_width: this.cellsize,
			resource_map: this.tools.resourceMap
		}
		
		return output;
	},
	
	export: function() {
		output = {};
		
		for(id in this._cells) {
			if(this._cells[id].tool) {
				this._cells[id].resource_id = this._cells[id].tool.resource;
			} else {
				this._cells[id].resource_id = -1;
			}
		}
		
		return this._cells;
	},
	
	__unload: function () {
		this.unhook();
	}
}