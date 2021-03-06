'use strict';

angular.module('cocjs').factory('EnlightenedPerk', function (PerkType, CoC) {
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
		PerkType.prototype.init(that, ["Enlightened", "Enlightened", "Jojo’s tutelage has given you a master’s focus and you can feel the universe in all its glory spread out before you. You’ve finally surpassed your teacher."]);
	};
	return Perk;
});