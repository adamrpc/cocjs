'use strict';

angular.module('cocjs').factory('WizardsEndurancePerk', function (PerkType) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function(params) {
		return "Reduces fatigue cost of spells by " + params.value1 + "%.";
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Wizard's Endurance", "Wizard's Endurance", "Your spellcasting equipment makes it harder for spell-casting to fatigue you!"]);
	};
	return Perk;
});