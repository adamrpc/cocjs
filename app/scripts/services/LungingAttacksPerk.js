'use strict';

angular.module('cocjs').factory('LungingAttacksPerk', function (PerkType, CoC) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function() {
		if(CoC.player.spe >= 75) {
			return '<b>Grants 50% armor penetration for standard attacks.</b>';
		}
		return '<b>You are too slow to benefit from this perk.</b>';
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Lunging Attacks', 'Lunging Attacks', '<b>You choose the "Lunging Attacks" perk, granting 50% armor penetration for standard attacks.</b>']);
	};
	return Perk;
});