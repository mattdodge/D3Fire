if (!(d3 && d3.version)) {
	throw new Error('D3 not found, be sure to include d3fire after the d3 script tag');
}

if (!(Firebase && typeof(Firebase) == 'function')) {
	throw new Error('Firebase not found, be sure to include d3fire after the Firebase script tag');
}

/**
 * 
 * @param {} fbase - Either a Firebase object/query or a string corresponding to the firebase URL
 * @param {} opts - An object containing any or all of the following options:
 * 			
 * 		keyFunc : function(dataSnapshot)
 * 			A function that takes a firebase snapshot and returns a key. In most
 * 			cases this will be a unique identifier of the object within the firebase.
 * 			Defaults to returning dataSnapshot.name(). 
 * 
 *  	createFunc : function(dataSnapshot) 
 *  		A callback when a new object is created in the firebase. This function
 *  		will most likely append some new object corresponding to the data. The 
 *  		this keyword is available as the original selector so you can append to
 *  		that. You MUST return the selector for the d3 objects created from this 
 *  		callback if you want to be able to update/delete them later on. Defaults
 *  		to a no-op
 *  
 *  	updateFunc : function(dataSnapshot)
 *  		A callback when a firebase object is modified. The this keyword is available
 *  		as the d3 object corresponding to the modified data so you can update
 *  		attributes on this to change the element. No return needed. Defaults to
 *  		a no-op.
 *  
 *  	deleteFunc : function(dataSnapshot)
 *  		A callback when a firebase object is deleted. The this keyword is available
 *  		as the d3 object corresponding to the deleted data. Defaults to
 *  		`this.remove()` as this is probably more common than a no-op.
 *  
 */
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
		createFunc.call(selection, snapshot).attr('__firekey__', keyFunc(snapshot)).datum(snapshot);
	});
	
	theFirebase.on('child_changed', function(snapshot) {
		updateFunc.call(selection.selectAll('[__firekey__="' + keyFunc(snapshot) + '"]').datum(snapshot), snapshot);
	});
	
	theFirebase.on('child_removed', function(snapshot) {
		deleteFunc.call(selection.selectAll('[__firekey__="' + keyFunc(snapshot) + '"]').datum(null), snapshot);
	});
	
	return selection;
	
};