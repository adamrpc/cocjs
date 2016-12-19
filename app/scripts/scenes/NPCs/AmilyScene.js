﻿'use strict';

angular.module( 'cocjs' ).run( function( MainView, SceneLib, $rootScope, $log, Descriptors, PerkLib, UseableLib, ImageManager, CockTypesEnum, Appearance, AppearanceDefs, ArmorLib, Amily, CoC, kFLAGS, Utils, StatusAffects, PregnancyStore, EngineCore, Combat, ConsumableLib ) {
	/*Amily the Mousegirl Breeder
	 * Plus human stuff
	 =============================================
	 35	-met Amily? (0 = not met, 1 = met)
	 36	-Amily village encounters disabled (1 = true) (44 for village button)
	 37	-Amily encounters disabled due to worms (1=she freaked out.  Goes to 0 automatically if uninfected)
	 38	-Amily Affection (< 15 = low.  In between = medium. 40+= high affect)
	 39	-Amily Offer Accepted? (1 = true, 0 = not yet)
	 40	-Amily Birth Total (no explanation needed)
	 41	-Amily Pregnancy Incubation - 0 = not pregnant, otherwise hours till birth 168
	 42	-Fucked Amily Counter
	 43	-Follower Toggle for amily (1 = follower, 0 = not)
	 44	-Amily's Village Unlocked (1=village button on, 0=off)
	 45	Amily's Wang Length
	 46	Amily's Wang Thickness
	 47	Amily's Cup Size (1 to 5)
	 48	Nipple Length from 0.3 to 4"
	 49	Amily Hip Rating - girly to womanly
	 50	Can increase ass from 'unremarkable ass' to 'delightfully jiggly'
	 51	Amily Lactation Rating
	 52	Amily Clothing
	 158 -What did the PC meet amily as
	 159	-Has Amily Confessed Lesbian Love? (1 = yes, 2= yes and you accepted)
	 160	Times PC and Amily have done girlygirl sex
	 161	Times PC and Herm-Amily have done girlygirl sex
	 162	Times PC has birthed Amily's brood
	 163	Is PC pending preggo completion? (1 = yes, 2 = finished)
	 164	Amily remembers PC gender
	 165	Amily Herm Quest (1 = amily has flipped out, 2 = accepted to be amily's dad
	 166 Amily Allowing Fertility In Camp? (1 = yes)
	 */
	function AmilyScene() {
		var that = this;
		$rootScope.$on( 'time-change', function() {
			that.timeChange();
		});
		$rootScope.$on( 'time-change-large', function() {
			that.timeChangeLarge();
		});
		this.pregnancy = new PregnancyStore(kFLAGS.AMILY_PREGNANCY_TYPE, kFLAGS.AMILY_INCUBATION, kFLAGS.AMILY_BUTT_PREGNANCY_TYPE, kFLAGS.AMILY_OVIPOSITED_COUNTDOWN);
		this.pregnancy.addPregnancyEventSet(PregnancyStore.PREGNANCY_PLAYER, 150, 120, 100, 96, 90, 72, 48);
	}

	//Implementation of TimeAwareInterface;
	AmilyScene.prototype.timeChange = function() {
		var needNext = false;
		this.pregnancy.pregnancyAdvance();
		$log.debug( '\nAmily time change is ' + CoC.time.hours + ', type: ' + this.pregnancy.type + ', incubation: ' + this.pregnancy.incubation + ', event: ' + this.pregnancy.event );
		$log.debug( '\nAmily time change type: ' + this.pregnancy.buttType + ', butt incubation:' + this.pregnancy.buttIncubation + ', butt event:' + this.pregnancy.buttEvent );
		if( CoC.flags[ kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO ] > 0 ) {
			CoC.flags[ kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO ]--;
		}
		if( CoC.flags[ kFLAGS.AMILY_INCEST_COUNTDOWN_TIMER ] > 0 && CoC.flags[ kFLAGS.AMILY_INCEST_COUNTDOWN_TIMER ] < 30 * 24 ) {
			CoC.flags[ kFLAGS.AMILY_INCEST_COUNTDOWN_TIMER ]++;
		}
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			if( this.pregnancy.isPregnant && this.pregnancy.incubation === 0 ) {
				MainView.outputText( '\n', false );
				this.amilyPopsOutKidsInCamp();
				this.pregnancy.knockUpForce(); //Clear Pregnancy
				MainView.outputText( '\n', false );
				needNext = true;
			}
			if( this.pregnancy.isButtPregnant && this.pregnancy.buttIncubation === 0 ) {
				this.amilyLaysEggsLikeABitch();
				this.pregnancy.buttKnockUpForce(); //Clear Pregnancy
				needNext = true;
			}
		}
		if( CoC.time.hours === 6 ) {
			//Pure amily flips her shit and moves out!;
			if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 && CoC.player.cor >= 66 && CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00173 ] > 0 ) {
				SceneLib.amilyScene.farewellNote();
				needNext = true;
			}
			//Amily moves back in once uncorrupt.;
			if( CoC.flags[ kFLAGS.AMILY_TREE_FLIPOUT ] === 0 && CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00173 ] > 0 && CoC.player.cor <= 25 && CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 0 ) {
				SceneLib.amilyScene.amilyReturns();
				needNext = true;
			}
		} else if( CoC.time.hours > 23 ) {
			if( CoC.flags[ kFLAGS.AMILY_X_JOJO_COOLDOWN ] > 0 ) {
				CoC.flags[ kFLAGS.AMILY_X_JOJO_COOLDOWN ]--;
			}
		}
		return needNext;
	};
	AmilyScene.prototype.timeChangeLarge = function() {
		if( !SceneLib.urtaQuest.urtaBusy() && CoC.flags[ kFLAGS.AMILY_VISITING_URTA ] === 2 && CoC.time.hours === 6 ) {
			SceneLib.followerInteractions.amilyUrtaMorningAfter();
			return true;
		}
		return false;
	};
	//End of Interface Implementation;
	// NEW EVENTS:;
	// 3172 = Ask to defur Amily;
	// 3174 = Defur Amily at camp (both corrupt/noncorrupt);
	AmilyScene.prototype.amilyFollower = function() {
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] > 0 ) {
			//Amily not a follower while visiting Urta;
			return !(CoC.flags[ kFLAGS.AMILY_VISITING_URTA ] === 1 || CoC.flags[ kFLAGS.AMILY_VISITING_URTA ] === 2);
		} else {
			return false;
		}
	};
	AmilyScene.prototype.amilyCorrupt = function() {
		return CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 2;
	};
	AmilyScene.prototype.amilySprite = function() {
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.spriteSelect( 3 );
		} else {
			MainView.spriteSelect( 65 );
		}
	};
	//Encounters;
	//[Ruined Village];
	//[Exploring the Lake];
	AmilyScene.prototype.discoverAmilyVillage = function() {
		MainView.outputText( '', true );
		MainView.outputText( 'As you roam the shores of the lake, you find your footsteps echoing as though you were stepping on wood rather than squishing in the sandy mud of the shore. Curious, you squat down and brush the soil away, revealing the rotting form of a wooden plank. Looking carefully at the ground underfoot, you realize that it is part of a pathway – the kind that villages make to provide easier access to and from muddy rivers, lakes and beaches. You believe you can make out the rest of the path clearly enough to follow it to its end.\n\n', false );
		MainView.outputText( 'Do you follow the pathway?', false );
		//Yes / No;
		EngineCore.doYesNo( this, this.exploreAmilyVillage, this, this.dontExploreAmilyVillage );
	};
	//[No];
	AmilyScene.prototype.dontExploreAmilyVillage = function() {
		MainView.outputText( '', true );
		MainView.outputText( 'Standing up, you turn and walk away. You presume from the state of the pathway that the village at the other end must either be in dire straits, abandoned, or overwhelmed by demons. In other words, it\'s no safe place for a traveler like you.\n\n', false );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[Yes];
	AmilyScene.prototype.exploreAmilyVillage = function() {
		MainView.outputText( '', true );
		MainView.outputText( 'You follow the overgrown path inland, away from the shore of the lake. You pass through thick trees, struggling not to lose the path, before finally reaching what is clearly the end.  In front of you lie crumbling walls, broken and scattered by the wind and rain... and by other forces entirely. Beyond them are houses that have been torn apart, burned or collapsed. This was clearly once a village, but it was devastated at some point in the past. Demon attack is the first possibility that leaps into your mind. You examine the ruins for a time, and then decide to head back to camp. You don\'t think it would be wise to investigate here without preparing first.\n\n', false );
		MainView.outputText( '(<b>"TownRuins" added to Places menu.</b>)', false );
		//set village unlock flag;
		CoC.flags[ kFLAGS.AMILY_VILLAGE_ACCESSIBLE ] = 1;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[Exploring the Ruined Village];
	AmilyScene.prototype.exploreVillageRuin = function() {
		MainView.outputText( '', true );
		//50% chance of ghost-girl;
		if( (CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00365 ] === 0 && CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00254 ] > 0 && CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00255 ] > 0 && Utils.rand( 10 ) <= 3) && !SceneLib.shouldraFollower.followerShouldra() && CoC.flags[ kFLAGS.SHOULDRA_FOLLOWER_STATE ] !== 0.5 ) {
			SceneLib.shouldraScene.shouldraGreeting();
			return;
		}
		//20% chance of playing with a rack;
		if( Utils.rand( 5 ) === 0 && (CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00254 ] === 0 || CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00255 ] === 0) ) {
			var rack = 0;
			//Already got weapon;
			if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00254 ] > 0 ) {
				rack = 0;
			}
			//Already got armor;
			else if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00255 ] > 0 ) {
				rack = 1;
			}
			//Got neither - 50% of each;
			else if( Utils.rand( 2 ) === 0 ) {
				rack = 1;
			}
			MainView.outputText( 'While picking through the ruined houses and abandoned structures of this dilapidated village, you manage to find something useful!  There\'s an intact but empty ', false );
			if( rack === 0 ) {
				MainView.outputText( 'armor', false );
			} else {
				MainView.outputText( 'weapon', false );
			}
			MainView.outputText( ' rack here.  It looks like it could hold nine different ', false );
			if( rack === 0 ) {
				MainView.outputText( 'armors', false );
			} else {
				MainView.outputText( 'weapons', false );
			}
			MainView.outputText( '.  You check it over and spot an easy way to fold it up for transport.  This would be a fine addition to your camp, so you pack it up and haul it back.', false );
			if( rack === 1 ) {
				CoC.player.createKeyItem( 'Equipment Rack - Weapons', 0, 0, 0, 0 );
				CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00254 ] = 1;
			} else {
				CoC.player.createKeyItem( 'Equipment Rack - Armor', 0, 0, 0, 0 );
				CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00255 ] = 1;
			}
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		//Initialize saved gender:;
		if( CoC.flags[ kFLAGS.AMILY_MET ] === 0 ) {
			CoC.flags[ kFLAGS.AMILY_PC_GENDER ] = CoC.player.gender;
		}
		//Amily gone/hiding super hard;
		if( CoC.flags[ kFLAGS.AMILY_IS_BATMAN ] > 0 || CoC.flags[ kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED ] === 1 || CoC.flags[ kFLAGS.AMILY_TREE_FLIPOUT ] > 0 ) {
			MainView.outputText( 'You enter the ruined village cautiously. There are burnt-down houses, smashed-in doorways, ripped-off roofs... everything is covered with dust and grime. You explore for an hour, but you cannot find any sign of another living being, or anything of value. The occasional footprint from an imp or a goblin turns up in the dirt, but you don\'t see any of the creatures themselves. It looks like time and passing demons have stripped the place bare since it was originally abandoned. Finally, you give up and leave. You feel much easier when you\'re outside of the village.', false );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		//Schrödinger Amily corrupted that damn place!;
		else if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 2 ) {
			this.amilySprite();
			MainView.outputText( 'You enter the ruined village, still laughing at your past nefarious deeds. Maybe it\'s just your imagination, but you feel like this entire place reeks of corruption now... You explore for an hour, then go back to your camp, knowing your tainted slave will be more than happy to satisfy your urges.', false );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		//Remove worm block if player got rid of worms.;
		if( CoC.flags[ kFLAGS.AMILY_GROSSED_OUT_BY_WORMS ] === 1 ) {
			if( CoC.player.findStatusAffect( StatusAffects.Infested ) < 0 ) {
				CoC.flags[ kFLAGS.AMILY_GROSSED_OUT_BY_WORMS ] = 0;
			}
		}
		//Corrupt blow up! - requires you've met Amily;
		if( CoC.flags[ kFLAGS.AMILY_CORRUPT_FLIPOUT ] === 0 && CoC.flags[ kFLAGS.AMILY_MET ] > 0 && CoC.player.cor > 25 ) {
			this.meetAmilyAsACorruptAsshat();
			return;
		}
		//CORRUPTIONZ;
		if( CoC.flags[ kFLAGS.AMILY_CORRUPT_FLIPOUT ] > 0 && CoC.player.cor > 25 ) {
			//Cook amily a snack if player doesnt have key item for it.;
			if( CoC.player.hasKeyItem( 'Potent Mixture' ) < 0 && CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00170 ] < 3 ) {
				this.cookAmilyASnack();
				return;
			}
			//Has snacks!;
			else {
				if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00170 ] === 0 ) {
					this.stalkingZeAmiliez();
				} else if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00170 ] === 1 ) {
					this.stalkingZeAmiliez2();
				} else if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00170 ] === 2 ) {
					this.stalkingZeAmiliez3();
				} else {
					this.rapeCorruptAmily4Meeting();
				}
				return;
			}
		}
		//Amily Un-encounterable (worms):;
		if( CoC.flags[ kFLAGS.AMILY_GROSSED_OUT_BY_WORMS ] === 1 || CoC.player.cor > 25 || CoC.flags[ kFLAGS.AMILY_CORRUPT_FLIPOUT ] > 0 ) {
			MainView.outputText( 'You enter the ruined village cautiously. There are burnt-down houses, smashed-in doorways, ripped-off roofs... everything is covered with dust and grime. For hours you explore, but you cannot find any sign of another living being, or anything of value. The occasional footprint from an imp or a goblin turns up in the dirt, but you don\'t see any of the creatures themselves. It looks like time and passing demons have stripped the place bare since it was originally abandoned. Finally, you give up and leave. You feel much easier when you\'re outside of the village – you had the strangest sensation of being watched while you were in there.', false );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		this.amilySprite();
		//Preggo birthing!;
		if( this.pregnancy.isPregnant && this.pregnancy.incubation === 0 ) {
			this.fuckingMouseBitchPopsShitOut();
			this.pregnancy.knockUpForce(); //Clear Pregnancy
			return;
		}
		if( this.amilyCanHaveTFNow() ) {
			this.amilyDefurrify();
			return;
		}
		//meeting scenes for when PC is the same gender as when they last met Amily;
		if( CoC.flags[ kFLAGS.AMILY_PC_GENDER ] === CoC.player.gender ) {
			//'bad' or 'good' ends.;
			if( CoC.flags[ kFLAGS.AMILY_BIRTH_TOTAL ] + CoC.flags[ kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS ] >= 5 && CoC.flags[ kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED ] === 0 ) {
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					this.thisIsAReallyShittyBadEnd();
				} else {
					this.thisFunctionProbablySucksTooOhYeahAmilyFunction();
				}

				return;
			}
			//Man Meetinz!;
			if( CoC.player.gender === 1 ) {
				//Desperate Plea;
				//(Amily reach Affection 50 without having had sex with the PC once.);
				//Requires the PC have been male last time.;
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] >= 50 && CoC.flags[ kFLAGS.AMILY_FUCK_COUNTER ] === 0 && CoC.flags[ kFLAGS.AMILY_PC_GENDER ] === 1 ) {
					MainView.outputText( 'Wandering into the ruined village, you set off in search of Amily.\n\n', false );
					MainView.outputText( 'After wondering for a while how on earth you are going to track down Amily, you hear a whistle. Looking around, you see her waving cheekily at you from around a corner; it\'s pretty obvious that you have a long way to go before you\'ll be able to beat her at this kind of game.\n\n', false );
					MainView.outputText( '"<i>Ah... do you have the time to talk? There\'s something I want to get off my chest,</i>" Amily nervously asks.\n\n', false );
					MainView.outputText( 'Curious what she has to say, you agree.\n\n', false );
					MainView.outputText( 'Amily scuffs the ground with one of her finger-like toe claws, looking down at it as if it was the most interesting thing in the world – or as if she doesn\'t dare to look you in the eyes. "<i>I... You know what I\'ve been asking of you; from you, and you keep turning me down... but you kept talking to me, asking me about myself. You wanted to get to know me, but... why don\'t you want to know ALL of me? I... I want to give myself to you. You\'re the nicest, kindest man I\'ve met – even before the demons destroyed my village. I want to be with you... but you don\'t seem to want to be with me.</i>" She looks up to you at last, her eyes wet with tears. "<i>Is there something wrong with me? Can\'t you like me in that way?</i>" she pleads.\n\n', false );
					//Accept her / Turn her down gently / Turn her down bluntly;
					var fur = null;
					if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
						fur = this.amilyNoFur;
					}
					EngineCore.choices( 'Accept Her', this, this.desperateAmilyPleaAcceptHer, 'RejectFurry', this, fur, 'RejectGently', this, this.desperateAmilyPleaTurnDown, 'BluntReject', this, this.desperateAmilyPleaTurnDownBlunt, '', null, null );
					return;
				}
				//[First Meeting];
				if( CoC.flags[ kFLAGS.AMILY_MET ] === 0 ) {
					//Set flag for what she met the player as.;
					CoC.flags[ kFLAGS.AMILY_MET_AS ] = CoC.player.gender;
					//set 'met' to true;
					CoC.flags[ kFLAGS.AMILY_MET ]++;
					MainView.outputText( 'You wind your way deep into the maze of dusty crumbling buildings and twisted saplings, looking for any sign of life – or, failing that, something that can help you in your quest.  Bending down to rummage through an old heap of rubbish, you complain aloud that this is hardly the sort of thing you expected to be doing as a champion. Suddenly, you hear a \'thwip\' and something shoots past your face, embedding into the stone beside your head and trembling with the impact.\n\n', false );
					MainView.outputText( '"<i>Don\'t make any sudden moves!</i>" A voice calls out, high pitched and a little squeaky, but firm and commanding. You freeze to avoid giving your assailant a reason to shoot at you again. "<i>Stand up and turn around, slowly,</i>" it commands again. You do as you are told.\n\n', false );
					//[Jojo previously encountered];
					if( SceneLib.jojoScene.monk > 0 ) {
						MainView.outputText( 'The creature that has cornered you is clearly of the same race as Jojo, though notably a female member of his species. Her fur is thick with dust, but you can still easily make out its auburn color. Her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can\'t be any larger than an A-cup. She wears a tattered pair of pants and an equally ragged-looking shirt. A very large and wicked-looking dagger – more of a short sword really – is strapped to her hip, and she is menacing you with a blowpipe.\n\n', false );
					}
					//[Jojo not previously encountered];
					else {
						MainView.outputText( 'You have been cornered by a very strange being bipedal female humanoid with the unmistakable features of a giant mouse; paw-like feet, a muzzled head with long whiskers, large mouse ears, and a body covered in dust-caked auburn fur. It doesn\'t look like she has had a very easy life; her clothing consists of a dirty, tattered set of pants and shirt, while her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can\'t be any larger than an A-cup. Still, she looks quite capable of defending herself; not only is she brandishing a blowpipe, clearly ready to spit another doubtlessly-poisoned dart at you, but she has a formidable-looking knife strapped to her hip.\n\n', false );
					}
					MainView.outputText( 'She looks at you for a few long moments, and then lowers her blowpipe, "<i>I\'m sorry about that, but I thought you were another demon. They destroyed this place years ago, but some of the damn scavengers still occasionally drift through. Not so much lately, of course. I\'ve made something of an impression on them.</i>" She grins malevolently, one hand caressing the blade of her knife in an almost sensual fashion. "<i>My name is Amily, the last survivor of this village. All of my people are gone now; they\'re scattered, dead, enslaved, or worse. What about you? ', false );
					if( CoC.player.humanScore() > 4 ) {
						MainView.outputText( 'Are you ', false );
					} else {
						MainView.outputText( 'Were you ', false );
					}
					MainView.outputText( 'one of those... humans, I\'ve heard sometimes wander into this world?</i>"\n\n', false );
					MainView.outputText( 'You admit that, yes, you are a human, and then ask her why she remains here in this empty wasteland of a settlement.\n\n', false );
					MainView.outputText( '"<i>I was born here, I grew up here, and I would have gotten married and settled down here if it hadn\'t been for those demons.</i>" She spits the word \'demons\' with contempt. "<i>After it was all over, I had nowhere else to go. So I stayed here. I\'ve still got nowhere else to go, to be honest. I haven\'t found any other settlements of my own people, and I\'d sooner die than give myself over to the demons. But it seems that if I\'m ever going to see more of my people living free, I\'m going to have to take the leading role...</i>"\n\n', false );
					MainView.outputText( 'She stares at you intently, and you ask her what the matter is.\n\n', false );
					MainView.outputText( '"<i>You see, that role I was talking about? I\'ve had a long time to think about it, and there\'s no one else for it. If there are ever going to be more of my kind born into freedom, they\'re going to have to be born. Literally; I need to find a mate that is pure, one that can give me strong and pure children of my own kind,</i>" she explains, one hand absently touching her flat belly. "<i>The few males of my kind that I\'ve managed to find are demon slaves – far too corrupt to make suitable mates, even if I could free them. I\'ve heard, though, that humans are strangely weak breeders; your seed would be free of taint, and you would father more of my own kind. Unlike, say, an imp or a minotaur.</i>"\n\n', false );
					MainView.outputText( 'She tucks her blowpipe into her belt and takes several uncertain steps towards you, trying to appear winning – flirtatious even – despite her grimy appearance and clear inexperience with the matter. "<i>Please, will you help me? You said something about being a champion – If you lay with me and help me bring more of my people into this world, free of the demons and untouched by their perverse taint, you will be striking another kind of blow against their corrupt stranglehold on Mareth.</i>"\n\n', false );
					MainView.outputText( 'What do you do?', false );
					//Accept Eagerly / Accept Hesitantly / Refuse;
					EngineCore.choices( 'AcceptEagerly', this, this.acceptAmilysOfferEagerly, 'Hesitantly', this, this.acceptAmilyOfferHesitantly, 'NoFurries', this, this.amilyNoFur, 'Refuse', this, this.refuseAmilysOffer, '', null, null );
					//Set flag for 'last gender met as';
					CoC.flags[ kFLAGS.AMILY_PC_GENDER ] = CoC.player.gender;
					return;
				}
				//[Remeeting if previously refused];
				else if( CoC.player.gender === 1 && CoC.flags[ kFLAGS.AMILY_OFFER_ACCEPTED ] === 0 ) {
					MainView.outputText( 'Wandering into the ruined village, you set off in search of Amily.\n\n', false );
					MainView.outputText( 'After wondering for a while how on earth you are going to track down Amily, you hear a whistle. Looking around, you see her waving cheekily at you from around a corner; it\'s pretty obvious that you have a long way to go before you\'ll be able to beat her at this kind of game.\n\n', false );
					this.amilyRemeetingContinued();
					//Set flag for 'last gender met as';
					CoC.flags[ kFLAGS.AMILY_PC_GENDER ] = CoC.player.gender;
					return;
				}
			}
			//GIRL MEETINZ;
			else if( CoC.player.gender === 2 ) {
				//First time;
				if( CoC.flags[ kFLAGS.AMILY_MET ] === 0 ) {
					//Set flag for what she met the player as.;
					CoC.flags[ kFLAGS.AMILY_MET_AS ] = CoC.player.gender;
					//set 'met' to true;
					CoC.flags[ kFLAGS.AMILY_MET ]++;
					MainView.outputText( 'You wind your way deep into the maze of dusty crumbling buildings and twisted saplings, looking for any sign of life – or, failing that, something that can help you in your quest.  Bending down to rummage through an old heap of rubbish, you complain aloud that this is hardly the sort of thing you expected to be doing as a champion. Suddenly, you hear a \'thwip\' and something shoots past your face, embedding into the stone beside your head and trembling with the impact.\n\n', false );
					MainView.outputText( '"<i>Don\'t make any sudden moves!</i>" A voice calls out, high pitched and a little squeaky, but firm and commanding. You freeze to avoid giving your assailant a reason to shoot at you again. "<i>Stand up and turn around, slowly,</i>" it commands again. You do as you are told.\n\n', false );
					//[Jojo previously encountered];
					if( SceneLib.jojoScene.monk > 0 ) {
						MainView.outputText( 'The creature that has cornered you is clearly of the same race as Jojo, though notably a female member of his species. Her fur is thick with dust, but you can still easily make out its auburn color. Her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can\'t be any larger than an A-cup. She wears a tattered pair of pants and an equally ragged-looking shirt. A very large and wicked-looking dagger – more of a short sword really – is strapped to her hip, and she is menacing you with a blowpipe.\n\n', false );
					}
					//[Jojo not previously encountered];
					else {
						MainView.outputText( 'You have been cornered by a very strange being bipedal female humanoid with the unmistakable features of a giant mouse; paw-like feet, a muzzled head with long whiskers, large mouse ears, and a body covered in dust-caked auburn fur. It doesn\'t look like she has had a very easy life; her clothing consists of a dirty, tattered set of pants and shirt, while her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can\'t be any larger than an A-cup. Still, she looks quite capable of defending herself; not only is she brandishing a blowpipe, clearly ready to spit another doubtlessly-poisoned dart at you, but she has a formidable-looking knife strapped to her hip.\n\n', false );
					}
					MainView.outputText( 'She looks at you for a few long moments, and then lowers her blowpipe, "<i>I\'m sorry about that, but I thought you were another demon. They destroyed this place years ago, but some of the damn scavengers still occasionally drift through. Not so much lately, of course. I\'ve made something of an impression on them.</i>" She grins malevolently, one hand caressing the blade of her knife in an almost sensual fashion. "<i>My name is Amily, the last survivor of this village. All of my people are gone now; they\'re scattered, dead, enslaved, or worse. What about you? ', false );
					if( CoC.player.humanScore() > 4 ) {
						MainView.outputText( 'Are you ', false );
					} else {
						MainView.outputText( 'Were you ', false );
					}
					MainView.outputText( 'one of those... humans, I\'ve heard sometimes wander into this world?</i>"\n\n', false );
					MainView.outputText( 'You admit that, yes, you are a human, and then ask her why she remains here in this empty wasteland of a settlement.\n\n', false );
					MainView.outputText( '"<i>I was born here, I grew up here, and I would have gotten married and settled down here if it hadn\'t been for those demons.</i>" She spits the word \'demons\' with contempt. "<i>After it was all over, I had nowhere else to go. So I stayed here. I\'ve still got nowhere else to go, to be honest. I haven\'t found any other settlements of my own people, and I\'d sooner die than give myself over to the demons. But it seems that if I\'m ever going to see more of my people living free, I\'m going to have to take the leading role...</i>"\n\n', false );
					MainView.outputText( 'She shakes her head and smiles at you wistfully. "<i>Listen to me, rambling. I\'m sorry again for attacking you. But, take care out there; there\'s a lot of freaky monsters that will do the most unspeakable things to a woman if they can catch her.</i>"\n\n', false );
					MainView.outputText( 'You thank her, and she brushes it off.\n\n', false );
					MainView.outputText( '"<i>Hey, us girls gotta stick together, right?</i>" She winks at you then wanders off behind a partially collapsed wall, disappearing into the rubble.', false );
					//Set flag for 'last gender met as';
					CoC.flags[ kFLAGS.AMILY_PC_GENDER ] = CoC.player.gender;
					EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
					return;
				}
				//Lesbo lovin confession!;
				if( CoC.flags[ kFLAGS.AMILY_CONFESSED_LESBIAN ] === 0 && CoC.flags[ kFLAGS.AMILY_AFFECTION ] >= 25 ) {
					this.amilyIsTotallyALesbo();
					return;
				}
				//Amily totally grows a wang for you once she loves you;
				if( CoC.flags[ kFLAGS.AMILY_CONFESSED_LESBIAN ] === 2 && CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] === 0 ) {
					this.amilyPostConfessionGirlRemeeting();
					return;
				}
				//If PC shot down love confession, cap affection at 35 and re-offer?;
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] > 35 && CoC.flags[ kFLAGS.AMILY_CONFESSED_LESBIAN ] === 1 ) {
					CoC.flags[ kFLAGS.AMILY_AFFECTION ] = 35;
					this.amilyIsTotallyALesbo();
					return;
				}
			}
			//Herm Meetinz;
			else if( CoC.player.gender === 3 ) {
				//First time;
				if( CoC.flags[ kFLAGS.AMILY_MET ] === 0 ) {
					//Set flag for what she met the player as.;
					CoC.flags[ kFLAGS.AMILY_MET_AS ] = CoC.player.gender;
					//set 'met' to true;
					CoC.flags[ kFLAGS.AMILY_MET ]++;
					MainView.outputText( 'You wind your way deep into the maze of dusty crumbling buildings and twisted saplings, looking for any sign of life – or, failing that, something that can help you in your quest.  Bending down to rummage through an old heap of rubbish, you complain aloud that this is hardly the sort of thing you expected to be doing as a champion. Suddenly, you hear a \'thwip\' and something shoots past your face, embedding into the stone beside your head and trembling with the impact.\n\n', false );
					MainView.outputText( '"<i>Don\'t make any sudden moves!</i>" A voice calls out, high pitched and a little squeaky, but firm and commanding. You freeze to avoid giving your assailant a reason to shoot at you again. "<i>Stand up and turn around, slowly,</i>" it commands again. You do as you are told.\n\n', false );
					//[Jojo previously encountered];
					if( SceneLib.jojoScene.monk > 0 ) {
						MainView.outputText( 'The creature that has cornered you is clearly of the same race as Jojo, though notably a female member of his species. Her fur is thick with dust, but you can still easily make out its auburn color. Her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can\'t be any larger than an A-cup. She wears a tattered pair of pants and an equally ragged-looking shirt. A very large and wicked-looking dagger – more of a short sword really – is strapped to her hip, and she is menacing you with a blowpipe.\n\n', false );
					}
					//[Jojo not previously encountered];
					else {
						MainView.outputText( 'You have been cornered by a very strange being bipedal female humanoid with the unmistakable features of a giant mouse; paw-like feet, a muzzled head with long whiskers, large mouse ears, and a body covered in dust-caked auburn fur. It doesn\'t look like she has had a very easy life; her clothing consists of a dirty, tattered set of pants and shirt, while her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can\'t be any larger than an A-cup. Still, she looks quite capable of defending herself; not only is she brandishing a blowpipe, clearly ready to spit another doubtlessly-poisoned dart at you, but she has a formidable-looking knife strapped to her hip.\n\n', false );
					}
					MainView.outputText( 'She looks at you for a few long moments, and then lowers her blowpipe, "<i>I\'m sorry about that, but I thought you were another demon. They destroyed this place years ago, but some of the damn scavengers still occasionally drift through. Not so much lately, of course. I\'ve made something of an impression on them.</i>" She grins malevolently, one hand caressing the blade of her knife in an almost sensual fashion. "<i>My name is Amily, the last survivor of this village. All of my people are gone now; they\'re scattered, dead, enslaved, or worse. What about you? ', false );
					if( CoC.player.humanScore() > 4 ) {
						MainView.outputText( 'Are you ', false );
					} else {
						MainView.outputText( 'Were you ', false );
					}
					MainView.outputText( 'one of those... humans, I\'ve heard sometimes wander into this world?</i>"\n\n', false );
					MainView.outputText( 'You admit that, yes, you are a human, and then ask her why she remains here in this empty wasteland of a settlement.\n\n', false );
					MainView.outputText( '"<i>I was born here, I grew up here, and I would have gotten married and settled down here if it hadn\'t been for those demons.</i>" She spits the word \'demons\' with contempt. "<i>After it was all over, I had nowhere else to go. So I stayed here. I\'ve still got nowhere else to go, to be honest. I haven\'t found any other settlements of my own people, and I\'d sooner die than give myself over to the demons. But it seems that if I\'m ever going to see more of my people living free, I\'m going to have to take the leading role...</i>"\n\n', false );
					MainView.outputText( 'She looks thoughtful. "<i>You know...</i>" She begins, but stops and ', false );
					//[If breasts are flat, manly breasts];
					if( CoC.player.biggestTitSize() < 1 ) {
						MainView.outputText( 'sniffs the air intensely, her whiskers quivering. ', false );
					}//[If breasts are A-cup or bigger];
					else {
						MainView.outputText( 'stares at the bulge in your top, as well as the bulge in your bottom.  ', false );
					}
					MainView.outputText( '"<i>Never mind,</i>" she says after a moment. "<i>You\'re a hermaphrodite, aren\'t you? Forget I mentioned it.</i>"\n\n', false );
					MainView.outputText( 'She turns and walks away, vanishing into the dust and the rubble like magic.', false );
					//Set flag for 'last gender met as';
					CoC.flags[ kFLAGS.AMILY_PC_GENDER ] = CoC.player.gender;
					EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
					return;
				}
				//Medium affection 33% chance, guaranteed by 20.;
				//Requires she hasn't yet given this scene!;
				if( ((CoC.flags[ kFLAGS.AMILY_AFFECTION ] >= 15 && Utils.rand( 3 ) === 0) || CoC.flags[ kFLAGS.AMILY_AFFECTION ] >= 20) && CoC.flags[ kFLAGS.AMILY_HERM_QUEST ] === 0 ) {
					this.whyNotHerms();
					return;
				}
				if( CoC.flags[ kFLAGS.AMILY_HERM_QUEST ] === 1 ) {
					this.maybeHermsAintAllBadBITCH();
					return;
				}
			}
			//Genderless;
			else if( CoC.player.gender === 0 ) {
				//[First Meeting];
				if( CoC.flags[ kFLAGS.AMILY_MET ] === 0 ) {
					CoC.flags[ kFLAGS.AMILY_MET_AS ] = CoC.player.gender;
					//set 'met' to true;
					CoC.flags[ kFLAGS.AMILY_MET ]++;
					MainView.outputText( 'You wind your way deep into the maze of dusty crumbling buildings and twisted saplings, looking for any sign of life – or, failing that, something that can help you in your quest.  Bending down to rummage through an old heap of rubbish, you complain aloud that this is hardly the sort of thing you expected to be doing as a champion. Suddenly, you hear a \'thwip\' and something shoots past your face, embedding into the stone beside your head and trembling with the impact.\n\n', false );
					MainView.outputText( '"<i>Don\'t make any sudden moves!</i>" A voice calls out, high pitched and a little squeaky, but firm and commanding. You freeze to avoid giving your assailant a reason to shoot at you again. "<i>Stand up and turn around, slowly,</i>" it commands again. You do as you are told.\n\n', false );
					//[Jojo previously encountered];
					if( SceneLib.jojoScene.monk > 0 ) {
						MainView.outputText( 'The creature that has cornered you is clearly of the same race as Jojo, though notably a female member of his species. Her fur is thick with dust, but you can still easily make out its auburn color. Her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can\'t be any larger than an A-cup. She wears a tattered pair of pants and an equally ragged-looking shirt. A very large and wicked-looking dagger – more of a short sword really – is strapped to her hip, and she is menacing you with a blowpipe.\n\n', false );
					}
					//[Jojo not previously encountered];
					else {
						MainView.outputText( 'You have been cornered by a very strange being bipedal female humanoid with the unmistakable features of a giant mouse; paw-like feet, a muzzled head with long whiskers, large mouse ears, and a body covered in dust-caked auburn fur. It doesn\'t look like she has had a very easy life; her clothing consists of a dirty, tattered set of pants and shirt, while her limbs and midriff are wiry, hardened as much by meals that are less than frequent as by constant exercise and physical exertion. Her buttocks are non-existent, and her breasts can\'t be any larger than an A-cup. Still, she looks quite capable of defending herself; not only is she brandishing a blowpipe, clearly ready to spit another doubtlessly-poisoned dart at you, but she has a formidable-looking knife strapped to her hip.\n\n', false );
					}
					MainView.outputText( 'She looks at you for a few long moments, and then lowers her blowpipe, "<i>I\'m sorry about that, but I thought you were another demon. They destroyed this place years ago, but some of the damn scavengers still occasionally drift through. Not so much lately, of course. I\'ve made something of an impression on them.</i>" She grins malevolently, one hand caressing the blade of her knife in an almost sensual fashion. "<i>My name is Amily, the last survivor of this village. All of my people are gone now; they\'re scattered, dead, enslaved, or worse. What about you? ', false );
					if( CoC.player.humanScore() > 4 ) {
						MainView.outputText( 'Are you ', false );
					} else {
						MainView.outputText( 'Were you ', false );
					}
					MainView.outputText( 'one of those... humans, I\'ve heard sometimes wander into this world?</i>"\n\n', false );
					MainView.outputText( 'You admit that, yes, you are a human, and then ask her why she remains here in this empty wasteland of a settlement.\n\n', false );
					MainView.outputText( '"<i>I was born here, I grew up here, and I would have gotten married and settled down here if it hadn\'t been for those demons.</i>" She spits the word \'demons\' with contempt. "<i>After it was all over, I had nowhere else to go. So I stayed here. I\'ve still got nowhere else to go, to be honest. I haven\'t found any other settlements of my own people, and I\'d sooner die than give myself over to the demons. But it seems that if I\'m ever going to see more of my people living free, I\'m going to have to take the leading role...</i>"\n\n', false );
					//(If breasts < A-Cup);
					if( CoC.player.biggestTitSize() < 1 ) {
						MainView.outputText( 'She stares at you intently, and you ask her what the matter is.\n\n', false );
						MainView.outputText( '"<i>You see, that role I was talking about? I\'ve had a long time to think about it, and there\'s no one else for it. If there are ever going to be more of my kind born into freedom, they\'re going to have to be born. Literally; I need to find a mate that is pure, one that can give me strong and pure children of my own kind,</i>" she explains, one hand absently touching her flat belly. "<i>The few males of my kind that I\'ve managed to find are demon slaves – far too corrupt to make suitable mates, even if I could free them. I\'ve heard, though, that humans are strangely weak breeders; your seed would be free of taint, and you would father more of my own kind. Unlike, say, an imp or a minotaur.</i>"\n\n', false );
						MainView.outputText( 'She tucks her blowpipe into her belt and takes several uncertain steps towards you, trying to appear winning – flirtatious even – despite her grimy appearance and clear inexperience with the matter. "<i>Please, will you help me? You said something about being a champion – if you lay with me and help me bring more of my people into this world, free of the demons and untouched by their perverse taint, you will be striking another kind of blow against their corrupt stranglehold on Mareth.</i>"\n\n', false );
						MainView.outputText( 'Sheepishly, you look down at the ground and confess that as much as you might like to help, that\'s actually impossible.\n\n', false );
						MainView.outputText( 'Amily looks hurt. "<i>Why?</i>" she demands desperately.\n\n', false );
						MainView.outputText( 'Highly embarrassed but unable to think of a way to articulate it, you drop your pants and let her see the flat and featureless expanse of flesh that is your crotch.\n\n', false );
						MainView.outputText( 'Amily\'s eyes bug out, her jaw falls slack and she stares at you, clearly gobsmacked. Then she spits a stream of incoherent, dumbfounded profanities. Finally, she shakes her head. "<i>Well... that\'s a new one. I guess... it makes sense. Damn, just when you thought you\'d seen it all. I suppose I should go now,</i>" she tells you and turns to leave.\n\n', false );
						MainView.outputText( 'She stops, however, just before rounding a wall. "<i>There\'s this stuff you\'ll find in bottles called Incubus Draft. If you drink that, it\'ll make you a boy - but I\'d find an alchemist first, so he can remove the corruption from it.</i>"\n\n', false );
						MainView.outputText( 'She continues walking away. After she has vanished, though, another musing drifts back to you. "<i>There\'s also this stuff called Succubus Milk you can do the same thing with, if you want to be a girl.</i>"\n\n', false );
					}
					//(If breasts > A-Cup);
					else {
						MainView.outputText( 'She shakes her head and smiles at you wistfully. "<i>Listen to me, rambling. I\'m sorry again for attacking you. But, take care out there; there\'s a lot of freaky monsters that will do the most unspeakable things to a woman if they can catch her.</i>"\n\n', false );
						MainView.outputText( 'Blushing, you explain to her that you aren\'t actually a woman. She looks very puzzled at this.\n\n', false );
						MainView.outputText( '"<i>But you have boobs... and I don\'t see a crotch-bulge,</i>" she says, sounding almost petulant. "<i>I don\'t smell a vagina, either... Wait, are you telling me you don\'t have either pair of genitals?</i>" she asks, clearly dumbfounded.\n\n', false );
						MainView.outputText( 'Embarrassed, you admit that is so.\n\n', false );
						MainView.outputText( 'Amily stares at you, clearly at a loss for words, and then shakes her head in disbelief. She tries to give you a smile. "<i>Well... us girls gotta stick together, right? If you look for a bottle of Succubus Milk – Imps seem to carry it on occasion, though I don\'t know why – then you can drink it to get your vagina back. Also, I\'d find an alchemist first, so he can remove the corruption from it.</i>"\n\n', false );
						MainView.outputText( 'Having evidently regained her confidence, she winks and then vanishes behind a tumbled-down wall, leaving you alone.', false );
					}
					//Set flag for 'last gender met as';
					CoC.flags[ kFLAGS.AMILY_PC_GENDER ] = CoC.player.gender;
					EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
					return;
				}
			}
		}
		//[Normal Remeeting];
		//Did the PC genderchange?  OH SHIT SON!;
		//Alternatively: get bitched at;
		if( CoC.flags[ kFLAGS.AMILY_PC_GENDER ] !== CoC.player.gender ) {
			this.amilyNewGenderConfrontation();
			return;
		}
		MainView.outputText( 'Curious on how Amily is holding up, you head back into the ruined village. This time you don\'t bother trying to hide your presence, hoping to attract Amily\'s attention quicker. After all, she did say that the place is basically empty of anyone except her, and you can otherwise handle a measly Imp or Goblin.\n\n', false );
		switch( this.pregnancy.event ) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: //Amily is slightly pregnant
				MainView.outputText( 'Amily materializes out of the ruins somewhat slower than usual. You can see that your efforts together have taken; an undeniable bulge pokes out of her midriff, pushing up her tattered shirt slightly and seriously straining her belt. She idly rubs it with one hand, as if confirming its presence to herself.\n\n', false );
				//[Low Affection];
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 || CoC.player.gender === 0 ) {
					MainView.outputText( '"<i>Well, I guess despite whatever other faults you may have, you can get the job done.</i>" She says, not looking directly at you.\n\n', false );
				}
				//[Medium Affection];
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( '"<i>Thank you. With your help, my people will soon live again.</i>" She strokes her belly, grinning happily. "<i>Is there something you want to talk about?</i>"\n\n', false );
				}
				//[High Affection];
				else {
					MainView.outputText( '"<i>Thank you, thank you! I couldn\'t have done this without you!</i>" She exclaims. "<i>You\'ve done a wonderful, noble thing, and I\'m glad I found you to be their father. So, not that it isn\'t great to see you again, but why did you come to visit?</i>"\n\n', false );
				}
				break;
			case 6:
			case 7:
			case 8: //Amily is heavily pregnant
				MainView.outputText( 'It takes several minutes before Amily appears, but when you see her, you marvel at how she got to you as quickly as she did. Her stomach is hugely swollen; one of her hands actually cradles underneath its rounded expanse, as if trying to hold it up. She is pants-less, evidently no longer able to fit into them. Her shirt drapes loosely, barely managing to cover the upper half of her firm orb of a belly. The belt where she hangs her blowpipe and dagger has been tied around her upper chest like a sash – between her breasts and her bulge – so she can still carry her weapons effectively.\n\n', false );
				//[Low Affection];
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 || CoC.player.gender === 0 ) {
					MainView.outputText( 'She seems to be paying more attention to her gravid midriff than to you, and it\'s several long moments before she finally speaks. "<i>These children will be born soon. I guess I owe you my thanks for being willing to father them.</i>"\n\n', false );
				}
				//[Medium Affection];
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( 'She groans softly. "<i>This isn\'t an easy task, you know. But I still want to thank you. Maybe, when these ones are born, you\'ll be willing to help me make some more?</i>" She asks, her tail gently waving behind her.\n\n', false );
				}
				//[High Affection];
				else {
					MainView.outputText( '"<i>I should have known you were coming; they always start kicking up a storm when you\'re here – did you know that?</i>" She smiles beatifically. "<i>They know their daddy already, they do. With your help, a new generation of my people will have a chance to grow up free from the taint of demons. Was there something on your mind?</i>"\n\n', false );
				}
				break;
			default: //Amily is not pregnant
				MainView.outputText( 'It doesn\'t take long for Amily to materialize out of the ruins. Her blowpipe and dagger are both thrust into her belt, and she\'s still wearing the same tattered clothes as before.\n\n', false );
				//[Low Affection];
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 || CoC.player.gender === 0 ) {
					if( CoC.flags[ kFLAGS.AMILY_MET_AS ] === 2 && CoC.player.gender === 2 ) {
						MainView.outputText( 'She crosses her arms and smiles at you. "<i>So you came back huh?  Did you want to chat with little old me?</i>" she asks.\n\n', false );
					} else {
						MainView.outputText( 'She crosses her arms and taps her fingers on her shoulder. "<i>So, why are you here? What do you want?</i>" she asks.\n\n', false );
					}
				}
				//[Medium Affection];
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( 'She smiles softly upon seeing you. "<i>It\'s always good to see somebody else who hasn\'t given in to corruption. Did you have something on your mind?</i>"\n\n', false );
				}
				//[High Affection];
				else {
					MainView.outputText( 'She grins at you with open delight. "<i>Hey there, ' + CoC.player.short + '! It\'s great to see you again... ', false );
					if( CoC.player.hasCock() ) {
						MainView.outputText( 'Have you come to knock me up?', false );
						if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 && CoC.player.pregnancyIncubation === 0 ) {
							MainView.outputText( ' Or have you come to get knocked up?', false );
						}
					} else if( CoC.player.hasVagina() ) {
						if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 && CoC.player.pregnancyIncubation === 0 ) {
							MainView.outputText( 'Have you come back so I could stuff another bun in your oven?', false );
						} else {
							MainView.outputText( 'Did you come back for a little \'quality time\' with me?', false );
						}
					}
					MainView.outputText( '</i>" she teases, but her body language ', false );
					if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
						MainView.outputText( 'and the erection tenting her pants ', false );
						EngineCore.dynStats( 'lus', 5 );
					}
					MainView.outputText( 'suggests that it\'s no joking matter.\n\n', false );
				}
		}
		//Sex / Talk / Talk then sex;
		var efficiency = null;
		//Amily is not a herm but is ok with herm-daddying!;
		if( CoC.player.hasItem( ConsumableLib.P_DRAFT ) && CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] === 0 && CoC.flags[ kFLAGS.AMILY_HERM_QUEST ] === 2 && CoC.flags[ kFLAGS.AMILY_AFFECTION ] >= 40 && CoC.player.gender === 3 ) {
			efficiency = this.makeAmilyAHerm;
			MainView.outputText( 'You could probably bring up the efficiency of having two hermaphrodite mothers, particularly since you have this purified incubi draft handy.\n\n', false );
		}
		var sex = this.determineAmilySexEvent();
		EngineCore.choices( 'Sex', this, sex, 'Talk', this, this.talkToAmily, 'Both', this, (sex === null ? null : this.talkThenSexWithAmily), 'Efficiency', this, efficiency, 'Leave', SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		//Set flag for 'last gender met as';
		CoC.flags[ kFLAGS.AMILY_PC_GENDER ] = CoC.player.gender;
	};
	AmilyScene.prototype.determineAmilySexEvent = function( forced ) {
		var sex = null;
		if( !forced && CoC.player.lust < 35 ) {
			return null;
		}
		//If Amily is lesbo lover!;
		if( CoC.flags[ kFLAGS.AMILY_CONFESSED_LESBIAN ] > 0 && CoC.player.gender === 2 ) {
			//Futa amily!;
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				//If not pregnant, always get fucked!;
				if( !this.pregnancy.isPregnant ) {
					sex = this.hermilyOnFemalePC;
				}
				//else 50/50;
				else {
					if( Utils.rand( 2 ) === 0 ) {
						sex = this.girlyGirlMouseSex;
					} else {
						sex = this.hermilyOnFemalePC;
					}
				}
			}
			//LESBO LUVIN!;
			else {
				sex = this.girlyGirlMouseSex;
			}
		}
		//If Amily is a herm lover!;
		if( CoC.player.gender === 3 && CoC.flags[ kFLAGS.AMILY_HERM_QUEST ] === 2 ) {
			//Amily is herm too!;
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				//If Amily is not pregnant;
				if( !this.pregnancy.isPregnant ) {
					//If PC is also not pregnant, 50/50 odds;
					if( !CoC.player.isPregnant() ) {
						//Herm Amily knocks up PC;
						if( Utils.rand( 2 ) === 0 ) {
							sex = this.hermilyOnFemalePC;
						}
						//PC uses dick on amily;
						else {
							if( forced ) {
								sex = this.amilySexHappens;
							} else {
								sex = this.sexWithAmily;
							}
						}
					}
					//If PC is preg, knock up amily.;
					else {
						if( forced ) {
							sex = this.amilySexHappens;
						} else {
							sex = this.sexWithAmily;
						}
					}
				}
				//Amily is preg;
				else {
					//Pc is not;
					if( !CoC.player.isPregnant() ) {
						sex = this.hermilyOnFemalePC;
					}
					//PC is preg too!;
					else {
						//Herm Amily knocks up PC;
						if( Utils.rand( 2 ) === 0 ) {
							sex = this.hermilyOnFemalePC;
						}
						//PC uses dick on amily;
						else {
							if( forced ) {
								sex = this.amilySexHappens;
							} else {
								sex = this.sexWithAmily;
							}
						}
					}
				}
			}
			//Amily still girl!;
			else {
				//Not pregnant? KNOCK THAT SHIT UP;
				if( !this.pregnancy.isPregnant ) {
					sex = this.sexWithAmily;
				}
				//Pregnant?  Random tribbing!;
				else {
					//Lesbogrind;
					if( Utils.rand( 2 ) === 0 ) {
						sex = this.girlyGirlMouseSex;
					}
					//Fuck!;
					else {
						if( forced ) {
							sex = this.amilySexHappens;
						} else {
							sex = this.sexWithAmily;
						}
					}
				}
			}
		}
		//Dudesex!;
		if( CoC.player.gender === 1 ) {
			if( forced ) {
				sex = this.amilySexHappens;
			} else {
				sex = this.sexWithAmily;
			}
		}
		return sex;
	};
	//[Accept Eagerly];
	AmilyScene.prototype.acceptAmilysOfferEagerly = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You grin lecherously, unable to help it. It\'s rare when someone in this world wants to fuck and actually asks you, rather than just trying to beat you senseless and then rape you. You tell Amily that if she wants you to fuck her, you\'ll be happy to do so.\n\n', false );
		MainView.outputText( 'The mouse-woman looks appalled. "<i>Must you be so vulgar?</i>" she complains.\n\n', false );
		MainView.outputText( 'You tell her that this is precisely what she\'s asking you to do, and you\'ll be happy to do so if that is what she wants.\n\n', false );
		MainView.outputText( 'She still looks disgruntled. "<i>Very well, come on. I suppose it was too much to hope that you would be roaming this world and yet still have some decorum when it comes to sex...</i>" She begins leading the way and you follow. She doesn\'t have much of a butt to stare at, but you can already think of some interesting things to do with that tail of hers...\n\n', false );
		MainView.outputText( 'Your brash enthusiasm has made Amily uncomfortable, and your quick surrender to baser impulses has made you slightly more lustful.', false );
		//Offer accepted;
		CoC.flags[ kFLAGS.AMILY_OFFER_ACCEPTED ] = 1;
		//[-5 Affection];
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] -= 5;
		//[+5 Libido];
		EngineCore.dynStats( 'lib', 5 );
		//[/ Go to [First Time Sex]];
		EngineCore.doNext( this, this.amilySexHappens );
	};
	//[Accept Hesitantly];
	AmilyScene.prototype.acceptAmilyOfferHesitantly = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'The offer is shocking... and yet, strangely enticing. You cannot help but think that it\'s nice to meet somebody who, even if they are more sexually explicit than in your village, actually approaches the matter with some decorum. You are still surprised and even embarrassed by the invitation, but you can\'t help but think it might be worthwhile to accept. It\'s for a good cause, and she\'s clearly not entirely comfortable with it herself. Maybe you\'ve been too long in this world of beast-people and monsters, but she actually is kind of cute.\n\n', false );
		MainView.outputText( 'Softly, you ask if she really does want you to mate with her, to father her offspring.\n\n', false );
		MainView.outputText( '"<i>Yes. You\'re the best hope I have... the only hope I have.</i>" She replies, sadly.\n\n', false );
		MainView.outputText( 'You bow your head and tell her that if she really does need your help, you will help her – even if it does mean doing things with her that she doesn\'t want.\n\n', false );
		MainView.outputText( 'She blinks at you, clearly surprised. "<i>I\'ve never met a male who actually cared if a female wanted sex or not...</i>" She then smiles gently. "<i>It\'s nice to meet somebody who can still care about people as something other than fuck toys. Please, come with me.</i>"\n\n', false );
		MainView.outputText( 'She eagerly leads you down a path, her tail swishing back and forth energetically. She seems very happy by your acceptance.\n\n', false );
		MainView.outputText( 'It seems you\'ve made Amily happy by asking if this is what she wants.', false );
		//Offer accepted;
		CoC.flags[ kFLAGS.AMILY_OFFER_ACCEPTED ] = 1;
		//{+5 Affection};
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 5;
		//[/ Go to [First Time Sex]];
		EngineCore.doNext( this, this.amilySexHappens );
	};
	//[Refuse];
	AmilyScene.prototype.refuseAmilysOffer = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You shake your head in refusal.\n\n', false );
		MainView.outputText( 'Amily stares at you in disbelief. "<i>No? What do you mean, no? I\'m honestly offering to have sex with you here.</i>"\n\n', false );
		MainView.outputText( 'You tell her that you can\'t simply have sex with some stranger who you have never met before, especially when that stranger admits it would just be a casual, unfeeling, emotionally hollow act. You dread the idea of simply whoring yourself out, even for an evidently noble cause as this - it\'s just not right. You came to this world to try and fight the hedonism and lechery that the demons represent, not to support it or, worse, give in to it yourself.\n\n', false );
		MainView.outputText( 'Amily is wide-eyed when you finish. "<i>I have... I haven\'t heard anybody say things like that, think like that, in a long time.</i>" She smiles, faintly, then fiercely shakes her head. "<i>I really do need your help... but I can only respect your conviction. I do hope that we can come to terms later, though.</i>"\n\n', false );
		MainView.outputText( 'She gives you a bow and then leaves, giving you the chance to turn around and leave this ruined village yourself.\n\n', false );
		MainView.outputText( 'You have impressed Amily considerably, and reigning in your sexual impulses has helped to calm your libido.\n\n', false );
		//{+10 Affection};
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 10;
		//{-5 Libido};
		EngineCore.dynStats( 'lib', -2 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[Announce yourself];
	AmilyScene.prototype.remeetingAmilyAnnounceSelf = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'Reasoning that it\'s best not to scare someone like Amily, you clear your throat nosily. Amily whirls around to face you and immediately draws her knife into a defensive position. When she sees that it\'s you, she blinks a few times before grinning in surprise. "<i>Why hello, ' + CoC.player.short + '; good to see you again! It\'s nice to be reminded that there\'s another person out here who hasn\'t become a brainless fuck-puppet.</i>" Her mood then sobers.\n\n', false );
		EngineCore.doNext( this, this.amilyRemeetingContinued );
	};
	//[Scare her];
	AmilyScene.prototype.remeetingAmilyScare = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'Grinning with mischief, you carefully sneak up behind her. Suddenly grabbing her shoulders, you shout, "<i>Gotcha!</i>" She jolts with a panicked squeal and whirls around, bringing along a scything slash from her dagger!\n\n', false );
		//[Player Speed less than 50];
		if( CoC.player.spe < 50 || CoC.player.findPerk( PerkLib.Evade ) < 0 ) {
			//{Player takes minor HP damage};
			CoC.player.takeDamage( 5 );
			MainView.outputText( 'You scramble backwards, but it still cuts a nasty gash into your flesh.  Amily looks poised to strike again, but stops when she sees that it\'s you. She looks apologetic – well, somewhat. "<i>Are you all right? I\'m sorry, but that was honestly the stupidest thing I\'ve ever seen someone do!</i>" She approaches you and makes sure that you aren\'t seriously hurt. "<i>You\'ll live,</i>" she says rather quickly.\n\n', false );
		}
		//[Player Speed is 50 or higher];
		else {
			MainView.outputText( 'You manage to leap backwards just in time to avoid a strike that could have seriously hurt you. Amily recovers quickly and readies her knife again, only to realize that it\'s you. An irritated expression crosses her face. "<i>Are you insane!? Do you have any idea how stupid that was? I could have killed you!</i>" she bellows, before slowly calming down. "<i>Ah, well... no harm, no foul, I guess...</i>"\n\n', false );
		}
		EngineCore.doNext( this, this.amilyRemeetingContinued );
	};
	AmilyScene.prototype.amilyRemeetingContinued = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( '"<i>So, have you changed your mind? Have you come to help me out?</i>" Amily asks curiously.\n\n', false );
		//Accept / Politely refuse / Here to talk / Get lost;
		EngineCore.choices( 'Accept', this, this.secondTimeAmilyOfferedAccepted, 'RefusePolite', this, this.secondTimeAmilyRefuseAgain, 'Just Talk', this, this.repeatAmilyTalk, 'Get Lost', this, this.tellAmilyToGetLost, 'Leave', SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[Accept];
	AmilyScene.prototype.secondTimeAmilyOfferedAccepted = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You tell her that, yes – you\'ll give her the children she wants. She smiles pleasantly and tells you to follow her.\n\n', false );
		//Offer accepted;
		CoC.flags[ kFLAGS.AMILY_OFFER_ACCEPTED ] = 1;
		//[/ Go to [First Time Sex]];
		EngineCore.doNext( this, this.amilySexHappens );
	};

	//[Politely refuse];
	AmilyScene.prototype.secondTimeAmilyRefuseAgain = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You shake your head gently and explain that your position has not changed. Amily looks annoyed, but respects your decision.\n\n', false );
		MainView.outputText( '"<i>All right; it is your choice. But my offer still stands, you know,</i>" she tells you.\n\n', false );
		MainView.outputText( 'You let her know you\'ll remember that, and then turn and leave.', false );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[Here to talk];
	AmilyScene.prototype.repeatAmilyTalk = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You tell her that you only wanted to talk.\n\n', false );
		MainView.outputText( '"<i>Just to talk?</i>" Amily asks, and then adds quietly, "<i>Well... it has been a long time since I actually had somebody to talk to...</i>" She looks distracted for a moment, but then she smiles. Clearly, Amily is pleased with the prospect. "<i>So, is there anything in particular you want to talk about?</i>"\n\n', false );
		//[/ Go to random [Conversation]];
		EngineCore.doNext( this, this.talkWithCuntIMeanAmily );
	};
	//[Get Lost];
	AmilyScene.prototype.tellAmilyToGetLost = function() {
		this.amilySprite();
		MainView.outputText( 'You jeer at Amily that you have no interest in a hypocrite who claims to be pure but is really just like everything else in this tainted world; no higher purpose other than her next fuck.\n\n', false );
		MainView.outputText( 'Amily goes red with rage. "<i>Why you arrogant, puffed-up, pigheaded...!</i>" She\'s livid! "<i>The demons\'ll have you – see if they don\'t! I don\'t need you – you\'re probably infertile anyway, you—</i>" She trails off into a stream of the most perverse profanity you have ever heard, and then runs off into the ruins.\n\n', false );
		MainView.outputText( 'You spin on your heel and stalk off. You figure that she will go out of her way to avoid you in the future; there\'s no point coming back here.', false );
		//{Amily can no longer be encountered};
		CoC.flags[ kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED ] = 1;
		//{Ruined Village removed from Places list};
		//I think one variable can handle both these...;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};

	//[Sex];
	AmilyScene.prototype.sexWithAmily = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You tell Amily that you came here because you wanted to have sex with her.\n\n', false );
		switch( this.pregnancy.event ) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: //Amily is slightly pregnant
				//[Low Affection];
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( 'She stares at you, puzzled. "<i>Why? I\'m already pregnant,</i>" she tells you. "<i>...Forget it. You can have sex when I need to get pregnant again. Go find a goblin if you want to fuck some brainless baby-stuffed whore!</i>"\n\n', false );
					MainView.outputText( 'Amily can still move quickly despite her pregnancy, and you are very promptly left all alone. Perhaps it would be better not to broach the subject that bluntly with her while she\'s in this state.\n\n', false );
					//Reduce affection. DERP;
					CoC.flags[ kFLAGS.AMILY_AFFECTION ] -= 3;
					EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
				}
				//[Medium Affection];
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( 'She is clearly surprised, putting a hand to her swelling midriff. But then she shrugs and says, "<i>Well, I guess I do owe you that much for helping me.</i>"\n\n', false );
					MainView.outputText( 'Though she does set off and indicate for you to follow, you realize that she\'s not too happy about your reason for being here.\n\n', false );
					//[/ Go to [Medium Affection Sex]];
					EngineCore.doNext( this, this.amilySexHappens );
				}
				//[High Affection];
				else {
					MainView.outputText( '"<i>You still want me, even though I\'m already pregnant?</i>" she asks – not angry or disappointed, but sounding rather pleased. "<i>Well, how can I say no to you?</i>" She smiles broadly and begins to walk away, doing her best to give you a sexy wiggle of her hips as an invitation for you to follow her.\n\n', false );
					//[/ Go to [High Affection Sex]];
					EngineCore.doNext( this, this.amilySexHappens );
				}
				break;
			case 6:
			case 7:
			case 8: //Amily is heavily pregnant
				//[Low Affection];
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( 'Her disbelief is quite obvious. She stares at her belly, then at you, then at your crotch, then back at her belly again. She shakes her head, clearly looking disgusted. "<i>What kind of sicko are you? Look at the state of me – I\'m in no shape to have sex! Come back after I\'ve given birth, if that\'s all I mean to you!</i>"\n\n', false );
					MainView.outputText( 'Annoyed, she turns and waddles off. You do not give chase; you can tell that you\'ve offended her.\n\n', false );
					//Reduce affection;
					CoC.flags[ kFLAGS.AMILY_AFFECTION ] -= 3;
					EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
				}
				//[Medium Affection];
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( 'She boggles as if she can\'t believe you. "<i>You can\'t be that desperate you\'d want somebody as fat and knocked up as I am!</i>" she protests.\n\n', false );
					MainView.outputText( 'You insist to her that you\'re not joking – you really do think she\'s sexy enough to make love to.\n\n', false );
					MainView.outputText( '"<i>...Well, I guess I\'m flattered, but... do you have the faintest idea how to make love to a woman who is pregnant? Especially one as far along as I am?</i>"\n\n', false );
					MainView.outputText( 'You are forced to concede that, actually, you don\'t.\n\n', false );
					MainView.outputText( '"<i>It\'s not that I don\'t like you, ' + CoC.player.short + ', it\'s just... well, I don\'t feel comfortable doing that,</i>" she explains apologetically.\n\n', false );
					MainView.outputText( 'You apologize back for confronting her with something she\'s uncomfortable with, and leave for your own camp, lest you insult her seriously.', false );
					CoC.flags[ kFLAGS.AMILY_AFFECTION ] -= 3;
					EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
				}
				//[High Affection];
				else {
					MainView.outputText( 'She looks a little puzzled by the request, but then smiles with sincere pleasure. "<i>I\'m game if you are, dear.</i>" She winks and offers her hand to you. You take it, and let her lead you to her chosen nesting site.\n\n', false );
					//[/ Go to [High Affection - Heavily Pregnant Sex]];
					EngineCore.doNext( this, this.amilySexHappens );
				}
				break;
			default: //Amily is not pregnant
				//[Low Affection];
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( '"<i>Of course you did. Well, come on, I guess I can oblige you. It\'s the only way I\'m going to get pregnant.</i>"\n\n', false );
					MainView.outputText( 'She sets off, clearly leading the way as you follow her.\n\n', false );
					//[/ Go to [Low Affection Sex]];
					EngineCore.doNext( this, this.amilySexHappens );
				}
				//[Medium Affection];
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( '"<i>Well, I guess you\'ll do. I mean, I still need to get pregnant,</i>" she teases you, tail waving merrily. "<i>Follow me.</i>"\n\n', false );
					MainView.outputText( 'You have to push yourself to keep up with her, but she\'s clearly just playing with you by moving so quickly rather than seriously trying to escape you.\n\n', false );
					//[/ Go to [Low Affection Sex]];
					EngineCore.doNext( this, this.amilySexHappens );
				}
				//[High Affection];
				else {
					MainView.outputText( 'Amily doesn\'t bother to say anything; she just grins like the cat that ate the canary (well, the mouse that ate the cheesecake, anyway). She grabs hold of your hand and does her best to pull you as fast as she can towards her closest bolt-hole.\n\n', false );
					//[/ Go to [Low Affection Sex]];
					EngineCore.doNext( this, this.amilySexHappens );
				}
		}
	};
	//[Talk];
	AmilyScene.prototype.talkToAmily = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		if( CoC.flags[ kFLAGS.AMILY_MET_AS ] === 2 && CoC.player.gender === 2 ) {
			MainView.outputText( 'You tell Amily that you came here because you wanted to talk with her.\n\n', false );
		} else {
			MainView.outputText( 'You tell Amily that you came here because you wanted to talk with her, and you have no desire to approach her sexually on this encounter.\n\n', false );
		}

		//[Low Affection];
		if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
			switch( this.pregnancy.event ) {
				case 1:
				case 2:
				case 3:
				case 4:
				case 5: //Amily is slightly pregnant
					MainView.outputText( '"<i>I could use someone to talk to, I suppose,</i>" she says plainly, but you can clearly see that she\'s very happy that\'s what you want to do.\n\n', false );
					break;
				case 6:
				case 7:
				case 8: //Amily is heavily pregnant
					MainView.outputText( '"<i>Oh, NOW you want to get to know me,</i>" she complains, but her tone is gentle – amused even, and she clearly isn\'t as unhappy as her words may imply. Heavily, she sits herself down unceremoniously. "<i>But... there are things weighing on my mind. I really could use somebody to talk to.</i>"\n\n', false );
					break;
				default: //Amily is not pregnant
					if( CoC.flags[ kFLAGS.AMILY_MET_AS ] === 2 && CoC.player.gender === 2 ) {
						MainView.outputText( '"<i>A chat would be lovely,</i>" she says, clearly enjoying herself.  "<i>I... I hardly ever get a chance to find someone to chat with.  Sometimes it seems like everyone in Mareth just wants to breed non-stop...</i>" she murmers to herself.  "<i>Well, what shall we talk about?</i>" she asks, seemingly quite happy with your presence.\n\n', false );
					} else {
						MainView.outputText( '"<i>You want to talk? No sex?</i>" she asks, clearly having a hard time believing it. "<i>I... I haven\'t had the chance to talk to anyone in years. It\'s been so long...</i>" she murmurs to herself, and you think you see the start of a tear glinting in her eye. "<i>Well, what do you want to talk about?</i>" she asks, seemingly quite happy that\'s what you\'re here for.\n\n', false );
					}
			}
		}
		//[Medium Affection];
		else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
			MainView.outputText( '"<i>Of course, ' + CoC.player.short + ', I always enjoy our talks.  What shall we discuss this time?</i>" she asks happily.\n\n', false );
		}
		//[High Affection];
		else {
			MainView.outputText( 'She smiles playfully at you. "<i>And here I was thinking we knew each other already.  But if you want, I\'m always happy to talk.</i>"\n\n', false );
		}
		//[/ Go to random [Conversation]];
		EngineCore.doNext( this, this.talkWithCuntIMeanAmily );
	};
	//[Talk then sex];
	AmilyScene.prototype.talkThenSexWithAmily = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You tell Amily that you came here because you wanted to talk with her.  If she feels like having sex when you are done, though, you would be happy to oblige.\n\n', false );
		switch( this.pregnancy.event ) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: //Amily is slightly pregnant
				//[Low Affection];
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( 'She rubs her belly thoughtfully. "<i>I guess a bit of conversation would be nice, after all this time. Sex, though? Maybe if you\'re lucky.</i>" She\'s already heading off, encouraging you to follow her.\n\n', false );
					//[/ Go to random [Conversation], then small chance of [Low Affection Sex]];
					EngineCore.doNext( this, this.talkWithCuntIMeanAmily );
				}
				//[Medium Affection];
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( '"<i>Talking to you is always nice... and, why the hell not? I\'m not that big yet, I don\'t think?</i>"\n\n', false );
					MainView.outputText( 'You assure her that she still looks trim and lean to you.\n\n', false );
					MainView.outputText( '"<i>Flatterer. Come on, I have something to eat back in my den.</i>"\n\n', false );
					//[/ Go to random [Conversation], then to [Medium Affection Sex]];
					EngineCore.doNext( this, this.talkToAmilyWithSexAfter );
				}
				//[High Affection];
				else {
					MainView.outputText( '"<i>Well, I could maybe do without the sex part...</i>" Amily muses, rubbing her chin. Then she grins. "<i>We\'ll see how things work out, all right?</i>"\n\n', false );
					MainView.outputText( 'You assure her that\'s fine, and the two of you find a relatively comfortable patch to sit down on so you can talk.\n\n', false );
					//[/ Go to random [Conversation], then to [High Affection Sex]];
					EngineCore.doNext( this, this.talkToAmilyWithSexAfter );
				}
				break;
			case 6:
			case 7:
			case 8: //Amily is heavily pregnant
				//[Low Affection];
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( 'She stares at you, then smiles faintly. "<i>Talk? Talk is good... it\'s so quiet here; I spent so many years without anybody to talk to. But sex? In my condition? No, I don\'t think so.</i>"\n\n', false );
					MainView.outputText( 'Despite her refusing the prospect of sex, she happily takes a seat on a toppled column and invites you to join her.\n\n', false );
					//[/ Go to random [Conversation]];
					EngineCore.doNext( this, this.talkWithCuntIMeanAmily );
				}
				//[Medium Affection];
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( 'She blinks in surprise. "<i>The talk would be wonderful... but do you really want to have sex with me when I look like this? It gets kind of lonely around here without you, but isn\'t this,</i>" she loudly claps her hand against her belly and continues, "<i>Something of an obstacle? I mean, I don\'t know how we\'d actually make it work.</i>"\n\n', false );
					MainView.outputText( 'You are forced to concede that you don\'t have any real ideas how sex between you would work with her in her current state.\n\n', false );
					MainView.outputText( 'Amily smiles and pulls up a seat on a mound of leaf litter. "<i>That\'s all right; you meant well. And even if we can\'t have sex, we can still talk. Anything on your mind in particular?</i>"\n\n', false );
					//[/ Go to random [Conversation]];
					EngineCore.doNext( this, this.talkWithCuntIMeanAmily );
				}
				//[High Affection];
				else {
					MainView.outputText( 'She grins at you playfully. "<i>It\'s just wonderful to finally have somebody to talk to after all these years. And maybe I\'ll let you make love to me afterwards, if you\'re a good listener.</i>"\n\n', false );
					MainView.outputText( 'She waddles over to something that – in the distant past – might have been a stone seat for public convenience, and seats herself upon it heavily. "<i>So, what do you want to talk about?</i>" she asks.\n\n', false );
					//[/ Go to random [Conversation], then to [High Affection Sex – Heavily Pregnant Sex]];
					EngineCore.doNext( this, this.talkToAmilyWithSexAfter );
				}
				break;
			default: //Amily is not pregnant
				//[Low Affection];
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( '"<i>...Well, maybe you\'re not like everyone else in this world after all,</i>" she finally answers. Though she walks away without a second word, she seems rather pleased by your answer.\n\n', false );
					MainView.outputText( '"<i>Hey, hurry up!</i>" she calls back over her shoulder. You snap out of your musings and follow her.\n\n', false );
					//[/ Go to random [Conversation], then to [Low Affection Sex]];
					EngineCore.doNext( this, this.talkToAmilyWithSexAfter );
				}
				//[Medium Affection];
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( 'She smiles at you. "<i>Well... I was feeling a little tired, a little lonely, and... maybe a little horny. Why not?</i>"\n\n', false );
					MainView.outputText( 'She crooks a finger at you as a gesture to follow her.\n\n', false );
					//[/ Go to random [Conversation], then to [Medium Affection Sex]];
					EngineCore.doNext( this, this.talkToAmilyWithSexAfter );
				}
				//[High Affection];
				else {
					MainView.outputText( '"<i>Conversation with a wonderful friend, and a wonderful bout of lovemaking afterwards... Well, I guess that\'s what passes for true romance in this crazy, messed up world these days,</i>" Amily notes. She tries to sound lighthearted, but you know her well enough to sense the tinge of pain and loss in her words. Undaunted, she starts to walk off, gesturing you to follow. "<i>Come on; I can talk and walk at the same time, surely you can do the same?</i>"\n\n', false );
					//[/ Go to random [Conversation], then to [High Affection Sex]];
					EngineCore.doNext( this, this.talkToAmilyWithSexAfter );
				}
		}
	};
	//[Announce yourself];
	AmilyScene.prototype.sneakyUberAmilyRemeetingsAnnounce = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'Reasoning that it\'s best not to scare someone like Amily, you clear your throat nosily. Amily whirls around to face you and immediately draws her knife into a defensive position. When she sees that it\'s you, she blinks a few times.\n\n', false );
		switch( this.pregnancy.event ) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: //Amily is slightly pregnant
				//[Low Affection];
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( '"<i>I guess maybe I\'m starting to slow down with this hanging off of me,</i>" she grumbles. "<i>Something you wanted?</i>"\n\n', false );
				}
				//[Medium Affection];
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( '"<i>Be honest – did this make me easier to find?</i>" she asks, pushing out her belly for emphasis. Then, seemingly uncaring about the answer, she changes the subject. "<i>Is there a reason you wanted to see me?</i>"\n\n', false );
				}
				//High Affection;
				else {
					MainView.outputText( '"<i>I may be pregnant, but I didn\'t make this any easier on you now, did I?</i>" She smirks. "<i>It takes great skill to find me... but what is your reason?</i>"\n\n', false );
				}
				break;
			case 6:
			case 7:
			case 8: //Amily is heavily pregnant
				//[Low Affection];
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( '"<i>The only reason you could possibly find me is because this huge belly makes me too slow to move quickly and too big to hide. You know that, don\'t you?</i>" she proclaims defensively, before changing her tone and asking curiously, "<i>...Why are you here, anyway?</i>"\n\n', false );
				}
				//[Medium Affection];
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( '"<i>I guess it\'s not as easy for me to hide as it once was. So, why are you here?</i>"\n\n', false );
				}
				//[High Affection];
				else {
					MainView.outputText( '"<i>It\'s not easy for me to run and hide anymore, these days. I\'m glad you decided to do the guardian angel act. So, how can I thank you for coming to check on me?</i>"\n\n', false );
				}
				break;
			default: //Amily is not pregnant
				//[Low Affection];
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( '"<i>How on earth did you get here? Nobody\'s ever been able to track me!</i>" she protests. Then she shakes her head. "<i>Ah well, I guess if it\'s you, it\'s no matter. So, whaddya want?</i>"\n\n', false );
				}
				//[Medium Affection];
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( '"<i>Hmm... I\'ll have to work on that; I can\'t let just any bozo trail me,</i>" she proclaims, smiling mischievously. "<i>What\'s up?</i>"\n\n', false );
				}
				//[High Affection];
				else {
					MainView.outputText( '"<i>You\'re coming along nicely, lover mine.</i>" She smiles, proud as can be at your display of skill. "<i>So, what brings you running to me?</i>" she teases.\n\n', false );
				}
		}
		//Sex / Talk / Talk then sex;
		if( CoC.player.lust >= 33 ) {
			EngineCore.choices( 'Sex', this, this.sexWithAmily, 'Talk', this, this.talkToAmily, 'Both', this, this.talkThenSexWithAmily, '', null, null, '', null, null );
		} else {
			EngineCore.choices( '', null, null, 'Talk', this, this.talkToAmily, '', null, null, '', null, null, '', null, null );
		}
	};
	//[Scare her];
	AmilyScene.prototype.scareAmilyRemeetingsProBaws = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'Grinning with mischief, you carefully sneak up behind her. Suddenly grabbing her shoulders, you shout, "<i>Gotcha!</i>" She jolts with a panicked squeal and whirls around, bringing along a scything slash from her dagger!\n\n', false );
		//[Player Speed less than 50];
		if( CoC.player.spe < 50 ) {
			CoC.player.takeDamage( -5 );
			//{Player takes minor HP damage};
			MainView.outputText( 'You scramble backwards, but it still cuts a nasty gash into your flesh. Amily looks poised to strike again, but stops when she sees that it\'s you.\n\n', false );
			//[Low Affection];
			if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
				MainView.outputText( '"<i>Oh... It\'s you. Well, that was a dumb thing to do,</i>" she says, surprisingly collected. She roughly grabs hold of you and painfully probes your injury, causing you to yelp in pain. "<i>Big baby, you\'ll live. And let that serve a reminder not to sneak up on a survivor with a knife – not here, at least. So, what made you come here, anyway?</i>" she asks, disinterested.\n\n', false );
			}
			//[Medium Affection];
			else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
				MainView.outputText( '"<i>That\'s what happens when you surprise someone with a knife,</i>" she says, though clearly worried. "<i>Hey, are you all right?</i>" she asks.\n\n', false );
				MainView.outputText( 'You assure her that, while it hurts, it\'s nothing serious.\n\n', false );
				MainView.outputText( 'She looks relieved. "<i>That\'s good... you did kind of deserve it, but killing you for being a dummy isn\'t how I\'d like this relationship to end... So, why are you here, anyway?</i>"\n\n', false );
			}
			//[High Affection];
			else {
				MainView.outputText( '"<i>You idiot! You moron! You-you-you!</i>" she trails off incoherently, even as she practically bowls you over in her desperation to check your wound. Her touches are gentle, and she looks relieved to see it\'s only a flesh wound. Reaching into a pouch you hadn\'t noticed before, she quickly begins to bind it. "<i>It\'s only a minor injury; you\'ll be okay... but don\'t you ever startle me like that again!</i>" she squeaks loudly. "<i>I could have hurt you - did you even think about that? About what would happen if I actually hurt you?</i>"', false );
				//[If Amily is pregnant];
				if( this.pregnancy.isPregnant ) {
					MainView.outputText( '  "<i>Do you want our children to grow up without their father?</i>" she asks softly, touching her bulging belly with one hand.\n\n', false );
				}
				MainView.outputText( '\n\n', false );
				MainView.outputText( 'You apologize for your foolishness, and promise it won\'t happen again.\n\n', false );
				MainView.outputText( '"<i>See that it doesn\'t,</i>" she sniffs, primly. Then she grins in relief. "<i>So, why did you want to come and see me?</i>"\n\n', false );
			}
		}
		//[Player Speed is 50 or higher];
		else {
			MainView.outputText( 'You manage to leap backwards just in time to avoid a strike that could have seriously hurt you. Amily recovers quickly and readies her knife again, only to realize that it\'s you.\n\n', false );
			//[Low Affection];
			if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
				MainView.outputText( 'Her expression is fierce. "<i>Idiot! Don\'t sneak up on me! If you had been a little slower, I might have killed you!</i>" Amily spits indignantly. She shakes her head and mutters imprecations about your intelligence and lineage, and you wonder for a second if she\'s going to storm off. But then she calms down. "<i>Well? Spit it out! Why are you here?</i>"\n\n', false );
				MainView.outputText( 'Okay, maybe she hasn\'t entirely calmed down yet.\n\n', false );
			}
			//[Medium Affection];
			else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
				MainView.outputText( 'An irritated expression crosses her face. "<i>Are you insane!? Do you have any idea how stupid that was? I could have killed you!</i>" she bellows, before slowly calming down. "<i>Ah, well... no harm, no foul, I guess...</i>"\n\n', false );
			}
			//[High Affection];
			else {
				MainView.outputText( 'Fear gives way to relief, which is then tinged with anger. "<i>Of all the stupid half-witted stunts! Do you have any idea how dangerous that was?</i>" She latches onto you, tears starting to glimmer in her eyes. "<i>Do you know how I would have felt if I\'d hurt you - if I\'d killed you? Promise me you won\'t sneak up on me like that again!</i>"\n\n', false );
				MainView.outputText( 'You promise you won\'t startle her like that in the future, and her face lights up with relief. "<i>Good. So, that unpleasantness aside... why are you here?</i>"\n\n', false );
			}
		}
		//Sex / Talk / Talk then sex;
		//(Same as [Normal Remeeting));
		if( CoC.player.lust >= 33 ) {
			EngineCore.choices( 'Sex', this, this.sexWithAmily, 'Talk', this, this.talkToAmily, 'Both', this, this.talkThenSexWithAmily, '', null, null, '', null, null );
		} else {
			EngineCore.choices( '', null, null, 'Talk', this, this.talkToAmily, '', null, null, '', null, null, '', null, null );
		}
		//Affection -1;;
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] -= 1;
	};
	//[Desperate Plea];
	//[Announce yourself];
	AmilyScene.prototype.announceSelfOnDesperatePleaMeeting = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'Reasoning that it\'s best not to scare someone like Amily, you clear your throat nosily. Amily whirls around to face you and immediately draws her knife into a defensive position. When she sees that it\'s you, she blinks a few times before grinning in surprise. "<i>Why hello, ' + CoC.player.short + '; good to see you again! It\'s nice to be reminded that there\'s another person out here who hasn\'t become a brainless fuck-puppet.</i>" Her mood then takes a nervous turn. "<i>Ah... do you have time to talk? There\'s something I want to get off my chest,</i>" she tells you, hardly daring to look you in the eye.\n\n', false );
		this.desperateFinallyAmily();
	};
	//[Scare her];
	AmilyScene.prototype.scareAmilyOnDesperatePleaMeeting = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'Grinning with mischief, you carefully sneak up behind her. Suddenly grabbing her shoulders, you shout, "<i>Gotcha!</i>" She jolts with a panicked squeal and whirls around, bringing along a scything slash from her dagger!\n\n', false );
		//[Player Speed less than 50];
		if( CoC.player.spe < 50 ) {
			CoC.player.takeDamage( 5 );
			MainView.outputText( 'You scramble backwards, but it still cuts a nasty gash into your flesh. Amily looks poised to strike again, but stops when she sees that it\'s you. She looks apologetic – well, somewhat. "<i>Are you all right? I\'m sorry, but that was honestly the stupidest thing I\'ve ever seen someone do!</i>" She approaches you and makes sure that you aren\'t seriously hurt.\n\n', false );
			MainView.outputText( '"<i>You\'ll live,</i>" Amily declares quickly, though there is an honest sound of relief in her voice. "<i>Ah... do you have the time to talk? There\'s something I want to get off my chest,</i>" she asks, clearly nervous and maybe a little embarrassed.\n\n', false );
		}
		//[Player Speed is 50 or higher];
		else {
			MainView.outputText( 'You manage to leap backwards just in time to avoid a strike that could have seriously hurt you. Amily recovers quickly and readies her knife again, only to realize that it\'s you. An irritated expression crosses her face. "<i>Are you insane!? Do you have any idea how stupid that was? I could have killed you!</i>" she bellows, before slowly calming down. "<i>Ah, well... no harm, no foul, I guess...</i>"\n\n', false );
			MainView.outputText( 'She shifts awkwardly. "<i>Ah... do you have the time to talk? There\'s something I want to get off my chest,</i>" Amily nervously asks.\n\n', false );
		}
		this.desperateFinallyAmily();
	};
	AmilyScene.prototype.desperateFinallyAmily = function() {
		this.amilySprite();
		MainView.outputText( 'Curious what she has to say, you agree.\n\n', false );
		MainView.outputText( 'Amily scuffs the ground with one of her finger-like toe claws, looking down at it as if it was the most interesting thing in the world – or as if she doesn\'t dare to look you in the eyes. "<i>I... You know what I\'ve been asking of you; from you, and you keep turning me down... but you kept talking to me, asking me about myself. You wanted to get to know me, but... why don\'t you want to know ALL of me? I... I want to give myself to you. You\'re the nicest, kindest man I\'ve met – even before the demons destroyed my village. I want to be with you... but you don\'t seem to want to be with me.</i>" She looks up to you at last, her eyes wet with tears. "<i>Is there something wrong with me? Can\'t you like me in that way?</i>" she pleads.\n\n', false );
		//Accept her / Turn her down gently / Turn her down bluntly;
		EngineCore.choices( 'Accept Her', this, this.desperateAmilyPleaAcceptHer, 'TurnDownGently', this, this.desperateAmilyPleaTurnDown, 'TurnDownBlunt', this, this.desperateAmilyPleaTurnDownBlunt, '', null, null, '', null, null );
	};
	//[Accept her];
	AmilyScene.prototype.desperateAmilyPleaAcceptHer = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		//set accepted flag;
		CoC.flags[ kFLAGS.AMILY_OFFER_ACCEPTED ] = 1;
		MainView.outputText( 'With a gentle smile, you reach out and take hold of her hand. You tell her that you do like her too; you just wanted to know her as a person before you would take something as precious to her as her virginity. If she still wants you, then you want to go with her now.\n\n', false );
		MainView.outputText( 'Amily stares at you, stunned. After a moment, she embraces you fiercely and begins to drag you away.\n\n', false );
		//[/ Go to [High Affection Sex]];
		EngineCore.doNext( this, this.amilySexHappens );
	};
	//[Turn her down gently];
	AmilyScene.prototype.desperateAmilyPleaTurnDown = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You softly tell her that you\'re sorry, but it just can\'t be helped. You have a quest to fulfill, and you don\'t even know if you\'ll be staying around instead of going home when it\'s over. That\'s even assuming you succeed, and don\'t end up dead in a ditch somewhere. You can\'t countenance taking a lover with something like that hanging over your head. Besides, you tell Amily that she should have more respect for her body than what this plan of hers entails, anyway.\n\n', false );
		MainView.outputText( 'Amily sniffs loudly, tears blatantly running down her cheeks. "<i>If... if that\'s the way it has to be, then,</i>" she sniffles, "<i>I... I guess that there\'s nothing left for me here. I\'ll just have to leave... Maybe I can find somewhere that will at least give me shelter.</i>"\n\n', false );
		//[Player has found Tel'Adre];
		if( CoC.player.statusAffectv1( StatusAffects.TelAdre ) >= 1 ) {
			MainView.outputText( 'You tell her that you\'ve discovered a hidden city in the desert, free of corruption. Amily looks shocked, but clearly grateful as you assure her of its existence and provide instructions on how to get there.\n\n', false );
		} else {
			MainView.outputText( 'Looking dejected, Amily slowly begins to walk away. However, just before she makes her final turn to disappear, she turns back to you. "<i>I\'ll always remember you,</i>" she promises sincerely – and then she is gone.\n\n', false );
		}
		MainView.outputText( 'Feeling the weight of the empty village pressing in on you, you quickly retreat yourself. There\'s no point coming back here.\n\n', false );
		//turn off village.;
		CoC.flags[ kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED ] = 1;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[Turn her down bluntly];
	AmilyScene.prototype.desperateAmilyPleaTurnDownBlunt = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'Without mercy or hesitation, you tell her that there is indeed something wrong with her could never be attracted to a woman that looks like a pest and should be hiding in a granary.\n\n', false );
		MainView.outputText( '"<i>Why you-! I bare my soul to you, and this is how you repay me?!</i>" Amily screams; rage, hurt and betrayal are all evident in her words.\n\n', false );
		MainView.outputText( 'You jeer at her that it\'s not your fault that she\'s so pathetic, falling for the first person to take pity on her and talk to her.\n\n', false );
		MainView.outputText( 'Amily responds by spitting a stream of the most jarringly foul language at you. In her rage, she hurls a blowpipe dart at you with her hands, which you easily swat aside. Cursing all the while, she races off in a fury.\n\n', false );
		MainView.outputText( 'You know she\'s never going to come back.', false );
		//Player gains corruption};
		EngineCore.dynStats( 'cor', 1 );
		//{Amily can no longer be encountered};
		CoC.flags[ kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED ] = 1;
		//{Ruined Village removed from Places list};
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[Birth];
	AmilyScene.prototype.fuckingMouseBitchPopsShitOut = function() {
		this.amilySprite();
		MainView.outputText( 'You head into the ruined village, wondering how Amily is doing. You can\'t be sure, but you think that it will soon be time for her to give birth. Right as that thought sinks in, you hear a squeaking wail of pain in the distance. You hurriedly take off to find the source, and you soon find her; Amily, squatting naked in the shelter of a building. She squeals softly with exertion as her swollen abdomen visibly ripples, and fluids drip from her swollen pink vagina. She is definitely in labor.\n\n', false );
		MainView.outputText( 'What will you do?', false );
		//Increase baby count here rather than in 3 places.;
		CoC.flags[ kFLAGS.AMILY_BIRTH_TOTAL ]++;
		//Leave / Watch / Help;
		EngineCore.choices( 'Leave', this, this.pregnancyIsScaryGoddamnMousePregnancyImNotWatchingThisShit, 'Watch', this, this.heyIGotTicketsToMicePoppingOut, 'Help', this, this.helpThatFukkinUngratefulBitchGiveBirth, '', null, null, '', null, null );
	};
	//[Leave];
	AmilyScene.prototype.pregnancyIsScaryGoddamnMousePregnancyImNotWatchingThisShit = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You make a hasty retreat. You aren\'t sure why; maybe it was fear, maybe it was memories of the way the midwives always chased the men away when one of the women back in the village went into labor. Reassuring yourself that she will be fine, you head back to camp.\n\n', false );
		MainView.outputText( 'The next morning, you find a note scratched onto a slab of bark beside your sleeping roll, reading, "<i>The babies and I are both fine. No thanks to you!</i>"\n\n', false );
		//{Affection goes down};
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] -= 10;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};

	//[Watch];
	AmilyScene.prototype.heyIGotTicketsToMicePoppingOut = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You don\'t want to just run away and leave her, but at the same time you think it would be best to respect her privacy. You stand a respectful distance away, watching as she strains. Her pink nether lips part and a small', false );
		//([horsecock];
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( ', mousy figure – pink, hairless and ', false );
		} else {
			MainView.outputText( ' figure –', false );
		}
		MainView.outputText( ' maybe six inches tall – slips out, falling to the ground with a squeak. Fortunately, Amily has prepared a pile of rags and soft leaves to cushion its landing. It rolls around a bit, and then scrambles with surprising speed; which is good, as it is joined by company very quickly. A second infant falls onto the padding beside it, and then a third... a fourth...\n\n', false );
		MainView.outputText( 'You watch as baby after baby slips free of its mother\'s womb and into the wider world. ', false );
		//([horsecock];
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( ' Though hairless like regular infant mice,', false );
		} else {
			MainView.outputText( ' Though remarkably similar to a regular infant - minus the ears and tail, of course -', false );
		}
		MainView.outputText( ' they can already crawl around at high speed; even totter unsteadily on two legs. The first of them begin to instinctively make its way up its mother\'s body to latch onto one of her nipples and suckle. You lose count somewhere after a dozen, but Amily finally gives an exhausted sigh of relief as the afterbirth slips free of her body. Each infant has nursed from her by this point. They now seem more confident about standing on two legs,', false );
		//([horsecock];
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( ' and fur has already begun to cover their formerly-naked bodies.', false );
		} else {
			MainView.outputText( ' maturing dramatically as you watch.', false );
		}
		MainView.outputText( '  Their color patterns vary considerably; white, black and brown are most common, and you even see one or two with your hair color. Amily flops back onto her rump and then topples over onto her back, clearly too tired to stand up. Her offspring crowd around, cuddling up to her, and she gives them a tired but happy smile.\n\n', false );
		MainView.outputText( 'Making sure that there doesn\'t seem to be any danger, you quietly let yourself out. It seems that she\'s too concerned about the children to notice you leave.', false );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[Help];
	AmilyScene.prototype.helpThatFukkinUngratefulBitchGiveBirth = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You move forward instinctively. Amily is in labor – she needs help. The fact that you are the father only makes it more natural for you to want to help her.\n\n', false );
		MainView.outputText( '"<i>Hghnn... ' + CoC.player.short + '? What are you doing?</i>" Amily asks, before groaning again as another contraction hits her. You reassure her that you\'re here to help as you kneel beside her, and reach out to touch her swollen middle, placing one hand on either side of its globular mass. Unsure of what else to do, you start to gently massage it, trying to relax and soothe the muscles after every time they clench and lower the pain when she goes through another contraction. She starts to thank you, then clenches her teeth,', false );
		//([horsecock];
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'turns her little muzzle skywards and hisses in pain', false );
		} else {
			MainView.outputText( 'hissing in pain', false );
		} // This sound a bit wrong for what should look like a human...
		MainView.outputText( ' as the strongest contraction yet hits – she\'s crowning! Immediately your hands dive down to hover under her vagina as a small, pink, naked and wriggling thing slips between their parted lips. The little body is surprisingly light in your hands, but it squeaks loudly as it draws its first breath – correction, HER first breath. It\'s a ', false );
		var amilyKid = 'girl';
		if( (CoC.player.gender === 3 || CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0) && Utils.rand( 2 ) === 0 ) {
			amilyKid = 'herm';
		}
		if( CoC.player.gender === 3 && CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			amilyKid = 'herm';
		}
		MainView.outputText( amilyKid + '.\n\n', false );
		MainView.outputText( 'Awestruck, you tell Amily that she\'s beautiful and you really mean it. Even though she\'s a different species, she\'s your daughter and she\'s gorgeous to you.\n\n', false );
		MainView.outputText( '"<i>That\'s nice... but there\'s a lot more where she came from, so...</i>" Amily trails off as another contraction hits, and you see a second baby beginning to peek out between her nether lips. At your panicked expression, she manages a grim laugh. "<i>Just... put her to my breast. She can handle things from there,</i>" she instructs you.\n\n', false );
		MainView.outputText( 'Uncertain, you do as you are told; your daughter latches onto her mother\'s ', false );
		//([horsecock];
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'fur', false );
		} else {
			MainView.outputText( 'bosom', false );
		}
		MainView.outputText( ', rooting eagerly for her nipple as your hands dart down to catch her first sibling. It almost becomes a rhythm; catch a baby, place her or him at Amily\'s breast to nurse, catch the next baby... Well over a dozen babies are born – you think it might be as many as two dozen – before Amily finally stops, the afterbirth gushing out to signal the end of her labors. Gently, you catch her and lower her onto a soft piece of ground to rest. Around you, your many children play; though born only a short time ago, they can now stand strong and proud on their two legs.', false );
		//([horsecock];
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'Their fur has come in too, something triggered by the first drink of their mother\'s milk.', false );
		} else {
			MainView.outputText( 'Their hair is also starting to grow in an accelerated rate.', false );
		}
		MainView.outputText( '  Your firstborn daughter is already asserting herself as the leader of the pack, and you can\'t help but notice that her ', false );
		//([horsecock];
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'fur', false );
		} else {
			MainView.outputText( 'hair', false );
		}
		MainView.outputText( ' is the same color as your hair.\n\n', false );
		MainView.outputText( 'Amily is tired, but she smiles at you happily. "<i>I... thank you. For being here. For me – and them,</i>" she says. You assure her that it was no problem. You sit there with her, letting your inquisitive offspring examine you and tussle with you while their mother regains her strength.\n\n', false );
		MainView.outputText( 'As the rambunctious little mouselets burn up their energy and curl up beside Amily to sleep, you gently excuse yourself and return to camp.', false );
		//{Affection goes up};
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 5;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[Bad End];
	AmilyScene.prototype.thisIsAReallyShittyBadEnd = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You wander through the empty streets of the ruined village, wondering where Amily is. For all her many faults, she\'s an acceptable fuck. The sudden sound of footsteps catches your attention, and you ready yourself for battle; Amily never makes her presence felt so clumsily.\n\n', false );
		MainView.outputText( 'Except for today. Amily walks out to confront you casually. "<i>Ah, ' + CoC.player.short + ', there you are,</i>" she states. "<i>Good. I was hoping to see you one last time; I thought you at least deserved a goodbye.</i>"\n\n', false );
		MainView.outputText( '"<i>A goodbye?</i>" you echo, confused.\n\n', false );
		MainView.outputText( 'Amily nods, then puts a finger to either side of her mouth in order to whistle piercingly. All around you, from behind walls and out of holes in roofs, mousy faces begin to pop up. There are dozens of them! Their fur is primarily white, black, brown and mottlings of the three, but you see some that have your own hair color as well. You gape for a moment in shock, and then begin to ask, "<i>These are...?</i>"\n\n', false );
		MainView.outputText( '"<i>The results of the litters that you fathered with me, yes.</i>" Amily nods. "<i>They are my children – my tribe – and we are now numerous and strong enough to leave these lands... find a new place to carve out a home for us.</i>"\n\n', false );
		MainView.outputText( 'As you watch, they begin gathering at one street opening behind their mother. They\'re clad in rags and wield makeshift weapons, but look determined and surprisingly fierce.\n\n', false );
		MainView.outputText( '"<i>This is goodbye, ' + CoC.player.short + '. You may not have been the most noble of [men]... but you did help me in my quest, and I am grateful – no matter how selfish your reasons may have been.</i>"\n\n', false );
		MainView.outputText( 'Amily inclines her head towards you in a respectful nod, and then joins her vast brood as they begin to march away purposefully. You watch them go until they have vanished from sight, then shake your head with a sneer. Like you need her or her brats, anyway! Spinning on your heel, you stride purposefully out of this dump of a village; you don\'t intend to come back here again.\n\n', false );
		MainView.outputText( 'Amily has left the region with her children to found a new colony elsewhere.\n\n', false );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		//{Amily can no longer be encountered};
		//{Ruined Village removed from Places list};
		CoC.flags[ kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED ] = 1;
	};

	//Good End:;
	AmilyScene.prototype.thisFunctionProbablySucksTooOhYeahAmilyFunction = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'As you wander through the empty streets of the ruined village, you wonder where Amily is. Even beyond what she means to you now, you simply enjoy knowing that there\'s someone else in this twisted place you can talk to.\n\n', false );
		MainView.outputText( '"<i>' + CoC.player.short + '! Darling! You\'re here!</i>"\n\n', false );
		MainView.outputText( 'You hear her delighted squeak, but she moves too quickly for you to catch, fiercely tackling you and embracing you.\n\n', false );
		MainView.outputText( '"<i>I was wondering if maybe we should go and find you first, I didn\'t want you to miss this chance.</i>" She tells you, nuzzling your side emphatically.\n\n', false );
		MainView.outputText( 'Too confused to even hug her back, you ask what she\'s talking about.\n\n', false );
		MainView.outputText( 'Amily blinks and looks confused, then smiles. "<i>Oh, right, I\'m getting ahead of myself. Kids! Come and say hello to your father!</i>" She calls out in delight.\n\n', false );
		MainView.outputText( 'Before your eyes, a veritable stampede of forms erupt from the rubble, mice in a wild array of colors - black, white and brown are most common, but you see more than a few with your hair (well, fur) color and eyes - charging to surround you, chittering and squeaking happily. You fight to keep your footing when they press in around you so enthusiastically. You can be forgiven for taking several long moments before what Amily said registers.\n\n', false );
		MainView.outputText( '"<i>These are...?</i>" You begin hesitantly, unable to say it.\n\n', false );
		MainView.outputText( '“<i>Our children, yours and mine' );
		// Mix;
		if( CoC.flags[ kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS ] > 0 && CoC.flags[ kFLAGS.AMILY_BIRTH_TOTAL ] > 0 ) {
			MainView.outputText( '.</i>”' );
		}
		// Only PC birth;
		else if( CoC.flags[ kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS ] > 0 && CoC.flags[ kFLAGS.AMILY_BIRTH_TOTAL ] === 0 ) {
			MainView.outputText( ', planted by me inside of you.</i>”' );
		}
		// Only Amily birth;
		else if( CoC.flags[ kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS ] === 0 && CoC.flags[ kFLAGS.AMILY_BIRTH_TOTAL ] > 0 ) {
			MainView.outputText( ', planted by you inside of me.</i>”' );
		}
		MainView.outputText( '  Amily trills happily.\n\n', false );
		MainView.outputText( 'You can only stare at the multitude in shock. From somewhere inside you, a lone thought wondering what your mother would say at the sight of so many grandchildren rears itself, only to be brushed aside when the realization of what else Amily said manages to sink in. You ask if she\'s leaving.\n\n', false );
		MainView.outputText( '"<i>Yes. There\'s enough of them here now that they can survive leaving this place to establish a new village elsewhere.</i>" She confirms. "<i>...Oh, don\'t look so gloomy!</i>" She laughs, watching your face as you digest this news. "<i>I\'m not going with them.</i>"\n\n', false );
		MainView.outputText( 'You can only start in shock and disbelief at this statement. Amily steps close, takes you hand in hand, and does her best to look you in the eyes. "<i>', false );
		if( CoC.flags[ kFLAGS.AMILY_MET_AS ] === 1 ) {
			MainView.outputText( 'When we first met, you were just sperm to me, a pure male to father the children I needed. ', false );
		} else {
			MainView.outputText( 'When we first met, I was afraid of you, I needed your male essence, but I was prejudiced against your other gender. ', false );
		}
		MainView.outputText( 'But as I got to know you, you became more to me. I love you, ' + CoC.player.short + ', and I don\'t want to leave you. You came to this world on a quest, didn\'t you? Well, you helped me with my quest, so it\'s only fair I help you with yours. The children have been taught well, they can make their own way from here and now... but I want to come back with you, to stay with you and help however I can. Will you let me?', false );
		MainView.outputText( '</i>"\n\n', false );
		MainView.outputText( 'You shake off your confusion as her words sink in. Smiling broadly, you wrap her in your arms and tell her you want her to come back with you. She smiles, and hugs you back with surprising fierceness, even as your many children react with delight.\n\n', false );
		MainView.outputText( 'You spend over an hour getting to know your many sons and daughters, helping them pack up their meager supplies and wishing them well as they set off. Then, with Amily\'s hand in yours, you return to your camp, leaving behind this empty village to be reclaimed by the wilderness.\n\n', false );
		//Oh boy.  So excited.  wee.  Blech.;
		MainView.outputText( '\\[<b>Amily has joined you as a lover.</b>\\]\n\n', false );
		//Set amily follower flag;
		CoC.flags[ kFLAGS.AMILY_FOLLOWER ] = 1;
		CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] = 1;
		CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] = 0.3;
		CoC.flags[ kFLAGS.AMILY_HIP_RATING ] = 6;
		CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] = 6;
		CoC.flags[ kFLAGS.AMILY_VAGINAL_WETNESS ] = 1;
		CoC.flags[ kFLAGS.AMILY_CLOTHING ] = 'rags';
		//if marble is there, tag it for freakout;
		if( CoC.player.findStatusAffect( StatusAffects.CampMarble ) >= 0 ) {
			CoC.flags[ kFLAGS.MARBLE_OR_AMILY_FIRST_FOR_FREAKOUT ] = 1;
		} else {
			CoC.flags[ kFLAGS.MARBLE_OR_AMILY_FIRST_FOR_FREAKOUT ] = 2;
		}
		//if Izma is there, tag for freekout!;
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00238 ] === 1 ) {
			CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00236 ] = 1;
		}
		//Disable amily encounters in the village!;
		CoC.flags[ kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED ] = 1;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Conversations - talk wif da bitch.;
	AmilyScene.prototype.talkWithCuntIMeanAmily = function( sexAfter ) {
		MainView.outputText( '', true );
		this.amilySprite();
		var convo = Utils.rand( 15 );
		// Bump past convo #12 if she's already at camp because it doesn't make much sense by this point.;
		if( convo === 12 && this.amilyFollower() ) {
			convo++;
		}
		//Girls dont get to listen to amily talk about being knocked up.;
		//Herms either unless she's okay'ed them for dad-hood.;
		if( CoC.player.gender === 2 || (CoC.player.gender === 3 && CoC.flags[ kFLAGS.AMILY_HERM_QUEST ] < 2) ) {
			convo = Utils.rand( 12 );
		}
		//Boost affection!;
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 2 + Utils.rand( 3 );
		EngineCore.dynStats( 'cor', -0.34 );
		//Conversation: Items;
		if( convo === 0 ) {
			MainView.outputText( 'The two of you swap tales about your respective adventures, and from there the topic drifts to the various potions and elixirs discovered in this world.\n\n', false );
			MainView.outputText( '"<i>You know...  I don\'t have the equipment needed to practice alchemy, but I do know a few things about it.</i>" Amily says.  "<i>If you can bring me a potion or a reagent, I may be able to remember some of the things my father taught me.</i>"\n\n', false );
			//(If player has no main item:);
			if( CoC.player.itemSlot1.quantity === 0 ) {
				MainView.outputText( 'Promising you\'ll keep that in mind, you take your leave of Amily.\n\n', false );
				if( sexAfter ) {
					EngineCore.doNext( this, this.determineAmilySexEvent() );
				} else {
					EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
				}
				return;
			}
			//(If player has an item:);
			else {
				MainView.outputText( 'You remember that you have something in your pockets that might be of interest, and show it to Amily.\n\n', false );
			}
			if( CoC.player.itemSlot1.itype === ConsumableLib.EQUINUM ) {
				MainView.outputText( '"<i>That\'s a distillation of horse essence, I think.</i>" Amily says.  "<i>I guess it would probably make you stronger and tougher... but horses aren\'t smart, and it might be too strong for a human to handle without changing them,</i>" she warns you.\n\n', false );
			}
			//Canine Pepper & Variants:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.CANINEP ) {
				MainView.outputText( '"<i>Looks kind of like a dog\'s dick, doesn\'t it?  Especially this one with the big knot-like bulge or this one with the ball-like bulbs.  I suppose it would make you more dog-like... but I\'m pretty sure you should avoid these jet-black ones.  I can\'t remember why...</i>" she trails off, wracking her brain.\n\n', false );
			}
			//Canine Pepper & Variants:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.LARGEPP ) {
				MainView.outputText( '"<i>Looks kind of like a dog\'s dick, doesn\'t it?  Especially this one with the big knot-like bulge or this one with the ball-like bulbs.  I suppose it would make you more dog-like... but I\'m pretty sure you should avoid these jet-black ones.  I can\'t remember why...</i>" she trails off, wracking her brain.\n\n', false );
			}
			//Canine Pepper & Variants:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.DBLPEPP ) {
				MainView.outputText( '"<i>Looks kind of like a dog\'s dick, doesn\'t it?  Especially this one with the big knot-like bulge or this one with the ball-like bulbs.  I suppose it would make you more dog-like... but I\'m pretty sure you should avoid these jet-black ones.  I can\'t remember why...</i>" she trails off, wracking her brain.\n\n', false );
			}
			//Canine Pepper & Variants:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.BLACKPP ) {
				MainView.outputText( '"<i>Looks kind of like a dog\'s dick, doesn\'t it?  Especially this one with the big knot-like bulge or this one with the ball-like bulbs.  I suppose it would make you more dog-like... but I\'m pretty sure you should avoid these jet-black ones.  I can\'t remember why...</i>" she trails off, wracking her brain.\n\n', false );
			}
			//Canine Pepper & Variants:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.KNOTTYP ) {
				MainView.outputText( '"<i>Looks kind of like a dog\'s dick, doesn\'t it?  Especially this one with the big knot-like bulge or this one with the ball-like bulbs.  I suppose it would make you more dog-like... but I\'m pretty sure you should avoid these jet-black ones.  I can\'t remember why...</i>" she trails off, wracking her brain.\n\n', false );
			}
			//Canine Pepper & Variants:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.BULBYPP ) {
				MainView.outputText( '"<i>Looks kind of like a dog\'s dick, doesn\'t it?  Especially this one with the big knot-like bulge or this one with the ball-like bulbs.  I suppose it would make you more dog-like... but I\'m pretty sure you should avoid these jet-black ones.  I can\'t remember why...</i>" she trails off, wracking her brain.\n\n', false );
			}
			//Succubus Milk/Incubus Draft:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.INCUBID || CoC.player.itemSlot1.itype === ConsumableLib.SUCMILK ) {
				MainView.outputText( 'She recoils with a hiss.  "<i>That\'s demon fluid, it is - like drinking liquid corruption! Avoid that stuff if you can; it\'ll turn you into a demon, and supercharge your sex-drive.  I\'ve heard it can even mess with your gender if you drink too much of the opposite stuff.</i>"\n\n', false );
			}
			//Succubi's Delight:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.SDELITE ) {
				MainView.outputText( '"<i>Full of taint, no question of that.  Succubi give it to males who haven\'t become demons yet; makes them better able to produce cum, and pushes them towards demonhood.</i>"\n\n', false );
			}
			//Wet Cloth:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.WETCLTH ) {
				MainView.outputText( '"<i>I... have no idea what that is.</i>" she says, looking confused.  "<i>I guess it\'s... slimey?  Concentrate of goo?  I think it\'s got something to do with whatever\'s been polluting the lake, so I wouldn\'t rub it into your skin.</i>"\n\n', false );
			}
			//Bee Honey:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.BEEHONY ) {
				MainView.outputText( '"<i>Honey from a giant bee?</i>" she asks eagerly, perking up.  "<i>Oh, that stuff\'s delicious! I hear it\'s full of special essences secreted by the giant bees, though, so it could have transformative effects.</i>"\n\n', false );
			}
			//Pure Honey:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.PURHONY ) {
				MainView.outputText( '"<i>You managed to get your hands on ultra-pure giant bee honey?</i>" she asks, sounding impressed.  "<i>I hear that stuff\'s so pure it can actually help purge the eater of demonic taint - but it\'s probably otherwise the same as regular bee honey.</i>"\n\n', false );
			}
			//Green Glob:;
			else if( CoC.player.itemSlot1.itype === UseableLib.GREENGL ) {
				MainView.outputText( '"<i>A blob of slime from a green gel?  Hmm...</i>" she looks thoughtful.  "<i>I think I remember my dad once telling me you could make a really strong armor out of a special distillation of green oozes.  I can\'t say for sure, and I wouldn\'t have the equipment even if I did remember.</i>"\n\n', false );
			}
			//Bee Chitin:;
			else if( CoC.player.itemSlot1.itype === UseableLib.B_CHITN ) {
				MainView.outputText( '"<i>If you had a sufficient mass of this stuff, you could make a suit of armor out of it.  It needs special alchemical reagents, though, otherwise it\'ll just get all brittle and smashed up.</i>"\n\n', false );
			} else {
				MainView.outputText( 'She looks at it and shrugs, not really familiar with it.\n\n', false );
			}
			MainView.outputText( 'Thanking her for her help, you return the item to your pocket', false );
			if( sexAfter ) {
				MainView.outputText( '.\n\n', false );
			} else {
				MainView.outputText( ' and take your leave of the mouse-girl.\n\n', false );
			}
		}
		//Conversation: Minotaurs;
		else if( convo === 1 ) {
			MainView.outputText( 'The two of you swap tales about your respective adventures, and from there the topic drifts to the strange bull-men that you have seen haunting the mountains.\n\n', false );
			MainView.outputText( '"<i>You were lucky to get away with your skin intact.</i>" Amily tells you emphatically.  "<i>Minotaurs are dangerous brutes - they\'re one of the biggest, strongest and toughest beasts around.  I don\'t dare go near the mountains, not with those beasts roaming around.  Sometimes they carry around huge axes, but usually they make do with just their huge, knuckley fists.</i>"\n\n', false );
			MainView.outputText( 'You ask her why it is that minotaurs are so dangerous; they don\'t seem to look like demons.\n\n', false );
			MainView.outputText( '"<i>They may as well be demons, now. Oh, they may not look corrupted, but all they care about is finding something to rut with - man, woman, both, neither, they don\'t care.  So long as it\'s got a hole, they\'ll fuck it...  I think maybe I heard somewhere that they can only reproduce by raping other creatures with a vagina now, but I don\'t remember where.</i>"  She looks perturbed, but why you can\'t say for certain.\n\n', false );
			MainView.outputText( 'You ask her then if she has any advice on how to deal with them.\n\n', false );
			MainView.outputText( 'Amily laughs.  "<i>Not really; me, I run if ever I see them.  I\'m not a stand-up fighter to begin with, but against those brutes?  And it\'s not just their strength, either...  I think they\'ve got some kind of addictive chemical in their cum.  The stink of their presence alone can make you feel turned on.  There was this one that managed to corner me; it pulled out its huge horse-cock and started masturbating.</i>"  She shudders in disgust.  "<i>I narrowly missed getting sprayed, but the smell... it was intoxicating.</i>"  She admits, clearly embarrassed.  "<i>My legs nearly buckled from arousal - it was so tempting to just give in and let him fuck me.</i>"\n\n', false );
			MainView.outputText( 'You ask her what she did.\n\n', false );
			MainView.outputText( '"<i>I fought it off and ran,</i>" she insists, looking a little insulted, ', false );
			//(If player hasn't had sex with Amily:;
			if( CoC.flags[ kFLAGS.AMILY_FUCK_COUNTER ] === 0 ) {
				MainView.outputText( '"<i>I am still a virgin, after all.</i>"\n\n', false );
			}
			//(If player has had sex with Amily:;
			else {
				MainView.outputText( '"<i>I was a virgin when we met, in case you forgot.</i>"\n\n', false );
			}

			MainView.outputText( '"<i>The big brute was stupid enough to follow me; once I got to the trees, where he couldn\'t get around so easily, I put a poisoned dart in each of his eyes.  When he stopped thrashing around, I walked up and slit his throat.</i>"\n\n', false );
			MainView.outputText( 'She looks quite proud of herself for that.  Feeling a bit disturbed by her ruthlessness, you thank her for the warning', false );
			if( sexAfter ) {
				MainView.outputText( '.\n\n', false );
			} else {
				MainView.outputText( ' and excuse yourself.\n\n', false );
			}
		}
		//Conversation: Sand Witches;
		else if( convo === 2 ) {
			MainView.outputText( 'The two of you swap tales about your respective adventures, and from there the topic drifts to the mysterious female magic-users you\'ve seen in the Desert.\n\n', false );
			MainView.outputText( '"<i>Sand Witches, eh? Funny, it seems the only pseudo-humans left in this area that aren\'t demons are magic-users... even though it was their usage of magic that turned the first demons into demons,</i>" Amily notes.  "<i>Or so I heard, anyway,</i>" she adds.\n\n', false );
			MainView.outputText( 'You ask her if she knows what the Sand Witches are trying to do out there in the desert.\n\n', false );
			MainView.outputText( '"<i>Not a clue.  I think... I think that they might be some kind of druidic sect or something. Restoring life to the desert, trying to make it into grassland or something like that,</i>" Amily suggests.\n\n', false );
			MainView.outputText( 'You ask her why she comes to that conclusion.\n\n', false );
			MainView.outputText( '"<i>Have you seen them under those robes?  They\'re all women, they all have two pairs of breasts, and those breasts are always bloated huge with milk.  My guess is that they\'ve gone mad like those Fetish Cultists; they\'re not proper demons, but they\'re still sex-warped.  Maybe they use milk to try and nourish seedlings or something,</i>" the mouse-woman shrugs.\n\n', false );
			MainView.outputText( 'You ask her how on earth she would know that all Sand Witches have four milk-filled breasts.  She blushes deeply and fidgets, clearly embarrassed.  Finally, she speaks up.\n\n', false );
			MainView.outputText( '"<i>I... kind of got lost in the desert once.  A Sand Witch approached me and asks me if I\'d let her cast a spell on me.  When I refused, she attacked, trying to beat me down so she could cast it on me anyway.</i>"\n\n', false );
			MainView.outputText( 'You interrupt to ask her what the spell would have done.\n\n', false );
			MainView.outputText( '"<i>How should I know? Make me into some kind of milk-producing slave?</i>" Amily retorts fiercely, tail lashing in agitation.  "<i>I didn\'t give her a chance to use it.  Three sleeping potion darts in her face, quicker than she could blink.  I was annoyed, so I pulled off her robes to bind her limbs - I figured that\'d slow her down long enough when she woke up that I\'d be far away.  Her breasts were full of milk - so full I could see it leaking out of each nipple.</i>"  She blushes intently, clearly embarrassed.  "<i>I... I hadn\'t had anything to eat or drink for ages, I was starving and thirsty and so I...</i>"\n\n', false );
			MainView.outputText( 'You assure her that she doesn\'t need to spell it out.  She looks grateful, then continues.\n\n', false );
			MainView.outputText( '"<i>So, I had just drunk my fill, feeling fuller then I had in weeks, and then, you won\'t believe it, another Sand Witch shows up - from the things she was saying, I must have accidentally interrupted some kind of lesbian tryst they had planned.  I grab my stuff and bolt for safety - not quick enough to keep her from casting some spell that makes this stone orb fly up my... my...</i>"  She blushes again.  "<i>It was like having some kind of vibrating sex toy jammed up there. I don\'t know how I managed to run away with it, but when I got too far, it dissolved into sand and just fell out.  I don\'t think they can take much punishment, but they\'ve clearly got some nasty tricks.</i>"\n\n', false );
			MainView.outputText( 'Thanking her for the advice, you promise you\'ll be more careful if you see them in the future', false );
			if( sexAfter ) {
				MainView.outputText( '.\n\n', false );
			} else {
				MainView.outputText( ' and take your leave.\n\n', false );
			}
		}
		//Conversation: Giant Bees;
		else if( convo === 3 ) {
			MainView.outputText( 'The two of you swap tales about your respective adventures, and from there the topic drifts to the strange bee-like women you\'ve seen in the forest.\n\n', false );
			MainView.outputText( '"<i>Giant Bees?  They\'re a strange race,</i>" Amily says.  "<i>They\'re not really corrupt, but at the same time, they act kind of like demons.</i>"\n\n', false );
			MainView.outputText( 'You ask her to explain how that works.\n\n', false );
			MainView.outputText( '"<i>Well... the Giant Bees you\'ve probably seen?  The official name for them is the fertile caste, but folks tend to just call them handmaidens,</i>" Amily explains.\n\n', false );
			MainView.outputText( 'At your confused look, she continues.\n\n', false );
			MainView.outputText( '"<i>Giant Bees hatch from each egg as hundreds of regular-looking little bees.  And fertiles are involved in that - for some reason, the eggs need to incubate inside a living being to hatch in the first place.</i>"\n\n', false );
			MainView.outputText( 'Your expression probably tells the story, because Amily giggles slightly before adding.  "<i>It\'s not dangerous or anything like that!  The queen and the handmaidens both have this cock-like appendage on their abdomens; the queen uses this to lay her eggs into the handmaidens, filling up their abdomens, while the handmaiden then lays a mixture of eggs and honey into a person\'s gut via their anus.  The eggs kind of... well, they sit there, and then, when they\'re ready to hatch, they just... come out.</i>"\n\n', false );
			MainView.outputText( 'She shrugs, clearly not able to explain it any better than that.  You ask how you can avoid such a fate.\n\n', false );
			MainView.outputText( '"<i>Well, they mainly use this hypnotic thrumming from their wings; but if you\'ve got a strong, sharp mind you can shake it off.  They aren\'t the kind to get violent; they will ask you to accept their eggs, if you resist their hypnosis, but they won\'t try to beat you into submission so they can lay their eggs.  I wouldn\'t recommend fighting them; they\'re quick and pretty tough, thanks to that armor, and they\'ve got this nasty venom that saps your strength and arouses you at the same time.</i>"\n\n', false );
			MainView.outputText( 'You thank her for her advice, and then, curious, ask how she knows so much about these creatures.\n\n', false );
			MainView.outputText( 'Amily looks flustered.  "<i>Well, they, they have been willing to trade honey in the past if you confront them peacefully and... alright, I\'ll admit it, when times have been really lean, I\'ve been willing to host some giant bee eggs in exchange for honey.</i>"\n\n', false );
			MainView.outputText( 'You smile and thank her for sharing, noting that she didn\'t need to tell you such personal information', false );
			if( sexAfter ) {
				MainView.outputText( '.\n\n', false );
			} else {
				MainView.outputText( ', and politely excuse yourself.\n\n', false );
			}
		}
		//Conversation: Fetish Cultists & Zealouts;
		else if( convo === 4 ) {
			MainView.outputText( 'The two of you swap tales about your respective adventures, and from there the topic drifts to the bizarrely-dressed people you\'ve caught glimpses of around the lake.\n\n', false );
			MainView.outputText( 'Amily thinks fiercely, then shakes her head, looking apologetic.  "<i>I\'m sorry, I don\'t know anything about them.  They\'re new to this area, I can tell you that much.  It looks like they have some weird magic that lets them change their clothes at random.  I stay away from them; there\'s something about them that reminds me of demons, but they\'re... scarier, somehow.</i>"\n\n', false );
			MainView.outputText( 'Telling her that it\'s all right if she doesn\'t know that much, you get up', false );
			if( sexAfter ) {
				MainView.outputText( ' and sigh.\n\n', false );
			} else {
				MainView.outputText( ' and leave.\n\n', false );
			}
		}
		//Conversation: Imps;
		else if( convo === 5 ) {
			MainView.outputText( 'The two of you swap tales about your respective adventures, and from there the topic drifts to the small demons you\'ve seen in your travels.\n\n', false );
			MainView.outputText( '"<i>Imps!</i>" Amily spits, looking fierce.  "<i>Disgusting demon vermin, that\'s what they are! All over the place, looking to rape anything they can get their hands on.  They\'re puny little creatures, and they\'re easy to cut down, but they use black magic to try and make you so horny they can rape you.  I kill them wherever I find them, but there\'s always more and more of them.</i>"\n\n', false );
			MainView.outputText( 'Her tail is lashing furiously from side to side, and, clearly worked up, she tensely excuses herself ', false );
			if( sexAfter ) {
				MainView.outputText( 'and regains her composure.\n\n', false );
			} else {
				MainView.outputText( 'and leaves.', false );
				if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 0 ) {
					MainView.outputText( '  As you set off back to camp,', false );
				} else {
					MainView.outputText( '  As you sit back down in camp,', false );
				}
				MainView.outputText( ' you have little doubt that she\'s gone to find and kill an imp.\n\n', false );
			}
		}
		//Conversation: Shark Girls;
		else if( convo === 6 ) {
			MainView.outputText( 'The two of you swap tales about your respective adventures, and from there the topic drifts to the humanoid female sharks you\'ve seen while rowing your boat.\n\n', false );
			MainView.outputText( '"<i>Shark Girls? Near as I can tell, they used to be a village of humans who lived right here on the lake... then the lake got polluted, and turned them all into... well, what they are now.</i>"\n\n', false );
			if( !SceneLib.izmaScene.izmaFollower() ) {
				MainView.outputText( 'She looks pensive.  "<i>Odd... I don\'t think they have any males left, but on very rare occasions I\'ve seen these weird tiger-striped Shark Girls... and they always had huge cocks and balls as well.  But, whether female or herm, they seem to only care about fighting and fucking... and from the way I\'ve seen them going at it, I don\'t think they see any difference between the two any more.</i>"\n\n', false );
			}
			MainView.outputText( 'You ask her if she has any advice on fighting them.\n\n', false );
			MainView.outputText( '"<i>I\'m afraid not.  They don\'t come to the shore too often, never mind too far out of the lake. They\'re probably resistant to pain and have a really wicked bite, though,</i>" she tells you.\n\n', false );
			if( !sexAfter ) {
				MainView.outputText( 'Thanking her for her time, you take your leave of her.\n\n', false );
			} else {
				MainView.outputText( 'You thank her for her time as the conversation winds down.\n\n', false );
			}
		}
		//Conversation: Goblins;
		else if( convo === 7 ) {
			MainView.outputText( 'The two of you swap tales about your respective adventures, and from there the topic drifts to the strange green women you\'ve seen in the forest and the mountains.\n\n', false );
			MainView.outputText( '"<i>Ah, Goblins.</i>" Amily says, shaking her head sadly.  "<i>Yet another race corrupted by the demons.  Used to be that all they wanted was to experiment with potions and build machines.  Now all they do is fuck... Weird thing is, they seem to actively want to get pregnant.  I\'ve heard that giving birth is like the biggest, most prolonged orgasm to them.</i>"\n\n', false );
			MainView.outputText( 'You ask if they\'re aggressive.\n\n', false );
			MainView.outputText( '"<i>Not particularly... but, if you\'re female, they may get territorial and attack without warning, and if you\'ve got a penis, they\'ll want to have sex with you, even if that means beating you into submission.  They\'re... honestly kind of puny.  If you can dodge the lust potions and poisons they throw, they basically can\'t do anything to you.</i>"\n\n', false );
			if( !sexAfter ) {
				if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 0 ) {
					MainView.outputText( 'Thanking her for her time, and the warning, you head back to your own camp.\n\n', false );
				} else {
					MainView.outputText( 'Thanking her for her time, and the warning, you sit back down in your camp.\n\n', false );
				}
			} else {
				MainView.outputText( 'You thank her for her time as the conversation winds down.\n\n', false );
			}
		}
		//Conversation: What was life in her village like?;
		else if( convo === 8 ) {
			MainView.outputText( 'You think for a moment, wondering what to ask her. Then you shrug your shoulders and tell her that you\'d like to know a little more about her, that you want to get to know her better.\n\n', false );
			MainView.outputText( 'Amily looks surprised... but pleased.  "<i>I... You\'re really interested in hearing about me?  Well... okay.  What do you want to know?</i>"\n\n', false );
			MainView.outputText( 'You rack your brains for a few moments, then ask her to tell you what life was like in her village, before everything.\n\n', false );
			MainView.outputText( '"<i>Well, what was life like in your village, huh?</i>" she responds immediately.  "<i>If I gotta share something private like that, then the least you can do is reciprocate.</i>"\n\n', false );
			MainView.outputText( 'Her tone is light and playful, you think she may only be teasing, but you decide that it is fair.  And so you start to talk, telling her about your village; you describe the people, your friends, the places you liked to go.  She sits and stares at you, clearly not expecting you to share that kind of information, but she looks quite appreciative, and she listens intently.  Finally, when you finish, she gives a soft, sad smile, shakes her head, and then starts to speak.\n\n', false );
			MainView.outputText( '"<i>Life in the village, huh? It was so many years ago... and yet, I can remember it almost like it was yesterday.  The demons had already been around for a few years by the time I remember - I think I was born maybe shortly after they first appeared, I haven\'t celebrated my Day of First Breath in so long I don\'t really know how old I am.  We had walls to protect the village, and guards, but we never really believed that we would ever have to fight.  We were a peaceful, quiet little village; we had nothing of real monetary worth, we thought we would be safe, that the demons would just ignore us.  We fished in the lake, went swimming and sailed boats to amuse ourselves, we gathered fruits and nuts and berries and mushrooms from the forest, we hunted birds and small game for meat.</i>"\n\n', false );
			MainView.outputText( 'She sighs softly.  "<i>We were fools... but we were so happy, can we be blamed for being fools?  Life wasn\'t perfect, the hunters often had to hunt imps, but they never invaded our streets, and so we thought we were safe.  We quarreled and made up, we laughed and loved and lived...  It was such a wonderful time.</i>"\n\n', false );
			MainView.outputText( 'You see a small tear form in her eye and trickle down her cheek.  Unable to say why, you reach out and wipe it away with your finger.  She looks at you, startled', false );
			if( !sexAfter ) {
				MainView.outputText( ', and, embarrassed and unable to explain why you did that, you politely take your leave.', false );
			} else {
				MainView.outputText( ', before giving you a warm smile.\n\n', false );
			}
		}
		//Conversation: Who was she before it was all lost?;
		else if( convo === 9 ) {
			MainView.outputText( 'You think for a moment, wondering what to ask her.  Then you shrug your shoulders and tell her that you\'d like to know a little more about her, that you want to get to know her better.\n\n', false );
			MainView.outputText( 'Amily looks surprised... but pleased.  "<i>I...  You\'re really interested in hearing about me?  Well... okay.  What do you want to know?</i>"\n\n', false );
			MainView.outputText( 'You rack your brains for a few moments, then ask her to tell about herself, about who she was, before everything.\n\n', false );
			MainView.outputText( '"<i>Well, what were you like before you came to this world, huh?</i>" she responds immediately.  "<i>If I gotta share something private like that, then the least you can do is reciprocate.</i>"\n\n', false );
			MainView.outputText( 'Her tone is light and playful, you think she may only be teasing, but you decide that it is fair.  And so you talk to her, you tell her about your own family, your own childhood.  She listens intently, laughing with you at the funny things you remember, and nodding with sombre empathy at the sad things.  Finally, when you finish, she gives a soft, sad smile, shakes her head, and then starts to speak.\n\n', false );
			MainView.outputText( '"<i>Who was I?  Well... I was nobody, really. Just an average little girl, a face in the crowd.  Daddy was an alchemist; he made a lot of his money in those days working to purify items that were tainted in some fashion, but his primary goal was trying to come up with a concoction that could actually help purify someone who had been tainted already.  He thought that there might be something worth investigating in Pure Giant Bee Honey, but he never did succeed.</i>"\n\n', false );
			MainView.outputText( 'You ask if she didn\'t get on with her father.\n\n', false );
			MainView.outputText( '"<i>What?</i>" she asks, clearly surprised.  "<i>No, he loved me, and I loved him, but he didn\'t have a lot of free time.  I tried to take an interest in learning alchemy, it was a way to get closer to him, but it never really interested me that much.</i>"  She smiles, amused.  "<i>I was really more of a mommy\'s girl than a daddy\'s girl, I guess.</i>"\n\n', false );
			MainView.outputText( 'You ask her to tell you about her mother.\n\n', false );
			MainView.outputText( '"<i>She was a hunter - one of the best in the village.  Quick enough to run a deer to ground, quiet enough that it wouldn\'t know she was there until her knife was at its throat, skilled enough with a blowpipe to pin a fly to a tree from fifty paces without killing it,</i>" Amily boasts.  "<i>I admired her - I adored her, I wanted to be just like her.  I was always bugging her to teach me, and she worked hard to help me get good.  Everyone always said I was going to be just like her.</i>"  She smiles... and then she looks sad.  "<i>If it wasn\'t for those skills, I mightn\'t have survived when the demons came.</i>"\n\n', false );
			MainView.outputText( 'Gently, you reach out and take her hand, trying to offer her some comfort, and then ask what happened to her parents.\n\n', false );
			MainView.outputText( '"<i>I... I don\'t know.</i>" She sniffs.  "<i>The last I saw of them, daddy was throwing some exploding potions at a tentacle beast, and mom was yelling at me to run, to run as fast as I could and hide myself in the wilderness while she took on a pack of imps.  I haven\'t seen them since.</i>"  Her voice cracks, and she buries her head in her hands.\n\n', false );
			MainView.outputText( '"<i>I\'ll be alright,</i>" she sobs.  "<i>But... please... leave me alone now? Please?</i>"\n\n', false );
			MainView.outputText( 'Wanting to respect her privacy, you place a hand on her shoulder and give her a squeeze, attempting to convey that you will always be ready to talk if she needs it.', false );
			if( !sexAfter ) {
				MainView.outputText( '  Then you leave her, giving her the chance to mourn her lost family.\n\n', false );
			}
		}
		//Conversation: How did it fall?;
		else if( convo === 10 ) {
			MainView.outputText( 'You think for a moment, wondering what to ask her.  Then you shrug your shoulders and tell her that you\'d like to know a little more about her, that you want to get to know her better.\n\n', false );
			MainView.outputText( 'Amily looks surprised... but pleased.  "<i>I... You\'re really interested in hearing about me?  Well... okay.  What do you want to know?</i>"\n\n', false );
			MainView.outputText( 'Hesitantly, you ask her what happened to cause her village to fall.  Why is she the only survivor?\n\n', false );
			MainView.outputText( 'Amily looks shocked, and then sad.  "<i>I knew you would ask this, eventually,</i>" she murmurs.  Her gaze unfocuses itself, memories she evidently would rather not recall coming flooding back.  "<i>It was the evening of the annual autumn festival.  We were all in the town square, celebrating the end of another year and our success in stockpiling food to see us through the winter.  That was when they came... a horde of them, spilling over the walls, smashing through the gates. We had no sentries up... we had no forewarning.  We didn\'t know they were there until the screaming started.</i>"\n\n', false );
			MainView.outputText( 'You realize she\'s starting to shiver.\n\n', false );
			MainView.outputText( '"<i>There were so many of them... so horrible.  Imps by the dozens, the hundreds, succubi, incubi, creatures I can\'t even name.  Twisted forms, all blurring into each other...</i>"\n\n', false );
			MainView.outputText( 'You place a hand on her shoulder, trying to draw her back into the real world.  She stops shaking and continues, calmer.\n\n', false );
			MainView.outputText( '"<i>We had no weapons - we hadn\'t been well armed even before, and who took spears and daggers to a festival?  It was pandemonium - we scattered in all directions like brainless animals.  The demons just had to pick us off. Some tried to fight, but they were quickly overwhelmed - beaten down by superior force.  Some of us must have gone mad from the corruption boiling off of them, because they just gave up and let the demons have them.  I... I saw this one boy, he couldn\'t have been more then a year or two older than me.  I could only watch as he just opened his arms and looked up blissfully at this monster with a human woman\'s face, cat ears, six pairs of big, milk-seeping breasts and a horse\'s cock as long as she was tall.  She grabbed him, and forcefed him that huge dick - rammed down his throat and he just swallowed it and swallowed it, looking delighted as she pushed him to the limit.</i>"\n\n', false );
			MainView.outputText( '"<i>You can\'t imagine what it was like.  Things flapping through the darkness, twisted shapes springing out of the gloom, the stink of blood, urine, milk and cum, screaming, laughing, roaring, howling... I don\'t know how the fire started, it could have been any of a dozen reasons.  All I knew, when it was over, and I dared creep back into the ruins of what had been my home...  I was the only one left.</i>"\n\n', false );
			MainView.outputText( 'Tears are pouring down her face.  Unable to think of anything else to do, you wrap your arms around her, holding her as she leans against you and weeps silently.  Finally, you feel her tears stop, and she gently pushes you away.\n\n', false );
			MainView.outputText( '"<i>Thank you.  It\'s been so long... but it still hurts, remembering.</i>"\n\n', false );
			MainView.outputText( 'You tell her that you\'re sorry for bringing up such painful memories', false );
			if( sexAfter ) {
				MainView.outputText( '.', false );
			} else {
				MainView.outputText( ', then excuse yourself once you are certain she is okay.\n\n', false );
			}
		}
		//Conversation: How did she survive?;
		else if( convo === 11 ) {
			MainView.outputText( 'You think for a moment, wondering what to ask her.  Then you shrug your shoulders and tell her that you\'d like to know a little more about her, that you want to get to know her better.\n\n', false );
			MainView.outputText( 'Amily looks surprised... but pleased.  "<i>I... You\'re really interested in hearing about me?  Well... okay.  What do you want to know?</i>"\n\n', false );
			MainView.outputText( 'You ask her, hesitantly, how she managed to survive the destruction of her village, and how she\'s stayed alive ever since.\n\n', false );
			MainView.outputText( 'She looks not upset, like you feared, but confused.  "<i>I haven\'t explained that already?</i>" She asks.  "<i>I ran.  I ran as fast as I could for my house - I ran for my hunting knife and my blowpipes.  And then, my parents ordered me to run into the wilderness and hide.  I didn\'t want to go, but I obeyed.  I just ran and ran all through the night, stopping only when I was exhausted - and even then, I crawled into a hollow at the roots of a tree to hide.  I slept until hunger woke me, foraged for something to eat, and then I crept back to my village.  I found it ruined, and I\'ve lived here ever since.</i>"\n\n', false );
			MainView.outputText( '"<i>As for day to day survival...</i>"  She shrugs.  "<i>I do what my mother taught me.  I hunt.  I forage.  I managed to find and store a lot of left-behind food after I was sure the village was no longer being occupied, but that was eaten or went off years ago. I managed to scavenge a few bits of alchemical equipment from my parents\' home, and from the other village alchemists - not enough to do anything complicated, but enough to build a water purifier in a hidden cove, so I could distill the lake water and make it drinkable.  I also have water traps set up to catch rainwater and morning condensation. I may not be a real alchemist, but I do know what plants, animals and fungi are poisonous and I can whittle new darts for my blowpipe to use them with.  I have snares set up and I check them regularly.</i>"\n\n', false );
			MainView.outputText( 'She grins at you, mischievously.  "<i>Any more questions?</i>"\n\n', false );
			MainView.outputText( 'You shake your head "<i>no</i>', false );
			if( !sexAfter ) {
				if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 0 ) {
					MainView.outputText( '", politely excuse yourself, and head back to your own camp. It sounds like she\'s doing better at keeping a steady supply of food and water going than you are.  But if that\'s the case... why does she look so thin?\n\n', false );
				} else {
					MainView.outputText( '", politely excuse yourself, and sit back down in camp.  It sounds like she\'s doing better at keeping a steady supply of food and water going than you are.  But if that\'s the case... why does she look so thin?\n\n', false );
				}
			} else {
				MainView.outputText( '."', false );
			}
		}
		//Conversation: What does she plan to do when she gives birth?;
		else if( convo === 12 ) {
			MainView.outputText( 'You think for a moment, wondering what to ask her. Then you shrug your shoulders and tell her that you\'d like to know a little more about her, that you want to get to know her better.\n\n', false );
			MainView.outputText( 'Amily looks surprised... but pleased. "<i>I... You\'re really interested in hearing about me? Well... okay. What do you want to know?</i>"\n\n', false );
			MainView.outputText( 'You point out that she\'s told you why she wants you to father children with her, but she hasn\'t told you what she will do once she gives birth.\n\n', false );
			MainView.outputText( '"<i>You actually care what happens to them afterwards?</i>" She asks, seemingly having a hard time believing that.\n\n', false );
			MainView.outputText( 'You insist that, yes, you do want to know.\n\n', false );
			MainView.outputText( '"<i>Alright... Many of the races that are corrupt are able to breed very quickly; their pregnancies don\'t take too long, and their offspring grow to full size in a span that can take from minutes to hours,</i>" she begins explaining, "<i>My own race is quite fertile; if we don\'t take a certain herbal medicine, we can have up to two dozen children in a single pregnancy.  My plan is to take advantage of both those facts... Now that I have a pure human like you to father them for me.</i>"\n\n', false );
			MainView.outputText( 'You ask how that is supposed to work, given that she is very obviously not corrupt.\n\n', false );
			MainView.outputText( '"<i>You may have seen Goblins while you were exploring?  Well, they\'re corrupted creatures, but their corruption stems from chemicals in their blood.  I managed to... persuade... a Goblin to get me some samples of a distillation of that specific chemical.  Once I am certain I am pregnant, I can take a vial to cause my pregnancy to advance really quickly, and for the children to grow to full maturity in one or two weeks, like a Goblin does.</i>"\n\n', false );
			MainView.outputText( 'Feeling a little enlightened, you then ask her just why she needs to have so many children, and so fast.  You remember that she wants her race to be reborn outside of demonic slavery, but what will she do when she judges she has enough.\n\n', false );
			MainView.outputText( '"<i>Well, I don\'t exactly have a specific number of kids I want to deliver,</i>" she explains.  "<i>The Goblin only gave me five vials of that chemical; five pregnancies are all I\'ll get.  Once I use them, and they\'re all grown big and strong, we can leave this area and find ourselves somewhere else to found a new village.  In a place where the demons can\'t get us, we can work on expanding our numbers, bringing my people back to life as something other than just fucktoys.</i>"\n\n', false );
			MainView.outputText( 'You thank her for the explanation.\n\n', false );
		} else if( convo === 13 ) {
			//[Amily Talks About Kitsune];
			MainView.outputText( 'The two of you swap tales about your respective adventures, and from there the topic drifts to the odd many-tailed fox women you\'ve seen deep in the woods.\n\n' );
			MainView.outputText( '"<i>Kitsune,</i>" she says matter-of-factly, nodding gently.  "<i>There\'s a race that\'s hard to categorize, if there ever was one.</i>"\n\n' );
			MainView.outputText( 'You ask her what she means by this.\n\n' );
			MainView.outputText( '"<i>Well, they don\'t seem to be demons, exactly, but they do share a few things in common with them.  In spite of that, they somehow seem to have an amazing resistance to corruption.  From the tales I\'ve heard, they existed in their current form already for a long time before the demons arrived,</i>" she explains. Seeing your perplexed expression, she continues.  "<i>They have extremely potent magic, and they draw their power from living things to sustain it.  They can get it in lots of ways, but it seems like their favorite way is through sexual contact.  They form a sort of...  link, with their partner, I suppose, and absorb small amounts of their life energy.</i>"\n\n' );
			MainView.outputText( 'You nod, noting that you can see how that is similar to some of the demons you\'ve come across.\n\n' );
			MainView.outputText( '"<i>Physically, they\'re not the strongest, but they don\'t have to be – once they\'ve got you caught in one of their illusions, you\'re pretty much under their power. Despite that, they don\'t seem to be particularly evil... at least, for the most part.</i>"\n\n' );
			MainView.outputText( 'You give her a slightly quizzical look and then press her on the details.\n\n' );
			MainView.outputText( '"<i>Well... I\'ve never seen one face-to-face, but I\'ve heard some other travelers tell stories about meeting corrupted kitsune.  Nasty pieces of work, if any of it\'s true.  Most kitsune are fairly innocuous, if a little irritating.  Sometimes they can actually be pretty friendly, if you play along right.  They seem to get off on making mischief, but it\'s more or less harmless – the worst that ever happens is you wind up getting lost in the woods or find some kind of treasure that turns out to be a box of rocks when you bring it home.  The corrupted ones though... they cross a line.  Their tricks are downright vindictive... and once they finish tormenting you, they\'ll suck the life right out of you without a moment\'s hesitation.</i>"\n\n' );
			MainView.outputText( 'You ask how anyone knows this much about them, if even meeting one is so dangerous.  Amily scratches her head a bit and blushes, clearly a little embarrassed to not have a definitive answer for this one.  "<i>W-well... it\'s mostly just conjecture.  Like I said, I\'m only repeating what I\'ve heard.</i>"\n\n' );
			MainView.outputText( 'She pauses for a moment, and then speaks up with another interesting fact in an attempt to save face.  "<i>They do seem to have a strange fascination with tentacle beasts, for some reason.</i>"\n\n' );
			MainView.outputText( 'From the blush on her face, you get the feeling that she may be speaking from experience.  You don\'t press her on the matter though, ' );
			MainView.outputText( 'just nodding politely as you process the information.' );
		}
		//Conversation: How will she care for her children?;
		else {
			MainView.outputText( 'You think for a moment, wondering what to ask her.  Then you shrug your shoulders and tell her that you\'d like to know a little more about her, that you want to get to know her better.\n\n', false );
			MainView.outputText( 'Amily looks surprised... but pleased.  "<i>I...  You\'re really interested in hearing about me?  Well... okay.  What do you want to know?</i>"\n\n', false );
			if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 0 ) {
				MainView.outputText( 'You pause for a few moments, trying to think of a way to phrase this delicately, then ask her how she plans on caring for her children.\n\n', false );
				MainView.outputText( 'She looks puzzled and not quite sure if she wants to be amused or offended.  "<i>I do have lots of food stockpiled - that\'s why I\'m looking thinner than usual, in fact; I\'ve been carefully saving up and preserving as much food as I can.  Or did you think I was that bad a hunter and forager?  I wouldn\'t have lasted all these years if I was,</i>" she states.  "<i>Besides, I have a special potion I bartered from some goblins... within a week or two, any children I have will be grown enough to hunt and forage for themselves.  Don\'t worry, I can handle looking after them.</i>"\n\n', false );
			} else {
				MainView.outputText( 'You pause for a few moments, trying to think of a way to phrase this delicately, then ask her how she thinks your children are doing.\n\n' );
				MainView.outputText( 'A hint of worry creeps into her expression, matching your own; but she remains resolute. “<i>The first of our kids grew up so fast, and they seem to be doing OK out there without their parents to dote on them. The eldest are doing a great job caring for the young ones.</i>” she answers.\n\n' );
			}
			MainView.outputText( 'Feeling somewhat more reassured, but not entirely so, you get ready to leave.\n\n', false );
			MainView.outputText( '"<i>Hey, hold on a second,</i>" Amily tells you.  "<i>You were worried, weren\'t you? Worried about me...? About the children?</i>"\n\n', false );
			MainView.outputText( 'You nod and admit you were worried, yes.\n\n', false );
			MainView.outputText( '"<i>That\'s... that\'s sweet of you,</i>" Amily says, clearly shocked.  "<i>I didn\'t think you would actually care...</i>" she trails off, looking thoughtful.', false );
			if( !sexAfter ) {
				if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 0 ) {
					MainView.outputText( '  Then, as if realising you are still here, she waves at you to go, getting up and leaving herself.  Wondering what that was about, you return to camp.\n\n', false );
				} else {
					MainView.outputText( '  Then, as if realising you are still here, she waves at you to go, getting up and leaving herself.  Wondering what that was about, you sit down in camp.\n\n', false );
				}
			}
		}
		if( sexAfter ) {
			EngineCore.doNext( this, this.determineAmilySexEvent( true ) );
		} else {
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		}
	};
	//First Time Sekksin:;
	AmilyScene.prototype.stickItInMouseTwatForTheFirstTimeNOTWORTHALLBULLSHIT = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'Amily leads you on a convulated route through the ruins of the village. Up streets, down streets, around corners, even straight through some ruins.  ', false );
		//(If player is five feet or less in height:;
		if( CoC.player.tallness < 60 ) {
			MainView.outputText( 'Fortunately, being smaller than average means you have less difficulty following her than you might.', false );
		} else if( CoC.player.tallness >= 84 ) {
			MainView.outputText( 'Your considerable size makes it surprisingly tricky to get around, but you manage to stay with her.', false );
		}
		MainView.outputText( '  Finally, you are led into one particular ruined house, and from there, to a bedroom. It\'s not exactly an impressive sight; a few bits of smashed furniture, and a large mound of vaguely clean rags and tattered cushions is the closest thing to a bed. The floor is covered in a thick layer of dirt - more than just dust, it\'s like dirt was deliberately brought in from outside.\n\n', false );
		MainView.outputText( 'Amily sees you examining the room and looks sheepish. "<i>I have to stay hidden, I can\'t afford to make it too obvious that anyone lives here. That dirt actually helps warn me if anyone else has found this bolthole.</i>" She idly takes her tail in one hand and starts stroking the tip. "<i>So... here we are?</i>" She says, hesitantly. It\'s clear that for all her insistence on this being what she needed to do, she\'s evidently a virgin, and has no real idea of how to proceed from here. What do you do?\n\n', false );
		//[Take Charge];
		//[Wait for Her];
		//[Kiss Her];
		EngineCore.choices( 'Take Charge', this, this.FirstTimeAmilyTakeCharge, 'Wait 4 Her', this, this.beSomeKindofNervousDoucheAndWaitForAmily, 'Kiss Her', this, this.kissAmilyInDaMoufFirstTimeIsSomehowBetterThatWay, '', null, null, '', null, null );
	};
	//[=Take Charge=];
	AmilyScene.prototype.FirstTimeAmilyTakeCharge = function() {
		MainView.outputText( '', true );
		MainView.outputText( ImageManager.showImage( 'amily-forest-takecharge' ), false );
		this.amilySprite();
		MainView.outputText( 'You decide that the scenery doesn\'t matter; Amily promised you sex, and you want that sex. Without a word you step forward and give her a mighty push, sending her falling onto her butt with a squeak as you thrust her towards the "<i>bed</i>" - that she lands in it is more coincidence than anything. You drop down on top of her, pinning her arms and legs with your own.\n\n', false );
		MainView.outputText( '"<i>Hey, what\'s the big idea?</i>" She protests indignantly.\n\n', false );
		MainView.outputText( '"<i>You wanted sex with me, so just shut up, lie back and take it.</i>" You snap back at her.\n\n', false );
		MainView.outputText( 'Amily goes quiet, her eyes hardening into gimlets. It\'s pretty obvious she\'s not happy about this in the slightest, but she doesn\'t protest as you roughly pull off her shirt and her pants, exposing her pink sex, and then begin to tear off your own clothes.\n\n', false );
		//(If player has penis 14 inches or more long);
		if( CoC.player.cocks[ 0 ].cockLength >= 14 ) {
			if( CoC.player.cocks[ 0 ].cockType === CockTypesEnum.HUMAN || CoC.player.cocks[ 0 ].cockType.Index > 3 ) {
				MainView.outputText( 'Her eyes go wide with shock and fear as you reveal your impressively sized member, already growing erect and hard. "<i>You can\'t stick that in me! It\'ll never fit!</i>" She squeals.\n\n', false );
				MainView.outputText( '"<i>I\'ll make it fit!</i>" You assure her.\n\n', false );
			} else if( CoC.player.cocks[ 0 ].cockType === CockTypesEnum.DEMON ) {
				MainView.outputText( 'Horror and disgust write themselves on her features as your knobbly, diabolic penis is revealed to her. "<i>What kind of monster are you?! You\'ll kill me with that unholy thing!</i>"\n\n', false );
				MainView.outputText( '"<i>Just shut up and you\'ll enjoy this.</i>" You promise her.\n\n', false );
			}
			//(If player has an equine penis 14 inches or more long);
			else if( CoC.player.cocks[ 0 ].cockType === CockTypesEnum.HORSE ) {
				MainView.outputText( 'Her eyes go wide with shock and fear as she discovers your stallion-like cock. "<i>Even in this world, being hung like a horse isn\'t a good thing! I can\'t take something like that!</i>"\n\n', false );
				MainView.outputText( '"<i>How do you know until you\'ve tried?</i>" You ask.\n\n', false );
			}
			//(If player has a canine penis 14 inches or more long);
			else if( CoC.player.hasKnot( 0 ) ) {
				MainView.outputText( '"<i>You can\'t be serious!</i>" She protests when she sees what you have hidden in your pants.\n\n', false );
				MainView.outputText( 'You don\'t bother to answer her, instead licking your lips as you imagine what she\'ll feel like wrapped around your cock.\n\n', false );
			}
		}
		MainView.outputText( 'Without further ado, you thrust into her, eliciting a shriek of equal parts pain and rage. Ignoring that, you focus on trying to squeeze as much as your cock as you can into her warm, tight, velvety depths. She sobs and moans as you struggle, ', false );
		if( CoC.player.cocks[ 0 ].cockLength >= 14 ) {
			MainView.outputText( 'failing to fit in more than a foot of your cock\'s length, ', false );
		}
		MainView.outputText( 'but she doesn\'t try very hard to fight you off.\n\n', false );
		MainView.outputText( 'Your hips thrust back and forth, harder and faster as you grow more and more aroused. Her cunt grips you like a vice, and you can feel the warm delicious pressure building up inside you. Stronger and stronger it grows, until you cannot hold it back any more and with a roar let your cum gush out, flooding her as deeply as you can.\n\n', false );
		MainView.outputText( 'Only when you are sure that the last of your climax is over do you pull out, carelessly striding over to retrieve your clothing and start getting dressed. Amily stares at you, her eyes hard and sharp as flints. "<i>Was it good for you?</i>" She spits. "<i>Let\'s hope we\'ve both gotten what we want out of this.</i>"\n\n', false );
		MainView.outputText( '"<i>I\'ll be happy to come back and do it again if you need.</i>" You jeer back, finishing dressing yourself and leaving her without so much as a backwards glance.\n\n', false );
		CoC.player.orgasm();
		//Affection downer;
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] -= 5;
		this.amilyPreggoChance();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[=Wait for Her=];
	AmilyScene.prototype.beSomeKindofNervousDoucheAndWaitForAmily = function() {
		MainView.outputText( '', true );
		MainView.outputText( ImageManager.showImage( 'amily-forest-plainfuck' ), false );
		this.amilySprite();
		MainView.outputText( 'Amily may be a cute little girl, but you\'re not sure it\'s really a good idea to... proceed... So you just wait for her to decide whether she really wants to have sex here and now. After a few moments, when it\'s clear that you\'re not going to do anything, she frowns a little and steps up to you. Looking up into your eyes, you suddenly realize she wants a kiss. Bending down your head, you plan to give her a rather chaste kiss, but Amily obviously has other ideas. You feel your tongue entering her mouth, and what was intended as a short, innocent kiss turns into a very hot, rather \'not-so-innocent\' one.  Suddenly you feel her little hand (or paw?) grabbing your ass.\n\n', false );
		MainView.outputText( 'Despite this passionate display, though, she doesn\'t seem to really be \'feeling\' it, more going through the motions to arouse you. You are too horny to care that much.\n\n', false );
		//(If player has a penis 14" long or more);
		if( CoC.player.cocks[ 0 ].cockLength >= 14 ) {
			MainView.outputText( 'She leads you to her \'bed\' and makes you sit down before stripping in front of you and kneeling down to help you take off your clothes.  At the sight of your huge penis, she\'s obviously unsure of how to proceed. After a moment or two thinking about it, she begins to stroke it with her hand. Once she has you hard and almost ready to explode on her, she sits back directly in front of you, guides the tip of your member into her netherlips and resumes stroking. She adds her other hand and her tail and continues to give you a combined hand- and tail-job until you orgasm. While it doesn\'t feel bad, you get the feeling that it could have been much better - and you also realize that Amily seems to be... disappointed.\n\n', false );
		} else {
			MainView.outputText( 'At the sight of your member, she grins and begins stroking it. "<i>You are obviously the right size for me...</i>" Before long, you\'re hard and almost desperately waiting for her to start doing \'it\' for real. Never losing her grin, she slowly lowers herself onto you and guides your penis into her netherlips. The feeling is better than you imagined, but still, something doesn\'t feel quite right... However, as soon as the mouse-girl starts moving up and down, you forget anything but the pleasure you feel. It doesn\'t take long before you can\'t hold back anymore. Afterwards, Amily looks into your eyes for a moment before standing up and putting on her clothes again. You get the distinct feeling that she\'s somehow disappointed.\n\n', false );
		}

		MainView.outputText( 'Seeing as how she clearly has no further need for you, you quietly excuse yourself, get dressed and leave.', false );
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] -= 2;
		this.amilyPreggoChance();
		CoC.player.orgasm();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[=Kiss Her=];
	AmilyScene.prototype.kissAmilyInDaMoufFirstTimeIsSomehowBetterThatWay = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( ImageManager.showImage( 'amily-forest-kissingfuck' ), false );
		MainView.outputText( 'While the scenery certainly isn\'t anything you\'d call "<i>romantic</i>" or "<i>arousing</i>", the eager little mouse-girl in front of you is quite appealing, so you step up to her, take her in your arms and lightly kiss her. Seeing her eyes widen in surprise for a moment, she soon closes her eyes and returns the kiss. Continuing the kiss you two begin to explore each other. Along the way, you help each other out of your clothes and slowly, almost reluctantly step back so you can for the first time see each other without anything in the way.\n\n', false );
		//(If player has a penis 14" long or more);
		if( CoC.player.cocks[ 0 ].cockLength >= 14 ) {
			MainView.outputText( 'At the size of your penis, Amily\'s eyes widen, but she still seems to be almost mesmerized. Slowly, blushing furiously and avoiding your gaze, she touches it and begins stroking your member. It soon turns into a veritable hand-job. Not taking her hand away, the mouse-girl guides you to the \'bed\' and asks you to lie down. She continues stroking your penis with her hand, but also uses her tail and her tongue to bring you closer and closer to orgasm. Just before you can\'t hold back anymore, she sits down on your legs and slowly guides the tip of your penis to her netherlips. Soon, this \'almost penetration\' overwhelms you and sends you over the edge.\n\n', false );
		} else {
			MainView.outputText( 'She looks down between your legs and, blushing, smiles. "<i>It\'s nice to see a ' + CoC.player.mf( 'man', 'woman' ) + ' who hasn\'t gone insane about that part.</i>" She murmurs to you, holding you as tightly as she can. Despite the fact you can feel her hands pressed against your back, you suddenly become aware of something stroking your penis as well; it takes a bit of wriggling, which presses her small, perky breasts to your chest in the most interesting way, but you can see that she is using her tail. Working in synch as best you can, the two of you crabwalk over to the pile of bedding and topple over; you land on your back, and she lands on you.\n\n', false );
			MainView.outputText( 'By this point, your member is rock hard, and Amily pushes, somewhat reluctantly, against your grip, positioning herself so that the two of you are crotch to crotch. Looking up at her, you start to mouth the question "<i>Are you okay with this?</i>" to her, but she smiles, nods her head insistently, and then her lips seal themselves against yours again. Her vagina hovers almost teasingly against the tip of your cock as she works up the courage to make the final plunge... and plunge she does, suddenly skewering herself to the hilt upon you, to your shock. You can feel her pained wince, muscles clenching in pain all up her body, and you hold her tighter, kiss her deeper, in an effort to try and comfort her. You lie there, holding her, until she relaxes and unclenches, slowly beginning to work herself back and forth.\n\n', false );
		}
		MainView.outputText( 'Enjoying the sensations, you start caressing her to increase her pleasure, too. It doesn\'t take long for you both to orgasm, before Amily sinks down on you, looking into your eyes with a smile on her face.\n\n', false );
		MainView.outputText( '"<i>...That was... wow. Uh, I mean.</i>" She hastily corrects herself, blushing. "<i>I guess you weren\'t so bad... I knew I had a good feeling about you.</i>" She smiles. "<i>You do know I\'m not neccessarily pregnant, right? We\'re going to have to do this again.</i>"\n\n', false );
		MainView.outputText( 'You smile, and tell her that you\'re happy to do it with her as often as it takes. She blushes so red ', false );
		//([horsecock];
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'it\'s almost like the fur on her cheeks has turned red.', false );
		} else {
			MainView.outputText( 'she nearly resembles an imp!', false );
		}
		MainView.outputText( '  Excusing yourself, you get dressed, receiving a lazy wave goodbye and a happy smile as you head out of the door and head for the main street, from there finding the way back to your camp.\n\n', false );
		//Affection boost?;
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 3;
		CoC.player.orgasm();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		this.amilyPreggoChance();
	};
	AmilyScene.prototype.amilySexHappens = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		var x = CoC.player.cockThatFits( 61 );
		//If too big;
		if( x === -1 && CoC.player.hasCock() ) {
			MainView.outputText( 'Amily looks between your legs and doubles over laughing, "<i>There is no way that thing is fitting inside of me!  You need to find a way to shrink that thing down before we get in bed!</i>"', false );
			CoC.flags[ kFLAGS.AMILY_AFFECTION ]--;
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		if( CoC.flags[ kFLAGS.AMILY_FUCK_COUNTER ] === 0 ) {
			this.stickItInMouseTwatForTheFirstTimeNOTWORTHALLBULLSHIT();
			CoC.flags[ kFLAGS.AMILY_FUCK_COUNTER ]++;
			return;
		}
		//Low Affection Sex:;
		if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
			MainView.outputText( 'Amily\'s efforts at leading you through the ruined village are brisk and efficient. You don\'t really think she\'s looking forward to doing this all that much. No, that might be overstating things. It\'s more like she\'s under the impression that, details aside, this encounter between the two of you will be pure business.\n\n', false );
			MainView.outputText( 'It\'s hard for you to say if you were led by a different route this time, but soon you are in what Amily has to offer for a private bedchamber, and she begins to reach for her clothes, obviously expecting you to do the same thing.\n\n', false );
			EngineCore.choices( 'Business', this, this.amilySexBusiness, 'Playtime 1st', this, this.amilySexPlaytimeFirst, '', null, null, '', null, null, '', null, null );
		}
		//Moderate Affection Sex:;
		else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
			var pregEvent = this.pregnancy.event;
			MainView.outputText( 'Amily leads you to her nest as quickly as ever, but things are a little different this time. You can tell Amily has what can only be described as a \'spring in her step\'. She moves just a little bit quicker, she seems more enthusiastic about the prospect - her tail even waves slowly from side to side, a bit of body language you haven\'t seen from her before. And you\'re certain there\'s a bit of a seductive wiggle to her hips - which you definitely haven\'t seen from her before.', false );
			//(If Amily is Slightly Pregnant:;
			if( pregEvent >= 1 && pregEvent <= 5 ) {
				MainView.outputText( '  However, she does sometimes touch the swell signifying the litter growing inside her, and when she does her attitude becomes uncertain and nervous.', false );
			}
			MainView.outputText( '\n\n', false );
			MainView.outputText( 'Once you are inside, Amily gently tries to push you onto the bedding where you will be mating. Once you are seated, she smiles at you with a teasing expression and begins to slowly strip herself off, clearly trying to make the act seem as erotic as possible.', false );
			if( pregEvent >= 6 ) {
				MainView.outputText( '  However, her confidence visibly slips when she has to fully bare the bulging belly that marks her pregnant state, but she musters the confidence and starts to show it off for you as well.', false );
			}
			EngineCore.choices( 'Step In', this, this.amilyStepTheFuckIn, 'Watch Show', this, this.amilyEnjoyShow, '', null, null, '', null, null, '', null, null );
		} else {
			if( this.pregnancy.event >= 6 ) {
				this.fuckAmilyPreg();
			} else {
				this.amilyHighAffectionSecks();
			}
		}
	};
	//[Straight To Business];
	AmilyScene.prototype.amilySexBusiness = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'Allowing Amily to take care of her clothes, you hastily remove your own ' + CoC.player.armorName + '. Once the two of you are naked in front of each other, Amily looks you up and down, and then sniffs - not in disdain, but honestly trying to get a good scent of you. You speculate that this is some kind of check to see that you haven\'t somehow managed to become corrupted since last you met.\n\n', false );
		this.amilySexPtII();
	};
	//[Playtime First];
	AmilyScene.prototype.amilySexPlaytimeFirst = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'As Amily begins reaching for her clothes, rather than start stripping off yourself, you close the distance between the two of you and take hold of her hands.\n\n', false );
		MainView.outputText( '"<i>W-What are you doing?</i>" She asks, curious and a little wary.\n\n', false );
		MainView.outputText( 'You simply smile back at her, and then gently begin to undress her, stopping her from lifting a finger to take off her clothes as you playfully remove them for her. At least, as playfully as you can, given how simple her garb is. The mouse-girl is confused, and she blushes a bit, but you think she\'s enjoying the attention, and you take this as an opportunity to gently scratch the base of her tail and tickle the rim of her ears with your fingers, the latter of which makes her giggle despite herself. Once she is standing nude before you, you begin to take off your own clothes. However, to your surprise, it is her turn to stop you.\n\n', false );
		MainView.outputText( '"<i>Fair is fair.</i>" She growls, but she\'s blushing faintly. Clumsy with unfamiliarity, she nonetheless does her best to remove your ' + CoC.player.armorName + ' in as erotic a fashion as she can manage, and you catch her nimble little fingers hesitantly stroking across the more interesting parts of your anatomy more than once. When you stand before her naked, she carefully looks you over and takes several deep breaths through her nose.\n\n', false );
		MainView.outputText( '"<i>Just making sure that you haven\'t... you know, picked up something you shouldn\'t.</i>" She explains softly.\n\n', false );
		EngineCore.dynStats( 'lus', 5 );
		this.amilySexPtII();
	};
	AmilyScene.prototype.amilySexPtII = function() {
		this.amilySprite();
		//worm infested reaction;
		if( CoC.player.findStatusAffect( StatusAffects.Infested ) >= 0 ) {
			MainView.outputText( '"<i>EWWWW!  You\'re infested!</i>" she shrieks, "<i>Get out!  Don\'t come back \'til you get rid of the worms!</i>"\n\nYou high tail it out of there.  It looks like Amily doesn\'t want much to do with you until you\'re cured.', false );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			CoC.flags[ kFLAGS.AMILY_AFFECTION ] -= 3;
			CoC.flags[ kFLAGS.AMILY_GROSSED_OUT_BY_WORMS ] = 1;
			return;
		}
		MainView.outputText( 'Now that both of you are naked, Amily takes a step back from you and begins to stroke herself - though her gestures are a little hesitant, and she clearly has never done this before, she is sincerely trying to be arousing. A finger strokes each dainty little nipple, circling around in opposite directions in order to make them perk as hard as they can. Her right hand slips away, leaving her left hand to alternate between each nipple as her nimble fingers begin to tease her most private of places. She may not be extraordinarily skilled at it, but she\'s definitely doing a good job of turning you on - particularly with the cute little gasp she makes when she pinches her clitoris a bit too hard.\n\n', false );
		EngineCore.choices( 'Sit & Watch', this, this.sitAndWatchAmilySex, 'Caress Her', this, this.caressAmilyHaveSex, '', null, null, '', null, null, '', null, null );
	};
	//[Sit & Watch];
	AmilyScene.prototype.sitAndWatchAmilySex = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		var x = CoC.player.cockThatFits( 61 );
		MainView.outputText( 'You stay right where you are, not wanting to spoil the show. By the time that she is visibly starting to drip girlcum and approaches you, clearly ready to move on to the main event, your ' + Descriptors.cockDescript( x ) + ' is iron-hard.\n\n', false );
		EngineCore.dynStats( 'lus', 50 );
		this.continueAmilySmex();
	};
	//[Caress Her];
	AmilyScene.prototype.caressAmilyHaveSex = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'Watching Amily masturbate and tease herself in front of you is definitely erotic... but you want something more to this session than that. Licking your lips with a combination of arousal and nervousness, you tentatively reach out one hand and brush a feather-light touch against her fingers.  Her eyes, which she had previously been keeping closed, suddenly spring open, and you ready yourself to withdraw and apologize if she protests. But, for whatever reason, she does not protest and, emboldened, you continue to touch and caress her. You keep your touches gentle, light and restricted to non-intimate regions, but she seems to be enjoying this; she draws a little closer, and reaches out to brush your cheek, absentmindedly using the very hand she had been stroking her netherlips with before, and so the scent of her intimate regions drifts to your nostrils from where her fingers lay. Her eyes have rolled almost completely shut, the gaze she is giving you is a very languid one, but something about the set of her lips, only just starting to open, entices you to kiss them.\n\n', false );
		EngineCore.choices( 'Refuse Kiss', this, this.AmilyGetKissed, 'Kiss Her', this, this.AmilyTakeTheKiss, '', null, null, '', null, null, '', null, null );
	};
	//[Refuse the Kiss];
	AmilyScene.prototype.AmilyGetKissed = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You pull your mind back from that thought. That\'s taking things in directions you\'re not sure that either you or Amily are actually comfortable with.\n\n', false );
		this.continueAmilySmex();
		//Affection hit!;
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] -= 3;
	};
	//[Take the Kiss];
	AmilyScene.prototype.AmilyTakeTheKiss = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'Slowly, doing your best to convey that you will stop or back away if Amily is uncomfortable with this, you press your lips tenderly to Amily\'s.', false );
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( '  It\'s quite an unusual experience; though her lips proper are as naked as your own, there is fur around them, soft and fine and just close enough to tickle the edges of your own lips, to say nothing of the unusual sensation of kissing someone with a muzzle.  Amily doesn\'t seem bothered at all. In fact, she kisses you back, and quite eagerly so, too.', false );
		}
		MainView.outputText( '\n\n', false );
		this.continueAmilySmex();
		EngineCore.dynStats( 'lus', 5 );
		//AffectionGAIN!;
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 1 + Utils.rand( 3 );
	};
	AmilyScene.prototype.continueAmilySmex = function() {
		var x = CoC.player.cockThatFits( 61 );
		this.amilySprite();
		MainView.outputText( ImageManager.showImage( 'amily-forest-plainfuck' ), false );
		MainView.outputText( 'The time couldn\'t be any more right for either of you, and you both sink onto the bedding that Amily has prepared. Lying side by side, Amily guides you with surprising efficiency into her entry, and then, once you are comfortably inside, she begins to thrust, her cunt gripping your ' + Descriptors.cockDescript( x ) + ' like a vice.\n\n', false );
		/*(If player chooses 'Share The Pleasure':) {
		 MainView.outputText('Determined to make this good for Amily too, you resume stroking and caressing her, doing your best to meet her thrusts with your own, and planting the odd kiss on the nape of her neck', false);
		 //([horsecock];
		 if(CoC.flags[kFLAGS.AMILY_NOT_FURRY]==0)
		 MainView.outputText(' - not actually an unpleasant experience, despite the fur', false);
		 MainView.outputText('. She is surprised, and tenses warily at first, but then melts under your ministrations, squeaking softly in her appreciation of your efforts.', false);
		 }
		 */
		MainView.outputText( 'But all good things must come to an end, and soon you both build to a mutual climax. Once you have regained your strength, you stop holding each other and begin to dress, ready to go your separate ways once more. At the door, though, Amily stops you.\n\n', false );
		MainView.outputText( '"<i>Thank you, that was... nice...,</i>" the little mousegirl says with a blush. "<i>Maybe... we can... do it again?</i>"\n\n', false );
		MainView.outputText( 'She seems surprised that she actually enjoyed it (at least a little), but she\'s definitely willing to repeat the experience. You assure her that you\'ll come back, and then resume your travels.', false );
		//Knock up, PC stats, etc.;
		CoC.flags[ kFLAGS.AMILY_FUCK_COUNTER ]++;
		this.amilyPreggoChance();
		//Slight affection gain?;
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 1 + Utils.rand( 2 );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -1 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};

	//[Enjoy The Show];
	AmilyScene.prototype.amilyEnjoyShow = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'Surprised, curious and aroused in equal measures, you decide to sit back and watch the show. Amily seems very happy to perform for you, and does her best to make it as intriguing as possible.', false );
		if( this.pregnancy.event >= 6 ) {
			MainView.outputText( '  Even though she was clearly a little nervous about her gravid state in the beginning, as she continues, she grows in confidence to the point it seems she has almost forgotten about it.', false );
		}
		MainView.outputText( '\n\n', false );
		this.AmilyMidSexLevel2();
	};
	//[Step In];
	AmilyScene.prototype.amilyStepTheFuckIn = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'Eager, confused and feeling impatient, you rise from your seat to help Amily undress. She accepts your help, and does seem to enjoy your touches and help, but at the same time she seems disappointed... maybe even a little hurt? Almost as if she had been wanting you to watch her efforts?\n\n', false );
		this.AmilyMidSexLevel2();
	};
	AmilyScene.prototype.AmilyMidSexLevel2 = function() {
		EngineCore.dynStats( 'lus', 5 );
		this.amilySprite();
		MainView.outputText( 'By the time Amily is completely naked, she is clearly excited about what is coming up; you even think she\'s wet already. She stares at you with a mischievous, turned-on smile, waiting to see what you will do now that it is your turn to strip.\n\n', false );
		MainView.outputText( 'Do you do a striptease of your own or just strip naked and get to business?', false );
		EngineCore.choices( 'Striptease', this, this.StripForAmilyYouSlut, 'Business', this, this.getDownWithSexTiem, '', null, null, '', null, null, '', null, null );
	};
	//[Fair Is Fair];
	AmilyScene.prototype.StripForAmilyYouSlut = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		var x = CoC.player.cockThatFits( 61 );
		MainView.outputText( 'It is your turn to give her a mischievous smile back. Feeling turned on and excited, and remembering the elders in the village telling you that fair is only fair, you decide to give her a little show of her own. Standing up, you tilt your head back and thrust out your chest, trying to look enticing. As Amily watches, at first bemused and then pleased, you slowly strip off your ' + CoC.player.armorName + ', working hard to make it as sensual and suggestive as possible. You show off your body for her, leisurely stroking your own limbs and down your midriff to finally reveal that which lies inside your pants; your ' + Descriptors.cockDescript( x ) + '. Amily is definitely appreciative of the show.\n\n', false );
		this.continueWithMoreMidLevelAmilySex();
	};
	//[Straight To Business];
	AmilyScene.prototype.getDownWithSexTiem = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		var x = CoC.player.cockThatFits( 61 );
		MainView.outputText( 'Too horny to think of anything else than what lies ahead, you hastily remove your ' + CoC.player.armorName + '.  Amily smiles at what she can see, enjoying the sight of your body and your ' + Descriptors.cockDescript( x ) + '.\n\n', false );
		this.continueWithMoreMidLevelAmilySex();
	};
	AmilyScene.prototype.continueWithMoreMidLevelAmilySex = function() {
		EngineCore.dynStats( 'lus', 5 );
		this.amilySprite();
		MainView.outputText( 'Once you are both naked, you embrace and begin with a deep kiss. Slowly you both sink down and start exploring each other\'s bodies. You feel Amily\'s hands caressing you while you lightly kiss her breasts, one of your hands slowly drifting down to her cute ass and lightly squeezing it. Looking into her eyes, you see a sparkle in them before she surprises you and somehow manages to turn you onto your back. Now she\'s sitting on your belly, with your already hard cock being fondled by her rather flexible tail. Grinning at you, she seems to plan on teasing you as long as possible before allowing you to enter her.\n\n', false );
		EngineCore.choices( 'Play Along', this, this.playAlongWithAmilyWhataDumbBitch, 'Please Her', this, this.workToPleaseTheCunt, '', null, null, '', null, null, '', null, null );
	};
	//[Play Along];
	AmilyScene.prototype.playAlongWithAmilyWhataDumbBitch = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( ImageManager.showImage( 'amily-forest-reverse-cowgirl' ), false );
		MainView.outputText( 'You decide to let her take the dominant position, relax (as much as you can with a beautiful, hot and very wet little mouse-girl sitting on you and fondling you) and simply enjoy her attentions. Amily obviously knows what she is doing - though you have no idea HOW she knows - and manages to bring you nearly to the climax before drawing back a little and letting you calm down.  She repeats this several times until you\'re nearly going crazy.  Just when you think you can\'t stand it anymore, she removes her tail from your cock and instead uses it to lightly bind your hands. You could easily move your hands, but decide not to. Grinning at you, she hovers a moment over your cock before slowly sinking down. You somehow manage to avoid cumming as soon as you enter her, but it\'s really, really hard. Amily\'s tail draws your \'bound\' hands onto her breasts, while hers start caressing yours as she begins slowly riding you. Soon, the speed increases, and it isn\'t long before you both orgasm.\n\n', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -1 );
		this.AmilyMiddleGradeSexOver();
	};
	//[Work To Please Her];
	AmilyScene.prototype.workToPleaseTheCunt = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You decide to take a more active role and start caressing her, kneading her breasts and making sure she enjoys it just as much as you do. Soon, Amily can\'t hold herself back and sinks down on you, beginning to ride you for all she\'s worth. It doesn\'t take you two long to reach the climax.\n\n', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -1 );
		this.AmilyMiddleGradeSexOver();
	};
	AmilyScene.prototype.AmilyMiddleGradeSexOver = function() {
		this.amilySprite();
		MainView.outputText( 'Quite spent from your lovemaking, Amily sinks down on your breast, smiles at you and slowly dozes off. You also drift off to sleep soon after. Some time later, you wake up to find her already putting on her clothes again.\n\n', false );
		//Affection gain here?;
		this.amilyPreggoChance();
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 3 + Utils.rand( 4 );
		CoC.flags[ kFLAGS.AMILY_FUCK_COUNTER ]++;
		EngineCore.choices( 'Say Goodbye', this, this.sayGoodByeToAmilyPostSecks, 'Stay A While', this, this.stayAfterAmilyMiddleGradeSecks, '', null, null, '', null, null, '', null, null );
	};
	//[Say Goodbye];
	AmilyScene.prototype.sayGoodByeToAmilyPostSecks = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You smile at her and give her a kiss before saying goodbye and returning to your camp.', false );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[Stay A While];
	AmilyScene.prototype.stayAfterAmilyMiddleGradeSecks = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You decide you\'d rather stay with her a little longer, so you get up, go to her and with a kiss and some caresses draw her down again. She doesn\'t really put up any resistance, so you both lie there kissing and caressing each other for some time before you finally say goodbye and return to your camp.', false );
		//Bonus affection mayhapz?;
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 3;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};

	//[High Affection - Non-Pregnant/Slightly Pregnant];
	AmilyScene.prototype.amilyHighAffectionSecks = function() {
		this.amilySprite();
		var x = CoC.player.cockThatFits( 61 );
		MainView.outputText( 'Amily really didn\'t waste any time getting to her hidden bedroom, sprinting as fast as she could with you in tow.', false );
		if( this.pregnancy.isPregnant ) {
			MainView.outputText( '  Even in a slightly pregnant state, she goes surprisingly fast, though she\'s also rather cautious of her small bump.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'Once inside, the two of you get to work undoing each others clothes, tossing the garments across the room with little care for them. Amily bites her lower lip as she examines your naked form again, before practically jumping you. She wraps her small hands around your stiff ' + Appearance.cockNoun( CoC.player.cocks[ x ].cockType ) + ' in an almost painful fashion, rubbing and teasing it, and presses her mouth against yours, her tongue exploring every inch of your mouth that it can reach, and you quickly respond by doing the same favor for Amily.', false );
		if( this.pregnancy.isPregnant ) {
			MainView.outputText( '  Really it seems the only thing between you two now is Amily\'s small stomach bulge.', false );
		}
		//(If Amily is herm:;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( '  You can feel her erection, hot and solid, pressed between your two bodies.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'Not releasing her grip on your raging erection, or breaking the passionate kiss for even a single second, she moves back toward the bed and takes you with her. You\'re quite surprised that the quiet mousegirl has come out of her shell and is being so forward. Is this the effect you have on her?\n\n', false );
		MainView.outputText( 'Finally putting some distance between the two of you, Amily flops back onto the bed and places her hands behind her head, presenting her beautiful body to you. Finding the sight irresistible, you move your head between her legs and start licking at her moist vag, pushing your tongue or your fingers in every once in a while, and ', false );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] === 0 ) {
			MainView.outputText( 'sucking on her sensitive clit', false );
		} else {
			MainView.outputText( 'licking and kissing her human-like cock', false );
		}
		MainView.outputText( ' to stimulate her further. In response, Amily moans loudly and spreads her legs further apart, an invitation to continue. You happily oblige your lover, burying two fingers into her wet cunt while you move to other parts of her body.', false );
		if( this.pregnancy.isPregnant ) {
			MainView.outputText( '  As you move your head across her beautiful form, you stop at her growing baby bump and give it a small kiss.', false );
		}
		MainView.outputText( '  Your head hovers at her breasts', false );
		if( this.pregnancy.isPregnant ) {
			MainView.outputText( ', which seem to have grown from the pregnancy,', false );
		}
		MainView.outputText( ' and get to work licking and suckling her nipples, rubbing the sensitive mounds.', false );
		if( this.pregnancy.isPregnant ) {
			MainView.outputText( '  When you get a dribble of milk in your mouth it surprises you, but you certainly don\'t stop.  "<i>Hah...You\'re going to have to teach the children how that\'s done,</i>" Amily says, in between fevered breaths.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'By the time you start teasing her neck and collarbone, Amily\'s hands are clinging onto your back and she\'s impatiently grinding against your raging erection.  "<i>Please don\'t tease me anymore,</i>" Amily whispers into your ear, making you almost feel a little bad for teasing your love in such a way.\n\n', false );
		MainView.outputText( 'As an apology you quickly push your ' + Descriptors.cockDescript( x ) + ' past her dampened nether-lips, and set to work thrusting in and out of your mousegirl lover.', false );
		if( this.pregnancy.isPregnant ) {
			MainView.outputText( '  You are of course mindful of her baby bump, not going too fast and making sure you\'re in a position that\'s comfortable for the two of you, not wanting to harm your future offspring with the lovely mouse maiden.', false );
		}
		MainView.outputText( '  It\'s not too long before you\'re going at a regular pace, stuffing Amily\'s fuckhole with your familiar manhood.\n\n', false );
		MainView.outputText( 'Amily moans from the pleasure and raises her hips up to meet your thrusts, desperate for more of your loving.  She whispers a few dirty things to you between shallow breaths, "<i>', false );
		if( !this.pregnancy.isPregnant ) {
			MainView.outputText( 'Fill me up with everything you have... I want to be a mother for your children, just as much as I want to be a mother of my own people,', false );
		} else {
			MainView.outputText( 'No need to hold back, pump as much cum into me as you can,', false );
		}
		MainView.outputText( '</i>" she whispers in a sultry tone, and her words are enough to send you over the edge. You grunt loudly, feeling as if your cock is about to explode from the exertion, blasting Amily so full of your cum that it starts to ooze out. Amily gives a cute little cry, and her vaginal walls clamp down on your sensitive member with enough force to make you wince as girlcum sprays out onto your thighs', false );
		//(if Amily is herm:;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( ' and cum spurts into the air between you, splattering on you both', false );
		}
		MainView.outputText( '.\n\n', false );
		if( !this.pregnancy.isPregnant ) {
			MainView.outputText( '"<i>If that didn\'t knock me up... I don\'t care as much as you\'d think. It was magnificent either way,', false );
		} else {
			MainView.outputText( '"<i>Hmm...My kids are pretty lucky that their father is such a virile specimen,', false );
		}
		MainView.outputText( '</i>" Amily says as she catches her breath, reaching up to ruffle your hair. You give her a bashful smile, glad to see you\'ve made her so happy.\n\n', false );
		MainView.outputText( 'The two of you lie together for some time, and it\'s with great regret that you tell her that you need to check in on your own camp. Amily seems disappointed, not wanting you to leave, but understands why you need to go. "<i>', false );
		if( !this.pregnancy.isPregnant ) {
			MainView.outputText( 'Okay... Well, I\'m sure you\'ll be back. I will need your help again if this doesn\'t set,', false );
		} else {
			MainView.outputText( 'Okay dear...But you better come back some time. You don\'t want your children to have abandonment issues, do you?', false );
		}
		MainView.outputText( '</i>" Amily says while rubbing her stomach. You smile at her and nod, promising you\'ll come back, before setting off for your own camp.', false );
		/*OLD
		 outputText('Amily really didn\'t waste any time getting to her hidden bedroom, sprinting as fast as she could with you in tow.', false);
		 if(CoC.flags[kFLAGS.AMILY_INCUBATION] > 0) {
		 MainView.outputText('  Even in a slightly pregnant state she goes surprisingly fast, though she\'s also rather cautious of her small bump.', false);
		 }
		 MainView.outputText('\n\n', false);
		 MainView.outputText('Once inside, the two of you get to work undoing each others clothes, tossing the garments across the room with little care for them. Amily bites her lower lip as she examines your naked form again, before practically jumping you. She wraps her small hands around your stiff ' + Descriptors.cockDescript(0) + ' in an almost painful fashion, rubbing and teasing it, and presses her mouth against yours, her tongue exploring every inch of your mouth that it can reach, and you quickly respond by doing the same favor for Amily.', false);
		 if(CoC.flags[kFLAGS.AMILY_INCUBATION] > 0) {
		 MainView.outputText('  Really it seems the only thing in-between you two now is Amily\'s small stomach bulge.', false);
		 }
		 MainView.outputText('\n\n', false);
		 MainView.outputText('Not releasing her grip on your raging erection, or breaking the passionate kiss for even a single second, she moves back toward the bed and takes you with her. You\'re quite surprised that the quiet mousegirl has come out of her shell and is being so forward. Is this the effect you have on her?\n\n', false);
		 MainView.outputText('Finally putting some distance between the two of you, Amily flops back onto the bed and places her hands behind her head, presenting her beautiful body to you. Finding the sight irresistible, you move your head between her legs and start licking at her moist vag, pushing your tongue or your fingers in every once in a while, and sucking on her sensitive clit to stimulate her further. In response, Amily moans loudly and spreads her legs further apart, an invitation to continue. You happily oblige your lover, burying two fingers into her wet cunt while you move to other parts of her body.', false);
		 if(CoC.flags[kFLAGS.AMILY_INCUBATION] > 0) {
		 MainView.outputText('  As you move your head across her beautiful form, you stop at her growing baby bump and give it a small kiss.', false);
		 }
		 MainView.outputText('  Your head hovers at her breasts ', false);
		 if(CoC.flags[kFLAGS.AMILY_INCUBATION] > 0) {
		 MainView.outputText('which seem to have grown from the pregnancy ', false);
		 }
		 MainView.outputText('and get to work licking and suckling her nipples, and rubbing the sensitive mounds.', false);
		 if(CoC.flags[kFLAGS.AMILY_INCUBATION] > 0) {
		 MainView.outputText('  When you get a dribble of milk in your mouth it surprises you, but you certainly don\'t stop "<i>Hah... You\'re going to have to teach the children how that\'s done,</i>" Amily says in between fevered breaths.', false);
		 }
		 MainView.outputText('\n\n', false);
		 MainView.outputText('By the time you start teasing her neck and collarbone, Amily\'s hands are clinging onto your back and she\'s impatiently grinding against your raging erection. "<i>Please don\'t tease me anymore...</i>" Amily whispers into your ear, making you almost feel a little bad for teasing your love in such a way.\n\n', false);
		 MainView.outputText('As an apology you quickly push your ' + Descriptors.cockDescript(0) + ' past her dampened nether-lips, and set to work thrusting in and out of your mousegirl lover.', false);
		 if(CoC.flags[kFLAGS.AMILY_INCUBATION] > 0) {
		 MainView.outputText('  You are of course mindful of her baby bump, not going too fast and making sure you\'re in a position that\'s comfortable for the two of you.  You don\'t want to harm your future offspring with the lovely mouse maiden.', false);
		 }
		 MainView.outputText('  It\'s not too long before you\'re going at a regular pace, stuffing Amily\'s fuckhole with your familiar manhood.\n\n', false);
		 MainView.outputText('Amily moans from the pleasure and raises her hips up to meet your thrusts, desperate for more of your loving, whispering a few dirty things to you between shallow breaths "<i>', false);
		 //not preggo;
		 if(CoC.flags[kFLAGS.AMILY_INCUBATION] === 0) {
		 MainView.outputText('Fill me up with everything you have...I want to be a mother for your children, just as much as I want to be a mother of my own people...', false);
		 } else {
		 MainView.outputText('No need to hold back, pump as much cum into me as you can...', false);
		 }
		 MainView.outputText('</i>" she whispers in a sultry tone, and her words are enough to send you over the edge. You grunt loudly, feeling as if your cock is about to explode from the exertion, blasting Amily so full of your cum that it starts to ooze out. Amily gives a cute little cry, and her vaginal walls clamp down on your sensitive member with enough force to make you wince, as girlcum sprays out onto your thighs.\n\n', false);
		 //no preggo;
		 if(CoC.flags[kFLAGS.AMILY_INCUBATION] === 0) {
		 MainView.outputText('"<i>If that didn\'t knock me up...I don\'t care as much as you\'d think. It was magnificent either way,', false);
		 } else {
		 MainView.outputText('"<i>Hmm...My kids are pretty lucky that their father is such a virile specimen,', false);
		 }
		 MainView.outputText('</i>" Amily says as she catches her breath, reaching up to ruffle your hair. You give her a bashful smile, glad to see you\'ve made her so happy.\n\n', false);
		 MainView.outputText('The two of you lie together for some time, and it\'s with great regret that you tell her that you need to check in on your own camp. Amily seems dissapointed, not wanting you to leave, but understands why you need to go. "<i>', false);
		 //no pregg;
		 if(CoC.flags[kFLAGS.AMILY_INCUBATION] === 0) {
		 MainView.outputText('Okay...Well, I\'m sure you\'ll be back. I will need your help again if this doesn\'t set,', false);
		 } else {
		 MainView.outputText('Okay dear... but you\'d better come back some time. You don\'t want your children to have abandonment issues, do you?', false);
		 }
		 MainView.outputText('</i>" Amily says, rubbing her stomach. You smile at her and nod, promising you\'ll come back, before setting off for your own camp.', false);
		 */
		//boost affection;
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 2 + Utils.rand( 4 );
		CoC.flags[ kFLAGS.AMILY_FUCK_COUNTER ]++;
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -1 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		//preggo chance;
		this.amilyPreggoChance();
	};
	//[High Affection- Heavily Pregnant];
	AmilyScene.prototype.fuckAmilyPreg = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( ImageManager.showImage( 'amily-forest-fuckpreg' ), false );
		MainView.outputText( 'Amily leads you by the hand to her hiding place as quickly as possible... which is a relatively brisk walking speed. You don\'t rush her or anything, understanding how the heavy bump on her belly is slowing her down, moving side-by-side at the same pace.  You try to help Amily over the difficult terrain facing her.', false );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( '  The erection tenting her pants isn\'t helping.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'Once inside the little safe spot you help Amily undress from her restrictive garments, getting a good grope at every sensual curve your hands roam over. It\'s only when Amily herself is fully undressed that you remove your own gear.\n\n', false );
		MainView.outputText( 'Amily, as per usual, is quite pleased by your naked form but she herself is casting her gaze to the ground and blushing furiously. "<i>Do you still think I\'m pretty?</i>" she asks you, and you waste no time telling her that she\'s more beautiful than ever now, her new curves are far more emphasised and certainly arousing to look at. Amily\'s expression brightens at that, and she hugs onto you as tightly as she can, declaring just how much she loves you. Your own feelings for her seem to be mutual.\n\n', false );
		MainView.outputText( 'She pulls your head in, your lips locking in a passionate display, her hands tracing a line down to your chest until she\'s gently fondling your cock.  ', false );
		//(If player has a tail);
		if( CoC.player.tailType > AppearanceDefs.TAIL_TYPE_NONE ) {
			MainView.outputText( 'You even feel Amily wrap her mousy tail around your own, making you chuckle softly into your lovers mouth.  ', false );
		} else {
			MainView.outputText( 'A tickling sensation hits your body, making you snort and giggle, realising that Amily\'s tail is fondling your thigh.  ', false );
		}
		MainView.outputText( 'Your eyes catch sight of Amily\'s swollen breasts, seeing a few drops of milk on her stiff nipples. You smirk and fondle her breasts, breaking the kiss every few moments to get a taste of her milk. Amily moans in response, tightening her grip on you every time your lips return to her own.\n\n', false );
		MainView.outputText( 'Once she pulls her head back, a few strands of saliva still link the two of you.  She looks at you expectantly, wanting you to make the first move. You scratch the back of your head and look at her somewhat embarrassed, saying you don\'t really know what kind of position to use on a heavily pregnant woman. Amily giggles, squeaking a few times, her hands coming to rest on your shoulders "<i>Alright, let me show you...</i>" she says, positioning you on the bed, on your back.\n\n', false );
		MainView.outputText( '"<i>I did some research on the matter, just in case you still wanted to make love while I\'m like this... I\'m pretty glad you do - you have no idea how horny I\'ve been from this.</i>" Amily says as she straddles your hips, feeling the extra weight that the cute little mouse-girl has put on. Nothing you can\'t handle, and certainly something you\'re not going to call attention to.\n\n', false );
		MainView.outputText( 'Amily teases you for a little while, running her pussy-lips and tail along the tip of your erection a few times, earning a few moans and groans from you. Amily smirks slightly before sliding herself down your fully erect ' + Appearance.cockNoun( CockTypesEnum.HUMAN ) + ', taking as much as she can. You\'re a little worried that this might be harmful for your offspring, or worse - that they\'ll know what\'s going on... but Amily really seems to know more about this than you do, so you\'re just going to go along with her suggestions on the matter.\n\n', false );
		MainView.outputText( 'Amily manages to keep a rather impressive rhythm and pace as she rides your cock like a mechanical bull. In time you manage to return her motions, thrusting your hips up to meet her and twisting yourself around counter-clockwise. The way Amily shrieks, or squeeks, in pleasure is a good sign, and as a result, you pick up speed with your gyrations. The intense pleasure makes you wish this session didn\'t have to end, but as you feel your orgasm rapidly approach, you sigh in defeat and resolve to make it a memorable one. You quickly clasp your hands around Amily\'s hips and pick up speed, making Amily gasp in surprise. You keep your motions up for another few minutes, before the two of you bring each other to a powerful simultaneous orgasm, mixed fluids drooling from Amily\'s thoroughly stretched cunt', false );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( ', her own mouse-cock spewing futa-cum all over her belly', false );
		}
		MainView.outputText( '.\n\n', false );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( '"<i>Remember when you said this cock was a bad thing?</i>" you tease, causing Amily to blush and playfully punch you in the shoulder.  "<i>Sh-shut up!  It\'s... it\'s pretty incredible, there, I said it.</i>"\n\n', false );
		}

		MainView.outputText( 'With the two of you having finished your bout of lovemaking, you sit up and let Amily recline against your chest, letting your hands run along her beautiful bump. Amily smiles happily, her hands moving over your own and guiding them over her bulge. You smile happily as you feel your children kicking, which causes Amily to giggle slightly. The two of you sit together in silence for the remainder of your time together, feeling nothing but love for each other and the offspring you\'ve managed to create. You see Amily smile warmly at you, with a hint of sadness on her face, with a question forming on her lips. She doesn\'t really say anything though, deciding not to ruin the quiet moment between the two of you.\n\n', false );
		MainView.outputText( 'Eventually, with great sadness and regret, you leave your lover\'s side and head off back to camp, vowing to return.', false );
		//boost affection;
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 2 + Utils.rand( 4 );
		CoC.flags[ kFLAGS.AMILY_FUCK_COUNTER ]++;
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -1 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		//preggo chance;
		this.amilyPreggoChance();
	};
	AmilyScene.prototype.amilyPreggoChance = function() {
		//Is amily a chaste follower?;
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			//If pregnancy not enabled, GTFO;
			if( CoC.flags[ kFLAGS.AMILY_ALLOWS_FERTILITY ] === 0 ) {
				return;
			}
		}
		//Cant repreg if already preg!;
		if( this.pregnancy.isPregnant ) {
			return;
		}

		// Cant preg if at the farm;
		if( CoC.flags[ kFLAGS.FOLLOWER_AT_FARM_AMILY ] !== 0 ) {
			return;
		}

		//25% + gradually increasing cumQ bonus;
		if( Utils.rand( 4 ) === 0 || CoC.player.cumQ() > Utils.rand( 1000 ) ) {
			this.pregnancy.knockUpForce( PregnancyStore.PREGNANCY_PLAYER, PregnancyStore.INCUBATION_MOUSE - 182 ); //Amily completes her pregnancies much faster than a regular player
		}
	};

	//----------=============================------------;
	//  tion camp   AMILY COMPANION BULLSHIT;
	//----------=============================------------;
	//Approach Amily:;
	// EVENT 2427;
	AmilyScene.prototype.amilyFollowerEncounter = function() {
		if( !this.amilyCorrupt() && CoC.player.eggs() >= 20 && CoC.player.canOviposit() && CoC.flags[ kFLAGS.AMILY_OVIPOSITION_UNLOCKED ] === 0 ) {
			this.amilyEggStuff();
			return;
		}
		if( CoC.flags[ kFLAGS.AMILY_INCEST_COUNTDOWN_TIMER ] === 30 * 24 && CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 2 && (CoC.time.hours >= 11 && CoC.time.hours <= 13) ) {
			this.amilyIncest();
			return;
		}
		this.amilySprite();
		if( CoC.flags[ kFLAGS.AMILY_CLOTHING ] === 0 ) {
			CoC.flags[ kFLAGS.AMILY_CLOTHING ] = 'rags';
		}
		//Amily freakout;
		if( CoC.player.cor >= 50 && CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00173 ] === 0 && CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			this.amilyTaintWarning();
			return;
		}
		//Clear warning if PC is good!;
		if( CoC.player.cor < 50 && CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00173 ] > 0 ) {
			CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00173 ] = 0;
		}
		//Preggo birthing!;
		if( this.pregnancy.isPregnant && this.pregnancy.incubation === 0 && CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 2 ) {
			MainView.outputText( '', true );
			this.amilyPopsOutKidsInCamp();
			this.pregnancy.knockUpForce(); //Clear Pregnancy
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		//Jojo + Amily Spar;
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 && CoC.flags[ kFLAGS.AMILY_MET_PURE_JOJO ] === 1 && CoC.flags[ kFLAGS.AMILY_SPAR_WITH_PURE_JOJO ] === 0 && CoC.player.findStatusAffect( StatusAffects.PureCampJojo ) >= 0 ) {
			SceneLib.followerInteractions.pureJojoAndAmilySpar();
			return;
		}
		//Amily;
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 && CoC.flags[ kFLAGS.AMILY_WAIT_FOR_PC_FIX_JOJO ] === 1 && CoC.player.hasItem( ConsumableLib.PURHONY ) && CoC.flags[ kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO ] === 0 && CoC.flags[ kFLAGS.JOJO_FIXED_STATUS ] === 0 ) {
			SceneLib.followerInteractions.fixJojoOOOOHYEEEEAHSNAPINTOASLIMJIM();
			return;
		}
		MainView.outputText( '', true );
		//Non corrupt!;
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			MainView.outputText( 'As you approach the mouse-woman, her big, hairless ears twitch and she turns to face you with a smile. "<i>Hi, ' + CoC.player.short + '! What\'s up?</i>" She grins at you.\n\n', false );
		}
		//Corrupt!;
		else {
			if( CoC.flags[ kFLAGS.FOLLOWER_AT_FARM_AMILY ] === 0 ) {
				MainView.outputText( '"<i>Amily!</i>" you yell. In no time a purplish blur rushes towards you; skidding to a halt, she kneels before you, hands behind her back, fully exposed. "<i>Yes my ' + CoC.player.mf( 'master', 'mistress' ) + '?</i>" Amily says seductively, licking her lips.\n\n', false );
			} else {
				MainView.outputText( 'Amily is kneeling before you before you’ve even finished calling her name. She looks a bit dusty but her pussy gleams cleanly and invitingly.' );
				if( CoC.flags[ kFLAGS.FOLLOWER_AT_FARM_AMILY_GIBS_MILK ] === 1 ) {
					CoC.flags[ kFLAGS.FOLLOWER_AT_FARM_AMILY_GIBS_MILK ] = 2;
					MainView.outputText( '\n\nYou wordlessly hold out your hand. Grinning, Amily produces a bottle of succubus milk and places it in your palm.' );
					MainView.outputText( '\n\n“<i>I\'ll leave my regular production with the rest of the payment Whitney owes you [master].</i>”\n\n' );
					SceneLib.inventory.takeItem( ConsumableLib.SUCMILK, this.amilyFollowerEncounter );
					return;
				} else {
					this.amilyMenu( false );
					return;
				}
			}
		}
		switch( this.pregnancy.event ) {
			case 2:
				if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) { //Pure
					MainView.outputText( 'You notice that Amily seems to be ill. Of course, you at once go to her and ask her what\'s wrong, but she only smiles at you and says that it\'s all right. Your incomprehension must show on your face, since Amily giggles, puts her arms around you and kisses you. "<i>Silly ' + CoC.player.mf( 'boy', 'girl' ) + '... You\'re going to be a father... again...</i>"\n\n', false );
				} else {
					{ //Corrupt
					}
					MainView.outputText( 'You notice that Amily seems to be ill. Despite that, she seems to be happy about something. You wonder what could be going on, and decide to ask; Amily grins at you. "<i>Oh, ' + CoC.player.mf( 'master', 'mistress' ) + '! You did it! You\'re going to be a father... I can\'t wait to birth many more mouse-sluts for you, ' + CoC.player.mf( 'master', 'mistress' ) + '.</i>"\n\n', false );
				}
				break;
			case 3:
			case 4:
				MainView.outputText( 'Amily\'s belly is starting to protrude a little. She\'s unquestionably pregnant.\n\n', false );
				break;
			case 5:
			case 6:
				MainView.outputText( 'Amily\'s belly has gotten very big. She must be carrying more than one child.\n\n', false );
				break;
			case 7:
				if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) { //Pure
					MainView.outputText( 'Amily\'s swollen stomach moves on occasion, warranting an unthinking pat from her to calm the restless children within.\n\n', false );
				} else {
					{ //Corrupt
					}
					MainView.outputText( 'Amily\'s swollen stomach moves on occasion, warranting a stroke from her to urge the restless children within to come out soon.\n\n', false );
				}
				break;
			case 8:
				MainView.outputText( 'Amily\'s bulge frequently wriggles and squirms, though this doesn\'t seem to bother her. ' + (CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ? 'T' : 'She smiles with glee, t') + 'he children mustn\'t have too much longer until they are born.\n\n', false );
		}
		this.amilyMenu( true );
	};
	AmilyScene.prototype.amilyMenu = function( output ) {
		var date = null;
		//If no fight yet, have option to introduce Urta and Amily;
		if( CoC.player.gender > 0 && CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 && CoC.flags[ kFLAGS.AMILY_VISITING_URTA ] === 0 && (CoC.flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ] >= 5 || SceneLib.urta.urtaLove()) && !SceneLib.urtaQuest.urtaBusy() ) {
			if( output === undefined || output ) {
				MainView.outputText( '<b>You could take Amily on a date to Tel\'Adre, and perhaps even introduce her to Urta!</b>\n\n', false );
			}
			date = this.dateNightFirstTime;
		}
		var defur = null;
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			defur = this.amilyDefurryOfferAtCamp;
		}
		//Innocent;
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			//MainView.outputText('Options:\nAppearance\nTalk\nMake Love\n', false);;
			//MOAR OPTIONS: Give Present\nAlchemy\nTeach Blowpipe;
			var eggs = null;
			if( CoC.flags[ kFLAGS.AMILY_OVIPOSITION_UNLOCKED ] > 0 && CoC.player.canOviposit() ) {
				eggs = this.layEggsInAmily;
			}
			EngineCore.choices( 'Appearance', this, this.amilyAppearance, 'Talk', this, this.talkToAmilyCamp, 'Make Love', this, this.fuckTheMouseBitch, 'Give Present', this, this.giveAmilyAPresent, 'Date', this, date,
				'Lay Eggs', this, eggs, 'Defur', this, defur, '', null, null, '', null, null, 'Back', SceneLib.camp, SceneLib.camp.campLoversMenu );
		}
		//Corrupt;
		else {
			//MainView.outputText('Options:\nAppearance\nGive Item\nSex\nTalk\n', false);;
			//  [Sex] [Give Item] [Talk] [Call Jojo];
			EngineCore.choices( 'Appearance', this, this.amilyAppearance, 'Give Item', this, this.giveAmilyAPresent, 'Sex', this, this.fuckTheMouseBitch, 'Talk', this, this.talkWithCORRUPTCUNT, 'Defur', this, defur,
				'', null, null, '', null, null, '', null, null, '', null, null, 'Back', SceneLib.camp, SceneLib.camp.campSlavesMenu );
			if( !this.pregnancy.isPregnant && CoC.flags[ kFLAGS.FOLLOWER_AT_FARM_AMILY ] === 0 && CoC.flags[ kFLAGS.FARM_CORRUPTION_STARTED ] === 1 ) {
				EngineCore.addButton( 5, 'Farm Work', this, this.sendCorruptCuntToFarm );
			}
			if( CoC.flags[ kFLAGS.FOLLOWER_AT_FARM_AMILY ] === 1 ) {
				EngineCore.addButton( 5, 'Go Camp', this, this.backToCamp );
				if( CoC.flags[ kFLAGS.FOLLOWER_PRODUCTION_AMILY ] === 0 ) {
					EngineCore.addButton( 6, 'Harvest Milk', this, this.harvestMilk );
				} else {
					EngineCore.addButton( 6, 'Stop Harvest', this, this.stopHarvestingMilk );
				}
				EngineCore.addButton( 9, 'Back', SceneLib.farmCorruption, SceneLib.farmCorruption.rootScene );
			}
		}
	};
	//Corrupt Amily Sex Options;
	AmilyScene.prototype.amilyCorruptSexMenu = function() {
		this.amilySprite();
		var anal = null;
		var penetrated = null;
		var fuckCunt = null;
		var oral = null;
		var oral2 = null;
		var scissor = null;
		MainView.outputText( '', true );
		if( CoC.player.gender > 0 ) {
			MainView.outputText( 'Amily asks, "<i>How would ' + CoC.player.mf( 'master', 'mistress' ) + ' like to use ' + CoC.player.mf( 'his', 'her' ) + ' cum-bucket today?', false );
			if( CoC.player.hasCock() ) {
				anal = this.corruptAmilyBuckFutter;
			}
			if( CoC.player.hasVagina() && CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				penetrated = this.corruptAmilyCampBonesPCWithHerCock;
			}
			if( CoC.player.hasCock() ) {
				fuckCunt = this.corruptAmilysPussyGetsMotherfuckingFucked;
				oral = this.corruptAmilyOralSuckOff;
			}
			if( CoC.player.hasVagina() ) {
				oral2 = this.corruptAmilyLickPussiesLikeAPro;
				scissor = this.corruptAmilyScissorsLikeAPro;
			}
			EngineCore.choices( 'Anal', this, anal, 'Get BJ', this, oral, 'Get Licked', this, oral2, 'GetPen\'ed', this, penetrated, 'Scissor', this, scissor,
				'Vagina', this, fuckCunt, '', null, null, '', null, null, '', null, null, 'Nevermind', this, this.amilyFollowerEncounter );
		} else {
			//[Genderless PC Tries Sex];
			MainView.outputText( 'Eagerly, you strip off your ' + CoC.player.armorName + ' and present yourself to your admiring slut-mouse... but when her eyes fall upon the bare expanse of flesh that is your crotch, she lets out a cry of horror. "<i>Nothing! There\'s nothing there! ' + CoC.player.mf( 'Master', 'Mistress' ) + ', what\'s happened to your genitals?</i>" she squeals in dismay, rushing forward on her hands and knees and slamming her face roughly into your crotch.\n\n', false );
			MainView.outputText( 'She desperately gropes and nuzzles you, trying to find some sign - ANY sign - of genitalia, but, of course, she can\'t. She promptly bursts into big, wet, noisy tears, blubbering like a little baby. "<i>Why? Why are you punishing me like this, ' + CoC.player.mf( 'master', 'mistress' ) + '? Haven\'t I been a good little slut for you? Haven\'t I done everything I could to please you? I\'ve degraded myself without hesitation for the glories of sex - why have you stolen that from me?!</i>"\n\n', false );
			MainView.outputText( 'As she collapses onto the ground, crying her heart out, you silently redress yourself and slink away. All this blubbering has turned you off, and it\'s obvious that nothing can be done until you\'ve grown a cock, a pussy, or both.', false );
			EngineCore.dynStats( 'lus', -20 );
			if( CoC.flags[ kFLAGS.FOLLOWER_AT_FARM_AMILY ] === 0 ) {
				EngineCore.doNext( MainView, MainView.playerMenu );
			} else {
				EngineCore.doNext( SceneLib.farmCorruption, SceneLib.farmCorruption.rootScene );
			}
		}
	};

	//Appearance:;
	AmilyScene.prototype.amilyAppearance = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		// [HORSECOCK];
		var stopSayingNetherlipsFuck = 'its hairless netherlips seem to shine in between her fur';
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 1 ) {
			stopSayingNetherlipsFuck = 'its netherlips seem to shine in contrast to her thighs';
		}
		var what = (CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'mouse-morph' : 'mouse girl';
		var onHerMuzzle = (CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'on her furry little muzzle ' : '';
		var furDesc = '';
		var feetDesc = '';
		//FURRAH;
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			//Corrupt;
			if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 2 ) {
				furDesc = 'She is covered in fur, except on her hands, feet, ears and tail.';
				feetDesc = 'surprisingly hand-like pink paws instead of feet';
			} else {
				furDesc = 'She is covered in fur, except on her hands, feet, ears and tail.  She has dainty, surprisingly hand-like pink paws instead of feet and';
			}
		}
		//NONFURR;
		else {
			if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 2 ) {
				feetDesc = 'a trademark succubus high-heel';
			}
			furDesc = 'Her face is framed by a stylish bob of auburn hair, large mouse-ears jutting from her \'do.  She has small, dainty feet and';
		}
		//PUR;
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			//(Start [horsecock];
			MainView.outputText( 'Amily is a 5\' 2" tall ' + what + ', with a lean and wiry build. Her pink eyes normally twinkle merrily, but they can turn hard and cold if the circumstances warrant, just as the normally friendly grin ' + onHerMuzzle + 'can turn cruel and harsh when she is angry. ' + furDesc + ' a long, hairless mouse\'s tail that sways and twitches constantly from her behind. She is currently wearing ' + CoC.flags[ kFLAGS.AMILY_CLOTHING ] + '. She has ' + this.amilyHips() + ' and a ' + this.amilyButt() + '.\n\n', false );
			//(End [horsecock];
			MainView.outputText( 'She has a pair of ' + this.amilyTits() + ' on her chest. They have ' + CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] + '-inch nipples at their tips and must be at least ' + Appearance.breastCup( CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] ) + 's.\n\n', false );
			//(If Amily has a penis:;
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				//([horsecock];
				var dickDesc = (CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'naked and hairless and pink and throbbing' : 'pink and throbbing';
				MainView.outputText( 'She has a ' + CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] + '-inch penis growing from her crotch, replacing the clitoris that would normally jut from her vulva. It is surprisingly human looking, ' + dickDesc + ' - it even has a foreskin, not a sheath.\n\n', false );
			}
			MainView.outputText( 'Amily has a little pink pussy in between her legs; ' + stopSayingNetherlipsFuck + '.', false );
		} else {
			//Start [horsecock];
			MainView.outputText( 'Amily, your personal cumslut, is a 5\' 2" tall ' + what + ', with quite the voluptuous build.  Her pink eyes normally glow with desire and adoration every time she looks at you, and a lusty smile adorns her face.  ' + furDesc + ' ' + feetDesc + ', and a long, hairless mouse tail with a spaded tip that sways and coils around her legs seductively at every opportunity.  She is currently wearing ' + CoC.flags[ kFLAGS.AMILY_CLOTHING ] + '.  She has ' + this.amilyHips() + ' and a ' + this.amilyButt() + '.\n\n', false );
			// End [horsecock];
			MainView.outputText( 'She has a pair of ' + this.amilyTits() + ' on her chest. They have ' + CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] + '-inch nipples at their tips and must be at least DD-cups.\n\n', false );
			//(If Amily has a penis:;
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( 'She has a half-erect ' + CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] + '-inch penis growing from her crotch. It is surprisingly human looking, ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'naked and hairless ' : '') + 'and pink and throbbing', false );
				if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] === 0 ) {
					MainView.outputText( ' - it even has a foreskin, not a sheath.\n\n', false );
				} else {
					MainView.outputText( ', though it does have a' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 1) ? ' little sheath.' : ' fuzzy little sheath.') + '\n\n', false );
				}
			}
			if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] > 0 ) {
				MainView.outputText( 'She has ' + this.amilyBalls() + ' dangling ', false );
				if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
					MainView.outputText( 'underneath her shaft', false );
				} else {
					MainView.outputText( 'from her groin', false );
				}
				MainView.outputText( ', churning with cum as you gaze at them.\n\n', false );
			}
			//Need to account for pussy wetness here.;
			MainView.outputText( 'Amily has a ', false );
			if( CoC.flags[ kFLAGS.AMILY_VAGINAL_WETNESS ] === 2 ) {
				MainView.outputText( 'moist, ', false );
			}
			if( CoC.flags[ kFLAGS.AMILY_VAGINAL_WETNESS ] === 3 ) {
				MainView.outputText( 'wet, ', false );
			}
			if( CoC.flags[ kFLAGS.AMILY_VAGINAL_WETNESS ] === 4 ) {
				MainView.outputText( 'dripping, ', false );
			}
			if( CoC.flags[ kFLAGS.AMILY_VAGINAL_WETNESS ] >= 5 ) {
				MainView.outputText( 'soaked, ', false );
			}
			// [Horsecock];
			MainView.outputText( 'pink pussy in between her legs; ' + stopSayingNetherlipsFuck + '.\n', false );
			if( SceneLib.farmCorruption.hasTattoo( 'amily' ) ) {
				MainView.outputText( '\n' );
				if( SceneLib.farmCorruption.amilyFullTribalTats() ) {
					MainView.outputText( 'She is covered from head to tail in tribal tattoos, erotic lines snaking all over her naked frame, giving her the look of a barely tamed savage.\n' );
				} else {
					if( SceneLib.farmCorruption.numTattoos( 'amily' ) > 1 ) {
						MainView.outputText( 'She has the following tattoos emblazoned across her body:\n' );
					} else {
						MainView.outputText( '\nShe has ' );
					}

					if( CoC.flags[ kFLAGS.AMILY_TATTOO_COLLARBONE ] !== 0 ) {
						MainView.outputText( CoC.flags[ kFLAGS.AMILY_TATTOO_COLLARBONE ] + '\n' );
					}
					if( CoC.flags[ kFLAGS.AMILY_TATTOO_SHOULDERS ] !== 0 ) {
						MainView.outputText( CoC.flags[ kFLAGS.AMILY_TATTOO_SHOULDERS ] + '\n' );
					}
					if( CoC.flags[ kFLAGS.AMILY_TATTOO_LOWERBACK ] !== 0 ) {
						MainView.outputText( CoC.flags[ kFLAGS.AMILY_TATTOO_LOWERBACK ] + '\n' );
					}
					if( CoC.flags[ kFLAGS.AMILY_TATTOO_BUTT ] !== 0 ) {
						MainView.outputText( CoC.flags[ kFLAGS.AMILY_TATTOO_BUTT ] + '\n' );
					}
				}
			}
		}
		MainView.outputText( '\nShe has a tiny pink pucker between her mousey butt-cheeks, where it belongs.' );
		//Back to amily menu;
		EngineCore.doNext( this, this.amilyFollowerEncounter );
	};
	// EVENT 2429: Talk to Amily in camp;
	AmilyScene.prototype.talkToAmilyCamp = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You tell Amily you\'d like to talk about things. She grins, happy at the prospect, and takes a seat, inviting you to sit down as well.\n\n', false );
		//(Random camp discussion takes place);
		this.talkWithCuntIMeanAmily();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	AmilyScene.prototype.talkToAmilyWithSexAfter = function() {
		this.talkWithCuntIMeanAmily( true );
	};
	//Make Love:;
	AmilyScene.prototype.fuckTheMouseBitch = function() {
		this.amilySprite();
		//Corrupt Amily has her own shit;
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 2 ) {
			this.amilyCorruptSexMenu();
			return;
		}
		MainView.outputText( '', true );
		var babies = null;
		var bText = '';
		//[Amily rejects sex];
		if( CoC.flags[ kFLAGS.AMILY_WAIT_FOR_PC_FIX_JOJO ] > 0 ) {
			MainView.outputText( 'Amily pushes you away and says, "<i>Not until we fix Jojo.</i>"  You sigh and grumble.  No sex today!', false );
			EngineCore.doNext( this, this.amilyFollowerEncounter );
			return;
		}
		MainView.outputText( 'You give Amily a seductive smile and tell her that you want to make love to her.\n\n', false );
		if( Utils.rand( 2 ) === 0 ) {
			MainView.outputText( 'She grins wickedly back, "<i>Ooh, is that so? Well, I suppose I might be able to squeeze you in...</i>"\n\n', false );
		} else {
			MainView.outputText( 'She giggles, "<i>What kept you so long? I\'ve been waiting way too long.</i>"\n\n', false );
		}
		MainView.outputText( 'At your expression, she laughs, "<i>We had about seventy kids before I moved in here; I think I\'m a bit too experienced to be shy about sex now.</i>"\n\n', false );
		MainView.outputText( 'She strides over to take you in her arms, "<i>So, what would you like to do, ' + CoC.player.short + '?</i>"\n\n', false );
		//[Take Charge];
		//[Let Amily Lead];
		//[Make Babies - Requires player has a penis, or Amily has a penis & CoC.player has a vagina];
		if( CoC.player.hasCock() || (CoC.player.hasVagina() && CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0) ) {
			//Make babies option;
			if( CoC.flags[ kFLAGS.AMILY_ALLOWS_FERTILITY ] === 0 ) {
				MainView.outputText( 'Amily is currently taking herbs that will prevent pregnancy and keep her sterile.\n\n', false );
				bText = 'MakeBabies';
				babies = this.makeChildren;
				//Send make babies to an appropriate override;
				if( SceneLib.izmaScene.izmaFollower() && CoC.flags[ kFLAGS.AMILY_X_IZMA_POTION_3SOME ] === 0 && CoC.player.hasCock() && !SceneLib.izmaScene.pregnancy.isPregnant && !this.pregnancy.isPregnant ) {
					babies = this.amilyXIzmaSuperPregOptions;
				}
			}
			//No Babies Option;
			else {
				MainView.outputText( 'Amily is currently off her infertility herbs and may get pregnant.\n\n', false );
				bText = 'No Babies';
				babies = this.makeChildren;
			}
		}
		var urta = null;
		if( CoC.flags[ kFLAGS.AMILY_VISITING_URTA ] === 4 && CoC.flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ] >= 0 && !SceneLib.urtaQuest.urtaBusy() ) {
			urta = SceneLib.followerInteractions.amilyUrtaSex;
		}
		var swim = null;
		if( CoC.flags[ kFLAGS.AMILY_OWNS_BIKINI ] > 0 && CoC.player.hasCock() && !this.amilyCorrupt() ) {
			swim = this.amilySwimFuckIntro;
		}
		var threesome = null;
		if( SceneLib.izmaScene.izmaFollower() && CoC.flags[ kFLAGS.AMILY_X_IZMA_POTION_3SOME ] > 0 && CoC.player.hasCock() ) {
			MainView.outputText( 'You could see if Amily and Izma are up for another round of Amily\'s fertility potion, though contraceptives won\'t matter at all once she takes that.\n' );
			threesome = this.drinkThePotion;
		}
		var nurse = null;
		if( CoC.flags[ kFLAGS.GIVEN_AMILY_NURSE_OUTFIT ] > 0 && CoC.player.hasCock() && CoC.player.cockThatFits( 61 ) >= 0 && CoC.player.lust >= 33 ) {
			nurse = this.amilyNurseCheckup;
			MainView.outputText( 'Amily might be up for playing nurse again.\n' );
		}
		EngineCore.choices( 'TakeCharge', this, this.amilyTakesChargeSex, 'Amily Leads', this, this.letAmilyLead, bText, this, babies, 'Urta', SceneLib.followerInteractions, urta, 'Swim', this, swim,
			'Izma3Some', this, threesome, 'Nurse RP', this, nurse, '', null, null, '', null, null, 'Back', this, this.amilyFollowerEncounter );
	};
	//[=Take Charge=];
	AmilyScene.prototype.amilyTakesChargeSex = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		var fuck = null;
		var drinkMilk = null;
		var getSucked = null;
		var scissor = null;
		var mountHer = null;
		var buttFuckButtFUCKBUTTFUCK = null;
		var catchs = null;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			catchs = this.pureAmilyPutsItInYourRectumDamnNearKilledEm;
		}
		if( CoC.player.hasCock() ) {
			if( CoC.player.cockThatFits( 50 ) >= 0 ) {
				buttFuckButtFUCKBUTTFUCK = this.fuckPureAmilysHeiny;
			}
		}
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 && CoC.player.hasVagina() ) {
			mountHer = this.takeChargeAmilyMountHer;
		}
		if( CoC.player.hasVagina() ) {
			scissor = this.takeChargeAmilyScissorMeTimbers;
		}
		if( CoC.player.hasCock() ) {
			getSucked = this.takeChargeAmilyGetSucked;
		}
		if( CoC.player.cockThatFits( 61 ) !== -1 ) {
			fuck = this.takeChargeAmilyFuck;
		}
		if( CoC.flags[ kFLAGS.AMILY_BIRTH_TOTAL ] > 0 || CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] >= 1 ) {
			drinkMilk = this.takeChargeAmilyMouseMilk;
		}
		MainView.outputText( 'You stride up to her and take her in your arms, kissing her deeply. She melts enthusiastically into your embrace, kissing you back just as hard, her tail winding around your ' + CoC.player.leg() + '. You lead her back to the nest she has made for herself and firmly but gently place her on her back there. She smiles up at you. "<i>Ooh, taking charge, are we?</i>" She trills with pleasure, tail waving to and fro with sincere excitement.\n\nWhat will you do?', false );
		EngineCore.choices( 'Fuck', this, fuck, 'DrinkMilk', this, drinkMilk, 'Eat Out', this, this.takeChargeAmilyEatOut, 'GetSucked', this, getSucked, 'Scissor', this, scissor,
			'Mount Her', this, mountHer, 'Buttfuck', this, buttFuckButtFUCKBUTTFUCK, 'Catch Anal', this, catchs, '', null, null, '', null, null );
	};

	//Take Charge 1: Fuck;
	AmilyScene.prototype.takeChargeAmilyFuck = function() {
		this.amilySprite();
		var x = CoC.player.cockThatFits( 61 );
		MainView.outputText( '', true );
		MainView.outputText( 'With a smile, you gently place the tip of a finger on her nose, then slowly run it down along her body, over her lip, between her breasts, across her stomach, and finally stopping between her legs, where you playfully circle her secret spot with the tip of your finger.', false );
		//(if Amily is herm:;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( '  Her pants begin to tent as her male organ reacts, and you start to idly stroke it as well for emphasis.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'Amily giggles, and then starts to wriggle out of her pants, shaking her ' + this.amilyHips() + ' and giving you a chance to grab hold of her ' + this.amilyButt() + ' as she does so. Soon, she\'s naked from the waist down, her little pink netherlips already winking at you', false );
		//(if Amily is herm:;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( ' and her ' + this.amilyCock() + ' standing erect', false );
		}
		MainView.outputText( '; she\'s clearly very excited about this.', false );
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'Now it is your turn to strip, and she watches you all the while, eagerly licking her lips when you unveil your ' + Descriptors.cockDescript( x ) + '. You stretch out over her body to kiss her, and she reaches up to embrace you with all the strength she has, pulling you deeper into the kiss and down onto her ' + this.amilyTits() + ', her ' + this.amilyNipples() + 's hard and firm against your chest. Finally, she breaks the kiss to whisper hoarsely to you, "<i>Stop teasing me and put it in, already!</i>" She growls, surprisingly deeply for a mouse-woman.\n\n', false );
		MainView.outputText( 'You smirk back at her, but you\'re hardly inclined to toy with her; your ' + Descriptors.cockDescript( x ) + ' is aching with your need for her hot, tight depths. So you guide your member to her netherlips and lightly brush its tip against her. You may have wanted to begin slowly, but obviously, Amily has other plans, grabbing your ' + Descriptors.cockDescript( x ) + ' and putting it in.  Gasping a bit as she feels you entering her, she grins and whispers I have to do everything myself?</i>"\n\n', false );
		MainView.outputText( 'Feeling your cock slide into her moist and hot vagina, you\'re not really inclined to waste time talking, so you hungrily kiss the mousegirl and begin to move slowly. Amily eagerly returns your kiss and moves with you. Soon, you both pick up speed while letting your hands wander over each other\'s body. As you break your kiss to gasp for air, a little moan escapes her, before she puts a hand on your head and pulls you down into another hungry and passionate kiss. Not long after, you can feel yourself fast reaching the limits of your ability to hold back. Luckily, Amily seems to also be nearing an orgasm, so you let go and nearly explode inside her. That seems to have pushed her over the edge too, and with a rather loud moan for such a little girl, Amily orgasms', false );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( ' her ' + this.amilyCock() + ' spasming and spraying futa-jism in between your bodies', false );
		}
		MainView.outputText( '.\n\n', false );
		MainView.outputText( 'Grinning at each other with obvious satisfaction in your eyes, you slowly relax and cuddle in the afterglow for some time, before you decide that you\'ll definitely repeat this soon.', false );
		this.amilyPreggoChance();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -1 );
	};
	//Take Charge 2: Mousemilk;
	AmilyScene.prototype.takeChargeAmilyMouseMilk = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You ponder for a second what it is that you want to do, running your hands gently down Amily\'s body. At one point, you squeeze one of her breasts - a little too hard, because the smell of milk promptly fills the air. Smiling, you sit down on the nest and coax a confused Amily into also being seated. Confusion gives way to understanding when you start to remove her shirt, and she happily helps you, letting her ' + this.amilyTits() + ' hang freely. The wind is chilly, but you are sure arousal is also to blame for the perky erectness of her ' + this.amilyNipples() + 's, and you playfully tweak each of them in turn, which prompts a blush and a somewhat indignant squeak from your mousy lover. Her arms gently reach up to snake around your neck and pull you in closer, which you need little encouragement for.\n\n', false );
		MainView.outputText( 'Your thirsty mouth reaches for the first mousy breast, closing your lips tantalizingly around its ' + this.amilyNipples() + '. Amily squeaks and coos as you play it with your lips and your tongue, clearly enjoying the attention, and soon rewarding you with the first drops of milk into your mouth.\n\n', false );
		MainView.outputText( 'The taste is unique, distinctly unlike anything you have ever drank before, and yet somehow so very much like Amily. It is thick and creamy and piquant, putting you somewhat in mind of well-aged cheddar, warm from her body-heat and very nourishing.\n\n', false );
		//(Low Amily Milk:;
		if( CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] < 1 ) {
			MainView.outputText( 'You drink eagerly, suckling and nursing with all the erotic skill you can muster, and soon her breast is empty. Without further ado, you turn to the next one, and repeat the experience there. Amily moans softly, disappointed, when you drink it dry as well, and you give each nipple in turn a teasing last loving lick before withdrawing. Your mousy lover smiles at you. "<i>I hope you enjoyed your drink.</i>" You assure her that you did, and then you help her get dressed, having had enough fun for now.\n\n', false );
		}

		//(Moderate Amily Milk:;
		else if( CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] < 2 ) {
			MainView.outputText( 'You drink eagerly, suckling and nursing with all the erotic skill you can muster, and the milk flows thick and freely. You drink and drink, and then, when her breast is empty, you feel compelled to empty the other one. By the time you\'re finished, you\'re quite relieved; you feel uncomfortably full, and your stomach gurgles softly as it strains to start digesting your liquid meal. "<i>Well, they do say milk is good for you, but try not to overdo it, okay?</i>" Amily teases you. You stick your tongue out at her - which prompts her to pull you into a kiss, her tongue wriggling against yours as she does her best to wring the taste of her own milk from your mouth. Eventually, you push her off... not trying too hard... and she gets dressed, walking away with a jaunty wave of her tail.\n\n', false );
		}

		//(High Amily Milk:;
		else {
			MainView.outputText( 'You drink eagerly, suckling and nursing with all the erotic skill you can muster, and are rewarded with all the milk that Amily has to offer, which is almost more than you can keep up with. You gulp, swallow, and suck desperately as cascades of her fluid pour into your mouth and down your throat, droplets of it seeping between your straining lips to run down your chin. Things get blurry, your world receding to just Amily\'s breasts, the milk they contain, and your need to drink or choke. At some point you become distantly aware of pains from your overfull stomach, but drinking is all you can think of. Finally, you empty both of her breasts and find yourself collapsing bonelessly onto your back, gasping for breath, your chin, lips and chest stained with milk. It takes you several moments to realize Amily is asking about you in concern.\n\n', false );
			MainView.outputText( 'You try to answer that you are fine, but all that comes out is a huge, wet belch. Shaking your head, you manage to regain your wits - and you realize that you are having a hard time sitting up. Your stomach is so full of milk that it is bulging out, almost like a pregnant belly, and it\'s weighing you down. You realize Amily is also staring at your distended midriff, looking a little scared... and maybe also a little proud.\n\n', false );
			MainView.outputText( '"<i>All that came out of me?</i>" She asks, curious. She gently rubs your belly, and you moan as the milk sloshes uncomfortably inside your sensitive stomach. Amily sits down, your head in her lap, and lets you rest there until you recover your strength and digest a good portion of the milk. Still feeling uncomfortably full, you get up and go for a walk to help work off your titanic liquid meal.\n\n', false );
		}
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		EngineCore.dynStats( 'spe', 0.3, 'lus', 10, 'cor', -0.5 );
	};
	//Take Charge 3: - eat out;
	AmilyScene.prototype.takeChargeAmilyEatOut = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'With a smile, you gently place the tip of a finger on her nose, then slowly run it down along her body, over her lip, between her breasts, across her stomach, and finally stopping between her legs, where you playfully circle her secret spot with the tip of your finger.', false );
		//(if Amily is herm:;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( '  Her pants begin to tent as her male organ reacts, and you start to idly stroke it as well for emphasis.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'Amily giggles, and then starts to wriggle out of her pants, shaking her ' + this.amilyHips() + ' and giving you a chance to grab hold of her ' + this.amilyButt() + ' as she does so. Soon, she\'s naked from the waist down, her little pink netherlips already winking at you', false );
		//(if Amily is herm:;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( ' and her ' + this.amilyCock() + ' standing erect', false );
		}
		MainView.outputText( '.  She\'s clearly very excited about this.\n\n', false );
		MainView.outputText( 'She\'s obviously expecting you to strip down, and is surprised when you instead flop down and wriggle backwards, looking a little disconcerted as she realizes just what you have in mind. You are staring at her vagina', false );
		//(if herm:;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( ', and her ' + this.amilyCock() + ' is sticking up where her clitoris should be.  Y', false );
		} else {
			MainView.outputText( ', and y' );
		}
		MainView.outputText( 'ou reach out with your tongue to give it a probing lick. Amily squeaks loudly at the sensation and, emboldened, you start to lick more enthusiastically, running your tongue around each of her netherlips, reaching up to tickle ', false );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] === 0 ) {
			MainView.outputText( 'her clitoris.', false );
		} else {
			MainView.outputText( 'the base of her cock.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'You can feel her juices starting to trickle down her inner walls, hot and salty, and you start to probe your tongue deeper inside her vulva, toying with her labia, lovingly licking her interior. Amily squeaks and squeals, bucking and thrashing in her enjoyment as your tongue caresses her most delicate of spots, sliding in as deeply as it can, until finally, with a shuddering squeal, she climaxes.  Her juices flood your tongue and splash onto you face, turning it into a sticky mess', false );
		//(if herm:;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( ' as her penis erupts and sprays its own cum into the air to sprinkle the both of you', false );
		}
		MainView.outputText( '.\n\n', false );
		MainView.outputText( 'She lies there, gasping for breath, even as you pick yourself up and start to clean yourself off. "<i>Not my favorite...</i>" She squeaks. "<i>But definitely can\'t argue with the results.</i>" You smile, and leave her in her nest to get her strength back.\n\n', false );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		EngineCore.dynStats( 'int', 0.25, 'lus', 10 );
	};
	//Take Charge 4 - amily sucks off;
	AmilyScene.prototype.takeChargeAmilyGetSucked = function() {
		this.amilySprite();
		var hands = (CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'paws' : 'hands'; // [Horsecocks]
		MainView.outputText( '', true );
		MainView.outputText( 'You stand up and undo your clothes, allowing ', false );
		if( CoC.player.totalCocks() > 1 ) {
			MainView.outputText( 'each of ', false );
		}
		MainView.outputText( 'your ' + Descriptors.multiCockDescriptLight() + ' to expose itself to the outer world. Amily starts reaching for her pants, but you shake your head and she stops, confused. Her confusion quickly evaporates as you straddle her, giving her the chance to sit up, but ensuring that she\'ll be on a level with your crotch.\n\n', false );
		MainView.outputText( 'You can\'t say that she looks too eager to do so, but she diligently sits up and takes hold of your ', false );
		if( CoC.player.cockTotal() > 1 ) {
			MainView.outputText( 'largest ', false );
		}
		// [Horsecocks];
		MainView.outputText( Descriptors.cockDescript( 0 ) + ', stroking it with her ' + hands + ' and starting to lick the tip. You moan encouragingly and she takes it into her mouth, starting to suck on just the head, her tongue continuing to stroke and lick the head and part of the shaft. Seeing that you are clearly enjoying her ministrations, she gets bolder and starts taking more and more of it in' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? ' - the experience is hard to describe, as there\'s quite a difference between getting a blowjob and getting a blowjob from someone with a muzzle' : '') + '. Soon, you can feel that your ' + Descriptors.cockDescript( 0 ) + ' is bumping against her throat, and you try to back away a little to avoid choking her. To your surprise, though, she firmly pulls you back in, and the two of you make something of a game of it, you pulling out, and her pulling you back in.  All the while, she sucks and licks and delicately scrapes your shaft with her teeth - the stimulus is incredible. You groan and moan as the warmth fills you, the churning pleasure growing deep inside your ', false );
		if( CoC.player.balls > 0 ) {
			MainView.outputText( Descriptors.ballsDescriptLight(), false );
		} else {
			MainView.outputText( 'body', false );
		}
		MainView.outputText( ' as you ready yourself for release.\n\n', false );
		MainView.outputText( 'You try to gasp a warning to Amily that you are about to cum, but all that emerges from your throat is a hollow groan.  Even as cum pours from your cock into her waiting mouth, ', false );
		if( CoC.player.cumQ() < 50 ) {
			MainView.outputText( 'she swallows it all without skipping a beat', false );
		} else if( CoC.player.cumQ() < 500 ) {
			MainView.outputText( 'her cheeks bulge but she manages to swallow it all', false );
		} else {
			MainView.outputText( 'her cheeks bulge hugely and, though she swallows valiantly (her stomach bulges from the amount she takes), a lot of it spurts back from between her lips, drizzling onto your crotch and her ' + this.amilyTits(), false );
		}
		MainView.outputText( '.  Finally, you finish, and she releases your ' + Descriptors.cockDescript( 0 ) + ' with a wet "pop" noise.\n\n', false );
		MainView.outputText( '"<i>Satisfied now?</i>" she asks. Feeling weak at the knees, you can only nod. "<i>Good,</i>" she says, smiling, and then she walks off in the direction of the stream.\n\n', false );
		//(If Amily is herm:;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( 'She turns halfway back to you as she goes. "<i>I hope you\'ll remember this and return the favor someday,</i>" she calls out to you. She then resumes walking off.', false );
		}
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -1 );
	};
	//Take charge 5: scissor me timbers!;
	AmilyScene.prototype.takeChargeAmilyScissorMeTimbers = function() {
		this.amilySprite();
		//Camp Sex Scene: Scissor;
		MainView.outputText( '', true );
		MainView.outputText( 'Grinning at her, you take Amily into your arms and hungrily kiss her. After a moment of surprise, she passionately returns your kiss. You feel her tail creeping up your leg, obviously questing for your netherlips. Letting your hand wander down her back, you suddenly grab her tight butt and pull her against your body, basking in the feeling of her short fur tickling on your skin. Amily\'s hands begin exploring your body in turn, before she murmurs find a nice, comfortable place, love...</i>" Not stopping to caress and kiss each other, you find a nice, secluded place, where you sit down with Amily on your lap.\n\n', false );
		MainView.outputText( 'You begin lightly kneading her perky little breasts, eliciting a moan from the mousegirl. You kiss her neck, while your hand goes down to Amily\'s netherlips, touching her already wet vagina. Slowly, teasingly, you slip two fingers into it, making her moan in pleasure and twisting on your lap so that she can kiss you again without interrupting your ministrations. Soon, you can feel her quiver.\n\n', false );
		MainView.outputText( 'Grinning at her, you pull out your fingers. Amily pouts a little at you (rather playfully, in fact) for not bringing her to an orgasm, but when you raise an eyebrow, she grins in return. "<i>Oh? You want me to pay attention to your pussy, too?</i>" She stands up for a moment and then pushes you back so that you\'re now lying before her. She kneels between your legs and lowers her face until it is hovering an inch or two above your ' + Descriptors.vaginaDescript() + '. Smiling at you, she begins to use her tongue and nose to play with your netherlips. You close your eyes and moan a bit as the mousegirl pleasures you. Suddenly, the feeling of Amily between your legs is missing. Your eyes pop open, only to find her looking into your eyes. "<i>Fair\'s fair, wouldn\'t you say?</i>" she asks before kissing you. Your surprise is complete when you feel her tail entering your ' + Descriptors.vaginaDescript() + '. You feel yourself nearing an orgasm, but Amily seems to want revenge for you not making her climax.\n\n', false );
		MainView.outputText( 'Smiling in defeat, you kiss her again and switch your position so that you and the mousegirl are scissoring - or rather, you will be as soon as she realizes what you\'re up to and you both start moving. Sure enough, Amily soon grins at you again and tentatively pushes her vagina against your ' + Descriptors.vaginaDescript() + '. You return the \'favor\', and a few moments later, you two are grinding your vaginas against each other. Moans escaping from both your lips, it doesn\'t take long for the mousegirl and you to orgasm almost at the same time.\n\n', false );
		MainView.outputText( 'With a contented sigh and a broad, satisfied smile, Amily murmurs, "<i>That felt great...</i>" She switches her position again so that her head is again next to yours, puts her arms around you and nuzzles you a bit. You embrace her too, and enjoy the afterglow with her for some time, before you both go back to work.\n\n', false );
		CoC.player.orgasm();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Take Charge: Mount Amily;
	AmilyScene.prototype.takeChargeAmilyMountHer = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'With a smile, you gently place the tip of a finger on her nose, then slowly run it down along her body, over her lip, between her breasts, across her stomach, and finally stopping between her legs, where you begin to teasingly stroke and caress her ' + this.amilyCock() + ' through her pants, letting it tent her clothing.\n\n', false );
		MainView.outputText( '"<i>That? You want that?</i>" She asks.\n\n', false );
		MainView.outputText( 'You smirk, not thinking a verbal answer needed, and begin to strip down, even as she takes the hint and pulls off her own clothing, Straddling her, you give her ' + this.amilyCock() + ' some careful strokes and teases, making sure that she is fully erect, before you begin to lower your ' + Descriptors.vaginaDescript() + ' onto it. You let just the tip penetrate your netherlips, then pull off before lowering yourself down again, just an inch deeper.\n\n', false );
		MainView.outputText( 'Amily groans beneath you. "<i>Please... stop teasing me. Let me put it in!</i>" She pleads.\n\n', false );
		MainView.outputText( 'You reach down and stroke her cheek, a little worried that you may have seriously upset her, but happy to comply and fully impale yourself upon her length. ', false );
		CoC.player.cuntChange( (CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] * CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ]), true, false, true );
		//(If pussy is gaping:;
		if( CoC.player.looseness() >= 5 ) {
			MainView.outputText( 'You can barely feel it within your stretched out depths, but you determine to do your best, for your sake and for hers.', false );
		}//Otherwise:;
		else {
			MainView.outputText( 'You grin lustfully as you feel it filling you. Hungry for more, you start to rise and fall, letting it pierce you as deeply as possible.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'Amily gasps in delight at the sensation of being surrounded by your ' + Descriptors.vaginaDescript() + '. "<i>Oh, yes, ' + CoC.player.short + ', please!</i>" she cries, clearly happy.\n\n', false );
		//(If player is herm with 'self-titfuck' cock:;
		if( CoC.player.longestCockLength() >= 18 ) {
			MainView.outputText( 'Amily grabs hold of your ' + Descriptors.cockDescript( CoC.player.longestCock() ) + ', eagerly cramming it between her ' + this.amilyTits() + ', mashing them together and running them up and down against your ' + Descriptors.cockDescript( CoC.player.longestCock() ) + ', surrounding it with warm, soft, velvety flesh.', false );
			//(If player has 'autofellatio' cock:;
			if( CoC.player.longestCockLength() >= 22 ) {
				MainView.outputText( '  She then starts to lick and kiss the tip, sucking on it, playing with its slit with her tongue, smothering it with oral affection.', false );
			}
			MainView.outputText( '\n\n', false );
		}
		//(If player is herm:;
		else if( CoC.player.hasCock() ) {
			MainView.outputText( 'She reaches out and grabs hold of ' + CoC.player.oMultiCockDesc() + ', stroking, tugging, and teasing it to further excite you into increasing the speed and force with which you thrust.... Something that she succeeds admirably in doing.\n\n', false );
		}
		MainView.outputText( 'You pound yourself eagerly into Amily, pelvis meeting pelvis in a lustful collision that sends pleasure surging through you. Amily squeaks and whines loudly at your exertions, which only spurs you to greater efforts. However, soon Amily can no longer resist and, with one particularly piercing squeak, she cums, a gout of mousey-cum flooding into your ' + Descriptors.vaginaDescript() + '; this is your signal, and soon you too cum', false );
		//(if herm:;
		if( CoC.player.hasCock() ) {
			MainView.outputText( ', spraying your own herm-cum onto Amily\'s face', false );
		}
		MainView.outputText( ', splattering mixed fluids below your ' + CoC.player.legs() + ' and Amily\'s ', false );
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'furry ', false );
		}
		MainView.outputText( 'thighs.\n\n', false );
		MainView.outputText( 'You collapse backwards off of Amily, waiting to regain your breath and your strength, then compliment Amily on just how good she is with her extra appendage.\n\n', false );
		MainView.outputText( '"<i>Flatterer.</i>" Is all that she says, but she\'s smiling happily, even as you both clean up and go your seperate ways again.', false );
		//PREGGO CHECK HERE;
		if( CoC.flags[ kFLAGS.AMILY_ALLOWS_FERTILITY ] === 1 ) {
			CoC.player.knockUp( PregnancyStore.PREGNANCY_AMILY, PregnancyStore.INCUBATION_MOUSE );
		}
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -1 );
	};
	//[=Let Amily Lead=];
	AmilyScene.prototype.letAmilyLead = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'Not saying anything, you simply grin at her. After a moment, Amily realizes what you want her to do (or maybe what you\'re offering her). She blushes a little, but then answers your grin with one of her own, before grabbing your hand and leading you to her nest. You\'re not completely sure, but you think you notice a certain spring in her step - and her tail seems to almost have a mind of its own, weaving back and forth and occasionally caressing your ' + CoC.player.leg() + '.\n\n', false );
		var x = CoC.player.cockThatFits( 61 );
		var choices = [];
		//POPULATE ARRAY WITH POSSIBLE SEX OPTIONS;
		//========================================;
		if( CoC.player.hasCock() ) {
			//Too big;
			if( x === -1 ) {
				MainView.outputText( 'Amily glances down at the beast between your legs and says, "<i>I was going to ride you, but since you\'re SOOO big I think I\'ll have to get creative...</i>"\n\n', false );
			}
			//Add 'get ridden' if it fits.;
			else {
				choices.push(3);
			}
			//All males get tailjobs;
			choices.push(0);
			//HJs;
			choices.push(1);
		}
		//Everyone has a chance of eating mousecunt.;
		choices.push(2);
		//If Amily is a herm you might suck off...;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			choices.push(4);
		}
		//Get fucked by amily if she's herm and u have cunt;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 && CoC.player.hasVagina() ) {
			choices.push(5);
		}
		//========================================;
		//CHOOSE PROPER SCENE;
		var scene = choices[ Utils.rand( choices.length ) ];
		//========================================;
		//B1: Tailjob;
		if( scene === 0 ) {
			MainView.outputText( 'At her nest, Amily turns back to you, puts her arms around you and hungrily kisses you. It doesn\'t seem as if she\'s planning on stopping the kiss anytime soon, but that\'s all right by you. Still, it\'s only a matter of time until you have to breathe again, so you draw back and gasp for air, noticing the gleam in Amily\'s eyes and the broad (and rather naughty...) smile. Being drawn into another kiss you begin to wonder what exactly the mousegirl is planning.\n\n', false );
			MainView.outputText( 'Suddenly, you almost jump as you feel something entering your pants - it feels almost like a snake or something, but then you realize that it\'s Amily\'s tail that\'s now wrapping itself around your ' + Descriptors.cockDescript( 0 ) + '. Your eyes widening, you look at her in surprise as she begins to methodically squeeze and relax her tail\'s grip on your member.\n\n', false );
			MainView.outputText( 'You\'d never have expected the little mousegirl to do something like this - and you certainly would never have thought it would feel so good. Sure enough, you soon feel yourself reaching the "<i>point of no return</i>", but any attempts to tell her that you won\'t be able to hold back much longer are made futile by her enduring kisses. You\'re quite sure she\'s smiling at your predicament - she probably planned for this to happen. Shrugging mentally, you decide to go with the flow and worry about it later. So you try to relax (as much as you can do that while Amily is giving you an incredible tailjob...) and simply enjoy the feeling. Sure enough, it doesn\'t take her much longer to finally make you cum. Breaking the kiss, she steps back and with a broad grin asks you enjoy that, you naughty ' + CoC.player.mf( 'man', 'girl' ) + '?</i>"\n\n', false );
			MainView.outputText( 'Naturally, you tell her that you enjoyed it very much, and with a smile, Amily helps you clean up. "<i>If you liked it that much...</i>" she says over her shoulder and winks at you as she goes to take care of something else.\n\n', false );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			CoC.player.orgasm();
			EngineCore.dynStats( 'sen', -1 );
			return;
		}
		//B2: Hand/Footjob;
		else if( scene === 1 ) {
			MainView.outputText( 'Once you are at her nest, Amily makes you sit down and kneels in front of you. She leans over to kiss you passionately, but you can feel her hands being busy on your pants. Drawing back, the mousegirl smiles at you, as her hands pull out your ' + Descriptors.cockDescript( 0 ) + ' and start stroking it. Shuddering a little, you sit back and enjoy Amily\'s ministrations. You knew that she\'s quite dexterous, but you\'d never have thought... Shuddering a little at the pleasure you feel, you partly close your eyes.\n\n', false );
			MainView.outputText( 'Suddenly, your eyes snap open again and you look with something very much like disappointment at Amily as she withdraws her hands. "<i>What? Did you think I\'d only use my hands on you?</i>" she asks while sitting down. "<i>Close your eyes again!</i>" she demands. Not really sure what she has in mind, you still comply. After a moment or two, you feel something else on your ' + Descriptors.cockDescript( 0 ) + '. You open one of your eyes a little and realize that Amily\'s now using her feet. Smiling, you close your eye again and simply enjoy the feeling. The mousegirl continues stroking your cock with her feet for some time before switching back to her hands. Alternating between them (and sometimes using hands and feet at once), Amily soon makes you cum with a pleasured groan. Opening your eyes again, you smile at her in thanks.\n\n', false );
			MainView.outputText( 'Looking at her hands and feet covered by your cum, Amily jokingly accuses you of forcing her to clean herself yet again, just because you have no control. Your eyes widen a bit in surprise when the mousegirl lightly licks one of her hands and comments "<i>Mmhhmm... not bad, actually...</i>" With a grin, she cleans up the results of her hand-and-foot-job before pulling you to your feet again. "<i>Back to work, Champion!</i>"\n\n', false );
			MainView.outputText( 'With a satisfied smile, you turn to other things.', false );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			CoC.player.orgasm();
			EngineCore.dynStats( 'sen', -1 );
			return;
		}
		//B3: Eat Out;
		else if( scene === 2 ) {
			MainView.outputText( 'Once you are at the nest, Amily pushes you down onto your back. You lay there in the soft, sweet-smelling vegetation as she strips off. Then, to your surprise, she pounces onto your chest, straddling your neck and leaving you face to face with her vagina.', false );
			//(if Amily is herm:;
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( '  Her cock bobs merrily in your field of vision.', false );
			}
			MainView.outputText( '\n\n', false );
			MainView.outputText( '"<i>You\'ve got a very sweet tongue, you know that?</i>" Amily giggles. "<i>Let\'s see just how sweet it is...</i>"\n\n', false );
			MainView.outputText( 'You don\'t need any further nudging; you open your mouth, bend forward and stick out your tongue to give her vagina a probing lick. Despite herself, Amily squeaks at the sensation and, emboldened, you start to lick more enthusiastically, running your tongue around each of her netherlips.\n\n', false );
			//(If Amily is herm:;
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( '"<i>Could you... could you give it a lick, please?</i>" she whispers, pointing at her male addition. Wanting to make her happy, you kiss the tip of her penis, eliciting a squeak of shock, before you start to lick from the base of her ' + this.amilyCock() + ' to the tip again. You then return your attention to her vagina itself.\n\n', false );
			}

			MainView.outputText( '"<i>Yes, yes, yes, that\'s it! Oooh!</i>" Amily squeals at your ministrations, wriggling and squirming in her pleasure. You can feel her juices starting to trickle down her inner walls, hot and salty; you start to probe your tongue deeper inside her vulva, caressing her most delicate of spots. With a shudder and a squeal, she climaxes as you slide your tongue in as deeply as it can go and her juices flood your mouth and splash onto your face.', false );
			//(if Amily is herm:;
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( '  Her penis erupts and sprays its own cum into the air to sprinkle the both of you.', false );
			}
			MainView.outputText( '\n\n', false );
			MainView.outputText( 'She flops over onto your belly on her back, gasping for air, leaving her crotch sitting on your neck. Finally, she recovers and sits up, dragging her damp pussy ', false );
			//(if Amily is herm:;
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( 'and limp cock ', false );
			}
			MainView.outputText( 'across your chest as she repositions herself so that she is looking you in the eyes, laying atop you. "<i>You always know how to make a girl feel special, don\'t you?</i>" she says, softly. Then she kisses you, probing her tongue deep into your mouth to get a good taste of her juices, before wriggling off of you, grabbing her pants and running merrily away. You watch her go, then clean yourself off.\n\n', false );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			EngineCore.dynStats( 'int', 0.25, 'lus', 10 );
			return;
		}
		//B4: Get Ridden;
		else if( scene === 3 ) {
			MainView.outputText( 'Once you are at the nest, Amily pushes you down onto your back. You lay there in the soft, sweet-smelling vegetation as she strips off. Then she starts tugging insistently at your pants, and you wriggle to help her. Soon, ', false );
			if( CoC.player.totalCocks() > 1 ) {
				MainView.outputText( 'each of ', false );
			}
			MainView.outputText( 'your ' + Descriptors.multiCockDescriptLight() + ' is exposed, rapidly growing erect. She strokes it with one hand. "<i>Oh, you\'re eager for this, aren\'t you?</i>" she teases.\n\n', false );
			MainView.outputText( 'You don\'t deny it, groaning with longing and nodding your head.\n\n', false );
			MainView.outputText( '"<i>Well, let\'s see if I can live up to your expectations...</i>" She purrs (an odd image, given she\'s a mouse). She strokes your ' + Descriptors.cockDescript( 0 ) + ' with one hand, then kisses the tip. She starts to lick it, long, teasing, saliva-heavy licks that have you moaning with pleasure and soon has it lubed up well and truly. Then, without further ado, she straddles you, impaling herself upon you in one practiced motion. She squeals loudly at the sensation, but she\'s evidently far from hurt, given the wide grin on her mousy face.\n\n', false );
			MainView.outputText( '"<i>Mmm... You feel so good down there, you know?</i>" She teases you, starting to thrust and grind against you. In turn, you start to buck back against her, only for her to suddenly press you down to the floor. "<i>No! Bad!</i>" She snaps, though her smile and mischievous eyes make it clear she\'s only playing. Whenever you try to participate, she stops to admonish you, and so you are forced to lie on the nest, groaning with temptation and pleasure as Amily tantalizingly grinds, thrusts and bucks against you - but only at the pace she likes, bringing you to the edge of climax, and then stopping, only to start again when you are beginning to fade in your pleasure. She cums, more than once, but keeps you riding the edge until, at last, she takes mercy and lets you cum into her slick, wet pussy.\n\n', false );
			MainView.outputText( 'She howls in unison with you at this final climax', false );
			//(if high cum amount:;
			if( CoC.player.cumQ() > 500 ) {
				MainView.outputText( ', your torrents of spooge making her belly distend visibly', false );
			}
			MainView.outputText( ', and then collapses onto your front. You lie there together, arms unthinkingly winding around each other. Amily is the first of you to stir. "<i>Do you... Are you happy, that I\'m here?</i>" You assure her that you are. "<i>That\'s good...</i>" She yawns. "<i>Because I\'m so happy to be here with you.</i>"\n\n', false );
			MainView.outputText( 'Exhausted, you feel a quick nap is in order yourself. When you wake up, you\'re alone in the nest but Amily is nearby; she hands you some food and then points you in the direction of the stream to wash up.\n\n', false );
			this.amilyPreggoChance();
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			CoC.player.orgasm();
			EngineCore.dynStats( 'sen', -1 );
			return;
		}
		//B5: Suck Off;
		else if( scene === 4 ) {
			MainView.outputText( 'Once you are at the nest, Amily pushes you down onto your back. You lay there in the soft, sweet-smelling vegetation as she strips off. Then, to your surprise, she pounces onto your chest, straddling your neck and leaving you face to face with her half-erect cock. She twitches her ' + this.amilyHips() + ' back and forth, grinning as your eyes follow the tip of her penis. "<i>Now, as I recall, it\'s your fault I grew this thing...</i>" She says, mischievously. "<i>And now it\'s starting to feel really in need of some... attention. So, wouldn\'t it be best if that somebody who made me grow it gave it that attention, hmm?</i>"\n\n', false );
			MainView.outputText( 'You smirk up at her, because she\'s fooling nobody, then lean forward and engulf the head of the ' + this.amilyCock() + '. Amily\'s breath explodes out of her in shock as you start to lick and suck upon her futanari member. "<i>You... you really aren\'t scared of this?</i>" She whispers, moaning softly as you grow bolder, starting to lick the shaft, doing your best to swallow all ' + CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] + ' inches of it.\n\n', false );
			MainView.outputText( 'Slowly, uncertainly, Amily begins to thrust back and forth, pushing her futa-mouse-cock into your mouth and out again, as deeply as you can take it. She squeaks and whimpers softly at the sensations of her alien sexual organ and your hot, wet mouth, beginning to increase her thrusts. The taste of her pre, salty-sweet, starts tickling your tongue and you start sucking and licking harder, doing your best to coax as much pleasure out of her as possible.\n\n', false );
			MainView.outputText( 'Perhaps you are better at this than you thought, or maybe Amily just isn\'t good at controlling the sensations from her secondary sexual organ, because it seems like no time at all before she lets out a high-pitched squeak and a flood of mouse-futa cum fills your mouth. Hot and salty, but with an aftertaste you can\'t explain, one that puts you in mind of Amily herself. Unthinkingly you swallow it, and it seems to burn a trail down your gullet.\n\n', false );
			MainView.outputText( 'Amily\'s cock pops from your mouth as she flops over onto your chest, ' + this.amilyTits() + ' heaving as she gasps for breath. "<i>Was... Was that...</i>" She swallows and tries again. "<i>Is that what it\'s like? ', false );
			if( CoC.player.hasCock() ) {
				MainView.outputText( 'When I do that for you?</i>"\n\n', false );
			} else {
				MainView.outputText( 'For a guy?</i>"\n\n', false );
			}

			MainView.outputText( 'You shrug, uncertain. Slowly, Amily sits up and gets off of you. "<i>I... um... thank you.</i>" She says, then quickly steals a kiss from you before running off. She\'s in such a hurry that she\'s clear over on the other side of the camp before you can tell her that she left her pants behind.', false );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			EngineCore.dynStats( 'int', 0.25, 'lus', 10 );
			return;
		}
		//Let Amily Lead: Amily Mounts You;
		else if( scene === 5 ) {
			MainView.outputText( 'Once you\'re at the nest, Amily pushes you down onto your back. You lay there in the soft, sweet-smelling vegetation as she strips off. Then she starts tugging insistently at your pants, and you wriggle to help her. Soon, you are both naked, and Amily takes a step back, stroking her ' + this.amilyCock() + '.\n\n', false );
			MainView.outputText( '"<i>I\'ve got this because of you, so you owe me a chance to use it.</i>" She says.\n\n', false );
			MainView.outputText( 'You smile up at her and spread your ' + CoC.player.legs() + ' to let her have a full look at your ' + Descriptors.vaginaDescript() + ', smirking at her as an exhortation to come and get it. From her own smirk, and the fully erect penis she\'s sporting, you know she\'s about to get it as much as she can.\n\n', false );
			MainView.outputText( 'Amily situates herself between your legs and starts to stroke your ' + Descriptors.vaginaDescript() + '; needless to say, her skill and experience from her own efforts to masturbate herself soon have you bucking with pleasure, lubing up your passage with your own feminine fluids.', false );
			//(if player is herm:;
			if( CoC.player.hasCock() ) {
				MainView.outputText( '  She strokes your ' + Descriptors.cockDescript( 0 ) + ' a few times, but in a prefunctory manner; it\'s obvious that she\'s focusing on her own penis, this time.', false );
			}
			MainView.outputText( '\n\n', false );
			MainView.outputText( 'Once you are sufficiently wet for her tastes, Amily plunges her mouse-futa cock into you. ', false );
			CoC.player.cuntChange( (CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] * CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ]), true, false, true );
			//(If player has a gaping pussy:;
			if( CoC.player.looseness() >= 4 ) {
				MainView.outputText( 'You are so large that you barely feel it, but Amily is determined to take what pleasure she can all the same.', false );
			}//Otherwise:;
			else {
				MainView.outputText( 'You gasp in pleasure and do your best to grip Amily\'s dick with your netherlips.', false );
			}
			MainView.outputText( '\n\n', false );
			MainView.outputText( '"<i>I can hardly believe I\'ve got a cock stuck in another woman\'s pussy... but, I gotta admit, this is actually really good, even if it is really weird too.</i>" Amily murmurs, but then she starts doing what you consider really important and she begins thrusting into you. You wrap your ' + CoC.player.legs() + ' around Amily\'s back and pull her tightly against you, eagerly meeting her every thrust with one of your own. She moans and gasps at your efforts, pounding your pussy with everything she has,', false );
			//(if player is a squirter:;
			if( CoC.player.wetness() >= 5 ) {
				MainView.outputText( ' audibly squelching and slurpring thanks to the wetness of your pussy,', false );
			}
			MainView.outputText( ' doing her best to make you buck and writhe under her, a job you think she\'s doing just fine at.\n\n', false );
			MainView.outputText( 'Together you thresh and thrust, hips pounding together furiously, until Amily grunts suddenly, loudly and deeply, as her hot futa essence wells up from deep inside of her and begins gushing into you. At that, you lose it yourself, your own fluids pouring forth to mingle with hers and run out of your ' + Descriptors.vaginaDescript() + '', false );
			//if herm: your (cockdescript cocknumber);
			if( CoC.player.hasCock() ) {
				MainView.outputText( ', ' + Descriptors.sMultiCockDesc() + ' spraying jism to fall upon you both like sex-scented rain', false );
			}
			MainView.outputText( '. Panting with your mutual release, Amily slides wetly from your sex and falls upon your belly, to rest there for a moment.\n\n', false );
			MainView.outputText( 'Slowly, she raises her head and pecks you affectionately on the lips. "<i>Thank you,</i>" is all she says, continuing to lay there with you for a while. Then she picks herself up and walks away, and you do the same.', false );
			//PREGGO CHECK HERE;
			if( CoC.flags[ kFLAGS.AMILY_ALLOWS_FERTILITY ] === 1 ) {
				CoC.player.knockUp( PregnancyStore.PREGNANCY_AMILY, PregnancyStore.INCUBATION_MOUSE );
			}
			CoC.player.orgasm();
			EngineCore.dynStats( 'sen', -1 );
		}
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Give Present:;
	AmilyScene.prototype.giveAmilyAPresent = function() {
		this.amilySprite();
		MainView.clearOutput();
		MainView.menu();
		var haveGift = false;
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			MainView.outputText( 'You tell Amily that you have something you want to give her.\n\n' );
			MainView.outputText( '"<i>Aw, how sweet of you.</i>" She smiles, delighted and full of love.\n\n' );
		} else {
			MainView.outputText( 'You look at the horny cum-bucket and wonder what you should make her take this time.\n\n' );
		}
		if( CoC.player.hasItem( ConsumableLib.INCUBID ) && CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 2 ) {
			EngineCore.addButton( 0, 'Incubus D.', this, this.giveAmilyPureIncubusDraft );
			haveGift = true;
		} else if( CoC.player.hasItem( ConsumableLib.P_DRAFT ) ) {
			EngineCore.addButton( 0, 'P. Incubus D.', this, this.giveAmilyPureIncubusDraft );
			haveGift = true;
		}
		if( CoC.player.hasItem( ConsumableLib.P_S_MLK ) || (CoC.player.hasItem( ConsumableLib.SUCMILK ) && CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 2) ) {
			EngineCore.addButton( 1, 'Succ Milk', this, this.giveAmilyPurifiedSuccubusMilk );
			haveGift = true;
		}
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 && (CoC.player.hasItem( ConsumableLib.PINKEGG ) || CoC.player.hasItem( ConsumableLib.L_PNKEG )) ) {
			EngineCore.addButton( 2, 'Pink Egg', this, this.giveAmilyAPinkEgg );
			haveGift = true;
		}
		if( CoC.player.hasItem( ConsumableLib.WHITEEG ) || CoC.player.hasItem( ConsumableLib.L_WHTEG ) ) {
			EngineCore.addButton( 3, 'White Egg', this, this.giveAmilyAWhiteEgg );
			haveGift = true;
		}
		if( CoC.player.hasItem( ConsumableLib.BROWNEG ) || CoC.player.hasItem( ConsumableLib.L_BRNEG ) ) {
			EngineCore.addButton( 4, 'Brown Egg', this, this.giveAmilyABrownEgg );
			haveGift = true;
		}
		if( CoC.player.hasItem( ConsumableLib.PURPLEG ) || CoC.player.hasItem( ConsumableLib.L_PRPEG ) ) {
			EngineCore.addButton( 5, 'Purple Egg', this, this.giveAmilyAPurpleEgg );
			haveGift = true;
		}
		//Reducto not yet implemented;
		//Lactaid not yet implemented;
		if( CoC.player.hasItem( ConsumableLib.SDELITE ) && CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 2 ) {
			EngineCore.addButton( 7, 'Suc. Delite', this, this.giveCorruptAmilySuccubusDelight );
			haveGift = true;
		}
		if( CoC.player.hasItem( ArmorLib.C_CLOTH ) ) {
			EngineCore.addButton( 8, 'Clothes', this, this.giveAmilySomePants );
			haveGift = true;
		} else if( CoC.player.hasItem( ArmorLib.S_SWMWR ) && CoC.flags[ kFLAGS.AMILY_OWNS_BIKINI ] === 0 && CoC.player.hasCock() && CoC.player.cockThatFits( 61 ) >= 0 && !this.amilyCorrupt() ) {
			MainView.outputText( 'You could give her a bikini, then invite her for a swim in the stream to show it off.\n\n' );
			EngineCore.addButton( 8, 'Bikini', this, this.amilySwimFuckIntro );
			haveGift = true;
		} else if( CoC.flags[ kFLAGS.GIVEN_AMILY_NURSE_OUTFIT ] === 0 && !this.amilyCorrupt() ) {
			if( CoC.player.hasItem( ArmorLib.NURSECL ) && CoC.player.hasCock() && CoC.player.cockThatFits( 61 ) >= 0 ) {
				MainView.outputText( 'You could give Amily the nurse\'s outfit you got, though it barely covers anything at all, and would likely be inviting some roleplay from the kinky mouse-girl.\n\n' );
				EngineCore.addButton( 8, 'NurseClothes', this, this.amilyNurseCheckup );
				haveGift = true;
			} else if( CoC.player.hasItem( ArmorLib.NURSECL ) ) {
				MainView.outputText( 'You have a hunch if you had a penis that wasn\'t too big, giving Amily a nurse\'s outfit might set off some kinky roleplay.\n\n' );
			} else {
				MainView.outputText( 'You have a hunch that if you had a nurse\'s outfit you could get Amily to give you a rather erotic checkup, provided ' );
				if( !CoC.player.hasCock() ) {
					MainView.outputText( 'you had a dick.' );
				} else if( CoC.player.cockThatFits( 61 ) < 0 ) {
					MainView.outputText( ' your dick could fit.' );
				}
			}
		}
		if( haveGift ) {
			EngineCore.addButton( 9, 'Back', this, this.amilyFollowerEncounter );
		} else {
			if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
				MainView.outputText( 'You realize that you don\'t have any items she would be interested in, and apologize.' );
			} else {
				MainView.outputText( 'You realize you don\'t have any items worth using on her.' );
			}
			EngineCore.addButton( 0, 'Next', this, this.amilyFollowerEncounter );
		}
	};
	//[Purified Incubus Draft - If Amily is a Female];
	AmilyScene.prototype.giveAmilyPureIncubusDraft = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		var maxSizePure = 13;
		var maxSizeCorr = 15;
		var maxSizeHypr = 23;
		//PURE AMILY;
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			//Herm amily is different;
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				//[Purified Incubus Draft - If Amily is Herm and has a 13" penis];
				if(
					(CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] >= maxSizePure && !CoC.flags[ kFLAGS.HYPER_HAPPY ]) ||
					(CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] >= maxSizeHypr && CoC.flags[ kFLAGS.HYPER_HAPPY ])
				) {
					MainView.outputText( 'Amily sees the vial you are holding as you approach and shakes her head.  "<i>I\'m not sure I should take any more of that stuff.</i>"\n\n', false );
					MainView.outputText( 'Seeing your look of disappointment, she explains, "<i>I\'m flattered you want more of me inside you, but this thing\'s already nearly a fifth of my size.  If it gets any bigger, I\'m going to have trouble staying conscious while erect.</i>"\n\n', false );
					//[if corruption high (50+?) or high vaginal depth/looseness];
					if( CoC.player.cor >= 50 || CoC.player.vaginalCapacity() >= 50 ) {
						MainView.outputText( 'You struggle to contain your disappointment, having entertained lurid fantasies of being stretched beyond all reason by her ever-growing member, but you can\'t deny her logic unconscious mouse-girl wouldn\'t be nearly as much fun, even if she was exceptionally well endowed.', false );
						//if corruption VERY high -75+?];
						if( CoC.player.cor >= 75 ) {
							MainView.outputText( '  Although the idea of raping yourself with your futa-mouse lover\'s helpless body is appealing, you realize this is one argument you simply won\'t win.', false );
						}
						MainView.outputText( '\n\n', false );
					}
					//otherwise];
					else {
						MainView.outputText( 'Her logic is undeniable, even though you had looked forward to enjoying even more of her body than before. You nod and explain that you understand perfectly; you want what\'s best for her above anything else.\n\n', false );
					}

					MainView.outputText( 'You put the vial back in its pouch, as Amily excuses herself and walks off.', false );
					EngineCore.doNext( MainView, MainView.playerMenu );
					return;
				}
				//[Purified Incubus Draft - If Amily is Hermaphrodite];
				MainView.outputText( 'She looks disdainfully at the vial in your hand. "<i>What, am I not big enough for you already? Oh well, I suppose if it makes you happy.</i>" She snatches it from your hand and gulps it down. She tries her best to look apathetic, but is unable to help either the pleased moan or the dribbles of pre-cum that stain her clothes as her penis grows erect and then longer, at least a full inch so.  Breathing heavily, she pants, "<i>Why does this have to actually feel good?</i>"  Then she turns and lurches drunkenly away. You decide against following her and wander off in the other direction.\n\n', false );
				CoC.player.consumeItem( ConsumableLib.P_DRAFT );
				this.amilyDickGrow();
				EngineCore.doNext( this, this.amilyFollowerEncounter );
			}
			//Normal Amily;
			else {
				MainView.outputText( 'You offer up the vial of purified Incubus Draft - and Amily promptly leaps back with a shrill squeak that borders on a scream in terms of volume.\n\n', false );
				MainView.outputText( '"<i>That\'s liquid corruption!</i>" She protests. "<i>Have you gone insane? I\'m not drinking that, and you shouldn\'t either!</i>"\n\n', false );
				MainView.outputText( 'You hastily assure her that it is purified and so neither of you have to worry about joining the ranks of the demons. She still looks skeptical, but then nods slowly and approaches you.\n\n', false );
				MainView.outputText( '"<i>All right... but, are you sure you want to give that to me? You know it will make me grow a penis, right?</i>"\n\n', false );
				EngineCore.doYesNo( this, this.giveAmilyPureIncubusDraft4Realz, this, this.amilyFollowerEncounter );
			}
		}
		//CORRUPT;
		else {
			//No wang yet;
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] === 0 ) {
				//Consume dah goodies!;
				if( CoC.player.hasItem( ConsumableLib.INCUBID ) ) {
					CoC.player.consumeItem( ConsumableLib.INCUBID );
				} else {
					CoC.player.consumeItem( ConsumableLib.P_DRAFT );
				}
				MainView.outputText( 'You pick up a vial of incubus draft and show it to Amily. "<i>Drink this,</i>" you tell her, passing the bottle to her. "<i>' + CoC.player.mf( 'Master', 'Mistress' ) + ', this will make me grow a cock. Are you sure you wish to do that?</i>"\n\n', false );
				MainView.outputText( 'You tell her yes, this is exactly what you want. Amily smiles and replies seductively, "<i>As you wish ' + CoC.player.mf( 'master', 'mistress' ) + '.</i>"\n\n', false );
				MainView.outputText( 'She downs the bottle in a single go, then begins moaning as heat gathers on her clit. You push her back and tell her to keep her legs open, you want to watch; she silently complies and continues panting and moaning. Her clit begins distending itself, growing and slowly moving up and out of its hiding place in her pussy, reaching upwards from her crotch. Its pinkish-purple and spills cum as it grows, stopping just below her navel, where it spurts a couple more jets.\n\n', false );
				MainView.outputText( 'Amily stops her moaning; apparently the transformation is over... But it\'s such a small dick... Only four inches long and barely one inch thick...\n\n', false );
				MainView.outputText( 'Do you make her grow a huge one?', false );
				CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] = 4;
				CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] = 1;
				EngineCore.doYesNo( this, this.corruptAmilyGetsDickMaxxedOut, this, this.corruptAmilyYouDeclineMaxxingHerDick );
			} else if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] < maxSizeCorr && CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] < 3 ) {
				//Consume dah goodies!;
				if( CoC.player.hasItem( ConsumableLib.INCUBID ) ) {
					CoC.player.consumeItem( ConsumableLib.INCUBID );
				} else {
					CoC.player.consumeItem( ConsumableLib.P_DRAFT );
				}

				MainView.outputText( 'You pick up a vial of incubus draft and show it to Amily. "<i>I want you to have a bigger cock; drink this.</i>" You order her, passing the bottle to her. Amily smiles and says, "<i>As you wish, ' + CoC.player.mf( 'master', 'mistress' ) + ', your orders are my pleasure.</i>"\n\n', false );
				MainView.outputText( 'She opens her legs to give you a good view and downs the whole bottle in one go. She moans as her cock turns purple and grows impossibly hard, her veins bulging along the shaft as she cums. With every throb her cock grows a bit longer and a bit thicker as well, finally stopping when it\'s a couple inches bigger. She pants with pleasure and says, "<i>Thank you, ' + CoC.player.mf( 'master', 'mistress' ) + ', for allowing this horny cum-bucket the honor of possessing such a wonderful tool.</i>"\n\n', false );
				MainView.outputText( 'Satisfied, you dismiss her with a wave and go about your business.', false );
				this.amilyDickGrow();
				EngineCore.doNext( this, this.amilyFollowerEncounter );
			}
			//Too big!;
			else {
				MainView.outputText( 'You reconsider - her small frame probably couldn\'t handle anything larger.', false );
				EngineCore.doNext( this, this.amilyFollowerEncounter );
			}
		}
	};
	AmilyScene.prototype.corruptAmilyYouDeclineMaxxingHerDick = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You decide to leave her as she is. If you want her to have a bigger dick you can always give her more drafts. "<i>I want you to practice using your new tool, so you\'ll be ready whenever I need you,</i>" you order Amily. "<i>Yes, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she answers. You leave her on the floor and go about your business.', false );
		EngineCore.doNext( this, this.amilyFollowerEncounter );
	};
	AmilyScene.prototype.corruptAmilyGetsDickMaxxedOut = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		var maxSizeCorr = 15;
		var maxSizeHypr = 23;
		//(If PC has 2 feet that are not hooves);
		if( CoC.player.isBiped() && CoC.player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_HOOFED ) {
			MainView.outputText( 'You\'re not satisfied; it needs to be bigger. You put your ' + CoC.player.foot() + ' on her cock and begin stroking it, drawing more pleasured moans from the slutty corrupt futa-mouse. You stroke her into an orgasm, milky white fluid flows out of her dick to hit her in the chest and in the face, but you don\'t stop. Her cock throbs and spills pre-cum, making your movements easier. You keep stroking her cock with your ' + CoC.player.foot() + ' vigorously, willing it to grow more and more; each time her cock throbs and orgasms it grows a bit more.\n\n', false );
			MainView.outputText( 'Amily is already covered in her own cum, her juices pooling under her, but you never stop. You keep stroking until she comes again, her cock growing more and more. Finally, when one last orgasm brings it to just about 15 inches long and three thick, you press on her cockhead with your ' + CoC.player.foot() + ' and she comes one last time, coating your ' + CoC.player.foot() + ' with spooge. "<i>Clean this up,</i>" you order her, presenting her with your messy ' + CoC.player.foot() + '. She obediently begins licking at the mess, tasting herself in the process. After it\'s clean you tell her you will call her when she you need her services again, and that she is to practice with her new tool until you do so. "<i>Yes... ' + CoC.player.mf( 'Master', 'Mistress' ) + ',</i>" she answers tiredly, panting.\n\n', false );
		}
		//(else);
		else {
			MainView.outputText( 'You\'re not satisfied, it needs to be bigger. You take hold of her cock and begin stroking it, drawing more pleasured moans from the slutty corrupt futa-mouse. You stroke her into an orgasm; milky white fluid flows out of her dick to hit her in the chest and in the face, but you don\'t stop. Her cock throbs and spills pre-cum, making your movements easier. You keep stroking her cock vigorously, willing it to grow more and more; each time her cock throbs and orgasms it grows a bit more.\n\n', false );
			MainView.outputText( 'Amily is already covered in her own cum, her juices pooling under her, but you never stop. You keep stroking until she comes again, her cock growing more and more. Finally, when one last orgasm brings it to just about 15 inches long and three thick, you grasp roughly on her cockhead with your hands and she comes one last time, coating your hands with spooge. "<i>Clean this up,</i>" you order her, presenting her with your messy hands. She obediently begins licking at the mess, tasting herself in the process. After you\'re clean you tell her you will call her when she you need her services again, and that she is to practice with her new tool until you do so. "<i>Yes... ' + CoC.player.mf( 'Master', 'Mistress' ) + ',</i>" she answers tiredly, panting.\n\n', false );
		}
		MainView.outputText( 'You abandon her in a heap of fluids and go about your own business.', false );
		if( CoC.flags[ kFLAGS.HYPER_HAPPY ] ) {
			CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] = maxSizeHypr;
		} else {
			CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] = maxSizeCorr;
		}
		CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] = 3;
		EngineCore.doNext( this, this.amilyFollowerEncounter );
	};
	//(If the player says Yes):;
	AmilyScene.prototype.giveAmilyPureIncubusDraft4Realz = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		CoC.player.consumeItem( ConsumableLib.P_DRAFT );
		MainView.outputText( 'Assuring her that this is what you want, you pass it over. Amily takes it reluctantly, then downs it, shuddering - first in disgust at what she actually drank, then with pleasure. Moaning ecstatically, she pulls off her pants to give you a full view as her clitoris swells, longer and thicker; finally, skin peels back at the tip to reveal what is unmistakably the glans of a penis, complete with a cum-gouting slit as she experiences her first male orgasm.\n\n', false );
		MainView.outputText( 'Amily is now a hermaphrodite. Her human-like penis is four inches long and one inch thick.\n\n', false );
		MainView.outputText( 'Catching her breath, she stares at her new appendage with an unreadable expression, then pulls her clothes back on with a grimace. You decide to give her some time alone to adjust to the change.', false );
		this.amilyDickGrow();
		EngineCore.doNext( this, this.amilyFollowerEncounter );
	};
	AmilyScene.prototype.amilyDickGrow = function() {
		var maxSize;
		if( CoC.flags[ kFLAGS.HYPER_HAPPY ] ) {
			maxSize = 23;
		} else {
			maxSize = 15;
		}
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] === 0 ) {
			CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] = 4;
			CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] = 1;
		} else if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] < 15 || CoC.flags[ kFLAGS.HYPER_HAPPY ] ) {
			CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ]++;
			CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] = 1 + ((CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] - 4) / 9);
			if( CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] > 3 ) {
				CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] = 3;
			}
		} else if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] >= maxSize ) {
			CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] = maxSize;
			CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] = 3;
		}
	};
	//(If the player says No):;
	AmilyScene.prototype.declineToMakeAmilyFuta = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'On second thought, you decide against giving it to her. Amily looks relieved as you apologize and put it back in your pocket. "<i>So, what did you really want to ask me about?</i>" She says, eager to change the subject.\n\nYou don\'t really have anything to say and walk away, embarrassed.', false );
		EngineCore.doNext( this, this.amilyFollowerEncounter );
	};
	//[Purified Succubi Milk];
	AmilyScene.prototype.giveAmilyPurifiedSuccubusMilk = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		//DAH PURE;
		var maxSizePure = 5;
		var maxSizeHypr = 22;
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			MainView.outputText( 'You offer her a vial of demonic milk, assuring her as you do so that the corruptive elements have been removed from it.\n\n', false );
			//(If Amily's breast size is smaller than DD-cup):;
			if( (CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] < maxSizePure) || ( CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] < maxSizeHypr && CoC.flags[ kFLAGS.HYPER_HAPPY ]) ) {
				MainView.outputText( 'She smiles at you. "<i>I always did kind of want bigger breasts.</i>" She admits, sheepishly. She takes it from you and eagerly chugs. She then drops the empty bottle, allowing it to smash on the ground, clutching her breasts and moaning ecstatically as they visibly swell, her clothes growing tighter as they do. When they finish, she squeezes them with glee. "<i>Mmm... That feels nice. Did you want something else?</i>"\n\n', false );
				CoC.flags[ kFLAGS.AMILY_CUP_SIZE ]++;
				CoC.player.consumeItem( ConsumableLib.P_S_MLK );
			}
			//(If Amily's breast size is DD-cup):;
			else {
				MainView.outputText( 'She looks thoughtful for a moment, then shakes her head reluctantly. "<i>I\'m sorry darling, I really am, but I think I\'ve got big enough breasts as it is.</i>" She then smirks, and playfully jiggles her abundant cleavage. "<i>Don\'t you agree?</i>" she teases.\n\n', false );
				MainView.outputText( 'Swallowing hard, you have to agree, which makes Amily laugh.', false );
				EngineCore.dynStats( 'lus', 5 );
			}
		}
		//CORRUPT UNZ;
		else {
			//[Give Succubi's Milk];
			if( CoC.player.hasItem( ConsumableLib.SUCMILK ) ) {
				CoC.player.consumeItem( ConsumableLib.SUCMILK );
			} else {
				CoC.player.consumeItem( ConsumableLib.P_S_MLK );
			}
			//Doesn't matter if purified or not, she takes it the same way.;
			//Amily's vagina is already at wetness 1, goes up to 4 (squirter).;
			//You can give it Amily more Succubi's Milk after she's at 4, but it'll have no effect.;
			MainView.outputText( 'You pick up a vial of Succubi\'s Milk and show it to Amily. "<i>Do you know what to do with this, slut?</i>" you ask her. "<i>You want me to drink it, ' + CoC.player.mf( 'master', 'mistress' ) + '?</i>" she asks you, licking her lips. You smile and reply, "<i>That\'s right.</i>" Then you push her on her back and lift her legs over her shoulders, exposing her wet pussy to you.  "<i>Only, you\'re going to drink with these lips,</i>" you add. Amily smiles in approval and excitement.', false );
			//[(If Amily has a dick);
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( '  Her cock hardens with delight at your idea.', false );
			}
			MainView.outputText( '\n\n', false );
			MainView.outputText( 'You uncork the vial, spread Amily\'s pussy with a hand and pour the contents of the vial into Amily\'s hungry snatch. "<i>Ah ' + CoC.player.mf( 'master', 'mistress' ) + '! It feels so good! Just like cum,</i>" Amily moans in pleasure. The contents quickly disappear inside Amily\'s womb, triggering an orgasm within the whorish mouse-slave.', false );
			CoC.flags[ kFLAGS.AMILY_VAGINAL_WETNESS ]++;
			//[(if Amily reached/is a squirter);
			if( CoC.flags[ kFLAGS.AMILY_VAGINAL_WETNESS ] >= 5 ) {
				MainView.outputText( '  A jet of femcum flies straight out of her pussy, only to arch and hit her straight in the face.', false );
			} else {
				MainView.outputText( '  Juices flood out of her pussy like water comes out of a spring, running down her body and pooling underneath her.', false );
			}
			MainView.outputText( '\n\n', false );
			//(if Amily's wetness < 4 (squirter));
			if( CoC.flags[ kFLAGS.AMILY_VAGINAL_WETNESS ] < 5 ) {
				MainView.outputText( 'You let go of Amily\'s legs and she plops down in her pooled juices. You observe her as she comes down from her afterglow and realize her pussy is now much wetter; you\'re tempted to make her use her newly lubed up pussy, but refrain from doing so.\n\n', false );
				MainView.outputText( 'It\'ll be more fun to let her lust build; no doubt her pussy must be extra sensitive after this healthy dose of milk. You toss the vial away and casually stride back into the camp, leaving Amily panting on her juices.', false );
			}
			//(else);
			else {
				MainView.outputText( 'You let go of Amily\'s legs and she plops down in her pooled juices. You observe her and she comes down from her afterglow and realize her pussy is still squirting small jets of fluid; it seems giving her more succubi\'s milk won\'t have any effect besides... You give Amily\'s clit a little poke, and she screams in pleasure as she orgasms once more.\n\n', false );
				MainView.outputText( 'Looks like giving her more milk only makes her pussy sensitive. You\'re tempted to make use of her new, sensitive pussy, but refrain from doing so. It\'ll be more fun to let her lust build. You toss the vial away and casually stride back into the camp, leaving Amily panting in her juices.', false );
			}
		}
		EngineCore.doNext( this, this.amilyFollowerEncounter );
	};

	//Drink succubus delight;
	AmilyScene.prototype.amilyDrinksSuccubusDelight = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		// [HORSECOCKS] - Since I'm fucking lazy, that's why;
		var footpaw = 'foot';
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			footpaw += 'paw';
		}
		if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] === 0 ) {
			CoC.player.consumeItem( ConsumableLib.SDELITE );
			MainView.outputText( 'You tell her you need her to be able to cum more, so balls would help with that. Amily smiles and says, "<i>Of course, ' + CoC.player.mf( 'master', 'mistress' ) + '. Forgive your stupid mouse slut for questioning you.</i>"\n\n', false );
			MainView.outputText( 'She opens her legs so you can watch and downs the bottle in one go.', false );
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( 'Her cock grows hard, but nothing else seems to happen...', false );
			}
			MainView.outputText( '\n\n', false );
			MainView.outputText( 'You decide she needs a little push if she\'s going to have balls. "<i>Lay down bitch,</i>" you order her; being called a bitch only makes her smile as she complies.\n\n', false );
			//[=Cock=];
			if( CoC.player.hasCock() && (CoC.player.gender === 1 || Utils.rand( 2 ) === 0) ) {
				MainView.outputText( 'You drop your pants and stand over her, your cock hardening at what you\'re about to do. "<i>Pleasure me.</i>" You order Amily. She lifts a ' + footpaw + ' and begins stroking your exposed ' + Descriptors.cockDescript( 0 ) + '; she takes utmost care not to hurt you with her claws as she grips your shaft expertly between her toes. Her first ' + footpaw + ' is soon joined by her other one and together she begins nimbly masturbating you, giving you an expert footjob. No doubt she\'s been practicing; you\'ll have to reward her for this later.\n\n', false );
				MainView.outputText( 'You focus your corruptive powers, and a dollop of black pre forms on your tip; it slides over your shaft and lubes your ' + Descriptors.cockDescript( 0 ) + ', allowing Amily to better stroke you. You can feel your orgasm coming fast, and you tell Amily to stop and open wide. She spreads her legs as far as they will go and watches, panting, as you finish yourself off. You shoot jet after jet of black cum all over her crotch. Amily moans with every jet that is spilled onto her corrupt form, relishing in the warmth that spreads throughout her.\n\n', false );
			}
			//[=Pussy=];
			else {
				MainView.outputText( 'You drop your pants and stand over her, your pussy moistening at what you\'re about to do. "<i>Pleasure me,</i>" you order Amily. Her tail lifts itself towards your pussy and begins rubbing against your lip and clit, drawing a moan of pleasure from you. Soon the spaded tip presses against your ' + Descriptors.vaginaDescript( 0 ) + ' and pushes into your depths. Amily begins expertly tail-fucking you, spinning her tail around like it was a tongue, licking at every inch of your depths. Soon the first gush of fluids spill onto her tail, lubing it up and making Amily\'s job easier as she pleasures you with a grin.\n\n', false );
				MainView.outputText( 'You focus your corruptive powers, imagining Amily with huge balls, producing delicious cum that she will spill at your command. The mouse cumslut becoming more and more of a toy; the only purpose in her life, to obey and pleasure you. You order her to withdraw; she complies reluctantly, and watches as you finish yourself off. A veritable tide of black juices spills from your ' + Descriptors.vaginaDescript( 0 ) + ' to hit her groin. Amily moans with every jet that is spilled on her corrupt form, relishing in the warmth that spreads throughout her.\n\n', false );
			}
			MainView.outputText( 'You watch, smiling, as a couple of ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'lumps begin forming' : 'fuzzy lumps begin forming'), false );
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( 'right under her cock. Her skin grows and covers the base of her cock, pulling it in; giving her what looks like a sheath. It continues to expand and is finally complimented by a couple of orbs falling into her ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'fuzzy ' : '') + 'sack, giving it the weight it needs to produce more cum. ', false );
			} else {
				MainView.outputText( 'between her legs. Her skin expands with the lumps, forming into a small sack. It continues to expand and is finally complimented by a couple of orbs falling into her ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'fuzzy ' : '') + ' nutsack, giving it the weight it needs to produce cum, though how it will ever expel it is a mystery to you. ', false );
			}
			MainView.outputText( '"<i>Good. Now, I want you to practice walking with these. I can\'t have you hurting yourself as you walk about,</i>" you tell her. "<i>Yes, ' + CoC.player.mf( 'master', 'mistress' ) + '</i>\," she replies, panting slightly; you leave her prone on the ground.', false );
			CoC.player.orgasm();
			CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ]++;
		}
		//Too much;
		else if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] >= 6 ) {
			MainView.outputText( 'You realize that giving Amily any more Succubi\'s Delight would make her practically immobile.  No, she doesn\'t need any more.  Maybe once you\'ve secured a more appropriate place to keep an over-endowed harem.', false );
		}
		//[Give Succubus' Delight - repeat];
		else {
			CoC.player.consumeItem( ConsumableLib.SDELITE );
			MainView.outputText( 'You pick up a vial of Succubi\'s Delight and show it to Amily. "<i>Drink this; you need bigger balls,</i>" you order her, passing the bottle to her. Amily replies, "<i>Yes, ' + CoC.player.mf( 'master', 'mistress' ) + '</i>." Then she opens her legs and downs the bottle. She moans as her balls grow bigger and denser, churning with the extra cum her sack now holds.', false );
			CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ]++;
		}
		EngineCore.doNext( this, this.amilyFollowerEncounter );
	};
	//[Give Succubus' Delight];
	AmilyScene.prototype.giveCorruptAmilySuccubusDelight = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		//Doesn't matter if purified or not, she takes it the same way.;
		//Amily must have a dick before she can take Succubus' Delight;
		//Maximum size is cantaloupe-sized (size 6);
		//No balls yet?  QUERY!;
		if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] === 0 ) {
			MainView.outputText( 'You pick up a vial of Succubi\'s Delight and show it to Amily. "<i>Drink this,</i>" you order her, passing the bottle to her. "<i>You\'re going to give me balls, ' + CoC.player.mf( 'master', 'mistress' ) + '? Are you sure?</i>"\n\n', false );
			EngineCore.doYesNo( this, this.amilyDrinksSuccubusDelight, this, this.amilyFollowerEncounter );
		} else {
			this.amilyDrinksSuccubusDelight();
		}
	};
	//[Pink Egg - Requires Amily be a Herm];
	AmilyScene.prototype.giveAmilyAPinkEgg = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		//PUREZ;
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			MainView.outputText( 'You offer her a pink egg, explaining that it will remove her penis. You barely have time to finish before she snatches it from your hands and bites into it savagely; the shell crunches audibly as she fiercely masticates it, messily devouring it whole in her eagerness. Once she has finished, she drops her pants to watch as <b>her penis shrinks and blurs, eventually resolving itself once more into the dainty form of her clitoris</b>. She sighs, softly.\n\n', false );
			MainView.outputText( '"<i>Thank you, that\'s such a relief. So, anything else you wanted?</i>" she squeaks merrily, quite clearly feeling very cheerful now.', false );
		}
		//Corrupt;
		else {
			MainView.outputText( 'You offer her a pink egg, explaining that it will remove her penis.  Amily looks completely devastated as she says, "<i>Did fuck-slut not use her dick well enough?  Cum-bucket is so sorry ' + CoC.player.mf( 'master', 'mistress' ) + ', it won\'t happen again!</i>"  Before you can respond she snatches the egg from your hand and begins to eat it, messily devouring it until she\'s licking her fingers.  Once she has finished, she drops her pants to watch as <b>her penis shrinks and blurs, eventually resolving itself once more into the dainty form of her clitoris</b>.\n\n', false );
			MainView.outputText( '"<i>Well, is there something else this worthless cum-collector can do to please her ' + CoC.player.mf( 'master', 'mistress' ) + '?  Slut is so sorry she disappointed you,</i>" she squeaks sadly, still trying to entice you into sex.', false );
		}
		if( CoC.player.hasItem( ConsumableLib.PINKEGG ) ) {
			CoC.player.consumeItem( ConsumableLib.PINKEGG );
		} else {
			CoC.player.consumeItem( ConsumableLib.L_PNKEG );
		}
		CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] = 0;
		CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] = 0;
		EngineCore.doNext( this, this.amilyFollowerEncounter );
	};
	//[White Egg];
	AmilyScene.prototype.giveAmilyAWhiteEgg = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		var maxSizePure = 4;
		var maxSizeCorr = 4;
		var maxSizeHypr = 8;
		MainView.outputText( 'You hold out a white egg, telling her that it will make her nipples grow.\n\n', false );
		//Pure;
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			//(If Nipples are smaller than 4 inches:;
			if( CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] < maxSizePure || ( CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] < maxSizeHypr && CoC.flags[ kFLAGS.HYPER_HAPPY ]) ) {
				MainView.outputText( 'She looks at it skeptically. "<i>I guess bigger nipples would be more sensitive...</i>" She mutters, but she takes it from you all the same. Unthinkingly biting off the top, she sucks down the contents in a practiced gulp. Crushing the shell in her hand, she pulls at her top, allowing you to see her nipples swell and grow until they stop. She experimentally tweaks one, squeaking in shock at the sensation. "<i>Well... I guess that they do feel kind of nice... Was there anything else?</i>"\n\n', false );
				if( CoC.player.hasItem( ConsumableLib.WHITEEG ) ) {
					CoC.player.consumeItem( ConsumableLib.WHITEEG );
					CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] += 0.25;
					CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] = Math.ceil( CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] * 100 ) / 100;
				} else {
					CoC.player.consumeItem( ConsumableLib.L_WHTEG );
					CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] += 0.7;
					CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] = Math.ceil( CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] * 100 ) / 100;
				}
				if( CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] > maxSizePure && !CoC.flags[ kFLAGS.HYPER_HAPPY ] ) {
					CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] = maxSizePure;
				}
			}
			//(If Nipples are 4 inches:;
			else {
				MainView.outputText( 'She shakes her head. "<i>I\'m sorry, but I think these are big and sensitive enough already. I\'m a mouse, not a cow.</i>" At that, she insistently walks away, clearly not going to take the egg. You return it to your pocket and decide to let her be.', false );
			}
		}
		//Corrupt!;
		else {
			//(If Nipples are smaller than 4 inches:;
			if( CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] < maxSizeCorr ) {
				MainView.outputText( 'She looks at it and smiles knowingly. "<i>Is ' + CoC.player.mf( 'master', 'mistress' ) + ' going to make this one\'s nipples into obscene toys?</i>" she asks while accepting the egg.  She bites off the top and sucks down the contents in a practiced gulp.  Crushing the shell in her hand, she pulls at her top, allowing you to see her nipples swell and grow until they stop. She experimentally tweaks one, squeaking in shock at the sensation. "<i>Thank you ' + CoC.player.mf( 'master', 'mistress' ) + ' for giving your slut such wonderful nipple-toys.  Would you like to abuse your slut\'s needy fuck-hole now?</i>"\n\n', false );
			} else {
				MainView.outputText( 'She looks at it and moans lewdly, "<i>My nipples are going to be sure huge for you ' + CoC.player.mf( 'master', 'mistress' ) + '.  No, nipples isn\'t right.  They\'re teats now.  Huge, swollen cow-teats on your mousey fuck-pet.  Lets make them bigger!</i>" She bites off the top and sucks down the contents in a practiced gulp.  Crushing the shell in her hand, she pulls at her top, allowing you to see her nipples swell and hang even lower. She experimentally tweaks one, squeaking in shock at the sensation. "<i>Thank you ' + CoC.player.mf( 'master', 'mistress' ) + ' for making your slut\'s body useless for anything but sex.  Would you like to abuse your slut\'s needy fuck-hole now?</i>"\n\n', false );
			}
			if( CoC.player.hasItem( ConsumableLib.WHITEEG ) ) {
				CoC.player.consumeItem( ConsumableLib.WHITEEG );
				CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] += 0.25;
				CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] = Math.ceil( CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] * 100 ) / 100;
			} else {
				CoC.player.consumeItem( ConsumableLib.L_WHTEG );
				CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] += 0.7;
				CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] = Math.ceil( CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] * 100 ) / 100;
			}
		}
		EngineCore.doNext( this, this.amilyFollowerEncounter );
	};
	//[Brown Egg];
	AmilyScene.prototype.giveAmilyABrownEgg = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		var maxSizePure = 16;
		var maxSizeCorr = 20;
		var maxSizeHypr = 35;
		MainView.outputText( 'You hold out a brown egg, telling her that it will make her butt grow.\n\n', false );
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			//(If Amily's butt size is smaller than 'jiggles with every step':;
			if( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] < maxSizePure || ( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] < maxSizeHypr && CoC.flags[ kFLAGS.HYPER_HAPPY ]) ) {
				MainView.outputText( '"<i>So, you want me to have a little more junk in the trunk, huh?</i>" She giggles. "<i>Well, I guess a little padding down there wouldn\'t hurt...</i>" She takes the egg from you, her prominent front-teeth effortlessly biting off the top, whereupon she sucks down the contents in a practiced gulp. Crushing the shell in her hand, her hands then press themselves to her butt as she spins around so that it faces you, trying to look over her shoulder as it visibly swells, straining her pants. She pats it a few times, then shakes her head. "<i>I\'m going to have to go and let these pants out a little now.</i>" She apologizes, and then walks away.\n\n', false );
				EngineCore.dynStats( 'lus', 5 );
				if( CoC.player.hasItem( ConsumableLib.BROWNEG ) ) {
					CoC.player.consumeItem( ConsumableLib.BROWNEG );
					CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] += 1 + Utils.rand( 2 );
				} else {
					CoC.player.consumeItem( ConsumableLib.L_BRNEG );
					CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] += 2 + Utils.rand( 3 );
				}
				if( CoC.flags[ kFLAGS.HYPER_HAPPY ] && CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] > maxSizeHypr ) {
					CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] = maxSizeHypr;
				} else {
					if( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] > maxSizePure ) {
						CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] = maxSizePure;
					}
				}
			}
			//(If Amily's butt is 'delightfully jiggly':;
			else {
				MainView.outputText( 'She looks at the egg, and then shakes her head. "<i>Sorry, but I\'ve got more than enough junk in my trunk for my taste.</i>" Sensing she won\'t back down on this, you put the egg back. "<i>So, is there anything else you wanted?</i>" She asks.', false );
			}
		}
		//IMPURE;
		else {
			//(If Amily's butt size is smaller than 'jiggles with every step':;
			if( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] < maxSizeCorr || ( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] < maxSizeHypr && CoC.flags[ kFLAGS.HYPER_HAPPY ]) ) {
				MainView.outputText( '"<i>So, ' + CoC.player.mf( 'master', 'mistress' ) + ' would like ' + CoC.player.mf( 'his', 'her' ) + ' toy to have a little more padding around her horny puss and asshole?</i>" she giggles. "<i>I obey.</i>" She takes the egg from you, her prominent front-teeth effortlessly biting off the top, whereupon she sucks down the contents in a practiced gulp. Crushing the shell in her hand, her hands then press themselves to her butt as she spins around so that it faces you, trying to look over her shoulder as it visibly swells, jiggling slightly. She pats it a few times, then shakes her head. "<i>Will you be using your newly-improved cum-dumpster now?</i>" she asks.\n\n', false );
				EngineCore.dynStats( 'lus', 5 );
				if( CoC.player.hasItem( ConsumableLib.BROWNEG ) ) {
					CoC.player.consumeItem( ConsumableLib.BROWNEG );
					CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] += 1 + Utils.rand( 2 );
				} else {
					CoC.player.consumeItem( ConsumableLib.L_BRNEG );
					CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] += 2 + Utils.rand( 3 );
				}
				if( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] > maxSizeHypr ) {
					CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] = maxSizeHypr;
				}
			}
			//(If Amily's butt is 'delightfully jiggly':;
			else {
				MainView.outputText( 'Amily scarfs down the egg and looks back expectantly, but it doesn\'t seem to make her already massive backside any larger.  She pouts and whimpers, "<i>Slut is sorry, but her ass is as big and round as it can get ' + CoC.player.mf( 'master', 'mistress' ) + '!</i>"', false );
			}
		}
		EngineCore.doNext( this, this.amilyFollowerEncounter );
	};
	//[Purple Egg];
	AmilyScene.prototype.giveAmilyAPurpleEgg = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		var maxSizePure = 16;
		var maxSizeCorr = 20;
		MainView.outputText( 'You hold out a purple egg, telling her that it will make her hips grow.\n\n', false );
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			//(If Amily doesn't have 'full, womanly hips':;
			if( CoC.flags[ kFLAGS.AMILY_HIP_RATING ] < maxSizePure || ( CoC.flags[ kFLAGS.AMILY_HIP_RATING ] < maxSizeCorr && CoC.flags[ kFLAGS.HYPER_HAPPY ]) ) {
				MainView.outputText( 'She looks at it thoughtfully. "<i>Wider hips...? Well, if you really want, I guess I can try it.</i>" She takes the egg from you, her prominent front-teeth effortlessly biting off the top, whereupon she sucks down the contents in a practiced gulp. Crushing the shell in her hand, she almost loses her balance as her hips suddenly jut wider, the growth happening much faster than she expected. "<i>I\'m going to have to get used to walking like this, now.</i>" She mutters, and then she awkwardly walks away.\n\n', false );
				if( CoC.player.hasItem( ConsumableLib.PURPLEG ) ) {
					CoC.player.consumeItem( ConsumableLib.PURPLEG );
					CoC.flags[ kFLAGS.AMILY_HIP_RATING ] += 1 + Utils.rand( 2 );
				} else {
					CoC.player.consumeItem( ConsumableLib.L_PRPEG );
					CoC.flags[ kFLAGS.AMILY_HIP_RATING ] += 2 + Utils.rand( 3 );
				}
				if( CoC.flags[ kFLAGS.AMILY_HIP_RATING ] > maxSizePure && !CoC.flags[ kFLAGS.HYPER_HAPPY ] ) {
					CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] = maxSizePure;
				} else if( CoC.flags[ kFLAGS.AMILY_HIP_RATING ] > maxSizeCorr ) {
					CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] = maxSizeCorr;
				}
			}
			//(If Amily has 'full, womanly hips':;
			else {
				MainView.outputText( 'She looks at you with one eyebrow quirked. "<i>Any bigger, and I won\'t be able to run anymore. No thank you; I feel like enough woman already, and they aren\'t messing with my speed.</i>" She turns and saunters off, as quickly as she can, but with a deliberate swaying of her hips, as if to prove both her points.', false );
				EngineCore.dynStats( 'lus', 4 );
			}
		}
		//Corrupt;
		else {
			//(If Amily doesn't have 'full, womanly hips':;
			if( CoC.flags[ kFLAGS.AMILY_HIP_RATING ] < maxSizeCorr ) {
				MainView.outputText( 'She looks at it thoughtfully. "<i>' + CoC.player.mf( 'Master', 'Mistress' ) + ' wants my hips even wider?  Are you going to use me as your private breeding stock?  Mmm, that turns me on!</i>" She takes the egg from you, her prominent front-teeth effortlessly biting off the top, whereupon she sucks down the contents in a practiced gulp. Crushing the shell in her hand, she almost loses her balance as her hips suddenly jut wider, the growth happening much faster than she expected. "<i>Gods that made me wet!  Take me... let\'s fuck right now, please!</i>" she begs.\n\n', false );
				if( CoC.player.hasItem( ConsumableLib.PURPLEG ) ) {
					CoC.player.consumeItem( ConsumableLib.PURPLEG );
					CoC.flags[ kFLAGS.AMILY_HIP_RATING ] += 1 + Utils.rand( 2 );
				} else {
					CoC.player.consumeItem( ConsumableLib.L_PRPEG );
					CoC.flags[ kFLAGS.AMILY_HIP_RATING ] += 2 + Utils.rand( 3 );
				}
				if( CoC.flags[ kFLAGS.AMILY_HIP_RATING ] > 16 ) {
					CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] = 16;
				}
			}
			//(If Amily has 'full, womanly hips':;
			else {
				MainView.outputText( 'She chomps down on the proferred egg, but nothing happens. "<i>Slut\'s body is at its limits ' + CoC.player.mf( 'master', 'mistress' ) + '.  Her huge breeding hips can\'t widen any further.  Would you like to fuck?</i>" she asks, rocking her considerable mass back and forth hypnotically.', false );
				EngineCore.dynStats( 'lus', 4 );
			}
		}
		EngineCore.doNext( this, this.amilyFollowerEncounter );
	};
	/*
	 [Reducto]
	 She wrinkles her nose at the awful smell of the paste you are showing her, even as you explain it's able to shrink down oversized bodyparts, and you can use this to reduce any parts that she thinks are oversized.
	 [Breasts, Nipples, Penis, Butt)
	 Grimacing at the smell - it must be awful, for her sensitive nose - she starts smearing it over the (chosen body part), and you step forward to help her. As the last of it wicks away, the part begins to shrink before your eyes. 'Hmm. Not bad, I guess. So, was there something else you wanted?' She asks.
	 */
	//[Clothes];
	AmilyScene.prototype.giveAmilySomePants = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'You offer her a set of comfortable clothes, asking if she\'d like to wear these instead of her ' + CoC.flags[ kFLAGS.AMILY_CLOTHING ] + ' she\'s wearing.\n\n', false );
		//If you played an early build that didnt initialize clothes.;
		if( CoC.flags[ kFLAGS.AMILY_CLOTHING ] === 0 ) {
			CoC.flags[ kFLAGS.AMILY_CLOTHING ] = 'rags';
		}
		//(If Amily is wearing Tattered Rags:;
		if( CoC.flags[ kFLAGS.AMILY_CLOTHING ] === 'rags' || CoC.flags[ kFLAGS.AMILY_CLOTHING ] === 'sexy rags' ) {
			MainView.outputText( 'Her eyes light up with glee. "<i>Oh, I\'ve always wanted some more clothes! Please, let me have them!</i>" she squeaks with delight as you hand them over, carelessly stripping herself and throwing her old clothes aside before pulling on her new gear. She spins idly in place as she strives to examine how she looks, then she runs off to the stream to get a better view of her reflection.', false );
			CoC.flags[ kFLAGS.AMILY_CLOTHING ] = 'comfortable clothes';
		}
		//(If Amily is wearing anything other than Tattered Rags:;
		else if( CoC.flags[ kFLAGS.AMILY_CLOTHING ] !== 'comfortable clothes' ) {
			MainView.outputText( '"<i>More new clothes? Ooh, you\'re spoiling me, ' + CoC.player.short + '</i>!" she teases you. Unabashed in the slightest at being naked in front of you, she strips down, doing her best to give you a little show as she does so. She then redresses herself in her new offering. "<i>How do I look?</i>" she giggles.\n\n', false );
			MainView.outputText( 'You assure her that she looks beautiful. "<i>Flatterer.</i>" She smirks, and then wanders off to the stream.', false );
		}
		CoC.player.consumeItem( ArmorLib.C_CLOTH );
		EngineCore.doNext( this, this.amilyFollowerEncounter );
	};
	/*
	 //[Lactaid];
	 // TODO: Implement?;
	 AmilyScene.prototype.makeTheMouseAMilkCowMoo = function() {
	 MainView.outputText('', true);
	 MainView.outputText('"<i>Lactaid? You really want to try drinking mouse milk?</i>" Amily asks, a little uncertainly, a little playfully.  You nod and assure that you do.  "<i>Alright, if you insist.</i>" She proclaims, taking the pink bottle from you and drinking the creaminess to be found within.\n\n', false);
	 //(If Amily does not lactate and has smaller than C-cup breasts: It's quite obvious when the lactaid kicks in; her (breastsize + breastdescript) suddenly puff out, swelling into proud C-cup breasts, milk flowing freely from her nipples, leaving her shirt both severely strained and soaked in milk.  She squeaks in dismay, and races away, clearly going to try and clean herself up.);
	 (If Amily does not lactate and has C-cup or bigger breasts  when is this supposed to start- yeek!' She suddenly squeaks in shock as she realizes her shirt is growing damp.  She hastily pulls her top open, grabbing at her dripping breasts.  'I, I just gotta go take care of this." She explains, blushing and then scampering away.
	 (If Amily lactates she pulls her breasts out of her top; she doesn't want to make a mess on herself.  Beads of milk begin to form at the tip of her (nipplesdescript), soon giving way to a steady trickle of fluid.  'More milk for thirsty Champions, hmm?' She teases you.  'I\'m going to go and take care of this...  unless you want to help me now?' She trills.
	 [Yes: Player engages in Suckling sex scene, No: Player stops talking with Amily and returns to camp.]
	 [Dye]
	 You ask if she's ever thought about changing the color of her hair ([horsecock]- fur, you amend yourself/NOTHING AT ALL) - and if she does, you have a possible new color for her to try.
	 She looks contemplative.  'I always did kind of want to try a new look.  Sure, let\'s give it a shot!' She smiles.
	 The two of you head to the stream, where Amily strips down and dives into the water, to ensure she's scrubbed as clean as possible.  When she swims back, you join her in the water's edge, where you open the bottle of dye and begin the long process of massaging it into her ([horsecock] fur.  You worry for a moment that there's not enough to cover her, but, at the end, you manage to make it work/hair).  Helping her wash the excess out with the cool water, you both leave the water, where Amily slowly twirls around to let you admire her new (dyecolor) ([horsecock]fur/'do).  Quite pleased with it herself, she grabs her (clothesdescript) and wanders off back to camp, with you following her.
	 */
	AmilyScene.prototype.amilyHips = function() {
		var desc = '';
		if( CoC.flags[ kFLAGS.AMILY_HIP_RATING ] <= 1 ) {
			if( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] >= 6 ) {
				desc = 'waspish ';
			} else {
				desc = Utils.randomChoice('boyish ', 'tiny ');
			}
		}
		if( CoC.flags[ kFLAGS.AMILY_HIP_RATING ] > 1 && CoC.flags[ kFLAGS.AMILY_HIP_RATING ] < 4 ) {
			if( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] >= 6 ) {
				desc = 'waspish ';
			} else {
				desc = Utils.randomChoice('slender ', 'narrow ', 'thin ');
			}
		}
		if( CoC.flags[ kFLAGS.AMILY_HIP_RATING ] >= 4 && CoC.flags[ kFLAGS.AMILY_HIP_RATING ] < 6 ) {
			desc = Utils.randomChoice('average ', 'normal ', 'plain ');
		}
		if( CoC.flags[ kFLAGS.AMILY_HIP_RATING ] >= 6 && CoC.flags[ kFLAGS.AMILY_HIP_RATING ] < 10 ) {
			desc = Utils.randomChoice('ample ', 'noticeable ', 'girly ');
		}
		if( CoC.flags[ kFLAGS.AMILY_HIP_RATING ] >= 10 && CoC.flags[ kFLAGS.AMILY_HIP_RATING ] < 15 ) {
			desc = Utils.randomChoice('flared ', 'curvy ', 'wide ');
		}
		if( CoC.flags[ kFLAGS.AMILY_HIP_RATING ] >= 15 && CoC.flags[ kFLAGS.AMILY_HIP_RATING ] < 20 ) {
			desc = Utils.randomChoice('fertile ', 'child-bearing ', 'voluptuous ');
		}
		if( CoC.flags[ kFLAGS.AMILY_HIP_RATING ] >= 20 ) {
			desc = Utils.randomChoice('broodmother-sized ', 'cow-like ', 'inhumanly-wide ');
		}
		if(CoC.flags[ kFLAGS.AMILY_HIP_RATING ] >= 15) {
			desc += Utils.randomChoice('flanks', 'flanks', 'hips', 'thighs');
		} else {
			desc += Utils.randomChoice('hips', 'thighs');
		}
		return desc;
	};
	AmilyScene.prototype.amilyButt = function() {
		var desc = '';
		if( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] <= 1 ) {
			desc += Utils.randomChoice('pixie-like ', 'very small ');
		}
		if( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] > 1 && CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] < 4 ) {
			desc += Utils.randomChoice('tight ', 'firm ', 'compact ');
		}
		if( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] >= 4 && CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] < 6 ) {
			desc += Utils.randomChoice('fair ', 'nice ');
		}
		if( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] >= 6 && CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] < 8 ) {
			desc += Utils.randomChoice('handful of ', 'full ', 'shapely ');
		}
		if( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] >= 8 && CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] < 10 ) {
			desc += Utils.randomChoice('squeezable ', 'large ', 'substantial ');
		}
		if( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] >= 10 && CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] < 13 ) {
			desc += Utils.randomChoice('jiggling ', 'spacious ', 'heavy ');
		}
		if( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] >= 13 && CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] < 16 ) {
			desc += Utils.randomChoice('hand-devouring ', 'generous amount of ', 'voluminous ');
		}
		if( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] >= 16 && CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] < 20 ) {
			desc += Utils.randomChoice('huge ', 'vast ', 'jiggling expanse of ');
		}
		if( CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] >= 20 ) {
			desc += Utils.randomChoice('ginormous ', 'colossal ', 'tremendous ');
		}
		desc += Utils.randomChoice('butt', 'ass');
		return desc;
	};
	AmilyScene.prototype.amilyBalls = function() {
		if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] === 0 ) {
			return 'prostate';
		}
		var desc = '';
		desc += Utils.randomChoice('pair of ', 'two ', 'duo of ');
		//size!;
		if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] > 1 && Utils.rand( 3 ) <= 1 ) {
			if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] > 1 && CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] < 2 ) {
				desc += 'large ';
			}
			if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] >= 2 && CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] < 3 ) {
				desc += 'baseball-sized ';
			}
			if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] >= 3 && CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] < 4 ) {
				desc += 'apple-sized ';
			}
			if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] >= 4 && CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] < 5 ) {
				desc += 'grapefruit-sized ';
			}
			if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] >= 5 && CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] < 7 ) {
				desc += 'cantaloupe-sized ';
			}
			if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] >= 7 && CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] < 9 ) {
				desc += 'soccerball-sized ';
			}
			if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] >= 9 && CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] < 12 ) {
				desc += 'basketball-sized ';
			}
			if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] >= 12 && CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] < 15 ) {
				desc += 'watermelon-sized ';
			}
			if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] >= 15 && CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] < 18 ) {
				desc += 'beachball-sized ';
			}
			if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] >= 18 ) {
				desc += 'hideously swollen and oversized ';
			}
		} else if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			desc += 'fuzzy ';
		}
		desc += Utils.randomChoice('balls', 'balls', 'balls', 'balls', 'testicles', 'testicles', 'testes', 'gonads', 'nuts');
		return desc;
	};
	AmilyScene.prototype.amilyTits = function() {
		var temp = Math.random() * 3;
		var descript = '';
		//50% of the time size-descript them;
		if( Utils.rand( 2 ) === 0 ) {
			if( CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] <= 2 ) {
				temp = Utils.rand( 3 );
				if( temp === 0 ) {
					descript += 'small ';
				}
				if( temp === 1 ) {
					descript += 'little ';
				}
				if( temp === 2 ) {
					descript += 'perky ';
				}
			}
			if( CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] > 2 && CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] <= 4 ) {
				descript += 'ample ';
			}
			if( CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] > 4 && CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] <= 6 ) {
				temp = Utils.rand( 4 );
				if( temp === 0 ) {
					descript += 'big ';
				}
				if( temp === 1 ) {
					descript += 'large ';
				}
				if( temp === 2 ) {
					descript += 'pillowy ';
				}
				if( temp === 3 ) {
					descript += 'jiggly ';
				}
			}
			if( CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] > 6 && CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] < 13 ) {
				temp = Utils.rand( 4 );
				if( temp === 0 ) {
					descript += 'basketball-sized ';
				}
				if( temp === 1 ) {
					descript += 'whorish ';
				}
				if( temp === 2 ) {
					descript += 'pornstar-like ';
				}
				if( temp === 3 ) {
					descript += 'jiggling ';
				}
			}
			if( CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] >= 13 ) {
				descript += 'beach-ball sized ';
			}
			if( CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] >= 18 ) {
				temp = Utils.rand( 2 );
				if( temp === 1 ) {
					descript += 'mountainous ';
				} else {
					descript += 'immense ';
				}
			}
		}
		//Nouns!;
		temp = Utils.rand( 10 );
		if( temp === 0 ) {
			descript += 'breasts';
		}
		if( temp === 1 ) {
			if( CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] > 2 ) {
				descript += 'milk-udders';
			} else {
				descript += 'breasts';
			}
		}
		if( temp === 2 ) {
			if( CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] > 1.5 ) {
				descript += 'milky ';
			}
			if( CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] > 4 ) {
				descript += 'tits';
			} else {
				descript += 'breasts';
			}
		}
		if( temp === 3 ) {
			descript += 'breasts';
		}
		if( temp === 4 ) {
			descript += 'tits';
		}
		if( temp === 5 ) {
			descript += 'tits';
		}
		if( temp === 6 ) {
			descript += 'tits';
		}
		if( temp === 7 ) {
			if( CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] >= 1 && CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] < 2.5 ) {
				descript += 'milk jugs';
			}
			if( CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] >= 2.5 ) {
				descript += 'udders';
			}
			if( CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] < 1 ) {
				descript += 'jugs';
			}
		}
		if( temp === 8 ) {
			if( CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] > 6 ) {
				descript += 'love-pillows';
			} else {
				descript += 'boobs';
			}
		}
		if( temp === 9 ) {
			if( CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] > 6 ) {
				descript += 'tits';
			} else {
				descript += 'breasts';
			}
		}
		return descript;
	};
	AmilyScene.prototype.amilyCock = function() {
		var descript = '';
		var descripted = false;
		//Discuss length one in 3 times.;
		if( Math.ceil( Math.random() * 3 ) === 0 ) {
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] < 3 ) {
				descript = 'squat ';
			}
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] >= 3 && CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] < 5 ) {
				descript = 'short ';
			}
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] >= 5 && CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] < 7 ) {
				descript = 'average ';
			}
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] >= 7 && CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] < 9 ) {
				descript = 'long ';
			}
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] >= 10 && CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] < 13 ) {
				descript = 'huge ';
			}
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] >= 13 && CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] < 18 ) {
				descript = 'massive ';
			}
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] >= 18 && CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] < 30 ) {
				descript = 'enormous ';
			}
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] >= 30 ) {
				descript = 'towering ';
			}
			descripted = true;
		}
		//Discuss girth one in 3 times.;
		if( Math.ceil( Math.random() * 3 ) === 0 ) {
			//narrow, thin, ample, broad, distended, voluminous;
			if( CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] <= 0.75 ) {
				descript += 'narrow ';
			}
			if( CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] > 1 && CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] <= 1.4 ) {
				descript += 'ample ';
			}
			if( CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] > 1.4 && CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] <= 2 ) {
				descript += 'broad ';
			}
			if( CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] > 2 && CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] <= 3.5 ) {
				descript += 'fat ';
			}
			if( CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] > 3.5 ) {
				descript += 'distended ';
			}
			descripted = true;
		}
		descript += Utils.randomChoice('cock', 'cock', 'cock', 'cock', 'cock', 'prick', 'prick', 'pecker', 'shaft', 'shaft');
		return descript;
	};
	AmilyScene.prototype.amilyNipples = function() {
		var descripted = false;
		var description = '';
		//Size descriptors 33% chance;
		if( Utils.rand( 4 ) === 0 ) {
			//TINAHHHH;
			if( CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] < 0.25 ) {
				description += Utils.randomChoice( 'tiny ', 'itty-bitty ', 'teeny-tiny ', 'dainty ' );
			}
			//Prominant;
			if( CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] >= 0.4 && CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] < 1 ) {
				description += Utils.randomChoice( 'prominent ', 'pencil eraser-sized ', 'eye-catching ', 'pronounced ', 'striking ' );
			}
			//Big 'uns;
			if( CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] >= 1 && CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] < 2 ) {
				description += Utils.randomChoice( 'forwards-jutting ', 'over-sized ', 'fleshy ', 'large protruding ' );
			}
			//'Uge;
			if( CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] >= 2 && CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] < 3.2 ) {
				description += Utils.randomChoice( 'enlongated ', 'massive ', 'awkward ', 'lavish ', 'hefty ' );
			}
			//Massive;
			if( CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] >= 3.2 ) {
				description += Utils.randomChoice( 'bulky ', 'ponderous ', 'unmanageable ', 'thumb-sized ', 'cock-sized ', 'cow-like ' );
			}
			descripted = true;
		}
		//Milkiness/Arousal/Wetness Descriptors 33% of the time;
		if( Utils.rand( 3 ) === 0 && !descripted ) {
			//Just lactating!;
			if( CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] > 0 ) {
				//Light lactation;
				if( CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] <= 1 ) {
					description += Utils.randomChoice( 'milk moistened ', 'slightly lactating ', 'milk-dampened ' );
				}
				//Moderate lactation;
				if( CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] > 1 && CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] <= 2 ) {
					description += Utils.randomChoice( 'lactating ', 'milky ', 'milk-seeping ' );
				}
				//Heavy lactation;
				if( CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] > 2 ) {
					description += Utils.randomChoice( 'dripping ', 'dribbling ', 'milk-leaking ', 'drooling ' );
				}
			}
		}
		//Nounsssssssss*BOOM*;
		description += Utils.randomChoice( 'nipple', CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] < 0.5 ? 'perky nipple' : 'cherry-like nub',
			CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] >= 1 && CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] >= 1 ? 'teat' : 'nipple',
			CoC.flags[ kFLAGS.AMILY_LACTATION_RATE ] >= 1 && CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] >= 1 ? 'teat' : 'nipple',
			'nipple' );
		return description;
	};
	//Oral;
	AmilyScene.prototype.corruptAmilyOralSuckOff = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( '"<i>Come and suck me off,</i>" you order. Amily wastes no time and scrambles to nuzzle your crotch affectionately', false );
		//[(if PC has a pussy);
		if( CoC.player.hasVagina() ) {
			MainView.outputText( '; getting some of your juices on her ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'muzzle' : 'lips'), false );
			if( CoC.player.balls > 0 ) {
				MainView.outputText( ' and ', false );
			}
		} else if( CoC.player.balls > 0 ) {
			MainView.outputText( '; ', false );
		}
		if( CoC.player.balls > 0 ) {
			MainView.outputText( 'tickling your balls with her ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'fur' : 'skin'), false );
		}
		MainView.outputText( '.  She rubs her head all over your crotch, making sure to catch as much of your musk as possible; as well as exciting you further. Finally when she\'s done she begins saying, "<i>Thank you for allowing this worthless cunt to taste your wonderful essence, my ' + CoC.player.mf( 'master', 'mistress' ) + '.</i>" Amily gives your shaft a small lick and then continues, "<i>Blessed be, oh great Marae, for granting this slutty cumdumpster mercy and allowing me to have and serve my ' + CoC.player.mf( 'master', 'mistress' ) + ' so fully. Amen.</i>"  ', false );
		MainView.outputText( 'With that said, she grins widely and dives into her task, brutally shoving as much of your shaft into her mouth as she can.', false );
		//[(if PC is huge);
		if( CoC.player.cockArea( 0 ) > 61 ) {
			MainView.outputText( '  However, even she has her limits. At one point Amily\'s throat just can\'t take in any more of you, and the rest of your shaft is left out of her mouth. She\'s determined to take in all of you however; and keeps trying to push more of your shaft inside, until you get tired of waiting and tell her to just start bobbing like a good slut. She immediately complies.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'Amily\'s skills have been honed to near perfection.  She is familiar with your ' + Descriptors.cockDescript( 0 ) + ' and is able to massage every single sensitive spot on your cock. Every time she bobs her head, she slurps noisily on your shaft and rakes her teeth teasingly; always careful so she won\'t hurt this most precious part of her ' + CoC.player.mf( 'master', 'mistress' ) + '.\n\n', false );
		//NO TEETH! OW;
		MainView.outputText( 'It only takes a while to drive you near the edge of an orgasm, yet the final push never comes. When you look down you see Amily looking at you mischievously. It looks like she wants to play... She wants you to take her head in your grasp and give her a good face fucking. You smile wickedly at her and say, "<i>Very well, you clever little bitch.</i>" You see Amily\'s eyes light up with happiness as you roughly grab her ears and begin to give her the fucking she yearns for. You pay no heed to the pain you might be causing her, not that it looks like she\'s in any pain. All that escapes her mouth are happy moans and muffled screams of pleasure; voicing to the world how much she enjoys being roughly fucked by you.  If anything, she seems to be thinking of how great it is to be abused and used by you like the cumslut she is.\n\n', false );
		MainView.outputText( 'Now in control, you quickly feel your', false );
		//[(if PC has balls);
		if( CoC.player.balls > 0 ) {
			MainView.outputText( ' balls churn and your', false );
		}
		MainView.outputText( ' ' + Descriptors.cockDescript( 0 ) + ' throb one last time before saying, "<i>Here\'s your reward, bitch.</i>" Then you explode deep into her throat, much to her pleasure.', false );
		//[(if PC has big cum amount);
		if( CoC.player.cumQ() >= 1000 ) {
			MainView.outputText( '  Her belly distends and doesn\'t stop distending, nor does the flow of your cum ebb. For Amily, this is her purpose in life, to serve as a receptacle for your lusts, to serve you like a good cumbucket and take every little drop you pour into her. That thought only makes you cum harder.', false );
		}
		MainView.outputText( ' Finally, the flow of cum ebbs; Amily rubs her distended belly and inhales sharply, pulling back slightly. With a brutal thrust, she blows on your cock; sending a shock of pleasure running through you and milking a few more spurts of cum. Now completely spent, you pull back; Amily tries to keep your cock inside her mouth by sucking on it with all her might, but it\'s useless. With a <b>POP</b> you pull your ' + Descriptors.cockDescript( 0 ) + ' free of Amily\'s hungry jaws; it is clean, without a single trace of cum and barely any spit on it. You look at Amily and she looks back, smiling happily and licking her lips. "<i>Thank you for the meal, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she says before a small burp escapes her. You pat her on the head, get dressed, and leave Amily, satisfied with her good work.', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', 1, 'cor', 1 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	AmilyScene.prototype.corruptAmilyLickPussiesLikeAPro = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		//[Oral sex];
		//Herms pick if Amily gets to lick them or blow them.;
		MainView.outputText( '"<i>It\'s time to eat,</i>" you declare and Amily instantly perks up after hearing it. You remove the lower half of your ' + CoC.player.armorName + ' and thrust your crotch at Amily; displaying your quickly ', false );
		if( CoC.player.hasCock() ) {
			MainView.outputText( 'hardening ' + Appearance.cockNoun( CoC.player.cocks[ 0 ].cockType ) + ' and ', false );
		}
		MainView.outputText( 'moistening ' + Descriptors.vaginaDescript() + '. Amily watches as if mesmerized, drool escaping her mouth as she licks her lips in anticipation.\n\n', false );
		//[=Pussy=];
		MainView.outputText( 'You spread your pussy lips, ', false );
		//[(if squirter);
		if( CoC.player.wetness() >= 5 ) {
			MainView.outputText( 'and a jet of fluids shoots out of your sensitive pussy.', false );
		} else {
			MainView.outputText( 'moisture wetting your finger.', false );
		}
		MainView.outputText( 'You grin at Amily and say, "<i>What are you waiting for?</i>" Amily grins back and rushes forward to bury her nose into your ' + Descriptors.vaginaDescript() + ', inhaling as much of your scent as she can.\n\n', false );
		MainView.outputText( 'Amily\'s cold nose sends a chill of pleasure coursing through you, and you reward Amily\'s initiative with a small stream of juices that stick to her nose', false );
		//, [(if PC has a cock);
		if( CoC.player.hasCock() ) {
			MainView.outputText( ', your cock springing up into attention', false );
			if( CoC.player.balls > 0 ) {
				MainView.outputText( ' and ', false );
			}
		}
		//[(if PC has balls);
		if( CoC.player.balls > 0 ) {
			if( !CoC.player.hasCock() ) {
				MainView.outputText( ', ', false );
			}
			MainView.outputText( 'your ' + Descriptors.ballsDescriptLight() + ' gently resting atop her head, supported by her small horns', false );
		}
		MainView.outputText( '.  She moves her head back, a thin strand of girlcum linking her nose to your ' + Descriptors.vaginaDescript() + '.  Amily ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'licks' : 'wipes') + ' her nose ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'off and licks it all up' : '') + ', savoring the taste of the juices, "<i>Wonderful, mistress, just wonderful,</i>" Amily grins; then she bows and says, "<i>Thank you for allowing this worthless cunt to taste your wonderful essence, my mistress.</i>"  She gives your clit a quick lick and continues, "<i>Blessed be, oh great Marae.  For granting this slutty cumdumpster mercy and allowing me to have serve my ' + CoC.player.mf( 'master', 'mistress' ) + ' so fully.  Amen.</i>" With that said, she licks her lips, ', false );
		//[(if PC has balls);
		if( CoC.player.balls > 0 ) {
			MainView.outputText( 'lifts your ' + Descriptors.ballsDescriptLight() + ' to set them gently atop her head, ', false );
		}
		MainView.outputText( 'then she dives into her task.\n\n', false );
		MainView.outputText( 'Amily excitedly slathers your netherlips with her saliva, licking all around your ' + Descriptors.vaginaDescript() + '; every once in a while she\'ll stop her ministrations to give your ', false );
		if( CoC.player.balls > 0 ) {
			MainView.outputText( 'balls', false );
		} else {
			MainView.outputText( Descriptors.clitDescript(), false );
		}
		MainView.outputText( ' a quick kiss.  You pat her head, letting her know you\'re pleased with her ministrations, but also urging her to get on with it and start eating you out properly.  The silent order does not go unnoticed and Amily plunges her tongue as far into your love-hole as she can' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? '; her fur tickles your labia pleasurably' : ''), false );
		//[(if PC has balls);
		if( CoC.player.balls > 0 ) {
			MainView.outputText( ' and her small horns gently massage your ' + Descriptors.ballsDescriptLight(), false );
		}
		//[(if PC has a cock);
		if( CoC.player.hasCock() ) {
			MainView.outputText( '; ' + Descriptors.sMultiCockDesc() + ' throbs and begins leaking pre; it forms small rivulets that run down onto Amily\'s head', false );
		}
		MainView.outputText( '.  The ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'mousette' : 'succubus') + ' jumps slightly and you can almost imagine her grinning as she eats out her meal.\n\n', false );
		MainView.outputText( 'You wonder, just how has Amily been practicing her pussy eating skills - she\'s really good at this, and her intimate knowledge of your insides combined with her agile tongue means she can lick your special spot frequently.  Each time her tongue brushes over your g-spot, you reward her with increasingly bigger streams of femcum.  Amily remains in a constant rhythm, and while it is pleasurable you\'re going to need more if you\'re to ever reach orgasm; when you look down to order her to get serious you see she\'s looking back at you with a mischievous look; you giggle and say, "<i>So that\'s how it\'s gonna be huh? Clever little bitch.</i>"\n\n', false );
		// More [Horsecock];
		MainView.outputText( 'You move back and push Amily back into the ground, she hits the ground with a <b>THUD</b> and grins at you.  You move quickly, sitting on top of Amily\'s face and beginning using her mousy ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'muzzle' : 'nose') + ' like a dildo, rubbing it all over your pussy; her tongue darts out to give little licks and enhance your pleasure.\n\n', false );
		//(if PC is loose enough [Horsecock] and has a muzzle to fuck with);
		if( CoC.player.vaginalCapacity() >= 45 && CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'You giggle and decide to take things one step further; you shove Amily\'s muzzle into your ' + Descriptors.vaginaDescript() + '; Amily\'s eyes bulge with surprise once she feels her muzzle begin to slide inside you and you voice your pleasure with a long moan, "<i>I\'m not letting you breathe until you make me come, slut.</i>"  With those words, you begin rising and lowering yourself into Amily\'s muzzle; her tongue darts out to taste your walls once in a while, but most of the time your clenching vagina keeps her muzzle shut, so Amily settles for muzzle-fucking you like the good little cumslut slave she is.\n\n', false );
		} else {
			// BEGIN [Horsecock];
			MainView.outputText( 'You giggle and decide to take things one step further; you ', false );
			if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
				MainView.outputText( 'hold Amily\'s muzzle tightly closed and shove Amily\'s muzzle against your ', false );
			} else {
				MainView.outputText( 'bury her nose as far as it will go into your ', false );
			}
			MainView.outputText( Descriptors.vaginaDescript() + ' , holding her ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'nose' : 'mouth') + ' closed; Amily\'s eyes bulge with surprise and you voice your pleasure with a long moan, "<i>I\'m not letting you breathe until you make me come slut. </i>" With those words, you begin frigging yourself against Amily\'s ', false );
			MainView.outputText( ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'mousy muzzle' : 'face') + ', intent on driving yourself to orgasm as you feel her cheeks bulge with air and need.\n\n', false );
			// END [Horsecock];
		}
		//Both variations link here;
		MainView.outputText( 'Amily\'s rather desperate and eager ministrations are effective and you feel yourself on the edge of orgasm.  ', false );
		//[(if PC is loose enough);
		if( CoC.player.vaginalCapacity() >= 45 ) {
			MainView.outputText( 'You pull yourself off Amily\'s ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'muzzle' : 'face') + ' and moan deeply.', false );
		} else {
			MainView.outputText( 'You let go of Amily\'s ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'muzzle' : 'face') + ' and moan deeply.', false );
		}
		MainView.outputText( '  Amily gasps for air, just in time to receive a faceful of your girlcum; she quickly latches her mouth onto your ' + Descriptors.vaginaDescript() + ', sealing it to avoid losing any more of your delicious juices; and you\'re more than happy to feed her as much as you can. Amily never stops drinking, though some droplets inevitably escape her and splatter against her wet face. Once you\'re done you rise and look down at your handywork.\n\n', false );
		MainView.outputText( 'Amily coughs, but gathers as much of your spilled juice as she can and licks if off her hands.  When she\'s settled down, you look at her, as if waiting for something.  "<i>Oh! Of course, forgive me mistress,</i>" Amily says, quickly scrambling up onto her knees to begin licking your pussy and thighs clean. Once you\'re satisfied, you get dressed and walk away.  "<i>Mistress!</i>" Amily calls out to you; you turn to see the smiling corrupt mousette rubbing her belly and licking her lips.  "<i>Thank you for the wonderful meal.</i>"\n\n', false );
		MainView.outputText( 'You chuckle and dismiss her with a wave.', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -1, 'cor', 1 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Corrupt scissortastrophie!;
	AmilyScene.prototype.corruptAmilyScissorsLikeAPro = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You grin as an interesting idea comes to your mind; you order Amily to lay down and spread her legs; she complies and you undress and gently set yourself between her legs, aligning your pussy with hers,', false );
		//[(if Amily has a cock);
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( ' Amily\'s ' + this.amilyCock() + ' throbs,', false );
		}
		MainView.outputText( ' and she smiles once she gets what you want to do.\n\n', false );
		MainView.outputText( 'You examine Amily\'s crotch closely, ', false );
		//[(if Amily has a cock);
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( 'idly stroking her ' + this.amilyCock(), false );
			//(if Amily has balls);
			if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] > 0 ) {
				MainView.outputText( ' and ' + this.amilyBalls() + ', which you shift to reveal her ', false );
			} else {
				MainView.outputText( ' before dipping down to her ', false );
			}
		} else {
			MainView.outputText( 'eyeing her ', false );
		}
		MainView.outputText( Descriptors.vaginaDescript() + '.  You lift a hand and stroke the slutty box with your fingers.  It doesn\'t take long before she is wet and ready, her little clit poking out as stiff as a cock', false );
		//[(if Amily has a cock);
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( ' almost as if trying to match its bigger brother above', false );
		}
		MainView.outputText( '. You give Amily a smirk as you take your lubricant-wet hand and begin to massage her juices into your own ' + Descriptors.vaginaDescript() + '.  "<i>Do you like it when I play with your cunt, slut?</i>" you ask her.\n\n', false );
		MainView.outputText( '"<i>Oh, Mistress... I love being your plaything,</i>" Amily replies, her spade tipped tail gently coiling around your ' + CoC.player.leg() + ' to tease your ' + Descriptors.vaginaDescript() + '.  "<i>Let me pleasure you, let me worship you, let me serve you, mistress.</i>"  With a diabolic grin, you sink down on top of your rodent sex-slave, giving her ' + this.amilyTits() + ' a good squeeze to emphasise it.  "<i>Well then, let\'s see how well you can do. Lie back and let me enjoy myself, slut.</i>"\n\n', false );
		MainView.outputText( 'Amily does as you order and with a little flick against your ', false );
		//[(ballsDescript);
		if( CoC.player.balls > 0 ) {
			MainView.outputText( Descriptors.ballsDescriptLight(), false );
		} else if( CoC.player.hasCock() ) {
			MainView.outputText( Descriptors.cockDescript( 0 ), false );
		} else {
			MainView.outputText( Descriptors.clitDescript(), false );
		}
		MainView.outputText( ' her tail uncoils and goes to her mouth so she can suckle the tip.\n\n', false );
		MainView.outputText( 'Making sure her legs are spread wide to receive you ', false );
		//[(if Amily has a cock);
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( 'and her cock ', false );
		}
		MainView.outputText( 'is tipped out of the way ', false );
		MainView.outputText( ', you slowly lower your ' + Descriptors.vaginaDescript() + ' to that of Amily\'s. You\'re not entirely sure how well scissoring will work when she is the submissive and you are the dominant... but you can sure have some fun trying!\n\n', false );
		MainView.outputText( 'Amily moans', false );
		//[(if Amily's a squirter);
		if( CoC.flags[ kFLAGS.AMILY_VAGINAL_WETNESS ] >= 5 ) {
			MainView.outputText( ' and a jet of warm juices splashes against your ' + Descriptors.vaginaDescript(), false );
		}
		// [Horsecock];
		MainView.outputText( '; her ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'claws' : 'feet') + ' curl in pleasure and she begins panting, eager to pleasure you and enjoying being used so. Amily looks at you, awaiting your next move or command with lusty eyes; you grin and wonder how much teasing she can take before she starts begging for release. You rub Amily\'s little wethole with your own gently, barely touching and taking care to ensure your clit pokes hers; Amily moans in pleasure, but you can see this is not enough to get her to cum. Still you continue with your light teasing until Amily says, "<i>Please mistress! I-I need... I can\'t... Ah!</i>"\n\n', false );
		MainView.outputText( 'Watching the slutty little succu-mouse buck and writhe under you is so fun, but you\'ve got a needy pussy', false );
		if( CoC.player.hasCock() ) {
			MainView.outputText( ' and an aching ' + Descriptors.cockDescript( 0 ), false );
		}
		MainView.outputText( ' to sate, so it\'s time for things to get heavy. "<i>You need, slut? What about what I need, hmm? Will you let me do whatever I want to you if I help you get off, hmm?</i>" you tease her. Amily gasps in realization and says, "<i>Forgive your worthless fucktoy mistress. Of course your pleasure comes first. I-I\'ll pleasure however you like, without cumming if you will forgive me mistress.</i>"\n\n', false );
		MainView.outputText( 'You give her a patronizing smile and then pat her gently on the head. "<i>There, there, my little slut; it\'s all right. After all, how can you be expected to think about anything other then sex? That\'s not what you\'re made for - you\'re my little sextoy. I made you to fuck and fuck; and that\'s what you\'re going to do.</i>" You smile sweetly, then finally lower your pussy back to her own now-sopping fuckhole. It squelches and slurps as your netherlips mesh together, her little clit rubbing against your own ' + Descriptors.clitDescript() + ' in a way that sends the most delightful tingles of pleasure racing through your lips. Smiling fiercely, you begin to squeeze and fondle her big mouse-tits, feeling their weight, their delightfully grippable balance between softness and firmness, even as you start to rock back and forth.\n\n', false );
		// [Horsecock];
		MainView.outputText( '"<i>Thank you so much mistress! I love to fuck! I love to be fucked! I love to be used! I love being your sextoy! I love the way your pussy feels against mine! I love you, mistress!</i>" Amily screams as an orgasm rocks her. She presses against you with all her strength, legs wrapping themselves around you, ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'claws' : 'feet') + ' curled in pleasure, eyes rolled back.', false );
		//[(if Amily's a squirter);
		if( CoC.flags[ kFLAGS.AMILY_VAGINAL_WETNESS ] >= 5 ) {
			MainView.outputText( '  A veritable jet of juices shoots up, splashing against your netherlips, some of it even making it inside.', false );
		} else {
			MainView.outputText( '  Wet squeltches and splats resound around you, as the results of Amily\'s orgasm flood what little space remains between the two of you.', false );
		}
		//[(if Amily has a cock);
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( ' Her ' + this.amilyCock() + ' throbs and cum splashes on her breasts and face.', false );
		}
		MainView.outputText( '\n\n', false );
		// [Horsecock];
		MainView.outputText( 'You grin wickedly; the former puritan ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'mouse' : '') + ', now turned into another horny little beast, your horny little beast. The irony is so delicious... but not as delicious as the feelings she\'s eliciting inside you. You grind, hump, and thrust, brutally shoving your pelvises together, craving the friction and almost feeling upset with the copious amounts of femcum helping you slide back and forth. Amily\'s grinds against you even as you viciously attack her, riding out her orgasm as well as trying to pleasure you. Her tail pokes your ' + Descriptors.hipDescript() + ' as it seeks entry between your tightly mashed pussies; eventually it manages to do so and it slowly snakes itself in and out, the tip flicking against your clit and providing the additional friction to bring you ever closer to the edge.', false );
		//[(if PC has a cock);
		if( CoC.player.hasCock() ) {
			MainView.outputText( '  Amily\'s hands shoot out to grab ' + Descriptors.sMultiCockDesc() + ' and begin masturbating you; the corrupt succu-mouse doing all she can to give you the release that you crave.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( '"<i>Yes! Good little toy - you are good at this!</i>" you tell her, unable to think clearly. You can feel your orgasm coming, but all that comes out of your mouth is a wordless howl of pleasure as the ecstasy thunders through your loins and out, riding the crescendo in a storm of femcum that spews from your ' + Descriptors.vaginaDescript(), false );
		//[(if PC's a squirter);
		if( CoC.player.wetness() >= 5 ) {
			MainView.outputText( ', drenching Amily\'s body in your fluids and marking her quite emphatically as your property', false );
		}
		MainView.outputText( '.\n\n', false );
		// [Horsecock] - Someone missed the 'mouse'. - Harb;
		MainView.outputText( 'Amily goes limp while your juices continue dripping on her.  She pants as she looks at you with mixed desire and adoration, moving into a kneeling position to say, "<i>Thank you for letting this worthless cumslut pleasure you.</i>" You just smirk at her before reaching down to scoop up some of the pooled sexual fluids.  You plaster it in a crude pattern onto the ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'mouse' : 'succubi') + '\'s ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'muzzle' : 'face') + '. "<i>Never forget; you belong to me, my little toy,</i>" you tell her. Then, feeling generous, you decide to give her the honor of your kiss, tongue fiercely probing to help emphasize that Amily is yours. Then, standing up, you see the state you are in and frown. "<i>Clean me off, slut; I don\'t need to be reeking of juices all day,</i>" you order her imperiously.\n\n', false );
		MainView.outputText( 'Amily beams with happiness, "<i>Yes mistress!</i>" then proceeds to clean you up, licking every single drop she can out of your body.  To finish it all up, she licks your ' + CoC.player.feet() + ' clean of whatever juices remained on them. Satisfied, you dismiss Amily with a wave, heading back to the camp, while Amily rubs the results of your coupling on her body.', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -1, 'cor', 1 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Fuck corrupt Amily's pussaaaaaayyyyy;
	AmilyScene.prototype.corruptAmilysPussyGetsMotherfuckingFucked = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You tell Amily that you\'re feeling playful and tell her you\'d like to do some role-playing; you tell Amily to play the role of a demon out to seduce you. "<i>But I could never do that ' + CoC.player.mf( 'master', 'mistress' ) + ', the only role I\'m fit for is being your adoring slave!</i>"\n\n', false );
		MainView.outputText( 'You grin and tell her she should at least try. Amily smiles and replies, "<i>If that\'s what you want ' + CoC.player.mf( 'master', 'mistress' ) + ', I\'d be glad to try,</i>" Before starting, you tell Amily to try and act like a real demon.\n\n', false );
		MainView.outputText( 'You tell Amily to spread her legs and begin undressing, peeling off your ' + CoC.player.armorName + ' piece by piece. Amily doesn\'t even bother to speak to you; she simply grins in delight, moisture already beginning to flow from her gaping pink vagina.\n\n', false );
		//(If pregnant:;
		if( this.pregnancy.event >= 3 ) {
			MainView.outputText( '  Her gravid state doesn\'t faze her; indeed, she thrusts her bump forward proudly, a visible sign of your mastery over her.', false );
		}
		MainView.outputText( '  She flops down onto her ' + this.amilyButt() + ' and rolls backwards, spreading her legs out eagerly for you to have access and waving them like hungry, groping limbs, reaching for you in her impatience to start.  You grin in delight, but decide to tease the slutty ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'mousette' : 'succubus') + ' by staying just out of the reach of her ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'foot-claws' : 'shapely feet') + '.  "<i>If you want it, then tell me just how much you want it slut,</i>" you tease her mockingly, stroking your ' + Descriptors.cockDescript( 0 ) + ' into erection. ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? ' Just watch the heels, and don\'t dare injure your master.' : ''), false );
		//[(if PC has a vagina);
		if( CoC.player.hasVagina() ) {
			MainView.outputText( '  Your other hand probes your moist fuck-hole for lube to help with your stroking.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'Amily doesn\'t even roll her eyes, she is that much of a helplessly loyal slut for you. "<i>I want it, ' + CoC.player.mf( 'master', 'mistress' ) + '! I want it more than anything else! I\'m a cum-dumpster, a baby factory - I need cum in my hungry pussy, or I\'ll just fade away! Please, ' + CoC.player.mf( 'master', 'mistress' ) + ', pump me full of your hot, salty, gooey cum!', false );
		//(If not pregnant:;
		if( !this.pregnancy.isPregnant ) {
			MainView.outputText( '  I want you to fuck me full of cum, bloat me with seed until I\'m a ball of skin over spooge with a head and limbs sticking out! I need to be full and round with the very stuff of life; fucking cum into me, ' + CoC.player.mf( 'master', 'mistress' ) + '!', false );
		}
		//(If pregnant:;
		else {
			MainView.outputText( '  The babies need their cum, ' + CoC.player.mf( 'Master', 'Mistress' ) + '. They won\'t grow strong and healthy and slutty if you don\'t flood their womb with your hot baby-making juice! Please, cum and fill me with cum, for their sake?', false );
		}
		MainView.outputText( '</i>"\n\n', false );
		MainView.outputText( 'It pleases you to see how much of a eager bitch she really is. You step close and take hold of her hip, then further tease her by rubbing your shaft along her slit, slickening it with her juices.', false );
		//[(if Amily has balls);
		if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] > 0 ) {
			MainView.outputText( '  Her balls do get in the way, but they form a nice cushion to rub your ' + Descriptors.cockDescript( 0 ) + ' on, further stimulating you.', false );
		}
		MainView.outputText( '  Amily squeals in glee and wraps her legs around your ' + Descriptors.hipDescript() + '. She is too well-trained to use them to slam you into her crotch, but you can feel the muscles in them quivering with the urge to pull you into proper penetrative position. You smile wickedly; as much as you want to plow her depths and fuck her raw, you also want to see just how far you can go before she breaks... "<i>' + CoC.player.mf( 'Master', 'Mistress' ) + '... please... why are you torturing yourself? Give yourself over to your loving mousy slut; lose yourself between my legs, let my needy cunt swallow your ' + Descriptors.cockDescript( 0 ) + ' and milk you as only I can. No two-bit whore of a succubus will ever bring you the pleasure I will...</i>" Amily moans pleadingly, her tail rising up to caress your ' + Descriptors.assDescript() + ', her hands playing with her ' + this.amilyTits() + '.\n\n', false );
		MainView.outputText( '"<i>Torturing myself you say? I think you\'re right. Maybe I should see if ', false );
		//[(if Jojo's corrupt);
		if( SceneLib.jojoScene.monk >= 5 && CoC.flags[ kFLAGS.JOJO_DEAD_OR_GONE ] === 0 ) {
			MainView.outputText( 'Jojo wants to play,', false );
		}
		//(else);
		else {
			MainView.outputText( 'I can\'t find someone else to play with,', false );
		}
		MainView.outputText( '</i>" you say, nonchalantly attempting to pull away from her. "<i>No!</i>" Amily screams; her legs tighten about your waist with such force that she actually lifts herself off of the ground in her eagerness to plant herself firmly against your crotch, rubbing her slavering pussy against you. "<i>Mine! My fuck! Mine!</i>" she squeaks indignantly. You laugh at how far you\'ve pushed your little mouse slave.  Sliding your ' + Descriptors.cockDescript( 0 ) + ' against her pussy, you bend down and grope her breasts roughly, drawing a desperate moan from her; slowly you get closer to her ears, then whisper, "<i>Go ahead,</i>" while humping against her to further excite her.\n\n', false );
		//(If PC is Huge);
		if( CoC.player.cockArea( 0 ) >= 61 ) {
			MainView.outputText( 'She quivers with tension; for a moment, you think she\'s going to kiss you in gratitude. But then, instead, she remembers her place and pushes backward, her tail awkwardly coiling around your ' + Descriptors.cockDescript( 0 ) + ' and pulling on it to clumsily maneuver it into place. You can feel the heat emanating from her juicy cunt as the tip brushes against its lips, but no matter how much she pushes, she just can\'t seem to get it in. She pushes and grinds against your ' + Descriptors.cockDescript( 0 ) + ' with all her might, with no regards if she hurts herself in the process. You decide to stop her before she does something irreversible. "<i>F-Forgive me ' + CoC.player.mf( 'master', 'mistress' ) + '. This slut\'s useless cunt is unfit for your glorious ' + Descriptors.cockDescript( 0 ) + ', ' + CoC.player.mf( 'master', 'mistress' ) + '.</i>" You pat her in the head and tell her that someday, perhaps, she will be able to take all of you in, but for now she should take it slow. You grind against her, lubing up your ' + Descriptors.cockDescript( 0 ) + ' as well as you can, and stretching her bit by bit. Then with a bit of effort you finally manage to get some if it inside. "<i>See? This is how you get a huge cock inside you Amily,</i>" you tell her. "<i>You truly are most wise ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" Amily comments. You smile and say, "<i>Now get back in character slut,</i>" giving her ass a good slap.\n\n', false );
		} else {
			MainView.outputText( 'She quivers with tension; for a moment, you think she\'s going to kiss you in gratitude. But then, instead, she remembers her place and pushes backward, her tail awkwardly coiling around your ' + Descriptors.cockDescript( 0 ) + ' and pulling on it to clumsily maneuver it into place. You can feel the heat emanating from her juicy cunt as the tip brushes against its lips, seconds before, with a squeal of triumph, she brutally impales herself upon you. You can\'t help but moan in pleasure; despite all the teasing you really needed this. Her insides are warm and wet, just the way you like it.', false );
			if( CoC.flags[ kFLAGS.AMILY_VAGINAL_WETNESS ] >= 5 ) {
				MainView.outputText( '  Jets of fluid wash down whatever pre escapes your rigid tool.', false );
			}
			MainView.outputText( '  You have half a mind to brutalize the mousette then and there; yet for now you decide to let Amily have her way. She has earned this small reward for amusing you.', false );
			MainView.outputText( '\n\n', false );
		}
		MainView.outputText( 'Amily thrusts and bucks against you; trying her best to impale herself upon you. But in her current position, her attempts are clumsy at best. Disappointed by her failure to properly serve you, you pin her down against the dirt, twisting one of her nipples painfully and grabbing her hair roughly. "<i>This is not good enough cumslut. What do you have to say for yourself?</i>" you ask her calmly, but threateningly. "<i>Forgive me, ' + CoC.player.mf( 'master', 'mistress' ) + '! But this worthless slut doesn\'t know how to better please you... Please! Show me how to please you, ' + CoC.player.mf( 'master', 'mistress' ) + '!</i>" she begs you, not sounding at all frightened of you, nor in pain from your rough treatment; all you see in her eyes is lust and an overwhelming desire to please you and be fucked by you...\n\n', false );
		//both variants link here;
		MainView.outputText( 'You grin at her answer. You\'ll show her just how to properly pleasure you... You let go of her and grab her full thighs, flipping her knees above her head. Amily gasps and smiles at you; then you begin forcefully pounding her, doing your very best to fuck her raw; ' );
		if( CoC.player.balls > 0 ) {
			MainView.outputText( 'your balls slap against her butt and ' );
		}
		MainView.outputText( 'her tail thrashes about behind you. You grunt and pant; quickly nearing orgasm. Your ' + Descriptors.cockDescript( 0 ) + ' throbs and leaks copious quantities of pre. "<i>Oh, yes, yes, yes! Give it to me, ' + CoC.player.mf( 'master', 'mistress' ) + '! That\'s what your little slut deserves - fuck her hard and raw! Hurt me good, teach me what a bad girl I was!</i>" Amily squeals in lustful joy, rutting as hard with you as you are with her.', false );
		//(if Amily is herm:;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( '  Her ' + this.amilyCock() + ' slices through the air like a fleshy knife, that stiff with blood and pleasure.', false );
		}
		//(If Amily is squirter:;
		if( CoC.flags[ kFLAGS.AMILY_VAGINAL_WETNESS ] >= 5 ) {
			MainView.outputText( '  Although she has yet to climax, her cunt is already bubbling and frothing madly around your ' + Descriptors.cockDescript( 0 ) + ', causing you to squelch and slurp loudly with each thrust in and out of her wet depths. She\'s like a pot of sexual fluids on the boil, just waiting to geyser forth. All she needs is a little more encouragement.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'You feel it\'s time to end this. With one last vicious thrust, you cause Amily to dig slightly into the floor and cum. Painting her walls all the way to her womb, you unload.  Even her cervix is unable to stop the torrent you unleash upon her.', false );
		//[(If Amily is pregnant);
		if( this.pregnancy.isPregnant ) {
			MainView.outputText( '  You wonder if your unborn children will appreciate their bath. Their mother certainly does.', false );
		}
		//(If not squirter:;
		if( CoC.flags[ kFLAGS.AMILY_VAGINAL_WETNESS ] < 5 ) {
			MainView.outputText( '  Her fluids slop wetly over your crotch, painting between your legs with her lubricant.', false );
		}
		//(If squirter:;
		else {
			MainView.outputText( '  A cascade of fluids pours from inside her; if you had allowed her to ride atop you, you\'d be sopping with her femcum.', false );
		}
		//(If Amily is herm:;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( '  It doesn\'t take long - seconds, at most - before her pulsing, twitching cock finally explodes, spewing gush after gush of herm-spunk all over her tits and face, which Amily eagerly laps up.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'You orgasm finally ends.', false );
		//[(if PC has large cum amount);
		if( CoC.player.cumQ() >= 1000 ) {
			//(if Amily is not pregnant);
			if( !this.pregnancy.isPregnant ) {
				MainView.outputText( '  Amily\'s womb is so full of cum that it\'s bloated as if she was carrying a full litter of mousy sluts ready to birth.', false );
			}
			//(else);
			else {
				MainView.outputText( '  Amily\'s belly looks ready to explode; besides the litter she\'s carrying, you\'ve also filled her with enough cum to feed the little mousy sluts for week.', false );
			}
		}
		MainView.outputText( '  Spent, you slump on top of Amily.', false );
		//[(if PC has a pussy);
		if( CoC.player.hasVagina() ) {
			MainView.outputText( '  Despite being neglected during the act, your ' + Descriptors.vaginaDescript() + ' leaks fluids to join Amily\'s on the floor.', false );
		}
		MainView.outputText( '  Amily pants loudly and sighs in satisfaction. Hesitantly, one hand dares to reach out and stroke your ' + CoC.player.face() + '. "<i>Mmm... You are the light of my world, ' + CoC.player.mf( 'master', 'mistress' ) + '.', false );
		//(if not pregnant:;
		if( !this.pregnancy.isPregnant ) {
			MainView.outputText( '  I can only hope you\'ve knocked me up, so I can do what I was made for,', false );
		} else {
			MainView.outputText( '  I almost wish I wasn\'t pregnant, just so I could have the pleasure of knowing you\'ve knocked me up,', false );
		}
		MainView.outputText( '</i>" she tells you softly.\n\n', false );
		MainView.outputText( 'You feel like you should scold her for acting tender with you. She is your fucktoy mouse slut, not your lover. But she did do a good job of pleasuring you; so you decide to let it slide this time.\n\n', false );
		MainView.outputText( 'Once you\'ve regained your breath you get up, extracting yourself from Amily\'s embrace. She gets up herself, a bit embarrassed by the way she acted. "<i>Did I please you ' + CoC.player.mf( 'master', 'mistress' ) + '?</i>" she asks, awaiting your judgement expectantly. You smile and pat her head, telling her yes; she did please you. You comment that her theatrics weren\'t so bad.  She smiles and replies, "<i>Thank you ' + CoC.player.mf( 'master', 'mistress' ) + '. I loved this little play of ours... My favorite part was when I got used like a cocksleeve bitch in heat.</i>" she says adoringly. You rub her hair and tell her she still has a job to do. Amily gasps and says, "<i>Of course, forgive me ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>", and then she begins licking your ' + Descriptors.cockDescript( 0 ) + ' clean.', false );
		//[(if PC has a pussy);
		if( CoC.player.hasVagina() ) {
			MainView.outputText( '  Once she\'s done with your cock she begins licking your thighs; ensuring none of your precious juices go to waste.', false );
		}
		MainView.outputText( '  Amily licks her lips after her task and looks up at you lovingly. You pat her head and dress up, before leaving the mousette to her own devices.', false );
		this.amilyPreggoChance();
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -2, 'cor', 2 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Let corrupt Amily bone you with her cock;
	AmilyScene.prototype.corruptAmilyCampBonesPCWithHerCock = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'Your gaze sets upon Amily\'s cock and an idea forms in your head. You wonder how much Amily can resist her own lust... perhaps you should test this now; see if she is truly the ideal fucktoy, an obedient cumslut that lives only for your pleasure, that will follow your orders no matter what.\n\n', false );
		MainView.outputText( '"<i>Stay still, don\'t touch yourself and don\'t move.</i>" You order Amily, she responds with an eager, "<i>Yes ' + CoC.player.mf( 'master', 'mistress' ) + '!</i>" You continue looking at Amily\'s cock, carefully admiring your work.', false );
		//[(if Amily has balls);
		if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] > 0 ) {
			MainView.outputText( '  A pair of balls hangs under Amily\'s shaft; as you look, you have the slightest impression that her balls became rounder, fuller...', false );
		}
		MainView.outputText( '  Amily\'s shaft is ', false );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] < 6 ) {
			MainView.outputText( 'small', false );
		} else if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] < 9 ) {
			MainView.outputText( 'average', false );
		} else {
			MainView.outputText( 'big', false );
		}
		MainView.outputText( '; you wonder how good Amily is at using it. Gently you touch her shaft, testing its girth and drawing a silent whimper from Amily; a small bead of pre begins forming on the tip as her cock throbs slightly. Smiling, you grab Amily\'s shaft, carefully teasing her tip with your thumb and feeling her pulse through her cock; as more blood is diverted towards her throbbing organ, Amily begins panting lightly; clearly you\'re exciting her more and more... You chuckle and look at Amily\'s eyes, daring her to disobey your orders. She looks back with resolve and adoration. You laugh mischievously, and clench your fist, gripping and releasing Amily\'s shaft rhythmically, drawing forth more pre while Amily gasps and her resolve and adoration melt into lust and desire.\n\n', false );
		MainView.outputText( '"<i>If you even dare to disobey my orders, I\'ll have to punish you,</i>" you warn her, smiling as she squirms under your touch. "<i>I-I won\'t ' + CoC.player.mf( 'master', 'mistress' ) + '.</i>" Amily answers, with more worry than determination. You can tell it wouldn\'t take much stimulation to make the mousette break; still it would be fun seeing her try, so you decide to take this slowly. You gently run the tip of your finger along the underside of Amily\'s shaft; her hips lift a bit trying to get you to touch more of her shaft. Immediately you chastise her.  "<i>I told you not to move.</i>" Amily flinches and forces herself to stay still; her body begins to sweat and she trembles with each stroke of your finger; pre-cum flowing steadily; her breathing grows laboured', false );
		if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] > 0 ) {
			MainView.outputText( ', and her balls seeingly inflate', false );
		}
		MainView.outputText( '. Amily moans; she is almost on the edge of an orgasm when you suddenly stop. Amily whimpers in frustration. "<i>M-' + CoC.player.mf( 'Master', 'Mistress' ) + '... Please...</i>" she begs, panting.\n\n', false );
		MainView.outputText( 'You smirk at her, amused. "<i>What\'s wrong, Amily? You aren\'t going to disobey me, are you? I would so hate for you to disobey me...</i>" You purr. Even as you speak, you stroke her shaft, gently tracing the head with the ball of your thumb, fingers dancing sensually up and down her length. "<i>I don\'t want to punish you,</i>" you tell her. "<i>It hurts me, having to make you suffer, but it\'s for your own good...</i>" You smirk and add, "<i>By the way, you\'re not allowed to orgasm either.</i>" Amily looks at you in desperation; while you watch in amusement. Amily\'s breathing gets a bit more regular, and you know she\'s no longer close to blowing. Now that is not fun at all... You blow on her cock lightly, the gentle caress of the wind and its soothing coldness shakes Amily to the core. Instantly her dick throbs, veins looking like they\'ll burst; her prick gets so hard, you\'re almost sure Amily will pop right then and there; somehow, she manages to hold back, but you can see that she is even closer now than she was earlier. You can\'t help the small laugh of amusement that escapes you.\n\n', false );
		MainView.outputText( '"<i>Poor little bitch... you really do live for nothing but sex, don\'t you?</i>" You taunt her, swiping up a stray drop of pre with your finger and slowly taking it inside your ' + Descriptors.vaginaDescript() + '. Amily watches every little detail as it goes in. Finally, with a groan and an almost bestial scream, Amily loses her composure and pounces you.  As you hit the ground hard, you begin forming the words to scold her, but one glimpse of her eyes is enough to realize she\'s no longer thinking - the only things running through her head right now are fuck and breed. Amily rants and gibbers atop you, eyes blazing with unsated lust and the need, dearer to her than life itself, to fuck and breed. Her cock is as hard as an iron bar, slapping hard against your belly as she, made clumsy with her desires, struggles to position herself right to aim. She stabs clumsily against your ' + Descriptors.vaginaDescript() + '\'s lips, then, finally managing to hit the correct alignment, wastes no time in driving forward with a howl, impaling herself in you to her very hilt.', false );
		//(Play virginity lost message if appropriate.);
		CoC.player.cuntChange( (CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] * CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ]), true, true, false );
		//[(If Amily's cock area > PC's capacity);
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] * CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] > CoC.player.vaginalCapacity() ) {
			MainView.outputText( '  You growl at her rough penetration, Amily stretches you out without regards for your pleasure; you\'ll definitely have to punish her for this later...', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'Amily is overwhelmed by the feeling of your ' + Descriptors.vaginaDescript() + ', and immediately goes berserk with lust. She doesn\'t speak, she grunts and snarls, thrusting into you as hard and fast as she can. There is nothing between you but the friction of flesh on flesh', false );
		//(squirter PC:;
		if( CoC.player.wetness() >= 5 ) {
			MainView.outputText( ', the sounds of your fem-lube slurping and squelching as she smears it over herself and makes it splash out onto the ground beneath you', false );
		}
		//(if Amily has balls:;
		if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] > 0 ) {
			MainView.outputText( ' and the meaty smack-smack-smack of her balls slapping against your ' + Descriptors.assDescript(), false );
		}
		MainView.outputText( '.\n\n', false );
		MainView.outputText( 'You consider stopping Amily and smacking her for being a disobedient horny slut, but her desperate, clumsy thrusts do bring you some pleasure; besides, listening to you is beyond her capacity right now. She is truly possessed by her lust; you moan and laugh.  You find her desperation cute; how easy it was to reduce your cumbucket mouse into a mindless animal only capable of sex... oh! She hit a sweet spot!\n\n', false );
		MainView.outputText( 'Maybe Amily isn\'t totally lost in her own needs; when you react to her hitting a particular spot, she pauses, for a heartbeat, and then she picks up again, still rutting you as hard and wild as before, but now aiming specifically to hit that spot, to make this as good for you as she can, given her state. You can feel gobbets of pre-cum starting to spurt and gush into your depths - you don\'t think she\'ll last much longer. Amily\'s frantic thrusting slows considerably and she groans with the effort of each thrust.  ', false );
		//[(if Amily has balls);
		if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] > 0 ) {
			MainView.outputText( 'The slapping of her balls on your ass reverberates around you.  ', false );
		}
		MainView.outputText( 'The squelching noise of a wet pussy on cock grows audibly louder, heralding the coming of a final, explosive climax.  With a nearly screaming groan, Amily explodes inside you; thrusting as deep as she can, while her mouse-spunk pools inside your womb.\n\n', false );
		MainView.outputText( 'Amily collapses on top of you, panting and sweating; you casually say, "<i>Is that all? First you fuck me without permission, now you would dare not finish me off?</i>" Amily gasps and quickly extracts herself from you; she kneels and bows her head as far as it\'ll go while muttering a string of apologies. "<i>Please mistress, forgive this unworthy slut. I swore to serve you and only you, yet I dared to pleasure myself instead of you.</i>" You get up and silence her by sitting atop her and pushing her head down into the floor with one of your ' + CoC.player.feet() + '. "<i>Silence, whore, I\'m thinking about what I should do with you.</i>" You touch yourself as you think of a suitable punishment, juice and cum slowly trickling down on top of Amily. You suddenly have an idea, but first you must take care of your needs... You get up and sit on a nearby rock, spreading your legs and order Amily. "<i>Get up, slut. First you will pleasure me, then I will punish you. Now put that ' + this.amilyCock() + ' of yours to use.</i>"\n\n', false );
		MainView.outputText( '"Yes, mistress.</i>" Amily says solemnly as she gets up and makes way towards you; cock still erect and covered in your juices. She penetrates you easily, drawing a moan from both of you, then begins fucking you; Amily takes care to properly stimulate you, paying attention to the spots that bring you the most pleasure. It doesn\'t take long to finish you off. Your walls grip Amily\'s shaft, milking them while the mouse-slut moans and shoots inside you once again.', false );
		//[(if PC is a squirter);
		if( CoC.player.wetness() >= 5 ) {
			MainView.outputText( '  Your jets of femcum wash down all the seed Amily spills inside you, pushing it all out around her cock and painting Amily\'s lower body in juice and cum.', false );
		}
		MainView.outputText( '  Slowly Amily withdraws, her cock finally beginning to shrink as she kneels subserviently before you; head down in shame and guilt at her earlier outburst.\n\n', false );
		MainView.outputText( '"<i>Fetch me a rope.</i>" You order her; Amily quickly gets up and runs off, returning with a rope in hand. "<i>Now kneel,</i>" you order her once again. She does as you say and awaits her punishment patiently.', false );
		//[(if PC has proper feet);
		if( CoC.player.isBiped() ) {
			MainView.outputText( '  You begin stroking her limp dick with your ' + CoC.player.foot() + ', ', false );
		}//(else);
		else {
			MainView.outputText( '  You reach down and begin stroking her limp dick with your hands, ', false );
		}
		MainView.outputText( 'slowly coaxing it into erection once again. Amily moans and you quickly command, "<i>Silence!</i>" The horny mouse-cunt clamps her mouth down and attempts to stifle her moans; yet she is unable to contain the grunts that escape her. Once her cock is erect and throbbing, you quickly loop the rope around it and tie it up, ensuring it\'ll remain erect for a while still. "<i>Slut, you are not allowed to touch your cock until it has gone limp on its own. If you disobey me this time I assure you a far worse punishment is in store,</i>" you say with a hint of anger. "<i>Yes, ' + CoC.player.mf( 'master', 'mistress' ) + '. I promise this stupid cunt won\'t make the same mistake again.</i>"\n\n', false );
		MainView.outputText( '"<i>Good, now clean me off,</i>" you order her, presenting your pussy, dripping with the aftermath of your intercourse. Amily expertly licks you clean of all the jism and juice she can; by the time she\'s done, gobs of cum and wet patches of juice cover her face, yet your nethers are impressively clean. "<i>Good work, bitch,</i>" you compliment her; Amily\'s tail perks up and begins swaying as she smiles in happiness.  Sated, you dress up and go about your business, leaving Amily with a raging erection.  You wonder if Amily managed to knock you up with her lack of self control.', false );
		//[(if PC has a dick);
		if( CoC.player.hasCock() ) {
			MainView.outputText( '  If she did, you might have to return the favor...', false );
		}//(else);
		else {
			MainView.outputText( '  If she did, you\'ll just have to tie her up and get someone to return the favor...', false );
		}

		//Preg chanceeee;
		CoC.player.knockUp( PregnancyStore.PREGNANCY_MOUSE, PregnancyStore.INCUBATION_MOUSE );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -2, 'cor', 2 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};

	//CAMP CORRUPT AMILY SEX;
	AmilyScene.prototype.corruptAmilyBuckFutter = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		//[Anal - non-mutant];
		MainView.outputText( 'You order Amily to get on her hands and knees; you want to pound her ass. Amily\'s eyes light up in happiness and she replies excitedly, "<i>Yes, ' + CoC.player.mf( 'master', 'mistress' ) + '</i>!" She quickly turns around and gets in position; her full ass swaying invitingly, while her tail stands erect to give you access. Her excitement at the prospect of having her ass fucked by you is made evident by the trickles of moisture that run down her legs', false );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( '; her ' + this.amilyCock() + ' stands erect, a tiny bead of pre forming on the tip as it throbs', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'You undress and press your erect ' + Descriptors.cockDescript( 0 ) + ' against Amily\'s buttcrack, rubbing your shaft on her ass and enjoying the grip of her soft yet firm ass; beads of pre-cum begin forming and sliding down your ' + Descriptors.cockDescript( 0 ) + ', and you order Amily, "<i>Prepare yourself for me.</i>" Amily complies silently until her spaded tail digs into her pussy, drawing a moan from the excited mousette as she tail-fucks herself for a bit, before pulling her juice-slickened tail out. You distance yourself to allow her access and she rubs her slick tail-tip all over her asshole, lubing it up for you; then she rubs the still-wet spade along your ' + Descriptors.cockDescript( 0 ) + ', slickening it and massaging your shaft all at once. "<i>That\'s enough,</i>" You say; her tail immediately releases your ' + Descriptors.cockDescript( 0 ) + ' and goes back to its erect position.\n\n', false );
		MainView.outputText( 'You press your cockhead against Amily\'s throbbing ass and, with a groan, push inside. Amily moans lewdly, the pain of having her ass penetrated not even registering beyond the pleasure of the act. "<i>Yesssss... ' + CoC.player.mf( 'Master', 'Mistress' ) + ', fuck your mousy slut\'s ass! Fuck me until my ass is gaping wide. Oh! ' + CoC.player.mf( 'master', 'mistress' ) + ', I love being your fucktoy!</i>" Amily screams in praise as you fill her insides.\n\n', false );
		//[(if PC is huge);
		if( CoC.player.cockArea( 0 ) >= 61 ) {
			MainView.outputText( 'You force as much of your shaft in as you can; until you reach a point where pushing against Amily just rocks her and your shaft won\'t go deeper. Amily ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'squeaks' : 'squeals') + ' desperately. "<i>No, no, no! I want all of ' + CoC.player.mf( 'master', 'mistress' ) + '. Please ' + CoC.player.mf( 'master', 'mistress' ) + '! Push harder!</i>" Amily says, gripping the floor with her ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'claws' : 'hands') + ' and pushing back herself. But no matter how much you try, you\'re unable to drive any more of your ' + Descriptors.cockDescript( 0 ) + ' inside.', false );
		} else {
			MainView.outputText( 'You push until your hips meet her cushiony ass ', false );
			if( CoC.player.balls > 0 ) {
				MainView.outputText( 'and your ' + Descriptors.ballsDescriptLight() + ' slap against her pussy, causing her juices to squirt all over them.', false );
			} else {
				MainView.outputText( ' and draw back before violently plunging back in.  Her juices squirt all over you.', false );
			}
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'Having reached the limit, you waste no time and begin to brutally fuck the horny mousette\'s ass; drawing moans and screams of pleasure with each powerful movement and throb of your ' + Descriptors.cockDescript( 0 ) + '. Amily has no reservations about letting the world know that she\'s enjoying her predicament; she pushes back with every thrust and pulls away with every pull.  With such a brutal fucking you have no doubt that her ass is going to be sore for a while; yet she doesn\'t seem to care... pleasing her ' + CoC.player.mf( 'master', 'mistress' ) + ' is more important... besides, pain from such an act is pleasure for the corrupted mousette.\n\n', false );
		MainView.outputText( 'You slap her ass roughly, causing it to jiggle, and yell, "<i>Tighter!</i>" Amily complies by constricting your ' + Descriptors.cockDescript( 0 ) + ' with her ass muscles as tight as she can. In response, you up the rhythm of your thrusting. Dirty sounds of slapping complete the erotic picture, and you feel your ', false );
		//[(if PC has balls);
		if( CoC.player.balls > 0 ) {
			MainView.outputText( 'balls churn and your ', false );
		}
		MainView.outputText( Descriptors.cockDescript( 0 ) + ' throb and tense. You give one last powerful push, while Amily drives back, impaling herself with all her might; in one final perverted <b>SLAP</b>, you blow your load deep into the mousette\'s bowels.\n\n', false );
		//[(if PC has large cum amount);
		if( CoC.player.cumQ() >= 750 ) {
			MainView.outputText( 'Her belly begins filling and inflating, not stopping even as she starts to look 6 months pregnant. Her ass clenches around you, trying to prevent the massive load you\'re still depositing from escaping, but inevitably, a few weak jets escape from around your ' + Descriptors.cockDescript( 0 ) + '.  ', false );
		}
		MainView.outputText( 'You spill your last jets with a couple more hard thrusts and then pull out of Amily\'s ass.', false );
		//[(if PC has large cum amount);
		if( CoC.player.cumQ() >= 1000 ) {
			MainView.outputText( '  Some cum backflows out of her ass in a jet, before she plugs herself with a hand, attempting to hold everything in.', false );
		} else {
			MainView.outputText( '  Some cum begins leaking out of her ass, before she plugs herself with a hand.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( '"<i>Finish your work,</i>" you order the tired mousette. She spins around', false );
		//[(if PC has large cum amount);
		if( CoC.player.cumQ() >= 750 ) {
			MainView.outputText( ' heavy belly jiggling along her breasts, ', false );
		} else {
			MainView.outputText( ' boobs jiggling, ', false );
		}
		MainView.outputText( 'as she looks at your still erect ' + Descriptors.cockDescript( 0 ) + '; some cum still leaking from it. She licks her lips and inches her way towards you, still holding her ass closed; she begins licking the remaining cum off of your ' + Descriptors.cockDescript( 0 ), false );
		//[(if PC has balls);
		if( CoC.player.balls > 0 ) {
			MainView.outputText( ' and her spilled juices from your balls', false );
		}
		MainView.outputText( '; stopping only when you\'re completely clean. You pat her head and praise her, "<i>That\'s a good cumdumpster.</i>" She responds by smiling tiredly, still panting a bit, and swaying her tail in happiness. You wipe the remaining saliva off your dick on her face and dress yourself. "<i>Don\'t waste a single drop, cunt,</i>" you tell her.  You leave the tired mouse alone to recompose herself.', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -2, 'cor', 1 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};

	//Amily Female Stuff Start;
	//Lesbian Love Confession:;
	//(Replaces the Meet & Talk scene for a female PC who has gotten Amily's Affection to Moderate);
	AmilyScene.prototype.amilyIsTotallyALesbo = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'Strangely, you don\'t need to seek Amily out this time; she\'s waiting for you. You ask her if something is wrong, and she shakes her head... but she looks kind of embarrassed as she does so.\n\n', false );
		MainView.outputText( '"<i>There\'s... ah... something I want to talk about with you, ' + CoC.player.short + ',</i>" She finally says. "<i>I... Well, I\'ve never really thought of other women as being attractive before, and maybe it\'s just because I\'ve been alone so long, but you\'ve been so kind to me and it\'s so nice to have somebody who cares for me and well I guess what I want to say is -</i>"\n\n', false );
		MainView.outputText( 'You interject, telling her to slow down and breathe, you\'re not going anywhere. Amily pants, then finally squeaks out, "<i>I\'m in love with you!</i>" before her face turns bright red. Stunned, you ask her to repeat that. "<i>I said... I\'m in love with you. I... ah, forget it, who was I kidding?</i>" She trails off, sadly, and you watch as she begins to turn around and shuffle off.', false );
		//Set flag that she's confessed her lesbo-live!;
		CoC.flags[ kFLAGS.AMILY_CONFESSED_LESBIAN ] = 1;
		EngineCore.choices( 'Stop Her', this, this.amilyLesboStopHer, 'Let Her Go', this, this.amilyLesboLetHerGo, '', null, null, '', null, null, '', null, null );
	};
	//[=Stop Her=];
	AmilyScene.prototype.amilyLesboStopHer = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'Before she can get too far, though, your hand shoots out and clasps her shoulder. She starts to question what you\'re doing, but you spin her around and pull her into a tight embrace, telling her that you feel the same way. Shyly, she offers her lips to you, and you kiss them eagerly. When you seperate for breath, you ask if she wants to see what it\'s like with another woman. Her eyes glazed, she nods at you wordlessly and starts leading you away down the street.\n\n', false );
		//WHAT THE FUCK DOES THIS SCENE LEAD TO?;
		CoC.flags[ kFLAGS.AMILY_CONFESSED_LESBIAN ] = 2;
		EngineCore.doNext( this, this.girlyGirlMouseSex );
	};
	//[=Let Her Go=];
	AmilyScene.prototype.amilyLesboLetHerGo = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		/*(If player is already locked into a relationship)) >= 0 || SceneLib.urta.urtaLove()) {
		 MainView.outputText('You put a hand on her shoulder, bringing her to a stop. She looks so hopeful at you that it\'s almost painful, but you tell her that, while you do care for her and you like her as a friend, you\'re already in a relationship with somebody.\n\n', false);
		 MainView.outputText('"<i>Are you? 0...I see. Well, I\'m happy that you, at least, found somebody. I... You\'re still welcome to come by and talk, but I\'ll respect your wishes.</i>" Amily tells you. Evidently still quite embarrassed, she apologises and then melts away into the ruins again.', false);
		 //(Amily is now locked out of a relationship with the player);
		 }*/
		MainView.outputText( 'You watch her go, feeling a little guilty, but you just don\'t swing that way. You can only hope she\'ll be all right.\n\n', false );
		//(Amily's affection drops back down to Low);
		if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] > 10 ) {
			CoC.flags[ kFLAGS.AMILY_AFFECTION ] = 10;
		}
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Amily's Surprise:;
	//(Replaces the Remeeting Scene for a female player has had the Lesbian Love Confession scene and gotten Amily's Affection to High);
	AmilyScene.prototype.amilyPostConfessionGirlRemeeting = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'Amily looks happy to see you, as usual, but shy as well. "<i>Ah... ' + CoC.player.short + '... it\'s good to see you again.</i>"\n\n', false );
		MainView.outputText( 'You agree that it is, then ask if something is the matter.\n\n', false );
		MainView.outputText( 'Amily scuffs the ground nervously. "<i>It\'s like this... You know I love you, don\'t you? But that I also want - I *need* - to have children to resurrect my race?</i>"\n\n', false );
		MainView.outputText( 'You nod your agreement and ask her what exactly she means.\n\n', false );
		MainView.outputText( 'She looks down at the ground, unable to meet your eyes, then pulls her tattered pants down to reveal something you never would have expected. A penis - a four inch long, surprisingly human-like penis, already swelling to erection. Blushing, she starts to speak, still not looking at you. "<i>I... I thought that, if it\'s my idea and all, I should be the one to grow this thing... Please, I love you, I want to have children with you, can\'t we -</i>"\n\n', false );
		CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] = 4;
		CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] = 1;
		EngineCore.choices( 'Accept', this, this.amilyOnGirlSurpriseBonerAcceptance, 'Reject', this, this.amilyOnGirlSurpriseBonerREJECT, '', null, null, '', null, null, '', null, null );
	};
	//[=Accept=];
	AmilyScene.prototype.amilyOnGirlSurpriseBonerAcceptance = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'Her increasingly nervous, high-pitched tone is cut off when you press a finger to her lips, smiling affectionately at her. You tell her that you understand what she is saying and why she did this, and you\'re happy to be with her in that way. Putting on a saucy grin, you stage-whisper into her ear about giving her new appendage a trial-run, and she blushes bright red.\n\n', false );
		MainView.outputText( 'She still starts leading you away, though.', false );
		//TO THE SMEX yiffyiffmurrmurr!;
		EngineCore.doNext( this, this.hermilyOnFemalePC );
	};
	//[=Reject=];
	AmilyScene.prototype.amilyOnGirlSurpriseBonerREJECT = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You scowl and take a pointed step back. You cared about her because she was another woman, alone and lost in this twisted world full of horny freaks that seem to be nothing but dicks and lust; now she\'s turned herself into one of them? She couldn\'t accept the pure love that the two of you already had?\n\n', false );
		MainView.outputText( 'Amily stops, her new cock wilting, her expression making it quite obvious that she\'s heartbroken. Her head falls, tears dripping from her eyes, and she turns and runs away. You glare after her as she vanishes, sobbing, into the ruins, hoping she never comes back.', false );
		//no moar amily in village;
		CoC.flags[ kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED ] = 1;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Yuri:;
	AmilyScene.prototype.girlyGirlMouseSex = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You take Amily by the hand and allow her to lead you to where it is she plans on having sex with you. Soon enough, through many twists and turns, you are in a makeshift bedroom in an otherwise gutted building.\n\n', false );
		//(If first time:;
		if( CoC.flags[ kFLAGS.AMILY_TIMES_FUCKED_FEMPC ] === 0 ) {
			MainView.outputText( 'Amily stops and lets go of your hand, blushing faintly and looking embarrassed. "<i>So, ah... how do we do this? I... I\'ve never been attracted to another woman before, how does sex even work between us?</i>"\n\n', false );
		} else {
			MainView.outputText( '"<i>Remember how you had to take charge the first time?</i>" She grins. "<i>Care to see if you\'ve still got it?</i>"\n\n', false );
		}

		MainView.outputText( 'You smile at her, place a hand gently under her chin, and then draw her in closely. You kiss her, deeply and warmly, not trying to force anything but letting her be drawn into it of her own accord. As she starts to kiss you back, you gently reach into her shirt and begin to caress her small, tender breasts. As you stroke and tease the sensitive flesh, rubbing a thumb enticingly around each nipple, Amily moans, and her tail suddenly wraps convulsively around your ' + CoC.player.leg() + ', making it quite clear that she\'s enjoying this and getting ready.\n\n', false );
		MainView.outputText( 'Slowly you lead her to her bedding, and it is only when she is on her back that you break off the kiss. Amily looks dazed for a few moments, and then grins at you. "<i>Wow.</i>" You smile in response and start to remove your ' + CoC.player.armorName + ' - Amily sees this and hurriedly starts to pull off her own tattered rags. Once the two of you are naked, you give her one last kiss before you gently sit atop her, facing backwards. You slowly lie yourself down onto her, giving you a perfect view of her pink, naked pussy, and allowing her to come face to face with your own ' + Descriptors.vaginaDescript( 0 ) + '.\n\n', false );
		if( CoC.flags[ kFLAGS.AMILY_TIMES_FUCKED_FEMPC ] === 0 ) {
			MainView.outputText( '"<i>...I\'m supposed to lick you there, right?</i>" Amily asks, hesitantly. You smirk and promptly give her own sex a long, sloppy lick of your own. She squeaks in shock and then clumsily licks you in return.\n\n', false );
		} else {
			MainView.outputText( 'Amily needs no instructions and plunges her tongue as deeply as it can go into your sex. You yelp in shock, which makes Amily\'s tail wave happily, and, grinning mischievously, you return the favor.\n\n', false );
		}

		MainView.outputText( 'You stroke her pussy\'s walls with your tongue as slowly and as intensely as possible, even as Amily licks you in return. Her taste begins to fill your mouth, the unmistakable taste of sex and girlcum. Amily does her best to mirror your actions; when you suck playfully on her little clit, Amily sucks on your own ' + Descriptors.clitDescript() + '.  When you go faster, she goes faster, when you go slower, she goes slower.\n\n', false );
		MainView.outputText( 'Her juices are flowing strong and thick, now, leaving you lapping at the wetness with audible slurps. Your tongue reaches into every crevice, every fold that you can find, and Amily moans and squeaks incoherently as she savors your ministrations. Emboldened, she suddenly thrusts her ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'muzzle' : 'lips') + ' into your ' + Descriptors.vaginaDescript( 0 ) + ', using her pointed nose as a phallic substitute to reach deeper and hit spots of yours that her tongue just isn\'t hitting strongly enough. You bite back your own squeal of pleasure, and start licking as hard as you can.\n\n', false );
		MainView.outputText( 'Under such mininstrations, it is no surprise that, inevitably, both of you cum, leaving each other\'s faces splattered with your juices. Sighing with relief, you roll off of Amily\'s body and lay there in her bed, breathing heavily from your exertions.\n\n', false );
		if( CoC.flags[ kFLAGS.AMILY_TIMES_FUCKED_FEMPC ] === 0 ) {
			MainView.outputText( '"<i>...I didn\'t know it could feel so good with another woman.... But I was never attracted to women before.</i>" Amily murmurs to herself.\n\n', false );
		} else {
			MainView.outputText( '"<i>...Does it make me a lesbian, that I love this so much? Or am I just so lonely for company that even another woman is good?</i>" Amily asks. Then she musters the energy to shake her head. "<i>It doesn\'t matter. I love you.</i>"\n\n', false );
		}

		MainView.outputText( 'Your own strength returning to you, you sit up and smile at your mousey lover before giving her a deep kiss, tasting your juices and letting her get a taste of her own. Then you redress yourself and return to your camp.', false );
		CoC.player.orgasm();
		CoC.flags[ kFLAGS.AMILY_TIMES_FUCKED_FEMPC ]++;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Herm Amily on Female:;
	AmilyScene.prototype.hermilyOnFemalePC = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'Amily\'s efforts at leading you to a place to make love are a bit hampered by the erection tenting her pants, which she is clearly still having a bit of difficulty adjusting to. Finally, though, you have reached her current den, where you waste no time in removing your ' + CoC.player.armorName + '.\n\n', false );
		if( CoC.flags[ kFLAGS.AMILY_HERM_TIMES_FUCKED_BY_FEMPC ] === 0 ) {
			MainView.outputText( '"<i>I can\'t believe this is actually happening... I\'ve grown a cock and I\'m about to use it on another woman.</i>" Amily mutters to herself, though it\'s very evident that she likes what she sees, unable to resist staring at your ' + Descriptors.chestDesc() + ' or your ' + Descriptors.vaginaDescript() + '.\n\n', false );
		} else {
			MainView.outputText( '"<i>I still can\'t believe that I\'m burying this hot, throbbing thing in another woman\'s pussy... More than that, I think I\'m actually starting to like it.</i>" Amily comments to herself, staring unabashedly at your curves.\n\n', false );
		}

		//(If first time & CoC.player is herm:;
		if( CoC.player.gender === 3 ) {
			if( CoC.flags[ kFLAGS.AMILY_HERM_TIMES_FUCKED_BY_FEMPC ] === 0 ) {
				MainView.outputText( '"<i>How on earth did I let myself get talked into this? If you\'ve got both a cock and a pussy, then what\'s wrong with you just filling me with that cock?</i>" Amily mutters to herself. Despite her words, though, her gaze is fixed squarely on your ' + Descriptors.vaginaDescript() + '.\n\n', false );
			}
			//else;
			else {
				MainView.outputText( '"<i>You know, it\'s not all bad, us both being this way... but remember that I want a turn at that, too.</i>" She states, staring hungrily at your ' + Descriptors.multiCockDescriptLight() + '.\n\n', false );
			}
		}
		MainView.outputText( 'You smile at her, and indicate that she may want to remove her own clothing. Looking a bit embarrassed, Amily strips herself down, revealing her perky breasts and her straining, eager cock for your own perusal. You step close and reach out to gently stroke the hot, pulsing member, eliciting a pleased groan from the futanari mouse, which entices you to use your grip around it to lead her to the makeshift bed, where you sink down onto your back and spread your ' );
		if( CoC.player.isBiped() ) {
			MainView.outputText( CoC.player.legs() + ' in readiness for her.' );
		} else {
			MainView.outputText( ' [cunt] in readiness for her.' );
		}
		MainView.outputText( ' Amily kneels down in between them, easily able to tell what you want.\n\n', false );
		//(If first time:;
		if( CoC.flags[ kFLAGS.AMILY_HERM_TIMES_FUCKED_BY_FEMPC ] === 0 ) {
			MainView.outputText( '"<i>Er... are you really sure about this? I mean...</i>" Amily murmurs uncertainly, until, irritated, you suddenly wrap your ' + CoC.player.legs() + ' around her waist and pull her the last few inches needed to slam her dick into your needy pussy. She ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'squeaks' : 'gasps') + ' in shock and tries to pull out, but you still have your grip on her and pull her back, a process that repeats several times until the rhythm of it sinks in and Amily starts to thrust back and forth on her own.\n\n', false );
		} else {
			MainView.outputText( 'Amily grips your ' + Descriptors.hipDescript() + ', gathering her courage, and then plunges her penis into your depths. Cautiously at first, she begins to thrust herself back and forth, growing faster and harder as her resolve builds.', false );
		}
		CoC.player.cuntChange( (CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] * CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ]), true, true, false );
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'Amily\'s ministrations are hardly the most expert of sexual techniques you\'ve seen in Mareth, but her intentions to make it as pleasant as possible for you are obvious, and what she lacks in expertise she makes up for in enthusiasm, ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'squeaking' : 'panting') + ' and moaning as the unfamiliar sensations of your ' + Descriptors.vaginaDescript() + ' gripping her newfound penis fill her. You work your hardest to make it good as well, but Amily\'s inexperience with having a male sexual organ is evident in that she soon loses control and, with a loud ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'squeak' : 'groan') + ', you feel her shooting cum into your thirsty ' + Descriptors.vaginaDescript() + '. The hot fluid gushes from her futa-member, and when the last few drops have dripped from her, she collapses onto you, panting.\n\n', false );
		//(First time:;
		if( CoC.flags[ kFLAGS.AMILY_HERM_TIMES_FUCKED_BY_FEMPC ] === 0 ) {
			MainView.outputText( '"<i>...I had no idea it would feel like that,</i>" she gasps softly.\n\n', false );
		} else {
			MainView.outputText( '"<i>It gets me every time when that happens. Is this what it\'s like for men?</i>" she wonders.\n\n', false );
		}

		MainView.outputText( 'You smile and reach up to stroke her cheek. She smiles back and reaches down to pat you on your belly.', false );
		//(If player is preg;
		if( CoC.player.isPregnant() ) {
			if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_AMILY ) {
				MainView.outputText( '"<i>Boy, this is weird.  I\'m a woman and I\'m going to be a dad.' );
			} else {
				MainView.outputText( '"<i>After you give birth to this baby come and see me when you\'re ready for mine.  This is really weird, I\'m a woman and I can\'t wait to be a dad.' );
			}
		}
		//not preg yet!;
		else {
			MainView.outputText( '"<i>Let\'s see if you\'ll be a mommy from this load... If not, well, I guess we\'ll have to try again.' );
			//PREGGO CHECK HERE;
			CoC.player.knockUp( PregnancyStore.PREGNANCY_AMILY, PregnancyStore.INCUBATION_MOUSE );
		}
		MainView.outputText( '</i>"  Chuckling softly, you lay there and embrace your lover for a time and then, reluctantly, you get dressed and leave.', false );
		CoC.player.orgasm();
		CoC.flags[ kFLAGS.AMILY_HERM_TIMES_FUCKED_BY_FEMPC ]++;
		CoC.flags[ kFLAGS.AMILY_FUCK_COUNTER ]++;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Player gives Birth (quest version):;
	AmilyScene.prototype.pcBirthsAmilysKidsQuestVersion = function() {
		this.amilySprite();
		CoC.flags[ kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS ]++;
		//In camp version:;
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			this.playerBirthsWifAmilyMiceInCamp();
			return;
		}
		//Quest Ending: Herm Amily Variant;
		//Requirements: Player must have given birth to a litter of Amily's children at least five times before.;
		if( CoC.flags[ kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS ] + CoC.flags[ kFLAGS.AMILY_BIRTH_TOTAL ] >= 5 ) {
			MainView.outputText( 'You wake up suddenly to strong pains and pressures in your gut. As your eyes shoot wide open, you look down to see your belly absurdly full and distended. You can feel movement underneath the skin, and watch as it is pushed out in many places, roiling and squirming in disturbing ways. The feelings you get from inside are just as disconcerting. You count not one, but many little things moving around inside you. There are so many, you can\'t keep track of them.\n\n', false );
			MainView.outputText( 'Pain shoots through you as they pull open your cervix forcefully, causing you to cry out involuntarily. At once, Amily suddenly appears, racing out from the undergrowth. "<i>Is it time? Are you going into labor?</i>" She asks, worry evident in her voice. Your pain is momentarily forgotten by your surprise and you ask where she came from. She snorts disdainfully at the question. "<i>I\'ve been shadowing you for a couple of days, now. Did you really think I\'d let the mother of my children go through this alone?</i>"\n\n', false );
			MainView.outputText( 'Any reply you may have been inclined to make to that is swallowed by another cry of pain as yet another contraction wrings its way through you. Amily takes your hand in hers and you cling to the lifeline of comfort it offers, thankful to not be alone for this. You can feel the first child moving out of your womb, through your cervix, down and into your ' + Descriptors.vaginaDescript() + '. Your lips part and, with a grunt, you expel the first child into Amily\'s waiting hand. She holds it up to you so that you can see your firstborn; it\'s a little mouselet', false );
			//(if player is female: 1 in 3 chance of it being boy, girl or herm, if player is herm, 100% chance of it being a herm)";
			MainView.outputText( ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? ', naked, pink, and totally hairless' : '') + '. Amily helps hold it to your ' + Descriptors.breastDescript( 0 ) + ', where it eagerly takes hold of your ' + Descriptors.nippleDescript( 0 ) + ' and starts to suckle. As it drinks, it starts to grow larger, and ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'fur the same color as your own hair starts to cover its body' : '') + '. It quickly drinks its fill and then detaches, its \'father\' putting it aside, which is good, because by this time there\'s another baby waiting for its turn... and another... and another...\n\n', false );
			MainView.outputText( 'Soon, you are back to your old self again, lying down in exhaustion with Amily sitting nearby, your many rambunctious offspring already starting to walk and play around you.\n\n', false );
			MainView.outputText( '"<i>Get some rest, darling. There are things you and I need to talk about,</i>" Amily instructs you.\n\n', false );
			MainView.outputText( 'You are eager to comply, though your last thought as you sink into unconsciousness is to wonder what Amily wants to talk about.', false );
			CoC.flags[ kFLAGS.PC_PENDING_PREGGERS ] = 1;
			//To part 2!;
			EngineCore.doNext( this, this.postBirthingEndChoices );
			return;
		}
		MainView.outputText( 'You wake up suddenly to strong pains and pressures in your gut. As your eyes shoot wide open, you look down to see your belly absurdly full and distended. You can feel movement underneath the skin, and watch as it is pushed out in many places, roiling and squirming in disturbing ways. The feelings you get from inside are just as disconcerting. You count not one, but many little things moving around inside you. There are so many, you can\'t keep track of them.\n\n', false );
		MainView.outputText( 'Pain shoots through you as they pull open your cervix forcefully, causing you to cry out involuntarily. At once, Amily suddenly appears, racing out from the undergrowth. "<i>Is it time? Are you going into labor?</i>" She asks, worry evident in her voice. Your pain is momentarily forgotten by your surprise and you ask where she came from. She snorts disdainfully at the question. "<i>I\'ve been shadowing you for a couple of days, now. Did you really think I\'d let the mother of my children go through this alone?</i>"\n\n', false );
		MainView.outputText( 'Any reply you may have been inclined to make to that is swallowed by another cry of pain as yet another contraction wrings its way through you. Amily takes your hand in hers and you cling to the lifeline of comfort it offers, thankful to not be alone for this. You can feel the first child moving out of your womb, through your cervix, down and into your ' + Descriptors.vaginaDescript() + '. Your lips part and, with a grunt, you expel the first child into Amily\'s waiting hand. She holds it up to you so that you can see your firstborn; it\'s a little mouselet', false );
		//(if player is female: 1 in 3 chance of it being boy, girl or herm, if player is herm, 100% chance of it being a herm);
		MainView.outputText( ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? ', naked, pink, and totally hairless' : '') + '. Amily helps hold it to your ' + Descriptors.chestDesc() + ', where it eagerly takes hold of your ' + Descriptors.nippleDescript( 0 ) + ' and starts to suckle. As it drinks, it starts to grow larger, and ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'fur the same color as your own hair starts to cover its body' : '') + '. It quickly drinks its fill and then detaches, its \'father\' putting it aside, which is good, because by this time there\'s another baby waiting for its turn... and another... and another...\n\n', false );
		MainView.outputText( 'Soon, you are back to your old self again, lying down in exhaustion with Amily sitting nearby, your many rambunctious offspring already starting to walk and play around you.\n\n', false );
		MainView.outputText( '"<i>Look at them all. You... I never thought it would turn out this way, but you\'re helping my dream to come true. Thank you,</i>" Amily tells you sincerely. You\'re too exhausted to keep your eyes open for long, but she promises to stay in touch and, even as you fall asleep, she\'s gathering up your children and taking them away.', false );
	};
	AmilyScene.prototype.postBirthingEndChoices = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'When you awake, the children are gone, and Amily has prepared something for you to eat. You eagerly start to feed yourself as Amily, looking grave, begins to speak.\n\n', false );
		MainView.outputText( '"<i>You know that this... well, this isn\'t how I saw my future going. I wanted a human mate to help me make pure children, to revive my race, that\'s true, but... I kind of always saw myself as the mother to those children. But, being the father... well, it\'s not so bad.</i>" She takes your hands in hers, looking deep into your eyes. "<i>I... I never dreamed I\'d say this to ', false );
		//(if player is female:;
		if( CoC.player.gender === 2 ) {
			MainView.outputText( 'another woman', false );
		}
		//, if player is herm:;
		else {
			MainView.outputText( 'a hermaphrodite', false );
		}
		MainView.outputText( ', but... I love you. The children, they\'re going to leave here now, and set up a new village somewhere else. But I... I want to stay here with you. Forever. Please, say yes.</i>"\n\n', false );
		MainView.outputText( 'Do you accept her offer?', false );
		CoC.flags[ kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS ]++;
		EngineCore.choices( 'Accept', this, this.acceptAmilyAsYourFemaleWaifu, 'StayFriends', this, this.declineButBeFriends, 'ShootDown', this, this.notInterestedInDumbshitMouseBitches, '', null, null, '', null, null );
	};
	//[=Accept=];
	AmilyScene.prototype.acceptAmilyAsYourFemaleWaifu = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You stare at her in surprise. Then, you take hold of her hands and smile at her. You tell her that nothing would make you happier than to have her here, living with you, being with her. Amily squeaks loudly with joy and passionately embraces you, kissing you as deeply as she can. When she finally lets you go for lack of air, she takes a good long look around the camp, as if she\'s seeing it for the first time.\n\n', false );
		MainView.outputText( '"<i>Well, I better start moving in, huh?</i>" she jokes. She then flops down on your sleeping roll beside you, "<i>There we are, I\'m moved in.</i>" She grins at you, and you can\'t help but laugh.\n\n', false );
		//(Amily becomes a follower; quest is over);
		//Disable village encounters!;
		CoC.flags[ kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED ] = 1;
		//Set amily follower flag;
		CoC.flags[ kFLAGS.AMILY_FOLLOWER ] = 1;
		CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] = 1;
		CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] = 0.3;
		CoC.flags[ kFLAGS.AMILY_HIP_RATING ] = 6;
		CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] = 6;
		EngineCore.doNext( MainView, MainView.playerMenu );
	};
	//[=Stay Friends=];
	AmilyScene.prototype.declineButBeFriends = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You think about it, and then shake your head. You tell her that you do appreciate her feelings, but you\'re not sure the two of you are ready to make the committment that living together entails. Besides, your camp is set up to guard the portal leading back to your world; that makes it a magnet for demons. You can\'t imagine exposing her to the danger that moving to camp would entail for her.\n\n', false );
		MainView.outputText( 'Amily doesn\'t look entirely happy, but you assure her that you will keep coming back to see her. And when you tease at the possibility of a few more litters in your respective futures, stroking her penis through her tattered pants, she blushes but agrees to go.\n\n', false );
		//(Amily returns to the Ruined Village; this scene will repeat the next time the player gives birth to a litter of Amily's children);
		EngineCore.doNext( MainView, MainView.playerMenu );
	};
	//Shoot the bitch down!;
	//[=Not Interested=];
	AmilyScene.prototype.notInterestedInDumbshitMouseBitches = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You stare at her coldly, and inform her that you have no interest in any kind of relationship with her on that level. You decided to let her plant her brats in you out of pity, but now that she no longer needs your womb, you have no more intention of renting it out to her.\n\n', false );
		MainView.outputText( 'Amily reels, heartstruck, her expression making it clear that her heart has shattered, tears rolling down her face. "<i>I...I didn\'t know that was the way you felt about me. F-Fine, if that\'s how it is...</i>" She bursts into sobs and runs away; you know she\'ll never come back.\n\n', false );
		//Disable village encounters, go!;
		CoC.flags[ kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED ] = 1;
		EngineCore.doNext( MainView, MainView.playerMenu );
	};
	//Gender Modified:;
	AmilyScene.prototype.amilyNewGenderConfrontation = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		var sex = null;
		//Remember old gender.;
		var oldGender = CoC.flags[ kFLAGS.AMILY_PC_GENDER ];
		//Re-init old gender so we don't get caught in a loop!;
		CoC.flags[ kFLAGS.AMILY_PC_GENDER ] = CoC.player.gender;
		//Called from mid-way through remeeting's intro!;
		MainView.outputText( 'Suddenly, Amily stops and looks puzzled, her nose twitching. "<i>Have you changed...? Yes, you have! You\'ve been messing with some of those weird potions and things that show up here and there - you\'ve altered your gender, haven\'t you?</i>"\n\n', false );
		MainView.outputText( 'You nod your head and admit you have.\n\n', false );
		//Male tooo;
		if( oldGender === 1 ) {
			//[Male To Female];
			if( CoC.player.gender === 2 ) {
				//Low Affection:;
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( '"<i>Oh, great. Now what am I going to do with you? Why on earth would you stuff this up?</i>" Amily complains. She shakes her head. "<i>Come back later - I\'m too frustrated to talk to you now.</i>" She storms away and you decide it would be best to take her advice.\n\n', false );
					//(Player must now begin the Female Quest from the beginning.);
				}
				//Medium Affection:;
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( '"<i>I... I... why would you do that?</i>" Amily asks, looking hurt. "<i>I... no, This wasn\'t an effort by you to hurt me, I\'m sorry, I was being selfish.</i>" She apologizes. "<i>But... I don\'t know what we can do any more. I... I need time to think.</i>" She turns and walks away, and you decide to give her what she asks for.', false );
					//(When next the PC encounters Amily, they will receive the 'confession of love' scene.);
				}
				//High Affection:;
				else {
					MainView.outputText( 'Amily looks quite upset, and then her expression changes to one of resolve. "<i>I won\'t pretend to know how this happened, or to understand why you would do this voluntarily, if that was the case, but you mean too much to me to let you go over something like this.</i>" She seizes hold of your hand, fiercely, and starts determinedly pulling you along. "<i>Come with me!</i>" She orders.', false );
					//(Amily Yuri sex scene plays.);
					EngineCore.doNext( this, this.girlyGirlMouseSex );
					return;
				}
			}
			//[Male To Herm];
			else if( CoC.player.gender === 3 ) {
				//Low Affection:;
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( '"<i>...Are you a herm, now?</i>" She asks, sounding appalled. When you confirm it, she grimaces in disgust. "<i>Stay away from me! You\'re not coming near my bed again until you\'re all man again!</i>" She orders, and then storms off.\n\n', false );
					//(Player must now begin the Herm Quest from the beginning.);
				}
				//Medium Affection:;
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( 'She looks intimidated. "<i>I... I\'m sorry, but I don\'t think I can share my bed with you, not any more. Please, find a way to become male again, then come back to me?</i>" She pleads, then slips away.\n\n', false );
					//(Amily's affection score remains unchanged, but the player must make the 'What\'s Wrong With Herms' scene.);
				}
				//High Affection:;
				else {
					MainView.outputText( '"<i>I...</i>" She swallows hard. "<i>This is a great shock, I must confess, but... But I care too much to lose you. I don\'t care if you\'ve got a pussy of your own, now. I still want to be with you.</i>" She smiles at you, feebly. "<i>So, as I was saying, what do you want to talk about?</i>"\n\n', false );
					//(The player is considered as having completed the herm-specific part of Amily's quest.);
					CoC.flags[ kFLAGS.AMILY_HERM_QUEST ] = 2;
				}
			}
			//[Any to Genderless];
			else {
				//Low Affection:;
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( 'She looks at you in disdain. "<i>How can you be so stupid as to completely remove all gender from yourself? Get out of my sight and don\'t come back until you\'re one gender or the other again!</i>" She then proceeds to storm off.\n\n', false );
					//(Amily will repeat this scene on each remeeting until the player becomes a gender other than Genderless.);
				} else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( 'She shakes her head sadly. "<i>I guess this kind of puts a kink in our relationship, doesn\'t it? Still, I\'ll always be willing to talk with you.</i>"\n\n', false );
					//(The player can only Talk with Amily on each remeeting until they have become a gender other than Genderless.);
				}
				//High Affection:;
				else {
					MainView.outputText( 'She looks upset and concerned - but for your sake, not hers. "<i>I can\'t imagine what catastrophe robbed you like this. Please, find a way to change yourself back? Man, woman, even herm, I can\'t bear to see you like this... but I\'ll give you all the support I can.</i>"\n\n', false );
					//(The player can only Talk with Amily on each remeeting until they have become a gender other than Genderless.);
				}
			}
		}
		//[Female...;
		else if( oldGender === 2 ) {
			// to Male];
			if( CoC.player.gender === 1 ) {
				//Low Affection:;
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( 'Amily looks deeply surprised. "<i>You... you turned yourself from a woman into a man? 0...For me?</i>" She scuffs her foot at the ground in embarrassment. "<i>I... I don\'t know what to say. But... will you hear me out, now that you have changed?</i>"\n\n', false );
					//(Begin Male variant of Amily's quest.);
					//FEN: Increase affection!;
					CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 15;
					//FEN: If PC has had any kids with her, set as good to go!;
					if( CoC.flags[ kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS ] > 0 ) {
						CoC.flags[ kFLAGS.AMILY_OFFER_ACCEPTED ] = 1;
					}
				}
				//Medium Affection:;
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( 'She looks surprised, unsure of what to say. "<i>I... thank you. I do feel we\'ve grown closer, but this will make things much easier...</i>"', false );
					//(Begin Male variant of Amily's quest.);
					//FEN: Increase affection!;
					CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 5;
					//FEN: If PC has had any kids with her, set as good to go!;
					if( CoC.flags[ kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS ] > 0 ) {
						CoC.flags[ kFLAGS.AMILY_OFFER_ACCEPTED ] = 1;
					}
				}
				//High Affection:;
				else {
					MainView.outputText( 'She looks pleased, but then adopts an exaggerated expression of irritation. "<i>You go to all the hard work of seducing me as a woman, and now you turn into a man? Why do you put me through these things?</i>" She heaves a similarly exaggerated sigh, then smiles again. "<i>Ah, well, now we can start things over, can\'t we? Let\'s see what the new you is like in bed.</i>" She makes a \'come hither\' expression, then playfully starts running off into the ruins, making sure you follow her.\n\n', false );
					//mark as agreed to preg-quest!;
					CoC.flags[ kFLAGS.AMILY_OFFER_ACCEPTED ] = 1;
					//(Play High Affection Male sex scene.);
					EngineCore.doNext( this, this.amilySexHappens );
					return;
				}
			}
			//[Female to Herm];
			else if( CoC.player.gender === 3 ) {
				//Amily has no dick.;
				if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] === 0 ) {
					//Low Affection:;
					if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
						MainView.outputText( 'She looks at you for a long time, then shakes her head in disbelief. "<i>What woman in her right mind would grow a dick? Ah, well, get rid of the pussy, and then you and I may have something to talk about. But, for now, we\'ll just talk.</i>"', false );
						//(Begin herm variant of Amily's quest.);
					}
					//Medium Affection:;
					else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
						MainView.outputText( '"<i>I... don\'t take this the wrong way, ' + CoC.player.short + ', but... I\'m not so sure we can be together any more while you have that. Be one thing or the other, not both.</i>" Amily states. "<i>But we can still talk, this time.</i>"', false );
						//(Next encounter with Amily is the 'Maybe Herms Aren\'t So Bad' scenes.);
					}
					//High Affection:;
					else {
						MainView.outputText( 'She looks you up and down, swallows forcefully, then looks determined. "<i>I... I never dreamed I would say this to a hermaphrodite, but... but I know you, and I love you. If you still want to be with me, I\'ll stay with you.</i>" She gives you wry grin. "<i>Besides, I guess this means that now you and I can have children, anyway.</i>"', false );
						//(Player counts as having finished the herm variant of Amily's quest.);
						CoC.flags[ kFLAGS.AMILY_HERM_QUEST ] = 2;
					}
				}
				//Amily grew a dick for you.;
				else {
					MainView.outputText( 'Amily looks you up and down, blushes and says, "<i>Did you get a little jealous of me and decide to have some fun for yourself?  I-I didn\'t want it to be this way, but I guess we can both repopulate my race now.  How wonderful.</i>"', false );
					CoC.flags[ kFLAGS.AMILY_HERM_QUEST ] = 2;
				}
			}
			//[Any to Genderless];
			else {
				//Low Affection:;
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( 'She looks at you in disdain. "<i>How can you be so stupid as to completely remove all gender from yourself? Get out of my sight and don\'t come back until you\'re one gender or the other again!</i>" She then proceeds to storm off.\n\n', false );
					//(Amily will repeat this scene on each remeeting until the player becomes a gender other than Genderless.);
				} else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( 'She shakes her head sadly. "<i>I guess this kind of puts a kink in our relationship, doesn\'t it? Still, I\'ll always be willing to talk with you.</i>"\n\n', false );
					//(The player can only Talk with Amily on each remeeting until they have become a gender other than Genderless.);
				}
				//High Affection:;
				else {
					MainView.outputText( 'She looks upset and concerned - but for your sake, not hers. "<i>I can\'t imagine what catastrophe robbed you like this. Please, find a way to change yourself back? Man, woman, even herm, I can\'t bear to see you like this... but I\'ll give you all the support I can.</i>"\n\n', false );
					//(The player can only Talk with Amily on each remeeting until they have become a gender other than Genderless.);
				}
			}
		}
		//Herm toooooooo;
		else if( oldGender === 3 ) {
			//[Herm to Male];
			if( CoC.player.gender === 1 ) {
				//Low Affection:;
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( 'She looks you over and smiles. "<i>Well, now that\'s more like it. You and I, we need to talk...</i>"', false );
					//(Begin the male variant of Amily's quest, +5 affection.);
					CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 5;
					//if engaged in herm-quest autoenable male quest!;
					if( CoC.flags[ kFLAGS.AMILY_HERM_QUEST ] === 2 ) {
						CoC.flags[ kFLAGS.AMILY_OFFER_ACCEPTED ] = 1;
					}
				}
				//Medium Affection:;
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( '"<i>And here I was starting to get used to you like that... but I\'m happy you made such a change for me.</i>" She tells you, smiling.\n\n', false );
					CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 2;
					//mark as agreed to preg-quest!;
					CoC.flags[ kFLAGS.AMILY_OFFER_ACCEPTED ] = 1;
					//(Use the Remeeting scene options.);
					if( CoC.player.lust >= 33 ) {
						sex = this.sexWithAmily;
					}
					if( sex !== null ) {
						EngineCore.choices( 'Sex', this, sex, 'Talk', this, this.talkToAmily, 'Both', this, this.talkThenSexWithAmily, '', null, null, '', null, null );
					} else {
						EngineCore.choices( '', null, null, 'Talk', this, this.talkToAmily, '', null, null, '', null, null, '', null, null );
					}
					return;
				}
				//High Affection:;
				else {
					MainView.outputText( '"<i>I was comfortable with who you were, you didn\'t have to change on my account...</i>" Amily says, clearly looking guilty. When you assure her that you did this voluntarily, she brightens up. "<i>Well, I am happy to have you all man - so, what were you wanting to speak about?</i>"', false );
					//(Use the Remeeting scene options.);
					CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 2;
					//mark as agreed to preg-quest!;
					CoC.flags[ kFLAGS.AMILY_OFFER_ACCEPTED ] = 1;
					//(Use the Remeeting scene options.);
					if( CoC.player.lust >= 33 ) {
						sex = this.sexWithAmily;
					}
					if( sex !== null ) {
						EngineCore.choices( 'Sex', this, sex, 'Talk', this, this.talkToAmily, 'Both', this, this.talkThenSexWithAmily, '', null, null, '', null, null );
					} else {
						EngineCore.choices( '', null, null, 'Talk', this, this.talkToAmily, '', null, null, '', null, null, '', null, null );
					}
					return;
				}
			}
			//[Herm to Female];
			else if( CoC.player.gender === 2 ) {
				//Low Affection:;
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( '"<i>Well, I guess it\'s nice to see another woman around... though I could have used you as all male. So, do you want to talk?</i>" Amily asks.\n\n', false );
					//(Amily gains a small amount of Affection, begin the Female variant of Amily's quest.);
					CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 2;
					EngineCore.doNext( this, this.talkToAmily );
					return;
				}
				//Medium Affection:;
				else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( '"<i>You didn\'t need to change yourself for my sake... but, I do like having somebody who can really understand what life in this world is like.</i>" Amily notes.', false );
					//(Amily's affection remains unchanged, but the quest switches to the female variant.);
				}
				//High Affection:;
				else {
					MainView.outputText( 'Amily looks kind of disappointed. "<i>I will always love you no matter who you are, but... I was kind of used to that nice cock of yours, love.</i>" She shakes her head. "<i>Ah, well, if it\'s you, then sex is sex to me.</i>" She smiles.', false );
					//Set love confession to: GO!;
					CoC.flags[ kFLAGS.AMILY_CONFESSED_LESBIAN ] = 2;
				}
			}
			//[Any to Genderless];
			else {
				//Low Affection:;
				if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
					MainView.outputText( 'She looks at you in disdain. "<i>How can you be so stupid as to completely remove all gender from yourself? Get out of my sight and don\'t come back until you\'re one gender or the other again!</i>" She then proceeds to storm off.\n\n', false );
					//(Amily will repeat this scene on each remeeting until the player becomes a gender other than Genderless.);
				} else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
					MainView.outputText( 'She shakes her head sadly. "<i>I guess this kind of puts a kink in our relationship, doesn\'t it? Still, I\'ll always be willing to talk with you.</i>"\n\n', false );
					//(The player can only Talk with Amily on each remeeting until they have become a gender other than Genderless.);
				}
				//High Affection:;
				else {
					MainView.outputText( 'She looks upset and concerned - but for your sake, not hers. "<i>I can\'t imagine what catastrophe robbed you like this. Please, find a way to change yourself back? Man, woman, even herm, I can\'t bear to see you like this... but I\'ll give you all the support I can.</i>"\n\n', false );
					//(The player can only Talk with Amily on each remeeting until they have become a gender other than Genderless.);
				}
			}
		}
		//Genderless tooo;
		else {
			//[Low Affection];
			if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 15 ) {
				MainView.outputText( 'Amily looks at you with disdain, but you can\'t help but notice just a small tinge of relief at seeing you have a ', false );
				if( CoC.player.hasCock() ) {
					MainView.outputText( Descriptors.cockDescript( 0 ), false );
					if( CoC.player.hasVagina() ) {
						MainView.outputText( ' and ', false );
					}
				}
				if( CoC.player.hasVagina() ) {
					MainView.outputText( Descriptors.vaginaDescript(), false );
				}
				MainView.outputText( '. "<i>Maybe you\'re not that stupid after all,</i>" mutters the mouse before she flounces off.', false );
				//{CoC.player normal encounter options};
			}
			//[Medium Affection];
			else if( CoC.flags[ kFLAGS.AMILY_AFFECTION ] < 40 ) {
				MainView.outputText( 'She notices you have a ', false );
				if( CoC.player.hasCock() ) {
					MainView.outputText( Descriptors.cockDescript( 0 ), false );
					if( CoC.player.hasVagina() ) {
						MainView.outputText( ' and ', false );
					}
				}
				if( CoC.player.hasVagina() ) {
					MainView.outputText( Descriptors.vaginaDescript(), false );
				}
				MainView.outputText( ', and she smiles at you. "<i>I guess this means we can continue with our task?</i>" You nod in affirmation.  The mouse-girl nods, but turns to leave.  It seems she needs a little time to adjust to this new development.\n\n', false );
				//{normal encounter options};
			}
			//[High Affection];
			else {
				MainView.outputText( 'When Amily gazes upon your regained genitals, she instantly hugs you and gives you a deep kiss; ', false );
				if( CoC.player.hasCock() ) {
					MainView.outputText( 'bringing your ' + Descriptors.cockDescript( 0 ) + ' to erection', false );
				}
				if( CoC.player.hasVagina() && CoC.player.hasCock() ) {
					MainView.outputText( ' and ', false );
				}
				if( CoC.player.hasVagina() ) {
					MainView.outputText( 'earning a clench from your ' + Descriptors.vaginaDescript( 0 ), false );
				}
				MainView.outputText( '.  "<i>I\'m so glad you\'ve recovered a gender!</i>"\n\nAmily turns and stalks off with a spring in her step.  Clearly she\'s happy, but she still needs some time to get used to it.', false );
				//{normal encounter options};
				EngineCore.dynStats( 'lus', 25 + CoC.player.sens / 10 );
			}
		}
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//'Why Not Herms?' (Req medium 'like');
	AmilyScene.prototype.whyNotHerms = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'As you head into the ruined village to find Amily, your thoughts drift yet again to the strange conundrum that has been puzzling you. You haven\'t failed to realize that Amily initially seemed to want to talk to you about her plans for reviving her people, but after realizing your bi-gendered nature, she insists on dropping the subject if it ever comes up.', false );
		MainView.outputText( '\n\nYou are so intent on asking her why it is that she doesn\'t want to talk about it that you almost walk into her.', false );
		MainView.outputText( '"<i>You looked deep in thought; what\'s the matter?</i>" She asks.\n\n', false );
		MainView.outputText( 'You remind her of how, when you first met, she spoke of her having to take "<i>a role</i>" in freeing her people, and how she was about to ask you for help, but she stopped when she realized you were a hermaphrodite.\n\n', false );
		MainView.outputText( 'Amily looks at the ground, scuffing it idly with one pink claw. "<i>I did, yes... The role? Well, I\'ve been forced to realize that there just aren\'t any of my people left in freedom - they\'re all dead or slaves to the demons. If there are any out there, they\'re too far away for it to make any difference to me. So, I came to the decision; if I am the last of the free mice in this land, then I must take whatever steps are neccessary to restore my people. Even if it means becoming the mother of a whole new generation of them.</i>"\n\n', false );
		MainView.outputText( 'You ask if that is why she was particularly interested in you being human.\n\n', false );
		MainView.outputText( '"<i>Yes. I\'ve heard that humans are both inherently pure and very weak-seeded; if I could find a human man before the demons caught him, he would be the perfect mate to help me with that goal, because the children he fathered on me would be pure in both senses.</i>"\n\n', false );
		MainView.outputText( 'Crossing your arms, you sarcastically ask what you are; chopped liver?\n\n', false );
		MainView.outputText( 'Amily stands up and does her best to look you in the eyes, crossing her arms as well. "<i>You\'re not a man - you\'re a hermaphrodite. I can\'t lie with you - what if the babies inherit that trait?</i>"\n\n', false );
		MainView.outputText( 'You ask if that wouldn\'t be an advantageous trait, allowing each individual to both impregnate and be impregnated and letting their population swell all the faster.\n\n', false );
		MainView.outputText( '"<i>But it\'s unnatural!</i>" She barks... well, squeaks indignantly, anyway. "<i>Women with cocks, men with cunts - before those fucking demons, you never saw creatures like that! They\'re not normal! I mean, you don\'t seem to be a bad person, but I could never have sex with someone like that!</i>"\n\n', false );
		MainView.outputText( 'At that, she turns and runs off, quickly vanishing into the rubble. You choose not to pursue; it seems she\'s clearly not in the mood to talk about it.\n\n', false );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		CoC.flags[ kFLAGS.AMILY_HERM_QUEST ]++;
	};
	//'Maybe Herms Aren\'t So Bad':;
	AmilyScene.prototype.maybeHermsAintAllBadBITCH = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'Yet again, you find yourself wandering through the ruined village where Amily stalks. Not entirely sure if you want to speak to her, you turn and are about to leave when you hear the sound of a rock plinking off of a wall. Looking around, you find Amily has joined you, looking apologetic.\n\n', false );
		MainView.outputText( '"<i>I... I want to say that I\'m sorry. I was a real asshole, in that conversation, but... I\'ve seen so many others mutated into herms to become mindless fucktoys, or who could only think about sex after they became herms. I\'ve never met somebody who had two genders and could think about anything besides pussy and dick... until I met you, anyway.</i>"\n\n', false );
		MainView.outputText( 'She pointedly looks away from you, blushing slightly. "<i>I\'ve been thinking, about things. About us. And... well, even if you are a herm, you\'ve been the only friend I\'ve had in years. If you can find it in your heart to forgive me... I\'d like you to be the father of my children.</i>" She stares at you, eyes wide and hopeful. "<i>What do you say?</i>"\n\n', false );
		var noFurry = null;
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			noFurry = this.amilyNoFur;
		}
		EngineCore.choices( 'Yes', this, this.beAmilysDadAsAHerm, 'No', this, this.fuckNoYouWontBeAmilysHermDaddy, 'NoFurry', this, noFurry, '', null, null, '', null, null );
	};
	//[=Yes=];
	AmilyScene.prototype.beAmilysDadAsAHerm = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		CoC.flags[ kFLAGS.AMILY_HERM_QUEST ] = 2;
		MainView.outputText( 'You tell her that you\'ll forgive her, and you will help her breed the ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'free mousemorphs that she wants so badly. She looks a bit confused by you using the term \'mouse-morphs\', but otherwise seems happy.' : '') + ' "<i>Wonderful! Come with me!</i>" She says, grabbing your hand and pulling you down the street.\n\n', false );
		//(Play out 'First Sex' scene, with whatever tweaks are needed to account for the PC's hermaphroditic nature.);
		EngineCore.doNext( this, this.amilySexHappens );
	};
	//[=No=];
	AmilyScene.prototype.fuckNoYouWontBeAmilysHermDaddy = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You scoff at her, and tell her that she called you a freak of nature, an unnatural demon-crafted thing. You have no interest in having sex with somebody who thinks of you as some kind of breeding toy.\n\n', false );
		MainView.outputText( 'Amily winces, looking deeply hurt. "<i>I... You\'re right, what I said was unforgivable. I... think it\'s best that we part ways.</i>"\n\n', false );
		MainView.outputText( 'Looking deeply sad, she turns and walks away, vanishing into the urban wilderness in that way only she can. Instinctively, you realize that you will never see her again.', false );
		CoC.flags[ kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED ] = 1;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Conversation: Efficiency;
	//(Requires: Player is a herm, CoC.player has at least one Purified Incubus Draft, chose the 'Talk' or 'Talk & Sex' option from the Remeeting scene, Amily is High Affection);
	AmilyScene.prototype.makeAmilyAHerm = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You talk to Amily about how she and you have grown to know each other well, so well that she has been willing to have sex with you despite her aversion to hermaphrodites.\n\n', false );
		MainView.outputText( '"<i>That\'s true... I... I can\'t say I can understand what life must be like for you like that.</i>" She admits.\n\n', false );
		MainView.outputText( 'You ask if she would be willing to try and see your view on things - you happen to have a vial of Incubus Draft from which the tainting elements have been removed.\n\n', false );
		MainView.outputText( 'She looks very nervous. "<i>I... I mean... I don\'t really want to do that.</i>"\n\n', false );
		MainView.outputText( 'You point out that it would be for the best for her plans; this way, the two of you will be able to bear litters simultaneously, so she can have children even faster and in greater numbers than before. Giving her a winning smile, you clasp hold of her hands gently and ask if she\'ll please consider doing it; for you?\n\n', false );
		MainView.outputText( 'Amily looks crestfallen, then finally nods her head, slowly. "<i>I... I\'m not really sure about this, but... if it\'s for you, ' + CoC.player.short + ', then... I\'ll do it.</i>" She takes the vial, staring at it apprehensively, then pops the cork and swallows it down quickly in a single gulp. She shudders - first in disgust at what she actually drank, then with pleasure. Moaning ecstatically, she ' + (this.pregnancy.event >= 6 ? 'lifts her shirt' : 'pulls off her pants') + ' to give you a full view as her clitoris swells, longer and thicker; finally, skin peels back at the tip to reveal what is unmistakably the glans of a penis, complete with a cum-gouting slit as she experiences her first male orgasm.\n\n' );
		MainView.outputText( 'Amily is now a hermaphrodite. Her human-like penis is four inches long and one inch thick.\n\n', false );
		MainView.outputText( 'Catching her breath, she ' + (this.pregnancy.event >= 6 ? 'tries to get a look at her new member over her bulging belly. When that fails she runs her hand over it, touching it carefully while maintaining an unreadable expression. Then she stares at you and says, ' : 'stares at her new appendage with an unreadable expression, then she stares at you.') + ' "<i>Well, now I\'ve got a penis... so that means you\'re coming with me to let me try it out!</i>"\n\n', false );
		MainView.outputText( 'You agree, and allow her to begin leading you to the "<i>bedroom</i>".', false );
		CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] = 4;
		CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ] = 1;
		CoC.player.consumeItem( ConsumableLib.P_DRAFT );
		//[Herm Amily on Female PC, First Time, scene plays];
		EngineCore.doNext( this, this.hermilyOnFemalePC );
	};
	//ENHANCED CAMP FOLLOWER SHIT;
	//Player gives Birth (SceneLib.camp follower version):;
	AmilyScene.prototype.playerBirthsWifAmilyMiceInCamp = function() {
		this.amilySprite();
		MainView.outputText( 'You wake up suddenly to strong pains and pressures in your gut. As your eyes shoot wide open, you look down to see your belly absurdly full and distended. You can feel movement underneath the skin, and watch as it is pushed out in many places, roiling and squirming in disturbing ways. The feelings you get from inside are just as disconcerting. You count not one, but many little things moving around inside you. There are so many, you can\'t keep track of them.\n\n', false );
		MainView.outputText( 'Pain shoots through you as they pull open your cervix forcefully, causing you to cry out involuntarily. At once, Amily suddenly appears, racing over from across the camp. "<i>Is it time? Are you going into labor?</i>" She asks, worry evident in her voice.\n\n', false );
		MainView.outputText( 'You grunt in affirmation with a trace of irritation; ', false );
		//Repeat brood;
		if( CoC.flags[ kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS ] > 0 ) {
			MainView.outputText( 'this is hardly the first time you\'ve given birth to her offspring before, after all', false );
		}
		//First time!;
		else {
			MainView.outputText( 'she\'s probably just glad you\'re the one that has to push them all out', false );
		}
		MainView.outputText( '. However, any more detailed reply you may have been inclined to make to that is swallowed by another cry of pain as yet another contraction wrings its way through you. Amily takes your hand in hers and you cling to the lifeline of comfort it offers, thankful to not be alone for this. You can feel the first child moving out of your womb, through your cervix, down and into your ' + Descriptors.vaginaDescript() + '. Your lips part and, with a grunt, you expel the first child into Amily\'s waiting hand. She holds it up to you so that you can see your firstborn; it\'s a little mouselet' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? ', naked, pink, and totally hairless' : '') + '. Amily helps hold it to your ' + Descriptors.chestDesc() + ', where it eagerly takes hold of your ' + Descriptors.nippleDescript( 0 ) + ' and starts to suckle. As it drinks, it starts to grow larger' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? ', and fur the same color as your own hair starts to cover its body' : '') + '. It quickly drinks its fill and then detaches, its \'father\' putting it aside, which is good, because by this time there\'s another baby waiting for its turn... and another... and another...\n\n', false );
		MainView.outputText( 'Soon, you are back to your old self again, lying down in exhaustion with Amily sitting nearby, your many rambunctious offspring already starting to walk and play around you. However, you notice that they are a little less large and energetic than the other times you have seen them born and grow in such a fashion.\n\n', false );
		MainView.outputText( '"<i>Because there are only trace elements of those chemicals left in our bodies, they should age normally from this point on.</i>" Amily notes.\n\n', false );
		MainView.outputText( 'Worry fills you; how on earth are you going to take care of such small, defenseless creatures in a place like this? Before you can voice such concerns to Amily, though, rustling in the bushes catches your attention. As you watch, a pair of young ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'mouse-morphs' : 'mouse fellows') + ' appear and walk confidently into your camp. They\'re two of your children, the ones who Amily told you had left the area.\n\n', false );
		MainView.outputText( '"<i>I hope you don\'t mind, ' + CoC.player.short + ', but I contacted them to come and take their new siblings back with them shortly after you told me you were pregnant.</i>" Amily says, sheepishly. "<i>We just can\'t really care for them here, and they\'ll be safer and happier with all their siblings.</i>"\n\n', false );
		MainView.outputText( 'You nod your head and admit that you agree. Once you have regained your strength, you spend some time talking with your fully adult children and playing with your overdeveloped newborns. Then, with a final wave goodbye, the ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'mouse-morphs' : 'family of mice') + ' disappear into the wilderness once more.', false );
		//Add to brood size count;
		CoC.flags[ kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS ]++;
	};
	//Amily gives Birth (SceneLib.camp follower version):;
	AmilyScene.prototype.amilyPopsOutKidsInCamp = function() {
		this.amilySprite();
		CoC.flags[ kFLAGS.AMILY_BIRTH_TOTAL ]++;
		//Uncorrupt;
		if( CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 ) {
			MainView.outputText( '\nThe peace of your camp is suddenly disrupted by a loud squeal of distress. "<i>' + CoC.player.short + '! It\'s time!</i>" Amily cries out, then shrieks again - there is no question at all in your mind that she\'s gone into labor.  You race over to find her squatting naked over her nest, squealing softly with exertion as her swollen abdomen visibly ripples, fluid dripping from her swollen, naked, pink vagina. She is definitely in labor.\n\n', false );
			MainView.outputText( 'Falling into routine, you kneel beside her, reaching out to touch her swollen middle, one hand on either side of its globular mass. You gently start to massage it, trying to relax and soothe the muscles after each time they clench and to lower the pain when they do experience another contraction. She starts to thank you, then clenches her teeth, ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'turns her little ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'muzzle' : 'lips') + ' skywards and ' : '') + 'hisses in pain as the strongest contraction yet hits - she\'s crowning! Immediately your hands dive down to hover under her vagina as a small, pink, naked, wriggling thing slips between their parted lips. The little body is surprisingly light in your hands, but it squeaks loudly as it draws its first breath.\n\n', false );
			MainView.outputText( 'You favor your lover with a reassuring smile, placing the baby to her breast with the practice of experience, then resume catching the next one to emerge from her.\n\n', false );
			MainView.outputText( 'There\'s definitely as many this time as there was the last time you saw her pregnant, and soon they are all resting alongside their weary mother in the nest of grasses and leaves. However, you notice that they are a little smaller and less energetic than the other times you have seen them born and grow in such a fashion.\n\n', false );
			MainView.outputText( '"<i>Because there are only trace elements of those chemicals left in my bloodstream, they developed and grew a little faster than normal, but they should age normally from this point on.</i>" Amily notes.\n\n', false );
			MainView.outputText( 'Worry fills you; how on earth are you going to take care of such small, defenseless creatures in a place like this? Before you can voice such concerns to Amily, though, rustling in the bushes catches your attention. As you watch, a pair of young ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'mouse-morphs' : 'mouse fellows') + ' appear and walk confidently into your camp. They\'re two of your children, the ones who Amily told you had left the area.\n\n', false );
			MainView.outputText( '"<i>I hope you don\'t mind, ' + CoC.player.short + ', but I contacted them to come and take their new siblings back with them shortly after we confirmed I was pregnant.</i>" Amily says, sheepishly. "<i>We just can\'t really care for them here, and they\'ll be safer and happier with all their siblings.</i>"\n\n', false );
			MainView.outputText( 'You nod your head and admit that you agree. Once you have regained your strength, you spend some time talking with your fully adult children and playing with your overdeveloped newborns. Then, with a final wave goodbye, the ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'mouse-morphs' : 'family of mice') + ' disappear into the wilderness once more.', false );
		}
		//CORRUPT!;
		else {
			//Start incest countdown timer!;
			if( CoC.flags[ kFLAGS.AMILY_INCEST_COUNTDOWN_TIMER ] === 0 ) {
				CoC.flags[ kFLAGS.AMILY_INCEST_COUNTDOWN_TIMER ] = 1;
			}
			MainView.outputText( 'You decide to go and speak to your heavily-pregnant mousy slut, but as you approach the particular patch of greenery that she tends to lurk in, you find she has other things on her mind...\n\n', false );
			MainView.outputText( '"<i>Yes! Ooh, yes, yes, yes! Ah, so good - that\'s it, babies, stretch your momma\'s dirty cunt for her! Out, out, little ones; ' + CoC.player.mf( 'master', 'mistress' ) + ' needs lots of new mousey sluts to worship ' + CoC.player.mf( 'him', 'her' ) + ' like ' + CoC.player.mf( 'he', 'she' ) + ' deserves!</i>" Amily squeals in ecstasy, tail lashing at her surroundings like a whip and wings flapping madly. She is squatting in the clearing with her back to you, a mixture of feminine lubricant and amniotic fluid visibly pouring from her dilated cunt - she is quite evidently in labor, and loving every moment of it.', false );
			//(If Amily is herm:;
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( '  She has hold of her cock with both hands and is furiously jacking herself off, spurts of cum spilling like a fountain; then spattering onto her heaving breasts, face and belly, even though her erection refuses to die away.', false );
			}
			//[If Amily has balls:;
			if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] > 0 ) {
				MainView.outputText( '  Her testicles shake and quiver, swaying in the breeze as the pussy behind them readies itself to disgorge the life crammed into her swollen stomach above.', false );
			}
			MainView.outputText( '  Her eyes are rolled up in her head and her face is contorted into an expression of unholy orgasmic delight.\n\n', false );
			MainView.outputText( 'With a lewd moan, Amily pants, "<i>Yes, it\'s coming! It\'s coming!!</i>" Then she loses her balance and falls onto her back, her legs spreading wide; as if she wanted the whole world to see what\'s about to take place. And then it begins... A gush of fluids', false );
			//[(if Amily has a dick);
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( ' followed by a spurt of cum', false );
			}
			MainView.outputText( ' signals the coming of the first mouse. The head topped with wide mousy ears appears from between Amily\'s stretched lips, its small hands follow in suit;', false );
			//[(if Amily has balls);
			if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] > 0 ) {
				MainView.outputText( ' it grabs Amily\'s balls and uses them to try and pull itself out;', false );
			}
			MainView.outputText( ' its efforts to leave its mother\'s leaking canal are finally paid off when a jet of fluids slicken its lower half, making its exit easier. As soon as it\'s out, another mousy head starts showing; Amily moans and screams her pleasure as the process repeats itself over and over.\n\n', false );
			MainView.outputText( 'When the last ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'mouse' : 'mouse-girl') + ' is finally free of the confines of its slutty mother\'s cunt, they all crawl up towards their mother\'s breasts and each takes their turn drinking from their mother\'s corrupt milk. You just smile and observe; Amily\'s babies come in various flavors, some are girls, some are boys, and some are even both; they all share the same lewd purple ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'fur' : 'skin tone') + ' of their mother; you can\'t help but wonder if they\'ll be wonderful cum-sluts like their mother. As they drink, you see the little babies grow bigger; and that\'s not all, you see little cocks getting bigger, balls developing, breasts expanding, pussies juicing up.  The sight fills you with joy.\n\n', false );
			MainView.outputText( 'Several children have their fill, but some are still in line.  "<i>' + CoC.player.mf( 'Master', 'Mistress' ) + '...</i>" You hear Amily call between pants and moans of delight. You give her an inquisitive look. "<i>Can I drink from you? Your sexy fucktoy bitch needs more food to turn into delicious milk for your newly born sluts.</i>"\n\n', false );
			//(if PC is genderless);
			if( CoC.player.gender === 0 ) {
				MainView.outputText( 'You tell Amily that right now you can\'t feed her, so she\'ll have to make do with what she has. Amily pouts, but carries on. You chuckle and leave her with an order. "<i>Make sure to train them into proper sluts, Amily, then let them go so they can gain some field experience,</i>" You say, "<i>Yes, ' + CoC.player.mf( 'master', 'mistress' ) + '.</i>" Amily says. You turn and leave them to their own devices.', false );
				return;
			}
			//Herm get to pick if they want to use their pussies or dicks.;
			//Should Amily drink from your cock or your pussy?;
			//[=Cock=];
			if( CoC.player.hasCock() && (CoC.player.gender === 1 || Utils.rand( 2 ) === 0) ) {
				MainView.outputText( 'You smile and undress, showing Amily ', false );
				MainView.outputText( 'your erect ' + Descriptors.cockDescript( 0 ), false );
				if( CoC.player.hasVagina() ) {
					MainView.outputText( ' and ' + Descriptors.vaginaDescript( 0 ), false );
				}
				MainView.outputText( '; Amily licks her lips in anticipation. You kneel above her head and let her tongue stretch out to lick the tip of your ' + Descriptors.cockDescript( 0 ) + ', then pull it inside her maw. Even in her awkward position, she still manages to effectively blow you, working her delicious tongue in all the right places that she\'s become so familiar with. Amily\'s practiced suckles and slurps soon have you at the edge of orgasm, and in no time you cross that edge, shooting rope after rope of hot jism down Amily\'s eager and hungry throat.', false );
				//[(if PC has large cum amount);
				if( CoC.player.cumQ() >= 500 ) {
					MainView.outputText( '  Her belly distends, but she continues drinking and suckling as efficiently as ever; making sure not to spill even a single drop of her ' + CoC.player.mf( 'master', 'mistress' ) + '\' precious seed; the sight is enough to make you swell with pride at how seriously Amily takes her job; you decide to reward her with even more spunk.', false );
				}
				MainView.outputText( '\n\n', false );
			}
			//[=Pussy=];
			else {
				MainView.outputText( 'You smile and undress, showing Amily ', false );
				if( CoC.player.hasCock() ) {
					MainView.outputText( 'your erect ' + Descriptors.cockDescript( 0 ) + ' and ', false );
				}
				MainView.outputText( Descriptors.vaginaDescript(), false );
				MainView.outputText( '; Amily licks her lips in anticipation. You squat above Amily, hovering over her ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'muzzle' : 'face') + '.', false );
				//[(if PC has balls);
				if( CoC.player.balls > 0 ) {
					MainView.outputText( '  She gives your balls a teasing lick, tickling you; impatient, you tell her to get on with it before you change your mind and go fuck something else.', false );
				}
				MainView.outputText( '  Amily wastes no time and digs right into her task. Her tongue explores every cranny and nook of your ' + Descriptors.vaginaDescript() + '; it\'s as if she had a map of every little detail of your pleasure hole; no doubt a result of all the practice you\'ve given her. Every once in a while her nose bumps against your ' + Descriptors.clitDescript() + ', sending shocks of pleasure running through your body and extracting a moan of pleasure from you, as you edge ever closer to orgasm.', false );
				//[(if PC is a squirter);
				if( CoC.player.wetness() >= 5 ) {
					MainView.outputText( '  Amily has no problem dealing with the constant jets of girl-cum that spill from your pussy, in fact she does all she can to make sure you shoot as many of those as possible into her hungry maw; you\'re pleased to notice that not even a small drop escapes her searching tongue and slurping maw.', false );
				}
				MainView.outputText( '\n\n', false );
			}
			//both variations continue into this next paragraph;
			MainView.outputText( 'When you\'re done, you realize the last of Amily\'s children has already had its fill.  Your children look in awe between their mother\'s smiling face and your saliva coated groin. As you rise to your feet and Amily rises to kneel beside you, the children eye you with reverence.\n\n', false );
			MainView.outputText( 'Amily nuzzles your crotch affectionately before saying, "<i>Look ' + CoC.player.mf( 'master', 'mistress' ) + ', our children are already eager to serve you.</i>" You look down at her and she looks up at you. Then finally Amily turns to address the gathered children, "<i>Sorry, my dears, but you\'re not yet ready to serve the ' + CoC.player.mf( 'master', 'mistress' ) + '. If you want some of this...</i>" She says, nuzzling your crotch once more, "<i>You will need to have some experience first.</i>"  The children all look down and whine in disappointment, sad that they won\'t get anywhere near their mother\'s treasure. "<i>Now, now, don\'t despair, my beautiful budding sluts. If you go out into the world, I\'m sure you\'ll gather the experience needed to serve the ' + CoC.player.mf( 'master', 'mistress' ) + ' in no time. Now give mommy a goodbye kiss.</i>"\n\n', false );
			MainView.outputText( 'The mice quickly perk up and rush towards Amily, and she takes turns giving each of them a kiss; then sending each of them off towards the jungle with a playful slap on their little butts. When the last one has left, you congratulate Amily on being a good slut and giving birth to so many cute potential toys, "<i>Thank you ' + CoC.player.mf( 'master', 'mistress' ) + '!</i>" she says happily. Then she nuzzles your crotch once more and adds, "<i>If ' + CoC.player.mf( 'master', 'mistress' ) + ' wants to knock me up again, just say so. Your mousey cunt-slut is always ready to receive and deliver even more sluts to worship you and join your harem, my ' + CoC.player.mf( 'master', 'mistress' ) + '.</i>" You pat her head and leave to attend to other affairs.', false );
			CoC.player.orgasm();
			EngineCore.dynStats( 'cor', 3 );
		}
	};
	//'Make Children' Lovemaking Option:;
	AmilyScene.prototype.makeChildren = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		if( CoC.flags[ kFLAGS.AMILY_ALLOWS_FERTILITY ] === 1 ) {
			MainView.outputText( 'You ask Amily if she wouldn\'t mind going back on her herbs for now.  The mousegirl snickers and asks, "<i>Had enough babies huh?</i>" before she gives you a knowing wink.  Amily assures you, "<i>Don\'t worry ' + CoC.player.short + ', we\'ve brought more than enough life into the world.  I don\'t mind a break from it.</i>"', false );
			CoC.flags[ kFLAGS.AMILY_ALLOWS_FERTILITY ] = 0;
		} else {
			MainView.outputText( 'You smile winningly at Amily, and tell her you have something a little different in mind. You want to have another litter with her.\n\n', false );
			MainView.outputText( 'Amily looks startled. "<i>You want... children? More children, I mean?</i>" She asks, hesitantly. You confirm, and she looks happy. "<i>Thank you... If you really do want them, then I\'ll stop using those herbal contraceptives. Let\'s see what happens then...</i>" She trills, idly tracing a circle on your chest with her little claw. She turns and leads you towards the nest, tail waving eagerly.\n\n', false );
			CoC.flags[ kFLAGS.AMILY_ALLOWS_FERTILITY ] = 1;
		}
		EngineCore.doNext( this, this.amilyFollowerEncounter );
	};
	//[Revised Corrupt Meeting];
	//Requires PC have done first meeting and be corrupt;
	AmilyScene.prototype.meetAmilyAsACorruptAsshat = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'Curious about how Amily is holding up, you head back into the ruined village. This time, you don\'t bother making any secret of your presence, hoping to attract Amily\'s attention quicker. After all, she did say that the place is basically empty of anyone except her, and you can handle a measly Imp or Goblin.\n\n', false );
		switch( this.pregnancy.event ) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: //Amily is slightly pregnant
				MainView.outputText( 'Amily materializes out of the ruins, somewhat slower than usual. You can see that your efforts together have taken; an undeniable bulge pokes out of her midriff, pushing up her tattered shirt slightly and seriously straining her belt. She idly strokes it with one hand, as if confirming its presence to herself.\n\n', false );
				break;
			case 6:
			case 7:
			case 8: //Amily is heavily pregnant
				MainView.outputText( 'It takes several minutes before Amily appears - but when you can see her, you marvel that she got to you as quickly as she did. Her stomach is hugely swollen, and one of her hands actually cradles underneath its rounded expanse as if trying to hold it up. She is pantsless, evidently no longer able to fit into them with this firm orb of a belly, and her shirt drapes loosely, barely managing to cover its upper half. Her belt, where she hangs her blowpipe and dagger, has been tied around her upper chest, between her breasts and her bulge, so she can still carry them effectively.\n\n', false );
				break;
			default: //Amily is not pregnant
				MainView.outputText( 'It doesn\'t take long for Amily to materialize out of the ruins. Her blowpipe and dagger are both thrust into her belt, and she\'s still wearing the same tattered clothes as before.\n\n', false );
		}
		MainView.outputText( '"<i>Hey there, ' + CoC.player.short + ', how... are you?</i>" She trails off with a troubled expression. "<i>You seem different...</i>" She murmurs, studying you intently, and then she obviously comes to a sudden realization. "<i>Have you had contact with demons!? You... This feeling... You\'re corrupted!</i>" You take a step towards her, causing her to leap back. "<i>N-No! Stay away!</i>" She yells, hand darting towards her blowpipe. She spits a dart right at you!\n\n', false );
		//(if PC doesn't have the perk Evasion or Feline Flexibility);
		if( CoC.player.findPerk( PerkLib.Evade ) < 0 && CoC.player.findPerk( PerkLib.Flexibility ) < 0 ) {
			MainView.outputText( 'Amily\'s sudden reaction catches you off guard and the dart hits you; almost immediately you feel your body going stiff. Amily doesn\'t even wait to see if she hit you or not before running away, yelling back at you.\n\n', false );
			MainView.outputText( '"<i>Don\'t come near me again!  You\'re tainted, ruined!</i>" Her voice is panicked, as she disappears into the ruins.\n\n', false );
			MainView.outputText( 'It takes almost two hours before you are able to move again, and your joints are still stiff and painful as you hobble back to camp, cursing that mouse. Maybe you should teach her not to mess with you.\n\n', false );
			//-(if PC's int >= 40);
			if( CoC.player.inte >= 40 ) {
				MainView.outputText( 'You begin to formulate a plan, but to put this plan into motion you\'ll require a Lust Draft and some Goblin Ale. That damn rat is going to rue the day she denied you.\n\n', false );
			}
			//-(else);
			else {
				MainView.outputText( 'You think about some of the more interesting potions you found while exploring; perhaps you could use some of them...', false );
			}
		}
		//(else);
		else {
			MainView.outputText( 'Despite Amily\'s fast reactions, they\'re no match for your trained reflexes; you bend just enough for the dart to barely graze you. Amily doesn\'t even wait to see if she hit you or not before running away, yelling back at you.\n\n', false );
			MainView.outputText( '"<i>Don\'t come near me again!  You\'re tainted, ruined!</i>" Her voice is panicked, as she disappears into the ruins.\n\n', false );
			MainView.outputText( 'That stupid cunt; how dare she attack you after asking you to help her! So what if you are aren\'t so pure anymore; you\'re still very much capable of helping her! Maybe you should teach her not to mess with you...?\n\n', false );
			//-(if PC's int >= 40);
			if( CoC.player.inte >= 40 ) {
				MainView.outputText( 'You begin to formulate a plan, but to put this plan into motion you\'ll require a Lust Draft and some Goblin Ale. That damn rat is going to rue the day she denied you.\n\n', false );
			}
			//-(else);
			else {
				MainView.outputText( 'You think about some of the more interesting potions you found while exploring; perhaps you could use some of them...', false );
			}
		}
		EngineCore.dynStats( 'lus', 25 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		//FLAG THAT THIS SHIT WENT DOWN;
		CoC.flags[ kFLAGS.AMILY_CORRUPT_FLIPOUT ] = 1;
	};
	//[Cooking the drug];
	//This happens when going inside the village while at or above 25 Corruption.;
	//Only once.;
	//Potent Mixture key-item added to inventory.;
	//Takes 1 hour.;
	AmilyScene.prototype.cookAmilyASnack = function() {
		MainView.outputText( '', true );
		//[Cooking the drug - repeat];
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00169 ] > 0 ) {
			//After raping Amily for the first time, she is commited to the path of corruption.;
			//Used to get to stage 2 and 3 of corruption, for stage 4 PC only needs the correct amount of Corruption.;
			//Potent Mixture key-item added to inventory.;
			//Takes 1 hour.;
			//(if PC doesn't have the required items);
			if( !(CoC.player.hasItem( ConsumableLib.L_DRAFT ) || CoC.player.hasItem( ConsumableLib.F_DRAFT )) || !CoC.player.hasItem( ConsumableLib.GOB_ALE ) ) {
				MainView.outputText( 'You think about going into the Ruined Village, but you don\'t have the ingredients to create more of Amily\'s medicine. You return to your camp.', false );
				EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
				return;
			}
			//(if PC is genderless and has the ingredients.);
			else if( CoC.player.gender === 0 ) {
				MainView.outputText( 'You think about going into the Ruined Village, but without a cock or a pussy you can\'t complete the mixture. You return to your camp.', false );
				EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
				return;
			}
			//(else);
			else {
				MainView.outputText( 'You pick up a bowl and carefully pour the contents of the Lust Draft and Goblin Ale inside, then you produce a wooden branch and begin stirring the contents until they are mixed together. Then you dip a finger and have a taste; ', false );
				if( CoC.player.hasCock() ) {
					MainView.outputText( Descriptors.sMultiCockDesc() + ' jumps to attention ', false );
					if( CoC.player.hasVagina() ) {
						MainView.outputText( 'and ', false );
					}
				}
				if( CoC.player.hasVagina() ) {
					MainView.outputText( 'your ' + Descriptors.vaginaDescript() + ' moistens itself ', false );
				}
				MainView.outputText( 'in preparation for the next step.\n\n', false );
				//Herms will do male variant with something extra, then play the female variant.;
				//[Male];
				if( CoC.player.hasCock() ) {
					MainView.outputText( 'You begin to stroke your ' + Descriptors.cockDescript( 0 ) + ' vigorously, milking drop after drop of pre. With each stroke you think of how fun it\'ll be to fuck that rodent. You imagine her becoming a slut who lives only to breed and fuck; begging you to fuck her again and again, belly swollen with your offspring, swarms of her half-grown daughters clustering around and just as eager to fuck as their worthless whore of a mother... The thoughts spur you on, and soon send you over the edge; jet after jet of hot jism splatters the ground around you, painting it white. Remembering what you were going to do, you struggle to hold back one last jet; you keep holding back for far longer than you thought yourself capable, building this last jet especially for Amily\'s delight; the orgasmic sensations of pleasure continue rippling through you, but somehow you manage to kneel and aim yourself at the bowl. Finally you let go and dump a huge load of white hot spunk into the bowl, splattering some of its contents onto the ground.', false );
					//[(If PC is a herm.);
					if( CoC.player.hasVagina() ) {
						MainView.outputText( '  Not yet fully sated, you decide that it couldn\'t hurt to add something \'girly\' to the mixture...', false );
					}
					MainView.outputText( '\n\n', false );
				}
				//[Female];
				if( CoC.player.hasVagina() ) {
					MainView.outputText( 'You begin to stroke your ' + Descriptors.vaginaDescript( 0 ) + ' vigorously, pinching your clit and dripping all over the floor. Every time a new gush of fluids escapes your ' + Descriptors.vaginaDescript() + ', you think of how much fun you\'ll have with Amily. You\'ll have her lick you again and again until you pass out; perhaps you can even get her to grow a dick so the two of you can have more fun; after all, she\'s always going on and on about how she wants babies, well, she doesn\'t have to be the one carrying them does she? You imagine how it\'d be to get knocked up by Amily; your belly growing big with tiny mice as Amily\'s reduced to a pile of fuck and breed; incapable of doing anything but begging you for a good fucking. Just imagining this is enough to push you over the edge and your juices shower on the ground below you. It feels so good that you almost forget why you began masturbating in the first place. You squat above the bowl and begin pinching and massaging your clit, trying to draw one last burst of girlcum just for Amily; you hold back, intent on making this final orgasm extra pleasurable and extra-long. Finally you feel it hit you; you look down just in time to see your fluids splatter into the bowl; the heavy musk of sex fills the air around you, prolonging your orgasm and causing the bowl to overflow. You moan as the last of your fluids hit the bowl and overflow it.\n\n', false );
				}
				MainView.outputText( 'After taking a few minutes to rest you look inside the bowl; the mixture has become pinkish-white in color and it bubbles omniously. You take one of the empty bottles and fill it with as much of the mixture as you can, before putting the cork back and putting it back into your pouch. Now all you have to do is find Amily... You smile wickedly as you head back to camp.', false );
				//Consume items;
				if( CoC.player.hasItem( ConsumableLib.L_DRAFT ) ) {
					CoC.player.consumeItem( ConsumableLib.L_DRAFT );
				} else {
					CoC.player.consumeItem( ConsumableLib.F_DRAFT );
				}
				CoC.player.consumeItem( ConsumableLib.GOB_ALE );
				CoC.player.createKeyItem( 'Potent Mixture', 0, 0, 0, 0 );
				CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00169 ]++;
			}
		}
		//First Time;
		else {
			//(if PC doesn't have the required items and has >= 25 Corruption);
			if( !(CoC.player.hasItem( ConsumableLib.L_DRAFT ) || CoC.player.hasItem( ConsumableLib.F_DRAFT )) || !CoC.player.hasItem( ConsumableLib.GOB_ALE ) ) {
				MainView.outputText( 'You think about going into the Ruined Village, but decide it\'s best to wait until you have a plan underway (maybe some lust draft and a goblin ale to get the ball rolling... you return to your camp.', false );
				EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
				return;
			}
			//(else if the PC is genderless);
			else if( CoC.player.gender === 0 ) {
				MainView.outputText( 'You think about going into the Ruined Village, but decide to turn back; right now, you just don\'t have the proper \'parts\' to get the job done, and so you return to your camp.\n\n', false );
				EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
				return;
			}
			//(else);
			else {
				MainView.outputText( 'You pick up a bowl and carefully pour the contents of the ', false );
				if( CoC.player.hasItem( ConsumableLib.L_DRAFT ) ) {
					MainView.outputText( 'Lust Draft ', false );
				} else {
					MainView.outputText( 'Fuck Draft ', false );
				}
				MainView.outputText( 'and Goblin Ale inside, then you produce a wooden branch and begin stirring the contents until they are mixed together. Slowly you dip a finger and take a experimental lick; you\'re almost knocked back by the strong taste, your ', false );
				if( CoC.player.hasCock() ) {
					MainView.outputText( Descriptors.cockDescript( 0 ) + ' jumps up to attention', false );
				}
				if( CoC.player.hasCock() && CoC.player.hasVagina() ) {
					MainView.outputText( ', and your ', false );
				}
				if( CoC.player.hasVagina() ) {
					MainView.outputText( Descriptors.vaginaDescript() + ' nearly juices itself', false );
				}
				MainView.outputText( '.  You smile wickedly; no doubt this mixture is going to make that stupid cunt open her legs and beg for a good fucking; but you feel there\'s still something missing...\n\n', false );
				MainView.outputText( 'As you think about what could be missing your hand idly moves lower to stroke your ', false );
				if( CoC.player.hasCock() ) {
					MainView.outputText( Descriptors.cockDescript( 0 ), false );
				}
				if( CoC.player.hasCock() && CoC.player.hasVagina() ) {
					MainView.outputText( ' and ', false );
				}
				if( CoC.player.hasVagina() ) {
					MainView.outputText( Descriptors.vaginaDescript(), false );
				}
				MainView.outputText( '; then realization hits you. Of course! How could you forget to add some \'special sauce\' to the mixture....?\n\n', false );
				//Herms will do male variant with something extra, then play the female variant.;
				//[Male];
				if( CoC.player.hasCock() ) {
					MainView.outputText( 'You begin to stroke your ' + Descriptors.cockDescript( 0 ) + ' vigorously, milking drop after drop of pre. With each stroke you think of how fun it\'ll be to fuck that rodent. You imagine her becoming a slut who lives only to breed and fuck; begging you to fuck her again and again, belly swollen with your offspring, swarms of her half-grown daughters clustering around and just as eager to fuck as their worthless whore of a mother... The thoughts spur you on, and soon send you over the edge; jet after jet of hot jism splatters the ground around you, painting it white. Remembering what you were going to do, you struggle to hold back one last jet; you keep holding back for far longer than you thought yourself capable, building this last jet especially for Amily\'s delight; the orgasmic sensations of pleasure continue rippling through you, but somehow you manage to kneel and aim yourself at the bowl. Finally you let go and dump a huge load of white hot spunk into the bowl, splattering some of its contents onto the ground.', false );
					//[(If PC is a herm.);
					if( CoC.player.hasVagina() ) {
						MainView.outputText( '  Not yet fully sated, you decide that it couldn\'t hurt to add something \'girly\' to the mixture...', false );
					}
					MainView.outputText( '\n\n', false );
				}
				//[Female];
				if( CoC.player.hasVagina() ) {
					MainView.outputText( 'You begin to stroke your ' + Descriptors.vaginaDescript() + ' vigorously, pinching your clit and dripping all over the floor. Every time a new gush of fluids escapes your ' + Descriptors.vaginaDescript() + ', you think of how much fun you\'ll have with Amily. You\'ll have her lick you again and again until you pass out; perhaps you can even get her to grow a dick so the two of you can have more fun; after all, she\'s always going on and on about how she wants babies, well, she doesn\'t have to be the one carrying them does she? You imagine how it\'d be to get knocked up by Amily; your belly growing big with tiny mice as Amily\'s reduced to a pile of fuck and breed; incapable of doing anything but begging you for a good fucking. Just imagining this is enough to push you over the edge and your juices shower on the ground below you. It feels so good that you almost forget why you began masturbating in the first place. You squat above the bowl and begin pinching and massaging your clit, trying to draw one last burst of girlcum just for Amily; you hold back, intent on making this final orgasm extra pleasurable and extra-long. Finally you feel it hit you; you look down just in time to see your fluids splatter into the bowl; the heavy musk of sex fills the air around you, prolonging your orgasm and causing the bowl to overflow. You moan as the last of your fluids hit the bowl and overflow it.\n\n', false );
				}
				MainView.outputText( 'After taking a few minutes to rest you look inside the bowl; the mixture has become pinkish-white in color and it bubbles omniously. You take one of the empty bottles and fill it with as much of the mixture as you can, before putting the cork back and putting it back into your pouch. Now all you have to do is find Amily... You smile wickedly as you head back to camp.\n\n', false );
				//Consume items;
				if( CoC.player.hasItem( ConsumableLib.L_DRAFT ) ) {
					CoC.player.consumeItem( ConsumableLib.L_DRAFT );
				} else {
					CoC.player.consumeItem( ConsumableLib.F_DRAFT );
				}
				CoC.player.consumeItem( ConsumableLib.GOB_ALE );
				CoC.player.createKeyItem( 'Potent Mixture', 0, 0, 0, 0 );
				CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00169 ]++;
			}
		}
		CoC.player.orgasm();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	AmilyScene.prototype.sendCorruptCuntToFarm = function() {
		MainView.clearOutput();
		this.amilySprite();
		MainView.outputText( 'You tell your pet mouse that she is to head towards the lake, find a farm, present herself to the lady who works there and do as she says.' );
		MainView.outputText( '\n\n“<i>You’re... you’re sending me away?</i>” An expression of miserable horror dawns on Amily’s face. “<i>Have... have I done something to offend you [master]? Please punish me any way you see fit, I deserve it, but please don’t take me away from your glorious person!</i>” You laugh fondly.' );
		MainView.outputText( '\n\n“<i>This isn’t a punishment, but I need you to be doing more than sitting around diddling yourself to the thought of servicing me. I’ll visit often and keep you well fed, don’t worry about that - and all that farm work will make you nice and limber for when I’m throwing you around. Go on now.</i>” Slightly mollified but still looking uncertain, Amily gets up off her knees and trundles off in the direction of the lake.' );
		MainView.outputText( '\n\nShe will make a hard worker for Whitney, you think, but you doubt she will be much use protection wise.' );
		CoC.flags[ kFLAGS.FOLLOWER_AT_FARM_AMILY ] = 1;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	AmilyScene.prototype.backToCamp = function() {
		MainView.clearOutput();
		this.amilySprite();
		MainView.outputText( 'You tell her to head back to camp; there are things you need to do to her you can’t do whilst she’s here. Repeatedly. Amily bites her lip, trembling with excitement.' );
		MainView.outputText( '\n\n“<i>Immediately, [master]!</i>” You watch the purple blur disappear over the hill and laugh to yourself.' );
		CoC.flags[ kFLAGS.FOLLOWER_AT_FARM_AMILY ] = 0;
		EngineCore.doNext( SceneLib.farmCorruption, SceneLib.farmCorruption.rootScene );
	};
	AmilyScene.prototype.harvestMilk = function() {
		MainView.clearOutput();
		this.amilySprite();
		MainView.outputText( 'You tell Amily that you want her hooked up to a milking machine whenever possible; you need her fluids.' );
		MainView.outputText( '\n\n“<i>You want to use me like an animal, [master]? Drain my teats every day like the fuck-cow I am?</i>” Amily quivers, staining the ground beneath her with pussy juices at the thought.' );
		if( CoC.flags[ kFLAGS.FARM_UPGRADES_REFINERY ] === 0 ) {
			MainView.outputText( '\n\n“<i>I-I’m sorry though, master. The milk I produce wouldn’t be much use to you. Talk to Mistress Whitney, maybe she can be build a machine that can concentrate it.</i>”' );
		} else {
			MainView.outputText( '\n\n“<i>It will be an honor, [master]!</i>”' );
		}

		if( CoC.flags[ kFLAGS.FARM_UPGRADES_REFINERY ] === 1 ) {
			CoC.flags[ kFLAGS.FOLLOWER_PRODUCTION_AMILY ] = 1;
		}

		EngineCore.doNext( SceneLib.farmCorruption, SceneLib.farmCorruption.rootScene );
	};
	AmilyScene.prototype.stopHarvestingMilk = function() {
		MainView.clearOutput();
		this.amilySprite();
		MainView.outputText( 'You tell Amily to stop producing succubus milk; you’re practically drowning in the stuff.' );
		MainView.outputText( '\n\n“<i>Ooh... what a fabulous idea.</i>” Amily moans and begins to paw at her vagina. You cough deliberately before she can immerse herself entirely in the fantasy. “<i>O-of course [master]. I’ll stop immediately.</i>”' );
		CoC.flags[ kFLAGS.FOLLOWER_PRODUCTION_AMILY ] = 0;
		EngineCore.doNext( SceneLib.farmCorruption, SceneLib.farmCorruption.rootScene );
	};
	AmilyScene.prototype.talkWithCORRUPTCUNT = function( sexAfter ) {
		MainView.outputText( '', true );
		this.amilySprite();
		var convo = Utils.rand( 13 );
		//Boost affection!;
		CoC.flags[ kFLAGS.AMILY_AFFECTION ] += 2 + Utils.rand( 3 );
		EngineCore.dynStats( 'cor', 0.34 );
		//Conversation: Items;
		if( convo === 0 ) {
			MainView.outputText( 'You decide to talk to Amily about the adventures she\'s had when she was still adventuring.  From there the topic drifts to the various potions and elixirs discovered in this world.\n\n', false );
			MainView.outputText( '"<i>' + CoC.player.mf( 'Master', 'Mistress' ) + ', I have some experience in alchemy, so if you wish I can share some of what I know with you,</i>" she says.\n\n', false );
			//(If player has no main item:);
			if( CoC.player.itemSlot1.quantity === 0 ) {
				MainView.outputText( 'You tell her that you\'ll call for her, if you ever need her knowledge.\n\n', false );
				if( sexAfter ) {
					EngineCore.doNext( this, this.amilySexHappens );
				} else {
					EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
				}
				return;
			}
			//(If player has an item:);
			else {
				MainView.outputText( 'You remember that you have something in your pockets that might be of interest, and show it to Amily.\n\n', false );
			}
			if( CoC.player.itemSlot1.itype === ConsumableLib.EQUINUM ) {
				MainView.outputText( '"<i>That\'s a distillation of horse essence, I think,</i>" Amily says. "<i>It would probably make you stronger and tougher... Perhaps it could also give you a horse cock. Or perhaps give you a pussy as wet as mine,</i>" she giggles. "<i>Whatever happens, could you come test it on me?</i>" she asks seductively.\n\n', false );
			}
			//Canine Pepper & Variants:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.CANINEP ) {
				MainView.outputText( '"<i>Looks kind of like a dog\'s dick, doesn\'t it? Especially this one with the big knot-like bulge or this one with the ball-like bulbs. I suppose it would make you more dog-like... Have you ever tried one of the jet-black ones?  Those look yummy...</i>" she says, licking her lips.\n\n', false );
			}
			//Canine Pepper & Variants:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.LARGEPP ) {
				MainView.outputText( '"<i>Looks kind of like a dog\'s dick, doesn\'t it? Especially this one with the big knot-like bulge or this one with the ball-like bulbs. I suppose it would make you more dog-like... Have you ever tried one of the jet-black ones?  Those look yummy...</i>" she says, licking her lips.\n\n', false );
			}
			//Canine Pepper & Variants:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.DBLPEPP ) {
				MainView.outputText( '"<i>Looks kind of like a dog\'s dick, doesn\'t it? Especially this one with the big knot-like bulge or this one with the ball-like bulbs. I suppose it would make you more dog-like... Have you ever tried one of the jet-black ones?  Those look yummy...</i>" she says, licking her lips.\n\n', false );
			}
			//Canine Pepper & Variants:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.BLACKPP ) {
				MainView.outputText( '"<i>Looks kind of like a dog\'s dick, doesn\'t it? Especially this one with the big knot-like bulge or this one with the ball-like bulbs. I suppose it would make you more dog-like... Have you tried this black one?  It looks yummy...</i>" she says, licking her lips.\n\n', false );
			}
			//Canine Pepper & Variants:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.KNOTTYP ) {
				MainView.outputText( '"<i>Looks kind of like a dog\'s dick, doesn\'t it? Especially this one with the big knot-like bulge or this one with the ball-like bulbs. I suppose it would make you more dog-like... Have you ever tried one of the jet-black ones?  Those look yummy...</i>" she says, licking her lips.\n\n', false );
			}
			//Canine Pepper & Variants:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.BULBYPP ) {
				MainView.outputText( '"<i>Looks kind of like a dog\'s dick, doesn\'t it? Especially this one with the big knot-like bulge or this one with the ball-like bulbs. I suppose it would make you more dog-like... Have you ever tried one of the jet-black ones?  Those look yummy...</i>" she says, licking her lips.\n\n', false );
			}
			//Succubus Milk/Incubus Draft:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.INCUBID || CoC.player.itemSlot1.itype === ConsumableLib.SUCMILK ) {
				MainView.outputText( 'She hums at the scent. "<i>That\'s demon fluid, ' + CoC.player.mf( 'master', 'mistress' ) + '. It\'d be like drinking liquid corruption. It could turn you into a demon, or supercharge your feminity or masculinity. I\'ve heard it can even mess with your gender if you drink too much of the opposite stuff. But none of that is important, I\'d be happy to drink from you no matter what gender you are ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she says with a grin.\n\n', false );
			}
			//Succubi's Delight:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.SDELITE ) {
				MainView.outputText( '"<i>Full of taint, no question of that. Succubi give it to males who haven\'t become demons yet; makes them better able to produce cum, and pushes them towards demonhood. Why don\'t you try some?</i>" she asks with a smile.\n\n', false );
			}
			//Wet Cloth:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.WETCLTH ) {
				MainView.outputText( '"<i>Forgive your useless cumslut for her ignorance, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she says, looking down. "<i>I don\'t really know what this is; but it looks like some sort of... concentrate of goo?  I think it\'s got something to do with whatever\'s been polluting the lake, but it does smell great, doesn\'t it?</i>" she asks, smiling at you.\n\n', false );
			}
			//Bee Honey:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.BEEHONY ) {
				MainView.outputText( '"<i>That is honey from a giant bee, ' + CoC.player.mf( 'master', 'mistress' ) + '!</i>" she tells you eagerly, perking up. "<i>Oh, that stuff\'s delicious!</i>" Then she diverts her stare to you, looking at you with half-lidded eyes, idly sucking on a clawed finger. "<i>But I prefer having your honey, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she says seductively, licking at her finger, a tiny strand of saliva connecting it to her mouth.\n\n', false );
			}
			//Pure Honey:;
			else if( CoC.player.itemSlot1.itype === ConsumableLib.PURHONY ) {
				MainView.outputText( '"<i>You managed to get your hands on ultra-pure giant bee honey?</i>" she asks, sounding impressed. "<i>I hear that stuff\'s so pure it can actually help purge the eater of demonic taint - but why would you want to do that?</i>" she asks mockingly.\n\n', false );
			}
			//Green Glob:;
			else if( CoC.player.itemSlot1.itype === UseableLib.GREENGL ) {
				MainView.outputText( '"<i>A blob of slime from a green gel? Hmm...</i>" She looks thoughtful. "<i>I think I remember my dad once telling  me you could make a really strong armor out of a special distillation of green oozes. Slut doesn\'t remember for sure, but she thinks you look better naked ' + CoC.player.mf( 'master', 'mistress' ) + '</i>," she says seductively.</i>"\n\n', false );
			}
			//Bee Chitin:;
			else if( CoC.player.itemSlot1.itype === UseableLib.B_CHITN ) {
				MainView.outputText( '"<i>If you had a sufficient mass of this stuff, you could make a suit of armor out of it. It needs special alchemical reagents, though, otherwise it\'ll just get all brittle and smashed up. But why bother? That would hide your perfect body, ' + CoC.player.mf( 'master', 'mistress' ) + '</i>," she says seductively.\n\n', false );
			} else {
				MainView.outputText( 'She looks at it and shrugs, not really familiar with it.\n\n', false );
			}
			MainView.outputText( 'Satisfied, you wave her off. She pouts, disappointed that you decided to not fuck her this time; but obeys anyway.\n\n', false );
		}
		//Conversation: Minotaurs;
		else if( convo === 1 ) {
			MainView.outputText( 'You decide to talk to Amily about the adventures she\'s had when she was still adventuring. From there the topic drifts to the strange bull-men that you have seen haunting the mountains.\n\n', false );
			MainView.outputText( '"<i>It doesn\'t surprise me in the least you got away untouched, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" Amily says flatteringly. "<i>Minotaurs are dangerous brutes -  they\'re one of the biggest, strongest and toughest beasts around. I don\'t dare go near the mountains, not with those things roaming around. Sometimes they carry around huge axes, but most just make do with their fists,</i>" she explains.\n\n', false );
			MainView.outputText( 'You ask her why it is that Minotaurs are so dangerous; they don\'t seem to look like demons.\n\n', false );
			MainView.outputText( '"<i>Oh, they may not look corrupted, but all they care about is finding something to rut with - man, woman, both, neither, they don\'t care. So long as it\'s got a hole, they\'ll fuck it... I think maybe I  heard somewhere that they can only reproduce by raping other creatures with a vagina now, but I don\'t remember where,</i>" she says, tapping her chin in thought.\n\n', false );
			MainView.outputText( 'You ask her then if she has any advice on how to deal with them.\n\n', false );
			MainView.outputText( 'Amily laughs. "<i>Oh, ' + CoC.player.mf( 'master', 'mistress' ) + '. I\'m sure someone like you could easily take them down; me, I ran whenever I saw them. I\'m not a stand-up fighter to begin with, but against those brutes? I\'d be doomed!</i>" she says; then she adds, "<i>I think they\'ve got some kind of addictive chemical in their cum.  The stink of their presence alone can make you feel turned on.  There was this one that managed to corner me; then it pulled out that huge horse-cock of its and starts masturbating.</i>" One of her hands wanders towards her pussy, the memory clearly getting her turned on. "<i>I narrowly missed getting sprayed, but the smell... it was intoxicating,</i>" she admits, panting a bit. "<i>My legs nearly buckled from arousal  - it was so tempting to just give in and let him fuck me.</i>"\n\n', false );
			MainView.outputText( 'You ask her what she did.\n\n', false );
			MainView.outputText( '"<i>I fought it off and ran,</i>" she says, panting and masturbating harder. "<i>Oh, ' + CoC.player.mf( 'master', 'mistress' ) + '! Recalling all of this is making me soooo horny.</i>" She looks at you pleadingly. "<i>Can you fuck me? Please? Fuck your slutty mousy cumslut? Pretty please with sugar on top?</i>" she begs, still masturbating.\n\n', false );
			MainView.outputText( 'You laugh and tell her you\'ll think about it, before leaving her to finish herself off. She just pouts and continues masturbating.\n\n', false );
			EngineCore.dynStats( 'lus', (5 + CoC.player.lib / 20) );
		}
		//Conversation: Sand Witches;
		else if( convo === 2 ) {
			MainView.outputText( 'You decide to talk to Amily about the adventures she\'s had when she was still adventuring. From there the topic drifts to the mysterious female magic-users you\'ve seen in the Desert.\n\n', false );
			MainView.outputText( '"<i>Sand Witches? They are human-like magic users, but they aren\'t truly humans, and to my knowledge they aren\'t demons either... Forgive me, ' + CoC.player.mf( 'master', 'mistress' ) + ', but this useless fucktoy of yours doesn\'t know for sure,</i>" she says, looking down. "<i>I think that they might be some kind of druidic sect. Restoring life to the desert, trying to make it into grassland or something like that,</i>" Amily adds.\n\n', false );
			MainView.outputText( 'You ask her why she would think that.\n\n', false );
			MainView.outputText( '"<i>Under those robes they\'re all women, they all have two pairs of breasts, and those breasts are always bloated huge with milk. I believe they\'ve gone mad like those Fetish Cultists; they\'re not proper demons, but they\'re still sex-warped. Maybe they use milk to try and nourish seedlings?</i>" she wonders. "<i>Wasting all that milk by spilling it on the desert seems like such a waste... If I had huge milky orbs like those I would only offer them for you, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she says, smiling seductively at you.\n\n', false );
			MainView.outputText( 'You ask her how she found out so much about the Sand Witches. She smiles and says, "<i>I got lost in the desert once. A Sand Witch approached me and asked me if I would let her cast a spell on me. When I refused, she attacked, trying to beat me down so she could cast it on me anyway.</i>"\n\n', false );
			MainView.outputText( 'You ask her what does she think the spell would\'ve done.\n\n', false );
			MainView.outputText( '"<i>I don\'t know... Maybe make me into some kind of milk-producing slave? That wouldn\'t do... if I became their slave I would never have been able to become your slave, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she responds, grinning at you.\n\n', false );
			MainView.outputText( 'She leans forward a bit, approaching your crotch. You smile and nod; she nuzzles your crotch affectionately, until you push her back. You ask her if she knows anything more.\n\n', false );
			MainView.outputText( '"<i>I remember the sand witch had cast some spell that made a stone orb fly up my pussy.</i>" She closes her eyes and smiles, remembering how it felt. "<i>It was like having a vibrating sex toy in there. It felt good... Do you want me to find something to shove up my pussy, so I can show you how it was?</i>" she asks.\n\n', false );
			MainView.outputText( 'You tell her no, when you want something inside her pussy you can shove it in yourself.  "<i>' + CoC.player.mf( 'Master', 'Mistress' ) + ', you\'re going to make me horny saying things like that,</i>" she says in mock embarassment. You laugh and dismiss her with a wave.\n\n', false );
		}
		//Conversation: Giant Bees;
		else if( convo === 3 ) {
			MainView.outputText( 'You decide to talk to Amily about the adventures she\'s had when she was still adventuring. From there the topic drifts to the strange bee-like women you\'ve seen in the forest.\n\n', false );
			MainView.outputText( '"<i>Giant Bees? They\'re a strange, but kinky race,</i>" Amily says. "<i>They\'re not really corrupt, but sometimes they act kind of like demons.</i>"\n\n', false );
			MainView.outputText( 'You ask her to explain why.\n\n', false );
			MainView.outputText( '"<i>Well... the Giant Bees you\'ve probably seen ' + CoC.player.mf( 'master', 'mistress' ) + '... the official name for them is the fertile caste, but folks tend to just call them handmaidens,</i>" Amily explains.\n\n', false );
			MainView.outputText( 'At your confused look, she continues.\n\n', false );
			MainView.outputText( '"<i>Giant Bees hatch from each egg as hundreds of regular-looking little bees.  The fertiles are involved in that - for some reason, the eggs need to incubate inside a living being to hatch in the first place.</i>"\n\n', false );
			MainView.outputText( 'Your expression probably tells the story, because Amily giggles slightly before adding, "<i>It\'s not dangerous or anything like that! The queen and the handmaidens both have this cock-like appendage on their abdomens; the queen uses this to lay her eggs into the handmaiden\'s, filling up their abdomens, while the handmaiden then lays a mixture of eggs and honey into a person\'s gut through their ass. The eggs kind of... well, they sit there, and then, when they\'re ready to hatch, they just... come out.</i>"\n\n', false );
			MainView.outputText( 'She shrugs, clearly not able to explain it any better than that. You ask how you can avoid such a fate.\n\n', false );
			MainView.outputText( '"<i>Well ' + CoC.player.mf( 'master', 'mistress' ) + ', they mainly use this hypnotic thrumming from their wings; but someone as sharp and wise as you should have no problem shrugging it off. They aren\'t the kind to get violent; they will ask you to accept their eggs, if you resist their hypnosis, but they won\'t try to beat you into submission so they can lay their eggs. I wouldn\'t ever fight them; they\'re quick and pretty tough, thanks to that armor, and they\'ve got this strange venom that saps your strength and arouses you at the same time. But I\'m sure you wouldn\'t have any problems dealing with them ' + CoC.player.mf( 'master', 'mistress' ) + '. If you ever fight one, get some of their honey; and if you get dirty while doing it, I\'d be happy to give you a tongue bath until you\'re clean,</i>" Amily says, slowly licking her lips from side to side.\n\n', false );
			MainView.outputText( 'Curious, you ask how she knows so much about these creatures.\n\n', false );
			MainView.outputText( 'Amily grins. "<i>Well, they have been willing to trade honey in the past if you confront them peacefully... So I let them fill my ass with their eggs,</i>" she explains. "<i>If you want to ' + CoC.player.mf( 'master', 'mistress' ) + '. I\'d be happy to get my ass stuffed with whatever you want,</i>" Amily adds, smiling while some of her juice running down her legs.\n\n', false );
			MainView.outputText( 'You smile and tell her you\'ll stuff her ass later. "<i>Thank you, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she says, smiling. You dismiss her with a wave.\n\n', false );
		}
		//Conversation: Fetish Cultists & Zealouts;
		else if( convo === 4 ) {
			MainView.outputText( 'You decide to talk to Amily about the adventures she\'s had when she was still adventuring. From there the topic drifts to the bizarrely-dressed people you\'ve caught glimpses of around the lake.\n\n', false );
			MainView.outputText( 'Amily looks down to the floor and says, "<i>Forgive your ignorant juice slave, ' + CoC.player.mf( 'master', 'mistress' ) + '. I haven\'t had much contact with them so I can\'t tell you much. It looks like they have some weird magic that lets them change their clothes at random.</i>"\n\n', false );
			MainView.outputText( '"<i>If you want ' + CoC.player.mf( 'master', 'mistress' ) + ', I could dress up for you, I\'d love to wear any kind of kinky wear you would give me. Even if it was just ropes for tying me down.</i>" Amily adds, smiling.\n\n', false );
			MainView.outputText( 'You tell her you\'ll think about it, before dismissing her with a wave.\n\n', false );
		}
		//Conversation: Imps;
		else if( convo === 5 ) {
			MainView.outputText( 'You decide to talk to Amily about the adventures she\'s had when she was still adventuring. From there the topic drifts to the small demons you\'ve seen in your travels.\n\n', false );
			MainView.outputText( '"<i>Imps,</i>" Amily says. "<i>They\'re weak and small, easy to cut down. They\'re also all over the place, looking to rape anything they can get their hands on; they can also use some black magic to get you horny. I used to kill them all the time, but there was always more.</i>" Amily smiles a bit. "<i>They have big cocks as well, I wouldn\'t mind having a cock that big inside me,</i>" She says, her eyes slowly moving towards your crotch.\n\n', false );
			//[(if PC has a dick < 24 area);
			if( CoC.player.cockArea( 0 ) < 24 && CoC.player.hasCock() ) {
				MainView.outputText( '"<i>' + CoC.player.mf( 'Master', 'Mistress' ) + ', can you grow a bigger cock to fuck your loyal cumdumpster?</i>"', false );
			}//(else if PC has a dick >= 24 area);
			else if( CoC.player.hasCock() ) {
				MainView.outputText( '"<i>' + CoC.player.mf( 'Master', 'Mistress' ) + ' I\'m so horny, can you take your huge cock and jam it into your slutty mouse slave?</i>"', false );
			}//(else);
			else {
				MainView.outputText( '"<i>' + CoC.player.mf( 'Master', 'Mistress' ) + ', can you grow a huge dick to fuck your needy cumslut?</i>"', false );
			}
			MainView.outputText( ' Amily asks, rubbing her thighs together while moisture leaks from her sex.\n\n', false );
			MainView.outputText( 'You smile and say you\'ll think about it, then you dismiss her with a wave.', false );
		}
		//Conversation: Shark Girls;
		else if( convo === 6 ) {
			MainView.outputText( 'You decide to talk to Amily about the adventures she\'s had when she was still adventuring. From there the topic drifts to the humanoid female sharks you\'ve seen while rowing your boat.\n\n', false );
			MainView.outputText( '"<i>Those are Shark Girls, ' + CoC.player.mf( 'master', 'mistress' ) + '. I think they used to be a village of humans who lived on the lake... then the lake was contaminated, and they all turned into the lovely sharks they are now,</i>" Amily says with a smile.\n\n', false );
			if( !SceneLib.izmaScene.izmaFollower() ) {
				MainView.outputText( 'Amily looks pensive, trying to recall something. "<i>I don\'t think they have any males left, but on very rare occasions I\'ve seen these weird tiger-striped Shark Girls.</i>" Her tail begins moving from side to side, moisture beginning to drip from her. "<i>They have these huge cock and huge balls, and the only thing they care about is fighting and fucking. I think both things are the same for them,</i>" she says, panting a bit.\n\n', false );
			}
			MainView.outputText( 'She looks at you with lust-filled eyes. "<i>' + CoC.player.mf( 'Master', 'Mistress' ) + ', let\'s fuck like them; spank me, hit me and then fuck me. Cum all over me, make me feel like the cumslut that I am,</i>" she begs, openly panting.\n\n', false );
			MainView.outputText( 'You smile and tell her that you\'ll call for her when you want to fuck her. You dismiss her with a wave, and she begins masturbating.\n\n', false );
			EngineCore.dynStats( 'lus', (5 + CoC.player.lib / 20) );
		}
		//Conversation: Goblins;
		else if( convo === 7 ) {
			MainView.outputText( 'You decide to talk to Amily about the adventures she\'s had when she was still adventuring.  From there the topic drifts to the strange green women you\'ve seen in the forest and the mountains.\n\n', false );
			MainView.outputText( '"<i>Ah, Goblins,</i>" Amily says, nodding her head in approval. "<i>They used to just experiment with potions and build machines. But now all they do is fuck... a much needed improvement if you ask me. They actively seek to get pregnant, giving birth is like the biggest, most prolonged orgasm to them.</i>"\n\n', false );
			MainView.outputText( 'Amily bites her lower lip, looking away sheepishly. You ask her what\'s up.\n\n', false );
			MainView.outputText( 'She looks to you pleadingly and says, "<i>I love getting knocked up too, ' + CoC.player.mf( 'master', 'mistress' ) + '. I could birth you many mice to worship you like you deserve; and then we could all fuck. Oh, ' + CoC.player.mf( 'master', 'mistress' ) + '!', false );
			//[(if Amily's pregnant);
			if( this.pregnancy.isPregnant ) {
				MainView.outputText( '  I can\'t wait to give birth to this batch of mice, just so I can get pregnant again.', false );
			}
			//(else);
			else {
				MainView.outputText( '  Can you please knock me up? I don\'t care how, just order me to fuck until I get pregnant.', false );
			}
			MainView.outputText( '</i>"\n\n', false );
			MainView.outputText( 'You step closer and pat her head approvingly, telling her she\'s a good girl. Amily takes the opportunity to nuzzle your crotch affectionately. Then you dismiss her with a wave.\n\n', false );
			EngineCore.dynStats( 'lus', (5 + CoC.player.lib / 20) );
		}
		//Conversation: What was life in her village like?;
		else if( convo === 8 ) {
			MainView.outputText( 'You decide to amuse yourself and ask Amily about her past. She rolls her eyes as if just the idea of breaching the subject was boring, but a quick glare puts her back in her place. "<i>Umm... As you wish, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she replies meekly.\n\n', false );
			MainView.outputText( '"<i>I don\'t really know why you are insterested in my past, ' + CoC.player.mf( 'master', 'mistress' ) + '. What matters now is that I\'m your slutty pet mouse, is it not?</i>" she asks. You say yes, but it\'d be amusing to know more about who she was. She smiles. "<i>Very well, ' + CoC.player.mf( 'master', 'mistress' ) + '. I\'ll do my best to entertain you. Is there anything in particular you wish to know?</i>"\n\n', false );
			MainView.outputText( 'You rack your brains for a few moments, then ask her to tell you what life was like in her village.\n\n', false );
			MainView.outputText( '"<i>That is... Quite a boring subject ' + CoC.player.mf( 'master', 'mistress' ) + '. But since you asked I\'ll tell you,</i>" she says; then stops to think for a while. "<i>It was a long time ago, but I can still remember like it was yesterday. The demons had already been around for a few years by the time I remember - I think I was born maybe shortly after they first appeared. In fact, I haven\'t celebrated my Day of First Breath in so long I don\'t really know how old I am. Not that it would matter, I\'d much rather celebrate the day I became your personal cumbucket, ' + CoC.player.mf( 'master', 'mistress' ) + '. Preferably with a nice load of cum,</i>" she says, smiling seductively. Then she carries on, "<i>Anyways, we had all that small village stuff. We fished in the lake, went swimming and sailed boats, gathered fruits and nuts and berries and mushrooms from the forest, we hunted birds and small game for meat. It was peaceful, really... But it was also boring... So boring... Everyone was a prude in the village and sex out in the open would get treated as some kind of taboo. It\'s moronic really,</i>" Amily says, rolling her eyes.\n\n', false );
			MainView.outputText( '"<i>Fools... That\'s what we were.  We were fools living a fool\'s life. Back them the only thing that got inside the village was imps, and we, like the fools we were, believed we were safe. Haha, I feel like laughing, just remembering all this. It\'s no wonder my village fell the way it did... And I don\'t miss it; not for one instant. I\'m much too happy here as your loyal cumslut, ' + CoC.player.mf( 'master', 'mistress' ) + '. You saved me from a boring life as a villager, so I could live a glorious existence as a cumdumpster for you... Thank you, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" Amily says, smiling at you adoringly.\n\n', false );
			MainView.outputText( 'You approach her and pat her head, allowing her to nuzzle your crotch lovingly. You tell her not to worry; you will fuck her much more in the future. "<i>Cum-pet can\'t wait for that, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she replies. You dismiss her with a wave.\n\n', false );
		}
		//Conversation: Who was she before it was all lost?;
		else if( convo === 9 ) {
			MainView.outputText( 'You decide to amuse yourself and ask Amily about her past. She rolls her eyes as if just the idea of breaching the subject was boring, but a quick glare puts her back in her place. "<i>Umm... As you wish, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" She replies meekly.\n\n', false );
			MainView.outputText( '"<i>I don\'t really know why you are insterested in my past, ' + CoC.player.mf( 'master', 'mistress' ) + '. What matters now is that I\'m your slutty pet mouse, is it not?</i>" she asks. You say yes, but it\'d be amusing to know more about who she was. She smiles and asks, "<i>Very well, ' + CoC.player.mf( 'master', 'mistress' ) + '. I\'ll do my best to entertain you. Is there anything in particular you wish to know?</i>"\n\n', false );
			MainView.outputText( 'You rack your brains for a few moments, then ask her to tell about herself, about who she was, before she became your sex slave.\n\n', false );
			MainView.outputText( '"<i>Who was I? Well, ' + CoC.player.mf( 'master', 'mistress' ) + '... Before you saved me, I was nobody, really. Just an average little girl, a face in the crowd. My father was an alchemist; he made a lot of his money in those days working to purify items that were tainted in some fashion, but his primary goal was trying to come up with a concoction that could actually help purify someone who had been tainted already. What a fool; It\'s no wonder he never did succeed,</i>" Amily mocks.\n\n', false );
			MainView.outputText( 'You ask her what was her relationship with her father was like.\n\n', false );
			MainView.outputText( '"<i>At first... I cared. He was busy all the time with his alchemical experiments, so I tried to take an interest in learning alchemy; it was a way to get closer to him, but it never really interested me that much,</i>" she says, nonchalantly. "<i>I was closer to my mom than my dad, I guess.</i>"\n\n', false );
			MainView.outputText( 'You ask her to tell you about her mother.\n\n', false );
			MainView.outputText( '"<i>She was a hunter, one of the best I think... Quick enough to run a deer to ground, quiet enough that it wouldn\'t know she was there until her knife was at its throat, skilled enough with a blowpipe to pin a fly to a tree from fifty paces without killing it,</i>" Amily says, not without a hint of pride. "<i>Of course, in the end that didn\'t help her at all. I mean... She taught me all she knew, and people used to say I was going to be just like her when I grew up; yet, I got caught. Thankfully it was you who caught me, ' + CoC.player.mf( 'master', 'mistress' ) + '. I couldn\'t imagine myself as anyone else\'s sexy mouse pet fucktoy. I love you, ' + CoC.player.mf( 'master', 'mistress' ) + '!</i>" she suddenly exclaims, throwing herself at you, hugging your waist and nuzzling your crotch affectionately.\n\n', false );
			MainView.outputText( 'You pat her head, and then push her away. She settles herself back on her knees. "<i>Sorry about that, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she says, a bit ashamed of her little outburst.  You ask her what the fate of her parents was.\n\n', false );
			MainView.outputText( '"<i>Who knows? Probably got caught by some inferior demon and made to be their slaves,</i>" she says shrugging. "<i>I\'m just happy I got caught by a good ' + CoC.player.mf( 'master', 'mistress' ) + '.</i>" She smiles. You smile back and dismiss her with a wave.\n\n', false );
		}
		//Conversation: How did it fall?;
		else if( convo === 10 ) {
			MainView.outputText( 'You decide to amuse yourself and ask Amily about her past. She rolls her eyes as if just the idea of breaching the subject was boring, but a quick glare puts her back in her place. "<i>Umm... As you wish, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she replies meekly.\n\n', false );
			MainView.outputText( '"<i>I don\'t really know why you are interested in my past, ' + CoC.player.mf( 'master', 'mistress' ) + '. What matters now is that I\'m your slutty pet mouse, is it not?</i>" she asks. You say yes, but it\'d be amusing to know more about who she was. She smiles. "<i>Very well, ' + CoC.player.mf( 'master', 'mistress' ) + '. I\'ll do my best to entertain you. Is there anything in particular you wish to know?</i>"\n\n', false );
			MainView.outputText( 'You rack your brains for a few moments, then ask her to tell you how her village was destroyed.\n\n', false );
			MainView.outputText( 'She closes her eyes and rubs her chin, attempting to recall every little detail of the attack. "<i>It was the evening of a festival... Everyone was in the town square celebrating something stupid like the years harvest. Typical country mouse stuff,</i>" Amily says with disdain. "<i>Anyways; the demons managed to break in through the gate and over the walls. It\'s kind of stupid if you think about it ' + CoC.player.mf( 'master', 'mistress' ) + '. Demons have wings... Who is the genius that thought walls would hold them back?</i>" Amily mocks. "<i>And you know what\'s even more funny? We had sentries, but those fools were at the festival too!</i>" Amily bursts out laughing. You chuckle and tell her to carry on.\n\n', false );
			MainView.outputText( '"<i>I remember seeing a lot of different demons... From imps to succubi and incubi.  We were powerless to defend ourselves. Unarmed and caught by surprise; we scattered about like the scared little field mice we were,</i>" Amily continues, then looks up to you adoringly. "<i>I\'m sure you\'d never make such a naive mistake ' + CoC.player.mf( 'master', 'mistress' ) + '.</i>" You smile back and pat her head lightly. "<i>The demons only had to pick us out one by one. The smarter ones just surrendered on the spot and let the demons have their way with them; some of the more foolish tried fighting back. Me? I ran away. But it was kind of stupid in hindsight... I could have joined that wonderful orgy of cocks, cunts and cum,</i>" Amily says dreamily, looking in the distance; but then her eyes quickly focus on yours and she grins.\n\n', false );
			MainView.outputText( '"<i>Of course... That would mean I wouldn\'t have been picked by the best of the lot.</i>" Amily hugs your waist and looks up at you adoringly. "<i>I\'m so glad it\'s you who got me, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she says, lightly nuzzling your crotch. You smile at her and pat her on her head. You tell her that later you\'ll see about reenacting the invasion of her village, only this time she\'ll get caught. Amily lights up and giddily says, "<i>I can\'t wait for it ' + CoC.player.mf( 'master', 'mistress' ) + '!</i>" You chuckle and leave her to her own devices.\n\n', false );
		}
		//Conversation: How did she survive?;
		else if( convo === 11 ) {
			MainView.outputText( 'You decide to amuse yourself and ask Amily about her past. She rolls her eyes as if just the idea of breaching the subject was boring, but a quick glare puts her back in her place. "<i>Umm... As you wish, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she replies meekly.\n\n', false );
			MainView.outputText( '"<i>I don\'t really know why you are interested in my past, ' + CoC.player.mf( 'master', 'mistress' ) + '. What matters now is that I\'m your slutty pet mouse, is it not?</i>" she asks. You say yes, but it\'d be amusing to know more about who she was. She smiles, "<i>Very well, ' + CoC.player.mf( 'master', 'mistress' ) + '. I\'ll do my best to entertain you. Is there anything in particular you wish to know?</i>"\n\n', false );
			MainView.outputText( 'You rack your brains for a few moments, then ask her to tell you how she survived all alone in her village.\n\n', false );
			MainView.outputText( '"<i>Well ' + CoC.player.mf( 'master', 'mistress' ) + '... I ran as fast as I could to my house. I wanted to get my hunting knife and blowpipe. Useless tools... But back then I was a fool too,</i>" she explains. "<i>Then my parents showed up and told me to run. I didn\'t want to, but I obeyed... I was so scared... Don\'t know why, though? It\'s just sex... Wonderful, sweaty, slimy, creamy sex,</i>" she says dreamily, licking her lips and shooting you a seductive grin. You tell her that you\'ll think about some way to reward her later. "<i>I kept running as fast as I could, until I couldn\'t run anymore; then I hid and stayed hidden through the whole night. I only woke up in the morning, and I was ravenous, so I foraged something to eat and went back to the village. That\'s when I saw it was in ruins... I was lost and my life was in shambles... Thankfully, you eventually showed up to save me and pick up the pieces, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she says adoringly.\n\n', false );
			MainView.outputText( 'You ask her what about her day-to-day? What was her routine?\n\n', false );
			MainView.outputText( '"<i>Boring.</i>" she says rolling her eyes. "<i>I prefer my new routine; I get to have wonderful sex with my ' + CoC.player.mf( 'master', 'mistress' ) + ' and drink a lot of cum. It\'s all a girl could ask for,</i>" she says, smiling at you. "<i>Anyways... I had enough knowledge to know what I could eat or not... I also salvaged some alchemy stuff to make poison darts, I was pretty weak before you gave me this delicious body, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she continues, caressing her breasts for effect. You scold her, telling her she\'s not supposed to pleasure herself without permission. Amily quickly apologizes; you pat her head and tell her it\'s fine, you\'ll punish her later. "<i>Thank you, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" She replies with a grin. "<i>Other than that I only hid, hunted, foraged, ate and slept; that\'s all.</i>"\n\n', false );
			MainView.outputText( 'Satisfied for the moment, you dismiss her with a wave and tell her you\'ll call for her when its time for her punishment. Amily excuses herself and leaves with a smile, pussy dripping', false );
			//[(if Amily has a dick);
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( ', and cock hardening', false );
			}
			MainView.outputText( ' with excitement.\n\n', false );
		} else if( convo === 12 ) {
			//[Corrupted Amily talks about Kitsune];
			MainView.outputText( 'You decide to talk to Amily about the adventures she had when she was still adventuring, and from there the topic drifts to the odd many-tailed fox women you\'ve seen deep in the woods.\n\n' );
			MainView.outputText( '"<i>They\'re weird,</i>" she says, touching her chin absently as she thinks.\n\n' );
			MainView.outputText( 'You ask her what she means by this.\n\n' );
			MainView.outputText( '"<i>Well, they\'re not exactly demons, I guess, but they do have some similarities.  For some reason, they\'re really resistant to being corrupted, though,</i>" she says, frowning slightly.  "<i>I\'m sure you\'d have no problems doing it though, [master].  From the tales I\'ve heard, they were already like that waaay before the demons came along,</i>" she explains.  You take a moment to think about this, and then gesture for her to continue.  "<i>Their magic is like... really strong.  I\'m sure someone as great as you wouldn\'t have any problems dealing with it though,</i>" she says in a deeply flattering tone.  "<i>I think they get their power from living things.  They can get it in lots of ways, but I guess their favorite way is through fucking,</i>" she says, drooling a little.  "<i>Mmm... Just thinking about it is making me wanna fuck.</i>"\n\n' );
			MainView.outputText( 'You chuckle a little, telling the mouse-slut to continue her story.  You\'ll come to her for a fuck later if you feel like it.  She looks a little disappointed, but obediently continues.\n\n' );
			MainView.outputText( '"<i>They\'re not very strong, but they don\'t have to be – they try to trap you in their illusions and trick you into doing what they want.  You\'re too smart to fall for that though, ' + CoC.player.mf( 'master', 'mistress' ) + '.  They\'re not really evil...  just WAY irritating. Most of the time...</i>" she trails off a bit.\n\n' );
			MainView.outputText( 'You raise an eyebrow, chastising her a little for holding back details.  She shrinks a bit at your admonishment, but happily nods and continues.\n\n' );
			MainView.outputText( '"<i>W-well... I\'ve never seen one face-to-face, but I\'ve heard some other travelers tell stories about meeting corrupted kitsune.  Most kitsune just spend the whole day playing stupid pranks on whatever fools wander into their territory.  They seem to get off on their own stupid sense of humor, but the worst that ever happens is just stuff like getting you lost in the woods or you find some kind of treasure that ends up being a box of rocks when you get home.  The dumb bitches don\'t have the brains for anything else, I guess.  The corrupted ones though... they know how to have a good time!  Once they finish tormenting their victims, they\'ll suck the life right out of them without a moment\'s hesitation.</i>"\n\n' );
			MainView.outputText( 'You ask how anyone knows this much about them, if even meeting one is so dangerous.  Amily scratches her head a bit and blushes, apologizing profusely.  "<i>Please forgive your ignorant mouse-slut, [master], I\'m only repeating what I\'ve heard.</i>"\n\n' );
			MainView.outputText( 'She pauses for a moment, and then speaks up with another interesting fact in an attempt to please you.  "<i>They do seem to have a strange fascination with tentacle beasts, for some reason.  Oooh just thinking about it gets me so horny!  Please [master], fuck me?  Please, oh please!</i>"\n\n' );
			MainView.outputText( 'You chuckle a little and tell her you\'ll think about it.  As you leave, she begins to masturbate, no doubt fantasizing about being used by a tentacle beast.' );
		}
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};

	//(Winning Messages);
	AmilyScene.prototype.conquerThatMouseBitch = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		//By HP:;
		if( CoC.monster.HP < 1 ) {
			MainView.outputText( 'Amily falls on the ground, unconscious. You drag the mousette towards an empty spot in her hideout. You smile as you strip her clothes off, then you find a rope to tie her up. You tie her hands together, then tie her hands to her ankles, ensuring she won\'t be able to fight you back. After that, you dispose of anything that could be used as a weapon, or could aid her in her escape, then sit down on a nearby stool to wait until she\'s recovered her consciousness. After all, it\'s much more fun if she\'s awake to see everything you\'ll do to her...\n\n', false );
		}
		//By Lust:;
		else {
			MainView.outputText( 'Amily lets go of her knife and begins masturbating in earnest, too horny to fight. You walk up to her, pick up one of her darts and stab her, knocking her out. You drag the mousette towards an empty spot in her hideout. You smile as you strip her clothes off, then you find a rope to tie her up. You tie her hands together, then tie her hands to her ankles, ensuring she won\'t be able to fight you back. After that you dispose of anything that could be used as a weapon, or could aid her in her escape, then sit down on a nearby stool to wait until she\'s recovered her consciousness.  After all, it\'s much more fun if she\'s awake to see everything you\'ll do to her...\n\n', false );
		}
		//Amily gives XP and Gems normally; but you have no option, you always rape her.;
		this.chooseYourAmilyRape();
	};
	AmilyScene.prototype.chooseYourAmilyRape = function() {
		this.amilySprite();
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00170 ] === 0 ) {
			EngineCore.doNext( this, this.rapeCorruptAmily1 );
		}
		//2nd rape scene;
		else if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00170 ] === 1 ) {
			if( CoC.player.gender === 1 ) {
				EngineCore.doNext( this, this.rapeCorruptAmily2Male );
			} else if( CoC.player.gender === 2 ) {
				EngineCore.doNext( this, this.rapeCorruptAmily2Female );
			} else if( CoC.player.gender === 3 ) {
				EngineCore.choices( 'MaleFocus', this, this.rapeCorruptAmily2Male, 'FemaleFocus', this, this.rapeCorruptAmily2Female, '', null, null, '', null, null, '', null, null );
			}
		}
		//3nd rape scene;
		else if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00170 ] === 2 ) {
			if( CoC.player.gender === 1 ) {
				EngineCore.doNext( this, this.rapeCorruptAmily3Male );
			} else if( CoC.player.gender === 2 ) {
				EngineCore.doNext( this, this.rapeCorruptAmily3Female );
			} else if( CoC.player.gender === 3 ) {
				EngineCore.choices( 'MaleFocus', this, this.rapeCorruptAmily3Male, 'FemaleFocus', this, this.rapeCorruptAmily3Female, '', null, null, '', null, null, '', null, null );
			}
		}
		//4nd rape scene;
		else if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00170 ] === 3 ) {
			EngineCore.doNext( this, this.rapeCorruptAmily4Meeting );
		}
	};
	//Rape Amily 1;
	AmilyScene.prototype.rapeCorruptAmily1 = function() {
		this.amilySprite();
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00170 ]++;
		MainView.outputText( '', true );
		//[Raping Amily];
		MainView.outputText( 'You wait for a while, idly looking at the mixture you made for Amily, until a groan draws your attention towards the bound mouse.\n\n', false );
		MainView.outputText( '"<i>Huh!? What happened!? Why am I tied up!?</i>" She quickly blurts out, panicked.\n\n', false );
		MainView.outputText( '"<i>Hello Amily,</i>" you say.\n\n', false );
		MainView.outputText( 'The mousette looks at you and then at the bubbling mixture in your hand. "<i>W-What is this!?</i>" she asks you.\n\n', false );
		MainView.outputText( '"<i>Something I made just for you,</i>" you answer, grining perversely.\n\n', false );
		MainView.outputText( '"<i>No! Oh goddess please no! Don\'t do this, I beg you! Please just let me go!</i>" Amily pleads, her eyes getting teary.\n\n', false );
		MainView.outputText( 'You laugh at her, "<i>You can\'t expect me to just let you go after that stunt you pulled.</i>" Then you begin to strip.\n\n', false );
		MainView.outputText( 'Amily never stops her pleading, insisting she\'s sorry and begging you to let her go; but you ignore all of it. By the time you\'re done undressing, your ', false );
		if( CoC.player.cockTotal() > 0 ) {
			if( CoC.player.cockTotal() > 1 ) {
				MainView.outputText( Descriptors.multiCockDescriptLight() + ' are', false );
			} else {
				MainView.outputText( Descriptors.cockDescript( 0 ) + ' is', false );
			}
			MainView.outputText( ' already hard', false );
			if( CoC.player.hasVagina() ) {
				MainView.outputText( ', and your ', false );
			}
		}
		if( CoC.player.hasVagina() ) {
			MainView.outputText( Descriptors.vaginaDescript() + ' is already wet', false );
		}
		MainView.outputText( '. Amily cries openly, giving up on her pleading. You straddle her chest and uncork the bottle, then say, "<i>Open up, I got a special drink for you.</i>" She keeps her mouth clamped shut, but you won\'t have it; you hold her nose shut, forcing her to open her mouth to breath; that\'s when you strike.\n\n', false );
		MainView.outputText( 'You shove the bottle inside her mouth, forcing the contents down her throat. She gurgles and splutters, nearly choking as the cocktail flows into her belly, but you don\'t stop until the bottle is drained. You get up and put the bottle away while Amily coughs and gasps on the floor. When she settles down, you look at her face. She\'s panting and flushed, her eyes glazed and empty as she looks at the ceiling; then you hear her moan loudly and watch a flood of juices spill from her pussy onto the floor.\n\n', false );
		MainView.outputText( 'You chuckle at her spontaneous orgasm; no doubt she must\'ve loved the little drink you gave her. Her eyes regain their focus and she looks at you; not in anger or panic, as you would expect, but in lust. "<i>S-So hot... So gooooood...</i>" Amily says, moaning as she cums yet again. You laugh and begin molesting her; groping her breasts, massaging her pussy and pinching her clit. Each touch brings a wave of fluids as Amily orgasms. "<i>I need...</i>" You hear Amily mutter. "<i>I need more! Give me more... Whatever was in that bottle!</i>" the mouse says with a sense of urgency. You laugh and tell her. "<i>There isn\'t any more, you drank everything.</i>" Amily\'s face changes to one of desperation. "<i>No! But I-</i>" You silence her with a finger, then say. "<i>I can, however, let you drink some of my juices. There was some in that potion you just drank.</i>" Amily\'s face lights up and she says excitedly. "<i>Yes! Please yes! Give it to me!</i>"\n\n', false );
		//[(if herm);
		if( CoC.player.gender === 3 ) {
			MainView.outputText( 'Which part of you should Amily lick?', false );
			EngineCore.choices( 'Cock', this, this.rapeCorruptAmily1Male, 'Pussy', this, this.rapeCorruptAmily1Female, '', null, null, '', null, null, '', null, null );
		}
		//Cocks!;
		else if( CoC.player.gender === 1 ) {
			EngineCore.doNext( this, this.rapeCorruptAmily1Male );
		}
		//Cunts!;
		else {
			EngineCore.doNext( this, this.rapeCorruptAmily1Female );
		}
	};
	//[Male];
	AmilyScene.prototype.rapeCorruptAmily1Male = function() {
		this.amilySprite();
		var x = CoC.player.cockThatFits( 61 );
		if( x < 0 ) {
			x = 0;
		}
		CoC.player.removeKeyItem( 'Potent Mixture' );
		MainView.outputText( '', true );
		MainView.outputText( 'You smile and say, "<i>Fine, but you\'re gonna have to work for it.</i>" Amily\'s answer is to open her mouth wide. The invitation clear, you scoot closer to her mouth, and her lips touch the tip of your ' + Descriptors.cockDescript( x ) + '; Amily suddenly lifts her head and starts swallowing your dick', false );
		//[(if PC is huge);
		if( CoC.player.cockThatFits( 61 ) === -1 ) {
			MainView.outputText( '- you\'re quite surprised she managed to fit it in at all.', false );
		} else {
			MainView.outputText( '.', false );
		}
		MainView.outputText( '  You moan and take hold of her ears; then proceed to violently fuck her face, shoving as much of your dick in as you can. Amily doesn\'t seem to mind; in fact she tries to take as much of your cock in as possible... but she just can\'t get her throat open enough for that.\n\n', false );
		MainView.outputText( 'You smile as she licks the underside of your cock; bound as she is, there isn\'t much she can do; but you\'re happy that she seems so eager to blow you. Especially after she denied and even attacked you, claiming you\'re too corrupt for her; things would be so much better if she was a bit more open minded... Your musings are stopped by a particularly noisy slurp from Amily. She looks so nice with your cock buried in her mouth... It\'s surprisingly good too; she\'s paying attention to all the right spots and making sure to massage your shaft with her tongue. Amily sucks fiercely on your dick, and you feel yourself getting closer to orgasm. Amily notices your breathing getting ragged and your increased rhythm, and doubles her efforts. It wouldn\'t be bad if she was always this eager to suck you off like the slut she is... The thought of her, willingly kneeling between your legs and opening wide to accept your ' + Descriptors.cockDescript( x ) + '... You feel your ', false );
		if( CoC.player.balls > 0 ) {
			MainView.outputText( Descriptors.ballsDescriptLight() + ' churn', false );
		} else {
			MainView.outputText( Descriptors.cockDescript( x ) + ' throb', false );
		}
		MainView.outputText( '; the very idea of a mousy slut eager for cum distills into one massive load of cum, and you dump it all in her mouth.\n\nYou sigh, sated for now and leave her to clean herself up.', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'lib', -2, 'cor', 5 );
		if( CoC.isInCombat() ) {
			Combat.cleanupAfterCombat();
		} else {
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		}
	};
	//[Female];
	AmilyScene.prototype.rapeCorruptAmily1Female = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		CoC.player.removeKeyItem( 'Potent Mixture' );
		MainView.outputText( 'You smile and say, "<i>Fine, but you\'re gonna have to work for it.</i>" Amily\'s answer is to open her mouth wide. The invitation clear, you advance and lower your ' + Descriptors.vaginaDescript() + ' towards her open mouth.\n\n', false );
		MainView.outputText( 'Amily suddenly lifts her head and begins licking and slurping your pussy like her life depended on it', false );
		//[(If PC's a squirter);
		if( CoC.player.wetness() >= 5 ) {
			MainView.outputText( ', a jet of fluids escape your lower lips and hit her straight in the face; but she pays no mind', false );
		}
		MainView.outputText( '.  She blows on your clit, causing you to jump in pleasure, you say, "<i>Calm down, there\'s plenty of juice for you.</i>" But Amily doesn\'t seem to be listening; she licks you until your first orgasm rocks you and flows into her hungry mouth. She drinks as much as possible, but ends up choking and spilling most of your juices.\n\n', false );
		MainView.outputText( 'You laugh as she splutters. "<i>Look at what you\'ve done,</i>" you say, motioning at the spilled juice all around her; she finishes coughing and takes a deep breath.\n\n', false );
		MainView.outputText( '"<i>More,</i>" she says.\n\n', false );
		MainView.outputText( '"<i>More? After all the mess you\'ve made? I don\'t think you deserve more.</i>" You reply.\n\n', false );
		MainView.outputText( 'She begins tearing up, desperate to have more of your delicious juices.\n\n', false );
		MainView.outputText( '"<i>Please! I Need it! Please!</i>" she wails.\n\n', false );
		MainView.outputText( '"<i>Fine, but you\'d better do it right this time.</i>" You say; she beams and licks her lips as you lower yourself towards her mouth yet again.\n\n', false );
		MainView.outputText( 'She pushes her ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'muzzle' : 'nose') + ' against you ' + Descriptors.vaginaDescript() + ', tightly sealing her around your dripping snatch before working her tongue in. You moan and grip her ears tighly; she just keeps licking, not even feeling pain as you begin bucking into her ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'muzzle' : 'lips') + '.\n\n', false );
		MainView.outputText( 'This feels so good... Amily\'s licking you like a pro. You imagine her thirsty for more of you; eager to lap every little drop of femcum that spills from you; growing hornier with each lap. The thought is too much for you, and you finally hit a ferocious orgasm; a flood of juices entering her mouth and going straight into her belly.\n\n', false );
		//[(if PC has large cum amount or is a squirter);
		if( CoC.player.wetness() >= 5 ) {
			MainView.outputText( 'She tries to gulp down everything she can, but ultimately a lot of it escapes her mouth and ends up on her face and all around her.  ', false );
		}
		MainView.outputText( 'You keep feeding her more and more cum, your orgasm lasting much longer than usual. Amily\'s belly even distends a bit from the quantity, her pussy leaks juice like an open tap; it seems servicing you was enough to drive her over the edge several times.\n\n', false );
		MainView.outputText( 'Finally done, you let go of her and get up; she proceeds to slump down and give a small burp of satisfaction, then drift off into sleep. You untie her and proceed to get dressed; you give her a light pat on the thigh and return to your camp. You\'ll have to do this again sometime later...', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'lib', -2, 'cor', 5 );
		if( CoC.isInCombat() ) {
			Combat.cleanupAfterCombat();
		} else {
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		}
	};
	//[Raping Amily 2];
	//Lock in from first scene?;
	//[Male];
	AmilyScene.prototype.rapeCorruptAmily2Male = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		var x = CoC.player.cockThatFits( 61 );
		if( x < 0 ) {
			x = 0;
		}
		MainView.outputText( 'You unceremoniously shove your ' + Descriptors.cockDescript( x ) + ' into her maw. ', false );
		//[(if PC has a huge dick);
		if( CoC.player.cockThatFits( 61 ) < 0 ) {
			MainView.outputText( 'Despite your size, she presses forward to take in as much of you as possible.  ', false );
		}
		MainView.outputText( 'Once you feel yourself hit the back of her throat, she twists her head a bit and takes you even further, deep throating you.\n\n', false );
		MainView.outputText( 'You gasp in surprise; there\'s no way she could have done this before your last meeting! Has she been practicing?\n\n', false );
		MainView.outputText( 'Soon you feel that she\'s taken in all that ', false );
		//[(if PC's dick is huge);
		if( CoC.player.cockThatFits( 61 ) < 0 ) {
			MainView.outputText( 'is possible.', false );
		}//(else);
		else {
			MainView.outputText( 'you have to offer.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'You pat her head and say. "<i>Good girl.</i>"\n\n', false );
		MainView.outputText( 'She smiles and gives your dick a big slurp, drawing a moan from you.\n\n', false );
		MainView.outputText( 'You begin pumping into her mouth; long strokes that bring your tip almost out of her mouth and then back in as far as it\'ll go.', false );
		//[(If PC is huge.);
		if( CoC.player.cockThatFits( 61 ) < 0 ) {
			MainView.outputText( '  One of Amily\'s hands settles on your ' + Descriptors.cockDescript( x ) + ', stroking whatever she doesn\'t manage to swallow.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'As you settle upon a steady rhythm, you can\'t help but notice she\'s become an excellent cock sucker. Could it be that your potion is helping her release her inner slut? You hope that\'s the case!\n\n', false );
		//[(if PC has balls);
		if( CoC.player.balls > 0 ) {
			MainView.outputText( 'Amily grabs your balls and begins kneading them.  ', false );
		}
		//(else if PC has a pussy);
		else if( CoC.player.hasVagina() ) {
			MainView.outputText( 'Amily shoves her fingers into your ' + Descriptors.vaginaDescript() + '.  ', false );
		}
		MainView.outputText( 'You moan and begin leaking pre, accelerating to keep up with Amily\'s noisy slurps. She shows no sign of shame in letting the world know she\'s giving you a blow job.\n\n', false );
		MainView.outputText( 'She looks much more feminine with her new figure, but it would be better if her assets were bigger... Then she could give you a tit job too!', false );
		//[(if PC has balls);
		if( CoC.player.balls > 0 ) {
			MainView.outputText( '  Just the thought of it is enough to make your balls churn.', false );
		}
		MainView.outputText( '  You imagine Amily growing ever more eager to blow you; begging for your cum like the slut she is. The previously prudish mouse reduced to nothing more than a cumbucket for you to unload into.\n\n', false );
		MainView.outputText( 'Suddenly, you grab her hair and roughly shove yourself as far in as you can; Amily doesn\'t scream in pain, instead she moans in pleasure, eyes wide and eager at what she\'s about to receive.\n\n', false );
		MainView.outputText( 'You unload into her, jet after delicious jet of cum bursting into her throat to hit her stomach, even distending it a bit.', false );
		//[(If PC has large cum amount);
		if( CoC.player.cumQ() >= 750 ) {
			MainView.outputText( '  You feel your enourmous load coming back through her throat and spilling from her mouth and nose, smearing your crotch as you pull away to let her breathe.', false );
		}
		MainView.outputText( '\n\n', false );
		this.rapeCorruptAmily2Epilogue();
	};
	//[Female];
	AmilyScene.prototype.rapeCorruptAmily2Female = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You roughly grab ahold of Amily\'s ears and shove her face on your ' + Descriptors.vaginaDescript() + '.', false );
		//[(if PC is a squirter);
		if( CoC.player.wetness() >= 5 ) {
			MainView.outputText( '  Your juices rocket into her face, painting her ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'muzzle' : 'face') + ' in your femcum as she giggles with happiness and pleasure.', false );
		}
		MainView.outputText( '  Amily begins licking and slurping, her nose bumping into your clit every once in a while; she eats your ' + Descriptors.vaginaDescript() + ' like her life depended on it. You can only moan in pleasure as the previously prudish mousette gorges herself on your tasty juices.\n\n', false );
		MainView.outputText( 'You gently pat her head and say, "<i>Good girl.</i>"\n\n', false );
		MainView.outputText( 'Amily replies by giving your clit a big slurp and doubling her efforts to get to every cranny and nook inside your juicy tunnel; you reward her with a flood of juices, which she licks happily; making you moan lewdly...\n\n', false );
		MainView.outputText( 'Amily herself moans once in a while, sending pleasurable ripples throughout your ' + Descriptors.vaginaDescript() + ' and body. She seems to be enjoying herself immensely; and she displays no shame in letting everyone know that she likes cunt juice.\n\n', false );
		MainView.outputText( 'You can\'t see her very well from this position, but from what you did see before, she looks much more feminine with her new figure, but it would be better if her assets were bigger... big jiggling tits to press and grope. It would be wonderful! Just the thought is enough to make you cum again', false );
		//[(if PC is a squirter);
		if( CoC.player.wetness() >= 5 ) {
			MainView.outputText( ', giving Amily a juice bath; even if the mousy cunt did get better at drinking, there is no way she\'d be able to drink all of your fluids', false );
		}
		MainView.outputText( '.', false );
		//(else);
		if( CoC.player.wetness() < 5 ) {
			MainView.outputText( '  A flood of juices escape your pussy and go directly into the mousy cunt\'s hungry maw, however, some of it spills; even if Amily did get better at drinking, she\'s still a long way from being the perfect fucktoy you want her to be.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'Suddenly you grab her ears and pull her against your dripping pussy as hard as you can. Amily doesn\'t even seem to notice the pain; all she does is moan in pleasure as her tongue continues lapping excitedly, eager to receive her reward.\n\n', false );
		MainView.outputText( 'You cum... you cum hard, harder than you believe you\'ve ever had. A flood of juices shower Amily\'s open mouth, face and upper body; soaking her in your juices and marking her as your property. She chokes on your juices, but you don\'t let go; Amily herself seems unwilling to stop, despite her current predicament; all she can do is drink and moan.', false );
		//[(if PC is a squirter);
		if( CoC.player.wetness() >= 5 ) {
			MainView.outputText( '  Your orgasm lasts much longer than usual. Eventually you release Amily and finish off on top of her head.\n\n', false );
		}
		this.rapeCorruptAmily2Epilogue();
	};
	AmilyScene.prototype.rapeCorruptAmily2Epilogue = function() {
		this.amilySprite();
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00170 ]++;
		//Both variations link into this next paragraph;
		MainView.outputText( 'Amily falls on her back, panting happily and licking her mouth to taste as much of you as possible. That\'s when you notice her beginning to change, slowly but significantly.\n\n', false );
		MainView.outputText( 'Her breasts start filling up, and her butt and hips grow bigger; you can\'t help but smile at how you\'re changing the mousette.\n\n', false );
		MainView.outputText( 'You lower yourself and open one of her ears wide, before whispering, "<i>Be ready for when I come back, there\'s a lot more where this came from,</i>" then you get up and walk away to fetch more ingredients for Amily\'s \'medicine\'.', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'lib', -2, 'cor', 5 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[Raping Amily 3];
	//Herms will get to pick how to fuck her.;
	//[Male];
	AmilyScene.prototype.rapeCorruptAmily3Male = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You strip while Amily watches hungrily. Finally naked, you order the mouse to come closer and use her breasts to pleasure you. Amily quickly scoots closer on her knees and press her breasts around your ' + Descriptors.cockDescript( 0 ) + '.', false );
		//[(if PC is huge);
		if( CoC.player.cockArea( 0 ) >= 61 ) {
			MainView.outputText( '  She can\'t get her breasts all the way around though, still she doesn\'t stop, determined to do as you ordered.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'Amily begins moving her ' );
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'furry ' );
		}
		MainView.outputText( 'breasts along your shaft, causing pleasurable chills to run along your body; the pre-cum that seeps down your cock only serves to lube up Amily\'s breasts, making the act all the more pleasurable. You can feel yourself getting ready to blow your load and order Amily to lay down and stay still.\n\n', false );
		MainView.outputText( 'Amily complies without a word; then you drive your ' + Descriptors.cockDescript( 0 ) + ' between her breasts and begin pumping vigorously.You blow your load then and there, right on Amily\'s breasts, covering them in a layer of white hot spunk, while Amily smiles contentedly.\n\n', false );
		//(if PC is < 60 Corruption);
		if( CoC.player.cor < 60 ) {
			MainView.outputText( 'Satisfied for the moment, you leave the smiling mouse lying in a pool of cum and return to the camp.', false );
			CoC.player.orgasm();
			EngineCore.dynStats( 'cor', 2 );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		//(else);
		MainView.outputText( 'That was good, but now it\'s time to reward Amily for her efforts; besides you could really use a proper blow job.\n\n', false );
		MainView.outputText( '"<i>Get up cumbucket, it\'s time for your reward,</i>" you say.\n\n', false );
		MainView.outputText( 'Amily jumps up and rushes to nuzzle at your still erect ' + Descriptors.cockDescript( 0 ) + '. "<i>Thank you! Thank you! Thank you!</i>" she says excitedly. Then with a lick of her lips, she opens wide to accept your meat.  ', false );
		//[(if PC is huge);
		if( CoC.player.cockArea( 0 ) > 50 ) {
			MainView.outputText( 'You didn\'t think it was possible, but somehow ', false );
		}
		MainView.outputText( 'Amily manages to fit all of you inside her in one go.  She gurgles in ecstasy and sends vibrations along your shaft, drawing a moan of pleasure from you. Her tongue darts out of her mouth to lick at ', false );
		if( CoC.player.balls > 0 ) {
			MainView.outputText( 'your ' + Descriptors.ballsDescriptLight(), false );
		} else if( CoC.player.hasVagina() ) {
			MainView.outputText( 'your ' + Descriptors.vaginaDescript(), false );
		} else {
			MainView.outputText( 'the base of your shaft', false );
		}
		MainView.outputText( '.  It tickles you and causes a jet of pre to splatter her insides, drawing another moan from her.\n\n', false );
		MainView.outputText( '"<i>Enough teasing. Get to work now,</i>" you order.  She complies by beginning to move and suckle on your ' + Descriptors.cockDescript( 0 ) + '.\n\n', false );
		MainView.outputText( 'She moves her whole body to make the experience as pleasurable as possible for you while her ropey mouse tail sways happily behind her with each noisy slurp. It\'s wonderful to see how good Amily\'s gotten at this, you could even say this is what she was born for, sucking dick. The only way this could be any better is if Amily was a succubus herself. After all, you have no doubt that as good as Amily is, she\'s still no match for a sex demon. That\'s not a bad idea actually... maybe you should push to convert her into a demon? Amily could be your own personal cumslut, a cocksucking demon to dump your load into whenever you feel like. Your cock throbs at the idea, as if in approval.', false );
		//[(if PC has balls);
		if( CoC.player.balls > 0 ) {
			MainView.outputText( '  Your ' + Descriptors.ballsDescriptLight() + ' churn with cum, growing heavier with every nasty detail that goes through your mind.', false );
		}
		MainView.outputText( '  The image of a demonized Amily servicing you distills into a massive load of spunk.  You\'re all too happy to dump it into Amily\'s eager throat. You grab her ears and forcibly pull her head, plunging into her throat as far as you can. Then you explode inside her.\n\n', false );
		MainView.outputText( 'Her belly fills, distending far more than it has in the past, and not one drop of cum of what - you presume - has been your longest orgasm yet escapes from her throat.', false );
		//[(if PC has large cum amount);
		if( CoC.player.cumQ() >= 750 ) {
			MainView.outputText( '  You keep pumping and she keeps drinking; her distended belly doesn\'t stop growing until she looks heavily pregnant and you\'re spent.', false );
		}
		MainView.outputText( '\n\n', false );
		//call followup function;
		this.rapeCorruptAmily3Epilogue();
	};
	//[Female];
	AmilyScene.prototype.rapeCorruptAmily3Female = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You strip while Amily watches hungrily.  Finally naked, you order the mouse to come closer and use her breasts to pleasure you. Amily scoots closer on her knees and presses her breasts against your ' + Descriptors.vaginaDescript() + ', one orb at a time. You smile and moan softly as her erect nipple stimulates your labia; ', false );
		//[(if PC is a squirter);
		if( CoC.player.wetness() >= 5 ) {
			MainView.outputText( 'you show her your enjoyment by spurting a jet of femcum all over her breasts, washing them with sexual lubricant. Amily can\'t help but smile as she looks at her now glistening breasts.', false );
		}//(else);
		else {
			MainView.outputText( 'moisture gathers and drips over Amily\'s sensitive nipples, causing the mousette to sigh in pleasure and smile as she looks at her wet nipples.', false );
		}
		MainView.outputText( '\n\n', false );
		//[(if PC's clit is big enough);
		if( CoC.player.clitLength >= 4 ) {
			MainView.outputText( 'Amily then crushes your sensitive clit between her breasts, working her mounds over it like it was a cock. You gasp and moan as Amily smiles up at you, happy to see your reaction to her stimulation.', false );
		}
		//(else);
		else {
			MainView.outputText( 'Amily decides to tease your sensitive clit with her wet nipples, circling the little nub and sending electric shocks up your spine; you can\'t help but moan; Amily just smiles and grinds her generous breasts harder against your pussy.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'With a final push of your fingers against your ' + Descriptors.vaginaDescript() + ', you cum; spilling juices all over the eager mousette. She hastens to try and lick it up in mid-stream; most of it ends up on her face, but what does get inside her open maw disappears quickly. You finish up and watch as Amily licks her lips, trying to taste more of you.\n\n', false );
		//(if PC is < 60 Corruption);
		if( CoC.player.cor < 60 ) {
			MainView.outputText( 'Satisfied for the moment, you leave the smiling mouse lying in a pool of juices and return to the camp.', false );
			CoC.player.orgasm();
			EngineCore.dynStats( 'cor', 2 );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		MainView.outputText( 'That was good, but now it\'s time to reward Amily for her efforts, besides you could really use a proper licking.\n\n', false );
		MainView.outputText( 'You sit on a nearby stump and say, "<i>Get up cumbucket, it\'s time to properly reward you.</i>"\n\n', false );
		MainView.outputText( 'Amily springs up and rushes to nuzzle your still leaking vagina. "<i>Thank you! Thank you! Thank you!</i>" she says excitedly. Then, with a lick of her lips, she opens wide and engulfs your whole ' + Descriptors.vaginaDescript() + '.', false );
		//[(if PC is a squirter);
		if( CoC.player.wetness() >= 5 ) {
			MainView.outputText( '  Her nose bumps against your clit, causing you to release a jet of juices up the mousette\'s throat. To your surprise, she doesn\'t spill even a single drop and happily gulps all of it down.', false );
		}
		MainView.outputText( '  She licks and kisses your lower lips, making out with them as if they were the lips of a long lost lover. Her ropey mouse tail sways happily behind her with every noisy slurp. It\'s wonderful to see how good Amily\'s gotten at this; you could even say this is what she was born for, licking pussy. The only way this could be any better is if Amily was a succubus herself. After all, you have no doubt that as good as Amily is, she\'s still no match for a sex demon. That\'s not a bad idea actually; maybe you should push to convert her into a demon?  Your own personal cumslut of a pussy licking demon to dump your juices into whenever you feel like. Your pussy contracts at the idea, as if in approval. The image of a demonized Amily servicing you sends a ripple of wild pleasure throught your pussy, and you feel the thought distill into a giant flood of juices.  You\'re all too happy to dump it into Amily\'s eager maw. You grab her ears and forcibly pull her head into your crotch, crushing her nose against your clit and her mouth against your pussy, she moans with joy at the deed and then you explode.\n\n', false );
		MainView.outputText( 'You flood her maw at an alarming rate. Someone not practiced in the art of juice guzzling would surely choke and drown on the amazing amount of femcum that you\'re dumping into Amily\'s maw; yet she not only manages to chug it all down, she even continues licking to draw out more. Even more surprising than that is the fact that her mouth seems to have formed a perfect seal around your ' + Descriptors.vaginaDescript() + ', ensuring not a single drop escapes her.', false );
		//[(if PC is a squirter);
		if( CoC.player.wetness() >= 5 ) {
			MainView.outputText( '  You keep on spilling more and more juices; at one point you worry you might become dehydrated, but the pleasure of your overwhelming orgasm is enough to make you push the thought away. Amily doesn\'t stop drinking, even as her belly begins distending. You keep cumming until you are spent.', false );
		}
		MainView.outputText( '\n\n', false );
		//Link to followup.;
		this.rapeCorruptAmily3Epilogue();
	};
	//Both variants link here;
	AmilyScene.prototype.rapeCorruptAmily3Epilogue = function() {
		this.amilySprite();
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00170 ]++;
		MainView.outputText( 'Amily falls on her back, licking her lips and rubbing her bulging belly. Then she begins moaning as something starts changing. Her tail thrashes madly between her legs, and you watch enraptured as a spade-like tip forms on the tip of her tail. On top of her head a pair of small bumps appear, then develop into small cute demonic horns... Just like you imagined. Could it be that the true source of Amily\'s transformation was you, and not the mixture?\n\n', false );
		MainView.outputText( 'You smile wickedly. It was you all along; corrupting the mousette into a slut. You turn around and start back towards your camp.\n\n', false );
		MainView.outputText( '"<i>Please! Wait, ' + CoC.player.mf( 'master', 'mistress' ) + ', please!</i>" Amily yells, you turn around and look back at her. "<i>I want more. Please,</i>" she begs.\n\n', false );
		MainView.outputText( '"<i>So you do? Well... I\'ll give you more, if you pass a test,</i>" you tell her.\n\n', false );
		MainView.outputText( 'She gets up and kneels, looking up to you in attention. "<i>I\'m willing to take you in as my cumbucket, only if you obey all my orders and keep practicing to pleasure me even more,</i>" you say.\n\n', false );
		MainView.outputText( 'Amily happily answers, "<i>Anything you desire!</i>"\n\n', false );
		MainView.outputText( '"<i>I will return when I think you\'re ready.</i>" You say, then leave her to her own devices.', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'lib', -2, 'cor', 5 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[Raping Amily 4];
	//Herms will get to pick how to fuck her.;
	AmilyScene.prototype.rapeCorruptAmily4Meeting = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		//(if PC is genderless);
		if( CoC.player.gender === 0 ) {
			MainView.outputText( 'You would love to play with your mouse bitch, but you don\'t have the parts for that; so you return to the camp.', false );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		MainView.outputText( 'You enter the ruined village hoping to find your corrupted mouse cumbucket. It doesn\'t take long until you spot her; she\'s stroking her pussy and blowing a wood carved dildo, practicing like you told her to.\n\n', false );
		MainView.outputText( 'As soon as she realizes you\'re there, she drops the dildo and rushes towards you; kneeling submissively in front of you, she nuzzles your crotch and asks, "<i>' + CoC.player.mf( 'Master', 'Mistress' ) + ', did you come to feed me?</i>"\n\n', false );
		MainView.outputText( 'You smile and scratch her behind one ear, drawing a pleasured sigh from the corrupted mouse. You can\'t help but recall how prudish she was, refusing and attacking you; now she\'s really come a long way, begging for a drop of cum at the very sight of you.  "<i>Let\'s see if you\'re ready,</i>" you say, roughly grabbing her ear and pulling her away.\n\n', false );
		//[(if herm);
		if( CoC.player.gender === 3 ) {
			MainView.outputText( 'Which part should you use to finish off the mousette?', false );
			//[Cock] [Pussy];
			EngineCore.choices( 'Cock', this, this.rapeCorruptAmily4Male, 'Pussy', this, this.rapeCorruptAmily4Female, '', null, null, '', null, null, '', null, null );
		} else if( CoC.player.gender === 2 ) {
			EngineCore.doNext( this, this.rapeCorruptAmily4Female );
		} else {
			EngineCore.doNext( this, this.rapeCorruptAmily4Male );
		}
	};
	//[Male];
	AmilyScene.prototype.rapeCorruptAmily4Male = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You slowly strip off your ' + CoC.player.armorName + ', while Amily pants in anticipation. When you\'re done you present to her your erect ' + Descriptors.cockDescript( 0 ) + '; she quickly nuzzles and kisses along your length, rubbing her breasts along your length', false );
		//[(if pc has balls);
		if( CoC.player.balls > 0 ) {
			MainView.outputText( ' and ' + Descriptors.ballsDescriptLight(), false );
		}
		MainView.outputText( '.\n\n', false );
		MainView.outputText( '"<i>Get to it,</i>" you order her.\n\n', false );
		MainView.outputText( 'She backs off and gives your tip a light kiss, which quickly turns into a slurp as you feel your ' + Descriptors.cockDescript( 0 ) + ' slip into her throat; there is barely any resistance, your cock glides down her throat, Amily doesn\'t gag at all.', false );
		//[(if PC is huge);
		if( CoC.player.cockArea( 0 ) > 50 ) {
			MainView.outputText( '  You smirk, pleased; with your size, you\'d probably choke whomever tried to swallow your ' + Descriptors.cockDescript( 0 ) + ' to death. But Amily doesn\'t choke or gag, she\'s only capable of moaning in delight with each inch that she manages to fit inside her hungry maw.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'In no time at all, you\'re all the way inside her maw; she looks up at you smiling, as her tongue darts out to give ', false );
		if( CoC.player.balls > 0 ) {
			MainView.outputText( 'your balls', false );
		} else if( CoC.player.hasVagina() ) {
			MainView.outputText( 'your pussy', false );
		} else {
			MainView.outputText( 'the base of your cock', false );
		}
		MainView.outputText( ' a teasing lick. You smile back and say, "<i>Go ahead, pleasure me.</i>" Amily moans and begins moving her tongue and maw along your shaft.\n\n', false );
		MainView.outputText( 'You grip her ears for leverage, when did she get so good at this? She must\'ve been practicing all the time... She bobs her head along you eagerly, hungrily, and almost desperately.', false );
		//[(if PC has balls);
		if( CoC.player.balls > 0 ) {
			MainView.outputText( '  Sometimes you even feel her nipples brush your balls teasingly.', false );
		}
		MainView.outputText( '  Each time her nose bumps against your crotch, she swallows, massaging your whole length; and each time she pulls back, she blows, sending pleasurable chills along your body.', false );
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'You feel your cock getting even harder as you feel your orgasm building up. Amily must feel it too, as she doubles her work to pleasure you. You pull her head flush against you and blow your load deep into her throat. Amily moans in pleasure and delight, juices hitting the floor and wetly signalling her own orgasm.  She gulps all you offer her hungrily, sucking and massaging your dick to draw as much cum out of you as possible.', false );
		//[(if PC has balls);
		if( CoC.player.balls > 0 ) {
			MainView.outputText( '  One of her hands even begins kneading your balls, attempting to coax even more out of you.', false );
		}
		MainView.outputText( '\n\n', false );
		//(if PC's corruption < 80);
		if( CoC.player.cor < 80 ) {
			MainView.outputText( 'You push her back and withdraw, spent. Amily looks up to you adoringly, ', false );
			//[(if PC has huge cum amount);
			if( CoC.player.cumQ() >= 750 ) {
				MainView.outputText( 'her belly distended to the point that she looks pregnant and just about ready to give birth.', false );
			}//(else);
			else {
				MainView.outputText( 'her belly filled with the huge load you just dumped in her.', false );
			}
			MainView.outputText( '\n\n', false );
			MainView.outputText( 'You try to summon more strength to continue fucking the mouse\'s wonderful throat, but for the moment you\'re spent. "<i>Go and keep practicing, I\'ll come to feed you later.</i>" Amily smiles, licks her lips and gives your cock a parting kiss before running away to one of her hideouts.\n\n', false );
			MainView.outputText( 'You return to the camp.', false );
			CoC.player.orgasm();
			EngineCore.dynStats( 'cor', 3 );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		MainView.outputText( 'You push her back and withdraw, not yet satisfied. <b>A familiar power gathers inside you, and you decide to tap into it.</b>\n\n', false );
		MainView.outputText( '"<i>I have decided to make you my bitch; to make you into a willing cum-dumpster for me to dump my load into whenever I feel like it. If you want that. Beg for it, grovel at my feet and beg me to finish your corruption into a true cumslut. Do a good enough job and I might even consider knocking you up.</i>" You say, smiling wickedly.\n\n', false );
		MainView.outputText( 'Moaning, she drops on fours and crawls toward you to grovel at your ' + CoC.player.feet() + ', rubbing her face on the very ground you stand on, and begging all the while.\n\n', false );
		MainView.outputText( '"<i>Please ' + CoC.player.mf( 'master', 'mistress' ) + ', make me your cumbucket. There is nothing I would love more than to become a receptacle for your lust. This would be like a dream come true! Please, oh please ' + CoC.player.mf( 'master', 'mistress' ) + '! Knock me up and allow me to birth more mice to worship you like you deserve.</i>"\n\n', false );
		MainView.outputText( 'Her words please you, and you ', false );
		if( CoC.player.isNaga() ) {
			MainView.outputText( 'coil your serpentine tail around her head.', false );
		} else if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_GOO ) {
			MainView.outputText( 'engulf her maw in slime.', false );
		} else {
			MainView.outputText( 'put a ' + CoC.player.foot() + ' on her head.', false );
		}
		MainView.outputText( ' She falls silent and you say. "<i>Very well. From now on I am your one and only ' + CoC.player.mf( 'master', 'mistress' ) + '.  You will address me as such, always. My word is law, and you shall do whatever I tell you to, whenever I tell you to. Rise, it\'s time to break you into your new role as my cum-dumpster.</i>"\n\n', false );
		MainView.outputText( 'You let her go and she rises to her knees. "<i>Now prove your fealty. Blow me!</i>" you order her.\n\n', false );
		MainView.outputText( 'Amily wastes no time and gets to work.  You let her suck on her favorite thing in the world for a while; then you tell her to lick you, to work her tongue all around your shaft', false );
		//[(if PC has balls);
		if( CoC.player.balls > 0 ) {
			MainView.outputText( ' and balls', false );
		}
		MainView.outputText( '.\n\n', false );
		MainView.outputText( 'She obeys you at once; following your orders is like second nature to her. An image of an even more corrupted Amily comes to your mind. Demonic features adorn her as she becomes a mix of succubus and mouse. You focus into those thoughts and send them towards your cock.\n\n', false );
		MainView.outputText( '"<i>Stop and stand still. It\'s time to baptise you,</i>" you tell her, panting.\n\n', false );
		MainView.outputText( 'Amily closes her eyes and bows slightly, giving you a clear shot of her head.  Finally, you let go.\n\n', false );
		MainView.outputText( 'Black spunk comes out of your ' + Descriptors.cockDescript( 0 ) + ', ripe with corruption. The moment it hits Amily\'s head, she moans. Your vile cum covers her whole head, then her whole upper body, and spreads along her body unnaturally. Not even a crevice is left free as your black jism permeates her skin and covers her like a full body suit. Soon enough she\'s covered from head to toe. Her pussy leaks copiously and she moans throughout the whole affair.\n\n', false );
		this.rapeCorruptAmily4Epilogue();
	};
	//[Female];
	AmilyScene.prototype.rapeCorruptAmily4Female = function() {
		this.amilySprite();
		MainView.outputText( '', true );
		MainView.outputText( 'You slowly strip off your ' + CoC.player.armorName + ', while Amily pants in anticipation. When you\'re done you present to her your dripping ' + Descriptors.vaginaDescript() + '; she quickly nuzzles and kisses your clit.', false );
		//[(if PC has balls);
		if( CoC.player.balls > 0 ) {
			MainView.outputText( '  Pulling back enough to give your balls a teasing lick.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( '"<i>Get to it,</i>" You order her.\n\n', false );
		MainView.outputText( 'She goes back to nuzzling and kissing along your netherlips; she inhales deeply, enjoying the scent of your wet pussy, then exhales right on your clit. It tickles you enough to make you ', false );
		//[(if PC is a squirter);
		if( CoC.player.wetness() >= 5 ) {
			MainView.outputText( 'wet her face with a small jet of juices.', false );
		}//(else);
		else {
			MainView.outputText( 'even wetter.', false );
		}
		MainView.outputText( '  Amily digs into your ' + Descriptors.vaginaDescript() + ' like her life depended on it; slurping, kissing, sucking and lapping every single drop of juice that she manages to get to. The sound of wet pussy and lapping tongue fills the air.\n\n', false );
		MainView.outputText( 'Finally, Amily\'s tongue penetrates deep into your ' + Descriptors.vaginaDescript() + '. She takes great care to stimulate you in all the right ways; it\'s as if she had a map to every pleasurable spot inside your love-hole. You moan, proud of the corrupt mousette. To get this good, she must\'ve really worked hard on her training. You scratch her behind her ears, earning a pleasured moan that sends ripples of pleasure throughout your insides. "<i>You\'re doing great slut. Keep at it.</i>" You tell her. She answers with a muffled, "<i>Thank you, mistress,</i>" and doubles her efforts to please you.\n\n', false );
		MainView.outputText( 'The pleasure is overwhelming, Amily\'s practiced licks are able to send you into multiple orgasms, at one point you have to resort to supporting yourself on her head; something she doesn\'t seem to mind. In fact, realizing what kind of effect her pussy eating is having just eggs her on. She pushes and grinds her nose on your pussy; bumping on your clit with each lick; sending shocks of pleasure up your spine.', false );
		//[(if PC has a big clit);
		if( CoC.player.clitLength >= 4 ) {
			MainView.outputText( '  One of her hands begins stroking your erect clit as if it was a cock. The pleasure of the act nearly overloads your senses.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'You feel the biggest orgasm yet build up, and you decide to reward your obedient little cumslut by making sure she gets all of it. "<i>Clamp down on my pussy slut. I\'m about to reward you for all your effort.</i>" Amily loses no time in obeying your orders. She gives your pussy one final lap, and you feel it.', false );
		//[(if PC is a squirter);
		if( CoC.player.wetness() >= 5 ) {
			MainView.outputText( '  Amily barely has to work to drink your juices, your pussy jets them forth with such force that all of them go straight through Amily\'s mouth and into her throat.', false );
		}//(else);
		else {
			MainView.outputText( '  Amily drinks from you like a parched man drinks from a well.', false );
		}
		MainView.outputText( '  Every drop offered is consumed, something you\'ve come to expect from your elected cum-bucket. One final powerful gush of fluids signals the end of your orgasm.\n\n', false );
		//(if PC's corruption < 80);
		if( CoC.player.cor < 80 ) {
			MainView.outputText( 'You push her back and withdraw, spent, ', false );
			//[(if PC is a squirter);
			if( CoC.player.wetness() >= 5 ) {
				MainView.outputText( 'her belly distended from the immense amount of femcum she just drank.', false );
			}//(else);
			else {
				MainView.outputText( 'her belly slightly distended from the flood of juices you just dumped in her.', false );
			}
			MainView.outputText( '\n\n', false );
			MainView.outputText( 'You feel like you should continue, but are too weak to do so... "<i>Go and keep practicing, I\'ll come to feed you later,</i>" you tell her.  Amily smiles, licks her lips and gives your pussy a parting kiss before running away to one of her hideouts.\n\n', false );
			MainView.outputText( 'You return to the camp.', false );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			CoC.player.orgasm();
			EngineCore.dynStats( 'cor', 3 );
			return;
		}
		MainView.outputText( 'You push her back and withdraw, not yet satisfied. <b>A familiar power gathers inside you, and you decide to tap into it.</b>\n\n', false );
		MainView.outputText( '"<i>I have decided to make you my bitch; to make you into a willing cum-dumpster for me to dump my load into whenever I feel like it. If you want that. Beg for it, grovel at my feet and beg me to finish your corruption into a true cum-slut,</i>" you say, smiling wickedly.\n\n', false );
		MainView.outputText( 'Moaning, she drops on all fours and crawls toward you to grovel at your ' + CoC.player.feet() + ', rubbing her face on the very ground you stand on, and begging all the while.\n\n', false );
		MainView.outputText( '"<i>Please ' + CoC.player.mf( 'master', 'mistress' ) + ', make me your cum-bucket. There is nothing I would love more than to become a receptacle for your lust. This would be like a dream come true! Please, oh please ' + CoC.player.mf( 'master', 'mistress' ) + '!  Allow me to knock you up so you can birth more mice to worship you like you deserve.</i>"\n\n', false );
		MainView.outputText( 'Her words please you, and you ', false );
		if( CoC.player.isNaga() ) {
			MainView.outputText( 'coil your serpentine tail around her head.', false );
		} else if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_GOO ) {
			MainView.outputText( 'engulf her maw in slime.', false );
		} else {
			MainView.outputText( 'put a ' + CoC.player.foot() + ' on her head.', false );
		}
		MainView.outputText( '  She falls silent and you say, "<i>Very well. From now on I am your one and only mistress. You will address me as such, always. My word is law, and you shall do whatever I tell you to, whenever I tell you to. Rise, it\'s time to break you into your new role as my cum-dumpster.</i>"\n\n', false );
		MainView.outputText( 'You let her go and she rises to her knees. "<i>Now prove your fealty. Lick me!</i>" you order her.\n\n', false );
		MainView.outputText( 'Amily wastes no time and gets to work.  She licks your ' + Descriptors.vaginaDescript() + ' adoringly, like it was a holy relic for her to worship.', false );
		//[(if PC has balls);
		if( CoC.player.balls > 0 ) {
			MainView.outputText( '  She ignores your balls for the moment, so concentrated in her task, that she barely notices them resting on top of her head.', false );
		}
		MainView.outputText( '  You tell her to work harder and she eagerly complies, licking and kissing faster and harder; working you into another mind-blowing orgasm. An image of an even more corrupted Amily comes to your mind. Demonic features adorn her as she becomes a mix of succubus and mouse. You focus into those thoughts and send them down your pussy.\n\n', false );
		MainView.outputText( '"<i>Stop and stand still. It\'s time to baptise you,</i>" you tell her, panting.\n\n', false );
		MainView.outputText( 'Amily closes her eyes and bows slightly, giving you a clear shot of her head.  Finally, you let go.\n\n', false );
		MainView.outputText( 'Black juices squirt from your ' + Descriptors.vaginaDescript() + ', ripe with corruption.  The moment it hits Amily\'s head, she moans. Your vile femcum covers her whole head, then her whole upper body, and spreads along her body unnaturally. Not even a crevice is left free as your black juices permeate her skin and cover her like a full body suit. Soon enough she\'s covered from head to toe. Her pussy leaks copiously and she moans throughout the whole affair.\n\n', false );
		this.rapeCorruptAmily4Epilogue();
	};
	//Both variations link here.;
	AmilyScene.prototype.rapeCorruptAmily4Epilogue = function() {
		this.amilySprite();
		MainView.outputText( 'Your cum is completely absorbed by her and she doubles over in pleasure as she screams. Her biggest orgasm yet rocks her to the core; her eyes roll back and you see her begin to change.\n\n', false );
		MainView.outputText( 'Her ' + ((CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0) ? 'fur turns to a lewd purple' : 'hair turns into a lewd purple, skin fading to a light lavender') + '; her small horns grow and become more defined; small bat-like wing sprout from her shoulders; the spade-like tip of her tail grows bigger and more defined; ', false );
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'her feet warp into a mix of mousy foot-paws and demonic claws, complete with ebony claws and a fourth joint', false );
		} else {
			MainView.outputText( 'her feet are forced into a perpetual tip-toe as the trademark demonic bone juts from her heel', false );
		}
		MainView.outputText( '; her hands grow small black claws.  Finally, her eyes focus back on you, now with a seductive glow.\n\n', false );
		MainView.outputText( 'She looks herself over, examining and enjoying her new sensitive body; every movement is accompanied with a pleasured sigh or a moan. She looks at you and kneels in front of you, a rush of fluids escapes her pussy as she does so. "<i>' + CoC.player.mf( 'Master', 'Mistress' ) + '... What are your orders?</i>" Amily asks with a seductive tone.\n\n', false );
		MainView.outputText( 'You grin wickedly. The mousette has really become part succubus. "<i>I want you to come and settle next to my camp.  I need my cumslut close whenever I call,</i>" you say.\n\n', false );
		MainView.outputText( 'Amily grins and replies seductively, "<i>Yes, ' + CoC.player.mf( 'master', 'mistress' ) + '... Your orders are my pleasure.</i>"\n\n', false );
		MainView.outputText( '<b>(Corrupted Amily added to slaves)</b>', false );
		//Add corrupted amily flag here;
		CoC.flags[ kFLAGS.AMILY_FOLLOWER ] = 2;
		//Switch to less lovey pregnancy!;
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_AMILY ) {
			CoC.player.knockUpForce( PregnancyStore.PREGNANCY_MOUSE, CoC.player.pregnancyIncubation );
		}
		//Make babies disappear;
		//pregnancyStore.knockUpForce(); //Clear Pregnancy - though this seems unneccessary to me. Maybe it was needed in an older version of the code?;
		//Set other flags if Amily is moving in for the first time;
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00173 ] === 0 ) {
			CoC.flags[ kFLAGS.AMILY_CUP_SIZE ] = 5;
			CoC.flags[ kFLAGS.AMILY_NIPPLE_LENGTH ] = 0.5;
			CoC.flags[ kFLAGS.AMILY_HIP_RATING ] = 12;
			CoC.flags[ kFLAGS.AMILY_ASS_SIZE ] = 12;
			CoC.flags[ kFLAGS.AMILY_VAGINAL_WETNESS ] = 1;
			CoC.flags[ kFLAGS.AMILY_CLOTHING ] = 'sexy rags';
		}
		//if marble is there, tag it for freakout;
		if( CoC.player.findStatusAffect( StatusAffects.CampMarble ) >= 0 ) {
			CoC.flags[ kFLAGS.MARBLE_OR_AMILY_FIRST_FOR_FREAKOUT ] = 1;
		} else {
			CoC.flags[ kFLAGS.MARBLE_OR_AMILY_FIRST_FOR_FREAKOUT ] = 2;
		}
		//Disable amily encounters in the village!;
		CoC.flags[ kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED ] = 1;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};

	//[Stalking Amily (Corrupt)];
	//This event takes about 3 hours.;
	//Only happens if the PC has the Potent Mixture and is >= 25 Corruption.;
	AmilyScene.prototype.stalkingZeAmiliez = function() {
		MainView.outputText( '', true );
		MainView.outputText( 'You step into the ruined village and set out to look for Amily.\n\n', false );
		//(If PC's intellingence >= 50 and speed >= 65);
		if( CoC.player.inte >= 50 && CoC.player.spe >= 65 ) {
			this.amilySprite();
			MainView.outputText( 'You cautiously survey the surroundings, and finally spot some recent tracks made by Amily. It\'s clear she tried to hide them, but using your superior wits, you not only find the routes leading to all of her hideouts, but deduce which hideout she\'ll use next and decide to hide inside; now, all that\'s left to do is wait...\n\n', false );
			MainView.outputText( 'You wait for quite some time, but eventually you hear Amily approaching; she checks the hideout for any signs of intrusions, but you have concealed your presence well and she finds nothing. Satisfied, she sets down a bag with some fruits she gathered and sits down on a stool, letting out a sigh of relief.\n\n', false );
			MainView.outputText( 'This is your cue to act; you quickly burst out of your hideout and swipe her blowpipe away. Amily jumps away in surprise and tries to reach for her knife, but you\'re too fast; you knock her off her feet and grab her wrists, pinning her against the floor as her knife skids away. "<i>Hello Amily.</i>" you say with a wicked smile.\n\n', false );
			MainView.outputText( '"<i>N-No! Get off me!</i>" She yells back, panicked at her predicament. You hold both her wrists with one hand above her head, then take one of her darts and stab her in the thigh. She squeaks loudly and ceases her struggling, the drugs within the dart quickly knocking her out.\n\n', false );
			MainView.outputText( 'You smile as you strip her off, then you find a rope to tie her up. You tie her hands together, then tie her hands to her ankles, ensuring she won\'t be able to fight you back. After that, you dispose of anything that could be used as a weapon, or could aid her in her escape, then sit down on the stool she was sitting earlier to wait until she\'s recovered her consciousness. After all, it\'s much more fun if she\'s awake to see everything you\'ll do to her...\n\n', false );
			//[Proceed to rape scene.];
			//RAPE 1 GO;
			this.chooseYourAmilyRape();
		}
		//(if PC's intelligence >= 50);
		else if( CoC.player.inte >= 50 ) {
			this.amilySprite();
			MainView.outputText( 'You cautiously survey the surroundings, and finally spot some recent tracks made by Amily. It\'s clear she tried to hide them, but using your superior wits, you not only find the routes leading to all of her hideouts, but deduce which hideout she\'ll use next and decide to hide inside; now, all that\'s left to do is wait...\n\n', false );
			MainView.outputText( 'You wait for quite some time, but eventually you hear Amily approaching; she checks the hideout for any signs of intrusions, but you have concealed your presence well and she finds nothing. Satisfied, she sets down a bag with some fruits she gathered and sits down on a stool, letting out a sigh of relief.\n\n', false );
			MainView.outputText( 'This is your cue to act; you quickly burst out of your hideout and swipe her blowpipe away. Amily jumps away in surprise and reaches for her knife, assuming a fighting stance. You ready your ' + CoC.player.weaponName + ' and prepare to teach the foolish mouse a lesson.\n\n', false );
			//[Proceed to battle.];
			Combat.startCombat( new Amily(), true );
		}
		//(if PC's speed >= 65);
		else if( CoC.player.spe >= 65 ) {
			this.amilySprite();
			MainView.outputText( 'You walk about the village, looking for Amily, but after searching for a while with no luck, you catch a break when you hear some bushes moving.\n\n', false );
			MainView.outputText( 'You spot Amily just in time to see a dart flying towards you; but you quickly sidestep the dart and rush towards her. Realising she missed, she reaches for another dart; but you won\'t allow it, you take a rock lying on the ground and throw it at her blowpipe, striking it out of her hand.\n\n', false );
			MainView.outputText( 'Panicked, she takes her knife and prepares to fight you. You ready your ' + CoC.player.weaponName + ' and prepare to teach the foolish mouse a lesson.\n\n', false );
			//[Proceed to battle.];
			Combat.startCombat( new Amily(), true );
		} else {
			MainView.outputText( 'You search for Amily high and low, but can\'t find a single trace of her. Frustrated, you return to the camp.  Maybe if you were smarter or faster you could find her.', false );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseTwoHours );
		}
	};

	//[Stalking Amily 2 (Corrupt)];
	AmilyScene.prototype.stalkingZeAmiliez2 = function() {
		MainView.outputText( '', true );
		//(if PC is genderless);
		if( CoC.player.gender === 0 ) {
			MainView.outputText( 'You think about going into the ruined village, but playing with Amily is not going to be possible if you don\'t have the parts for it... You return to your camp.', false );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		}
		//(else);
		else {
			this.amilySprite();
			MainView.outputText( 'You step into the ruined village and set out to look for Amily.\n\n', false );
			MainView.outputText( 'It doesn\'t take long before you locate her and you immediately see how she\'s changed after the first dose of her special medicine.\n\n', false );
			MainView.outputText( 'Her hips and butt have grown bigger, her breasts also seem fuller; overall she looks far more feminine and attractive now. You can already feel your ', false );
			if( CoC.player.hasCock() ) {
				MainView.outputText( Descriptors.cockDescript( 0 ) + ' getting hard', false );
				if( CoC.player.hasVagina() ) {
					MainView.outputText( ' and your ', false );
				}
			}
			if( CoC.player.hasVagina() ) {
				MainView.outputText( Descriptors.vaginaDescript() + ' growing wet', false );
			}
			MainView.outputText( '.\n\n', false );
			MainView.outputText( '"<i>Hey Amily! I\'ve got more juice for you!</i>" you call out to her, shaking the bottle filled with the mixture in the air.\n\n', false );
			MainView.outputText( 'She squeaks in surprise, apparently she hadn\'t noticed you; she begins fidgeting and shaking.\n\n', false );
			MainView.outputText( '"<i>What\'s the matter? Don\'t you want more?</i>" You ask.\n\n', false );
			//(if PC's corruption < 45);
			if( CoC.player.cor < 45 ) {
				MainView.outputText( 'Amily shakes her head and yells, "<i>No! I can\'t!</i>" before darting off.\n\n', false );
				MainView.outputText( 'You laugh and put the bottle away, then return to your camp.\n\n(Not corrupt enough...)', false );
				EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
				return;
			}
			MainView.outputText( 'You begin stripping off your ' + CoC.player.armorName + ' and show her your ', false );
			if( CoC.player.hasCock() ) {
				MainView.outputText( 'erect ' + Descriptors.cockDescript( 0 ), false );
				if( CoC.player.hasVagina() ) {
					MainView.outputText( ' and ', false );
				}
			}
			if( CoC.player.hasVagina() ) {
				MainView.outputText( ' dripping ' + Descriptors.vaginaDescript(), false );
			}
			MainView.outputText( '. "<i>Come and I\'ll let you drink more of me.</i>"\n\n', false );
			MainView.outputText( 'Amily shakes her head and says, "<i>No! I-I can\'t,</i>" but she begins walking towards you nevertheless.\n\n', false );
			MainView.outputText( 'Once she\'s close, she kneels before you and you uncork the bottle. "<i>Open wide!</i>" you say, smiling.\n\n', false );
			MainView.outputText( 'You shove the bottle into her mouth and she greedily gulps down everything. Once empty, you discard the bottle and watch as she moans loudy and juices her pants.\n\n', false );
			MainView.outputText( 'You laugh, but take a step back when she reaches for her knife; then proceeds to cut off her ragged clothing, disposing of it along with the knife. "<i>Aaaah... Much better,</i>" she says in relief.\n\n', false );
			MainView.outputText( 'Glad to see she meant you no harm, you decide it\'s time to reward her for her openness. "<i>Now open wide once more, Amily. It\'s time for your reward.</i>" you tell her.\n\n', false );
			MainView.outputText( '"<i>Yes! Please I need it!</i>" she says eagerly, closing her eyes and opening her mouth.', false );
			CoC.player.removeKeyItem( 'Potent Mixture' );
			//RAPE 2 GO;
			this.chooseYourAmilyRape();
		}
	};
	//[Stalking Amily 3 (Corrupt)];
	AmilyScene.prototype.stalkingZeAmiliez3 = function() {
		MainView.outputText( '', true );
		//(if PC is genderless);
		if( CoC.player.gender === 0 ) {
			MainView.outputText( 'You think about going into the ruined village, but playing with Amily is not going to be possible if you don\'t have the parts for it... You return to your camp.', false );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		this.amilySprite();
		MainView.outputText( 'You step into the ruined village and set out to look for Amily.\n\n', false );
		MainView.outputText( 'You barely have to search, as Amily finds you herself. Her figure has changed very dramatically since the first time you two met, she has developed a perfect hourglass figure; with generous breasts, a full butt and wide flanks. She just looks at you with hungry, lusty eyes, panting and drooling a bit.\n\n', false );
		MainView.outputText( 'You begin to greet her, but she quickly dashes towards you and kneels before you.\n\n', false );
		MainView.outputText( '"<i>I need you! I need more of you! Please let me drink moooore!</i>" she begs, nuzzling your crotch; ', false );
		if( CoC.player.hasCock() ) {
			MainView.outputText( 'driving your ' + Descriptors.cockDescript( 0 ) + ' into erection', false );
			if( CoC.player.hasVagina() ) {
				MainView.outputText( ' and ', false );
			}
		}
		if( CoC.player.hasVagina() ) {
			MainView.outputText( ' moistening your ' + Descriptors.vaginaDescript(), false );
		}
		MainView.outputText( '.  Amily\'s nose twitches a little and she forcibly pulls your pants down, looking up at you with pleading eyes, as if asking for permission.\n\n', false );
		MainView.outputText( '"<i>Don\'t you want more of your medicine?</i>" you ask, showing her the bottle with the mixture.\n\n', false );
		MainView.outputText( 'She takes the bottle from your hand and throws it away. "<i>No. All I need is your cum... Please let me drink more. I-I\'ll do anything you want, just let me have a taste. Please?</i>" She begs.\n\n', false );
		CoC.player.removeKeyItem( 'Potent Mixture' );
		MainView.outputText( 'Surprised at her forwardness, you realize something. She must be addicted to you, or more specifically... Your cum. You barely supress the urge to laugh, this is priceless! The prudish mouse has been reduced to a needy addict. This is almost too perfect, you were just imagining previously how good it\'d be if she turned into a cumslut.\n\n', false );
		MainView.outputText( '"<i>You\'ll do anything, you say? I want you to grovel at my feet and beg me!</i>" you order.\n\n', false );
		MainView.outputText( 'Amily plants her head on the ground and starts. "<i>' + CoC.player.mf( 'Master', 'Mistress' ) + ', please let me drink more of your cum. Please! I need it so bad that I can\'t help but drool. I need it so bad that not being able to drink from you is like torture. Please let me drink!</i>"\n\n', false );
		MainView.outputText( 'You laugh at the mousette, then say, "<i>Very well! I will you allow you to drink from me, you worthless cunt!</i>"', false );
		//RAPE 3 GO;
		this.chooseYourAmilyRape();
	};
	//Warning of Taint:;
	AmilyScene.prototype.amilyTaintWarning = function() {
		MainView.outputText( '', true );
		this.amilySprite();
		MainView.outputText( 'Amily approaches you, looking concerned.  "<i>Darling... I don\'t know what\'s been going on, but you need to start taking better care of yourself.  I can smell the corruption taking root in you - if you don\'t stop, you\'ll soon start acting like any other demon.</i>"\n\n', false );
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00173 ] = 1;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Farewell Note:;
	AmilyScene.prototype.farewellNote = function() {
		this.amilySprite();
		MainView.outputText( '\nWhen you awaken this morning, you find Amily gone and a small message left for you.\n\n', false );
		MainView.outputText( '"<i>Dear ' + CoC.player.short + ', I tried to warn you, but the corruption, it seems, was too strong for even you.  I don\'t want to do this, but I\'ve left the camp - I care too much for the ' + CoC.player.mf( 'man', 'woman' ) + ' you were to see you throw your life into depravity and sin as another demon. If you should manage to turn back from the abyss, then I will come back to you.</i>"\n\n', false );
		MainView.outputText( '<b>Amily has moved out!</b>\n\n', false );
		MainView.outputText( 'So what if you are aren\'t so pure anymore; you\'re still very much capable of helping her!  Maybe you should teach her a lesson?\n\n', false );
		//-(if PC's int >= 40);
		if( CoC.player.inte >= 40 ) {
			MainView.outputText( 'You begin to formulate a plan, but to put this plan into motion you\'ll require a Lust Draft and some Goblin Ale.  That damn rat is going to rue the day she denied you...', false );
		}
		//-(else);
		else {
			MainView.outputText( 'You think about some of the more interesting potions you found while exploring; perhaps you could use some of them...', false );
		}

		MainView.outputText( '  Maybe she had a point though?  You are getting pretty corrupt... these thoughts are proof enough.\n', false );
		CoC.flags[ kFLAGS.AMILY_FOLLOWER ] = 0;
		//Set - amily flipped her shit;
		CoC.flags[ kFLAGS.AMILY_CORRUPT_FLIPOUT ] = 1;
		//Enable village encounters;
		CoC.flags[ kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED ] = 0;
		//Change to plain mouse birth!;
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_AMILY ) {
			CoC.player.knockUpForce( PregnancyStore.PREGNANCY_MOUSE, CoC.player.pregnancyIncubation );
		}
	};
	//Amily's Return:;
	AmilyScene.prototype.amilyReturns = function() {
		this.amilySprite();
		MainView.outputText( '\nYou awaken to the sensation of limbs wrapped blissfully around your body, and discover Amily has curled up to you. She quickly wakes, and gives you a joyous smile.\n\n', false );
		MainView.outputText( '"<i>Thank you, ' + CoC.player.short + '. I don\'t know how you did it, or if it had anything to do with me, but you managed to do something that I\'ve never heard of anyone else having the will to do. You turned back from demonhood and repurified yourself again.</i>"\n\n', false );
		MainView.outputText( 'She squeezes you tightly, then gets up to start making breakfast.\n\n', false );
		MainView.outputText( '<b>Amily has moved back in.</b>\n', false );
		//Clear amily shit flipping;
		CoC.flags[ kFLAGS.AMILY_CORRUPT_FLIPOUT ] = 0;
		//Move in;
		CoC.flags[ kFLAGS.AMILY_FOLLOWER ] = 1;
		//Clear 'warning';
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00173 ] = 0;
		//Disable village encounters;
		CoC.flags[ kFLAGS.AMILY_VILLAGE_ENCOUNTERS_DISABLED ] = 1;
	};

	// [EVENT 3174: Ask Emily to ditch the fuzz];
	AmilyScene.prototype.amilyNoFur = function() {
		this.amilySprite();
		CoC.flags[ kFLAGS.AMILY_OFFERED_DEFURRY ] = 1;
		MainView.outputText( 'You shake your head gently and explain that your position has not changed. Amily looks annoyed, but respects your decision.  You interrupt her next thought with a clarification; you don\'t want to have sex with her because of her appearance.  "<i>...What do you mean?</i>" she asks, one of her hands idly moving up and tugging one of her mousey ears.  As gently as you can, you explain that mice (and rats, for that matter) are considered pests in your home world, and you can\'t find yourself inclined to mate with a walking version of them.\n\n', true );
		MainView.outputText( 'There\'s a long pause while Amily digests your implication.  "<i>You want me to... change?</i>" she asks quietly.  "<i>Would that... make you want to mate with me?</i>"  You can\'t make any promises, but it would definitely change your considerations, you explain.\n\n', false );
		MainView.outputText( 'After another long silence, she sighs.  "<i>I don\'t know.  What would my family say if I just... went and made myself a completely different person, all for the sake of a human?</i>"  You slowly move to her and lay a hand on her shoulder, forcing her to look once more into your eyes.  It\'s not the fact that she won\'t be a mouse, you insist.  It\'s the fact that she\'s moving on for the sake of her race.  She manages a little smile at that, her expression brightening just a bit.  "<i>I\'ll think about it,</i>" she finally decides.  "<i>If you can find some non-demonic reagents, perhaps we can give it a try.  If anything bad happens, though,</i>" she warns, wagging a finger at you threateningly.  She backs off and stands awkwardly for a second.\n\n', false );
		MainView.outputText( '"<i>Well, uh... bye,</i>" Amily concludes, whirling around and walking away.  You can\'t be sure, but it seems like she\'s exaggerating the sway of her hips a bit.  You don\'t think much of it, heading back toward camp and beginning to formulate a concoction to de-mouse your potential breeding partner.  Perhaps... a <b>golden seed</b> for a human face, a <b>black egg</b> to get rid of the fur, and some <b>purified succubus milk</b> to round things off.  You make a mental note to remember those ingredients, for they won\'t show up again and you\'d feel positively silly if you somehow completely forgot them.\n\n', false );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	// Check if we have all the shit we need;
	AmilyScene.prototype.amilyCanHaveTFNow = function() {
		//<b>golden seed</b> for a human face;
		// <b>black egg</b> to get rid of the fur;
		// some purified <b>succubus milk</b> to round things off;
		return CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 && CoC.flags[ kFLAGS.AMILY_OFFERED_DEFURRY ] === 1 && CoC.player.hasItem( ConsumableLib.GLDSEED ) && (CoC.player.hasItem( ConsumableLib.BLACKEG ) || CoC.player.hasItem( ConsumableLib.L_BLKEG )) && (CoC.player.hasItem( ConsumableLib.P_S_MLK ) || (this.amilyCorrupt() && CoC.player.hasItem( ConsumableLib.SUCMILK )));
	};
	// Arrive with all the stuff you need to make Amily not look completely rediculous.;
	AmilyScene.prototype.amilyDefurrify = function() {
		CoC.player.consumeItem( ConsumableLib.GLDSEED );
		if( CoC.player.hasItem( ConsumableLib.BLACKEG ) ) {
			CoC.player.consumeItem( ConsumableLib.BLACKEG );
		} else {
			CoC.player.consumeItem( ConsumableLib.L_BLKEG );
		}
		if( this.amilyCorrupt() ) {
			if( CoC.player.hasItem( ConsumableLib.SUCMILK ) ) {
				CoC.player.consumeItem( ConsumableLib.SUCMILK );
			} else {
				CoC.player.consumeItem( ConsumableLib.P_S_MLK );
			}
		} else {
			CoC.player.consumeItem( ConsumableLib.P_S_MLK );
		}
		CoC.flags[ kFLAGS.AMILY_OFFERED_DEFURRY ] = 2; // We're now completing this dumb little quest.
		CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] = 1;
		CoC.flags[ kFLAGS.AMILY_OFFER_ACCEPTED ] = 1;
		this.amilySprite();
		MainView.outputText( 'It\'s not long after arriving in the ruins, darting about to announce your presence, before Amily steps out from a dilapidated alley.  She squares up to you with a hand planted on her slender hip, looking to you expectantly.', true );
		MainView.outputText( 'Without uttering a word, you reach into your pack and produce three items, passing them to the mouse girl as she inspects them curiously.  "<i>And you\'re sure this is free of the taint?</i>" she asks somewhat nervously.  You nod, but she doesn\'t seem completely convinced.  "<i>If I do this... what\'s to stop you from just leaving me? What if this is just some sick game you\'re playing?</i>" You quell her rising anxiety with a reassuring smile, making certain she realizes leaving is the last thing on your mind.  ', false );
		MainView.outputText( 'That seems to calm her enough.  She nips the tip off of the black egg, leaving a large enough hole to funnel the other ingredients into the shell.  With surprising ease, she puts the harpy\'s seed into her hand and grinds it into a powder, sprinkling the product into her makeshift mortar.  With obvious hesitation, Amily hefts the bottle of succubus milk, pouring a token amount in.  Placing a finger over the opening, she shakes the stuff together, then simply raises the shell to her lips and chugs the contents in a single gulp.\n\n', false );
		MainView.outputText( 'Amily falls back from you with a gasp, paws flying to her temples.  The appendages shudder, digital pads lengthening and the metacarpal pad flattening until she\'s suddenly left with slender, perfectly-formed hands.  Her astounded gaze flutters from her completely normal digits to your own curious visage; she starts to speak, but the words catch in her throat as she regards a growing pile of fur at her feet.  Like taking a comb to a stray cat, the hair covering most of her body simply falls out in clumps.\n\n', false );
		MainView.outputText( 'A cry brings your attention from the hair-pile back up to her face.  As if by magic, her rodent snout simply recedes back into her face, the nose reforming into a more human model.  She gently reaches up and brushes a fingertip across her new lips, eyes glazing over as tears begin to form.  "<i>So... different,</i>" she whispers as the transformation continues.  You move to her and wrap her in a warm, comforting hug, and after a moment\'s pause, she wraps her arms around you as well.\n\n', false );
		MainView.outputText( 'Finally, the process comes to a close.  You break from each other and stand at arm\'s length, both of you studying the changes to her previously-animalistic self.  Her auburn-colored ears and bare tail remain unchanged, but other than that, Amily\'s completely human.  Though a bit conflicted, Amily seems happy enough with her decision.  "<i>Well, I guess that\'s all there is to it,</i>" she says, scratching her newly bare cheek idly.  "<i>I\'ll let you think for a bit... see you later.</i>"\n\n', false );
		MainView.outputText( 'She stalks off into the ruins once more, humming a little tune as she goes.  You note a little more spring in her step, now that hope is restored in repopulating her race.\n\n', false );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour ); // To camp
	};
	// NOTE: Not sure how this ties in.;
	// Be a humongous asshole to Amily and tell her that she's, in effect, a whiny bitch.  Or something.;
	AmilyScene.prototype.amilySufferNotTheFurryToLive = function() {
		this.amilySprite();
		CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] = 1;
		CoC.flags[ kFLAGS.AMILY_IS_BATMAN ] = 1;
		MainView.outputText( 'You laugh spitefully as you look at the now humanized mouse girl. You tell her, with a grin on your face, that you did all this to screw with her; she should really trust her gut next time. Continuing with your tirade, you tell her that she\'s a complete fool, as well as a hypocrite that pretends to be noble, but is just a whore deep down inside. Pausing only to savor the look of betrayal on her face, you remark that her clinging to some twisted ideal of repopulating her people is just a depraved pipe dream; one that will never happen. You smirk and taunt her, implying that she should "enjoy" her new body as you depart, leaving your words to ring through her as she visibly tears up. The faint sounds of sniffling are all that echo behind you as you head back to camp.', true );
	};
	AmilyScene.prototype.amilyDefurryOfferAtCamp = function() {
		this.amilySprite();
		if( CoC.flags[ kFLAGS.AMILY_OFFERED_DEFURRY ] <= 0 ) {
			CoC.flags[ kFLAGS.AMILY_OFFERED_DEFURRY ] = 1;
		}
		if( !this.amilyCanHaveTFNow() ) {
			MainView.outputText( 'Unfortunately, you can\'t do such a thing until you have acquired the necessary magical prerequisites.  In simple terms, you need a <b>golden seed</b> for a human face, a <b>black egg</b> to get rid of the fur, and some <b>purified succubus milk</b> to round things off.', true );
			EngineCore.doNext( this, this.amilyFollowerEncounter );
			return;
		}
		//EAT ZE ITEMS!;
		CoC.player.consumeItem( ConsumableLib.GLDSEED );
		if( CoC.player.hasItem( ConsumableLib.BLACKEG ) ) {
			CoC.player.consumeItem( ConsumableLib.BLACKEG );
		} else {
			CoC.player.consumeItem( ConsumableLib.L_BLKEG );
		}
		if( this.amilyCorrupt() ) {
			if( CoC.player.hasItem( ConsumableLib.SUCMILK ) ) {
				CoC.player.consumeItem( ConsumableLib.SUCMILK );
			} else {
				CoC.player.consumeItem( ConsumableLib.P_S_MLK );
			}
		} else {
			CoC.player.consumeItem( ConsumableLib.P_S_MLK );
		}

		if( this.amilyCorrupt() ) {
			var master = CoC.player.mf( 'master', 'mistress' );
			MainView.outputText( 'Beckoning your furry little slut over to you, you inform her that her ' + master + ' has a special little something for her to drink. "<i>What does it do, ' + master + '?</i>" she inquires curiously. Grinning, you tell her that this potion will rid her body of all of her fur and rat - like facial features, turning her into a more human looking mouse morph; perfect for your tastes and desires.  Hesitation washes over Amily\'s face at the thought of losing what is her core identity... something you nip in the bud as you tell her that her ' + CoC.player.mf( 'master', 'mistress' ) + ' demands it, and she will obey, without question.  To help "encourage" her, you remove your lower coverings and toss them aside, motioning her to come over and sit on your lap.  Her eyes fixate on your ', true );
			// See, fen, this is why smart people use constants instead of just guessing what each fucking number means.;
			switch( CoC.player.gender ) {
				case 1:  // Male
					MainView.outputText( 'hardening ' + Descriptors.multiCockDescriptLight() + ' ', false );
					break;
				case 2: // Female
					MainView.outputText( 'moistening ' + Descriptors.clitDescript() + ' ', false );
					break;
				default: // Fallback
					MainView.outputText( 'hardening ' + Descriptors.nippleDescript( 0 ) + 's ', false );
					break;
			}
			MainView.outputText( 'and she quickly runs up to sit in your lap like a good girl.\n\nWith a giggle, you command her to open her mouth while guiding her head back with your head.  "<i>Say ahh</i>," you tell her, and she cracks her mouth open with little hesitation as you begin to pour it down her throat.  She gulps greedily as she swallows the mixture, purring contentedly as you rub her furry belly.  As soon as the bottle is empty, you tell her to get up so you can watch the transformation in full detail.  Jumping to her feet, she presents her body to her ' + master + ', and then gasps as the changes overtakes her body; fur begins to fall out of her at a furious rate, her paws begin to warp into more human hands, and her muzzle starts to twitch and shrink into her face, until what remains is a corrupted, humanoid mouse morph, with a human face, smooth skin, and no whiskers.  You certainly like what you see; you beckon her over so you can get a taste of her new-and-improved self.', false );
		} else {
			MainView.outputText( 'She squares up to you with a hand planted on her slender hip, looking to you expectantly.  Without words, you reach into your pack and produce three items.  You pass them to the mouse girl, and she looks over them curiously.  "<i>And you\'re sure this is free of the taint?</i>" she asks somewhat nervously.  Your nod is the only urging she needs.  She nips the tip off of the black egg, leaving a large enough hole to funnel the other ingredients into the shell.  With surprising ease, she puts the harpy\'s seed into her hand and grinds it into a powder, sprinkling the product into her makeshift mortar.  With obvious hesitation, Amily hefts the bottle of succubus milk, pouring a token amount in.  Placing a finger over the opening, she shakes the stuff together, then simply raises the shell to her lips and chugs the contents in a single gulp.\n\n', true );
			MainView.outputText( 'Amily falls back from you with a gasp, paws flying to her temples.  The appendages shudder, digital pads lengthening and the metacarpal pad flattening until she\'s suddenly left with slender, perfectly-formed hands.  Her astounded gaze flutters from her completely normal digits to your own curious visage; she starts to speak, but the words catch in her throat as she regards a growing pile of fur at her feet.  Like taking a comb to a mangy stray cat, the hair covering most of her body simply falls out in clumps.\n\n', false );
			MainView.outputText( 'A cry brings your attention from the hair-pile back up to her face.  As if by magic, her rodent snout simply recedes back into her face, the nose reforming into a more human model.  She gently reaches up and brushes a fingertip across her new lips, eyes glazing over as tears begin to form.  "<i>So...  different,</i>" she whispers as the transformation continues.  You move to her and wrap her in a warm, comforting hug, and after a moment\'s pause, she wraps her arms around you as well.\n\n', false );
			MainView.outputText( 'Finally, the process comes to a close.  You break from each other and stand at arm\'s length, both of you studying the changes to her previously-animalistic self.  Her auburn-colored ears and bare tail remain unchanged, but other than that, Amily\'s completely human.  Though a bit conflicted, Amily seems happy enough with her decision.  "<i>Well, I guess that\'s all there is to it,</i>" she says, scratching her newly bare cheek idly.  "<i>This is what you wanted, right?  Now, is there anything else you\'d like to discuss?</i>"\n\n', false );
		}
		// Back to Amily's camp controls;
		CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] = 1;
		CoC.flags[ kFLAGS.AMILY_OFFERED_DEFURRY ] = 2;
		this.amilySprite();
		EngineCore.doNext( this, this.amilyFollowerEncounter );
	};
	//Amily/Urta Interaction;
	//Must have Pure Amily as follower;
	//Must have 'UrtaSexed' flagged;
	//Must have Lover Urta?;
	//(Add a new option to Amily's screen: "<i>Date Night</i>" during the evening);
	//(PC chooses option: "<i>Date Night</i>");
	AmilyScene.prototype.dateNightFirstTime = function() {
		MainView.outputText( '', true );
		MainView.outputText( 'Sitting Amily down, you ask her what she\'d think about taking a "<i>little trip</i>" with you into town.\n\n', false );
		if( this.pregnancy.isPregnant ) {
			MainView.outputText( '"<i>Perhaps once I\'m no longer pregnant.  I wouldn\'t want to hurt the little ones,</i>" Amily answers.' );
			EngineCore.doNext( this, this.amilyFollowerEncounter );
			return;
		}
		MainView.outputText( '"<i>A-A trip?</i>" the little mouse-morph stutters, surprised at your sudden invitation.  "<i>Well, I haven\'t really been out much since we, you know...</i>" She suddenly brightens. "<i>Yeah, why not?  Could be fun!  I\'ve never been to Tel\'Adre, though.  What\'s it like?</i>" You take Amily\'s hand in yours and start to tell her all about the strange, faraway city as you prepare for your "<i>date.</i>"  When she\'s ready, the two of you head out toward the desert.\n\n', false );
		MainView.outputText( 'It takes you a bit longer than usual to reach the desert city.  You\'re on guard for two today, and go well out of your way to avoid the various denizens of the wasteland.  Eventually, though, the great walled city of Tel\'Adre comes into view, its imposing white walls a stark contrast to the barren desert around it.  You approach the gates, and are pleased to see your foxy lover Urta standing beside them, her halberd and guard uniform fitting her well, though you can just see her tail wrapped tightly around her extra... package.\n\n', false );
		MainView.outputText( '"<i>Hey there, lover,</i>" Urta says happily as you approach the gates.  However, her gaze quickly shifts to the little mouse-girl at your side.  Urta wrinkles her brow in confusion for a moment before slow-dawning comprehension spreads across her face.  "<i>So, ' + CoC.player.short + ', uh... who\'s your friend?</i>"\n\n', false );
		MainView.outputText( 'Amily smiles, as friendly as she can be when placed in such an awkward situation, "<i>Hi! My name\'s Amily - ' + CoC.player.short + '\'s mate.</i>"  You give Amily\'s hand a little squeeze, proud of her for not overreacting to Urta\'s casual drop of the word "<i>lover.</i>"\n\n', false );
		MainView.outputText( '"<i>Oh, ' + CoC.player.mf( 'his', 'her' ) + '... mate...</i>"  Urta mumbles, looking a little crestfallen at the admission.  Her emerald eyes light up with an idea while a mischievous grin spreads over her vulpine muzzle.  Before she can act on it, you request her to allow the two of you through the gates, interrupting whatever tricks the clever fox has planned.  She retrieves the corruption-detecting gem she once used on you and gives Amily a quick sweep.  When the gem emits a white glow, Urta gives an authoritative nod and calls for the gates to be opened.\n\n', false );
		MainView.outputText( 'You and Amily step onto the streets of Tel\'Adre.  The city\'s narrow roads are crowded' );
		if( CoC.time.hours >= 18 ) {
			MainView.outputText( 'despite the late hour, bustling with centaurs and canine-morphs going about their business, heading home after a long day\'s work or making their way to the Wet Bitch for a relaxing drink.\n\n', false );
		} else if( CoC.time.hours < 6 ) {
			MainView.outputText( 'despite the early time, bustling with centaur and canine-morphs on their way to their pre-dawn activities.' );
		} else if( CoC.time.hours < 12 ) {
			MainView.outputText( 'despite the morning hours, busy with centaur and canine-morphs hurrying to their own personal tasks.' );
		} else {
			MainView.outputText( ' with centaur and canine-morphs busy with their own tasks.' );
		}

		MainView.outputText( 'Amily seems enthralled by the sights of the city before you\'ve even passed the gate.  Wide-eyed, she follows your guiding hand down the main street, watching with awe as folk of all descriptions pass her by.  More than once, you\'re forced to pull her back from trying to jump an unsuspecting mouse-morph, mistaking the poor soul for someone she knew many years ago.\n\n', false );
		MainView.outputText( 'Eventually, your city tour takes you to that infamous hole, the Wet Bitch. Despite the late hour, the tavern is relatively empty, and the two of you have no problem finding a table.  Your drinks arrive promptly, and as a show of appreciation, Amily pays your tab.  You spend the next hour or so listening politely while the mouse-girl excitedly recounts everything she\'s seen, so completely overwhelmed by her first exposure to civilization in years that you\'re afraid she\'s liable to faint.\n\n', false );
		MainView.outputText( 'However, after Amily has shared her excitement twice over with you, the two of you fall into a companionable silence over your drinks.  Lightweight that she is, Amily is buzzed before you\'ve knocked back your first full stein.  As you watch the mouse-morph start the short, steep road to drunkenness, you\'re surprised to see Tel\'Adre\'s own Captain of the Guard step into the tavern.\n\n', false );
		MainView.outputText( 'Urta scans the tavern\'s main room briefly, sees you, and strides over.  With a charming smile, Urta asks if she can have a seat.  You try to gently explain that you\'re on a date right now, but ', false );
		MainView.outputText( 'Amily interrupts, slurring about how she\'d like to meet some of your friends.  Oh, this is going to end well...\n\n', false );
		//(OLD: Urta is either too dense to catch the hint or simply ignores it. You sigh and ask Amily if it's alright if Urta joins you.;
		//MainView.outputText(""<i>Huh? Oh yeah, ish fiiine,</i>" Amily drawls, half-drunk. Oh, this is going to end well.);
		MainView.outputText( 'The fox-girl grabs a chair from an adjacent table and brings it over, sitting reverse and leaning heavily on the back rest.  Before she can say anything more than a simple greeting, however, Amily grabs a bottle from ', false );
		if( CoC.flags[ kFLAGS.ENCOUNTERED_VALA_AT_BAR ] === 0 ) {
			MainView.outputText( 'a passing waitress', false );
		} else {
			MainView.outputText( 'a rather alarmed Vala as she flutters by', false );
		}
		MainView.outputText( '. "<i>Herr, ish gud,</i>" Amily slurs, pawing off the bottle to a surprised Urta.\n\n', false );
		MainView.outputText( 'Well, this could be interesting.  If you get both the girls drunk, it might be easy (or inevitable) for something sexual to happen.  Or, you could take Amily home right now and make sure nothing untoward happens to either of your lovers.', false );
		//(Display Options: [Drink!] [Leave]);
		EngineCore.choices( 'Drink', this, this.liqueurUpTheWaifus, '', null, null, '', null, null, '', null, null, 'Leave', this, this.amilyXUrtaRunAWAY );
	};
	//Amily/Urta -- LEAVE;
	AmilyScene.prototype.amilyXUrtaRunAWAY = function() {
		MainView.outputText( '', true );
		MainView.outputText( 'You watch Urta take a nice long drink from the proffered bottle, but before she gets well and truly smashed, you politely excuse yourself and, helping an inebriated Amily to her feet, exit the Wet Bitch.  The two of you make your way back to camp and, putting the drunken mouse-girl to bed, you give her a kiss on the cheek and soon fall asleep.', false );
		//Disable threesomes between them forever.;
		CoC.flags[ kFLAGS.AMILY_VISITING_URTA ] = 3;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseFourHours );
	};
	//Amily/Urta -- DRINK!;
	AmilyScene.prototype.liqueurUpTheWaifus = function() {
		MainView.outputText( '', true );
		MainView.outputText( 'You encourage Urta to drink up, and watch with a perverse delight as she starts knocking back the liquor.  You sip at your drink, taking things nice and slow as the fox-girl drowns her issues in booze.  More than once, Urta tries to start a conversation with the two of you, but each time she does, you merrily refill her stein and Amily is quick to urge her on.  You give the mouse-girl a look, trying to gauge her reception of the situation can see, through the mist of intoxication in her eyes, a lustful gaze aimed straight at Urta\'s ample bosom.\n\n', false );
		MainView.outputText( 'Before long, Urta\'s swaying in her chair, her brief snippets of conversation becoming more and more lewd with each passing minute.  Eventually, much to your delight, an unintentional show of cleavage from Amily sets off the beast.\n\n', false );
		MainView.outputText( 'THUNK!\n\n', false );
		MainView.outputText( 'The table is nearly lifted off its base. Urta gasps, embarrassed, and Amily nearly leaps out of her seat in surprise.  "<i>W-What the hell was that!?</i>" she squeaks.  Before you can answer, Amily ducks her head under the table - and comes back up blushing beet-red.\n\n', false );
		MainView.outputText( 'With a drunken grin, Urta laughs, "<i>Oh, shit. Sorry, sweetie, I figured ' + CoC.player.short + ' woulda\' blabbed about my third leg by now...</i>" She leans over the table, nearly brushing noses with Amily as she adds, "<i>Hey... Wanna give it a try?</i>"\n\n', false );
		MainView.outputText( 'For a moment, you\'re unsure of what\'s about to happen... then Urta moans lewdly, her eyes suddenly rolling back into her head.  You take a peek under the table and are absolutely thrilled to see Amily\'s hand firmly wrapped around Urta\'s throbbing horse-cock.  You say a few encouraging words as Amily gives Urta a stealth handy, quickly making the fox-girl shudder and squirm.  You lean back and nod', false );
		if( CoC.player.hasCock() ) {
			MainView.outputText( ', already feeling a strong stirring in your ' + Descriptors.multiCockDescriptLight(), false );
		} else if( CoC.player.hasVagina() ) {
			MainView.outputText( ', already feeling a little moisture in your loins', false );
		}
		MainView.outputText( '.\n\n', false );
		MainView.outputText( 'Unabashedly aroused by your mouse-lover getting the fox-girl off, you gently suggest that the three of you go and get a room.\n\n', false );
		MainView.outputText( '"<i>Mmm, I thought you\'d never ask,</i>" Urta purrs, giving a particularly violent shudder.\n\n', false );
		MainView.outputText( '"<i>Oh, that shounds loooovely,</i>" Amily adds.\n\n', false );
		MainView.outputText( 'Grinning, you saunter over to the bar, rent a room, and lead the girls upstairs.  Half-drunk yourself, you stumble up the last few stairs and hurriedly unlock the door.  The room is sparsely decorated, sporting a single large bed.\n\n', false );
		MainView.outputText( 'Urta and Amily flop down on the bed, already undressing and teasing each other - Urta running her hands ', false );
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'through the mouse\'s fur ', false );
		} else {
			MainView.outputText( 'over the mouse\'s skin ', false );
		}
		MainView.outputText( 'and Amily wrapping her lithe little tail around Urta\'s massive endowment.  You strip off your ' + CoC.player.armorName + ' and, looming over the girls, decide on how you want to go about this.', false );
		//(Display Appropriate Options: [Use Cock] [Use Vag]);
		if( CoC.player.gender === 1 ) {
			EngineCore.choices( 'Use Cock', this, this.threesomeAmilUrtaCAWKS, '', null, null, '', null, null, '', null, null, '', null, null );
		}
		if( CoC.player.gender === 2 ) {
			EngineCore.choices( '', null, null, 'Use Vagina', this, this.urtaXAmilyCuntPussyVagSQUICK, '', null, null, '', null, null, '', null, null );
		}
		if( CoC.player.gender === 3 ) {
			EngineCore.choices( 'Use Cock', this, this.threesomeAmilUrtaCAWKS, 'Use Vagina', this, this.urtaXAmilyCuntPussyVagSQUICK, '', null, null, '', null, null, '', null, null );
		}
		if( CoC.player.gender === 0 ) {
			EngineCore.choices( 'Nevermind', SceneLib.camp, SceneLib.camp.returnToCampUseOneHour, '', null, null, '', null, null, '', null, null, '', null, null );
		}
	};
	//Amily/Urta -- Use Cock;
	AmilyScene.prototype.threesomeAmilUrtaCAWKS = function() {
		MainView.outputText( '', true );
		var x = CoC.player.cockThatFits( 60 );
		if( x < 0 ) {
			x = CoC.player.smallestCockIndex();
		}
		MainView.outputText( 'You take hold of your ' + Descriptors.cockDescript( x ) + ' and present it to the girls.  Giggling, they both crawl to the edge of the bed, giving their asses and chests exaggerated shakes and jiggles until their heads are level with your shaft.  Eagerly, Urta and Amily grab your ' + Descriptors.cockDescript( x ) + ' and begin to play with it, giving it little brushes and licks with their wonderful, animalistic tongues.  You run your hands through their hair, urging them on until your dick is well and truly soaked with their warm saliva, the perfect lubricant to get things started.\n\n', false );
		MainView.outputText( 'You gently push Amily and Urta away from your ready shaft and tell the fox-girl to get on her back.  Urta licks her lips and, with a lusty grin, flops onto her back with her legs splayed around your waist.  Her massive horse-cock points upwards like a flagpole, wavering in the air and already dribbling streams of pre that would make any normal man jealous.  You easily lift her hefty sack out of the way, revealing the prize beneath wet, drooling cunt.\n\n', false );
		MainView.outputText( 'You line up your ' + Descriptors.cockDescript( x ) + ' with the fox-girl\'s eager vag, but stop short of penetration, running your cockhead up and down along her outer lips, teasing the drunken herm with short little shifts of your hips.  This only gets her harder, and her pre-cum is soon flowing out of her horse-cock to pool on her belly and thighs.  As you tease Urta\'s womanhood, you give Amily a little nod.  The petite mouse morph wastes no time climbing up onto Urta\'s lap and, with a little help from you, gets herself in position atop the fox-morph\'s towering rod.\n\n', false );
		MainView.outputText( 'You give Amily a pat on the butt, and as one, you take Urta\'s cock and cunt; you slam your ' + Descriptors.cockDescript( x ) + ' in her to the hilt as Amily slides down her shaft, taking as much of her horsemeat inside herself as she can before it starts distending her stomach.  You grin ear to ear as Urta\'s eyes roll back in her head, a look of complete sexual rapture on her foxy face as you and Amily double-team her.\n\n', false );
		MainView.outputText( 'Grabbing hold of Urta\'s flared hips, you start to repeatedly penetrate her slick vag, burying yourself in her loose fuckhole and pulling out until the crown of your ' + Descriptors.cockDescript( x ) + ' tastes the air.  While you\'ve almost completely withdrawn, however, Amily is just bottoming out, giving you a disjointed rhythm that has Urta moaning like a bitch in heat inside of a minute.  Once she starts bouncing on Urta\'s cock, there\'s no stopping Amily, whose drunken lust propels her to surprising speeds, forcing you to hammer Urta with everything you\'ve got almost right out of the gates.  Convulsing and writhing from the incredible pleasure she must be feeling, Urta\'s cock spurts pre and her cunt begins to squeeze down on your ' + Descriptors.cockDescript( x ) + '; nearly mad with pleasure, she grabs her hefty tits and ravages her dark nipples.\n\n', false );
		MainView.outputText( 'Well, you can\'t have the fox cumming too soon.  You pull out of her gaping vag, eliciting a disappointed moan from Urta before Amily\'s bouncing reminds her just how much pleasure she\'s feeling.  Speaking of the mouse-girl, you grab her by the waist, slowing her rut just enough for you to get a good bead on her other, vacant hole.  With a wicked laugh, you slam your cock forcefully into Amily\'s ass, ', false );
		if( CoC.player.cockArea( x ) > 60 ) {
			MainView.outputText( 'filling her until she just can\'t take any more of you', false );
		} else {
			MainView.outputText( 'burying yourself up to the hilt in her sweet, wonderfully tight bum', false );
		}
		MainView.outputText( '.  She lets out a startled squeak at the sudden double-penetration.  You grab Amily\'s ' + this.amilyTits() + ' and start to pound her ass, burying your shaft in her at the apex of her grind atop Urta so that she\'s never without a nice cock deep inside her.\n\n', false );
		MainView.outputText( 'Urta is close to orgasm, and now under a twin-dick assault, Amily won\'t last much longer either.  Urta lets out a harsh growl and, grabbing Amily\'s hips, thrusts until her balls slap the bottom of your ' + Descriptors.cockDescript( x ) + '.  You feel the force of her orgasm, the sudden heat inside Amily\'s fuckhole spreading right to your cock as Urta\'s foxy spunk starts spewing back out of Amily\'s twat.  You follow her example, plunging yourself as far into the mouse-girl as you can and cum, shooting your load straight up her ass until her tight, velvety walls are running white with your spooge.  Overwhelmed by the two jets shooting into her at once, Amily rolls her head back and screams, clamping down hard on the cocks inside her', false );
		//if Futamily:;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( ' as her cock orgasms, too, spurting a nice, thick trail of mousecum all over Urta\'s face and tits', false );
		}
		MainView.outputText( '.\n\n', false );
		MainView.outputText( 'Now thoroughly filled with cum, Amily slides off your dick and Urta\'s, falling face-first between the fox-girl\'s soft tits.  Urta, covered in thick white cum, only laughs and wraps her arms around Amily, hugging her new fuckbuddy tight.  With a smile, you crawl into bed beside them, locking both girls in a tight embrace.\n\n', false );
		MainView.outputText( '"<i>That was wonderful,</i>" Amily sighs, exhausted.\n\n', false );
		MainView.outputText( '"<i>Mmm,</i>" Urta purrs, giving her ass a playful slap. "<i>We gotta do this again sometime.</i>"\n\n', false );
		MainView.outputText( 'You couldn\'t agree more.', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -2 );
		EngineCore.doNext( this, this.urtaXAmilyAfterMurrrath );
	};
	//Urta/Amily -- [Use Vag];
	AmilyScene.prototype.urtaXAmilyCuntPussyVagSQUICK = function() {
		MainView.outputText( '', true );
		MainView.outputText( 'You leap into bed with the girls, wrapping Amily tight in your arms, and give her a long, drawn-out kiss.  Before Urta can start complaining, however, you give her ass a playful swat and tell her to put that big, meaty horse-cock of hers to good use.  She nods eagerly and gets on her knees behind the two of you, stroking her horse-cock as she readies herself for the threesome ahead.\n\n', false );
		MainView.outputText( 'You brace yourself for penetration, but it doesn\'t come.  To your surprise, Urta thrusts forward and into Amily, grabbing the mousegirl\'s hips and ramming her schlong so far into the poor mouse\'s stomach that you can feel it pressing into you through her belly.  Amily\'s mouth opens as if to scream, but no sound comes out.  You take the opportunity to put your lips to hers, drawing her into a long kiss as Urta begins to fuck her hard and fast.\n\n', false );
		MainView.outputText( 'You wiggle underneath Amily, positioning your ' + Descriptors.vaginaDescript() + ' right underneath Urta\'s thrusting horse-cock, letting the tingle of her shaft sliding across your lower lips bide you as Amily begins to gasp and moan.  You can see - and feel - the mouse-girl\'s stomach bulging and shifting with the mass of Urta\'s huge cock, doubling the strange sensation of Urta\'s cock running across your cunt\'s hole.  Amily lets out a shriek, and you can feel her cumming, contracting hard on Urta\'s dick, making the fox grunt with effort not to shoot her load on the spot.\n\n', false );
		MainView.outputText( 'Before you can truly get used to the sensation, it ceases completely.  You look up at Urta questioningly, only to see her massive cock suddenly withdraw from Amily and shoved into your gaping mouth.  You gag and struggle, but Amily, barely concious after her hard fucking, prevents you from going anywhere.  Urta grins, "<i>Go on, lick the mouse\'s juices off me.  I want to be clean for you, lover.</i>"\n\n', false );
		MainView.outputText( 'You are forced to suck Urta\'s cock or suffocate on it.  She shudders as your tongue rolls across her shaft, playing with the head and tickling her urethra.  You can still taste Amily all over her, a wonderful taste mixed with Urta\'s own sweat and musk.  You practically drink it up until Urta yanks her shaft out of your mouth.  You\'re almost giddy with anticipation as she runs it down your thigh and lines her horse-cock up with your ' + Descriptors.vaginaDescript() + '.\n\n', false );
		MainView.outputText( 'You groan as Urta slowly slides into you, filling your cunt until it\'s stretched to the limit to take your lover\'s massive equine dong.  She finally bottoms out, pushing into you until you feel her flared head pressing against your womb.', false );
		CoC.player.cuntChange( 60, true, true, false );
		MainView.outputText( '  She grabs your ' + Descriptors.hipDescript() + ' and starts to thrust, mercilessly hammering into you without respite until you\'re a moaning mess, panting like a whore as she jackhammers into you.  Your cervix feels like it could snap any moment, but it\'s a feeling of more pleasure than pain; your cunny contracts hard on Urta\'s cock, milking the already well-done fox for all she\'s worth until her tongue rolls out her mouth.\n\n', false );
		MainView.outputText( 'You grit your teeth as she makes one last brutal thrust into your eager womb and cums, spurting her scalding-hot horsemilk inside you. The sudden heat and force of her thick spunk flooding inside you sends you right over the edge - you cum, squeezing down on her deflating cock until it dribbles out its last drops of cum into you.\n\n', false );
		MainView.outputText( 'Now filled with cum, you roll onto your side, taking a now-sleeping Amily with you.  Urta crawls into bed after you, gently stroking your cheek and giving you little kisses on the shoulders and neck.  You don\'t even mind as her cum drips out of you onto the floor, mixed lewdly with your girlcum and Amily\'s.  Exhausted, you close your eyes to a final kiss from Urta.\n\n', false );
		MainView.outputText( '"<i>Mmm,</i>" she purrs, giving your cheek a last stroke with her thumb.  "<i>We gotta do this again sometime.</i>"\n\n', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -2 );
		MainView.outputText( 'You couldn\'t agree more.', false );
		EngineCore.doNext( this, this.urtaXAmilyAfterMurrrath );
	};
	//Urta/Amily -- Parting (First & Repeat);
	AmilyScene.prototype.urtaXAmilyAfterMurrrath = function() {
		MainView.outputText( '', true );
		MainView.outputText( 'You wake up later, still entwined with your cum-soaked lovers, smelling entirely of sex and sweat.  It\'s wonderful, in its own way. You gently wake the girls, and give each a kiss.  They giggle and moan, still sexually sensitive and not a little hungover.  All three of you spend the rest of the hour getting dressed, teasing and playing with each other until you finally must part ways.  You give the Captain of the Guard one last, long kiss before you and Amily make your way back to camp.', false );
		// Do all the shared shit here;
		// Reset urta cumtimer;
		CoC.flags[ kFLAGS.URTA_CUM_NO_CUM_DAYS ] = 0;
		CoC.flags[ kFLAGS.URTA_TIME_SINCE_LAST_CAME ] = 3 + Utils.rand( 4 );
		//Enable threesome mode!;
		if( CoC.flags[ kFLAGS.AMILY_VISITING_URTA ] === 0 ) {
			MainView.outputText( '\n\n(<b>Urta unlocked in Amily\'s sex menu!</b>)', false );
			CoC.flags[ kFLAGS.AMILY_VISITING_URTA ] = 4;
		}
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseFourHours );
	};
	AmilyScene.prototype.pureAmilyPutsItInYourRectumDamnNearKilledEm = function() {
		MainView.outputText( '', true );
		var x = CoC.player.biggestCockIndex();
		MainView.outputText( 'You pause and flash her a coy smirk, then you gently place the tip of a finger on her nose, slowly running it down along her body, over her lip, between her breasts, across her stomach, finally stopping in between her legs, where you start to teasingly stroke her cock through her pants, letting it tent her clothing.\n\n', false );
		MainView.outputText( 'Before she can misunderstand your intentions, you lean ', false );
		if( CoC.player.tallness >= 40 ) {
			MainView.outputText( 'down ', false );
		} else {
			MainView.outputText( 'over ' );
		}
		MainView.outputText( 'and whisper in her ear where exactly you would like her to use her cock, which makes her cheeks grow hot with embarrassment.\n\n', false );
		//(1st time):;
		if( CoC.flags[ kFLAGS.AMILY_TIMES_BUTTFUCKED_PC ] === 0 ) {
			MainView.outputText( '"<i>Seriously...?</i>" she says, looking at you skeptically. "<i>You want that?</i>"\n\n', false );
			MainView.outputText( 'You nod to her, still idly stroking her through her pants, assuring her that that is exactly what you want.\n\n', false );
			MainView.outputText( '"<i>Well... okay. Wait here a moment though,</i>" she says, turning to rummage through her alchemy supplies.  She pulls out a small tub and takes the cap off. Inside is a thick green salve that jiggles slightly when she shakes the container.  With a sheepish grin, she takes a small dollop of it into her fingers and begins to rub it onto her shaft.\n\n', false );
			MainView.outputText( 'You give her a slightly skeptical look, asking her what exactly is in that stuff, but she scoffs a bit and says "<i>Relax, it\'s just a little burn ointment... Should do the trick though.</i>"\n\n', false );
		}
		//(Else):;
		else {
			MainView.outputText( '"<i>You want that?  Well... Okay,</i>" she says, smiling a bit in spite of the rosy blush covering her face.\n\n', false );
			MainView.outputText( 'She turns around, rummaging through her things and emerging with the strange green salve, popping the cap off and running her fingers through it a bit.  As you begin to undress, she starts to rub the ointment onto her shaft, shivering visibly from its cool touch.\n\n', false );
		}
		//(Merge):;
		MainView.outputText( 'Working delicately, she carefully coats her shaft in a generous layer of the green ointment, until her cock glistens with an odd greenish sheen.  You take your position on the ground, lowering yourself down onto your knees and elbows, resting your chin on top of your hands and raising your ' + Descriptors.buttDescript() + ' into the air', false );
		if( CoC.player.tailType > AppearanceDefs.TAIL_TYPE_NONE ) {
			MainView.outputText( ', moving your tail out of the way', false );
		}
		MainView.outputText( '.\n\n', false );
		MainView.outputText( 'Amily ', false );
		if( CoC.flags[ kFLAGS.AMILY_TIMES_BUTTFUCKED_PC ] === 0 ) {
			MainView.outputText( 'looks a bit puzzled as she contemplates the mechanics of this for a moment, and then with a shrug, ', false );
		}
		MainView.outputText( 'takes her place behind you, running her shaft between your buttocks a bit to spread the slick lubricant around.\n\n', false );
		if( CoC.player.analCapacity() < 30 ) {
			MainView.outputText( 'Bracing yourself a bit, you grimace a little as you feel Amily start to push against your ' + Descriptors.assholeDescript() + ', just the tip sliding in with a bit of resistance.', false );
		} else if( CoC.player.analCapacity() <= 60 ) {
			MainView.outputText( 'You relax yourself, letting out a husky moan as you feel the tip of Amily\'s cock sliding into you.', false );
		} else {
			MainView.outputText( 'Amily lets out a slightly surprised squeak as your ' + Descriptors.assholeDescript() + ' offers her little resistance.', false );
		}
		MainView.outputText( '  The ointment does its job admirably, allowing Amily to penetrate you fully with no pain whatsoever', false );
		if( CoC.player.analCapacity() > 60 ) {
			MainView.outputText( ', though you are sure you could easily handle her without it', false );
		}
		MainView.outputText( '.  Slowly, she begins to rock her hips back and forth, placing her hands on your ' + Descriptors.hipDescript() + ' for support.', false );
		CoC.player.buttChange( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] * CoC.flags[ kFLAGS.AMILY_WANG_GIRTH ], true, true, false );
		MainView.outputText( '\n\n', false );
		if( CoC.flags[ kFLAGS.AMILY_TIMES_BUTTFUCKED_PC ] === 0 ) {
			MainView.outputText( '"<i>Is this okay? Ah... it feels... really good...</i>" she says with a low moan, to which you reply with a pleasure-filled groan of your own.\n\n', false );
		}

		MainView.outputText( 'You begin to push yourself back against her slow thrusts, and, encouraged by your actions, she starts to pump a little harder.  Sliding herself down along your back, she begins to nuzzle into your neck, stroking your sides sensually as her ' + this.amilyHips() + ' rise and fall against you.', false );
		if( CoC.player.hasCock() ) {
			MainView.outputText( '  You can feel her hand slipping down underneath you, gripping your ' + Descriptors.cockDescript( x ) + ' gently and starting to stroke and tease it with her fingertips.', false );
			if( CoC.player.cockTotal() > 1 ) {
				MainView.outputText( 'She brushes along ' + Descriptors.sMultiCockDesc() + ' one at a time, stroking for a moment or two before switching off.', false );
			}
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'It isn\'t long before Amily\'s sensual thrusting and touching has you on the precipice of your orgasm, and you voice your pleasure loudly, digging your fingertips into the ground and moaning.', false );
		if( CoC.player.hasVagina() ) {
			MainView.outputText( '  Sexual fluids ', false );
			if( CoC.player.wetness() <= 1 ) {
				MainView.outputText( 'drip ', false );
			} else if( CoC.player.wetness() <= 3 ) {
				MainView.outputText( 'dribble ', false );
			} else {
				MainView.outputText( 'gush ', false );
			}
			MainView.outputText( 'down your thighs', false );
			if( CoC.player.hasCock() ) {
				MainView.outputText( ' and p', false );
			}
		}
		if( CoC.player.hasCock() ) {
			if( !CoC.player.hasVagina() ) {
				MainView.outputText( '  P', false );
			}
			MainView.outputText( 'recum dribbles from your ' + Descriptors.multiCockDescriptLight(), false );
		}
		if( CoC.player.gender > 0 ) {
			MainView.outputText( ', forming a small puddle underneath you as you feel your climax approaching.', false );
		}
		MainView.outputText( '  With a tremendous shudder, you orgasm, your ' + Descriptors.assholeDescript() + ' clenching around her member.  At the same time, Amily moans into your ear, warm ribbons of herm-jizz filling your innards.', false );
		if( CoC.player.hasCock() ) {
			MainView.outputText( '  ' + Descriptors.SMultiCockDesc() + ' twitches with pleasure, soaking the ground beneath you with ', false );
			if( CoC.player.cumQ() < 250 ) {
				MainView.outputText( 'a few streams', false );
			} else if( CoC.player.cumQ() < 500 ) {
				MainView.outputText( 'a small deluge', false );
			} else {
				MainView.outputText( 'a small lake', false );
			}
			MainView.outputText( ' of cum.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'With a shuddering sigh, Amily dismounts you, and you roll onto your side next to her, reaching back to caress her cheek and tell her how wonderful she did.  She wraps her arms around you, hooking a leg around your waist softly, and the two of you lie there and cuddle for some time.\n\n', false );
		MainView.outputText( '"<i>Mm... you know... maybe we should do this again sometime,</i>" she says with a devious smirk, kissing your cheek.', false );
		CoC.flags[ kFLAGS.AMILY_TIMES_BUTTFUCKED_PC ]++;
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', 1 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	AmilyScene.prototype.fuckPureAmilysHeiny = function() {
		MainView.outputText( '', true );
		var x = CoC.player.cockThatFits( 50 );
		if( x < 0 ) {
			x = 0;
		}
		MainView.outputText( 'You pause and flash her a coy smirk, then you gently place the tip of a finger on her nose, slowly running it down along her body, over her lip, between her breasts, across her stomach, finally stopping to firmly grip her ' + this.amilyButt() + '.', false );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( '  Her pants tent from arousal as her male organ reacts to your sensual touching, and you start to teasingly stroke it as well.', false );
		}
		MainView.outputText( '\n\n', false );
		//(First Time):;
		if( CoC.flags[ kFLAGS.TIMES_FUCKED_AMILYBUTT ] === 0 ) {
			MainView.outputText( 'She looks ', false );
			if( CoC.player.tallness >= 60 ) {
				MainView.outputText( 'up ', false );
			} else if( CoC.player.tallness <= 40 ) {
				MainView.outputText( 'down ', false );
			}
			MainView.outputText( 'at you with a slightly puzzled look in her eye, and you try as casually as you can to bring up the subject of anal sex.  You ask her if she\'s ever considered it, and tell her it could be fun.\n\n', false );
			MainView.outputText( '"<i>I... I mean, you want to put your... in there?</i>" she says, her brow furrowed a bit.  You are worried for a moment that you may have stepped over a line, but she slowly tilts her head, giving you a bit of a shrug and a contemplative grimace.\n\n', false );
			MainView.outputText( '"<i>Well... I had never really considered it up until now, but... if you\'re sure that\'s what you want,</i>" she says, her lips pursed a bit as she mulls it over.\n\n', false );
			MainView.outputText( 'You smile broadly, nodding, and assure her you\'ll be gentle as you begin to strip out of your ' + CoC.player.armorName + '.\n\n', false );
			MainView.outputText( '"<i>Woah, woah, hold on there,</i>" she says, putting up a hand gently to halt your eager advances.  "<i>I said I\'d do it, but you\'re not coming in the back door without greasing the hinges a bit first.</i>"\n\n', false );
			MainView.outputText( 'You reign yourself in, nodding in understanding.\n\n', false );
			MainView.outputText( '"<i>Hang on, I think I\'ve got just the thing...</i>" she says, rummaging around through some of her alchemy supplies.  She pulls out a small tub, taking the cap off.  Inside is a thick green salve that jiggles slightly when she shakes the container.  With a smile, she takes a small dollop of it into her fingers, and then holds her other hand out for your ' + Descriptors.cockDescript( x ) + '.\n\n', false );
			MainView.outputText( 'You recoil a little, knowing full well the kinds of effects unfamiliar chemical concoctions could wreak upon your body, but then mentally scold yourself for doubting Amily for a moment.\n\n', false );
			MainView.outputText( 'She rolls her eyes a bit and snatches up your ' + Descriptors.cockDescript( x ) + ' a bit possessively, laughing to herself.  "<i>Oh relax, you big baby. It\'s just burn ointment. It should serve well enough, though.</i>"\n\n', false );
		}
		//(Else):;
		else {
			MainView.outputText( 'She smirks back at you just as coyly, trailing her fingers up your chest and laying a small kiss on your cheek.  "<i>Oh, you\'re in the mood for that sort of thing again, are you?</i>"\n\n', false );
			MainView.outputText( 'You nod, affirming that that is indeed what you were in the mood for, chuckling a bit at your unspoken bond with the cute mouse girl.\n\n', false );
			MainView.outputText( 'She gently breaks away from you, bending down to rummage through her things and giving you a teasing view of her rear in the process.  When she returns to you, she has a tub of green salve in hand, taking a small dollop of it into her fingers, her other hand idly stroking your ' + Descriptors.cockDescript( x ) + ' and drawing you up to full mast.\n\n', false );
		}
		//Merge):;
		MainView.outputText( 'As she touches the cool salve to your shaft, you let out a small shiver.  Her hands work delicately, spreading a thin layer across your entire length, until your ' + Descriptors.cockDescript( x ) + ' glistens with a glossy, greenish sheen.\n\n', false );
		MainView.outputText( 'She wipes her hand off on a discreet corner of her ' + CoC.flags[ kFLAGS.AMILY_CLOTHING ] + ' and begins to shimmy out of them.', false );
		if( CoC.flags[ kFLAGS.TIMES_FUCKED_AMILYBUTT ] === 0 ) {
			MainView.outputText( '  "<i>I\'m... not really sure how this goes... I guess... like this?</i>"', false );
		}
		MainView.outputText( '  Turning around, she lowers herself onto the ground carefully, her whiplike tail raising out of the way as she slides onto her knees and elbows.\n\n', false );
		MainView.outputText( 'Your hand cascades over her ' + this.amilyHips() + ', sliding up to take a handful of her ' + this.amilyButt() + ' and massaging her lower back sensually.  Sliding a finger along your shaft, you take a small amount of the lubricating salve and rub it into the quivering ring of flesh between her cheeks.  Amily releases a slight moan, shuddering from the cool touch, and lets out a sharp squeak as you push the first section of your finger past her anus, spreading the lubrication around the first inch of her tight rear passage.\n\n', false );
		MainView.outputText( 'She shudders and lowers her chin to the ground as you pull your finger out, raising her rump a little as you begin to run the head of your ' + Descriptors.cockDescript( x ) + ' over her pucker, easing forward.  You build pressure very gradually until you feel the tight entrance start to give way, and slowly begin to sink forward into her rectum.\n\n', false );
		if( CoC.flags[ kFLAGS.TIMES_FUCKED_AMILYBUTT ] === 0 ) {
			MainView.outputText( '"<i>Aah... ah... that feels really weird,</i>" she pants, noticeably struggling against the instinct to clench up against the invader. "<i>Ah... not... bad... just weird...</i>"\n\n', false );
		} else {
			MainView.outputText( '"<i>Ahhn... it\'s still weird... but I just might be starting to like it...</i>"\n\n', false );
		}

		MainView.outputText( 'Once you are sufficiently buried in her rear passage, you lower yourself down, conforming to the curve of her back.  Brushing her hair aside a little, you plant a few soft kisses along the edge of her jawline, being very careful to control your movements so as to spare her any pain.  As you ease into a very slow, gentle pace, you both begin to voice your pleasures, breathing heavily.\n\n', false );
		MainView.outputText( 'Your hands slide along Amily\'s sides, gently pressing into her flesh and eliciting soft moans and squeaks from her, while your hips rise and fall against hers at an even, metered pace.  You can feel the walls of her passage clenching rhythmically against your shaft, the muscles of her anus squeezing you with each gentle thrust.  The ointment does its job admirably, easing every movement; without it you have your doubts whether Amily\'s rear would be so readily accepting of your ' + Descriptors.cockDescript( x ) + '.\n\n', false );
		MainView.outputText( '"<i>I think you can go faster, now...</i>" Amily says breathlessly, smiling back at you as you run your fingers lovingly through her hair.  Nodding a little, you hook your elbows underneath her arms, hugging against her back, and begin to slowly ramp up the pace.  Amily\'s moans grow more passionate as your motions become more deliberate, but she doesn\'t seem to be experiencing any discomfort, thankfully.\n\n', false );
		MainView.outputText( 'Her hands clasp around yours under her chin, and she closes her eyes, gently biting her lower lip, even rocking her hips a little now to supplement your movements.  In spite of the slow, gentle pace, or perhaps in part because of it, you can start to feel a quivering in your loins marking the approach of your orgasm.\n\n', false );
		MainView.outputText( 'You close your eyes and let out a shuddering moan into Amily\'s ear as your climax comes rushing forth, ', false );
		if( CoC.player.cumQ() <= 250 ) {
			MainView.outputText( 'your ' + Descriptors.cockDescript( x ) + ' twitching and throbbing as you paint her insides with a few strands of cum', false );
		} else if( CoC.player.cumQ() <= 500 ) {
			MainView.outputText( ' the swell of your orgasm pushing past her sphincter as you unload a thick deluge into her back door', false );
		} else {
			MainView.outputText( ' the volume of your virile jism filling her innards with warmth as she begins to gain a slight bulge in her abdomen', false );
		}
		MainView.outputText( '.  Being stimulated in such a way is not enough to give Amily a complete release, but the sensation of your warm cum filling her rear is enough to make ', false );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( 'her own member twitch and dribble a small puddle of clear pre-cum onto the ground below her, joining with ', false );
		}
		MainView.outputText( 'a noticeable trail of juices gradually sliding down her thighs.\n\n', false );
		MainView.outputText( 'You very carefully pull back, Amily drawing a sharp intake of breath when you are fully freed from the grips of her pucker.  Gently sliding down alongside her, you draw her into a warm embrace, cuddling with her for a long while afterward', false );
		if( CoC.player.cumQ() > 500 ) {
			MainView.outputText( ' and gently stroking along the curves of her belly with a smile', false );
		}
		MainView.outputText( '.', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -2 );
		CoC.flags[ kFLAGS.TIMES_FUCKED_AMILYBUTT ]++;
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Scene 2: Amily Teaches Grown Corrupt Mice How To Sex (Z);
	AmilyScene.prototype.amilyIncest = function() {
		MainView.clearOutput();
		this.amilySprite();
		//AKA:;
		//MainView.outputText(Fen gets donated to write something that makes him moderately uncomfortable.);
		MainView.outputText( 'When you go looking for Amily, you find her on the edge of camp, talking with three of her offspring.  The purple-' );
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'furred' );
		} else {
			MainView.outputText( 'haired' );
		}
		MainView.outputText( ', heavily corrupted mice have matured into adults, as evidenced by their larger size and MUCH bigger endowments.  The whole spectrum of genders is represented - a well hung male, a huge-breasted female, and a herm who seems to have picked up a giant, knotty dog-dick at some point.  The male has long hair and a goatee, lending him an air of wisdom, even as he struggles not to jack off his foot-long, phimotic cock at the sight of his slutty mother.  The sister is completely nude, and she doesn\'t seem to mind in the slightest.  Her massive breasts sway pendulously, and with a start, you realize she\'s got a visible baby-bump half hidden underneath the well-developed mammaries.  She keeps glancing the herm\'s way and rubbing her fingers across the taut ' );
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'fur' );
		} else {
			MainView.outputText( 'skin' );
		}
		MainView.outputText( '.  You suppose that with so much corruption coursing through them, incest really wouldn\'t bother them in the slightest.' );
		MainView.outputText( '\n\nThe herm is cuddling up next to Amily and smearing ropes of doggie cum ' );
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'through her mother\'s fur' );
		} else {
			MainView.outputText( 'over her mother\'s thigh' );
		}
		MainView.outputText( ' as the latter lectures about pleasing her [master].  Amily, for her part, just seems to be getting wetter and wetter, but she somehow controls herself.  When her three children aren\'t casting anxious, lewd glances at themselves or their mother, they\'re nodding vigorously at her words.  Clearly, the trio is as excited with the prospect of serving you as their mom.' );
		MainView.outputText( '\n\nNone of them are aware of you yet.  You could duck out before they find you and avoid any potential incest, or you could take the sluts for a ride.  What do you do?' );
		MainView.menu();
		if( CoC.player.hasCock() ) {
			if( CoC.player.cockThatFits( 61 ) >= 0 ) {
				EngineCore.addButton( 0, 'Fuck Cunts', this, this.fuckIncestCunts, false );
				EngineCore.addButton( 1, 'Fuck Em All', this, this.fuckIncestCunts, true );
			} else {
				MainView.outputText( '[pg]Sadly, you\'re too big to fuck any of them.' );
			}
		} else {
			MainView.outputText( '[pg]If only you had a cock, you could fuck them all.' );
		}
		EngineCore.addButton( 4, 'Leave', null, MainView.playerMenu );
		//[Get doubleteamed {Vag req}] [Fuck Cunts] [Fuck 'Em All][Skedaddle];
	};
	//Fuck Cunts/All (extra pg or two) (Z);
	AmilyScene.prototype.fuckIncestCunts = function( all ) {
		var x = CoC.player.cockThatFits( 61 );
		if( x < 0 ) {
			x = 0;
		}
		var y = x + 1;
		MainView.clearOutput();
		this.amilySprite();
		MainView.outputText( 'You step up and ' );
		if( !all ) {
			MainView.outputText( 'tell Amily to send the male away - you\'ve got pussies to fuck.  She squeaks in excitement, barely noticing as her son tramps off.' );
		} else {
			MainView.outputText( 'tell Amily to get ready - you\'re going to fuck each of them full of their [master]\'s cum.  She squeaks in excitement, her nipples visibly puckering.' );
		}
		MainView.outputText( '  Amily takes the girl\'s hand and passes her your way.  The younger mouseling\'s baby-bump looks more and more prominent as she\'s brought close.  Milk starts to drip from her huge, leaking nipples as she looks ' );
		if( CoC.player.tallness >= 48 ) {
			MainView.outputText( 'up ' );
		}
		MainView.outputText( 'at you and says, "<i>Hey, ' + CoC.player.mf( 'Dad', 'other Mom' ) + ', go ahead and put it in.  I\'ve been wanting this since the first time I saw you.</i>"' );
		MainView.outputText( '\n\nYou shrug out of your [armor] to let [eachCock] spring free.  Your assembled offspring gasp as one.  You see ' );
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'muzzles' );
		} else {
			MainView.outputText( 'mouths' );
		}
		MainView.outputText( ' watering with tongues hanging lewdly as they take in your [cock all].  Your daughter rubs up against you, her tail encircling [oneCock] as she dances and grinds into you.  Female lubricant spatters the ground beneath her as you reach forward to take her huge melons in your hands.  The nipples are big enough to grab, like tiny cow-teats, and when you take hold, they both let out large streamers of milk, to the delight of their owner.  Your daughter moans out loud and begins jerking [oneCock] with slow, practiced motions of her tail.  Crushing against you, the mousette\'s thick, soft ass heats against your ' + CoC.player.skinFurScales() + '.' );
		MainView.outputText( '\n\n"<i>That\'s a good girl,</i>" Amily whispers encouragingly into her daughter\'s large ears.  The young, pregnant slut nods and pulls away, leaning forward to properly present her soaked twat to you.  Her tail wraps a few more loops around your [cock ' + y + '] and gently tugs as she looks back over her shoulder, eyes lidded and her tongue drooling.  She asks, "<i>Please, take me... ' + CoC.player.mf( 'daddy', 'mommy' ) + '.</i>"' );
		MainView.outputText( '\n\nAs if you could resist such a polite (and enticing!) request.  You take the gravid girl\'s wide hips in hand, and give her exactly what she wants.  One moment, you\'re looking down at her, swollen tits and all, and the next, your [cock ' + y + '] is enveloped in tight, wet flesh.  Your daughter squeaks with joy at being filled, and gently squeezes down on your [cock ' + y + '] encouragingly.' );
		MainView.outputText( '\n\nYou take her drippy teats in hand and compress, expressing a thick flow of alabaster as you begin to properly fuck your daughter.  She squeaks appreciatively and bumps her bouncy bottom against your [hips], rolling her juicy thighs up and down and giving you a little bit of a show.  You slap her ass and watch the flesh ripple from the blow, a delightful prelude to what\'s to come.  Then, returning to expertly milking her incredible jugs, you start to move your hips to your daughter\'s tempo.  Her cunny makes wet squelches with each piston and rhythmically clamps down on you, trying to milk your [cock ' + y + '].  You grunt from pleasure and pick up the pace, ignoring her slower, weaker rhythm.' );
		MainView.outputText( '\n\nThe knocked-up little slut squeaks and moans from each ass-jiggling thrust, wailing happily as her cunny is thoroughly plowed by her parent.  She begs, "<i>Fuck me harder, ' + CoC.player.mf( 'daddy', 'mommy' ) + ', fuck me full of cum.  Screw me so good I come crawling back to make you more children!</i>"' );
		MainView.outputText( '\n\nYou hump her faster, slick fluids splattering your [legs] with each thrust.  The rest of the family is looking on, watching quietly and touching themselves.  Amily is right next to her daughter, whispering encouragements into her ear idly, stroking herself as she does so.  She shudders when that same daughter latches on to one of her hard nipples but goes right back to instructing in between excited moans.  Your hermaphrodite \'daughter\' has her fingers wrapped around her sheath, just underneath the tiny swell of her uninflated knot.  She\'s circling the pointed tip with a finger, teasing herself as she awaits her turn.' );
		MainView.outputText( '\n\nWhile you\'re watching her, the herm gives you a sultry wink and pleads, "<i>Please, cum in my sis, cum in her now.  I need you inside me... I need you fucking me until I\'m soaking myself in my thick doggy-cum.  Don\'t you want to see, ' + CoC.player.mf( 'dad', 'mom' ) + '? </i>"  She smiles knowingly when you\'re forced to break eye contact by your clenching, arching body.  Cum bubbles from your [cock ' + y + '] to fill your writhing, ecstatic daughter with seed.  Her soaked little pussy squeezes and gushes rivulets of mixed spunk onto your [legs] as it contracts about you, trying to wring you dry, but with her womb blocked, all it does is squirt jism back out her entrance to drip from your loins[if (hasBalls = true)  and [balls]].  Unintentionally, your hands find her nipples and squeeze hard, sending thick runnels of mouse-milk to muddy the ground.' );
		MainView.outputText( '\n\nThe pregnant slut beneath you slips off your [cock ' + y + '] as her legs give out, her body splaying obscenely.  She whimpers, "<i>So good... I wish you could make me pregnant... ' + CoC.player.mf( 'Dad', 'Mom' ) + '</i>".' );
		MainView.outputText( '\n\nSighing, you crook your fingers at Amily and the hermaphrodite.  They approach you reverently, and when you indicate that they should attend to your flagging erection, the two corrupt sluts exchange looks of glee.  Two wide-open maws descend upon [eachCock], licking and sucking, squeezing and slurping.  They hastily devour your leftover, wasted sperm and ravenously swallow the tangy pussy-juice that still drips from you.  Looking down, you see four large breasts - two pairs of delicious bosoms - mashed together, milk lubricating them as they slide over each other.  [EachCock] surges forward as you watch, ready to go again.' );
		MainView.outputText( '\n\n"<i>It looks like [Master] is ready now.  Go on,</i>" Amily says, stepping back to leave you alone with your \'daughter\'.  Before you can act, she leaps into your arms, her tiny-but-well-endowed frame perfectly sized to rest in your arms.  She smoothly pivots her hips to accept your [cock ' + y + '], and though her pussy isn\'t quite the sopping-wet love-tunnel of her sister, the herm makes up for it with enthusiasm.  She wraps her arms around your shoulders, [if (cocks > 1) her red, knotted tool bobbing and weaving against the remainder of your [cock all].|her red, knotted tool bouncing between your bodies.]  Moaning as she holds tight, the most unusual of your offspring begins to drip warmth against you.' );
		MainView.outputText( '\n\n"<i>So good... I can see why you\'d make Mom want to have your cum inside so badly,</i>" she says, starting to bob and grind against you.  Every time she allows herself to bottom out on your [cock ' + y + '], a jet of pre-cum messily sprays her underboobs.  It drips down as she fucks you, but you grow tired of the burgeoning mess growing between your bodies and spin her around to face her mother.  Amily watches lustfully as you plow her daughter\'s snatch, the red doggie dong just inches away and dripping with pre-seed.' );
		MainView.outputText( '\n\nYour corrupted mouse-slave licks her lips and pounces onto the two of you, overbalancing you both, and you fall to the ground, still joined at your surging, eager genitals.  You growl Amily\'s name, confused and irritated, but a muffled squeak of pleasure from your daughter alerts you to what\'s just happened - Amily has mounted her!  Your hermaphrodite daughter is sandwiched between her parents, fucking both of them simultaneously.  She\'s moaning deliriously and making out with her mother, their tongues sliding in and out of mouths, occassionally licking across puffy lips.  Nearby, your other slutty offspring is still partially insensate, cradling her belly with legs locked together.' );
		MainView.outputText( '\n\nAmily breaks off the kiss with your daughter to say, "<i>Let me show you the proper way to use a tail.</i>"  The hermaphrodite gasps at some unseen action.  Her pussy tightens incredibly, and you hear her moan out loud.  A second later, a thin, murine tail whips around the base of your dick.' );
		MainView.outputText( '\n\n"<i>W-what are you...OOOOOOOH!</i>" the mousette screams.  Your daughter wasn\'t just using her tail as a cock-ring - she reached the whole way back to peg her mother with it!  It squirms around inside Amily, stroking her innards, even as it coils around your [cock ' + y + '] like a snake.  At the bottom of the pile, you have the luxury of setting the pace, and even though you\'ve cum once already, you feel anxious to do it again.  You thrust your hips hard, hard enough to bounce the girls on top of you, breast-flesh squishing and juices drooling.' );
		MainView.outputText( '\n\nSweaty arms cling and rub over all three bodies, until you lose track of whose limbs belong to whom.  Instead, you focus on the pounding rhythm you\'re hammering through your [legs], the wet squish of your member plowing through your own offspring\'s naughty folds.  The nagging thought that you\'re moments away from impregnating your own offspring surfaces but only manages to excite you that much more, the taboo of the act filling your loins with the burgeoning warmth of a fast-approaching orgasm.  The mouse in the middle begs, "<i>Fuck yes!  Give it to me!</i>" and squeezes your shaft affectionately with her tail as she cums, the tip waving wildly in Amily\'s asshole.' );
		MainView.outputText( '\n\nYou grab the closest pair of hips and ram your cock hilt-deep inside her as you cum.  She wails through her climax, her cunny clenching nice and tight to squeeze the first rope of jism from you.  It surges through you to spatter against her cervix, and as the next jet erupts, you\'re sure that some of her own must be flooding through her urethra.[if (cumQuantity > 500)   You just keep cumming and cumming, and you almost wish you could see the cum filling her belly and flooding from her nethers.][if (cumQuantity >= 1500)   Even so, her belly pudges out a bit, and you realize she must look extraordinarily pregnant from any other angle.]' );
		MainView.outputText( '\n\nAmily gasps, "<i>Gods,</i>" and rolls to the side, the still-inflated knot in her cooch taking your daughter with her.  Now that you\'ve been freed from the extra weight, you catch your breath and sigh as the mousy fluids soaking your body start to dry.  You glance to the side, and see Amily and your daughter ass-to-ass on all fours.  [if (cumQuantity > 500) "The younger girl\'s belly is wonderfully filled with cum, hanging nice and low.  "]Amily\'s belly appears to be slowly growing and ballooning.  She\'s nervously trying to pull away, but your daughter\'s knot holds her there, trapped and unable to do anything as the sticky animal-sperm floods her once-pure womb.' );
		//{Phimosis boy buttfuck optional);
		if( all ) {
			MainView.outputText( '\n\nYou realize you haven\'t been entirely drained, and you beckon for the male mouse.  His hole ought to be tight enough to milk the last of your seed from your [balls].  He looks at you hopefully, but you sit up and point at him, then your slightly-flagging dick.  The recently-of-age male sighs and kneels between your legs and gets to work.  Though he clearly wants nothing better than to masturbate or start fucking you, he proves as obedient as his mother and slurps his sister\'s filth from your dick.  A trickle of boy-slime dribbles onto your leg as he bobs up and down, his purple hair obscuring most of his ' );
			if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
				MainView.outputText( 'muzzle' );
			} else {
				MainView.outputText( 'face' );
			}
			MainView.outputText( ' from your view as he sucks you.' );
			MainView.outputText( '\n\nSoon, your erection is nice and hard, gently throbbing on your boy\'s tongue.  He wraps his soft, pink fingers around your shaft and starts stroking you - it\'s clear he thinks he\'s going to be giving you a blowjob to completion.  Well, none of that; you\'ve got at least one more jizz-bomb to drop, and you want something tighter!  You grab your vermin progeny by his purplish hair and yank him back, shoving so hard he falls onto all fours and gasps in distress.  As you\'d expect, his ass is cute and pert, with a puckered pink hole just begging for you to violate it.  His giant, foreskin-clad cock drags through the dirt, smearing his pre-cum behind it as he begins trying to crawl away from you.' );
			MainView.outputText( '\n\nYour jump him before he can get away, pinning him beneath your form, [oneCock] bouncing between his cheeks as you line it up.  He protests, "<i>Noo!  N-not my ass!  Not there, ' + CoC.player.mf( 'Dad', 'Mom' ) + '!</i>"  You tell him to be quiet and enjoy it, and surprisingly he does, as if secretly waiting for the word of command.  The mouse\'s rectum clenches tightly when you push against it, but with a few gentle prods, you slowly get the nervous hole to relax enough for your [cockHead ' + y + '] to slip inside.  Your son gasps from sudden discomfort, but as you pull him back into your lap, you can hear a hint of pleasure in his protests.' );
			MainView.outputText( '\n\nHe slowly settles into your lap, no longer fleeing, and you\'re given your first good look at his cock when you glance around his shoulder.  It\'s VERY thick for its size, and you can see his foreskin shining dully, obscuring all but a small circle that surrounds his cum-slit, which currently beads pre-cum at an alarming rate.  Gently, you take his dick in your hand and pull back, stroking him slowly every time he moves up or down.  The little bitch gets the idea pretty quickly and begins to bounce on your cock like a whore in heat.  Your reacharound winds up going so fast that his foreskin peels back, revealing the little mouse\'s shiny, cum-slicked cockhead.' );
			MainView.outputText( '\n\n"<i>Oh, f-f-fuck, ' + CoC.player.mf( 'Dad', 'Mom' ) + ', you\'re gonna m-m-make me cum!</i>" he moans.  You let go of his dick and spank his ass, not wanting him to blow until you\'ve had a chance to stuff his pert, femboy asshole full of spunk.  He hisses in displeasure, but begins to bounce faster, smashing his prostate into your [cockHead ' + y + '] over and over again in an attempt to get off hands-free.  His frenzied thrashings awaken a trembling, budding pleasure, familiar to you at this point as the beginning of an orgasm, and as you clench, you have to wonder if he\'ll manage to get off at all.' );
			MainView.outputText( '\n\nQuivering tightly around your [cock ' + y + '], the mouse-boy\'s nicely-stretched anus fills with heat from the sudden cum-injection you give it.  You can feel the thick fluid sloshing about inside him, and as you jet lance after lance of hot jizz into his asshole, he begins to clench repeatedly, as if milking your dick.  A second later, your son\'s now-exposed glans flares wide and erupts, firing a torrent of thick, corrupted mouse-cum directly into the purple-haired slut\'s own face.  He takes it happily, tongue lolling as it fills his mouth and drenches his hair.  It geysers up like that, wave after wave of white sticking to him as your dick squeezes it out of his core.  Soon, your son\'s spunk fountain dies down, and he lets out a few pathetic squeaks of joy.' );
			MainView.outputText( '\n\nIt isn\'t until he tries to stand on wobbly legs that you realize how thoroughly worn out you are, and as you flop onto your side, you\'re treated to the sight of your spunk ' );
			if( CoC.player.cumQ() < 200 ) {
				MainView.outputText( 'drizzling ' );
			} else if( CoC.player.cumQ() < 500 ) {
				MainView.outputText( 'raining ' );
			} else if( CoC.player.cumQ() < 2000 ) {
				MainView.outputText( 'pouring ' );
			} else {
				MainView.outputText( 'spraying ' );
			}
			MainView.outputText( 'down to the ground.  Clearly, your boy needs some training in how to hold his cum.  You close your eyes and doze, feeling as sated as you are tired.' );
		} else {
			MainView.outputText( '\n\nIt isn\'t until you try to stand that you realize how thoroughly worn-out you are, and as you roll onto your side, you close your eyes and doze, watching cum squirt out of Amily\'s pussy from around your daughter\'s knot.' );
		}
		this.amilyPreggoChance();
		CoC.player.orgasm();
		EngineCore.dynStats( 'lib', -1, 'sen', -1 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//First talk: Finished (Bagpuss)(Zedited, but no followups are ready yet);
	//Scene triggers the first time you approach Amily with eggs to lay;
	AmilyScene.prototype.amilyEggStuff = function() {
		MainView.clearOutput();
		MainView.outputText( 'As you approach the mouse-woman, her big, hairless ears twitch and she turns to face you with a smile.  However, before she can open her mouth to greet you her eyes settle on your slightly bulging abdomen.' );
		MainView.outputText( '\n\n"<i>[name], are you alright? You\'re looking a little... bigger back there.</i>"  As if on cue you feel your abdomen throb slightly, sending a shudder of pleasure up your back as it lets you know that you\'re more than ready to lay your next clutch of eggs.  Amily\'s mouth scrunches up as you steady yourself, apparently finding your predicament a little puzzling.  "<i>You know, you don\'t have to eat <b>everything</b> you find out there; it looks like it\'s starting to have quite the effect on you.</i>"' );
		MainView.outputText( '\n\nA smirk crosses her face as you tremble again, another bolt of ecstasy surging through you.  "<i>Seems like you\'ll need to take care of that soon, else who knows what might happen?  I\'m sure there\'s plenty of room around here for you to dig a hole and... relieve yourself.</i>"  She chuckles to herself as a moan escapes your lips' );
		if( CoC.player.gender > 0 ) {
			//(if sexed);
			MainView.outputText( ', your [if (hasCock = true) [cock] stiffening][if (isHerm = true)  and ][if (hasVagina = true) [vagina] starting to burn with need]' );
		}
		MainView.outputText( ' whilst your body instinctively reacts to the pleasure it\'s feeling, ovipositor slowly thickening as it pulses with need.' );
		MainView.outputText( '\n\nAmily\'s right; you do need to relieve this achingly good pressure, but when you think about just wasting your eggs in a muddy ditch a flash of inexplicable unease runs through you.  No, you need something... some <b>one</b> to carry your eggs.  Wait, didn\'t Amily say that she\'s done this before?  You swear you remember her talking about her encounters with the bees, exchanging \'favors\' for honey.' );
		MainView.outputText( '\n\n"<i>Well...  yes,</i>" she replies slowly, as if a little apprehensive of where you\'re taking the conversation.  "<i>I only did it when I was desperate for food though; it\'s not like I was heading over there every week to get topped up!</i>"  Amily\'s voice gets ever-higher as she speaks, sounding a little indignant.  You try to gauge her reaction, the lack of a frown on her face telling you that she\'s overacting at least a bit.' );
		MainView.outputText( '\n\nYour abdomen twitches at the mention of her previous encounters; it seems as though just thinking about laying your eggs is enough to get you horny at this point.  As you whine pathetically, your ovipositor starts to slide out of your abdomen, drizzling fluid onto the ground as a painfully obvious indicator of how aroused you are.  Amily bites her lip, eyes widening as she starts to understand exactly how much this is affecting you.  Putting on your best puppy-dog eyes' );
		//if dogmorph;
		if( CoC.player.dogScore() >= 4 ) {
			MainView.outputText( ', which you know for a fact are <i>very</i> good,' );
		}
		MainView.outputText( ' you gently take her hand and ask if she can help you out, explaining that you\'re not sure whether you can take care of it yourself and going out exploring in such a state could end badly.  Seeing her brow wrinkle as you explain, you add that she probably has more experience with this sort of thing than you do.' );
		MainView.outputText( '\n\n"<i>Damnit, [name].  You know that this isn\'t what I meant when I asked to have children with you, right?</i>"  Despite her begrudging tone, her tail flits back and forth excitedly ' );
		//if amily = herm;
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( 'and you notice a growing bulge in her trousers' );
		}
		MainView.outputText( '.  Looks like you aren\'t entirely twisting her arm to get her to go along with this.  "<i>Fine, I\'ll help lighten that load you\'ve got, just...  don\'t expect me to help out as much around camp if I\'m full of eggs.</i>"' );
		MainView.outputText( '\n\nBefore she can move away you quickly wrap your arms around her, pulling the mousegirl into a deep kiss.  She grabs you around the neck, pressing her body against you as your tongues wrestle.  Amily coos slightly as you rub her back and you break the kiss, whispering your thanks for being such an accommodating lover.  She gives you a final peck before heading back to her bedding, a small smile on her face.' );
		MainView.outputText( '\n\n"<i>Whenever you\'re ready, I suppose.</i>"' );
		CoC.flags[ kFLAGS.AMILY_OVIPOSITION_UNLOCKED ] = 1;
		//Unlocks 'Eggs' option in Amily's 'Make Love' menu;
		//Amily menu;
		this.amilyMenu( false );
	};
	//Eggs;
	AmilyScene.prototype.layEggsInAmily = function() {
		MainView.clearOutput();
		MainView.outputText( 'Feeling your ' );
		if( CoC.player.eggs() < 20 ) {
			MainView.outputText( 'engorged' );
		} else if( CoC.player.eggs() < 40 ) {
			MainView.outputText( 'heaving' );
		} else {
			MainView.outputText( 'unbelievably swollen' );
		}
		MainView.outputText( ' abdomen stir your mind drifts back to Amily\'s offer.  Dipping into her neck, you start to kiss her softly as your ovipositor begins to thicken, slowly peeking out into the air.  She shivers in your arms, your hands sliding around her sides to pull her close.  Barely able to pull your lips away, you nip along her jaw as you ask her if she\'s up for a little egging.' );
		MainView.outputText( '\n\n"<i>I suppose I could be persuaded, you <b>do</b> look like you need a little attention...</i>"  You feel a hand slipping down into your [armor] as she cranes her neck, moaning quietly as her searching fingers find their way to your [if (hasCock = true) stiffening shaft][if (isHerm = true)  and ][if (hasVagina = true) slick snatch]' );
		if( CoC.player.gender === 0 ) {
			MainView.outputText( 'blank groin' );
		}
		MainView.outputText( ', teasing you into unconsciously humping against her slender digits.' );
		if( this.pregnancy.isPregnant ) {
			MainView.outputText( '  "<i>But try to remember that I\'m already carrying.  I don\'t want it getting too cramped in there; so make sure you don\'t miss, alright?</i>"' );
		}
		MainView.outputText( '\n\nYour try to clear your mind as the pleasure starts to overwhelm you, ovipositor extending fully whilst you attempt to focus and decide how to proceed.' );
		//[Anal];
		EngineCore.doNext( this, this.layEggsInAmilysCorruptedHole );
	};
	AmilyScene.prototype.layEggsInAmilysCorruptedHole = function() {
		MainView.clearOutput();
		MainView.outputText( 'Still groaning as Amily caresses your body, you make sure that you have a good grip around her waist before suddenly pulling her down to the ground.  She squeaks as you descend, though her hand doesn\'t leave your leggings.  Lying on your back, Amily props herself up on your chest with her free arm, trying to frown but unable to keep a playful smile off her lips.' );
		MainView.outputText( '\n\nYou set to work freeing her from her trousers whilst she loosens your own leggings, dragging them down to reveal your [if (hasCock = true) "rock-hard cock"][if (isHerm = true)  and your ][if (hasVagina = true) swollen pussy]' );
		if( CoC.player.gender === 0 ) {
			MainView.outputText( 'featureless mound' );
		}
		MainView.outputText( ', your bulging ovipositor fully emerging at the same time.' );
		MainView.outputText( '\n\n"<i>Looks like someone\'s excited; you must really enjoy the idea of filling me with eggs.</i>"  Amily\'s voice is playful as her fingers trace over your lower stomach, clouding your mind with bliss as she avoids caressing your needy nethers.  However, as you finally strip her leggings it quickly becomes clear that she\'s as ready as you are, the sight of her flushed labia glistening with a wet sheen' );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( ' and her erect shaft shuddering as it throbs in the air' );
		}
		MainView.outputText( ' telling you everything.  You ask her if she\'s sure she isn\'t projecting just a little, the mousegirl blushing furiously as she sheepishly nods, a demure smile spreading across her face.' );
		MainView.outputText( '\n\nWith her reddened lips ' );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( 'and stiff cock ' );
		}
		MainView.outputText( 'exposed Amily positions herself below your hips, settling gently on your thighs with her firm cheeks resting on your egg-filled abdomen.  You gasp as her tail flits across the sensitive surface, before it gently wraps around your slick, aching ovipositor.  She smirks at you as the pressure on your shaft increases, turning your gasp into a long, drawn out moan that leaves you thrusting uselessly into the air, your body shuddering with ecstasy.' );
		MainView.outputText( '\n\nYou grip her by the waist, holding her in place as you try to position your insectile half.  Amily moans as your ovipositor brushes between her cheeks in search of an entrance, her lower body jolting forwards in response to the unexpected contact.  Her hot sex presses wetly against ' );
		if( CoC.player.gender > 0 ) {
			MainView.outputText( 'yours' );
		} else {
			MainView.outputText( 'your groin' );
		}
		MainView.outputText( ' with the rolling of her hips, making you both cry out as you connect.  She looks down at you, eyes half-lidded with pleasure, arms shaking as she holds herself up on your chest.  Biting her lip she starts to grind in earnest, pressing herself against you as hard as she can, her rear teasingly rubbing against your egg-shaft with each thrust.' );
		MainView.outputText( '\n\nYour ovipositor is practically gushing fluid now, covering Amily\'s rear with thick goo each time her tight ass slides against it.  ' );
		//(Males/Herms);
		if( CoC.player.hasCock() ) {
			MainView.outputText( 'Unable to hold yourself back, you grab her hips and raise them up, desperate to feel yourself buried as deeply into her as possible.  She groans as your [cockHead] grazes along her dripping entrance, running a hand down her body to position you.  Your breath catches in your throat when her hand clutches your member, turning into a ragged moan as she rocks her hips against you, pressing your tip against her to slowly spread her lips.  You can only pant whilst your body is wracked with pleasure, clenching your teeth to try and stop yourself from crying out as Amily soaks your length with arousal' );
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( ', her shaft oozing thick globs of pre-cum that roll down her cock to smear against your own as she moves against you' );
			}
			MainView.outputText( '.' );
		}
		//(Females + AmilyUndicked);
		else if( CoC.player.hasVagina() && CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] === 0 ) {
			MainView.outputText( 'Her soaked pussy keeps pressing against yours, smearing both of you with femcum as you both shiver with delight.  Your ovipositor twitches wildly as you scrabble in the dirt, moaning incoherently with each thrust Amily makes against your lust-crazed frame.  Her hard little clit slips between your lips suddenly, sliding up your slit until it flicks against your own hard button, leaving both of you shuddering at the overwhelming sensation.' );
		}
		//(Females + AmilyHerm);
		else if( CoC.player.hasVagina() ) {
			MainView.outputText( 'You cry out in pleasure as she teases you, the tip of her shaft slipping against your entrance and spreading your lips around the head of her member.  You writhe at the feeling the warmth spreading through your nethers as her cock drools pre-cum into you, thick cream spreading across your snatch with every motion of your hips.  It bathes your clit with heat, the tremors coursing through your body forcing your grip on Amily\'s thighs to tighten, a groan slipping from her lips as her thrusts become more forceful and disjointed.' );
		}
		//{(Genderless);
		else {
			MainView.outputText( 'She moans as your shaft rubs against her, her own thrusts against your blank groin increasing in pace every time your overly sensitive pseudo-member grazes her behind.  Her femcum splatters your lower half with each roll of her hips' );
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( ', her shaft covering your stomach with thick strands of pre-cum' );
			}
			MainView.outputText( ' as thrusts become faster and harder.  You pant huskily in time with your lover, hands sliding around her hips to grab her cheeks in an attempt to sink your throbbing length inside her.' );
		}
		MainView.outputText( '\n\nAmily manages to smirk as you struggle beneath her, your body wracked with too much pleasure to even think as she continues to tease you, her hands caressing your [chest] whilst her hips slide against you.  You buck against her suddenly, your abdomen jumping up and brushing the tip of your ovipositor against her tight hole, making her squeak as the wet shaft slips easily between her cheeks, leaving a trail of slime around her ass.' );
		//(Males/Herms);
		if( CoC.player.hasCock() ) {
			MainView.outputText( '  Amily jolts forwards from the unexpected movement and you seize the opportunity, impaling her tight, wet entrance on your [cock].  You both cry out in bliss as she sinks down your shaft, her passage almost burning your oversensitive shaft as her arms wrap around your neck, pulling herself close to you.' );
		}//(Females + AmilyHerm);
		else if( CoC.player.hasVagina() && CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( '  Amily jumps forwards suddenly in reaction to your uncontrolled spasm, her shaft suddenly spearing you and forcing a desperate cry from your lips.  She responds in kind, a strangled moan escaping her as she slumps against you, her hips starting to thrust wildly into your trembling [vagina].' );
		}
		//(F/F or Genderless);
		else {
			MainView.outputText( '  You moan as Amily slumps against you, her arms sliding around your neck as her crotch presses ever more forcefully against your.  Your eyes lock with hers as she groans, her lower body undulating against yours with a desperate need, your abdomen straining as your body flushes with desire.' );
		}

		MainView.outputText( '\n\nAlmost as if moving of its own accord your abdomen jolts towards Amily, your aching egg-shaft sinking deeply into her ass, the thick slime covering it allowing the thick tube to bury nearly halfway into her before she reflexively clenches down on you.  Groaning as you slide ever further inside her, ' );
		//(Males/Herms);
		if( CoC.player.hasCock() ) {
			MainView.outputText( 'you feel her passage clamp down around your shaft, her body shaking as she whimpers softly above you.' );
		}//(Females + AmilyHerm);
		else if( CoC.player.hasVagina() ) {
			MainView.outputText( 'her thrusts falter slightly, her member twitching within you as your ovipositor fills her body up, shaking slightly with pleasure as her hot shaft brushes against your walls.' );
		}//(F/F or Genderless);
		else {
			MainView.outputText( 'her body hammers into you with more urgency, each hit covering you with another splatter of her femspunk as she groans at how much you\'re filling her.' );
		}

		MainView.outputText( '\n\nAnother moan bursts out of you as her passage' );
		if( CoC.player.hasCock() ) {
			MainView.outputText( 's quiver' );
		} else {
			MainView.outputText( ' quivers' );
		}
		MainView.outputText( ' around you, feeling the first of what\'s sure to be many eggs slowly making its way into her.  A particularly loud whimper snaps you from your lust-fogged haze as the slight bulge in your ovipositor squeezes past her tight ring, but you feel plenty more on the way.  Each one draws out another low groan from the girl as she continues to move against you, both of your crotches gradually becoming slick with a mix of slime and you combined juices.' );
		MainView.outputText( '\n\nYour hands eventually find their way to her cheeks and you play with them as you stuff the girl with your eggs, kneading them as you pull her even harder into you, the pair of you groaning with delight at the slow pace of your laying.' );
		MainView.outputText( '\n\nBefore long the feeling of fullness completely overwhelms Amily, her body quivering as an orgasm rushes through her.  You moan as ' );
		//(Males/Herms);
		if( CoC.player.hasCock() ) {
			MainView.outputText( 'her pussy spasms around your member, the feeling pulling you over the edge with her, your hips thrusting into her tight confines as you fill her with cream.  She shivers with delight at the double-stuffing you\'re giving her, relaxing in your arms as you both rides out the pleasure high.' );
		}//(Females + AmilyHerm);
		else if( CoC.player.hasCock() && CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( 'she floods your [vagina] with her hot seed, arms tightening around your neck to pull herself as tightly against you as she can, her shaft pulsing as it erupts.  She grunts squeakily with each spurt, packing your tight hole with as much cum as she can manage, even as you fill her rear with egg after egg.  The flurry of sensation pushes you over the edge, you stomach going tight as you wrap your legs around Amily, pinning her against you as you hump uselessly against her, your pussy quivering with each movement.' );
		}//(F/F or Genderless);
		else {
			MainView.outputText( 'her hips slam into yours one final time, bodies trembling as you both reach your peaks together.  You feel liquid splattering your crotch, coating your thighs as Amily grinds into you, her breathing becoming ragged as she tries to keep moving throughout her body-shaking orgasm.  Groaning, you can do little more that hold her in your arms as your own climax electrifies your muscles, your body going taut with pleasure.' );
		}

		MainView.outputText( '\n\nYour egg-shaft twitches as you orgasm and you feel a flood of heat in your abdomen.  As if acting like a ' );
		//(Males/Herms);
		if( CoC.player.hasCock() ) {
			MainView.outputText( 'another ' );
		}
		MainView.outputText( 'penis, a rush of eggs engorges your shaft, leaving your abdomen feeling as light as air.  Amily moans as egg after egg pushes past her ring, still playing with her rear whilst you finish filling her with your clutch, her stomach pressing gently against yours as it bulges with her new load.  Before long the last egg slips out of the tip of your ovipositor and it begins to withdraw reflexively, slipping from its tight confines far more easily that it entered due to the impossible amount of slime that lines Amily\'s passage.  It cascades from her once you fully withdraw, covering you with a thick layer of the stuff as you both lie there, slowly drifting off to sleep.' );
		//[Next];
		CoC.player.orgasm();
		if( CoC.player.fertilizedEggs() > 0 ) {
			if( CoC.player.canOvipositSpider() ) {
				this.pregnancy.buttKnockUp( PregnancyStore.PREGNANCY_DRIDER_EGGS, PregnancyStore.INCUBATION_DRIDER - 304 ); //(96)
			} else if( CoC.player.canOvipositBee() ) {
				this.pregnancy.buttKnockUp( PregnancyStore.PREGNANCY_BEE_EGGS, PregnancyStore.INCUBATION_BEE + 48 ); //(96)
			}
			CoC.flags[ kFLAGS.AMILY_OVIPOSITED_COUNT ] = CoC.player.eggs();
		}
		CoC.player.dumpEggs();
		EngineCore.doNext( this, this.layEggsInAmilysButtPt2 );
	};
	AmilyScene.prototype.layEggsInAmilysButtPt2 = function() {
		MainView.clearOutput();
		MainView.outputText( 'You wake up almost an hour later, Amily still dozing on top of you.  Gently picking her up, you take her to her nest and lay the girl down in the soft bedding, smiling at the bulge in her stomach.  It takes you a little while to clean yourself off and redress, though you can\'t help but feel that getting a little bit of slime on your [armor] was a price worth paying.' );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Amily Laying;
	AmilyScene.prototype.amilyLaysEggsLikeABitch = function() {
		MainView.outputText( '\nWhilst wandering around your camp, you heard a flurry of soft squeaks from the direction of Amily\'s nest.  Intrigued, you sidle over to see what the commotion is.  When you get there, your eyes widen at the sight of your oft-restrained lover relaxing in her soft bedding, completely bottomless.  Her legs are spread wide, giving you a perfect view of both her holes as she rapidly ' );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] === 0 ) {
			MainView.outputText( 'teases her clit' );
		} else {
			MainView.outputText( 'squeezes her shaft' );
		}
		MainView.outputText( ' with one hand, the other catching your eye as it moves beneath her top, apparently caressing her breasts.' );
		MainView.outputText( '\n\nThe sight surprises you so much that it takes a few moments of dumbstruck staring to notice the small pile of glistening orbs gathering between Amily\'s thighs.  Realisation quickly hits you as another slime-covered sphere joins them, easing its way out of the girl\'s tight ass to a chorus of soft moans.  It looks as though she\'s been at this for a while, though you doubt she\'s anywhere close to being finished yet.' );
		MainView.outputText( '\n\nAnother ' + (this.pregnancy.buttType === PregnancyStore.PREGNANCY_DRIDER_EGGS ? 'spider' : 'bee') + ' egg flows from her, still covered with the thick goo that you left in her when you made your \'deposit\'.  Amily tenses at the way it spreads her ring, ' );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] === 0 ) {
			MainView.outputText( 'pussy visibly quivering' );
		} else {
			MainView.outputText( 'member oozing a thick glob of pre-cum' );
		}
		MainView.outputText( ' as her body shudders with pleasure.' );
		MainView.outputText( '\n\nYou decide to leave the girl to her ministrations, ' );
		//if abdomen;
		if( CoC.player.canOviposit() ) {
			MainView.outputText( 'though the sight has certainly gotten you thinking about what you\'ll be doing with your next clutch.\n' );
		} else {
			MainView.outputText( 'though a distinct heat in your nethers leaves you wishing you had another clutch to unload right now\n' );
		}
		EngineCore.dynStats( 'lus', (5 + CoC.player.lib / 10), 'resisted', false );
		CoC.flags[ kFLAGS.AMILY_OVIPOSITED_COUNT ] = 0;
	};

	AmilyScene.prototype.amilySwimFuckIntro = function() {
		MainView.clearOutput();
		if( CoC.flags[ kFLAGS.AMILY_TIMES_SWIMFUCKED ] === 0 ) {
			MainView.outputText( 'Pulling out the sexy black two piece, you offer it up to the mouse-girl with a smile' );
			if( CoC.player.lib >= 60 ) {
				MainView.outputText( ', eagerly anticipating the opportunity to drink in her form while it\'s bound up in body-hugging black fabric.' );
			} else if( CoC.player.cor < 50 ) {
				MainView.outputText( ', happy to share the fruits of your adventure with your mousy lover.' );
			} else {
				MainView.outputText( ', secretly hoping she\'ll get used to putting on a show for you.' );
			}
			MainView.outputText( '\n\nAmily\'s eyes open so wide they\'re nearly as big around as her ears, and she happily bounds up to you, touching the fabric carefully.  "<i>It\'s so beautiful, [name],</i>" she says, "Do you really think I would look good in something like this?</i>"  She bounces on her toes, still touching the fabric but unwilling to take it out of your hands.' );
			MainView.outputText( '\n\nYou push the pile of tiny triangles and string into the mouse-girl\'s hands and say, "<i>Why don\'t you try it on and come for a swim in the stream with me?  Then we can see just how good it looks on you.</i>"' );
			MainView.outputText( '\n\nShe squeaks in excitement and runs off, cheeks aglow.  The saucy sway of her ' + this.amilyHips() + ' draws your eye as she vanishes behind a rock and makes it clear she\'s not too shy to change around you - she\'s just building up to a big reveal.  You suppress the urge to follow her and sneak a peak.  Seeing her half-clothed isn\'t exactly a new thing for you, and you want to be floored when you see how she fills it out.  Sitting back on a rock, the sounds of swishing fabric reaches your ears, and before you know it, Amily calls out, "<i>Okay, I\'m ready!' );
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( '  D-don\'t laugh, okay?' );
			}
			MainView.outputText( '</i>"' );
			MainView.outputText( '\n\nAmily strides around the rocks nervously, hands on her hips.  Her soft ' );
			if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] > 0 ) {
				MainView.outputText( 'skin' );
			} else {
				MainView.outputText( 'fur' );
			}
			MainView.outputText( ' is almost totally exposed, left unbound by the skimpy fabric that barely covers her most sensitive places.  The mousette\'s toned legs and thighs draw your eye, right up to her ' + this.amilyHips() + ' and ' + this.amilyButt() + ', divided by a narrow strip of black fabric.  Between those survival-honed limbs is a tiny triangle that barely covers Amily\'s nether-lips, clinging gently to her clearly visible camel toe.' );
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( '  The top portion of it is pulled out away from her body, a taut tent that her ' + this.amilyCock() + ' is threatening to tear through at any moment.  After a moment of fidgeting, Amily pulls it out the top to flop lamely.' );
				if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] > 0 ) {
					MainView.outputText( '  It snaps back onto her ' + this.amilyBalls() + ' to snug them tightly.' );
				}
			}
			MainView.outputText( '  Higher up, silky onyx wreaths the globes of ' + this.amilyTits() + ', but as you admire her new appearance, the hard tips of ' + this.amilyNipples() + ' rise up, so clearly defined that you can see their pebbly texture through the inviting swimsuit.' );
			MainView.outputText( '\n\n"<i>How do I look,</i>" your lover asks demurely, toeing at the dirt.  The usually confident little mouse is clearly out of her element but excited as well.' );
			MainView.outputText( '\n\n"<i>Stunning,</i>" you answer, and remembering your earlier offer, you ask, "<i>Shall we hit the water, then?</i>"' );
			MainView.outputText( '\n\nAmily seductively sashays up to your side and takes your hand, leaning heavily against you as the two of you head toward the stream.' );
			CoC.player.consumeItem( ArmorLib.S_SWMWR );
			CoC.flags[ kFLAGS.AMILY_OWNS_BIKINI ] = 1;
		}
		//Repeat Swim Intro;
		else {
			MainView.outputText( 'You ask Amily if she\'d like to go for a swim again.  She smiles genuinely and nods.  "<i>Let me get dressed, I\'ll be right back!</i>"' );
			MainView.outputText( '\n\nAmily scurries off towards her stash, and you wait patiently for her return.  When she comes back, her little body is all bound up in sheer black, simultaneously concealing and highlighting her assets.' );
			if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
				MainView.outputText( '  The only thing left exposed is her ' + this.amilyCock() + ', which bobs lightly with each step.' );
				if( CoC.flags[ kFLAGS.AMILY_HAS_BALLS_AND_SIZE ] > 0 ) {
					MainView.outputText( '  Her balls are snugly secured in her bottoms, looking like a cute little sphere of virile fun.' );
				}
			}
			MainView.outputText( '  The hard points of her ' + this.amilyNipples() + ' prominantly display themselves on the bikini top.  Clearly she doesn\'t plan to spend too much swimming, just like last time.' );
			MainView.outputText( '\n\nAmily saunters up and grabs your hand, leading you towards the stream while her ' + this.amilyButt() + ' sways in your direction.  Amusingly, her tail is poking through a hole in the rear triangle of her sexy black bikini bottoms.' );
		}
		CoC.flags[ kFLAGS.AMILY_TIMES_SWIMFUCKED ]++;
		EngineCore.doNext( this, this.amilySwimFuckPartII );
	};
	//Go 'Swimming';
	AmilyScene.prototype.amilySwimFuckPartII = function() {
		var x = CoC.player.cockThatFits( 61 );
		if( x < 0 ) {
			x = CoC.player.smallestCockIndex();
		}
		MainView.clearOutput();
		MainView.outputText( 'The stream isn\'t far away, and the two of you reach it in practically no time.  The journey is slowed by the occasional teasing touches and whispered compliments between you and your lover.  Amily is giggling and flushed by the time you arrive, fanning herself with her hand even though it isn\'t THAT hot out.  Turning to face you, she sensually glides up against your [armor] and begins to rub your ' );
		if( CoC.player.hasCock() ) {
			MainView.outputText( 'package' );
		} else if( CoC.player.hasVagina() ) {
			MainView.outputText( 'puffy lips' );
		} else {
			MainView.outputText( '[butt]' );
		}
		MainView.outputText( '.  You sigh from the sensation and mumble, "<i>I thought we were going swimming?</i>"' );
		MainView.outputText( '\n\nAmily answers, "<i>Right after you!</i>" and twists, hooking her foot under you and tripping you right into the icy waters.  You push up, sputtering from the icy drink' );
		if( CoC.flags[ kFLAGS.AMILY_TIMES_SWIMFUCKED ] > 1 ) {
			MainView.outputText( ', and wondering why you keep falling for it' );
		}
		MainView.outputText( '.  Amily bounds in after, launching into a deep spot with a raucous cannon ball.  The resulting splash is less than impressive due to her stature, and when she comes up for air after, you make sure to splash her back for the surprise dunk you got.  The mouse-morph giggles and throws her arms in front of her face defensively, staggering back, ' + this.amilyTits() + ' jiggling in their barely-supporting top.  You splash at her a few more times for good measure, but she begins to return fire.  The resulting water war soaks you both completely.' );
		MainView.outputText( '\n\nOnce you tire of slinging the icy liquid to and fro, you take the time to remove your [armor] and lay on the bank.  Amily stops what she\'s doing to watch, playfully asking, "<i>Tired of losing already?</i>" while her eyes drink you in.' );
		MainView.outputText( '\n\nYou smirk and declare that her skimpy two piece has put her body on such display that you figured the only way to compete is to go naked yourself.  Stretching your arms up, you let droplets cascade down your [chest] and unrepentantly gaze upon the mouse-woman\'s shrink-wrapped form.  The water has soaked into her clingy garb, and with the added moisture, you can actually see parts of her in perfect detail.  Sure, her pussy made a clearly visible camel toe before, but now... it\'s like you\'re getting a black-framed peep show.  Her pert breasts bounce when she rocks back in surprise at your statement.' );
		MainView.outputText( '\n\n"<i>You perv!</i>" Amily shouts in mock surprise, fixing her eyes on your own nipples and exposed groin.  "<i>If you\'re going to be dirty about it,</i>" she begins, her voice dropping to a decidedly uncharacteristic purr, "<i>then you had better be ready for what you get.</i>"  Her hands come to rest on your shoulders, and as she looks you in the eyes, she says "<i>You got me all wet, too.</i>"' );
		MainView.outputText( '\n\nThe petite mouse-girl launches herself into your arms, tight against your chest.  She easily reaches down to her bottoms and pushes them aside, just in time for her soaked muff to meet your ' + Descriptors.cockDescript( x ) + '.  Your ' + CoC.player.cockHead( x ) + ' glides through her silken gateway with ease, aided by Amily\'s liquid ardor.  Water and juices drip from both your frames as your short-statured lover rides you, and your hands find their way to her ' + this.amilyButt() + ', grabbing hold to pull her down, deeper.  After being in the frigid stream, the clinging folds of Amily\'s tight cunt feel like a hot salve for your erection, shooting electric jolts of hot pleasure through your body as she comes to rest on your ' );
		if( CoC.player.balls > 0 ) {
			MainView.outputText( '[balls]' );
		} else {
			MainView.outputText( 'base' );
		}
		MainView.outputText( '.' );
		MainView.outputText( '\n\nYou knead her supple cheeks, admiring ' );
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'her silky coat ' );
		} else {
			MainView.outputText( 'her smooth skin ' );
		}
		MainView.outputText( 'with all ten fingers.  The mousette\'s tail curls around your [hips] to pull you closer, grinding herself into you with all her might.  You can feel the ' );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] === 0 ) {
			MainView.outputText( 'engorged bud that is her clit' );
		} else {
			MainView.outputText( 'slippery member' );
		}
		MainView.outputText( ' sliding back and forth between your drenched bellies.  Amily gasps, "<i>I love you,</i>" and her slippery tunnel hugs tight, just like the rest of her body.' );
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( '  Her whiskers tickle your cheeks as s' );
		} else {
			MainView.outputText( '  S' );
		}
		MainView.outputText( 'he comes up for a kiss.  Slender lips meet your own, her narrow, skillful tongue slipping into your mouth.' );
		MainView.outputText( '\n\nBurning with desire, you walk out of the water with your lover speared on your shaft, and as soon as you\'re on solid ground, you begin to fuck her.  Your hands pull her up, almost off your ' + CoC.player.cockHead( x ) + ' before you let gravity pull her back down, slightly inclining your [hips] to speed the pleasurable friction along. Amily squeaks when she hits rock bottom, breaking the kiss before she plants it again with renewed vigor.' );
		MainView.outputText( '\n\nThe two of you fuck like horny animals at their favorite watering hole, and every chance you get, you make sure to let a stray hand touch her ' + this.amilyNipples() + ', ' + this.amilyTits() + ', or ' + this.amilyButt() + '.  The soaked girl is soon twitching and squirming atop you, wordlessly riding out an epic climax.  Her sweet cavity caresses your ' + Descriptors.cockDescript( x ) + ' throughout, wringing your tumescent dick with insistent female pleasure, as if that could somehow milk your cum from you.' );
		MainView.outputText( '\n\n"<i>Gods,</i>" Amily gasps, "<i>You\'re incredible!</i>"  She looks at you through heavy eyelids and kisses you again, though her muscles spasm wildly when you resume your quick, wet fuck.  You pound her hard and fast, rutting her hot hole hard enough to make her whole body bounce in your arms.  Amily is little more than a pile of quivering female flesh, snug around your ' + Descriptors.cockDescript( x ) + ' and just waiting to be impregnated.  Shoving her down, you throw back your head and cum at last, pumping thick seed into her.' );
		if( CoC.player.cockTotal() > 1 ) {
			MainView.outputText( '  Your untended erection' );
			if( CoC.player.cockTotal() > 2 ) {
				MainView.outputText( 's do' );
			} else {
				MainView.outputText( ' does' );
			}
			MainView.outputText( ' a fine job of spraying ' );
			if( CoC.player.cockTotal() === 2 ) {
				MainView.outputText( 'its load ' );
			} else {
				MainView.outputText( 'their loads ' );
			}
			MainView.outputText( 'over her middle.' );
		}
		MainView.outputText( '  The heat flowing inside her sets off a second orgasm' );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( ', and she climaxes all over again, spraying the underside of her ' + this.amilyTits() + ' and your [chest] with milky mouse seed' );
		}
		MainView.outputText( '.  Her channel soon drips with your mixed sexual fluids' );
		if( CoC.player.cumQ() > 250 ) {
			MainView.outputText( ', but it doesn\'t stop you from continuing to pump away, ' );
			if( CoC.player.cumQ() < 500 ) {
				MainView.outputText( 'squirting more and more spunk from the contracting cunt with every movement' );
			} else if( CoC.player.cumQ() < 750 ) {
				MainView.outputText( 'spurting out a backflood of semen as Amily\'s belly gains a tiny but visible cum-bump' );
			} else if( CoC.player.cumQ() < 1000 ) {
				MainView.outputText( 'gouts of cum washing from her snatch as her belly rounds nicely' );
			} else if( CoC.player.cumQ() < 2000 ) {
				MainView.outputText( 'waves of jism washing out around your ' + Descriptors.cockDescript( x ) + ' as it pumps her to a rounded, pregnant look' );
			} else {
				MainView.outputText( 'geysers of cum bursts out from the quivering mouse-hole as Amily\'s belly balloons with jizz.  Even after it can stretch no more, you keep cumming, firing out high pressure jets that splatter your [legs]' );
			}
		}
		MainView.outputText( '.\n\n' );
		MainView.outputText( 'Once finished, gently set the moaning girl down and tug her bikini bottom back in place to hold in the cream filling.  Amily moans, "<i>Pervert,</i>" but she doesn\'t stop you.  She even helps you get dressed again, and the two of you walk back to camp, hand and hand, clean and dirty at the same time.' );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -1 );
		this.amilyPreggoChance();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};

	//PC - dicked.;
	//Amily + Izma – some kind of lust boosting, cum boosting, preg-chance boosting potion that causes a three-way! (EngineCore.silly mode cum out rear and mouse launch requested);
	//all pretty much just an excuse for the belly bulging cumshot though;
	AmilyScene.prototype.amilyXIzmaSuperPregOptions = function() {
		MainView.clearOutput();
		MainView.outputText( 'You smile winningly at Amily, and tell her you have something a little different in mind. You want to have another litter with her.' );
		MainView.outputText( '\n\n"<i>Oh?  You want me to get pregnant... again?</i>" the mouse asks, nervously holding her tail in her hands.  "<i>You know I ran out of the goblin pregnancy drugs right?  So, my fertility won\'t be nearly what it was before.</i>"' );
		MainView.outputText( '\n\nYou nod, smiling again.' );
		MainView.outputText( '\n\n"<i>Thank you... If you really do want them, then I\'ll stop using those herbal contraceptives.  Perhaps I could whip something up... I am something of an alchemist after all!</i>" Amily trills, idly tracing a circle on your chest with her little claw. She turns and leads you towards the nest, tail waving eagerly.' );
		MainView.outputText( '\n\n<b>Do you want her to just go off the herbs normally or try to brew up a fertility potion?  Such a potion might have unusual side-effects...</b>' );
		CoC.flags[ kFLAGS.AMILY_ALLOWS_FERTILITY ] = 1;
		//[Norma] [Try The Potion];
		MainView.menu();
		EngineCore.addButton( 0, 'Normal', this, this.fuckTheMouseBitch );
		EngineCore.addButton( 1, 'Try Potion', this, this.drinkThePotion );
	};
	//Try The Potion;
	AmilyScene.prototype.drinkThePotion = function() {
		MainView.clearOutput();
		CoC.flags[ kFLAGS.AMILY_X_IZMA_POTION_3SOME ]++;
		if( CoC.flags[ kFLAGS.AMILY_X_IZMA_POTION_3SOME ] === 1 ) {
			MainView.outputText( 'Amily smiles up at you while her tail coils around your [leg], and she warns, "<i>Now, I\'ve been fiddling with this for a while, but I haven\'t had a chance to test it, so it could have some unexpected side-effects.</i>"' );
			MainView.outputText( '\n\nSmiling just as widely as before, you let her know that you expected as much when you agreed to the idea.' );
			MainView.outputText( '\n\nThe mouse-girl pulls a pair of potions out of her bag and explains, "<i>There\'s one for the dad and one for the mom.  Here\'s yours.</i>"  The bottle she\'s offering is filled with a swirling, viscous blue fluid under its tightly-plugged cork, and Amily is holding a similar container, hers containing a pink mixture.' );
			MainView.outputText( '\n\nYou tap yours against the short girl\'s and toast, "<i>To our children and us!</i>"' );
			MainView.outputText( '\n\nAmily taps hers against yours and echoes, "<i>To our children and us!</i>"' );
			MainView.outputText( '\n\nYou smile as you pop the cork and throw back the brew, guzzling it down with abandon, secure in the knowledge that anything that enhances the chances of conception will prove to enhance the fun as well.  Amily\'s fingers slip off the tightly inserted plug as she struggles to open her own.' );
			MainView.outputText( '\n\n"<i>Urk... the damned... thing... won\'t... budge!</i>" she grumps in despair as she flops down on her ' + this.amilyButt() + ', twisting and tugging away in frustration.' );
			MainView.outputText( '\n\nYou\'ve only finished about half of the sweet tasting drink, but you stubbornly stick with it, figuring that a potion should be imbibed all at once.  There\'s a definite sensation of burgeoning warmth within your middle already.  Each swallow allows the knot of heat to diffuse through you, though it seems to be mounting in your groin faster than elsewhere...' );
			MainView.outputText( '\n\nSuddenly, strong arms wrap around your waist, and a sharp voice asks, "<i>Getting into something fun without me, Alpha?</i>"  Izma!  The surly shark-girl takes advantage of your full mouth to continue on unhindered.  "<i>A little bit of drink with your companions, huh?  Let me help you with that, mousey.</i>"' );
			MainView.outputText( '\n\nIzma plucks the bottle of Amily\'s hands and handily uncorks it, "<i>Cheers!</i>"  Amily stutters over her protests, but the damage is already done.  Izma chugs half the draught down before pulling it away with a satisfied smirk, a strand of pink-tinged spit dangling between her lips and the bottle.  "<i>Not my usual vintage, mind you.  A bit too sweet.</i>"  She pushes her glasses up her nose and hands the half-drank draught back to the mouse.  "<i>Share and share alike, right?</i>"' );
			MainView.outputText( '\n\nAmily blurts, "<i>That\'s not a drink!  It\'s my fertility potion, and I haven\'t even tested it yet!</i>"  The angry mousette proudly purses her own lips to chug the remainder while you wipe the last of yours from your mouth, not sure what to make of the situation.' );
			MainView.outputText( '\n\n"<i>A fertility potion!?</i>" the shark-girl cries before an unlady-like burp escapes her maw.  "<i>You let me drink some kind of... breeding draft!?</i>"  Izma rounds on the mouse-girl, placing herself directly between the you and the smaller woman.  Her tail is slapping at your [legs] with angry lashes, but each time she pushes a little more against you until her butt is rubbing on your groin through your [armor].  She growls in irritation while her hands reach back to clasp your [hips] protectively.' );
			MainView.outputText( '\n\nAmily retorts, "<i>You didn\'t give me a chance to explain, you ninny!</i>"' );
			MainView.outputText( '\n\nThe two begin to bicker back and forth, but honestly, you stop paying attention to the shrill, female voices.  There\'s a warm body squeezed up against you, and it feels so... right.  You let your hands play across Izma\'s curves, barely caring when they come to rest on her covered breasts, squeezing each one gently before slipping under the fabric to tweak the rigid nipples below.  There\'s a lecherous grin painted on your face, though you\'re barely aware of it, to be honest.  Your undergarments and [armor] are just so... restrictive, and they make it too hard for you to grind [eachCock] against her firm, shapely bottom.' );
			MainView.outputText( '\n\n"[name]!</i>" Amily shrieks, stepping around Izma to put her hand on your back.  "<i>You weren\'t thinking about wasting my potion on this watery tart, were you?</i>"  She\'s rubbing in gentle circles across your muscles, already working to get you naked.  "<i>Remember, you\'re going to stuff me full of another huge litter again, right?</i>" the mouse-morph purrs as she dares to slide a hand over [oneCock], giving it a squeeze and gently tugging it towards her.' );
			MainView.outputText( '\n\n"<i>Like hell!</i>" Izma snarls as she spins about.  She easily tears away the rest of your [armor], placing her hand ' );
			if( CoC.player.biggestCockArea() < 10 ) {
				MainView.outputText( 'overtop of the petite, cock-holding digits' );
			} else {
				MainView.outputText( 'on your [sheath]' );
			}
			MainView.outputText( ' possessively.  "<i>You two let me drink that, so you\'d better deal with the consequences.</i>"  Her lusty eyes flick towards you before casting down submissively, "<i>That is, if that\'s your will, Alpha</i>"  Her fingers gently squeeze on your member.' );
			MainView.outputText( '\n\nGroaning and feeling more ready to fuck than you have in a long time, you answer, "<i>Both of you... I\'ll take care of both of you... after all, I drank twice as much of either of you, so it should be no problem, right?</i>"' );
			MainView.outputText( '\n\nAmily seems about to make an argument, but she thinks better of it.  "<i>Okay, love, I suppose we can be your pregnant, sister-wives after all.</i>"' );
		}
		//[Next];
		//Try the Potion: Repeat;
		//Appears in Amily's Sex Menu - Izma3Some;
		else {
			MainView.outputText( 'You ask Amily if she\'s made up any more of that potion that you, her, and Izma had so much fun with before.' );
			MainView.outputText( '\n\nAmily laughs, "<i>You want to do that again?</i>" with a wisp of a sheepish smile curling at the corners of her petite mouth.' );
			MainView.outputText( '\n\nWhen you nod, her smile becomes excited, and she begins sorting a few bottles out of her gear.  You note that there\'s one blue one and two pink ones, though the girly drafts are portioned out to have half as much as their more masculine counterpart.  "<i>It worked really, really well last time, so I didn\'t think it would be a good idea to adjust the dosages at all.  I\'m not even sure I could handle a full course after being that sore...' );
			if( this.pregnancy.isPregnant ) {
				MainView.outputText( '  At least I can\'t get any more pregnant!' );
			}
			MainView.outputText( '</i>"' );
			MainView.outputText( '\n\nYou smirk and raise an eyebrow, asking, "<i>Izma?</i>"' );
			MainView.outputText( '\n\nAmily nods.  "<i>Izmaaaaaaaa!</i>"' );
			MainView.outputText( '\n\nThe pretty tigershark-girl comes sashaying around the rocks, putting a bookmark in her reading material as she answers the high-pitched call.  She glances between the two of you and huffs, "<i>Oh, couldn\'t think of having a little fun without me?</i>" with a wry grin.  Her skirt rustles slightly as she closes the intervening distance' );
			if( CoC.flags[ kFLAGS.IZMA_NO_COCK ] === 0 ) {
				MainView.outputText( ', barely concealing the half-swollen bulge beneath' );
			}
			MainView.outputText( '.  Izma says, "<i>What the hell, I ' );
			if( SceneLib.izmaScene.pregnancy.isPregnant ) {
				MainView.outputText( 'suppose I can do it for fun, since I\'m already pregnant.' );
			} else {
				MainView.outputText( 'suppose we can have another kid.' );
			}
			MainView.outputText( '</i>"' );
			MainView.outputText( '\n\nThe potions are passed around, and the three of you quickly get to drinking them.  The girls finish their half-filled bottles first, leaving them with nothing to do but slowly undress you while you try to devour the last of the sweet, lust-inducing stuff.  It\'s very hard to focus on swallowing your part of the equation with four hands roaming across your body, and you nearly choke on it when the two girls start hugging you from each side, mismatched hands diving into your crotch to fondle [oneCock] with eager grasps.  The artificial warmth that\'s gathering in your midsection slowly spreads throughout your body, though it seems like the bulk of it winds up in [eachCock] where it can be properly stimulated by the needy females\' pleasant fingers.' );
			MainView.outputText( '\n\nAmily nuzzles under your arm, her nose against the side of your [chest] as she inhales, murmurring, "<i>Such a ' + CoC.player.mf( 'strong, potent male...', 'beautiful, potent breeder...' ) + '  You\'re going to ' );
			if( !this.pregnancy.isPregnant ) {
				MainView.outputText( 'give me lots of babies' );
			} else {
				MainView.outputText( 'put even more babies inside me' );
			}
			MainView.outputText( ', right?  No need to bother with her...</i>"' );
			MainView.outputText( '\n\nIzma matches the mouse-girl\'s demure posture, glaring daggers at her from the other side, hand fixating on [oneCock] just behind Amily\'s.  "<i>Alpha, that rodent could never handle you in bed.  Come on, use me.</i>"' );
			MainView.outputText( '\n\nThe pleasant fog of your lust makes it hard to think.  Why can\'t these girls get that there\'s more than enough of you to go around?  You groan and you answer, "<i>I\'ll take care of both of you... you\'re too hot for me to let you leave without a load in every hole.</i>"' );
			MainView.outputText( '\n\nThe girls share one last glare across your middle before both sets of eyes settle on your [cock biggest], two voices agreeing, "<i>We can share.</i>"' );
		}
		EngineCore.dynStats( 'lib', 1, 'sen', 1, 'lus=', 100, 'resisted', false );
		MainView.menu();
		EngineCore.addButton( 0, 'Next', this, this.izmaAmilyDrugThreeWaySex );
	};
	//Start Ze Fucking!;
	AmilyScene.prototype.izmaAmilyDrugThreeWaySex = function() {
		MainView.clearOutput();
		MainView.outputText( 'The amorous embrace\'s effects on you are more than telling.  [EachCock] has swollen up, long and proud, as thick with arousal as ' );
		if( CoC.player.cockTotal() === 1 ) {
			MainView.outputText( 'it\'s' );
		} else {
			MainView.outputText( 'they\'ve' );
		}
		MainView.outputText( ' ever been.  The continuing caresses from your horny females have your [cock biggest] aching with a less than subtle need.  There\'s a certain, growing tightness in your [balls]' );
		if( CoC.player.balls > 0 ) {
			MainView.outputText( ', one that has your [sack] swelling slightly, the skin growing smooth and glossy as it fills with the heavy, comfortable weight of your sloshing seed' );
		} else {
			MainView.outputText( ', one that has you feeling comfortably swollen with pent-up seed just waiting to erupt' );
		}
		MainView.outputText( '.  Droplets of pre-cum slowly trickle from [eachCock] onto the busy ladies\' hands and forearms, turning their fondles into strokes so wet and lubricated that you could almost mistake them for a succubus\'s twat.  There\'s something wonderfully right about being served by these docile woman' );
		if( !this.pregnancy.isPregnant && !SceneLib.izmaScene.pregnancy.isPregnant ) {
			MainView.outputText( ', with their hungry wombs just waiting to be impregnated at your leisure' );
		} else if( this.pregnancy.isPregnant && SceneLib.izmaScene.pregnancy.isPregnant ) {
			MainView.outputText( ', with their ripe wombs stuffed full of your offspring already' );
		} else {
			MainView.outputText( ', with at least one of their wombs already ripe with your offspring' );
		}
		MainView.outputText( '.' );
		MainView.outputText( '\n\nAmily is equally enamored of you if the look on her face is any indication.  Her eyelids are low, with her dilated orbs almost hidden by her lengthy lashes.  She\'s fixated on your [cock biggest] while her hand sloppily pumps and jerks along its length, sharing the plumped-up penis with the tigershark-girl\'s larger hand.  The mouse-wife is licking her chops each time a fresh dollop of clear cock-cream escapes from your [cockHead biggest], but her tiny hand swiftly gathers it when she can - sometimes Izma lets go to get first shot at the fragrant, ' + CoC.player.mf( 'male', 'female' ) + ' honey you\'re so freely exuding.  Amily\'s tail is slowly sliding up and down your [leg] with unintentional excitement, upraised high enough that you can see her exposed muff.  Dewy moisture beads on the close-cropped crotch-fur so thickly that a few drops have begun to run down her thigh.  Her needy scent is so thick in the air you can practically taste it.  It makes your ' + Descriptors.multiCockDescriptLight() + ' twitch.' );
		MainView.outputText( '\n\nOn the other side of the heavenly handjob, Izma is smiling warmly, inadvertently displaying her large, predatory teeth while she attends to your pre-slicked shaft.  She\'s still clothed in her skirt and top - for now.  Her breasts bounce a little with each stroke she makes, the orange and black globes jiggling slightly.  The motion draws your eyes to the perky nubs of her nipples, which strain so very hard against the oppressive tightness of their fabricky prison.  ' );
		if( CoC.flags[ kFLAGS.IZMA_NO_COCK ] === 0 ) {
			MainView.outputText( 'Izma\'s skirt rustles softly, and some of the fronds that compose it slowly begin to rise.  For a while, it\'s just a slight protrusion, but as the tigershark-girl has her way with your [cock biggest], her bulge lifts into a tent well over a foot tall and inches thick.  Its owner\'s cheeks blush more red than normal  as Izma begins to pant, accompanied by something steadily dripping within the confines of her sorely-stretched waist-covering.' );
		} else {
			MainView.outputText( 'Izma\'s skirt visibly begins to dampen, and some of the fronds start sticking to her striped thighs in a rather alluring manner.  For a while, that\'s all that comes of it, but as the tigershark-girl has her way with your [cock biggest], the skirt gets wet enough to stick to her like a second skin.  Blushing a deeper red than normal, Izma begins to pant, accompanied by a steady dripping that spatters the ground below.' );
		}

		MainView.outputText( '\n\nStaggering under the weight of your own unfulfilled arousal, you stumble into the nest with your prick-addled harem, momentarily losing the double-handjob on your [cock biggest] while the three of you tumble into Amily\'s comfy abode.  Izma\'s glasses fly past overhead as she collapses next to you, landing softly at the far edge of the nest.  The de-spectacled ' );
		if( CoC.flags[ kFLAGS.IZMA_NO_COCK ] > 0 ) {
			MainView.outputText( 'former-' );
		}
		MainView.outputText( 'hermaphrodite giggles, and whispers, "<i>I didn\'t need them anyway.</i>"' );
		MainView.outputText( '\n\nAmily\'s big, fuzzy ears tickle your head as she nuzzles at the nape of her neck.  Her arm falls across your torso onto the far side of your [chest] to gently cup ' );
		if( CoC.player.averageNipplesPerBreast() <= 1 ) {
			MainView.outputText( 'one of your nipples' );
		} else {
			MainView.outputText( 'at your multitude of nipples' );
		}
		MainView.outputText( '.  Panting eagerly, she licks up the underside of your chin, eventually cresting your jawline.  Her lips meet yours, their supple, slippery pressure heavenly on your own, and a slim tongue sides across the paired puckers to delve inside your maw.  You return the gesture in kind, slithering around your flexible organ to taste her mouth... her lips... her everything.  You make love to her mouth the way you imagine you\'ll be making love to her nethers in a few moments.' );
		MainView.outputText( '\n\nAmily abruptly grunts in displeasure, and the skillful twirls of her tongue lapse into uncontrolled jerks.  Her lips, which you were oh so enjoying, push slightly to the side.  You make to break away and voice your complaint, but a reassuring hand lays across the other side of your [chest], crossing the mouse-woman\'s arm as a second mouth comes to rest on the exposed half of your own.  You retract your tongue just as the new arrival is forcing its own into your well-packed jaw.  With all the cushy, girly orifices sloppily kissing on you and the pair of mouth-muscles wrangling your own, you can\'t even properly return the french anymore.  You do your best to simply focus on the wriggling menagerie of spit-slobbering snakes, licking and suckling them as skillfully as you can given the circumstances.  Sometimes they even tangle up in each other and retreat, sliding between the two girls\' lips in their own twisted dance before returning to you, the real object of their affection.' );
		MainView.outputText( '\n\nAmily surprises Izma with a particularly fierce kiss, one that sends the girls rolling through the soft nest to the very edge.  Devoid of sensation for the first time in what feels like ages, you watch in stunned silence.  The lighter, smaller woman comes out on top, tail raised high to help her balance while Izma rests underneath her with both hands busily kneading at the rodent sweetheart\'s ' + this.amilyButt() + '.  Their gushing cunnies are locked together mound-to-mound, and the rigid clits glide through the opposite set of labia, smoothly deforming the engorged, flowery lips with gentle, grinding stimulation.  ' );
		if( CoC.flags[ kFLAGS.IZMA_NO_COCK ] === 0 ) {
			MainView.outputText( 'The shark-girl\'s balls are pushed to the side, barely avoiding being smothered in the mouse-girl\'s weight, and her rigid dick is drooling up between Amily\'s tits, where it seems quite happy to rest.  ' );
		}
		MainView.outputText( 'Izma\'s tail suddenly arcs up towards the mouse\'s behind, lightning-fast.  It impacts the tender rodent-bottom with a crack loud enough to make you wince.  Growling into the other woman\'s mouth, Amily flexes her own tail, wrapping Izma\'s up in coil after coil of smooth restraints.  They wrestle against each other, cunt to cunt and kissing the whole time.' );
		MainView.outputText( '\n\nFrom where you are, the two glistening mounds look almost like one enticing, pink delta with a star-shaped crease just waiting to be violated.  The drugs dancing through your brain keep you from looking away.  As a matter of fact, the more you watch the struggling women, the more important that doubled, chimeric hole becomes to you.  Your rutting body is unable to wait, and you give in to the tempting, clarion call that\'s surging out from your loins to pollute the rest of your body with sexual need.' );
		MainView.outputText( '\n\nYou lumber up to the pile of writhing flesh and place your hand upon a curvy buttock.  It doesn\'t matter which.  Izma\'s soaked skirt occasionally obscures your view, so you tear it away to give yourself a better view of your target.  Thrusting forward, you feel the pair of pussies cling against your [cockHead biggest] while it journeys between the slobbering cunts\' tightly-compressed entrances.  The immense amount of moisture is far beyond what either of the two normally produces - clearly the potion is affecting them as readily as it has you.  The amount of pre you\'re smearing over everything your [cock biggest] touches is proof enough of that.' );
		if( CoC.player.cockTotal() === 2 ) {
			MainView.outputText( '  You even cram your second member in alongside its big brother.  The two cunt-oiled shafts rub against each other as well as the sloppy holes on either side, leaving you grateful for the extra maleness.' );
		} else if( CoC.player.cockTotal() > 2 ) {
			MainView.outputText( '  You even cram an extra member in alongside its big brother.  The two cunt-oiled shafts rub against each other as well as the sloppy holes surrounding them, leaving you grateful for your extra maleness.  Of course, that isn\'t your entire package, but there isn\'t room to stuff any more dick into that stuffed cock-sauna.' );
		}
		if( CoC.flags[ kFLAGS.IZMA_NO_COCK ] === 0 ) {
			MainView.outputText( '  You even bump up against Izma\'s forgotten package, slathering it with mixed juices.  While it\'s rigid with arousal, Izma seems to have almost forgotten about it, instead choosing to focus exclusively on her more womanly parts.' );
		}

		MainView.outputText( '\n\nThe ladies\' pleased moans are each muffled by the other\'s puckered lips, but the purring sounds of pleasure are unmistakable.  An excited growl crawls up out of your throat as you give in to the overpowering rut and let your [cock biggest] lead you deeper into the smothering, sweltering heat of your breed-ready females.  You grab the bottom girl - the one with the stripes, since she\'s bigger - and you pull yourself back, nearly fainting from the heat of the of the twin mounds as they cling to every inch of your ' );
		if( CoC.player.cockTotal() > 1 ) {
			MainView.outputText( 'cocks' );
		} else {
			MainView.outputText( '[cock biggest]' );
		}
		MainView.outputText( '.  The sapphic kiss is shattered by your slit-moistening hardness, and Amily looks back at you, disentangling her tail from Izma\'s to caress you as she asks, "<i>You aren\'t going to waste it outside, are you?  Please, cum in me!</i>"' );
		MainView.outputText( '\n\n"<i>No, give it to me!  ' );
		if( SceneLib.izmaScene.pregnancy.isPregnant ) {
			MainView.outputText( 'My pussy is the obvious, stronger choice.' );
		} else {
			MainView.outputText( 'I\'m the stronger, obvious breeding choice.  Knock me up and you\'ll have fitter, better offspring.' );
		}
		MainView.outputText( '  Besides, can\'t you feel how wet my cunt is, and how those little tentacles inside are going to feel around you when you give me your cum?  That is your job as Alpha after all, to dominate my pussy and fill it full of you...  Ooooh...</i>" Izma moans, pleading her own case as she starts to finger Amily\'s asshole.  "<i>Besides, this little - ohgods - thing couldn\'t handle your babies, [name].</i>"' );
		MainView.outputText( '\n\nAmily squeaks in surprise at the sudden intrusion before stabbing her tail tip into the shark\'s rectum as well, turning Izma\'s demands into a lewd moan.  "<i>Come on, [name].  I\'m the one that figured out-ooouuuhhhh... uh, how to make the potion.  ' );
		if( !this.pregnancy.isPregnant ) {
			MainView.outputText( 'Give me your babies...  Mmmm, we\'ll make such smart babies.  ' );
		}
		MainView.outputText( 'Just, ahhh... put it inside me and cum, cum in me again and again and fuck me till I\'m pregnant with your spunk!</i>"  She\'s ' );
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 0 ) {
			MainView.outputText( 'actually blushing so hard that you can see it through her fur, a crimson tint that looks even better on her with the way her tongue is hanging out' );
		} else {
			MainView.outputText( 'blushing so hard her whole face is almost beet-red, a fine look on her with her tongue dangling so erotically out of her gasping mouth' );
		}
		MainView.outputText( '.' );
		MainView.outputText( '\n\nYou push and pull on the two girls, fucking both sets of mons without care for who eventually gets jizz inside them.  You\'re definitely going to flood a ' );
		if( !this.pregnancy.isPregnant || !SceneLib.izmaScene.pregnancy.isPregnant ) {
			MainView.outputText( 'womb' );
		} else {
			MainView.outputText( 'cunt' );
		}
		MainView.outputText( ', judging by how full your genitals are feeling, but it doesn\'t matter greatly one way or the other.  There\'s a calm, confident surety in the back of your mind that keeps reminding you that you\'re in charge here, and that both these women WILL be ' );
		if( !this.pregnancy.isPregnant || !SceneLib.izmaScene.pregnancy.isPregnant ) {
			MainView.outputText( 'pregnant' );
		} else {
			MainView.outputText( 'squirting' );
		}
		MainView.outputText( ' for you.  Each time you slam your ' );
		if( CoC.player.cockTotal() > 1 ) {
			MainView.outputText( 'doubled dicks' );
		} else {
			MainView.outputText( '[cock biggest]' );
		}
		MainView.outputText( ' home, you wind up pushing the ass-pegging tail deeper inside Izma and her finger deeper inside the mouse, which in turn makes their cunts gush harder around you.  Amily has given up on the debate and started suckling one of Izma\'s nipples while you grind their sloppy gashes towards orgasm, and your ' );
		if( CoC.player.balls > 0 ) {
			MainView.outputText( 'straining balls slosh ' );
		} else {
			MainView.outputText( 'straining fullness tingles ' );
		}
		MainView.outputText( 'meaningfully, reminding you that the steady throb of your own encroaching climax is a few quick thrusts away.' );
		MainView.outputText( '\n\nWithout warning, you pull back, exposing yourself to the cool air, and thrust up and in, stabbing your [cock biggest] ' );
		if( CoC.player.biggestCockArea() > 61 ) {
			MainView.outputText( 'as far into Amily\'s juicy slit as it will go' );
		} else {
			MainView.outputText( 'straight into Amily\'s juicy slit' );
		}
		MainView.outputText( '.  Izma\'s finger rubs up against you through the mouse-girl\'s inner walls, providing an extra layer of stimulation on top of the pleasure her glove-tight cunt is doling out.  Lady-spunk gushes over you from [cockHead biggest] all the way to your [sheath], and it drips on to Izma\'s dick-deprived snatch as you fuck the pregnancy-fetishizing mouse-girl.  The predatory slut sighs, but her finger begins to wiggle faster and faster within the confines of the mouse\'s ass, vibrating through the climaxing rodent-pussy to shroud you in ecstasy.  You bottom out inside the heavenly cunt and release, the pleasure of cumming stronger than normal, propelled by a biological imperative to ensure that every drop of semen is deposited as deeply into a willing female as possible.' );
		MainView.outputText( '\n\nAmily stops suckling the shark-tit as she screeches out her excitement for the whole of your camp to hear.  Her ' + this.amilyHips() + ' buck wildly against you and the shark, splattering you both with the proof of her pleasure as instinct takes over.  With her efforts so focused on her nether-lips, her face slumps against Izma\'s pillow-like breast, and she begins to drool stupidly in between gasps and groans, too drunk on orgasm to care.  The sense of relief is as palpable as it is intense, growing with each thick, sticky bulge that launches out of your urethra.  Amily\'s pussy is splattered with cock-cream, quickly filling, the walls of her well-used canal entirely soaked in white.' );
		if( !this.pregnancy.isPregnant ) {
			MainView.outputText( '  Her belly begins to puff up from the thorough insemination, at first going a little pudgy, but then turning large and bulbous.  Her empty womb is somehow taking more and more of your virile seed inside.  It\'s almost like her cervix is sucking down the yogurt-thick load like a one-way valve, and soon Amily\'s middle is positively jiggly with spunk, bulging out to either side of her from her body weight.' );
		} else {
			MainView.outputText( '  With her womb already occupied by your offspring, Amily\'s cervix stays steadfastly closed.  There\'s so much jizz pumping out of you that the tight canal can\'t even begin to hold all of it' );
			if( CoC.player.hasKnot( CoC.player.biggestCockIndex() ) ) {
				MainView.outputText( ', but your knot traps it inside anyway.  You cum and cum until the pressure is almost painful, but even your magnificent knot can\'t hold it all back' );
			}
			MainView.outputText( '.  Spraying out in high-pressure streams, your spunk gushes out in a white river, soaking your legs, glazing Izma\'s groin and tail, and most importantly, leaving Amily\'s mound so thoroughly creampied that you think her muff may as well get pregnant too.  Even knowing that it\'s flowing out around you, you stay stubbornly hilted, compelled to release it all inside her, the surging sperm-flow that pumps out with each squirt massaging you into releasing even more.' );
		}
		//[Next];
		MainView.menu();
		EngineCore.addButton( 0, 'Next', this, this.izmaAmilyDrugThreeWaySex2 );
	};
	AmilyScene.prototype.izmaAmilyDrugThreeWaySex2 = function() {
		MainView.clearOutput();
		MainView.outputText( 'Time goes hazy, for a bit, but the cool air on your sopping boner is enough to rouse you back to full consciousness.  The scene is unreal.  Amily rolled off of Izma at some point and is laying flat on her back, cradling her ' );
		if( !SceneLib.izmaScene.pregnancy.isPregnant ) {
			MainView.outputText( 'cum-' );
		}
		MainView.outputText( 'pregnant belly and murmuring, "<i>Babies,</i>" while her fingers mindlessly diddle her alabaster-painted cunt.  She shudders as aftershocks of pleasure torture her lust-wracked brain, keeping her in a horny, docile state.' );
		MainView.outputText( '\n\nIzma seems to have taken advantage of your lapse in consciousness - you\'re on your back, and she\'s straddling your chest' );
		if( CoC.flags[ kFLAGS.IZMA_NO_COCK ] === 0 ) {
			MainView.outputText( ', dick and balls flopping lamely on top of you' );
		}
		MainView.outputText( '.  She pants, "<i>Dunno why I didn\'t just fuck ya while you were out of it...  Didn\'t seem right.</i>"  Rubbing her breast one-handed, the shark-girl begs, "<i>Can I have it now?  Can you cum in me like you did her, [name]?  Please, I\'m so... so wet for you, I\'ll make you feel so good.</i>"  She keeps scooting back and forth just above your [hips], the hard lump of her clit pressing into you as she awaits permission to ' );
		if( !SceneLib.izmaScene.pregnancy.isPregnant ) {
			MainView.outputText( 'be inseminated' );
		} else {
			MainView.outputText( 'have her pregnant-pussy packed full again' );
		}
		MainView.outputText( '.' );
		MainView.outputText( '\n\nBehind her, [eachCock] has remained triumphantly stiff, and ' );
		if( CoC.player.balls === 0 ) {
			MainView.outputText( 'the pressure is as omnipresent as ever' );
		} else {
			MainView.outputText( 'your [balls] are stretching your [sack] as tight as before' );
		}
		MainView.outputText( '.  The need to cum is almost overpowering, and without thinking about it at all, you fold your arms behind your head and nod, eager to slake the need you just can\'t seem to overcome.' );
		MainView.outputText( '\n\nIzma rises on shaky legs and flashes you a sultry look before diving back down, her cunt swallowing your [cock biggest] with ravenous abandon.  Her pussy doesn\'t feel as warm or tight as Amily\'s, but there are lots of tiny little tentacles inside that caress your [cockHead biggest], swirling across the sensitive skin.  When she ' );
		if( CoC.player.biggestCockArea() <= 65 ) {
			MainView.outputText( 'bottoms out' );
		} else {
			MainView.outputText( 'takes as much as she can' );
		}
		MainView.outputText( ', there\'s a squirt of lubricant that washes out onto your middle' );
		if( CoC.flags[ kFLAGS.IZMA_NO_COCK ] === 0 ) {
			MainView.outputText( ' along with a matching jet of pre-cum from her tip' );
		}
		MainView.outputText( '.' );
		if( CoC.player.cockTotal() > 1 ) {
			MainView.outputText( '  Strong hands wrap around ' );
			if( CoC.player.cockTotal() > 2 ) {
				MainView.outputText( 'two of ' );
			}
			MainView.outputText( 'your extra penis' );
			if( CoC.player.cockTotal() > 2 ) {
				MainView.outputText( 'es' );
			}
			MainView.outputText( ', jacking ' );
			if( CoC.player.cockTotal() === 1 ) {
				MainView.outputText( 'it' );
			} else {
				MainView.outputText( 'them' );
			}
			MainView.outputText( ' with smooth, confident strokes.  "<i>I bet the mouse couldn\'t tend to your needs like this, huh?</i>"' );
		}
		MainView.outputText( '\n\nYou look up at the cum-hungry shark-girl with undisguised affection.  She meets your gaze and blows a kiss before she starts the slow journey back up, tight lips hugging your girth as they leave their own fragrant moisture on your [cock biggest].  You allow your woman to ride you with a lazy smile' );
		if( CoC.flags[ kFLAGS.IZMA_NO_COCK ] === 0 ) {
			MainView.outputText( ', ignoring the dribbly cock that\'s leaking on your chest' );
		}
		MainView.outputText( '.  Instinctive, half-thought voices remind you that is how it should be - so virile that you need a herd of woman to take turns satisfying your insatiable desires.  Lucky for you, you\'ve got the start of one right here.' );
		MainView.outputText( '\n\nIzma leans down' );
		if( CoC.player.cockTotal() === 2 ) {
			MainView.outputText( ', taking a hand away from your extra dick to support herself,' );
		}
		if( CoC.player.cockTotal() > 2 ) {
			MainView.outputText( ', taking a hand away from one of your extra dicks to support herself,' );
		}
		MainView.outputText( ' and kisses you passionately.  The fervent kiss is as short as it is frenzied, but as you\'re recovering from it, Izma starts to talk, "<i>You like that, Alpha?  You like having my cunt suckling on your dick?</i>"  She swivels her hips with her words, the inner tentacles all pulling on you in concerted waves, actually lifting your penis to press deeper inside her, right up against her ' );
		if( SceneLib.izmaScene.pregnancy.isPregnant ) {
			MainView.outputText( 'closed' );
		} else {
			MainView.outputText( 'dilated' );
		}
		MainView.outputText( ' cervix.  "<i>' );
		if( SceneLib.izmaScene.pregnancy.isPregnant ) {
			MainView.outputText( 'I know I\'m pregnant, but I want you to cum as deeply inside me as possible, okay?  I just... I have to have your cum. I NEED to feel that warmth flooding inside me.  It\'ll... ohh, yes... it\'ll make me feel so good, so loved.' );
		} else {
			MainView.outputText( 'I don\'t know how, but I just know that you\'re going to make me pregnant when you cum inside me.  It\'s going to get me oh-ohhhhh... so heavy with your child, and it\'ll be perfect and blissful.  You\'re going to fucking flood me with jizz, aren\'t you, Alpha?' );
		}
		MainView.outputText( '</i>"  Izma\'s eyes twinkle with a mixture of obscene hunger and overbearing affection.  She whispers, "<i>Will you please' );
		if( !SceneLib.izmaScene.pregnancy.isPregnant ) {
			MainView.outputText( ' make me your gravid, jizz-slurping beta-wife?' );
		} else {
			MainView.outputText( ' cum in your pregnant, jizz-hungry wife?' );
		}
		MainView.outputText( '</i>"' );
		MainView.outputText( '\n\nFuck, it\'s like she\'s telling you to do exactly what you want to do!  There\'s nothing hotter than ' );
		if( !SceneLib.izmaScene.pregnancy.isPregnant ) {
			MainView.outputText( 'watching a bitch\'s belly bloat as it\'s packed to a full, fertile dome' );
		} else {
			MainView.outputText( 'stuffing a cunt so full she\'ll never stop dripping your seed' );
		}
		MainView.outputText( '.  Getting to lie back and watch her cum her brains out while you do it?  That\'s just icing on the cake.  Izma\'s feelers flutter erotically about you, spastically stroking with uncoordinated, individual slithers that remind you of a hundred tiny tongues.  She gets infinitely wetter, something you didn\'t think possible, and her whole body begins to go scarlet, coloring as she climaxes.' );
		if( CoC.flags[ kFLAGS.IZMA_NO_COCK ] === 0 ) {
			MainView.outputText( '  Her four balls quake atop you, and you watch her urethra bulge, ready to splatter your [chest] with her own, lesser climax.' );
		}
		MainView.outputText( '  Lady-spunk washes across your middle as her walls begin to wring your length, squeezing it just firmly enough to make your ardor flare hotter, triggering an avalanche of feelings within you that you could not hope to repress.' );
		if( CoC.flags[ kFLAGS.IZMA_NO_COCK ] === 0 ) {
			MainView.outputText( '  The smell of her hot, inferior seed hits your nostrils, exciting you even further as it rolls off of you in thick globs.' );
		}

		MainView.outputText( '\n\nYou feel like an over-pressurized tank that\'s just been tapped.  One moment, there\'s indescribable force all bottled up inside you, and the next you\'re letting it spray out in long waves, each one guided through your urethra by contractions so violent they cause your whole body to shake each time.  You pump long lances of seed into the shark-girl\'s ready snatch.  She screams, "<i>Yes!  Give it to me!  Ohhh, gods, YES!</i>" as you fill her.' );
		if( SceneLib.izmaScene.pregnancy.isPregnant ) {
			MainView.outputText( '  Her womb remains steadfastly closed, already seeded to capacity, so your salty deposit quickly floods the smaller canal.  The tendrils go lax as they\'re dipped in your baby-batter, each limp in the heady flow.' );
			if( CoC.player.hasKnot( CoC.player.biggestCockIndex() ) ) {
				MainView.outputText( '  Your knot balloons explosively inside her, but the seal on her womb is tighter.' );
			}
			MainView.outputText( '  Jism rushes out around your cock in a river.  The nest was already soaked with liquid lust from your last tryst, moments ago, but now it\'s soaked completely white.  After a while, Izma\'s actually forced off you by the incredible potency of your eruptions, falling flat on her back.' );
		} else {
			MainView.outputText( '  Her womb beckons for your spunk, and the tentacles undulate slowly, working like tiny paddles to push every single drop deep into her uterus.  You cum until your eyes cross, but you still manage to watch Izma\'s taut midriff bulge out, her striped skin stretching smooth with the sloshing weight you\'re pumping into her.  She moans and rubs her hands across the increasingly spherical distention, holding herself down on top of you seal in as much as possible.' );
			if( CoC.player.hasKnot( CoC.player.biggestCockIndex() ) ) {
				MainView.outputText( '  Of course, with a knot like yours there\'s no need for that.  You keep her sealed up so tightly that she has no choice but to take every drop.' );
			}
			MainView.outputText( '  The tigershark babbles, "<i>So... full</i>" and topples over backward under her own doubled weight' );
			if( CoC.player.hasKnot( CoC.player.biggestCockIndex() ) ) {
				MainView.outputText( ', your dong forced out with a noisy \'SCHLURRRPOP\'' );
			}
			MainView.outputText( '.' );
		}
		MainView.outputText( '\n\nIzma pants, "<i>Ung... mmm... so much,</i>" and cradles her ' );
		if( !this.pregnancy.isPregnant ) {
			MainView.outputText( 'jizz-bloated' );
		} else {
			MainView.outputText( 'child-bearing' );
		}
		MainView.outputText( ' middle.  You\'re still going, still spurting, but without a tight hole to fill, there\'s just no pleasure on it.  You start to push yourself up - you need to impregnate something, but Amily is there in a flash, still jilling her pussy as she stuffs her ass with your squirting cock.  It slides on in with ease thanks to its copious spurting and the double-dose of cunt-juice that wreathes it.' );
		MainView.outputText( '\n\nThe gravid mouse-girl purrs, "<i>You can use my ass... my mouth.  I don\'t care, [name].  I love you and I\'ll let you knock up all my holes, as long as you keep me full...</i>"  Her heavy belly drops down on top of you, pinning you there, and she pivots on it, bouncing her ass on your cock while you give her an alabaster enema.  Amily moans, "<i>Take me, [name]!</i>" and throws her head back, rolling her nipples in her fingers. Her tail slips into your [asshole] and presses up on your prostate, milking a few last, long squirts from you.  She\'s too packed to take much more, but thankfully, you don\'t have much more to give, as the tigershark-girl took most of it.' );
		MainView.outputText( '\n\nAs the orgasm passes, you find yourself invigorated rather than exhausted.  Meanwhile, Amily is wobbling about unsteadily, and you pick her up, slowly exiting her ass, your dick already washed clean by the tide of ejaculate that drains from her plugged bottom.' );
		MainView.outputText( '\n\nIzma is still fairly out of it, but when you wave your [cock biggest] under her nose, she perks right up.  A wet, pink tongue slithers out of her open maw, and her teeth retract, leaving you with a smiling cock-sucker just waiting for a snack.  As soon as your [cock biggest] sinks into her mouth, your [legs] give out, and you tumble down next to her, overwhelmed.  You\'re ultra sensitive after two back-to-back orgasms, and feeling that slippery muscle undulating across your length is just too much for you.  You groan in satisfaction and pull Izma down against your groin, weakly pumping against one member of your pregnant harem.' );
		MainView.outputText( '\n\nYour vision goes black when a ' + this.amilyButt() + ' suddenly lands across your face, smearing her sperm-slicked pussy-lips against your mouth.  The owner of that fine ass\'s tangy taste is layered in with your juices, and you begin to please her orally, if only to have her ready for another filling.' );
		MainView.outputText( '\n\nAmily moans, "<i>You\'re so good to us, [name],</i>" while Izma agrees, "<i>Mmmphhmmm!</i>" around your dick.  Your ' );
		if( CoC.player.balls > 0 ) {
			MainView.outputText( '[balls] are' );
		} else {
			MainView.outputText( 'body is' );
		}
		MainView.outputText( ' already refilling, and you know that before long, you\'ll give Izma enough to keep her fed for a week.  It\'s hard to think with lightning bolts of pleasure exploding in your cock and a mouth stuffed full of cummy cunt, so you don\'t.  You let the scent of the mixed sexual juices and the feel of Izma\'s mouth take over, enjoying simple reciprocation until your next cum, one you barely remember aside from the blackout inducing ecstasy.' );
		//[Next];
		MainView.menu();
		EngineCore.addButton( 0, 'Next', this, this.izmaAmilyDrugThreeWaySex3 );
	};
	AmilyScene.prototype.izmaAmilyDrugThreeWaySex3 = function() {
		MainView.clearOutput();
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -3 );
		MainView.outputText( '<b>Some time later...</b>\n' );
		MainView.outputText( 'You come to in a daze.  You\'re soaked in sexual juices of all kinds from the waist down, though for once, [eachCock] has gone soft.  Izma is snuggled up under your left arm and Amily under your right.  They\'re still asleep, but they\'re even more soaked than you, and hugging each other across your body.  The potion may have worked a little differently than Amily designed it to, but you can\'t really complain about the results.' );
		if( !SceneLib.izmaScene.pregnancy.isPregnant || !this.pregnancy.isPregnant ) {
			MainView.outputText( '\n\n(<b>' );
			if( !this.pregnancy.isPregnant ) {
				MainView.outputText( 'Amily' );
				this.pregnancy.knockUpForce( PregnancyStore.PREGNANCY_PLAYER, PregnancyStore.INCUBATION_MOUSE - 182 ); //Amily carries babies to term way faster than a regular player
				if( !SceneLib.izmaScene.pregnancy.isPregnant ) {
					MainView.outputText( ' and ' );
				}
			}
			if( !SceneLib.izmaScene.pregnancy.isPregnant ) {
				MainView.outputText( 'Izma' );
				SceneLib.izmaScene.pregnancy.knockUpForce( PregnancyStore.PREGNANCY_PLAYER, PregnancyStore.INCUBATION_IZMA );
			}
			MainView.outputText( ' definitely got pregnant.</b>)' );
		}
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseFourHours );
	};
	//Amily Nurse RP;
	//The player gives Amily a Skimpy Nurse's Outfit (the first time only), and she asks them if they want a checkup. Amily then proceeds to 'examine' the player and 'diagnoses' them with blue balls (or the prostate equivalent if the player has no balls). Obviously this must be 'treated' immediately by way of Amily having sex with the player. Must include the possibility of impregnating Amily if she's off her herbs, but not necessarily limited to just vaginal penetration. Bonus points if she asks the player to make an appointment for a follow-up exam afterwards.;
	//This borderline obscene nurse's outfit would barely cover your hips and crotch.  The midriff is totally exposed, and the white top leaves plenty of room for cleavage.  A tiny white hat tops off the whole ensemble.;
	//Prompt to Give It To Her:;
	//	You could give Amily the nurse's outfit you got, though it barely covers anything at all, and would likely be inviting some roleplay from the kinky mouse-girl.;
	//	{No dick: You have a hunch if you were a male, giving Amily a nurse's outfit might set off some kinky roleplay.};
	//	{You have a hunch that if you had a nurse's outfit you could get Amily to give you a rather erotic checkout{, provided you had a dick}.};
	//Give It To Her/Repeat Sex Option;
	//[NurseCheckup];
	AmilyScene.prototype.amilyNurseCheckup = function() {
		MainView.clearOutput();
		//First Time;
		if( CoC.flags[ kFLAGS.GIVEN_AMILY_NURSE_OUTFIT ] === 0 ) {
			CoC.player.consumeItem( ArmorLib.NURSECL );
			CoC.flags[ kFLAGS.GIVEN_AMILY_NURSE_OUTFIT ] = 1;
			MainView.outputText( 'You hand Amily the enticing garments with a roguish smile.  Her eyes seem confused at first, but a knowing, playful grin spreads over her features.  Slapping you with the costume, she teases, "<i>What is this supposed to be, [name]?</i>"  The fabric stretches across her as she holds it up in front of her \'assets\'.  "<i>This is barely modest!</i>"' );
			MainView.outputText( '\n\nShe rounds on you, her tail rubbing on your leg as she steps closer, holding the thin fabric tight to her lithe body.  "<i>Did you want me to look obscene for you?  To look like a naughty nurse?</i>"  Her ears twitch as she mulls it over.' );
			MainView.outputText( '\n\nYou try to answer, but before you get a half-dozen words out, Amily prances off behind some rocks, warning, "<i>No peeking!</i>"  The rustling of clothing can be heard as she changes, underscored by mischievous humming noises.  You do your best to wait patiently, but [eachCock] is warm and anxious.' );
			MainView.outputText( '\n\nA sultry voice purrs, "<i>Ah, [name].  Come on in, it\'s time for your check-up.</i>"' );
			CoC.flags[ kFLAGS.AMILY_CLOTHING ] = 'a naughty nurse\'s outfit';
			MainView.menu();
			EngineCore.addButton( 0, 'Next', this, this.amilyNurseCheckupV2, false );
		}
		//Repeat;
		else {
			MainView.outputText( '"<i>You want another check-up?</i>" Amily says.  "<i>Well, okay.  Let me get the outfit!</i>"  She turns, her tail smacking your [butt] as she runs behind some rocks to grab the skimpy white "dress", if it can be call that.  You wait with undisguised excitement, twiddling your thumbs to pass the time.' );
			MainView.outputText( '\n\nEventually, Amily\'s fair voice purrs out, "<i>Time for your checkup, [name].  You must have quite the condition since you keep coming back.  Come on in...</i>"' );
			MainView.menu();
			EngineCore.addButton( 0, 'Next', this, this.amilyNurseCheckupV2, true );
		}
	};
	//[Next] - both merge here;
	AmilyScene.prototype.amilyNurseCheckupV2 = function( repeat ) {
		MainView.clearOutput();
		var x = CoC.player.cockThatFits( 61 );
		MainView.outputText( 'You step in to Amily\'s office, as it were.  It\'s really just a cluster of boulders, but with the way the mouse-girl is looking about imperiously and gesturing for you to sit on a flat rock, you really do feel like you\'re back at the village doctor, getting checked on to make sure you\'re okay.  As for Amily, she\'s looking fine... mighty fine indeed.  Her ' + this.amilyTits() + ' nicely fill the tight, cleavage exposing top, while her ' );
		switch( this.pregnancy.event ) {
			case 2:
			case 3:
				MainView.outputText( 'slightly-protruding pregnancy is exposed beneath it' );
				break;
			case 4:
			case 5:
				MainView.outputText( 'pregnancy-swollen tummy rounds out beneath it' );
				break;
			case 6:
			case 7:
			case 8:
				MainView.outputText( 'pregnancy-bloated belly bulges out beneath it' );
				break;
			default:
				MainView.outputText( 'taut midriff is fully on display' );
		}
		MainView.outputText( '.  The clingy bottom is little more than a micro-skirt, short enough that it nearly exposes her vagina to your roaming eyes.' );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( '  It bulges out lewdly in a sheer outline of her ' + this.amilyCock() + ', which is curled over to remain inside the stretchy skirt.' );
		}
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 9 ) {
			MainView.outputText( '  The effort is a failure, as her immense cock is simply too big for such a slinky covering, and the fat tip curves down to dangle below the hem, pulsing dangerously.' );
		}
		MainView.outputText( '  To complete the outfit, a tiny, white hat with a red cross adorns her head, tilted slightly off-center.' );
		MainView.outputText( '\n\n"<i>Please, take off your clothes, [name].</i>" she playfully recites, holding a flat piece of wood she must have found in a hurry like a clipboard.  "<i>Now, it says here you are feeling feverish around females, particularly young, healthy mice.  I also see mentions of an out-of-control libido.  Is this right?</i>"' );
		MainView.outputText( '\n\nYou listen as you undress, sitting down on the stone when instructed and nodding along with the list of symptoms.  They sound pretty accurate to your ears.  A soft ' );
		if( CoC.flags[ kFLAGS.AMILY_NOT_FURRY ] === 1 ) {
			MainView.outputText( 'hand' );
		} else {
			MainView.outputText( 'paw' );
		}
		MainView.outputText( ' touches your thigh as Amily sets the \'clipboard\' aside.' );
		MainView.outputText( '\n\nShe says, "<i>Let\'s get on with the examination then, shall we?</i>"' );
		MainView.outputText( '\n\nYou nod, perhaps a little too eagerly, but Amily doesn\'t seem to mind.  In fact, her touches grow more direct and suggestive, trailing up your thigh to your belly, then down to the sensitive ' + CoC.player.skinFurScales() + ' just above your crotch.  She rubs there in soft, gentle circles while her other hand gracefully explores your back.  Naked and exposed before the horny mouse, you can\'t help but grow excited with an immediacy that startles even you.  [EachCock] rockets to full size in a split second, almost vibrating from the force of your erection.  You moan out loud, something Amily plays off to be pain.' );
		MainView.outputText( '\n\n"<i>Oh I see, such a painful condition to endure,</i>" she murmurs as her hand meets the lust-thickened pole.  Her fingers flutter down the length' );
		if( CoC.player.balls === 0 ) {
			MainView.outputText( ', testing to engorgement with soft squeezes that are almost painful with how aroused you\'ve become.' );
		} else {
			MainView.outputText( ', eventually coming to rest on your [sack].  She dutifully hefts your [balls], ' );
			if( CoC.player.ballSize <= 4 ) {
				MainView.outputText( 'rolling them in her fingers with a sly smile' );
			} else {
				MainView.outputText( 'letting her fingers sink into one of the swollen orbs with a sly smile' );
			}
			MainView.outputText( '.' );
		}
		MainView.outputText( '  Watching your face the whole time, Amily smiles seductively when you begin to pant.  You miss it, too busy looking down her exposed cleavage, enhanced by the chest-compressing tightness of her naughty nurse\'s outfit.  A none-too-subtle squeeze on your sensitive genitals draws you back to the present' );
		if( CoC.player.hasVagina() ) {
			MainView.outputText( ', while a sneaky finger slides into your cleft, testing the wetness' );
		}
		MainView.outputText( '.' );
		MainView.outputText( '\n\nAmily explains, "<i>It\'s ' );
		if( CoC.player.balls > 0 ) {
			MainView.outputText( 'Blue Balls' );
		} else {
			MainView.outputText( 'Boneritus' );
		}
		MainView.outputText( ', I think.  It\'s a condition that affects exceptionally virile males and herms like yourself from time to time.  Thankfully, it isn\'t permanent.</i>"  Her crotch-bound hand squeezes and strokes across your sensitive genitals.  "<i>Unless of course, you want it to be.</i>"  She tugs your stiff mast from the [sheath] up to the [cockHead biggest] slowly, milking a dollop of pre-cum from it as she prattles on.  "<i>We have a new treatment I\'ve been pioneering, but it is very experimental.</i>"' );
		MainView.outputText( '\n\nYou moan, "<i>Oohhh, what is it?</i>"' );
		MainView.outputText( '\n\nAmily abruptly releases your over-engorged pecker and lifts her leg high enough to place it on your shoulder, stretching the obscene skirt up on to her hips, her womanhood laid bare just inches from your [face].  "<i>Mouse-cunt,</i>" she breathes.  "<i>Again and again, until the naughty spunk is out and your ' );
		if( CoC.player.balls > 0 ) {
			MainView.outputText( 'plump balls are' );
		} else {
			MainView.outputText( 'stiff shaft is' );
		}
		MainView.outputText( ' freed from the perverted needs that afflict you.</i>"' );
		MainView.outputText( '\n\nYour pupils contract into needy pinpricks as her scent slithers up your nose, and you lean forward to stuff your tongue straight up that wet snatch, feeling the hot, wet heat clinging to your muscle as you spear the mouse\'s slick channel.' );
		MainView.outputText( '\n\n"<i>Yessss... this is another symptom... inability to resist sexu... sexua - ooOOH, right there!  Sexual contact.  You\'ve got it so bad, don\'t you?</i>" Amily pants as you assault her ripe pussy.' );
		MainView.outputText( '\n\nYou nod into the feminine vice, your nose bumping and grinding against a stiff clit.  Your hands raise and grab hold of your nurse by her ' + this.amilyButt() + ' to pull her against you, to get your tongue deeper inside.  Shuddering slightly, she wiggles out of your grip and lowers her leg, stumbling a bit weakly on legs that aren\'t working the way they should.  The moist rodent-girl is panting heavily as she recovers from your oral assault, but after a few breaths, she whispers, "<i>That was nice, but it\'s time to administer the treatment.</i>"' );
		MainView.outputText( '\n\nAmily unbuttons the top, letting her breasts sway freely as she climbs ' );
		if( !CoC.player.isTaur() ) {
			MainView.outputText( 'into your lap' );
		} else {
			MainView.outputText( 'alongside your equine lower half' );
		}
		MainView.outputText( '.  "<i>J-just relax.  This won\'t hurt a b-bit,</i>" she stutters as she aligns her entrance with your ' + Descriptors.cockDescript( x ) + ', pungent humidity rolling off her sex in steamy waves.  Your tip slowly parts her glittering mound, accompanied by a burst of ecstasy that has you slumping back against a boulder, tongue hanging out happily.  The petite mouse slowly undulates her waist as she takes more and more of your length into her box, the mousy muff eventually coming to rest against your [hips] with an almost apologetic pause in friction.' );
		MainView.outputText( '\n\nThrowing her head back, the mouse-girl moans in excitement, and you feel her tunnel squeeze down on your ' + Descriptors.cockDescript( x ) + ', compressing it with forgiving, soft pressure.  Her secretions slowly trickle out onto you' );
		if( CoC.player.cockTotal() > 1 ) {
			MainView.outputText( ' as her hand finds its way to ' );
			if( CoC.player.cockTotal() > 2 ) {
				MainView.outputText( 'one of your extra cocks' );
			} else if( CoC.player.cockTotal() === 2 ) {
				MainView.outputText( 'your extra cock' );
			}
			MainView.outputText( '.  Slowly, she pumps the spare shaft, muttering something about, "<i>Treating allll the symptoms.</i>"' );
		}
		MainView.outputText( '.\n\nSlowly dragging her tightly-clinging pussy up your rod, the nurse begins to properly treat your condition, and it\'s surely working, for you\'re already releasing slow pulses of pre into her pussy.  Amily throws her head back and cries out even louder, the silly little hat tumbling off behind her as her hair swishes back and forth with her every convulsion.' );
		MainView.outputText( '\n\nThe petite woman\'s skillful cock-manipulations have you squirming uncomfortably under her on the cusp of a blissful explosion for what seems like hours.  She whines, "<i>Give it to me, [name]!  Fuck your naughty, nasty nurse!  Screw her silly! Yesssssss-!</i>"  Her voice loses cohesion as she cums, and her pussy begins to assault you with sensuous, milking ripples all along your length.  [EachCock] squirts in response, accompanied by a clenching spasm of pleasure that crashes through the very fibres of your being.  Your [hips] lurch upward, hard enough to bounce the mouse into the air as you inseminate her.' );
		if( CoC.player.cumQ() >= 500 ) {
			MainView.outputText( '  The steady rhythm of your spurts goes on unabated for well over thirty seconds, ' );
			if( !this.pregnancy.isPregnant ) {
				MainView.outputText( 'slowly filling Amily\'s womb to capacity' );
			} else {
				MainView.outputText( 'slowly forcing trails of semen out of her entrance' );
			}
			MainView.outputText( '.' );
			if( CoC.player.cumQ() >= 2000 ) {
				MainView.outputText( '  Amily hangs on for dear life as ' );
				if( !this.pregnancy.isPregnant ) {
					MainView.outputText( 'she\'s filled to capacity, her stretchy, mallaeble middle bulging lewdly with spunky jizz, sloshing with each fresh injection.' );
				} else {
					MainView.outputText( 'torrents of the stuff spray out of her entrance, her canal too filled to hold even a drop more and your penis continuing to push the pressure higher.' );
				}
			}
			if( CoC.player.cumQ() >= 500 ) {
				MainView.outputText( '  It turns your crotch into a sticky mess.' );
			}
		}
		MainView.outputText( '\n\nYour body goes limp as it spends the last of your desire into Amily\'s spasming slit.  Her body is wracked by one last convulsion' );
		if( CoC.flags[ kFLAGS.AMILY_WANG_LENGTH ] > 0 ) {
			MainView.outputText( ' that flings sticky ropes across your [chest].  Her back arches as she continues to launch her own jism towards you' );
		}
		MainView.outputText( ', and then she too sags down against you, hugging you as she says, "<i>That was... intense.</i>"  She tries to rise, but her legs fall limp halfway up.' );
		if( CoC.player.hasKnot( x ) ) {
			MainView.outputText( '  She tries again.  This time, it\'s your knot that keeps her rooted firmly in place, and she stays plugged like that for a good twenty minutes, her cunt basting in your animal-spooge as she enjoys the fullness only a thick knot can provide.' );
		}
		MainView.outputText( '  Finally, she makes it up and off of you.  Her pussy is nice and wet, matted with white.' );
		MainView.outputText( '\n\nYou rise and kiss Amily on the lips, thanking her for the checkup before you pick up her hat and put it back on her head, mentioning that you\'re not sure her cure took.' );
		MainView.outputText( '\n\nAmily tips her head to the side, smiling in post-coital bliss as she clenches her thighs together to hold in your cum.  "<i>We had better schedule an appointment for your next visit then, hadn\'t we?</i>"' );
		if( !repeat ) {
			MainView.outputText( '\n\n(<b>Nurse RP sex option unlocked for Amily!</b>)' );
		}
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -2 );
		this.amilyPreggoChance();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	SceneLib.registerScene( 'amilyScene', new AmilyScene() );
} );