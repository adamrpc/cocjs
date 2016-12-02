'use strict';

angular.module('cocjs').factory('ImmovableObjectPerk', function (PerkType, CoC) {
	function perk() {
		this.init(this, arguments);
	}
	angular.extend(perk.prototype, PerkType.prototype);
	perk.prototype.getDesc = function() {
		if(CoC.player.tou >= 75) {
			return '<b>Grants 20% physical damage reduction.</b>';
		}
		return '<b>You aren\'t tough enough to benefit from this anymore.</b>';
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Immovable Object', 'Immovable Object', '<b>You choose the "Immovable Object" perk, granting 20% physical damage reduction.</b>']);
	};
	return perk;
});