// ***********
// BASE LIBRARY
// @author Willem Mulder
// ***********

var BaseLibrary = (function() {
	
	var callbacks = {};

	return {

		// Callback functions
		on : function(callbackName, callback) {
			callbacks[callbackName] = callbacks[callbackName] || [];
			callbacks[callbackName].push(callback);
		},

		off : function(callbackName, callback) {
			// Remove specific callback
			if (callbackName && callback) {
				if (callbacks[callbackName]) {
					var index = callbacks[callbackName].indexOf(callback);
					if (index > -1) {
						delete callbacks[callbackName][index];
					}
				}
			// Remove all callbacks under this callbackName
			} else if (callbackName) {
				if (callbacks[callbackName]) {
					delete callbacks[callbackName];
				}
			}
		},

		trigger : function(callbackName) {
			if (callbacks[callbackName]) {
				for(var index in callbacks[callbackName]) {
					if (callbacks[callbackName].hasOwnProperty(index)) {
						var callback = callbacks[callbackName][index];
						callback.apply(this, Array.prototype.slice.call(arguments,1));
					}
				}
			}
		},

		// Init function
		init: function(variables,extendFunctions) {

			// Extend publics with the extendFunctions (e.g. Library.fn) so that they are both accessible
			variables.publics = extend(variables.publics,extendFunctions);
			var publics = variables.publics; // for easy reference
			
			// Create object that contains publics and privates
			var all = extend(variables.privates,variables.publics);
			
			// Set publics+privates object as 'this' for all public functions		
			for(var index in publics) {
				if (typeof publics[index] === "function" && index !== "register") {
					// This sets the new function on the actual publics object, and not any prototype, which is what we want
					if (publics[index].originalFunction) {
						publics[index] = publics[index].originalFunction.bind(all);	
					} else {
						publics[index] = publics[index].bind(all);
					}
				}
			}
			
			// Helper function to extend Object original with all properties from Object extra
			function extend(original, extra) {
				var funcNew = function() {
					for(var index in original) {
						// No check for hasOwnProperty, since we *do* want all properties!
						this[index] = original[index];
					}
				};
				funcNew.prototype = extra;
				return new funcNew();
			}
		}
	};
})();