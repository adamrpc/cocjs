'use strict';

angular.module( 'cocjs' ).factory( 'TamanisDaughters', function( CoC, EngineCore, Monster, Utils, TamainsDaughtersScene, AppearanceDefs, StatusAffects, Appearance, kFLAGS, WeightedDrop, ConsumableLib, Combat, Goblin ) {
	var TamanisDaughters = angular.copy( Goblin );
	TamanisDaughters.prototype.midRoundMadness = function() {
		var selector = Utils.rand( 4 );
		if( selector === 0 ) {
			EngineCore.outputText( 'A slender hand reaches inside your ' + CoC.getInstance().player.armorName + ' and gives your ', false );
			if( CoC.getInstance().player.balls > 0 ) {
				if( Utils.rand( 2 ) === 0 ) {
					EngineCore.outputText( CoC.getInstance().player.multiCockDescriptLight(), false );
				} else {
					EngineCore.outputText( CoC.getInstance().player.ballsDescriptLight(), false );
				}
			} else {
				EngineCore.outputText( CoC.getInstance().player.multiCockDescriptLight(), false );
			}
			EngineCore.outputText( ' a gentle squeeze.  You twist away but your breathing gets a little heavier.\n\n', false );
		} else if( selector === 1 ) {
			EngineCore.outputText( 'A girl latches onto your ' + CoC.getInstance().player.legs() + ' and begins caressing your body lovingly, humming happily.  You quickly shake her loose but the attention makes you blush a little more.\n\n', false );
		} else if( selector === 2 ) {
			EngineCore.outputText( 'One of your daughters launches onto your back and presses her hard, pierced nipples against your neck.  She whispers in your ear, "<i>Twist my nipples dad!</i>"\n\n', false );
			EngineCore.outputText( 'You reach back and throw her off, but her perverted taunts still leave you feeling a little hot under the collar.\n\n', false );
		} else {
			EngineCore.outputText( 'A daughter lays down in front of you and starts jilling herself on the spot.  It\'s impossible to not glance down and see her or hear her pleasured moans.  You step away to remove the distraction but it definitely causes some discomfort in your ' + CoC.getInstance().player.armorName + '.\n\n', false );
		}
		EngineCore.dynStats( 'lus', 1 + CoC.getInstance().player.lib / 15 + Utils.rand( CoC.getInstance().player.cor / 30 ) );
	};
	TamanisDaughters.prototype.tamaniShowsUp = function() {
		if( TamainsDaughtersScene.tamaniPresent ) {
			if( Utils.rand( 4 ) === 0 ) {
				this.goblinDrugAttack();
			} //Tamani already there - chance of potion
		} else if( Utils.rand( 6 ) === 0 ) {
			TamainsDaughtersScene.tamaniPresent = true;
			EngineCore.outputText( 'A high-pitched yet familiar voice calls out, "<i><b>So this is where you skanks ran off to---wait a second.  Are you trying to poach Tamani\'s man!?</b></i>"\n\n', false );
			EngineCore.outputText( 'You can see Tamani lurking around the rear of the goblin pack, visibly berating her daughters.  On one hand it sounds like she might help you, but knowing goblins, she\'ll probably forget about her anger and help them subdue you for more cum...\n\n', false );
			//(+5 mob strength)
			this.str += 5;
			//(+5 mob toughness)
			this.tou += 5;
			this.HP += 10;
			//(-20 mob lust)
			this.lust -= 20;
			//append combat desc
			this.long += ' <b>Tamani lurks in the back of the crowd, curvier than her brood and watching with a mixture of amusement and irritation.  She runs a hand through her pink and black hair, waiting for an opportunity to get involved...</b>';
		}
	};
	TamanisDaughters.prototype.performCombatAction = function() {
		var select = 1;
		//mid-round madness!
		this.midRoundMadness();
		this.tamaniShowsUp();
		if( this.special1 !== null ) {
			select++;
		}
		if( this.special2 !== null ) {
			select++;
		}
		if( this.special3 !== null ) {
			select++;
		}
		switch( Utils.rand( select ) ) {
			case 0:
				this.createStatusAffect( StatusAffects.Attacks, Math.ceil( CoC.getInstance().flags[ kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS ] / 20 ), 0, 0, 0 ); //Tamani's Daughters get multiattacks!
				this.eAttack();
				break;
			case 1:
				this.special1();
				break;
			case 2:
				this.special2();
				break;
			default:
				this.special3();
				break;
		}
		Combat.combatRoundOver();
	};
	TamanisDaughters.prototype.defeated = function( ) {
		CoC.getInstance().scenes.tamaniDaughtersScene.combatWinAgainstDaughters();
	};
	TamanisDaughters.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nYour foes seem visibly disgusted and leave, telling you to, "<i>quit being so fucking gross...</i>"' );
			Combat.cleanupAfterCombat();
		} else {
			CoC.getInstance().scenes.tamaniDaughtersScene.loseToDaughters();
		}
	};
	TamanisDaughters.prototype.init = function( that ) {
		Goblin.prototype.init( that, [ true ] );
		that.a = 'the group of ';
		that.short = 'Tamani\'s daughters';
		that.imageName = 'tamanisdaughters';
		that.long = 'A large grouping of goblin girls has gathered around you, surrounding you on all sides.  Most have varying shades of green skin, though a few have yellowish or light blue casts to their skin.  All are barely clothed, exposing as much of their flesh as possible in order to excite a potential mate.  Their hairstyles are as varied as their clothing and skin-tones, and the only things they seem to have in common are cute faces and curvy forms.  It looks like they want something from you.';
		that.plural = true;
		that.pronoun1 = 'they';
		that.pronoun2 = 'them';
		that.pronoun3 = 'their';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_DROOLING, AppearanceDefs.VAGINA_LOOSENESS_TIGHT );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 40, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'D' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 25, 0, 0, 0 );
		that.tallness = 40;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 1;
		that.buttRating = AppearanceDefs.BUTT_RATING_NOTICEABLE + 1;
		that.skinTone = 'greenish gray';
		that.hairColor = 'pink';
		that.hairLength = 16;
		that.initStrTouSpeInte( 55, 30, 45, 50 );
		that.initLibSensCor( 70, 70, 50 );
		that.weaponName = 'fists';
		that.weaponVerb = 'tiny punch';
		that.armorName = 'leather straps';
		that.bonusHP = 50 + (Math.ceil( CoC.getInstance().flags[ kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS ] / 2 ) * 15);
		that.lust = 30;
		that.lustVuln = 0.65;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 8 + (Math.floor( CoC.getInstance().flags[ kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS ] / 20 ));
		that.gems = Utils.rand( 15 ) + 5;
		that.drop = new WeightedDrop().add( ConsumableLib.GOB_ALE, 5 ).addMany( 1, ConsumableLib.L_DRAFT,
			ConsumableLib.PINKDYE,
			ConsumableLib.BLUEDYE,
			ConsumableLib.ORANGDY,
			ConsumableLib.PURPDYE );
		that.special1 = this.goblinDrugAttack;
		that.special2 = this.goblinTeaseAttack;
		that.checkMonster();
	};
	return TamanisDaughters;
} );