﻿'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, MainView, Descriptors, CoC, kFLAGS, Utils, EngineCore ) {
	function Cinnabar() {
	}

	//Appearnace;
	Cinnabar.prototype.cinnabarAppearance = function( output ) {
		//Send back 0 for 'closed'.;
		if( CoC.time.hours < 15 || CoC.time.hours > 20 ) {
			return null;
		}
		if( output === undefined || output ) {
			//Not yet introduced;
			if( CoC.flags[ kFLAGS.CINNABAR_NUMBER_ENCOUNTERS ] === 0 ) {
				EngineCore.outputText( '\n\nThere\'s a generously proportioned woman lurking near a tavern.  Looking closer, you can see she has a ruby-red dress over her ruddy fur, and as she turns you make out an unmistakable, rat-like muzzle.', false );
			}
			//Appearance Repeat:;
			else {
				EngineCore.outputText( '\n\nCinnabar is on the prowl, looking for well-endowed johns to lie with.', false );
			}
		}
		return this.cinnabarGreeting;
	};
	//Approach ;
	Cinnabar.prototype.cinnabarGreeting = function() {
		EngineCore.outputText( '', true );
		EngineCore.spriteSelect( 91 );
		//1st Time:;
		if( CoC.flags[ kFLAGS.CINNABAR_NUMBER_ENCOUNTERS ] === 0 ) {
			CoC.flags[ kFLAGS.CINNABAR_NUMBER_ENCOUNTERS ]++;
			//(No cock) ;
			if( !CoC.player.hasCock() ) {
				EngineCore.outputText( 'You walk over towards the rat-morph, and as you near, she places her hands on her hips, sizing you up with her intense, blood-red eyes.  She licks her lips and sidles alongside you, caressing your body as she offers, "<i>50 gems for an hour.  That\'s all it takes to have Cinnabar be your companion...</i>"  Her voice trails off into a husky vibration as she awaits your response.\n\n', false );
				//[Buy an hour] [Leave];
				EngineCore.choices( 'Buy1Hour', this, this.cinnabarNonHugeDickings, '', null, null, '', null, null, '', null, null, 'Leave', SceneLib.bazaar, SceneLib.bazaar.enterTheBazaar );
			}
			//(Small Cock);
			else if( CoC.player.biggestCockArea() < 100 ) {
				EngineCore.outputText( 'You walk over towards the rat-morph, and as you near she places her hands on her hips, sizing you up with her intense, blood-red eyes.  She sidles up alongside you, caressing your body until she feels your bulge.  Her hand stops in place and licks her black, glossy lips,  giggling, "<i>I see you\'ve still got a little boy-cock, huh? Well, 50 gems will get you an hour of my time.  That\'s all it takes to have Cinnabar be your companion...</i>"  The slutty rat-girl\'s voice trails off into a husky vibration while she awaits your response.', false );
				//[Buy an hour] [Leave];
				EngineCore.choices( 'Buy1Hour', this, this.cinnabarNonHugeDickings, '', null, null, '', null, null, '', null, null, 'Leave', SceneLib.bazaar, SceneLib.bazaar.enterTheBazaar );
			}
			//(Big enough Cock) ;
			else {
				EngineCore.outputText( 'You walk over towards the rat-morph, and as you near she places her hands on her hips, sizing you up with her intense, blood-red eyes.  She sidles up alongside you, caressing your body and giving a happy hum as her fingers trace the huge, rounded bulk of your bulge. The slutty rat coos, "<i>Such a big... hot fuck-stick you\'ve got there.  You make me drip, ' + CoC.player.mf( 'stud', 'baby' ) + '.  Normally I\'d charge some gems, but fuck it – I want ', false );
				//Multicocks if the PC has 2 big enough;
				if( CoC.player.cockTotal() > 1 && CoC.player.biggestCockArea2() >= 75 ) {
					EngineCore.outputText( 'those things', false );
				} else {
					EngineCore.outputText( 'that thing', false );
				}
				EngineCore.outputText( ' inside me... the name\'s Cinnabar, but I\'d rather you plug me and call me whatever you want.</i>"  Her voice trails off into a husky, barely heard vibration as she awaits your response.', false );
				//[Fuck] [Leave];
				if( CoC.player.cockTotal() > 2 && CoC.player.biggestCockArea2() >= 75 ) {
					EngineCore.choices( 'Fuck Her', this, this.cinnabarGetsFUKKKKED, 'Multi-Fuck', this, this.cinnabarMultiCockPortalFuckFest, '', null, null, '', null, null, 'Leave', SceneLib.bazaar, SceneLib.bazaar.enterTheBazaar );
				} else {
					EngineCore.choices( 'Fuck Her', this, this.cinnabarGetsFUKKKKED, '', null, null, '', null, null, '', null, null, 'Leave', SceneLib.bazaar, SceneLib.bazaar.enterTheBazaar );
				}
			}
		}
		//Not first time;
		else {
			//(No cock) ;
			if( !CoC.player.hasCock() ) {
				EngineCore.outputText( 'You walk over towards Cinnabar, and as you near, she places her hands on her hips, sizing you up with her intense, blood-red eyes.  She licks her lips and sidles alongside you, caressing your body as she offers, "<i>50 gems for an hour.  That\'s all it takes to have a companion...</i>"  Her voice trails off into a husky vibration as she awaits your response.\n\n', false );
				//[Buy an hour] [Leave];
				EngineCore.choices( 'Buy1Hour', this, this.cinnabarNonHugeDickings, '', null, null, '', null, null, '', null, null, 'Leave', SceneLib.bazaar, SceneLib.bazaar.enterTheBazaar );
			}
			//(Small Cock);
			else if( CoC.player.biggestCockArea() < 100 ) {
				EngineCore.outputText( 'You walk over towards Cinnabar, and as you near, she places her hands on her hips, sizing you up with her intense, blood-red eyes.  She sidles up alongside you, caressing your body until she feels your bulge.  Her hand stops in place and licks her black, glossy lips,  giggling, "<i>I see you\'ve still got a little boy, huh? Well, 50 gems will get you an hour of my time.  That\'s all it takes to have a VERY skilled companion...</i>"  The slutty rat-girl\'s voice trails off into a husky vibration while she awaits your response.', false );
				//[Buy an hour] [Leave];
				EngineCore.choices( 'Buy1Hour', this, this.cinnabarNonHugeDickings, '', null, null, '', null, null, '', null, null, 'Leave', SceneLib.bazaar, SceneLib.bazaar.enterTheBazaar );
			}
			//(Big enough Cock) ;
			else {
				EngineCore.outputText( 'You walk over towards the rat-morph, and as you near she places her hands on her hips, sizing you up with her intense, blood-red eyes.  She sidles up alongside you, caressing your body and giving a happy hum as her fingers trace the huge, rounded bulk of your bulge. The slutty rat coos, "<i>Such a big... hot fuck-stick you\'ve got there.  You make me drip, ' + CoC.player.mf( 'stud', 'baby' ) + '.  Normally I\'d charge some gems, but fuck it – I want ', false );
				//Multicocks if the PC has 2 big enough && at least 3 total;
				if( CoC.player.cockTotal() > 2 && CoC.player.biggestCockArea2() >= 75 ) {
					EngineCore.outputText( 'those things', false );
				} else {
					EngineCore.outputText( 'that thing', false );
				}
				EngineCore.outputText( ' inside me... We could sit here and talk, but I\'d rather you plug me and call me your slut.</i>"  Her voice trails off into a husky, barely heard vibration as she awaits your response.', false );
				//[Fuck] [Leave];
				if( CoC.player.cockTotal() > 2 && CoC.player.biggestCockArea2() >= 75 ) {
					EngineCore.choices( 'Fuck Her', this, this.cinnabarGetsFUKKKKED, 'Multi-Fuck', this, this.cinnabarMultiCockPortalFuckFest, '', null, null, '', null, null, 'Leave', SceneLib.bazaar, SceneLib.bazaar.enterTheBazaar );
				} else {
					EngineCore.choices( 'Fuck Her', this, this.cinnabarGetsFUKKKKED, '', null, null, '', null, null, '', null, null, 'Leave', SceneLib.bazaar, SceneLib.bazaar.enterTheBazaar );
				}
			}
		}
	};

	//[Buy an Hour];
	Cinnabar.prototype.cinnabarNonHugeDickings = function() {
		CoC.flags[ kFLAGS.CINNABAR_HOUSE_VISITED ]++;
		CoC.flags[ kFLAGS.CINNABAR_NUMBER_TIMES_FUCKED ]++;
		CoC.flags[ kFLAGS.CINNABAR_FUCKED_CORRUPT_PREVIOUSLY ] = 0;
		EngineCore.outputText( '', true );
		EngineCore.spriteSelect( 91 );
		//(Too poor);
		if( CoC.player.gems < 50 ) {
			EngineCore.outputText( '"<i>Ooooh... I\'m sorry, but you don\'t have the gems to hire a companion, babe.   You should get some practice spreading your thighs and earn a REAL living,</i>" Cinnabar teases.', false );
			EngineCore.doNext( SceneLib.bazaar, SceneLib.bazaar.enterTheBazaar );
			return;
		}
		//(Enough cash);
		CoC.player.gems -= 50;
		MainView.statsView.show();
		EngineCore.outputText( 'Once you give your assent, Cinnabar\'s paws dive into your ' + CoC.player.armorName + ', gliding over your ' + CoC.player.skinDesc + ' before re-emerging above your gem-pouch.  She deftly grabs her payment and snakes back through, tickling your belly with her soft, well-groomed fur.  You look at her, then yourself, then her again.  How the hell was she flexible enough to do that?  Cinnabar giggles and curls her tail around your ' + CoC.player.legs() + ', looping it like a long, flexible rope.  She hugs you and murmurs, "<i>Where will my ' + CoC.player.mf( 'master', 'mistress' ) + ' take ' + CoC.player.mf( 'his', 'her' ) + ' slutty, fuck-hungry companion?</i>"  Her tongue flicks your ear like a snake tasting its prey, and though her attitude sounds submissive and weak, your horny \'companion\' is clearly hiding a fiery, aggressive streak.\n\n', false );
		EngineCore.outputText( 'Before you can make an answer, Cinnabar\'s hands are back inside your ' + CoC.player.armorName + ', tugging your ' + Descriptors.nippleDescript( 0 ) + ' towards an unmarked wagon that\'s clearly her home.  You smirk and rub her between her legs, feeling the moistness of her sloppy cunt through her now-dampened dress.  Before she can tease you any more, you hook a finger up, pushing her dress into her hungry snatch.  It\'s easy to lead the giggling rat-whore like this, and when you reach the door she slides her tail into the lock, clicking it open with ease.\n\n', false );
		EngineCore.outputText( 'With surprising strength, she drags you inside, kicking the door shut.   She hurredly strips, struggling a little with the tight dress, and you take the cue to disrobe as well.  You get done first, just in time to notice she\'s stopped with the wet patch on her nose.  She\'s sniffing and tweaking a nipple, masturbating herself as if she\'s completely forgotten about you.  A crimson eye peeks through the upraised dress-slit, and you realize she\'s imploring you to take advantage.\n\n', false );
		EngineCore.outputText( 'You give the whore what she wants and pull the sodden dress from her, tweaking her nipple hard.  She moans and pulls you into her bed, which groans from the sudden onslaught of added weight.  As you lie atop her prone, exposed body, you realize the walls around her bed are plastered with dozens of spherical mirrors, all reflecting the nude flesh of your entwined bodies.  Your slut-for-an-hour grabs you by the hair and kisses you hard, her velvety-soft lips raping your mouth and burning with the heat of her lust.  She pulls you back and moans, "<i>' + CoC.player.mf( 'Master', 'Mistress' ) + ' has chosen well.  Now please, pinch this slut\'s nipples while she puts on a show for you.</i>"\n\n', false );
		EngineCore.outputText( 'Obligingly, you grab both her black, puffy nipples and twist them.  Her heart hammers in her chest, pumping hard enough for you to feel it beat through her abused, puffed-up teats.  She twists her body, writhing out from under you while somehow keeping her nipples in your fingers the entire time.  With an annoyed squeeze, you turn the tender nubs harder, smiling when they yield under the pressure and begin to corkscrew.  Cinnabar groans lustily, now on all fours, and smears her dripping gash against the wall behind her, her tits swaying lewdly in your grasp.\n\n', false );
		EngineCore.outputText( 'Cinnabar coos happily, in spite of the pain, and she begs, "<i>Please ' + CoC.player.mf( 'master', 'mistress' ) + ', look at the mirrors.  Your slut is trying to be good, but she needs to be filled so badly.</i>"  You turn to look, but hold on to her tortured tits, just in case.  Amazingly, a pair of the mirrors have changed.  They no longer reflect your own image back – they show her gaping, girlcum-dripping gash and twitching, black-skinned anus.  You can even smell her feral musk and feel the heat pouring from her horny genitalia hitting you in a wave.\n\n', false );
		EngineCore.outputText( 'Too shocked to keep your grip, you listen dumbly as Cinnabar groans, "<i>' + CoC.player.mf( 'Master', 'Mistress' ) + ' is pleased?  This one knows how to use portals for their intended purpose.  Watch slut make more sexy portals.</i>"  True to her words, many of the other mirrors change, showing both sets of nipples', false );
		if( !CoC.player.hasVagina() ) {
			EngineCore.outputText( ' and your ' + Descriptors.assholeDescript(), false );
		} else {
			EngineCore.outputText( ', your ' + Descriptors.vaginaDescript() + ', and your ' + Descriptors.assholeDescript(), false );
		}
		EngineCore.outputText( ' just inches away.  Without any prompting, you reach through to touch her arousal engorged lips, slipping fingertips through the needy gash and marveling at how large it feels.  You push forward, burying one, two, three, and finally four fingers inside her hungry nethers.\n\n', false );
		EngineCore.outputText( 'Cinnabar pants, "<i>Ungh... more.  Stuff this whore\'s cunt,</i>" all while she wiggles her backside against the mirror, clearly enjoying the attention.  You pull back to tease her, but the horny whore groans and reaches through another portal to ', false );
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'grab your ' + Descriptors.clitDescript() + ', rolling it between her thumb-pads with a hair too much pressure', false );
		} else {
			EngineCore.outputText( 'slip two digits into your ' + Descriptors.assholeDescript() + ', pulling it apart far enough to cause you discomfort', false );
		}
		EngineCore.outputText( '.  She wants to be penetrated?  Fine.  You ball your fingers and push forward.  Amazingly, you push through a gossamer curtain of femcum and bury your whole hand inside her cunt with ease.  Her silky-smooth walls tremble and squeeze, caressing your hand like a long-lost lover.\n\n', false );
		EngineCore.outputText( 'Satisfied with your display of power, her fingers ', false );
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'release their squeeze', false );
		} else {
			EngineCore.outputText( 'release the butt-stretching pressure', false );
		}
		EngineCore.outputText( ' and settle to the business of sliding back and forth, caressing you from the inside out.', false );
		//Finger poke;
		if( CoC.player.hasVagina() ) {
			CoC.player.cuntChange( 8, true, true, false );
		} else {
			CoC.player.buttChange( 8, true, true, false );
		}
		if( CoC.player.hasCock() && !CoC.player.hasVagina() ) {
			EngineCore.outputText( '  Unbidden, ' + Descriptors.sMultiCockDesc() + ' begins to harden, stiffening with every brush against your prostate.', false );
		} else if( CoC.player.hasVagina() ) {
			EngineCore.outputText( '  Femcum begins to soak the rat\'s practiced fingers, drenching her finger-pads with liquid lust.', false );
		}
		EngineCore.outputText( '  You rock back, slamming your ' + Descriptors.buttDescript() + ' against the wall and moaning with need.  She\'s quite skilled, and ', false );
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'caresses your passage in ways that ', false );
		} else {
			EngineCore.outputText( 'works your body in ways that ', false );
		}
		EngineCore.outputText( 'leave you panting like a bitch in heat.  She urges you on, practically begging, "<i>Yes!  Stuff my hole!  Fist me, ' + CoC.player.mf( 'master', 'mistress' ) + '; stretch me with your hand until I\'m too loose for a minotaur!  Please... please... fist my ass too.  Ruin my holes, ' + CoC.player.mf( 'master', 'mistress' ) + '!  Break fuck-toy\'s body!</i>"\n\n', false );
		EngineCore.outputText( 'You shrug and pull yourself up by the fist in her cunt, eliciting an agonized moan from your whore while you plunge your other hand into her clenching, squeezing asshole.  Her knees dig deep into the cushions, now supporting her own weight as well as yours, but the quickening pace of Cinnabar\'s ', false );
		if( CoC.player.vaginalCapacity() < 30 ) {
			EngineCore.outputText( 'fingers', false );
		} else {
			EngineCore.outputText( 'fingers - no, fist', false );
		}
		EngineCore.outputText( ' tells you just how much she likes it.  ', false );
		//CUNTZ;
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'She even works ', false );
			if( CoC.player.analCapacity() < 30 ) {
				EngineCore.outputText( 'her fingers', false );
			} else {
				EngineCore.outputText( 'her fist', false );
			}
			EngineCore.outputText( ' into your asshole, leaning on you in the same way and locking your bodies together through the portals.  ', false );
		}
		if( CoC.player.hasCock() && !CoC.player.hasVagina() ) {
			EngineCore.outputText( 'You gasp and moan when you feel her other hand wrap around your ' + Descriptors.cockDescript( 0 ) + ', pulling and tugging on it until it starts to leak a trail of squeezed-out man-slime on the mattress.  ', false );
		}
		EngineCore.outputText( 'Growing more and more aroused, hotter and hotter, you pick up the pace, pistoning your forearms in and out of Cinnabar\'s lewdly squelching holes.\n\n', false );
		EngineCore.outputText( 'She squeaks, the first rodent-like sound she\'s made all evening, and you take that as your cue to work her even more brutally, pounding her now-gaped holes with hard, fast strokes.  Each time it seems like she swallows more of your arm, and after a few particularly violent poundings, you\'ve sunk inside the rat up to the elbow.  From where you\'re kneeling, you can see her belly, and it isn\'t distended in the slightest.  Just how much can she handle?\n\n', false );
		EngineCore.outputText( 'You press on, brutalizing her pussy and asshole simultaneously.  Each time you pull your fist back, the flesh is hanging limply around it, stretched so wide she barely notices it, but then you\'re back inside her, stuffing her with your bicep and rubbing her cervix.  Nearby, you spot a mirror that gives you the perfect view of her clit, and with one inspired movement, you lean low enough to give it a lick.  The smooth, hard flesh of her nub slides into your lips as you tongue at it, growing with Cinnabar\'s rapidly spiking passion.  She squeaks long and loud, dragging it into a moan while her violated pussy and gaped asshole pull tight around your arms, squeezing and milking them as if they were giant-sized cocks.\n\n', false );
		EngineCore.outputText( 'The rat\'s ', false );
		if( CoC.player.hasVagina() ) {
			if( CoC.player.vaginalCapacity() < 30 && CoC.player.analCapacity() < 30 ) {
				EngineCore.outputText( 'fingers', false );
			} else if( CoC.player.vaginalCapacity() >= 30 && CoC.player.analCapacity() >= 30 ) {
				EngineCore.outputText( 'fists', false );
			} else {
				EngineCore.outputText( 'fingers and fist', false );
			}
		} else {
			if( CoC.player.analCapacity() < 30 ) {
				EngineCore.outputText( 'fingers', false );
			} else {
				EngineCore.outputText( 'tightly-clenched fingers', false );
			}
		}
		EngineCore.outputText( ' plunge further inside you, violating you far more gently, but still hard enough to get you off.', false );
		if( CoC.player.hasCock() && !CoC.player.hasVagina() ) {
			EngineCore.outputText( '  Her soft pads grip your ' + Descriptors.cockDescript( 0 ) + ' tightly while she  presses on your prostate, milking your cum from you with professional skill.  Rather than coming in its usual spurts, it drips in a long, liquid chain of white-goo that drops into a submissive puddle on the bed.', false );
			if( CoC.player.cumQ() >= 250 ) {
				EngineCore.outputText( '  Not content with that, your body keeps going, thickening the stream into a torrent that soaks the sheets', false );
				if( CoC.player.cumQ() >= 1000 ) {
					EngineCore.outputText( ' and puddles on the floor', false );
				}
				EngineCore.outputText( '.', false );
			}
		}
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( '  She licks your ' + Descriptors.clitDescript() + ', and your ' + Descriptors.vaginaDescript( 0 ) + ' convulses around the intruding digits, making you shiver and moan.  Not wanting to be left out, your ' + Descriptors.assholeDescript() + ' clamps and puckers with it, wringing the rat\'s ', false );
			if( CoC.player.vaginalCapacity() < 30 ) {
				EngineCore.outputText( 'fingers', false );
			} else {
				EngineCore.outputText( 'hand', false );
			}
			EngineCore.outputText( ' in its hungry embrace.', false );
		}
		//(No dick/cunt:;
		if( CoC.player.gender === 0 ) {
			EngineCore.outputText( '  Her soft pads rub your ' + Descriptors.assholeDescript() + ' just right, setting off your climax with professional skill.  You grunt and squeeze, wringing her fingers inside your hungry hole as if you could milk cum from them.', false );
		}
		EngineCore.outputText( '  The orgasm is intense, and as you both succumb to exhaustion, two sets of limbs slip from abused orifices.  Cinnabar and you fall into each other, collapsing in a puddle of sexual juices and sweaty limbs.', false );
		if( CoC.player.wetness() < 3 ) {
		} else if( CoC.player.wetness() < 5 ) {
			EngineCore.outputText( '  Her arm seems quite soaked with your leavings.', false );
		} else {
			EngineCore.outputText( '  Her arm and chest are left splattered from your explosive, squirting orgasm.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'Cinnabar rolls over to give you a kiss on the cheek once she\'s recovered.  Her voice is still rough from the volume of her pleasure-squeaks, but she manages to whisper, "<i>That was nice for someone who didn\'t have a cock worth fucking.  Feel free to catch your breath, but I\'m a working girl so don\'t take too long.  I\'ve got to get the sheets cleaned', false );
		if( CoC.player.cumQ() >= 1000 ) {
			EngineCore.outputText( ' and the floor mopped', false );
		}
		EngineCore.outputText( ' before I can get my next customer.</i>"\n\n', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -2 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[FUCK] – tracks if last fuck was huger + corrupteded version;
	Cinnabar.prototype.cinnabarGetsFUKKKKED = function() {
		CoC.flags[ kFLAGS.CINNABAR_HOUSE_VISITED ]++;
		CoC.flags[ kFLAGS.CINNABAR_NUMBER_TIMES_FUCKED ]++;
		CoC.flags[ kFLAGS.CINNABAR_FUCKED_CORRUPT_PREVIOUSLY ] = 0;
		EngineCore.outputText( '', true );
		var x = CoC.player.biggestCockIndex();
		EngineCore.spriteSelect( 91 );
		EngineCore.outputText( 'As soon as you give your assent, Cinnabar\'s hands are flying through your ' + CoC.player.armorName + ' to clutch and grab at your ' + Descriptors.cockDescript( x ) + ', squeezing the hefty member with her soft pads.  She coos happily, grinning wide enough to expose her teeth while your dick fills up in her palm, gradually spreading her fingers wide.  The turgid, burgeoning mass rubs against your ' + CoC.player.armorName + ' near-painfully before she stops, and Cinnabar licks her lips appreciatively, knowing you\'re not even the whole way hard.\n\n', false );
		EngineCore.outputText( 'Though your ' + CoC.player.legs() + ' have grown wobbly and your gear tight, you stand up, straight as a fencepost, and pull the slut\'s arms away from your kit.  Cinnabar grunts with displeasure, but you grab her dress and spin her into your arms, letting your bulge dig into her back while your hands cup the heavy swells of her breasts.  Her nipples are hard and ready, easily as large as the tips of your fingers, which you waste no time in securing around the swollen buds. The skank\'s displeased grunt morphs into a loud squeak, then trails off into a low, eager moan.\n\n', false );
		EngineCore.outputText( '"<i>Please, bend me over and fuck me; stuff that fat cock in my juicy cunt.  Stuff me, rut me, bang me here in front of everyone!', false );
		if( CoC.flags[ kFLAGS.CINNABAR_FUCKED_CORRUPT_PREVIOUSLY ] > 0 ) {
			EngineCore.outputText( '  Just be gentler than last time, okay ' + CoC.player.mf( 'stud', 'baby' ) + '?', false );
		}
		EngineCore.outputText( '</i>"  Cinnabar cries, but the stares your little encounter has attracted warn you that continuing in the open would be a very bad idea.  You pinch on one of Cinnabar\'s hard nips and bite her to shush her incessant yammering, but all it does it make her squeak even louder.  You growl into her ear, telling the horny cunt that if she wants your dick inside her, she had better be a good pet and find you some privacy.\n\n', false );
		EngineCore.outputText( 'The eager rodent spins, pulling her nipples from your fingers and planting a heavy, wet kiss on your lips hard enough to rock you back ', false );
		if( CoC.player.str >= 60 || CoC.player.tallness >= 72 ) {
			EngineCore.outputText( 'a little', false );
		} else {
			EngineCore.outputText( 'on your heels', false );
		}
		EngineCore.outputText( '.  You sway, woozy from the passionate lip-lock, and then you\'re being dragged through the crowd up to a brightly-painted wagon.  The thick door is clearly locked, but the ingenuous rat\'s tail lifts in front of your nose, wiggling like a snake-charmer\'s viper.  It brushes your cheek before plunging into the vacant keyhole with the enthusiasm of a mating stallion.  An audible *click* reveals just how fine Cinnabar\'s tail-control is, but as you ponder that, you\'re dragged through the door by soft, insistent tugs.\n\n', false );
		EngineCore.outputText( 'Flexible, determined fingertips are buried deep into your crotch before the entry has closed behind.  Cinnabar\'s eyes fixate on the massive, tenting bulge between your ' + CoC.player.legs() + ', her soft finger-pads shaking while they try to set you free.  You appreciate her efforts, but she nearly got you into some trouble out there.  She needs to settle down, or at least be a little more mindful of your wishes.  You yank her arms away from your bouncing, newly-freed ' + Descriptors.cockDescript( x ) + ', groaning from sensation while you wrestle to deny Cinnabar her desire.\n\n', false );
		EngineCore.outputText( 'The rat squirms and kicks, but you twist away from each vicious blow.  She growls, "<i>You\'ve got that fucking huge dick and you won\'t let me give it a hug?  Seriously, what are you, some cunt-shy freak?  I thought you\'d be a good fuck, but if you\'re this scared of a woman\'s pussy, maybe I should go find a ' + CoC.player.mf( 'real man', 'horse-herm' ) + ' to shack up with!</i>"  She\'s got a mouth on her, but she needs to be taken down a peg.  You sweep her legs out from under her and push, slamming her into the bed hard enough to make her tits quake from the impact.\n\n', false );
		EngineCore.outputText( 'Cinnabar smiles and spreads her legs, lifting the hem of her dress while a finger tweaks her clit.  She coos, "<i>Mmmmm, so dominant, but I\'m not sure you know how to use that beast.  Your cock is bouncing, fucking rock hard, and I\'ve got this wet, hot hole begging you plug it.  Yet you\'re standing there, watching me try to squirm out of this tight, sexy dress.</i>"  To emphasize her point, she releases a zipper and begins to undulate, shedding the dress like a snake discards old skin.  You climb into bed after her, smiling when you see the hundreds of mirrors that hang from the walls around you.\n\n', false );
		EngineCore.outputText( 'The rodent follows your gaze and wraps her arms around your neck.  She whispers, "<i>Does my big, hard ' + CoC.player.mf( 'stud', 'bitch' ) + ' want to fuck now?</i>"  You nod and rock forwards, pressing the turgid ' + CoC.player.cockHead( x ) + ' of your ' + Descriptors.cockDescript( x ) + ' against her dripping cunny, but while her lips give somewhat, you can\'t quite breach her slippery gateway.  Cinnabar grunts from the aborted penetration and pulls back with a cat\'s grace and a contortionist\'s flexibility, uncoiling from beneath you in one, liquid motion.  She kisses your nose, pressing her curvacious bottom back against the wall while her tail loops over her shoulder to tussle your hair.\n\n', false );
		EngineCore.outputText( '"<i>It\'s been a while since this horny slut has had a dick too big for her snatch, but we\'re going to make that fucker fit in me.  You\'re going to split me hard enough to make a ', false );
		if( CoC.player.cockArea( x ) < 200 ) {
			EngineCore.outputText( 'centaur mare wince', false );
		} else {
			EngineCore.outputText( 'a dragoness cry', false );
		}
		EngineCore.outputText( '!  Look at the mirrors; go on, look,</i>" she instructs.\n\n', false );
		EngineCore.outputText( 'Sure enough, when you look at the mirrors you get a surprise.  There, in all its glory, is Cinnabar\'s dripping, wet snatch.  Her lips are a ruddy-red near her thighs, but the closer they get to her slit, the blacker they become.  You note her vulva and labia are slightly parted, perhaps by your previous attempt at penetration, and her shining, black love-tunnel seems to almost beckon for your attentions.  "<i>Mmmm, look how wet I am for you, ' + CoC.player.mf( 'stud', 'slut' ) + '... I\'ve been such a bad girl – look at my puny pussy.  Why doesn\'t ' + CoC.player.mf( 'master', 'mistress' ) + ' punish it?</i>" she asks, pressing back hard enough to make her genitals bulge around the mirror\'s rim.\n\n', false );
		EngineCore.outputText( 'You smile and ball your hand into a fist, ', false );
		if( CoC.player.cor > 66 ) {
			EngineCore.outputText( 'enjoying the raunchiness of the act', false );
		} else if( CoC.player.cor > 33 ) {
			EngineCore.outputText( 'a little worried by how much you\'re enjoying this', false );
		} else {
			EngineCore.outputText( 'a little amazed that you would ever do such a thing', false );
		}
		EngineCore.outputText( ', then push it forwards, battering through the silky slit and into her canal.  Her juices let you slide right in, squirting and dribbling over her vulva like a fresh fruit you\'ve just bitten into.  You lean over to lick at clear, slimy droplets, feeling your arm sink deeper inside the velvet vice with each taste you get.  It\'s gone in up to the elbow, and Cinnabar is squeaking happily, without a hint of discomfort.\n\n', false );
		EngineCore.outputText( 'Her tunnel squeezes tight, massaging your forearm as if it was some massive beast\'s member, but you pull back, extricating your limb along with an accompanying gush of girl-cum.  Cinnabar groans, "<i>Ohhh baby, you were filling me up so good.  Look at what a mess I\'m making for you!  Oooh, are you gonna fuck me now?  You got me stretched, but I don\'t know if I\'m big enough... fuck it! Split me like a log, baby!</i>"\n\n', false );
		EngineCore.outputText( 'As if you needed any encouragement!  She flips around to present her ass to you, her tail looping around your ', false );
		if( CoC.player.balls > 0 ) {
			EngineCore.outputText( Descriptors.sackDescript() + ' and ', false );
		}
		EngineCore.outputText( Descriptors.cockDescript( x ) + ' before pulling tight.  You ignore the onslaught of pressure and line your fat prick up with her inviting, fist-gaped hole.  It still doesn\'t look like it\'ll fit, but you press forwards anyway – she wanted it inside her and you\'ve got way too much blood in your dick to do any logical thinking.\n\n', false );
		EngineCore.outputText( 'Your ' + CoC.player.cockHead( x ) + ' hits those plush, juice-gushing lips and forces them wide.  She\'s tight, so goddamned tight, but you\'ve only got the barest portion of your tip inside.  Cinnabar squeaks in pleasure and pain, rocking her ass up and down to try and loosen up her poor, abused entrance.\n\n', false );
		EngineCore.outputText( '"<i>Fucking cram that dick in there.  Can\'t you feel how hot I am?  Gods, it\'s so BIG... fuck me... just, fuck me!</i>" she cries.\n\n', false );
		EngineCore.outputText( 'Throughout her prompting you continue the onslaught, firmly moving your ' + Descriptors.hipDescript() + ' onward to push your ' + Descriptors.cockDescript( x ) + ' against the sloppy, cum-dripping hole.  Those black, puffy cunt-lips give one agonizing, convulsing tremble, and then they relax, stretched around the thickness of your shaft like a condom.  Her walls feel so much better on your fuck-stick than on your arm; the slippery walls contract involuntarily, the abused body\'s instincts trying their best to remove the intruder.\n\n', false );
		EngineCore.outputText( 'You slap her ass and watch it jiggle, grunting with pleasure when the ripples work their way from her reddened butt-cheek into her taut, brutalized cunt.  Cinnabar is watching you through one of her portals, mouth parted and eyes rolled partway back as she struggles to keep it together.  Somehow she manages to keep talking.  "<i>Ungh... I can feel it stretching me... stretching me so good.  Fuck... my – ung – hips... oh gods look how wide my hips are!  You\'re gonna gape me so fucking good!  I\'m gonna be your stretched out cock-sleeve, are you happy?  I\'m gonna – ooooohhh... look like your broken, fucked-out brood-rat.</i>"\n\n', false );
		EngineCore.outputText( 'It barely registers – you\'re too busy cramming inch after inch into the slowly-widening vice in front of you, enthralled by just how much cock-flesh her body can devour.  She\'s frothing at the mouth, screaming, squeaking, and pounding on the bed.  You push forward a little harder, tugging on the base of her tail for leverage as huge globs of rat-cum rain from the stretched-out snatch onto the sheets.   Another three inches sink into your new cock-sleeve, and she starts to whimper and squeak, reminding you of an old, worn-out chew-toy that your father\'s dog used to play with.', false );
		//HUger;
		if( CoC.player.cockArea( x ) >= 200 ) {
			if( CoC.player.cor >= 75 ) {
				EngineCore.doNext( this, this.fuckCinnabarHugerAndCorruptedEr );
			} else {
				EngineCore.doNext( this, this.cinnabarHuger );
			}
		} else {
			EngineCore.doNext( this, this.cinnabarHuge );
		}
	};
	//(Huger and Corrupteder) (75+ corr);
	Cinnabar.prototype.fuckCinnabarHugerAndCorruptedEr = function() {
		CoC.flags[ kFLAGS.CINNABAR_FUCKED_CORRUPT_PREVIOUSLY ] = 1;
		var x = CoC.player.biggestCockIndex();
		EngineCore.outputText( '', true );
		EngineCore.spriteSelect( 91 );
		EngineCore.outputText( 'You\'re almost there, so close to your orgasm, but this needy skank\'s pussy has barely tasted the largeness of your member.  She\'s wearing out your endurance with her tightness, and if you\'re going to split her wide, you\'ll need to pick up the pace.  You grab her thighs, ignoring her tail as it thrashes about, and heave, yanking her dick-dilated cunt along your length with enough force to lift her knees from the mattress.   Cinnabar actually screams from the brutal penetration, her legs spasming nervelessly while her hips are split wide, your fleshy spear absolutely and completely distorting her frail form.', false );
		if( CoC.flags[ kFLAGS.CINNABAR_FUCKED_CORRUPT_PREVIOUSLY ] > 0 ) {
			EngineCore.outputText( '  You\'re doing it again – turning her into a cum-sleeve without a care for her pleasure, but you don\'t fucking care.  You\'re too horny and she\'s too sexy not to abuse.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'That one push sent nearly two feet of cock into the violated vermin, and you don\'t intend to stop until you\'ve buried all ' + Utils.num2Text( Math.ceil( CoC.player.cocks[ x ].cockLength / 12 ) ) + ' turgid feet inside her.  Cinnabar feels so light in comparison to your ' + Descriptors.cockDescript( x ) + ', barely dragging it down at all.  You get a wicked idea and lean back, letting your iron-hard member shift with you, pulling the rust-red rat completely off the bed and into the air.  With nothing to grab on to and no way to reach the ground, her entire weight is supported entirely by the friction of her over-burdened walls, and with how juicy this bitch is, she\'s already sliding down, accelerating her gravity-fed violation with her unintentionally well-lubricated fuck-hole.\n\n', false );
		EngineCore.outputText( '"<i>T-too fast... ' + CoC.player.mf( 'Master', 'Mistress' ) + ', too fast!  Please go slower... please... ungghhAAAHHH... Godda-ah-aH-AH-AMNIT!</i>" she protests.\n\n', false );
		EngineCore.outputText( 'She probably should\'ve thought of the repercussions before she dragged you into the sack.  Cinnabar\'s hips are spread impossibly wide, her legs reduced to useless, vestigial limbs that a cum-sleeve like her won\'t need, and they get farther apart the further she\'s impaled upon you.  Even her ass-cheeks have adjusted to her new position; they\'ve spread so far apart that her clenching pucker will always be on display.  Maybe you can give it the same treatment once you\'ve finished destroying her gaped twat.\n\n', false );
		EngineCore.outputText( 'The rat – no, cum-sleeve – gets even tighter, and as you watch, her breasts bulge and jiggle, shifted from the rock-hard post that\'s pushing through her body.  They look almost tiny in compared to the cylindrical, veiny bulge, like cum-filled bubbles hanging from a moaning furry condom.  Impatient, you snag her ankles and give a hard tug, adding your strength to gravity\'s inexorable pull.  Warm, pulsating cunt-flesh hugs your ', false );
		if( !CoC.player.hasSheath() ) {
			EngineCore.outputText( 'crotch', false );
		} else {
			EngineCore.outputText( 'sheath', false );
		}
		EngineCore.outputText( ', squirting juices from the callous, cunt-piercing thrust.  The ' + CoC.player.cockHead( x ) + ' of your ' + Descriptors.cockDescript( x ) + ' can be seen just below her neck', false );
		if( CoC.player.cocks[ x ].cockLength >= 60 ) {
			EngineCore.outputText( ', and only now do you realize that you\'re long enough that you should\'ve gone the whole way through her.  Just what kinds of magics is she capable of!?', false );
		} else {
			EngineCore.outputText( ', and only now do you realize you blew past her cervix long ago, the tight ring hugging your ' + Descriptors.cockDescript( x ) + ' in a clutching embrace.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'Cinnabar\'s head looks absurdly tiny, perched as it is above her bloated belly.  She moans, "<i>F-fucking asshole!  You went t-too f-ah-ahhh-st...</i>"  Her voice trails off as her eyes narrow.  Somehow, even with her broken body, she\'s managed to get it together enough to yell at you.\n\n', false );
		EngineCore.outputText( '"<i>Fuck you!  You can\'t wait to get inside and then you sit there smirking?  Fuck that.  If you won\'t fill me right, I\'ll make you!</i>" screams the red rat.  Her already-crimson eyes glow with eldritch light and her hand lifts, radiating with the same unholy power.  Cinnabar\'s hand punches through one of the mirrors on the wall, disappearing for the tiniest fraction of a second before punching through the ring of your ' + Descriptors.assholeDescript() + ', HARD.  You scream, completely and utterly violated, just like Cinnabar.', false );
		CoC.player.buttChange( 30, true, true, false );
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'She twists her fist inside you and reaches up to palm the tender lump of your prostate as she says, "<i>Payback\'s a bitch.</i>"  Her eyes flare, the magic exploding inside you, worming through your prostate and into your mind.  ', false );
		if( CoC.player.inte >= 50 ) {
			EngineCore.outputText( 'You dimly register it as an arousal spell, but you were already on edge, and your poor prostate is practically wringing itself dry in an effort to cum.', false );
		} else {
			EngineCore.outputText( 'It\'s too much for your utterly encapsulated member and violated anus, and your poor prostate practically wrings itself dry as it tries to unload.', false );
		}
		EngineCore.outputText( '  A half-second later your ' + Descriptors.cockDescript( x ) + ' joins it, your internal muscles clenching and convulsing, heaving the jizz from your body in one huge, gooey blast.\n\n', false );
		EngineCore.outputText( 'Cinnabar pulls her dirty paw out and grins like a mouse with a chunk of cheese, massaging her distorting neck while you empty every ounce of cum from your ' + Descriptors.ballsDescriptLight() + ' into her over-stretched womb-filled body.  She squeaks, "<i>No-ohhhh-ormally I LIKE being a mewling slut for ' + CoC.player.mf( 'studs', 'bitches' ) + ' like you, but if you won\'t treat a cum-sleeve like me with respect, then I\'m going to teach it to you.</i>"  You nod dumbly, still locked in an climax that ', false );
		if( CoC.player.cumQ() < 250 ) {
			EngineCore.outputText( 'makes your body churn well after you\'re empty.', false );
		} else if( CoC.player.cumQ() < 500 ) {
			EngineCore.outputText( 'causes her hugely-stretched lips to glaze white.', false );
		} else if( CoC.player.cumQ() < 1000 ) {
			EngineCore.outputText( 'causes her lips to glaze and her belly to bloat.', false );
		} else if( CoC.player.cumQ() < 1500 ) {
			EngineCore.outputText( 'makes her look pregnant and vents a puddle of syrupy-spooge on top of you.', false );
		} else {
			EngineCore.outputText( 'makes her look like a hugely-pregnant fuck-beast and dumps cum everywhere.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'The now-dominant, living onahole squeals with pleasure, yammering incessant, half-thought pleasure-words as she gets off.  "<i>Fu-fu... cum... somuchcum... ohhh gods yes... stuff my broken cunt! More!  Gimme more!  I want to feel it – no, I want to bubble with it, be it.  I want to be so full of cum... YES! OoooooooooooooOOOO – sssqeeEAAAAAAAAAAAK!</i>"\n\n', false );
		EngineCore.outputText( 'You collapse under her, still twitching weakly while her magic courses through your veins.  Somehow your ' + Descriptors.ballsDescriptLight() + ' are still twitching, but it\'s a painful, empty feeling, and you just want it to end.  You groan, nearly crying while your abused shaft is milked by orgasm-fueled rat-cunt contractions.  It makes you delirious and light-headed, and after a seeming eternity of torture, your brain shuts down, unable to cope with it anymore.\n\n', false );
		EngineCore.outputText( '<b>Some time later...</b>\n', false );
		EngineCore.outputText( 'Cinnabar slaps you hard, stirring you from your unnatural slumber.  You look up at her, blinking dumbly for a moment.  Her lips press against yours, crushing them with the force of her passion.  The rodent\'s soft, padded hands continue hitting you, slapping your face, boxing your ears, and smacking lamely into your chest.  Yet throughout the beating she\'s tonguing your mouth, groaning into your lips and smearing herself over your still-huge cock.  At last the rat seems satisfied, and she pulls of you with a panting, confused-looking smirk on her face.\n\n', false );
		EngineCore.outputText( 'You sit up, completely and totally awake thanks to your abusive lover, who\'s just smirking at you.  "<i>Goddamn you, you huge-cocked ' + CoC.player.mf( 'stud', 'fucker' ) + '.  I\'m STILL sore, but Marae\'s tits, did you ever get me off!  Don\'t get the wrong impression, it hurt like a BITCH.  I pity the girls you meet who can\'t stretch themselves like I can.  I truly do.  If you try that shit with me again, I\'ll give you another lesson in empathy – I hope you don\'t forget this one.</i>"\n\n', false );
		EngineCore.outputText( 'Cinnabar tosses your ' + CoC.player.armorName + ' and you realize the nude rat doesn\'t show any signs of your tryst', false );
		if( CoC.player.cumQ() >= 500 ) {
			EngineCore.outputText( ', save for her pregnant belly and ', false );
		} else {
			EngineCore.outputText( ', save for her ', false );
		}
		EngineCore.outputText( 'huge, slightly parted pussy-lips.  Chances are she\'ll have those back to normal before long anyway.  You get dressed and turn to leave, but before you do a tail taps your shoulder, the length curling to squeeze your neck.  It stops you cold while the hooker\'s voice whispers, "<i>Don\'t wait too long to come back.</i>"\n\n', false );
		EngineCore.outputText( 'Once she lets you go, you leave, and you find yourself mulling over her statement about empathy for some time.', false );
		//(-2 corruption!);
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', 3, 'cor', -2 );
		CoC.player.takeDamage( 25 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//(HUGER);
	Cinnabar.prototype.cinnabarHuger = function() {
		CoC.flags[ kFLAGS.CINNABAR_FUCKED_CORRUPT_PREVIOUSLY ] = 0;
		var x = CoC.player.biggestCockIndex();
		EngineCore.outputText( '', true );
		EngineCore.spriteSelect( 91 );
		EngineCore.outputText( 'You\'re almost there, so close to your orgasm, but you\'ve got so much more cock to bury inside this flexible, stretched-out pussy, and you\'re determined to bury every last inch of your improbably-large prick inside her before you blast your load.  At this rate, you\'ll be pushing in all day, so you decide to speed things up.  You grab her by the haunches, feeling your fingers sink into her silky fur, and you pull her back, flexing your biceps as you yank her down with all your might.  She slides down fast, taking a foot of cock in seconds, fast enough to make her belly bulge out in a distinctly dick-like manner.\n\n', false );
		EngineCore.outputText( 'The rest of you sinks in, plowing through her surprisingly spongy cervix to violate the very core of her womb.  It pushes out far enough that she looks like a ruddy cock-sleeve, with two bouncing tits hanging off your ' + CoC.player.cockHead( x ) + '.  Incredibly, Cinnabar doesn\'t seem to mind that her body is being stretched in impossible ways, distended completely beyond the limits of reason.  Instead, she starts murmering, "<i>Oooh yeah, feel how fucking tight my womb is.  Can\'t you feel my cervix clamping down, squeezing tight like a cock-ring you couldn\'t get the whole way down?  0..hahahaha I\'m broken aren\'t I?  Look at me, I\'m your furry condom.  My pussy\'s completely broken... I\'m so gaped I\'ll never walk right again, and I can - I can jerk you off through my belly and womb!</i>"\n\n', false );
		EngineCore.outputText( 'True to her words, she starts squeezing you through her fur, massaging your ' + Descriptors.cockDescript( x ) + ' by dragging her stretchy puss along your length with her fingertips.  It\'s too much, her body is fucking perfect for your ' + Descriptors.cockDescript( x ) + ', and you feel warmth building inside you.  Her tail twists around your ', false );
		if( CoC.player.balls > 0 ) {
			EngineCore.outputText( Descriptors.ballsDescriptLight(), false );
		} else {
			EngineCore.outputText( 'base', false );
		}
		EngineCore.outputText( ' to prod at your ' + Descriptors.assholeDescript() + ', sliding in to push your prostate.  She hits it hard enough to make you pump cum with enough force to distort her already-ballooned body, and you go into an orgasmic frenzy, dragging your ' + Descriptors.cockDescript( x ) + ' back to her entrance before jamming in all ', false );
		if( CoC.player.cocks[ x ].cockLength < 24 ) {
			EngineCore.outputText( Utils.num2Text( Math.round( CoC.player.cocks[ x ].cockLength ) ) + ' inches', false );
		} else {
			EngineCore.outputText( Utils.num2Text( Math.round( CoC.player.cocks[ x ].cockLength / 12 ) ) + ' feet', false );
		}
		EngineCore.outputText( ' all over again.', false );
		if( CoC.player.cocks[ x ].cockLength >= 60 ) {
			EngineCore.outputText( '  There\'s no way this should be possible, but it\'s happening and you couldn\'t be happier.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'Her body is squirming, writhing from the complete and total dick-domination.  You push her hands off your ' + Descriptors.cockDescript( x ) + ', and jack yourself off while you cum inside her, watching with fascination as each blast bulges her belly before it vanishes inside her with a wet slosh.  Her huge, stretched lips leak like a sieve, splattering girlcum everywhere while your ' + Descriptors.ballsDescriptLight() + ' pack', false );
		if( CoC.player.balls === 0 ) {
			EngineCore.outputText( 's', false );
		}
		EngineCore.outputText( ' her with goo, claiming her ruined body.  Cinnabar pants and screams in between pleasure-squeaks, "<i>F-fuck... fuck your fuck-toy!  Stuff her cunt... YES!  S-slut is so fucked... Cum, ' + CoC.player.mf( 'master', 'mistress' ) + ', then toss slut aside l-l-like a discarded, broken toy.  YOU\'VE RUINED ME ' + CoC.player.mf( 'MASTER', 'MISTRESS' ) + '!</i>"\n\n', false );
		EngineCore.outputText( 'Those wonderful, perverse words milk your ' + Descriptors.ballsDescriptLight() + ' dry as effectively as her massively-gaped cunt and broken body, but you keep pumping until you\'re sore and completely emptied.  ', false );
		if( CoC.player.cumQ() >= 500 ) {
			EngineCore.outputText( 'The rat-girl has gained a nice ', false );
			if( CoC.player.cumQ() < 1000 ) {
				EngineCore.outputText( 'spooge-paunch from all the cum.', false );
			} else if( CoC.player.cumQ() < 1500 ) {
				EngineCore.outputText( 'spooge-packed belly from all the cum.', false );
			} else {
				EngineCore.outputText( 'spooge-pregnancy from all the cum.  It swings underneath her, making her look ready to birth.', false );
			}
			EngineCore.outputText( '  ', false );
		}
		EngineCore.outputText( 'Cinnabar goes limp, but speared as she is, her near-unconscious body just hangs on you like a sock for your cock.  You shift position, and gently slide her off, shivering from how tightly her interior grips you as she\'s peeled off.\n\n', false );
		EngineCore.outputText( 'At last, your ' + CoC.player.cockHead( x ) + ' pops from her pussy, showing just how completely you\'ve worked over her body.  Her hips are stretched damn near a foot apart, and you can see deep enough inside her ', false );
		if( CoC.player.cocks[ x ].cockLength >= 60 ) {
			EngineCore.outputText( 'that it should be sticking up past her head, yet somehow isn\'t.', false );
		} else {
			EngineCore.outputText( 'to know that she must be some kind of magical to take a fucking like that without damage.', false );
		}
		EngineCore.outputText( '  Starting from her abused cervix, Cinnabar\'s pussy slowly begins to change, narrowing until it closes off your view of her womb.  The whole canal draws closed in one long motion that squeezes fuck-juices all over the bed, and then you hear her hips pop back into place.\n\n', false );
		EngineCore.outputText( '"<i>What, you think I\'d hunt down ' + CoC.player.mf( 'studs', 'breeders' ) + ' like you to fuck if I couldn\'t handle a little stretching every now and again?  Oh don\'t look at me like that – I\'m going to be sore for hours, but I fucking loved it.  Your cock... it\'s fucking special, and if you EVER want to feel another full-body fuck, come back and see me,</i>" says Cinnabar as she smiles up at you from her bed.\n\n', false );
		EngineCore.outputText( 'You smile back and go get dressed; it\'s way past time you checked on your campsite.  As you open the door, you can hear Cinnabar humming happily and trying to clean all the mess from her sheets', false );
		if( CoC.player.cumQ() >= 1000 ) {
			EngineCore.outputText( ', the sloshing in her belly still quite audible', false );
		}
		EngineCore.outputText( '.', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -4 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//(HUGE);
	Cinnabar.prototype.cinnabarHuge = function() {
		CoC.flags[ kFLAGS.CINNABAR_FUCKED_CORRUPT_PREVIOUSLY ] = 0;
		var x = CoC.player.biggestCockIndex();
		EngineCore.outputText( '', true );
		EngineCore.spriteSelect( 91 );
		EngineCore.outputText( 'You\'re almost there, and though you can feel the burgeoning warmth growing underneath your ' + Descriptors.cockDescript( x ) + ', you\'re determined to push the whole way inside her before you blow.  Cinnabar crams her muzzle through a particularly large mirror and locks onto your lips, ramming her tongue deeper into your throat, pushing harder with each inch of tightly-packed cock you shove inside her.  At last you bottom out, your ' + CoC.player.cockHead( x ) + ' bumps the tight ring of her cervix while her tail pulls tight about your ', false );
		if( CoC.player.balls > 0 ) {
			EngineCore.outputText( Descriptors.ballsDescriptLight(), false );
		} else if( CoC.player.hasSheath() ) {
			EngineCore.outputText( 'sheath', false );
		} else {
			EngineCore.outputText( 'base', false );
		}
		EngineCore.outputText( '.\n\n', false );
		EngineCore.outputText( 'The kiss is broken abruptly, the suddenly invigorated rat-girl\'s lips pressing close to your ear as she murmurs, "<i>Oh yes... feel how tight my poor, abused cunt is... so very tight, clutching you like a swimsuit two sizes too small... Mmm, I can feel you twitching; are you going to cum in this slut\'s womb?  You\'ve fucked me so hard, gaped me and ruined me... will you finish me off?  Do it ' + CoC.player.mf( 'stud', 'bitch' ) + ', fuck this horny slut\'s womb full, mark her as your bitch - no, your fucking property!</i>"\n\n', false );
		EngineCore.outputText( 'Gods, she\'s so fucking perverse, and she\'s squeezing you so tight; fuck, even her tail is working you.  It twists around your ', false );
		if( CoC.player.balls > 0 ) {
			EngineCore.outputText( Descriptors.ballsDescriptLight(), false );
		} else if( CoC.player.hasSheath() ) {
			EngineCore.outputText( 'sheath', false );
		} else {
			EngineCore.outputText( 'shaft', false );
		}
		EngineCore.outputText( ' to prod at your ' + Descriptors.assholeDescript() + ', sliding in to push your prostate, pressing on it hard enough to make you pump a jet of cum past the rat\'s relaxing cervix and into her womb.  You go into an orgasmic frenzy, utterly, completely dominating the size-queen with your massive, cum-bloated fuck-stick.  Her ass shakes and wobbles as you pull back roughly, dragging your cock through that over-tightened velvet cunt-sleeve, but before you can slip out, you push back in, fucking her hard enough to make a loud slap from your hips slamming into one another.\n\n', false );
		EngineCore.outputText( 'Her juices fall like rain, soaking the sheets, ', false );
		if( CoC.player.balls > 0 ) {
			EngineCore.outputText( 'your balls, ', false );
		}
		EngineCore.outputText( 'your ' + CoC.player.legs() + ', and ', false );
		if( !CoC.player.hasSheath() ) {
			EngineCore.outputText( 'the base of your twitching cock', false );
		} else {
			EngineCore.outputText( 'your twitching cock-sheath', false );
		}
		EngineCore.outputText( '.  You rub your hand over her belly, feeling your ' + CoC.player.cockHead( x ) + ' through her distended, dick-dominated fur.  Each fiery, pumping load of cum boils underneath the rat\'s fur, bubbling between your fingers as it sloshes into her womb.  Cinnabar is thrashing, squeaking and crying, though it\'s quite clear her tears are tears of joy.  She gasps, "<i>So big', false );
		if( CoC.player.cumQ() >= 1000 ) {
			EngineCore.outputText( ' and so much', false );
		}
		EngineCore.outputText( '... YES!  CLAIM ME!  I\'m yours... your cock-addicted, stretched-out fucktoy!  More... more!</i>"\n\n', false );
		EngineCore.outputText( 'You don\'t hold back, and you fuck her raw, jerking yourself off through her stretched hide until your ', false );
		if( CoC.player.balls === 0 ) {
			EngineCore.outputText( 'prostate has been squeezed dry.', false );
		} else {
			EngineCore.outputText( Descriptors.ballsDescriptLight() + ' feel sore and empty, completely drained.', false );
		}
		if( CoC.player.cumQ() > 500 ) {
			EngineCore.outputText( '  The rat-girl has gained a nice, ', false );
			if( CoC.player.cumQ() < 1000 ) {
				EngineCore.outputText( 'jiggling spooge-paunch from all the cum.', false );
			} else if( CoC.player.cumQ() < 1500 ) {
				EngineCore.outputText( 'spooge-packed belly from all the cum.', false );
			} else {
				EngineCore.outputText( 'spooge-pregnancy from all the cum.  It swings underneath her, making her look ready to birth.', false );
			}
		}
		EngineCore.outputText( '  Cinnabar slumps into her pussy-stained sheets, her silky fur turning into a cum-matted mess as she starts to slide into her pillows.  You grab hold of her haunches and slow her descent, sighing with bliss as you feel the abused fuck-tunnel tremble and squirm with involuntary pleasure-contractions.\n\n', false );
		EngineCore.outputText( 'The rat\'s black, brutalized lips pop off of your ' + CoC.player.cockHead( x ) + ' at last, and you\'re given the first chance to observe your handiwork.  You can see deep inside her, all the way to her still-quivering, jism-leaking cervix.  Cinnabar grunts and sighs dreamily, and you watch in awe as all that damage, that brutal, hard fucking, begins to disappear.  Starting deep inside her, the walls begin to close up, moving like a wave towards her entrance.  The rippling, tightening motion reaches her lips, and they fold closed, returning to their original appearance, save for the thick coat of sperm and fuck-me-juice the rat\'s still leaking.\n\n', false );
		EngineCore.outputText( 'Cinnabar looks at you over her shoulder and says, "<i>What, you think I\'d be taking ' + CoC.player.mf( 'studs', 'breeders' ) + ' like you if I couldn\'t really handle it?  Don\'t worry babe... I loved it.  You can come stretch me ANY time so long as you\'re hung like that!</i>"  You smile – what a fuck – and go get dressed; it\'s past time you checked on your campsite.  As you depart, you can hear Cinnabar humming happily and trying to clean the sheets', false );
		if( CoC.player.cumQ() > 500 ) {
			EngineCore.outputText( ', the sloshing in her belly still quite audible', false );
		}
		EngineCore.outputText( '.', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -3 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	//[Multi Cock Portals] – Requires 2 75+ cock area members and at least 3 total.;
	//Cinnabar gets the PC in and has them fuck the portals on the wall, ;
	//setting two mirrors on the bed before she sits on them and fellates one on the wall.;
	//surprise – at the end she moves the portal when you pull back and makes you cum in her;
	//and in your own ass.;
	Cinnabar.prototype.cinnabarMultiCockPortalFuckFest = function() {
		CoC.flags[ kFLAGS.CINNABAR_HOUSE_VISITED ]++;
		CoC.flags[ kFLAGS.CINNABAR_NUMBER_TIMES_FUCKED ]++;
		CoC.flags[ kFLAGS.CINNABAR_FUCKED_CORRUPT_PREVIOUSLY ] = 0;
		EngineCore.outputText( '', true );
		EngineCore.spriteSelect( 91 );
		//x pussy, y butt, z face;
		var x = CoC.player.biggestCockIndex();
		var y = CoC.player.biggestCockIndex2();
		var z = CoC.player.biggestCockIndex3();
		EngineCore.outputText( 'Cinnabar\'s hands fly through your ' + CoC.player.armorName + ', diving through your undergarments to squeeze ' + Descriptors.sMultiCockDesc() + '.  ', false );
		if( CoC.player.lust >= 70 ) {
			EngineCore.outputText( 'She groans when she feels the full, turgid masses in her fingers, shivering as her padded finger-tips become slippery with your dripping pre-cum.', false );
		} else {
			EngineCore.outputText( 'She sighs blissfully when she feels the size and number of your half-hard members, squeezing them with gentle pressure until they start to expand, engulfing her hand.', false );
		}
		EngineCore.outputText( '  Your ' + CoC.player.legs() + ' go wobbly from the delicate touches dancing through your ' + Descriptors.multiCockDescriptLight() + ', making it hard to stand.  Cinnabar slides ', false );
		if( CoC.player.tallness >= 72 ) {
			EngineCore.outputText( 'under your arm', false );
		} else {
			EngineCore.outputText( 'up against you', false );
		}
		EngineCore.outputText( ', supporting you while she asks, "<i>Do we need to get inside and get these taken care of, big ' + CoC.player.mf( 'boy', 'girl' ) + '?  Ohhh, that\'s just too bad.  I think I\'ll just play with you in the street until you\'re ready to pop, and then leave you like that until you go soft.  Then we can start over.</i>"\n\n', false );
		EngineCore.outputText( 'Red, mirthful eyes watch your reaction, the cruel, toothy smile growing broader as she teases you.   You grunt and push back, pulling yourself up straight and inadvertently displaying the huge, many-pronged bulge', false );
		if( CoC.player.lust >= 70 ) {
			EngineCore.outputText( ' you have', false );
		} else {
			EngineCore.outputText( ' she\'s given you', false );
		}
		EngineCore.outputText( '.  She\'s teasing you, but it\'s clear she\'s no dominatrix.  No, she wants you to take charge, and if you\'re going to get off, you\'ll need to.  You hook your hand in between her cleavage, feeling the tight, silky embrace of her fur and the gentle, pounding beat of her heart.  It beats faster as soon as you start tugging her, dragging her towards the wagons.  ', false );
		if( CoC.flags[ kFLAGS.CINNABAR_HOUSE_VISITED ] === 0 ) {
			EngineCore.outputText( 'She leans, guiding you towards her home even as she lets herself be led.', false );
		} else {
			EngineCore.outputText( 'She blushes hard, her thighs darkening from the fluid racing down them as you pull her towards her house.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'You pull her to the door, discovering the solid oak portal to be quite securely locked.  Cinnabar starts to slide around you, but before she can complete her first step, you push her against the door and reach under her dress, fingering her sloppy slit while you growl in her ear, "<i>Unlock it, bitch.</i>"\n\n', false );
		EngineCore.outputText( 'The rodent\'s long tail hovers before the lock, shaking uncontrollably while you diddle her poor pussy.  She grinds her plump ass against your groin, shivering each time your bulges press her dampening dress into the pucker of her backdoor.  You laugh in her ear, pulling the puffy, wet lips of her sex wide and penetrating her with your middle finger while you tease her about her inability to even open a door.  A soft click breaks the tension, and before the rat can squirm loose, you push her through the entry, step in, and slam it shut behind you.\n\n', false );
		EngineCore.outputText( 'Cinnabar has already started struggling out of her crimson mini-dress, but as soon as the wet patch hits her nose you see her entire demeanor change.  The material pulls tight to her nose, vacuumed by sudden inhalations.  The rat leans back against the wall, one hand diving to her muff while she grabs her dress and smears it over her face.  Her lewdness triggers a further hardening in your groin, reminding you that you\'re still crammed inside your ' + CoC.player.armorName + '.  You take it off as quickly as you can and toss it to the side.\n\n', false );
		EngineCore.outputText( 'Loud, horny snorts and squelching noises radiate from Cinnabar, and you reach over to yank her soaked dress from her head.  It slides off with ease, leaving strands of girl-cum to hang over the intervening distance for a few seconds before they collapse on her exposed fur.  She looks up at you, mouth gaping, panting with lust as she asks, "<i>Can slut have more pussy smell?  Slut is so horny and her holes need plugged with cock for her little fuck-crazy mind to work.</i>"\n\n', false );
		EngineCore.outputText( 'You slap her face with your ' + Descriptors.cockDescript( x ) + ', smearing her pussy-juice across her cheek and mixing a bit of your pre-cum into it.  She groans and jumps onto her bed, but before you can close the distance she asks, "<i>Can slut show ' + CoC.player.mf( 'master', 'mistress' ) + ' her tricks?  She has so many sexy tricks to help ' + CoC.player.mf( 'master', 'mistress' ) + ' fuck her needy, achy fuck-holes.</i>"\n\n', false );
		EngineCore.outputText( 'She bounces her ample tits in her hands, pink tongue darting over supple lips.  Your eyes lock onto her chest, watching in awe as the rodent\'s largish orbs start to jiggle more and more with every bounce.  They heave and swell, turning her modest cleavage into a massive canyon, the bulging mammaries oozing over her too-small arms to drag her torso up on top of them.  It almost looks like she\'s lying down on a pair of soft bean-bag chairs.  Her ass actually hangs up in the air, wiggling to and fro to smear the mirrors lining the walls around the bed with fresh pussy-juice.\n\n', false );
		EngineCore.outputText( '"<i>Does ' + CoC.player.mf( 'master', 'mistress' ) + ' like slut\'s first trick?  Ooooh, yes ' + CoC.player.mf( 'he', 'she' ) + ' does! Look at those behemoths twitching!  Mmmm, I know you\'ll love this slut\'s next trick, ' + CoC.player.mf( 'master', 'mistress' ) + ',</i>" she says, pointing towards a few dozen mirrors on the far wall.  You drag your tit-mesmerized eyes from her heaving breasts and follow her finger to the reflective circles.  They flicker once, and suddenly images and shapes replace the reflections, showing the slutty, sex-obsessed rat from a myriad of directions.  There\'s a huge concentration of portals at waist height, and you realize that they\'re all positioned for you to thread your ' + Descriptors.multiCockDescriptLight() + ' through.\n\n', false );
		EngineCore.outputText( 'Cinnabar\'s puffy, drippy lips are pressed tight against the central aperture, bulging through just enough to drool girl-cum down the frame to the floor.  Just above are her puckered asshole and juice-matted ass-cheeks, practically winking at you.  Through another, you can see her panting, drooling tongue and lips.  Finally, all the other crotch-high mirrors are all arranged to point towards the skank\'s heaving, unnaturally-large fuck-bags.  Even as you watch, her spittle drops onto their curvy, jiggling surface, runnels of spit rolling towards the cushion while the rat works herself into a frenzy of need.\n\n', false );
		EngineCore.outputText( '"<i>D-does ' + CoC.player.mf( 'master', 'mistress' ) + ' like?  Ohhhh, fuck this slut ' + CoC.player.mf( 'master', 'mistress' ) + '... shit, come fuck me!  That fucking breast enlargement spell makes my cunt ache and drool for a big, hard cock.  Plug me ' + CoC.player.mf( 'stud', 'baby' ) + ', you can fill me so good!  Do it!  FUCK ME NOW!</i>" she screams, rocking and grinding into the portals, her tongue thrashing wildly while her lips arch into a needy \'o\'.\n\n', false );
		EngineCore.outputText( 'Your ' + Descriptors.hipDescript() + ' rock forwards of their own volition.  There\'s no way your ' + Descriptors.multiCockDescriptLight() + ' can resist such a lewd, needy specimen, or the chance to fuck her in so many different ways simultaneously.  First, your ' + Descriptors.cockDescript( x ) + ' hits her swollen pussy, and as you batter your way inside the slippery entrance, her body rewards you with a gush of girl-cum that soaks your manhood and drips over your ' + Descriptors.cockDescript( y ) + '.  A split-second later that second member is pressing at her anus, forcing through the clenched star in a violent, animalistic thrust.\n\n', false );
		EngineCore.outputText( 'Cinnabar moans, utterly and completely delighted, but you muffle those moans by spearing her throat on your ' + Descriptors.cockDescript( z ) + ', filling her oral orifice completely.  You reach through a pair of portals at arm height to squeeze her spread ass-cheeks, holding tight while you push forwards to completely bury your three lucky members in furry fuck-sleeves.', false );
		if( CoC.player.cockTotal() === 4 ) {
			EngineCore.outputText( '  The extra dick dives into the pillowy mounds, smearing a streamer of pre-cum over the tit\'s surface before it slides into that warm, welcoming cleavage.', false );
		} else if( CoC.player.cockTotal() > 4 ) {
			EngineCore.outputText( '  The extra dicks dive into the pillowy mounds, smearing streamers of pre-cum all over the tits\' surfaces before they slide home into that warm, welcoming cleavage.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'The sensation is absolutely divine, but primal need takes over.  You begin to rock your ' + Descriptors.hipDescript() + ' in and out, triple-penetrating the whore', false );
		if( CoC.player.cockTotal() >= 4 ) {
			EngineCore.outputText( ' while you tit-fuck her swollen breasts', false );
		}
		EngineCore.outputText( '.  Slippery-soft warmth wreathes your ' + Descriptors.cockDescript( x ) + ', the plush black love-tunnel contracting slightly to happily squeeze you every few seconds.  The darker, sinfully tight star of Cinnabar\'s anus glazes with your pre-cum, her ass-cheeks wobbling perfectly in your hands with each rhythmic penetration.', false );
		if( CoC.player.cockTotal() >= 4 ) {
			EngineCore.outputText( '  Meanwhile, the soft, downy fur on the rat\'s chest is starting to mat against her skin, coated with the slick leavings from your ', false );
			if( CoC.player.cockTotal() === 4 ) {
				EngineCore.outputText( 'extra dick', false );
			} else {
				EngineCore.outputText( 'remaining dicks', false );
			}
			EngineCore.outputText( '.', false );
		}
		EngineCore.outputText( '  The ' + Descriptors.cockDescript( z ) + ' in her mouth feels so good it nearly makes you jump, the long pink tongue licking around it while a wet muzzle buries itself in your crotch.  Gods, it\'s too much!\n\n', false );
		EngineCore.outputText( 'You feel yourself cumming, that tell-tale warmth in your gut mixing with a few involuntary muscle-contractions that bounce your ' + Descriptors.multiCockDescriptLight() + ' inside Cinnabar.  You turn your head to watch her, ' + Utils.num2Text( CoC.player.cockTotal() ) + ' penises pumping from holes in the wall to ravage her body completely and totally, her eyes rolled back in complete bliss.   Heat blooms in your ' + Descriptors.multiCockDescriptLight() + ', the pumping gouts of seed deep into all of the slut\'s holes simultaneously.  She screams into your ' + Descriptors.cockDescript( z ) + ', vibrations making your orgasm that much stronger.  It drags on and on, the spit-roasted rat shaking while she\'s completely taken in every way', false );
		if( CoC.player.cockTotal() >= 4 ) {
			EngineCore.outputText( ', her tits shining white from all the spooge you dump on to them', false );
		}
		EngineCore.outputText( '.\n\n', false );
		//(Medium-high cum production);
		if( CoC.player.cumQ() >= 500 && CoC.player.cumQ() < 1000 ) {
			EngineCore.outputText( 'Cinnabar\'s belly gurgles, her gut and womb packing with enough spunk to make her belly wobble slightly while you empty inside her.  Semen froths on her lips while she works to swallow it all.  It just adds to her already-impressive paunch.', false );
			if( CoC.player.cockTotal() >= 4 ) {
				EngineCore.outputText( '  The rat\'s tits are completely white, spooge leaking off her nipples like some kind of thick, sticky milk.', false );
			}
			EngineCore.outputText( '  You finish filling her with cream and hold your place long enough to admire your work from across the room.\n\n', false );
		}
		//(High cum production);
		else if( CoC.player.cumQ() >= 1000 ) {
			EngineCore.outputText( 'Cinnabar\'s belly gurgles, the skin pulling tight from all the seed you\'re pumping into her womb, gut, and belly.  She looks positively pregnant, and she even begins to slosh from each fresh deposit that you leave inside her.  The rat\'s eyes look up at you through a portal.  They\'re lidded with a mix of lust and pleasure, but your gaze goes lower to watch spooge bubble from her nose while her overtaxed throat fails to keep up with your heavy spunk-streams.', false );
			if( CoC.player.cumQ() >= 1500 ) {
				EngineCore.outputText( '  Best of all, her bed is completely soaked in the stuff, and she wallows in it like a pig in mud, her cleavage absolutely drenched with cum.', false );
			}
			EngineCore.outputText( '\n\n', false );
		}
		EngineCore.outputText( 'The slut-rat gargles in irritation around your sensitive, cummed-out cock, clearly displeased that you\'re still inside her.  You step back from the wall, your ' + CoC.player.legs() + ' giving out from the sensory overload of unsheathing your ' + Descriptors.multiCockDescriptLight() + ' simultaneously to drop you flat on your ' + Descriptors.assDescript() + '.  At the same time, Cinnabar starts coughing and groaning, clearly exhausted from the one-' + CoC.player.mf( 'man', 'woman' ) + ' gangbang.  You understand how that feels; just touching ' + Descriptors.sMultiCockDesc() + ' makes your head swoon.\n\n', false );
		EngineCore.outputText( 'An incessant licking reaches your ears, getting your attention.  You stand up, careful about your ' + Descriptors.multiCockDescriptLight() + ' while you look towards the bed.  The portals are closed down, and Cinnabar is bent double, folded in half like a contortionist', false );
		if( CoC.player.cumQ() >= 1000 ) {
			EngineCore.outputText( ' while her huge, cum-filled belly bulges out to the sides', false );
		}
		EngineCore.outputText( '.  Her long, pink tongue is lashing over her swollen, black cunt-lips, hungrily cleaning the dirty twat and even licking at her asshole.  It\'s almost enough to get you hard again, but she eventually breaks from her auto-cunnilingus long enough to glance your way.\n\n', false );
		EngineCore.outputText( '"<i>You\'re still here?  Go on, I\'ve got a lot of cleaning up to do before my next customer!</i>" grunts Cinnabar before returning to her task.  You run your hand through your ' + Descriptors.hairDescript() + ', exasperated, but quite satisfied.  You\'ll definitely have to visit her again sometime.\n\n', false );
		EngineCore.outputText( 'While you\'re getting dressed, the repeated slurps and moans pause enough for Cinnabar to say, "<i>I didn\'t mean to be rude... those dicks... those wonderful, plump cocks... they\'re a gift.  Come back soon ' + CoC.player.mf( 'stud', 'baby' ) + ', your cream filling tastes gooood.</i>"  She goes back to licking herself, and you can\'t help but have a huge grin as you walk out.', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -6 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	SceneLib.registerScene( 'cinnabar', new Cinnabar() );
} );