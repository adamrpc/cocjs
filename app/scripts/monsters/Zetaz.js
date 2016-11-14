'use strict';

angular.module( 'cocjs' ).factory( 'Zetaz', function( CockTypesEnum, ConsumableLib, CoC, Dungeon2Supplimental, Combat, EngineCore, Utils, WeightedDrop, AppearanceDefs, Monster ) {
	var Zetaz = angular.copy( Monster );

	Zetaz.prototype.doAI = function() {
		Dungeon2Supplimental.zetazAI();
	};

	Zetaz.prototype.defeated = function() {
		Dungeon2Supplimental.defeatZetaz();
	};
	Zetaz.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nYour foe doesn\'t seem put off enough to care...' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			Dungeon2Supplimental.loseToZetaz();
		}
	};
	Zetaz.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.a = '';
		that.short = 'Zetaz';
		that.imageName = 'zetaz';
		that.long = 'Zetaz has gone from a pipsqueak to the biggest imp you\'ve seen!  Though he has the familiar red skin, curving pointed horns, and wings you would expect to find on an imp, his feet now end in hooves, and his body is covered with thick layers of muscle.  If the dramatic change in appearance is any indication, he\'s had to toughen up nearly as much as yourself over the past ' + (CoC.getInstance().time.days < 60 ? 'weeks' : 'months') + '.  Zetaz still wears the trademark imp loincloth, though it bulges and shifts with his movements in a way that suggest a considerable flaccid size and large, full sack.  His shoulders are wrapped with studded leather and his wrists are covered with metallic bracers.  The imp has clearly invested in at least a little additional protection.  It does not look like he carries a weapon.';
		that.createCock( Utils.rand( 2 ) + 11, 2.5, CockTypesEnum.DEMON );
		that.balls = 2;
		that.ballSize = 1;
		that.cumMultiplier = 3;
		that.hoursSinceCum = 20;
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.tallness = 4 * 12 + 1;
		that.hipRating = AppearanceDefs.HIP_RATING_BOYISH;
		that.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_KANGAROO;
		that.skinTone = 'red';
		that.hairColor = 'black';
		that.hairLength = 5;
		that.initStrTouSpeInte( 65, 60, 45, 52 );
		that.initLibSensCor( 55, 35, 100 );
		that.weaponName = 'claws';
		that.weaponVerb = 'claw-slash';
		that.armorName = 'leathery skin';
		that.bonusHP = 350;
		that.lust = 40;
		that.lustVuln = 0.35;
		that.temperment = Monster.TEMPERMENT_LUSTY_GRAPPLES;
		that.level = 12;
		that.gems = Utils.rand( 55 ) + 150;
		that.additionalXP = 100;
		that.drop = new WeightedDrop( ConsumableLib.BIMBOLQ, 1 );
		that.wingType = AppearanceDefs.WING_TYPE_IMP;
		that.wingDesc = 'small';
		that.checkMonster();
	};
	return Zetaz;
} );