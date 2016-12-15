'use strict';

angular.module( 'cocjs' ).run( function( MainView, SceneLib, $log, CoC, Utils, EngineCore, kFLAGS, PerkLib, ConsumableLib, Combat, Harpy ) {
	function HighMountains() {
	}
	//Explore High Mountain
	HighMountains.prototype.exploreHighMountain = function() {
		CoC.flags[ kFLAGS.DISCOVERED_HIGH_MOUNTAIN ]++;
		EngineCore.doNext( MainView, MainView.playerMenu );
		if( SceneLib.d3.discoverD3() === true ) {
			return;
		}
		var chooser = Utils.rand( 4 );
		//Boosts mino and hellhound rates!
		if( CoC.player.findPerk( PerkLib.PiercedFurrite ) >= 0 && Utils.rand( 3 ) === 0 ) {
			chooser = 1;
		}
		//Helia monogamy fucks
		if( CoC.flags[ kFLAGS.PC_PROMISED_HEL_MONOGAMY_FUCKS ] === 1 && CoC.flags[ kFLAGS.HEL_RAPED_TODAY ] === 0 && Utils.rand( 10 ) === 0 && CoC.player.gender > 0 && !SceneLib.helScene.followerHel() ) {
			SceneLib.helScene.helSexualAmbush();
			return;
		}
		//Gats xmas adventure!
		if( Utils.rand( 5 ) === 0 && CoC.player.gender > 0 && SceneLib.xmasBitch.isHolidays() && CoC.flags[ kFLAGS.GATS_ANGEL_DISABLED ] === 0 && CoC.flags[ kFLAGS.GATS_ANGEL_GOOD_ENDED ] === 0 && (CoC.flags[ kFLAGS.GATS_ANGEL_QUEST_BEGAN ] === 0 || CoC.player.hasKeyItem( 'North Star Key' ) >= 0) ) {
			SceneLib.xmasGatsNotAnAngel.gatsSpectacularRouter();
			return;
		}
		//Minerva
		if( CoC.flags[ kFLAGS.DISCOVERED_HIGH_MOUNTAIN ] % 8 === 0 && CoC.flags[ kFLAGS.MET_MINERVA ] < 4 ) {
			SceneLib.minervaScene.encounterMinerva();
			return;
		}
		//25% minotaur sons!
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00326 ] >= 3 && Utils.rand( 4 ) === 0 && CoC.player.hasVagina() ) {
			EngineCore.spriteSelect( 44 );
			SceneLib.minotaurMobScene.meetMinotaurSons();
			return;
		}
		//Harpy odds!
		if( CoC.player.hasItem( ConsumableLib.OVIELIX ) ) {
			if( CoC.player.hasItem( ConsumableLib.OVIELIX, 2 ) ) {
				if( Utils.rand( 4 ) === 0 ) {
					this.chickenHarpy();
					return;
				}
			} else {
				if( Utils.rand( 10 ) === 0 ) {
					this.chickenHarpy();
					return;
				}
			}
		}
		//10% chance to mino encounter rate if addicted
		if( CoC.flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_STATE ] > 0 && Utils.rand( 10 ) === 0 ) {
			EngineCore.spriteSelect( 44 );
			//Cum addictus interruptus!  LOL HARRY POTTERFAG
			//Withdrawl auto-fuck!
			if( CoC.flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_STATE ] === 3 ) {
				SceneLib.minotaurScene.minoAddictionFuck();
				return;
			}
			SceneLib.minotaurScene.getRapedByMinotaur( true );
			EngineCore.spriteSelect( 44 );
			return;
		}
		$log.debug( 'Chooser goin for' + chooser );
		//Generic harpy
		if( chooser === 0 ) {
			EngineCore.outputText( 'A harpy wings out of the sky and attacks!', true );
			Combat.startCombat( new Harpy() );
			EngineCore.spriteSelect( 26 );
			return;
		}
		//Basilisk!
		if( chooser === 1 ) {
			SceneLib.basiliskScene.basiliskGreeting();
			return;
		}
		//Sophie
		if( chooser === 2 ) {
			if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00282 ] > 0 || CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00283 ] > 0 ||
				SceneLib.sophieFollowerScene.sophieFollower() ) {
				EngineCore.outputText( 'A harpy wings out of the sky and attacks!', true );
				Combat.startCombat( new Harpy() );
				EngineCore.spriteSelect( 26 );
			} else {
				if( CoC.flags[ kFLAGS.MET_SOPHIE_COUNTER ] === 0 ) {
					SceneLib.sophieScene.meetSophie();
				} else {
					SceneLib.sophieScene.meetSophieRepeat();
				}
			}
		}
		if( chooser === 3 ) {
			SceneLib.izumiScene.encounter();
		}
	};
	//"<i>Chicken Harpy</i>" by Jay Gatsby and not Savin he didn't do ANYTHING
	//Initial Intro
	HighMountains.prototype.chickenHarpy = function() {
		MainView.clearOutput();
		EngineCore.spriteSelect( 90 );
		if( CoC.flags[ kFLAGS.TIMES_MET_CHICKEN_HARPY ] === 0 ) {
			EngineCore.outputText( 'Taking a stroll along the mountains, you come across a peculiar-looking harpy wandering around with a large wooden cart in tow.  She\'s far shorter and bustier than any regular harpy you\'ve seen before, reaching barely 4\' in height but managing to retain some semblance of their thick feminine asses.  In addition to the fluffy white feathers decorating her body, the bird-woman sports about three more combed back upon her forehead like a quiff, vividly red in color.' );
			EngineCore.outputText( '\n\nHaving a long, hard think at the person you\'re currently making uncomfortable with your observational glare, you\'ve come to a conclusion - she must be a chicken harpy!' );
			EngineCore.outputText( '\n\nAs you take a look inside of the cart you immediately spot a large hoard of eggs stacked clumsily in a pile.  The curious collection of eggs come in many colors and sizes, protected by a sheet of strong canvas to keep it all together.' );
			EngineCore.outputText( '\n\nThe chicken harpy - rather unnerved by the unflattering narration of her appearance you\'ve accidentally shouted out loud - decides to break the ice by telling you about the cart currently holding your interest.' );
			EngineCore.outputText( '\n\n"<i>Heya traveller, I noticed you were interested in my eggs here - they\'re not for sale, but perhaps we can come to some sort of agreement?</i>"' );
			EngineCore.outputText( '\n\nYou put a hand to your chin and nod.  You are travelling, that\'s correct. The chicken harpy takes the gesture as a sign to continue.' );
			EngineCore.outputText( '\n\n"<i>Well you see, these eggs don\'t really grow from trees - in fact, I\'ve gotta chug down at least two or three ovi elixirs to get a good haul with my body, y\'know?  Since it\'s tough for a lil\' gal like me to find a few, I like to trade an egg over for some elixirs to those willing to part with them.</i>"' );
			EngineCore.outputText( '\n\nSounds reasonable enough, you suppose.  Two or three elixirs for an egg? Doable for sure.' );
			EngineCore.outputText( '\n\n"<i>So whaddya say, do y\'have any elixirs you can fork over?</i>"' );
		} else {
			//Repeat Intro
			EngineCore.outputText( 'Taking a stroll along the mountains, you come across a familiar-looking shorty wandering around with a large wooden cart in tow.' );
			EngineCore.outputText( '\n\nHaving a long, hard think at the person you\'re currently making uncomfortable with your observational glare, you\'ve come to a conclusion - she must be the chicken harpy!' );
			EngineCore.outputText( '\n\nYou run towards her as she waves a \'hello\', stopping the cart to allow you to catch up.  Giving out her usual spiel about the eggs, she giggles and thrusts out a hand.' );
			EngineCore.outputText( '\n\n"<i>Hey sunshine, do y\'have any elixirs you can give me today?</i>"' );
			//[Give Two][Give Three]	[No, I Must Now Return To My People]
		}
		CoC.flags[ kFLAGS.TIMES_MET_CHICKEN_HARPY ]++;
		//[Give Two][Give Three]		[Not Really, No]
		EngineCore.menu();
		if( CoC.player.hasItem( ConsumableLib.OVIELIX, 2 ) ) {
			EngineCore.addButton( 0, 'Give Two', this, this.giveTwoOviElix );
		}
		if( CoC.player.hasItem( ConsumableLib.OVIELIX, 3 ) ) {
			EngineCore.addButton( 1, 'Give Three', this, this.giveThreeOviElix );
		}
		EngineCore.addButton( 4, 'Leave', this, this.leaveChickenx );
	};
	//If Give Two
	HighMountains.prototype.giveTwoOviElix = function() {
		MainView.clearOutput();
		EngineCore.spriteSelect( 90 );
		CoC.player.consumeItem( ConsumableLib.OVIELIX );
		CoC.player.consumeItem( ConsumableLib.OVIELIX );
		EngineCore.outputText( 'You hand over two elixirs, the harpy more than happy to take them from you.  In return, she unties a corner of the sheet atop the cart, allowing you to take a look at her collection of eggs.' );
		//[Black][Blue][Brown][Pink][Purple]
		EngineCore.menu();
		EngineCore.addButton( 0, 'Black', this, this.getHarpyEgg, ConsumableLib.BLACKEG );
		EngineCore.addButton( 1, 'Blue', this, this.getHarpyEgg, ConsumableLib.BLUEEGG );
		EngineCore.addButton( 2, 'Brown', this, this.getHarpyEgg, ConsumableLib.BROWNEG );
		EngineCore.addButton( 3, 'Pink', this, this.getHarpyEgg, ConsumableLib.PINKEGG );
		EngineCore.addButton( 4, 'Purple', this, this.getHarpyEgg, ConsumableLib.PURPLEG );
		EngineCore.addButton( 5, 'White', this, this.getHarpyEgg, ConsumableLib.WHITEEG );
	};
	//If Give Three
	HighMountains.prototype.giveThreeOviElix = function() {
		MainView.clearOutput();
		EngineCore.spriteSelect( 90 );
		CoC.player.consumeItem( ConsumableLib.OVIELIX, 3 );
		EngineCore.outputText( 'You hand over three elixirs, the harpy ecstatic over the fact that you\'re willing to part with them.  In return, she unties a side of the sheet atop the cart, allowing you to take a look at a large collection of her eggs.' );
		//[Black][Blue][Brown][Pink][Purple]
		EngineCore.menu();
		EngineCore.addButton( 0, 'Black', this, this.getHarpyEgg, ConsumableLib.L_BLKEG );
		EngineCore.addButton( 1, 'Blue', this, this.getHarpyEgg, ConsumableLib.L_BLUEG );
		EngineCore.addButton( 2, 'Brown', this, this.getHarpyEgg, ConsumableLib.L_BRNEG );
		EngineCore.addButton( 3, 'Pink', this, this.getHarpyEgg, ConsumableLib.L_PNKEG );
		EngineCore.addButton( 4, 'Purple', this, this.getHarpyEgg, ConsumableLib.L_PRPEG );
		EngineCore.addButton( 5, 'White', this, this.getHarpyEgg, ConsumableLib.L_WHTEG );
	};
	//All Text
	HighMountains.prototype.getHarpyEgg = function( itype ) {
		MainView.clearOutput();
		EngineCore.spriteSelect( 90 );
		CoC.flags[ kFLAGS.EGGS_BOUGHT ]++;
		EngineCore.outputText( 'You take ' + itype.longName + ', and the harpy nods in regards to your decision.  Prepping her cart back up for the road, she gives you a final wave goodbye before heading back down through the mountains.\n\n' );
		SceneLib.inventory.takeItem( itype, this.chickenHarpy );
	};
	//If No
	HighMountains.prototype.leaveChickenx = function() {
		MainView.clearOutput();
		EngineCore.spriteSelect( 90 );
		EngineCore.outputText( 'At the polite decline of her offer, the chicken harpy gives a warm smile before picking her cart back up and continuing along the path through the mountains.' );
		EngineCore.outputText( '\n\nYou decide to take your own path, heading back to camp while you can.' );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	SceneLib.registerScene( 'highMountains', new HighMountains() );
});