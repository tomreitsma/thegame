threadlock = {
	_states: {1: 'LOCKED', 2: 'FREE'},
	_state: null,
	
	init: function() {
		this.setState(2);
	},
	
	lock: function(object) {
		this._ref = object;
		this.setState(1);
	},
	
	release: function() {
		this._ref = null;
		this.setState(2);
	},
	
	setState: function(sid) {
		this._state = this._states[sid];
	},
	
	getState: function() {
		return this._state, this._states[this._state];
	}
}