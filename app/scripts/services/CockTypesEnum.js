'use strict';
/* Cock types
 * 0 - human
 * 1 - horse
 * 2 - dog
 * 3 - demon
 * 4 - tentacle?
 * 5 - CAT
 * 6 - Lizard/Naga?
 * 7 - ANEMONE!
 * 8 - ugliest wang ever (kangaroo)
 * 9 - dragon
 * 10 - displacer
 * 11 - Fox	

 Group Types used for general description code (eventually)
 * human  	- obvious
 * mammal 	- obvious again
 * super 	- supernatural types
 * tentacle - only one tentacle!
 * reptile	- make a guess
 * seaworld - Anything in the water
 * other	- doesn't fit anywhere else
 */
angular.module('cocjs').factory('CockTypesEnum', function (Enum) {
	function CockTypesEnum() {
		this.init(this, arguments);
	}
	angular.extend(CockTypesEnum.prototype, Enum.prototype);
	CockTypesEnum.prototype.init = function(that, args) {
		Enum.prototype.init(that);
		that.group = args[0];
	};
	CockTypesEnum.ParseConstant = function(i_constantName, i_caseSensitive) {
		return Enum.ParseConstant(CockTypesEnum, i_constantName, i_caseSensitive);
	};
	CockTypesEnum.ParseConstantByIndex = function(i_constantIndex) {
		return Enum.ParseConstantByIndex(CockTypesEnum, i_constantIndex);
	};
	CockTypesEnum.HUMAN = new CockTypesEnum('human');
	CockTypesEnum.HORSE = new CockTypesEnum('mammal');
	CockTypesEnum.DOG = new CockTypesEnum('mammal');
	CockTypesEnum.DEMON = new CockTypesEnum('super');
	CockTypesEnum.TENTACLE = new CockTypesEnum('tentacle');
	CockTypesEnum.CAT = new CockTypesEnum('mammal');
	CockTypesEnum.LIZARD = new CockTypesEnum('reptile');
	CockTypesEnum.ANEMONE = new CockTypesEnum('seaworld');
	CockTypesEnum.KANGAROO = new CockTypesEnum('mammal');
	CockTypesEnum.DRAGON = new CockTypesEnum('reptile');
	CockTypesEnum.DISPLACER = new CockTypesEnum('other');
	CockTypesEnum.FOX = new CockTypesEnum('mammal');
	CockTypesEnum.BEE = new CockTypesEnum('insect');
	CockTypesEnum.UNDEFINED = new CockTypesEnum('');
	Enum.initEnum(CockTypesEnum);
	return CockTypesEnum;
});
