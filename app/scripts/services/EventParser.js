'use strict';

angular.module( 'cocjs' ).factory( 'EventParser', function( $log, $rootScope, OnLoadVariables, CoC, MainView, CharCreation, kFLAGS, EngineCore, WeaponLib, ArmorLib, CockTypesEnum, StatusAffects, ConsumableLib, Combat, PerkLib, Utils, Descriptors ) {
	var EventParser = {};
	EventParser.playerMenu = function() {
		if( !CoC.getInstance().isInCombat() ) {
			EngineCore.spriteSelect( -1 );
		}
		MainView.setMenuButton( MainView.MENU_NEW_MAIN, 'New Game', CharCreation.newGameGo );
		MainView.nameBox.visible = false;
		if( CoC.getInstance().gameState === 1 || CoC.getInstance().gameState === 2 ) {
			Combat.combatMenu();
			return;
		}
		//Clear restriction on item overlaps if not in combat
		OnLoadVariables.plotFight = false;
		if( CoC.getInstance().scenes.dungeonCore.isInDungeon() ) {
			CoC.getInstance().scenes.dungeonCore.dungeonMenu();
			return;
		} else if( OnLoadVariables.inRoomedDungeon ) {
			if( OnLoadVariables.inRoomedDungeonResume !== null ) {
				OnLoadVariables.inRoomedDungeonResume();
			}
			return;
		}
		CoC.getInstance().flags[ kFLAGS.PLAYER_PREGGO_WITH_WORMS ] = 0;
		CoC.getInstance().scenes.camp.doCamp(); // TODO : Put this in camp scene.
	};
	EventParser.gameOver = function( clear ) { //Leaves text on screen unless clear is set to true
		if( clear ) {
			EngineCore.clearOutput();
		}
		EngineCore.outputText( '\n\n<b>GAME OVER</b>' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Game Over', EventParser.gameOverMenuOverride );
		EngineCore.addButton( 3, 'NewGamePlus', CharCreation.newGamePlus );
		if( CoC.getInstance().flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] === 1 ) {
			EngineCore.addButton( 4, 'Debug Cheat', EventParser.playerMenu );
		}
		EventParser.gameOverMenuOverride();
		CoC.getInstance().setInCombat( false );
		OnLoadVariables.dungeonLoc = 0; //Replaces inDungeon = false;
	};
	EventParser.gameOverMenuOverride = function() { //Game over event; override whatever the fuck has been done to the UI up to this point to force display of the data and new game buttons
		MainView.showMenuButton( MainView.MENU_NEW_MAIN );
		MainView.showMenuButton( MainView.MENU_DATA );
		MainView.hideMenuButton( MainView.MENU_APPEARANCE );
		MainView.hideMenuButton( MainView.MENU_LEVEL );
		MainView.hideMenuButton( MainView.MENU_PERKS );
	};
	EventParser.getCurrentStackTrace = function() {
		var tempError = new Error();
		return tempError.getStackTrace();
	};
	EventParser.errorPrint = function( details ) {
		EngineCore.rawOutputText( '<b>Congratulations, you\'ve found a bug!</b>', true );
		EngineCore.rawOutputText( '\nError event!' );
		EngineCore.rawOutputText( '\n\nPlease report that you had an issue with code: "' + details + '" ' );
		EngineCore.rawOutputText( '\nGame version: "' + CoC.getInstance().ver + '" (<b>THIS IS IMPORTANT! Please be sure you include it!</b>) ' );
		var sTrace = EventParser.getCurrentStackTrace();
		if( sTrace ) {	// Fuck, stack-traces only work in the debug player.
			EngineCore.rawOutputText( 'and stack-trace <pre>' + sTrace + '</pre>\n' );
		}
		EngineCore.rawOutputText( 'to fake-name on the forums or better yet, file a bug report on github: ' );
		EngineCore.rawOutputText( '\nhttps://github.com/adamrpc/cocjs' );
		EngineCore.rawOutputText( '\nPlease try to include the details of what you were doing when you encountered this bug ' );
		if( sTrace ) {
			EngineCore.rawOutputText( ' (including the above stack trace copy&pasted into the details),' );
		}
		EngineCore.rawOutputText( ' to make tracking the issue down easier. Thanks!' );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	//Argument is time passed.  Pass to event parser if nothing happens.
	// The time argument is never actually used atm, everything is done with timeQ instead...
	EventParser.goNext = function( time, needNext ) {
		while( OnLoadVariables.timeQ > 0 ) {
			OnLoadVariables.timeQ--;
			CoC.getInstance().time.hours++;
			CoC.getInstance().player.genderCheck();
			Combat.regeneration( false );
			//Inform all time aware classes that a new hour has arrived
			$rootScope.$broadcast( 'time-change' );
			if( CoC.getInstance().time.hours > 23 ) {
				CoC.getInstance().time.hours = 0;
				CoC.getInstance().time.days++;
			} else if( CoC.getInstance().time.hours === 21 ) {
				EngineCore.outputText( '\nThe sky darkens as a starless night falls.  The blood-red moon slowly rises up over the horizon.\n' );
				needNext = true;
			} else if( CoC.getInstance().time.hours === 6 ) {
				EngineCore.outputText( '\nThe sky begins to grow brighter as the moon descends over distant mountains, casting a few last ominous shadows before they burn away in the light.\n' );
				needNext = true;
			}
			//BIG EVENTS GO IN HERE
			//BIG EVENTS GO IN HERE
			//BIG EVENTS GO IN HERE
			//BIG EVENTS GO IN HERE
			/* Inform all time aware classes that it's time for large events to trigger. Note that timeChangeLarge could be called multiple times in a single tick
			 of the clock, so any updates should happen in timeChange and any timeChangeLarge events need to make sure they cannot repeat within the same hour.
			 In effect these are the same rules the existing code acted under. */
			$rootScope.$broadcast( 'time-change-large' );
			//IMP GANGBAAAAANGA
			//The more imps you create, the more often you get gangraped.
			var temp = CoC.getInstance().player.statusAffectv1( StatusAffects.BirthedImps ) * 2;
			if( temp > 7 ) {
				temp = 7;
			}
			if( CoC.getInstance().player.findPerk( PerkLib.PiercedLethite ) >= 0 ) {
				temp += 4;
			}
			if( CoC.getInstance().player.inHeat ) {
				temp += 2;
			}
			if( CoC.getInstance().scenes.vapula.vapulaSlave() ) {
				temp += 7;
			}
			if( CoC.getInstance().time.hours === 2 ) {
				if( CoC.getInstance().time.days % 30 === 0 && CoC.getInstance().flags[ kFLAGS.ANEMONE_KID ] > 0 && CoC.getInstance().player.hasCock() && CoC.getInstance().flags[ kFLAGS.ANEMONE_WATCH ] > 0 && CoC.getInstance().flags[ kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS ] >= 40 ) {
					CoC.getInstance().scenes.anemoneScene.goblinNightAnemone();
					needNext = true;
				} else if( temp > Utils.rand( 100 ) && CoC.getInstance().player.findStatusAffect( StatusAffects.DefenseCanopy ) < 0 ) {
					if( CoC.getInstance().player.gender > 0 && (CoC.getInstance().player.findStatusAffect( StatusAffects.JojoNightWatch ) < 0 || CoC.getInstance().player.findStatusAffect( StatusAffects.PureCampJojo ) < 0) && (CoC.getInstance().flags[ kFLAGS.HEL_GUARDING ] === 0 || !CoC.getInstance().scenes.helFollower.followerHel()) && CoC.getInstance().flags[ kFLAGS.ANEMONE_WATCH ] === 0 && (CoC.getInstance().flags[ kFLAGS.HOLLI_DEFENSE_ON ] === 0 || CoC.getInstance().flags[ kFLAGS.FUCK_FLOWER_KILLED ] > 0) && (CoC.getInstance().flags[ kFLAGS.KIHA_CAMP_WATCH ] === 0 || !CoC.getInstance().scenes.kihaFollower.followerKiha()) ) {
						CoC.getInstance().scenes.impScene.impGangabangaEXPLOSIONS();
						EngineCore.doNext( EventParser.playerMenu );
						return true;
					} else if( CoC.getInstance().flags[ kFLAGS.KIHA_CAMP_WATCH ] > 0 && CoC.getInstance().scenes.kihaFollower.followerKiha() ) {
						EngineCore.outputText( '\n<b>You find charred imp carcasses all around the camp once you wake.  It looks like Kiha repelled a swarm of the little bastards.</b>\n' );
						needNext = true;
					} else if( CoC.getInstance().flags[ kFLAGS.HEL_GUARDING ] > 0 && CoC.getInstance().scenes.helFollower.followerHel() ) {
						EngineCore.outputText( '\n<b>Helia informs you over a mug of beer that she whupped some major imp asshole last night.  She wiggles her tail for emphasis.</b>\n' );
						needNext = true;
					} else if( CoC.getInstance().player.gender > 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.JojoNightWatch ) >= 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.PureCampJojo ) >= 0 ) {
						EngineCore.outputText( '\n<b>Jojo informs you that he dispatched a crowd of imps as they tried to sneak into camp in the night.</b>\n' );
						needNext = true;
					} else if( CoC.getInstance().flags[ kFLAGS.HOLLI_DEFENSE_ON ] > 0 ) {
						EngineCore.outputText( '\n<b>During the night, you hear distant screeches of surprise, followed by orgasmic moans.  It seems some imps found their way into Holli\'s canopy...</b>\n' );
						needNext = true;
					} else if( CoC.getInstance().flags[ kFLAGS.ANEMONE_WATCH ] > 0 ) {
						EngineCore.outputText( '\n<b>Your sleep is momentarily disturbed by the sound of tiny clawed feet skittering away in all directions.  When you sit up, you can make out Kid A holding a struggling, concussed imp in a headlock and wearing a famished expression.  You catch her eye and she sheepishly retreats to a more urbane distance before beginning her noisy meal.</b>\n' );
						needNext = true;
					}
				} else if( CoC.getInstance().flags[ kFLAGS.EVER_INFESTED ] === 1 && Utils.rand( 100 ) <= 4 && CoC.getInstance().player.hasCock() && CoC.getInstance().player.findStatusAffect( StatusAffects.Infested ) < 0 ) { //wormgasms
					if( CoC.getInstance().player.hasCock() && (CoC.getInstance().player.findStatusAffect( StatusAffects.JojoNightWatch ) < 0 || CoC.getInstance().player.findStatusAffect( StatusAffects.PureCampJojo ) < 0) && (CoC.getInstance().flags[ kFLAGS.HEL_GUARDING ] === 0 || !CoC.getInstance().scenes.helFollower.followerHel()) && CoC.getInstance().flags[ kFLAGS.ANEMONE_WATCH ] === 0 ) {
						CoC.getInstance().scenes.worms.nightTimeInfestation();
						return true;
					} else if( CoC.getInstance().flags[ kFLAGS.HEL_GUARDING ] > 0 && CoC.getInstance().scenes.helFollower.followerHel() ) {
						EngineCore.outputText( '\n<b>Helia informs you over a mug of beer that she stomped a horde of gross worms into paste.  She shudders after at the memory.</b>\n' );
						needNext = true;
					} else if( CoC.getInstance().player.gender > 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.JojoNightWatch ) >= 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.PureCampJojo ) >= 0 ) {
						EngineCore.outputText( '\n<b>Jojo informs you that he dispatched a horde of tiny, white worms as they tried to sneak into camp in the night.</b>\n' );
						needNext = true;
					} else if( CoC.getInstance().flags[ kFLAGS.ANEMONE_WATCH ] > 0 ) {
						EngineCore.outputText( '\n<b>Kid A seems fairly well fed in the morning, and you note a trail of slime leading off in the direction of the lake.</b>\n' ); // Yeah, blah blah travel weirdness. Quickfix so it seems logically correct.
						needNext = true;
					}
				}
			}
			//No diapause?  Normal!
			if( CoC.getInstance().player.findPerk( PerkLib.Diapause ) < 0 ) {
				if( CoC.getInstance().player.pregnancyAdvance() ) {
					needNext = true;
				} //Make sure pregnancy texts aren't hidden
				if( CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				//DOUBLE PREGGERS SPEED
				if( CoC.getInstance().player.findPerk( PerkLib.MaraesGiftFertility ) >= 0 ) {
					if( CoC.getInstance().player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				//DOUBLE PREGGERS SPEED
				if( CoC.getInstance().player.findPerk( PerkLib.MagicalFertility ) >= 0 ) {
					if( CoC.getInstance().player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				if( CoC.getInstance().player.findPerk( PerkLib.FerasBoonBreedingBitch ) >= 0 ) {
					if( CoC.getInstance().player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.getInstance().player.findPerk( PerkLib.FerasBoonWideOpen ) >= 0 || CoC.getInstance().player.findPerk( PerkLib.FerasBoonMilkingTwat ) >= 0 ) {
					if( CoC.getInstance().player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				//DOUBLE PREGGERS SPEED
				if( CoC.getInstance().player.findPerk( PerkLib.BroodMother ) >= 0 ) {
					if( CoC.getInstance().player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
			}
			//Diapause!
			else if( CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00228 ] > 0 && (CoC.getInstance().player.pregnancyIncubation > 0 || CoC.getInstance().player.buttPregnancyIncubation > 0) ) {
				if( CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00229 ] === 1 ) {
					CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00229 ] = 0;
					EngineCore.outputText( '\n\nYour body reacts to the influx of nutrition, accelerating your pregnancy. Your belly bulges outward slightly.', false );
					needNext = true;
				}
				if( CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				CoC.getInstance().flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00228 ]--;
				if( CoC.getInstance().player.pregnancyAdvance() ) {
					needNext = true;
				} //Make sure pregnancy texts aren't hidden
				if( CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				if( CoC.getInstance().player.pregnancyAdvance() ) {
					needNext = true;
				} //Make sure pregnancy texts aren't hidden
				if( CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				if( CoC.getInstance().player.pregnancyAdvance() ) {
					needNext = true;
				} //Make sure pregnancy texts aren't hidden
				if( CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				//DOUBLE PREGGERS SPEED
				if( CoC.getInstance().player.findPerk( PerkLib.MaraesGiftFertility ) >= 0 ) {
					if( CoC.getInstance().player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				//DOUBLE PREGGERS SPEED
				if( CoC.getInstance().player.findPerk( PerkLib.MagicalFertility ) >= 0 ) {
					if( CoC.getInstance().player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				if( CoC.getInstance().player.findPerk( PerkLib.FerasBoonBreedingBitch ) >= 0 ) {
					if( CoC.getInstance().player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.getInstance().player.findPerk( PerkLib.FerasBoonWideOpen ) >= 0 || CoC.getInstance().player.findPerk( PerkLib.FerasBoonMilkingTwat ) >= 0 ) {
					if( CoC.getInstance().player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				//DOUBLE PREGGERS SPEED
				if( CoC.getInstance().player.findPerk( PerkLib.BroodMother ) >= 0 ) {
					if( CoC.getInstance().player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.getInstance().flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
			}
			//Egg loot!
			if( CoC.getInstance().player.findStatusAffect( StatusAffects.LootEgg ) >= 0 ) {
				$log.debug( 'EGG LOOT HAS' );
				//default
				var itype =
					[
						[ ConsumableLib.BROWNEG, ConsumableLib.PURPLEG, ConsumableLib.BLUEEGG, ConsumableLib.PINKEGG, ConsumableLib.WHITEEG, ConsumableLib.BLACKEG ],
						[ ConsumableLib.L_BRNEG, ConsumableLib.L_PRPEG, ConsumableLib.L_BLUEG, ConsumableLib.L_PNKEG, ConsumableLib.L_WHTEG, ConsumableLib.L_BLKEG ] ]
						[ CoC.getInstance().player.statusAffect( CoC.getInstance().player.findStatusAffect( StatusAffects.Eggs ) ).value2 || 0 ][ CoC.getInstance().player.statusAffect( CoC.getInstance().player.findStatusAffect( StatusAffects.Eggs ) ).value1 || 0 ] ||
					ConsumableLib.BROWNEG;
				CoC.getInstance().player.removeStatusAffect( StatusAffects.LootEgg );
				CoC.getInstance().player.removeStatusAffect( StatusAffects.Eggs );
				$log.debug( 'TAKEY NAU' );
				CoC.getInstance().inventory.takeItem( itype, EventParser.playerMenu );
				return true;
			}
			// Benoit preggers update
			if( CoC.getInstance().flags[ kFLAGS.FEMOIT_EGGS ] > 0 ) {
				CoC.getInstance().flags[ kFLAGS.FEMOIT_INCUBATION ]--;
			} // We're not capping it, we're going to use negative values to figure out diff events
		}
		// Hanging the Uma massage update here, I think it should work...
		CoC.getInstance().scenes.umasShop.updateBonusDuration( time );
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.UmasMassage ) >= 0 ) {
			$log.info( 'Uma\'s massage bonus time remaining: ' + CoC.getInstance().player.statusAffectv3( StatusAffects.UmasMassage ) );
		}
		CoC.getInstance().scenes.izumiScenes.updateSmokeDuration( time );
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.IzumisPipeSmoke ) >= 0 ) {
			$log.info( 'Izumis pipe smoke time remaining: ' + CoC.getInstance().player.statusAffectv1( StatusAffects.IzumisPipeSmoke ) );
		}
		//Drop axe if too short!
		if( CoC.getInstance().player.tallness < 78 && CoC.getInstance().player.weapon === WeaponLib.L__AXE ) {
			EngineCore.outputText( '<b>\nThis axe is too large for someone of your stature to use, though you can keep it in your inventory until you are big enough.</b>\n' );
			CoC.getInstance().inventory.takeItem( CoC.getInstance().player.setWeapon( WeaponLib.FISTS ), EventParser.playerMenu );
			return true;
		}
		if( CoC.getInstance().player.weapon === WeaponLib.L_HAMMR && CoC.getInstance().player.tallness < 60 ) {
			EngineCore.outputText( '<b>\nYou\'ve become too short to use this hammer anymore.  You can still keep it in your inventory, but you\'ll need to be taller to effectively wield it.</b>\n' );
			CoC.getInstance().inventory.takeItem( CoC.getInstance().player.setWeapon( WeaponLib.FISTS ), EventParser.playerMenu );
			return true;
		}
		if( CoC.getInstance().player.weapon === WeaponLib.CLAYMOR && CoC.getInstance().player.str < 40 ) {
			EngineCore.outputText( '\n<b>You aren\'t strong enough to handle the weight of your weapon any longer, and you\'re forced to stop using it.</b>\n' );
			CoC.getInstance().inventory.takeItem( CoC.getInstance().player.setWeapon( WeaponLib.FISTS ), EventParser.playerMenu );
			return true;
		}
		if( CoC.getInstance().player.weapon === WeaponLib.WARHAMR && CoC.getInstance().player.str < 80 ) {
			EngineCore.outputText( '\n<b>You aren\'t strong enough to handle the weight of your weapon any longer!</b>\n' );
			CoC.getInstance().inventory.takeItem( CoC.getInstance().player.setWeapon( WeaponLib.FISTS ), EventParser.playerMenu );
			return true;
		}
		//Drop beautiful sword if corrupted!
		if( CoC.getInstance().player.weaponPerk === 'holySword' && CoC.getInstance().player.cor >= 35 ) {
			EngineCore.outputText( '<b>\nThe <u>' + CoC.getInstance().player.weaponName + '</u> grows hot in your hand, until you are forced to drop it.  Whatever power inhabits this blade appears to be unhappy with you.  Touching it gingerly, you realize it is no longer hot, but as soon as you go to grab the hilt, it nearly burns you.\n\nYou realize you won\'t be able to use it right now, but you could probably keep it in your inventory.</b>\n\n' );
			CoC.getInstance().inventory.takeItem( CoC.getInstance().player.setWeapon( WeaponLib.FISTS ), EventParser.playerMenu );
			return true;
		}
		//Unequip Lusty maiden armor
		if( CoC.getInstance().player.armorName === 'lusty maiden\'s armor' ) {
			//Removal due to no longer fitting Cock or Balls
			if( CoC.getInstance().player.hasCock() || CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( '\nYou fidget uncomfortably in the g-string of your lewd bikini - there simply isn\'t enough room for your ' );
				if( CoC.getInstance().player.hasCock() ) {
					EngineCore.outputText( 'maleness' );
				} else {
					EngineCore.outputText( 'bulgy balls' );
				}
				EngineCore.outputText( ' within the imprisoning leather, and it actually hurts to wear it.  <b>You\'ll have to find some other form of protection!</b>\n\n' );
				CoC.getInstance().inventory.takeItem( CoC.getInstance().player.setArmor( ArmorLib.COMFORTABLE_UNDERCLOTHES ), EventParser.playerMenu );
				return true;
			}
			if( !CoC.getInstance().player.hasVagina() ) { //Lost pussy
				EngineCore.outputText( '\nYou fidget uncomfortably as the crease in the gusset of your lewd bikini digs into your sensitive, featureless loins.  There\'s simply no way you can continue to wear this outfit in comfort - it was expressly designed to press in on the female mons, and without a vagina, <b>you simply can\'t wear this exotic armor.</b>\n\n' );
				CoC.getInstance().inventory.takeItem( CoC.getInstance().player.setArmor( ArmorLib.COMFORTABLE_UNDERCLOTHES ), EventParser.playerMenu );
				return true;
			}
			if( CoC.getInstance().player.biggestTitSize() < 4 ) { //Tits gone or too small
				EngineCore.outputText( '\nThe fine chain that makes up your lewd bikini-top is dangling slack against your flattened chest.  Every movement and step sends it jangling noisily, slapping up against your [nipples], uncomfortably cold after being separated from your ' + CoC.getInstance().player.skinFurScales() + ' for so long.  <b>There\'s no two ways about it - you\'ll need to find something else to wear.</b>\n\n' );
				CoC.getInstance().inventory.takeItem( CoC.getInstance().player.setArmor( ArmorLib.COMFORTABLE_UNDERCLOTHES ), EventParser.playerMenu );
				return true;
			}
		}
		// update cock type as dog/fox depending on whether the player resembles one more than the other.
		// Previously used to be computed directly in cockNoun, but refactoring prevents access to the Player class when in cockNoun now.
		if( CoC.getInstance().player.totalCocks() !== 0 ) {
			_.forEach(CoC.getInstance().player.cocks, function(cock) {
				if( cock.cockType === CockTypesEnum.DOG || cock.cockType === CockTypesEnum.FOX ) {
					if( CoC.getInstance().player.dogScore() >= CoC.getInstance().player.foxScore() ) {
						cock.cockType = CockTypesEnum.DOG;
					} else {
						cock.cockType = CockTypesEnum.FOX;
					}
				}
			});
		}
		EngineCore.statScreenRefresh();
		if( needNext ) {
			EngineCore.doNext( EventParser.playerMenu );
			return true;
		}
		EventParser.playerMenu();
		return false;
	};
	EventParser.cheatTime = function( time ) {
		while( time > 0 ) {
			time--;
			CoC.getInstance().time.hours++;
			if( CoC.getInstance().time.hours > 23 ) {
				CoC.getInstance().time.days++;
				CoC.getInstance().time.hours = 0;
			}
		}
		EngineCore.statScreenRefresh();
	};
	EventParser.growHair = function( amount ) {
		if( amount === undefined ) {
			amount = 0.1;
		}
		//Grow hair!
		var oldHairLength = CoC.getInstance().player.hairLength;
		CoC.getInstance().player.hairLength += amount;
		if( CoC.getInstance().player.hairLength > 0 && oldHairLength === 0) {
			EngineCore.outputText( '\n<b>You are no longer bald.  You now have ' + Descriptors.hairDescript() + ' coating your head.\n</b>', false );
			return true;
		} else {
			var threshold = _.find([1, 3, 6, 10, 16, 26, 40], function(value) {
				return CoC.getInstance().player.hairLength >= value && oldHairLength < value;
			});
			if(threshold) {
				EngineCore.outputText( '\n<b>Your hair\'s growth has reached a new threshhold, giving you ' + Descriptors.hairDescript() + '.\n</b>', false );
				return true;
			}
		}
		return false;
	};
	return EventParser;
} );