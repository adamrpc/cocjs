'use strict';

angular.module( 'cocjs' ).factory( 'PhoenixPlatoon', function( SceneLib, CoC, Appearance, Utils, AppearanceDefs, Monster ) {
	function PhoenixPlatoon() {
		this.init(this, arguments);
	}
	angular.extend(PhoenixPlatoon.prototype, Monster.prototype);
	PhoenixPlatoon.prototype.performCombatAction = function() {
		SceneLib.dungeonHelSupplimental.phoenixPlatoonAI();
	};
	PhoenixPlatoon.prototype.defeated = function() {
		SceneLib.dungeonHelSupplimental.phoenixPlatoonLosesToPC();
	};
	PhoenixPlatoon.prototype.won = function() {
		SceneLib.dungeonHelSupplimental.phoenixPlatoonMurdersPC();
	};
	PhoenixPlatoon.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.a = 'the ';
		that.short = 'phoenix platoon';
		that.imageName = 'phoenixmob';
		that.long = 'You are faced with a platoon of heavy infantry, all armed to the teeth and protected by chain vests and shields. They look like a cross between salamander and harpy, humanoid save for crimson wings, scaled feet, and long fiery tails. They stand in a tight-knit shield wall, each phoenix protecting herself and the warrior next to her with their tower-shield. Their scimitars cut great swaths through the room as they slowly advance upon you.';
		that.plural = true;
		that.pronoun1 = 'they';
		that.pronoun2 = 'them';
		that.pronoun3 = 'their';
		that.createCock();
		that.balls = 2;
		that.ballSize = 1;
		that.cumMultiplier = 3;
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLAVERING, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createBreastRow( Appearance.breastCupInverse( 'D' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.tallness = Utils.rand( 8 ) + 70;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_LIZARD;
		that.skinTone = 'red';
		that.hairColor = 'black';
		that.hairLength = 15;
		that.initStrTouSpeInte( 70, 60, 120, 40 );
		that.initLibSensCor( 40, 45, 50 );
		that.weaponName = 'spears';
		that.weaponVerb = 'stab';
		that.weaponAttack = 20;
		that.armorName = 'armor';
		that.armorDef = 20;
		that.bonusHP = 1000;
		that.lust = 20;
		that.lustVuln = 0.15;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 20;
		that.gems = Utils.rand( 25 ) + 160;
		that.additionalXP = 50;
		that.hornType = AppearanceDefs.HORNS_DRACONIC_X2;
		that.horns = 2;
		that.tailType = AppearanceDefs.TAIL_TYPE_HARPY;
		that.wingType = AppearanceDefs.WING_TYPE_FEATHERED_LARGE;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return PhoenixPlatoon;
} );