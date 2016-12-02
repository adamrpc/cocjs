'use strict';

angular.module('cocjs').factory('EnlightenedPerk', function (PerkType, CoC) {
	function perk() {
		this.init(this, arguments);
	}
	angular.extend(perk.prototype, PerkType.prototype);
	perk.prototype.getDesc = function() {
		if (CoC.getInstance().player.cor >= 10) {
			return "<b>DISABLED</b> - Corruption too high!";
		}
		return this.desc;
	};
	perk.prototype.init = function(that) {
		PerkType.prototype.init(that, ["Enlightened", "Enlightened", "Jojo’s tutelage has given you a master’s focus and you can feel the universe in all its glory spread out before you. You’ve finally surpassed your teacher."]);
	};
	return perk;
});