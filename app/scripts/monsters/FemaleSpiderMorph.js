'use strict';

angular.module( 'cocjs' ).factory( 'FemaleSpiderMorph', function( AbstractSpiderMorph, AppearanceDefs, WeightedDrop, ConsumableLib, UsableLib, Appearance, CoC, EngineCore, Monster, Utils, StatusAffects, Combat ) {
	var FemaleSpiderMorph = angular.copy( AbstractSpiderMorph );

	FemaleSpiderMorph.prototype.defeated = function() {
		CoC.getInstance().scenes.femaleSpiderMorphScene.defeatASpiderBitch();
	};
	FemaleSpiderMorph.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nThe spider flashes a predatory grin while she waits it out...' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			CoC.getInstance().scenes.femaleSpiderMorphScene.loseToFemaleSpiderMorph();
		}
	};
	FemaleSpiderMorph.prototype.init = function( that, args ) {
		AbstractSpiderMorph.prototype.init( that, args );
		that.a = 'the ';
		that.short = 'female spider-morph';
		that.imageName = 'femalespidermorph';
		that.long = 'The female spider-morph is completely nude, save for her thigh-high stockings and forearm-length gloves, which upon closer inspection, appear to be actually be part of her body - her exoskeleton.  Her exposed skin is pale as the full moon, save for the dusky skin of her nipples and the black-skinned delta of her sex.  Her breasts and ass are both full and well-rounded, and just above her ass-cheeks there\'s a bulbous spider-abdomen.  The spider-girl is currently eyeing you with a strange expression and her fangs bared.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_DROOLING, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 40, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'E+' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_VIRGIN;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 30, 0, 0, 0 );
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
		that.armorValue = 50;
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
		that.checkMonster();
	};
	return FemaleSpiderMorph;
} );