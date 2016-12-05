'use strict';

angular.module('cocjs').factory('TacticianPerk', function (PerkType, CoC) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function() {
		if(CoC.player.inte >= 50) {
			return '<b>Increases critical hit chance by up to 10% (Intelligence-based).</b>';
		}
		return '<b>You are too dumb to gain benefit from this perk.</b>';
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Tactician', 'Tactician', '<b>You choose the "Tactician" perk, increasing critical hit chance by up to 10% (Intelligence-based).</b>']);
	};
	return Perk;
});