'use strict';

angular.module('cocjs').factory('Utils', function ($log, CoC_Settings) {
	var NUMBER_WORDS_NORMAL = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
	var NUMBER_WORDS_POSITIONAL = ["zeroth", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
	
	var curry = function(func) {
		var args = _.slice(Array.from( arguments ), 1);
		if (!func) {
			CoC_Settings.error('curryFunction(null,' + args + ')');
		}
		return function () {
			return func.apply(null,_.concat(args, Array.from( arguments )));
		};
	};
		
	var formatStringArray = function(stringList) {
		if(!stringList) {
			return '';
		}
		if(arguments.length === 1 && _.isString(stringList)) {
			return stringList;
		}
		if(arguments.length > 1 && !_.isArray(stringList)) {
			stringList = Array.from(arguments);
		}
		switch (stringList.length) {
			case  0: return '';
			case  1: return stringList[0];
			default: return _.join(_.slice(stringList, 0, stringList.length - 1), ', ') + ' and ' + stringList[stringList.length - 1];
		}
	};
		
	var num2Text = function(number) {
		if (number >= 0 && number <= 10) {
			return NUMBER_WORDS_NORMAL[number];
		}
		return number.toString();
	};
	
	var num2Text2 = function(number) {
		if (number < 0) {
			return number.toString();
		}
		if (number <= 10) {
			return NUMBER_WORDS_POSITIONAL[number];
		}
		switch (number % 10) {
			case 1: return number.toString() + "st";
			case 2: return number.toString() + "nd";
			case 3: return number.toString() + "rd";
			default:
		}
		return number.toString() + "th";
	};
	
	var Num2Text = function(number) {
		return _.capitalize(num2Text(number));
	};
	
	var randomChoice = function() {
		var args = Array.from( arguments );
		if(args.length === 0) {
			$log.warn('No argument passed to randomChoice');
			return null;
		}
		if ((args.length === 1) && (_.isArray(args[0]))) {
			args = args[0];
		}
		return _.sample(args);
	};
		
	var rand = function(max) {
		return _.random(0, max - 1);
	};

    var validateFields = function(o, func, fieldNames, validationFunc) {
		var error = '';
		_.forEach(fieldNames, function(field) {
			if (!_.has(o, field) || (!validationFunc(o[field]) && o[field] !== null)) {
				error += 'Misspelling in ' + func + '.' + field + '. ';
			} else if (o[field] === null) {
				error += 'Null \'' + field + '\'. ';
			} else if (_.isNumber(o[field]) && o[field] < 0) {
				error += 'Negative \'' + field + '\'. ';
			}else if (o[field] === '') {
				error += 'Empty \'' + field+ '\'. ';
			}
		});
		return error;
    };
	
	var validateNonNegativeNumberFields = function(o, func, nnf) {
        return validateFields(o, func, nnf, _.isNumber);
	};
		
	var validateNonEmptyStringFields = function(o, func, nef) {
        return validateFields(o, func, nef, _.isString);
	};
	
	var createMapFromPairs = function(src) {
		var result = {};
		_.forEach(src, function(value) {
			result[value[0]] = value[1];
		});
		return result;
	};
	
	return {
		curry: curry,
		formatStringArray: formatStringArray,
		num2Text: num2Text,
		num2Text2: num2Text2,
		Num2Text: Num2Text,
		randomChoice: randomChoice,
		rand: rand,
		validateNonNegativeNumberFields: validateNonNegativeNumberFields,
		validateNonEmptyStringFields: validateNonEmptyStringFields,
		createMapFromPairs: createMapFromPairs
	};
});
