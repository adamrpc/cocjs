'use strict';

angular.module('cocjs').factory('Character', function ($log, Creature, StatusAffects, UmasShop, PerkLib, CoC_Settings, PregnancyStore, KeyItemClass, CockTypesEnum, Appearance) {
	var Character = angular.copy(Creature);
	Character.prototype.init = function(that) {
		Creature.prototype.init(this);
		that._femininity = 50;
		//BEARDS! Not used anywhere right now but WHO WANTS A BEARD?
		that.beardLength = 0;
		that.beardStyle = 0;
		//Used for hip ratings
		that.thickness = 0;
		//Body tone i.e. Lithe, stocky, etc
		that.tone = 0;
		that._pregnancyType = 0;
		that._pregnancyIncubation = 0;
		that._buttPregnancyType = 0;
		that._buttPregnancyIncubation = 0;
		
		//Key items
		that.keyItems = [];
	};
	// This is the easiest way I could think of to apply 'flat' bonuses to certain stats without having to write a whole shitload of crazyshit
	// I think a better long-term solution may be to hang function references off the end of the statusAffect class and move all of the value
	// calculation into methods of ContentClasses, so rather than having walls of logic, we just call the method reference with a value, and get back the modified value.
	// It's still shitty, but it would possibly be an improvement.
	Character.prototype.getFemininity = function() {
		var fem = this._femininity;
		var statIndex = this.findStatusAffect(StatusAffects.UmasMassage);
		if (statIndex >= 0) {
			if (this.statusAffect(statIndex).value1 === UmasShop.MASSAGE_MODELLING_BONUS) {
				fem += this.statusAffect(statIndex).value2;
			}
		}
		if (fem > 100) {
			fem = 100;
		}
		return fem;
	};
	Character.prototype.setFemininity = function(value) {
		if (value > 100) {
			value = 100;
		} else if (value < 0) {
			value = 0;
		}
		this._femininity = value;
	};
	Character.prototype.getPregnancyType = function() {
		return this._pregnancyType;
	};
	Character.prototype.getPregnancyIncubation = function() {
		return this._pregnancyIncubation;
	};
	Character.prototype.getButtPregnancyType = function() {
		return this._buttPregnancyType;
	};
	Character.prototype.getButtPregnancyIncubation = function() {
		return this._buttPregnancyIncubation;
	};

	Character.prototype.faceDesc = function() {
		var faceo = '';
		//0-10
		if (this.getFemininity() < 10) {
			faceo = 'a square chin';
			if (!this.hasBeard()) {
				faceo += ' and chiseled jawline';
			} else {
				faceo += ', chiseled jawline, and ' + this.beard();
			}
		} else if (this.getFemininity() < 20) {
			faceo = 'a rugged looking ' + this.face() + ' ';
			if (this.hasBeard()) {
				faceo += 'and ' + this.beard();
			}
			faceo += 'that\'s surely handsome';
		} else if (this.getFemininity() < 28) {
			faceo = 'a well-defined jawline and a fairly masculine profile';
		} else if (this.getFemininity() < 35) {
			faceo = 'a somewhat masculine, angular jawline';
		} else if (this.getFemininity() < 45) {
			faceo = 'the barest hint of masculinity on its features';
		} else if (this.getFemininity() <= 55) {
			faceo = 'an androgynous set of features that would look normal on a male or female';
		} else if (this.getFemininity() <= 65) {
			faceo = 'a tiny touch of femininity to it, with gentle curves';
		} else if (this.getFemininity() <= 72) {
			faceo = 'a nice set of cheekbones and lips that have the barest hint of pout';
		} else if (this.getFemininity() <= 80) {
			faceo = 'a beautiful, feminine shapeliness that\'s sure to draw the attention of males';
		} else if (this.getFemininity() <= 90) {
			faceo = 'a gorgeous profile with full lips, a button nose, and noticeable eyelashes';
		} else {
			faceo = 'a jaw-droppingly feminine shape with full, pouting lips, an adorable nose, and long, beautiful eyelashes';
		}
		return faceo;
	};
		
	//Modify femininity!
	Character.prototype.modFem = function(goal, strength) {
		if(strength === undefined) {
			strength = 1;
		}
		var output = '';
		var old = this.faceDesc();
		var oldN = this.getFemininity();
		var changed = false;
		//If already perfect!
		if (goal === this.getFemininity()) {
			return '';
		}
		//If turning MANLYMAN
		if (goal < this.getFemininity() && goal <= 50) {
			this.setFemininity(this.getFemininity() - strength);
			//YOUVE GONE TOO FAR! TURN BACK!
			if (this.getFemininity() < goal) {
				this.setFemininity(goal);
			}
			changed = true;
		}
		//if turning GIRLGIRLY, like duh!
		if (goal > this.getFemininity() && goal >= 50) {
			this.setFemininity(this.getFemininity() + strength);
			//YOUVE GONE TOO FAR! TURN BACK!
			if (this.getFemininity() > goal) {
				this.setFemininity(goal);
			}
			changed = true;
		}
		//Fix if it went out of bounds!
		if (this.findPerk(PerkLib.Androgyny) < 0) {
			this.fixFemininity();
		}
		//Abort if nothing changed!
		if (!changed) {
			return '';
		}
		//See if a change happened!
		if (old !== this.faceDesc()) {
			//Gain fem?
			if (goal > oldN) {
				output = '<b>Your facial features soften as your body becomes more feminine. (+' + strength + ')</b>';
			}else if (goal < oldN) {
				output = '<b>Your facial features harden as your body becomes more masculine. (+' + strength + ')</b>';
			}
		} else {//Barely noticable change!
			if (goal > oldN) {
				output = 'There\'s a tingling in your ' + this.face() + ' as it changes imperceptibly towards being more feminine. (+' + strength + ')';
			} else if (goal < oldN) {
				output = 'There\'s a tingling in your ' + this.face() + ' as it changes imperciptibly towards being more masculine. (+' + strength + ')';
			}
		}
		return output;
	};
		
	Character.prototype.modThickness = function(goal, strength) {
		if(strength === undefined) {
			strength = 1;
		}
		if (goal === this.thickness) {
			return '';
		}
		//Lose weight fatty!
		if (goal < this.thickness && goal < 50) {
			this.thickness -= strength;
			//YOUVE GONE TOO FAR! TURN BACK!
			if (this.thickness < goal) {
				this.thickness = goal;
			}
		}
		//Sup tubby!
		if (goal > this.thickness && goal > 50) {
			this.thickness += strength;
			//YOUVE GONE TOO FAR! TURN BACK!
			if (this.thickness > goal) {
				this.thickness = goal;
			}
		}
		$log.trace('MOD THICKNESS FIRE');
		
		if (goal >= this.thickness && goal >= 50) { //DIsplay 'U GOT FAT'
			return 'Your center of balance changes a little bit as your body noticeably widens. (+' + strength + ' body thickness)';
		} else if (goal <= this.thickness && goal <= 50) { //GET THIN BITCH
			return '\n\nEach movement feels a tiny bit easier than the last.  Did you just lose a little weight!? (+' + strength + ' thin)';
		}
		return '';
	};
		
	Character.prototype.modTone = function(goal, strength) {
		if(strength === undefined) {
			strength = 1;
		}
		if (goal === this.tone) {
			return '';
		}
		//Lose muscle visibility!
		if (goal < this.tone && goal < 50) {
			this.tone -= strength;
			//YOUVE GONE TOO FAR! TURN BACK!
			if (this.tone < goal) {
				this.tone = goal;
				return 'You\'ve lost some tone, but can\'t lose any more this way. (-' + strength + ' muscle tone)';
			}
		}
		//MOAR hulkness
		if (goal > this.tone && goal > 50) {
			this.tone += strength;
			//YOUVE GONE TOO FAR! TURN BACK!
			if (this.tone > goal) {
				this.tone = goal;
				return 'You\'ve gained some muscle tone, but can\'t gain any more this way. (+' + strength + ' muscle tone)';
			}
		}
		
		if (goal >= this.tone && goal > 50) { //DIsplay BITCH I WORK OUT
			return 'Your body feels a little more solid as you move, and your muscles look slightly more visible. (+' + strength + ' muscle tone)';
		} else if (goal <= this.tone && goal < 50) { //Display DERP I HAVE GIRL MUSCLES
			return 'Moving brings with it a little more jiggle than you\'re used to.  You don\'t seem to have gained weight, but your muscles look less visible. (-' + strength + ' muscle tone)';
		}
		return '';
	};
		
	//Run this every hour to 'fix' femininity.
	Character.prototype.fixFemininity = function() {
		var output = '';
		
		if (this.gender === 0 || this.gender === 3) { //Genderless/herms share the same bounds
			if (this.getFemininity() < 20) {
				output += '<b>Your incredibly masculine, chiseled features become a little bit softer from your body\'s changing hormones.';
				if (this.hasBeard()) {
					output += '  As if that wasn\'t bad enough, your ' + this.beard() + ' falls out too!';
					this.beardLength = 0;
					this.beardStyle = 0;
				}
				output += '</b>';
				this.setFemininity(20);
			} else if (this.getFemininity() > 85) {
				output += '<b>You find your overly feminine face loses a little bit of its former female beauty due to your body\'s changing hormones.</b>';
				this.setFemininity(85);
			}
		} else if (this.gender === 2) { //GURLS!
			if (this.getFemininity() < 30) {
				output += '<b>Your incredibly masculine, chiseled features become a little bit softer from your body\'s changing hormones.';
				if (this.hasBeard()) {
					output += '  As if that wasn\'t bad enough, your ' + this.beard() + ' falls out too!';
					this.beardLength = 0;
					this.beardStyle = 0;
				}
				output += '</b>';
				this.setFemininity(30);
			}
		} else if (this.gender === 1) { //BOIZ!
			if (this.getFemininity() > 70) {
				output += '<b>You find your overly feminine face loses a little bit of its former female beauty due to your body\'s changing hormones.</b>';
				this.setFemininity(70);
			}
			if (this.getFemininity() > 40 && this.hasBeard()) {
				output += '\n<b>Your beard falls out, leaving you with ' + this.faceDesc() + '.</b>\n';
				this.beardLength = 0;
				this.beardStyle = 0;
			}
		}
		if (this.gender !== 1 && this.hasBeard()) {
			output += '<b>Your beard falls out, leaving you with ' + this.faceDesc() + '.</b>';
			this.beardLength = 0;
			this.beardStyle = 0;
		}
		return output;
	};
		
	Character.prototype.hasBeard = function() {
		return this.beardLength > 0;
	};
		
	Character.prototype.beard = function() {
		if (this.hasBeard()) {
			return 'beard';
		} else {
			CoC_Settings.error('YOU ARE NOT A VIKING AND SHOULD TELL FEN IMMEDIATELY.');
			return 'NO BEARD! YOU ARE NOT A VIKING AND SHOULD TELL FEN IMMEDIATELY.';
		}
	};
		
	Character.prototype.skin = function(noAdj, noTone) {
		var skinzilla = '';
		//Only show stuff other than skinDesc if justSkin is false
		if (!noAdj) {
			//Adjectives first!
			if (this.skinAdj !== '' && !noTone && this.getSkinTone() !== 'rough gray') {
				skinzilla += this.skinAdj;
				if (noTone) {
					skinzilla += ' ';
				} else {
					skinzilla += ', ';
				}
			}
		}
		if (!noTone) {
			skinzilla += this.getSkinTone() + ' ';
		}
		//Fur handled a little differently since it uses
		//haircolor
		if (this.getSkinType() === 1) {
			skinzilla += 'skin';
		} else {
			skinzilla += this.skinDesc;
		}
		return skinzilla;
	};
		
	Character.prototype.hasMuzzle = function() {
		return this.faceType === 1 || this.faceType === 2 || this.faceType === 6 || this.faceType === 7 || this.faceType === 9 || this.faceType === 11 || this.faceType === 12;
	};
		
	Character.prototype.face = function() {
		var stringo = '';
		//0 - human
		//5 - Human w/Naga fangz
		//8 - bunnah faceahhh bunbun
		//10 - spidah-face (humanish)
		if (this.faceType === 0) {
			return 'face';
		}
		//1 - horse
		//2 - dogface
		//6 - kittah face
		//9 - kangaface
		if (_.indexOf([9, 6, 2, 1, 11], this.faceType) >= 0) {
			if (Math.floor(Math.random() * 2) === 0) {
				return 'muzzle';
			}
			if (Math.floor(Math.random() * 3) === 0 && this.faceType === 1) {
				stringo = 'long ';
			}
			if (Math.floor(Math.random() * 3) === 0 && this.faceType === 6) {
				stringo = 'feline ';
			}
			return stringo + 'face';
		}
		//3 - cowface
		if (this.faceType === 3) {
			if (Math.floor(Math.random() * 4) === 0) {
				stringo = 'bovine ';
			}
			if (Math.floor(Math.random() * 2) === 0) {
				return 'muzzle';
			}
			return stringo + 'face';
		}
		//4 - sharkface-teeth
		if (this.faceType === 4) {
			if (Math.floor(Math.random() * 4) === 0) {
				stringo = 'angular ';
			}
			return stringo + 'face';
		}
		//7 - lizard face (durned argonians!)
		if (this.faceType === 7 || this.faceType === 12) {
			if (Math.floor(Math.random() * 4) === 0) {
				stringo = 'reptilian ';
			}
			if (Math.floor(Math.random() * 4) === 0) {
				return stringo + 'muzzle';
			}
			if (Math.floor(Math.random() * 4) === 0) {
				return stringo + 'snout';
			}
			return stringo + 'face';
		}
		return 'face';
	};
		
	Character.prototype.hasLongTail = function() {
		//7 - shark tail!
		//8 - catTAIIIIIL
		//9 - lizard tail
		//10 - bunbuntail
		//11 - harpybutt
		//12 - rootail
		//13 - foxtail
		//14 - dagron tail
		return this.isNaga() || _.indexOf([2, 3, 4, 7, 8, 9, 12, 13, 14], this.tailType) >= 0;
	};

	Character.prototype.isPregnant = function() {
		return this._pregnancyType !== 0;
	};

	Character.prototype.isButtPregnant = function() {
		return this._buttPregnancyType !== 0;
	};
	
	//fertility must be >= random(0-beat)
	//If arg === 1 then override any contraceptives and guarantee fertilization
	Character.prototype.knockUp = function(type, incubation, beat, arg) {
		if(type === undefined) {
			type = 0;
		}
		if(incubation === undefined) {
			incubation = 0;
		}
		if(beat === undefined) {
			beat = 100;
		}
		if(arg === undefined) {
			arg = 0;
		}
		//Contraceptives cancel!
		if (this.findStatusAffect(StatusAffects.Contraceptives) >= 0 && arg < 1) {
			return;
		}

		var bonus = 0;
		//If arg = 1 (always pregnant), bonus = 9000
		if (arg >= 1) {
			bonus = 9000;
		}
		if (arg <= -1) {
			bonus = -9000;
		}
		//If unpregnant and fertility wins out:
		if (this.getPregnancyIncubation() === 0 && this.totalFertility() + bonus > Math.floor(Math.random() * beat) && this.hasVagina()) {
			this.knockUpForce(type, incubation);
			$log.trace('PC Knocked up with pregnancy type: ' + type + ' for ' + incubation + ' incubation.');
		}
		//Chance for eggs fertilization - ovi elixir and imps excluded!
		if (_.indexOf([PregnancyStore.PREGNANCY_IMP, PregnancyStore.PREGNANCY_OVIELIXIR_EGGS, PregnancyStore.PREGNANCY_ANEMONE], type) < 0) {
			if (this.findPerk(PerkLib.SpiderOvipositor) >= 0 || this.findPerk(PerkLib.BeeOvipositor) >= 0) {
				if (this.totalFertility() + bonus > Math.floor(Math.random() * beat)) {
					this.fertilizeEggs();
				}
			}
		}
	};

	//The more complex knockUp function used by the player is defined above
	//The player doesn't need to be told of the last event triggered, so the code here is quite a bit simpler than that in PregnancyStore
	Character.prototype.knockUpForce = function(type, incubation) {
		if(type === undefined) {
			type = 0;
		}
		if(incubation === undefined) {
			incubation = 0;
		}
		this._pregnancyType = type;
		this._pregnancyIncubation = (type === 0 ? 0 : incubation); //Won't allow incubation time without pregnancy type
	};
	
	//fertility must be >= random(0-beat)
	Character.prototype.buttKnockUp = function(type, incubation, beat, arg) {
		if(type === undefined) {
			type = 0;
		}
		if(incubation === undefined) {
			incubation = 0;
		}
		if(beat === undefined) {
			beat = 100;
		}
		if(arg === undefined) {
			arg = 0;
		}
		
		//Contraceptives cancel!
		if (this.findStatusAffect(StatusAffects.Contraceptives) >= 0 && arg < 1) {
			return;
		}
		var bonus = 0;
		//If arg = 1 (always pregnant), bonus = 9000
		if (arg >= 1) {
			bonus = 9000;
		}
		if (arg <= -1) {
			bonus = -9000;
		}
		//If unpregnant and fertility wins out:
		if (this.getButtPregnancyIncubation() === 0 && this.totalFertility() + bonus > Math.floor(Math.random() * beat)) {
			this.buttKnockUpForce(type, incubation);
			$log.trace('PC Butt Knocked up with pregnancy type: ' + type + ' for ' + incubation + ' incubation.');
		}
	};

	//The more complex buttKnockUp function used by the player is defined in Character.as
	Character.prototype.buttKnockUpForce = function(type, incubation) {
		if(type === undefined) {
			type = 0;
		}
		if(incubation === undefined) {
			incubation = 0;
		}
		this._buttPregnancyType = type;
		this._buttPregnancyIncubation = (type === 0 ? 0 : incubation); //Won't allow incubation time without pregnancy type
	};

	Character.prototype.pregnancyAdvance = function() {
		if (this._pregnancyIncubation > 0) {
			this._pregnancyIncubation--;
		}
		if (this._pregnancyIncubation < 0) {
			this._pregnancyIncubation = 0;
		}
		if (this._buttPregnancyIncubation > 0) {
			this._buttPregnancyIncubation--;
		}
		if (this._buttPregnancyIncubation < 0) {
			this._buttPregnancyIncubation = 0;
		}
		return this.pregnancyUpdate();
	};

	Character.prototype.pregnancyUpdate = function() {
		return false;
	};

	//Create a keyItem
	Character.prototype.createKeyItem = function(keyName, value1, value2, value3, value4) {
		var newKeyItem = new KeyItemClass();
		newKeyItem.keyName = keyName;
		newKeyItem.value1 = value1;
		newKeyItem.value2 = value2;
		newKeyItem.value3 = value3;
		newKeyItem.value4 = value4;
		this.keyItems.push(newKeyItem);
		this.keyItems = _.sortBy(this.keyItems, function(obj) { return obj.keyName; });
	};
	//Remove a key item
	Character.prototype.removeKeyItem = function(itemName) {
		var found = false;
		_.remove(this.keyItems, function(obj) {
			if(!found && obj.keyName === itemName) {
				found = true;
				return true;
			}
			return false;
		});
	};
	Character.prototype.addKeyValue = function(statusName, statusValueNum, newNum) {
		if(statusValueNum === undefined) {
			statusValueNum = 1;
		}
		if(newNum === undefined) {
			newNum = 0;
		}
		
		if(statusValueNum < 1 || statusValueNum > 4) {
			$log.warn('AddKeyValue called with the invalid key value ' + statusValueNum + '.');
			return;
		}
		
		
		var item = _.find(this.keyItems, function(obj) { return obj.keyName === statusName; });
		
		if(!item) {
			$log.warn('Looking for keyitem \'' + statusName + '\' to change value ' + statusValueNum + ', and player does not have the key item.');
			return;
		}
		
		if (statusValueNum === 1) {
			item.value1 += newNum;
		}
		if (statusValueNum === 2) {
			item.value2 += newNum;
		}
		if (statusValueNum === 3) {
			item.value3 += newNum;
		}
		if (statusValueNum === 4) {
			item.value4 += newNum;
		}
	};
	Character.prototype.keyItemv1 = function(statusName) {
		var item = _.find(this.keyItems, function(obj) { return obj.keyName === statusName; });
		if(!item) {
			$log.warn('Looking for key item \'' + statusName + '\', but player does not have it.');
			return 0;
		}
		return item.value1;
	};
	Character.prototype.keyItemv2 = function(statusName) {
		var item = _.find(this.keyItems, function(obj) { return obj.keyName === statusName; });
		if(!item) {
			$log.warn('Looking for key item \'' + statusName + '\', but player does not have it.');
			return 0;
		}
		return item.value2;
	};
	Character.prototype.keyItemv3 = function(statusName) {
		var item = _.find(this.keyItems, function(obj) { return obj.keyName === statusName; });
		if(!item) {
			$log.warn('Looking for key item \'' + statusName + '\', but player does not have it.');
			return 0;
		}
		return item.value3;
	};
	Character.prototype.keyItemv4 = function(statusName) {
		var item = _.find(this.keyItems, function(obj) { return obj.keyName === statusName; });
		if(!item) {
			$log.warn('Looking for key item \'' + statusName + '\', but player does not have it.');
			return 0;
		}
		return item.value4;
	};
	Character.prototype.removeKeyItems = function() {
		this.keyItems = [];
	};
	Character.prototype.hasKeyItem = function(keyName) {
		return _.findIndex(this.keyItems, function(obj) { return obj.keyName === keyName; });
	};
		
	Character.prototype.viridianChange = function() {
		var count = this.cockTotal();
		if (count === 0) {
			return false;
		}
		while (count > 0) {
			count--;
			if (this.cocks[count].sock === 'amaranthine' && this.cocks[count].cockType !== CockTypesEnum.DISPLACER) {
				return true;
			}
		}
		return false;
	};
		
	Character.prototype.hasKnot = function(arg) {
		if(arg === undefined) {
			arg = 0;
		}
		if (arg > this.cockTotal() - 1 || arg < 0) {
			return false;
		}
		return _.indexOf([CockTypesEnum.DOG, CockTypesEnum.FOX, CockTypesEnum.DISPLACER], this.cocks[arg].cockType) >= 0;
	};

	Character.prototype.maxHP = function() {
		var max = 0;
		max += Math.round(this.tou * 2 + 50);
		if (this.findPerk(PerkLib.Tank) >= 0) {
			max += 50;
		}
		if (this.findPerk(PerkLib.Tank2) >= 0) {
			max += Math.round(this.tou);
		}
		if (this.findPerk(PerkLib.ChiReflowDefense) >= 0) {
			max += UmasShop.NEEDLEWORK_DEFENSE_EXTRA_HP;
		}
		if (this.level <= 20) {
			max += this.level * 15;
		} else {
			max += 20 * 15;
		}
		max = Math.round(max);
		if (max > 999) {
			max = 999;
		}
		return max;
	};

	Character.prototype.buttDescript = function() {
		return Appearance.buttDescription(this);
	};

	return Character;
});
