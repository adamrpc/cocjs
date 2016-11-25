'use strict';

angular.module('cocjs').factory('BreastStore', function (CoC, Utils, Appearance, AppearanceDefs, $log) {
	var MAX_FLAG_VALUE = 2999;
	var BREAST_STORE_VERSION_1 = '1';
	var LACTATION_BOOST = [0, 0, 2, 3, 6, 9, 17]; //Disabled, None, Light, Moderate, Strong, Heavy, Epic

	function BreastStore(breastFlag) {
		this._breastFlag = breastFlag;
		this._cupSize = 0;
		this._fullness = 0; //How much milk the breasts currently hold - use milkQuantity to decide how much milk is produced in a scene
					    	//The milkIsFull and milkIsOverflowing functions let you know how much the NPC wants to be milked
		this._lactation = 0; //How fast the breasts refill with milk
		this._nippleLength = 0;
		this._timesMilked = 0; //How many times has this NPC been milked - only used internally
		this._rows = 0; //Number of rows of breasts. All assumed to be the same size
		this.preventLactationIncrease = 0; //Control the points at which the lactation stops increasing or decreasing
		this.preventLactationDecrease = 0;

		if (this._breastFlag < 1 || this._breastFlag > MAX_FLAG_VALUE) {
			$log.error('BreastStore created with invalid flag value. BreastStore(' + breastFlag + ')');
		}
	}
	
	BreastStore.LACTATION_DISABLED = 0;
	BreastStore.LACTATION_NONE = 1; //Full == (>= 50), Overfull == (>= 60 + 5 * _lactationLevel), Overload == (>= 60 + 20 * _lactationLevel)
	BreastStore.LACTATION_LIGHT = 2; //Full after 25 hours, overfull after 35 hours, overloaded after 50 hours
	BreastStore.LACTATION_MODERATE = 3; //Full after 17 hours, overfull after 25 hours, overloaded after 40 hours
	BreastStore.LACTATION_STRONG = 4; //Full after  9 hours, overfull after 15 hours, overloaded after 30 hours
	BreastStore.LACTATION_HEAVY = 5; //Full after  6 hours, overfull after 12 hours, overloaded after 27 hours
	BreastStore.LACTATION_EPIC = 6; //Full after  3 hours, overfull after  9 hours, overloaded after 24 hours

	
	BreastStore.prototype.getRows = function() {
		return this._rows;
	};
	BreastStore.prototype.setRows = function(value) {
		if (value < 1) {
			value = 1;
		}
		this._rows = value;
	};
	BreastStore.prototype.getCupSize = function() {
		return this._cupSize;
	};
	BreastStore.prototype.setCupSize = function(value) {
		if (value < AppearanceDefs.BREAST_CUP_FLAT) {
			value = AppearanceDefs.BREAST_CUP_FLAT;
		}
		if (value > AppearanceDefs.BREAST_CUP_ZZZ_LARGE) {
			value = AppearanceDefs.BREAST_CUP_ZZZ_LARGE;
		}
		this._cupSize = value;
	};
	BreastStore.prototype.getLactationLevel = function() {
		return this._lactation;
	};
	BreastStore.prototype.setLactationLevel = function(value) {
		if (value < BreastStore.LACTATION_DISABLED) {
			value = BreastStore.LACTATION_DISABLED;
		}
		if (value > BreastStore.LACTATION_EPIC) {
			value = BreastStore.LACTATION_EPIC;
		}
		if (this._lactation <= BreastStore.LACTATION_NONE && value >= BreastStore.LACTATION_LIGHT) { //Lactation is just starting - zero the other vars involved
			this._fullness = 0;
			this._timesMilked = 0;
		}
		this._lactation = value;
	};
	BreastStore.prototype.getNippleLength = function() {
		return this._nippleLength;
	};
	BreastStore.prototype.setNippleLength = function(value) {
		if (value < 0) {
			value = 0;
		}
		this._nippleLength = 0.1 * Math.round(10 * value); //Ensure nipple length only goes to one decimal place
	};
		
	//Implementation of SaveAwareInterface
	BreastStore.prototype.updateAfterLoad = function() {
		if (this._breastFlag < 1 || this._breastFlag > MAX_FLAG_VALUE) {
			return;
		}
		var flagData = CoC.getInstance().flags[this._breastFlag].toString().split('^');
		if (flagData.length < 9) {
			//Loading from a file that doesn't contain appropriate save data.
			//Values will either have to be assigned in Saves.unFuckSave() or by the first encounter with this NPC
			return;
		}
		//For now there's no need to check the version. If this class is ever updated to save more the version will become useful.
		this.setRows(parseInt(flagData[1]));
		this.setCupSize(parseInt(flagData[2]));
		this.setLactationLevel(parseInt(flagData[3]));
		this.setNippleLength(parseFloat(flagData[4]));
		this._fullness = parseInt(flagData[5]);
		this._timesMilked = parseInt(flagData[6]);
		this.preventLactationIncrease = parseInt(flagData[7]);
		this.preventLactationDecrease = parseInt(flagData[8]);
	};
	
	BreastStore.prototype.updateBeforeSave = function() {
		if (this._breastFlag < 1 || this._breastFlag > MAX_FLAG_VALUE) {
			return;
		}
		CoC.getInstance().flags[this._breastFlag] = BREAST_STORE_VERSION_1 + '^' + this.getRows() + '^' + this.getCupSize() + '^' + this.getLactationLevel() + '^' + this.getNippleLength() + '^' + this._fullness + '^' + this._timesMilked + '^' + this.preventLactationIncrease + '^' + this.preventLactationDecrease;
	};
	//End of Interface Implementation

	BreastStore.breastDescript = function(size, lactation) {
		if(!lactation) {
			lactation = 0;
		}
		if (size < 1) {
			return 'flat breasts';
		}
		var descript = Utils.randomChoice(Appearance.breastSize(size), ''); //Add a description of the breast size 50% of the time
		switch (Utils.rand(10)) {
			case 1:
				if (lactation > 2) {
					return descript + 'milk-udders';
				}
				break;
			case 2:
				if (lactation > 1.5) {
					descript = descript + 'milky ';
				}
				if (size > 4) {
					return descript + 'tits';
				}
				break;
			case 4:
			case 5:
			case 6:
				return descript + 'tits';
			case 7:
				if (lactation >= 2.5) {
					return descript + 'udders';
				}
				if (lactation >= 1) {
					descript = descript + 'milk ';
				}
				return descript + 'jugs';
			case 8:
				if (size > 6) {
					return descript + 'love-pillows';
				}
				return descript + 'boobs';
			case 9:
				if (size > 6) {
					return descript + 'tits';
				}
		}
		return descript + 'breasts';
	};

	BreastStore.prototype.advanceTime = function() {
		if (this._lactation <= BreastStore.LACTATION_NONE) {
			return;
		}
		//Add to breastFullness and possibly adjust lactationLevel. Even when lactationLevel == LACTATION_NONE this is still doing something useful, adjusting _breastTimesMilked
		this._fullness = this._fullness + LACTATION_BOOST[this._lactation]; //Higher lactation means faster refill
		if (this._fullness > 60 + 20 * LACTATION_BOOST[this._lactation]) { //100 at LACTATION_LIGHT, 180 at LACTATION_EPIC - fullness over this value is overloaded, lactation may be reduced
			this._fullness = 50; //This way fullness won't immediately hit the limit again
			if (this._timesMilked >= 5) {
				this._timesMilked = this._timesMilked - 5; //If enough milkings have occured then don't reduce lactation level right away
			} else if (this.preventLactationDecrease !== this._lactation) {
				this._lactation--;
			}
		}
	};
	
	BreastStore.prototype.adj = function() {
		switch (this._cupSize) {
			case AppearanceDefs.BREAST_CUP_FLAT: return 'non-existent';
			case AppearanceDefs.BREAST_CUP_A: return 'small';
			case AppearanceDefs.BREAST_CUP_B:
			case AppearanceDefs.BREAST_CUP_C: return 'palmable';
			case AppearanceDefs.BREAST_CUP_D:
			case AppearanceDefs.BREAST_CUP_DD:
			case AppearanceDefs.BREAST_CUP_DD_BIG: return 'sizeable';
			case AppearanceDefs.BREAST_CUP_E:
			case AppearanceDefs.BREAST_CUP_E_BIG:
			case AppearanceDefs.BREAST_CUP_EE:
			case AppearanceDefs.BREAST_CUP_EE_BIG:
			case AppearanceDefs.BREAST_CUP_F:
			case AppearanceDefs.BREAST_CUP_F_BIG:
			case AppearanceDefs.BREAST_CUP_FF:
			case AppearanceDefs.BREAST_CUP_FF_BIG: return 'huge';
			case AppearanceDefs.BREAST_CUP_G:
			case AppearanceDefs.BREAST_CUP_G_BIG:
			case AppearanceDefs.BREAST_CUP_GG:
			case AppearanceDefs.BREAST_CUP_GG_BIG:
			case AppearanceDefs.BREAST_CUP_H:
			case AppearanceDefs.BREAST_CUP_H_BIG:
			case AppearanceDefs.BREAST_CUP_HH:
			case AppearanceDefs.BREAST_CUP_HH_BIG:
			case AppearanceDefs.BREAST_CUP_I:
			case AppearanceDefs.BREAST_CUP_I_BIG:
			case AppearanceDefs.BREAST_CUP_II:
			case AppearanceDefs.BREAST_CUP_II_BIG: return 'gigantic';
			case AppearanceDefs.BREAST_CUP_J:
			case AppearanceDefs.BREAST_CUP_J_BIG:
			case AppearanceDefs.BREAST_CUP_JJ:
			case AppearanceDefs.BREAST_CUP_JJ_BIG:
			case AppearanceDefs.BREAST_CUP_K:
			case AppearanceDefs.BREAST_CUP_K_BIG:
			case AppearanceDefs.BREAST_CUP_KK:
			case AppearanceDefs.BREAST_CUP_KK_BIG:
			case AppearanceDefs.BREAST_CUP_L:
			case AppearanceDefs.BREAST_CUP_L_BIG:
			case AppearanceDefs.BREAST_CUP_LL:
			case AppearanceDefs.BREAST_CUP_LL_BIG:
			case AppearanceDefs.BREAST_CUP_M:
			case AppearanceDefs.BREAST_CUP_M_BIG:
			case AppearanceDefs.BREAST_CUP_MM:
			case AppearanceDefs.BREAST_CUP_MM_BIG:
			case AppearanceDefs.BREAST_CUP_MMM:
			case AppearanceDefs.BREAST_CUP_MMM_LARGE: return 'mammoth';
			default:
		}
		return 'titanic';
	};
	BreastStore.prototype.canTitFuck = function() {
		return this._cupSize >= AppearanceDefs.BREAST_CUP_C;
	};
	BreastStore.prototype.cup = function() {
		return Appearance.breastCup(this._cupSize);
	}; //The cup size alone
	BreastStore.prototype.description = function(useAdj, isMale) {
		if (this._cupSize === AppearanceDefs.BREAST_CUP_FLAT) {
			return 'flat' + (isMale ? ' manly,' : '') + ' chest';
		}
		return (useAdj ? this.adj() + ' ' : '') + this.cup() + ' breasts';
	};
	BreastStore.prototype.breastDesc = function() {
		return this.breastDescript(this.getCupSize(), 0.5 * this.getLactationLevel());
	};
	BreastStore.prototype.hasBreasts = function() {
		return this._cupSize !== AppearanceDefs.BREAST_CUP_FLAT;
	};
	BreastStore.prototype.lactating = function() {
		return this._lactation >= BreastStore.LACTATION_LIGHT;
	};
	BreastStore.prototype.milked = function() { //Returns true if this milking increased the NPC's lactationLevel
		this._fullness = 0;
		this._timesMilked++;
		if (this.preventLactationIncrease === this._lactation) {
			return false;
		}
		switch (this._lactation) { //With enough milking the lactation level increases
			case BreastStore.LACTATION_NONE: //If you suckle enough times the NPC will eventually start producing milk if they're set to LACTATION_NONE
				if (this._timesMilked < 12) {
					return false;
				}
				break;
			case BreastStore.LACTATION_LIGHT:
				if (this._timesMilked < 10) {
					return false;
				}
				break;
			case BreastStore.LACTATION_MODERATE:
				if (this._timesMilked < 12) {
					return false;
				}
				break;
			case BreastStore.LACTATION_HEAVY:
				if (this._timesMilked < 15) {
					return false;
				}
				break;
			case BreastStore.LACTATION_STRONG:
				if (this._timesMilked < 20) {
					return false;
				}
				break;
			default: //No amount of suckling will increase lactation levels for this NPC
				return false;
		}
		//Only reach this point if the NPC has been milked enough times to justify increasing their milk production
		this._timesMilked = 5;
		this.setLactationLevel(this.getLactationLevel() + 1);
		return true;
	};
	BreastStore.prototype.milkIsFull = function() {
		return (this._lactation <= BreastStore.LACTATION_NONE ? 0 : this._fullness >= 50);
	};
	BreastStore.prototype.milkIsOverflowing = function() {
		return (this._lactation <= BreastStore.LACTATION_NONE ? 0 : this._fullness >= 60 + 5 * LACTATION_BOOST[this._lactation]); //Probably pretty desperate to be milked by this point
	};
	//At fullness == 50 the maximum amount of milk is produced. When overfull, lactation level is reduced and fullness drops to 50.
	//So a higher lactationLevel means more milk is produced and the breasts can stay full without drying up for longer. Will always return 0 if not lactating
	BreastStore.prototype.milkQuantity = function() {
		if (this._lactation <= BreastStore.LACTATION_NONE) {
			return 0;
		}
		return 0.01 * Math.max(100, 2 * this._fullness) * 20 * this._rows * this._cupSize * (this._lactation - 1);
	};
	BreastStore.prototype.nippleDescript = function(tiny, small, large, huge, massive) {
		if(tiny === undefined) {
			tiny = 'tiny';
		}
		if(small === undefined) {
			small = 'prominent';
		}
		if(large === undefined) {
			large = 'large';
		}
		if(huge === undefined) {
			huge = 'elongated';
		}
		if(massive === undefined) {
			massive = 'massive';
		}
		if (this._nippleLength < 3) {
			return tiny;
		}
		if (this._nippleLength < 10) {
			return small;
		}
		if (this._nippleLength < 20) {
			return large;
		}
		if (this._nippleLength < 32) {
			return huge;
		}
		return massive;
	};
	
	return BreastStore;
});
