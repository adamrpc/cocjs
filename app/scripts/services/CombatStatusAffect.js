'use strict';

angular.module('cocjs').factory('CombatStatusAffect', function (StatusAffectType) {
	var CombatStatusAffect = angular.copy(StatusAffectType.StatusAffectType);
	CombatStatusAffect.prototype.init = function(that, args) {
		StatusAffectType.StatusAffectType.prototype.init(this, args);
	};
	
	return CombatStatusAffect;
});
