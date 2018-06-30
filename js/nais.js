/*
 NAIS: Not so Artificially Intelligent Script
 @author Tom Reitsma <antido@gmail.com>
*/

nais = {
    _scripts: ['patrol', 'boundary', 'path'],
    scripts: {},
    
    init: function() {
        $.foreach(this._scripts, function(script) {
            this.scripts[script] = main.http.eval('js/ai_scripts/' + script + '.js');
        }.bind(this));
    },
    
    attachScript: function(object, scriptName, args) {
        if(!main.nais.scripts[scriptName]) { main.throwException('[NAIS] Script not found: ' + scriptName); return false; }
        
        instance = eval("new "+scriptName+"(object, args);");
        
        return true;
    }
};
