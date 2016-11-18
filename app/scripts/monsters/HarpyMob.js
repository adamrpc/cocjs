'use strict';

angular.module( 'cocjs' ).factory( 'HarpyMob', function( DungeonHelSupplimental, Appearance, Utils, AppearanceDefs, Monster ) {
	var HarpyMob = angular.copy( Monster );
	HarpyMob.prototype.performCombatAction = function() {
		DungeonHelSupplimental.harpyHordeAI();
	};
	HarpyMob.prototype.defeated = function() {
		DungeonHelSupplimental.pcDefeatsHarpyHorde();
	};
	HarpyMob.prototype.won = function() {
		DungeonHelSupplimental.pcLosesToHarpyHorde();
	};
	HarpyMob.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.a = 'the ';
		that.short = 'harpy horde';
		that.imageName = 'harpymob';
		that.long = 'You are surrounded by a wing of particularly large and muscular harpies, perhaps a dozen of them in total.  All of them are clad in simple brown shifts that give them good camouflage in the mountains, and are using their talon-like claws as weapons against you. While not a great threat to a champion of your ability individually, a whole brood of them together is... something else entirely.';
		that.plural = true;
		that.pronoun1 = 'they';
		that.pronoun2 = 'them';
		that.pronoun3 = 'their';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLAVERING, AppearanceDefs.VAGINA_LOOSENESS_GAPING_WIDE );
		that.createBreastRow( Appearance.breastCupInverse( 'B' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_SLIME_DROOLING;
		that.tallness = Utils.rand( 8 ) + 70;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HARPY;
		that.skinTone = 'red';
		that.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		that.skinDesc = 'feathers';
		that.hairColor = 'black';
		that.hairLength = 15;
		that.initStrTouSpeInte( 50, 50, 120, 40 );
		that.initLibSensCor( 60, 45, 50 );
		that.weaponName = 'claw';
		that.weaponVerb = 'claw';
		that.weaponAttack = 10;
		that.armorName = 'armor';
		that.armorDef = 20;
		that.bonusHP = 1000;
		that.lust = 20;
		that.lustVuln = 0.2;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 18;
		that.gems = Utils.rand( 25 ) + 140;
		that.additionalXP = 50;
		that.tailType = AppearanceDefs.TAIL_TYPE_HARPY;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return HarpyMob;
} );