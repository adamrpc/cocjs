'use strict';

angular.module('cocjs').factory('LightningStrikesPerk', function (PerkType, CoC) {
	var perk = angular.copy(PerkType);
	perk.prototype.getDesc = function() {
		if(CoC.getInstance().player.spe >= 60) {
			return '<b>Increases the attack damage for non-heavy weapons.</b>';
		}
		return '<b>You are too slow to benefit from this perk.</b>';
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Lightning Strikes', 'Lightning Strikes', '<b>You choose the "Lightning Strikes" perk, increasing the attack damage for non-heavy weapons.</b>']);
	};
	return perk;
});