'use strict';

angular.module( 'cocjs' ).run( function( CoC, kFLAGS, Utils, StatusAffects, PregnancyStore, EngineCore, EventParser ) {
	function Swamp() {
	}

	Swamp.prototype.exploreSwamp = function() {
		//Discover 'Bog' at after 25 explores of swamp
		if( (CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00272 ] >= 25) && CoC.getInstance().flags[ kFLAGS.BOG_EXPLORED ] === 0 ) {
			EngineCore.outputText( 'While exploring the swamps, you find yourself into a particularly dark, humid area of this already fetid biome.  You judge that you could find your way back here pretty easily in the future, if you wanted to.  With your newfound discovery fresh in your mind, you return to camp.\n\n(<b>Bog exploration location unlocked! (Page 2)</b>)', true );
			CoC.getInstance().flags[ kFLAGS.BOG_EXPLORED ]++;
			EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
			return;
		}
		CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00272 ]++;
		/*  SPECIAL SCENE OVERWRITES */
		//KIHA X HEL THREESOME!
		if( !CoC.getInstance().scenes.kihaFollower.followerKiha() && CoC.getInstance().player.cor < 60 && CoC.getInstance().flags[ kFLAGS.KIHA_AFFECTION_LEVEL ] >= 1 && CoC.getInstance().flags[ kFLAGS.HEL_FUCKBUDDY ] > 0 && CoC.getInstance().player.hasCock() && CoC.getInstance().flags[ kFLAGS.KIHA_AND_HEL_WHOOPIE ] === 0 ) {
			CoC.getInstance().scenes.kihaFollower.kihaXSalamander();
			return;
		}
		//Helia monogamy fucks
		if( CoC.getInstance().flags[ kFLAGS.PC_PROMISED_HEL_MONOGAMY_FUCKS ] === 1 && CoC.getInstance().flags[ kFLAGS.HEL_RAPED_TODAY ] === 0 && Utils.rand( 10 ) === 0 && CoC.getInstance().player.gender > 0 && !CoC.getInstance().scenes.helFollower.followerHel() ) {
			CoC.getInstance().scenes.helScene.helSexualAmbush();
			return;
		}
		if( CoC.getInstance().flags[ kFLAGS.TOOK_EMBER_EGG ] === 0 && CoC.getInstance().flags[ kFLAGS.EGG_BROKEN ] === 0 && CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00272 ] > 0 && (CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00272 ] % 40 === 0) ) {
			CoC.getInstance().scenes.emberScene.findEmbersEgg();
			return;
		}
		/*  STANDARD SCENE SELECTION  */
		var choices = [];
		//Build the choice array
		//M & F spidermorphs
		choices[ choices.length ] = 0;
		choices[ choices.length ] = 1;
		//Drider
		choices[ choices.length ] = 2;
		//ROGAR
		if( CoC.getInstance().flags[ kFLAGS.ROGAR_DISABLED ] === 0 && CoC.getInstance().flags[ kFLAGS.ROGAR_PHASE ] < 3 ) {
			choices[ choices.length ] = 3;
		}
		//Kiha
		choices[ choices.length ] = 4;
		//Pick from the choices and pull the encounter.
		var choice = choices[ Utils.rand( choices.length ) ];
		switch( choice ) {
			case 0:
				CoC.getInstance().scenes.femaleSpiderMorphScene.fSpiderMorphGreeting();
				break;
			case 1:
				CoC.getInstance().scenes.maleSpiderMorphScene.greetMaleSpiderMorph();
				break;
			case 2:
				CoC.getInstance().scenes.corruptedDriderScene.driderEncounter();
				break;
			case 3:
				CoC.getInstance().scenes.rogar.encounterRogarSwamp();
				break;
			case 4:
				//Kiha follower gets to explore her territory!
				if( CoC.getInstance().scenes.kihaFollower.followerKiha() ) {
					CoC.getInstance().scenes.kihaScene.kihaExplore();
				} else {
					CoC.getInstance().scenes.kihaScene.encounterKiha();
				}
				break;
			default:
				EngineCore.outputText( 'New explore code fucked up.  YOU BONED (TELL FEN)' );
				EngineCore.doNext( EventParser.playerMenu );
				break;
		}
	};
	CoC.getInstance().registerScene( 'swamp', new Swamp() );
} );