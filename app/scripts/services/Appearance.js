'use strict';

angular.module('cocjs').factory('Appearance', function ($log, Utils, AppearanceDefs, CoC_Settings, CockTypesEnum, StatusAffects) {
	var inverseMap = function(x) {
		var result = {};
		_.forOwn(x, function(value, key) {
			result[value.toString()] = key;
		});
		return result;
	};
	
	var hairOrFur = function(i_creature) {
		if (i_creature.skinType === 1) {
			return 'fur';
		}
		return 'hair';
	};
	
	var hairDescription = function(i_creature) {
		var description = '';
		//
		// LENGTH ADJECTIVE!
		//
		if (i_creature.hairLength === 0) {
			return Utils.randomChoice('shaved', 'bald', 'smooth', 'hairless', 'glabrous') + ' head';
		}
		if (i_creature.hairLength < 1) {
			description = description + Utils.randomChoice('close-cropped, ', 'trim, ', 'very short, ');
		}
		if (i_creature.hairLength >= 1 && i_creature.hairLength < 3) {
			description = description + 'short, ';
		}
		if (i_creature.hairLength >= 3 && i_creature.hairLength < 6) {
			description = description + 'shaggy, ';
		}
		if (i_creature.hairLength >= 6 && i_creature.hairLength < 10) {
			description = description + 'moderately long, ';
		}
		if (i_creature.hairLength >= 10 && i_creature.hairLength < 16) {
			description = description + Utils.randomChoice('long, ', 'shoulder-length, ');
		}
		if (i_creature.hairLength >= 16 && i_creature.hairLength < 26) {
			description = description + Utils.randomChoice('very long, ', 'flowing locks of ');
		}
		if (i_creature.hairLength >= 26 && i_creature.hairLength < 40) {
			description  = description + 'ass-length, ';
		}
		if (i_creature.hairLength >= 40 && i_creature.hairLength < i_creature.tallness) {
			description = description + 'obscenely long, ';
		}else if (i_creature.hairLength >= i_creature.tallness) {
			description = description + Utils.randomChoice('floor-length, ', 'floor-dragging, ');
		}
		//
		// COLORS
		//
		description = description + i_creature.hairColor + ' ';
		//
		// HAIR WORDS
		//
		//If furry and longish hair sometimes call it a mane (50%)
		if (i_creature.skinType === 1 && i_creature.hairLength > 3 && Utils.rand(2) === 0) {
			if (i_creature.hairType === 1) {
				description = description + 'feather-';
			} else if (i_creature.hairType === 2) {
				description = description + 'transparent ';
			} else if (i_creature.hairType === 3) {
				description = description + 'goo-';
			} else if (i_creature.hairType === 4) {
				description = description + 'tentacle-';
			}
			description = description + 'mane';
			return description;
		}
		//if medium length refer to as locks sometimes
		
		//If nothing else used, use hair!
		if (i_creature.hairType === 1) {
			description = description + 'feather-';
		} else if (i_creature.hairType === 2) {
			description = description + 'transparent ';
		} else if (i_creature.hairType === 3) {
			description = description + 'goo-';
		} else if (i_creature.hairType === 4) {
			description = description + 'tentacle-';
		}
		description = description + 'hair';

		return description;
	};
	
	/**
	 * Describe tongue. Monsters don't have tongues, apparently.
	 * @param    i_character Either Player or NonPlayer
	 * @return    A beautiful description of a tongue.
	 */
	var tongueDescription = function(i_character) {
		if (i_character.tongueType === 1) {
			return 'serpentine tongue';
		} else if (i_character.tongueType === 2) {
			return 'demonic tongue';
		} else if (i_character.tongueType === 3) {
			return 'draconic tongue';
		} else {
			return 'tongue';
		}
	};
	
	var nippleDescription = function(i_creature, i_rowNum) {
		//DEBUG SHIT!
		if (i_rowNum > (i_creature.breastRows.length - 1)) {
			CoC_Settings.error('Invalid breastRows (' + i_rowNum + ') passed to nippleDescription()');
			return 'Invalid breastRows (' + i_rowNum + ') passed to nippleDescription()';
		}
		if (i_rowNum < 0) {
			CoC_Settings.error('Invalid breastRows (' + i_rowNum + ') passed to nippleDescription()');
			return 'Invalid breastRows (' + i_rowNum + ') passed to nippleDescription()';
		}
		var haveDescription = false;
		var description = '';
		//Size descriptors 33% chance
		if (Utils.rand(4) === 0) {
			//TINAHHHH
			if (i_creature.nippleLength < 0.25) {
				description = description + Utils.randomChoice('tiny ', 'itty-bitty ', 'teeny-tiny ', 'dainty ');
			}else if (i_creature.nippleLength < 1) { //Prominant
				description = description + Utils.randomChoice('prominent ', 'pencil eraser-sized ', 'eye-catching ', 'pronounced ', 'striking ');
			}else if (i_creature.nippleLength < 2) { //Big 'uns
				description = description + Utils.randomChoice('forwards-jutting ', 'over-sized ', 'fleshy ', 'large protruding ');
			}else if (i_creature.nippleLength < 3.2) { //'Uge
				description = description + Utils.randomChoice('elongated ', 'massive ', 'awkward ', 'lavish ', 'hefty ');
			}else { //Massive
				description = description + Utils.randomChoice('bulky ', 'ponderous ', 'thumb-sized ', 'cock-sized ', 'cow-like ');
			}
			haveDescription = true;
		}
		//Milkiness/Arousal/Wetness Descriptors 33% of the time
		if (Utils.rand(3) === 0 && !haveDescription) {
			//Fuckable chance first!
			if (i_creature.hasFuckableNipples()) {
				//Fuckable and lactating?
				if (i_creature.biggestLactation() > 1) {
					description = description + Utils.randomChoice('milk-lubricated ', 'lactating ', 'lactating ', 'milk-slicked ', 'milky ');
				} else { //Just fuckable
					description = description + Utils.randomChoice('wet ', 'mutated ', 'slimy ', 'damp ', 'moist ', 'slippery ', 'oozing ', 'sloppy ', 'dewy ');
				}
				haveDescription = true;
			} else if (i_creature.biggestLactation() > 0) { //Just lactating!
				//Light lactation
				if (i_creature.biggestLactation() <= 1) {
					description = description + Utils.randomChoice('milk moistened ', 'slightly lactating ', 'milk-dampened ');
				}
				//Moderate lactation
				if (i_creature.biggestLactation() > 1 && i_creature.biggestLactation() <= 2) {
					description = description + Utils.randomChoice('lactating ', 'milky ', 'milk-seeping ');
				}
				//Heavy lactation
				if (i_creature.biggestLactation() > 2) {
					description = description + Utils.randomChoice('dripping ', 'dribbling ', 'milk-leaking ', 'drooling ');
				}
				haveDescription = true;
			}
		} else if (Utils.rand(3) === 0 && !haveDescription) { //Possible arousal descriptors
			if (i_creature.lust > 50 && i_creature.lust < 75) {
				description = description + Utils.randomChoice('erect ', 'perky ', 'erect ', 'firm ', 'tender ');
				haveDescription = true;
			}
			if (i_creature.lust >= 75) {
				description = description + Utils.randomChoice('throbbing ', 'trembling ', 'needy ', 'throbbing ');
				haveDescription = true;
			}
		}
		if (!haveDescription && Utils.rand(2) === 0 && i_creature.nipplesPierced > 0 && i_rowNum === 0) {
			if (i_creature.nipplesPierced === 5) {
				description = description + 'chained ';
			} else {
				description = description + 'pierced ';
			}
			haveDescription = true;
		}
		if (!haveDescription && i_creature.skinType === 3) {
			description = description + Utils.randomChoice('slime-slick ', 'goopy ', 'slippery ');
		}
		if (!haveDescription && i_creature.findStatusAffect(StatusAffects.BlackNipples) >= 0) {
			description = description + Utils.randomChoice('black ', 'ebony ', 'sable ');
		}

		//Nounsssssssss*BOOM*
		var choice = Utils.rand(5);
		if (choice === 0) {
			description = description + 'nipple';
		}
		if (choice === 1) {
			if (i_creature.nippleLength < 0.5) {
				description = description + 'perky nipple';
			} else {
				description = description + 'cherry-like nub';
			}
		}
		if (choice === 2) {
			if (i_creature.hasFuckableNipples()) {
				description = description + 'fuckable nip';
			} else {
				if (i_creature.biggestLactation() >= 1 && i_creature.nippleLength >= 1) {
					description = description + 'teat';
				} else {
					description = description + 'nipple';
				}
			}
		}
		if (choice === 3) {
			if (i_creature.hasFuckableNipples()) {
				description = description + 'nipple-hole';
			} else {
				if (i_creature.biggestLactation() >= 1 && i_creature.nippleLength >= 1) {
					description = description + 'teat';
				} else {
					description = description + 'nipple';
				}
			}
		}
		if (choice === 4) {
			if (i_creature.hasFuckableNipples()) {
				description = description + 'nipple-cunt';
			} else {
				description = description + 'nipple';
			}
		}
		return description;
	};
	
	var hipDescription = function(i_character) {
		var description = '';
		if (i_character.hipRating <= 1) {
			description = Utils.randomChoice('tiny ', 'narrow ', 'boyish ');
		} else if (i_character.hipRating > 1 && i_character.hipRating < 4) {
			description = Utils.randomChoice('slender ', 'narrow ', 'thin ');
			if (i_character.thickness < 30) {
				description = Utils.randomChoice('slightly-flared ', 'curved ');
			}
		} else if (i_character.hipRating >= 4 && i_character.hipRating < 6) {
			description = Utils.randomChoice('well-formed ', 'pleasant ');
			if (i_character.thickness < 30) {
				description = Utils.randomChoice('flared ', 'curvy ');
			}
		} else if (i_character.hipRating >= 6 && i_character.hipRating < 10) {
			description = Utils.randomChoice('ample ', 'noticeable ', 'girly ');
			if (i_character.thickness < 30) {
				description = Utils.randomChoice('flared ', 'waspish ');
			}
		} else if (i_character.hipRating >= 10 && i_character.hipRating < 15) {
			description = Utils.randomChoice('flared ', 'curvy ', 'wide ');
			if (i_character.thickness < 30) {
				description = Utils.randomChoice('flared ', 'waspish ');
			}
		} else if (i_character.hipRating >= 15 && i_character.hipRating < 20) {
			if (i_character.thickness < 40) {
				description = Utils.randomChoice('flared, ', 'waspish, ');
			}
			description = description + Utils.randomChoice('fertile ', 'child-bearing ', 'voluptuous ');
		} else if (i_character.hipRating >= 20) {
			if (i_character.thickness < 40) {
				description = Utils.randomChoice('flaring, ', 'incredibly waspish, ');
			}
			description = description + Utils.randomChoice('broodmother-sized ', 'cow-like ', 'inhumanly-wide ');
		}
		//Taurs
		if (i_character.isTaur() && Utils.rand(3) === 0) {
			description = description + 'flanks';
		}
		//Nagas have sides, right?
		else if (i_character.isNaga() && Utils.rand(3) === 0) {
			description = description + 'sides';
		} else { //Non taurs or taurs who didn't roll flanks
			description = description + Utils.randomChoice('hips', 'thighs');
		}

		return description;
	};
	
	var cockDescript = function(creature, cockIndex) {
		if (creature.cocks.length === 0) {
			return 'CockDescript Called But No Cock Present';
		}
		var cockType = CockTypesEnum.HUMAN;
		if (cockIndex !== 99) { //CockIndex 99 forces a human cock description
			if (creature.cocks.length <= cockIndex) {
				return 'CockDescript called with index of ' + cockIndex + ' - out of BOUNDS';
			}
			cockType = creature.cocks[cockIndex].cockType;
		}
		var isPierced = (creature.cocks.length === 1) && (creature.cocks[cockIndex].isPierced); //Only describe as pierced or sock covered if the creature has just one cock
		var hasSock = (creature.cocks.length === 1) && (creature.cocks[cockIndex].sock !== '');
		var isGooey = (creature.skinType === AppearanceDefs.SKIN_TYPE_GOO);
		return cockDescription(cockType, creature.cocks[cockIndex].cockLength, creature.cocks[cockIndex].cockThickness, creature.lust, creature.cumQ(), isPierced, hasSock, isGooey);
	};

	//This function takes all the variables independently so that a creature object is not required for a cockDescription.
	//This allows a single cockDescription function to produce output for both cockDescript and the old NPCCockDescript.
	var cockDescription = function(cockType, length, girth, lust, cumQ, isPierced, hasSock, isGooey) {
		if (lust === undefined) {
			lust = 50;
		}
		if (cumQ === undefined) {
			cumQ = 10;
		}
		if (Utils.rand(2) === 0) {
			if(cockType === CockTypesEnum.HUMAN) {
				return cockAdjective(cockType, length, girth, lust, cumQ, isPierced, hasSock, isGooey) + ' ' + cockNoun(cockType);
			} else {
				return cockAdjective(cockType, length, girth, lust, cumQ, isPierced, hasSock, isGooey) + ', ' + cockNoun(cockType);
			}
		}
		return cockNoun(cockType);
	};

	var cockNoun = function(cockType) {
		if (cockType === CockTypesEnum.HUMAN) {
			// Yeah, this is kind of messy
			// there is no other easy way to preserve the weighting fenoxo did
			return Utils.randomChoice('cock', 'cock', 'cock', 'cock', 'cock', 'prick', 'prick', 'pecker', 'shaft', 'shaft', 'shaft');
		}
		else if (cockType === CockTypesEnum.BEE) {
			return Utils.randomChoice('bee prick', 'bee prick', 'bee prick', 'bee prick', 'insectoid cock', 'insectoid cock', 'furred monster');
		}
		else if (cockType === CockTypesEnum.DOG) {
			return Utils.randomChoice('dog-shaped dong', 'canine shaft', 'pointed prick', 'knotty dog-shaft', 'bestial cock', 'animalistic puppy-pecker', 'pointed dog-dick', 'pointed shaft', 'canine member', 'canine cock', 'knotted dog-cock');
		}
		else if (cockType === CockTypesEnum.FOX) {
			return Utils.randomChoice('fox-shaped dong', 'vulpine shaft', 'pointed prick', 'knotty fox-shaft', 'bestial cock', 'animalistic vixen-pricker', 'pointed fox-dick', 'pointed shaft', 'vulpine member', 'vulpine cock', 'knotted fox-cock');
		}
		else if (cockType === CockTypesEnum.HORSE) {
			return Utils.randomChoice('flared horse-cock', 'equine prick', 'bestial horse-shaft', 'flat-tipped horse-member', 'animalistic stallion-prick', 'equine dong', 'beast cock', 'flared stallion-cock');
		}
		else if (cockType === CockTypesEnum.DEMON) {
			return Utils.randomChoice('nub-covered demon-dick', 'nubby shaft', 'corrupted cock', 'perverse pecker', 'bumpy demon-dick', 'demonic cock', 'demonic dong', 'cursed cock', 'infernal prick', 'unholy cock', 'blighted cock');
		}
		else if (cockType === CockTypesEnum.TENTACLE) {
			return Utils.randomChoice('twisting tentacle-prick', 'wriggling plant-shaft', 'sinuous tentacle-cock', 'squirming cock-tendril', 'writhing tentacle-pecker', 'wriggling plant-prick', 'penile flora', 'smooth shaft', 'undulating tentacle-dick', 'slithering vine-prick', 'vine-shaped cock');
		}
		else if (cockType === CockTypesEnum.CAT) {
			return Utils.randomChoice('feline dick', 'spined cat-cock', 'pink kitty-cock', 'spiny prick', 'animalistic kitty-prick', 'oddly-textured cat-penis', 'feline member', 'spined shaft', 'feline shaft', 'barbed dick', 'nubby kitten-prick');
		}
		else if (cockType === CockTypesEnum.LIZARD) {
			return Utils.randomChoice('reptilian dick', 'purple cock', 'inhuman cock', 'reptilian prick', 'purple prick', 'purple member', 'serpentine member', 'serpentine shaft', 'reptilian shaft', 'bulbous snake-shaft', 'bulging snake-dick');
		}
		else if (cockType === CockTypesEnum.ANEMONE) {
			return Utils.randomChoice('anemone dick', 'tentacle-ringed cock', 'blue member', 'stinger-laden shaft', 'pulsating prick', 'anemone prick', 'stinger-coated member', 'blue cock', 'tentacle-ringed dick', 'near-transparent shaft', 'squirming shaft');
		}
		else if (cockType === CockTypesEnum.KANGAROO) {
			return Utils.randomChoice('kangaroo-like dick', 'pointed cock', 'marsupial member', 'tapered shaft', 'curved pecker', 'pointed prick', 'squirming kangaroo-cock', 'marsupial cock', 'tapered kangaroo-dick', 'curved kangaroo-cock', 'squirming shaft');
		}
		else if (cockType === CockTypesEnum.DRAGON) {
			return Utils.randomChoice('dragon-like dick', 'segmented shaft', 'pointed prick', 'knotted dragon-cock', 'mythical mast', 'segmented tool', 'draconic dick', 'draconic cock', 'tapered dick', 'unusual endowment', 'scaly shaft');
		}
		else if (cockType === CockTypesEnum.DISPLACER) {
			return Utils.randomChoice('coerl cock', 'tentacle-tipped phallus', 'starfish-tipped shaft', 'alien member', 'almost-canine dick', 'bizarre prick', 'beastly cock', 'cthulhu-tier cock', 'coerl cock', 'animal dong', 'star-capped tool', 'knotted erection');
		}
		return Utils.randomChoice('cock', 'prick', 'pecker', 'shaft');
	};

	//New cock adjectives.  The old one sucked dicks
	//This function handles all cockAdjectives. Previously there were separate functions for the player, monsters and NPCs.
	var cockAdjective = function(cockType, length, girth, lust, cumQ, isPierced, hasSock, isGooey) {
		if (lust === undefined) {
			lust = 50;
		}
		if (cumQ === undefined) {
			cumQ = 10;
		}
		//First, the three possible special cases
		if (isPierced && Utils.rand(5) === 0) {
			return 'pierced';
		}
		if (hasSock && Utils.rand(5) === 0) {
			return Utils.randomChoice('sock-sheathed', 'garment-wrapped', 'smartly dressed', 'cloth-shrouded', 'fabric swaddled', 'covered');
		}
		if (isGooey && Utils.rand(4) === 0) {
			return Utils.randomChoice('goopey', 'gooey', 'slimy');
		}
		//Length 1/3 chance
		if (Utils.rand(3) === 0) {
			if (length < 3) {
				return Utils.randomChoice('little', 'toy-sized', 'mini', 'budding', 'tiny');
			}
			if (length < 5) {
				return Utils.randomChoice('short', 'small');
			}
			if (length < 7) {
				return Utils.randomChoice('fair-sized', 'nice');
			}
			if (length < 9) {
				if (cockType === CockTypesEnum.HORSE) {
					return Utils.randomChoice('sizable', 'pony-sized', 'colt-like');
				}
				return Utils.randomChoice('sizable', 'long', 'lengthy');
			}
			if (length < 13) {
				if (cockType === CockTypesEnum.DOG) {
					return Utils.randomChoice('huge', 'foot-long', 'mastiff-like');
				}
				return Utils.randomChoice('huge', 'foot-long', 'cucumber-length');
			}
			if (length < 18) {
				return Utils.randomChoice('massive', 'knee-length', 'forearm-length');
			}
			if (length < 30) {
				return Utils.randomChoice('enormous', 'giant', 'arm-like');
			}
			if (cockType === CockTypesEnum.TENTACLE && Utils.rand(2) === 0) {
				return 'coiled';
			}
			return Utils.randomChoice('towering', 'freakish', 'monstrous', 'massive');
		} else if (lust > 75 && Utils.rand(2) === 0) { //Hornyness 1/2
			if (lust > 90) { //Uber horny like a baws!
				if (cumQ < 50) {
					return Utils.randomChoice('throbbing', 'pulsating'); //Weak as shit cum
				}
				if (cumQ < 200) {
					return Utils.randomChoice('dribbling', 'leaking', 'drooling'); //lots of cum? drippy.
				}
				return Utils.randomChoice('very drippy', 'pre-gushing', 'cum-bubbling', 'pre-slicked', 'pre-drooling'); //Tons of cum
			} else {//A little less lusty, but still lusty.
				if (cumQ < 50) {
					return Utils.randomChoice('turgid', 'blood-engorged', 'rock-hard', 'stiff', 'eager'); //Weak as shit cum
				}
				if (cumQ < 200) {
					return Utils.randomChoice('turgid', 'blood-engorged', 'rock-hard', 'stiff', 'eager', 'fluid-beading', 'slowly-oozing'); //A little drippy
				}
				return Utils.randomChoice('dribbling', 'drooling', 'fluid-leaking', 'leaking'); //uber drippy
			}
		}
		//Girth - fallback
		if (girth <= 0.75) {
			return Utils.randomChoice('thin', 'slender', 'narrow');
		}
		if (girth <= 1.2) {
			return 'ample';
		}
		if (girth <= 1.4) {
			return Utils.randomChoice('ample', 'big');
		}
		if (girth <= 2) {
			return Utils.randomChoice('broad', 'meaty', 'girthy');
		}
		if (girth <= 3.5) {
			return Utils.randomChoice('fat', 'distended', 'wide');
		}
		return Utils.randomChoice('inhumanly distended', 'monstrously thick', 'bloated');
	};

	//Cock adjectives for single cock
	var cockAdjectives = function(i_cockLength, i_cockThickness, i_cockType, i_creature) {
		var description = '';
		var descripts = 0;
		//length or thickness, usually length.
		if (Utils.rand(4) === 0) {
			if (i_cockLength < 3) {
				description = Utils.randomChoice('little', 'toy-sized', 'tiny');
			} else if (i_cockLength < 5) {
				description = Utils.randomChoice('short', 'small');
			} else if (i_cockLength < 7) {
				description = Utils.randomChoice('fair-sized', 'nice');
			} else if (i_cockLength < 9) {
				description = Utils.randomChoice('long', 'lengthy', 'sizable');
			} else if (i_cockLength < 13) {
				description = Utils.randomChoice('huge', 'foot-long');
			} else if (i_cockLength < 18) {
				description = Utils.randomChoice('massive', 'forearm-length');
			} else if (i_cockLength < 30) {
				description = Utils.randomChoice('enormous', 'monster-length');
			} else {
				description = Utils.randomChoice('towering', 'freakish', 'massive');
			}
			descripts = 1;
		} else if (Utils.rand(4) === 0 && descripts === 0) { //thickness go!
			if (i_cockThickness <= 0.75) {
				description = description + 'narrow';
			} else if (i_cockThickness <= 1.1) {
				description = description + 'nice';
			} else if (i_cockThickness <= 1.4) {
				description = description + Utils.randomChoice('ample', 'big');
			} else if (i_cockThickness <= 2) {
				description = description + Utils.randomChoice('broad', 'girthy');
			} else if (i_cockThickness <= 3.5) {
				description = description + Utils.randomChoice('fat', 'distended');
			} else {
				description = description + Utils.randomChoice('inhumanly distended', 'monstrously thick');
			}
			descripts = 1;
		} else if (i_creature.lust > 90) { //FINAL FALLBACKS - lust descriptors //Lust stuff
			//lots of cum? drippy.
			if (i_creature.cumQ() > 50 && i_creature.cumQ() < 200 && Utils.rand(2) === 0) {
				//for hroses and dogs
				if (i_cockType.Group === 'animal') {
					description = description + 'animal-pre leaking';
				} else {
					description = description + 'pre-slickened';
				}
				descripts = 1;
			}
			//Tons of cum
			if (i_creature.cumQ() >= 200 && Utils.rand(2) === 0) {
				//for horses and dogs
				if (i_cockType.Group === 'animal') {
					description = description + 'animal-spunk dripping';
				} else {
					description = description + 'cum-drooling';
				}
				descripts = 1;
			}
			//Not descripted? Pulsing and twitching
			if (descripts === 0) {
				description = description + Utils.randomChoice('throbbing', 'pulsating');
				descripts = 1;
			}
		} else if (i_creature.lust > 75) { //A little less lusty, but still lusty.
			if (descripts === 0 && i_creature.cumQ() > 50 && i_creature.cumQ() < 200 && Utils.rand(2) === 0) {
				description = description + 'pre-leaking';
				descripts = 1;
			}
			if (descripts === 0 && i_creature.cumQ() >= 200 && Utils.rand(2) === 0) {
				description = description + 'pre-cum dripping';
				descripts = 1;
			}
			if (descripts === 0) {
				if (Utils.rand(2) === 0) {
					description = description + 'rock-hard';
				} else {
					description = description + 'eager';
				}
				descripts = 1;
			}
		} else if (i_creature.lust > 50) { //Not lusty at all, fallback adjective
			description = description + 'hard';
		} else {
			description = description + 'ready';
		}
		return description;
	};

	var cockMultiNoun = function(cockType) {
		var description = '';
		if (cockType === CockTypesEnum.HUMAN) {
			description = description + Utils.randomChoice('cock', 'cock', 'cock', 'cock', 'cock', 'prick', 'prick', 'pecker', 'shaft', 'shaft', 'shaft');
		} else if (cockType === CockTypesEnum.BEE) {
			description = description + Utils.randomChoice('bee prick', 'bee prick', 'bee prick', 'bee prick', 'insectoid cock', 'insectoid cock', 'furred monster');
		} else if (cockType === CockTypesEnum.DOG) {
			description = description + Utils.randomChoice('doggie dong', 'canine shaft', 'pointed prick', 'dog-shaft', 'dog-cock', 'puppy-pecker', 'dog-dick', 'pointed shaft', 'canine cock', 'canine cock', 'dog cock');
		} else if (cockType === CockTypesEnum.HORSE) {
			description = description + Utils.randomChoice('horsecock', 'equine prick', 'horse-shaft', 'horse-prick', 'stallion-prick', 'equine dong');
		} else if (cockType === CockTypesEnum.DEMON) {
			description = description + Utils.randomChoice('demon-dick', 'nubby shaft', 'corrupted cock', 'perverse pecker', 'bumpy demon-dick', 'demonic cock', 'demonic dong', 'cursed cock', 'infernal prick', 'unholy cock', 'blighted cock');
		} else if (cockType === CockTypesEnum.TENTACLE) {
			description = description + Utils.randomChoice('tentacle prick', 'plant-like shaft', 'tentacle cock', 'cock-tendril', 'tentacle pecker', 'plant prick', 'penile flora', 'smooth inhuman shaft', 'tentacle dick', 'vine prick', 'vine-like cock');
		} else if (cockType === CockTypesEnum.CAT) {
			description = description + Utils.randomChoice('feline dick', 'cat-cock', 'kitty-cock', 'spiny prick', 'pussy-prick', 'cat-penis', 'feline member', 'spined shaft', 'feline shaft', '\'barbed\' dick', 'kitten-prick');
		} else if (cockType === CockTypesEnum.LIZARD) {
			description = description + Utils.randomChoice('reptile-dick', 'purple cock', 'inhuman cock', 'reptilian prick', 'purple prick', 'purple member', 'serpentine member', 'serpentine shaft', 'reptilian shaft', 'snake-shaft', 'snake dick');
		} else {
			description = description + Utils.randomChoice('cock', 'prick', 'pecker', 'shaft');
		}
		return description;
	};


	/**
	 * Describe creatures balls.
	 * @param    i_forcedSize    Force a description of the size of the balls
	 * @param    i_plural        Show plural forms
	 * @param    i_creature        Monster, Player or NonPlayer
	 * @param    i_withArticle    Show description with article in front
	 * @return    Full description of balls
	 */
	var ballsDescription = function(i_forcedSize, i_plural, i_creature, i_withArticle) {
		if (i_creature.balls === 0) {
			return 'prostate';
		}
		var description = '';

		if (i_plural && (i_creature.findStatusAffect(StatusAffects.Uniball) < 0)) {
			if (i_creature.balls === 1) {
				if (i_withArticle) {
					description = description + Utils.randomChoice('a single', 'a solitary', 'a lone', 'an individual');
				} else {
					description = description + Utils.randomChoice('single', 'solitary', 'lone', 'individual');
				}
			} else if (i_creature.balls === 2) {
				if (i_withArticle) {
					description = description + Utils.randomChoice('a pair of', 'two', 'a duo of');
				} else {
					description = description + Utils.randomChoice('pair of', 'two', 'duo of');
				}
			} else if (i_creature.balls === 3) {
				if (i_withArticle) {
					description = description + Utils.randomChoice('three', 'triple', 'a trio of');
				} else {
					description = description + Utils.randomChoice('three', 'triple', 'trio of');
				}
			} else if (i_creature.balls === 4) {
				if (i_withArticle) {
					description = description + Utils.randomChoice('four', 'quadruple', 'a quartette of');
				} else {
					description = description + Utils.randomChoice('four', 'quadruple', 'quartette of');
				}
			} else {
				if (i_withArticle) {
					description = description + Utils.randomChoice('a multitude of', 'many', 'a large handful of');
				} else {
					description = description + Utils.randomChoice('multitude of', 'many', 'large handful of');
				}
			}
		}
		//size!
		if (i_creature.ballSize > 1 && (Utils.rand(3) <= 1 || i_forcedSize)) {
			if (description) {
				description = description + ' ';
			}

			if (i_creature.ballSize >= 18) {
				description = description + 'hideously swollen and oversized';
			} else if (i_creature.ballSize >= 15) {
				description = description + 'beachball-sized';
			} else if (i_creature.ballSize >= 12) {
				description = description + 'watermelon-sized';
			} else if (i_creature.ballSize >= 9) {
				description = description + 'basketball-sized';
			} else if (i_creature.ballSize >= 7) {
				description = description + 'soccerball-sized';
			} else if (i_creature.ballSize >= 5) {
				description = description + 'cantaloupe-sized';
			} else if (i_creature.ballSize >= 4) {
				description = description + 'grapefruit-sized';
			} else if (i_creature.ballSize >= 3) {
				description = description + 'apple-sized';
			} else if (i_creature.ballSize >= 2) {
				description = description + 'baseball-sized';
			} else if (i_creature.ballSize > 1) {
				description = description + 'large';
			}

		}
		//UNIBALL
		if (i_creature.findStatusAffect(StatusAffects.Uniball) >= 0) {
			if (description) {
				description = description + ' ';
			}
			description = description + Utils.randomChoice('tightly-compressed', 'snug', 'cute', 'pleasantly squeezed', 'compressed-together');

		}
		//Descriptive
		if (i_creature.hoursSinceCum >= 48 && Utils.rand(2) === 0 && !i_forcedSize) {
			if (description) {
				description = description + ' ';
			}
			description = description + Utils.randomChoice('overflowing', 'swollen', 'cum-engorged');

		}
		//lusty
		if (i_creature.lust > 90 && (description === '') && Utils.rand(2) === 0 && !i_forcedSize) {
			description = description + Utils.randomChoice('eager', 'full', 'needy', 'desperate', 'throbbing', 'heated', 'trembling', 'quivering', 'quaking');

		}
		//Slimy skin
		if (i_creature.skinType === 3) {
			if (description) {
				description = description + ' ';
			}
			description = description + Utils.randomChoice('goopey', 'gooey', 'slimy');

		}
		if (description) {
			description = description + ' ';
		}

		description = description + Utils.randomChoice('nut', 'gonad', 'teste', 'testicle', 'testicle', 'ball', 'ball', 'ball');
		if (i_plural) {
			description = description + 's';
		}

		if (i_creature.findStatusAffect(StatusAffects.Uniball) >= 0 && Utils.rand(2) === 0) {
			description = description + Utils.randomChoice(' merged into a cute, spherical package', ' combined into a round, girlish shape', ' squeezed together into a perky, rounded form');
		}
		return description;
	};

	//Returns random description of scrotum
	var sackDescript = function(i_creature) {
		if (i_creature.balls === 0) {
			return 'prostate';
		}
		return Utils.randomChoice('scrotum', 'sack', 'nutsack', 'ballsack', 'beanbag', 'pouch');
	};

	var vaginaDescript = function(i_creature, i_vaginaIndex) {
		if(i_vaginaIndex === undefined) {
			i_vaginaIndex = 0;
		}
		if (i_vaginaIndex > (i_creature.vaginas.length - 1)) {
			CoC_Settings.error('Invalid vagina number (' + i_vaginaIndex + ') passed to vaginaDescript()');
			return 'Invalid vagina number (' + i_vaginaIndex + ') passed to vaginaDescript()';
		}
		if (i_vaginaIndex < 0) {
			CoC_Settings.error('Invalid vaginaNum (' + i_vaginaIndex + ') passed to vaginaDescript()');
			return 'Invalid vaginaNum (' + i_vaginaIndex + ') passed to vaginaDescript()';
		}
		if (i_creature.vaginas.length <= 0) {
			CoC_Settings.error('Called vaginaDescription with no vaginas');
			return 'Called vaginaDescription with no vaginas';
		}

		var description = '';
		var weighting = 0;

		//Very confusing way to display values.
		if (i_creature.vaginas[i_vaginaIndex].vaginalLooseness === 0) {
			weighting = 61;
		}
		if (i_creature.vaginas[i_vaginaIndex].vaginalLooseness === 4 || i_creature.vaginas[i_vaginaIndex].vaginalLooseness === 5) {
			weighting = 10;
		}

		//tightness descript - 40% display rate
		if (Utils.rand(100) + weighting > 60) {
			if (i_creature.vaginas[i_vaginaIndex].vaginalLooseness === 0) {
				if (i_creature.vaginas[i_vaginaIndex].virgin) {
					description = description + 'virgin';
				} else {
					description = description + 'tight';
				}
			}
			if (i_creature.vaginas[i_vaginaIndex].vaginalLooseness === 2) {
				description = description + 'loose';
			}
			if (i_creature.vaginas[i_vaginaIndex].vaginalLooseness === 3) {
				description = description + 'very loose';
			}
			if (i_creature.vaginas[i_vaginaIndex].vaginalLooseness === 4) {
				description = description + 'gaping';
			}
			if (i_creature.vaginas[i_vaginaIndex].vaginalLooseness === 5) {
				description = description + 'gaping-wide';
			}
		}
		//wetness descript - 30% display rate
		if (Utils.rand(100) + weighting > 70) {
			if (description !== '') {
				description = description + ', ';
			}
			if (i_creature.vaginas[i_vaginaIndex].vaginalWetness === 0) {
				description = description + 'dry';
			}
			if (i_creature.vaginas[i_vaginaIndex].vaginalWetness === 1) {
				description = description + 'moist';
			}
			if (i_creature.vaginas[i_vaginaIndex].vaginalWetness === 2) {
				description = description + 'wet';
			}
			if (i_creature.vaginas[i_vaginaIndex].vaginalWetness === 3) {
				description = description + 'slick';
			}
			if (i_creature.vaginas[i_vaginaIndex].vaginalWetness === 4) {
				description = description + 'drooling';
			}
			if (i_creature.vaginas[i_vaginaIndex].vaginalWetness === 5) {
				description = description + 'slavering';
			}
		}
		if (i_creature.vaginas[i_vaginaIndex].labiaPierced > 0 && Utils.rand(3) === 0) {
			if (description !== '') {
				description = description + ', ';
			}
			description = description + 'pierced';
		}
		if (description === '' && i_creature.skinType === 3) {
			if (description !== '') {
				description = description + ', ';
			}
			description = description + Utils.randomChoice('gooey', 'slimy');
		}
		if (i_creature.vaginaType() === 5 && Utils.rand(2) === 0) {
			if (description !== '') {
				description = description + ', ';
			}
			description = description + Utils.randomChoice('black', 'onyx', 'ebony', 'dusky', 'sable', 'obsidian', 'midnight-hued', 'jet black');
		}

		if (description !== '') {
			description = description + ' ';
		}
		description = description + Utils.randomChoice('vagina', 'pussy', 'cooter', 'twat', 'cunt', 'snatch', 'fuck-hole', 'muff');

		return description;
	};

	var clitDescription = function(i_creature) {
		var description = '';
		var haveDescription = false;
		//Length Adjective - 50% chance
		if (Utils.rand(2) === 0) {
			//small clits!
			if (i_creature.clitLength <= 0.5) {
				description = description + Utils.randomChoice('tiny ', 'little ', 'petite ', 'diminutive ', 'miniature ');
			}
			//'average'.
			if (i_creature.clitLength > 0.5 && i_creature.clitLength < 1.5) {
				//no size comment
			}
			//Biggies!
			if (i_creature.clitLength >= 1.5 && i_creature.clitLength < 4) {
				description = description + Utils.randomChoice('large ', 'large ', 'substantial ', 'substantial ', 'considerable ');
			}
			//'Uge
			if (i_creature.clitLength >= 4) {
				description = description + Utils.randomChoice('monster ', 'tremendous ', 'colossal ', 'enormous ', 'bulky ');
			}
		}
		//Descriptive descriptions - 50% chance of being called
		if (Utils.rand(2) === 0) {
			//Doggie descriptors - 50%
			//TODO Conditionals don't make sense, need to introduce a class variable to keep of 'something' or move race or Creature/Character
			if (i_creature.skinType === 1 > 2 && !haveDescription && Utils.rand(2) === 0) {
				description = description + 'bitch-';
				haveDescription = true;
			}
			//Horny descriptors - 75% chance
			if (i_creature.lust > 70 && Utils.rand(4) < 3 && !haveDescription) {
				description = description + Utils.randomChoice('throbbing ', 'pulsating ', 'hard ');
				haveDescription = true;
			}
			//High libido - always use if no other descript
			if (i_creature.lib > 50 && Utils.rand(2) === 0 && !haveDescription) {
				description = description + Utils.randomChoice('insatiable ', 'greedy ', 'demanding ', 'rapacious');
				haveDescription = true;
			}
		}
		if (i_creature.hasVagina()) {
			if (!haveDescription && i_creature.vaginas[0].clitPierced > 0) {
				description = description + 'pierced ';
				haveDescription = true;
			}
		} else {
			CoC_Settings.error('CLITDESCRIPT WITH NO CLIT');
			return('CLITDESCRIPT WITH NO CLIT');
		}

		//Clit nouns
		description = description + Utils.randomChoice('clit', 'clitty', 'button', 'pleasure-buzzer', 'clit', 'clitty', 'button', 'clit', 'clit', 'button');

		return description;
	};

	/**
	 * Gives a full description of a Character's butt.
	 * Be aware that it only supports Characters, not all Creatures.
	 * @param    i_character
	 * @return    A full description of a Character's butt.
	 */
	var buttDescription = function(i_character) {
		var description = '';
		if (i_character.buttRating <= 1) {
			if (i_character.tone >= 60) {
				description = description + 'incredibly tight, perky ';
			} else {
				description = Utils.randomChoice('tiny', 'very small', 'dainty');
				//Soft PC's buns!
				if (i_character.tone <= 30 && Utils.rand(3) === 0) {
					description = description + ' yet soft';
				}
				description = description + ' ';
			}
		}else if (i_character.buttRating < 4) {
			if (i_character.tone >= 65) {
				description = Utils.randomChoice('perky, muscular ', 'tight, toned ', 'compact, muscular ', 'tight ', 'muscular, toned ');
			} else if (i_character.tone >= 30) {
				description = Utils.randomChoice('tight ', 'firm ', 'compact ', 'petite ');
			} else {
				description = Utils.randomChoice('small, heart-shaped ', 'soft, compact ', 'soft, heart-shaped ', 'small, cushy ', 'small ', 'petite ', 'snug ');
			}
		}else if (i_character.buttRating < 6) {
			if (i_character.tone >= 65) {
				description = Utils.randomChoice('nicely muscled ', 'nice, toned ', 'muscly ', 'nice toned ', 'toned ', 'fair ');
			} else if (i_character.tone >= 30) {
				description = Utils.randomChoice('nice ', 'fair ');
			} else {
				description = Utils.randomChoice('nice, cushiony ', 'soft ', 'nicely-rounded, heart-shaped ', 'cushy ', 'soft, squeezable ');
			}
		}else if (i_character.buttRating < 8) {
			if (i_character.tone >= 65) {
				description = Utils.randomChoice('full, toned ', 'muscly handful of ', 'shapely, toned ', 'muscular, hand-filling ', 'shapely, chiseled ', 'full ', 'chiseled ');
			} else if (i_character.tone >= 30) {
				description = Utils.randomChoice('handful of ', 'full ', 'shapely ', 'hand-filling ');
			} else {
				if (Utils.rand(8) === 0) {
					return 'supple, handful of ass';
				}
				description = Utils.randomChoice('somewhat jiggly ', 'soft, hand-filling ', 'cushiony, full ', 'plush, shapely ', 'full ', 'soft, shapely ', 'rounded, spongy ');
			}
		}else if (i_character.buttRating < 10) {
			if (i_character.tone >= 65) {
				description = Utils.randomChoice('large, muscular ', 'substantial, toned ', 'big-but-tight ', 'squeezable, toned ', 'large, brawny ', 'big-but-fit ', 'powerful, squeezable ', 'large ');
			} else if (i_character.tone >= 30) {
				description = Utils.randomChoice('squeezable ', 'large ', 'substantial ');
			} else {
				description = Utils.randomChoice('large, bouncy ', 'soft, eye-catching ', 'big, slappable ', 'soft, pinchable ', 'large, plush ', 'squeezable ', 'cushiony ', 'plush ', 'pleasantly plump ');
			}
		}else if (i_character.buttRating < 13) {
			if (i_character.tone >= 65) {
				description = Utils.randomChoice('thick, muscular ', 'big, burly ', 'heavy, powerful ', 'spacious, muscular ', 'toned, cloth-straining ', 'thick ', 'thick, strong ');
			} else if (i_character.tone >= 30) {
				description = Utils.randomChoice('jiggling ', 'spacious ', 'heavy ', 'cloth-straining ');
			} else {
				description = Utils.randomChoice('super-soft, jiggling ', 'spacious, cushy ', 'plush, cloth-straining ', 'squeezable, over-sized ', 'spacious ', 'heavy, cushiony ', 'slappable, thick ', 'jiggling ', 'spacious ', 'soft, plump ');
			}
		}else if (i_character.buttRating < 16) {
			if (i_character.tone >= 65) {
				description = Utils.randomChoice('expansive, muscled ', 'voluminous, rippling ', 'generous, powerful ', 'big, burly ', 'well-built, voluminous ', 'powerful ', 'muscular ', 'powerful, expansive ');
			} else if (i_character.tone >= 30) {
				description = Utils.randomChoice('expansive ', 'generous ', 'voluminous ', 'wide ');
			} else {
				description = Utils.randomChoice('pillow-like ', 'generous, cushiony ', 'wide, plush ', 'soft, generous ', 'expansive, squeezable ', 'slappable ', 'thickly-padded ', 'wide, jiggling ', 'wide ', 'voluminous ', 'soft, padded ');
			}
		}else if (i_character.buttRating < 20) {
			if (i_character.tone >= 65) {
				description = Utils.randomChoice('huge, toned ', 'vast, muscular ', 'vast, well-built ', 'huge, muscular ', 'strong, immense ', 'muscle-bound ');
			} else if (i_character.tone >= 30) {
				if (Utils.rand(5) === 0) {
					return 'jiggling expanse of ass';
				}
				if (Utils.rand(5) === 0) {
					return 'copious ass-flesh';
				}
				description = Utils.randomChoice('huge ', 'vast ', 'giant ');
			} else {
				description = Utils.randomChoice('vast, cushiony ', 'huge, plump ', 'expansive, jiggling ', 'huge, cushiony ', 'huge, slappable ', 'seam-bursting ', 'plush, vast ', 'giant, slappable ', 'giant ', 'huge ', 'swollen, pillow-like ');
			}
		}else {
			if (i_character.tone >= 65) {
				if (Utils.rand(7) === 0) {
					return 'colossal, muscly ass';
				}
				description = Utils.randomChoice('ginormous, muscle-bound ', 'colossal yet toned ', 'strong, tremdously large ', 'tremendous, muscled ', 'ginormous, toned ', 'colossal, well-defined ');
			} else if (i_character.tone >= 30) {
				description = Utils.randomChoice('ginormous ', 'colossal ', 'tremendous ', 'gigantic ');
			} else {
				description = Utils.randomChoice('ginormous, jiggly ', 'plush, ginormous ', 'seam-destroying ', 'tremendous, rounded ', 'bouncy, colossal ', 'thong-devouring ', 'tremendous, thickly padded ', 'ginormous, slappable ', 'gigantic, rippling ', 'gigantic ', 'ginormous ', 'colossal ', 'tremendous ');
			}
		}
		
		description = description + Utils.randomChoice('butt', 'butt', 'butt', 'butt', 'ass', 'ass', 'ass', 'ass', 'backside', 'backside', 'derriere', 'rump', 'bottom');
		return description;
	};

	/**
	 * Gives a short description of a creature's butt.
	 * Different from buttDescription in that it supports all creatures, not just characters.
	 * Warning, very judgemental.
	 * @param    creature
	 * @return Short description of a butt.
	 */
	var buttDescriptionShort = function(i_creature) {
		var description = '';
		if (i_creature.buttRating <= 1) {
			description = Utils.randomChoice('insignificant ', 'very small ');
		}else if (i_creature.buttRating < 4) {
			description = Utils.randomChoice('tight ', 'firm ', 'compact ');
		}else if (i_creature.buttRating < 6) {
			description = Utils.randomChoice('regular ', 'unremarkable ');
		}else if (i_creature.buttRating < 8) {
			if (Utils.rand(3) === 0) {
				return 'handful of ass';
			}
			description = Utils.randomChoice('full ', 'shapely ');
		}else if (i_creature.buttRating < 10) {
			description = Utils.randomChoice('squeezable ', 'large ', 'substantial ');
		}else if (i_creature.buttRating < 13) {
			description = Utils.randomChoice('jiggling ', 'spacious ', 'heavy ');
		}else if (i_creature.buttRating < 16) {
			if (Utils.rand(3) === 0) {
				return 'generous amount of ass';
			}
			description = Utils.randomChoice('expansive ', 'voluminous ');
		}else if (i_creature.buttRating < 20) {
			if (Utils.rand(3) === 2) {
				return 'jiggling expanse of ass';
			}
			description = Utils.randomChoice('huge ', 'vast ');
		}else {
			description = Utils.randomChoice('ginormous ', 'colossal ', 'tremendous ');
		}
		description = description + Utils.randomChoice('butt ', 'ass ');
		if (Utils.rand(2) === 0) {
			description = description + 'cheeks';
		}
		return description;
	};

	var assholeDescript = function(i_creature) {
		var description = '';
		
		// The way this was setup didn't work. Trying to inline-define object key-values wasn't looking up the variable *VALUES* it was using the string representation
		// of the variable name as the key.
		// ie, querying ANAL_WETNESS_DESCRIPTORS[0] would actually return 'undefined' rather than ''.
		// This is just fucking awful but I'm just making things work in the face of bugs I'm running into.
		
		// 66% Wetness Descript
		var ANAL_WETNESS_DESCRIPTORS = {}; 
		ANAL_WETNESS_DESCRIPTORS[AppearanceDefs.ANAL_WETNESS_DRY] = '';
		ANAL_WETNESS_DESCRIPTORS[AppearanceDefs.ANAL_WETNESS_NORMAL] = '';
		ANAL_WETNESS_DESCRIPTORS[AppearanceDefs.ANAL_WETNESS_MOIST] = 'moist ';
		ANAL_WETNESS_DESCRIPTORS[AppearanceDefs.ANAL_WETNESS_SLIMY] = 'slimy ';
		ANAL_WETNESS_DESCRIPTORS[AppearanceDefs.ANAL_WETNESS_DROOLING] = 'drooling ';
		ANAL_WETNESS_DESCRIPTORS[AppearanceDefs.ANAL_WETNESS_SLIME_DROOLING] = 'slime-drooling ';
		
		if (Utils.rand(3) <= 1) {
			description = description + ANAL_WETNESS_DESCRIPTORS[i_creature.ass.analWetness];
		}
		
		var ANAL_TIGHTNESS_DESCRIPTORS = {};
		ANAL_TIGHTNESS_DESCRIPTORS[AppearanceDefs.ANAL_LOOSENESS_VIRGIN] = 'virgin ';
		ANAL_TIGHTNESS_DESCRIPTORS[AppearanceDefs.ANAL_LOOSENESS_TIGHT] = 'tight ';
		ANAL_TIGHTNESS_DESCRIPTORS[AppearanceDefs.ANAL_LOOSENESS_NORMAL] = 'loose ';
		ANAL_TIGHTNESS_DESCRIPTORS[AppearanceDefs.ANAL_LOOSENESS_LOOSE] = 'roomy ';
		ANAL_TIGHTNESS_DESCRIPTORS[AppearanceDefs.ANAL_LOOSENESS_STRETCHED] = 'stretched ';
		ANAL_TIGHTNESS_DESCRIPTORS[AppearanceDefs.ANAL_LOOSENESS_GAPING] = 'gaping ';
		
		//25% tightness description
		if (Utils.rand(4) === 0 || (i_creature.ass.analLooseness <= 1 && Utils.rand(4) <= 2)) {
			description = description + ANAL_TIGHTNESS_DESCRIPTORS[i_creature.ass.analLooseness];
		}
		
		//asshole descriptor
		description = description + Utils.randomChoice('ass', 'anus', 'pucker', 'backdoor', 'asshole', 'butthole');

		return description;
	};
		
	var wingsDescript = function(i_creature) {
		return DEFAULT_WING_NAMES[i_creature.wingType] + ' wings';
	};

	var BREAST_CUP_NAMES = [
		'flat',//0
		//				1			2			3			4			5				6			7		8			9
		'A-cup', 'B-cup', 'C-cup', 'D-cup', 'DD-cup', 'big DD-cup', 'E-cup', 'big E-cup', 'EE-cup',// 1-9
		'big EE-cup', 'F-cup', 'big F-cup', 'FF-cup', 'big FF-cup', 'G-cup', 'big G-cup', 'GG-cup', 'big GG-cup', 'H-cup',//10-19
		'big H-cup', 'HH-cup', 'big HH-cup', 'HHH-cup', 'I-cup', 'big I-cup', 'II-cup', 'big II-cup', 'J-cup', 'big J-cup',//20-29
		'JJ-cup', 'big JJ-cup', 'K-cup', 'big K-cup', 'KK-cup', 'big KK-cup', 'L-cup', 'big L-cup', 'LL-cup', 'big LL-cup',//30-39
		'M-cup', 'big M-cup', 'MM-cup', 'big MM-cup', 'MMM-cup', 'large MMM-cup', 'N-cup', 'large N-cup', 'NN-cup', 'large NN-cup',//40-49
		'O-cup', 'large O-cup', 'OO-cup', 'large OO-cup', 'P-cup', 'large P-cup', 'PP-cup', 'large PP-cup', 'Q-cup', 'large Q-cup',//50-59
		'QQ-cup', 'large QQ-cup', 'R-cup', 'large R-cup', 'RR-cup', 'large RR-cup', 'S-cup', 'large S-cup', 'SS-cup', 'large SS-cup',//60-69
		'T-cup', 'large T-cup', 'TT-cup', 'large TT-cup', 'U-cup', 'large U-cup', 'UU-cup', 'large UU-cup', 'V-cup', 'large V-cup',//70-79
		'VV-cup', 'large VV-cup', 'W-cup', 'large W-cup', 'WW-cup', 'large WW-cup', 'X-cup', 'large X-cup', 'XX-cup', 'large XX-cup',//80-89
		'Y-cup', 'large Y-cup', 'YY-cup', 'large YY-cup', 'Z-cup', 'large Z-cup', 'ZZ-cup', 'large ZZ-cup', 'ZZZ-cup', 'large ZZZ-cup'//90-99
	];

	var breastCup = function(size) {
		return BREAST_CUP_NAMES[Math.min(Math.floor(size), BREAST_CUP_NAMES.length - 1)];
	};

	/**
	 * Returns breast size from cup name.
	 * Acceptable input: 'flat','A','B','C','D','DD','DD+',... 'ZZZ','ZZZ+' or exact match from BREAST_CUP_NAMES array
	 */
	var breastCupInverse = function(name, defaultValue) {
		if(!defaultValue) {
			defaultValue = 0;
		}
		if (name.length === 0) {
			return defaultValue;
		}
		if (name === 'flat') {
			return 0;
		}
		var big = name.charAt(name.length - 1) === '+';
		if (big) {
			name = name.substr(0, name.length - 1);
		}
		for (var i = 0; i < BREAST_CUP_NAMES.length; i++) {
			if (name === BREAST_CUP_NAMES[i]) {
				return i;
			}
			if (BREAST_CUP_NAMES[i].indexOf(name) === 0) {
				if(big) {
					return i + 1;
				}
				return i;
			}
		}
		return defaultValue;
	};

	var DEFAULT_GENDER_NAMES = Utils.createMapFromPairs([
			[AppearanceDefs.GENDER_NONE, 'genderless'],
			[AppearanceDefs.GENDER_MALE, 'male'],
			[AppearanceDefs.GENDER_FEMALE, 'female'],
			[AppearanceDefs.GENDER_HERM, 'hermaphrodite']
	]);
	var DEFAULT_SKIN_NAMES = Utils.createMapFromPairs([
		[AppearanceDefs.SKIN_TYPE_PLAIN, 'skin'],
		[AppearanceDefs.SKIN_TYPE_FUR, 'fur'],
		[AppearanceDefs.SKIN_TYPE_SCALES, 'scales'],
		[AppearanceDefs.SKIN_TYPE_GOO, 'goo'],
		[AppearanceDefs.SKIN_TYPE_UNDEFINED, 'undefined flesh']
	]);
	var DEFAULT_SKIN_DESCS = Utils.createMapFromPairs([
		[AppearanceDefs.SKIN_TYPE_PLAIN, 'skin'],
		[AppearanceDefs.SKIN_TYPE_FUR, 'fur'],
		[AppearanceDefs.SKIN_TYPE_SCALES, 'scales'],
		[AppearanceDefs.SKIN_TYPE_GOO, 'skin'],
		[AppearanceDefs.SKIN_TYPE_UNDEFINED, 'skin']
	]);
	var DEFAULT_HAIR_NAMES = Utils.createMapFromPairs([
		[AppearanceDefs.HAIR_NORMAL, 'normal'],
		[AppearanceDefs.HAIR_FEATHER, 'feather'],
		[AppearanceDefs.HAIR_GHOST, 'transparent'],
		[AppearanceDefs.HAIR_GOO, 'goopy'],
		[AppearanceDefs.HAIR_ANEMONE, 'tentacle']
	]);
	var DEFAULT_FACE_NAMES = Utils.createMapFromPairs([
		[AppearanceDefs.FACE_HUMAN, 'human'],
		[AppearanceDefs.FACE_HORSE, 'horse'],
		[AppearanceDefs.FACE_DOG, 'dog'],
		[AppearanceDefs.FACE_COW_MINOTAUR, 'cow'],
		[AppearanceDefs.FACE_SHARK_TEETH, 'shark'],
		[AppearanceDefs.FACE_SNAKE_FANGS, 'snake'],
		[AppearanceDefs.FACE_CAT, 'cat'],
		[AppearanceDefs.FACE_LIZARD, 'lizard'],
		[AppearanceDefs.FACE_BUNNY, 'bunny'],
		[AppearanceDefs.FACE_KANGAROO, 'kangaroo'],
		[AppearanceDefs.FACE_SPIDER_FANGS, 'spider'],
		[AppearanceDefs.FACE_FOX, 'fox'],
		[AppearanceDefs.FACE_DRAGON, 'dragon'],
		[AppearanceDefs.FACE_RACCOON_MASK, 'raccoon mask'],
		[AppearanceDefs.FACE_RACCOON, 'racoon'],
		[AppearanceDefs.FACE_BUCKTEETH, 'buckteeth'],
		[AppearanceDefs.FACE_MOUSE, 'mouse']
	]);
	var DEFAULT_TONGUE_NAMES = Utils.createMapFromPairs([
		[AppearanceDefs.TONUGE_HUMAN, 'human'],
		[AppearanceDefs.TONUGE_SNAKE, 'snake'],
		[AppearanceDefs.TONUGE_DEMONIC, 'demonic'],
		[AppearanceDefs.TONUGE_DRACONIC, 'draconic']
	]);
	var DEFAULT_EYES_NAMES = Utils.createMapFromPairs([
		[AppearanceDefs.EYES_HUMAN, 'human'],
		[AppearanceDefs.EYES_FOUR_SPIDER_EYES, '4 spider'],
		[AppearanceDefs.EYES_BLACK_EYES_SAND_TRAP, 'sandtrap black']
	]);
	var DEFAULT_EARS_NAMES = Utils.createMapFromPairs([
		[AppearanceDefs.EARS_HUMAN, 'human'],
		[AppearanceDefs.EARS_HORSE, 'horse'],
		[AppearanceDefs.EARS_DOG, 'dog'],
		[AppearanceDefs.EARS_COW, 'cow'],
		[AppearanceDefs.EARS_ELFIN, 'elfin'],
		[AppearanceDefs.EARS_CAT, 'cat'],
		[AppearanceDefs.EARS_LIZARD, 'lizard'],
		[AppearanceDefs.EARS_BUNNY, 'bunny'],
		[AppearanceDefs.EARS_KANGAROO, 'kangaroo'],
		[AppearanceDefs.EARS_FOX, 'fox'],
		[AppearanceDefs.EARS_DRAGON, 'dragon'],
		[AppearanceDefs.EARS_RACCOON, 'raccoon'],
		[AppearanceDefs.EARS_MOUSE, 'mouse']
	]);
	var DEFAULT_HORNS_NAMES = Utils.createMapFromPairs([
		[AppearanceDefs.HORNS_NONE, 'non-existant'],
		[AppearanceDefs.HORNS_DEMON, 'demon'],
		[AppearanceDefs.HORNS_COW_MINOTAUR, 'cow'],
		[AppearanceDefs.HORNS_DRACONIC_X2, '2 draconic'],
		[AppearanceDefs.HORNS_DRACONIC_X4_12_INCH_LONG, 'four 12\' long draconic'],
		[AppearanceDefs.HORNS_ANTLERS, 'deer']
	]);
	var DEFAULT_ANTENNAE_NAMES = Utils.createMapFromPairs([
		[AppearanceDefs.ANTENNAE_NONE, 'non-existant'],
		[AppearanceDefs.ANTENNAE_BEE, 'bee']
	]);
	var DEFAULT_ARM_NAMES = Utils.createMapFromPairs([
		[AppearanceDefs.ARM_TYPE_HUMAN, 'human'],
		[AppearanceDefs.ARM_TYPE_HARPY, 'harpy'],
		[AppearanceDefs.ARM_TYPE_SPIDER, 'spider']
	]);
	var DEFAULT_TAIL_NAMES = Utils.createMapFromPairs([
		[AppearanceDefs.TAIL_TYPE_NONE, 'non-existant'],
		[AppearanceDefs.TAIL_TYPE_HORSE, 'horse'],
		[AppearanceDefs.TAIL_TYPE_DOG, 'dog'],
		[AppearanceDefs.TAIL_TYPE_DEMONIC, 'demonic'],
		[AppearanceDefs.TAIL_TYPE_COW, 'cow'],
		[AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN, 'spider abdomen'],
		[AppearanceDefs.TAIL_TYPE_BEE_ABDOMEN, 'bee abdomen'],
		[AppearanceDefs.TAIL_TYPE_SHARK, 'shark'],
		[AppearanceDefs.TAIL_TYPE_CAT, 'cat'],
		[AppearanceDefs.TAIL_TYPE_LIZARD, 'lizard'],
		[AppearanceDefs.TAIL_TYPE_RABBIT, 'rabbit'],
		[AppearanceDefs.TAIL_TYPE_HARPY, 'harpy'],
		[AppearanceDefs.TAIL_TYPE_KANGAROO, 'kangaroo'],
		[AppearanceDefs.TAIL_TYPE_FOX, 'fox'],
		[AppearanceDefs.TAIL_TYPE_DRACONIC, 'draconic'],
		[AppearanceDefs.TAIL_TYPE_RACCOON, 'raccoon'],
		[AppearanceDefs.TAIL_TYPE_MOUSE, 'mouse']
	]);
	var DEFAULT_WING_NAMES = Utils.createMapFromPairs([
		[AppearanceDefs.WING_TYPE_NONE, 'non-existant'],
		[AppearanceDefs.WING_TYPE_BEE_LIKE_SMALL, 'small bee-like'],
		[AppearanceDefs.WING_TYPE_BEE_LIKE_LARGE, 'large bee-like'],
		[AppearanceDefs.WING_TYPE_HARPY, 'harpy'],
		[AppearanceDefs.WING_TYPE_IMP, 'imp'],
		[AppearanceDefs.WING_TYPE_BAT_LIKE_TINY, 'tiny bat-like'],
		[AppearanceDefs.WING_TYPE_BAT_LIKE_LARGE, 'large bat-like'],
		[AppearanceDefs.WING_TYPE_SHARK_FIN, 'shark fin'],
		[AppearanceDefs.WING_TYPE_FEATHERED_LARGE, 'large feathered'],
		[AppearanceDefs.WING_TYPE_DRACONIC_SMALL, 'small draconic'],
		[AppearanceDefs.WING_TYPE_DRACONIC_LARGE, 'large draconic'],
		[AppearanceDefs.WING_TYPE_GIANT_DRAGONFLY, 'giant dragonfly']
	]);
	var DEFAULT_WING_DESCS = Utils.createMapFromPairs([
		[AppearanceDefs.WING_TYPE_NONE, 'non-existant'],
		[AppearanceDefs.WING_TYPE_BEE_LIKE_SMALL, 'small bee-like'],
		[AppearanceDefs.WING_TYPE_BEE_LIKE_LARGE, 'large bee-like'],
		[AppearanceDefs.WING_TYPE_HARPY, 'large feathery'],
		[AppearanceDefs.WING_TYPE_IMP, 'small'],
		[AppearanceDefs.WING_TYPE_BAT_LIKE_TINY, 'tiny, bat-like'],
		[AppearanceDefs.WING_TYPE_BAT_LIKE_LARGE, 'large, bat-like'],
		[AppearanceDefs.WING_TYPE_SHARK_FIN, ''],
		[AppearanceDefs.WING_TYPE_FEATHERED_LARGE, 'large, feathered'],
		[AppearanceDefs.WING_TYPE_DRACONIC_SMALL, 'small, draconic'],
		[AppearanceDefs.WING_TYPE_DRACONIC_LARGE, 'large, draconic'],
		[AppearanceDefs.WING_TYPE_GIANT_DRAGONFLY, 'giant dragonfly']
	]);
	var DEFAULT_LOWER_BODY_NAMES = Utils.createMapFromPairs([
		[AppearanceDefs.LOWER_BODY_TYPE_HUMAN, 'human'],
		[AppearanceDefs.LOWER_BODY_TYPE_HOOFED, 'hoofed'],
		[AppearanceDefs.LOWER_BODY_TYPE_DOG, 'dog'],
		[AppearanceDefs.LOWER_BODY_TYPE_NAGA, 'naga'],
		[AppearanceDefs.LOWER_BODY_TYPE_CENTAUR, 'centaur'],
		[AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_HIGH_HEELS, 'demonic high-heels'],
		[AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_CLAWS, 'demonic claws'],
		[AppearanceDefs.LOWER_BODY_TYPE_BEE, 'bee'],
		[AppearanceDefs.LOWER_BODY_TYPE_GOO, 'goo'],
		[AppearanceDefs.LOWER_BODY_TYPE_CAT, 'cat'],
		[AppearanceDefs.LOWER_BODY_TYPE_LIZARD, 'lizard'],
		[AppearanceDefs.LOWER_BODY_TYPE_PONY, 'pony'],
		[AppearanceDefs.LOWER_BODY_TYPE_BUNNY, 'bunny'],
		[AppearanceDefs.LOWER_BODY_TYPE_HARPY, 'harpy'],
		[AppearanceDefs.LOWER_BODY_TYPE_KANGAROO, 'kangaroo'],
		[AppearanceDefs.LOWER_BODY_TYPE_CHITINOUS_SPIDER_LEGS, 'chitinous spider legs'],
		[AppearanceDefs.LOWER_BODY_TYPE_DRIDER_LOWER_BODY, 'drider'],
		[AppearanceDefs.LOWER_BODY_TYPE_FOX, 'fox'],
		[AppearanceDefs.LOWER_BODY_TYPE_DRAGON, 'dragon'],
		[AppearanceDefs.LOWER_BODY_TYPE_RACCOON, 'raccoon']
	]);
	var DEFAULT_PIERCING_NAMES = Utils.createMapFromPairs([
		[AppearanceDefs.PIERCING_TYPE_NONE, 'none'],
		[AppearanceDefs.PIERCING_TYPE_STUD, 'stud'],
		[AppearanceDefs.PIERCING_TYPE_RING, 'ring'],
		[AppearanceDefs.PIERCING_TYPE_LADDER, 'ladder'],
		[AppearanceDefs.PIERCING_TYPE_HOOP, 'hoop'],
		[AppearanceDefs.PIERCING_TYPE_CHAIN, 'chain']
	]);
	var DEFAULT_VAGINA_TYPE_NAMES = Utils.createMapFromPairs([
		[AppearanceDefs.VAGINA_TYPE_HUMAN, 'human'],
		[AppearanceDefs.VAGINA_TYPE_BLACK_SAND_TRAP, 'black sandtrap']
	]);
	var DEFAULT_VAGINA_WETNESS_SCALES = Utils.createMapFromPairs([
		[AppearanceDefs.VAGINA_WETNESS_DRY, 'dry'],
		[AppearanceDefs.VAGINA_WETNESS_NORMAL, 'normal'],
		[AppearanceDefs.VAGINA_WETNESS_WET, 'wet'],
		[AppearanceDefs.VAGINA_WETNESS_SLICK, 'slick'],
		[AppearanceDefs.VAGINA_WETNESS_DROOLING, 'drooling'],
		[AppearanceDefs.VAGINA_WETNESS_SLAVERING, 'slavering'],
	]);
	var DEFAULT_VAGINA_LOOSENESS_SCALES = Utils.createMapFromPairs([
		[AppearanceDefs.VAGINA_LOOSENESS_TIGHT, 'tight'],
		[AppearanceDefs.VAGINA_LOOSENESS_NORMAL, 'normal'],
		[AppearanceDefs.VAGINA_LOOSENESS_LOOSE, 'loose'],
		[AppearanceDefs.VAGINA_LOOSENESS_GAPING, 'gaping'],
		[AppearanceDefs.VAGINA_LOOSENESS_GAPING_WIDE, 'gaping wide'],
		[AppearanceDefs.VAGINA_LOOSENESS_LEVEL_CLOWN_CAR, 'clown-car level']
	]);
	var DEFAULT_ANAL_WETNESS_SCALES = Utils.createMapFromPairs([
		[AppearanceDefs.ANAL_WETNESS_DRY, 'dry'],
		[AppearanceDefs.ANAL_WETNESS_NORMAL, 'normal'],
		[AppearanceDefs.ANAL_WETNESS_MOIST, 'moist'],
		[AppearanceDefs.ANAL_WETNESS_SLIMY, 'slimym'],
		[AppearanceDefs.ANAL_WETNESS_DROOLING, 'drooling'],
		[AppearanceDefs.ANAL_WETNESS_SLIME_DROOLING, 'slime-drooling'],
	]);
	var DEFAULT_ANAL_LOOSENESS_SCALES = Utils.createMapFromPairs([
		[AppearanceDefs.ANAL_LOOSENESS_VIRGIN, 'virgin'],
		[AppearanceDefs.ANAL_LOOSENESS_TIGHT, 'tight'],
		[AppearanceDefs.ANAL_LOOSENESS_NORMAL, 'normal'],
		[AppearanceDefs.ANAL_LOOSENESS_LOOSE, 'loose'],
		[AppearanceDefs.ANAL_LOOSENESS_STRETCHED, 'stretched'],
		[AppearanceDefs.ANAL_LOOSENESS_GAPING, 'gaping']
	]);
	var DEFAULT_HIP_RATING_SCALES = Utils.createMapFromPairs([
		[AppearanceDefs.HIP_RATING_BOYISH, 'boyish'],
		[AppearanceDefs.HIP_RATING_SLENDER, 'slender'],
		[AppearanceDefs.HIP_RATING_AVERAGE, 'average'],
		[AppearanceDefs.HIP_RATING_AMPLE, 'ample'],
		[AppearanceDefs.HIP_RATING_CURVY, 'curvy'],
		[AppearanceDefs.HIP_RATING_FERTILE, 'fertile'],
		[AppearanceDefs.HIP_RATING_INHUMANLY_WIDE, 'inhumanly wide']
	]);
	var DEFAULT_BUTT_RATING_SCALES = Utils.createMapFromPairs([
		[AppearanceDefs.BUTT_RATING_BUTTLESS, 'buttless'],
		[AppearanceDefs.BUTT_RATING_TIGHT, 'tight'],
		[AppearanceDefs.BUTT_RATING_AVERAGE, 'average'],
		[AppearanceDefs.BUTT_RATING_NOTICEABLE, 'noticeable'],
		[AppearanceDefs.BUTT_RATING_LARGE, 'large'],
		[AppearanceDefs.BUTT_RATING_JIGGLY, 'jiggly'],
		[AppearanceDefs.BUTT_RATING_EXPANSIVE, 'expansive'],
		[AppearanceDefs.BUTT_RATING_HUGE, 'huge'],
		[AppearanceDefs.BUTT_RATING_INCONCEIVABLY_BIG, 'inconceivably big']
	]);

	/**
	 * Assume scale = [[0,'small'],[5,'average'],[10,'big']]
	 *      value < 0   ->   'less than small'
	 *      value = 0   ->   'small'
	 *  0 < value < 5   ->   'between small and average'
	 *      value = 5   ->   'average'
	 *  5 < value < 10  ->   'between average and big'
	 *      value = 10  ->   'big'
	 *      value > 10  ->   'more than big'
	 */
	var describeByScale = function(value, scale, lessThan, moreThan) {
		if (lessThan === undefined) {
			lessThan = 'less than';
		}
		if (moreThan === undefined) {
			moreThan = 'more than';
		}
		if (scale.length === 0) {
			return 'undescribeale';
		}
		if (scale.length === 1) {
			return 'about ' + scale[0][1];
		}
		if (value < scale[0][0]) {
			return lessThan + ' ' + scale[0][1];
		}
		if (value === scale[0][0]) {
			return scale[0][1];
		}
		for (var i = 1; i < scale.length; i++) {
			if (value < scale[i][0]) {
				return 'between ' + scale[i - 1][1] + ' and ' + scale[i][1];
			}
			if (value === scale[i][0]) {
				return scale[i][1];
			}
		}
		return moreThan + ' ' + scale[scale.length - 1][1];
	};

	/**
	 * numberOfThings(0,'brain') = 'no brains'
	 * numberOfThings(1,'head') = 'one head'
	 * numberOfThings(2,'tail') = '2 tails'
	 * numberOfThings(3,'hoof','hooves') = '3 hooves'
	 */
	var numberOfThings = function(n, name, pluralForm) {
		var result = pluralForm || (name + 's');
		if (n === 0) {
			return 'no ' + result;
		}
		if (n === 1) {
			return 'one ' + name;
		}
		return n + ' ' + result;
	};

	/**
	 * 13 -> 2'1'
	 * 5.5 -> 5.5'
	 * Positive only!
	 */
	var feetsAndInches = function(n) {
		var feet = Math.floor(n / 12);
		var inches = n - feet * 12;
		if (feet > 0) {
			return feet + '\'' + inches + '\'';
		} else {
			return inches + '\'';
		}
	};

	/**
	 * 13 -> 13' (2'1')
	 */
	var inchesAndFeetsAndInches = function(n) {
		if (n < 12) {
			return n + '\'';
		}
		return n + '\' (' + feetsAndInches(n) + ')';
	};

	var allBreastsDescript = function(creature) {
		var storage = '';
		if (creature.breastRows.length === 0) {
			return 'unremarkable chest muscles ';
		}
		if (creature.breastRows.length === 2) {
			storage = storage + 'two rows of ';
		}
		if (creature.breastRows.length === 3) {
			storage = storage + Utils.randomChoice('three rows of ', 'multi-layered ');
		}
		if (creature.breastRows.length === 4) {
			storage = storage + Utils.randomChoice('four rows of ', 'four-tiered ');
		}
		if (creature.breastRows.length === 5) {
			storage = storage + Utils.randomChoice('five rows of ', 'five-tiered ');
		}
		storage = storage + biggestBreastSizeDescript(creature);
		return storage;
	};
		
	var tailDescript = function(i_creature) {
		if (i_creature.tailType === AppearanceDefs.TAIL_TYPE_NONE) {
			$log.warn('Creature has no tails to describe.');
			return 'Creature has no tails to describe';
		}
		var descript = '';
		if (i_creature.tailType === AppearanceDefs.TAIL_TYPE_FOX && i_creature.tailVenom >= 1) {
			// Kitsune tails, we're using tailVenom to track tail count
			if (i_creature.tailVenom > 1) {
				if (i_creature.tailVenom === 2) {
					descript = descript + 'pair ';
				} else if (i_creature.tailVenom === 3) {
					descript = descript + 'trio ';
				} else if (i_creature.tailVenom === 4) {
					descript = descript + 'quartet ';
				} else if (i_creature.tailVenom === 5) {
					descript = descript + 'quintet ';
				} else if (i_creature.tailVenom > 5) {
					descript = descript + 'bundle ';
				}
				descript = descript + 'of kitsune tails';
			} else {
				descript = descript + 'kitsune tail';
			}
		} else {
			descript = descript + DEFAULT_TAIL_NAMES[i_creature.tailType];
			descript = descript + ' tail';
		}
		return descript;
	};
		
	var oneTailDescript = function(i_creature) {
		if (i_creature.tailType === AppearanceDefs.TAIL_TYPE_NONE) {
			$log.warn('Creature has no tails to describe.');
			return 'Creature has no tails to describe';
		}
		
		var descript = '';
		
		if (i_creature.tailType === AppearanceDefs.TAIL_TYPE_FOX && i_creature.tailVenom >= 1) {
			if (i_creature.tailVenom === 1) {
				descript = descript + 'your kitsune tail';
			} else {
				descript = descript + 'one of your kitsune tails';
			}
		} else {
			descript = descript + 'your ' + DEFAULT_TAIL_NAMES[i_creature.tailType] + ' tail';
		}
		
		return descript;
	};

	var biggestBreastSizeDescript = function(creature) {
		var temp14 = Math.random() * 3;
		var descript = '';
		var temp142 = creature.biggestTitRow();
		//ERROR PREVENTION
		if (creature.breastRows.length - 1 < temp142) {
			CoC_Settings.error('');
			return 'biggestBreastSizeDescript() working with invalid breastRow';
		} else if (temp142 < 0) {
			CoC_Settings.error('BIGGESTBREASTSIZEDESCRIPT PASSED NEGATIVE!');
			return 'ERROR SHIT SON!  BIGGESTBREASTSIZEDESCRIPT PASSED NEGATIVE!';
		}
		if (creature.breastRows[temp142].breastRating < 1) {
			return 'flat breasts';
		}
		//50% of the time size-descript them
		if (Utils.rand(2) === 0) {
			descript = descript + breastSize(creature.breastRows[temp142].breastRating);
		}
		//Nouns!
		temp14 = Utils.rand(10);
		switch(temp14) {
			case 0:
				descript = descript + 'breasts';
				break;
			case 1:
				if (creature.breastRows[temp142].lactationMultiplier > 2) {
					descript = descript + 'milk-udders';
				} else {
					descript = descript + 'breasts';
				}
				break;
			case 2:
				if (creature.breastRows[temp142].lactationMultiplier > 1.5) {
					descript = descript + 'milky ';
				}
				if (creature.breastRows[temp142].breastRating > 4) {
					descript = descript + 'tits';
				} else {
					descript = descript + 'breasts';
				}
				break;
			case 3:
				descript = descript + 'breasts';
				break;
			case 4:
			case 5:
			case 6:
				descript = descript + 'tits';
				break;
			case 7:
				if (creature.breastRows[temp142].lactationMultiplier >= 1 && creature.breastRows[temp142].lactationMultiplier < 2.5) {
					descript = descript + 'milk jugs';
				}else if (creature.breastRows[temp142].lactationMultiplier >= 2.5) {
					descript = descript + 'udders';
				} else {
					descript = descript + 'jugs';
				}
				break;
			case 8:
				if (creature.breastRows[temp142].breastRating > 6) {
					descript = descript + 'love-pillows';
				}else {
					descript = descript + 'boobs';
				}
				break;
			case 9:
				if (creature.breastRows[temp142].breastRating > 6) {
					descript = descript + 'tits';
				} else {
					descript = descript + 'breasts';
				}
		}
		return descript;
	};

	var breastSize = function(val) {
		var descript = '';
		//Catch all for dudes.
		if (val < 1) {
			return 'manly ';
		}
		
		if (val <= 2) { //Small - A->B
			descript = descript + Utils.randomChoice('palmable ', 'tight ', 'perky ', 'baseball-sized ');
		} else if (val <= 4) { //C-D
			descript = descript + Utils.randomChoice('nice ', 'hand-filling ', 'well-rounded ', 'supple ', 'softball-sized ');
		} else if (val < 11) { //DD->big EE
			descript = descript + Utils.randomChoice('big ', 'large ', 'pillowy ', 'jiggly ', 'volleyball-sized ');
		} else if (val < 15) { //F->big FF
			descript = descript + Utils.randomChoice('soccerball-sized ', 'hand-overflowing ', 'generous ', 'jiggling ');
		} else if (val < 24) { //G -> HHH
			descript = descript + Utils.randomChoice('basketball-sized ', 'whorish ', 'cushiony ', 'wobbling ');
		} else if (val < 35) { //I -> KK
			descript = descript + Utils.randomChoice('massive motherly ', 'luscious ', 'smothering ', 'prodigious ');
		} else { //K- > MMM+
			descript = descript + Utils.randomChoice('mountainous ', 'monumental ', 'back-breaking ', 'exercise-ball-sized ', 'immense ');
		}
		return descript;
	};

	var assholeOrPussy = function(creature) {
		if (creature.hasVagina()) {
			return vaginaDescript(creature, 0);
		}
		return assholeDescript(creature);
	};


	var multiCockDescriptLight = function(creature) {
		if (creature.cocks.length < 1) {
			CoC_Settings.error('multiCockDescriptLight() called with no penises present.');
			return 'multiCockDescriptLight() called with no penises present.';
		}
		//Get cock counts
		var descript = '';
		var currCock = 0;
		var totCock = creature.cocks.length;
		var dogCocks = 0;
		var horseCocks = 0;
		var normalCocks = 0;
		var normalCockKey = 0;
		var dogCockKey = 0;
		var horseCockKey = 0;
		var averageLength = 0;
		var averageThickness = 0;
		var same = true;
		var descripted = false;
		//If one, return normal cock descript
		if (totCock === 1) {
			return creature.cockDescript(0);
		}
		//Count cocks & Prep average totals
		while (currCock <= totCock - 1) {
			if (creature.cocks[currCock].cockType === CockTypesEnum.HUMAN) {
				normalCocks++;
				normalCockKey = currCock;
			}
			if (creature.cocks[currCock].cockType === CockTypesEnum.HORSE) {
				horseCocks++;
				horseCockKey = currCock;
			}
			if (creature.cocks[currCock].cockType === CockTypesEnum.DOG) {
				dogCocks++;
				dogCockKey = currCock;
			}
			averageLength = averageLength + creature.cocks[currCock].cockLength;
			averageThickness = averageThickness + creature.cocks[currCock].cockThickness;
			//If cocks are matched make sure they still are
			if (same && currCock > 0 && creature.cocks[currCock].cockType !== creature.cocks[currCock - 1].cockType) {
				same = false;
			}
			currCock++;
		}
		//Crunch averages
		averageLength = averageLength / currCock;
		averageThickness = averageThickness / currCock;
		//Quantity descriptors
		if (creature.cockTotal() === 1) {
			if (dogCocks === 1) {
				return cockNoun(CockTypesEnum.DOG);
			}
			if (horseCocks === 1) {
				return cockNoun(CockTypesEnum.HORSE);
			}
			if (normalCocks === 1) {
				return creature.cockDescript(0);
			}
			//Failsafe
			return creature.cockDescript(0);
		}
		if (currCock === 2) {
			//For cocks that are the same
			if (same) {
				descript = descript + Utils.randomChoice('pair of ', 'two ', 'brace of ', 'matching ', 'twin ');
				descript = descript + creature.cockAdjective();
				if (normalCocks === 2) {
					descript = descript + ' ' + cockNoun(CockTypesEnum.HUMAN) + 's';
				}
				if (horseCocks === 2) {
					descript = descript + ', ' + cockNoun(CockTypesEnum.HORSE) + 's';
				}
				if (dogCocks === 2) {
					descript = descript + ', ' + cockNoun(CockTypesEnum.DOG) + 's';
				}
				//Failsafe
				if (creature.cocks[0].cockType.Index > 2) {
					descript = descript + ', ' + cockNoun(creature.cocks[0].cockType) + 's';
				}
			}
			//Nonidentical
			else {
				descript = descript + Utils.randomChoice('pair of ', 'two ', 'brace of ');
				descript = descript + creature.cockAdjective() + ', ';
				descript = descript + Utils.randomChoice('mutated cocks', 'mutated dicks', 'mixed cocks', 'mismatched dicks');
			}
		}
		if (currCock === 3) {
			//For samecocks
			if (same) {
				descript = descript + Utils.randomChoice('three ', 'group of ', '<i>ménage à trois</i> of ', 'triad of ', 'triumvirate of ');
				descript = descript + creature.cockAdjective();
				if (normalCocks === 3) {
					descript = descript + ' ' + cockNoun(CockTypesEnum.HUMAN) + 's';
				}
				if (horseCocks === 3) {
					descript = descript + ', ' + cockNoun(CockTypesEnum.HORSE) + 's';
				}
				if (dogCocks === 3) {
					descript = descript + ', ' + cockNoun(CockTypesEnum.DOG) + 's';
				}
				//Tentacles
				if (creature.cocks[0].cockType.Index > 2) {
					descript = descript + ', ' + cockNoun(creature.cocks[0].cockType) + 's';
				}
			}
			else {
				descript = descript + Utils.randomChoice('three ', 'group of ');
				descript = descript + creature.cockAdjective() + ', ';
				descript = descript + Utils.randomChoice('mutated cocks', 'mutated dicks', 'mixed cocks', 'mismatched dicks');
			}
		}
		//Large numbers of cocks!
		if (currCock > 3) {
			descript = descript + Utils.randomChoice('bundle of ', 'obscene group of ', 'cluster of ', 'wriggling bunch of ');
			//Cock adjectives and nouns
			descripted = false;
			//Same
			if (same) {
				if (currCock === normalCocks) {
					descript = descript + creature.cockAdjective() + ' ';
					descript = descript + cockNoun(CockTypesEnum.HUMAN) + 's';
					descripted = true;
				}
				if (currCock === dogCocks) {
					descript = descript + creature.cockAdjective() + ', ';
					descript = descript + cockNoun(CockTypesEnum.DOG) + 's';
					descripted = true;
				}
				if (currCock === horseCocks) {
					descript = descript + creature.cockAdjective() + ', ';
					descript = descript + cockNoun(CockTypesEnum.HORSE) + 's';
					descripted = true;
				}
				if (creature.cocks[0].cockType.Index > 2) {
					descript = descript + creature.cockAdjective() + ', ';
					descript = descript + cockNoun(creature.cocks[0].cockType) + 's';
					descripted = true;
				}
			}
			//If mixed
			if (!descripted) {
				descript = descript + creature.cockAdjective() + ', ';
				descript = descript + Utils.randomChoice('mutated cocks', 'mutated dicks', 'mixed cocks', 'mismatched dicks');
			}
		}
		return descript;
	};

	var multiCockDescript = function(creature) {
		if (creature.cocks.length < 1) {
			CoC_Settings.error('multiCockDescript() called with no penises present.');
			return 'multiCockDescript() called with no penises present.';
		}
		//Get cock counts
		var descript = '';
		var currCock = 0;
		var totCock = creature.cocks.length;
		var dogCocks = 0;
		var horseCocks = 0;
		var normalCocks = 0;
		var normalCockKey = 0;
		var dogCockKey = 0;
		var horseCockKey = 0;
		var averageLength = 0;
		var averageThickness = 0;
		var same = true;
		var descripted = false;
		//Count cocks & Prep average totals
		while (currCock <= totCock - 1) {
			//trace('Counting cocks!');
			if (creature.cocks[currCock].cockType === CockTypesEnum.HUMAN) {
				normalCocks++;
				normalCockKey = currCock;
			}
			if (creature.cocks[currCock].cockType === CockTypesEnum.HORSE) {
				horseCocks++;
				horseCockKey = currCock;
			}
			if (creature.cocks[currCock].cockType === CockTypesEnum.DOG) {
				dogCocks++;
				dogCockKey = currCock;
			}
			averageLength = averageLength + creature.cocks[currCock].cockLength;
			averageThickness = averageThickness + creature.cocks[currCock].cockThickness;
			//If cocks are matched make sure they still are
			if (same && currCock > 0 && creature.cocks[currCock].cockType !== creature.cocks[currCock - 1].cockType) {
				same = false;
			}
			currCock++;
		}
		//Crunch averages
		averageLength = averageLength / currCock;
		averageThickness = averageThickness / currCock;
		//Quantity descriptors
		if (currCock === 1) {
			if (dogCocks === 1) {
				return cockNoun(CockTypesEnum.DOG);
			}
			if (horseCocks === 1) {
				return cockNoun(CockTypesEnum.HORSE);
			}
			if (normalCocks === 1) {
				return cockDescript(creature,0);
			}
			//Catch-all for when I add more cocks.  Let cock descript do the sorting.
			if (creature.cocks.length === 1) {
				return cockDescript(creature,0);
			}
		}
		if (currCock === 2) {
			//For cocks that are the same
			if (same) {
				descript = descript + Utils.randomChoice('a pair of ', 'two ', 'a brace of ', 'matching ', 'twin ');
				descript = descript + cockAdjectives(averageLength, averageThickness, creature.cocks[0].cockType, creature);
				if (normalCocks === 2) {
					descript = descript + ' ' + cockNoun(CockTypesEnum.HUMAN) + 's';
				}
				if (horseCocks === 2) {
					descript = descript + ', ' + cockNoun(CockTypesEnum.HORSE) + 's';
				}
				if (dogCocks === 2) {
					descript = descript + ', ' + cockNoun(CockTypesEnum.DOG) + 's';
				}
				//Tentacles
				if (creature.cocks[0].cockType.Index > 2) {
					descript = descript + ', ' + cockNoun(creature.cocks[0].cockType) + 's';
				}
			}
			//Nonidentical
			else {
				descript = descript + Utils.randomChoice('a pair of ', 'two ', 'a brace of ');
				descript = descript + cockAdjectives(averageLength, averageThickness, creature.cocks[0].cockType, creature) + ', ';
				descript = descript + Utils.randomChoice('mutated cocks', 'mutated dicks', 'mixed cocks', 'mismatched dicks');
			}
		}
		if (currCock === 3) {
			//For samecocks
			if (same) {
				descript = descript + Utils.randomChoice('three ', 'a group of ', 'a <i>ménage à trois</i> of ', 'a triad of ', 'a triumvirate of ');
				descript = descript + cockAdjectives(averageLength, averageThickness, creature.cocks[currCock - 1].cockType, creature);
				if (normalCocks === 3) {
					descript = descript + ' ' + cockNoun(CockTypesEnum.HUMAN) + 's';
				}
				if (horseCocks === 3) {
					descript = descript + ', ' + cockNoun(CockTypesEnum.HORSE) + 's';
				}
				if (dogCocks === 3) {
					descript = descript + ', ' + cockNoun(CockTypesEnum.DOG) + 's';
				}
				//Tentacles
				if (creature.cocks[0].cockType.Index > 2) {
					descript = descript + ', ' + cockNoun(creature.cocks[0].cockType) + 's';   // Not sure what's going on here, referencing index *may* be a bug.
				}

			}
			else {
				descript = descript + Utils.randomChoice('three ', 'a group of ');
				descript = descript + cockAdjectives(averageLength, averageThickness, creature.cocks[0].cockType, creature);
				descript = descript + Utils.randomChoice(', mutated cocks', ', mutated dicks', ', mixed cocks', ', mismatched dicks');
			}
		}
		//Large numbers of cocks!
		if (currCock > 3) {
			descript = descript + Utils.randomChoice('a bundle of ', 'an obscene group of ', 'a cluster of ', 'a wriggling group of ');
			//Cock adjectives and nouns
			descripted = false;
			//If same types...
			if (same) {
				if (creature.cocks[0].cockType === CockTypesEnum.HUMAN) {
					descript = descript + cockAdjectives(averageLength, averageThickness, CockTypesEnum.HUMAN, creature) + ' ';
					descript = descript + cockNoun(CockTypesEnum.HUMAN) + 's';
					descripted = true;
				}
				if (creature.cocks[0].cockType === CockTypesEnum.DOG) {
					descript = descript + cockAdjectives(averageLength, averageThickness, CockTypesEnum.DOG, creature) + ', ';
					descript = descript + cockNoun(CockTypesEnum.DOG) + 's';
					descripted = true;
				}
				if (creature.cocks[0].cockType === CockTypesEnum.HORSE) {
					descript = descript + cockAdjectives(averageLength, averageThickness, CockTypesEnum.HORSE, creature) + ', ';
					descript = descript + cockNoun(CockTypesEnum.HORSE) + 's';
					descripted = true;
				}
				//TODO More group cock type descriptions!
				if (creature.cocks[0].cockType.Index > 2) {
					descript = descript + cockAdjectives(averageLength, averageThickness, CockTypesEnum.HUMAN, creature) + ', ';
					descript = descript + cockNoun(creature.cocks[0].cockType) + 's';
					descripted = true;
				}
			}
			//If mixed
			if (!descripted) {
				descript = descript + cockAdjectives(averageLength, averageThickness, creature.cocks[0].cockType, creature) + ', ';
				descript = descript + Utils.randomChoice('mutated cocks', 'mutated dicks', 'mixed cocks', 'mismatched dicks');
			}
		}
		return descript;
	};
	
	return {
		inverseMap: inverseMap,
		hairOrFur: hairOrFur,
		hairDescription: hairDescription,
		tongueDescription: tongueDescription,
		nippleDescription: nippleDescription,
		hipDescription: hipDescription,
		cockDescript: cockDescript,
		cockDescription: cockDescription,
		cockNoun: cockNoun,
		cockAdjective: cockAdjective,
		cockMultiNoun: cockMultiNoun,
		ballsDescription: ballsDescription,
		sackDescript: sackDescript,
		vaginaDescript: vaginaDescript,
		clitDescription: clitDescription,
		buttDescription: buttDescription,
		buttDescriptionShort: buttDescriptionShort,
		assholeDescript: assholeDescript,
		wingsDescript: wingsDescript,
		BREAST_CUP_NAMES: BREAST_CUP_NAMES,
		breastCup: breastCup,
		breastCupInverse: breastCupInverse,
		DEFAULT_GENDER_NAMES: DEFAULT_GENDER_NAMES,
		DEFAULT_SKIN_NAMES: DEFAULT_SKIN_NAMES,
		DEFAULT_SKIN_DESCS: DEFAULT_SKIN_DESCS,
		DEFAULT_HAIR_NAMES: DEFAULT_HAIR_NAMES,
		DEFAULT_FACE_NAMES: DEFAULT_FACE_NAMES,
		DEFAULT_TONGUE_NAMES: DEFAULT_TONGUE_NAMES,
		DEFAULT_EYES_NAMES: DEFAULT_EYES_NAMES,
		DEFAULT_EARS_NAMES: DEFAULT_EARS_NAMES,
		DEFAULT_HORNS_NAMES: DEFAULT_HORNS_NAMES,
		DEFAULT_ANTENNAE_NAMES: DEFAULT_ANTENNAE_NAMES,
		DEFAULT_ARM_NAMES: DEFAULT_ARM_NAMES,
		DEFAULT_TAIL_NAMES: DEFAULT_TAIL_NAMES,
		DEFAULT_WING_NAMES: DEFAULT_WING_NAMES,
		DEFAULT_WING_DESCS: DEFAULT_WING_DESCS,
		DEFAULT_LOWER_BODY_NAMES: DEFAULT_LOWER_BODY_NAMES,
		DEFAULT_PIERCING_NAMES: DEFAULT_PIERCING_NAMES,
		DEFAULT_VAGINA_TYPE_NAMES: DEFAULT_VAGINA_TYPE_NAMES,
		DEFAULT_VAGINA_WETNESS_SCALES: DEFAULT_VAGINA_WETNESS_SCALES,
		DEFAULT_VAGINA_LOOSENESS_SCALES: DEFAULT_VAGINA_LOOSENESS_SCALES,
		DEFAULT_ANAL_WETNESS_SCALES: DEFAULT_ANAL_WETNESS_SCALES,
		DEFAULT_ANAL_LOOSENESS_SCALES: DEFAULT_ANAL_LOOSENESS_SCALES,
		DEFAULT_HIP_RATING_SCALES: DEFAULT_HIP_RATING_SCALES,
		DEFAULT_BUTT_RATING_SCALES: DEFAULT_BUTT_RATING_SCALES,
		describeByScale: describeByScale,
		numberOfThings: numberOfThings,
		feetsAndInches: feetsAndInches,
		inchesAndFeetsAndInches: inchesAndFeetsAndInches,
		allBreastsDescript: allBreastsDescript,
		tailDescript: tailDescript,
		oneTailDescript: oneTailDescript,
		biggestBreastSizeDescript: biggestBreastSizeDescript,
		breastSize: breastSize,
		assholeOrPussy: assholeOrPussy,
		multiCockDescriptLight: multiCockDescriptLight,
		multiCockDescript: multiCockDescript
	};
});
