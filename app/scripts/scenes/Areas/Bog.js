'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, MainView, CoC, Utils, EngineCore, kFLAGS, OnLoadVariables ) {
	function Bog() {
	}

	Bog.prototype.exploreBog = function() {
		CoC.flags[ kFLAGS.BOG_EXPLORED ]++;
		//Helia monogamy fucks
		if( CoC.flags[ kFLAGS.PC_PROMISED_HEL_MONOGAMY_FUCKS ] === 1 && CoC.flags[ kFLAGS.HEL_RAPED_TODAY ] === 0 && Utils.rand( 10 ) === 0 && CoC.player.gender > 0 && !SceneLib.helFollower.followerHel() ) {
			SceneLib.helScene.helSexualAmbush();
			return;
		}
		if( (SceneLib.fera.isHalloween() && (OnLoadVariables.date.fullYear > CoC.flags[ kFLAGS.TREACLE_MINE_YEAR_DONE ]) && CoC.flags[ kFLAGS.BOG_EXPLORED ] % 4 === 0) && (CoC.flags[ kFLAGS.PHOUKA_LORE ] > 0) ) {
			SceneLib.phoukaScene.phoukaHalloween(); //Must have met them enough times to know what they're called, have some idea of their normal behaviour
			return;
		}
		if( CoC.player.buttPregnancyIncubation === 0 && Utils.rand( 3 ) === 0 ) {
			SceneLib.frogGirlScene.findTheFrogGirl();
		} else if( Utils.rand( 3 ) === 0 ) {
			SceneLib.phoukaScene.phoukaEncounter();
		} else if( Utils.rand( 2 ) === 0 ) {
			SceneLib.chameleonGirlScene.encounterChameleon();
		} else {
			MainView.clearOutput();
			MainView.outputText( 'You wander around through the humid muck, but you don\'t run into anything interesting.' );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		}
	};
	SceneLib.registerScene( 'bog', new Bog() );
} );