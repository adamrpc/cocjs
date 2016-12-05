'use strict';

angular.module('cocjs').factory('BrutalBlowsPerk', function (PerkType, CoC) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function() {
		if(CoC.player.str>=75) {
			return 'Reduces enemy armor with each hit.';
		}
		return '<b>You aren\'t strong enough to benefit from this anymore.</b>';
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Brutal Blows', 'Brutal Blows', 'You choose the "Brutal Blows" perk, which reduces enemy armor with each hit.']);
	};
	return Perk;
});