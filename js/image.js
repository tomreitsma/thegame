image = {
	_cache: {},
	
	load: function(path, cb) {
        if(img = this._cache[path]) {
            return img;
        }
        
        var img = new Image();
        img.onload = function(){
            image._cache[image._stripPath(path)] = img;
            if($.isFunction(cb)) cb(img);
        }.bind(img);
        img.src = path;
		
        return img;
    },
	
	_stripPath: function(path) {
		parts = path.split('/');
		return parts[parts.length - 1];
	},
	
	getUsage: function() {
		tools.each(this._cache, function(img) {
			//console.log('image size: ' + img.fileSize);
		});
	},
	
	clearCache: function() {
		this._cache = null;
		this._cache = {};
	}
}