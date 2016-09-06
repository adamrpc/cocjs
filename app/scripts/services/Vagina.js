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
		if (this.labiaPierced) {
			if (this.labiaPShort === '') {
				error += 'Labia pierced but labiaPShort = \'\'. ';
			}
			if (this.labiaPLong === '') {
				error += 'Labia pierced but labiaPLong = \'\'. ';
			}
		} else {
			if (this.labiaPShort !== '') {
				error += 'Labia not pierced but labiaPShort = \'' + this.labiaPShort + '\'. ';
			}
			if (this.labiaPLong !== '') {
				error += 'Labia not pierced but labiaPLong = \'' + this.labiaPShort + '\'. ';
			}
		}
		if (this.clitPierced) {
			if (this.clitPShort === '') {
				error += 'Clit pierced but labiaPShort = \'\'. ';
			}
			if (this.clitPLong === '') {
				error += 'Clit pierced but labiaPLong = \'\'. ';
			}
		} else {
			if (this.clitPShort !== '') {
				error += 'Clit not pierced but labiaPShort = \'' + this.labiaPShort + '\'. ';
			}
			if (this.clitPLong !== '') {
				error += 'Clit not pierced but labiaPLong = \'' + this.labiaPShort + '\'. ';
			}
		}
		return error;
	};
	Vagina.prototype.wetnessFactor = function() {
		if(this.vaginalWetness >= 0 && this.vaginalWetness < 6) {
			return [1.25, 1, 0.8, 0.7, 0.6, 0.5][this.vaginalWetness];
		}
		return 0.5;
	};
	Vagina.prototype.capacity = function() {
		if(this.vaginalLooseness >= 0 && this.vaginalLooseness < 6) {
			return [8, 16, 24, 36, 56, 100][this.vaginalLooseness];
		}
		return 10000;
	};
	return Vagina;
});