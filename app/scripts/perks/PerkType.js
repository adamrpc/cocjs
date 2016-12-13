'use strict';

angular.module('cocjs').factory('PerkType', function (CoC_Settings) {
	var PERK_LIBRARY = {};
	function PerkType() {
		this.init(this, arguments);
	}
	PerkType.prototype.init = function(that, args) {
		that.id = args[0];
		that.name = args[1];
		that.desc = args[2];
		that.longDesc = args[3] || that.desc;
		if (PERK_LIBRARY[that.id]) {
			CoC_Settings.error("Duplicate perk id " + that.id + ", old perk is " + PERK_LIBRARY[that.id].name);
		}
		PERK_LIBRARY[that.id] = that;
	};
	PerkType.lookupPerk = function(id){
		return PERK_LIBRARY[id];
	};
	PerkType.getPerkLibrary = function() {
		return PERK_LIBRARY;
	};
	PerkType.prototype.toString = function() {
		return '"' + this.id + '"';
	};
	PerkType.prototype.getDesc = function() {
		return this.desc;
	};
	return PerkType;
});
