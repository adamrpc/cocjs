'use strict';

angular.module('cocjs').factory('Useable', function ( CommonItem, CoC_Settings ) {
	function Useable() {
		this.init(this, arguments);
	}
	angular.extend(Useable.prototype, CommonItem.prototype);
	Useable.prototype.init = function(that, args) {
		CommonItem.prototype.init(that, args);
		that.classNames.push('Useable');
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
