﻿'use strict';

angular.module('cocjs').factory('Useable', function ( CommonItem, CoC_Settings ) {
	var Useable = angular.copy(CommonItem);
	Useable.prototype.init = function(that, args) {
		CommonItem.prototype.init(that, args);
	};
	Useable.prototype.canUse = function() { //If an item cannot be used it should provide some description of why not
		return true;
	};
	Useable.prototype.useItem = function() {
		CoC_Settings.errorAMC('Useable', 'useItem', this.id);
		return false;
	};
	Useable.prototype.useText = function() {}; //Produces any text seen when using or equipping the item normally
	return Useable;
});