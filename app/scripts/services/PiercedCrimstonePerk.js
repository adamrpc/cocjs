'use strict';

angular.module('cocjs').factory('PiercedCrimstonePerk', function (PerkType) {
	var perk = angular.copy(PerkType);
	perk.prototype.getDesc = function(params) {
		return "Increases minimum lust by " + Math.round(params.value1) + ".";
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Pierced: Crimstone", "Pierced: Crimstone", "You've been pierced with Crimstone and your lust seems to stay a bit higher than before."]);
	};
	return perk;
});