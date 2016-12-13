'use strict';

angular.module('cocjs').factory('WizardsFocusPerk', function (PerkType) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function(params) {
		return "Increases your spell effect modifier by " + params.value1 * 100 + "%.";
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Wizard's Focus", "Wizard's Focus", "Your wizard's staff grants you additional focus, reducing the use of fatigue for spells."]);
	};
	return Perk;
});