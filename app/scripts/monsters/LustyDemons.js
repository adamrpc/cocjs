'use strict';

angular.module( 'cocjs' ).factory( 'LustyDemons', function( SceneLib, MainView, EngineCore, CockTypesEnum, StatusAffects, CoC, Monster, Utils, AppearanceDefs, Combat ) {
	function LustyDemons() {
		this.init(this, arguments);
	}
	angular.extend(LustyDemons.prototype, Monster.prototype);
	LustyDemons.prototype.performCombatAction = function() {
		this.str = 40;
		this.weaponAttack = 10;
		this.createStatusAffect( StatusAffects.Attacks, 4, 0, 0, 0 );
		this.eAttack();
		this.str = 80;
		this.weaponAttack = 40;
		this.eAttack();
		Combat.combatRoundOver();
	};
	LustyDemons.prototype.defeated = function() {
		SceneLib.owca.defeetVapulasHorde();
	};
	/* jshint unused:true */
	LustyDemons.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			MainView.outputText( '\n\nThe demons smile to one at another as they watch your display, then close in...' );
			EngineCore.doNext( Combat, Combat.endLustLoss );
		} else {
			CoC.scenesgetInstance().scenes.owca.loseOrSubmitToVapula();
		}
	};
	LustyDemons.prototype.teased = function( lustDelta ) {
		if( lustDelta > 0 && lustDelta < 5 ) {
			MainView.outputText( '  The demons lessen somewhat in the intensity of their attack, and some even eye up your assets as they strike at you. Vapula has trouble giving her orders.' );
		}
		if( lustDelta >= 5 && lustDelta < 10 ) {
			MainView.outputText( '  The demons are obviously avoiding damaging anything you might use to fuck and they\'re starting to leave their hands on you just a little longer after each blow.  Some are copping quick feels and you can smell the demonic lust on the air.  Vapula is starting to get frustrated as her minions are more and more reluctant to attack you, preferring to caress each other instead.' );
		}
		if( lustDelta >= 10 ) {
			MainView.outputText( '  The demons are decreasingly willing to hit you and more and more willing to just stroke their hands sensuously over you.  Vapula is uncontrollably aroused herself and shivers even as she tries to maintain some semblance of offense, but most of the demons are visibly uncomfortable and some just lie on the ground, tamed by their own lust.' );
		}
		this.applyTease( lustDelta );
	};
	LustyDemons.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('LustyDemons');
		that.a = 'the ';
		that.short = 'lusty demons';
		that.imageName = 'demonmob';
		that.long = 'You\'re facing a group of thirty demons of various kinds.  Imps, incubi and succubi of all sizes and colors are encircling you, doing their best to show their genitals or their gigantic rows of breasts, often both.  You can see an impressive number of towering cocks, drooling pussies, and jiggling tits wiggle around as they move.  Most of the genitalia are monstrous, ridiculously disproportionate to the actual demons sporting them - to say nothing of the imps!  Some of the succubi are winking at you, blowing invisible kisses as they dance in circles around your pole.  Among them, you can easily spot the tallest demoness of the horde, Vapula; her perfect purple-skinned body, big perky boobs, luscious buttocks, fleshy lips, and seductive stare draw your attention like a magnet.  She\'s sporting a pair of magnificent wings and her abundant hair gives her face a fierce, lion-like appearance.  While her eyes ravage you with an insatiable hunger, she gives orders with the assurance of a well-established dominatrix.';
		that.plural = true;
		that.pronoun1 = 'they';
		that.pronoun2 = 'them';
		that.pronoun3 = 'their';
		that.createCock( 18, 2 );
		that.createCock( 18, 2, CockTypesEnum.DEMON );
		that.balls = 2;
		that.ballSize = 1;
		that.cumMultiplier = 3;
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLICK, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_SLIME_DROOLING;
		that.tallness = Utils.rand( 8 ) + 70;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'red';
		that.hairColor = 'black';
		that.hairLength = 15;
		that.initStrTouSpeInte( 80, 10, 10, 5 );
		that.initLibSensCor( 50, 60, 100 );
		that.weaponName = 'claws';
		that.weaponVerb = 'claw';
		that.armorName = 'demonic skin';
		//6 attacks: 5 from demons (10 damage each), 1 from Vapula (80 damage), 200 gems, 200 xp, 700 hp*/;
		that.bonusHP = 680;
		that.lust = 30;
		that.lustVuln = 0.3;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 14;
		that.gems = 150 + Utils.rand( 100 );
		that.special1 = Combat.packAttack;
		that.special2 = Combat.lustAttack;
		that.tailType = AppearanceDefs.TAIL_TYPE_DEMONIC;
		that.hornType = AppearanceDefs.HORNS_DEMON;
		that.horns = 2;
		that.drop = Monster.NO_DROP;
		that.createStatusAffect( StatusAffects.Vapula, 0, 0, 0, 0 );
		that.checkMonster();
	};
	return LustyDemons;
} );