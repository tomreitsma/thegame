imagehandler = {
    init: function() {
        main.loadCSS('styles/imagehandler.css');
    },
    
    preloadImages: function(media_url, images, callback) {
        var loading = 0;
        
        progress = new progressbar($.count(images));
        
        updateLoading = function(img) {
            progress.tick();
            loaded = images.length - loading;
            msg = '<pre>loaded: ' + loaded  + ' out of ' + images.length + ' ['+img.src+']</pre>';
            progress.setStatus(msg);
            
            if(loading == 0) { callback(); }
        }
        
        for(img in images) {
            loading += 1;
            img = images[img];
            
            image.load(media_url + escape(img), function(){
                loading -= 1;
                updateLoading(this);
            }.bind(this));
        }
    },
    
    loadSprite: function(imageFile, spritedata) {
        
    }
}