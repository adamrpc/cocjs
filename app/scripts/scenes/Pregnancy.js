﻿'use strict';

angular.module( 'cocjs' ).run( function( MainView, SceneLib, Mutations, StatusAffects, PregnancyStore, Descriptors, Utils, CockTypesEnum, CoC_Settings, PerkLib, AppearanceDefs, kFLAGS, CoC, EngineCore ) {
	function Pregnancy() {
	}

	//17 === EMBER;
	//18 === PROPER BASILISKS (BENOIT ONLY);
	//19 === SATYR;
	//20 === COTTON;
	//21 === URTA;
	//22 === SAND WITCH;
	//23 === FROG BUTT EGG;
	Pregnancy.prototype.updatePregnancy = function() {
		var displayedUpdate = false;
		var pregText = '';
		if( (CoC.player.pregnancyIncubation <= 0 && CoC.player.buttPregnancyIncubation <= 0) ||
			(CoC.player.pregnancyType === 0 && CoC.player.buttPregnancyType === 0) ) {
			return false;
		}
		//Cancel Heat;
		if( CoC.player.inHeat ) {
			EngineCore.outputText( '\nYou calm down a bit and realize you no longer fantasize about getting fucked constantly.  It seems your heat has ended.\n', false );
			//Remove bonus libido from heat;
			EngineCore.dynStats( 'lib', -CoC.player.statusAffectv2( StatusAffects.Heat ) );
			if( CoC.player.lib < 10 ) {
				CoC.player.lib = 10;
			}
			MainView.statsView.show();
			CoC.player.removeStatusAffect( StatusAffects.Heat );
			displayedUpdate = true;
		}
		if( CoC.player.pregnancyIncubation === 1 ) {
			if( CoC.player.fertility < 15 ) {
				CoC.player.fertility++;
			}
			if( CoC.player.fertility < 25 ) {
				CoC.player.fertility++;
			}
			if( CoC.player.fertility < 40 ) {
				CoC.player.fertility++;
			}
			if( CoC.player.findStatusAffect( StatusAffects.Birthed ) < 0 ) {
				CoC.player.createStatusAffect( StatusAffects.Birthed, 1, 0, 0, 0 );
			} else {
				CoC.player.addStatusValue( StatusAffects.Birthed, 1, 1 );
				if( CoC.player.findPerk( PerkLib.BroodMother ) < 0 && CoC.player.statusAffectv1( StatusAffects.Birthed ) >= 10 ) {
					EngineCore.outputText( '\n<b>You have gained the Brood Mother perk</b> (Pregnancies progress twice as fast as a normal woman\'s).\n', false );
					CoC.player.createPerk( PerkLib.BroodMother, 0, 0, 0, 0 );
				}
			}
		}
		if( CoC.player.pregnancyIncubation > 0 && CoC.player.pregnancyIncubation < 2 ) {
			CoC.player.knockUpForce( CoC.player.pregnancyType, 1 );
		}
		//IF INCUBATION IS VAGINAL;
		if( CoC.player.pregnancyIncubation > 1 ) {
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_FAERIE ) {
				displayedUpdate = SceneLib.phoukaScene.phoukaPregUpdate();
			}
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_SAND_WITCH ) {
				displayedUpdate = SceneLib.dungeonSandWitch.sandPregUpdate();
			}
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_URTA ) {
				displayedUpdate = SceneLib.urtaPregs.urtaPregooUpdates();
			}
			//Cotton Pregnancy! - 350 days long;
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_COTTON ) {
				if( CoC.player.pregnancyIncubation === 320 ) {
					EngineCore.outputText( '\n<b>You realize your belly has gotten bigger. Maybe you should cut back on all the strange food.  Though you do have odd cravings for oats and grain.</b>\n', false );
					displayedUpdate = true;
				} else if( CoC.player.pregnancyIncubation === 280 ) {
					EngineCore.outputText( '\n<b>Your belly is getting more noticeably distended. You are probably pregnant. The strong hankerings for oats and grains give you a very obvious clue as to who the \'father\' might be.</b>\n', false );
					displayedUpdate = true;
				} else if( CoC.player.pregnancyIncubation === 225 ) {
					EngineCore.outputText( '\n<b>The unmistakable bulge of pregnancy is visible in your tummy.  You stroke the orb and wonder with a half-grin if you\'ll have a daughter who takes after her \'daddy\'.</b>\n' );
					displayedUpdate = true;
				} else if( CoC.player.pregnancyIncubation === 165 ) {
					EngineCore.outputText( '\n<b>The sudden impact of a tiny kick from inside your womb startles you.  Moments later it happens again, making you gasp.  The baby inside you really must be equine in nature; she\'s already got quite a wicked kick on her.</b>\n' );
					displayedUpdate = true;
				} else if( CoC.player.pregnancyIncubation === 105 ) {
					EngineCore.outputText( '\n<b>You\'re already as big as any pregnant woman back home. Considering that what you\'re carrying is technically a foal, you wonder just how much bigger you\'re going to get...</b>\n' );
					displayedUpdate = true;
				} else if( CoC.player.pregnancyIncubation === 80 ) {
					EngineCore.outputText( '\n<b>Your swollen stomach would bring queries about the possibility of twins back in Ingnam.  However, you can only feel one strong heart beating away inside your stretched midriff.  Cotton\'s foal is definitely growing up healthy...\n\nYou\'re glad, but a little worried about giving birth.</b>\n' );
					displayedUpdate = true;
				} else if( CoC.player.pregnancyIncubation === 50 ) {
					EngineCore.outputText( '\n<b>Your belly is painfully distended and swollen; you feel like you\'re going to burst before you get much bigger.  You find yourself pacing around restlessly in the night, like the expectant mares back in the village.  You\'re anxious to finally give birth, as much to get this heavy baby out of you as to finally be able to cuddle your child.</b>\n' );
					displayedUpdate = true;
				}
				//Tits;
				if( CoC.player.pregnancyIncubation === 32 || CoC.player.pregnancyIncubation === 64 || CoC.player.pregnancyIncubation === 85 || CoC.player.pregnancyIncubation === 150 ) {
					displayedUpdate = true;
					//Increase lactation!;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() >= 1 && CoC.player.biggestLactation() < 2 ) {
						EngineCore.outputText( '\nYour breasts feel swollen with all the extra milk they\'re accumulating.  You wonder just what kind of creature they\'re getting ready to feed.\n', false );
						CoC.player.boostLactation( 0.5 );
					}
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() > 0 && CoC.player.biggestLactation() < 1 ) {
						EngineCore.outputText( '\nDrops of breastmilk escape your nipples as your body prepares for the coming birth.\n', false );
						CoC.player.boostLactation( 0.5 );
					}
					//Lactate if large && not lactating;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() === 0 ) {
						EngineCore.outputText( '\n<b>You realize your breasts feel full, and occasionally lactate</b>.  It must be due to the pregnancy.\n', false );
						CoC.player.boostLactation( 1 );
					}
					//Enlarge if too small for lactation;
					if( CoC.player.biggestTitSize() === 2 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have swollen to C-cups,</b> in light of your coming pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
					}
					//Enlarge if really small!;
					if( CoC.player.biggestTitSize() === 1 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have grown to B-cups,</b> likely due to the hormonal changes of your pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
					}
				}
			}
			//Imp Pregnancy!;
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_IMP ) {
				if( CoC.player.pregnancyIncubation === 336 ) {
					EngineCore.outputText( '\n<b>You realize your belly has gotten slightly larger.  Maybe you need to cut back on the strange food.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 280 ) {
					EngineCore.outputText( '\n<b>Your belly is getting more noticably distended.   You are probably pregnant.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 216 ) {
					EngineCore.outputText( '\n<b>The unmistakable bulge of pregnancy is visible in your tummy.  ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'You are distressed by your unwanted pregnancy, and your inability to force this thing out of you.</b>', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'Considering the size of the creatures you\'ve fucked, you hope it doesn\'t hurt when it comes out.</b>', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'You think dreamily about the monstrous cocks that have recently been fucking you, and hope that your offspring inherit such a pleasure tool.</b>', false );
					}
					EngineCore.dynStats( 'spe', -1, 'lib', 1, 'sen', 1, 'lus', 2 );
					EngineCore.outputText( '\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 180 ) {
					EngineCore.outputText( '\n<b>The sudden impact of a kick from inside your womb startles you.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 120 ) {
					EngineCore.outputText( '\n<b>Your ever-growing belly makes your pregnancy obvious for those around you.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 72 ) {
					EngineCore.outputText( '\n<b>Your belly is painfully distended, ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'making it difficult to function.</b>', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'and you wonder how much longer you have to wait.</b>', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'and you\'re eager to give birth, so you can get impregnated again by corrupted or monstrous cum filling out your eager womb.</b>', false );
					}
					EngineCore.outputText( '\n', false );
					EngineCore.dynStats( 'spe', -3, 'lib', 1, 'sen', 1, 'lus', 4 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 48 ) {
					EngineCore.outputText( '\n<b>You rub your hands over your bulging belly, lost in the sensations of motherhood.  ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'Afterwards you feel somewhat disgusted with yourself.</b>\n', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'You estimate you\'ll give birth in the next few days.</b>\n', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'You find yourself daydreaming about birthing demons repeatedly, each time being re-impregnated by your hordes of lusty adolescent children.</b>\n', false );
					}
					displayedUpdate = true;
				}
			}
			//Minotaur Pregnancy!;
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_MINOTAUR ) {
				if( CoC.player.pregnancyIncubation === 336 ) {
					EngineCore.outputText( '\n<b>You realize your belly has gotten slightly larger.  Maybe you need to cut back on the strange food.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 280 ) {
					EngineCore.outputText( '\n<b>Your belly is getting more noticably distended and squirming around.  You are probably pregnant.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 216 ) {
					EngineCore.outputText( '\n<b>The unmistakable bulge of pregnancy is visible in your tummy.  It\'s feeling heavier by the moment.  ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'You are distressed by your unwanted pregnancy, and your inability to force this thing out of you.</b>', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'Considering the size of the creatures you\'ve fucked, you hope it doesn\'t hurt when it comes out.</b>', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'You think dreamily about the monstrous cocks that have recently been fucking you, and hope that your offspring inherit such a pleasure tool.</b>', false );
					}
					EngineCore.dynStats( 'spe', -1, 'lib', 1, 'sen', 1, 'lus', 2 );
					EngineCore.outputText( '\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 180 ) {
					EngineCore.outputText( '\n<b>The sudden impact of a kick from inside your distended womb startles you.  Moments later it happens again, making you gasp and stagger.  Whatever is growing inside you is strong.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 120 ) {
					EngineCore.outputText( '\n<b>Your ever-growing belly makes your pregnancy obvious for those around you.  It\'s already as big as the belly of any pregnant woman back home.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 72 ) {
					EngineCore.outputText( '\n<b>Your belly is painfully distended and overswollen with the offspring of some huge beast, ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'making it difficult to function.</b>', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'and you wonder how much longer you have to wait.</b>', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'and you\'re eager to give birth, so you can get impregnated again by monstrous cocks unloading their corrupted seed directly into your eager womb.</b>', false );
					}
					EngineCore.outputText( '\n', false );
					EngineCore.dynStats( 'spe', -3, 'lib', 1, 'sen', 1, 'lus', 4 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 48 ) {
					displayedUpdate = true;
					EngineCore.outputText( '\n<b>You rub your hands over your bulging belly, lost in the sensations of motherhood.  Whatever beast is inside your overstretched womb seems to appreciate the attention, and stops its incessant squirming.  ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'Afterwards you feel somewhat disgusted with yourself.</b>\n', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'You estimate you\'ll give birth in the next few days.</b>\n', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'You find yourself daydreaming about birthing some huge monstrous beast, and raising it to fuck your wet pussy over and over.</b>\n', false );
					}
				}
				if( CoC.player.pregnancyIncubation === 32 || CoC.player.pregnancyIncubation === 64 || CoC.player.pregnancyIncubation === 85 || CoC.player.pregnancyIncubation === 150 ) {
					displayedUpdate = true;
					//Increase lactation!;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() >= 1 && CoC.player.biggestLactation() < 2 ) {
						EngineCore.outputText( '\nYour breasts feel swollen with all the extra milk they\'re accumulating.  You wonder just what kind of creature they\'re getting ready to feed.\n', false );
						CoC.player.boostLactation( 0.5 );
					}
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() > 0 && CoC.player.biggestLactation() < 1 ) {
						EngineCore.outputText( '\nDrops of breastmilk escape your nipples as your body prepares for the coming birth.\n', false );
						CoC.player.boostLactation( 0.5 );
					}
					//Lactate if large && not lactating;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() === 0 ) {
						EngineCore.outputText( '\n<b>You realize your breasts feel full, and occasionally lactate</b>.  It must be due to the pregnancy.\n', false );
						CoC.player.boostLactation( 1 );
					}
					//Enlarge if too small for lactation;
					if( CoC.player.biggestTitSize() === 2 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have swollen to C-cups,</b> in light of your coming pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
					}
					//Enlarge if really small!;
					if( CoC.player.biggestTitSize() === 1 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have grown to B-cups,</b> likely due to the hormonal changes of your pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
					}
				}
			}
			//Centaur Pregnancy!;
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_CENTAUR || CoC.player.pregnancyType === PregnancyStore.PREGNANCY_KELT ) {
				if( CoC.player.pregnancyIncubation === 350 ) {
					EngineCore.outputText( '\n<b>You realize your belly has gotten bigger. Maybe you should cut back on all the strange food.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 280 ) {
					EngineCore.outputText( '\n<b>Your belly is getting more noticeably distended. You are probably pregnant.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 216 ) {
					EngineCore.outputText( '\n<b>The unmistakable bulge of pregnancy is visible in your tummy.  Somehow, you don\'t feel worried. Only content.</b>\n', false );
					EngineCore.dynStats( 'spe', -1, 'lib', 1, 'sen', 1, 'lus', 2 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 180 ) {
					EngineCore.outputText( '\n<b>The pregnancy is moving much faster than you expected. It\'s already as big as the belly of any pregnant woman back home.  However, a feeling of warm satisfaction fills you.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 120 ) {
					EngineCore.outputText( '\n<b>Your belly is painfully distended and overswollen with the offspring of some huge beast, making it difficult to function.</b>\n', false );
					EngineCore.dynStats( 'spe', -1, 'lib', 0.5, 'sen', 0.5, 'lus', 4 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 72 ) {
					EngineCore.outputText( '\n<b>Your stomach is easily the size of a beach ball, and still growing ever further. Strangely, you don\'t feel hindered. In fact, you feel like running...</b>\n', false );
					EngineCore.dynStats( 'spe', -1, 'lib', 1, 'sen', 1, 'lus', 4 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 48 ) {
					EngineCore.outputText( '\n<b>It seems impossible for your pregnant belly to grow any larger, but you are at your happiest yet, satisfied that somehow, you are fulfilling your role. It feels right to be pregnant, and you can\'t wait to get knocked up again afterwards.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 32 || CoC.player.pregnancyIncubation === 64 || CoC.player.pregnancyIncubation === 85 || CoC.player.pregnancyIncubation === 150 ) {
					displayedUpdate = true;
					//Increase lactation!;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() >= 1 && CoC.player.biggestLactation() < 2 ) {
						EngineCore.outputText( '\nYour breasts feel swollen with all the extra milk they\'re accumulating.  You wonder just what kind of creature they\'re getting ready to feed.\n', false );
						CoC.player.boostLactation( 0.5 );
					}
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() > 0 && CoC.player.biggestLactation() < 1 ) {
						EngineCore.outputText( '\nDrops of breastmilk escape your nipples as your body prepares for the coming birth.\n', false );
						CoC.player.boostLactation( 0.5 );
					}
					//Lactate if large && not lactating;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() === 0 ) {
						EngineCore.outputText( '<b>\nYou realize your breasts feel full, and occasionally lactate</b>.  It must be due to the pregnancy.\n', false );
						CoC.player.boostLactation( 1 );
					}
					//Enlarge if too small for lactation;
					if( CoC.player.biggestTitSize() === 2 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '<b>\nYour breasts have swollen to C-cups,</b> in light of your coming pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
					}
					//Enlarge if really small!;
					if( CoC.player.biggestTitSize() === 1 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '<b>\nYour breasts have grown to B-cups,</b> likely due to the hormonal changes of your pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
					}
				}
			}
			//Bunny tf preggoz;
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_BUNNY ) {
				if( CoC.player.pregnancyIncubation === 800 ) {
					EngineCore.outputText( '\nYour womb gurgles strangely.\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 785 ) {
					//EngineCore.outputText('\n<b>An unexpected change occurs, no doubt brought on by the bunny\'s eggs inside you!</b>', false);;
					Mutations.neonPinkEgg( true, CoC.player );
					EngineCore.outputText( '\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 776 ) {
					EngineCore.outputText( '\nYour womb feels full and bloated.\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 765 ) {
					//EngineCore.outputText('\n<b>An unexpected change occurs, no doubt brought on by the bunny\'s eggs inside you!</b>', false);;
					Mutations.neonPinkEgg( true, CoC.player );
					EngineCore.outputText( '\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation <= 745 && CoC.player.pregnancyIncubation > 400 ) {
					EngineCore.outputText( '\n<b>After dealing with the discomfort and bodily changes for the past day or so, you finally get the feeling that the eggs in your womb have dissolved.</b>\n', false );
					displayedUpdate = true;
					CoC.player.knockUpForce(); //Clear Pregnancy
				}
				//BREAK - REAL PREGNANCY BELOW THIS:;
				if( CoC.player.pregnancyIncubation === 198 ) {
					EngineCore.outputText( '\n<b>You realize your belly has gotten slightly larger.  Maybe there\'s some truth to what the bunny-girl said.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 178 ) {
					EngineCore.outputText( '\n<b>Your belly is getting more noticably distended.   You are probably pregnant.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 156 ) {
					EngineCore.outputText( '\n<b>The unmistakable bulge of pregnancy is visible in your tummy.  ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'You are distressed by your unwanted pregnancy, and your inability to force this thing out of you.</b>', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'You find yourself wondering what giving birth to bunny-girls is like.</b>', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'You dreamily wonder if you could find a bunny willing to put more than two eggs inside you at once.</b>', false );
					}
					EngineCore.dynStats( 'spe', -1, 'lib', 1, 'sen', 1, 'lus', 2 );
					EngineCore.outputText( '\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 140 ) {
					EngineCore.outputText( '\n<b>The sudden impact of a kick from inside your womb startles you, and it\'s immediately followed by a second on the other side.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 120 ) {
					EngineCore.outputText( '\n<b>Your ever-growing belly makes your pregnancy obvious for those around you.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 72 ) {
					EngineCore.outputText( '\n<b>Your belly is painfully distended, ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'making it difficult to function.</b>', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'and you wonder how much longer you have to wait.</b>', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'and you\'re eager to give birth so you\'ll be able to get pregnant again.</b>', false );
					}
					EngineCore.outputText( '\n', false );
					EngineCore.dynStats( 'spe', -3, 'lib', 1, 'sen', 1, 'lus', 4 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 48 ) {
					EngineCore.outputText( '\n<b>You rub your hands over your bulging belly, lost in the sensations of motherhood.  ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'Afterwards you feel somewhat disgusted with yourself.</b>\n', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'You estimate you\'ll give birth in the next few days.</b>\n', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'You find yourself daydreaming about birthing bunnies repeatedly, each time being re-impregnated with dozens of eggs from your lusty adolescent children.</b>\n', false );
					}
					displayedUpdate = true;
				}
			}
			//Marblz Pregnancy!;
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_MARBLE ) {
				if( CoC.player.pregnancyIncubation === 336 ) {
					EngineCore.outputText( '\n<b>You realize your belly has gotten slightly larger.  Maybe you need to cut back on the strange food.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 280 ) {
					EngineCore.outputText( '\n<b>Your belly is getting more noticably distended and squirming around.  You are probably pregnant.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 216 ) {
					EngineCore.outputText( '\n<b>The unmistakable bulge of pregnancy is visible in your tummy.  It\'s feeling heavier by the moment.  ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'You are distressed by your unwanted pregnancy, and your inability to force this thing out of you.</b>', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'Considering the size of the creatures you\'ve fucked, you hope it doesn\'t hurt when it comes out.</b>', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'You think dreamily about the monstrous cocks that have recently been fucking you, and hope that your offspring inherit such a pleasure tool.</b>', false );
					}
					EngineCore.dynStats( 'spe', -1, 'lib', 1, 'sen', 1, 'lus', 2 );
					EngineCore.outputText( '\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 180 ) {
					EngineCore.outputText( '\n<b>The sudden impact of a kick from inside your distended womb startles you.  Moments later it happens again, making you gasp and stagger.  Whatever is growing inside you is strong.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 120 ) {
					EngineCore.outputText( '\n<b>Your ever-growing belly makes your pregnancy obvious for those around you.  It\'s already as big as the belly of any pregnant woman back home.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 72 ) {
					EngineCore.outputText( '\n<b>Your belly is distended and overswollen with your offspring, ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'making it difficult to function.</b>', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'and you wonder how much longer you have to wait.</b>', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'and you\'re eager to give birth, so you can get fill your womb with a new charge.</b>', false );
					}
					EngineCore.outputText( '\n', false );
					EngineCore.dynStats( 'spe', -3, 'lib', 1, 'sen', 1, 'lus', 4 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 48 ) {
					EngineCore.outputText( '\n<b>You rub your hands over your bulging belly, lost in the sensations of motherhood.  Whatever child is inside your overstretched womb seems to appreciate the attention, and stops its incessant squirming.\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 32 || CoC.player.pregnancyIncubation === 150 ) {
					//Increase lactation!;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() >= 1 && CoC.player.biggestLactation() < 2 ) {
						EngineCore.outputText( '\nYour breasts feel swollen with all the extra milk they\'re accumulating.  You wonder just what kind of creature they\'re getting ready to feed.\n', false );
						CoC.player.boostLactation( 0.5 );
					}
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() > 0 && CoC.player.biggestLactation() < 1 ) {
						EngineCore.outputText( '\nDrops of breastmilk escape your nipples as your body prepares for the coming birth.\n', false );
						CoC.player.boostLactation( 0.5 );
					}
					//Lactate if large && not lactating;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() === 0 ) {
						EngineCore.outputText( '\n<b>You realize your breasts feel full, and occasionally lactate</b>.  It must be due to the pregnancy.\n', false );
						CoC.player.boostLactation( 1 );
					}
					//Enlarge if too small for lactation;
					if( CoC.player.biggestTitSize() === 2 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have swollen to C-cups,</b> in light of your coming pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
					}
					//Enlarge if really small!;
					if( CoC.player.biggestTitSize() === 1 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have grown to B-cups,</b> likely due to the hormonal changes of your pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
					}
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 85 ) {
					//A small scene for very late in the pregnancy, its breast growth for the little cowgirl.  This scene should be a few days before birth, so the milk doesn't stop before the cowgirl is born.;
					EngineCore.outputText( '\n<b>Your belly has become heavily pregnant; at the same time, ', false );
					//If (PC has flat breasts) ;
					if( CoC.player.biggestTitSize() <= 0 ) {
						EngineCore.outputText( 'your chest has begun to feel a bit odd.  Your run your hands over it to find that your breasts have grown to around C-cups at some point when you weren\'t paying attention!  ', false );
						CoC.player.breastRows[ 0 ].breastRating = 3;
					} else if( CoC.player.biggestTitSize() <= 1 ) {
						EngineCore.outputText( 'your breasts feel oddly tight in your top.  You put a hand to them and are startled when you find that they\'ve grown to C-cups!  ', false );
						CoC.player.breastRows[ 0 ].breastRating = 3;
					} else if( CoC.player.biggestTitSize() <= 10 ) {
						EngineCore.outputText( 'your breasts feel oddly full.  You grab them with your hands, and after a moment you\'re able to determine that they\'ve grown about a cup in size.  ', false );
						CoC.player.breastRows[ 0 ].breastRating++;
					} else {
						EngineCore.outputText( 'your breasts feel a bit odd.  You put a hand on your chest and start touching them.  ', false );
					}
					if( CoC.player.biggestLactation() < 1 ) {
						EngineCore.outputText( 'You gasp slightly in surprise and realize that you\'ve started lactating.', false );
						CoC.player.boostLactation( CoC.player.breastRows.length );
					} else {
						EngineCore.outputText( 'A few drips of milk spill out of your breasts, as expected.  Though, it occurs to you that there is more milk coming out than before.', false );
						CoC.player.boostLactation( CoC.player.breastRows.length * 0.25 );
					}
					EngineCore.outputText( '</b>\n', false );
				}
			}
			//Jojo Pregnancy!;
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_MOUSE || CoC.player.pregnancyType === PregnancyStore.PREGNANCY_JOJO ) {
				if( CoC.player.pregnancyIncubation === 336 ) {
					EngineCore.outputText( '\n<b>You realize your belly has gotten slightly larger.  Maybe you need to cut back on the strange food.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 280 ) {
					EngineCore.outputText( '\n<b>Your belly is getting more noticably distended and squirming around.  You are probably pregnant.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 216 ) {
					EngineCore.outputText( '\n<b>The unmistakable bulge of pregnancy is visible in your tummy.  It\'s feeling heavier by the moment.  ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'You are distressed by your unwanted pregnancy, and your inability to force this thing out of you.</b>', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'Considering the size of the creatures you\'ve fucked, you hope it doesn\'t hurt when it comes out.</b>', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'You think dreamily about the monstrous cocks that have recently been fucking you, and hope that your offspring inherit such a pleasure tool.</b>', false );
					}
					EngineCore.outputText( '\n', false );
					EngineCore.dynStats( 'spe', -1, 'lib', 1, 'sen', 1, 'lus', 2 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 180 ) {
					EngineCore.outputText( '\n<b>The sudden impact of a tiny kick from inside your distended womb startles you.  Moments later it happens again, making you gasp.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 120 ) {
					EngineCore.outputText( '\n<b>Your ever-growing belly makes your pregnancy obvious for those around you.  It\'s already as big as the belly of any pregnant woman back home.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 72 ) {
					EngineCore.outputText( '\n<b>Your belly is painfully distended and overswollen with wriggling offspring, ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'making it difficult to function.</b>', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'and you wonder how much longer you have to wait.</b>', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'and you\'re eager to give birth, so you can get impregnated again by monstrous cocks unloading their corrupted seed directly into your eager womb.</b>', false );
					}
					EngineCore.outputText( '\n', false );
					EngineCore.dynStats( 'spe', -3, 'lib', 1, 'sen', 1, 'lus', 4 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 48 ) {
					EngineCore.outputText( '\n<b>You rub your hands over your bulging belly, lost in the sensations of motherhood.  Whatever is inside your overstretched womb seems to appreciate the attention and stops its incessant squirming.  ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'Afterwards you feel somewhat disgusted with yourself.</b>\n', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'You estimate you\'ll give birth in the next few days.</b>\n', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'You find yourself daydreaming about birthing hundreds of little babies, and lounging around while they nurse non-stop on your increasingly sensitive breasts.</b>\n', false );
					}
				}
				if( CoC.player.pregnancyIncubation === 32 || CoC.player.pregnancyIncubation === 64 || CoC.player.pregnancyIncubation === 85 || CoC.player.pregnancyIncubation === 150 ) {
					//Increase lactation!;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() >= 1 && CoC.player.biggestLactation() < 2 ) {
						EngineCore.outputText( '\nYour breasts feel swollen with all the extra milk they\'re accumulating.  You wonder just what kind of creature they\'re getting ready to feed.\n', false );
						CoC.player.boostLactation( 0.5 );
					}
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() > 0 && CoC.player.biggestLactation() < 1 ) {
						EngineCore.outputText( '\nDrops of breastmilk escape your nipples as your body prepares for the coming birth.\n', false );
						CoC.player.boostLactation( 0.5 );
					}
					//Lactate if large && not lactating;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() === 0 ) {
						EngineCore.outputText( '\n<b>You realize your breasts feel full, and occasionally lactate</b>.  It must be due to the pregnancy.\n', false );
						CoC.player.boostLactation( 1 );
					}
					//Enlarge if too small for lactation;
					if( CoC.player.biggestTitSize() === 2 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have swollen to C-cups,</b> in light of your coming pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
					}
					//Enlarge if really small!;
					if( CoC.player.biggestTitSize() === 1 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have grown to B-cups,</b> likely due to the hormonal changes of your pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
					}
				}
			}
			//Amily Pregnancy!;
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_AMILY ) {
				if( CoC.player.pregnancyIncubation === 336 ) {
					EngineCore.outputText( '\n<b>You wake up feeling bloated, and your belly is actually looking a little puffy. At the same time, though, you have the oddest cravings... you could really go for some mixed nuts. And maybe a little cheese, too.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 280 ) {
					EngineCore.outputText( '\n<b>Your belly is getting more noticably distended and squirming around.  You are probably pregnant.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 216 ) {
					EngineCore.outputText( '\n<b>There is no question you\'re pregnant; your belly is already as big as that of any pregnant woman back home.', false );
					if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
						EngineCore.outputText( '  Amily smiles at you reassuringly. "<i>We do have litters, dear, this is normal.</i>"', false );
					}
					EngineCore.outputText( '</b>', false );
					EngineCore.outputText( '\n', false );
					EngineCore.dynStats( 'spe', -1, 'lib', 1, 'sen', 1, 'lus', 2 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 180 ) {
					EngineCore.outputText( '\n<b>The sudden impact of a tiny kick from inside your distended womb startles you.  Moments later it happens again, making you gasp.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 120 ) {
					EngineCore.outputText( '\n<b>You feel (and look) hugely pregnant, now, but you feel content. You know the, ah, \'father\' of these children loves you, and they will love you in turn.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 72 ) {
					EngineCore.outputText( '\n<b>You jolt from the sensation of squirming inside your swollen stomach. Fortunately, it dies down quickly, but you know for a fact that you felt more than one baby kicking inside you.</b>\n', false );
					EngineCore.dynStats( 'spe', -3, 'lib', 1, 'sen', 1, 'lus', 4 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 48 ) {
					EngineCore.outputText( '\n<b>The children kick and squirm frequently. Your bladder, stomach and lungs all feel very squished. You\'re glad that they\'ll be coming out of you soon.</b>\n', false );
				}
				if( CoC.player.pregnancyIncubation === 32 || CoC.player.pregnancyIncubation === 64 || CoC.player.pregnancyIncubation === 85 || CoC.player.pregnancyIncubation === 150 ) {
					//Increase lactation!;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() >= 1 && CoC.player.biggestLactation() < 2 ) {
						EngineCore.outputText( '\nYour breasts feel swollen with all the extra milk they\'re accumulating.\n', false );
						CoC.player.boostLactation( 0.5 );
					}
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() > 0 && CoC.player.biggestLactation() < 1 ) {
						EngineCore.outputText( '\nDrops of breastmilk escape your nipples as your body prepares for the coming birth.\n', false );
						CoC.player.boostLactation( 0.5 );
					}
					//Lactate if large && not lactating;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() === 0 ) {
						EngineCore.outputText( '\n<b>You realize your breasts feel full, and occasionally lactate</b>.  It must be due to the pregnancy.\n', false );
						CoC.player.boostLactation( 1 );
					}
					//Enlarge if too small for lactation;
					if( CoC.player.biggestTitSize() === 2 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have swollen to C-cups,</b> in light of your coming pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
					}
					//Enlarge if really small!;
					if( CoC.player.biggestTitSize() === 1 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have grown to B-cups,</b> likely due to the hormonal changes of your pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
					}
				}
			}
			//Shark Pregnancy!;
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_IZMA ) {
				if( CoC.player.pregnancyIncubation === 275 ) {
					if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00238 ] === 1 ) {
						EngineCore.outputText( '\n<b>You wake up feeling kind of nauseous.  Izma insists that you stay in bed and won\'t hear a word otherwise, tending to you in your sickened state.  When you finally feel better, she helps you up.  "<i>You know, ' + CoC.player.short + '... I think you might be pregnant.</i>" Izma says, sounding very pleased at the idea. You have to admit, you do seem to have gained some weight...</b>\n', false );
					} else {
						EngineCore.outputText( '\n<b>You wake up feeling bloated, and your belly is actually looking a little puffy. At the same time, though, you have the oddest cravings... you could really go for some fish.</b>\n', false );
					}
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 250 ) {
					EngineCore.outputText( '\n<b>Your belly is getting more noticably distended and squirming around.  You are probably pregnant.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 216 ) {
					if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00238 ] === 1 ) {
						EngineCore.outputText( '\n<b>Your stomach is undeniably swollen now, and you feel thirsty all the time. Izma is always there to bring you water, even anticipating your thirst before you recognize it yourself. She smiles all the time now, and seems to be very pleased with herself.', false );
					} else {
						EngineCore.outputText( '\n<b>There is no question you\'re pregnant; your belly is getting bigger and for some reason, you feel thirsty ALL the time.', false );
					}
					EngineCore.outputText( '</b>', false );
					EngineCore.outputText( '\n', false );
					EngineCore.dynStats( 'spe', -1, 'lib', 1, 'sen', 1, 'lus', 2 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 180 ) {
					if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00238 ] === 1 ) {
						EngineCore.outputText( '\n<b>There is no denying your pregnancy, and Izma is head-over-heels with your \'beautifully bountiful new body\', as she puts it. She is forever finding an excuse to touch your bulging stomach, and does her best to coax you to rest against her. However, when you do sit against her, she invariably starts getting hard underneath you.</b>\n', false );
					} else {
						EngineCore.outputText( '\n<b>There is no denying your pregnancy.  Your belly bulges and occasionally squirms as your growing offspring shifts position.</b>\n', false );
					}
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 120 ) {
					if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00238 ] === 1 ) {
						EngineCore.outputText( '\n<b>Your stomach is swollen and gravid; you can feel the baby inside you kicking and wriggling. Izma is always on hand now, it seems, and she won\'t dream of you fetching your own food or picking up anything you\'ve dropped. She\'s always dropping hints about how you should try going around naked for comfort\'s sake. While you are unwilling to do so, you find yourself dreaming about sinking into cool, clean water, and take many baths and swims. Whatever is inside you always seems to like it; they get so much more active when you\'re in the water.</b>\n', false );
					} else {
						EngineCore.outputText( '\n<b>Your stomach is swollen and gravid; you can feel the baby inside you kicking and wriggling.  You find yourself dreaming about sinking into cool, clean water, and take many baths and swims. Whatever is inside you always seems to like it; they get so much more active when you\'re in the water.</b>\n', false );
					}
					EngineCore.dynStats( 'spe', -2, 'lib', 1, 'sen', 1, 'lus', 4 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 72 ) {
					if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00238 ] === 1 ) {
						EngineCore.outputText( '\n<b>You dream of the water, of a life under the waves, where it\'s cool and wet and you are free. You spend as much time in the river as possible now, the baby inside you kicking and squirming impatiently, eager to be free of the confines of your womb and have much greater depths to swim and play in. Izma makes no secret of her pleasure and informs you that you should deliver soon.</b>\n', false );
					} else {
						EngineCore.outputText( '\n<b>You dream of the water, of a life under the waves, where it\'s cool and wet and you are free. You spend as much time in the river as possible now, the baby inside you kicking and squirming impatiently, eager to be free of the confines of your womb and have much greater depths to swim and play in.  The time for delivery will probably come soon.</b>\n', false );
					}
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 32 || CoC.player.pregnancyIncubation === 64 || CoC.player.pregnancyIncubation === 85 || CoC.player.pregnancyIncubation === 150 ) {
					//Increase lactation!;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() >= 1 && CoC.player.biggestLactation() < 2 ) {
						EngineCore.outputText( '\nYour breasts feel swollen with all the extra milk they\'re accumulating.\n', false );
						CoC.player.boostLactation( 0.5 );
						displayedUpdate = true;
					}
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() > 0 && CoC.player.biggestLactation() < 1 ) {
						EngineCore.outputText( '\nDrops of breastmilk escape your nipples as your body prepares for the coming birth.\n', false );
						CoC.player.boostLactation( 0.5 );
						displayedUpdate = true;
					}
					//Lactate if large && not lactating;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() === 0 ) {
						EngineCore.outputText( '\n<b>You realize your breasts feel full, and occasionally lactate</b>.  It must be due to the pregnancy.\n', false );
						CoC.player.boostLactation( 1 );
						displayedUpdate = true;
					}
					//Enlarge if too small for lactation;
					if( CoC.player.biggestTitSize() === 2 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have swollen to C-cups,</b> in light of your coming pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
						displayedUpdate = true;
					}
					//Enlarge if really small!;
					if( CoC.player.biggestTitSize() === 1 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have grown to B-cups,</b> likely due to the hormonal changes of your pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
						displayedUpdate = true;
					}
				}
			}
			//SPOIDAH Pregnancy!;
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_SPIDER || CoC.player.pregnancyType === PregnancyStore.PREGNANCY_DRIDER_EGGS ) {
				if( CoC.player.pregnancyIncubation === 399 ) {
					EngineCore.outputText( '\n<b>After your session with the spider, you feel much... fuller.  There is no outward change on your body as far as you can see but your womb feels slightly tingly whenever you move.  Hopefully it\'s nothing to be alarmed about.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 275 ) {
					EngineCore.outputText( '\n<b>Your belly grumbles as if empty, even though you ate not long ago.  Perhaps with all the exercise you\'re getting you just need to eat a little bit more.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 250 ) {
					EngineCore.outputText( '\n<b>Your belly looks a little pudgy', false );
					if( CoC.player.thickness > 60 && CoC.player.tone < 40 ) {
						EngineCore.outputText( ' even for you', false );
					}
					EngineCore.outputText( ', maybe you should cut back on all the food you\'ve been consuming lately?</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 216 ) {
					EngineCore.outputText( '\n<b>Your belly is definitely getting bigger, and no matter what you do, you can\'t seem to stop yourself from eating at the merest twinge of hunger.  The only explanation you can come up with is that you\'ve gotten pregnant during your travels.  Hopefully it won\'t inconvenience your adventuring.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 180 ) {
					EngineCore.outputText( '\n<b>A hot flush works its way through you, and visions of aroused ', false );
					if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_SPIDER ) {
						EngineCore.outputText( 'spider-morphs ', false );
					} else {
						EngineCore.outputText( 'driders ', false );
					}
					EngineCore.outputText( 'quickly come to dominate your thoughts.  You start playing with a nipple while you lose yourself in the fantasy, imagining being tied up in webs and mated with over and over, violated by a pack of horny males, each hoping to father your next brood.  You shake free of the fantasy and notice your hands rubbing over your slightly bloated belly.  Perhaps it wouldn\'t be so bad?</b>\n', false );
					EngineCore.dynStats( 'lib', 1, 'sen', 1, 'lus', 20 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 120 ) {
					EngineCore.outputText( '\n<b>Your belly has gotten nice and big, perhaps as big as you remember the bellies of the pregnant women back home being.  The elders always did insist on everyone doing their part to keep the population high enough to sustain the loss of a champion every year.  You give yourself a little hug, getting a surge of happiness from your hormone-addled body.  Pregnancy sure is great!</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 72 ) {
					EngineCore.outputText( '\n<b>The huge size of your pregnant belly constantly impedes your movement, but the constant squirming and shaking of your unborn offspring makes you pretty sure you won\'t have to carry them much longer.  A sense of motherly pride wells up in your breast - you just know you\'ll have such wonderful babies.', false );
					if( CoC.player.cor < 50 ) {
						EngineCore.outputText( '  You shudder and shake your head, wondering why you\'re thinking such unusual things.', false );
					}
					EngineCore.outputText( '</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 32 || CoC.player.pregnancyIncubation === 64 || CoC.player.pregnancyIncubation === 85 || CoC.player.pregnancyIncubation === 150 ) {
					//Increase lactation!;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() >= 1 && CoC.player.biggestLactation() < 2 ) {
						EngineCore.outputText( '\nYour breasts feel swollen with all the extra milk they\'re accumulating.\n', false );
						CoC.player.boostLactation( 0.5 );
						displayedUpdate = true;
					}
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() > 0 && CoC.player.biggestLactation() < 1 ) {
						EngineCore.outputText( '\nDrops of breastmilk escape your nipples as your body prepares for the coming birth.\n', false );
						CoC.player.boostLactation( 0.5 );
						displayedUpdate = true;
					}
					//Lactate if large && not lactating;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() === 0 ) {
						EngineCore.outputText( '\n<b>You realize your breasts feel full, and occasionally lactate</b>.  It must be due to the pregnancy.\n', false );
						CoC.player.boostLactation( 1 );
						displayedUpdate = true;
					}
					//Enlarge if too small for lactation;
					if( CoC.player.biggestTitSize() === 2 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have swollen to C-cups,</b> in light of your coming pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
						displayedUpdate = true;
					}
					//Enlarge if really small!;
					if( CoC.player.biggestTitSize() === 1 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have grown to B-cups,</b> likely due to the hormonal changes of your pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
						displayedUpdate = true;
					}
				}
			}
			//Goo Pregnancy!;
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_GOO_GIRL ) {
				if( CoC.player.pregnancyIncubation === 72 ) {
					EngineCore.outputText( '\n<b>The huge size of your pregnant belly constantly impedes your movement, but the constant squirming and shaking of your slime-packed belly is reassuring in its own way.  You can\'t wait to see how it feels to have the slime flowing and gushing through your lips, stroking you intimately as you birth new life into this world.', false );
					if( CoC.player.cor < 50 ) {
						EngineCore.outputText( '  You shudder and shake your head, wondering why you\'re thinking such unusual things.', false );
					}
					EngineCore.outputText( '</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 32 || CoC.player.pregnancyIncubation === 64 || CoC.player.pregnancyIncubation === 82 || CoC.player.pregnancyIncubation === 16 ) {
					//Increase lactation!;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() >= 1 && CoC.player.biggestLactation() < 2 ) {
						EngineCore.outputText( '\nYour breasts feel swollen with all the extra milk they\'re accumulating.\n', false );
						CoC.player.boostLactation( 0.5 );
						displayedUpdate = true;
					}
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() > 0 && CoC.player.biggestLactation() < 1 ) {
						EngineCore.outputText( '\nDrops of breastmilk escape your nipples as your body prepares for the coming birth.\n', false );
						CoC.player.boostLactation( 0.5 );
						displayedUpdate = true;
					}
					//Lactate if large && not lactating;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() === 0 ) {
						EngineCore.outputText( '\n<b>You realize your breasts feel full, and occasionally lactate</b>.  It must be due to the pregnancy.\n', false );
						CoC.player.boostLactation( 1 );
						displayedUpdate = true;
					}
					//Enlarge if too small for lactation;
					if( CoC.player.biggestTitSize() === 2 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have swollen to C-cups,</b> in light of your coming pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
						displayedUpdate = true;
					}
					//Enlarge if really small!;
					if( CoC.player.biggestTitSize() === 1 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have grown to B-cups,</b> likely due to the hormonal changes of your pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
						displayedUpdate = true;
					}
				}
			}
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_EMBER ) {
				//Pregnancy notes: Egg Laying ;
				if( CoC.flags[ kFLAGS.EMBER_OVIPOSITION ] > 0 ) {
					if( CoC.player.pregnancyIncubation === 330 ) {
						pregText = 'Your belly has swollen, becoming larger - proof that Ember\'s seed did its work.  The dragon seems to be constantly checking you out, as if looking for the signs of weight gain.';
					}
					if( CoC.player.pregnancyIncubation === 250 ) {
						pregText = 'Your belly grows ever bigger, making your pregnancy noticeable; your belly also feels somewhat solid.  Ember casts pleased glances in your direction, whenever ' + SceneLib.emberScene.emberMF( 'he', 'she' ) + ' thinks you\'re not looking.';
					}
					if( CoC.player.pregnancyIncubation === 170 ) {
						pregText = 'You\'ve grown a lot.  Anyone is able to tell that you\'re pregnant with a single glance; and by the shape, you have no doubt that there\'s an egg in your womb; a big one.';
						//(If Corruption < 40);
						if( CoC.player.cor < 40 ) {
							pregText += '  Part of you didn\'t really want to get knocked up, but it\'s for a good cause.  Besides, Ember looks very cute, trying to hide ' + SceneLib.emberScene.emberMF( 'his', 'her' ) + ' happiness whenever ' + SceneLib.emberScene.emberMF( 'he', 'she' ) + ' glances at your belly...';
						}
						//(If Corruption >= 40);
						else if( CoC.player.cor < 75 ) {
							pregText += '  Considering the size of the egg, you hope it doesn\'t hurt when your child comes out.  You hope Ember will help you through this.';
						}
						//(If Corruption >= 75);
						else {
							pregText += '  You think dreamily about the wild sex that helped conceive this little one.  Ember is such a great fuck.  Really, you\'re doing this world a favor by bringing more of Ember\'s offspring into it.';
						}
					}
					if( CoC.player.pregnancyIncubation === 120 ) {
						pregText = 'Though you\'re sure that this is the time when a regular baby would start moving about, your own belly simply sits there, heavy and full.  You\'d be worried if you didn\'t remember that Ember hatched from an egg.  Sometimes; a delightful, refreshing, chill spreads from your belly throughout your body; making you feel invigorated, ready for anything.';
					}
					if( CoC.player.pregnancyIncubation === 90 ) {
						pregText = 'You\'ve somehow grown even larger, the egg\'s outline appearing through your tummy.  By now, you\'re quite bothered with how difficult it\'s getting to move.  Ember constantly shadows you around the camp, making sure you\'re all right, although if you ever question ' + SceneLib.emberScene.emberMF( 'him', 'her' ) + ' ' + SceneLib.emberScene.emberMF( 'he', 'she' ) + '\'ll just say you\'re both going in the same direction.';
					}
					if( CoC.player.pregnancyIncubation === 60 ) {
						pregText = 'The egg inside your belly seems to grow heavier each day that passes.  ';
						//(If Corruption < 40);
						if( CoC.player.cor < 40 ) {
							pregText += 'It\'s quite a burden that you\'re carrying.  Still, it\'s a worthwhile sacrifice to make in order to restore Ember\'s race.';
						}
						//(If Corruption >= 40);
						else if( CoC.player.cor < 75 ) {
							pregText += 'You wonder how much longer you have to wait.  This egg is quite burdensome.  Part of you is scared of its size, the other part is delighted to have produced such a big egg.';
						}
						//If Corruption >= 75);
						else {
							pregText += 'You\'re eager to give birth, just so you can get impregnated again.  Particularly because that means more wild sex with Ember.';
						}
					}
					if( CoC.player.pregnancyIncubation === 30 ) {
						pregText = 'You rub your hands over your ripe belly, lost in the sensations of motherhood.  ';
						EngineCore.dynStats( 'sen', 5, 'lus', (5 + CoC.player.sens / 20) );
						//If Corruption < 40;
						if( CoC.player.cor < 40 ) {
							pregText += 'Despite your initial reluctance, you\'ve come to find a very real pleasure in being pregnant.  You hope Ember will want to have more children in the future...';
						}
						//(If Corruption >= 40);
						else if( CoC.player.cor < 75 ) {
							pregText += 'You smile, knowing you\'ll have your egg in your hands the next few days.  A part of you is almost sad that you\'ll be empty, but you can always entice Ember into getting you pregnant again.';
						}
						//(If Corruption >= 75);
						else {
							pregText += 'You find yourself daydreaming about giving birth, your belly swollen huge - bigger than it currently is - and the orgasmic sensation of many large, round eggs sliding out of your [vagina].\n\nYou start to absently rub yourself as you envision eggs by the dozens coming from within you; you shall be mothergod for a whole new race of dragons...';
							EngineCore.dynStats( 'lus', 35 );
						}
						pregText += '\n\nEmber interrupts your musings with a question.  "<i>How are you feeling? Do you need me to get you anything?</i>"';
						pregText += '\n\nThe dragon\'s question is uncharacteristic of ' + SceneLib.emberScene.emberMF( 'him', 'her' ) + '.  Still, you do appreciate the attention you\'re getting, and so you ask Ember to fetch you some food and water.  The speed with which Ember dashes off to fulfill your requests is truly impressive!  In short moments Ember is back with a piece of roasted meat and a skin of water.';
						pregText += '\n\nAs you eat and drink your fill, Ember uses one wing to shield you off the sun.  You\'re starting to really enjoy all the attention, but seeing Ember give up on ' + SceneLib.emberScene.emberMF( 'his', 'her' ) + ' usual antics is still very weird.';
					}
				}
				//Pregnancy Notes: Live Birth ;
				else {
					if( CoC.player.pregnancyIncubation === 330 ) {
						pregText = 'Your belly is a bit swollen - either you\'re eating too much or Ember\'s seed really did the job.';
					}
					if( CoC.player.pregnancyIncubation === 250 ) {
						pregText = 'Your belly grows ever bigger, making your pregnancy noticeable.  Ember shoots you quick looks, trying to hide ' + SceneLib.emberScene.emberMF( 'his', 'her' ) + ' smirk of success every time ' + SceneLib.emberScene.emberMF( 'he', 'she' ) + ' does.  You smirk right back at ' + SceneLib.emberScene.emberMF( 'him', 'her' ) + ', and occasionally make a subtle show of your gravid form, just to see ' + SceneLib.emberScene.emberMF( 'him', 'her' ) + ' get turned on by the sight.';
					}
					if( CoC.player.pregnancyIncubation === 170 ) {
						pregText = 'You\'ve grown a lot, anyone is able to tell that you\'re pregnant with a single glance.  ';
						//If Corruption < 40;
						if( CoC.player.cor < 40 ) {
							pregText += 'Part of you didn\'t really want to get knocked up.  However, Ember\'s look of satisfaction whenever ' + SceneLib.emberScene.emberMF( 'he', 'she' ) + ' gazes your way is rewarding despite that.  Plus, it is for a good cause.  You smirk in satisfaction - with a couple of dragons at your beck and call, things will look very different indeed.';
						}
						//If Corruption >= 40;
						else if( CoC.player.cor < 75 ) {
							pregText += 'You grin, savoring the strange, erotic sensations from the life inside your burgeoning womb and the promise of motherhood.  Mmm, if it feels this good, maybe you should "<i>encourage</i>" Ember to get you pregnant again.';
						} else {
							pregText += 'You think dreamily about the wild sex that helped conceive this little one.  Ember is such a great fuck. Really, you\'re doing this world a favor by bringing more of Ember\'s offspring into it.';
						}
					}
					if( CoC.player.pregnancyIncubation === 120 ) {
						pregText = 'Every once in awhile, you feel a kick from inside your bulging belly.  Right now, it\'s really kicking up a storm, and so you decide to sit down and take it easy.  You keep rubbing your belly, hoping to calm your child down and make it stop battering your innards.';
						pregText += '\n\nEmber approaches you, and casually asks, "<i>So... is it kicking already?</i>"';
						pregText += '\n\nYou admit that it is, stroking your stomach.  Casually, you ask if Ember would maybe like to touch your belly, wondering if ' + SceneLib.emberScene.emberMF( 'he', 'she' ) + ' will be able to bring ' + SceneLib.emberScene.emberMF( 'him', 'her' ) + 'self to do it.';
						pregText += '\n\n"<i>Yes! Of course!</i>" Ember replies';
						if( CoC.flags[ kFLAGS.EMBER_ROUNDFACE ] === 1 ) {
							pregText += ', blush at ' + SceneLib.emberScene.emberMF( 'his', 'her' ) + ' own over-enthusiastic reply';
						}
						pregText += '.  You just smile encouragingly at the dragon ' + SceneLib.emberScene.emberMF( '-boy', 'herm' ) + ' and lean back slightly, sticking out your gravid midriff in open encouragement to its ' + SceneLib.emberScene.emberMF( 'father', 'mother' ) + ' to try and connect with ' + SceneLib.emberScene.emberMF( 'his', 'her' ) + ' unborn child.';
						pregText += '\n\nEmber sets a clawed hand on your belly, careful not to hurt you with ' + SceneLib.emberScene.emberMF( 'his', 'her' ) + ' claws.  Slowly ' + SceneLib.emberScene.emberMF( 'he', 'she' ) + ' rubs your belly, until ' + SceneLib.emberScene.emberMF( 'he', 'she' ) + ' feels a small kick and smiles in glee.  You smile at the look of joy on ' + SceneLib.emberScene.emberMF( 'his', 'her' ) + ' face, even as ' + SceneLib.emberScene.emberMF( 'he', 'she' ) + ' realizes what ' + SceneLib.emberScene.emberMF( 'he', 'she' ) + '\'s doing and embarrassedly mumbles an excuse and walks away.';
					}
					if( CoC.player.pregnancyIncubation === 90 ) {
						pregText = 'You stop for a moment and sit down on a nearby rock.  Your belly feels much heavier than usual, and just walking about has become a chore.  Ember takes notice of your tiredness and quickly closes the distance between you two.  "<i>[name], are you feeling all right?</i>"';
						pregText += '\n\nYou tell ' + SceneLib.emberScene.emberMF( 'him', 'her' ) + ' that you are, just worn out.  It\'s not easy carrying ' + SceneLib.emberScene.emberMF( 'his', 'her' ) + ' child, after all.';
						pregText += '\n\nEmber sighs in relief.  "<i>Good, is there anything I can do for you?</i>"';
						pregText += '\n\nYou tap your lips thoughtfully, mulling it over.  ';
						//(Low Corruption);
						if( CoC.player.cor <= 33 ) {
							pregText += 'There really isn\'t anything you feel like you need right now... maybe some water?  Or maybe you could have Ember help you to your tent for a quick rest?';
						}
						//(Medium Corruption);
						else if( CoC.player.cor <= 66 ) {
							pregText += 'You wonder if you should take advantage of Ember - you\'ve certainly been feeling a little on edge lately, and besides ' + SceneLib.emberScene.emberMF( 'he', 'she' ) + ' did say \'anything\'.  You ponder this for a while longer.';
						}
						//High Corruptio;
						else {
							pregText += 'You  already thought up a perfect way for this sexy dragon to help you, but it\'s best not to rush.  It\'s not everyday that Ember says ' + SceneLib.emberScene.emberMF( 'he', 'she' ) + '\'ll do \'anything\' for you.  A quick jab on your belly from your unborn child makes you recoil a bit though.  Maybe it would be better to wait until this little one is out of you, just so you can have another.  You ponder what to ask of ' + SceneLib.emberScene.emberMF( 'him', 'her' ) + ' a while longer.';
						}
						pregText += '\n\nFinally, you decide there really isn\'t anything Ember can help you with, and tell ' + SceneLib.emberScene.emberMF( 'him', 'her' ) + ' so.  Though ' + SceneLib.emberScene.emberMF( 'he', 'she' ) + ' had better be ready to do ' + SceneLib.emberScene.emberMF( 'his', 'her' ) + ' part when the baby is born and needs caring.';
						if( CoC.flags[ kFLAGS.EMBER_GENDER ] === 1 && CoC.flags[ kFLAGS.EMBER_MILK ] > 0 ) {
							pregText += '  You can\'t resist smirking and patting one of your shemale dragon\'s bountiful breasts, noting that maybe you should let him do all the breast-feeding.';
						}

						pregText += '\n\n';
						if( CoC.flags[ kFLAGS.EMBER_ROUNDFACE ] > 0 ) {
							pregText += 'Ember blushes.  ';
						}
						pregText += '"<i>O-of course I\'ll do my part.  If you don\'t need me for anything, I\'ll be going then.</i>" ' + SceneLib.emberScene.emberMF( 'He', 'She' ) + ' turns on ' + SceneLib.emberScene.emberMF( 'his', 'her' ) + ' heels and walks away.  You watch ' + SceneLib.emberScene.emberMF( 'him', 'her' ) + ' go, pat yourself on the stomach, then painstakingly hoist yourself back upright and go on your way.';
					}
					if( CoC.player.pregnancyIncubation === 60 ) {
						pregText = 'Besides being so huge you\'d probably be asked if you were having twins back in Ingnam, your belly has grown stupidly heavy, ';
						if( CoC.player.cor <= 33 ) {
							pregText += 'making you wonder more than ever if it really was a good idea to get pregnant with a dragon.  True, Ember looks ready to burst with pride at your fruitful bounty, but you feel ready to just plain burst yourself.';
						} else if( CoC.player.cor <= 66 ) {
							pregText += 'and you wonder how much longer you have to wait.  Despite being a bit bothersome, you\'re pleased your child is growing into a healthy, hopefully sexy, dragon; like its father.';
						} else {
							pregText += 'and you\'re eager to give birth, so you can get impregnated again.  Particularly because that means more rowdy fucking from Ember.';
						}
					}
					if( CoC.player.pregnancyIncubation === 30 ) {
						pregText = 'You rub your hands over your gloriously full, ripe belly, lost in the sensations of motherhood.  ';
						if( CoC.player.cor <= 33 ) {
							pregText += 'Despite your initial reluctance, you\'ve come to find a very real pleasure in being pregnant.  You hope Ember will want to have more children in the future.';
						} else if( CoC.player.cor <= 66 ) {
							pregText += 'You smile, knowing you\'ll meet your child in the next few days.  A part of you is almost sad that you\'ll be empty, but you can always entice Ember into getting you pregnant again.';
						} else {
							pregText += 'You find yourself daydreaming about being the revered mother-queen of a huge army of dragons, visions of magnificent, sexy, scaly beasts sweeping across the land conquering it in your honor, offering up tribute to the ever-ripe womb that brought them forth; rolling around, as the musk of their fucking fills the air.  The image is so delicious you don\'t want to wake up from your fantasy.';
						}
					}
				}
				if( pregText !== '' ) {
					EngineCore.outputText( '\n' + pregText + '\n' );
					displayedUpdate = true;
				}
			}
			//Pregnancy 4 Satyrs;
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_SATYR ) {
				//Stage 1: ;
				if( CoC.player.pregnancyIncubation === 150 ) {
					EngineCore.outputText( '\n<b>You find that you\'re feeling quite sluggish these days; you just don\'t have as much energy as you used to.  You\'re also putting on weight.</b>\n' );
					displayedUpdate = true;
				}
				//Stage 2: ;
				if( CoC.player.pregnancyIncubation === 125 ) {
					EngineCore.outputText( '\n<b>Your belly is getting bigger and bigger.  Maybe your recent urges are to blame for this development?</b>\n' );
					displayedUpdate = true;
				}
				//Stage 3: ;
				if( CoC.player.pregnancyIncubation === 100 ) {
					EngineCore.outputText( '\n<b>You can feel the strangest fluttering sensations in your distended belly; it must be a pregnancy.  You should eat more and drink plenty of wine so your baby can grow properly.  Wait, wine...?</b>\n' );
					displayedUpdate = true;
				}
				//Stage 4: ;
				if( CoC.player.pregnancyIncubation === 75 ) {
					EngineCore.outputText( '\n<b>Sometimes you feel a bump in your pregnant belly.  You wonder if it\'s your baby complaining about your moving about.</b>\n' );
					displayedUpdate = true;
				}
				//Stage 5: ;
				if( CoC.player.pregnancyIncubation === 50 ) {
					EngineCore.outputText( '\n<b>With your bloating gut, you are loathe to exert yourself in any meaningful manner; you feel horny and hungry all the time...</b>\n' );
					displayedUpdate = true;
					//temp min lust up +5;
				}
				//Stage 6: ;
				if( CoC.player.pregnancyIncubation === 30 ) {
					EngineCore.outputText( '\n<b>The baby you\'re carrying constantly kicks your belly in demand for food and wine, and you feel sluggish and horny.  You can\'t wait to birth this little one so you can finally rest for a while.</b>\n' );
					displayedUpdate = true;
					//temp min lust up addl +5;
				}
			}
			//BASILISK Pregnancy!;
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_BASILISK || CoC.player.pregnancyType === PregnancyStore.PREGNANCY_BENOIT ) {
				if( CoC.player.pregnancyIncubation === 185 ) {
					EngineCore.outputText( '\n<b>Your belly grumbles as if empty, even though you ate not long ago.  Perhaps with all the exercise you\'re getting you just need to eat a little bit more.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 160 ) {
					EngineCore.outputText( '\n<b>Your belly looks a little pudgy', false );
					if( CoC.player.thickness > 60 && CoC.player.tone < 40 ) {
						EngineCore.outputText( ' even for you', false );
					}
					EngineCore.outputText( ', maybe you should cut back on all the food you\'ve been consuming lately?</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 140 ) {
					EngineCore.outputText( '\n<b>Your belly is definitely getting bigger, and no matter what you do, you can\'t seem to stop yourself from eating at the merest twinge of hunger.  The only explanation you can come up with is that you\'ve gotten pregnant during your travels.  Hopefully it won\'t inconvenience your adventuring.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 110 ) {
					EngineCore.outputText( '\n<b>Your belly has gotten nice and big, perhaps as big as you remember the bellies of the pregnant women back home being.  The elders always did insist on everyone doing their part to keep the population high enough to sustain the loss of a champion every year.  You give yourself a little hug, getting a surge of happiness from your hormone-addled body.  Pregnancy sure is great!</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 72 ) {
					EngineCore.outputText( '\n<b>The huge size of your pregnant belly constantly impedes your movement, but the constant squirming and shaking of your unborn offspring makes you pretty sure you won\'t have to carry them much longer.  A sense of motherly pride wells up in your breast - you just know you\'ll have such wonderful babies.', false );
					if( CoC.player.cor < 50 ) {
						EngineCore.outputText( '  You shudder and shake your head, wondering why you\'re thinking such unusual things.', false );
					}
					EngineCore.outputText( '</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 32 || CoC.player.pregnancyIncubation === 64 || CoC.player.pregnancyIncubation === 85 || CoC.player.pregnancyIncubation === 150 ) {
					//Increase lactation!;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() >= 1 && CoC.player.biggestLactation() < 2 ) {
						EngineCore.outputText( '\nYour breasts feel swollen with all the extra milk they\'re accumulating.\n', false );
						CoC.player.boostLactation( 0.5 );
						displayedUpdate = true;
					}
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() > 0 && CoC.player.biggestLactation() < 1 ) {
						EngineCore.outputText( '\nDrops of breastmilk escape your nipples as your body prepares for the coming birth.\n', false );
						CoC.player.boostLactation( 0.5 );
						displayedUpdate = true;
					}
					//Lactate if large && not lactating;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() === 0 ) {
						EngineCore.outputText( '\n<b>You realize your breasts feel full, and occasionally lactate</b>.  It must be due to the pregnancy.\n', false );
						CoC.player.boostLactation( 1 );
						displayedUpdate = true;
					}
					//Enlarge if too small for lactation;
					if( CoC.player.biggestTitSize() === 2 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have swollen to C-cups,</b> in light of your coming pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
						displayedUpdate = true;
					}
					//Enlarge if really small!;
					if( CoC.player.biggestTitSize() === 1 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have grown to B-cups,</b> likely due to the hormonal changes of your pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
						displayedUpdate = true;
					}
				}
			}
			//Anemone Pregnancy;
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_ANEMONE ) {
				if( CoC.player.pregnancyIncubation === 240 ) {
					EngineCore.outputText( '\n<b>You feel something shifting and moving inside you.  You start to think you might be pregnant.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 210 ) {
					EngineCore.outputText( '\n<b>The fluttering of sensation inside you is getting stronger and more frequent.  At times it even feels as if the inner lining of your womb is tingling.</b>\n', false );
					EngineCore.dynStats( 'lus', (5 + CoC.player.lib / 20) );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 185 ) {
					EngineCore.outputText( '\n<b>The unmistakable bulge of pregnancy is visible in your tummy.  ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'You are distressed by your unwanted pregnancy, and your inability to force this thing out of you.</b>', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'Considering the possible fathers, you hope it isn\'t that big.</b>', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'You think dreamily about the cocks that have recently been fucking you, and hope that your offspring inherit such a divine pleasure tool.</b>', false );
					}
					EngineCore.dynStats( 'spe', -1, 'lib', 1, 'sen', 1, 'lus', 2 );
					EngineCore.outputText( '\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 154 ) {
					EngineCore.outputText( '\n<b>The sudden impact of a strong movement from inside your womb startles you.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 120 ) {
					EngineCore.outputText( '\n<b>Your larger, squirming belly makes your pregnancy obvious for those around you', false );
					if( CoC.player.hasVagina() ) {
						EngineCore.outputText( ' and keeps your ' + Descriptors.vaginaDescript( 0 ) + ' aroused from the constant tingling in your womb', false );
					}
					EngineCore.outputText( '.</b>\n', false );
					EngineCore.dynStats( 'lus', (10 + CoC.player.lib / 20) );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 72 ) {
					EngineCore.outputText( '\n<b>Your belly is noticeably distended, ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'and constantly shifts and wriggles.  What manner of beast are you bringing into the world?</b>', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'and you wonder how much longer you have to wait.</b>', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'and you\'re eager to give birth, so you can get impregnated again by corrupted or monstrous cum filling out your eager womb.</b>', false );
					}
					EngineCore.outputText( '\n', false );
					EngineCore.dynStats( 'spe', -3, 'lib', 1, 'sen', 1, 'lus', (5 + CoC.player.lib / 20) );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 48 ) {
					EngineCore.outputText( '\n<b>You rub your hands over your bulging belly, lost in the sensations of motherhood.  ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'Afterwards you feel somewhat disgusted with yourself, but horny.</b>\n', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'You estimate you\'ll give birth in the next few days.  You hope the birth is as erotically charged as the pregnancy has been.</b>\n', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'You find yourself daydreaming  about birthing cilia-covered worms, orgasming each time their thousands of stingers brush by your clit and fill it full of sensation-enhancing drugs.</b>\n', false );
					}
					EngineCore.dynStats( 'spe', -1, 'lib', 1, 'sen', 1, 'lus', (10 + CoC.player.lib / 20) );
					displayedUpdate = true;
				}
			}
			//Hellhound Pregnancy!;
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_HELL_HOUND ) {
				if( CoC.player.pregnancyIncubation === 290 ) {
					EngineCore.outputText( '\n<b>You realize your belly has gotten slightly larger.  Maybe you need to cut back on the strange food.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 240 ) {
					EngineCore.outputText( '\n<b>Your belly is getting more noticably distended and squirming around.  You are probably pregnant.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 216 ) {
					EngineCore.outputText( '\n<b>The unmistakable bulge of pregnancy is visible in your tummy.  It\'s feeling heavier by the moment.  ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'You are distressed by your unwanted pregnancy, and your inability to force this thing out of you.</b>', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'Considering the size of the creatures you\'ve fucked, you hope it doesn\'t hurt when it comes out.</b>', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'You think dreamily about the monstrous cocks that have recently been fucking you, and hope that your offspring inherit such a pleasure tool.</b>', false );
					}
					EngineCore.outputText( '\n', false );
					EngineCore.dynStats( 'spe', -1, 'lib', 1, 'sen', 1, 'lus', 2 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 180 ) {
					EngineCore.outputText( '\n<b>There is a strange heat within your belly, it makes you a little tired.</b>\n', false );
					EngineCore.dynStats( 'tou', -1 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 120 ) {
					EngineCore.outputText( '\n<b>Your ever-growing belly makes your pregnancy obvious for those around you.  With each day you can feel the heat within you growing.</b>\n', false );
					displayedUpdate = true;
					EngineCore.dynStats( 'tou', -1 );
				}
				if( CoC.player.pregnancyIncubation === 72 ) {
					EngineCore.outputText( '\n<b>The heat within doesn\'t drain you as much as it used to, instead giving you an odd strength.</b>', false );
					EngineCore.outputText( '\n', false );
					EngineCore.dynStats( 'str', 1, 'tou', 1 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 48 ) {
					EngineCore.outputText( '\n<b>You can feel two large lumps pushing against your womb together ', false );
					if( CoC.player.cor < 40 ) {
						EngineCore.outputText( 'making it difficult to function.</b>', false );
					}
					if( CoC.player.cor >= 40 && CoC.player.cor < 75 ) {
						EngineCore.outputText( 'and you wonder how much longer you have to wait.</b>', false );
					}
					if( CoC.player.cor >= 75 ) {
						EngineCore.outputText( 'and you\'re eager to give birth, so you can get impregnated again by monstrous cocks unloading their corrupted seed directly into your eager womb.</b>', false );
					}
					EngineCore.outputText( '\n', false );
					EngineCore.dynStats( 'spe', -2, 'lib', 1, 'sen', 1, 'lus', 4 );
					displayedUpdate = true;
				}
				if( CoC.player.pregnancyIncubation === 32 || CoC.player.pregnancyIncubation === 64 || CoC.player.pregnancyIncubation === 85 || CoC.player.pregnancyIncubation === 150 ) {
					//Increase lactation!;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() >= 1 && CoC.player.biggestLactation() < 2 ) {
						EngineCore.outputText( '\nYour breasts feel swollen with all the extra milk they\'re accumulating.  You wonder just what kind of creature they\'re getting ready to feed.\n', false );
						CoC.player.boostLactation( 0.5 );
					}
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() > 0 && CoC.player.biggestLactation() < 1 ) {
						EngineCore.outputText( '\nDrops of breastmilk escape your nipples as your body prepares for the coming birth.\n', false );
						CoC.player.boostLactation( 0.5 );
					}
					//Lactate if large && not lactating;
					if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.biggestLactation() === 0 ) {
						EngineCore.outputText( '\n<b>You realize your breasts feel full, and occasionally lactate</b>.  It must be due to the pregnancy.\n', false );
						CoC.player.boostLactation( 1 );
					}
					//Enlarge if too small for lactation;
					if( CoC.player.biggestTitSize() === 2 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have swollen to C-cups,</b> in light of your coming pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
					}
					//Enlarge if really small!;
					if( CoC.player.biggestTitSize() === 1 && CoC.player.mostBreastsPerRow() > 1 ) {
						EngineCore.outputText( '\n<b>Your breasts have grown to B-cups,</b> likely due to the hormonal changes of your pregnancy.\n', false );
						CoC.player.growTits( 1, 1, false, 3 );
					}
				}
			}
			//Frog Eggs;
			else if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_FROG_GIRL ) {
				if( CoC.player.pregnancyIncubation === 8 ) {
					//Egg Maturing;
					if( CoC.player.hasVagina() ) {
						EngineCore.outputText( '\nYour gut churns, and with a squelching noise, a torrent of transparent slime gushes from your [vagina].  You immediately fall to your knees, landing wetly amidst the slime.  The world around briefly flashes with unbelievable colors, and you hear someone giggling.\n\nAfter a moment, you realize that it’s you.' );
						//pussy:;
						if( CoC.player.hasVagina() ) {
							EngineCore.outputText( '  Against your [vagina], the slime feels warm and cold at the same time, coaxing delightful tremors from your [clit].' );
						}//[balls:;
						else if( CoC.player.balls > 0 ) {
							EngineCore.outputText( '  Slathered in hallucinogenic frog slime, your balls tingle, sending warm pulses of pleasure all the way up into your brain.' );
						}
						//genderless: ;
						else {
							EngineCore.outputText( '  Your [vagina] begins twitching, aching for something to push through it over and over again.' );
						}
						EngineCore.outputText( '  Seated in your own slime, you moan softly, unable to keep your hands off yourself.' );
						EngineCore.dynStats( 'lus=', 100, 'resisted', false );
						displayedUpdate = true;
					} else {
						EngineCore.outputText( '\nYour gut churns, but after a moment it settles. Your belly does seem a bit bigger and more gravid afterward, like you\'re filling up with fluid without any possible vent. You suddenly wonder if losing your pussy was such a great idea.' );
						displayedUpdate = true;
					}
				}
			}
		}
		//IF INCUBATION IS ANAL;
		if( CoC.player.buttPregnancyIncubation > 1 ) {
			if( CoC.player.buttPregnancyType === PregnancyStore.PREGNANCY_FROG_GIRL ) {
				if( CoC.player.buttPregnancyIncubation === 8 ) {
					//Egg Maturing;
					EngineCore.outputText( '\nYour gut churns, and with a squelching noise, a torrent of transparent slime gushes from your ass.  You immediately fall to your knees, landing wetly amidst the slime.  The world around briefly flashes with unbelievable colors, and you hear someone giggling.\n\nAfter a moment, you realize that it’s you.' );
					//pussy:;
					if( CoC.player.hasVagina() ) {
						EngineCore.outputText( '  Against your [vagina], the slime feels warm and cold at the same time, coaxing delightful tremors from your [clit].' );
					}//[balls:;
					else if( CoC.player.balls > 0 ) {
						EngineCore.outputText( '  Slathered in hallucinogenic frog slime, your balls tingle, sending warm pulses of pleasure all the way up into your brain.' );
					}
					//[cock:;
					else if( CoC.player.hasCock() ) {
						EngineCore.outputText( '  Splashing against the underside of your ' + CoC.player.multiCockDescriptLight() + ', the slime leaves a warm, oozy sensation that makes you just want to rub [eachCock] over and over and over again.' );
					}//genderless: ;
					else {
						EngineCore.outputText( '  Your asshole begins twitching, aching for something to push through it over and over again.' );
					}
					EngineCore.outputText( '  Seated in your own slime, you moan softly, unable to keep your hands off yourself.' );
					EngineCore.dynStats( 'lus=', 100, 'resisted', false );
					displayedUpdate = true;
				}
			}
			//Pregnancy 4 Satyrs;
			if( CoC.player.buttPregnancyType === PregnancyStore.PREGNANCY_SATYR ) {
				//Stage 1: ;
				if( CoC.player.buttPregnancyIncubation === 150 ) {
					EngineCore.outputText( '\n<b>You find that you\'re feeling quite sluggish these days; you just don\'t have as much energy as you used to.  You\'re also putting on weight.</b>\n' );
					displayedUpdate = true;
				}
				//Stage 2: ;
				if( CoC.player.buttPregnancyIncubation === 125 ) {
					EngineCore.outputText( '\n<b>Your belly is getting bigger and bigger.  Maybe your recent urges are to blame for this development?</b>\n' );
					displayedUpdate = true;
				}
				//Stage 3: ;
				if( CoC.player.buttPregnancyIncubation === 100 ) {
					EngineCore.outputText( '\n<b>You can feel the strangest fluttering sensations in your distended belly; it must be a pregnancy.  You should eat more and drink plenty of wine so your baby can grow properly.  Wait, wine...?</b>\n' );
					displayedUpdate = true;
				}
				//Stage 4: ;
				if( CoC.player.buttPregnancyIncubation === 75 ) {
					EngineCore.outputText( '\n<b>Sometimes you feel a bump in your pregnant belly.  You wonder if it\'s your baby complaining about your moving about.</b>\n' );
					displayedUpdate = true;
				}
				//Stage 5: ;
				if( CoC.player.buttPregnancyIncubation === 50 ) {
					EngineCore.outputText( '\n<b>With your bloating gut, you are loathe to exert yourself in any meaningful manner; you feel horny and hungry all the time...</b>\n' );
					displayedUpdate = true;
					//temp min lust up +5;
				}
				//Stage 6: ;
				if( CoC.player.buttPregnancyIncubation === 30 ) {
					EngineCore.outputText( '\n<b>The baby you\'re carrying constantly kicks your belly in demand for food and wine, and you feel sluggish and horny.  You can\'t wait to birth this little one so you can finally rest for a while.</b>\n' );
					displayedUpdate = true;
					//temp min lust up addl +5;
				}
			}
			//DRIDAH BUTT Pregnancy!;
			if( CoC.player.buttPregnancyType === PregnancyStore.PREGNANCY_DRIDER_EGGS ) {
				if( CoC.player.buttPregnancyIncubation === 199 ) {
					EngineCore.outputText( '\n<b>After your session with the drider, you feel so nice and... full.  There is no outward change on your body, aside from the egg-packed bulge of your belly, but your ' + Descriptors.assholeDescript() + ' tingles slightly and leaks green goop from time to time. Hopefully it\'s nothing to be alarmed about.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.buttPregnancyIncubation === 180 ) {
					EngineCore.outputText( '\n<b>A hot flush works its way through you, and visions of aroused driders quickly come to dominate your thoughts.  You start playing with a nipple while you lose yourself in the fantasy, imagining being tied up in webs and packed completely full of eggs, stuffing your belly completely with burgeoning spheres of love.  You shake free of the fantasy and notice your hands rubbing over your slightly bloated belly.  Perhaps it wouldn\'t be so bad?</b>\n', false );
					EngineCore.dynStats( 'lib', 1, 'sen', 1, 'lus', 20 );
					displayedUpdate = true;
				}
				if( CoC.player.buttPregnancyIncubation === 120 ) {
					EngineCore.outputText( '\n<b>Your belly is bulging from the size of the eggs growing inside you and gurgling just about any time you walk.  Green goo runs down your ' + CoC.player.legs() + ' frequently, drooling out of your pregnant asshole.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.buttPregnancyIncubation === 72 ) {
					EngineCore.outputText( '\n<b>The huge size of your pregnant belly constantly impedes your movement, but the constant squirming and shaking of your unborn offspring makes you pretty sure you won\'t have to carry them much longer.', false );
					EngineCore.outputText( '</b>\n', false );
					displayedUpdate = true;
				}
			}
			//Bee Egg's in butt pregnancy;
			if( CoC.player.buttPregnancyType === PregnancyStore.PREGNANCY_BEE_EGGS ) {
				if( CoC.player.buttPregnancyIncubation === 36 ) {
					EngineCore.outputText( '<b>\nYou feel bloated, your bowels shifting uncomfortably from time to time.</b>\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.buttPregnancyIncubation === 20 ) {
					EngineCore.outputText( '<b>\nA honey-scented fluid drips from your rectum.</b>  At first it worries you, but as the smell fills the air around you, you realize anything with such a beautiful scent must be good.  ', false );
					if( CoC.player.cockTotal() > 0 ) {
						EngineCore.outputText( 'The aroma seems to permeate your very being, slowly congregating in your ', false );
					}
					if( CoC.player.cockTotal() === 1 ) {
						EngineCore.outputText( Descriptors.cockDescript( 0 ), false );
						if( CoC.player.horseCocks() === 1 ) {
							EngineCore.outputText( ', each inhalation making it bigger, harder, and firmer.  You suck in huge lungfuls of air, until your ' + Descriptors.cockDescript( 0 ) + ' is twitching and dripping, the flare swollen and purple.  ', false );
						}
						if( CoC.player.dogCocks() === 1 ) {
							EngineCore.outputText( ', each inhalation making it thicker, harder, and firmer.  You suck in huge lungfuls of air, desperate for more, until your ' + Descriptors.cockDescript( 0 ) + ' is twitching and dripping, its knot swollen to the max.  ', false );
						}
						if( CoC.player.normalCocks() === 1 ) {
							EngineCore.outputText( ', each inhalation making it bigger, harder, and firmer.  You suck in huge lungfuls of air, until your ' + Descriptors.cockDescript( 0 ) + ' is twitching and dripping, the head swollen and purple.  ', false );
						}
						//FAILSAFE FOR NEW COCKS;
						if( CoC.player.normalCocks() === 0 && CoC.player.dogCocks() === 0 && CoC.player.horseCocks() === 0 ) {
							EngineCore.outputText( ', each inhalation making it bigger, harder, and firmer.  You suck in huge lungfuls of air until your ' + Descriptors.cockDescript( 0 ) + ' is twitching and dripping.  ', false );
						}
					}
					if( CoC.player.cockTotal() > 1 ) {
						EngineCore.outputText( 'groin.  Your ' + CoC.player.multiCockDescriptLight() + ' fill and grow with every lungful of the stuff you breathe in.  You suck in great lungfuls of the tainted air, desperate for more, your cocks twitching and dripping with need.  ', false );
					}
					EngineCore.outputText( 'You smile knowing you couldn\'t stop from masturbating if you wanted to.\n', false );
					EngineCore.dynStats( 'int', -0.5, 'lus', 500 );
					displayedUpdate = true;
				}
			}
			//Sand Tarps in butt pregnancy;
			if( CoC.player.buttPregnancyType === PregnancyStore.PREGNANCY_SANDTRAP || CoC.player.buttPregnancyType === PregnancyStore.PREGNANCY_SANDTRAP_FERTILE ) {
				if( CoC.player.buttPregnancyIncubation === 36 ) {
					//(Eggs take 2-3 days to lay);
					EngineCore.outputText( '<b>\nYour bowels make a strange gurgling noise and shift uneasily.  You feel ' );
					if( CoC.player.buttPregnancyType === PregnancyStore.PREGNANCY_SANDTRAP_FERTILE ) {
						EngineCore.outputText( ' bloated and full; the sensation isn\'t entirely unpleasant.' );
					} else {
						EngineCore.outputText( 'increasingly empty, as though some obstructions inside you were being broken down.' );
						CoC.player.buttKnockUpForce(); //Clear Butt Pregnancy
					}
					EngineCore.outputText( '</b>\n' );
					displayedUpdate = true;
				}
				if( CoC.player.buttPregnancyIncubation === 20 ) {
					//end eggpreg here if unfertilized;
					EngineCore.outputText( '\nSomething oily drips from your sphincter, staining the ground.  You suppose you should feel worried about this, but the overriding emotion which simmers in your gut is one of sensual, yielding calm.  The pressure in your bowels which has been building over the last few days feels right somehow, and the fact that your back passage is dribbling lubricant makes you incredibly, perversely hot.  As you stand there and savor the wet, soothing sensation a fantasy pushes itself into your mind, one of being on your hands and knees and letting any number of beings use your ass, of being bred over and over by beautiful, irrepressible insect creatures.  With some effort you suppress these alien emotions and carry on, trying to ignore the oil which occasionally beads out of your ' + Descriptors.assholeDescript() + ' and stains your [armor].\n' );
					EngineCore.dynStats( 'int', -0.5, 'lus', 500 );
					displayedUpdate = true;
				}
			}
			//Bunny TF buttpreggoz;
			if( CoC.player.buttPregnancyType === PregnancyStore.PREGNANCY_BUNNY ) {
				if( CoC.player.buttPregnancyIncubation === 800 ) {
					EngineCore.outputText( '\nYour gut gurgles strangely.\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.buttPregnancyIncubation === 785 ) {
					Mutations.neonPinkEgg( true, CoC.player );
					EngineCore.outputText( '\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.buttPregnancyIncubation === 776 ) {
					EngineCore.outputText( '\nYour gut feels full and bloated.\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.buttPregnancyIncubation === 765 ) {
					Mutations.neonPinkEgg( true, CoC.player );
					EngineCore.outputText( '\n', false );
					displayedUpdate = true;
				}
				if( CoC.player.buttPregnancyIncubation === 745 ) {
					EngineCore.outputText( '\n<b>After dealing with the discomfort and bodily changes for the past day or so, you finally get the feeling that the eggs in your ass have dissolved.</b>\n', false );
					displayedUpdate = true;
					CoC.player.buttKnockUpForce(); //Clear Butt Pregnancy
				}
			}
		}
		//Give birth to either a faerie or a phouka;
		if( CoC.player.pregnancyIncubation === 1 && CoC.player.pregnancyType === PregnancyStore.PREGNANCY_FAERIE ) {
			SceneLib.phoukaScene.phoukaPregBirth();
			displayedUpdate = true;
			CoC.player.knockUpForce(); //Clear Pregnancy
		}
		//Give birf if its time... to ANAL EGGS;
		if( CoC.player.buttPregnancyIncubation === 1 && CoC.player.buttPregnancyType === PregnancyStore.PREGNANCY_FROG_GIRL ) {
			SceneLib.frogGirlScene.birthFrogEggsAnal();
			displayedUpdate = true;
			CoC.player.buttKnockUpForce(); //Clear Butt Pregnancy
		}
		//Give birf if its time... to ANAL EGGS;
		if( CoC.player.buttPregnancyIncubation === 1 && CoC.player.buttPregnancyType === PregnancyStore.PREGNANCY_DRIDER_EGGS ) {
			SceneLib.corruptedDriderScene.birthSpiderEggsFromAnusITSBLEEDINGYAYYYYY();
			displayedUpdate = true;
			CoC.player.buttKnockUpForce(); //Clear Butt Pregnancy
		}
		//Bive birf to dragons;
		if( CoC.player.pregnancyIncubation === 1 && CoC.player.pregnancyType === PregnancyStore.PREGNANCY_EMBER ) {
			SceneLib.emberScene.giveBirthToEmberKids();
			displayedUpdate = true;
			CoC.player.knockUpForce(); //Clear Pregnancy
		}
		//GIVE BIRF TO TRAPS;
		if( CoC.player.buttPregnancyIncubation === 1 && CoC.player.buttPregnancyType === PregnancyStore.PREGNANCY_SANDTRAP_FERTILE ) {
			SceneLib.sandTrapScene.birfSandTarps();
			CoC.player.buttKnockUpForce(); //Clear Butt Pregnancy
			if( CoC.player.buttRating < 17 ) {
				//Guaranteed increase up to level 10;
				if( CoC.player.buttRating < 13 ) {
					CoC.player.buttRating++;
					EngineCore.outputText( '\nYou notice your ' + Descriptors.buttDescript() + ' feeling larger and plumper after the ordeal.\n', false );
				}
				//Big butts only increase 50% of the time.;
				else if( Utils.rand( 2 ) === 0 ) {
					CoC.player.buttRating++;
					EngineCore.outputText( '\nYou notice your ' + Descriptors.buttDescript() + ' feeling larger and plumper after the ordeal.\n', false );
				}
			}
			displayedUpdate = true;
		}
		//Give birth (if it's time) to beeeeeeez;
		if( CoC.player.buttPregnancyIncubation === 1 && CoC.player.buttPregnancyType === PregnancyStore.PREGNANCY_BEE_EGGS ) {
			EngineCore.outputText( '\n', false );
			EngineCore.outputText( 'There is a sudden gush of honey-colored fluids from your ass.  Before panic can set in, a wonderful scent overtakes you, making everything ok.  ', false );
			if( CoC.player.cockTotal() > 0 ) {
				EngineCore.outputText( 'The muzzy feeling that fills your head seems to seep downwards, making your equipment hard and tight.  ', false );
			}
			if( CoC.player.vaginas.length > 0 ) {
				EngineCore.outputText( 'Your ' + Descriptors.vaginaDescript( 0 ) + ' becomes engorged and sensitive.  ', false );
			}
			EngineCore.outputText( 'Your hand darts down to the amber, scooping up a handful of the sticky stuff.  You wonder what your hand is doing as it brings it up to your mouth, which instinctively opens.  You shudder in revulsion as you swallow the sweet-tasting stuff, your mind briefly wondering why it would do that.  The stuff seems to radiate warmth, quickly pushing those nagging thoughts away as you scoop up more.\n\n', false );
			EngineCore.outputText( 'A sudden slip from below surprises you; a white sphere escapes from your anus along with another squirt of honey.  Your drugged brain tries to understand what\'s happening, but it gives up, your hands idly slathering honey over your loins.  The next orb pops out moments later, forcing a startled moan from your mouth.  That felt GOOD.  You begin masturbating to the thought of laying more eggs... yes, that\'s what those are.  You nearly cum as egg number three squeezes out.  ', false );
			if( CoC.player.averageLactation() >= 1 && CoC.player.biggestTitSize() > 2 ) {
				EngineCore.outputText( 'Seeking even greater sensation, your hands gather the honey and massage it into your ' + Descriptors.breastDescript( 0 ) + ', slowly working up to your nipples.  Milk immediately begins pouring out from the attention, flooding your chest with warmth.  ', false );
			}
			EngineCore.outputText( 'Each egg seems to come out closer on the heels of the one before, and each time your conscious mind loses more of its ability to do anything but masturbate and wallow in honey.\n\n', false );
			EngineCore.outputText( 'Some time later, your mind begins to return, brought to wakefulness by an incredibly loud buzzing...  You sit up and see a pile of dozens of eggs resting in a puddle of sticky honey.  Most are empty, but a few have hundreds of honey-bees emptying from them, joining the massive swarms above you.  ', false );
			if( CoC.player.cor < 35 ) {
				EngineCore.outputText( 'You are disgusted, but glad you were not stung during the ordeal.  You stagger away and find a brook to wash out your mouth with.', false );
			}
			if( CoC.player.cor >= 35 && CoC.player.cor < 65 ) {
				EngineCore.outputText( 'You are amazed you could lay so many eggs, and while the act was strange there was something definitely arousing about it.', false );
			}
			if( CoC.player.cor >= 65 && CoC.player.cor < 90 ) {
				EngineCore.outputText( 'You stretch languidly, noting that most of the drugged honey is gone.  Maybe you can find the Bee again and remember to bottle it next time.', false );
			}
			if( CoC.player.cor >= 90 ) {
				EngineCore.outputText( 'You lick your lips, savoring the honeyed residue on them as you admire your thousands of children.  If only every night could be like this...\n', false );
			}
			CoC.player.buttKnockUpForce(); //Clear Butt Pregnancy
			CoC.player.orgasm();
			EngineCore.dynStats( 'int', 1, 'lib', 4, 'sen', 3 );
			if( CoC.player.buttChange( 20, true ) ) {
				EngineCore.outputText( '\n', false );
			}
			if( CoC.player.buttRating < 17 ) {
				//Guaranteed increase up to level 10;
				if( CoC.player.buttRating < 13 ) {
					CoC.player.buttRating++;
					EngineCore.outputText( '\nYou notice your ' + Descriptors.buttDescript() + ' feeling larger and plumper after the ordeal.', false );
				}
				//Big butts only increase 50% of the time.;
				else if( Utils.rand( 2 ) === 0 ) {
					CoC.player.buttRating++;
					EngineCore.outputText( '\nYou notice your ' + Descriptors.buttDescript() + ' feeling larger and plumper after the ordeal.', false );
				}
			}
			EngineCore.outputText( '\n', false );
			displayedUpdate = true;
		}
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_URTA && CoC.player.pregnancyIncubation === 1 ) {
			displayedUpdate = true;
			SceneLib.urtaPregs.PCGivesBirf();
			CoC.player.knockUpForce(); //Clear Pregnancy
		}
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_SAND_WITCH && CoC.player.pregnancyIncubation === 1 ) {
			displayedUpdate = true;
			SceneLib.dungeonSandWitch.birthAWitch();
			CoC.player.knockUpForce(); //Clear Pregnancy
		}
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_IZMA && CoC.player.pregnancyIncubation === 1 ) {
			displayedUpdate = true;
			//Located in izma.as!;
			SceneLib.izmaScene.pcPopsOutASharkTot();
			CoC.player.knockUpForce(); //Clear Pregnancy
		}
		//SPOIDAH BIRF;
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_SPIDER && CoC.player.pregnancyIncubation === 1 ) {
			CoC.player.knockUpForce(); //Clear Pregnancy
			displayedUpdate = true;
			SceneLib.maleSpiderMorphScene.spiderPregVagBirth();
		}
		//DRIDER BIRF;
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_DRIDER_EGGS && CoC.player.pregnancyIncubation === 1 ) {
			CoC.player.knockUpForce(); //Clear Pregnancy
			displayedUpdate = true;
			SceneLib.corruptedDriderScene.driderPregVagBirth();
		}
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_COTTON && CoC.player.pregnancyIncubation === 1 ) {
			CoC.player.knockUpForce(); //Clear Pregnancy
			displayedUpdate = true;
			SceneLib.cotton.birthingCottonsKids();
		}
		//GOO BIRF;
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_GOO_GIRL && CoC.player.pregnancyIncubation === 1 ) {
			CoC.player.knockUpForce(); //Clear Pregnancy
			displayedUpdate = true;
			SceneLib.gooGirlScene.gooPregVagBirth();
		}
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_BASILISK && CoC.player.pregnancyIncubation === 1 ) {
			CoC.player.knockUpForce(); //Clear Pregnancy
			displayedUpdate = true;
			SceneLib.basiliskScene.basiliskBirth();
		}
		//Satyr vag preg;
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_SATYR && CoC.player.pregnancyIncubation === 1 ) {
			CoC.player.knockUpForce(); //Clear Pregnancy
			displayedUpdate = true;
			SceneLib.satyrScene.satyrBirth( true );
		}
		//Satyr butt preg;
		if( CoC.player.buttPregnancyType === PregnancyStore.PREGNANCY_SATYR && CoC.player.buttPregnancyIncubation === 1 ) {
			CoC.player.buttKnockUpForce(); //Clear Butt Pregnancy
			displayedUpdate = true;
			SceneLib.satyrScene.satyrBirth( false );
		}
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_BENOIT && CoC.player.pregnancyIncubation <= 2 ) {
			if( CoC.time.hours !== 5 && CoC.time.hours !== 6 ) {
				CoC.player.knockUpForce( CoC.player.pregnancyType, 3 ); //Make sure eggs are only birthed early in the morning
			} else {
				CoC.player.knockUpForce(); //Clear Pregnancy
				displayedUpdate = true;
				SceneLib.benoit.popOutBenoitEggs();
			}
		}
		//Give birf if its time... to FROG EGGS;
		if( CoC.player.pregnancyIncubation === 1 && CoC.player.pregnancyType === PregnancyStore.PREGNANCY_FROG_GIRL ) {
			SceneLib.frogGirlScene.layFrogEggs();
			displayedUpdate = true;
			CoC.player.knockUpForce(); //Clear Pregnancy
		}
		//BASILISK BIRF;
		//Bunbun birfs;
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_BUNNY && CoC.player.pregnancyIncubation === 1 ) {
			EngineCore.outputText( '\n', false );
			displayedUpdate = true;
			if( CoC.player.vaginas.length === 0 ) {
				EngineCore.outputText( 'You feel a terrible pressure in your groin... then an incredible pain accompanied by the rending of flesh.  You look down and behold a vagina.  ', false );
				CoC.player.createVagina();
				CoC.player.genderCheck();
			}
			EngineCore.outputText( 'A dangerous rumble comes from your womb, signaling that it\'s time to birth your body\'s cargo at last.  Your ' + CoC.player.legs() + ' wobble unsteadily as your strength ebbs with every gush that erupts  from your now-broken water until you collapse on your ' + Descriptors.buttDescript() + ', grunting and groaning.  At first it goes slow – there\'s just a few small contractions that are more strange than anything else, rippling down your ' + Descriptors.vaginaDescript( 0 ) + ' and squirting out more of your pregnancy\'s fluid.  All too soon the tempo kicks up, and you feel something starting to stretch you wider and wider.\n\n', false );
			EngineCore.outputText( 'You heave and push, instinctively driven to flex muscles you didn\'t even know you had to speed the super human labor you\'ve entered into.  ', false );
			if( CoC.player.vaginalCapacity() < 60 ) {
				EngineCore.outputText( 'It hurts a little as your cervix starts to stretch wide', false );
			} else {
				EngineCore.outputText( 'It actually feels kind of nice as your cervix is stretched wide', false );
			}
			EngineCore.outputText( ', but somehow your body accommodates the forced dilation without too much discomfort.  It\'s soon forgotten as you feel your ' + Descriptors.vaginaDescript( 0 ) + ' pushed into a large sphere, stretched around the inhuman form of your child as it squirms and writhes inside you on its path to freedom.  You grunt and flex, watching with disbelief as a tiny, rabbit-eared form slides from your slick canal into the grass, the process leaving your ' + Descriptors.chestDesc() + ' heaving with unexpected pleasure.\n\n', false );
			EngineCore.outputText( 'The whole process starts over again – there\'s another one!  By now your well-stretched pussy is oozing both the birthing fluids and your own lubricants, and the second bunny-child slides down to bump into its sibling with ease.  You shake and shudder, groaning and spasming as you nearly cum from the stimulation, but in the end you\'re left panting and horny.  The two bunnies look like miniature people except for their ears, tails, and fuzzy legs.  Your children lick themselves clean before hopping up onto your ' + Descriptors.chestDesc() + ' and suckling your nipples for a while', false );
			if( CoC.player.lactationQ() > 500 ) {
				EngineCore.outputText( ', growing fat from all the milk', false );
			}
			EngineCore.outputText( '.  At last they finish, and with one last nuzzle, your strange bunny-children go hopping off, doubtless to find more of their own kind.\n\n', false );
			EngineCore.outputText( 'You sink into restful unconsciousness, marveling at how stretchy and sensitive your ' + Descriptors.vaginaDescript( 0 ) + ' feels now.', false );
			CoC.player.cuntChange( 60, true, true, false );
			CoC.player.boostLactation( 0.01 );
			//Boost capacity;
			if( CoC.player.vaginalCapacity() < 300 ) {
				if( CoC.player.findStatusAffect( StatusAffects.BonusVCapacity ) < 0 ) {
					CoC.player.createStatusAffect( StatusAffects.BonusVCapacity, 0, 0, 0, 0 );
				}
				CoC.player.addStatusValue( StatusAffects.BonusVCapacity, 1, 10 );
			}
			CoC.player.knockUpForce(); //Clear Pregnancy
			CoC.player.orgasm();
			EngineCore.dynStats( 'lib', 1, 'sen', 10, 'cor', -2 );
		}
		//Anemone birfs;
		//Anemone Pregnancy;
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_ANEMONE && CoC.player.pregnancyIncubation === 1 ) {
			EngineCore.outputText( '\n', false );
			displayedUpdate = true;
			if( CoC.player.vaginas.length === 0 ) {
				EngineCore.outputText( 'You feel a terrible pressure in your groin... then an incredible pain accompanied by the rending of flesh.  You look down and behold a vagina.  ', false );
				CoC.player.createVagina();
				CoC.player.genderCheck();
			}
			EngineCore.outputText( 'Your ' + CoC.player.armorName + ' feels damp around the groin and you reach down to check the area.  The  ' + Descriptors.vaginaDescript( 0 ) + ' you feel is dilated and slick with unusual wetness; your water must have broken!\n\n', false );
			EngineCore.outputText( 'Hurriedly you strip off your gear and sit down with your back against a rock.  Focusing yourself, you attempt to prepare for labor; you try to remember your recent partners and worry about what kind of monstrous infant you might have to force out of your ' + Descriptors.vaginaDescript( 0 ) + '.  The first contraction comes and you push as hard as you can, to be rewarded with the feeling of something sliding out between your labia.  You attempt a few more pushes but nothing further seems forthcoming; curious, you look down at your crotch only to discover a blue stalk sticking proudly out of your vagina!\n\n', false );
			if( CoC.flags[ kFLAGS.ANEMONE_KID ] > 0 ) {
				EngineCore.outputText( 'As you take in the sight, small nodules around the tip begin to form and lengthen, until the little anemone is capped by a mop of wriggling blue-green tentacles.  Horrified, you grasp it at the base and give it a sharp pull.  The pain makes you lock up and nearly takes away your consciousness as its sticky surface releases its grip on your labia and ' + Descriptors.clitDescript() + '!   It writhes and slips out of your pain-wracked hands, leaving them tingling.  As you lie there, stunned, it begins to inch back toward your ' + Descriptors.vaginaDescript( 0 ) + '.  Footfalls sound next to you, and a blue hand picks up the squirming, cilliated creature.  Kid A gives you a shy smile, then turns to her barrel.  A quick splash and a filled waterskin later, she heads toward the stream, toting your grub-like offspring.' );
				CoC.player.cuntChange( 20, true, true, false );
				EngineCore.outputText( '\n\nExhausted by the birth but with a burden lifted from your mind, you slip into a grateful doze.' );
				CoC.player.knockUpForce(); //Clear Pregnancy
				return true;
			} else if( CoC.player.anemoneCocks() > 0 && CoC.player.cor < 25 && CoC.flags[ kFLAGS.ANEMONE_KID ] === 0 ) {
				EngineCore.outputText( 'As you take in the sight, small nodules around the tip begin to form and lengthen, until the little anemone is capped by a mop of wriggling blue-green tentacles.  Horrified, you grasp it at the base and give it a sharp pull.  The ensuing pain in your labia and ' + Descriptors.clitDescript() + ' makes you lock up and nearly takes away your consciousness, and with ' + CoC.player.multiCockDescript() + ' in the way, you can\'t get any leverage on the pull at all!  The anemone detaches weakly, but writhes and slips out of your pain-wracked grip, leaving your hands tingling.  As you lie there, stunned, it begins to inch back toward your ' + Descriptors.vaginaDescript( 0 ) + '.  Searching about weakly with the feelers, it touches along your thigh and searches out the entrance of your pussy.  When the tentacled crown brushes past your lips a venomous heat stirs your crotch and fills you with energy; shocked into sense, you look at the absurd creature.  You raise your arm to slap at it, but something stays your hand.  As if sensing your hesitation, it stands upright and holds itself at attention for inspection.  It would be easy to knock it away... and yet, the unprepossessing little thing looks so proud that you can\'t quite bring yourself to do so.' );
				EngineCore.outputText( '\n\nYou scoop the diminutive anemone up and look around for somewhere wet to put it.  The stream is too far, the lake doubly so; you\'d never make it to either, as sick as you feel from yanking viciously on your clitoris.  Driven to last resorts, you lurch over to the water barrel in your camp and, wrenching the lid off, drop the blue stalk unceremoniously inside.  Exhausted by the shock and pain of the ordeal, you slump down beside the barrel and slip into a doze...' );
				CoC.player.cuntChange( 20, true, true, false );
				EngineCore.outputText( '\n' );
				CoC.player.createStatusAffect( StatusAffects.CampAnemoneTrigger, 0, 0, 0, 0 );
				CoC.player.knockUpForce(); //Clear Pregnancy
				return true;
			}
			//[(if pc has 0-9 existing cocks);
			else if( CoC.player.cockTotal() < 10 ) {
				EngineCore.outputText( 'As you take in the sight, small nodules around the tip begin to form and lengthen, until the little anemone is capped by a mop of wriggling blue-green tentacles.  Horrified, you grasp it at the base and give it a sharp pull.  The pain makes you lock up and nearly takes away your consciousness as its sticky surface releases its grip on your labia and ' + Descriptors.clitDescript() + '!  The small anemone and you both lay there twitching, but it recovers its bearings first; through your haze of pain you watch it flexing its body, wedging the head under itself, and elevating the base.', false );
				CoC.player.cuntChange( 20, true, true, false );
				EngineCore.outputText( '\n\nBeset by a panic, you watch as the strange thing sets butt-end down on your pubic mound and adheres', false );
				//[(if cocks);
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( ' below your ' + CoC.player.multiCockDescriptLight(), false );
				}
				EngineCore.outputText( '. A sharp pinch lances through the nerves in your groin and sends your hands to it reflexively.  This smaller pain, coupled with the adrenaline and dopamine that have finally chased the fog from your head, is enough to pull your thoughts into focus for another attempt to remove your strange, parasitic offspring.  You shift your grip and pull a few more times, but the thing doesn\'t budge.  The handling of it only serves to make the stalk thicken and become stiff; gradually you notice that you\'re feeling the sensation of your own pulling not from the skin at the point of attachment but from the stalk itself, and this realization is accompanied by the ring of tentacles opening and pulling back to reveal the crown of a penis!  <b>You have a new anemone-penis!</b>', false );
				//[(dick slot 1 exists);
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( '  The tentacles writhe around, rubbing against your ' + CoC.player.multiCockDescriptLight(), false );
				}//(doesn't exist);
				else {
					EngineCore.outputText( '  The tentacles curl inwards, rubbing on the head of your new blue pecker', false );
				}
				CoC.player.createCock( (4 + Utils.rand( 3 )), 1.2 );
				CoC.player.cocks[ CoC.player.cockTotal() - 1 ].cockType = CockTypesEnum.ANEMONE;
				EngineCore.outputText( ' and you quickly become fully erect from the aphrodisiac they inject.  Over and over the tentacles caress ' + CoC.player.sMultiCockDesc() + ' sensually, leaving behind a tingling trail of vibrant pleasure', false );
				//[(if no dick1 and no balls);
				if( CoC.player.totalCocks() === 1 && CoC.player.balls === 0 ) {
					EngineCore.outputText( '; you feel a pressure build below the shaft, near your asshole', false );
				}
				EngineCore.outputText( '.  As the venom and the rubbing work you to the edge of climax, your muscles clench and a ', false );
				if( CoC.player.cumQ() < 100 ) {
					EngineCore.outputText( 'glob', false );
				} else if( CoC.player.cumQ() < 500 ) {
					EngineCore.outputText( 'squirt', false );
				} else {
					EngineCore.outputText( 'spray', false );
				}
				EngineCore.outputText( ' of semen shoots from your new penis and lands on your ', false );
				//[(if boobs);
				if( CoC.player.biggestTitSize() >= 1 ) {
					EngineCore.outputText( Descriptors.allBreastsDescript() + ' and ', false );
				}
				EngineCore.outputText( 'stomach', false );
				//[(dick1 exists);
				if( CoC.player.cockTotal() > 1 ) {
					EngineCore.outputText( ', followed in short order by white squirts from ' + CoC.player.sMultiCockDesc() + ' remaining', false );
				}
				EngineCore.outputText( '.  Your ' + Descriptors.vaginaDescript( 0 ) + ' quivers and pulses as well, adding ', false );
				if( CoC.player.vaginas[ 0 ].vaginalWetness < AppearanceDefs.VAGINA_WETNESS_SLICK ) {
					EngineCore.outputText( 'a trickle', false );
				} else if( CoC.player.vaginas[ 0 ].vaginalWetness < AppearanceDefs.VAGINA_WETNESS_SLAVERING ) {
					EngineCore.outputText( 'a squirt', false );
				} else {
					EngineCore.outputText( 'nearly a cupful of fluid', false );
				}
				EngineCore.outputText( ' from your female orgasm to the puddle on the ground below your ass.\n\n', false );
				//(gain 1 nemo-dick, reduce lust to min)];
				CoC.player.genderCheck();
				CoC.player.orgasm();
				EngineCore.dynStats( 'lib', 2, 'sen', 5 );
			}
			//[(if PC has 10 existing cocks) && no kid;
			else {
				EngineCore.outputText( 'As you take in the sight, small nodules around the tip begin to form and lengthen, until the little anemone is capped by a mop of wriggling blue-green tentacles.  Horrified, you grasp it at the base and give it a sharp pull.  The ensuing pain in your labia and ' + Descriptors.clitDescript() + ' makes you lock up and nearly takes away your consciousness, robbing your pull of force.  The anemone detaches weakly, but writhes and slips out of your pain-wracked grip, leaving your hands tingling.  As you lie there, stunned, it begins to inch back toward your ' + Descriptors.vaginaDescript( 0 ) + '.  Casting about with the feelers, it touches along your thigh and searches out the entrance of your pussy.  When the tentacled crown brushes past your lips a venomous heat stirs your crotch and fills you with energy; renewed, you slap at it, trying to knock the little creature away.  Several weak hits land on it, and, almost as if irritated, the tentacles seize on your labia and pull the stalk back toward your crotch and thence into your pussy.  Next you feel the thing shift and flatten itself against your insides, then a pinch on your vaginal walls where the little anemone presses on them.  This can\'t be good.' );
				CoC.player.cuntChange( 20, true, true, false );
				//OLD TXToutputText('The anemone writhes and slips out of your pain-wracked grip, leaving your hands tingling.  As you lie there, stunned, it begins to inch back into your ' + Descriptors.vaginaDescript(0)+ '.  As the tentacled crown brushes past your lips a venomous heat fills your crotch - you feel the thing shift and flatten itself against your insides, then a pinch on your vaginal walls where the little anemone was pressing on them.  This can\'t be good.\n\n', false);;
				EngineCore.outputText( '\n\nPush as you might, you can\'t get it to peek back out even the slightest bit.  What\'s worse, the heat isn\'t subsiding, as the tentacles are now lodged inside your pussy!  Prodding and pulling at your ' + Descriptors.vaginaDescript( 0 ) + ' is only worsening the effect; ' + CoC.player.sMultiCockDesc() + ' and your clitoris harden as you attempt to retrieve your invader.  Your probes get weaker and weaker as your vagina spasms to each stroke of your insides; each time you touch the creature, the sensation is being transmitted right back to your nerves.  Eventually you push yourself to accidental orgasm; your ' + Descriptors.vaginaDescript( 0 ) + ' quivers around your fingers and your ' + CoC.player.multiCockDescriptLight() + ' does the best ejaculation it can manange with hardly any warmup time and no direct stimulation.  Even after the orgasm ends, the tentacles continue to torment your groin.  <b>You are VERY horny with this thing inside you... though you can\'t reach it, maybe there\'s a way to crowd it out?</b>\n\n', false );
				//(reduce lust to min, increased minimum lust by 30 until halfway through PC's next pregnancy)];
				CoC.player.orgasm();
				EngineCore.dynStats( 'lib', 2, 'sen', 5 );
				if( CoC.player.findStatusAffect( StatusAffects.AnemoneArousal ) < 0 ) {
					CoC.player.createStatusAffect( StatusAffects.AnemoneArousal, 0, 0, 0, 0 );
				}
			}
			CoC.player.knockUpForce(); //Clear Pregnancy
			EngineCore.outputText( 'Exhausted by the \'birth\' and the climax, you slip into a doze.\n', false );
		}
		//Give birth if it's time (to an imp!);
		if( CoC.player.pregnancyIncubation === 1 && CoC.player.pregnancyType === PregnancyStore.PREGNANCY_IMP ) {
			EngineCore.outputText( '\n', false );
			//Add imp birth status - used to control frequency of night imp gangbag;
			if( CoC.player.findStatusAffect( StatusAffects.BirthedImps ) >= 0 ) {
				CoC.player.addStatusValue( StatusAffects.BirthedImps, 1, 1 );
			} else {
				CoC.player.createStatusAffect( StatusAffects.BirthedImps, 1, 0, 0, 0 );
			}
			if( CoC.player.vaginas.length === 0 ) {
				EngineCore.outputText( 'You feel a terrible pressure in your groin... then an incredible pain accompanied by the rending of flesh.  You look down and behold a vagina.  ', false );
				CoC.player.createVagina();
				CoC.player.genderCheck();
			}
			EngineCore.outputText( 'A sudden gush of fluids erupts from your vagina - your water just broke.  You grunt painfully as you feel wriggling and squirming inside your belly, muscle contractions forcing it downwards.  ', false );
			if( CoC.player.cor < 50 ) {
				EngineCore.outputText( 'You rue the day you encountered that hateful imp.  ', false );
			}
			EngineCore.outputText( 'The pain begins to subside as your delivery continues... replaced with a building sensation of pleasure.  Arousal spikes through you as the contractions intensify, and as you feel something pass you have a tiny orgasm.\n\nYet you feel more within you, and the contractions spike again, pushing you to orgasm as you pass something else.  It repeats, over and over, nearly a dozen times you birth and orgasm.  After an eternity of procreation and pleasure, you sense your ordeal is over and collapse, unconscious.', false );

			if( CoC.player.vaginas[ 0 ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_TIGHT ) {
				CoC.player.vaginas[ 0 ].vaginalLooseness++;
			}
			//50% chance;
			if( CoC.player.vaginas[ 0 ].vaginalLooseness < AppearanceDefs.VAGINA_LOOSENESS_GAPING_WIDE && Utils.rand( 2 ) === 0 ) {
				CoC.player.vaginas[ 0 ].vaginalLooseness++;
				EngineCore.outputText( '\n\n<b>Your cunt is painfully stretched from the ordeal, permanently enlarged.</b>', false );
			}
			CoC.player.knockUpForce(); //Clear Pregnancy
			EngineCore.outputText( '\n\nWhen you wake you find a large number of tiny imp tracks... and a spattering of cum on your clothes and body.  They must be born fully-formed.', false );
			if( CoC.player.averageLactation() > 0 && CoC.player.averageLactation() < 5 ) {
				EngineCore.outputText( '  Your breasts won\'t seem to stop dribbling milk, lactating more heavily than before.', false );
				CoC.player.boostLactation( 0.5 );
			}
			//Lactate if large && not lactating;
			if( CoC.player.biggestTitSize() >= 3 && CoC.player.mostBreastsPerRow() > 1 && CoC.player.averageLactation() === 0 ) {
				EngineCore.outputText( '  As you ponder the implications, <b>you realize your breasts have been slowly lactating</b>.  You wonder how much longer it will be before they stop.', false );
				CoC.player.boostLactation( 1 );
			}
			CoC.player.boostLactation( 0.01 );
			//Enlarge if too small for lactation;
			if( CoC.player.biggestTitSize() === 2 && CoC.player.mostBreastsPerRow() > 1 ) {
				EngineCore.outputText( '  <b>Your breasts have grown to C-cups!</b>', false );
				CoC.player.growTits( 1, 1, false, 3 );
			}
			//Enlarge if really small!;
			if( CoC.player.biggestTitSize() === 1 && CoC.player.mostBreastsPerRow() > 1 ) {
				EngineCore.outputText( '  <b>Your breasts have grown to B-cups!</b>', false );
				CoC.player.growTits( 1, 1, false, 3 );
			}
			if( CoC.player.vaginas[ 0 ].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_DRY ) {
				CoC.player.vaginas[ 0 ].vaginalWetness++;
			}
			if( CoC.player.gender === 1 ) {
				CoC.player.gender = 3;
			}
			if( CoC.player.gender === 0 ) {
				CoC.player.gender = 2;
			}
			CoC.player.orgasm();
			EngineCore.dynStats( 'tou', -2, 'spe', 2, 'lib', 1, 'sen', 0.5, 'cor', 7 );
			if( CoC.player.buttRating < 10 && Utils.rand( 2 ) === 0 ) {
				CoC.player.buttRating++;
				EngineCore.outputText( '\n\nYou notice your ' + Descriptors.buttDescript() + ' feeling larger and plumper after the ordeal.', false );
			} else if( CoC.player.hipRating < 10 ) {
				CoC.player.hipRating++;
				EngineCore.outputText( '\n\nAfter the birth your ' + CoC.player.armorName + ' fits a bit more snugly about your ' + Descriptors.hipDescript() + '.', false );
			}
			EngineCore.outputText( '\n', false );
			displayedUpdate = true;
		}
		//Give birth if it's time (to a cowgirl!);
		if( CoC.player.pregnancyIncubation === 1 && CoC.player.pregnancyType === PregnancyStore.PREGNANCY_MARBLE ) {
			CoC.player.knockUpForce(); //Clear Pregnancy
			CoC.player.boostLactation( 0.01 );
			if( CoC.player.vaginas.length === 0 ) {
				EngineCore.outputText( '\nYou feel a terrible pressure in your groin... then an incredible pain accompanied by the rending of flesh.  You look down and behold a vagina.\n', false );
				CoC.player.createVagina();
				CoC.player.genderCheck();
			}
			//If you like terrible outcomes;
			if( CoC.flags[ kFLAGS.MARBLE_NURSERY_CONSTRUCTION ] < 100 ) {
				EngineCore.outputText( '\nYou feel a clenching sensation in your belly and something shifts inside.  Your contractions start a few moments later and you realize that it\'s time for your child to be born.  You cry out mildly in pain and lie down, letting your body start to push the baby out.  Marble doesn\'t seem to be around right now, so you can do nothing but push.\n\n', false );
				EngineCore.outputText( 'You push and heave with all your might, little else going through your mind. You somehow register when the head comes out, and soon the shoulders along with the rest of the body follow.  You lean back and pant for a while before feeling a pair of hands grab a hold of you. They slowly and clumsily feel up your body before finding your ' + CoC.player.chestDesc() + ' and a mouth quickly closes down on a ' + Descriptors.nippleDescript( 0 ) + '.  You sigh softly, and drift off to sleep.', false );
				CoC.player.cuntChange( 20, true, true, false );
				EngineCore.outputText( '\n\nEventually you feel a hand on your face, and open your eyes to see Marble looking down at you.  "<i>Sweetie, are you all right?  Why aren\'t you pregnant anymore?  Where is our child?</i>" You stand up and look around.  There is no sign of the baby you were carrying; the child seems to have left after finishing its drink. You never even got to see its face...\n\n', false );
				EngineCore.outputText( 'Marble seems to understand what happened, but is really disappointed with you, "<i>Sweetie, why couldn\'t you wait until after I\'d finished the nursery...?</i>"', false );
				//Increase PC's hips as per normal, add to birth counter;
			} else {
				EngineCore.outputText( '\nYou feel a clenching sensation in your belly and something shifts inside.  Your contractions start a few moments later and you realize that it\'s time for your child to be born.  You cry out mildly in pain and lie down, letting your body start to push the baby out.  Marble rushes over and sees that it\'s time for you to give birth, so she picks you up and supports you as you continue pushing the child out of your now-gaping ' + Descriptors.vaginaDescript( 0 ) + '.', false );
				//50% chance of it being a boy if Marble has been purified;
				if( CoC.flags[ kFLAGS.MARBLE_PURIFIED ] > 0 && Utils.rand( 2 ) === 0 )
				//it's a boy!;
				{
					EngineCore.outputText( '\n\nFor the next few minutes, you can’t do much else but squeeze the large form inside your belly out.  Marble tries to help a little, pulling your nether lips open even further to make room for the head.  You gasp as you push the head out, and you hear Marble give a little cry of joy.  "<i>It’s a son of mine!</i>" she tells you, but you can barely hear her due to the focus you’re putting into the task of bringing this child out.', false );
					EngineCore.outputText( '\n\nYou give an almighty heave and finally manage to push the shoulders out. The rest is downhill from there.  Once you’ve pushed the child completely out, Marble lays you down on the ground.  You rest there for a few moments, trying to catch your breath after the relatively difficult birthing.  When you finally have a chance to get up, you see that Marble has a small bull boy cradled in her arms, suckling on her nipple.  You can hardly believe that you managed to push out a boy that big!  Marble seems to understand and tells you that the child is actually a fair bit bigger now than when he came out.', false );
					EngineCore.outputText( '\n\nShe helps you stand up and gives you the little boy to suckle for yourself.', false );
					EngineCore.outputText( '\n\nYou put the child to your breast and let him drink down your milk.  You sigh in contentment and Marble says, "<i>See sweetie?  It’s a really good feeling, isn’t it?</i>"  You can’t help but nod in agreement.  After a minute the little boy has had enough and you put him into the nursery.', false );
					EngineCore.outputText( 'The little boy is already starting to look like he is a few years old; he’s trotting around on his little hoofs.', false );
					//Increase the size of the PC’s hips, as per normal for pregnancies, increase birth counter;
					if( CoC.player.hipRating < 10 ) {
						CoC.player.hipRating++;
						EngineCore.outputText( 'After the birth your ' + CoC.player.armorName + ' fits a bit more snugly about your ' + Descriptors.hipDescript() + '.', false );
					}
					if( CoC.flags[ kFLAGS.MARBLE_BOYS ] === 0 )
					//has Marble had male kids before?;
					{
						EngineCore.outputText( 'You notice that Marble seems to be deep in thought, and you ask her what is wrong.  She starts after a moment and says, "<i>Oh sweetie, no, it\'s nothing really.  I just never thought that I\'d actually be able to father a son is all.  The thought never occurred to me.', false );
					}
					//Add to marble-kids:;
					CoC.flags[ kFLAGS.MARBLE_KIDS ]++;
					CoC.flags[ kFLAGS.MARBLE_BOYS ]++; //increase the number of male kids with Marble
				} else {
					// end of new content
				}
				//it's a girl!;
				{
					CoC.player.cuntChange( 20, true, true, false );
					EngineCore.outputText( '\n\nFor the next few minutes, you can\'t do much else but squeeze the large form inside your belly out.  Marble tries to help a little, pulling your nether lips open even further to make room for the head.  You gasp as you push the head out, and you hear Marble give a little cry of joy.  "<i>It\'s a daughter of mine!</i>" she tells you, but you can barely hear her due to the focus you\'re putting into the task of bringing this child out.\n\n', false );
					EngineCore.outputText( 'You give an almighty heave and finally manage to push the shoulders out. The rest is downhill from there.  Once you\'ve pushed the child completely out, Marble lays you down on the ground.  You rest there for a few moments, trying to catch your breath after the relatively difficult birthing.  When you finally have a chance to get up, you see that Marble has a small cowgirl cradled in her arms, suckling on her nipple.  You can hardly believe that you managed to push out a girl that big!  Marble seems to understand and tells you that the child is actually a fair bit bigger now than when she came out.\n\n', false );
					EngineCore.outputText( 'She helps you stand up and gives you the little girl to suckle for yourself.  ', false );
					if( CoC.player.statusAffectv4( StatusAffects.Marble ) >= 20 ) {
						EngineCore.outputText( 'As the child contentedly drinks from your ' + Descriptors.nippleDescript( 0 ) + ', Marble tells you, "<i>Sweetie, somehow I know that our kids won\'t have to worry about the addictive milk.  It will only make them healthy and strong.</i>"  You nod at her and put the child into the nursery.  ', false );
					} else {
						EngineCore.outputText( 'You put the child to your breast and let her drink down your milk.  You sigh in contentment and Marble says, "<i>See sweetie?  It\'s a really good feeling, isn\'t it?</i>"  You can\'t help but nod in agreement.  After a minute the little girl has had enough and you put her into the nursery.\n\n', false );
					}
					EngineCore.outputText( 'The little girl is already starting to look like she is a few years old; she\'s trotting around on her little hooves.', false );
					//Add to marble-kids:;
					CoC.flags[ kFLAGS.MARBLE_KIDS ]++;
				}
				//Increase the size of the PC's hips, as per normal for pregnancies, increase birth counter;
				if( CoC.player.hipRating < 10 ) {
					CoC.player.hipRating++;
					EngineCore.outputText( '\n\nAfter the birth your ' + CoC.player.armorName + ' fits a bit more snugly about your ' + Descriptors.hipDescript() + '.', false );
				}
			}
			EngineCore.outputText( '\n', false );
			displayedUpdate = true;
		}
		//Give birth if it's time (to a minotaur!);
		if( CoC.player.pregnancyIncubation === 1 && CoC.player.pregnancyType === PregnancyStore.PREGNANCY_MINOTAUR ) {
			if( CoC.player.vaginas.length === 0 ) {
				EngineCore.outputText( '\nYou feel a terrible pressure in your groin... then an incredible pain accompanied by the rending of flesh.  <b>You look down and behold a new vagina</b>.\n', false );
				CoC.player.createVagina();
				CoC.player.genderCheck();
			}
			CoC.player.boostLactation( 0.01 );
			//Main Text here;
			EngineCore.outputText( '\nYou wake up suddenly to strong pains and pressures in your gut. As your eyes shoot wide open, you look down to see your belly absurdly full and distended. You can feel movement underneath the skin, and watch as it bulges and shifts as another living being moves independently inside you. Instinctively, you spread your legs as you feel the creature press outward, parting your cervix.\n\nYou try to push with your vaginal muscles, but you feel the creature moving more of its own volition. Your lips part as a pair of black-furred hands grip your vulva and begin to spread them and pull. You cry out in agony as your hips are widened forcefully by the passing mass of the being exiting your womb. A bovine face appears, mercifully lacking in horns. Shoulders follow, muscles already rippling on the newborn\'s form. A thick barrel chest follows, narrow, masculine hips and powerful bovine legs and hooves.\n\nFinally the worst is over as the toddler-sized minotaur gets to his feet, apparently already able to stand and walk.  He clops around your legs and over to your upper body, and takes hold of one of your milk-swollen breasts. He wraps his bestial lips around your nipple and begins to suckle, relieving the pressure on the milk-swollen jug.\n\n', false );
			EngineCore.outputText( 'He suckles and suckles and suckles, leaving you to wonder just how much milk you were actually holding, but even as you wonder this, your eyes grow wide as the newborn minotaur begins to grow. He gains inches at a time, his horns starting to grow from his skull, his muscles rippling and thickening, his cock lengthening, his balls swelling. He reaches four feet tall, but keeps growing, soon then five feet tall, starting to resemble more and more the monster who sired him. Finally, he pulls off your breasts, and finishes his milk-inspired growth spurt at six feet tall, looking practically full grown. His one gesture of gratitude for being brought into the world is a slobbery lick at your cheek, then he turns and runs off towards the mountain, leaving you to recover from the ordeal.  You swiftly pass out.\n\n', false );
			CoC.player.knockUpForce(); //Clear Pregnancy
			if( CoC.player.averageLactation() > 0 && CoC.player.averageLactation() < 5 ) {
				EngineCore.outputText( 'Your breasts won\'t seem to stop dribbling milk, lactating more heavily than before.', false );
				CoC.player.boostLactation( 1 );
			}
			CoC.player.cuntChange( 120, true, true, false );
			if( CoC.player.vaginas[ 0 ].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_DRY ) {
				CoC.player.vaginas[ 0 ].vaginalWetness++;
			}
			if( CoC.player.gender === 1 ) {
				CoC.player.gender = 3;
			}
			if( CoC.player.gender === 0 ) {
				CoC.player.gender = 2;
			}
			CoC.player.orgasm();
			EngineCore.dynStats( 'str', -1, 'tou', -2, 'spe', 3, 'lib', 1, 'sen', 0.5 );
			displayedUpdate = true;
			//Hip and butt increase;
			if( CoC.player.buttRating < 12 && Utils.rand( 2 ) === 0 ) {
				CoC.player.buttRating++;
				EngineCore.outputText( '\n\nYou notice your ' + Descriptors.buttDescript() + ' feeling larger and plumper after the ordeal.', false );
			} else if( CoC.player.hipRating < 15 ) {
				CoC.player.hipRating++;
				EngineCore.outputText( '\n\nAfter the birth your ' + CoC.player.armorName + ' fits a bit more snugly about your ' + Descriptors.hipDescript() + '.', false );
			}
			CoC.player.knockUpForce(); //Clear Pregnancy
			EngineCore.outputText( '\n', false );
			//326 Number of sons grown;
			//327 Number of sons pending;
			//328 growup countdown;
			CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00327 ]++;
			if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00328 ] === 0 ) {
				CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00328 ] = 150;
			}
		}
		//Amily failsafe - converts PC with pure babies to mouse babies if Amily is corrupted;
		if( CoC.player.pregnancyIncubation === 1 && CoC.player.pregnancyType === PregnancyStore.PREGNANCY_AMILY ) {
			if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 2 || CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00170 ] > 0 ) {
				CoC.player.knockUpForce( PregnancyStore.PREGNANCY_MOUSE, CoC.player.pregnancyIncubation );
			}
		}
		//Amily failsafe - converts PC with pure babies to mouse babies if Amily is with Urta;
		if( CoC.player.pregnancyIncubation === 1 && CoC.player.pregnancyType === PregnancyStore.PREGNANCY_AMILY ) {
			if( CoC.flags[ kFLAGS.AMILY_VISITING_URTA ] === 1 || CoC.flags[ kFLAGS.AMILY_VISITING_URTA ] === 2 ) {
				CoC.player.knockUpForce( PregnancyStore.PREGNANCY_MOUSE, CoC.player.pregnancyIncubation );
			}
		}
		//Give birth if it's time (to an AMILY BITCH mouse!);
		if( CoC.player.pregnancyIncubation === 1 && CoC.player.pregnancyType === PregnancyStore.PREGNANCY_AMILY ) {
			CoC.player.boostLactation( 0.01 );
			EngineCore.outputText( '\n', false );
			if( CoC.player.vaginas.length === 0 ) {
				EngineCore.outputText( 'You feel a terrible pressure in your groin... then an incredible pain accompanied by the rending of flesh.  <b>You look down and behold a new vagina</b>.  ', false );
				CoC.player.createVagina();
				CoC.player.genderCheck();
			}
			//FUCKING BIRTH SHIT HERE.;
			SceneLib.amilyScene.pcBirthsAmilysKidsQuestVersion();
			CoC.player.cuntChange( 60, true, true, false );
			if( CoC.player.vaginas[ 0 ].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_DRY ) {
				CoC.player.vaginas[ 0 ].vaginalWetness++;
			}
			CoC.player.orgasm();
			EngineCore.dynStats( 'str', -1, 'tou', -2, 'spe', 3, 'lib', 1, 'sen', 0.5 );
			displayedUpdate = true;
			EngineCore.outputText( '\n', false );
			CoC.player.knockUpForce(); //Clear Pregnancy
		}
		//Give birth if it's time (to a mouse!);
		if( CoC.player.pregnancyIncubation === 1 && (CoC.player.pregnancyType === PregnancyStore.PREGNANCY_MOUSE || CoC.player.pregnancyType === PregnancyStore.PREGNANCY_JOJO) ) {
			CoC.player.boostLactation( 0.01 );
			EngineCore.outputText( '\nYou wake up suddenly to strong pains and pressures in your gut. As your eyes shoot wide open, you look down to see your belly absurdly full and distended. You can feel movement underneath the skin, and watch as it is pushed out in many places, roiling and squirming in disturbing ways. The feelings you get from inside are just as disconcerting. You count not one, but many little things moving around inside you. There are so many, you can\'t keep track of them.\n\n', false );
			if( CoC.player.vaginas.length === 0 ) {
				EngineCore.outputText( 'You feel a terrible pressure in your groin... then an incredible pain accompanied by the rending of flesh.  <b>You look down and behold a new vagina</b>.  ', false );
				CoC.player.createVagina();
				CoC.player.genderCheck();
			}
			//Main Text here;
			EngineCore.outputText( 'Pain shoots through you as they pull open your cervix forcefully. You grip the ground and pant and push as the pains of labor overwhelm you. You feel your hips being forceably widened by the collective mass of the creatures moving down your birth canal. You spread your legs wide, laying your head back with groans and cries of agony as little white figures begin to emerge from between the lips of your abused pussy. Large innocent eyes, even larger ears, cute little muzzles, long slender pink tails all appear as the figures emerge. Each could be no larger than six inches tall, but they seem as active and curious as if they were already developed children. \n\n', false );
			EngineCore.outputText( 'Two emerge, then four, eight... you lose track. They swarm your body, scrambling for your chest, and take turns suckling at your nipples. Milk does their bodies good, making them grow rapidly, defining their genders as the girls grow cute little breasts and get broader hips and the boys develop their little mouse cocks and feel their balls swell. Each stops suckling when they reach two feet tall, and once every last one of them has departed your sore, abused cunt and drunk their fill of your milk, they give you a few grateful nuzzles, then run off towards the forest, leaving you alone to recover.\n', false );
			CoC.player.knockUpForce(); //Clear Pregnancy
			if( CoC.player.averageLactation() > 0 && CoC.player.averageLactation() < 5 ) {
				EngineCore.outputText( 'Your breasts won\'t seem to stop dribbling milk, lactating more heavily than before.', false );
				CoC.player.boostLactation( 0.5 );
			}
			CoC.player.cuntChange( 60, true, true, false );
			if( CoC.player.vaginas[ 0 ].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_DRY ) {
				CoC.player.vaginas[ 0 ].vaginalWetness++;
			}
			if( CoC.player.gender === 1 ) {
				CoC.player.gender = 3;
			}
			if( CoC.player.gender === 0 ) {
				CoC.player.gender = 2;
			}
			CoC.player.orgasm();
			EngineCore.dynStats( 'str', -1, 'tou', -2, 'spe', 3, 'lib', 1, 'sen', 0.5 );
			displayedUpdate = true;
			//Butt increase;
			if( CoC.player.buttRating < 14 && Utils.rand( 2 ) === 0 ) {
				if( CoC.player.buttRating < 10 ) {
					CoC.player.buttRating++;
					EngineCore.outputText( '\n\nYou notice your ' + Descriptors.buttDescript() + ' feeling larger and plumper after the ordeal.', false );
				}
				//Big butts grow slower!;
				else if( CoC.player.buttRating < 14 && Utils.rand( 2 ) === 0 ) {
					CoC.player.buttRating++;
					EngineCore.outputText( '\n\nYou notice your ' + Descriptors.buttDescript() + ' feeling larger and plumper after the ordeal.', false );
				}
			}
			EngineCore.outputText( '\n', false );
		}
		//Centaur Baby!;
		if( CoC.player.pregnancyIncubation === 1 && (CoC.player.pregnancyType === PregnancyStore.PREGNANCY_CENTAUR || CoC.player.pregnancyType === PregnancyStore.PREGNANCY_KELT) ) {
			EngineCore.outputText( '\nYou blink, feeling a sudden ache of need radiating from your massive stomach. You can\'t even get off the ground, it is so heavy... you simply lie on your side, panting with desire, as the convulsions start. New life moves beneath your stomach, ready to be born, and it is time to do your part.\n\n', false );
			if( CoC.player.vaginas.length === 0 ) {
				EngineCore.outputText( 'You feel a terrible pressure in your groin... then an incredible pain accompanied by the rending of flesh.  <b>You look down and behold a new vagina</b>.  ', false );
				CoC.player.createVagina();
				CoC.player.genderCheck();
			}
			//Main Text here;
			CoC.player.boostLactation( 0.01 );
			EngineCore.outputText( 'Perhaps strangely, there is no pain, just a steady, rhythmic compulsion that directs you to breathe steadily and spread your legs as wide as possible. You hardly have to push at all, as the child - no, your child, begins pressing against the walls of your womb, searching for escape. It finds it, and begins the arduous task of squeezing through your cervix, making you gasp with barely concealed pleasure.  It doesn\'t even hurt; there\'s only a dull little whisper of happiness followed by a tide of satisfaction.\n\n', false );
			EngineCore.outputText( 'The head comes first, and your first thought is relief as you see the face of a small, elfin child.  She\'s slick with afterbirth and pushing her way free. But the greater part is to come.  She pulls her body free, easily twice as large as her human torso. Soft downy fur with long, spindly legs and a bristly tail... she is a centaur! You help as best as you can, proud of your achievement, but are too exhausted by the ordeal. Your newfound daughter does most of the work.\n\n', false );
			EngineCore.outputText( 'She cannot stand, at first, and stumbles over her own shaky legs in a cute, innocent way. She appears to be a six-year old girl, stuck on top of the body of a young foal, and your heart goes out to her involuntarily. She manages to stand at last, wobbling uncertainly, and moves immediately towards your prone form. Knowing her needs, you reveal a breast to her, and she nickers affectionately before latching on, drinking hungrily from your heavily lactating teat.\n\n', false );
			EngineCore.outputText( 'She drinks endlessly, and seems more alive and stronger with every gulp. Hours pass in quiet, motherly bliss as she drains your breastmilk first from one breast, then the other. Her little stomach bulges slightly, but she does not stop, and you do not want her to. Even with the strange, soothing effect of the pregnancy wearing off, you feel nothing but affection for this child.\n\n', false );
			EngineCore.outputText( 'By the time she is finished, the centaur girl is obviously stronger, able to stand and move about on her own. She explores her new body, jumping and prancing happily, while you lay back and watch, too exhausted to join her. Suddenly, though, her ears perk up, as she looks towards the horizon urgently. She hesitates just long enough to plant a sweet kiss on your cheek, then dashes off, smiling broadly. Exhausted, you are unable to follow... but that comforting sensation returns.  Somehow, you sense she will be all right.', false );
			CoC.player.knockUpForce(); //Clear Pregnancy
			if( CoC.player.averageLactation() > 0 && CoC.player.averageLactation() < 5 ) {
				EngineCore.outputText( '  Your ' + Descriptors.allBreastsDescript() + ' won\'t seem to stop dribbling milk, lactating more heavily than before.', false );
				CoC.player.boostLactation( 0.5 );
			}
			EngineCore.outputText( '  ', false );
			CoC.player.cuntChange( 100, true );
			if( CoC.player.vaginas[ 0 ].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_DRY ) {
				CoC.player.vaginas[ 0 ].vaginalWetness++;
			}
			if( CoC.player.gender === 1 ) {
				CoC.player.gender = 3;
			}
			if( CoC.player.gender === 0 ) {
				CoC.player.gender = 2;
			}
			CoC.player.orgasm();
			EngineCore.dynStats( 'str', -1, 'tou', -4, 'spe', 2, 'lib', 1, 'sen', 0.5 );
			displayedUpdate = true;
			//Butt increase;
			if( CoC.player.buttRating < 14 && Utils.rand( 2 ) === 0 ) {
				if( CoC.player.buttRating < 10 ) {
					CoC.player.buttRating++;
					EngineCore.outputText( '\n\nYou notice your ' + Descriptors.buttDescript() + ' feeling larger and plumper after the ordeal.', false );
				}
				//Big butts grow slower!;
				else if( CoC.player.buttRating < 14 && Utils.rand( 2 ) === 0 ) {
					CoC.player.buttRating++;
					EngineCore.outputText( '\n\nYou notice your ' + Descriptors.buttDescript() + ' feeling larger and plumper after the ordeal.', false );
				}
			}
			CoC.player.knockUpForce(); //Clear Pregnancy
			EngineCore.outputText( '\n', false );
		}
		//Give birth if it's time (to a hellhound!);
		if( CoC.player.pregnancyIncubation === 1 && CoC.player.pregnancyType === PregnancyStore.PREGNANCY_HELL_HOUND ) {
			EngineCore.outputText( '\nYou are suddenly awoken by the heat inside your womb suddenly flaring up rather intensely.  It gives you a sudden charge of energy and you feel a strong need to stand up.  You can feel the two heads moving inside of you and you know that a hellhound will soon be born.  Guided by your instincts, you spread your legs and squat down, but wonder how exactly you are going to pass a creature with two heads?\n\n', false );
			if( CoC.player.vaginas.length === 0 ) {
				EngineCore.outputText( 'You feel a terrible pressure in your groin... then an incredible pain accompanied by the rending of flesh.  <b>You look down and behold a new vagina</b>.\n\n', false );
				CoC.player.createVagina();
				CoC.player.genderCheck();
			}
			EngineCore.outputText( 'Hearing a hiss, you look down to see drops of water hitting the ground and instantly turning to steam.  There is unnatural heat filling you, it\'s hot enough to boil water; but thanks to the creature inside you, you\'re barely feeling a thing!  More energy fills you and you begin to push down on the child within in earnest.  The process is painful, but satisfying; you feel like you could push out a mountain with the energy you have right now.  Within a minute, you can feel the heads emerge.  The heads are quickly followed by the rest of the body and you catch your hellhound child in your hands and lift it up to look at it.\n\n', false );
			EngineCore.outputText( 'You can see the distinctive dog heads are wrapped around each other and yipping softly; a hint of flame can sometimes be seen inside their mouths.  Its cute paws are waving in the air looking for purchase, but the rest of its body looks entirely human except for the double dicks, and it even has your skin color.  Its mouths are aching for nutrition, and you realize that your breasts are filled with what this pup needs and pull it to your chest.  Each head quickly finds a nipple and begins to suckle.  Having finished the birthing, you contentedly sit back down and bask in the feeling of giving milk to your child, or is it children?\n\n', false );
			EngineCore.outputText( 'You sit there in a state of euphoria for some time.  It\'s not until the child in front of you starts to become uncomfortably hot and heavy, that you are brought back to reality.  You look down to see that the hellhound pup has grown to three times its original size and even sprouted the distinctive layer of tough black fur.  The beast is licking contentedly at your breasts instead of sucking.  It was the now-full flames in its mouth that had broken your reverie, but before you get a real grasp of what had happened, the hellhound pulls away from you and gives you a few quick happy barks before turning around and running off into the wilds, dropping down onto four legs just before disappearing from view.  You feel the unnatural strength you gained during the birth fade away, and you fall into a deep contented sleep.\n\n', false );
			CoC.player.boostLactation( 0.01 );
			//Main Text here;
			CoC.player.knockUpForce(); //Clear Pregnancy
			if( CoC.player.averageLactation() > 0 && CoC.player.averageLactation() < 5 ) {
				EngineCore.outputText( 'Your breasts won\'t seem to stop dribbling milk, lactating more heavily than before.  ', false );
				CoC.player.boostLactation( 0.5 );
			}
			CoC.player.cuntChange( 60, true );
			if( CoC.player.vaginas[ 0 ].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_DRY ) {
				CoC.player.vaginas[ 0 ].vaginalWetness++;
			}
			if( CoC.player.gender === 1 ) {
				CoC.player.gender = 3;
			}
			if( CoC.player.gender === 0 ) {
				CoC.player.gender = 2;
			}
			CoC.player.orgasm();
			EngineCore.dynStats( 'str', -1, 'tou', -1, 'spe', 2, 'lib', 1, 'sen', 0.5 );
			displayedUpdate = true;
			//Butt increase;
			if( CoC.player.buttRating < 14 && Utils.rand( 2 ) === 0 ) {
				if( CoC.player.buttRating < 10 ) {
					CoC.player.buttRating++;
					EngineCore.outputText( '\n\nYou notice your ' + Descriptors.buttDescript() + ' feeling larger and plumper after the ordeal.', false );
				}
				//Big butts grow slower!;
				else if( CoC.player.buttRating < 14 && Utils.rand( 2 ) === 0 ) {
					CoC.player.buttRating++;
					EngineCore.outputText( '\n\nYou notice your ' + Descriptors.buttDescript() + ' feeling larger and plumper after the ordeal.', false );
				}
			}
			EngineCore.outputText( '\n', false );
		}
		//Egg status messages;
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_OVIELIXIR_EGGS && CoC.player.pregnancyIncubation > 0 ) {
			if( CoC.player.vaginas.length === 0 ) {
				CoC.player.removeStatusAffect( StatusAffects.Eggs );
				EngineCore.outputText( '\n<b>Your pregnant belly suddenly begins shrinking, until it disappears.</b>\n', false );
				CoC.player.knockUpForce(); //Clear Pregnancy
				displayedUpdate = true;
			}
			//Birth scenes;
			if( CoC.player.pregnancyIncubation === 1 ) {
				EngineCore.outputText( '\n', false );
				if( CoC.player.vaginas.length === 0 ) {
					EngineCore.outputText( 'You feel a terrible pressure in your groin... then an incredible pain accompanied by the rending of flesh.  <b>You look down and behold a new vagina</b>.\n\n', false );
					CoC.player.createVagina();
					CoC.player.genderCheck();
				}
				//Small egg scenes;
				if( CoC.player.statusAffectv2( StatusAffects.Eggs ) === 0 ) {
					//light quantity;
					if( CoC.player.statusAffectv3( StatusAffects.Eggs ) < 10 ) {
						EngineCore.outputText( 'You are interrupted as you find yourself overtaken by an uncontrollable urge to undress and squat.   You berate yourself for giving in to the urge for a moment before feeling something shift.  You hear the splash of fluid on the ground and look down to see a thick greenish fluid puddling underneath you.  There is no time to ponder this development as a rounded object passes down your birth canal, spreading your feminine lips apart and forcing a blush to your cheeks.  It plops into the puddle with a splash, and you find yourself feeling visibly delighted to be laying such healthy eggs.   Another egg works its way down and you realize the process is turning you on more and more.   In total you lay ', false );
						EngineCore.outputText( this.eggDescript(), false );
						EngineCore.outputText( ', driving yourself to the very edge of orgasm.', false );
						EngineCore.dynStats( 'lus=', 100, 'resisted', false );
					}
					//High quantity;
					else {
						EngineCore.outputText( 'A strange desire overwhelms your sensibilities, forcing you to shed your ' + CoC.player.armorName + ' and drop to your hands and knees.   You manage to roll over and prop yourself up against a smooth rock, looking down over your pregnant-looking belly as green fluids leak from you, soaking into the ground.   A powerful contraction rips through you and your legs spread instinctively, opening your ' + Descriptors.vaginaDescript( 0 ) + ' to better deposit your precious cargo.   You see the rounded surface of an egg peek through your lips, mottled with strange colors.   You push hard and it drops free with an abrupt violent motion.  The friction and slimy fluids begin to arouse you, flooding your groin with heat as you feel the second egg pushing down.  It slips free with greater ease than the first, arousing you further as you bleat out a moan from the unexpected pleasure.  Before it stops rolling on the ground, you feel the next egg sliding down your slime-slicked passage, rubbing you perfectly as it slides free.  You lose count of the eggs and begin to masturbate, ', false );
						if( CoC.player.clitLength > 5 ) {
							EngineCore.outputText( 'jerking on your huge clitty as if it were a cock, moaning and panting as each egg slides free of your diminishing belly.  You lubricate it with a mix of your juices and the slime until ', false );
						}
						if( CoC.player.clitLength > 2 && CoC.player.clitLength <= 5 ) {
							EngineCore.outputText( 'playing with your over-large clit as if it were a small cock, moaning and panting as the eggs slide free of your diminishing belly.  You spread the slime and cunt juice over it as you tease and stroke until ', false );
						}
						if( CoC.player.clitLength <= 2 ) {
							EngineCore.outputText( 'pulling your folds wide and playing with your clit as another egg pops free from your diminishing belly.  You make wet \'schlick\'ing sounds as you spread the slime around, vigorously frigging yourself until ', false );
						}
						EngineCore.outputText( 'you quiver in orgasm, popping out the last of your eggs as your body twitches nervelessly on the ground.   In total you lay ' + this.eggDescript() + '.', false );
						CoC.player.orgasm();
						EngineCore.dynStats( 'resisted', false );
					}
				}
				//Large egg scene;
				else {
					EngineCore.outputText( 'A sudden shift in the weight of your pregnant belly staggers you, dropping you to your knees.  You realize something is about to be birthed, and you shed your ' + CoC.player.armorName + ' before it can be ruined by what\'s coming.  A contraction pushes violently through your midsection, ', false );
					if( CoC.player.vaginas[ 0 ].vaginalLooseness < AppearanceDefs.VAGINA_LOOSENESS_LOOSE ) {
						EngineCore.outputText( 'stretching your tight cunt painfully, the lips opening wide ', false );
					}
					if( CoC.player.vaginas[ 0 ].vaginalLooseness >= AppearanceDefs.VAGINA_LOOSENESS_LOOSE && CoC.player.vaginas[ 0 ].vaginalLooseness <= AppearanceDefs.VAGINA_LOOSENESS_GAPING_WIDE ) {
						EngineCore.outputText( 'temporarily stretching your cunt-lips wide-open ', false );
					}
					if( CoC.player.vaginas[ 0 ].vaginalLooseness > AppearanceDefs.VAGINA_LOOSENESS_GAPING_WIDE ) {
						EngineCore.outputText( 'parting your already gaping lips wide ', false );
					}
					EngineCore.outputText( 'as something begins sliding down your passage.  A burst of green slime soaks the ground below as the birthing begins in earnest, and the rounded surface of a strangely colored egg peaks between your lips.  You push hard and the large egg pops free at last, making you sigh with relief as it drops into the pool of slime.  The experience definitely turns you on, and you feel your clit growing free of its hood as another big egg starts working its way down your birth canal, rubbing your sensitive vaginal walls pleasurably.   You pant and moan as the contractions stretch you tightly around the next, slowly forcing it out between your nether-lips.  The sound of a gasp startles you as it pops free, until you realize it was your own voice responding to the sudden pressure and pleasure.  Aroused beyond reasonable measure, you begin to masturbate ', false );
					if( CoC.player.clitLength > 5 ) {
						EngineCore.outputText( 'your massive cock-like clit, jacking it off with the slimy birthing fluids as lube.   It pulses and twitches in time with your heartbeats, its sensitive surface overloading your fragile mind with pleasure.  ', false );
					}
					if( CoC.player.clitLength > 2 && CoC.player.clitLength <= 5 ) {
						EngineCore.outputText( 'your large clit like a tiny cock, stroking it up and down between your slime-lubed thumb and fore-finger.  It twitches and pulses with your heartbeats, the incredible sensitivity of it overloading your fragile mind with waves of pleasure.  ', false );
					}
					if( CoC.player.clitLength <= 2 ) {
						EngineCore.outputText( 'your ' + Descriptors.vaginaDescript( 0 ) + ' by pulling your folds wide and playing with your clit.  Another egg pops free from your diminishing belly, accompanied by an audible burst of relief.  You make wet \'schlick\'ing sounds as you spread the slime around, vigorously frigging yourself.  ', false );
					}
					EngineCore.outputText( 'You cum hard, the big eggs each making your cunt gape wide just before popping free.  You slump down, exhausted and barely conscious from the force of the orgasm.  ', false );
					if( CoC.player.statusAffectv3( StatusAffects.Eggs ) >= 11 ) {
						EngineCore.outputText( 'Your swollen belly doesn\'t seem to be done with you, as yet another egg pushes its way to freedom.   The stimulation so soon after orgasm pushes you into a pleasure-stupor.  If anyone or anything discovered you now, they would see you collapsed next to a pile of eggs, your fingers tracing the outline of your ' + Descriptors.vaginaDescript( 0 ) + ' as more and more eggs pop free.  In time your wits return, leaving you with the realization that you are no longer pregnant.  ', false );
					}
					EngineCore.outputText( '\n\nYou gaze down at the mess, counting ' + this.eggDescript() + '.', false );
					CoC.player.orgasm();
					EngineCore.dynStats( 'resisted', false );
				}
				EngineCore.outputText( '\n\n<b>You feel compelled to leave the eggs behind, ', false );
				if( CoC.player.findStatusAffect( StatusAffects.AteEgg ) >= 0 ) {
					EngineCore.outputText( 'but you remember the effects of the last one you ate.\n</b>', false );
				} else {
					EngineCore.outputText( 'but your body\'s intuition reminds you they shouldn\'t be fertile, and your belly rumbles with barely contained hunger.\n</b>', false );
				}
				CoC.player.cuntChange( 20, true );
				CoC.player.createStatusAffect( StatusAffects.LootEgg, 0, 0, 0, 0 );
				displayedUpdate = true;
				CoC.player.knockUpForce(); //Clear Pregnancy
			}
		}
		return displayedUpdate;
	};
	Pregnancy.prototype.eggDescript = function( plural ) {
		var descript = '';
		if( CoC.player.findStatusAffect( StatusAffects.Eggs ) >= 0 ) {
			descript += Utils.num2Text( CoC.player.statusAffectv3( StatusAffects.Eggs ) ) + ' ';
			//size descriptor;
			if( CoC.player.statusAffectv2( StatusAffects.Eggs ) === 1 ) {
				descript += 'large ';
			}
			/*color descriptor
			 0 - brown - ass expansion
			 1 - purple - hip expansion
			 2 - blue - vaginal removal and/or growth of existing maleness
			 3 - pink - dick removal and/or fertility increase.
			 4 - white - breast growth.  If lactating increases lactation.
			 5 - rubbery black -
			 */
			if( CoC.player.statusAffectv1( StatusAffects.Eggs ) === 0 ) {
				descript += 'brown ';
			}
			if( CoC.player.statusAffectv1( StatusAffects.Eggs ) === 1 ) {
				descript += 'purple ';
			}
			if( CoC.player.statusAffectv1( StatusAffects.Eggs ) === 2 ) {
				descript += 'blue ';
			}
			if( CoC.player.statusAffectv1( StatusAffects.Eggs ) === 3 ) {
				descript += 'pink ';
			}
			if( CoC.player.statusAffectv1( StatusAffects.Eggs ) === 4 ) {
				descript += 'white ';
			}
			if( CoC.player.statusAffectv1( StatusAffects.Eggs ) === 5 ) {
				descript += 'rubbery black ';
			}
			//EGGS;
			if( plural === undefined || plural ) {
				descript += 'eggs';
			} else {
				descript += 'egg';
			}
			return descript;
		}
		CoC_Settings.error( '' );
		return 'EGG ERRORZ';
	};
	SceneLib.registerScene( 'pregnancy', new Pregnancy() );
} );