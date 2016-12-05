'use strict';

angular.module('cocjs').factory('PentUpPerk', function (PerkType) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function(params) {
		return "Increases minimum lust by " + Math.round(params.value1) + " and makes you more vulnerable to seduction.";
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Pent Up","Pent Up", "Increases minimum lust and makes you more vulnerable to seduction"]);
	};
	return Perk;
});