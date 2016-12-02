'use strict';

angular.module( 'cocjs' ).factory( 'GreenSlime', function( $log, SceneLib, CoC, EngineCore, Monster, CockTypesEnum, Utils, WeaponLib, AppearanceDefs, StatusAffects, EventParser, ChainedDrop, Combat, ConsumableLib, UsableLib ) {
	function GreenSlime() {
		this.init(this, arguments);
	}
	angular.extend(GreenSlime.prototype, Monster.prototype);

	GreenSlime.prototype.defeated = function( ) {
		EngineCore.outputText( 'You smile in satisfaction as the ' + this.short + ' collapses, unable to continue fighting.', true );
		//Boobfeed.
		if( CoC.player.findStatusAffect( StatusAffects.Feeder ) >= 0 ) {
			//Eligable to rape
			if( CoC.player.lust >= 33 && CoC.player.gender > 0 ) {
				EngineCore.outputText( '\n\nYou\'re horny enough to try and rape it, though you\'d rather see how much milk you can squirt into it.  What do you do?', false );
				EngineCore.choices( 'B.Feed', SceneLib.greenSlimeScene.rapeOozeWithMilk, 'Rape', SceneLib.greenSlimeScene.slimeVictoryRape, '', null, '', null, 'Leave', Combat.cleanupAfterCombat );
			}
			//Rapes not on the table.
			else {
				EngineCore.outputText( '\n\nYour nipples ache with the desire to forcibly breastfeed the gelatinous beast.  Do you?', false );
				EngineCore.doYesNo( SceneLib.greenSlimeScene.rapeOozeWithMilk, Combat.cleanupAfterCombat );
			}
		}
		//Not a breastfeeder
		else if( CoC.player.lust >= 33 && CoC.player.gender > 0 ) {
			EngineCore.outputText( '  Sadly you realize your own needs have not been met.  Of course, you could always play with the poor thing... Do you rape it?', false );
			EngineCore.doYesNo( SceneLib.greenSlimeScene.slimeVictoryRape, Combat.cleanupAfterCombat );
		} else {
			Combat.cleanupAfterCombat();
		}
	};
	GreenSlime.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nThe slime doesn\'t even seem to notice.\n\n' );
		}
		EngineCore.doNext( SceneLib.greenSlimeScene.slimeLoss );
	};
	GreenSlime.prototype.lustAttack = function() {
		EngineCore.outputText( 'The creature surges forward slowly with a swing that you easily manage to avoid.  You notice traces of green liquid spurt from the creature as it does, forming a thin mist that makes your skin tingle with excitement when you inhale it.' );
		EngineCore.dynStats( 'lus', CoC.player.lib / 10 + 8 );
		EngineCore.doNext( EventParser.playerMenu );
	};
	GreenSlime.prototype.lustReduction = function() {
		EngineCore.outputText( 'The creature collapses backwards as its cohesion begins to give out, and the faint outline of eyes and a mouth form on its face.  Its chest heaves as if it were gasping, and the bolt upright erection it sports visibly quivers and pulses before relaxing slightly.' );
		this.lust -= 13;
		EngineCore.doNext( EventParser.playerMenu );
	};
	GreenSlime.prototype.init = function(that, args) {
		Monster.prototype.init(that, args);
		$log.debug( 'GreenSlime Constructor!' );
		that.a = 'a ';
		that.short = 'green slime';
		that.imageName = 'greenslime';
		that.long = 'The green slime has a normally featureless face that sits on top of wide shoulders that sprout into thick, strong arms.  Its torso fades into an indistinct column that melds into the lump of ooze on the ground that serves as a makeshift form of locomotion.';
		that.createCock( 18, 2, CockTypesEnum.HUMAN );
		that.cumMultiplier = 3;
		that.hoursSinceCum = 20;
		that.pronoun1 = 'it';
		that.pronoun2 = 'it';
		that.pronoun3 = 'its';
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_SLIME_DROOLING;
		that.tallness = Utils.rand( 8 ) + 80;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_GOO;
		that.skinTone = 'green';
		that.initStrTouSpeInte( 25, 20, 10, 5 );
		that.initLibSensCor( 50, 60, 20 );
		that.weaponName = 'hands';
		that.weaponVerb = 'slap';
		that.armorName = 'gelatinous skin';
		that.bonusHP = 30;
		that.lust = 30;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 2;
		that.gems = Utils.rand( 5 ) + 1;
		that.drop = new ChainedDrop().add( WeaponLib.PIPE, 1 / 10 )
			.add( ConsumableLib.WETCLTH, 1 / 2 )
			.elseDrop( UsableLib.GREENGL );
		that.special1 = that.lustReduction;
		that.special2 = Combat.lustAttack;
		that.special3 = Combat.lustAttack;
		that.checkMonster();
	};
	return GreenSlime;
} );