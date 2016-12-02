'use strict';

angular.module( 'cocjs' ).factory( 'SandWitchMob', function( SceneLib, CoC, Utils, AppearanceDefs, Monster, Appearance ) {
	function SandWitchMob() {
		this.init(this, arguments);
	}
	angular.extend(SandWitchMob.prototype, Monster.prototype);
	SandWitchMob.prototype.performCombatAction = function() {
		SceneLib.dungeonSandWitch.sandWitchMobAI();
	};
	SandWitchMob.prototype.defeated = function() {
		SceneLib.dungeonSandWitch.yoYouBeatUpSomeSandWitchesYOUMONSTER();
	};
	SandWitchMob.prototype.won = function() {
		SceneLib.dungeonSandWitch.loseToSammitchMob();
	};
	SandWitchMob.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.a = 'the ';
		that.short = 'sand witches';
		that.imageName = 'sandwitchmob';
		that.long = 'You are surrounded by a veritable tribe of sand witches.  Like the ones that roam the sands, they have simple robes, blond hair, and four big breasts that push at the concealing cloth immodestly.  Glowering at you hatefully, the pack of female spellcasters readies itself to drag you down with sheer numbers.';
		that.plural = true;
		that.pronoun1 = 'they';
		that.pronoun2 = 'them';
		that.pronoun3 = 'their';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_WET, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createBreastRow( Appearance.breastCupInverse( 'DD' ) );
		that.createBreastRow( Appearance.breastCupInverse( 'DD' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.tallness = Utils.rand( 12 ) + 55;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'bronzed';
		that.hairColor = 'sandy-blonde';
		that.hairLength = 15;
		that.initStrTouSpeInte( 25, 25, 35, 45 );
		that.initLibSensCor( 55, 40, 30 );
		that.weaponName = 'fists';
		that.weaponVerb = 'punches';
		that.weaponAttack = 0;
		that.weaponPerk = '';
		that.weaponValue = 150;
		that.armorName = 'robes';
		that.armorDef = 1;
		that.armorPerk = '';
		that.armorValue = 5;
		that.bonusHP = 80;
		that.lust = 30;
		that.lustVuln = 0.5;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 4;
		that.gems = Utils.rand( 15 ) + 5;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return SandWitchMob;
} );