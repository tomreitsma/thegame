Spritesheet = function(data) {
    this.load(data);
};
 
Spritesheet.prototype = {
    _sprites: [],
    _width: 0,
    _height: 0,
 
    load: function(data) {
        this._height = data.height;
        this._width = data.width;
        this._sprites = data.sprites;
    },

    getOffset: function(spriteName, frameIndex) {
        var sprite = this._sprites[spriteName];
        
        if(sprite == undefined) {
            return main.throwException('Cannot find sprite name ' + spriteName);
        }

        //To get the offset, multiply by sprite width
        //Sprite-specific x and y offset is then added into it.
        fdsa = {
            x: (frameIndex * this._width||0) + (sprite.x_offset ? sprite.x * sprite.x_offset : 0),
            y: (sprite.y||0),
            width: this._width,
            height: this._height
        };
        
        return fdsa;
    }
};
