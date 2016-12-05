'use strict';

angular.module('cocjs').factory('LightningStrikesPerk', function (PerkType, CoC) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function() {
		if(CoC.player.spe >= 60) {
			return '<b>Increases the attack damage for non-heavy weapons.</b>';
		}
		return '<b>You are too slow to benefit from this perk.</b>';
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Lightning Strikes', 'Lightning Strikes', '<b>You choose the "Lightning Strikes" perk, increasing the attack damage for non-heavy weapons.</b>']);
	};
	return Perk;
});