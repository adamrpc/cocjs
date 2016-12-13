'use strict';

describe('Factory: Utils', function() {
	beforeEach(module('cocjs'));
	var utils;
	var CoC_Settings_mock = {
		error: function() {}
	};
	var log_mock = {
		warn: function() {}
	};
	beforeEach(module(function ($provide) {
		$provide.value('CoC_Settings', CoC_Settings_mock);
		$provide.value('$log', log_mock);
	}));
	beforeEach(inject(function(Utils) {
		utils = Utils;
	}));
	it('Should define Utils', function() {
		expect(utils).toBeDefined();
	});
	it('Should define curry', function() {
		expect(utils.curry).toBeDefined();
	});
	it('Should trigger an error', function() {
		spyOn(CoC_Settings_mock, 'error');
		utils.curry();
		expect(CoC_Settings_mock.error).toHaveBeenCalledWith('curryFunction(null,)');
	});
	it('Should return a callable function without args', function() {
		spyOn(CoC_Settings_mock, 'error');
		var test = null;
		var result = utils.curry(function() { test = 'aaa'; });
		expect(CoC_Settings_mock.error.calls.count()).toBe(0);
		result();
		expect(test).toBe('aaa');
	});
	it('Should return a callable function with 1 arg', function() {
		spyOn(CoC_Settings_mock, 'error');
		var test = null;
		var result = utils.curry(function(value) { test = value; }, 'bbb');
		expect(CoC_Settings_mock.error.calls.count()).toBe(0);
		result();
		expect(test).toBe('bbb');
	});
	it('Should return a callable function with multiple args', function() {
		spyOn(CoC_Settings_mock, 'error');
		var test1 = null;
		var test2 = null;
		var result = utils.curry(function(value1, value2) { test1 = value1; test2 = value2; }, 'ccc', 'ddd');
		expect(CoC_Settings_mock.error.calls.count()).toBe(0);
		result();
		expect(test1).toBe('ccc');
		expect(test2).toBe('ddd');
	});
	it('Should define formatStringArray', function() {
		expect(utils.formatStringArray).toBeDefined();
	});
	it('Should return empty string', function() {
		expect(utils.formatStringArray()).toBe('');
		expect(utils.formatStringArray([])).toBe('');
	});
	it('Should return parameter as string', function() {
		expect(utils.formatStringArray( 'test' )).toBe('test');
		expect(utils.formatStringArray(['test'])).toBe('test');
	});
	it('Should return parameters as string', function() {
		expect(utils.formatStringArray( 'test', 'test2', 'test3' )).toBe('test, test2 and test3');
		expect(utils.formatStringArray(['test', 'test2', 'test3'])).toBe('test, test2 and test3');
	});
	it('Should define num2Text', function() {
		expect(utils.num2Text).toBeDefined();
	});
	it('Should return number as word', function() {
		var NUMBER_WORDS_NORMAL = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
		for(var i = 0; i <= 10; i++) {
			expect(utils.num2Text( i )).toBe( NUMBER_WORDS_NORMAL[i] );
			expect(utils.num2Text( i.toString() )).toBe( NUMBER_WORDS_NORMAL[i] );
		}
	});
	it('Should return number as number', function() {
		for(var i = 11; i <= 20; i++) {
			expect(utils.num2Text( i )).toBe( i.toString() );
		}
	});
	it('Should define num2Text2', function() {
		expect(utils.num2Text2).toBeDefined();
	});
	it('Should return number as word', function() {
		for(var i = -10; i < 0; i++) {
			expect(utils.num2Text2( i )).toBe( i.toString() );
			expect(utils.num2Text2( i.toString() )).toBe( i.toString() );
		}
	});
	it('Should return number as word', function() {
		var NUMBER_WORDS_POSITIONAL = ["zeroth", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
		for(var i = 0; i <= 10; i++) {
			expect(utils.num2Text2( i )).toBe( NUMBER_WORDS_POSITIONAL[i] );
			expect(utils.num2Text2( i.toString() )).toBe( NUMBER_WORDS_POSITIONAL[i] );
		}
	});
	it('Should return number as number', function() {
			expect(utils.num2Text2( 11 )).toBe( '11st' );
			expect(utils.num2Text2( 12 )).toBe( '12nd' );
			expect(utils.num2Text2( 13 )).toBe( '13rd' );
			expect(utils.num2Text2( 14 )).toBe( '14th' );
			expect(utils.num2Text2( 15 )).toBe( '15th' );
			expect(utils.num2Text2( 16 )).toBe( '16th' );
			expect(utils.num2Text2( 17 )).toBe( '17th' );
			expect(utils.num2Text2( 18 )).toBe( '18th' );
			expect(utils.num2Text2( 19 )).toBe( '19th' );
			expect(utils.num2Text2( 20 )).toBe( '20th' );
			expect(utils.num2Text2( 21 )).toBe( '21st' );
			expect(utils.num2Text2( 22 )).toBe( '22nd' );
			expect(utils.num2Text2( 23 )).toBe( '23rd' );
			expect(utils.num2Text2( 24 )).toBe( '24th' );
	});
	it('Should define Num2Text', function() {
		expect(utils.Num2Text).toBeDefined();
	});
	it('Should return number as word', function() {
		var NUMBER_WORDS_CAPITAL = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
		for(var i = 0; i <= 10; i++) {
			expect(utils.Num2Text( i )).toBe( NUMBER_WORDS_CAPITAL[i] );
			expect(utils.Num2Text( i.toString() )).toBe( NUMBER_WORDS_CAPITAL[i] );
		}
	});
	it('Should return number as number', function() {
		for(var i = 11; i <= 20; i++) {
			expect(utils.Num2Text( i )).toBe( i.toString() );
		}
	});
	it('Should define randomChoice', function() {
		expect(utils.randomChoice).toBeDefined();
	});
	it('Should trigger a warning', function() {
		spyOn(log_mock, 'warn');
		expect(utils.randomChoice()).toBe(null);
		expect(log_mock.warn).toHaveBeenCalledWith('No argument passed to randomChoice');
	});
	it('Should return the parameter', function() {
		spyOn(log_mock, 'warn');
		expect(utils.randomChoice('aaa')).toBe('aaa');
		expect(utils.randomChoice(['aaa'])).toBe('aaa');
		expect(log_mock.warn.calls.count()).toBe(0);
	});
	it('Should return one of the parameter', function() {
		spyOn(log_mock, 'warn');
		var callback = function(arr) {
			return arr[0];
		};
		spyOn(_, 'sample').and.callFake(function(arr) {
			return callback(arr);
		});
		expect(utils.randomChoice('aaa', 'bbb', 'ccc')).toBe( 'aaa' );
		expect(log_mock.warn.calls.count()).toBe(0);
		expect(_.sample).toHaveBeenCalledWith(['aaa', 'bbb', 'ccc']);
		_.sample.calls.reset();
		callback = function(arr) {
			return arr[1];
		};
		expect(utils.randomChoice('aaa', 'bbb', 'ccc')).toBe( 'bbb' );
		expect(_.sample).toHaveBeenCalledWith(['aaa', 'bbb', 'ccc']);
	});
	it('Should return one item of the first parameter', function() {
		spyOn(log_mock, 'warn');
		var callback = function(arr) {
			return arr[0];
		};
		spyOn(_, 'sample').and.callFake(function(arr) {
			return callback(arr);
		});
		expect(utils.randomChoice(['aaa', 'bbb', 'ccc'])).toBe( 'aaa' );
		expect(log_mock.warn.calls.count()).toBe(0);
		expect(_.sample).toHaveBeenCalledWith(['aaa', 'bbb', 'ccc']);
		_.sample.calls.reset();
		callback = function(arr) {
			return arr[1];
		};
		expect(utils.randomChoice(['aaa', 'bbb', 'ccc'])).toBe( 'bbb' );
		expect(_.sample).toHaveBeenCalledWith(['aaa', 'bbb', 'ccc']);
	});
	it('Should define rand', function() {
		expect(utils.rand).toBeDefined();
	});
	it('Should return a value in wanted range', function() {
		var callback = function(min, max) {
			return max;
		};
		spyOn(_, 'random').and.callFake(function(min, max) {
			return callback(min, max);
		});
		expect(utils.rand(6)).toBe( 5 );
		expect(_.random).toHaveBeenCalledWith(0, 5);
		_.random.calls.reset();
		callback = function(min, max) {
			return max - 1;
		};
		expect(utils.rand(6)).toBe( 4 );
		expect(_.random).toHaveBeenCalledWith(0, 5);
	});
	it('Should define validateNonNegativeNumberFields', function() {
		expect(utils.validateNonNegativeNumberFields).toBeDefined();
	});
	it('Should work with valid number', function() {
		expect(utils.validateNonNegativeNumberFields({test:0, test2:2}, 'myFunction', ['test', 'test2'])).toBe('');
	});
	it('Should not allow invalid values', function() {
		expect(utils.validateNonNegativeNumberFields({test:0, test2:-1}, 'myFunction', ['test', 'test2'])).toBe('Negative \'test2\'. ');
		expect(utils.validateNonNegativeNumberFields({test:-2, test2:-1}, 'myFunction', ['test', 'test2'])).toBe('Negative \'test\'. Negative \'test2\'. ');
		expect(utils.validateNonNegativeNumberFields({test:-2, test2:'-1'}, 'myFunction', ['test', 'test2'])).toBe('Negative \'test\'. Misspelling in myFunction.test2. ');
		expect(utils.validateNonNegativeNumberFields({test:-2, test2:null}, 'myFunction', ['test', 'test2'])).toBe('Negative \'test\'. Null \'test2\'. ');
	});
	it('Should define validateNonEmptyStringFields', function() {
		expect(utils.validateNonEmptyStringFields).toBeDefined();
	});
	it('Should work with valid strings', function() {
		expect(utils.validateNonEmptyStringFields({test:'aaa', test2:'bbb'}, 'myFunction', ['test', 'test2'])).toBe('');
	});
	it('Should not allow invalid values', function() {
		expect(utils.validateNonEmptyStringFields({test:'aaa', test2:1}, 'myFunction', ['test', 'test2'])).toBe('Misspelling in myFunction.test2. ');
		expect(utils.validateNonEmptyStringFields({test:1, test2:-1}, 'myFunction', ['test', 'test2'])).toBe('Misspelling in myFunction.test. Misspelling in myFunction.test2. ');
		expect(utils.validateNonEmptyStringFields({test:'aaa', test2:'-1'}, 'myFunction', ['test', 'test2'])).toBe('');
		expect(utils.validateNonEmptyStringFields({test:'', test2:null}, 'myFunction', ['test', 'test2'])).toBe('Empty \'test\'. Null \'test2\'. ');
	});
	it('Should define createMapFromPairs', function() {
		expect(utils.createMapFromPairs).toBeDefined();
	});
	it('Should work with valid parameter', function() {
		var result = utils.createMapFromPairs([['test', 0], ['test2', 'aaa'], ['test3', null]]);
		expect(_.differenceWith(_.keys(result), ['test', 'test2', 'test3'], _.isEqual).length).toBe(0);
		expect(result.test).toBe(0);
		expect(result.test2).toBe('aaa');
		expect(result.test3).toBe(null);
	});
});