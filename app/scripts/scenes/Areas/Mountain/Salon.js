﻿'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, $rootScope, CoC, PerkLib, Appearance, Descriptors, kFLAGS, Utils, StatusAffects, PregnancyStore, EngineCore, ConsumableLib ) {
	function Salon() {
		$rootScope.$on( 'time-change', this.timeChange );
		$rootScope.$on( 'time-change-large', this.timeChangeLarge );
	}

	//Implementation of TimeAwareInterface;
	Salon.prototype.timeChange = function() {
		CoC.flags[ kFLAGS.SALON_PAID ] = 0;
		if( CoC.time.hours > 23 ) {
			if( CoC.flags[ kFLAGS.LYNNETTE_CARRYING_COUNT ] === 0 || CoC.flags[ kFLAGS.LYNNETTE_PREGNANCY_CYCLE ] !== 4 ) {
				CoC.flags[ kFLAGS.LYNNETTE_PREGNANCY_CYCLE ]++;
			}
			if( CoC.flags[ kFLAGS.LYNNETTE_PREGNANCY_CYCLE ] === 7 ) {
				CoC.flags[ kFLAGS.LYNNETTE_PREGNANCY_CYCLE ] = 0;
			}
		}
		return false;
	};
	Salon.prototype.timeChangeLarge = function() {
		return false;
	};
	//End of Interface Implementation;
	//const SALON_PAID:int = 441;;
	Salon.prototype.hairDresser = function() {
		EngineCore.outputText( 'While exploring the mountain, you find a cleverly concealed doorway.  From inside you can hear the sound of blades being sharpened.  Do you enter the doorway?', true );
		EngineCore.doYesNo( this, this.salonGreeting, SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	Salon.prototype.salonGreeting = function() {
		if( CoC.player.findStatusAffect( StatusAffects.HairdresserMeeting ) >= 0 ) {
			this.hairDresserRepeatGreeting();
		} else {
			CoC.player.createStatusAffect( StatusAffects.HairdresserMeeting, 0, 0, 0, 0 );
			this.hairDresserGreeting();
		}
	};
	Salon.prototype.favoriteSalonMenu = function() {
		this.salonPurchaseMenu();
		EngineCore.addButton( 6, 'Payments', this, this.salonFavoritesPaymentMenu );
	};
	Salon.prototype.salonFavoritesPaymentMenu = function() {
		var blow = null;
		if( CoC.player.hasCock() ) {
			blow = this.goblinHairDresserFacefuck;
		}
		var minoCum = null;
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00142 ] > 0 ) {
			minoCum = this.goblinHairDresserFacefuck;
		}
		EngineCore.menu();
		if( CoC.flags[ kFLAGS.LYNNETTE_PREGNANCY_CYCLE ] >= 4 && CoC.player.hasCock() ) {
			EngineCore.addButton( 5, 'Fuck Goblin', this, this.fuckLynnette );
		}
		EngineCore.addButton( 0, 'Goblin Blow', this, blow );
		EngineCore.addButton( 1, 'Canine', this, this.gloryholeDoggie );
		EngineCore.addButton( 2, 'Imp', this, this.gloryholeImp );
		EngineCore.addButton( 3, 'Minotaur', this, this.gloryholeMinotaur );
		EngineCore.addButton( 4, 'Incubus', this, this.gloryholeIncubus );
		EngineCore.addButton( 8, 'Buy MinoCum', this, minoCum );
		EngineCore.addButton( 9, 'Back', this, this.favoriteSalonMenu );
	};

	Salon.prototype.salonPaymentMenu = function() {
		var blow = null;
		if( CoC.player.hasCock() ) {
			blow = this.goblinHairDresserFacefuck;
		}
		var minoCum = null;
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00142 ] > 0 ) {
			minoCum = this.buyMinoCum;
		}
		EngineCore.menu();
		if( CoC.flags[ kFLAGS.LYNNETTE_PREGNANCY_CYCLE ] >= 4 && CoC.player.hasCock() ) {
			EngineCore.addButton( 5, 'Fuck Goblin', this, this.fuckLynnette );
		}
		EngineCore.addButton( 0, 'Goblin Blow', this, blow );
		EngineCore.addButton( 1, 'Canine', this, this.gloryholeDoggie );
		EngineCore.addButton( 2, 'Imp', this, this.gloryholeImp );
		EngineCore.addButton( 3, 'Minotaur', this, this.gloryholeMinotaur );
		EngineCore.addButton( 4, 'Incubus', this, this.gloryholeIncubus );
		EngineCore.addButton( 8, 'Buy MinoCum', this, minoCum );
		EngineCore.addButton( 9, 'Leave', SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	Salon.prototype.buyMinoCum = function() {
		if( CoC.player.gems < 60 ) {
			EngineCore.outputText( 'You can\'t afford any minotaur cum right now!', true );
			if( CoC.flags[ kFLAGS.SALON_PAID ] === 0 ) {
				EngineCore.doNext( this, this.salonGreeting );
			} else {
				this.salonPurchaseMenu();
			}
		} else {
			CoC.player.gems -= 60;
			EngineCore.outputText( 'You happily give Lynnette 60 gems and pick up the bottle full of glistening, heavenly cum.  ', true );
			EngineCore.statScreenRefresh();
			SceneLib.inventory.takeItem( ConsumableLib.MINOCUM, SceneLib.camp.returnToCampUseOneHour );
		}
	};
	Salon.prototype.salonPurchaseMenu = function() {
		CoC.flags[ kFLAGS.SALON_PAID ] = 1;
		EngineCore.spriteSelect( 38 );
		var cutShort2 = null;
		var cutMedium2 = null;
		var cutLong2 = null;
		var lengthening = null;
		var minoCum = null;
		var mudFacial2 = null;
		var sandFacial2 = null;
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00142 ] > 0 ) {
			minoCum = this.buyMinoCum;
		}
		if( CoC.player.hairLength > 2 ) {
			cutShort2 = this.cutShort;
		}
		if( CoC.player.hairLength > 13 ) {
			cutMedium2 = this.cutMedium;
		}
		if( CoC.player.hairLength >= 26 ) {
			cutLong2 = this.cutLong;
		}
		if( CoC.player.hairLength < CoC.player.tallness ) {
			lengthening = this.hairGrow;
		}
		if( CoC.player.femininity < 100 && CoC.player.gender === 2 ) {
			mudFacial2 = this.mudFacial;
		} else if( CoC.player.femininity < 85 && (CoC.player.gender === 0 || CoC.player.gender === 3) ) {
			mudFacial2 = this.mudFacial;
		} else if( CoC.player.femininity < 70 && CoC.player.gender === 1 ) {
			mudFacial2 = this.mudFacial;
		} else if( CoC.player.femininity < 100 && CoC.player.findPerk( PerkLib.Androgyny ) >= 0 ) {
			mudFacial2 = this.mudFacial;
		}
		if( CoC.player.femininity > 0 && CoC.player.gender === 1 ) {
			sandFacial2 = this.sandFacial;
		} else if( CoC.player.femininity > 30 && CoC.player.gender === 2 ) {
			sandFacial2 = this.sandFacial;
		} else if( CoC.player.femininity > 20 && (CoC.player.gender === 0 || CoC.player.gender === 3) ) {
			sandFacial2 = this.sandFacial;
		} else if( CoC.player.femininity > 0 && CoC.player.findPerk( PerkLib.Androgyny ) >= 0 ) {
			sandFacial2 = this.sandFacial;
		}

		EngineCore.menu();
		EngineCore.addButton( 0, 'Cut Short', this, cutShort2 );
		EngineCore.addButton( 1, 'Cut Med.', this, cutMedium2 );
		EngineCore.addButton( 2, 'Cut Long', this, cutLong2 );
		EngineCore.addButton( 3, 'Lengthen', this, lengthening );
		EngineCore.addButton( 4, 'Buy Products', this, this.dyeMenu );
		EngineCore.addButton( 5, 'Buy MinoCum', this, minoCum );
		EngineCore.addButton( 7, 'Mud Facial', this, mudFacial2 );
		EngineCore.addButton( 8, 'Sand Facial', this, sandFacial2 );
		EngineCore.addButton( 9, 'Leave', SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	Salon.prototype.hairDresserGreeting = function() {
		EngineCore.spriteSelect( 38 );
		EngineCore.outputText( 'You step inside the cave, and are greeted by a sight you did not expect.  The cave\'s floor is covered with smooth wood panelling and the walls are nearly entirely covered with hanging mirrors.  The few stalactites have hooks drilled into them, from which hang hundreds of scissors, shears, razors, combs, and other hairstyling impliments.  It reminds you of the hair-cutter\'s shop in your hometown.', true );
		EngineCore.outputText( '\n\nThere are a few chairs along the wall and goblins with latex dresses and gloves looking bored.  At the sight of you they perk up and clamor around you excitedly, until one with a gravity-defying chest pushes them apart and greets you.', false );
		EngineCore.outputText( '   "<i>I apologize for my daughters,</i>" she says as she presses herself against you.  "<i>They\'re a bunch of brainless hussies for the most part.  My name is Lynnette, and welcome to my salon!  You want your hair cut or lengthened?  We\'ve got you covered, and we don\'t ask for much - just a shot of cum.', false );
		if( CoC.player.cockTotal() === 0 ) {
			EngineCore.outputText( '  You look like you don\'t got any of your own, but we\'ve got glory holes in the back if you need to get some.  Just don\'t swallow too much, ok?</i>"\n\nShe shows you to the back of the cave, which is boarded-up.  There are about 20 holes in boards, and most are empty.  While you watch, a few new dicks slide in, and just as quickly the goblin\'s daughters commence sucking and fucking them.  There are only a few you could take a crack at - do you blow one (and if so which one)?', false );
		} else {
			EngineCore.outputText( '  I\'ll even do you the favor of letting you blow it in my mouth, I\'ve already got a bun in the oven.  So what do you say?  Want a spooge and a haircut?  Or would you rather go get your payment from one of the gloryholes in the back, you ' + CoC.player.mf( 'kinky boy', 'naughty girl' ) + '?</i>"\n\n', false );
			EngineCore.outputText( 'In the very back of the salon you can see a boarded-up wall with holes cut in it, some of which are currently plugged by various monstrous penises.  Do you let the goblin blow you, or do you go suck your payment from one of them?', false );
		}
		this.salonPaymentMenu();
		EngineCore.outputText( '\n\n<b>(Salon unlocked in \'places\' menu from camp)</b>', false );
	};
	Salon.prototype.hairDresserRepeatGreeting = function() {
		EngineCore.clearOutput();
		EngineCore.spriteSelect( 38 );
		//Chance for mino craziness here;
		if( Utils.rand( 5 ) === 0 && (CoC.player.findPerk( PerkLib.MinotaurCumAddict ) >= 0 || CoC.flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_STATE ] > 0) ) {
			this.minotaurCumBukkakeInSalon();
			return;
		}
		//Had babies announcement!;
		if( CoC.flags[ kFLAGS.LYNNETTE_PREGNANCY_CYCLE ] === 4 && CoC.flags[ kFLAGS.LYNNETTE_CARRYING_COUNT ] > 0 ) {
			EngineCore.outputText( 'As soon as you enter the Salon, Lynnette is beaming ' );
			if( CoC.player.tallness >= 48 ) {
				EngineCore.outputText( 'up ' );
			}
			EngineCore.outputText( 'at you. "<i>Hey there, honey. Come for some more service or to check up on the kids?</i>" She pats her now-flat midsection. "<i>I popped them out last night. We had ' + Utils.num2Text( CoC.flags[ kFLAGS.LYNNETTE_CARRYING_COUNT ] ) + ' kids... all girls, of course.</i>" She tucks a lock of beautifully styled hair behind an elfin ear. "<i>Now you be sure and let me know when you want to contribute to my baby-bank again.</i>"' );
			if( CoC.flags[ kFLAGS.LYNNETTE_BABY_COUNT ] > 0 ) {
				EngineCore.outputText( '\n\nA few new, green faces can be seen looking your way and blushing as they work the gloryholes, probably from a previous litter. They grow up so fast.' );
			}
			CoC.flags[ kFLAGS.LYNNETTE_BABY_COUNT ] += CoC.flags[ kFLAGS.LYNNETTE_CARRYING_COUNT ];
			CoC.flags[ kFLAGS.LYNNETTE_CARRYING_COUNT ] = 0;
			//If favorite!;
			if( CoC.flags[ kFLAGS.LYNNETTE_ANNOUNCED_APPROVAL ] === 1 ) {
				this.favoriteSalonMenu();
				return;
			} else {
				if( CoC.player.cockTotal() === 0 ) {
					EngineCore.outputText( '\n\nShe taps her chin in thought. "<i>A real shame you aren\'t packing any more.  No worries, the glory holes in the back are pretty popular with the demons and monsters, just go back there and catch some spooge and we\'ll see about helping with your hair, ok?</i>"\n\n(There are a number of dicks in the glory hole, which do you want to deal with (if you\'re willing at all)?', false );
				} else {
					EngineCore.outputText( '\n\nShe taps her chin in thought. "<i>Will you be getting our normal services?  Just one BJ per hair treatment!  Maybe you wanted to be a repeat customer at Lynnette\'s womb?  No appointment neccessary.  Or would you rather get our fee from the gloryholes in back?</i>"', false );
				}
			}
		}
		//Favorite Announcement;
		else if( CoC.flags[ kFLAGS.LYNNETTE_APPROVAL ] >= 100 && CoC.flags[ kFLAGS.LYNNETTE_ANNOUNCED_APPROVAL ] === 0 ) {
			EngineCore.outputText( 'Lynnette practically beams at your appearance, chasing you into the lobby of her shop before you can change your mind. You look quizzically at her, wondering just what\'s gotten her so excited, when she announces, "<i>Look, honey, you\'ve done such a great job knocking me up that I\'ve decided you ought to have a little reward - besides stuffing me silly.</i>" Her nipples seem to harden a touch through her dress at that. "<i>You can get any of our regular services for free, my studly, virile... mmm....</i>" Her eyes drift closed ever so briefly as a hand vanishes under a slit in her dress. A moment later, she jolts and withdraws it, sheepishly admitting. "<i>We\'ll do your hair for free! Just don\'t forget to knock me up from time to time, okay?</i>"' );
			EngineCore.outputText( '\n\nThis seems like quite the deal!' );
			CoC.flags[ kFLAGS.LYNNETTE_ANNOUNCED_APPROVAL ] = 1;
			//Custom menu with options to 'pay anyway';
			this.favoriteSalonMenu();
			return;
		}
		//Favorite Greeting ;
		else if( CoC.flags[ kFLAGS.LYNNETTE_ANNOUNCED_APPROVAL ] === 1 ) {
			//(Pregnant With Your Babies);
			if( CoC.flags[ kFLAGS.LYNNETTE_PREGNANCY_CYCLE ] < 4 && CoC.flags[ kFLAGS.LYNNETTE_CARRYING_COUNT ] > 0 ) {
				EngineCore.outputText( 'Lynnette has a little difficulty ushering you in with her swollen belly in the way. She\'s tremendously heavy with child already, likely due to some goblin-engineered chemicals that accelerate her pregnancy. Her tremendously fertile hips roll back and forth as she waddles a little deeper into the salon, greeting, "<i>Welcome back, honey-bunch. Here to make a donation to the cause or get some freebies from your favorite pregnant slut?</i>" She twists her ass in your direction and slaps it, making it jiggle in her sheer dress.' );
			}
			//Pregnant with other babies;
			else if( CoC.flags[ kFLAGS.LYNNETTE_PREGNANCY_CYCLE ] < 4 ) {
				EngineCore.outputText( 'Lynnette the goblin answers the door and lets you in, waving you deeper into her shop.  Her shining black dress barely contains her fertile-hips and jiggling chest as she greets you, "<i>Welcome back, honey-bunch!  You should\'ve stopped by to stuff my oven.  I wound up having to dip into our reserves.</i>"  She affectionally wraps an arm around your waist and rubs your midsection.  "<i>I would\'ve much rather had my Champion\'s babies.</i>"  She smiles up at you and says, "<i>I\'m sure you didn\'t just come here to visit.  Did you need a trim, or didja just want to make a donation do my little business?</i>"  The word \'donation\' is rolled as slowly and sensuously from her mouth as possible.' );
			}
			//Nonpreggers;
			else {
				EngineCore.outputText( 'Pulling the door the rest of the way open before you\'ve the latch more than half-turned, Lynnette has you inside with disorienting speed.  She presses her well-endowed, dress-straining tits against your ' );
				if( CoC.player.tallness <= 48 ) {
					EngineCore.outputText( 'side' );
				} else if( CoC.player.tallness <= 68 ) {
					EngineCore.outputText( '[hips]' );
				} else {
					EngineCore.outputText( '[leg]' );
				}
				EngineCore.outputText( ', compressing her mountainous mammaries against you hard enough to leave milky stains in her wake.\n\n"<i>How\'s my favorite breeder doing?</i>" comes the honeyed words from her mouth, and as she begins to feel at the crotch of your [armor], she asks, "<i>I can cut your hair, if you like, but why do that when there\'s a woman with a quim in front of you, waiting to get stuffed?</i>"  She smirks. "<i>So what\'ll it be?</i>"' );
			}
			if( CoC.player.cockTotal() === 0 ) {
				EngineCore.outputText( '\n\nHer expression drops when she realizes you\'re no longer packing. "<i>You should really grow a cock back, honey. It\'s a little shameful for such a perfect stud to be so under-equipped.</i>"', false );
			}
			this.favoriteSalonMenu();
			return;
		}
		//Non-Pregnant Greetings:;
		else if( CoC.flags[ kFLAGS.LYNNETTE_PREGNANCY_CYCLE ] >= 4 ) {
			if( CoC.flags[ kFLAGS.LYNNETTE_MET_UNPREGNANT ] === 0 ) {
				CoC.flags[ kFLAGS.LYNNETTE_MET_UNPREGNANT ] = 1;
				EngineCore.outputText( 'Lynnette\'s familiar face greets you at the door to her salon once more, and she waves you in with a beatific smile plastered upon her face. Clinging to her like a second skin, the businessgoblin\'s dress highlights her surprisingly flat midsection; she\'s not pregnant!' );
				EngineCore.outputText( '\n\n"<i>Noticing something you like, honey-bunches?</i>" the goblin coos with a sashy of her baby-bearing hips. "<i>A girl can\'t be pregnant ALL the time, after all.</i>" She dabs at one of the many spots of moisture her prominent nipples have left on her top and smiles a bit overbroadly.' );
				//Normal offers with a bit hinting at knocking her up when appropriate;
			} else {
				EngineCore.outputText( 'Lynnette opens the door for you, ushering in before you have more than a few moments to take in her curvy voluptuousness. Her dress is sheer and tight to her relatively flat belly, indicated that her womb is free for the moment, and judging by the way she beams at your entrance, she\'s still feeling a little bit of post-birth euphoria. "<i>Welcome back, honey! Here for a bit of fun, a haircut, or both?</i>"' );
				//Normal offers with a bit hinting at knocking her up when appropriate;
			}
			if( CoC.player.cockTotal() === 0 ) {
				EngineCore.outputText( '\n\nShe taps her chin in thought. "<i>I see you still can\'t make payment for our services on your own.  No worries, the glory holes in the back are pretty popular with the demons and monsters, just go back there and catch some spooge and we\'ll see about helping with your hair, ok?</i>"\n\n(There are a number of dicks in the glory hole, which do you want to deal with (if you\'re willing at all)?', false );
			} else {
				EngineCore.outputText( '\n\nShe taps her chin in thought. "<i>Will you be getting our normal services?  Just one BJ per hair treatment!  Maybe you wanted to take a try at Lynnette\'s womb?  Or would you rather get our fee from the gloryholes in back?</i>"', false );
			}
		}
		//Standard repeats;
		else {
			EngineCore.outputText( 'Lynnette the goblin answers the door and lets you in, waving you deeper into her shop.  Her shining black dress barely contains her fertile-hips and jiggling chest as she greets you, "<i>Welcome back, honey!  ', true );
			if( CoC.player.cockTotal() === 0 ) {
				EngineCore.outputText( 'I see you still can\'t make payment for our services on your own.  No worries, the glory holes in the back are pretty popular with the demons and monsters, just go back there and catch some spooge and we\'ll see about helping with your hair, ok?</i>"\n\n(There are a number of dicks in the glory hole, which do you want to deal with (if you\'re willing at all)?', false );
			} else {
				EngineCore.outputText( 'Will you be getting our normal services?  Just one BJ per hair treatment!  Or would you rather get it from the gloryholes in back?</i>"', false );
			}
		}
		this.salonPaymentMenu();
	};
	Salon.prototype.gloryholeImp = function() {
		CoC.player.slimeFeed();
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You walk over to the hole in the wall, looking at the erect demon-member you\'ll have to service.  Judging by the height and constant bobbing up and down it does, the imp must be hovering on the other side, trying pretty damn hard to stay in the hole.\n\n', true );
		if( CoC.player.cor < 33 ) {
			EngineCore.outputText( 'You struggle to force your mouth onto the abomination in front of you, wondering why you chose to do such a thing.  Your head bobs up and down, trying to match the motions of the thick demonic tool as you grab hold and guide it into your mouth.  It\'s hot, hotter than you\'d expect, and dripping with sickly sweet pre-cum that makes you tingle.  You throw yourself into the wretched task, intent on finishing it as quickly as possible.  You circle your tongue over the nodules, holding on as it swells in your mouth, unloading a sticky batch of spooge into your throat.  You cough and sputter, swallowing most of it, but you manage to hang on to enough for your pay.\n\n', false );
			EngineCore.dynStats( 'lus', 15, 'cor', 0.5 );
		} else if( CoC.player.cor < 66 ) {
			EngineCore.outputText( 'You open wide, bobbing up and down in an effort to match the strange dick that wobbles in front of you.  In the end you wrap both hands around its bumpy base, steadying it as you engulf the throbbing demon dick, taking as much as you can into your mouth.  You squeeze and caress it, licking the ridge of nodules that surround the crown as sticky spoo begins to erupt from it.  The little guy didn\'t have much endurance, but he must have been pretty backed up, as he\'s flooding your mouth and throat with his seed.  You struggle to swallow enough to keep up, but when he finishes, you\'re panting and covered in white.\n\n', false );
			EngineCore.dynStats( 'lus', 35, 'cor', 1 );
		} else {
			EngineCore.outputText( 'You immediately dive forwards, relishing the idea of taking in another load of demonic cum.  Your groin tingles as your lips make their way down the oddly textured shaft, engulphing nearly 10 inches of demon-cock, feeling it press down your throat.  You curl your tongue around and begin sliding back and forth, immediately rewarded with a thick dribble of pre-cum.  The imp on the other end loses it immediately, blasting waves of cum directly into your belly as you shove forwards, taking him into the hilt.  You feel him pulsing and pull back in time to take the last few loads in your mouth, saving your payment for the goblins.\n\n', false );
			EngineCore.dynStats( 'lus', 45, 'cor', 2 );
		}
		EngineCore.outputText( 'Abruptly, the demon-dong slips through your grasp and out the hole.  You hear a loud thump as something lands on the ground. Poor thing.\n\n', false );
		EngineCore.doNext( this, this.hairDressingMainMenu );
	};

	Salon.prototype.gloryholeDoggie = function() {
		CoC.player.slimeFeed();
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You sigh and kneel down to bring yourself level with the dog-dick hanging out of the wall.  It\'s pointed at the tip with a swollen circular bulb at the base.  As a matter of fact, the dog-dick\'s owner must be pretty excited to be here - it\'s dripping cum and the knot has swollen so large that it can\'t fit back through the hole.\n\n', true );
		if( CoC.player.cor < 33 ) {
			EngineCore.outputText( 'It\'s a struggle to force your lips apart and take the strange thing in your mouth.  You feel like a freak, but make yourself get to work servicing the male who\'ll be covering your hair treatment today.  It tastes salty and sweaty and has a potent musky scent that excites you in spite of your better judgment.  You find yourself starting to get into it as you lick and slurp, humming with pleasure.  You reach up to touch the knot and the dog-cock jumps in your mouth, spurting a wad of thick cum into your throat.  You pull back most of the way and pump the cock, collecting the jism in your mouth.\n\n', false );
			EngineCore.dynStats( 'lus', 15, 'cor', 0.25 );
		} else if( CoC.player.cor < 66 ) {
			EngineCore.outputText( 'You open wide and take as much of the pointed dick as you can into your mouth.  A few times you nearly gag yourself, but you manage to get most of the way down to the thick swollen knot.  You start sliding back and forth, breathing in the musky animalistic scent of your \'client\' and become aroused by the situation more and more.  You reach up and caress the knot, squeezing gently and stroking the dick until it unloads a thick wad of cum into your mouth.  You pull back and catch the fruits of your labor in your mouth, milking the dick with your hands until it\'s finished and the dick pops back through the hole.\n\n', false );
			EngineCore.dynStats( 'lus', 25, 'cor', 0.25 );
		} else {
			EngineCore.outputText( 'You throw yourself onto the swollen dog-cock and easily engulf the whole thing, spreading your lips wide around the thick knot.  You can feel it bouncing the uvula in your throat around but you manage to supress your gag reflex like a good slut while you work the sweaty dick, giving it a thorough tongue bath.  You wrap your lips around the base of the knot, feeling it start to stretch your jaws apart.  You pull back before it can lock you like that, and squeeze the knot in your hands.  It cums, unloading thick wads of gooey cum into your mouth.\n\n', false );
			EngineCore.dynStats( 'lus', 30, 'cor', 0.3 );
		}
		EngineCore.outputText( 'A young goblin comes by with a bowl for you to make your payment into.  You spit out the gunk and wipe your mouth, as the goblin carries the seed away.  You notice a trail of clear drops on the ground behind her.  She must be anticipating something...', false );
		EngineCore.doNext( this, this.hairDressingMainMenu );
	};
	Salon.prototype.gloryholeIncubus = function() {
		CoC.player.slimeFeed();
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You kneel down in front of the throbbing demonic dick, ready to earn your pay.\n\n', false );
		if( CoC.player.cor < 33 ) {
			EngineCore.outputText( 'You picked this dick hoping that a male lust demon would be the most pleasurable to service, and judging by the pleasant spicy scent the member gives off, you\'re right.  You open wide and take it inside your mouth, feeling the ridges around the crown pressing back against your lips. A drop of pre-cum hits your tongue and it tastes divine, spurring you on to please the tainted member.  You grab it with both hands and pump it, feeling the corrupted nodules under your fingers as you lick and suck on the head, eager for more.  You get your reward soon enough, and you eagerly start drinking down the copious waves of fluid.  Thankfully, the incubus\' orgasm seems to last forever, and when he finishes, you have a full belly and a mouth full of cream.  You manage to resist this last swallow, as you still need to pay.\n\n', false );
			EngineCore.dynStats( 'lus', 1, 'cor', 1.5 );
			CoC.player.lust = 99;
		} else {
			EngineCore.outputText( 'You take the corrupted cock in your hands and guide it into your waiting mouth, eager to try a walk on the wild side.  The incubus-cock does not disappoint, quickly dripping a steady flow of wonderful tasting pre-cum that only whets your appetite for the demon\'s cum.  You lean forwards, taking most of the bumpy purple dick inside your mouth and running your tongue all over it, paying special attention to the ring of nodules around the bottom edge of his crown.  You\'re quickly rewarded with a blast of heavenly demonic seed.  You gulp it down, craving more of it, and thankfully the incubus has plenty for you.  You\'re shivering and horny by the time he finishes, but thankfully you have enough willpower to keep a mouthful of cum for payment.\n\n', false );
			EngineCore.dynStats( 'lus', 1, 'cor', 1 );
			CoC.player.lust = 99;
		}
		EngineCore.statScreenRefresh();
		EngineCore.doNext( this, this.hairDressingMainMenu );
	};
	Salon.prototype.gloryholeMinotaur = function() {
		CoC.player.slimeFeed();
		EngineCore.outputText( 'Your eyes are drawn to the huge minotaur cock, and you instinctively kneel down in front of it.\n\n', true );
		EngineCore.outputText( 'It\'s the largest available member in the room by a considerable margin, and from your position on your knees, it looks even more massive; it\'s over two feet long, and has three rings of prepuce spaced around its length. You can just barely span your entire hand around its thickness. You open your mouth wide and lean forward, taking the thick, spongy head into your mouth. The taste is incredibly strong, and its musk is as thick as the minotaur\'s dick itself. You moan in pleasure, and start bobbing your head back and forth, taking more and more of the dick into your mouth. You stroke the rest of the cock in time with your sucking. You can hear muffled grunting and snorting coming from the other side of the wall, obvious sounds of approval from your partner.\n\n', false );
		EngineCore.outputText( 'Driven on by the minotaur\'s reactions, you take more and more of the minotaur cock into your mouth. As you work your mouth around the first ring, you open up the top section of your ' + CoC.player.armorName + ', freeing up your ' + Descriptors.allBreastsDescript() + '. With each pass, you\'re able to take more and more of the bull dick down your throat. You caress your ' + Appearance.biggestBreastSizeDescript() + ' while moaning around the dick. When you get your mouth around the second ring, the minotaur\'s cock throbs sharply, and his cum explodes in your mouth. Your eyes bulge in shock, and you pull off the cock as quickly as you can. You swallow the first several shots of thick, rich minotaur cum, while the rest shoots all over your face and tits. You ' );
		if( CoC.player.biggestTitSize() > 1 ) {
			EngineCore.outputText( 'hold up ' );
		} else {
			EngineCore.outputText( 'arch your back to expose ' );
		}
		EngineCore.outputText( 'your [chest] as cum rains down upon you. By the time his orgasm stops and his dick goes limp, your face and [chest] are covered in a thick layer of spooge.\n\n', false );
		EngineCore.outputText( 'Your head spins from the minotaur\'s musk, and you idly mop up and swallow the cum on your ' + CoC.player.face() + '. A goblin aide comes in with a bowl, and gently scrapes the cum off your tits with a smooth, flat rock. Once you\'re cleaned up and you\'re dressed, the aide leads you back to Lynnette.\n\n', false );
		EngineCore.dynStats( 'lus', 33, 'cor', 1 );
		CoC.player.minoCumAddiction( 10 );
		EngineCore.doNext( this, this.hairDressingMainMenu );
	};
	Salon.prototype.goblinHairDresserFacefuck = function() {
		EngineCore.spriteSelect( 38 );
		EngineCore.outputText( 'Lynnette licks her lips and practically tears her way into your ' + CoC.player.armorName + ', having your crotch exposed in seconds.  Your ' + Descriptors.cockDescript( 0 ) + ' flops out immediately, slapping her on the nose as it grows hard.  She wraps both hands around you and begins pumping with practiced ease, flicking her tongue over your crown and wrapping her lips ', true );
		if( CoC.player.cocks[ 0 ].cockThickness >= 4 ) {
			EngineCore.outputText( 'around as much of you as she can', false );
		} else {
			EngineCore.outputText( 'around your first few inches', false );
		}
		EngineCore.outputText( '.  She slips her tongue down your urethra, and arches her back, popping the straps on her dress and letting her oversized tits engulf your shaft.  Milk sputters and dribbles from the lactating goblin, lubricating her breasts and hands as she pleasures every inch of you.\n\n', false );
		EngineCore.outputText( 'It\'s impossible to hold back while receiving such expertly given stimulation, and you blow your load, bulging her cheeks out like a squirrel\'s.', false );
		if( CoC.player.cumQ() >= 250 ) {
			EngineCore.outputText( ' She can\'t hold it all and suddenly starts swallowing as runnels of it escape her nose and a wave of it rolls down her lips.', false );
		}
		EngineCore.outputText( '  In time it ends, and she pops back, spitting most of the cum into a funnel.  It washes down a pipe and you have to wonder if there\'s some horny goblin girl at the other end with her cunt spread wide.', false );
		EngineCore.outputText( '\n\nThe hair-dressing goblin matron sputters a bit before licking her lips clean and beaming a happy smile at you.\n\n', false );
		CoC.player.orgasm();
		this.hairDressingMainMenu();
	};
	Salon.prototype.hairDressingMainMenu = function() {
		EngineCore.spriteSelect( 38 );
		EngineCore.outputText( 'Lynnette offers and explains their options, "<i>So what\'ll it be hun?  We could cut it down or give you a lengthening treatment. Or you can get a hair-dye to use on your own.  Just remember to come back in a few days for a touchup.</i>"', false );
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00142 ] > 0 ) {
			EngineCore.outputText( '\n\nOf course you could always spend some gems and buy some minotaur cum instead...', false );
		}
		this.salonPurchaseMenu();
	};
	Salon.prototype.cutShort = function() {
		EngineCore.spriteSelect( 38 );
		//-trying to get a goblin to cut tentacle hair:;
		if( CoC.player.hairType === 4 ) {
			EngineCore.outputText( 'Lynnette stares at you when you ask for a cut.  "<i>Nothing doing, hon; that stuff looks alive and I don\'t want blood all over my nice floor.  Thanks for contributing to the white file, though; maybe we can do something else?</i>"\n\n', false );
			this.salonPurchaseMenu();
			return;
		}
		EngineCore.outputText( 'Lynnette and her daughters crowd around you with razor-sharp scissors, effortlessly paring down your ' + Descriptors.hairDescript() + '.  When they\'ve finished, you\'re left with ', true );
		CoC.player.hairLength = 1;
		EngineCore.outputText( Descriptors.hairDescript() + '.', false );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	Salon.prototype.cutMedium = function() {
		EngineCore.spriteSelect( 38 );
		//-trying to get a goblin to cut tentacle hair:;
		if( CoC.player.hairType === 4 ) {
			EngineCore.outputText( 'Lynnette stares at you when you ask for a cut.  "<i>Nothing doing, hon; that stuff looks alive and I don\'t want blood all over my nice floor.  Thanks for contributing to the white file, though; maybe we can do something else?</i>"\n\n', false );
			this.salonPurchaseMenu();
			return;
		}
		EngineCore.outputText( 'Lynnette and her daughters crowd around you with razor-sharp scissors, effortlessly paring down your ' + Descriptors.hairDescript() + '.  When they\'ve finished, you\'re left with ', true );
		CoC.player.hairLength = 10;
		EngineCore.outputText( Descriptors.hairDescript() + '.', false );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	Salon.prototype.cutLong = function() {
		EngineCore.spriteSelect( 38 );
		//-trying to get a goblin to cut tentacle hair:;
		if( CoC.player.hairType === 4 ) {
			EngineCore.outputText( 'Lynnette stares at you when you ask for a cut.  "<i>Nothing doing, hon; that stuff looks alive and I don\'t want blood all over my nice floor.  Thanks for the contributing to the white file, though; maybe we can do something else?</i>"\n\n', false );
			this.salonPurchaseMenu();
			return;
		}
		EngineCore.outputText( 'Lynnette and her daughters crowd around you with razor-sharp scissors, effortlessly paring down your ' + Descriptors.hairDescript() + '.  When they\'ve finished, you\'re left with ', true );
		CoC.player.hairLength = 25;
		EngineCore.outputText( Descriptors.hairDescript() + '.', false );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	Salon.prototype.hairGrow = function() {
		EngineCore.spriteSelect( 38 );
		//-asking for a lengthening treatment with tentacle hair:;
		if( CoC.player.hairType === 4 ) {
			EngineCore.outputText( 'Lynnette looks dubiously at you when you ask for a lengthening treatment.  "<i>No offense hon, but that stuff is basically like an arm or an organ, not hair.  I\'m not a goblin chirurgeon, and I wouldn\'t try to lengthen it even if one of my disobedient daughters were here to donate some parts.  Sorry to make you shoot and scoot, but I can\'t help you.  Maybe we could do something else?</i>"\n\n', false );
			this.salonPurchaseMenu();
			return;
		}
		EngineCore.outputText( 'Lynnette grabs a bottle and squirts a white fluid into your hair.  You really hope it isn\'t your payment.  But it must not be, as within short order you feel the added weight of ', true );
		var temp = Utils.rand( 3 ) + 3;
		CoC.flags[ kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD ] = 0;
		CoC.player.hairLength += temp;
		EngineCore.outputText( Utils.num2Text( temp ) + ' more inches of ' + CoC.player.hairColor + ' hair.', false );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	Salon.prototype.buyDye = function( itype ) {
		EngineCore.outputText( '', true );
		SceneLib.inventory.takeItem( itype, SceneLib.camp.returnToCampUseOneHour );
	};
	Salon.prototype.dyeMenu = function() {
		EngineCore.spriteSelect( 38 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'Lynnette pulls open a cabinet in the corner, displaying a wide array of exotic hair-dyes.  Which kind do you want?', false );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Blue', this, this.buyDye, ConsumableLib.BLUEDYE );
		EngineCore.addButton( 1, 'Orange', this, this.buyDye, ConsumableLib.ORANGDY );
		EngineCore.addButton( 2, 'Pink', this, this.buyDye, ConsumableLib.PINKDYE );
		EngineCore.addButton( 3, 'Purple', this, this.buyDye, ConsumableLib.PURPDYE );
		EngineCore.addButton( 4, 'Green', this, this.buyDye, ConsumableLib.GREEN_D );
		EngineCore.addButton( 5, 'Ext.Serum', this, this.buyDye, ConsumableLib.EXTSERM );
		EngineCore.addButton( 9, 'Back', this, this.hairDressingMainMenu );
	};

	Salon.prototype.minotaurCumBukkakeInSalon = function() {
		EngineCore.outputText( '', true );
		CoC.player.minoCumAddiction( 10 );
		CoC.player.slimeFeed();
		EngineCore.outputText( 'As the salon door swings closed behind you, a familiar, heavenly scent catches your nose and wicks into your brain, flooding you with need and molten-hot lust.  Lynnette saunters over with her lips slightly pursed and her body jiggling, but you brush her aside.  She\'s completely forgotten as you close in on the source of your olfactory bliss.  Your sigh dreamily while your pupils slowly dilate from the familiar chemicals pounding through your bloodstream', false );
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( ' and puffing up your twat with liquid arousal.\n\n', false );
		} else if( CoC.player.hasCock() ) {
			EngineCore.outputText( ' and turning ' + Descriptors.sMultiCockDesc() + ' into a turgid, pulsating mass.\n\n', false );
		} else {
			EngineCore.outputText( '\n\n', false );
		}

		EngineCore.outputText( 'You push your way past a few more staring goblin sluts, tearing off your ' + CoC.player.armorName + ' as you go.  The animal part of your brain recognizes that such needless trapping would just get in the way of all the thick, dripping, minotaur spunk just waiting to pump inside you.  Another door swings closed behind you while the scent drags you heedlessly deeper into the salon, closing in on the secluded glory-holes the goblins keep hidden away in the back.  You drool spittle down your neck while you lose yourself in the memory of that taste on your tongue, letting your body seek it out on autopilot.', false );
		if( CoC.player.hasVagina() || CoC.player.hasCock() ) {
			EngineCore.outputText( '  A trail of ', false );
			if( CoC.player.hasVagina() ) {
				EngineCore.outputText( 'female slime ', false );
				if( CoC.player.hasCock() ) {
					EngineCore.outputText( 'and ', false );
				}
			}
			if( CoC.player.hasCock() ) {
				if( CoC.player.cumQ() < 100 ) {
					EngineCore.outputText( 'pre-cum ', false );
				} else if( CoC.player.cumQ() < 500 ) {
					EngineCore.outputText( 'pre-cum a few inches wide ', false );
				} else {
					EngineCore.outputText( 'pre-cum over a foot wide ', false );
				}
			}
			EngineCore.outputText( 'winds over the rough-hewn floor behind you, clearly marking your passage to the overpowering musk.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'Time passes in a slow, torturous manner, but you turn the corner and sigh.  Salvation is at hand – you\'ve reached the glory-holes, and to your delight there\'s nearly a dozen hard, dripping, delicious... mmmm... minotaur cocks crammed through the holes, some bulging out around the seams and leaking with need.  You saunter forwards, hips swaying sensually as the drug-like desire of potent minotaur musk pulls you ever closer.  Mewling happily, you take one of them in hand and stroke along its length, giggling as it pulses and leaks a stream of heavenly goo down your arm.   You lick it from your arm in one long, languid motion before pursing your lips around the minotaur\'s flared tip and sucking it hard as you quest for more of its heady ambrosia.\n\n', false );
		EngineCore.outputText( 'You hear a deep, strangled sigh as more and more delicious pre floods your mouth, lighting your senses up with a fireworks show of pleasure', false );
		if( CoC.player.gender > 0 ) {
			EngineCore.outputText( ' and increasing the size of the puddle you\'re leaving on the floor', false );
		}
		EngineCore.outputText( '.  In between gulps of the fragrant fluid, you suck the swollen rod deeper and deeper into your mouth, gleefully suppressing your gag reflex as it pushes aside your uvula.  You work your throat, feverishly swallowing to suck it down.  A flare briefly distends your neck as it\'s taken deeper and deeper inside your form until your lips are puckered through the hole and you\'re sniffing the minotaur\'s pheromone-laced crotch.\n\n', false );
		EngineCore.outputText( 'The beast pulls back and starts pounding the hole, letting out deep, rumbling sighs of pleasure with each throat abusing glory-hole fuck.  If it weren\'t for his constant, bubbling preseed turning your throat to a slippery rut-hole you\'d be rubbed raw, but instead you continue to lean forward, sniffing at his matted pubes every time he crushes them against your dick-stretched lips.  The other horny studs grunt with displeasure, but you reach out with your hands and grab hold two eager brutes\' throbbing horsecocks.  Three out-of-sync heartbeats hammer through your hands and throat while you do your best to get them all off.\n\n', false );
		EngineCore.outputText( 'You let your eyes drift closed and lash your tongue back and forth across the minotaur\'s lowest medial ring, feeling his flare bulge larger inside you in response.  The beast-man batters at the wall, grunting in equal measures of passion and pent-up desire as his cock\'s tip stretches wide and locks itself inside you.  His urethra bulges in rhythmic contractions, stretching your lips around the already swollen shaft and signaling to your musk-addled mind that you\'re about to get what you desire.  You hum with blissful delight as your belly begins to gurgle, accepting long bursts of sticky minotaur drug.\n\n', false );
		EngineCore.outputText( 'Tied down by the cum-spurting flare locked in your gullet, you pump on the other two dicks with feverish speed and sway on your ' + CoC.player.feet() + ' as the narcotic spooge intoxicates your already-addled mind.  You can feel each muscular contraction pulsing through the bestial shaft while it finishes depositing the heavy, sticky load, and your eyes cross from the viscous inebriation that\'s pooling in your belly.  Drizzles of pre-cum soak into your arms and palms, drawn out from the frenzied pumping of your fists.  They won\'t come from just a hand though.  They need something... tighter.\n\n', false );
		EngineCore.outputText( 'You start moaning in drug-induced bliss, but your vocalized pleasure is interrupted by the squelching slurp of the softening shaft being pulled from your dick-puckered lips.  It drips a rope of cum over your mouth and chin as it pulls free from the wall, leaving behind one vacancy among the swarm of ready minotaur dicks.  You lick up your stud\'s leavings and purr in bliss, reaching through the hole to cup the departing minotaur\'s balls teasingly.  He grunts and walks out of your grip – sated for now.  You curl your fingers into a come-hither gesture, retract your arm through the sweat-lubricated glory-hole, and wait for one of the other minotaurs to come over.\n\n', false );
		EngineCore.outputText( 'The beast who kept your left hand so busy repositions himself at the now-vacant opening, and you decide to reward him for moving so quickly.  You lick the last of the salty cream from your lips and muse that he isn\'t the only one getting a reward, but the monstrous cow-man doesn\'t need to know that.', false );
		if( CoC.player.biggestTitSize() >= 2 ) {
			EngineCore.outputText( '  You wrap the pillowy flesh of your ' + Descriptors.allBreastsDescript() + ' around the new member, pleasantly surprised by its girth and wide, already-flared tip.  Maybe you could have gotten him off with your hands after all?  ', false );
			if( CoC.player.biggestTitSize() < 6 ) {
				EngineCore.outputText( 'Even so, you can\'t quite get your breasts the entire way around him, so you make up for it by pressing it harder into you with your busy hands.  ', false );
			}
			EngineCore.outputText( 'Runnels of pre cover the shaft and squish wetly between your tits, turning your body into a slip-n-slide that reeks of hot, sticky minotaur sex.', false );
		} else {
			EngineCore.outputText( 'You crush the member tightly against your chest, smearing your torso with the copious pre until you\'re like a hot, wet slip-n-slide of minotaur sex.  You make up for it by wrapping your arms around his prodigious thickness and squeeze him tightly with your hands, stroking him off with your whole body with enough tightness to make the poor mino\' think he\'s in some poor adventurer\'s asshole.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'You lower and raise yourself, bouncing up and down on your ' + CoC.player.legs() + ' to enhance the ', false );
		if( CoC.player.biggestTitSize() >= 2 ) {
			EngineCore.outputText( 'tit-fucking ', false );
		} else {
			EngineCore.outputText( 'full-body handjob ', false );
		}
		EngineCore.outputText( 'you\'re giving out.  In such a position, you\'re given the perfect view to watch as your strokes draw forth large bubbles of pre, and before you can lose your high, you latch onto the minotaur\'s vulnerable urethra and suck, tonguing in wide circles around it since you can\'t open wide enough to accommodate his flare.  Of course, all the attention just makes him flare wider, not just at the tip, but through the whole shaft.  ', false );
		if( CoC.player.biggestTitSize() >= 2 ) {
			EngineCore.outputText( 'The sudden girth change sends an enticing ripple through your ' + Descriptors.allBreastsDescript() + ' that\'s pleasurable enough to make you moan into his steadily-widening urethra.  ', false );
		}
		EngineCore.outputText( 'You pull off and bounce faster, lost to your lust and the haze of sex-musk permeating the air, intent on seeing just how much this huge stud can spray onto you.\n\n', false );
		EngineCore.outputText( 'The minotaur does not disappoint.  His hole dilates from the size of the approaching cum-blast, and you sink down his shaft slowly until it\'s aimed directly at your face.  You close your eyes and feel the first explosion splatter over your ' + Descriptors.hairDescript() + ' and forehead.  The next takes you full in the face, making it difficult to breathe through the mask of drug-like goo, but a few quick licks gives you a fix and makes it easy to breathe again.  On and on, the minotaur pumps fat ropes of spooge over your body until you\'re a syrupy, sticky mess that reeks of minotaur pheromones so strongly that dizziness overwhelms you and you fall free of the still-orgasming mino-cock, taking a few final blasts of seed on your ' + Descriptors.chestDesc() + ' and crotch.  Your hands instinctively shovel a few loads into your ' + Appearance.assholeOrPussy(), false );
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( ' while the animal part of your brain hopes it makes you pregnant with an equally girthy son', false );
		}
		EngineCore.outputText( '.\n\n', false );
		//ADD PREG CHECK;
		//Preggers chance!;
		CoC.player.knockUp( PregnancyStore.PREGNANCY_MINOTAUR, PregnancyStore.INCUBATION_MINOTAUR, 70 );
		EngineCore.outputText( 'Giggling, you stagger over to the next cock in line and turn around, possessed with the idea of taking its spooge in the most direct way possible – anally.   You pull your butt-cheeks apart and lean back, surprising one of the horny beasts with the warmth of your ' + Descriptors.assholeDescript() + ' as you slowly relax, spreading over his flare.  He actually squirts ropes of something inside of you, but you\'ve been around minotaurs enough to know that it can\'t be cum, at least not yet.  The slippery gouts of preseed make it nice and easy to rock back and spear yourself on the first few inches, ', false );
		if( CoC.player.analCapacity() < 80 ) {
			EngineCore.outputText( 'delighting in the drug-numbed pain of stretching yourself beyond your normal capacity.', false );
		} else if( CoC.player.analCapacity() < 140 ) {
			EngineCore.outputText( 'delighting in the feeling of perfect fullness.', false );
		} else {
			EngineCore.outputText( 'delighting in realizing that you could take far larger than even this virile specimen!', false );
		}
		//(buttchange here: 90);
		CoC.player.buttChange( 90, true, false );
		EngineCore.outputText( '\n\nYou slide down the twitching bull-shaft until your ' + Descriptors.buttDescript() + ' slaps the wall, and you draw slowly away, but you push back harder, turned into a lewd, wanting whore by the massive quantity of minotaur seed in your belly, on your skin, and fogging up the air.  The beast pulls out and you whine plaintively, feeling empty and useless until he plunges back inside and reminds you of your purpose.  He starts to fuck you hard, not caring for your pleasure at all, slamming his horse-cock deep and fast.  Each of his three rings of prepuce ', false );
		if( !CoC.player.hasCock() ) {
			EngineCore.outputText( 'drags through your body, touching sensitive nerves you didn\'t even know you had until you cum, shuddering and shaking like a wanton whore.', false );
		} else {
			EngineCore.outputText( 'presses on your prostate as it squeezes by, making ' + Descriptors.sMultiCockDesc() + ' drip and spurt freely until you can bear it no longer and cum, shaking and shuddering like a wanton whore.  Jizz drips and pours from ' + Descriptors.sMultiCockDesc() + ' in a steady stream that pools on the floor, slowly rolling towards a drain that doubtless empties into a tank or greedy goblin cunt.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'The strength goes completely out of your ' + CoC.player.legs() + ', but you manage to hold yourself up long enough for your stud to flex his cock inside you and fill up your backdoor with more potent addiction.  You slide off, nerveless and still orgasming as jizz rains on your back from the abandoned cock, rolling off you to add to the ever-widening puddle of fluids on the floor.  Smiling vacantly and addled on more minotaur-cum than any one person has reason to handle, you stumble up on all fours and crawl to the next one.  More...', false );
		//[NEXT];
		CoC.player.orgasm();
		EngineCore.dynStats( 'lib', 2, 'sen', 2, 'cor', 2 );
		EngineCore.doNext( this, this.minotaurSalonFollowUp );
	};
	Salon.prototype.minotaurSalonFollowUp = function() {
		EngineCore.spriteSelect( 38 );
		EngineCore.outputText( '', true );
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00142 ] === 0 ) {
			//Unlock mino cum purchase;
			CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00142 ]++;
			//text goez here;
			EngineCore.outputText( 'Lynnette slaps your face, waking you from your stupor.  What?  Where are you?  You look around and realize you\'re strapped into a barber\'s chair and caked with white goop, but why?\n\n', false );
			EngineCore.outputText( 'The goblin answers before you can vocalize your query, "<i>Baby, you\'re so cum-hungry you make my daughters look like chaste virgins!  I haven\'t seen anyone go to town on minotaurs like that since my mother passed away, Marae guide her soul.  Normally we don\'t have that much use for the minotaurs outside of a bit of recreational drug-play, but you milked out so much cum that we can start selling it!  Isn\'t that great!?</i>"\n\n', false );
			EngineCore.outputText( 'You nod, a little shocked by your behavior, but already licking your lips in anticipation.  Lynnette smiles and says, "<i>You can buy some for the usual price, plus 60 gems, but for right now, how about some hair service?  It\'s on the house!</i>"', false );
		} else {
			EngineCore.outputText( 'You\'re woken up with a slap to the face, and still muzzy from your cum-induced glory-hole orgy, you stagger up to your ' + CoC.player.feet() + '.  Lynnette shakes her stinging palm and apologizes, "<i>Sorry I have to keep doing that, but you\'re damned hard to wake after you go on these binges!  Anyways, you\'ve earned some hair treatment if you want it.  Of course you could always buy more of your favorite fluid...</i>"\n\n', false );
		}
		//Menu;
		EngineCore.outputText( 'Lynnette offers and explains their options, "<i>So what\'ll it be hun?  We could cut it down or give you a lengthening treatment. Or you can get a hair-dye to use on your own.  Just remember to come back in a few days for a touchup.</i>"', false );
		this.salonPurchaseMenu();
	};
	Salon.prototype.mudFacial = function() {
		EngineCore.spriteSelect( 38 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You sit back in a comfortable chair and pull on a lever to recline it.  The goblins buzz around you, gathering up \'special mud\'.  You close your eyes, letting them plaster your ' + CoC.player.face() + ' with the stuff in hopes that it will improve your complexion as much as you\'ve been promised.  A pair of cucumber slices are laid out on your eyes, obscuring your view.\n\n', false );
		EngineCore.outputText( 'With that finished, the crowd of busty, green-skinned women disperses to leave you in peace.  Time drags on, but eventually the mud hardens and cracks.  As if on cue, tiny hands emerge with wet rags to scrub your face clean.  Once they\'ve finished, you feel like a whole new you! (+10 femininity)', false );
		CoC.player.modFem( 100, 10 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	Salon.prototype.sandFacial = function() {
		EngineCore.spriteSelect( 38 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You sit back in a comfortable chair and pull on a lever to recline it.  The goblins buzz around you, gathering up \'special sand\'.  You close your eyes, letting them splatter your ' + CoC.player.face() + ' with the rough, textured goop.  It doesn\'t feel very good, but that won\'t matter if it makes you as handsome as it\'s supposed to.\n\n', false );
		EngineCore.outputText( 'After a while the goblin girls come back and clean the stuff from your face. (+10 masculinity)', false );
		CoC.player.modFem( 0, 10 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	/*
	 Salon.LYNNETTE_PREGNANCY_CYCLE = 1022; //0-3 = pregnant. 4-6 = not.
	 LYNNETTE_APPROVAL = 1023;
	 Salon.LYNNETTE_BABY_COUNT = 1024;
	 Salon.LYNNETTE_CARRYING_COUNT = 1025;
	 */
	//Impregnate;
	Salon.prototype.fuckLynnette = function() {
		EngineCore.clearOutput();
		//Checks to see if you've cum withint hte past 24 hours.;
		if( CoC.flags[ kFLAGS.LYNNETTE_FUCK_COUNTER ] === 0 ) {
			EngineCore.outputText( 'At your suggestion, Lynnette\'s eyelashes flutter dangerously low. She gives you a smokey look and asks, "<i>Is that so?</i>" She circles around you, looking you up and down with eyes that seem to bore right through your [armor]. She must see something she likes, because she dips forward, parting her weighty melons around your ' );
			if( CoC.player.tallness >= 72 ) {
				EngineCore.outputText( '[leg]' );
			} else if( CoC.player.tallness >= 55 ) {
				EngineCore.outputText( '[hips]' );
			} else {
				EngineCore.outputText( 'side' );
			}
			EngineCore.outputText( ' so that she can slip a manicured hand inside your underclothes. She handles [eachCock] ' );
			if( CoC.player.cockTotal() > 1 ) {
				EngineCore.outputText( 'in turn ' );
			}
			EngineCore.outputText( 'with the skill of a practiced snake-charmer before ' );
			if( CoC.player.balls === 0 ) {
				EngineCore.outputText( 'pressing down near the [sheath]' );
			} else {
				EngineCore.outputText( 'curling her petite fingers around your [sack] to heft it' );
			}
			EngineCore.outputText( '.' );
			//IF FAIL!;
			if( CoC.player.hoursSinceCum < 24 ) {
				EngineCore.outputText( '\n\nA feminine giggle slips free of her lips.  "<i>I\'m sorry [name], but I don\'t get knocked up unless I\'m going to get knocked up with a dozen daughters.</i>"  She gives your package a longing squeeze and extricates her hand, letting her palm caress your sensitive groin and belly on the way out.  "<i>I need thick, sticky, pent-up jism that\'s going to be desperate to inseminate every egg it can get its hands on.</i>"  She shivers at the thought, saying, "<i>Come back when you\'ve let yourself go a full twenty four hours without cumming.  Then you can get me pregnant... assuming some other lucky stud hasn\'t already.</i>"' );
				EngineCore.outputText( '\n\nShe licks your scent from her fingers and asks, "<i>Now, was there another way you wanted to pay?</i>"' );
				this.salonPaymentMenu();
				return;
			}
		}
		//Repeat cum within 24 hours check;
		else {
			EngineCore.outputText( 'Lynnette licks her lips at your decision and sashays forward, her immense hips rocking with enough sensuality that her plush ass is practically having a sexquake.  "<i>You\'ll understand if we do a quick check then, right, [name]?</i>" She doesn\'t wait for an answer, pressing herself against you so that you can get a good feel of her soft, sopping-wet tits conform to the shape of your body, letting the moist heat that seems to radiate from every pore of Lynnette\'s petite shape soak into your exposed ' + CoC.player.skinFurScales() + '.  Her hand dives right into your underwear without asking, seizing tight around [oneCock] to heft it.' );
			EngineCore.outputText( '\n\nYou give up an appreciative groan, [eachCock] twitching in lewd enjoyment as ' );
			if( CoC.player.lust <= 75 ) {
				EngineCore.outputText( 'it fills to full size almost immediately' );
			} else {
				EngineCore.outputText( 'it\'s fully-erect state makes itself known' );
			}
			EngineCore.outputText( '. Lynnette strokes a few times to make sure you\'re suitably engorged and then shifts lower, squeezing ' );
			if( CoC.player.balls === 0 ) {
				EngineCore.outputText( 'around your [sheath] to get a feel for how pent-up you are' );
			} else {
				EngineCore.outputText( 'gently at your [balls], weighing them in her palm to get a feel for just how pent-up you are' );
			}
			EngineCore.outputText( '.' );
			//NOT ENOUGH!;
			if( CoC.player.hoursSinceCum < 24 ) {
				EngineCore.outputText( '\n\nA frown slowly spreads across her face.  "<i>[name], this just won\'t do. I need anxious, needy little sperm that will scream out of your cock with enough force to impregnate my ovaries.  I can\'t get that if you\'re getting off all the time.  Come back after you\'ve gone without blowing a load for twenty four hours, and I\'ll give you a proper place to do it... if someone else hasn\'t beaten you to it.  Did you want to stick around and pay another way?</i>"' );
				this.salonPaymentMenu();
				return;
			}
		}
		//There is enough!;
		EngineCore.outputText( '\n\nLynnette coos, "<i>There it is... that yummy, nasty seed that you\'ve let wait and bake for hour after hour.</i>" She shivers in anticipation.  "<i>You\'re going to stuff every single drop of that sticky stuff straight inside me, and it\'s going to be so thick it glues my snatch shut until it\'s time for birthing.  Got it?</i>"  She squeezes down on [oneCock] with near-painful firmness, holding you completely and totally erect in the palm of her hand as she easily works off your [armor].  "<i>Yes you are.... Oh, this is just what I needed today,</i>" the green woman sighs while rubbing your ' );
		if( CoC.player.balls > 0 ) {
			EngineCore.outputText( '[balls]' );
		} else {
			EngineCore.outputText( '[sheath]' );
		}
		EngineCore.outputText( ' with hunger in her eyes.' );
		EngineCore.outputText( '\n\nTossing your discarded [armor] over her shoulder, Lynnette starts off towards a cleverly concealed side room, dragging you along by the [cock biggest] in her wake.  Her plush, wobbling ass ticks back and forth like a lascivious metronome with each step, shaking just enough that your eyes are held almost spellbound, tracking the reflections as they play across the shimmering dress that\'s trying and failing to contain the inhuman juiciness of her bootylicious derriere.  Catching you staring, she gives you a gentler, more comforting squeeze.  "<i>Just wait til you see me get out of this thing, honey... and try to keep from blowing until we get you inside me.</i>"' );
		EngineCore.outputText( '\n\nYou nod and kick the door to Lynnette\'s room closed behind you. The bedroom, much like its owner, is a compact little thing, hewn in by four close cave walls, but the ceiling rises up at least ten feet, ensuring that the space is comfortable for everything from a goblin to a minotaur.  Lynnette\'s bed is oversized to the extreme, filling the entire room almost entirely by itself.  The goblin matron finally lets you go and bounces up onto her bed, turning to face you.' );
		EngineCore.outputText( '\n\nStarting with one loose shoulder strap, Lynnette eases the edge of her top down, exposing her rich emerald areola without quite letting you see the rigid tip of her nipple.  The clingy fabric shrouding it darkens slightly, stained with a spurt of eager lactation, slicked down so that it reveals the entire shape of the curvacious beauty\'s teat.  She repeats the action on the other side, letting both sides of her dress hang entirely off her lewdly jutting nipples, the pebbly areolas\' top halves wantonly displayed to your roving eyes as she shakes back and forth.  Her tits bounce and shake like lewd toys, colliding with boob-rippling force before bouncing apart, each hit causing the hem to sink lower until her protruding nubs pop free.' );
		EngineCore.outputText( '\n\nLike a balloon with all the air let out, Lynnette\'s gauzy dress wobbles and collapses downward towards her obscenely flared hips, collecting in a ring of folded fabric around her waist.  She bounces on the bed, sending her unsupported mammaries to undulate in a licentious display that culminates in sudden sprays of creamy, alabaster milk from each freed nipple.  She rolls her hips around with the skill of a belly dancer while trickles of white roll across her shaking viridian middle, letting the dress slip lower and lower, eventually revealing the dark-flushed skin just above her cleft.  With a wink, she peels the milk-damp fabric away from her dark, passion inflamed mound, the sound of the separation clearly audible.  Long strands of feminine wetness connect the threads to Lynnette\'s body for the briefest moment before breaking to fall upon her thick, curvaceous thighs.' );
		EngineCore.outputText( '\n\nLynnette\'s bed bounces as she lets herself fall back into her pillows, and you watch her cowgirl-sized knockers flatten slightly under their own weight, showing just how big they truly are.  Everything below her neck and above her belly-button is covered in an ocean of jade breast-flesh, one the goblin is happy to highlight by digging her fingers into it, letting her digits vanish into the oh-so-soft love-cushions.  She moans and spreads her legs, giving you a better view while she bats her eyelashes in the most ravenous come-hither look you\'ve ever seen.  Her lower lips, wet and plump with love-juices, part slightly, inviting you to fill them.  You know full well that she\'s had many daughters, but the flawless, malachite swell of her snatch shows no sign of wear, and rather, glistens as evidence of her race\'s natural elasticity.' );
		EngineCore.outputText( '\n\n"<i>Mount me,</i>" the goblin growls as she displays her nude body to you, "<i>I want to feel you inside, [name].  I want to make you cum for me.</i>"  She smiles lecherously.  "<i>You WILL cum for me.</i>"  The glittering look of promise in her eyes leaves no room for doubt in your heart.  She\'s going to wind up with a cuntful of cum, and all you can do is provide it for her.' );
		EngineCore.outputText( '\n\nBefore you can crawl into bed after her and give her the loving she deserves, you catch a whiff of something sweet and undeniably... fertile in the air. It\'s obviously the pheromone-laden scent of the green matron\'s arousal, hanging thickly in the air and working its way into your system. Twitching unsubtly, your maleness' );
		if( CoC.player.cockTotal() > 1 ) {
			EngineCore.outputText( 'es have' );
		} else {
			EngineCore.outputText( ' has' );
		}
		EngineCore.outputText( ' begun to bead clear droplets of precum. They run down the underside of your distended, eager cumvein' );
		if( CoC.player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ' and race down towards your ' );
		if( CoC.player.balls > 0 ) {
			EngineCore.outputText( '[balls]' );
		} else {
			EngineCore.outputText( '[sheath]' );
		}
		EngineCore.outputText( ', leaving a glossy, sexual shine in their wake, and they\'re only coming on faster and faster the longer you gaze upon Lynnette\'s emerald twat and inhale her prick-stiffening scent.' );
		EngineCore.outputText( '\n\n"<i>Fuck me,</i>" the pregnancy-obsessed slut begs as she moves a hand down to her cunny, spreading the lips wide-open with reveal a glittering amethyst tunnel that promises sublime pleasure to all who enter.' );
		EngineCore.outputText( '\n\nYou climb up onto the bed with one hand wrapped around [oneCock] and your eyes leering down over your jade prize, your dick oozing droplets of molten-hot pre onto your waiting conquest\'s slick thighs as you climb into position. She looks up at you imploringly as she awaits the inevitable penetration, grabbing your hand and pressing down on her sodden box. The sensation reminds you vaguely of holding your hand above a pot of boiling water, the steaming heat collecting into condensation upon your hand. That settles it; you absolutely need to fuck her NOW! Your dick' );
		if( CoC.player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ' won\'t take no for an answer.' );
		var x = CoC.player.cockThatFits( 80 );
		if( x < 0 ) {
			x = CoC.player.smallestCockIndex();
		}
		EngineCore.outputText( '\n\nGrunting as you aggressively move yourself into place, you lock eyes with the shameless slut, letting her know with a single look just how hard you are going to fuck her, how perfectly pounded her pussy is going to be.  That one expression leaves her unequivocally sure of her impending bowleggedness, and the little tart just grins.  You thrust forward with all the subtleness of a rampaging bull, battering your ' + CoC.player.cockHead( x ) + ' right through her slobbering delta, feeling the lips cling to your girth as they\'re stretched out into an o-ring of cock-squeezing pleasure, somehow incredibly tight around you but with more give than any woman ought to have.' );
		if( CoC.player.cockArea( x ) > 50 ) {
			EngineCore.outputText( '  Her tummy bulges with the outline of your swollen mass, clearly displaying the shape of your bitch-breaking dong as it travels up ' );
			if( CoC.player.cockArea( x ) <= 80 ) {
				EngineCore.outputText( 'her belly.' );
			} else {
				EngineCore.outputText( 'into her ribcage, penetrating farther than any lesser race could ever hope to handle.' );
			}
		}
		EngineCore.outputText( ' The breeder grabs hold of your [hips] and tugs as hard as her meager strength will allow.  ' );
		if( CoC.player.cockArea( x ) <= 90 ) {
			EngineCore.outputText( 'Slapping against her hard enough to release a splash of girlish cum, you hilt yourself completely' );
			if( CoC.player.balls > 0 ) {
				EngineCore.outputText( ', [balls] resting on her soaked, juicy ass-cheeks.' );
			}
		} else {
			EngineCore.outputText( 'Eventually stopping, you look down to realize that she hasn\'t taken all of you. Going any farther would likely hurt her and ruin the fun, so you\'ll have to make to with partial strokes.' );
			if( CoC.player.balls > 0 ) {
				EngineCore.outputText( '  Her feet wrap around your [sack] to squeeze your [balls] affectionately, compensating quite nicely for her own shortcomings.' );
			}
		}
		EngineCore.outputText( '\n\nLynette is so goddamned wet! Her twat is a sopping-wet furnace around your ' + Descriptors.cockDescript( x ) + ', clenching down tightly to hold you still while she adjusts to the shape and size of hard-throbbing inseminator.  A happy, brainless smile spreads across her face in reaction to the mounting, though her hands remain stubbornly on your hips, helping to keep you from pounding away until she\'s ready.  While you\'re immobilized, you decide to avail yourself of the goblin\'s other features, gripping as much of one titanic tit as you possibility can.  Your hand barely covers a quarter of the swollen bosom, and your fingers sink deeply into the forgiving green flesh, eliciting a gasp of pleasure from the hairdresser when you shift your grope to place her nipple within your reach.' );
		EngineCore.outputText( '\n\nLosing control of her abdominal muscles from the forcible, nipple-bound bliss, Lynnette\'s cock-arresting grip collapses, and you\'re free to saw away at her gushing nethers, dragging your ' + Descriptors.cockDescript( x ) + ' out until only the head remains embedded within her purple-tinged interior and then, slamming it back in just as hard as your initial penetration.  Her hands slip off your [hips] and down to the sheets, where they gather up fistfuls of the increasingly sex-stained fabric and clench.  The honey hole around you flutters uncontrollably, clenching wildly as you thrust powerfully through it, mixing your pre-cum with its own copious leavings until there\'s a whitish slurry leaking from the increasingly puffy entrance.' );
		EngineCore.outputText( '\n\nThe blissed-out goblin\'s eyelids droop closed a second after her eyes roll back, and she calls out, "<i>Oh fuck yessssssss, that\'s the spot!  Fuck me!  Fuck me!  YES!</i>"  Her body shudders, accompanied by a screech of pleasure.  "<i>You\'re making me c-c-c-cum...!</i>"  Lynnette\'s wonderfully fertile thighs roll with the waves of passion she\'s riding, rhythmically squeezing down on your dick with inadvertent muscular contractions that feel so good they almost suck the cum straight out of your [balls].' );
		EngineCore.outputText( '\n\nSomehow, you don\'t blow your load into the dick-massaging goblin twat right then and there. Compelled by an urgent, instinctive need, you continue to saw your raging-hard phallus into Lynnette\'s musky cunt, splattering love-juices everywhere. The seed trapped inside your [balls] churns and roils as your body does its damnedest to maximize its output' );
		if( CoC.player.balls > 0 ) {
			EngineCore.outputText( ', making your sack feel tight and your testes bloated and tender.' );
		} else {
			EngineCore.outputText( ', making your gut clench and spasm with near-orgasmic contractions.' );
		}
		EngineCore.outputText( '  There\'s a tsunami of sperm building up inside you to the point where holding it in is actually starting to hurt you, but at the same time, your body refuses to give in and climax yet either.' );
		EngineCore.outputText( '\n\nLynnette\'s huge, milk-dripping nipples erupt like the verdant volcano peaks they resemble, spraying gushes of ivory cream in lewd cascades that wash over you both, acting as a sweet, slick lubricant that allows her thighs to slip and slide over your own with ease.  She whimpers when your hands attach themselves to her leaky teats, attracted to the mounds as if by magnetism, and you squeeze down on them, pinching off the flow only to release the pressure, making her release her lactic load in huge, pulsing sprays.  She cries out, "<i>Milk me!  Milk me like a dirty, bova slut!</i>"  Her back lifts to press those squirting nubs more firmly between your fingers as another orgasm, smaller than the first, wracks her tender, tiny body.' );
		EngineCore.outputText( '\n\nYour thrusts transform from powerful lunges into a frenzied jackhammering so powerful that the impact ripples along her considerable thighs and ass.  Even her squirting tits shake and jostle with the pussy-plowing impacts as you mount the goblin like a rutting beast, battering your ' + CoC.player.cockHead( x ) + ' ' );
		if( CoC.player.cockArea( x ) > 24 ) {
			EngineCore.outputText( 'up against her slightly-yielding cervix' );
		} else {
			EngineCore.outputText( 'in as close to the cervix as you possibly can' );
		}
		EngineCore.outputText( ', grunting and growling as you lose yourself in the feel of her soaked, velvet tunnel.  Your focus collapses entirely down to the feel of that slick tunnel around you and how far you can push into it, how strongly you can make it climax and squeeze around you.' );
		EngineCore.outputText( '\n\nLooking up at you in between reason-deadening orgasms, Lynnette purses her considerably puffy, cock-sucking lips to lick them.  She reaches up with both arms to grab you firmly about the neck, surprising you with her strength as she pulls you down, guiding your mouth to her moistened puckers for an eager kiss.  Her lips slip and slide across yours as you nuzzle mouth to mouth, your hips still working, and you trade saliva, sparring your tongues back and forth between your paired oral orifices.  One of her hands grabs your [hair] in a tight grip, breaking the kiss long enough for her to growl, "<i>Cum.  Now.</i>"' );
		EngineCore.outputText( '\n\nYour body has been ready to go off for some time now, and the words act like an irresistible trigger for your climax, causing you to lurch your ' + Descriptors.cockDescript( x ) + ' ' );
		if( CoC.player.cockArea( x ) <= 90 ) {
			EngineCore.outputText( 'completely inside once more' );
		} else {
			EngineCore.outputText( 'as deeply inside as you can' );
		}
		EngineCore.outputText( ' and hold it there.' );
		if( CoC.player.cockTotal() > 1 ) {
			EngineCore.outputText( '  Your other member' );
			if( CoC.player.cockTotal() > 2 ) {
				EngineCore.outputText( 's are' );
			} else {
				EngineCore.outputText( ' is' );
			}
			EngineCore.outputText( ' spasming ' );
			if( CoC.player.longestCockLength() <= 12 ) {
				EngineCore.outputText( 'on the greedy green slut\'s belly' );
			} else {
				EngineCore.outputText( 'in the milk-stained valley between her tits, absolutely buried in squishy-soft breast' );
			}
			EngineCore.outputText( ', jizzing in wild spurts.  The cum mixes with all the goblin-cream into a sticky-slick morass that paints Lynnette white.' );
		}
		EngineCore.outputText( '  Screaming with relief, you can feel the cum rushing out from your [balls], through your middle, and down the length of your quim-buried tool, distending it as blobs of cum roll through the honeyed folds to explode against the well-endowed goblin\'s cervix. The touch of cum at the womb\'s entrance sends your lover back into another body-shaking climax; her eyes roll back, her pussy clamps down, and most importantly, her cervix dilates into a wide-open hole, sucking the cum straight into her womb as fast as you can shoot it.' );
		EngineCore.outputText( '\n\nTiny hands latch onto your shoulders as you pour your distilled lusts into the lucky woman\'s womb, digging deeply into your ' + CoC.player.skinFurScales() + '. Lynnette\'s lips crash back against yours, her tongue burrowing into your mouth before she traps your lower lip, biting it painfully hard. Her eyes roll back, and her body shakes with so much pleasure that she almost looks to be having a seizure.  Your cock doesn\'t care about that any more than her sperm-hungry uterus does, the two organs far too busy exchanging genetic material to care what state their owners are in.' );
		//Baby's first cumflation;
		if( CoC.player.cumQ() < 1000 ) {
			EngineCore.outputText( '\n\nIn no time flat, you\'ve finished cumming, and Lynnette\'s womb has swallowed every single drop.  Her luscious slit\'s juices run clear, leading you to believe that her gluttonous womb swallowed it all.' );
		}//One liter minor cumflate;
		else if( CoC.player.cumQ() < 3000 ) {
			EngineCore.outputText( '\n\nThere\'s enough cum pouring out of you that Lynnette\'s briefly-taut tummy plumps with impregnating weight, filled just enough to give her a tiny, jiggling paunch of baby-making delight.  You empty your last few ropes into her, noting that not even a single drop escapes her luscious slit, and smile, completely satiated.' );
		}//Three liter good cumflate;
		else if( CoC.player.cumQ() < 6000 ) {
			EngineCore.outputText( '\n\nThere\'s so much cum flowing out of your ' + CoC.player.cockHead( x ) + ' that Lynnette\'s once-taut tummy immediately plumps up with spermy weight, filled into a jiggly paunch by your first few blasts.  As you continue to flood her womb with your slurry of baby-making goodness, her belly continues to rise up between you, eventually arcing up into a gravid dome.  Somehow, her body holds it all inside, and only a small trickle of spunk leaks out of her luscious slit as you finish.' );
		}//Six liter major cumflate;
		else if( CoC.player.cumQ() < 10000 ) {
			EngineCore.outputText( '\n\nOh gods, there\'s so much cum! It\'s rushing out of you like a river, bloating the poor goblin\'s once-narrow abdomen into a small, pregnant-looking dome.  Each successive womb-filling makes the rounded bulge jostle cutely before bulging bigger, expanding under the weight of your immense virility until her emerald distention is covered in shiny, taut skin.  Her belly-button pops out into an outtie, and the goblin\'s sultry slit finally fails to contain the pressure, allowing what feels like a liter of your cum to backwash out over you.' );
		}//10 liter ludicrous cumflate!;
		else {
			EngineCore.outputText( '\n\nOh gods!  Every torrential outflow of cum is so substantial that it\'s literally stretching the poor goblin out as it rushes into her womb.  The first two blasts are enough to turn her once-taut middle into a sperm-stuffed dome, and you just keep shooting after that, each time making her gravid tummy jiggle and swell, rounding fuller and fuller until her bulging midsection seems almost as big as her.  Her belly button long ago popped out into an outtie, and the smooth, emerald skin shines with its overstretched tightness.  Lynnette whimpers softly, and a sudden torrent of spunk rolls out around your ' + Descriptors.cockDescript( x ) + '.  It seems she just couldn\'t hold it all in, and you aren\'t even done cumming yet!  You resume sliding in and out as you jizz, washing your soon-to-be-pregnant fucktoy\'s tunnel with generous waves of spooge until you finally exhaust yourself.' );
		}
		EngineCore.outputText( '\n\nLynnette holds you tight until she\'s absolutely sure you\'ve spent every drop' );
		if( CoC.player.cumQ() >= 3000 ) {
			EngineCore.outputText( ', even if ' );
			if( CoC.player.cumQ() >= 10000 ) {
				EngineCore.outputText( 'most' );
			} else {
				EngineCore.outputText( 'some' );
			}
			EngineCore.outputText( ' of it is on the bed at this point' );
		}
		EngineCore.outputText( '.  Only then does she release you, allowing you to slide out' );
		if( CoC.player.hasKnot( x ) ) {
			EngineCore.outputText( ' with a wet-sounding \'pop\'.  Your knot does a terrific job of gaping her lips during its exit, and you cannot help but marvel at how well you\'ve broken this bitch in.  A shame she\'ll probably tighten up again in short order' );
		} else {
			EngineCore.outputText( ' with a gush of girlspunk to chase you' );
		}
		EngineCore.outputText( '.  She groans, ' );
		//BELOW ONE LITER!;
		if( CoC.player.cumQ() < 1000 ) {
			EngineCore.outputText( '"<i>[name], that was fun, but you barely even came!  How am I supposed to birth a dozen daughters at once if you barely coat the surface of my womb!?</i>"  She shudders.  "<i>Go on. I\'ve got to find some drugs to fix this, else I won\'t get a decent brood out of this term.</i>"\n\nYou leave her feeling a little underappreciated.  Maybe you could find some cum-boosting supplements out there?  Still, you are owed a haircut...' );
			this.lynnetteApproval( -2 );
		}
		//'GOOD';
		else if( CoC.player.cumQ() <= 10000 ) {
			if( CoC.flags[ kFLAGS.LYNNETTE_ANNOUNCED_APPROVAL ] === 1 ) {
				EngineCore.outputText( '"<i>Wow, [name].  You cum like a minotaur... and without drugging me out of my mind to boot!  Gods, I can feel the little swimmers hunting down my eggs already.</i>"  She giggles and retrieves a vial, downing it in a single gulp.  "<i>I better make sure there\'s enough eggs for them all, huh?</i>"\n\nYou leave with a happy smile. It seems Lynnette approves of you as a mate.' );
			}
			//'GOOD + LYNNETTE FAVORITE';
			else {
				EngineCore.outputText( '"<i>Mmmm, [name], I love the way you pack me full.</i>"  She tosses back a vial of fertility-boosting chemicals and sighs.  "<i>Do me a favor and come back soon.  I\'d rather be pouring out swarms of your babies than a slurry of weakling sluts.</i>"' );
			}
			this.lynnetteApproval( 10 );
		}
		//'UBUR';
		else {
			if( CoC.flags[ kFLAGS.LYNNETTE_ANNOUNCED_APPROVAL ] === 0 ) {
				EngineCore.outputText( '"<i>Ohhh... oh gods....  W-wha?  How...?  I\'m so fucking full, [name]!  I can feel it, like I\'m pregnant and about to pop already, and I haven\'t even given my babies a chance to fertilize!</i>"  She gathers some of your leaking spooge to smear across the titanic dome with one hand and a bottle of fertility enhancers with the other.  "<i>Go on baby, I\'m just going to soak in it for a little while and make sure I get as many girls out of this as I can.</i>"  Lynnette knocks back the vial and drops it at her side, focusing entirely on wallowing in your cum.\n\nYou swagger out into the main room with a happy smile, noting the envious looks you get from her daughters when they try to offer you \'services\'.' );
			}
			//'UBUR + LYNNETTE FAVORITE';
			else {
				EngineCore.outputText( '"<i>Fuck me, honey! I... you\'re the only one that can fill me like this, you know?  Short of a machine, I mean.</i>"  Lynnette colors a deep green as she struggles to reach for a bottle of a fertility-enhancing chemical, half-pinned by her own cum-stuffed weight.  You easily hand it to her with a smile, and she downs it before gazing gratefully your way.  "<i>I fucking love just lying here, fucking into oblivion, lying in a lake of my stud\'s lusts, wallowing in it until I pass out from pleasure.</i>"\n\nShe sounds almost lovey-dovey in her declaration and must realize it, because her tone changes when she says, "<i>Just make sure you come back in a few days to give me another proper fucking.  You\'ll do it if you know what\'s good for your dick!</i>"\n\nYou silence her with a kiss that leaves her swooning and stroll out, dressing on the way.  Lynnette\'s satiated moans seem to haunt you the entire time you remain in the salon.' );
			}
			this.lynnetteApproval( 25 );
		}
		CoC.flags[ kFLAGS.LYNNETTE_FUCK_COUNTER ]++;
		CoC.player.orgasm();
		CoC.flags[ kFLAGS.LYNNETTE_CARRYING_COUNT ] = 3 + Utils.rand( 3 );
		if( CoC.player.cumQ() >= 1000 ) {
			CoC.flags[ kFLAGS.LYNNETTE_CARRYING_COUNT ] += 1 + Utils.rand( 3 );
		}
		if( CoC.player.cumQ() >= 2000 ) {
			CoC.flags[ kFLAGS.LYNNETTE_CARRYING_COUNT ] += 1 + Utils.rand( 3 );
		}
		if( CoC.player.cumQ() >= 3000 ) {
			CoC.flags[ kFLAGS.LYNNETTE_CARRYING_COUNT ] += 2 + Utils.rand( 3 );
		}
		if( CoC.player.cumQ() >= 4000 ) {
			CoC.flags[ kFLAGS.LYNNETTE_CARRYING_COUNT ] += 2 + Utils.rand( 3 );
		}
		if( CoC.player.cumQ() >= 6000 ) {
			CoC.flags[ kFLAGS.LYNNETTE_CARRYING_COUNT ] += 2 + Utils.rand( 3 );
		}
		if( CoC.player.cumQ() >= 10000 ) {
			CoC.flags[ kFLAGS.LYNNETTE_CARRYING_COUNT ] += 2 + Utils.rand( 3 );
		}
		CoC.flags[ kFLAGS.LYNNETTE_PREGNANCY_CYCLE ] = 0;
		this.salonPurchaseMenu();
	};
	Salon.prototype.lynnetteApproval = function( arg ) {
		if( arg !== undefined && arg !== 0 ) {
			CoC.flags[ kFLAGS.LYNNETTE_APPROVAL ] += arg;
		}
		if( CoC.flags[ kFLAGS.LYNNETTE_APPROVAL ] < -100 ) {
			CoC.flags[ kFLAGS.LYNNETTE_APPROVAL ] = -100;
		} else if( CoC.flags[ kFLAGS.LYNNETTE_APPROVAL ] > 100 ) {
			CoC.flags[ kFLAGS.LYNNETTE_APPROVAL ] = 100;
		}
		return CoC.flags[ kFLAGS.LYNNETTE_APPROVAL ];
	};
	SceneLib.registerScene( 'salon', new Salon() );
} );