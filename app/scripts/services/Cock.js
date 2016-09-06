'use strict';

angular.module('KeyItemClass').factory('Cock', function ($log, CockTypesEnum, Utils) {
	function Cock() {
		this.init(this, arguments);
	}
	//constructor. Default type is HUMAN
	Cock.prototype.init = function(that, args) {
		that.cockLength = args.length > 0 ? args[0] : 5.5;
		that.cockThickness = args.length > 1 ? args[1] : 1;
		that.cockType = args.length > 2 ? args[2] : CockTypesEnum.HUMAN; //See CockTypesEnum.as for all cock types
		that.knotMultiplier = 1; //Used to determine thickness of knot relative to normal thickness
		//Piercing info
		that.pierced = 0;
		that.isPierced = false;
		that.pShortDesc = '';
		that.pLongDesc = '';
		that.sock = '';
	};
	/**
	 * @return string description of errors
	 */
	Cock.prototype.validate = function() {
		var error = '';
		error += Utils.validateNonNegativeNumberFields(this,'Cock.validate',['cockLength','cockThickness','knotMultiplier','pierced']);
		if (!this.isPierced){
			if (this.pShortDesc.length > 0) {
				error += 'Not pierced but _pShortDesc = ' + this.pShortDesc + '. ';
			}
			if (this.pLongDesc.length > 0) {
				error += 'Not pierced but pLong = ' + this.pLongDesc + '. ';
			}
		} else {
			if (this.pShortDesc.length === 0) {
				error += 'Pierced but no pShortDesc. ';
			}
			if (this.pLongDesc.length === 0) {
				error += 'Pierced but no pLong. ';
			}
		}
		return error;
	};
	//MEMBER FUNCTIONS
	Cock.prototype.cArea = function() {
		return this.cockThickness * this.cockLength;
	};
	Cock.prototype.growCock = function(lengthDelta, bigCock) {
		if (lengthDelta === 0) {
			$log.warn('Whoops! growCock called with 0, aborting...');
			return lengthDelta;
		}
		var threshhold = 0;
		$log.trace('growcock starting at:' + lengthDelta);
		if (lengthDelta > 0) { // growing
			$log.trace('and growing...');
			threshhold = 24;
			// BigCock Perk increases incoming change by 50% and adds 12 to the length before diminishing returns set in
			if (bigCock) {
				$log.trace('growCock found BigCock Perk');
				lengthDelta *= 1.5;
				threshhold += 12;
			}
			// Not a human cock? Multiple the length before dimishing returns set in by 3
			if (this.cockType !== CockTypesEnum.HUMAN) {
				threshhold *= 2;
			}
			// Modify growth for cock socks
			if (this.sock === 'scarlet') {
				$log.trace('growCock found Scarlet sock');
				lengthDelta *= 1.5;
			} else if (this.sock === 'cobalt') {
				$log.trace('growCock found Cobalt sock');
				lengthDelta *= 0.5;
			}
			// Do diminishing returns
			if (this.cockLength > threshhold) {
				lengthDelta /= 4;
			} else if (this.cockLength > threshhold / 2) {
				lengthDelta /= 2;
			}
		} else {
			$log.trace('and shrinking...');
			threshhold = 0;
			// BigCock Perk doubles the incoming change value and adds 12 to the length before diminishing returns set in
			if (bigCock) {
				$log.trace('growCock found BigCock Perk');
				lengthDelta *= 0.5;
				threshhold += 12;
			}
			// Not a human cock? Add 12 to the length before dimishing returns set in
			if (this.cockType !== CockTypesEnum.HUMAN) {
				threshhold += 12;
			}
			// Modify growth for cock socks
			if (this.sock === 'scarlet') {
				$log.trace('growCock found Scarlet sock');
				lengthDelta *= 0.5;
			} else if (this.sock === 'cobalt') {
				$log.trace('growCock found Cobalt sock');
				lengthDelta *= 1.5;
			}
			// Do diminishing returns
			if (this.cockLength > threshhold) {
				lengthDelta /= 3;
			} else if (this.cockLength > threshhold / 2) {
				lengthDelta /= 2;
			}
		}
		$log.trace('then changing by: ' + lengthDelta);
		this.cockLength += lengthDelta;
		if (this.cockLength < 1) {
			this.cockLength = 1;
		}
		if (this.cockThickness > this.cockLength * 0.33) {
			this.cockThickness = this.cockLength * 0.33;
		}
		return lengthDelta;
	};
	
	Cock.prototype.thickenCock = function(increase) {
		var amountGrown = 0;
		var temp = 0;
		if (increase > 0) {
			while (increase > 0) {
				if (increase < 1) {
					temp = increase;
				} else {
					temp = 1;
				}
				//Cut thickness growth for huge dicked
				if (this.cockThickness > 1 && this.cockLength < 12) {
					temp /= 4;
				}
				if (this.cockThickness > 1.5 && this.cockLength < 18) {
					temp /= 5;
				}
				if (this.cockThickness > 2 && this.cockLength < 24) {
					temp /= 5;
				}
				if (this.cockThickness > 3 && this.cockLength < 30) {
					temp /= 5;
				}
				//proportional thickness diminishing returns.
				if (this.cockThickness > this.cockLength * 0.15) {
					temp /= 3;
				}
				if (this.cockThickness > this.cockLength * 0.20) {
					temp /= 3;
				}
				if (this.cockThickness > this.cockLength * 0.30) {
					temp /= 5;
				}
				//massive thickness limiters
				if (this.cockThickness > 4) {
					temp /= 2;
				}
				if (this.cockThickness > 5) {
					temp /= 2;
				}
				if (this.cockThickness > 6) {
					temp /= 2;
				}
				if (this.cockThickness > 7) {
					temp /= 2;
				}
				//Start adding up bonus length
				amountGrown += temp;
				this.cockThickness += temp;
				temp = 0;
				increase--;
			}
			increase = 0;
		} else if (increase < 0) {
			while (increase < 0) {
				temp = -1;
				//Cut length growth for huge dicked
				if (this.cockThickness <= 1) {
					temp /= 2;
				}
				if (this.cockThickness < 2 && this.cockLength < 10) {
					temp /= 2;
				}
				//Cut again for massively dicked
				if (this.cockThickness < 3 && this.cockLength < 18) {
					temp /= 2;
				}
				if (this.cockThickness < 4 && this.cockLength < 24) {
					temp /= 2;
				}
				//MINIMUM Thickness of OF .5!
				if (this.cockThickness <= 0.5) {
					temp = 0;
				}
				//Start adding up bonus length
				amountGrown += temp;
				this.cockThickness += temp;
				temp = 0;
				increase++;
			}
		}
		$log.trace('thickenCock called and thickened by: ' + amountGrown);
		return amountGrown;
	};
	return Cock;
});