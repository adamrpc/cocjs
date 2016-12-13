'use strict';

angular.module('cocjs').factory('WeaponMasteryPerk', function (PerkType, CoC) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function() {
		if(CoC.player.str > 60) {
			return '<b>Doubles damage bonus of weapons classified as "Large".</b>';
		}
		return '<b>You aren\'t strong enough to benefit from this anymore.</b>';
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Weapon Mastery', 'Weapon Mastery', '<b>You choose the "Weapon Mastery" perk, doubling the effectiveness of large weapons.</b>']);
	};
	return Perk;
});