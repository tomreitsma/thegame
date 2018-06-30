var _ajax_get = function(url) {
	if (window.XMLHttpRequest) {
		xmlhttp=new XMLHttpRequest();
		xmlhttp.open("GET",url,false);
		xmlhttp.send(null);
	} else {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.open("GET",url,false);
		// Do not send null for ActiveX
		xmlhttp.send();
	}
	
	return xmlhttp.responseText;
}

var $ = tools = {
	foreach: function(obj, func) { for(i in obj) { func(obj[i]); } },
	each: function(obj, func) { for(i in obj) { if(func(obj[i], i) == -1){ break; } } },
	isFunction: function(obj) { if(typeof obj == typeof function(){}) return true; return false; },
	isObject: function(obj) { if(typeof obj == typeof {}) return true; return false; },
	isArray: function(obj) { if(typeof obj == typeof []) return true; return false; },
	isUndefined: function(obj) { if(typeof obj == typeof undefined) return true; return false; },
	in_array: function (value, a){ for(i in a) { if(a[i] == value) return true; } return false; },
	inArray: function (value, a){ for(i in a) { if(a[i] == value) return true; } return false; },
	hitch: function(context, func, args) { if(!args) { args = []; } return function() { return func.apply(context, args); } },
	update: function(array, args) { var arrayLength = array.length, length = args.length; while (length--) array[arrayLength + length] = args[length]; return array; },
    merge: function(array, args) { array = Array.prototype.slice.call(array, 0); return $.update(array, args); },
	byId: function(elementId) { return document.getElementById(elementId); },
	count: function(obj) { i=0; for(key in obj){ i += 1 }; return i; },
	randomString: function(length) {
		if(!length) length = 20;
		t = '';
		for(i=0;i<length;i++) {
			t += String.fromCharCode((Math.floor((Math.random() * 100)) % 94) + 33);
		}
		
		return t;
	},
	
	filter: function(array, keywords) {
		new_arr = [];
		for(i in array) {
			if(!array[i] in keywords){ new_arr.push(array[i]); }
		}
	},
	
	init: function() {
		this.html = document.body;
		this.body = this.html;
	},
	
	/**
	 * $.extendObject
	 *
	 * Extends target with source.
	 */
	extendObject: function(target, source, options) {
		// Set some defaults
		if(!options) { options = { allowOverride: true }; };
		if(!options.allowOverride) { options.allowOverride = false; };
		if(!options.keys) { options.keys = []; };
		
		// Copy the keys
		for(key in source) {
			
			//console.log(options.keys.in_array(key));
			
			if(!(typeof target[key] == typeof undefined) && !options.allowOverride) {
				// Do not overwrite these attributes
				continue;
			} else if(options.keys.length > 0 && !$.in_array(key, options.keys)) {
				// A series of keys to be extended was passed along in the options
				// and this key isn't in there
				//console.log('b');
				continue;
			}
			
			target[key] = source[key];
		}
	},
	
	createElement: function(tag, style) {
		element = document.createElement(tag);
		element.applyStyle = function(s) {
			if(typeof s == typeof {}) {
				for(k in s) {
					this.style[k] = s[k];
				}
			}
			
			return this;
		}
		
		return element;
	}
}

Object.extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;
}

/**
 * { 0: true, 1: true }
 * will become
 * { 0: null, 1: null, 2: true, 3:true }
 */
Object.push_down = function(obj, indexes) {
	new_obj = {}; tmp = obj;
	for(i = 0; i <= indexes - 1; i++) {	new_obj[i] = null; }
	for(i in tmp) { ent = tmp[parseInt(i)]; new_obj[indexes + parseInt(i)] = ent; };
	return new_obj;
}

Object.extend(Function.prototype, {
    bind: function(context){
        if (arguments.length < 2 && $.isUndefined(arguments[0])) return this;
        var __method = this, args = Array.prototype.slice.call(arguments, 1);
        return function() {
            var a = $.merge(args, arguments);
            return __method.apply(context, a);
        }
    }
});

if(!console) {
	var console = {
		log: function(message){},
		dir: function(object){},
		error: function(message){},
		warn: function(message){}
	}
}

var main = {
	init: function(args) {
		// Prepare includes
		this.http = eval(_ajax_get('js/http.js?' + new Date().getTime()));
		this.settings = this.http.eval('js/__settings.js?' + new Date().getTime());
		this.http.eval('js/progressbar.js');
		this.http.eval('js/socket.io.js');
		this.backend = this.http.eval('js/backend.js');
		
		tools.init();
		
		this.backend.init().addCallback(function(){
			backend.rpc.main.loadManifest().addCallback(function(data){
				this.manifest = data;
				
				// Require libraries
				p = new progressbar(this.manifest.libraries.length);
				
				this.require(this.manifest.libraries, undefined, p);
				this.doInits();
				
				// Include objects
				this.includeJS(this.manifest.objects);
				
				// Initialize app
				this.loadApp();
			}.bind(this));
			
		}.bind(this));
		
	},
	
	loadApp: function( appConfig ) {
		if(typeof appConfig == typeof '') appConfig = { name: appConfig };
		if(!appConfig) appConfig = this.manifest.application;
		if(this.app) { this.app._unload(); }
		
		//backend.call('main_getAppdef', { app: appConfig.name }).addCallback(function(data){
		backend.rpc.main.getAppdef(appConfig.name).addCallback(function(data) {
			appDef = data;
			
			loadExclude = null;
			
			tools.each(appDef.files, function(file){
				if((loadExclude) && tools.inArray(file + '.js', loadExclude)) {
					return true;
				}
				
				instance = this.http.eval(appConfig.name + '/' + file);
				if(file == '__init__.js') {
					this.app = instance;
					if(instance._loadExclude) {
						loadExclude = instance._loadExclude;
					}
				}
			}.bind(this));
			
			try {
				this.app.__init(this);
			} catch(e) {
				this.throwException(e)
			}
		}.bind(this));
	},
	
	doInits: function() {
		// Init files
		tools.each(this.manifest.libraries, function(lib){
			lib = lib.replace('.js', '');
			if(main[lib] && $.isFunction(main[lib].init)) {
				main[lib].init();
			}
		})
	},
	
	require: function(lib, path, progress) {
		if($.isObject(progress) && !$.isArray(lib)) { progress.tick(); };
		if(!path) path = 'js';
		
		if(typeof lib == typeof []) {
			$.foreach(lib, function(){
				main.require(lib[i], null, progress);
			});
		} else {
			lib = lib.replace('.js', '');
			
			if($.isObject(lib)) { path += '/' + lib.object + '.js' }
			else { path += '/' + lib + '.js'; }
			
			main[lib] = main.http.eval(path);
			progress.setStatus('Loaded ' + lib);
			
			if(!main[lib] && !$.isObject(lib)) {
				main.throwException('main['+lib+'] was invalid.')
				return false;
			};
			
			// Load dependencies
			if($.isFunction(main[lib].loadDependencies)) {
				main[lib].loadDependencies();
			}
		}
		
		return true;
	},
	
	loadCSS: function(path, clearOther) {
		headObj = document.getElementsByTagName('head')[0];
		
		if(clearOther) {
			tools.each(headObj.childNodes, function(el) {
				if(el.rel == 'Stylesheet') {
					headObj.removeChild(el);
				}
			});
		}
		
		link = $.createElement('link');
		link.media = 'screen';
		link.rel = 'Stylesheet';
		link.type = 'text/css';
		link.href = path;
		
		headObj.appendChild(link);
	},
	
	includeJS: function(location) {
		if(typeof location == typeof []) {
			$.foreach(location, function(l){
				main.includeJS(l);
			});
		} else {
			script_tag = $.createElement('script');
			script_tag.src = 'js/' + location + '.js';
			document.getElementsByTagName('head')[0].appendChild(script_tag);
		}
		
		return true;
	},
	
	/**
	 * Destroy everything!
	 */
	quit: function() {
		headObjects = document.getElementsByTagName('head')[0].childNodes;
		tools.each(headObjects, function(element) {
			console.log('Removing' + element);
			document.getElementsByTagName('head')[0].removeChild(element);
		});
		
		bodyObjects = document.getElementsByTagName('body')[0].childNodes;
		tools.each(headObjects, function(element) {
			console.log('Removing' + element);
			document.getElementsByTagName('body')[0].removeChild(element);
		});
	},
	
	throwException: function(msg) {
		console.error('[Exception]: ' + msg);
		return false;
	}
}
