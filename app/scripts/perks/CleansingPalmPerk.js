'use strict';

angular.module('cocjs').factory('CleansingPalmPerk', function (PerkType, CoC) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function() {
		if (CoC.player.cor >= 10) {
			return "<b>DISABLED</b> - Corruption too high!";
		}
		return this.desc;
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Cleansing Palm", "Cleansing Palm", "A ranged fighting technique of Jojo’s order, allows you to blast your enemies with waves of pure spiritual energy, weakening them and hurting the corrupt."]);
	};
	return Perk;
});