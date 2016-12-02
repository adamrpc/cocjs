'use strict';

angular.module('cocjs').factory('ArchmagePerk', function (PerkType, CoC) {
	function perk() {
		this.init(this, arguments);
	}
	angular.extend(perk.prototype, PerkType.prototype);
	perk.prototype.getDesc = function() {
		if(CoC.getInstance().player.inte>=75) {
			return 'Increases base spell strength by 50%.';
		}
		return '<b>You are too dumb to gain benefit from this perk.</b>';
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Archmage', 'Archmage', 'You choose the "Archmage" perk, increasing base spell strength by 50%.']);
	};
	return perk;
});