'use strict';

angular.module( 'cocjs' ).factory( 'Player', function( $log, Character, ItemSlotClass, Pregnancy, ArmorLib, WeaponLib, PerkLib, AppearanceDefs, StatusAffects, EngineCore, MainView, CoC_Settings, CoC, kFLAGS, UmasShop, Utils, Appearance, Descriptors, ItemType ) {
	var Player = angular.copy( Character );

	Player.prototype.init = function( that, args ) {
		Character.prototype.init( that, args );
		//Item things
		that.itemSlot1 = new ItemSlotClass();
		that.itemSlot2 = new ItemSlotClass();
		that.itemSlot3 = new ItemSlotClass();
		that.itemSlot4 = new ItemSlotClass();
		that.itemSlot5 = new ItemSlotClass();
		that.itemSlots = [ that.itemSlot1, that.itemSlot2, that.itemSlot3, that.itemSlot4, that.itemSlot5 ];
		this.armor = ArmorLib.COMFORTABLE_UNDERCLOTHES;
		this.weapon = WeaponLib.FISTS;
		this.modArmorName = '';
		this.slotName = 'VOID';
		this.autoSave = false;
		//Lust vulnerability
		//TODO for backwards compatibility reasons but should be phased out.
		this.lustVuln = 1;
		//Teasing attributes
		this.teaseLevel = 0;
		this.teaseXP = 0;
		//Perks used to store 'queued' perk buys
		this.perkPoints = 0;
		//Number of times this.explored for new areas
		this.explored = 0;
		this.exploredForest = 0;
		this.exploredDesert = 0;
		this.exploredMountain = 0;
		this.exploredLake = 0;
	};
	//Player pregnancy variables and functions
	Player.prototype.pregnancyUpdate = function() {
		return Pregnancy.updatePregnancy(); //Returns true if we need to make sure pregnancy texts aren't hidden
	};
	Player.prototype.getArmorDef = function() {
		var result = this.armor.def;
		//Blacksmith history!
		if( result > 0 && this.findPerk( PerkLib.HistorySmith ) >= 0 ) {
			result = Math.round( result * 1.1 );
			result += 1;
		}
		//Skin armor perk
		if( this.findPerk( PerkLib.ThickSkin ) >= 0 ) {
			result += 2;
			if( this.skinType > AppearanceDefs.SKIN_TYPE_PLAIN ) {
				result += 1;
			}
		}
		//If no skin armor perk scales rock
		else {
			if( this.skinType === AppearanceDefs.SKIN_TYPE_FUR ) {
				result += 1;
			}
			if( this.skinType === AppearanceDefs.SKIN_TYPE_SCALES ) {
				result += 3;
			}
		}
		//'Thick' dermis descriptor adds 1!
		if( this.skinAdj === 'smooth' ) {
			result += 1;
		}
		//Agility boosts armor ratings!
		if( this.findPerk( PerkLib.Agility ) >= 0 ) {
			if( this.armorPerk === 'Light' ) {
				result += Math.round( this.spe / 8 );
			} else if( this.armorPerk === 'Medium' ) {
				result += Math.round( this.spe / 13 );
			}
		}
		//Berzerking removes armor
		if( this.findStatusAffect( StatusAffects.Berzerking ) >= 0 ) {
			result = 0;
		}
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.TailWhip ) >= 0 ) {
			result -= CoC.getInstance().monster.statusAffectv1( StatusAffects.TailWhip );
			if( result < 0 ) {
				result = 0;
			}
		}
		return result;
	};
	Player.prototype.getWeaponAttack = function() {
		var attack = this.weapon.attack;
		if( this.findPerk( PerkLib.WeaponMastery ) >= 0 && this.weaponPerk === 'Large' && this.str > 60 ) {
			attack *= 2;
		}
		if( this.findPerk( PerkLib.LightningStrikes ) >= 0 && this.spe >= 60 && this.weaponPerk !== 'Large' ) {
			attack += Math.round( (this.spe - 50) / 3 );
		}
		if( this.findStatusAffect( StatusAffects.Berzerking ) >= 0 ) {
			attack += 30;
		}
		attack += this.statusAffectv1( StatusAffects.ChargeWeapon );
		return attack;
	};
	Player.prototype.setArmor = function( newArmor ) {
		//Returns the old armor, allowing the caller to discard it, store it or try to place it in the player's inventory
		//Can return null, in which case caller should discard.
		var oldArmor = this.armor.playerRemove(); //The armor is responsible for removing any bonuses, perks, etc.
		if( newArmor === null ) {
			CoC_Settings.error( this.short + '.armor is set to null' );
			newArmor = ArmorLib.COMFORTABLE_UNDERCLOTHES;
		}
		this.armor = newArmor.playerEquip(); //The armor can also choose to equip something else - useful for Ceraph's trap armor
		return oldArmor;
	};
	// in case you don't want to call the value.equip
	Player.prototype.setArmorHiddenField = function( value ) {
		this.armor = value;
	};
	Player.prototype.setWeapon = function( newWeapon ) {
		//Returns the old weapon, allowing the caller to discard it, store it or try to place it in the player's inventory
		//Can return null, in which case caller should discard.
		var oldWeapon = this.weapon.playerRemove(); //The weapon is responsible for removing any bonuses, perks, etc.
		if( newWeapon === null ) {
			CoC_Settings.error( this.short + '.weapon is set to null' );
			newWeapon = WeaponLib.FISTS;
		}
		this.weapon = newWeapon.playerEquip(); //The weapon can also choose to equip something else
		return oldWeapon;
	};
	// in case you don't want to call the value.equip
	Player.prototype.setWeaponHiddenField = function( value ) {
		this.weapon = value;
	};
	Player.prototype.reduceDamage = function( damage ) {
		damage = Math.ceil( damage - Utils.rand( this.tou ) - this.armorDef );
		//EZ MOAD half damage
		if( CoC.getInstance().flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] === 1 ) {
			damage /= 2;
		}
		if( this.findStatusAffect( StatusAffects.Shielding ) >= 0 ) {
			damage -= 30;
			if( damage < 1 ) {
				damage = 1;
			}
		}
		//Black cat beer = 25% reduction!
		if( this.statusAffectv1( StatusAffects.BlackCatBeer ) > 0 ) {
			damage = Math.round( damage * 0.75 );
		}
		//Take damage you masochist!
		if( this.findPerk( PerkLib.Masochist ) >= 0 && this.lib >= 60 ) {
			damage = Math.round( damage * 0.7 );
			EngineCore.dynStats( 'lus', 2 );
			//Dont let it round too far down!
			if( damage < 1 ) {
				damage = 1;
			}
		}
		if( this.findPerk( PerkLib.ImmovableObject ) >= 0 && this.tou >= 75 ) {
			damage = Math.round( damage * 0.8 );
			if( damage < 1 ) {
				damage = 1;
			}
		}
		// Uma's Massage bonuses
		var statIndex = this.findStatusAffect( StatusAffects.UmasMassage );
		if( statIndex >= 0 ) {
			if( this.statusAffect( statIndex ).value1 === UmasShop.MASSAGE_RELAXATION ) {
				damage = Math.round( damage * this.statusAffect( statIndex ).value2 );
			}
		}
		// Uma's Accupuncture Bonuses
		var modArmorDef = 0;
		if( this.findPerk( PerkLib.ChiReflowDefense ) >= 0 ) {
			modArmorDef = ((this.armorDef * UmasShop.NEEDLEWORK_DEFENSE_DEFENSE_MULTI) - this.armorDef);
		}
		if( this.findPerk( PerkLib.ChiReflowAttack ) >= 0 ) {
			modArmorDef = ((this.armorDef * UmasShop.NEEDLEWORK_ATTACK_DEFENSE_MULTI) - this.armorDef);
		}
		damage -= modArmorDef;
		if( damage < 0 ) {
			damage = 0;
		}
		return damage;
	};
	Player.prototype.takeDamage = function( damage ) {
		//Round
		damage = Math.round( damage );
		// we return '1 damage received' if it is in (0..1) but deduce no HP
		var returnDamage = (damage > 0 && damage < 1) ? 1 : damage;
		if( damage > 0 ) {
			this.HP -= damage;
			MainView.statsView.showStatDown( 'hp' );
			if( CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_REALLY_ADDICTED_STATE ] > 0 ) {
				EngineCore.dynStats( 'lus', Math.ceil( damage / 2 ) );
			}
			//Prevent negatives
			if( this.HP <= 0 ) {
				this.HP = 0;
			}
		}
		return returnDamage;
	};
	/**
	 * @return 0 not avoid; 1-3 with varying difference between
	 * speeds (1 avoid, 3 avoid)
	 */
	Player.prototype.speedDodge = function( monster ) {
		var diff = this.spe - monster.spe;
		var rnd = Math.ceil( Math.random() * ((diff / 4) + 80) );
		if( rnd <= 80 ) {
			return 0;
		} else if( diff < 8 ) {
			return 1;
		} else if( diff < 20 ) {
			return 2;
		} else {
			return 3;
		}
	};
	//Body Type
	Player.prototype.bodyType = function() {
		var desc = '';
		//OLD STUFF
		//SUPAH THIN
		if( this.thickness < 10 ) {
			//SUPAH BUFF
			if( this.tone > 90 ) {
				desc += 'a lithe body covered in highly visible muscles';
			} else if( this.tone > 75 ) {
				desc += 'an incredibly thin, well-muscled frame';
			} else if( this.tone > 50 ) {
				desc += 'a very thin body that has a good bit of muscle definition';
			} else if( this.tone > 25 ) {
				desc += 'a lithe body and only a little bit of muscle definition';
			} else {
				desc += 'a waif-thin body, and soft, forgiving flesh';
			}
		}
		//Pretty thin
		else if( this.thickness < 25 ) {
			if( this.tone > 90 ) {
				desc += 'a thin body and incredible muscle definition';
			} else if( this.tone > 75 ) {
				desc += 'a narrow frame that shows off your muscles';
			} else if( this.tone > 50 ) {
				desc += 'a somewhat lithe body and a fair amount of definition';
			} else if( this.tone > 25 ) {
				desc += 'a narrow, soft body that still manages to show off a few muscles';
			} else {
				desc += 'a thin, soft body';
			}
		}
		//Somewhat thin
		else if( this.thickness < 40 ) {
			if( this.tone > 90 ) {
				desc += 'a fit, somewhat thin body and rippling muscles all over';
			} else if( this.tone > 75 ) {
				desc += 'a thinner-than-average frame and great muscle definition';
			} else if( this.tone > 50 ) {
				desc += 'a somewhat narrow body and a decent amount of visible muscle';
			} else if( this.tone > 25 ) {
				desc += 'a moderately thin body, soft curves, and only a little bit of muscle';
			} else {
				desc += 'a fairly thin form and soft, cuddle-able flesh';
			}
		}
		//average
		else if( this.thickness < 60 ) {
			if( this.tone > 90 ) {
				desc += 'average thickness and a bevy of perfectly defined muscles';
			} else if( this.tone > 75 ) {
				desc += 'an average-sized frame and great musculature';
			} else if( this.tone > 50 ) {
				desc += 'a normal waistline and decently visible muscles';
			} else if( this.tone > 25 ) {
				desc += 'an average body and soft, unremarkable flesh';
			} else {
				desc += 'an average frame and soft, untoned flesh with a tendency for jiggle';
			}
		} else if( this.thickness < 75 ) {
			if( this.tone > 90 ) {
				desc += 'a somewhat thick body that\'s covered in slabs of muscle';
			} else if( this.tone > 75 ) {
				desc += 'a body that\'s a little bit wide and has some highly-visible muscles';
			} else if( this.tone > 50 ) {
				desc += 'a solid build that displays a decent amount of muscle';
			} else if( this.tone > 25 ) {
				desc += 'a slightly wide frame that displays your curves and has hints of muscle underneath';
			} else {
				desc += 'a soft, plush body with plenty of jiggle';
			}
		} else if( this.thickness < 90 ) {
			if( this.tone > 90 ) {
				desc += 'a thickset frame that gives you the appearance of a wall of muscle';
			} else if( this.tone > 75 ) {
				desc += 'a burly form and plenty of muscle definition';
			} else if( this.tone > 50 ) {
				desc += 'a solid, thick frame and a decent amount of muscles';
			} else if( this.tone > 25 ) {
				desc += 'a wide-set body, some soft, forgiving flesh, and a hint of muscle underneath it';
			} else {
				desc += 'a wide, cushiony body';
				if( this.gender >= 2 || this.biggestTitSize() > 3 || this.hipRating > 7 || this.buttRating > 7 ) {
					desc += ' and plenty of jiggle on your curves';
				}
			}
		}
		//Chunky monkey
		else {
			if( this.tone > 90 ) {
				desc += 'an extremely thickset frame and so much muscle others would find you harder to move than a huge boulder';
			} else if( this.tone > 75 ) {
				desc += 'a very wide body and enough muscle to make you look like a tank';
			} else if( this.tone > 50 ) {
				desc += 'an extremely substantial frame packing a decent amount of muscle';
			} else if( this.tone > 25 ) {
				desc += 'a very wide body';
				if( this.gender >= 2 || this.biggestTitSize() > 4 || this.hipRating > 10 || this.buttRating > 10 ) {
					desc += ', lots of curvy jiggles,';
				}
				desc += ' and hints of muscle underneath';
			} else {
				desc += 'a thick';
				if( this.gender >= 2 || this.biggestTitSize() > 4 || this.hipRating > 10 || this.buttRating > 10 ) {
					desc += ', voluptuous';
				}
				desc += ' body and plush, ';
				if( this.gender >= 2 || this.biggestTitSize() > 4 || this.hipRating > 10 || this.buttRating > 10 ) {
					desc += ' jiggly curves';
				} else {
					desc += ' soft flesh';
				}
			}
		}
		return desc;
	};
	Player.prototype.race = function() {
		//Determine this.race type this.race:String = 'human';
		if( this.lowerBody === 4 ) {
			this.race = 'centaur';
		}
		if( this.lowerBody === 11 ) {
			this.race = 'pony-kin';
		}
		if( this.catScore() >= 4 ) {
			this.race = 'cat-' + this.mf( 'boy', 'girl' );
		}
		if( this.lizardScore() >= 4 ) {
			if( this.gender === 0 ) {
				this.race = 'lizan';
			} else if( this.gender === 1 ) {
				this.race = 'male lizan';
			} else if( this.gender === 2 ) {
				this.race = 'female lizan';
			} else {
				this.race = 'hermaphrodite lizan';
			}
		}
		if( this.dragonScore() >= 4 ) {
			this.race = 'dragon-morph';
			if( this.faceType === 0 ) {
				this.race = 'dragon-' + this.mf( 'man', 'girl' );
			}
		}
		if( this.raccoonScore() >= 4 ) {
			this.race = 'raccoon-morph';
			if( this.balls > 0 && this.ballSize > 5 ) {
				this.race = 'tanuki-morph';
			}
		}
		if( this.dogScore() >= 4 ) {
			this.race = 'dog-morph';
			if( this.faceType === 0 ) {
				this.race = 'dog-' + this.mf( 'man', 'girl' );
			}
		}
		if( this.foxScore() >= 4 ) {
			if( this.skinType === 1 ) {
				this.race = 'fox-morph';
			} else {
				this.race = 'fox-' + this.mf( 'morph', 'girl' );
			}
		}
		if( this.ferretScore() >= 4 ) {
			if( this.skinType === 1 ) {
				this.race = 'ferret-morph';
			} else {
				this.race = 'ferret-' + this.mf( 'morph', 'girl' );
			}
		}
		if( this.kitsuneScore() >= 4 ) {
			this.race = 'kitsune';
		}
		if( this.horseScore() >= 3 ) {
			if( this.lowerBody === 4 ) {
				this.race = 'centaur-morph';
			} else {
				this.race = 'equine-morph';
			}
		}
		if( this.mutantScore() >= 5 && this.race === 'human' ) {
			this.race = 'corrupted mutant';
		}
		if( this.minoScore() >= 4 ) {
			this.race = 'minotaur-morph';
		}
		if( this.cowScore() > 5 ) {
			this.race = 'cow-';
			this.race += this.mf( 'morph', 'girl' );
		}
		if( this.beeScore() >= 5 ) {
			this.race = 'bee-morph';
		}
		if( this.goblinScore() >= 5 ) {
			this.race = 'goblin';
		}
		if( this.humanScore() >= 5 && this.race === 'corrupted mutant' ) {
			this.race = 'somewhat human mutant';
		}
		if( this.demonScore() > 4 ) {
			this.race = 'demon-morph';
		}
		if( this.sharkScore() >= 3 ) {
			this.race = 'shark-morph';
		}
		if( this.bunnyScore() >= 4 ) {
			this.race = 'bunny-' + this.mf( 'boy', 'girl' );
		}
		if( this.harpyScore() >= 4 ) {
			if( this.gender >= 2 ) {
				this.race = 'harpy';
			} else {
				this.race = 'avian';
			}
		}
		if( this.spiderScore() >= 4 ) {
			this.race = 'spider-morph';
			if( this.mf( 'no', 'yes' ) === 'yes' ) {
				this.race = 'spider-girl';
			}
			if( this.lowerBody === 16 ) {
				this.race = 'drider';
			}
		}
		if( this.kangaScore() >= 4 ) {
			this.race = 'kangaroo-morph';
		}
		if( this.mouseScore() >= 3 ) {
			if( this.faceType !== 16 ) {
				this.race = 'mouse-' + this.mf( 'boy', 'girl' );
			} else {
				this.race = 'mouse-morph';
			}
		}
		if( this.lowerBody === 3 ) {
			this.race = 'naga';
		}
		if( this.lowerBody === 4 ) {
			this.race = 'centaur';
		}
		if( this.gooScore() >= 3 ) {
			this.race = 'goo-';
			this.race += this.mf( 'boi', 'girl' );
		}
		return this.race;
	};
	//determine demon rating
	Player.prototype.demonScore = function() {
		var demonCounter = 0;
		if( this.hornType === 1 && this.horns > 0 ) {
			demonCounter++;
		}
		if( this.hornType === 1 && this.horns > 4 ) {
			demonCounter++;
		}
		if( this.tailType === 3 ) {
			demonCounter++;
		}
		if( this.wingType === 6 || this.wingType === 7 ) {
			demonCounter++;
		}
		if( this.skinType === 0 && this.cor > 50 ) {
			demonCounter++;
		}
		if( this.faceType === 0 && this.cor > 50 ) {
			demonCounter++;
		}
		if( this.lowerBody === 5 || this.lowerBody === 6 ) {
			demonCounter++;
		}
		if( this.demonCocks() > 0 ) {
			demonCounter++;
		}
		return demonCounter;
	};
	//Determine Human Rating
	Player.prototype.humanScore = function() {
		var humanCounter = 0;
		if( this.faceType === 0 ) {
			humanCounter++;
		}
		if( this.skinType === 0 ) {
			humanCounter++;
		}
		if( this.horns === 0 ) {
			humanCounter++;
		}
		if( this.tailType === 0 ) {
			humanCounter++;
		}
		if( this.wingType === 0 ) {
			humanCounter++;
		}
		if( this.lowerBody === 0 ) {
			humanCounter++;
		}
		if( this.normalCocks() === 1 && this.totalCocks() === 1 ) {
			humanCounter++;
		}
		if( this.breastRows.length === 1 && this.skinType === 0 ) {
			humanCounter++;
		}
		return humanCounter;
	};
	//Determine minotaur rating
	Player.prototype.minoScore = function() {
		var minoCounter = 0;
		if( this.faceType === 3 ) {
			minoCounter++;
		}
		if( this.earType === 3 ) {
			minoCounter++;
		}
		if( this.tailType === 4 ) {
			minoCounter++;
		}
		if( this.hornType === 2 ) {
			minoCounter++;
		}
		if( this.lowerBody === 1 && minoCounter > 0 ) {
			minoCounter++;
		}
		if( this.tallness > 80 && minoCounter > 0 ) {
			minoCounter++;
		}
		if( this.cocks.length > 0 && minoCounter > 0 ) {
			if( this.horseCocks() > 0 ) {
				minoCounter++;
			}
		}
		if( this.vaginas.length > 0 ) {
			minoCounter--;
		}
		return minoCounter;
	};
	//Determine cow rating
	Player.prototype.cowScore = function() {
		var minoCounter = 0;
		if( this.faceType === 0 ) {
			minoCounter++;
		}
		if( this.faceType === 3 ) {
			minoCounter--;
		}
		if( this.earType === 3 ) {
			minoCounter++;
		}
		if( this.tailType === 4 ) {
			minoCounter++;
		}
		if( this.hornType === 2 ) {
			minoCounter++;
		}
		if( this.lowerBody === 1 && minoCounter > 0 ) {
			minoCounter++;
		}
		if( this.tallness >= 73 && minoCounter > 0 ) {
			minoCounter++;
		}
		if( this.vaginas.length > 0 ) {
			minoCounter++;
		}
		if( this.biggestTitSize() > 4 && minoCounter > 0 ) {
			minoCounter++;
		}
		if( this.biggestLactation() > 2 && minoCounter > 0 ) {
			minoCounter++;
		}
		return minoCounter;
	};
	Player.prototype.sandTrapScore = function() {
		var counter = 0;
		if( this.findStatusAffect( StatusAffects.BlackNipples ) >= 0 ) {
			counter++;
		}
		if( this.hasVagina() && this.vaginaType() === 5 ) {
			counter++;
		}
		if( this.eyeType === 2 ) {
			counter++;
		}
		if( this.wingType === 12 ) {
			counter++;
		}
		if( this.findStatusAffect( StatusAffects.Uniball ) >= 0 ) {
			counter++;
		}
		return counter;
	};
	//Determine Bee Rating
	Player.prototype.beeScore = function() {
		var beeCounter = 0;
		if( this.hairColor === 'shiny black' ) {
			beeCounter++;
		}
		if( this.hairColor === 'black and yellow' ) {
			beeCounter += 2;
		}
		if( this.antennae > 0 ) {
			beeCounter++;
			if( this.faceType === 0 ) {
				beeCounter++;
			}
		}
		if( this.lowerBody === 7 ) {
			beeCounter++;
			if( this.vaginas.length === 1 ) {
				beeCounter++;
			}
		}
		if( this.tailType === 6 ) {
			beeCounter++;
		}
		if( this.wingType === 1 ) {
			beeCounter++;
		}
		if( this.wingType === 2 ) {
			beeCounter++;
		}
		return beeCounter;
	};
	//Determine Ferret Rating!
	Player.prototype.ferretScore = function() {
		var counter = 0;
		if( this.faceType === AppearanceDefs.FACE_FERRET_MASK ) {
			counter++;
		}
		if( this.faceType === AppearanceDefs.FACE_FERRET ) {
			counter += 2;
		}
		if( this.earType === AppearanceDefs.EARS_FERRET ) {
			counter++;
		}
		if( this.tailType === AppearanceDefs.TAIL_TYPE_FERRET ) {
			counter++;
		}
		if( this.lowerBody === AppearanceDefs.LOWER_BODY_FERRET ) {
			counter++;
		}
		if( this.skinType === AppearanceDefs.SKIN_TYPE_FUR && counter > 0 ) {
			counter++;
		}
		return counter;
	};
	//Determine Dog Rating
	Player.prototype.dogScore = function() {
		var dogCounter = 0;
		if( this.faceType === 2 ) {
			dogCounter++;
		}
		if( this.earType === 2 ) {
			dogCounter++;
		}
		if( this.tailType === 2 ) {
			dogCounter++;
		}
		if( this.lowerBody === 2 ) {
			dogCounter++;
		}
		if( this.dogCocks() > 0 ) {
			dogCounter++;
		}
		if( this.breastRows.length > 1 ) {
			dogCounter++;
		}
		if( this.breastRows.length === 3 ) {
			dogCounter++;
		}
		if( this.breastRows.length > 3 ) {
			dogCounter--;
		}
		//Fur only counts if some canine features are present
		if( this.skinType === 1 && dogCounter > 0 ) {
			dogCounter++;
		}
		return dogCounter;
	};
	Player.prototype.mouseScore = function() {
		var coonCounter = 0;
		if( this.earType === 12 ) {
			coonCounter++;
		}
		if( this.tailType === 16 ) {
			coonCounter++;
		}
		if( this.faceType === 15 ) {
			coonCounter++;
		}
		if( this.faceType === 16 ) {
			coonCounter += 2;
		}
		//Fur only counts if some canine features are present
		if( this.skinType === 1 && coonCounter > 0 ) {
			coonCounter++;
		}
		if( this.tallness < 55 && coonCounter > 0 ) {
			coonCounter++;
		}
		if( this.tallness < 45 && coonCounter > 0 ) {
			coonCounter++;
		}
		return coonCounter;
	};
	Player.prototype.raccoonScore = function() {
		var coonCounter = 0;
		if( this.faceType === 13 ) {
			coonCounter++;
		}
		if( this.faceType === 14 ) {
			coonCounter += 2;
		}
		if( this.earType === 11 ) {
			coonCounter++;
		}
		if( this.tailType === 15 ) {
			coonCounter++;
		}
		if( this.lowerBody === 19 ) {
			coonCounter++;
		}
		if( coonCounter > 0 && this.balls > 0 ) {
			coonCounter++;
		}
		//Fur only counts if some canine features are present
		if( this.skinType === 1 && coonCounter > 0 ) {
			coonCounter++;
		}
		return coonCounter;
	};
	//Determine Fox Rating
	Player.prototype.foxScore = function() {
		var foxCounter = 0;
		if( this.faceType === 11 ) {
			foxCounter++;
		}
		if( this.earType === 9 ) {
			foxCounter++;
		}
		if( this.tailType === 13 ) {
			foxCounter++;
		}
		if( this.lowerBody === 17 ) {
			foxCounter++;
		}
		if( this.dogCocks() > 0 && foxCounter > 0 ) {
			foxCounter++;
		}
		if( this.breastRows.length > 1 && foxCounter > 0 ) {
			foxCounter++;
		}
		if( this.breastRows.length === 3 && foxCounter > 0 ) {
			foxCounter++;
		}
		if( this.breastRows.length === 4 && foxCounter > 0 ) {
			foxCounter++;
		}
		//Fur only counts if some canine features are present
		if( this.skinType === 1 && foxCounter > 0 ) {
			foxCounter++;
		}
		return foxCounter;
	};
	//Determine cat Rating
	Player.prototype.catScore = function() {
		var catCounter = 0;
		if( this.faceType === 6 ) {
			catCounter++;
		}
		if( this.earType === 5 ) {
			catCounter++;
		}
		if( this.tailType === 8 ) {
			catCounter++;
		}
		if( this.lowerBody === 9 ) {
			catCounter++;
		}
		if( this.catCocks() > 0 ) {
			catCounter++;
		}
		if( this.breastRows.length > 1 && catCounter > 0 ) {
			catCounter++;
		}
		if( this.breastRows.length === 3 && catCounter > 0 ) {
			catCounter++;
		}
		if( this.breastRows.length > 3 ) {
			catCounter -= 2;
		}
		//Fur only counts if some canine features are present
		if( this.skinType === 1 && catCounter > 0 ) {
			catCounter++;
		}
		return catCounter;
	};
	//Determine lizard rating
	Player.prototype.lizardScore = function() {
		var lizardCounter = 0;
		if( this.faceType === 7 ) {
			lizardCounter++;
		}
		if( this.earType === 6 ) {
			lizardCounter++;
		}
		if( this.tailType === 9 ) {
			lizardCounter++;
		}
		if( this.lowerBody === 10 ) {
			lizardCounter++;
		}
		if( this.lizardCocks() > 0 ) {
			lizardCounter++;
		}
		if( this.horns > 0 && (this.hornType === 3 || this.hornType === 4) ) {
			lizardCounter++;
		}
		if( this.skinType === 2 ) {
			lizardCounter++;
		}
		return lizardCounter;
	};
	Player.prototype.spiderScore = function() {
		var score = 0;
		if( this.eyeType === 1 ) {
			score += 2;
		}
		if( this.faceType === 10 ) {
			score++;
		}
		if( this.armType === 2 ) {
			score++;
		}
		if( this.lowerBody === 15 || this.lowerBody === 16 ) {
			score += 2;
		} else if( score > 0 ) {
			score--;
		}
		if( this.tailType === 5 ) {
			score += 2;
		}
		if( this.skinType > 0 && score > 0 ) {
			score--;
		}
		return score;
	};
	//Determine Horse Rating
	Player.prototype.horseScore = function() {
		var horseCounter = 0;
		if( this.faceType === 1 ) {
			horseCounter++;
		}
		if( this.earType === 1 ) {
			horseCounter++;
		}
		if( this.tailType === 1 ) {
			horseCounter++;
		}
		if( this.horseCocks() > 0 ) {
			horseCounter++;
		}
		if( this.lowerBody === 1 || this.lowerBody === 4 ) {
			horseCounter++;
		}
		//Fur only counts if some equine features are present
		if( this.skinType === 1 && horseCounter > 0 ) {
			horseCounter++;
		}
		return horseCounter;
	};
	//Determine kitsune Rating
	Player.prototype.kitsuneScore = function() {
		var kitsuneCounter = 0;
		//If the character has fox ears, +1
		if( this.earType === 9 ) {
			kitsuneCounter++;
		}
		//If the character has a fox tail, +1
		if( this.tailType === 13 ) {
			kitsuneCounter++;
		}
		//If the character has two or more fox tails, +2
		if( this.tailType === 13 && this.tailVenom >= 2 ) {
			kitsuneCounter += 2;
		}
		//If the character has tattooed skin, +1
		//9999
		//If the character has a 'vag of holding', +1
		if( this.vaginalCapacity() >= 8000 ) {
			kitsuneCounter++;
		}
		//If the character's kitsune score is greater than 0 and the character has a normal face, +1
		if( kitsuneCounter > 0 && this.faceType === 0 ) {
			kitsuneCounter++;
		}
		//If the character's kitsune score is greater than 1 and the character has 'blonde','black','red','white', or 'silver' hair, +1
		if( kitsuneCounter > 0 && (this.hairColor === 'golden blonde' || this.hairColor === 'black' || this.hairColor === 'red' || this.hairColor === 'white' || this.hairColor === 'silver blonde') ) {
			kitsuneCounter++;
		}
		//If the character's femininity is 40 or higher, +1
		if( kitsuneCounter > 0 && this.femininity >= 40 ) {
			kitsuneCounter++;
		}
		//If the character has fur, scales, or gooey skin, -1
		if( this.skinType > 1 ) {
			kitsuneCounter -= 2;
		}
		if( this.skinType === 1 ) {
			kitsuneCounter--;
		}
		//If the character has abnormal legs, -1
		if( this.lowerBody !== 0 ) {
			kitsuneCounter--;
		}
		//If the character has a nonhuman face, -1
		if( this.faceType !== 0 ) {
			kitsuneCounter--;
		}
		//If the character has ears other than fox ears, -1
		if( this.earType !== 9 ) {
			kitsuneCounter--;
		}
		//If the character has tail(s) other than fox tails, -1
		if( this.tailType !== 13 ) {
			kitsuneCounter--;
		}
		return kitsuneCounter;
	};
	//Determine Horse Rating
	Player.prototype.dragonScore = function() {
		var dragonCounter = 0;
		if( this.faceType === 12 ) {
			dragonCounter++;
		}
		if( this.earType === 10 ) {
			dragonCounter++;
		}
		if( this.tailType === 14 ) {
			dragonCounter++;
		}
		if( this.tongueType === 3 ) {
			dragonCounter++;
		}
		if( this.dragonCocks() > 0 ) {
			dragonCounter++;
		}
		if( this.wingType === 10 ) {
			dragonCounter++;
		}
		if( this.wingType === 11 ) {
			dragonCounter += 2;
		}
		if( this.lowerBody === 18 ) {
			dragonCounter++;
		}
		if( this.skinType === 2 && dragonCounter > 0 ) {
			dragonCounter++;
		}
		if( this.hornType === AppearanceDefs.HORNS_DRACONIC_X4_12_INCH_LONG || this.hornType === AppearanceDefs.HORNS_DRACONIC_X2 ) {
			dragonCounter++;
		}
		return dragonCounter;
	};
	//Goblinscore
	Player.prototype.goblinScore = function() {
		var horseCounter = 0;
		if( this.earType === 4 ) {
			horseCounter++;
		}
		if( this.skinTone === 'pale yellow' || this.skinTone === 'grayish-blue' || this.skinTone === 'green' || this.skinTone === 'dark green' ) {
			horseCounter++;
		}
		if( horseCounter > 0 ) {
			if( this.faceType === 0 ) {
				horseCounter++;
			}
			if( this.tallness < 48 ) {
				horseCounter++;
			}
			if( this.hasVagina() ) {
				horseCounter++;
			}
			if( this.lowerBody === 0 ) {
				horseCounter++;
			}
		}
		return horseCounter;
	};
	//Gooscore
	Player.prototype.gooScore = function() {
		var gooCounter = 0;
		if( this.hairType === 3 ) {
			gooCounter++;
		}
		if( this.skinAdj === 'slimy' ) {
			gooCounter++;
		}
		if( this.lowerBody === 8 ) {
			gooCounter++;
		}
		if( this.vaginalCapacity() > 9000 ) {
			gooCounter++;
		}
		if( this.findStatusAffect( StatusAffects.SlimeCraving ) >= 0 ) {
			gooCounter++;
		}
		return gooCounter;
	};
	//Nagascore
	Player.prototype.nagaScore = function() {
		var nagaCounter = 0;
		if( this.faceType === 5 ) {
			nagaCounter++;
		}
		if( this.tongueType === 1 ) {
			nagaCounter++;
		}
		if( nagaCounter > 0 && this.antennae === 0 ) {
			nagaCounter++;
		}
		if( nagaCounter > 0 && this.wingType === 0 ) {
			nagaCounter++;
		}
		return nagaCounter;
	};
	//Bunnyscore
	Player.prototype.bunnyScore = function() {
		var bunnyCounter = 0;
		if( this.faceType === 8 ) {
			bunnyCounter++;
		}
		if( this.tailType === 10 ) {
			bunnyCounter++;
		}
		if( this.earType === 7 ) {
			bunnyCounter++;
		}
		if( this.lowerBody === 12 ) {
			bunnyCounter++;
		}
		//More than 2 this.balls reduces bunny score
		if( this.balls > 2 && bunnyCounter > 0 ) {
			bunnyCounter--;
		}
		//Human skin on bunmorph adds
		if( this.skinType === 0 && bunnyCounter > 1 ) {
			bunnyCounter++;
		}
		//No wings and this.antennae a plus
		if( bunnyCounter > 0 && this.antennae === 0 ) {
			bunnyCounter++;
		}
		if( bunnyCounter > 0 && this.wingType === 0 ) {
			bunnyCounter++;
		}
		return bunnyCounter;
	};
	//Harpyscore
	Player.prototype.harpyScore = function() {
		var harpy = 0;
		if( this.armType === 1 ) {
			harpy++;
		}
		if( this.hairType === 1 ) {
			harpy++;
		}
		if( this.wingType === 9 ) {
			harpy++;
		}
		if( this.tailType === 11 ) {
			harpy++;
		}
		if( this.lowerBody === 13 ) {
			harpy++;
		}
		if( harpy >= 2 && this.faceType === 0 ) {
			harpy++;
		}
		if( harpy >= 2 && (this.earType === 0 || this.earType === 4) ) {
			harpy++;
		}
		return harpy;
	};
	//Kangascore
	Player.prototype.kangaScore = function() {
		var kanga = 0;
		if( this.kangaCocks() > 0 ) {
			kanga++;
		}
		if( this.earType === 8 ) {
			kanga++;
		}
		if( this.tailType === 12 ) {
			kanga++;
		}
		if( this.lowerBody === 14 ) {
			kanga++;
		}
		if( this.faceType === 9 ) {
			kanga++;
		}
		if( kanga >= 2 && this.skinType === 1 ) {
			kanga++;
		}
		return kanga;
	};
	//sharkscore
	Player.prototype.sharkScore = function() {
		var sharkCounter = 0;
		if( this.faceType === 4 ) {
			sharkCounter++;
		}
		if( this.wingType === 8 ) {
			sharkCounter++;
		}
		if( this.tailType === 7 ) {
			sharkCounter++;
		}
		return sharkCounter;
	};
	//Determine Mutant Rating
	Player.prototype.mutantScore = function() {
		var mutantCounter = 0;
		if( this.faceType > 0 ) {
			mutantCounter++;
		}
		if( this.skinType > 0 ) {
			mutantCounter++;
		}
		if( this.tailType > 0 ) {
			mutantCounter++;
		}
		if( this.cockTotal() > 1 ) {
			mutantCounter++;
		}
		if( this.hasCock() && this.hasVagina() ) {
			mutantCounter++;
		}
		if( this.hasFuckableNipples() ) {
			mutantCounter++;
		}
		if( this.breastRows.length > 1 ) {
			mutantCounter++;
		}
		if( this.faceType === 1 ) {
			if( this.skinType === 1 ) {
				mutantCounter--;
			}
			if( this.tailType === 1 ) {
				mutantCounter--;
			}
		}
		if( this.faceType === 2 ) {
			if( this.skinType === 1 ) {
				mutantCounter--;
			}
			if( this.tailType === 2 ) {
				mutantCounter--;
			}
		}
		return mutantCounter--;
	};
	Player.prototype.lactationQ = function() {
		if( this.biggestLactation() < 1 ) {
			return 0;
		}
		//(Milk production TOTAL= breastSize x 10 * lactationMultiplier * breast total * milking-endurance (1- default, maxes at 2.  Builds over time as milking as done)
		//(Small – 0.01 mLs – Size 1 + 1 Multi)
		//(Large – 0.8 - Size 10 + 4 Multi)
		//(HUGE – 2.4 - Size 12 + 5 Multi + 4 tits)
		var total;
		if( this.findStatusAffect( StatusAffects.LactationEndurance ) < 0 ) {
			this.createStatusAffect( StatusAffects.LactationEndurance, 1, 0, 0, 0 );
		}
		total = this.biggestTitSize() * 10 * this.averageLactation() * this.statusAffectv1( StatusAffects.LactationEndurance ) * this.totalBreasts();
		if( this.statusAffectv1( StatusAffects.LactationReduction ) >= 48 ) {
			total = total * 1.5;
		}
		return total;
	};
	Player.prototype.isLactating = function() {
		if( this.lactationQ() > 0 ) {
			return true;
		}
		return false;
	};
	Player.prototype.cuntChange = function( cArea, display, spacingsF, spacingsB ) {
		if( spacingsB === undefined ) {
			spacingsB = true;
		}
		if( this.vaginas.length === 0 ) {
			return false;
		}
		var wasVirgin = this.vaginas[ 0 ].virgin;
		var stretched = this.cuntChangeNoDisplay( cArea );
		var devirgined = wasVirgin && !this.vaginas[ 0 ].virgin;
		if( devirgined ) {
			if( spacingsF ) {
				EngineCore.outputText( '  ' );
			}
			EngineCore.outputText( '<b>Your hymen is torn, robbing you of your virginity.</b>', false );
			if( spacingsB ) {
				EngineCore.outputText( '  ' );
			}
		}
		//STRETCH SUCCESSFUL - begin flavor text if outputting it!
		if( display && stretched ) {
			//Virgins get different formatting
			if( devirgined ) {
				//If no spaces after virgin loss
				if( !spacingsB ) {
					EngineCore.outputText( '  ' );
				}
			}
			//Non virgins as usual
			else if( spacingsF ) {
				EngineCore.outputText( '  ' );
			}
			if( this.vaginas[ 0 ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_LEVEL_CLOWN_CAR ) {
				EngineCore.outputText( '<b>Your ' + Appearance.vaginaDescript( this, 0 ) + ' is stretched painfully wide, large enough to accomodate most beasts and demons.</b>' );
			}
			if( this.vaginas[ 0 ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_GAPING_WIDE ) {
				EngineCore.outputText( '<b>Your ' + Appearance.vaginaDescript( this, 0 ) + ' is stretched so wide that it gapes continually.</b>' );
			}
			if( this.vaginas[ 0 ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_GAPING ) {
				EngineCore.outputText( '<b>Your ' + Appearance.vaginaDescript( this, 0 ) + ' painfully stretches, the lips now wide enough to gape slightly.</b>' );
			}
			if( this.vaginas[ 0 ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_LOOSE ) {
				EngineCore.outputText( '<b>Your ' + Appearance.vaginaDescript( this, 0 ) + ' is now very loose.</b>', false );
			}
			if( this.vaginas[ 0 ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_NORMAL ) {
				EngineCore.outputText( '<b>Your ' + Appearance.vaginaDescript( this, 0 ) + ' is now a little loose.</b>', false );
			}
			if( this.vaginas[ 0 ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_TIGHT ) {
				EngineCore.outputText( '<b>Your ' + Appearance.vaginaDescript( this, 0 ) + ' is stretched out to a more normal size.</b>' );
			}
			if( spacingsB ) {
				EngineCore.outputText( '  ' );
			}
		}
		return stretched;
	};
	Player.prototype.buttChange = function( cArea, display, spacingsF, spacingsB ) {
		if( spacingsF === undefined ) {
			spacingsF = true;
		}
		if( spacingsB === undefined ) {
			spacingsB = true;
		}
		var stretched = this.buttChangeNoDisplay( cArea );
		//STRETCH SUCCESSFUL - begin flavor text if outputting it!
		if( stretched && display ) {
			if( spacingsF ) {
				EngineCore.outputText( '  ' );
			}
			this.buttChangeDisplay();
			if( spacingsB ) {
				EngineCore.outputText( '  ' );
			}
		}
		return stretched;
	};
	Player.prototype.buttChangeDisplay = function() {	//Allows the test for stretching and the text output to be separated
		if( this.ass.analLooseness === 5 ) {
			EngineCore.outputText( '<b>Your ' + Appearance.assholeDescript( this ) + ' is stretched even wider, capable of taking even the largest of demons and beasts.</b>' );
		}
		if( this.ass.analLooseness === 4 ) {
			EngineCore.outputText( '<b>Your ' + Appearance.assholeDescript( this ) + ' becomes so stretched that it gapes continually.</b>', false );
		}
		if( this.ass.analLooseness === 3 ) {
			EngineCore.outputText( '<b>Your ' + Appearance.assholeDescript( this ) + ' is now very loose.</b>' );
		}
		if( this.ass.analLooseness === 2 ) {
			EngineCore.outputText( '<b>Your ' + Appearance.assholeDescript( this ) + ' is now a little loose.</b>' );
		}
		if( this.ass.analLooseness === 1 ) {
			EngineCore.outputText( '<b>You have lost your anal virginity.</b>', false );
		}
	};
	Player.prototype.slimeFeed = function() {
		if( this.findStatusAffect( StatusAffects.SlimeCraving ) >= 0 ) {
			//Reset craving value
			this.changeStatusValue( StatusAffects.SlimeCraving, 1, 0 );
			//Flag to display feed update and restore stats in event parser
			if( this.findStatusAffect( StatusAffects.SlimeCravingFeed ) < 0 ) {
				this.createStatusAffect( StatusAffects.SlimeCravingFeed, 0, 0, 0, 0 );
			}
		}
		if( this.findPerk( PerkLib.Diapause ) >= 0 ) {
			CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00228 ] += 3 + Utils.rand( 3 );
			CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00229 ] = 1;
		}
	};
	Player.prototype.minoCumAddiction = function( raw ) {
		if( raw === undefined ) {
			raw = 10;
		}
		//Increment minotaur cum intake count
		CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00340 ]++;
		//Fix if variables go out of range.
		if( CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] < 0 ) {
			CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] = 0;
		}
		if( CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_STATE ] < 0 ) {
			CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_STATE ] = 0;
		}
		if( CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] > 120 ) {
			CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] = 120;
		}
		//Turn off withdrawal
		//if(CoC.getInstance().flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] > 1) CoC.getInstance().flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] = 1;
		//Reset counter
		CoC.getInstance().flags[ kFLAGS.TIME_SINCE_LAST_CONSUMED_MINOTAUR_CUM ] = 0;
		//If highly addicted, rises slower
		if( CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] >= 60 ) {
			raw /= 2;
		}
		if( CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] >= 80 ) {
			raw /= 2;
		}
		if( CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] >= 90 ) {
			raw /= 2;
		}
		//If in withdrawl, readdiction is potent!
		if( CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_STATE ] === 3 ) {
			raw += 10;
		}
		if( CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_STATE ] === 2 ) {
			raw += 5;
		}
		raw = Math.round( raw * 100 ) / 100;
		//PUT SOME CAPS ON DAT' SHIT
		if( raw > 50 ) {
			raw = 50;
		}
		if( raw < -50 ) {
			raw = -50;
		}
		CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] += raw;
		//Recheck to make sure shit didn't break
		if( CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] > 120 ) {
			CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] = 120;
		}
		if( CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] < 0 ) {
			CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] = 0;
		}
	};
	Player.prototype.hasSpells = function() {
		return this.spellCount() > 0;
	};
	Player.prototype.spellCount = function() {
		return _.filter( [ StatusAffects.KnowsArouse, StatusAffects.KnowsHeal, StatusAffects.KnowsMight, StatusAffects.KnowsCharge, StatusAffects.KnowsBlind, StatusAffects.KnowsWhitefire ], function( item ) {
			return this.findStatusAffect( item ) >= 0;
		} ).length;
	};
	Player.prototype.hairDescript = function() {
		return Appearance.hairDescription( this );
	};
	Player.prototype.shrinkTits = function( ignore_hyper_happy ) {
		if( CoC.getInstance().flags[ kFLAGS.HYPER_HAPPY ] && !ignore_hyper_happy ) {
			return;
		}
		if( this.breastRows.length === 1 ) {
			if( this.breastRows[ 0 ].breastRating > 0 ) {
				//Shrink if bigger than N/A cups
				this.breastRows[ 0 ].breastRating--;
				if( this.breastRows[ 0 ].breastRating < 0 ) {
					this.breastRows[ 0 ].breastRating = 0;
				}
				//Shrink again 50% chance
				if( this.breastRows[ 0 ].breastRating >= 1 && Utils.rand( 2 ) === 0 && this.findPerk( PerkLib.BigTits ) < 0 ) {
					this.breastRows[ 0 ].breastRating--;
					EngineCore.outputText( '\n\nYou feel significantly lighter.  Looking down, you realize your breasts are much smaller!  With a quick measure, you determine they\'re now ' + this.breastCup( 0 ) + 's.', false );
				} else {
					EngineCore.outputText( '\n\nYou feel a weight lifted from you, and realize your breasts have shrunk!  With a quick measure, you determine they\'re now ' + this.breastCup( 0 ) + 's.', false );
				}
			}
		} else if( this.breastRows.length > 1 ) {
			//multiple
			EngineCore.outputText( '\n', false );
			var modifiedRowCount = 0;
			_.forEach(this.breastRows, function(breastRow, index) {
				if( breastRow.breastRating > 0 ) {
					breastRow.breastRating--;
					modifiedRowCount++;
					EngineCore.outputText( '\n', false );
					if( index < this.breastRows.length - 1 ) {
						EngineCore.outputText( '...and y', false );
					} else {
						EngineCore.outputText( 'Y', false );
					}
					EngineCore.outputText( 'our ' + Descriptors.breastDescript( index ) + ' shrink, dropping to ' + this.breastCup( index ) + 's.', false );
				}
				if( breastRow.breastRating < 0 ) {
					breastRow.breastRating = 0;
				}
			});
			if( modifiedRowCount === 2 ) {
				EngineCore.outputText( '\nYou feel so much lighter after the change.', false );
			} else if( modifiedRowCount === 3 ) {
				EngineCore.outputText( '\nWithout the extra weight you feel particularly limber.', false );
			} else if( modifiedRowCount >= 4 ) {
				EngineCore.outputText( '\nIt feels as if the weight of the world has been lifted from your shoulders, or in this case, your chest.', false );
			}
		}
	};
	Player.prototype.growTits = function( amount, rowsGrown, display, growthType ) {
		if( this.breastRows.length === 0 ) {
			return;
		}
		//GrowthType 1 = smallest grows
		//GrowthType 2 = Top Row working downward
		//GrowthType 3 = Only top row
		//Chance for 'big tits' perked characters to grow larger!
		if( this.findPerk( PerkLib.BigTits ) >= 0 && Utils.rand( 3 ) === 0 && amount < 1 ) {
			amount = 1;
		}
		if( growthType === 1 ) {
			//Select smallest breast, grow it, move on
			while( rowsGrown > 0 ) {
				//Find smallest row
				var smallestBreastRow = _.minBy(this.breastRows, function(breastRow) { return breastRow.breastRating; });
				$log.debug( 'Breastrow chosen for growth: ', smallestBreastRow );
				var breastRatingChanges = amount;
				if( !CoC.getInstance().flags[ kFLAGS.HYPER_HAPPY ] ) {
					//Diminishing returns!
					if( smallestBreastRow.breastRating > 3 ) {
						if( this.findPerk( PerkLib.BigTits ) < 0 ) {
							breastRatingChanges /= 1.5;
						} else {
							breastRatingChanges /= 1.3;
						}
					}
					// WHy are there three options here. They all have the same result.
					if( smallestBreastRow.breastRating > 7 ) {
						if( this.findPerk( PerkLib.BigTits ) < 0 ) {
							breastRatingChanges /= 2;
						} else {
							breastRatingChanges /= 1.5;
						}
					}
					if( smallestBreastRow.breastRating > 9 ) {
						if( this.findPerk( PerkLib.BigTits ) < 0 ) {
							breastRatingChanges /= 2;
						} else {
							breastRatingChanges /= 1.5;
						}
					}
					if( smallestBreastRow.breastRating > 12 ) {
						if( this.findPerk( PerkLib.BigTits ) < 0 ) {
							breastRatingChanges /= 2;
						} else {
							breastRatingChanges /= 1.5;
						}
					}
				}
				//Grow!
				$log.debug( 'Growing breasts by ', breastRatingChanges );
				smallestBreastRow.breastRating += breastRatingChanges;
				rowsGrown--;
			}
		}
		if( !CoC.getInstance().flags[ kFLAGS.HYPER_HAPPY ] ) {
			//Diminishing returns!
			if( this.breastRows[ 0 ].breastRating > 3 ) {
				if( this.findPerk( PerkLib.BigTits ) < 0 ) {
					amount /= 1.5;
				} else {
					amount /= 1.3;
				}
			}
			if( this.breastRows[ 0 ].breastRating > 7 ) {
				if( this.findPerk( PerkLib.BigTits ) < 0 ) {
					amount /= 2;
				} else {
					amount /= 1.5;
				}
			}
			if( this.breastRows[ 0 ].breastRating > 12 ) {
				if( this.findPerk( PerkLib.BigTits ) < 0 ) {
					amount /= 2;
				} else {
					amount /= 1.5;
				}
			}
		}
		if( growthType === 2 ) {
			//Start at top and keep growing down, back to top if hit bottom before done.
			while( rowsGrown > 0 ) {
				this.breastRows[ rowsGrown % this.breastRows.length ].breastRating += amount;
				$log.debug( 'Breasts increased by ' + amount + ' on row ' + (rowsGrown % this.breastRows.length) );
				rowsGrown--;
			}
		}
		if( growthType === 3 ) {
			while( rowsGrown > 0 ) {
				rowsGrown--;
				this.breastRows[ 0 ].breastRating += amount;
			}
		}
		//Breast Growth Finished...talk about changes.
		$log.debug( 'Growth ammout = ', amount );
		if( display ) {
			if( growthType < 3 ) {
				if( amount <= 2 ) {
					if( this.breastRows.length > 1 ) {
						EngineCore.outputText( 'Your rows of ' + Descriptors.breastDescript( 0 ) + ' jiggle with added weight, growing a bit larger.', false );
					}
					if( this.breastRows.length === 1 ) {
						EngineCore.outputText( 'Your ' + Descriptors.breastDescript( 0 ) + ' jiggle with added weight as they expand, growing a bit larger.', false );
					}
				} else if( amount <= 4 ) {
					if( this.breastRows.length > 1 ) {
						EngineCore.outputText( 'You stagger as your chest gets much heavier.  Looking down, you watch with curiosity as your rows of ' + Descriptors.breastDescript( 0 ) + ' expand significantly.', false );
					}
					if( this.breastRows.length === 1 ) {
						EngineCore.outputText( 'You stagger as your chest gets much heavier.  Looking down, you watch with curiosity as your ' + Descriptors.breastDescript( 0 ) + ' expand significantly.', false );
					}
				} else {
					if( this.breastRows.length > 1 ) {
						EngineCore.outputText( 'You drop to your knees from a massive change in your body\'s center of gravity.  Your ' + Descriptors.breastDescript( 0 ) + ' tingle strongly, growing disturbingly large.', false );
					}
					if( this.breastRows.length === 1 ) {
						EngineCore.outputText( 'You drop to your knees from a massive change in your center of gravity.  The tingling in your ' + Descriptors.breastDescript( 0 ) + ' intensifies as they continue to grow at an obscene rate.', false );
					}
				}
				if( this.biggestTitSize() >= 8.5 && this.nippleLength < 2 ) {
					EngineCore.outputText( '  A tender ache starts at your ' + Descriptors.nippleDescript( 0 ) + 's as they grow to match your burgeoning breast-flesh.', false );
					this.nippleLength = 2;
				}
				if( this.biggestTitSize() >= 7 && this.nippleLength < 1 ) {
					EngineCore.outputText( '  A tender ache starts at your ' + Descriptors.nippleDescript( 0 ) + 's as they grow to match your burgeoning breast-flesh.', false );
					this.nippleLength = 1;
				}
				if( this.biggestTitSize() >= 5 && this.nippleLength < 0.75 ) {
					EngineCore.outputText( '  A tender ache starts at your ' + Descriptors.nippleDescript( 0 ) + 's as they grow to match your burgeoning breast-flesh.', false );
					this.nippleLength = 0.75;
				}
				if( this.biggestTitSize() >= 3 && this.nippleLength < 0.5 ) {
					EngineCore.outputText( '  A tender ache starts at your ' + Descriptors.nippleDescript( 0 ) + 's as they grow to match your burgeoning breast-flesh.', false );
					this.nippleLength = 0.5;
				}
			} else {
				if( amount <= 2 ) {
					if( this.breastRows.length > 1 ) {
						EngineCore.outputText( 'Your top row of ' + Descriptors.breastDescript( 0 ) + ' jiggles with added weight as it expands, growing a bit larger.', false );
					}
					if( this.breastRows.length === 1 ) {
						EngineCore.outputText( 'Your row of ' + Descriptors.breastDescript( 0 ) + ' jiggles with added weight as it expands, growing a bit larger.', false );
					}
				}
				if( amount > 2 && amount <= 4 ) {
					if( this.breastRows.length > 1 ) {
						EngineCore.outputText( 'You stagger as your chest gets much heavier.  Looking down, you watch with curiosity as your top row of ' + Descriptors.breastDescript( 0 ) + ' expand significantly.', false );
					}
					if( this.breastRows.length === 1 ) {
						EngineCore.outputText( 'You stagger as your chest gets much heavier.  Looking down, you watch with curiosity as your ' + Descriptors.breastDescript( 0 ) + ' expand significantly.', false );
					}
				}
				if( amount > 4 ) {
					if( this.breastRows.length > 1 ) {
						EngineCore.outputText( 'You drop to your knees from a massive change in your body\'s center of gravity.  Your top row of ' + Descriptors.breastDescript( 0 ) + ' tingle strongly, growing disturbingly large.', false );
					}
					if( this.breastRows.length === 1 ) {
						EngineCore.outputText( 'You drop to your knees from a massive change in your center of gravity.  The tinglng in your ' + Descriptors.breastDescript( 0 ) + ' intensifies as they continue to grow at an obscene rate.', false );
					}
				}
				if( this.biggestTitSize() >= 8.5 && this.nippleLength < 2 ) {
					EngineCore.outputText( '  A tender ache starts at your ' + Descriptors.nippleDescript( 0 ) + 's as they grow to match your burgeoning breast-flesh.', false );
					this.nippleLength = 2;
				}
				if( this.biggestTitSize() >= 7 && this.nippleLength < 1 ) {
					EngineCore.outputText( '  A tender ache starts at your ' + Descriptors.nippleDescript( 0 ) + 's as they grow to match your burgeoning breast-flesh.', false );
					this.nippleLength = 1;
				}
				if( this.biggestTitSize() >= 5 && this.nippleLength < 0.75 ) {
					EngineCore.outputText( '  A tender ache starts at your ' + Descriptors.nippleDescript( 0 ) + 's as they grow to match your burgeoning breast-flesh.', false );
					this.nippleLength = 0.75;
				}
				if( this.biggestTitSize() >= 3 && this.nippleLength < 0.5 ) {
					EngineCore.outputText( '  A tender ache starts at your ' + Descriptors.nippleDescript( 0 ) + 's as they grow to match your burgeoning breast-flesh.', false );
					this.nippleLength = 0.5;
				}
			}
		}
	};
	//Determine minimum lust
	Player.prototype.minLust = function() {
		var min = 0;
		//Bimbo body boosts minimum lust by 40
		if( this.findStatusAffect( StatusAffects.BimboChampagne ) >= 0 || this.findPerk( PerkLib.BimboBody ) >= 0 || this.findPerk( PerkLib.BroBody ) >= 0 || this.findPerk( PerkLib.FutaForm ) >= 0 ) {
			if( min > 40 ) {
				min += 10;
			} else if( min >= 20 ) {
				min += 20;
			} else {
				min += 40;
			}
		}
		//Omnibus' Gift
		if( this.findPerk( PerkLib.OmnibusGift ) >= 0 ) {
			if( min > 40 ) {
				min += 10;
			} else if( min >= 20 ) {
				min += 20;
			} else {
				min += 35;
			}
		}
		//Nymph perk raises to 30
		if( this.findPerk( PerkLib.Nymphomania ) >= 0 ) {
			if( min >= 40 ) {
				min += 10;
			} else if( min >= 20 ) {
				min += 15;
			} else {
				min += 30;
			}
		}
		//Oh noes anemone!
		if( this.findStatusAffect( StatusAffects.AnemoneArousal ) >= 0 ) {
			if( min >= 40 ) {
				min += 10;
			} else if( min >= 20 ) {
				min += 20;
			} else {
				min += 30;
			}
		}
		//Hot blooded perk raises min lust!
		if( this.findPerk( PerkLib.HotBlooded ) >= 0 ) {
			if( min > 0 ) {
				min += this.perk( this.findPerk( PerkLib.HotBlooded ) ).value1 / 2;
			} else {
				min += this.perk( this.findPerk( PerkLib.HotBlooded ) ).value1;
			}
		}
		if( this.findPerk( PerkLib.LuststickAdapted ) > 0 ) {
			if( min < 50 ) {
				min += 10;
			} else {
				min += 5;
			}
		}
		//Add points for Crimstone
		min += this.perkv1( PerkLib.PiercedCrimstone );
		min += this.perkv1( PerkLib.PentUp );
		//Harpy Lipstick status forces minimum lust to be at least 50.
		if( min < 50 && this.findStatusAffect( StatusAffects.Luststick ) >= 0 ) {
			min = 50;
		}
		//SHOULDRA BOOSTS
		//+20
		if( CoC.getInstance().flags[ kFLAGS.SHOULDRA_SLEEP_TIMER ] <= -168 ) {
			min += 20;
			if( CoC.getInstance().flags[ kFLAGS.SHOULDRA_SLEEP_TIMER ] <= -216 ) {
				min += 30;
			}
		}
		//SPOIDAH BOOSTS
		if( this.eggs() >= 20 ) {
			min += 10;
			if( this.eggs() >= 40 ) {
				min += 10;
			}
		}
		if( min < 30 && this.armorName === 'lusty maiden\'s armor' ) {
			min = 30;
		}
		return min;
	};
	Player.prototype.minotaurAddicted = function() {
		return this.findPerk( PerkLib.MinotaurCumAddict ) >= 0 || CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_STATE ] >= 1;
	};
	Player.prototype.minotaurNeed = function() {
		return CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_STATE ] > 1;
	};
	Player.prototype.clearStatuses = function( ) {
		while( this.findStatusAffect( StatusAffects.Web ) >= 0 ) {
			this.spe += this.statusAffectv1( StatusAffects.Web );
			MainView.statsView.showStatUp( 'spe' );
			this.removeStatusAffect( StatusAffects.Web );
		}
		if( this.findStatusAffect( StatusAffects.Shielding ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.Shielding );
		}
		if( this.findStatusAffect( StatusAffects.HolliConstrict ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.HolliConstrict );
		}
		if( this.findStatusAffect( StatusAffects.LustStones ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.LustStones );
		}
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.Sandstorm ) >= 0 ) {
			CoC.getInstance().monster.this.removeStatusAffect( StatusAffects.Sandstorm );
		}
		if( this.findStatusAffect( StatusAffects.Sealed ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.Sealed );
		}
		if( this.findStatusAffect( StatusAffects.Berzerking ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.Berzerking );
		}
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.TailWhip ) >= 0 ) {
			CoC.getInstance().monster.this.removeStatusAffect( StatusAffects.TailWhip );
		}
		if( this.findStatusAffect( StatusAffects.UBERWEB ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.UBERWEB );
		}
		if( this.findStatusAffect( StatusAffects.DriderKiss ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.DriderKiss );
		}
		if( this.findStatusAffect( StatusAffects.WebSilence ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.WebSilence );
		}
		if( this.findStatusAffect( StatusAffects.GooArmorSilence ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.GooArmorSilence );
		}
		if( this.findStatusAffect( StatusAffects.Bound ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.Bound );
		}
		if( this.findStatusAffect( StatusAffects.GooArmorBind ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.GooArmorBind );
		}
		if( this.findStatusAffect( StatusAffects.Whispered ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.Whispered );
		}
		if( this.findStatusAffect( StatusAffects.AkbalSpeed ) >= 0 ) {
			EngineCore.dynStats( 'spe', this.statusAffectv1( StatusAffects.AkbalSpeed ) * -1 );
			this.removeStatusAffect( StatusAffects.AkbalSpeed );
		}
		if( this.findStatusAffect( StatusAffects.AmilyVenom ) >= 0 ) {
			EngineCore.dynStats( 'str', this.statusAffectv1( StatusAffects.AmilyVenom ), 'spe', this.statusAffectv2( StatusAffects.AmilyVenom ) );
			this.removeStatusAffect( StatusAffects.AmilyVenom );
		}
		while( this.findStatusAffect( StatusAffects.Blind ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.Blind );
		}
		if( this.findStatusAffect( StatusAffects.SheilaOil ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.SheilaOil );
		}
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.TwuWuv ) >= 0 ) {
			this.inte += CoC.getInstance().monster.statusAffectv1( StatusAffects.TwuWuv );
			EngineCore.statScreenRefresh();
			MainView.statsView.showStatUp( 'inte' );
		}
		if( this.findStatusAffect( StatusAffects.NagaVenom ) >= 0 ) {
			this.spe += this.statusAffectv1( StatusAffects.NagaVenom );
			MainView.statsView.showStatUp( 'spe' );
			this.removeStatusAffect( StatusAffects.NagaVenom );
		}
		if( this.findStatusAffect( StatusAffects.TentacleBind ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.TentacleBind );
		}
		if( this.findStatusAffect( StatusAffects.NagaBind ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.NagaBind );
		}
		if( this.findStatusAffect( StatusAffects.StoneLust ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.StoneLust );
		}
		this.removeStatusAffect( StatusAffects.FirstAttack );
		if( this.findStatusAffect( StatusAffects.TemporaryHeat ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.TemporaryHeat );
		}
		if( this.findStatusAffect( StatusAffects.NoFlee ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.NoFlee );
		}
		if( this.findStatusAffect( StatusAffects.Poison ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.Poison );
		}
		if( this.findStatusAffect( StatusAffects.IsabellaStunned ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.IsabellaStunned );
		}
		if( this.findStatusAffect( StatusAffects.Stunned ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.Stunned );
		}
		if( this.findStatusAffect( StatusAffects.Confusion ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.Confusion );
		}
		if( this.findStatusAffect( StatusAffects.ThroatPunch ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.ThroatPunch );
		}
		if( this.findStatusAffect( StatusAffects.KissOfDeath ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.KissOfDeath );
		}
		if( this.findStatusAffect( StatusAffects.AcidSlap ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.AcidSlap );
		}
		if( this.findStatusAffect( StatusAffects.GooBind ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.GooBind );
		}
		if( this.findStatusAffect( StatusAffects.HarpyBind ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.HarpyBind );
		}
		if( this.findStatusAffect( StatusAffects.CalledShot ) >= 0 ) {
			this.spe += this.statusAffectv1( StatusAffects.CalledShot );
			MainView.statsView.showStatUp( 'spe' );
			this.removeStatusAffect( StatusAffects.CalledShot );
		}
		if( this.findStatusAffect( StatusAffects.DemonSeed ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.DemonSeed );
		}
		if( this.findStatusAffect( StatusAffects.ParalyzeVenom ) >= 0 ) {
			this.str += this.statusAffect( this.findStatusAffect( StatusAffects.ParalyzeVenom ) ).value1;
			this.spe += this.statusAffect( this.findStatusAffect( StatusAffects.ParalyzeVenom ) ).value2;
			this.removeStatusAffect( StatusAffects.ParalyzeVenom );
		}
		if( this.findStatusAffect( StatusAffects.lustvenom ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.lustvenom );
		}
		if( this.findStatusAffect( StatusAffects.InfestAttempted ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.InfestAttempted );
		}
		if( this.findStatusAffect( StatusAffects.Might ) >= 0 ) {
			EngineCore.dynStats( 'str', -this.statusAffectv1( StatusAffects.Might ), 'tou', -this.statusAffectv2( StatusAffects.Might ) );
			this.removeStatusAffect( StatusAffects.Might );
		}
		if( this.findStatusAffect( StatusAffects.ChargeWeapon ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.ChargeWeapon );
		}
		if( this.findStatusAffect( StatusAffects.Disarmed ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.Disarmed );
			if( this.weapon === WeaponLib.FISTS ) {
				this.setWeapon( ItemType.lookupItem( CoC.getInstance().flags[ kFLAGS.PLAYER_DISARMED_WEAPON_ID ] ));
			} else {
				CoC.getInstance().flags[ kFLAGS.BONUS_ITEM_AFTER_COMBAT_ID ] = CoC.getInstance().flags[ kFLAGS.PLAYER_DISARMED_WEAPON_ID ];
			}
		}
		if( this.findStatusAffect( StatusAffects.AnemoneVenom ) >= 0 ) {
			this.str += this.statusAffectv1( StatusAffects.AnemoneVenom );
			this.spe += this.statusAffectv2( StatusAffects.AnemoneVenom );
			//Make sure nothing got out of bounds
			EngineCore.dynStats( 'cor', 0 );
			MainView.statsView.showStatUp( 'spe' );
			MainView.statsView.showStatUp( 'str' );
			this.removeStatusAffect( StatusAffects.AnemoneVenom );
		}
		if( this.findStatusAffect( StatusAffects.GnollSpear ) >= 0 ) {
			this.spe += this.statusAffectv1( StatusAffects.GnollSpear );
			//Make sure nothing got out of bounds
			EngineCore.dynStats( 'cor', 0 );
			MainView.statsView.showStatUp( 'spe' );
			this.removeStatusAffect( StatusAffects.GnollSpear );
		}
		if( this.findStatusAffect( StatusAffects.BasiliskCompulsion ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.BasiliskCompulsion );
		}
		if( this.findStatusAffect( StatusAffects.BasiliskSlow ) >= 0 ) {
			this.spe += this.statusAffectv1( StatusAffects.BasiliskSlow );
			MainView.statsView.showStatUp( 'spe' );
			this.removeStatusAffect( StatusAffects.BasiliskSlow );
		}
		while( this.findStatusAffect( StatusAffects.IzmaBleed ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.IzmaBleed );
		}
		if( this.findStatusAffect( StatusAffects.GardenerSapSpeed ) >= 0 ) {
			this.spe += this.statusAffectv1( StatusAffects.GardenerSapSpeed );
			MainView.statsView.showStatUp( 'spe' );
			this.removeStatusAffect( StatusAffects.GardenerSapSpeed );
		}
		if( this.findStatusAffect( StatusAffects.KnockedBack ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.KnockedBack );
		}
		if( this.findStatusAffect( StatusAffects.RemovedArmor ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.KnockedBack );
		}
		if( this.findStatusAffect( StatusAffects.JCLustLevel ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.JCLustLevel );
		}
		if( this.findStatusAffect( StatusAffects.MirroredAttack ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.MirroredAttack );
		}
		if( this.findStatusAffect( StatusAffects.Tentagrappled ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.Tentagrappled );
		}
		if( this.findStatusAffect( StatusAffects.TentagrappleCooldown ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.TentagrappleCooldown );
		}
		if( this.findStatusAffect( StatusAffects.ShowerDotEffect ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.ShowerDotEffect );
		}
		if( this.findStatusAffect( StatusAffects.GardenerSapSpeed ) >= 0 ) {
			this.spe += this.statusAffectv1( StatusAffects.GardenerSapSpeed );
			MainView.statsView.showStatUp( 'spe' );
			this.removeStatusAffect( StatusAffects.GardenerSapSpeed );
		}
		if( this.findStatusAffect( StatusAffects.VineHealUsed ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.VineHealUsed );
		}
	};
	Player.prototype.consumeItem = function( itype, amount ) {
		if( amount === undefined ) {
			amount = 1;
		}
		if( !this.hasItem( itype, amount ) ) {
			CoC_Settings.error( 'ERROR attempting to find ' + amount + ' item' + (amount > 1 ? 's' : '') + ' to remove when the CoC.getInstance().player has ' + this.itemCount( itype ) + '.' );
			return false;
		}
		//From here we can be sure the CoC.getInstance().player has enough of the item in inventory
		var slot;
		while( amount > 0 ) {
			slot = this.getLowestSlot( itype ); //Always draw from the least filled slots first
			if( slot.quantity > amount ) {
				slot.quantity -= amount;
				amount = 0;
			} else { //If the slot holds the amount needed then amount will be zero after this
				amount -= slot.quantity;
				slot.emptySlot();
			}
		}
		return true;
	};
	Player.prototype.getLowestSlot = function( itype ) {
		return _.minBy( _.filter( this.itemSlots, function( slot ) {
			return slot.itype === itype;
		} ), function( slot ) {
			return slot.quantity;
		} );
	};
	Player.prototype.hasItem = function( itype, minQuantity ) {
		return this.itemCount( itype ) >= (minQuantity === undefined ? 1 : minQuantity);
	};
	Player.prototype.itemCount = function( itype ) {
		return _.sumBy( _.filter( this.itemSlots, function( slot ) {
			return slot.itype === itype;
		} ), function( slot ) {
			return slot.quantity;
		} );
	};
	// 0..5 or -1 if no
	Player.prototype.roomInExistingStack = function( itype ) {
		return _.indexOf( this.itemSlots, _.find( this.itemSlots, function( slot ) {
			return slot.itype === itype && slot.quantity !== 0 && slot.quantity < 5;
		} ) );
	};
	Player.prototype.itemSlot = function( idx ) {
		return this.itemSlots[ idx ];
	};
	// 0..5 or -1 if no
	Player.prototype.emptySlot = function() {
		return _.indexOf( this.itemSlots, _.find( this.itemSlots, function( slot ) {
			return slot.isEmpty() && slot.unlocked;
		} ) );
	};
	Player.prototype.destroyItems = function( itype, numOfItemToRemove ) {
		_.forEach(_.filter(this.itemSlots, function(slot) { return slot.itype === itype; }), function(slot) {
			while( slot.quantity > 0 && numOfItemToRemove > 0 ) {
				slot.removeOneItem();
				numOfItemToRemove--;
			}
		});
		return numOfItemToRemove <= 0;
	};
	Player.prototype.lengthChange = function( changes, ncocks ) {
		if( changes < 0 && CoC.getInstance().flags[ kFLAGS.HYPER_HAPPY ] ) { // Early return for hyper-happy cheat if the call was *supposed* to shrink a cock.
			return;
		}
		//DIsplay the degree of length change.
		if( changes <= 1 && changes > 0 ) {
			if( this.cocks.length === 1 ) {
				EngineCore.outputText( 'Your ' + Descriptors.cockDescript( 0 ) + ' has grown slightly longer.', false );
			} else if( this.cocks.length > 1 ) {
				if( ncocks === 1 ) {
					EngineCore.outputText( 'One of your ' + Descriptors.multiCockDescriptLight() + ' grows slightly longer.', false );
				} else if( ncocks === this.cocks.length ) {
					EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' seem to fill up... growing a little bit larger.', false );
				} else if( ncocks > 1 && ncocks < this.cocks.length ) {
					EngineCore.outputText( 'Some of your ' + Descriptors.multiCockDescriptLight() + ' grow slightly longer.', false );
				}
			}
		} else if( changes > 1 && changes < 3 ) {
			if( this.cocks.length === 1 ) {
				EngineCore.outputText( 'A very pleasurable feeling spreads from your groin as your ' + Descriptors.cockDescript( 0 ) + ' grows permanently longer - at least an inch - and leaks pre-cum from the pleasure of the change.', false );
			} else if( this.cocks.length > 1 ) {
				if( ncocks === this.cocks.length ) {
					EngineCore.outputText( 'A very pleasurable feeling spreads from your groin as your ' + Descriptors.multiCockDescriptLight() + ' grow permanently longer - at least an inch - and leak plenty of pre-cum from the pleasure of the change.', false );
				} else if( ncocks === 1 ) {
					EngineCore.outputText( 'A very pleasurable feeling spreads from your groin as one of your ' + Descriptors.multiCockDescriptLight() + ' grows permanently longer, by at least an inch, and leaks plenty of pre-cum from the pleasure of the change.', false );
				} else if( ncocks > 1 && ncocks < this.cocks.length ) {
					EngineCore.outputText( 'A very pleasurable feeling spreads from your groin as ' + Utils.num2Text( ncocks ) + ' of your ' + Descriptors.multiCockDescriptLight() + ' grow permanently longer, by at least an inch, and leak plenty of pre-cum from the pleasure of the change.', false );
				}
			}
		} else if( changes >= 3 ) {
			if( this.cocks.length === 1 ) {
				EngineCore.outputText( 'Your ' + Descriptors.cockDescript( 0 ) + ' feels incredibly tight as a few more inches of length seem to pour out from your crotch.', false );
			}
			if( this.cocks.length > 1 ) {
				if( ncocks === this.cocks.length ) {
					EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' feel incredibly tight as inch after inch of length pour out from your groin.', false );
				} else if( ncocks === 1 ) {
					EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' feel incredibly tight as one of their number begins to grow inch after inch of length.', false );
				} else if( ncocks > 1 && ncocks < this.cocks.length ) {
					EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' feel incredibly number as ' + Utils.num2Text( ncocks ) + ' of them begin to grow inch after inch of added length.', false );
				}
			}
		}
		//Display LengthChange
		if( changes > 0 ) {
			if( this.cocks[ 0 ].cockLength >= 8 && this.cocks[ 0 ].cockLength - changes < 8 ) {
				if( this.cocks.length === 1 ) {
					EngineCore.outputText( '  <b>Most men would be overly proud to have a tool as long as yours.</b>', false );
				} else if( this.cocks.length > 1 ) {
					EngineCore.outputText( '  <b>Most men would be overly proud to have one cock as long as yours, let alone ' + Descriptors.multiCockDescript() + '.</b>', false );
				}
			}
			if( this.cocks[ 0 ].cockLength >= 12 && this.cocks[ 0 ].cockLength - changes < 12 ) {
				if( this.cocks.length === 1 ) {
					EngineCore.outputText( '  <b>Your ' + Descriptors.cockDescript( 0 ) + ' is so long it nearly swings to your knee at its full length.</b>', false );
				} else if( this.cocks.length > 1 ) {
					EngineCore.outputText( '  <b>Your ' + Descriptors.multiCockDescriptLight() + ' are so long they nearly reach your knees when at full length.</b>', false );
				}
			}
			if( this.cocks[ 0 ].cockLength >= 16 && this.cocks[ 0 ].cockLength - changes < 16 ) {
				if( this.cocks.length === 1 ) {
					EngineCore.outputText( '  <b>Your ' + Descriptors.cockDescript( 0 ) + ' would look more at home on a large horse than you.</b>', false );
				} else if( this.cocks.length > 1 ) {
					EngineCore.outputText( '  <b>Your ' + Descriptors.multiCockDescriptLight() + ' would look more at home on a large horse than on your body.</b>', false );
				}
				if( this.biggestTitSize() >= AppearanceDefs.BREAST_CUP_C ) {
					if( this.cocks.length === 1 ) {
						EngineCore.outputText( '  You could easily stuff your ' + Descriptors.cockDescript( 0 ) + ' between your breasts and give yourself the titty-fuck of a lifetime.', false );
					} else if( this.cocks.length > 1 ) {
						EngineCore.outputText( '  They reach so far up your chest it would be easy to stuff a few this.cocks between your breasts and give yourself the titty-fuck of a lifetime.', false );
					}
				} else {
					if( this.cocks.length === 1 ) {
						EngineCore.outputText( '  Your ' + Descriptors.cockDescript( 0 ) + ' is so long it easily reaches your chest.  The possibility of autofellatio is now a foregone conclusion.', false );
					} else if( this.cocks.length > 1 ) {
						EngineCore.outputText( '  Your ' + Descriptors.multiCockDescriptLight() + ' are so long they easily reach your chest.  Autofellatio would be about as hard as looking down.', false );
					}
				}
			}
			if( this.cocks[ 0 ].cockLength >= 20 && this.cocks[ 0 ].cockLength - changes < 20 ) {
				if( this.cocks.length === 1 ) {
					EngineCore.outputText( '  <b>As if the pulsing heat of your ' + Descriptors.cockDescript( 0 ) + ' wasn\'t enough, the tip of your ' + Descriptors.cockDescript( 0 ) + ' keeps poking its way into your view every time you get hard.</b>', false );
				} else if( this.cocks.length > 1 ) {
					EngineCore.outputText( '  <b>As if the pulsing heat of your ' + Descriptors.multiCockDescriptLight() + ' wasn\'t bad enough, every time you get hard, the tips of your ' + Descriptors.multiCockDescriptLight() + ' wave before you, obscuring the lower portions of your vision.</b>', false );
				}
				if( this.cor > 40 && this.cor <= 60 ) {
					if( this.cocks.length > 1 ) {
						EngineCore.outputText( '  You wonder if there is a demon or beast out there that could take the full length of one of your ' + Descriptors.multiCockDescriptLight() + '?', false );
					} else if( this.cocks.length === 1 ) {
						EngineCore.outputText( '  You wonder if there is a demon or beast out there that could handle your full length.', false );
					}
				}
				if( this.cor > 60 && this.cor <= 80 ) {
					if( this.cocks.length > 1 ) {
						EngineCore.outputText( '  You daydream about being attacked by a massive tentacle beast, its tentacles engulfing your ' + Descriptors.multiCockDescriptLight() + ' to their hilts, milking you dry.\n\nYou smile at the pleasant thought.', false );
					} else if( this.cocks.length === 1 ) {
						EngineCore.outputText( '  You daydream about being attacked by a massive tentacle beast, its tentacles engulfing your ' + Descriptors.cockDescript( 0 ) + ' to the hilt, milking it of all your cum.\n\nYou smile at the pleasant thought.', false );
					}
				}
				if( this.cor > 80 ) {
					if( this.cocks.length > 1 ) {
						EngineCore.outputText( '  You find yourself fantasizing about impaling nubile young champions on your ' + Descriptors.multiCockDescriptLight() + ' in a year\'s time.', false );
					}
				}
			}
		} else if( changes >= -1 ) {
			if( this.cocks.length === 1 ) {
				EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' has shrunk to a slightly shorter length.', false );
			}
			if( this.cocks.length > 1 ) {
				if( ncocks === this.cocks.length ) {
					EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' have shrunk to a slightly shorter length.', false );
				} else if( ncocks === 1 ) {
					EngineCore.outputText( 'You feel ' + Utils.num2Text( ncocks ) + ' of your ' + Descriptors.multiCockDescriptLight() + ' has shrunk to a slightly shorter length.', false );
				} else if( ncocks > 1 && ncocks < this.cocks.length ) {
					EngineCore.outputText( 'You feel ' + Utils.num2Text( ncocks ) + ' of your ' + Descriptors.multiCockDescriptLight() + ' have shrunk to a slightly shorter length.', false );
				}
			}
		} else if( changes > -3 ) {
			if( this.cocks.length === 1 ) {
				EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' shrinks smaller, flesh vanishing into your groin.', false );
			}
			if( this.cocks.length > 1 ) {
				if( ncocks === this.cocks.length ) {
					EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' shrink smaller, the flesh vanishing into your groin.', false );
				} else if( ncocks === 1 ) {
					EngineCore.outputText( 'You feel ' + Utils.num2Text( ncocks ) + ' of your ' + Descriptors.multiCockDescriptLight() + ' shrink smaller, the flesh vanishing into your groin.', false );
				} else if( ncocks > 1 && ncocks < this.cocks.length ) {
					EngineCore.outputText( 'You feel ' + Utils.num2Text( ncocks ) + ' of your ' + Descriptors.multiCockDescriptLight() + ' shrink smaller, the flesh vanishing into your groin.', false );
				}
			}
		} else {
			if( this.cocks.length === 1 ) {
				EngineCore.outputText( 'A large portion of your ' + Descriptors.multiCockDescriptLight() + '\'s length shrinks and vanishes.', false );
			} else if( this.cocks.length > 1 ) {
				if( ncocks === this.cocks.length ) {
					EngineCore.outputText( 'A large portion of your ' + Descriptors.multiCockDescriptLight() + ' receeds towards your groin, receding rapidly in length.', false );
				} else if( ncocks === 1 ) {
					EngineCore.outputText( 'A single member of your ' + Descriptors.multiCockDescriptLight() + ' vanishes into your groin, receding rapidly in length.', false );
				} else if( ncocks > 1 && this.cocks.length > ncocks ) {
					EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' tingles as ' + Utils.num2Text( ncocks ) + ' of your members vanish into your groin, receding rapidly in length.', false );
				}
			}
		}
	};
	Player.prototype.killCocks = function( deadCock ) {
		//Count removal for text bits
		var removed = 0;
		//Less than 0 = PURGE ALL
		if( deadCock < 0 || deadCock > this.cocks.length ) {
			deadCock = this.cocks.length;
		}
		//Double loop - outermost counts down this.cocks to remove, innermost counts down
		while( deadCock > 0 ) {
			//Find shortest cock and prune it
			this.removeCock( _.indexOf(this.cocks, _.minBy(this.cocks, function(cock) { return cock.cockLength; })), 1 );
			removed++;
			deadCock--;
		}
		//Texts
		if( removed === 1 ) {
			if( this.cocks.length === 0 ) {
				EngineCore.outputText( '<b>Your manhood shrinks into your body, disappearing completely.</b>', false );
				if( this.findStatusAffect( StatusAffects.Infested ) >= 0 ) {
					EngineCore.outputText( '  Like rats fleeing a sinking ship, a stream of worms squirts free from your withering member, slithering away.', false );
				}
			}
			if( this.cocks.length === 1 ) {
				EngineCore.outputText( '<b>Your smallest penis disappears, shrinking into your body and leaving you with just one ' + Descriptors.cockDescript( 0 ) + '.</b>', false );
			}
			if( this.cocks.length > 1 ) {
				EngineCore.outputText( '<b>Your smallest penis disappears forever, leaving you with just your ' + Descriptors.multiCockDescriptLight() + '.</b>', false );
			}
		} else if( removed > 1 ) {
			if( this.cocks.length === 0 ) {
				EngineCore.outputText( '<b>All your male endowments shrink smaller and smaller, disappearing one at a time.</b>', false );
				if( this.findStatusAffect( StatusAffects.Infested ) >= 0 ) {
					EngineCore.outputText( '  Like rats fleeing a sinking ship, a stream of worms squirts free from your withering member, slithering away.', false );
				}
			}
			if( this.cocks.length === 1 ) {
				EngineCore.outputText( '<b>You feel ' + Utils.num2Text( removed ) + ' this.cocks disappear into your groin, leaving you with just your ' + Descriptors.cockDescript( 0 ) + '.', false );
			}
			if( this.cocks.length > 1 ) {
				EngineCore.outputText( '<b>You feel ' + Utils.num2Text( removed ) + ' this.cocks disappear into your groin, leaving you with ' + Descriptors.multiCockDescriptLight() + '.', false );
			}
		}
		//remove infestation if cockless
		if( this.cocks.length === 0 ) {
			this.removeStatusAffect( StatusAffects.Infested );
			if( this.balls > 0 ) {
				EngineCore.outputText( '  <b>Your ' + Descriptors.sackDescript() + ' and ' + Descriptors.ballsDescriptLight() + ' shrink and disappear, vanishing into your groin.</b>', false );
				this.balls = 0;
				this.ballSize = 1;
			}
		}
	};
	Player.prototype.modCumMultiplier = function( delta ) {
		$log.debug( 'modCumMultiplier called with: ' + delta );
		if( delta === 0 ) {
			$log.warn( 'Whoops! modCumMuliplier called with 0... aborting...' );
			return delta;
		} else if( delta > 0 ) {
			$log.debug( 'and increasing' );
			if( this.findPerk( PerkLib.MessyOrgasms ) >= 0 ) {
				$log.debug( 'and MessyOrgasms found' );
				delta *= 1.5;
			}
		} else if( delta < 0 ) {
			$log.debug( 'and decreasing' );
			if( this.findPerk( PerkLib.MessyOrgasms ) >= 0 ) {
				$log.debug( 'and MessyOrgasms found' );
				delta *= 0.5;
			}
		}
		$log.debug( 'and modifying by ' + delta );
		this.cumMultiplier += delta;
		return delta;
	};
	Player.prototype.increaseCock = function( cockNum, lengthDelta ) {
		var bigCock = false;
		if( this.findPerk( PerkLib.BigCock ) >= 0 ) {
			bigCock = true;
		}
		return this.cocks[ cockNum ].growCock( lengthDelta, bigCock );
	};
	Player.prototype.increaseEachCock = function( lengthDelta ) {
		var totalGrowth = 0;
		_.forEach(this.cocks, function(cock, index) {
			$log.debug( 'increaseEachCock at: ' + index );
			totalGrowth += this.increaseCock( index, lengthDelta );
		});
		return totalGrowth;
	};
	// Attempts to put the CoC.getInstance().player in heat (or deeper in heat).
	// Returns true if successful, false if not.
	// The CoC.getInstance().player cannot go into heat if she is already pregnant or is a he.
	//
	// First parameter indicating if function should output standard text.
	// Second parameter, an integer multiplier that can increase the
	// duration and intensity. Defaults to 1.
	Player.prototype.goIntoHeat = function( output, intensity ) {
		if( !this.hasVagina() || this.pregnancyIncubation !== 0 ) {
			// No vagina or already pregnant, can't go into heat.
			return false;
		}
		if( intensity === undefined ) {
			intensity = 1;
		}
		//Already in heat, intensify further.
		if( this.isInHeat() ) {
			if( output ) {
				EngineCore.outputText( '\n\nYour mind clouds as your ' + Descriptors.vaginaDescript( 0 ) + ' moistens.  Despite already being in heat, the desire to copulate constantly grows even larger.', false );
			}
			var statusToChange = this.findStatusAffect( StatusAffects.Heat );
			this.statusAffect( statusToChange ).value1 += 5 * intensity;
			this.statusAffect( statusToChange ).value2 += 5 * intensity;
			this.statusAffect( statusToChange ).value3 += 48 * intensity;
			EngineCore.dynStats( 'lib', 5 * intensity, 'resisted', false, 'noBimbo', true );
		}
		//Go into heat.  Heats v1 is bonus fertility, v2 is bonus libido, v3 is hours till it's gone
		else {
			if( output ) {
				EngineCore.outputText( '\n\nYour mind clouds as your ' + Descriptors.vaginaDescript( 0 ) + ' moistens.  Your hands begin stroking your body from top to bottom, your sensitive skin burning with desire.  Fantasies about bending over and presenting your needy pussy to a male overwhelm you as <b>you realize you have gone into heat!</b>', false );
			}
			this.createStatusAffect( StatusAffects.Heat, 10 * intensity, 15 * intensity, 48 * intensity, 0 );
			EngineCore.dynStats( 'lib', 15 * intensity, 'resisted', false, 'noBimbo', true );
		}
		return true;
	};
	// Attempts to put the CoC.getInstance().player in rut (or deeper in heat).
	// Returns true if successful, false if not.
	// The CoC.getInstance().player cannot go into heat if he is a she.
	//
	// First parameter indicating if function should output standard text.
	// Second parameter, an integer multiplier that can increase the
	// duration and intensity. Defaults to 1.
	Player.prototype.goIntoRut = function( output, intensity ) {
		if( !this.hasCock() ) {
			// No this.cocks, can't go into rut.
			return false;
		}
		if( intensity === undefined ) {
			intensity = 1;
		}
		//Has rut, intensify it!
		if( this.isInRut() ) {
			if( output ) {
				EngineCore.outputText( '\n\nYour ' + Descriptors.cockDescript( 0 ) + ' throbs and dribbles as your desire to mate intensifies.  You know that <b>you\'ve sunken deeper into rut</b>, but all that really matters is unloading into a cum-hungry cunt.', false );
			}
			this.addStatusValue( StatusAffects.Rut, 1, 100 * intensity );
			this.addStatusValue( StatusAffects.Rut, 2, 5 * intensity );
			this.addStatusValue( StatusAffects.Rut, 3, 48 * intensity );
			EngineCore.dynStats( 'lib', 5 * intensity, 'resisted', false, 'noBimbo', true );
		} else {
			if( output ) {
				EngineCore.outputText( '\n\nYou stand up a bit straighter and look around, sniffing the air and searching for a mate.  Wait, what!?  It\'s hard to shake the thought from your head - you really could use a nice fertile hole to impregnate.  You slap your forehead and realize <b>you\'ve gone into rut</b>!', false );
			}
			//v1 - bonus cum production
			//v2 - bonus libido
			//v3 - time remaining!
			this.createStatusAffect( StatusAffects.Rut, 150 * intensity, 5 * intensity, 100 * intensity, 0 );
			EngineCore.dynStats( 'lib', 5 * intensity, 'resisted', false, 'noBimbo', true );
		}
		return true;
	};
	var PlayerProxy = new Proxy( Player, {
		construct: function( target ) {
			return new Proxy( target, {
				get: function( target, name ) {
					if( name === 'armorName' ) {
						if( this.modArmorName.length > 0 ) {
							return this.modArmorName;
						}
						return this.armor.name;
					}
					if( name === 'armorDef' ) {
						return this.getArmorDef();
					}
					if( name === 'armorBaseDef' ) {
						return this.armor.def;
					}
					if( name === 'armorPerk' ) {
						return this.armor.perk;
					}
					if( name === 'armorValue' ) {
						return this.armor.value;
					}
					if( name === 'weaponName' ) {
						return this.weapon.name;
					}
					if( name === 'weaponVerb' ) {
						return this.weapon.verb;
					}
					if( name === 'weaponBaseAttack' ) {
						return this.weapon.attack;
					}
					if( name === 'weaponPerk' ) {
						return this.weapon.perk;
					}
					if( name === 'weaponValue' ) {
						return this.weapon.value;
					}
					if( name === 'weaponAttack' ) {
						return this.getWeaponAttack();
					}
					if( name === 'minotaurScore' ) {
						return this.minoScore();
					}
					return target[ name ];
				},
				set: function( target, name, value ) {
					if( _.find( [ 'armorValue', 'armorName', 'armorDef', 'armorPerk', 'weaponName', 'weaponVerb', 'weaponAttack', 'weaponPerk', 'weaponValue' ], name ) ) {
						CoC_Settings.error( 'ERROR to directly set CoC.getInstance().player.' + name );
						return;
					}
					target[ name ] = value;
				}
			} );
		}
	} );
	return PlayerProxy;
} );