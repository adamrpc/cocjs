'use strict';

angular.module('cocjs').factory('Creature', function ( $log, CoC, Utils, Ass, Cock, Vagina, BreastRow, BreastStore, AppearanceDefs, Perk, StatusAffects, CoC_Settings, CockTypesEnum, Appearance, PerkLib) {
	function Creature() {
		this.init(this, arguments);
	}
	Creature.prototype.hasClassName = function(name) {
		return _.find(this.classNames, name);
	};
	Creature.prototype.init = function(that) {
		that.classNames = ['Creature'];
		that.breastRows = [];
		that.perks = [];
		that.statusAffects = [];
		
		//Short refers to player name and monster name. BEST VARIABLE NAME EVA!
		//'a' refers to how the article 'a' should appear in text. 
		that.short = 'You';
		that.a = 'a ';
		
		//Weapon
		that.weaponName = '';
		that.weaponVerb = '';
		that.weaponAttack = 0;
		that.weaponPerk = '';
		that.weaponValue = 0;
		
		//Clothing/Armor
		that.armorName = '';
		that.armorDef = 0;
		that.armorPerk = '';
		that.armorValue = 0;
		
		//Primary stats
		that.str = 0;
		that.tou = 0;
		that.spe = 0;
		that.inte = 0;
		that.lib = 0;
		that.sens = 0;
		that.cor = 0;
		that.fatigue = 0;
		
		//Combat Stats
		that.HP = 0;
		that.lust = 0;
		
		//Level Stats
		that.XP = 0;
		that.level = 0;
		that.gems = 0;
		that.additionalXP = 0;
				
		//Appearance Variables
		//Gender 1M, 2F, 3H
		that.gender = AppearanceDefs.GENDER_NONE;
		that.tallness = 0;
		
		/*Hairtype
		0- normal
		1- feather
		2- ghost
		3- goo!
		4- anemononeoenoeneo!*/
		that.hairType = AppearanceDefs.HAIR_NORMAL;
		that.hairColor = 'no';
		that.hairLength = 0;
		
		/*Skintype
		0 - skin
		1 - furry
		2 - scaley
		3 - goopey*/
		that.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		that.skinTone = 'albino';
		that.skinDesc = 'skin';
		that.skinAdj = '';
		
/*		Facetype:
		0 - human
		1 - horse
		2 - dogface
		3 - cowface
		4 - sharkface-teeth
		5 - Human w/Naga fangz
		6 - kittah face
		7 - lizard face (durned argonians!)
		8 - bunnah faceahhh bunbun
		9 - kangaface
		10 - spidah-face (humanish)
		11 - foxface!
		12 - dragon face
		13 - Halfcoon
		14 - fullcoon
		15 - halfmouse
		16 - fullmouse*/
		that.faceType = AppearanceDefs.FACE_HUMAN;
		
		/*EarType
		-1 - none!
		0 - human
		1 - horse
		2 - dog
		3 - cow
		4 - elf
		5 - catzilla
		6 - Snakezilla
		7 - Bunbunz
		8 - Roo Ears
		9 - fox ears
		10 - dragon
		11 - coon
		12 - mouse*/
		that.earType = AppearanceDefs.EARS_HUMAN;
		that.earValue = 0;
		
		/*Horntype
		1 - demonic
		2 - minotaur (cowlike)
		3 - Draconic/Lizard
		4 - Double draconic
		5 - Antlers*/
		that.hornType = AppearanceDefs.HORNS_NONE;
		that.horns = 0;

		/*Wingtype
		0 - none
		1 - bee
		2 - large bee
		3 - faerie?
		4 - avian
		5 - dragoooon?
		6 - demon/bat
		7 - large demon/bat
		8 - shark wing lolololol
		9 - harpy
		10 - small dagron
		11 - trogdor wings
		12 - sandtrap wings*/
		that.wingType = AppearanceDefs.WING_TYPE_NONE;
		that.wingDesc = 'non-existant';
		
		/* lowerBody:
		0 - normal
		1 - hooves
		2 - paws
		3 - snakelike body
		4 - centaur!
		5 - demonic heels
		6 - demon foot-claws
		7 - bee legs
		8 - goo mound
		9 - catfeet
		10 - lizardfeet
		11 - MLP.
		12 - DAH BUNNY!
		13 - Harpah Legz
		14 - Roo feet!
		15 - Spider Legz
		16 - Drider Legs
		17 - foxpaws
		18 - dragonfeet
		19 - raccoonfeet*/
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HUMAN;

		/*tailType:
		0 - none
		1 - horse
		2 - dog
		3 - demon
		4 - cow!
		5 - spider!
		6 - bee!
		7 - shark tail!
		8 - catTAIIIIIL
		9 - lizard tail
		10 - bunbuntail
		11 - harpybutt
		12 - rootail
		13 - foxtail
		14 - dagron tail
		15 - raccoon tail
		16 - mousetail*/
		that.tailType = AppearanceDefs.TAIL_TYPE_NONE;
		
		//Tail venom is a 0-100 slider used for tail attacks. Recharges per hour.
		that.tailVenom = 0;
		//Tail recharge determines how fast venom/webs comes back per hour.
		that.tailRecharge = 5;
		
		/*hipRating
		0 - boyish
		2 - slender
		4 - average
		6 - noticable/ample
		10 - curvy//flaring
		15 - child-bearing/fertile
		20 - inhumanly wide*/
		that.hipRating = AppearanceDefs.HIP_RATING_BOYISH;
		
		/*buttRating
		0 - buttless
		2 - tight
		4 - average
		6 - noticable
		8 - large
		10 - jiggly
		13 - expansive
		16 - huge
		20 - inconceivably large/big/huge etc*/
		that.buttRating = AppearanceDefs.BUTT_RATING_BUTTLESS;
		
		//Piercings
		//TODO: Pull this out into it's own class and enum.
		that.nipplesPierced = 0;
		that.nipplesPShort = '';
		that.nipplesPLong = '';
		that.lipPierced = 0;
		that.lipPShort = '';
		that.lipPLong = '';
		that.tonguePierced = 0;
		that.tonguePShort = '';
		that.tonguePLong = '';
		that.eyebrowPierced = 0;
		that.eyebrowPShort = '';
		that.eyebrowPLong = '';
		that.earsPierced = 0;
		that.earsPShort = '';
		that.earsPLong = '';
		that.nosePierced = 0;
		that.nosePShort = '';
		that.nosePLong = '';

		//Head ornaments. Definitely need to convert away from hard coded types.
		that.antennae = AppearanceDefs.ANTENNAE_NONE;

		//Eyetype
		that.eyeType = AppearanceDefs.EYES_HUMAN;

		//TongueType
		that.tongueType = AppearanceDefs.TONUGE_HUMAN;

		//ArmType
		that.armType = AppearanceDefs.ARM_TYPE_HUMAN;

		//Gills
		that.gills = false;

		//Sexual Stuff
		//MALE STUFF
		//TODO: Tuck away into Male genital class?
		that.cocks = [];
		//balls
		that.balls = 0;
		that.cumMultiplier = 1;
		that.ballSize = 0;
		
		that.hoursSinceCum = 0;
			
		//FEMALE STUFF
		//TODO: Box into Female genital class?
		that.vaginas = [];
		//Fertility is a % out of 100. 
		that.fertility = 10;
		that.clitLength = 0.5;
		that.nippleLength = 0.25;
		
		that.ass = new Ass();
	};
	
	Creature.prototype.getCapitalA = function() {
		if (this.a.length === 0) {
			return '';
		}
		return this.a.charAt(0).toUpperCase() + this.a.substr(1);
	};
	
	Creature.prototype.validate = function() {
		var error = '';
		// 2. Value boundaries etc
		// 2.1. non-negative Number fields
		error += Utils.validateNonNegativeNumberFields(this,'Monster.validate',[
			'balls', 'ballSize', 'cumMultiplier', 'hoursSinceCum',
			'tallness', 'hipRating', 'buttRating', 'lowerBody', 'armType',
			'skinType', 'hairLength', 'hairType',
			'faceType', 'earType', 'tongueType', 'eyeType',
			'str', 'tou', 'spe', 'inte', 'lib', 'sens', 'cor',
			// Allow weaponAttack to be negative as a penalty to strength-calculated damage
			// Same with armorDef, bonusHP, additionalXP
			'weaponValue', 'armorValue',
			'lust', 'fatigue',
			'level', 'gems',
			'tailVenom', 'tailRecharge', 'horns',
			'HP', 'XP'
		]);
		// 2.2. non-empty String fields
		error += Utils.validateNonEmptyStringFields(this,'Monster.validate',[
			'short',
			'skinDesc',
			'weaponName', 'weaponVerb', 'armorName'
		]);
		// 3. validate members
		_.forEach(this.cocks, function(cock) {
			error += cock.validate();
		});
		_.forEach(this.vaginas, function(vagina) {
			error += vagina.validate();
		});
		_.forEach(this.breastRows, function(row) {
			error += row.validate();
		});
		error += this.ass.validate();
		// 4. Inconsistent fields
		// 4.1. balls
		if (this.balls > 0 && this.ballSize <= 0){
			error += 'Balls are present but ballSize = ' + this.ballSize + '. ';
		}
		if (this.ballSize > 0 && this.balls <= 0){
			error += 'No balls but ballSize = ' + this.ballSize + '. ';
		}
		// 4.2. hair
		if (this.hairLength <= 0) {
			if (this.hairType !== AppearanceDefs.HAIR_NORMAL) {
				error += 'No hair but hairType = ' + this.hairType + '. ';
			}
		}
		// 4.3. tail
		if (this.tailType === AppearanceDefs.TAIL_TYPE_NONE) {
			if (this.tailVenom !== 0) {
				error += 'No tail but tailVenom = ' + this.tailVenom + '. ';
			}
		}
		// 4.4. horns
		if (this.hornType === AppearanceDefs.HORNS_NONE){
			if (this.horns>0) {
				error += 'horns > 0 but hornType = HORNS_NONE. ';
			}
		} else {
			if (this.horns === 0) {
				error += 'Has horns but their number \'horns\' = 0. ';
			}
		}
		return error;
	};
	
	//Monsters have few perks, which I think should be a status effect for clarity's sake.
	//TODO: Move perks into monster status effects.
	Creature.prototype.perk = function(i) {
		return this.perks[i];
	};
	
	Creature.prototype.getNumPerks = function() {
		return this.perks.length;
	};
	Creature.prototype.countCockSocks = function(type) {
		return _.filter(this.cocks, function(value) {
			return value.sock === type;
		}).length;
	};
	Creature.prototype.orgasm = function() {
		this.getCoC.dynStats('lus=', 0, 'res', false);
		this.hoursSinceCum = 0;
		if (this.countCockSocks('gilded') > 0) {
			var randomCock = Utils.rand( this.cocks.length );
			var bonusGems = Utils.rand( this.cocks[randomCock].cockThickness ) + this.countCockSocks('gilded'); // int so AS rounds to whole numbers
			this.getCoC.outputText('Feeling some minor discomfort in your ' + this.cockDescript(randomCock) + ' you slip it out of your [armor] and examine it. <b>With a little exploratory rubbing and massaging, you manage to squeeze out ' + this.bonusGems + ' gems from its cum slit.</b>' );
			this.gems += bonusGems;
		}
	};
	//Create a perk
	Creature.prototype.createPerk = function(ptype, value1, value2, value3, value4) {
		var newPerk = new Perk();
		newPerk.ptype = ptype;
		newPerk.value1 = value1;
		newPerk.value2 = value2;
		newPerk.value3 = value3;
		newPerk.value4 = value4;
		this.perks.push(newPerk);
		this.perks = _.sortBy(this.perks, function(obj) { return obj.ptype; });
	};
	//Remove a perk
	Creature.prototype.removePerk = function(ptype) {
		var found = false;
		_.remove(this.perks, function(obj) {
			if(!found && obj.ptype === ptype) {
				found = true;
				return true;
			}
			return false;
		});
	};
	//has perk?
	Creature.prototype.findPerk = function(ptype) {
		if (this.perks.length <= 0) {
			return -2;
		}
		return _.findIndex(this.perks, function(obj) { return obj.ptype === ptype; });
	};
	//Duplicate perk
	//Deprecated?
	Creature.prototype.perkDuplicated = function(ptype) {
		return this.findPerk(ptype) >= 0;
	};	
	//remove all perks
	Creature.prototype.removePerks = function() {
		this.perks = [];
	};
	Creature.prototype.addPerkValue = function(ptype, valueIdx, bonus) {
		if(valueIdx === undefined) {
			valueIdx = 1;
		}
		if(bonus === undefined) {
			bonus = 0;
		}
		if(valueIdx < 1 || valueIdx > 4) {
			$log.warn('AddKeyValue called with the invalid key value ' + valueIdx + '.');
			return;
		}
		var index = this.findPerk(ptype);
		if (index < 0) {
			$log.error('Looking for perk \'' + ptype + '\' to change value ' + valueIdx + ', and player does not have the perk.');
			return;
		}
		var item = this.perk(index);
		if (valueIdx === 1) {
			item.value1 += bonus;
		}
		if (valueIdx === 2) {
			item.value2 += bonus;
		}
		if (valueIdx === 3) {
			item.value3 += bonus;
		}
		if (valueIdx === 4) {
			item.value4 += bonus;
		}
	};
	Creature.prototype.setPerkValue = function(ptype, valueIdx, newNum) {
		if(valueIdx === undefined) {
			valueIdx = 1;
		}
		if(newNum === undefined) {
			newNum = 0;
		}
		if(valueIdx < 1 || valueIdx > 4) {
			$log.warn('AddKeyValue called with the invalid key value ' + valueIdx + '.');
			return;
		}
		var index = this.findPerk(ptype);
		if (index < 0) {
			$log.error('Looking for perk \'' + ptype + '\' to change value ' + valueIdx + ', and player does not have the perk.');
			return;
		}
		var item = this.perk(index);
		if (valueIdx === 1) {
			item.value1 = newNum;
		}
		if (valueIdx === 2) {
			item.value2 = newNum;
		}
		if (valueIdx === 3) {
			item.value3 = newNum;
		}
		if (valueIdx === 4) {
			item.value4 = newNum;
		}
	};
	Creature.prototype.perkv1 = function(ptype) {
		var index = this.findPerk(ptype);
		if (index < 0) {
			$log.warn('Looking for perk \'' + ptype + '\', but player does not have it.');
			return 0;
		}
		return this.perk(index).value1;
	};
	Creature.prototype.perkv2 = function(ptype) {
		var index = this.findPerk(ptype);
		if (index < 0) {
			$log.warn('Looking for perk \'' + ptype + '\', but player does not have it.');
			return 0;
		}
		return this.perk(index).value2;
	};
	Creature.prototype.perkv3 = function(ptype) {
		var index = this.findPerk(ptype);
		if (index < 0) {
			$log.warn('Looking for perk \'' + ptype + '\', but player does not have it.');
			return 0;
		}
		return this.perk(index).value3;
	};
	Creature.prototype.perkv4 = function(ptype) {
		var index = this.findPerk(ptype);
		if (index < 0) {
			$log.warn('Looking for perk \'' + ptype + '\', but player does not have it.');
			return 0;
		}
		return this.perk(index).value4;
	};
	//Create a status
	Creature.prototype.createStatusAffect = function(stype, value1, value2, value3, value4) {
		this.statusAffects.push(new StatusAffects(stype,value1,value2,value3,value4));
	};
	//Remove a status
	Creature.prototype.removeStatusAffect = function(stype) {
		_.remove(this.statusAffects, _.find(this.statusAffects, function(value) { return value.stype === stype; } ));
	};
	Creature.prototype.findStatusAffect = function(stype) {
		return _.findIndex(this.statusAffects, function(obj) { return obj.stype === stype; });
	};
	Creature.prototype.changeStatusValue = function(stype, statusValueNum, newNum) {
		if(statusValueNum === undefined) {
			statusValueNum = 1;
		}
		if(newNum === undefined) {
			newNum = 0;
		}
		
		var index = this.findStatusAffect(stype);
		//Various Errors preventing action
		if (index < 0){
			return;
		}
		if (statusValueNum < 1 || statusValueNum > 4) {
			CoC_Settings.error('ChangeStatusValue called with invalid status value number.');
			return;
		}
		var item = this.statusAffects[index];
		if (statusValueNum === 1) {
			item.value1 = newNum;
		}
		if (statusValueNum === 2) {
			item.value2 = newNum;
		}
		if (statusValueNum === 3) {
			item.value3 = newNum;
		}
		if (statusValueNum === 4) {
			item.value4 = newNum;
		}
	};
	Creature.prototype.addStatusValue = function(stype, statusValueNum, bonus) {
		if(statusValueNum === undefined) {
			statusValueNum = 1;
		}
		if(bonus === undefined) {
			bonus = 0;
		}
		
		var index = this.findStatusAffect(stype);
		//Various Errors preventing action
		if (index < 0){
			return;
		}
		if (statusValueNum < 1 || statusValueNum > 4) {
			CoC_Settings.error('addStatusValue called with invalid status value number.');
			return;
		}
		var item = this.statusAffects[index];
		if (statusValueNum === 1) {
			item.value1 += bonus;
		}
		if (statusValueNum === 2) {
			item.value2 += bonus;
		}
		if (statusValueNum === 3) {
			item.value3 += bonus;
		}
		if (statusValueNum === 4) {
			item.value4 += bonus;
		}
	};	
	Creature.prototype.statusAffect = function(idx) {
		return this.statusAffects[idx];
	};
	Creature.prototype.statusAffectv1 = function(stype) {
		var index = this.findStatusAffect(stype);
		return (index < 0)? 0 : this.statusAffect(index).value1;
	};
	Creature.prototype.statusAffectv2 = function(stype) {
		var index = this.findStatusAffect(stype);
		return (index < 0)? 0 : this.statusAffect(index).value2;
	};
	Creature.prototype.statusAffectv3 = function(stype) {
		var index = this.findStatusAffect(stype);
		return (index < 0)? 0 : this.statusAffect(index).value3;
	};
	Creature.prototype.statusAffectv4 = function(stype) {
		var index = this.findStatusAffect(stype);
		return (index < 0)? 0 : this.statusAffect(index).value4;
	};
	Creature.prototype.removeStatuses = function() {
		this.statusAffects = [];
	};
	function nThMaxBy(arr, predicate, times) {
		if(!times) {
			return _.maxBy(arr, predicate);
		}
		return nThMaxBy(_.without(arr, _.maxBy(arr, predicate)), predicate, times - 1);
	}
	function nThMinBy(arr, predicate, times) {
		if(!times) {
			return _.minBy(arr, predicate);
		}
		return nThMaxBy(_.without(arr, _.minBy(arr, predicate)), predicate, times - 1);
	}
	Creature.prototype.biggestTitSize = function() {
		return this.breastRows.length === 0?-1:_.maxBy(this.breastRows, function(value) { return value.breastRating; }).breastRating;
	};
	Creature.prototype.cockArea = function(i_cockIndex) {
		if(_.isObject(i_cockIndex)) {
			return (i_cockIndex.cockThickness * i_cockIndex.cockLength);
		}
		if (i_cockIndex >= this.cocks.length || i_cockIndex < 0) {
			return 0;
		}
		var cock = this.cocks[i_cockIndex];
		return (cock.cockThickness * cock.cockLength);
	};
	Creature.prototype.biggestCockLength = function() {
		var that = this;
		return this.cocks.length === 0?-1:_.maxBy(this.cocks, function(value) { return that.cockArea(value); }).cockLength;
	};
	Creature.prototype.biggestCockArea = function() {
		var that = this;
		return this.cocks.length === 0?-1:this.cockArea(_.maxBy(this.cocks, function(value) { return that.cockArea(value); }));
	};
	//Find the second biggest dick and it's area.
	Creature.prototype.biggestCockArea2 = function() {
		var that = this;
		return this.cocks.length <= 1?-1:this.cockArea(nThMaxBy(this.cocks, function(value) { return that.cockArea(value); }, 1));
	};
	Creature.prototype.longestCock = function() {
		return this.cocks.length === 0?-1:_.indexOf(this.cocks, _.maxBy(this.cocks, function(value) { return value.cockLength; }));
	};	
	Creature.prototype.longestCockLength = function() {
		return this.cocks.length === 0?-1:_.maxBy(this.cocks, function(value) { return value.cockLength; }).cockLength;
	};
	Creature.prototype.longestHorseCockLength = function() {
		var horseCocks = _.filter(this.cocks, function(value) { return value.cockType === CockTypesEnum.HORSE; });
		return horseCocks.length === 0?-1:_.maxBy(horseCocks, function(value) { return value.cockLength; }).cockLength;
	};
	Creature.prototype.twoDickRadarSpecial = function(width) {
		//No two dicks?  FUCK OFF
		if (this.cocks.length <= 1) {
			return false;
		}
		var last = _.minBy(this.cocks, function(value) { return value.cockThickness; });
		var secondLast = _.minBy(_.without(this.cocks, last), function(value) { return value.cockThickness; });
		return last.cockThickness + secondLast.cockThickness < width;
	};
	Creature.prototype.totalCockThickness = function() {
		var thick = 0;
		_.forEach(this.cocks, function(value) {
			thick += value.cockThickness;
		});
		return thick;
	};
	Creature.prototype.thickestCock = function() {
		return this.cocks.length === 0?-1:_.indexOf(this.cocks, _.maxBy(this.cocks, function(value) { return value.cockThickness; }));
	};
	Creature.prototype.thickestCockThickness = function() {
		return this.cocks.length === 0?0:_.maxBy(this.cocks, function(value) { return value.cockThickness; }).cockThickness;
	};
	Creature.prototype.thinnestCockIndex = function() {
		return this.cocks.length === 0?-1:_.indexOf(this.cocks, _.minBy(this.cocks, function(value) { return value.cockThickness; }));
	};
	Creature.prototype.smallestCockIndex = function() {
		var that = this;
		return this.cocks.length === 0?-1:_.indexOf(this.cocks, _.minBy(this.cocks, function(value) { return that.cockArea(value); }));
	};
	Creature.prototype.smallestCockLength = function() {
		var that = this;
		return this.cocks.length === 0?0:_.minBy(this.cocks, function(value) { return that.cockArea(value); }).cockLength;
	};
	Creature.prototype.shortestCockIndex = function() {
		return this.cocks.length === 0?-1:_.indexOf(this.cocks, _.minBy(this.cocks, function(value) { return value.cockLength; }));
	};
	Creature.prototype.shortestCockLength = function() {
		return this.cocks.length === 0?0:_.minBy(this.cocks, function(value) { return value.cockLength; }).cockLength;
	};
	Creature.prototype._getCockCheckedValue = function(cock, type) {
		var checkedValue = this.cockArea(cock);
		if(type === 'length') {
			checkedValue = cock.cockLength;
		}
		return checkedValue;
	};
	//Find the biggest cock that fits inside a given value
	Creature.prototype.cockThatFits = function(i_fits, type) {
		var that = this;
		var cockThatFits = _.filter(this.cocks, function(value) { return that._getCockCheckedValue(value, type) <= i_fits; });
		return cockThatFits.length === 0?-1:_.indexOf(this.cocks, _.maxBy(cockThatFits, function(value) {return this._getCockCheckedValue(value, type); }));
	};
	//Find the 2nd biggest cock that fits inside a given value
	Creature.prototype.cockThatFits2 = function(i_fits, type) {
		var that = this;
		var cockThatFits = _.filter(this.cocks, function(value) { return that._getCockCheckedValue(value, type) <= i_fits; });
		return cockThatFits.length <= 1?-1:_.indexOf(this.cocks, nThMaxBy(cockThatFits, function(value) {return this._getCockCheckedValue(value, type); }, 1));
	};
	Creature.prototype.smallestCockArea = function() {
		var that = this;
		return this.cocks.length === 0?-1:this.cockArea(_.minBy(this.cocks, function(value) { return that.cockArea(value); }));
	};	
	Creature.prototype.smallestCock = Creature.prototype.smallestCockArea;
	Creature.prototype.biggestCockIndex = function() {
		var that = this;
		return this.cocks.length === 0?-1:_.indexOf(this.cocks, _.maxBy(this.cocks, function(value) { return that.cockArea(value); }));
	};
	//Find the second biggest dick's index.
	Creature.prototype.biggestCockIndex2 = function() {
		var that = this;
		return this.cocks.length <= 1?-1:_.indexOf(this.cocks, nThMaxBy(this.cocks, function(value) { return that.cockArea(value); }, 1));
	};
	Creature.prototype.smallestCockIndex2 = function() {
		var that = this;
		return this.cocks.length <= 1?-1:_.indexOf(this.cocks, nThMinBy(this.cocks, function(value) { return that.cockArea(value); }, 1));
	};
	//Find the third biggest dick index.
	Creature.prototype.biggestCockIndex3 = function() {
		var that = this;
		return this.cocks.length <= 2?-1:_.indexOf(this.cocks, nThMaxBy(this.cocks, function(value) { return that.cockArea(value); }, 2));
	};
	Creature.prototype.cockDescript = function(cockIndex) {
		if(cockIndex === undefined) {
			cockIndex = 0;
		}
		return Appearance.cockDescript(this, cockIndex);
	};
	Creature.prototype.cockAdjective = function(index) {
		if(index === undefined || index < 0) {
			index = this.biggestCockIndex();
		}
		var cock = this.cocks[index];
		//Only describe as pierced or sock covered if the creature has just one cock
		var isPierced = (this.cocks.length === 1) && (cock.isPierced);
		var hasSock = (this.cocks.length === 1) && (cock.sock !== '');
		var isGooey = (this.skinType === AppearanceDefs.SKIN_TYPE_GOO);
		return Appearance.cockAdjective(cock.cockType, cock.cockLength, cock.cockThickness, this.lust, this.cumQ(), isPierced, hasSock, isGooey);
	};
	Creature.prototype.wetness = function() {
		if (this.vaginas.length === 0) {
			return 0;
		}
		return this.vaginas[0].vaginalWetness;
	};
	Creature.prototype.vaginaType = function(newType) {
		if (this.vaginas.length === 0) {
			return -1;
		}
		if(newType !== undefined) {
			this.vaginas[0].type = newType;
		}
		return this.vaginas[0].type;
	};
	Creature.prototype.looseness = function(vag) {
		if (vag || vag === undefined) {
			if (this.vaginas.length === 0) {
				return 0;
			}
			return this.vaginas[0].vaginalLooseness;
		}
		return this.ass.analLooseness;
	};
	Creature.prototype.vaginalCapacity = function() {
		//If the player has no vaginas
		if (this.vaginas.length === 0) {
			return 0;
		}
		var bonus = 0;
		if (this.lowerBody === 4) { //Centaurs = +50 capacity
			bonus = 50;
		} else if (this.lowerBody === 3) { //Naga = +20 capacity
			bonus = 20;
		}
		if (this.findPerk(PerkLib.WetPussy) >= 0) { //Wet pussy provides 20 point boost
			bonus += 20;
		}
		if (this.findPerk(PerkLib.HistorySlut) >= 0) {
			bonus += 20;
		}
		if (this.findPerk(PerkLib.OneTrackMind) >= 0) {
			bonus += 10;
		}
		if (this.findPerk(PerkLib.Cornucopia) >= 0) {
			bonus += 30;
		}
		if(this.findPerk(PerkLib.FerasBoonWideOpen) >= 0) {
			bonus += 25;
		}
		if(this.findPerk(PerkLib.FerasBoonMilkingTwat) >= 0) {
			bonus += 40;
		}
		return (bonus + this.statusAffectv1(StatusAffects.BonusVCapacity) + 8 * this.vaginas[0].vaginalLooseness * this.vaginas[0].vaginalLooseness) * (1 + this.vaginas[0].vaginalWetness / 10);
	};
	Creature.prototype.analCapacity = function() {
		var bonus = 0;
		//Centaurs = +30 capacity
		if (this.lowerBody === 4) {
			bonus = 30;
		}
		if (this.findPerk(PerkLib.HistorySlut) >= 0) {
			bonus += 20;
		}
		if (this.findPerk(PerkLib.Cornucopia) >= 0) {
			bonus += 30;
		}
		if (this.findPerk(PerkLib.OneTrackMind) >= 0) {
			bonus += 10;
		}
		if (this.ass.analWetness > 0) {
			bonus += 15;
		}
		return ((bonus + this.statusAffectv1(StatusAffects.BonusACapacity) + 6 * this.ass.analLooseness * this.ass.analLooseness) * (1 + this.ass.analWetness / 10));
	};
	Creature.prototype.hasFuckableNipples = function() {
		return _.find(this.breastRows, function(value) { return value.fuckable; }) !== null;
	};
	Creature.prototype.hasBreasts = function() {
		return this.biggestTitSize() >= 1;
	};
	Creature.prototype.hasNipples = function() {
		return _.find(this.breastRows, function(value) { return value.nipplesPerBreast > 0; }) !== null;
	};
	Creature.prototype.lactationSpeed = function() {
		//Lactation * breastSize x 10 (milkPerBreast) determines scene
		return this.biggestLactation() * this.biggestTitSize() * 10;
	};
	//Hacky code till I can figure out how to move appearance code out.
	//TODO: Get rid of this 
	Creature.prototype.dogScore = function() {
		throw 'dogScore not implemented. BAD';
	};
	//Hacky code till I can figure out how to move appearance code out.
	//TODO: Get rid of this
	Creature.prototype.foxScore = function() {
		throw 'foxScore not implemented. BAD';
	};
	Creature.prototype.biggestLactation = function() {
		return this.breastRows.length === 0?-1:_.maxBy(this.breastRows, function(value) { return value.lactationMultiplier; }).lactationMultiplier;
	};
	Creature.prototype.milked = function() {
		if (this.findStatusAffect(StatusAffects.LactationReduction) >= 0) {
			this.changeStatusValue(StatusAffects.LactationReduction, 1, 0);
		}
		if (this.findStatusAffect(StatusAffects.LactationReduc0) >= 0) {
			this.removeStatusAffect(StatusAffects.LactationReduc0);
		}
		if (this.findStatusAffect(StatusAffects.LactationReduc1) >= 0) {
			this.removeStatusAffect(StatusAffects.LactationReduc1);
		}
		if (this.findStatusAffect(StatusAffects.LactationReduc2) >= 0) {
			this.removeStatusAffect(StatusAffects.LactationReduc2);
		}
		if (this.findStatusAffect(StatusAffects.LactationReduc3) >= 0) {
			this.removeStatusAffect(StatusAffects.LactationReduc3);
		}
		if (this.findPerk(PerkLib.Feeder) >= 0) {
			//You've now been milked, reset the timer for that
			this.addStatusValue(StatusAffects.Feeder,1,1);
			this.changeStatusValue(StatusAffects.Feeder, 2, 0);
		}
	};
	Creature.prototype.boostLactation = function(todo) {
		if (this.breastRows.length === 0) {
			return 0;
		}
		var changes = 0;
		//Prevent lactation decrease if lactating.
		if (todo >= 0) {
			if (this.findStatusAffect(StatusAffects.LactationReduction) >= 0) {
				this.changeStatusValue(StatusAffects.LactationReduction, 1, 0);
			}
			if (this.findStatusAffect(StatusAffects.LactationReduc0) >= 0) {
				this.removeStatusAffect(StatusAffects.LactationReduc0);
			}
			if (this.findStatusAffect(StatusAffects.LactationReduc1) >= 0) {
				this.removeStatusAffect(StatusAffects.LactationReduc1);
			}
			if (this.findStatusAffect(StatusAffects.LactationReduc2) >= 0) {
				this.removeStatusAffect(StatusAffects.LactationReduc2);
			}
			if (this.findStatusAffect(StatusAffects.LactationReduc3) >= 0) {
				this.removeStatusAffect(StatusAffects.LactationReduc3);
			}
		}
		if (todo > 0) {
			while (todo > 0) {
				var lessLactatingBreastRow = _.minBy(this.breastRows, function(value) { return value.lactationMultiplier; });
				var bonus = 0.1;
				if (lessLactatingBreastRow.lactationMultiplier > 1.5) {
					bonus /= 2;
				}
				if (lessLactatingBreastRow.lactationMultiplier > 2.5) {
					bonus /= 2;
				}
				if (lessLactatingBreastRow.lactationMultiplier > 3) {
					bonus /= 2;
				}
				changes += bonus;
				lessLactatingBreastRow.lactationMultiplier += bonus;
				todo -= 0.1;
			}
		} else {
			while (todo < 0) {
				var mostLactatingBreastRow = _.maxBy(this.breastRows, function(value) { return value.lactationMultiplier; });
				mostLactatingBreastRow.lactationMultiplier += todo;
				if (mostLactatingBreastRow.lactationMultiplier < 0) {
					mostLactatingBreastRow.lactationMultiplier = 0;
				}
				changes += todo;
				todo += 0.1;
			}
		}
		return changes;
	};
	Creature.prototype.averageLactation = function() {
		return _.meanBy(this.breastRows, function(value) { return value.lactationMultiplier; });
	};
	//Calculate bonus virility rating!
	//anywhere from 5% to 100% of normal cum effectiveness thru herbs!
	Creature.prototype.virilityQ = function() {
		if (this.cocks.length === 0) {
			return 0;
		}
		var percent = 0.01;
		if (this.cumQ() >= 250) {
			percent += 0.01;
		}
		if (this.cumQ() >= 800) {
			percent += 0.01;
		}
		if (this.cumQ() >= 1600) {
			percent += 0.02;
		}
		if (this.findPerk(PerkLib.BroBody) >= 0) {
			percent += 0.05;
		}
		if (this.findPerk(PerkLib.MaraesGiftStud) >= 0) {
			percent += 0.15;
		}
		if (this.findPerk(PerkLib.FerasBoonAlpha) >= 0) {
			percent += 0.10;
		}
		if (this.perkv1(PerkLib.ElvenBounty) > 0) {
			percent += 0.05;
		}
		if (this.findPerk(PerkLib.FertilityPlus) >= 0) {
			percent += 0.03;
		}
		if (this.findPerk(PerkLib.PiercedFertite) >= 0) {
			percent += 0.03;
		}
		if (this.findPerk(PerkLib.OneTrackMind) >= 0) {
			percent += 0.03;
		}
		if (this.findPerk(PerkLib.MagicalVirility) >= 0) {
			percent += 0.05;
		}
		//Messy Orgasms?
		if (this.findPerk(PerkLib.MessyOrgasms) >= 0) {
			percent += 0.03;
		}
		if (this.percent > 1) {
			percent = 1;
		}
		return percent;
	};
	//Calculate cum return
	Creature.prototype.cumQ = function() {
		if (this.cocks.length === 0) {
			return 0;
		}
		var quantity = 0;
		//Base value is ballsize*ballQ*cumefficiency by a factor of 2.
		//Other things that affect it: 
		//lust - 50% = normal output.  0 = half output. 100 = +50% output.
		//trace('CUM ESTIMATE: ' + int(1.25*2*cumMultiplier*2*(lust + 50)/10 * (hoursSinceCum+10)/24)/10 + '(no balls), ' + int(ballSize*balls*cumMultiplier*2*(lust + 50)/10 * (hoursSinceCum+10)/24)/10 + '(withballs)');
		var lustCoefficient = (this.lust + 50) / 10;
		//Pilgrim's bounty maxxes lust coefficient
		if (this.findPerk(PerkLib.PilgrimsBounty) >= 0) {
			lustCoefficient = 150 / 10;
		}
		if (this.balls === 0) {
			quantity = Math.floor(1.25 * 2 * this.cumMultiplier * 2 * lustCoefficient * (this.hoursSinceCum + 10) / 24) / 10;
		} else {
			quantity = Math.floor(this.ballSize * this.balls * this.cumMultiplier * 2 * lustCoefficient * (this.hoursSinceCum + 10) / 24) / 10;
		}
		if (this.findPerk(PerkLib.BroBody) >= 0) {
			quantity *= 1.3;
		}
		if (this.findPerk(PerkLib.FertilityPlus) >= 0) {
			quantity *= 1.5;
		}
		if (this.findPerk(PerkLib.MessyOrgasms) >= 0) {
			quantity *= 1.5;
		}
		if (this.findPerk(PerkLib.OneTrackMind) >= 0) {
			quantity *= 1.1;
		}
		if (this.findPerk(PerkLib.MaraesGiftStud) >= 0) {
			quantity += 350;
		}
		if (this.findPerk(PerkLib.FerasBoonAlpha) >= 0) {
			quantity += 200;
		}
		if (this.findPerk(PerkLib.MagicalVirility) >= 0) {
			quantity += 200;
		}
		if (this.findPerk(PerkLib.FerasBoonSeeder) >= 0) {
			quantity += 1000;
		}
		//if(hasPerk('Elven Bounty') >= 0) quantity += 250;;
		quantity += this.perkv1(PerkLib.ElvenBounty);
		if (this.findPerk(PerkLib.BroBody) >= 0) {
			quantity += 200;
		}
		quantity += this.statusAffectv1(StatusAffects.Rut);
		quantity *= (1 + (2 * this.perkv1(PerkLib.PiercedFertite)) / 100);
		if (quantity < 2) {
			quantity = 2;
		}
		return quantity;
	};
	Creature.prototype.countCocksOfType = function(type) {
		return _.filter(this.cocks, function(value) { return value.cockType === type; }).length;
	};
	Creature.prototype.anemoneCocks = function() { //How many anemonecocks?
		return this.countCocksOfType(CockTypesEnum.ANEMONE);
	};
	Creature.prototype.catCocks = function() { //How many catcocks?
		return this.countCocksOfType(CockTypesEnum.CAT);
	};
	Creature.prototype.demonCocks = function() { //How many demoncocks?
		return this.countCocksOfType(CockTypesEnum.DEMON);
	};
	Creature.prototype.displacerCocks = function() { //How many displacerCocks?
		return this.countCocksOfType(CockTypesEnum.DISPLACER);
	};
	// Note: DogCocks/FoxCocks are functionally identical. They actually change back and forth depending on some
	// of the PC's attributes, and this is recaluculated every hour spent at camp.
	// As such, delineating between the two is kind of silly.
	Creature.prototype.dogCocks = function() { //How many dogCocks
		return _.filter(this.cocks, function(value) { return value.cockType === CockTypesEnum.DOG || value.cockType === CockTypesEnum.FOX; }).length;
	};
	Creature.prototype.dragonCocks = function() { //How many dragonCocks?
		return this.countCocksOfType(CockTypesEnum.DRAGON);
	};
	Creature.prototype.foxCocks = function() { //How many foxCocks
		return this.dogCocks();
	};
	Creature.prototype.horseCocks = function() { //How many horsecocks?
		return this.countCocksOfType(CockTypesEnum.HORSE);
	};
	Creature.prototype.kangaCocks = function() { //How many kangawangs?
		return this.countCocksOfType(CockTypesEnum.KANGAROO);
	};
	Creature.prototype.lizardCocks = function() { //How many lizard/snake-cocks?
		return this.countCocksOfType(CockTypesEnum.LIZARD);
	};
	Creature.prototype.normalCocks = function() { //How many normalCocks?
		return this.countCocksOfType(CockTypesEnum.HUMAN);
	};
	Creature.prototype.tentacleCocks = function() { //How many tentaclecocks?
		return this.countCocksOfType(CockTypesEnum.TENTACLE);
	};
	Creature.prototype.findFirstCockType = function(ctype) {
		return _.indexOf(_.find(this.cocks, function(value) { return value.cockType === ctype; }));
	};
	//Change first normal cock to horsecock!
	//Return number of affected cock, otherwise -1
	Creature.prototype.addHorseCock = function() {
		var cock = _.find(this.cocks, function(value) { return value.cockType !== CockTypesEnum.HORSE; });
		if(cock) {
			cock.cockType = CockTypesEnum.HORSE;
			return _.indexOf(this.cocks, cock);
		}
		return -1;
	};
	//TODO Seriously wtf. 1500+ calls to cockTotal, 340+ call to totalCocks. I'm scared to touch either.
	//How many cocks?
	Creature.prototype.cockTotal = function() {
		return this.cocks.length;
	};
	//Alternate
	Creature.prototype.totalCocks = Creature.prototype.cockTotal;
	//BOolean alternate
	Creature.prototype.hasCock = function() {
		return this.cocks.length > 0;
	};
	Creature.prototype.hasSockRoom = function() {
		return _.find(this.cocks, function(value) { return value.sock === ''; }).length > 0;
	};
	// Deprecated
	Creature.prototype.hasSock = function(arg) {
		if(arg === undefined) {
			arg = '';
		}
		return _.find(this.cocks, function(value) { return value.sock === arg; }).length > 0;
	};
	Creature.prototype.canAutoFellate = function() {
		return this.longestCockLength() >= 20;
	};
	//PC can fly?
	Creature.prototype.canFly = function() {
		//web also makes false!
		return _.find([2, 7, 9, 11, 12], this.wingType) && this.findStatusAffect(StatusAffects.Web) < 0;
	};
	//check for vagoo
	Creature.prototype.hasVagina = function() {
		return this.vaginas.length > 0;
	};
	Creature.prototype.hasVirginVagina = function() {
		return _.find(this.vaginas, function(value) { return value.virgin; }).length > 0;
	};
	Creature.prototype.genderText = function(male, female, futa, eunuch, caps) {
		if(male === undefined) {
			male = 'man';
		}
		if(female === undefined) {
			female = 'woman';
		}
		if(futa === undefined) {
			futa = 'herm';
		}
		if(eunuch === undefined) {
			eunuch = 'eunuch';
		}
		if (this.vaginas.length > 0) {
			if (this.cocks.length > 0) {
				return caps ? _.capitalize(futa) : futa;
			}
			return caps ? _.capitalize(female) : female;
		} else {
			if(this.biggestTitSize() >= 3) {
				return caps ? _.capitalize(female) : female;
			}
			if (this.cocks.length > 0) {
				return caps ? _.capitalize(male) : male;
			}
			return caps ? _.capitalize(eunuch) : eunuch;
		}
	};
	Creature.prototype.manWoman = function(caps) {
		return this.genderText('man', 'woman', 'futa', 'eunuch', caps);
	};
	Creature.prototype.guyGirl = function(caps) {
		return this.mf('guy', 'girl', caps);
	};
	Creature.prototype.mfn = function(male, female, neuter, caps) {
		return this.genderText(male, female, female, neuter, caps);
	};
	Creature.prototype.mf = function(male, female, caps) {
		return this.genderText(male, female, female, male, caps);
	};
	Creature.prototype.boyGirl = function(caps) {
		return this.mf('boy', 'girl', caps);
	};
	Creature.prototype.heShe = function(caps) {
		return this.mfn('he', 'she', 'it', caps);
	};
	Creature.prototype.himHer = function(caps) {
		return this.mf('him', 'her', caps);
	};
	Creature.prototype.maleFemale = function(caps) {
		return this.mf('male', 'female', caps);
	};
	Creature.prototype.hisHer = function(caps) {
		return this.mf('his', 'her', caps);
	};
	Creature.prototype.sirMadam = function(caps) {
		return this.mf('sir', 'madam', caps);
	};
	//Create a cock. Default type is HUMAN
	Creature.prototype.createCock = function(clength, cthickness,ctype) {
		if (this.cocks.length >= 10) {
			return false;
		}
		if(clength === undefined) {
			clength = 5.5;
		}
		if(cthickness === undefined) {
			cthickness = 1;
		}
		if (ctype === undefined) {
			ctype = CockTypesEnum.HUMAN;
		}
		this.cocks.push(new Cock(clength, cthickness,ctype));
		return true;
	};
	//create vagoo
	Creature.prototype.createVagina = function(virgin, vaginalWetness, vaginalLooseness) {
		if (this.vaginas.length >= 2) {
			return false;
		}
		if(virgin === undefined) {
			virgin = true;
		}
		if(vaginalWetness === undefined) {
			vaginalWetness = 1;
		}
		if(vaginalLooseness === undefined) {
			vaginalLooseness = 0;
		}
		this.vaginas.push(new Vagina(vaginalWetness,vaginalLooseness,virgin));
		return true;
	};
	//create a row of breasts
	Creature.prototype.createBreastRow = function(size,nipplesPerBreast) {
		if (this.breastRows.length >= 10) {
			return false;
		}
		if(size === undefined) {
			size = 0;
		}
		if(nipplesPerBreast === undefined) {
			nipplesPerBreast = 1;
		}
		this.breastRows.push(new BreastRow(size,nipplesPerBreast));
		return true;
	};
	Creature.prototype.genderCheck = function() {
		if (this.cocks.length > 0 && this.vaginas.length > 0) {
			this.gender = AppearanceDefs.GENDER_HERM;
		} else if (this.cocks.length > 0) {
			this.gender = AppearanceDefs.GENDER_MALE;
		} else if (this.vaginas.length > 0) {
			this.gender = AppearanceDefs.GENDER_FEMALE;
		} else {
			this.gender = AppearanceDefs.GENDER_NONE;
		}
		//Fertility fixing
		if(this.hasVagina() && this.fertility < 1) {
			this.fertility = 1;
		}
	};
	//Remove cocks
	Creature.prototype.removeCock = function(arraySpot, totalRemoved) {
		if(arraySpot === undefined) {
			arraySpot = 0;
		}
		if(totalRemoved === undefined) {
			totalRemoved = 1;
		}
		_.pullAt(this.cocks, _.range(arraySpot, arraySpot + totalRemoved));
		var cocksWithRing = _.filter(this.cocks, function(value) { return value.sock === 'cockring'; });
		if (cocksWithRing.length === 0) {
			this.removePerk(PerkLib.PentUp);
		} else {
			this.setPerkValue(PerkLib.PentUp, 1, 5 + (cocksWithRing.length * 5));
		}
		if (_.filter(this.cocks, function(value) { return value.sock === 'viridian'; }).length === 0) {
			this.removePerk(PerkLib.LustyRegeneration);
		}
		this.genderCheck();
	};
	//Remove vaginas
	Creature.prototype.removeVagina = function(arraySpot, totalRemoved) {
		if(arraySpot === undefined) {
			arraySpot = 0;
		}
		if(totalRemoved === undefined) {
			totalRemoved = 1;
		}
		_.pullAt(this.vaginas, _.range(arraySpot, arraySpot + totalRemoved));
		this.genderCheck();
	};
	//Remove a breast row
	Creature.prototype.removeBreastRow = function(arraySpot, totalRemoved) {
		if(arraySpot === undefined) {
			arraySpot = 0;
		}
		if(totalRemoved === undefined) {
			totalRemoved = 1;
		}
		_.pullAt(this.breastRows, _.range(arraySpot, arraySpot + totalRemoved));
		this.genderCheck();
	};
	Creature.prototype.buttChangeNoDisplay = function(cArea) {
		var stretched = false;
		//cArea > capacity = autostreeeeetch half the time.
		if(cArea >= this.analCapacity()) {
			if(this.ass.analLooseness < 5) {
				this.ass.analLooseness++;
			}
			stretched = true;
			//Reset butt stretchin recovery time
			if(this.findStatusAffect(StatusAffects.ButtStretched) >= 0) {
				this.changeStatusValue(StatusAffects.ButtStretched, 1, 0);
			}
		}else if(cArea >= 0.9 * this.analCapacity() && Utils.rand(4) === 0) { //If within top 10% of capacity, 25% stretch
			this.ass.analLooseness++;
			stretched = true;
		}else if(cArea >= 0.75 * this.analCapacity() && Utils.rand(10) === 0) { //if within 75th to 90th percentile, 10% stretch
			this.ass.analLooseness++;
			stretched = true;
		}
		//Anti-virgin
		if(this.ass.analLooseness === 0) {
			this.ass.analLooseness++;
			stretched = true;
		}
		//Delay un-stretching
		if(cArea >= 0.5 * this.analCapacity()) {
			if(this.findStatusAffect(StatusAffects.ButtStretched) < 0) { //Butt Stretched used to determine how long since last enlargement
				this.createStatusAffect(StatusAffects.ButtStretched, 0, 0, 0, 0);
			} else { //Reset the timer on it to 0 when restretched.
				this.changeStatusValue(StatusAffects.ButtStretched, 1, 0);
			}
		}
		if(stretched) {
			$log.debug('BUTT STRETCHED TO ' + (this.ass.analLooseness) + '.');
		}
		return stretched;
	};
	Creature.prototype.cuntChangeNoDisplay = function(cArea) {
		if(this.vaginas.length === 0) {
			return false;
		}
		var stretched = false;
		if(this.findPerk(PerkLib.FerasBoonMilkingTwat) < 0 || this.vaginas[0].vaginalLooseness <= AppearanceDefs.VAGINA_LOOSENESS_NORMAL) {
			if(cArea >= this.vaginalCapacity()) { //cArea > capacity = autostreeeeetch.
				if(this.vaginas[0].vaginalLooseness < AppearanceDefs.VAGINA_LOOSENESS_LEVEL_CLOWN_CAR) {
					this.vaginas[0].vaginalLooseness++;
					stretched = true;
				}
			} else if(cArea >= 0.9 * this.vaginalCapacity() && Utils.rand(2) === 0) { //If within top 10% of capacity, 50% stretch
				this.vaginas[0].vaginalLooseness++;
				stretched = true;
			} else if(cArea >= 0.75 * this.vaginalCapacity() && Utils.rand(4) === 0) { //if within 75th to 90th percentile, 25% stretch
				this.vaginas[0].vaginalLooseness++;
				stretched = true;
			}
		}
		//If virgin
		if(this.vaginas[0].virgin) {
			this.vaginas[0].virgin = false;
		}
		//Delay anti-stretching
		if(cArea >= 0.5 * this.vaginalCapacity()) {
			if(this.findStatusAffect(StatusAffects.CuntStretched) < 0) { //Cunt Stretched used to determine how long since last enlargement
				this.createStatusAffect(StatusAffects.CuntStretched, 0, 0, 0, 0);
			} else { //Reset the timer on it to 0 when restretched.
				this.changeStatusValue(StatusAffects.CuntStretched, 1, 0);
			}
		}
		if(stretched) {
			$log.debug('CUNT STRETCHED TO ' + (this.vaginas[0].vaginalLooseness) + '.');
		}
		return stretched;
	};
	Creature.prototype.isInHeat = function() {
		return this.findStatusAffect(StatusAffects.Heat) >= 0;
	};
	Creature.prototype.isInRut = function() {
		return this.findStatusAffect(StatusAffects.Rut) >= 0;
	};
	Creature.prototype.bonusFertility = function() {
		var result = 0;
		result += this.isInHeat() ? this.statusAffectv1(StatusAffects.Heat) : 0;
		result += this.findPerk(PerkLib.FertilityPlus) >= 0 ? 15 : 0;
		result += this.findPerk(PerkLib.MaraesGiftFertility) >= 0 ? 50 : 0;
		result += this.findPerk(PerkLib.FerasBoonBreedingBitch) >= 0 ? 30 : 0;
		result += this.findPerk(PerkLib.MagicalFertility) >= 0 ? 10 : 0;
		result += this.perkv2(PerkLib.ElvenBounty);
		result += this.perkv1(PerkLib.PiercedFertite);
		return result;
	};
	Creature.prototype.totalFertility = function() {
		return this.bonusFertility() + this.fertility;
	};
	Creature.prototype.isBiped = function() {
		return _.indexOf([
			AppearanceDefs.LOWER_BODY_TYPE_NAGA,
			AppearanceDefs.LOWER_BODY_TYPE_CENTAUR,
			AppearanceDefs.LOWER_BODY_TYPE_GOO,
			AppearanceDefs.LOWER_BODY_TYPE_PONY
		], this.lowerBody) < 0;
	};
	Creature.prototype.isNaga = function() {
		return this.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_NAGA;
	};
	Creature.prototype.isTaur = function() {
		return this.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR || this.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_PONY;
	};
	Creature.prototype.isDrider = function() {
		return this.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DRIDER_LOWER_BODY;
	};
	Creature.prototype.isGoo = function() {
		return this.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_GOO;
	};
	Creature.prototype.legs = function() {
		return this.leg(true);
	};
	Creature.prototype.leg = function(plural) {
		//3 - snakelike body
		if (this.lowerBody === 3) {
			return plural ? 'snake-like coils' : 'snake-tail';
		}
		//4 - centaur!
		if (this.lowerBody === 4) {
			return plural ? 'four legs' : 'equine leg';
		}
		//8 - goo shit
		if (this.lowerBody === 8) {
			return plural ? 'mounds of goo' : 'mound of goo';
		}
		//PONY
		if (this.lowerBody === 11) {
			return plural ? 'cute pony-legs' : 'cartoonish pony-leg';
		}
		//Bunnah!
		if (this.lowerBody === 12) {
			return plural ? Utils.randomChoice('fuzzy, bunny legs', 'fur-covered legs', 'furry legs', 'legs') : Utils.randomChoice('fuzzy, bunny leg', 'fur-covered leg', 'furry leg', 'leg');
		}
		if (this.lowerBody === 13) {
			return plural ? Utils.randomChoice('bird-like legs', 'feathered legs', 'legs', 'legs') : Utils.randomChoice('bird-like leg', 'feathered leg', 'leg', 'leg');
		}
		if (this.lowerBody === 17) {
			return plural ? Utils.randomChoice('fox-like legs', 'vulpine legs', 'legs', 'legs') : Utils.randomChoice('fox-like leg', 'vulpine leg', 'leg', 'leg');
		}
		if (this.lowerBody === 19) {
			return plural ? Utils.randomChoice('raccoon-like legs', 'legs', 'legs', 'legs') : Utils.randomChoice('raccoon-like leg', 'leg', 'leg', 'leg');
		}
		return plural ? 'legs' : 'leg';
	};
	Creature.prototype.skinFurScales = function() {
		var skinzilla = '';
		//Adjectives first!
		if (this.skinAdj !== '') {
			skinzilla += this.skinAdj + ', ';
		}
		//Fur handled a little differently since it uses
		//haircolor
		if (this.skinType === 1) {
			skinzilla += this.hairColor + ' ';
		} else {
			skinzilla += this.skinTone + ' ';
		}
		skinzilla += this.skinDesc;
		return skinzilla;
	};
	Creature.prototype.foot = function(plural) {
		if (this.lowerBody === 1) {
			return plural ? 'hooves' : 'hoof';
		}
		if (this.lowerBody === 2) {
			return plural ? 'paws' : 'paw';
		}
		//3 - snakelike body
		if (this.lowerBody === 3) {
			return plural ? 'coils' : 'coiled tail';
		}
		//4 - centaur!
		if (this.lowerBody === 4) {
			return plural ? 'hooves' : 'hoof';
		}
		if (this.lowerBody === 5) {
			return plural ? 'demonic high-heels' : 'demonic high-heel';
		}
		if (this.lowerBody === 6) {
			return plural ? 'demonic foot-claws' : 'demonic foot-claw';
		}
		//8 - goo shit
		if (this.lowerBody === 8) {
			return plural ? 'slimey cillia' : 'slimey undercarriage';
		}
		//PONY
		if (this.lowerBody === 11) {
			return plural ? 'flat pony-feet' : 'flat pony-foot';
		}
		//Bunnah!
		if (this.lowerBody === 12) {
			return plural ? Utils.randomChoice('large bunny feet', 'rabbit feet', 'large feet', 'feet') : Utils.randomChoice('large bunny foot', 'rabbit foot', 'large foot', 'foot');
		}
		if (this.lowerBody === 13) {
			return plural ? Utils.randomChoice('taloned feet', 'feet', 'feet', 'feet') : Utils.randomChoice('taloned foot', 'foot', 'foot', 'foot');
		}
		if (this.lowerBody === 14) {
			return plural ? 'foot-paws' : 'foot-paw';
		}
		if (this.lowerBody === 17) {
			return plural ? Utils.randomChoice('soft, padded paws', 'fox-like feet', 'paws', 'paws') : Utils.randomChoice('soft, padded paw', 'fox-like foot', 'paw', 'paw');
		}
		if (this.lowerBody === 19) {
			return plural ? Utils.randomChoice('raccoon-like feet', 'long-toed paws', 'feet', 'paws') : Utils.randomChoice('raccoon-like foot', 'long-toed paw', 'foot', 'paw');
		}
		return plural ? 'feet' : 'foot';
	};
	Creature.prototype.feet = function() {
		return this.foot(true);
	};
	Creature.prototype.canOvipositSpider = function() {
		return this.eggs() >= 10 && this.findPerk(PerkLib.SpiderOvipositor) >= 0 && this.isDrider() && this.tailType === 5;
	};
	Creature.prototype.canOvipositBee = function() {
		return this.eggs() >= 10 && this.findPerk(PerkLib.BeeOvipositor) >= 0 && this.tailType === 6;
	};
	Creature.prototype.canOviposit = function() {
		return this.canOvipositSpider() || this.canOvipositBee();
	};
	Creature.prototype.eggs = function() {
		if (this.findPerk(PerkLib.SpiderOvipositor) < 0 && this.findPerk(PerkLib.BeeOvipositor) < 0) {
			return -1;
		} else if (this.findPerk(PerkLib.SpiderOvipositor) >= 0) {
			return this.perkv1(PerkLib.SpiderOvipositor);
		}
		return this.perkv1(PerkLib.BeeOvipositor);
	};
	Creature.prototype.addEggs = function(arg) {
		if (this.eggs() < 0) {
			return -1;
		}
		if(arg === undefined) {
			arg = 0;
		}
		var perk = this.findPerk(PerkLib.SpiderOvipositor) >= 0 ? PerkLib.SpiderOvipositor : PerkLib.BeeOvipositor;
		this.addPerkValue(perk, 1, arg);
		if (this.eggs() > 50) {
			this.setPerkValue(perk, 1, 50);
		}
		return this.perkv1(perk);
	};
	Creature.prototype.dumpEggs = function() {
		if (this.eggs() < 0) {
			return;
		}
		this.setEggs(0);
		//Sets fertile eggs = regular eggs (which are 0)
		this.fertilizeEggs();
	};
	Creature.prototype.setEggs = function(arg) {
		if (this.eggs() < 0) {
			return -1;
		}
		if(arg === undefined) {
			arg = 0;
		}
		var perk = this.findPerk(PerkLib.SpiderOvipositor) >= 0 ? PerkLib.SpiderOvipositor : PerkLib.BeeOvipositor;
		this.setPerkValue(perk, 1, Math.min(arg, 50));
		return this.perkv1(perk);
	};
	Creature.prototype.fertilizedEggs = function() {
		if (this.eggs() < 0) {
			return -1;
		}
		var perk = this.findPerk(PerkLib.SpiderOvipositor) >= 0 ? PerkLib.SpiderOvipositor : PerkLib.BeeOvipositor;
		return this.perkv2(perk);
	};
	Creature.prototype.fertilizeEggs = function() {
		if (this.eggs() < 0) {
			return -1;
		}
		var perk = this.findPerk(PerkLib.SpiderOvipositor) >= 0 ? PerkLib.SpiderOvipositor : PerkLib.BeeOvipositor;
		this.setPerkValue(perk, 2, this.eggs());
		return this.fertilizedEggs();
	};
	Creature.prototype.breastCup = function(rowNum) {
		return Appearance.breastCup(this.breastRows[rowNum].breastRating);
	};
	Creature.prototype.bRows = function() {
		return this.breastRows.length;
	};
	Creature.prototype.totalBreasts = function() {
		return _.sumBy(this.breastRows, function(value) { return value.breasts; });
	};
	Creature.prototype.totalNipples = function() {
		return _.sumBy(this.breastRows, function(value) { return value.nipplesPerBreast * value.breasts; });
	};
	Creature.prototype.smallestTitSize = function() {
		return this.breastRows.length === 0 ? -1 : _.minBy(this.breastRows, function(value) { return value.breastRating; });
	};
	Creature.prototype.smallestTitRow = function() {
		return this.breastRows.length === 0 ? -1 : _.indexOf(_.minBy(this.breastRows, function(value) { return value.breastRating; }));
	};
	Creature.prototype.biggestTitRow = function() {
		return this.breastRows.length === 0 ? -1 : _.indexOf(_.maxBy(this.breastRows, function(value) { return value.breastRating; }));
	};
	Creature.prototype.averageBreastSize = function() {
		return _.meanBy(this.breastRows, function(value) { return value.breastRating; });
	};
	Creature.prototype.averageCockThickness = function() {
		return _.meanBy(this.cocks, function(value) { return value.cockThickness; });
	};
	Creature.prototype.averageNippleLength = function() {
		return _.meanBy(this.breastRows, function(value) { return value.breastRating / 10 + 0.2; });
	};
	Creature.prototype.averageVaginalLooseness = function() {
		return _.meanBy(this.vaginas, function(value) { return value.vaginalLooseness; });
	};
	Creature.prototype.averageVaginalWetness = function() {
		return _.meanBy(this.vaginas, function(value) { return value.vaginalWetness; });
	};
	Creature.prototype.averageCockLength = function() {
		return _.meanBy(this.cocks, function(value) { return value.cockLength; });
	};
	Creature.prototype.canTitFuck = function() {
		return _.find(this.breastRows, function(value) { return value.breasts >= 2 && value.breastRating > 3; });
	};
	Creature.prototype.mostBreastsPerRow = function() {
		return this.breastRows.length === 0 ? 2 : _.maxBy(this.breastRows, function(value) { return value.breasts; }).breasts;
	};
	Creature.prototype.averageNipplesPerBreast = function() {
		return _.meanBy(this.breastRows, function(value) { return value.nipplesPerBreast; });
	};
	Creature.prototype.allBreastsDescript = function() {
		return Appearance.allBreastsDescript(this);
	};
	//Simplified these cock descriptors and brought them into the creature class
	Creature.prototype.sMultiCockDesc = function() {
		return (this.cocks.length > 1 ? 'one of your ' : 'your ') + this._cockMultiLDescriptionShort();
	};
	Creature.prototype.SMultiCockDesc = function() {
		return (this.cocks.length > 1 ? 'One of your ' : 'Your ') + this._cockMultiLDescriptionShort();
	};
	Creature.prototype.oMultiCockDesc = function() {
		return (this.cocks.length > 1 ? 'each of your ' : 'your ') + this._cockMultiLDescriptionShort();
	};
	Creature.prototype.OMultiCockDesc = function() {
		return (this.cocks.length > 1 ? 'Each of your ' : 'Your ') + this._cockMultiLDescriptionShort();
	};
	Creature.prototype._cockMultiLDescriptionShort = function() {
		if (this.cocks.length < 1) {
			CoC_Settings.error('NO WANGS DETECTED for cockMultiLightDesc()');
			return 'NO WANGS DETECTED for cockMultiLightDesc()';
		}
		if (this.cocks.length === 1) { //For a songle cock return the default description
			return Appearance.cockDescript(this, 0);
		}
		switch (this.cocks[0].cockType) { //With multiple cocks only use the descriptions for specific cock types if all cocks are of a single type
			case CockTypesEnum.ANEMONE:
			case CockTypesEnum.CAT:
			case CockTypesEnum.DEMON:
			case CockTypesEnum.DISPLACER:
			case CockTypesEnum.DRAGON:
			case CockTypesEnum.HORSE:
			case CockTypesEnum.KANGAROO:
			case CockTypesEnum.LIZARD:
			case CockTypesEnum.TENTACLE:
				if (this.countCocksOfType(this.cocks[0].cockType) === this.cocks.length) {
					return Appearance.cockNoun(this.cocks[0].cockType) + 's';
				}
				break;
			case CockTypesEnum.DOG:
			case CockTypesEnum.FOX:
				if (this.dogCocks() === this.cocks.length) {
					return Appearance.cockNoun(CockTypesEnum.DOG) + 's';
				}
		}
		return Appearance.cockNoun(CockTypesEnum.HUMAN) + 's';
	};
	Creature.prototype.hasSheath = function() {
		return _.find(this.cocks, function(value) { return _.indexOf([CockTypesEnum.CAT, CockTypesEnum.DISPLACER, CockTypesEnum.DOG, CockTypesEnum.FOX, CockTypesEnum.HORSE, CockTypesEnum.KANGAROO], value.cockType) >= 0; });
	};
	Creature.prototype.sheathDescription = function() {
		return this.hasSheath() ? 'sheath' : 'base';
	};
	Creature.prototype.vaginaDescript = function() {
		return Appearance.vaginaDescript(this, 0);
	};
	Creature.prototype.nippleDescript = function(rowIdx) {
		return Appearance.nippleDescription(this, rowIdx);
	};
	Creature.prototype.chestDesc = function() {
		return this.biggestTitSize() < 1 ? 'chest' : Appearance.biggestBreastSizeDescript(this);
	};
	Creature.prototype.allChestDesc = function() {
		return this.biggestTitSize() < 1 ? 'chest' : this.allBreastsDescript();
	};
	Creature.prototype.clitDescript = function() {
		return Appearance.clitDescription(this);
	};
	Creature.prototype.cockHead = function(cockNum) {
		if(cockNum === undefined) {
			cockNum = 0;
		}
		if (cockNum < 0 || cockNum > this.cocks.length - 1) {
			CoC_Settings.error('');
			return 'ERROR';
		}
		switch (this.cocks[cockNum].cockType) {
			case CockTypesEnum.CAT:
				return Utils.randomChoice('point', 'narrow tip');
			case CockTypesEnum.DEMON:
				return Utils.randomChoice('tainted crown', 'nub-ringed tip');
			case CockTypesEnum.DISPLACER:
				return Utils.randomChoice('star tip', 'blooming cock-head', 'open crown', 'alien tip', 'bizarre head');
			case CockTypesEnum.DOG:
			case CockTypesEnum.FOX:
				return Utils.randomChoice('pointed tip', 'narrow tip');
			case CockTypesEnum.HORSE:
				return Utils.randomChoice('flare', 'flat tip');
			case CockTypesEnum.KANGAROO:
				return Utils.randomChoice('tip', 'point');
			case CockTypesEnum.LIZARD:
				return Utils.randomChoice('crown', 'head');
			case CockTypesEnum.TENTACLE:
				return Utils.randomChoice('mushroom-like tip', 'wide plant-like crown');
			default:
		}
		return Utils.randomChoice('crown', 'head', 'cock-head');
	};
	//Short cock description. Describes length or girth. Supports multiple cocks.
	Creature.prototype.cockDescriptShort = function(i_cockIndex) {
		// catch calls where we're outside of combat, and eCockDescript could be called.
		if(i_cockIndex === undefined) {
			i_cockIndex = 0;
		}
		if (i_cockIndex < 0 || i_cockIndex > this.cocks.length - 1) {
			CoC_Settings.error('');
			return 'ERROR. INVALID CREATURE SPECIFIED to cockDescriptShort';
		}
		var description = '';
		var cock = this.cocks[i_cockIndex];
		if (Utils.rand(3) === 0) { //Discuss length one in 3 times
			if (cock.cockLength >= 30) {
				description = 'towering ';
			} else if (cock.cockLength >= 18) {
				description = 'enormous ';
			} else if (cock.cockLength >= 13) {
				description = 'massive ';
			} else if (cock.cockLength >= 10) {
				description = 'huge ';
			} else if (cock.cockLength >= 7) {
				description = 'long ';
			} else if (cock.cockLength >= 5) {
				description = 'average ';
			} else {
				description = 'short ';
			}
		} else if (Utils.rand(2) === 0) { //Discuss girth one in 2 times if not already talked about length.
			//narrow, thin, ample, broad, distended, voluminous
			if (cock.cockThickness <= 0.75) {
				description = 'narrow ';
			}else if (cock.cockThickness <= 1.4) {
				description = 'ample ';
			} else if (cock.cockThickness <= 2) {
				description = 'broad ';
			} else if (cock.cockThickness <= 3.5) {
				description = 'fat ';
			} else {
				description = 'distended ';
			}
		}
		description += Appearance.cockNoun(cock.cockType);
		return description;
	};
	Creature.prototype.assholeOrPussy = function() {
		return Appearance.assholeOrPussy(this);
	};
	Creature.prototype.multiCockDescriptLight = function() {
		return Appearance.multiCockDescriptLight(this);
	};
	Creature.prototype.multiCockDescript = function() {
		return Appearance.multiCockDescript(this);
	};
	Creature.prototype.ballsDescriptLight = function(forcedSize) {
		if(forcedSize === undefined) {
			forcedSize = true;
		}
		return Appearance.ballsDescription(forcedSize, true, this);
	};
	Creature.prototype.sackDescript = function() {
		return Appearance.sackDescript(this);
	};
	Creature.prototype.breastDescript = function(rowNum) {
		//ERROR PREVENTION
		if (rowNum < 0 || this.breastRows.length - 1 < rowNum) {
			CoC_Settings.error('');
			return 'ERROR, breastDescript() working with invalid breastRow';
		}
		return BreastStore.breastDescript(this.breastRows[rowNum].breastRating, this.breastRows[rowNum].lactationMultiplier);
	};
	Creature.prototype.breastSize = function(val) {
		return Appearance.breastSize(val);
	};
	Creature.prototype.getGame = function() {
		return CoC;
	};
	Creature.prototype.getFlags = function() {
		return this.getCoC.flags;
	};
	return Creature;
});
