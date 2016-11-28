'use strict';

angular.module( 'cocjs' ).factory( 'SandMother', function( CoC, Utils, AppearanceDefs, Monster, StatusAffects, PerkLib, Appearance ) {
	var SandMother = angular.copy( Monster );
	SandMother.prototype.defeated = function() {
		CoC.getInstance().scenes.dungeonSandWitch.defeatTheSandMother();
	};
	SandMother.prototype.won = function() {
		CoC.getInstance().scenes.dungeonSandWitch.loseToTheSandMother();
	};
	SandMother.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.a = 'the ';
		that.short = 'Sand Mother';
		that.imageName = 'sandmother';
		that.long = 'The Sand Mother is a towering woman of imposing stature and bust.  She wears a much silkier, regal-looking robe than her sisters, and it barely serves to contain her four milk-laden breasts, straining under their jiggling weight.  Dangling around her in a way that reminds you oddly of a halo, the Sand Mother\'s blonde-white hair fans around her, hanging long behind her.  The queen witch is brandishing a pearly white scepter rather threateningly, though from the way she holds it, it\'s clear she doesn\'t intend to use it as a physical weapon.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_WET, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 70, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'DD' ) );
		that.createBreastRow( Appearance.breastCupInverse( 'DD' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.createStatusAffect( StatusAffects.BonusACapacity, 50, 0, 0, 0 );
		that.tallness = 8 * 12 + 6;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'bronzed';
		that.hairColor = 'platinum-blonde';
		that.hairLength = 15;
		that.initStrTouSpeInte( 55, 55, 35, 45 );
		that.initLibSensCor( 55, 40, 30 );
		that.weaponName = 'fists';
		that.weaponVerb = 'punches';
		that.weaponAttack = 0;
		that.weaponPerk = '';
		that.weaponValue = 150;
		that.armorName = 'robes';
		that.armorDef = 1;
		that.bonusHP = 130;
		that.lust = 20;
		that.lustVuln = 0.6;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 7;
		that.gems = Utils.rand( 15 ) + 55;
		that.createPerk( PerkLib.Resolute, 0, 0, 0, 0 );
		that.createPerk( PerkLib.Focused, 0, 0, 0, 0 );
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return SandMother;
} );