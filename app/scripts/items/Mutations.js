'use strict';

angular.module('cocjs').factory('Mutations', function ( $log, MainView, SceneLib, CoC_Settings, CoC, kFLAGS, EngineCore, StatusAffects, Utils, PerkLib, CockTypesEnum, Descriptors, AppearanceDefs, Appearance, PregnancyStore ) {
    var Mutations = {};
	Mutations.ceruleanPotion = function(player) {
		player.slimeFeed();
		//Repeat genderless encounters
		if (player.gender === 0 && CoC.flags[kFLAGS.CERULEAN_POTION_NEUTER_ATTEMPTED] > 0) {
			MainView.outputText("You take another sip of the Cerulean Potion.  You find it soothing and become very excited about the possibility of another visit from the succubus.", true);
		} else if (player.gender === 3 && CoC.flags[kFLAGS.UNKNOWN_FLAG_NUMBER_00111] > 0) {
			MainView.outputText("With anticipation, you chug down another bottle of the Cerulean Potion. A warm sensation radiates out from your stomach as you feel the potion course through your body.", true);
		} else { //All else
			MainView.outputText("The liquid tastes rather bland and goes down easily. ", true);
			//Special repeat texts
			if (player.findStatusAffect(StatusAffects.RepeatSuccubi) >= 0) {
				MainView.outputText("You look forwards to tonight's encounter.", false);
			} else { //First timer huh?
				MainView.outputText("You do not notice any real effects.  Did the merchant con you?", false);
			}
		}
		if (player.findStatusAffect(StatusAffects.SuccubiNight) >= 0) {
			if (player.statusAffectv1(StatusAffects.SuccubiNight) < 3) {
				player.addStatusValue(StatusAffects.SuccubiNight,1,1);
			}
		} else {
			player.createStatusAffect(StatusAffects.SuccubiNight, 1, 0, 0, 0);
		}
	};
	//Vitality Tincture
	Mutations.vitalityTincture = function(player) {
		player.slimeFeed();
		MainView.outputText("You down the contents of the bottle. The liquid is thick and tastes remarkably like cherries. Within moments, you feel much more fit and healthy.", true);
		//str change
		var str = Utils.rand(3);
		var tou = 0;
		EngineCore.dynStats("str", str);
		//Garunteed toughness if no str
		if (str === 0) {
			tou = Utils.rand(3);
			if (tou === 0) {
				tou = 1;
			}
		} else {
			tou = Utils.rand(3);
		}
		//tou change
		EngineCore.dynStats("tou", tou);
		//Chance of fitness change
		if (EngineCore.HPChange(50, false)) {
			MainView.outputText("  Any aches, pains and bruises you have suffered no longer hurt and you feel much better.", false);
		}
		if ( Utils.rand(3) === 0) {
			MainView.outputText(player.modTone(95, 3), false);
		}
	};
	//Scholar's Tea
	Mutations.scholarsTea = function(player) {
		player.slimeFeed();
		MainView.outputText("Following the merchant's instructions, you steep and drink the tea. Its sharp taste fires up your palate and in moments, you find yourself more alert and insightful. As your mind wanders, a creative, if somewhat sordid, story comes to mind. It is a shame that you do not have writing implements as you feel you could make a coin or two off what you have conceived. The strange seller was not lying about the power of the tea.", true);
		if ( Utils.rand(3) === 0) {
			MainView.outputText(player.modTone(15, 1), false);
		}
		EngineCore.dynStats("int", 2.5 + Utils.rand(5));
	};
	/* ITEMZZZZZ FUNCTIONS GO HERE */
	Mutations.incubiDraft = function(tainted,player) {
		player.slimeFeed();
		var changesLevel = Utils.rand(100);
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changesLevel += 10;
		}
		MainView.outputText("The draft is slick and sticky, ", true);
		if (player.cor <= 33) {
			MainView.outputText("just swallowing it makes you feel unclean.", false);
		} else if(player.cor <= 66) {
			MainView.outputText("reminding you of something you just can't place.", false);
		} else {
			MainView.outputText("deliciously sinful in all the right ways.", false);
		}
		if (player.cor >= 90) {
			MainView.outputText("  You're sure it must be distilled from the cum of an incubus.", false);
		}
		var effect = 0;
		//Lowlevel changes
		if (changesLevel < 50) {
			if (player.cocks.length === 1) {
				if (player.cocks[0].cockType !== CockTypesEnum.DEMON) {
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(0) + " becomes shockingly hard.  It turns a shiny inhuman purple and spasms, dribbling hot demon-like cum as it begins to grow.", false);
				} else {
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(0) + " becomes shockingly hard.  It dribbles hot demon-like cum as it begins to grow.", false);
				}
				if ( Utils.rand(4) === 0) {
					effect = player.increaseCock(0, 3);
				} else {
					effect = player.increaseCock(0, 1);
				}
				EngineCore.dynStats("int", 1, "lib", 2, "sen", 1, "lust", 5 + effect * 3, "cor", tainted ? 1 : 0);
				if (effect < 0.5) {
					MainView.outputText("  It stops almost as soon as it starts, growing only a tiny bit longer.", false);
				} else if(effect < 1) {
					MainView.outputText("  It grows slowly, stopping after roughly half an inch of growth.", false);
				} else if(effect <= 2) {
					MainView.outputText("  The sensation is incredible as more than an inch of lengthened dick-flesh grows in.", false);
				} else {
					MainView.outputText("  You smile and idly stroke your lengthening " + Descriptors.cockDescript(0) + " as a few more inches sprout.", false);
				}
				if (tainted) {
					EngineCore.dynStats("int", 1, "lib", 2, "sen", 1, "lus", 5 + effect * 3, "cor", 1);
				} else {
					EngineCore.dynStats("int", 1, "lib", 2, "sen", 1, "lus", 5 + effect * 3);
				}
				if (player.cocks[0].cockType !== CockTypesEnum.DEMON) {
					MainView.outputText("  With the transformation complete, your " + Descriptors.cockDescript(0) + " returns to its normal coloration.", false);
				} else {
					MainView.outputText("  With the transformation complete, your " + Descriptors.cockDescript(0) + " throbs in an almost happy way as it goes flaccid once more.", false);
				}
			}else if (player.cocks.length > 1) {
				var shortestCockIndex = player.shortestCockIndex();
				if (Utils.rand(4) === 0) {
					effect = player.increaseCock(shortestCockIndex, 3);
				} else {
					effect = player.increaseCock(shortestCockIndex, 1);
				}
				if (tainted) {
					EngineCore.dynStats("int", 1, "lib", 2, "sen", 1, "lus", 5 + effect * 3, "cor", 1);
				} else {
					EngineCore.dynStats("int", 1, "lib", 2, "sen", 1, "lus", 5 + effect * 3);
				}
				//Grammar police for 2 cocks
				if (player.cockTotal() === 2) {
					MainView.outputText("\n\nBoth of your " + Descriptors.multiCockDescriptLight() + " become shockingly hard, swollen and twitching as they turn a shiny inhuman purple in color.  They spasm, dripping thick ropes of hot demon-like pre-cum along their lengths as your shortest " + Descriptors.cockDescript(shortestCockIndex) + " begins to grow.", false);
				} else { //For more than 2
					MainView.outputText("\n\nAll of your " + Descriptors.multiCockDescriptLight() + " become shockingly hard, swollen and twitching as they turn a shiny inhuman purple in color.  They spasm, dripping thick ropes of hot demon-like pre-cum along their lengths as your shortest " + Descriptors.cockDescript(shortestCockIndex) + " begins to grow.", false);
				}
				if (effect < 0.5) {
					MainView.outputText("  It stops almost as soon as it starts, growing only a tiny bit longer.", false);
				} else if(effect < 1) {
					MainView.outputText("  It grows slowly, stopping after roughly half an inch of growth.", false);
				} else if (effect <= 2) {
					MainView.outputText("  The sensation is incredible as more than an inch of lengthened dick-flesh grows in.", false);
				} else {
					MainView.outputText("  You smile and idly stroke your lengthening " + Descriptors.cockDescript(shortestCockIndex) + " as a few more inches sprout.", false);
				}
				MainView.outputText("  With the transformation complete, your " + Descriptors.multiCockDescriptLight() + " return to their normal coloration.", false);
			}else if (player.cocks.length === 0) {
				player.createCock();
				player.cocks[0].cockLength = Utils.rand(3) + 4;
				player.cocks[0].cockThickness = 1;
				MainView.outputText("\n\nYou shudder as a pressure builds in your crotch, peaking painfully as a large bulge begins to push out from your body.  ", false);
				MainView.outputText("The skin seems to fold back as a fully formed demon-cock bursts forth from your loins, drizzling hot cum everywhere as it orgasms.  Eventually the orgasm ends as your " + Descriptors.cockDescript(0) + " fades to a more normal " + player.skinTone + " tone.", false);
				if (tainted) {
					EngineCore.dynStats("lib", 3, "sen", 5, "lus", 10, "cor", 5);
				} else {
					EngineCore.dynStats("lib", 3, "sen", 5, "lus", 10);
				}
			}
			//TIT CHANGE 25% chance of shrinkage
			if ( Utils.rand(4) === 0) {
				if (!CoC.flags[kFLAGS.HYPER_HAPPY]) {
					player.shrinkTits();
				}
			}
		} else if(changesLevel < 93) { //Mid-level changes
			var maxLengthChange = 0;
			var maxThicknessChange = 0;
			if (player.cocks.length > 1) {
				MainView.outputText("\n\nYour cocks fill to full-size... and begin growing obscenely.  ", false);
				_.forEach(player.cocks, function(cock, index) {
					maxLengthChange = Math.max(maxLengthChange, player.increaseCock(index, Utils.rand(3) + 2));
					var thicknessChange = cock.thickenCock(1);
					if (thicknessChange < 0.1) {
						cock.cockThickness += 0.05;
						thicknessChange += 0.05;
					}
					maxThicknessChange = Math.max(maxThicknessChange, thicknessChange);
				});
				player.lengthChange(maxLengthChange, player.cocks.length);
				//Display the degree of thickness change.
				if (maxThicknessChange >= 1) {
					MainView.outputText("\n\nYour cocks spread rapidly, swelling as they grow an inch or more in girth, making them feel fat and floppy.", false);
				}else if (maxThicknessChange <= 0.5) {
					MainView.outputText("\n\nYour cocks feel swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. They are definitely thicker.", false);
				}
				if (maxThicknessChange > 0.5 && maxLengthChange < 1) {
					MainView.outputText("\n\nYour cocks seem to swell up, feeling heavier. You look down and watch them growing fatter as they thicken.", false);
				}
				if (tainted) {
					EngineCore.dynStats("lib", 3, "sen", 5, "lus", 10, "cor", 3);
				} else {
					EngineCore.dynStats("lib", 3, "sen", 5, "lus", 10);
				}
			}else if (player.cocks.length === 1) {
				MainView.outputText("\n\nYour cock fills to its normal size and begins growing... ", false);
				maxThicknessChange = player.cocks[0].thickenCock(1);
				maxLengthChange = player.increaseCock(0, Utils.rand(3) + 2);
				player.lengthChange(maxLengthChange, 1);
				//Display the degree of thickness change.
				if (maxThicknessChange >= 1) {
					MainView.outputText("  Your cock spreads rapidly, swelling an inch or more in girth, making it feel fat and floppy.", false);
				}else if (maxThicknessChange <= 0.5) {
					MainView.outputText("  Your cock feels swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. It is definitely thicker.", false);
				}
				if (maxThicknessChange > 0.5 && maxLengthChange < 1) {
					MainView.outputText("  Your cock seems to swell up, feeling heavier. You look down and watch it growing fatter as it thickens.", false);
				}
				if (tainted) {
					EngineCore.dynStats("lib", 3, "sen", 5, "lus", 10, "cor", 3);
				} else {
					EngineCore.dynStats("lib", 3, "sen", 5, "lus", 10);
				}
			}
			if (player.cocks.length === 0) {
				player.createCock();
				player.cocks[0].cockLength = Utils.rand(3) + 4;
				player.cocks[0].cockThickness = 1;
				MainView.outputText("\n\nYou shudder as a pressure builds in your crotch, peaking painfully as a large bulge begins to push out from your body.  ", false);
				MainView.outputText("The skin seems to fold back as a fully formed demon-cock bursts forth from your loins, drizzling hot cum everywhere as it orgasms.  Eventually the orgasm ends as your " + Descriptors.cockDescript(0) + " fades to a more normal " + player.skinTone + " tone.", false);
				if (tainted) {
					EngineCore.dynStats("lib", 3, "sen", 5, "lus", 10, "cor", 3);
				} else {
					EngineCore.dynStats("lib", 3, "sen", 5, "lus", 10);
				}
			}
			//Shrink breasts a more
			//TIT CHANGE 50% chance of shrinkage
			if ( Utils.rand(2) === 0) {
				if (!CoC.flags[kFLAGS.HYPER_HAPPY]) {
					player.shrinkTits();
				}
			}
		} else { //High level change
			if (player.cockTotal() < 10) {
				if (Utils.rand(10) < Math.floor(player.cor / 25)) {
					MainView.outputText("\n\n", false);
					Mutations.growDemonCock( Utils.rand(2) + 2, player);
					if (tainted) {
						EngineCore.dynStats("lib", 3, "sen", 5, "lus", 10, "cor", 5);
					} else {
						EngineCore.dynStats("lib", 3, "sen", 5, "lus", 10);
					}
				} else {
					Mutations.growDemonCock(1, player);
				}
			}
			if (!CoC.flags[kFLAGS.HYPER_HAPPY]){
				player.shrinkTits();
				player.shrinkTits();
			}
		}
		//Demonic changes - higher chance with higher corruption.
		if ( Utils.rand(40) + player.cor / 3 > 35 && tainted) {
			Mutations.demonChanges(player);
		}
		player.genderCheck();
		if ( Utils.rand(4) === 0 && tainted) {
			MainView.outputText(player.modFem(5, 2), false);
		}
		if ( Utils.rand(4) === 0 && tainted) {
			MainView.outputText(player.modThickness(30, 2), false);
		}
	};
	Mutations.growDemonCock = function(growCocks, player) {
		_.forEach(_.range(growCocks), function() {
			player.createCock();
			$log.debug("COCK LENGTH: " + player.cocks[length - 1].cockLength);
			player.cocks[player.cocks.length - 1].cockLength = Utils.rand(3) + 4;
			player.cocks[player.cocks.length - 1].cockThickness = 0.75;
			$log.debug("COCK LENGTH: " + player.cocks[length - 1].cockLength);
		});
		MainView.outputText("\n\nYou shudder as a pressure builds in your crotch, peaking painfully as a large bulge begins to push out from your body.  ", false);
		if (growCocks === 1) {
			MainView.outputText("The skin seems to fold back as a fully formed demon-cock bursts forth from your loins, drizzling hot cum everywhere as it orgasms.  In time it fades to a more normal coloration and human-like texture.  ", false);
		} else {
			MainView.outputText("The skin bulges obscenely, darkening and splitting around " + Utils.num2Text(growCocks) + " of your new dicks.  For an instant they turn a demonic purple and dribble in thick spasms of scalding demon-cum.  After, they return to a more humanoid coloration.  ", false);
		}
		if (growCocks > 4) {
			MainView.outputText("Your tender bundle of new cocks feels deliciously sensitive, and you cannot stop yourself from wrapping your hands around the slick demonic bundle and pleasuring them.\n\nNearly an hour later, you finally pull your slick body away from the puddle you left on the ground.  When you look back, you notice it has already been devoured by the hungry earth.", false);
		}
		player.orgasm();
	};
	Mutations.tatteredScroll = function(player) {
		MainView.outputText("Your wobbly " + player.legs() + " give out underneath you as your body's willpower seems to evaporate, your mouth reading the words on the scroll with a backwards sounding sing-song voice.\n\n", true);
		if (player.hairColor === "sandy blonde") {
			MainView.outputText("Your mouth forms a smile of its own volition, reading, \"<i>Tresed eht retaw llahs klim ruoy.</i>\"\n\n", false);
			if (player.breastRows.length === 0 || player.biggestTitSize() === 0) {
				MainView.outputText("You grow a perfectly rounded pair of C-cup breasts!  ", false);
				if (player.breastRows.length === 0) {
					player.createBreastRow();
				}
				player.breastRows[0].breasts = 2;
				player.breastRows[0].breastRating = 3;
				if (player.breastRows[0].nipplesPerBreast < 1) {
					player.breastRows[0].nipplesPerBreast = 1;
				}
				EngineCore.dynStats("sen", 2, "lus", 1);
			}
			if (player.biggestTitSize() > 0 && player.biggestTitSize() < 3) {
				MainView.outputText("Your breasts suddenly balloon outwards, stopping as they reach a perfectly rounded C-cup.  ", false);
				player.breastRows[0].breastRating = 3;
				EngineCore.dynStats("sen", 1, "lus", 1);
			}
			if (player.averageNipplesPerBreast() < 1) {
				MainView.outputText("A dark spot appears on each breast, rapidly forming into a sensitive nipple.  ", false);
				_.forEach(player.breastRows, function(breastRow) {
					if (breastRow.nipplesPerBreast < 1) {
						breastRow.nippleLength = 0.2;
					}
					breastRow.nipplesPerBreast = 1;
				});
				EngineCore.dynStats("sen", 2, "lus", 1);
			}
			if (player.biggestLactation() > 0) {
				MainView.outputText("A strong pressure builds in your chest, painful in its intensity.  You yank down your top as ", false);
				if (player.biggestLactation() < 2) {
					MainView.outputText("powerful jets of milk spray from your nipples, spraying thick streams over the ground.  You moan at the sensation and squeeze your tits, hosing down the tainted earth with an offering of your milk.  You blush as the milk ends, quite embarassed with your increased milk production.  ", false);
				} else if (player.biggestLactation() <= 2.6) {
					MainView.outputText("eruptions of milk squirt from your nipples, hosing thick streams everywhere.  The feeling of the constant gush of fluids is very erotic, and you feel yourself getting more and more turned on.  You start squeezing your breasts as the flow diminishes, anxious to continue the pleasure, but eventually all good things come to an end.  ", false);
				} else if (player.biggestLactation() < 3) {
					MainView.outputText("thick hoses of milk erupt from your aching nipples, forming puddles on the ground.  You smile at how well you're feeding the earth, your milk coating the ground faster than it can be absorbed.  The constant lactation is pleasurable... in a highly erotic way, and you find yourself moaning and pulling on your nipples, your hands completely out of control.  In time you realize the milk has stopped, and even had time to soak into the dirt.  You wonder at your strange thoughts and pull your hands from your sensitive nipples.  ", false);
				} else {
					MainView.outputText("you drop to your knees and grab your nipples.  With a very sexual moan you begin milking yourself, hosing out huge quantities of milk.  You pant and grunt, offering as much of your milk as you can.  It cascades down a hill in a small stream, and you can't help but blush with pride... and lust.  The erotic pleasures build as you do your best to feed the ground all of your milk.  You ride the edge of orgasm for an eternity, milk everywhere.  When you come to, you realize you're kneeling there, tugging your dry nipples.  Embarrassed, you stop, but your arousal remains.  ", false);
				}
				if (player.biggestLactation() < 3) {
					player.boostLactation( 0.7 );
					MainView.outputText("Your breasts feel fuller... riper... like your next milking could be even bigger.  ", false);
				}
				EngineCore.dynStats("lib", 1, "sen", 4, "lus", 15);
			}else {
				MainView.outputText("A pleasurable release suddenly erupts from your nipples!  Twin streams of milk are spraying from your breasts, soaking into the ground immediately.  It stops all too soon, though a voice in your head assures you that you can lactate quite often now.  ", false);
				player.boostLactation(1);
				EngineCore.dynStats("lib", 0.5, "sen", 1, "lus", 10);
			}
			MainView.outputText("\n\nYour mouth curls into a sick smile and, with a voice that isn't your own, speaks, \"<i>I ALWAYS get what I want, dear...</i>\"", false);
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour);
		} else {
			MainView.outputText("Your mouth forms a smile of its own volition, reading, \"<i>nuf erutuf rof riah ydnas, nus tresed eht sa ydnas.</i>\"\n\nYou feel a tingling in your scalp, and realize your hair has become a sandy blonde!", false);
			player.hairColor = "sandy blonde";
			MainView.outputText("\n\nYour mouth curls with a sick smile, speaking with a voice that isn't your own, \"<i>I ALWAYS get what I want, dear...</i>\"", false);
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour);
		}
		if (!CoC.isInCombat()) {
			//RAEP
			MainView.spriteSelect(50);
			MainView.outputText("\n\nYou hear the soft impact of clothes hitting the ground behind you, and turn to see that the sand witch has found you! You cannot resist a peek at your uninvited guest, beholding a curvy dark-skinned beauty, her form dominated by a quartet of lactating breasts.  Somewhere in your lust-fogged mind you register the top two as something close to double-Ds, and her lower pair to be about Cs.  She smiles and leans over you, pushing you to the ground violently.\n\nShe turns around and drops, planting her slick honey-pot firmly against your mouth.  Her scent is strong, overpowering in its intensity.  Your tongue darts out for a taste and finds a treasure trove of sticky sweetness.  Instinctively you tongue-fuck her, greedily devouring her cunny-juice, shoving your tongue in as far as possible while suckling her clit.  Dimly you feel the milk spattering over you, splashing off you and into the cracked earth.  Everywhere the milk touches feels silky smooth and sensitive, and your hands begin stroking your body, rubbing it in as the witch sprays more and more of it.  You lose track of time, orgasming many times, slick and sticky with sexual fluids.", false);
			player.orgasm();
			EngineCore.dynStats("lib", 1, "sen", 5);
			player.slimeFeed();
		}
	};
	Mutations.minotaurCum = function(player) {
		player.slimeFeed();
		//Minotaur cum addiction
		player.minoCumAddiction(7);
		MainView.outputText("", true);
		MainView.outputText("As soon as you crack the seal on the bottled white fluid, a ", false);
		if (CoC.flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] === 0) {
			MainView.outputText("potent musk washes over you.", false);
		} else {
			MainView.outputText("heavenly scent fills your nostrils.", false);
		}
		if (CoC.flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] < 50) {
			MainView.outputText("  It makes you feel dizzy, ditzy, and placid.", false);
		} else {
			MainView.outputText("  It makes you feel euphoric, happy, and willing to do ANYTHING to keep feeling this way.", false);
		}
		MainView.outputText("  Unbidden, your hand brings the bottle to your lips, and the heady taste fills your mouth as you convulsively swallow the entire bottle.", false);
		//-Raises lust by 10.
		//-Raises sensitivity
		EngineCore.dynStats("sen", 1, "lus", 10);
		//-Raises corruption by 1 to 50, then by 0.5 to 75, then by 0.25 to 100.
		if (player.cor < 50) {
			EngineCore.dynStats("cor", 1);
		} else if (player.cor < 75) {
			EngineCore.dynStats("cor", 0.5);
		} else {
			EngineCore.dynStats("cor", 0.25);
		}
		MainView.outputText("\n\nIntermittent waves of numbness wash through your body, turning into a warm tingling that makes you feel sensitive all over.  The warmth flows through you, converging in your loins and bubbling up into lust.", false);
		if (player.cocks.length > 0) {
			MainView.outputText("  ", false);
			if (player.cockTotal() === 1) {
				MainView.outputText("Y", false);
			} else {
				MainView.outputText("Each of y", false);
			}
			MainView.outputText("our " + Descriptors.multiCockDescriptLight() + " aches, flooding with blood until it's bloating and trembling.", false);
		}
		if (player.hasVagina()) {
			MainView.outputText("  Your " + Descriptors.clitDescript() + " engorges, ", false);
			if (player.clitLength < 3) {
				MainView.outputText("parting your lips.", false);
			} else {
				MainView.outputText("bursting free of your lips and bobbing under its own weight.", false);
			}
			if (player.vaginas[0].vaginalWetness <= AppearanceDefs.VAGINA_WETNESS_NORMAL) {
				MainView.outputText("  Wetness builds inside you as your " + Descriptors.vaginaDescript(0) + " tingles and aches to be filled.", false);
			} else if (player.vaginas[0].vaginalWetness <= AppearanceDefs.VAGINA_WETNESS_SLICK) {
				MainView.outputText("  A trickle of wetness escapes your " + Descriptors.vaginaDescript(0) + " as your body reacts to the desire burning inside you.", false);
			} else if (player.vaginas[0].vaginalWetness <= AppearanceDefs.VAGINA_WETNESS_DROOLING) {
				MainView.outputText("  Wet fluids leak down your thighs as your body reacts to this new stimulus.", false);
			} else {
				MainView.outputText("  Slick fluids soak your thighs as your body reacts to this new stimulus.", false);
			}
		}
		//(Minotaur fantasy)
		if (!CoC.isInCombat() && Utils.rand(10) === 1) {
			MainView.outputText("\n\nYour eyes flutter closed for a second as a fantasy violates your mind.  You're on your knees, prostrate before a minotaur.  Its narcotic scent fills the air around you, and you're swaying back and forth with your belly already sloshing and full of spunk.  Its equine-like member is rubbing over your face, and you submit to the beast, stretching your jaw wide to take its sweaty, glistening girth inside you.  Your tongue quivers happily as you begin sucking and slurping, swallowing each drop of pre-cum you entice from the beastly erection.  Gurgling happily, you give yourself to your inhuman master for a chance to swallow into unthinking bliss.", false);
			EngineCore.dynStats("lib", 1, "lus", Utils.rand(5) + player.cor / 20 + CoC.flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] / 5);
		}
		//(Healing – if hurt and uber-addicted (hasperk))
		if (player.HP < player.maxHP() && player.findPerk(PerkLib.MinotaurCumAddict) >= 0) {
			MainView.outputText("\n\nThe fire of your arousal consumes your body, leaving vitality in its wake.  You feel much better!", false);
			EngineCore.HPChange(Math.floor(player.maxHP() / 4), false);
		}
		//Uber-addicted status!
		if (player.findPerk(PerkLib.MinotaurCumAddict) >= 0 && CoC.flags[kFLAGS.MINOTAUR_CUM_REALLY_ADDICTED_STATE] <= 0) {
			CoC.flags[kFLAGS.MINOTAUR_CUM_REALLY_ADDICTED_STATE] = 3 + Utils.rand(2);
			MainView.outputText("\n\n<b>Your body feels so amazing and sensitive.  Experimentally you pinch yourself and discover that even pain is turning you on!</b>", false);
		}
	};
	Mutations.minotaurBlood = function(player) {
		player.slimeFeed();
		//Changes done
		var changes = 0;
		//Change limit
		var changeLimit = 1;
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(3) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(3) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		if (changeLimit === 1) {
			changeLimit = 2;
		}
		//Set up output
		MainView.outputText("You drink the bubbling red fluid, tasting the tangy iron after-taste.", true);
		//STATS
		//Strength h
		if ( Utils.rand(3) === 0) {
			//weaker characters gain more
			if (player.str <= 50) {
				MainView.outputText("\n\nPainful aches ripple through your body, flooding you with pain as your muscles flex and bulge, growing much stronger and more well-defined.", false);
				//very weak players gain more
				if (player.str <= 20) {
					EngineCore.dynStats("str", 3);
				} else {
					EngineCore.dynStats("str", 2);
				}
			} else { //stronger characters gain less
				//small growth if over 75
				if (player.str >= 75) {
					EngineCore.dynStats("str", 0.5);
				} else { //faster from 50-75
					EngineCore.dynStats("str", 1);
				}
				MainView.outputText("\n\nYour muscles grow tighter, bulging outwards powerfully as you get even stronger!", false);
			}
			//Chance of speed drop
			if ( Utils.rand(2) === 0 && player.str > 50) {
				MainView.outputText("\n\nYou begin to feel that the size of your muscles is starting to slow you down.", false);
				EngineCore.dynStats("spe", -1);
			}
			changes++;
		}
		//Toughness (chance of - sensitivity)
		if ( Utils.rand(3) === 0 && changes < changeLimit) {
			//weaker characters gain more
			if (player.tou <= 50) {
				MainView.outputText("\n\nYour hide... skin... whatever... you can feel it getting tougher as it thickens perceptibly.", false);
				//very weak players gain more
				if (player.tou <= 20) {
					EngineCore.dynStats("tou", 3);
				} else {
					EngineCore.dynStats("tou", 2);
				}
			} else { //stronger characters gain less
				//small growth if over 75
				if (player.tou >= 75) {
					EngineCore.dynStats("tou", 0.5);
				} else { //faster from 50-75
					EngineCore.dynStats("tou", 1);
				}
				MainView.outputText("\n\nYour tough hide grows slightly thicker.", false);
			}
			//chance of less sensitivity
			if ( Utils.rand(2) === 0 && player.sens > 10) {
				if (player.tou > 75) {
					MainView.outputText("\n\nIt becomes much harder to feel anything through your leathery skin.", false);
					EngineCore.dynStats("sen", -3);
				}
				if (player.tou <= 75 && player.tou > 50) {
					MainView.outputText("\n\nThe level of sensation from your skin diminishes noticeably.", false);
					EngineCore.dynStats("sen", -2);
				}
				if (player.tou <= 50) {
					MainView.outputText("\n\nYour sense of touch diminishes due to your tougher hide.", false);
					EngineCore.dynStats("sen", -3);
				}
			}
			changes++;
		}
		//SEXUAL
		//Boosts ball size MORE than equinum :D:D:D:D:D:D:
		if (changes < changeLimit && Utils.rand(2) === 0 && player.ballSize <= 5 && player.horseCocks() > 0) {
			//Chance of ball growth if not 3" yet
			if (player.balls === 0) {
				player.balls = 2;
				player.ballSize = 1;
				MainView.outputText("\n\nA nauseating pressure forms just under the base of your maleness.  With agonizing pain the flesh bulges and distends, pushing out a rounded lump of flesh that you recognize as a testicle!  A moment later relief overwhelms you as the second drops into your newly formed sack.", false);
				EngineCore.dynStats("lib", 2, "lus", 5);
			} else {
				player.ballSize++;
				if (player.ballSize <= 2) {
					MainView.outputText("\n\nA flash of warmth passes through you and a sudden weight develops in your groin.  You pause to examine the changes and your roving fingers discover your " + Descriptors.simpleBallsDescript() + " have grown larger than a human's.", false);
				} else {
					MainView.outputText("\n\nA sudden onset of heat envelops your groin, focusing on your " + Descriptors.sackDescript() + ".  Walking becomes difficult as you discover your " + Descriptors.simpleBallsDescript() + " have enlarged again.", false);
				}
				EngineCore.dynStats("lib", 1, "lus", 3);
			}
			changes++;
		}
		//-Remove feather-arms (copy this for goblin ale, mino blood, equinum, canine pepps, demon items)
		if (changes < changeLimit && player.armType === AppearanceDefs.ARM_TYPE_HARPY && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYou scratch at your biceps absentmindedly, but no matter how much you scratch, it isn't getting rid of the itch.  Glancing down in irritation, you discover that your feathery arms are shedding their feathery coating.  The wing-like shape your arms once had is gone in a matter of moments, leaving " + player.skinDesc + " behind.", false);
			player.armType = AppearanceDefs.ARM_TYPE_HUMAN;
			changes++;
		}
		//-Remove chitin-arms (copy this for goblin ale, mino blood, equinum, canine pepps, demon items)
		if (changes < changeLimit && player.armType === AppearanceDefs.ARM_TYPE_SPIDER && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYou scratch at your biceps absentmindedly, but no matter how much you scratch, it isn't getting rid of the itch.  Glancing down in irritation, you discover that your arms' chitinous covering is flaking away.  The glossy black coating is soon gone, leaving " + player.skinDesc + " behind.", false);
			player.armType = AppearanceDefs.ARM_TYPE_HUMAN;
			changes++;
		}
		//+hooves
		if (player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_HOOFED && player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_CENTAUR) {
			if (changes < changeLimit && Utils.rand(3) === 0) {
				changes++;
				if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HUMAN) {
					MainView.outputText("\n\nYou stagger as your feet change, curling up into painful angry lumps of flesh.  They get tighter and tighter, harder and harder, until at last they solidify into hooves!", false);
				} else if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DOG) {
					MainView.outputText("\n\nYou stagger as your paws change, curling up into painful angry lumps of flesh.  They get tighter and tighter, harder and harder, until at last they solidify into hooves!", false);
				} else if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_NAGA) {
					MainView.outputText("\n\nYou collapse as your sinuous snake-tail tears in half, shifting into legs.  The pain is immense, particularly in your new feet as they curl inward and transform into hooves!", false);
				} else if (player.lowerBody > AppearanceDefs.LOWER_BODY_TYPE_NAGA) {
					MainView.outputText("\n\nYou stagger as your " + player.feet() + " change, curling up into painful angry lumps of flesh.  They get tighter and tighter, harder and harder, until at last they solidify into hooves!", false);
				}
				if (player.skinType !== AppearanceDefs.SKIN_TYPE_FUR) {
					MainView.outputText("  A fine coat of fur grows out below your waist, itching briefly as it fills in.");
				}
				MainView.outputText("<b>  You now have hooves in place of your feet!</b>", false);
				player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HOOFED;
				EngineCore.dynStats("spe", 1);
				changes++;
			}
		}
		if (!CoC.flags[kFLAGS.HYPER_HAPPY]) {
			//Kills vagina size (and eventually the whole vagina)
			if (player.vaginas.length > 0) {
				if (player.vaginas[0].vaginalLooseness > AppearanceDefs.VAGINA_LOOSENESS_TIGHT) {
					//tighten that bitch up!
					MainView.outputText("\n\nYour " + Descriptors.vaginaDescript(0) + " clenches up painfully as it tightens up, becoming smaller and tighter.", false);
					player.vaginas[0].vaginalLooseness--;
				} else {
					MainView.outputText("\n\nA tightness in your groin is the only warning you get before your <b>" + Descriptors.vaginaDescript(0) + " disappears forever</b>!", false);
					//Goodbye womanhood!
					player.removeVagina(0, 1);
					if (player.cocks.length === 0) {
						MainView.outputText("  Strangely, your clit seems to have resisted the change, and is growing larger by the moment... shifting into the shape of a small ribbed minotaur-like penis!  <b>You now have a horse-cock!</b>", false);
						player.createCock();
						player.cocks[0].cockLength = player.clitLength + 2;
						player.cocks[0].cockThickness = 1;
						player.cocks[0].cockType = CockTypesEnum.HORSE;
						player.clitLength = 0.25;
					}
					player.genderCheck();
				}
				changes++;
			}
			//-Remove extra breast rows
			if (changes < changeLimit && player.bRows() > 1 && Utils.rand(3) === 0) {
				changes++;
				MainView.outputText("\n\nYou stumble back when your center of balance shifts, and though you adjust before you can fall over, you're left to watch in awe as your bottom-most " + Descriptors.breastDescript(player.breastRows.length - 1) + " shrink down, disappearing completely into your ", false);
				if (player.bRows() >= 3) {
					MainView.outputText("abdomen", false);
				} else {
					MainView.outputText("chest", false);
				}
				MainView.outputText(". The " + Descriptors.nippleDescript(player.breastRows.length - 1) + "s even fade until nothing but ", false);
				if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
					MainView.outputText(player.hairColor + " " + player.skinDesc, false);
				} else {
					MainView.outputText(player.skinTone + " " + player.skinDesc, false);
				}
				MainView.outputText(" remains. <b>You've lost a row of breasts!</b>", false);
				EngineCore.dynStats("sen", -5);
				player.removeBreastRow(player.breastRows.length - 1, 1);
			} else if ( Utils.rand(2) === 0 && changes < changeLimit && player.breastRows.length > 0) { //Shrink boobages till they are normal
				//Single row
				if (player.breastRows.length === 1) {
					//Shrink if bigger than B cups
					if (player.breastRows[0].breastRating >= 1) {
						player.breastRows[0].breastRating--;
						//Shrink again if huuuuge
						if (player.breastRows[0].breastRating > 8) {
							player.breastRows[0].breastRating--;
							MainView.outputText("\n\nYou feel significantly lighter.  Looking down, you realize your breasts are MUCH smaller, down to " + player.breastCup(0) + "s.", false);
						} else {
							MainView.outputText("\n\nYou feel a weight lifted from you, and realize your " + Descriptors.breastDescript(0) + " have shrunk to " + player.breastCup(0) + "s.", false);
						}
						changes++;
					}
				} else { //multiple
					if (player.biggestTitSize() >= 1) {
						MainView.outputText("\n", false);
					}
					var changedBreasts = 0;
					_.forEach(player.breastRows, function(breastRow, index) {
						if (breastRow.breastRating >= 1) {
							breastRow.breastRating--;
							changedBreasts++;
							MainView.outputText("\n", false);
							//If this isn't the first change...
							if (changedBreasts > 1) {
								MainView.outputText("...and y", false);
							} else {
								MainView.outputText("Y", false);
							}
							MainView.outputText("our " + Descriptors.breastDescript(index) + " shrink, dropping to " + player.breastCup(index) + "s.", false);
						}
					});
					if (changedBreasts === 2) {
						MainView.outputText("\nYou feel so much lighter after the change.", false);
					} else if (changedBreasts === 3) {
						MainView.outputText("\nWithout the extra weight you feel particularly limber.", false);
					} else if (changedBreasts >= 4) {
						MainView.outputText("\nIt feels as if the weight of the world has been lifted from your shoulders, or in this case, your chest.", false);
					}
					if (changedBreasts > 0) {
						changes++;
					}
				}
			}
		}
		var result = 0;
		var selectedCock = -1;
		//Boosts cock size up to 36"x5".
		if (changes < changeLimit && Utils.rand(2) === 0 && player.cocks.length > 0) {
			selectedCock = _.indexOf(player.cocks, _.findBy(player.cocks, function(cock) {
				return cock.cockType === CockTypesEnum.HORSE && (cock.cockLength < 36 || cock.cockThickness < 5);
			}));
			//Length first
			if (selectedCock !== -1) {
				//Thickness too if small enough
				if (player.cocks[selectedCock].cockThickness < 5) {
					//Increase by 2 + Utils.rand(8), and store the actual amount in result
					result = player.increaseCock(selectedCock, 2 + Utils.rand(8));
					result += player.cocks[selectedCock].thickenCock(1);
					//Comment on length changes
					if (result > 6) {
						MainView.outputText("\n\nGasping in sudden pleasure, your " + Descriptors.cockDescript(selectedCock) + " surges free of its sheath, emerging with over half a foot of new dick-flesh.", false);
					} else if (result >= 3) {
						MainView.outputText("\n\nYou pant in delight as a few inches of " + Descriptors.cockDescript(selectedCock) + " pop free from your sheath, the thick new horse-flesh still slick and sensitive.", false);
					} else {
						MainView.outputText("\n\nGroaning softly, you feel a pleasurable change in your groin.  Looking down, you see [oneCock] grow slightly longer.", false);
					}
					//Add a blurb about thickness...
					MainView.outputText("  To your delight and surprise, you discover it has grown slightly thicker as well!", false);
				} else { //Just length...
					//Increase by 2 + Utils.rand(8), and store the actual amount in result
					result = player.increaseCock(selectedCock, 2 + Utils.rand(8));
					//Comment on length changes
					if (result > 6) {
						MainView.outputText("\n\nGasping in sudden pleasure, your " + Descriptors.cockDescript(selectedCock) + " surges free of its sheath, emerging with over half a foot of new dick-flesh.", false);
					} else if (result >= 3) {
						MainView.outputText("\n\nYou pant in delight as a few inches of " + Descriptors.cockDescript(selectedCock) + " pop free from your sheath, the thick new horse-flesh still slick and sensitive.", false);
					} else {
						MainView.outputText("\n\nGroaning softly, you feel a pleasurable change in your groin.  Looking down, you see [oneCock] grow slightly longer.", false);
					}
				}
				changes++;
			}
		}
		//Morph dick to horsediiiiick
		if (player.cocks.length > 0 && Utils.rand(2) === 0 && changes < changeLimit) {
			selectedCock = _.indexOf(player.cocks, _.findBy(player.cocks, function(cock) {
				return cock.cockType !== CockTypesEnum.HORSE;
			}));
			if (selectedCock !== -1) {
				//Text for humandicks or others
				if (player.cocks[selectedCock].cockType === CockTypesEnum.HUMAN || player.cocks[selectedCock].cockType.Index > 2) {
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(selectedCock) + " begins to feel strange... you pull down your pants to take a look and see it darkening as you feel a tightness near the base where your skin seems to be bunching up.  A sheath begins forming around your cock's base, tightening and pulling your cock inside its depths.  A hot feeling envelops your member as it suddenly grows into a horse penis, dwarfing its old size.  The skin is mottled brown and black and feels more sensitive than normal.  Your hands are irresistibly drawn to it, and you jerk yourself off, splattering cum with intense force.", false);
				}
				//Text for dogdicks
				if (player.cocks[selectedCock].cockType === CockTypesEnum.DOG) {
					MainView.outputText("\n\nYour " + Appearance.cockNoun(CockTypesEnum.DOG) + " begins to feel odd...  You pull down your clothes to take a look and see it darkening.  You feel a growing tightness in the tip of your " + Appearance.cockNoun(CockTypesEnum.DOG) + " as it flattens, flaring outwards.  Your cock pushes out of your sheath, inch after inch of animal-flesh growing beyond its traditional size.  You notice your knot vanishing, the extra flesh pushing more fresh horsecock out from your sheath.  <b>Your hands are drawn to the strange new " + Appearance.cockNoun(CockTypesEnum.HORSE) + "</b>, and you jerk yourself off, splattering thick ropes of cum with intense force.", false);
				}
				player.cocks[selectedCock].cockType = CockTypesEnum.HORSE;
				player.increaseCock(selectedCock, 4);
				EngineCore.dynStats("lib", 5, "sen", 4, "lus", 35);
				MainView.outputText("<b>  You now have a");
				if (player.horseCocks() > 1) {
					MainView.outputText("nother");
				}
				MainView.outputText(" horse-penis.</b>", false);
				changes++;
			}
		}
		//Males go into rut
		if ( Utils.rand(4) === 0) {
			player.goIntoRut(true);
		}
		//Anti-masturbation status
		if ( Utils.rand(4) === 0 && changes < changeLimit && player.findStatusAffect(StatusAffects.Dysfunction) < 0) {
			if (player.cocks.length > 0) {
				MainView.outputText("\n\nYour " + Descriptors.cockDescript(0) + " tingles abruptly, then stops.  Worried, you reach down to check it, only to discover that it feels... numb.  It will be very hard to masturbate like this.", false);
			} else if (player.hasVagina()) {
				MainView.outputText("\n\nYour " + Descriptors.vaginaDescript(0) + " tingles abruptly, then stops.  Worried, you reach down to check it, only to discover that it feels... numb.  It will be very hard to masturbate like this.", false);
			}
			if (player.cocks.length > 0 || player.hasVagina()) {
				player.createStatusAffect(StatusAffects.Dysfunction, 96, 0, 0, 0);
				changes++;
			}
		}
		//Appearance shit:
		//Tail, Ears, Hooves, Horns, Height (no prereq), Face
		//+height up to 9 foot
		if (changes < changeLimit && Utils.rand(1.7) === 0 && player.tallness < 108) {
			var tallnessChange = Utils.rand(5) + 3;
			//Slow rate of growth near ceiling
			if (player.tallness > 90) {
				tallnessChange = Math.floor(tallnessChange / 2);
			}
			//Never 0
			if (tallnessChange === 0) {
				tallnessChange = 1;
			}
			//Flavor texts.  Flavored like 1950's cigarettes. Yum.
			if (tallnessChange < 5) {
				MainView.outputText("\n\nYou shift uncomfortably as you realize you feel off balance.  Gazing down, you realize you have grown SLIGHTLY taller.", false);
			} else if (tallnessChange < 7) {
				MainView.outputText("\n\nYou feel dizzy and slightly off, but quickly realize it's due to a sudden increase in height.", false);
			} else {
				MainView.outputText("\n\nStaggering forwards, you clutch at your head dizzily.  You spend a moment getting your balance, and stand up, feeling noticeably taller.", false);
			}
			player.tallness += tallnessChange;
			changes++;
		}
		//Face change, requires Ears + Height + Hooves
		if (player.earType === AppearanceDefs.EARS_COW && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HOOFED && player.tallness >= 90 && changes < changeLimit && Utils.rand(3) === 0) {
			if (player.faceType !== AppearanceDefs.FACE_COW_MINOTAUR) {
				MainView.outputText("\n\nBones shift and twist painfully as your visage twists and morphs to resemble that of the beast whose blood you now drink.  <b>You now have a minotaur-like face.</b>", false);
				changes++;
				player.faceType = AppearanceDefs.FACE_COW_MINOTAUR;
			}
		}
		//+mino horns require ears/tail
		if (changes < changeLimit && Utils.rand(3) === 0 && player.earType === AppearanceDefs.EARS_COW && player.tailType === AppearanceDefs.TAIL_TYPE_COW) {
			//New horns or expanding mino horns
			if (player.hornType === AppearanceDefs.HORNS_COW_MINOTAUR || player.hornType === AppearanceDefs.HORNS_NONE) {
				//Get bigger if player has horns
				if (player.hornType === AppearanceDefs.HORNS_COW_MINOTAUR) {
					//Fems horns don't get bigger.
					if (player.vaginas.length > 0) {
						if (player.horns > 4) {
							MainView.outputText("\n\nYou feel a pressure in your head around your horns, but they don't grow any larger.  ", false);
							MainView.outputText("Your headache clears as lust washes through you unnaturally.  You feel as if you haven't cum in months.", false);
							player.hoursSinceCum += 200;
							EngineCore.dynStats("lus", 20);
						} else {
							MainView.outputText("\n\nYour small horns get a bit bigger, stopping as medium sized nubs.", false);
							player.horns += 3;
						}
						changes++;
					} else { //Males horns get 'uge.
						var hornsChange = 1 + Utils.rand(3);
						player.horns += hornsChange;
						if (hornsChange === 1) {
							MainView.outputText("\n\nAn aching pressure builds in your temples as you feel your horns push another inch of length from your skull.  ", false);
						} else if (hornsChange === 2) {
							MainView.outputText("\n\nA powerful headache momentarily doubles you over.  With painful slowness, you feel your horns push another two inches of length out from your brow, gradually thickening as they grow.  ", false);
						} else {
							MainView.outputText("\n\nAgony overwhelms you as a headache of terrifying intensity sweeps through your skull.  You squeeze your eyes shut from the pain, but it does little to help.  The torture intensifies before finally diminishing as you feel an inch or two of new horn force its way out of your forehead.  The headache remains despite this, and desperate for relief, you grab hold of your horns and tug, pulling another inch of new horn free.  At last the pain fades, leaving you with significantly enhanced head-spikes.  ", false);
						}
						if (player.horns < 3) {
							MainView.outputText("They are the size of tiny nubs.", false);
						} else if (player.horns < 6) {
							MainView.outputText("They are similar to what you would see on a young bull.", false);
						} else if (player.horns < 12) {
							MainView.outputText("They look like the horns on a grown bull, big enough and dangerous enough to do some damage.", false);
						} else if (player.horns < 20) {
							MainView.outputText("They are large and wicked looking.", false);
						} else {
							MainView.outputText("They are huge, heavy, and tipped with dangerous points.", false);
						}
						//boys get a cum refill sometimes
						if ( Utils.rand(2) === 0 && changes < changeLimit) {
							MainView.outputText("  Your headache clears as lust washes through you unnaturally.  You feel as if you haven't cum in months.", false);
							player.hoursSinceCum += 200;
							EngineCore.dynStats("lus", 20);
						}
						changes++;
					}
				} else { //If no horns yet..
					MainView.outputText("\n\nWith painful pressure, the skin on your forehead splits around two tiny nub-like horns, similar to those you would see on the cattle back in your homeland.", false);
					player.hornType = AppearanceDefs.HORNS_COW_MINOTAUR;
					player.horns = 2;
					changes++;
				}
			}
			//Not mino horns, change to cow-horns
			if (player.hornType === AppearanceDefs.HORNS_DEMON || player.hornType > AppearanceDefs.HORNS_COW_MINOTAUR) {
				MainView.outputText("\n\nYour horns vibrate and shift as if made of clay, reforming into two horns with a bovine-like shape.", false);
				player.hornType = AppearanceDefs.HORNS_COW_MINOTAUR;
				changes++;
			}
		}
		//+cow ears	- requires tail
		if (player.earType !== AppearanceDefs.EARS_COW && changes < changeLimit && player.tailType === AppearanceDefs.TAIL_TYPE_COW && Utils.rand(2) === 0) {
			MainView.outputText("\n\nYou feel your ears tug on your scalp as they twist shape, becoming oblong and cow-like.  <b>You now have cow ears.</b>", false);
			player.earType = AppearanceDefs.EARS_COW;
			changes++;
		}
		//+cow tail
		if (changes < changeLimit && Utils.rand(2) === 0 && player.tailType !== AppearanceDefs.TAIL_TYPE_COW) {
			if (player.tailType === AppearanceDefs.TAIL_TYPE_NONE) {
				MainView.outputText("\n\nYou feel the flesh above your " + Descriptors.buttDescript() + " knotting and growing.  It twists and writhes around itself before flopping straight down, now shaped into a distinctly bovine form.  You have a <b>cow tail</b>.", false);
			} else {
				if (player.tailType < AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN || player.tailType > AppearanceDefs.TAIL_TYPE_BEE_ABDOMEN) {
					MainView.outputText("\n\nYour tail bunches uncomfortably, twisting and writhing around itself before flopping straight down, now shaped into a distinctly bovine form.  You have a <b>cow tail</b>.", false);
				}
				//insect
				if (player.tailType === AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN || player.tailType === AppearanceDefs.TAIL_TYPE_BEE_ABDOMEN) {
					MainView.outputText("\n\nYour insect-like abdomen tingles pleasantly as it begins shrinking and softening, chitin morphing and reshaping until it looks exactly like a <b>cow tail</b>.", false);
				}
			}
			player.tailType = AppearanceDefs.TAIL_TYPE_COW;
			changes++;
		}
		if ( Utils.rand(4) === 0 && player.gills && changes < changeLimit) {
			MainView.outputText("\n\nYour chest itches, and as you reach up to scratch it, you realize your gills have withdrawn into your skin.", false);
			player.gills = false;
			changes++;
		}
		if (changes < changeLimit && Utils.rand(4) === 0 && ((player.ass.analWetness > 0 && player.findPerk(PerkLib.MaraesGiftButtslut) < 0) || player.ass.analWetness > 1)) {
			MainView.outputText("\n\nYou feel a tightening up in your colon and your [asshole] sucks into itself.  You feel sharp pain at first but that thankfully fades.  Your ass seems to have dried and tightened up.");
			player.ass.analWetness--;
			if (player.ass.analLooseness > 1) {
				player.ass.analLooseness--;
			}
			changes++;
		}
		//Give you that mino build!
		if ( Utils.rand(4) === 0) {
			MainView.outputText(player.modFem(5, 10), false);
		}
		if ( Utils.rand(4) === 0) {
			MainView.outputText(player.modTone(85, 3), false);
		}
		if ( Utils.rand(4) === 0) {
			MainView.outputText(player.modThickness(70, 4), false);
		}
		//Default
		if (changes === 0) {
			MainView.outputText("\n\nMinotaur-like vitality surges through your body, invigorating and arousing you!\n", false);
			if (player.balls > 0) {
				MainView.outputText("Your balls feel as if they've grown heavier with the weight of more sperm.\n", false);
				player.hoursSinceCum += 200;
			}
			EngineCore.HPChange(50, true);
			EngineCore.dynStats("lus", 50);
		}
	};
	Mutations.equinum = function(player) {
		player.slimeFeed();
		//Changes done
		var changes = 0;
		//Change limit
		var changeLimit = 1;
		//Chancee to raise limit
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(3) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		//Used for random chances
		//Set up output
		MainView.outputText("You down the potion, grimacing at the strong taste.", true);
		//CHANCE OF BAD END - 20% if face/tail/skin/cock are appropriate.
		//If hooved bad end doesn't appear till centaured
		if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR && player.faceType === AppearanceDefs.FACE_HORSE && player.tailType === AppearanceDefs.TAIL_TYPE_HORSE && (player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_HOOFED)) {
			//WARNINGS
			//Repeat warnings
			if (player.findStatusAffect(StatusAffects.HorseWarning) >= 0 && Utils.rand(3) === 0) {
				if (player.statusAffectv1(StatusAffects.HorseWarning) === 0) {
					MainView.outputText("<b>\n\nYou feel a creeping chill down your back as your entire body shivers, as if rejecting something foreign.  Maybe you ought to cut back on the horse potions.</b>", false);
				}
				if (player.statusAffectv1(StatusAffects.HorseWarning) > 0) {
					MainView.outputText("<b>\n\nYou wonder how many more of these you can drink before you become a horse...</b>", false);
				}
				player.addStatusValue(StatusAffects.HorseWarning,1,1);
			}
			//First warning
			if (player.findStatusAffect(StatusAffects.HorseWarning) < 0) {
				MainView.outputText("<b>\n\nWhile you drink the tasty potion, you realize how horse-like you already are, and wonder what else the potion could possibly change...</b>", false);
				player.createStatusAffect(StatusAffects.HorseWarning, 0, 0, 0, 0);
			}
			//Bad End
			if ( Utils.rand(4) === 0 && player.findStatusAffect(StatusAffects.HorseWarning) >= 0) {
				//Must have been warned first...
				if (player.statusAffectv1(StatusAffects.HorseWarning) > 0) {
					//If player has dicks check for horsedicks
					if (player.cockTotal() > 0) {
						//If player has horsedicks
						if (player.horseCocks() > 0) {
							MainView.outputText("\n\nSoon after you drink the Equinum, a burning sensation fills your chest. You have consumed too much of the potion, and the overdose starts to provoke dramatic changes in your body.  You collapse suddenly, twitching in pain as all the bones and muscles in your body break and reform. Eventually, you pass out from the strain you are put through.\n\nYou wake up after a few minutes. Once you get up on your legs, doubt fills your mind. You rush to a nearby pond and look down, nearly jumping when the reflection of a ", false);
							if (player.gender === 0 || player.gender === 3) {
								MainView.outputText("horse ", false);
							} else if (player.gender === 1) {
								MainView.outputText("stallion ", false);
							} else if (player.gender === 2) {
								MainView.outputText("mare ", false);
							}
							MainView.outputText(" with beautiful " + player.hairColor + " " + player.skinDesc + " covering its body gazes back up at you.  That's you, and yet the doubt in your mind remains. Strange images fill your mind, and you feel as if you have not always been a horse, but some kind of funny fur-less creature standing on two legs. Your equine mind rapidly dismisses that doubt as a daydream however, and you trot away, oblivious to who you once were.\n\n", false);
							MainView.outputText("<b>One year later...</b>\n\nAs you graze upon the small plants that coat the open plains of your home, you hear a noise on your right side. As you raise your head to check where the noise comes from, preparing to run from a potential predator, you see a strange creature. It stands on its two feet, its furless pink skin appearing beneath its clothes.  With a start, you realize you can identify the strange creatures gender.  ", false);
							if (player.gender === 0 || player.gender === 1) {
								MainView.outputText("He is clearly a male, but you are somewhat confused as you can see not one but three bulges where his manhood would be.\n\n", false);
							} else if (player.gender === 2) {
								MainView.outputText("She is clearly a female, as you can see her six breasts jiggle as she walks towards you, small stains appearing on her shirt where her nipples are.\n\n", false);
							} if (player.gender === 3) {
								MainView.outputText("You are somewhat confused as you can see a bulge near her thighs but also huge boobs jiggling as she walks, and you can't say if she's a male or female.\n\n", false);
							}
							MainView.outputText("As soon as you lay eyes on the creature, a wave of nostalgia overtakes you. Somehow, looking at that creature makes you sad, as if you forgot something important.\n\n\"<i>How strange to see a horse here all alone,</i>\" the creature muses, \"<i>In any case, you're still the least bizarre creature I've met here.  Not to mention the only one that hasn't tried to rape me,</i>\" it says with a sigh.\n\nYou answer with an interrogative whinny.\n\n\"<i>Hey, I've got an idea. I'll take you back to the camp. I'll feed you and in return you can help me complete my quest. What do you say?</i>\"\n\nInstinctively, you utter a happy and approving whinny.\n\nYou failed in your quest, losing your focus and more importantly, losing yourself.  But, even so, you found a new meaning to your life, and have a new chance to succeed where you once failed.", false);
							EngineCore.gameOver();
							return;
						}
					} else { //If player has no cocks
						MainView.outputText("\n\nSoon after you drink the Equinum, a burning sensation fills your chest. You have consumed too much of the drink, and the overdose starts to provoke dramatic changes in your body.  You collapse suddenly, twitching in pain as all the bones and all the muscles in your body break and reform. Eventually, you pass out from the strain you are put through.\n\nYou wake up after a few minutes. Once you get up on your legs, doubt fills your mind. You rush to a nearby pond and look down, nearly jumping when the reflection of a ", false);
						if (player.gender === 0 || player.gender === 3) {
							MainView.outputText("horse ", false);
						} else if (player.gender === 1) {
							MainView.outputText("stallion ", false);
						} else if (player.gender === 2) {
							MainView.outputText("mare ", false);
						}
						MainView.outputText("with beautiful " + player.hairColor + " " + player.skinDesc + " covering its body looks back at you.  That's you, and yet the doubt in your mind remains. Strange mental images fill your mind.  You feel as if you have not always been a horse, but some kind of funny fur-less creature standing on two legs. But your equine mind rapidly dismisses that doubt as a daydream, and you trot away, oblivious to who you once were.\n\n", false);
						MainView.outputText("<b>One year after...</b>\n\nAs you graze small plants in the open plains that became your home, you hear a noise on your right side. As you raise your head to check where the noise comes from, preparing to run from a potential predator, you see a strange creature. It stands on two feet, its furless pink skin appearing beneath its clothes.  ", false);
						if (player.gender === 0 || player.gender === 1) {
							MainView.outputText("He is clearly a male, but you are somewhat confused as you can see not one but three bulges where his manhood would be.\n\n", false);
						} else if (player.gender === 2) {
							MainView.outputText("She is clearly a female, as you can see her six breasts jiggle as she walks towards you, small stains appearing on her shirt where her nipples are.\n\n", false);
						} else if (player.gender === 3) {
							MainView.outputText("You are somewhat confused as you can see a bulge near her thighs but also huge boobs jiggling as she walks, and you can't say if she's a male or female.\n\n", false);
						}
						MainView.outputText("As soon as you lay eyes on the creature, a wave of nostalgia overtakes you. Somehow, looking at that creature makes you sad, as if you forgot something important.\n\n\"<i>How strange to see a horse here all alone,</i>\" the creature muses, \"<i>In any case, you're still the least bizarre creature I've met here.  Not to mention the only one that hasn't tried to rape me,</i>\" it says with a sigh.\n\nYou answer with an interrogative whinny.\n\n\"<i>Hey, I've got an idea. I'll take you back to the camp. I'll feed you and in return you can help me to complete my quest. What do you say?</i>\"\n\nInstictively, you utter a happy and approving whinny.\n\nYou failed in your quest, losing you focus and more importantly, losing yourself.  But, even so, you found a new meaning to your life, and have a new chance to achieve what you once failed.", false);
						EngineCore.gameOver();
						return;
					}
				}
			}

		}
		//Stat changes first
		//STRENGTH
		if ( Utils.rand(2) === 0) {
			//Maxxed
			if (player.str >= 60) {
				MainView.outputText("\n\nYou feel strong enough to single-handedly pull a fully-loaded wagon.", false);
			} else { //NOT MAXXED
				EngineCore.dynStats("str", 1);
				MainView.outputText("\n\nYour muscles clench and surge, making you feel as strong as a horse.", false);
				changes++;
			}
		}
		//TOUGHNESS
		if ( Utils.rand(2) === 0) {
			//MAXXED ALREADY
			if (player.tou >= 75) {
				MainView.outputText("\n\nYour body is as tough and solid as a ", false);
				if (player.gender === 1 || player.gender === 3) {
					MainView.outputText("stallion's.", false);
				} else {
					MainView.outputText("mare's.", false);
				}
			} else { //NOT MAXXED
				EngineCore.dynStats("tou", 1.25);
				MainView.outputText("\n\nYour body suddenly feels tougher and more resilient.", false);
				changes++;
			}
		}
		//INTELLECT
		if ( Utils.rand(3) === 0) {
			if (player.inte <= 5) {
				MainView.outputText("\n\nYou let out a throaty \"Neiiiigh\" as your animalistic instincts take over.", false);
			}else if (player.inte < 10) {
				EngineCore.dynStats("int", -1);
				MainView.outputText("\n\nYou smile vacantly as you drink the potion, knowing you're just a big dumb animal who loves to fuck.", false);
				changes++;
			}else if (player.inte <= 20) {
				EngineCore.dynStats("int", -2);
				MainView.outputText("\n\nYou find yourself looking down at the empty bottle in your hand and realize you haven't thought ANYTHING since your first sip.", false);
				changes++;
			}else if (player.inte <= 30) {
				EngineCore.dynStats("int", -3);
				MainView.outputText("\n\nYou smile broadly as your cares seem to melt away.  A small part of you worries that you're getting dumber.", false);
				changes++;
			}else if (player.inte <= 50) {
				EngineCore.dynStats("int", -4);
				MainView.outputText("\n\nIt becomes harder to keep your mind focused as your intellect diminishes.", false);
				changes++;
			} else {
				EngineCore.dynStats("int", -5);
				MainView.outputText("\n\nYour usually intelligent mind feels much more sluggish.", false);
				changes++;
			}
		}
		//-Remove feather-arms (copy this for goblin ale, mino blood, equinum, canine pepps, demon items)
		if (changes < changeLimit && player.armType === AppearanceDefs.ARM_TYPE_HARPY && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYou scratch at your biceps absentmindedly, but no matter how much you scratch, it isn't getting rid of the itch.  Glancing down in irritation, you discover that your feathery arms are shedding their feathery coating.  The wing-like shape your arms once had is gone in a matter of moments, leaving " + player.skinDesc + " behind.", false);
			player.armType = AppearanceDefs.ARM_TYPE_HUMAN;
			changes++;
		}
		//-Remove chitin-arms (copy this for goblin ale, mino blood, equinum, canine pepps, demon items)
		if (changes < changeLimit && player.armType === AppearanceDefs.ARM_TYPE_SPIDER && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYou scratch at your biceps absentmindedly, but no matter how much you scratch, it isn't getting rid of the itch.  Glancing down in irritation, you discover that your arms' chitinous covering is flaking away.  The glossy black coating is soon gone, leaving " + player.skinDesc + " behind.", false);
			player.armType = AppearanceDefs.ARM_TYPE_HUMAN;
			changes++;
		}
		//-Remove feathery hair (copy for equinum, canine peppers, Labova)
		if (changes < changeLimit && player.hairType === 1 && Utils.rand(4) === 0) {
			//(long):
			if (player.hairLength >= 6) {
				MainView.outputText("\n\nA lock of your downy-soft feather-hair droops over your eye.  Before you can blow the offending down away, you realize the feather is collapsing in on itself.  It continues to curl inward until all that remains is a normal strand of hair.  <b>Your hair is no longer feathery!</b>", false);
			} else { //(short)
				MainView.outputText("\n\nYou run your fingers through your downy-soft feather-hair while you await the effects of the item you just ingested.  While your hand is up there, it detects a change in the texture of your feathers.  They're completely disappearing, merging down into strands of regular hair.  <b>Your hair is no longer feathery!</b>", false);
			}
			changes++;
			player.hairType = 0;
		}
		//
		//SEXUAL CHARACTERISTICS
		//
		//MALENESS.
		if ((player.gender === 1 || player.gender === 3) && Utils.rand(1.5) === 0 && changes < changeLimit) {
			
			//If cocks that aren't horsified!
			if ((player.horseCocks() + player.demonCocks()) < player.cocks.length) {
				//Transform a cock and store it's index value to talk about it.
				var cockIndex = 0;
				//Single cock
				if (player.cocks.length === 1) {
					var hasChange = false;
					if (player.cocks[0].cockType === CockTypesEnum.HUMAN) {
						MainView.outputText("\n\nYour " + Descriptors.cockDescript(0) + " begins to feel strange... you pull down your pants to take a look and see it darkening as you feel a tightness near the base where your skin seems to be bunching up.  A sheath begins forming around your cock's base, tightening and pulling your cock inside its depths.  A hot feeling envelops your member as it suddenly grows into a horse penis, dwarfing its old size.  The skin is mottled brown and black and feels more sensitive than normal.  Your hands are irresistibly drawn to it, and you jerk yourself off, splattering cum with intense force.", false);
						cockIndex = player.addHorseCock();
						player.increaseCock(cockIndex, Utils.rand(4) + 4);
						hasChange = true;
						EngineCore.dynStats("lib", 5, "sen", 4, "lus", 35);
					} else if (player.cocks[0].cockType === CockTypesEnum.DOG) {
						cockIndex = player.addHorseCock();
						MainView.outputText("\n\nYour " + Appearance.cockNoun(CockTypesEnum.DOG) + " begins to feel odd... you pull down your clothes to take a look and see it darkening.  You feel a growing tightness in the tip of your " + Appearance.cockNoun(CockTypesEnum.DOG) + " as it flattens, flaring outwards.  Your cock pushes out of your sheath, inch after inch of animal-flesh growing beyond it's traditional size.  You notice your knot vanishing, the extra flesh pushing more horsecock out from your sheath.  Your hands are drawn to the strange new " + Appearance.cockNoun(CockTypesEnum.HORSE) + ", and you jerk yourself off, splattering thick ropes of cum with intense force.", false);
						player.increaseCock(cockIndex, Utils.rand(4) + 4);
						hasChange = true;
						EngineCore.dynStats("lib", 5, "sen", 4, "lus", 35);
					} else if (player.cocks[0].cockType === CockTypesEnum.TENTACLE) {
						cockIndex = player.addHorseCock();
						MainView.outputText("\n\nYour " + Descriptors.cockDescript(0) + " begins to feel odd... you pull down your clothes to take a look and see it darkening.  You feel a growing tightness in the tip of your " + Descriptors.cockDescript(0) + " as it flattens, flaring outwards.  Your skin folds and bunches around the base, forming an animalistic sheath.  The slick inhuman texture you recently had fades, taking on a more leathery texture.  Your hands are drawn to the strange new " + Appearance.cockNoun(CockTypesEnum.HORSE) + ", and you jerk yourself off, splattering thick ropes of cum with intense force.", false);
						player.increaseCock(cockIndex, Utils.rand(4) + 4);
						hasChange = true;
						EngineCore.dynStats("lib", 5, "sen", 4, "lus", 35);
					} else if (player.cocks[0].cockType.Index > 4) {
						MainView.outputText("\n\nYour " + Descriptors.cockDescript(0) + " begins to feel odd... you pull down your clothes to take a look and see it darkening.  You feel a growing tightness in the tip of your " + Descriptors.cockDescript(0) + " as it flattens, flaring outwards.  Your skin folds and bunches around the base, forming an animalistic sheath.  The slick inhuman texture you recently had fades, taking on a more leathery texture.  Your hands are drawn to the strange new " + Appearance.cockNoun(CockTypesEnum.HORSE) + ", and you jerk yourself off, splattering thick ropes of cum with intense force.", false);
						cockIndex = player.addHorseCock();
						player.cocks[cockIndex]( Utils.rand(4) + 4);
						hasChange = true;
						EngineCore.dynStats("lib", 5, "sen", 4, "lus", 35);
					}
					if (hasChange) {
						MainView.outputText("  <b>Your penis has transformed into a horse's!</b>", false);
					}
				} else { //MULTICOCK
					EngineCore.dynStats("lib", 5, "sen", 4, "lus", 35);
					cockIndex = player.addHorseCock();
					MainView.outputText("\n\nOne of your penises begins to feel strange.  You pull down your clothes to take a look and see the skin of your " + Descriptors.cockDescript(cockIndex) + " darkening to a mottled brown and black pattern.", false);
					if (cockIndex === -1) {
						CoC_Settings.error("");
						MainView.outputText("FUKKKK ERROR NO COCK XFORMED", true);
					}
					//Already have a sheath
					if (player.horseCocks() > 1 || player.dogCocks() > 0) {
						MainView.outputText("  Your sheath tingles and begins growing larger as the cock's base shifts to lie inside it.", false);
					} else {
						MainView.outputText("  You feel a tightness near the base where your skin seems to be bunching up.  A sheath begins forming around your " + Descriptors.cockDescript(cockIndex) + "'s root, tightening and pulling your " + Descriptors.cockDescript(cockIndex) + " inside its depths.", false);
					}
					player.increaseCock(cockIndex, Utils.rand(4) + 4);
					MainView.outputText("  The shaft suddenly explodes with movement, growing longer and developing a thick flared head leaking steady stream of animal-cum.", false);
					MainView.outputText("  <b>You now have a horse-cock.</b>", false);
				}
				//Make cock thicker if not thick already!
				if (player.cocks[cockIndex].cockThickness <= 2) {
					player.cocks[cockIndex].thickenCock(1);
				}
				changes++;
			} else { //Players cocks are all horse-type - increase size!
				var cockModifications = 0;
				var cockModified = 0;
				//single cock
				if (player.cocks.length === 1) {
					cockModifications = player.increaseCock(0, Utils.rand(3) + 1);
					EngineCore.dynStats("sen", 1, "lus", 10);
				} else { //Multicock
					//Find smallest cock
					cockModified = player.shortestCockIndex();
					//Grow smallest cock!
					//cockModifications changes to growth amount
					cockModifications = player.increaseCock(cockModified, Utils.rand(4) + 1);
					EngineCore.dynStats("sen", 1, "lus", 10);
				}
				MainView.outputText("\n\n", false);
				if (cockModifications > 2) {
					MainView.outputText("Your " + Descriptors.cockDescript(cockModified) + " tightens painfully, inches of taut horse-flesh pouring out from your sheath as it grows longer.  Thick animal-pre forms at the flared tip, drawn out from the pleasure of the change.", false);
				} else if (cockModifications > 1) {
					MainView.outputText("Aching pressure builds within your sheath, suddenly releasing as an inch or more of extra dick flesh spills out.  A dollop of pre beads on the head of your enlarged " + Descriptors.cockDescript(cockModified) + " from the pleasure of the growth.", false);
				} else {
					MainView.outputText("A slight pressure builds and releases as your " + Descriptors.cockDescript(cockModified) + " pushes a bit further out of your sheath.", false);
				}
				changes++;
			}
			//Chance of thickness + daydream
			if (Utils.rand(2) === 0 && changes < changeLimit && player.horseCocks() > 0) {
				var lessThickCockIndex = player.cocks.length === 0?-1:_.indexOf(player.cocks, _.minBy(player.cocks, function(value) { return value.cockThickness; }));
				player.cocks[lessThickCockIndex].thickenCock( 0.5 );
				MainView.outputText("\n\nYour " + Appearance.cockNoun(CockTypesEnum.HORSE) + " thickens inside its sheath, growing larger and fatter as your veins thicken, becoming more noticeable.  It feels right", false);
				if (player.cor + player.lib < 50) {
					MainView.outputText(" to have such a splendid tool.  You idly daydream about cunts and pussies, your " + Appearance.cockNoun(CockTypesEnum.HORSE) + " plowing them relentlessly, stuffing them pregnant with cum", false);
				} else if (player.cor + player.lib < 80) {
					MainView.outputText(" to be this way... You breath the powerful animalistic scent and fantasize about fucking centaurs night and day until their bellies slosh with your cum", false);
				} else if (player.cor + player.lib <= 125) {
					MainView.outputText(" to be a rutting stud.  You ache to find a mare or centaur to breed with.  Longing to spend your evenings plunging a " + Appearance.cockNoun(CockTypesEnum.HORSE) + " deep into their musky passages, dumping load after load of your thick animal-cum into them.  You'd be happy just fucking horsecunts morning, noon, and night.  Maybe somewhere there is a farm needing a breeder..", false);
				} else {
					MainView.outputText(" to whinny loudly like a rutting stallion.  Your " + Appearance.cockNoun(CockTypesEnum.HORSE) + " is perfect for fucking centaurs and mares.  You imagine the feel of plowing an equine pussy deeply, bottoming out and unloading sticky jets of horse-jizz into its fertile womb.  Your hand strokes your horsecock of its own accord, musky pre dripping from the flared tip with each stroke.  Your mind wanders to the thought of you with a harem of pregnant centaurs.", false);
				}
				MainView.outputText(".", false);
				if (player.cor < 30) {
					MainView.outputText("  You shudder in revulsion at the strange thoughts and vow to control yourself better.", false);
				} else if (player.cor < 60) {
					MainView.outputText("  You wonder why you thought such odd things, but they have a certain appeal.", false);
				} else if (player.cor < 90) {
					MainView.outputText("  You relish your twisted fantasies, hoping to dream of them again.", false);
				} else {
					MainView.outputText("  You flush hotly and give a twisted smile, resolving to find a fitting subject to rape and relive your fantasies.", false);
				}
				EngineCore.dynStats("lib", 0.5, "lus", 10);
			}
			//Chance of ball growth if not 3" yet
			if ( Utils.rand(2) === 0 && changes < changeLimit && player.ballSize <= 3 && player.horseCocks() > 0) {
				if (player.balls === 0) {
					player.balls = 2;
					player.ballSize = 1;
					MainView.outputText("\n\nA nauseating pressure forms just under the base of your maleness.  With agonizing pain the flesh bulges and distends, pushing out a rounded lump of flesh that you recognize as a testicle!  A moment later relief overwhelms you as the second drops into your newly formed sack.", false);
					EngineCore.dynStats("lib", 2, "lus", 5);
				} else {
					player.ballSize++;
					if (player.ballSize <= 2) {
						MainView.outputText("\n\nA flash of warmth passes through you and a sudden weight develops in your groin.  You pause to examine the changes and your roving fingers discover your " + Descriptors.simpleBallsDescript() + " have grown larger than a human's.", false);
					} else {
						MainView.outputText("\n\nA sudden onset of heat envelops your groin, focusing on your " + Descriptors.sackDescript() + ".  Walking becomes difficult as you discover your " + Descriptors.simpleBallsDescript() + " have enlarged again.", false);
					}
					EngineCore.dynStats("lib", 1, "lus", 3);
				}
				changes++;
			}
		}
		//FEMALE
		if (player.gender === 2 || player.gender === 3) {
			//Single vag
			if (player.vaginas.length === 1) {
				if (player.vaginas[0].vaginalLooseness <= AppearanceDefs.VAGINA_LOOSENESS_GAPING && changes < changeLimit && Utils.rand(2) === 0) {
					MainView.outputText("\n\nYou grip your gut in pain as you feel your organs shift slightly.  When the pressure passes, you realize your " + Descriptors.vaginaDescript(0) + " has grown larger, in depth AND size.", false);
					player.vaginas[0].vaginalLooseness++;
					changes++;
				}
				if (player.vaginas[0].vaginalWetness <= AppearanceDefs.VAGINA_WETNESS_NORMAL && changes < changeLimit && Utils.rand(2) === 0) {
					MainView.outputText("\n\nYour " + Descriptors.vaginaDescript(0) + " moistens perceptably, giving off an animalistic scent.", false);
					player.vaginas[0].vaginalWetness++;
					changes++;
				}
			} else { //Multicooch
				//determine least wet
				var leastWetVaginaIndex = player.vaginas.length === 0?-1:_.indexOf(player.vaginas, _.minBy(player.vaginas, function(value) { return value.vaginalWetness; }));
				if (player.vaginas[leastWetVaginaIndex].vaginalWetness <= AppearanceDefs.VAGINA_WETNESS_NORMAL && changes < changeLimit && Utils.rand(2) === 0) {
					MainView.outputText("\n\nOne of your " + Descriptors.vaginaDescript(leastWetVaginaIndex) + " moistens perceptably, giving off an animalistic scent.", false);
					player.vaginas[leastWetVaginaIndex].vaginalWetness++;
					changes++;
				}
				//determine smallest
				var smallestVaginaIndex = player.vaginas.length === 0?-1:_.indexOf(player.vaginas, _.minBy(player.vaginas, function(value) { return value.vaginalLooseness; }));
				if (player.vaginas[0].vaginalLooseness <= AppearanceDefs.VAGINA_LOOSENESS_GAPING && changes < changeLimit && Utils.rand(2) === 0) {
					MainView.outputText("\n\nYou grip your gut in pain as you feel your organs shift slightly.  When the pressure passes, you realize one of your " + Descriptors.vaginaDescript(smallestVaginaIndex) + " has grown larger, in depth AND size.", false);
					player.vaginas[smallestVaginaIndex].vaginalLooseness++;
					changes++;
				}
			}
			if (player.statusAffectv2(StatusAffects.Heat) < 30 && Utils.rand(2) === 0 && changes < changeLimit && player.goIntoHeat(true)) {
				changes++;
			}
			if (!CoC.flags[kFLAGS.HYPER_HAPPY]) {
				if ( Utils.rand(2) === 0 && changes < changeLimit) {
					//Shrink B's!
					//Single row
					if (player.breastRows.length === 1) {
						//Shrink if bigger than B cups
						if (player.breastRows[0].breastRating > 3) {
							player.breastRows[0].breastRating--;
							//Shrink again if huuuuge
							if (player.breastRows[0].breastRating > 8) {
								player.breastRows[0].breastRating--;
								MainView.outputText("\n\nYou feel significantly lighter.  Looking down, you realize your breasts are MUCH smaller, down to " + player.breastCup(0) + "s.", false);
							} else {
								MainView.outputText("\n\nYou feel a weight lifted from you, and realize your " + Descriptors.breastDescript(0) + " have shrunk to a " + player.breastCup(0) + ".", false);
							}
							changes++;
						}
					} else { //multiple
						if (player.biggestTitSize() > 3) {
							MainView.outputText("\n", false);
						}
						var breastRowChanged = 0;
						_.forEach(player.breastRows, function(breastRow, index) {
							if (breastRow.breastRating > 3) {
								breastRow.breastRating--;
								MainView.outputText("\n", false);
								if (breastRowChanged > 0) {
									MainView.outputText("...and y", false);
								} else {
									MainView.outputText("Y", false);
								}
								MainView.outputText("our " + Descriptors.breastDescript(index) + " shrink, dropping to " + player.breastCup(index) + "s.", false);
								breastRowChanged++;
							}
						});
						if (breastRowChanged === 2) {
							MainView.outputText("\nYou feel so much lighter after the change.", false);
						} else if (breastRowChanged === 3) {
							MainView.outputText("\nWithout the extra weight you feel particularly limber.", false);
						} else if (breastRowChanged >= 4) {
							MainView.outputText("\nIt feels as if the weight of the world has been lifted from your shoulders, or in this case, your chest.", false);
						}
						if (breastRowChanged > 0) {
							changes++;
						}
					}
				}
			}
		}
		//NON - GENDER SPECIFIC CHANGES
		//Tail -> Ears -> Fur -> Face
		//Centaur if hooved
		if (changes < changeLimit && Utils.rand(6) === 0 && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HOOFED) {
			changes++;
			MainView.outputText("\n\nImmense pain overtakes you as you feel your backbone snap.  The agony doesn't stop, blacking you out as your spine lengthens, growing with new flesh from your backside as the bones of your legs flex and twist.  Muscle groups shift and rearrange themselves as the change completes, the pain dying away as your consciousness returns.  <b>You now have the lower body of a centaur</b>.", false);
			if (player.gender > 0) {
				MainView.outputText("  After taking a moment to get used to your new body, you notice that your genitals now reside between the back legs on your centaur body.", false);
			}
			EngineCore.dynStats("spe", 3);
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_CENTAUR;
		}
		//Remove odd eyes
		if (changes < changeLimit && Utils.rand(5) === 0 && player.eyeType > AppearanceDefs.EYES_HUMAN) {
			if (player.eyeType === AppearanceDefs.EYES_BLACK_EYES_SAND_TRAP) {
				MainView.outputText("\n\nYou feel a twinge in your eyes and you blink.  It feels like black cataracts have just fallen away from you, and you know without needing to see your reflection that your eyes have gone back to looking human.");
			} else {
				MainView.outputText("\n\nYou blink and stumble, a wave of vertigo threatening to pull your " + player.feet() + " from under you.  As you steady and open your eyes, you realize something seems different.  Your vision is changed somehow.", false);
				if (player.eyeType === AppearanceDefs.EYES_FOUR_SPIDER_EYES) {
					MainView.outputText("  Your multiple, arachnid eyes are gone!</b>", false);
				}
				MainView.outputText("  <b>You have normal, humanoid eyes again.</b>", false);
			}
			player.eyeType = AppearanceDefs.EYES_HUMAN;
			changes++;
		}
		//HorseFace - Req's Fur && Ears
		if (player.faceType !== AppearanceDefs.FACE_HORSE && player.skinType === AppearanceDefs.SKIN_TYPE_FUR && changes < changeLimit && Utils.rand(5) === 0 && player.earType === AppearanceDefs.EARS_HORSE) {
			if (player.faceType === AppearanceDefs.FACE_DOG) {
				MainView.outputText("\n\nMind-numbing pain shatters through you as you feel your facial bones rearranging.  You clutch at your face in agony as your skin crawls and shifts, your visage reshaping to replace your dog-like characteristics with those of a horse.  <b>You now have a horse's face.</b>", false);
			} else {
				MainView.outputText("\n\nMind-numbing pain shatters through you as you feel your facial bones breaking and shifting.  You clutch at yourself in agony as you feel your skin crawl and elongate under your fingers.  Eventually the pain subsides, leaving you with a face that seamlessly blends human and equine features.  <b>You have a very equine-looking face.</b>", false);
			}
			changes++;
			player.faceType = AppearanceDefs.FACE_HORSE;
		}
		//Fur - if has horsetail && ears and not at changelimit
		if (player.skinType !== AppearanceDefs.SKIN_TYPE_FUR && changes < changeLimit && Utils.rand(4) === 0 && player.tailType === AppearanceDefs.TAIL_TYPE_HORSE) {
			if (player.skinType === AppearanceDefs.SKIN_TYPE_PLAIN) {
				MainView.outputText("\n\nAn itchy feeling springs up over every inch of your skin.  As you scratch yourself madly, you feel fur grow out of your skin until <b>you have a fine coat of " + player.hairColor + "-colored fur.</b>", false);
			}else if (player.skinType === AppearanceDefs.SKIN_TYPE_SCALES) {
				player.skinDesc = "fur";
				MainView.outputText("\n\nYour " + player.skinTone + " scales begin to itch insufferably.  You reflexively scratch yourself, setting off an avalanche of discarded scales.  The itching intensifies as you madly scratch and tear at yourself, revealing a coat of " + player.hairColor + " " + player.skinDesc + ".  At last the itching stops as <b>you brush a few more loose scales from your new coat of fur.</b>", false);
			}
			changes++;
			player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
			player.skinDesc = "fur";
		}
		//Ears - requires tail
		if (player.earType !== AppearanceDefs.EARS_HORSE && player.tailType === AppearanceDefs.TAIL_TYPE_HORSE && changes < changeLimit && Utils.rand(3) === 0) {
			if (player.earType === -1) {
				MainView.outputText("\n\nTwo painful lumps sprout on the top of your head, forming into tear-drop shaped ears, covered with short fur.  ", false);
			}
			if (player.earType === AppearanceDefs.EARS_HUMAN) {
				MainView.outputText("\n\nYour ears tug painfully on your face as they begin shifting, moving upwards to the top of your head and transforming into a upright animalistic ears.  ", false);
			}else if (player.earType === AppearanceDefs.EARS_DOG) {
				MainView.outputText("\n\nYour ears change shape, morphing into from their doglike shape into equine-like ears!  ", false);
			}else if (player.earType > AppearanceDefs.EARS_DOG) {
				MainView.outputText("\n\nYour ears change shape, morphing into teardrop-shaped horse ears!  ", false);
			}
			player.earType = AppearanceDefs.EARS_HORSE;
			player.earValue = 0;
			MainView.outputText("<b>You now have horse ears.</b>", false);
			changes++;
		}
		//Tail - no-prereq
		if (player.tailType !== AppearanceDefs.TAIL_TYPE_HORSE && Utils.rand(2) === 0 && changes < changeLimit) {
			//no tail
			if (player.tailType === 0) {
				MainView.outputText("\n\nThere is a sudden tickling on your ass, and you notice you have sprouted a long shiny horsetail of the same " + player.hairColor + " color as your hair.", false);
			}else if (player.tailType > AppearanceDefs.TAIL_TYPE_HORSE && player.tailType <= AppearanceDefs.TAIL_TYPE_COW) { //if other animal tail
				MainView.outputText("\n\nPain lances up your " + Descriptors.assholeDescript() + " as your tail shifts and morphs disgustingly.  With one last wave of pain, it splits into hundreds of tiny filaments, transforming into a horsetail.", false);
			}else if (player.tailType < AppearanceDefs.TAIL_TYPE_SHARK) { //if bee/spider-butt.
				MainView.outputText("\n\nYour insect-like abdomen bunches up as it begins shrinking, exoskeleton flaking off like a snake sheds its skin.  It bunches up until it is as small as a tennis ball, then explodes outwards, growing into an animalistic tail shape.  Moments later, it explodes into filaments of pain, dividing into hundreds of strands and turning into a shiny horsetail.", false);
			} else {
				MainView.outputText("\n\nPain lances up your " + Descriptors.assholeDescript() + " as your tail shifts and morphs disgustingly.  With one last wave of pain, it splits into hundreds of tiny filaments, transforming into a horsetail.", false);
			}
			MainView.outputText("  <b>You now have a horse-tail.</b>", false);
			player.tailType = AppearanceDefs.TAIL_TYPE_HORSE;
			player.tailVenom = 0;
			player.tailRecharge = 0;
			changes++;
		}
		if ( Utils.rand(4) === 0 && player.gills && changes < changeLimit) {
			MainView.outputText("\n\nYour chest itches, and as you reach up to scratch it, you realize your gills have withdrawn into your skin.", false);
			player.gills = false;
			changes++;
		}
		if ( Utils.rand(3) === 0) {
			MainView.outputText(player.modTone(60, 1), false);
		}
		//FAILSAFE CHANGE
		if (changes === 0) {
			MainView.outputText("\n\nInhuman vitality spreads through your body, invigorating you!\n", false);
			EngineCore.HPChange(20, true);
			EngineCore.dynStats("lus", 3);
		}
	};
	Mutations.succubiMilk = function(tainted, player) {
		player.slimeFeed();
		var changesLevel = Math.random() * 100;
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changesLevel += 10;
		}
		if (changesLevel >= 90 && !tainted) {
			changesLevel -= 10;
		}
		if (player.cor < 35) {
			MainView.outputText("You wonder why in the gods' names you would drink such a thing, but you have to admit, it is the best thing you have ever tasted.", true);
		} else if (player.cor < 70) {
			MainView.outputText("You savor the incredible flavor as you greedily gulp it down.", true);
			if (player.gender === 2 || player.gender === 3) {
				MainView.outputText("  The taste alone makes your " + Descriptors.vaginaDescript(0) + " feel ", false);
				if (player.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_DRY) {
					MainView.outputText("tingly.", false);
				} else if (player.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_NORMAL) {
					MainView.outputText("wet.", false);
				} else if (player.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_WET) {
					MainView.outputText("sloppy and wet.", false);
				} else if (player.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_SLICK) {
					MainView.outputText("sopping and juicy.", false);
				} else if (player.vaginas[0].vaginalWetness >= AppearanceDefs.VAGINA_WETNESS_DROOLING) {
					MainView.outputText("dripping wet.", false);
				}
			} else if (player.hasCock()) {
				MainView.outputText("  You feel a building arousal, but it doesn't affect your cock.", false);
			}
		} else {
			MainView.outputText("You pour the milk down your throat, chugging the stuff as fast as you can.  You want more.", true);
			if (player.gender === 2 || player.gender === 3) {
				MainView.outputText("  Your " + Descriptors.vaginaDescript(0), false);
				if (player.vaginas.length > 1) {
					MainView.outputText(" quiver in orgasm, ", false);
				} else if (player.vaginas.length === 1) {
					MainView.outputText(" quivers in orgasm, ", false);
				}
				if (player.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_DRY) {
					MainView.outputText("becoming slightly sticky.", false);
				} else if (player.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_NORMAL) {
					MainView.outputText("leaving your undergarments sticky.", false);
				} else if (player.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_WET) {
					MainView.outputText("wet with girlcum.", false);
				} else if (player.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_SLICK) {
					MainView.outputText("staining your undergarments with cum.", false);
				} else if (player.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_DROOLING) {
					MainView.outputText("leaving cunt-juice trickling down your leg.", false);
				} else if (player.vaginas[0].vaginalWetness >= AppearanceDefs.VAGINA_WETNESS_SLAVERING) {
					MainView.outputText("spraying your undergarments liberally with slick girl-cum.", false);
				}
				player.orgasm();
			} else if (player.gender !== 0) {
				if (player.cocks.length === 1) {
					MainView.outputText("  You feel a strange sexual pleasure, but your " + Descriptors.multiCockDescript() + " remains unaffected.", false);
				} else {
					MainView.outputText("  You feel a strange sexual pleasure, but your " + Descriptors.multiCockDescript() + " remain unaffected.", false);
				}
			}
		}
		if (tainted) {
			EngineCore.dynStats("spe", 1, "lus", 3, "cor", 1);
		} else {
			EngineCore.dynStats("spe", 1, "lus", 3);
		}
		var longestCockIndex = 0;
		//Breast growth (maybe cock reduction!)
		if (changesLevel <= 75) {
			//Temp stores the level of growth...
			var breastChanges = 1 + Utils.rand(3);
			if (player.breastRows.length > 0) {
				if (player.breastRows[0].breastRating < 2 && Utils.rand(3) === 0) {
					breastChanges++;
				}
				if (player.breastRows[0].breastRating < 5 && Utils.rand(4) === 0) {
					breastChanges++;
				}
				if (player.breastRows[0].breastRating < 6 && Utils.rand(5) === 0) {
					breastChanges++;
				}
			}
			MainView.outputText("\n\n", false);
			player.growTits(breastChanges, player.breastRows.length, true, 3);
			if (player.breastRows.length === 0) {
				MainView.outputText("A perfect pair of B cup breasts, complete with tiny nipples, form on your chest.", false);
				player.createBreastRow();
				player.breastRows[0].breasts = 2;
				player.breastRows[0].breastsPerRow = 2;
				player.breastRows[0].nipplesPerBreast = 1;
				player.breastRows[0].breastRating = 2;
				MainView.outputText("\n", false);
			}
			if (!CoC.flags[kFLAGS.HYPER_HAPPY]) {
				// Shrink cocks if you have them.
				if (player.cocks.length > 0) {
					longestCockIndex = player.longestCock();
					//Shrink said cock
					var cockLengthChange = 0;
					if (player.cocks[longestCockIndex].cockLength < 6 && player.cocks[longestCockIndex].cockLength >= 2.9) {
						player.cocks[longestCockIndex].cockLength -= 0.5;
						cockLengthChange -= 0.5;
						if (player.cocks[longestCockIndex].cockThickness * 6 > player.cocks[longestCockIndex].cockLength) {
							player.cocks[longestCockIndex].cockThickness -= 0.2;
						}
						if (player.cocks[longestCockIndex].cockThickness * 8 > player.cocks[longestCockIndex].cockLength) {
							player.cocks[longestCockIndex].cockThickness -= 0.2;
						}
						if (player.cocks[longestCockIndex].cockThickness < 0.5) {
							player.cocks[longestCockIndex].cockThickness = 0.5;
						}
					}
					cockLengthChange += player.increaseCock(longestCockIndex, ( Utils.rand(3) + 1) * -1);
					MainView.outputText("\n\n", false);
					player.lengthChange(cockLengthChange, 1);
					if (player.cocks[longestCockIndex].cockLength < 2) {
						MainView.outputText("  ", false);
						player.killCocks(1);
					}
				}
			}
		} else if (player.vaginas.length === 0 && ( Utils.rand(3) === 0 || (changesLevel > 75 && changesLevel < 90))) {
			player.createVagina();
			player.vaginas[0].vaginalLooseness = AppearanceDefs.VAGINA_LOOSENESS_TIGHT;
			player.vaginas[0].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_NORMAL;
			player.vaginas[0].virgin = true;
			player.clitLength = 0.25;
			if (player.fertility <= 5) {
				player.fertility = 6;
			}
			MainView.outputText("\n\nAn itching starts in your crotch and spreads vertically.  You reach down and discover an opening.  You have grown a <b>new " + Descriptors.vaginaDescript(0) + "</b>!", false);
		} else if (changesLevel < 90) { //Increase pussy wetness or grow one!!
			//Shrink cawk
			if (player.cocks.length > 0 && !CoC.flags[kFLAGS.HYPER_HAPPY]) {
				MainView.outputText("\n\n", false);
				longestCockIndex = player.longestCock();
				//Shrink said cock
				if (player.cocks[longestCockIndex].cockLength < 6 && player.cocks[longestCockIndex].cockLength >= 2.9) {
					player.cocks[longestCockIndex].cockLength -= 0.5;
				}
				player.lengthChange(player.increaseCock(longestCockIndex, -1 * ( Utils.rand(3) + 1)), 1);
				if (player.cocks[longestCockIndex].cockLength < 3) {
					MainView.outputText("  ", false);
					player.killCocks(1);
				}
			}
			if (player.vaginas.length > 0) {
				MainView.outputText("\n\n", false);
				//0 = dry, 1 = wet, 2 = extra wet, 3 = always slick, 4 = drools constantly, 5 = female ejaculator
				if (player.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_SLAVERING) {
					if (player.vaginas.length === 1) {
						MainView.outputText("Your " + Descriptors.vaginaDescript(0) + " gushes fluids down your leg as you spontaneously orgasm.", false);
					} else {
						MainView.outputText("Your " + Descriptors.vaginaDescript(0) + "s gush fluids down your legs as you spontaneously orgasm, leaving a thick puddle of pussy-juice on the ground.  It is rapidly absorbed by the earth.", false);
					}
					player.orgasm();
					if (tainted) {
						EngineCore.dynStats("cor", 1);
					}
				} else if (player.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_DROOLING) {
					if (player.vaginas.length === 1) {
						MainView.outputText("Your pussy feels hot and juicy, aroused and tender.  You cannot resist as your hands dive into your " + Descriptors.vaginaDescript(0) + ".  You quickly orgasm, squirting fluids everywhere.  <b>You are now a squirter</b>.", false);
					}
					if (player.vaginas.length > 1) {
						MainView.outputText("Your pussies feel hot and juicy, aroused and tender.  You cannot resist plunging your hands inside your " + Descriptors.vaginaDescript(0) + "s.  You quiver around your fingers, squirting copious fluids over yourself and the ground.  The fluids quickly disappear into the dirt.", false);
					}
					player.orgasm();
					if (tainted) {
						EngineCore.dynStats("cor", 1);
					}
				} else if (player.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_SLICK) {
					if (player.vaginas.length === 1) {
						MainView.outputText("You feel a sudden trickle of fluid down your leg.  You smell it and realize it's your pussy-juice.  Your " + Descriptors.vaginaDescript(0) + " now drools lubricant constantly down your leg.", false);
					}
					if (player.vaginas.length > 1) {
						MainView.outputText("You feel sudden trickles of fluids down your leg.  You smell the stuff and realize it's your pussies-juices.  They seem to drool lubricant constantly down your legs.", false);
					}
				} else if (player.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_WET) {
					MainView.outputText("You flush in sexual arousal as you realize how moist your cunt-lips have become.  Once you've calmed down a bit you realize they're still slick and ready to fuck, and always will be.", false);
				} else if (player.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_NORMAL) {
					if (player.vaginas.length === 1) {
						MainView.outputText("A feeling of intense arousal passes through you, causing you to masturbate furiously.  You realize afterwards that your " + Descriptors.vaginaDescript(0) + " felt much wetter than normal.", false);
					} else {
						MainView.outputText("A feeling of intense arousal passes through you, causing you to masturbate furiously.  You realize afterwards that your " + Descriptors.vaginaDescript(0) + " were much wetter than normal.", false);
					}
				} else if (player.vaginas[0].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_DRY) {
					MainView.outputText("You feel a tingling in your crotch, but cannot identify it.", false);
				}
				_.forEach(player.vaginas, function(vagina) {
					if (vagina.vaginalWetness < AppearanceDefs.VAGINA_WETNESS_SLAVERING) {
						vagina.vaginalWetness++;
					}
				});
			}
		} else {
			if (player.skinTone === "blue" || player.skinTone === "purple" || player.skinTone === "indigo" || player.skinTone === "shiny black") {
				if (player.vaginas.length > 0) {
					MainView.outputText("\n\nYour heart begins beating harder and harder as heat floods to your groin.  You feel your clit peeking out from under its hood, growing larger and longer as it takes in more and more blood.", false);
					if (player.clitLength > 3 && player.findPerk(PerkLib.BigClit) < 0) {
						MainView.outputText("  After some time it shrinks, returning to its normal aroused size.  You guess it can't get any bigger.", false);
					}
					if (player.clitLength > 5 && player.findPerk(PerkLib.BigClit) >= 0) {
						MainView.outputText("  Eventually it shrinks back down to its normal (but still HUGE) size.  You guess it can't get any bigger.", false);
					}
					if (((player.findPerk(PerkLib.BigClit) >= 0) && player.clitLength < 6) || player.clitLength < 3) {
						player.clitLength += ( Utils.rand(4) + 2) / 10;
					}
					EngineCore.dynStats("sen", 3, "lus", 8);
				} else {
					player.createVagina();
					player.vaginas[0].vaginalLooseness = AppearanceDefs.VAGINA_LOOSENESS_TIGHT;
					player.vaginas[0].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_NORMAL;
					player.vaginas[0].virgin = true;
					player.clitLength = 0.25;
					MainView.outputText("\n\nAn itching starts in your crotch and spreads vertically.  You reach down and discover an opening.  You have grown a <b>new " + Descriptors.vaginaDescript(0) + "</b>!", false);
				}
			} else {
				var skinToneChange = Utils.rand(10);
				if (skinToneChange === 0) {
					player.skinTone = "shiny black";
				} else if (skinToneChange === 1 || skinToneChange === 2) {
					player.skinTone = "indigo";
				} else if (skinToneChange === 3 || skinToneChange === 4 || skinToneChange === 5) {
					player.skinTone = "purple";
				} else if (skinToneChange > 5) {
					player.skinTone = "blue";
				}
				MainView.outputText("\n\nA tingling sensation runs across your skin in waves, growing stronger as <b>your skin's tone slowly shifts, darkening to become " + player.skinTone + " in color.</b>", false);
				if (tainted) {
					EngineCore.dynStats("cor", 1);
				} else {
					EngineCore.dynStats("cor", 0);
				}
			}
		}
		//Demonic changes - higher chance with higher corruption.
		if ( Utils.rand(40) + player.cor / 3 > 35 && tainted) {
			Mutations.demonChanges(player);
		}
		if (tainted) {
			MainView.outputText(player.modFem(100, 2), false);
			if ( Utils.rand(3) === 0) {
				MainView.outputText(player.modTone(15, 2), false);
			}
		} else {
			MainView.outputText(player.modFem(90, 1), false);
			if ( Utils.rand(3) === 0) {
				MainView.outputText(player.modTone(20, 2), false);
			}
		}
		player.genderCheck();
	};
//1-Oversized Pepper (+size, thickness)
//2-Double Pepper (+grows second cock or changes two cocks to dogcocks)
//3-Black Pepper (Dark Fur, +corruption/libido)
//4-Knotty Pepper (+Knot + Cum Multiplier)
//5-Bulbous Pepper (+ball size or fresh balls)
	Mutations.caninePepper = function(type, player) {
		var crit = 1;
		//Set up changes and changeLimit
		var changes = 0;
		var changeLimit = 1;
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		//Initial outputs & crit level
		MainView.outputText("", true);
		if (type === 0) {
			if ( Utils.rand(100) < 15) {
				crit = Utils.rand(20) / 10 + 2;
				MainView.outputText("The pepper tastes particularly potent, searingly hot and spicy.", false);
			} else {
				MainView.outputText("The pepper is strangely spicy but very tasty.", false);
			}
		} else if (type === 1) { //Oversized pepper
			crit = Utils.rand(20) / 10 + 2;
			MainView.outputText("The pepper is so large and thick that you have to eat it in several large bites.  It is not as spicy as the normal ones, but is delicious and flavorful.", false);
		}else if (type === 2) { //Double Pepper
			crit = Utils.rand(20) / 10 + 2;
			MainView.outputText("The double-pepper is strange, looking like it was formed when two peppers grew together near their bases.", false);
		} else if (type === 3) { //Black Pepper
			crit = Utils.rand(20) / 10 + 2;
			MainView.outputText("This black pepper tastes sweet, but has a bit of a tangy aftertaste.", false);
		} else if (type === 4) { //Knotty Pepper
			crit = Utils.rand(20) / 10 + 2;
			MainView.outputText("The pepper is a bit tough to eat due to the swollen bulge near the base, but you manage to cram it down and munch on it.  It's extra spicy!", false);
		} else if (type === 5) { //Bulbous Pepper
			crit = Utils.rand(20) / 10 + 2;
			MainView.outputText("You eat the pepper, even the two orb-like growths that have grown out from the base.  It's delicious!", false);
		}
		//OVERDOSE Bad End!
		if (type <= 0 && crit > 1 && player.skinType === AppearanceDefs.SKIN_TYPE_FUR && player.faceType === AppearanceDefs.FACE_DOG && player.earType === AppearanceDefs.EARS_DOG && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DOG && player.tailType === AppearanceDefs.TAIL_TYPE_DOG && Utils.rand(2) === 0 && player.findStatusAffect(StatusAffects.DogWarning) >= 0) {
			if (Utils.rand(2) === 0) {
				MainView.outputText("\n\nAs you swallow the pepper, you note that the spicy hotness on your tongue seems to be spreading. Your entire body seems to tingle and burn, making you feel far warmer than normal, feverish even. Unable to stand it any longer you tear away your clothes, hoping to cool down a little. Sadly, this does nothing to aid you with your problem. On the bright side, the sudden feeling of vertigo you've developed is more than enough to take your mind off your temperature issues. You fall forward onto your hands and knees, well not really hands and knees to be honest. More like paws and knees. That can't be good, you think for a moment, before the sensation of your bones shifting into a quadrupedal configuration robs you of your concentration. After that, it is only a short time before your form is remade completely into that of a large dog, or perhaps a wolf. The distinction would mean little to you now, even if you were capable of comprehending it. ", false);
				if (player.findPerk(PerkLib.MarblesMilk) >= 0) {
					MainView.outputText("All you know is that there is a scent on the wind, it is time to hunt, and at the end of the day you need to come home for your milk.", false);
				} else {
					MainView.outputText("All you know is that there is a scent on the wind, and it is time to hunt.", false);
				}
			} else {
				MainView.outputText("\n\nYou devour the sweet pepper, carefully licking your fingers for all the succulent juices of the fruit, and are about to go on your way when suddenly a tightness begins to build in your chest and stomach, horrid cramps working their way first through your chest, then slowly flowing out to your extremities, the feeling soon joined by horrible, blood-curdling cracks as your bones begin to reform, twisting and shifting, your mind exploding with pain. You fall to the ground, reaching one hand forward. No... A paw, you realize in horror, as you try to push yourself back up. You watch in horror, looking down your foreleg as thicker fur erupts from your skin, a " + player.hairColor + " coat slowly creeping from your bare flesh to cover your body. Suddenly, you feel yourself slipping away, as if into a dream, your mind warping and twisting, your body finally settling into its new form. With one last crack of bone you let out a yelp, kicking free of the cloth that binds you, wresting yourself from its grasp and fleeing into the now setting sun, eager to find prey to dine on tonight.", false);
			}
			EngineCore.gameOver();
			return;
		} else if (type <= 0 && player.skinType === AppearanceDefs.SKIN_TYPE_FUR && player.faceType === AppearanceDefs.FACE_DOG && player.tailType === AppearanceDefs.TAIL_TYPE_DOG && player.earType === AppearanceDefs.EARS_DOG && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DOG && player.findStatusAffect(StatusAffects.DogWarning) >= 0 && Utils.rand(3) === 0) { //WARNING, overdose VERY close!
			MainView.outputText("<b>\n\nEating the pepper, you realize how dog-like you've become, and you wonder what else the peppers could change...</b>", false);
		} else if (type <= 0 && player.skinType === AppearanceDefs.SKIN_TYPE_FUR && player.faceType === AppearanceDefs.FACE_DOG && player.tailType === AppearanceDefs.TAIL_TYPE_DOG && player.earType === AppearanceDefs.EARS_DOG && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DOG && player.findStatusAffect(StatusAffects.DogWarning) < 0) { //WARNING, overdose is close!
			player.createStatusAffect(StatusAffects.DogWarning, 0, 0, 0, 0);
			MainView.outputText("<b>\n\nEating the pepper, you realize how dog-like you've become, and you wonder what else the peppers could change...</b>", false);
		} else if (type === 3) {
			EngineCore.dynStats("lib", 2 + Utils.rand(4), "lus", 5 + Utils.rand(5), "cor", 2 + Utils.rand(4));
			MainView.outputText("\n\nYou feel yourself relaxing as gentle warmth spreads through your body.  Honestly you don't think you'd mind running into a demon or monster right now, they'd make for good entertainment.", false);
			if (player.cor < 50) {
				MainView.outputText("  You shake your head, blushing hotly.  Where did that thought come from?", false);
			}
		}
		if (player.str < 50 && Utils.rand(3) === 0) {
			EngineCore.dynStats("str", (crit));
			if (crit > 1) {
				MainView.outputText("\n\nYour muscles ripple and grow, bulging outwards.", false);
			} else {
				MainView.outputText("\n\nYour muscles feel more toned.", false);
			}
			changes++;
		}
		if (player.spe < 30 && Utils.rand(3) === 0 && changes < changeLimit) {
			EngineCore.dynStats("spe", (crit));
			if (crit > 1) {
				MainView.outputText("\n\nYou find your muscles responding quicker, faster, and you feel an odd desire to go for a walk.", false);
			} else {
				MainView.outputText("\n\nYou feel quicker.", false);
			}
			changes++;
		}
		if (player.inte > 30 && Utils.rand(3) === 0 && changes < changeLimit && type !== 3) {
			EngineCore.dynStats("int", (-1 * crit));
			MainView.outputText("\n\nYou feel ", false);
			if (crit > 1) {
				MainView.outputText("MUCH ", false);
			}
			MainView.outputText("dumber.", false);
			changes++;
		}
		//-Remove feather-arms (copy this for goblin ale, mino blood, equinum, canine pepps, demon items)
		if (changes < changeLimit && player.armType === AppearanceDefs.ARM_TYPE_HARPY && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYou scratch at your biceps absentmindedly, but no matter how much you scratch, it isn't getting rid of the itch.  Glancing down in irritation, you discover that your feathery arms are shedding their feathery coating.  The wing-like shape your arms once had is gone in a matter of moments, leaving " + player.skinDesc + " behind.", false);
			player.armType = AppearanceDefs.ARM_TYPE_HUMAN;
			changes++;
		}
		//-Remove chitin-arms (copy this for goblin ale, mino blood, equinum, canine pepps, demon items)
		if (changes < changeLimit && player.armType === AppearanceDefs.ARM_TYPE_SPIDER && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYou scratch at your biceps absentmindedly, but no matter how much you scratch, it isn't getting rid of the itch.  Glancing down in irritation, you discover that your arms' chitinous covering is flaking away.  The glossy black coating is soon gone, leaving " + player.skinDesc + " behind.", false);
			player.armType = AppearanceDefs.ARM_TYPE_HUMAN;
			changes++;
		}
		//-Remove feathery hair (copy for equinum, canine peppers, Labova)
		if (changes < changeLimit && player.hairType === 1 && Utils.rand(4) === 0) {
			//(long):
			if (player.hairLength >= 6) {
				MainView.outputText("\n\nA lock of your downy-soft feather-hair droops over your eye.  Before you can blow the offending down away, you realize the feather is collapsing in on itself.  It continues to curl inward until all that remains is a normal strand of hair.  <b>Your hair is no longer feathery!</b>", false);
			} else { //(short)
				MainView.outputText("\n\nYou run your fingers through your downy-soft feather-hair while you await the effects of the item you just ingested.  While your hand is up there, it detects a change in the texture of your feathers.  They're completely disappearing, merging down into strands of regular hair.  <b>Your hair is no longer feathery!</b>", false);
			}
			changes++;
			player.hairType = 0;
		}
		//Double Pepper!
		//Xforms/grows dicks to make you have two dogcocks
		var smallestDogCockIndex = -1;
		var knotChange = 0;
		if (type === 2) {
			//If already doubled up, GROWTH
			if (player.dogCocks() >= 2) {
				type = 1;
			} else { //If player doesnt have 2 dogdicks
				//If player has NO dogdicks
				if (player.dogCocks() === 0) {
					//Dickless - grow two dogpeckers
					if (player.cockTotal() === 0) {
						player.createCock(7 + Utils.rand(7), 1.5 + Utils.rand(10) / 10);
						player.createCock(7 + Utils.rand(7), 1.5 + Utils.rand(10) / 10);
						MainView.outputText("\n\nA painful lump forms on your groin, nearly doubling you over as it presses against your " + player.armorName + ".  You rip open your gear and watch, horrified as the discolored skin splits apart, revealing a pair of red-tipped points.  A feeling of relief, and surprising lust grows as they push forward, glistening red and thickening.  The skin bunches up into an animal-like sheath, while a pair of fat bulges pop free.  You now have two nice thick dog-cocks, with decent sized knots.  Both pulse and dribble animal-pre, arousing you in spite of your attempts at self-control.", false);
						player.cocks[0].knotMultiplier = 1.7;
						player.cocks[0].cockType = CockTypesEnum.DOG;
						player.cocks[1].knotMultiplier = 1.7;
						player.cocks[1].cockType = CockTypesEnum.DOG;
						EngineCore.dynStats("lus", 50);
					} else if (player.cockTotal() === 1) { //1 dick - grow 1 and convert 1
						MainView.outputText("\n\nYour " + Descriptors.cockDescript(0) + " vibrates, the veins clearly visible as it reddens and distorts.  The head narrows into a pointed tip while a gradually widening bulge forms around the base.  Where it meets your crotch, the skin bunches up around it, forming a canine-like sheath.  ", false);
						player.cocks[0].cockType = CockTypesEnum.DOG;
						player.cocks[0].knotMultiplier = 1.5;
						MainView.outputText("You feel something slippery wiggling inside the new sheath, and another red point peeks out.  In spite of yourself, you start getting turned on by the change, and the new dick slowly slides free, eventually stopping once the thick knot pops free.  The pair of dog-dicks hang there, leaking pre-cum and arousing you far beyond normal.", false);
						player.createCock(7 + Utils.rand(7), 1.5 + Utils.rand(10) / 10);
						player.cocks[1].knotMultiplier = 1.7;
						player.cocks[1].cockType = CockTypesEnum.DOG;
						EngineCore.dynStats("lib", 2, "lus", 50);
					} else { //2 dicks+ - convert first 2 to doggie-dom
						MainView.outputText("\n\nYour crotch twitches, and you pull open your " + player.armorName + " to get a better look.  You watch in horror and arousal as your " + Descriptors.cockDescript(0) + " and " + Descriptors.cockDescript(1) + " both warp and twist, becoming red and pointed, growing thick bulges near the base.  When it stops you have two dog-cocks and an animal-like sheath.  The whole episode turns you on far more than it should, leaving you dripping animal pre and ready to breed.", false);
						player.cocks[0].cockType = CockTypesEnum.DOG;
						player.cocks[1].cockType = CockTypesEnum.DOG;
						player.cocks[0].knotMultiplier = 1.4;
						player.cocks[0].knotMultiplier = 1.4;
						EngineCore.dynStats("lib", 2, "lus", 50);
					}
				} else { //If player has 1 dogdicks
					//if player has 1 total
					if (player.cockTotal() === 1) {
						MainView.outputText("\n\nYou feel something slippery wiggling inside your sheath, and another red point peeks out.  In spite of yourself, you start getting turned on by the change, and the new dick slowly slides free, eventually stopping once the thick knot pops free.  The pair of dog-dicks hang there, leaking pre-cum and arousing you far beyond normal.", false);
						player.createCock(7 + Utils.rand(7), 1.5 + Utils.rand(10) / 10);
						player.cocks[1].cockType = CockTypesEnum.DOG;
						player.cocks[1].knotMultiplier = 1.4;
						EngineCore.dynStats("lib", 2, "lus", 50);
					} else if (player.cockTotal() >= 1) { //if player has more
						//if first dick is already doggi'ed
						if (player.cocks[0].cockType === CockTypesEnum.DOG) {
							MainView.outputText("\n\nYour crotch twitches, and you pull open your " + player.armorName + " to get a better look.  You watch in horror and arousal as your " + Descriptors.cockDescript(1) + " warps and twists, becoming red and pointed, just like other dog-dick, growing thick bulges near the base.  When it stops you have two dog-cocks and an animal-like sheath.  The whole episode turns you on far more than it should, leaving you dripping animal pre and ready to breed.", false);
							player.cocks[1].cockType = CockTypesEnum.DOG;
							player.cocks[1].knotMultiplier = 1.4;
						} else { //first dick is not dog
							MainView.outputText("\n\nYour crotch twitches, and you pull open your " + player.armorName + " to get a better look.  You watch in horror and arousal as your " + Descriptors.cockDescript(0) + " warps and twists, becoming red and pointed, just like other dog-dick, growing thick bulges near the base.  When it stops you have two dog-cocks and an animal-like sheath.  The whole episode turns you on far more than it should, leaving you dripping animal pre and ready to breed.", false);
							player.cocks[0].cockType = CockTypesEnum.DOG;
							player.cocks[0].knotMultiplier = 1.4;
						}
						EngineCore.dynStats("lib", 2, "lus", 50);
					}
				}
			}
			player.genderCheck();
		} else if (type === 4) { //Knotty knot pepper!
			//Cocks only!
			if (player.cockTotal() > 0) {
				//biggify knots
				if (player.dogCocks() > 0) {
					smallestDogCockIndex = _.indexOf(player.cocks, _.minBy(_.filter(player.cocks, function(cock) { return cock.cockType === CockTypesEnum.DOG; }), function(cock) {
						return cock.knotMultiplier;
					}));
					//Have smallest knotted cock selected.
					knotChange = ( Utils.rand(2) + 5) / 20 * crit;
					if (player.cocks[smallestDogCockIndex].knotMultiplier >= 1.5) {
						knotChange /= 2;
					}
					if (player.cocks[smallestDogCockIndex].knotMultiplier >= 1.75) {
						knotChange /= 2;
					}
					if (player.cocks[smallestDogCockIndex].knotMultiplier >= 2) {
						knotChange /= 5;
					}
					player.cocks[smallestDogCockIndex].knotMultiplier += knotChange;
					MainView.outputText("\n\n", false);
					if (knotChange < 0.06) {
						MainView.outputText("Your " + Appearance.cockNoun(CockTypesEnum.DOG) + " feels unusually tight in your sheath as your knot grows.", false);
					} else if (knotChange <= 0.12) {
						MainView.outputText("Your " + Appearance.cockNoun(CockTypesEnum.DOG) + " pops free of your sheath, thickening nicely into a bigger knot.", false);
					} else {
						MainView.outputText("Your " + Appearance.cockNoun(CockTypesEnum.DOG) + " surges free of your sheath, swelling thicker with each passing second.  Your knot bulges out at the base, growing far beyond normal.", false);
					}
					EngineCore.dynStats("sen", 0.5, "lus", 5 * crit);
				} else { //Grow dogdick with big knot
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(0) + " twitches, reshaping itself.  The crown tapers down to a point while the base begins swelling.  It isn't painful in the slightest, actually kind of pleasant.  Your dog-like knot slowly fills up like a balloon, eventually stopping when it's nearly twice as thick as the rest.  You touch and shiver with pleasure, oozing pre-cum.", false);
					player.cocks[0].cockType = CockTypesEnum.DOG;
					player.cocks[0].knotMultiplier = 2.1;
				}
			} else { //You wasted knot pepper!
				MainView.outputText("\n\nA slight wave of nausea passes through you.  It seems this pepper does not quite agree with your body.", false);
			}
		} else if (type === 5) { //GROW BALLS
			if (player.balls <= 1) {
				MainView.outputText("\n\nA spike of pain doubles you up, nearly making you vomit.  You stay like that, nearly crying, as a palpable sense of relief suddenly washes over you.  You look down and realize you now have a small sack, complete with two relatively small balls.", false);
				player.balls = 2;
				player.ballSize = 1;
				EngineCore.dynStats("lib", 2, "lus", -10);
			} else {
				//Makes your balls biggah!
				player.ballSize++;
				//They grow slower as they get bigger...
				if (player.ballSize > 10) {
					player.ballSize -= 0.5;
				}
				//Texts
				if (player.ballSize <= 2) {
					MainView.outputText("\n\nA flash of warmth passes through you and a sudden weight develops in your groin.  You pause to examine the changes and your roving fingers discover your " + Descriptors.simpleBallsDescript() + " have grown larger than a human's.", false);
				} else {
					MainView.outputText("\n\nA sudden onset of heat envelops your groin, focusing on your " + Descriptors.sackDescript() + ".  Walking becomes difficult as you discover your " + Descriptors.simpleBallsDescript() + " have enlarged again.", false);
				}
				EngineCore.dynStats("lib", 1, "lus", 3);
			}
		}
		//Sexual Stuff Now
		//------------------
		//Man-Parts
		//3 Changes,
		//1. Cock Xform
		//2. Knot Size++
		//3. cumMultiplier++ (to max of 1.5)
		if (player.cocks.length > 0) {
			//Grow knot on smallest knotted dog cock
			if (type !== 4 && player.dogCocks() > 0 && ((changes < changeLimit && Utils.rand(1.4) === 0) || type === 1)) {
				smallestDogCockIndex = _.indexOf(player.cocks, _.minBy(_.filter(player.cocks, function(cock) { return cock.cockType === CockTypesEnum.DOG; }), function(cock) {
					return cock.knotMultiplier;
				}));
				//Have smallest knotted cock selected.
				knotChange = ( Utils.rand(2) + 1) / 20 * crit;
				if (player.cocks[smallestDogCockIndex].knotMultiplier >= 1.5) {
					knotChange /= 2;
				}
				if (player.cocks[smallestDogCockIndex].knotMultiplier >= 1.75) {
					knotChange /= 2;
				}
				if (player.cocks[smallestDogCockIndex].knotMultiplier >= 2) {
					knotChange /= 5;
				}
				player.cocks[smallestDogCockIndex].knotMultiplier += knotChange;
				if (knotChange < 0.06) {
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(smallestDogCockIndex) + " feels unusually tight in your sheath as your knot grows.", false);
				} else if (knotChange <= 0.12) {
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(smallestDogCockIndex) + " pops free of your sheath, thickening nicely into a bigger knot.", false);
				} else {
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(smallestDogCockIndex) + " surges free of your sheath, swelling thicker with each passing second.  Your knot bulges out at the base, growing far beyond normal.", false);
				}
				EngineCore.dynStats("sen", 0.5, "lus", 5 * crit);
				changes++;
			}
			//Cock Xform if player has free cocks.
			if (player.dogCocks() < player.cocks.length && ((changes < changeLimit && Utils.rand(1.6)) || type === 1) === 0) {
				var nonDogCockIndex = _.indexOf(player.cocks, _.findBy(player.cocks, function(cock) { return cock.cockType !== CockTypesEnum.DOG; }));
				//Talk about it
				//Hooooman
				if (player.cocks[nonDogCockIndex].cockType === CockTypesEnum.HUMAN) {
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(nonDogCockIndex) + " clenches painfully, becoming achingly, throbbingly erect.  A tightness seems to squeeze around the base, and you wince as you see your skin and flesh shifting forwards into a canine-looking sheath.  You shudder as the crown of your " + Descriptors.cockDescript(nonDogCockIndex) + " reshapes into a point, the sensations nearly too much for you.  You throw back your head as the transformation completes, your " + Appearance.cockNoun(CockTypesEnum.DOG) + " much thicker than it ever was before.  <b>You now have a dog-cock.</b>", false);
					EngineCore.dynStats("sen", 10, "lus", 5 * crit);
				} else if (player.cocks[nonDogCockIndex].cockType === CockTypesEnum.HORSE) { //Horse
					MainView.outputText("\n\nYour " + Appearance.cockNoun(CockTypesEnum.HORSE) + " shrinks, the extra equine length seeming to shift into girth.  The flared tip vanishes into a more pointed form, a thick knotted bulge forming just above your sheath.  <b>You now have a dog-cock.</b>", false);
					//Tweak length/thickness.
					if (player.cocks[nonDogCockIndex].cockLength > 6) {
						player.cocks[nonDogCockIndex].cockLength -= 2;
					} else {
						player.cocks[nonDogCockIndex].cockLength -= 0.5;
					}
					player.cocks[nonDogCockIndex].cockThickness += 0.5;

					EngineCore.dynStats("sen", 4, "lus", 5 * crit);
				} else if (player.cocks[nonDogCockIndex].cockType === CockTypesEnum.TENTACLE) { //Tentacular Tuesday!
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(nonDogCockIndex) + " coils in on itself, reshaping and losing its plant-like coloration as it thickens near the base, bulging out in a very canine-looking knot.  Your skin bunches painfully around the base, forming into a sheath.  <b>You now have a dog-cock.</b>", false);
					EngineCore.dynStats("sen", 4, "lus", 5 * crit);
				} else if (player.cocks[nonDogCockIndex].cockType.Index > 4) { //Misc
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(nonDogCockIndex) + " trembles, reshaping itself into a shiny red doggie-dick with a fat knot at the base.  <b>You now have a dog-cock.</b>", false);
					EngineCore.dynStats("sen", 4, "lus", 5 * crit);
				}
				//Demon
				if (player.cocks[nonDogCockIndex].cockType === CockTypesEnum.DEMON) {
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(nonDogCockIndex) + " color shifts red for a moment and begins to swell at the base, but within moments it smooths out, retaining its distinctive demonic shape, only perhaps a bit thicker.", false);
					EngineCore.dynStats("sen", 1, "lus", 2 * crit);
					player.cocks[nonDogCockIndex].cockType = CockTypesEnum.DEMON;
				} else {
					player.cocks[nonDogCockIndex].cockType = CockTypesEnum.DOG;
				}
				//Xform it!
				player.cocks[nonDogCockIndex].knotMultiplier = 1.1;
				player.cocks[nonDogCockIndex].thickenCock(2);
				changes++;

			}
			//Cum Multiplier Xform
			if (player.cumMultiplier < 2 && Utils.rand(2) === 0 && changes < changeLimit) {
				//Lots of cum raises cum multiplier cap to 2 instead of 1.5
				if ((player.findPerk(PerkLib.MessyOrgasms) >= 0 ? 2 : 1.5) < player.cumMultiplier + 0.05 * crit) {
					changes--;
				} else {
					player.cumMultiplier += 0.05 * crit;
					//Flavor text
					if (player.balls === 0) {
						MainView.outputText("\n\nYou feel a churning inside your gut as something inside you changes.", false);
					} else if (player.balls > 0) {
						MainView.outputText("\n\nYou feel a churning in your " + Descriptors.ballsDescriptLight() + ".  It quickly settles, leaving them feeling somewhat more dense.", false);
					}
					if (crit > 1) {
						MainView.outputText("  A bit of milky pre dribbles from your " + Descriptors.multiCockDescriptLight() + ", pushed out by the change.", false);
					}
				}
				changes++;
			}
			//Oversized pepper
			if (type === 1) {
				//GET LONGER
				//single cock
				var cockModifications = 0;
				var modifiedCockIndex = 0;
				if (player.cocks.length === 1) {
					cockModifications = player.increaseCock(0, Utils.rand(4) + 3);
					EngineCore.dynStats("sen", 1, "lus", 10);
				} else { //Multicock
					modifiedCockIndex = player.shortestCockIndex();
					//Grow smallest cock!
					//temp2 changes to growth amount
					cockModifications = player.increaseCock(modifiedCockIndex, Utils.rand(4) + 3);
					EngineCore.dynStats("sen", 1, "lus", 10);
					if (player.cocks[modifiedCockIndex].cockThickness <= 2) {
						player.cocks[modifiedCockIndex].thickenCock(1);
					}
				}
				if (cockModifications > 2) {
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(modifiedCockIndex) + " tightens painfully, inches of bulging dick-flesh pouring out from your crotch as it grows longer.  Thick pre forms at the pointed tip, drawn out from the pleasure of the change.", false);
				} else if (cockModifications > 1) {
					MainView.outputText("\n\nAching pressure builds within your crotch, suddenly releasing as an inch or more of extra dick-flesh spills out.  A dollop of pre beads on the head of your enlarged " + Descriptors.cockDescript(modifiedCockIndex) + " from the pleasure of the growth.", false);
				} else {
					MainView.outputText("\n\nA slight pressure builds and releases as your " + Descriptors.cockDescript(modifiedCockIndex) + " pushes a bit further out of your crotch.", false);
				}
			}
		}
		//Female Stuff
		//Multiboobages
		if (player.breastRows.length > 0) {
			//if bigger than A cup
			if (player.breastRows[0].breastRating > 0 && player.vaginas.length > 0) {
				//Doggies only get 3 rows of tits! FENOXO HAS SPOKEN
				if (player.breastRows.length < 3 && Utils.rand(2) === 0 && changes < changeLimit) {
					player.createBreastRow();
					var newBreastRowIndex = player.breastRows.length - 1;
					//Breasts are too small to grow a new row, so they get bigger first
					//But ONLY if player has a vagina (dont want dudes weirded out)
					if (player.vaginas.length > 0 && player.breastRows[0].breastRating <= player.breastRows.length) {
						MainView.outputText("\n\nYour " + Descriptors.breastDescript(0) + " feel constrained and painful against your top as they grow larger by the moment, finally stopping as they reach ", false);
						player.breastRows[0].breastRating += 2;
						MainView.outputText(player.breastCup(0) + " size.  But it doesn't stop there, you feel a tightness beginning lower on your torso...", false);
						changes++;
					}
					//Had 1 row to start
					if (player.breastRows.length === 2) {
						//1 size below primary breast row!
						player.breastRows[newBreastRowIndex].breastRating = player.breastRows[0].breastRating - 1;
						if (player.breastRows[0].breastRating - 1 === 0) {
							MainView.outputText("\n\nA second set of breasts forms under your current pair, stopping while they are still fairly flat and masculine looking.", false);
						} else {
							MainView.outputText("\n\nA second set of breasts bulges forth under your current pair, stopping as they reach " + player.breastCup(newBreastRowIndex) + "s.", false);
						}
						MainView.outputText("  A sensitive nub grows on the summit of each new tit, becoming a new nipple.", false);
						EngineCore.dynStats("sen", 6, "lus", 5);
						changes++;
					} else if (player.breastRows.length > 2 && player.breastRows[0].breastRating > player.breastRows.length) { //Many breast Rows - requires larger primary tits...
						EngineCore.dynStats("sen", 6, "lus", 5);
						//New row's size = the size of the row above -1
						player.breastRows[newBreastRowIndex].breastRating = player.breastRows[newBreastRowIndex - 1].breastRating - 1;
						//If second row are super small but primary row is huge it could go negative.
						//This corrects that problem.
						if (player.breastRows[newBreastRowIndex].breastRating < 0) {
							player.breastRows[newBreastRowIndex].breastRating = 0;
						}
						if (player.breastRows[newBreastRowIndex - 1].breastRating < 0) {
							player.breastRows[newBreastRowIndex - 1].breastRating = 0;
						}
						if (player.breastRows[newBreastRowIndex].breastRating === 0) {
							MainView.outputText("\n\nYour abdomen tingles and twitches as a new row of breasts sprouts below the others.  Your new breasts stay flat and masculine, not growing any larger.", false);
						} else {
							MainView.outputText("\n\nYour abdomen tingles and twitches as a new row of " + player.breastCup(newBreastRowIndex) + " " + Descriptors.breastDescript(newBreastRowIndex) + " sprouts below your others.", false);
						}
						MainView.outputText("  A sensitive nub grows on the summit of each new tit, becoming a new nipple.", false);
						changes++;
					}
					//Extra sensitive if crit
					if (crit > 1) {
						if (crit > 2) {
							MainView.outputText("  You heft your new chest experimentally, exploring the new flesh with tender touches.  Your eyes nearly roll back in your head from the intense feelings.", false);
							EngineCore.dynStats("sen", 6, "lus", 15, "cor", 0);
						} else {
							MainView.outputText("  You touch your new nipples with a mixture of awe and desire, the experience arousing beyond measure.  You squeal in delight, nearly orgasming, but in time finding the willpower to stop yourself.", false);
							EngineCore.dynStats("sen", 3, "lus", 10);
						}
					}

				} else if ( Utils.rand(2) === 0) { //If already has max doggie breasts!
					//Check for size mismatches, and move closer to spec!
					var index = player.breastRows.length;
					var breastRatingDifference = 0;
					var evened = false;
					//Check each row, and if the row above or below it is
					while (index > 1 && breastRatingDifference === 0) {
						index--;
						//Gimme a sec
						if (player.breastRows[index].breastRating + 1 < player.breastRows[index - 1].breastRating) {
							if (!evened) {
								evened = true;
								MainView.outputText("\n", false);
							}
							MainView.outputText("\nYour " + Utils.num2Text2(index + 1) + "row of " + Descriptors.breastDescript(index) + " grows larger, as if jealous of the jiggling flesh above.", false);
							breastRatingDifference = Math.max(1, Math.min(5, (player.breastRows[index - 1].breastRating) - player.breastRows[index].breastRating - 1));
							player.breastRows[index].breastRating += breastRatingDifference;
						}
					}
				}
			}
		} else if ( Utils.rand(2) === 0 && changes < changeLimit) { //Grow tits if have NO breasts/nipples AT ALL
			MainView.outputText("\n\nYour chest tingles uncomfortably as your center of balance shifts.  <b>You now have a pair of B-cup breasts.</b>", false);
			MainView.outputText("  A sensitive nub grows on the summit of each tit, becoming a new nipple.", false);
			player.createBreastRow();
			player.breastRows[0].breastRating = 2;
			player.breastRows[0].breasts = 2;
			EngineCore.dynStats("sen", 4, "lus", 6);
			changes++;
		}
		//Go into heat
		if ( Utils.rand(2) === 0 && changes < changeLimit && player.goIntoHeat(true)) {
			changes++;
		}
		if (changes < changeLimit && player.dogScore() >= 3 && Utils.rand(4) === 0) {
			changes++;
			MainView.outputText("\n\n", false);
			MainView.outputText("Images and thoughts come unbidden to your mind, overwhelming your control as you rapidly lose yourself in them, daydreaming of... ", false);
			//cawk fantasies
			if (player.gender <= 1 || (player.gender === 3 && Utils.rand(2) === 0)) {
				MainView.outputText("bounding through the woods, hunting with your master.  Feeling the wind in your fur and the thrill of the hunt coursing through your veins intoxicates you.  You have your nose to the ground, tracking your quarry as you run, until a heavenly scent stops you in your tracks.", false);
				EngineCore.dynStats("lus", 5 + player.lib / 20);
				//break1
				if (player.cor < 33 || !player.hasCock()) {
					MainView.outputText("\nYou shake your head to clear the unwanted fantasy from your mind, repulsed by it.", false);
				} else {
					MainView.outputText("  Heart pounding, your shaft pops free of its sheath on instinct, as you take off after the new scent.  Caught firmly in the grip of a female's heat, you ignore your master's cry as you disappear into the wild, " + Appearance.cockNoun(CockTypesEnum.DOG) + " growing harder as you near your quarry.  You burst through a bush, spotting a white-furred female.  She drops, exposing her dripping fem-sex to you, the musky scent of her sex channeling straight through your nose and sliding into your " + Appearance.cockNoun(CockTypesEnum.DOG) + ".", false);
					EngineCore.dynStats("lus", 5 + player.lib / 20);
					//Break 2
					if (player.cor < 66) {
						MainView.outputText("\nYou blink a few times, the fantasy fading as you master yourself.  That daydream was so strange, yet so hot.", false);
					} else {
						MainView.outputText("  Unable to wait any longer, you mount her, pressing your bulging knot against her vulva as she yips in pleasure. The heat of her sex is unreal, the tight passage gripping you like a vice as you jackhammer against her, biting her neck gently in spite of the violent pounding.", false);
						EngineCore.dynStats("lus", 5 + player.lib / 20);
						//break3
						if (player.cor < 80) {
							if (player.vaginas.length > 0) {
								MainView.outputText("\nYou reluctantly pry your hand from your aching " + Descriptors.vaginaDescript(0) + " as you drag yourself out of your fantasy.", false);
							} else {
								MainView.outputText("\nYou reluctantly pry your hand from your aching " + Descriptors.cockDescript(0) + " as you drag yourself out of your fantasy.", false);
							}
						} else {
							MainView.outputText("  At last your knot pops into her juicy snatch, splattering her groin with a smattering of her arousal.  The scents of your mating reach a peak as the velvet vice around your " + Appearance.cockNoun(CockTypesEnum.DOG) + " quivers in the most indescribably pleasant way.  You clamp down on her hide as your whole body tenses, unleashing a torrent of cum into her sex.  Each blast is accompanied by a squeeze of her hot passage, milking you of the last of your spooge.  Your " + player.legs() + " give out as your fantasy nearly brings you to orgasm, the sudden impact with the ground jarring you from your daydream.", false);
							EngineCore.dynStats("lus", 5 + player.lib / 20);
						}
					}
				}
			} else if (player.hasVagina()) { //Pure female fantasies
				MainView.outputText("wagging your dripping " + Descriptors.vaginaDescript(0) + " before a pack of horny wolves, watching their shiny red doggie-pricks practically jump out of their sheaths at your fertile scent.", false);
				EngineCore.dynStats("lus", 5 + player.lib / 20);
				//BREAK 1
				if (player.cor < 33) {
					MainView.outputText("\nYou shake your head to clear the unwanted fantasy from your mind, repulsed by it.", false);
				} else {
					MainView.outputText("  In moments they begin their advance, plunging their pointed beast-dicks into you, one after another.  You yip and howl with pleasure as each one takes his turn knotting you.", false);
					EngineCore.dynStats("lus", 5 + player.lib / 20);
					//BREAK 2
					if (player.cor <= 66) {
						MainView.outputText("\nYou blink a few times, the fantasy fading as you master yourself.  That daydream was so strange, yet so hot.", false);
					} else {
						MainView.outputText("  The feeling of all that hot wolf-spooge spilling from your overfilled snatch and running down your thighs is heavenly, nearly making you orgasm on the spot.  You see the alpha of the pack is hard again, and his impressive member is throbbing with the need to breed you.", false);
						EngineCore.dynStats("lus", 5 + player.lib / 20);
						//break3
						if (player.cor < 80) {
							MainView.outputText("\nYou reluctantly pry your hand from your aching " + Descriptors.vaginaDescript(0) + " as you drag yourself out of your fantasy.", false);
						} else {
							MainView.outputText("  You growl with discomfort as he pushes into your abused wetness, stretching you tightly, every beat of his heart vibrating through your nethers.  With exquisite force, he buries his knot in you and begins filling you with his potent seed, impregnating you for sure. Your knees give out as your fantasy nearly brings you to orgasm, the sudden impact with the ground jarring you from your daydream.", false);
							EngineCore.dynStats("lus", 5 + player.lib / 20);
						}
					}
				}
			} else {
				MainView.outputText("wagging your [asshole] before a pack of horny wolves, watching their shiny red doggie-pricks practically jump out of their sheaths at you after going so long without a female in the pack.");
				EngineCore.dynStats("lus", 5 + player.lib / 20);
				//BREAK 1
				if (player.cor < 33) {
					MainView.outputText("\nYou shake your head to clear the unwanted fantasy from your mind, repulsed by it.", false);
				} else {
					MainView.outputText("  In moments they begin their advance, plunging their pointed beast-dicks into you, one after another.  You yip and howl with pleasure as each one takes his turn knotting you.", false);
					EngineCore.dynStats("lus", 5 + player.lib / 20);
					//BREAK 2
					if (player.cor <= 66) {
						MainView.outputText("\nYou blink a few times, the fantasy fading as you master yourself.  That daydream was so strange, yet so hot.", false);
					} else {
						MainView.outputText("  The feeling of all that hot wolf-spooge spilling from your overfilled ass and running down your thighs is heavenly, nearly making you orgasm on the spot.  You see the alpha of the pack is hard again, and his impressive member is throbbing with the need to spend his lust on you.", false);
						EngineCore.dynStats("lus", 5 + player.lib / 20);
						//break3
						if (player.cor < 80) {
							MainView.outputText("\nYou reluctantly pry your hand from your aching asshole as you drag yourself out of your fantasy.", false);
						} else {
							MainView.outputText("  You growl with discomfort as he pushes into your abused, wet hole, stretching you tightly, every beat of his heart vibrating through your hindquarters.  With exquisite force, he buries his knot in you and begins filling you with his potent seed, impregnating you for sure. Your knees give out as your fantasy nearly brings you to orgasm, the sudden impact with the ground jarring you from your daydream.", false);
							EngineCore.dynStats("lus", 5 + player.lib / 20);
						}
					}
				}
			}
		}
		//Remove odd eyes
		if (changes < changeLimit && Utils.rand(5) === 0 && player.eyeType > AppearanceDefs.EYES_HUMAN) {
			if (player.eyeType === AppearanceDefs.EYES_BLACK_EYES_SAND_TRAP) {
				MainView.outputText("\n\nYou feel a twinge in your eyes and you blink.  It feels like black cataracts have just fallen away from you, and you know without needing to see your reflection that your eyes have gone back to looking human.");
			} else {
				MainView.outputText("\n\nYou blink and stumble, a wave of vertigo threatening to pull your " + player.feet() + " from under you.  As you steady and open your eyes, you realize something seems different.  Your vision is changed somehow.", false);
				if (player.eyeType === AppearanceDefs.EYES_FOUR_SPIDER_EYES) {
					MainView.outputText("  Your multiple, arachnid eyes are gone!</b>", false);
				}
				MainView.outputText("  <b>You have normal, humanoid eyes again.</b>", false);
			}
			player.eyeType = AppearanceDefs.EYES_HUMAN;
			changes++;
		}
		//Master Furry Appearance Order:
		//Tail -> Ears -> Paws -> Fur -> Face
		//Dog-face requires fur & paws  Should be last morph to take place
		if ( Utils.rand(5) === 0 && changes < changeLimit && player.faceType !== AppearanceDefs.FACE_DOG && player.skinType === AppearanceDefs.SKIN_TYPE_FUR && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DOG) {
			if (player.faceType === AppearanceDefs.FACE_HORSE) {
				MainView.outputText("\n\nYour face is wracked with pain.  You throw back your head and scream in agony as you feel your cheekbones breaking and shifting, reforming into something else.  <b>Your horse-like features rearrange to take on many canine aspects.</b>", false);
			} else {
				MainView.outputText("\n\nYour face is wracked with pain.  You throw back your head and scream in agony as you feel your cheekbones breaking and shifting, reforming into something... different.  You find a puddle to view your reflection...<b>your face is now a cross between human and canine features.</b>", false);
			}
			player.faceType = AppearanceDefs.FACE_DOG;
			changes++;
		}
		if (type === 3 && player.hairColor !== "midnight black") {
			if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
				MainView.outputText("<b>\n\nYour fur and hair tingles, growing in thicker than ever as darkness begins to spread from the roots, turning it midnight black.</b>", false);
			} else {
				MainView.outputText("<b>\n\nYour " + player.skinDesc + " itches like crazy as fur grows out from it, coating your body.  It's incredibly dense and black as the middle of a moonless night.</b>", false);
			}
			player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
			player.skinAdj = "thick";
			player.skinDesc = "fur";
			player.hairColor = "midnight black";
		}
		//Become furred - requires paws and tail
		if ( Utils.rand(4) === 0 && changes < changeLimit && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DOG && player.tailType === AppearanceDefs.TAIL_TYPE_DOG && player.skinType !== AppearanceDefs.SKIN_TYPE_FUR) {
			if (player.skinType === AppearanceDefs.SKIN_TYPE_PLAIN) {
				MainView.outputText("\n\nYour skin itches intensely.  You gaze down as more and more hairs break forth from your skin, quickly transforming into a soft coat of fur.  <b>You are now covered in " + player.hairColor + " fur from head to toe.</b>", false);
			} else if (player.skinType === AppearanceDefs.SKIN_TYPE_SCALES) {
				MainView.outputText("\n\nYour scales itch incessantly.  You scratch, feeling them flake off to reveal a coat of " + player.hairColor + " fur growing out from below!  <b>You are now covered in " + player.hairColor + " fur from head to toe.</b>", false);
			}
			player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
			player.skinDesc = "fur";
			changes++;
		}
		//Change to paws - requires tail and ears
		if ( Utils.rand(3) === 0 && player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_DOG && player.tailType === AppearanceDefs.TAIL_TYPE_DOG && player.earType === AppearanceDefs.EARS_DOG && changes < changeLimit) {
			//Feet -> paws
			if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HUMAN) {
				MainView.outputText("\n\nYou scream in agony as you feel the bones in your feet break and begin to rearrange. <b>You now have paws</b>.", false);
			} else if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HOOFED) { //Hooves -> Paws
				MainView.outputText("\n\nYou feel your hooves suddenly splinter, growing into five unique digits.  Their flesh softens as your hooves reshape into furred paws.", false);
			} else {
				MainView.outputText("\n\nYour lower body is wracked by pain!  Once it passes, you discover that you're standing on fur-covered paws!  <b>You now have paws</b>.", false);
			}
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DOG;
			changes++;
		}
		//Change to dog-ears!  Requires dog-tail
		if ( Utils.rand(2) === 0 && player.earType !== AppearanceDefs.EARS_DOG && player.tailType === AppearanceDefs.TAIL_TYPE_DOG && changes < changeLimit) {
			if (player.earType === -1) {
				MainView.outputText("\n\nTwo painful nubs begin sprouting from your head, growing and opening into canine ears.  ", false);
			}
			if (player.earType === AppearanceDefs.EARS_HUMAN) {
				MainView.outputText("\n\nThe skin on the sides of your face stretches painfully as your ears migrate upwards, towards the top of your head.  They shift and elongate, becoming canine in nature.  ", false);
			}
			if (player.earType === AppearanceDefs.EARS_HORSE) {
				MainView.outputText("\n\nYour equine ears twist as they transform into canine versions.  ", false);
			}
			if (player.earType > AppearanceDefs.EARS_DOG) {
				MainView.outputText("\n\nYour ears transform, becoming more canine in appearance.  ", false);
			}
			player.earType = AppearanceDefs.EARS_DOG;
			player.earValue = 2;
			MainView.outputText("<b>You now have dog ears.</b>", false);
			changes++;
		}
		//Grow tail if not dog-tailed
		if ( Utils.rand(3) === 0 && changes < changeLimit && player.tailType !== AppearanceDefs.TAIL_TYPE_DOG) {
			if (player.tailType === AppearanceDefs.TAIL_TYPE_NONE) {
				MainView.outputText("\n\nA pressure builds on your backside.  You feel under your clothes and discover an odd bump that seems to be growing larger by the moment.  In seconds it passes between your fingers, bursts out the back of your clothes, and grows most of the way to the ground.  A thick coat of fur springs up to cover your new tail.  ", false);
			} else if (player.tailType === AppearanceDefs.TAIL_TYPE_HORSE) {
				MainView.outputText("\n\nYou feel a tightness in your rump, matched by the tightness with which the strands of your tail clump together.  In seconds they fuse into a single tail, rapidly sprouting thick fur.  ", false);
			} else if (player.tailType === AppearanceDefs.TAIL_TYPE_DEMONIC) {
				MainView.outputText("\n\nThe tip of your tail feels strange.  As you pull it around to check on it, the spaded tip disappears, quickly replaced by a thick coat of fur over the entire surface of your tail.  ", false);
			} else if (player.tailType >= AppearanceDefs.TAIL_TYPE_COW) {
				MainView.outputText("\n\nYou feel your backside shift and change, flesh molding and displacing into a long puffy tail!  ", false);
			}
			changes++;
			player.tailType = AppearanceDefs.TAIL_TYPE_DOG;
			MainView.outputText("<b>You now have a dog-tail.</b>", false);
		}
		if ( Utils.rand(4) === 0 && player.gills && changes < changeLimit) {
			MainView.outputText("\n\nYour chest itches, and as you reach up to scratch it, you realize your gills have withdrawn into your skin.", false);
			player.gills = false;
			changes++;
		}
		if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nYou become more... solid.  Sinewy.  A memory comes unbidden from your youth of a grizzled wolf you encountered while hunting, covered in scars, yet still moving with an easy grace.  You imagine that must have felt something like this.", false);
			EngineCore.dynStats("tou", 4, "sen", -3);
			changes++;
		}
		//If no changes yay
		if (changes === 0) {
			MainView.outputText("\n\nInhuman vitality spreads through your body, invigorating you!\n", false);
			EngineCore.HPChange(20, true);
			EngineCore.dynStats("lus", 3);
		}
	};
	Mutations.impFood = function(player) {
		MainView.outputText("", true);
		if (player.cocks.length > 0) {
			MainView.outputText("The food tastes strange and corrupt - you can't really think of a better word for it, but it's unclean.", false);
			if (player.cocks[0].cockLength < 12) {
				MainView.outputText("\n\n", false);
				player.lengthChange(player.increaseCock(0, Utils.rand(2) + 2), 1);
			}
			MainView.outputText("\n\nInhuman vitality spreads through your body, invigorating you!\n", false);
			EngineCore.HPChange(30 + player.tou / 3, true);
			EngineCore.dynStats("lus", 3, "cor", 1);
			//Shrinkage!
			if ( Utils.rand(2) === 0 && player.tallness > 42) {
				MainView.outputText("\n\nYour skin crawls, making you close your eyes and shiver.  When you open them again the world seems... different.  After a bit of investigation, you realize you've become shorter!\n", false);
				player.tallness -= 1 + Utils.rand(3);
			}
			//Red skin!
			if ( Utils.rand(30) === 0 && player.skinTone !== "red") {
				if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
					MainView.outputText("\n\nUnderneath your fur, your skin ", false);
				} else {
					MainView.outputText("\n\nYour " + player.skinDesc + " ", false);
				}
				if ( Utils.rand(2) === 0) {
					player.skinTone = "red";
				} else {
					player.skinTone = "orange";
				}
				MainView.outputText("begins to lose its color, fading until you're as white as an albino.  Then, starting at the crown of your head, a reddish hue rolls down your body in a wave, turning you completely " + player.skinTone + ".", false);
			}
			return;
		} else {
			MainView.outputText("The food tastes... corrupt, for lack of a better word.\n", false);
			EngineCore.HPChange(20 + player.tou / 3, true);
			EngineCore.dynStats("lus", 3, "cor", 1);
		}
		//Red skin!
		if ( Utils.rand(30) === 0 && player.skinTone !== "red") {
			if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
				MainView.outputText("\n\nUnderneath your fur, your skin ", false);
			} else {
				MainView.outputText("\n\nYour " + player.skinDesc + " ", false);
			}
			if ( Utils.rand(2) === 0) {
				player.skinTone = "red";
			} else {
				player.skinTone = "orange";
			}
			MainView.outputText("begins to lose its color, fading until you're as white as an albino.  Then, starting at the crown of your head, a reddish hue rolls down your body in a wave, turning you completely " + player.skinTone + ".", false);
		}
		//Shrinkage!
		if ( Utils.rand(2) === 0 && player.tallness > 42) {
			MainView.outputText("\n\nYour skin crawls, making you close your eyes and shiver.  When you open them again the world seems... different.  After a bit of investigation, you realize you've become shorter!", false);
			player.tallness -= 1 + Utils.rand(3);
		}
	};
	Mutations.succubisDelight = function(tainted, player) {
		player.slimeFeed();
		var changes = 0;
		var crit = 1;
		//Determine crit multiplier (x2 or x3)
		if ( Utils.rand(4) === 0) {
			crit += Utils.rand(2) + 1;
		}
		var changeLimit = 1;
		//Chances to up the max number of changes
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		//Generic drinking text
		MainView.outputText("You uncork the bottle and drink down the strange substance, struggling to down the thick liquid.", true);
		//low corruption thoughts
		if (player.cor < 33) {
			MainView.outputText("  This stuff is gross, why are you drinking it?", false);
		}
		//high corruption
		if (player.cor >= 66) {
			MainView.outputText("  You lick your lips, marvelling at how thick and sticky it is.", false);
		}
		//Corruption increase
		if (player.cor < 50 || Utils.rand(2)) {
			MainView.outputText("\n\nThe drink makes you feel... dirty.", false);
			var corruptionChange = 1;
			//Corrupts the uncorrupted faster
			if (player.cor < 50) {
				corruptionChange++;
			}
			if (player.cor < 40) {
				corruptionChange++;
			}
			if (player.cor < 30) {
				corruptionChange++;
			}
			//Corrupts the very corrupt slower
			if (player.cor >= 90) {
				corruptionChange = 0.5;
			}
			if (tainted) {
				EngineCore.dynStats("cor", corruptionChange);
			} else {
				EngineCore.dynStats("cor", 0);
			}
			changes++;
		}
		//Makes your balls biggah! (Or cummultiplier higher if futa!)
		if ( Utils.rand(1.5) === 0 && changes < changeLimit && player.balls > 0) {
			player.ballSize++;
			//They grow slower as they get bigger...
			if (player.ballSize > 10) {
				player.ballSize -= 0.5;
			}
			//Texts
			if (player.ballSize <= 2) {
				MainView.outputText("\n\nA flash of warmth passes through you and a sudden weight develops in your groin.  You pause to examine the changes and your roving fingers discover your " + Descriptors.simpleBallsDescript() + " have grown larger than a human's.", false);
			} else {
				MainView.outputText("\n\nA sudden onset of heat envelops your groin, focusing on your " + Descriptors.sackDescript() + ".  Walking becomes difficult as you discover your " + Descriptors.simpleBallsDescript() + " have enlarged again.", false);
			}
			EngineCore.dynStats("lib", 1, "lus", 3);
		}
		//Boost cum multiplier
		if (changes < changeLimit && Utils.rand(2) === 0 && player.cocks.length > 0) {
			if (player.cumMultiplier < 6 && Utils.rand(2) === 0 && changes < changeLimit) {
				//Lots of cum raises cum multiplier cap to 6 instead of 3
				if ((player.findPerk(PerkLib.MessyOrgasms) >= 0 ? 6 : 3) < player.cumMultiplier + 0.4 * crit) {
					changes--;
				} else {
					player.cumMultiplier += 0.4 * crit;
					//Flavor text
					if (player.balls === 0) {
						MainView.outputText("\n\nYou feel a churning inside your body as something inside you changes.", false);
					}
					if (player.balls > 0) {
						MainView.outputText("\n\nYou feel a churning in your " + Descriptors.ballsDescriptLight() + ".  It quickly settles, leaving them feeling somewhat more dense.", false);
					}
					if (crit > 1) {
						MainView.outputText("  A bit of milky pre dribbles from your " + Descriptors.multiCockDescriptLight() + ", pushed out by the change.", false);
					}
					EngineCore.dynStats("lib", 1);
				}
				changes++;
			}
		}
		//Fail-safe
		if (changes === 0) {
			MainView.outputText("\n\nYour groin tingles, making it feel as if you haven't cum in a long time.", false);
			player.hoursSinceCum += 100;
			changes++;
		}
		if (player.balls > 0 && Utils.rand(3) === 0) {
			MainView.outputText(player.modFem(12, 3), false);
		}
	};
	Mutations.succubisDream = function(player) {
		player.slimeFeed();
		var changes = 0;
		var crit = 1;
		//Determine crit multiplier (x2 or x3)
		crit += Utils.rand(2) + 1;
		var changeLimit = 1;
		//Chances to up the max number of changes
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		//Generic drinking text
		MainView.outputText("You uncork the bottle and drink down the strange substance, struggling to down the thick liquid.", true);
		//low corruption thoughts
		if (player.cor < 33) {
			MainView.outputText("  This stuff is gross, why are you drinking it?", false);
		}
		//high corruption
		if (player.cor >= 66) {
			MainView.outputText("  You lick your lips, marvelling at how thick and sticky it is.", false);
		}
		//Corruption increase
		if (player.cor < 50 || Utils.rand(2)) {
			MainView.outputText("\n\nThe drink makes you feel... dirty.", false);
			var corChange = 1;
			//Corrupts the uncorrupted faster
			if (player.cor < 50) {
				corChange++;
			}
			if (player.cor < 40) {
				corChange++;
			}
			if (player.cor < 30) {
				corChange++;
			}
			//Corrupts the very corrupt slower
			if (player.cor >= 90) {
				corChange = 0.5;
			}
			EngineCore.dynStats("cor", corChange + 2);
			changes++;
		}
		//NEW BALLZ
		if (player.balls < 4) {
			if (player.balls > 0) {
				player.balls = 4;
				MainView.outputText("\n\nIncredible pain scythes through your crotch, doubling you over.  You stagger around, struggling to pull open your " + player.armorName + ".  In shock, you barely register the sight before your eyes: <b>You have four balls.</b>", false);
			}
			if (player.balls === 0) {
				player.balls = 2;
				MainView.outputText("\n\nIncredible pain scythes through your crotch, doubling you over.  You stagger around, struggling to pull open your " + player.armorName + ".  In shock, you barely register the sight before your eyes: <b>You have balls!</b>", false);
				player.ballSize = 1;
			}
			changes++;
		}
		//Makes your balls biggah! (Or cummultiplier higher if futa!)
		if ( Utils.rand(1.5) === 0 && changes < changeLimit && player.balls > 0 && player.cocks.length > 0) {
			player.ballSize++;
			//They grow slower as they get bigger...
			if (player.ballSize > 10) {
				player.ballSize -= 0.5;
			}
			//Texts
			if (player.ballSize <= 2) {
				MainView.outputText("\n\nA flash of warmth passes through you and a sudden weight develops in your groin.  You pause to examine the changes and your roving fingers discover your " + Descriptors.simpleBallsDescript() + " have grown larger than a human's.", false);
			} else {
				MainView.outputText("\n\nA sudden onset of heat envelops your groin, focusing on your " + Descriptors.sackDescript() + ".  Walking becomes difficult as you discover your " + Descriptors.simpleBallsDescript() + " have enlarged again.", false);
			}
			EngineCore.dynStats("lib", 1, "lus", 3);
		}
		//Boost cum multiplier
		if (changes < changeLimit && Utils.rand(2) === 0 && player.cocks.length > 0) {
			if (player.cumMultiplier < 6 && Utils.rand(2) === 0 && changes < changeLimit) {
				//Lots of cum raises cum multiplier cap to 6 instead of 3
				if ((player.findPerk(PerkLib.MessyOrgasms) >= 0 ? 6 : 3) < player.cumMultiplier + 0.4 * crit) {
					changes--;
				} else {
					player.cumMultiplier += 0.4 * crit;
					//Flavor text
					if (player.balls === 0) {
						MainView.outputText("\n\nYou feel a churning inside your body as something inside you changes.", false);
					} else {
						MainView.outputText("\n\nYou feel a churning in your " + Descriptors.ballsDescriptLight() + ".  It quickly settles, leaving them feeling somewhat more dense.", false);
					}
					if (crit > 1) {
						MainView.outputText("  A bit of milky pre dribbles from your " + Descriptors.multiCockDescriptLight() + ", pushed out by the change.", false);
					}
					EngineCore.dynStats("lib", 1);
				}
				changes++;
			}
		}
		//Fail-safe
		if (changes === 0) {
			MainView.outputText("\n\nYour groin tingles, making it feel as if you haven't cum in a long time.", false);
			player.hoursSinceCum += 100;
			changes++;
		}
		if (player.balls > 0 && Utils.rand(3) === 0) {
			MainView.outputText(player.modFem(12, 5), false);
		}
	};
//butt expansion
	Mutations.brownEgg = function(large, player) {
		MainView.outputText("You devour the egg, momentarily sating your hunger.\n\n", true);
		if (!large) {
			MainView.outputText("You feel a bit of additional weight on your backside as your " + Descriptors.buttDescript() + " gains a bit more padding.", true);
			player.buttRating++;
		} else {
			MainView.outputText("Your " + Descriptors.buttDescript() + " wobbles, nearly throwing you off balance as it grows much bigger!", true);
			player.buttRating += 2 + Utils.rand(3);
		}
		if ( Utils.rand(3) === 0) {
			if (large) {
				MainView.outputText(player.modThickness(100, 8), false);
			} else {
				MainView.outputText(player.modThickness(95, 3), false);
			}
		}
	};
//hip expansion
	Mutations.purpleEgg = function(large, player) {
		MainView.outputText("You devour the egg, momentarily sating your hunger.\n\n", true);
		if (!large || player.hipRating > 20) {
			MainView.outputText("You stumble as you feel your " + Descriptors.hipDescript() + " widen, altering your gait slightly.", false);
			player.hipRating++;
		} else {
			MainView.outputText("You stagger wildly as your hips spread apart, widening by inches.  When the transformation finishes you feel as if you have to learn to walk all over again.", false);
			player.hipRating += 2 + Utils.rand(2);
		}
		if ( Utils.rand(3) === 0) {
			if (large) {
				MainView.outputText(player.modThickness(80, 8), false);
			} else {
				MainView.outputText(player.modThickness(80, 3), false);
			}
		}
	};
//Femminess
	Mutations.pinkEgg = function(large, player) {
		MainView.outputText("You devour the egg, momentarily sating your hunger.\n\n", true);
		if (!large) {
			//Remove a dick
			if (player.cocks.length > 0) {
				player.killCocks(1);
				MainView.outputText("\n\n", false);
				player.genderCheck();
			}
			//remove balls
			if (player.balls > 0) {
				if (player.ballSize > 15) {
					player.ballSize -= 8;
					MainView.outputText("Your scrotum slowly shrinks, settling down at a MUCH smaller size.  <b>Your " + Descriptors.ballsDescriptLight() + " are much smaller.</b>\n\n", false);
				} else {
					player.balls = 0;
					player.ballSize = 1;
					MainView.outputText("Your scrotum slowly shrinks, eventually disappearing entirely!  <b>You've lost your balls!</b>\n\n", false);
				}
			}
			//Fertility boost
			if (player.vaginas.length > 0 && player.fertility < 40) {
				MainView.outputText("You feel a tingle deep inside your body, just above your " + Descriptors.vaginaDescript(0) + ", as if you were becoming more fertile.\n\n", false);
				player.fertility += 5;
			}
		} else { //LARGE
			//Remove a dick
			if (player.cocks.length > 0) {
				player.killCocks(-1);
				MainView.outputText("\n\n", false);
				player.genderCheck();
			}
			if (player.balls > 0) {
				player.balls = 0;
				player.ballSize = 1;
				MainView.outputText("Your scrotum slowly shrinks, eventually disappearing entirely!  <b>You've lost your balls!</b>\n\n", false);
			}
			//Fertility boost
			if (player.vaginas.length > 0 && player.fertility < 70) {
				MainView.outputText("You feel a powerful tingle deep inside your body, just above your " + Descriptors.vaginaDescript(0) + ". Instinctively you know you have become more fertile.\n\n", false);
				player.fertility += 10;
			}
		}
		if ( Utils.rand(3) === 0) {
			if (large) {
				MainView.outputText(player.modFem(100, 8), false);
			} else {
				MainView.outputText(player.modFem(95, 3), false);
			}
		}
	};
//Maleness
	Mutations.blueEgg = function(large, player) {
		MainView.outputText("You devour the egg, momentarily sating your hunger.", true);
		var maxLengthChange = 0;
		var maxThicknessChange = 0;
		if (!large) {
			//Kill pussies!
			if (player.vaginas.length > 0) {
				MainView.outputText("\n\nYour vagina clenches in pain, doubling you over.  You slip a hand down to check on it, only to feel the slit growing smaller and smaller until it disappears, taking your clit with it! <b> Your vagina is gone!</b>", false);
				player.removeVagina(0, 1);
				player.clitLength = 0.5;
				player.genderCheck();
			}
			//Dickz
			if (player.cocks.length > 0) {
				MainView.outputText("\n\nYour " + Descriptors.multiCockDescript() + " fill to full-size... and begin growing obscenely.", false);
				_.forEach(player.cocks, function(cock, index) {
					maxLengthChange = Math.max(maxLengthChange, player.increaseCock(index, Utils.rand(3) + 2));
					maxThicknessChange = Math.max(maxThicknessChange, cock.thickenCock(1));
				});
				player.lengthChange(maxLengthChange, player.cocks.length);
				//Display the degree of thickness change.
				if (maxThicknessChange <= 0.5) {
					if (player.cocks.length === 1) {
						MainView.outputText("\n\nYour " + Descriptors.multiCockDescriptLight() + " feels swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. It is definitely thicker.", false);
					} else {
						MainView.outputText("\n\nYour " + Descriptors.multiCockDescriptLight() + " feel swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. They are definitely thicker.", false);
					}
				} else if(maxLengthChange < 1) {
					if (player.cocks.length === 1) {
						MainView.outputText("\n\nYour " + Descriptors.multiCockDescriptLight() + " seems to swell up, feeling heavier. You look down and watch it growing fatter as it thickens.", false);
					} else {
						MainView.outputText("\n\nYour " + Descriptors.multiCockDescriptLight() + " seem to swell up, feeling heavier. You look down and watch them growing fatter as they thicken.", false);
					}
				} else {
					if (player.cocks.length === 1) {
						MainView.outputText("\n\nYour " + Descriptors.multiCockDescriptLight() + " spreads rapidly, swelling an inch or more in girth, making it feel fat and floppy.", false);
					} else {
						MainView.outputText("\n\nYour " + Descriptors.multiCockDescriptLight() + " spread rapidly, swelling as they grow an inch or more in girth, making them feel fat and floppy.", false);
					}
				}
				EngineCore.dynStats("lib", 1, "sen", 1, "lus", 20);
			}
		} else { //LARGE
			//New lines if changes
			if (player.bRows() > 1 || player.buttRating > 5 || player.hipRating > 5 || player.hasVagina()) {
				MainView.outputText("\n\n", false);
			}
			//Kill pussies!
			if (player.vaginas.length > 0) {
				MainView.outputText("Your vagina clenches in pain, doubling you over.  You slip a hand down to check on it, only to feel the slit growing smaller and smaller until it disappears, taking your clit with it!\n\n", false);
				if (player.bRows() > 1 || player.buttRating > 5 || player.hipRating > 5) {
					MainView.outputText("  ", false);
				}
				player.removeVagina(0, 1);
				player.clitLength = 0.5;
				player.genderCheck();
			}
			//Kill extra boobages
			if (player.bRows() > 1) {
				MainView.outputText("Your back relaxes as extra weight vanishes from your chest.  <b>Your lowest " + Descriptors.breastDescript(player.bRows() - 1) + " have vanished.</b>", false);
				if (player.buttRating > 5 || player.hipRating > 5) {
					MainView.outputText("  ", false);
				}
				//Remove lowest row.
				player.removeBreastRow((player.bRows() - 1), 1);
			}
			//Ass/hips shrinkage!
			if (player.buttRating > 5) {
				MainView.outputText("Muscles firm and tone as you feel your " + Descriptors.buttDescript() + " become smaller and tighter.", false);
				if (player.hipRating > 5) {
					MainView.outputText("  ", false);
				}
				player.buttRating -= 2;
			}
			if (player.hipRating > 5) {
				MainView.outputText("Feeling the sudden burning of lactic acid in your " + Descriptors.hipDescript() + ", you realize they have slimmed down and firmed up some.", false);
				player.hipRating -= 2;
			}
			//Shrink tits!
			if (player.biggestTitSize() > 0) {
				player.shrinkTits();
			}
			if (player.cocks.length > 0) {
				//Multiz
				if (player.cocks.length > 1) {
					MainView.outputText("\n\nYour " + Descriptors.multiCockDescript() + " fill to full-size... and begin growing obscenely.  ", false);
					_.forEach(player.cocks, function(cock, index) {
						maxLengthChange = Math.max(maxLengthChange, player.increaseCock(index, Utils.rand(3) + 2));
						maxThicknessChange = Math.max(maxThicknessChange, cock.thickenCock(1.5));
					});
					player.lengthChange(maxLengthChange, player.cocks.length);
					//Display the degree of thickness change.
					if (maxThicknessChange <= 0.5) {
						if (player.cocks.length === 1) {
							MainView.outputText("\n\nYour " + Descriptors.multiCockDescriptLight() + " feels swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. It is definitely thicker.", false);
						} else {
							MainView.outputText("\n\nYour " + Descriptors.multiCockDescriptLight() + " feel swollen and heavy. With a firm, but gentle, squeeze, you confirm your suspicions. They are definitely thicker.", false);
						}
					} else if(maxLengthChange < 1) {
						if (player.cocks.length === 1) {
							MainView.outputText("\n\nYour " + Descriptors.multiCockDescriptLight() + " seems to swell up, feeling heavier. You look down and watch it growing fatter as it thickens.", false);
						} else {
							MainView.outputText("\n\nYour " + Descriptors.multiCockDescriptLight() + " seem to swell up, feeling heavier. You look down and watch them growing fatter as they thicken.", false);
						}
					} else {
						if (player.cocks.length === 1) {
							MainView.outputText("\n\nYour " + Descriptors.multiCockDescriptLight() + " spreads rapidly, swelling an inch or more in girth, making it feel fat and floppy.", false);
						} else {
							MainView.outputText("\n\nYour " + Descriptors.multiCockDescriptLight() + " spread rapidly, swelling as they grow an inch or more in girth, making them feel fat and floppy.", false);
						}
					}
					EngineCore.dynStats("lib", 1, "sen", 1, "lus", 20);
				}
			}
		}
		if ( Utils.rand(3) === 0) {
			if (large) {
				MainView.outputText(player.modFem(0, 8), false);
			} else {
				MainView.outputText(player.modFem(5, 3), false);
			}
		}
	};
//Nipplezzzzz
	Mutations.whiteEgg = function(large, player) {
		var hasChange = false;
		MainView.outputText("You devour the egg, momentarily sating your hunger.", true);
		if (!large) {
			//Grow nipples
			if (player.nippleLength < 3 && player.biggestTitSize() > 0) {
				MainView.outputText("\n\nYour nipples engorge, prodding hard against the inside of your " + player.armorName + ".  Abruptly you realize they've gotten almost a quarter inch longer.", false);
				player.nippleLength += 0.2;
				EngineCore.dynStats("lus", 15);
			}
		} else { //LARGE
			//Grow nipples
			if (player.nippleLength < 3 && player.biggestTitSize() > 0) {
				MainView.outputText("\n\nYour nipples engorge, prodding hard against the inside of your " + player.armorName + ".  Abruptly you realize they've grown more than an additional quarter-inch.", false);
				player.nippleLength += ( Utils.rand(2) + 3) / 10;
				EngineCore.dynStats("lus", 15);
			}
			//NIPPLECUNTZZZ
			_.forEach(player.breastRows, function(breastRow) {
				if (!breastRow.fuckable && player.nippleLength >= 2) {
					breastRow.fuckable = true;
					//Keep track of changes.
					hasChange = true;
				}
			});
			//Talk about if anything was changed.
			if (hasChange) {
				MainView.outputText("\n\nYour " + Descriptors.allBreastsDescript() + " tingle with warmth that slowly migrates to your nipples, filling them with warmth.  You pant and moan, rubbing them with your fingers.  A trickle of wetness suddenly coats your finger as it slips inside the nipple.  Shocked, you pull the finger free.  <b>You now have fuckable nipples!</b>", false);
			}
		}
	};
	Mutations.blackRubberEgg = function(large, player) {
		MainView.outputText("You devour the egg, momentarily sating your hunger.", true);
		//Small
		if (!large) {
			//Change skin to normal if not flawless!
			if ((player.skinAdj !== "smooth" && player.skinAdj !== "latex" && player.skinAdj !== "rubber") || player.skinDesc !== "skin") {
				MainView.outputText("\n\nYour " + player.skinDesc + " tingles delightfully as it ", false);
				if (player.skinType === AppearanceDefs.SKIN_TYPE_PLAIN) {
					MainView.outputText(" loses its blemishes, becoming flawless smooth skin.", false);
				} else if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
					MainView.outputText(" falls out in clumps, revealing smooth skin underneath.", false);
				} else if (player.skinType === AppearanceDefs.SKIN_TYPE_SCALES) {
					MainView.outputText(" begins dropping to the ground in a pile around you, revealing smooth skin underneath.", false);
				} else {
					MainView.outputText(" shifts and changes into flawless smooth skin.", false);
				}
				player.skinDesc = "skin";
				player.skinAdj = "smooth";
				if (player.skinTone === "rough gray") {
					player.skinTone = "gray";
				}
				player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
			} else { //chance of hair change
				//If hair isn't rubbery/latex yet
				if (player.hairColor.indexOf("rubbery") === -1 && player.hairColor.indexOf("latex-textured") && player.hairLength !== 0) {
					//if skin is already one...
					if (player.skinDesc === "skin" && player.skinAdj === "rubber") {
						MainView.outputText("\n\nYour scalp tingles and your " + Descriptors.hairDescript() + " thickens, the strands merging into ", false);
						MainView.outputText(" thick rubbery hair.", false);
						player.hairColor = "rubbery " + player.hairColor;
						EngineCore.dynStats("cor", 2);
					} else if (player.skinDesc === "skin" && player.skinAdj === "latex") {
						MainView.outputText("\n\nYour scalp tingles and your " + Descriptors.hairDescript() + " thickens, the strands merging into ", false);
						MainView.outputText(" shiny latex hair.", false);
						player.hairColor = "latex-textured " + player.hairColor;
						EngineCore.dynStats("cor", 2);
					}
				}
			}
		} else {
			//Change skin to latex if smooth.
			if (player.skinDesc === "skin" && player.skinAdj === "smooth") {
				MainView.outputText("\n\nYour already flawless smooth skin begins to tingle as it changes again.  It becomes shinier as its texture changes subtly.  You gasp as you touch yourself and realize your skin has become ", false);
				if ( Utils.rand(2) === 0) {
					player.skinDesc = "skin";
					player.skinAdj = "latex";
					MainView.outputText("a layer of pure latex.  ", false);
				} else {
					player.skinDesc = "skin";
					player.skinAdj = "rubber";
					MainView.outputText("a layer of sensitive rubber.  ", false);
				}
				CoC.flags[kFLAGS.PC_KNOWS_ABOUT_BLACK_EGGS] = 1;
				if (player.cor < 66) {
					MainView.outputText("You feel like some kind of freak.", false);
				} else {
					MainView.outputText("You feel like some kind of sexy " + player.skinDesc + " love-doll.", false);
				}
				EngineCore.dynStats("spe", -3, "sen", 8, "lus", 10, "cor", 2);
			} else if ((player.skinAdj !== "smooth" && player.skinAdj !== "latex" && player.skinAdj !== "rubber") || player.skinDesc !== "skin") {
				MainView.outputText("\n\nYour " + player.skinDesc + " tingles delightfully as it ", false);
				if (player.skinType === AppearanceDefs.SKIN_TYPE_PLAIN) {
					MainView.outputText(" loses its blemishes, becoming flawless smooth skin.", false);
				} else if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
					MainView.outputText(" falls out in clumps, revealing smooth skin underneath.", false);
				} else if (player.skinType === AppearanceDefs.SKIN_TYPE_SCALES) {
					MainView.outputText(" begins dropping to the ground in a pile around you, revealing smooth skin underneath.", false);
				} else {
					MainView.outputText(" shifts and changes into flawless smooth skin.", false);
				}
				player.skinDesc = "skin";
				player.skinAdj = "smooth";
				if (player.skinTone === "rough gray") {
					player.skinTone = "gray";
				}
				player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
			} else { //chance of hair change
				//If hair isn't rubbery/latex yet
				if (player.hairColor.indexOf("rubbery") === -1 && player.hairColor.indexOf("latex-textured") && player.hairLength !== 0) {
					//if skin is already one...
					if (player.skinAdj === "rubber" && player.skinDesc === "skin") {
						MainView.outputText("\n\nYour scalp tingles and your " + Descriptors.hairDescript() + " thickens, the strands merging into ", false);
						MainView.outputText(" thick rubbery hair.", false);
						player.hairColor = "rubbery " + player.hairColor;
						EngineCore.dynStats("cor", 2);
					} else if (player.skinAdj === "latex" && player.skinDesc === "skin") {
						MainView.outputText("\n\nYour scalp tingles and your " + Descriptors.hairDescript() + " thickens, the strands merging into ", false);
						MainView.outputText(" shiny latex hair.", false);
						player.hairColor = "latex-textured " + player.hairColor;
						EngineCore.dynStats("cor", 2);
					}
				}
			}
		}
	};
	Mutations.hairDye = function(color, player) {
		if (player.hairColor.indexOf("rubbery") !== -1 || player.hairColor.indexOf("latex-textured") !== -1) {
			MainView.outputText("You massage the dye into your " + Descriptors.hairDescript() + " but the dye cannot penetrate the impermeable material your hair is composed of.", true);
			return;
		}
		if (player.hairLength === 0) {
			MainView.outputText("You rub the dye into your bald head, but it has no effect.", true);
			return;
		}
		MainView.outputText("You rub the dye into your " + Descriptors.hairDescript() + ", then use a bucket of cool lakewater to rinse clean a few minutes later.  ", true);
		player.hairColor = color;
		MainView.outputText("You now have " + Descriptors.hairDescript() + ".", false);
		if (player.lust > 50) {
			MainView.outputText("\n\nThe cool water calms your urges somewhat, letting you think more clearly.", false);
			EngineCore.dynStats("lus", -15);
		}
	};
	Mutations.purePearl = function(player) {
		MainView.outputText("You cram the pearl in your mouth and swallow it like a giant pill with some difficulty.  Surprisingly there is no discomfort, only a cool calming sensation that springs up from your core.", true);
		EngineCore.dynStats("lib", -5, "lus", -25, "cor", -10);
		if (player.findPerk(PerkLib.PurityBlessing) < 0) {
			player.createPerk(PerkLib.PurityBlessing, 0, 0, 0, 0);
		}
	};
	Mutations.lactaid = function(player) {
		player.slimeFeed();
		MainView.outputText("You gulp down the bottle of lactaid, easily swallowing the creamy liquid.", true);
		//Bump up size!
		if (player.averageBreastSize() < 8) {
			MainView.outputText("\n\n", false);
			if (player.breastRows.length === 1) {
				player.growTits((1 + Utils.rand(5)), 1, true, 1);
			} else {
				player.growTits(1 + Utils.rand(2), player.breastRows.length, true, 1);
			}
		}
		//Player doesn't lactate
		if (player.biggestLactation() < 1) {
			MainView.outputText("\n\n", false);
			MainView.outputText("You feel your " + Descriptors.nippleDescript(0) + "s become tight and engorged.  A single droplet of milk escapes each, rolling down the curves of your breasts.  <b>You are now lactating!</b>", false);
			_.forEach(player.breastRows, function(breastRow) {
				breastRow.lactationMultiplier += 2;
			});
		} else { //Boost lactation
			MainView.outputText("\n\n", false);
			MainView.outputText("Milk leaks from your " + Descriptors.nippleDescript(0) + "s in thick streams.  You're lactating even more!", false);
			_.forEach(player.breastRows, function(breastRow) {
				breastRow.lactationMultiplier += 1 + Utils.rand(10) / 10;
			});
		}
		EngineCore.dynStats("lus", 10);
		if ( Utils.rand(3) === 0) {
			MainView.outputText(player.modFem(95, 1), false);
		}
	};
	Mutations.useMarbleMilk = function(player) {
		player.slimeFeed();
		//Bottle of Marble's milk - item
		//Description: "A clear bottle of milk from Marble's breasts.  It smells delicious.  "
		MainView.outputText("", true);
		//Text for when the player uses the bottle:
		//[before the player is addicted, Addiction < 30]
		if (player.statusAffectv2(StatusAffects.Marble) < 30 && player.statusAffectv3(StatusAffects.Marble) === 0) {
			MainView.outputText("You gulp down the bottle's contents; Marble makes some good tasting milk.\n\n", false);
		} else if (player.statusAffectv3(StatusAffects.Marble) <= 0) { //[before the player is addicted, Addiction < 50]
			MainView.outputText("You gulp down the bottle's contents; Marble makes some really good tasting milk.\n\n", false);
		} else if (player.statusAffectv3(StatusAffects.Marble) > 0) {
			//[player is completely addicted]
			if (player.findPerk(PerkLib.MarblesMilk) >= 0) {
				MainView.outputText("You gulp down the bottle's contents; it's no substitute for the real thing, but it's a nice pick me up.\n\n", false);
			} else {
				//[player is no longer addicted]
				if (player.findPerk(PerkLib.MarbleResistant) >= 0) {
					MainView.outputText("You gulp down the bottle's contents; you're careful not to get too attached to the taste.\n\n", false);
				} else { //[player is addicted]
					MainView.outputText("You gulp down the bottle's contents; you really needed that.\n\n", false);
				}
			}
		}
		//Increases addiction by 5, up to a max of 50 before the player becomes addicted, no max after the player is addicted.
		SceneLib.marbleScene.marbleStatusChange(0, 5);
		//Does not apply the 'Marble's Milk' effect
		//Purge withdrawl
		if (player.findStatusAffect(StatusAffects.MarbleWithdrawl) >= 0) {
			player.removeStatusAffect(StatusAffects.MarbleWithdrawl);
			EngineCore.dynStats("tou", 5, "int", 5);
			MainView.outputText("You no longer feel the symptoms of withdrawal.\n\n", false);
		}
		//Heals the player 70-100 health
		EngineCore.HPChange(70 + Utils.rand(31), true);
		//Restores a portion of fatigue (once implemented)
		EngineCore.changeFatigue(-25);
		//If the player is addicted, this item negates the withdrawal effects for a few hours (suggest 6), there will need to be a check here to make sure the withdrawal effect doesn't reactivate while the player is under the effect of 'Marble's Milk'.
		if (player.findStatusAffect(StatusAffects.BottledMilk) >= 0) {
			player.addStatusValue(StatusAffects.BottledMilk, 1, (6 + Utils.rand(6)));
		} else {
			player.createStatusAffect(StatusAffects.BottledMilk, 12, 0, 0, 0);
		}
	};
	/*Purified LaBova:
	 This will be one of the items that the player will have to give Marble to purify her, but there is a limit on how much she can be purified in this way.
	 Effects on the player:
	 Mostly the same, but without animal transforms, corruption, and lower limits on body changes
	 Hips and ass cap at half the value for LaBova
	 Nipple growth caps at 1 inch
	 Breasts cap at E or DD cup
	 Raises lactation to a relatively low level, reduces high levels: \"Your breasts suddenly feel less full, it seems you aren't lactating at quite the level you where.\"  OR  \"The insides of your breasts suddenly feel bloated.  There is a spray of milk from them, and they settle closer to a more natural level of lactation.\"
	 Does not apply the addictive quality
	 If the player has the addictive quality, this item can remove that effect

	 Enhanced LaBova:
	 Something that the player can either make or find later; put it in whenever you want, or make your own item.  This is just a possible suggestion.  If it is given to Marble, she only gains the quad nipples.
	 Effects on the player
	 Mostly the same, but some of the effects can be more pronounced.  Ie, more str gain from one dose, or more breast growth.
	 If the player's nipples are larger than 1 inch in length, this item is guaranteed to give them quad nipples.  This applies to all their breasts; seems like it ould be a good compromise on whether or not cowgirls should have 4 breasts.
	 Very small chance to increase fertility (normally this increase would only happen when the player forces a creature to drink their milk).
	 */
	Mutations.laBova = function(tainted, enhanced, player) {
		player.slimeFeed();
		//Changes done
		var changes = 0;
		//Change limit
		var changeLimit = 1;
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(3) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(3) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		if (enhanced) {
			changeLimit += 2;
		}
		//LaBova:
		//ItemDesc: "A bottle containing a misty fluid with a grainy texture, it has a long neck and a ball-like base.  The label has a stylized picture of a well endowed cowgirl nursing two guys while they jerk themselves off.  "
		//ItemUseText:
		MainView.outputText("You drink the ", true);
		if (enhanced) {
			MainView.outputText("Pro Bova", false);
		} else {
			MainView.outputText("La Bova", false);
		}
		MainView.outputText(".  The drink has an odd texture, but is very sweet.  It has a slight aftertaste of milk.", false);
		//Possible Item Effects:
		//STATS
		//Increase player str:
		if (changes < changeLimit && Utils.rand(3) === 0) {
			var strChange = 60 - player.str;
			if (strChange > 0) {
				if ( Utils.rand(2) === 0) {
					MainView.outputText("\n\nThere is a slight pain as you feel your muscles shift somewhat.  Their appearance does not change much, but you feel much stronger.", false);
				} else {
					MainView.outputText("\n\nYou feel your muscles tighten and clench as they become slightly more pronounced.", false);
				}
				EngineCore.dynStats("str", strChange / 10);
				changes++;
			}
		}
		//Increase player tou:
		if (changes < changeLimit && Utils.rand(3) === 0) {
			var touChange = 60 - player.tou;
			if (touChange > 0) {
				if ( Utils.rand(2) === 0) {
					MainView.outputText("\n\nYou feel your insides toughening up; it feels like you could stand up to almost any blow.", false);
				} else {
					MainView.outputText("\n\nYour bones and joints feel sore for a moment, and before long you realize they've gotten more durable.", false);
				}
				EngineCore.dynStats("tou", touChange / 10);
				changes++;

			}
		}
		//Decrease player spd if it is over 30:
		if (changes < changeLimit && Utils.rand(3) === 0) {
			if (player.spe > 30) {
				MainView.outputText("\n\nThe body mass you've gained is making your movements more sluggish.", false);
				var speChange = (player.spe - 30) / 10;
				EngineCore.dynStats("spe", -speChange);
				changes++;
			}
		}
		//Increase Corr, up to a max of 50.
		if (tainted) {
			var corChange = Math.max(0, 50 - player.cor);
			EngineCore.dynStats("cor", corChange / 10);
		}
		//Sex bits - Duderiffic
		if (player.cocks.length > 0 && Utils.rand(2) === 0 && !CoC.flags[kFLAGS.HYPER_HAPPY]) {
			//If the player has at least one dick, decrease the size of each slightly,
			MainView.outputText("\n\n", false);
			var longestCockIndex = player.longestCock();
			var cockLengthChange = 0;
			//Shrink said cock
			if (player.cocks[longestCockIndex].cockLength < 6 && player.cocks[longestCockIndex].cockLength >= 2.9) {
				player.cocks[longestCockIndex].cockLength -= 0.5;
				cockLengthChange -= 0.5;
			}
			cockLengthChange += player.increaseCock(longestCockIndex, ( Utils.rand(3) + 1) * -1);
			player.lengthChange(cockLengthChange, 1);
			if (player.cocks[longestCockIndex].cockLength < 2) {
				MainView.outputText("  ", false);
				if (player.cockTotal() === 1 && !player.hasVagina()) {
					MainView.outputText("Your " + Descriptors.cockDescript(0) + " suddenly starts tingling.  It's a familiar feeling, similar to an orgasm.  However, this one seems to start from the top down, instead of gushing up from your loins.  You spend a few seconds frozen to the odd sensation, when it suddenly feels as though your own body starts sucking on the base of your shaft.  Almost instantly, your cock sinks into your crotch with a wet slurp.  The tip gets stuck on the front of your body on the way down, but your glans soon loses all volume to turn into a shiny new clit.", false);
					if (player.balls > 0) {
						MainView.outputText("  At the same time, your " + Descriptors.ballsDescriptLight() + " fall victim to the same sensation; eagerly swallowed whole by your crotch.", false);
					}
					MainView.outputText("  Curious, you touch around down there, to find you don't have any exterior organs left.  All of it got swallowed into the gash you now have running between two fleshy folds, like sensitive lips.  It suddenly occurs to you; <b>you now have a vagina!</b>", false);
					player.balls = 0;
					player.ballSize = 1;
					player.createVagina();
					player.clitLength = 0.25;
					player.removeCock(0, 1);
				} else {
					player.killCocks(1);
					player.genderCheck();
				}
			}
			//if the last of the player's dicks are eliminated this way, they gain a virgin vagina;
			if (player.cocks.length === 0 && !player.hasVagina()) {
				player.createVagina();
				player.vaginas[0].vaginalLooseness = AppearanceDefs.VAGINA_LOOSENESS_TIGHT;
				player.vaginas[0].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_NORMAL;
				player.vaginas[0].virgin = true;
				player.clitLength = 0.25;
				MainView.outputText("\n\nAn itching starts in your crotch and spreads vertically.  You reach down and discover an opening.  You have grown a <b>new " + Descriptors.vaginaDescript(0) + "</b>!", false);
				changes++;
				player.genderCheck();
				EngineCore.dynStats("lus", 10);
			}
		}
		//Sex bits - girly
		var boobsGrew = false;
		//Increase player's breast size, if they are HH or bigger
		//do not increase size, but do the other actions:
		if (((tainted && player.biggestTitSize() <= 11) || (!tainted && player.biggestTitSize() <= 5)) && changes < changeLimit && ( Utils.rand(3) === 0 || enhanced)) {
			if ( Utils.rand(2) === 0) {
				MainView.outputText("\n\nYour " + Descriptors.breastDescript(0) + " tingle for a moment before becoming larger.", false);
			} else {
				MainView.outputText("\n\nYou feel a little weight added to your chest as your " + Descriptors.breastDescript(0) + " seem to inflate and settle in a larger size.", false);
			}
			player.growTits(1 + Utils.rand(3), 1, false, 3);
			changes++;
			EngineCore.dynStats("sen", 0.5);
			boobsGrew = true;
		}
		//-Remove feathery hair (copy for equinum, canine peppers, Labova)
		if (changes < changeLimit && player.hairType === 1 && Utils.rand(4) === 0) {
			//(long):
			if (player.hairLength >= 6) {
				MainView.outputText("\n\nA lock of your downy-soft feather-hair droops over your eye.  Before you can blow the offending down away, you realize the feather is collapsing in on itself.  It continues to curl inward until all that remains is a normal strand of hair.  <b>Your hair is no longer feathery!</b>", false);
			} else { //(short)
				MainView.outputText("\n\nYou run your fingers through your downy-soft feather-hair while you await the effects of the item you just ingested.  While your hand is up there, it detects a change in the texture of your feathers.  They're completely disappearing, merging down into strands of regular hair.  <b>Your hair is no longer feathery!</b>", false);
			}
			changes++;
			player.hairType = 0;
		}
		//If breasts are D or bigger and are not lactating, they also start lactating:
		if (player.biggestTitSize() >= 4 && player.breastRows[0].lactationMultiplier < 1 && changes < changeLimit && ( Utils.rand(3) === 0 || boobsGrew || enhanced)) {
			MainView.outputText("\n\nYou gasp as your " + Descriptors.breastDescript(0) + " feel like they are filling up with something.  Within moments, a drop of milk leaks from your " + Descriptors.breastDescript(0) + "; <b> you are now lactating</b>.", false);
			player.breastRows[0].lactationMultiplier = 1.25;
			changes++;
			EngineCore.dynStats("sen", 0.5);
		}
		//Quad nipples and other 'special enhanced things.
		if (enhanced) {
			//QUAD DAMAGE!
			if (player.breastRows[0].nipplesPerBreast === 1) {
				changes++;
				MainView.outputText("\n\nYour " + Descriptors.nippleDescript(0) + "s tingle and itch.  You pull back your " + player.armorName + " and watch in shock as they split into four distinct nipples!  <b>You now have four nipples on each side of your chest!</b>", false);
				if (player.breastRows.length >= 2 && player.breastRows[1].nipplesPerBreast === 1) {
					MainView.outputText("A moment later your second row of " + Descriptors.breastDescript(1) + " does the same.  <b>You have sixteen nipples now!</b>", false);
				}
				if (player.breastRows.length >= 3 && player.breastRows[2].nipplesPerBreast === 1) {
					MainView.outputText("Finally, your ");
					if (player.bRows() === 3) {
						MainView.outputText("third row of " + Descriptors.breastDescript(2) + " mutates along with its sisters, sprouting into a wonderland of nipples.", false);
					} else if (player.bRows() >= 4) {
						MainView.outputText("everything from the third row down mutates, sprouting into a wonderland of nipples.", false);
					}
					MainView.outputText("  <b>You have a total of " + Utils.num2Text(player.totalNipples()) + " nipples.</b>");
				}
				_.forEach(player.breastRows, function(breastRow) { breastRow.nipplesPerBreast = 4; });
			} else if (player.breastRows.length > 1 && player.breastRows[1].nipplesPerBreast === 1) { //QUAD DAMAGE IF WEIRD SHIT BROKE BEFORE
				if (player.breastRows[1].nipplesPerBreast === 1) {
					MainView.outputText("\n\nYour second row of " + Descriptors.breastDescript(1) + " tingle and itch.  You pull back your " + player.armorName + " and watch in shock as your " + Descriptors.nippleDescript(1) + " split into four distinct nipples!  <b>You now have four nipples on each breast in your second row of breasts</b>.", false);
					player.breastRows[1].nipplesPerBreast = 4;
				}
			} else if (player.breastRows.length > 2 && player.breastRows[2].nipplesPerBreast === 1) {
				if (player.breastRows[2].nipplesPerBreast === 1) {
					MainView.outputText("\n\nYour third row of " + Descriptors.breastDescript(2) + " tingle and itch.  You pull back your " + player.armorName + " and watch in shock as your " + Descriptors.nippleDescript(2) + " split into four distinct nipples!  <b>You now have four nipples on each breast in your third row of breasts</b>.", false);
					player.breastRows[2].nipplesPerBreast = 4;
				}
			} else if (player.breastRows.length > 3 && player.breastRows[3].nipplesPerBreast === 1) {
				if (player.breastRows[3].nipplesPerBreast === 1) {
					MainView.outputText("\n\nYour fourth row of " + Descriptors.breastDescript(3) + " tingle and itch.  You pull back your " + player.armorName + " and watch in shock as your " + Descriptors.nippleDescript(3) + " split into four distinct nipples!  <b>You now have four nipples on each breast in your fourth row of breasts</b>.", false);
					player.breastRows[3].nipplesPerBreast = 4;
				}
			} else if (player.biggestLactation() > 1) {
				if ( Utils.rand(2) === 0) {
					MainView.outputText("\n\nA wave of pleasure passes through your chest as your " + Descriptors.breastDescript(0) + " start leaking milk from a massive jump in production.", false);
				} else {
					MainView.outputText("\n\nSomething shifts inside your " + Descriptors.breastDescript(0) + " and they feel MUCH fuller and riper.  You know that you've started producing much more milk.", false);
				}
				player.boostLactation(2.5);
				if ((player.nippleLength < 1.5 && tainted) || (!tainted && player.nippleLength < 1)) {
					MainView.outputText("  Your " + Descriptors.nippleDescript(0) + "s swell up, growing larger to accommodate your increased milk flow.", false);
					player.nippleLength += 0.25;
					EngineCore.dynStats("sen", 0.5);
				}
				changes++;
			}
		} else { //If breasts are already lactating and the player is not lactating beyond a reasonable level, they start lactating more:
			if (tainted && player.breastRows[0].lactationMultiplier > 1 && player.breastRows[0].lactationMultiplier < 5 && changes < changeLimit && ( Utils.rand(3) === 0 || enhanced)) {
				if ( Utils.rand(2) === 0) {
					MainView.outputText("\n\nA wave of pleasure passes through your chest as your " + Descriptors.breastDescript(0) + " start producing more milk.", false);
				} else {
					MainView.outputText("\n\nSomething shifts inside your " + Descriptors.breastDescript(0) + " and they feel fuller and riper.  You know that you've started producing more milk.", false);
				}
				player.boostLactation(0.75);
				if ((player.nippleLength < 1.5 && tainted) || (!tainted && player.nippleLength < 1)) {
					MainView.outputText("  Your " + Descriptors.nippleDescript(0) + "s swell up, growing larger to accommodate your increased milk flow.", false);
					player.nippleLength += 0.25;
					EngineCore.dynStats("sen", 0.5);
				}
				changes++;
			} else if (!tainted) {
				if (player.breastRows[0].lactationMultiplier > 1 && player.breastRows[0].lactationMultiplier < 3.2 && changes < changeLimit && Utils.rand(3) === 0) {
					if ( Utils.rand(2) === 0) {
						MainView.outputText("\n\nA wave of pleasure passes through your chest as your " + Descriptors.breastDescript(0) + " start producing more milk.", false);
					} else {
						MainView.outputText("\n\nSomething shifts inside your " + Descriptors.breastDescript(0) + " and they feel fuller and riper.  You know that you've started producing more milk.", false);
					}
					player.boostLactation(0.75);
					if ((player.nippleLength < 1.5 && tainted) || (!tainted && player.nippleLength < 1)) {
						MainView.outputText("  Your " + Descriptors.nippleDescript(0) + "s swell up, growing larger to accommodate your increased milk flow.", false);
						player.nippleLength += 0.25;
						EngineCore.dynStats("sen", 0.5);
					}
					changes++;
				}
				if ((player.breastRows[0].lactationMultiplier > 2 && player.findStatusAffect(StatusAffects.Feeder) >= 0) || player.breastRows[0].lactationMultiplier > 5) {
					if ( Utils.rand(2) === 0) {
						MainView.outputText("\n\nYour breasts suddenly feel less full, it seems you aren't lactating at quite the level you were.", false);
					} else {
						MainView.outputText("\n\nThe insides of your breasts suddenly feel bloated.  There is a spray of milk from them, and they settle closer to a more natural level of lactation.", false);
					}
					changes++;
					EngineCore.dynStats("sen", 0.5);
					player.boostLactation(-1);
				}
			}
		}
		//If breasts are lactating at a fair level
		//and the player has not received this status,
		//apply an effect where the player really wants
		//to give their milk to other creatures
		//(capable of getting them addicted):
		if (player.findStatusAffect(StatusAffects.Feeder) < 0 && player.biggestLactation() >= 3 && Utils.rand(2) === 0 && player.biggestTitSize() >= 5 && player.cor >= 35) {
			MainView.outputText("\n\nYou start to feel a strange desire to give your milk to other creatures.  For some reason, you know it will be very satisfying.\n\n<b>(You have gained the 'Feeder' perk!)</b>", false);
			player.createStatusAffect(StatusAffects.Feeder, 0, 0, 0, 0);
			player.createPerk(PerkLib.Feeder, 0, 0, 0, 0);
			changes++;
		}
		//UNFINISHED
		//If player has addictive quality and drinks pure version, removes addictive quality.
		//if the player has a vagina and it is tight, it loosens.
		if (player.hasVagina()) {
			if (player.vaginas[0].vaginalLooseness < AppearanceDefs.VAGINA_LOOSENESS_LOOSE && changes < changeLimit && Utils.rand(2) === 0) {
				MainView.outputText("\n\nYou feel a relaxing sensation in your groin.  On further inspection you discover your " + Descriptors.vaginaDescript(0) + " has somehow relaxed, permanently loosening.", false);
				player.vaginas[0].vaginalLooseness++;
				//Cunt Stretched used to determine how long since last enlargement
				if (player.findStatusAffect(StatusAffects.CuntStretched) < 0) {
					player.createStatusAffect(StatusAffects.CuntStretched, 0, 0, 0, 0);
				} else { //Reset the timer on it to 0 when restretched.
					player.changeStatusValue(StatusAffects.CuntStretched, 1, 0);
				}
				player.vaginas[0].vaginalLooseness++;
				changes++;
				EngineCore.dynStats("lus", 10);
			}
		}
		//General Appearance (Tail -> Ears -> Paws(fur stripper) -> Face -> Horns
		//Give the player a bovine tail, same as the minotaur
		if (tainted && player.tailType !== AppearanceDefs.TAIL_TYPE_COW && changes < changeLimit && Utils.rand(3) === 0) {
			if (player.tailType === AppearanceDefs.TAIL_TYPE_NONE) {
				MainView.outputText("\n\nYou feel the flesh above your " + Descriptors.buttDescript() + " knotting and growing.  It twists and writhes around itself before flopping straight down, now shaped into a distinctly bovine form.  You have a <b>cow tail</b>.", false);
			} else {
				if (player.tailType < AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN || player.tailType > AppearanceDefs.TAIL_TYPE_BEE_ABDOMEN) {
					MainView.outputText("\n\nYour tail bunches uncomfortably, twisting and writhing around itself before flopping straight down, now shaped into a distinctly bovine form.  You have a <b>cow tail</b>.", false);
				}else if (player.tailType === AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN || player.tailType === AppearanceDefs.TAIL_TYPE_BEE_ABDOMEN) {
					MainView.outputText("\n\nYour insect-like abdomen tingles pleasantly as it begins shrinking and softening, chitin morphing and reshaping until it looks exactly like a <b>cow tail</b>.", false);
				}
			}
			player.tailType = AppearanceDefs.TAIL_TYPE_COW;
			changes++;
		}
		//Give the player bovine ears, same as the minotaur
		if (tainted && player.earType !== AppearanceDefs.EARS_COW && changes < changeLimit && Utils.rand(4) === 0 && player.tailType === AppearanceDefs.TAIL_TYPE_COW) {
			MainView.outputText("\n\nYou feel your ears tug on your scalp as they twist shape, becoming oblong and cow-like.  <b>You now have cow ears.</b>", false);
			player.earType = AppearanceDefs.EARS_COW;
			changes++;
		}
		//If the player is under 7 feet in height, increase their height, similar to the minotaur
		if (((enhanced && player.tallness < 96) || player.tallness < 84) && changes < changeLimit && Utils.rand(2) === 0) {
			var tallnessChange = Utils.rand(5) + 3;
			//Slow rate of growth near ceiling
			if (player.tallness > 74) {
				tallnessChange = Math.floor(tallnessChange / 2);
			}
			//Never 0
			if (tallnessChange === 0) {
				tallnessChange = 1;
			}
			//Flavor texts.  Flavored like 1950's cigarettes. Yum.
			if (tallnessChange < 5) {
				MainView.outputText("\n\nYou shift uncomfortably as you realize you feel off balance.  Gazing down, you realize you have grown SLIGHTLY taller.", false);
			} else if (tallnessChange < 7) {
				MainView.outputText("\n\nYou feel dizzy and slightly off, but quickly realize it's due to a sudden increase in height.", false);
			} else {
				MainView.outputText("\n\nStaggering forwards, you clutch at your head dizzily.  You spend a moment getting your balance, and stand up, feeling noticeably taller.", false);
			}
			player.tallness += tallnessChange;
			changes++;
		}
		//Give the player hoofs, if the player already has hoofs STRIP FUR
		if (tainted && player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_HOOFED && player.earType === AppearanceDefs.EARS_COW) {
			if (changes < changeLimit && Utils.rand(3) === 0) {
				changes++;
				if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HUMAN) {
					MainView.outputText("\n\nYou stagger as your feet change, curling up into painful angry lumps of flesh.  They get tighter and tighter, harder and harder, until at last they solidify into hooves!", false);
				} else if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DOG) {
					MainView.outputText("\n\nYou stagger as your paws change, curling up into painful angry lumps of flesh.  They get tighter and tighter, harder and harder, until at last they solidify into hooves!", false);
				} else if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_NAGA) {
					MainView.outputText("\n\nYou collapse as your sinuous snake-tail tears in half, shifting into legs.  The pain is immense, particularly in your new feet as they curl inward and transform into hooves!", false);
				} else {
					MainView.outputText("\n\nYou stagger as your " + player.feet() + " change, curling up into painful angry lumps of flesh.  They get tighter and tighter, harder and harder, until at last they solidify into hooves!", false);
				}
				MainView.outputText("  A coat of beastial fur springs up below your waist, itching as it fills in.<b>  You now have hooves in place of your feet!</b>", false);
				player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HOOFED;
				EngineCore.dynStats("cor", 0);
				changes++;
			}
		}
		//If the player's face is non-human, they gain a human face
		if (!enhanced && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HOOFED && player.faceType !== AppearanceDefs.FACE_HUMAN && changes < changeLimit && Utils.rand(4) === 0) {
			//Remove face before fur!
			MainView.outputText("\n\nYour visage twists painfully, returning to a normal human shape.  <b>Your face is human again!</b>", false);
			player.faceType = AppearanceDefs.FACE_HUMAN;
			changes++;
		}
		//enhanced get shitty fur
		if (enhanced && (player.skinDesc !== "fur" || player.hairColor !== "black and white spotted")) {
			if (player.skinDesc !== "fur") {
				MainView.outputText("\n\nYour " + player.skinDesc + " itches intensely.  You scratch and scratch, but it doesn't bring any relief.  Fur erupts between your fingers, and you watch open-mouthed as it fills in over your whole body.  The fur is patterned in black and white, like that of a cow.  The color of it even spreads to your hair!  <b>You have cow fur!</b>", false);
			} else {
				MainView.outputText("\n\nA ripple spreads through your fur as some patches darken and others lighten.  After a few moments you're left with a black and white spotted pattern that goes the whole way up to the hair on your head!  <b>You've got cow fur!</b>", false);
			}
			player.skinDesc = "fur";
			player.skinAdj = "";
			player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
			player.hairColor = "black and white spotted";

		} else if (enhanced && player.faceType !== AppearanceDefs.FACE_COW_MINOTAUR) { //if enhanced to probova give a shitty cow face
			MainView.outputText("\n\nYour visage twists painfully, warping and crackling as your bones are molded into a new shape.  Once it finishes, you reach up to touch it, and you discover that <b>your face is like that of a cow!</b>", false);
			player.faceType = AppearanceDefs.FACE_COW_MINOTAUR;
			changes++;
		}
		//Give the player bovine horns, or increase their size, same as the minotaur
		//New horns or expanding mino horns
		if (tainted && changes < changeLimit && Utils.rand(3) === 0 && player.faceType === AppearanceDefs.FACE_HUMAN) {
			//Get bigger or change horns
			if (player.hornType === AppearanceDefs.HORNS_COW_MINOTAUR || player.hornType === AppearanceDefs.HORNS_NONE) {
				//Get bigger if player has horns
				if (player.hornType === AppearanceDefs.HORNS_COW_MINOTAUR) {
					if (player.horns < 5) {
						//Fems horns don't get bigger.
						MainView.outputText("\n\nYour small horns get a bit bigger, stopping as medium sized nubs.", false);
						player.horns += 1 + Utils.rand(2);
						changes++;
					}
				} else if (player.hornType === AppearanceDefs.HORNS_NONE || player.horns === 0) { //If no horns yet..
					MainView.outputText("\n\nWith painful pressure, the skin on your forehead splits around two tiny nub-like horns, similar to those you would see on the cattle back in your homeland.", false);
					player.hornType = AppearanceDefs.HORNS_COW_MINOTAUR;
					player.horns = 1;
					changes++;
				} else { //TF other horns
					MainView.outputText("\n\nYour horns twist, filling your skull with agonizing pain for a moment as they transform into cow-horns.", false);
					player.hornType = AppearanceDefs.HORNS_COW_MINOTAUR;
				}
			} else if (player.hornType === AppearanceDefs.HORNS_DEMON || player.hornType > AppearanceDefs.HORNS_COW_MINOTAUR) { //Not mino horns, change to cow-horns
				MainView.outputText("\n\nYour horns vibrate and shift as if made of clay, reforming into two small bovine nubs.", false);
				player.hornType = AppearanceDefs.HORNS_COW_MINOTAUR;
				player.horns = 2;
				changes++;
			}
		}
		//Increase the size of the player's hips, if they are not already childbearing or larger
		if ( Utils.rand(2) === 0 && player.hipRating < 15 && changes < changeLimit) {
			if (!tainted && player.hipRating < 8 || tainted) {
				MainView.outputText("\n\nYou stumble as you feel the bones in your hips grinding, expanding your hips noticeably.", false);
				player.hipRating += 1 + Utils.rand(4);
				changes++;
			}
		}
		if ( Utils.rand(4) === 0 && player.gills && changes < changeLimit) {
			MainView.outputText("\n\nYour chest itches, and as you reach up to scratch it, you realize your gills have withdrawn into your skin.", false);
			player.gills = false;
			changes++;
		}
		//Increase the size of the player's ass (less likely then hips), if it is not already somewhat big
		if ( Utils.rand(2) === 0 && player.buttRating < 13 && changes < changeLimit) {
			if (!tainted && player.buttRating < 8 || tainted) {
				MainView.outputText("\n\nA sensation of being unbalanced makes it difficult to walk.  You pause, paying careful attention to your new center of gravity before understanding dawns on you - your ass has grown!", false);
				player.buttRating += 1 + Utils.rand(2);
				changes++;
			}
		}
		//Nipples Turn Back:
		if (player.findStatusAffect(StatusAffects.BlackNipples) >= 0 && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nSomething invisible brushes against your " + Descriptors.nippleDescript(0) + ", making you twitch.  Undoing your clothes, you take a look at your chest and find that your nipples have turned back to their natural flesh colour.");
			changes++;
			player.removeStatusAffect(StatusAffects.BlackNipples);
		}
		//Debugcunt
		if (changes < changeLimit && Utils.rand(3) === 0 && player.vaginaType() === 5 && player.hasVagina()) {
			MainView.outputText("\n\nSomething invisible brushes against your sex, making you twinge.  Undoing your clothes, you take a look at your vagina and find that it has turned back to its natural flesh colour.");
			player.vaginaType(0);
			changes++;
		}
		if ( Utils.rand(3) === 0) {
			MainView.outputText(player.modFem(79, 3), false);
		}
		if ( Utils.rand(3) === 0) {
			MainView.outputText(player.modThickness(70, 4), false);
		}
		if ( Utils.rand(5) === 0) {
			MainView.outputText(player.modTone(10, 5), false);
		}
	};
	Mutations.blackSpellbook = function(player) {
		MainView.outputText("You open the small black book, and discover it to be an instructional book on the use of black magic.  Most of it is filled with generic information about black magic - how it is drawn from emotions (typically lust), and how it has the power to affect bodies and emotions.  It also warns against using it on oneself, as it is difficult to draw on your emotions while meddling with your own body.  In no time at all you've read the whole thing, but it disappears into thin air before you can put it away.", true);
		if (player.inte < 30) {
			MainView.outputText("\n\nYou feel greatly enlightened by your time spent reading.", false);
			EngineCore.dynStats("int", 4);
		} else if (player.inte < 60) {
			MainView.outputText("\n\nSpending some time reading was probably good for you, and you definitely feel smarter for it.", false);
			EngineCore.dynStats("int", 2);
		} else if (player.inte < 80) {
			MainView.outputText("\n\nAfter reading the small tome your already quick mind feels invigorated.", false);
			EngineCore.dynStats("int", 1);
		} else {
			MainView.outputText("\n\nThe contents of the book did little for your already considerable intellect.", false);
			EngineCore.dynStats("int", 0.6);
		}
		//Smart enough for arouse and doesnt have it
		if (player.inte >= 25 && player.findStatusAffect(StatusAffects.KnowsArouse) < 0) {
			MainView.outputText("\n\nYou blink in surprise, assaulted by the knowledge of a <b>new spell: Arouse.</b>", false);
			player.createStatusAffect(StatusAffects.KnowsArouse, 0, 0, 0, 0);
			return;
		}
		//Smart enough for arouse and doesnt have it
		if (player.inte >= 30 && player.findStatusAffect(StatusAffects.KnowsHeal) < 0) {
			MainView.outputText("\n\nYou blink in surprise, assaulted by the knowledge of a <b>new spell: Heal.</b>", false);
			player.createStatusAffect(StatusAffects.KnowsHeal, 0, 0, 0, 0);
			return;
		}
		//Smart enough for arouse and doesnt have it
		if (player.inte >= 40 && player.findStatusAffect(StatusAffects.KnowsMight) < 0) {
			MainView.outputText("\n\nYou blink in surprise, assaulted by the knowledge of a <b>new spell: Might.</b>", false);
			player.createStatusAffect(StatusAffects.KnowsMight, 0, 0, 0, 0);
		}
	};
	Mutations.whiteSpellbook = function(player) {
		MainView.outputText("You open the white tome, and discover it to be an instructional book on the use of white magic.  Most of it is filled with generic information about white magic - how it is drawn for mental focus, is difficult to use when tired or aroused, and can be used to create and control energy.  In no time at all you've read the whole thing, but it disappears into thin air before you can put it away.", true);
		if (player.inte < 30) {
			MainView.outputText("\n\nYou feel greatly enlightened by your time spent reading.", false);
			EngineCore.dynStats("int", 4);
		} else if (player.inte < 60) {
			MainView.outputText("\n\nSpending some time reading was probably good for you, and you definitely feel smarter for it.", false);
			EngineCore.dynStats("int", 2);
		} else if (player.inte < 80) {
			MainView.outputText("\n\nAfter reading the small tome your already quick mind feels invigorated.", false);
			EngineCore.dynStats("int", 1);
		} else {
			MainView.outputText("\n\nThe contents of the book did little for your already considerable intellect.", false);
			EngineCore.dynStats("int", 0.6);
		}
		//Smart enough for arouse and doesnt have it
		if (player.inte >= 25 && player.findStatusAffect(StatusAffects.KnowsCharge) < 0) {
			MainView.outputText("\n\nYou blink in surprise, assaulted by the knowledge of a <b>new spell: Charge Weapon.</b>", false);
			player.createStatusAffect(StatusAffects.KnowsCharge, 0, 0, 0, 0);
			return;
		}
		//Smart enough for arouse and doesnt have it
		if (player.inte >= 30 && player.findStatusAffect(StatusAffects.KnowsBlind) < 0) {
			MainView.outputText("\n\nYou blink in surprise, assaulted by the knowledge of a <b>new spell: Blind.</b>", false);
			player.createStatusAffect(StatusAffects.KnowsBlind, 0, 0, 0, 0);
			return;
		}
		//Smart enough for arouse and doesnt have it
		if (player.inte >= 40 && player.findStatusAffect(StatusAffects.KnowsWhitefire) < 0) {
			MainView.outputText("\n\nYou blink in surprise, assaulted by the knowledge of a <b>new spell: Whitefire.</b>", false);
			player.createStatusAffect(StatusAffects.KnowsWhitefire, 0, 0, 0, 0);
		}
	};
	Mutations.lustDraft = function(fuck, player) {
		player.slimeFeed();
		MainView.outputText("You drink the ", true);
		if (fuck) {
			MainView.outputText("red", false);
		} else {
			MainView.outputText("pink", false);
		}
		MainView.outputText(" potion, and its unnatural warmth immediately flows to your groin.", false);
		EngineCore.dynStats("lus", (30 + Utils.rand(player.lib / 10)), "resisted", false);
		//Heat/Rut for those that can have them if "fuck draft"
		if (fuck) {
			//Try to go into intense heat.
			player.goIntoHeat(true, 2);
			//Males go into rut
			player.goIntoRut(true);
		}
		//ORGAZMO
		if (player.lust >= 100 && !CoC.isInCombat()) {
			MainView.outputText("\n\nThe arousal from the potion overwhelms your senses and causes you to spontaneously orgasm.  You rip off your " + player.armorName + " and look down as your ", false);
			if (player.cocks.length > 0) {
				MainView.outputText(Descriptors.multiCockDescriptLight() + " erupts in front of you, liberally spraying the ground around you.  ", false);
			}
			if (player.cocks.length > 0 && player.vaginas.length > 0) {
				MainView.outputText("At the same time your ", false);
			}
			if (player.vaginas.length > 0) {
				MainView.outputText(Descriptors.vaginaDescript(0) + " soaks your thighs.  ", false);
			}
			if (player.gender === 0) {
				MainView.outputText("body begins to quiver with orgasmic bliss.  ", false);
			}
			MainView.outputText("Once you've had a chance to calm down, you notice that the explosion of pleasure you just experienced has rocked you to your core.  You are a little hornier than you were before.", false);
			//increase player libido, and maybe sensitivity too?
			player.orgasm();
			EngineCore.dynStats("lib", 2, "sen", 1);
		}
		if (player.lust > 100) {
			player.lust = 100;
		}
		MainView.outputText("\n\n", false);
	};
	Mutations.goblinAle = function(player) {
		player.slimeFeed();
		var changes = 0;
		var changeLimit = 1;
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(3) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(4) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(5) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		MainView.outputText("You drink the ale, finding it to have a remarkably smooth yet potent taste.  You lick your lips and sneeze, feeling slightly tipsy.", true);
		EngineCore.dynStats("lus", 15);
		//Stronger
		if (player.str > 50) {
			EngineCore.dynStats("str", -1);
			if (player.str > 70) {
				EngineCore.dynStats("str", -1);
			}
			if (player.str > 90) {
				EngineCore.dynStats("str", -2);
			}
			MainView.outputText("\n\nYou feel a little weaker, but maybe it's just the alcohol.", false);
		}
		// Less tough
		if (player.tou > 50) {
			MainView.outputText("\n\nGiggling, you poke yourself, which only makes you giggle harder when you realize how much softer you feel.", false);
			EngineCore.dynStats("tou", -1);
			if (player.tou > 70) {
				EngineCore.dynStats("tou", -1);
			}
			if (player.tou > 90) {
				EngineCore.dynStats("tou", -2);
			}
		}
		//antianemone corollary:
		if (changes < changeLimit && player.hairType === 4 && Utils.rand(2) === 0) {
			//-insert anemone hair removal into them under whatever criteria you like, though hair removal should precede abdomen growth; here's some sample text:
			MainView.outputText("\n\nAs you down the potent ale, your head begins to feel heavier - and not just from the alcohol!  Reaching up, you notice your tentacles becoming soft and somewhat fibrous.  Pulling one down reveals that it feels smooth, silky, and fibrous; you watch as it dissolves into many thin, hair-like strands.  <b>Your hair is now back to normal!</b>", false);
			player.hairType = 0;
			changes++;
		}
		//Shrink
		if ( Utils.rand(2) === 0 && player.tallness > 48) {
			changes++;
			MainView.outputText("\n\nThe world spins, and not just from the strength of the drink!  Your viewpoint is closer to the ground.  How fun!", false);
			player.tallness -= (1 + Utils.rand(5));
		}
		//Speed boost
		if ( Utils.rand(3) === 0 && player.spe < 50 && changes < changeLimit) {
			EngineCore.dynStats("spe", 1 + Utils.rand(2));
			MainView.outputText("\n\nYou feel like dancing, and stumble as your legs react more quickly than you'd think.  Is the alcohol slowing you down or are you really faster?  You take a step and nearly faceplant as you go off balance.  It's definitely both.", false);
			changes++;
		}
		//-Remove feather-arms (copy this for goblin ale, mino blood, equinum, canine pepps, demon items)
		if (changes < changeLimit && player.armType === AppearanceDefs.ARM_TYPE_HARPY && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYou scratch at your biceps absentmindedly, but no matter how much you scratch, it isn't getting rid of the itch.  Glancing down in irritation, you discover that your feathery arms are shedding their feathery coating.  The wing-like shape your arms once had is gone in a matter of moments, leaving " + player.skinDesc + " behind.", false);
			player.armType = AppearanceDefs.ARM_TYPE_HUMAN;
			changes++;
		}
		//-Remove chitin-arms (copy this for goblin ale, mino blood, equinum, canine pepps, demon items)
		if (changes < changeLimit && player.armType === AppearanceDefs.ARM_TYPE_SPIDER && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYou scratch at your biceps absentmindedly, but no matter how much you scratch, it isn't getting rid of the itch.  Glancing down in irritation, you discover that your arms' chitinous covering is flaking away.  The glossy black coating is soon gone, leaving " + player.skinDesc + " behind.", false);
			player.armType = AppearanceDefs.ARM_TYPE_HUMAN;
			changes++;
		}
		//SEXYTIEMS
		//Multidick killa!
		if (player.cocks.length > 1 && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\n", false);
			player.killCocks(1);
			changes++;
		}
		//Boost vaginal capacity without gaping
		if (changes < changeLimit && Utils.rand(3) === 0 && player.hasVagina() && player.statusAffectv1(StatusAffects.BonusVCapacity) < 40) {
			if (player.findStatusAffect(StatusAffects.BonusVCapacity) < 0) {
				player.createStatusAffect(StatusAffects.BonusVCapacity, 0, 0, 0, 0);
			}
			player.addStatusValue(StatusAffects.BonusVCapacity, 1, 5);
			MainView.outputText("\n\nThere is a sudden... emptiness within your " + Descriptors.vaginaDescript(0) + ".  Somehow you know you could accommodate even larger... insertions.", false);
			changes++;
		}
		//Boost fertility
		if (changes < changeLimit && Utils.rand(4) === 0 && player.fertility < 40 && player.hasVagina()) {
			player.fertility += 2 + Utils.rand(5);
			changes++;
			MainView.outputText("\n\nYou feel strange.  Fertile... somehow.  You don't know how else to think of it, but you're ready to be a mother.", false);
		} else if (player.cocks.length === 1 && Utils.rand(2) === 0 && changes < changeLimit && !CoC.flags[kFLAGS.HYPER_HAPPY]) { //Shrink primary dick to no longer than 12 inches
			if (player.cocks[0].cockLength > 12) {
				changes++;
				var lengthChange = 0;
				MainView.outputText("\n\n", false);
				//Shrink said cock
				if (player.cocks[0].cockLength < 6 && player.cocks[0].cockLength >= 2.9) {
					player.cocks[0].cockLength -= 0.5;
					lengthChange -= 0.5;
				}
				lengthChange += player.increaseCock(0, ( Utils.rand(3) + 1) * -1);
				player.lengthChange(lengthChange, 1);
			}
		}
		//GENERAL APPEARANCE STUFF BELOW
		//REMOVAL STUFF
		//Removes wings and antennaes!
		if ((player.wingType === AppearanceDefs.WING_TYPE_BEE_LIKE_SMALL || player.wingType === AppearanceDefs.WING_TYPE_BEE_LIKE_LARGE || player.wingType >= AppearanceDefs.WING_TYPE_HARPY) && changes < changeLimit && Utils.rand(4) === 0) {
			if (player.wingType === AppearanceDefs.WING_TYPE_SHARK_FIN) {
				MainView.outputText("\n\nYour back tingles, feeling lighter.  Something lands behind you with a 'thump', and when you turn to look, you see your fin has fallen off.  This might be the best (and worst) booze you've ever had!  <b>You no longer have a fin!</b>", false);
			} else {
				MainView.outputText("\n\nYour shoulders tingle, feeling lighter.  Something lands behind you with a 'thump', and when you turn to look you see your wings have fallen off.  This might be the best (and worst) booze you've ever had!  <b>You no longer have wings!</b>", false);
			}
			player.wingType = AppearanceDefs.WING_TYPE_NONE;
			changes++;
		}
		//Removes wings and antennaes!
		if (player.antennae > AppearanceDefs.ANTENNAE_NONE && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nYour " + Descriptors.hairDescript() + " itches so you give it a scratch, only to have your antennae fall to the ground.  What a relief.  <b>You've lost your antennae!</b>", false);
			changes++;
			player.antennae = AppearanceDefs.ANTENNAE_NONE;
		}
		//Remove odd eyes
		if (changes < changeLimit && Utils.rand(5) === 0 && player.eyeType > AppearanceDefs.EYES_HUMAN) {
			if (player.eyeType === AppearanceDefs.EYES_BLACK_EYES_SAND_TRAP) {
				MainView.outputText("\n\nYou feel a twinge in your eyes and you blink.  It feels like black cataracts have just fallen away from you, and you know without needing to see your reflection that your eyes have gone back to looking human.");
			} else {
				MainView.outputText("\n\nYou blink and stumble, a wave of vertigo threatening to pull your " + player.feet() + " from under you.  As you steady and open your eyes, you realize something seems different.  Your vision is changed somehow.", false);
				if (player.eyeType === AppearanceDefs.EYES_FOUR_SPIDER_EYES) {
					MainView.outputText("  Your multiple, arachnid eyes are gone!</b>", false);
				}
				MainView.outputText("  <b>You have normal, humanoid eyes again.</b>", false);
			}
			player.eyeType = AppearanceDefs.EYES_HUMAN;
			changes++;
		}
		//-Remove extra breast rows
		if (changes < changeLimit && player.bRows() > 1 && Utils.rand(3) === 0) {
			changes++;
			MainView.outputText("\n\nYou stumble back when your center of balance shifts, and though you adjust before you can fall over, you're left to watch in awe as your bottom-most " + Descriptors.breastDescript(player.breastRows.length - 1) + " shrink down, disappearing completely into your ", false);
			if (player.bRows() >= 3) {
				MainView.outputText("abdomen", false);
			} else {
				MainView.outputText("chest", false);
			}
			MainView.outputText(". The " + Descriptors.nippleDescript(player.breastRows.length - 1) + "s even fade until nothing but ", false);
			if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
				MainView.outputText(player.hairColor + " " + player.skinDesc, false);
			} else {
				MainView.outputText(player.skinTone + " " + player.skinDesc, false);
			}
			MainView.outputText(" remains. <b>You've lost a row of breasts!</b>", false);
			EngineCore.dynStats("sen", -5);
			player.removeBreastRow(player.breastRows.length - 1, 1);
		}
		//Skin/fur
		if (player.skinType !== AppearanceDefs.SKIN_TYPE_PLAIN && changes < changeLimit && Utils.rand(4) === 0 && player.faceType === AppearanceDefs.FACE_HUMAN) {
			if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
				MainView.outputText("\n\nYour fur itches incessantly, so you start scratching it.  It starts coming off in big clumps before the whole mess begins sloughing off your body.  In seconds, your skin is nude.  <b>You've lost your fur!</b>", false);
			} else if (player.skinType === AppearanceDefs.SKIN_TYPE_SCALES) {
				MainView.outputText("\n\nYour scales itch incessantly, so you scratch at them.  They start falling off wholesale, leaving you standing in a pile of scales after only a few moments.  <b>You've lost your scales!</b>", false);
			} else if (player.skinType > AppearanceDefs.SKIN_TYPE_SCALES) {
				MainView.outputText("\n\nYour " + player.skinDesc + " itches incessantly, and as you scratch it shifts and changes, becoming normal human-like skin.  <b>Your skin is once again normal!</b>", false);
			}
			player.skinAdj = "";
			player.skinDesc = "skin";
			player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
			changes++;
		}
		//skinTone
		if (player.skinTone !== "green" && player.skinTone !== "grayish-blue" && player.skinTone !== "dark green" && player.skinTone !== "pale yellow" && changes < changeLimit && Utils.rand(2) === 0) {
			if ( Utils.rand(10) !== 0) {
				player.skinTone = "dark green";
			} else {
				player.skinTone = Utils.randomChoice("pale yellow", "grayish-blue");
			}
			changes++;
			MainView.outputText("\n\nWhoah, that was weird.  You just hallucinated that your ", false);
			if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
				MainView.outputText("skin", false);
			} else {
				MainView.outputText(player.skinDesc, false);
			}
			MainView.outputText(" turned " + player.skinTone + ".  No way!  It's staying, it really changed color!", false);
		}
		//Face!
		if (player.faceType !== AppearanceDefs.FACE_HUMAN && changes < changeLimit && Utils.rand(4) === 0 && player.earType === AppearanceDefs.EARS_ELFIN) {
			changes++;
			player.faceType = AppearanceDefs.FACE_HUMAN;
			MainView.outputText("\n\nAnother violent sneeze escapes you.  It hurt!  You feel your nose and discover your face has changed back into a more normal look.  <b>You have a human looking face again!</b>", false);
		}
		//Ears!
		if (player.earType !== AppearanceDefs.EARS_ELFIN && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nA weird tingling runs through your scalp as your " + Descriptors.hairDescript() + " shifts slightly.  You reach up to touch and bump <b>your new pointed elfin ears</b>.  You bet they look cute!", false);
			changes++;
			player.earType = AppearanceDefs.EARS_ELFIN;
		}
		if ( Utils.rand(4) === 0 && player.gills && changes < changeLimit) {
			MainView.outputText("\n\nYour chest itches, and as you reach up to scratch it, you realize your gills have withdrawn into your skin.", false);
			player.gills = false;
			changes++;
		}
		//Nipples Turn Back:
		if (player.findStatusAffect(StatusAffects.BlackNipples) >= 0 && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nSomething invisible brushes against your " + Descriptors.nippleDescript(0) + ", making you twitch.  Undoing your clothes, you take a look at your chest and find that your nipples have turned back to their natural flesh colour.");
			changes++;
			player.removeStatusAffect(StatusAffects.BlackNipples);
		}
		//Debugcunt
		if (changes < changeLimit && Utils.rand(3) === 0 && player.vaginaType() === 5 && player.hasVagina()) {
			MainView.outputText("\n\nSomething invisible brushes against your sex, making you twinge.  Undoing your clothes, you take a look at your vagina and find that it has turned back to its natural flesh colour.");
			player.vaginaType(0);
			changes++;
		}
		if (changes < changeLimit && Utils.rand(4) === 0 && ((player.ass.analWetness > 0 && player.findPerk(PerkLib.MaraesGiftButtslut) < 0) || player.ass.analWetness > 1)) {
			MainView.outputText("\n\nYou feel a tightening up in your colon and your [asshole] sucks into itself.  You feel sharp pain at first but that thankfully fades.  Your ass seems to have dried and tightened up.");
			player.ass.analWetness--;
			if (player.ass.analLooseness > 1) {
				player.ass.analLooseness--;
			}
			changes++;
		}
		if (changes < changeLimit && Utils.rand(3) === 0) {
			if ( Utils.rand(2) === 0) {
				player.modFem(85, 3);
			}
			if ( Utils.rand(2) === 0) {
				player.modThickness(20, 3);
			}
			if ( Utils.rand(2) === 0) {
				player.modTone(15, 5);
			}
		}
	};
	Mutations.gooGasmic = function(player) {
		MainView.outputText("You take the wet cloth in hand and rub it over your body, smearing the strange slime over your " + player.skinDesc + " slowly.", true);
		//Stat changes
		//libido up to 80
		if (player.lib < 80) {
			EngineCore.dynStats("lib", ( 0.5 + (90 - player.lib) / 10 ), "lus", player.lib / 2);
			MainView.outputText("\n\nBlushing and feeling horny, you make sure to rub it over your chest and erect nipples, letting the strange slimy fluid soak into you.", false);
		}
		//sensitivity moves towards 50
		if (player.sens < 50) {
			MainView.outputText("\n\nThe slippery slime soaks into your " + player.skinDesc + ", making it tingle with warmth, sensitive to every touch.", false);
			EngineCore.dynStats("sen", 1);
		} else if (player.sens > 50) {
			MainView.outputText("\n\nThe slippery slime numbs your " + player.skinDesc + " slightly, leaving behind only gentle warmth.", false);
			EngineCore.dynStats("sen", -1);
		}
		//Cosmetic changes based on 'goopyness'
		//Remove wings
		if (player.wingType > AppearanceDefs.WING_TYPE_NONE) {
			if (player.wingType === AppearanceDefs.WING_TYPE_SHARK_FIN) {
				MainView.outputText("\n\nYou sigh, feeling a hot wet tingling down your back.  It tickles slightly as you feel your fin slowly turn to sludge, dripping to the ground as your body becomes more goo-like.", false);
			} else {
				MainView.outputText("\n\nYou sigh, feeling a hot wet tingling down your back.  It tickles slightly as you feel your wings slowly turn to sludge, dripping to the ground as your body becomes more goo-like.", false);
			}
			player.wingType = AppearanceDefs.WING_TYPE_NONE;
			return;
		}
		//Goopy hair
		if (player.hairType !== 3) {
			player.hairType = 3;
			//if bald
			if (player.hairLength <= 0) {
				MainView.outputText("\n\nYour head buzzes pleasantly, feeling suddenly hot and wet.  You instinctively reach up to feel the source of your wetness, and discover you've grown some kind of gooey hair.  From time to time it drips, running down your back to the crack of your " + Descriptors.buttDescript() + ".", false);
				player.hairLength = 5;
			} else {
				//if hair isnt rubbery or latexy
				if (player.hairColor.indexOf("rubbery") === -1 && player.hairColor.indexOf("latex-textured") === -1) {
					MainView.outputText("\n\nYour head buzzes pleasantly, feeling suddenly hot and wet.  You instinctively reach up to feel the source of your wetness, and discover your hair has become a slippery, gooey mess.  From time to time it drips, running down your back to the crack of your " + Descriptors.buttDescript() + ".", false);
				} else { //Latexy stuff
					MainView.outputText("\n\nYour oddly inorganic hair shifts, becoming partly molten as rivulets of liquid material roll down your back.  How strange.", false);
				}
			}
			if (player.hairColor !== "green" && player.hairColor !== "purple" && player.hairColor !== "blue" && player.hairColor !== "cerulean" && player.hairColor !== "emerald") {
				MainView.outputText("  Stranger still, the hue of your semi-liquid hair changes to ");
				var newHairColor = Utils.rand(10);
				if (newHairColor <= 2) {
					player.hairColor = "green";
				} else if (newHairColor <= 4) {
					player.hairColor = "purple";
				} else if (newHairColor <= 6) {
					player.hairColor = "blue";
				} else if (newHairColor <= 8) {
					player.hairColor = "cerulean";
				} else {
					player.hairColor = "emerald";
				}
				MainView.outputText(player.hairColor + ".");
			}
			EngineCore.dynStats("lus", 10);
			return;
		} else if(player.skinDesc !== "skin" || player.skinAdj !== "slimy") { //1.Goopy skin
			if (player.skinType === AppearanceDefs.SKIN_TYPE_PLAIN) {
				MainView.outputText("\n\nYou sigh, feeling your " + player.armorName + " sink into you as your skin becomes less solid, gooey even.  You realize your entire body has become semi-solid and partly liquid!", false);
			} else if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
				MainView.outputText("\n\nYou sigh, suddenly feeling your fur become hot and wet.  You look down as your " + player.armorName + " sinks partway into you.  With a start you realize your fur has melted away, melding into the slime-like coating that now serves as your skin.  You've become partly liquid and incredibly gooey!", false);
			} else if (player.skinType === AppearanceDefs.SKIN_TYPE_SCALES) {
				MainView.outputText("\n\nYou sigh, feeling slippery wetness over your scales.  You reach to scratch it and come away with a slippery wet coating.  Your scales have transformed into a slimy goop!  Looking closer, you realize your entire body has become far more liquid in nature, and is semi-solid.  Your " + player.armorName + " has even sunk partway into you.", false);
			} else if (player.skinType > AppearanceDefs.SKIN_TYPE_GOO) {
				MainView.outputText("\n\nYou sigh, feeling your " + player.armorName + " sink into you as your " + player.skinDesc + " becomes less solid, gooey even.  You realize your entire body has become semi-solid and partly liquid!", false);
			}
			player.skinType = AppearanceDefs.SKIN_TYPE_GOO;
			player.skinDesc = "skin";
			player.skinAdj = "slimy";
			if (player.skinTone !== "green" && player.skinTone !== "purple" && player.skinTone !== "blue" && player.skinTone !== "cerulean" && player.skinTone !== "emerald") {
				MainView.outputText("  Stranger still, your skintone changes to ");
				var newSkinTone = Utils.rand(10);
				if (newSkinTone <= 2) {
					player.skinTone = "green";
				} else if (newSkinTone <= 4) {
					player.skinTone = "purple";
				} else if (newSkinTone <= 6) {
					player.skinTone = "blue";
				} else if (newSkinTone <= 8) {
					player.skinTone = "cerulean";
				} else {
					player.skinTone = "emerald";
				}
				MainView.outputText(player.skinTone + "!");
			}
			return;
		}
		////1a.Make alterations to dick/vaginal/nippular descriptors to match
		//DONE EXCEPT FOR TITS & MULTIDICKS (UNFINISHED KINDA)
		//2.Goo legs
		if (player.skinAdj === "slimy" && player.skinDesc === "skin" && player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_GOO) {
			MainView.outputText("\n\nYour viewpoint rapidly drops as everything below your " + Descriptors.buttDescript() + " and groin melts together into an amorphous blob.  Thankfully, you discover you can still roll about on your new slimey undercarriage, but it's still a whole new level of strange.", false);
			player.tallness -= 3 + Utils.rand(2);
			if (player.tallness < 36) {
				player.tallness = 36;
				MainView.outputText("  The goo firms up and you return to your previous height.  It would truly be hard to get any shorter than you already are!", false);
			}
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_GOO;
			return;
		}
		//3a. Grow vagina if none
		if (!player.hasVagina()) {
			MainView.outputText("\n\nA wet warmth spreads through your slimey groin as a narrow gash appears on the surface of your groin.  <b>You have grown a vagina.</b>", false);
			player.createVagina();
			player.vaginas[0].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_DROOLING;
			player.vaginas[0].vaginalLooseness = AppearanceDefs.VAGINA_LOOSENESS_GAPING;
			player.clitLength = 0.4;
			player.genderCheck();
			return;

		}
		//3b.Infinite Vagina
		if (player.vaginalCapacity() < 9000) {
			if (player.findStatusAffect(StatusAffects.BonusVCapacity) < 0) {
				player.createStatusAffect(StatusAffects.BonusVCapacity, 9000, 0, 0, 0);
			} else {
				player.addStatusValue(StatusAffects.BonusVCapacity, 1, 9000);
			}
			MainView.outputText("\n\nYour " + Descriptors.vaginaDescript(0) + "'s internal walls feel a tingly wave of strange tightness.  Experimentally, you slip a few fingers, then your hand, then most of your forearm inside yourself.  <b>It seems you're now able to accommodate just about ANYTHING inside your sex.</b>", false);
			return;
		} else if (player.tallness < 100 && Utils.rand(3) <= 1) {
			MainView.outputText("\n\nYour gel-like body swells up from the intake of additional slime.  If you had to guess, you'd bet you were about two inches taller.", false);
			player.tallness += 2;
			EngineCore.dynStats("str", 1, "tou", 1);
		} else { //Big slime girl
			if (player.findStatusAffect(StatusAffects.SlimeCraving) < 0) {
				MainView.outputText("\n\nYou feel a growing gnawing in your gut.  You feel... hungry, but not for food.  No, you need something wet and goopy pumped into you.  You NEED it.  You can feel it in your bones.  <b>If you don't feed that need... you'll get weaker and maybe die.</b>", false);
				player.createStatusAffect(StatusAffects.SlimeCraving, 0, 0, 0, 1); //Value four indicates this tracks strength and speed separately
			} else {
				MainView.outputText("\n\nYou feel full for a moment, but you know it's just a temporary respite from your constant need to be 'injected' with fluid.", false);
				player.changeStatusValue(StatusAffects.SlimeCraving, 1, 0);
			}
		}
		if ( Utils.rand(2) === 0) {
			MainView.outputText(player.modFem(85, 3), false);
		}
		if ( Utils.rand(2) === 0) {
			MainView.outputText(player.modThickness(20, 3), false);
		}
		if ( Utils.rand(2) === 0) {
			MainView.outputText(player.modTone(15, 5), false);
		}
	};
	Mutations.sharkTooth = function(type, player) {
		var changes = 0;
		var changeLimit = 2;
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		if (type === 0) {
			MainView.outputText("You have no idea why, but you decide to eat the pointed tooth. To your surprise, it's actually quite brittle, turning into a fishy-tasting dust. You figure it must just be a tablet made to look like a shark's tooth.", true);
		} else if (type === 1) {
			MainView.outputText("You have no idea why, but you decide to eat the pointed, glowing tooth. To your surprise, it's actually quite brittle, crumbling into a fishy-tasting dust. Maybe it's just a tablet made to look like a shark's tooth.", true);
		}
		//STATS
		//Increase strength 1-2 points (Up to 50) (60 for tiger)
		if (((player.str < 60 && type === 1) || player.str < 50) && Utils.rand(3) === 0) {
			EngineCore.dynStats("str", 1 + Utils.rand(2));
			MainView.outputText("\n\nA painful ripple passes through the muscles of your body.  It takes you a few moments, but you quickly realize you're a little bit stronger now.", false);
			changes++;
		}
		//Increase Speed 1-3 points (Up to 75) (100 for tigers)
		if (((player.spe < 100 && type === 1) || player.spe < 75) && Utils.rand(3) === 0) {
			EngineCore.dynStats("spe", 1 + Utils.rand(3));
			changes++;
			MainView.outputText("\n\nShivering without warning, you nearly trip over yourself as you walk.  A few tries later you realize your muscles have become faster.", false);
		}
		//Reduce sensitivity 1-3 Points (Down to 25 points)
		if (player.sens > 25 && Utils.rand(1.5) === 0 && changes < changeLimit) {
			EngineCore.dynStats("sen", (-1 - Utils.rand(3)));
			changes++;
			MainView.outputText("\n\nIt takes a while, but you eventually realize your body has become less sensitive.", false);
		}
		//Increase Libido 2-4 points (Up to 75 points) (100 for tigers)
		if (((player.lib < 100 && type === 1) || player.lib < 75) && Utils.rand(3) === 0 && changes < changeLimit) {
			EngineCore.dynStats("lib", (1 + Utils.rand(3)));
			changes++;
			MainView.outputText("\n\nA blush of red works its way across your skin as your sex drive kicks up a notch.", false);
		}
		//Decrease intellect 1-3 points (Down to 40 points)
		if (player.inte > 40 && Utils.rand(3) === 0 && changes < changeLimit) {
			EngineCore.dynStats("int", -(1 + Utils.rand(3)));
			changes++;
			MainView.outputText("\n\nYou shake your head and struggle to gather your thoughts, feeling a bit slow.", false);
		}
		//Smexual stuff!
		//-TIGGERSHARK ONLY: Grow a cunt (guaranteed if no gender)
		if (type === 1 && (player.gender === 0 || (!player.hasVagina() && changes < changeLimit && Utils.rand(3) === 0))) {
			changes++;
			//(balls)
			if (player.balls > 0) {
				MainView.outputText("\n\nAn itch starts behind your " + Descriptors.ballsDescriptLight() + ", but before you can reach under to scratch it, the discomfort fades. A moment later a warm, wet feeling brushes your " + Descriptors.sackDescript() + ", and curious about the sensation, <b>you lift up your balls to reveal your new vagina.</b>", false);
			} else if (player.hasCock()) { //(dick)
				MainView.outputText("\n\nAn itch starts on your groin, just below your " + Descriptors.multiCockDescriptLight() + ". You pull the manhood aside to give you a better view, and you're able to watch as <b>your skin splits to give you a new vagina, complete with a tiny clit.</b>", false);
			} else { //(neither)
				MainView.outputText("\n\nAn itch starts on your groin and fades before you can take action. Curious about the intermittent sensation, <b>you peek under your " + player.armorName + " to discover your brand new vagina, complete with pussy lips and a tiny clit.</b>", false);
			}
			player.createVagina();
			player.clitLength = 0.25;
			EngineCore.dynStats("sen", 10);
			player.genderCheck();
		}
		//WANG GROWTH - TIGGERSHARK ONLY
		if (type === 1 && (!player.hasCock()) && changes < changeLimit && Utils.rand(3) === 0) {
			//Genderless:
			if (!player.hasVagina()) {
				MainView.outputText("\n\nYou feel a sudden stabbing pain in your featureless crotch and bend over, moaning in agony. Your hands clasp protectively over the surface - which is swelling in an alarming fashion under your fingers! Stripping off your clothes, you are presented with the shocking site of once-smooth flesh swelling and flowing like self-animate clay, resculpting itself into the form of male genitalia! When the pain dies down, you are the proud owner of a new human-shaped penis", false);
			} else { //Female:
				MainView.outputText("\n\nYou feel a sudden stabbing pain just above your " + Descriptors.vaginaDescript() + " and bend over, moaning in agony. Your hands clasp protectively over the surface - which is swelling in an alarming fashion under your fingers! Stripping off your clothes, you are presented with the shocking site of once-smooth flesh swelling and flowing like self-animate clay, resculpting itself into the form of male genitalia! When the pain dies down, you are the proud owner of not only a " + Descriptors.vaginaDescript() + ", but a new human-shaped penis", false);
			}
			if (player.balls === 0) {
				MainView.outputText(" and a pair of balls", false);
				player.balls = 2;
				player.ballSize = 2;
			}
			MainView.outputText("!", false);
			player.createCock(7, 1.4);
			EngineCore.dynStats("lib", 4, "sen", 5, "lus", 20);
			player.genderCheck();
			changes++;
		}
		//(Requires the player having two testicles)
		if (type === 1 && (player.balls === 0 || player.balls === 2) && player.hasCock() && changes < changeLimit && Utils.rand(3) === 0) {
			if (player.balls === 2) {
				MainView.outputText("\n\nYou gasp in shock as a sudden pain racks your abdomen. Within seconds, two more testes drop down into your " + Descriptors.sackDescript() + ", your skin stretching out to accommodate them. Once the pain clears, you examine <b>your new quartet of testes.</b>", false);
				player.balls = 4;
			} else if (player.balls === 0) {
				MainView.outputText("\n\nYou gasp in shock as a sudden pain racks your abdomen. Within seconds, two balls drop down into a new sack, your skin stretching out to accommodate them. Once the pain clears, you examine <b>your new pair of testes.</b>", false);
				player.balls = 2;
				player.ballSize = 2;
			}
			EngineCore.dynStats("lib", 2, "sen", 3, "lus", 10);
			changes++;
		}
		//Transformations:
		//Mouth TF
		if (player.faceType !== AppearanceDefs.FACE_SHARK_TEETH && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\n", false);
			if (player.faceType > AppearanceDefs.FACE_HUMAN && player.faceType < AppearanceDefs.FACE_SHARK_TEETH) {
				MainView.outputText("Your " + player.face() + " explodes with agony, reshaping into a more human-like visage.  ", false);
			}
			player.faceType = AppearanceDefs.FACE_SHARK_TEETH;
			MainView.outputText("You firmly grasp your mouth, an intense pain racking your oral cavity. Your gums shift around and the bones in your jaw reset. You blink a few times wondering what just happened. You move over to a puddle to catch sight of your reflection, and you are thoroughly surprised by what you see. A set of retractable shark fangs have grown in front of your normal teeth, and your face has elongated slightly to accommodate them!  They even scare you a little.\n(Gain: 'Bite' special attack)", false);
			changes++;
		}
		//Remove odd eyes
		if (changes < changeLimit && Utils.rand(5) === 0 && player.eyeType > AppearanceDefs.EYES_HUMAN) {
			if (player.eyeType === AppearanceDefs.EYES_BLACK_EYES_SAND_TRAP) {
				MainView.outputText("\n\nYou feel a twinge in your eyes and you blink.  It feels like black cataracts have just fallen away from you, and you know without needing to see your reflection that your eyes have gone back to looking human.");
			} else {
				MainView.outputText("\n\nYou blink and stumble, a wave of vertigo threatening to pull your " + player.feet() + " from under you.  As you steady and open your eyes, you realize something seems different.  Your vision is changed somehow.", false);
				if (player.eyeType === AppearanceDefs.EYES_FOUR_SPIDER_EYES) {
					MainView.outputText("  Your multiple, arachnid eyes are gone!</b>", false);
				}
				MainView.outputText("  <b>You have normal, humanoid eyes again.</b>", false);
			}
			player.eyeType = AppearanceDefs.EYES_HUMAN;
			changes++;
		}
		//Tail TF
		if (player.tailType !== AppearanceDefs.TAIL_TYPE_SHARK && Utils.rand(3) === 0 && changes < changeLimit) {
			changes++;
			if (player.tailType === AppearanceDefs.TAIL_TYPE_NONE) {
				MainView.outputText("\n\nJets of pain shoot down your spine, causing you to gasp in surprise and fall to your hands and knees. Feeling a bulging at the end of your back, you lower your " + player.armorName + " down just in time for a fully formed shark tail to burst through. You swish it around a few times, surprised by how flexible it is. After some modifications to your clothing, you're ready to go with your brand new shark tail.", false);
			} else {
				MainView.outputText("\n\nJets of pain shoot down your spine into your tail.  You feel the tail bulging out until it explodes into a large and flexible shark-tail.  You swish it about experimentally, and find it quite easy to control.", false);
			}
			player.tailType = AppearanceDefs.TAIL_TYPE_SHARK;
		}
		//Hair
		if (player.hairColor !== "silver" && Utils.rand(4) === 0 && changes < changeLimit) {
			changes++;
			MainView.outputText("\n\nYou feel a tingling in your scalp and reach up to your head to investigate. To your surprise, your hair color has changed into a silvery color, just like that of a shark girl!", false);
			player.hairColor = "silver";
		}
		//Skin
		if (((player.skinTone !== "rough gray" && player.skinTone !== "orange and black striped") || player.skinType !== AppearanceDefs.SKIN_TYPE_PLAIN) && Utils.rand(7) === 0 && changes < changeLimit) {
			MainView.outputText("\n\n", false);
			if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR || player.skinType === AppearanceDefs.SKIN_TYPE_SCALES) {
				MainView.outputText("Your " + player.skinDesc + " falls out, collecting on the floor and exposing your supple skin underneath.  ", false);
			} else if (player.skinType === AppearanceDefs.SKIN_TYPE_GOO) {
				MainView.outputText("Your gooey skin solidifies, thickening up as your body starts to solidy into a more normal form. ", false);
			} else if (type === 0) {
				MainView.outputText("Your skin itches and tingles becoming slightly rougher and turning gray.  ", false);
			}
			if (type === 0) {
				MainView.outputText("You abruptly stop moving and gasp sharply as a shudder goes up your entire frame. Your skin begins to shift and morph, growing slightly thicker and changing into a shiny grey color. Your skin now feels oddly rough too, comparable to that of a marine mammal. You smile and run your hands across your new shark skin.", false);
				player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
				player.skinDesc = "skin";
				player.skinTone = "rough gray";
				changes++;
			} else {
				MainView.outputText("Your skin begins to tingle and itch, before rapidly shifting to a shiny orange color, marked by random black stripes. You take a quick look in a nearby pool of water, to see your skin has morphed in appearance and texture to become more like a tigershark!", false);
				player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
				player.skinDesc = "skin";
				player.skinTone = "orange and black striped";
				changes++;
			}
		}
		//FINZ R WINGS
		if (player.wingType !== AppearanceDefs.WING_TYPE_SHARK_FIN && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\n", false);
			if (player.wingType > AppearanceDefs.WING_TYPE_NONE) {
				MainView.outputText("Your wings fold into themselves, merging together with your back.  ", false);
			}
			MainView.outputText("You groan and slump down in pain, almost instantly regretting eating the tooth. You start sweating profusely and panting loudly, feeling the space between your shoulder blades shifting about. You hastily remove your " + player.armorName + " just in time before a strange fin-like structure bursts from in-between your shoulders. You examine it carefully and make a few modifications to your " + player.armorName + " to accommodate your new fin.", false);
			player.wingType = AppearanceDefs.WING_TYPE_SHARK_FIN;
			player.wingDesc = "";
			changes++;
		}
		if (changes === 0) {
			MainView.outputText("\n\nNothing happened.  Weird.", false);
		}
	};
//9)  Transformation Item - Snake Oil (S. Oil)
	/*Effects:
	  Boosts Speed stat
	  Ass reduction
	  Testicles return inside your body (could be reverted by the use of succubi delight)
	  Can change penis into reptilian form  (since there's a lot of commentary here not knowing where to go, let me lay it out.)
	 the change will select one cock (randomly if you have multiple)
	 said cock will become two reptilian cocks
	 these can then be affected separately, so if someone wants to go through the effort of removing one and leaving themselves with one reptile penis, they have the ability to do that
	 This also means that someone who's already reached the maximum numbers of dicks cannot get a reptilian penis unless they remove one first
	 "Your reptilian penis is X.X inches long and X.X inches thick.  The sheath extends halfway up the shaft, thick and veiny, while the smooth shaft extends out of the sheath coming to a pointed tip at the head. "
	  Grow poisonous fangs (grants Poison Bite ability to player, incompatible with the sting ability, as it uses the same poison-meter)
	  Causes your tongue to fork
	  Legs fuse together and dissolve into snake tail  (grants Constrict ability to player, said tail can only be covered in scales, independently from the rest of the body)
	  If snake tail exists:
	    Make it longer, possibly larger (tail length is considered independently of your height, so it doesn't enable you to use the axe, for instance.
	    Change tail's color according to location
	      [Smooth] Beige and Tan (Desert), [Rough] Brown and Rust (Mountains), [Lush]  Forest Green and Yellow (Forest), [Cold] Blue and White (ice land?), [Fresh] Meadow Green [#57D53B - #7FFF00] and Dark Teal [#008080] (lake) , [Menacing] Black and Red (Demon realm, outside encounters), [Distinguished] Ivory (#FFFFF0) and Royal Purple/Amethyst (#702963) (Factory), [Mossy] Emerald and Chestnut (Swamp), [Arid] Orange and Olive pattern (Tel' Adre)

	 9a) Item Description
	 "A vial the size of your fist made of dark brown glass. It contains what appears to be an oily, yellowish liquid. The odor is abominable."
	 */
	Mutations.snakeOil = function(player) {
		player.slimeFeed();
		MainView.outputText("", true);
		var changes = 0;
		var changeLimit = 1;
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		//b) Description while used
		MainView.outputText("Pinching your nose, you quickly uncork the vial and bring it to your mouth, determined to see what effects it might have on your body. Pouring in as much as you can take, you painfully swallow before going for another shot, emptying the bottle.", false);
		//(if outside combat)
		if (!CoC.isInCombat()) {
			MainView.outputText("  Minutes pass as you start wishing you had water with you, to get rid of the aftertaste.", false);
		}
		//+ speed to 70!
		if (player.spe < 70 && Utils.rand(2) === 0) {
			EngineCore.dynStats("spe", (2 - (player.spe / 10 / 5)));
			MainView.outputText("\n\nYour muscles quiver, feeling ready to strike as fast as a snake!", false);
			if (player.spe < 40) {
				MainView.outputText("  Of course, you're nowhere near as fast as that.", false);
			}
			changes++;
		}
		//Removes wings
		if (player.wingType > AppearanceDefs.WING_TYPE_NONE && Utils.rand(3) === 0 && changes < changeLimit) {
			if (player.wingType === AppearanceDefs.WING_TYPE_SHARK_FIN) {
				MainView.outputText("\n\nA wave of tightness spreads through your back, and it feels as if someone is stabbing a dagger into your spine.  After a moment the pain passes, though your fin is gone!", false);
			} else {
				MainView.outputText("\n\nA wave of tightness spreads through your back, and it feels as if someone is stabbing a dagger into each of your shoulder-blades.  After a moment the pain passes, though your wings are gone!", false);
			}
			player.wingType = AppearanceDefs.WING_TYPE_NONE;
			changes++;
		}
		//Removes antennae
		if (player.antennae > AppearanceDefs.ANTENNAE_NONE && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nThe muscles in your brow clench tightly, and you feel a tremendous pressure on your upper forehead.  When it passes, you touch yourself and discover your antennae have vanished!", false);
			player.antennae = AppearanceDefs.ANTENNAE_NONE;
			changes++;
		}
		//9c) II The tongue (sensitivity bonus, stored as a perk?)
		if (changes === 0 && player.tongueType !== AppearanceDefs.TONUGE_SNAKE && Utils.rand(3) === 0 && changes < changeLimit) {
			if (player.tongueType === AppearanceDefs.TONUGE_HUMAN) {
				MainView.outputText("\n\nYour taste-buds start aching as they swell to an uncomfortably large size. Trying to understand what in the world could have provoked such a reaction, you bring your hands up to your mouth, your tongue feeling like it's trying to push its way past your lips. The soreness stops and you stick out your tongue to try and see what would have made it feel the way it did. As soon as you stick your tongue out you realize that it sticks out much further than it did before, and now appears to have split at the end, creating a forked tip. The scents in the air are much more noticeable to you with your snake-like tongue.", false);
			} else {
				MainView.outputText("\n\nYour inhuman tongue shortens, pulling tight in the very back of your throat.  After a moment the bunched-up tongue-flesh begins to flatten out, then extend forwards.  By the time the transformation has finished, your tongue has changed into a long, forked snake-tongue.", false);
			}
			player.tongueType = AppearanceDefs.TONUGE_SNAKE;
			EngineCore.dynStats("sen", 5);
			changes++;
		}
		//9c) III The fangs
		if (changes === 0 && player.tongueType === AppearanceDefs.TONUGE_SNAKE && player.faceType !== AppearanceDefs.FACE_SNAKE_FANGS && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nWithout warning, you feel your canine teeth jump almost an inch in size, clashing on your gums, cutting yourself quite badly. As you attempt to find a new way to close your mouth without dislocating your jaw, you notice that they are dripping with a bitter, khaki liquid.  Watch out, and <b>try not to bite your tongue with your poisonous fangs!</b>", false);
			if (player.faceType !== AppearanceDefs.FACE_HUMAN && player.faceType !== AppearanceDefs.FACE_SHARK_TEETH && player.faceType !== AppearanceDefs.FACE_BUNNY && player.faceType !== AppearanceDefs.FACE_SPIDER_FANGS) {
				MainView.outputText("  As the change progresses, your " + player.face() + " reshapes.  The sensation is far more pleasant than teeth cutting into gums, and as the tingling transformation completes, <b>you've gained with a normal-looking, human visage.</b>");
			}
			player.faceType = AppearanceDefs.FACE_SNAKE_FANGS;
			changes++;
		}
		//9c) I The tail ( http://tvtropes.org/pmwiki/pmwiki.php/Main/TransformationIsAFreeAction ) (Shouldn't we try to avert this? -Ace)
		//Should the enemy "kill" you during the transformation, it skips the scene and immediately goes to tthe rape scene. (Now that I'm thinking about it, we should add some sort of appendix where the player realizes how much he's/she's changed. -Ace)
		if (changes === 0 && player.faceType === AppearanceDefs.FACE_SNAKE_FANGS && player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_NAGA && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou find it increasingly harder to keep standing as your legs start feeling weak.  You swiftly collapse, unable to maintain your own weight.", false);
			//(If used in combat, you lose a turn here. Half-corrupted Jojo and the Naga won't attack you during that period, but other monsters will)
			//FUCK NO
			MainView.outputText("\n\nTrying to get back up, you realize that the skin on the inner sides of your thighs is merging together like it was being sewn by an invisible needle.", false);
			MainView.outputText("  The process continues through the length of your " + player.legs() + ", eventually reaching your " + player.feet() + ".  Just when you think that the transformation is over, you find yourself pinned to the ground by an overwhelming sensation of pain. You hear the horrible sound of your bones snapping, fusing together and changing into something else while you contort in unthinkable agony.  Sometime later you feel the pain begin to ease and you lay on the ground, spent by the terrible experience. Once you feel you've recovered, you try to stand, but to your amazement you discover that you no longer have " + player.legs() + ": the bottom half of your body is like that of a snake's.", false);
			MainView.outputText("\n\nWondering what happened to your sex, you pass your hand down the front of your body until you find a large, horizontal slit around your pelvic area, which contains all of your sexual organs.", false);
			if (player.balls > 0 && player.ballSize > 10) {
				MainView.outputText("  You're happy not to have to drag those testicles around with you anymore.", false);
			}
			MainView.outputText("  But then, scales start to form on the surface of your skin, slowly becoming visible, recoloring all of your body from the waist down in a snake-like pattern. The feeling is... not that bad actually, kind of like callous, except on your whole lower body. The transformation complete, you get up, standing on your newly formed snake tail. You can't help feeling proud of this majestic new body of yours.", false);
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_NAGA;
			changes++;
		}
		if ( Utils.rand(4) === 0 && player.gills && changes < changeLimit) {
			MainView.outputText("\n\nYour chest itches, and as you reach up to scratch it, you realize your gills have withdrawn into your skin.", false);
			player.gills = false;
			changes++;
		}
		//Default change - blah
		if (changes === 0) {
			MainView.outputText("\n\nRemakarbly, the snake-oil has no effect.  Should you really be surprised at snake-oil NOT doing anything?", false);
		}
	};
	Mutations.Hummus = function(player) {
		MainView.outputText("", true);
		MainView.outputText("You shovel the stuff into your face, not sure WHY you're eating it, but once you start, you just can't stop.  It tastes incredibly bland, and with a slight hint of cheese.", false);
		player.str = 30;
		player.spe = 30;
		player.tou = 30;
		player.inte = 30;
		player.sens = 20;
		player.lib = 25;
		player.cor = 5;
		player.lust = 10;
		player.hairType = 0;
		if (player.humanScore() > 4) {
			MainView.outputText("\n\nYou blink and the world twists around you.  You feel more like yourself than you have in a while, but exactly how isn't immediately apparent.  Maybe you should take a look at yourself?", false);
		} else {
			MainView.outputText("\n\nYou cry out as the world spins around you.  You're aware of your entire body sliding and slipping, changing and morphing, but in the sea of sensation you have no idea exactly what's changing.  You nearly black out, and then it's over.  Maybe you had best have a look at yourself and see what changed?", false);
		}
		player.armType = AppearanceDefs.ARM_TYPE_HUMAN;
		player.eyeType = AppearanceDefs.EYES_HUMAN;
		player.antennae = AppearanceDefs.ANTENNAE_NONE;
		player.faceType = AppearanceDefs.FACE_HUMAN;
		player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HUMAN;
		player.wingType = AppearanceDefs.WING_TYPE_NONE;
		player.wingDesc = "non-existant";
		player.tailType = AppearanceDefs.TAIL_TYPE_NONE;
		player.tongueType = AppearanceDefs.TONUGE_HUMAN;
		player.tailRecharge = 0;
		player.horns = 0;
		player.hornType = AppearanceDefs.HORNS_NONE;
		player.earType = AppearanceDefs.EARS_HUMAN;
		player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		player.skinDesc = "skin";
		player.skinAdj = "";
		player.armType = AppearanceDefs.ARM_TYPE_HUMAN;
		player.tongueType = AppearanceDefs.TONUGE_HUMAN;
		player.eyeType = AppearanceDefs.EYES_HUMAN;
		if (player.fertility > 15) {
			player.fertility = 15;
		}
		if (player.cumMultiplier > 50) {
			player.cumMultiplier = 50;
		}
		var virgin = false;
		//Clear cocks
		while (player.cocks.length > 0) {
			player.removeCock(0, 1);
			$log.debug("1 cock purged.");
		}
		//Reset dongs!
		if (player.gender === 1 || player.gender === 3) {
			player.createCock();
			player.cocks[0].cockLength = 6;
			player.cocks[0].cockThickness = 1;
			player.ballSize = 2;
			if (player.balls > 2) {
				player.balls = 2;
			}
		} else { //Non duders lose any nuts
			player.balls = 0;
			player.ballSize = 2;
		}
		//Clear vaginas
		while (player.vaginas.length > 0) {
			virgin = player.vaginas[0].virgin;
			player.removeVagina(0, 1);
			$log.debug("1 vagina purged.");
		}
		//Reset vaginal virginity to correct state
		if (player.gender >= 2) {
			player.createVagina();
			player.vaginas[0].virgin = virgin;
		}
		player.clitLength = 0.25;
		//Tighten butt!
		player.buttRating = 2;
		player.hipRating = 2;
		if (player.ass.analLooseness > 1) {
			player.ass.analLooseness = 1;
		}
		if (player.ass.analWetness > 1) {
			player.ass.analWetness = 1;
		}
		//Clear breasts
		player.breastRows = [];
		player.createBreastRow();
		player.nippleLength = 0.25;
		//Girls and herms get bewbs back
		if (player.gender > 2) {
			player.breastRows[0].breastRating = 2;
		} else {
			player.breastRows[0].breastRating = 0;
		}
		player.gills = false;
		player.removeStatusAffect(StatusAffects.Uniball);
		player.removeStatusAffect(StatusAffects.BlackNipples);
		player.vaginaType(0);
	};
	Mutations.coal = function(player) {
		var changes = 0;
		MainView.outputText("", true);
		MainView.outputText("You handle the coal rocks experimentally and they crumble to dust in your hands!  You cough as you breathe in the cloud, sputtering and wheezing.  After a minute of terrible coughing, you recover and realize there's no remaining trace of the rocks, not even a sooty stain on your hands!", false);
		//Try to go into intense heat
		if(player.goIntoHeat(true, 2)) {
			changes++;
		} else if(player.goIntoRut(true)) { //Males go into rut
			changes++;
		} else {
			//Boost anal capacity without gaping
			if (player.statusAffectv1(StatusAffects.BonusACapacity) < 80) {
				if (player.findStatusAffect(StatusAffects.BonusACapacity) < 0) {
					player.createStatusAffect(StatusAffects.BonusACapacity, 0, 0, 0, 0);
				}
				player.addStatusValue(StatusAffects.BonusACapacity, 1, 5);
				MainView.outputText("\n\nYou feel... more accommodating somehow.  Your " + Descriptors.assholeDescript() + " is tingling a bit, and though it doesn't seem to have loosened, it has grown more elastic.", false);
				changes++;
			} else {
				MainView.outputText("\n\nYour whole body tingles for a moment but it passes.  It doesn't look like the coal can do anything to you at this point.", false);
			}
		}
	};
	Mutations.catTransformation = function(player) {
		var changes = 0;
		var changeLimit = 1;
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(3) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		//Text go!
		MainView.outputText("", true);
		MainView.outputText("You take a bite of the fruit and gulp it down. It's thick and juicy and has an almost overpowering sweetness. Nevertheless, it is delicious and you certainly could use a meal.  You devour the fruit, stopping only when the hard, nubby pit is left; which you toss aside.", false);
		//Speed raises up to 75
		if (player.spe < 75 && Utils.rand(3) === 0 && changes < changeLimit) {
			//low speed
			if (player.spe <= 30) {
				MainView.outputText("\n\nYou feel... more balanced, sure of step. You're certain that you've become just a little bit faster.", false);
				EngineCore.dynStats("spe", 2);
			} else if (player.spe <= 60) { //medium speed
				MainView.outputText("\n\nYou stumble as you shift position, surprised by how quickly you move. After a moment or two of disorientation, you adjust. You're certain that you can run faster now.", false);
				EngineCore.dynStats("spe", 1);
			} else { //high speed
				MainView.outputText("\n\nYou pause mid-step and crouch. Your leg muscles have cramped up like crazy. After a few moments, the pain passes and you feel like you could chase anything down.", false);
				EngineCore.dynStats("spe", 0.5);
			}
			changes++;
		}
		//Strength raises to 40
		if (player.str < 40 && Utils.rand(3) === 0 && changes < changeLimit) {
			if ( Utils.rand(2) === 0) {
				MainView.outputText("\n\nYour muscles feel taut, like a coiled spring, and a bit more on edge.", false);
			} else {
				MainView.outputText("\n\nYou arch your back as your muscles clench painfully.  The cramp passes swiftly, leaving you feeling like you've gotten a bit stronger.", false);
			}
			EngineCore.dynStats("str", 1);
			changes++;
		} else if (player.str > 60 && Utils.rand(2) === 0) { //Strength ALWAYS drops if over 60 //Does not add to change total
			MainView.outputText("\n\nShivers run from your head to your toes, leaving you feeling weak.  Looking yourself over, your muscles seemed to have lost some bulk.", false);
			EngineCore.dynStats("str", -2);
		}
		//Toughness drops if over 50
		//Does not add to change total
		if (player.tou > 50 && Utils.rand(2) === 0) {
			MainView.outputText("\n\nYour body seems to compress momentarily, becoming leaner and noticeably less tough.", false);
			EngineCore.dynStats("tou", -2);
		}
		//Intelliloss
		if ( Utils.rand(4) === 0 && changes < changeLimit) {
			//low intelligence
			if (player.inte < 15) {
				MainView.outputText("\n\nYou feel like something is slipping away from you but can't figure out exactly what's happening.  You scrunch up your " + player.face() + ", trying to understand the situation.  Before you can reach any kind of conclusion, something glitters in the distance, distracting your feeble mind long enough for you to forget the problem entirely.", false);
			} else if (player.inte < 50) { //medium intelligence
				MainView.outputText("\n\nYour mind feels somewhat sluggish, and you wonder if you should just lie down ", false);
				if ( Utils.rand(2) === 0) {
					MainView.outputText("somewhere and ", false);
					MainView.outputText(Utils.randomChoice("toss a ball around or something", "play with some yarn", "take a nap and stop worrying"), false);
				} else {
					MainView.outputText("in the sun and let your troubles slip away", false);
				}
				MainView.outputText(".", false);
			} else { //High intelligence
				MainView.outputText("\n\nYou start to feel a bit dizzy, but the sensation quickly passes.  Thinking hard on it, you mentally brush away the fuzziness that seems to permeate your brain and determine that this fruit may have actually made you dumber.  It would be best not to eat too much of it.", false);
			}
			EngineCore.dynStats("int", -1);
			changes++;
		}
		//Libido gain
		if (player.lib < 80 && changes < changeLimit && Utils.rand(4) === 0) {
			//Cat dicked folks
			if (player.catCocks() > 0) {
				MainView.outputText("\n\nYou feel your " + Descriptors.cockDescript(player.findFirstCockType(CockTypesEnum.CAT)) + " growing hard, the barbs becoming more sensitive. You gently run your hands down them and imagine the feeling of raking the insides of a cunt as you pull.  The fantasy continues, and after ejaculating and hearing the female yowl with pleasure, you shake your head and try to drive off the image.  ", false);
				if (player.cor < 33) {
					MainView.outputText("You need to control yourself better.", false);
				} else if (player.cor < 66) {
					MainView.outputText("You're not sure how you feel about the fantasy.", false);
				} else {
					MainView.outputText("You hope to find a willing partner to make this a reality.", false);
				}
			} else {
				MainView.outputText("\n\nA rush of tingling warmth spreads through your body as it digests the fruit.  You can feel your blood pumping through your extremities, making them feel sensitive and surprisingly sensual.  It's going to be hard to resist getting ", false);
				if (player.lust > 60) {
					MainView.outputText("even more ", false);
				}
				MainView.outputText("turned on.", false);
			}
			EngineCore.dynStats("lib", 1, "sen", 0.25);
			changes++;
		}
		//Sexual changes would go here if I wasn't a tard.
		//Heat
		if ( Utils.rand(4) === 0 && changes < changeLimit) {
			var intensified = player.inHeat;
			if (player.goIntoHeat(false)) {
				if (intensified) {
					if ( Utils.rand(2) === 0) {
						MainView.outputText("\n\nThe itch inside your " + Descriptors.vaginaDescript(0) + " is growing stronger, and you desperately want to find a nice cock to massage the inside.", false);
					} else {
						MainView.outputText("\n\nThe need inside your " + Descriptors.vaginaDescript(0) + " grows even stronger.  You desperately need to find a mate to 'scratch your itch' and fill your womb with kittens.  It's difficult NOT to think about a cock slipping inside your moist fuck-tunnel, and at this point you'll have a hard time resisting ANY male who approaches.", false);
					}
				} else {
					MainView.outputText("\n\nThe interior of your " + Descriptors.vaginaDescript(0) + " clenches tightly, squeezing with reflexive, aching need.  Your skin flushes hot ", false);
					if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
						MainView.outputText("underneath your fur ", false);
					}
					MainView.outputText("as images and fantasies ", false);
					if (player.cor < 50) {
						MainView.outputText("assault ", false);
					} else {
						MainView.outputText("fill ", false);
					}
					MainView.outputText(" your mind.  Lithe cat-boys with their perfect, spine-covered cocks line up behind you, and you bend over to present your needy pussy to them.  You tremble with the desire to feel the exotic texture of their soft barbs rubbing your inner walls, smearing your " + Descriptors.vaginaDescript(0) + " with their cum as you're impregnated.  Shivering, you recover from the fantasy and pull your fingers from your aroused sex.  <b>It would seem you've gone into heat!</b>", false);
				}
				changes++;
			}
		}
		//Shrink the boobalies down to A for men or C for girls.
		if (changes < changeLimit && Utils.rand(4) === 0 && !CoC.flags[kFLAGS.HYPER_HAPPY]) {
			//Determine if shrinkage is required
			//and set temp2 to threshold
			var breastChangeThreshold = 0;
			if (!player.hasVagina() && player.biggestTitSize() > 2) {
				breastChangeThreshold = 2;
			} else if (player.biggestTitSize() > 4) {
				breastChangeThreshold = 4;
			}
			//IT IS!
			if (breastChangeThreshold > 0) {
				var breastChanges = 0;
				_.forEach(player.breastRows, function(breastRow, index) {
					//If this row is over threshhold
					if (breastRow.breastRating > breastChangeThreshold) {
						//Big change
						if (breastRow.breastRating > 10) {
							breastRow.breastRating -= 2 + Utils.rand(3);
							if (breastChanges === 0) {
								MainView.outputText("\n\nThe " + Descriptors.breastDescript(0) + " on your chest wobble for a second, then tighten up, losing several cup-sizes in the process!", false);
							} else {
								MainView.outputText("  The change moves down to your " + Utils.num2Text2(index + 1) + " row of " + Descriptors.breastDescript(0) + ". They shrink greatly, losing a couple cup-sizes.", false);
							}
						} else { //Small change
							breastRow.breastRating -= 1;
							if (breastChanges === 0) {
								MainView.outputText("\n\nAll at once, your sense of gravity shifts.  Your back feels a sense of relief, and it takes you a moment to realize your " + Descriptors.breastDescript(index) + " have shrunk!", false);
							} else {
								MainView.outputText("  Your " + Utils.num2Text2(index + 1) + " row of " + Descriptors.breastDescript(index) + " gives a tiny jiggle as it shrinks, losing some off its mass.", false);
							}
						}
						//Increment changed rows
						breastChanges++;
					}
				});
				//Count that tits were shrunk
				if (breastChanges > 0) {
					changes++;
				}
			}
		}
		//Cat dangly-doo.
		if (player.cockTotal() > 0 && player.catCocks() < player.cockTotal() && changes < changeLimit && Utils.rand(4) === 0) {
			//loop through and find a non-cat wang.
			var firstNonCatCock = _.find(player.cocks, function(cock) { return cock.cockType !== CockTypesEnum.CAT; });
			MainView.outputText("\n\nYour " + Descriptors.cockDescript(_.indexOf(player.cocks, firstNonCatCock)) + " swells up with near-painful arousal and begins to transform.  It turns pink and begins to narrow until the tip is barely wide enough to accommodate your urethra.  Barbs begin to sprout from its flesh, if you can call the small, fleshy nubs barbs. They start out thick around the base of your " + Appearance.cockNoun(CockTypesEnum.HUMAN) + " and shrink towards the tip. The smallest are barely visible. <b>Your new feline dong throbs powerfully</b> and spurts a few droplets of cum.  ", false);
			if (!player.hasSheath()) {
				MainView.outputText("Then, it begins to shrink and sucks itself inside your body.  Within a few moments, a fleshy sheath is formed.", false);
				if (player.balls > 0) {
					MainView.outputText("  Thankfully, your balls appear untouched.", false);
				}
			} else {
				MainView.outputText("Then, it disappears back into your sheath.", false);
			}
			firstNonCatCock.cockType = CockTypesEnum.CAT;
			firstNonCatCock.knotMultiplier = 1;
			changes++;
		}
		//Cat penorz shrink
		if (player.catCocks() > 0 && Utils.rand(3) === 0 && changes < changeLimit && !CoC.flags[kFLAGS.HYPER_HAPPY]) {
			//loop through and find a cat wang.
			var bigCatCockIndex = _.indexOf(player.cocks, _.find(player.cocks, function(cock) { return cock.cockType === CockTypesEnum.CAT && cock.cockLength > 6; }));
			if (bigCatCockIndex >= 0) {
				//lose 33% size until under 10, then lose 2" at a time
				if (player.cocks[bigCatCockIndex].cockLength > 16) {
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(bigCatCockIndex) + " tingles, making your sheath feel a little less tight.  It dwindles in size, losing a full third of its length and a bit of girth before the change finally stops.", false);
					player.cocks[bigCatCockIndex].cockLength *= 0.66;
				} else if (player.cocks[bigCatCockIndex].cockLength > 6) {
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(bigCatCockIndex) + " tingles and withdraws further into your sheath.  If you had to guess, you'd say you've lost about two inches of total length and perhaps some girth.", false);
					player.cocks[bigCatCockIndex].cockLength -= 2;
				}
				if (player.cocks[bigCatCockIndex].cockLength / 5 < player.cocks[bigCatCockIndex].cockThickness && player.cocks[bigCatCockIndex].cockThickness > 1.25) {
					player.cocks[bigCatCockIndex].cockThickness = player.cocks[bigCatCockIndex].cockLength / 6;
				}
				//Check for any more!
				var hasMore = false;
				_.forEach(player.cocks, function(cock) {
					//Found another cat wang!
					if (cock.cockType === CockTypesEnum.CAT && cock.cockLength > 6) {
						if (cock.cockLength > 16) {
							cock.cockLength *= 0.66;
						} else if (cock.cockLength > 6) {
							cock.cockLength -= 2;
						}
						//Thickness adjustments
						if (cock.cockLength / 5 < cock.cockThickness && cock.cockThickness > 1.25) {
							cock.cockThickness = cock.cockLength / 6;
						}
						hasMore = true;
					}
				});
				//(big sensitivity boost)
				MainView.outputText("  Although the package is smaller, it feels even more sensitive – as if it retained all sensation of its larger size in its smaller form.", false);
				EngineCore.dynStats("sen", 5);
				//Make note of other dicks changing
				if (hasMore) {
					MainView.outputText("  Upon further inspection, all your " + Appearance.cockNoun(CockTypesEnum.CAT) + "s have shrunk!", false);
				}
				changes++;
			}
		}
		//Body type changes.  Teh rarest of the rare.
		//DA EARZ
		if (player.earType !== AppearanceDefs.EARS_CAT && Utils.rand(5) === 0 && changes < changeLimit) {
			//human to cat:
			if (player.earType === AppearanceDefs.EARS_HUMAN) {
				if ( Utils.rand(2) === 0) {
					MainView.outputText("\n\nThe skin on the sides of your face stretches painfully as your ears migrate upwards, towards the top of your head. They shift and elongate a little, fur growing on them as they become feline in nature. <b>You now have cat ears.</b>", false);
				} else {
					MainView.outputText("\n\nYour ears begin to tingle. You reach up with one hand and gently rub them. They appear to be growing fur. Within a few moments, they've migrated up to the top of your head and increased in size. The tingling stops and you find yourself hearing noises in a whole new way. <b>You now have cat ears.</b>", false);
				}
			} else { //non human to cat:
				if ( Utils.rand(2) === 0) {
					MainView.outputText("\n\nYour ears change shape, morphing into pointed, feline ears!  They swivel about reflexively as you adjust to them.  <b>You now have cat ears.</b>", false);
				} else {
					MainView.outputText("\n\nYour ears tingle and begin to change shape. Within a few moments, they've become long and feline.  Thanks to the new fuzzy organs, you find yourself able to hear things that eluded your notice up until now. <b>You now have cat ears.</b>", false);
				}
			}
			player.earType = AppearanceDefs.EARS_CAT;
			changes++;
		}
		//DA TAIL (IF ALREADY HAZ URZ)
		if (player.tailType !== AppearanceDefs.TAIL_TYPE_CAT && player.earType === AppearanceDefs.EARS_CAT && Utils.rand(5) === 0 && changes < changeLimit) {
			if (player.tailType === AppearanceDefs.TAIL_TYPE_NONE) {
				MainView.outputText(Utils.randomChoice("\n\nA pressure builds in your backside. You feel under your " + player.armorName + " and discover an odd bump that seems to be growing larger by the moment. In seconds it passes between your fingers, bursts out the back of your clothes and grows most of the way to the ground. A thick coat of fur springs up to cover your new tail. You instinctively keep adjusting it to improve your balance. <b>You now have a cat-tail.</b>", "\n\nYou feel your backside shift and change, flesh molding and displacing into a long, flexible tail! <b>You now have a cat tail.</b>", "\n\nYou feel an odd tingling in your spine and your tail bone starts to throb and then swell. Within a few moments it begins to grow, adding new bones to your spine. Before you know it, you have a tail. Just before you think it's over, the tail begins to sprout soft, glossy " + player.hairColor + " fur. <b>You now have a cat tail.</b>"), false);
			} else {
				MainView.outputText("\n\nYou pause and tilt your head... something feels different.  Ah, that's what it is; you turn around and look down at your tail as it starts to change shape, narrowing and sprouting glossy fur. <b>You now have a cat tail.</b>", false);
			}
			player.tailType = AppearanceDefs.TAIL_TYPE_CAT;
			changes++;
		}
		//Da paws (if already haz ears & tail)
		if (player.tailType === AppearanceDefs.TAIL_TYPE_CAT && player.earType === AppearanceDefs.EARS_CAT &&
				Utils.rand(5) === 0 && changes < changeLimit &&
				player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_CAT) {
			//hoof to cat:
			if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HOOFED || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR) {
				MainView.outputText("\n\nYou feel your hooves suddenly splinter, growing into five unique digits. Their flesh softens as your hooves reshape into furred cat paws. <b>You now have cat paws.</b>", false);
				if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR) {
					MainView.outputText("  You feel woozy and collapse on your side.  When you wake, you're no longer a centaur and your body has returned to a humanoid shape.", false);
				}
			} else if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_GOO) { //Goo to cat
				MainView.outputText("\n\nYour lower body rushes inward, molding into two leg-like shapes that gradually stiffen up.  In moments they solidify into digitigrade legs, complete with soft, padded cat-paws.  <b>You now have cat-paws!</b>", false);
			} else { //non hoof to cat:
				MainView.outputText("\n\nYou scream in agony as you feel the bones in your " + player.feet() + " break and begin to rearrange. When the pain fades, you feel surprisingly well-balanced. <b>You now have cat paws.</b>", false);
			}
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_CAT;
			changes++;
		}
		//TURN INTO A FURRAH!  OH SHIT
		if (player.tailType === AppearanceDefs.TAIL_TYPE_CAT && player.earType === AppearanceDefs.EARS_CAT &&
				Utils.rand(5) === 0 && changes < changeLimit &&
				player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CAT && player.skinType !== AppearanceDefs.SKIN_TYPE_FUR) {
			MainView.outputText("\n\nYour " + player.skinDesc + " begins to tingle, then itch. You reach down to scratch your arm absent-mindedly and pull your fingers away to find strands of " + player.hairColor + " fur. Wait, fur?  What just happened?! You spend a moment examining yourself and discover that <b>you are now covered in glossy, soft fur.</b>\n\n", false);
			player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
			player.skinDesc = "fur";
			changes++;
		}
		//CAT-FACE!  FULL ON FURRY!  RAGE AWAY NEKOZ
		if (player.tailType === AppearanceDefs.TAIL_TYPE_CAT && player.earType === AppearanceDefs.EARS_CAT && Utils.rand(5) === 0 && changes < changeLimit && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CAT && player.skinType === AppearanceDefs.SKIN_TYPE_FUR && player.faceType !== AppearanceDefs.FACE_CAT) {
			//Gain cat face, replace old face
			MainView.outputText(Utils.randomChoice("\n\nYour face is wracked with pain. You throw back your head and scream in agony as you feel your cheekbones breaking and shifting, reforming into something... different. You find a puddle to view your reflection and discover <b>your face is now a cross between human and feline features.</b>", "\n\nMind-numbing pain courses through you as you feel your facial bones rearranging.  You clutch at your face in agony as your skin crawls and shifts, your visage reshaping to replace your facial characteristics with those of a feline. <b>You now have an anthropomorphic cat-face.</b>", "\n\nYour face is wracked with pain. You throw back your head and scream in agony as you feel your cheekbones breaking and shifting, reforming into something else. <b>Your facial features rearrange to take on many feline aspects.</b>"), false);
			player.faceType = AppearanceDefs.FACE_CAT;
			changes++;
		}
		if ( Utils.rand(4) === 0 && player.gills && changes < changeLimit) {
			MainView.outputText("\n\nYour chest itches, and as you reach up to scratch it, you realize your gills have withdrawn into your skin.", false);
			player.gills = false;
			changes++;
		}
		//FAILSAFE CHANGE
		if (changes === 0) {
			MainView.outputText("\n\nInhuman vitality spreads through your body, invigorating you!\n", false);
			EngineCore.HPChange(50, true);
			EngineCore.dynStats("lus", 3);
		}
		if (changes < changeLimit) {
			if ( Utils.rand(2) === 0) {
				MainView.outputText(player.modThickness(5, 2), false);
			}
			if ( Utils.rand(2) === 0) {
				MainView.outputText(player.modTone(76, 2), false);
			}
			if (player.gender < 2) {
				if ( Utils.rand(2) === 0) {
					MainView.outputText(player.modFem(65, 1), false);
				} else {
					MainView.outputText(player.modFem(85, 2), false);
				}
			}
		}
	};
	Mutations.reptilum = function(player) {
		player.slimeFeed();
		//init variables
		var changes = 0;
		var changeLimit = 1;
		//Randomly choose affects limit
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(4) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		//clear screen
		MainView.outputText("", true);
		MainView.outputText("You uncork the vial of fluid and drink it down.  The taste is sour, like a dry wine with an aftertaste not entirely dissimilar to alcohol.  Instead of the warmth you'd expect, it leaves your throat feeling cold and a little numb.", false);
		//Statistical changes:
		//-Reduces speed down to 50.
		if (player.spe > 50 && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYou start to feel sluggish and cold.  Lying down to bask in the sun might make you feel better.", false);
			EngineCore.dynStats("spe", -1);
			changes++;
		}
		//-Reduces sensitivity.
		if (player.sens > 20 && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nThe sensation of prickly pins and needles moves over your body, leaving your senses a little dulled in its wake.", false);
			EngineCore.dynStats("sen", -1);
			changes++;
		}
		//Raises libido greatly to 50, then somewhat to 75, then slowly to 100.
		if (player.lib < 100 && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nA knot of fire in your gut doubles you over but passes after a few moments.  As you straighten you can feel the heat seeping into you, ", false);
			//(DICK)
			if (player.cocks.length > 0 && (player.gender !== 3 || Utils.rand(2) === 0)) {
				MainView.outputText("filling ", false);
				if (player.cocks.length > 1) {
					MainView.outputText("each of ", false);
				}
				MainView.outputText("your " + Descriptors.multiCockDescriptLight() + " with the desire to breed.  You get a bit hornier when you realize your sex-drive has gotten a boost.", false);
			} else if (player.hasVagina()) { //(COOCH)
				MainView.outputText("puddling in your " + Descriptors.vaginaDescript(0) + ".  An instinctive desire to mate and lay eggs spreads through you, increasing your lust and boosting your sex-drive.", false);
			} else { //(TARDS)
				MainView.outputText("puddling in your featureless crotch for a split-second before it slides into your " + Descriptors.assDescript() + ".  You want to be fucked, filled, and perhaps even gain a proper gender again.  Through the lust you realize your sex-drive has been permanently increased.", false);
			}
			//+3 lib if less than 50
			if (player.lib < 50) {
				EngineCore.dynStats("lib", 1);
			}
			//+2 lib if less than 75
			if (player.lib < 75) {
				EngineCore.dynStats("lib", 1);
			}
			//+1 if above 75.
			EngineCore.dynStats("lib", 1);
			changes++;
		}
		//-Raises toughness to 70
		//(+3 to 40, +2 to 55, +1 to 70)
		if (player.tou < 70 && changes < changeLimit && Utils.rand(3) === 0) {
			//(+3)
			if (player.tou < 40) {
				MainView.outputText("\n\nYour body and skin both thicken noticeably.  You pinch your " + player.skinDesc + " experimentally and marvel at how much tougher your hide has gotten.", false);
				EngineCore.dynStats("tou", 3);
			} else if (player.tou < 55) { //(+2)
				MainView.outputText("\n\nYou grin as you feel your form getting a little more solid.  It seems like your whole body is toughening up quite nicely, and by the time the sensation goes away, you feel ready to take a hit.", false);
				EngineCore.dynStats("tou", 2);
			} else { //(+1)
				MainView.outputText("\n\nYou snarl happily as you feel yourself getting even tougher.  It's a barely discernible difference, but you can feel your " + player.skinDesc + " getting tough enough to make you feel invincible.", false);
				EngineCore.dynStats("tou", 1);
			}
			changes++;
		}
		//Sexual Changes:
		//-Lizard dick - first one
		//Find the first non-lizzy dick
		var firstNonLizardCockIndex = _.indexOf(player.cocks, _.find(player.cocks, function(cock) {
			return cock.cockType !== CockTypesEnum.LIZARD;
		}));
		if (player.lizardCocks() === 0 && player.cockTotal() > 0 && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nA slow tingle warms your groin.  Before it can progress any further, you yank back your " + player.armorName + " to investigate.  Your " + Descriptors.cockDescript(firstNonLizardCockIndex) + " is changing!  It ripples loosely from ", false);
			if (player.hasSheath()) {
				MainView.outputText("sheath ", false);
			} else {
				MainView.outputText("base ", false);
			}
			MainView.outputText("to tip, undulating and convulsing as its color lightens, darkens, and finally settles on a purplish hue.  Your " + Appearance.cockNoun(CockTypesEnum.HUMAN) + " resolves itself into a bulbous form, with a slightly pointed tip.  The 'bulbs' throughout its shape look like they would provide an interesting ride for your sexual partners, but the perverse, alien pecker ", false);
			if (player.cor < 33) {
				MainView.outputText("horrifies you.", false);
			} else if (player.cor < 66) {
				MainView.outputText("is a little strange for your tastes.", false);
			} else {
				MainView.outputText("looks like it might be more fun to receive than use on others.  ", false);
				if (player.hasVagina()) {
					MainView.outputText("Maybe you could find someone else with one to ride?", false);
				} else {
					MainView.outputText("Maybe you should test it out on someone and ask them exactly how it feels?", false);
				}
			}
			MainView.outputText("  <b>You now have a bulbous, lizard-like cock.</b>", false);
			//Actually xform it nau
			if (player.hasSheath()) {
				player.cocks[firstNonLizardCockIndex].cockType = CockTypesEnum.LIZARD;
				if (!player.hasSheath()) {
					MainView.outputText("\n\nYour sheath tightens and starts to smooth out, revealing ever greater amounts of your " + Descriptors.cockDescript(firstNonLizardCockIndex) + "'s lower portions.  After a few moments <b>your groin is no longer so animalistic – the sheath is gone.</b>", false);
				}
			} else {
				player.cocks[firstNonLizardCockIndex].cockType = CockTypesEnum.LIZARD;
			}
			changes++;
			EngineCore.dynStats("lib", 3, "lus", 10);
		}
		//(CHANGE OTHER DICK)
		//Requires 1 lizard cock, multiple cocks
		if (player.cockTotal() > 1 && player.lizardCocks() > 0 && player.cockTotal() > player.lizardCocks() && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nA familiar tingle starts in your crotch, and before you can miss the show, you pull open your " + player.armorName + ".  As if operating on a cue, ", false);
			if (player.cockTotal() === 2) {
				MainView.outputText("your other dick", false);
			} else {
				MainView.outputText("another one of your dicks", false);
			}
			MainView.outputText(" starts to change into the strange reptilian shape you've grown familiar with.  It warps visibly, trembling and radiating pleasurable feelings back to you as the transformation progresses.  ", false);
			if (player.cumQ() < 50) {
				MainView.outputText("pre-cum oozes from the tip", false);
			} else if (player.cumQ() < 700) {
				MainView.outputText("Thick pre-cum rains from the tip", false);
			} else {
				MainView.outputText("A wave of pre-cum splatters on the ground", false);
			}
			MainView.outputText(" from the pleasure of the change.  In moments <b>you have a bulbous, lizard-like cock.</b>", false);
			//(REMOVE SHEATH IF NECESSARY)
			if (player.hasSheath()) {
				player.cocks[firstNonLizardCockIndex].cockType = CockTypesEnum.LIZARD;
				if (!player.hasSheath()) {
					MainView.outputText("\n\nYour sheath tightens and starts to smooth out, revealing ever greater amounts of your " + Descriptors.cockDescript(firstNonLizardCockIndex) + "'s lower portions.  After a few moments <b>your groin is no longer so animalistic – the sheath is gone.</b>", false);
				}
			} else {
				player.cocks[firstNonLizardCockIndex].cockType = CockTypesEnum.LIZARD;
			}
			changes++;
			EngineCore.dynStats("lib", 3, "lus", 10);
		}
		//-Grows second lizard dick if only 1 dick
		if (player.lizardCocks() === 1 && player.cocks.length === 1 && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nA knot of pressure forms in your groin, forcing you off your " + player.feet() + " as you try to endure it.  You examine the affected area and see a lump starting to bulge under your " + player.skinDesc + ", adjacent to your " + Descriptors.cockDescript(0) + ".  The flesh darkens, turning purple", false);
			if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR || player.skinType === AppearanceDefs.SKIN_TYPE_SCALES) {
				MainView.outputText(" and shedding " + player.skinDesc, false);
			}
			MainView.outputText(" as the bulge lengthens, pushing out from your body.  Too surprised to react, you can only pant in pain and watch as the fleshy lump starts to take on a penis-like appearance.  <b>You're growing a second lizard-cock!</b>  It doesn't stop growing until it's just as long as its brother and the same shade of shiny purple.  A dribble of cum oozes from its tip, and you feel relief at last.", false);
			player.createCock();
			player.cocks[1].cockType = CockTypesEnum.LIZARD;
			player.cocks[1].cockLength = player.cocks[0].cockLength;
			player.cocks[1].cockThickness = player.cocks[0].cockThickness;
			changes++;
			EngineCore.dynStats("lib", 3, "lus", 10);
		}
		//--Worms leave if 100% lizard dicks?
		//Require mammals?
		if (player.lizardCocks() === player.cockTotal() && changes < changeLimit && player.findStatusAffect(StatusAffects.Infested) >= 0) {
			MainView.outputText("\n\nLike rats from a sinking ship, worms escape from your body in a steady stream.  Surprisingly, the sensation is remarkably pleasant, similar to the pleasure of sexual release in a way.  Though they seem inexhaustible, the tiny, cum-slimed invertebrates slow to a trickle.  The larger worm-kin inside you stirs as if disturbed from a nap, coming loose from whatever moorings it had attached itself to in the interior of your form.  It slowly works its way up your urethra, stretching to an almost painful degree with every lurching motion.  Your dick bloats out around the base, stretched like the ovipositor on a bee-girl in order to handle the parasitic creature, but thankfully, the ordeal is a brief one.", false);
			if (player.balls > 1) {
				MainView.outputText("  The remaining " + Utils.num2Text(player.balls - 1) + " slither out the pre-stretched holes with ease, though the last one hangs from your tip for a moment before dropping to the ground.", false);
			}
			MainView.outputText("  The white creature joins its kin on the ground and slowly slithers away.  Perhaps they prefer mammals? In any event, <b>you are no longer infected with worms</b>.", false);
			player.removeStatusAffect(StatusAffects.Infested);
			changes++;
		}
		//-Breasts vanish to 0 rating if male
		if (player.biggestTitSize() >= 1 && player.gender === 1 && changes < changeLimit && Utils.rand(3) === 0) {
			//(HUEG)
			if (player.biggestTitSize() > 8) {
				MainView.outputText("\n\nThe flesh on your chest tightens up, losing nearly half its mass in the span of a few seconds.  With your center of balance shifted so suddenly, you stagger about trying not to fall on your ass.  You catch yourself and marvel at the massive change in breast size.", false);
				//Half tit size
			} else { //(NOT HUEG < 4)
				MainView.outputText("\n\nIn an instant, your chest compacts in on itself, consuming every ounce of breast-flesh.  You're left with a  smooth, masculine torso, though your nipples remain.", false);
			}
			//(BOTH – no new PG)
			MainView.outputText("  With the change in weight and gravity, you find it's gotten much easier to move about.", false);
			//Loop through behind the scenes and adjust all tits.
			_.forEach(player.breastRows, function(breastRow) {
				if (breastRow.breastRating > 8) {
					breastRow.breastRating /= 2;
				} else {
					breastRow.breastRating = 0;
				}
			});
			//(+2 speed)
			EngineCore.dynStats("lib", 2);
			changes++;
		}
		//-Lactation stoppage.
		if (player.biggestLactation() >= 1 && changes < changeLimit && Utils.rand(4) === 0) {
			if (player.totalNipples() === 2) {
				MainView.outputText("\n\nBoth of your", false);
			} else {
				MainView.outputText("\n\nAll of your many", false);
			}
			MainView.outputText(" nipples relax.  It's a strange feeling, and you pull back your top to touch one.  It feels fine, though there doesn't seem to be any milk leaking out.  You give it a squeeze and marvel when nothing ", false);
			if (player.hasFuckableNipples()) {
				MainView.outputText("but sexual fluid ", false);
			}
			MainView.outputText("escapes it.  <b>You are no longer lactating.</b>  That makes sense, only mammals lactate!  Smiling, you muse at how much time this will save you when cleaning your gear.", false);
			if (player.findPerk(PerkLib.Feeder) >= 0 || player.findStatusAffect(StatusAffects.Feeder) >= 0) {
				MainView.outputText("\n\n(<b>Feeder perk lost!</b>)", false);
				player.removePerk(PerkLib.Feeder);
				player.removeStatusAffect(StatusAffects.Feeder);
			}
			changes++;
			//Loop through and reset lactation
			_.forEach(player.breastRows, function(breastRow) {
				breastRow.lactationMultiplier = 0;
			});
		}
		//-Nipples reduction to 1 per tit.
		if (player.averageNipplesPerBreast() > 1 && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nA chill runs over your " + Descriptors.allBreastsDescript() + " and vanishes.  You stick a hand under your " + player.armorName + " and discover that your extra nipples are missing!  You're down to just one per ", false);
			if (player.biggestTitSize() < 1) {
				MainView.outputText("'breast'.", false);
			} else {
				MainView.outputText("breast.", false);
			}
			changes++;
			//Loop through and reset nipples
			_.forEach(player.breastRows, function(breastRow) {
				breastRow.nipplesPerBreast = 1;
			});
		}
		//-VAGs
		if (player.hasVagina() && player.findPerk(PerkLib.Oviposition) < 0 && changes < changeLimit && Utils.rand(5) === 0 && player.lizardScore() > 3) {
			MainView.outputText("\n\nDeep inside yourself there is a change.  It makes you feel a little woozy, but passes quickly.  Beyond that, you aren't sure exactly what just happened, but you are sure it originated from your womb.\n", false);
			MainView.outputText("(<b>Perk Gained: Oviposition</b>)", false);
			player.createPerk(PerkLib.Oviposition, 0, 0, 0, 0);
			changes++;
		}
		//Physical changes:
		//-Existing horns become draconic, max of 4, max length of 1'
		if (player.hornType !== AppearanceDefs.HORNS_DRACONIC_X4_12_INCH_LONG && changes < changeLimit && Utils.rand(5) === 0) {
			//No dragon horns yet.
			if (player.hornType !== AppearanceDefs.HORNS_DRACONIC_X2) {
				//Already have horns
				if (player.horns > 0) {
					//High quantity demon horns
					if (player.hornType === AppearanceDefs.HORNS_DEMON && player.horns > 4) {
						MainView.outputText("\n\nYour horns condense, twisting around each other and merging into larger, pointed protrusions.  By the time they finish you have four draconic-looking horns, each about twelve inches long.", false);
						player.horns = 12;
						player.hornType = AppearanceDefs.HORNS_DRACONIC_X4_12_INCH_LONG;
					} else {
						MainView.outputText("\n\nYou feel your horns changing and warping, and reach back to touch them.  They have a slight curve and a gradual taper.  They must look something like the horns the dragons in your village's legends always had.", false);
						player.hornType = AppearanceDefs.HORNS_DRACONIC_X2;
						if (player.horns > 13) {
							MainView.outputText("  The change seems to have shrunken the horns, they're about a foot long now.", false);
							player.horns = 12;
						}
					}
					changes++;
				} else { //No horns
					//-If no horns, grow a pair
					MainView.outputText("\n\nWith painful pressure, the skin on the sides of your forehead splits around two tiny nub-like horns.  They're angled back in such a way as to resemble those you saw on the dragons in your village's legends.  A few inches of horn sprout from your head before stopping.  <b>You have about four inches of dragon-like horn.</b>", false);
					player.horns = 4;
					player.hornType = AppearanceDefs.HORNS_DRACONIC_X2;

					changes++;
				}
			} else { //ALREADY DRAGON
				if (player.horns < 12) {
					if ( Utils.rand(2) === 0) {
						MainView.outputText("\n\nYou get a headache as an inch of fresh horn escapes from your pounding skull.", false);
						player.horns += 1;
					} else {
						MainView.outputText("\n\nYour head aches as your horns grow a few inches longer.  They get even thicker about the base, giving you a menacing appearance.", false);
						player.horns += 2 + Utils.rand(4);
					}
					if (player.horns >= 12) {
						MainView.outputText("  <b>Your horns settle down quickly, as if they're reached their full size.</b>", false);
					}
					changes++;
				} else { //maxxed out, new row
					//--Next horn growth adds second row and brings length up to 12\"
					MainView.outputText("\n\nA second row of horns erupts under the first, and though they are narrower, they grow nearly as long as your first row before they stop.  A sense of finality settles over you.  <b>You have as many horns as a lizan can grow.</b>", false);
					player.hornType = AppearanceDefs.HORNS_DRACONIC_X4_12_INCH_LONG;
					changes++;
				}
			}
		}
		//-Hair stops growing!
		if (CoC.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] === 0 && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYour scalp tingles oddly.  In a panic, you reach up to your " + Descriptors.hairDescript() + ", but thankfully it appears unchanged.\n\n", false);
			MainView.outputText("(<b>Your hair has stopped growing.</b>)", false);
			changes++;
			CoC.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD]++;
		}
		//Big physical changes:
		//-Legs – Draconic, clawed feet
		if (player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_LIZARD && changes < changeLimit && Utils.rand(5) === 0) {
			//Hooves -
			if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HOOFED) {
				MainView.outputText("\n\nYou scream in agony as you feel your hooves crack and break apart, beginning to rearrange.  Your legs change to a digitigrade shape while your feet grow claws and shift to have three toes on the front and a smaller toe on the heel.", false);
			} else if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR) { //TAURS -
				MainView.outputText("\n\nYour lower body is wracked by pain!  Once it passes, you discover that you're standing on digitigrade legs with lizard-like claws.", false);
			} else if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HUMAN || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DOG || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_HIGH_HEELS || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_CLAWS || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_BEE || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CAT || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_LIZARD) { //feet types -
				MainView.outputText("\n\nYou scream in agony as you feel the bones in your legs break and begin to rearrange. They change to a digitigrade shape while your feet grow claws and shift to have three toes on the front and a smaller toe on the heel.", false);
			} else {
				MainView.outputText("\n\nPain rips through your " + player.legs() + ", morphing and twisting them until the bones rearrange into a digitigrade configuration.  The strange legs have three-toed, clawed feet, complete with a small vestigial claw-toe on the back for added grip.", false);
			}
			MainView.outputText("  <b>You have reptilian legs and claws!</b>", false);
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_LIZARD;
			changes++;
		}
		//-Tail – sinuous lizard tail
		if (player.tailType !== AppearanceDefs.TAIL_TYPE_LIZARD && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_LIZARD && changes < changeLimit && Utils.rand(5) === 0) {
			//No tail
			if (player.tailType === AppearanceDefs.TAIL_TYPE_NONE) {
				MainView.outputText("\n\nYou drop onto the ground as your spine twists and grows, forcing the flesh above your " + Descriptors.assDescript() + " to bulge out.  New bones form, one after another, building a tapered, prehensile tail onto the back of your body.  <b>You now have a reptilian tail!</b>", false);
			} else {
				MainView.outputText("\n\nYou drop to the ground as your tail twists and grows, changing its shape in order to gradually taper to a point.  It flicks back and forth, prehensile and totally under your control.  <b>You now have a reptilian tail.</b>", false);
			}
			player.tailType = AppearanceDefs.TAIL_TYPE_LIZARD;
			changes++;
		}
		//Remove odd eyes
		if (changes < changeLimit && Utils.rand(5) === 0 && player.eyeType > AppearanceDefs.EYES_HUMAN) {
			if (player.eyeType === AppearanceDefs.EYES_BLACK_EYES_SAND_TRAP) {
				MainView.outputText("\n\nYou feel a twinge in your eyes and you blink.  It feels like black cataracts have just fallen away from you, and you know without needing to see your reflection that your eyes have gone back to looking human.");
			} else {
				MainView.outputText("\n\nYou blink and stumble, a wave of vertigo threatening to pull your " + player.feet() + " from under you.  As you steady and open your eyes, you realize something seems different.  Your vision is changed somehow.", false);
				if (player.eyeType === AppearanceDefs.EYES_FOUR_SPIDER_EYES) {
					MainView.outputText("  Your multiple, arachnid eyes are gone!</b>", false);
				}
				MainView.outputText("  <b>You have normal, humanoid eyes again.</b>", false);
			}
			player.eyeType = AppearanceDefs.EYES_HUMAN;
			changes++;
		}
		//-Ears become smaller nub-like openings?
		if (player.earType !== AppearanceDefs.EARS_LIZARD && player.tailType === AppearanceDefs.TAIL_TYPE_LIZARD && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_LIZARD && changes < changeLimit && Utils.rand(5) === 0) {
			MainView.outputText("\n\nTightness centers on your scalp, pulling your ears down from their normal, fleshy shape into small, scaley bumps with holes in their centers.  <b>You have reptilian ears!</b>", false);
			player.earType = AppearanceDefs.EARS_LIZARD;
			changes++;
		}
		//-Scales – color changes to red, green, white, blue, or black.  Rarely: purple or silver.
		if (player.skinType !== AppearanceDefs.SKIN_TYPE_SCALES && player.earType === AppearanceDefs.EARS_LIZARD && player.tailType === AppearanceDefs.TAIL_TYPE_LIZARD && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_LIZARD && changes < changeLimit && Utils.rand(5) === 0) {
			//(fur)
			if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
				//set new skinTone
				if ( Utils.rand(10) === 0) {
					player.skinTone = Utils.randomChoice("purple", "silver");
				} else {
					player.skinTone = Utils.randomChoice("red", "green", "white", "blue", "black");
				}
				MainView.outputText("\n\nYou scratch yourself, and come away with a large clump of " + player.hairColor + " fur.  Panicked, you look down and realize that your fur is falling out in huge clumps.  It itches like mad, and you scratch your body relentlessly, shedding the remaining fur with alarming speed.  Underneath the fur your skin feels incredibly smooth, and as more and more of the stuff comes off, you discover a seamless layer of " + player.skinTone + " scales covering most of your body.  The rest of the fur is easy to remove.  <b>You're now covered in scales from head to toe.</b>", false);
			} else { //(no fur)
				MainView.outputText("\n\nYou idly reach back to scratch yourself and nearly jump out of your " + player.armorName + " when you hit something hard.  A quick glance down reveals that scales are growing out of your " + player.skinTone + " skin with alarming speed.  As you watch, the surface of your skin is covered in smooth scales.  They interlink together so well that they may as well be seamless.  You peel back your " + player.armorName + " and the transformation has already finished on the rest of your body.  <b>You're covered from head to toe in shiny ", false);
				//set new skinTone
				if ( Utils.rand(10) === 0) {
					player.skinTone = Utils.randomChoice("purple", "silver");
				} else { //non rare skinTone
					player.skinTone = Utils.randomChoice("red", "green", "white", "blue", "black");
				}
				MainView.outputText(player.skinTone + " scales.</b>", false);
			}
			player.skinType =  AppearanceDefs.SKIN_TYPE_SCALES;
			player.skinDesc = "scales";
			changes++;
		}
		//-Lizard-like face.
		if (player.faceType !==  AppearanceDefs.FACE_LIZARD && player.skinType ===  AppearanceDefs.SKIN_TYPE_SCALES && player.earType ===  AppearanceDefs.EARS_LIZARD && player.tailType ===  AppearanceDefs.TAIL_TYPE_LIZARD && player.lowerBody ===  AppearanceDefs.LOWER_BODY_TYPE_LIZARD && changes < changeLimit && Utils.rand(5) === 0) {
			MainView.outputText("\n\nTerrible agony wracks your " + player.face() + " as bones crack and shift.  Your jawbone rearranges while your cranium shortens.  The changes seem to last forever; once they've finished, no time seems to have passed.  Your fingers brush against your toothy snout as you get used to your new face.  It seems <b>you have a toothy, reptilian visage now.</b>", false);
			player.faceType =  AppearanceDefs.FACE_LIZARD;
		}
		if ( Utils.rand(4) === 0 && player.gills && changes < changeLimit) {
			MainView.outputText("\n\nYour chest itches, and as you reach up to scratch it, you realize your gills have withdrawn into your skin.", false);
			player.gills = false;
			changes++;
		}
		//FAILSAFE CHANGE
		if (changes === 0) {
			MainView.outputText("\n\nInhuman vitality spreads through your body, invigorating you!\n", false);
			EngineCore.HPChange(50, true);
			EngineCore.dynStats("lus", 3);
		}
	};
	Mutations.neonPinkEgg = function(pregnantChange, player) {
		var changes = 0;
		var changeLimit = 1;
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		//If this is a pregnancy change, only 1 change per proc.
		if (pregnantChange) {
			changeLimit = 1;
		} else {
			MainView.outputText("", true);
		}
		//If not pregnancy, mention eating it.
		if (!pregnantChange) {
			MainView.outputText("You eat the neon pink egg, and to your delight it tastes sweet, like candy.  In seconds you've gobbled down the entire thing, and you lick your fingers clean before you realize you ate the shell – and it still tasted like candy.", false);
		}
		//If pregnancy, warning!
		if (pregnantChange) {
			MainView.outputText("\n<b>Your egg-stuffed ", false);
			if (player.pregnancyType === PregnancyStore.PREGNANCY_BUNNY) {
				MainView.outputText("womb ", false);
				if (player.buttPregnancyType === PregnancyStore.PREGNANCY_BUNNY) {
					MainView.outputText("and ", false);
				}
			}
			if (player.buttPregnancyType === PregnancyStore.PREGNANCY_BUNNY) {
				MainView.outputText("backdoor ", false);
			}
			if (player.buttPregnancyType === PregnancyStore.PREGNANCY_BUNNY && player.pregnancyType === PregnancyStore.PREGNANCY_BUNNY) {
				MainView.outputText("rumble", false);
			} else {
				MainView.outputText("rumbles", false);
			}
			MainView.outputText(" oddly, and you have a hunch that something's about to change</b>.", false);
		}
		//STATS CHANGURYUUUUU
		//Boost speed (max 80!)
		if (changes < changeLimit && Utils.rand(3) === 0 && player.spe < 80) {
			if (player.spe < 30) {
				MainView.outputText("\n\nTingles run through your muscles, and your next few movements seem unexpectedly fast.  The egg somehow made you faster!", false);
			} else if (player.spe < 50) {
				MainView.outputText("\n\nYou feel tingles running through your body, and after a moment, it's clear that you're getting faster.", false);
			} else if (player.spe < 65) {
				MainView.outputText("\n\nThe tight, ready feeling you've grown accustomed to seems to intensify, and you know in the back of your mind that you've become even faster.", false);
			} else {
				MainView.outputText("\n\nSomething changes in your physique, and you grunt, chopping an arm through the air experimentally.  You seem to move even faster than before, confirming your suspicions.", false);
			}
			changes++;
			if (player.spe < 35) {
				EngineCore.dynStats("spe", 1);
			}
			EngineCore.dynStats("spe", 1);
		}
		//Boost libido
		if (changes < changeLimit && Utils.rand(5) === 0) {
			changes++;
			EngineCore.dynStats("lib", 1, "lus", (5 + player.lib / 7));
			if (player.lib < 30) {
				EngineCore.dynStats("lib", 1);
			}
			if (player.lib < 40) {
				EngineCore.dynStats("lib", 1);
			}
			if (player.lib < 60) {
				EngineCore.dynStats("lib", 1);
			}
			//Lower ones are gender specific for some reason
			if (player.lib < 60) {
				//(Cunts or assholes!
				if (!player.hasCock() || (player.gender === 3 && Utils.rand(2) === 0)) {
					if (player.lib < 30) {
						MainView.outputText("\n\nYou squirm a little and find your eyes glancing down to your groin.  Strange thoughts jump to mind, wondering how it would feel to breed until you're swollen and pregnant.  ", false);
						if (player.cor < 25) {
							MainView.outputText("You're repulsed by such shameful thoughts.", false);
						} else if (player.cor < 60) {
							MainView.outputText("You worry that this place is really getting to you.", false);
						} else if (player.cor < 90) {
							MainView.outputText("You pant a little and wonder where the nearest fertile male is.", false);
						} else {
							MainView.outputText("You grunt and groan with desire and disappointment.  You should get bred soon!", false);
						}
					} else {
						MainView.outputText("\n\nYour mouth rolls open as you start to pant with desire.  Did it get hotter?  Your hand reaches down to your " + player.assholeOrPussy() + ", and you're struck by just how empty it feels.  The desire to be filled, not by a hand or a finger but by a virile male, rolls through you like a wave, steadily increasing your desire for sex.", false);
					}
				}
				//WANGS!
				if (player.hasCock()) {
					if (player.lib < 30) {
						MainView.outputText("\n\nYou squirm a little and find your eyes glancing down to your groin.  Strange thoughts jump to mind, wondering how it would feel to fuck a ", false);
						if ( Utils.rand(2) === 0) {
							MainView.outputText("female hare until she's immobilized by all her eggs", false);
						} else {
							MainView.outputText("herm rabbit until her sack is so swollen that she's forced to masturbate over and over again just to regain mobility", false);
						}
						MainView.outputText(". ", false);
						if (player.cor < 25) {
							MainView.outputText("You're repulsed by such shameful thoughts.", false);
						} else if (player.cor < 50) {
							MainView.outputText("You worry that this place is really getting to you.", false);
						} else if (player.cor < 75) {
							MainView.outputText("You pant a little and wonder where the nearest fertile female is.", false);
						} else {
							MainView.outputText("You grunt and groan with desire and disappointment.  Gods you need to fuck!", false);
						}
					} else {
						MainView.outputText("\n\nYour mouth rolls open as you start to pant with desire.  Did it get hotter?  Your hand reaches down to " + Descriptors.sMultiCockDesc() + ", and you groan from how tight and hard it feels.  The desire to squeeze it, not with your hand but with a tight pussy or puckered asshole, runs through you like a wave, steadily increasing your desire for sex.", false);
					}
				}
			} else if (player.lib < 80) { //Libido over 60? FUCK YEAH!
				MainView.outputText("\n\nYou fan your neck and start to pant as your " + player.skinTone + " skin begins to flush red with heat", false);
				if (player.skinType > AppearanceDefs.SKIN_TYPE_PLAIN) {
					MainView.outputText(" through your " + player.skinDesc, false);
				}
				MainView.outputText(".  ", false);
				if (player.gender === 1) {
					MainView.outputText("Compression tightens down on " + Descriptors.sMultiCockDesc() + " as it strains against your " + player.armorName + ".  You struggle to fight down your heightened libido, but it's hard – so very hard.", false);
				} else if (player.gender === 0) {
					MainView.outputText("Sexual hunger seems to gnaw at your " + Descriptors.assholeDescript() + ", demanding it be filled, but you try to resist your heightened libido.  It's so very, very hard.", false);
				} else if (player.gender === 2) {
					MainView.outputText("Moisture grows between your rapidly-engorging vulva, making you squish and squirm as you try to fight down your heightened libido, but it's hard – so very hard.", false);
				} else {
					MainView.outputText("Steamy moisture and tight compression war for your awareness in your groin as " + Descriptors.sMultiCockDesc() + " starts to strain against your " + player.armorName + ".  Your vulva engorges with blood, growing slicker and wetter.  You try so hard to fight down your heightened libido, but it's so very, very hard.  The urge to breed lingers in your mind, threatening to rear its ugly head.", false);
				}
			} else { //MEGALIBIDO
				MainView.outputText("\n\nDelicious, unquenchable desire rises higher and higher inside you, until you're having trouble tamping it down all the time.  A little, nagging voice questions why you would ever want to tamp it down.  It feels so good to give in and breed that you nearly cave to the delicious idea on the spot.  Life is beginning to look increasingly like constant fucking or masturbating in a lust-induced haze, and you're having a harder and harder time finding fault with it.  ", false);
				if (player.cor < 33) {
					MainView.outputText("You sigh, trying not to give in completely.", false);
				} else if (player.cor < 66) {
					MainView.outputText("You pant and groan, not sure how long you'll even want to resist.", false);
				} else {
					MainView.outputText("You smile and wonder if you can ", false);
					if (player.lib < 100) {
						MainView.outputText("get your libido even higher.", false);
					} else {
						MainView.outputText("find someone to fuck right now.", false);
					}
				}
			}
		}
		//BIG sensitivity gains to 60.
		if (player.sens < 60 && changes < changeLimit && Utils.rand(3) === 0) {
			changes++;
			MainView.outputText("\n\n", false);
			//(low)
			if ( Utils.rand(3) !== 2) {
				MainView.outputText("The feeling of small breezes blowing over your " + player.skinDesc + " gets a little bit stronger.  How strange.  You pinch yourself and nearly jump when it hurts a tad more than you'd think. You've gotten more sensitive!", false);
				EngineCore.dynStats("sen", 5);
			} else { //(BIG boost 1/3 chance)
				EngineCore.dynStats("sen", 15);
				MainView.outputText("Every movement of your body seems to bring heightened waves of sensation that make you woozy.  Your " + player.armorName + " rubs your " + Descriptors.nippleDescript(0) + "s deliciously", false);
				if (player.hasFuckableNipples()) {
					MainView.outputText(", sticking to the ", false);
					if (player.biggestLactation() > 2) {
						MainView.outputText("milk-leaking nipple-twats", false);
					} else {
						MainView.outputText("slippery nipple-twats", false);
					}
				} else if (player.biggestLactation() > 2) {
					MainView.outputText(", sliding over the milk-leaking teats with ease", false);
				} else {
					MainView.outputText(" catching on each of the hard nubs repeatedly", false);
				}
				MainView.outputText(".  Meanwhile, your crotch... your crotch is filled with such heavenly sensations from ", false);
				if (player.gender === 1) {
					MainView.outputText(Descriptors.sMultiCockDesc() + " and your ", false);
					if (player.balls > 0) {
						MainView.outputText(Descriptors.ballsDescriptLight(), false);
					} else {
						MainView.outputText(Descriptors.assholeDescript(), false);
					}
				} else if (player.gender === 2) {
					MainView.outputText("your " + Descriptors.vaginaDescript(0) + " and " + Descriptors.clitDescript(), false);
				} else if (player.gender === 3) {
					MainView.outputText(Descriptors.sMultiCockDesc() + ", ", false);
					if (player.balls > 0) {
						MainView.outputText(Descriptors.ballsDescriptLight() + ", ", false);
					}
					MainView.outputText(Descriptors.vaginaDescript(0) + ", and " + Descriptors.clitDescript(), false);
				} else { //oh god genderless
					MainView.outputText("you " + Descriptors.assholeDescript(), false);
				}
				MainView.outputText(" that you have to stay stock-still to keep yourself from falling down and masturbating on the spot.  Thankfully the orgy of tactile bliss fades after a minute, but you still feel way more sensitive than your previous norm.  This will take some getting used to!", false);
			}
		}
		//Makes girls very girl(90), guys somewhat girly (61).
		if (changes < changeLimit && Utils.rand(2) === 0) {
			var buffer = "";
			if (player.gender < 2) {
				buffer += player.modFem(61, 4);
			} else {
				buffer += player.modFem(90, 4);
			}
			if (buffer !== "") {
				MainView.outputText(buffer, false);
				changes++;
			}
		}
		//De-wettification of cunt (down to 3?)!
		if (player.wetness() > 3 && changes < changeLimit && Utils.rand(3) === 0) {
			//Just to be safe
			if (player.hasVagina()) {
				MainView.outputText("\n\nThe constant flow of fluids that sluice from your " + Descriptors.vaginaDescript(0) + " slow down, leaving you feeling a bit less like a sexual slip-'n-slide.", false);
				player.vaginas[0].vaginalWetness--;
				changes++;
			}
		}
		//Fertility boost!
		if (changes < changeLimit && Utils.rand(4) === 0 && player.fertility < 50 && player.hasVagina()) {
			player.fertility += 2 + Utils.rand(5);
			changes++;
			MainView.outputText("\n\nYou feel strange.  Fertile... somehow.  You don't know how else to think of it, but you know your body is just aching to be pregnant and give birth.", false);
		}
		//-VAGs
		if (player.hasVagina() && player.findPerk(PerkLib.BunnyEggs) < 0 && changes < changeLimit && Utils.rand(4) === 0 && player.bunnyScore() > 3) {
			MainView.outputText("\n\nDeep inside yourself there is a change.  It makes you feel a little woozy, but passes quickly.  Beyond that, you aren't sure exactly what just happened, but you are sure it originated from your womb.\n\n", false);
			MainView.outputText("(<b>Perk Gained: Bunny Eggs</b>)", false);
			player.createPerk(PerkLib.BunnyEggs, 0, 0, 0, 0);
			changes++;
		}
		//Shrink Balls!
		if (player.balls > 0 && player.ballSize > 5 && Utils.rand(3) === 0 && changes < changeLimit) {
			if (player.ballSize < 10) {
				MainView.outputText("\n\nRelief washes through your groin as your " + Descriptors.ballsDescript() + " lose about an inch of their diameter.", false);
				player.ballSize--;
			} else if (player.ballSize < 25) {
				MainView.outputText("\n\nRelief washes through your groin as your " + Descriptors.ballsDescript() + " lose a few inches of their diameter.  Wow, it feels so much easier to move!", false);
				player.ballSize -= (2 + Utils.rand(3));
			} else {
				MainView.outputText("\n\nRelief washes through your groin as your " + Descriptors.ballsDescript() + " lose at least six inches of diameter.  Wow, it feels SOOOO much easier to move!", false);
				player.ballSize -= (6 + Utils.rand(3));
			}
			changes++;
		}
		//Get rid of extra balls
		if (player.balls > 2 && changes < changeLimit && Utils.rand(3) === 0) {
			changes++;
			MainView.outputText("\n\nThere's a tightening in your " + Descriptors.sackDescript() + " that only gets higher and higher until you're doubled over and wheezing.  When it passes, you reach down and discover that <b>two of your testicles are gone.</b>", false);
			player.balls -= 2;
		}
		//Boost cum production
		if ((player.balls > 0 || player.hasCock()) && player.cumQ() < 3000 && Utils.rand(3) === 0 && changeLimit > 1) {
			changes++;
			player.cumMultiplier += 3 + Utils.rand(7);
			if (player.cumQ() >= 250) {
				EngineCore.dynStats("lus", 3);
			}
			if (player.cumQ() >= 750) {
				EngineCore.dynStats("lus", 4);
			}
			if (player.cumQ() >= 2000) {
				EngineCore.dynStats("lus", 5);
			}
			//Balls
			if (player.balls > 0) {
				//(Small cum quantity) < 50
				if (player.cumQ() < 50) {
					MainView.outputText("\n\nA twinge of discomfort runs through your " + Descriptors.ballsDescriptLight() + ", but quickly vanishes.  You heft your orbs but they haven't changed in size – they just feel a little bit denser.", false);
				} else if (player.cumQ() < 250) {
					MainView.outputText("\n\nA ripple of discomfort runs through your " + Descriptors.ballsDescriptLight() + ", but it fades into a pleasant tingling.  You reach down to heft the orbs experimentally but they don't seem any larger.", false);
					if (player.hasCock()) {
						MainView.outputText("  In the process, you brush " + Descriptors.sMultiCockDesc() + " and discover a bead of pre leaking at the tip.", false);
					}
				} else if (player.cumQ() < 750) { //(large cum quantity) < 750
					MainView.outputText("\n\nA strong contraction passes through your " + Descriptors.sackDescript() + ", almost painful in its intensity.  ", false);
					if (player.hasCock()) {
						MainView.outputText(Descriptors.SMultiCockDesc() + " leaks and dribbles pre-cum down your " + player.legs() + " as your body's cum production kicks up even higher.", false);
					} else {
						MainView.outputText("You wince, feeling pent up and yet unable to release.  You really wish you had a cock right about now.", false);
					}
				} else if (player.cumQ() < 2000) { //(XL cum quantity) < 2000
					MainView.outputText("\n\nAn orgasmic contraction wracks your " + Descriptors.ballsDescriptLight() + ", shivering through the potent orbs and passing as quickly as it came.  ", false);
					if (player.hasCock()) {
						MainView.outputText("A thick trail of slime leaks from " + Descriptors.sMultiCockDesc() + " down your " + player.leg() + ", pooling below you.", false);
					} else {
						MainView.outputText("You grunt, feeling terribly pent-up and needing to release.  Maybe you should get a penis to go with these balls...", false);
					}
					MainView.outputText("  It's quite obvious that your cum production has gone up again.", false);
				} else { //(XXL cum quantity)
					MainView.outputText("\n\nA body-wrenching contraction thrums through your " + Descriptors.ballsDescriptLight() + ", bringing with it the orgasmic feeling of your body kicking into cum-production overdrive.  ", false);
					if (player.hasCock()) {
						MainView.outputText("pre-cum explodes from " + Descriptors.sMultiCockDesc() + ", running down your " + player.leg() + " and splattering into puddles that would shame the orgasms of lesser " + player.mf("males", "persons") + ".  You rub yourself a few times, nearly starting to masturbate on the spot, but you control yourself and refrain for now.", false);
					} else {
						MainView.outputText("You pant and groan but the pleasure just turns to pain.  You're so backed up – if only you had some way to vent all your seed!", false);
					}
				}
			} else { //NO BALLZ (guaranteed cock tho)
				//(Small cum quantity) < 50
				if (player.cumQ() < 50) {
					MainView.outputText("\n\nA twinge of discomfort runs through your body, but passes before you have any chance to figure out exactly what it did.", false);
				} else if (player.cumQ() < 250) { //(Medium cum quantity) < 250)
					MainView.outputText("\n\nA ripple of discomfort runs through your body, but it fades into a pleasant tingling that rushes down to " + Descriptors.sMultiCockDesc() + ".  You reach down to heft yourself experimentally and smile when you see pre-beading from your maleness.  Your cum production has increased!", false);
				} else if (player.cumQ() < 750) { //(large cum quantity) < 750
					MainView.outputText("\n\nA strong contraction passes through your body, almost painful in its intensity.  " + Descriptors.SMultiCockDesc() + " leaks and dribbles pre-cum down your " + player.legs() + " as your body's cum production kicks up even higher!  Wow, it feels kind of... good.", false);
				} else if (player.cumQ() < 2000) { //(XL cum quantity) < 2000
					MainView.outputText("\n\nAn orgasmic contraction wracks your abdomen, shivering through your midsection and down towards your groin.  A thick trail of slime leaks from " + Descriptors.sMultiCockDesc() + "  and trails down your " + player.leg() + ", pooling below you.  It's quite obvious that your body is producing even more cum now.", false);
				} else { //(XXL cum quantity)
					MainView.outputText("\n\nA body-wrenching contraction thrums through your gut, bringing with it the orgasmic feeling of your body kicking into cum-production overdrive.  pre-cum explodes from " + Descriptors.sMultiCockDesc() + ", running down your " + player.legs() + " and splattering into puddles that would shame the orgasms of lesser " + player.mf("males", "persons") + ".  You rub yourself a few times, nearly starting to masturbate on the spot, but you control yourself and refrain for now.", false);
				}
			}
		}
		//Bunny feet! - requirez earz
		if (player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_BUNNY && changes < changeLimit && Utils.rand(5) === 0 && player.earType === AppearanceDefs.EARS_BUNNY) {
			//Taurs
			if (player.isTaur()) {
				MainView.outputText("\n\nYour quadrupedal hind-quarters seizes, overbalancing your surprised front-end and causing you to stagger and fall to your side.  Pain lances throughout, contorting your body into a tightly clenched ball of pain while tendons melt and bones break, melt, and regrow.  When it finally stops, <b>you look down to behold your new pair of fur-covered rabbit feet</b>!", false);
			} else { //Non-taurs
				MainView.outputText("\n\nNumbness envelops your " + player.legs() + " as they pull tighter and tighter.  You overbalance and drop on your " + Descriptors.assDescript(), false);
				if (player.tailType > AppearanceDefs.TAIL_TYPE_NONE) {
					MainView.outputText(", nearly smashing your tail flat", false);
				} else {
					MainView.outputText(" hard enough to sting", false);
				}
				MainView.outputText(" while the change works its way through you.  Once it finishes, <b>you discover that you now have fuzzy bunny feet and legs</b>!", false);
			}
			changes++;
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_BUNNY;
		}
		//BUN FACE!  REQUIREZ EARZ
		if (player.earType === AppearanceDefs.EARS_BUNNY && player.faceType !== AppearanceDefs.FACE_BUNNY && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\n", false);
			changes++;
			//Human(ish) face
			if (player.faceType === AppearanceDefs.FACE_HUMAN || player.faceType === AppearanceDefs.FACE_SHARK_TEETH) {
				MainView.outputText("You catch your nose twitching on its own at the bottom of your vision, but as soon as you focus on it, it stops.  A moment later, some of your teeth tingle and brush past your lips, exposing a white pair of buckteeth!  <b>Your face has taken on some rabbit-like characteristics!</b>", false);
			} else { //Crazy furry TF shit
				MainView.outputText("You grunt as your " + player.face() + " twists and reforms.  Even your teeth ache as their positions are rearranged to match some new, undetermined order.  When the process finishes, <b>you're left with a perfectly human looking face, save for your constantly twitching nose and prominent buck-teeth.</b>", false);
			}
			player.faceType = AppearanceDefs.FACE_BUNNY;
		}
		//DAH BUNBUN EARZ - requires poofbutt!
		if (player.earType !== AppearanceDefs.EARS_BUNNY && changes < changeLimit && Utils.rand(3) === 0 && player.tailType === AppearanceDefs.TAIL_TYPE_RABBIT) {
			MainView.outputText("\n\nYour ears twitch and curl in on themselves, sliding around on the flesh of your head.  They grow warmer and warmer before they finally settle on the top of your head and unfurl into long, fluffy bunny-ears.  <b>You now have a pair of bunny ears.</b>", false);
			player.earType = AppearanceDefs.EARS_BUNNY;
			changes++;
		}
		//DAH BUNBUNTAILZ
		if (player.tailType !== AppearanceDefs.TAIL_TYPE_RABBIT && Utils.rand(2) === 0 && changes < changeLimit) {
			if (player.tailType > AppearanceDefs.TAIL_TYPE_NONE) {
				MainView.outputText("\n\nYour tail burns as it shrinks, pulling tighter and tighter to your backside until it's the barest hint of a stub.  At once, white, poofy fur explodes out from it.  <b>You've got a white bunny-tail!  It even twitches when you aren't thinking about it.</b>", false);
			} else {
				MainView.outputText("\n\nA burning pressure builds at your spine before dissipating in a rush of relief. You reach back and discover a small, fleshy tail that's rapidly growing long, poofy fur.  <b>You have a rabbit tail!</b>", false);
			}
			player.tailType = AppearanceDefs.TAIL_TYPE_RABBIT;
			changes++;
		}
		if ( Utils.rand(4) === 0 && player.gills && changes < changeLimit) {
			MainView.outputText("\n\nYour chest itches, and as you reach up to scratch it, you realize your gills have withdrawn into your skin.", false);
			player.gills = false;
			changes++;
		}
		//Bunny Breeder Perk?
		//FAILSAAAAFE
		if (changes === 0) {
			if (player.lib < 100) {
				changes++;
			}
			EngineCore.dynStats("lib", 1, "lus", (5 + player.lib / 7));
			if (player.lib < 30) {
				EngineCore.dynStats("lib", 1);
			}
			if (player.lib < 40) {
				EngineCore.dynStats("lib", 1);
			}
			if (player.lib < 60) {
				EngineCore.dynStats("lib", 1);
			}
			//Lower ones are gender specific for some reason
			if (player.lib < 60) {
				//(Cunts or assholes!
				if (!player.hasCock() || (player.gender === 3 && Utils.rand(2) === 0)) {
					if (player.lib < 30) {
						MainView.outputText("\n\nYou squirm a little and find your eyes glancing down to your groin.  Strange thoughts jump to mind, wondering how it would feel to breed until you're swollen and pregnant.  ", false);
						if (player.cor < 25) {
							MainView.outputText("You're repulsed by such shameful thoughts.", false);
						} else if (player.cor < 60) {
							MainView.outputText("You worry that this place is really getting to you.", false);
						} else if (player.cor < 90) {
							MainView.outputText("You pant a little and wonder where the nearest fertile male is.", false);
						} else {
							MainView.outputText("You grunt and groan with desire and disappointment.  You should get bred soon!", false);
						}
					} else {
						MainView.outputText("\n\nYour mouth rolls open as you start to pant with desire.  Did it get hotter?  Your hand reaches down to your " + player.assholeOrPussy() + ", and you're struck by just how empty it feels.  The desire to be filled, not by a hand or a finger but by a virile male, rolls through you like a wave, steadily increasing your desire for sex.", false);
					}
				}
				//WANGS!
				if (player.hasCock()) {
					if (player.lib < 30) {
						MainView.outputText("\n\nYou squirm a little and find your eyes glancing down to your groin.  Strange thoughts jump to mind, wondering how it would feel to fuck a ", false);
						if ( Utils.rand(2) === 0) {
							MainView.outputText("female hare until she's immobilized by all her eggs", false);
						} else {
							MainView.outputText("herm rabbit until her sack is so swollen that she's forced to masturbate over and over again just to regain mobility", false);
						}
						MainView.outputText(". ", false);
						if (player.cor < 25) {
							MainView.outputText("You're repulsed by such shameful thoughts.", false);
						} else if (player.cor < 50) {
							MainView.outputText("You worry that this place is really getting to you.", false);
						} else if (player.cor < 75) {
							MainView.outputText("You pant a little and wonder where the nearest fertile female is.", false);
						} else {
							MainView.outputText("You grunt and groan with desire and disappointment.  Gods you need to fuck!", false);
						}
					} else {
						MainView.outputText("\n\nYour mouth rolls open as you start to pant with desire.  Did it get hotter?  Your hand reaches down to " + Descriptors.sMultiCockDesc() + ", and you groan from how tight and hard it feels.  The desire to have it squeezed, not with your hand but with a tight pussy or puckered asshole, runs through you like a wave, steadily increasing your desire for sex.", false);
					}
				}
			} else if (player.lib < 80) { //Libido over 60? FUCK YEAH!
				MainView.outputText("\n\nYou fan your neck and start to pant as your " + player.skinTone + " skin begins to flush red with heat", false);
				if (player.skinType > AppearanceDefs.SKIN_TYPE_PLAIN) {
					MainView.outputText(" through your " + player.skinDesc, false);
				}
				MainView.outputText(".  ", false);
				if (player.gender === 1) {
					MainView.outputText("Compression tightens down on " + Descriptors.sMultiCockDesc() + " as it strains against your " + player.armorName + ".  You struggle to fight down your heightened libido, but it's hard – so very hard.", false);
				} else if (player.gender === 0) {
					MainView.outputText("Sexual hunger seems to gnaw at your " + Descriptors.assholeDescript() + ", demanding it be filled, but you try to resist your heightened libido.  It's so very, very hard.", false);
				} else if (player.gender === 2) {
					MainView.outputText("Moisture grows between your rapidly-engorging vulva, making you squish and squirm as you try to fight down your heightened libido, but it's hard – so very hard.", false);
				} else {
					MainView.outputText("Steamy moisture and tight compression war for your awareness in your groin as " + Descriptors.sMultiCockDesc() + " starts to strain against your " + player.armorName + ".  Your vulva engorges with blood, growing slicker and wetter.  You try so hard to fight down your heightened libido, but it's so very, very hard.  The urge to breed lingers in your mind, threatening to rear its ugly head.", false);
				}
			} else { //MEGALIBIDO
				MainView.outputText("\n\nDelicious, unquenchable desire rises higher and higher inside you, until you're having trouble tamping it down all the time.  A little, nagging voice questions why you would ever want to tamp it down.  It feels so good to give in and breed that you nearly cave to the delicious idea on the spot.  Life is beginning to look increasingly like constant fucking or masturbating in a lust-induced haze, and you're having a harder and harder time finding fault with it.  ", false);
				if (player.cor < 33) {
					MainView.outputText("You sigh, trying not to give in completely.", false);
				} else if (player.cor < 66) {
					MainView.outputText("You pant and groan, not sure how long you'll even want to resist.", false);
				} else {
					MainView.outputText("You smile and wonder if you can ", false);
					if (player.lib < 100) {
						MainView.outputText("get your libido even higher.", false);
					} else {
						MainView.outputText("find someone to fuck right now.", false);
					}
				}
			}
		}
	};
	Mutations.goldenSeed = function(type, player) {
		//'type' refers to the variety of seed.
		//0 === standard.
		//1 === enhanced - increase change limit and no pre-reqs for TF
		var changes = 0;
		var changeLimit = 1;
		if (type === 1) {
			changeLimit += 2;
		}
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		//Generic eating text:
		MainView.outputText("", true);
		MainView.outputText("You pop the nut into your mouth, chewing the delicious treat and swallowing it quickly.  No wonder harpies love these things so much!", false);
		//****************
		//Stats:
		//****************
		//-Speed increase to 100.
		if (player.spe < 100 && Utils.rand(3) === 0) {
			changes++;
			if (player.spe >= 75) {
				MainView.outputText("\n\nA familiar chill runs down your spine. Your muscles feel like well oiled machinery, ready to snap into action with lightning speed.", false);
			} else {
				MainView.outputText("\n\nA chill runs through your spine, leaving you feeling like your reflexes are quicker and your body faster.", false);
			}
			//Speed gains diminish as it rises.
			if (player.spe < 40) {
				EngineCore.dynStats("spe", 0.5);
			}
			if (player.spe < 75) {
				EngineCore.dynStats("spe", 0.5);
			}
			EngineCore.dynStats("spe", 0.5);
		}
		//-Toughness decrease to 50
		if (player.tou > 50 && Utils.rand(3) === 0 && changes < changeLimit) {
			changes++;
			if ( Utils.rand(2) === 0) {
				MainView.outputText("\n\nA nice, slow warmth rolls from your gut out to your limbs, flowing through them before dissipating entirely. As it leaves, you note that your body feels softer and less resilient.", false);
			} else {
				MainView.outputText("\n\nYou feel somewhat lighter, but consequently more fragile.  Perhaps your bones have changed to be more harpy-like in structure?", false);
			}
			EngineCore.dynStats("tou", -1);
		}
		//antianemone corollary:
		if (changes < changeLimit && player.hairType === 4 && Utils.rand(2) === 0) {
			//-insert anemone hair removal into them under whatever criteria you like, though hair removal should precede abdomen growth; here's some sample text:
			MainView.outputText("\n\nAs you down the seed, your head begins to feel heavier.  Reaching up, you notice your tentacles becoming soft and somewhat fibrous.  Pulling one down reveals that it feels soft and fluffy, almost feathery; you watch as it dissolves into many thin, feathery strands.  <b>Your hair is now like that of a harpy!</b>", false);
			player.hairType = 1;
			changes++;
		}
		//-Strength increase to 70
		if (player.str < 70 && Utils.rand(3) === 0 && changes < changeLimit) {
			changes++;
			//Faster until 40 str.
			if (player.str < 40) {
				MainView.outputText("\n\nShivering, you feel a feverish sensation that reminds you of the last time you got sick. Thankfully, it passes swiftly, leaving slightly enhanced strength in its wake.", false);
				EngineCore.dynStats("str", 0.5);
			} else { //(hi str – 50+)
				MainView.outputText("\n\nHeat builds in your muscles, their already-potent mass shifting slightly as they gain even more strength.", false);
			}
			EngineCore.dynStats("str", 0.5);
		}
		//-Libido increase to 90
		if ((player.lib < 90 || Utils.rand(3) === 0) && Utils.rand(3) === 0 && changes < changeLimit) {
			changes++;
			if (player.lib < 90) {
				EngineCore.dynStats("lib", 1);
			}
			//(sub 40 lib)
			if (player.lib < 40) {
				MainView.outputText("\n\nA passing flush colors your " + player.face() + " for a second as you daydream about sex. You blink it away, realizing the item seems to have affected your libido.", false);
				if (player.hasVagina()) {
					MainView.outputText(" The moistness of your " + Descriptors.vaginaDescript() + " seems to agree.", false);
				} else if (player.hasCock()) {
					MainView.outputText(" The hardness of " + Descriptors.sMultiCockDesc() + " seems to agree.", false);
				}
				EngineCore.dynStats("lus", 5);
			} else if (player.lib < 75) { //(sub 75 lib)
				MainView.outputText("\n\nHeat, blessed heat, works through you from head to groin, leaving you to shudder and fantasize about the sex you could be having right now.\n\n", false);
			} else if (player.lib < 90) { //(hi lib)
				MainView.outputText("\n\nSexual need courses through you, flushing your skin with a reddish hue while you pant and daydream of the wondrous sex you should be having right now.\n\n", false);
			} else { //(90+)
				MainView.outputText("\n\nYou groan, something about the seed rubbing your libido in just the right way to make you horny. Panting heavily, you sigh and fantasize about the sex you could be having.\n\n", false);
			}
			//(fork to fantasy)
			if (player.lib >= 40) {
				EngineCore.dynStats("lus", (player.lib / 5 + 10));
				//(herm – either or!)
				//Cocks!
				if (player.hasCock() && (player.gender !== 3 || Utils.rand(2) === 0)) {
					//(male 1)
					if ( Utils.rand(2) === 0) {
						MainView.outputText("In your fantasy you're winging through the sky, " + Descriptors.sMultiCockDesc() + " already hard and drizzling with male moisture while you circle an attractive harpy's nest. Her plumage is as blue as the sky, her eyes the shining teal of the sea, and legs splayed in a way that shows you how ready she is to be bred. You fold your wings and dive, wind whipping through your " + Descriptors.hairDescript() + " as she grows larger and larger. With a hard, body-slapping impact you land on top of her, plunging your hard, ready maleness into her hungry box. ", false);
						if (player.cockTotal() > 1) {
							MainView.outputText("The extra penis", false);
							if (player.cockTotal() > 2) {
								MainView.outputText("es rub ", false);
							} else {
								MainView.outputText("rubs ", false);
							}
							MainView.outputText("the skin over her taut, empty belly, drooling your need atop her.  ", false);
							MainView.outputText("You jolt from the vision unexpectedly, finding your " + Descriptors.sMultiCockDesc() + " is as hard as it was in the dream. The inside of your " + player.armorName + " is quite messy from all the pre-cum you've drooled. Perhaps you can find a harpy nearby to lie with.", false);
						}
					} else { //(male 2)
						MainView.outputText("In your fantasy you're lying back in the nest your harem built for you, stroking your dick and watching the sexy bird-girl spread her thighs to deposit another egg onto the pile. The lewd moans do nothing to sate your need, and you beckon for another submissive harpy to approach. She does, her thick thighs swaying to show her understanding of your needs. The bird-woman crawls into your lap, sinking down atop your shaft to snuggle it with her molten heat. She begins kissing you, smearing your mouth with her drugged lipstick until you release the first of many loads. You sigh, riding the bliss, secure in the knowledge that this 'wife' won't let up until she's gravid with another egg. Then it'll be her sister-wife's turn. The tightness of " + Descriptors.sMultiCockDesc() + " inside your " + player.armorName + " rouses you from the dream, reminding you that you're just standing there, leaking your need into your gear.", false);
					}
				} else if (player.hasVagina()) { //Cunts!
					//(female 1)
					if ( Utils.rand(2) === 0) {
						MainView.outputText("In your fantasy you're a happy harpy mother, your womb stretched by the sizable egg it contains. The surging hormones in your body arouse you again, and you turn to the father of your children, planting a wet kiss on his slobbering, lipstick-gilt cock. The poor adventurer writhes, hips pumping futilely in the air. He's been much more agreeable since you started keeping his cock coated with your kisses. You mount the needy boy, fantasizing about that first time when you found him near the portal, in the ruins of your old camp. The feeling of your stiff nipples ", false);
						if (player.hasFuckableNipples()) {
							MainView.outputText("and pussy leaking over ", false);
						} else if (player.biggestLactation() >= 1.5) {
							MainView.outputText("dripping milk inside ", false);
						} else {
							MainView.outputText("rubbing inside ", false);
						}
						MainView.outputText("your " + player.armorName + " shocks you from the dream, leaving you with nothing but the moistness of your loins for company. Maybe next year you'll find the mate of your dreams?", false);
					} else { //(female 2)
						MainView.outputText("In your fantasy you're sprawled on your back, thick thighs splayed wide while you're taken by a virile male. The poor stud was wandering the desert all alone, following some map, but soon you had his bright red rod sliding between your butt-cheeks, the pointed tip releasing runnels of submission to lubricate your loins. You let him mount your pussy before you grabbed him with your powerful thighs and took off. He panicked at first, but the extra blood flow just made him bigger. He soon forgot his fear and focused on the primal needs of all males – mating with a gorgeous harpy. You look back at him and wink, feeling his knot build inside you. Your aching, tender " + Descriptors.nippleDescript(0) + "s pull you out of the fantasy as they rub inside your " + player.armorName + ". Maybe once your quest is over you'll be able to find a shy, fertile male to mold into the perfect cum-pump.", false);
					}
				}
			}
		}
		//****************
		//   Sexual:
		//****************
		//-Grow a cunt (guaranteed if no gender)
		if (player.gender === 0 || (!player.hasVagina() && changes < changeLimit && Utils.rand(3) === 0)) {
			changes++;
			//(balls)
			if (player.balls > 0) {
				MainView.outputText("\n\nAn itch starts behind your " + Descriptors.ballsDescriptLight() + ", but before you can reach under to scratch it, the discomfort fades. A moment later a warm, wet feeling brushes your " + Descriptors.sackDescript() + ", and curious about the sensation, <b>you lift up your balls to reveal your new vagina.</b>", false);
			} else if (player.hasCock()) { //(dick)
				MainView.outputText("\n\nAn itch starts on your groin, just below your " + Descriptors.multiCockDescriptLight() + ". You pull your manhood aside to give you a better view, and you're able to watch as <b>your skin splits to give you a new vagina, complete with a tiny clit.</b>", false);
			} else { //(neither)
				MainView.outputText("\n\nAn itch starts on your groin and fades before you can take action. Curious about the intermittent sensation, <b>you peek under your " + player.armorName + " to discover your brand new vagina, complete with pussy lips and a tiny clit.</b>", false);
			}
			player.createVagina();
			player.clitLength = 0.25;
			EngineCore.dynStats("sen", 10);
			player.genderCheck();
		}
		//-Remove extra breast rows
		if (changes < changeLimit && player.breastRows.length > 1 && Utils.rand(3) === 0 && !CoC.flags[kFLAGS.HYPER_HAPPY]) {
			changes++;
			MainView.outputText("\n\nYou stumble back when your center of balance shifts, and though you adjust before you can fall over, you're left to watch in awe as your bottom-most " + Descriptors.breastDescript(player.breastRows.length - 1) + " shrink down, disappearing completely into your ", false);
			if (player.breastRows.length >= 3) {
				MainView.outputText("abdomen", false);
			} else {
				MainView.outputText("chest", false);
			}
			MainView.outputText(". The " + Descriptors.nippleDescript(player.breastRows.length - 1) + "s even fade until nothing but ", false);
			if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
				MainView.outputText(player.hairColor + " " + player.skinDesc, false);
			} else {
				MainView.outputText(player.skinTone + " " + player.skinDesc, false);
			}
			MainView.outputText(" remains. <b>You've lost a row of breasts!</b>", false);
			EngineCore.dynStats("sen", -5);
			player.removeBreastRow(player.breastRows.length - 1, 1);
		} else if (changes < changeLimit && player.breastRows.length === 1 && Utils.rand(3) === 0 && player.breastRows[0].breastRating >= 7 && !CoC.flags[kFLAGS.HYPER_HAPPY]) { //-Shrink tits if above DDs. //Cannot happen at same time as row removal
			changes++;
			//(Use standard breast shrinking mechanism if breasts are under 'h')
			if (player.breastRows[0].breastRating < 19) {
				player.shrinkTits();
			} else { //(H+)
				player.breastRows[0].breastRating -= (4 + Utils.rand(4));
				MainView.outputText("\n\nYour chest pinches tight, wobbling dangerously for a second before the huge swell of your bust begins to shrink into itself. The weighty mounds jiggle slightly as they shed cup sizes like old, discarded coats, not stopping until they're " + player.breastCup(0) + "s.", false);
			}
		}
		//-Grow tits to a B-cup if below.
		if (changes < changeLimit && player.breastRows[0].breastRating < 2 && Utils.rand(3) === 0) {
			changes++;
			MainView.outputText("\n\nYour chest starts to tingle, the " + player.skinDesc + " warming under your " + player.armorName + ". Reaching inside to feel the tender flesh, you're quite surprised when it puffs into your fingers, growing larger and larger until it settles into a pair of B-cup breasts.", false);
			if (player.breastRows[0].breastRating < 1) {
				MainView.outputText("  <b>You have breasts now!</b>", false);
			}
			player.breastRows[0].breastRating = 2;
		}
		//****************
		//General Appearance:
		//****************
		//-Femininity to 85
		if (player.femininity < 85 && changes < changeLimit && Utils.rand(3) === 0) {
			changes++;
			MainView.outputText(player.modFem(85, 3 + Utils.rand(5)), false);
		}
		//-Skin color change – tan, olive, dark, light
		if ((player.skinTone !== "tan" && player.skinTone !== "olive" && player.skinTone !== "dark" && player.skinTone !== "light") && changes < changeLimit && Utils.rand(5) === 0) {
			changes++;
			MainView.outputText("\n\nIt takes a while for you to notice, but <b>", false);
			if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
				MainView.outputText("the skin under your " + player.hairColor + " " + player.skinDesc, false);
			} else {
				MainView.outputText("your " + player.skinDesc, false);
			}
			MainView.outputText(" has changed to become ", false);
			player.skinTone = Utils.randomChoice("tan", "olive", "dark", "light");
			MainView.outputText(player.skinTone + " colored.</b>", false);
		}
		//-Grow hips out if narrow.
		if (player.hipRating < 10 && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nYour gait shifts slightly to accommodate your widening " + Descriptors.hipDescript() + ". The change is subtle, but they're definitely broader.", false);
			player.hipRating++;
			changes++;
		}
		//-Narrow hips if crazy wide
		if (player.hipRating >= 15 && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nYour gait shifts inward, your " + Descriptors.hipDescript() + " narrowing significantly. They remain quite thick, but they're not as absurdly wide as before.", false);
			player.hipRating--;
			changes++;
		}
		//-Big booty
		if (player.buttRating < 8 && changes < changeLimit && Utils.rand(3) === 0) {
			player.buttRating++;
			changes++;
			MainView.outputText("\n\nA slight jiggle works through your rear, but instead of stopping it starts again. You can actually feel your " + player.armorName + " being filled out by the growing cheeks. When it stops, you find yourself the proud owner of a " + Descriptors.buttDescript() + ".", false);
		}
		//-Narrow booty if crazy huge.
		if (player.buttRating >= 14 && changes < changeLimit && Utils.rand(4) === 0) {
			changes++;
			player.buttRating--;
			MainView.outputText("\n\nA feeling of tightness starts in your " + Descriptors.buttDescript() + ", increasing gradually. The sensation grows and grows, but as it does your center of balance shifts. You reach back to feel yourself, and sure enough your massive booty is shrinking into a more manageable size.", false);
		}
		//-Body thickness to 25ish
		if (player.thickness > 25 && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText(player.modThickness(25, 3 + Utils.rand(4)), false);
			changes++;
		}
		//Remove odd eyes
		if (changes < changeLimit && Utils.rand(5) === 0 && player.eyeType > AppearanceDefs.EYES_HUMAN) {
			if (player.eyeType === AppearanceDefs.EYES_BLACK_EYES_SAND_TRAP) {
				MainView.outputText("\n\nYou feel a twinge in your eyes and you blink.  It feels like black cataracts have just fallen away from you, and you know without needing to see your reflection that your eyes have gone back to looking human.");
			} else {
				MainView.outputText("\n\nYou blink and stumble, a wave of vertigo threatening to pull your " + player.feet() + " from under you.  As you steady and open your eyes, you realize something seems different.  Your vision is changed somehow.", false);
				if (player.eyeType === AppearanceDefs.EYES_FOUR_SPIDER_EYES) {
					MainView.outputText("  Your multiple, arachnid eyes are gone!</b>", false);
				}
				MainView.outputText("  <b>You have normal, humanoid eyes again.</b>", false);
			}
			player.eyeType = AppearanceDefs.EYES_HUMAN;
			changes++;
		}
		//****************
		//Harpy Appearance:
		//****************
		//-Harpy legs
		if (player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_HARPY && changes < changeLimit && (type === 1 || player.tailType === AppearanceDefs.TAIL_TYPE_HARPY) && Utils.rand(4) === 0) {
			//(biped/taur)
			if (!player.isGoo()) {
				MainView.outputText("\n\nYour " + player.legs() + " creak ominously a split-second before they go weak and drop you on the ground. They go completely limp, twisting and reshaping before your eyes in ways that make you wince. Your lower body eventually stops, but the form it's settled on is quite thick in the thighs. Even your " + player.feet() + " have changed.  ", false);
			} else { //goo
				MainView.outputText("\n\nYour gooey undercarriage loses some of its viscosity, dumping you into the puddle that was once your legs. As you watch, the fluid pulls together into a pair of distinctly leg-like shapes, solidifying into a distinctly un-gooey form. You've even regained a pair of feet!  ", false);
			}
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HARPY;
			changes++;
			//(cont)
			MainView.outputText("While humanoid in shape, they have two large, taloned toes on the front and a single claw protruding from the heel. The entire ensemble is coated in " + player.hairColor + " feathers from ankle to hip, reminding you of the bird-women of the mountains. <b>You now have harpy legs!</b>", false);
		}
		//-Feathery Tail
		if (player.tailType !== AppearanceDefs.TAIL_TYPE_HARPY && changes < changeLimit && (type === 1 || player.wingType === AppearanceDefs.WING_TYPE_FEATHERED_LARGE) && Utils.rand(4) === 0) {
			//(tail)
			if (player.tailType > AppearanceDefs.TAIL_TYPE_NONE) {
				MainView.outputText("\n\nYour tail shortens, folding into the crack of your " + Descriptors.buttDescript() + " before it disappears. A moment later, a fan of feathers erupts in its place, fluffing up and down instinctively every time the breeze shifts. <b>You have a feathery harpy tail!</b>", false);
			} else {
				MainView.outputText("\n\nA tingling tickles the base of your spine, making you squirm in place. A moment later, it fades, but a fan of feathers erupts from your " + player.skinDesc + " in its place. The new tail fluffs up and down instinctively with every shift of the breeze. <b>You have a feathery harpy tail!</b>", false);
			}
			player.tailType = AppearanceDefs.TAIL_TYPE_HARPY;
			changes++;
		}
		//-Propah Wings
		if (player.wingType === AppearanceDefs.WING_TYPE_NONE && changes < changeLimit && (type === 1 || player.armType === AppearanceDefs.ARM_TYPE_HARPY) && Utils.rand(4) === 0) {
			MainView.outputText("\n\nPain lances through your back, the muscles knotting oddly and pressing up to bulge your " + player.skinDesc + ". It hurts, oh gods does it hurt, but you can't get a good angle to feel at the source of your agony. A loud crack splits the air, and then your body is forcing a pair of narrow limbs through a gap in your " + player.armorName + ". Blood pumps through the new appendages, easing the pain as they fill out and grow. Tentatively, you find yourself flexing muscles you didn't know you had, and <b>you're able to curve the new growths far enough around to behold your brand new, " + player.hairColor + " wings.</b>", false);
			player.wingType = AppearanceDefs.WING_TYPE_FEATHERED_LARGE;
			player.wingDesc = "large, feathered";
			changes++;
		}
		//-Remove old wings
		if (player.wingType !== AppearanceDefs.WING_TYPE_FEATHERED_LARGE && player.wingType > AppearanceDefs.WING_TYPE_NONE && changes < changeLimit && Utils.rand(4) === 0) {
			if (player.wingType !== AppearanceDefs.WING_TYPE_SHARK_FIN) {
				MainView.outputText("\n\nSensation fades from your " + player.wingDesc + " wings slowly but surely, leaving them dried out husks that break off to fall on the ground. Your back closes up to conceal the loss, as smooth and unbroken as the day you entered the portal.", false);
			} else {
				MainView.outputText("\n\nSensation fades from your large fin slowly but surely, leaving it a dried out husk that breaks off to fall on the ground. Your back closes up to conceal the loss, as smooth and unbroken as the day you entered the portal.", false);
			}
			player.wingType = AppearanceDefs.WING_TYPE_NONE;
			player.wingDesc = "non-existant";
			changes++;
		}
		//-Feathery Arms
		if (player.armType !== AppearanceDefs.ARM_TYPE_HARPY && changes < changeLimit && (type === 1 || player.hairType === 1) && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYou smile impishly as you lick the last bits of the nut from your teeth, but when you go to wipe your mouth, instead of the usual texture of your " + player.skinDesc + " on your lips, you feel feathers! You look on in horror while more of the avian plumage sprouts from your " + player.skinDesc + ", covering your forearms until <b>your arms look vaguely like wings</b>. Your hands remain unchanged thankfully. It'd be impossible to be a champion without hands! The feathery limbs might help you maneuver if you were to fly, but there's no way they'd support you alone.", false);
			changes++;
			player.armType = AppearanceDefs.ARM_TYPE_HARPY;
		}
		//-Feathery Hair
		if (player.hairType !== 1 && changes < changeLimit && (type === 1 || player.faceType === AppearanceDefs.FACE_HUMAN) && Utils.rand(4) === 0) {
			MainView.outputText("\n\nA tingling starts in your scalp, getting worse and worse until you're itching like mad, the feathery strands of your hair tickling your fingertips while you scratch like a dog itching a flea. When you pull back your hand, you're treated to the sight of downy fluff trailing from your fingernails. A realization dawns on you - you have feathers for hair, just like a harpy!", false);
			player.hairType = 1;
			changes++;
		}
		//-Human face
		if (player.faceType !== AppearanceDefs.FACE_HUMAN && changes < changeLimit && (type === 1 || (player.earType === AppearanceDefs.EARS_HUMAN || player.earType === AppearanceDefs.EARS_ELFIN)) && Utils.rand(4) === 0) {
			MainView.outputText("\n\nSudden agony sweeps over your " + player.face() + ", your visage turning hideous as bones twist and your jawline shifts. The pain slowly vanishes, leaving you weeping into your fingers. When you pull your hands away you realize you've been left with a completely normal, human face.", false);
			player.faceType = AppearanceDefs.FACE_HUMAN;
			changes++;
		}
		//-Gain human ears (keep elf ears)
		if ((player.earType !== AppearanceDefs.EARS_HUMAN && player.earType !== AppearanceDefs.EARS_ELFIN) && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nOuch, your head aches! It feels like your ears are being yanked out of your head, and when you reach up to hold your aching noggin, you find they've vanished! Swooning and wobbling with little sense of balance, you nearly fall a half-dozen times before <b>a pair of normal, human ears sprout from the sides of your head.</b> You had almost forgotten what human ears felt like!", false);
			player.earType = AppearanceDefs.EARS_HUMAN;
			changes++;
		}
		if ( Utils.rand(4) === 0 && player.gills && changes < changeLimit) {
			MainView.outputText("\n\nYour chest itches, and as you reach up to scratch it, you realize your gills have withdrawn into your skin.", false);
			player.gills = false;
			changes++;
		}
		//SPECIAL:
		//Harpy Womb – All eggs are automatically upgraded to large, requires legs + tail to be harpy.
		if (player.findPerk(PerkLib.HarpyWomb) < 0 && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HARPY && player.tailType === AppearanceDefs.TAIL_TYPE_HARPY && Utils.rand(4) === 0 && changes < changeLimit) {
			player.createPerk(PerkLib.HarpyWomb, 0, 0, 0, 0);
			MainView.outputText("\n\nThere's a rumbling in your womb, signifying that some strange change has taken place in your most feminine area. No doubt something in it has changed to be more like a harpy. (<b>You've gained the Harpy Womb perk! All the eggs you lay will always be large so long as you have harpy legs and a harpy tail.</b>)", false);
			changes++;
		}
		if (changes < changeLimit && Utils.rand(4) === 0 && ((player.ass.analWetness > 0 && player.findPerk(PerkLib.MaraesGiftButtslut) < 0) || player.ass.analWetness > 1)) {
			MainView.outputText("\n\nYou feel a tightening up in your colon and your [asshole] sucks into itself.  You feel sharp pain at first but that thankfully fades.  Your ass seems to have dried and tightened up.");
			player.ass.analWetness--;
			if (player.ass.analLooseness > 1) {
				player.ass.analLooseness--;
			}
			changes++;
		}
		//Nipples Turn Back:
		if (player.findStatusAffect(StatusAffects.BlackNipples) >= 0 && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nSomething invisible brushes against your " + Descriptors.nippleDescript(0) + ", making you twitch.  Undoing your clothes, you take a look at your chest and find that your nipples have turned back to their natural flesh colour.");
			changes++;
			player.removeStatusAffect(StatusAffects.BlackNipples);
		}
		//Debugcunt
		if (changes < changeLimit && Utils.rand(3) === 0 && player.vaginaType() === 5 && player.hasVagina()) {
			MainView.outputText("\n\nSomething invisible brushes against your sex, making you twinge.  Undoing your clothes, you take a look at your vagina and find that it has turned back to its natural flesh colour.");
			player.vaginaType(0);
			changes++;
		}
		if (changes === 0) {
			MainView.outputText("\n\nAside from being a tasty treat, it doesn't seem to do anything to you this time.", false);
		}
	};
	/*
	 General Effects:
	 -Speed to 70
	 -Int to 10

	 Appearance Effects:
	 -Hip widening funtimes
	 -Remove feather-arms (copy this for goblin ale, mino blood, equinum, canine pepps, demon items)
	 -Remove feathery hair (copy for equinum, canine peppers, Labova)

	 Sexual:
	 -Shrink balls down to reasonable size (3?)
	 -Shorten clits to reasonable size
	 -Shrink dicks down to 8\" max.
	 -Rut/heat

	 Big Roo Tfs:
	 -Roo ears
	 -Roo tail
	 -Roo footsies
	 -Fur
	 -Roo face*/
	Mutations.kangaFruit = function(type, player) {
		MainView.outputText("", true);
		MainView.outputText("You squeeze the pod around the middle, forcing the end open.  Scooping out a handful of the yeasty-smelling seeds, you shovel them in your mouth.  Blech!  Tastes like soggy burnt bread... and yet, you find yourself going for another handful...", false);
		//Used to track changes and the max
		var changes = 0;
		var changeLimit = 1;
		if (type === 1) {
			changeLimit += 2;
		}
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		//****************
		//General Effects:
		//****************
		//-Int less than 10
		if (player.inte < 10) {
			if (player.inte < 8 && player.kangaScore() >= 5) {
				MainView.outputText("\n\nWhile you gnaw on the fibrous fruit, your already vacant mind continues to empty, leaving nothing behind but the motion of your jaw as you slowly chew and swallow your favorite food.  Swallow.  Chew.  Swallow.  You don't even notice your posture worsening or your arms shortening.  Without a single thought, you start to hunch over but keep munching on the food in your paws as if were the most normal thing in the world.  Teeth sink into one of your fingers, leaving you to yelp in pain.  With the last of your senses, you look at your throbbing paw to notice you've run out of kanga fruit!", false);
				MainView.outputText("\n\nStill hungry and licking your lips in anticipation, you sniff in deep lungfuls of air.  There's more of that wonderful fruit nearby!  You bound off in search of it on your incredibly muscular legs, their shape becoming more and more feral with every hop.  Now guided completely by instinct, you find a few stalks that grow from the ground.  Your belly rumbles, reminding you of your hunger, as you begin to dig into the kanga fruits...", false);
				MainView.outputText("\n\nLosing more of what little remains of yourself, your body is now entirely that of a feral kangaroo and your mind has devolved to match it.  After you finish the handful of fruits you found, you move on in search for more of the tasty treats.  Though you pass by your camp later on, there's no memory, no recognition, just a slight feeling of comfort and familiarity.  There's no food here so you hop away.", false);
				//[GAME OVER]
				EngineCore.gameOver();
				return;
			}
			MainView.outputText("\n\nWhile chewing, your mind becomes more and more tranquil.  You find it hard to even remember your mission, let alone your name.  <b>Maybe more kanga fruits will help?</b>", false);
		}
		//-Speed to 70
		if (player.spe < 70 && Utils.rand(3) === 0) {
			//2 points up if below 40!
			if (player.spe < 40) {
				EngineCore.dynStats("spe", 1);
			}
			EngineCore.dynStats("spe", 1);
			MainView.outputText("\n\nYour legs fill with energy as you eat the kanga fruit.  You feel like you could set a long-jump record!  You give a few experimental bounds, both standing and running, with your newfound vigor.  Your stride seems longer too; you even catch a bit of air as you push off with every powerful step.", false);
			changes++;
		}
		//-Int to 10
		if (player.inte > 2 && Utils.rand(3) === 0 && changes < changeLimit) {
			changes++;
			//Gain dumb (smart!)
			if (player.inte > 30) {
				MainView.outputText("\n\nYou feel... antsy. You momentarily forget your other concerns as you look around you, trying to decide which direction you'd be most likely to find more food in.  You're about to set out on the search when your mind refocuses and you realize you already have some stored at camp.", false);
			} else if (player.inte > 10) { //gain dumb (30-10 int):
				MainView.outputText("\n\nYour mind wanders as you eat; you think of what it would be like to run forever, bounding across the wastes of Mareth in the simple joy of movement.  You bring the kanga fruit to your mouth one last time, only to realize there's nothing edible left on it.  The thought brings you back to yourself with a start.", false);
			} else { //gain dumb (10-1 int):
				MainView.outputText("\n\nYou lose track of everything as you eat, staring at the bugs crawling across the ground.  After a while you notice the dull taste of saliva in your mouth and realize you've been sitting there, chewing the same mouthful for five minutes.  You vacantly swallow and take another bite, then go back to staring at the ground.  Was there anything else to do today?", false);
			}
			EngineCore.dynStats("int", -1);
		}
		//****************
		//Appearance Effects:
		//****************
		//-Hip widening funtimes
		if (changes < changeLimit && Utils.rand(4) === 0 && player.hipRating < 40) {
			MainView.outputText("\n\nYou weeble and wobble as your hipbones broaden noticeably, but somehow you don't fall down.  Actually, you feel a bit MORE stable on your new widened stance, if anything.", false);
			player.hipRating++;
			changes++;
		}
		//-Remove feather-arms (copy this for goblin ale, mino blood, equinum, canine pepps, demon items)
		if (changes < changeLimit && player.armType === AppearanceDefs.ARM_TYPE_HARPY && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYou scratch at your biceps absentmindedly, but no matter how much you scratch, it isn't getting rid of the itch.  Glancing down in irritation, you discover that your feathery arms are shedding their feathery coating.  The wing-like shape your arms once had is gone in a matter of moments, leaving " + player.skinDesc + " behind.", false);
			player.armType = AppearanceDefs.ARM_TYPE_HUMAN;
			changes++;
		}
		//-Remove chitin-arms (copy this for goblin ale, mino blood, equinum, canine pepps, demon items)
		if (changes < changeLimit && player.armType === AppearanceDefs.ARM_TYPE_SPIDER && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYou scratch at your biceps absentmindedly, but no matter how much you scratch, it isn't getting rid of the itch.  Glancing down in irritation, you discover that your arms' chitinous covering is flaking away.  The glossy black coating is soon gone, leaving " + player.skinDesc + " behind.", false);
			player.armType = AppearanceDefs.ARM_TYPE_HUMAN;
			changes++;
		}
		//-Remove feathery hair (copy for equinum, canine peppers, Labova)
		if (changes < changeLimit && player.hairType === 1 && Utils.rand(4) === 0) {
			//(long):
			if (player.hairLength >= 6) {
				MainView.outputText("\n\nA lock of your downy-soft feather-hair droops over your eye.  Before you can blow the offending down away, you realize the feather is collapsing in on itself.  It continues to curl inward until all that remains is a normal strand of hair.  <b>Your hair is no longer feathery!</b>", false);
			} else { //(short)
				MainView.outputText("\n\nYou run your fingers through your downy-soft feather-hair while you await the effects of the item you just ingested.  While your hand is up there, it detects a change in the texture of your feathers.  They're completely disappearing, merging down into strands of regular hair.  <b>Your hair is no longer feathery!</b>", false);
			}
			changes++;
			player.hairType = 0;
		}
		//Remove odd eyes
		if (changes < changeLimit && Utils.rand(5) === 0 && player.eyeType > AppearanceDefs.EYES_HUMAN) {
			if (player.eyeType === AppearanceDefs.EYES_BLACK_EYES_SAND_TRAP) {
				MainView.outputText("\n\nYou feel a twinge in your eyes and you blink.  It feels like black cataracts have just fallen away from you, and you know without needing to see your reflection that your eyes have gone back to looking human.");
			} else {
				MainView.outputText("\n\nYou blink and stumble, a wave of vertigo threatening to pull your " + player.feet() + " from under you.  As you steady and open your eyes, you realize something seems different.  Your vision is changed somehow.", false);
				if (player.eyeType === AppearanceDefs.EYES_FOUR_SPIDER_EYES) {
					MainView.outputText("  Your multiple, arachnid eyes are gone!</b>", false);
				}
				MainView.outputText("  <b>You have normal, humanoid eyes again.</b>", false);
			}
			player.eyeType = AppearanceDefs.EYES_HUMAN;
			changes++;
		}
		//****************
		//Sexual:
		//****************
		//-Shrink balls down to reasonable size (3?)
		if (player.ballSize >= 4 && changes < changeLimit && Utils.rand(2) === 0) {
			player.ballSize--;
			player.cumMultiplier++;
			MainView.outputText("\n\nYour " + Descriptors.sackDescript() + " pulls tight against your groin, vibrating slightly as it changes.  Once it finishes, you give your " + Descriptors.ballsDescriptLight() + " a gentle squeeze and discover they've shrunk.  Even with the reduced volume, they feel just as heavy.", false);
			changes++;
		}
		//-Shorten clits to reasonable size
		if (player.clitLength >= 4 && changes < changeLimit && Utils.rand(5) === 0) {
			MainView.outputText("\n\nPainful pricks work through your " + Descriptors.clitDescript() + ", all the way into its swollen clitoral sheath.  Gods, it feels afire with pain!  Agony runs up and down its length, and by the time the pain finally fades, the feminine organ has lost half its size.", false);
			player.clitLength /= 2;
			changes++;
		}
		//-Shrink dicks down to 8\" max.
		if (player.hasCock()) {
			//Find biggest dick!
			var biggestCock = player.biggestCockIndex();
			if (player.cocks[biggestCock].cockLength >= 16 && changes < changeLimit && Utils.rand(5) === 0) {
				MainView.outputText("\n\nA roiling inferno of heat blazes in your " + Descriptors.cockDescript(biggestCock) + ", doubling you over in the dirt.  You rock back and forth while tears run unchecked down your cheeks.  Once the pain subsides and you're able to move again, you find the poor member has lost nearly half its size.", false);
				player.cocks[biggestCock].cockLength /= 2;
				player.cocks[biggestCock].cockThickness /= 1.5;
				if (player.cocks[biggestCock].cockThickness * 6 > player.cocks[biggestCock].cockLength) {
					player.cocks[biggestCock].cockThickness -= 0.2;
				}
				if (player.cocks[biggestCock].cockThickness * 8 > player.cocks[biggestCock].cockLength) {
					player.cocks[biggestCock].cockThickness -= 0.2;
				}
				if (player.cocks[biggestCock].cockThickness < 0.5) {
					player.cocks[biggestCock].cockThickness = 0.5;
				}
				changes++;
			}
			//COCK TF!
			if (player.kangaCocks() < player.cockTotal() && (type === 1 && Utils.rand(2) === 0) && changes < changeLimit) {
				MainView.outputText("\n\nYou feel a sharp pinch at the end of your penis and whip down your clothes to check.  Before your eyes, the tip of it collapses into a narrow point and the shaft begins to tighten behind it, assuming a conical shape before it retracts into ", false);
				if (player.hasSheath()) {
					MainView.outputText("your sheath", false);
				} else {
					MainView.outputText("a sheath that forms at the base of it", false);
				}
				MainView.outputText(".  <b>You now have a kangaroo-penis!</b>", false);
				var firstNonKangarooCock = _.find(player.cocks, function(cock) { return cock.cockType !== CockTypesEnum.KANGAROO; });
				firstNonKangarooCock.cockType = CockTypesEnum.KANGAROO;
				firstNonKangarooCock.knotMultiplier = 1;
				changes++;
			}
		}
		//****************
		//Big Kanga Morphs
		//type 1 ignores normal restrictions
		//****************
		//-Face (Req: Fur + Feet)
		if (player.faceType !== AppearanceDefs.FACE_KANGAROO && ((player.skinType === AppearanceDefs.SKIN_TYPE_FUR && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_KANGAROO) || type === 1) && changes < changeLimit && Utils.rand(4) === 0) {
			//gain roo face from human/naga/shark/bun:
			if (player.faceType === AppearanceDefs.FACE_HUMAN || player.faceType === AppearanceDefs.FACE_SNAKE_FANGS || player.faceType === AppearanceDefs.FACE_SHARK_TEETH || player.faceType === AppearanceDefs.FACE_BUNNY) {
				MainView.outputText("\n\nThe base of your nose suddenly hurts, as though someone were pinching and pulling at it.  As you shut your eyes against the pain and bring your hands to your face, you can feel your nose and palate shifting and elongating.  This continues for about twenty seconds as you stand there, quaking.  When the pain subsides, you run your hands all over your face; what you feel is a long muzzle sticking out, whiskered at the end and with a cleft lip under a pair of flat nostrils.  You open your eyes and receive confirmation. <b>You now have a kangaroo face!  Crikey!</b>", false);
			} else { //gain roo face from other snout:
				MainView.outputText("\n\nYour nose tingles. As you focus your eyes toward the end of it, it twitches and shifts into a muzzle similar to a stretched-out rabbit's, complete with harelip and whiskers.  <b>You now have a kangaroo face!</b>", false);
			}
			changes++;
			player.faceType = AppearanceDefs.FACE_KANGAROO;
		}
		//-Fur (Req: Footsies)
		if (player.skinType !== AppearanceDefs.SKIN_TYPE_FUR && (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_KANGAROO || type === 1) && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYour " + player.skinDesc + " itches terribly all over and you try cartoonishly to scratch everywhere at once.  As you pull your hands in, you notice " + player.hairColor + " fur growing on the backs of them.  All over your body the scene is repeated, covering you in the stuff.  <b>You now have fur!</b>", false);
			changes++;
			player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
			player.skinDesc = "fur";
		}
		//-Roo footsies (Req: Tail)
		if (player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_KANGAROO && (type === 1 || player.tailType === AppearanceDefs.TAIL_TYPE_KANGAROO) && changes < changeLimit && Utils.rand(4) === 0) {
			//gain roo feet from centaur:
			if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR) {
				MainView.outputText("\n\nYour backlegs suddenly wobble and collapse, causing you to pitch over onto your side.  Try as you might, you can't get them to stop spasming so you can stand back up; you thrash your hooves wildly as a pins-and-needles sensation overtakes your lower body.  A dull throbbing along your spine makes you moan in agony; it's as though someone had set an entire bookshelf on your shoulders and your spine were being compressed far beyond its limit.  After a minute of pain, the pressure evaporates and you look down at your legs.  Not only are your backlegs gone, but your forelegs have taken on a dogleg shape, with extremely long feet bearing a prominent middle toe!  You set about rubbing the feeling back into your legs and trying to move the new feet.  <b>You now have kangaroo legs!</b>", false);
			} else if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_NAGA) { //gain roo feet from naga:
				MainView.outputText("\n\nYour tail quivers, then shakes violently, planting you on your face.  As you try to bend around to look at it, you can just see the tip shrinking out of your field of vision from the corner of your eye.  The scaly skin below your waist tightens intolerably, then splits; you wriggle out of it, only to find yourself with a pair of long legs instead!  A bit of hair starts to grow in as you stand up unsteadily on your new, elongated feet.  <b>You now have kangaroo legs!</b>  Now, what are you going to do with a giant shed snakeskin?", false);
			} else if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_GOO) { //gain roo feet from slime:
				MainView.outputText("\n\nYour mounds of goo shrink and part involuntarily, exposing your crotch.  Modesty overwhelms you and you try to pull them together, but the shrinkage is continuing faster than you can shift your gooey body around.  Before long you've run out of goo to move, and your lower body now ends in a pair of slippery digitigrade legs with long narrow feet.  They dry in the air and a bit of fur begins to sprout as you look for something to cover up with.  <b>You now have kangaroo legs!</b> You sigh.  Guess this means it's back to wearing underpants again.", false);
			} else { //gain roo feet from human/bee/demon/paw/lizard:
				MainView.outputText("\n\nYour feet begin to crack and shift as the metatarsal bones lengthen.  Your knees buckle from the pain of your bones rearranging themselves, and you fall over.  After fifteen seconds of what feels like your feet being racked, the sensation stops.  You look down at your legs; they've taken a roughly dog-leg shape, but they have extremely long feet with a prominent middle toe!  As you stand up you find that you're equally comfortable standing flat on your feet as you are on the balls of them!  <b>You now have kangaroo legs!</b>", false);
			}
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_KANGAROO;
			changes++;
		}
		//-Roo tail (Req: Ears)
		if (player.tailType !== AppearanceDefs.TAIL_TYPE_KANGAROO && changes < changeLimit && Utils.rand(4) === 0 && (type !== 1 || player.earType === AppearanceDefs.EARS_KANGAROO)) {
			//gain roo tail:
			if (player.tailType === AppearanceDefs.TAIL_TYPE_NONE) {
				MainView.outputText("\n\nA painful pressure in your lower body causes you to stand straight and lock up.  At first you think it might be gas.  No... something is growing at the end of your tailbone.  As you hold stock still so as not to exacerbate the pain, something thick pushes out from the rear of your garments.  The pain subsides and you crane your neck around to look; a long, tapered tail is now attached to your butt and a thin coat of fur is already growing in!  <b>You now have a kangaroo tail!</b>", false);
			} else if (player.tailType === AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN || player.tailType === AppearanceDefs.TAIL_TYPE_BEE_ABDOMEN) { //gain roo tail from bee tail:
				MainView.outputText("\n\nYour chitinous backside shakes and cracks once you finish eating.  Peering at it as best you can, it appears as though the fuzz is falling out in clumps and the chitin is flaking off.  As convulsions begin to wrack your body and force you to collapse, the ", false);
				if (player.tailType === AppearanceDefs.TAIL_TYPE_BEE_ABDOMEN) {
					MainView.outputText("hollow stinger drops out of the end, taking the venom organ with it.", false);
				} else {
					MainView.outputText("spinnerets drop out of the end, taking the last of your webbing with it.", false);
				}
				MainView.outputText("  By the time you're back to yourself, the insectile carapace has fallen off completely, leaving you with a long, thick, fleshy tail in place of your proud, insectile abdomen.  <b>You now have a kangaroo tail!</b>  You wipe the errant spittle from your mouth as you idly bob your new tail about.", false);
			} else { //gain roo tail from other tail:
				MainView.outputText("\n\nYour tail twitches as you eat.  It begins to feel fat and swollen, and you try to look at your own butt as best you can.  What you see matches what you feel as your tail thickens and stretches out into a long cone shape.  <b>You now have a kangaroo tail!</b>", false);
			}
			player.tailType = AppearanceDefs.TAIL_TYPE_KANGAROO;
			changes++;
		}
		//-Roo ears
		if (player.earType !== AppearanceDefs.EARS_KANGAROO && changes < changeLimit && Utils.rand(4) === 0) {
			//Bunbun ears get special texts!
			if (player.earType === AppearanceDefs.EARS_BUNNY) {
				MainView.outputText("\n\nYour ears stiffen and shift to the sides!  You reach up and find them pointed outwards instead of up and down; they feel a bit wider now as well.  As you touch them, you can feel them swiveling in place in response to nearby sounds.  <b>You now have a pair of kangaroo ears!</b>", false);
			} else { //Everybody else?  Yeah lazy.
				MainView.outputText("\n\nYour ears twist painfully as though being yanked upwards and you clap your hands to your head.  Feeling them out, you discover them growing!  They stretch upwards, reaching past your fingertips, and then the tugging stops.  You cautiously feel along their lengths; they're long and stiff, but pointed outwards now, and they swivel around as you listen.  <b>You now have a pair of kangaroo ears!</b>", false);
			}
			changes++;
			player.earType = AppearanceDefs.EARS_KANGAROO;
		}
		//UBEROOOO
		//kangaroo perk: - any liquid or food intake will accelerate a pregnancy, but it will not progress otherwise
		if (player.findPerk(PerkLib.Diapause) < 0 && player.kangaScore() > 4 && Utils.rand(4) === 0 && changes < changeLimit && player.hasVagina()) {
			//Perk name and description:
			player.createPerk(PerkLib.Diapause, 0, 0, 0, 0);
			MainView.outputText("\n\nYour womb rumbles as something inside it changes.\n<b>(You have gained the Diapause perk.  Pregnancies will not progress when fluid intake is scarce, and will progress much faster when it isn't.)", false);
			changes++;
			//trigger effect: Your body reacts to the influx of nutrition, accelerating your pregnancy. Your belly bulges outward slightly.
		}
		if ( Utils.rand(4) === 0 && player.gills && changes < changeLimit) {
			MainView.outputText("\n\nYour chest itches, and as you reach up to scratch it, you realize your gills have withdrawn into your skin.", false);
			player.gills = false;
			changes++;
		}
		if (changes === 0) {
			MainView.outputText("\n\nIt did not seem to have any effects, but you do feel better rested.", false);
			EngineCore.fatigue(-40);
		}
	};
//[Giant Chocolate Cupcake] – 500 gems
	Mutations.giantChocolateCupcake = function(player) {
		MainView.outputText("", true);
		MainView.outputText("You look down at the massive chocolate cupcake and wonder just how you can possibly eat it all.  It fills the over-sized wrapper and bulges out over the top, somehow looking obscene even though it's merely a baked treat.  There is a single candle positioned atop its summit, and it bursts into flame as if by magic.  Eight red gumdrops ring the outer edge of the cupcake, illuminated by the flame.\n\n", false);
		MainView.outputText("You hesitantly take a bite.  It's sweet, as you'd expect, but there's also a slightly salty, chocolaty undercurrent of flavor.  Even knowing what the minotaur put in Maddie's mix, you find yourself grateful that this new creation doesn't seem to have any of his 'special seasonings'.  It wouldn't do to be getting drugged up while you're slowly devouring the massive, muffin-molded masterpiece. Before you know it, most of the cupcake is gone and you polish off the last chocolaty bites before licking your fingers clean.\n\n", false);
		MainView.outputText("Gods, you feel heavy!  You waddle slightly as your body begins thickening, swelling until you feel as wide as a house.  Lethargy spreads through your limbs, and you're forced to sit still a little while until you let out a lazy burp.\n\n", false);
		MainView.outputText("As you relax in your sugar-coma, you realize your muscle definition is fading away, disappearing until your " + player.skinDesc + " looks nearly as soft and spongy as Maddie's own.  You caress the soft, pudgy mass and shiver in delight, dimly wondering if this is how the cupcake-girl must feel all the time.", false);
		MainView.outputText(player.modTone(0, 100), false);
		MainView.outputText(player.modThickness(100, 100), false);
	};
	Mutations.sweetGossamer = function(type, player) {
		MainView.outputText("", true);
		var changes = 0;
		var changeLimit = 1;
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		//Consuming Text
		if (type === 0) {
			MainView.outputText("You wad up the sweet, pink gossamer and eat it, finding it to be delicious and chewy, almost like gum.  Munching away, your mouth generates an enormous amount of spit until you're drooling all over yourself while you devour the sweet treat.", false);
		} else if (type === 1) {
			MainView.outputText("You wad up the sweet, black gossamer and eat it, finding it to be delicious and chewy, almost like licorice.  Munching away, your mouth generates an enormous amount of spit until you're drooling all over yourself while you devour the sweet treat.", false);
		}
		//*************
		//Stat Changes
		//*************
		//(If speed<70, increases speed)
		if (player.spe < 70 && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nYour reflexes feel much faster. Experimentally, you make a grab at a fly on a nearby rock and quickly snatch it out of the air.  A compulsion to stuff it in your mouth and eat it surfaces, but you resist the odd desire.  Why would you ever want to do something like that?", false);
			EngineCore.dynStats("spe", 1.5);
			changes++;
		}
		//(If speed>80, decreases speed down to minimum of 80)
		if (player.spe > 80 && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nYou feel like resting high in the trees and waiting for your unsuspecting prey to wander below so you can take them without having to exert yourself.  What an odd thought!", false);
			EngineCore.dynStats("spe", -1.5);
			changes++;
		}
		//(increases sensitivity)
		if (changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nThe hairs on your arms and legs stand up straight for a few moments, detecting the airflow around you. Touch appears to be more receptive from now on.", false);
			EngineCore.dynStats("sen", 1);
			changes++;
		}
		//(Increase libido)
		if (changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nYou suddenly feel slightly needier, and your loins stir in quiet reminder that they could be seen to. The aftertaste hangs on your tongue and your teeth.  You wish there had been more.", false);
			EngineCore.dynStats("lib", 1);
			changes++;
		}
		//(increase toughness to 60)
		if (changes < changeLimit && Utils.rand(3) === 0 && player.tou < 60) {
			MainView.outputText("\n\nStretching languidly, you realize you're feeling a little tougher than before, almost as if you had a full-body shell of armor protecting your internal organs.  How strange.  You probe at yourself, and while your " + player.skinFurScales() + " doesn't feel much different, the underlying flesh does seem tougher.", false);
			EngineCore.dynStats("tou", 1);
			changes++;
		}
		//(decrease strength to 70)
		if (player.str > 70 && Utils.rand(3) === 0) {
			MainView.outputText("\n\nLethargy rolls through you while you burp noisily.  You rub at your muscles and sigh, wondering why you need to be strong when you could just sew up a nice sticky web to catch your enemies.  ", false);
			if (player.spiderScore() < 4) {
				MainView.outputText("Wait, you're not a spider, that doesn't make any sense!", false);
			} else {
				MainView.outputText("Well, maybe you should put your nice, heavy abdomen to work.", false);
			}
			EngineCore.dynStats("str", -1);
			changes++;
		}
		//****************
		//Sexual Changes
		//****************
		//Increase venom recharge
		if (player.tailType === AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN && player.tailRecharge < 25 && changes < changeLimit) {
			changes++;
			MainView.outputText("\n\nThe spinnerets on your abdomen twitch and drip a little webbing.  The entirety of its heavy weight shifts slightly, and somehow you know you'll produce webs faster now.", false);
			player.tailRecharge += 5;
		}
		//(tightens vagina to 1, increases lust/libido)
		if (player.hasVagina()) {
			if (player.looseness() > 1 && changes < changeLimit && Utils.rand(3) === 0) {
				MainView.outputText("\n\nWith a gasp, you feel your " + Descriptors.vaginaDescript(0) + " tightening, making you leak sticky girl-juice. After a few seconds, it stops, and you rub on your " + Descriptors.vaginaDescript(0) + " excitedly. You can't wait to try this out!", false);
				EngineCore.dynStats("lib", 2, "lus", 25);
				changes++;
				player.vaginas[0].vaginalLooseness--;
			}
		}
		//(tightens asshole to 1, increases lust)
		if (player.ass.analLooseness > 1 && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nYou let out a small cry as your " + Descriptors.assholeDescript() + " shrinks, becoming smaller and tighter. When it's done, you feel much hornier and eager to stretch it out again.", false);
			EngineCore.dynStats("lib", 2, "lus", 25);
			changes++;
			player.ass.analLooseness--;
		}
		//[Requires penises]
		//(Thickens all cocks to a ratio of 1\" thickness per 5.5\"
		if (player.hasCock() && changes < changeLimit && Utils.rand(4) === 0) {
			//Use temp to see if any dicks can be thickened
			var thickenSomthing = false;
			_.forEach(player.cocks, function(cock) {
				if (cock.cockThickness * 5.5 < cock.cockLength) {
					cock.cockThickness += 0.1;
					thickenSomthing = true;
				}
			});
			//If something got thickened
			if (thickenSomthing === 1) {
				MainView.outputText("\n\nYou can feel your " + Descriptors.multiCockDescriptLight() + " filling out in your " + player.armorName + ". Pulling ", false);
				if (player.cockTotal() === 1) {
					MainView.outputText("it", false);
				} else {
					MainView.outputText("them", false);
				}
				MainView.outputText(" out, you look closely.  ", false);
				if (player.cockTotal() === 1) {
					MainView.outputText("It's", false);
				} else {
					MainView.outputText("They're", false);
				}
				MainView.outputText(" definitely thicker.", false);
				changes++;
			}
		}
		//[Increase to Breast Size] - up to Large DD
		if (player.smallestTitSize() < 6 && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nAfter eating it, your chest aches and tingles, and your hands reach up to scratch at it unthinkingly.  Silently, you hope that you aren't allergic to it.  Just as you start to scratch at your " + Descriptors.breastDescript(player.smallestTitRow()) + ", your chest pushes out in slight but sudden growth.", false);
			player.breastRows[player.smallestTitRow()].breastRating++;
			changes++;
		}
		//[Increase to Ass Size] - to 11
		if (player.buttRating < 11 && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYou look over your shoulder at your " + Descriptors.buttDescript() + " only to see it expand just slightly. You gape in confusion before looking back at the remaining silk in your hands. You finish it anyway. Dammit!", false);
			player.buttRating++;
			changes++;
		}
		//***************
		//Appearance Changes
		//***************
		//(Ears become pointed if not human)
		if (player.earType !== AppearanceDefs.EARS_HUMAN && player.earType !== AppearanceDefs.EARS_ELFIN && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYour ears twitch once, twice, before starting to shake and tremble madly.  They migrate back towards where your ears USED to be, so long ago, finally settling down before twisting and stretching, changing to become <b>new, pointed elfin ears.</b>", false);
			player.earType = AppearanceDefs.EARS_ELFIN;
			changes++;
		}
		//(Fur/Scales fall out)
		if (player.skinType !== AppearanceDefs.SKIN_TYPE_PLAIN && (player.earType === AppearanceDefs.EARS_HUMAN || player.earType === AppearanceDefs.EARS_ELFIN) && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nA slowly-building itch spreads over your whole body, and as you idly scratch yourself, you find that your " + player.skinFurScales() + " ", false);
			if (player.skinType === AppearanceDefs.SKIN_TYPE_SCALES) {
				MainView.outputText("are", false);
			} else {
				MainView.outputText("is", false);
			}
			MainView.outputText(" falling to the ground, revealing flawless, almost pearly-white skin underneath.  <b>You now have pale white skin.</b>", false);
			player.skinTone = "pale white";
			player.skinAdj = "";
			player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
			player.skinDesc = "skin";
			changes++;
		}
		//(Gain human face)
		if (player.skinType === AppearanceDefs.SKIN_TYPE_PLAIN && (player.faceType !== AppearanceDefs.FACE_SPIDER_FANGS && player.faceType !== AppearanceDefs.FACE_HUMAN) && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nWracked by pain, your face slowly reforms into a perfect human shape.  Awed by the transformation, you run your fingers delicately over the new face, marvelling at the change.  <b>You have a human face again!</b>", false);
			player.faceType = AppearanceDefs.FACE_HUMAN;
			changes++;
		}
		//-Remove breast rows over 2.
		if (changes < changeLimit && player.bRows() > 2 && Utils.rand(3) === 0 && !CoC.flags[kFLAGS.HYPER_HAPPY]) {
			changes++;
			MainView.outputText("\n\nYou stumble back when your center of balance shifts, and though you adjust before you can fall over, you're left to watch in awe as your bottom-most " + Descriptors.breastDescript(player.breastRows.length - 1) + " shrink down, disappearing completely into your ", false);
			if (player.bRows() >= 3) {
				MainView.outputText("abdomen", false);
			} else {
				MainView.outputText("chest", false);
			}
			MainView.outputText(". The " + Descriptors.nippleDescript(player.breastRows.length - 1) + "s even fade until nothing but ", false);
			if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
				MainView.outputText(player.hairColor + " " + player.skinDesc, false);
			} else {
				MainView.outputText(player.skinTone + " " + player.skinDesc, false);
			}
			MainView.outputText(" remains. <b>You've lost a row of breasts!</b>", false);
			EngineCore.dynStats("sen", -5);
			player.removeBreastRow(player.breastRows.length - 1, 1);
		}
		//-Nipples reduction to 1 per tit.
		if (player.averageNipplesPerBreast() > 1 && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nA chill runs over your " + Descriptors.allBreastsDescript() + " and vanishes.  You stick a hand under your " + player.armorName + " and discover that your extra nipples are missing!  You're down to just one per ", false);
			if (player.biggestTitSize() < 1) {
				MainView.outputText("'breast'.", false);
			} else {
				MainView.outputText("breast.", false);
			}
			changes++;
			//Loop through and reset nipples
			_.forEach(player.breastRows, function(breastRow) {
				breastRow.nipplesPerBreast = 1;
			});
		}
		//Nipples Turn Black:
		if (player.findStatusAffect(StatusAffects.BlackNipples) < 0 && Utils.rand(6) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nA tickling sensation plucks at your nipples and you cringe, trying not to giggle.  Looking down you are in time to see the last spot of flesh tone disappear from your [nipples].  They have turned an onyx black!");
			player.createStatusAffect(StatusAffects.BlackNipples, 0, 0, 0, 0);
			changes++;
		}
		//eyes!
		if (player.skinType === AppearanceDefs.SKIN_TYPE_PLAIN && (player.faceType !== AppearanceDefs.FACE_SPIDER_FANGS || player.faceType !== AppearanceDefs.FACE_HUMAN) && player.eyeType === AppearanceDefs.EYES_HUMAN && Utils.rand(4) === 0 && changes < changeLimit) {
			player.eyeType = AppearanceDefs.EYES_FOUR_SPIDER_EYES;
			changes++;
			MainView.outputText("\n\nYou suddenly get the strangest case of double vision.  Stumbling and blinking around, you clutch at your face, but you draw your hands back when you poke yourself in the eye.  Wait, those fingers were on your forehead!  You tentatively run your fingertips across your forehead, not quite believing what you felt.  <b>There's a pair of eyes on your forehead, positioned just above your normal ones!</b>  This will take some getting used to!", false);
			EngineCore.dynStats("int", 5);
		}
		//(Gain spider fangs)
		if (player.faceType === AppearanceDefs.FACE_HUMAN && player.skinType === AppearanceDefs.SKIN_TYPE_PLAIN && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nTension builds within your upper gum, just above your canines.  You open your mouth and prod at the affected area, pricking your finger on the sharpening tooth.  It slides down while you're touching it, lengthening into a needle-like fang.  You check the other side and confirm your suspicions.  <b>You now have a pair of pointy spider-fangs, complete with their own venom!</b>", false);
			player.faceType = AppearanceDefs.FACE_SPIDER_FANGS;
			changes++;
		}
		//(Arms to carapace-covered arms)
		if (player.armType !== AppearanceDefs.ARM_TYPE_SPIDER && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\n", false);
			//(Bird pretext)
			if (player.armType === AppearanceDefs.ARM_TYPE_HARPY) {
				MainView.outputText("The feathers covering your arms fall away, leaving them to return to a far more human appearance.  ", false);
			}
			MainView.outputText("You watch, spellbound, while your forearms gradually become shiny.  The entire outer structure of your arms tingles while it divides into segments, turning the " + player.skinFurScales() + " into a shiny black carapace.  You touch the onyx exoskeleton and discover to your delight that you can still feel through it as naturally as your own skin.", false);
			player.armType = AppearanceDefs.ARM_TYPE_SPIDER;
			changes++;
		}
		//(Centaurs -> Normal Human Legs) (copy from elsewhere)
		if (player.isTaur() && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYour quadrupedal hind-quarters seizes, overbalancing your surprised front-end and causing you to stagger and fall to your side.  Pain lances throughout, contorting your body into a tightly clenched ball of pain while tendons melt and bones break, melt, and regrow.  When it finally stops, <b>you look down to behold your new pair of human legs</b>!", false);
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HUMAN;
			changes++;
		}
		//(Goo -> Normal Human Legs) (copy from elsewhere)
		if (player.isGoo() && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYour lower body rushes inward, molding into two leg-like shapes that gradually stiffen up.  In moments they solidify into normal-looking legs, complete with regular, human feet.  <b>You now have normal feet!</b>", false);
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HUMAN;
			changes++;
		}
		//(Naga -> Normal Human Legs) (copy from elsewhere)
		if (player.isNaga() && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYou collapse as your sinuous snake-tail tears in half, shifting into legs.  The pain is immense, particularly where your new feet are forming.  <b>You have human legs again.</b>", false);
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HUMAN;
			changes++;
		}
		//Drider butt
		if (type === 1 && player.findPerk(PerkLib.SpiderOvipositor) < 0 && player.isDrider() && player.tailType === AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN && changes < changeLimit && Utils.rand(3) === 0 && (player.hasVagina || Utils.rand(2) === 0)) {
			MainView.outputText("\n\nAn odd swelling sensation floods your spider half.  Curling your abdomen underneath you for a better look, you gasp in recognition at your new 'equipment'!  Your semi-violent run-ins with the swamp's population have left you <i>intimately</i> familiar with the new appendage.  <b>It's a drider ovipositor!</b>  A few light prods confirm that it's just as sensitive as any of your other sexual organs.  You idly wonder what laying eggs with this thing will feel like...");
			MainView.outputText("\n\n(<b>Perk Gained:  Spider Ovipositor - Allows you to lay eggs in your foes!</b>)");
			//V1 - Egg Count
			//V2 - Fertilized Count
			player.createPerk(PerkLib.SpiderOvipositor, 0, 0, 0, 0);
			//Opens up drider ovipositor scenes from available mobs. The character begins producing unfertilized eggs in their arachnid abdomen. Egg buildup raises minimum lust and eventually lowers speed until the player has gotten rid of them.  This perk may only be used with the drider lower body, so your scenes should reflect that.
			//Any PC can get an Ovipositor perk, but it will be much rarer for characters without vaginas.
			//Eggs are unfertilized by default, but can be fertilized:
			//-female/herm characters can fertilize them by taking in semen; successfully passing a pregnancy check will convert one level ofunfertilized eggs to fertilized, even if the PC is already pregnant.
			//-male/herm characters will have a sex dream if they reach stage three of unfertilized eggs; this will represent their bee/drider parts drawing their own semen from their body to fertilize the eggs, and is accompanied by a nocturnal emission.
			//-unsexed characters cannot currently fertilize their eggs.
			//Even while unfertilized, eggs can be deposited inside NPCs - obviously, unfertilized eggs will never hatch and cannot lead to any egg-birth scenes that may be written later.
			changes++;
		}
		//(Normal Biped Legs -> Carapace-Clad Legs)
		if (((type === 1 && player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_DRIDER_LOWER_BODY && player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_CHITINOUS_SPIDER_LEGS) || (type !== 1 && player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_CHITINOUS_SPIDER_LEGS)) && (!player.isGoo() && !player.isNaga() && !player.isTaur()) && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nStarting at your " + player.feet() + ", a tingle runs up your " + player.legs() + ", not stopping until it reaches your thighs.  From the waist down, your strength completely deserts you, leaving you to fall hard on your " + Descriptors.buttDescript() + " in the dirt.  With nothing else to do, you look down, only to be mesmerized by the sight of black exoskeleton creeping up a perfectly human-looking calf.  It crests up your knee to envelop the joint in a many-faceted onyx coating.  Then, it resumes its slow upward crawl, not stopping until it has girded your thighs in glittery, midnight exoskeleton.  From a distance it would look almost like a black, thigh-high boot, but you know the truth.  <b>You now have human-like legs covered in a black, arachnid exoskeleton.</b>", false);
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_CHITINOUS_SPIDER_LEGS;
			changes++;
		}
		//(Tail becomes spider abdomen GRANT WEB ATTACK)
		if (player.tailType !== AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN && (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CHITINOUS_SPIDER_LEGS || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DRIDER_LOWER_BODY) && player.armType === AppearanceDefs.ARM_TYPE_SPIDER && Utils.rand(4) === 0) {
			MainView.outputText("\n\n", false);
			//(Pre-existing tails)
			if (player.tailType > AppearanceDefs.TAIL_TYPE_NONE) {
				MainView.outputText("Your tail shudders as heat races through it, twitching violently until it feels almost as if it's on fire.  You jump from the pain at your " + Descriptors.buttDescript() + " and grab at it with your hands.  It's huge... and you can feel it hardening under your touches, firming up until the whole tail has become rock-hard and spherical in shape.  The heat fades, leaving behind a gentle warmth, and you realize your tail has become a spider's abdomen!  With one experimental clench, you even discover that it can shoot webs from some of its spinnerets, both sticky and non-adhesive ones.  That may prove useful.  <b>You now have a spider's abdomen hanging from above your " + Descriptors.buttDescript() + "!</b>\n\n", false);
			} else { //(No tail)
				MainView.outputText("A burst of pain hits you just above your " + Descriptors.buttDescript() + ", coupled with a sensation of burning heat and pressure.  You can feel your " + player.skinFurScales() + " tearing as something forces its way out of your body.  Reaching back, you grab at it with your hands.  It's huge... and you can feel it hardening under your touches, firming up until the whole tail has become rock-hard and spherical in shape.  The heat fades, leaving behind a gentle warmth, and you realize your tail has become a spider's abdomen!  With one experimental clench, you even discover that it can shoot webs from some of its spinnerets, both sticky and non-adhesive ones.  That may prove useful.  <b>You now have a spider's abdomen hanging from above your " + Descriptors.buttDescript() + "!</b>", false);
			}
			player.tailType = AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN;
			player.tailVenom = 5;
			player.tailRecharge = 5;
			changes++;
		}
		//(Drider Item Only: Carapace-Clad Legs to Drider Legs)
		if (type === 1 && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CHITINOUS_SPIDER_LEGS && Utils.rand(4) === 0 && player.tailType === AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN) {
			MainView.outputText("\n\nJust like when your legs changed to those of a spider-morph, you find yourself suddenly paralyzed below the waist.  Your dark, reflective legs splay out and drop you flat on your back.   Before you can sit up, you feel tiny feelers of pain mixed with warmth and tingling running through them.  Terrified at the thought of all the horrible changes that could be wracking your body, you slowly sit up, expecting to find yourself turned into some incomprehensible monstrosity from the waist down.  As if to confirm your suspicions, the first thing you see is that your legs have transformed into eight long, spindly legs.  Instead of joining directly with your hips, they now connect with the spider-like body that has sprouted in place of where your legs would normally start.  Your abdomen has gotten even larger as well.  Once the strength returns to your new, eight-legged lower body, you struggle up onto your pointed 'feet', and wobble around, trying to get your balance.  As you experiment with your new form, you find you're even able to twist the spider half of your body down between your legs in an emulation of your old, bipedal stance.  That might prove useful should you ever want to engage in 'normal' sexual positions, particularly since your " + Descriptors.buttDescript() + " is still positioned just above the start of your arachnid half.  <b>You're now a drider.</b>", false);
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DRIDER_LOWER_BODY;
			changes++;
		}
		if ( Utils.rand(4) === 0 && player.gills && changes < changeLimit) {
			MainView.outputText("\n\nYour chest itches, and as you reach up to scratch it, you realize your gills have withdrawn into your skin.", false);
			player.gills = false;
			changes++;
		}
		if (changes === 0) {
			MainView.outputText("\n\nThe sweet silk energizes you, leaving you feeling refreshed.", false);
			EngineCore.fatigue(-33);
		}
	};
	Mutations.broBrew = function(player) {
		MainView.outputText("", true);
		//no drink for bimbos!
		if (player.findPerk(PerkLib.BimboBody) >= 0) {
			MainView.outputText("The stuff hits you like a giant cube, nearly staggering you as it begins to settle.", false);
			if (player.tallness < 77) {
				player.tallness = 77;
				MainView.outputText(".. Did the ground just get farther away?  You glance down and realize, you're growing!  Like a sped-up flower sprout, you keep on getting taller until finally stopping around... six and a half feet, you assume.  Huh.  You didn't expect that to happen!", false);
			}
			if (player.tone < 100) {
				MainView.outputText("  A tingling in your arm draws your attention just in time to see your biceps and triceps swell with new-found energy, skin tightening until thick cords of muscle run across the whole appendage.  Your other arm surges forward with identical results.  To compensate, your shoulders and neck widen to bodybuilder-like proportions while your chest and abs tighten to a firm, statuesque physique.  Your " + player.legs() + " and glutes are the last to go, bulking up to proportions that would make any female martial artist proud.  You feel like you could kick forever with legs this powerful.", false);
				player.tone = 100;
			}
			MainView.outputText("\n\n", false);
			//female
			if (!player.hasCock()) {
				MainView.outputText("The beverage isn't done yet, however, and it makes it perfectly clear with a building pleasure in your groin.  You can only cry in ecstasy and loosen the bottoms of your " + player.armorName + " just in time for a little penis to spring forth.  You watch, enthralled, as blood quickly stiffens the shaft to its full length – then keeps on going!  Before long, you have a quivering 10-inch maleness, just ready to stuff into a welcoming box.", false);
				player.createCock();
				player.cocks[0].cockLength = 10;
				player.cocks[0].cockThickness = 2;
				if (player.balls === 0) {
					MainView.outputText("  Right on cue, two cum-laden testicles drop in behind it, their contents swirling and churning.", false);
					player.balls = 2;
					player.ballSize = 3;
				}
				MainView.outputText("\n\n", false);
			} else if (player.balls === 0) {
				MainView.outputText("A swelling begins behind your man-meat, and you're assailed with an incredibly peculiar sensation as two sperm-filled balls drop into a newly-formed scrotum.  Frikkin' sweet!\n\n", false);
				player.balls = 2;
				player.ballSize = 3;
			}
			MainView.outputText("Finally, you feel the transformation skittering to a halt, leaving you to openly roam your new chiseled and sex-ready body.  So what if you can barely form coherent sentences anymore?  A body like this does all the talking you need, you figure!", false);
			if (player.inte > 35) {
				player.inte = 35;
				EngineCore.dynStats("int", -0.1);

			}
			if (player.lib < 50) {
				player.lib = 50;
				EngineCore.dynStats("lib", 0.1);
			}
			MainView.outputText("\n\n", false);
			if (player.findPerk(PerkLib.BimboBrains) >= 0) {
				MainView.outputText("<b>(Lost Perks - Bimbo Brains, Bimbo Body)\n", false);
			} else {
				MainView.outputText("<b>(Lost Perk - Bimbo Body)\n", false);
			}
			player.removePerk(PerkLib.BimboBrains);
			player.removePerk(PerkLib.BimboBody);
			player.createPerk(PerkLib.FutaForm, 0, 0, 0, 0);
			player.createPerk(PerkLib.FutaFaculties, 0, 0, 0, 0);
			MainView.outputText("(Gained Perks - Futa Form, Futa Faculties)</b>", false);
			player.genderCheck();
			return;
		}
		//HP restore for bros!
		if (player.findPerk(PerkLib.BroBody) >= 0 || player.findPerk(PerkLib.FutaForm) >= 0) {
			MainView.outputText("You crack open the can and guzzle it in a hurry.  Goddamn, this shit is the best.  As you crush the can against your forehead, you wonder if you can find a six-pack of it somewhere?\n\n", false);
			EngineCore.fatigue(-33);
			EngineCore.HPChange(100, true);
			return;
		}
		MainView.outputText("Well, maybe this will give you the musculature that you need to accomplish your goals.  You pull on the tab at the top and hear the distinctive snap-hiss of venting, carbonating pressure.  A smoky haze wafts from the opened container, smelling of hops and alcohol.  You lift it to your lips, the cold, metallic taste of the can coming to your tongue before the first amber drops of beer roll into your waiting mouth.  It tingles, but it's very, very good.  You feel compelled to finish it as rapidly as possible, and you begin to chug it.  You finish the entire container in seconds.\n\n", false);
		MainView.outputText("A churning, full sensation wells up in your gut, and without thinking, you open wide to release a massive burp. It rumbles through your chest, startling birds into flight in the distance.  Awesome!  You slam the can into your forehead hard enough to smash the fragile aluminum into a flat, crushed disc.  Damn, you feel stronger already", false);
		if (player.inte > 50) {
			MainView.outputText(", though you're a bit worried by how much you enjoyed the simple, brutish act", false);
		}
		MainView.outputText(".\n\n", false);
		//(Tits b' gone)
		if (player.biggestTitSize() >= 1) {
			MainView.outputText("A tingle starts in your " + Descriptors.nippleDescript(0) + "s before the tight buds grow warm, hot even.  ", false);
			if (player.biggestLactation() >= 1) {
				MainView.outputText("Somehow, you know that the milk you had been producing is gone, reabsorbed by your body.  ", false);
			}
			MainView.outputText("They pinch in towards your core, shrinking along with your flattening " + Descriptors.allChestDesc() + ".  You shudder and flex in response.  Your chest isn't just shrinking, it's reforming, sculping itself into a massive pair of chiseled pecs.  ", false);
			if (player.breastRows.length > 1) {
				MainView.outputText("The breasts below vanish entirely.  ", false);
				while (player.breastRows.length > 1) {
					player.removeBreastRow(player.breastRows.length - 1, 1);
				}
			}
			player.breastRows[0].breastRating = 0;
			player.breastRows[0].nipplesPerBreast = 1;
			player.breastRows[0].fuckable = false;
			if (player.nippleLength > 0.5) {
				player.nippleLength = 0.25;
			}
			player.breastRows[0].lactationMultiplier = 0;
			player.removeStatusAffect(StatusAffects.Feeder);
			player.removePerk(PerkLib.Feeder);
			MainView.outputText("All too soon, your boobs are gone.  Whoa!\n\n", false);
		}
		MainView.outputText("Starting at your hands, your muscles begin to contract and release, each time getting tighter, stronger, and more importantly - larger.  The oddness travels up your arms, thickens your biceps, and broadens your shoulders.  Soon, your neck and chest are as built as your arms.  You give a few experimental flexes as your abs ", false);
		if (player.tone >= 70) {
			MainView.outputText("further define themselves", false);
		} else {
			MainView.outputText("become extraordinarily visible", false);
		}
		MainView.outputText(".  The strange, muscle-building changes flow down your " + player.legs() + ", making them just as fit and strong as the rest of you.  You curl your arm and kiss your massive, flexing bicep.  You're awesome!\n\n", false);
		MainView.outputText("Whoah, you're fucking ripped and strong, not at all like the puny weakling you were before.  Yet, you feel oddly wool-headed.  Your thoughts seem to be coming slower and slower, like they're plodding through a marsh.  You grunt in frustration at the realization.  Sure, you're a muscle-bound hunk now, but what good is it if you're as dumb as a box of rocks?  Your muscles flex in the most beautiful way, so you stop and strike a pose, mesmerized by your own appearance.  Fuck thinking, that shit's for losers!\n\n", false);
		//(has dick less than 10 inches)
		if (player.hasCock()) {
			if (player.cocks[0].cockLength < 10) {
				MainView.outputText("As if on cue, the familiar tingling gathers in your groin, and you dimly remember you have one muscle left to enlarge.  If only you had the intelligence left to realize that your penis is not a muscle.  In any event, your " + Descriptors.cockDescript(0) + " swells in size, ", false);
				if (player.cocks[0].cockThickness < 2.75) {
					MainView.outputText("thickening and ", false);
					player.cocks[0].cockThickness = 2.75;
				}
				MainView.outputText("lengthening until it's ten inches long and almost three inches wide.  Fuck, you're hung!  ", false);
				player.cocks[0].cockLength = 10;
			}
			//Dick already big enough! BALL CHECK!
			if (player.balls > 0) {
				MainView.outputText("Churning audibly, your " + Descriptors.sackDescript() + " sways, but doesn't show any outward sign of change.  Oh well, it's probably just like, getting more endurance or something.", false);
			} else {
				MainView.outputText("Two rounded orbs drop down below, filling out a new, fleshy sac above your " + player.legs() + ".  Sweet!  You can probably cum buckets with balls like these.", false);
				player.balls = 2;
				player.ballSize = 3;
			}
			MainView.outputText("\n\n", false);
		} else { //(No dick)
			MainView.outputText("You hear a straining, tearing noise before you realize it's coming from your underwear.  Pulling open your " + player.armorName + ", you gasp in surprise at the huge, throbbing manhood that now lies between your " + Descriptors.hipDescript() + ".  It rapidly stiffens to a full, ten inches, and goddamn, it feels fucking good.  You should totally find a warm hole to fuck!", false);
			if (player.balls === 0) {
				MainView.outputText("  Two rounded orbs drop down below, filling out a new, fleshy sac above your " + player.legs() + ".  Sweet!  You can probably cum buckets with balls like these.", false);
			}
			MainView.outputText("\n\n", false);
			player.createCock();
			player.cocks[0].cockLength = 12;
			player.cocks[0].cockThickness = 2.75;
			if (player.balls === 0) {
				player.balls = 2;
				player.ballSize = 3;
			}
		}
		//(Pussy b gone)
		if (player.hasVagina()) {
			MainView.outputText("At the same time, your " + Descriptors.vaginaDescript(0) + " burns hot, nearly feeling on fire.  You cuss in a decidedly masculine way for a moment before the pain fades to a dull itch.  Scratching it, you discover your lady-parts are gone.  Only a sensitive patch of skin remains.\n\n", false);
			player.removeVagina(0, 1);
		}
		player.genderCheck();
		//(below max masculinity)
		if (player.femininity > 0) {
			MainView.outputText("Lastly, the change hits your face.  You can feel your jawbones shifting and sliding around, your skin changing to accommodate your face's new shape.  Once it's finished, you feel your impeccable square jaw and give a wide, easy-going grin.  You look awesome!\n\n", false);
			player.modFem(0, 100);
		}
		MainView.outputText("You finish admiring yourself and adjust your " + player.armorName + " to better fit your new physique.  Maybe there's some bitches around you can fuck.  Hell, as good as you look, you might have other dudes wanting you to fuck them too, no homo.\n\n", false);
		//max tone.  Thickness + 50
		player.modTone(100, 100);
		player.modThickness(100, 50);
		//Bonus cum production!
		player.createPerk(PerkLib.BroBrains, 0, 0, 0, 0);
		player.createPerk(PerkLib.BroBody, 0, 0, 0, 0);
		MainView.outputText("<b>(Bro Body - Perk Gained!)\n", false);
		MainView.outputText("(Bro Brains - Perk Gained!)</b>\n", false);//int to 20.  max int 50)
		if (player.findPerk(PerkLib.Feeder) >= 0) {
			MainView.outputText("<b>(Perk Lost - Feeder!)</b>\n", false);
			player.removePerk(PerkLib.Feeder);
		}
		if (player.inte > 21) {
			player.inte = 21;
		}
		EngineCore.dynStats("str", 33, "tou", 33, "int", -1, "lib", 4, "lus", 40);
	};
//Miscellaneous
//ITEM GAINED FROM LUST WINS
//bottle of ectoplasm. Regular stat-stuff include higher speed, (reduced libido?), reduced sensitivity, and higher intelligence. First-tier effects include 50/50 chance of sable skin with bone-white veins or ivory skin with onyx veins. Second tier, \"wisp-like legs that flit back and forth between worlds,\" or \"wisp-like legs\" for short. Third tier gives an \"Ephemeral\" perk, makes you (10%, perhaps?) tougher to hit, and gives you a skill that replaces tease/seduce—allowing the PC to possess the creature and force it to masturbate to gain lust. Around the same effectiveness as seduce.
//Mouseover script: \"The green-tinted, hardly corporeal substance flows like a liquid inside its container. It makes you feel...uncomfortable, as you observe it.\"
//Bottle of Ectoplasm Text
	Mutations.ectoplasm = function(player) {
		MainView.outputText("", true);
		MainView.outputText("You grimace and uncork the bottle, doing your best to ignore the unearthly smell drifting up to your nostrils. Steeling yourself, you raise the container to your lips and chug the contents, shivering at the feel of the stuff sliding down your throat.  Its taste, at least, is unexpectedly pleasant.  Almost tastes like oranges.", false);
		var changes = 0;
		var changeLimit = 1;
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(3) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		//Effect script 1:  (higher intelligence)
		if (player.inte < 100 && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou groan softly as your head begins pounding something fierce.  Wincing in pain, you massage your temples as the throbbing continues, and soon, the pain begins to fade; in its place comes a strange sense of sureness and wit.", false);
			EngineCore.dynStats("int", 1);
			if (player.inte < 50) {
				EngineCore.dynStats("int", 1);
			}
			changes++;
		}
		//Effect script 2:  (lower sensitivity)
		if (player.sens >= 20 && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nWoah, what the... you pinch your " + player.skinFurScales() + " to confirm your suspicions; the ghostly snack has definitely lowered your sensitivity.", false);
			EngineCore.dynStats("sen", -2);
			if (player.sens >= 75) {
				EngineCore.dynStats("sen", -2);
			}
			changes++;
		}
		//Effect script 3:  (higher libido)
		if (player.lib < 100 && Utils.rand(3) === 0 && changes < changeLimit) {
			//([if libido >49]
			if (player.lib < 50) {
				MainView.outputText("\n\nIdly, you drop a hand to your crotch as", false);
			} else {
				MainView.outputText("\n\nWith a substantial amount of effort, you resist the urge to stroke yourself as", false);
			}
			MainView.outputText(" a trace amount of the ghost girl's lust is transferred into you.  How horny IS she, you have to wonder...", false);
			EngineCore.dynStats("lib", 1);
			if (player.lib < 50) {
				EngineCore.dynStats("lib", 1);
			}
			changes++;
		}
		//Effect script a:  (human wang)
		if (player.hasCock() && changes < changeLimit) {
			if ( Utils.rand(3) === 0 && player.cocks[0].cockType !== CockTypesEnum.HUMAN) {
				MainView.outputText("\n\nA strange tingling begins behind your " + Descriptors.cockDescript(0) + ", slowly crawling up across its entire length.  While neither particularly arousing nor uncomfortable, you do shift nervously as the feeling intensifies.  You resist the urge to undo your " + player.armorName + " to check, but by the feel of it, your penis is shifting form.  Eventually the transformative sensation fades, <b>leaving you with a completely human penis.</b>", false);
				player.cocks[0].cockType = CockTypesEnum.HUMAN;
				changes++;
			}
		}
		//Appearnace Change
		//Hair
		if ( Utils.rand(4) === 0 && changes < changeLimit && player.hairType !== 2) {
			MainView.outputText("\n\nA sensation of weightlessness assaults your scalp. You reach up and grab a handful of hair, confused. Your perplexion only heightens when you actually feel the follicles becoming lighter in your grasp, before you can hardly tell you're holding anything.  Plucking a strand, you hold it up before you, surprised to see... it's completely transparent!  You have transparent hair!", false);
			player.hairType = 2;
			changes++;
		}
		//Skin
		if ( Utils.rand(4) === 0 && changes < changeLimit && (player.skinTone !== "sable" && player.skinTone !== "white")) {
			if ( Utils.rand(2) === 0) {
				MainView.outputText("\n\nA warmth begins in your belly, slowly spreading through your torso and appendages. The heat builds, becoming uncomfortable, then painful, then nearly unbearable. Your eyes unfocus from the pain, and by the time the burning sensation fades, you can already tell something's changed. You raise a hand, staring at the milky-white flesh. Your eyes are drawn to the veins in the back of your hand, darkening to a jet black as you watch. <b>You have white skin, with black veins!</b>", false);
				player.skinTone = "white";
				player.skinAdj = "milky";
				player.skinDesc = "skin";
				player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
			} else {
				MainView.outputText("\n\nA warmth begins in your belly, slowly spreading through your torso and appendages. The heat builds, becoming uncomfortable, then painful, then nearly unbearable. Your eyes unfocus from the pain, and by the time the burning sensation fades, you can already tell something's changed. You raise a hand, staring at the sable flesh. Your eyes are drawn to the veins in the back of your hand, brightening to an ashen tone as you watch.  <b>You have black skin, with white veins!</b>", false);
				player.skinTone = "sable";
				player.skinAdj = "ashen";
				player.skinDesc = "skin";
				player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
			}
			changes++;
		}
		//Legs
		if (changes < changeLimit && player.findPerk(PerkLib.Incorporeality) < 0 && (player.skinTone === "white" || player.skinTone === "sable") && player.hairType === 2) {
			//(ghost-legs!  Absolutely no problem with regular encounters, though! [if you somehow got this with a centaur it'd probably do nothing cuz you're not supposed to be a centaur with ectoplasm ya dingus])
			MainView.outputText("\n\nAn otherworldly sensation begins in your belly, working its way to your " + Descriptors.hipDescript() + ". Before you can react, your " + player.legs() + " begin to tingle, and you fall on your rump as a large shudder runs through them. As you watch, your lower body shimmers, becoming ethereal, wisps rising from the newly ghost-like " + player.legs() + ". You manage to rise, surprised to find your new, ghostly form to be as sturdy as its former corporeal version. Suddenly, like a dam breaking, fleeting visions and images flow into your head, never lasting long enough for you to concentrate on one. You don't even realize it, but your arms fly up to your head, grasping your temples as you groan in pain. As fast as the mental bombardment came, it disappears, leaving you with a surprising sense of spiritual superiority.  <b>You have ghost legs!</b>\n\n", false);
			MainView.outputText("<b>(Gained Perk:  Incorporeality</b>)", false);
			player.createPerk(PerkLib.Incorporeality, 0, 0, 0, 0);
		}
		//Effect Script 8: 100% chance of healing
		if (changes === 0) {
			MainView.outputText("You feel strangely refreshed, as if you just gobbled down a bottle of sunshine.  A smile graces your lips as vitality fills you.  ", false);
			EngineCore.HPChange(player.level * 5 + 10, true);
			changes++;
		}
		//Incorporeality Perk Text:  You seem to have inherited some of the spiritual powers of the residents of the afterlife!  While you wouldn't consider doing it for long due to its instability, you can temporarily become incorporeal for the sake of taking over enemies and giving them a taste of ghostly libido.

		//Sample possession text (>79 int, perhaps?):  With a smile and a wink, your form becomes completely intangible, and you waste no time in throwing yourself into your opponent's frame. Before they can regain the initiative, you take control of one of their arms, vigorously masturbating for several seconds before you're finally thrown out. Recorporealizing, you notice your enemy's blush, and know your efforts were somewhat successful.
		//Failure:  With a smile and a wink, your form becomes completely intangible, and you waste no time in throwing yourself into the opponent's frame. Unfortunately, it seems they were more mentally prepared than you hoped, and you're summarily thrown out of their body before you're even able to have fun with them. Darn, you muse. Gotta get smarter.
	};
	Mutations.isabellaMilk = function(player) {
		MainView.outputText("", true);
		MainView.outputText("You swallow down the bottle of Isabella's milk.", false);
		if (player.fatigue > 0) {
			MainView.outputText("  You feel much less tired! (-33 fatigue)", false);
		}
		EngineCore.fatigue(-33);
	};
//TF item - Shriveled Tentacle
//tooltip:
	Mutations.shriveledTentacle = function(player) {
		MainView.outputText("", true);
		MainView.outputText("You chew on the rubbery tentacle; its texture and taste are somewhat comparable to squid, but the half-dormant nematocysts cause your mouth to tingle sensitively.", false);
		var changes = 0;
		var changeLimit = 1;
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(3) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}

		//possible use effects:
		//- toughess up, sensitivity down
		if ( Utils.rand(3) === 0 && player.tou < 50 && changes < changeLimit) {
			MainView.outputText("\n\nYour skin feels clammy and a little rubbery.  You touch yourself experimentally and notice that you can barely feel the pressure from your fingertips.  Consumed with curiosity, you punch yourself lightly in the arm; the most you feel is a dull throb!", false);
			EngineCore.dynStats("tou", 1, "sen", -1);
			changes++;
		}
		//- speed down
		if ( Utils.rand(3) === 0 && player.spe > 40 && changes < changeLimit) {
			MainView.outputText("\n\nA pinprick sensation radiates from your stomach down to your knees, as though your legs were falling asleep.  Wobbling slightly, you stand up and take a few stumbling steps to work the blood back into them.  The sensation fades, but your grace fails to return and you stumble again.  You'll have to be a little more careful moving around for a while.", false);
			changes++;
			EngineCore.dynStats("spe", -1);
		}
		//- corruption increases by 1 up to low threshold (~20)
		if ( Utils.rand(3) === 0 && player.cor < 20 && changes < changeLimit) {
			MainView.outputText("\n\nYou shiver, a sudden feeling of cold rushing through your extremities.", false);
			changes++;
			EngineCore.dynStats("cor", 1);
		}
		//-always increases lust by a function of sensitivity
		//"The tingling of the tentacle

		//physical changes:
		//- may randomly remove bee abdomen, if present; always checks and does so when any changes to hair might happen
		if ( Utils.rand(4) === 0 && changes < changeLimit && player.tailType === AppearanceDefs.TAIL_TYPE_BEE_ABDOMEN) {
			MainView.outputText("\n\nAs the gentle tingling of the tentacle's remaining venom spreads through your body, it begins to collect and intensify above the crack of your butt.  Looking back, you notice your abdomen shivering and contracting; with a snap, the chitinous appendage parts smoothly from your backside and falls to the ground.  <b>You no longer have a bee abdomen!</b>\n\n", false);
			player.tailType = AppearanceDefs.TAIL_TYPE_NONE;
			changes++;
		}
		//-may randomly remove bee wings:
		if ( Utils.rand(4) === 0 && (player.wingType === AppearanceDefs.WING_TYPE_BEE_LIKE_SMALL || player.wingType === AppearanceDefs.WING_TYPE_BEE_LIKE_LARGE) && changes < changeLimit) {
			MainView.outputText("\n\nYour wings twitch and flap involuntarily.  You crane your neck to look at them as best you are able; from what you can see, they seem to be shriveling and curling up.  They're starting to look a lot like they did when they first popped out, wet and new.  <b>As you watch, they shrivel all the way, then recede back into your body.</b>", false);
			player.wingType = AppearanceDefs.WING_TYPE_NONE;
			player.wingDesc = "non-existent";
			changes++;
		}
		//-hair morphs to anemone tentacles, retains color, hair shrinks back to med-short('shaggy') and stops growing, lengthening treatments don't work and goblins won't cut it, but more anemone items can lengthen it one level at a time
		if (player.gills && player.hairType !== 4 && changes < changeLimit && Utils.rand(5) === 0) {
			MainView.outputText("\n\nYour balance slides way off, and you plop down on the ground as mass concentrates on your head.  Reaching up, you give a little shriek as you feel a disturbingly thick, squirming thing where your hair should be.  Pulling it down in front of your eyes, you notice it's still attached to your head; what's more, it's the same color as your hair used to be.  <b>You now have squirming tentacles in place of hair!</b>  As you gaze at it, a gentle heat starts to suffuse your hand.  The tentacles must be developing their characteristic stingers!  You quickly let go; you'll have to take care to keep them from rubbing on your skin at all hours.  On the other hand, they're quite short and you find you can now flex and extend them as you would any other muscle, so that shouldn't be too hard.  You settle on a daring, windswept look for now.", false);
			player.hairType = 4;
			player.hairLength = 5;
			if (CoC.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] === 0) {
				MainView.outputText("  <b>(Your hair has stopped growing.)</b>", false);
				CoC.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] = 1;
			}
			changes++;
			changes++;
			changes++;
			//(reset hair to 'shaggy', add tentacle hair status, stop hair growth)
			//appearance screen: replace 'hair' with 'tentacle-hair'
		}
		//-feathery gills sprout from chest and drape sensually over nipples (cumulative swimming power boost with fin, if swimming is implemented)
		if ( Utils.rand(5) === 0 && !player.gills && player.skinTone === "aphotic blue-black" && changes < changeLimit) {
			MainView.outputText("\n\nYou feel a pressure in your lower esophageal region and pull your garments down to check the area.  <b>Before your eyes a pair of feathery gills start to push out of the center of your chest, just below your neckline, parting sideways and draping over your " + Descriptors.nippleDescript(0) + "s.</b>  They feel a bit uncomfortable in the open air at first, but soon a thin film of mucus covers them and you hardly notice anything at all.  You redress carefully.", false);
			player.gills = true;
			changes++;
		}
		//-[aphotic] skin tone (blue-black)
		if ( Utils.rand(5) === 0 && changes < changeLimit && player.skinTone !== "aphotic blue-black") {
			MainView.outputText("\n\nYou absently bite down on the last of the tentacle, then pull your hand away, wincing in pain.  How did you bite your finger so hard?  Looking down, the answer becomes obvious; <b>your hand, along with the rest of your skin, is now the same aphotic color as the dormant tentacle was!</b>", false);
			player.skinTone = "aphotic blue-black";
			changes++;
		}
		//-eat more, grow more 'hair':
		if (player.hairType === 4 && player.hairLength < 36 && Utils.rand(2) === 0 && changes < changeLimit) {
			var hairLengthChange = 5 + Utils.rand(3);
			player.hairLength += hairLengthChange;
			MainView.outputText("\n\nAs you laboriously chew the rubbery dried anemone, your head begins to feel heavier.  Using your newfound control, you snake one of your own tentacles forward; holding it out where you can see it, the first thing you notice is that it appears quite a bit longer.  <b>Your head-tentacles are now " + Utils.num2Text(hairLengthChange) + " inches longer!</b>", false);
			//(add one level of hairlength)
			changes++;
		}
	};
//ITEMS START
//Numb Rocks
	Mutations.numbRocks = function(player) {
		MainView.outputText("", true);
		//Numb rocks lower lust significantly but have a chance of inducing the masturbation preventing effect from minotaur.
		MainView.outputText("You pop open the package of numb rocks and dump it into your waiting mouth.  The strange candy fizzes and pops, leaving the nerves on your tongue feeling a bit deadened as you swallow the sweet mess.", false);
		if (player.lust >= 33) {
			MainView.outputText("\n\nThe numbness spreads through your body, bringing with it a sense of calm that seems to muffle your sexual urges.", false);
			player.lust -= 20 + Utils.rand(40);
		}
		if ( Utils.rand(5) === 0) {
			if (player.findStatusAffect(StatusAffects.Dysfunction) < 0) {
				MainView.outputText("\n\nUnfortunately, the skin of ", false);
				if (player.cockTotal() > 0) {
					MainView.outputText(Descriptors.sMultiCockDesc(), false);
					if (player.hasVagina()) {
						MainView.outputText(" and", false);
					}
					MainView.outputText(" ", false);
				}
				if (player.hasVagina()) {
					if (!player.hasCock()) {
						MainView.outputText("your ");
					}
					MainView.outputText(Descriptors.vaginaDescript(0) + " ", false);
				}
				if (!(player.hasCock() || player.hasVagina())) {
					MainView.outputText(Descriptors.assholeDescript() + " ", false);
				}
				MainView.outputText(" numbs up too.  You give yourself a gentle touch, but are quite disturbed when you realize you can barely feel it.  You can probably still fuck something to get off, but regular masturbation is out of the question...", false);
				player.createStatusAffect(StatusAffects.Dysfunction, 50 + Utils.rand(100), 0, 0, 0);
			} else {
				MainView.outputText("\n\nSadly your groin becomes even more deadened to sensation.  You wonder how much longer you'll have to wait until you can please yourself again.", false);
				player.addStatusValue(StatusAffects.Dysfunction, 1, 50 + Utils.rand(100));
			}
		} else if ( Utils.rand(4) === 0 && player.inte > 15) {
			MainView.outputText("\n\nNumbness clouds your mind, making you feel slow witted and dull.  Maybe these candies weren't such a exceptio... fantas... good idea.", false);
			EngineCore.dynStats("int", -(1 + Utils.rand(5)));
		}
		if (player.findPerk(PerkLib.ThickSkin) < 0 && player.sens < 30 && Utils.rand(4) === 0) {
			MainView.outputText("Slowly, ", false);
			if (player.skinType === AppearanceDefs.SKIN_TYPE_PLAIN) {
				MainView.outputText("your skin", false);
			} else {
				MainView.outputText("the skin under your " + player.skinDesc, false);
			}
			MainView.outputText(" begins to feel duller, almost... thicker.  You pinch yourself and find that your epidermis feels more resistant to damage, almost like natural armor!\n<b>(Thick Skin - Perk Gained!)</b>", false);
			player.createPerk(PerkLib.ThickSkin, 0, 0, 0, 0);
		}
		MainView.outputText("\n\nAfter the sensations pass, your " + player.skinDesc + " feels a little less receptive to touch.", false);
		EngineCore.dynStats("sen", -3);
		if (player.sens < 1) {
			player.sens = 1;
		}
	};
//2. Sensitivity Draft
	Mutations.sensitivityDraft = function(player) {
		MainView.outputText("", true);
		MainView.outputText("You pop the cork on this small vial and drink down the clear liquid.  It makes your lips and tongue tingle strangely, letting you feel each globule of spit in your mouth and each breath of air as it slides past your lips.", false);
		if (player.findStatusAffect(StatusAffects.Dysfunction) >= 0) {
			MainView.outputText("\n\nThankfully, the draft invigorates your groin, replacing the numbness with waves of raw sensation.  It seems your crotch is back to normal and <b>you can masturbate again!</b>", false);
			player.removeStatusAffect(StatusAffects.Dysfunction);
		}
		if ( Utils.rand(4) === 0 && player.findStatusAffect(StatusAffects.LustyTongue) < 0) {
			MainView.outputText("The constant tingling in your mouth grows and grows, particularly around your lips, until they feel as sensitive as ", false);
			if (player.hasVagina()) {
				MainView.outputText("your", false);
			} else {
				MainView.outputText("a woman's", false);
			}
			MainView.outputText(" lower lips.  You'll have to be careful not to lick them!", false);
			//(Lustytongue status)
			player.createStatusAffect(StatusAffects.LustyTongue, 25, 0, 0, 0);
		}
		MainView.outputText("\n\nAfter the wave of sensation passes, your " + player.skinDesc + " feels a little more receptive to touch.  ", false);
		if (player.lust > 70 || player.lib > 70) {
			MainView.outputText("You shiver and think of how much better it'll make sex and masturbation.", false);
		} else {
			MainView.outputText("You worry it'll make it harder to resist the attentions of a demon.", false);
		}
		EngineCore.dynStats("sen", 10, "lus", 5);
	};
	Mutations.foxTF = function(enhanced, player) {
		MainView.clearOutput();
		if (!enhanced) {
			MainView.outputText("You examine the berry a bit, rolling the orangish-red fruit in your hand for a moment before you decide to take the plunge and chow down.  It's tart and sweet at the same time, and the flavors seem to burst across your tongue with potent strength.  Juice runs from the corners of your lips as you finish the tasty snack.");
		} else {
			MainView.outputText("You pop the cap on the enhanced \"Vixen's Vigor\" and decide to take a swig of it.  Perhaps it will make you as cunning as the crude fox Lumi drew on the front?");
		}
		var changes = 0;
		var changeLimit = 1;
		if (enhanced) {
			changeLimit += 2;
		}
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		//Used for dick and boob TFs
		if (player.faceType === AppearanceDefs.FACE_FOX && player.tailType === AppearanceDefs.TAIL_TYPE_FOX && player.earType === AppearanceDefs.EARS_FOX && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_FOX && player.skinType === AppearanceDefs.SKIN_TYPE_FUR && Utils.rand(3) === 0) {
			if (CoC.flags[kFLAGS.FOX_BAD_END_WARNING] === 0) {
				MainView.outputText("\n\nYou get a massive headache and a craving to raid a henhouse.  Thankfully, both pass in seconds, but <b>maybe you should cut back on the vulpine items...</b>");
				CoC.flags[kFLAGS.FOX_BAD_END_WARNING] = 1;
			} else {
				MainView.outputText("\n\nYou scarf down the ");
				if (enhanced) {
					MainView.outputText("fluid ");
				} else {
					MainView.outputText("berries ");
				}
				MainView.outputText("with an uncommonly voracious appetite, taking particular enjoyment in the succulent, tart flavor.  As you carefully suck the last drops of ochre juice from your fingers, you note that it tastes so much more vibrant than you remember.  Your train of thought is violently interrupted by the sound of bones snapping, and you cry out in pain, doubling over as a flaming heat boils through your ribs.");
				MainView.outputText("\n\nWrithing on the ground, you clutch your hand to your chest, looking on in horror through tear-streaked eyes as the bones in your fingers pop and fuse, rearranging themselves into a dainty paw covered in coarse black fur, fading to a ruddy orange further up.  You desperately try to call out to someone - anyone - for help, but all that comes out is a high-pitched, ear-splitting yap.");
				if (player.tailVenom > 1) {
					MainView.outputText("  Your tails thrash around violently as they begin to fuse painfully back into one, the fur bristling back out with a flourish.");
				}
				MainView.outputText("\n\nA sharp spark of pain jolts through your spinal column as the bones shift themselves around, the joints in your hips migrating forward.  You continue to howl in agony even as you feel your intelligence slipping away.  In a way, it's a blessing - as your thoughts grow muddied, the pain is dulled, until you are finally left staring blankly at the sky above, tilting your head curiously.");
				MainView.outputText("\n\nYou roll over and crawl free of the " + player.armorName + " covering you, pawing the ground for a few moments before a pang of hunger rumbles through your stomach.  Sniffing the wind, you bound off into the wilderness, following the telltale scent of a farm toward the certain bounty of a chicken coop.");
				EngineCore.gameOver();
				return;
			}
		}
		//[increase Intelligence, Libido and Sensitivity]
		if (changes < changeLimit && Utils.rand(3) === 0 && (player.lib < 80 || player.inte < 80 || player.sens < 80)) {
			MainView.outputText("\n\nYou close your eyes, smirking to yourself mischievously as you suddenly think of several new tricks to try on your opponents; you feel quite a bit more cunning.  The mental picture of them helpless before your cleverness makes you shudder a bit, and you lick your lips and stroke yourself as you feel your skin tingling from an involuntary arousal.");
			if (player.inte < 80) {
				EngineCore.dynStats("int", 4);
			}
			if (player.lib < 80) {
				EngineCore.dynStats("lib", 1);
			}
			if (player.sens < 80) {
				EngineCore.dynStats("sen", 1);
			}
			//gain small lust also
			EngineCore.dynStats("lus", 10);
			changes++;
		}
		//[decrease Strength] (to some floor) // I figured 15 was fair, but you're in a better position to judge that than I am.
		if (changes < changeLimit && Utils.rand(3) === 0 && player.str > 40) {
			MainView.outputText("\n\nYou can feel your muscles softening as they slowly relax, becoming a tad weaker than before.  Who needs physical strength when you can outwit your foes with trickery and mischief?  You tilt your head a bit, wondering where that thought came from.");
			EngineCore.dynStats("str", -1);
			if (player.str > 60) {
				EngineCore.dynStats("str", -1);
			}
			if (player.str > 80) {
				EngineCore.dynStats("str", -1);
			}
			if (player.str > 90) {
				EngineCore.dynStats("str", -1);
			}
			changes++;
		}
		//[decrease Toughness] (to some floor) // 20 or so was my thought here
		if (changes < changeLimit && Utils.rand(3) === 0 && player.tou > 30) {
			if (player.tou < 60) {
				MainView.outputText("\n\nYou feel your skin becoming noticeably softer.  A gentle exploratory pinch on your arm confirms it - your supple skin isn't going to offer you much protection.");
			} else {
				MainView.outputText("\n\nYou feel your skin becoming noticeably softer.  A gentle exploratory pinch on your arm confirms it - your hide isn't quite as tough as it used to be.");
			}
			EngineCore.dynStats("tou", -1);
			if (player.str > 60) {
				EngineCore.dynStats("tou", -1);
			}
			if (player.str > 80) {
				EngineCore.dynStats("tou", -1);
			}
			if (player.str > 90) {
				EngineCore.dynStats("tou", -1);
			}
			changes++;
		}
		//[Change Hair Color: Golden-blonde or Reddish-orange]
		if (player.hairColor !== "golden-blonde" && player.hairColor !== "reddish-orange" && player.hairColor !== "silver" && player.hairColor !== "white" && player.hairColor !== "red" && player.hairColor !== "black" && changes < changeLimit && Utils.rand(4) === 0) {
			var hairTemp = Utils.rand(10);
			if (hairTemp < 5) {
				player.hairColor = "reddish-orange";
			} else if (hairTemp < 7) {
				player.hairColor = "red";
			} else if (hairTemp < 8) {
				player.hairColor = "golden-blonde";
			} else if (hairTemp < 9) {
				player.hairColor = "silver";
			} else {
				player.hairColor = "black";
			}
			MainView.outputText("\n\nYour scalp begins to tingle, and you gently grasp a strand of hair, pulling it out to check it.  Your hair has become " + player.hairColor + "!");
		}
		//[Adjust hips toward 10 – wide/curvy/flared]
		if (changes < changeLimit && Utils.rand(3) === 0 && player.hipRating !== 10) {
			//from narrow to wide
			if (player.hipRating < 10) {
				MainView.outputText("\n\nYou stumble a bit as the bones in your pelvis rearrange themselves painfully.  Your waistline has widened into [hips]!");
				player.hipRating++;
				if (player.hipRating < 7) {
					player.hipRating++;
				}
			} else { //from wide to narrower
				MainView.outputText("\n\nYou stumble a bit as the bones in your pelvis rearrange themselves painfully.  Your waistline has narrowed, becoming [hips].");
				player.hipRating--;
				if (player.hipRating > 15) {
					player.hipRating--;
				}
			}
			changes++;
		}
		//[Remove tentacle hair]
		//required if the hair length change below is triggered
		if (changes < changeLimit && player.hairType === 4 && Utils.rand(3) === 0) {
			//-insert anemone hair removal into them under whatever criteria you like, though hair removal should precede abdomen growth; here's some sample text:
			MainView.outputText("\n\nEerie flames of the jewel migrate up your body to your head, where they cover your [hair].  Though they burned nowhere else in their lazy orbit, your head begins to heat up as they congregate.  Fearful, you raise your hands to it just as the temperature peaks, but as you touch your hair, the searing heat is suddenly gone - along with your tentacles!  <b>Your hair is normal again!</b>");
			player.hairType = 0;
			changes++;
		}
		//[Adjust hair length toward range of 16-26 – very long to ass-length]
		if (player.hairType !== 4 && (player.hairLength > 26 || player.hairLength < 16) && changes < changeLimit && Utils.rand(4) === 0) {
			if (player.hairLength < 16) {
				player.hairLength += 1 + Utils.rand(4);
				MainView.outputText("\n\nYou experience a tingling sensation in your scalp.  Feeling a bit off-balance, you discover your hair has lengthened, becoming " + Utils.num2Text(Math.round(player.hairLength)) + " inches long.");
			} else {
				player.hairLength -= 1 + Utils.rand(4);
				MainView.outputText("\n\nYou experience a tingling sensation in your scalp.  Feeling a bit off-balance, you discover your hair has shed a bit of its length, becoming " + Utils.num2Text(Math.round(player.hairLength)) + " inches long.");
			}
			changes++;
		}
		if (changes < changeLimit && Utils.rand(10) === 0) {
			MainView.outputText("\n\nYou sigh as the exotic flavor washes through you, and unbidden, you begin to daydream.  Sprinting through the thicket, you can feel the corners of your muzzle curling up into a mischievous grin.  You smell the scent of demons, and not far away either.  With your belly full and throat watered, now is the perfect time for a little bit of trickery.   As the odor intensifies, you slow your playful gait and begin to creep a bit more carefully.");
			MainView.outputText("\n\nSuddenly, you are there, at a demonic camp, and you spy the forms of an incubus and a succubus, their bodies locked together at the hips and slowly undulating, even in sleep.  You carefully prance around their slumbering forms and find their supplies.  With the utmost care, you put your razor-sharp teeth to work, and slowly, meticulously rip through their packs - not with the intention of theft, but with mischief.  You make sure to leave small holes in the bottom of each, and after making sure your stealth remains unbroken, you urinate on their hooves.");
			MainView.outputText("\n\nThey don't even notice, so lost in the subconscious copulation as they are.  Satisfied at your petty tricks, you scurry off into the night, a red blur amidst the foliage.");
			changes++;
			EngineCore.fatigue(-10);
		}
		//dog cocks!
		if (changes < changeLimit && Utils.rand(3) === 0 && player.dogCocks() < player.cocks.length) {
			var nonDogCocks = _.filter(player.cocks, function(cock) { return cock.cockType !== CockTypesEnum.DOG; });
			if (nonDogCocks.length !== 0) {
				var selectedNonDogCockIndex = _.indexOf(nonDogCocks, Utils.randomChoice(nonDogCocks));
				if (player.cocks[selectedNonDogCockIndex].cockType === CockTypesEnum.HUMAN) {
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(selectedNonDogCockIndex) + " clenches painfully, becoming achingly, throbbingly erect.  A tightness seems to squeeze around the base, and you wince as you see your skin and flesh shifting forwards into a canine-looking sheath.  You shudder as the crown of your " + Descriptors.cockDescript(selectedNonDogCockIndex) + " reshapes into a point, the sensations nearly too much for you.  You throw back your head as the transformation completes, your " + Appearance.cockNoun(CockTypesEnum.DOG) + " much thicker than it ever was before.  <b>You now have a dog-cock.</b>", false);
					player.cocks[selectedNonDogCockIndex].cockThickness += 0.3;
					EngineCore.dynStats("sen", 10, "lus", 5);
				} else if (player.cocks[selectedNonDogCockIndex].cockType === CockTypesEnum.HORSE) { //Horse
					MainView.outputText("\n\nYour " + Appearance.cockNoun(CockTypesEnum.HORSE) + " shrinks, the extra equine length seeming to shift into girth.  The flared tip vanishes into a more pointed form, a thick knotted bulge forming just above your sheath.  <b>You now have a dog-cock.</b>", false);
					//Tweak length/thickness.
					if (player.cocks[selectedNonDogCockIndex].cockLength > 6) {
						player.cocks[selectedNonDogCockIndex].cockLength -= 2;
					} else {
						player.cocks[selectedNonDogCockIndex].cockLength -= 0.5;
					}
					player.cocks[selectedNonDogCockIndex].cockThickness += 0.5;

					EngineCore.dynStats("sen", 4, "lus", 5);
				} else if (player.cocks[selectedNonDogCockIndex].cockType === CockTypesEnum.TENTACLE) { //Tentacular Tuesday!
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(selectedNonDogCockIndex) + " coils in on itself, reshaping and losing its plant-like coloration as thickens near the base, bulging out in a very canine-looking knot.  Your skin bunches painfully around the base, forming into a sheath.  <b>You now have a dog-cock.</b>", false);
					EngineCore.dynStats("sen", 4, "lus", 10);
				} else { //Misc
					MainView.outputText("\n\nYour " + Descriptors.cockDescript(selectedNonDogCockIndex) + " trembles, reshaping itself into a shiny red doggie-dick with a fat knot at the base.  <b>You now have a dog-cock.</b>", false);
					EngineCore.dynStats("sen", 4, "lus", 10);
				}
				player.cocks[selectedNonDogCockIndex].cockType = CockTypesEnum.DOG;
				player.cocks[selectedNonDogCockIndex].knotMultiplier = 1.25;
				changes++;
			}

		}
		//Cum Multiplier Xform
		if (player.cumQ() < 5000 < 2 && Utils.rand(3) === 0 && changes < changeLimit && player.hasCock()) {
			var cumMultiplier = 2 + Utils.rand(4);
			//Lots of cum raises cum multiplier cap to 2 instead of 1.5
			if (player.findPerk(PerkLib.MessyOrgasms) >= 0) {
				cumMultiplier += Utils.rand(10);
			}
			player.cumMultiplier += cumMultiplier;
			//Flavor text
			if (player.balls === 0) {
				MainView.outputText("\n\nYou feel a churning inside your gut as something inside you changes.", false);
			}
			if (player.balls > 0) {
				MainView.outputText("\n\nYou feel a churning in your " + Descriptors.ballsDescriptLight() + ".  It quickly settles, leaving them feeling somewhat more dense.", false);
			}
			MainView.outputText("  A bit of milky pre dribbles from your " + Descriptors.multiCockDescriptLight() + ", pushed out by the change.", false);
			changes++;
		}
		if (changes < changeLimit && player.balls > 0 && player.ballSize > 4 && Utils.rand(3) === 0) {
			MainView.outputText("\n\nYour [sack] gets lighter and lighter, the skin pulling tight around your shrinking balls until you can't help but check yourself.");
			if (player.ballSize > 10) {
				player.ballSize -= 5;
			}
			if (player.ballSize > 20) {
				player.ballSize -= 4;
			}
			if (player.ballSize > 30) {
				player.ballSize -= 4;
			}
			if (player.ballSize > 40) {
				player.ballSize -= 4;
			}
			if (player.ballSize > 50) {
				player.ballSize -= 8;
			}
			if (player.ballSize > 60) {
				player.ballSize -= 8;
			}
			if (player.ballSize <= 10) {
				player.ballSize--;
			}
			changes++;
			MainView.outputText("  You now have a [balls].");
		}
		//Sprouting more!
		if (changes < changeLimit && enhanced && player.bRows() < 4 && player.breastRows[player.bRows() - 1].breastRating > 1) {
			MainView.outputText("\n\nYour belly rumbles unpleasantly for a second as the ");
			if (!enhanced) {
				MainView.outputText("berry ");
			} else {
				MainView.outputText("drink ");
			}
			MainView.outputText("settles deeper inside you.  A second later, the unpleasant gut-gurgle passes, and you let out a tiny burp of relief.  Before you finish taking a few breaths, there's an itching below your " + Descriptors.allChestDesc() + ".  You idly scratch at it, but gods be damned, it hurts!  You peel off part of your " + player.armorName + " to inspect the unwholesome itch, ");
			if (player.biggestTitSize() >= 8) {
				MainView.outputText("it's difficult to see past the wall of tits obscuring your view.");
			} else {
				MainView.outputText("it's hard to get a good look at.");
			}
			MainView.outputText("  A few gentle prods draw a pleasant gasp from your lips, and you realize that you didn't have an itch - you were growing new nipples!");
			MainView.outputText("\n\nA closer examination reveals your new nipples to be just like the ones above in size and shape");
			if (player.breastRows[player.bRows() - 1].nipplesPerBreast > 1) {
				MainView.outputText(", not to mention number");
			} else if (player.hasFuckableNipples()) {
				MainView.outputText(", not to mention penetrability");
			}
			MainView.outputText(".  While you continue to explore your body's newest addition, a strange heat builds behind the new nubs. Soft, jiggly breastflesh begins to fill your cupped hands.  Radiant warmth spreads through you, eliciting a moan of pleasure from your lips as your new breasts catch up to the pair above.  They stop at " + player.breastCup(player.bRows() - 1) + "s.  <b>You have " + Utils.num2Text(player.bRows() + 1) + " rows of breasts!</b>");
			player.createBreastRow();
			player.breastRows[player.bRows() - 1].breastRating = player.breastRows[player.bRows() - 2].breastRating;
			player.breastRows[player.bRows() - 1].nipplesPerBreast = player.breastRows[player.bRows() - 2].nipplesPerBreast;
			if (player.hasFuckableNipples()) {
				player.breastRows[player.bRows() - 1].fuckable = true;
			}
			player.breastRows[player.bRows() - 1].lactationMultiplier = player.breastRows[player.bRows() - 2].lactationMultiplier;
			EngineCore.dynStats("sen", 2, "lus", 30);
			changes++;
		}
		//Find out if tits are eligible for evening
		var tits = false;
		_.forEach(player.breastRows, function(breastRow, index) {
			//If the row above is 1 size above, can be grown!
			if (index > 0 && breastRow.breastRating <= (player.breastRows[index - 1].breastRating - 1) && changes < changeLimit && Utils.rand(2) === 0) {
				if (tits) {
					MainView.outputText("\n\nThey aren't the only pair to go through a change!  Another row of growing bosom goes through the process with its sisters, getting larger.");
				} else {
					MainView.outputText(Utils.randomChoice("\n\nA faint warmth buzzes to the surface of your " + Descriptors.breastDescript(index) + ", the fluttering tingles seeming to vibrate faster and faster just underneath your " + player.skin() + ".  Soon, the heat becomes uncomfortable, and that row of chest-flesh begins to feel tight, almost thrumming like a newly-stretched drum.  You " + Descriptors.nippleDescript(index) + "s go rock hard, and though the discomforting feeling of being stretched fades, the pleasant, warm buzz remains.  It isn't until you cup your tingly tits that you realize they've grown larger, almost in envy of the pair above.", "\n\nA faintly muffled gurgle emanates from your " + Descriptors.breastDescript(index) + " for a split-second, just before your flesh shudders and shakes, stretching your " + player.skinFurScales() + " outward with newly grown breast.  Idly, you cup your hands to your swelling bosom, and though it stops soon, you realize that your breasts have grown closer in size to the pair above.", "\n\nAn uncomfortable stretching sensation spreads its way across the curves of your " + Descriptors.breastDescript(index) + ", threads of heat tingling through your flesh.  It feels as though your heartbeat has been magnified tenfold within the expanding mounds, your " + player.skin() + " growing flushed with arousal and your " + Descriptors.nippleDescript(index) + " filling with warmth.  As the tingling heat gradually fades, a few more inches worth of jiggling breast spill forth.  Cupping them experimentally, you confirm that they have indeed grown to be a bit more in line with the size of the pair above."));
				}
				//Bigger change!
				if (breastRow.breastRating <= (player.breastRows[index - 1].breastRating - 3)) {
					breastRow.breastRating += 2 + Utils.rand(2);
				} else { //Smallish change.
					breastRow.breastRating++;
				}
				MainView.outputText("  You do a quick measurement and determine that your " + Utils.num2Text2(index + 1) + " row of breasts are now " + player.breastCup(index) + "s.");
				if (!tits) {
					tits = true;
					changes++;
				}
				EngineCore.dynStats("sen", 2, "lus", 10);
			}
		});
		//HEAT!
		if (player.statusAffectv2(StatusAffects.Heat) < 30 && Utils.rand(6) === 0 && changes < changeLimit && player.goIntoHeat(true)) {
			changes++;
		}
		//[Grow Fur]
		//FOURTH
		if ((enhanced || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_FOX) && player.skinType !== AppearanceDefs.SKIN_TYPE_FUR && changes < changeLimit && Utils.rand(4) === 0) {
			//from scales
			if (player.skinType === AppearanceDefs.SKIN_TYPE_SCALES) {
				MainView.outputText("\n\nYour skin shifts and every scale stands on end, sending you into a mild panic.  No matter how you tense, you can't seem to flatten them again.  The uncomfortable sensation continues for some minutes until, as one, every scale falls from your body and a fine coat of fur pushes out.  You briefly consider collecting them, but when you pick one up, it's already as dry and brittle as if it were hundreds of years old.  <b>Oh well; at least you won't need to sun yourself as much with your new fur.</b>");
			} else { //from skin
				MainView.outputText("\n\nYour skin itches all over, the sudden intensity and uniformity making you too paranoid to scratch.  As you hold still through an agony of tiny tingles and pinches, fine, luxuriant fur sprouts from every bare inch of your skin!  <b>You'll have to get used to being furry...</b>");
			}
			player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
			player.skinAdj = "";
			player.skinDesc = "fur";
			changes++;
		}
		//[Grow Fox Legs]
		//THIRD
		if ((enhanced || player.earType === AppearanceDefs.EARS_FOX) && player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_FOX && changes < changeLimit && Utils.rand(5) === 0) {
			//4 legs good, 2 legs better
			if (player.isTaur()) {
				MainView.outputText("\n\nYou shiver as the strength drains from your back legs.  Shaken, you sit on your haunches, forelegs braced wide to stop you from tipping over;  their hooves scrape the dirt as your lower body shrinks, dragging them backward until you can feel the upper surfaces of your hindlegs with their undersides.  A wave of nausea and vertigo overtakes you, and you close your eyes to shut out the sensations.  When they reopen, what greets them are not four legs, but only two... and those roughly in the shape of your old hindleg, except for the furry toes where your hooves used to be.  <b>You now have fox legs!</b>");
			} else if (player.isNaga()) { //n*ga please
				MainView.outputText("\n\nYour scales split at the waistline and begin to peel, shedding like old snakeskin.  If that weren't curious enough, the flesh - not scales - underneath is pink and new, and the legs it covers crooked into the hocks and elongated feet of a field animal.  As the scaly coating falls and you step out of it, walking of necessity on your toes, a fine powder blows from the dry skin.  Within minutes, it crumbles completely and is taken by the ever-moving wind.  <b>Your legs are now those of a fox!</b>");
			} else if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HOOFED || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DOG || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CAT || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_BUNNY || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_KANGAROO) { //other digitigrade
				MainView.outputText("\n\nYour legs twitch and quiver, forcing you to your seat.  As you watch, the ends shape themselves into furry, padded toes.  <b>You now have fox feet!</b>  Rather cute ones, actually.");
			} else if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DRIDER_LOWER_BODY) { //red drider bb gone
				MainView.outputText("\n\nYour legs buckle under you and you fall, smashing your abdomen on the ground.  Though your control deserts and you cannot see behind you, still you feel the disgusting sensation of chitin loosening and sloughing off your body, and the dry breeze on your exposed nerves.  Reflexively, your legs cling together to protect as much of their now-sensitive surface as possible.  When you try to part them, you find you cannot.  Several minutes pass uncomforably until you can again bend your legs, and when you do, you find that all the legs of a side bend together - <b>in the shape of a fox's leg!</b>");
			} else if (player.isGoo()) { //goo home and goo to bed
				MainView.outputText("\n\nIt takes a while before you notice that your gooey mounds have something more defined in them.  As you crane your body and shift them around to look, you can just make out a semi-solid mass in the shape of a crooked, animalistic leg.  You don't think much of it until, a few minutes later, you step right out of your swishing gooey undercarriage and onto the new foot.  The goo covering it quickly dries up, as does the part you left behind, <b>revealing a pair of dog-like fox legs!</b>");
			} else { //reg legs, not digitigrade
				MainView.outputText("\n\nYour hamstrings tense painfully and begin to pull, sending you onto your face.  As you writhe on the ground, you can feel your thighs shortening and your feet stretching");
				if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_BEE) {
					MainView.outputText(", while a hideous cracking fills the air");
				}
				MainView.outputText(".  When the spasms subside and you can once again stand, <b>you find that your legs have been changed to those of a fox!</b>");
			}
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_FOX;
			changes++;
		}
		//Grow Fox Ears]
		//SECOND
		if ((enhanced || player.tailType === AppearanceDefs.TAIL_TYPE_FOX) && player.earType !== AppearanceDefs.EARS_FOX && changes < changeLimit && Utils.rand(4) === 0) {
			//from human/gob/liz ears
			if (player.earType === AppearanceDefs.EARS_HUMAN || player.earType === AppearanceDefs.EARS_ELFIN || player.earType === AppearanceDefs.EARS_LIZARD) {
				MainView.outputText("\n\nThe sides of your face painfully stretch as your ears elongate and begin to push past your hairline, toward the top of your head.  They elongate, becoming large vulpine triangles covered in bushy fur.  <b>You now have fox ears.</b>");
			} else { //from dog/cat/roo ears
				MainView.outputText("\n\nYour ears change, shifting from their current shape to become vulpine in nature.  <b>You now have fox ears.</b>");
			}
			player.earType = AppearanceDefs.EARS_FOX;
			changes++;
		}
		//[Grow Fox Tail](fairly common)
		//FIRST
		if (player.tailType !== AppearanceDefs.TAIL_TYPE_FOX && changes < changeLimit && Utils.rand(4) === 0) {
			//from no tail
			if (player.tailType === AppearanceDefs.TAIL_TYPE_NONE) {
				MainView.outputText("\n\nA pressure builds on your backside.  You feel under your [armor] and discover a strange nodule growing there that seems to be getting larger by the second.  With a sudden flourish of movement, it bursts out into a long and bushy tail that sways hypnotically, as if it had a mind of its own.  <b>You now have a fox's tail!</b>");
			} else { //from another type of tail
				MainView.outputText("\n\nPain lances through your lower back as your tail shifts violently.  With one final aberrant twitch, it fluffs out into a long, bushy fox tail that whips around in an almost hypnotic fashion.  <b>You now have a fox's tail!</b>");
			}
			player.tailType = AppearanceDefs.TAIL_TYPE_FOX;
			player.tailVenom = 1;
			changes++;
		}
		//[Grow Fox Face]
		//LAST - muzzlygoodness
		//should work from any face, including other muzzles
		if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR && player.faceType !== AppearanceDefs.FACE_FOX && changes < changeLimit && Utils.rand(5) === 0) {
			MainView.outputText("\n\nYour face pinches and you clap your hands to it.  Within seconds, your nose is poking through those hands, pushing them slightly to the side as new flesh and bone build and shift behind it, until it stops in a clearly defined, tapered, and familiar point you can see even without the aid of a mirror.  <b>Looks like you now have a fox's face.</b>");
			if (EngineCore.silly()) {
				MainView.outputText("  And they called you crazy...");
			}
			changes++;
			player.faceType = AppearanceDefs.FACE_FOX;
		}
		if (player.tone > 40 && changes < changeLimit && Utils.rand(2) === 0) {
			MainView.outputText("\n\nMoving brings with it a little more jiggle than you're used to.  You don't seem to have gained weight, but your muscles seem less visible, and various parts of you are pleasantly softer.");
			player.tone -= 4;
		}
		//Nipples Turn Back:
		if (player.findStatusAffect(StatusAffects.BlackNipples) >= 0 && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nSomething invisible brushes against your " + Descriptors.nippleDescript(0) + ", making you twitch.  Undoing your clothes, you take a look at your chest and find that your nipples have turned back to their natural flesh colour.");
			changes++;
			player.removeStatusAffect(StatusAffects.BlackNipples);
		}
		//Debugcunt
		if (changes < changeLimit && Utils.rand(3) === 0 && player.vaginaType() === 5 && player.hasVagina()) {
			MainView.outputText("\n\nSomething invisible brushes against your sex, making you twinge.  Undoing your clothes, you take a look at your vagina and find that it has turned back to its natural flesh colour.");
			player.vaginaType(0);
			changes++;
		}
		if (changes === 0) {
			MainView.outputText("\n\nWell that didn't do much, but you do feel a little refreshed!");
			EngineCore.fatigue(-5);
		}
	};
	Mutations.godMead = function(player) {
		MainView.clearOutput();
		MainView.outputText("You take a hearty swig of mead, savoring the honeyed taste on your tongue.  Emboldened by the first drink, you chug the remainder of the horn's contents in no time flat.  You wipe your lips, satisfied, and let off a small belch as you toss the empty horn aside.");
		//Libido: No desc., always increases.
		//Corruption: No desc., always decreases.
		EngineCore.dynStats("lib", 1, "cor", -1);
		//Health/HP(Large increase; always occurs):
		MainView.outputText("\n\nYou feel suddenly invigorated by the potent beverage, like you could take on a whole horde of barbarians or giants and come out victorious!");
		EngineCore.HPChange(Math.round(player.maxHP() * 0.33), false);
		if ( Utils.rand(3) === 0) {
			MainView.outputText("\n\nThe alcohol fills your limbs with vigor, making you feel like you could take on the world with just your fists!");
			if (EngineCore.silly()) {
				MainView.outputText("  Maybe you should run around shirtless, drink, and fight!  Saxton Hale would be proud.");
			}
			EngineCore.dynStats("str", 1);
		} else { //Tough:
			MainView.outputText("\n\nYou thump your chest and grin - your foes will have a harder time taking you down while you're fortified by liquid courage.");
			EngineCore.dynStats("tou", 1);
		}
		//Grow Beard [ONLY if PC has a masculine face & a dick.)( -- Why? Bearded ladies are also a fetish [That's just nasty.] (I want a lady beard)): A sudden tingling runs along your chin. You rub it with your hand, and find a thin layer of bristles covering your lower face. You now sport a fine [player.HairColor] beard!
		//[If player already has beard] A sudden tingling runs along your chin. You stroke your beard proudly as it slowly grows in length and lustre.
		//Grow hair: Your scalp is beset by pins and needles as your hair grows out, stopping after it reaches [medium/long] length.}
	};
	Mutations.sheepMilk = function() {
		MainView.outputText("You gulp the bottle's contents, and its sweet taste immediately invigorates you, making you feel calm and concentrated", true);
		//-30 fatigue, -2 libido, -10 lust]
		EngineCore.fatigue(-30);
		EngineCore.dynStats("lib", -0.25, "lus", -10, "cor", -0.5);
	};
//Item: Dragon Egg (Z) (FEN CODED TO HERE - OR AT LEAST COPIED INTO THE CODE FOR FUTURE CODING)
//Itemdescription - "A large, solid egg, easily the size of your clenched fist.  Its shell color is reddish-white, with blue splotches."
	Mutations.eatEmberEgg = function(player) {
		MainView.clearOutput();
		//Effect:
		//Boosts the special effect of Dragonbreath by 20% for 1 use. ie: if Tainted's breath weapon has a 80% chance to stun on hit, +20% equals 100% chance to stun.
		MainView.outputText("You crack the shell easily and swallow the large yolk and the copious amounts of albumen - the yolk is blue, while the rest is crimson-tinted.  It tastes like... well, it tastes mostly of spiced mint, you think.");
		if (player.findPerk(PerkLib.Dragonfire) >= 0) {
			if (player.findStatusAffect(StatusAffects.DragonBreathCooldown) >= 0) {
				player.removeStatusAffect(StatusAffects.DragonBreathCooldown);
			} else if (player.findStatusAffect(StatusAffects.DragonBreathBoost) < 0) {
				player.createStatusAffect(StatusAffects.DragonBreathBoost, 0, 0, 0, 0);
			}
			//(if PC has breath weapon)
			MainView.outputText("\n\nA sudden surge of energy fills your being and you feel like you could blast anything to atoms with a single breath, like the mighty dragons of legends.");
		}
		EngineCore.fatigue(-20);
	};
//Inventory Description:
//9999A shining teardrop-shaped jewel.  An eerie blue flame dances beneath the surface.
//Fox Jewel (Magatama)
//Consume:
	Mutations.foxJewel = function(mystic, player) {
		MainView.clearOutput();
		var changes = 0;
		var changeLimit = 1;
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(3) === 0) {
			changeLimit++;
		}
		if (mystic) {
			changeLimit += 2;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		if (mystic) {
			MainView.outputText("You examine the jewel for a bit, rolling it around in your hand as you ponder its mysteries.  You hold it up to the light with fascinated curiosity, watching the eerie purple flame dancing within.  Without warning, the gem splits down the center, dissolving into nothing in your hand.  As the pale lavender flames swirl around you, the air is filled with a sickly sweet scent that drips with the bitter aroma of licorice, filling you with a dire warmth.");
		} else {
			MainView.outputText("You examine the jewel for a bit, rolling it around in your hand as you ponder its mysteries.  You hold it up to the light with fascinated curiosity, watching the eerie blue flame dancing within.  Without warning, the gem splits down the center, dissolving into nothing in your hand.  As the pale azure flames swirl around you, the air is filled with a sweet scent that drips with the aroma of wintergreen, sending chills down your spine.");
		}
		//**********************
		//BASIC STATS
		//**********************
		//[increase Intelligence, Libido and Sensitivity]
		if (player.inte < 100 && changes < changeLimit && ((mystic && Utils.rand(2) === 0) || (!mystic && Utils.rand(4) === 0))) {
			MainView.outputText("\n\nYou close your eyes, smirking to yourself mischievously as you suddenly think of several new tricks to try on your opponents; you feel quite a bit more cunning.  The mental image of them helpless before your cleverness makes you shudder a bit, and you lick your lips and stroke yourself as you feel your skin tingling from an involuntary arousal.");
			//Raise INT, Lib, Sens. and +10 LUST
			EngineCore.dynStats("int", 2, "lib", 1, "sen", 2, "lus", 10);
			changes++;
		}
		//[decrease Strength toward 15]
		if (player.str > 15 && changes < changeLimit && ((mystic && Utils.rand(2) === 0) || (!mystic && Utils.rand(3) === 0))) {
			MainView.outputText("\n\nYou can feel your muscles softening as they slowly relax, becoming a tad weaker than before.  Who needs physical strength when you can outwit your foes with trickery and mischief?  You tilt your head a bit, wondering where that thought came from.");
			EngineCore.dynStats("str", -1);
			if (player.str > 70) {
				EngineCore.dynStats("str", -1);
			}
			if (player.str > 50) {
				EngineCore.dynStats("str", -1);
			}
			if (player.str > 30) {
				EngineCore.dynStats("str", -1);
			}
			changes++;
		}
		//[decrease Toughness toward 20]
		if (player.tou > 20 && changes < changeLimit && ((mystic && Utils.rand(2) === 0) || (!mystic && Utils.rand(3) === 0))) {
			//from 66 or less toughness
			if (player.tou <= 66) {
				MainView.outputText("\n\nYou feel your " + player.skinFurScales() + " becoming noticeably softer.  A gentle exploratory pinch on your arm confirms it - your " + player.skinFurScales() + " won't offer you much protection.");
			} else { //from 66 or greater toughness
				MainView.outputText("\n\nYou feel your " + player.skinFurScales() + " becoming noticeably softer.  A gentle exploratory pinch on your arm confirms it - your hide isn't quite as tough as it used to be.");
			}
			EngineCore.dynStats("tou", -1);
			if (player.tou > 66) {
				EngineCore.dynStats("tou", -1);
			}
			changes++;
		}
		if (mystic && changes < changeLimit && Utils.rand(2) === 0 && player.cor < 100) {
			if (player.cor < 33) {
				MainView.outputText("\n\nA sense of dirtiness comes over you, like the magic of this gem is doing some perverse impropriety to you.");
			} else if (player.cor < 66) {
				MainView.outputText("\n\nA tingling wave of sensation rolls through you, but you have no idea what exactly just changed.  It must not have been that important.");
			} else {
				MainView.outputText("\n\nThoughts of mischief roll across your consciousness, unbounded by your conscience or any concern for others.  You should really have some fun - who cares who it hurts, right?");
			}
			EngineCore.dynStats("cor", 1);
		}
		//**********************
		//MEDIUM/SEXUAL CHANGES
		//**********************
		//[adjust Femininity toward 50]
		//from low to high
		//Your facial features soften as your body becomes more androgynous.
		//from high to low
		//Your facial features harden as your body becomes more androgynous.
		if (((mystic && Utils.rand(2) === 0) || (!mystic && Utils.rand(4) === 0)) && changes < changeLimit && player.femininity !== 50) {
			MainView.outputText(player.modFem(50, 2), false);
			changes++;
		}
		//[decrease muscle tone toward 40]
		if (player.tone >= 40 && changes < changeLimit && ((mystic && Utils.rand(2) === 0) || (!mystic && Utils.rand(4) === 0))) {
			MainView.outputText("\n\nMoving brings with it a little more jiggle than you're used to.  You don't seem to have gained weight, but your muscles seem less visible, and various parts of you are pleasantly softer.");
			player.tone -= 2 + Utils.rand(3);
			changes++;
		}
		//[Adjust hips toward 10 – wide/curvy/flared]
		//from narrow to wide
		if (player.hipRating < 10 && ((mystic && Utils.rand(2) === 0) || (!mystic && Utils.rand(3) === 0)) && changes < changeLimit) {
			player.hipRating++;
			if (player.hipRating < 7) {
				player.hipRating++;
			}
			if (player.hipRating < 4) {
				player.hipRating++;
			}
			MainView.outputText("\n\nYou stumble a bit as the bones in your pelvis rearrange themselves painfully.  Your hips have widened nicely!");
			changes++;
		}
		//from wide to narrower
		if (player.hipRating > 10 && ((mystic && Utils.rand(2) === 0) || (!mystic && Utils.rand(3) === 0)) && changes < changeLimit) {
			player.hipRating--;
			if (player.hipRating > 14) {
				player.hipRating--;
			}
			if (player.hipRating > 19) {
				player.hipRating--;
			}
			if (player.hipRating > 24) {
				player.hipRating--;
			}
			MainView.outputText("\n\nYou stumble a bit as the bones in your pelvis rearrange themselves painfully.  Your hips have narrowed.");
			changes++;
		}
		//[Adjust hair length toward range of 16-26 – very long to ass-length]
		if ((player.hairLength < 16 || player.hairLength > 26) && ((mystic && Utils.rand(2) === 0) || (!mystic && Utils.rand(3) === 0)) && changes < changeLimit) {
			//from short to long
			if (player.hairLength < 16) {
				player.hairLength += 3 + Utils.rand(3);
				MainView.outputText("\n\nYou experience a tingling sensation in your scalp.  Feeling a bit off-balance, you discover your hair has lengthened, becoming " + Descriptors.hairDescript() + ".");
			} else { //from long to short
				player.hairLength -= 3 + Utils.rand(3);
				MainView.outputText("\n\nYou experience a tingling sensation in your scalp.  Feeling a bit off-balance, you discover your hair has shed a bit of its length, becoming " + Descriptors.hairDescript() + ".");
			}
			changes++;
		}
		//[Increase Vaginal Capacity] - requires vagina, of course
		if (player.hasVagina() && ((mystic && Utils.rand(2) === 0) || (!mystic && Utils.rand(3) === 0)) && player.statusAffectv1(StatusAffects.BonusVCapacity) < 200 && changes < changeLimit) {
			MainView.outputText("\n\nA gurgling sound issues from your abdomen, and you double over as a trembling ripple passes through your womb.  The flesh of your stomach roils as your internal organs begin to shift, and when the sensation finally passes, you are instinctively aware that your " + Descriptors.vaginaDescript(0) + " is a bit deeper than it was before.");
			if (player.findStatusAffect(StatusAffects.BonusVCapacity) < 0) {
				player.createStatusAffect(StatusAffects.BonusVCapacity, 0, 0, 0, 0);
			}
			player.addStatusValue(StatusAffects.BonusVCapacity, 1, 5 + Utils.rand(10));
			changes++;
		} else if (player.hasVagina() && ((mystic) || (!mystic && Utils.rand(5) === 0)) && player.statusAffectv1(StatusAffects.BonusVCapacity) >= 200 && player.statusAffectv1(StatusAffects.BonusVCapacity) < 8000 && changes < changeLimit) { //[Vag of Holding] - rare effect, only if PC has high vaginal looseness
			MainView.outputText("\n\nYou clutch your stomach with both hands, dropping to the ground in pain as your internal organs begin to twist and shift violently inside you.  As you clench your eyes shut in agony, you are overcome with a sudden calm.  The pain in your abdomen subsides, and you feel at one with the unfathomable infinity of the universe, warmth radiating through you from the vast swirling cosmos contained within your womb.");
			if (EngineCore.silly()) {
				MainView.outputText("  <b>Your vagina has become a universe unto itself, capable of accepting colossal insertions beyond the scope of human comprehension!</b>");
			} else {
				MainView.outputText("  <b>Your vagina is now capable of accepting even the most ludicrously sized insertions with no ill effects.</b>");
			}
			player.changeStatusValue(StatusAffects.BonusVCapacity, 1, 8000);
			changes++;
		}
		//**********************
		//BIG APPEARANCE CHANGES
		//**********************
		//[Grow Fox Tail]
		if (player.tailType !== AppearanceDefs.TAIL_TYPE_FOX && changes < changeLimit && ((mystic && Utils.rand(2) === 0) || (!mystic && Utils.rand(4) === 0))) {
			//if PC has no tail
			if (player.tailType === AppearanceDefs.TAIL_TYPE_NONE) {
				MainView.outputText("\n\nA pressure builds on your backside.  You feel under your " + player.armorName + " and discover a strange nodule growing there that seems to be getting larger by the second.  With a sudden flourish of movement, it bursts out into a long and bushy tail that sways hypnotically, as if it has a mind of its own.  <b>You now have a fox-tail.</b>");
			} else if (player.tailType !== AppearanceDefs.TAIL_TYPE_FOX) { //if PC has another type of tail
				MainView.outputText("\n\nPain lances through your lower back as your tail shifts and twitches violently.  With one final aberrant twitch, it fluffs out into a long, bushy fox tail that whips around in an almost hypnotic fashion.  <b>You now have a fox-tail.</b>");
			}
			player.tailType = AppearanceDefs.TAIL_TYPE_FOX;
			player.tailVenom = 1;
			changes++;
		}
		if (!mystic && player.earType === AppearanceDefs.EARS_FOX && player.tailType === AppearanceDefs.TAIL_TYPE_FOX && player.tailVenom === 8 && Utils.rand(3) === 0) {
			MainView.outputText("\n\nYou have the feeling that if you could grow a ninth tail you would be much more powerful, but you would need to find a way to enhance one of these gems or meditate with one to have a chance at unlocking your full potential.");
		} else if (player.tailType === AppearanceDefs.TAIL_TYPE_FOX && player.tailVenom < 8 && player.tailVenom + 1 <= player.level && player.tailVenom + 1 <= player.inte / 10 && changes < changeLimit && ((mystic && Utils.rand(2) === 0) || (!mystic && Utils.rand(3) === 0))) { //[Grow Addtl. Fox Tail] //(rare effect, up to max of 8 tails, requires PC level and int*10 = number of tail to be added)
			//if PC has 1 fox tail
			if (player.tailVenom === 1) {
				MainView.outputText("\n\nA tingling pressure builds on your backside, and your bushy tail begins to glow with an eerie, ghostly light.  With a crackle of electrical energy, your tail splits into two!  <b>You now have a pair of fox-tails.</b>");
				//increment tail by 1
			} else { //else if PC has 2 or more fox tails
				MainView.outputText("\n\nA tingling pressure builds on your backside, and your bushy tails begin to glow with an eerie, ghostly light.  With a crackle of electrical energy, one of your tails splits in two, giving you " + Utils.num2Text(player.tailVenom + 1) + "!  <b>You now have a cluster of " + Utils.num2Text(player.tailVenom + 1) + " fox-tails.</b>");
				//increment tail by 1
			}
			player.tailVenom++;
			changes++;
		} else if (mystic && Utils.rand(4) === 0 && changes < changeLimit && player.tailType === AppearanceDefs.TAIL_TYPE_FOX && player.tailVenom === 8 && player.level >= 9 && player.earType === AppearanceDefs.EARS_FOX && player.inte >= 90 && player.findPerk(PerkLib.CorruptedNinetails) < 0 && player.findPerk(PerkLib.EnlightenedNinetails) < 0) { //[Grow 9th tail and gain Corrupted Nine-tails perk]
			MainView.outputText("Your bushy tails begin to glow with an eerie, ghostly light, and with a crackle of electrical energy, split into nine tails.  <b>You are now a nine-tails!  But something is wrong...  The cosmic power radiating from your body feels...  tainted somehow.  The corruption pouring off your body feels...  good.</b>");
			MainView.outputText("\n\nYou have the inexplicable urge to set fire to the world, just to watch it burn.  With your newfound power, it's a goal that is well within reach.");
			MainView.outputText("\n\n(Perk Gained: Corrupted Nine-tails - Grants two magical special attacks.)");
			player.createPerk(PerkLib.CorruptedNinetails, 0, 0, 0, 0);
			EngineCore.dynStats("lib", 2, "lus", 10, "cor", 10);
			player.tailVenom = 9;
			changes++;
		}
		//[Grow Fox Ears]
		if (player.tailType === AppearanceDefs.TAIL_TYPE_FOX && ((mystic && Utils.rand(2) === 0) || (!mystic && Utils.rand(4) === 0)) && player.earType !== AppearanceDefs.EARS_FOX && changes < changeLimit) {
			//if PC has non-animal ears
			if (player.earType === AppearanceDefs.EARS_HUMAN) {
				MainView.outputText("\n\nThe sides of your face painfully stretch as your ears morph and begin to migrate up past your hairline, toward the top of your head.  They elongate, becoming large vulpine triangles covered in bushy fur.  You now have fox ears.");
			} else { //if PC has animal ears
				MainView.outputText("\n\nYour ears change shape, shifting from their current shape to become vulpine in nature.  You now have fox ears.");
			}
			player.earType = AppearanceDefs.EARS_FOX;
			changes++;
		}
		//[Change Hair Color: Golden-blonde, SIlver Blonde, White, Black, Red]
		if (((mystic && Utils.rand(2) === 0) || (!mystic && Utils.rand(4) === 0)) && changes < changeLimit && player.hairColor !== "golden blonde" && player.hairColor !== "silver blonde" && player.hairColor !== "white" && player.hairColor !== "black" && player.hairColor !== "red") {
			var hairTemp = Utils.rand(10);
			if (hairTemp === 0) {
				player.hairColor = "golden blonde";
			} else if (hairTemp === 1) {
				player.hairColor = "silver blonde";
			} else if (hairTemp <= 3) {
				player.hairColor = "white";
			} else if (hairTemp <= 6) {
				player.hairColor = "black";
			} else {
				player.hairColor = "red";
			}
			MainView.outputText("\n\nYour scalp begins to tingle, and you gently grasp a strand, pulling it forward to check it.  Your hair has become the same " + player.hairColor + " as a kitsune's!");
			changes++;
		}
		//[Change Skin Type: remove fur or scales, change skin to Tan, Olive, or Light]
		if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR || player.skinType === AppearanceDefs.SKIN_TYPE_SCALES && ((mystic) || (!mystic && Utils.rand(2) === 0))) {
			MainView.outputText("\n\nYou begin to tingle all over your " + player.skin() + ", starting as a cool, pleasant sensation but gradually worsening until you are furiously itching all over.");
			if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
				MainView.outputText("  You stare in horror as you pull your fingers away holding a handful of " + player.hairColor + " fur!  Your fur sloughs off your body in thick clumps, falling away to reveal patches of bare, " + player.skinTone + " skin.");
			} else if (player.skinType === AppearanceDefs.SKIN_TYPE_SCALES) {
				MainView.outputText("  You stare in horror as you pull your fingers away holding a handful of dried up scales!  Your scales continue to flake and peel off your skin in thick patches, revealing the tender " + player.skinTone + " skin underneath.");
			}
			MainView.outputText("  Your skin slowly turns raw and red under your severe scratching, the tingling sensations raising goosebumps across your whole body.  Over time, the itching fades, and your flushed skin resolves into a natural-looking ");
			player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
			player.skinAdj = "";
			player.skinDesc = "skin";
			if (!mystic && player.skinTone !== "tan" && player.skinTone !== "olive" && player.skinTone !== "light") {
				var skinTemp = Utils.rand(3);
				if (skinTemp === 0) {
					player.skinTone = "tan";
				} else if (skinTemp === 1) {
					player.skinTone = "olive";
				} else {
					player.skinTone = "light";
				}
			} else if (mystic && player.skinTone !== "dark" && player.skinTone !== "ebony" && player.skinTone !== "ashen" && player.skinTone !== "sable" && player.skinTone !== "milky white") {
				var skinT = Utils.rand(5);
				if (skinT === 0) {
					player.skinTone = "dark";
				} else if (skinT === 1) {
					player.skinTone = "ebony";
				} else if (skinT === 2) {
					player.skinTone = "ashen";
				} else if (skinT === 3) {
					player.skinTone = "sable";
				} else {
					player.skinTone = "milky white";
				}
			}
			MainView.outputText(player.skinTone + " complexion.");
			MainView.outputText("  <b>You now have " + player.skin() + "!</b>");
			changes++;
		} else if (mystic && player.skinTone !== "dark" && player.skinTone !== "ebony" && player.skinTone !== "ashen" && player.skinTone !== "sable" && player.skinTone !== "milky white" && changes < changeLimit && ((mystic && Utils.rand(2) === 0) || (!mystic && Utils.rand(3) === 0))) { //Change skin tone if not changed you!
			MainView.outputText("\n\nYou feel a crawling sensation on the surface of your skin, starting at the small of your back and spreading to your extremities, ultimately reaching your face.  Holding an arm up to your face, you discover that <b>you now have ");
			var mtoneTemp = Utils.rand(5);
			if (mtoneTemp === 0) {
				player.skinTone = "dark";
			} else if (mtoneTemp === 1) {
				player.skinTone = "ebony";
			} else if (mtoneTemp === 2) {
				player.skinTone = "ashen";
			} else if (mtoneTemp === 3) {
				player.skinTone = "sable";
			} else {
				player.skinTone = "milky white";
			}
			MainView.outputText(player.skin() + "!</b>");
			changes++;
		} else if (!mystic && player.skinTone !== "tan" && player.skinTone !== "olive" && player.skinTone !== "light" && changes < changeLimit && ((mystic && Utils.rand(2) === 0) || (!mystic && Utils.rand(3) === 0))) { //Change skin tone if not changed you!
			MainView.outputText("\n\nYou feel a crawling sensation on the surface of your skin, starting at the small of your back and spreading to your extremities, ultimately reaching your face.  Holding an arm up to your face, you discover that <b>you now have ");
			var toneTemp = Utils.rand(3);
			if (toneTemp === 0) {
				player.skinTone = "tan";
			} else if (toneTemp === 1) {
				player.skinTone = "olive";
			} else {
				player.skinTone = "light";
			}
			MainView.outputText(player.skin() + "!</b>");
			changes++;
		} else if ((mystic && 9999 === 0 && (player.skinTone === "dark" || player.skinTone === "ebony" || player.skinTone === "ashen" || player.skinTone === "sable" || player.skinTone === "milky white")) || (!mystic && 9999 === 0 && (player.skinTone === "tan" || player.skinTone === "olive" || player.skinTone || "light")) && changes < changeLimit) { //[Change Skin Color: add "Tattoos"] //From Tan, Olive, or Light skin tones
			MainView.outputText("You feel a crawling sensation on the surface of your skin, starting at the small of your back and spreading to your extremities, ultimately reaching your face.  You are caught by surprise when you are suddenly assaulted by a blinding flash issuing from areas of your skin, and when the spots finally clear from your vision, an assortment of glowing tribal tattoos adorns your " + player.skin() + ".  The glow gradually fades, but the distinctive ");
			if (mystic) {
				MainView.outputText("angular");
			} else {
				MainView.outputText("curved");
			}
			MainView.outputText(" markings remain, as if etched into your skin.");
			changes++;
			//9999 - pending tats system
		}
		//Nipples Turn Back:
		if (player.findStatusAffect(StatusAffects.BlackNipples) >= 0 && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nSomething invisible brushes against your " + Descriptors.nippleDescript(0) + ", making you twitch.  Undoing your clothes, you take a look at your chest and find that your nipples have turned back to their natural flesh colour.");
			changes++;
			player.removeStatusAffect(StatusAffects.BlackNipples);
		}
		//Debugcunt
		if (changes < changeLimit && Utils.rand(3) === 0 && player.vaginaType() === 5 && player.hasVagina()) {
			MainView.outputText("\n\nSomething invisible brushes against your sex, making you twinge.  Undoing your clothes, you take a look at your vagina and find that it has turned back to its natural flesh colour.");
			player.vaginaType(0);
			changes++;
		}
		if (changes === 0) {
			MainView.outputText("\n\nOdd.  You don't feel any different.");
		}
	};
//Fish Fillet
	Mutations.fishFillet = function(player) {
		MainView.clearOutput();
		if (!CoC.isInCombat()) {
			MainView.outputText("You sit down and unwrap your fish fillet. It's perfectly flaky, allowing you to break it off in bite-sized chunks.  The salty meal disappears quickly, and your stomach gives an appreciative gurgle.");
		} else {
			MainView.outputText("You produce the fish fillet from your bag.  Rather than unwrap it and savor the taste as you normally would, you take a large bite out of it, leaf wrapping and all.  In no time your salty meal is gone, your stomach giving an appreciative gurgle.");
		}
		//Increase HP by quite a bit!)
		//(Slight chance at increasing Toughness?)
		//(If lake has been tainted, +1 Corruption?)
		if (player.findStatusAffect(StatusAffects.FactoryOverload) >= 0) {
			EngineCore.dynStats("cor", 0.5);
		}
		EngineCore.dynStats("cor", 0.1);
		EngineCore.HPChange(Math.round(player.maxHP() * 0.25), false);
	};
//Trap Oil
//Flavour Description: A round, opaque glass vial filled with a clear, viscous fluid.  It has a symbol inscribed on it, a circle with a cross and arrow pointing out of it in opposite directions.  It looks and smells entirely innocuous.
	Mutations.trapOil = function(player) {
		MainView.clearOutput();
		var changes = 0;
		var changeLimit = 1;
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(3) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(3) === 0) {
			changeLimit++;
		}
		if (player.findPerk(PerkLib.HistoryAlchemist) >= 0) {
			changeLimit++;
		}
		MainView.outputText("You pour some of the oil onto your hands and ");
		if (player.cor < 30) {
			MainView.outputText("hesitantly ");
		} else if (player.cor > 70) {
			MainView.outputText("eagerly ");
		}
		MainView.outputText("rub it into your arms and chest.  The substance is warm, coating and ever so slightly numbing; it quickly sinks into your skin, leaving you feeling smooth and sleek.");
		//Speed Increase:
		if (player.spe < 100 && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou feel fleet and lighter on your toes; you sense you could dodge, dart or skip away from anything.");
			EngineCore.dynStats("spe", 1);
			changes++;
		} else if (player.str > 40 && Utils.rand(3) === 0 && changes < changeLimit) { //Strength Loss:
			MainView.outputText("\n\nA sense of helplessness settles upon you as your limbs lose mass, leaving you feeling weaker and punier.");
			EngineCore.dynStats("str", -1);
			changes++;
		}
		//Sensitivity Increase:
		if (player.sens < 70 && player.hasCock() && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nA light breeze brushes over you and your skin tingles.  You have become more sensitive to physical sensation.");
			EngineCore.dynStats("sen", 5);
			changes++;
		}
		//Libido Increase:
		if (player.lib < 70 && player.hasVagina() && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou feel your blood quicken and rise, and a desire to... hunt builds within you.");
			EngineCore.dynStats("lib", 2);
			if (player.lib < 30) {
				EngineCore.dynStats("lib", 2);
			}
			changes++;
		}
		//Body Mass Loss:
		if (player.thickness > 40 && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou feel an odd tightening sensation in your midriff, as if you were becoming narrower and lither.  You frown downwards, and then turn your arms around, examining them closely.  Is it just you or have you lost weight?");
			player.modThickness(40, 3);
			changes++;
		}
		//Thigh Loss: (towards “girly”)
		if (player.hipRating >= 10 && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou touch your thighs speculatively.  It's not just your imagination; you've lost a bit of weight around your waist.");
			player.hipRating--;
			if (player.hipRating > 15) {
				player.hipRating -= 2 + Utils.rand(3);
			}
			changes++;
		}
		//Thigh Gain: (towards “girly”)
		if (player.hipRating < 6 && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou touch your thighs speculatively.  You think you may have gained a little weight around your waist.");
			player.hipRating++;
			changes++;
		}
		//Breast Loss: (towards A cup)
		if (player.biggestTitSize() > 1 && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou gasp as you feel a compressing sensation in your chest and around your [fullChest].  The feeling quickly fades however, leaving you feeling like you have lost a considerable amount of weight from your upper body.");
			_.forEach(player.breastRows, function(breastRow) {
				if (breastRow.breastRating > 70) {
					breastRow.breastRating -= Utils.rand(3) + 15;
				} else if (breastRow.breastRating > 50) {
					breastRow.breastRating -= Utils.rand(3) + 10;
				} else if (breastRow.breastRating > 30) {
					breastRow.breastRating -= Utils.rand(3) + 7;
				} else if (breastRow.breastRating > 15) {
					breastRow.breastRating -= Utils.rand(3) + 4;
				} else {
					breastRow.breastRating -= 2 + Utils.rand(2);
				}
				if (breastRow.breastRating < 1) {
					breastRow.breastRating = 1;
				}
			});
			changes++;
		}
		//Breast Gain: (towards A cup)
		if (player.biggestTitSize() < 1 || player.breastRows[0].breastRating < 1 && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou feel a vague swelling sensation in your [fullChest], and you frown downwards.  You seem to have gained a little weight on your chest.  Not enough to stand out, but- you cup yourself carefully- certainly giving you the faintest suggestion of boobs.");
			_.forEach(player.breastRows, function(breastRow) {
				if (breastRow.breastRating < 1) {
					breastRow.breastRating = 1;
				}
			});
			changes++;
		}
		//Penis Reduction towards 3.5 Inches:
		if (player.longestCockLength() >= 3.5 && player.hasCock() && Utils.rand(2) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou flinch and gasp as your " + Descriptors.multiCockDescriptLight() + " suddenly become");
			if (player.cockTotal() === 1) {
				MainView.outputText("s");
			}
			MainView.outputText(" incredibly sensitive and retract into your body.  Anxiously you pull down your underclothes to examine your nether regions.  To your relief ");
			if (player.cockTotal() === 1) {
				MainView.outputText("it is");
			} else {
				MainView.outputText("they are");
			}
			MainView.outputText(" still present, and as you touch ");
			if (player.cockTotal() === 1) {
				MainView.outputText("it");
			} else {
				MainView.outputText("them");
			}
			MainView.outputText(", the sensitivity fades, however - a blush comes to your cheeks - ");
			if (player.cockTotal() === 1) {
				MainView.outputText("it seems");
			} else {
				MainView.outputText("they seem");
			}
			MainView.outputText(" to have become smaller.");
			_.forEach(player.cocks, function (cock, index) {
				if (cock.cockLength >= 3.5) {
					//Shrink said cock
					if (cock.cockLength < 6 && cock.cockLength >= 2.9) {
						cock.cockLength -= 0.5;
						if (cock.cockThickness * 6 > cock.cockLength) {
							cock.cockThickness -= 0.2;
						}
						if (cock.cockThickness * 8 > cock.cockLength) {
							cock.cockThickness -= 0.2;
						}
						if (cock.cockThickness < 0.5) {
							cock.cockThickness = 0.5;
						}
					}
					cock.cockLength -= 0.5;
					player.increaseCock(index, Math.round(cock.cockLength * 0.33) * -1);
				}
			});
			changes++;
		}
		//Testicle Reduction:
		if (player.balls > 0 && player.hasCock() && (player.ballSize > 1 || player.findStatusAffect(StatusAffects.Uniball) < 0) && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou feel a delicate tightening sensation around your [balls].  The sensation upon this most sensitive part of your anatomy isn't painful, but the feeling of your balls getting smaller is intense enough that you stifle anything more than a sharp intake of breath only with difficulty.");
			player.ballSize--;
			if (player.ballSize > 8) {
				player.ballSize--;
			}
			if (player.ballSize > 10) {
				player.ballSize--;
			}
			if (player.ballSize > 12) {
				player.ballSize--;
			}
			if (player.ballSize > 15) {
				player.ballSize--;
			}
			if (player.ballSize > 20) {
				player.ballSize--;
			}
			//Testicle Reduction final:
			if (player.ballSize < 1 && player.findStatusAffect(StatusAffects.Uniball) < 0) {
				MainView.outputText("  You whimper as once again, your balls tighten and shrink.  Your eyes widen when you feel the gentle weight of your testicles pushing against the top of your [hips], and a few hesitant swings of your rear confirm what you can feel - you've tightened your balls up so much they no longer hang beneath your " + Descriptors.multiCockDescriptLight() + ", but press perkily upwards.  Heat ringing your ears, you explore your new sack with a careful hand.  You are deeply grateful you apparently haven't reversed puberty, but you discover that though you still have " + Utils.num2Text(player.balls) + ", your balls now look and feel like one: one cute, tight little sissy parcel, its warm, insistent pressure upwards upon the joining of your thighs a never-ending reminder of it.");
				//[Note: Balls description should no longer say “swings heavily beneath”.  For simplicity's sake sex scenes should continue to assume two balls]
				player.ballSize = 1;
				player.createStatusAffect(StatusAffects.Uniball, 0, 0, 0, 0);
			} else if (player.ballSize < 1) {
				player.ballSize = 1;
			}
			changes++;
		}
		//Anal Wetness Increase:
		if (player.ass.analWetness < 5 && Utils.rand(4) === 0 && changes < changeLimit) {
			if (player.ass.analWetness < 4) {
				MainView.outputText("\n\nYour eyes widen in shock as you feel oily moisture bead out of your [asshole].  Your asshole has become wetter and more pliable.");
			} else { //Anal Wetness Increase Final (always loose):
				MainView.outputText("\n\nYou moan as clear, odorless oil dribbles out of your [asshole], this time in enough quantity to stain your [armor].  Your back passage feels incredibly sensitive, wet and accommodating.  Your ass is ready to be plowed by anything, and always will be.");
			}
			player.ass.analWetness++;
			//buttChange(30,false,false,false);
			if (player.ass.analLooseness < 3) {
				player.ass.analLooseness++;
			}
			changes++;
			EngineCore.dynStats("sen", 2);
		}
		//Fertility Decrease:
		if (player.hasVagina() && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nThe vague numbness in your skin sinks slowly downwards, and you put a hand on your lower stomach as the sensation centers itself there.  ");
			EngineCore.dynStats("sen", -2);
			//High fertility:
			if (player.fertility >= 30) {
				MainView.outputText("It feels like your overcharged reproductive organs have simmered down a bit.");
			} else if (player.fertility >= 5) { //Average fertility:
				MainView.outputText("You feel like you have dried up a bit inside; you are left feeling oddly tranquil.");
			} else { //[Low/No fertility:
				MainView.outputText("Although the numbness makes you feel serene, the trap oil has no effect upon your ");
				if (player.fertility > 0) {
					MainView.outputText("mostly ");
				}
				MainView.outputText("sterile system.");
				//[Low/No fertility + Trap/Corruption  >70:
				if (player.cor > 70) {
					MainView.outputText("  For some reason the fact that you cannot function as nature intended makes you feel helpless and submissive.  Perhaps the only way to be a useful creature now is to find a dominant, fertile being willing to plow you full of eggs? You shake the alien, yet oddly alluring thought away.");
				}
			}
			player.fertility -= 1 + Utils.rand(3);
			if (player.fertility < 4) {
				player.fertility = 4;
			}
			changes++;
		}
		//Male Effects
		if (player.gender === 1) {
			//Femininity Increase Final (max femininity allowed increased by +10):
			if ( Utils.rand(4) === 0 && changes < changeLimit) {
				if (player.femininity < 70 && player.femininity >= 60) {
					MainView.outputText("\n\nYou laugh as you feel your features once again soften, before stopping abruptly.  Your laugh sounded more like a girly giggle than anything else.  Feeling slightly more sober, you touch the soft flesh of your face prospectively.  The trap oil has changed you profoundly, making your innate maleness... difficult to discern, to say the least.  You suspect you could make yourself look even more like a girl now if you wanted to.");
					if (player.findPerk(PerkLib.Androgyny) < 0) {
						player.createPerk(PerkLib.Androgyny, 0, 0, 0, 0);
						MainView.outputText("\n\n(<b>Perk Gained: Androgyny</b>)");
					}
					player.femininity += 10;
					if (player.femininity > 70) {
						player.femininity = 70;
					}
					changes++;
				} else { //Femininity Increase:
					MainView.outputText("\n\nYour face softens as your features become more feminine.");
					player.femininity += 10;
					changes++;
				}
			}
			//Muscle tone reduction:
			if (player.tone > 20 && Utils.rand(4) === 0 && changes < changeLimit) {
				MainView.outputText("\n\nYou sink a finger into your arm inquiringly.  You seem to have lost some of your muscle definition, leaving you looking softer.");
				player.tone -= 10;
				changes++;
			}
		} else if (player.gender === 2) { //Female Effects
			//Masculinity Increase:
			if (player.femininity > 30 && Utils.rand(4) === 0 && changes < changeLimit) {
				player.femininity -= 10;
				if (player.femininity < 30) {
					player.femininity = 30;
					//Masculinity Increase Final (max masculinity allowed increased by +10):
					MainView.outputText("\n\nYou laugh as you feel your features once again soften, before stopping abruptly.  Your laugh sounded more like a boyish crow than anything else.  Feeling slightly more sober, you touch the defined lines of your face prospectively.  The trap oil has changed you profoundly, making your innate femaleness... difficult to discern, to say the least.  You suspect you could make yourself look even more like a boy now if you wanted to.");
					if (player.findPerk(PerkLib.Androgyny) < 0) {
						player.createPerk(PerkLib.Androgyny, 0, 0, 0, 0);
						MainView.outputText("\n\n(<b>Perk Gained: Androgyny</b>)");
					}
				} else {
					MainView.outputText("\n\nYour face becomes more set and defined as your features turn more masculine.");
				}
				changes++;
			}
			//Muscle tone gain:
			if (player.tone < 80 && Utils.rand(4) === 0 && changes < changeLimit) {
				MainView.outputText("\n\nYou flex your arm in interest.  Although you have become thinner, your muscles seem to have become more defined.");
				player.tone += 10;
				changes++;
			}
		}
		//Nipples Turn Black:
		if (player.findStatusAffect(StatusAffects.BlackNipples) < 0 && Utils.rand(6) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nA tickling sensation plucks at your nipples and you cringe, trying not to giggle.  Looking down you are in time to see the last spot of flesh tone disappear from your [nipples].  They have turned an onyx black!");
			player.createStatusAffect(StatusAffects.BlackNipples, 0, 0, 0, 0);
			changes++;
		}
		//Remove odd eyes
		if (player.eyeType === AppearanceDefs.EYES_FOUR_SPIDER_EYES && Utils.rand(2) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou blink and stumble, a wave of vertigo threatening to pull your " + player.feet() + " from under you.  As you steady and open your eyes, you realize something seems different.  Your vision is changed somehow.", false);
			if (player.eyeType === AppearanceDefs.EYES_FOUR_SPIDER_EYES) {
				MainView.outputText("  Your multiple, arachnid eyes are gone!</b>", false);
			}
			MainView.outputText("  <b>You have normal, humanoid eyes again.</b>", false);
			player.eyeType = AppearanceDefs.EYES_HUMAN;
			changes++;
		}
		//PC Trap Effects
		if (player.eyeType !== AppearanceDefs.EYES_BLACK_EYES_SAND_TRAP && Utils.rand(4) === 0 && changes < changeLimit) {
			player.eyeType = AppearanceDefs.EYES_BLACK_EYES_SAND_TRAP;
			//Eyes Turn Black:
			MainView.outputText("\n\nYou blink, and then blink again.  It feels like something is irritating your eyes.  Panic sets in as black suddenly blooms in the corner of your left eye and then your right, as if drops of ink were falling into them.  You calm yourself down with the thought that rubbing at your eyes will certainly make whatever is happening to them worse; through force of will you hold your hands behind your back and wait for the strange affliction to run its course.  The strange inky substance pools over your entire vision before slowly fading, thankfully taking the irritation with it.  As soon as it goes you stride quickly over to the stream and stare at your reflection.  <b>Your pupils, your irises, your entire eye has turned a liquid black</b>, leaving you looking vaguely like the many half insect creatures which inhabit these lands.  You find you are merely grateful the change apparently hasn't affected your vision.");
			changes++;
		}
		//Vagina Turns Black:
		if (player.hasVagina() && player.vaginaType() !== 5 && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYour [vagina] feels... odd.  You undo your clothes and gingerly inspect your nether regions.  The tender pink color of your sex has disappeared, replaced with smooth, marble blackness starting at your lips and working inwards.");
			//(Wet:
			if (player.wetness() >= 3) {
				MainView.outputText("  Your natural lubrication makes it gleam invitingly.");
			}
			//(Corruption <50:
			if (player.cor < 50) {
				MainView.outputText("  After a few cautious touches you decide it doesn't feel any different- it does certainly look odd, though.");
			} else {
				MainView.outputText("  After a few cautious touches you decide it doesn't feel any different - the sheer bizarreness of it is a big turn on though, and you feel it beginning to shine with anticipation at the thought of using it.");
			}
			MainView.outputText("  <b>Your vagina is now ebony in color.</b>");
			EngineCore.dynStats("sen", 2, "lus", 10);
			player.vaginaType(5);
			changes++;
		}
		//Dragonfly Wings:
		if (player.wingType !== AppearanceDefs.WING_TYPE_GIANT_DRAGONFLY && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou scream and fall to your knees as incredible pain snags at your shoulders, as if needle like hooks were being sunk into your flesh just below your shoulder blades.  After about five seconds of white hot, keening agony it is with almost sexual relief that something splits out of your upper back.  You clench the dirt as you slide what feel like giant leaves of paper into the open air.  Eventually the sensation passes and you groggily get to your feet.  You can barely believe what you can see by craning your neck behind you - <b>you've grown a set of four giant dragonfly wings</b>, thinner, longer and more pointed than the ones you've seen upon the forest bee girls, but no less diaphanous and beautiful.  You cautiously flex the new muscle groups in your shoulder blades and gasp as your new wings whirr and lift you several inches off the ground.  What fun this is going to be!");
			//Wings Fall Out: You feel a sharp pinching sensation in your shoulders and you cringe slightly.  Your former dragonfly wings make soft, papery sounds as they fall into the dirt behind you.
			changes++;
			player.wingType = AppearanceDefs.WING_TYPE_GIANT_DRAGONFLY;
		}
		if (changes === 0) {
			MainView.outputText("\n\nWell... that didn't amount to much.");
			player.wingDesc = "giant dragonfly";
		}
	};
//PurPeac
//Purity Peach - Inventory
	Mutations.purityPeach = function(player) {
		MainView.clearOutput();
		MainView.outputText("You bite into the sweet, juicy peach, feeling a sensation of energy sweeping through your limbs and your mind.  You feel revitalized, refreshed, and somehow cleansed.");
		EngineCore.fatigue(-15);
		EngineCore.HPChange(Math.round(player.maxHP() * 0.25), false);
	};
//New Item: "Purple Fruit"
//This sweet-smelling produce looks like an eggplant but feels almost squishy, and rubbery to the touch. Holding it to your ear, you think you can hear some fluid sloshing around inside.
//>When Used
	Mutations.purpleFruitEssrayle = function(player) {
		MainView.clearOutput();
		MainView.outputText("You bite into the fruit Essrayle gave you with little hesitation.  It's amazingly sweet, with a texture that's rather gummy.  The juice is a candied grape syrup that fills your cheeks and flows down your throat with far more fluid than the size of the plant should allow.  You hastily devour the entire thing, unable to stop yourself once you've started.");
		MainView.outputText("\n\nA tingling warmth shifts to a roaring inferno in your veins, your heart-rate spiking abruptly.  The intensity of it almost makes your body feel molten!  But, as quickly as it came, the sensation fades into merely a pleasing warmth that settles in your chest.");
		if (player.averageNipplesPerBreast() < 4) {
			MainView.outputText("  At first you think nothing has changed, but a second look confirms that your breasts now sport the same quartet of cow-like nipples the bovine plant-girl bears.");
			if (player.nippleLength < 4) {
				player.nippleLength = 4;
			}
			_.forEach(player.breastRows, function(breastRow) {
				breastRow.nipplesPerBreast = 4;
			});
		}
		//[Player gains quad nipples, milk production and libido way up]
		EngineCore.dynStats("lib", 5);
		player.boostLactation(3 * player.bRows());
	};
//TF Items
//Ringtail Fig/RingFig (please do not change the fruit type to suit whimsy because I have some plans for figs)
//tooltip:
//A dried fig with two lobes and thin dark rings just below its stem.  The skin is wrinkly and it looks vaguely like a bulging scrotum.
	Mutations.ringtailFig = function(player) {
		MainView.clearOutput();
		//eat it:
		MainView.outputText("You split the fruit and scoop out the pulp, eating it greedily.  It's sweet and slightly gritty with seeds, and you quickly finish both halves.");
		var changes = 0;
		var changeLimit = 1;
		if ( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(3) === 0) {
			changeLimit++;
		}
		if ( Utils.rand(3) === 0) {
			changeLimit++;
		}
		//stat gains:
		//gain speed to ceiling of 80
		if (player.spe < 80 && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou twitch and turn your head this way and that, feeling a bit more alert.  This will definitely help when defending your personal space from violators.");
			changes++;
			if (player.spe < 40) {
				EngineCore.dynStats("spe", 1);
			}
			EngineCore.dynStats("spe", 1);
		}
		//gain sensitivity
		if (player.sens < 80 && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nThe wrinkled rind suddenly feels alarmingly distinct in your hands, and you drop the remnants of the fruit.  Wonderingly, you touch yourself with a finger - you can feel even the lightest pressure on your " + player.skinFurScales() + " much more clearly now!");
			if (player.sens < 60) {
				EngineCore.dynStats("sen", 2);
			}
			EngineCore.dynStats("sen", 2);
			changes++;
		}
		//lose toughness to floor of 50
		if ( Utils.rand(4) && player.tou > 50 && changes < changeLimit) {
			MainView.outputText("\n\nYou find yourself wishing you could just sit around and eat all day, and spend a while lazing about and doing nothing before you can rouse yourself to get moving.");
			if (player.tou > 75) {
				EngineCore.dynStats("tou", -1);
			}
			EngineCore.dynStats("tou", -1);
			changes++;
		}

		//Sex stuff
		if (player.hasCock()) {
			//gain ball size
			if (player.balls > 0 && player.ballSize < 15 && Utils.rand(4) === 0 && changes < changeLimit) {
				MainView.outputText("\n\nYour [balls] inflate, stretching the skin of your sack.  Exposing them, you can see that they've grown several inches!  How magical!");
				changes++;
				player.ballSize += 2 + Utils.rand(3);
				EngineCore.dynStats("lib", 1);
			}
			//gain balls up to 2 (only if full-coon face and fur; no dick required)
			if (player.balls === 0 && player.skinType === AppearanceDefs.SKIN_TYPE_FUR && 9999 === 9999 && Utils.rand(3) === 0 && changes < changeLimit) {
				MainView.outputText("\n\nAs you eat, you contemplate your masked appearance; it strikes you that you're dangerously close to the classic caricature of a thief.  Really, all it would take is a big, nondescript sack and a hurried gait and everyone would immediately think the worst of you.  In a brief fit of pique, you wish you had such a bag to store your things in, eager to challenge a few assumptions.  A few minutes into that line of thought, a twisting ache in your lower gut bends you double, and you expose yourself hurriedly to examine the region.  As you watch, a balloon of flesh forms on your crotch, and two lumps migrate from below your navel down into it.  <b>Looks like you have a sack, after all.</b>");
				player.balls = 2;
				player.ballSize = 1;
				changes++;
			}
		}
		//gain thickness or lose tone or whatever - standard message
		if ( Utils.rand(4) === 0 && player.thickness < 80 && changes < changeLimit) {
			MainView.outputText(player.modThickness(80, 2), false);
			changes++;
		}
		//bodypart changes:
		if (player.tailType !== AppearanceDefs.TAIL_TYPE_RACCOON && Utils.rand(4) === 0 && changes < changeLimit) {
			//grow da tail
			//from no tail:
			if (player.tailType === AppearanceDefs.TAIL_TYPE_NONE) {
				MainView.outputText("\n\nPain shivers through your spine and forces you onto the ground; your body locks up despite your attempt to rise again.  You can feel a tug on your spine from your backside, as if someone is trying to pull it out!  Several nodules form along your back, growing into new vertebrae and pushing the old ones downward and into your [armor].  An uncomfortable pressure grows there, as whatever development is taking place fights to free itself from the constriction.  Finally the shifting stops, and you're able to move again; the first thing you do is loosen your bottoms, allowing a matted tail to slide out.  <b>It twitches involuntarily, fluffing out into a ringed raccoon tail!</b>");
			} else { //from other tail:
				MainView.outputText("\n\nYour tail goes rigid with pain, and soon your body follows.  It feels as though your spine is trying to push the growth off of your body... barely, you manage to turn your head to see almost exactly that!  A new ringed, fluffy tail is growing in behind its predecessor, dark bands after light.  Soon it reaches full length and a tear comes to your eye as your old tail parts from its end and drops to the ground like overripe fruit, dissolving.  <b>You now have a raccoon tail!</b>");
			}
			player.tailType = AppearanceDefs.TAIL_TYPE_RACCOON;
			changes++;
		}
		//gain fur
		if ((player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_RACCOON && player.earType === AppearanceDefs.EARS_RACCOON) && player.skinType !== AppearanceDefs.SKIN_TYPE_FUR && changes < changeLimit && Utils.rand(4) === 0) {
			MainView.outputText("\n\nYou shiver, feeling a bit cold.  Just as you begin to wish for something to cover up with, it seems your request is granted; thick, bushy fur begins to grow all over your body!  You tug at the tufts in alarm, but they're firmly rooted and... actually pretty soft.  Huh.  <b>You now have a warm coat of " + player.hairColor + " raccoon fur!</b>");
			player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
			player.skinAdj = "";
			player.skinDesc = "fur";
			changes++;
		}
		//gain coon ears
		if (player.tailType === AppearanceDefs.TAIL_TYPE_RACCOON && player.earType !== AppearanceDefs.EARS_RACCOON && Utils.rand(4) === 0 && changes < changeLimit) {
			//from dog, kangaroo, bunny, other long ears
			if (player.earType === AppearanceDefs.EARS_DOG || player.earType === AppearanceDefs.EARS_BUNNY || player.earType === AppearanceDefs.EARS_KANGAROO) {
				MainView.outputText("\n\nYour ears compress, constricting your ear canal momentarily.  You shake your head to get sound back, and reach up to touch the auricles, to find a pair of stubby egg-shaped ears in their place.  <b>You now have raccoon ears!</b>");
			} else if (player.earType === AppearanceDefs.EARS_HORSE || player.earType === AppearanceDefs.EARS_COW || player.earType === AppearanceDefs.EARS_CAT) { //from cat, horse, cow ears
				MainView.outputText("\n\nYour ears tingle.  Huh.  Do they feel a bit rounder at the tip now?  <b>Looks like you have raccoon ears.</b>");
			} else { //from human, goblin, lizard or other short ears
				MainView.outputText("\n\nYour ears prick and stretch uncomfortably, poking up through your " + Descriptors.hairDescript() + ".  Covering them with your hands, you feel them shaping into little eggdrop ornaments resting atop your head.  <b>You have raccoon ears!</b>");
			}
			player.earType = AppearanceDefs.EARS_RACCOON;
			changes++;
		}
		//gain feet-coon
		if (player.earType === AppearanceDefs.EARS_RACCOON && player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_RACCOON && changes < changeLimit && Utils.rand(4) === 0) {
			//from naga non-feet (gain fatigue and lose lust)
			if (player.isNaga()) {
				MainView.outputText("\n\nYour body straightens and telescopes suddenly and without the length of your snake half to anchor you, you're left with your face in the dirt.  A shuffling and scraping of falling scales sounds and a terrible cramp takes you as your back half continues migrating, subducting under your [butt] and making you feel extremely bloated.  As your once prominent tail dwindles to roughly the length of your torso, a sickly ripping noise fills your head and it bursts apart, revealing two new legs!  The tattered snake-skin continues melding into your groin as you examine the fuzzy legs and long-toed, sensitive feet.  <b>Looks like you now have raccoon hind-paws...</b> and an upset stomach.");
				EngineCore.dynStats("lus", -30);
				EngineCore.fatigue(5);
			} else if (player.isGoo()) { //from amoeba non-feet
				MainView.outputText("\n\nYour gooey undercarriage begins to boil violently, and before you can do anything, it evaporates!  Left sitting on just the small pad of sticky half-dried slime that comprises your [butt], a sudden bulge under you is enough to push you onto your back.  Wondering idly and unable to see what's happening, you close your eyes and try to focus on what sensations you can feel from your lower body.  You feel... a swell of expansion, followed by weak muscles trying to contract for the first time, pulling flimsy, folded limbs apart and laying them flat.  As your attention wanders downward, you feel toes wiggling - far longer toes than you remember.  For several minutes you lie still and test muscles gingerly as your body solidifes, but when you can finally move again and look at your legs properly, what you see surprises you very little.  <b>You have fuzzy legs and a pair of long-toed raccoon paws!</b>");
			} else if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HOOFED || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_BEE || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_PONY || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CHITINOUS_SPIDER_LEGS) { //from hooves or hard feet, including centaurs and bees
				MainView.outputText("\n\nYour [feet] feel very... wide, all of a sudden.  You clop around experimentally, finding them far less responsive and more cumbersome than usual.  On one step, one of your feet ");
				if (player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HOOFED || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_PONY) {
					MainView.outputText("pops right out of its hoof just in time");
				} else {
					MainView.outputText("comes loose inside its long boot, and you pull it free with irritation only");
				}
				MainView.outputText(" for you to set it back down on a sharp rock!  Biting off a curse, you examine the new bare foot.  It looks much like a human's, except for the nearly-twice-as-long toes.  You find you can even use them to pick things up; the sharp rock is dropped into your hand and tossed far away.  The shed [foot] is quickly joined on the ground by its complement, revealing more long toes.  ");
				if (player.isTaur()) {
					MainView.outputText("For a few minutes you amuse yourself with your four prehensile feet... you even make up a game that involves juggling a stone under your body by tossing it between two feet while balancing on the others.  It's only a short while, however, before your lower stomach grumbles and a searing pain makes you miss your catch.  Anticipating what will happen, you lie down carefully and close your eyes, biting down on a soft wad of cloth.  The pain quickly returns and drives you into unconsciousness, and when you awaken, your back legs are gone.  ");
				}
				MainView.outputText("<b>You now have two fuzzy, long-toed raccoon legs.</b>");
			} else { //from human, demon, paw feet
				MainView.outputText("\n\nYour toes wiggle of their own accord, drawing your attention.  Looking down, you can see them changing from their current shape, stretching into oblongs.  When they finish, your foot appears humanoid, but with long, prehesile toes!  ");
				if ((player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HUMAN || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_HIGH_HEELS || player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_CLAWS) && player.skinType !== AppearanceDefs.SKIN_TYPE_FUR) {
					MainView.outputText("The sensation of walking around on what feels like a second pair of hands is so weird that you miss noticing the itchy fur growing in over your legs...  ");
				}
				MainView.outputText("<b>You now have raccoon paws!</b>");
			}
			player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_RACCOON;
			changes++;
		}
		//gain half-coon face (prevented if already full-coon)
		if (player.faceType !== AppearanceDefs.FACE_RACCOON_MASK && player.faceType !== AppearanceDefs.FACE_RACCOON && Utils.rand(4) === 0 && changes < changeLimit) {
			//from human/naga/shark/bun face
			if (player.faceType === AppearanceDefs.FACE_HUMAN || player.faceType === AppearanceDefs.FACE_SHARK_TEETH || player.faceType === AppearanceDefs.FACE_SNAKE_FANGS || player.faceType === AppearanceDefs.FACE_BUNNY) {
				MainView.outputText("\n\nA sudden wave of exhaustion passes over you, and your face goes partially numb around your eyes.  ");
				//(nagasharkbunnies)
				if (player.faceType === AppearanceDefs.FACE_SHARK_TEETH || player.faceType === AppearanceDefs.FACE_SNAKE_FANGS || player.faceType === AppearanceDefs.FACE_BUNNY) {
					MainView.outputText("Your prominent teeth chatter noisily at first, then with diminishing violence, until you can no longer feel them jutting past the rest!  ");
				}
				MainView.outputText("Shaking your head a bit, you wait for your energy to return, then examine your appearance.  ");
				//(if player skinTone = ebony/black/ebony with tats and no fur/scales or if black/midnight fur or if black scales
				if (((player.skinTone === "ebony" || player.skinTone === "black") && (player.skinType === AppearanceDefs.SKIN_TYPE_PLAIN || player.skinType === AppearanceDefs.SKIN_TYPE_GOO)) || ((player.hairColor === "black" || player.hairColor === "midnight") && (player.skinType === AppearanceDefs.SKIN_TYPE_FUR || player.skinType === AppearanceDefs.SKIN_TYPE_SCALES))) {
					MainView.outputText("Nothing seems different at first.  Strange... you look closer and discover a darker, mask-line outline on your already inky visage.  <b>You now have a barely-visible raccoon mask.</b>");
				} else {
					MainView.outputText("A dark, almost black mask shades the " + player.skinFurScales() + " around your eyes and over the topmost portion of your nose, lending you a criminal air!  <b>You now have a raccoon mask!</b>");
				}
			} else { //from snout (will not overwrite full-coon snout but will overwrite others)
				MainView.outputText("\n\nA sudden migraine sweeps over you and you clutch your head in agony as your nose collapses back to human dimensions.  A worrying numb spot grows around your eyes, and you entertain several horrible premonitions until it passes as suddenly as it came.  Checking your reflection in your water barrel, you find ");
				//[(if black/midnight fur or if black scales)
				if (((player.hairColor === "black" || player.hairColor === "midnight") && (player.skinType === AppearanceDefs.SKIN_TYPE_FUR || player.skinType === AppearanceDefs.SKIN_TYPE_SCALES))) {
					MainView.outputText("your face apparently returned to normal shape, albeit still covered in " + player.skinFurScales() + ".  You look closer and discover a darker, mask-line outline on your already inky visage.  <b>You now have a barely-visible raccoon mask on your otherwise normal human face.</b>");
				} else if ((player.skinTone === "ebony" || player.skinTone === "black") && (player.skinType === AppearanceDefs.SKIN_TYPE_PLAIN || player.skinType === AppearanceDefs.SKIN_TYPE_GOO)) {
					MainView.outputText("your face apparently returned to normal shape.  You look closer and discover a darker, mask-line outline on your already inky visage.  <b>You now have a barely-visible raccoon mask on your normal human face.</b>");
				} else {
					MainView.outputText("your face returned to human dimensions, but shaded by a black mask around the eyes and over the nose!  <b>You now have a humanoid face with a raccoon mask!</b>");
				}
			}
			player.faceType = AppearanceDefs.FACE_RACCOON_MASK;
			changes++;
		} else if (player.faceType === AppearanceDefs.FACE_RACCOON_MASK && player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_RACCOON && player.skinType === AppearanceDefs.SKIN_TYPE_FUR && Utils.rand(4) === 0 && changes < changeLimit) { //gain full-coon face (requires half-coon and fur) //from humanoid - should be the only one possible
			MainView.outputText("\n\nYour face pinches with tension, and you rub the bridge of your nose to release it.  The action starts a miniature slide in your bone structure, and your nose extends out in front of you!  You shut your eyes, waiting for the sinus pressure to subside, and when you open them, a triangular, pointed snout dotted with whiskers and capped by a black nose greets you!  <b>You now have a raccoon's face!</b>");
			//from muzzleoid - should not be possible, but included if things change
			//Your face goes numb, and you can see your snout shifting into a medium-long, tapered shape.  Closing your eyes, you rub at your forehead to try and get sensation back into it; it takes several minutes before full feeling returns.  <b>When it does, you look again at yourself and see a raccoon's pointy face, appointed with numerous whiskers and a black nose!</b>
			changes++;
			player.faceType = AppearanceDefs.FACE_RACCOON;
		} else if ( Utils.rand(2) === 0 && changes < changeLimit && (player.faceType !== AppearanceDefs.FACE_RACCOON_MASK && player.faceType !== AppearanceDefs.FACE_RACCOON)) { //fatigue damage (only if face change was not triggered)
			MainView.outputText("\n\nYou suddenly feel tired and your eyelids are quite heavy.  Checking your reflection, you can see small dark rings have begun to form under your eyes.");
			EngineCore.fatigue(10);
			changes++;
		}
		if (changes === 0) {
			MainView.outputText("\n\nYawning, you figure you could really use a nap.");
			EngineCore.fatigue(5);
		}
	};
//special attack - bite?
//tooth length counter starts when you get teef, mouse bite gets more powerful over time as teeth grow in
//hit
//You sink your prominent incisors deep into your foe.  They're not as sharp as a predator's, but even a mouse bites when threatened, and you punch quite a large hole.
//miss
//You attempt to turn and bite your foe, but " + monster.pronoun1 + " pulls back deftly and your jaws close on empty air.
//perk - fuck if i know
//maybe some pregnancy-accelerating thing
	Mutations.demonChanges = function(player) {
		//Change tail if already horned.
		if (player.tailType !== AppearanceDefs.TAIL_TYPE_DEMONIC && player.horns > 0) {
			if (player.tailType !== AppearanceDefs.TAIL_TYPE_NONE) {
				MainView.outputText("\n\n", false);
				if (player.tailType === AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN || player.tailType === AppearanceDefs.TAIL_TYPE_BEE_ABDOMEN) {
					MainView.outputText("You feel a tingling in your insectile abdomen as it stretches, narrowing, the exoskeleton flaking off as it transforms into a flexible demon-tail, complete with a round spaded tip.  ", false);
				} else {
					MainView.outputText("You feel a tingling in your tail.  You are amazed to discover it has shifted into a flexible demon-tail, complete with a round spaded tip.  ", false);
				}
				MainView.outputText("<b>Your tail is now demonic in appearance.</b>", false);
			} else {
				MainView.outputText("\n\nA pain builds in your backside... growing more and more pronounced.  The pressure suddenly disappears with a loud ripping and tearing noise.  <b>You realize you now have a demon tail</b>... complete with a cute little spade.", false);
			}
			EngineCore.dynStats("cor", 4);
			player.tailType = AppearanceDefs.TAIL_TYPE_DEMONIC;
		}
		//grow horns!
		if (player.horns === 0 || ( Utils.rand(player.horns + 3) === 0)) {
			if (player.horns < 12 && (player.hornType === AppearanceDefs.HORNS_NONE || player.hornType === AppearanceDefs.HORNS_DEMON)) {
				MainView.outputText("\n\n", false);
				if (player.horns === 0) {
					MainView.outputText("A small pair of demon horns erupts from your forehead.  They actually look kind of cute.  <b>You have horns!</b>", false);
				} else {
					MainView.outputText("Another pair of demon horns, larger than the last, forms behind the first row.", false);
				}
				if (player.hornType === AppearanceDefs.HORNS_NONE) {
					player.hornType = AppearanceDefs.HORNS_DEMON;
				}
				player.horns++;
				player.horns++;
				EngineCore.dynStats("cor", 3);
			} else if (player.hornType > AppearanceDefs.HORNS_DEMON) { //Text for shifting horns
				MainView.outputText("\n\n", false);
				MainView.outputText("Your horns shift, shrinking into two small demonic-looking horns.", false);
				player.horns = 2;
				player.hornType = AppearanceDefs.HORNS_DEMON;
				EngineCore.dynStats("cor", 3);
			}
		}
		//Nipples Turn Back:
		if (player.findStatusAffect(StatusAffects.BlackNipples) >= 0 && Utils.rand(3) === 0) {
			MainView.outputText("\n\nSomething invisible brushes against your " + Descriptors.nippleDescript(0) + ", making you twitch.  Undoing your clothes, you take a look at your chest and find that your nipples have turned back to their natural flesh colour.");
			player.removeStatusAffect(StatusAffects.BlackNipples);
		}
		//remove fur
		if ((player.faceType !== AppearanceDefs.FACE_HUMAN || player.skinType !== AppearanceDefs.SKIN_TYPE_PLAIN) && Utils.rand(3) === 0) {
			//Remove face before fur!
			if (player.faceType !== AppearanceDefs.FACE_HUMAN) {
				MainView.outputText("\n\n", false);
				MainView.outputText("Your visage twists painfully, returning to a more normal human shape, albeit with flawless skin.  <b>Your face is human again!</b>", false);
				player.faceType = AppearanceDefs.FACE_HUMAN;
			} else if (player.skinType !== AppearanceDefs.SKIN_TYPE_PLAIN) { //De-fur
				MainView.outputText("\n\n", false);
				if (player.skinType === AppearanceDefs.SKIN_TYPE_FUR) {
					MainView.outputText("Your skin suddenly feels itchy as your fur begins falling out in clumps, <b>revealing inhumanly smooth skin</b> underneath.", false);
				} else if (player.skinType === AppearanceDefs.SKIN_TYPE_SCALES) {
					MainView.outputText("Your scales begin to itch as they begin falling out in droves, <b>revealing your inhumanly smooth " + player.skinTone + " skin</b> underneath.", false);
				}
				player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
				player.skinDesc = "skin";
			}
		}
		//Demon tongue
		if (player.tongueType === AppearanceDefs.TONUGE_SNAKE && Utils.rand(3) === 0) {
			MainView.outputText("\n\nYour snake-like tongue tingles, thickening in your mouth until it feels more like your old human tongue, at least for the first few inches.  It bunches up inside you, and when you open up your mouth to release it, roughly two feet of tongue dangles out.  You find it easy to move and control, as natural as walking.  <b>You now have a long demon-tongue.</b>", false);
			player.tongueType = AppearanceDefs.TONUGE_DEMONIC;
		}
		//foot changes - requires furless
		if (player.skinType === AppearanceDefs.SKIN_TYPE_PLAIN && Utils.rand(4) === 0) {
			//Males/genderless get clawed feet
			if (player.gender <= 1) {
				if (player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_CLAWS) {
					MainView.outputText("\n\n", false);
					MainView.outputText("Every muscle and sinew below your hip tingles and you begin to stagger. Seconds after you sit down, pain explodes in your " + player.feet() + ". Something hard breaks through your sole from the inside out as your toes splinter and curve cruelly. The pain slowly diminishes and your eyes look along a human leg that splinters at the foot into a claw with sharp black nails. When you relax, your feet grip the ground easily. <b>Your feet are now formed into demonic claws.</b>", false);
					player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_CLAWS;
				}
			} else if (player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_HIGH_HEELS) { //Females/futa get high heels
				MainView.outputText("\n\n", false);
				MainView.outputText("Every muscle and sinew below your hip tingles and you begin to stagger. Seconds after you sit down, pain explodes in your " + player.feet() + ". Something hard breaks through your sole from the inside out. The pain slowly diminishes and your eyes look along a human leg to a thin and sharp horn protruding from the heel. When you relax, your feet are pointing down and their old posture is only possible with an enormous effort. <b>Your feet are now formed into demonic high-heels.</b> Tentatively you stand up and try to take a few steps. To your surprise you feel as if you were born with this and stride vigorously forward, hips swaying.", false);
				player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_HIGH_HEELS;
			}
		}
		//Grow demon wings
		if (player.wingType !== AppearanceDefs.WING_TYPE_BAT_LIKE_LARGE && Utils.rand(8) === 0 && player.cor >= 50) {
			//grow smalls to large
			if (player.wingType === AppearanceDefs.WING_TYPE_BAT_LIKE_TINY && player.cor >= 75) {
				MainView.outputText("\n\n", false);
				MainView.outputText("Your small demonic wings stretch and grow, tingling with the pleasure of being attached to such a tainted body.  You stretch over your shoulder to stroke them as they unfurl, turning into full-sized demon-wings.  <b>Your demonic wings have grown!</b>", false);
				player.wingType = AppearanceDefs.WING_TYPE_BAT_LIKE_LARGE;
				player.wingDesc = "large, bat-like";
			} else if (player.wingType === AppearanceDefs.WING_TYPE_SHARK_FIN) {
				MainView.outputText("\n\n", false);
				MainView.outputText("The muscles around your shoulders bunch up uncomfortably, changing to support the new bat-like wings growing from your back.  You twist your head as far as you can for a look and realize your fin has changed into ", false);
				MainView.outputText("small ", false);
				player.wingType = AppearanceDefs.WING_TYPE_BAT_LIKE_TINY;
				player.wingDesc = "tiny, bat-like";
				MainView.outputText("bat-like demon-wings!", false);
			} else if (player.wingType === AppearanceDefs.WING_TYPE_BEE_LIKE_SMALL || player.wingType === AppearanceDefs.WING_TYPE_BEE_LIKE_LARGE) {
				MainView.outputText("\n\n", false);
				MainView.outputText("The muscles around your shoulders bunch up uncomfortably, changing to support your wings as you feel their weight increasing.  You twist your head as far as you can for a look and realize they've changed into ", false);
				if (player.wingType === AppearanceDefs.WING_TYPE_BEE_LIKE_SMALL) {
					MainView.outputText("small ", false);
					player.wingType = AppearanceDefs.WING_TYPE_BAT_LIKE_TINY;
					player.wingDesc = "tiny, bat-like";
				} else {
					MainView.outputText("large ", false);
					player.wingType = AppearanceDefs.WING_TYPE_BAT_LIKE_LARGE;
					player.wingDesc = "large, bat-like";
				}
				MainView.outputText("<b>bat-like demon-wings!</b>", false);
			} else if (player.wingType === AppearanceDefs.WING_TYPE_NONE) { //No wings
				MainView.outputText("\n\n", false);
				MainView.outputText("A knot of pain forms in your shoulders as they tense up.  With a surprising force, a pair of small demonic wings sprout from your back, ripping a pair of holes in the back of your " + player.armorName + ".  <b>You now have tiny demonic wings</b>.", false);
				player.wingType = AppearanceDefs.WING_TYPE_BAT_LIKE_TINY;
				player.wingDesc = "tiny, bat-like";
			}
		}
	};
	Mutations.herbalContraceptive = function(player) {
		MainView.clearOutput();
		// Placeholder, sue me
		MainView.outputText("You chew on the frankly awfully bitter leaves as quickly as possible before swallowing them down.");
		player.createStatusAffect(StatusAffects.Contraceptives, 1, 48, 0, 0);
	};
	Mutations.princessPucker = function(player) {
		MainView.clearOutput();
		MainView.outputText("You uncork the bottle, and sniff it experimentally.  The fluid is slightly pink, full of flecks of gold, and smelling vaguely of raspberries.  Princess Gwynn said it was drinkable.\n\n");
		MainView.outputText("You down the bottle, hiccuping a bit at the syrupy-sweet raspberry flavor.  Immediately following the sweet is a bite of sour, like sharp lime.  You pucker your lips, and feel your head clear a bit from the intensity of flavor.  You wonder what Gwynn makes this out of.\n\n");
		MainView.outputText("Echoing the sensation in your head is an answering tingle in your body.  The sudden shock of citrusy sour has left you slightly less inclined to fuck, a little more focused on your priorities.\n\n");
		if ( Utils.rand(2) === 0) {
			EngineCore.dynStats("lus-", 20, "lib-", 2);
		} else {
			EngineCore.dynStats("lus-", 20, "sen-", 2);
		}
		if (player.hairColor !== "pink") {
			if ( Utils.rand(5) === 0) {
				MainView.outputText("A slight tingle across your scalp draws your attention to your hair.  It seems your " + player.hairColor + " is rapidly gaining a distinctly pink hue, growing in from the roots!\n\n");
				player.hairColor = "pink";
			}
		}
	};
	//Ferret Fruit
	Mutations.ferretTF = function(player) {
		//CoC Ferret TF (Ferret Fruit)
		//Finding Ferret Fruit
		//- Ferret Fruit may be randomly found while exploring the plains.
		//- Upon finding Ferret Fruit: “While searching the plains, you find an odd little tree with a curved trunk. The shape of its fruit appears to mimic that of the tree. A few of the fruits seem to have fallen off. You brush the dirt off of one of the fruits before placing in in your (x) pouch. (if there is no room in your inventory, you get the generic option to use now or abandon)
		//- If you hover over the fruit in your inventory, this is its description:  “This fruit is curved oddly, just like the tree it came from.  The skin is fuzzy and brown, like the skin of a peach.”
		//-Upon eating the fruit:
		MainView.clearOutput();
		MainView.outputText("Feeling parched, you gobble down the fruit without much hesitation. Despite the skin being fuzzy like a peach, the inside is relatively hard, and its taste reminds you of that of an apple.  It even has a core like an apple. Finished, you toss the core aside.");
		//BAD END:
		if(player.ferretScore() >= 6) {
			//Get warned!
			if(CoC.flags[kFLAGS.FERRET_BAD_END_WARNING] === 0) {
				MainView.outputText("\n\nYou find yourself staring off into the distance, dreaming idly of chasing rabbits through a warren.  You shake your head, returning to reality.  <b>Perhaps you should cut back on all the Ferret Fruit?</b>");
				player.inte -= 5 + Utils.rand(3);
				if(player.inte < 5) {
					player.inte = 5;
				}
				CoC.flags[kFLAGS.FERRET_BAD_END_WARNING] = 1;
			} else if( Utils.rand(3) === 0) { //BEEN WARNED! BAD END! DUN DUN DUN
				//-If you fail to heed the warning, it’s game over:
				MainView.outputText("\n\nAs you down the fruit, you begin to feel all warm and fuzzy inside.  You flop over on your back, eagerly removing your clothes.  You laugh giddily, wanting nothing more than to roll about happily in the grass.  Finally finished, you attempt to get up, but something feels...  different.  Try as you may, you find yourself completely unable to stand upright for a long period of time.  You only manage to move about comfortably on all fours.  Your body now resembles that of a regular ferret.  That can’t be good!  As you attempt to comprehend your situation, you find yourself less and less able to focus on the problem.  Your attention eventually drifts to a rabbit in the distance.  You lick your lips. Nevermind that, you have warrens to raid!");
				EngineCore.gameOver();
				return;
			}
		} else { //Reset the warning if ferret score drops.
			CoC.flags[kFLAGS.FERRET_BAD_END_WARNING] = 0;
		}
		var changes = 0;
		var changeLimit = 1;
		if( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if( Utils.rand(2) === 0) {
			changeLimit++;
		}
		if( Utils.rand(3) === 0) {
			changeLimit++;
		}
		//Ferret Fruit Effects
		//- + Thin:
		if(player.thickness > 15 && changes < changeLimit && Utils.rand(3) === 0) {
			MainView.outputText("\n\nEach movement feels a tiny bit easier than the last.  Did you just lose a little weight!? (+2 thin)");
			player.thickness -=2;
			changes++;
		}
		//- If speed is > 80, increase speed:
		if (player.spe < 80 && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYour muscles begin to twitch rapidly, but the feeling is not entirely unpleasant.  In fact, you feel like running.");
			EngineCore.dynStats("spe",1);
			changes++;
		}
		//- If male with a hip rating >4 or a female/herm with a hip rating >6:
		if(((!player.hasCock() && player.hipRating > 6) || (player.hasCock() && player.hipRating > 4)) && Utils.rand(3) === 0 && changes< changeLimit) {
			MainView.outputText("\n\nA warm, tingling sensation arises in your [hips].  Immediately, you reach down to them, concerned.  You can feel a small portion of your [hips] dwindling away under your hands.");
			player.hipRating--;
			if(player.hipRating > 10) {
				player.hipRating--;
			}
			if(player.hipRating > 15) {
				player.hipRating--;
			}
			if(player.hipRating > 20) {
				player.hipRating--;
			}
			if(player.hipRating > 23) {
				player.hipRating--;
			}
			changes++;
		}
		//- If butt rating is greater than “petite”:
		if(player.buttRating >= 8 && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou cringe as your [butt] begins to feel uncomfortably tight.  Once the sensation passes, you look over your shoulder, inspecting yourself.  It would appear that your ass has become smaller!");
			player.buttRating--;
			if(player.buttRating > 10) {
				player.buttRating--;
			}
			if(player.buttRating > 15) {
				player.buttRating--;
			}
			if(player.buttRating > 20) {
				player.buttRating--;
			}
			if(player.buttRating > 23) {
				player.buttRating--;
			}
			changes++;
		}
		//-If male with breasts or female/herm with breasts > B cup:
		if(!CoC.flags[kFLAGS.HYPER_HAPPY] && (player.biggestTitSize() > 2 || (player.hasCock() && player.biggestTitSize() >= 1)) && Utils.rand(2) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou cup your tits as they begin to tingle strangely.  You can actually feel them getting smaller in your hands!");
			_.forEach(player.breastRows, function(breastRow) {
				if(breastRow.breastRating > 2 || (player.hasCock() && breastRow.breastRating >= 1)) {
					breastRow.breastRating--;
				}
			});
			changes++;
			//(this will occur incrementally until they become flat, manly breasts for males, or until they are A or B cups for females/herms)
		}
		//-If penis size is > 6 inches:
		if(player.hasCock()) {
			//Find longest cock
			var longestCock = player.longestCock();
			if(longestCock >= 0 && Utils.rand(2) === 0 && changes < changeLimit) {
				if(player.cocks[longestCock].cockLength > 6 && !CoC.flags[kFLAGS.HYPER_HAPPY]) {
					MainView.outputText("\n\nA pinching sensation racks the entire length of your " + Descriptors.cockDescript(longestCock) + ".  Within moments, the sensation is gone, but it appears to have become smaller.");
					player.cocks[longestCock].cockLength--;
					if( Utils.rand(2) === 0) {
						player.cocks[longestCock].cockLength--;
					}
					if(player.cocks[longestCock].cockLength >= 9) {
						player.cocks[longestCock].cockLength -= Utils.rand(3) + 1;
					}
					if(player.cocks[longestCock].cockLength/6 >= player.cocks[longestCock].cockThickness) {
						MainView.outputText("  Luckily, it doen’t seem to have lost its previous thickness.");
					} else {
						player.cocks[longestCock].cockThickness = player.cocks[longestCock].cockLength/6;
					}
					changes++;
				}
			}
		}
		//-If the PC has quad nipples:
		if(player.averageNipplesPerBreast() > 1 && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nA tightness arises in your nipples as three out of four on each breast recede completely, the leftover nipples migrating to the middle of your breasts.  <b>You are left with only one nipple on each breast.</b>");
			_.forEach(player.breastRows, function(breastRow) { breastRow.nipplesPerBreast = 1; });
			changes++;
		}
		//If the PC has gills:
		if(player.gills && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou grit your teeth as a stinging sensation arises in your gills.  Within moments, the sensation passes, and <b>your gills are gone!</b>");
			player.gills = false;
			changes++;
		}
		//If the PC has tentacle hair:
		if(player.hairType === AppearanceDefs.HAIR_ANEMONE && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYour head feels strange as the tentacles you have for hair begin to recede back into your scalp, eventually leaving you with a bald head.  Your head is not left bald for long, though.  Within moments, a full head of hair sprouts from the skin of your scalp.  <b>Your hair is normal again!</b>");
			//Turn hair growth on.
			CoC.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] = 0;
			player.hairType = 0;
			changes++;
		}
		//If the PC has goo hair:
		if(player.hairType === AppearanceDefs.HAIR_GOO && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYour gooey hair begins to fall out in globs, eventually leaving you with a bald head.  Your head is not left bald for long, though.  Within moments, a full head of hair sprouts from the skin of your scalp.  <b>Your hair is normal again!</b>");
			//Turn hair growth on.
			CoC.flags[kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD] = 0;
			player.hairType = 0;
			changes++;
		}
		//If the PC has four eyes:
		if(player.eyeType === AppearanceDefs.EYES_FOUR_SPIDER_EYES && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYour two forehead eyes start throbbing painfully, your sight in them eventually going dark.  You touch your forehead to inspect your eyes, only to find out that they have disappeared.  <b>You only have two eyes now!</b>");
			player.eyeType = 0;
			changes++;
		}
		//Go into heat
		if ( Utils.rand(3) === 0 && changes < changeLimit && player.goIntoHeat(true)) {
			changes++;
		}
		//Turn ferret mask to full furface.
		if(player.faceType === AppearanceDefs.FACE_FERRET_MASK && player.skinType === AppearanceDefs.SKIN_TYPE_FUR && player.earType === AppearanceDefs.EARS_FERRET && player.tailType === AppearanceDefs.TAIL_TYPE_FERRET && player.lowerBody === AppearanceDefs.LOWER_BODY_FERRET && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou cry out in pain as the bones in your face begin to break and rearrange.  You rub your face furiously in an attempt to ease the pain, but to no avail.  As the sensations pass, you examine your face in a nearby puddle.  <b>You nearly gasp in shock at the sight of your new ferret face!</b>");
			player.faceType = AppearanceDefs.FACE_FERRET;
			changes++;
		}
		//If face is human:
		if(player.faceType === 0 && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nA horrible itching begins to encompass the area around your eyes.  You grunt annoyedly, rubbing furiously at the afflicted area.  Once the feeling passes, you make your way to the nearest reflective surface to see if anything has changed.  Your suspicions are confirmed.  The [skinFurScales] around your eyes has darkened.  <b>You now have a ferret mask!</b>");
			player.faceType = AppearanceDefs.FACE_FERRET_MASK;
			changes++;
		}
		//If face is not ferret, has ferret ears, tail, and legs:
		if(player.faceType !== AppearanceDefs.FACE_HUMAN && player.faceType !== AppearanceDefs.FACE_FERRET_MASK && player.faceType !== AppearanceDefs.FACE_FERRET && Utils.rand(3) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou groan uncomfortably as the bones in your [face] begin to rearrange.  You grab your head with both hands, rubbing at your temples in an attempt to ease the pain.  As the shifting stops, you frantically feel at your face.  The familiar feeling is unmistakable.  <b>Your face is human again!</b>");
			player.faceType = 0;
			changes++;
		}
		//No fur, has ferret ears, tail, and legs:
		if(player.skinType !== AppearanceDefs.SKIN_TYPE_FUR && player.earType === AppearanceDefs.EARS_FERRET && player.tailType === AppearanceDefs.TAIL_TYPE_FERRET && player.lowerBody === AppearanceDefs.LOWER_BODY_FERRET && Utils.rand(4) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYour skin starts to itch like crazy as a thick coat of fur sprouts out of your skin.");
			//If hair was not sandy brown, silver, white, or brown
			if(player.hairColor !== "sandy brown" && player.hairColor !== "silver" && player.hairColor !== "white" && player.hairColor !== "brown") {
				MainView.outputText("\n\nOdder still, all of your hair changes to ");
				if( Utils.rand(4) === 0) {
					player.hairColor = "sandy brown";
				} else if( Utils.rand(3) === 0) {
					player.hairColor = "silver";
				} else if( Utils.rand(2) === 0) {
					player.hairColor = "white";
				} else {
					player.hairColor = "brown";
				}
				MainView.outputText(".");
			}
			MainView.outputText("  <b>You now have " + player.hairColor + " fur!</b>");
			player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
			changes++;
		}
		//Tail TFs!
		if(player.tailType !== AppearanceDefs.TAIL_TYPE_FERRET && player.earType === AppearanceDefs.EARS_FERRET && Utils.rand(3) === 0 && changes < changeLimit) {
			//If ears are ferret, no tail:
			if(player.tailType === 0) {
				MainView.outputText("\n\nYou slump to the ground as you feel your spine lengthening and twisting, sprouting fur as it finishes growing.  Luckily the new growth does not seem to have ruined your [armor].  <b>You now have a ferret tail!</b>");
			} else if(player.tailType === AppearanceDefs.TAIL_TYPE_HORSE && player.isTaur()) { //Placeholder for any future TFs that will need to be made compatible with this one //centaur, has ferret ears:
				MainView.outputText("\n\nYou shiver as the wind gets to your tail, all of its shiny bristles having fallen out.  Your tail then begins to lengthen, warming back up as it sprouts a new, shaggier coat of fur.  This new, mismatched tail looks a bit odd on your horse lower body.  <b>You now have a ferret tail!</b>");
			} else if(player.tailType === AppearanceDefs.TAIL_TYPE_HARPY) { //If tail is harpy, has ferret ears:
				MainView.outputText("\n\nYou feel a soft tingle as your tail feathers fall out one by one.  The little stump that once held the feathers down begins to twist and lengthen before sprouting soft, fluffy fur.  <b>You now have a ferret tail!</b>");
			} else if(player.tailType === AppearanceDefs.TAIL_TYPE_RABBIT) { //If tail is bunny, has ferret ears:
				MainView.outputText("\n\nYou feel a pressure at the base of your tiny, poofy bunny tail as it begins to lengthen, gaining at least another foot in length.  <b>You now have a ferret tail!</b>");
			} else if(player.tailType === AppearanceDefs.TAIL_TYPE_DRACONIC || player.tailType === AppearanceDefs.TAIL_TYPE_LIZARD) { //If tail is reptilian/draconic, has ferret ears:
				MainView.outputText("\n\nYou reach a hand behind yourself to rub at your backside as your tail begins to twist and warp, becoming much thinner than before.  It then sprouts a thick coat of fur.  <b>You now have a ferret tail!</b>");
			} else if(player.tailType === AppearanceDefs.TAIL_TYPE_COW) { //If tail is cow, has ferret ears:
				MainView.outputText("\n\nYour tail begins to itch slightly as the poof at the end of your tail begins to spread across its entire surface, making all of its fur much more dense than it was before. It also loses a tiny bit of its former length. <b>You now have a ferret tail!</b>");
			} else if(player.tailType === AppearanceDefs.TAIL_TYPE_CAT) { //If tail is cat, has ferret ears:
				MainView.outputText("\n\nYour tail begins to itch as its fur becomes much denser than it was before.  It also loses a tiny bit of its former length.  <b>You now have a ferret tail!</b>");
			} else if(player.tailType === AppearanceDefs.TAIL_TYPE_DOG) { //If tail is dog, has ferret ears:
				MainView.outputText("\n\nSomething about your tail feels... different.  You reach behind yourself, feeling it.  It feels a bit floppier than it was before, and the fur seems to have become a little more dense.  <b>You now have a ferret tail!</b>");
			} else if(player.tailType === AppearanceDefs.TAIL_TYPE_KANGAROO) { //If tail is kangaroo, has ferret ears:
				MainView.outputText("\n\nYour tail becomes uncomfortably tight as the entirety of its length begins to lose a lot of its former thickness.  The general shape remains tapered, but its fur has become much more dense and shaggy.  <b>You now have a ferret tail!</b>");
			} else if(player.tailType === AppearanceDefs.TAIL_TYPE_FOX) { //If tail is fox, has ferret ears:
				MainView.outputText("\n\nYour tail begins to itch as its fur loses a lot of its former density.  It also appears to have lost a bit of length.  <b>You now have a ferret tail!</b>");
			} else if(player.tailType === AppearanceDefs.TAIL_TYPE_RACCOON) { //If tail is raccoon, has ferret ears:
				MainView.outputText("\n\nYour tail begins to itch as its fur loses a lot of its former density, losing its trademark ring pattern as well.  It also appears to have lost a bit of length.  <b>You now have a ferret tail!</b>");
			} else if(player.tailType === AppearanceDefs.TAIL_TYPE_HORSE) { //If tail is horse, has ferret ears:
				MainView.outputText("\n\nYou shiver as the wind gets to your tail, all of its shiny bristles having fallen out.  Your tail then begins to lengthen, warming back up as it sprouts a new, shaggier coat of fur.  <b>You now have a ferret tail!</b>");
			} else if(player.tailType === AppearanceDefs.TAIL_TYPE_MOUSE) { //If tail is mouse, has ferret ears:
				MainView.outputText("\n\nYour tail begins to itch as its bald surface begins to sprout a thick layer of fur.  It also appears to have lost a bit of its former length.  <b>You now have a ferret tail!</b>");
			} else {
				MainView.outputText("\n\nYour tail begins to itch a moment before it starts writhing, your back muscles spasming as it changes shape. Before you know it, <b>your tail has reformed into a narrow, ferret's tail.</b>");
			}
			player.tailType = AppearanceDefs.TAIL_TYPE_FERRET;
			changes++;
		} else if(player.isNaga() && player.earType === AppearanceDefs.EARS_FERRET && Utils.rand(4) === 0 && changes < changeLimit) { //If naga, has ferret ears: //(NOTE: this is the only exception to the legs coming after the tail, as the ferret tail will only go away right after it appears because of your snake lower half)
			MainView.outputText("\n\nYou scream in agony as a horrible pain racks the entire length of your snake-like coils.  Unable to take it anymore, you pass out.  When you wake up, you’re shocked to find that you no longer have the lower body of a snake.  Instead, you have soft, furry legs that resemble that of a ferret’s.  <b>You now have ferret legs!</b>");
			changes++;
			player.lowerBody = AppearanceDefs.LOWER_BODY_FERRET;
		}
		//If legs are not ferret, has ferret ears and tail
		if(player.lowerBody !== AppearanceDefs.LOWER_BODY_FERRET && player.earType === AppearanceDefs.EARS_FERRET && player.tailType === AppearanceDefs.TAIL_TYPE_FERRET && Utils.rand(4) === 0 && changes < changeLimit) {
			//-If centaur, has ferret ears and tail:
			if(player.isTaur()) {
				MainView.outputText("\n\nYou scream in agony as a horrible pain racks your entire horse lower half.  Unable to take it anymore, you pass out.  When you wake up, you’re shocked to find that you no longer have the lower body of a horse.  Instead, you have soft, furry legs that resemble that of a ferret’s.  <b>You now have ferret legs!</b>");
			}
			MainView.outputText("\n\nYou scream in agony as the bones in your legs begin to break and rearrange.  Even as the pain passes, an uncomfortable combination of heat and throbbing continues even after the transformation is over.  You rest for a moment, allowing the sensations to subside.  Now feeling more comfortable, <b>you stand up, ready to try out your new ferret legs!</b>");
			changes++;
			player.lowerBody = AppearanceDefs.LOWER_BODY_FERRET;
		}
		//If ears are not ferret:
		if(player.earType !== AppearanceDefs.EARS_FERRET && Utils.rand(4) === 0 && changes < changeLimit && Utils.rand(2.5) === 0 && changes < changeLimit) {
			MainView.outputText("\n\nYou squint as you feel a change in your ears.  Inspecting your reflection in a nearby puddle you find that <b>your ears have become small, fuzzy, and rounded, just like a ferret’s!</b>");
			player.earType = AppearanceDefs.EARS_FERRET;
			changes++;
		}
		//If no other effect occurred, fatigue decreases:
		if(changes === 0) {
			MainView.outputText("\n\nYour eyes widen.  With the consumption of the fruit, you feel much more energetic.  You’re wide awake now!");
			changes++;
			EngineCore.fatigue(-10);
		}
	};
	return Mutations;
});
