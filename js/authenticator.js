authenticator = {
    init: function() {
        if(ct = cookie.get('token')) {
            token = ct;
        } else {
            //token = prompt('Please authenticate');
            token = 'fdsa';
        }
        
        backend.rpc.main.authenticate('tom', token).addCallback(function(var_1, var_2){
            //console.dir({var_1: var_1, var_2: var_2});
        });
        
        /*if(!(backend.call('main_authenticate', { token: token } ).result == true)) {
            console.log('Authentication failed.');
            main.quit();
        } else {
            cookie.set('token', token);
        }*/
    }
}
