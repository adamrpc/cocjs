'use strict';

angular.module('cocjs').factory('ResolutePerk', function (PerkType, CoC) {
	function perk() {
		this.init(this, arguments);
	}
	angular.extend(perk.prototype, PerkType.prototype);
	perk.prototype.getDesc = function() {
		if(CoC.player.tou >= 75) {
			return '<b>Grants immunity to stuns and some statuses.</b>';
		}
		return '<b>You aren\'t tough enough to benefit from this anymore.</b>';
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Resolute', 'Resolute', '<b>You choose the "Resolute" perk, granting immunity to stuns and some statuses.</b>']);
	};
	return perk;
});