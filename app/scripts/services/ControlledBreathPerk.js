'use strict';

angular.module('cocjs').factory('ControlledBreathPerk', function (PerkType, CoC) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function() {
		if (CoC.player.cor >= 30) {
			return "<b>DISABLED</b> - Corruption too high!";
		}
		return this.desc;
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Controlled Breath", "Controlled Breath", "Jojo’s training allows you to recover more quickly. Increases rate of fatigue regeneration by 10%"]);
	};
	return Perk;
});