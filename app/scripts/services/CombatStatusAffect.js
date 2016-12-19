'use strict';

angular.module('cocjs').factory('CombatStatusAffect', function (StatusAffectType) {
	function CombatStatusAffect() {
		this.init(this, arguments);
	}
	angular.extend(CombatStatusAffect.prototype, StatusAffectType.prototype);
	CombatStatusAffect.prototype.init = function(that, args) {
		StatusAffectType.prototype.init(that, args);
	};
	
	return CombatStatusAffect;
});
