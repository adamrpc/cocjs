'use strict';

angular.module('cocjs').factory('ElvenBountyPerk', function (PerkType) {
	function perk() {
		this.init(this, arguments);
	}
	angular.extend(perk.prototype, PerkType.prototype);
	perk.prototype.getDesc = function(params) {
		return "Increases fertility by " + params.value2 + "% and cum production by " + params.value1 + "mLs.";
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Elven Bounty", "Elven Bounty", "After your encounter with an elf, her magic has left you with increased fertility and virility."]);
	};
	return perk;
});