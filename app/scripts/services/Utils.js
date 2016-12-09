'use strict';

angular.module('cocjs').factory('Utils', function ($log, CoC_Settings) {
	var NUMBER_WORDS_NORMAL = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
	var NUMBER_WORDS_CAPITAL = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
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
		if (number >= 0 && number <= 10) {
			return NUMBER_WORDS_CAPITAL[number];
		}
		return number.toString();
	};
	
	var randomChoice = function() {
		var args = Array.from( arguments );
		if ((args.length === 1) && (_.isArray(args[0]))) {
			args = args[0];
		}
		if(args.length === 0) {
			$log.warn('No argument passed to randomChoice');
			return null;
		}
		return _.shuffle(args)[0];
	};
		
	var rand = function(max) {
		return _.random(0, max - 1);
	};

    var validateFields = function(o, func, fieldNames, validationFunc) {
		var error = '';
		_.forEach(fieldNames, function(field) {
			if (!_.has(o, field) || (!validationFunc(o[field]) && o[field] !== null)) {
				error = error + 'Misspelling in ' + func + '.' + field + '. ';
			} else if (o[field] === null) {
				error = error + 'Null \'' + field + '\'. ';
			} else if (o[field] < 0) {
				error = error + 'Negative \'' + field + '\'. ';
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
