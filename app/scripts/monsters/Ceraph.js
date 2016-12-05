'use strict';

angular.module( 'cocjs' ).factory( 'Ceraph', function( $log, SceneLib, kFLAGS, PerkLib, EventParser, CockTypesEnum, CoC, Monster, Utils, StatusAffects, Appearance, AppearanceDefs, Combat, EngineCore ) {
	function Ceraph() {
		this.init(this, arguments);
	}
	angular.extend(Ceraph.prototype, Monster.prototype);
	//[IN COMBAT SPECIALS];
	//[SPECIAL 1] – Ubercharge!;
	Ceraph.prototype.ceraphSpecial1 = function() {
		EngineCore.spriteSelect( 7 );
		if( this.findStatusAffect( StatusAffects.Uber ) < 0 ) {
			if( Utils.rand( 2 ) === 0 ) {
				EngineCore.outputText( 'Ceraph winks and says, "<i>Have you ever cum without being touched? You will.</i>"\n\n', false );
			} else {
				EngineCore.outputText( 'Ceraph titters, "<i>Let me show you the true power of an Omnibus.</i>"\n\n', false );
			}
			EngineCore.outputText( 'Despite her sultry tease, you can tell she\'s starting to build up to something big...', false );
			this.createStatusAffect( StatusAffects.Uber, 0, 0, 0, 0 );
		} else {
			//(Next Round);
			if( this.statusAffectv1( StatusAffects.Uber ) === 0 ) {
				this.addStatusValue( StatusAffects.Uber, 1, 1 );
				if( Utils.rand( 2 ) === 0 ) {
					EngineCore.outputText( 'The demonic hermaphrodite begins forging demonic symbols in the air before her, each glowing brilliant pink before they blur away in a haze.', false );
				} else {
					EngineCore.outputText( 'The demonette makes obscene motions with her hands, as if masturbating an imaginary cock or vagina while her hands are wreathed in pink flames.', false );
				}
				EngineCore.outputText( '  <b>She\'s about to unleash something huge!</b>', false );
				if( CoC.player.inte > 50 ) {
					EngineCore.outputText( '  You should probably wait so you\'ll have a chance to avoid whatever\'s coming.', false );
				}
			}
			//FIRE!;
			else {
				this.removeStatusAffect( StatusAffects.Uber );
				//(Avoid!);
				if( CoC.flags[ kFLAGS.IN_COMBAT_USE_PLAYER_WAITED_FLAG ] === 1 ) {
					EngineCore.outputText( 'She throws her hands out, palms facing you, and a rush of pink flame washes towards you.  Thanks to your decision to wait, it\'s easy to avoid the onrushing flames and her attack.\n\n', false );
					EngineCore.outputText( 'Ceraph sighs and asks, "<i>Why would you move?  It would make you feel soooo good!</i>"', false );
				}
				//(AUTO-LOSE);
				else {
					EngineCore.outputText( 'She throws her hands out, palms facing you, and a rush of pink flame washes towards you.  Too busy with your own attack to effectively dodge, you\'re hit full on by the pink fire.  Incredibly, it doesn\'t burn.  The fire actually seems to flow inside you, disappearing into your skin.  You stumble, confused for a second, but then it hits you.  Every inch of your body is buzzing with pleasure, practically squirming and convulsing with sexual delight.  You collapse, twitching and heaving, feeling the constant sensation of sexual release running from your head to your ' + CoC.player.feet() + '.  Too horny and pleasured to resist, you lie down and tremble, occasionally rubbing yourself to enhance the bliss.', false );
					EngineCore.dynStats( 'lus', 1500 );
				}
			}
		}
		Combat.combatRoundOver();
	};
	//[SPECIAL] – Whip Binding;
	Ceraph.prototype.ceraphSpecial2 = function() {
		if( CoC.player.findStatusAffect( StatusAffects.Bound ) < 0 ) {
			EngineCore.outputText( 'Ceraph snaps her whip at you, lightning fast.  Unable to avoid the blinding speed of her attack, you find yourself wrapped from head to toe in the strong leather of her whip.  Remarkably, the fire dies out everywhere the whip touches you, leaving you bound but unharmed.', false );
			//If player has l2 piercing;
			if( CoC.flags[ kFLAGS.PC_FETISH ] >= 2 ) {
				EngineCore.outputText( '  Gods this turns you on!', false );
				EngineCore.dynStats( 'lus', 5 );
			}
			CoC.player.createStatusAffect( StatusAffects.Bound, 2 + Utils.rand( 5 ), 0, 0, 0 );
		}
		//[SPECIAL WHILE PC RESTRAINED];
		else {
			if( Utils.rand( 2 ) === 0 ) {
				EngineCore.outputText( 'Ceraph cuddles up against you, embracing you tenderly.  Her more-than-ample bosom crushes against your flank, and her demonic prick grinds and rubs against your ' + CoC.player.skinDesc + ', smearing it with her juices.  Her hands slide over your bound form, sneaking underneath your ' + CoC.player.armorName + ' to caress you more intimately while you\'re at her mercy.', false );
				EngineCore.dynStats( 'lus', 9 + CoC.player.sens / 10 );
			}
			//[SPECIAL 2 WHILE PC RESTRAINED];
			else {
				EngineCore.outputText( 'Ceraph blows hot kisses in your ear and slides and rubs against you as she slips over to embrace your front.  She holds up a finger, licks it, and wiggles it back and forth.  It begins to glow pink, dimly at first and then with increasing luminosity.  Once it\'s reached a brilliant intensity, the sparkling digit is roughly inserted into your mouth.  You can feel the dark magic soaking into your body just like water soaks into a sponge.  ', false );
				if( CoC.player.lust < 33 ) {
					EngineCore.outputText( 'It makes you feel warm and flushed.', false );
				} else if( CoC.player.lust < 60 ) {
					EngineCore.outputText( 'It gets inside you and turns you on, stoking the flames of your desire.', false );
				} else if( CoC.player.lust < 80 ) {
					EngineCore.outputText( 'It makes you very horny, and you begin to wonder if it\'s worth resisting.', false );
				} else {
					EngineCore.outputText( 'It makes you ache and tremble with need, practically begging for another touch.', false );
				}
				EngineCore.dynStats( 'lus', 5 + CoC.player.cor / 10 + CoC.player.lib / 20 );
			}
		}
		Combat.combatRoundOver();
	};
	//(Struggle);
	Ceraph.prototype.ceraphBindingStruggle = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You wriggle in the tight binding, trying your best to escape.  ', false );
		if( CoC.player.statusAffectv1( StatusAffects.Bound ) - 1 <= 0 ) {
			EngineCore.outputText( 'With a mighty twist and stretch, the whip gives and uncurls from you all at once.  You\'ve regained your freedom', false );
			if( CoC.flags[ kFLAGS.PC_FETISH ] >= 2 ) {
				EngineCore.outputText( ', though you miss the tight leathery embrace', false );
			}
			EngineCore.outputText( '!', false );
			CoC.player.removeStatusAffect( StatusAffects.Bound );
			Combat.combatRoundOver();
			return;
		} else {
			EngineCore.outputText( 'Despite your frantic struggling, all you manage to do is chafe against her impressively taut leather whip.', false );
			if( CoC.flags[ kFLAGS.PC_FETISH ] >= 2 ) {
				EngineCore.outputText( '  You get nice and hot from being so effectively restrained, maybe you should just accept it?', false );
			}
			CoC.player.addStatusValue( StatusAffects.Bound, 1, -1 );
			//Strong characters break free faster;
			if( CoC.player.str > 65 && Utils.rand( CoC.player.str ) > 45 ) {
				EngineCore.outputText( '  Though you didn\'t break free, it seems like your mighty struggles loosened the whip slightly...', false );
				CoC.player.addStatusValue( StatusAffects.Bound, 1, -1 );
			}
		}
		EngineCore.outputText( '\n\n', false );
		this.doAI();
	};
	//(Wait);
	Ceraph.prototype.ceraphBoundWait = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'Why bother resisting?  The feeling of the leather wrapped tightly around you, digging into your ' + CoC.player.skinDesc + ', is intoxicating.', false );
		if( CoC.flags[ kFLAGS.PC_FETISH ] >= 2 ) {
			EngineCore.outputText( '  You squirm inside the bindings as you get more and more turned on, hoping that Ceraph will strip away your armor and force you to parade around as her bound, naked pet.', false );
			EngineCore.dynStats( 'lus', 5 );
		}
		EngineCore.dynStats( 'lus', CoC.player.lib / 20 + 5 + Utils.rand( 5 ) );
		EngineCore.outputText( '\n\n', false );
		this.doAI();
	};

	//[Double-Attack];
	Ceraph.prototype.ceraphSpecial3 = function() {
		//[Mini-cum] – takes place of double-attack if very horny;
		if( this.lust >= 75 ) {
			EngineCore.outputText( 'Ceraph spreads her legs and buries three fingers in her sopping twat, her thumb vigorously rubbing against the base of her bumpy prick.  Her other hand wraps around the meaty pole and begins jerking it rapidly.  In one practiced movement she stops jerking long enough to wrap the whip around her nodule-studded demon-cock, using it like a cockring.  The organ swells thanks to the forced blood-flow, and after a few more seconds of intense masturbation, the demoness cums hard.  Her cunny squirts all over her hand, dripping clear feminine drool down her thighs.  Ceraph\'s masculine endowment pulses and twitches, blasting out two big squirts of jizm before it slows to a trickle.\n', false );
			EngineCore.outputText( 'Letting out a throaty sigh, the demon unties her self-induced binding and gives you a wink.  Did you really just stand there and watch the whole thing?  Amazingly Ceraph actually seems stronger after such a crude display...', false );
			//(+10 str/toughness, 1 level, and 10 xp reward.);
			this.XP += 10;
			this.level += 1;
			this.str += 10;
			this.tou += 10;
			this.HP += 20;
			this.lust = 33;
			EngineCore.dynStats( 'lus', 3 );
			EngineCore.outputText( '\n', false );
			Combat.combatRoundOver();
			return;
		}
		var damage = 0;
		EngineCore.outputText( 'The demoness weaves her whip in the air until you can practically hear it slithering like a snake, cutting the air as it weaves back and forth, still magically alight with flames.  In a blink she lashes out twice in quick succession!\n', false );
		//First hit!;
		EngineCore.doNext( MainView.playerMenu );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 10 ) !== 9 ) {
			EngineCore.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind attack!', false );
		}
		//Determine if dodged!;
		else if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			if( CoC.player.spe - this.spe < 8 ) {
				EngineCore.outputText( 'You narrowly avoid ' + this.a + this.short + '\'s ' + this.weaponVerb + '!', false );
			}
			if( CoC.player.spe - this.spe >= 8 && CoC.player.spe - this.spe < 20 ) {
				EngineCore.outputText( 'You dodge ' + this.a + this.short + '\'s ' + this.weaponVerb + ' with superior quickness!', false );
			}
			if( CoC.player.spe - this.spe >= 20 ) {
				EngineCore.outputText( 'You deftly avoid ' + this.a + this.short + '\'s slow ' + this.weaponVerb + '.', false );
			}
		}
		//Determine if evaded;
		else if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			EngineCore.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + this.a + this.short + '\'s attack.', false );
		} else if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 15 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			EngineCore.outputText( 'With Raphael\'s teachings and the easy movement afforded by your bodysuit, you easily anticipate and sidestep ' + this.a + this.short + '\'s attack.', false );
		}
		//Determine damage - str modified by enemy toughness!;
		else {
			damage = Math.ceil( (this.str + this.weaponAttack) - Math.random() * (CoC.player.tou + CoC.player.armorDef) );
			if( damage > 0 ) {
				damage = CoC.player.takeDamage( damage );
			}
			if( damage <= 0 ) {
				damage = 0;
				//Due to toughness or amor...;
				if( Utils.rand( CoC.player.armorDef + CoC.player.tou ) < CoC.player.armorDef ) {
					EngineCore.outputText( 'Your ' + CoC.player.armorName + ' absorb and deflect every ' + this.weaponVerb + ' from ' + this.a + this.short + '.', false );
				} else {
					EngineCore.outputText( 'You deflect and block every ' + this.weaponVerb + ' ' + this.a + this.short + ' throws at you.', false );
				}
			}
			if( damage > 0 && damage < 6 ) {
				EngineCore.outputText( 'You are struck a glancing blow by ' + this.a + this.short + '! (' + damage + ')', false );
			}
			if( damage > 5 && damage < 11 ) {
				EngineCore.outputText( this.getCapitalA() + this.short + ' wounds you! (' + damage + ')', false );
			}
			if( damage > 10 && damage < 21 ) {
				EngineCore.outputText( this.getCapitalA() + this.short + ' staggers you with the force of ' + this.pronoun3 + ' ' + this.weaponVerb + '! (' + damage + ')', false );
			}
			if( damage > 20 ) {
				EngineCore.outputText( this.getCapitalA() + this.short + ' <b>mutilates</b> you with ' + this.pronoun3 + ' powerful ' + this.weaponVerb + '! (' + damage + ')', false );
			}
		}
		EngineCore.statScreenRefresh();
		EngineCore.outputText( '\n', false );
		//SECOND ATTACK HERE------;
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 10 ) !== 9 ) {
			EngineCore.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind attack!', false );
		}
		//Determine if dodged!;
		else if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			if( CoC.player.spe - this.spe < 8 ) {
				EngineCore.outputText( 'You narrowly avoid ' + this.a + this.short + '\'s ' + this.weaponVerb + '!', false );
			}
			if( CoC.player.spe - this.spe >= 8 && CoC.player.spe - this.spe < 20 ) {
				EngineCore.outputText( 'You dodge ' + this.a + this.short + '\'s ' + this.weaponVerb + ' with superior quickness!', false );
			}
			if( CoC.player.spe - this.spe >= 20 ) {
				EngineCore.outputText( 'You deftly avoid ' + this.a + this.short + '\'s slow ' + this.weaponVerb + '.', false );
			}
		}
		//Determine if evaded;
		else if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			EngineCore.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + this.a + this.short + '\'s attack.', false );
		} else if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 15 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			EngineCore.outputText( 'With Raphael\'s teachings and the easy movement afforded by your bodysuit, you easily anticipate and sidestep ' + this.a + this.short + '\'s attack.', false );
		} else {
			//Determine damage - str modified by enemy toughness!;
			damage = Math.ceil( (this.str + this.weaponAttack) - Math.random() * (CoC.player.tou + CoC.player.armorDef) );
			if( damage > 0 ) {
				damage = CoC.player.takeDamage( damage );
			}
			if( damage <= 0 ) {
				damage = 0;
				//Due to toughness or amor...;
				if( Utils.rand( CoC.player.armorDef + CoC.player.tou ) < CoC.player.armorDef ) {
					EngineCore.outputText( 'Your ' + CoC.player.armorName + ' absorb and deflect every ' + this.weaponVerb + ' from ' + this.a + this.short + '.', false );
				} else {
					EngineCore.outputText( 'You deflect and block every ' + this.weaponVerb + ' ' + this.a + this.short + ' throws at you.', false );
				}
			}
			if( damage > 0 && damage < 6 ) {
				EngineCore.outputText( 'You are struck a glancing blow by ' + this.a + this.short + '! (' + damage + ')', false );
			}
			if( damage > 5 && damage < 11 ) {
				EngineCore.outputText( this.getCapitalA() + this.short + ' wounds you! (' + damage + ')', false );
			}
			if( damage > 10 && damage < 21 ) {
				EngineCore.outputText( this.getCapitalA() + this.short + ' staggers you with the force of ' + this.pronoun3 + ' ' + this.weaponVerb + '! (' + damage + ')', false );
			}
			if( damage > 20 ) {
				EngineCore.outputText( this.getCapitalA() + this.short + ' <b>mutilates</b> you with ' + this.pronoun3 + ' powerful ' + this.weaponVerb + '! (' + damage + ')', false );
			}
		}
		EngineCore.statScreenRefresh();
		EngineCore.outputText( '\n', false );
		Combat.combatRoundOver();
	};
	Ceraph.prototype.performCombatAction = function() {
		var choice = Utils.rand( 4 );
		if( CoC.player.findStatusAffect( StatusAffects.Bound ) >= 0 ) {
			this.ceraphSpecial2();
			return;
		}
		if( this.findStatusAffect( StatusAffects.Uber ) >= 0 ) {
			this.ceraphSpecial1();
			return;
		}
		switch( choice ) {
			case 0:
				this.eAttack();
				break;
			case 1:
				this.ceraphSpecial1();
				break;
			case 2:
				this.ceraphSpecial2();
				break;
			case 3:
				this.ceraphSpecial3();
				break;
		}
	};

	Ceraph.prototype.defeated = function() {
		SceneLib.ceraphScene.winRapeChoices();
	};
	Ceraph.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nYour foe doesn\'t seem disgusted enough to leave...' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			SceneLib.ceraphScene.loseFUCKME();
		}
	};
	Ceraph.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Ceraph');
		$log.debug( 'Ceraph Constructor!' );
		that.a = '';
		that.short = 'Ceraph';
		that.imageName = 'ceraph';
		that.long = 'Ceraph the Omnibus is totally nude and reveling in it.  Her large yet perky breasts jiggle heavily against her chest as she moves.  The flawless purple skin of her twin mounds glistens with a thin sheen of sweat, inviting you to touch and rub your fingers along their slippery surface.  Her eyes are solid black, but convey a mix of amusement and desire, in spite of their alien appearance.  The demon\'s crotch is a combination of both genders – a drooling cunt topped with a thick demonic shaft, sprouting from where a clit should be.';
		that.createCock( 10, 2, CockTypesEnum.DEMON );
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLAVERING, AppearanceDefs.VAGINA_LOOSENESS_GAPING );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 20, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'E' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 15, 0, 0, 0 );
		that.tallness = 5 * 12 + 6;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY;
		that.buttRating = AppearanceDefs.BUTT_RATING_NOTICEABLE;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_HIGH_HEELS;
		that.skinTone = 'purple';
		that.hairColor = 'black';
		that.hairLength = 20;
		that.initStrTouSpeInte( 65, 40, 80, 80 );
		that.initLibSensCor( 75, 15, 100 );
		that.weaponName = 'flaming whip';
		that.weaponVerb = 'flame-whip';
		that.weaponAttack = 15;
		that.armorName = 'demon-skin';
		that.bonusHP = 200;
		that.lust = 30;
		that.lustVuln = 0.75;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 9;
		that.gems = Utils.rand( 5 ) + 38;
		that.drop = Monster.NO_DROP;
		that.special1 = that.ceraphSpecial1;
		that.special2 = that.ceraphSpecial2;
		that.special3 = that.ceraphSpecial3;
		that.checkMonster();
	};
	return Ceraph;
} );