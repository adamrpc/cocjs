'use strict';

angular.module('cocjs').factory('Ass', function (Utils) {
	function Ass() {
		this.init(this, arguments);
	}
	
	Ass.prototype.init = function(that) {
		//butt wetness
		that.analWetness = 0;
		/*butt looseness
		0 - virgin
		1 - normal
		2 - loose
		3 - very loose
		4 - gaping
		5 - monstrous*/
		that.analLooseness = 0;
		//Used during sex to determine how full it currently is.  For multi-dick sex.
		that.analWetness = 0;
		that.fullness = 0;
		that.analWetness = 0;
	};
	
	Ass.prototype.validate = function() {
		return Utils.validateNonNegativeNumberFields(this, 'Ass.validate',['analWetness', 'analLooseness', 'fullness']);
	};
	return Ass;
});
