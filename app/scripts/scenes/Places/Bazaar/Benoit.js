﻿'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, MainView, ItemType, ArmorLib, UseableLib, AppearanceDefs, PregnancyStore, ConsumableLib, PerkLib, Descriptors, CoC, kFLAGS, Utils, StatusAffects, EngineCore ) {
	function Benoit() {
	}

	//Fen, you'll need a function to determine gendered pronouns and version of name for this character. I've formatted all the eligible places I found in the order of [male/female]. -Z;
	Benoit.prototype.benoitMF = function( stringM, stringF ) {
		if( CoC.flags[ kFLAGS.BENOIT_STATUS ] === 1 || CoC.flags[ kFLAGS.BENOIT_STATUS ] === 2 ) {
			return stringF;
		}
		return stringM;
	};
	Benoit.prototype.benoitLover = function() {
		return CoC.flags[ kFLAGS.BENOIT_TIMES_SEXED_FEMPCS ] >= 2;
	};
	Benoit.prototype.benoitAffection = function( changes ) {
		if( changes !== undefined && changes !== 0 ) {
			CoC.flags[ kFLAGS.BENOIT_AFFECTION ] += changes;
			if( CoC.flags[ kFLAGS.BENOIT_AFFECTION ] > 100 ) {
				CoC.flags[ kFLAGS.BENOIT_AFFECTION ] = 100;
			} else if( CoC.flags[ kFLAGS.BENOIT_AFFECTION ] < 0 ) {
				CoC.flags[ kFLAGS.BENOIT_AFFECTION ] = 0;
			}
		}
		return CoC.flags[ kFLAGS.BENOIT_AFFECTION ];
	};
	Benoit.prototype.benoitKnocksUpPCCheck = function() {
		//Convert old basi's to real basi's!;
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_BASILISK && CoC.player.findPerk( PerkLib.BasiliskWomb ) >= 0 ) {
			CoC.player.knockUpForce( PregnancyStore.PREGNANCY_BENOIT, CoC.player.pregnancyIncubation );
		}
		//Knock up chances:;
		if( (CoC.player.pregnancyType === PregnancyStore.PREGNANCY_OVIELIXIR_EGGS || CoC.player.findPerk( PerkLib.HarpyWomb ) >= 0 || CoC.player.findPerk( PerkLib.Oviposition ) >= 0 || CoC.player.findPerk( PerkLib.BasiliskWomb ) >= 0) && (CoC.player.pregnancyIncubation === 0 || CoC.player.pregnancyType === PregnancyStore.PREGNANCY_OVIELIXIR_EGGS) ) {
			if( CoC.player.findPerk( PerkLib.BasiliskWomb ) >= 0 && CoC.flags[ kFLAGS.BENOIT_TESTED_BASILISK_WOMB ] === 1 ) {
				if( CoC.player.pregnancyType !== PregnancyStore.PREGNANCY_OVIELIXIR_EGGS || CoC.player.pregnancyIncubation === 0 ) {
					CoC.player.knockUp( PregnancyStore.PREGNANCY_BENOIT, PregnancyStore.INCUBATION_BASILISK );
				}
				if( CoC.player.pregnancyIncubation > 0 ) {
					CoC.player.knockUpForce( PregnancyStore.PREGNANCY_BENOIT, CoC.player.pregnancyIncubation );
				}
			} else {
				CoC.player.knockUp( PregnancyStore.PREGNANCY_BASILISK, PregnancyStore.INCUBATION_BASILISK );
			}
		}
	};
	/**
	 Return the 'heaviness' of the pregnancy
	 */
	Benoit.prototype.benoitPreggers = function() {
		if( CoC.flags[ kFLAGS.BENOIT_STATUS ] === 0 ) {
			return false;
		}
		if( CoC.flags[ kFLAGS.FEMOIT_EGGS ] > 0 ) {
			return true;
		}
		return false;
	};
	Benoit.prototype.benoitRegularPreggers = function() {
		if( CoC.flags[ kFLAGS.BENOIT_STATUS ] === 0 ) {
			return false;
		}
		if( CoC.flags[ kFLAGS.FEMOIT_EGGS ] >= 1 && CoC.flags[ kFLAGS.FEMOIT_EGGS ] <= 4 ) {
			return true;
		}
		return false;
	};
	Benoit.prototype.benoitHeavyPreggers = function() {
		if( CoC.flags[ kFLAGS.BENOIT_STATUS ] === 0 ) {
			return false;
		}
		if( CoC.flags[ kFLAGS.FEMOIT_EGGS ] >= 5 && CoC.flags[ kFLAGS.FEMOIT_EGGS ] <= 8 ) {
			return true;
		}
		return false;
	};
	Benoit.prototype.benoitVeryHeavyPreggers = function() {
		if( CoC.flags[ kFLAGS.BENOIT_STATUS ] === 0 ) {
			return false;
		}
		if( CoC.flags[ kFLAGS.FEMOIT_EGGS ] >= 9 && CoC.flags[ kFLAGS.FEMOIT_EGGS ] <= 12 ) {
			return true;
		}
		return false;
	};
	Benoit.prototype.benoitExtremePreggers = function() {
		if( CoC.flags[ kFLAGS.BENOIT_STATUS ] === 0 ) {
			return false;
		}
		if( CoC.flags[ kFLAGS.FEMOIT_EGGS ] >= 13 ) {
			return true;
		}
		return false;
	};
	Benoit.prototype.benoitInClutch = function() {
		if( CoC.flags[ kFLAGS.BENOIT_STATUS ] === 0 ) {
			return false;
		}

		// Benoit enters 'clutch' every 21 days, for 7 days;
		var startDay = CoC.flags[ kFLAGS.FEMOIT_NEXTDAY_EVENT ];
		var currDay = CoC.time.days;
		var diffDays = (currDay - startDay) % 28;
		if( diffDays >= 21 ) {
			return true;
		}
		return false;
	};
	/*
	 Cum to Clutch Equation becomes pregnant with 1 egg by default.
	 She can produce a max clutch of 16 eggs, and a PC can only make her pregnant with up to 12 eggs by cum quantity alone. Elven Bounty gives +1 to both min and max clutch size (so a PC with that perk will give her 2-13 eggs each time they fertilise her), Marae's Gift - Stud gives +2 to both min and max clutch size. These two perks stack.
	 Every 200mls of cum the PC produces above the first 200mls equals 1 extra egg fertilised. So, producing 2 eggs requires 400mls, 3 eggs requires 600mls, etc, all the way to 12 eggs at 2400mls.
	 1-4 Eggs equates to a Regular Pregnancy.
	 5-8 Eggs equates to a Heavy Pregnancy.
	 9-12 Eggs equates to a Very Heavy Pregnancy.
	 13-16 Eggs equates to an Extremely Heavy Pregnancy.
	 */
	Benoit.prototype.benoitKnockUp = function() {
		if( this.benoitPreggers() ) {
			return false;
		}
		if( !this.benoitInClutch() ) {
			return false;
		}

		// Calc the number of eggs;
		var cumQ = CoC.player.cumQ();
		var bounty = (CoC.player.findPerk( PerkLib.ElvenBounty ) >= 0) ? true : false;
		var stud = (CoC.player.findPerk( PerkLib.MaraesGiftStud ) >= 0) ? true : false;
		var alpha = (CoC.player.findPerk( PerkLib.FerasBoonAlpha ) >= 0) ? true : false;
		var eggMod = 0;
		if( bounty ) {
			eggMod += 1;
		}
		if( stud ) {
			eggMod += 2;
		}
		if( alpha ) {
			eggMod += 1;
		}

		var numEggs = cumQ / 200;
		var minEggs = 1 + eggMod;
		if( numEggs > 12 ) {
			numEggs = 12;
		}
		if( numEggs < minEggs ) {
			numEggs = minEggs;
		}

		numEggs += eggMod;
		CoC.flags[ kFLAGS.FEMOIT_EGGS ] = numEggs;
		CoC.flags[ kFLAGS.FEMOIT_INCUBATION ] = 168;
		return true;
	};
	Benoit.prototype.clearBenoitPreggers = function() {
		if( CoC.flags[ kFLAGS.FEMOIT_EGGS ] !== 0 ) {
			CoC.flags[ kFLAGS.FEMOIT_EGGS_LAID ] += CoC.flags[ kFLAGS.FEMOIT_EGGS ];
			CoC.flags[ kFLAGS.FEMOIT_EGGS ] = 0;
			CoC.flags[ kFLAGS.FEMOIT_INCUBATION ] = 0;
			CoC.flags[ kFLAGS.FEMOIT_NEXTDAY_EVENT ] = CoC.time.days; // Cycle 'resets' based off birth day.
		}
	};
	//Introduction Scenes;
	Benoit.prototype.benoitIntro = function() {
		MainView.clearOutput();
		var suggestText = '';
		var suggest = null;
		var womb = null;
		if( CoC.flags[ kFLAGS.TIMES_IN_BENOITS ] === 0 ) {
			MainView.outputText( 'You cautiously approach the stall.  The shadow thrown by its large, overhanging canopy makes it quite difficult to see into its interior, and getting inside is made even more hazardous by the sheer volume of objects which clutter the area around it and hang out of the shelves arranged along its wooden walls.  Everything Mareth has ever created or distilled seems to be here - or at least, everything Mareth has ever thrown out.  Pots, pans, ugly crockery, shelves stuffed with clothing, a spice rack bulging with all manner of suspect-looking potions... you imagine you could probably find anything you\'d ever want in here - or something closely resembling it - if you looked hard enough.' );
			MainView.outputText( '\n\n"<i>Allo?</i>" says a raspy voice from further in the gloom.  "<i>\'Oo is zair?</i>"  You can make out a counter constructed from crates, and a tall, thin shape behind it - a lizan, by the looks of his build and smooth scales.  Something about his shape makes you feel uneasy, though... you shift further in to take a closer look at the stall owner.  He\'s seated in the only area of his shop not taken up by junk, right next to a heap of rugs and robes, and has a fez perched on top of his blunt head.  It\'s when he turns his grey slit eyes to you that you realize what is putting you on edge - it\'s a basilisk!  Panic grips you as you try to wrench your eyes away... which you do, easily.  Curious despite yourself, you look back tentatively.  The creature\'s eyes seem oddly milky, and they seem to be staring beyond you.  Realisation takes hold when you see the white stick balanced carefully on the counter\'s side.' );
			MainView.outputText( '\n\n"<i>Yes, go ahead, stare,</i>" says the basilisk in a long-suffering tone, making you jump. "<i>It is a funny joke, yes?  Believe me, I wake up laughing about it every morning.  At least here zey stare.  In ze mountains, zey are so embarrassed zey can\'t even look at me.  Or at least I assume zey can\'t.</i>"  He straightens his back and sets his jaw.  "<i>\'Owever, my slack-jawed friend, zis is not a freak show.  Zis is Benoit\'s Spectacular Salvage Shop!  So if you are not \'ere to buy or sell salvage... kindly piss off.</i>"' );
			MainView.outputText( '\n\nYou wonder how a blind anything can make it in such a rough and ready place as the Bazaar, but then Benoit curls his claws protectively into what appears to be a pile of robes sitting next to him, which opens dark brown eyes and sets its muzzle on the counter, looking at you plaintively.  The Alsatian buried within the cloth looks to you like a big softy, but you\'re willing to concede the point as made.' );
		} else if( CoC.flags[ kFLAGS.BENOIT_SUGGEST_UNLOCKED ] === 0 && CoC.player.hasVagina() && (CoC.player.inHeat || CoC.player.pregnancyType === PregnancyStore.PREGNANCY_OVIELIXIR_EGGS || CoC.player.findPerk( PerkLib.HarpyWomb ) >= 0 || CoC.player.findPerk( PerkLib.Oviposition ) >= 0) && (CoC.player.pregnancyType === PregnancyStore.PREGNANCY_OVIELIXIR_EGGS || CoC.player.pregnancyIncubation === 0) && CoC.flags[ kFLAGS.BENOIT_STATUS ] === 0 ) {
			if( CoC.flags[ kFLAGS.BENOIT_SUGGEST_UNLOCKED ] === 0 ) {
				this.benoitAndFemPCTalkAboutEggings();
			}
			suggest = this.eggySuggest;
			suggestText = 'Suggest';
		} else if( CoC.flags[ kFLAGS.FEMOIT_NEXTDAY_EVENT_DONE ] === 1 && CoC.flags[ kFLAGS.FEMOIT_NEXTDAY_EVENT ] <= CoC.time.days && CoC.flags[ kFLAGS.BENOIT_STATUS ] === 0 ) {
			this.femoitNextDayEvent();
		} else if( this.benoitInClutch() && CoC.flags[ kFLAGS.FEMOIT_READY_FOR_EGGS ] === 0 && (CoC.flags[ kFLAGS.BENOIT_STATUS ] === 1 || CoC.flags[ kFLAGS.BENOIT_STATUS ] === 2) ) {
			CoC.flags[ kFLAGS.FEMOIT_READY_FOR_EGGS ]++;
			MainView.outputText( 'As you enter the stall Benoite looks up; though her blind, milky eyes make her harder to read, she looks excited. "<i>Ah! [name]; it iz good you are here... I had hope zat you would come for a vizit today.</i>"' );
			MainView.outputText( '\n\nShe stands up somewhat nervously, and you realize that her stomach is visibly bulging, her typical outfit straining slightly to cover the bulk of her midriff. She pats it with a timid sense of pride. "<i>I am wiz clutch. My womb, it haz created eggz, and zey are ready to be fertilized.  I... I could be a mother now. I-if I could find myzelf a willing partner...</i>" She trembles, despite herself; it\'s clear that the idea of going from lone male to expectant mother in the space of a few days is a bit much for the basilisk.' );
			MainView.outputText( '\n\nYou ask if she\'s sure she\'s ready for this. Benoite stiffens her spine and draws herself up proudly. "<i>I am ready. If it is your nerve zat is weak, well... I will be with eggs for anozer few days. After that, I won\'t be wizzem again for zome weeks. I can wait until you are ready, if you need.</i>"' );
		} else if( this.benoitPreggers() && CoC.flags[ kFLAGS.FEMOIT_INCUBATION ] < 0 ) {
			// Missed it by a week;
			if( CoC.flags[ kFLAGS.FEMOIT_INCUBATION ] < -168 ) {
				MainView.outputText( 'When you enter the stall, you notice that Benoite\'s stomach is flat again. She gives you a toothy grin when you enter her stall. "<i>I have good newz [name]! You are a fazer! ' + String( CoC.flags[ kFLAGS.FEMOIT_EGGS ] ) + ' timez over in fact! Oh I wish zat you could have helped; but I was ztrong, ztrong enough get through it on my own.</i>" she gushes, speaking at a mile-a-minute. She\'s clearly pleased with herself; and your virility.' );
				MainView.outputText( '\n\nShe takes a moment to compose herself, still giddy with the prospect of potentially finding the answer that could save her people; although the means might not be quite what she had in mind, she seems to be taking to the situation with gusto.' );
				MainView.outputText( '\n\nThe world continues on though, and she has a shop to run after all; especially if she wants to provide for the hungry mouths that will soon demand her attention.' );
				MainView.outputText( '\n\n"<i>Zo [name],</i>" she starts, still a hint of excited energy prevalent in her voice, "<i>what can Benoite azzist you wiz?</i>"' );
				this.clearBenoitPreggers();
				CoC.flags[ kFLAGS.FEMOIT_NEXTDAY_EVENT ] -= 7;
			} else {
				this.femoitBirths();
				return;
			}
		} else if( !this.benoitInClutch() && !this.benoitPreggers() && (CoC.time.days - CoC.flags[ kFLAGS.FEMOIT_NEXTDAY_EVENT ] >= 30) && (CoC.flags[ kFLAGS.BENOIT_STATUS ] > 0) ) {
			if( CoC.flags[ kFLAGS.FEMOIT_FIRST_CLUTCH_MISSED ] === 0 ) {
				CoC.flags[ kFLAGS.FEMOIT_FIRST_CLUTCH_MISSED ]++;
				MainView.outputText( 'When you enter the stall, you are greeted by the smell of something cooking. Investigating further brings you to the blind basilisk\'s small kitchen, where she is busy frying something. Her nose preoccupied with her meal, she doesn\'t realize you\'re approaching until you touch her shoulder, yelping in shock.' );
				MainView.outputText( '\n\n"<i>Don\'t do zat!</i>" she complains when she recognizes it\'s you. "<i>I almost brained you with zis skittle.</i>"' );
				MainView.outputText( '\n\nYou ask her what she\'s making.' );
				MainView.outputText( '\n\n"<i>My lunch; an omlette,</i>" she says.' );
				MainView.outputText( '\n\nYour eyes are drawn almost magnetically to her now flat-again stomach and the realization sinks in just where she got the eggs. You ask how she could have done such a thing.' );
				// MainView.outputText('\n\n"<i>What? Zey were never fertilised, so, waste not want not.</i>" she shrugs. When you protest that they could have been her children, she gives you a blank look - though you imagine being blind helps a lot in that regard. "</i>The, how you say, groinal bleeding of mammal girls could have been their children too; do they get upset about it?</i>" she asks as a hint of mischievousness sneaks into her smirk. "<i>Want some?</i>" she innocently asks, offering you the skillet.');;
				MainView.outputText( '\n\n"<i>Do what exza- oh. Ooh. Aha, mon Dieu, [name]!</i>" Benoite chokes out between a mix of chortles and guffaws. "<i>Non [name], I know what it iz zat you are zinking. Aha,</i>" she continues whilst still half laughing, but manages to calm herself down after a short pause, trying to return to some degree of seriousness. "<i>I am just hungry. I am, how you say, having a craving for zees strange items one of my zuppliers has been selling lately. \'Cheeken eggz\'? I guess my body knowz what it needs to replenish zat which it has lost?</i>"' );
				MainView.outputText( '\n\nShe pats her midriff and you start to put the pieces together. "<i>Oh. Oooh,</i>" you mumble back as a response.' );
				//MainView.outputText('\n\nYou turn her offer down and explain you came here for something else.');;
			} else {
				MainView.outputText( 'The flat-bellied basilisk is tucking away into a plate laden with a heavy omlette when you arrive.' );
				MainView.outputText( '\n\n"<i>Ah, [name]! What can I azzist you wiz?</i>"' );
			}
		} else {
			//Subsequent Visit, Affection 0-10: ;
			if( this.benoitAffection() <= 10 ) {
				MainView.outputText( 'Once again, you carefully enter the gloom of Benoit\'s salvage shop.  The proprietor sniffs the air as you enter, and then looks at you sourly.  "<i>Well?</i>" he rasps.' );
			}//Benoit reacts after fucking the PC.;
			else if( CoC.flags[ kFLAGS.BENOIT_TIMES_SEXED_FEMPCS ] === 1 && CoC.flags[ kFLAGS.BENOIT_POST_FIRSTFUCK_TALK ] === 0 ) {
				this.firstTimeAfterBoningEncounterBenoit();
			} else if( this.benoitAffection() < 35 ) {
				MainView.outputText( 'Once again, you carefully enter the gloom of Benoit\'s salvage shop.  The proprietor sniffs the air as you enter, and then relaxes in his seat.  "<i>Allo again, ' + CoC.player.short + '.  What brings you \'ere?</i>"' );
			}//Subsequent Visit, Affection 35+ but pre-lover/pre-fem: ;
			else {
				MainView.outputText( 'Once again, you carefully enter the gloom of ' + this.benoitMF( 'Benoit', 'Benoite' ) + '\'s salvage shop.  The proprietor sniffs the air as you enter, and then smiles widely.  "<i>If it isn\'t my favorite customer!  Do not \'ang around out zere, [name]; please, come in and let us, \'ow you say, chew ze fat.</i>"' );
				// Preggers stuff;
				if( this.benoitInClutch() && !this.benoitPreggers() ) {
					MainView.outputText( '\n\nAn obvious bulge in the female basilisk\'s apron-clad belly signals the presence of new eggs. If you were to have sex with her in this state then there\'s a good chance she\'ll end up with a belly full of fertilized eggs.' );
				} else if( this.benoitRegularPreggers() ) {
					MainView.outputText( '\n\nThe basilisk\'s belly bulges out, big as any pregnant woman back home. Her apron merely highlights the fact she\'s carrying the eggs you fathered.' );
				} else if( this.benoitHeavyPreggers() ) {
					MainView.outputText( '\n\nBenoite\'s pregnancy is unmistakable, and the number of eggs she\'s carrying is quite impressive. Her apron is strained to the limit to contain her distended belly, and you wonder how she manages to tie it up each morning.' );
				} else if( this.benoitVeryHeavyPreggers() ) {
					MainView.outputText( '\n\nThe basilisk\'s belly is hugely swollen with fertilized eggs, and you notice that she tries to avoid moving unless she has to. She\'s so bloated that she has given up trying to tie her apron on, and instead lets it flap idly on her engorged midriff.' );
				} else if( this.benoitExtremePreggers() ) {
					MainView.outputText( '\n\nYou can hardly believe just how pregnant Benoite is - you wouldn\'t have imagined it was possible to carry that many fertilized eggs. She\'s practically immobile, and when she does get up and shuffle along, her belly nearly drags along the ground; it\'s that swollen with your young. Needless to say, practicality demands she goes around naked.' );
				}
			}
		}
		if( CoC.flags[ kFLAGS.BENOIT_SUGGEST_UNLOCKED ] > 0 && CoC.player.hasVagina() && CoC.flags[ kFLAGS.BENOIT_STATUS ] === 0 ) {
			suggest = this.eggySuggest;
			suggestText = 'Suggest';
		}
		if( CoC.player.hasCock() && CoC.flags[ kFLAGS.BENOIT_STATUS ] > 0 && CoC.player.lust >= 33 ) {
			suggest = this.femoitSexIntro;
			suggestText = 'Sex';
		}
		CoC.flags[ kFLAGS.TIMES_IN_BENOITS ]++;
		if( CoC.flags[ kFLAGS.BENOIT_WOMB_TALK_UNLOCKED ] === 1 && CoC.player.findPerk( PerkLib.BasiliskWomb ) < 0 && CoC.flags[ kFLAGS.BENOIT_TESTED_BASILISK_WOMB ] === 0 && CoC.flags[ kFLAGS.BENOIT_STATUS ] === 0 ) {
			womb = this.tryToConvertToBassyWomb;
		}
		var fem;
		if( CoC.flags[ kFLAGS.FEMOIT_UNLOCKED ] === 1 && CoC.flags[ kFLAGS.BENOIT_STATUS ] === 0 ) {
			// Only available if the player hasn't since fucked Benoit after unlocking the option.;
			if( CoC.flags[ kFLAGS.BENOIT_TIMES_SEXED_FEMPCS ] === 0 ) {
				fem = this.benoitFeminise;
			}
		}
		EngineCore.choices( 'Buy', this, this.benoitsBuyMenu, 'Sell', this, this.benoitSellMenu, 'Talk', this, this.talkToBenoit, suggestText, this, suggest, 'Basil. Womb', this, womb,
			'Feminize', this, fem, '', null, null, '', null, null, '', null, null, 'Leave', SceneLib.bazaar, SceneLib.bazaar.enterTheBazaar );
	};
	//Buy or Sell First Time, only if prelover/prefem: You ask him what the deal is with his shop.;
	Benoit.prototype.buyOrSellExplanationFirstTime = function() {
		CoC.flags[ kFLAGS.BENOIT_EXPLAINED_SHOP ]++;
		MainView.outputText( '"<i>If you can see something you want in Benoit\'s Spectacular Salvage Shop, and you can walk away with it, it\'s yours,</i>" replies Benoit, theatrically sweeping his claw to take in the entirety of his stall but almost knocking over a birdcage.  "<i>Assuming you can pay whatever I\'ve decided it\'s worth, of course.  If you want to unload your garbage \'ere?  Zis is also fine.  I cannot pay what ze fat cats in Tel\'Adre can, though.  Check back every day; ze Spectacular Salvage Shop always \'as new zings to sell.</i>"' );
	};
	Benoit.prototype.benoitsBuyMenu = function() {
		MainView.clearOutput();
		if( CoC.flags[ kFLAGS.BENOIT_1 ] === 0 ) {
			this.updateBenoitInventory();
		}
		if( CoC.flags[ kFLAGS.BENOIT_EXPLAINED_SHOP ] === 0 ) {
			this.buyOrSellExplanationFirstTime();
		}
		var buyMod = 2;
		if( CoC.flags[ kFLAGS.BENOIT_STATUS ] === 1 ) {
			buyMod = 1.66;
			MainView.outputText( '"<i>Some may call zis junk,</i>" says Benoite, indicating her latest wares.  "<i>Me... I call it garbage.</i>"' );
		} else {
			MainView.outputText( '"<i>Some may call zis junk,</i>" says Benoit, indicating his latest wares.  "<i>Me... I call it garbage.</i>"' );
		}
		MainView.outputText( '\n\n<b><u>' + this.benoitMF( 'Benoit', 'Benoite' ) + '\'s Prices</u></b>', false );
		MainView.outputText( '\n' + ItemType.lookupItem( CoC.flags[ kFLAGS.BENOIT_1 ] ).longName + ': ' + Math.round( buyMod * ItemType.lookupItem( CoC.flags[ kFLAGS.BENOIT_1 ] ).value ) );
		MainView.outputText( '\n' + ItemType.lookupItem( CoC.flags[ kFLAGS.BENOIT_2 ] ).longName + ': ' + Math.round( buyMod * ItemType.lookupItem( CoC.flags[ kFLAGS.BENOIT_2 ] ).value ) );
		MainView.outputText( '\n' + ItemType.lookupItem( CoC.flags[ kFLAGS.BENOIT_3 ] ).longName + ': ' + Math.round( buyMod * ItemType.lookupItem( CoC.flags[ kFLAGS.BENOIT_3 ] ).value ) );
		EngineCore.choices( CoC.flags[ kFLAGS.BENOIT_1 ], null, EngineCore.createCallBackFunction( this, this.benoitTransactBuy, 1 ),
			CoC.flags[ kFLAGS.BENOIT_2 ], null, EngineCore.createCallBackFunction( this, this.benoitTransactBuy, 2 ),
			CoC.flags[ kFLAGS.BENOIT_3 ], null, EngineCore.createCallBackFunction( this, this.benoitTransactBuy, 3 ),
			'', null, null, 'Back', this, this.benoitIntro );
	};
	Benoit.prototype.benoitSellMenu = function() {
		MainView.clearOutput();
		if( CoC.flags[ kFLAGS.BENOIT_EXPLAINED_SHOP ] === 0 ) {
			this.buyOrSellExplanationFirstTime();
		} else {
			MainView.outputText( '"<i>Let us feel what you are trying to palm off upon me zis time, zen,</i>" sighs Benoit' + this.benoitMF( '', 'e' ) + ', sitting down and opening ' + this.benoitMF( 'his', 'her' ) + ' hand to you.' );
		}
		var sellMod = 3;
		if( CoC.flags[ kFLAGS.BENOIT_EGGS ] > 0 || CoC.flags[ kFLAGS.BENOIT_STATUS ] !== 0 ) {
			sellMod = 2;
		}
		MainView.outputText( '\n\n<b><u>Benoit' + this.benoitMF( '', 'e' ) + '\'s Estimates</u></b>' );
		EngineCore.menu();
		var totalItems = 0;
		for( var slot = 0; slot < 5; slot++ ) {
			if( CoC.player.itemSlots[ slot ].quantity > 0 && Math.ceil( CoC.player.itemSlots[ slot ].itype.value / sellMod ) >= 1 ) {
				MainView.outputText( '\n' + Math.ceil( CoC.player.itemSlots[ slot ].itype.value / sellMod ) + ' gems for ' + CoC.player.itemSlots[ slot ].itype.longName + '.' );
				EngineCore.addButton( slot, (CoC.player.itemSlots[ slot ].itype.shortName + ' x' + CoC.player.itemSlots[ slot ].quantity), EngineCore.createCallBackFunction2( this, this.benoitSellTransact, slot, sellMod ) );
				totalItems += CoC.player.itemSlots[ slot ].quantity;
			}
		}
		if( totalItems > 1 ) {
			EngineCore.addButton( 7, 'Sell All', null, EngineCore.createCallBackFunction2( this, this.benoitSellAllTransact, totalItems, sellMod ) );
		}
		EngineCore.addButton( 9, 'Back', this, this.benoitIntro );
	};
	Benoit.prototype.benoitTransactBuy = function( slot ) {
		if( slot === undefined ) {
			slot = 1;
		}
		MainView.clearOutput();
		var itype;
		var buyMod = 2;
		if( CoC.flags[ kFLAGS.BENOIT_STATUS ] === 1 ) {
			buyMod = 1.66;
		}

		if( slot === 1 ) {
			itype = ItemType.lookupItem( CoC.flags[ kFLAGS.BENOIT_1 ] );
		} else if( slot === 2 ) {
			itype = ItemType.lookupItem( CoC.flags[ kFLAGS.BENOIT_2 ] );
		} else {
			itype = ItemType.lookupItem( CoC.flags[ kFLAGS.BENOIT_3 ] );
		}
		if( CoC.player.gems < Math.ceil( buyMod * itype.value ) ) {
			MainView.outputText( 'You consider making a purchase, but you lack the gems to go through with it.' );
			EngineCore.doNext( this, this.benoitsBuyMenu );
			return;
		}
		if( this.benoitLover() ) {
			MainView.outputText( 'After examining what you\'ve picked out with ' + this.benoitMF( 'his', 'her' ) + ' fingers, ' + this.benoitMF( 'Benoit', 'Benoite' ) + ' hands it over and accepts your gems with a grin.' );
		} else {
			MainView.outputText( 'After examining what you\'ve picked out with ' + this.benoitMF( 'his', 'her' ) + ' fingers, ' + this.benoitMF( 'Benoit', 'Benoite' ) + ' hands it over, names the price and accepts your gems with a curt nod.\n\n' );
		}
		//(+3 Affection);
		this.benoitAffection( 3 );
		CoC.player.gems -= Math.ceil( buyMod * itype.value );
		MainView.statsView.show();
		SceneLib.inventory.takeItem( itype, this.benoitsBuyMenu );
	};
	Benoit.prototype.benoitSellTransact = function( slot, sellMod ) {
		MainView.clearOutput();
		if( this.benoitLover() ) {
			MainView.outputText( 'Benoit' + this.benoitMF( '', 'e' ) + ' gives your object the briefest of goings-over with ' + this.benoitMF( 'his', 'her' ) + ' fingers before stowing it away and handing over your gem reward with a trusting smile.' );
		} else {
			MainView.outputText( 'Following a painstaking examination of what you\'ve given him with his hands and nose, Benoit grudgingly accepts it and carefully counts out your reward.' );
		}
		CoC.player.gems += Math.ceil( CoC.player.itemSlots[ slot ].itype.value / sellMod );
		CoC.player.itemSlots[ slot ].removeOneItem();
		MainView.statsView.show();
		//(+1 Affection);
		this.benoitAffection( 1 );
		EngineCore.doNext( this, this.benoitSellMenu );
	};
	Benoit.prototype.benoitSellAllTransact = function( totalItems, sellMod ) {
		MainView.clearOutput();
		var itemValue = 0;
		for( var slot = 0; slot < 5; slot++ ) {
			if( CoC.player.itemSlots[ slot ].quantity > 0 && Math.ceil( CoC.player.itemSlots[ slot ].itype.value / sellMod ) >= 1 ) {
				itemValue += CoC.player.itemSlots[ slot ].quantity * Math.ceil( CoC.player.itemSlots[ slot ].itype.value / sellMod );
				CoC.player.itemSlots[ slot ].quantity = 0;
			}
		}
		if( this.benoitLover() ) {
			MainView.outputText( 'Benoit' + this.benoitMF( '', 'e' ) + ' gives your objects the briefest of goings-over with ' + this.benoitMF( 'his', 'her' ) + ' fingers before stowing them away and handing over your ' + Utils.num2Text( itemValue ) + ' gem reward with a trusting smile.' );
		} else {
			MainView.outputText( 'Following a painstaking examination of the items you\'ve given him with his hands and nose, Benoit grudgingly accepts them and carefully counts out your ' + Utils.num2Text( itemValue ) + ' gem reward.' );
		}
		CoC.player.gems += itemValue;
		MainView.statsView.show();
		//(+1 Affection per item);
		this.benoitAffection( totalItems );
		EngineCore.doNext( this, this.benoitIntro );
	};
	//All slots are reset each day.  Benoit buys items at 66% the rate Oswald does.  ;
	Benoit.prototype.updateBenoitInventory = function() {
		//Slot 1 Any one of the following: Incubus Draft, Minotaur Blood, Minotaur Cum, Equinuum, Black Pepper, Vitalitea, Scholar's Tea, Double Pepper;
		CoC.flags[ kFLAGS.BENOIT_1 ] = Utils.randomChoce(
			ConsumableLib.INCUBID.id,
			ConsumableLib.MINOBLO.id,
			ConsumableLib.MINOCUM.id,
			ConsumableLib.EQUINUM.id,
			ConsumableLib.BLACKPP.id,
			ConsumableLib.SMART_T.id,
			ConsumableLib.VITAL_T.id,
			ConsumableLib.DBLPEPP.id
		);
		//If the player discarded a unique item, the first time they arrive at the Salvage Shop after a week has passed it will appear in Slot 1.;
		if( Utils.rand( 10 ) === 0 ) {
			CoC.flags[ kFLAGS.BENOIT_1 ] = ConsumableLib.GODMEAD.id;
		}
		//Slot 2 Any one of the following: Succubus Milk, Whisker Fruit, Wet Cloth, Golden Seed, LaBova, Snake Oil, Pink Gossamer, Black Gossamer;
		CoC.flags[ kFLAGS.BENOIT_2 ] = Utils.randomChoce(
			ConsumableLib.SUCMILK.id,
			ConsumableLib.W_FRUIT.id,
			ConsumableLib.WETCLTH.id,
			ConsumableLib.GLDSEED.id,
			ConsumableLib.LABOVA_.id,
			ConsumableLib.SNAKOIL.id,
			ConsumableLib.S_GOSSR.id,
			ConsumableLib.B_GOSSR.id
		);

		//There is a 4% chance the following items will appear in Slot 2: Bimbo Liqueur, Large Pink Egg, Large Blue Egg, Bro Brew, T. Shark Tooth.;
		if( Utils.rand( 100 ) < 4 ) {
			CoC.flags[ kFLAGS.BENOIT_2 ] = Utils.randomChoce(
				ConsumableLib.BIMBOLQ.id,
				ConsumableLib.L_PNKEG.id,
				ConsumableLib.L_BLUEG.id,
				ConsumableLib.BROBREW.id,
				ConsumableLib.TSTOOTH.id
			);
		}
		//Slot 3 Any one of the following: Maid's Clothes, Wizard Robes, Tough Silk, Slutty Swimwear, Goo Chunk, Chitin Plate;
		CoC.flags[ kFLAGS.BENOIT_3 ] = Utils.randomChoce(
			ArmorLib.W_ROBES.id,
			UseableLib.T_SSILK.id,
			ArmorLib.S_SWMWR.id,
			UseableLib.GREENGL.id,
			UseableLib.B_CHITN.id
		);

		if( Utils.rand( 10 ) === 0 ) {
			//There is a 10% chance the following items will appear in Slot 3: Bondage Straps, Nurse Outfit, Red Party Dress;
			CoC.flags[ kFLAGS.BENOIT_3 ] = Utils.randomChoce(
				ArmorLib.BONSTRP.id,
				ArmorLib.NURSECL.id
			);
		}
		//Slot 4 Herbal Contraceptive - 30 gems.  Only becomes available through PC fem path.  Reduces fertility by 90% for a week if taken.;
	};

	//Talk;
	Benoit.prototype.talkToBenoit = function() {
		MainView.clearOutput();
		//(+5 Affection per day if used);
		if( CoC.flags[ kFLAGS.BENOIT_TALKED_TODAY ] === 0 ) {
			CoC.flags[ kFLAGS.BENOIT_TALKED_TODAY ] = 1;
			this.benoitAffection( 5 );
		}
		//Basilisk Womb;
		//Requires: Had sex with Benoit at least twice, have vagina, select talk;
		if( ((CoC.flags[ kFLAGS.BENOIT_TIMES_SEXED_FEMPCS ] > 2 && CoC.player.inte >= 60 && CoC.flags[ kFLAGS.BENOIT_WOMB_TALK_UNLOCKED ] === 0) || CoC.flags[ kFLAGS.BENOIT_TIMES_SEXED_FEMPCS ] === 2) && CoC.player.hasVagina() ) {
			MainView.outputText( 'You ask ' + this.benoitMF( 'Benoit', 'Benoite' ) + ' if ' + this.benoitMF( 'he', 'she' ) + ' has ever thought about trying to do something to help his people\'s plight.' );
			MainView.outputText( '\n\nThe basilisk is silent for a time, running his claws along the counter pensively.  "<i>Yes,</i>" he says eventually, in a quiet tone.  "<i>I \'ave.  Away from ze mountains, I \'ave \'ad time to sink.  I am not ze demons\' slave anymore, and I am a funny joke of a basilisk anyway, so I \'ave often thought about... making certain zacrifices.  If we \'ad just one female, away from zeir corruption, zen...</i>" he trails off, sighing heavily before smiling ruefully at you.  "<i>Zose were ze kind of soughts I \'ad before I met you.  Crazy, yes?  Even more crazy to be still sinking zem when a good woman is giving me \'er love for no reason except through ze kindness of \'er \'art.  Still... it is so frustrating, being able to sink clearly about zese sings and not being able to do anysing about it.</i>"' );
			if( CoC.player.inte >= 60 ) {
				MainView.outputText( '\n\nYour mind wanders.  You doubt that even if you wanted to you could turn into a basilisk proper, but you wonder if there\'s some kind of transformation that would allow a human womb to mimic that of another race.' );
				MainView.outputText( '\n\nBenoit answers warily.  "<i>A double dose of ovi-elixer, a bottle of reptilum, goblin ale and some basilisk blood would probably do... if you were so minded.  But, [name], tell me you\'re not going to do somesing so reckless as experiment on your body?</i>"' );
				//toggle on 'Bas. Womb' from benoit's main menu.;
				CoC.flags[ kFLAGS.BENOIT_WOMB_TALK_UNLOCKED ] = 1;
				MainView.outputText( '\n\n(<b>Basilisk Womb option enabled in Benoit\'s menu!</b>)' );
			} else {
				MainView.outputText( '\n\nYou rack your brain but can\'t think of anything that could help Benoit, so you end up simply sympathising with him.  "<i>Do not beat yourself up over it,</i>" says the basilisk, touching the tips of your fingers and smiling warmly.  "<i>It is just foolishness.  And anyway, I told you: we are a race of bastards.  We are ze last guys who deserve someone sinking after us.</i>"' );
				//don't trigger event again until the PC is smart enough!;
			}
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		}
		//First time Talk: ;
		else if( CoC.flags[ kFLAGS.BENOIT_TALKED_TO_PROPERLY ] === 0 ) {
			CoC.flags[ kFLAGS.BENOIT_TALKED_TO_PROPERLY ]++;
			MainView.outputText( 'You take a moment to look the strange merchant over.  Although blind, he doesn\'t seem very old - he retains the tight, thin muscular frame of other basilisks you\'ve seen, but looks to be slightly shorter and for all his proud, cruel profile seems slightly shabby around the edges.  In what is presumably a nod towards civilized manners, he is wearing a pair of denim long johns as well as his fez, perched upon one of his head spines.  You introduce yourself, and then decide to ask him about basilisks.' );
			MainView.outputText( '\n\n"<i>We were a proud race once,</i>" sighs Benoit.  "<i>A noble race, who carried our \'eads \'igh, and...</i>" the blind basilisk bursts into throaty laughter, which eventually subsides into a coughing fit.  You watch, bemused.  "<i>Hahaha!  Aha.  Sorry.  No, we were always a race of egg-thieving bastards.  The lizans,</i>" he flicks his snout in the general direction of the bonfire with disdain, "<i>absolutely \'ate us.  Zey drove us to live in ze mountains, far away from zeir precious clutches, to live like savages.  \'Ze family with ze evil eye over it\', zat\'s what zey call us.  Eh... in basilisk it\'s more snappy.</i>"  Benoit pauses, running his fingers over the counter ruminatively.  "<i>But it wasn\'t so bad, up zair.  We kept ze harpies under control, and we collected scrap, sold it to zose who were brave enough to trade blindfolded.  We\'ve always been good at zat.  Zen ze demons came to ze mountains.</i>"' );
			MainView.outputText( '\n\nHe shrugs. "<i>What were we going to do?  Go down and throw ourselves on the mercy of the races \'oo despise us?  Ze demons offered to set us high in zeir service, augment our natural abilities if we agreed to help zem.  I suppose zey did, at zat.</i>"  Benoit scratches a long groove in his counter, trembling with anger.  "<i>By making us all male zey made sure we are always fixated on finding egg bearers, on keeping ze harpies down, and bringing scrap and statues to zem so zey don\'t do anysing worse to us.  We are just a brainless natural defence to zem now, in zeir mountain hideaways.  Don\'t go up ze mountain or ze evil basilisks will get you!  Bastards.  Bastards.</i>"  Benoit finishes mutilating the wood in front of him and sighs.  "<i>But zat is by ze by.  Are you going to buy sumsing or not?</i>"' );
		}
		// First time Femoit talk;
		else if( CoC.flags[ kFLAGS.FEMOIT_TALKED_TO ] === 0 && CoC.flags[ kFLAGS.BENOIT_STATUS ] !== 0 ) {
			CoC.flags[ kFLAGS.FEMOIT_TALKED_TO ]++;
			MainView.outputText( 'You ask Benoite if she intends to go back to the mountains now.  She laughs long and hard at this.  One thing the transformation has certainly gifted her is an extraordinarily filthy laugh.' );
			MainView.outputText( '\n\n"<i>Oh [name], you are so silly,</i>" she says fondly.  "<i>\'Ow long do you sink a blind female basilisk would last up zair, eh?  If I was really lucky ze minotaurs would get me before ze demons did.  No, I will stay ere.  Ze uzzer basilisks, I cannot trust zem - zey are always exposed to ze corruption, some of zem even like it.  I will lay eggs far away from zere, I will raise my children to be different; away from ze corruption and with equal numbers of males and females, it will be different.  Zere are many empty places in zis world now zey can go to and be left alone.</i>"  She pauses. "<i>Or at least zese sings will \'appen once I work up ze courage to find a, er, donor.</i>"' );
			if( !CoC.player.hasCock() ) {
				MainView.outputText( 'You ask if she\'s had any thoughts on that front.  "<i>Not really,</i>" Benoite sighs.  "<i>I \'ave many male customers but zey all \'ave - \'ow you say? Rough round edges.  You now \'ow it is, [name], all men are pigs.</i>"  You both laugh at this.  "<i>I will find someone though, don\'t worry.  As I said before...</i>" she points two fingers at her blind eyes and then at the stall entrance.  There\'s a distinct gleam in those cloudy grey depths you think would scare the hell out of most things with a penis.  "<i>I \'ave a purpose now.</i>"' );
			} else {
				MainView.outputText( '\n\nYou ask if she\'s had any thoughts on that front. "<i>Well, I do \'ave zis one customer \'oo seems very kind.  And \'oo knows me a great deal better zan anyone else around \'ere,</i>" Benoite mumbles, twiddling her fingers.  "<i>But zis person \'as already done a great deal for me, so I don\'t know if... per\'aps zis is asking too much. I will find someone though, never fear.  As I said before...</i>” Benoite points two fingers at her blind eyes and then at the stall entrance.  There’s a distinct gleam in those cloudy grey depths you think would scare the hell out of most things with a penis. “<i>I ‘ave a purpose now.</i>' );
				EngineCore.menu();
				EngineCore.doYesNo( this, this.femoitFirstTimeYes, this, this.femoitFirstTimeNo );
			}
			return;
		} else if( CoC.flags[ kFLAGS.BENOIT_TALKED_TO_PROPERLY ] !== 0 && this.benoitAffection() >= 40 && CoC.flags[ kFLAGS.BENOIT_TIMES_SEXED_FEMPCS ] === 0 && CoC.flags[ kFLAGS.FEMOIT_UNLOCKED ] === 0 ) {
			this.femoitInitialTalk();
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		//Subsequent Talk;
		else {
			var choice;
			/* BUILD ZE CHOICES!*/
			var choices = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
			//option 9 is non-lover non-fem only;
			if( !this.benoitLover() && this.benoitMF( 'he', 'she' ) === 'he' ) {
				choices[ choices.length ] = 9;
			}
			//Special male benoit fucker only talks;
			if( this.benoitLover() && this.benoitMF( 'he', 'she' ) === 'he' && CoC.player.hasVagina() ) {
				choices[ choices.length ] = 10;
				choices[ choices.length ] = 11;
				choices[ choices.length ] = 12;
				choices[ choices.length ] = 13;
			}
			// Femoit specials;
			if( CoC.flags[ kFLAGS.BENOIT_STATUS ] !== 0 ) {
				choices.push( 14 );
				choices.push( 15 );
				if( this.benoitLover() ) {
					choices.push( 16 );
				}
			}
			//trace('BENOIT CHOICE: ' + choice);;
			//Pick one and go!;
			choice = choices[ Utils.rand( choices.length ) ];
			//(Randomly generated);
			if( choice === 0 ) {
				MainView.outputText( 'You ask if all basilisks talk as ' + this.benoitMF( 'he', 'she' ) + ' does.' );
				MainView.outputText( '\n\n"<i>Only on zis side of ze mountain,</i>" comes the reply.  "<i>Ze uzzer side are all stuck-up snobs who speak \'orribly.  Zey are all pale and flabby too, and zeir cooking is terrible.  Pwah!</i>"  ' + this.benoitMF( 'He', 'She' ) + ' makes an exasperated gesture with a claw.' );
			} else if( choice === 1 ) {
				MainView.outputText( 'You ask ' + this.benoitMF( 'Benoit', 'Benoite' ) + ' about the dog.' );
				MainView.outputText( '\n\n"<i>Pierre \'asn\'t been giving you trouble, as \'e?  Big stupid mutt does not know \'is mouth from \'is arse.  Which is why \'e checks so often,</i>" says the basilisk fondly, rubbing the Alsatian behind his ear.  "<i>I found \'im prowling around eating scraps from ze food sellers when I first got ere; I sink \'e must \'ave belonged to anuzzer trader \'oo left him behind.  I do not sink I could run this shop without him - every evening I go out into the wilds with him and \'unt down more salvage.  \'Ee is so good at finding perfectly good sings other people \'ave left behind.  Particularly cloze.  \'E loves robes, Pierre.  Don\'t you, boy?</i>"  Pierre whines.' );
			} else if( choice === 2 ) {
				MainView.outputText( 'You ask ' + this.benoitMF( 'him', 'her' ) + ' about the sign above the shop.' );
				MainView.outputText( '\n\n"<i>It\'s good, isn\'t it?</i>"  the trader says proudly.  "<i>I got a catguy to do it when I first got \'ere and didn\'t know ze language so well.  \'E suggested...</i>"  ' + this.benoitMF( 'He', 'She' ) + ' spreads ' + this.benoitMF( 'his', 'her' ) + ' claws expressively.  "<i>\'Salamander\'s Salubrious Salvage\'.  Because, everyone likes salamanders, and once zey get in and realize I am not a salamander and it is just a play on words, zey would be so entranced by what I am selling zey would not care.</i>"  ' + this.benoitMF( 'Benoit', 'Benoite' ) + ' taps the counter happily.  "<i>In gold print, too!  It is a surprise it has not brought more customers in.</i>"' );
				MainView.outputText( '\n\nYou decide not to disillusion the blind basilisk.' );
			} else if( choice === 3 ) {
				MainView.outputText( 'You ask if ' + this.benoitMF( 'he', 'she' ) + ' has always been blind.' );
				MainView.outputText( '\n\n"<i>I don\'t know,</i>" ' + this.benoitMF( 'he', 'she' ) + ' says. "<i>Ask me what red is.</i>"' );
				MainView.outputText( '\n\nYou ask what red is.' );
				MainView.outputText( '\n\n"<i>\'Ow ze fuck should I know?</i>" the basilisk replies, deadpan.  "<i>Stop asking stupid questions.</i>"' );
				MainView.outputText( '\n\nYou decide not to pursue the subject.' );
			} else if( choice === 4 ) {
				MainView.outputText( 'You ask ' + this.benoitMF( 'Benoit', 'Benoite' ) + ' how ' + this.benoitMF( 'he', 'she' ) + ' got into this line of work.' );
				MainView.outputText( '\n\n"<i>I \'ave always worked with salvage,</i>" ' + this.benoitMF( 'he', 'she' ) + ' shrugs.  "<i>Back in ze mountains I worked in ze magpie room - obviously, because I was no good on ze outside.  You can tell from ze weight of sings, and \'ow zey smell, what it is and \'ow much it is worth.  More zan zat you can tell... what it meant to its last owner.  Zat is ze true worse of an object.</i>"  ' + this.benoitMF( 'He', 'She' ) + ' taps his claws on the counter, lost in thought.  "<i>Ze magpie room is amazing, [name], I wish I could show it to you.  Such good acoustics, filled with ze sound and smell of a thousand pieces of junk - every day a new symphony.  And \'oo would ever steal ze demons\' treasures?  You would \'ave to be mad to try to steal from a hall full of basilisks.  Or blind.</i>"' );
				MainView.outputText( '\n\n' + this.benoitMF( 'He', 'She' ) + ' laughs throatily, then sighs.  "<i>Ah, but it was rotten, really - always a sour note underneath everysing.  A thousand basilisks, driven by nussing but greed and lust.  I got sick of it, being stuck in zat place with zose thoughts, zat \'opeless cycle, and one day ran away.  I took what I could carry and used zat to start up here.  Away from ze mountains, I can zink clearly.  I can say what ze uzzer basilisks only know at ze back of zeir minds.</i>"  ' + this.benoitMF( 'Benoit', 'Benoite' ) + ' slams a fist into the counter, making you jump.  "<i>Don\'t ever make a deal with a demon, [name],</i>" ' + this.benoitMF( 'he', 'she' ) + ' says, voice thick with rage.  "<i>Even when you sink it is a win-win?  Zey will still find a way to fuck you good.</i>"' );
				EngineCore.dynStats( 'cor', -1 );
			} else if( choice === 5 ) {
				MainView.outputText( 'You ask Benoit if ' + this.benoitMF( 'he', 'she' ) + ' can tell you anything about the Bazaar.' );
				MainView.outputText( '\n\n"<i>You are really asking zis question to a blind person?</i>" comes the reply.  "<i>Ok, I will tell you what I know, for what it is worth.  Over zeir by ze fire, I know zeir are lizans having a good time, because zey shout insults when zey get really drunk.  Zey would get violent with me I sink, if it weren\'t for Pierre.  Zeir leader has a big problem with her male hormones, judging from ze way she smells.</i>"  ' + this.benoitMF( 'He', 'She' ) + ' sniggers with a distinct lack of sympathy.  "<i>In ze uzzer direction, I can smell a lot of males together in one place.  Smell like zey are doing something very macho - and a bit painful, from ze sound of zeir walk afterwards.</i>"  ' + this.benoitMF( 'He', 'She' ) + ' points in the opposite direction.  "<i>Zerr are plenty of, ow you say, crumpets who work around here.  Some of zem can do some pretty wild sings for you, for a fee.  Or so I\'m told.</i>"  ' + this.benoitMF( 'He', 'She' ) + ' coughs.' );
			} else if( choice === 6 ) {
				MainView.outputText( 'You ask ' + this.benoitMF( 'Benoit', 'Benoite' ) + ' for any rumors going around.' );
				//[Deep cave cleared: ;
				if( CoC.flags[ kFLAGS.DEFEATED_ZETAZ ] > 0 ) {
					MainView.outputText( '\n\n"<i>Somesing strange did \'appen ze uzzer day, now you mention it,</i>" ' + this.benoitMF( 'he', 'she' ) + ' says, tapping a curved tooth.  "<i>I got a big group of imps in ere.  I normally don\'t serve zem because zey are always stealing sings whilst one of zem is paying, but zese guys seemed too worked up to even sink about lifting ze shop - zey smelt of fear.  Zey were buying lots of food and survival gear - one of zem kept going on and on about ze fact zey left "<i>ze fairy</i>" behind, until one of ze uzzers slapped \'im and said if \'ee didn\'t shut up, \'ee would be ze fairy.</i>"  ' + this.benoitMF( 'Benoit', 'Benoite' ) + ' shrugs.  "<i>Nasty little sings.  Tasty, though.</i>"' );
				}
				//[Factory not cleared: ;
				else if( CoC.player.findStatusAffect( StatusAffects.DungeonShutDown ) < 0 ) {
					MainView.outputText( '\n\n"<i>Not anysing very interesting,</i>" ' + this.benoitMF( 'he', 'she' ) + ' shrugs.  "<i>I get a few customers from ze desert city, Tel\'Adre, coming in \'ere in secret to pick up a few sings zey cannot find back \'ome.  So zey are still a sing.  You \'ave to wonder ow much longer zey can keep hiding, though.</i>"' );
				} else {
					//[Factory destroyed: ;
					if( CoC.player.findStatusAffect( StatusAffects.FactoryOverload ) >= 0 ) {
						MainView.outputText( '\n\n"<i>I don\'t know what is \'appening exactly,</i>" ' + this.benoitMF( 'he', 'she' ) + ' says, leaning over the counter. "<i>But ze demons \'oo I trade with, zey seem very worked up about sumsing.  Sumsing went wrong at one of zeir facilities, I sink.  I also get a number of shark ladies coming in ere, asking if I sell fresh water.  Zey also seem very unhappy.</i>"' );
					} else {
						MainView.outputText( '\n\n"<i>I don\'t know what is \'appening exactly,</i>" ' + this.benoitMF( 'he', 'she' ) + ' says, leaning over the counter.  "<i>But ze demons \'oo I trade with, zey seem very worked up about somesing.  Sumsing went wrong at one of zeir facilities, I sink.  I also hear a number of passers-by talking about ze lake.  Apparently it is much cleaner now; many are going back to use it for water.  Now if only someone could make zose crazy cultists go away, eh?</i>"' );
					}
				}
			} else if( choice === 7 ) {
				MainView.outputText( 'You ask if ' + this.benoitMF( 'he', 'she' ) + '\'s ever had any trouble with the demons who frequent the Bazaar.' );
				MainView.outputText( '\n\n"<i>Not really,</i>" ' + this.benoitMF( 'he', 'she' ) + ' replies.  "<i>I don\'t like zem, but zey are my main source of income.  Zey are always coming in here to sell zeir fluids.  The truth is it\'s worthless - I pour most of ze disgusting stuff away.  But it is worth paying for zeir custom because zey are always buying many more potions.  It isn\'t a good demon party unless you \'ave sprouted two new dicks and four new nipples for it, apparently.  Always one of zem is asking if zey can \'do ze dinosaur\' as way of payment.  I \'ate zem so much.</i>"' );
				if( EngineCore.silly() ) {
					MainView.outputText( '\n\nThe basilisk rubs Pierre behind the ear as ' + this.benoitMF( 'he', 'she' ) + ' thinks.  "<i>I did once get a group of demons coming in ere, asking me what \'cheese omelette\' is in basilisk.  When I told zem, zey ran away laughing, shouting \'Zat is all you can say! Zat is all you can say!\'</i>"  ' + this.benoitMF( 'He', 'She' ) + ' shrugs, irritated.  "<i>Arseholes.</i>"' );
				}
			} else if( choice === 8 ) {
				MainView.outputText( 'You ask ' + this.benoitMF( 'Benoit', 'Benoite' ) + ' what results when basilisks mate with harpies.' );
				MainView.outputText( '\n\n"<i>Most of ze time?  Basilisks,</i>" ' + this.benoitMF( 'he', 'she' ) + ' replies, carefully counting gems with ' + this.benoitMF( 'his', 'her' ) + ' fingers.  "<i>Some of ze time?  \'Arpies.  But ze arpies feed zeir basilisk children to zeir chicks if ze former do not get away in time, so it works out.  Really, we are doing zem and ze world a favor by stealing zeir eggs - if we weren\'t around ze \'ole world would be drowned in guano by now.</i>"  Satisfied with the takings, ' + this.benoitMF( 'he', 'she' ) + ' stows the money away underneath the counter.  "<i>Very rarely, you get cockatrices.  Now ZEY are weird-looking.</i>"' );
			} else if( choice === 9 ) {
				//non-lover non-fem only;
				MainView.outputText( 'You ask if ' + this.benoitMF( 'Benoit', 'Benoite' ) + ' really can tell who you are just by smell.' );
				if( CoC.player.race() === 'human' ) {
					MainView.outputText( '\n\n"<i>Certainly!</i>" ' + this.benoitMF( 'he', 'she' ) + ' smiles.  "<i>Ze smell of shaved monkey is distinctive.  I get very few \'uman customers, you know.</i>"  The basilisk scratches ' + this.benoitMF( 'his', 'her' ) + ' jaw absent-mindedly.  "<i>If you do not mind me saying so, [name], you also smell... different.  Like you do not really belong \'ere.  In ze nicest possible way, of course.</i>"' );
				} else {
					MainView.outputText( '\n\n"<i>Certainly!</i>" ' + this.benoitMF( 'he', 'she' ) + ' smiles.  "<i>Ze smell of shaved monkey is distinctive.  I get very few \'uman customers, you know.</i>"  You look down at yourself, then back at the basilisk suspiciously, before saying you don\'t much look or feel human.  "<i>Oh, I do not doubt zat,</i>" says the trader.  "<i>You \'umans and your flexible genes - zat makes you very alluring, as I am sure you \'ave already noticed, eh?  I am sure somebody \'oo relied upon sight would not be able to tell you are \'uman.  But \'oo you are underneath all zat, zat never changes, and I can smell zat.  All you are doing really is dressing up as something else.  If you wanted to, you could change back tomorrow, if you \'ad ze right ingredienns.</i>"' );
				}
				//[(male Benoit only);
				if( this.benoitMF( 'he', 'she' ) === 'he' ) {
					MainView.outputText( '  There\'s a hint of longing jealousy in the basilisk\'s voice and when he lapses into silence you decide not to push the subject.' );
				}
			}
			//Male Benoit Lover Talk options;
			//(Randomly generated.  Added to normal talk options after PC has had sex with Benoit two times or more regardless of womb quest.);
			else if( choice === 10 ) {
				MainView.outputText( 'You ask Benoit there is anything useful he can tell you about the demon strongholds.' );
				MainView.outputText( '\n\n"<i>I\'m afraid I cannot be very \'elpful zeir, [name],</i>" ' + this.benoitMF( 'he', 'she' ) + ' sighs.  "<i>Unless you want me to tell you what zey smell like.  I do not sink you want to be knowing zis.  Ze demons, zey were not much in ze business of telling us what zeir plans were, and zey did not much like \'anging around us, which is understandable.   Zair is every treasure you can ever imagine in ze magpie room, but zeir is no way you could ever get at zem unless you could work out some way of making many undreds of basilisks close zeir eyes at once.</i>"' );
			} else if( choice === 11 ) {
				MainView.outputText( 'You ask Benoit if he can suggest anything to help you fight his brethren in the high mountains.' );
				MainView.outputText( '\n\n"<i>You could carry a mirror with you,</i>" he says, pointing.  "<i>There\'s one over zair, isn\'t zair?</i>" You report that it is cracked badly - at any rate, you\'re not carrying a bulky mirror up a mountain two or three times a day.  "<i>I will give it to you half price,</i>" he says hopefully.  "<i>Sink \'ow useful it will be to check for transformations!  You could get somebody else to carry it for you... ok, alright, so you don\'t want ze mirror.  Most prey, my bruzzers are expecting zem to lash out in a panic.  So use sings which do not involve approaching.  We do not like magic or ranged sings, zey are too unpredictable - I suggest using zem.</i>"' );
			} else if( choice === 12 ) {
				MainView.outputText( '"<i>Gnoll.</i>"' );
				MainView.outputText( '\n\n You make a gentle humming noise.' );
				MainView.outputText( '\n\n"<i>Bee maiden,</i>" says Benoit after a moment.' );
				MainView.outputText( '\n\nYou stamp your feet and snuffle and snort.' );
				MainView.outputText( '\n\n"<i>Minotaur,</i>" says Benoit immediately.  You sigh - he\'s too good at this game, and you\'re running out of creatures.  Thinking briefly, you make a clop-clopping whilst slapping the counter, throwing in a bit of heavy breathing for good measure.' );
				MainView.outputText( '\n\n"<i>What ze \'ell is zat supposed to be?</i>" says Benoit, looking alarmed.  You tell him it\'s a ' );
				MainView.outputText( 'Unitaur.' );
				MainView.outputText( '\n\n"<i>A what?</i>"' );
				MainView.outputText( '\n\nYou explain that a Unitaur is like a white centaur, only it has a horse\'s face.  It has massively strong human arms though, and it can cast magic better than anyone, and it can go faster than a cheetah, and... you can\'t help yourself and begin to giggle at the expression of terror that has emerged on Benoit\'s face.' );
				MainView.outputText( '\n\n"<i>Oh, I see.  You are pulling my tail.  Very amusing.</i>"  You laugh even harder at the expression of wounded dignity which replaces the terror.' );
			} else if( choice === 13 ) {
				MainView.outputText( 'You ask Benoit if he really, <b>really</b> can tell who you are just by smell.' );
				MainView.outputText( '\n\n"<i>Well, of course I can,</i>" he says teasingly.  "<i>When you end up smelling like someone else for several hours, it is a difficult sing to mistake.  It is a memento of you and it reminds me of \'appiness; I wish I could smell zat way for longer.  My sexy little shaved monkey.</i>"' );
			} else if( choice === 14 ) {
				MainView.outputText( 'You ask Benoite how she’s getting on with being the opposite sex.  Benoite stops cleaning the tarnished silver plate in her hands to think.' );
				MainView.outputText( '\n\n“<i>It is... different,</i>” she says eventually, before laughing at the platitude.  “<i>Ze ‘ole wizzing situation, zis is terrible for instance.  I do not know [name], I am so busy during ze day and it ‘appened so suddenly, it is difficult to properly reflect.  Sometimes I am sinking somesing, like ‘ow somesing smells, and zen I catch myself sinking... would Benoit ‘ave sought zat? Is my perception different because I ‘ave different ‘ormones swirling around my ‘ead?</i>” She turns the plate around in her hands absently. “<i>Zerr are... uzzer sings, too.  Sometimes I am smelling a customer is finding me strange, and I realize I am doing somesing which is... male.  Like, somesing I would never ‘ave sought about before, walking with feet splayed instead of in a line.  A ‘undred and one sings to remember to not stand out.  Zat is wearying.</i>”' );
				if( this.benoitLover() && CoC.player.hasCock() && CoC.player.hasVagina() ) {
					MainView.outputText( '\n\nShe smiles shyly at you. “<i>I am very lucky in one respect zo, because I ‘ave not ‘ad to resink what I find attractive to lie wizz you.  Whatever you ‘ave between your legs you smell and feel female to me, and zat is a comfort.</i>”' );
				} else if( this.benoitLover() && CoC.player.hasCock() && !CoC.player.hasVagina() ) {
					MainView.outputText( 'She smiles shyly at you. “<i>One sing I ‘ave definitely ‘ad to resink is what I find attractive.  I did not find ze male form attractive before, so for my body to... respond... when you are close, zat is when I most feel ze disconnect between my experience and what I am now.  Per’aps zis is also why I ‘ave not sought about it too much; it is better just to rely on instinct.</i>”' );
					MainView.outputText( '\n\nCharming, you say.' );
					MainView.outputText( '\n\nBenoite grins wider at your affected hurt. “<i>Oh do not worry [name], you ‘ave a beautiful personality.  And ow important exactly do you sink your personal appearance is to me?</i>”' );
				} else {
					MainView.outputText( '\n\nShe smiles shyly at you. “<i>Listen to me, ow you say, riveting on.  You I am guessing do not see what ze big fuss is- you ‘umans can chop and change whenever you feel like, so to speak.  Must be nice.</i>”' );
					MainView.outputText( '\n\nYou point out that your mutability is not always an advantage- it can be used against you, and this land is full of types who would be only too keen to do so.' );
					MainView.outputText( '\n\nBenoite nods thoughtfully. “<i>I never sought about it like zat.  Ze demons just love slaves zey can change wizzer a few potions, don’t zey? You are right [name], I will count my blessings in ze future.</i>”' );
				}
			} else if( choice === 15 ) {
				MainView.outputText( '\n\nYou ask Benoite if she isn’t worried that demon customers won’t notice what she is.' );
				MainView.outputText( '\n\n“<i>Zat is why I am wearing zis cunning disguise,</i>” she says, patting her large beret.  She lowers her voice to a growl. “<i>And I talk like zis when I am serving zem.  Grr.  To be honest I do not sink I ‘ave to be worrying much,</i>” she goes on in her normal tone, tightening her apron. “<i>Most of ze demons \'oo come \'ere are not very bright, zey are not very interested in anysing except when zey are next banging zair bits together.  Also I sink most mammals are \'aving trouble telling ze difference between male and female reptiles wizzout looking closely.  Am I right?</i>” She grins her long, meandering smile at you and you take her point.' );
			} else if( choice === 16 ) {
				MainView.outputText( 'You ask Benoite if she really can tell who you are just by smell.' );
				MainView.outputText( '\n\n“<i>Well, of course I can, zilly,</i>” she says teasingly. “<i>When you end up smelling like someone else for several hours, it is a difficult sing to mistake.  It is a memento of you and it reminds me of appiness; I wish I could smell zat way for longer.  My sexy little shaved monkey.</i>”' );
			}
		}
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};

	//Male Benoit x Female PC Interactions;
	//First talk;
	//Requires: PC has oviposition/ovi-elixered/in heat, Affection 35+;
	Benoit.prototype.benoitAndFemPCTalkAboutEggings = function() {
		MainView.clearOutput();
		CoC.flags[ kFLAGS.BENOIT_SUGGEST_UNLOCKED ] = 1;
		MainView.outputText( 'Benoit seems very on edge today.  He paces up and down, returns your greeting with a stiff nod, and fiddles endlessly with the stock in reach of his counter as you search for a topic.  You ask if there\'s something wrong.' );
		MainView.outputText( '\n\n"<i>Nuzzing!</i>" he barks angrily.  He coughs.  "<i>Nussing,</i>" he says in a calmer tone.  You wait.  "<i>It\'s just... ze way your body is right now,</i>" he says eventually.  "<i>It... speaks to me.  But zis is my problem,</i>" he goes on, straightening his neck and nervously tapping his claws on the counter. "<i>And I am not myself if I cannot control myself.  Please, [name], ask your questions.</i>" You look at the sad, proud basilisk and wonder when exactly the last time he got laid was.' );
		MainView.outputText( '\n\n("<i>Suggest</i>" option added to ' + this.benoitMF( 'Benoit\'s', 'Benoite\'s' ) + ' menu.)' );
	};
	//Suggest: ;
	Benoit.prototype.eggySuggest = function() {
		MainView.clearOutput();
		if( CoC.flags[ kFLAGS.BENOIT_TESTED_BASILISK_WOMB ] === 0.5 ) {
			this.suggestSexAfterBasiWombed( true );
			return;
		}
		if( CoC.flags[ kFLAGS.BENOIT_TIMES_SEXED_FEMPCS ] > 0 ) {
			if( CoC.player.isTaur() ) {
				MainView.outputText( 'You silently reach across the counter to squeeze his hands again.  Benoit grins with deep affection at you and, hand in hand, the two of you quietly debunk to the store room again.' );
				MainView.outputText( '\n\nOnce again, you carefully inch your blind charge to a clear cranny and push him against a wooden wall, standing back to slowly peel off your [armor].  You grin as you ostentatiously drop each piece onto the packed earth, allowing him to guess what it is by the sound it makes.  His breathing comes heavier as your undergarments make a feathery sound as they fall.  As you take his hands and lay them upon your naked skin, you think about how you want to go about this.' );
			} else {
				MainView.outputText( 'You silently reach across the counter to squeeze his hands again.  Benoit beams at you and, hand in hand and without a word, the two of you depart to the store room again.' );
				MainView.outputText( '\n\nOnce again, you carefully inch your blind charge to a clear cranny and push him against a wooden wall, standing back to slowly peel off your [armor].  You grin as you ostentatiously drop each piece onto the packed earth, allowing him to guess what it is by the sound it makes.  His breathing comes heavier as your undergarments make a feathery sound as they fall.  As you take his hands and lay them upon your naked skin, you think about how you want to go about this.' );
			}
			EngineCore.choices( 'Let Him', this, this.repeatSexWithBenoitLetHim, 'Take Charge', this, this.repeatBenoitFuckTakeCharge, '', null, null, '', null, null, '', null, null );
			return;
		}
		CoC.flags[ kFLAGS.BENOIT_TIMES_SEXED_FEMPCS ]++;
		if( CoC.player.isTaur() ) {
			//Suggest: ;
			MainView.outputText( 'You reach your fingers across the counter and lightly touch Benoit\'s hands, saying you don\'t mind working out a few natural urges, if he\'s in the mood.' );
			MainView.outputText( '\n\n“You- I- what?” he replies, looking slightly stunned. “You don\'t? Are you... I don\'t know if....” You reach across and squeeze Benoit\'s hands until his nervous babble dies out and hesitantly, he squeezes back.  Still holding his hand, you move behind the crates and then gently lead him behind the stall\'s canopy.' );
			MainView.outputText( '\n\nWhat passes for Benoit\'s back office is perfect for your purposes; the two wagons between which his stall is sandwiched close together here and the triangular space is filled with crates and unsorted salvage.  You carefully inch your blind charge to a clear cranny and push him against a wooden wall, standing back to slowly peel off your ' + CoC.player.armorName + '.  You grin as you ostentatiously drop each piece onto the packed earth, allowing him to guess what it is by the sound it makes.  His breathing comes heavier as your undergarments make a feathery sound as they fall.' );
			MainView.outputText( '\n\n“Zis will sound strange,” says Benoit in a thick voice, “But- would you mind if I just touched you a bit first? All I know about you is ze sound of your voice.”  You acquiesce and draw close, taking his hands once again and gently laying them upon you.  You sigh as, holding his index claws back, he begins to move them slowly up and down.' );
			MainView.outputText( '\n\nHis warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel like you\'re being read like a book in Braille.  “Good Gods,” he murmurs as his hands lead back onto your flanks.  “Good Gods!” he cries out as he follows you all the way back to your mighty, powerful rear.  “I knew you were a centaur because of all ze clip clopping,” he says, rubbing your side back and forth in wonder.  “But to know it and actually feel it, zey are somesing very different.” He sighs.  “I \'ope you do not mind zis being a bit... awkward, but I am guessing you are probably used to zat by now, yes?”' );
			// Herm: ;
			if( CoC.player.gender === 3 ) {
				MainView.outputText( '\n\nHis hands travel down your behind until, with a sharp intake of breath, he touches [oneCock].  “Aren\'t you just full of surprises,” he says dryly.  After a pause, he slowly wraps his dry, smooth grasp around your semi-erect cock and moves it up and down, rubbing and coiling you until you are straining.' );
				//[cock 10 inches or less: ;
				if( CoC.player.longestCockLength() <= 10 ) {
					MainView.outputText( '  Although this is evidently an uncanny experience for him, he does manage a cocky smile as his hand moves around your male sex. “Mine is bigger,” he teases.  Unable to reward his cheek from where he is, you simply snort and shuffle your hooves, impatient now with need.' );
				}//[cock  >10 inches: ;
				else {
					MainView.outputText( '  This is evidently an uncanny experience for him, the alien nature of it deepening as his hands moves around your male sex. “Oly Gods [name], you are a monster,” he says thickly.  You smile and stamp your hooves, impatient now with need.' );
				}
			}
			MainView.outputText( '\n\nHis hands trail upwards, moving over your bestial behind, exploring your soft flesh until he touches your lips.  You close your eyes and sigh as he slowly parts them with his smooth fingers and slides into your [vagina].  Although his breath is becoming increasingly heavy he also seems genuinely curious about you; with surprising gentleness his fingers travel over and around your moistening sex, exploring your every fold, working deeper and deeper as he does.  You let him know what pleases you by sighing when he touches a sweet spot, moving deliberately with his finger\'s motions so he may give them better attention.  He soon finds your [clit], beginning to bulge with need; slowly he circles it and then flicks at it, gently frigging you.' );
			//[In heat:];
			if( CoC.player.inHeat ) {
				MainView.outputText( '  By now your vagina is practically gushing, your bodies\' own deep seated pheromone need stoked to blazing heights by the basilisk\'s gentle, painstaking exploration of your body.  You cannot stop thrusting yourself against his soaked hand, announcing how badly you want this with heavy moans.' );
			}

			MainView.outputText( '\n\nThe scent of your arousal is in the air and as Benoit breathes it in his own breath comes heavier.  His erection bulges in his long johns and you decide it\'s time for you to take charge; you back up, butting him insistently with your powerful body until you have him pinned against a space upon the opposite wall.  You watch him over your shoulder as he unbuckles himself and lets his trousers fall.  Stoked by the pheromones simmering off your body, his long, thin purple erection is straining and he arches his back and opens his mouth as you flare your [butt] and press yourself against it.  You know just from looking at his intense arousal you\'re going to have to go slow to stop him from shooting his bolt straight away; with a wicked smile your partner can\'t see, you suppose such is your effect on him it may not even matter if he does.  Still, as he lays his hands upon your flanks, and you lean back with a sigh and slowly slide his length into your moistened [vagina] as gently as you can.' );
			CoC.player.cuntChange( 12, true, true, false );
			MainView.outputText( '\n\nBenoit\'s dick is incredibly smooth and you move down onto it with incredible, slick ease.  Rather than burying yourself onto it straight away you stop with only a third of it in your wet depths and slowly bring it out of you, dipping yourself slowly.  You stop with his sensitive head just inside and work your [hips] around deliberately, sighing as it rotates slowly around your slick walls.  Benoit moans dryly and you feel his body tense; immediately you stop your movements and wait, only gradually beginning to gyrate and thrust again when he has calmed down.  You slide more of him into you when you bend forwards again, this time leaving only his base outside of you; you sigh as you feel him creeping further into your moist depths.  He makes a bestial noise and tries to thrust himself into you and upon you; tutting mockingly, you pull yourself away from him and stop moving until, with what is evidently a huge force of will, the basilisk calms himself, backs himself against the wall and allows you to work him.' );
			//[Small capacity: ;
			if( CoC.player.vaginalCapacity() <= 30 ) {
				MainView.outputText( '\n\nYou slide back down onto him, cooing this time as you feel him bottom out with several inches of him still outside of you.  His thin, long length could not be more perfect for your tight sex; he rubs your walls up and down as you dreamily thrust in and out of his body, sending waves of pleasure flowing through you.' );
			}//Large capacity: ;
			else {
				MainView.outputText( '\n\nYou slide back down onto him, cooing this time as your groin meets his muscled thighs with a wet kiss, your sex swallowing his cock whole.  You begin to ride him hard and slow, bending his cock upwards to push at your sensitive walls, waves of pleasure starting to flow through you.' );
			}

			MainView.outputText( '\n\nYou keep at this slow ride for what feels like hours, stopping and starting, pulling and pushing deliberately to keep the basilisk you have backed into a corner under your control.  The pace of the fuck is clearly agonising for Benoit; he pants, tenses and gasps to the wet movement of your [vagina], his face and chest red with extreme arousal, but he lets you stay in control, eventually unable to do anything but lie back and let you have your way with him.' );
			//[Lactation: ;
			if( CoC.player.lactationQ() >= 50 ) {
				MainView.outputText( '  The slow, sensual sex is enough for you to begin to bead milk from your sensitive [nipples]; you moan as the flow intensifies until you are instinctively kneading your [chest], spurting your sweet, warm fluids onto the floor.  Benoit starts in genuine amazement at the sound.  “Mammals are so damn weird,” he mutters, making you giggle.' );
			}
			MainView.outputText( '\n\nYour lust ratchets up as his warm hands continue to move over your behind, and at last losing your discipline you begin to thrust into him with abandon, eager now for your peak.  Benoit pants as you really begin to fuck him and thrusts with you; the wetness of your arousal spatters against his thighs as your body slaps into the basilisk\'s tight muscles.  He makes a harsh, bestial noise when he cums; his blind eyes roll as he clutches your back and shoots surge after surge of cum into your churning depths.  The warmth of his jizz and his helpless bucking thrust you to your own orgasm; irrepressible pulses of pleasure overwhelm your mind and you can do nothing for long minutes except cry and squeal against the basilisk, clutching him back as you work his dick for every last drop.' );
			if( CoC.player.gender === 3 ) {
				MainView.outputText( '  [EachCock] thickens and spurts in sympathy to your female high, spattering the floor with white paint.' );
			}
		} else {
			MainView.outputText( 'You reach your fingers across the counter and lightly touch Benoit\'s hands, saying you don\'t mind working out a few natural urges, if he\'s in the mood.' );
			MainView.outputText( '\n\n"<i>You - I - what?</i>" he replies, looking slightly stunned. "<i>You don\'t?  Are you... I do not know if...</i>"  You reach across and squeeze Benoit\'s hands until his nervous babble dies out and hesitantly, he squeezes back.  Still holding his hand, you move behind the crates and then gently lead him behind the stall\'s canopy.' );
			MainView.outputText( '\n\nWhat passes for Benoit\'s back office is perfect for your purposes; the two wagons between which his stall is sandwiched close together here and the triangular space is filled with crates and unsorted salvage.  You carefully inch your blind charge to a clear cranny and push him against a wooden wall, standing back to slowly peel off your [armor].  You grin as you ostentatiously drop each piece onto the packed earth, allowing him to guess what it is by the sound it makes.  His breathing comes heavier as your undergarments make a feathery sound as they fall.' );
			MainView.outputText( '\n\n"<i>Zis will sound strange,</i>" says Benoit in a low, thick voice, "<i>But - would you mind if I just touched you a bit first?  All I know about you is your smell and ze sound of your voice.</i>"  You acquiesce and draw close, taking his hands once again and gently laying them upon your body.  You sigh as, holding his index claws back, he begins to move them slowly up and down.' );
			//[Demon: ;
			if( CoC.player.horns > 0 && CoC.player.hornType === AppearanceDefs.HORNS_DEMON && CoC.player.tailType === AppearanceDefs.TAIL_TYPE_DEMONIC && CoC.player.demonScore() >= 3 ) {
				MainView.outputText( '\n\nHis warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  He touches your horns and pauses; he reaches around, finds and grips your tail, running his pads up to the spaded point.  "<i>So,</i>" he says quietly.  "<i>You are one of zem.</i>"  He is silent for a while before finding a warm smile.  "<i>But I am being silly.  I know you are different inside.</i>"' );
			}//[Dog enough for ears and tail: ;
			else if( CoC.player.earType === AppearanceDefs.EARS_DOG && CoC.player.tailType === AppearanceDefs.TAIL_TYPE_DOG && CoC.player.dogScore() >= 3 ) {
				MainView.outputText( '\n\nHis warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  He grins as he finds your floppy ears and outright laughs when he reaches around and touches your tail. "<i>I like dogs, but not ZAT much, [name],</i>" he laughs.' );
			}//[Cat/Bunny enough for ditto: ;
			else if( CoC.player.catScore() >= 3 && CoC.player.tailType === AppearanceDefs.TAIL_TYPE_CAT && CoC.player.earType === AppearanceDefs.EARS_CAT ) {
				MainView.outputText( '\n\nHis warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  He grins as he finds your ears, outright laughs when he reaches around and touches your soft tail.  "<i>I always wondered why Pierre gets all excited when \'e sees you,</i>" he chuckles huskily.' );
			}//[Avian with wings and feet:  ;
			else if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HARPY && CoC.player.wingType === AppearanceDefs.WING_TYPE_FEATHERED_LARGE ) {
				MainView.outputText( '\n\nHis warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  He finds your wings and follows them up as far as he can reach, making you twitch as he caresses your delicate pinfeathers; he carefully shifts his feet forward to touch at your own clawed toes.  "<i>So,</i>" he sighs, a smile playing on his lips as he touches your shoulder.  "<i>What is in front of me is a terrible \'arpy.  Come from ze skies to ravish me.</i>"' );
			}
			//[Reptile/Naga: ;
			else if( CoC.player.skinType === AppearanceDefs.SKIN_TYPE_SCALES && (CoC.player.lizardScore() >= 3 || CoC.player.nagaScore() >= 3) || CoC.player.dragonScore() >= 3 ) {
				MainView.outputText( '\n\nHis warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  He starts slightly when he touches your scales, and then caresses the reptilian parts of your body with increasing interest.  "<i>I cannot believe I did not realize you were a sister of ze scales,</i>" he says huskily.  "<i>Zat is very... interesting.</i>"  You can see real arousal in the tense lines of his face now.' );
			}//[Bee: ;
			else if( (CoC.player.wingType === AppearanceDefs.WING_TYPE_BEE_LIKE_SMALL || CoC.player.wingType === AppearanceDefs.WING_TYPE_BEE_LIKE_LARGE) && CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_BEE ) {
				MainView.outputText( '\n\nHis warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  He finds your diaphanous wings and follows them up as far as he can reach, his grip on your sensitive membranes making you twitch a bit; then he sends his hands trailing down your carapace-armored limbs.  "<i>I sought you just liked wearing big boots,</i>" he murmurs.  "<i>But zis is actually a part of you?  \'Ow... interesting.</i>"' );
			}//[Centaur: ;
			else if( CoC.player.isTaur() ) {
				MainView.outputText( '\n\nHis warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  "<i>Good Gods,</i>" he murmurs as his hands lead back onto your flanks.  "<i>Good Gods!</i>" he cries out as he follows you all the way back to your mighty, powerful rear.  "<i>I knew you were a centaur because of all ze clopping,</i>" he says, rubbing your flank back and forth in wonder.  "<i>But to know it and actually feel it, zey are very different.</i>"  He sighs.  "<i>Zis is going to be a bit... awkward, but I am guessing you are all too used to zat by now, yes?</i>"' );
			} else if( CoC.player.isDrider() ) {
				MainView.outputText( '\n\nHis warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  "<i>Good Gods,</i>" he murmurs as his hands lead back onto your tough exoskeleton. "<i>Good Gods!</i>" he cries out as he follows your bulging abdomen all the way back to your spinnerets. "<i>I knew you were a spider because of all ze click-clacking,</i>" he says, his fingers feeling around one of your intricate, many-jointed legs in wonder.  "<i>But to know it and actually feel it, zey are very different.</i>"' );
			}//[Slime: ;
			else if( CoC.player.isGoo() ) {
				MainView.outputText( '\n\nHis warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  "<i>I knew you were different from ze squishy sounds you made,</i>" he murmurs as his hands sink into your soft, amorphous mass.  "<i>But zis is...good Gods, zis is strange.  And zis doesn\'t \'urt you at all?</i>" he asks incredulously as he gently pokes a finger into you.  You answer his question by giggling.  "<i>Zat must come in very useful,</i>" he says, shaking his head in wonder.  You push yourself slowly up his arms and tell him he has no idea.' );
			} else {
				MainView.outputText( '\n\nHis warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  "<i>You \'umans are so squishy, fuzzy and \'ot,</i>" he says huskily. "<i>\'Ow can you stand it?</i>"' );
			}
			if( CoC.player.hasCock() ) {
				MainView.outputText( '\n\nHis hands travel downwards until, with a sharp intake of breath, he touches [oneCock].  "<i>Aren\'t you just full of surprises,</i>" he says dryly.  After a pause, he slowly wraps his smooth hand around your semi-erect cock and moves it up and down, rubbing and coiling you until you are straining.' );
				if( CoC.player.cocks[ CoC.player.biggestCockIndex() ].cockLength < 10 ) {
					MainView.outputText( '  Although this is evidently an uncanny experience for him, he does manage a cocky smile as his hand moves along your male sex.  "<i>Mine is bigger,</i>" he teases.  You reward his cheek by doing some feeling yourself, grasping and pinching at his tight, supple behind through his trousers, making him gasp as you move into him.' );
				} else {
					MainView.outputText( '  This is evidently an uncanny experience for him, the alien nature of it deepening as his hands moves along your male sex. "<i>\'Oly Gods, [name]; you are a monster,</i>" he says thickly.  You smile and decide it\'s time to do some feeling yourself; you grasp and pinch at his tight, supple behind through his trousers, making him gasp as you move into him.' );
				}
			}
			MainView.outputText( '\n\nHis hands trail further down, moving into your inner thighs, exploring your soft flesh until he touches your lips.  You close your eyes and sigh as he slowly parts them with his smooth fingers and slides into your [vagina].  Although his breath is becoming increasingly heavy he also seems genuinely curious about you; with surprising gentleness his fingers travel over and around your moistening sex, exploring your every fold, working deeper and deeper as he does.  You let him know what pleases you by sighing when he touches a sweet spot, moving deliberately with his finger\'s motions so he may give them better attention.  He soon finds your [clit], beginning to bulge with need; slowly he circles it and then flicks at it, gently frigging you.' );
			if( CoC.player.inHeat ) {
				MainView.outputText( ' By now your vagina is practically gushing, your body\'s own deep-seated pheromone need stoked to blazing heights by the basilisk\'s gentle, painstaking exploration.  You cannot stop yourself thrusting against his soaked hand, announcing how badly you want this with heavy moans.' );
			}

			MainView.outputText( '\n\nThe scent of your arousal is in the air and as Benoit inhales it, his own breath comes heavier.  His erection bulges in his long johns and you decide it\'s time for you to take charge; you push him against the wall, unbuckle him and let his trousers fall.  Stoked by the pheromones simmering off your body, his long, thin, purple erection is straining and he arches his back and opens his mouth as you lay a hand on it.  You know just from looking at his straining prick you\'re going to have to go slow for him not to shoot his bolt straight away; with a wicked smile your partner can\'t see, you suppose that such is your body\'s effect on him it may not even matter if he does.  As lost as the horny lizan is to the haze of his pleasure, you remind him of reality the best way you know how, guiding his hands to your [hips] and with a sigh, slowly sliding his length into your moistened [vagina] with as much grace as your eagerness can stand.' );
			CoC.player.cuntChange( 14, true, true, false );
			MainView.outputText( '\n\nBenoit\'s dick is incredibly smooth and you move down onto it with slick ease.  Rather than burying yourself onto it straight away, you stop with only a third of it in your wet depths and bring it out of you, dipping yourself slowly.  You stop with his sensitive head just inside and work your thighs around deliberately, sighing as it rotates around your slick walls.  Benoit moans and you feel his body tense; immediately you halt your movements and wait, only gradually beginning to gyrate and thrust again when he has calmed down.  You slide more inside when you bend forwards again, this time leaving only his base outside of you; a sigh rolls from you as you feel him creeping further into your moist depths.  He makes a bestial noise and tries to thrust himself into you and upon you; tutting mockingly, you pull yourself away from him and stop moving until, with what is evidently a huge force of will, the basilisk calms himself, backs himself against the wall and allows you to work him.' );
			if( CoC.player.vaginalCapacity() < 15 ) {
				MainView.outputText( '\n\nYou slide back down onto him, cooing this time as you feel him bottom out with several inches still outside.  His thin member could not be more perfect for your tight sex; he rubs your walls up and down as you dreamily thrust in and out of his body, sending waves of pleasure washing through you.' );
			} else {
				MainView.outputText( '\n\nYou slide back down onto him, cooing this time as your groin meets his muscular thighs with a wet kiss, your sex swallowing his cock whole.  You begin to ride him hard and slow, bending his cock upwards to push at your sensitive walls, waves of pleasure starting to wash through you.' );
			}

			MainView.outputText( '\n\nYou keep at this for what feels like hours, stopping and starting, pulling and pushing deliberately to keep the basilisk you have backed into a corner under your control.  The pace of the fuck is clearly agonising for Benoit; he pants, tenses and gasps to the wet movement of your [vagina], his face and chest heaving with extreme arousal, but he lets you stay in command, eventually giving up on anything but lying back and letting you have your way with him.  To give him something to do, you grab his hands and lay them upon your [chest]; after exploring your flesh for a time, he finds your [nipple]s and begins to knead them, placing each nub between two fingers and rubbing them insistently.' );
			if( CoC.player.lactationQ() > 100 ) {
				MainView.outputText( '  You moan as your breasts reward his attention with spurts of milk; he starts in genuine amazement when they ' );
				if( !CoC.player.isTaur() ) {
					MainView.outputText( 'hit him in the face' );
				} else {
					MainView.outputText( 'trickle over his fingers' );
				}
				MainView.outputText( '.  "<i>Mammals are so damn weird,</i>" he mutters, making you giggle.' );
			}
			MainView.outputText( '\n\nYour lust ratchets up as his warm hands continue to move, and at last losing your discipline you thrust into him with abandon, eager now for your peak.  Benoit pants as you really begin to fuck him and begins to thrust with you; you clutch his neck and bite into his shoulder as you pound into each other, the wetness of your arousal spattering against his thighs as your body slaps into the basilisk\'s tight muscles.  He makes a harsh, bestial noise when he cums; his blind eyes roll as he clutches your back and shoots surge after surge of cum into your churning depths.  The warmth of his jizz and his helpless bucking thrust you to your own orgasm; irrepressible pulses of pleasure overwhelm your mind and you can do nothing for long minutes except cry and squeal on top of the basilisk, clutching him back as you work his dick for every last drop of cum.' );
			if( CoC.player.hasCock() ) {
				if( !CoC.player.isTaur() ) {
					MainView.outputText( '  Stuck between your two burning bodies, y' );
				} else {
					MainView.outputText( 'Y' );
				}
				MainView.outputText( 'our ' + Descriptors.cockDescript( 0 ) + ' spurts in sympathy to your female high, soaking ' );
				if( !CoC.player.isTaur() ) {
					MainView.outputText( 'both of you' );
				} else {
					MainView.outputText( 'the dry dirt' );
				}
				MainView.outputText( ' with white.' );
			}
		}
		MainView.outputText( '\n\nEventually, the two of you part, dripping your mixed fluids as you step back.  "<i>Phew!</i>" Benoit says after he\'s managed to catch his breath.  "<i>That was... somesing.  Mademoiselle, you are... amazing.</i>"  You find yourself laughing at his slightly shell-shocked expression, and the light, happy sound seems to bring him around a bit.  He brushes your shoulder as he walks past you, feeling around the stock room until he finds a chest of drawers.  He opens a compartment and withdraws a small woollen bag, stuffed with pungent green leaves.' );
		MainView.outputText( '\n\n"<i>Ze shark ladies are always coming up from ze lake to sell me zis,</i>" he says. "<i>It is a very effective, \'ow you say, \'counter septic\'?' );
		CoC.player.orgasm();
		if( (CoC.player.pregnancyType === PregnancyStore.PREGNANCY_OVIELIXIR_EGGS || CoC.player.findPerk( PerkLib.HarpyWomb ) >= 0 || CoC.player.findPerk( PerkLib.Oviposition ) >= 0) && (CoC.player.pregnancyIncubation === 0 || CoC.player.pregnancyType === PregnancyStore.PREGNANCY_OVIELIXIR_EGGS) ) {
			MainView.outputText( '  I would not inflict my children upon you.  Ere, take as much as you like.</i>"' );
			EngineCore.choices( 'Take It', this, this.takeBenoitsContraceptives, '', null, null, '', null, null, '', null, null, 'Leave', this, this.dontTakeEggtraceptives );
		} else {
			MainView.outputText( '  I cannot give you babies unless you \'ave eggs.  I guess I should think a bit more before I go digging for things...</i>"' );
			//, but if your body goes into 'eat again and you are afraid of 'aving... unwanted experiences... I can sell it to you.</i>"];
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		}
	};
	Benoit.prototype.takeBenoitsContraceptives = function() {
		MainView.clearOutput();
		MainView.outputText( 'You gladly accept the herbal contraceptive and push it into your mouth, enjoying the pleasantly sharp, citrus flavour.' );
		//  "<i>I can sell you ze stuff too,</i>" he says, twiddling his claws.  "<i>If you want.</i>";
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//No: ;
	Benoit.prototype.dontTakeEggtraceptives = function() {
		MainView.clearOutput();
		MainView.outputText( 'You smile and say you don\'t mind carrying and laying a few basilisk eggs. "<i>You... you don\'t?</i>" he says hesitantly.  He faces you and for a moment looks like he\'s going to say something else; but then he shakes his head and puts the bag back into the drawer.' );
		//"<i>Well...if you are sure.  I can sell you ze stuff if you ever change your mind.</i>";
		MainView.outputText( '\n\nIn the warm afterglow you redress at leisure before leading him back inside the shop and, after squeezing his hand, take your leave.' );
		//[Herbal Contraceptive added to slot 4 of shop];
		//Standard basilisk preg odds;
		this.benoitKnocksUpPCCheck();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};

	//Subsequent visit to the shop: ;
	Benoit.prototype.firstTimeAfterBoningEncounterBenoit = function() {
		MainView.clearOutput();
		//Set a flag here to make sure it only happens once.;
		CoC.flags[ kFLAGS.BENOIT_POST_FIRSTFUCK_TALK ] = 1;
		MainView.outputText( 'A strange, faint noise is emanating from the salvage shop.  It\'s only when you duck cautiously into the stall proper that you realize it\'s the sound of a basilisk humming.  Benoit stops to sniff the air when you come in, immediately puts down the mug he is polishing, and beckons you inside.' );
		MainView.outputText( '\n\n"<i>\'Allo again, [name]</i>"!</i>" he says brightly.  "<i>\'Ow pleasant it is to see you.  \'Ow are we zis very fine day?</i>"  There\'s something imperceptibly different about Benoit today and it takes you a moment to work out what it is.  He doesn\'t seem quite as shabby as he did before; his scales gleam dully and you wonder if he\'s taken a bath recently.  There\'s something else, too.' );
		MainView.outputText( '\n\n"<i>Zis?  No.  Of course not!</i>" he says, when you ask if he\'s wearing the navy tie just for you.  "<i>Is zere somesing wrong with a basilisk wanting to look \'is best?  Anyway, I am taking it off now.  It is very silly, I see zis now.  Now... what is it zat mademoiselle is after?</i>" You try not to laugh at this display and consider what it is you\'re here for.' );
		//[defaults to regular 30+ affection visit afterwards];
	};
	//Let him(not for horses): ;
	Benoit.prototype.repeatSexWithBenoitLetHim = function() {
		MainView.clearOutput();
		if( CoC.player.isTaur() ) {
			MainView.outputText( '\n\nFor the moment you don\'t do anything; you simply stand back and let his hands slowly move across your frame.  One of his hands comes to rest upon your [nipples]; as he gently teases and kneads the soft, sensitive flesh his other hand drift downwards, across your belly, around your waist and down your velvety back.  Although he is familiar with your frame by now Benoit never seems to stop being enthralled by your body; there is an unconscious frown of concentration on his face as his smooth hands move across your warm skin, as if he were mapping you in his mind\'s eye.' );
			MainView.outputText( '\n\nThis slow, gentle pressure is all very well, but you can\'t help but wonder if you can\'t awaken something a bit more bestial in the timid basilisk.  The thought of making him lose his self-control over you makes you grin, and tenderly but firmly you put your hands on his claws and tell him to stop.  He looks at you in puzzlement.  Smiling, you begin to give him some of his own treatment; your hands drift softly over his tight, smooth flesh, working down his flat stomach until they reach his long johns.  You slowly unbuckle them and let them fall, releasing his long, thin erection.  With one hand you circle the base gently; even touching this least sensitive part of his dick makes him grunt with need, the thump of his heart reverberating through his scales, and he involuntarily thrusts forwards, trying to get more of your hand upon him.  Again, you tell him to be still.  You continue to almost-masturbate him, your one hand rubbing the very base of his cock and the lips from which it thrusts, whilst you very gently sway your powerful back hips, your [vagina] beginning to moisten at the sight of the basilisk\'s intense arousal.  The scent of your sex is in the air and the fact you cannot reach back and do anything about it only intensifies your excitement.  Benoit is clenching his pointed teeth, trembling slightly like a pipe about to burst, his tail thrashing fitfully as you ponderously turn and lead your rump into him, smearing your essence over his incredibly receptive nostrils.  All he can smell is your own arousal as you begin to talk huskily, saying you\'ve been a naughty girl playing in the mountains, you\'ve teased and run away and mocked every creature you\'ve found but now a big bad basilisk has got you cornered, and what is the big bad basilisk going to do now it\'s got this naughty girl all to itself...?' );
			MainView.outputText( '\n\nBenoit surges forwards, grasps you by the [butt], turns and pinions you to the wall.  Your laughs turn to gasps as with an almost pained growl, Benoit thrusts himself straight into your moist twat.  You can only clutch at the wall of the wagon as he begins to fuck you with abandon, pushing your human front forwards as he levers your [hips] upwards with each thrust.  He is clumsy with lust as well as blind, uncaring of anything but the need to clench your body and hilt himself in your depths, unable to take hold of himself with your pussy juices coating his nose and burning an unstoppable path to his brain.  His pheromone driven callousness and the discomfort of the wood against your hands ' );
			if( CoC.player.biggestTitSize() >= 1 ) {
				MainView.outputText( 'and [fullChest] ' );
			}
			MainView.outputText( 'augments the roughness of the fuck and you find yourself getting carried along with it, thrusting your powerful rump back against the basilisk and clenching him deeper into you, delighting in his firm, dense mass pounding into you.  Your [vagina] dribbles juices around his impatient, straining dick, practically foaming as his smooth length rubs forcefully all along your sensitive tunnel.' );
			CoC.player.cuntChange( 14, true, true, false );
			MainView.outputText( '\n\nThe rough sex knocks the breath and sense out of you and you are dizzy with it by the time you reach your high, gasping and making guttural noises as Benoit\'s thumping makes your pussy clench and spasm around him.  He joins in with a thick, breathless growl, and you feel surge after surge of cum flood your depths with warmth.  After you have finished thrashing against each other you stay where you are, gathering your breath on each other.  It takes you a while to realize he hasn\'t gone soft, and is still embedded firmly within you; your mixed fluids are dripping down your thighs and your musk is still in the air.  He grins at you and gives you a tiny thrust, making you bite your lip; ejaculating seems to have only taken the slightest edge off the rut you\'ve induced in him.  “You did not sink you would get away zat easily, did you?” he growls softly.' );
			MainView.outputText( '\n\nHe pulls out of you, trailing threads of semen as he goes, before slowly turning you around, painstakingly feeling around for a clear space with his feet, and then putting you down, gently but firmly positioning you on your lower body.  His hands descend upon your [butt]; grinning, you poke it outwards invitingly, sighing with mock frustration as the blind basilisk painstakingly lines up his next shot with your drooling, sticky sex.' );
			MainView.outputText( '\n\nWhen he slides into you he does so with virtually no resistance whatsoever; the two of you have turned your pussy into an inviting, gooey sleeve.  ' );
			//[Tight: ;
			if( CoC.player.vaginalCapacity() < 30 ) {
				MainView.outputText( 'You don\'t mind; your tight sex is a perfect fit for his smooth, thin dick, and you work with him as he thrusts, pulling and pushing your walls in time with his length, your lubrication allowing him to quickly increase the tempo until the two of you are once again bucking against each other gleefully, your fluids spattering against each other.' );
			}//Loose: ;
			else {
				MainView.outputText( 'Although he is long he barely even touches the sides of your encompassing twat.  The sensation isn\'t great for you until he really starts to go to town, ramming into you with all he\'s got, beating a wet staccato against your [butt], pushing against your [clit] as he sheaths himself in you.  Your fluids begin to dribble onto your hooves as your slick pleasure button bulges with increasing delight.' );
			}
			MainView.outputText( '\n\nThe difference in the position makes his dick bend into you at a different angle, stroking a neglected spot which soon has you gasping with need.  Benoit is not as maddened as he was the first time, and he has the composure to draw himself out; he slows himself down and then back up again, fucking you magisterially, withdrawing himself almost all the way out of you before slamming firmly back in, stopping whilst hilted in you until you beg and moan for him to continue.  You give yourself up to the dominant rut you\'ve awoken in him, thrusting back into him as you are fucked up to a second ecstatic height and then a third; everything disappearing underneath a timeless red haze, of having your [butt] in the air and being given what a mare needs.' );
			MainView.outputText( '\n\nWhen Benoit finally cums he sounds almost pained; his aching cock delivers another load into your already packed womb, semen dribbling and spurting onto the floor.  You work his dick for as long as you can until it finally droops out of your abused cunt.  Finally you sit up, turn around and cuddle into the basilisk, who pools onto the floor and responds tentatively.' );
			MainView.outputText( '\n\n“Zat was... wow,” he manages.  With his dick wrung of every last drop of his seed you can see he is returning to himself, and his hand around your waist is cautious. “Was zat... all right for you? I do not know if... I get zese smells in my \'ead and zen...” You answer him by kissing him on the cheek and saying with teasing huskiness that it was good, but maybe next time he shouldn\'t hold back so much.  He grins at this.  You spend a bit more time cuddling whilst recovering from the intense fuck, before finally clambering to your feet.  Your final act before dressing and taking your leave is to faintly brush your scent across Benoit\'s nose again, telling him you expect him to be ready and primed the next time this naughty girl pays a visit.  He doesn\'t respond- maybe he is still privately ashamed about losing his cool over you- but you can tell by the lines of his face and the way his head moves unconsciously to follow your path out of his shop that him not being aroused by you isn\'t something you\'re ever going to have to worry about.' );
		} else {
			MainView.outputText( 'For the moment you don\'t do anything; you simply stand back and let his hands slowly move across your frame.  One of his hands comes to rest upon your ' + Descriptors.nippleDescript( 0 ) + '; as he gently teases and kneads the soft, sensitive flesh his other hand drift downwards, across your belly, around over the crack of your [butt] then down to cup your behind.  Although he is familiar with your frame by now, Benoit never seems to stop being enthralled by your body; there is an unconscious frown of concentration on his face as his smooth hands move across your warm skin, as if he were mapping you in his mind\'s eye.' );
			MainView.outputText( '\n\nThis slow, gentle pressure is all very well, but you can\'t help but wonder if you can\'t awaken something a bit more bestial in the timid basilisk.  The thought of making him lose his self-control over you causes you to grin, unseen, and tenderly but firmly you put your hands on his claws and tell him to stop.  He looks at you in puzzlement as you shift your bodies around, your hands sliding over his shoulders and chest as you change position so that it is you with your back to the wall.  He begins to move his hands again and you tut mockingly, telling him to be still for now.  Smiling, you begin to give him some of his own treatment; your hands drift softly over his tight, smooth flesh, working down his washboard stomach until they reach his long johns.  You slowly unbuckle them and let them fall, releasing his long, thin erection.  With one hand you circle the base gently; even touching this least sensitive part of his dick makes him grunt with need, the thump of his heart reverberating through his scales, and he involuntarily thrusts forwards, trying to get more of your hand upon him.  Again, you tell him to be still.  You continue to almost-masturbate him, your one hand rubbing the very base of his cock and the slit from which it thrusts, whilst with the other you reach down and touch your own slickening [vagina].  You moan exaggeratedly as you dip first one finger and then two into your honey pot, gently frigging your [clit] until you are in full spate, dripping your fluids onto the packed earth beneath you.  Benoit is clenching his pointed teeth, trembling slightly like a pipe about to burst, as you lift your coated fingers up and smear your essence over his incredibly receptive nostrils.  His tail thrashes fitfully as you continue to torment his dick, just barely touching his purple tip before returning to his base.  All he can smell is your own arousal as you begin to talk huskily, saying you\'ve been a naughty girl playing in the mountains, you\'ve teased and mocked and run away from every creature you\'ve found but now a big bad basilisk has got you cornered, and what is the big bad basilisk going to do now it\'s got this naughty girl all to itself...?' );
			MainView.outputText( '\n\nBenoit surges forward, grasps you by the [butt] and pinions you to the wall.  Your laughs turn to gasps as he lifts your teasing hands upwards, pinning them out of the way with the mass of his body and with an almost pained growl, thrusts himself straight into your moist twat.  You can only clutch at his back as he begins to fuck you with complete abandon, smacking your back into the wall of the wagon and levering your [hips] upwards with each thrust.  He is clumsy with lust as well as blind, uncaring of anything but the need to clench your body and hilt himself in your depths, unable to take hold of himself with your pussy juices coating his nose and burning an unstoppable path to his brain.  His pheromone-driven callousness and the discomfort of the wood rubbing against your back and butt augments the roughness of the fuck and you find yourself getting carried along with it, wrapping your thighs around the basilisk\'s thin waist and clenching him deeper into you, delighting in his firm, dense mass pounding into you.  Your [vagina] dribbles juices around his impatient, straining dick, practically foaming as his smooth length rubs forcefully all along your sensitive tunnel.' );
			MainView.outputText( '\n\nThe rough sex knocks the breath and sense out of you and you are dizzy with it by the time you reach your high, gasping and making guttural noises as Benoit\'s thumping makes your pussy clench and spasm around him.  He joins in with a thick, breathless growl, and you feel surge after surge of cum flood your depths with warmth.  After you have finished thrashing against each other, you stay still, gathering your breath on each other.  It takes you a while to realize he hasn\'t gone soft, that his prick is still embedded firmly within you; your mixed fluids are dripping down your thighs and your musk is still in the air.  He grins at you and gives you a tiny thrust, making you bite your lip; ejaculating seems to have only taken the slightest edge off the rut you\'ve induced in him.  "<i>You did not sink you would get away zat easily, did you?</i>" he growls softly.' );
			MainView.outputText( '\n\nHe pulls out of you, trailing threads of semen as he goes, before slowly turning you around, painstakingly feeling around for a clear space with his feet, and then putting you down, gently but firmly positioning you on your hands and ' );
			if( CoC.player.isBiped() ) {
				MainView.outputText( 'knees' );
			} else {
				MainView.outputText( 'lower body' );
			}
			MainView.outputText( '.  His hands descend upon your [butt]; grinning, you poke it outwards invitingly, sighing with affected frustration as the blind basilisk painstakingly lines up his next shot with your drooling, sticky sex.' );
			MainView.outputText( '\n\nWhen he slides into you he does so with virtually no resistance whatsoever; the two of you have turned your pussy into an inviting, gooey sleeve.  ' );
			if( CoC.player.vaginalCapacity() < 30 ) {
				MainView.outputText( 'You don\'t mind; your tight sex is a perfect fit for his smooth, thin dick, and you work with him as he thrusts, pulling and pushing your walls in time with his length, your lubrication allowing him to quickly increase the tempo until the two of you are once again bucking against each other gleefully, your fluids spattering against each other.' );
			} else {
				MainView.outputText( 'Although he is long, he barely even touches the sides of your encompassing twat.  The sensation isn\'t great for you until he really starts to go to town, ramming into you with all he\'s got, beating a wet staccato against your [butt].  You send a hand roaming back around and begin to finger your [clit] as he sheaths himself in you, his fluids running down your fingers as you work your slick, bulging pleasure button with increasing delight.' );
			}
			CoC.player.cuntChange( 10, true, true, false );
			MainView.outputText( '  The difference in the position makes his dick bend into you at an angle, stroking a neglected spot which soon has you gasping with need.  Benoit is not as maddened as he was the first time, and he has the composure to draw himself out; he slows himself down and then back up again, fucking you magisterially, withdrawing himself almost completely before slamming firmly back in, stopping whilst hilted in you until you beg and moan for him to continue.  You give yourself up to the dominant rut you\'ve awoken in him, thrusting back into him as you are fucked up to a second ecstatic height and then a third; everything disappearing underneath a timeless red haze, of being on your hands and knees with your [butt] in the air and being given what a female animal needs.' );
			MainView.outputText( '\n\nWhen Benoit finally cums he sounds almost pained; his aching cock delivers another load into your already packed womb, semen dribbling and spurting onto the floor.  You work his dick for as long as you can until it finally droops out of your abused cunt.  Finally you crawl into a sitting position and cuddle into the basilisk, who pools onto the floor and responds tentatively.' );
			MainView.outputText( '\n\n"<i>Zat was... wow,</i>" he manages.  With his dick wrung of every last drop of his seed you can see he is returning to himself, and his hand on your shoulder is cautious.  "<i>Was zat... alright for you?  I do not know if... I get zese smells in my \'ead and zen...</i>"  You answer him by kissing him on the cheek and saying with teasing huskiness that it was good, but perhaps next time he shouldn\'t hold back so much.  He grins at this.  You spend a bit more time cuddling whilst recovering from the intense fuck, before finally clambering to your feet.  Your final act before dressing and taking your leave is to dip a lazy finger into your cunt and faintly brush your scent across Benoit\'s nose again, telling him you expect him to be ready and primed the next time this naughty girl pays a visit.  He doesn\'t respond - maybe he is still privately ashamed about losing his cool over you - but you can tell by the lines of his face and the way his head moves unconsciously to follow your path out of his shop that him not being aroused by you isn\'t something you\'re ever going to have to worry about.' );
		}
		CoC.flags[ kFLAGS.BENOIT_TIMES_SEXED_FEMPCS ]++;
		this.benoitKnocksUpPCCheck();
		this.benoitAffection( 2 );
		CoC.player.orgasm();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Take charge: ;
	Benoit.prototype.repeatBenoitFuckTakeCharge = function() {
		MainView.clearOutput();
		if( CoC.player.isTaur() ) {
			MainView.outputText( '\n\nFor the moment you don\'t do anything; you simply stand back and let his hands slowly move across your frame.  One of his hands comes to rest upon your [nipple]; as he gently teases and kneads the soft, sensitive flesh his other hand drift downwards, across your belly, then slowly back along your vast equine frame.  Although he is familiar with your frame by now Benoit never seems to stop being enthralled by your body; there is an unconscious frown of concentration on his face as his smooth hands move across your warm skin, as if he were mapping you in his mind\'s eye.' );
			//[Herm:;
			if( CoC.player.isTaur() ) {
				MainView.outputText( '\n\nHis hands travel downwards until, with a small grin, he finds what he knows is there.  He wraps his dry, smooth grasp around your semi-erect cock and moves it up and down, rubbing and coiling you until you are straining.  You close your eyes and sigh, enjoying the masterful treatment that both of you can only feel, not see.' );
			}
			MainView.outputText( '\n\nHis hands trail upwards, moving over your bestial behind, exploring your soft flesh until he touches your lips.  You close your eyes and sigh as he slowly parts them with his smooth fingers and slides into your [vagina].  Although his breath is becoming increasingly heavy he also seems genuinely curious about you; with surprising gentleness his fingers travel over and around your moistening sex, exploring your every fold, working deeper and deeper as he does.  You let him know what pleases you by sighing when he touches a sweet spot, moving deliberately with his finger\'s motions so he may give them better attention.  He soon finds your [clit], beginning to bulge with need; slowly he circles it and then flicks at it, gently frigging you.' );
			if( CoC.player.inHeat ) {
				MainView.outputText( '  By now your vagina is practically gushing, your bodies\' own deep seated pheromone need stoked to blazing heights by the basilisk\'s gentle, painstaking exploration of your body.  You cannot stop thrusting yourself against his soaked hand, announcing how badly you want this with heavy moans.' );
			}

			MainView.outputText( '\n\nThe scent of your arousal is in the air and as Benoit breathes it in his own breath comes heavier.  His erection bulges in his long johns and you decide it\'s time for you to take charge; you back up, butting him insistently with your powerful body until you have him pinned against a space upon the opposite wall.  You watch him over your shoulder as he unbuckles himself and lets his trousers fall.  Stoked by the pheromones simmering off your body, his long, thin purple erection is straining and he arches his back and opens his mouth as you flare your [butt] and press yourself against it.  You know just from looking at his intense arousal you\'re going to have to go slow to stop him from shooting his bolt straight away; with a wicked smile your partner can\'t see, you suppose such is your effect on him it may not even matter if he does.  Still, as he lays his hands upon your flanks, and with a sigh you lead back and slowly slide his length into your moistened [vagina], it is as gently as you can.' );
			MainView.outputText( '\n\nBenoit\'s dick is incredibly smooth and you move down onto it with incredible, slick ease.  Rather than burying yourself onto it straight away you stop with only a third of it in your wet depths and slowly bring it out of you, dipping yourself slowly.  You stop with his sensitive head just inside and work your [hips] around deliberately, sighing as it rotates slowly around your slick walls.  Benoit moans dryly and you feel his body tense; immediately you stop your movements and wait, only gradually beginning to gyrate and thrust again when he has calmed down.  You slide more of him into you when you bend forwards again, this time leaving only his base outside of you; you sigh as you feel him creeping further into your moist depths.  He makes a bestial noise and tries to thrust himself into you and upon you; tutting mockingly, you pull yourself away from him and stop moving until, with what is evidently a huge force of will, the basilisk calms himself, backs himself against the wall and allows you to work him.' );
			MainView.outputText( '\n\n' );
			//[Small capacity:];
			if( CoC.player.vaginalCapacity() < 30 ) {
				MainView.outputText( 'You slide back down onto him, cooing this time as you feel him bottom out with several inches of him still outside of you.  His thin, long length could not be more perfect for your tight sex; he rubs your walls up and down as you dreamily thrust in and out of his body, sending waves of pleasure flowing through you.' );
			}//Large capacity: ;
			else {
				MainView.outputText( 'You slide back down onto him, cooing this time as your groin meets his muscular thighs with a wet kiss, your sex swallowing his cock whole.  You begin to ride him hard and slow, bending his cock upwards to push at your sensitive walls, waves of pleasure starting to flow through you.' );
			}

			MainView.outputText( '\n\nYou keep at this slow ride for what feels like hours, stopping and starting, pulling and pushing deliberately to keep the basilisk you have backed into a corner under your control.  The pace of the fuck is clearly agonising for Benoit; he pants, tenses and gasps to the wet movement of your [vagina], his face and chest red with extreme arousal, but he lets you stay in control, eventually unable to do anything but lie back and let you have your way with him.' );
			CoC.player.cuntChange( 14, true, true, false );
			//[Lactation: ;
			if( CoC.player.lactationQ() >= 50 ) {
				MainView.outputText( '  The slow, sensual sex is enough for you to begin to bead milk from your sensitive [nipples]; you moan as the flow intensifies until you are instinctively kneading your [chest], spurting your sweet, warm fluids onto the floor.  Benoit starts in genuine amazement at the sound.  “Mammals are so damn weird,” he mutters, making you giggle.' );
			}
			MainView.outputText( '\n\nYour lust ratchets up as his warm hands continue to move over your behind, and at last losing your discipline you begin to thrust into him with abandon, eager now for your peak.  Benoit pants as you really begin to fuck him and thrusts with you; the wetness of your arousal spatters against his thighs as your body slaps into the basilisk\'s tight muscles.  He makes a harsh, bestial noise when he cums; his blind eyes roll as he clutches your back and shoots surge after surge of cum into your churning depths.  The warmth of his jizz and his helpless bucking thrust you to your own orgasm; irrepressible pulses of pleasure overwhelm your mind and you can do nothing for long minutes except cry and squeal against the basilisk, clutching him back as you work his dick for every last drop.' );
			//[Herm: ;
			if( CoC.player.hasCock() ) {
				MainView.outputText( '  [EachCock] thickens and spurts in sympathy to your female high, spattering the floor with white paint.' );
			}

			MainView.outputText( '\n\nYou puddle onto the packed earth floor and cuddle for a while, holding each other as you bask in the afterglow, silently listening to the far away bustle and clatter of the carnival.' );
			MainView.outputText( '\n\n“I am not really sure what I did to deserve you,” says Benoit eventually, his voice barely above a raspy murmur in his throat.  You give him a playful dig in the ribs and say you\'re only in it for the counter sceptic.  He grins and the two of you get up, get dressed, and go your separate ways.' );
		} else {
			MainView.outputText( 'For the moment you don\'t do anything; you simply stand back and let his hands slowly move across your frame.  One of his hands comes to rest upon your ' + Descriptors.nippleDescript( 0 ) + '; as he gently teases and kneads the soft, sensitive flesh his other hand drift downwards, across your belly, around over the crack of your [butt] then down to cup your behind.  Although he is familiar with your frame by now Benoit never seems to stop being enthralled by your body; there is an unconscious frown of concentration on his face as his smooth hands move across your warm skin, as if he were mapping you in his mind\'s eye.' );
			if( CoC.player.hasCock() ) {
				MainView.outputText( '\n\nHis hands travel downwards until, with a small grin, he finds what he knows is there.  He wraps his dry, smooth grasp around your semi-erect cock and moves it up and down, rubbing and coiling you until you are straining.  You decide it\'s time to do some feeling yourself; you grasp and pinch at his tight, supple behind through his trousers, making him gasp as you move into him.' );
			}
			//begin copypasta;
			MainView.outputText( 'His hands trail further down, moving into your inner thighs, exploring your soft flesh until he touches your lips.  You close your eyes and sigh as he slowly parts them with his smooth fingers and slides into your [vagina].  Although his breath is becoming increasingly heavy he also seems genuinely curious about you; with surprising gentleness his fingers travel over and around your moistening sex, exploring your every fold, working deeper and deeper as he does.  You let him know what pleases you by sighing when he touches a sweet spot, moving deliberately with his finger\'s motions so he may give them better attention.  He soon finds your [clit], beginning to bulge with need; slowly he circles it and then flicks at it, gently frigging you.' );
			if( CoC.player.inHeat ) {
				MainView.outputText( '  By now your vagina is practically gushing, your body\'s own deep-seated pheromone need stoked to blazing heights by the basilisk\'s gentle, painstaking exploration.  You cannot stop yourself thrusting against his soaked hand, announcing how badly you want this with heavy moans.' );
			}

			MainView.outputText( '\n\nThe scent of your arousal is in the air and as Benoit inhales it, his own breath comes heavier.  His erection bulges in his long johns and you decide it\'s time for you to take charge; you push him against the wall, unbuckle him and let his trousers fall.  Stoked by the pheromones simmering off your body, his long, thin, purple erection is straining and he arches his back and opens his mouth as you lay a hand on it.  You know just from looking at his straining prick you\'re going to have to go slow for him not to shoot his bolt straight away; with a wicked smile your partner can\'t see, you suppose that such is your body\'s effect on him it may not even matter if he does.  Still, as you once again lay his hands upon you, brace him against the wall and, with a sigh, slowly slide his length into your moistened [vagina], it is as gently as your eagerness can stand.' );
			CoC.player.cuntChange( 10, true, true, false );
			MainView.outputText( '\n\nBenoit\'s dick is incredibly smooth and you move down onto it with slick ease.  Rather than burying yourself onto it straight away, you stop with only a third of it in your wet depths and bring it out of you, dipping yourself slowly.  You stop with his sensitive head just inside and work your [hips] around deliberately, sighing as it rotates around your slick walls.  Benoit moans and you feel his body tense; immediately you halt your movements and wait, only gradually beginning to gyrate and thrust again when he has calmed down.  You slide more inside when you bend forwards again, this time leaving only his base outside of you; a sigh rolls from you as you feel him creeping further into your moist depths.  He makes a bestial noise and tries to thrust himself into you and upon you; tutting mockingly, you pull yourself away from him and stop moving until, with what is evidently a huge force of will, the basilisk calms himself, backs himself against the wall and allows you to work him.' );
			//[Small capacity: ;
			if( CoC.player.vaginalCapacity() < 30 ) {
				MainView.outputText( '\n\nYou slide back down onto him, cooing this time as you feel him bottom out with several inches still outside.  His thin member could not be more perfect for your tight sex; he rubs your walls up and down as you dreamily thrust in and out of his body, sending waves of pleasure washing through you.' );
			} else {
				MainView.outputText( '\n\nYou slide back down onto him, cooing this time as your groin meets his muscled thighs with a wet kiss, your sex swallowing his cock whole.  You begin to ride him hard and slow, bending his cock upwards to push at your sensitive walls, waves of pleasure starting to wash through you.' );
			}

			MainView.outputText( '\n\nYou keep at this for what feels like hours, stopping and starting, pulling and pushing deliberately to keep the basilisk you have backed into a corner under your control.  The pace of the fuck is clearly agonising for Benoit; he pants, tenses and gasps to the wet movement of your [vagina], his face and chest heaving with extreme arousal, but he lets you stay in command, eventually giving up on anything but lying back and letting you have your way with him.  To give him something to do, you grab his hands and lay them upon your [chest]; after exploring your flesh for a time, he finds your [nipple]s and begins to knead them, placing each nub between two fingers and rubbing them insistently.' );
			//[Lactation: ;
			if( CoC.player.lactationQ() > 100 ) {
				MainView.outputText( '  You moan as your breasts reward his attention with spurts of milk; he starts in genuine amazement when they ' );
				if( !CoC.player.isTaur() ) {
					MainView.outputText( 'hit him in the face' );
				} else {
					MainView.outputText( 'trickle over his fingers' );
				}
				MainView.outputText( '.  "<i>Mammals are so damn weird,</i>" he mutters, making you giggle.' );
			}
			MainView.outputText( '\n\nYour lust ratchets up as his warm hands continue to move, and at last losing your discipline you thrust into him with abandon, eager now for your peak.  Benoit pants as you really begin to fuck him and begins to thrust with you; you clutch his neck and bite into his shoulder as you pound into each other, the wetness of your arousal spattering against his thighs as your body slaps into the basilisk\'s tight muscles.  He makes a harsh, bestial noise when he cums; his blind eyes roll as he clutches your back and shoots surge after surge of cum into your churning depths.  The warmth of his jizz and his helpless bucking thrust you to your own orgasm; irrepressible pulses of pleasure overwhelm your mind and you can do nothing for long minutes except cry and squeal on top of the basilisk, clutching him back as you work his dick for every last drop of cum.' );
			if( CoC.player.hasCock() ) {
				//[(not horse);
				if( !CoC.player.isTaur() ) {
					MainView.outputText( '  Stuck between your two burning bodies, y' );
				} else {
					MainView.outputText( 'Y' );
				}
				MainView.outputText( 'our ' + Descriptors.cockDescript( 0 ) + ' spurts in sympathy to your female high, soaking ' );
				if( !CoC.player.isTaur() ) {
					MainView.outputText( 'both of you' );
				} else {
					MainView.outputText( 'the dry dirt' );
				}
				MainView.outputText( ' with white.' );
			}
			MainView.outputText( '\n\nYou puddle onto the packed earth floor and cuddle for a while, holding each other as you bask in the afterglow, silently listening to the far away bustle and clatter of the carnival.' );
			MainView.outputText( '\n\n"<i>I am not really sure what I did to deserve you,</i>" says Benoit eventually, his voice barely above a raspy murmur in his throat.  You give him a playful dig in the ribs and say you\'re only in it for the counter sceptic.  He grins and the two of you get up, get dressed, and go your separate ways.' );
		}
		this.benoitKnocksUpPCCheck();
		this.benoitAffection( 2 );
		CoC.flags[ kFLAGS.BENOIT_TIMES_SEXED_FEMPCS ]++;
		CoC.player.orgasm();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Bas. Womb (not for horses);
	Benoit.prototype.tryToConvertToBassyWomb = function() {
		MainView.clearOutput();
		//[Ingredients not in inventory: ];
		//A double dose of ovi-elixer, a bottle of reptilum, goblin ale and some basilisk blood would probably do...;
		if( !(CoC.player.hasItem( ConsumableLib.OVIELIX, 2 ) && CoC.player.hasItem( ConsumableLib.REPTLUM ) && CoC.player.hasItem( ConsumableLib.GOB_ALE )) ) {
			MainView.outputText( 'You don\'t have the necessary ingredients to attempt this yet.  You recall ' + this.benoitMF( 'Benoit', 'Benoite' ) + ' mentioning that you would need Reptilum, two Ovi Elixirs, and Goblin Ale.' );
			EngineCore.doNext( this, this.benoitIntro );
		}
		/*else if(CoC.player.isTaur()) {
		 MainView.outputText('"<i>Forgive me, [name],</i>" Benoit says, clearly troubled, as you begin hauling out the ingredients and announcing your plan.  "<i>I sink your body is already stressed enough wis \'aving to pump so little blood so far... I would razer you not take furzer risks on my account until your form is more... compact.  I cannot be a part of zis... \'owever much I would like to.  You mean too much to me, you see.</i>"');
		 MainView.outputText('\n\nLeft speechless by his frankness, you can only sweep the items back into your bag.');
		 //return to shop menu;
		 EngineCore.doNext( this, this.benoitIntro);
		 }*/
		//Ingredients in inventory: ;
		else {
			CoC.player.consumeItem( ConsumableLib.OVIELIX, 2 );
			CoC.player.consumeItem( ConsumableLib.REPTLUM );
			CoC.player.consumeItem( ConsumableLib.GOB_ALE );
			MainView.outputText( 'You ferret out the ingredients you have collected and begin to bang them onto the counter in front of Benoit, telling him that you\'ve got what he needs.  Pierre barks excitedly at the noise.' );
			MainView.outputText( '\n\n"<i>And what is zat?</i>" the basilisk says, bewildered. You explain you can whip something up which will give you a basilisk womb - and hence, female basilisk kids.  Benoit opens his mouth then closes it again; it takes him a while to properly compute these words.  "<i>But... but zat is completely impossible, [name]!</i>" he says eventually, wringing his hands.  "<i>\'Ow do you know you won\'t just poison yourself?  Or, or turn yourself into a newt or somesing?  Please... don\'t \'urt... I should never \'ave said...</i>"  He lapses into silence as you grab a pewter bowl from a nearby shelf and a wooden spoon from a container full of old utensils, and begin to mix the various ingredients together.  You pour the ovi-elixers into the goblin ale, beating them together until a fairly unpleasant sulfuric smell fills the close market stall.  Carefully you dribble the reptilum in whilst continuing to stir, until the smell changes to that of cooking sherry.  You frown at the mixture.  It feels like it\'s missing something...  Casually, you ask Benoit to open his hand to you, whilst plucking a kitchen knife from the utensil container.  He barks in pain as you run the blade across his palm and then hold his hand firmly over the bowl.  Drops of dark red blossom into the mixture, and as you carefully stir the potion turns a green-grey color: the color of Benoit\'s scales.' );
			MainView.outputText( '\n\n"<i>You \'ave been in ze sun too long [name],</i>" says the basilisk harshly, clutching his hand. "<i>Go \'ave a lie down and zen resink drinking whatever it is you \'ave just concocted.  I never asked for you to try zis.</i>" You feel a moment of doubt... but no, you\'ve poured good ingredients into this and you sure as hell aren\'t going to wimp out now.  You give Benoit\'s uninjured hand a reassuring squeeze and say with as much confidence as you can muster that you know what you\'re doing.  With that, you cup the bowl, and with only a moment\'s hesitation, drink deeply.' );
			MainView.outputText( '\n\nThe mixture has a lingering bite of mint overlaying the all-consuming burn of alcohol; you are reminded vaguely of the sticky liqueurs that populated the recesses of cupboards back home.  You smack your lips and plonk the bowl back down with deliberate loudness after you have finished; Benoit clutches the counter tensely as you wait.  You haven\'t died straight away, so that\'s a positive... an immense gurgle comes from your belly and you double over as your insides shift and the contents of your gut churn.  The sensation is not painful exactly but you feel like you\'ve lost all control of your insides; you clutch your sides and try to breathe levelly as your stomach turns upside down and makes a sound like trapped gas.  Eventually you feel something like a bubble form just below your gut; slowly your insides settle as the bubble grows larger and larger, until the sensation slowly fades.  Cautiously you walk back and forth a few times, before poking your tummy.' );
			//[No oviposition:;
			if( CoC.player.findPerk( PerkLib.Oviposition ) < 0 ) {
				MainView.outputText( '  You feel slightly bloated, but otherwise fine; you sense that you can lay eggs of your own volition now.' );
			} else {
				MainView.outputText( 'You feel slightly bloated, but otherwise fine; you sense that were you to get impregnated by basilisk seed, the eggs you produce would be pure basilisk.' );
			}

			MainView.outputText( '\n\n"<i>[name]?</i>" says Benoit nervously.  "<i>Are you all right?  Shall I call ze sawbones? I will call ze sawbones.  \'E is mostly good at taking people apart and putting zem back togezzer again, but I am sure \'e can give you a good purgative if we rush...</i>"  You toy with the idea of staging a dramatic allergic reaction, but deciding not to fray his nerves any further you tell him you feel absolutely fine.  Indeed, stroking your belly, you are almost certain that it worked.' );
			MainView.outputText( '\n\n"<i>Really?</i>"  The basilisk is off his feet and around the counter faster than you gave him credit for.  "<i>You are not just high from ze goblin ale?</i>"  He holds you around the waist and breathes you in slowly.  "<i>You... you are not joking.</i>"  He sounds shell-shocked.  "<i>You really did it.  You... really did mean to do zis.</i>"' );
			//put some tag here to track dis shit.;
			CoC.flags[ kFLAGS.BENOIT_TESTED_BASILISK_WOMB ] = 0.5;
			//[Lust 30 or more: ;
			if( CoC.player.lust >= 33 ) {
				MainView.outputText( '  You grin and say you\'re not sure it worked, but you suppose there\'s only one real way of finding out...' );
				if( CoC.player.tallness <= 78 && !CoC.player.isTaur() ) {
					MainView.outputText( '  The basilisk is still for a moment, and then with a sudden surge of movement, grabs you by the waist and hoists you over his shoulder.  You squeal in mock terror as he hauls you as fast as he can into the back room, knocking over half his stock as he does.' );
				} else {
					MainView.outputText( '  The basilisk is still for a moment, and then with a sudden surge of movement, grabs you by the waist and frenetically attempts to hoist you over his shoulder.  You are far too big for him though; after several valiant attempts, he collapses against a shelf.  Laughing, you pick the stricken, panting reptile up, hoist him over your own shoulder, and navigate a path into the back room.' );
				}
				EngineCore.doNext( EngineCore.createCallBackFunction( this, this.suggestSexAfterBasiWombed, false ) );
				return;
			} else {
				MainView.outputText( '  You grin and say you\'re not even sure it worked... but you\'ll be back at some point to try it out, and he\'d better be ready for when you do.  You gently pry yourself out of his grip and leave as deliberately as you can, aware of the beguiling, invisible scent you are leaving for the stunned, silent basilisk to simmer in.' );
			}
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		}
	};

	Benoit.prototype.suggestSexAfterBasiWombed = function( later ) {
		MainView.clearOutput();
		//Subsequent "<i>Suggest</i>" if initial sex option not taken: ;
		if( later === undefined || later ) {
			MainView.outputText( 'You smile coquettishly and ask if he\'s interested in taking your new body for a... test drive.  ' );
			//(6'6 or less: ;
			if( CoC.player.tallness <= 78 && !CoC.player.isTaur() ) {
				MainView.outputText( 'The basilisk is still for a moment, and then with a sudden surge of movement, grabs you by the waist and hoists you over his shoulder.  You squeal in mock terror as he hauls you as fast as he can into the back room, knocking over half his stock as he does.' );
			} else {
				MainView.outputText( 'The basilisk is still for a moment, and then with a sudden surge of movement, grabs you by the waist and frenetically attempts to hoist you over his shoulder.  You are far too big for him though; after several valiant attempts, he collapses against a shelf.  Laughing, you pick the stricken, panting reptile up, hoist him over your own shoulder, and navigate a path into the back room.' );
			}
			MainView.outputText( '\n\n' );
		}
		if( !CoC.player.isTaur() ) {
			//Both go to: ;
			if( CoC.player.tallness > 78 ) {
				MainView.outputText( 'You haul your lizard boy into the cramped space of the backroom before gently setting him down.  Now that your gut has settled you feel imbued with an odd, ripe sensation; your belly bulges ever-so-slightly with unfertilized eggs and you feel red, soft and ready.  You begin to disrobe eagerly; having recovered himself slightly, Benoit shrugs out of his trousers, reaching out to you before stopping.  Grinning kindly at the emasculated basilisk, you lower yourself onto the floor, spread your [hips] casually and then ask if he see... smells anything interesting.' );
			} else {
				MainView.outputText( 'Benoit staggers into the back room, bumping into several things as he sets you down, thankfully onto a clear space on the ground.  He leans into you, his weight pushing you onto the ground, hands flying over your [armor], fumbling off clasps and belts when he finds them.  Now that your gut has settled you feel imbued with an odd, ripe sensation; your belly bulges ever-so-slightly with unfertilized eggs and you feel red, soft and ready.  You work with him, wriggling out of your clothes and ripping his own trousers off, spreading your [hips] eagerly as his long, smooth prick springs to attention.' );
			}

			MainView.outputText( '\n\nThe basilisk needs no further invitation.  In a moment he is upon you, his tight, muscled chest pressed against your [chest], his flat stomach rubbing over your own fertile belly and the head of his dick pushed against your moist lips.' );
			if( CoC.player.hasCock() ) {
				MainView.outputText( '  He deliberately rubs himself up and down your body, and the [cock] trapped between your warm bodies quickly hardens against the warm, smooth friction.' );
			}
			MainView.outputText( '  Despite his blindness, he slides straight into your moist depths, making you coo as his hard, smooth spur glides across your sensitive walls, slowly bringing himself out before thrusting himself in again, working more and more of his length into you.  Never quite able to control himself around your body, it\'s obvious in the strain in his face and the raggedness of his breath against your skin that he is exercising every restraint he has not to fuck you into the ground; he pushes his dick upwards with each return thrust to bump deliberately against your [clit], sending irresistible spasms of pleasure chiming through you.  Pushed inexorably upwards you curl an arm around his neck, kiss his nose and grit your teeth, then whisper into his ear to stop holding back.  Benoit pauses for a moment to gather his breath, hilted entirely in your wet cunt, then hooks his hips around yours, entrapping you around his body, before beginning to fuck your softened, ripe body like a jackhammer.  He pounds into you with everything he\'s got, clenching you as your gushing [vagina] deliriously spatters fluids across your entwined bodies.  Lost in rut now, Benoit licks your face with his long tongue, the soft, sticky pressure against your reddened cheeks only seeming to make the contrasting sensation of his long prick taking you deep even more overwhelming.' );
			CoC.player.cuntChange( 14, true, true, false );
			MainView.outputText( '\n\nYou cannot stop yourself from screaming as your orgasm hits, your pussy clenching and wringing Benoit\'s smooth dick as he continues to slam himself into you until he can take your milking no longer and cums in sympathy, clutching you as he fountains thick, warm cum into your fertile depths.  Having your lower body held in place like this makes your orgasm all the more overpowering; you wriggle futilely against the basilisk\'s strong legs, unable to thrash away the unbearable pleasure.' );
			MainView.outputText( '\n\nAfter minutes of being locked in orgasm together, you finally ride the last of it out.  You stay entwined for the moment, your hands roaming over each other as you enjoy the afterglow.' );
			MainView.outputText( '\n\n"<i>Do you sink it will really work?</i>" says Benoit eventually, his voice so low it is barely above a murmur.  "<i>What if I can only give you males?</i>"  The thought has already occurred to you, but right now you are feeling in a playful mood.  His dick is still inside you and has barely softened, despite the volume of cum it is plugging into you; grinning, you push into his chest and slide your legs over him until you are on top of him.  You very slowly work your hips in a circular motion, back and forth, deliberately working the cock wedged inside of you until it starts to inexorably harden again; Benoit closes his eyes and grunts as you abuse his aching sex.  Not willing to let him simply sit back and take it, you slide your grip around his wrists and silently place them on your [nipples].  He dumbly gets to work, gingerly moving his hands, his fingers pressing deep into your flesh.  As he brushes and squeezes you softly tell him that whether or not you are able to give birth to female basilisks, he\'s the father to your children now, and that mommy needs - you thrust your hips as far as you can, bending his dick backwards to make your point - service.  Lots and lots of service.  Driven by your words and your merciless sex, Benoit closes his eyes, squeezes your nipples between his fingers and helplessly orgasms a second time, spurting one or two more gobs of cum into you before his cock flexes fruitlessly against your sopping walls.' );
			MainView.outputText( '\n\nHaving milked your stud entirely dry, you dismount, clean yourself up and get dressed.  Before you can leave, Benoit feels around and pulls you into a tight hug.' );
			MainView.outputText( '\n\n"<i>Bring ze eggs \'ere,</i>" he says huskily.  "<i>\'Owever zey turn out, I would be honored to raise ze shildren of such a woman as you.</i>"  You give him a playful punch and say he may regret those words when he\'s got a dozen tiny, scaly yous tearing up his shop.  You part and take your leave, his hoarse, slightly scared laughter in your ears.' );
		} else {
			MainView.outputText( 'You haul your lizard boy into the cramped space of the backroom before gently setting him down.  Now that your gut has settled, you feel imbued with an odd, ripe sensation; your horse belly bulges ever so slightly with unfertilized eggs and you feel red, soft and ready.  You begin to shrug your clothes off eagerly; having recovered himself slightly Benoit shrugs out of his trousers, reaching out to you before stopping, blushing furiously.  Grinning kindly at the emasculated basilisk, you lower yourself onto the floor, flare your [hips] casually and then ask if he see... smells anything interesting.' );
			MainView.outputText( '\n\nThe basilisk needs no further invitation.  In a moment he is upon you, his tight, muscled chest is pressed against your [ass], his hands moving over your own fertile belly and the head of his dick pushed against your moist [vagina].' );
			//[Herm:;
			if( CoC.player.hasCock() ) {
				MainView.outputText( '  He deliberately moves his hand over [oneCock] before trapping it in his warm grasp.   It quickly hardens against his warm, smooth friction.' );
			}
			MainView.outputText( '  Used to your body now despite his blindness, he slides straight into your moist depths, making you coo as his hard, smooth spur glides across your sensitive walls, slowly bringing himself out before thrusting himself in again, working more and more of his long length into you.   Never quite able to control himself around your body, it\'s obvious in the strain of the muscles pressed against you and the raggedness of his breath upon your skin that he is exercising every restraint he has not to fuck you into the ground; he pushes his dick downwards with each return thrust to bump deliberately against your [clit], sending irresistible spasms of pleasure chiming through you.  You slowly move forwards until your arms are braced against the wall, before gritting over your shoulder to him to stop holding back.  Benoit pauses for a moment to gather his breath, hilted entirely in your wet cunt, then hooks his strong arms around your back end, entrapping you around his body, before beginning to fuck your softened, ripe body like a jackhammer.  He pounds into you with everything he\'s got, clenching you as your gushing [vagina] deliriously spatters fluids across your entwined bodies.' );
			CoC.player.cuntChange( 14, true, true, false );
			MainView.outputText( '\n\nYou cannot stop yourself from screaming as your orgasm hits, your pussy clenching and wringing Benoit\'s smooth dick as he continues to slam himself into you until he cannot take your milking any longer and cums in sympathy, clutching you as he fountains thick, warm cum into your fertile depths.  Having your lower body held in place like this makes your orgasm all the more overpowering; you wriggle futilely against the basilisk\'s strong legs, unable to thrash away the unbearable pleasure.' );
			MainView.outputText( '\n\nAfter what seems like hours of being locked in orgasm together, you finally ride the last of it out.  You stay entwined for the moment, your hands roaming over each other as you enjoy the afterglow.' );
			MainView.outputText( '\n\n“Do you sink it will really work?” says Benoit eventually, his voice so low it is barely above a murmur. “What if I can only give you males?”  The thought has already occurred to you, but you are feeling in a playful mood.  His dick is still inside you and has barely softened, despite the volume of cum it is plugging into you; grinning, you push backwards, sitting yourself down so that he is trapped under your bestial weight.  You look over your shoulder and lock eyes with him as you very slowly work your powerful hips in a circular motion, back and forth, deliberately working the cock wedged inside of you until it starts to inexorably harden again; Benoit closes his eyes and grunts as you abuse his aching sex.  You softly tell him as you wring him that whether or not you are able to give birth to female basilisks, he\'s the father to your children now and that mommy needs- you thrust your hips as far forwards as you can, bending his dick backwards to make your point - service.  Lots and lots of service.  Driven by your words and your merciless sex, Benoit closes his eyes, clutches your flanks and helplessly orgasms a second time, spurting one or two more gobs of cum into you before his cock flexes fruitlessly against your sopping walls.' );
			MainView.outputText( '\n\nHaving milked your stud entirely dry, you get to your hooves, clean yourself up and get dressed.  Before you can leave, Benoit feels around and pulls your upper half into a tight hug.' );
			MainView.outputText( '\n\n“Bring ze eggs ere,” he says huskily.  “Owever zey turn out, I would be honored to raise ze shildren of such a woman as you.”  You give him a playful punch and say he may regret those words when he\'s got a dozen tiny scaly yous tearing up his shop.  You part and take your leave, his hoarse, slightly scared laughter in your ears.' );
		}
		CoC.flags[ kFLAGS.BENOIT_TESTED_BASILISK_WOMB ] = 1;
		this.benoitKnocksUpPCCheck();
		//(Oviposition perk added);
		CoC.player.createPerk( PerkLib.BasiliskWomb, 0, 0, 0, 0 );
		MainView.outputText( '\n\n(<b>Perk Unlocked: Basilisk Womb - You can now give birth to female basilisks.</b>)' );
		if( CoC.player.findPerk( PerkLib.Oviposition ) < 0 ) {
			CoC.player.createPerk( PerkLib.Oviposition, 0, 0, 0, 0 );
			MainView.outputText( '\n(<b>Perk Unlocked: Oviposition - You will now regularly lay unfertilized eggs.</b>)' );
		}
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_BASILISK ) {
			CoC.player.knockUpForce( PregnancyStore.PREGNANCY_BENOIT, CoC.player.pregnancyIncubation );
		}
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -2 );
	};
	//PC laying;
	//happens only at night, after all other night events;
	//PC lays 2 eggs per 10 points of Fertility they have;
	Benoit.prototype.popOutBenoitEggs = function() {
		if( CoC.player.vaginas.length === 0 ) {
			MainView.outputText( '\nYou feel a terrible pressure in your groin... then an incredible pain accompanied by the rending of flesh.  <b>You look down and behold a new vagina</b>.\n', false );
			CoC.player.createVagina();
			CoC.player.genderCheck();
		}
		MainView.outputText( '\nA sudden pressure in your belly rouses you, making you moan softly in pain as you feel your womb rippling and squeezing, the walls contracting around the ripe eggs inside you.  You drag yourself from your bedding, divesting yourself of your lower clothes and staggering out into the middle of the camp.  Squatting upright, you inhale deeply and start to concentrate.' );
		MainView.outputText( '\n\nA thick, green slime begins to flow from your stretched netherlips, splatting wetly onto the ground below you and quickly soaking into the dry earth.  You settle easily into the rhythm of pushing with your contractions and breathing deeply when they ebb.  The eggs inside you move quickly, lubricated by the strange slime that cushioned them in your womb; sized and shaped just right, the pressure of their passage stretches you in the most delightful way, your [clit] growing erect ' );
		if( CoC.player.hasCock() ) {
			MainView.outputText( 'and [eachCock] starting to leak pre-cum ' );
		}
		MainView.outputText( 'as you find yourself being moved to climax by the birthing.  You see no point in resisting and reach down to begin fiddling with yourself, moaning in pain-spiked pleasure as the stimulus overwhelms you.  With an orgasmic cry, you release your eggs into the world amidst a gush of femcum' );
		if( CoC.player.hasCock() ) {
			MainView.outputText( ' and a downpour of semen' );
		}
		MainView.outputText( '.' );
		MainView.outputText( '\n\nWhen you find yourself able to stand, you examine what it is you have birthed: ' + Utils.num2Text( Math.floor( CoC.player.totalFertility() / 10 ) ) + ' large, jade-colored eggs, the unmistakable shape of reptile eggs.  You pick one up and hold it gently against your ear; inside, you can hear a little heart, beating strong and quick; Benoit\'s child and yours.  You place the egg back down and gather them all up, moving them closer to the campfire to warm while you recover from your exertions.' );
		MainView.outputText( '\n\nWhen the light of day breaks, you gather your newly laid clutch and set off for Benoit\'s shop.  The blind basilisk is asleep when you arrive, forcing you to bang loudly on his door to wake him up.' );
		MainView.outputText( '\n\n"<i>What is it?!</i>" he snarls, displaying his fangs when he pops his head irritably out of the door.  He stops and inhales through his nose, starting lightly when he recognizes your scent.  "<i>Oops!  [name], I am zo sorry, I did not think it would be you.  But why are you here at such an early hour?</i>"' );
		MainView.outputText( '\n\nYou smile at your blind lover and tell him that he\'s a father' );
		if( CoC.flags[ kFLAGS.BENOIT_EGGS ] > 0 ) {
			MainView.outputText( ' once more' );
		}
		MainView.outputText( '.  Well, he will be when this ' );
		if( CoC.flags[ kFLAGS.BENOIT_EGGS ] > 0 ) {
			MainView.outputText( 'latest ' );
		}
		MainView.outputText( 'clutch hatches, anyway.' );
		//First Time: ;
		if( CoC.flags[ kFLAGS.BENOIT_EGGS ] === 0 ) {
			MainView.outputText( '\n\nHe beams with joy, then looks confused.  "<i>But... why have you brought zem \'ere?</i>" he questions.' );
			MainView.outputText( '\n\nYou explain that you don\'t feel your camp is safe enough to keep them there, and Benoit nods.  "<i>Yes, I can see your point... come, give zem \'ere, and I shall look after them for ze both of us.</i>"' );
			MainView.outputText( '\n\nHe opens the door and offers his hand to help lead you in.  He feels around the clutter of his store room until he finds what he\'s looking for: a battered old basket stuffed with a soft pillow.  You raise an eyebrow at the liberal amounts of dog hair the pillow is covered with and Benoit coughs apologetically.' );
			MainView.outputText( '\n\n"<i>\'E isn\'t \'appy about me taking \'is bed, but to \'ell wizzim; \'e always gets is \'air on everysing anyway.</i>"  You spend some time arranging the eggs where they will be safe and warm.  Although you know they can\'t be, Benoit\'s blind eyes seem to be fixed upon the brood when you have finished.' );
			MainView.outputText( '\n\n"<i>And zese eggs are different?</i>" he says hesitantly. "<i>I - we will \'ave... daughters?</i>"  You shrug and say even if they aren\'t female, at least he\'ll have some sons he can keep away from the mountain.  He sets his jaw and nods.' );
			MainView.outputText( '\n\n"<i>If zis works, [name], you \'ave done my people a service I cannot repay.  Even if it doesn\'t, to do zis for me is...</i>" he gestures futilely as words fail him.  "<i>All zis time I \'ave been trading potions, I could \'ave done it myself, and I never did.  Per\'aps I sought I was too much a man or somesing.  Pah!  I was a coward, a cringing coward.  You \'ad ze idea, you \'ad ze courage, you \'ad ze strength, and because of zat, my people \'ave a chance.  Sank you.</i>"  He sounds slightly choked, and stops for a moment.  "<i>It is very, very little, but for you I buy and sell sings at zeir true value.  If zeir is anysing I can do for you, ever, please just say.</i>"  You are slightly embarrassed by his effusiveness and mumble something.  Perhaps aware of the awkwardness, Benoit gestures to the corner where he has put together a serviceable stove from scrap.\n\n"<i>\'Ungry?</i>"' );
			MainView.outputText( '\n\nYou linger long enough to share breakfast with him, and then return to camp.' );
		}
		//Subsequent: ;
		else {
			MainView.outputText( '\n\nBenoit smiles proudly.  "<i>I cannot zank you enough for zis.  Do not worry, I shall keep zem as safe as I ave ze ozzeir clutches.</i>"\n' );
		}
		CoC.player.orgasm();
		CoC.player.knockUpForce(); //Clear Pregnancy
		CoC.flags[ kFLAGS.BENOIT_EGGS ] += Math.floor( CoC.player.totalFertility() / 10 );
	};
	//Feminising;
	//Opening Talk;
	//Requires: Affection 40+, Have already talked to Benoit at least once, have not had sex with Benoit;
	Benoit.prototype.femoitInitialTalk = function() {
		MainView.clearOutput();
		MainView.outputText( 'You ask Benoit if he has ever thought about trying to do something to help his people\'s plight.' );
		MainView.outputText( '\n\nThe basilisk is silent for a time, running his claws along the counter pensively.  "<i>Yes,</i>" he says eventually, in a quiet tone.  "<i>I \'ave.  Away from ze mountains, I \'ave \'ad time to sink.  I am not ze demons\' slave anymore, and I am a funny joke of a basilisk anyway, so I \'ave often thought about making certain... zacrifices.  If we \'ad just one female, away from zeir corruption, zen...</i>" he tails off, shrugging unhappily.  "<i>But I just torment myself sinking about zis, [name].  Ze demons made us very resistant to change.  I would need somesing very powerful for me to become... somesing useful.</i>"' );
		/*
		 if (CoC.player.hasItem(ConsumableLib.BIMBOLQ)) {
		 MainView.outputText('\n\nA certain pink, effervescent liqueur suddenly feels very heavy in your pouch.  That would certainly be powerful enough to give Benoit what he wants... along with a lot of side effects.');
		 MainView.outputText('\n\n("<i>Bimbofy</i>" option added to ' + this.benoitMF('Benoit\'s','Benoite\'s') + ' menu.)');
		 CoC.flags[kFLAGS.BIMBO_FEMOIT_UNLOCKED] = 1;
		 }
		 */
		if( CoC.player.inte >= 60 ) {
			MainView.outputText( '\n\nYou reckon that even a resistant creature could be made to transform to the opposite sex, with a strong enough potion, and ask Benoit about it.' );
			MainView.outputText( '\n\n"<i>Well... if you got a double dose of purified zuccubus milk, a large pink egg, zome ovi-elixir and some reptilum, you could probably do it...</i>"' );
			MainView.outputText( '\n\n("<i>Feminize</i>" option added to ' + this.benoitMF( 'Benoit\'s', 'Benoite\'s' ) + ' menu.)' );
			CoC.flags[ kFLAGS.FEMOIT_UNLOCKED ] = 1;
		} else {
			MainView.outputText( '\n\nYou rack your brain but can\'t think of anything that could help Benoit, so end up simply sympathising with him.  "<i>Do not beat yourself up over it,</i>" says the basilisk, with a smile.  "<i>It is a foolish dream.  And anyway, I told you: we are a race of bastards.  We are ze last guys who deserve someone sinking after us.</i>"' );
		}
	};
	// Feminise;
	Benoit.prototype.benoitFeminise = function() {
		MainView.clearOutput();
		// Ingredients not in inventory;
		if( !CoC.player.hasItem( ConsumableLib.P_S_MLK, 2 ) || !CoC.player.hasItem( ConsumableLib.L_PNKEG ) || !CoC.player.hasItem( ConsumableLib.OVIELIX ) || !CoC.player.hasItem( ConsumableLib.REPTLUM ) ) {
			MainView.outputText( 'You don\'t have the necessary ingredients to attempt this yet.' );
			MainView.outputText( '\n\n<b>(Requires 2x Purified Succubus Milk, 1x Large Pink Egg, 1x Ovi Elixir, 1x Reptilium.)</b>' );
		} else {
			CoC.player.destroyItems( ConsumableLib.P_S_MLK, 2 );
			CoC.player.destroyItems( ConsumableLib.L_PNKEG, 1 );
			CoC.player.destroyItems( ConsumableLib.OVIELIX, 1 );
			CoC.player.destroyItems( ConsumableLib.REPTLUM, 1 );
			MainView.outputText( 'You ferret out the ingredients you have collected and begin to bang them onto the counter in front of Benoit, telling him that you\'ve got what he needs.  Pierre barks excitedly at the noise.' );
			MainView.outputText( '\n\n"<i>I - what?</i>" the basilisk says, bewildered.  "<i>But... [name], zat was just fantasy!  I was not expecting you to...</i>"  He lapses into silence as you grab a pewter bowl from a nearby shelf and a wooden spoon from a container full of old utensils, and begin to mix the various ingredients together.  You crack the egg against the bowl and then beat it into the milk; the goop takes on a pink cake-mix texture until you pour in the ovi-elixir, which thins it as well as filling the close market stall with a rather bad, sulfuric smell.  Carefully you drip in the reptilum whilst continuing to stir; eventually the liquid in front of you takes on a livid lime color.  When the scent changes to that of cooking sherry you stop and step back to admire your handiwork, before pushing the bowl gently across the counter until it touches the basilisk\'s claws.  He slowly clasps his fingers around it, staring blindly into the concoction.' );
			MainView.outputText( '\n\n"<i>And you sink zis will actually work?</i>" he says eventually.  "<i>Zat it will... change me?</i>" You honestly have no idea - and you\'re quite glad Benoit can\'t see the color of it - but you tell him as confidently as you can that it will.  He sighs raggedly, his claws trembling slightly.  "<i>Oh well, what is the worst that it could do - make me deaf?</i>"  A look of horror settles on his face as the words leave his mouth, but he manages to shake the thought away and lifts the bowl to his lips.  "<i>Sante,</i>" he manages with a small smile, and then drinks.' );
			MainView.outputText( '\n\nYou watch as the potion slides into his mouth and down his gullet.  When it is all gone he sets the bowl down and licks his lips thoughtfully.' );
			MainView.outputText( '\n\n"<i>Well... not ze worst sing I have ever tasted,</i>" he says. "<i>It could \'ave used more alcoh-hol zo.  Uh.  Uhhhhhhh...</i>"  He clenches the desk as a tremendous gurgling sound emanates from his gut.  Pierre whines, and unconsciously both you and the dog back away from the basilisk as he begins to twitch and spasm.  There is a grinding noise as his bones begin to shift; although he is holding onto the counter as hard as he can, he cannot stop knocking bottles and trinkets onto the floor as his flesh begins to move.  His torso sucks in, a great deal of mass moving downwards; the sound of long johns giving at the seams trades with an unpleasant cracking and popping sound as his shoulders shift inwards.  There is a sprouting sound as iridescent red feathers emerge upon his crown; below his clenched teeth and eyes, his jaw line softens and moves upwards.  The basilisk\'s now slighter front bulges faintly, and with that the transformation stops, or at least the transformation you can readily observe.  Judging by the way his gut continues to groan and the way he continues to clutch the wooden surface hard enough to leave yet more claw marks, something fairly significant is happening in the ruins of Benoit\'s long johns.' );
			MainView.outputText( '\n\n"<i>Zut.  Fucking.  Alors,</i>" the basilisk manages at last.  The creature\'s voice has gone up by several octaves; although it is still deep, it now sounds rather... husky.  "<i>Zat was almost as bad as zat time I tried goblin food.  Is... is zat me?</i>" Benoit puts a claw to his... no, her throat in a panic.  Her hands then roam downwards and upwards, each new protuberance and crevice discovered amplifying her disquiet.  "<i>Zis... zis can\'t be real,</i>" she mutters.  "<i>Zis can\'t actually \'ave \'appened...</i>"  She turns as if to try and shake herself out of a dream, and knocks over a pile of books with her behind.  Your one salient thought as you watch is that whatever else you\'ve managed to do to the blind basilisk, she certainly has it going on now.  She stands in the fairly impressive mess the two of you have created wringing her hands, apparently unwilling to move her new physique around for fear of knocking over even more of the stock.' );
			MainView.outputText( '\n\n"<i>C... could you come back tomorrow?</i>" says Benoit unevenly.  "<i>Zis is... I need some time to get my \'ead around zis.</i>"  You put the books back on the counter, scratch a terrified-looking Pierre behind the ear, and take your leave.' );
			CoC.flags[ kFLAGS.FEMOIT_NEXTDAY_EVENT ] = CoC.time.days + 1;
			CoC.flags[ kFLAGS.FEMOIT_NEXTDAY_EVENT_DONE ] = 1;
			EngineCore.menu();
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		}
	};
	Benoit.prototype.femoitNextDayEvent = function() {
		MainView.clearOutput();
		CoC.flags[ kFLAGS.BENOIT_STATUS ] = 1;
		CoC.flags[ kFLAGS.FEMOIT_NEXTDAY_EVENT_DONE ] = 2;
		MainView.outputText( 'A strange, faint sound is emanating from the salvage shop.  It\'s only when you duck cautiously into the stall proper that you realize it\'s the sound of a basilisk humming.  Benoit stops to sniff the air when you come in, immediately puts down the mug she is polishing, and beckons you inside.' );
		MainView.outputText( '\n\n"<i>[name]!</i>" she says brightly.  "<i>Do not be standing around zere!  Come in, I want to talk to you.</i>"  You work your way to the counter and take her in.  She is wearing a beret instead of a fez, and an apron over her front, which combine to more or less disguise her new feathers and small, ornamental chest bumps.  However it is easy, or at least it is to you, to notice in the basilisk\'s jaw-line and considerable new hips and butt that her gender has definitely changed... you can only assume that her sex has as well, concealed under that apron.  She doesn\'t seem to mind you checking her out, or maybe she just doesn\'t realize.  You ask how Ben- you stop.' );
		MainView.outputText( '\n\n"<i>You can call me Benoite.  Ben - oy,</i>" she says, smiling.  "<i>Zat is easy to adapt to, yes?  And I am fine.  Better zan fine; your potion worked perfectly.  I feel like I \'ave a new life now - before I was a sad excuse of a basilisk, going nowhere.  Now I \'ave a purpose.  A raison d\'etre.  Also, being female \'as made me realize \'ow badly zis place needs a clean.  I get more customers now!</i>"' );
		MainView.outputText( '\n\nShe leans across the counter, her smile fading.  "<i> Seriously, [name], you \'ave done my people a service I cannot repay.  I can lay eggs, zere can be more female basilisks, away from Lethice and \'er thugs.  All zis time I \'ave been trading potions, I could \'ave done it myself, and I never did.  Per\'aps I sought I was too much a man or somesing.  Pah!  I was a coward, a cringing coward.  You forced me to decide, and because of zat, my people \'ave a chance.  Sank you. </i>"' );
		MainView.outputText( '\n\nShe sounds slightly choked, and stops for a moment. "<i> It is very, very little, but for you I buy and sell sings at zeir true value.  If zere is anysing I can do for you, ever, please just say. </i >"  You are slightly embarrassed by her effusiveness and mumble something along the lines of it being all her doing.  Perhaps aware of this, Benoite sits back down, hatches her fingers and smiles at you primly.  "<i> Now... is ' + CoC.player.mf( 'sir', 'madam' ) + ' buying or selling? </i>" ' );
		//[Benoite buys at same rate Oswald does and sells at a 33% discount];
	};
	//Benoite Interactions;
	Benoit.prototype.femoitFirstTimeNo = function() {
		MainView.clearOutput();
		MainView.outputText( 'You let her down as kindly as you can.' );
		MainView.outputText( '\n\n“<i>No, you are right,</i>” she says in a casual tone, although the color is still very high in her scales. “<i>It would be way too weird zat, wouldn’t it? I will find someone though, never fear.  As I said before...</i>” Benoite points two fingers at her blind eyes and then at the stall entrance.  There’s a distinct gleam in those cloudy grey depths you think would scare the hell out of most things with a penis. “<i>I ‘ave a purpose now.</i>”' );
		MainView.outputText( '\n\nCatching a subtle tone of dissapointment in Benoite\'s voice, you bid her a quick farewell and head back to camp, deciding to give her some time to recover.' );
		EngineCore.menu();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	Benoit.prototype.femoitFirstTimeYes = function() {
		CoC.flags[ kFLAGS.TIMES_FUCKED_FEMOIT ]++;
		MainView.clearOutput();
		MainView.outputText( 'Smiling, you reach across the counter and squeeze Benoite\'s hands until her nervous babble dies out and she smiles back.  Still holding her hand, you move behind the crates and then gently lead her behind the stall\'s canopy.' );
		MainView.outputText( '\n\nWhat passes for Benoite\'s back office is perfect for your purposes; the two wagons between which her stall is sandwiched close together here and the triangular space is filled with crates and unsorted salvage.  You carefully inch your blind charge to a clear cranny and push her against a wooden wall, leaning into her as you gently undo her apron.  The excited bustle, thump and clatter of the carnival sounds like it\'s coming from a million miles away.' );
		MainView.outputText( '\n\n"<i>Zis is so weird,</i>" she mumbles as you drop the garment onto the packed dirt and slowly move your hands up her smooth body to take her beret; you can\'t imagine what\'s going through her head, but looking into Benoite\'s snub lizard face and cloudy grey eyes, you can only agree with the sentiment.  Still... your eyes are drawn to her softer jaw line, her swollen chest and her bright feathers.  The fact that you did this to her, literally emasculated her and that she now wants you to take her, touches something deep and you eagerly begin to peel off your [armor], blood rushing to your groin. ' );
		MainView.outputText( '\n\n"<i>Zis will sound strange,</i>" says Benoite in a shivery voice, as you eventually stand before her naked, "<i>But... would you mind if I just touched you a bit first?  All I know about you is ze sound of your voice.</i>"  You acquiesce and draw close, sighing as she gently lays her hands upon you, holding her index claws back as she begins to move them slowly up and down.' );
		if( CoC.player.isTaur() ) {
			MainView.outputText( '\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  "<i>Good Gods,</i>" she murmurs as her hands lead back onto your flanks.  "<i>Good Gods!</i>" she cries out as she follows you all the way back to your mighty, powerful rear.  "<i>I knew you were a centaur because of all ze clopping,</i>" she says, rubbing your side back and forth in wonder.  "<i>But to know it and actually feel it, zey are very different.</i>"  She sighs.  "<i>Zis is going to be... awkward, but I guess you are probably used to zat by now, yes?</i>"' );
		} else if( CoC.player.isDrider() ) {
			MainView.outputText( '\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  "<i>Good Gods,</i>" she murmurs as her hands lead back onto your abdomen. "<i>Good Gods!</i>" she cries out as she follows your bulging abdomen all the way back to your spinnerets. "<i>I knew you were a spider because of all ze click clacking,</i>" she says, her fingers feeling around one of your intricate, many-jointed legs in wonder 0. "<i>But to know it and actually feel it, zey are very different.</i>"' );
		} else if( CoC.player.demonScore() > 4 ) {
			MainView.outputText( '\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  She touches your horns and pauses; she reaches around, finds and grips your tail, running her grasp up to the spaded point. "<i>So,</i>" she says quietly. "<i>You are one of zem.</i>" She is silent for a while before finding a warm smile. "<i>But I am being zilly.  I know you are different inside.</i>"' );
		} else if( CoC.player.dogScore() >= 4 && CoC.player.earType === 2 && CoC.player.tailType === 2 ) {
			MainView.outputText( '\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  She grins as she finds your floppy ears and outright laughs when she reaches around and touches your tail.  "<i>I like dogs but not ZAT much, "<i>[name],</i>" she giggles.  "<i>No wonder Pierre \'as been acting jealous recently.</i>"' );
		} else if( (CoC.player.bunnyScore() >= 4 && CoC.player.earType === 7 && CoC.player.tailType === 10) || (CoC.player.catScore() >= 4 && CoC.player.earType === 5 && CoC.player.tailType === 8) ) {
			MainView.outputText( '\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  She grins as she finds your ears, outright laughs when she reaches around and touches your soft tail.  "<i>I always wondered why Pierre gets all excited when \'e sees you,</i>" she giggles.' );
		} else if( CoC.player.harpyScore() >= 4 && CoC.player.wingType !== 0 && CoC.player.armType === 1 ) {
			MainView.outputText( '\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  She finds your wings and follows them up as far as she can reach; she carefully shifts her feet forward to touch at your own clawed toes.  "<i>So zis is what irony is,</i>" she murmurs, a smile playing on her lips as she touches your shoulder.  "<i>My saviour is an \'arpy, come to ravish me.</i>"' );
		} else if( CoC.player.beeScore() >= 4 && CoC.player.wingType !== 0 && CoC.player.lowerBody === 7 ) {
			MainView.outputText( '\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  She finds your diaphanous wings and follows them up as far as she can reach, her grip on your sensitive membranes making you twitch a bit; then she sends her hands trailing down your carapace-armored limbs. "<i>I always sought you just liked wearing big boots,</i>" she murmurs. "<i>But zis is actually a part of you?  \'Ow... interesting.</i>"' );
		} else if( CoC.player.gooScore() >= 4 && CoC.player.skinType === 3 ) {
			MainView.outputText( '\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  "<i>I knew you were different from ze squishy sounds you made,</i>" she murmurs as her hands sink into your soft, amorphous mass.  "<i>But zis is... good Gods, zis is strange.  And zis doesn\'t \'urt you at all?</i>" she asks incredulously as she gently pokes a finger into you.  You answer her question by laughing.  "<i>Zat must come in very useful,</i>" she says.  You push yourself slowly up her arms and tell her she has no idea.' );
		} else if( CoC.player.skinType === 2 ) {
			MainView.outputText( '\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  She starts slightly when she touches your scales, and then caresses the reptilian parts of your body with increasing interest.  "<i>You didn\'t do zis just for me, did you [name]?</i>" she murmurs.  "<i>I \'ave to admit - it feels very good.</i>"' );
		} else {
			MainView.outputText( '\n\nHer warm fingers travel over your body, brushing over your face, your belly, your [hips]; you feel as though you\'re being read like a book.  "<i>You \'umans are so squishy, fuzzy and \'ot,</i>" she giggles huskily. "<i>\'Ow can you stand it?</i>"' );
		}

		MainView.outputText( '\n\nBenoite\'s hands travel down your torso until, with a sharp intake of breath, she touches your [cock].  After a pause, she slowly wraps her dry, smooth grasp around your semi-erect cock and moves it up and down, rubbing and coiling you until you are straining.' );
		if( CoC.player.biggestCockLength() <= 10 ) {
			MainView.outputText( '  Although this is evidently an uncanny experience for her, she does manage a cocky smile as her hand moves around your sex.  "<i>Mine was bigger,</i>" she teases.  You reward her cheek by doing some feeling yourself, grasping her large, supple behind, making her squeak as you move into her.' );
		} else {
			MainView.outputText( '  This is evidently an uncanny experience for her, the alien nature of it deepening as her hands moves around your sex. "<i>\'Oly Gods, [name]; you are a monster,</i>" she says thickly.  You smile and decide it\'s time to do some feeling yourself; you grasp her large, supple behind, making her squeak as you move into her.' );
		}

		MainView.outputText( '\n\nThe scent of your arousal is in the air and as Benoite inhales it in her own breath comes heavier.  Still grasping her butt, you spread her hips to reveal her genital slit, gleaming with wetness.  Bracing her against the wall, you press your [cock] against her ready sex.  "<i>Please be gentle,</i>" says a husky, nervous voice below you.  You respond by slowly pushing open her lips and sliding your head into her warmth.' );
		MainView.outputText( 'Benoite\'s pussy is virginally tight and you go as slowly as you can, lightly moving your hips as you work more of your length in.  Sharp claws grasp your back as you feel resistance that gives as you push more of yourself in; blood trickles down your shaft to drip onto the floor.  You keep working her slowly, withdrawing almost completely before sinking yourself in, using your head on the outward pull to tease at the clit hidden in her folds.  Benoite seems almost frozen by what\'s happening; she simply clutches at your back, breathing heavily and allowing you to do all the work.  You don\'t mind; whatever her mind is thinking her body is responding to your methodical treatment, her lips widening and slick moisture oiling your dick as you press into that tight, graspingly tight tunnel.' );
		if( CoC.player.biggestCockLength() < 15 && CoC.player.balls === 0 ) {
			MainView.outputText( '  Eventually you manage to hilt yourself entirely in her depths, your stomach pressing against her own tight belly.' );
		} else if( CoC.player.biggestCockLength() < 15 && CoC.player.balls > 0 ) {
			MainView.outputText( '  Eventually you manage to hilt yourself in her depths, your [balls] pressing into her sex as your stomach bumps into her own tight belly.' );
		} else if( CoC.player.biggestCockLength() >= 15 && CoC.player.balls === 0 ) {
			MainView.outputText( '  Eventually you manage to bottom out, your dick pressed against her cervix.' );
		} else if( CoC.player.biggestCockLength() >= 15 && CoC.player.balls > 0 ) {
			MainView.outputText( '  Eventually you manage to bottom out, your dick pressed against her cervix, your [balls] swinging heavily below your shaft.' );
		}
		MainView.outputText( '  Staying like that for a moment, you slowly withdraw almost all of the way out before pushing all the way in again, continuing the process, your grunts melding with Benoite\'s soft moans at the almost-agonizingly slow sex, exercising all the self-restraint you have not to begin pounding away at the basilisk\'s deliciously tight cunt.  Occasionally you pause at the deepest moment, waiting for your blood to cool down and letting Benoite get used to the sensation of being fully stuffed by you.' );
		MainView.outputText( '\n\nSlowly, eventually, Benoite gets into it, her frozen limbs thawing to your loving, careful movement.  Beginning to pant, she moves her powerful hips with you, trying to draw your dick further into her.  Gratefully you begin to pick up the pace, thrusting into her with increasing force.  Her claws grip your back painfully as she pushes herself into you, the soft leather of her chest bumps squeezing into your [fullChest].' );
		if( CoC.player.isLactating() ) {
			MainView.outputText( ' The pressure and arousal makes your [nipples] dribble milk, spattering fluids across both of your chests.' );
		}
		MainView.outputText( '  Soon the two of you are thrashing into each other, Benoite moaning huskily as you batter her against the wagon wall, both seeking your peak together, each pushing the other a bit further upwards.  Your world is lost to everything but the warm tightness around your [cock] and the pressure against your chest.' );
		MainView.outputText( '\n\nBenoite howls as she orgasms, clutching you for dear life as she pushes as much of herself into you as she can.  The contractions around your cock are too much and with a bestial, wordless sound, you cum.  Your mind superseded by everything but that all-conquering animal imperative to breed, you hilt as much of yourself in Benoite, pushing as much of your seed upwards as you can, delivering rope after rope of cum until it dribbles out of her, dripping onto the floor to mingle with her blood.' );
		MainView.outputText( '\n\nEventually you pulse your last drop and return to yourself; slowly you lower Benoite to her feet.  She staggers slightly and clutches a stack of crates for support, your cum still beading out of her.' );
		MainView.outputText( '\n\n"<i>Phew!</i>" she says after she\'s managed to catch her breath.  "<i>That was... somesing.</i>" You\'re slightly worried you went a bit too far with her, but when she has recovered herself a bit she advances on you with a wide, blissed-out grin.  She feels around until she finds your hands.  You suppose the done thing at this point is to kiss her, but you\'re not entirely sure how to do that.  As you hesitate, she opens her mouth, unrolls her long tongue and licks your face.  The sensation is warm and sticky and you find yourself laughing at the strange tenderness of the gesture. ' );
		MainView.outputText( '\n\n"<i>Sank you for zat, [name],</i>" she says huskily. "<i>Of course, I will need you to do zat again if it doesn\'t take.  And again, once ze first clutch is done.  Basically we will be doing zis a lot.  Purely for ze purpose of procreation, you understand.</i>"  Grinning, you lead her back inside the shop and after squeezing her hand, take your leave.' );
		CoC.player.orgasm();
		EngineCore.menu();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	// Subsequent Sex;
	// Requires: Benoite not pregnant;
	Benoit.prototype.femoitSexIntro = function() {
		MainView.clearOutput();
		MainView.outputText( 'Once again, you take Benoite\'s hand and lead her into the back room.  Your free hand roams underneath her apron as you carefully pick out a path through the junk and Benoite is swiftly in on the game too; her fingers slide downwards to pinch and fondle at her favorite parts of you.  By the time you make it into the storage space you are practically falling over each other, laughing as you fumble off each other\'s clothes.' );
		if( !this.benoitPreggers() ) {
			MainView.outputText( '\n\nBenoite\'s fingers travel down your sides as you lift her apron off her, her warm, smooth touch eventually falling upon your [cock]; already aware of every inch of you she rubs and coils you expertly, softly pumping you until your flesh is straining in her grasp. She circles a feather-light touch around your [cockHead] with one finger ever so gently, grinning slyly as she does.  Grunting with need, you push her insistently down onto the packed soil, shaking out of the last of your underclothes; Benoite spreads her thighs for you, her genital lips widened and moist with readiness.' );
			if( this.benoitInClutch() ) {
				MainView.outputText( '  Her stomach bulges with clutch and the air is thick with female musk; the sight and smell of overwhelming ripeness speaks to your body in a way which bypasses your higher cognition entirely, sending you growling on top her, barely even hearing her giggle.' );
			}
			MainView.outputText( '\n\nYou cup her large, supple behind and push into her wet opening, sighing as you reach a comfortable depth before slowly sliding in and out.  Benoite\'s hands move over you, reminding herself of you with dry, smooth pressure as you find a slow, silky rhythm.  The basilisk arches her back and moans hoarsely as you push more and more of your wick into her depths; she moves with you, wriggling her body to gently work your [cock] this way and that to enhance your sensation.' );
			MainView.outputText( '\n\n' );
			if( CoC.player.biggestCockLength() < 15 ) {
				MainView.outputText( 'Soon you are hilting yourself in her depths, making her gasp as you slap into her.' );
			} else {
				MainView.outputText( 'Soon you are bottoming out in her, making her gasp as your hulking length spreads her wide.' );
			}
			MainView.outputText( '  You quickly pick up the pace as you enter rut, thrusting into your basilisk lover with red-flecked abandon, her powerful thighs working with yours to make each return plunge into her warm depths more gratifying than the last.' );
			MainView.outputText( '\n\n' );
			if( !CoC.player.isTaur() ) {
				MainView.outputText( 'Eventually, sweat dripping off you, you grab her thighs and heave them upwards so that you can really go to town, drawing yourself almost all the way out of her before smacking back into her,' );
				if( !this.benoitInClutch() ) {
					MainView.outputText( ' your stomach beating out a slapping rhythm against her own flat abdomen.  ' );
				} else {
					MainView.outputText( ' your stomach beating out a slapping rhythm against her bulging, gravid abdomen.  ' );
				}
			}
			MainView.outputText( 'Benoite moans, squeals and eventually screams to your exertions, her fluids spurting and spattering against your groin' );
			if( CoC.player.balls > 0 ) {
				MainView.outputText( ' and [balls].  You tumble over your peak as her cunt suddenly tightens around yours, sending surge after surge of cum into her fertile depths, your body seized in a rictus of pleasure.' );
			}
			if( CoC.player.cumQ() >= 2500 ) {
				MainView.outputText( '  The quantity of it is such that it quickly dribbles back out around your cock and pools on the floor.' );
			}
			MainView.outputText( '\n\nAfter you have both rode out the last of your mutual orgasm you lie for a time on the floor tangled together, enjoying the feeling of your smooth, scaly lover.' );
			MainView.outputText( '\n\n"<i>Big, zilly stud,</i>" she says fondly, as she moves her hands, painting a picture of you in this moment she can hold on the walls of her mind for days to come.  Eventually, you get up, redress and quietly take your leave.  In your haze you manage to feel glad that she didn\'t leave quite so many claw marks on your back this time.' );
			this.benoitKnockUp();
			CoC.player.orgasm();
		} else if( this.benoitRegularPreggers() && (!CoC.player.isTaur() || (CoC.player.isTaur() && (CoC.player.tallness * (5 / 6) < CoC.player.cocks[ CoC.player.longestCock() ].cockLength))) ) {
			MainView.clearOutput();
			MainView.outputText( 'Once you are both in the usual spot, neither of you waste any time undressing.  The pregnant basilisk stands there, staring blindly at you, and waiting for you to make the first move, tongue occasionally flicking past her lips to nervously wet them.' );
			MainView.outputText( '\n\nYou use this opportunity to examine your reptilian lover more closely, stepping forward and reaching out with your hands.  You gently trail your fingers across her jawline, then reach up and softly ruffle the feathery crest on her head, making her coo appreciatively.  Your fingers slide down the lines of her body to cup and stroke her small, rounded chest, and then inexorably continue onwards to the hard, round, swollen mass that is her egg-laden belly.  You place your palms flat against the distended orb, feeling the pressure that the sizable clutch is exerting on the interior of her womb, massaging her sides and making her moan softly; you\'d almost swear you can hear her eggs softly clicking as you move them against each other.' );
			MainView.outputText( '\n\n"<i>Enough foreplay; I sought zat we were going to fuck?</i>" she playfully reprimands, and you smirk and nod your head, knowing guiltily that she can\'t see it.  Nimbly you skip around behind her, catching her tail and rubbing it affectionately against your cheek, then tell her to find something sturdy to support her; you want her to kneel down against it.' );
			MainView.outputText( '\n\n"<i>So, zat is what you \'ave in mind?  Kinky ' + CoC.player.mf( 'boy', 'girl' ) + '...</i>" Benoite replies.  Her long tongue flickers out to dart across your other cheek, and then she carefully lowers herself to the ground, making herself comfortable and groaning softly with relief. "<i>I must say, zat is much more better on my poor feet... all zese eggs are \'eavy, you know?</i>"' );
			MainView.outputText( '\n\nYou cup her buttocks, squeezing the delightfully full, feminine globes, and promise her that she\'ll forget all about the weight of her eggs soon enough.' );
			MainView.outputText( '\n\n"<i>Promises, promises,</i>" is the cheeky retort you get, which prompts you to playfully slap her right asscheek with your hand.  Your [cock] is already begining to swell with arousal, and you tantalizingly brush it against the outer lips of Benoite\'s pussy, sliding it back and forth and occasionally bumping its tip into her swollen belly.  Soon, it\'s hard as a rock, and slick with both pre-cum and Benoite\'s feminine equivalent.  The genderbent reptilian moans and growls in the back of her throat, arching her magnificent ass towards you to make it easier for you to tantalise her, your hands instinctively moving to grope and squeeze her luscious cheeks.' );
			MainView.outputText( '\n\n"<i>Enough with ze teasing, put ze damn thing in already!</i>" she barks at you.  She lifts one hand off of the ground and begins to rub and squeeze her chest in frustrated pleasure.' );
			MainView.outputText( '\n\nDeciding you\'ve had enough foreplay, you take a moment to properly position yourself and begin sliding gently into her cool, silky depths, trying to keep calm even as you work yourself deeper and deeper inside her.' );
			if( CoC.player.biggestCockLength() < 15 ) {
				MainView.outputText( '  Soon you are hilting yourself in her depths, making her gasp as you slap into her.' );
			} else {
				MainView.outputText( '  Soon you are bottoming out in her, making her gasp as your hulking length spreads her wide.' );
			}

			MainView.outputText( '\n\nYou take a momentary pause to properly reposition yourself, placing your hands on Benoite\'s butt for assistance in balancing and causing her to place her free hand back on the ground, and then you begin to thrust. She groans and gasps as you slide yourself back and forth inside her, doing her best to meet your thrusts with her own, egg-laden belly sliding back and forth across the floor, the stimulation on her stretched, sensitive scales adding to her pleasure, her tail beating a tattoo of lust against your back.' );
			MainView.outputText( '\n\n"<i>Yez!  Yez, oh, yez!  This iz zo good, [name]!  Oh, fuck... I sink zat I am...</i>"  You feel her rippling, squeezing pussy clenching tighter and tighter around you, striving to milk you dry.  "<i>...I em c-c-cumming!</i>" she cries out as climax ripples through her, belly jiggling against you as the pleasure makes her whole body quiver and shake.  She moans and growls throatily, then gives a gasp of relief, audibly spent...' );
			MainView.outputText( '\n\nBut you\'re not done yet, as enticing a display as that was, and so you continue to thrust, the juices from Benoite\'s orgasm making your cock wonderfully slick and easy to slide into her. Weak-kneed and overstimulated from her recent orgasm, the basilisk can only mewl and groan in equal parts pleasure and desperation.  She strives to massage and milk your cock with her wet cunt, aching to have you fill her with more of your potent seed.  The sight of her like this, her belly swollen with your fertilized clutch, down on her hands and knees and anxious to be bred anyway, is ultimately too much to resist and you find yourself exploding into the reptilian woman\'s snatch, triggering a second orgasm as your cum spurts inside her.' );
			if( CoC.player.cumQ() >= 2500 ) {
				MainView.outputText( '  Because her womb is already so jam-packed with eggs, the bulk of your deposit simply oozes messily back out of her, leaving her well and truly creampied.' );
			}
			MainView.outputText( '\n\nNow it is your turn to slump down in a spent state, though you retain enough control to avoid adding any more weight to your already heavy lover.  The two of you remain there in the backgroom, gathering up your strength, letting the musk of your carnal pleasure roll over your still forms.' );
			MainView.outputText( '\n\nBenoite stirs first.  "<i>Mmm... I guess being so pregnant is not such a bad sing if it means we can have sex like zis...</i>" she murmurs, though it\'s quite obvious she intends for you to hear her. With a groan of effort, she heaves herself back upright.  "<i>Come back and see me any time, lover-' + CoC.player.mf( 'boy', 'girl' ) + ',</i>" she tells you.  "<i>But don\'t sink zat you need me to be pregnant to give me a good time, okay?</i>"  Benoite smirks, striding across the floor and giving you a hand up before delicately flicking her tongue across your lips in a reptilian kiss.' );
			MainView.outputText( '\n\nYou redress yourself, give the trader a hand getting back to the front of the shop without knocking anything over - she may be familiar with her shop, but her distended belly still gives her problems - and then head back to camp.' );
			CoC.player.orgasm();
		} else if( this.benoitVeryHeavyPreggers() || this.benoitExtremePreggers() ) {
			MainView.clearOutput();
			if( CoC.player.isTaur() ) {
				MainView.outputText( '"<i>No.  Non!  Absolutely non!</i>" Benoite insists.  "<i>You are my amazing stallion, [name], but... it is simply too much.  Wis all zis weight on me, zere is simply no way we can do it.</i>"' );
				MainView.outputText( '\n\nShe places a hand on you, working it up to your face cautiously until she\'s holding your cheek.  "<i>Truly, I am sorry.  I am eager to see you again, my \'andsome \'orse... once our children are walking on their own feet.</i>"' );
			} else {
				if( CoC.flags[ kFLAGS.FEMOIT_SPOONED ] === 0 ) {
					CoC.flags[ kFLAGS.FEMOIT_SPOONED ]++;
					MainView.outputText( 'Benoite seems to peer at you, then places her clawed hand gently on her belly. "<i>And I sought my eyes were the ones that didn\'t work... You can surely see how big I am, yes?  Do you really sink you could carry me for the sex?  Because there is no way I can let you sit on my lap with all zese eggs in me.</i>"' );
					MainView.outputText( '\n\nYou assure her that you know a position that will work just fine, if she\'s willing to try.' );
					MainView.outputText( '\n\nThe egg-laden reptilian woman visibly thinks it over, then shrugs. "<i>Well, I guess I\'m willing to try if you are.</i>"  She smirks softly.  "<i>Drat zese \'ormonez; I am too \'orny for my own good.</i>"' );
				} else {
					MainView.outputText( 'Benoite smirks at you.  "<i>Well, I guess ze last time was enjoyable enough.  Come, then; I am horny and you arrived in time to scratch my itch.</i>"' );
				}
				MainView.outputText( '\n\nShe turns around slowly and waddles into the private part of her shop, tail waving over her admirable butt.' );
				MainView.outputText( '\n\nFortunately, Benoite sleeps in her shop these days, so you don\'t have to help her waddle far before she collapses gratefully into her bedding.  "<i>Zut alors, I am such a \'og...</i>" she murmurs, hands trying desperately to measure her huge belly.  While she is doing that, you slip out of your [armor] and then quietly climb into the bed beside her.' );
				MainView.outputText( '\n\nShe starts in shock as your arms wrap around her waist. "<i>Do not sneak up on me like zat!</i>" she complains, her tail slapping forcefully against your [ass] to emphasize her point. You apologize, but neither of you really mean what you\'re saying and you both know that.  You snuggle in close to your reptilian lover, pressing yourself against her back, feeling her cool scales against your [skinFurScales].  Your roving hands caress her chest, making her croon at the attention, and are then drawn magnetically to her impossibly pregnant stomach.' );
				MainView.outputText( '\n\nIt\'s huge and heavy, solid like a rock, the scaly skin stretched so taut over the eggs inside you\'re certain you can actually feel them through her skin. There are too many of them jam-packed in there to actually move, though, signaling just how remarkably gravid Benoite is.  Your examinations are cut off when Benoite suddenly grinds her ass insistently against your crotch. "<i>Ze snuggling is nice, lovair, but I am in ze mood for somesing a leetle more... active,</i>" the basilisk comments, her tone light and airy.' );
				MainView.outputText( '\n\nYou feign offence, asking if it\'s so wrong for you to take such pride in having such an wonderfully, majestically fertile lover, caressing her distended belly with gentle sweeping strokes, sliding your fingers across her sensitive skin.  The basilisk moans softly, shivering with pleasure at the sensation, her tail sliding up to caress your [hips]. "<i>You are such a flatterer,</i>" she tells you.  "<i>Mmm... but I must confess zat zis is quite nice also...</i>" she emphasizes her point by wriggling back against you, doing her best to nestle against your body.' );
				MainView.outputText( '\n\nOne hand continues to trace circles across her egg-laden womb, even as you move the other down to gently cup and squeeze her full bottom, rubbing the base of her tail before creeping down in between her legs. Dampness meets your probing fingers, letting you know your efforts have been rewarded, and you decide to give Benoite something a little more intense. Your [cock] begins to poke into the she-lizard\'s luscious ass, making her laugh that oh-so-filthy laugh of hers.  "<i>And \'ere I sought zat you were just wanting to snuggle?  Well, come on z\'en, my lovair; if you sink you know \'ow to use zat properly?</i>"' );
				MainView.outputText( '\n\nYou hold onto her swollen stomach as you maneuver your cock up under her ass, seeking her feminine orifice. After a few moments, you find yourself properly aligned and begin to gently push yourself in, being careful and patient to ensure that you are not hurting your lover in her most delicate of conditions.  She gasps and sighs as you reach a comfortable depth inside her dripping cunt; too heavy to really move herself, she must submissively take each and every thrust and release as you slide yourself in and out, working yourself progressively deeper inside of her.' );
				if( CoC.player.biggestCockLength() < 15 ) {
					MainView.outputText( '\n\nSoon you are hilting yourself in her depths, making her gasp as you slap into her.' );
				} else {
					MainView.outputText( '\n\nSoon you are bottoming out in her, making her gasp as your hulking length spreads her wide.' );
				}

				MainView.outputText( '\n\nWith a surprising amount of languidness, you gently rock yourself back and forth inside of her, slowly drawing yourself out and then sliding back inside.  The basilisk\'s belly leaves her at your mercy, and you take full advantage of that, playing with her small nipples (after all, what other purpose do they have besides being used for her pleasure?) and stroking her belly.  She hisses and coos, but remains immobile; living proof of your virility, your sheer masculine potency.  Your hands cannot reach far enough to encompass all of her belly, so heavy is she with your offspring, and this merely spurs your pride and your arousal.  Only the need to avoid injuring her or her precious cargo keeps you from rutting her like a wild animal... though her desperate cries as she begs you to go faster, to do it harder, help quench the urges.  She is yours, totally and utterly, and you will have her as you want her.' );
				MainView.outputText( '\n\nSeeing that her pleas aren\'t getting her anywhere, Benoite manages to fight past her lust to try a different tack.  "<i>C-Come on!  Is zis ze cock zat knocked me up?  Ze virile fuckstick zat made all zese eggs?</i>"  She grinds her crotch into you as best she can, her slick cunt hungrily squeezing your intruding cock.  "<i>I am not ze nervous leetle virgin anymore, [name]; I am ze expectant mozzair.  Give me your cum; let me be warm and full of your seed again! Zat is, if you have ze balls to do eet?</i>" she coos' );
				if( CoC.player.balls === 0 ) {
					MainView.outputText( ' with a smile, knowing damn well you don\'t, literally' );
				}
				MainView.outputText( '.' );
				MainView.outputText( '\n\nYou can\'t resist it anymore; you slide yourself home in one final forceful thrust and cum, eliciting a delighted squawk from Benoite as jizz thunders from your cock into her depths, her own orgasm lost amidst the cascade of fluids churning and seething into her.  With her womb as jam-packed as it is, incapable of holding any more, the pressure just sends everything spurting back out of her cunt, drenching the pair of you in your seed.  Finally, your orgasm ends and you sigh in unison with her.' );
				MainView.outputText( '\n\n"<i>Now zat is what I am talking about,</i>" Benoite sighs softly.  "<i>...I may \'ave to close ze shop early today.</i>"' );
				MainView.outputText( '\n\nIn the end, it doesn\'t come to that, but it takes you quite a while to help Benoite get up, clean her off, tidy up the mess you made, and otherwise get her presentable again.  She gives you one of her reptilian kisses in appreciation, and sends you home again. ' );
				CoC.player.orgasm();
			}
		}
		EngineCore.menu();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//Benoite Gives Birth;
	Benoit.prototype.femoitBirths = function() {
		MainView.clearOutput();
		MainView.outputText( 'As you enter Benoite\'s stall, you hear the sounds of gasps of pain from the backroom, mingling with the sounds of stock being knocked around. You race through and find Benoite, completely naked, leaning against a table and groaning in anguish, her tail slashing wildly through the air behind her.  "<i>[name]!  It.. it iz good zat you are here.  Ze eggs!  Zey come!</i>"' );
		MainView.outputText( '\n\nShe lets out a howl of pain, claws digging deeply into the scarred wood of the tough old table she\'s leaning on, her huge belly hanging heavily over the floor. Instinct motivates you to help the soon-to-be mother of your children, and you dart around behind her.' );
		// (First time: ;
		if( CoC.flags[ kFLAGS.FEMOIT_HELPED_LAY ] === 0 ) {
			MainView.outputText( '\n\nYou ask if she can think of any way for you to help her.' );
			MainView.outputText( '\n\n"<i>Just catch ze eggs, and try to make zis stop hurting so much!</i>" the basilisk whines, claws audibly carving into tough old wood.  She looks on the verge of hysteria.  "<i>Why did I sink zis was a great idea?  Fuck my race, </i>nuzzing<i> is worth zis amount of pain!</i>"' );
		} else {
			MainView.outputText( '\n\nRemembering what you did before leaves you with no doubt as to how you can help.' );
			MainView.outputText( '\n\nLooking around, you easily find an array of scrap and lost clothing, which you quickly assemble into a crude nest underneath the laboring basilisk.  It\'s not much, but it\'ll give you a place to put the eggs' );
			if( this.benoitVeryHeavyPreggers() || this.benoitExtremePreggers() ) {
				MainView.outputText( '... which is good, because you can tell there\'re a lot of them coming' );
			}
			MainView.outputText( '.  That done, you squat down behind Benoite, keeping your head down to avoid having it slapped by her swishing tail, and reach up between her legs. She promptly lets out a shriek.' );
			if( CoC.flags[ kFLAGS.FEMOIT_HELPED_LAY ] === 1 ) {
				MainView.outputText( '"<i>What\'s the matter?</i>" you blurt, alarmed.' );
				MainView.outputText( '"<i>You... you \'ave cold \'ands!</i>" she squeals, shuddering in displeasure.' );
			} else {
				MainView.outputText( '"<i>What have I told you about warming zose hands?</i>" she snaps angrily.' );
			}
		}
		CoC.flags[ kFLAGS.FEMOIT_HELPED_LAY ]++;
		MainView.outputText( '\n\nYou apologize, but don\'t take your hands away; instead, you start to rub her netherlips, feeling how dilated they are and trying to gauge how close she is to laying.  You occasionally rub the underside of her straining, swollen stomach in an effort to provide some comfort.  Her labor is progressing fast; you\'re certain she\'ll start delivery soon.' );
		MainView.outputText( '\n\n"<i>At least basilisks - Oh! - lay eggs!</i>" she pants.  "<i>It iz easier zan trying to push out a baby...</i>" she winces as another contraction visibly ripples across her belly. "<i>It still \'urts like \'ell, though.</i>"' );
		MainView.outputText( '\n\nYou encourage her to breathe deeply, to try and focus on pushing in time with the contractions.  Benoite groans but does as you instruct, and within moments she is gritting her teeth as the unmistakable form of an egg bulges from her pussy' );
		if( EngineCore.silly() ) {
			MainView.outputText( '.  It\'s shaped like a complex rhomboidal polygon with 15 sides.' );
		} else {
			MainView.outputText( ', the smoothly curved peak of a jade egg beginning to crest.' );
		}
		MainView.outputText( '  With a strangled cry of orgasm tinged with pained relief, Benoite pushes it from her passage into your hands. Slick with juices, the egg makes for quite a handful and you find yourself struggling to safely cradle it within your grasp. You quickly place it into the makeshift next at her feet.' );
		if( CoC.flags[ kFLAGS.FEMOIT_EGGS ] >= 2 ) {
			MainView.outputText( '\n\nFrom the continued distension of Benoite\'s midriff, though, it\'s obvious that this clutch contains multiple eggs.  She groans at the prospect, but continues to breathe and push.' );
			if( this.benoitRegularPreggers() ) {
				MainView.outputText( '\n\nHer labors are over quickly; the clutch isn\'t that big, and her muscles are already well prepared.  Soon, she\'s squatting over a pile of' + Utils.num2Text( CoC.flags[ kFLAGS.FEMOIT_EGGS ] ) + ' eggs.' );
			} else if( this.benoitHeavyPreggers() ) {
				MainView.outputText( '\n\nThanks to the shape of her eggs and the fact she\'s already properly dilated, the rest of the clutch comes relatively quickly.  It\'s a pretty decent brood of children, you feel; ' + Utils.num2Text( CoC.flags[ kFLAGS.FEMOIT_EGGS ] ) + ' eggs, all told.' );
			} else if( this.benoitVeryHeavyPreggers() ) {
				MainView.outputText( '\n\nYou\'re glad that giving birth is easier for Benoite than it would be for a mammal, as she needs all the help she can get.  Her huge stomach proves that she wasn\'t merely putting on weight as egg after egg pushes out of her stretched cunt.  By the time she\'s flat as a board again, you\'ve counted her offspring; ' + Utils.num2Text( CoC.flags[ kFLAGS.FEMOIT_EGGS ] ) + ' eggs, each with a baby basilisk still growing inside it.' );
			} else if( this.benoitExtremePreggers() ) {
				MainView.outputText( '\n\nBenoite groans and moans like she\'s dying, but somehow finds the strength to soldier on as egg after egg after egg slides from her well-stuffed womb.  For a moment you wonder just how many she\'s got in there, but the cascade finally comes to an end; with a great deal of relief on both your parts.  While Benoite gasps for breath from her labors, you busy yourself counting your brood... ' + Utils.num2Text( CoC.flags[ kFLAGS.FEMOIT_EGGS ] ) + ' eggs!' );
			}
		}
		MainView.outputText( '\n\nLaying done, Benoite heaves a great sigh of relief.  "<i>Sank goodness zat\'s over,</i>" she declares, even as she sinks to her knees, careful to avoid crushing the egg' );
		if( CoC.flags[ kFLAGS.FEMOIT_EGGS ] > 1 ) {
			MainView.outputText( 's' );
		}
		MainView.outputText( ' she just laid.  You nod from behind her, and cautiously move around to give her a hug.  She is a very, very brave woman, and an even braver man for making the decision to do this in the first place.' );
		MainView.outputText( '\n\n"<i>Flattery,</i>" Benoite declares in her husky voice, a hint of a reptilian blush in her crest, suddenly flush against her head.  "<i>Now, let us see ze fruits of zis crazy union, shall we?</i>"  With your help, she repositions herself so that she can start feeling at the contents of your \'nest\', allowing her to touch and count the numbers of her clutch.' );
		if( this.benoitRegularPreggers() ) {
			MainView.outputText( ' She sighs softly.  "<i>A small clutch, this is... normal for my people, yes, but not very good for my mission, is it?  Still, a small step to freedom is still a step.</i>"  She manages to smile.  "<i>My children will be free, and that is something to celebrate.</i>"' );
		} else if( this.benoitHeavyPreggers() ) {
			MainView.outputText( ' "<i>My, a nice big clutch we had together, didn\'t we?</i>" she smiles, proudly.  "<i>Yes, these will be strong children, I zink.</i>"' );
		} else if( this.benoitVeryHeavyPreggers() ) {
			MainView.outputText( ' "<i>...Wow, you\'re quite ze stud, aren\'t you?</i>" Benoite says, giving a throaty growl of lust.  "<i>I chose well when I decided to let you fertilize my eggs... so many eggs, too.</i>"' );
		} else if( this.benoitExtremePreggers() ) {
			MainView.outputText( ' The basilisk stops after her counting, visibly stunned.  She recounts her eggs again, and then again, shaking her head in amazement.  "<i>Incredible... simply, incredible.  I didn\'t think it was possible for one woman to lay zo many eggs!  Zut alors!</i>"  A sudden look of horrified realization washes over her features.  "<i>I\'m going to be run off my feet with all zese little monsters, aren\'t I?</i>" she murmurs to herself.' );
		}
		MainView.outputText( '\n\nYou ask if Benoite will be alright now.' );
		MainView.outputText( '\n\nThe basilisk looks at you and smirks.  "<i>I am not so fragile, [name].  I can move like my old self again, and don\'t worry, I \'ave got somewhere nice and warm and safe picked out already.</i>"  She pinches your [ass], making you jump.' );
		MainView.outputText( '\n\nYou insist on helping Benoite put the egg' );
		if( CoC.flags[ kFLAGS.FEMOIT_EGGS ] > 1 ) {
			MainView.outputText( 's' );
		}
		MainView.outputText( ' away safely, though, and the blind reptilian clearly appreciates the help.  Leaving her to admire her new clutch you head back to camp.' );
		this.clearBenoitPreggers();
		EngineCore.menu();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	SceneLib.registerScene( 'benoit', new Benoit() );
} );