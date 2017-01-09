'use strict';

angular.module( 'cocjs' ).factory( 'ChameleonGirl', function( SceneLib, MainView, CoC, Monster, Utils, StatusAffects, EngineCore, Appearance, AppearanceDefs, Combat ) {
	function ChameleonGirl() {
		this.init(this, arguments);
	}
	angular.extend(ChameleonGirl.prototype, Monster.prototype);

	ChameleonGirl.prototype.chameleonTongueAttack = function() {
		this.weaponName = 'tongue';
		this.weaponVerb = 'tongue-slap';
		this.weaponAttack = 10;
		this.createStatusAffect( StatusAffects.Attacks, 1, 0, 0, 0 );
		this.eAttack();
		this.weaponAttack = 30;
		this.weaponName = 'claws';
		this.weaponVerb = 'claw';
		SceneLib.combatScene.combatRoundOver();
	};
	//Ignores armor
	ChameleonGirl.prototype.chameleonClaws = function() {
		//Blind dodge change
		if( this.findStatusAffect( StatusAffects.Blind ) && Utils.rand( 3 ) < 1 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind claw-attack!\n', false );
		}
		//Evade:
		else if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			MainView.outputText( 'The chameleon girl\'s claws slash towards you, but you lean away from them and they fly by in a harmless blur.' );
		}//Get hit
		else {
			var damage = Math.ceil( (this.str + this.weaponAttack) - Utils.rand( CoC.player.tou ) );
			if( damage > 0 ) {
				damage = CoC.player.takeDamage( damage );
				MainView.outputText( 'The chameleon swings her arm at you, catching you with her claws.  You wince as they scratch your skin, leaving thin cuts in their wake. (' + damage + ')' );
			} else {
				MainView.outputText( 'The chameleon swings her arm at you, catching you with her claws.  You defend against the razor sharp attack.' );
			}
		}
		SceneLib.combatScene.combatRoundOver();
	};
	//Attack 3
	ChameleonGirl.prototype.rollKickClawWhatTheFuckComboIsThisShit = function() {
		//Blind dodge change
		if( this.findStatusAffect( StatusAffects.Blind ) && Utils.rand( 3 ) < 1 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind roll-kick!\n', false );
		}
		//Evade:
		else if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			var damage2 = 1 + Utils.rand( 10 );
			damage2 = Combat.doDamage( damage2 );
			if (CoC.monster.HP <= 0) {
				EngineCore.doNext( SceneLib.combatScene, SceneLib.combatScene.endHpVictory);
			}
			MainView.outputText( 'The chameleon girl leaps in your direction, rolls, and kicks at you.  You sidestep her flying charge and give her a push from below to ensure she lands face-first in the bog. (' + damage2 + ')' );
		}
		//Get hit
		else {
			var damage = Math.ceil( (this.str + this.weaponAttack) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef ) + 25;
			if( damage > 0 ) {
				damage = CoC.player.takeDamage( damage );
				MainView.outputText( 'The chameleon leaps in your direction, rolls, and kicks you square in the shoulder as she ascends, sending you reeling.  You grunt in pain as a set of sharp claws rake across your chest. (' + damage + ')' );
			} else {
				MainView.outputText( 'The chameleon rolls in your direction and kicks up at your chest, but you knock her aside without taking any damage..' );
			}
		}
		SceneLib.combatScene.combatRoundOver();
	};
	ChameleonGirl.prototype.performCombatAction = function() {
		MainView.spriteSelect( 89 );
		var select = Utils.rand( 3 );
		if( select === 0 ) {
			this.rollKickClawWhatTheFuckComboIsThisShit();
		} else if( select === 1 ) {
			this.chameleonTongueAttack();
		} else {
			this.chameleonClaws();
		}
	};

	ChameleonGirl.prototype.defeated = function( ) {
		SceneLib.chameleonGirlScene.defeatChameleonGirl();
	};

	/* jshint unused:true */
	ChameleonGirl.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			MainView.outputText( '\n\nThe chameleon girl recoils.  "<i>Ew, gross!</i>" she screetches as she runs away, leaving you to recover from your defeat alone.' );
			SceneLib.combatScene.cleanupAfterCombat();
		} else {
			SceneLib.chameleonGirlScene.loseToChameleonGirl();
		}
	};
	ChameleonGirl.prototype.outputPlayerDodged = function( ) {
		MainView.outputText( 'The chameleon girl whips her head and sends her tongue flying at you, but you hop to the side and manage to avoid it.  The pink blur flies back into her mouth as quickly as it came at you, and she looks more than a bit angry that she didn\'t find her target.\n' );
	};
	ChameleonGirl.prototype.outputAttack = function( damage ) {
		if( damage <= 0 ) {
			MainView.outputText( 'The Chameleon Girl lashes out with her tongue, but you deflect the sticky projectile off your arm, successfully defending against it.  She doesn\'t look happy about it when she slurps the muscle back into her mouth.' );
		} else {
			MainView.outputText( 'The chameleon whips her head forward and sends her tongue flying at you.  It catches you in the gut, the incredible force behind it staggering you.  The pink blur flies back into her mouth as quickly as it came at you, and she laughs mockingly as you recover your footing. (' + damage + ')' );
		}
	};
	/**
	 * Pairs of skinTone/skinAdj
	 */
	var SKIN_VARIATIONS = [
		[ 'red', 'black' ],
		[ 'green', 'yellowish' ],
		[ 'blue', 'lighter blue' ],
		[ 'purple', 'bright yellow' ],
		[ 'orange', 'brown' ],
		[ 'tan', 'white' ]
	];
	ChameleonGirl.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('ChameleonGirl');
		var skinToneAdj = Utils.randomChoice( SKIN_VARIATIONS );
		that.a = 'the ';
		that.short = 'chameleon girl';
		that.imageName = 'chameleongirl';
		that.long = 'You\'re faced with a tall lizard-like girl with smooth ' + skinToneAdj[ 0 ] + ' skin and long, ' + skinToneAdj[ 1 ] + ' stripes that run along her body from ankle to shoulder.  An abnormally large tail swishes behind her, and her hands are massive for her frame, built for easily climbing the trees.  A pair of small, cute horns grow from her temples, and a pair of perky B-cups push out through her skimpy drapings.  Large, sharp claws cap her fingers, gesturing menacingly at you.';
		// this.plural = false;
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLAVERING, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createBreastRow( Appearance.breastCupInverse( 'B' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_NORMAL;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.tallness = Utils.rand( 2 ) + 68;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = skinToneAdj[ 0 ];
		that.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		that.skinDesc = 'skin';
		that.skinAdj = skinToneAdj[ 1 ];
		that.hairColor = 'black';
		that.hairLength = 15;
		that.initStrTouSpeInte( 65, 65, 95, 85 );
		that.initLibSensCor( 50, 45, 50 );
		that.weaponName = 'claws';
		that.weaponVerb = 'claw';
		that.weaponAttack = 30;
		that.armorName = 'skin';
		that.armorDef = 20;
		that.bonusHP = 350;
		that.lust = 30;
		that.lustVuln = 0.25;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 14;
		that.gems = 10 + Utils.rand( 50 );
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return ChameleonGirl;
} );