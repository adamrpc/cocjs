'use strict';

angular.module('cocjs').factory('SpellcastingAffinityPerk', function (PerkType) {
	function perk() {
		this.init(this, arguments);
	}
	angular.extend(perk.prototype, PerkType.prototype);
	perk.prototype.getDesc = function(params) {
		return "Reduces spell costs by " + params.value1 + "%.";
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Spellcasting Affinity","Spellcasting Affinity", "Reduces spell costs."]);
	};
	return perk;
});