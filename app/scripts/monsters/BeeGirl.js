'use strict';

angular.module( 'cocjs' ).factory( 'BeeGirl', function( MainView, SceneLib, CoC, Monster, Utils, StatusAffects, EngineCore, Appearance, AppearanceDefs, Combat, WeightedDrop, kFLAGS, ConsumableLib, UseableLib ) {
	function BeeGirl() {
		this.init(this, arguments);
	}
	angular.extend(BeeGirl.prototype, Monster.prototype);
	BeeGirl.prototype.defeated = function( hpVictory ) {
		EngineCore.clearOutput();
		if( CoC.player.gender > 0 ) {
			if( hpVictory ) {
				EngineCore.outputText( 'You smile in satisfaction as the ' + this.short + ' collapses, unable to continue fighting.  The sweet scent oozing from between her legs is too much to bear, arousing you painfully, and you see an easy way to relieve it..\n\nWhat do you do to her?' );
			} else {
				EngineCore.outputText( 'You smile in satisfaction as the ' + this.short + ' spreads her legs and starts frigging her honey-soaked cunt.  The sweet scent oozing from between her legs is too much to bear, arousing you painfully, and you see an easy way to relieve it..\n\nWhat do you do to her?' );
			}
			CoC.player.lust = 98;
			EngineCore.dynStats( 'lus', 1 );
			var dildoRape = CoC.player.hasKeyItem( 'Deluxe Dildo' ) >= 0 ? SceneLib.beeGirlScene.beeGirlsGetsDildoed : null;
			var milkAndHoney = CoC.player.findStatusAffect( StatusAffects.Feeder ) >= 0 ? SceneLib.beeGirlScene.milkAndHoneyAreKindaFunny : null;
			EngineCore.choices( 'Rape', SceneLib.beeGirlScene.rapeTheBeeGirl, 'Dildo Rape', dildoRape, '', null, 'B. Feed', milkAndHoney, 'Leave', this.leaveAfterDefeating );
		} else if( CoC.player.findStatusAffect( StatusAffects.Feeder ) >= 0 ) { //Genderless can still breastfeed
			if( hpVictory ) {
				EngineCore.outputText( 'You smile in satisfaction as the ' + this.short + ' collapses, unable to continue fighting.  The sweet scent oozing from between her legs is too much to bear, arousing you painfully.\n\nWhat do you do?' );
			} else {
				EngineCore.outputText( 'You smile in satisfaction as the ' + this.short + ' spreads her legs and starts frigging her honey-soaked cunt.  The sweet scent oozing from between her legs is too much to bear, arousing you painfully.\n\nWhat do you do?' );
			}
			EngineCore.choices( 'B. Feed', SceneLib.beeGirlScene.milkAndHoneyAreKindaFunny, '', null, '', null, '', null, 'Leave', this.leaveAfterDefeating );
		} else {
			Combat.finishCombat();
		}
	};
	BeeGirl.prototype.leaveAfterDefeating = function() {
		if( this.HP < 1 ) {
			CoC.flags[ kFLAGS.BEE_GIRL_COMBAT_WINS_WITHOUT_RAPE ]++; //This only happens if you beat her up and then don't rape her
		} else {
			CoC.flags[ kFLAGS.BEE_GIRL_COMBAT_WINS_WITH_RAPE ]++; //All wins by lust count towards the desire option, even when you leave
		}
		Combat.cleanupAfterCombat();
	};
	BeeGirl.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nThe bee-girl goes white and backs away with a disgusted look on her face.\n\n' );
			Combat.cleanupAfterCombat();
		} else {
			SceneLib.beeGirlScene.beeRapesYou();
		}
	};
	BeeGirl.prototype.beeStingAttack = function() {
		//Blind dodge change
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 ) {
			EngineCore.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind sting!!' );
			Combat.combatRoundOver();
			return;
		}
		//Determine if dodged!
		if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			if( CoC.player.spe - this.spe < 8 ) {
				EngineCore.outputText( 'You narrowly avoid ' + this.a + this.short + '\'s stinger!' );
			}
			if( CoC.player.spe - this.spe >= 8 && CoC.player.spe - this.spe < 20 ) {
				EngineCore.outputText( 'You dodge ' + this.a + this.short + '\'s stinger with superior quickness!' );
			}
			if( CoC.player.spe - this.spe >= 20 ) {
				EngineCore.outputText( 'You deftly avoid ' + this.a + this.short + '\'s slow attempts to sting you.' );
			}
			Combat.combatRoundOver();
			return;
		}
		//determine if avoided with armor.
		if( CoC.player.armorDef >= 10 && Utils.rand( 4 ) > 0 ) {
			EngineCore.outputText( 'Despite her best efforts, ' + this.a + this.short + '\'s sting attack can\'t penetrate your armor.' );
			Combat.combatRoundOver();
			return;
		}
		//Sting successful!  Paralize or lust?
		//Lust 50% of the time
		if( Utils.rand( 2 ) === 0 ) {
			EngineCore.outputText( 'Searing pain lances through you as ' + this.a + this.short + ' manages to sting you!  You stagger back a step and nearly trip, flushing hotly.  ' );
			EngineCore.outputText( 'Oh no!  You\'ve been injected with some kind of aphrodisiac.  You\'ve got to keep focused, you can\'t think about... fucking... ' );
			if( CoC.player.gender === 1 ) {
				EngineCore.outputText( 'or dripping honey-slicked cunts beckoning you. ' );
			}
			if( CoC.player.gender === 2 ) {
				EngineCore.outputText( 'planting your aching sex over her face while you lick her sweet honeypot. ' );
			}
			if( CoC.player.gender === 3 ) {
				EngineCore.outputText( 'or cocks, tits, and puffy nipples. ' );
			}
			EngineCore.dynStats( 'lus', 25 );
			if( CoC.player.lust > 60 ) {
				EngineCore.outputText( ' You shake your head and struggle to stay focused,' );
				if( CoC.player.gender === 1 || CoC.player.gender === 3 ) {
					EngineCore.outputText( ' but it\'s difficult with the sensitive bulge in your groin.' );
				}
				if( CoC.player.gender === 2 ) {
					EngineCore.outputText( ' but can\'t ignore the soaking wetness in your groin.' );
				}
				if( CoC.player.sens > 50 ) {
					EngineCore.outputText( '  The sensitive nubs of your nipples rub tightly under your ' + CoC.player.armorName + '.' );
				}
			} else {
				EngineCore.outputText( ' You shake your head and clear the thoughts from your head, focusing on the task at hand.' );
			}
			if( CoC.player.findStatusAffect( StatusAffects.lustvenom ) < 0 ) {
				CoC.player.createStatusAffect( StatusAffects.lustvenom, 0, 0, 0, 0 );
			}
		}
		//Paralise the other 50%!
		else {
			EngineCore.outputText( 'Searing pain lances through you as ' + this.a + this.short + ' manages to sting you!  You stagger back a step and nearly trip, finding it hard to move yourself.' );
			var paralyzeIndex = CoC.player.findStatusAffect( StatusAffects.ParalyzeVenom );
			if( paralyzeIndex >= 0 ) {
				CoC.player.statusAffect( paralyzeIndex ).value1 += 2.9; //v1 - strenght penalty, v2 speed penalty
				CoC.player.statusAffect( paralyzeIndex ).value2 += 2.9;
				EngineCore.dynStats( 'str', -3, 'spe', -3 );
				EngineCore.outputText( '  It\'s getting much harder to move, you\'re not sure how many more stings like that you can take!' );
			} else {
				CoC.player.createStatusAffect( StatusAffects.ParalyzeVenom, 2, 2, 0, 0 );
				EngineCore.dynStats( 'str', -2, 'spe', -2 );
				EngineCore.outputText( '  You\'ve fallen prey to paralyzation venom!  Better end this quick!' );
			}
		}
		if( CoC.player.lust >= 100 ) {
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			EngineCore.doNext( MainView.playerMenu );
		}
	};
	BeeGirl.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('BeeGirl');
		that.a = 'a ';
		that.short = 'bee-girl';
		that.imageName = 'beegirl';
		that.long = 'A bee-girl buzzes around you, filling the air with intoxicatingly sweet scents and a buzz that gets inside your head.  She has a humanoid face with small antennae, black chitin on her arms and legs that looks like shiny gloves and boots, sizable breasts, and a swollen abdomen tipped with a gleaming stinger.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLAVERING, AppearanceDefs.VAGINA_LOOSENESS_GAPING );
		that.createBreastRow( Appearance.breastCupInverse( 'DD' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.tallness = Utils.rand( 14 ) + 59;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY + 3;
		that.buttRating = AppearanceDefs.BUTT_RATING_EXPANSIVE;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_BEE;
		that.skinTone = 'yellow';
		that.hairColor = Utils.randomChoice( 'black', 'black and yellow' );
		that.hairLength = 6;
		that.initStrTouSpeInte( 30, 30, 30, 20 );
		that.initLibSensCor( 60, 55, 0 );
		that.weaponName = 'chitin-plated fist';
		that.weaponVerb = 'armored punch';
		that.armorName = 'chitin';
		that.armorDef = 9;
		that.lust = 20 + Utils.rand( 40 );
		that.lustVuln = 0.9;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 4;
		that.gems = Utils.rand( 15 ) + 1;
		that.drop = new WeightedDrop().add( ConsumableLib.BEEHONY, 4 ).addMany( 1, ConsumableLib.OVIELIX, ConsumableLib.W__BOOK, UseableLib.B_CHITN, null );
		that.antennae = AppearanceDefs.ANTENNAE_BEE;
		that.wingType = AppearanceDefs.WING_TYPE_BEE_LIKE_SMALL;
		that.tailType = AppearanceDefs.TAIL_TYPE_BEE_ABDOMEN;
		that.tailVenom = 100;
		that.special1 = this.beeStingAttack;
		that.checkMonster();
	};
	return BeeGirl;
} );