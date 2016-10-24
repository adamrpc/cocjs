'use strict';

angular.module( 'cocjs' ).factory( 'SandTrap', function( $log, CoC, Monster, Utils, StatusAffects, Appearance, AppearanceDefs, WeightedDrop, Combat, EngineCore, ConsumableLib, Descriptors, EventParser ) {
	var SandWitch = angular.copy( Monster );

	SandWitch.prototype.defeated = function( ) {
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.StoneLust ) ) {
			CoC.getInstance().player.removeStatusAffect( StatusAffects.StoneLust );
		}
		if( CoC.getInstance().player.lust >= 33 ) {
			CoC.getInstance().scenes.desert.sandWitchScene.beatSandwitch();
		} else {
			Combat.finishCombat();
		}
	};
	SandWitch.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nThe witch blanches and backs away, leaving you to your fate.' );
			Combat.cleanupAfterCombat();
		} else {
			CoC.getInstance().scenes.desert.sandWitchScene.sandwitchRape();
		}
	};
	SandWitch.prototype.lustMagicAttack = function() {
		EngineCore.outputText( 'The sand witch points at you, drawing a circle in the air and mouthing strange words.\n\n' );
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.StoneLust ) >= 0 ) {
			EngineCore.outputText( 'The orb inside you grows warm, almost hot, suffusing your body with heat and arousal.  ' );
			EngineCore.dynStats( 'lus', 8 + Math.ceil( CoC.getInstance().player.sens ) / 10 );
		} else {
			EngineCore.outputText( 'You feel the sands shift by your ' + CoC.getInstance().player.feet() + ', and look down to see something slip out of the sands and into your clothes!  It feels incredibly smooth and circular as it glides upward along your ' + CoC.getInstance().player.leg() + ', its progress unaffected by your frantic effort to dislodge it.  ' );
			if( CoC.getInstance().player.vaginas.length > 0 ) {
				EngineCore.outputText( 'It glides up your thighs to the entrance of your sex, and its intentions dawn on you!\n\nToo late! You reach to stop it, but it pushes against your lips and slips inside your ' + Descriptors.vaginaDescript( 0 ) + ' in an instant.  You groan in frustration as it begins pulsing and vibrating, sometimes even seeming to change size.' );
			} else {
				EngineCore.outputText( 'It glides up your thighs, curving around your buttocks, and its intentions dawn on you.\n\nYou desperately grab for it, but are too late!  It pushes firmly against your rectum and slips inside instantaneously.  You groan in frustration as it begins pulsing and vibrating, sometimes even seeming to change size.' );
			}
			CoC.getInstance().player.createStatusAffect( StatusAffects.StoneLust, 0, 0, 0, 0 );
			EngineCore.dynStats( 'lus', 4 + Math.ceil( CoC.getInstance().player.sens ) / 10 );
		}
		EngineCore.doNext( EventParser.playerMenu );
	};
	SandWitch.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		$log.debug( 'SandWitch Constructor!' );
		that.a = 'the ';
		that.short = 'sand witch';
		that.imageName = 'sandwidch';
		that.long = 'A sand witch appears to be totally human, an oddity in this strange land.  She has dirty blonde hair and a very tanned complexion, choosing to cover most of her body with robes of the same color as the desert sands, making her impossible to spot from afar.';
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
		that.weaponName = 'kick';
		that.weaponVerb = 'kick';
		that.armorName = 'robes';
		that.bonusHP = 20;
		that.lust = 30;
		that.temperment = Monster.TEMPERMENT_LUSTY_GRAPPLES;
		that.level = 3;
		that.gems = Utils.rand( 15 ) + 5;
		that.drop = new WeightedDrop().addMany( 1,
			ConsumableLib.TSCROLL,
			ConsumableLib.OVIELIX,
			ConsumableLib.LACTAID,
			ConsumableLib.LABOVA_,
			ConsumableLib.W__BOOK,
			ConsumableLib.B__BOOK,
			null );
		that.special1 = this.lustMagicAttack;
		that.special2 = null;
		that.special3 = null;
		that.checkMonster();
	};
	return SandWitch;
} );