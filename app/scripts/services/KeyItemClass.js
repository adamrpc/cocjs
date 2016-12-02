'use strict';

angular.module('cocjs').factory('KeyItemClass', function () {
	//constructor
	function KeyItemClass() {
		this.init(this, arguments);
	}
	KeyItemClass.prototype.init = function(that, args) {
		that.keyName = args.length > 0 ? args[0] : '';
		that.value1 = args.length > 1 ? args[1] : 0;
		that.value2 = args.length > 2 ? args[2] : 0;
		that.value3 = args.length > 3 ? args[3] : 0;
		that.value4 = args.length > 4 ? args[4] : 0;
	};
	return KeyItemClass;
});