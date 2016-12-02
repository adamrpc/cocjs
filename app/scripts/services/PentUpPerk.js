'use strict';

angular.module('cocjs').factory('PentUpPerk', function (PerkType) {
	function perk() {
		this.init(this, arguments);
	}
	angular.extend(perk.prototype, PerkType.prototype);
	perk.prototype.getDesc = function(params) {
		return "Increases minimum lust by " + Math.round(params.value1) + " and makes you more vulnerable to seduction.";
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Pent Up","Pent Up", "Increases minimum lust and makes you more vulnerable to seduction"]);
	};
	return perk;
});