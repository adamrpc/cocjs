'use strict';

angular.module('cocjs').factory('CoC_Settings', function ($log, $rootScope) {
	
	var debugBuild = true;
		
	// Horrible static abuse FTW
	var haltOnErrors = false;
	var buttonEvents = [];
	var bufferSize = 50;

	/**
	 * trace("ERROR "+description);
	 * If haltOnErrors=true, throws Error
	 */
	var error = function(description) {
		$log.error(description);
		if (haltOnErrors) {
			$rootScope.$emit('system:halt', description);
		}
	};

	/**
	 * trace("ERROR Abstract method call: "+clazz+"."+method+"(). "+description);
	 */
	var errorAMC = function(clazz, method, description) {
		$log.error('Abstract method call: ' + clazz + '.' + method + '(). ' + description);
	};
	
	var appendButtonEvent = function(inString) {
		buttonEvents.unshift(inString);  // Push the new item onto the head of the array
		if (buttonEvents.length > bufferSize) { // if the array has become too long, pop the last item
			buttonEvents.pop();
		}
	};
	
	var getButtonEvents = function() {
		var retStr = '';
		_.forEach(buttonEvents, function(event, index) {
			retStr = retStr + event + '\n';
			$log.debug('x = ', index, 'Array Val = ', event);
		});
		return retStr;
	};
	
	return {
		debugBuild: debugBuild,
		haltOnErrors: haltOnErrors,
		buttonEvents: buttonEvents,
		error: error,
		errorAMC: errorAMC,
		appendButtonEvent: appendButtonEvent,
		getButtonEvents: getButtonEvents
	};
});
