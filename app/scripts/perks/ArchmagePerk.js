'use strict';

angular.module('cocjs').factory('ArchmagePerk', function (PerkType, CoC) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function() {
		if(CoC.player.inte>=75) {
			return 'Increases base spell strength by 50%.';
		}
		return '<b>You are too dumb to gain benefit from this perk.</b>';
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Archmage', 'Archmage', 'You choose the "Archmage" perk, increasing base spell strength by 50%.']);
	};
	return Perk;
});