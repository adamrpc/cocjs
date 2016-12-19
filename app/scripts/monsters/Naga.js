'use strict';

angular.module( 'cocjs' ).factory( 'Naga', function( SceneLib, $log, CoC, Monster, Utils, StatusAffects, Appearance, AppearanceDefs, WeightedDrop, ConsumableLib, Combat, EngineCore, MainView, PerkLib ) {
	function Naga() {
		this.init(this, arguments);
	}
	angular.extend(Naga.prototype, Monster.prototype);
	//2a)  Ability -  Poison Bite - poisons player
	Naga.prototype.nagaPoisonBiteAttack = function() {
		//(Deals damage over 4-5 turns, invariably reducing
		//your speed. It wears off once combat is over.)
		MainView.outputText( 'The naga strikes with the speed of a cobra, sinking her fangs into your flesh!  ', false );
		if( CoC.player.findStatusAffect( StatusAffects.NagaVenom ) < 0 ) {
			MainView.outputText( 'The venom\'s effects are almost instantaneous; your vision begins to blur and it becomes increasingly harder to stand.', false );
			if( CoC.player.spe > 4 ) {
				//stats(0,0,-3,0,0,0,0,0);
				CoC.player.spe -= 3;
				MainView.statsView.showStatDown( 'spe' );
				// speUp.visible = false;
				// speDown.visible = true;
				CoC.player.createStatusAffect( StatusAffects.NagaVenom, 3, 0, 0, 0 );
			} else {
				CoC.player.createStatusAffect( StatusAffects.NagaVenom, 0, 0, 0, 0 );
				CoC.player.takeDamage( 5 + Utils.rand( 5 ) );
			}
			CoC.player.takeDamage( 5 + Utils.rand( 5 ) );
		} else {
			MainView.outputText( 'The venom\'s effects intensify as your vision begins to blur and it becomes increasingly harder to stand.', false );
			if( CoC.player.spe > 3 ) {
				//stats(0,0,-2,0,0,0,0,0);
				CoC.player.spe -= 2;
				MainView.statsView.showStatDown( 'spe' );
				// speUp.visible = false;
				// speDown.visible = true;
				CoC.player.addStatusValue( StatusAffects.NagaVenom, 1, 2 );
			} else {
				CoC.player.takeDamage( 5 + Utils.rand( 5 ) );
			}
			CoC.player.takeDamage( 5 + Utils.rand( 5 ) );
		}
		Combat.combatRoundOver();
	};
	//2b)  Ability - Constrict - entangles player, raises lust
	//every turn until you break free
	Naga.prototype.nagaConstrict = function() {
		MainView.outputText( 'The naga draws close and suddenly wraps herself around you, binding you in place! You can\'t help but feel strangely aroused by the sensation of her scales rubbing against your body. All you can do is struggle as she begins to squeeze tighter!', false );
		CoC.player.createStatusAffect( StatusAffects.NagaBind, 0, 0, 0, 0 );
		CoC.player.takeDamage( 2 + Utils.rand( 4 ) );
		Combat.combatRoundOver();
	};
	//2c) Abiliy - Tail Whip - minus ??? HP
	//(base it on toughness?)
	Naga.prototype.nagaTailWhip = function() {
		MainView.outputText( 'The naga tenses and twists herself forcefully.  ', false );
		//[if evaded]
		if( (CoC.player.findPerk( PerkLib.Evade ) && Utils.rand( 6 ) === 0) ) {
			MainView.outputText( 'You see her tail whipping toward you and evade it at the last second. You quickly roll back onto your feet.', false );
		} else if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'Using Raphael\'s teachings and the movement afforded by your bodysuit, you anticipate and sidestep ' + this.a + this.short + '\'s tail-whip.', false );
		} else if( CoC.player.spe > Utils.rand( 300 ) ) {
			MainView.outputText( 'You see her tail whipping toward you and jump out of the way at the last second. You quickly roll back onto your feet.', false );
		} else {
			MainView.outputText( 'Before you can even think, you feel a sharp pain at your side as the naga\'s tail slams into you and shoves you into the sands. You pick yourself up, wincing at the pain in your side.', false );
			var damage = 10;
			if( CoC.player.armorDef < 10 ) {
				damage += 10 - CoC.player.armorDef;
			}
			damage += Utils.rand( 3 );
			damage = CoC.player.takeDamage( damage );
			MainView.outputText( ' (' + damage + ')', false );
		}
		Combat.combatRoundOver();
	};
	Naga.prototype.defeated = function( ) {
		SceneLib.nagaScene.nagaRapeChoice();
	};
	Naga.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			MainView.outputText( '\n\nThe naga\'s eyes go wide and she turns to leave, no longer interested in you.', false );
			CoC.player.orgasm();
			EngineCore.doNext( Combat, Combat.cleanupAfterCombat );
		} else {
			SceneLib.nagaScene.nagaFUCKSJOOOOOO();
		}
	};
	Naga.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Naga');
		if( args[ 0 ] ) {
			return;
		}
		$log.debug( 'Naga Constructor!' );
		that.a = 'the ';
		that.short = 'naga';
		that.imageName = 'naga';
		that.long = 'You are fighting a naga. She resembles a beautiful and slender woman from the waist up, with dark hair hanging down to her neck. Her upper body is deeply tanned, while her lower body is covered with shiny scales, striped in a pattern reminiscent of the dunes around you. Instead of bifurcating into legs, her hips elongate into a snake\'s body which stretches far out behind her, leaving a long and curving trail in the sand.  She\'s completely naked, with her round C-cup breasts showing in plain sight. In her mouth you can see a pair of sharp, poisonous fangs and a long forked tongue moving rapidly as she hisses at you.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLAVERING, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 40, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'C' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 10, 0, 0, 0 );
		that.tallness = 5 * 12 + 10;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_NAGA;
		that.skinTone = 'mediterranean-toned';
		that.hairColor = 'brown';
		that.hairLength = 16;
		that.initStrTouSpeInte( 28, 20, 35, 42 );
		that.initLibSensCor( 55, 55, 40 );
		that.weaponName = 'fist';
		that.weaponVerb = 'punch';
		that.weaponAttack = 3;
		that.armorName = 'scales';
		that.armorDef = 5;
		that.lust = 30;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 2;
		that.gems = Utils.rand( 5 ) + 8;
		that.drop = new WeightedDrop().add( null, 1 ).add( ConsumableLib.REPTLUM, 5 ).add( ConsumableLib.SNAKOIL, 4 );
		that.special1 = that.nagaPoisonBiteAttack;
		that.special2 = that.nagaConstrict;
		that.special3 = that.nagaTailWhip;
		that.checkMonster();
	};
	return Naga;
} );