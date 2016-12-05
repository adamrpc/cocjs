'use strict';

angular.module('cocjs').factory('ElvenBountyPerk', function (PerkType) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function(params) {
		return "Increases fertility by " + params.value2 + "% and cum production by " + params.value1 + "mLs.";
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Elven Bounty", "Elven Bounty", "After your encounter with an elf, her magic has left you with increased fertility and virility."]);
	};
	return Perk;
});