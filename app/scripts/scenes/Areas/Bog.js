'use strict';

angular.module( 'cocjs' ).run( function( CoC, Utils, EngineCore, Fera, kFLAGS, OnLoadVariables ) {
	function Bog() {
	}

	Bog.prototype.exploreBog = function() {
		CoC.getInstance().flags[ kFLAGS.BOG_EXPLORED ]++;
		//Helia monogamy fucks
		if( CoC.getInstance().flags[ kFLAGS.PC_PROMISED_HEL_MONOGAMY_FUCKS ] === 1 && CoC.getInstance().flags[ kFLAGS.HEL_RAPED_TODAY ] === 0 && Utils.rand( 10 ) === 0 && CoC.getInstance().player.gender > 0 && !CoC.getInstance().scenes.helFollower.followerHel() ) {
			CoC.getInstance().scenes.helScene.helSexualAmbush();
			return;
		}
		if( (Fera.isHalloween() && (OnLoadVariables.date.fullYear > CoC.getInstance().flags[ kFLAGS.TREACLE_MINE_YEAR_DONE ]) && CoC.getInstance().flags[ kFLAGS.BOG_EXPLORED ] % 4 === 0) && (CoC.getInstance().flags[ kFLAGS.PHOUKA_LORE ] > 0) ) {
			CoC.getInstance().scenes.phoukaScene.phoukaHalloween(); //Must have met them enough times to know what they're called, have some idea of their normal behaviour
			return;
		}
		if( CoC.getInstance().player.buttPregnancyIncubation === 0 && Utils.rand( 3 ) === 0 ) {
			CoC.getInstance().scenes.frogGirlScene.findTheFrogGirl();
		} else if( Utils.rand( 3 ) === 0 ) {
			CoC.getInstance().scenes.phoukaScene.phoukaEncounter();
		} else if( Utils.rand( 2 ) === 0 ) {
			CoC.getInstance().scenes.chameleonGirlScene.encounterChameleon();
		} else {
			EngineCore.clearOutput();
			EngineCore.outputText( 'You wander around through the humid muck, but you don\'t run into anything interesting.' );
			EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
		}
	};
	CoC.getInstance().registerScene( 'bog', new Bog() );
} );