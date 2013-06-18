if (!(d3 && d3.version)) {
	throw new Error('D3 not found, be sure to include d3fire after the d3 script tag');
}

if (!(Firebase && typeof(Firebase) == 'function')) {
	throw new Error('Firebase not found, be sure to include d3fire after the Firebase script tag');
}

d3.selection.prototype.firebase = function(fbase, opts) {
	
	if (fbase && typeof(fbase) == 'object') {
		// we were given a firebase object
		var theFirebase = fbase;
	} else if (fbase && typeof(fbase) == 'string') {
		// we were given a string, should be a firebase url
		var theFirebase = new Firebase(fbase);
	} else {
		throw new Error('Invalid firebase parameter');
	}
	
	if (opts.keyFunc && typeof(opts.keyFunc) == 'function') {
		var keyFunc = opts.keyFunc;
	} else {
		var keyFunc = function(data) {
			return data.name();
		}
	}
	
	if (opts.createFunc && typeof(opts.createFunc) == 'function') {
		var createFunc = opts.createFunc;
	} else {
		var createFunc = function(data) {}
	}
	
	if (opts.updateFunc && typeof(opts.updateFunc) == 'function') {
		var updateFunc = opts.updateFunc;
	} else {
		var updateFunc = function(data) {}
	}
	
	if (opts.deleteFunc && typeof(opts.deleteFunc) == 'function') {
		var deleteFunc = opts.deleteFunc;
	} else {
		var deleteFunc = function(data) { this.remove(); }
	}
	
	var selection = this;
	
	theFirebase.on('child_added', function(snapshot) {
		createFunc.call(selection, snapshot).attr('__firekey__', keyFunc(snapshot));
	});
	
	theFirebase.on('child_changed', function(snapshot) {
		updateFunc.call(selection.selectAll('[__firekey__="' + keyFunc(snapshot) + '"]'), snapshot);
	});
	
	theFirebase.on('child_removed', function(snapshot) {
		deleteFunc.call(selection.selectAll('[__firekey__="' + keyFunc(snapshot) + '"]'), snapshot);
	});
	
	return selection;
	
};