Benchmark = function(name) {
    this.construct(name);
}

Benchmark.prototype = {
    timestamps: [],
    
    _addTime: function() {
        this.timestamps.push(new Date().getTime());
    },
    
    construct: function(name) {
        this.name = name;
        this._addTime();
    },
    
    mark: function() {
        this._addTime();
    },
    
    done: function() {
        sum = 0;
        for(timestamp in this.timestamps) {
            sum += timestamp;
        }
        
        avg = sum / this.timestamps.length;
        
        if(this.timestamps.length >= 2) {
            first = this.timestamps[0];
            last = this.timestamps[this.timestamps.length - 1];
            diff = last - first;
            
            console.log('['+this.name+'] Total runtime: ' + diff.toString() + 'ms');
        }
        
        console.log('['+this.name+'] Average time between marks: ' + avg.toString());
    }
}