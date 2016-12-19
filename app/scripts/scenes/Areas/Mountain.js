﻿'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, $log, MainView, CoC, kFLAGS, Utils, StatusAffects, PregnancyStore, EngineCore, AppearanceDefs, PerkLib, Imp, Goblin, ConsumableLib, Combat, OnLoadVariables ) {
	function Mountain() {
	}

	//Explore Mountain
	Mountain.prototype.exploreMountain = function() {
		CoC.player.exploredMountain++;
		var chooser = Utils.rand( 4 );
		//Helia monogamy fucks
		if( CoC.flags[ kFLAGS.PC_PROMISED_HEL_MONOGAMY_FUCKS ] === 1 && CoC.flags[ kFLAGS.HEL_RAPED_TODAY ] === 0 && Utils.rand( 10 ) === 0 && CoC.player.gender > 0 && !SceneLib.helScene.followerHel() ) {
			SceneLib.helScene.helSexualAmbush();
			return;
		}
		//Discover 'high mountain' at level 5 or 40 explores of mountain
		if( (CoC.player.level >= 5 || CoC.player.exploredMountain >= 40) && CoC.flags[ kFLAGS.DISCOVERED_HIGH_MOUNTAIN ] === 0 ) {
			MainView.outputText( 'While exploring the mountain, you come across a relatively safe way to get at its higher reaches.  You judge that with this route you\'ll be able to get about two thirds of the way up the mountain.  With your newfound discovery fresh in your mind, you return to camp.\n\n(<b>High Mountain exploration location unlocked!</b>)', true );
			CoC.flags[ kFLAGS.DISCOVERED_HIGH_MOUNTAIN ]++;
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		if( SceneLib.xmasBitch.isHolidays() ) {
			//Gats xmas adventure!
			if( Utils.rand( 5 ) === 0 && CoC.player.gender > 0 && SceneLib.xmasBitch.isHolidays() && CoC.flags[ kFLAGS.GATS_ANGEL_DISABLED ] === 0 && CoC.flags[ kFLAGS.GATS_ANGEL_GOOD_ENDED ] === 0 && (CoC.flags[ kFLAGS.GATS_ANGEL_QUEST_BEGAN ] > 0 && CoC.player.hasKeyItem( 'North Star Key' ) < 0) ) {
				SceneLib.xmasGatsNotAnAngel.gatsSpectacularRouter();
				return;
			}
			if( Utils.rand( 6 ) === 0 && CoC.flags[ kFLAGS.JACK_FROST_YEAR ] < OnLoadVariables.date.fullYear && EngineCore.silly() ) {
				SceneLib.xmasJackFrost.meetJackFrostInTheMountains();
				return;
			}
		}
		//8% chance of hellhoundsplosions if appropriate
		if( Utils.rand( 100 ) <= 77 ) {
			if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00141 ] < 3 ) {
				$log.debug( 'CHANCE AT HELLHOUND GAO' );
				//Requires canine face, [either two dog dicks, or a vag and pregnant with a hellhound], at least two other hellhound features (black fur, dog legs, dog tail), and corruption >=60.
				if( CoC.player.faceType === AppearanceDefs.FACE_DOG && (CoC.player.dogCocks() >= 2 || (CoC.player.hasVagina() && CoC.player.pregnancyType === PregnancyStore.PREGNANCY_HELL_HOUND)) && CoC.player.cor >= 60 && CoC.player.tailType === AppearanceDefs.TAIL_TYPE_DOG && (CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DOG || CoC.player.hairColor === 'midnight black') ) {
					$log.debug( 'PASS BODYCHECK' );
					if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00141 ] === 0 ) {
						SceneLib.hellHoundScene.HellHoundMasterEncounter();
						return;
					}
					//Level 2 requires lethecite
					else if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00141 ] === 1 && CoC.player.hasKeyItem( 'Marae\'s Lethicite' ) >= 0 && CoC.player.keyItemv2( 'Marae\'s Lethicite' ) < 3 ) {
						SceneLib.hellHoundScene.HellHoundMasterEncounter();
						return;
					}
				}
			}
		}
		//Rarer 'nice' Ceraph encounter
		//Overlaps half the old encounters once pierced.
		if( !SceneLib.ceraphFollowerScene.ceraphIsFollower() && CoC.player.level > 2 && (CoC.player.exploredMountain % 30 === 0) && CoC.flags[ kFLAGS.PC_FETISH ] > 0 ) {
			SceneLib.ceraphScene.friendlyNeighborhoodSpiderManCeraph();
			return;
		}
		//15% chance of Ceraph
		if( !SceneLib.ceraphFollowerScene.ceraphIsFollower() && CoC.player.level > 2 && (CoC.player.exploredMountain % 15 === 0) && CoC.flags[ kFLAGS.PC_FETISH ] !== 1 ) {
			SceneLib.ceraphScene.encounterCeraph();
			return;
		}
		//10% chance of hairdresser encounter if not found yet
		if( Utils.rand( 10 ) === 0 && CoC.player.findStatusAffect( StatusAffects.HairdresserMeeting ) < 0 ) {
			chooser = 4;
		}
		if( (Utils.rand( 8 ) === 0 && CoC.player.findStatusAffect( StatusAffects.MetMarae ) >= 0) && CoC.player.findStatusAffect( StatusAffects.FoundFactory ) < 0 ) {
			SceneLib.dungeonCore.enterFactory();
			return;
		}
		//Boosts mino and hellhound rates!
		if( CoC.player.findPerk( PerkLib.PiercedFurrite ) >= 0 && Utils.rand( 3 ) === 0 ) {
			if( Utils.rand( 2 ) === 0 ) {
				chooser = 1;
			} else {
				chooser = 3;
			}
		}
		//10% chance to mino encounter rate if addicted
		if( CoC.flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_STATE ] > 0 && Utils.rand( 10 ) === 0 ) {
			chooser = 1;
		}
		//10% MORE chance for minos if uber-addicted
		if( CoC.player.findPerk( PerkLib.MinotaurCumAddict ) >= 0 && Utils.rand( 10 ) === 0 ) {
			chooser = 1;
		}
		//Every 15 explorations chance at mino bad-end!
		if( CoC.player.exploredMountain % 16 === 0 && CoC.player.findPerk( PerkLib.MinotaurCumAddict ) >= 0 ) {
			EngineCore.spriteSelect( 44 );
			SceneLib.minotaurScene.minoAddictionBadEndEncounter();
			return;
		}
		if( chooser === 0 ) {
			//Determines likelyhood of imp/goblins
			//Below - goblin, Equal and up - imp
			var impGob = 5;
			if( CoC.player.findPerk( PerkLib.PiercedLethite ) >= 0 ) {
				if( impGob <= 3 ) {
					impGob += 2;
				} else if( impGob < 7 ) {
					impGob = 7;
				}
			}
			$log.debug( 'IMP/Gobb' );
			//Dicks + lots of cum boosts goblin probability
			//Vags + Fertility boosts imp probability
			if( CoC.player.totalCocks() > 0 ) {
				impGob--;
			}
			if( CoC.player.hasVagina() ) {
				impGob++;
			}
			if( CoC.player.totalFertility() >= 30 ) {
				impGob++;
			}
			if( CoC.player.cumQ() >= 200 ) {
				impGob--;
			}
			//Imptacular Encounter
			if( Utils.rand( 10 ) < impGob ) {
				if( CoC.player.level >= 8 && Utils.rand( 2 ) === 0 ) {
					SceneLib.impScene.impLordEncounter();
				} else {
					MainView.outputText( 'An imp leaps out from behind a rock and attacks!', true );
					Combat.startCombat( new Imp() );
				}
				EngineCore.spriteSelect( 29 );
				return;
			}
			//Encounter Gobbalin!
			else {
				//50% of the time, goblin assassin!
				if( CoC.player.level >= 10 && Utils.rand( 2 ) === 0 ) {
					SceneLib.goblinAssassinScene.goblinAssassinEncounter();
					return;
				}
				if( CoC.player.gender > 0 ) {
					MainView.outputText( 'A goblin saunters out of the bushes with a dangerous glint in her eyes.\n\nShe says, "<i>Time to get fucked, ' + CoC.player.mf( 'stud', 'slut' ), true );
					MainView.outputText( '.</i>"', false );
					Combat.startCombat( new Goblin() );
					EngineCore.spriteSelect( 24 );
					return;
				} else {
					MainView.outputText( 'A goblin saunters out of the bushes with a dangerous glint in her eyes.\n\nShe says, "<i>Time to get fuc-oh shit, you don\'t even have anything to play with!  This is for wasting my time!', true );
					MainView.outputText( '</i>"', false );
					Combat.startCombat( new Goblin() );
					EngineCore.spriteSelect( 24 );
					return;
				}
			}
		}
		//Minotauuuuur
		if( chooser === 1 ) {
			EngineCore.spriteSelect( 44 );
			if( CoC.player.findStatusAffect( StatusAffects.TF2 ) < 0 && CoC.player.level <= 1 && CoC.player.str <= 40 ) {
				if( EngineCore.silly() ) {
					//(Ideally, this should occur the first time the player would normally get an auto-rape encounter with the minotaur. The idea is to give a breather encounter to serve as a warning of how dangerous the mountain is)
					MainView.outputText( 'Crossing over the treacherous mountain paths, you walk past an ominous cave.  The bones and the smell of death convince you to hasten your pace.  However, as you walk by, you hear a deep bellow and a snort as a monstrous man with a bull\'s head steps out.  With hell in his eyes and a giant ax in his hand, he begins to approach you in clear rage.  As he comes out into the light, you see that he is completely naked and sports a monstrous erection as angry as the minotaur himself, freely leaking a steady stream of pre-cum as he stalks you.\n\n', true );
					MainView.outputText( 'You stumble in your attempt to escape and realize that you are completely helpless.  The minotaur towers over you and heaves his ax for a <i>coup de grace</i>.  As he readies the blow, a monstrous explosion rocks the entire mountainside, causing the bull-man to stumble before he can finish you off. You look around, bewildered, trying to understand this strange new turn of events, and notice a group of maybe half a dozen people approaching from further up the path.  They appear to be a motley crew clad in blue and carrying monstrous weapons.  The tallest man holds a weapon made of multiple rotating tubes, and begins spinning the barrels.  A second later, while screaming in a language you do not understand, a rain of lead begins shredding the minotaur into a cloud of blood and flesh.\n\n', false );
					MainView.outputText( 'An equally imposing black man with a patch over one eye begins firing canisters at the beast, which explode violently.  "<i>Ya ragged-arsed beast man!</i>" he taunts.  "<i>Ye should pick on someone yer own size, BOY-O! HEHEHE!</i>"\n\n', false );
					MainView.outputText( 'Coming up the path next is a freak of a person clad in a contained shiny suit with a weapon that burns with flame.  He freely walks into the explosions and gunfire and begins igniting the beast.\n\n', false );
					MainView.outputText( '"<i>MRPHHUMFHRUFH!!!!! HUMFHUFMMRUF!</i>" the freak mumbles through his mask.\n\n', false );
					MainView.outputText( '"<i>I like me steak well done, ye crazy bugger!</i>" yells the black man.\n\n', false );
					MainView.outputText( 'The beast collapses in a charred and bloody heap.   As you stand back up, you hear a strange noise behind you.  You turn around to find a well-dressed man wearing a ski mask and smoking a cigarette.  "<i>Don\'t you know ze mountains are dangereuse,</i>" the man says with a thick accent.  "<i>You will get FUCKED up here if you are not careful.</i>"\n\n', false );
					MainView.outputText( 'You thank the man and his team, but they brush off your gratitude.  "<i>Non, non!</i>" the man with the accent says.  "<i>As zey say, everyone gets ONE.</i>" With that, he touches the watch on his wrist and disappears.  The rest of the group continues on their way.\n\n', false );
					MainView.outputText( 'As they leave, the giant with the chain gun yells in a horribly accented manner, "<i>YOU LEAVE SANDVICH ALONE! SANDVICH IS MINE!</i>"\n\n', false );
					MainView.outputText( 'With that, another hail of bullets break the scene as they walk away, leaving you safe from the minotaur, but utterly baffled as to what in hell just happened.', false );
				} else {
					MainView.outputText( 'Crossing over the treacherous mountain paths, you walk past an ominous cave.  The bones and the smell of death convince you to hasten your pace.  However, as you walk by, you hear a deep bellow and a snort as a monstrous man with a bull\'s head steps out.  With hell in his eyes and a giant ax in his hand, he begins to approach you in clear rage.  As he comes out into the light, you see that he is completely naked and sports a monstrous erection as angry as the minotaur himself, freely leaking a steady stream of pre-cum as he stalks you.\n\n', true );
					MainView.outputText( 'You stumble in your attempt to escape and realize that you are completely helpless.  The minotaur towers over you and heaves his ax for a <i>coup de grace</i>.  As he readies the blow, another beast-man slams into him from the side.  The two of them begin to fight for the honor of raping you, giving you the opening you need to escape.  You quietly sneak away while they fight – perhaps you should avoid the mountains for now?\n\n', false );
				}
				CoC.player.createStatusAffect( StatusAffects.TF2, 0, 0, 0, 0 );
				EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
				return;
			}
			//Mino gangbang
			if( CoC.player.findStatusAffect( StatusAffects.MinoPlusCowgirl ) < 0 || Utils.rand( 10 ) === 0 ) {
				if( CoC.flags[ kFLAGS.HAS_SEEN_MINO_AND_COWGIRL ] === 1 && CoC.player.horns > 0 && CoC.player.hornType === AppearanceDefs.HORNS_COW_MINOTAUR && CoC.player.earType === AppearanceDefs.EARS_COW && CoC.player.tailType === AppearanceDefs.TAIL_TYPE_COW && CoC.player.lactationQ() >= 200 && CoC.player.biggestTitSize() >= 3 && CoC.player.minotaurAddicted() ) {
					//PC must be a cowmorph (horns, legs, ears, tail, lactating, breasts at least C-cup)
					//Must be addicted to minocum
					MainView.outputText( 'As you pass a shadowy cleft in the mountainside, you hear the now-familiar call of a cowgirl echoing from within.  Knowing what\'s in store, you carefully inch closer and peek around the corner.' );
					MainView.outputText( '\n\nTwo humanoid shapes come into view, both with pronounced bovine features - tails, horns and hooves instead of feet.  Their genders are immediately apparent due to their stark nudity.  The first is the epitome of primal femininity, with a pair of massive, udder-like breasts and wide child-bearing hips. The other is the pinnacle of masculinity, with a broad, muscular chest, a huge horse-like penis and a heavy set of balls more appropriate on a breeding stud than a person.  You have once again stumbled upon a cow-girl engaging in a not-so-secret rendezvous with her minotaur lover.' );
					MainView.outputText( '\n\nYou settle in behind an outcropping, predicting what comes next.  You see the stark silhouettes of imps and goblins take up similar positions around this makeshift theatre, this circular clearing surrounded on the edge by boulders and nooks where all manner of creatures might hide. You wonder if they\'re as eager for the upcoming show as you are.  The heady scent of impending sex rises in the air... and with it comes something masculine, something that makes your stomach rumble in anticipation.  The mouth-watering aroma of fresh minotaur cum wafts up to your nose, making your whole body quiver in need.  Your [vagOrAss] immediately ' );
					if( CoC.player.hasVagina() ) {
						MainView.outputText( 'dampens' );
					} else {
						MainView.outputText( 'twinges' );
					}
					MainView.outputText( ', aching to be filled' );
					if( CoC.player.hasCock() ) {
						MainView.outputText( ', while [eachCock] rises to attention, straining at your [armor]' );
					}
					MainView.outputText( '.' );
					MainView.outputText( '\n\nYou can barely see it from your vantage point, but you can imagine it semi-transparent pre-cum dribbling from the minotaur\'s cumslit, oozing down onto your tongue.  Your entire body shivers at the thought, whether from disgust or desire you aren\'t sure.  You imagine your lips wrapping around that large equine cock, milking it for all of its delicious cum.  Your body burns hot like the noonday sun at the thought, hot with need, with envy at the cow-girl, but most of all with arousal.' );
					MainView.outputText( '\n\nSnapping out of your imaginative reverie, you turn your attention back to the show. You wonder if you could make your way over there and join them, or if you should simply remain here and watch, as you have in the past.' );
					EngineCore.menu();
					//[Join] [Watch]
					EngineCore.addButton( 0, 'Join', this, this.joinBeingAMinoCumSlut );
					EngineCore.addButton( 1, 'Watch', this, this.watchAMinoCumSlut );
					return;
				}
				CoC.flags[ kFLAGS.HAS_SEEN_MINO_AND_COWGIRL ] = 1;
				if( CoC.player.findStatusAffect( StatusAffects.MinoPlusCowgirl ) < 0 ) {
					CoC.player.createStatusAffect( StatusAffects.MinoPlusCowgirl, 0, 0, 0, 0 );
				} else {
					CoC.player.addStatusValue( StatusAffects.MinoPlusCowgirl, 1, 1 );
				}
				MainView.outputText( 'As you pass a shadowy cleft in the mountainside, you hear the sounds of a cow coming out from it. Wondering how a cow got up here, but mindful of this land\'s dangers, you cautiously sneak closer and peek around the corner.\n\n', true );
				MainView.outputText( 'What you see is not a cow, but two large human-shaped creatures with pronounced bovine features -- tails, horns, muzzles, and hooves instead of feet. They\'re still biped, however, and their genders are obvious due to their stark nudity. One has massive, udder-like breasts and wide hips, the other a gigantic, horse-like dong and a heavy set of balls more appropriate to a breeding stud than a person. You\'ve stumbled upon a cow-girl and a minotaur.\n\n', false );
				MainView.outputText( 'A part of your mind registers bits of clothing tossed aside and the heady scent of impending sex in the air, but your attention is riveted on the actions of the pair. The cow-girl turns and places her hands on a low ledge, causing her to bend over, her ample ass facing the minotaur. The minotaur closes the distance between them in a single step.\n\n', false );
				MainView.outputText( 'She bellows, almost moaning, as the minotaur grabs her cushiony ass-cheeks with both massive hands. Her tail raises to expose a glistening wet snatch, its lips already parted with desire. She moos again as his rapidly hardening bull-cock brushes her crotch. You can\'t tear your eyes away as he positions himself, his flaring, mushroom-like cock-head eliciting another moan as it pushes against her nether lips.\n\n', false );
				MainView.outputText( 'With a hearty thrust, the minotaur plunges into the cow-girl\'s eager fuck-hole, burying himself past one -- two of his oversized cock\'s three ridge rings. She screams in half pain, half ecstasy and pushes back, hungry for his full length. After pulling back only slightly, he pushes deeper, driving every inch of his gigantic dick into his willing partner who writhes in pleasure, impaled exactly as she wanted.\n\n', false );
				MainView.outputText( 'The pair quickly settles into a rhythm, punctuated with numerous grunts, groans, and moans of sexual excess. To you it\'s almost a violent assault sure to leave both of them bruised and sore, but the cow-girl\'s lolling tongue and expression of overwhelming desire tells you otherwise. She\'s enjoying every thrust as well as the strokes, gropes, and seemingly painful squeezes the minotaur\'s powerful hands deliver to her jiggling ass and ponderous tits. He\'s little better, his eyes glazed over with lust as he continues banging the fuck-hole he found and all but mauling its owner.', false );
				EngineCore.doNext( this, this.continueMinoVoyeurism );
				return;
			}
			//Cum addictus interruptus!  LOL HARRY POTTERFAG
			//Withdrawl auto-fuck!
			if( CoC.flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_STATE ] === 3 ) {
				SceneLib.minotaurScene.minoAddictionFuck();
				return;
			}
			SceneLib.minotaurScene.getRapedByMinotaur( true );
			EngineCore.spriteSelect( 44 );
		}
		//Worms
		if( chooser === 2 ) {
			//If worms are on and not infested.
			if( CoC.player.findStatusAffect( StatusAffects.WormsOn ) >= 0 && CoC.player.findStatusAffect( StatusAffects.Infested ) < 0 ) {
				if( CoC.player.findStatusAffect( StatusAffects.WormsHalf ) >= 0 && Utils.rand( 2 ) === 0 ) {
					if( CoC.player.cor < 90 ) {
						MainView.outputText( 'Your hike in the mountains, while fruitless, reveals pleasant vistas and provides you with good exercise and relaxation.', true );
						EngineCore.dynStats( 'tou', 0.25, 'spe', 0.5, 'lus', CoC.player.lib / 10 - 15 );
					} else {
						MainView.outputText( 'During your hike into the mountains, your depraved mind keeps replaying your most obcenely warped sexual encounters, always imagining new perverse ways of causing pleasure.\n\nIt is a miracle no predator picked up on the strong sexual scent you are emitting.', true );
						EngineCore.dynStats( 'tou', 0.25, 'spe', 0.5, 'lib', 0.25, 'lus', CoC.player.lib / 10 );
					}
					EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
					return;
				}
				SceneLib.worms.wormEncounter();
			} else {
				//If worms are off or the PC is infested, no worms.
				if( CoC.player.findStatusAffect( StatusAffects.WormsOff ) >= 0 || CoC.player.findStatusAffect( StatusAffects.Infested ) >= 0 || (Utils.rand( 2 ) === 0 && CoC.player.findStatusAffect( StatusAffects.WormsHalf ) >= 0) ) {
					if( CoC.player.cor < 90 ) {
						MainView.outputText( 'Your hike in the mountains, while fruitless, reveals pleasant vistas and provides you with good exercise and relaxation.', true );
						EngineCore.dynStats( 'tou', 0.25, 'spe', 0.5, 'lus', CoC.player.lib / 10 - 15 );
					} else {
						MainView.outputText( 'During your hike into the mountains, your depraved mind keeps replaying your most obcenely warped sexual encounters, always imagining new perverse ways of causing pleasure.\n\nIt is a miracle no predator picked up on the strong sexual scent you are emitting.', true );
						EngineCore.dynStats( 'tou', 0.25, 'spe', 0.5, 'lib', 0.25, 'lus', CoC.player.lib / 10 );
					}
					EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
				} else {
					SceneLib.worms.wormToggle();
				}
			}
		}
		//Hellhound
		if( chooser === 3 ) {
			EngineCore.spriteSelect( 27 );
			if( CoC.player.findStatusAffect( StatusAffects.WormsOn ) >= 0 && Utils.rand( 2 ) === 0 ) {
				//If lowered encounter rate, 25% chance, otherwise 50%.
				if( CoC.player.findStatusAffect( StatusAffects.WormsHalf ) >= 0 && Utils.rand( 2 ) === 0 ) {
					SceneLib.hellHoundScene.hellhoundEncounter();
					return;
				}
				SceneLib.infestedHellhoundScene.infestedHellhoundEncounter();
				return;
			}
			SceneLib.hellHoundScene.hellhoundEncounter();
		}
		//Hairdresser
		if( chooser === 4 ) {
			SceneLib.salon.hairDresser();
		}
	};
	Mountain.prototype.joinBeingAMinoCumSlut = function() {
		MainView.clearOutput();
		MainView.outputText( 'The prospect of getting a huge dose of that fresh minotaur cum is just too much to bear.  Before you realize what\'s happening, you\'re moving out of your rocky hiding spot and making your way down to the two bovine creatures, stripping your [armor] as you go.  By the time you reach the two figures, you\'re as naked as they are.  You shiver softly, whether due to some chill in the air or desperate anticipation, you can\'t say.' );
		MainView.outputText( '\n\nThe cow-girl is bent over, her hands on a low ledge with the minotaurs hands on either side of her ample ass.  She moans, more like a moo than a human groan, as the minotaur plunges into her quaking depths.  As you step forward, suddenly unsure of yourself, both the bull and the cow turn their sharp gazes on to you.  You feel very small' );
		if( CoC.player.tallness <= 96 ) {
			MainView.outputText( ' despite your immense height' );
		}
		MainView.outputText( ' as they look you up and down.  The entire area goes silent, even the goblins and the imps that are no doubt watching seem to be holding their breath, wondering what will happen to you.' );
		MainView.outputText( '\n\nThe minotaur grunts, finally, as if he finds you acceptable, and turns back to the plush ass before him, plowing into it once more.  The cow-girl, however, motions for you to move forward, and latches onto a [nipple] when you do.  Her soft lips encircle your areola, while her tongue dances over the rapidly hardening flesh of your teat.  Your breasts tingle with the slightest bit of suction, making you gasp as small droplets of milk escape your nipple and roll over the cow-girl\'s tongue.  She sucks more and more, eagerly gulping down your refreshing lactic beverage.' );
		MainView.outputText( '\n\nAll the while the minotaur continues grunting, thrusting his massive member into the woman\'s hungry cunt.  The two rock back and forth, pushing her face right into your breast before pulling back again.  The cow-girl\'s legs tremble and you suddenly find her arm grasping your shoulder for support.  Her other hand drifts down between your own naked legs, ' );
		if( CoC.player.hasCock() ) {
			MainView.outputText( 'ignoring your cock' );
			if( CoC.player.cockTotal() > 1 ) {
				MainView.outputText( 's' );
			}
			MainView.outputText( ' entirely, ' );
		}
		MainView.outputText( 'slipping a finger into your moistening ' );
		if( CoC.player.hasVagina() ) {
			MainView.outputText( 'pussy' );
		} else {
			MainView.outputText( 'asshole' );
		}
		MainView.outputText( '.  A low moan escapes your lips as a second finger slips in while the busty bovine woman\'s thumb ' );
		if( CoC.player.hasVagina() ) {
			MainView.outputText( 'swirls around your clitoris' );
		} else {
			MainView.outputText( 'presses against your perineum' );
		}
		MainView.outputText( '.' );
		MainView.outputText( '\n\nThe broad-shouldered minotaur urges his mate onto her knees while he does the same, his dick never leaving its temporary home.  The cow-girl pulls you along, bringing you to your knees and then onto your back.  You have a moment of sudden modesty as you fold your legs, trying to block your crotch from view.  The bovine woman simply chuckles in between moans and lightly presses your knees apart.  Your legs spread wide, lewdly showing off your nether region to the cow-girl, and anyone else that\'s watching.' );
		MainView.outputText( '\n\nWithout wasting any time, the girl leans down and' );
		if( CoC.player.hasCock() ) {
			MainView.outputText( ', once again ignoring your manhood completely' );
		}
		MainView.outputText( ', dives tongue first into your wet ' );
		if( CoC.player.hasVagina() ) {
			MainView.outputText( 'quim' );
		} else {
			MainView.outputText( 'back door' );
		}
		MainView.outputText( '.  The movement is so quick that you can\'t even suppress the sudden, perverted moan that leaves your lips... a moan that sounds shockingly like a cow\'s moo.  The surprise at your sudden bovine outburst quickly dissipates as the cow-girl\'s large tongue dips in and out of your ' );
		if( CoC.player.hasVagina() ) {
			MainView.outputText( 'sodden box' );
		} else {
			MainView.outputText( 'moist butthole' );
		}
		MainView.outputText( '.  Any remaining fears of joining this very public sex show are gone, and you wonder why you didn\'t join in sooner.' );
		MainView.outputText( '\n\nThe tongue lavishes your hole, paying homage to your crotch in the only way it knows how.  Your breath comes shorter while your arms and legs tingle, fingers and toes curling against your will.  The cow-girl laps and licks, her broad mouth muscle slipping in and out, curving in and around to hit every tender part of your insides.  You run your fingers through the woman\'s long red hair, forcing her head even deeper into your crotch.  With her head down like this, you have an easy view of her ass high up in the air, getting fucked senseless by the minotaur.  Every thrust makes the cow-girl moan into your lap, the added vibrations causing you to squirm even more.' );
		MainView.outputText( '\n\nThe bull thrusts in to the hilt, letting out one final bellow of pleasure.  The cow-girl brings her head up, her mouth and chin slick and dripping with your juices.  She lets out a moo-like bellow along with the minotaur, whose balls churn, no doubt depositing a heavy load of that delicious cum directly into her waiting womb.  You lick your lips, wishing you could just wrap them around that cock right now, to get your fix and feel the blissful sensations of relief run across your body.' );
		MainView.outputText( '\n\nThe girl gibbers incoherently as she slides off the minotaur\'s still-rigid cock, a small spurt of pearly white spunk running down her thighs.  The minotaur smirks, smacking the cow\'s ass and casually pushing her to the side.  A goofy grin is plastered on her face, eyes rolled up into their sockets like she\'s just experienced the most divine fuck imaginable. He then looks you dead in the eyes and says, in a deep, masculine and very dominant voice, "<i>You get to ride my cock next, cow.</i>"' );
		MainView.outputText( '\n\nHis rough, strong hands grasp your legs and draw you closer.  You squirm half-heartedly, not really trying to get away.  Though your mind tries to fight it, you know all you really want is that warm, sticky cum inside you one way or another.  You want to be just like the half-unconscious girl beside you, stuffed with cock and turned into this rugged man\'s breeding bitch.' );
		MainView.outputText( '\n\n"<i>Eager for a fucking, huh slut?</i>" he taunts, his turgid member resting along your stomach.  You nod slowly.  You feel a deep burning in your core. You want that cock inside you.  You want to be filled to bursting with this bull\'s seed, to feel it churn ' );
		if( CoC.player.hasVagina() ) {
			MainView.outputText( 'within your womb, knocked up by this manly beast' );
		} else {
			MainView.outputText( 'within your bowels' );
		}
		MainView.outputText( '.  "<i>That\'s a good slut,</i>" he grunts, pulling his cock off your belly and rubbing the slick, flat head against your awaiting [vagOrAss].  He teases you with the slight contact until you open your mouth to voice your complaints, then he suddenly thrusts inside.  Any words forming on your tongue fly away, replaced by a whine of relief as your hole gets stretched wide by the invading member.' );
		if( CoC.player.hasVagina() ) {
			CoC.player.cuntChange( 36, true, true, false );
		} else {
			CoC.player.buttChange( 36, true, true, false );
		}
		MainView.outputText( '\n\n"<i>Ahh, yeah.  That\'s some good ' );
		if( CoC.player.hasVagina() ) {
			MainView.outputText( 'cow-pussy' );
		} else {
			MainView.outputText( 'ass' );
		}
		MainView.outputText( ' right there,</i>" he groans, more of his bombastic cock slipping deep inside you.  The minotaur hooks an arm under each of your knees, lifting up your lower body, pressing even deeper.  Powerful sensations drift up from your ' );
		if( CoC.player.hasVagina() ) {
			MainView.outputText( 'g-spot' );
		} else {
			MainView.outputText( 'prostate' );
		}
		MainView.outputText( ' as the minotaur\'s wide flare strokes it through your ' );
		if( CoC.player.hasVagina() ) {
			MainView.outputText( 'vaginal' );
		} else {
			MainView.outputText( 'anal' );
		}
		MainView.outputText( ' walls.  Biting your lip with barely contained pleasure, you bring your hands to your breasts, playing with your milk-sodden nipples in between each orgasmic thrust of the bull\'s hips.' );
		MainView.outputText( '\n\nA giggle comes from your side, as you see the cow-girl is back up onto her knees, having recovered from her exalted orgasm.  She crawls forward, kneeling just over your head and leaning in to kiss her minotaur lover.  The two whisper sweet nothings to each other, too vague and indistinct to hear, but it doesn\'t matter.  All you can focus on is the dick lodged firmly inside of you... that, and the soaking cunt of the cow-girl just inches from your face.  Alabaster droplets drip down her legs, one even landing on your lips.  Before you can stop yourself, you lick them clean, savoring the taste of the second-hand cum.' );
		MainView.outputText( '\n\nSome part of your mind voices a complaint at what comes next, a voice that\'s quickly squelched inside the addiction-fueled haze of your brain.  You pull your head upwards and extend your tongue, slurping a large glob of cum from the cow-girl\'s snatch.  There\'s a surprised yelp from above you, followed by a coo of pleasure.  To your surprise, the cow-girl actually lowers her cunt down onto your face, giggling madly, filling your nostrils with the scent of her muff, with the scent of recent sex.  Not letting this opportunity go to waste, you repay her actions from earlier, slipping your ' );
		if( CoC.player.tongueType === AppearanceDefs.TONUGE_SNAKE ) {
			MainView.outputText( 'serpentine ' );
		} else if( CoC.player.tongueType === AppearanceDefs.TONUGE_DEMONIC ) {
			MainView.outputText( 'demonic ' );
		} else if( CoC.player.tongueType === AppearanceDefs.TONUGE_DRACONIC ) {
			MainView.outputText( 'draconic ' );
		}
		MainView.outputText( 'tongue inside her, eagerly licking out and guzzling down the remnants of the minotaur\'s present.' );
		MainView.outputText( '\n\nThe minotaur, for his part, is in no rush to give you a cream pie of your own. His thrusts are slow and deliberate, with a rhythm that has you writhing with pleasure.  The three of you moan together like some kind of erotic pyramid.  The bull\'s assault on your ' );
		if( CoC.player.hasVagina() ) {
			MainView.outputText( 'womb' );
		} else {
			MainView.outputText( 'back door' );
		}
		MainView.outputText( ' increases slowly, and you can feel your limbs tingling at the prospect of your mino-cum-induced orgasm.' );
		MainView.outputText( '\n\nIt starts in your fingers, where your nerves seethe, gathering up fistfuls of grass like one might grab a sheet.  The heat continues down your arms and strikes your body like a lightning bolt, your belly suddenly spiking up, back arching as the orgasmic thunderstorm rolls over you.  The flames don\'t stop there, however.  They travel down into your crotch, suddenly lighting up every nerve in your ' );
		if( CoC.player.hasVagina() ) {
			MainView.outputText( '[vagina]' );
		} else {
			MainView.outputText( '[asshole]' );
		}
		MainView.outputText( ' like a Christmas tree.  You\'re acutely aware of every single movement, every pulse, every little bit of contact between you and the huge cock living inside you.' );
		MainView.outputText( '\n\nYour muscles spasm and clench as the minotaur lets loose a powerful roar.  His own member twitches, suddenly releasing a flood of hot cum into your awaiting ' );
		if( CoC.player.hasVagina() ) {
			MainView.outputText( 'womb' );
		} else {
			MainView.outputText( 'bowels' );
		}
		MainView.outputText( '.  The moment that long-awaited jism hits your walls, it\'s like another lightning bolt hits.  It travels up your spine and sets your entire brain aglow.  Ecstasy wrapped in bliss with a side of euphoric rapture consumes your thoughts.  Your vision goes white, pearly white like the seed filling your body, and your lips part as a primal "<i>moo</i>" slips out.' );
		MainView.outputText( '\n\nFor the longest time, the only thing your cum-addled mind can think about is cocks and cunts, of pregnant bellies and stomachs filled to capacity.  You mind fills itself with visions of yourself on your knees, servicing this minotaur daily, hoping to please him enough that he might grace your ' );
		if( !CoC.player.hasVagina() ) {
			MainView.outputText( 'new ' );
		}
		MainView.outputText( 'womb with his divine dick.' );
		MainView.outputText( '\n\nIt takes several minutes for you to come down from this orgasmic high, and when you do, you see your minotaur lover has yet to recover from his.  He lays on his back in the midst of this clearing, his still-rock-hard cock jutting upwards, coating in a mixture of various juices.  The cow-girl sits beside him, carefully licking the towering pillar of cock clean.  You sit up, wobbly and clutch your stomach.  Filled with cum in two ends, you can\'t help but feel oddly unsatisfied.  Perhaps guzzling down some second-hand cum isn\'t quite enough to sate your hunger.  Perhaps you need it straight from the tap, as it were.' );
		MainView.outputText( '\n\nYou gingerly sit up, your body still quaking with pleasure.  Every movement sends another luxurious aftershock rippling through your body.  You crawl over to the splayed out minotaur, opposite your cow-girl partner, and join her in licking the man\'s cock clean.  It takes some work, but soon it glistens in the light of the red sky above you.' );
		MainView.outputText( '\n\nAs if you both possess some kind of bovine telepathy, you both lean forward, wrapping your ' );
		if( CoC.player.bRows() > 1 ) {
			MainView.outputText( 'uppermost ' );
		}
		MainView.outputText( 'breasts around his monolithic shaft.  Your faces meet and her soft lips press against yours, each of you earnestly pressing your tongues into the other\'s mouths, swapping the juices you\'ve collected over the past hour or so.  The bull beneath you groans, awakening to the feeling of four breasts surrounding his love muscle.' );
		MainView.outputText( '\n\nThe two of your pump your breasts up and down, your lips barely leaving each other long enough to give his member the occasional kiss, lick or slurp.  Up and down you go, and this time it\'s the minotaur\'s body that\'s wracked with bliss, writhing on the ground.  Milk dribbles from your breasts, coating you, the cow-girl and the minotaur in a fine white sheen and creating a sweet-smelling aroma that permeates the air.' );
		MainView.outputText( '\n\nThe bull groans, biting his lip as a third, and likely final, orgasm rips through him.  His hips buck upwards, his cock flaring up and out of your mammaries.  Ropes of immaculate silver seed jet from his cumslit, arcing up into the air several feet before splattering down on your heads.  Wasting no time, you slip your lips around the flare, gulping down mouthful after mouthful of the sweet man-milk.  Even though it\'s his third load of the hour, it\'s just as big as the others, and soon your find you can\'t swallow any more; your cum-laden belly just won\'t allow it.' );
		MainView.outputText( '\n\nSadly, you relinquish your hold on his cock and sit back, watching the cow-girl opposite you pick up where you left off, slurping up whatever you missed with a dedicated fervor.' );
		MainView.outputText( '\n\n<b>Now</b> you feel satisfied.  Filled with that precious, precious minotaur spunk in both ends, fresh from the source.  You slump onto your back and drift off into a hazy, bull-filled dream world.' );
		MainView.outputText( '...' );
		MainView.outputText( '\n\nYou awaken several hours later.  The minotaur and the cow-girl are nowhere to be seen, but your [armor] is left neatly folded next to you, along with a small bottle filled with some white liquid, most likely a gift from your "bull".' );
		MainView.outputText( '\n\nYou quickly re-dress and head back to camp, spying the occassional goblin or imp scurrying from its hiding spot, no doubt recovering from their own self-inflicted orgasms.' );
		CoC.player.orgasm();
		EngineCore.dynStats( 'lib', 0.5, 'sen', -3, 'cor', 1 );
		if( CoC.flags[ kFLAGS.PC_FETISH ] > 0 ) {
			MainView.outputText( '  A thrill runs through you.  Even though you were brought to such a satisfying climax, the whole thought that goblins and imps were watching you and getting off on it... it just makes you hornier than you were before.' );
			EngineCore.dynStats( 'lus=', 100 );
		}
		//Chance to impregnate PC, get mino-fix, and maybe relief from feeder perk.
		CoC.player.minoCumAddiction( 10 );
		CoC.player.knockUp( PregnancyStore.PREGNANCY_MINOTAUR, PregnancyStore.INCUBATION_MINOTAUR );
		if( CoC.player.findStatusAffect( StatusAffects.Feeder ) >= 0 ) {
			//You've now been milked, reset the timer for that
			CoC.player.addStatusValue( StatusAffects.Feeder, 1, 1 );
			CoC.player.changeStatusValue( StatusAffects.Feeder, 2, 0 );
		}
		//(Acquired minotaur cum!)
		CoC.time.hours++;
		SceneLib.inventory.takeItem( ConsumableLib.MINOCUM, SceneLib.camp.returnToCampUseOneHour );
	};
	Mountain.prototype.watchAMinoCumSlut = function() {
		MainView.clearOutput();
		MainView.outputText( 'Deciding not to risk it, you settle back into your nook in the rocks and watch on eagerly.  The cow-girl turns and places her hands on a low ledge, causing her to bend over, her ample ass facing the minotaur.  The minotaur closes the distance between them in a single step.' );
		MainView.outputText( '\n\nShe bellows, almost moaning, as the minotaur grabs her cushiony ass-cheeks with both massive hands.  Her tail raises to expose a glistening wet snatch, its lips already parted with desire.  She moos again as his rapidly hardening bull-cock brushes her crotch. You can\'t tear your eyes away as he positions himself, his flaring, mushroom-like cock-head eliciting another moan as it pushes against her nether lips.' );
		MainView.outputText( '\n\nWith a hearty thrust, the minotaur plunges into the cow-girl\'s eager fuck-hole, burying himself past one -- two of his oversized cock\'s three ridge rings.  She screams in half pain, half ecstasy and pushes back, hungry for his full length.  After pulling back only slightly, he pushes deeper, driving every inch of his gigantic dick into his willing partner who writhes in pleasure, impaled exactly as she wanted.' );
		MainView.outputText( '\n\nThe pair quickly settles into a rhythm, punctuated with numerous grunts, groans, and moans of sexual excess.  To you it\'s almost a violent assault sure to leave both of them bruised and sore, but the cow-girl\'s lolling tongue and expression of overwhelming desire tells you otherwise.  She\'s enjoying every thrust as well as the strokes, gropes, and seemingly painful squeezes the minotaur\'s powerful hands deliver to her jiggling ass and ponderous tits.  He\'s little better, his eyes glazed over with lust as he continues banging the fuck-hole he found and all but mauling its owner.' );
		//[Next]
		EngineCore.dynStats( 'lus', 10 );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Next', this, this.watchMinoCumSlutII );
	};
	Mountain.prototype.watchMinoCumSlutII = function() {
		MainView.clearOutput();
		MainView.outputText( 'They go at it for nearly an hour, oblivious to you watching them, before their intensity heightens as they near orgasm.  The results are almost explosive, both of them crying out as they begin twitching uncontrollably.  Clinging desperately to the cow-girl\'s ass, the minotaur pumps so much cum into her depths that it begins spurting out.  This accidental lubrication releases his grip and the pair collapse to the ground.  Yet the minotaur isn\'t finished, his man-milk spraying into the air almost like his still-erect dick is a hose and splattering down onto both of them.' );
		MainView.outputText( '\n\nAs you look at the two cum-covered creatures laying there in their exhausted sex-induced stupors, the minotaur\'s thick horse-cock now slowly deflating, you realize that you\'ve been touching yourself.  You make yourself stop in disgust.' );
		MainView.outputText( '\n\nOnly now do you notice other faces peeking over ledges and ridges.  You count at least two goblins and one imp who quickly pull back.  From the sounds, they were busy getting themselves off.  Apparently this isn\'t an uncommon show, and the locals enjoy it immensely.' );
		EngineCore.dynStats( 'lus', 25 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	Mountain.prototype.continueMinoVoyeurism = function() {
		MainView.outputText( 'They go at it for nearly an hour, oblivious to you watching them, before their intensity heightens as they near orgasm. The results are almost explosive, both of them crying out as they begin twitching uncontrollably. Clinging desperately to the cow-girl\'s ass, the minotaur pumps so much cum into her depths that it begins spurting out. This accidental lubrication releases his grip and the pair collapse to the ground. Yet the minotaur isn\'t finished, his man-milk spraying into the air almost like his still-erect dick is a hose and splattering down onto both of them.\n\n', true );
		MainView.outputText( 'As you look at the two cum-covered creatures laying their in their exhausted sex-induced stupors, the minotaur\'s thick horse-cock now slowly deflating, you realize that you\'ve been touching yourself.  You make yourself stop ', false );
		//[low corruption]
		if( CoC.player.cor < 33 ) {
			MainView.outputText( 'in disgust.', false );
		} else if( CoC.player.cor < 66 ) {
			MainView.outputText( 'in confusion.', false );
		} else {
			MainView.outputText( 'reluctantly.', false );
		}
		MainView.outputText( '\n\nOnly now do you notice other faces peeking over ledges and ridges. You count at least two goblins and one imp who quickly pull back. From the sounds, they were busy getting themselves off.', false );
		//[if first appearance of this event]
		if( CoC.player.statusAffectv1( StatusAffects.MinoPlusCowgirl ) === 0 ) {
			MainView.outputText( '  Apparently this isn\'t an uncommon show, and the locals enjoy it immensely.', false );
		}
		//Lust!
		EngineCore.dynStats( 'lus', 5 + CoC.player.lib / 20 + CoC.player.minoScore() + CoC.player.cowScore() );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	SceneLib.registerScene( 'mountain', new Mountain() );
} );