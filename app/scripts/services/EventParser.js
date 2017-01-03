'use strict';

angular.module( 'cocjs' ).factory( 'EventParser', function( SceneLib, $log, $rootScope, OnLoadVariables, CoC, MainView, kFLAGS, EngineCore, WeaponLib, ArmorLib, CockTypesEnum, StatusAffects, ConsumableLib, Combat, PerkLib, Utils, Descriptors ) {
	var EventParser = {};

	EventParser.getCurrentStackTrace = function() {
		var tempError = new Error();
		return tempError.getStackTrace();
	};
	EventParser.errorPrint = function( details ) {
		MainView.clearOutput();
		MainView.setOutputText( '<b>Congratulations, you\'ve found a bug!</b>' );
		MainView.appendOutputText( '\nError event!' );
		MainView.appendOutputText( '\n\nPlease report that you had an issue with code: "' + details + '" ' );
		MainView.appendOutputText( '\nGame version: "' + CoC.ver + '" (<b>THIS IS IMPORTANT! Please be sure you include it!</b>) ' );
		var sTrace = EventParser.getCurrentStackTrace();
		if( sTrace ) {	// Fuck, stack-traces only work in the debug player.
			MainView.appendOutputText( 'and stack-trace <pre>' + sTrace + '</pre>\n' );
		}
		MainView.appendOutputText( 'to fake-name on the forums or better yet, file a bug report on github: ' );
		MainView.appendOutputText( '\nhttps://github.com/adamrpc/cocjs' );
		MainView.appendOutputText( '\nPlease try to include the details of what you were doing when you encountered this bug ' );
		if( sTrace ) {
			MainView.appendOutputText( ' (including the above stack trace copy&pasted into the details),' );
		}
		MainView.appendOutputText( ' to make tracking the issue down easier. Thanks!' );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Argument is time passed.  Pass to event parser if nothing happens.
	// The time argument is never actually used atm, everything is done with timeQ instead...
	EventParser.goNext = function( time, needNext ) {
		while( OnLoadVariables.timeQ > 0 ) {
			OnLoadVariables.timeQ--;
			CoC.time.hours++;
			CoC.player.genderCheck();
			Combat.regeneration( false );
			//Inform all time aware classes that a new hour has arrived
			$rootScope.$broadcast( 'time-change' );
			if( CoC.time.hours > 23 ) {
				CoC.time.hours = 0;
				CoC.time.days++;
			} else if( CoC.time.hours === 21 ) {
				MainView.outputText( '\nThe sky darkens as a starless night falls.  The blood-red moon slowly rises up over the horizon.\n' );
				needNext = true;
			} else if( CoC.time.hours === 6 ) {
				MainView.outputText( '\nThe sky begins to grow brighter as the moon descends over distant mountains, casting a few last ominous shadows before they burn away in the light.\n' );
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
			var temp = CoC.player.statusAffectv1( StatusAffects.BirthedImps ) * 2;
			if( temp > 7 ) {
				temp = 7;
			}
			if( CoC.player.findPerk( PerkLib.PiercedLethite ) ) {
				temp += 4;
			}
			if( CoC.player.inHeat ) {
				temp += 2;
			}
			if( SceneLib.vapula.vapulaSlave() ) {
				temp += 7;
			}
			if( CoC.time.hours === 2 ) {
				if( CoC.time.days % 30 === 0 && CoC.flags[ kFLAGS.ANEMONE_KID ] > 0 && CoC.player.hasCock() && CoC.flags[ kFLAGS.ANEMONE_WATCH ] > 0 && CoC.flags[ kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS ] >= 40 ) {
					SceneLib.anemoneScene.goblinNightAnemone();
					needNext = true;
				} else if( temp > Utils.rand( 100 ) && !CoC.player.findStatusAffect( StatusAffects.DefenseCanopy ) ) {
					if( CoC.player.gender > 0 && (!CoC.player.findStatusAffect( StatusAffects.JojoNightWatch ) || !CoC.player.findStatusAffect( StatusAffects.PureCampJojo )) && (CoC.flags[ kFLAGS.HEL_GUARDING ] === 0 || !SceneLib.helFollower.followerHel()) && CoC.flags[ kFLAGS.ANEMONE_WATCH ] === 0 && (CoC.flags[ kFLAGS.HOLLI_DEFENSE_ON ] === 0 || CoC.flags[ kFLAGS.FUCK_FLOWER_KILLED ] > 0) && (CoC.flags[ kFLAGS.KIHA_CAMP_WATCH ] === 0 || !SceneLib.kihaFollower.followerKiha()) ) {
						SceneLib.impScene.impGangabangaEXPLOSIONS();
						EngineCore.doNext( MainView, MainView.playerMenu );
						return true;
					} else if( CoC.flags[ kFLAGS.KIHA_CAMP_WATCH ] > 0 && SceneLib.kihaFollower.followerKiha() ) {
						MainView.outputText( '\n<b>You find charred imp carcasses all around the camp once you wake.  It looks like Kiha repelled a swarm of the little bastards.</b>\n' );
						needNext = true;
					} else if( CoC.flags[ kFLAGS.HEL_GUARDING ] > 0 && SceneLib.helFollower.followerHel() ) {
						MainView.outputText( '\n<b>Helia informs you over a mug of beer that she whupped some major imp asshole last night.  She wiggles her tail for emphasis.</b>\n' );
						needNext = true;
					} else if( CoC.player.gender > 0 && CoC.player.findStatusAffect( StatusAffects.JojoNightWatch ) && CoC.player.findStatusAffect( StatusAffects.PureCampJojo ) ) {
						MainView.outputText( '\n<b>Jojo informs you that he dispatched a crowd of imps as they tried to sneak into camp in the night.</b>\n' );
						needNext = true;
					} else if( CoC.flags[ kFLAGS.HOLLI_DEFENSE_ON ] > 0 ) {
						MainView.outputText( '\n<b>During the night, you hear distant screeches of surprise, followed by orgasmic moans.  It seems some imps found their way into Holli\'s canopy...</b>\n' );
						needNext = true;
					} else if( CoC.flags[ kFLAGS.ANEMONE_WATCH ] > 0 ) {
						MainView.outputText( '\n<b>Your sleep is momentarily disturbed by the sound of tiny clawed feet skittering away in all directions.  When you sit up, you can make out Kid A holding a struggling, concussed imp in a headlock and wearing a famished expression.  You catch her eye and she sheepishly retreats to a more urbane distance before beginning her noisy meal.</b>\n' );
						needNext = true;
					}
				} else if( CoC.flags[ kFLAGS.EVER_INFESTED ] === 1 && Utils.rand( 100 ) <= 4 && CoC.player.hasCock() && !CoC.player.findStatusAffect( StatusAffects.Infested ) ) { //wormgasms
					if( CoC.player.hasCock() && (!CoC.player.findStatusAffect( StatusAffects.JojoNightWatch ) || !CoC.player.findStatusAffect( StatusAffects.PureCampJojo )) && (CoC.flags[ kFLAGS.HEL_GUARDING ] === 0 || !SceneLib.helFollower.followerHel()) && CoC.flags[ kFLAGS.ANEMONE_WATCH ] === 0 ) {
						SceneLib.worms.nightTimeInfestation();
						return true;
					} else if( CoC.flags[ kFLAGS.HEL_GUARDING ] > 0 && SceneLib.helFollower.followerHel() ) {
						MainView.outputText( '\n<b>Helia informs you over a mug of beer that she stomped a horde of gross worms into paste.  She shudders after at the memory.</b>\n' );
						needNext = true;
					} else if( CoC.player.gender > 0 && CoC.player.findStatusAffect( StatusAffects.JojoNightWatch ) && CoC.player.findStatusAffect( StatusAffects.PureCampJojo ) ) {
						MainView.outputText( '\n<b>Jojo informs you that he dispatched a horde of tiny, white worms as they tried to sneak into camp in the night.</b>\n' );
						needNext = true;
					} else if( CoC.flags[ kFLAGS.ANEMONE_WATCH ] > 0 ) {
						MainView.outputText( '\n<b>Kid A seems fairly well fed in the morning, and you note a trail of slime leading off in the direction of the lake.</b>\n' ); // Yeah, blah blah travel weirdness. Quickfix so it seems logically correct.
						needNext = true;
					}
				}
			}
			//No diapause?  Normal!
			if( !CoC.player.findPerk( PerkLib.Diapause ) ) {
				if( CoC.player.pregnancyAdvance() ) {
					needNext = true;
				} //Make sure pregnancy texts aren't hidden
				if( CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				//DOUBLE PREGGERS SPEED
				if( CoC.player.findPerk( PerkLib.MaraesGiftFertility ) ) {
					if( CoC.player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				//DOUBLE PREGGERS SPEED
				if( CoC.player.findPerk( PerkLib.MagicalFertility ) ) {
					if( CoC.player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				if( CoC.player.findPerk( PerkLib.FerasBoonBreedingBitch ) ) {
					if( CoC.player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.player.findPerk( PerkLib.FerasBoonWideOpen ) || CoC.player.findPerk( PerkLib.FerasBoonMilkingTwat ) ) {
					if( CoC.player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				//DOUBLE PREGGERS SPEED
				if( CoC.player.findPerk( PerkLib.BroodMother ) ) {
					if( CoC.player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
			}
			//Diapause!
			else if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00228 ] > 0 && (CoC.player.pregnancyIncubation > 0 || CoC.player.buttPregnancyIncubation > 0) ) {
				if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00229 ] === 1 ) {
					CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00229 ] = 0;
					MainView.outputText( '\n\nYour body reacts to the influx of nutrition, accelerating your pregnancy. Your belly bulges outward slightly.', false );
					needNext = true;
				}
				if( CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00228 ]--;
				if( CoC.player.pregnancyAdvance() ) {
					needNext = true;
				} //Make sure pregnancy texts aren't hidden
				if( CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				if( CoC.player.pregnancyAdvance() ) {
					needNext = true;
				} //Make sure pregnancy texts aren't hidden
				if( CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				if( CoC.player.pregnancyAdvance() ) {
					needNext = true;
				} //Make sure pregnancy texts aren't hidden
				if( CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				//DOUBLE PREGGERS SPEED
				if( CoC.player.findPerk( PerkLib.MaraesGiftFertility ) ) {
					if( CoC.player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				//DOUBLE PREGGERS SPEED
				if( CoC.player.findPerk( PerkLib.MagicalFertility ) ) {
					if( CoC.player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				if( CoC.player.findPerk( PerkLib.FerasBoonBreedingBitch ) ) {
					if( CoC.player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.player.findPerk( PerkLib.FerasBoonWideOpen ) || CoC.player.findPerk( PerkLib.FerasBoonMilkingTwat ) ) {
					if( CoC.player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
				//DOUBLE PREGGERS SPEED
				if( CoC.player.findPerk( PerkLib.BroodMother ) ) {
					if( CoC.player.pregnancyAdvance() ) {
						needNext = true;
					} //Make sure pregnancy texts aren't hidden
				}
				if( CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] === 1 ) {
					CoC.flags[ kFLAGS.EVENT_PARSER_ESCAPE ] = 0;
					return true;
				}
			}
			//Egg loot!
			if( CoC.player.findStatusAffect( StatusAffects.LootEgg ) ) {
				$log.debug( 'EGG LOOT HAS' );
				//default
				var itype =
					[
						[ ConsumableLib.BROWNEG, ConsumableLib.PURPLEG, ConsumableLib.BLUEEGG, ConsumableLib.PINKEGG, ConsumableLib.WHITEEG, ConsumableLib.BLACKEG ],
						[ ConsumableLib.L_BRNEG, ConsumableLib.L_PRPEG, ConsumableLib.L_BLUEG, ConsumableLib.L_PNKEG, ConsumableLib.L_WHTEG, ConsumableLib.L_BLKEG ] ]
						[ CoC.player.statusAffect( CoC.player.findStatusAffect( StatusAffects.Eggs ) ).value2 || 0 ][ CoC.player.statusAffect( CoC.player.findStatusAffect( StatusAffects.Eggs ) ).value1 || 0 ] ||
					ConsumableLib.BROWNEG;
				CoC.player.removeStatusAffect( StatusAffects.LootEgg );
				CoC.player.removeStatusAffect( StatusAffects.Eggs );
				$log.debug( 'TAKEY NAU' );
				SceneLib.inventory.takeItem( itype, MainView.playerMenu );
				return true;
			}
			// Benoit preggers update
			if( CoC.flags[ kFLAGS.FEMOIT_EGGS ] > 0 ) {
				CoC.flags[ kFLAGS.FEMOIT_INCUBATION ]--;
			} // We're not capping it, we're going to use negative values to figure out diff events
		}
		// Hanging the Uma massage update here, I think it should work...
		SceneLib.umasShop.updateBonusDuration( time );
		if( CoC.player.findStatusAffect( StatusAffects.UmasMassage ) ) {
			$log.info( 'Uma\'s massage bonus time remaining: ' + CoC.player.statusAffectv3( StatusAffects.UmasMassage ) );
		}
		SceneLib.izumiScene.updateSmokeDuration( time );
		if( CoC.player.findStatusAffect( StatusAffects.IzumisPipeSmoke ) ) {
			$log.info( 'Izumis pipe smoke time remaining: ' + CoC.player.statusAffectv1( StatusAffects.IzumisPipeSmoke ) );
		}
		//Drop axe if too short!
		if( CoC.player.tallness < 78 && CoC.player.weapon === WeaponLib.L__AXE ) {
			MainView.outputText( '<b>\nThis axe is too large for someone of your stature to use, though you can keep it in your inventory until you are big enough.</b>\n' );
			SceneLib.inventory.takeItem( CoC.player.setWeapon( WeaponLib.FISTS ), MainView.playerMenu );
			return true;
		}
		if( CoC.player.weapon === WeaponLib.L_HAMMR && CoC.player.tallness < 60 ) {
			MainView.outputText( '<b>\nYou\'ve become too short to use this hammer anymore.  You can still keep it in your inventory, but you\'ll need to be taller to effectively wield it.</b>\n' );
			SceneLib.inventory.takeItem( CoC.player.setWeapon( WeaponLib.FISTS ), MainView.playerMenu );
			return true;
		}
		if( CoC.player.weapon === WeaponLib.CLAYMOR && CoC.player.str < 40 ) {
			MainView.outputText( '\n<b>You aren\'t strong enough to handle the weight of your weapon any longer, and you\'re forced to stop using it.</b>\n' );
			SceneLib.inventory.takeItem( CoC.player.setWeapon( WeaponLib.FISTS ), MainView.playerMenu );
			return true;
		}
		if( CoC.player.weapon === WeaponLib.WARHAMR && CoC.player.str < 80 ) {
			MainView.outputText( '\n<b>You aren\'t strong enough to handle the weight of your weapon any longer!</b>\n' );
			SceneLib.inventory.takeItem( CoC.player.setWeapon( WeaponLib.FISTS ), MainView.playerMenu );
			return true;
		}
		//Drop beautiful sword if corrupted!
		if( CoC.player.weaponPerk === 'holySword' && CoC.player.cor >= 35 ) {
			MainView.outputText( '<b>\nThe <u>' + CoC.player.weaponName + '</u> grows hot in your hand, until you are forced to drop it.  Whatever power inhabits this blade appears to be unhappy with you.  Touching it gingerly, you realize it is no longer hot, but as soon as you go to grab the hilt, it nearly burns you.\n\nYou realize you won\'t be able to use it right now, but you could probably keep it in your inventory.</b>\n\n' );
			SceneLib.inventory.takeItem( CoC.player.setWeapon( WeaponLib.FISTS ), MainView.playerMenu );
			return true;
		}
		//Unequip Lusty maiden armor
		if( CoC.player.armorName === 'lusty maiden\'s armor' ) {
			//Removal due to no longer fitting Cock or Balls
			if( CoC.player.hasCock() || CoC.player.balls > 0 ) {
				MainView.outputText( '\nYou fidget uncomfortably in the g-string of your lewd bikini - there simply isn\'t enough room for your ' );
				if( CoC.player.hasCock() ) {
					MainView.outputText( 'maleness' );
				} else {
					MainView.outputText( 'bulgy balls' );
				}
				MainView.outputText( ' within the imprisoning leather, and it actually hurts to wear it.  <b>You\'ll have to find some other form of protection!</b>\n\n' );
				SceneLib.inventory.takeItem( CoC.player.setArmor( ArmorLib.COMFORTABLE_UNDERCLOTHES ), MainView.playerMenu );
				return true;
			}
			if( !CoC.player.hasVagina() ) { //Lost pussy
				MainView.outputText( '\nYou fidget uncomfortably as the crease in the gusset of your lewd bikini digs into your sensitive, featureless loins.  There\'s simply no way you can continue to wear this outfit in comfort - it was expressly designed to press in on the female mons, and without a vagina, <b>you simply can\'t wear this exotic armor.</b>\n\n' );
				SceneLib.inventory.takeItem( CoC.player.setArmor( ArmorLib.COMFORTABLE_UNDERCLOTHES ), MainView.playerMenu );
				return true;
			}
			if( CoC.player.biggestTitSize() < 4 ) { //Tits gone or too small
				MainView.outputText( '\nThe fine chain that makes up your lewd bikini-top is dangling slack against your flattened chest.  Every movement and step sends it jangling noisily, slapping up against your [nipples], uncomfortably cold after being separated from your ' + CoC.player.skinFurScales() + ' for so long.  <b>There\'s no two ways about it - you\'ll need to find something else to wear.</b>\n\n' );
				SceneLib.inventory.takeItem( CoC.player.setArmor( ArmorLib.COMFORTABLE_UNDERCLOTHES ), MainView.playerMenu );
				return true;
			}
		}
		// update cock type as dog/fox depending on whether the player resembles one more than the other.
		// Previously used to be computed directly in cockNoun, but refactoring prevents access to the Player class when in cockNoun now.
		if( CoC.player.totalCocks() !== 0 ) {
			_.forEach(CoC.player.cocks, function(cock) {
				if( cock.cockType === CockTypesEnum.DOG || cock.cockType === CockTypesEnum.FOX ) {
					if( CoC.player.dogScore() >= CoC.player.foxScore() ) {
						cock.cockType = CockTypesEnum.DOG;
					} else {
						cock.cockType = CockTypesEnum.FOX;
					}
				}
			});
		}
		MainView.statsView.show();
		if( needNext ) {
			EngineCore.doNext( MainView, MainView.playerMenu );
			return true;
		}
		MainView.playerMenu();
		return false;
	};
	EventParser.cheatTime = function( time ) {
		while( time > 0 ) {
			time--;
			CoC.time.hours++;
			if( CoC.time.hours > 23 ) {
				CoC.time.days++;
				CoC.time.hours = 0;
			}
		}
		MainView.statsView.show();
	};
	EventParser.growHair = function( amount ) {
		if( amount === undefined ) {
			amount = 0.1;
		}
		//Grow hair!
		var oldHairLength = CoC.player.hairLength;
		CoC.player.hairLength += amount;
		if( CoC.player.hairLength > 0 && oldHairLength === 0) {
			MainView.outputText( '\n<b>You are no longer bald.  You now have ' + Descriptors.hairDescript() + ' coating your head.\n</b>', false );
			return true;
		} else {
			var threshold = _.find([1, 3, 6, 10, 16, 26, 40], function(value) {
				return CoC.player.hairLength >= value && oldHairLength < value;
			});
			if(threshold) {
				MainView.outputText( '\n<b>Your hair\'s growth has reached a new threshhold, giving you ' + Descriptors.hairDescript() + '.\n</b>', false );
				return true;
			}
		}
		return false;
	};
	return EventParser;
} );