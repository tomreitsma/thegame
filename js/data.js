data = {
    _data: {},
    
    init: function() {},
    set: function(key, data) {
        fdsa = backend.call('data_set', {
            key: key,
            data: JSON.stringify(data)
        }, {method: 'POST'});
        
        this._data[key] = data;
    },
    
    exists: function(key) {
        result = backend.call('data_exists', {key: key});
        if(result.exists == true) {
            return true;
        }
        
        return false;
    },
    
    get: function(key) {
        _result = backend.call('data_get', { key: key });
        if(_result.responseCode && _result.responseCode > 0) {
            // console.log(_result.error);
            return false;
        }
        
        d = _result.data.replace('\\', '');
        _result = JSON.parse(d);
        return _result;
    }
}