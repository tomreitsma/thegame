exports.tools = {
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
    merge: function(array, args) { array = Array.prototype.slice.call(array, 0); return this.update(array, args); },
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
			} else if(options.keys.length > 0 && !this.in_array(key, options.keys)) {
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
