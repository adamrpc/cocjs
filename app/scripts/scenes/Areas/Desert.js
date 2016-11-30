'use strict';

angular.module( 'cocjs' ).run( function( CoC, kFLAGS, Utils, StatusAffects, PregnancyStore, EngineCore, WeaponLib ) {
	function Desert() {
	}

	//Explore desert
	Desert.prototype.exploreDesert = function() {
		CoC.getInstance().player.exploredDesert++;
		if( CoC.getInstance().player.level >= 4 && CoC.getInstance().player.exploredDesert % 15 === 0 && CoC.getInstance().flags[ kFLAGS.DISCOVERED_WITCH_DUNGEON ] === 0 ) {
			CoC.getInstance().scenes.dungeonSandwitch.enterBoobsDungeon();
			return;
		}
		if( Utils.rand( 40 ) === 0 ) {
			CoC.getInstance().exgartuan.fountainEncounter();
			return;
		}
		//Helia monogamy fucks
		if( CoC.getInstance().flags[ kFLAGS.PC_PROMISED_HEL_MONOGAMY_FUCKS ] === 1 && CoC.getInstance().flags[ kFLAGS.HEL_RAPED_TODAY ] === 0 && Utils.rand( 10 ) === 0 && CoC.getInstance().player.gender > 0 && !CoC.getInstance().scenes.helScene.followerHel() ) {
			CoC.getInstance().scenes.helScene.helSexualAmbush();
			return;
		}
		if( (CoC.getInstance().player.exploredDesert === 20 && CoC.getInstance().player.findStatusAffect( StatusAffects.TelAdre ) < 0) || (Utils.rand( 20 ) === 0 && CoC.getInstance().player.statusAffectv1( StatusAffects.TelAdre ) === 0) ) {
			CoC.getInstance().scenes.telAdre.discoverTelAdre();
			return;
		}
		if( CoC.getInstance().scenes.sandWitchScene.pregnancy.event === 2 && Utils.rand( 4 ) === 0 ) {
			if( CoC.getInstance().flags[ kFLAGS.EGG_WITCH_TYPE ] === PregnancyStore.PREGNANCY_DRIDER_EGGS ) {
				CoC.getInstance().scenes.sandWitchScene.sammitchBirthsDriders();
			} else {
				CoC.getInstance().scenes.sandWitchScene.witchBirfsSomeBees();
			}
			return;
		}
		//Ant colony debug chances
		if( CoC.getInstance().player.level >= 5 && CoC.getInstance().flags[ kFLAGS.ANT_WAIFU ] === 0 && (CoC.getInstance().player.exploredDesert % 8 === 0) && CoC.getInstance().flags[ kFLAGS.ANTS_PC_FAILED_PHYLLA ] === 0 && CoC.getInstance().flags[ kFLAGS.ANT_COLONY_KEPT_HIDDEN ] === 0 ) {
			CoC.getInstance().scenes.antsScene.antColonyEncounter();
			return;
		}
		//int over 50?  Chance of alice encounter!
		if( Utils.rand( 4 ) === 0 && CoC.getInstance().player.inte > 50 && CoC.getInstance().flags[ kFLAGS.FOUND_WIZARD_STAFF ] === 0 ) {
			EngineCore.outputText( '', true );
			EngineCore.outputText( 'While exploring the desert, you see a plume of smoke rising in the distance.  You change direction and approach the soot-cloud carefully.  It takes a few moments, but after cresting your fourth dune, you locate the source.  You lie low, so as not to be seen, and crawl closer for a better look.\n\n', false );
			EngineCore.outputText( 'A library is burning up, sending flames dozens of feet into the air.  It doesn\'t look like any of the books will survive, and most of the structure has already been consumed by the hungry flames.  The source of the inferno is curled up next to it.  It\'s a naga!  She\'s tall for a naga, at least seven feet if she stands at her full height.  Her purplish-blue skin looks quite exotic, and she wears a flower in her hair.  The naga is holding a stick with a potato on the end, trying to roast the spud on the library-fire.  It doesn\'t seem to be going well, and the potato quickly lights up from the intense heat.\n\n', false );
			EngineCore.outputText( 'The snake-woman tosses the burnt potato away and cries, "<i>Hora hora.</i>"  She suddenly turns and looks directly at you.  Her gaze is piercing and intent, but she vanishes before you can react.  The only reminder she was ever there is a burning potato in the sand.   Your curiosity overcomes your caution, and you approach the fiery inferno.  There isn\'t even a trail in the sand, and the library is going to be an unsalvageable wreck in short order.   Perhaps the only item worth considering is the stick with the burning potato.  It\'s quite oddly shaped, and when you reach down to touch it you can feel a resonant tingle.  Perhaps it was some kind of wizard\'s staff?\n\n', false );
			CoC.getInstance().flags[ kFLAGS.FOUND_WIZARD_STAFF ]++;
			CoC.getInstance().scenes.inventory.takeItem( WeaponLib.W_STAFF, CoC.getInstance().scenes.camp.returnToCampUseOneHour );
			return;
		}
		//Possible chance of boosting camp space!
		if( CoC.getInstance().player.hasKeyItem( 'Camp - Chest' ) < 0 && (Utils.rand( 100 ) < 10) ) {
			EngineCore.outputText( 'While wandering the trackless sands of the desert, you break the silent monotony with a loud \'thunk\'.  You look down and realize you\'re standing on the lid of an old chest, somehow intact and buried in the sand.  Overcome with curiosity, you dig it out, only to discover that it\'s empty.  It would make a nice addition to your campsite.\n\nYou decide to bring it back to your campsite.  <b>You now have six storage item slots at camp.</b>', true );
			CoC.getInstance().scenes.inventory.createStorage();
			CoC.getInstance().scenes.inventory.createStorage();
			CoC.getInstance().scenes.inventory.createStorage();
			CoC.getInstance().scenes.inventory.createStorage();
			CoC.getInstance().scenes.inventory.createStorage();
			CoC.getInstance().scenes.inventory.createStorage();
			CoC.getInstance().player.createKeyItem( 'Camp - Chest', 0, 0, 0, 0 );
			EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
			return;
		}
		//Chance of dick-dragging! 10% + 10% per two foot up to 30%
		var dickDraggingChances = Math.min( 30, 10 + (CoC.getInstance().player.longestCockLength() - CoC.getInstance().player.tallness) / 24 * 10 );
		if( dickDraggingChances > Utils.rand( 100 ) && CoC.getInstance().player.longestCockLength() >= CoC.getInstance().player.tallness && CoC.getInstance().player.totalCockThickness() >= 12 ) {
			CoC.getInstance().scenes.exploration.bigJunkDesertScene();
			return;
		}
		var choices = [];
		//-8008 is cheating for 'no arg'
		var args = [];
		//Encounter Sandwitch
		if( CoC.getInstance().flags[ kFLAGS.SAND_WITCH_LEAVE_ME_ALONE ] === 0 ) {
			choices[ choices.length ] = CoC.getInstance().scenes.sandWitchScene.encounter;
			args[ args.length ] = -8008;
		}
		if( CoC.getInstance().flags[ kFLAGS.CUM_WITCHES_FIGHTABLE ] > 0 ) {
			choices[ choices.length ] = CoC.getInstance().scenes.dungeonSandwitch.fightCumWitch;
			args[ args.length ] = -8008;
		}
		//Encounter Marcus
		choices[ choices.length ] = CoC.getInstance().scenes.wanderer.wandererRouter;
		args[ args.length ] = -8008;
		choices[ choices.length ] = this.walkingDesertStatBoost;
		args[ args.length ] = -8008;
		if( Utils.rand( 2 ) === 0 && CoC.getInstance().player.level >= 2 ) {
			if( Utils.rand( 2 ) === 0 ) {
				choices[ choices.length ] = this.mirageDesert;
				args[ args.length ] = -8008;
			} else {
				choices[ choices.length ] = CoC.getInstance().scenes.oasis.oasisEncounter;
				args[ args.length ] = -8008;
			}
		}
		choices[ choices.length ] = CoC.getInstance().scenes.nagaScene.nagaEncounter;
		args[ args.length ] = -8008;
		if( Utils.rand( 2 ) === 0 ) {
			choices[ choices.length ] = CoC.getInstance().scenes.sandTrapScene.encounterASandTarp;
			args[ args.length ] = -8008;
		}
		var select = Utils.rand( choices.length );
		if( args[ select ] === -8008 ) {
			choices[ select ]();
		} else {
			choices[ select ]( args[ select ] );
		}
	};
	Desert.prototype.mirageDesert = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'While exploring the desert, you see a shimmering tower in the distance.  As you rush towards it, it vanishes completely.  It was a mirage!   You sigh, depressed at wasting your time.', true );
		EngineCore.dynStats( 'lus', -15 );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	Desert.prototype.walkingDesertStatBoost = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You walk through the shifting sands for an hour, finding nothing.\n\n', true );
		//Chance of boost === 50%
		if( Utils.rand( 2 ) === 0 ) {
			//50/50 strength/toughness
			if( Utils.rand( 2 ) === 0 && CoC.getInstance().player.str < 50 ) {
				EngineCore.outputText( 'The effort of struggling with the uncertain footing has made you stronger.', false );
				EngineCore.dynStats( 'str', 0.5 );
			}
			//Toughness
			else if( CoC.getInstance().player.tou < 50 ) {
				EngineCore.outputText( 'The effort of struggling with the uncertain footing has made you tougher.', false );
				EngineCore.dynStats( 'tou', 0.5 );
			}
		}
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	CoC.getInstance().registerScene( 'desert', new Desert() );
} );