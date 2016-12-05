'use strict';

angular.module('cocjs').factory('PiercedFertitePerk', function (PerkType) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function(params) {
		return "Increases cum production by " + Math.round(2*params.value1) + "% and fertility by " + Math.round(params.value1) + ".";
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Pierced: Fertite", "Pierced: Fertite", "You've been pierced with Fertite and any male or female organs have become more fertile."]);
	};
	return Perk;
});