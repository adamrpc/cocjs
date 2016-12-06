'use strict';

angular.module( 'cocjs' ).factory( 'WormMass', function( SceneLib, $log, CoC, EngineCore, Monster, Utils, AppearanceDefs ) {
	function WormMass() {
		this.init(this, arguments);
	}
	angular.extend(WormMass.prototype, Monster.prototype);

	WormMass.prototype.performCombatAction = function() {
		//Worms have different AI;
		if( Utils.rand( 2 ) === 0 ) {
			this.special1();
		} else {
			this.special2();
		}
	};

	WormMass.prototype.won = function( hpVictory ) {
		EngineCore.outputText( 'Overcome by your ' + (hpVictory ? 'wounds' : 'lust') + ', you sink to your knees as the colony of worms swarms all over your body...\n\n', true );
		SceneLib.worms.infest1();
	};
	WormMass.prototype.eMaxHP = function() {
		return 40;
	};
	WormMass.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('WormMass');
		$log.debug( 'WormMass Constructor!' );
		that.a = 'the ';
		that.short = 'worms';
		that.imageName = 'worms';
		that.long = 'Before you stands the horrid mass of worms. It has shifted itself and now takes the shape of a humanoid composed completely of the worms in the colony. Its vaguely human shape lumbers towards you in a clearly aggressive manner.';
		that.plural = true;
		that.initGenderless();
		that.pronoun1 = 'they';
		that.pronoun2 = 'them';
		that.pronoun3 = 'their';
		that.createBreastRow( 0, 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_VIRGIN;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.tallness = 1;
		that.hipRating = AppearanceDefs.HIP_RATING_SLENDER;
		that.buttRating = AppearanceDefs.BUTT_RATING_BUTTLESS;
		that.skinTone = 'white';
		that.initStrTouSpeInte( 35, 5, 10, 1 );
		that.initLibSensCor( 90, 60, 90 );
		that.weaponName = 'worm';
		that.weaponVerb = 'slap';
		that.armorName = 'skin';
		that.lust = 30;
		that.lustVuln = 0;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 3;
		that.gems = 0;
		that.special1 = SceneLib.worms.wormAttack;
		that.special2 = SceneLib.worms.wormsEntice;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return WormMass;
} );