'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, CoC, EngineCore, kFLAGS, EventParser, Utils, AppearanceDefs, Combat, Imp, Goblin, ComsumableLib, Descriptors, Appearance, StatusAffects ) {
	function Exploration() { }
	Exploration.prototype.doExplore = function() {
		if( CoC.player.explored === 0 ) {
			EngineCore.outputText( 'You tentatively step away from your campsite, alert and scanning the ground and sky for danger.  You walk for the better part of an hour, marking the rocks you pass for a return trip to your camp.  It worries you that the portal has an opening on this side, and it was totally unguarded...\n\n...Wait a second, why is your campsite in front of you? The portal\'s glow is clearly visible from inside the tall rock formation.   Looking carefully you see your footprints leaving the opposite side of your camp, then disappearing.  You look back the way you came and see your markings vanish before your eyes.  The implications boggle your mind as you do your best to mull over them.  Distance, direction, and geography seem to have little meaning here, yet your campsite remains exactly as you left it.  A few things click into place as you realize you found your way back just as you were mentally picturing the portal!  Perhaps memory influences travel here, just like time, distance, and speed would in the real world!\n\nThis won\'t help at all with finding new places, but at least you can get back to camp quickly.  You are determined to stay focused the next time you explore and learn how to traverse this gods-forsaken realm.', true );
			this.tryDiscover();
			return;
		} else if( CoC.player.explored === 1 ) {
			EngineCore.outputText( 'You walk for quite some time, roaming the hard-packed and pink-tinged earth of the demon-realm.  Rust-red rocks speckle the wasteland, as barren and lifeless as anywhere else you\'ve been.  A cool breeze suddenly brushes against your face, as if gracing you with its presence.  You turn towards it and are confronted by the lush foliage of a very old looking forest.  You smile as the plants look fairly familiar and non-threatening.  Unbidden, you remember your decision to test the properties of this place, and think of your campsite as you walk forward.  Reality seems to shift and blur, making you dizzy, but after a few minutes you\'re back, and sure you\'ll be able to return to the forest with similar speed.\n\n<b>You have discovered the Forest!</b>', true );
			this.tryDiscover();
			CoC.player.exploredForest++;
			return;
		} else if( CoC.player.explored > 1 ) {
			EngineCore.outputText( 'You can continue to search for new locations, or explore your previously discovered locations.', true );
		}
		if( CoC.flags[ kFLAGS.EXPLORATION_PAGE ] === 2 ) {
			this.explorePageII();
			return;
		}
		EngineCore.menu();
		EngineCore.addButton( 0, 'Explore', this.tryDiscover );
		if( CoC.player.exploredDesert > 0 ) {
			EngineCore.addButton( 1, 'Desert', SceneLib.desert.exploreDesert );
		}
		if( CoC.player.exploredForest > 0 ) {
			EngineCore.addButton( 2, 'Forest', SceneLib.forest.exploreForest );
		}
		if( CoC.player.exploredLake > 0 ) {
			EngineCore.addButton( 3, 'Lake', SceneLib.lake.exploreLake );
		}
		EngineCore.addButton( 4, 'Next', this.explorePageII );
		if( CoC.flags[ kFLAGS.TIMES_EXPLORED_PLAINS ] > 0 ) {
			EngineCore.addButton( 5, 'Plains', SceneLib.plains.explorePlains );
		}
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00272 ] > 0 ) {
			EngineCore.addButton( 6, 'Swamp', SceneLib.swamp.exploreSwamp );
		}
		if( CoC.player.findStatusAffect( StatusAffects.ExploredDeepwoods ) >= 0 ) {
			EngineCore.addButton( 7, 'Deepwoods', SceneLib.forest.exploreDeepwoods );
		}
		if( CoC.player.exploredMountain > 0 ) {
			EngineCore.addButton( 8, 'Mountain', SceneLib.mountain.exploreMountain );
		}
		EngineCore.addButton( 9, 'Back', MainView.playerMenu );
	};
	Exploration.prototype.explorePageII = function() {
		CoC.flags[ kFLAGS.EXPLORATION_PAGE ] = 2;
		EngineCore.menu();
		if( CoC.flags[ kFLAGS.DISCOVERED_HIGH_MOUNTAIN ] > 0 ) {
			EngineCore.addButton( 0, 'High Mountain', SceneLib.highMountains.exploreHighMountain );
		}
		if( CoC.flags[ kFLAGS.BOG_EXPLORED ] > 0 ) {
			EngineCore.addButton( 1, 'Bog', SceneLib.bog.exploreBog );
		}
		EngineCore.addButton( 4, 'Previous', this.goBackToPageI );
		EngineCore.addButton( 9, 'Back', MainView.playerMenu );
	};
	Exploration.prototype.goBackToPageI = function() {
		CoC.flags[ kFLAGS.EXPLORATION_PAGE ] = 1;
		this.doExplore();
	};

	//Try to find a new location - called from doExplore once the first location is found
	Exploration.prototype.tryDiscover = function() {
		if( CoC.flags[ kFLAGS.PC_PROMISED_HEL_MONOGAMY_FUCKS ] === 1 && CoC.flags[ kFLAGS.HEL_RAPED_TODAY ] === 0 && Utils.rand( 10 ) === 0 && CoC.player.gender > 0 && !SceneLib.helFollower.followerHel() ) {
			SceneLib.helScene.helSexualAmbush();
			return;
		}
		if( CoC.player.explored > 1 ) {
			if( CoC.player.exploredLake === 0 ) {
				EngineCore.outputText( 'Your wanderings take you far and wide across the barren wasteland that surrounds the portal, until the smell of humidity and fresh water alerts you to the nearby lake.  With a few quick strides you find a lake so massive the distant shore cannot be seen.  Grass and a few sparse trees grow all around it.\n\n<b>You have discovered the Lake!</b>', true );
				CoC.player.exploredLake = 1;
				CoC.player.explored++;
				EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
				return;
			}
			if( CoC.player.exploredLake >= 1 && Utils.rand( 3 ) === 0 && CoC.player.exploredDesert === 0 ) {
				EngineCore.outputText( 'You stumble as the ground shifts a bit underneath you.  Groaning in frustration, you straighten up and discover the rough feeling of sand ', true );
				if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HUMAN ) {
					EngineCore.outputText( 'inside your footwear, between your toes', false );
				}
				if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HOOFED ) {
					EngineCore.outputText( 'in your hooves', false );
				}
				if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DOG ) {
					EngineCore.outputText( 'in your paws', false );
				}
				if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_NAGA ) {
					EngineCore.outputText( 'in your scales', false );
				}
				EngineCore.outputText( '.\n\n<b>You\'ve discovered the Desert!</b>', false );
				CoC.player.exploredDesert = 1;
				CoC.player.explored++;
				EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
				return;
			}
			if( CoC.player.exploredDesert >= 1 && Utils.rand( 3 ) === 0 && CoC.player.exploredMountain === 0 ) {
				EngineCore.outputText( 'Thunder booms overhead, shaking you out of your thoughts.  High above, dark clouds encircle a distant mountain peak.  You get an ominous feeling in your gut as you gaze up at it.\n\n<b>You have discovered the mountain!</b>', true );
				CoC.player.explored++;
				CoC.player.exploredMountain = 1;
				EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
				return;
			}
			if( CoC.player.exploredMountain >= 1 && Utils.rand( 3 ) === 0 && CoC.flags[ kFLAGS.TIMES_EXPLORED_PLAINS ] === 0 ) {
				CoC.flags[ kFLAGS.TIMES_EXPLORED_PLAINS ] = 1;
				CoC.player.explored++;
				EngineCore.outputText( 'You find yourself standing in knee-high grass, surrounded by flat plains on all sides.  Though the mountain, forest, and lake are all visible from here, they seem quite distant.\n\n<b>You\'ve discovered the plains!</b>', true );
				EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
				return;
			}
			//EXPLOOOOOOORE
			if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00272 ] === 0 && CoC.flags[ kFLAGS.TIMES_EXPLORED_PLAINS ] > 0 && Utils.rand( 3 ) === 0 ) {
				CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00272 ] = 1;
				CoC.player.explored++;
				EngineCore.outputText( '', true );
				EngineCore.outputText( 'All things considered, you decide you wouldn\'t mind a change of scenery.  Gathering up your belongings, you begin a journey into the wasteland.  The journey begins in high spirits, and you whistle a little traveling tune to pass the time.  After an hour of wandering, however, your wanderlust begins to whittle away.  Another half-hour ticks by.  Fed up with the fruitless exploration, you\'re nearly about to head back to camp when a faint light flits across your vision.  Startled, you whirl about to take in three luminous will-o\'-the-wisps, swirling around each other whimsically.  As you watch, the three ghostly lights begin to move off, and though the thought of a trap crosses your mind, you decide to follow.\n\n', false );
				EngineCore.outputText( 'Before long, you start to detect traces of change in the environment.  The most immediate difference is the increasingly sweltering heat.  A few minutes pass, then the will-o\'-the-wisps plunge into the boundaries of a dark, murky, stagnant swamp; after a steadying breath you follow them into the bog.  Once within, however, the gaseous balls float off in different directions, causing you to lose track of them.  You sigh resignedly and retrace your steps, satisfied with your discovery.  Further exploration can wait.  For now, your camp is waiting.\n\n', false );
				EngineCore.outputText( '<b>You\'ve discovered the swamp!</b>', false );
				EngineCore.doNext( SceneLib.camp.returnToCampUseTwoHours );
				return;
			}
			//Used for chosing 'repeat' encounters.
			var choosey = Utils.rand( 6 );
			//2 (gargoyle) is never chosen once cathedral is discovered.
			if( choosey === 2 && CoC.flags[ kFLAGS.FOUND_CATHEDRAL ] === 1 ) {
				choosey = Utils.rand( 5 );
				if( choosey >= 2 ) {
					choosey++;
				}
			}
			//Chance of encountering Giacomo!
			if( choosey === 0 ) {
				CoC.player.explored++;
				SceneLib.giacomo.giacomoEncounter(); //eventParser(2015);
				return;
			}
			if( choosey === 1 ) {
				CoC.player.explored++;
				SceneLib.lumi.lumiEncounter();
				return;
			}
			if( choosey === 2 ) {
				CoC.player.explored++;
				if( CoC.flags[ kFLAGS.GAR_NAME ] === 0 ) {
					SceneLib.gargoyle.gargoylesTheShowNowOnWBNetwork();
				} else {
					SceneLib.gargoyle.returnToCathedral();
				}
				return;
			}
			//Monster - 50/50 imp/gob split.
			CoC.player.explored++;
			var impGob = 5;
			//Imptacular Encounter
			if( Utils.rand( 10 ) < impGob ) {
				if( CoC.player.level >= 8 && Utils.rand( 2 ) === 0 ) {
					SceneLib.impScene.impLordEncounter();
					EngineCore.spriteSelect( 29 );
					return;
				}
				EngineCore.outputText( 'An imp wings out of the sky and attacks!', true );
				Combat.startCombat( new Imp() );
				EngineCore.spriteSelect( 29 );
				return;
			}
			//50% of the time, goblin assassin!
			if( CoC.player.level >= 10 && Utils.rand( 2 ) === 0 ) {
				SceneLib.goblinAssassinScene.goblinAssassinEncounter();
				return;
			}
			if( CoC.player.gender > 0 ) {
				EngineCore.outputText( 'A goblin saunters out of the bushes with a dangerous glint in her eyes.\n\nShe says, "<i>Time to get fucked, ' + CoC.player.mf( 'stud', 'slut' ), true );
				EngineCore.outputText( '.</i>"', false );
				Combat.startCombat( new Goblin() );
				EngineCore.spriteSelect( 24 );
				return;
			}
			EngineCore.outputText( 'A goblin saunters out of the bushes with a dangerous glint in her eyes.\n\nShe says, "<i>Time to get fuc-oh shit, you don\'t even have anything to play with!  This is for wasting my time!', true );
			EngineCore.outputText( '</i>"', false );
			Combat.startCombat( new Goblin() );
			EngineCore.spriteSelect( 24 );
			return;
		}
		CoC.player.explored++;
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
	};

	Exploration.prototype.debugOptions = function() {
		SceneLib.inventory.takeItem( ComsumableLib.W_FRUIT, MainView.playerMenu );
	};
	//Massive bodyparts scene
	//[DESERT]
	//[RANDOM SCENE IF CHARACTER HAS AT LEAST ONE COCK LARGER THAN THEIR HEIGHT,
	//AND THE TOTAL COMBINED WIDTH OF ALL THEIR COCKS IS TWELVE INCHES OR GREATER]
	Exploration.prototype.bigJunkDesertScene = function() {
		EngineCore.outputText( '', true );
		var x = CoC.player.longestCock();
		//PARAGRAPH 1
		EngineCore.outputText( 'Walking along the sandy dunes of the desert you find yourself increasingly impeded by the bulk of your ' + Descriptors.cockDescript( x ) + ' dragging along the sandscape behind you.  The incredibly hot surface of the desert causes your loins to sweat heavily and fills them with relentless heat.', false );
		if( CoC.player.cocks.length === 1 ) {
			EngineCore.outputText( '  As it drags along the dunes, the sensation forces you to imagine the rough textured tongue of a monstrous animal sliding along the head of your ' + Appearance.cockNoun( CoC.player.cocks[ x ].cockType ) + '.', false );
		} else if( CoC.player.cocks.length >= 2 ) {
			EngineCore.outputText( '  With all of your ' + Descriptors.multiCockDescriptLight() + ' dragging through the sands they begin feeling as if the rough textured tongues of ' + Utils.num2Text( CoC.player.cockTotal() ) + ' different monstrous animals were slobbering over each one.', false );
		}
		EngineCore.outputText( '\n\n', false );
		//PARAGRAPH 2
		//FOR NON-CENTAURS]
		if( !CoC.player.isTaur() ) {
			EngineCore.outputText( 'The impending erection can\'t seem to be stopped.  Your sexual frustration forces stiffness into your ' + Descriptors.multiCockDescriptLight() + ', which forces your torso to the ground.  Normally your erection would merely raise itself skyward but your genitals have grown too large and heavy for your ' + Descriptors.hipDescript() + ' to hold them aloft.  Instead you feel your body forcibly pivoting at the hips until your torso is compelled to rest face down on top of your obscene ' + Descriptors.multiCockDescriptLight() + '.', false );
			//IF CHARACTER HAS GIANT BREASTS ADD SENTENCE
			if( CoC.player.biggestTitSize() >= 35 ) {
				EngineCore.outputText( '  Your ' + Descriptors.allBreastsDescript() + ' hang lewdly off your torso to rest on the desert sands, seeming to bury the dunes on either side of you.  Their immense weight anchors your body, further preventing your torso from lifting itself up.  The burning heat of the desert teases your ' + Descriptors.nippleDescript( 0 ) + 's mercilessly as they grind in the sand.', false );
			}
			//IF CHARACTER HAS A BALLS ADD SENTENCE
			if( CoC.player.balls > 0 ) {
				EngineCore.outputText( '  Your ' + CoC.player.skinTone + Descriptors.sackDescript() + ' rests beneath your raised ' + Descriptors.buttDescript() + '.  The fiery warmth of the desert caresses it, causing your ' + Descriptors.ballsDescriptLight() + ' to pulse with the need to release their sperm through your ' + Descriptors.multiCockDescriptLight() + '.', false );
			}
			//IF CHARACTER HAS A VAGINA ADD SENTENCE
			if( CoC.player.vaginas.length >= 1 ) {
				EngineCore.outputText( '  Your ' + Descriptors.vaginaDescript() + ' and ' + Descriptors.clitDescript() + ' are thoroughly squashed between the bulky flesh where your male genitals protrude from between your hips and the ' + Descriptors.buttDescript() + ' above.', false );
				//IF CHARACTER HAS A DROOLING PUSSY ADD SENTENCE
				if( CoC.player.vaginas[ 0 ].vaginalWetness >= AppearanceDefs.VAGINA_WETNESS_DROOLING ) {
					EngineCore.outputText( '  Juices stream from your womanhood and begin pooling on the hot sand beneath you.  Wisps of steam rise up into the air only to tease your genitals further.  ', false );
				}
			}
		}
		//FOR CENTAURS
		else {
			EngineCore.outputText( 'The impending erection can\'t seem to be stopped.  Your sexual frustration forces stiffness into your ' + Descriptors.multiCockDescriptLight() + ', which forces the barrel of your horse-like torso to the ground.  Normally your erection would merely hover above the ground in between your centaurian legs, but your genitals have grown too large and heavy for your ' + Descriptors.hipDescript() + ' to hold them aloft.  Instead, you feel your body being forcibly pulled down at your hindquarters until you rest atop your ' + Descriptors.multiCockDescriptLight() + '.', false );
			//IF CHARACTER HAS GIANT BREASTS ADD SENTENCE
			if( CoC.player.biggestTitSize() >= 35 ) {
				EngineCore.outputText( '  Your ' + Descriptors.allBreastsDescript() + ' pull your human torso forward until it also is forced to rest facedown, just like your horse half.  Your tits rest, pinned on the desert sand to either side of you.  Their immense weight anchors you, further preventing any part of your equine body from lifting itself up.  The burning heat of the desert teases your ' + Descriptors.nippleDescript( 0 ) + 's incessantly.', false );
			}
			//IF CHARACTER HAS A BALLS ADD SENTENCE
			if( CoC.player.balls > 0 ) {
				EngineCore.outputText( '  Your ' + CoC.player.skinTone + Descriptors.sackDescript() + ' rests beneath your raised ' + Descriptors.buttDescript() + '.  The airy warmth of the desert teases it, causing your ' + Descriptors.ballsDescriptLight() + ' pulse with the need to release their sperm through your ' + Descriptors.multiCockDescriptLight() + '.', false );
			}
			//IF CHARACTER HAS A VAGINA ADD SENTENCE
			if( CoC.player.vaginas.length >= 1 ) {
				EngineCore.outputText( '  Your ' + Descriptors.vaginaDescript() + ' and ' + Descriptors.clitDescript() + ' are thoroughly squashed between the bulky flesh where your male genitals protrude from between your hips and the ' + Descriptors.buttDescript() + ' above.', false );
				//IF CHARACTER HAS A DROOLING PUSSY ADD SENTENCE
				if( CoC.player.vaginas[ 0 ].vaginalWetness >= AppearanceDefs.VAGINA_WETNESS_DROOLING ) {
					EngineCore.outputText( '  The desert sun beats down on your body, its fiery heat inflaming the senses of your vaginal lips.  Juices stream from your womanhood and begin pooling on the hot sand beneath you.', false );
				}
			}
		}
		EngineCore.outputText( '\n\n', false );
		//PARAGRAPH 3
		EngineCore.outputText( 'You realize you are effectively trapped here by your own body.', false );
		//CORRUPTION BASED CHARACTER'S VIEW OF SITUATION
		if( CoC.player.cor < 33 ) {
			EngineCore.outputText( '  Panic slips into your heart as you realize that if any dangerous predator were to find you in this state, you\'d be completely defenseless.  You must find a way to regain your mobility immediately!', false );
		} else if( CoC.player.cor < 66 ) {
			EngineCore.outputText( '  You realize that if any dangerous predator were to find you in this state you\'d be completely defenseless.  You must find a way to regain your mobility... yet there is a certain appeal to imagining how pleasurable it would be for a sexual predator to take advantage of your obscene body.', false );
		} else {
			EngineCore.outputText( '  Your endowments have rendered you completely helpless should any predators find you.  Somewhere in your heart, you\'re exhilarated at the prospect.  The idea of being a helpless fucktoy for a wandering beast is unusually inviting to you.  Were it not for the thought that you might die of thirst in the desert, you\'d be incredibly tempted to remain right where you are.', false );
		}
		//SCENE END = IF CHARACTER HAS FULL WINGS ADD SENTENCE
		if( CoC.player.canFly() ) {
			EngineCore.outputText( '  You extend your wings and flap as hard as you can, until at last you manage to lighten the bulk of your body somewhat - enough to allow yourself to drag your genitals across the hot sands and back to camp.  The ordeal takes nearly an hour.', false );
		}//SCENE END IF CHARACTER HAS CENTAUR BODY
		else if( CoC.player.isTaur() ) {
			EngineCore.outputText( '  You struggle and work your equine legs against the surface of the dune you are trapped on.  Your ' + CoC.player.feet() + ' have consistent trouble finding footing, the soft sand failing to provide enough leverage to lift your bulk.  You breath in deeply and lean from side to side, trying to find some easier vertical leverage.  Eventually, with a crude crawl, your legs manage to push the bulk of your body onto more solid ground.  With great difficulty, you spend the next hour shuffling your genitals across the sandscape and back to camp.', false );
		}//SCENE END = FOR ALL OTHER CHARACTERS
		else {
			EngineCore.outputText( '  You struggle and push with your ' + CoC.player.legs() + ' as hard as you can, but it\'s no use.  You do the only thing you can and begin stroking your ' + Descriptors.multiCockDescriptLight() + ' with as much vigor as you can muster.  Eventually your body tenses and a light load of jizz erupts from your body, but the orgasm is truly mild compared to what you need.  You\'re simply too weary from struggling to give yourself the masturbation you truly need, but you continue to try.  Nearly an hour later ' + Descriptors.sMultiCockDesc() + ' softens enough to allow you to stand again, and you make your way back to camp, still dragging your genitals across the warm sand.', false );
		}
		EngineCore.dynStats( 'lus', 25 + Utils.rand( CoC.player.cor / 5 ), 'resisted', false );
		EngineCore.fatigue( 5 );
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
	};
	SceneLib.registerScene( 'exploration', new Exploration() );
} );