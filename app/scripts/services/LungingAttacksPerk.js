'use strict';

angular.module('cocjs').factory('LungingAttacksPerk', function (PerkType, CoC) {
	var perk = angular.copy(PerkType);
	perk.prototype.getDesc = function() {
		if(CoC.player.spe >= 75) {
			return '<b>Grants 50% armor penetration for standard attacks.</b>';
		}
		return '<b>You are too slow to benefit from this perk.</b>';
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Lunging Attacks', 'Lunging Attacks', '<b>You choose the "Lunging Attacks" perk, granting 50% armor penetration for standard attacks.</b>']);
	};
	return perk;
});