builder = {
	_image_cache: {},
	
	tools: {
		_defaultCategory: 'tiles',
		_defaultTool: 1,
		
		resourceMap: {
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
			12: 'deco_bush_square02.png',
			
			13: 'grassdirt_sidetrans01.png',
			14: 'grassdirt_sidetrans02.png',
			15: 'grassdirt_sidetrans03.png',
			16: 'grassdirt_sidetrans04.png'
		},
		
		categories: {
			'tiles': { name: 'Tiles' },
			'objects': { name: 'Objects', floating: true }
		},
		
		items: {
			'tiles': {
				1: { name: 'Dirt tile 1', resource: 1 },
				2: { name: 'Grass tile 1', resource: 2 },
				3: { name: 'grassdirt_cornerconc01.png', resource: 3},
				4: { name: 'grassdirt_cornerconc02.png', resource: 4},
				5: { name: 'grassdirt_cornerconc03.png', resource: 5},
				6: { name: 'grassdirt_cornerconc04.png', resource: 6},
				7: { name: 'grassdirt_cornerconv01.png', resource: 7},
				8: { name: 'grassdirt_cornerconv02.png', resource: 8},
				9: { name: 'grassdirt_cornerconv03.png', resource: 9},
				10: { name: 'grassdirt_cornerconv04.png', resource: 10},
				
				11: { name: 'grassdirt_sidetrans01.png', resource: 13},
				12: { name: 'grassdirt_sidetrans02.png', resource: 14},
				13: { name: 'grassdirt_sidetrans03.png', resource: 15},
				14: { name: 'grassdirt_sidetrans04.png', resource: 16},
			},
			
			'objects': {
				1: { name: 'deco_bush_square01.png', resource: 11 },
				2: { name: 'deco_bush_square02.png', resource: 12 }
			}
		}
	},
	
	__init: function() {
		b = new Benchmark('builder_init');
		
		this.canvas = $.createElement('canvas');
        this.canvas.id = 'main_canvas';
        this.width = this.canvas.width = window.innerWidth - 8;
        this.height = this.canvas.height = window.innerHeight - 8;
        this.ctx = this.canvas.getContext('2d');
		this.canvas.ctx = this.ctx;
        $.html.appendChild(this.canvas);
		
		fdsa = backend.call('tools_getResourceMap', {});
		
		main.loadCSS('app/styles/default.css');
		
		this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
		
		imagehandler.preloadImages('app/images/', this.tools.resourceMap, callback = function(){
			backend.rpc.data.get('test_mapdata').addCallback(function(data){
				_d = data;
				
				this.grid = new Grid({
					canvas: this.canvas,
					cellsize: 40,
					height: 15,
					width: 20,
					x: 210,
					y: 10,
					tools: this.tools
				});
				
				this.grid.import_mapdata(_d);
				
				this.menu = new Menu({
					x: 10,
					y: 10,
					height: this.height - 10,
					width: 200,
					tools: this.tools
				});
				
				if($.byId('toolsMenu')) {
					this.menu.destroy();
				}
				
				this.menu.setup();
				menuDiv = $.byId('toolsMenu');
				
				testButton = $.createElement('input');
				testButton.type = 'button';
				testButton.value = 'Test';
				testButton.onclick = function() {
					backend.rpc.data.set('test_mapdata', this.grid.export_as_mapdata());
					this.grid.__unload();
					main.loadApp('app');
				}.bind(this);
				menuDiv.appendChild(testButton);
				
				buildButton = $.createElement('input');
				buildButton.type = 'button';
				buildButton.value = 'Editor';
				buildButton.onclick = function() {
					main.loadApp('builder');
				}.bind(this);
				menuDiv.appendChild(buildButton);
				
				quitbutton = $.createElement('input');
				quitbutton.type = 'button';
				quitbutton.value = 'save';
				quitbutton.onclick = function() {
					//this.grid.save();
					backend.rpc.data.set('test_mapdata', this.grid.export_as_mapdata());
				}.bind(this);
				menuDiv.appendChild(quitbutton);
				
				/**
				 * TODO:
				 *
				 * Make sure this event doesn't fire after it has fired once if the
				 * contents haven't changed
				 */
				
				this.grid.cellClicked = function(cell) {
					if(tool = this.menu.getSelectedTool()) {
						cell.tool = tool;
						cell.contents = {
							image: image.load(this.tools.resourceMap[tool.resource])
						}
					}
					
					cell.clicked = true;
					
					this.grid.setCell(cell);
				}.bind(this);
				
				this.grid.cellRightClicked = function(cell) {
					cell.clicked = true;
					cell.innerRender.pop();
					delete cell.tool
					
					this.grid.setCell(cell);
				}.bind(this);
				
				this.__drawInterval = setInterval(function(){ this.draw(); }.bind(this), 100);
				
				b.mark();
				b.done();
			}.bind(this));
        }.bind(this));
	},
	
	draw: function() {
		this.ctx.globalCompositeOperation = 'destination-over';
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        
		this.grid.render();
		this.ctx.save();
	},
	
	_unload: function() {
		clearInterval(this.__drawInterval);
		$.html.removeChild(this.canvas);
		
		delete this.canvas;
		this.grid.save();
		this.grid.__unload();
	}
}
