'use strict';

angular.module( 'cocjs' ).run( function( MainView, ConsumableLib, CockTypesEnum, CoC, StatusAffects, AppearanceDefs, Descriptors, Utils, PregnancyStore, kFLAGS, Useable, PerkLib, EngineCore ) {
	function BimboLiqueur() {
		this.init(this, arguments);
	}
	angular.extend(BimboLiqueur.prototype, Useable.prototype);
	BimboLiqueur.prototype.init = function( that ) {
		Useable.prototype.init( that, [ 'BimboLq', 'BimboLq', 'a potent bottle of \'Bimbo Liqueur\'', 1000, 'This small bottle of liqueur is labelled \'Bimbo Liqueur\'.  There\'s a HUGE warning label about the effects being strong and usually permanent, so you should handle this with care.' ] );
		that.classNames.push('BimboLiqueur');
	};
	BimboLiqueur.prototype.canUse = function() {
		if( CoC.player.findPerk( PerkLib.FutaForm ) < 0 ) {
			return true;
		}
		MainView.outputText( 'Ugh.  This stuff is so, like... last year.  Maybe you can find someone else to feed it to?\n\n' );
		return false;
	};
	BimboLiqueur.prototype.useItem = function() {
		if( CoC.player.findPerk( PerkLib.BroBody ) >= 0 ) {
			MainView.outputText( 'You wince as the stuff hits your stomach, already feeling the insidious effects beginning to take hold.  A lengthy belch escapes your lips as your stomach gurgles, and you giggle abashedly to yourself.' );
			if( CoC.player.tallness < 77 ) {
				MainView.outputText( ' 0...Did the ground just get farther away?  You glance down and realize, you\'re growing!  Like a sped-up flower sprout, you keep on getting taller until finally stopping around... six and a half feet, you assume.  Huh.  You didn\'t expect that to happen!' );
				CoC.player.tallness = 77;
			}
			if( CoC.player.biggestTitSize() < 7 ) {
				if( CoC.player.biggestTitSize() < 1 ) {
					MainView.outputText( '  Tingling, your chest begins to itch, then swell into a pair of rounded orbs.  ' );
				} else {
					MainView.outputText( '  You feel a tingling inside your breasts.  ' );
				}
				MainView.outputText( 'They quiver ominously, and you can\'t help but squeeze your tits together to further appreciate the boobquake as another tremor runs through them.  Unexpectedly, the shaking pushes your hands further apart as your tits balloon against each other, growing rapidly against your now-sunken fingers.  The quakes continue until calming at around an E-cup.' );
				CoC.player.breastRows[ 0 ].breastRating = 7;
			}
			//(If vagina = 2tight:;
			if( !CoC.player.hasVagina() ) {
				MainView.outputText( '  Before you can even take a breath, an extremely peculiar sensation emanates from your crotch.  You can\'t see through your ' + CoC.player.armorName + ', but you can certainly feel the vagina splitting ' + (CoC.player.balls > 0 ? 'from behind your testicles' : 'your groin') + '.  Luckily, the cunt-forming doesn\'t yield any discomfort - on the contrary, you feel yourself falling farther into your chemically-dulled, libido-fueled rut.' );
				if( CoC.player.hipRating < 12 || CoC.player.buttRating < 12 ) {
					MainView.outputText( '  As if realizing the necessity of womanly proportions to attract the hard cocks your body now craves, your waist pinches slightly inward and your hips and butt swell.  You can\'t help but run a hand across your newly-feminized pelvis, admiring it.' );
				}
				CoC.player.createVagina();
				CoC.player.clitLength = 0.25;
				if( CoC.player.hipRating < 12 ) {
					CoC.player.hipRating = 12;
				}
				if( CoC.player.buttRating < 12 ) {
					CoC.player.buttRating = 12;
				}
			}
			MainView.outputText( '\n\n' );
			MainView.outputText( 'A wave of numbness rolls through your features, alerting you that another change is happening.  You reach up to your feel your jaw narrowing, becoming more... feminine?  Heavy, filling lips purse in disappointment as your face takes on a very feminine cast.  You\'re probably pretty hot now!\n\n' );
			if( CoC.player.femininity < 80 ) {
				CoC.player.femininity = 80;
			}

			MainView.outputText( 'Your surging, absurdly potent libido surges through your body, reminding you that you need to fuck.  Not just bitches, but guys too.  Hard cocks, wet pussies, hell, you don\'t care.  They can have both or a dozen of either.  You just want to get laid and bone something, hopefully at the same time!' );
			MainView.outputText( '\n\n<b>(Perks Lost: Bro Body' );
			if( CoC.player.findPerk( PerkLib.BroBrains ) >= 0 ) {
				MainView.outputText( ', Bro Brains' );
			}
			MainView.outputText( ')\n' );
			MainView.outputText( '(Perks Gained: Futa Form, Futa Faculties)\n' );
			CoC.player.removePerk( PerkLib.BroBody );
			CoC.player.removePerk( PerkLib.BroBrains );
			CoC.player.createPerk( PerkLib.FutaFaculties, 0, 0, 0, 0 );
			CoC.player.createPerk( PerkLib.FutaForm, 0, 0, 0, 0 );
			if( CoC.player.inte > 35 ) {
				CoC.player.inte = 35;
				EngineCore.dynStats( 'int', -0.1 );
			}
			if( CoC.player.lib < 50 ) {
				CoC.player.lib = 50;
				EngineCore.dynStats( 'lib', 0.1 );
			}
		} else {
			MainView.outputText( 'You pop the cork from the flask and are immediately assaulted by a cloying, spiced scent that paints visions of a slutty slave-girl\'s slightly-spread folds.  Wow, this is some potent stuff!  Well, you knew what you were getting into when you found this bottle!  You open wide and guzzle it down, feeling the fire of alcohol burning a path to your belly.  The burning quickly fades to a pleasant warmth that makes you light-headed and giggly.\n\n' );
			if( CoC.player.hairColor !== 'platinum blonde' ) {
				MainView.outputText( 'The first change that you notice is to your ' + CoC.player.hairDescript() + '.  It starts with a tingling in your scalp and intensifies ' );
				if( CoC.player.hairLength < 36 ) {
					MainView.outputText( 'as you feel the weight of your hair growing heavier and longer.' );
					CoC.player.hairLength = 36;
				} else {
					MainView.outputText( 'as your hair grows thicker and heavier.' );
				}
				MainView.outputText( '  You grab a lock of the silken strands and watch open-mouthed while streaks so blonde they\'re almost white flow down the ' + CoC.player.hairColor + ' hair.  It goes faster and faster until your hair has changed into perfectly bimbo-blonde, flowing locks.\n\n' );
				CoC.player.hairColor = 'platinum blonde';
			}
			MainView.outputText( 'Moaning lewdly, you begin to sway your hips from side to side, putting on a show for anyone who might manage to see you.   You just feel so... sexy.  Too sexy to hide it.  Your body aches to show itself and feel the gaze of someone, anyone upon it.  Mmmm, it makes you so wet!  ' );
			if( !CoC.player.hasVagina() ) {
				CoC.player.createVagina();
				CoC.player.clitLength = 0.25;
				CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_SLICK;
				if( CoC.player.isTaur() ) {
					MainView.outputText( 'Wait!? Wet? You wish you could touch yourself between the ' + CoC.player.legs() + ', but you can tell from the fluid running down your hind-legs just how soaked your new vagina is.' );
				} else {
					MainView.outputText( 'Wait!?  Wet?  You touch yourself between the ' + CoC.player.legs() + ' and groan when your fingers sink into a sloppy, wet cunt.' );
				}
			} else {
				if( CoC.player.isTaur() ) {
					MainView.outputText( 'You wish you could sink your fingers into your sloppy, wet cunt, but as a centaur, you can\'t quite reach.' );
					if( CoC.player.vaginas[ 0 ].vaginalWetness < AppearanceDefs.VAGINA_WETNESS_SLICK ) {
						CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_SLICK;
					}
				} else {
					MainView.outputText( 'You sink your fingers into your ' );
					if( CoC.player.vaginas[ 0 ].vaginalWetness < AppearanceDefs.VAGINA_WETNESS_SLICK ) {
						MainView.outputText( 'now ' );
						CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_SLICK;
					}
					MainView.outputText( 'sloppy, wet cunt with a groan of satisfaction.' );
				}
			}
			if( CoC.player.balls > 0 ) {
				MainView.outputText( '\n\nThere\'s a light pinch against your [sack] that makes you gasp in surprise, followed by an exquisite tightness that makes your [vagina] drool.  Looking down, <b>you see your balls slowly receding into your body, leaving nothing behind but your puffy mons.</b>' );
				CoC.player.balls = 0;
				CoC.player.ballSize = 3;
				CoC.player.cumMultiplier = 2;
			}
			if( CoC.player.hasCock() ) {
				MainView.outputText( '\n\n[EachCock] seems to be responding to the liqueur in its own way.  Clenching and relaxing obscenely, your genitals begin to drizzle cum onto the ground in front of you, throwing you into paroxysms of bliss.  The flow of cum is steady but weak, and each droplet that leaves you lets [eachCock] go more flaccid.  Even once you\'re soft and little, it doesn\'t stop.  You cum your way down to nothing, a tiny droplet heralding your new, girlish groin.  <b>You no longer have ' );
				if( CoC.player.cockTotal() === 1 ) {
					MainView.outputText( 'a penis' );
				} else {
					MainView.outputText( 'penises' );
				}
				MainView.outputText( '!</b>' );
				while( CoC.player.hasCock() ) {
					CoC.player.removeCock( 0, 1 );
				}
			}
			MainView.outputText( '  Somehow, you feel like you could seduce anyone right now!\n\n' );
			MainView.outputText( 'Another bubbly giggle bursts from your lips, which you then lick hungrily.  You, like, totally want some dick to suck!  Wow, that came out of left field.  You shake your head and try to clear the unexpected, like, words from your head but it\'s getting kind of hard.  Omigosh, you feel kind of like a dumb bimbo after, like, drinking that weird booze.  Oh, well, it doesn\'t matter anyhow – you can, like, still stop the demons and stuff.  You\'ll just have to show off your sexy bod until they\'re offering to serve you.\n\n' );
			MainView.outputText( 'You sigh and run one hand over your ' + CoC.player.nippleDescript( 0 ) + 's' );
			if( CoC.player.breastRows[ 0 ].breastRating < 10 ) {
				CoC.player.breastRows[ 0 ].breastRating += 5 + Utils.rand( 5 );
				MainView.outputText( ', surprised at how large and rounded your expanding breasts have become while fresh tit-flesh continues to spill out around your needy fingers.  They feel so supple and soft, but when you let them go, they still sit fairly high and firm on your chest.  The newer, more generous, ' + CoC.player.breastCup( 0 ) + ' cleavage has you moaning with how sensitive it is, pinching a nipple with one hand ' );
			} else {
				CoC.player.breastRows[ 0 ].breastRating += 5 + Utils.rand( 5 );
				MainView.outputText( ', admiring how sensitive they\'re getting.  The big breasts start getting bigger and bigger, soft chest-flesh practically oozing out between your fingers as the squishy mammaries sprout like weeds, expanding well beyond any hand\'s ability to contain them.  The supple, ' + CoC.player.breastCup( 0 ) + ' boobs still manage to sit high on your chest, almost gravity defying in their ability to generate cleavage.  You pinch a nipple with one hand ' );
			}
			EngineCore.dynStats( 'sen', 20 );
			MainView.outputText( 'while the other toys with the juicy entrance of your folds.  Mmmm, it, like, feels too good not to touch yourself, and after being worried about getting all dumb and stuff, you need to relax.  Thinking is hard, but sex is so easy and, like, natural!  You lean back and start grunting as you plunge four fingers inside yourself, plowing your ' + CoC.player.vaginaDescript( 0 ) + ' like no tomorrow.  By now, your ' + CoC.player.clitDescript() + ' is throbbing, and you give it an experimental ' );
			if( CoC.player.clitLength >= 3 ) {
				MainView.outputText( 'jerk ' );
			} else {
				MainView.outputText( 'caress ' );
			}
			MainView.outputText( 'that makes your ' + CoC.player.legs() + ' give out as you cum, splattering female fluids as you convulse nervelessly on the ground.\n\n' );
			MainView.outputText( 'Though the orgasm is intense, you recover a few moments later feeling refreshed, but still hot and horny.  Maybe you could find a partner to fuck?  After all, sex is, like, better with a partner or two.  Or that number after two.  You brush a lengthy, platinum blonde strand of hair out of your eyes and lick your lips - you\'re ready to have some fun!\n\n' );
			if( CoC.player.hipRating < 12 || CoC.player.buttRating < 12 ) {
				MainView.outputText( 'As you start to walk off in search of a sexual partner, you feel your center of balance shifting.' );
				if( CoC.player.hipRating < 12 && CoC.player.buttRating < 12 ) {
					MainView.outputText( '  Your ass and hips inflate suddenly, forcing you to adopt a slow, swaying gait.  You find that rolling your hips back and forth comes naturally to you.  You make sure to squeeze your butt-muscles and make your curvy tush jiggle as you go.' );
					CoC.player.buttRating = 12;
					CoC.player.hipRating = 12;
				} else if( CoC.player.hipRating < 12 ) {
					MainView.outputText( '  Your hips widen suddenly, forcing you to adopt a slow, swaying gait.  You find that rolling yours hips back and forth comes naturally to you, and your big, obscene ass seems to jiggle all on its own with every step you take.' );
					CoC.player.hipRating = 12;
				} else {
					MainView.outputText( '  Your [butt] swells dramatically, the puffy cheeks swelling with newfound weight that jiggles along with each step.  Clenching your glutes to make the posh cheeks jiggle a little more enticingly becomes second nature to you in a few seconds.' );
					CoC.player.buttRating = 12;
				}
				MainView.outputText( '\n\n' );
			}
			if( CoC.player.tone > 0 ) {
				MainView.outputText( 'Like, weirdest of all, your muscles seem to be vanishing!  Before your eyes, all muscle tone vanishes, leaving your body soft and gently curvy.  You poke yourself and giggle!  Everyone\'s totally going to want to, like, rub up against you at every opportunity.  Your thighs are so soft you bet you could squeeze a pair of dicks to orgasm without even touching your moist cunny.' );
				CoC.player.tone = 0;
				if( CoC.player.str >= 30 ) {
					if( CoC.player.str >= 90 ) {
						EngineCore.dynStats( 'str', -10 );
					}
					if( CoC.player.str >= 70 ) {
						EngineCore.dynStats( 'str', -10 );
					}
					if( CoC.player.str >= 50 ) {
						EngineCore.dynStats( 'str', -10 );
					}
					EngineCore.dynStats( 'str', -5 );
					MainView.outputText( '  It does get a bit harder to carry yourself around with your diminished strength, but that\'s, like, what big strong hunks are for anyways!  You can just flirt until one of them volunteers to help out or something!  Besides, you don\'t need to be strong to jerk off cocks or finger slutty pussies!' );
				}
				MainView.outputText( '\n\n' );
			}
			if( CoC.player.findPerk( PerkLib.BimboBody ) < 0 ) {
				MainView.outputText( '<b>(Bimbo Body - Perk Gained!)\n' );
				CoC.player.createPerk( PerkLib.BimboBody, 0, 0, 0, 0 );
			}
			if( CoC.player.findPerk( PerkLib.BimboBrains ) < 0 ) {
				MainView.outputText( '(Bimbo Brains - Perk Gained!)\n' );//int to 20.  max int 50)
				CoC.player.createPerk( PerkLib.BimboBrains, 0, 0, 0, 0 );
				if( CoC.player.inte > 21 ) {
					CoC.player.inte = 21;
				}
			}
			CoC.player.orgasm();
			EngineCore.dynStats( 'int', -1, 'lib', 4, 'sen', 25 );
			//FULL ON BITCHFACE;
			CoC.player.modFem( 100, 100 );
			//Body;
			//Tease/Seduce Boost;
			//*boosts min lust and lust resistance);
			//*Tit size;
			//Brain;
			//Max int - 50;
		}
		CoC.player.genderCheck();
		return false;
	};
	ConsumableLib.registerConsumable( 'BIMBOLQ', new BimboLiqueur() );
} );