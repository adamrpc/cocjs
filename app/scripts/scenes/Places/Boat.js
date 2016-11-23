'use strict';

angular.module( 'cocjs' ).run( function( StatusAffects, Utils, CoC, kFLAGS, EngineCore ) {
	function Boat() {
	}

	Boat.prototype.discoverBoat = function() {
		CoC.getInstance().player.createStatusAffect( StatusAffects.BoatDiscovery, 0, 0, 0, 0 );
		EngineCore.outputText( 'You journey around the lake, seeking demons to fight', true );
		if( CoC.getInstance().player.cor > 60 ) {
			EngineCore.outputText( ' or fuck', false );
		}
		EngineCore.outputText( '.  The air is fresh, and the grass is cool and soft under your feet.   Soft waves lap against the muddy sand of the lake-shore, as if radiating outward from the lake.   You pass around a few bushes carefully, being wary of hidden \'surprises\', and come upon a small dock.  The dock is crafted from old growth trees lashed together with some crude rope.  Judging by the appearance of the rope, it is very old and has not been seen to in quite some time.  Tied to the dock is a small rowboat, only about seven feet long and three feet wide.   The boat appears in much better condition than the dock, and appears to be brand new.\n\n', false );
		EngineCore.outputText( '<b>You have discovered the lake boat!</b>\n(You may return and use the boat to explore the lake\'s interior by using the \'places\' menu.)', false );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	Boat.prototype.boatExplore = function() {
		//Helia monogamy fucks;
		if( CoC.getInstance().flags[ kFLAGS.PC_PROMISED_HEL_MONOGAMY_FUCKS ] === 1 && CoC.getInstance().flags[ kFLAGS.HEL_RAPED_TODAY ] === 0 && Utils.rand( 10 ) === 0 && CoC.getInstance().player.gender > 0 && !CoC.getInstance().scenes.helScene.followerHel() ) {
			CoC.getInstance().scenes.helScene.helSexualAmbush();
			return;
		}
		EngineCore.outputText( 'You reach the dock without any incident and board the small rowboat.  The water is calm and placid, perfect for rowing.  ', true );
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.FactoryOverload ) >= 0 ) {
			EngineCore.outputText( 'The water appears somewhat muddy and has a faint pungent odor.  ', false );
			if( CoC.getInstance().player.inte > 40 ) {
				EngineCore.outputText( 'You realize what it smells like – sex.  ', false );
			}
		}
		//3% chance of finding lost daughters;
		if( Utils.rand( 100 ) <= 3 && CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00412 ] > 0 && CoC.getInstance().scenes.izmaScene.izmaFollower() ) {
			CoC.getInstance().scenes.izmaScene.findLostIzmaKids();
			return;
		}
		EngineCore.outputText( 'You set out, wondering if you\'ll find any strange islands or creatures in the lake.\n\n', false );
		//20% chance if not done with marae of meeting her.;
		if( Utils.rand( 10 ) <= 2 && CoC.getInstance().player.findStatusAffect( StatusAffects.MaraeComplete ) < 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.MetCorruptMarae ) < 0 ) {
			CoC.getInstance().scenes.marae.encounterMarae();
			return;
		}
		//10% chance of corrupt Marae followups;
		if( Utils.rand( 10 ) === 0 && CoC.getInstance().flags[ kFLAGS.CORRUPT_MARAE_FOLLOWUP_ENCOUNTER_STATE ] === 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.MetCorruptMarae ) >= 0 && CoC.getInstance().player.gender > 0 ) {
			CoC.getInstance().scenes.marae.level2MaraeEncounter();
			return;
		}
		//BUILD LIST OF CHOICES;
		var choice = [ 0, 1, 2, 3 ];
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.DungeonShutDown ) >= 0 && CoC.getInstance().player.level > 2 ) {
			choice[ choice.length ] = 4;
		}
		choice[ choice.length ] = 5;
		//MAKE YOUR CHOICE;
		var selector = choice[ Utils.rand( choice.length ) ];
		//RUN CHOSEN EVENT;
		switch( selector ) {
			case 0:
				EngineCore.outputText( 'You row for nearly an hour, until your arms practically burn with exhaustion from all the rowing.', false );
				EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
				return;
			case 1:
				EngineCore.outputText( 'You give up on finding anything interesting, and decide to go check up on your camp.', false );
				EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
				return;
			case 2:
				CoC.getInstance().scenes.sharkGirlScene.sharkGirlEncounter( 1 );
				return;
			case 3:
				CoC.getInstance().scenes.sharkGirlScene.sharkGirlEncounter( 1 );
				return;
			case 4:
				CoC.getInstance().scenes.fetishZealotScene.zealotBoat();
				return;
			case 5:
				CoC.getInstance().scenes.anemoneScene.mortalAnemoneeeeee();
				return;
		}
	};
	CoC.getInstance().registerScene( 'boat', new Boat() );
} );