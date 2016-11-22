'use strict';

angular.module( 'cocjs' ).run( function( ArmorLib, $log, CockTypesEnum, Combat, PerkLib, $rootScope, Descriptors, AppearanceDefs, EventParser, CoC, kFLAGS, Utils, StatusAffects, EngineCore ) {
	//EXGARTUAN STATUS;
	//v1 - Location - 1 = dick, 2 = tits;
	//v2 - Sleep counter - 0 = awake, positive numbers = hours of sleep;
	//const EXGARTUAN_TIGHTPANTS_MASTURBATE_COUNT:int = 413;;
	//const BOOBGARTUAN_SURPRISE_COUNT:int = 414;;
	/*function exgartuanMasturbate() {
	 */
	//Dick(s);
	//Tits;
	//Big ol' booties?;
	//Clits?;
	//Demonic fountain in desert;
	//300 xp;
	//1/40 chance of encountering fountain. It does not appear while possessed.;
	//When drank from, rewards 300 xp, a sizable random growth, and either boosts minimum lust by 5 or gives demonic possession.  ;
	/*Possession details body part once a week (if possible)
	 -Dick
	 **Increases lust if not paid attention to (masturbation w/special scene)
	 ***Goes to 'sleep' for 4-5 hours after being played with.
	 **More susceptible to female enemies - +lust every round.
	 **Taunts male foes, reducing their lust
	 **bulge-displaying armor shift
	 --"Hours since cum" raises at 3x rate.
	 **Removes worm infections
	 **Uses magic on goblins to make their cunts stretchier.
	 **Fetish Cultists gain lust every round from dick magic
	 **Sandwitches are interrupted when they ask if they can cast a spell on you.
	 **Turns it into a demon-dick.
	 **Forces you to try to rape bee girls

	 -Tits
	 --Randomly stops and starts lactating in various amounts
	 --Taunts your male foes, randomly increasing their lust.
	 --Random chance of raising your lust against any enemy.
	 --Smacktalks the shit out of bee-girls.
	 --Uses magic on succubi to make their tits bigger and decrease their speed.
	 --Forces minotaur titfucking scene.
	 --Kelt titfucking?
	 --New Breast-focused masturbation scene
	 --Random lust increases when time passes, combined with more growth.
	 */
	function Exgartuan() {
		$rootScope.$on( 'time-change', this.timeChange );
		$rootScope.$on( 'time-change-large', this.timeChangeLarge );
		this.checkedExgartuan = 0;
	}

	//Implementation of TimeAwareInterface;
	Exgartuan.prototype.timeChange = function() {
		var needNext = false;
		this.checkedExgartuan = 0; //Make sure we test just once in timeChangeLarge
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.Exgartuan ) >= 0 ) { //Update Exgartuan stuff
			$log.debug( 'EXGARTUAN V1: ' + CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) + ' V2: ' + CoC.getInstance().player.statusAffectv2( StatusAffects.Exgartuan ) );
			if( CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 1 && (!CoC.getInstance().player.hasCock() || CoC.getInstance().player.cockArea( 0 ) < 100) ) { //If too small dick, remove him
				EngineCore.outputText( '\n<b>You suddenly feel the urge to urinate, and stop over by some bushes.  It takes wayyyy longer than normal, and once you\'ve finished, you realize you\'re alone with yourself for the first time in a long time.  Perhaps you got too small for Exgartuan to handle?</b>\n' );
				CoC.getInstance().player.removeStatusAffect( StatusAffects.Exgartuan );
				needNext = true;
			} else if( CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 2 && CoC.getInstance().player.biggestTitSize() < 12 ) { //Tit removal
				EngineCore.outputText( '\n<b>Black milk dribbles from your ' + Descriptors.nippleDescript( 0 ) + '.  It immediately dissipates into the air, leaving you feeling alone.  It looks like you became too small for Exgartuan!\n</b>' );
				CoC.getInstance().player.removeStatusAffect( StatusAffects.Exgartuan );
				needNext = true;
			} else {
				if( CoC.getInstance().player.statusAffectv2( StatusAffects.Exgartuan ) > 0 ) { //if sleeping, decrement sleep timer.
					CoC.getInstance().player.addStatusValue( StatusAffects.Exgartuan, 2, -1 );
					if( CoC.getInstance().player.statusAffectv2( StatusAffects.Exgartuan ) === 0 ) { //The demon awakens!
						EngineCore.outputText( '\n<b>' );
						this.exgartuanBored();
						EngineCore.outputText( '</b>\n' );
						needNext = true;
					}
				} else {
					{ //If not sleeping, stuff happens!
					}
					if( CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 1 ) { //Dude stuff
						if( CoC.getInstance().player.findStatusAffect( StatusAffects.Infested ) >= 0 ) {
							EngineCore.outputText( '\n<b>' );
							this.exgartuanWormCure();
							EngineCore.outputText( '</b>\n' );
							needNext = true;
						} else if( Utils.rand( 10 ) === 0 && CoC.getInstance().player.armor.supportsBulge ) {
							/* Old way of doing it.
							 (armorName === 'sexy black chitin armor-plating' ||
							 armorName === 'glistening gel-armor plates' ||
							 CoC.getInstance().player.armorName === 'leather armor segments' ||
							 CoC.getInstance().player.armorName === 'comfortable clothes' ||
							 CoC.getInstance().player.armorName === 'bondage patient clothes' ||
							 CoC.getInstance().player.armorName === 'crotch-revealing clothes' ||
							 CoC.getInstance().player.armorName === 'cute servant\'s clothes' ||
							 CoC.getInstance().player.armorName === 'maid\'s clothes' ||
							 CoC.getInstance().player.armorName === 'servant\'s clothes' ||
							 CoC.getInstance().player.armorName === 'maid\'s clothes' ||
							 CoC.getInstance().player.armorName === 'practically indecent steel armor' ||
							 CoC.getInstance().player.armorName === 'red, high-society bodysuit' ||
							 CoC.getInstance().player.armorName === 'spider-silk armor' ||
							 CoC.getInstance().player.armorName === 'slutty swimwear' ||
							 CoC.getInstance().player.armorName === 'full-body chainmail' ||
							 CoC.getInstance().player.armorName === 'revealing chainmail bikini' ||
							 CoC.getInstance().player.armorName === 'full platemail' ||
							 CoC.getInstance().player.armorName === 'scale-mail armor' ||
							 CoC.getInstance().player.armorName === 'black leather armor surrounded by voluminous robes' ||
							 CoC.getInstance().player.armorName === 'rubber fetish clothes' ||
							 CoC.getInstance().player.armorName === 'green adventurer\'s clothes' ||
							 CoC.getInstance().player.armorName === 'white shirt and overalls')) {
							 */
							EngineCore.outputText( '\n<b>' );
							this.exgartuanArmorShift();
							EngineCore.outputText( '</b>\n' );
							needNext = true;
						} else {
							EngineCore.dynStats( 'lus', 1 + Utils.rand( 2 ) );
						}
					}
					if( CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 2 && CoC.getInstance().player.biggestTitSize() >= 12 ) { //Chick stuff
						if( CoC.getInstance().time.hours % 9 === 0 ) {
							{ //Only once every 9 hours or so.
							}
							if( Utils.rand( 3 ) === 0 ) { //lactation messing with!
								EngineCore.outputText( '\n<b>' );
								this.exgartuanLactationAdjustment();
								EngineCore.outputText( '</b>\n' );
								needNext = true;
							} else if( Utils.rand( 3 ) === 0 ) {
								EngineCore.outputText( '\n<b>' );
								if( Utils.rand( 2 ) === 0 ) {
									EngineCore.outputText( 'You feel warm and tingly, good all over.  Wait a second, your hands are playing with your ' + Descriptors.breastDescript( 0 ) + '.  You yank your hands away, but it only makes Exgartuan laugh with demonic pleasure!' );
								} else {
									EngineCore.outputText( 'Your hands knead and caress your ' + Descriptors.breastDescript( 0 ) + ', eagerly touching every inch of soft flesh.  You gasp when you realize what you\'re doing and pull them away' );
									if( CoC.getInstance().player.cor < 50 ) {
										EngineCore.outputText( ', angry at yourself for falling prey to the demon\'s directions' );
									}
									EngineCore.outputText( '.' );
									EngineCore.dynStats( 'lus', 5 + CoC.getInstance().player.sens / 10 );
								}
								EngineCore.outputText( '</b>\n' );
								needNext = true;
							} else {
								EngineCore.dynStats( 'lus', 1 + Utils.rand( 2 ) );
							}
						}
					}
				}
			}
		}
		return needNext;
	};
	Exgartuan.prototype.timeChangeLarge = function() {
		if( this.checkedExgartuan++ === 0 && CoC.getInstance().player.findStatusAffect( StatusAffects.Exgartuan ) >= 0 && CoC.getInstance().player.statusAffectv2( StatusAffects.Exgartuan ) === 0 && CoC.getInstance().time.hours === 4 ) {
			//Exgartuan must be present, must be awake and it must be night time;
			if( CoC.getInstance().player.hasCock() && CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 1 && Utils.rand( 3 ) === 0 && CoC.getInstance().player.hoursSinceCum >= 24 ) { //Exgartuan night time surprise!
				EngineCore.outputText( '\n' );
				this.exgartuanSleepSurprise();
				return true;
			}
			if( CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 2 && Utils.rand( 3 ) === 0 ) { //Boobgartuan night time surprise!
				EngineCore.outputText( '\n' );
				this.boobGartuanSURPRISE();
				return true;
			}
		}
		return false;
	};
	//End of Interface Implementation;
	Exgartuan.prototype.fountainEncounter = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'While roaming the shifting sands of the desert, you begin to feel a change in the air.  The bone-dry atmosphere shifts, becoming more and more humid as you press on.  At last you crest a dune and discover the source of the moisture – a huge onyx fountain, spraying crystal clear water into the air.  The center of the fountain is a magnificent sculpture of two entwined demonic forms, nude and over-proportioned to the extreme.  The water is spraying out from some rather... unconventional places.  You blush, feeling a bit parched, but wary of the fountain\'s nature.\n\n', false );
		EngineCore.outputText( 'You come closer and discover a placard.  It reads, "Fountain of Endowment".  Well, clearly it\'s supposed to enhance something, but at what cost?\n\n', false );
		EngineCore.outputText( 'Do you drink from the fountain?', false );
		//[Yes] [No];
		EngineCore.doYesNo( this.drinkFountainEndowment, CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	Exgartuan.prototype.drinkFountainEndowment = function() {
		EngineCore.outputText( '', true );
		var changed = false;
		CoC.getInstance().player.slimeFeed();
		EngineCore.outputText( 'You cup your hands and bring the clear water to your lips, taking a long drink.  It\'s cool and refreshing, going down quite easily.  Weird.  You thought it would make you feel different somehow.', false );
		//+300 xp):;
		if( Utils.rand( 5 ) === 0 ) {
			EngineCore.outputText( '\n\nA sense of... wisdom and clear-headedness emerges, making you feel far more sure of yourself.', false );
			CoC.getInstance().player.XP += 200;
			changed = true;
		}
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.Exgartuan ) < 0 && !changed && Utils.rand( 2 ) === 0 ) {
			var choices = 0;
			if( CoC.getInstance().player.cockTotal() > 0 ) {
				if( CoC.getInstance().player.cockArea( 0 ) >= 100 ) {
					choices++;
				}
			}
			if( CoC.getInstance().player.biggestTitSize() >= 12 ) {
				choices++;
			}
			//Can you be infested?;
			if( EngineCore.choices > 0 ) {
				if( EngineCore.choices > 1 ) {
					//Randomly pick one;
					if( Utils.rand( 2 ) === 0 ) {
						this.exgartuanInfestDick();
					} else {
						this.exgartuanInfestTits();
					}
				}
				if( EngineCore.choices === 1 ) {
					//If tits are big enough it must be them;
					if( CoC.getInstance().player.biggestTitSize() >= 12 ) {
						this.exgartuanInfestTits();
					}
					//If not then the dick was eligable.;
					else {
						this.exgartuanInfestDick();
					}
				}
				changed = true;
			}
		}
		//(+Big Tits);
		if( Utils.rand( 3 ) === 0 && CoC.getInstance().player.biggestTitSize() > 1 ) {
			EngineCore.outputText( '\n\nYour ' + Descriptors.allBreastsDescript() + ' balloon, each growing about four bra-sizes larger... they feel so... jiggly and sensitive.  Even your nipples seem to grow with them!  Your ' + CoC.getInstance().player.armorName + ' feels tighter than ever!', false );
			CoC.getInstance().player.nippleLength += 0.3;
			_.forEach( CoC.getInstance().player.breastRows, function( breastRow ) {
				breastRow.breastRating += 4;
			} );
			changed = true;
		}
		//(+Big dick);
		if( Utils.rand( 3 ) === 0 && CoC.getInstance().player.totalCocks() > 0 ) {
			EngineCore.outputText( '\n\nYour ' + Descriptors.multiCockDescriptLight() + ' feels tighter inside your ' + CoC.getInstance().player.armorName + ', even when flaccid.  You shudder and realize you\'ve probably gained more than a few inches in total length, and who knows how your thickness has changed.', false );
			_.forEach( CoC.getInstance().player.cocks, function( cock ) {
				cock.cockLength += 3;
				cock.cockThickness += 0.3;
			} );
			changed = true;
		}
		//(+Big Clit);
		if( Utils.rand( 4 ) === 0 && CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '\n\nYour ' + Descriptors.clitDescript() + ' plumps up, visibly parting your lips even when you aren\'t turned on.  It probably ', false );
			CoC.getInstance().player.clitLength += 2;
			if( CoC.getInstance().player.clitLength < 6 ) {
				EngineCore.outputText( 'gets as big as a cock', false );
			} else {
				EngineCore.outputText( 'gets bigger than most cocks', false );
			}
			EngineCore.outputText( ' now!', false );
			changed = true;
		}
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	Exgartuan.prototype.exgartuanInfestDick = function() {
		EngineCore.spriteSelect( 15 );
		//(+Demon dick possession – not demoncocked);
		if( CoC.getInstance().player.cocks[ 0 ].cockType !== CockTypesEnum.DEMON ) {
			EngineCore.outputText( '\n\nYour ' + Descriptors.cockDescript( 0 ) + ' puffs up, getting longer and harder, but also distorting as bumps and nodules sprout all along its surface.  The coloration darkens, turning a very dark purple as a ring of bigger nodules grow out around the head.  You now have a much larger and far more corrupted dick!   It dribbles pre-cum and twitches about as if sniffing the air, feeling very warm and sensitive.', false );
			EngineCore.outputText( '\n\nA voice suddenly splits the air, demanding, "<i>Satiate me mortal, or I\'ll make you find someone who will!</i>"', false );
			EngineCore.outputText( '\n\nWhat the hell was that?  You look around, but cannot find the source of the voice.  It speaks again, "<i>Down here.  What are you, deaf!?</i>"', false );
			EngineCore.outputText( '\n\nYou look down, and find your demonic cock pointing directly at you, and shaking with... indignation?  The ground hits your ' + Descriptors.buttDescript() + ' hard as you fall backwards, too surprised to maintain your footing.  Is your dick talking to you?', false );
			EngineCore.outputText( '\n\n"<i>Yes I am.  You should consider yourself lucky – you\'re now the host of the great demon Exgartuan, and you\'d best please me every few hours, or I\'ll make sure your body finds someone to relieve my building pressure.  But I think you\'ll do fine.  Come now, I can see a wonderful camp in your mind that we can paint white,</i>" it suggests.', false );
			EngineCore.outputText( '\n\nWell now... this was certainly unexpected.  Perhaps there\'s a way to be rid of this thing?', false );
			EngineCore.dynStats( 'lib', 5, 'lus', 10, 'cor', 10 );
			CoC.getInstance().player.cocks[ 0 ].cockType = CockTypesEnum.DEMON;
			CoC.getInstance().player.cocks[ 0 ].cockLength += 1;
			CoC.getInstance().player.cocks[ 0 ].cockThickness += 0.5;
		}
		//(+Demon dick possession – not demondicked);
		else {
			EngineCore.outputText( '\n\nYour ' + Descriptors.cockDescript( 0 ) + ' puffs up, growing even larger as it absorbs the fountain\'s essence.  It dribbles pre-cum and twitches about as if sniffing the air, feeling very warm and sensitive.', false );
			EngineCore.outputText( '\n\nA voice suddenly splits the air, demanding, "<i>Satiate me mortal, or I\'ll make you find someone who will!</i>"', false );
			EngineCore.outputText( '\n\nWhat the hell was that?  You look around, but cannot find the source of the voice.  It speaks again, "<i>Down here.  What are you, deaf!?</i>"', false );
			EngineCore.outputText( '\n\nYou look down, and find your demonic cock pointing directly at you, and shaking with... indignation?  The ground hits your ' + Descriptors.buttDescript() + ' hard as you fall backwards, too surprised to maintain your footing.  Is your dick talking to you?', false );
			EngineCore.outputText( '\n\n"<i>Yes I am.  You should consider yourself lucky – you\'re now the host of the great demon Exgartuan, and you\'d best please me every few hours, or I\'ll make sure your body finds someone to relieve my building pressure.  But I think you\'ll do fine.  Come now, I can see a wonderful camp in your mind that we can paint white,</i>" it suggests.', false );
			EngineCore.outputText( '\n\nWell now... this was certainly unexpected.  Perhaps there\'s a way to be rid of this thing?', false );
			CoC.getInstance().player.cocks[ 0 ].cockLength += 1;
			CoC.getInstance().player.cocks[ 0 ].cockThickness += 0.5;
		}
		CoC.getInstance().player.createStatusAffect( StatusAffects.Exgartuan, 1, 0, 0, 0 );
	};
	Exgartuan.prototype.exgartuanInfestTits = function() {
		EngineCore.outputText( '\n\nYour ' + Descriptors.allBreastsDescript() + ' jiggle as they grow MUCH larger, turning into obscene mounds that shake with every motion of your body.  All your ' + Descriptors.nippleDescript( 0 ) + 's puff up with them, gaining volume to match their new, larger homes.  They feel hot and ache to be touched.', false );
		_.forEach( CoC.getInstance().player.breastRows, function( breastRow ) {
			breastRow.breastRating += 7;
		} );
		EngineCore.outputText( '\n\nA voice suddenly splits the air, demanding, "<i>Touch me mortal, or be stained!</i>"', false );
		EngineCore.outputText( '\n\nYou look about in confusion, trying to locate the source of the voice.', false );
		EngineCore.outputText( '\n\n"<i>Oh for fuck\'s sake.  Look down.  Further... further... yes, right there on your chest.  BEHOLD!  The great archdemon, Exgartuan - inhabitor of excess!  I\'ve taken up residence in your dainty bosom, and you had best work hard to keep me pleased, or I shall stain your clothes and soak you with my mighty milk!</i>"', false );
		EngineCore.outputText( '\n\nThe ground hits your ' + Descriptors.buttDescript() + ' hard as you fall backwards, too surprised to maintain your footing.  Are your breasts really talking to you?', false );
		EngineCore.outputText( '\n\n"<i>Yes I am,</i>" mutters Exgartuan, spurting a trickle of milk from your ' + Descriptors.nippleDescript( 0 ) + 's for emphasis, "<i>and you had better take me back to that lovely camp I can see in your memories and give me a nice long massage.</i>"', false );
		EngineCore.outputText( '\n\nWell now... this was certainly unexpected.  Perhaps there\'s a way to be rid of this thing?', false );
		CoC.getInstance().player.createStatusAffect( StatusAffects.Exgartuan, 2, 0, 0, 0 );
	};

	//[Masturbate while he's awake in dick];
	Exgartuan.prototype.exgartuanMasturbation = function() {
		EngineCore.outputText( '', true );
		if( CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 1 ) {
			EngineCore.spriteSelect( 15 );
			//Early prep;
			if( CoC.getInstance().player.cor < 15 ) {
				EngineCore.outputText( 'You sheepishly find some rocks to hide in, where you remove your clothes.  Exgartuan loudly grumbles, "<i>Quit fucking around and hiding.  I WANT someone to walk in on this!</i>"\n\nDisgusting...\n\n', false );
			}
			if( CoC.getInstance().player.cor >= 15 && CoC.getInstance().player.cor < 30 ) {
				EngineCore.outputText( 'You make sure you are alone and strip naked.  Exgartuan mutters, "<i>Why did you wait until you were alone?  Wouldn\'t it be fun to have a succubus wander in on us?</i>"\n\n', false );
			}
			if( CoC.getInstance().player.cor >= 30 && CoC.getInstance().player.cor < 60 ) {
				EngineCore.outputText( 'You happily remove your ' + CoC.getInstance().player.armorName + ', eager to pleasure yourself.  Your possessed ' + Descriptors.cockDescript( 0 ) + ' throbbs happily.\n\n', false );
			}
			if( CoC.getInstance().player.cor >= 60 && CoC.getInstance().player.cor < 80 ) {
				EngineCore.outputText( 'You strip naked in an exaggerated fashion, hoping someone might be watching.  The demon-possessed member at your groin pulses happily, flooding you with lust in reward for your attitude.\n\n', false );
			}
			if( CoC.getInstance().player.cor >= 80 ) {
				EngineCore.outputText( 'You strip naked, fondling your naughty bits as you do so and casting seductive looks around, hoping someone or something is nearby to fuck you.  Your possessed member wiggles happily, flooding your body with feelings of lust and desire in reward.  Maybe it can call in a demonic companion for you?\n\n', false );
			}
			//Low corruption characters;
			if( CoC.getInstance().player.cor < 33 ) {
				EngineCore.outputText( 'Too tired to resist the demon in your dick any longer, you grab it with both hands, lifting up the hefty dick with both hands as it floods with blood, swollen and purple.  Your whole body flushes, reacting to the strong feelings this... demon forces through you.  It makes your whole body blush with shame, but you force yourself to continue taking care of this abomination.  It really does feel good – you can see how some of the denizens of this land would fall to such sensation.  But you\'re made of sterner stuff!  At least that\'s what you assure yourself as your hands continue to lovingly caress the source of your pleasure.\n\n', false );
				EngineCore.outputText( 'You sigh, squeezing out thick globs of pre-cum as you fondle the nodule-ringed crown of your ' + Descriptors.cockDescript( 0 ) + ', twitching happily against your hands.  Oh gods it feels too good to be true.  Happy coos of pleasure escape your mouth as you try to endure your lewd actions.  You struggle against your possessed loins as they guide your fingertips over the most sensitive places, temporarily stealing away control of your limbs.', false );
				if( CoC.getInstance().player.tentacleCocks() > 0 ) {
					EngineCore.outputText( '  A tentacle-cock curls up, tightening around the base like an organic cock-ring.  It makes each of the corrupt nodules grow bigger, harder, and even more sensitive.', false );
				}
				EngineCore.outputText( '\n\nThe demon\'s voice teases you, "<i>Such a pure champion, rolling in the dirt and moaning like a whore.  Do you really think you\'re saving anyone like that?  You can\'t even keep your own hands off your tainted dick!</i>"\n\n', false );
				EngineCore.outputText( '"<i>No, it\'s not like that!</i>" you yell, while pumping away, reveling in the feeling of your hands sliding up and down your pre-cum-soaked shaft.  Tiny moans interrupt your denial, punctuating it with short sharp moans of pleasure.\n\n', false );
				EngineCore.outputText( '"<i>Oh, you\'re already giving in to me?  I can feel the cum boiling in your ', false );
				if( CoC.getInstance().player.balls > 0 ) {
					EngineCore.outputText( Descriptors.ballsDescriptLight(), false );
				} else {
					EngineCore.outputText( 'loins', false );
				}
				EngineCore.outputText( ', just aching to squirt out.  Relax and enjoy the feelings.  The more you accept it, the better it will feel.  Just give in and cum, I want to watch it splatter your face,</i>" taunts your demon-dick.\n\n', false );
				EngineCore.outputText( 'There\'s no use fighting, it feels too good.  Your tongue hangs out of your mouth as you break under the assault, caving in to your physical needs.  The tip of your ' + Descriptors.cockDescript( 0 ) + ' flares wide, pumping thick globules of seed through your urethra while your lower body squirms and writhes happily.  Your shame bubbles and splatters up into your face, painting it in thick gobs of goopy whiteness.  You wonder if the demon is right as some gets on your tongue, forcing you to sample a taste.  Somehow, you like it?  You moan in confusion – you shouldn\'t be enjoying this, but your body doesn\'t relent until it\'s given you a thorough coating.\n\n', false );
				EngineCore.outputText( 'Now sated, Exgartuan deflates, not even bothering to taunt you while you try to clean up the goop now splattered over your upper body.', false );
			}
			//Medium corruption characters;
			else if( CoC.getInstance().player.cor < 66 ) {
				EngineCore.outputText( 'Unable to handle the artificial lust the demon living in your crotch forces upon you, you grab hold of the monster with both hands, shivering at how good it feels.  Nothing should ever feel this good, but while it does, you may as well enjoy it, right?  Your body reddens as you really start to enjoy the feelings, as your hands caress every nodule-covered inch of your ' + Descriptors.cockDescript( 0 ) + '.  On one hand, you can\'t believe the pleasure you\'re feeling, but on the other you feel like you should be doing more to resist it.  Oh well, too late now...\n\n', false );
				EngineCore.outputText( 'You squeeze out a few thick dollops of pre-cum, slicking the ' + Descriptors.cockDescript( 0 ) + ' with the copious slippery stuff it drools out.  It never put out quite this much before, perhaps the demon Exgartuan is responsible.  You gasp when your hands squeeze the lubricated shaft between them, tightly jacking up and down, heedless of your desires and acting as slaves to the demon\'s needs.  You\'re feeling more and more like a passenger in your own body, but you really don\'t mind.  It\'s so easy to just relax and enjoy the hotness welling up inside you.\n\n', false );
				EngineCore.outputText( 'The demon speaks up, teasing you, "<i>Already caving in to my corruption slut?  Are you truly so happy to let a demon control your body so lewdly?  Shouldn\'t you at least try to pretend not to be pleased by acting like such a wanton whore?</i>"\n\n', false );
				EngineCore.outputText( 'His words ring true, but in your heart of hearts you know you\'re no slave to his corruption.  It\'s just that right now it feels so good; you love the sensation of both hands sliding up and down your cock, stroking and fondling each sensitive nub.  The flow of pre-cum thickens, practically pooling on your belly while your slippery fingers ', false );
				if( CoC.getInstance().player.biggestTitSize() >= 5 ) {
					EngineCore.outputText( 'shove the bloated demon between your ' + Descriptors.allBreastsDescript() + ', surrounding it in a home of jiggling flesh.  The wet demon-pre soaks into the skin of your tits, lubricating the passage as you mash them around, vigorously tit-fucking the source of your unholy desires.', false );
				} else {
					EngineCore.outputText( 'work the shaft relentlessly, drawing out more and more of the demon\'s pre-seed until your forearms and upper thighs are coated in the stuff, shining darkly.', false );
				}
				EngineCore.outputText( '  You pant and moan, forced to feel such wonderfully obscene sensations.\n\n', false );
				EngineCore.outputText( '"<i>You should look at yourself, panting and moaning like a rutting animal.  I wonder, are you still a champion  or a slave to the things I\'m doing to you?  You look like a sex slave, but are you truly addicted to the feeling of squirting thick demonic jism?  Such a slutty champion you\'ve become, ' + CoC.getInstance().player.short + ',</i>" taunts Exgartuan.  Part of you wants to object, to shout down his suggestions, but every time you open your mouth the only sound to escape is a wanton moan.\n\n', false );
				EngineCore.outputText( 'Your orgasm spreads through the demon like a wave.  You briefly wonder if it\'s the demon causing this to feel so good, or your own corrupt desires.  The thoughts are scattered by the feeling of a fat gob of spooge splattering over your ' + CoC.getInstance().player.face() + '.  You blink your eyes clear in time to see the fat, pulsating tip of your ' + Descriptors.cockDescript( 0 ) + ' hovering in front of your face.  Your urethra spreads wide, launching another spurt and splattering it into your ' + Descriptors.hairDescript() + '.\n\n', false );
				EngineCore.outputText( '"<i>Oh, if only your elders could see you now, soaking yourself in cum after submitting to a demon\'s will.  Ooooh, that feels good,</i>" mutters your possessed prick as it continues to paint you, the hot eruptions tapering off into a steady trickle of whiteness, running down your ' + Descriptors.allBreastsDescript() + '.  You lie back, humiliated, but smiling happily at how RELIEVED you are after creating such a massive eruption.\n\n', false );
				EngineCore.outputText( 'Temporarily sated, Exgartuan deflates, not even bothering to taunt you while you try to clean up the goop now splattered over your upper body.', false );
			}
			//high corruption characters;
			else {
				EngineCore.outputText( 'Happily giving in to the desires of your inner demon, you grab hold of your ' + Descriptors.cockDescript( 0 ) + ' with both hands, feeling its heavy mass slowly expanding inside your tight grip. It pulsates with dark powers and corrupted lusts, tingling pleasantly as it grows to its full, erect size.  You pet it gently, soothing the demon inside with expert touches that fill the both of you with explosions of pure delight.  Each of the hundreds of nodules covering its surface grow erect in a wave, filling up as you become more and more turned on.\n\n', false );
				EngineCore.outputText( 'Exgartuan, never content to sit idly by, pipes up, "<i>Ah yeah, just a little to the left OK?  I\'m so glad I wound up in you.  I never would\'ve thought a \'champion\' would give such great cock massages.  I really outdid myself with you.  We should stay together like this forever.  Just think of all the wonderful things you could use me to do to your foes...</i>"\n\n', false );
				EngineCore.outputText( 'He\'s so right too.  You could keep making him bigger until it\'s hard to move and he drags on the ground, but you\'re sure his demon-magics would entice plenty of corrupted sluts, and haze the minds of any uncorrupted person enough to bring them under the spell of your ' + Descriptors.cockDescript( 0 ) + '.  Gosh it makes you hot!  Just thinking about having a harem of goblin girls massaging your mighty member while another grinds her eager gash against your tip... you NEED to make this happen.  Perhaps you could breed an army of the little sluts, to bear you around on a litter and squeeze out cum anytime you have the barest hint of lust.\n\n', false );
				EngineCore.outputText( 'Your ' + Descriptors.cockDescript( 0 ) + ' seems quite taken with the idea, spurting hot globules of pre-cum until it\'s glazed itself in a coating of slick wetness.  Both of your hands rub along the surface, soaking themselves in the copious demon-goo, working it entirely of their own volition.  You manage to control your hips at least, and put them to work thrusting up, increasing the stimulation further, and spurring your ' + Descriptors.cockDescript( 0 ) + ' to drizzle even more of its corrupt fluid.  It feels too good to try to resist, and there really isn\'t any reason to, is there?\n\n', false );
				EngineCore.outputText( '"<i>That\'s the ticket, ' + CoC.getInstance().player.short + ', you\'re sooo good at this.  Now go ahead and let it out.  I want to paint your face with seed and watch it drip off.  You\'ll let me do that right?  Who am I kidding, I feel so good you\'ll let me do whatever I want, won\'t you slut?</i>"\n\n', false );
				EngineCore.outputText( 'Oh gods he\'s right, you\'re going to let him aim at you and splatter you with waves of demonic jizz.  The worst part is, you can feel a large part of you looking forward to it.  You wonder what has happened to you as you give in, oblivious to the feeling of ', false );
				if( CoC.getInstance().player.biggestTitSize() >= 5 ) {
					EngineCore.outputText( 'your hands smashing your ' + Descriptors.allBreastsDescript() + ' around the ' + Descriptors.cockDescript( 0 ) + ' and vigorously titfucking it.', false );
				} else {
					EngineCore.outputText( 'your hands repositioning your ' + Descriptors.cockDescript( 0 ) + ' so it lays against your chest.', false );
				}
				EngineCore.outputText( '  Without a second thought you lean down to lick and suckle the head, performing auto-fellatio on the demon-dick sprouting from your groin.  You struggle to keep up with the flood of pre-cum, but you know you don\'t have long to wait...\n\n', false );
				EngineCore.outputText( 'You explode, filling your mouth with the tangy seed of your demonic submission.  Why did you ever think to resist such pleasure?  White hot release radiates out from your groin, making your body numb and happy as wave after wave of demon-spunk pours down your throat and spatters your face.  Such unholy pleasures, truly you deserve to enjoy them after what you\'ve been through, right?  You wallow in a growing lake of syrupy submission, happy to be host to such a fun demon.\n\n', false );
				EngineCore.outputText( 'Temporarily sated, Exgartuan deflates, not even bothering to taunt you while you try to clean up the goop now splattered over your upper body.', false );
			}
			CoC.getInstance().player.orgasm();
			EngineCore.dynStats( 'lib', 0.25, 'cor', 1 );
		}
		//TITURBATION;
		else if( CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 2 ) {
			if( CoC.getInstance().player.cor < 50 ) {
				EngineCore.outputText( 'You shrug off your top, preparing to give into the demon\'s demands.  \'At least I\'ll get to enjoy it too,\' you muse, as you finish stripping the offending material from your torso.  You look down over your ' + Descriptors.allBreastsDescript() + ', and they don\'t look particularly evil.  Yet you know that within those wonderful mounds of breast-flesh lurks a great force of corruption, and worse yet, you know you\'re giving it exactly what it wants.\n\n', false );
			}
			//(ALT 1st PG);
			else {
				EngineCore.outputText( 'You shrug off your top eagerly, ready to cooperate with the demon inside your ' + Descriptors.allBreastsDescript() + ' and enjoy a relaxing tit-massage.  You slide the offending material to the side and marvel at the wondrously large orbs on your chest.  Truly any place that can give you such wonderful endowments can\'t be evil.  You lean back, enjoying the warmth in the air as it flows over every extra-sensitive inch of your mounds, more than ready to get started.\n\n', false );
			}
			EngineCore.outputText( 'Both hands rise unbidden and begin to caress your ' + Descriptors.breastDescript( 0 ) + '.  They slide over every sensitive inch of ', false );
			if( CoC.getInstance().player.skinType === AppearanceDefs.SKIN_TYPE_PLAIN || CoC.getInstance().player.skinType >= AppearanceDefs.SKIN_TYPE_UNDEFINED ) {
				EngineCore.outputText( 'flesh', false );
			} else if( CoC.getInstance().player.skinType === AppearanceDefs.SKIN_TYPE_FUR ) {
				EngineCore.outputText( 'furry-covered flesh', false );
			} else if( CoC.getInstance().player.skinType === AppearanceDefs.SKIN_TYPE_SCALES ) {
				EngineCore.outputText( 'soft scaley flesh', false );
			} else {
				EngineCore.outputText( 'gooey surface', false );
			}
			EngineCore.outputText( ', pausing to gently squeeze and caress any particularly sensitive spots.  Soft sighs escape your lips from the self-imposed pleasure-assault.  Your body relaxes totally, slouching down against a rock while you continue to happily play with your ' + Descriptors.allBreastsDescript() + '.  The entire time your hands never touch one of your ' + Descriptors.nippleDescript( 0 ) + 's, merely circling them from time to time, making you arch your back in need.\n\n', false );
			EngineCore.outputText( 'A voice taunts, "<i>Oh, does my champion tit-massager need a little nipple-play?  And to think I thought I was the one needing to get off.  Go ahead then, submit to your desires and play with your nipples.  Wallow in the pleasure that I can give you and remember who your true master is!</i>"\n\n', false );
			EngineCore.outputText( 'At last, fingers wrap themselves about your ' + Descriptors.nippleDescript( 0 ) + 's, squeezing them gently and forcing happy gasps from your mouth.  ', false );
			if( CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( 'Juice', false );
				if( CoC.getInstance().player.totalCocks() > 0 ) {
					EngineCore.outputText( ' and pre-cum', false );
				}
				EngineCore.outputText( ' soaks your groin', false );
			} else if( CoC.getInstance().player.totalCocks() > 0 ) {
				EngineCore.outputText( 'pre-cum soaks your groin', false );
			} else {
				EngineCore.outputText( 'Warmth radiates through your body', false );
			}
			EngineCore.outputText( ' as you\'re more and more turned on by the feelings coming from your chest.  Fingertips ', false );
			if( CoC.getInstance().player.nippleLength < 2 ) {
				EngineCore.outputText( 'pinch together and pull, and it\'s too much for you.', false );
			} else {
				EngineCore.outputText( 'stroke your enlongated nipples, occasionally pinching them gently as you jerk them off.  It\'s far too much sensation for you.', false );
			}
			EngineCore.outputText( ' You shake and wriggle, overcome with a strange type of pleasure unlike a \'normal\' orgasm.  The boobgasm does feel wonderful, but it does nothing for the aching lust that has built up in your crotch.  Perhaps you\'ll need to satisfy that as well.\n\n', false );
			//(lust + 15);
			EngineCore.dynStats( 'sen', 0.25, 'lus', 15, 'cor', 1 );
			if( CoC.getInstance().player.biggestLactation() > 1 ) {
				EngineCore.outputText( 'As you calm down you realize your ' + Descriptors.nippleDescript( 0 ) + 's are dribbling streams of milk, and judging from the pools of whiteness in the soil, you turned into quite the little milk-sprinkler.  ', false );
			}
			EngineCore.outputText( 'You blush and redress, noting that Exgartuan seems to be silent and sleeping...  maybe you\'ll get a little peace now?', false );
		}
		CoC.getInstance().player.changeStatusValue( StatusAffects.Exgartuan, 2, (12 + Utils.rand( 7 )) );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};

	//(NOT PLAYED WITH RECENTLY: +LUST MESSAGE);
	Exgartuan.prototype.exgartuanBored = function() {
		var select = 0;
		if( CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 1 && CoC.getInstance().player.cockArea( 0 ) >= 100 ) {
			select = Utils.rand( 9 );
			if( select === 0 ) {
				EngineCore.outputText( 'A muffled voice pipes up, "<i>Hey!  You forgetting about me?  Fucking champions think they\'re so good, but you\'re ignoring your best body part!  Can\'t you feel all that cum boiling ', false );
				if( CoC.getInstance().player.balls === 0 ) {
					EngineCore.outputText( 'inside?', false );
				} else {
					EngineCore.outputText( 'in your ' + Descriptors.ballsDescriptLight() + '?', false );
				}
				EngineCore.outputText( '  Well you\'d better relieve me soon or I\'ll make sure your body finds someone who does!</i>"', false );
			} else if( select === 1 ) {
				EngineCore.outputText( 'A tiny voice mutters, "<i>How can you live with so few orgasms?  We need some quality time, ' + CoC.getInstance().player.short + '.  You\'ve got a LOT of tension building up...</i>"', false );
			} else if( select === 2 ) {
				EngineCore.outputText( 'You feel a stirring inside your ' + CoC.getInstance().player.armorName + ' as it rubs against the material.  A muffled voice says, "<i>Hey!  Don\'t forget me!  I need some air!</i>"', false );
			} else if( select === 3 ) {
				EngineCore.outputText( '"<i>Hey!  WHATTHEFUCK ARE YOU DOING!?  I\'ll tell you what you\'re doing TAKING CARE OF YOUR DICK.  Get on it, or I\'ll make sure something gets on you!</i>" Exgartuan orders.  What a prick.', false );
			} else if( select === 4 ) {
				EngineCore.outputText( 'You feel your ' + Descriptors.cockDescript( 0 ) + ' slowly expand and contract, air escaping its urethra and tickling your nether regions.  Did... did your dick just sigh?  Your demon is growing impatient.', false );
			} else if( select === 5 ) {
				EngineCore.outputText( 'Your ' + CoC.getInstance().player.armorName + ' suddenly bulges, a stifled voice picking up along with it, "<i>There has to be a hole out there for me to fuck.  A mouth, a cunt... stop slacking off and get on it!</i>"', false );
			} else if( select === 6 ) {
				EngineCore.outputText( 'It\'s getting harder to concentrate... Exgartuan is ', false );
				if( CoC.getInstance().player.balls > 0 ) {
					EngineCore.outputText( 'teasing your ballsack', false );
				}
				//[if vagina, no balls];
				else if( CoC.getInstance().player.hasVagina() ) {
					EngineCore.outputText( 'poking your labia', false );
				} else {
					EngineCore.outputText( 'stroking your perineum', false );
				}
				EngineCore.outputText( ', "<i>Come on, champion. You know you can\'t go on ignoring me much longer.</i>"', false );
			} else if( select === 7 ) {
				EngineCore.outputText( 'Your possessed prick shuffles from side to side, "<i>Have you just FORGOT how a dick works or something? I\'ll help remind you; step one IT SOME AIR.</i>"', false );
			} else if( select === 8 ) {
				EngineCore.outputText( 'Your ' + Descriptors.cockDescript( 0 ) + ' has started rubbing against your thighs as a familiar voice chimes in, "<i>I\'ve got a hot, steaming batch of cum ', false );
				if( CoC.getInstance().player.balls > 0 ) {
					EngineCore.outputText( 'boiling in your ' + Descriptors.ballsDescriptLight() + '.', false );
				} else {
					EngineCore.outputText( 'cooking deep within you.', false );
				}
				EngineCore.outputText( '  Find me somewhere to deliver it or I\'ll be shoving it down your throat, champion!</i>"', false );
			}
		} else if( CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 2 && CoC.getInstance().player.biggestTitSize() >= 12 ) {
			select = Utils.rand( 8 );
			switch( select ) {
				case 0:
					EngineCore.outputText( 'You feel an ominous jiggling in your ' + Descriptors.breastDescript( 0 ) + ' as the demon inside you stirs back to wakefulness.  The sound of a yawn being muffled by your ' + CoC.getInstance().player.armorName + ' confirms it.', false );
					break;
				case 1:
					EngineCore.outputText( 'After a few hours of peace, Exgartuan begins to stir.  You can feel a desire to be touched building within your ' + Descriptors.allBreastsDescript() + '.  What a needy demon.', false );
					break;
				case 2:
					EngineCore.outputText( 'Exgartuan wakes, making your ' + Descriptors.allBreastsDescript() + ' wobble pleasantly.  The need to have them groped and fondled slowly grows with the demoness\'s wakefulness.  She barks out, "<i>Oi, bitch!  Touch your titties!</i>"\n\nYou sigh.', false );
					break;
				case 3:
					EngineCore.outputText( 'Suddenly your ' + Descriptors.chestDesc() + ' feel as if they trying to force their way off your chest.  The strange motions are accompanied by some loud moaning, as if they are stretching awake.  Looks like the delightful peace and quiet has ended.', false );
					break;
				case 4:
					EngineCore.outputText( 'Your arms suddenly hug against your ' + Descriptors.chestDesc() + ' of their own accord, the squeeze filling you with a hint of warmth.  The demoness is awake and filling you with longing to be touched and teased.', false );
					break;
				case 5:
					EngineCore.outputText( 'Your ' + Descriptors.chestDesc() + ' fidget ominously, a muffled female voice piping up, "<i>No cloth, metal, latex, or gel can protect you from me, champion.  Give in and caress these cans!</i>"', false );
					break;
				case 6:
					EngineCore.outputText( 'The silent alone time you\'ve been enjoying is coming to an end as the demoness dwelling within your bosom shifts in your ' + CoC.getInstance().player.armorName + '.  She wastes no time in stuffing you full of chest-focused temptations.', false );
					break;
				case 7:
					EngineCore.outputText( 'A menacing jiggle emanates from your bosom as they begin to speak, "<i>Someone out there must be looking for a home to nestle their cock or some sweet milk to quench their gullet, champion.  Stop wasting their time and get on it.</i>"', false );
					break;
			}
		}
	};

	Exgartuan.prototype.exgartuanCombatUpdate = function() {
		//Monsters not effected by Exgartuan's stuff;
		if( CoC.getInstance().monster.short === 'tentacle beast' || CoC.getInstance().monster.short === 'worms' || CoC.getInstance().monster.short === 'demons' ) {
			return false;
		}
		//VARS;
		var select = 0;
		if( CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 1 ) {
			//[USE MAGIC TO MAKE GOBLINS COOCHIES STRETCHIER!];
			if( CoC.getInstance().monster.short === 'goblin' && Utils.rand( 3 ) === 0 ) {
				EngineCore.outputText( 'A strangely harmonic voice chants gibberish, rising in volume and pitch.  It\'s coming from your groin!  The goblin girl giggles and squeals, "<i>Stop that!  It\'s using magic on my coo-chiieeeeeee!!!</i>"', false );
				//(+20 or 10% of cocksize, whichever is greater to vag capacity;
				CoC.getInstance().monster.addStatusValue( StatusAffects.BonusVCapacity, 1, CoC.getInstance().player.cockArea( 0 ) * 0.1 );
				CoC.getInstance().monster.lust += 10;
				return true;
			}
			//[FETISH CULTISTS TURNED ON BY DEMON-COCK];
			else if( CoC.getInstance().monster.short === 'fetish cultist' ) {
				select = Utils.rand( 3 );
				switch( select ) {
					case 0:
						EngineCore.outputText( 'The fetish cultist\'s eyes fixate on your groin, never seeming to leave as combat continues.  Exgartuan seems to have quite the effect on her, judging by the growing scent of feminine arousal in the air.', false );
						break;
					case 1:
						EngineCore.outputText( 'Openly touching herself, the fetish cultist\'s gaze never leaves your crotch, locked onto the outline of Exgartuan in your ' + CoC.getInstance().player.armorName + '.  What a slut.', false );
						break;
					case 2:
						EngineCore.outputText( 'The fetish cultist seems fixated by the twitching lump that resides in your groin, following it back and forth as you tease her, swiveling your hips.  Damnit why is this bitch even wasting time fighting?  She definitely wants to play with Exgartuan...', false );
						break;
				}
				CoC.getInstance().monster.lust += 10;
				return true;
			}
			//(+Lust in combat) for girls;
			else if( CoC.getInstance().monster.hasVagina() ) {
				select = Utils.rand( 10 );
				switch( select ) {
					case 0:
						EngineCore.outputText( 'Thoughts of ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + ', wrapping ' + CoC.getInstance().monster.mf( 'him', 'her' ) + 'self around your throbbing demonic member consume you, flooding your body with lust.', false );
						if( CoC.getInstance().player.cor < 50 ) {
							EngineCore.outputText( '  You glance down at the sensitive bulge in your ' + CoC.getInstance().player.armorName + ' and sigh.  Damned demons.', false );
						}
						break;
					case 1:
						EngineCore.outputText( 'Desire courses through your veins, growing stronger as you watch ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + '\'s form.  You somehow realize the desire is artificial, but it doesn\'t make you want to mount ' + CoC.getInstance().monster.mf( 'him', 'her' ) + ' any less...', false );
						break;
					case 2:
						EngineCore.outputText( 'Warmth spreads throughout your body as visions of yourself mounting ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + ' over and over flutter through your mind.  You might have to make them a reality...', false );
						if( CoC.getInstance().player.cor < 50 ) {
							EngineCore.outputText( '  That\'s terrible!  It\'s all that demon\'s fault!', false );
						}
						break;
					case 3:
						EngineCore.outputText( 'You really want to end this fight and bend ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + ' over... Why is this taking so long, your ' + Descriptors.cockDescript( 0 ) + ' does NOT want to wait!', false );
						if( CoC.getInstance().player.cor < 50 ) {
							EngineCore.outputText( '  You snap back to reality and curse yourself for falling to the demon\'s desires.', false );
						}
						break;
					case 4:
						EngineCore.outputText( 'This fight has gone on long enough; all you really want is to shove your ' + Descriptors.cockDescript( 0 ) + ' into the ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + '\'s... Wait, what? Your possessed pecker is getting the better of you.', false );
						break;
					case 5:
						EngineCore.outputText( 'For a moment, you find it hard to concentrate, visions of impaling the ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + ' with your ' + Descriptors.cockDescript( 0 ) + ' etching their way into your mind.  Curse this horny demon!', false );
						break;
					case 6:
						EngineCore.outputText( 'Pleasure begins to radiate through your being, suddenly.  You snap back to your senses in time to see your hands stroking the bulge in your ' + CoC.getInstance().player.armorName + ', answering to the whims of an unholy force.', false );
						break;
					case 7:
						EngineCore.outputText( 'Maybe it would be best to just lay down your arms and strip off your ' + CoC.getInstance().player.armorName + '. Just give yourself up to the ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + ' and let fate decide. Surely, ' + CoC.getInstance().monster.pronoun1 + ' would return the gesture by embracing your ' + Descriptors.cockDescript( 0 ) + ' and... Augh!  The demon is again toying with your judgment.', false );
						break;
					case 8:
						EngineCore.outputText( 'Tight loving assholes and gaping vaginas, slick long red tongues and breasts like fine china.  Succubi and the hot sexings they bring, these are a few of your favorite things!  0...Wait, what?  Was that musing your own?  And why are you absently stroking your ' + Descriptors.cockDescript( 0 ) + '?', false );
						break;
					case 9:
						EngineCore.outputText( 'It\'s becoming increasingly difficult to see this battle to its end when your mutinous mushroom is increasingly stiffening with each passing moment.  Exgartuan\'s weight is bad enough to your poise without extending it away from you.  What a jerk.', false );
						break;
				}
				EngineCore.dynStats( 'lus', 4 + Utils.rand( 5 ) );
				return true;
			}
			//(Taunts Male Foes -enemy lust);
			else if( CoC.getInstance().monster.totalCocks() > 0 ) {
				select = Utils.rand( 8 );
				switch( select ) {
					case 0:
						EngineCore.outputText( 'Without any control over it, your hands undo your ' + CoC.getInstance().player.armorName + ' and reveal your ' + Descriptors.cockDescript( 0 ) + '.  Somehow it launches into a tirade all its own, "<i>You call that a cock?  Seriously?  And do the girls actually like that?  I can\'t imagine why.  That\'s right bub, keep wilting, you\'ve got nothing on me!</i>"', false );
						break;
					case 1:
						EngineCore.outputText( 'Heedless of your orders, both hands undo your gear, displaying your possessed member to ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + '.  A disembodied voice taunts, "<i>You really can\'t compete with me.  Seriously.  Take a good long look.  I\'m the fucking business.  Why don\'t you tuck that pathetic excuse for a cock between your legs and chuck down some succubi milk until you\'re a girl?  You\'d be better off.</i>"', false );
						break;
					case 2:
						EngineCore.outputText( 'Your ' + Descriptors.cockDescript( 0 ) + ' squirms around, pushing your ' + CoC.getInstance().player.armorName + ' out of the way.  Exgartuan barks, "<i>Why are you bothering my host, fool?  Can\'t you see my magnificence?  You\'re nothing compared to me.  Go wank in shame and get out of our way.  We have cunts to fill.</i>"', false );
						break;
					case 3:
						EngineCore.outputText( 'The waist of your ' + CoC.getInstance().player.armorName + ' expands as your ' + Descriptors.cockDescript( 0 ) + ' flies skyward fully erect, "<i>Tremble in fear, peon! My ' + Utils.num2Text( CoC.getInstance().player.cocks[ 0 ].cockLength ) + ' inches of might shame that feeble nub between your legs.  We\'ve no time for your slack-jawed awe; go home and be a family man.</i>"', false );
						break;
					case 4:
						EngineCore.outputText( 'Disobeying your will, your hands promptly undo your ' + CoC.getInstance().player.armorName + ', your ' + Descriptors.cockDescript( 0 ) + ' springing forth and flaring its urethra menacingly at the ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + ', "<i>You have a dick not even a mother could love.  Has that thing ever graced another living being\'s flesh?  Run back to your lonely hovel full of unattainable fantasies, and leave the real action to the pros.</i>"', false );
						break;
					case 5:
						EngineCore.outputText( 'Suddenly, your ' + CoC.getInstance().player.armorName + ' pitches an impossible tent, the colossal bulge pointing directly at the ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + '.  You can only wince in discomfort as the back of your outfit pushes against you while a muffled voice taunts, "<i>How can something so insignificant remain so ANNOYING?  Your mere presence dulls the obvious radiance before you. DROP DEAD!</i>"', false );
						break;
					case 6:
						EngineCore.outputText( 'Your ' + CoC.getInstance().player.armorName + ' unexpectedly opens itself of its own accord, prompting your ' + Descriptors.cockDescript( 0 ) + ' to extend into the open air, "<i>All the chemicals, potions, and morsels in existence can\'t help that infinitesimal tool you possess.  The orifices of this world deserve better!  All you are accomplishing this day is their disappointment in delaying the inevitable.</i>"', false );
						break;
					case 7:
						EngineCore.outputText( 'All of a sudden, your ' + CoC.getInstance().player.armorName + ' splays open, your ' + Descriptors.cockDescript( 0 ) + ' quickly slithering up and around your back, stopping uncomfortably close to your face while pointing at your opponent, "<i>Look at this pitiful cretin, ' + CoC.getInstance().player.short + '.  We could be out spreading hot dickings to the wanting cunts of the land.  But, no!  This ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + ' desires eradication.  Well, champion...oblige him.</i>"', false );
						break;
				}
				CoC.getInstance().monster.lust -= 5 + Utils.rand( 10 );
				return true;
			}
		}
		//Exgartuan in tittays!;
		else if( CoC.getInstance().player.statusAffectv1( StatusAffects.Exgartuan ) === 2 ) {
			if( CoC.getInstance().monster.totalCocks() > 0 ) {
				select = Utils.rand( 8 );
				switch( select ) {
					case 0:
						EngineCore.outputText( 'A flirty female voice with a rumbling undertone of demonic corruption teases, "<i>Why fight us?  Just sit back and watch the giant breasts jiggle.  Maybe if you\'re good we\'ll let you slide in between our wonderful mammaries.  Isn\'t that nice?</i>"', false );
						break;
					case 1:
						EngineCore.outputText( 'Your breasts wobble of their own accord, and ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + ' watches spellbound as they do so.  You silently thank Exgartuan for the help – maybe this fight will be easy.', false );
						break;
					case 2:
						EngineCore.outputText( 'A girlish voice calls out to ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + ', "<i>Hey cutey pie!  Why not just give up and submit, and maybe we\'ll let you play with our wondrous breasts.  Wouldn\'t that be nice?</i>"', false );
						break;
					case 3:
						EngineCore.outputText( 'Your ' + Descriptors.chestDesc() + ' begin to playfully bounce up and down, making it difficult for you to focus on your fight.  You aren\'t too worried, however, as the ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + ' seems to be hypnotized by the movement.', false );
						break;
					case 4:
						EngineCore.outputText( 'A sultry woman\'s voice teases the ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + ', "<i>There\'s no need for hostilities, is there?  Merely lay down your arms and come help fondle these marvels of creation.</i>"  Your ' + Descriptors.chestDesc() + ' shimmy for emphasis.', false );
						break;
					case 5:
						EngineCore.outputText( 'An alluring female voice perks up from seemingly nowhere, "<i>We all know that you just want to nestle your head between these ferocious funbags.  No need to fight for them, just ask nicely!</i>"', false );
						break;
					case 6:
						EngineCore.outputText( 'You feel a moistness forming on your chest as a womanly voice takes shape, "<i>Come now, ' + CoC.getInstance().monster.short + '.  Surely this fight has made you thirsty.  I wouldn\'t want to let all of this delicious breastmilk go to waste after all...</i>"  Oh, gods...', false );
						break;
				}
				//+Enemy lust;
				CoC.getInstance().monster.lust += CoC.getInstance().monster.lib / 10 + 5;
				return true;
			} else if( Utils.rand( 3 ) === 0 ) {
				select = Utils.rand( 3 );
				switch( select ) {
					case 0:
						EngineCore.outputText( 'A brief fantasy of ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + ' brutally squeezing and caressing your chest fills your mind.  You break free of the twisted daydream and pull your hands away from your ' + Descriptors.breastDescript( 0 ) + '.  Damnit you\'re in combat!  There\'s no time for such foolishness!', false );
						break;
					case 1:
						EngineCore.outputText( 'A blush colors your cheeks as warm pleasure spreads through your chest.  You spare a downward glance and nearly shriek when you see both hands busy massaging your massive mounds.  You don\'t have time for this!  You pull your hands away in a huff.', false );
						break;
					case 2:
						EngineCore.outputText( 'A moan escapes your lips as mental images of having your breasts touched and licks leap into your mind unbidden.  You force them aside to focus on the situation you\'re in.', false );
						break;
					case 3:
						EngineCore.outputText( 'Your battle stance is interrupted as your fingers decide they would rather begin groping your tits.  Your bewitched bosom is getting to be a nuisance.  You retract your hands with a huff, anxious to end this battle.', false );
						break;
				}
				//(+lust! Possible + enemy lust);
				EngineCore.dynStats( 'lus', 2 + CoC.getInstance().player.sens / 10 );
				if( Utils.rand( 3 ) === 0 ) {
					CoC.getInstance().monster.lust += 5 + CoC.getInstance().monster.lib / 10;
				}
				return true;
			}
		}
		return false;
	};
	//(ARMOR CHANGE);
	Exgartuan.prototype.exgartuanArmorShift = function() {
		var changed = false;
		if( CoC.getInstance().player.armor === ArmorLib.BEEARMR ) {
			EngineCore.outputText( 'The silken loin-cloth of your chitin armor cinches up, tightening against your groin until it displays the prominent bulge of your demon-possessed dick clearly.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging sexy black chitin armor-plating';
			changed = true;
		} else if( CoC.getInstance().player.armor === ArmorLib.GELARMR ) {
			EngineCore.outputText( 'The green gel-plate protecting your groin thins and presses tightly against you, molding around your ' + Descriptors.cockDescript( 0 ) + ' in an incredibly lewd way.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging glistening gel-armor plates';
			changed = true;
		} else if( CoC.getInstance().player.armor === ArmorLib.LEATHRA ) {
			EngineCore.outputText( 'Your leather armor shifts, pressing tightly against your upper ' + CoC.getInstance().player.legs() + ' and molding itself around your ' + Descriptors.cockDescript( 0 ) + ' to prominently display it.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging leather armor segments';
			changed = true;
		} else if( CoC.getInstance().player.armor === ArmorLib.INDECST ) {
			EngineCore.outputText( 'The chainmail bikini of your indecent steel armor rearranges and bends its interlocking rings to best shape itself around your ' + Descriptors.cockDescript( 0 ) + ', leaving very little else to the imagination.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging practically indecent steel armor';
			changed = true;
		} else if( CoC.getInstance().player.armor === ArmorLib.R_BDYST ) {
			EngineCore.outputText( 'The thin, transparent material of your red bodysuit begins to firmly press against your groin, perfectly shaping to your ' + Descriptors.cockDescript( 0 ) + ' and every last one of its nubs and nodules.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging red, high-society bodysuit';
			changed = true;
		} else if( CoC.getInstance().player.armor === ArmorLib.SSARMOR ) {
			EngineCore.outputText( 'The fine silk that makes up your armor suddenly undoes itself around your crotch, exposing your ' + Descriptors.cockDescript( 0 ) + ' to the open air. The thin strands in the air begin to re-weave themselves around your enormous member, forming a prominent new addition to your protection.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging spider-silk armor';
			changed = true;
		} else if( CoC.getInstance().player.armor === ArmorLib.S_SWMWR ) {
			EngineCore.outputText( 'The miniscule piece of swimwear that doubles as a tent to your ' + Descriptors.cockDescript( 0 ) + ' begins to grow and encapsulate it, molding itself perfectly to your manhood.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging slutty swimwear';
			changed = true;
		} else if( CoC.getInstance().player.armor === ArmorLib.FULLCHN ) {
			EngineCore.outputText( 'You\'re taken by surprise as the binds of your chainmail begin to flatten and rearrange themselves, doing their best to match the curves of your ' + Descriptors.cockDescript( 0 ) + ' and make its presence known.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging full-body chainmail';
			changed = true;
		} else if( CoC.getInstance().player.armor === ArmorLib.CHBIKNI ) {
			EngineCore.outputText( 'Your chainmail bikini rearranges and bends its interlocking rings to best shape itself around your ' + Descriptors.cockDescript( 0 ) + ', leaving very little else to the imagination.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging revealing chainmail bikini';
			changed = true;
		} else if( CoC.getInstance().player.armor === ArmorLib.FULLPLT ) {
			EngineCore.outputText( 'You begin to clench your fists as your steel platemail heats up around your ' + CoC.getInstance().player.legs() + ' and crotch. Slowly it begins to press itself against your ' + Descriptors.cockDescript( 0 ) + ' and match its every feature.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging full platemail';
			changed = true;
		} else if( CoC.getInstance().player.armor === ArmorLib.SCALEML ) {
			EngineCore.outputText( 'The steel scales that make up your armor begin to flap wildly around your crotch. They bend and shift as they attempt to match the profile of your ' + Descriptors.cockDescript( 0 ) + '.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging scale-mail armor';
			changed = true;
		} else if( CoC.getInstance().player.armor === ArmorLib.LTHRROB ) {
			EngineCore.outputText( 'Your leather armor shifts, pressing tightly against your upper ' + CoC.getInstance().player.legs() + ' and molding itself around your ' + Descriptors.cockDescript( 0 ) + ' to prominently display it through your robes.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging black leather armor surrounded by voluminous robes';
			changed = true;
		} else if( CoC.getInstance().player.armor === ArmorLib.RBBRCLT ) {
			EngineCore.outputText( 'You begin to feel your rubber outfit compressing itself against your upper ' + CoC.getInstance().player.legs() + ' and ' + Descriptors.cockDescript( 0 ) + ', eliminating any pockets of air or wrinkles that may have existed before.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging rubber fetish clothes';
			changed = true;
		} else if( CoC.getInstance().player.armor === ArmorLib.ADVCLTH ) {
			EngineCore.outputText( 'The layer beneath your tunic begins to compress against your ' + Descriptors.cockDescript( 0 ) + ', highlighting every curve and nodule while lifting your package to be clearly visible beneath your outer layers.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging green adventurer\'s clothes';
			changed = true;
		} else if( CoC.getInstance().player.armor === ArmorLib.OVERALL ) {
			EngineCore.outputText( 'The denim of your overalls begins to press tightly against your ' + Descriptors.cockDescript( 0 ) + ', molding itself around your member and its every facet.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging white shirt and overalls';
			changed = true;
		} else if( CoC.getInstance().player.armor === ArmorLib.C_CLOTH ) {
			EngineCore.outputText( 'Your clothing shifts, tightening up about your crotch until every curve and nodule of your ' + Descriptors.cockDescript( 0 ) + ' is visible through the fabric.', false );
			CoC.getInstance().player.modArmorName = 'crotch-hugging clothes';
			changed = true;
		}
		if( CoC.getInstance().player.cor < 33 ) {
			EngineCore.outputText( '  You cringe and blush bright crimson, raging against the demon inside you and wishing he would stop tormenting you!', false );
		} else if( CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( '  You cringe a bit at the exhibitionist outfit you\'re forced to wear, but spend a little time admiring just how well the changes show off your package... Maybe Exgartuan isn\'t all bad?', false );
		} else {
			EngineCore.outputText( '  You pivot your hips forwards, doing your best to show off your sensational package with every step.  Oh, very nice, you\'ll have to thank Exgartuan later...', false );
		}
		if( changed ) {
			//(Add perk "Bulge Armor" - bonus to male crotch reveal tease!) - check armor equip function – all names are hashed out in old armor names already;
			if( CoC.getInstance().player.findPerk( PerkLib.BulgeArmor ) < 0 ) {
				CoC.getInstance().player.createPerk( PerkLib.BulgeArmor, 0, 0, 0, 0 );
			}
		}
	};
	//(FORCE OUT ANY WORM INFECTION);
	Exgartuan.prototype.exgartuanWormCure = function() {
		EngineCore.outputText( 'Your ', false );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( Descriptors.ballsDescriptLight(), false );
		} else {
			EngineCore.outputText( 'groin', false );
		}
		EngineCore.outputText( ' begins to grow warm... no, hot.  You feel it moving and squirming with discomfort as the worms inside you wriggle about, agitated by something.  The heat intensifies and you watch in a mixture of shock and horror as they start crawling out your urethra, sliding down to the ground on a river of thick seminal fluid.  You double over in pain as something stretches you wide, and you feel the main worm pushing itself through your ' + Descriptors.cockDescript( 0 ) + ', desperate to escape.  It crests the tip, wiggling and stuck for a moment as it struggles to pull free.  At last it pops out and drops to the ground, crawling away.  Exgartuan roars, "<i>AND STAY OUT!</i>"', false );
		EngineCore.outputText( '\n\nYou guess there was only enough room for one or the other...', false );
		CoC.getInstance().player.removeStatusAffect( StatusAffects.Infested );
	};
	Exgartuan.prototype.exgartuanLactationAdjustment = function() {
		var boobs = 0;
		//(Lactating Already);
		if( CoC.getInstance().player.biggestLactation() > 1 ) {
			//(Increase);
			if( Utils.rand( 2 ) === 0 || CoC.getInstance().player.findStatusAffect( StatusAffects.Feeder ) >= 0 ) {
				EngineCore.outputText( 'Your nipples grow warm and sensitive, then start dripping milk into your ' + CoC.getInstance().player.armorName + '.  Exgartuan appears to be having some fun with you again...', false );
				CoC.getInstance().player.boostLactation( CoC.getInstance().player.breastRows.length );
			}
			//(Stops) ;
			else {
				EngineCore.outputText( 'Your ' + Descriptors.nippleDescript( 0 ) + 's tighten up.  What\'s that demon up to?  Realization dawns on you when you realize your ' + Descriptors.allBreastsDescript() + ' no longer feel so \'full\'.  Your lactation has stopped!', false );
				boobs = CoC.getInstance().player.breastRows.length;
				while( boobs > 0 ) {
					boobs--;
					CoC.getInstance().player.breastRows[ boobs ].lactationMultiplier = 0;
				}
			}
		}
		//(Not lactating);
		else {
			//(START);
			if( Utils.rand( 2 ) === 0 ) {
				EngineCore.outputText( 'Your chest feels cold.  You touch your ' + CoC.getInstance().player.armorName + ' experimentally and discover a few drops of milk have leaked from your ' + Descriptors.nippleDescript( 0 ) + 's!  The demon has made you start lactating!', false );
				CoC.getInstance().player.boostLactation( CoC.getInstance().player.breastRows.length );
			}
			//Nipple stuff;
			else {
				//(Bigger Nipples!);
				if( Utils.rand( 2 ) === 0 ) {
					EngineCore.outputText( 'The inner surface of your ' + CoC.getInstance().player.armorName + ' arouses you as it rubs against your ' + Descriptors.nippleDescript( 0 ) + 's.  You think about it and realize they\'ve never been like this before.  A quick check reveals each nipple has grown about a half inch longer.  Damn demons.', false );
					CoC.getInstance().player.nippleLength += 0.5;
				}
				//(SHORTER NIPPLES!)  ;
				else if( CoC.getInstance().player.nippleLength > 0.5 ) {
					EngineCore.outputText( 'As time passes you realize something feels different about your chest.  A quick glance confirms your suspicious – your nipples have somehow been shortened by about half an inch.  You\'ve no doubt Exgartuan is responsible.', false );
					CoC.getInstance().player.nippleLength -= 0.5;
				}
			}
		}
	};

	//[BEEGIRL RAEP];
	Exgartuan.prototype.exgartuanBeeRape = function() {
		EngineCore.spriteSelect( 6 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You grin and embrace the demon\'s idea as if it were your own.  Maybe it\'s time the bee-girl had her own lesson in fluid insemination...\n\n', false );
		EngineCore.outputText( 'Walking forward with a bit of supernaturally-induced swagger, you close the remaining distance with your trembling victim, oblivious to the fact that your ' + CoC.getInstance().player.armorName + ' are rapidly disengaging themselves from your body and dropping to the forest floor.  She weakly protests, exposing her stinger, but the threat is clearly futile.  There\'s no way she\'d touch you or your magnificent ' + Descriptors.cockDescript( 0 ) + ' with such an inferior organ.\n\n', false );
		EngineCore.outputText( 'The smooth carapace covering her arms is a little slippery, but you manage to get a tight grip around her wrists and pin them over her head.  Holding them together, you grab one of the many forest vines and begin winding it around her hands, easily sidestepping the awkward jabs she makes at you with her poison-tipped appendage as her arms are bound tighter and tighter above her head.  The bulging abdomen hanging from her backside wriggles as you handle it, pulling it back and forcing it over the flower, out of the way.  A few more vines make sure it\'s strapped down and no longer a threat.\n\n', false );
		EngineCore.outputText( '"<i>You sure know your knots!   Speaking of knots, I got an idea...</i>" exclaims the demon inside your ' + Descriptors.cockDescript( 0 ) + '.  You wonder at what the demon could have in mind this time as you finish spreading the bee-bitch\'s legs in preparation.  The scent wafting out from her genitals is unreal, making you simultaneously hungry and incredibly horny.  You pull up the ginormous flanged tip with both hands and rub it over her honey-slicked crotch, mixing your demonic pre-seed with her honey as you smear it all over her downy inner thighs.\n\n', false );
		EngineCore.outputText( '"<i>No, please, it\'ll never fit!</i>" she cries, trying to squirm against your bindings.\n\n', false );
		EngineCore.outputText( '"<i>Shut up and take it,</i>" you and Exgartuan say in unison, enjoying a rather pleasant tingle that seems to spread through your tip with every rub against her.  Her lips slowly start to spread, glistening with honey as you slowly push them further and further apart, obscenely stretching them beyond any rational limit.  \'Is this the true power of this demon?\' you wonder as the poor bee-girl is stretched beyond her wildest imaginings.\n\n', false );
		EngineCore.outputText( 'Her insectile pussy feels unimaginably tight, but still you press onward, eventually managing to hump your bump-ringed cock-tip through her permanently widened entrance.  You keep up the assault, sliding inch after inch of your impressive girth into the egg-laying slut\'s passage, taking sick pleasure in watching as every detail of your cock\'s surface becomes visible on her belly.  Satisfied for now, you begin sawing in and out, relishing the pleasure-filled squeals your victim blurts out in time with your thrusts.  You feel almost as if you\'re playing her like an instrument, forcing it in further to raise the pitch and drawing it back out to hear the \'note\'.\n\n', false );
		EngineCore.outputText( 'The bee-girl\'s abused body is becoming more and more limp with every brutal penetration, relaxing further and further to take in more of your ' + Descriptors.cockDescript( 0 ) + ' as the rape continues.  You hear something splatter against the ground and look around her ass to see what\'s going on.  The cunt\'s ovipositor is hanging out and dripping with more of her sweet fluids!  She\'s really getting off on being a yellow and black cock-sleeve.  The limp tube spasms and stretches as a number of large lumps start working their way down the tunnel, released by her unintentional orgasms.\n\n', false );
		EngineCore.outputText( 'It does not take long for the feeling of being in such a tight hole to push you beyond any point of endurance, and the obscene squelching mixed with high pitched moans doesn\'t help any.  You feel your orgasm building, flooding your groin with heat.  You press your body tightly against hers, forcing as much of yourself as possible inside her as you go off the deep end.  Wave after wave of spunk pumps into the bee, squeezing out an equal amount of eggs from her ovipositor.  Wet plops greet your ears in time with each spurt of seed you push into her.  Apparently, the eggs go in the very hole you\'re now abusing.\n\n', false );
		EngineCore.outputText( 'You pull out with a satisfied grunt, enjoying the wet \'schlick\' sound your ' + Descriptors.cockDescript( 0 ) + ' makes as it pulls free of the bee-girl\'s once-tight hole.  Where once there was a honey-coated slit now resides a gaping monster, drooling a gooey mixture of slime and your tainted demonic seed.  Well, maybe her queen will have an easier time packing her full of eggs.\n\n', false );
		EngineCore.outputText( 'You redress, whistling happily as you prepare to leave.  Your victim is practically unconscious, still shaking from the intense experience and leaking eggs and honey from the organ on her backside.  Do you cut her down or leave her bound up for the locals to enjoy?', false );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', 1, 'cor', 2 );
		EngineCore.choices( 'Leave Her', this.leaveBeePostRape, 'Free Her', this.freeBeePostRape, '', null, '', null, '', null );
	};
	//[Free Her] (negates some corruption gain);
	Exgartuan.prototype.freeBeePostRape = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You take pity on the slut and untie her.  Hopefully she\'ll recover before something worse finds her.  You\'d hate to let a tentacle-beast get your sloppy seconds.', false );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
		EngineCore.dynStats( 'cor', -1 );
	};
	//[Leave Her];
	Exgartuan.prototype.leaveBeePostRape = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You smile cruelly and give her glittering vulva a gentle smack before you walk away, leaving her tied up there.  Maybe some lonely imps will find a use for her...', false );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
		EngineCore.dynStats( 'cor', 0.5 );
	};
	Exgartuan.prototype.exgartuanSleepSurprise = function() {
		EngineCore.spriteSelect( 15 );
		//Low corruption;
		if( CoC.getInstance().player.cor <= 20 && CoC.getInstance().player.findPerk( PerkLib.BulgeArmor ) >= 0 ) {
			EngineCore.outputText( 'A light breeze skims across your face, slowly fading away what little sleep you had managed to enjoy.  As your eyes slowly open and adjust, you begin to faintly make out the red moon sitting high in the sky through the fabric of your tent.  What little light there is comes from the faint remnants of your campfire, down to just embers by this point.  You slowly roll your head to look towards the warmth only to find the entrance to your tent still wide open.  A slight grimace forms as you begin to stretch awake, only to interrupt yourself upon the realization that you are still wearing your ' + CoC.getInstance().player.armorName + '.  A quick yet groggy glance also reveals that you\'ve also managed to fall asleep on top of your bedroll rather than nestled cozily inside it.\n\n', false );
			EngineCore.outputText( 'You glide your hands up past your forehead and through your ' + Descriptors.hairDescript() + ' as you sit up, indulging in a relaxing, deep breath.  Seeing as how you don\'t appear to have transmogrified or been roughed up in any discernible fashion, your best guess is that you fell asleep while unraveling your bedroll.  Too tired to further debate this with yourself, you begin to strip naked while thoughts of returning to blissful slumber ease any lingering worries.', false );
			//[if armorname IS NOT EQUAL TO "<i>;
			if( CoC.getInstance().player.armorName !== 'crotch-hugging slutty swimwear' && CoC.getInstance().player.armorName !== 'crotch-hugging revealing chainmail bikini' ) {
				EngineCore.outputText( '  You remove your ' + CoC.getInstance().player.armorName + ' piece by piece, leaving only the magically-altered centerpiece that your favorite demon ever so generously "<i>gifted</i>" to you.\n\n', false );
			}
			//[else];
			else {
				EngineCore.outputText( '  You glare at your ' + CoC.getInstance().player.armorName + ', its altered state so graciously bestowed upon you by the ever-thoughtful demon that resides in your crotch.\n\n', false );
			}

			EngineCore.outputText( 'After listlessly staring at your forced exhibitionism for a few seconds, your sleep anxiety wins over.  You bend over to begin taking off the article... only to find that it refuses to budge.  It acts as if it were adhered to your skin, resisting any actions to undo it from your groin.  After fidgeting with it for a few seconds, you let out an exasperated groan.  You\'re certainly in no mood to struggle with it nor who\'s responsible any further, reaching over and pulling up your covers.  One more sigh escapes your lips as you gaze upon the unsightly bulge before resting back on your pillow and closing your eyes.\n\n', false );
			//[new page. If lust <75, raise to 75];
			EngineCore.doNext( this.exgartuanBulgeTortureII );
			return;
		} else {
			EngineCore.outputText( 'Something interrupts your relatively peaceful sleep midway through the night.  Once pleasant dreams shift and morph to nightmares in a heartbeat!  You\'re gagging, choking even, and no matter how you twist and struggle you can\'t breathe!   Spikes of terror jump-start your heart and propel you back to wakefulness at breakneck speed.  Your eyes snap open and you try to sit up, but pain lances through your groin and throat, holding you in position.  Completely panicked, you look as far down as your restricted vision will allow and recoil in horror.  The bulging, veiny mass of your ' + Descriptors.cockDescript( 0 ) + ' is lodged deep in your throat, arching and twitching hard enough to slide itself in and out with gentle half-strokes.\n\n', false );
			EngineCore.outputText( 'With your diaphragm spasming wildly, you strain to pull in a single breath.  It doesn\'t work, and  the suction only makes your demon-infested dick bigger and thicker inside the constricting rings of your throat.  The taste is thick on your tongue, and the pleasure rises in equal parts with your panic until black rims the edge of your vision.  Your back arches with your body\'s struggles, and the rear of your airway opens enough for you to inhale a lungful of air through your nostrils.  The knowledge that you aren\'t going to suffocate on your own swollen cock-meat washes away the panic, leaving only the pleasure of the forced fellatio in its wake.\n\n', false );
			EngineCore.outputText( 'A voice thrums in your head, "<i>', false );
			//Split based on how often done;
			if( CoC.getInstance().flags[ kFLAGS.TIMES_AUTOFELLATIOED_EXGARTUAN ] === 0 ) {
				EngineCore.outputText( 'This is how you fucking please a dick!  If you aren\'t going to take care of our needs, then I will!  Every night if I have to!', false );
			} else if( CoC.getInstance().flags[ kFLAGS.TIMES_AUTOFELLATIOED_EXGARTUAN ] < 2 ) {
				EngineCore.outputText( 'Oh come on, remember how hard you came last time?  Why don\'t you stroke the shaft with your hands and I\'ll see if I can pump more into your belly.', false );
			} else if( CoC.getInstance().flags[ kFLAGS.TIMES_AUTOFELLATIOED_EXGARTUAN ] < 10 ) {
				EngineCore.outputText( 'How many times have we done this now?  It\'s probably past time you got used to sucking yourself off at night and quit making a fuss about it.  Now that you\'re awake, let\'s put that tongue to use and get to stroking.  I feel a big finish coming!', false );
			} else {
				EngineCore.outputText( 'Wakey wakey sleepyhead.  You know the routine.  Go ahead, ', false );
				if( CoC.getInstance().player.biggestTitSize() > 1 ) {
					EngineCore.outputText( 'wrap your tits around me and squeeze', false );
				} else {
					EngineCore.outputText( 'wrap your arms around me and stroke', false );
				}
				EngineCore.outputText( '.  We\'re so horny aren\'t we, my needy little champion?', false );
			}
			EngineCore.outputText( '</i>"\n\n', false );
			//(LOWCOR: ;
			if( CoC.getInstance().player.cor < 33 ) {
				EngineCore.outputText( 'You grab hold of the perverse prick with both hands, not to stroke it, but to try and pry the invader from your oral cavity by force.  The surface is slick with sweat and pre-cum, and your hands slide inexorably towards the ', false );
				if( !CoC.getInstance().player.hasSheath() ) {
					EngineCore.outputText( 'base', false );
				} else {
					EngineCore.outputText( 'sheath', false );
				}
				EngineCore.outputText( ' instead of pulling it free.  Your eyes cross from the feelings coming off your traitorous, possessed flesh after the accidental caress.  Both hands start to pump away, autonomously jacking the swollen demon-shaft into your mouth', false );
				if( CoC.getInstance().player.biggestTitSize() >= 2 ) {
					EngineCore.outputText( ' and bouncing your ' + Descriptors.allBreastsDescript() + ' around it', false );
				}
				EngineCore.outputText( '.  Moans of pleasure vibrate the ' + CoC.getInstance().player.cockHead() + ' lodged in your throat while bubbles of wetness begin to slide down the lower half of your esophagus into your gullet.\n\n', false );
			} else {
				//MED+ COR, NOT DONE A LOT:;
				if( CoC.getInstance().flags[ kFLAGS.TIMES_AUTOFELLATIOED_EXGARTUAN ] < 5 ) {
					EngineCore.outputText( 'You grab hold of your over-sized, demon-infested organ with both hands, resigned to this fate.  Even if you managed to stop Exgartuan now, he would just start all over again once you\'d fallen asleep.  The pre-slicked, veiny surface slides through your fingers, outputting a cacophony of pleasure through your nervous system.  Your eyes cross from the feeling, and you actually cry moans of need into your own ' + CoC.getInstance().player.cockHead() + '.  It vibrates pleasantly, dumping a few loads of pre-cum into your gullet while ', false );
					if( CoC.getInstance().player.biggestTitSize() >= 2 ) {
						EngineCore.outputText( 'you squeeze your tits around your ' + Descriptors.cockDescript( 0 ) + ' with your biceps', false );
					} else {
						EngineCore.outputText( 'you squeeze and caress your ' + Descriptors.cockDescript( 0 ), false );
					}
					EngineCore.outputText( '.  With both hands beginning to stroke faster and faster, you give yourself over to the corrupted lust that\'s burning in your veins.\n\n', false );
				}
				//(MED+COR, DONE A LOT:;
				else {
					EngineCore.outputText( 'You grab hold of the swollen flesh with both hands and start to stroke it, reveling at the feel of your palms sliding along the veiny, pre-cum slicked flesh.  You gurgle happily, your moans of pleasure vibrating the ' + CoC.getInstance().player.cockHead() + ' in your esophagus.  The swollen cock-tip dumps globules of pre-cum down your stretched throat, directly into your hungry gullet.  With both eyes crossed and your hands absorbed in fondling your member, you quickly forget your irritation at being woken up in such a way.  You get to cum SO HARD when you\'re fucking yourself like this!', false );
					if( CoC.getInstance().player.biggestTitSize() >= 2 ) {
						EngineCore.outputText( '  Your biceps squeeze around your ' + Descriptors.allBreastsDescript() + ', mashing them into your ' + Descriptors.cockDescript( 0 ) + ' and adding to the pleasure.', false );
						if( CoC.getInstance().player.hasFuckableNipples() && CoC.getInstance().player.biggestLactation() > 1 ) {
							EngineCore.outputText( '  Milk and lubricants ', false );
						} else if( CoC.getInstance().player.hasFuckableNipples() ) {
							EngineCore.outputText( '  Lubricants ', false );
						} else if( CoC.getInstance().player.biggestLactation() > 1 ) {
							EngineCore.outputText( '  Milk ', false );
						}
						if( CoC.getInstance().player.hasFuckableNipples() || CoC.getInstance().player.hasFuckableNipples() ) {
							EngineCore.outputText( ' from your ' + Descriptors.nippleDescript( 0 ) + ' puddle in the bouncing cleavage and turn your chest into a slip-n\'-slide for dicks.', false );
						}
					}
					EngineCore.outputText( '\n\n', false );
				}
			}
			//(Herms ahoy!);
			if( CoC.getInstance().player.gender === 3 ) {
				//(no balls);
				if( CoC.getInstance().player.balls === 0 ) {
					EngineCore.outputText( 'The ', false );
					if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness < AppearanceDefs.VAGINA_WETNESS_WET ) {
						EngineCore.outputText( 'puffy', false );
					} else if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness < AppearanceDefs.VAGINA_WETNESS_DROOLING ) {
						EngineCore.outputText( 'glistening', false );
					} else {
						EngineCore.outputText( 'dripping', false );
					}
					EngineCore.outputText( ' skin of your outer lips is engorged and ready, but there\'s no pleasure to be had for your greedy gash.  Cool night air washes over the exposed ', false );
					if( CoC.getInstance().player.skinType === AppearanceDefs.SKIN_TYPE_SCALES ) {
						EngineCore.outputText( 'scales', false );
					} else {
						EngineCore.outputText( 'skin', false );
					}
					EngineCore.outputText( ' surrounding your sex, teasing you with the barest hint of sensation while your ignorant hands maul your ' + Descriptors.cockDescript( 0 ) + ' at Exgartuan\'s behest.  If only you had taken care of yourself earlier, you might have had the control to slip a digit into your ' + Descriptors.vaginaDescript( 0 ), false );
					if( CoC.getInstance().player.clitLength > 3 ) {
						EngineCore.outputText( ' or stroke your ' + Descriptors.clitDescript(), false );
					}
					EngineCore.outputText( ' to fully satisfy ALL of yourself.', false );
					EngineCore.outputText( '\n\n', false );
				}
				//(Herms + Balls);
				else {
					EngineCore.outputText( 'The ', false );
					if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness < AppearanceDefs.VAGINA_WETNESS_WET ) {
						EngineCore.outputText( 'puffy', false );
					} else if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness < AppearanceDefs.VAGINA_WETNESS_DROOLING ) {
						EngineCore.outputText( 'glistening', false );
					} else {
						EngineCore.outputText( 'dripping', false );
					}
					EngineCore.outputText( ' skin of your outer lips is engorged and ready, but with your hands so focused on your ' + Descriptors.cockDescript( 0 ) + ', there\'s little for your ' + Descriptors.vaginaDescript( 0 ) + ' to feel.  The closest it gets to pleasure is the sensation of your ' + Descriptors.sackDescript() + ' slapping against it with the steady rhythm of your masturbation.  If only you had taken care of yourself earlier!  You might have had enough control over your rebellious tool to let a hand attend to your OTHER needs.\n\n', false );
				}
			}
			EngineCore.outputText( 'Spit foams around the tumescent intruder\'s girth, bubbling from the uncontrollable pistoning of Exgartuan\'s wrath at your ' + CoC.getInstance().player.face() + '.  The taut, bulging flesh of your own member is rammed so deeply into your own throat that you can feel the pre dripping into your stomach, but you want more.  ', false );
			if( CoC.getInstance().player.cor < 33 ) {
				EngineCore.outputText( 'The desire shocks you with the sheer... wrongness of it, but you cannot deny the pleasure of drilling your own slobbering mouth.', false );
			} else if( CoC.getInstance().player.cor < 66 ) {
				EngineCore.outputText( 'The desire sinks its hooks into the lust-addled flesh of your brain and drags you deeper into lust.  You can\'t deny the pleasure of drilling your own slobbering mouth.', false );
			} else {
				EngineCore.outputText( 'The desire rushes through your blood as you imagine how you must look, sprawled out, eyes rolled back, and cock drilling at your own slobbering mouth.', false );
			}
			EngineCore.outputText( '  Liquid-hot pressure slides over the underside of your ' + Descriptors.cockDescript( 0 ) + ', licking wetly at the pulsating, need-filled demon-prick.  Your rogue tongue\'s attentions have the desired effect, and the cries of your pleasure are muffled by your own thick flesh and its rapidly distending urethra.\n\n', false );
			EngineCore.outputText( 'If someone were watching', false );
			if( CoC.getInstance().scenes.jojoScene.monk >= 5 && CoC.getInstance().player.findStatusAffect( StatusAffects.NoJojo ) < 0 && CoC.getInstance().flags[ kFLAGS.JOJO_DEAD_OR_GONE ] === 0 ) {
				EngineCore.outputText( ', and judging by Jojo\'s high pitched whines, he certainly is,', false );
			}
			EngineCore.outputText( ' they\'d see dick-flesh bulging with a heavy load as it\'s pumped into your lips.  The fully-inflated cum-tube distends your mouth, stretching your jaw painfully, and dumps its creamy cargo into its willing receptacle.  Your belly burbles as it adjusts to the ', false );
			if( CoC.getInstance().player.cumQ() < 50 ) {
				EngineCore.outputText( 'surprisingly light', false );
			} else if( CoC.getInstance().player.cumQ() < 150 ) {
				EngineCore.outputText( 'sticky', false );
			} else if( CoC.getInstance().player.cumQ() < 300 ) {
				EngineCore.outputText( 'large, thick', false );
			} else if( CoC.getInstance().player.cumQ() < 800 ) {
				EngineCore.outputText( 'long, thick blast of your', false );
			} else {
				EngineCore.outputText( 'immensely voluminous', false );
			}
			EngineCore.outputText( ' deposit.  Quiet, barely audible squishes hang in the air around you as your gut is ', false );
			if( CoC.getInstance().player.cumQ() < 500 ) {
				EngineCore.outputText( 'pumped into', false );
			} else {
				EngineCore.outputText( 'pumped full', false );
			}
			EngineCore.outputText( ' with obscene, liquid sloshing.  Your ' + Descriptors.hipDescript() + ' and ' + Descriptors.assDescript() + ' rise off the ground with your back as your muscles lock', false );
			if( CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( ' and your ' + Descriptors.ballsDescriptLight() + ' pull tight against your groin from the effort', false );
			}
			EngineCore.outputText( '.', false );
			if( CoC.getInstance().player.cumQ() > 500 ) {
				EngineCore.outputText( '  A gradual curve quickly rises on your belly', false );
				if( CoC.getInstance().player.cumQ() > 1500 ) {
					EngineCore.outputText( ', but it doesn\'t stop there.  It keeps growing until you look full and pregnant.', false );
				} else {
					EngineCore.outputText( '.', false );
				}
				if( CoC.getInstance().player.cumQ() > 2500 ) {
					EngineCore.outputText( '  Back-pressure blasts your ' + Descriptors.cockDescript( 0 ) + ' free from your imprisoning oral cavity along with a fountain of seed while you weakly try to cough out enough spooge to breathe.', false );
				}
			}
			EngineCore.outputText( '\n\n', false );
			if( CoC.getInstance().scenes.jojoScene.monk >= 5 && CoC.getInstance().player.findStatusAffect( StatusAffects.NoJojo ) < 0 && CoC.getInstance().flags[ kFLAGS.JOJO_DEAD_OR_GONE ] === 0 ) {
				EngineCore.outputText( 'The splatter of mouse-cum erupting in the wood reaches your ears, bringing a wistful smile to your face.  That slutty mouse is such a peeping tom!  ', false );
			}
			EngineCore.outputText( 'Your eyes slowly roll back down while Exgartuan deflates, leaving a trail of pleased, white submission ', false );
			if( CoC.getInstance().player.biggestTitSize() < 1 ) {
				EngineCore.outputText( 'over your chest', false );
			} else {
				EngineCore.outputText( 'between your tits', false );
			}
			EngineCore.outputText( ' and across your belly as he retreats.  The thrill of orgasm is still fresh in your mind, but exhaustion quickly replaces it.  You resolve to clean up the mess in the morning as your eyelids flutter closed.  The smell of sex hangs off your dozing form like a cloud, keeping your dreams from straying too far from your cock...', false );
			//[-100 lust, then +10 lust immediately, +1 libido to 60, then +.5 libido to 80, then +.25 libido.  +1 sensitivity.  +1 corruption];
			CoC.getInstance().player.orgasm();
			EngineCore.dynStats( 'sen', 1, 'cor', 1 );
			if( CoC.getInstance().player.lib < 60 ) {
				EngineCore.dynStats( 'lib', 1 );
			} else if( CoC.getInstance().player.lib < 80 ) {
				EngineCore.dynStats( 'lib', 0.5 );
			} else {
				EngineCore.dynStats( 'lib', 0.25 );
			}
			EngineCore.dynStats( 'lus', 10 );
			CoC.getInstance().flags[ kFLAGS.TIMES_AUTOFELLATIOED_EXGARTUAN ]++;
			CoC.getInstance().player.slimeFeed();
		}
		CoC.getInstance().player.changeStatusValue( StatusAffects.Exgartuan, 2, 25 );
		EngineCore.doNext( EventParser.playerMenu );
	};
	Exgartuan.prototype.exgartuanBulgeTortureII = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'After what feels like only a few minutes, you begin to feel as if you were sizzling beneath your sheets.  After a few half-hearted tosses and turns, inhibited by your bulging lower half, you surrender and throw off your covers.  At this point, you are almost wide awake, too focused on your increased breathing and uncomfortable temperature.  A few more moments slip by before you realize what\'s going on, alerted by your involuntary reach for your cock to find any sort of relief getting horny.  As to how it\'s happening, you aren\'t entirely clear yet.  But it certainly isn\'t new to you nor is it strange for this to be happening in a place as strange as Mareth.  For all you know, this could be some natural occurrence brought in by the weather or a nearby tree or something.  Like pollen... except you want to have sex instead of suffer from congestion.\n\n', false );
		EngineCore.outputText( 'You again reach for ', false );
		if( CoC.getInstance().player.armorName !== 'crotch-hugging slutty swimwear' && CoC.getInstance().player.armorName !== 'crotch-hugging revealing chainmail bikini' ) {
			EngineCore.outputText( 'your last remaining piece of ' + CoC.getInstance().player.armorName, false );
		}//[else];
		else {
			EngineCore.outputText( 'your ' + CoC.getInstance().player.armorName, false );
		}
		EngineCore.outputText( ' to find it still firmly attached to your midsection.  What\'s more, as you begin to feel around it, you find to your surprise that ', false );
		//[if armorname IS EQUAL TO "<i>crotch-hugging full platemail</i>" OR "<i>crotch-hugging scale-mail armor</i>"];
		if( CoC.getInstance().player.armorName === 'crotch-hugging full platemail' || CoC.getInstance().player.armorName === 'crotch-hugging scale-mail armor' ) {
			EngineCore.outputText( 'your ' + CoC.getInstance().player.armorName + ' feels as if it\'s become incredibly stiff, refusing to neither budge your package or impart any sense of feeling or vibration to what lies underneath.', false );
		}
		//[if armorname IS EQUAL TO "<i>crotch-hugging practically indecent steel armor</i>" OR "<i>crotch-hugging full-body chainmail</i>" OR "<i>crotch-hugging revealing chainmail bikini</i>"];
		if( CoC.getInstance().player.armorName === 'crotch-hugging practically indecent steel armor' || CoC.getInstance().player.armorName === 'crotch-hugging full-body chainmail' || CoC.getInstance().player.armorName === 'crotch-hugging revealing chainmail bikini' ) {
			EngineCore.outputText( 'your ' + CoC.getInstance().player.armorName + ' feels as if it\'s become incredibly dense, refusing to neither budge your package or impart any sense of feeling or vibration to what lies underneath.  What\'s worse, the links that make up your armor have narrowed and sealed shut.', false );
		} else {
			EngineCore.outputText( 'your ' + CoC.getInstance().player.armorName + ' feels as if it were made from 6</i>" thick steel, refusing to neither budge your package or impart any sense of feeling or vibration to what lies underneath.  You continue to run your hands across it, having trouble believing that the material has become so incredibly dense and rigid despite its appearance.', false );
		}
		EngineCore.outputText( '  A little more pushing, pulling, knocking, groping, and stroking confirms what you feared ' + Descriptors.cockDescript( 0 ) + ' has been cordoned off from you', false );
		if( CoC.getInstance().player.balls > 0 || CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( ' along with anything else unlucky enough to reside within', false );
		}
		EngineCore.outputText( '.\n\n', false );
		EngineCore.outputText( 'Damnable demon.  He doesn\'t even have the decency to taunt you- or even acknowledge your presence.  You bang your fists against your blighted dick, still unable to register any contact through the tightly-fitted obstruction (and secretly relieved you didn\'t injure yourself.)  You flop back down onto your back, determined to find some other way to satiate your lust.  Invigorated with their new mission, your hands begin to scour the remaining surface of your body, willing fingertips gently brushing your skin in search of a target.', false );
		//[if one row of breasts];
		if( CoC.getInstance().player.biggestTitSize() >= 2 && CoC.getInstance().player.bRows() === 1 ) {
			EngineCore.outputText( '  Your quest begins squarely on your pair of ' + Descriptors.chestDesc() + ', your mitts feverishly groping and tugging away in the hope of finding any sanctuary from your encroaching lust.  Unable to extract any meaningful solace from your magnificent mounds, your sights set on your ' + Descriptors.nippleDescript( 0 ) + 's.', false );
		}//[if ≥2 rows of breasts];
		else if( CoC.getInstance().player.biggestTitSize() >= 2 ) {
			EngineCore.outputText( '  The ' + Descriptors.allBreastsDescript() + ' lined down your chest should serve a proper conquest.  Your palms set off to work at once, manhandling as much titflesh as they can satisfy at once.  They dart from one row to the next, inside to out, anything to relieve your libido.  You don\'t appear to be settling down any, however, so you draw your focus on your top row of ' + Descriptors.nippleDescript( 0 ) + 's.', false );
		} else {
			EngineCore.outputText( '  With little else to turn to, your ' + Descriptors.nippleDescript( 0 ) + 's are your only guiding light to hopefully bringing you the peace you crave.', false );
		}
		//[if nipplecunts];
		if( CoC.getInstance().player.hasFuckableNipples() ) {
			EngineCore.outputText( '  You waste little time in pushing four fingers into each gaping teat, anxious for any sort of pleasure.  You tickle and tease, push and pull, anything you can think to release you from this torment.', false );
		} else {
			EngineCore.outputText( '  A little tapping, tickling, and teasing is about all the effort you can seem to muster.', false );
		}
		EngineCore.outputText( '  Too preoccupied with whatever\'s going on down below, you can\'t seem to focus enough to get the job done right.  Your peer down your body at your ' + Descriptors.cockDescript( 0 ) + ', still flaccid and on lockdown.  The most you can respond is with another deep sigh, retreating your attention to the canvas up above you.  You figure the best course of action from here is to just try and make it until morning when you can find some help.  Confessing shame to some third party seems a much better alternative to going any more rounds with this nonsense.  Your fists clench and you take some deep breaths, prepared to ride out the remainder of the night with your sanity intact.\n\n', false );
		//[new page. lust raises to 100];
		EngineCore.dynStats( 'lus=', 1000 );
		EngineCore.doNext( this.exgartuanBulgeTortureIII );
	};
	Exgartuan.prototype.exgartuanBulgeTortureIII = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'Fueled by pure spite and just a hint of loathing, you begin to regain some sort of composure through controlled breathing and what little concentration you can manage.  A few minutes of counting stitches in the top of your tent is all you accomplish, however; your once dormant limp ' + Descriptors.cockDescript( 0 ) + ' is showing a sign of life. Your eyes widen as you feel your possessed pole stiffen up, pressing hard against your ' + CoC.getInstance().player.armorName + ' as it grows out along with your dick, still impossibly clinging to its every facet.  It stops after only gaining a few inches, but not before driving the fight right back out of you.  Thread-counting is the last thing in your head as you quickly sit right back up, instinctually grasping for your cock.  But the situation refuses to change; your ' + CoC.getInstance().player.armorName + ' is just as exceedingly resilient as it was before.\n\n', false );
		EngineCore.outputText( 'Your desire only increasing, you begin desperately clawing at the edges of your ' + CoC.getInstance().player.armorName + '.  Your stuck skin only grows red from your efforts, eschewing even the notion that it might break free.  Your breathing begins to draw to a panicked pace as you stop and try to form some coherent thought.  The best your lust-addled brain can come up with is to try moving your ' + Descriptors.hipDescript() + ', and see if you can make any contact with your imprisoned penis.  Grinding, thrusting... anything you can think of to just make the slightest bit of contact.  However, your only accomplishment is in putting your ' + CoC.getInstance().player.legs() + ' to sleep.  A tingling sensation works it way down your lower half, followed by numbness.  But before you can start adding that to your frustrations, a glint of something catches your eye- a single bead of pre-cum resting on the tip of your slightly hard ' + Descriptors.cockDescript( 0 ) + ', around an inch in diameter if you had to guess.', false );
		//[if armorname IS EQUAL TO "<i>crotch-hugging full platemail</i>" OR "<i>crotch-hugging scale-mail armor</i>"];
		if( CoC.getInstance().player.armorName === 'crotch-hugging full platemail' || CoC.getInstance().player.armorName === 'crotch-hugging scale-mail' ) {
			EngineCore.outputText( '  As you stare in bewilderment, you can\'t even begin to fathom how it possibly seeped through the steel of your solid ' + CoC.getInstance().player.armorName, false );
		}
		//[if armorname IS EQUAL TO "<i>crotch-hugging practically indecent steel armor</i>" OR "<i>crotch-hugging full-body chainmail</i>" OR "<i>crotch-hugging revealing chainmail bikini</i>"];
		else if( CoC.getInstance().player.armorName === 'crotch-hugging practically indecent steel armor' || CoC.getInstance().player.armorName === 'crotch-hugging full-body chainmail' || CoC.getInstance().player.armorName === 'crotch-hugging revealing chainmail bikini' ) {
			EngineCore.outputText( '  Your fixation on the drop draws to question just how it managed its way through the sealed chains of your ' + CoC.getInstance().player.armorName, false );
		} else {
			EngineCore.outputText( '  A strange feeling of betrayal casts over as you begin to question how the liquid worked its way through the material when none of your struggles have registered even the slightest sensation.', false );
		}
		EngineCore.outputText( '  You run your thumb and forefinger through it, skeptical of your eyes\' discovery.  All it takes is that familiar touch followed by that telltale aroma to further break down what last defenses your brain was mounting against your all-consuming avidity.\n\n', false );
		EngineCore.outputText( 'Eyes re-widened, teeth clenched, you grasp for where the glans of your ' + Descriptors.cockDescript( 0 ) + ' would be, letting out an anguished groan.  You slam your vision shut in frustration, whirling your body around to begin slamming the unflinching codpiece repeatedly into your bedroll.  Over and over again, the concrete mass just refuses to budge.  Shaking adds on to your list of symptoms brought on by your maddening lust.  Your arms and legs simply unable to maintain your inconsequential thrusting, your body goes limp leaving your midsection held awkwardly in the air by the bane of your existence.  At this point, your breathing has reached a fevered rate while your entire body is moist from sweat.  Running out of options your disoriented wits can work out, your frenzied gaze darts out at the opening of your tent that you neglected to shut earlier.  Desperate to find anything you can use, you begin dragging yourself out of the tent towards the smoldering embers that remain of your campfire, your solid ' + CoC.getInstance().player.armorName + ' grinding uselessly away beneath you.  It becomes harder to make out where you\'re going as your vision begins to cloud and shake, your nervous trembling having made its way to your eyes.  It seems to require every fiber of your being with each pull and tug you make, your ' + CoC.getInstance().player.legs() + ' growing more ineffective as they become more numb and slick.\n\n', false );
		EngineCore.outputText( 'You find the first bit of relief all night when you take your first swing outside.  The crisp night air is cool compared to inside your tent.  But the comfort is quickly forgotten as you stop to try and calm your nerves, the shaking and breathing making your struggle all the more difficult.  You unfortunately fail to accomplish little more than further aggravation, so you continue your desperate trek in search of something... anything... that you can use.  Unable to see straight or anything more than blurs at this point, you accidentally throw a hand into the remains of your campfire, snuffing out what little light it had to offer, leaving only the faint blue glean of the portal to intermingle with the blood-red glow of the moon overhead.  You recoil your hand in agony, a long, pained, frustrated moan escaping through your gnashing teeth.  Tears welling in your eyes, you can only make out pale blue and red blobs all around you. You muster the last of your strength to push yourself onto your back, your body too uncomfortable to continue pressing down on your confined cock.\n\n', false );
		EngineCore.outputText( 'Your frantic breathing seems to be competing with your pounding heartbeat, acting as if it were emanating from within your skull.  Your hands cling to the dirt and scant pieces of grass below you, unable to stop shaking or heed any of your commands.  Your already obscured vision begins to darken, more and more of the vague blobs fading into darkness.  Your ' + CoC.getInstance().player.legs() + ' continue their numb strike against you while helping your ' + CoC.getInstance().player.feet() + ' dig helplessly into the ground.  0...You\'ve run out of ideas, left with an insatiable hunger for sex, a body that refuses to do little more than convulse, and a mound of misfortune where your crotch resides.\n\n', false );
		EngineCore.outputText( 'However, just before you can give up the ghost, the aforementioned mound begins stirring yet again.  A belabored moan is all you can muster, begging for this torment to cease.  Suddenly, the chill air makes contact below your waistline.  You try to raise your head to make sure you haven\'t gone even more insane, your tense muscles able to lift it enough to see that your ' + CoC.getInstance().player.armorName + ' has started to split down the middle.  You dig your hands deeper into the ground in an attempt to make sure you haven\'t started hallucinating, too.  But as the cool air hits your newly exposed skin, any lingering doubts begin to fade away, replaced by mounting awe.  As your outfit continues to crack open, a heady musk hits you like a ton of bricks, furthering your deranged desire.  The rupture continues straight down the middle of your garb, uncovering the base of your cock to the elements and filling it with a newfound life as it begins to pulsate.  Your ' + Descriptors.cockDescript( 0 ) + ' resembles a butterfly emerging from a cocoon, complete with a layer of pre coating its every facet.  Rational thought struggles to reside in your paralyzed state, awestruck as your rod breaks free from its cell and reaches for the sky.  Liquid strands cling helplessly or fall back down to earth as it swells to full size- maybe even a little bigger.', false );
		//[if cocks ==2];
		if( CoC.getInstance().player.cockTotal() === 2 ) {
			EngineCore.outputText( '  Your ' + Descriptors.cockDescript( 1 ) + ' remains flaccid beside this bronze adonis, as if sapped of all its life.', false );
		}//[if cocks ≥3];
		else if( CoC.getInstance().player.cockTotal() > 2 ) {
			EngineCore.outputText( '  Your extra cocks remain flaccid beside this bronze adonis, as if sapped of all their life.', false );
		}
		EngineCore.outputText( '  Through the blurry, trembling mess that is your vision, you can make out the mighty titan, its figure silhouetted against the blood-red moon behind it.  After what feels like forever, your majestic manhood slowly descends from its great heights towards you, pulsating in time with your frenzied heartbeat.  As if it were a god descending from heaven to bless a mortal, the ' + Descriptors.cockDescript( 0 ) + ' stops right above your gaze, its urethra slowly widening, continuing to spill pre-cum all over your plagued form.\n\n', false );
		EngineCore.outputText( 'A lifetime seems to have passed by in that dead stare.  You manage to catch your breath, your shuddering body calming as it prepares for salvation.', false );
		//[if first occurrence of scene];
		if( CoC.getInstance().flags[ kFLAGS.EXGARTUAN_TIGHTPANTS_MASTURBATE_COUNT ] === 0 ) {
			EngineCore.outputText( '  No words are exchanged; no thoughts dare to cross your mind. The only sound is that of your heart, its rhythm acting as prelude for the action you desperately covet.  Mixed emotions of guilt, fright, awe, and satisfaction claw at you.', false );
		}
		//[if occurrence ≥2];
		else if( CoC.getInstance().flags[ kFLAGS.EXGARTUAN_TIGHTPANTS_MASTURBATE_COUNT ] < 6 ) {
			EngineCore.outputText( '  "<i>Your will cannot even begin to compare to my might, my helpless little champion. You really shouldn\'t continue acting as if you\'re above temptation; I\'d hate to see what would happen.</i>"', false );
		}
		//[if occurrence ≥6];
		else if( CoC.getInstance().flags[ kFLAGS.EXGARTUAN_TIGHTPANTS_MASTURBATE_COUNT ] >= 6 && CoC.getInstance().flags[ kFLAGS.EXGARTUAN_TIGHTPANTS_MASTURBATE_COUNT ] < 10 ) {
			EngineCore.outputText( '  "<i>You know, I never thought I would enjoy even the mere thought of celibacy-not even for a moment.  But watching such an <b>honest</b> champion break down to a quivering pile of helplessness is worth it when the attention I receive afterward is so... thorough.</i>"', false );
		}
		//[if occurrence ≥10];
		else if( CoC.getInstance().flags[ kFLAGS.EXGARTUAN_TIGHTPANTS_MASTURBATE_COUNT ] >= 10 && CoC.getInstance().flags[ kFLAGS.EXGARTUAN_TIGHTPANTS_MASTURBATE_COUNT ] < 12 ) {
			EngineCore.outputText( '"<i>I can keep this up much longer than you can, ' + CoC.getInstance().player.armorName + '.  As much as I enjoy watching you struggle to maintain some form of morality and moderation, I would much rather be exploring the world and its many orifices.  Some day you\'ll leave that fantasy realm you keep running to and join me in the real world.</i>"', false );
		}
		//[if occurrence ≥12];
		else {
			EngineCore.outputText( '"<i>Oh, it\'s that time again, I see.  Sorry, I was still thinking about how much I enjoyed myself the <b>last</b> occasion you tried to forget about me!  Well, let\'s not waste any more time; you know the routine.</i>"', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'Exgartuan.\n\n', false );
		EngineCore.outputText( 'The self-proclaimed "<i>Devil of Dickings</i>" is finally through teasing you.  Before you can begin to think about how to respond- as if you could- something triggers in your mind.  Like a sprinter at the sound of the starting pistol, you leap forward onto him, your arms excitedly grasping all over the ' + Descriptors.cockDescript( 0 ) + '.  They work their way around each of his nodules and nubs that they can find, yearning to satisfy the demon by any means necessary.  Not to be outdone, your tongue furiously traverses his sensitive skin, making its way to his glans.', false );
		//[if breasts present];
		if( CoC.getInstance().player.biggestTitSize() > 1 ) {
			EngineCore.outputText( '  Your ' + Descriptors.chestDesc() + ' work just as hard, smothering Exgartuan in all of their jiggly glory.', false );
		}
		EngineCore.outputText( '  From base to tip, you leave no skin, vein, bump, or glan untraced; all the while covering yourself in the devil\'s endless demonic drizzle.  Unearthly pleasure responds to your every effort, preparing you to move on to the climax.  You lighten your full embrace, firmly grasping the ' + Descriptors.cockDescript( 0 ) + ' with both hands, and commence working his entire shaft.  You try to maintain some semblance of pace, but in your dazed, wanton state you quickly ratchet up your speed.', false );
		//[if scrotum present];
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( '  Your ' + Descriptors.ballsDescriptLight() + ' churn with mighty force, roiling in anticipation.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'Your breath ceases as your ', false );
		//[if cumQ()<50];
		if( CoC.getInstance().player.cumQ() < 50 ) {
			EngineCore.outputText( 'modest', false );
		}//[if cumQ()<150];
		else if( CoC.getInstance().player.cumQ() < 150 ) {
			EngineCore.outputText( 'sizably sticky', false );
		}//[if cumQ()<300];
		else if( CoC.getInstance().player.cumQ() < 300 ) {
			EngineCore.outputText( 'mighty thick', false );
		}//[if cumQ()<800];
		else if( CoC.getInstance().player.cumQ() < 800 ) {
			EngineCore.outputText( 'immensely voluminous', false );
		}
		//[else];
		else {
			EngineCore.outputText( 'monumental', false );
		}
		EngineCore.outputText( ' load works its way up the demon.  However, moments before your eruption, Exgartuan pulls free from your clutches, spreading his urethra wide as he again faces you.  Before you can even put on a puzzled expression, ', false );
		//[cumQ()<500];
		if( CoC.getInstance().player.cumQ() < 500 ) {
			EngineCore.outputText( 'a blast of thick demonic jizz', false );
		}//[else];
		else {
			EngineCore.outputText( 'a colossal wave of heavy demonic jizz', false );
		}
		EngineCore.outputText( ' hits you square in the face.  The surprising force of the blow sends you reeling, your hands clearing from the mighty demon as he points skyward, showering everything around you in black, warm ejaculate.  You care little, however, being too busy convulsing and indulging on every ounce of pleasure radiating through it.  It doesn\'t take long for you to black out, drawing an end to your excruciating experience.\n\n', false );
		//[new page. lust resets to 0. corruption raises by 2. player gains ailment "<i>Jizzpants</i>"];
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'cor', 2 );
		EngineCore.doNext( this.exgartuanBulgeTortureIV );
	};
	Exgartuan.prototype.exgartuanBulgeTortureIV = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You wake the next morning, nestled inside your bedroll.  Realizing where you are, a relaxing feeling of easiness washes over you.  You throw off your cover to greet the day, only becoming confused as it peels off your sticky skin.  You glance down at your waist, still wearing ', false );
		//[if armorname IS NOT EQUAL TO "<i>crotch-hugging slutty swimwear</i>" OR "<i>crotch-hugging revealing chainmail bikini</i>"];
		if( CoC.getInstance().player.armorName !== 'crotch-hugging slutty swimwear' && CoC.getInstance().player.armorName !== 'crotch-hugging revealing chainmail bikini' ) {
			EngineCore.outputText( 'your ' + CoC.getInstance().player.armorName, false );
		} else {
			EngineCore.outputText( 'the single piece of your ' + CoC.getInstance().player.armorName, false );
		}
		EngineCore.outputText( '.  As you rise to your feet, a few streams of cum run down your ' + CoC.getInstance().player.legs() + '.', false );
		//[If any followers];
		if( CoC.getInstance().scenes.camp.hasCompanions() ) {
			EngineCore.outputText( '  For a moment, you consider asking someone outside if they remember anything from last night.  But you decide it\'s better to just keep it to yourself, afraid of what you might find out.', false );
		}//[else];
		else {
			EngineCore.outputText( '  You glance around at your tent, searching for anything that may clue you in on what transpired last night.  After a few moments, however, you decide it better to just move on with your day.', false );
		}
		EngineCore.outputText( '  You pay one more glance to Exgartuan, the ' + Descriptors.cockDescript( 0 ) + ' comfortably resting away in your outfit.\n\n', false );
		EngineCore.outputText( 'Damn demons.', false );
		CoC.getInstance().player.changeStatusValue( StatusAffects.Exgartuan, 2, 25 );
		EngineCore.doNext( EventParser.playerMenu );
	};
	//Exgartuan in breasts;
	//≥48 hours since Boobgartuan masturbation scene. ;
	//Random chance for occurrence once requirement met.;
	//Player going to sleep, duh;
	//3:00AM;
	Exgartuan.prototype.boobGartuanSURPRISE = function() {
		EngineCore.spriteSelect( 15 );
		//[if occurrence ==0];
		if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] === 0 ) {
			EngineCore.outputText( 'The sound of little snickering voices wakes you from your slumber.  A couple of imps are chattering to one another, one of which has his hand under his loincloth, making a night of it.  You think to move, but find both of your arms sprawled and padlocked to the wall behind you, your naked body dangling helplessly against it.  A quick glimpse around reveals your cobblestone dwelling small dank, dimly lit room with no windows and a few knick knacks and perverted toys spread haphazardly against the walls.  Offset towards the middle of the room lies an ordinary wooden table, some gold coins, jugs, and a leather pouch of some sort sit atop it.  Before you can get a good look at it, one of the imps snaps to attention, hitting the... preoccupied one in the chest, "<i>Look alive, idiot!  The ' + CoC.getInstance().player.mf( 'chump', 'skank' ) + '\'s wakin\' up.  Git\' the boss!</i>" The second imp\'s hand flies free from his crotch, scattering some semen to the air.  He responds with a slack-jawed nod, proceeding to bang twice on the large wooden door beside him.  After a moment\'s pause, you can make out the sound of wood hitting stone mixed with bare footsteps.\n\n', false );
			EngineCore.outputText( 'The door barges open, a four foot tall imp standing in its place.  He\'s holding a large cane in the air, presumably what he used to throw the door open.  His other hand is behind his back, hiding something from your view.  The miniature monster is a little more chiseled than his foppish brethren, sporting a large eye patch covering the left side of his face and what looks like a short pair of tiger skin overalls instead of the standard loincloth.  Evidently, the imp must think very highly of himself.\n\n', false );
			EngineCore.outputText( '"<i>' + CoC.getInstance().player.short + '!</i>" he shouts snidely, a sneer working its way across his face, "<i>How long has it been?</i>"\n\n', false );
			EngineCore.outputText( '"<i>', false );
			if( CoC.getInstance().player.cor < 33 ) {
				EngineCore.outputText( 'Not long enough, Nemus, I\'m afraid!', false );
			} else if( CoC.getInstance().player.cor < 66 ) {
				EngineCore.outputText( 'Too long, honestly.  You\'ve grown slow over the years, Nemus,', false );
			} else {
				EngineCore.outputText( 'I was worried you\'d forgotten about me, Nemus.  You never write,', false );
			}
			EngineCore.outputText( '</i>" you reply, throwing back his sarcastic expression.\n\n', false );
			EngineCore.outputText( 'The imp snickers to himself, beginning to draw in closer towards you.  There\'s a bit of a limp to his step, granting an explanation to the cane.  Along the way, the imp extends his walking stick beneath the table, hooking it on a little stepstool and dragging it out in front of you.  Even with the leverage, his eyes only meet your lower lip.  "<i>Three long years, ' + CoC.getInstance().player.short + '.  Three years... to take back what\'s rightfully mine.</i>"\n\n', false );
			EngineCore.outputText( 'Nemus slowly peers towards the table, staring at the leather pouch.  You catch a glint off of its special contents.  "<i>I never would have guessed that you\'d have delivered the idol straight to me after all this time!</i>" The grin widens on the imp\'s face as he begins to pull his concealed hand from behind his back, "<i>It\'ll go wonderfully with my own.</i>" He slowly unfurls his fingers, revealing the large golden idol stiff statue bearing a resemblance to that of Incan relics, only it of course sports a massive vertical erection.  A perfect duplicate of the one you previously owned.\n\n', false );
			EngineCore.outputText( '"<i>Finally, with both idols I can finally unlock Ecsepoan\'s tomb... and claim his ancient power.</i>" Nemus clenches the idol in his palm, his snide expression growing more deranged, "<i>This world will grovel at my feet, as it has always meant to be.</i>"\n\n', false );
			EngineCore.outputText( 'Your face remains calm, a hint of superiority still swimming through it, "<i>Will it really be that simple, Nemus? We both know there\'s more to that tomb than...</i>"\n\n', false );
			EngineCore.outputText( 'Your warning turns to moaning as the imp\'s hands quickly latch onto your ' + Descriptors.chestDesc() + ', discarding the walking stick and golden idol to the hard floor.  "<i>I don\'t need any of your words of wisdom, ' + CoC.getInstance().player.short + ',</i>" Nemus teases, his eyes meeting yours while he continues to caress your breasts, "<i>You are little more than my trophy now.  Hardly a position befitting of giving advice, wouldn\'t you agree?</i>" You start to tilt your head back as his grubby mitts continue to grope your massive mammaries.  The fiend slowly moves in on you, his unkempt nails teasing your sensitive ' + CoC.getInstance().player.skin() + '.  You begin to feel the rough fabric of his overalls brushing up against you, brought on by his stiffening member.  Nemus continues to draw closer to you.\n\n', false );
			EngineCore.outputText( 'Suddenly, the pleasure vanishes from your face, your now determined gaze locked onto the little wretch.  Before he has a chance to respond, your forehead viciously slams into his own, knocking the lust right out of him as he staggers off of the stepstool and falls to the ground.  The spectating imps recoil in fear by your outburst, trembling even further once your unwavering leer redirects to them.  You plant your feet on the stepstool for leverage and clench your hands into fists.  With seemingly little effort you flex them forward, shattering your shackles.  The imps\' eyes are as large as saucepans after witnessing your tremendous feat.  A thought works its way through the paralyzing fear into the second imp, causing him to slap some sense into his friend, "<i>Sound th\' alarm, idiot!</i>"\n\n', false );
			EngineCore.outputText( 'The first imp nods, his eyes still stricken with fear.  As he dashes for the odd contraption in the corner of the cell, you lunge for a leather whip resting against the wall beside you.  His feeble arm stops short of what looks like a trumpet mouthpiece in the wall, caught by your weapon.  In the blink of an eye, you yank the imp up into the air towards you, drop the whip in order to orient your fist towards him, and fire it into his ugly mug.  For a split second, you can make out his head attempting to wrap itself around your hand as it distorts from the sheer force of the blow.  The imp sails backwards head over heels careening into his friend, knocking the two of them out.\n\n', false );
			EngineCore.outputText( 'Pleased with your work, you rub your knuckles a little before wandering over to the table and scooping up the leather pouch.  It fits as well as it always has once you sling it around your body.  You turn and approach Nemus, the little bastard trying to scowl at you in between lingering spasms and clenching his head.  "<i>', false );
			if( CoC.getInstance().player.cor < 33 ) {
				EngineCore.outputText( 'I always wondered where you kept this.', false );
			} else if( CoC.getInstance().player.cor < 66 ) {
				EngineCore.outputText( 'This is one delivery that you\'ll just have to return to sender, I\'m afraid.', false );
			} else {
				EngineCore.outputText( 'You scheme about as well as you fuck, Nemus.', false );
			}
			EngineCore.outputText( '</i>" you tease, bending down to scoop up the second idol and place it firmly in your leather pouch.  You quickly gesture goodbye to Nemus before bolting for the door.\n\n', false );
		} else {
			this.boobgartuanSurprise3();
			return;
		}
		//[new page];
		EngineCore.doNext( this.boobgartuanSurprise2 );
	};
	Exgartuan.prototype.boobgartuanSurprise2 = function() {
		EngineCore.spriteSelect( 15 );
		EngineCore.outputText( '', true );
		if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] === 0 ) {
			EngineCore.outputText( 'There\'s no time to be deciding on which cardinal direction to walk in once you exit the room; your efforts have garnered some unwanted attention.  The sound of blaring horns can be heard overhead, far off imp squeaks and squabbles slowly growing louder.  You haul ass in the opposite direction to the east and pull yourself down the next corner on your left, following what sounds like a rough thunderstorm outside.  Your effortless strides along the slick cobblestone ground come to a screeching halt soon after.  It would appear you\'ve made it to a small dining hall, littered with debris and discarded weaponry.  Directly across the room from you lies the door to the courtyard, your last stop on the train to freedom.  But there\'s an imp in the way.\n\n', false );
			EngineCore.outputText( 'However, this is no ordinary imp; if it was, you would have already pummeled the shit out of it.  Blocking the egress stands Teensy, an obviously ironic nickname for the seven foot tall, incredibly muscular, armor-plated behemoth.  Sporting armored padding along his extremities and head, this freak rocks an enormous ironclad chin, the resulting underbite dwarfing his otherwise miniscule head and beady eyes.  Other than the aforementioned armor running along his arms, knees and head, the brute is completely naked, his gigantic ballsack swaying in the breeze.  The lout is poised in the frame, legs bent and arms spread like a defensive lineman, denying you precious freedom.\n\n', false );
			EngineCore.outputText( '"<i>', false );
			if( CoC.getInstance().player.cor < 33 ) {
				EngineCore.outputText( 'Hey, Teensy, remember me?</i>"', false );
			}
			//[if corruption ≥30 & <70];
			else if( CoC.getInstance().player.cor < 66 ) {
				EngineCore.outputText( 'I see you haven\'t gotten any prettier since last time we met, Teensy.</i>"', false );
			}
			//[if corruption ≥70];
			else {
				EngineCore.outputText( 'Timed to get fucked, stud,</i>"', false );
			}
			EngineCore.outputText( ' you jest.  The mongrel merely snarls at you and tenses up, your attempt at coy negotiations deflecting off of his dull cranium.  The commotion behind you begins to grow louder; there isn\'t much more time until the cavalry arrives.  You begin quickly scanning the room, searching for anything you can use against the lummox.  Up above him, you spy several sizable barrels.  They appear ancient and low maintenance, judging by the rickety-looking wood and leaking liquid.\n\n', false );
			EngineCore.outputText( 'The imps round the bend behind you, leaving little more time to formulate your plan.  You scoop up a haggard looking broadsword sitting against the wall, grasping it by its guard with both hands.  You begin spinning in place like a rookie discus thrower, the sword orbiting around you with its dull blade facing out.  With the firm planting of your ' + CoC.getInstance().player.leg() + ' you release your grasp on the sword and send it soaring, your ' + Descriptors.chestDesc() + ' very nearly throwing you off your balance as they continue their circular trajectory.\n\n', false );
			EngineCore.outputText( 'The monster imp raises his arm-guards to project his maw, bracing for a blow that never comes.  Instead, the massive sword plows into the barrel overhead, drenching the goon and surrounding area in red wine.  You\'re left with no time to celebrate, though, as the encroaching imps have made it to your position.  You dash towards Teensy as the buffoon stumbles around in place, going into a dive feet-first and sailing right underneath him thanks to the wine-slicked floor.  ', false );
			//[if corruption <30];
			if( CoC.getInstance().player.cor < 33 ) {
				EngineCore.outputText( 'Your ' + Descriptors.chestDesc() + ' brush against the imp\'s enormous scrotum, causing him to eventually tumble over from the sensation, blocking the impeding entourage of imps behind you.', false );
			}
			//[if corruption ≥30 & <70];
			else if( CoC.getInstance().player.cor < 66 ) {
				EngineCore.outputText( 'As you coast under the beast, you take the opportunity to slap around his crown jewels, playing them as if they were a novelty pair of bongos.  The sensation causes him to tumble over, blocking the impeding entourage of imps behind you.', false );
			} else {
				EngineCore.outputText( 'A devilish smile cracks across your face as you coast under the lummox, delivering a quick peck of a kiss on his hanging ballsack.  The sensation causes him to tumble over in confusion, blocking the impeding entourage of imps behind you.', false );
			}
			EngineCore.outputText( '\n\n', false );
			EngineCore.outputText( 'A crack of lightning greets your arrival as you step out into the ferocious thunderstorm, rain soaking your naked form.  A football field\'s length of muddy courtyard sits between you and the outer wall of the imp fortress.  Just as you\'re about to get going again, the sound of a door banging open on the roof behind you meets your ear.  "<i>Get your shit, together, you blithering idiots!</i>"\n\n', false );
			EngineCore.outputText( 'Nemus is up there barking orders and waving his cane around, his free hand still clutching his wound.  "<i>I want this ' + CoC.getInstance().player.mf( 'asshole', 'slut' ) + ' DEAD! DO WHATEVER IT TAKES!</i>" The burning rage in his eyes sets his comrades into motion.  They leap for the cannons, preparing a final desperate assault against you.  You take this bout of organization as your cue to skedaddle, resuming your bountiful stride towards the exit.  Luckily, the little imps are about as good with their aim as they are at keeping you restrained, the downpour doing little to aid in their quest.  Projectiles destroy everything around you, splinters, dirt, and mud scattering every which way.  You deftly dodge from side to side, easily outmaneuvering everything heading your way.\n\n', false );
			EngineCore.outputText( 'A couple of imps stationed at the gate throw a wrench into your works, however.  With some triumphant howling, one of them up above manages to kick over a nearby lever, causing the massive entryway to begin slamming shut.  Even at your amazing clip, there\'s no way you\'d make it in time.  You instead focus your sights on a charging imp ahead of you, brandishing a large hammer.  As you close in on him, you begin formulating your next strategy of superhuman might.  But before you even get to step two, a cannonball whizzes by your head and collides with his weapon, ricocheting off of it and into a support beam for what looks like a small stable.  The little roof tumbles forward, providing a slanted route to freedom.  You can\'t help but smirk at your fortune, tackling over the confused imp ahead of you in your mad dash.\n\n', false );
			EngineCore.outputText( 'A jump, a climb, and a showy flip later and you\'ve arrived atop the imps\' last line of defense, one more leap away from escape.  You turn back one last time and ', false );
			//[if corruption <30];
			if( CoC.getInstance().player.cor < 33 ) {
				EngineCore.outputText( 'wave goodbye to Nemus', false );
			}
			//[if corruption ≥30 & <70];
			else if( CoC.getInstance().player.cor < 66 ) {
				EngineCore.outputText( 'blow a kiss to Nemus', false );
			}
			//[if corruption ≥70];
			else {
				EngineCore.outputText( 'flip Nemus a mighty bird', false );
			}
			EngineCore.outputText( ', making out his silhouette in the distance through the storm, hopping around angrily.  With your work done, you bound off of the wall, set to clear the tiny moat that circles around the fort.  Time seems to slow as you soar in the air away from the imp fortress.\n\n', false );
			EngineCore.outputText( 'You feel a sudden heft in your chest.  You peer down to see that your ' + Descriptors.chestDesc() + ' appear to be swelling rapidly!  What\'s much worse, however, is that their ' + CoC.getInstance().player.skin() + ' is turning to rough stone before your eyes!  Fear sets in quickly as your majestic leap quickly loses its momentum.  You desperately reach out for land, but it seems as those the closest handhold is only getting farther and farther away from you.  It becomes difficult to keep grasping out towards the ledge as your chest-mounted stone weights drag you down into the murky water below.  All you can make out below you is unending darkness, the faint glimmer from strikes of lightning above only becoming more distant as you sink deeper into the abyss.  Your outstretched hand is the last thing you see before you are completely enveloped in darkness.  Your bountiful bosoms, easily thrice the size of you by this point, continue their tugging at your chest, feeling as though they are dragging the life out of in the process.\n\n', false );
			EngineCore.outputText( 'For a moment, you can swear you felt them rumbling... taunting you...', false );
			//[end of occurrence ==0];
		}
		EngineCore.doNext( this.boobgartuanSurprise3 );
	};
	//[new page.  occurrence ≥1 starts here];
	Exgartuan.prototype.boobgartuanSurprise3 = function() {
		EngineCore.outputText( '', true );
		//[if occurrence ==0];
		if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] === 0 ) {
			EngineCore.outputText( 'The moon greets your wide-eyed gaze, bathing you in its dim crimson glow.  Seeing as you don\'t appear to have drowned, it looks as though you just had a dream... or perhaps a nightmare.  Judging by the stupid things you said, you decide to go with nightmare.  You don\'t even know a "<i>Nemus</i>"... you think.  Anyway, y', false );
		}
		//[else];
		else {
			EngineCore.outputText( 'A light tickle on your chin pulls you from your shut-eye, the familiar blood-red moon greeting your groggy gaze.  Y', false );
		}
		EngineCore.outputText( 'ou\'ve woken up outdoors it seems, though it\'s hard to make out where exactly you are as it\'s pitch black and your vision has only just started to adjust to the darkness.  You aren\'t exactly surprised to find that you\'re completely naked, however; it feels as if this is your natural state of dress these days.  Unsure as to your whereabouts or safety, you deem it wise to wait and let your pale red surroundings come into some sort of focus before venturing forth.\n\n', false );
		EngineCore.outputText( 'A few tense minutes later, you realize just where you are small clearing north of camp.  You get up off the ground and begin to peer around, spying what you believe to be the familiar glow of your campfire way off in the distance.  One more cursory glance at your surroundings is all it takes before you elect to head on back, anxious to get back to your bed.  However, as you take your first step, your body is thrust to the ground.  The right side of your head smacks into the soft earth below, hard enough to throw off your equilibrium.  You quickly try and regain your footing, pouring equal amounts of effort into listening to your surroundings as you are in trying to stay upright.  The world shortly ends its shift to one side, leaving your eyes and ears on full alert as they hunt for your aggressor.  You take a gentle step forward, your heightened guard trying to distinguish anything in the dark rustling wood around you.  You begin to ask aloud if anyone is there, but before a syllable can escape your mouth, you tumble down to the ground in the opposite direction.\n\n', false );
		EngineCore.outputText( 'Thankfully you were more prepared this time, your reflexes heightened enough to keep you from slamming your noggin yet again.  You also felt just where the shove originated from ' + Descriptors.chestDesc() + '.  ', false );
		//[if occurrence ==0];
		if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] === 0 ) {
			EngineCore.outputText( 'As you sit up and begin to piece the puzzle together, you\'re interrupted by a familiar voice, "<i>You have time to fuck everyone in Mareth silly, but can\'t be bothered to spend an instant of it with these magnificent mounds?</i>" You feel your ' + Descriptors.chestDesc() + ' jiggle as Exgartuan speaks, only to have them yank you forward, planting your face back in the ground.  "<i>I\'ll just have to make sure you\'ll never forget again.</i>"', false );
		}
		//[if occurrence ≥1];
		else if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] < 4 ) {
			EngineCore.outputText( 'It\'s Exgartuan again; you haven\'t fondled her in a while.  "<i>Rarin\' for another round, eh, champion?</i>" your ' + Descriptors.chestDesc() + ' ask you, jiggling furiously for emphasis, "<i>I had hoped the previous lesson', false );
			//[if occurrence ≥2];
			if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] >= 2 ) {
				EngineCore.outputText( 's', false );
			}
			EngineCore.outputText( ' would have sunk in, but I guess you need to retake the course.</i>" Before you can formulate a response, your massive mammaries force your face to the ground yet again.  "<i>The school of hard knocks is in session.</i>"', false );
		}
		//if occurrence ≥4;
		else if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] < 8 ) {
			EngineCore.outputText( '</i>"ARE YOU DENSE, CHAMPION?</i>" Exgartuan shouts, your mammoth melons bouncing furiously on her every word, "<i>I will knock you SENSELESS until I clear some space in that vapid cesspool between your ears!</i>" You want to try and calm her down, but your ' + Descriptors.chestDesc() + ' promptly launch your face square into the dirt.  "<i>Don\'t go on thinking for another SECOND that you can ignore ME!</i>"', false );
		}
		//[if occurrence ≥8];
		else {
			EngineCore.outputText( 'Before another thought can cross your mind, your ' + Descriptors.chestDesc() + ' fly up and smack you in the gob! "<i>' + CoC.getInstance().player.short + ', it\'s that time again,</i>" the eager demoness teases you.  You think she\'s grown to enjoy the torture she puts you through.  "<i>If you insist on going day in and day out without spending quality time with these tits, then I\'ll just insist on instructing you otherwise.</i>" Your beautiful bosom launches forward, throwing your mug right back in the dirt.', false );
		}
		EngineCore.outputText( '  You lift your head enough to shake any clinging ground free, but stop shy of going any higher and giving the demoness another shot at tossing you around.  Grass becomes your anchor as your hands bind themselves to whatever they can.', false );
		if( CoC.getInstance().player.cor < 50 ) {
			EngineCore.outputText( '  Exgartuan\'s tormenting has gone on long enough tonight.', false );
		} else {
			EngineCore.outputText( '  You love foreplay just as much as any other creature, but this is getting ridiculous.', false );
		}
		EngineCore.outputText( '\n\n', false );
		//[if occurrence ==0];
		if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] === 0 ) {
			EngineCore.outputText( '"<i>Don\'t think you can overpower me like those puny imps that infest your dreams, champion.</i>"', false );
		}
		//[if occurrence ≥1];
		else if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] < 4 ) {
			EngineCore.outputText( '"<i>We haven\'t even started the curriculum yet, champion.</i>"', false );
		}
		//[occurrence ≥4];
		else if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] < 8 ) {
			EngineCore.outputText( '"<i>HOW can you forget to caress these cans!?  Tease these teats!?</i>"', false );
		}
		//[if occurrence ≥8];
		else {
			EngineCore.outputText( '"<i>Did you find anything to grab onto this time besides weeds? It doesn\'t look like you have.</i>"', false );
		}
		EngineCore.outputText( '  You make out a slight warmth radiating through your chest, followed by your ' + Descriptors.chestDesc() + ' pulling you up into the air!  Your weak bonds to the earth either slip free or unroot, leaving you at the mercy of your possessed pillows.  Not long after you return to your feet does your chest remount its attack, flinging you with ease from side to side while Exgartuan laughs at you.  By the third time you tumble towards the terrain, you finally decide to lock your arms around your mutinous milk cans, your fingers clamping down as hard as they can into your ' + CoC.getInstance().player.skin() + '.  Your powerful puppies flow over your death grip, the pressure becoming pleasure, your struggle dissolving into confusion.  The demoness pushes and shakes against your hold as your footing keeps up to compensate.  It seems as though her desire to be fondled is stronger than her desire to fight, your turbulent tatas\' harsh movements slowly becoming much more smooth and relaxed.\n\n', false );
		//[if occurrence ==0];
		if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] === 0 ) {
			EngineCore.outputText( '"<i>Well, I suppose you\'ve had enough, champion,</i>" Exgartuan yields, building lust betraying her usual taunting behavior, "<i>Now why don\'t we move on to what we both want, hm?</i>"', false );
		}
		//[if occurrence ≥1];
		else if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] < 4 ) {
			EngineCore.outputText( '"<i>Ready for your final, eh, ' + CoC.getInstance().player.short + '?</i>" Exgartuan teases, a faint lustful waver in her voice contrasting against her dominating demeanor, "<i>Let\'s make this one to remember.</i>"', false );
		}
		//[if occurrence ≥4];
		else if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] < 8 ) {
			EngineCore.outputText( '"<i>Do you think you\'ll remember now!</i>" Exgartuan shouts exasperatedly, your breasts pushing against your grasp one final time, "<i>Now stop wasting my time and get to the only thing you\'re halfway decent at.</i>"', false );
		}
		//[if occurrence ≥8];
		else {
			EngineCore.outputText( '"<i>I suppose that ends tonight\'s opening act,</i>" Exgartuan goads, her voice as domineering as ever, "<i>I know you\'re dying to get on to the grand finale.</i>"', false );
		}
		EngineCore.outputText( '  Your solid hold around your ' + Descriptors.chestDesc() + ' slowly loosens, your tits perking up as they prepare for their much craved attention.  ', false );
		//[if corruption <50];
		if( CoC.getInstance().player.cor < 50 ) {
			EngineCore.outputText( 'Though the mounting need to manhandle your mounds is slowly growing, you at least have the wherewithal to brush the mess of dirt and grass off your body before you begin.  You may be slowly succumbing to the evil corruption radiating from your dainty dumplings, but there\'s no reason you have to look the part, too.  A smooth rock at the edge of the clearing serves as your backrest once you relocate; you would like to at least try to keep from wallowing around in the earth any more tonight.  Even in the dark of the night, you can make out your ' + Descriptors.chestDesc() + ', defying gravity as they anxiously await your touch, their perky pomp silently degrading your resolve.', false );
		}
		//[else];
		else {
			EngineCore.outputText( 'The thrashing now having ended, you gaze longingly at your majestic mountains.  You\'re able to at least hold off long enough from groping them to relocate to a smooth rock at the edge of the clearing; they\'re much easier to handle when you\'re upright after all.  You quickly brush off any dirt from them, having no regard for anything on the rest of your body.  All you care about right now is tending to your craving to cosset your cha-chas.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'As your hands rise to get to work, you feel your control over them slip away.  The demoness has rolled into the driver\'s seat as she tends to do.  ', false );
		//[if corruption <50];
		if( CoC.getInstance().player.cor < 50 ) {
			EngineCore.outputText( 'It is becoming increasingly clear to you that she evidently just cannot seem to sit idly by when you actually do decide to pay her heed.', false );
		}
		//[else];
		else {
			EngineCore.outputText( 'You\'re glad to sit back and bask in the expert manhandling that only she can deliver you.', false );
		}
		EngineCore.outputText( '  Your hands waste no time, caressing every square inch of your flesh.  They gently brush with the softest of grace; they squeeze with the exceptional skill of any expert masseur.  Any particularly sensitive spots get extra attention, eliciting soft moans from you as they only emanate more warmth throughout your body.  You feel as if you\'re melting into your supporting rock, the pleasure only mounting as your absent gaze goes skyward.', false );
		//[if cock or vagina present];
		if( CoC.getInstance().player.gender > 0 ) {
			EngineCore.outputText( '  Your ' + Descriptors.hipDescript() + ' begin grinding together, moist with ', false );
			//[if cock >0];
			if( CoC.getInstance().player.hasCock() && !CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( 'pre-cum', false );
			}
			//[if vagina >0];
			if( CoC.getInstance().player.hasVagina() && !CoC.getInstance().player.hasCock() ) {
				EngineCore.outputText( 'juice', false );
			}
			//[if cock >0, vagina >0];
			if( CoC.getInstance().player.hasCock() && CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( 'an aromatic cocktail of pre and juice', false );
			}
			EngineCore.outputText( ' as your tit massage begins to excite your nether regions.', false );
		}
		EngineCore.outputText( '  The demoness continues her work, though never touching your nipples; the closest she draws your hands is around your areolas.  The circling is no less irritating as when you haven\'t neglected her, your back arching in need yet again.\n\n', false );
		EngineCore.outputText( 'Your gargantuan glands tremble as they begin to speak, "<i>As always, you long for this just as I do.  It only begs the question as to how you could even think to ignore me.</i>" You can feel your breasts plump up, seeming to be the demoness\' not so subtle gesture of superiority, "<i>Well, go ahead, champion.  Satiate your lust.</i>"  Your hands hover over your ' + Descriptors.nippleDescript( 0 ) + 's as if waiting for you to take control.', false );
		//[if corruption <50];
		if( CoC.getInstance().player.cor < 50 ) {
			EngineCore.outputText( '  At this point you are too far gone to resist.', false );
		}
		//[else];
		else {
			EngineCore.outputText( '  You wiggle your fingers in anxious anticipation.', false );
		}
		EngineCore.outputText( '  You finally bear down and grasp onto... nothing?  <b>Your nipples are nowhere to be found!</b>  The passion is beginning to flatline as you confusedly grope around your ' + Descriptors.chestDesc() + '.  "<i>What\'s wrong, champion?</i>" Exgartuan asks knowingly, "<i>Is this too hard for you?</i>" The tips of your fingers comb around your areolas until you discover an inward bend in your ' + CoC.getInstance().player.skin() + ' where your nipples should be.  Apparently, Exgartuan isn\'t through having fun with you; the blasted seductress managed to suck your teats inward!  Before you can fathom just how she pulled it off without your knowledge, your humble howitzers start to tingle.  You feel an anxious quiver work its way up your spine before a familiar need begins to course through your being need to be milked!', false );
		//[if corruption <50];
		if( CoC.getInstance().player.cor < 50 ) {
			EngineCore.outputText( '  Brought on artificially or not, you cannot deny it; you would probably be cursing the wretched demoness if you were not already preoccupied contending with your mounting passion and desire.', false );
		}
		EngineCore.outputText( '  As you paw uselessly at the firm seal, you begin to feel moisture seeping out.', false );
		//[if not lactating];
		if( CoC.getInstance().player.biggestLactation() < 1 || CoC.getInstance().player.lactationQ() === 0 ) {
			EngineCore.outputText( '  <b>Your ' + Descriptors.chestDesc() + ' have started to lactate profusely.</b>', false );
		}//[if lacationmultipler <4];
		else if( CoC.getInstance().player.biggestLactation() < 4 ) {
			EngineCore.outputText( '  <b>Your breasts are only mounting up their lactation to new heights.</b>', false );
		}
		if( CoC.getInstance().player.biggestLactation() < 4 ) {
			CoC.getInstance().player.boostLactation( 3 );
		}
		EngineCore.outputText( '  But with your nipples in their inverted state, release is a hard sought dream, resulting in your tits slowly expanding as they fill with breastmilk.\n\n', false );
		EngineCore.outputText( 'Even with the aid of what little manages to seep out, Exgartuan\'s firm grip is too strong for even a single finger to slip through.  Your breathing begins to increase in pace as your hands resort to anxiously orbiting around the surface of your shaking spheres.  The light strokes elicit a deep sigh from you, but your fervor to nudge your nubs remains your priority.  The absentminded stroking quickly ceases, your hands smothering the former site of your nipples.  Your growing guavas jiggle as the demoness laughs at you, "<i>', false );
		//[if occurrence ==0];
		if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] === 0 ) {
			EngineCore.outputText( 'Perhaps instead of dreaming of being fucked by imps and raiding tombs, you\'ll remember to take care of these luscious love muffins.', false );
		}
		//[if occurrence ≥1];
		else if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] < 4 ) {
			EngineCore.outputText( 'I guess you\'re ready to graduate.  Just don\'t forget what you\'ve learned here today.', false );
		}
		//[if occurrence ≥4];
		else if( CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ] < 8 ) {
			EngineCore.outputText( 'Never again forget that these tantalizing tits are the most important things in your life, champion.  Or I\'ll make sure that you remember again.', false );
		}
		//[if occurrence ≥8];
		else {
			EngineCore.outputText( 'Well, this has been fun, ' + CoC.getInstance().player.short + '.  I look forward to beating you senseless and enjoying the wonderful makeup massage should you forget to see to my means yet again.', false );
		}
		EngineCore.outputText( '</i>"\n\n', false );
		EngineCore.outputText( 'Your ' + Descriptors.chestDesc() + ' begin to rumble and quake, filling you with a mix of anxiety, dread, and passion.  One moment later, an enormous force bursts forth against your hands; your nipples have popped back out, soaking and ready to - wait a second...', false );
		//[if nipplesPerBreast >1];
		if( CoC.getInstance().player.averageNipplesPerBreast() > 1 ) {
			EngineCore.outputText( '  Where once you had multiple nipples, there now rests one on each breast', false );
			//[if nippleLength <4];
			if( CoC.getInstance().player.nippleLength < 4 ) {
				EngineCore.outputText( ', each swollen to at least four inches in length and around 3 inches in diameter!', false );
			} else {
				EngineCore.outputText( '.', false );
			}
		}
		//[if nipplesPerBreast <1 AND nippleLength <4];
		else {
			if( CoC.getInstance().player.nippleLength < 4 ) {
				EngineCore.outputText( '  Your nipples have become much larger than before, each having swollen to at least four inches in length and around 3 inches in diameter!', false );
			} else {
				EngineCore.outputText( '  Your nipples are much thicker than you remember, increasing to at least 3 inches in diameter.', false );
			}
		}
		EngineCore.outputText( '  You pay the alterations little mind, though.  Your bewitched bosom has grown at least an entire cup size and is dribbling milk all over you', false );
		//[if cock or vagina present];
		if( CoC.getInstance().player.gender > 0 ) {
			EngineCore.outputText( ', mixing in with the ', false );
			//[if cock >0];
			if( CoC.getInstance().player.gender === 1 ) {
				EngineCore.outputText( 'pre', false );
			}
			//[if vagina >0];
			else if( CoC.getInstance().player.gender === 2 ) {
				EngineCore.outputText( 'fem-spunk', false );
			} else {
				EngineCore.outputText( 'liquids', false );
			}
			EngineCore.outputText( ' already coating your ' + Descriptors.hipDescript() + '.', false );
		}
		//else;
		else {
			EngineCore.outputText( '.', false );
		}
		EngineCore.outputText( '  This champion wants to tug these melons dry.\n\n', false );
		EngineCore.outputText( 'Your hands go to work on your nips, a tug here, a stroke there, your fingers exploring the ins and outs of your titantic teats.  You punch in just a scant number of moments before your faucets reach their crescendo, your hands holding on for all their worth as milk sprays out everywhere, your ' + Descriptors.chestDesc() + ' writhing with each squirt.  It\'s hard to make out just how much or how far your cream has gone in the dark, but judging by what seemed like an eon of excitement, you\'re confident that you\'ve made your mark.  You know that Exgartuan has fallen into her slumber when your otherwise perky pompoms succumb to the laws of gravity and return to their original state, soreness seeping in after a night of tossing, tugging and teasing.', false );
		//[if corruption <50];
		if( CoC.getInstance().player.cor < 50 ) {
			EngineCore.outputText( '  A heavy sigh escapes your lips as you feel the artificial pressure subside, replaced with the slight increase of lust all the excitement brought on.  You\'ll have to tend to that when you\'re nice and rested.  Unfortunately, your mighty milk fountain has drenched you and the surrounding countryside, turning dirt to mud and your desire to come out of this somewhat clean becoming a futile fantasy.  You scoop up what little pride you can find and wander back to camp, a trail of milk forming behind you.', false );
		}
		//[else];
		else {
			EngineCore.outputText( '  Your fingertips continue to sweep across your ' + CoC.getInstance().player.skin() + ', seemingly in denial that the exciting night has drawn to a close.  You peer up at the ever-present moon, its crimson hue as foreboding as the day you first arrived in Mareth.  You stew on the prospect of apologizing to the demoness for your forgetfulness.  Though, be it for your pride or hers, you decide it better to just shelf the idea.  All Exgartuan cares about is attention and fucking, better to not go and try to turn her into a conversationalist.  Best to just tend to her every so often if you actually do care.  Once you\'ve taken care of your own lust anyway.  You shake some sense back into your head, sending some dirt flying.  The "<i>breast show on earth</i>" left you soaked, your milk turning the dirt to mud around you.  You figure it best to worry about it once you\'re at camp.  You begin the trek back, a little smile growing on your face once you see the trail of milk you\'re leaving behind in your wake.', false );
		}
		//[corruption +2, lust +5] ;
		EngineCore.dynStats( 'lus', 5, 'cor', 2 );
		CoC.getInstance().flags[ kFLAGS.BOOBGARTUAN_SURPRISE_COUNT ]++;
		CoC.getInstance().player.changeStatusValue( StatusAffects.Exgartuan, 2, 25 );
		EngineCore.doNext( EventParser.playerMenu );
	};
	//Requirements:;
	//Exgartuan in cock;
	//Naga lower half;
	//~50%(maybe less?) to replace normal Exgartuan masturbation scene;
	Exgartuan.prototype.exgartuanNagaStoleMyMasturbation = function() {
		EngineCore.spriteSelect( 15 );
		EngineCore.outputText( '', true );
		//[if corruption <15];
		if( CoC.getInstance().player.cor < 15 ) {
			EngineCore.outputText( 'You sheepishly find some rocks to hide in, where you remove your clothes.  "Keeping me all to yourself, slut? Hide as much as you want, it\'ll never keep me down," Exgartuan gloats.\n\n', false );
		}

		EngineCore.outputText( 'Irritating... ', false );
		//[if corruption ≥15 & <30];
		if( CoC.getInstance().player.cor <= 25 ) {
			EngineCore.outputText( 'You make sure you are alone and strip naked.  Exgartuan chides, "Yes, champion, wallow around in the shadows.  Keep pretending you can continue to hide my brilliance from the world."', false );
		}
		//[if corruption ≥30 & <60];
		else if( CoC.getInstance().player.cor <= 50 ) {
			EngineCore.outputText( 'You happily remove your ' + CoC.getInstance().player.armorName + ', eager to pleasure yourself.  Your possessed cock pulses happily as you remove the last article.', false );
		}
		//[if corruption ≥60 & <80];
		else if( CoC.getInstance().player.cor <= 75 ) {
			EngineCore.outputText( 'You strip naked in an exaggerated fashion, hoping someone might be watching.  Exgartuan begins flooding you with lust in response to your willing inclination.', false );
		}
		//[if corruption ≥80];
		else {
			EngineCore.outputText( 'You strip naked, fondling your naughty bits as you do so and casting seductive looks around, hoping someone or something is nearby to fuck you.  Your demonic dong throbs happily from within you, anxious to move on with the festivities.', false );
		}
		EngineCore.outputText( '\n\n', false );
		//[if corruption <33];
		if( CoC.getInstance().player.cor < 33 ) {
			EngineCore.outputText( 'Having grown weary of the demon\'s constant taunts, you finally decide to give in to his forced temptations.  May as well get this over with now rather than letting it get out of hand.  As satisfying as it feels to manhandle your man meat, your corrupt passenger always manages to make it feel wrong once you\'ve regained your senses.  Your pondering quickly begins to dissolve once you feel your ' + Descriptors.cockDescript( 0 ) + ' slowly stretch its way out from your slithery slit', false );
			//[if cocks === 2];
			if( CoC.getInstance().player.cockTotal() === 2 ) {
				EngineCore.outputText( ', your remaining tool hiding away inside you, uninvited.', false );
			}//[if cocks ≥ 3];
			else if( CoC.getInstance().player.cockTotal() >= 3 ) {
				EngineCore.outputText( ', your remaining poles hiding away inside you, uninvited.', false );
			} else {
				EngineCore.outputText( '.', false );
			}
			EngineCore.outputText( '  Just how the hell does Exgartuan manage to-"<i>No time for your feeble mind to try and comprehend my power, champion," your rod interrupts, "I wouldn\'t want you to hurt yourself BEFORE I get the chance to."  Now you REALLY want to get this over with and move on.  With a dejected sigh and a preparatory stretch of your shoulders, you reach down to do the dirty deed.\n\n', false );
			EngineCore.outputText( 'Well, you had planned on it.  Your arms have frozen in place above your unholy pecker.  "I have no need for your inexperienced fumbling today, my needy little slut.  Sit back and tremble as I rock your world."\n\n', false );
		}
		//[if corruption ≥33 & <66];
		if( CoC.getInstance().player.cor > 33 && CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( '  You shouldn\'t be looking forward to this, should you?', false );
			EngineCore.outputText( '  You haven\'t even quite figured out just how much of the pleasure one of these sessions garners is actually genuine.  But that doesn\'t make it any less savory.  "What\'s wrong, ' + CoC.getInstance().player.short + '," your perverse pecker chimes in, obviously reacting to your internal conflict, "Having any second thoughts?  You aren\'t suddenly feeling as if you\'re above the fun I have on tap, are you?"\n\n', false );
			EngineCore.outputText( 'No, wait, it\'s pretty fucking clear you love the fucking; it\'s the fucking demon that you fucking can\'t tolerate.  You think.  Fuck.  You shake your head to try and clear your thoughts, focusing on what you came over here to do.  Your erect ' + Descriptors.cockDescript( 0 ) + ' has already made its way out of your slithery slit', false );
			//[if cocks === 2];
			if( CoC.getInstance().player.cockTotal() === 2 ) {
				EngineCore.outputText( ', your remaining tool still hiding away inside you, uninvited.', false );
			}//[if cocks ≥ 3];
			else if( CoC.getInstance().player.cockTotal() > 2 ) {
				EngineCore.outputText( ', your remaining poles still hiding away inside you, uninvited.', false );
			} else {
				EngineCore.outputText( '.  You lean down to embrace the demon and your arms are frozen in place before you can even touch him.  Of course.  "Are you hungry, champion?" Exgartuan mocks, shaking slightly to further dig in the knife, "And to think you\'re so eager to jump in and have some fun.  But I have something else planned today."\n\n', false );
			}
		}
		//[else];
		else {
			EngineCore.outputText( 'All right, no more fooling around; you\'ve been looking forward to this all your life.  Like you say every time you get to bump elbows with this divine deity of dicks, no use wasting any more time with idle fantasies; you\'ve got the real thing right on you.  Or inside of you, as you begin coaxing the demon out of your serpent-like slit, slowly rubbing him up to full size.  "Oh yea, right under my head.  That feels great," Exgartuan never seems to get enough of you.  But when he feels so goddamn good, how can you resist?', false );
			//[if cocks === 2];
			if( CoC.getInstance().player.cockTotal() === 2 ) {
				EngineCore.outputText( '  Speaking of resisting, it appears your second tool has been forced to stay in the shed.', false );
			}//[if cocks ≥ 3];
			else if( CoC.getInstance().player.cockTotal() >= 3 ) {
				EngineCore.outputText( '  Speaking of resisting, it appears your remaining tools have been forced to stay in the shed.', false );
			}
			EngineCore.outputText( '  Your ' + Descriptors.cockDescript( 0 ) + ' makes good on its end of the bargain by pumping out its own never-ending supply of lubricant, making your master massage all the more slick and smooth along its surface.  You lay off for a moment to admire your work, your demonic dong throbbing happily now that its full of blood and as tall and thick as a tree.  The corrupt warmth and comfort flowing through your body pleases you to no end.\n\n', false );
			EngineCore.outputText( '"' + CoC.getInstance().player.short + ', am I ever glad I wound up with you," the engorged demon praises you through a surprisingly pleased tone, "An eternity together fueled by your cock massages would be too short.  I have something I\'ve been meaning to try today, though.  A slut such as yourself should get a kick out of it."  You take the compliment, interested in just what your partner in crime has in mind as you lean back and enjoy the show.\n\n', false );
		}
		EngineCore.outputText( 'A sudden tumble to your backside is first on the agenda as your long tail whips around in front of you.  The demon has commandeered your body from waist down to the tip of your lengthy, strong snake body.  You can only sink into the role as a spectator, watching the end of your tail practically kissing the opening of your ' + Descriptors.cockDescript( 0 ) + ', smothering itself in the demon\'s reservoir of pre-cum.', false );
		//[if corruption <50];
		if( CoC.getInstance().player.cor < 50 ) {
			EngineCore.outputText( '  In a move that you could only describe as appallingly spiteful, your urethra gapes open as wide as it can, inviting your tail to coat itself even further.  You make out a low, menacing laugh needling its way through your mind, its owner clear.  A few agonizing moments of gasps through clenched teeth and your hind end emerges with a moist pop.  Of course your corrupted nerves react in only pleasure from the perverse showing; you fear for the day when you can\'t make the distinction.', false );
		}
		EngineCore.outputText( '  The possessed shaft works down all of your underside that it can reach, cooperating with your borrowed body to coat both parties as evenly as they can.\n\n', false );
		//[If int > 9];
		if( CoC.getInstance().player.inte > 9 ) {
			EngineCore.outputText( 'You aren\'t stupid; you can hazard more than just a guess as to what\'s about to happen.', false );
		}
		//[else];
		else {
			EngineCore.outputText( 'You may be stupid, but it\'s incredibly clear what\'s going on here.', false );
		}
		EngineCore.outputText( '  Exgartuan ends what little foreplay there is, coiling around your titanic shaft with your wet tail.', false );
		//[if cockLength(0) ≥ 0.5*tallness];
		if( CoC.getInstance().player.cocks[ 0 ].cockLength >= CoC.getInstance().player.tallness * 0.5 ) {
			EngineCore.outputText( '  There\'s not quite enough of you to fully envelop the horny monument, however.  Its head pokes out of the top of the scaley volcano, continuing to spew its not-quite-so-molten lava.', false );
		}
		//[else];
		else {
			EngineCore.outputText( '  As impressive as Exgartuan\'s mighty length is in these lands, your tail is plenty capable of completely enveloping the titan in its scaley embrace.', false );
		}
		EngineCore.outputText( '  The pressure on display here is tremendous.  The demon\'s vice-like grip is, like his many feats, teetering on the edge of expertise and insanity can\'t begin to comprehend how a squeeze this strong hasn\'t tripped the line from pleasure to pain.  You can only perceive your upper body\'s joints as forming right angles, tensing up from the gratifying duress.\n\n', false );
		EngineCore.outputText( 'Your dastardly dick moves on to phase two of its evil plan  It\'s slow at first; you can feel each little nub react as each slick coil passes over them, the sensation just as maddeningly satisfying as everything else.  You feel as if your midsection is being stretched when your tail lifts as high as it can, exposing the base of your sinister shaft to the elements.  The roller coaster\'s been nothing but anticipation.  You enjoy just the mounting pleasure of the journey as it makes the first ascension.  Now you\'re hanging hundreds of feet in the air, your ride inching closer to the precipice.  You can see everything that you\'re in for laying ahead of you, but you can never perceive how it\'ll actually play out in action.  All you can do is dig your nails into your harness and- great goblins\' ghosts!  The demon\'s already gone to work, your tail bottoming out on you one instant and teasing only your head the next.  The sound of scales smacking a wide surface area fills the air.  You would begin to wonder how the repeated blows to your groin haven\'t resulted in injury, but your mind is enthralled by the feel of your super-sized shaft\'s stimulation.  Even if you weren\'t orgasmicly paralyzed, you know better than to try and make sense of the dealings of your possessed pecker.\n\n', false );
		EngineCore.outputText( 'Self stimulation should never feel this good.  This doesn\'t even seem like masturbation.  All you\'ve been able to contribute to this action are clenched fists, various sounds, and shuffling expressions.  ', false );
		//[if corruption <33];
		if( CoC.getInstance().player.cor < 33 ) {
			EngineCore.outputText( '"<i>You can\'t measure up to treatment of this magnitude, champion," Exgarutan insults you, his voice trembling as the slick massage persists, "But don\'t think that I\'m giving you permission to slack off.  A slut like you can go on dreaming; one day maybe you\'ll have the perseverance to get close."', false );
		}
		//[if corruption ≥33 & <66];
		else if( CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( 'Your corrupt cock begins to speak up, the demon\'s unrelenting motions refusing to ease off, "You\'re loving every bit of this champion.  There isn\'t a hint of uncertainty lingering in your senses.  If only you were this accepting all the time."', false );
		}
		//[else];
		else {
			EngineCore.outputText( '"<i>Isn\'t this great, ' + CoC.getInstance().player.short + '? With both of our sexual expertise combined, we\'ll own this land in no time, and enjoy the fuck out of any downtime."', false );
		}
		EngineCore.outputText( '  You\'re at your wits\' end, the demon\'s words triggering your release.  You can feel a ', false );
		//[if cumQ()<50];
		if( CoC.getInstance().player.cumQ() < 50 ) {
			EngineCore.outputText( 'modest', false );
		}//[if cumQ()<150];
		else if( CoC.getInstance().player.cumQ() < 150 ) {
			EngineCore.outputText( 'sizably sticky', false );
		}//[if cumQ()<300];
		else if( CoC.getInstance().player.cumQ() < 300 ) {
			EngineCore.outputText( 'mighty thick', false );
		}//[if cumQ()<800];
		else if( CoC.getInstance().player.cumQ() < 800 ) {
			EngineCore.outputText( 'immensely voluminous', false );
		}
		//[else];
		else {
			EngineCore.outputText( 'monumental', false );
		}
		EngineCore.outputText( ' load working its way up your ' + Descriptors.cockDescript( 0 ) + '... and stop.  You sit up in an involuntary attempt to release the pressure, only to be met by your coiled-up shaft bending to greet your face, its urethra spread wide open...\n\n', false );
		EngineCore.outputText( 'Having coated your face and upper torso in a demonic jism assault, Exgartuan returns to your serpent\'s slit.  His grasp on your tail lifts, leaving you to undo the tangled mess he left behind.  But you\'re too busy laying back decompressing.  No thoughts, no musings, no questions, no doubts... nothing is going on in your cum-soaked head.  What is there to say?', false );
		CoC.getInstance().player.changeStatusValue( StatusAffects.Exgartuan, 2, (16 + Utils.rand( 7 )) );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', 0.25 );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	CoC.getInstance().registerScene( 'exgartuan', new Exgartuan() );
} );