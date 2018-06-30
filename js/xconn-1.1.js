Ajax = {};
Ajax.Request = function() {
	this.initialize.apply(this, arguments);
}

/**
 *
 *	XConn v1.1, May 2005, Sep 2009, Bas van Gaalen
 *	Simple AJAX Request class. Based on PrototypeJs.
 *
 *	Source code licensed under a Creative Commons
 *	Attribution-NonCommercial-ShareAlike License
 *	http://creativecommons.org/licenses/by-nc-sa/2.0/
 *
 */

Ajax.Request.prototype = {

	initialize: function(url, options) {
		this.transport = this.getHttpRequestObject();
		this.request(url, options);
	},

	request: function(url, options) {

		// verify input
		if (!url) { return false; }

		// set default options
		options = Object.extend({
			method: 'post',
			contentType: 'application/x-www-form-urlencoded',
			parameters: [],
			postBody: '',
			onSuccess: function() {},
			onFailure: function() {}
		}, options || {});

		// setup state handler
		this.transport.onreadystatechange = function() {

			// wait untill request has completed...
			if (this.readyState != 4) { return false; }

			// ...and ok
			var success = this.status == undefined || this.status == 0
				|| (this.status >= 200 && this.status < 300);
			if (!success) {
				if (options.onFailure) {
					options.onFailure(this);
				}
				return false;
			}

			// call success callback
			if (options.onSuccess) {
				options.onSuccess(this);
			}

		};

		// options.parameters can either be string or object, handle cases
		if (typeof options.parameters == 'object') {
			var aparams = [];
			for (var i in options.parameters) {
				aparams.push(i + '=' + encodeURIComponent(options.parameters[i])); 
			}
			var params = aparams.join('&');
		} else {
			var params = options.parameters;
		}

		// add options.parameters to url, in case of get method
		if ('get' == options.method && params) {
			url += (url.match(/\?/) ? '&' : '?') + params;
		}

		// open connection
		this.transport.open(options.method, url, false);

		// set request headers
	    //var requestHeaders =
		//	['X-Requested-With', 'XMLHttpRequest',
		//	 'Accept', 'text/javascript, text/html, application/xml, text/xml, */*'];
		var requestHeaders = [];
		if ('post' == options.method) {
			requestHeaders.push('Content-type', options.contentType);
		}
		for (var i = 0; i < requestHeaders.length; i += 2) {
			this.transport.setRequestHeader(requestHeaders[i], requestHeaders[i+1]);
		}

		// send the Ajax request
		var body = options.postBody ? options.postBody : params;
		this.transport.send('post' == options.method.toLowerCase() ? body : null);

		return this.responseText;
	},

	getHttpRequestObject: function() {
		try { return new XMLHttpRequest(); } catch(e) {}
		try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
		try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
		return null;
	}

};
