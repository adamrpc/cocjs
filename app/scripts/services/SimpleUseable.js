'use strict';

angular.module('cocjs').factory('SimpleUseable', function ( Useable, EngineCore ) {
	var SimpleUseable = angular.copy(Useable);
	SimpleUseable.prototype.init = function(that, args) {
		Useable.prototype.init(that, args);
		that.canUseText = args.length > 5 && args[5] !== undefined ? args[5] : null;
		that.canUseFunction = args.length > 6 && args[6] !== undefined ? args[6] : null;
	};
	SimpleUseable.prototype.canUse = function() {
		EngineCore.clearOutput();
		if (this.canUseFunction) {
			this.canUseFunction();
		} else {
			EngineCore.outputText(this.canUseText);
		}
		return false;
	};
	return SimpleUseable;
});
