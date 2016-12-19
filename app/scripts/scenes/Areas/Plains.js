'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, MainView, CoC, kFLAGS, Utils, EngineCore, OnLoadVariables, ConsumableLib ) {
	function Plains() {
	}

	Plains.prototype.explorePlains = function() {
		MainView.outputText( '', true );
		CoC.flags[ kFLAGS.TIMES_EXPLORED_PLAINS ]++;
		//Dem Kangasluts!  Force Sheila relationship phase!
		if( CoC.flags[ kFLAGS.SHEILA_DEMON ] === 0 && CoC.flags[ kFLAGS.SHEILA_XP ] === 3 && CoC.time.hours === 20 && CoC.flags[ kFLAGS.SHEILA_CLOCK ] >= 0 ) {
			SceneLib.sheilaScene.sheilaXPThreeSexyTime();
			return;
		}
		//Add some holiday cheer
		if( SceneLib.xmasBitch.isHolidays() && OnLoadVariables.date.fullYear > CoC.flags[ kFLAGS.CANDY_CANE_YEAR_MET ] && Utils.rand( 5 ) === 0 ) {
			SceneLib.xmasMisc.candyCaneTrapDiscovery();
			return;
		}
		if( SceneLib.xmasBitch.isHolidays() && OnLoadVariables.date.fullYear > CoC.flags[ kFLAGS.POLAR_PETE_YEAR_MET ] && Utils.rand( 4 ) === 0 && EngineCore.silly() ) {
			SceneLib.xmasMisc.polarPete();
			CoC.flags[ kFLAGS.POLAR_PETE_YEAR_MET ] = OnLoadVariables.date.fullYear;
			return;
		}
		//Helia monogamy fucks
		if( CoC.flags[ kFLAGS.PC_PROMISED_HEL_MONOGAMY_FUCKS ] === 1 && CoC.flags[ kFLAGS.HEL_RAPED_TODAY ] === 0 && Utils.rand( 10 ) === 0 && CoC.player.gender > 0 && !SceneLib.helScene.followerHel() ) {
			SceneLib.helScene.helSexualAmbush();
			return;
		}
		//Find Niamh
		if( CoC.flags[ kFLAGS.NIAMH_MOVED_OUT_COUNTER ] === 1 ) {
			SceneLib.niamh.niamhPostTelAdreMoveOut();
			return;
		}
		//Find Owca
		if( CoC.player.level >= 8 && CoC.flags[ kFLAGS.TIMES_EXPLORED_PLAINS ] % 25 === 0 && CoC.flags[ kFLAGS.OWCA_UNLOCKED ] === 0 ) {
			SceneLib.owca.gangbangVillageStuff();
			return;
		}
		//Bazaar!
		if( CoC.flags[ kFLAGS.TIMES_EXPLORED_PLAINS ] % 10 === 0 && CoC.flags[ kFLAGS.BAZAAR_ENTERED ] === 0 ) {
			SceneLib.bazaar.findBazaar();
			return;
		}
		//Chance of threesomes!
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00256 ] !== 0 && CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00257 ] !== 0 && CoC.flags[ kFLAGS.HEL_FUCKBUDDY ] === 1 && CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00260 ] === 0 && !SceneLib.isabellaFollowerScene.isabellaFollower() && CoC.flags[ kFLAGS.TIMES_EXPLORED_PLAINS ] % 21 === 0 && !(CoC.player.tallness > 78 && CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00258 ] === 0) ) {
			//Hell/Izzy threesome intro
			if( CoC.flags[ kFLAGS.HEL_ISABELLA_THREESOME_ENABLED ] === 0 ) {
				SceneLib.helScene.salamanderXIsabellaPlainsIntro();
				return;
			}
			//Propah threesomes here!
			else if( CoC.flags[ kFLAGS.HEL_ISABELLA_THREESOME_ENABLED ] === 1 ) {
				SceneLib.helScene.isabellaXHelThreeSomePlainsStart();
				return;
			}
		}
		var choices = [ this.plainsLoot, this.plainsLoot,
			SceneLib.gnollSpearThrowerScene.gnoll2Encounter,
			SceneLib.gnollScene.gnollEncounter,
			SceneLib.bunnyGirl.bunnbunbunMeet, SceneLib.bunnyGirl.bunnbunbunMeet ];
		if( CoC.flags[ kFLAGS.ISABELLA_PLAINS_DISABLED ] === 0 ) {
			choices[ choices.length ] = SceneLib.isabellaScene.isabellaGreeting;
			choices[ choices.length ] = SceneLib.isabellaScene.isabellaGreeting;
		}
		if( !SceneLib.helScene.followerHel() ) {
			choices[ choices.length ] = SceneLib.helScene.encounterAJerkInThePlains;
			choices[ choices.length ] = SceneLib.helScene.encounterAJerkInThePlains;
		}
		choices[ choices.length ] = SceneLib.satyrScene.satyrEncounter;
		choices[ choices.length ] = SceneLib.satyrScene.satyrEncounter;
		if( CoC.flags[ kFLAGS.SHEILA_DISABLED ] === 0 && CoC.flags[ kFLAGS.SHEILA_CLOCK ] >= 0 ) { //Aparently Sheila was supposed to be disabled after certain events - now fixed
			choices[ choices.length ] = SceneLib.sheilaScene.sheilaEncounterRouter;
			choices[ choices.length ] = SceneLib.sheilaScene.sheilaEncounterRouter;
		}
		//Pick one
		choices[ Utils.rand( choices.length ) ]();
	};
	Plains.prototype.plainsLoot = function() {
		if( Utils.rand( 2 ) === 0 ) { //OVI
			MainView.outputText( 'While exploring the plains you nearly trip over a discarded, hexagonal bottle.  ' );
			SceneLib.inventory.takeItem( ConsumableLib.OVIELIX, SceneLib.camp.returnToCampUseOneHour );
		} else { //FIND KANGAAA
			MainView.outputText( 'While exploring the plains you come across a strange-looking plant.  As you peer at it, you realize it has some fruit you can get at.  ' );
			SceneLib.inventory.takeItem( ConsumableLib.KANGAFT, SceneLib.camp.returnToCampUseOneHour );
		}
	};
	SceneLib.registerScene( 'plains', new Plains() );
} );