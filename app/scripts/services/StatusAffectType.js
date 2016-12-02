'use strict';

angular.module('cocjs').factory('StatusAffectType', function (CoC_Settings) {
	var STATUSAFFECT_LIBRARY = {};
	
	function StatusAffectType() {
		this.init(this, arguments);
	}
	
	StatusAffectType.prototype.init = function(that, args) {
		that._id = args[0];
		if (STATUSAFFECT_LIBRARY[that._id]) {
			CoC_Settings.error('Duplicate status affect ' + that._id);
		}
		STATUSAFFECT_LIBRARY[that._id] = that;
	};

	/**
	 * Unique perk id, should be kept in future game versions
	 */
	StatusAffectType.prototype.getId = function() {
		return this._id;
	};


	StatusAffectType.prototype.toString = function() {
		return '\'' + this._id + '\'';
	};

	StatusAffectType.lookupStatusAffect = function(id){
		return STATUSAFFECT_LIBRARY[id];
	};

	StatusAffectType.getStatusAffectLibrary = function() {
		return STATUSAFFECT_LIBRARY;
	};
	
	return StatusAffectType;
});
