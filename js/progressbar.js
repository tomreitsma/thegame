progressbar = function(itemcount) {
    this.create(itemcount);
}

progressbar.prototype = {
    index: 0,
    callbacks: [],
    
    create: function(itemcount) {
        this.count = itemcount;
        
        this.wrapperDiv = $.createElement('div');
        this.wrapperDiv.style.height = '50px';
        
        var loadingDiv = $.createElement('div');
        //loadingDiv.applyStyle({width:'500px', backgroundColor: '#000', height:'10px', position:'fixed', top:'5', left:'5', border: '1 px solid black'});
        
        loadingDiv.style.width = '500px';
        loadingDiv.style.backgroundColor = '#000';
        loadingDiv.style.color = '#FFF'
        loadingDiv.style.height = '10px';
        loadingDiv.style.position = 'fixed';
        loadingDiv.style.top = '5';
        loadingDiv.style.left = '5';
        loadingDiv.style.border = '1px solid black';
        
        this.progressBar = $.createElement('div');
        this.progressBar.style.height = '10px';
        this.progressBar.style.position = 'relative';
        this.progressBar.style.backgroundColor = '#0F0';
        loadingDiv.appendChild(this.progressBar);
        
        this.statusDiv = $.createElement('div');
        this.statusDiv.style.position = 'fixed';
        this.statusDiv.style.top = '20';
        this.statusDiv.style.left = '5';
        this.statusDiv.style.width = '100px';
        
        this.wrapperDiv.appendChild(loadingDiv);
        this.wrapperDiv.appendChild(this.statusDiv);
        
        $.html.appendChild(this.wrapperDiv);
    },
    
    addCallback: function(func) {
        this.callbacks.push(func);
    },
    
    setStatus: function(msg) {
        this.statusDiv.innerHTML = msg;
    },
    
    tick: function() {
        this.index += 1;
        percentage = (this.index / this.count) * 100;
        this.progressBar.style.width = percentage + '%';
        
        if(percentage >= 100) {
            $.html.removeChild(this.wrapperDiv);
            
            tools.each(this.callbacks, function(cb){
                if(tools.isFunction(cb)) cb();
            }.bind(this));
        }
    }
    
}