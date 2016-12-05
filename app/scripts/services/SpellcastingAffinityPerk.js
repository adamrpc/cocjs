'use strict';

angular.module('cocjs').factory('SpellcastingAffinityPerk', function (PerkType) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function(params) {
		return "Reduces spell costs by " + params.value1 + "%.";
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Spellcasting Affinity","Spellcasting Affinity", "Reduces spell costs."]);
	};
	return Perk;
});