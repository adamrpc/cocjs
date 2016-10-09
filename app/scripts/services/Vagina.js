'use strict';

angular.module('KeyItemClass').factory('Vagina', function (Utils) {
	function Vagina() {
		this.init(this, arguments);
	}
	Vagina.prototype.init = function(that, args) {
		//Vag wetness
		that.vaginalWetness = args.length > 0 ? args[0] : 1;
		/*Vag looseness
		0 - virgin
		1 - normal
		2 - loose
		3 - very loose
		4 - gaping
		5 - monstrous*/
		that.vaginalLooseness = args.length > 1 ? args[1] : 0;
		that.virgin = args.length > 2 ? args[2] : false;
		//Type
		//0 - Normal
		//5 - Black bugvag
		that.type = args.length > 3 ? args[3] : 0;
		//Used during sex to determine how full it currently is.  For multi-dick sex.
		that.fullness = 0;
		that.labiaPierced = 0;
		that.labiaPShort = '';
		that.labiaPLong = '';
		that.clitPierced = 0;
		that.clitPShort = '';
		that.clitPLong = '';
	};
	Vagina.prototype.validate = function() {
		var error = '';
		error += Utils.validateNonNegativeNumberFields(this, 'Vagina.validate', [
			'vaginalWetness', 'vaginalLooseness', 'type',
			'fullness', 'labiaPierced', 'clitPierced'
		]);
        _.forEach(['labia', 'clit'], function(value) {
            _.forEach(['PShort', 'PLong'], function(value2) {
                if(this[value + 'Pierced'] && this[value + value2] === '') {
                    error += _.capitalize(value) + ' pierced but ' + value + value2 + ' = \'\'. ';
                } else if(this[value + value2] !== '') {
                    error += _.capitalize(value) + ' not pierced but ' + value + value2 + ' = \'' + this[value + value2] + '\'. ';
                }
            });
        });
		return error;
	};
    var getFactor = function(value, factors, defaultFactor) {
		return (value >= 0 && value < factors.length) ? factors[value] : defaultFactor;
    };
	Vagina.prototype.wetnessFactor = function() {
        return getFactor(this.vaginalWetness, [1.25, 1, 0.8, 0.7, 0.6, 0.5], 0.5);
	};
	Vagina.prototype.capacity = function() {
        return getFactor(this.vaginalLooseness, [8, 16, 24, 36, 56, 100], 10000);
	};
	return Vagina;
});
