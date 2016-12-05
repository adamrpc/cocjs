'use strict';

angular.module('cocjs').factory('PiercedCrimstonePerk', function (PerkType) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function(params) {
		return "Increases minimum lust by " + Math.round(params.value1) + ".";
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Pierced: Crimstone", "Pierced: Crimstone", "You've been pierced with Crimstone and your lust seems to stay a bit higher than before."]);
	};
	return Perk;
});