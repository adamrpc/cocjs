'use strict';

angular.module('cocjs').factory('CommonItem', function ( ItemType ) {
	var CommonItem = angular.copy(ItemType);
	CommonItem.prototype.init = function(that, args) {
		ItemType.prototype.init(that, args);
	};
	return CommonItem;
});
