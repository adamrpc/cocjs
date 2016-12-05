'use strict';

angular.module('cocjs').factory('SluttySeductionPerk', function (PerkType) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function(params) {
		return "Increases odds of successfully teasing and lust damage of successful teases by " + params.value1 + " points.";
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Slutty Seduction", "Slutty Seduction", "Your armor allows you access to 'Seduce', an improved form of 'Tease'."]);
	};
	return Perk;
});