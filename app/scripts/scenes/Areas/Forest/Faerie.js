'use strict';

angular.module( 'cocjs' ).run( function( Descriptors, CoC, Utils, EngineCore, AppearanceDefs, StatusAffects, Appearance, CockTypesEnum ) {
	function Faerie() {
	}

	//faerie Encounter
	Faerie.prototype.encounterFaerie = function() {
		EngineCore.spriteSelect( 17 );
		EngineCore.outputText( 'A faerie slightly taller and thicker than your middle finger flits about the air. Her flat chest and girlish bob of hair make her look quite cute, but the solid black stockings and leather straps covering her chest show her slutty nature. Her wings are a light red, the color of aroused genitals.\n\n', true );
		if( CoC.getInstance().player.cockTotal() > 0 && (!CoC.getInstance().player.hasVagina() || Utils.rand( 2 ) === 0) ) {
			EngineCore.outputText( 'She seems to notice you getting hard at the sight of her and looks down. "<i>Ew, man parts!</i>" the faerie exclaims, flying away like a frightened bird.', false );
			if( Utils.rand( CoC.getInstance().player.spe / 2 ) + CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFucked ) > 15 ) {
				if( CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFucked ) < 5 ) {
					EngineCore.outputText( '\n\nYou make a desperate lunge for the faerie girl and grab her before she can fly away.   She wriggles and squirms in your grasp, shouting, "<i>Let me go you meanie!</i>"\n\n', false );
					EngineCore.outputText( 'It would be cute if she wasn\'t dressed up like such a slut.  You bet you could get her to help pleasure you, but she might not like it.  Or you could be a nice ' + CoC.getInstance().player.guyGirl() + ' and let her go...\n\nDo you force her to pleasure you?', false );
				} else if( CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFucked ) < 10 ) {
					EngineCore.outputText( '\n\nYou snatch her out of the air fairly easily.  She seems like she\'s slowed down a little.   She squirms and wriggles, begging you, "<i>Please don\'t cover me in cum again... I get so drunk and feel even sluttier afterwards.  I don\'t want to be a slut!</i>"\n\nShe pouts, but blushes.  Do you make her get you off again?', false );
				} else if( CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFucked ) < 15 ) {
					EngineCore.outputText( '\n\nYou grasp the dizzy faerie out of the air with ease, smiling as you feel the flood of wetness between her thighs moistening your hand.  She wriggles and moans, "<i>No, not again!  I want another cum-bath so bad... but I\'m losing myself to it.  It\'s hard to keep flowers pollinated when you\'re jilling off half the day and waiting for a nice hard cock to wander your way...</i>"\n\nShe wants to get you off almost as you do.  Do you make her service you again?', false );
				} else {
					EngineCore.outputText( '\n\nYou lazily make a grab for her and easily snatch her out of the air.  Her body is sticky with a mix of desire and your last encounter.  You can feel her humping against your pinky while she begs, "<i>Come on, let me crawl into your ' + CoC.getInstance().player.armorName + ' and wrap myself around your shaft.  I promise I\'ll only drink a little pre-cum this time, just enough to let me get off.  I\'ll be a good faerie slut, just let me get you off!</i>"\n\nDo you let the faerie get you off?', false );
				}
				EngineCore.dynStats( 'lus', CoC.getInstance().player.lib / 10 + 2 );
				EngineCore.doYesNo( this.faerieCaptureHJ, this.letFaerieGo );
				return;
			}
			EngineCore.dynStats( 'lus', CoC.getInstance().player.lib / 10 + 2 );
			if( CoC.getInstance().player.lust >= 90 ) {
				EngineCore.outputText( '\n\nYou groan miserably with frustration. Desperate for stimulation, you sink to your knees and start jacking off, the faerie\'s visage still fresh in your mind. You catch a fleeting glimpse of yourself tightly gripping the faerie\'s legs in each of your fists, dragging her toward ', false );
				if( CoC.getInstance().player.cockTotal() === 1 ) {
					EngineCore.outputText( 'your dick', false );
				} else {
					EngineCore.outputText( 'one of your dicks', false );
				}
				EngineCore.outputText( ', too large for her tiny frame... the depraved image overwhelms your mind\'s eye and you find yourself shooting all over the ground furiously.', false );
				CoC.getInstance().player.orgasm();
			} else {
				EngineCore.outputText( '\n\nYou try in vain to jump and catch her, but she\'s too high above you and much too fast.', false );
			}
			EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
			return;
		}
		EngineCore.outputText( 'The faerie slows the beating of her wings and hovers towards you. You dismiss your fearful notions, certain a small faerie is quite harmless to you.\n\n', false );
		EngineCore.outputText( 'How do you react?', false );
		//Shoo Away, Nothing, RAEP
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.choices( 'Shoo Away', this.faerieShooAway, 'Nothing', this.faerieDoNothing, 'Rape', this.faerieRAEP, '', null, '', null );
		} else {
			EngineCore.choices( 'Shoo Away', this.faerieShooAway, 'Nothing', this.faerieDoNothing, '', null, '', null, '', null );
		}
	};
	Faerie.prototype.faerieRAEP = function() {
		EngineCore.spriteSelect( 17 );
		//Count secksins
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.FaerieFemFuck ) < 0 ) {
			CoC.getInstance().player.createStatusAffect( StatusAffects.FaerieFemFuck, 1, 0, 0, 0 );
		} else {
			CoC.getInstance().player.addStatusValue( StatusAffects.FaerieFemFuck, 1, 1 );
		}
		EngineCore.outputText( 'You let the tiny faerie buzz closer to investigate, then with an explosion of movement, snatch her out of the air.  She squirms in your palm, struggling futilely in your grasp.  You poke between her legs with a finger, noting the flushed redness of the faerie\'s skin.  ', true );
		//Changes based on times fucked
		if( CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFemFuck ) === 1 ) {
			EngineCore.outputText( 'She juices herself and screams, "<i>Let me goooooooo,</i>" trying to sound outraged instead of turned on, but the tiny girl\'s body gives away the lie.', false );
		} else if( CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFemFuck ) <= 5 ) {
			EngineCore.outputText( 'She juices herself and moans, "<i>Stop teasing meeeeee,</i>" doing her best to wriggle back against you, as if she could somehow impale herself on your digit.', false );
		} else {
			EngineCore.outputText( 'She squeals, rocking her hips back against you and moaning, "<i>Ohhhh I love it when you do that,</i>" grinding her incredibly small love-button on your digit.', false );
		}
		//Special Taurness
		if( CoC.getInstance().player.isTaur() ) {
			EngineCore.outputText( '\n\nYou bop the tiny Faerie on the head to daze her briefly, then place her on a branch. You back yourself up against the tiny creature, lifting your tail so she can see your ' + Descriptors.vaginaDescript( 0 ) + '. The scent washes toward her and you hear a high pitched giggle; evidently that was more than enough to give her quite the contact high.  You feel a strange sensation in your slit as she slides her legs inside you and wraps her arms around your ' + Descriptors.clitDescript() + '.\n\n', false );
			//[If cock-like clit:
			if( CoC.getInstance().player.clitLength >= 3 ) {
				EngineCore.outputText( 'The tiny fae begins jerking your clit like a cock, squeezing her arms tightly around you and sliding in and out of your ' + Descriptors.vaginaDescript( 0 ) + '. Her motions are frenetic and unpredictable, but incredibly pleasurable.  She starts licking at your ' + Descriptors.clitDescript() + ' as your femcum runs down it, which only serves to make her more excited. She gets so excited that her legs start kicking wildly as she screams "<i>Swim! Swim! Swim! Swim!</i>" over and over again.  ', false );
				//[Small amount of cum:
				if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness <= AppearanceDefs.VAGINA_WETNESS_WET ) {
					EngineCore.outputText( 'The fae giggles more and more as the fluid seeps about her and your ' + Descriptors.vaginaDescript( 0 ) + ' ripples. She hugs your ' + Descriptors.clitDescript() + ' tighter and starts gently gnawing at it, such a peculiar sensation that you cum suddenly, and wetly.  Her giggles quickly become all-out laughter, and she loses her grip on your clit, sprawling to the ground into a small puddle of femcum.\n\n', false );
				}//[Normal amount of cum:
				else if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness <= AppearanceDefs.VAGINA_WETNESS_DROOLING ) {
					EngineCore.outputText( 'The fae giggles more and more as the fluid squirts about her and your ' + Descriptors.vaginaDescript( 0 ) + ' ripples. She hugs your ' + Descriptors.clitDescript() + ' tighter and starts gently gnawing at it, such a peculiar sensation that you cum suddenly, and wetly.  Her giggles quickly become all-out laughter, and she loses her grip on your clit, sprawling to the ground into a puddle of femcum.\n\n', false );
				}//[Huge amount of cum:
				else {
					EngineCore.outputText( 'The fae giggles more and more as the fluid sprays about her and your ' + Descriptors.vaginaDescript( 0 ) + ' ripples. She hugs your ' + Descriptors.clitDescript() + ' tighter and starts gently gnawing at it, such a peculiar sensation that you cum suddenly, and wetly.  Her giggles quickly become all-out laughter, and she loses her grip on your clit, sprawling to the ground into a huge puddle of femcum, her giggling frame floating on the surface as her legs kick about erratically.\n\n', false );
				}
			}
			//[All other clits:
			else {
				EngineCore.outputText( 'The tiny fae rubs her hands around your ' + Descriptors.clitDescript() + ' as if entranced by it. Your body responds by pumping out more femcum, which she laps up happily.  She starts laughing maniacally and banging on your clit like a drum, periodically yelling out "<i>CONGA!</i>" for some reason. The strange ministrations feel incredible though, and you feel your love canal squeezing down on the faerie\'s tiny body.  ', false );
				//[Small amount of cum:
				if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness <= AppearanceDefs.VAGINA_WETNESS_WET ) {
					EngineCore.outputText( 'You cum suddenly, and wetly. The fae giggles more and more as the fluid seeps about her and your ' + Descriptors.vaginaDescript( 0 ) + ' ripples. Her giggles quickly become all-out laughter, and she loses her grip on your innards, sprawling to the ground into a small puddle of femcum.\n\n', false );
				}//[Normal amount of cum:
				else if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness <= AppearanceDefs.VAGINA_WETNESS_DROOLING ) {
					EngineCore.outputText( 'You cum suddenly, and wetly. The fae giggles more and more as the fluid squirts around her and your ' + Descriptors.vaginaDescript( 0 ) + ' ripples. Her giggles quickly become all-out laughter, and she loses her grip on your innards, sprawling to the ground into a puddle of femcum.\n\n', false );
				}//[Huge amount of cum:
				else {
					EngineCore.outputText( 'You cum suddenly, and wetly. The fae tries desperately to hold on to your ' + Descriptors.clitDescript() + ' but the amount of fluid overwhelms her and she\'s sent spiralling to the ground into a huge puddle of your fluid, her giggling frame floating on the surface as her legs kick about erratically.\n\n', false );
				}
			}
		}
		//Non-Taurs
		else {
			EngineCore.outputText( '\n\nYou release the lower portion of your ' + CoC.getInstance().player.armorName + ', revealing your aroused slit to the faerie.  ', false );
			if( CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFemFuck ) < 4 ) {
				EngineCore.outputText( 'Her mood immediately shifts from panic to desire, and she licks her lips hungrily, locking her eyes onto your feminine folds.', false );
			} else {
				EngineCore.outputText( 'Her eyes open wide, like a junkie seeing a fix.  She licks her lips hungrily and humps the inside of your hand, ready for action.', false );
			}
			EngineCore.outputText( '  You release the faerie, letting the pussy-entranced fae buzz down to your sensitive nether-regions.  She lands softly, her tiny feet and hands prancing over your vulva.  You gasp in delight, ', false );
			if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness >= AppearanceDefs.VAGINA_WETNESS_SLAVERING ) {
				EngineCore.outputText( 'releasing a tiny squirt', false );
			} else if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness >= AppearanceDefs.VAGINA_WETNESS_DROOLING ) {
				EngineCore.outputText( 'dribbling juices', false );
			} else if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness >= AppearanceDefs.VAGINA_WETNESS_WET ) {
				EngineCore.outputText( 'growing so slippery the faerie nearly loses her footing', false );
			} else {
				EngineCore.outputText( 'feeling yourself moistening with need', false );
			}
			EngineCore.outputText( ' from the tiny touches.\n\n', false );
			//(small) <= 0.50"
			if( CoC.getInstance().player.clitLength <= 0.5 ) {
				EngineCore.outputText( 'She pulls apart your lips, revealing your tiny bud and repositioning herself to plant her feet inside you.  The flawless skin of her thighs pulls another gasp of pleasure from your lips.  They squeeze tightly around your ' + Descriptors.clitDescript() + ', scissoring her gash across its sensitive surface.   You squirm, too engrossed in the rough grinding your button is receiving to worry about the faerie.   She clings to you, hanging on for dear life as your crotch nearly throws her free.  During the gyrations, she\'s slammed back into the ' + Descriptors.clitDescript() + ', instantly penetrated by the nub with a wet \'schlick\'.\n\n', false );
				EngineCore.outputText( 'Squealing and bouncing as she hangs on tightly, the faerie noisily orgasms around your clit, squirting her own fluids into your aching ' + Descriptors.vaginaDescript( 0 ) + '.  The fluid tingles, and you shove your fingers in, smearing the sticky-sweet faerie-cum through your passage.   Before you can get far with it, your own orgasm goes off, squeezing your fingers and rippling around them, trying to milk your hand as if it was a dick.  Your legs go weak and wobbly, forcing you down on your ' + Descriptors.buttDescript() + ' as the waves of pleasure flow through you, soaking the faerie in girlcum.\n\n', false );
			}
			//(medium) <= 0.1.25"
			else if( CoC.getInstance().player.clitLength <= 1.25 ) {
				EngineCore.outputText( 'She watches, entranced as your ' + Descriptors.clitDescript() + ' hardens, poking between your lips, flushed with blood like a tiny cock.   The faerie swivels around, planting her dainty butt squarely on your snatch, sinking down a bit into the folds as she wraps her legs around the pulsating \'shaft\'.   She hugs it, pressing it between her tiny breasts and licking it up and down, making you moan and squirm from unexpected stimulation of your most sensitive area.\n\n', false );
				EngineCore.outputText( 'You spread your ' + CoC.getInstance().player.legs() + ', careful not to dislodge the faerie as she releases the ' + Descriptors.clitDescript() + ' and stands up, placing her dripping gash against the tip.   A quick plunge later and she\'s bottomed out, pressing her hips into the opening of your ' + Descriptors.vaginaDescript( 0 ) + ' her feet slipping over the outer folds as she tries to maintain her balance.   You start rocking back and forth happily, bouncing the faerie up and down.  She moans, cute and barely audible, but sexy in a way that makes your sopping fuckhole even wetter.\n\n', false );
				EngineCore.outputText( 'She orgasms on you, squirting copiously, drenching your ' + Descriptors.clitDescript() + ' and ' + Descriptors.vaginaDescript( 0 ) + ' in clear faerie-fluid.  It tingles, wicking into your button and soaking into your snatch, enhancing every sensation.  You can feel the cool forest air as it flows over your vulva, seeming to stroke you, and without any chance of holding yourself back, you plunge your fingers into your ' + Descriptors.vaginaDescript( 0 ) + ', immediately orgasming from the penetration, not even noticing the exhausted faerie sliding off the large clit and slipping partway into your cunt.\n\n', false );
			}
			//(streeeetch – large) <= 4.5"
			else if( CoC.getInstance().player.clitLength <= 4.5 ) {
				EngineCore.outputText( 'Entranced by the growing ' + Descriptors.clitDescript() + ', the faerie caresses her body, watching your love-button swell up, not stopping until it looks too huge for her tiny frame.  She climbs in a circle around it, awestruck by the size and majesty of your cock-like button.    She looks up at you, aroused but worried, saying, "<i>You\'re so... BIG.  Oh goddess, I want to feel it inside me!</i>"\n\n', false );
				EngineCore.outputText( 'She grabs hold of its slippery surface with both hands and jumps, lifting her lower body up before gravity yanks it back down onto the tip of your ' + Descriptors.clitDescript() + '.  The tip barely slips in, despite the slippery wetness of the faerie.   She screams, though in pleasure or pain you cannot be sure.  You reason that it must be pleasure, because the faerie is wiggling her hips and grabbing hold of the rest of your ' + Descriptors.clitDescript() + ', straining to pull herself further down the fem-cock.  Her belly starts to distort, displaying the cylindrical bulge on her tummy, expanding and contracting slightly as each of your heart-beats works through your clit.\n\n', false );
				EngineCore.outputText( 'In time, she manages to fully impale herself, quivering in orgasm as she gets off from the vibrations your pounding heart sends through your ' + Descriptors.clitDescript() + '.  Her tongue lolls out and her eyes roll back, shut down by the extreme penetration, pain, and pleasure of the act.  You feel her cum soaking into you, sliding down into your slit and making your sensitive slit tingle.  Watching her get off is all it takes to bring you to orgasm with her, and the walls of your ' + Descriptors.vaginaDescript( 0 ) + ' clamp down hungrily, contracting and gushing fluids over the faerie as she lies there, impaled on your crotch like a perverted ornament.\n\n', false );
			}
			//(too big) (else – hump dat shit)
			else {
				EngineCore.outputText( 'Entranced by your swollen ' + Descriptors.clitDescript() + ', the faerie watches it slowly erect, filling with blood like a smooth over-sensitive cock.  She tentatively touches it, gasping and pulling back when it twitches in response.   With a look of awe, she turns to you and says, "<i>There\'s no way I could take this beautiful monster, but I know I can make it feel good!</i>"\n\n', false );
				EngineCore.outputText( 'She jumps onto it, making it bounce in the air as it takes her relatively insubstantial weight.  Embracing it in a full-body hug, she starts grinding on it, smearing her thick faerie juices into the clit and giggling every time you twitch from the feeling.  You squirm, sinking down from the raw sensation, your ' + CoC.getInstance().player.legs() + ' giving out underneath you.   Grabbing hold of a stump, you try to steady yourself, but the faerie humping your ' + Descriptors.clitDescript() + ' is interfering with your motor ability, and you slump into the forest loam, happily twitching as orgasm washes over you.\n\n', false );
				EngineCore.outputText( 'Your ' + Descriptors.clitDescript() + ' jumps, throwing the tiny woman off.  She slips and scrabbles across the surface of your ' + Descriptors.vaginaDescript( 0 ) + ', sliding into your soaking gash.  She\'s squeezed tightly, sloshed around in the wetness of your orgasm.   The faerie\'s eyes cross, as she grows dizzy and battered in the sizzling whirlpool that is your groin.\n\n', false );
			}
		}
		//[OH SHIT ITS OVER, POOR BITCH CRAWLS OUT ALL STONE ON GIRLCUM]
		//[FIRST TIME]
		if( CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFemFuck ) === 1 ) {
			EngineCore.outputText( 'Lying in the forest loam as you recover, you watch as the faerie stumbles out of your groin, holding her head and giggling nonstop.  She tries to put on a serious face but it\'s instantly overpowered by another fit of laughter, "<i>Hehe, did you know I\'d get stoned off your girlcum?  Omigod I\'ve never been this -heheheheheh- high before!  Like I can see EVERYTHING.  Puuhleeeease don\'t make me do this again...</i>"\n\n', false );
			EngineCore.outputText( 'She flies off, hungry and looking for a flower to munch on.', false );
		}
		//[REPEAT LOW]
		else if( CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFemFuck ) <= 5 ) {
			EngineCore.outputText( 'The faerie slowly drags herself out of your ' + Descriptors.vaginaDescript( 0 ) + ', smiling broadly with her eyes dilated wide.  She slips off you, dropping to the ground and giggling, "<i>Everything feels so soft.  Mmmm that was fun!</i>"\n\n', false );
			EngineCore.outputText( 'The little woman spins around happily, proclaiming, "<i>The colors are like, so bright!  Oh gosh, I\'m hungry!  See you and your clit later, just don\'t let me fall in your snatch, it fucks me up so much.  I don\'t think I can handle much more or I\'ll be crawling between your legs every chance I get!</i>"\n\n', false );
			EngineCore.outputText( 'She flits away, calling out, "<i>Bye sweetie!</i>"', false );
		}
		//[SLUTTIN IT UP]
		else {
			EngineCore.outputText( 'The faerie stumbles out of your snatch, giggling and scooping the slippery girl-goo off her body, licking it up.  She crawls up your body to your lips, giving you a cunt-flavored kiss and babbling happily, "<i>Mmm your cunt makes me so warm and giggly!  I\'m so fucking stoned!  Gawddess, I\'m hungry too – I\'m gonna grab some food, and then come back for another dip in your honeypot, ok?</i>"\n\n', false );
			EngineCore.outputText( 'She flits away, a little unsteady and reeking of female sex and desire.', false );
		}
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', -2, 'cor', 0.5 );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	Faerie.prototype.faerieShooAway = function() {
		EngineCore.spriteSelect( 17 );
		EngineCore.outputText( 'You shake your hands, shooing away the tiny faerie.  She\'s clearly been touched by the magics of this land and you want nothing to do with her. With a pouting look, she turns and buzzes away.', true );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	Faerie.prototype.faerieDoNothing = function() {
		EngineCore.spriteSelect( 17 );
		EngineCore.outputText( '', true );
		if( CoC.getInstance().player.nippleLength >= 1 ) {
			EngineCore.outputText( 'She looks you over, stopping at your upper torso and letting out a cry of glee. She lands on your chest, her exposed pussy coming to rest on your nipple. With one hand she grabs hold of you above her head and uses her other hand to guide the rapidly hardening nub between her legs. She sighs in delight as her tight confines squeeze your nipple hard, the feeling somewhere between pinching fingers and suckling lips. You gasp in delight yourself, and you notice she can exercise amazing control with her groin muscles as a rippling feeling courses through your nipple.\n\n', false );
			EngineCore.outputText( 'Your nipple starts to get sloppy and wet as if someone\'s tongue were around it, but it\'s really the faerie\'s love juices dribbling down, some running down your breast and some down her legs. She starts thrusting against you, and you notice her clit getting hard and pushing into your soft flesh. With a free hand you grab the area around your nipple and squeeze it harder, forcing more into her.\n\n', false );
			if( CoC.getInstance().player.biggestLactation() > 1 ) {
				EngineCore.outputText( 'A squirt of milk shoots inside her, making the faerie moan. She looks up at you with lusty, slitted eyes, squeezing her legs together to draw more from you.\n\n', false );
			}
			EngineCore.outputText( 'Eventually you both find a rhythm and soon she\'s moaning loudly.  ', false );
			if( CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( 'With your other hand you start diddling your ' + Descriptors.vaginaDescript( 0 ) + ', adding your own soft moans to hers.  ', false );
			}
			EngineCore.outputText( 'A few blissful moments later, she shudders and you feel her uncontrolled spasms around your nipple.  ', false );
			if( CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( 'You join her shortly after.  ', false );
			}
			EngineCore.outputText( 'The faerie goes limp and spirals to the ground, crashing gently and still twitching in the afterglow. Stepping back carefully, you leave her.', false );
			if( CoC.getInstance().player.biggestLactation() > 1.5 ) {
				EngineCore.outputText( '\n\nA copious gout of your milk escapes her rosy folds.', false );
			}
			CoC.getInstance().player.orgasm();
			EngineCore.dynStats( 'lib', -2 );
			EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
			return;
		}
		if( CoC.getInstance().player.clitLength >= 1.0 && CoC.getInstance().player.clitLength <= 4.5 && CoC.getInstance().player.hasVagina() && Utils.rand( 2 ) === 0 ) {
			EngineCore.outputText( 'A smile crosses her face and she flutters down to your crotch. She starts by scissoring you despite the size difference, driving your clit into her despite its erect state. Compared to her, it looks massive. She swings one leg over it and starts impaling herself on it. Your taut clitoris barely fits inside her, and the tight confines on your sensitive nub are enough to make you weak in the knees. Staggering to the ground, you grab hold of her frail body in your fist and thrust her roughly on your engorged button. She wails in both pain and pleasure, being crushed and stretched open at once. Her cries of pain combined with the intense stimulation on your most sensitive part bring you to a quick orgasm.\n\n', false );
			if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness >= AppearanceDefs.VAGINA_WETNESS_DROOLING ) {
				EngineCore.outputText( 'You drench the poor faerie completely in your female juices, soaking her hair and body. Overwhelmed and spent, you drop her to the ground and catch your breath. She licks up what\'s around her face, but is too weak to do anything else but lie in the dirt.\n\n', false );
			} else {
				EngineCore.outputText( 'Shuddering, you maintain your composure and keep going, trying to ride the high for another. Eventually you look down and you can see the faerie\'s eyes have glazed over and rolled to the back of her head. Her cunt has started clamping down on you a lot harder, evidence of her state of near-constant orgasm. The random clenching brings you off again very quickly and you have an intense orgasm, joining your fae cohort.\n\n', false );
			}
			EngineCore.outputText( 'Time skips a beat and you eventually come down, gently relaxing your grip and disengaging the worn out faerie from your softening female parts. The faerie regains consciousness slowly and thanks you before flying off.', false );
			CoC.getInstance().player.orgasm();
			EngineCore.dynStats( 'lib', -1 );
			EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
			return;
		}
		if( CoC.getInstance().player.clitLength > 4.5 ) {
			EngineCore.outputText( 'The faerie flies close to your ear and speaks in a volume that would be a whisper from another human, "You\'ve got some sexy parts girl, but you\'re too big for me. I hope you find someone to get you off so I can watch." Then she flies in front of you, cutely kisses the bridge of your nose, and flies off.', false );
			EngineCore.dynStats( 'lus', 5 );
			EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
			return;
		}
		EngineCore.outputText( 'The faerie flies close to your nipple and sucks it gingerly.  You pant in pleasure as you feel it pucker tight in her mouth, tingling with her saliva.  She lets it pop free, swollen with arousal.  Her hand flicks it playfully, the sudden sensation fluttering through you as you close your eyes in pleasure.  You recover and find she has flown high into the trees, waving playfully as she escapes.\n\nYou frown and begin to dress yourself, flushing irritably as your nipples protrude further into your clothes than you remember.', false );
		CoC.getInstance().player.nippleLength += 0.25;
		if( CoC.getInstance().player.nippleLength > 3 || CoC.getInstance().player.biggestTitSize() <= 2 ) {
			EngineCore.outputText( '  Thankfully it appears to be temporary.', false );
			CoC.getInstance().player.nippleLength -= 0.25;
		}
		EngineCore.dynStats( 'sen', 1, 'lus', 5 );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
		return;
	};
	//[No] *(let her go)
	Faerie.prototype.letFaerieGo = function() {
		EngineCore.spriteSelect( 17 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You apologize and release her, letting her fly away on gossamer wings.  She thanks you, buzzing up to your lips and planting a chaste kiss on your mouth.  She zips away into the woods without a glance back...', false );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	//[YES] *make her pleasure you
	Faerie.prototype.faerieCaptureHJ = function() {
		EngineCore.spriteSelect( 17 );
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.FaerieFucked ) >= 0 ) {
			CoC.getInstance().player.addStatusValue( StatusAffects.FaerieFucked, 1, 2 );
		} else {
			CoC.getInstance().player.createStatusAffect( StatusAffects.FaerieFucked, 2, 0, 0, 0 );
		}
		EngineCore.outputText( '', true );
		if( CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFucked ) < 15 ) {
			EngineCore.outputText( 'You hold her tightly and scold her, "<i>If you don\'t like hard cocks, you shouldn\'t be dressed up like a such a slut, flying around and teasing me like that.  You should be ashamed of yourself.  Now you\'ve got me all worked up - so you better make it up to me and take care of my little \'problem\'</i>."\n\n', false );
			EngineCore.outputText( 'She looks up at you and gulps before nodding silently, unwilling or unable to resist your command.   ', false );
		}
		EngineCore.outputText( 'You let her loose and she hovers in place, as if pondering her one last chance to escape.  She sighs and looks back up, blushing fiercely as she lands on your hip and gazes down at the bulge of your groin.  You can\'t help but laugh as she slips under your ' + CoC.getInstance().player.armorName + ', crawling across your sensitive thigh towards your ' + Descriptors.multiCockDescriptLight() + '.\n\n', false );
		//Taurs get a special scene!
		if( CoC.getInstance().player.isTaur() ) {
			EngineCore.outputText( 'The tiny Faerie climbs on top of your ' + Descriptors.cockDescript( 0 ), false );
			if( CoC.getInstance().player.cockTotal() > 0 ) {
				EngineCore.outputText( 'largest ' + Appearance.cockNoun( CockTypesEnum.HUMAN ), false );
			}
			EngineCore.outputText( ' and crawls about on it for a while, getting used to its shape and taking in deep lungfuls of its musky odor. She wraps herself around you and begins rubbing herself up and down your hard length. As she moves around her tiny slit leaks cum in long streaks, teasing you with a cunt you can\'t penetrate. Pre begins to leak steadily from your tip as the faerie continues to work her way around, moaning quietly and betraying her inner desire.\n\n', false );
			EngineCore.outputText( 'Your body begins to naturally jerk forward and backward, attempting to hump the mare that isn\'t there. You can feel the faerie sliding about until she clenches onto you tighter, which only serves to make you hump harder. Realizing her mistake too late, she attempts to loosen herself, but your wild bucking sends her flying forward.\n\n', false );
			EngineCore.outputText( 'She smashes onto the end of your ' + Descriptors.multiCockDescriptLight() + ' and grasps at it. Her face crushes into your urethra as her tiny legs wrap themselves around the tip. Your wildly flailing cock starts to grow larger as your orgasm approaches, but the faerie doesn\'t notice as she happily drinks up your pre.\n\n', false );
			//[No testicles:
			if( CoC.getInstance().player.balls === 0 ) {
				EngineCore.outputText( 'Your tiny globules of semen go straight into her open mouth and she sucks them down gleefully before falling with a splat onto the pre soaked ground.\n\n', false );
			} else {
				//[Small amount of cum:
				if( CoC.getInstance().player.cumQ() < 50 ) {
					EngineCore.outputText( 'Your semen splashes straight into her face and she\'s quick to suck it up. She falls with a splat onto the pre soaked ground while your member drips periodic droplets of cum onto her head.\n\n', false );
				}//[Normal amount of cum:
				else if( CoC.getInstance().player.cumQ() < 200 ) {
					EngineCore.outputText( 'Your semen washes into her face and she loses her grip on your ' + Descriptors.multiCockDescriptLight() + '. She falls with a splat onto the pre soaked ground and you spray her with periodic spurts of fresh cum.\n\n', false );
				}//[Huge amount of cum:
				else {
					EngineCore.outputText( 'Your semen collides with her face and she is propelled off of your cock onto the pre soaked ground. Your ' + Descriptors.ballsDescriptLight() + ' continue pumping out cum like a hose until she\'s almost swimming in it.\n\n', false );
				}
			}
			CoC.getInstance().player.orgasm();
			EngineCore.dynStats( 'lib', -0.5 );
			//Epilogue!
			if( CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFucked ) < 10 ) {
				EngineCore.outputText( 'The faerie burps and giggles again before glaring up at you, accusing you with a mildly unfocused glare and asking, "<i>Did you know we get drunk on cum?  Caushe I TRY SO HARRD not to get meshed up like this.</i>"\n\n', false );
			} else if( CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFucked ) < 15 ) {
				EngineCore.outputText( 'The faerie burps and laughs drunkenly, patting the side of your ' + CoC.getInstance().player.leg() + ' and slurring, "<i>Oh by Marae\'s ripe titsh!  I needed that.  Do you thhink you could catsch me again?  I love feeling your cum coating my body.</i>"\n\n', false );
			} else {
				EngineCore.outputText( 'The faerie burps and begins openly masturbating, panting and slurring happily, "<i>Yush I-gasp-uh feel great!  MMMmmmhm, it makesh my twat so sensitive.  I\'m gonna fly home and schtuff it full, then play with my clit till I fall ashleep!</i>"\n\n', false );
			}
			if( CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFucked ) < 15 ) {
				EngineCore.outputText( 'She licks her fingers and rolls around laughing, "<i>Hehe, who caresh!  I\'m happy! WHEEEEE!</i>"\n\n', false );
			}
			EngineCore.outputText( 'The faerie takes off, still dripping, and flying in something less than a straight line...', false );
		}
		//Non-taurs
		else {
			EngineCore.outputText( 'The faerie reaches your swollen member and ', false );
			if( CoC.getInstance().player.hasKnot( 0 ) ) {
				EngineCore.outputText( 'climbs atop your knot, wrapping her legs around the narrower shaft to hold on.  You can feel her cheeks resting atop the \'bulb\' of your canine anatomy, teasing you with feminine features you\'re far too large to penetrate.  ', false );
			} else if( CoC.getInstance().player.cocks[ 0 ].cockType === CockTypesEnum.HORSE ) {
				EngineCore.outputText( 'climbs atop your ' + Descriptors.cockDescript( 0 ) + ', hanging onto your ring of prepuce and wrapping her legs as far around your horse-like maleness as she can.  ', false );
			} else if( CoC.getInstance().player.cocks[ 0 ].cockType === CockTypesEnum.DEMON ) {
				EngineCore.outputText( 'climbs atop your ' + Descriptors.cockDescript( 0 ) + ', hanging on to the corrupted nubs and nodules as she threads her legs between them, squeezing you tightly as she hangs on.  You can feel her wet gash sitting atop a particularly sensitive bump, teasing you with a tiny cunt you\'ll never be able to penetrate.  ', false );
			} else if( CoC.getInstance().player.cocks[ 0 ].cockType === CockTypesEnum.TENTACLE ) {
				EngineCore.outputText( 'climbs onto your squirming ' + Descriptors.cockDescript( 0 ) + ', wrapping her legs tightly around it as it wiggles and writhes with excitement.  Unbidden, it curls around and rubs its reddish-purple head against her face like an animal.  She gives it a gentle squeeze and licks it.  ', false );
			} else {
				EngineCore.outputText( 'climbs on to your hardness, wrapping her legs tightly around it as she secures a perch against you.   You can feel her wet gash rubbing against your sensitive skin, teasing you with a tiny cunt you\'ll never be able to penetrate.  ', false );
			}
			EngineCore.outputText( 'Your internal muscles clench unconsciously, squeezing out a dollop of pre that rolls down into the faerie\'s hair, soaking her head and face.  You can\'t see her reaction, but you can feel it oozing between her body and you, lubricating her as she humps and rubs against you.  Tiny muffled moans escape your ' + CoC.getInstance().player.armorName + ', indicating that some part of her is enjoying the task.\n\n', false );
			EngineCore.outputText( 'Though she can only stimulate a few inches of you at a time, it feels really good – better than it should, and a budding warmth on the edge of release builds inside you.  Too late you realize you should have gotten at least partially undressed.  You cum before you can do anything about it, splattering your ' + CoC.getInstance().player.armorName + ' with seed and leaving a wet patch on the crotch.  You can feel it dripping back onto you and the faerie as more spunk squirts out, soaking the tiny girl in spooge as the wet spot grows.  ', false );
			if( CoC.getInstance().player.cumQ() > 250 ) {
				EngineCore.outputText( 'You cum uncontrollably, regretting your fertility as your body paints the inside of your ' + CoC.getInstance().player.armorName + ' with goopy whiteness.  ', false );
				if( CoC.getInstance().player.cumQ() > 500 ) {
					EngineCore.outputText( 'The proof of your release forms a puddle around you as your legs give out and y', false );
				} else {
					EngineCore.outputText( 'Falling backwards as your legs give out, y', false );
				}
			} else {
				EngineCore.outputText( 'Y', false );
			}
			EngineCore.outputText( 'ou watch your wet groin squirm as the faerie finishes releasing your built-up tension and crawls out.  She\'s covered from head to toe in sloppy white jism, and is noisily slurping it up.\n\n', false );
			EngineCore.outputText( 'She rolls off of you, staggers, and plops down on her cute little ass next to you', false );
			if( CoC.getInstance().player.cumQ() > 500 ) {
				EngineCore.outputText( ' in the cum', false );
			}
			EngineCore.outputText( ', giggling drunkenly.  ', false );
			if( CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFucked ) < 10 ) {
				EngineCore.outputText( 'The faerie burps and giggles again before glaring up at you, accusing you with a mildly unfocused glare and asking, "<i>Did you know we get drunk on cum?  Caushe I TRY SO HARRD not to get meshed up like this.</i>"\n\n', false );
			} else if( CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFucked ) < 15 ) {
				EngineCore.outputText( 'The faerie burps and laughs drunkenly, patting the side of your ' + CoC.getInstance().player.leg() + ' and slurring, "<i>Oh by Marae\'s ripe titsh!  I needed that.  Do you thhink you could catsch me again?  I love feeling your cum coating my body.</i>"\n\n', false );
			} else {
				EngineCore.outputText( 'The faerie burps and begins openly masturbating, panting and slurring happily, "<i>Yush I-gasp-uh feel great!  MMMmmmhm, it makesh my twat so sensitive.  I\'m gonna fly home and schtuff it full, then play with my clit till I fall ashleep!</i>"\n\n', false );
			}
			if( CoC.getInstance().player.statusAffectv1( StatusAffects.FaerieFucked ) < 15 ) {
				EngineCore.outputText( 'She licks her fingers and rolls around laughing, "<i>Hehe, who caresh!  I\'m happy! WHEEEEE!</i>"\n\n', false );
			}
			EngineCore.outputText( 'The faerie takes off, still dripping, and flying in something less than a straight line...', false );
			CoC.getInstance().player.orgasm();
			EngineCore.dynStats( 'lib', -0.5 );
			if( CoC.getInstance().player.findStatusAffect( StatusAffects.Jizzpants ) < 0 ) {
				CoC.getInstance().player.createStatusAffect( StatusAffects.Jizzpants, 1, 0, 0, 0 );
			}
		}
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	CoC.getInstance().registerScene( 'faerie', new Faerie() );
} );