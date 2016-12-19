'use strict';

angular.module('cocjs').factory('Enum', function () {
	function Enum() {
		this.init(this, arguments);
	}
	
	Enum.prototype.init = function(that) {
		that._name = null;
		that._index = -1;
	};
	Enum.prototype.getName = function() {
		return this._name;
	};
	Enum.prototype.getIndex = function() {
		return this._index;
	};
	Enum.prototype.toString = function() {
		return this.getName();
	};
	Enum.ParseConstant = function(enumObj, i_constantName, i_caseSensitive) {
		/* jshint unused:true */
		return _.find(enumObj, function(value, key) {
			return (i_caseSensitive && key === i_constantName) || key.toLowerCase() === i_constantName.toLowerCase();
		});
	};
	Enum.ParseConstantByIndex = function(enumObj, i_constantIndex) {
		var values = _.values(enumObj);
		if(i_constantIndex < 0 || i_constantIndex >= values.length) {
			return null;
		}
		return values[i_constantIndex];
	};
	Enum.initEnum = function(enumObj) {
		var index = 0;
		_.forOwn(enumObj, function(value, key) {
			if(_.isObject(value)) {
				value._name = key;
				value._index = index;
				index++;
			}
		});
	};
	
	return Enum;
});
