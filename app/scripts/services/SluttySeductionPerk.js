'use strict';

angular.module('cocjs').factory('SluttySeductionPerk', function (PerkType) {
	var perk = angular.copy(PerkType);
	perk.prototype.getDesc = function(params) {
		return "Increases odds of successfully teasing and lust damage of successful teases by " + params.value1 + " points.";
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Slutty Seduction", "Slutty Seduction", "Your armor allows you access to 'Seduce', an improved form of 'Tease'."]);
	};
	return perk;
});