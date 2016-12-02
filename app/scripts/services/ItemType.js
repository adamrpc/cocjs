'use strict';

angular.module('cocjs').factory('ItemType', function ( $log, CoC_Settings ) {
	function ItemType() {
		this.init(this, arguments);
	}
	
	var ITEM_LIBRARY = {};
	var ITEM_SHORT_LIBRARY = {};
	ItemType.prototype.init = function(that, args) {
		that.id = args[0];
		that.shortName = args.length > 1 && args[1] !== undefined ? args[1] : that.id;
		that.longName = args.length > 2 && args[2] !== undefined ? args[2] : that.shortName;
		that.value = args.length > 3 && args[3] !== undefined ? args[3] : 0;
		that.description = args.length > 4 && args[4] !== undefined ? args[4] : that.longName;
		if (ITEM_LIBRARY[that.id]) {
			CoC_Settings.error('Duplicate itemid ' + that.id + ', old item is ' + ITEM_LIBRARY[that.id].longName);
		}
		if (ITEM_SHORT_LIBRARY[that.shortName]){
			$log.warn( 'WARNING: Item with duplicate shortname: \''+ that.id + '\' and \'' + ITEM_SHORT_LIBRARY[that.shortName].id + '\' share ' + that.shortName);
		}
		ITEM_LIBRARY[that.id] = that;
		ITEM_SHORT_LIBRARY[that.shortName] = that;
	};
	ItemType.NOTHING = new ItemType('NOTHING!');
	ItemType.lookupItem = function(id) {
		return ITEM_LIBRARY[id];
	};
	ItemType.lookupItemByShort = function(shortName) {
		return ITEM_SHORT_LIBRARY[shortName];
	};
	ItemType.getItemLibrary = function() {
		return ITEM_LIBRARY;
	};
	ItemType.prototype.toString = function() {
		return '\"' + this.id + '\"';
	};
	return ItemType;
});
