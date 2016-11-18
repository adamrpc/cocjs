﻿'use strict';

angular.module( 'cocjs' ).factory( 'Imp', function( $log, CockTypesEnum, Descriptors, EventParser, AppearanceDefs, WeightedDrop, ConsumableLib, CoC, EngineCore, Monster, Utils, StatusAffects, Combat ) {
	var Imp = angular.copy( Monster );
	Imp.prototype.defeated = function() {
		if( this.findStatusAffect( StatusAffects.KitsuneFight ) >= 0 ) {
			CoC.getInstance().scenes.kitsuneScene.winKitsuneImpFight();
		} else {
			CoC.getInstance().scenes.impScene.impVictory();
		}
	};
	Imp.prototype.won = function( hpVictory, pcCameWorms ) {
		if( this.findStatusAffect( StatusAffects.KitsuneFight ) >= 0 ) {
			CoC.getInstance().scenes.kitsuneScene.loseKitsuneImpFight();
		} else if( pcCameWorms ) {
			EngineCore.outputText( '\n\nThe imp grins at your already corrupted state...', false );
			CoC.getInstance().player.lust = 100;
			EngineCore.doNext( CoC.getInstance().scenes.impScene.impRapesYou );
		} else {
			CoC.getInstance().scenes.impScene.impRapesYou();
		}
	};
	Imp.prototype.lustMagicAttack = function() {
		EngineCore.outputText( 'You see ' + this.a + this.short + ' make sudden arcane gestures at you!\n\n' );
		EngineCore.dynStats( 'lus', CoC.getInstance().player.lib / 10 + CoC.getInstance().player.cor / 10 + 10 );
		if( CoC.getInstance().player.lust < 30 ) {
			EngineCore.outputText( 'You feel strangely warm.  ' );
		}
		if( CoC.getInstance().player.lust >= 30 && CoC.getInstance().player.lust < 60 ) {
			EngineCore.outputText( 'Blood rushes to your groin as a surge of arousal hits you, making your knees weak.  ' );
		}
		if( CoC.getInstance().player.lust >= 60 ) {
			EngineCore.outputText( 'Images of yourself fellating and fucking the imp assault your mind, unnaturally arousing you.  ' );
		}
		if( CoC.getInstance().player.cocks.length > 0 ) {
			if( CoC.getInstance().player.lust >= 60 ) {
				EngineCore.outputText( 'You feel your ' + CoC.getInstance().player.multiCockDescriptLight() + ' dribble pre-cum.' );
			} else if( CoC.getInstance().player.lust >= 30 && CoC.getInstance().player.cocks.length === 1 ) {
				EngineCore.outputText( 'Your ' + CoC.getInstance().player.cockDescript( 0 ) + ' hardens, distracting you further.' );
			} else if( CoC.getInstance().player.lust >= 30 && CoC.getInstance().player.cocks.length > 1 ) {
				EngineCore.outputText( 'Your ' + CoC.getInstance().player.multiCockDescriptLight() + ' harden uncomfortably.' );
			}
			if( CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( '  ' );
			}
		}
		if( CoC.getInstance().player.lust >= 60 && CoC.getInstance().player.hasVagina() ) {
			switch( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness ) {
				case AppearanceDefs.VAGINA_WETNESS_NORMAL:
					EngineCore.outputText( 'Your ' + Descriptors.allVaginaDescript() + ' dampen' + (CoC.getInstance().player.vaginas.length > 1 ? '' : 's') + ' perceptibly.' );
					break;
				case AppearanceDefs.VAGINA_WETNESS_WET:
					EngineCore.outputText( 'Your crotch becomes sticky with girl-lust.' );
					break;
				case AppearanceDefs.VAGINA_WETNESS_SLICK:
					EngineCore.outputText( 'Your ' + Descriptors.allVaginaDescript() + ' become' + (CoC.getInstance().player.vaginas.length > 1 ? '' : 's') + ' sloppy and wet.' );
					break;
				case AppearanceDefs.VAGINA_WETNESS_DROOLING:
					EngineCore.outputText( 'Thick runners of girl-lube stream down the insides of your thighs.' );
					break;
				case AppearanceDefs.VAGINA_WETNESS_SLAVERING:
					EngineCore.outputText( 'Your ' + Descriptors.allVaginaDescript() + ' instantly soak' + (CoC.getInstance().player.vaginas.length > 1 ? '' : 's') + ' your groin.' );
					break;
			}
		}
		EngineCore.outputText( '\n' );
		if( CoC.getInstance().player.lust > 99 ) {
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			EngineCore.doNext( EventParser.playerMenu );
		}
	};
	Imp.prototype.init = function( that, args ) {
		if( args[ 0 ] ) {
			return;
		}
		Monster.prototype.init( that, args );
		$log.debug( 'Imp Constructor!' );
		that.a = 'the ';
		that.short = 'imp';
		that.imageName = 'imp';
		that.long = 'An imp is short, only a few feet tall.  An unkempt mane of shaggy black hair hangs from his head, parted by two short curved horns.  His eyes are solid black, save for tiny red irises which glow with evil intent.  His skin is bright red, and unencumbered by clothing or armor, save for a small loincloth at his belt.  His feet are covered by tiny wooden sandals, and his hands tipped with sharp claws.  A pair of tiny but functional wings occasionally flap from his back.';
		that.createCock( Utils.rand( 2 ) + 11, 2.5, CockTypesEnum.DEMON );
		that.balls = 2;
		that.ballSize = 1;
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.tallness = Utils.rand( 24 ) + 25;
		that.hipRating = AppearanceDefs.HIP_RATING_BOYISH;
		that.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		that.skinTone = 'red';
		that.hairColor = 'black';
		that.hairLength = 5;
		that.initStrTouSpeInte( 20, 10, 25, 12 );
		that.initLibSensCor( 45, 45, 100 );
		that.weaponName = 'claws';
		that.weaponVerb = 'claw-slash';
		that.armorName = 'leathery skin';
		that.lust = 40;
		that.temperment = Monster.TEMPERMENT_LUSTY_GRAPPLES;
		that.level = 1;
		that.gems = Utils.rand( 5 ) + 5;
		that.drop = new WeightedDrop().add( ConsumableLib.SUCMILK, 3 ).add( ConsumableLib.INCUBID, 3 ).add( ConsumableLib.IMPFOOD, 4 );
		that.special1 = this.lustMagicAttack;
		that.wingType = AppearanceDefs.WING_TYPE_IMP;
		that.checkMonster();
	};
	return Imp;
} );