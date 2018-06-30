Animation = function(data, sprites) {
    this.load(data);
    this._sprites = sprites;
};

Animation.prototype = {
    _frames: [],
    _frame: null,
    _frameDuration: 0,
    
    _nextFrame: false,
    load: function(data) {
        this._frames = data;
        
        //Initialize the first frame
        this._frameIndex = 0;
        this._frameDuration = data[0].time;
    },
    
    animate: function(deltaTime) {
        this._frameDuration -= deltaTime;
        
        if(this._frameDuration <= 0) {
            this._frameIndex++;
            this._nextFrame = true;
            
            if(this._frameIndex == this._frames.length) {
                this._frameIndex = 0;
            }
            
            this._frameDuration = this._frames[this._frameIndex].time;
        }
    },
    
    getNextFrame: function() {
        oldNextframe = this._nextFrame;
        this._nextFrame = false;
        return oldNextframe;
    },
    
    getSprite: function() {
        return this._sprites.getOffset(this._frames[this._frameIndex].sprite, this._frameIndex);
    }
}