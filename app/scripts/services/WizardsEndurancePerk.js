'use strict';

angular.module('cocjs').factory('WizardsEndurancePerk', function (PerkType) {
	function perk() {
		this.init(this, arguments);
	}
	angular.extend(perk.prototype, PerkType.prototype);
	perk.prototype.getDesc = function(params) {
		return "Reduces fatigue cost of spells by " + params.value1 + "%.";
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Wizard's Endurance", "Wizard's Endurance", "Your spellcasting equipment makes it harder for spell-casting to fatigue you!"]);
	};
	return perk;
});