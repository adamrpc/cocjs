'use strict';

angular.module( 'cocjs' ).factory( 'ImpHorde', function( CoC, $log, Combat, EngineCore, CockTypesEnum, ArmorLib, Utils, WeightedDrop, AppearanceDefs, Monster, StatusAffects ) {
	var ImpHorde = angular.copy( Monster );
	ImpHorde.prototype.performCombatAction = function() {
		CoC.getInstance().scenes.dungeon2Supplimental.impGangAI();
	};
	ImpHorde.prototype.defeated = function() {
		CoC.getInstance().scenes.dungeon2Supplimental.impGangVICTORY();
	};
	ImpHorde.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nYour foes don\'t seem put off enough to leave...' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			CoC.getInstance().scenes.dungeon2Supplimental.loseToImpMob();
		}
	};
	ImpHorde.prototype.init = function( that, args ) {
		$log.debug( 'ImpHorde Constructor!' );
		Monster.prototype.init( that, args );
		that.a = 'the ';
		that.short = 'imp horde';
		that.imageName = 'impmob';
		that.long = 'Imps of all shapes and sizes fill the room around you, keeping you completely surrounded by their myriad forms.  You can see more than a few sporting disproportionate erections, and there\'s even some with exotic dog-dicks, horse-pricks, and the odd spiny cat-cock.  Escape is impossible, you\'ll have to fight or seduce your way out of this one!';
		that.plural = true;
		that.pronoun1 = 'they';
		that.pronoun2 = 'them';
		that.pronoun3 = 'their';
		that.createCock( 12, 2, CockTypesEnum.DEMON );
		that.balls = 2;
		that.ballSize = 1;
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 10, 0, 0, 0 );
		that.tallness = 36;
		that.hipRating = AppearanceDefs.HIP_RATING_SLENDER;
		that.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		that.skinTone = 'red';
		that.hairColor = 'black';
		that.hairLength = 1;
		that.initStrTouSpeInte( 20, 10, 25, 12 );
		that.initLibSensCor( 45, 45, 100 );
		that.weaponName = 'fists';
		that.weaponVerb = 'punches';
		that.armorName = 'skin';
		that.bonusHP = 450;
		that.lust = 10;
		that.lustVuln = 0.5;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 10;
		that.gems = 20 + Utils.rand( 25 );
		that.drop = new WeightedDrop( ArmorLib.NURSECL, 1 );
		that.wingType = AppearanceDefs.WING_TYPE_IMP;
		that.wingDesc = 'imp wings';
		that.checkMonster();
	};
	return ImpHorde;
} );