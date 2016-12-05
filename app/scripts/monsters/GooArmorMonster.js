'use strict';

angular.module( 'cocjs' ).factory( 'GooArmorMonster', function( SceneLib, Appearance, GooGirl, CoC, EngineCore, Monster, Utils, AppearanceDefs, StatusAffects, Combat ) {
	function GooArmorMonster() {
		this.init(this, arguments);
	}
	angular.extend(GooArmorMonster.prototype, GooGirl.prototype);
	GooArmorMonster.prototype.performCombatAction = function() {
		SceneLib.dungeonHelSupplimental.gooArmorAI();
	};
	GooArmorMonster.prototype.defeated = function() {
		if( this.findStatusAffect( StatusAffects.Spar ) >= 0 ) {
			SceneLib.valeria.pcWinsValeriaSpar();
		} else {
			SceneLib.dungeonHelSupplimental.beatUpGooArmor();
		}
	};
	GooArmorMonster.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nThe armored goo sighs while you exhaust yourself...' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			if( this.findStatusAffect( StatusAffects.Spar ) >= 0 ) {
				SceneLib.valeria.pcWinsValeriaSparDefeat();
			} else {
				SceneLib.dungeonHelSupplimental.gooArmorBeatsUpPC();
			}
		}
	};
	GooArmorMonster.prototype.init = function( that ) {
		GooGirl.prototype.init( that, [ true ] );
		that.classNames.push('GooArmorMonster');
		that.a = 'a ';
		that.short = 'Goo Armor';
		that.imageName = 'gooarmor';
		that.long = 'Before you stands a suit of plated mail armor filled with a bright blue goo, standing perhaps six feet off the ground.  She has a beautiful, feminine face, and her scowl as she stands before you is almost cute.  She has formed a mighty greatsword from her goo, and has assumed the stance of a well-trained warrior.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLAVERING, AppearanceDefs.VAGINA_LOOSENESS_GAPING_WIDE );
		that.createBreastRow( Appearance.breastCupInverse( 'C' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_SLIME_DROOLING;
		that.tallness = Utils.rand( 8 ) + 70;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'blue';
		that.skinType = AppearanceDefs.SKIN_TYPE_GOO;
		that.skinAdj = 'goopey';
		that.hairColor = 'black';
		that.hairLength = 15;
		that.hairType = AppearanceDefs.HAIR_GOO;
		that.initStrTouSpeInte( 60, 50, 50, 40 );
		that.initLibSensCor( 60, 35, 50 );
		that.weaponName = 'goo sword';
		that.weaponVerb = 'slash';
		that.weaponAttack = 60;
		that.armorName = 'armor';
		that.armorDef = 50;
		that.bonusHP = 500;
		that.lustVuln = 0.35;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 16;
		that.gems = Utils.rand( 25 ) + 40;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return GooArmorMonster;
} );