'use strict';

angular.module( 'cocjs' ).factory( 'HarpyQueen', function( SceneLib, Appearance, Utils, AppearanceDefs, Monster ) {
	function HarpyQueen() {
		this.init(this, arguments);
	}
	angular.extend(HarpyQueen.prototype, Monster.prototype);
	HarpyQueen.prototype.performCombatAction = function() {
		SceneLib.dungeonHelSupplimental.harpyQueenAI();
	};
	HarpyQueen.prototype.defeated = function() {
		SceneLib.dungeonHelSupplimental.harpyQueenDefeatedByPC();
	};
	HarpyQueen.prototype.won = function() {
		SceneLib.dungeonHelSupplimental.harpyQueenBeatsUpPCBadEnd();
	};
	HarpyQueen.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('HarpyQueen');
		that.a = 'the ';
		that.short = 'Harpy Queen';
		that.imageName = 'harpyqueen';
		that.long = 'You face the Harpy Queen, a broodmother of epic proportions - literally.  Her hips are amazingly wide, thrice her own width at the least, and the rest of her body is lushly voluptuous, with plush, soft thighs and a tremendous butt.  Her wide wings beat occasionally, sending ripples through her jiggly body.  She wields a towering whitewood staff in one hand, using the other to cast eldritch spells.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLAVERING, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createBreastRow( Appearance.breastCupInverse( 'D' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.tallness = Utils.rand( 8 ) + 70;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HARPY;
		that.skinTone = 'red';
		that.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		that.skinDesc = 'feathers';
		that.hairColor = 'black';
		that.hairLength = 15;
		that.initStrTouSpeInte( 70, 60, 120, 40 );
		that.initLibSensCor( 40, 45, 50 );
		that.weaponName = 'eldritch staff';
		that.weaponVerb = 'thwack';
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
		that.tailType = AppearanceDefs.TAIL_TYPE_HARPY;
		that.wingType = AppearanceDefs.WING_TYPE_FEATHERED_LARGE;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return HarpyQueen;
} );