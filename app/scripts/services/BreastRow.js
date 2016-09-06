'use strict';

angular.module('cocjs').factory('BreastRow', function (Utils) {
	function BreastRow() {
		this.init(this, arguments);
	}
	
	BreastRow.prototype.init = function(that) {
		that.breasts = 2;
		that.nipplesPerBreast = 1;
		that.breastRating = 0;
		that.lactationMultiplier = 0;
		//Fullness used for lactation....if 75 or greater warning bells start going off!
		//If it reaches 100 it reduces lactation multiplier.
		that.milkFullness = 0;
		that.fullness = 0;
		that.fuckable = false;
	};
	
	BreastRow.prototype.validate = function() {
		return Utils.validateNonNegativeNumberFields(this, 'BreastRowClass.validate', ['breasts', 'nipplesPerBreast', 'breastRating', 'lactationMultiplier', 'milkFullness', 'fullness']);
	};
	return BreastRow;
});
