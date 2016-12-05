'use strict';

angular.module('cocjs').factory('BerzerkerPerk', function (PerkType, CoC) {
	function Perk() {
		this.init(this, arguments);
	}
	angular.extend(Perk.prototype, PerkType.prototype);
	Perk.prototype.getDesc = function() {
		if(CoC.player.str>=75) {
			return 'Grants "Berzerk" ability.';
		}
		return '<b>You aren\'t strong enough to benefit from this anymore.</b>';
	};
	Perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ['Berzerker', 'Berzerker', 'You choose the "Berzerker" perk, which unlocks the "Berzerk" magical ability.  Berzerking increases attack and lust resistance but reduces physical defenses.']);
	};
	return Perk;
});