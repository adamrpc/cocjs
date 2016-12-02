'use strict';

angular.module('cocjs').factory('BrutalBlowsPerk', function (PerkType, CoC) {
	function perk() {
		this.init(this, arguments);
	}
	angular.extend(perk.prototype, PerkType.prototype);
	perk.prototype.getDesc = function() {
		if(CoC.getInstance().player.str>=75) {
			return 'Reduces enemy armor with each hit.';
		}
		return '<b>You aren\'t strong enough to benefit from this anymore.</b>';
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Brutal Blows', 'Brutal Blows', 'You choose the "Brutal Blows" perk, which reduces enemy armor with each hit.']);
	};
	return perk;
});