﻿'use strict';

angular.module( 'cocjs' ).run( function( $log, CoC, EngineCore, OnLoadVariables, EventParser, MainView, StatusAffects, kFLAGS, XmasJackFrost, XmasMisc, Utils, PregnancyStore, ConsumableLib, StartUp, ImageManager, PerkLib, Descriptors ) {
	function Camp() {
		this.campQ = false;
	}
	Camp.prototype.hasItemInStorage = function( itype ) {
		return CoC.getInstance().inventory.hasItemInStorage( itype );
	};
	Camp.prototype.returnToCamp = function( timeUsed ) {
		EngineCore.clearOutput();
		if( timeUsed === 1 ) {
			EngineCore.outputText( 'An hour passes...\n' );
		} else {
			EngineCore.outputText( Utils.num2Text( timeUsed ) + ' hours pass...\n' );
		}
		if( !CoC.getInstance().isInCombat() ) {
			EngineCore.spriteSelect( -1 );
		}
		EngineCore.hideMenus();
		OnLoadVariables.timeQ = timeUsed;
		EventParser.goNext( timeUsed, false );
	};
	Camp.prototype.returnToCampUseOneHour = function() {
		this.returnToCamp( 1 );
	}; //Replacement for event number 13;
	Camp.prototype.returnToCampUseTwoHours = function() {
		this.returnToCamp( 2 );
	}; //Replacement for event number 14;
	Camp.prototype.returnToCampUseFourHours = function() {
		this.returnToCamp( 4 );
	}; //Replacement for event number 15;
	Camp.prototype.returnToCampUseEightHours = function() {
		this.returnToCamp( 8 );
	}; //Replacement for event number 16;
	//  SLEEP_WITH = 701;
	Camp.prototype.doCamp = function() { //Only called by playerMenu
		MainView.showMenuButton( MainView.MENU_NEW_MAIN );
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.PostAkbalSubmission ) >= 0 ) {
			CoC.getInstance().player.removeStatusAffect( StatusAffects.PostAkbalSubmission );
			CoC.getInstance().scenes.forest.akbalScene.akbalSubmissionFollowup();
			return;
		}
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.PostAnemoneBeatdown ) >= 0 ) {
			EngineCore.HPChange( Math.round( CoC.getInstance().player.maxHP() / 2 ), false );
			CoC.getInstance().player.removeStatusAffect( StatusAffects.PostAnemoneBeatdown );
		}
		//make sure gameState is cleared if coming from combat or giacomo
		CoC.getInstance().setInCombat( false );
		//Clear out Izma's saved loot status
		CoC.getInstance().flags[ kFLAGS.BONUS_ITEM_AFTER_COMBAT_ID ] = '';
		//History perk backup
		if( CoC.getInstance().flags[ kFLAGS.HISTORY_PERK_SELECTED ] === 0 ) {
			CoC.getInstance().flags[ kFLAGS.HISTORY_PERK_SELECTED ] = 2;
			EngineCore.hideMenus();
			CoC.getInstance().charCreation.chooseHistory();
			return;
		}
		if( !CoC.getInstance().scenes.marbleScene.marbleFollower() ) {
			if( CoC.getInstance().flags[ kFLAGS.MARBLE_LEFT_OVER_CORRUPTION ] === 1 && CoC.getInstance().player.cor <= 40 ) {
				EngineCore.hideMenus();
				CoC.getInstance().scenes.marblePurification.pureMarbleDecidesToBeLessOfABitch();
				return;
			}
		}
		if( CoC.getInstance().scenes.marbleScene.marbleFollower() ) {
			//Cor < 50
			//No corrupt, Amily, or Vapula
			//Purifying Murble
			if( CoC.getInstance().player.cor < 50 && !CoC.getInstance().scenes.jojoScene.campCorruptJojo() && !CoC.getInstance().scenes.amilyScene.amilyCorrupt() && !CoC.getInstance().scenes.vapula.vapulaSlave() && CoC.getInstance().flags[ kFLAGS.MARBLE_PURIFICATION_STAGE ] === 0 && CoC.getInstance().flags[ kFLAGS.MARBLE_COUNTUP_TO_PURIFYING ] >= 200 && CoC.getInstance().player.findPerk( PerkLib.MarblesMilk ) < 0 ) {
				EngineCore.hideMenus();
				CoC.getInstance().scenes.marblePurification.BLUHBLUH();
				return;
			}
			if( CoC.getInstance().flags[ kFLAGS.MARBLE_PURIFICATION_STAGE ] >= 5 ) {
				if( CoC.getInstance().flags[ kFLAGS.MARBLE_WARNED_ABOUT_CORRUPTION ] === 0 && CoC.getInstance().player.cor >= 50 ) {
					EngineCore.hideMenus();
					CoC.getInstance().scenes.marblePurification.marbleWarnsPCAboutCorruption();
					return;
				}
				if( CoC.getInstance().flags[ kFLAGS.MARBLE_WARNED_ABOUT_CORRUPTION ] === 1 && CoC.getInstance().flags[ kFLAGS.MARBLE_LEFT_OVER_CORRUPTION ] === 0 && CoC.getInstance().player.cor >= 60 ) {
					EngineCore.hideMenus();
					CoC.getInstance().scenes.marblePurification.marbleLeavesThePCOverCorruption();
					return;
				}
			}
			if( CoC.getInstance().flags[ kFLAGS.MARBLE_RATHAZUL_COUNTER_1 ] === 1 && (CoC.getInstance().time.hours === 6 || CoC.getInstance().time.hours === 7) ) {
				EngineCore.hideMenus();
				CoC.getInstance().scenes.marblePurification.rathazulsMurbelReport();
				return;
			}
			if( CoC.getInstance().flags[ kFLAGS.MARBLE_RATHAZUL_COUNTER_2 ] === 1 ) {
				EngineCore.hideMenus();
				CoC.getInstance().scenes.marblePurification.claraShowsUpInCampBECAUSESHESACUNT();
				return;
			}
		}
		if( CoC.getInstance().scenes.arianScene.arianFollower() && CoC.getInstance().flags[ kFLAGS.ARIAN_MORNING ] === 1 ) {
			EngineCore.hideMenus();
			CoC.getInstance().scenes.arianScene.wakeUpAfterArianSleep();
			return;
		}
		if( CoC.getInstance().scenes.arianScene.arianFollower() && CoC.getInstance().flags[ kFLAGS.ARIAN_EGG_EVENT ] >= 30 ) {
			EngineCore.hideMenus();
			CoC.getInstance().scenes.arianScene.arianEggingEvent();
			return;
		}
		if( CoC.getInstance().scenes.arianScene.arianFollower() && CoC.getInstance().flags[ kFLAGS.ARIAN_EGG_COUNTER ] >= 24 && CoC.getInstance().flags[ kFLAGS.ARIAN_VAGINA ] > 0 ) {
			EngineCore.hideMenus();
			CoC.getInstance().scenes.arianScene.arianLaysEggs();
			return;
		}
		if( CoC.getInstance().flags[ kFLAGS.JACK_FROST_PROGRESS ] > 0 ) {
			EngineCore.hideMenus();
			XmasJackFrost.processJackFrostEvent();
			return;
		}
		if( CoC.getInstance().player.hasKeyItem( 'Super Reducto' ) < 0 && CoC.getInstance().scenes.milkWaifu.milkSlave() && CoC.getInstance().player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 && CoC.getInstance().player.statusAffectv2( StatusAffects.MetRathazul ) >= 4 ) {
			EngineCore.hideMenus();
			CoC.getInstance().scenes.milkWaifu.ratducto();
			return;
		}
		if( XmasMisc.nieveHoliday() && CoC.getInstance().time.hours === 6 ) {
			if( CoC.getInstance().player.hasKeyItem( 'Nieve\'s Tear' ) >= 0 && CoC.getInstance().flags[ kFLAGS.NIEVE_STAGE ] !== 5 ) {
				XmasMisc.returnOfNieve();
				EngineCore.hideMenus();
				return;
			} else if( CoC.getInstance().flags[ kFLAGS.NIEVE_STAGE ] === 0 ) {
				EngineCore.hideMenus();
				CoC.getInstance().scenes.snowLadyActive.snowLadyActive();
				return;
			} else if( CoC.getInstance().flags[ kFLAGS.NIEVE_STAGE ] === 4 ) {
				EngineCore.hideMenus();
				XmasMisc.nieveComesToLife();
				return;
			}
		}
		if( CoC.getInstance().scenes.helScene.followerHel() ) {
			if( CoC.getInstance().scenes.helFollower.isHeliaBirthday() && CoC.getInstance().flags[ kFLAGS.HEL_FOLLOWER_LEVEL ] >= 2 && CoC.getInstance().flags[ kFLAGS.HELIA_BIRTHDAY_OFFERED ] === 0 ) {
				EngineCore.hideMenus();
				CoC.getInstance().scenes.helFollower.heliasBirthday();
				return;
			}
			if( CoC.getInstance().scenes.helScene.pregnancy.isPregnant ) {
				switch( CoC.getInstance().scenes.helScene.pregnancy.eventTriggered() ) {
					case 2:
						EngineCore.hideMenus();
						CoC.getInstance().scenes.helSpawnScene.bulgyCampNotice();
						return;
					case 3:
						EngineCore.hideMenus();
						CoC.getInstance().scenes.helSpawnScene.heliaSwollenNotice();
						return;
					case 4:
						EngineCore.hideMenus();
						CoC.getInstance().scenes.helSpawnScene.heliaGravidity();
						return;
					default:
						if( CoC.getInstance().scenes.helScene.pregnancy.incubation === 0 && (CoC.getInstance().time.hours === 6 || CoC.getInstance().time.hours === 7) ) {
							EngineCore.hideMenus();
							CoC.getInstance().scenes.helSpawnScene.heliaBirthtime();
							return;
						}
				}
			}
		}
		if( CoC.getInstance().flags[ kFLAGS.HELSPAWN_AGE ] === 1 && CoC.getInstance().flags[ kFLAGS.HELSPAWN_GROWUP_COUNTER ] === 7 ) {
			EngineCore.hideMenus();
			CoC.getInstance().scenes.helSpawnScene.helSpawnGraduation();
			return;
		}
		if( CoC.getInstance().time.hours >= 10 && CoC.getInstance().time.hours <= 18 && (CoC.getInstance().time.days % 20 === 0 || CoC.getInstance().time.hours === 12) && CoC.getInstance().flags[ kFLAGS.HELSPAWN_DADDY ] === 2 && CoC.getInstance().scenes.helSpawnScene.helspawnFollower() ) {
			EngineCore.hideMenus();
			CoC.getInstance().scenes.helSpawnScene.maiVisitsHerKids();
			return;
		}
		if( CoC.getInstance().time.hours === 6 && CoC.getInstance().flags[ kFLAGS.HELSPAWN_DADDY ] === 1 && CoC.getInstance().time.days % 30 === 0 && CoC.getInstance().flags[ kFLAGS.SPIDER_BRO_GIFT ] === 0 && CoC.getInstance().scenes.helSpawnScene.helspawnFollower() ) {
			EngineCore.hideMenus();
			CoC.getInstance().scenes.helSpawnScene.spiderBrosGift();
			return;
		}
		if( CoC.getInstance().time.hours >= 10 && CoC.getInstance().time.hours <= 18 && (CoC.getInstance().time.days % 15 === 0 || CoC.getInstance().time.hours === 12) && CoC.getInstance().scenes.helSpawnScene.helspawnFollower() && CoC.getInstance().flags[ kFLAGS.HAKON_AND_KIRI_VISIT ] === 0 ) {
			EngineCore.hideMenus();
			CoC.getInstance().scenes.helSpawnScene.hakonAndKiriComeVisit();
			return;
		}
		if( CoC.getInstance().flags[ kFLAGS.HELSPAWN_AGE ] === 2 && CoC.getInstance().flags[ kFLAGS.HELSPAWN_DISCOVER_BOOZE ] === 0 && (Utils.rand( 10 ) === 0 || CoC.getInstance().flags[ kFLAGS.HELSPAWN_GROWUP_COUNTER ] === 6) ) {
			EngineCore.hideMenus();
			CoC.getInstance().scenes.helSpawnScene.helspawnDiscoversBooze();
			return;
		}
		if( CoC.getInstance().flags[ kFLAGS.HELSPAWN_AGE ] === 2 && CoC.getInstance().flags[ kFLAGS.HELSPAWN_WEAPON ] === 0 && CoC.getInstance().flags[ kFLAGS.HELSPAWN_GROWUP_COUNTER ] === 3 && CoC.getInstance().time.hours >= 10 && CoC.getInstance().time.hours <= 18 ) {
			EngineCore.hideMenus();
			CoC.getInstance().scenes.helSpawnScene.helSpawnChoosesAFightingStyle();
			return;
		}
		if( CoC.getInstance().flags[ kFLAGS.HELSPAWN_AGE ] === 2 && (CoC.getInstance().time.hours === 6 || CoC.getInstance().time.hours === 7) && CoC.getInstance().flags[ kFLAGS.HELSPAWN_GROWUP_COUNTER ] === 7 && CoC.getInstance().flags[ kFLAGS.HELSPAWN_FUCK_INTERRUPTUS ] === 1 ) {
			CoC.getInstance().scenes.helSpawnScene.helspawnAllGrownUp();
			return;
		}
		if( (CoC.getInstance().scenes.sophieFollowerScene.sophieFollower() || CoC.getInstance().scenes.sophieBimbo.bimboSophie()) && CoC.getInstance().flags[ kFLAGS.SOPHIE_DAUGHTER_MATURITY_COUNTER ] === 1 ) {
			CoC.getInstance().flags[ kFLAGS.SOPHIE_DAUGHTER_MATURITY_COUNTER ] = 0;
			CoC.getInstance().scenes.sophieBimbo.sophieKidMaturation();
			EngineCore.hideMenus();
			return;
		}
		//Bimbo Sophie Move In Request!
		if( CoC.getInstance().scenes.sophieBimbo.bimboSophie() && CoC.getInstance().flags[ kFLAGS.SOPHIE_BROACHED_SLEEP_WITH ] === 0 && CoC.getInstance().scenes.sophieScene.pregnancy.event >= 2 ) {
			EngineCore.hideMenus();
			CoC.getInstance().scenes.sophieBimbo.sophieMoveInAttempt();
			return;
		}
		if( !XmasMisc.nieveHoliday() && CoC.getInstance().time.hours === 6 && CoC.getInstance().flags[ kFLAGS.NIEVE_STAGE ] > 0 ) {
			XmasMisc.nieveIsOver();
			return;
		}
		//Amily followup!
		if( CoC.getInstance().flags[ kFLAGS.PC_PENDING_PREGGERS ] === 1 ) {
			CoC.getInstance().scenes.amilyScene.postBirthingEndChoices();
			CoC.getInstance().flags[ kFLAGS.PC_PENDING_PREGGERS ] = 2;
			return;
		}
		if( OnLoadVariables.timeQ > 0 ) {
			if( !this.campQ ) {
				EngineCore.outputText( 'More time passes...\n', true );
				EventParser.goNext( OnLoadVariables.timeQ, false );
				return;
			} else {
				if( CoC.getInstance().time.hours < 6 || CoC.getInstance().time.hours > 20 ) {
					this.doSleep();
				} else {
					this.rest();
				}
				return;
			}
		}
		if( CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_KILLED ] === 0 && CoC.getInstance().flags[ kFLAGS.CORRUPT_MARAE_FOLLOWUP_ENCOUNTER_STATE ] > 0 ) {
			if( CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_LEVEL ] === 0 && CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_GROWTH_COUNTER ] >= 8 ) {
				CoC.getInstance().scenes.holliScene.getASprout();
				EngineCore.hideMenus();
				return;
			}
			if( CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_LEVEL ] === 1 && CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_GROWTH_COUNTER ] >= 7 ) {
				CoC.getInstance().scenes.holliScene.fuckPlantGrowsToLevel2();
				EngineCore.hideMenus();
				return;
			}
			if( CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_LEVEL ] === 2 && CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_GROWTH_COUNTER ] >= 25 ) {
				CoC.getInstance().scenes.holliScene.flowerGrowsToP3();
				EngineCore.hideMenus();
				return;
			}
			//Level 4 growth
			if( CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_LEVEL ] === 3 && CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_GROWTH_COUNTER ] >= 40 ) {
				CoC.getInstance().scenes.holliScene.treePhaseFourGo();
				EngineCore.hideMenus();
				return;
			}
		}
		//Jojo treeflips!
		if( CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_LEVEL ] >= 4 && CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_KILLED ] === 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.PureCampJojo ) >= 0 ) {
			CoC.getInstance().scenes.holliScene.JojoTransformAndRollOut();
			EngineCore.hideMenus();
			return;
		}
		//Amily flips out
		if( CoC.getInstance().scenes.amilyScene.amilyFollower() && !CoC.getInstance().scenes.amilyScene.amilyCorrupt() && CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_LEVEL ] >= 4 && CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_KILLED ] === 0 ) {
			CoC.getInstance().scenes.holliScene.amilyHatesTreeFucking();
			EngineCore.hideMenus();
			return;
		}
		if( CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_KILLED ] === 1 && CoC.getInstance().flags[ kFLAGS.AMILY_TREE_FLIPOUT ] === 1 && !CoC.getInstance().scenes.amilyScene.amilyFollower() && CoC.getInstance().flags[ kFLAGS.AMILY_VISITING_URTA ] === 0 ) {
			CoC.getInstance().scenes.holliScene.amilyComesBack();
			CoC.getInstance().flags[ kFLAGS.AMILY_TREE_FLIPOUT ] = 2;
			EngineCore.hideMenus();
			return;
		}
		//Anemone birth followup!
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.CampAnemoneTrigger ) >= 0 ) {
			CoC.getInstance().player.removeStatusAffect( StatusAffects.CampAnemoneTrigger );
			CoC.getInstance().scenes.anemoneScene.anemoneKidBirthPtII();
			EngineCore.hideMenus();
			return;
		}
		//Exgartuan clearing
		if( CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 1 && (CoC.getInstance().player.cockArea( 0 ) < 100 || CoC.getInstance().player.cocks.length === 0) ) {
			this.exgartuanCampUpdate();
			return;
		} else if( CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 2 && CoC.getInstance().player.biggestTitSize() < 12 ) {
			this.exgartuanCampUpdate();
			return;
		}
		//Izzys tits asplode
		if( CoC.getInstance().scenes.isabellaFollowerScene.isabellaFollower() && CoC.getInstance().flags[ kFLAGS.ISABELLA_MILKED_YET ] >= 10 && CoC.getInstance().player.hasKeyItem( 'Breast Milker - Installed At Whitney\'s Farm' ) >= 0 ) {
			CoC.getInstance().scenes.isabellaFollowerScene.milktasticLacticLactation();
			EngineCore.hideMenus();
			return;
		}
		//Marble meets follower izzy when moving in
		if( CoC.getInstance().flags[ kFLAGS.ISABELLA_MURBLE_BLEH ] === 1 && CoC.getInstance().scenes.isabellaFollowerScene.isabellaFollower() && CoC.getInstance().player.findStatusAffect( StatusAffects.CampMarble ) >= 0 ) {
			CoC.getInstance().scenes.isabellaFollowerScene.angryMurble();
			EngineCore.hideMenus();
			return;
		}
		//Cotton preg freakout
		if( CoC.getInstance().player.pregnancyIncubation <= 280 && CoC.getInstance().player.pregnancyType === PregnancyStore.PREGNANCY_COTTON &&
			CoC.getInstance().flags[ kFLAGS.COTTON_KNOCKED_UP_PC_AND_TALK_HAPPENED ] === 0 && (CoC.getInstance().time.hours === 6 || CoC.getInstance().time.hours === 7) ) {
			CoC.getInstance().scenes.telAdre.cotton.goTellCottonShesAMomDad();
			EngineCore.hideMenus();
			return;
		}
		//Bimbo Sophie finds ovi elixer in chest!
		if( CoC.getInstance().scenes.sophieBimbo.bimboSophie() && this.hasItemInStorage( ConsumableLib.OVIELIX ) && Utils.rand( 5 ) === 0 && CoC.getInstance().flags[ kFLAGS.TIMES_SOPHIE_HAS_DRUNK_OVI_ELIXIR ] === 0 && CoC.getInstance().player.gender > 0 ) {
			CoC.getInstance().scenes.sophieBimbo.sophieEggApocalypse();
			EngineCore.hideMenus();
			return;
		}
		//Amily + Urta freakout!
		if( !CoC.getInstance().scenes.urtaQuest.urtaBusy() && CoC.getInstance().flags[ kFLAGS.AMILY_VISITING_URTA ] === 0 && Utils.rand( 10 ) === 0 && CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00146 ] >= 0 && CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00147 ] === 0 && CoC.getInstance().flags[ kFLAGS.AMILY_NEED_TO_FREAK_ABOUT_URTA ] === 1 && CoC.getInstance().scenes.amilyScene.amilyFollower() && CoC.getInstance().flags[ kFLAGS.AMILY_FOLLOWER ] === 1 && !CoC.getInstance().scenes.amilyScene.pregnancy.isPregnant ) {
			CoC.getInstance().scenes.followerInteractions.amilyUrtaReaction();
			EngineCore.hideMenus();
			return;
		}
		//Find jojo's note!
		if( CoC.getInstance().flags[ kFLAGS.JOJO_FIXED_STATUS ] === 1 && CoC.getInstance().flags[ kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO ] === 0 ) {
			CoC.getInstance().scenes.followerInteractions.findJojosNote();
			EngineCore.hideMenus();
			return;
		}
		//Rathazul freaks out about jojo
		if( CoC.getInstance().flags[ kFLAGS.RATHAZUL_CORRUPT_JOJO_FREAKOUT ] === 0 && Utils.rand( 5 ) === 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 && CoC.getInstance().scenes.jojoScene.campCorruptJojo() ) {
			CoC.getInstance().scenes.followerInteractions.rathazulFreaksOverJojo();
			EngineCore.hideMenus();
			return;
		}
		//Izma/Marble freakout - marble moves in
		if( CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00237 ] === 1 ) {
			CoC.getInstance().scenes.izmaScene.newMarbleMeetsIzma();
			EngineCore.hideMenus();
			return;
		}
		//Izma/Amily freakout - Amily moves in
		if( CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00236 ] === 1 ) {
			CoC.getInstance().scenes.izmaScene.newAmilyMeetsIzma();
			EngineCore.hideMenus();
			return;
		}
		//Amily/Marble Freakout
		if( CoC.getInstance().flags[ kFLAGS.AMILY_NOT_FREAKED_OUT ] === 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.CampMarble ) >= 0 && CoC.getInstance().flags[ kFLAGS.AMILY_FOLLOWER ] === 1 && CoC.getInstance().scenes.amilyScene.amilyFollower() && CoC.getInstance().scenes.marbleScene.marbleAtCamp() ) {
			CoC.getInstance().scenes.followerInteractions.marbleVsAmilyFreakout();
			EngineCore.hideMenus();
			return;
		}
		//Amily and/or Jojo freakout about Vapula!!
		if( CoC.getInstance().scenes.vapula.vapulaSlave() && (CoC.getInstance().player.findStatusAffect( StatusAffects.PureCampJojo ) >= 0 || (CoC.getInstance().scenes.amilyScene.amilyFollower() && !CoC.getInstance().scenes.amilyScene.amilyCorrupt())) ) {
			//Jojo but not Amily
			if( CoC.getInstance().player.findStatusAffect( StatusAffects.PureCampJojo ) >= 0 && !(CoC.getInstance().scenes.amilyScene.amilyFollower() && !CoC.getInstance().scenes.amilyScene.amilyCorrupt()) ) {
				CoC.getInstance().scenes.vapula.mouseWaifuFreakout( false, true );
			}//Amily but not Jojo
			else if( (CoC.getInstance().scenes.amilyScene.amilyFollower() && !CoC.getInstance().scenes.amilyScene.amilyCorrupt()) ) {
				CoC.getInstance().scenes.vapula.mouseWaifuFreakout( true, false );
			}//Both
			else {
				CoC.getInstance().scenes.vapula.mouseWaifuFreakout( true, true );
			}
			EngineCore.hideMenus();
			return;
		}
		//Go through Helia's first time move in interactions if  you haven't yet.
		if( CoC.getInstance().flags[ kFLAGS.HEL_FOLLOWER_LEVEL ] === 2 && CoC.getInstance().scenes.helScene.followerHel() && CoC.getInstance().flags[ kFLAGS.HEL_INTROS_LEVEL ] === 0 ) {
			CoC.getInstance().scenes.helFollower.helFollowersIntro();
			EngineCore.hideMenus();
			return;
		}
		//If you've gone through Hel's first time actions and Issy moves in without being okay with threesomes.
		if( CoC.getInstance().flags[ kFLAGS.HEL_INTROS_LEVEL ] > 9000 && CoC.getInstance().scenes.helScene.followerHel() && CoC.getInstance().scenes.isabellaFollowerScene.isabellaFollower() && CoC.getInstance().flags[ kFLAGS.HEL_ISABELLA_THREESOME_ENABLED ] === 0 ) {
			CoC.getInstance().scenes.helFollower.angryHelAndIzzyCampHelHereFirst();
			EngineCore.hideMenus();
			return;
		}
		//Reset.
		CoC.getInstance().flags[ kFLAGS.CAME_WORMS_AFTER_COMBAT ] = 0;
		this.campQ = false;
		//Build explore menus
		var placesEvent = (this.placesKnown() ? this.places : null);
		var followers = null;
		var lovers = null;
		var slaves = null;
		var storage = null;
		if( CoC.getInstance().inventory.showStash() ) {
			storage = CoC.getInstance().inventory.stash;
		}
		//Clear stuff
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.SlimeCravingOutput ) >= 0 ) {
			CoC.getInstance().player.removeStatusAffect( StatusAffects.SlimeCravingOutput );
		}
		//Reset luststick display status (see event parser)
		CoC.getInstance().flags[ kFLAGS.PC_CURRENTLY_LUSTSTICK_AFFECTED ] = 0;
		//Display Proper Buttons
		MainView.showMenuButton( MainView.MENU_APPEARANCE );
		MainView.showMenuButton( MainView.MENU_PERKS );
		MainView.showMenuButton( MainView.MENU_STATS );
		MainView.showMenuButton( MainView.MENU_DATA );
		EngineCore.showStats();
		//Change settings of new game buttons to go to main menu
		MainView.setMenuButton( MainView.MENU_NEW_MAIN, 'Main Menu', StartUp.mainMenu );
		//clear up/down arrows
		EngineCore.hideUpDown();
		//Level junk
		if( CoC.getInstance().player.XP >= (CoC.getInstance().player.level) * 100 || CoC.getInstance().player.perkPoints > 0 ) {
			if( CoC.getInstance().player.XP < CoC.getInstance().player.level * 100 ) {
				MainView.setMenuButton( MainView.MENU_LEVEL, 'Perk Up' );
			} else {
				MainView.setMenuButton( MainView.MENU_LEVEL, 'Level Up' );
			}
			MainView.showMenuButton( MainView.MENU_LEVEL );
			MainView.statsView.showLevelUp();
		} else {
			MainView.hideMenuButton( MainView.MENU_LEVEL );
			MainView.statsView.hideLevelUp();
		}
		//Build main menu
		var exploreEvent = CoC.getInstance().scenes.exploration.doExplore;
		var masturbate = (CoC.getInstance().player.lust > 30 ? CoC.getInstance().scenes.masturbation.masturbateMenu : null);
		EngineCore.clearOutput();
		EngineCore.outputText( ImageManager.showImage( 'camping' ), false );
		//Isabella upgrades camp level!

		if( CoC.getInstance().scenes.isabellaFollowerScene.isabellaFollower() ) {
			EngineCore.outputText( 'Your campsite got a lot more comfortable once Isabella moved in.  Carpets cover up much of the barren ground, simple awnings tied to the rocks provide shade, and hand-made wooden furniture provides comfortable places to sit and sleep.', false );
			if( CoC.getInstance().time.days >= 20 ) {
				EngineCore.outputText( '  You\'ve even managed to carve some artwork into the rocks around the camp\'s perimeter.', false );
			}
		}
		//Live in-ness
		else {
			if( CoC.getInstance().time.days < 10 ) {
				EngineCore.outputText( 'Your campsite is fairly simple at the moment.  Your tent and bedroll are set in front of the rocks that lead to the portal.  You have a small fire pit as well.', false );
			} else if( CoC.getInstance().time.days < 20 ) {
				EngineCore.outputText( 'Your campsite is starting to get a very \'lived-in\' look.  The fire-pit is well defined with some rocks you\'ve arranged around it, and your bedroll and tent have been set up in the area most sheltered by rocks.', false );
			} else {
				EngineCore.outputText( 'Your new home is as comfy as a camp site can be.  The fire-pit and tent are both set up perfectly, and in good repair, and you\'ve even managed to carve some artwork into the rocks around the camp\'s perimeter.', false );
			}
		}
		if( CoC.getInstance().flags[ kFLAGS.CLARA_IMPRISONED ] > 0 ) {
			CoC.getInstance().scenes.marblePurification.claraCampAddition();
		}
		//Nursery
		if( CoC.getInstance().flags[ kFLAGS.MARBLE_NURSERY_CONSTRUCTION ] === 100 && CoC.getInstance().player.findStatusAffect( StatusAffects.CampMarble ) >= 0 ) {
			EngineCore.outputText( '  Marble has built a fairly secure nursery amongst the rocks to house your ', false );
			if( CoC.getInstance().flags[ kFLAGS.MARBLE_KIDS ] === 0 ) {
				EngineCore.outputText( 'future children', false );
			} else {
				EngineCore.outputText( Utils.num2Text( CoC.getInstance().flags[ kFLAGS.MARBLE_KIDS ] ) + ' child', false );
				if( CoC.getInstance().flags[ kFLAGS.MARBLE_KIDS ] > 1 ) {
					EngineCore.outputText( 'ren', false );
				}
			}
			EngineCore.outputText( '.', false );
		}
		//HARPY ROOKERY
		if( CoC.getInstance().flags[ kFLAGS.SOPHIE_ADULT_KID_COUNT ] > 0 ) {
			//Rookery Descriptions (Short)
			//Small (1 mature daughter)
			if( CoC.getInstance().flags[ kFLAGS.SOPHIE_ADULT_KID_COUNT ] === 1 ) {
				EngineCore.outputText( '  There\'s a smallish harpy nest that your daughter has built up with rocks piled high near the fringes of your camp.  It\'s kind of pathetic, but she seems proud of her accomplishment.' );
			}
			//Medium (2-3 mature daughters)
			else if( CoC.getInstance().flags[ kFLAGS.SOPHIE_ADULT_KID_COUNT ] <= 3 ) {
				EngineCore.outputText( '  There\'s a growing pile of stones built up at the fringes of your camp.  It\'s big enough to be considered a small hill by this point, dotted with a couple small harpy nests just barely big enough for two.' );
			}
			//Big (4 mature daughters)
			else if( CoC.getInstance().flags[ kFLAGS.SOPHIE_ADULT_KID_COUNT ] <= 4 ) {
				EngineCore.outputText( '  The harpy rookery at the edge of camp has gotten pretty big.  It\'s taller than most of the standing stones that surround the portal, and there\'s more nests than harpies at this point.  Every now and then you see the four of them managing a boulder they dragged in from somewhere to add to it.' );
			}
			//Large (5-10 mature daughters)
			else if( CoC.getInstance().flags[ kFLAGS.SOPHIE_ADULT_KID_COUNT ] <= 10 ) {
				EngineCore.outputText( '  The rookery has gotten quite large.  It stands nearly two stories tall at this point, dotted with nests and hollowed out places in the center.  It\'s surrounded by the many feathers the assembled harpies leave behind.' );
			}
			//Giant (11-20 mature daughters)
			else if( CoC.getInstance().flags[ kFLAGS.SOPHIE_ADULT_KID_COUNT ] <= 20 ) {
				EngineCore.outputText( '  A towering harpy rookery has risen up at the fringes of your camp, filled with all of your harpy brood.  It\'s at least three stories tall at this point, and it has actually begun to resemble a secure structure.  These harpies are always rebuilding and adding onto it.' );
			}
			//Massive (31-50 mature daughters)
			else if( CoC.getInstance().flags[ kFLAGS.SOPHIE_ADULT_KID_COUNT ] <= 50 ) {
				EngineCore.outputText( '  A massive harpy rookery towers over the edges of your camp.  It\'s almost entirely built out of stones that are fit seamlessly into each other, with many ledges and overhangs for nests.  There\'s a constant hum of activity over there day or night.' );
			}
			//Immense (51+ Mature daughters)
			else {
				EngineCore.outputText( '  An immense harpy rookery dominates the edge of your camp, towering over the rest of it.  Innumerable harpies flit around it, always working on it, assisted from below by the few sisters unlucky enough to be flightless.' );
			}
		}
		//Traps
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.DefenseCanopy ) >= 0 ) {
			EngineCore.outputText( '  A thorny tree has sprouted near the center of the camp, growing a protective canopy of spiky vines around the portal and your camp.', false );
		} else {
			EngineCore.outputText( '  You have a number of traps surrounding your makeshift home, but they are fairly simple and may not do much to deter a demon.', false );
		}
		EngineCore.outputText( '  The portal shimmers in the background as it always does, looking menacing and reminding you of why you came.\n\n', false );
		//Ember's anti-minotaur crusade!
		if( CoC.getInstance().flags[ kFLAGS.EMBER_CURRENTLY_FREAKING_ABOUT_MINOCUM ] === 1 ) {
			//Modified this.Camp Description
			EngineCore.outputText( 'Since Ember began ' + CoC.getInstance().scenes.emberScene.emberMF( 'his', 'her' ) + ' \'crusade\' against the minotaur population, skulls have begun to pile up on either side of the entrance to ' + CoC.getInstance().scenes.emberScene.emberMF( 'his', 'her' ) + ' den.  There\'re quite a lot of them.\n\n' );
		}
		//Dat tree!
		if( CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_LEVEL ] >= 4 && CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_KILLED ] === 0 ) {
			EngineCore.outputText( 'On the outer edges, half-hidden behind a rock, is a large, very healthy tree.  It grew fairly fast, but seems to be fully developed now.  Holli, Marae\'s corrupt spawn, lives within.\n\n' );
		}
		if( CoC.getInstance().flags[ kFLAGS.CLARA_IMPRISONED ] > 0 ) {
			//claraCampAddition();
		}
		//BIMBO SOPHAH
		if( CoC.getInstance().scenes.sophieBimbo.bimboSophie() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_SOPHIE ] === 0 ) {
			CoC.getInstance().scenes.sophieBimbo.sophieCampLines();
		}
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.CampMarble ) >= 0 ) {
			EngineCore.outputText( 'A second bedroll rests next to yours; a large two-handed hammer sometimes rests against it, depending on whether or not its owner needs it at the time.  ', false );
			//Marble is out!
			if( CoC.getInstance().flags[ kFLAGS.MARBLE_PURIFICATION_STAGE ] === 4 ) {
				EngineCore.outputText( 'Marble isn’t here right now; she’s still off to see her family.' );
			}//requires at least 1 kid, time is just before sunset, this scene always happens at this time if the PC has at least one kid.
			else if( CoC.getInstance().flags[ kFLAGS.MARBLE_KIDS ] >= 1 && (CoC.getInstance().time.hours === 19 || CoC.getInstance().time.hours === 20) ) {
				EngineCore.outputText( 'Marble herself is currently in the nursery, putting your ' );
				if( CoC.getInstance().flags[ kFLAGS.MARBLE_KIDS ] === 1 ) {
					EngineCore.outputText( 'child' );
				} else {
					EngineCore.outputText( 'children' );
				}
				EngineCore.outputText( ' to bed.' );
			}
			//at 6-7 in the morning, scene always displays at this time
			else if( CoC.getInstance().time.hours === 6 || CoC.getInstance().time.hours === 7 ) {
				EngineCore.outputText( 'Marble is off in an open area to the side of your camp right now.  She is practicing with her large hammer, going through her daily training.' );
			}//after nightfall, scene always displays at this time unless PC is wormed
			else if( CoC.getInstance().time.hours >= 21 && CoC.getInstance().player.findStatusAffect( StatusAffects.Infested ) < 0 ) {
				EngineCore.outputText( 'Marble is hanging around her bedroll waiting for you to come to bed.  However, sometimes she lies down for a bit, and sometimes she paces next to it.' );
				if( CoC.getInstance().flags[ kFLAGS.MARBLE_LUST ] > 30 ) {
					EngineCore.outputText( '  She seems to be feeling antsy.' );
				}
			} else if( CoC.getInstance().flags[ kFLAGS.MARBLE_KIDS ] > 0 && CoC.getInstance().time.hours < 19 && CoC.getInstance().time.hours > 7 ) {
				//requires at least 6 kids, and no other parental characters in camp
				if( Utils.rand( 2 ) === 0 && CoC.getInstance().flags[ kFLAGS.MARBLE_KIDS ] > 5 ) {
					EngineCore.outputText( 'Marble is currently tending to your kids, but she looks a bit stressed out right now.  It looks like ' + Utils.num2Text( CoC.getInstance().flags[ kFLAGS.MARBLE_KIDS ] ) + ' might just be too many for her to handle on her own...' );
				}//requires at least 4 kids
				else if( Utils.rand( 3 ) === 0 && CoC.getInstance().flags[ kFLAGS.MARBLE_KIDS ] > 3 ) {
					EngineCore.outputText( 'Marble herself is in the camp right now, telling a story about her travels around the world to her kids as they gather around her.  The children are completely enthralled by her words.  You can\'t help but smile.' );
				}//Requires 2 boys
				else if( Utils.rand( 3 ) === 0 && CoC.getInstance().flags[ kFLAGS.MARBLE_BOYS ] > 1 ) {
					EngineCore.outputText( 'Marble herself is currently refereeing a wrestling match between two of your sons.  It seems like it\'s a contest to see which one of them gets to go for a ride between her breasts in a game of <i>Bull Blasters</i>, while the loser has to sit on her shoulders.' );
				}
				//requires at least 2 kids
				else if( Utils.rand( 3 ) === 0 && CoC.getInstance().flags[ kFLAGS.MARBLE_KIDS ] - CoC.getInstance().flags[ kFLAGS.MARBLE_BOYS ] > 1 ) {
					EngineCore.outputText( 'Marble herself is involved in a play fight with two of your kids brandishing small sticks.  It seems that the <i>mommy monster</i> is terrorising the camp and needs to be stopped by the <i>Mighty Moo and her sidekick Bovine Lass</i>.' );
				} else if( Utils.rand( 3 ) === 0 && CoC.getInstance().flags[ kFLAGS.MARBLE_KIDS ] > 1 ) {
					EngineCore.outputText( 'Marble herself is out right now; she\'s taken her kids to go visit Whitney.  You\'re sure though that she\'ll be back within the hour, so you could just wait if you needed her.' );
				} else {
					//requires at least 1 kid
					if( Utils.rand( 2 ) === 0 ) {
						EngineCore.outputText( 'Marble herself is nursing ' );
						if( CoC.getInstance().flags[ kFLAGS.MARBLE_KIDS ] > 1 ) {
							EngineCore.outputText( 'one of your cow-girl children' );
						} else {
							EngineCore.outputText( 'your cow-girl child' );
						}
						EngineCore.outputText( ' with a content look on her face.' );
					} else {
						EngineCore.outputText( 'Marble herself is watching your kid' );
						if( CoC.getInstance().flags[ kFLAGS.MARBLE_KIDS ] > 0 ) {
							EngineCore.outputText( 's' );
						}
						EngineCore.outputText( ' playing around the camp right now.' );
					}
				}
			}
			//(Choose one of these at random to display each hour)
			else {
				EngineCore.outputText( Utils.randomChoice(
					'Marble herself has gone off to Whitney\'s farm to get milked right now.  You\'re sure she\'d be back in moments if you needed her.',
					'Marble herself has gone off to Whitney\'s farm to do some chores right now.  You\'re sure she\'d be back in moments if you needed her.',
					'Marble herself isn\'t at the camp right now; she is probably off getting supplies, though she\'ll be back soon enough.  You\'re sure she\'d be back in moments if you needed her.',
					'Marble herself is resting on her bedroll right now.',
					'Marble herself is wandering around the camp right now.'
				), false );
			}
			EngineCore.outputText( '\n\n', false );
		}
		//RATHAZUL
		//if rathazul has joined the camp
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 ) {
			if( CoC.getInstance().flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ] <= 1 ) {
				EngineCore.outputText( 'Tucked into a shaded corner of the rocks is a bevy of alchemical devices and equipment.  The alchemist Rathazul looks to be hard at work with his chemicals, working on who knows what.', false );
				if( CoC.getInstance().flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ] === 1 ) {
					EngineCore.outputText( '  Some kind of spider-silk-based equipment is hanging from a nearby rack.  <b>He\'s finished with the task you gave him!</b>', false );
				}
				EngineCore.outputText( '\n\n', false );
			} else {
				EngineCore.outputText( 'Tucked into a shaded corner of the rocks is a bevy of alchemical devices and equipment.  The alchemist Rathazul looks to be hard at work on the silken equipment you\'ve commissioned him to craft.\n\n', false );
			}
		}
		//MOUSEBITCH
		if( CoC.getInstance().scenes.amilyScene.amilyFollower() && CoC.getInstance().flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			if( CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_LEVEL ] >= 4 ) {
				EngineCore.outputText( 'Amily has relocated her grass bedding to the opposite side of the camp from the strange tree; every now and then, she gives it a suspicious glance, as if deciding whether to move even further.' );
			} else {
				EngineCore.outputText( 'A surprisingly tidy nest of soft grasses and sweet-smelling herbs has been built close to your bedroll. A much-patched blanket draped neatly over the top is further proof that Amily sleeps here. She changes the bedding every few days, to ensure it stays as nice as possible.\n\n', false );
			}
		}
		//Corrupt mousebitch!
		else if( CoC.getInstance().scenes.amilyScene.amilyFollower() && CoC.getInstance().flags[ kFLAGS.AMILY_FOLLOWER ] === 2 && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_AMILY ] === 0 ) {
			EngineCore.outputText( 'Sometimes you hear a faint moan from not too far away. No doubt the result of your slutty toy mouse playing with herself.\n\n', false );
		}
		//Amily out freaking Urta?
		else if( CoC.getInstance().flags[ kFLAGS.AMILY_VISITING_URTA ] === 1 || CoC.getInstance().flags[ kFLAGS.AMILY_VISITING_URTA ] === 2 ) {
			EngineCore.outputText( 'Amily\'s bed of grass and herbs lies empty, the mouse-woman still absent from her sojourn to meet your other lover.\n\n', false );
		}
		//JOJO
		//If Jojo is corrupted, add him to the masturbate menu.
		if( CoC.getInstance().scenes.jojoScene.campCorruptJojo() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_JOJO ] === 0 ) {
			EngineCore.outputText( 'From time to time you can hear movement from around your camp, and you routinely find thick puddles of mouse semen.  You are sure Jojo is here if you ever need to sate yourself.\n\n', false );
		}
		//Pure Jojo
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.PureCampJojo ) >= 0 ) {
			EngineCore.outputText( 'There is a small bedroll for Jojo near your own, though the mouse is probably hanging around the camp\'s perimeter.\n\n', false );
		}
		//Izma
		if( CoC.getInstance().scenes.izmaScene.izmaFollower() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_IZMA ] === 0 ) {
			EngineCore.outputText( 'Neatly laid near the base of your own is a worn bedroll belonging to Izma, your tigershark lover.  It\'s a snug fit for her toned body, though it has some noticeable cuts and tears in the fabric.  Close to her bed is her old trunk, almost as if she wants to have it at arms length if anyone tries to rob her in her sleep.  ', false );
			EngineCore.outputText( Utils.randomChoice(
				'Izma\'s lazily sitting on the trunk beside her bedroll, reading one of the many books from inside it.  She smiles happily when your eyes linger on her, and you know full well she\'s only half-interested in it.',
				'You notice Izma isn\'t around right now.  She\'s probably gone off to the nearby stream to get some water.  Never mind, she comes around from behind a rock, still dripping wet.',
				'Izma is lying on her back near her bedroll.  You wonder at first just why she isn\'t using her bed, but as you look closer you notice all the water pooled beneath her and the few droplets running down her arm, evidence that she\'s just returned from the stream.'
			), false );
			EngineCore.outputText( '\n\n', false );
		}
		//►[Added Campsite Description]
		if( CoC.getInstance().scenes.desert.antsScene.phyllaWaifu() ) {
			EngineCore.outputText( 'You see Phylla\'s anthill in the distance.  Every now and then you see' );
			//If PC has children w/ Phylla
			if( CoC.getInstance().flags[ kFLAGS.ANT_KIDS ] > 0 ) {
				EngineCore.outputText( ' one of your many children exit the anthill to unload some dirt before continuing back down into the colony.  It makes you feel good knowing your offspring are so productive.' );
			} else {
				EngineCore.outputText( ' Phylla appear out of the anthill to unload some dirt.  She looks over to your campsite and gives you an excited wave before heading back into the colony.  It makes you feel good to know she\'s so close.' );
			}
			EngineCore.outputText( '\n\n' );
		}
		//Clear bee-status
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.ParalyzeVenom ) >= 0 ) {
			EngineCore.dynStats( 'str', CoC.getInstance().player.statusAffectv1( StatusAffects.ParalyzeVenom ), 'spe', CoC.getInstance().player.statusAffectv2( StatusAffects.ParalyzeVenom ) );
			CoC.getInstance().player.removeStatusAffect( StatusAffects.ParalyzeVenom );
			EngineCore.outputText( '<b>You feel quicker and stronger as the paralyzation venom in your veins wears off.</b>\n\n', false );
		}
		//The uber horny
		if( CoC.getInstance().player.lust >= 100 ) {
			if( CoC.getInstance().player.findStatusAffect( StatusAffects.Dysfunction ) >= 0 ) {
				EngineCore.outputText( '<b>You are debilitatingly aroused, but your sexual organs are so numbed the only way to get off would be to find something tight to fuck or get fucked...</b>\n\n', false );
			} else if( CoC.getInstance().flags[ kFLAGS.UNABLE_TO_MASTURBATE_BECAUSE_CENTAUR ] > 0 && CoC.getInstance().player.isTaur() ) {
				EngineCore.outputText( '<b>You are delibitatingly aroused, but your sex organs are so difficult to reach that masturbation isn\'t at the forefront of your mind.</b>\n\n', false );
			} else {
				EngineCore.outputText( '<b>You are debilitatingly aroused, and can think of doing nothing other than masturbating.</b>\n\n', false );
				exploreEvent = null;
				placesEvent = null;
				//This once disabled the ability to rest, sleep or wait, but ir hasn't done that for many many builds
			}
		}
		var baitText = 'Masturbate';
		if( ((CoC.getInstance().player.findPerk( PerkLib.HistoryReligious ) >= 0 && CoC.getInstance().player.cor <= 66) || (CoC.getInstance().player.findPerk( PerkLib.Enlightened ) >= 0 && CoC.getInstance().player.cor < 10)) && !(CoC.getInstance().player.findStatusAffect( StatusAffects.Exgartuan ) >= 0 && CoC.getInstance().player.statusAffectv2( StatusAffects.Exgartuan ) === 0) ) {
			baitText = 'Meditate';
		}
		//Initialize companions/followers
		if( CoC.getInstance().time.hours > 4 && CoC.getInstance().time.hours < 23 ) {
			if( this.followersCount() > 0 ) {
				followers = this.campFollowers;
			}
			if( this.slavesCount() > 0 ) {
				slaves = this.campSlavesMenu;
			}
			if( this.loversCount() > 0 ) {
				lovers = this.campLoversMenu;
			}
		}
		var restEvent = this.doWait;
		var restName = 'Wait';
		//Set up rest stuff
		//Night
		if( CoC.getInstance().time.hours < 6 || CoC.getInstance().time.hours > 20 ) {
			EngineCore.outputText( 'It is dark out, made worse by the lack of stars in the sky.  A blood-red moon hangs in the sky, seeming to watch you, but providing little light.  It\'s far too dark to leave camp.\n', false );
			restName = 'Sleep';
			restEvent = this.doSleep;
			exploreEvent = null;
			placesEvent = null;
		}
		//Day Time!
		else {
			EngineCore.outputText( 'It\'s light outside, a good time to explore and forage for supplies with which to fortify your camp.\n', false );
			if( CoC.getInstance().player.fatigue > 40 || CoC.getInstance().player.HP / CoC.getInstance().player.maxHP() <= 0.9 ) {
				restName = 'Rest';
				restEvent = this.rest;
			}
		}
		//Menu
		EngineCore.choices( 'Explore', exploreEvent, 'Places', placesEvent, 'Inventory', CoC.getInstance().inventory.inventoryMenu, 'Stash', storage, 'Followers', followers,
			'Lovers', lovers, 'Slaves', slaves, '', null, baitText, masturbate, restName, restEvent );
		//Lovers
		//Followers
		//Slaves
	};
	Camp.prototype.hasCompanions = function() {
		return this.companionsCount() > 0;
	};
	Camp.prototype.companionsCount = function() {
		return this.followersCount() + this.slavesCount() + this.loversCount();
	};
	Camp.prototype.followersCount = function() {
		var counter = 0;
		if( CoC.getInstance().scenes.emberScene.followerEmber() ) {
			counter++;
		}
		if( CoC.getInstance().flags[ kFLAGS.VALARIA_AT_CAMP ] === 1 ) {
			counter++;
		}
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.PureCampJojo ) >= 0 ) {
			counter++;
		}
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 ) {
			counter++;
		}
		if( CoC.getInstance().scenes.shouldraFollower.followerShouldra() ) {
			counter++;
		}
		if( CoC.getInstance().scenes.sophieFollowerScene.sophieFollower() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_SOPHIE ] === 0 ) {
			counter++;
		}
		if( CoC.getInstance().scenes.helSpawnScene.helspawnFollower() ) {
			counter++;
		}
		return counter;
	};
	Camp.prototype.slavesCount = function() {
		var counter = 0;
		if( CoC.getInstance().scenes.latexGirl.latexGooFollower() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_LATEXY ] === 0 ) {
			counter++;
		}
		if( CoC.getInstance().scenes.vapula.vapulaSlave() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_VAPULA ] === 0 ) {
			counter++;
		}
		if( CoC.getInstance().scenes.jojoScene.campCorruptJojo() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_JOJO ] === 0 ) {
			counter++;
		}
		if( CoC.getInstance().scenes.amilyScene.amilyFollower() && CoC.getInstance().scenes.amilyScene.amilyCorrupt() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_AMILY ] === 0 ) {
			counter++;
		}
		//Bimbo sophie
		if( CoC.getInstance().scenes.sophieBimbo.bimboSophie() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_SOPHIE ] === 0 ) {
			counter++;
		}
		if( CoC.getInstance().scenes.ceraphFollowerScene.ceraphIsFollower() ) {
			counter++;
		}
		if( CoC.getInstance().scenes.milkWaifu.milkSlave() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_BATH_GIRL ] === 0 ) {
			counter++;
		}
		return counter;
	};
	Camp.prototype.loversCount = function() {
		var counter = 0;
		if( CoC.getInstance().scenes.arianScene.arianFollower() ) {
			counter++;
		}
		if( CoC.getInstance().scenes.helScene.followerHel() ) {
			counter++;
		}
		//Izma!
		if( CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00238 ] === 1 && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_IZMA ] === 0 ) {
			counter++;
		}
		if( CoC.getInstance().scenes.isabellaFollowerScene.isabellaFollower() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_ISABELLA ] === 0 ) {
			counter++;
		}
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.CampMarble ) >= 0 && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_MARBLE ] === 0 ) {
			counter++;
		}
		if( CoC.getInstance().scenes.amilyScene.amilyFollower() && !CoC.getInstance().scenes.amilyScene.amilyCorrupt() ) {
			counter++;
		}
		if( CoC.getInstance().scenes.kihaFollower.followerKiha() ) {
			counter++;
		}
		if( CoC.getInstance().flags[ kFLAGS.NIEVE_STAGE ] === 5 ) {
			counter++;
		}
		if( CoC.getInstance().flags[ kFLAGS.ANT_WAIFU ] > 0 ) {
			counter++;
		}
		return counter;
	};
	Camp.prototype.campLoversMenu = function() {
		var isabellaButt = null;
		var marbleEvent = null;
		var izmaEvent = null;
		var kihaButt = null;
		var amilyEvent = null;
		var hel = null;
		var nieve = null;
		EngineCore.clearOutput();
		if( CoC.getInstance().flags[ kFLAGS.NIEVE_STAGE ] === 5 ) {
			XmasMisc.nieveCampDescs();
			EngineCore.outputText( '\n\n' );
			nieve = XmasMisc.approachNieve;
		}
		if( CoC.getInstance().scenes.helScene.followerHel() ) {
			if( CoC.getInstance().flags[ kFLAGS.HEL_FOLLOWER_LEVEL ] === 2 ) {
				//Hel @ this.Camp Menu
				//(6-7)
				if( CoC.getInstance().time.hours <= 7 ) {
					EngineCore.outputText( 'Hel is currently sitting at the edge of camp, surrounded by her scraps of armor, sword, and a few half-empty bottles of vodka.  By the way she\'s grunting and growling, it looks like she\'s getting ready to flip her shit and go running off into the plains in her berserker state.\n\n' );
				}//(8a-5p)
				else if( CoC.getInstance().time.hours <= 17 ) {
					EngineCore.outputText( 'Hel\'s out of camp at the moment, adventuring on the plains.  You\'re sure she\'d be on hand in moments if you needed her, though.\n\n' );
				}//5-7)
				else if( CoC.getInstance().time.hours <= 19 ) {
					EngineCore.outputText( 'Hel\'s out visiting her family in Tel\'Adre right now, though you\'re sure she\'s only moments away if you need her.\n\n' );
				}//(7+)
				else {
					EngineCore.outputText( 'Hel is fussing around her hammock, checking her gear and sharpening her collection of blades.  Each time you glance her way, though, the salamander puts a little extra sway in her hips and her tail wags happily.\n\n' );
				}
			} else if( CoC.getInstance().flags[ kFLAGS.HEL_FOLLOWER_LEVEL ] === 1 ) {
				if( CoC.getInstance().flags[ kFLAGS.HEL_HARPY_QUEEN_DEFEATED ] === 1 ) {
					EngineCore.outputText( 'Hel has returned to camp, though for now she looks a bit bored.  Perhaps she is waiting on something.\n\n' );
				} else {
					EngineCore.outputText( '<b>You see the salamander Helia pacing around camp, anxiously awaiting your departure to the harpy roost. Seeing you looking her way, she perks up, obviously ready to get underway.</b>\n\n' );
				}
			}
			hel = CoC.getInstance().scenes.helFollower.heliaFollowerMenu;
		}
		//Kiha!
		if( CoC.getInstance().scenes.kihaFollower.followerKiha() ) {
			//(6-7)
			if( CoC.getInstance().time.hours < 7 ) {
				EngineCore.outputText( 'Kiha is sitting near the fire, her axe laying across her knees as she polishes it.[pg]' );
			} else if( CoC.getInstance().time.hours < 19 ) {
				EngineCore.outputText( 'Kiha\'s out right now, likely patrolling for demons to exterminate.  You\'re sure a loud call could get her attention.\n\n' );
			} else {
				EngineCore.outputText( 'Kiha is utterly decimating a set of practice dummies she\'s set up out on the edge of camp.  All of them have crudely drawn horns. Most of them are on fire.\n\n' );
			}
			kihaButt = CoC.getInstance().scenes.kihaScene.encounterKiha;
		}
		//Isabella
		if( CoC.getInstance().scenes.isabellaFollowerScene.isabellaFollower() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_ISABELLA ] === 0 ) {
			isabellaButt = CoC.getInstance().scenes.isabellaFollowerScene.callForFollowerIsabella;
			if( CoC.getInstance().time.hours >= 21 || CoC.getInstance().time.hours <= 5 ) {
				EngineCore.outputText( 'Isabella is sound asleep in her bunk and quietly snoring.', false );
			} else if( CoC.getInstance().time.hours === 6 ) {
				EngineCore.outputText( 'Isabella is busy eating some kind of grain-based snack for breakfast.  The curly-haired cow-girl gives you a smile when she sees you look her way.', false );
			} else if( CoC.getInstance().time.hours === 7 ) {
				EngineCore.outputText( 'Isabella, the red-headed cow-girl, is busy with a needle and thread, fixing up some of her clothes.', false );
			} else if( CoC.getInstance().time.hours === 8 ) {
				EngineCore.outputText( 'Isabella is busy cleaning up the camp, but when she notices you looking her way, she stretches up and arches her back, pressing eight bullet-hard nipples into the sheer silk top she prefers to wear.', false );
			} else if( CoC.getInstance().time.hours === 9 ) {
				EngineCore.outputText( 'Isabella is out near the fringes of your campsite.  She has her massive shield in one hand and appears to be keeping a sharp eye out for intruders or demons.  When she sees you looking her way, she gives you a wave.', false );
			} else if( CoC.getInstance().time.hours === 10 ) {
				EngineCore.outputText( 'The cow-girl warrioress, Isabella, is sitting down on a chair and counting out gems from a strange pouch.  She must have defeated someone or something recently.', false );
			} else if( CoC.getInstance().time.hours === 11 ) {
				EngineCore.outputText( 'Isabella is sipping from a bottle labelled \'Lactaid\' in a shaded corner.  When she sees you looking she blushes, though dark spots appear on her top and in her skirt\'s middle.', false );
			} else if( CoC.getInstance().time.hours === 12 ) {
				EngineCore.outputText( 'Isabella is cooking a slab of meat over the fire.  From the smell that\'s wafting this way, you think it\'s beef.  Idly, you wonder if she realizes just how much like her chosen food animal she has become.', false );
			} else if( CoC.getInstance().time.hours === 13 ) {
				EngineCore.outputText( 'Isabella ', false );
				var izzyCreeps = [];
				//Build array of choices for izzy to talk to
				if( CoC.getInstance().player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 ) {
					izzyCreeps.push( 0 );
				}
				if( CoC.getInstance().player.findStatusAffect( StatusAffects.PureCampJojo ) >= 0 ) {
					izzyCreeps.push( 1 );
				}
				if( CoC.getInstance().scenes.amilyScene.amilyFollower() && CoC.getInstance().flags[ kFLAGS.AMILY_FOLLOWER ] === 1 && CoC.getInstance().flags[ kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO ] === 0 ) {
					izzyCreeps.push( 2 );
				}
				if( CoC.getInstance().scenes.amilyScene.amilyFollower() && CoC.getInstance().flags[ kFLAGS.AMILY_FOLLOWER ] === 2 && CoC.getInstance().flags[ kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO ] === 0 && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_AMILY ] === 0 ) {
					izzyCreeps.push( 3 );
				}
				if( CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00238 ] === 1 && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_IZMA ] === 0 ) {
					izzyCreeps.push( 4 );
				}
				//Base choice - book
				izzyCreeps.push( 5 );
				//Select!
				var choice = _.sample( izzyCreeps );
				if( choice === 0 ) {
					EngineCore.outputText( 'is sitting down with Rathazul, chatting amiably about the weather.', false );
				} else if( choice === 1 ) {
					EngineCore.outputText( 'is sitting down with Jojo, smiling knowingly as the mouse struggles to keep his eyes on her face.', false );
				} else if( choice === 2 ) {
					EngineCore.outputText( 'is talking with Amily, sharing stories of the fights she\'s been in and the enemies she\'s faced down.  Amily seems interested but unimpressed.', false );
				} else if( choice === 3 ) {
					EngineCore.outputText( 'is sitting down chatting with Amily, but the corrupt mousette is just staring at Isabella\'s boobs and masturbating.  The cow-girl is pretending not to notice.', false );
				} else if( choice === 4 ) {
					EngineCore.outputText( 'is sitting down with Izma and recounting some stories, somewhat nervously.  Izma keeps flashing her teeth in a predatory smile.', false );
				} else {
					EngineCore.outputText( 'is sitting down and thumbing through a book.', false );
				}
			} else if( CoC.getInstance().time.hours === 14 ) {
				EngineCore.outputText( 'Isabella is working a grindstone and sharpening her tools.  She even hones the bottom edge of her shield into a razor-sharp cutting edge.  The cow-girl is sweating heavily, but it only makes the diaphanous silk of her top cling more alluringly to her weighty chest.', false );
			} else if( CoC.getInstance().time.hours === 15 ) {
				EngineCore.outputText( 'The warrior-woman, Isabella is busy constructing dummies of wood and straw, then destroying them with vicious blows from her shield.  Most of the time she finishes by decapitating them with the sharp, bottom edge of her weapon.  She flashes a smile your way when she sees you.', false );
			} else if( CoC.getInstance().time.hours === 16 ) {
				EngineCore.outputText( 'Isabella is sitting down with a knife, the blade flashing in the sun as wood shavings fall to the ground.  Her hands move with mechanical, practiced rhythm as she carves a few hunks of shapeless old wood into tools or art.', false );
			} else if( CoC.getInstance().time.hours === 17 ) {
				EngineCore.outputText( 'Isabella is sitting against one of the large rocks near the outskirts of your camp, staring across the wasteland while idly munching on what you assume to be a leg of lamb.  She seems lost in thought, though that doesn\'t stop her from throwing a wink and a goofy food-filled grin toward you.', false );
			} else if( CoC.getInstance().time.hours === 18 ) {
				EngineCore.outputText( 'The dark-skinned cow-girl, Isabella, is sprawled out on a carpet and stretching.  She seems surprisingly flexible for someone with hooves and oddly-jointed lower legs.', false );
			} else if( CoC.getInstance().time.hours === 19 ) {
				//[(Izzy Milked Yet flag = -1)
				if( CoC.getInstance().flags[ kFLAGS.ISABELLA_MILKED_YET ] === -1 ) {
					EngineCore.outputText( 'Isabella has just returned from a late visit to Whitney\'s farm, bearing a few filled bottles and a small pouch of gems.', false );
				} else {
					EngineCore.outputText( 'Isabella was hidden behind a rock when you started looking for her, but as soon as you spot her in the darkness, she jumps, a guilty look flashing across her features.  She turns around and adjusts her top before looking back your way, her dusky skin even darker from a blush.  The cow-girl gives you a smile and walks back to her part of camp.  A patch of white decorates the ground where she was standing - is that milk?  Whatever it is, it\'s gone almost as fast as you see it, devoured by the parched, wasteland earth.', false );
				}
			} else if( CoC.getInstance().time.hours === 20 ) {
				EngineCore.outputText( 'Your favorite chocolate-colored cowgirl, Isabella, is moving about, gathering all of her scattered belongings and replacing them in her personal chest.  She yawns more than once, indicating her readiness to hit the hay, but her occasional glance your way lets you know she wouldn\'t mind some company before bed.', false );
			} else {
				EngineCore.outputText( 'Isabella looks incredibly bored right now.', false );
			}
			EngineCore.outputText( '\n\n', false );
		}
		//Izma
		if( CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00238 ] === 1 && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_IZMA ] === 0 ) {
			EngineCore.outputText( 'Neatly laid near the base of your own is a worn bedroll belonging to Izma, your tigershark lover. It\'s a snug fit for her toned body, though it has some noticeable cuts and tears in the fabric. Close to her bed is her old trunk, almost as if she wants to have it at arms length if anyone tries to rob her in her sleep.\n\n', false );
			izmaEvent = CoC.getInstance().scenes.izmaScene.izmaFollowerMenu;
		}
		//MARBLE
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.CampMarble ) >= 0 && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_MARBLE ] === 0 ) {
			EngineCore.outputText( 'A second bedroll rests next to yours; a large two handed hammer sometimes rests against it, depending on whether or not its owner needs it at the time.  ', false );
			//Normal Murbles
			if( CoC.getInstance().flags[ kFLAGS.MARBLE_PURIFICATION_STAGE ] !== 4 ) {
				//(Choose one of these at random to display each hour)
				var marbleChoice = Utils.rand( 5 );
				if( marbleChoice === 0 ) {
					EngineCore.outputText( 'Marble herself has gone off to Whitney\'s farm to get milked right now.', false );
				}
				if( marbleChoice === 1 ) {
					EngineCore.outputText( 'Marble herself has gone off to Whitney\'s farm to do some chores right now.', false );
				}
				if( marbleChoice === 2 ) {
					EngineCore.outputText( 'Marble herself isn\'t at the camp right now; she is probably off getting supplies, though she\'ll be back soon enough.', false );
				}
				if( marbleChoice === 3 ) {
					EngineCore.outputText( 'Marble herself is resting on her bedroll right now.', false );
				}
				if( marbleChoice === 4 ) {
					EngineCore.outputText( 'Marble herself is wandering around the camp right now.', false );
				}
				if( marbleChoice < 3 ) {
					EngineCore.outputText( '  You\'re sure she\'d be back in moments if you needed her.', false );
				}
				marbleEvent = CoC.getInstance().scenes.marbleScene.interactWithMarbleAtCamp;
			}
			//Out getting family
			else {
				EngineCore.outputText( 'Marble is out in the wilderness right now, searching for a relative.' );
			}
			EngineCore.outputText( '\n\n', false );
		}
		//AMILY
		if( CoC.getInstance().scenes.amilyScene.amilyFollower() && CoC.getInstance().flags[ kFLAGS.AMILY_FOLLOWER ] === 1 && CoC.getInstance().flags[ kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO ] === 0 ) {
			EngineCore.outputText( 'Amily is currently strolling around your camp, ', false );
			var amilyChoice = Utils.rand( 6 );
			if( amilyChoice === 0 ) {
				EngineCore.outputText( 'dripping water and stark naked from a bath in the stream', false );
				if( CoC.getInstance().player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 ) {
					EngineCore.outputText( '.  Rathazul glances over and immediately gets a nosebleed', false );
				}
			} else if( amilyChoice === 1 ) {
				EngineCore.outputText( 'slouching in the shade of some particularly prominent rocks, whittling twigs to create darts for her blowpipe', false );
			} else if( amilyChoice === 2 ) {
				EngineCore.outputText( 'dipping freshly-made darts into a jar of something that looks poisonous', false );
			} else if( amilyChoice === 3 ) {
				EngineCore.outputText( 'eating some of your supplies', false );
			} else if( amilyChoice === 4 ) {
				EngineCore.outputText( 'and she flops down on her nest to have a rest', false );
			} else {
				EngineCore.outputText( 'peeling the last strips of flesh off of an imp\'s skull and putting it on a particularly flat, sun-lit rock to bleach as a trophy', false );
			}
			EngineCore.outputText( '.\n\n', false );
			amilyEvent = CoC.getInstance().scenes.amilyScene.amilyFollowerEncounter;
		}
		//Amily out freaking Urta?
		else if( CoC.getInstance().flags[ kFLAGS.AMILY_VISITING_URTA ] === 1 || CoC.getInstance().flags[ kFLAGS.AMILY_VISITING_URTA ] === 2 ) {
			EngineCore.outputText( 'Amily\'s bed of grass and herbs lies empty, the mouse-woman still absent from her sojourn to meet your other lover.\n\n', false );
		}
		if( CoC.getInstance().scenes.arianScene.arianFollower() ) {
			EngineCore.outputText( 'Arian\'s tent is here, if you\'d like to go inside.\n\n' );
		}
		EngineCore.menu();
		if( amilyEvent !== null ) {
			EngineCore.addButton( 0, 'Amily', amilyEvent );
		}
		if( CoC.getInstance().scenes.arianScene.arianFollower() ) {
			EngineCore.addButton( 1, 'Arian', CoC.getInstance().scenes.arianScene.visitAriansHouse );
		}
		if( hel !== null ) {
			EngineCore.addButton( 2, 'Helia', hel );
		}
		if( isabellaButt !== null ) {
			EngineCore.addButton( 3, 'Isabella', isabellaButt );
		}
		if( izmaEvent !== null ) {
			EngineCore.addButton( 4, 'Izma', izmaEvent );
		}
		EngineCore.addButton( 5, 'Kiha', kihaButt );
		if( marbleEvent !== null ) {
			EngineCore.addButton( 6, 'Marble', marbleEvent );
		}
		if( nieve !== null ) {
			EngineCore.addButton( 7, 'Nieve', nieve );
		}
		if( CoC.getInstance().flags[ kFLAGS.ANT_WAIFU ] > 0 ) {
			EngineCore.addButton( 8, 'Phylla', CoC.getInstance().scenes.desert.antsScene.introductionToPhyllaFollower );
		}
		EngineCore.addButton( 9, 'Back', EventParser.playerMenu );
	};
	Camp.prototype.campSlavesMenu = function() {
		EngineCore.clearOutput();
		var vapula2 = null;
		var amilyEvent = null;
		var ceraph = null;
		var sophieEvent = null;
		var jojoEvent = null;
		var goo = null;
		var milk = null;
		if( CoC.getInstance().scenes.vapula.vapulaSlave() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_VAPULA ] === 0 ) {
			CoC.getInstance().scenes.vapula.vapulaSlaveFlavorText();
			EngineCore.outputText( '\n\n' );
			vapula2 = CoC.getInstance().scenes.vapula.callSlaveVapula;
		}
		//Bimbo Sophie
		if( CoC.getInstance().scenes.sophieBimbo.bimboSophie() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_SOPHIE ] === 0 ) {
			CoC.getInstance().scenes.sophieBimbo.sophieCampLines();
			sophieEvent = CoC.getInstance().scenes.sophieBimbo.approachBimboSophieInCamp;
		}
		if( CoC.getInstance().scenes.latexGirl.latexGooFollower() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_LATEXY ] === 0 ) {
			EngineCore.outputText( CoC.getInstance().flags[ kFLAGS.GOO_NAME ] + ' lurks in a secluded section of rocks, only venturing out when called for or when she needs to gather water from the stream.\n\n' );
			goo = CoC.getInstance().scenes.latexGirl.approachLatexy;
		}
		if( CoC.getInstance().scenes.ceraphFollowerScene.ceraphIsFollower() ) {
			ceraph = CoC.getInstance().scenes.ceraphFollowerScene.ceraphFollowerEncounter;
		}
		//JOJO
		//If Jojo is corrupted, add him to the masturbate menu.
		if( CoC.getInstance().scenes.jojoScene.campCorruptJojo() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_JOJO ] === 0 ) {
			EngineCore.outputText( 'From time to time you can hear movement from around your camp, and you routinely find thick puddles of mouse semen.  You are sure Jojo is here if you ever need to sate yourself.\n\n', false );
			jojoEvent = CoC.getInstance().scenes.jojoScene.corruptCampJojo;
		}
		//Modified Camp/Follower List Description
		if( CoC.getInstance().scenes.amilyScene.amilyFollower() && CoC.getInstance().flags[ kFLAGS.AMILY_FOLLOWER ] === 2 && CoC.getInstance().flags[ kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO ] === 0 && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_AMILY ] === 0 ) {
			EngineCore.outputText( 'Sometimes you hear a faint moan from not too far away. No doubt the result of your slutty toy mouse playing with herself.\n\n', false );
			amilyEvent = CoC.getInstance().scenes.amilyScene.amilyFollowerEncounter;
		}
		if( CoC.getInstance().scenes.milkWaifu.milkSlave() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_BATH_GIRL ] === 0 ) {
			EngineCore.outputText( 'Your well-endowed, dark-skinned milk-girl is here.  She flicks hopeful eyes towards you whenever she thinks she has your attention.\n\n' );
			milk = CoC.getInstance().scenes.milkWaifu.milkyMenu;
		}
		EngineCore.menu();
		if( amilyEvent !== null ) {
			EngineCore.addButton( 0, 'Amily', amilyEvent );
		}
		if( ceraph !== null ) {
			EngineCore.addButton( 1, 'Ceraph', ceraph );
		}
		if( jojoEvent !== null ) {
			EngineCore.addButton( 2, 'Jojo', jojoEvent );
		}
		if( sophieEvent !== null ) {
			EngineCore.addButton( 3, 'Sophie', sophieEvent );
		}
		if( vapula2 !== null ) {
			EngineCore.addButton( 4, 'Vapula', vapula2 );
		}
		if( milk !== null ) {
			EngineCore.addButton( 7, CoC.getInstance().flags[ kFLAGS.MILK_NAME ], milk );
		}
		if( goo !== null ) {
			EngineCore.addButton( 8, CoC.getInstance().flags[ kFLAGS.GOO_NAME ], goo );
		}
		EngineCore.addButton( 9, 'Back', EventParser.playerMenu );
	};
	Camp.prototype.campFollowers = function() {
		var rathazulEvent = null;
		var jojoEvent = null;
		var valeria2 = null;
		var shouldra = null;
		var ember = null;
		EngineCore.clearOutput();
		CoC.getInstance().setInCombat( false );
		//ADD MENU FLAGS/INDIVIDUAL FOLLOWER TEXTS
		EngineCore.menu();
		if( CoC.getInstance().scenes.emberScene.followerEmber() ) {
			CoC.getInstance().scenes.emberScene.emberCampDesc();
			ember = CoC.getInstance().scenes.emberScene.emberCampMenu;
		}
		if( CoC.getInstance().scenes.shouldraFollower.followerShouldra() ) {
			shouldra = CoC.getInstance().scenes.shouldraFollower.shouldraFollowerScreen;
		}
		//Pure Jojo
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.PureCampJojo ) >= 0 ) {
			EngineCore.outputText( 'There is a small bedroll for Jojo near your own, though the mouse is probably hanging around the camp\'s perimeter.\n\n', false );
			jojoEvent = CoC.getInstance().scenes.jojoScene.jojoCamp;
		}
		//RATHAZUL
		//if rathazul has joined the camp
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 ) {
			rathazulEvent = CoC.getInstance().scenes.rathazul.returnToRathazulMenu;
			if( CoC.getInstance().flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ] <= 1 ) {
				EngineCore.outputText( 'Tucked into a shaded corner of the rocks is a bevy of alchemical devices and equipment.  The alchemist Rathazul looks to be hard at work with his chemicals, working on who knows what.', false );
				if( CoC.getInstance().flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ] === 1 ) {
					EngineCore.outputText( '  Some kind of spider-silk-based equipment is hanging from a nearby rack.  He\'s finished with the task you gave him!', false );
				}
				EngineCore.outputText( '\n\n', false );
			} else {
				EngineCore.outputText( 'Tucked into a shaded corner of the rocks is a bevy of alchemical devices and equipment.  The alchemist Rathazul looks to be hard at work on the silken equipment you\'ve commissioned him to craft.\n\n', false );
			}
		}
		if( CoC.getInstance().scenes.sophieFollowerScene.sophieFollower() && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_SOPHIE ] === 0 ) {
			if( Utils.rand( 5 ) === 0 ) {
				EngineCore.outputText( 'Sophie is sitting by herself, applying yet another layer of glittering lip gloss to her full lips.\n\n' );
			} else if( Utils.rand( 4 ) === 0 ) {
				EngineCore.outputText( 'Sophie is sitting in her nest, idly brushing out her feathers.  Occasionally, she looks up from her work to give you a sultry wink and a come-hither gaze.\n\n' );
			} else if( Utils.rand( 3 ) === 0 ) {
				EngineCore.outputText( 'Sophie is fussing around in her nest, straightening bits of straw and grass, trying to make it more comfortable.  After a few minutes, she flops down in the middle and reclines, apparently satisfied for the moment.\n\n' );
			} else if( Utils.rand( 2 ) === 0 || CoC.getInstance().flags[ kFLAGS.SOPHIE_ADULT_KID_COUNT ] === 0 ) {
				if( CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00282 ] > 0 ) {
					EngineCore.outputText( 'Your platinum-blonde harpy, Sophie, is currently reading a book - a marked change from her bimbo-era behavior.  Occasionally, though, she glances up from the page and gives you a lusty look.  Some things never change....\n\n' );
				} else {
					EngineCore.outputText( 'Your pink harpy, Sophie, is currently reading a book.  She seems utterly absorbed in it, though you question how she obtained it.  Occasionally, though, she\'ll glance up from the pages to shoot you a lusty look.\n\n' );
				}
			} else {
				EngineCore.outputText( 'Sophie is sitting in her nest, ' );
				if( CoC.getInstance().flags[ kFLAGS.SOPHIE_ADULT_KID_COUNT ] < 5 ) {
					EngineCore.outputText( 'across from your daughter' );
					if( CoC.getInstance().flags[ kFLAGS.SOPHIE_ADULT_KID_COUNT ] > 1 ) {
						EngineCore.outputText( 's' );
					}
				} else {
					EngineCore.outputText( 'surrounded by your daughters' );
				}
				EngineCore.outputText( ', apparently trying to teach ' );
				if( CoC.getInstance().flags[ kFLAGS.SOPHIE_ADULT_KID_COUNT ] === 1 ) {
					EngineCore.outputText( 'her' );
				} else {
					EngineCore.outputText( 'them' );
				}
				EngineCore.outputText( ' about hunting and gathering techniques.  Considering their unusual upbringing, it can\'t be as easy for them...\n\n' );
			}
			EngineCore.addButton( 5, 'Sophie', CoC.getInstance().scenes.sophieFollowerScene.followerSophieMainScreen );
		}
		if( CoC.getInstance().flags[ kFLAGS.VALARIA_AT_CAMP ] === 1 ) {
			valeria2 = CoC.getInstance().scenes.valeria.valeriaFollower;
		}
		EngineCore.addButton( 0, 'Ember', ember );
		if( CoC.getInstance().scenes.helSpawnScene.helspawnFollower() ) {
			EngineCore.addButton( 1, CoC.getInstance().flags[ kFLAGS.HELSPAWN_NAME ], CoC.getInstance().scenes.helSpawnScene.helspawnsMainMenu );
		}
		EngineCore.addButton( 2, 'Jojo', jojoEvent );
		EngineCore.addButton( 3, 'Rathazul', rathazulEvent );
		EngineCore.addButton( 4, 'Shouldra', shouldra );
		//ABOVE: EngineCore.ddButton(4,"Sophie",followerSophieMainScreen);
		EngineCore.addButton( 6, 'Valeria', valeria2 );
		EngineCore.addButton( 9, 'Back', EventParser.playerMenu );
	};
	Camp.prototype.rest = function() {
		this.campQ = true;
		if( OnLoadVariables.timeQ === 0 ) {
			EngineCore.outputText( 'You lie down to rest for four hours.\n', true );
			OnLoadVariables.timeQ = 4;
			//Marble withdrawl
			if( CoC.getInstance().player.findStatusAffect( StatusAffects.MarbleWithdrawl ) >= 0 ) {
				EngineCore.outputText( '\nYour this.rest is very troubled, and you aren\'t able to settle down.  You get up feeling tired and unsatisfied, always thinking of Marble\'s milk.\n', false );
				EngineCore.HPChange( OnLoadVariables.timeQ * 5, true );
				EngineCore.dynStats( 'tou', -0.1, 'int', -0.1 );
				//fatigue
				EngineCore.fatigue( -2 * OnLoadVariables.timeQ );
				if( CoC.getInstance().player.findPerk( PerkLib.SpeedyRecovery ) >= 0 ) {
					EngineCore.fatigue( -1 * OnLoadVariables.timeQ );
				}
			}
			//REGULAR HP/FATIGUE RECOVERY
			else {
				EngineCore.HPChange( OnLoadVariables.timeQ * 10, true );
				//fatigue
				EngineCore.fatigue( -4 * OnLoadVariables.timeQ );
				if( CoC.getInstance().player.findPerk( PerkLib.SpeedyRecovery ) >= 0 ) {
					EngineCore.fatigue( -2 * OnLoadVariables.timeQ );
				}
			}
		} else {
			if( OnLoadVariables.timeQ !== 1 ) {
				EngineCore.outputText( 'You continue to rest for ' + Utils.num2Text( OnLoadVariables.timeQ ) + ' more hours.\n', true );
			} else {
				EngineCore.outputText( 'You continue to rest for another hour.\n', true );
			}
		}
		EventParser.goNext( OnLoadVariables.timeQ, true );
	};
	Camp.prototype.doWait = function() {
		this.campQ = true;
		EngineCore.outputText( '', true );
		if( OnLoadVariables.timeQ === 0 ) {
			EngineCore.outputText( 'You wait four hours...\n', false );
			OnLoadVariables.timeQ = 4;
			//Marble withdrawl
			if( CoC.getInstance().player.findStatusAffect( StatusAffects.MarbleWithdrawl ) >= 0 ) {
				EngineCore.outputText( '\nYour time spent waiting is very troubled, and you aren\'t able to settle down.  You get up feeling tired and unsatisfied, always thinking of Marble\'s milk.\n', false );
				//fatigue
				EngineCore.fatigue( -1 * OnLoadVariables.timeQ );
				if( CoC.getInstance().player.findPerk( PerkLib.SpeedyRecovery ) >= 0 ) {
					EngineCore.fatigue( -0.5 * OnLoadVariables.timeQ );
				}
			}
			//REGULAR HP/FATIGUE RECOVERY
			else {
				//fatigue
				EngineCore.fatigue( -2 * OnLoadVariables.timeQ );
				if( CoC.getInstance().player.findPerk( PerkLib.SpeedyRecovery ) >= 0 ) {
					EngineCore.fatigue( -1 * OnLoadVariables.timeQ );
				}
			}
		} else {
			if( OnLoadVariables.timeQ !== 1 ) {
				EngineCore.outputText( 'You continue to wait for ' + Utils.num2Text( OnLoadVariables.timeQ ) + ' more hours.\n', false );
			} else {
				EngineCore.outputText( 'You continue to wait for another hour.\n', false );
			}
		}
		EventParser.goNext( OnLoadVariables.timeQ, true );
	};
	Camp.prototype.doSleep = function( clrScreen ) {
		if( clrScreen === undefined ) {
			clrScreen = true;
		}
		if( CoC.getInstance().scenes.urta.pregnancy.incubation === 0 && CoC.getInstance().scenes.urta.pregnancy.type === PregnancyStore.PREGNANCY_PLAYER && CoC.getInstance().time.hours >= 20 && CoC.getInstance().time.hours < 2 ) {
			CoC.getInstance().scenes.urtaPregs.preggoUrtaGivingBirth();
			return;
		}
		this.campQ = true;
		if( OnLoadVariables.timeQ === 0 ) {
			if( CoC.getInstance().time.hours === 21 ) {
				OnLoadVariables.timeQ = 9;
			}
			if( CoC.getInstance().time.hours === 22 ) {
				OnLoadVariables.timeQ = 8;
			}
			if( CoC.getInstance().time.hours >= 23 ) {
				OnLoadVariables.timeQ = 7;
			}
			if( CoC.getInstance().time.hours === 0 ) {
				OnLoadVariables.timeQ = 6;
			}
			if( CoC.getInstance().time.hours === 1 ) {
				OnLoadVariables.timeQ = 5;
			}
			if( CoC.getInstance().time.hours === 2 ) {
				OnLoadVariables.timeQ = 4;
			}
			if( CoC.getInstance().time.hours === 3 ) {
				OnLoadVariables.timeQ = 3;
			}
			if( CoC.getInstance().time.hours === 4 ) {
				OnLoadVariables.timeQ = 2;
			}
			if( CoC.getInstance().time.hours === 5 ) {
				OnLoadVariables.timeQ = 1;
			}
			//Autosave stuff
			if( CoC.getInstance().player.slotName !== 'VOID' && CoC.getInstance().player.autoSave && MainView.getButtonText( 0 ) !== 'Game Over' ) {
				$log.info( 'Autosaving to slot: ' + CoC.getInstance().player.slotName );
				CoC.getInstance().saves.saveGame( CoC.getInstance().player.slotName );
			}
			//Clear screen
			if( clrScreen ) {
				EngineCore.outputText( '', true );
			}
			/******************************************************************/
			/*       ONE TIME SPECIAL EVENTS                                  */
			/******************************************************************/
			//HEL SLEEPIES!
			if( CoC.getInstance().scenes.helFollower.helAffection() >= 70 && CoC.getInstance().flags[ kFLAGS.HEL_REDUCED_ENCOUNTER_RATE ] === 0 && CoC.getInstance().flags[ kFLAGS.HEL_FOLLOWER_LEVEL ] === 0 ) {
				CoC.getInstance().scenes.dungeonHelSupplimental.heliaDiscovery();
				this.sleepRecovery( false );
				return;
			}
			//Shouldra xgartuan fight
			if( CoC.getInstance().player.hasCock() && CoC.getInstance().scenes.shouldraFollower.followerShouldra() && CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 1 ) {
				if( CoC.getInstance().flags[ kFLAGS.SHOULDRA_EXGARTUDRAMA ] === 0 ) {
					CoC.getInstance().scenes.shouldraFollower.shouldraAndExgartumonFightGottaCatchEmAll();
					this.sleepRecovery( false );
					return;
				} else if( CoC.getInstance().flags[ kFLAGS.SHOULDRA_EXGARTUDRAMA ] === 3 ) {
					CoC.getInstance().scenes.shouldraFollower.exgartuMonAndShouldraShowdown();
					this.sleepRecovery( false );
					return;
				}
			}
			if( CoC.getInstance().player.hasCock() && CoC.getInstance().scenes.shouldraFollower.followerShouldra() && CoC.getInstance().flags[ kFLAGS.SHOULDRA_EXGARTUDRAMA ] === -0.5 ) {
				CoC.getInstance().scenes.shouldraFollower.keepShouldraPartIIExgartumonsUndeatH();
				this.sleepRecovery( false );
				return;
			}
			/******************************************************************/
			/*       SLEEP WITH SYSTEM GOOOO                                  */
			/******************************************************************/
			//Marble Sleepies
			if( CoC.getInstance().scenes.marbleScene.marbleAtCamp() && CoC.getInstance().player.findStatusAffect( StatusAffects.CampMarble ) >= 0 && CoC.getInstance().flags[ kFLAGS.SLEEP_WITH ] === 'Marble' && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_MARBLE ] === 0 ) {
				if( CoC.getInstance().scenes.marbleScene.marbleNightSleepFlavor() ) {
					this.sleepRecovery( false );
					return;
				}
			} else if( CoC.getInstance().flags[ kFLAGS.SLEEP_WITH ] === 'Arian' && CoC.getInstance().scenes.arianScene.arianFollower() ) {
				CoC.getInstance().scenes.arianScene.sleepWithArian();
				return;
			} else if( CoC.getInstance().flags[ kFLAGS.SLEEP_WITH ] === 'Sophie' && (CoC.getInstance().scenes.sophieBimbo.bimboSophie() || CoC.getInstance().scenes.sophieFollowerScene.sophieFollower()) && CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_SOPHIE ] === 0 ) {
				//Night Time Snuggle Alerts!*
				//(1)
				if( Utils.rand( 4 ) === 0 ) {
					EngineCore.outputText( 'You curl up next to Sophie, planning to sleep for ' + Utils.num2Text( OnLoadVariables.timeQ ) + ' hour' );
					if( OnLoadVariables.timeQ > 1 ) {
						EngineCore.outputText( 's' );
					}
					EngineCore.outputText( '.  She wraps her feathery arms around you and nestles her chin into your shoulder.  Her heavy breasts cushion flat against your back as she gives you a rather chaste peck on the cheek and drifts off towards dreamland...' );
				}
				//(2)
				else if( Utils.rand( 3 ) === 0 ) {
					EngineCore.outputText( 'While you\'re getting ready for bed, you see that Sophie has already beaten you there.  She\'s sprawled out on her back with her arms outstretched, making little beckoning motions towards the valley of her cleavage.  You snuggle in against her, her pillowy breasts supporting your head and her familiar heartbeat drumming you to sleep for ' + Utils.num2Text( OnLoadVariables.timeQ ) + ' hour' );
					if( OnLoadVariables.timeQ > 1 ) {
						EngineCore.outputText( 's' );
					}
					EngineCore.outputText( '.' );
				}
				//(3)
				else if( Utils.rand( 2 ) === 0 ) {
					EngineCore.outputText( 'As you lay down to sleep for ' + Utils.num2Text( OnLoadVariables.timeQ ) + ' hour' );
					if( OnLoadVariables.timeQ > 1 ) {
						EngineCore.outputText( 's' );
					}
					EngineCore.outputText( ', you find the harpy-girl, Sophie, snuggling herself under her blankets with you.  She slips in between your arms and guides your hands to her enormous breasts, her backside already snug against your loins.  She whispers, "<i>Something to think about for next morning...  Sweet dreams.</i>" as she settles in for the night.' );
				}
				//(4)
				else {
					EngineCore.outputText( 'Sophie climbs under the sheets with you when you go to sleep, planning on resting for ' + Utils.num2Text( OnLoadVariables.timeQ ) + ' hour' );
					if( OnLoadVariables.timeQ > 1 ) {
						EngineCore.outputText( 's' );
					}
					EngineCore.outputText( '.  She sleeps next to you, just barely touching you.  You rub her shoulder affectionately before the two of you nod off.' );
				}
				EngineCore.outputText( '\n' );
			} else {
				if( CoC.getInstance().flags[ kFLAGS.SLEEP_WITH ] === 'Helia' && CoC.getInstance().scenes.helScene.followerHel() ) {
					EngineCore.outputText( 'You curl up next to Helia, planning to sleep for ' + Utils.num2Text( OnLoadVariables.timeQ ) + ' ' );
				}
				//Normal sleep message
				else {
					EngineCore.outputText( 'You curl up, planning to sleep for ' + Utils.num2Text( OnLoadVariables.timeQ ) + ' ', false );
				}
				if( OnLoadVariables.timeQ === 1 ) {
					EngineCore.outputText( 'hour.\n', false );
				} else {
					EngineCore.outputText( 'hours.\n', false );
				}
			}
			this.sleepRecovery( true );
		} else {
			if( OnLoadVariables.timeQ !== 1 ) {
				EngineCore.outputText( 'You lie down to resume sleeping for the remaining ' + Utils.num2Text( OnLoadVariables.timeQ ) + ' hours.\n', true );
			} else {
				EngineCore.outputText( 'You lie down to resume sleeping for the remaining hour.\n', true );
			}
		}
		EventParser.goNext( OnLoadVariables.timeQ, true );
	};
	//For shit that breaks normal sleep processing.
	Camp.prototype.sleepWrapper = function() {
		if( CoC.getInstance().time.hours === 16 ) {
			OnLoadVariables.timeQ = 14;
		}
		if( CoC.getInstance().time.hours === 17 ) {
			OnLoadVariables.timeQ = 13;
		}
		if( CoC.getInstance().time.hours === 18 ) {
			OnLoadVariables.timeQ = 12;
		}
		if( CoC.getInstance().time.hours === 19 ) {
			OnLoadVariables.timeQ = 11;
		}
		if( CoC.getInstance().time.hours === 20 ) {
			OnLoadVariables.timeQ = 10;
		}
		if( CoC.getInstance().time.hours === 21 ) {
			OnLoadVariables.timeQ = 9;
		}
		if( CoC.getInstance().time.hours === 22 ) {
			OnLoadVariables.timeQ = 8;
		}
		if( CoC.getInstance().time.hours >= 23 ) {
			OnLoadVariables.timeQ = 7;
		}
		if( CoC.getInstance().time.hours === 0 ) {
			OnLoadVariables.timeQ = 6;
		}
		if( CoC.getInstance().time.hours === 1 ) {
			OnLoadVariables.timeQ = 5;
		}
		if( CoC.getInstance().time.hours === 2 ) {
			OnLoadVariables.timeQ = 4;
		}
		if( CoC.getInstance().time.hours === 3 ) {
			OnLoadVariables.timeQ = 3;
		}
		if( CoC.getInstance().time.hours === 4 ) {
			OnLoadVariables.timeQ = 2;
		}
		if( CoC.getInstance().time.hours === 5 ) {
			OnLoadVariables.timeQ = 1;
		}
		EngineCore.clearOutput();
		if( OnLoadVariables.timeQ !== 1 ) {
			EngineCore.outputText( 'You lie down to resume sleeping for the remaining ' + Utils.num2Text( OnLoadVariables.timeQ ) + ' hours.\n', true );
		} else {
			EngineCore.outputText( 'You lie down to resume sleeping for the remaining hour.\n', true );
		}
		this.sleepRecovery( true );
		EventParser.goNext( OnLoadVariables.timeQ, true );
	};
	Camp.prototype.sleepRecovery = function( display ) {
		//Marble withdrawl
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.MarbleWithdrawl ) >= 0 ) {
			if( display ) {
				EngineCore.outputText( '\nYour sleep is very troubled, and you aren\'t able to settle down.  You get up feeling tired and unsatisfied, always thinking of Marble\'s milk.\n', false );
			}
			EngineCore.HPChange( OnLoadVariables.timeQ * 10, true );
			EngineCore.dynStats( 'tou', -0.1, 'int', -0.1 );
			//fatigue
			EngineCore.fatigue( -Math.ceil( CoC.getInstance().player.fatigue / 2 ) );
			if( CoC.getInstance().player.findPerk( PerkLib.SpeedyRecovery ) >= 0 ) {
				EngineCore.fatigue( -Math.ceil( CoC.getInstance().player.fatigue / 4 ) );
			}
		}
		//Mino withdrawal
		else if( CoC.getInstance().flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_STATE ] === 3 ) {
			if( display ) {
				EngineCore.outputText( '\nYou spend much of the night tossing and turning, aching for a taste of minotaur cum.\n', false );
			}
			EngineCore.HPChange( OnLoadVariables.timeQ * 15, true );
			EngineCore.fatigue( -Math.ceil( CoC.getInstance().player.fatigue / 2 ) );
			if( CoC.getInstance().player.findPerk( PerkLib.SpeedyRecovery ) >= 0 ) {
				EngineCore.fatigue( -Math.ceil( CoC.getInstance().player.fatigue / 4 ) );
			}
		}
		//REGULAR HP/FATIGUE RECOVERY
		else {
			EngineCore.HPChange( OnLoadVariables.timeQ * 20, display );
			//fatigue
			EngineCore.fatigue( -CoC.getInstance().player.fatigue );
		}
	};
	Camp.prototype.dungeonFound = function() { //Returns true as soon as any known dungeon is found
		if( CoC.getInstance().flags[ kFLAGS.DISCOVERED_DUNGEON_2_ZETAZ ] > 0 ) {
			return true;
		}
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.FoundFactory ) >= 0 ) {
			return true;
		}
		if( CoC.getInstance().flags[ kFLAGS.DISCOVERED_WITCH_DUNGEON ] > 0 ) {
			return true;
		}
		if( CoC.getInstance().flags[ kFLAGS.D3_DISCOVERED ] > 0 ) {
			return true;
		}
		return false;
	};
	Camp.prototype.farmFound = function() { //Returns true as soon as any known dungeon is found
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.MetWhitney ) >= 0 && CoC.getInstance().player.statusAffectv1( StatusAffects.MetWhitney ) > 1 ) {
			if( CoC.getInstance().flags[ kFLAGS.FARM_DISABLED ] === 0 ) {
				return true;
			}
			if( CoC.getInstance().player.cor >= 70 && CoC.getInstance().player.level >= 12 && CoC.getInstance().scenes.farm.farmCorruption.corruptFollowers() >= 2 && CoC.getInstance().flags[ kFLAGS.FARM_CORRUPTION_DISABLED ] === 0 ) {
				return true;
			}
		}
		if( CoC.getInstance().flags[ kFLAGS.FARM_CORRUPTION_STARTED ] ) {
			return true;
		}
		return false;
	};
	Camp.prototype.placesKnown = function() { //Returns true as soon as any known place is found
		if( CoC.getInstance().flags[ kFLAGS.BAZAAR_ENTERED ] > 0 ) {
			return true;
		}
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.BoatDiscovery ) >= 0 ) {
			return true;
		}
		if( CoC.getInstance().flags[ kFLAGS.FOUND_CATHEDRAL ] === 1 ) {
			return true;
		}
		if( this.dungeonFound() ) {
			return true;
		}
		if( this.farmFound() ) {
			return true;
		}
		if( CoC.getInstance().flags[ kFLAGS.OWCA_UNLOCKED ] === 1 ) {
			return true;
		}
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.HairdresserMeeting ) >= 0 ) {
			return true;
		}
		if( CoC.getInstance().player.statusAffectv1( StatusAffects.TelAdre ) >= 1 ) {
			return true;
		}
		if( CoC.getInstance().flags[ kFLAGS.AMILY_VILLAGE_ACCESSIBLE ] > 0 ) {
			return true;
		}
		if( CoC.getInstance().flags[ kFLAGS.MET_MINERVA ] >= 4 ) {
			return true;
		}
		return false;
	};
	//Places menu
	Camp.prototype.places = function() { //Displays a menu for all known places
		if( CoC.getInstance().flags[ kFLAGS.PLACES_PAGE ] !== 0 ) {
			this.placesPage2();
			return;
		}
		EngineCore.menu();
		if( CoC.getInstance().flags[ kFLAGS.BAZAAR_ENTERED ] > 0 ) {
			EngineCore.addButton( 0, 'Bazaar', CoC.getInstance().scenes.bazaar.enterTheBazaar );
		}
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.BoatDiscovery ) >= 0 ) {
			EngineCore.addButton( 1, 'Boat', CoC.getInstance().scenes.boat.boatExplore );
		}
		if( CoC.getInstance().flags[ kFLAGS.FOUND_CATHEDRAL ] === 1 ) {
			if( CoC.getInstance().flags[ kFLAGS.GAR_NAME ] === 0 ) {
				EngineCore.addButton( 2, 'Cathedral', CoC.getInstance().scenes.gargoyle.gargoylesTheShowNowOnWBNetwork );
			} else {
				EngineCore.addButton( 2, 'Cathedral', CoC.getInstance().scenes.gargoyle.returnToCathedral );
			}
		}
		if( this.dungeonFound() ) {
			EngineCore.addButton( 3, 'Dungeons', this.dungeons );
		}
		EngineCore.addButton( 4, 'Next', this.placesPage2 );
		if( this.farmFound() ) {
			EngineCore.addButton( 5, 'Farm', CoC.getInstance().scenes.farm.farmExploreEncounter );
		}
		if( CoC.getInstance().flags[ kFLAGS.OWCA_UNLOCKED ] === 1 ) {
			EngineCore.addButton( 6, 'Owca', CoC.getInstance().scenes.owca.gangbangVillageStuff );
		}
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.HairdresserMeeting ) >= 0 ) {
			EngineCore.addButton( 7, 'Salon', CoC.getInstance().scenes.mountain.salon.salonGreeting );
		}
		if( CoC.getInstance().player.statusAffectv1( StatusAffects.TelAdre ) >= 1 ) {
			EngineCore.addButton( 8, 'Tel\'Adre', CoC.getInstance().scenes.telAdre.telAdreMenu );
		}
		EngineCore.addButton( 9, 'Back', EventParser.playerMenu );
	};
	Camp.prototype.placesPage2 = function() {
		EngineCore.menu();
		CoC.getInstance().flags[ kFLAGS.PLACES_PAGE ] = 1;
		//turn on ruins
		if( CoC.getInstance().flags[ kFLAGS.AMILY_VILLAGE_ACCESSIBLE ] > 0 ) {
			EngineCore.addButton( 0, 'TownRuins', CoC.getInstance().scenes.amilyScene.exploreVillageRuin );
		}
		if( CoC.getInstance().flags[ kFLAGS.MET_MINERVA ] >= 4 ) {
			EngineCore.addButton( 1, 'Oasis Tower', CoC.getInstance().scenes.highMountains.minervaScene.encounterMinerva );
		}
		EngineCore.addButton( 4, 'Previous', this.placesToPage1 );
		EngineCore.addButton( 9, 'Back', EventParser.playerMenu );
	};
	Camp.prototype.placesToPage1 = function() {
		CoC.getInstance().flags[ kFLAGS.PLACES_PAGE ] = 0;
		this.places();
	};
	Camp.prototype.dungeons = function() {
		EngineCore.menu();
		//Turn on dungeons
		if( CoC.getInstance().flags[ kFLAGS.DISCOVERED_DUNGEON_2_ZETAZ ] > 0 ) {
			EngineCore.addButton( 0, 'Deep Cave', CoC.getInstance().scenes.dungeon2Supplimental.enterZetazsLair );
		}
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.FoundFactory ) >= 0 ) {
			EngineCore.addButton( 1, 'Factory', CoC.getInstance().scenes.dungeonCore.enterFactory );
		}
		if( CoC.getInstance().flags[ kFLAGS.DISCOVERED_WITCH_DUNGEON ] > 0 ) {
			EngineCore.addButton( 2, 'Desert Cave', CoC.getInstance().scenes.dungeonSandwitch.enterBoobsDungeon );
		}
		if( CoC.getInstance().flags[ kFLAGS.D3_DISCOVERED ] > 0 ) {
			EngineCore.addButton( 3, 'Stronghold', CoC.getInstance().scenes.d3.enterD3 );
		}
		EngineCore.addButton( 9, 'Back', this.places );
	};
	Camp.prototype.exgartuanCampUpdate = function() {
		//Update Exgartuan stuff
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.Exgartuan ) >= 0 ) {
			$log.debug( 'EXGARTUAN V1: ' + CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) + ' V2: ' + CoC.getInstance().player.statusAffectv2( StatusAffects.Exgartuan ) );
			//if too small dick, remove him
			if( CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 1 && (CoC.getInstance().player.cockArea( 0 ) < 100 || CoC.getInstance().player.cocks.length === 0) ) {
				EngineCore.outputText( '', true );
				EngineCore.outputText( '<b>You suddenly feel the urge to urinate, and stop over by some bushes.  It takes wayyyy longer than normal, and once you\'ve finished, you realize you\'re alone with yourself for the first time in a long time.', false );
				if( CoC.getInstance().player.hasCock() ) {
					EngineCore.outputText( '  Perhaps you got too small for Exgartuan to handle?</b>\n', false );
				} else {
					EngineCore.outputText( '  It looks like the demon didn\'t want to stick around without your manhood.</b>\n', false );
				}
				CoC.getInstance().player.removeStatusAffect( StatusAffects.Exgartuan );
			}
			//Tit removal
			else if( CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 2 && CoC.getInstance().player.biggestTitSize() < 12 ) {
				EngineCore.outputText( '', true );
				EngineCore.outputText( '<b>Black milk dribbles from your ' + Descriptors.nippleDescript( 0 ) + '.  It immediately dissipates into the air, leaving you feeling alone.  It looks like you became too small for Exgartuan!\n</b>', false );
				CoC.getInstance().player.removeStatusAffect( StatusAffects.Exgartuan );
			}
		}
		EngineCore.doNext( EventParser.playerMenu );
	};
	CoC.getInstance().registerScene('camp', new Camp());
} );