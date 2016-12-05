'use strict';

angular.module( 'cocjs' ).factory( 'Hel', function( MainView, SceneLib, $log, kFLAGS, Appearance, ArmorLib, CoC, EngineCore, Monster, Utils, PerkLib, AppearanceDefs, StatusAffects, ChainedDrop, Combat, ConsumableLib) {
	function Hel() {
		this.init(this, arguments);
	}
	angular.extend(Hel.prototype, Monster.prototype);
	Hel.prototype.helAttack = function() {
		var damage;
		//return to combat menu when finished;
		EngineCore.doNext( MainView.playerMenu );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 1 ) {
			EngineCore.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind attack!\n', false );
		}
		//Determine if dodged!;
		else if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			EngineCore.outputText( 'You nimbly dodge the salamander\'s massive sword thrust!', false );
		}
		//Determine if evaded;
		else if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			EngineCore.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + this.a + this.short + '\'s attack.\n', false );
		}
		//('Misdirection';
		else if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			EngineCore.outputText( 'Using Raphael\'s teachings, you anticipate and sidestep ' + this.a + this.short + '\' attacks.\n', false );
		}
		//Determine if cat'ed;
		else if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
			EngineCore.outputText( 'With your incredible flexibility, you squeeze out of the way of ' + this.a + this.short + '', false );
		}
		//Determine damage - str modified by enemy toughness!;
		else {
			damage = Math.ceil( (this.str + this.weaponAttack) - Utils.rand( CoC.player.tou / 2 ) - CoC.player.armorDef / 2 );
			if( damage > 0 ) {
				damage = CoC.player.takeDamage( damage );
			}
			//No damage;
			if( damage <= 0 ) {
				damage = 0;
				//Due to toughness or amor...;
				if( Utils.rand( CoC.player.armorDef + CoC.player.tou ) < CoC.player.armorDef ) {
					EngineCore.outputText( 'You absorb and deflect every ' + this.weaponVerb + ' with your ' + CoC.player.armorName + '.', false );
				} else {
					EngineCore.outputText( 'You deflect and block every ' + this.weaponVerb + ' ' + this.a + this.short + ' throws at you.', false );
				}
			}
			//Take Damage;
			else {
				EngineCore.outputText( 'The salamander lunges at you, sword swinging in a high, savage arc.  You attempt to duck her attack, but she suddenly spins about mid-swing, bringing the sword around on a completely different path.  It bites deep into your flesh, sending you stumbling back. (' + damage + ')', false );
			}
			if( damage > 0 ) {
				if( this.lustVuln > 0 && CoC.player.armorName === 'barely-decent bondage straps' ) {
					EngineCore.outputText( '\n' + this.getCapitalA() + this.short + ' brushes against your exposed skin and jerks back in surprise, coloring slightly from seeing so much of you revealed.', false );
					this.lust += 5 * this.lustVuln;
				}
			}
		}
		EngineCore.statScreenRefresh();
		EngineCore.outputText( '\n', false );
		Combat.combatRoundOver();
	};
	//Attack 2 – Tail Slap (Hit);
	//low dodge chance, lower damage;
	Hel.prototype.helAttack2 = function() {
		var damage;
		//return to combat menu when finished;
		EngineCore.doNext( MainView.playerMenu );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 1 ) {
			EngineCore.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind attack!\n', false );
			return;
		}
		//Determine if dodged!;
		if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 83 ) {
			EngineCore.outputText( 'The salamander rushes at you, knocking aside your defensive feint and trying to close the distance between you.  She lashes out at your feet with her tail, and you\'re only just able to dodge the surprise attack.', false );
			return;
		}
		//Determine if evaded;
		if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 5 ) {
			EngineCore.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + this.a + this.short + '\'s tail-swipe.\n', false );
			return;
		}
		//('Misdirection';
		if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 5 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			EngineCore.outputText( 'Using Raphael\'s teachings, you anticipate and sidestep ' + this.a + this.short + '\' tail-swipe.\n', false );
			return;
		}
		//Determine if cat'ed;
		if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 3 ) {
			EngineCore.outputText( 'With your incredible flexibility, you squeeze out of the way of a tail-swipe!', false );
			return;
		}
		//Determine damage - str modified by enemy toughness!;
		damage = Math.ceil( this.str - Utils.rand( CoC.player.tou ) - CoC.player.armorDef );
		if( damage > 0 ) {
			damage = CoC.player.takeDamage( damage );
		}
		//No damage;
		if( damage <= 0 ) {
			damage = 0;
			//Due to toughness or amor...;
			if( Utils.rand( CoC.player.armorDef + CoC.player.tou ) < CoC.player.armorDef ) {
				EngineCore.outputText( 'The salamander\'s tail-swipe harmlessly deflects off your armor!', false );
			} else {
				EngineCore.outputText( 'The salamander\'s tail-swipe hits you but fails to move or damage you.', false );
			}
		}
		//Take Damage;
		else {
			EngineCore.outputText( 'The salamander rushes at you, knocking aside your defensive feint and sliding in past your guard.  She lashes out at your feet with her tail, and you can feel the heated wake of the fiery appendage on your ensuing fall toward the now-smouldering grass. (' + damage + ')', false );
		}
		if( damage > 0 ) {
			if( this.lustVuln > 0 && CoC.player.armorName === 'barely-decent bondage straps' ) {
				EngineCore.outputText( '\n' + this.getCapitalA() + this.short + ' brushes against your exposed skin and jerks back in surprise, coloring slightly from seeing so much of you revealed.', false );
				this.lust += 5 * this.lustVuln;
			}
		}
		EngineCore.statScreenRefresh();
		EngineCore.outputText( '\n', false );
		Combat.combatRoundOver();
	};
	Hel.prototype.helCleavage = function() {
		//FAIL;
		if( (CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6) || (CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10) || (CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80) ) {
			EngineCore.outputText( 'To your surprise, the salamander suddenly pulls up her top, letting her hefty breasts hang free in the air; her small, bright pink nipples quickly harden from either arousal or temperature.  Before you can take your eyes off her impressive rack, she jumps at you.  One of her scaled arms reaches around your waist, and the other toward your head, but you roll away from her grip and push her bodily away.  She staggers a moment, but then quickly yanks the jangling bikini top back down with a glare.\n', false );
		}
		//Attack 3 – Lust – Cleavage (Failure);
		else {
			EngineCore.outputText( 'To your surprise, the salamander suddenly yanks up her top, letting her hefty breasts hang free in the air; her small, bright pink nipples quickly harden from either arousal or temperature.  Before you can take your eyes off her impressive rack, she jumps at you.  One of her scaled arms encircles your waist, and the other forcefully shoves your face into her cleavage.  She jiggles her tits around your face for a moment before you\'re able to break free, though you can feel a distinct heat rising in your loins.  As quickly as they were revealed, the breasts are concealed again and your opponent is ready for more combat!', false );
			var lust = 20 + Utils.rand( 10 ) + CoC.player.sens / 10 + Utils.rand( CoC.player.lib / 20 );
			EngineCore.dynStats( 'lus', lust );
			//Apply resistance;
			lust *= EngineCore.lustPercent() / 100;
			//Clean up;
			lust = Math.round( lust * 10 ) / 10;
			EngineCore.outputText( ' (+' + lust + ' lust)\n', false );
		}
		Combat.combatRoundOver();
	};
	Hel.prototype.performCombatAction = function() {
		$log.debug( 'Hel Perform Combat Action Called' );
		var select = Utils.rand( 3 );
		$log.debug( 'Selected: ' + select );
		switch( select ) {
			case 0:
				this.helAttack();
				break;
			case 1:
				this.helAttack2();
				break;
			default:
				this.helCleavage();
				break;
		}
	};
	Hel.prototype.defeated = function() {
		if( this.findStatusAffect( StatusAffects.Sparring ) >= 0 ) {
			SceneLib.helFollower.PCBeatsUpSalamanderSparring();
		} else {
			SceneLib.helScene.beatUpHel();
		}
	};
	Hel.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nHelia waits it out in stoic silence...' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			if( this.findStatusAffect( StatusAffects.Sparring ) >= 0 ) {
				SceneLib.helFollower.loseToSparringHeliaLikeAButtRapedChump();
			} else {
				SceneLib.helScene.loseToSalamander();
			}
		}
	};
	Hel.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Hel');
		if( CoC.flags[ kFLAGS.HEL_TALKED_ABOUT_HER ] === 1 ) {
			that.a = '';
			that.short = 'Hel';
		} else {
			that.a = 'the ';
			that.short = 'salamander';
		}
		that.imageName = 'hel';
		that.long = 'You are fighting a (literally) smoking hot salamander – a seven foot tall woman with crimson scales covering her legs, back, and forearms, with a tail swishing menacingly behind her, ablaze with a red-hot fire.  Her red hair whips wildly around her slender shoulders, occasionally flitting over her hefty E-cup breasts, only just concealed within a scale-covered bikini top.  Bright red eyes focus on you from an almost-human face as she circles you, ready to close in for the kill.  Her brutal, curved sword is raised to her side, feinting at you between genuine attacks.';
		that.createVagina( true, AppearanceDefs.VAGINA_WETNESS_NORMAL, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 85, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'E+' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_VIRGIN;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 85, 0, 0, 0 );
		that.tallness = 90;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE + 1;
		that.skinTone = 'dusky';
		that.hairColor = 'red';
		that.hairLength = 13;
		that.initStrTouSpeInte( 80, 70, 75, 60 );
		that.initLibSensCor( 65, 25, 30 );
		that.weaponName = 'sword';
		that.weaponVerb = 'slashing blade';
		that.weaponAttack = 20;
		that.armorName = 'scales';
		that.armorDef = 14;
		that.armorPerk = '';
		that.armorValue = 50;
		that.bonusHP = 275;
		that.lust = 30;
		that.lustVuln = 0.35;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 16;
		that.gems = 10 + Utils.rand( 5 );
		that.drop = new ChainedDrop().add( ArmorLib.CHBIKNI, 1 / 20 ).add( ConsumableLib.REPTLUM, 0.7 );
		that.tailType = AppearanceDefs.TAIL_TYPE_LIZARD;
		that.tailRecharge = 0;
		that.createStatusAffect( StatusAffects.Keen, 0, 0, 0, 0 );
		that.checkMonster();
	};
	return Hel;
} );