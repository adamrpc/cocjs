'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, StatusAffects, Utils, CoC, kFLAGS, EngineCore ) {
	function Boat() {
	}

	Boat.prototype.discoverBoat = function() {
		CoC.player.createStatusAffect( StatusAffects.BoatDiscovery, 0, 0, 0, 0 );
		EngineCore.outputText( 'You journey around the lake, seeking demons to fight', true );
		if( CoC.player.cor > 60 ) {
			EngineCore.outputText( ' or fuck', false );
		}
		EngineCore.outputText( '.  The air is fresh, and the grass is cool and soft under your feet.   Soft waves lap against the muddy sand of the lake-shore, as if radiating outward from the lake.   You pass around a few bushes carefully, being wary of hidden \'surprises\', and come upon a small dock.  The dock is crafted from old growth trees lashed together with some crude rope.  Judging by the appearance of the rope, it is very old and has not been seen to in quite some time.  Tied to the dock is a small rowboat, only about seven feet long and three feet wide.   The boat appears in much better condition than the dock, and appears to be brand new.\n\n', false );
		EngineCore.outputText( '<b>You have discovered the lake boat!</b>\n(You may return and use the boat to explore the lake\'s interior by using the \'places\' menu.)', false );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	Boat.prototype.boatExplore = function() {
		//Helia monogamy fucks;
		if( CoC.flags[ kFLAGS.PC_PROMISED_HEL_MONOGAMY_FUCKS ] === 1 && CoC.flags[ kFLAGS.HEL_RAPED_TODAY ] === 0 && Utils.rand( 10 ) === 0 && CoC.player.gender > 0 && !SceneLib.helScene.followerHel() ) {
			SceneLib.helScene.helSexualAmbush();
			return;
		}
		EngineCore.outputText( 'You reach the dock without any incident and board the small rowboat.  The water is calm and placid, perfect for rowing.  ', true );
		if( CoC.player.findStatusAffect( StatusAffects.FactoryOverload ) >= 0 ) {
			EngineCore.outputText( 'The water appears somewhat muddy and has a faint pungent odor.  ', false );
			if( CoC.player.inte > 40 ) {
				EngineCore.outputText( 'You realize what it smells like – sex.  ', false );
			}
		}
		//3% chance of finding lost daughters;
		if( Utils.rand( 100 ) <= 3 && CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00412 ] > 0 && SceneLib.izmaScene.izmaFollower() ) {
			SceneLib.izmaScene.findLostIzmaKids();
			return;
		}
		EngineCore.outputText( 'You set out, wondering if you\'ll find any strange islands or creatures in the lake.\n\n', false );
		//20% chance if not done with marae of meeting her.;
		if( Utils.rand( 10 ) <= 2 && CoC.player.findStatusAffect( StatusAffects.MaraeComplete ) < 0 && CoC.player.findStatusAffect( StatusAffects.MetCorruptMarae ) < 0 ) {
			SceneLib.marae.encounterMarae();
			return;
		}
		//10% chance of corrupt Marae followups;
		if( Utils.rand( 10 ) === 0 && CoC.flags[ kFLAGS.CORRUPT_MARAE_FOLLOWUP_ENCOUNTER_STATE ] === 0 && CoC.player.findStatusAffect( StatusAffects.MetCorruptMarae ) >= 0 && CoC.player.gender > 0 ) {
			SceneLib.marae.level2MaraeEncounter();
			return;
		}
		//BUILD LIST OF CHOICES;
		var choice = [ 0, 1, 2, 3 ];
		if( CoC.player.findStatusAffect( StatusAffects.DungeonShutDown ) >= 0 && CoC.player.level > 2 ) {
			choice[ choice.length ] = 4;
		}
		choice[ choice.length ] = 5;
		//MAKE YOUR CHOICE;
		var selector = choice[ Utils.rand( choice.length ) ];
		//RUN CHOSEN EVENT;
		switch( selector ) {
			case 0:
				EngineCore.outputText( 'You row for nearly an hour, until your arms practically burn with exhaustion from all the rowing.', false );
				EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
				return;
			case 1:
				EngineCore.outputText( 'You give up on finding anything interesting, and decide to go check up on your camp.', false );
				EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
				return;
			case 2:
				SceneLib.sharkGirlScene.sharkGirlEncounter( 1 );
				return;
			case 3:
				SceneLib.sharkGirlScene.sharkGirlEncounter( 1 );
				return;
			case 4:
				SceneLib.fetishZealotScene.zealotBoat();
				return;
			case 5:
				SceneLib.anemoneScene.mortalAnemoneeeeee();
				return;
		}
	};
	SceneLib.registerScene( 'boat', new Boat() );
} );