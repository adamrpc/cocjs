'use strict';

angular.module('cocjs').factory('PiercedFertitePerk', function (PerkType) {
	function perk() {
		this.init(this, arguments);
	}
	angular.extend(perk.prototype, PerkType.prototype);
	perk.prototype.getDesc = function(params) {
		return "Increases cum production by " + Math.round(2*params.value1) + "% and fertility by " + Math.round(params.value1) + ".";
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Pierced: Fertite", "Pierced: Fertite", "You've been pierced with Fertite and any male or female organs have become more fertile."]);
	};
	return perk;
});