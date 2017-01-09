'use strict';

angular.module( 'cocjs' ).factory( 'Akbal', function( $log, MainView, SceneLib, CoC, Monster, Utils, StatusAffects, AppearanceDefs, WeightedDrop, EngineCore, ConsumableLib, Combat, CockTypesEnum, WeaponLib ) {
	function Akbal() {
		this.init(this, arguments);
	}
	angular.extend(Akbal.prototype, Monster.prototype);

	Akbal.prototype.eAttack = function() {
		//Chances to miss:
		var damage = 0;
		//Blind dodge change
		if( this.findStatusAffect( StatusAffects.Blind ) ) {
			MainView.outputText( this.getCapitalA() + this.short + ' seems to have no problem guiding his attacks towards you, despite his blindness.\n', false );
		}
		//Determine if dodged!
		if( Combat.combatMiss() ) {
			if( CoC.player.spe - this.spe < 8 ) {
				MainView.outputText( 'You narrowly avoid ' + this.a + this.short + '\'s ' + this.weaponVerb + '!', false );
			}
			if( CoC.player.spe - this.spe >= 8 && CoC.player.spe - this.spe < 20 ) {
				MainView.outputText( 'You dodge ' + this.a + this.short + '\'s ' + this.weaponVerb + ' with superior quickness!', false );
			}
			if( CoC.player.spe - this.spe >= 20 ) {
				MainView.outputText( 'You deftly avoid ' + this.a + this.short + '\'s slow ' + this.weaponVerb + '.', false );
			}
			SceneLib.combatScene.combatRoundOver();
			return;
		}
		//Determine if evaded
		if( Combat.combatEvade() ) {
			MainView.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + this.a + this.short + '\'s attack.', false );
			SceneLib.combatScene.combatRoundOver();
			return;
		}
		//Determine if flexibilitied
		if( Combat.combatFlexibility( 10 ) ) {
			MainView.outputText( 'Using your cat-like agility, you twist out of the way of ' + this.a + this.short + '\'s attack.', false );
			SceneLib.combatScene.combatRoundOver();
			return;
		}
		//Determine damage - str modified by enemy toughness!
		//*Normal Attack A -
		if( Utils.rand( 2 ) === 0 ) {
			//(medium HP damage)
			damage = Math.ceil( (this.str + this.weaponAttack) - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
			if( damage <= 0 ) {
				MainView.outputText( 'Akbal lunges forwards but with your toughness', false );
				if( CoC.player.armorDef > 0 ) {
					MainView.outputText( ' and ' + CoC.player.armorName + ', he fails to deal any damage.', false );
				} else {
					MainView.outputText( ' he fails to deal any damage.', false );
				}
			} else {
				MainView.outputText( 'Akbal rushes at you, his claws like lightning as they leave four red-hot lines of pain across your stomach.', false );
				CoC.player.takeDamage( damage );
			}
		} else { //*Normal Attack B
			//(high HP damage)
			damage = Math.ceil( (this.str + 25 + this.weaponAttack) - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
			if( damage === 0 ) {
				MainView.outputText( 'Akbal lunges forwards but between your toughness ', false );
				if( CoC.player.armorDef > 0 ) {
					MainView.outputText( 'and ' + CoC.player.armorName + ', he fails to deal any damage.', false );
				}
			} else {
				MainView.outputText( 'Akbal snarls as he flies towards you, snapping his ivory teeth on your arm. You scream out in pain as you throw him off.', false );
				CoC.player.takeDamage( damage );
			}
		}
		SceneLib.combatScene.combatRoundOver();
	};
	Akbal.prototype.defeated = function( hpVictory ) {
		SceneLib.akbalScene.akbalDefeated( hpVictory );
	};
	Akbal.prototype.won = function( hpVictory, pcCameWorms ) {
		SceneLib.akbalScene.akbalWon( hpVictory, pcCameWorms );
		SceneLib.combatScene.cleanupAfterCombat();
	};
	Akbal.prototype.akbalLustAttack = function() {
		//*Lust Attack -
		if( !CoC.player.findStatusAffect( StatusAffects.Whispered ) ) {
			MainView.outputText( 'You hear whispering in your head. this.Akbal begins speaking to you as he circles you, telling all the ways he\'ll dominate you once he beats the fight out of you.', false );
			//(Lust increase)
			EngineCore.dynStats( 'lus', 7 + (100 - CoC.player.inte) / 10 );
			CoC.player.createStatusAffect( StatusAffects.Whispered, 0, 0, 0, 0 );
		}
		//Continuous Lust Attack -
		else {
			MainView.outputText( 'The whispering in your head grows, many voices of undetermined sex telling you all the things the demon wishes to do to you. You can only blush.', false );
			//(Lust increase)
			EngineCore.dynStats( 'lus', 12 + (100 - CoC.player.inte) / 10 );
		}
		SceneLib.combatScene.combatRoundOver();
	};
	Akbal.prototype.akbalSpecial = function() {
		//*Special Attack A -
		if( Utils.rand( 2 ) === 0 && CoC.player.spe > 20 ) {
			var speedChange = CoC.player.spe / 5 * -1;
			MainView.outputText( 'Akbal\'s eyes fill with light, and a strange sense of fear begins to paralyze your limbs.', false );
			//(Speed decrease)
			EngineCore.dynStats( 'spe', speedChange );
			if( CoC.player.findStatusAffect( StatusAffects.AkbalSpeed ) ) {
				CoC.player.addStatusValue( StatusAffects.AkbalSpeed, 1, speedChange );
			} else {
				CoC.player.createStatusAffect( StatusAffects.AkbalSpeed, speedChange, 0, 0, 0 );
			}
		}
		//*Special Attack B -
		else {
			MainView.outputText( 'Akbal releases an ear-splitting roar, hurling a torrent of emerald green flames towards you.\n', false );
			//(high HP damage)
			//Determine if dodged!
			if( Combat.combatMiss() ) {
				if( CoC.player.spe - this.spe < 8 ) {
					MainView.outputText( 'You narrowly avoid ' + this.a + this.short + '\'s fire!', false );
				}
				if( CoC.player.spe - this.spe >= 8 && CoC.player.spe - this.spe < 20 ) {
					MainView.outputText( 'You dodge ' + this.a + this.short + '\'s fire with superior quickness!', false );
				}
				if( CoC.player.spe - this.spe >= 20 ) {
					MainView.outputText( 'You deftly avoid ' + this.a + this.short + '\'s slow fire-breath.', false );
				}
				SceneLib.combatScene.combatRoundOver();
				return;
			}
			//Determine if evaded
			if( Combat.combatEvade( 20 ) ) {
				MainView.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + this.a + this.short + '\'s fire-breath.', false );
				SceneLib.combatScene.combatRoundOver();
				return;
			}
			//Determine if flexibilitied
			if( Combat.combatFlexibility( 10 ) ) {
				MainView.outputText( 'Using your cat-like agility, you contort your body to avoid ' + this.a + this.short + '\'s fire-breath.', false );
				SceneLib.combatScene.combatRoundOver();
				return;
			}
			MainView.outputText( 'You are burned badly by the flames! (' + CoC.player.takeDamage( 40 ) + ')', false );
		}
		SceneLib.combatScene.combatRoundOver();
	};
	//*Support ability -
	Akbal.prototype.akbalHeal = function() {
		if( this.HPRatio() >= 1 ) {
			MainView.outputText( 'Akbal licks himself, ignoring you for now.', false );
		} else {
			MainView.outputText( 'Akbal licks one of his wounds, and you scowl as the injury quickly heals itself.', false );
		}
		this.addHP( 30 );
		this.lust += 10;
		SceneLib.combatScene.combatRoundOver();
	};
	Akbal.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Akbal');
		$log.debug( 'Akbal Constructor!' );
		that.a = '';
		that.short = 'Akbal';
		that.imageName = 'akbal';
		that.long = 'Akbal, \'God of the Terrestrial Fire\', circles around you. His sleek yet muscular body is covered in tan fur, with dark spots that seem to dance around as you look upon them.  His mouth holds two ivory incisors that glint in the sparse sunlight as his lips tremble to the sound of an unending growl.  Each paw conceals lethal claws capable of shredding men and demons to ribbons.  His large and sickeningly alluring bright green eyes promise unbearable agony as you look upon them.';
		that.createCock( 15, 2.5, CockTypesEnum.DOG );
		that.balls = 2;
		that.ballSize = 4;
		that.cumMultiplier = 6;
		that.hoursSinceCum = 400;
		that.createBreastRow();
		that.createBreastRow();
		that.createBreastRow();
		that.createBreastRow();
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.tallness = 4 * 12;
		that.hipRating = AppearanceDefs.HIP_RATING_SLENDER;
		that.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		that.skinTone = 'spotted';
		that.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		that.hairColor = 'black';
		that.hairLength = 5;
		that.initStrTouSpeInte( 55, 53, 50, 75 );
		that.initLibSensCor( 50, 50, 100 );
		that.weaponName = 'claws';
		that.weaponVerb = 'claw-slash';
		that.weaponAttack = 5;
		that.armorName = 'shimmering pelt';
		that.armorDef = 5;
		that.bonusHP = 20;
		that.lust = 30;
		that.lustVuln = 0.8;
		that.temperment = Monster.TEMPERMENT_LUSTY_GRAPPLES;
		that.level = 6;
		that.gems = 15;
		that.drop = new WeightedDrop().add( ConsumableLib.INCUBID, 6 ).add( ConsumableLib.W_FRUIT, 3 ).add( WeaponLib.PIPE, 1 );
		that.special1 = this.akbalLustAttack;
		that.special2 = this.akbalSpecial;
		that.special3 = this.akbalHeal;
		that.tailType = AppearanceDefs.TAIL_TYPE_DOG;
		that.checkMonster();
	};
	return Akbal;
} );