'use strict';

angular.module( 'cocjs' ).factory( 'Farmers', function( SceneLib, CockTypesEnum, StatusAffects, Appearance, CoC, Monster, Utils, AppearanceDefs, Combat ) {
	function Farmers() {
		this.init(this, arguments);
	}
	angular.extend(Farmers.prototype, Monster.prototype);
	Farmers.prototype.performCombatAction = function() {
		this.createStatusAffect( StatusAffects.Attacks, 4, 0, 0, 0 );
		this.eAttack();
		Combat.combatRoundOver();
	};
	Farmers.prototype.defeated = function() {
		SceneLib.owca.beatUpOwca();
	};
	Farmers.prototype.won = function() {
		SceneLib.owca.loseToOwca();
	};
	Farmers.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.a = 'the ';
		that.short = 'farmers';
		that.imageName = 'farmers';
		that.long = 'This is a group of thirty angry villagers, almost all human-looking but for the tiny horn-like protrusions growing from their heads and the white fuzz that almost passes off as hair.  They are all armed with pitchforks or other crude farming tools they use in their everyday task.  Rebecc is staring from behind them with horrified eyes at the combat, paralyzed by the sudden turn of events.';
		that.plural = true;
		that.pronoun1 = 'they';
		that.pronoun2 = 'them';
		that.pronoun3 = 'their';
		that.createCock( 9, 2, CockTypesEnum.HUMAN );
		that.balls = 2;
		that.ballSize = 1;
		that.cumMultiplier = 3;
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLICK, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createBreastRow( Appearance.breastCupInverse( 'A' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_SLIME_DROOLING;
		that.tallness = Utils.rand( 8 ) + 70;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'red';
		that.hairColor = 'black';
		that.hairLength = 15;
		that.initStrTouSpeInte( 40, 50, 99, 99 );
		that.initLibSensCor( 35, 35, 20 );
		that.weaponName = 'pitchforks';
		that.weaponVerb = 'stab';
		that.armorName = 'chitin';
		that.bonusHP = 500;
		that.lustVuln = 0;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 10;
		that.gems = Utils.rand( 25 ) + 40;
		that.hornType = AppearanceDefs.HORNS_DEMON;
		that.horns = 2;
		that.tailType = AppearanceDefs.TAIL_TYPE_DEMONIC;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return Farmers;
} );