'use strict';

angular.module('cocjs').factory('WizardsFocusPerk', function (PerkType) {
	var perk = angular.copy(PerkType);
	perk.prototype.getDesc = function(params) {
		return "Increases your spell effect modifier by " + params.value1 * 100 + "%.";
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Wizard's Focus", "Wizard's Focus", "Your wizard's staff grants you additional focus, reducing the use of fatigue for spells."]);
	};
	return perk;
});