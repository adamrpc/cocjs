'use strict';

angular.module('cocjs').factory('BerzerkerPerk', function (PerkType, CoC) {
	var perk = angular.copy(PerkType);
	perk.prototype.getDesc = function() {
		if(CoC.getInstance().player.str>=75) {
			return 'Grants "Berzerk" ability.';
		}
		return '<b>You aren\'t strong enough to benefit from this anymore.</b>';
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Berzerker', 'Berzerker', 'You choose the "Berzerker" perk, which unlocks the "Berzerk" magical ability.  Berzerking increases attack and lust resistance but reduces physical defenses.']);
	};
	return perk;
});