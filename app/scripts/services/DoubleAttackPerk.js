'use strict';

angular.module('cocjs').factory('DoubleAttackPerk', function (PerkType, CoC) {
	function perk() {
		this.init(this, arguments);
	}
	angular.extend(perk.prototype, PerkType.prototype);
	perk.prototype.getDesc = function() {
		if(CoC.getInstance().player.spe < 50) {
			return '<b>You\'re too slow to double attack!</b>';
		}
		if(CoC.getInstance().player.str < 61) {
			return 'Allows you to perform two melee attacks per round.';
		}
		return '<b>You are stronger than double attack allows.  To choose between reduced strength double-attacks and a single strong attack, access "Dbl Options" in the perks menu.</b>';
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Double Attack', 'Double Attack', 'You choose the "Double Attack" perk.  This allows you to make two attacks so long as your strength is at 60 or below.  By default your effective strength will be reduced to 60 if it is too high when double attacking.  <b>You can enter the perks menu at any time to toggle options as to how you will use this perk.</b>']);
	};
	return perk;
});