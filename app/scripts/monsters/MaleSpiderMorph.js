'use strict';

angular.module( 'cocjs' ).factory( 'MaleSpiderMorph', function( SceneLib, AbstractSpiderMorph, AppearanceDefs, WeightedDrop, ConsumableLib, UsableLib, CoC, EngineCore, Monster, Utils, StatusAffects, Combat ) {
	function MaleSpiderMorph() {
		this.init(this, arguments);
	}
	angular.extend(MaleSpiderMorph.prototype, AbstractSpiderMorph.prototype);

	MaleSpiderMorph.prototype.defeated = function() {
		SceneLib.maleSpiderMorphScene.defeatSpiderBoy();
	};
	MaleSpiderMorph.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nThe spider flashes a predatory grin while she waits it out...' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			SceneLib.maleSpiderMorphScene.loseToMaleSpiderMorph();
		}
	};
	MaleSpiderMorph.prototype.init = function( that, args ) {
		AbstractSpiderMorph.prototype.init( that, args );
		that.a = 'the ';
		that.short = 'male spider-morph';
		that.imageName = 'malespidermorph';
		that.long = 'The male spider-morph is completely nude, save for his thigh-high stockings and forearm-length gloves, which upon closer inspection, appear to be actually be part of his body - his exoskeleton.  His exposed skin is pale as the full moon, save for the dusk of his nipples and a patch of jet-black that spreads out over his groin, glossing the male\'s foreskinned cock and dangling sack in glistening ebon.  His ass is small but well-rounded, with a weighty spider-abdomen hanging from just above.  The spider-man is currently eyeing you with a strange expression and his fangs bared.';
		that.createCock( 6, 2 );
		that.balls = 2;
		that.ballSize = 2;
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 40, 0, 0, 0 );
		that.tallness = 7 * 12 + 6;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE + 1;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_CHITINOUS_SPIDER_LEGS;
		that.skinTone = 'dusky';
		that.hairColor = 'red';
		that.hairLength = 13;
		that.initStrTouSpeInte( 60, 50, 99, 99 );
		that.initLibSensCor( 35, 35, 20 );
		that.weaponName = 'dagger';
		that.weaponVerb = 'stab';
		that.weaponAttack = 15;
		that.armorName = 'exoskeleton';
		that.armorDef = 14;
		that.armorPerk = '';
		that.armorValue = 70;
		that.bonusHP = 200;
		that.lust = 20;
		that.lustVuln = 0.6;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 13;
		that.gems = Utils.rand( 10 ) + 10;
		that.drop = new WeightedDrop().add( ConsumableLib.S_GOSSR, 5 )
			.add( UsableLib.T_SSILK, 1 )
			.add( null, 4 );
		that.tailType = AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN;
		that.tailRecharge = 0;
		that.checkMonster();
	};
	return MaleSpiderMorph;
} );