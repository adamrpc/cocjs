'use strict';

angular.module( 'cocjs' ).factory( 'ChameleonGirl', function( CoC, Monster, Utils, StatusAffects, Appearance, AppearanceDefs, CockTypesEnum, WeightedDrop, ConsumableLib ) {
	var CumWitch = angular.copy( Monster );
	CumWitch.prototype.performCombatAction = function() {
		CoC.getInstance().scenes.dungeonSandwitch.cumWitchAI();
	};
	CumWitch.prototype.defeated = function() {
		CoC.getInstance().scenes.dungeonSandwitch.cumWitchDefeated();
	};
	CumWitch.prototype.won = function() {
		CoC.getInstance().scenes.dungeonSandwitch.defeatedByCumWitch();
	};
	CumWitch.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.a = 'the ';
		that.short = 'Cum Witch';
		that.imageName = 'cumwitch';
		that.long = 'The Cum Witch is a moderately tall woman, almost six feet in height.  Her dark ebony skin is nearly as black as pitch, though it glitters with sweat from her recent sexual activities and the fight.  She has plump lips and long, smooth blonde hair, though much of it is hidden behind a pointed, wide-brimmed hat.  Her robes are even blacker than she is, but she wields an alabaster staff that fairly sizzles with magical might.  Of course, her garments don\'t do much to conceal her gigantic breasts.  Though there are only two, they\'re large enough to dwarf the four tits most sand witches are packing.';
		// this.plural = false;
		that.createCock( 12, 2, CockTypesEnum.HUMAN );
		that.balls = 0;
		that.ballSize = 0;
		that.cumMultiplier = 3;
		that.hoursSinceCum = 20;
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_WET, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 20, 0, 0, 0 );
		that.ccreateBreastRow( Appearance.breastCupInverse( 'E' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.tallness = Utils.rand( 12 ) + 55;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'black';
		that.hairColor = 'sandy-blonde';
		that.hairLength = 15;
		that.cinitStrTouSpeInte( 35, 35, 35, 85 );
		that.cinitLibSensCor( 55, 40, 30 );
		that.weaponName = 'fists';
		that.weaponVerb = 'punches';
		that.armorName = 'robes';
		that.bonusHP = 100;
		that.lust = 30;
		that.lustVuln = 0.8;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 6;
		that.gems = Utils.rand( 15 ) + 5;
		that.drop = new WeightedDrop().addMany( 1,
			ConsumableLib.TSCROLL,
			ConsumableLib.OVIELIX,
			ConsumableLib.LACTAID,
			ConsumableLib.LABOVA_,
			ConsumableLib.W__BOOK,
			ConsumableLib.B__BOOK,
			null );
		that.checkMonster();
	};
	return CumWitch;
} );