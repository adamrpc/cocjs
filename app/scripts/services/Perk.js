'use strict';

angular.module('KeyItemClass').factory('Perk', function () {
	function Perk() {
		this.init(this, arguments);
	}
	Perk.prototype.init = function(that, args) {
		that.ptype = args.length > 0 ? args[0] : '';
		that.value1 = args.length > 1 ? args[1] : 0;
		that.value2 = args.length > 2 ? args[2] : 0;
		that.value3 = args.length > 3 ? args[3] : 0;
		that.value4 = args.length > 4 ? args[4] : 0;
	};
	Perk.prototype.getPerkName = function() {
		return this.ptype.name;
	};
	Perk.prototype.getPerkDesc = function() {
		return this.ptype.desc(this);
	};
	Perk.prototype.getPerkLongDesc = function() {
		return this.ptype.longDesc;
	};
	return Perk;
});