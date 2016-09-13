'use strict';

angular.module('cocjs').factory('ControlledBreathPerk', function (PerkType, CoC) {
	var perk = angular.copy(PerkType);
	perk.prototype.getDesc = function() {
		if (CoC.getInstance().player.cor >= 30) {
			return "<b>DISABLED</b> - Corruption too high!";
		}
		return this.desc;
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Controlled Breath", "Controlled Breath", "Jojo’s training allows you to recover more quickly. Increases rate of fatigue regeneration by 10%"]);
	};
	return perk;
});