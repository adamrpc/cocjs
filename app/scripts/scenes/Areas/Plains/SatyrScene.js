﻿'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, MainView, ArmorLib, Utils, Satyr, PregnancyStore, kFLAGS, Combat, CoC, EngineCore, Descriptors ) {
	function SatyrScene() {
	}

	//const SATYR_KIDS:int = 603;;
	//Game Implementation (code from here);
	//Fight Encounter (Z);
	//Happens either in the plains or the swamp.;
	//Fighting Descript (Z);
	/*You are fighting a satyr! (Level)
	 Note: Satyrs actively increase their own lust in order to use their lust charge, if increasing their own lust will cause the satyr to lose the battle, then he should do something else! In other words, the conditions to execute a lust charge are mutually exclusive with the conditions to execute a lust increase.
	 */

	SatyrScene.prototype.satyrEncounter = function( location ) {
		if( location === undefined ) {
			location = 0;
		}
		MainView.clearOutput();
		EngineCore.spriteSelect( 98 );
		if( Utils.rand( 2 ) === 0 || CoC.player.pregnancyIncubation > 0 || CoC.player.buttPregnancyIncubation > 0 || CoC.player.gender === 0 ) {
			EngineCore.outputText( 'As you cross the ' );
			if( location === 0 ) {
				EngineCore.outputText( 'grassy plains' );
			} else {
				EngineCore.outputText( 'sodden expanse of the swamp' );
			}
			EngineCore.outputText( ', you hear lewd bellowings and drunken curses.  From out of the expanse of green comes a humanoid figure with a set of goat-like horns curling from his head.  Seeing you, he lets out a randy bleat and charges, naked erection jabbing before him!' );
			Combat.startCombat( new Satyr() );
		}
		//Non-aggressive Encounter (Z);
		//Happens in either the plains or swamp;
		//Pregnant PCs can't get this encounter.;
		else {
			EngineCore.outputText( 'You wander through the ' );
			if( location === 0 ) {
				EngineCore.outputText( 'grassy plains' );
			} else {
				EngineCore.outputText( 'sodden expanse of the swamp' );
			}
			EngineCore.outputText( ' when you hear strange music emanating not far from where you are.  Do you investigate?' );
			//[Yes][No];
			if( location === 0 ) {
				EngineCore.doYesNo( null, EngineCore.createCallBackFunction( this, this.consensualSatyrFuck, 0 ), SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			} else {
				EngineCore.doYesNo( null, EngineCore.createCallBackFunction( this, this.consensualSatyrFuck, 0 ), SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			}
		}
	};
	//[=Yes=];
	SatyrScene.prototype.consensualSatyrFuck = function( loc ) {
		if( loc === undefined ) {
			loc = 0;
		}
		MainView.clearOutput();
		EngineCore.spriteSelect( 98 );
		EngineCore.outputText( 'You decide to search for the source of the music.' );
		EngineCore.outputText( '\n\nSitting in a small circle of ' );
		if( loc === 0 ) {
			EngineCore.outputText( 'trampled-down grass' );
		} else {
			EngineCore.outputText( 'relatively dry and solid ground' );
		}
		EngineCore.outputText( ' is a strange figure, resembling a man with the legs and horns of a goat - a satyr.  He is surrounded by bottles and skins of drinkables and plates of food.  Currently playing a set of panpipes, he stops the music to grab a skin and messily guzzles down its contents, spilling purplish liquid across his chest and producing a strong smell of alcoholic liquor.  He finishes quenching his thirst, wipes his lips with the back of one hairy arm, and laughs contentedly.  Finally noticing you, he beams widely.  "<i>Welcome!  Welcome, friend; please, come!  Sit!  Drink with me!  I rarely have good company to share my meals with these days!</i>" he exhorts you, full of cheer.' );
		EngineCore.outputText( '\n\nYour stomach grumbles at the sight of food and drink, suddenly you feel like you haven\'t eaten in ages... you eagerly accept the satyr\'s invitation, taking a seat across him.' );
		EngineCore.outputText( '\n\nSmiling jubilantly, the satyr wastes no time in offering you the pick of the food around you, handing over a whole skin of wine (or something just as alcoholic) so full it can\'t even slosh.  "<i>Eat!  Drink!  Make merry!  It\'s not everyday that you find someone who merely wants to enjoy the good things in life, after all.</i>"  He laughs, then shakes his head with exaggerated sadness.  "<i>Such a pity everyone is so impatient these days - all rush-rush, fuck-fuck, rape-rape.  No one has time to party anymore.</i>"  He says, giving a melodramatic sigh of disapproval.' );
		EngineCore.outputText( '\n\nYou barely hear him as you shove as much food inside your mouth as you can and begin drinking from the skin he offered you.  Once the deliciously alcoholic liquid hits your tongue, you feel a wave of warmth sweep through you, spreading all over your body (and focusing on your genitals.)' );
		EngineCore.outputText( '\n\nThe satyr laughs heartily.  "<i>That\'s good!  Eat up, drink your fill; it does me proud to see someone enjoying themselves.</i>"  He sighs softly.  "<i>Once, we satyrs threw the most riotous parties... but those days are in the past, I guess.</i>"  He shakes his head and smiles.  "<i>Then again, these times have their good sides too.</i>"' );
		EngineCore.outputText( '\n\nYou barely register what he\'s saying, the beverage hits you with such force you immediately stop drinking and start coughing, spilling some of the booze on the floor.' );
		//(+Lust);
		EngineCore.dynStats( 'lus', 25, 'resisted', false );
		EngineCore.outputText( '\n\nThe satyr bellows with laughter and takes a huge swig of his own wineskin.  "<i>Looks like you need more practice with your liquor!</i>" he chortles.  "<i>Go on, drink up; practice makes perfect.</i>"' );
		EngineCore.outputText( '\n\nIt suddenly dawns upon you that this satyr might not have the most noble intentions... you\'re pretty sure there\'s some sort of aphrodisiac inside this beverage he offered you, judging by the heat that spreads through your body.' );
		//Trick him only available to High Int PCs and Skip Foreplay only available to High Libido PCs.;
		var trick = null;
		//(if High Int);
		if( CoC.player.inte > 60 && CoC.player.lust <= 99 ) {
			EngineCore.outputText( '\n\nPerhaps you could trick him into knocking himself out with it?' );
			trick = this.trickZeSatyr;
		}
		var foreplay = null;
		//(if High Libido);
		if( CoC.player.lib > 60 ) {
			EngineCore.outputText( '\n\nThat cock of his looks yummy, though... there\'s no need for all this ruse, you\'re pretty sure you know how to handle a dick; maybe you should skip foreplay and let him fill you up...' );
			foreplay = this.skipForeplay;
		}
		//What should you do?;
		//[Trick him] [Keep Drinking] [Skip Foreplay] [Leave];
		EngineCore.choices( 'Trick Him', this, trick, 'Keep Drinking', this, this.keepDrinking, 'Skip Foreplay', this, foreplay, '', null, null, 'Leave', this, this.leavePartySatyr );
	};
	//[=Keep Drinking=];
	SatyrScene.prototype.keepDrinking = function() {
		MainView.clearOutput();
		EngineCore.spriteSelect( 98 );
		EngineCore.outputText( 'You grin at the satyr\'s encouragement and continue drinking, setting on a slower pace so you won\'t spill any more; shortly you pass him the empty skin and ask for more.' );
		EngineCore.outputText( '\n\nThe satyr, who has been happily matching you drink for drink, gladly takes the empty skin and passes you a new source of liquor; a glass bottle, this time.  "<i>This stuff is over thirty years old; trust me, there\'s nothing better.</i>"  In fact, he seems to decide he needs to prove his rhetoric, uncorking the bottle and taking a copious swig before passing it to you.' );
		EngineCore.outputText( '\n\nYou\'re only too happy to relieve him of his bottle and see just how good the \'stuff\' is. You take a swig and taste the satyr\'s saliva along with the delicious wine contained in the bottle; it truly is delicious! You don\'t bother offering him the bottle back\' you down the whole thing.  Before you even realize, your world is reduced to little more than drinking booze and eating the delicious food offered.' );
		EngineCore.outputText( '\n\nThe satyr eats and drinks right alongside you, exhorting you to just enjoy yourself.  Eventually, though, he stops eating and instead pulls out his pan pipes, starting to play a soft, gentle tune that almost reminds you of a lullaby.' );
		EngineCore.outputText( '\n\nYou can\'t resist the soft melody and begin to feel sleepy; you stop your drinking and eating to yawn... now that you\'ve stopped, you feel awfully hot.  You strip off your [armor] without a second thought, not even bothering to protect your modesty.  Once you feel the cool air against your ' + CoC.player.skinFurScales() + ' you sigh and lay to relax for a nap.' );
		EngineCore.outputText( '\n\nThe satyr keeps playing, smiling.  The last thing you see before unconsciousness takes you is an eager light in strangely goat-like eyes...' );
		//[hymen check];
		if( CoC.player.hasVagina() ) {
			CoC.player.cuntChange( 25, true, true, false );
		} else {
			CoC.player.buttChange( 25, true, true, false );
		}
		EngineCore.outputText( '\n\nYou wake up you don\'t know how many hours later, head spinning in pain at the heavy drinking you did earlier.  Come to think of it... all the bottles and dishes of food seem to be gone.  The only thing left are puddles of warm cum all around you and on you.  You get up, dazed, only to feel a strange feeling inside your [vagOrAss]; you double over as pain explodes from your [vagOrAss] and gasp as a flood of semen dribbles from your used ' );
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'vagina' );
		} else {
			EngineCore.outputText( 'ass' );
		}
		EngineCore.outputText( '.  This must be the work of that satyr!  Mentally, you remind yourself to watch out for him next time.  You clean yourself up as best as you can and redress, then wobble your way towards your camp, trying to stifle the pain, in your head and elsewhere, along the way.' );
		//(8 hours lost) (PC is pregnant (either vagina or ass) with a satyr, slimefeed);
		this.satyrPreggo();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseFourHours );
	};
	//[=Leave=];
	SatyrScene.prototype.leavePartySatyr = function() {
		MainView.clearOutput();
		EngineCore.spriteSelect( 98 );
		EngineCore.outputText( 'You thank the satyr for his generosity, but you don\'t think you can handle this kind of booze, so you get up and start on your way back to your camp.' );
		EngineCore.outputText( '\n\nThere is a sudden loud, indignant bleat from behind you, and you hear something suddenly charging clumsily forward.  Though you only realize this when something slams into your back, knocking you to the ground.  When you roll around, you find the satyr standing over you, face contorted in fury.  "<i>Nobody leaves me until I\'m done with them!</i>" he roars, and attacks you again!\n\n' );
		var satyr = new Satyr();
		Combat.startCombat( satyr );
		//proc first attack;;
		satyr.satyrCharge();
		//(Initiate combat with frenzied satyr, on the first round PC suffers the effects of a satyr charge (some HP lost and stunned));
	};
	//[=Trick Him=];
	SatyrScene.prototype.trickZeSatyr = function() {
		MainView.clearOutput();
		EngineCore.spriteSelect( 98 );
		EngineCore.outputText( 'You come up with a plan and pretend to start drinking again; once you notice the satyr is distracted, you quickly spill most of your drink on the floor and return an empty skin to him.' );
		EngineCore.outputText( '\n\nHe blinks in surprise.  "<i>Finished already?  My, someone knows how to enjoy their liquor!</i>" he laughs.  Your companion promptly grabs another skin and passes it to you.  "<i>Drink up, drink up!  I can\'t remember the last time I had a good drinking match!</i>"  The caprine humanoid chortles with glee, already opening a very potent-smelling bottle of beer.' );
		EngineCore.outputText( '\n\nOnce again you pretend to drink, only to spill most of your drink on the floor; although this time you take care not to empty the skin too fast.' );
		EngineCore.outputText( '\n\nStartled at how quickly you manage to finish, the satyr quickly chugs down the entire bottle, visibly wobbling as the alcohol hits him.  He takes the empty skin and gives you a glass bottle, then starts drinking from a fresh skin.' );
		EngineCore.outputText( '\n\nYou repeat the process, until the satyr looks absolutely smashed, not to mention horny... his massive shaft stands erect, dribbling pre as he empties another bottle.' );
		EngineCore.outputText( '\n\nThe satyr lifts yet another skin to his lips, but ends up simply slopping it all over himself.  He belches, sways side to side, then finally topples over.  "<i>How... never lost a drinkin\' contest before...</i>" he slurs, eyes fluttering closed as the alcohol in his system renders him unconscious.' );
		EngineCore.outputText( '\n\nGuess there\'s a first time for everything... you throw the last skin of booze away and proceed to check on the snoring satyr; searching him, you manage to find a pouch filled with gems.  Since he tried to trick you, you might as well as get something in return, so you pocket the gems in the pouch and discard it.' );
		CoC.player.gems += 10 + Utils.rand( 10 );
		MainView.statsView.show();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[=Skip Foreplay=];
	SatyrScene.prototype.skipForeplay = function() {
		MainView.clearOutput();
		EngineCore.spriteSelect( 98 );
		EngineCore.outputText( 'You smirk and crawl towards the satyr, discarding the skin of alcohol and knocking over several dishes and bottle in your way.  Once you\'re close enough, you roughly grab at his massive shaft and begin stroking it.  "<i>We both know where this is headed...</i>" you whisper, "<i>so why not skip the foreplay?</i>"' );
		EngineCore.outputText( '\n\nThe satyr looks surprised, then grins.  "<i>Very well, if you insist...</i>" he purrs, reaching out to grab and push you to the ground, tearing roughly at your [armor] until you are naked.' );
		//Play appropriate willing sex scene//;
		EngineCore.doNext( this, this.willinglyBoneSatyr );
	};
	//Sex Scenes;
	//Loss Rape (Z);
	//If PC has a vagina, Satyrs will use that. If not, use ass instead.;
	SatyrScene.prototype.loseToSatyr = function() {
		MainView.clearOutput();
		EngineCore.spriteSelect( 98 );
		//[Lust loss;
		if( CoC.player.lust > 99 ) {
			EngineCore.outputText( 'You pant as you begin masturbating furiously, too horny to care about anything the grinning satyr before you has in mind.' );
		} else {
			EngineCore.outputText( 'You try to steady yourself, clutching your body in pain as the satyr grins at you.' );
		}
		EngineCore.outputText( '\n\nThe horned demihuman wastes no time on foreplay or savoring his victory, instead tramping triumphantly forward and pushing you over onto your back.  He squats down and roughly yanks off your [armor] until your crotch is bared.  Impatiently, he ' );
		if( CoC.player.isNaga() ) {
			EngineCore.outputText( 'pins down your serpentine body' );
		} else if( CoC.player.isBiped() ) {
			EngineCore.outputText( 'spreads your [legs]' );
		} else {
			EngineCore.outputText( 'pins you down' );
		}
		EngineCore.outputText( ' and reaches forward, probing for a vagina.  ' );
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'Upon finding one, he grins lustfully, his already impressively erect cock rising to full flag.' );
		} else {
			EngineCore.outputText( 'Finding you lacking that trait, he grunts disdainfully and probes roughly for an asshole, which he locates right between your buttcheeks where it belongs, then jerks himself with several strokes to help coax his masculinity to full erection.' );
		}
		EngineCore.outputText( 'He grabs your [ass] and roughly squeezes your cheeks, kneeling down while lifting you up so he can impale your [vagOrAss].' );
		EngineCore.outputText( '\n\nYou can only watch in lust and horror as his massive cock aligns with your hole.  Finally, with a grunt, he pushes forward and spears you mercilessly on his shaft' );
		if( (CoC.player.hasVagina() && CoC.player.vaginalCapacity() < CoC.monster.cockArea( 0 )) || (!CoC.player.hasVagina() && CoC.player.analCapacity() < CoC.monster.cockArea( 0 )) ) {
			EngineCore.outputText( ', not even bothered by the fact that his cock doesn\'t even fit inside you' );
		}
		EngineCore.outputText( '.' );
		//[cunt/buttchange];
		if( CoC.player.hasVagina() ) {
			CoC.player.cuntChange( CoC.monster.cockArea( 0 ), true, true, false );
		} else {
			CoC.player.buttChange( CoC.monster.cockArea( 0 ), true, true, false );
		}
		EngineCore.outputText( '\n\nYou scream in pain and pleasure from the satyr\'s rough entry, and struggle in a vain attempt to escape his imposing shaft.' );
		EngineCore.outputText( '\n\nThe beast-man merely shifts his grip from your [butt] to your shoulders, grunting lewdly as he starts to roughly piston himself in and out of your abused orifice; he doesn\'t care anything about you, only that he can empty his aching, needy balls into your belly.' );
		EngineCore.outputText( '\n\nYou moan in shame as you feel yourself growing ' );
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'wet ' );
		}
		if( CoC.player.gender === 3 ) {
			EngineCore.outputText( 'and ' );
		}
		if( CoC.player.hasCock() ) {
			EngineCore.outputText( 'hard ' );
		}
		if( CoC.player.gender === 0 ) {
			EngineCore.outputText( 'aroused ' );
		}
		EngineCore.outputText( 'from your rough fucking.  Beads of lubricant splatter about as his brutal thrusts rock you.  Each loud slap from his hips sends a wave of shock and pleasure quaking throughout your body, and you find yourself moaning each time.  The scent of sex grows so overpowering that it even manages to block the thick reek of alcohol emanating from your goat-like partner.' );
		EngineCore.outputText( '\n\nThe satyr\'s thrusts pick up the pace as he grows more excited at finally having a victim to fuck, his pumps cause his swollen nuts to slap meatily against your ass, rocking you in his strong, powerful arms.  He grunts and coughs in his throat; he\'s on the very verge of climax...' );
		EngineCore.outputText( '\n\nYou scream as your [vagOrAss] clenches, strangling the satyr\'s cock in a vice-like grip.' );
		if( CoC.player.hasCock() ) {
			EngineCore.outputText( '  [EachCock] throbs as it send strings of cum flying straight into the satyr\'s chest, painting it white.' );
		}
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( '  A veritable flood of girlcum escapes the small space between your vaginal walls and the satyr\'s massive shaft, covering his balls and legs with your female fluids.' );
		}
		EngineCore.outputText( '\n\nThe satyr barely notices your orgasm as his own climax finally hits, letting out a surprisingly bleat-like cry as he cums inside you, a torrent of thick, hot cum gushing into your body, flooding into your guts until the sheer quantity forces it into your ' );
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'womb' );
		} else {
			EngineCore.outputText( 'stomach' );
		}
		EngineCore.outputText( '; your belly begins to swell and bulge as he pumps liters of semen into you.' );
		EngineCore.outputText( '\n\nFinally, by the time you look like a pregnant woman in her second trimester, he gives out a few last grunts and stops.  Messily he pulls out of you with an audible slurping sound, his cum-slicked cock dangling limply.  The beast grabs a wineskin from his belt, chugs down several mouthfuls and then belches, scratching his chest before loping away without a care in the world.' );
		EngineCore.outputText( '\n\nOnce you recover from your brutal fucking, you ' );
		if( CoC.player.cor < 50 ) {
			EngineCore.outputText( 'shamefully ' );
		} else {
			EngineCore.outputText( 'shamelessly ' );
		}
		EngineCore.outputText( ' gather and re-dress in your garments and head back to camp, cum still dribbling from you as you go.' );
		//reduce lust, slimefeed, pregnatize me cap'n;
		CoC.player.slimeFeed();
		this.satyrPreggo();
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', 3 );
		if( CoC.player.cor < 50 ) {
			EngineCore.dynStats( 'cor', 1 );
		}
		Combat.cleanupAfterCombat();
	};
	//Victory Rapes;
	SatyrScene.prototype.defeatASatyr = function() {
		MainView.clearOutput();
		EngineCore.spriteSelect( 98 );
		//Lust Victory;
		if( CoC.monster.lust > 99 ) {
			EngineCore.outputText( 'The satyr collapses to its caprine knees, bleating in dismay as it paws frantically at its huge cock, oblivious to everything in its need to get off.  Already, pre-cum is fountaining from the goat-man\'s shaft, his jerking motions smearing the pungent sexual fluid across the crown.' );
		}
		//HP Victory;
		else {
			EngineCore.outputText( 'Beaten and dazed, the satyr collapses to its caprine knees, shaking his head in a futile attempt to recover himself from the brutal trouncing you\'ve just given him.  The combination of the blows and his previous drunken state mean he\'s quite incapable of getting back, however.' );
		}
		var butt = null;
		var faces = null;
		if( CoC.player.lust >= 33 && CoC.player.gender > 0 ) {
			EngineCore.outputText( '\n\nYou wonder if you should give the satyr some sort of payback for attempting to rape you... do you take advantage of the helpless goat-man?' );
			//[Male][Female][Leave];
			if( CoC.player.hasCock() && CoC.player.cockThatFits( CoC.monster.analCapacity() ) >= 0 ) {
				butt = this.malesTakeAdvantageOfSatyrs;
			} else if( CoC.player.hasCock() ) {
				EngineCore.outputText( '\n\nYou\'re too big to fuck his ass...' );
			}
			if( CoC.player.hasVagina() ) {
				faces = this.femaleTakesAdvantageOfSatyr;
			}
		}
		var bikiniTits = null;
		if( CoC.player.hasVagina() && CoC.player.biggestTitSize() >= 4 && CoC.player.armor === ArmorLib.LMARMOR ) {
			bikiniTits = CoC.player.armor.lustyMaidenPaizuri;
		}
		EngineCore.choices( 'FuckHisButt', this, butt, 'Ride Face', this, faces, 'B.Titfuck', CoC.player.armor, bikiniTits, '', null, null, 'Leave', null, Combat.cleanupAfterCombat );
	};
	//Female (Z);
	SatyrScene.prototype.femaleTakesAdvantageOfSatyr = function() {
		MainView.clearOutput();
		EngineCore.spriteSelect( 98 );
		EngineCore.outputText( 'You eye his massive shaft speculatively, then decide against it.  Why should he receive the true pleasures of your cunt when he attacked you so rudely?  No, if there will be anyone taking pleasure from this, it will be you alone.  With that in mind, you cast aside your [armor] in the most imperious manner you can muster, until you are standing stark naked.' );
		EngineCore.outputText( '\n\nThe satyr bleats as his eyes widen in expectation, setting his gaze squarely on your [vagina]; he starts panting as his massive cock grows even harder, hoping for the release that he was denied.' );
		EngineCore.outputText( '\n\nYou saunter forward and topple him over onto his back.  He lets out a noise like a goat that\'s been struck, even as you move to pin him to the ground, swivelling your hips until you are practically sitting on his face with your [vagina] over his mouth.  You grind your crotch into his face and demand he lick you, taking hold of the copious hair around his privates and pulling to suggest what refusal may mean.' );
		EngineCore.outputText( '\n\nToo horny to fight back or protest, the satyr wastes no time in burying his face into you, licking and kissing your netherlips, nipping at your [clit]' );
		if( CoC.player.hasCock() ) {
			EngineCore.outputText( ', even going as far as to deliver a tongue-stroke or two to ' );
			if( CoC.player.balls > 0 ) {
				EngineCore.outputText( 'your [sack]' );
			} else {
				EngineCore.outputText( 'the base of your ' + Descriptors.multiCockDescriptLight() );
			}
		}
		EngineCore.outputText( '; despite your earlier hint about how disobedience might be dealt with, the satyr bucks and thrusts against your hands, hoping to achieve release by any means available.  You scowl and grab hold of his shaft, slimy with pre-cum already, and squeeze it tightly to warn him to stay still and focus on licking you, gripping his head with your thighs in an effort to hold him in place.' );
		EngineCore.outputText( '\n\nThe satyr bleats in pain, but rather than staying still he ups the pace of his thrusting; his pre coated dick slides easily through your tight grasp and the more you squeeze on his lust-inflated shaft, the quicker he bucks, with not a care for the pain you\'re inflicting to his sensitive tool.  His attention to your [vagina] never wavers either; he licks and sucks at your pussy, eager to have more of your sweet juices, rubbing his face against your moist nethers with the savage thirst of a wild animal.  Any semblance of intelligence has long since been wiped clean of the bucking and slurping mess under you; all the satyr can do now is bleat in pain and pleasure as you tighten your grip on his manhood and slurp at your juices until he drowns.' );
		EngineCore.outputText( '\n\nYou quiver and gyrate as his tongue slurps and licks its lewd way into your most intimate of places, sending delicious waves of pleasure shuddering and rippling through you.  Deciding to \'encourage\' him to work harder, you tighten the grip of your [legs] and begin to stroke his shaft, dragging your clenched hands up and down in a rough handjob for the satyr\'s oversized male tool.' );
		EngineCore.outputText( '\n\nThe satyr\'s muffled bleat of pleasure is all the warning that you get, as his massive prick throbs powerfully enough to break your grasp on its slimy length.  You can see it enlarging, as the little cum-slit at the tip opens up into a \'O\' shape and fountains cum several feet over you head.  Several gobs of smelly, hot goat-cum rain down upon the both you as the satyr ejects gallons of pent-up jism into the air, no doubt catching the attention of any passers-by that might be around.' );
		EngineCore.outputText( '\n\nThe unexpected rain is so gross, and yet so hot, that you find your own orgasm rapidly following.  With a buck and a gasp and a moan, you grind your sopping wet gash squarely into the goat-man\'s mouth, painting his face as you cum all over it' );
		if( CoC.player.hasCock() ) {
			EngineCore.outputText( ', your own cock belching its usual load across his stomach and the surroundings' );
		}
		EngineCore.outputText( '.' );
		EngineCore.outputText( '\n\nAfter a few minutes, the perverted fountain of goat-spunk is reduce to nothing but a trickle; yet the satyr\'s cock is still hard as a rock, throbbing and spurting longs strings of leftover cum over its slimy length.  The satyr himself goes limp; he seems to have passed out sometime during his explosive orgasm.' );
		EngineCore.outputText( '\n\nYou grind your pussy into his face one last time, then, with regal delicacy, you remove yourself from the unconscious, sex-splattered satyr.  Picking up your clothes, you redress yourself.  Once you\'re decent, you leave the unconscious goatman as prey for whatever creature comes to investigate the stink of cum spattered about in such copious quantities.' );
		//reduce lust;
		CoC.player.orgasm();
		Combat.cleanupAfterCombat();
	};
	//Male (Z);
	SatyrScene.prototype.malesTakeAdvantageOfSatyrs = function() {
		MainView.clearOutput();
		EngineCore.spriteSelect( 98 );
		var x = CoC.player.cockThatFits( CoC.monster.analCapacity() );
		if( x < 0 ) {
			x = CoC.player.smallestCockIndex();
		}
		EngineCore.outputText( 'You examine your conquest, trying to decide how it is you should use him to find some sexual release.  For a better view, you stride over, push him to the ground, and roughly cup his face.  The satyr looks up to you in fear, struggling in your grasp as you better examine him; he is most definitely male; you can\'t ignore the goat-like lines on his cheeks, nor the small goatee that grows from his chin, and his nose flares as he breathes and he bleats weakly while you pull his face this way and that way.  Finally, the satyr manages to yank his face out of your hands and lie prone on the floor, still gauging your movements.' );
		EngineCore.outputText( '\n\nYou decide that you don\'t want to fuck his mouth, at least not this time, and promptly flip the startled satyr over onto his back.  He bleats again in panic, and you silence him with a swift, cracking slap on the ass.  Ah, yes, his ass... it jiggles and ripples far more than it should of any male.  You grope it and examine it in further detail; it\'s plump and rounded, kinda soft - you might say cushiony.  Spreading his cheeks apart, you see a rather loose hole winking at you even as the satyr renews his struggles to get away from your grasp; seems like this goatman is no stranger to being on the receiving end of anal sex...' );
		EngineCore.outputText( '\n\nYour [cock] bulges and swells in your crotch and you nod your head approvingly, licking your lips in anticipation.  Yes, this will do nicely.  Wasting no time in pulling down your pants to let your rapidly-stiffening prick out into the world, you wonder if you should lube it first before you shove it in... the satyr struggles with renewed vigor as soon as you expose yourself, trying to kick you off, bleating and crying like a trapped goat.' );
		EngineCore.outputText( '\n\nYou ignore his efforts and do your best to brutally pin him to the ground, reaching around to take hold of his girthy prick... hah!  The monster\'s cock is already oozing pre-cum, no matter how much he struggles.  You roughly pump your hand up and down the satyr\'s shaft, gathering a great handful of his pre and then smearing it onto your own cock as makeshift lube.  Not very effective, but you guess it will suffice.  You take a second handful, and then a third, which you instead massage into the satyr\'s black rosebud - the ease with which two, then three of your fingers slide inside him confirms he\'s not a virgin when it comes to this particular act.' );
		EngineCore.outputText( '\n\nThe moment your fingers slide inside the helpless satyr he bleats, not in horror, but in delight.  His insistent struggles to get away from you make a complete U-turn, and instead he struggles to get more of your hand inside his gripping hole; his cock throbs and grows even harder, spurting pre on the ground below, as his balls churn and slosh eager for the prostate massage you\'ll be giving him with your own ' + Descriptors.cockDescript( x ) + '.  You can\'t help but laugh at the satyr\'s change of heart; what a slut.' );
		EngineCore.outputText( '\n\nWell, you know what to do with buttsluts who are in the mood, now don\'t you?  You whisper as much to the satyr, who lets out a soft bleat of anticipation, then take hold of his horns for extra leverage and, without further ado, shove your cock as far as you can into him.  The satyr emits a screaming bleat of pleasure and immediately begins to push his ass against you, humping you with a ferociousness you could only attribute to a wild animal.  His hands stop supporting his upper body, and immediately travel to his rock hard erection, milking it.' );
		EngineCore.outputText( '\n\nYou groan in surprise at the satyr\'s enthusiasm, but you\'re the one in charge here, and you feel like you should make that clear to the horny goat-man.  You slap his ass, drawing a sharp bleat from the humping satyr, yet he doesn\'t seem to stop; all he does is impale himself on you with even more vigor, using you like a dildo to achieve his desired release.  You\'d almost be offended, but the truth is you don\'t care; his ass is milking you like an expert milkmaid, his warm, slick inner walls rippling with practiced ease around your shaft.  You spank him, the retort echoing across the grass around you, and jeer him as the pathetically horny little buttslut he is.' );
		EngineCore.outputText( '\n\nEvery time you enter his stretched hole and rub at his prostate, his cock emits a jet of pre which soon begins pooling on the sod; the process repeats itself over and over until, with a screaming bleat, the satyr cums.  His balls bulge out, seemingly inflating within seconds, then churn as he begins spilling his load in one continuous jet of smelly goat seed; it doesn\'t take long until the puddle overflowing its little basin and begins expanding outward, until the satyr is rubbing his face against the semen mud of his own making.  His ass goes on overdrive, sucking you in with rippling muscles, trying to draw your fertile seed inside to paint his guts.' );
		EngineCore.outputText( '\n\nYou groan deep and low, and then let loose your own orgasm into his waiting bowels.' );
		//Low Cum Amount;
		if( CoC.player.cumQ() < 250 ) {
			EngineCore.outputText( '  He tries to milk you for far more than you can give him, and at one point you feel like his anal muscles are going to tear your dick off, until finally they go lax and lets you slip out.' );
		}//(Medium Cum Amount);
		else if( CoC.player.cumQ() < 1000 ) {
			EngineCore.outputText( '  You dump far more than you usually do; the satyr\'s clenching asshole makes sure to drain you of every little drop of cum you have until finally it goes lax and lets you slip out, leaving the goat-man with a pudgy belly.' );
		}//(High Cum Amount);
		else {
			EngineCore.outputText( '  You shoot jet after jet of cum, far faster than the satyr\'s ass can milk you for it, and still he doesn\'t seem to stop trying.  His rippling muscles draw your cum inside his bowels in big bubbles.  When his ass finally goes lax, you\'re propelled halfway out of him by the force of your own backflowing seed; the satyr\'s ass looks like a wreck, and his belly is overflowing with so much spunk you\'re surprised it didn\'t come out of his mouth.' );
		}

		EngineCore.outputText( '\n\nSated for the moment, your gaze drifts towards the satyr.  He makes no sound; indeed, when you take a better look at him, you realize he\'s fallen asleep, still idly shaking his ass back and forth and jerking his cum-dribbling cock.  You don\'t even spare him a contemptuous look as you pull your bottoms up and head back.' );
		//reduce lust;
		CoC.player.orgasm();
		Combat.cleanupAfterCombat();
	};

	//Willing Sex (Z);
	//from skip foreplay;
	//always impregnates PC;
	SatyrScene.prototype.willinglyBoneSatyr = function() {
		MainView.clearOutput();
		EngineCore.spriteSelect( 98 );
		EngineCore.outputText( 'The satyr eyes you up and down hungrily; his hands move to grope your [chest], gently tweaking your [nipples], then he moves down towards your ' );
		if( CoC.player.hasCock() ) {
			EngineCore.outputText( 'hardening maleness, giving it a few strokes to bring it to full mast, then he moves on to your ' );
		}
		if( CoC.player.balls > 0 ) {
			EngineCore.outputText( '[balls], rolling each of your orbs around with reverence at the life-giving load they produce; finally he addresses your ' );
		}
		//((if PC has a pussy);
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( '[vagina], spreading your labia wide to see the interior of your rapidly moistening walls.' );
		} else {
			EngineCore.outputText( '[ass], spreading your cheeks apart to gaze at your winking rosebud.' );
		}

		EngineCore.outputText( '"<i>Wonderful!  With a [vagOrAss] like this I\'m sure you\'ll make a great ' + CoC.player.mf( 'father', 'mother' ) + ' for our children,</i>" he says, leaning closer to sniff at your ' );
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( '[vagina], licking all over your netherlips and tasting your juices.' );
		} else {
			EngineCore.outputText( '[butt], licking all around your hole to prepare it for what\'s coming.' );
		}

		EngineCore.outputText( '\n\nHe bleats and exclaims, "<i>You drive me crazy!  I have a half-mind to fill you up and knock you up right now... but I want you to remember me, so let\'s make this special.  What do you say?</i>"' );
		EngineCore.outputText( '\n\nYou moan softly, telling him that sounds great, thinking to yourself how rare it is to find someone in these lands who\'s actually willing to ask your opinion on sex instead of just forcing you to do it the way they want.  The satyr smiles at your agreement and gently takes his cock in his hands, stroking and milking it for pre to help his entrance.  It doesn\'t take long; excited by the imminent pounding he\'s about to deliver you, his slit drizzles like a leaky tap.' );
		EngineCore.outputText( '\n\nHe takes hold of your hips and aligns his massive meat with your [vagOrAss]; then with a bleat he pushes in agonizingly slowly.  He slips a few inches in, then waits as his cock throbs, painting your [vagOrAss] walls with a slick dose of pre, then pulls out a couple inches and pushes more inches in. This process is repeated over and over, until finally he\'s hilted deep inside you.' );
		//(cunt/buttchange);
		if( CoC.player.hasVagina() ) {
			CoC.player.cuntChange( 25, true, true, false );
		} else {
			CoC.player.buttChange( 25, true, true, false );
		}

		EngineCore.outputText( '\n\nYou cry out as his massive manhood fills you, wrapping your [legs] around your caprine lover and pulling yourself fiercely against him, imploring him to hold you tight and fuck you senseless.  The satyr begins trembling and bucking lightly against you, slapping his balls on your [butt] softly with each small thrust.  Yet he resists letting his lust dominate him and smiles at you.  "<i>I said I want you to remember me... and no matter how much I want to unload into you right now, this is exactly what I\'m going to do.</i>"' );
		EngineCore.outputText( '\n\nIn a swift move he rolls you on top of him, changing places with you in an instant, leaving you sitting on his softly bucking, erect, massive flagpole.  With a groan that quickly turns into a bleat he gathers his strength and thrusts up into you; the force of the impact is enough to make the resulting slap echo, followed shortly by a second, his balls hitting your butt like a paddle.  The satyr\'s great thrust is enough to lift you off his mast all the way to the tip, and all you have to do is wait for gravity to bring you back down into his impaling shaft with an equally loud slap.  "<i>Just relax and let me take care of everything,</i>" the satyr pants, winding up for the next thrust.' );
		EngineCore.outputText( '\n\nYou grasp and claw at your caprine lover, eagerly slamming your hips into his, revelling at the feeling of being stretched so deliciously full, marvelling at the meaty smacking of flesh on flesh.  Babbling madly, you try to convey how good he is making you feel and how much you want him. Spurred on, the satyr begins not only to send you away with increasingly faster bucks, but to receive you on your way down with equally powerful thrusts. You writhe against him, clawing wildly at his back in your ecstasy, reaching up and grabbing one of his horns to yank his head up into a carnal, tongue-tangling kiss.' );
		EngineCore.outputText( '\n\nThe satyr breaks the kiss and bleats loudly, slamming his hips against you, forcing his huge cock to dig in as deep as it can before unloading all his seed into your ' );
		if( !CoC.player.hasVagina() ) {
			EngineCore.outputText( 'clenching butt' );
		} else {
			EngineCore.outputText( 'spasming vagina' );
		}
		EngineCore.outputText( '.  It\'s like someone shoved a hose into you and opened the nozzle, filling you with an endless stream of hot spooge; you can feel it pooling inside you, inflating your belly with his gigantic load.' );
		EngineCore.outputText( '\n\nYou cry out, howling your joy as his hot masculinity fills you with his potent seed, and then shudder as orgasm rocks through your body in turn;  your own ' );
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'pussy gushes fluids down his massive manhood' );
		}
		if( CoC.player.gender === 3 ) {
			EngineCore.outputText( ' and ' );
		}
		if( CoC.player.hasCock() ) {
			EngineCore.outputText( 'cock spurts cream across your intertwined forms' );
		}
		EngineCore.outputText( '.  Moaning softly and heaving in great lungfuls of breath, you sink back down onto him, feeling well and truly sated.' );
		EngineCore.outputText( '\n\nThe satyr\'s load has reduced to a trickle, but he still tries to pump more of it inside your ' );
		if( !CoC.player.hasVagina() ) {
			EngineCore.outputText( 'bowels' );
		} else {
			EngineCore.outputText( 'womb' );
		}
		EngineCore.outputText( '; making slow, short thrusts to ensure you\'ve got all the seed that you need.  Panting, he grins at you from his prone position.  "<i>Tell me then... did you like it?  Think that was enough baby batter to put a little satyr inside you?  Because if not I can go again.</i>"  He grins confidently.' );
		//(if male/genderless and 0 satyr children);
		if( !CoC.player.hasVagina() && CoC.flags[ kFLAGS.SATYR_KIDS ] === 0 ) {
			EngineCore.outputText( '\n\nYou stare at him blankly, then, as coherent thought returns to you, you ask how he can knock you up when you don\'t have a womb.' );
			EngineCore.outputText( '\n\nHe winks at your disquieted expression.  "<i>Satyr seed is so potent that we can impregnate anything, even ' );
			if( CoC.player.hasCock() ) {
				EngineCore.outputText( 'males' );
			} else {
				EngineCore.outputText( 'neuters' );
			}
			EngineCore.outputText( ' like you, lover.</i>"' );
			EngineCore.outputText( '\n\nYou stare at your partner, then place a hand on your stomach in disbelief. You\'re going to have a baby?  Without even being female?  Shivering, you wonder if maybe having sex with this satyr was worth it, in that case...' );
		}
		//(Medium Corruption);
		if( CoC.player.cor < 66 ) {
			EngineCore.outputText( '\n\nAs good as the invitation sounds, you just have to decline.  You think you got enough for a baby, and you think two little satyrs might be a bit above your capacity.' );
			EngineCore.outputText( '\n\nYour lover simply laughs.  "<i>Suit yourself.</i>"' );
		}
		//(High Corruption);
		else {
			EngineCore.outputText( '\n\nYou scratch your chin in thought and decide that you still need a bit more seed; reaching back, you give his balls a good squeeze, prompting a sick bleat from the satyr and a few more weak jets of jism from his overworked maleness.' );
			EngineCore.outputText( '\n\nHe rubs his stomach and laughs up at you.  "<i>That was mean... but I\'m happy to provide.</i>"' );
		}
		EngineCore.outputText( '\n\nWith a soft groan of effort from your tired muscles, you slowly pull yourself free of the satyr-cock impaling you, letting his pungent cum flow out of your abused hole and splatter all over him, then collapse a short distance away.' );
		EngineCore.outputText( '\n\nThe satyr gets up on unsteady hooves, visibly shaken after this session with you.  "<i>Well, sorry for not sticking around.  But I have places to get and people to fuck, so I guess we\'ll bump into each other some other time.</i>"  The goat-man gives your [butt] a friendly pat and begins packing away whatever leftovers he manages to find; then turns to blow you a kiss and dashes off.' );
		EngineCore.outputText( '\n\nYou watch him as he goes, then manage to force yourself back to your feet and stagger off, lest something far less hospitable find you here.' );
		//slimefeed, reduce lust, impregnational geographic;
		CoC.player.slimeFeed();
		CoC.player.orgasm();
		this.satyrPreggo();
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};

	//Pregnancy Stuff (Z);
	SatyrScene.prototype.satyrPreggo = function() {
		if( CoC.player.hasVagina() ) {
			CoC.player.knockUp( PregnancyStore.PREGNANCY_SATYR, PregnancyStore.INCUBATION_SATYR ); //Satyrs can now fertilize eggs for ovipositing players
		} else {
			CoC.player.buttKnockUp( PregnancyStore.PREGNANCY_SATYR, PregnancyStore.INCUBATION_SATYR, 1, 1 );
		}
	};
	//Birthing (Z);
	//Baby is always male.;
	SatyrScene.prototype.satyrBirth = function( vag ) {
		EngineCore.spriteSelect( 98 );
		EngineCore.outputText( '\nSudden sharp, intense pangs rip through your gut, seeming to emanate from your ' );
		if( vag && !CoC.player.hasVagina() ) {
			EngineCore.outputText( 'newly grown vagina' );
			CoC.player.createVagina();
		} else if( vag ) {
			EngineCore.outputText( '[vagina]' );
		} else {
			EngineCore.outputText( '[butt]' );
		}
		EngineCore.outputText( ', a gripping, writhing sensation as if something is thrashing around inside you and wants to get out.  Looks like it\'s time for whatever is inside you to emerge.' );
		EngineCore.outputText( '\n\nYou strip your [armor] and lay down, waiting for the incoming contractions, and sure enough they come.  Your body is wracked with intense pain as you push to get your newborn out; your muscles writhe and flex, anxious to fulfil their task and empty your distended belly of the new life grown within it.' );
		EngineCore.outputText( '\n\nIt doesn\'t take long until you see a small round head poking out of your ' );
		if( vag ) {
			EngineCore.outputText( '[vagina]' );
		} else {
			EngineCore.outputText( '[asshole]' );
		}
		EngineCore.outputText( '; it\'s adorned with a pair of miniscule horns.  You groan in pain as its shoulders stretch you even wider, but the worst part of it is over and, within moments, you are delivered of your child.  ' );
		if( vag ) {
			CoC.player.cuntChange( 40, true, false, true );
		} else {
			CoC.player.buttChange( 40, true, false, true );
		}
		EngineCore.outputText( 'Long minutes pass as your body recovers from the strain, bouncing back with unnatural vitality from the exhaustion and pain of giving birth, but finally you are ready to look at it.' );
		EngineCore.outputText( '\n\nIt looks like a cute little goat-man; the proof of such hangs between his legs, far larger than it should be on any infant.  He bleats at you meekly, and then begins to grow on his own!  His horns extend into curling, extravagant loops of bone, bending over his head; his soft flesh becomes tougher as his muscles develop, giving him a nice athletic build.  Finally his cock and balls grow to an impressive size, not only because of his natural - or unnatural - growth, but because it hardens with each passing moment; despite having been born only moments ago, your new son seems to be sexually aware.  Moments later he unbends and you get to take a good look at your newborn, and grown up, satyr.' );
		EngineCore.outputText( '\n\nHe strokes his small beard and gives you a wicked grin, thrusting his hips at you and spattering you with a few drops of pre-cum, then turns and bounds off.  Exhausted' );
		if( CoC.player.cor < 33 ) {
			EngineCore.outputText( ' and more than a bit disgusted' );
		}
		EngineCore.outputText( ', you slip into a short, fitful sleep.' );
		//badabingbadaboom;
		CoC.flags[ kFLAGS.SATYR_KIDS ]++;
	};
	SceneLib.registerScene( 'satyrScene', new SatyrScene() );
} );