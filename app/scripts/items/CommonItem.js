'use strict';

angular.module('cocjs').factory('CommonItem', function ( ItemType ) {
	function CommonItem() {
		this.init(this, arguments);
	}
	angular.extend(CommonItem.prototype, ItemType.prototype);
	CommonItem.prototype.init = function(that, args) {
		ItemType.prototype.init(that, args);
		that.classNames.push('CommonItem');
	};
	return CommonItem;
});
