'use strict';

angular.module('cocjs').factory('WeaponMasteryPerk', function (PerkType, CoC) {
	var perk = angular.copy(PerkType);
	perk.prototype.getDesc = function() {
		if(CoC.player.str > 60) {
			return '<b>Doubles damage bonus of weapons classified as "Large".</b>';
		}
		return '<b>You aren\'t strong enough to benefit from this anymore.</b>';
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Weapon Mastery', 'Weapon Mastery', '<b>You choose the "Weapon Mastery" perk, doubling the effectiveness of large weapons.</b>']);
	};
	return perk;
});