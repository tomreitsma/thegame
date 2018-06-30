main.http = {
	// XMLHttpRequestUpload {}
	
	parseUrl: function(url, args) {
		if(args) {
			_a = [];
			tools.each(args, function(arg, key){
				_a.push([key, escape(arg)].join('='));
			});
			url += '?' + _a.join('&');
		}
		
		return url;
	},
	
	parseArgs: function(args) {
		if(main.settings && main.settings.noCache == true) {
			if(args) {
				args._t = new Date().getTime() / 1000;
			} else {
				args = { _t: new Date().getTime() / 1000 };
			}
		}
		
		return args;
	},
	
	serializeArgs: function(args) {
		_a = [];
		tools.each(args, function(arg, key){
			_a.push([key, arg].join('='));
		});
		
		return _a.join('&');
	},
	
	get: function(url, args) {
		args = this.parseArgs(args);
		url = this.parseUrl(url, args);
		
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
		
		if(xmlhttp.status == 200) {
			return xmlhttp.responseText;
		} else {
			main.throwException('[Error ' + xmlhttp.status + '] ' + url);
			return false;
		}
	},
	
	post: function(url, args) {
		args = this.serializeArgs(args);
		url = this.parseUrl(url);
		var result = null;
		
		new Ajax.Request(url, {
            method: 'post',
            parameters: args,
            contentType: 'application/x-www-form-urlencoded',
            onSuccess: function(xhr) {
                try {
                    result = true;
					responseText = xhr.responseText;
                } catch(e) {
                    result = false;
                }
            }.bind(this)
        });
	},
	
	eval: function(url, args) {
		return eval(this.get(url, args));
	}
}
