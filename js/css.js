css = {
    apply: function(object, parameters) {
        for(key in parameters) {
            object.style[key] = parameters[key];
        }
    },
    
    load: function(path, clearOther) {
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
    }
}