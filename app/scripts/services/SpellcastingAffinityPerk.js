'use strict';

angular.module('cocjs').factory('SpellcastingAffinityPerk', function (PerkType) {
	var perk = angular.copy(PerkType);
	perk.prototype.getDesc = function(params) {
		return "Reduces spell costs by " + params.value1 + "%.";
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Spellcasting Affinity","Spellcasting Affinity", "Reduces spell costs."]);
	};
	return perk;
});