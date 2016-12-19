'use strict';

angular.module( 'cocjs' ).factory( 'HermCentaur', function( SceneLib, MainView, CockTypesEnum, Appearance, EngineCore, CoC, Monster, AppearanceDefs, Utils, Combat ) {
	function HermCentaur() {
		this.init(this, arguments);
	}
	angular.extend(HermCentaur.prototype, Monster.prototype);
	HermCentaur.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('HermCentaur');
		that._usedGottaCum = false;
		that._usedHeal = false;
		that._chargingArouse = false;
		that._lustAtChargeStart = -1;
		that._arouseCooldown = 0;
		that._hypnoCockUses = 0;
		that.a = 'the ';
		that.short = 'herm centaur';
		that.long = 'Standing tall and proud just a few feet away is a massive demon unlike any others you\'ve seen.  She\'s every bit a centaur - horse body, hooves, fur, and everything, but she\'s also massive in proportion - about nine feet tall and equally well endowed.  Heaving, jiggly E-cups jut proudly from her chest, unrestrained and bare to the world, thick nipples capping them like majestic, sexual crowns.  Under her belly, a thick equine cock slaps wetly against her fur with every step, heavy balls dangling behind.  A solid black horn juts from her forehead, a testament to the demonic corruption flowing through this monstrous woman\'s veins.  Still, without the horn, you\'d never have guessed she was a demon.  Her gleaming fire-orange hair and pale, freckled skin look like something you would see on an innocent maid, not a bestial altar of corrupted decadence.';
		that.tallness = 12 * 9;
		// THIS SHIT IS RETARDED.;
		// Rather than doing something smart, like usiing the mf() function to set the gender prounouns in checkMonster, instead, each create<x> function sets them to something. So if you createVag then createCock, you get male pronouns. Fuck off.;
		that.createBreastRow( Appearance.breastCupInverse( 'E' ) );
		that.createCock( 36, 5, CockTypesEnum.HORSE );
		that.createVagina( false, 4, 5 );

		that.balls = 2;
		that.ballSize = 3;
		that.hipRating = AppearanceDefs.HIP_RATING_FERTILE;
		that.buttRating = AppearanceDefs.BUTT_RATING_EXPANSIVE;
		that.initStrTouSpeInte( 100, 100, 65, 65 );
		that.initLibSensCor( 85, 40, 100 );
		that.weaponName = 'fists';
		that.weaponAttack = 1;
		that.weaponVerb = 'punch';
		that.armorName = 'wraps';
		that.bonusHP = 800;
		that.gems = 75 + Utils.rand( 50 );
		that.level = 22;
		that.lustVuln = 0.6;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	HermCentaur.prototype.defeated = function( hpVictory ) {
		SceneLib.hermCentaurScenes.beatThePony( hpVictory );
	};
	HermCentaur.prototype.won = function( hpVictory, pcCameWorms ) {
		SceneLib.hermCentaurScenes.inSovietCoCPonyRidesYou( hpVictory, pcCameWorms );
	};
	// Gonna handle this a little differently than usual.;
	// This is one of the advantages of containing monster detail in this manner, and encapsulating the;
	// combat implemenation thereof with it- we can easily make use of the object to store things;
	// we would normally use StatusAffects for, in instances where the only thing that will care ;
	// about those Affects are the user/consumer of them.;

	HermCentaur.prototype.performCombatAction = function() {
		this._arouseCooldown--;
		// Priority use;
		if( this._chargingArouse ) {
			this.arouseSpellCast();
		} else if( this.lust >= 60 && !this._usedGottaCum ) {
			this.gottaCum();
		} else if( this.HPRatio() <= 0.5 && !this._usedHeal ) {
			this.healUp();
		} else if( Utils.rand( this.lust ) >= 40 ) {
			this.hypnoCock();
		} else {
			// Selections;
			var opts = [ this.feminineMusk, this.aphrodisiacSquirt ];
			if( !this._chargingArouse && this._arouseCooldown <= 0 ) {
				opts.push( this.arouseSpellCharge );
			}

			opts[ Utils.rand( opts.length ) ]();
		}
		Combat.combatRoundOver();
	};
	HermCentaur.prototype.feminineMusk = function() {
		MainView.outputText( 'Turning about, the demonic centauress lifts her tail to reveal the slimy, lubricated lips of her puffy, black horse-cunt.  She arches her human body back to lie on her back, an incredible show of flexibility, allowing you to view the silhouette of her jutting nipples her tail lazily fans her corruption-enhanced pheromones in your direction.  The air temperature seems to spike by a few degrees as the fan of biological lust washes over you.  Fragrant female moisture seems to seep into your very pores, and in spite of your desire to win out, ' );
		if( CoC.player.lust <= 50 ) {
			MainView.outputText( ' your ' + CoC.player.skin() + ' grows feverishly hot.' );
		} else {
			MainView.outputText( ' blood rushes to your loins, invigorating' );
			if( CoC.player.hasCock() ) {
				MainView.outputText( ' [eachCock] with the desire to plunge inside that juicy-hot hole.' );
			} else if( CoC.player.hasVagina() ) {
				MainView.outputText( ' your [vagina] with the desire to submit while juices pool between your [legs].' );
			} else {
				MainView.outputText( ' your anus until it puckers, craving something to fill it - anything.' );
			}
		}
		EngineCore.dynStats( 'lus+', 8 + (CoC.player.lib / 10) + (CoC.player.sens / 10) );
	};
	HermCentaur.prototype.aphrodisiacSquirt = function() {
		MainView.outputText( 'The centaur grabs her heavy tits and casually squeezes the prodding, hard nipples that cap them.  A trickle of rose moisture trickles out, dripping down the underside of her bust to glisten wetly in the light.  Spellbound for the moment, you look on in wonder at the display of demonic lactations.  A faint sweetness lingers in the air, and you lick your lips without meaning to.  Then, she squeezes down to spray a torrent of pink-tinged breastmilk directly at you, splitting into so many forks of fluid that you have no hope to dodge.' );
		EngineCore.dynStats( 'lus+', 8 + (CoC.player.lib / 10) + (CoC.player.sens / 10) );
		if( CoC.player.lust < 30 ) {
			MainView.outputText( '\n\nYou close your mouth tight and endure the shimmering shower, trying your damnedest to resist the effects of this insidious liquid.  Wherever it strikes you, it vanishes soon after, absorbed directly into your body.' );
		} else if( CoC.player.lust < 40 ) {
			MainView.outputText( '\n\nYour heart beats faster.' );
		} else if( CoC.player.lust < 50 ) {
			MainView.outputText( '\n\nYour cheeks color as you try not to imagine how you could fuck such a beast.' );
		} else if( CoC.player.lust < 60 ) {
			MainView.outputText( '\n\nYour blink, but find your eyes staying closed a moment longer than you intended, visions of yourself suckling down the pink sweetness occupying your mind.' );
		} else if( CoC.player.lust < 70 ) {
			MainView.outputText( '\n\nYou groan in disappointment when you realize what\'s going to happen, but as soon as you\'re slicked with the aphrodisiac,' );
			if( CoC.player.hasCock() ) {
				MainView.outputText( ' [eachCock] awakens, filling itself towards full erection.' );
			} else if( CoC.player.hasVagina() ) {
				MainView.outputText( ' a wet heat answers in your loins, growing more insistent from moment to moment.' );
			} else {
				MainView.outputText( ' your [asshole] tingles, craving something to fill it.' );
			}
		} else if( CoC.player.lust < 80 ) {
			MainView.outputText( '\n\nYou sigh and try to gain a better position during the pink rain' );
			if( CoC.player.hasCock() ) {
				MainView.outputText( ' ignoring the stiffening pressure of [eachCock]' );
			} else {
				MainView.outputText( ' ignoring the increasing wetness of your inner [armor]' );
			}
			MainView.outputText( '. It\'s getting harder to think straight with all this desire welling up inside you.  It isn\'t for a few moments that you realize you tongue is hanging out and drooling all over youself.  Gods, you want to fuck!' );
		} else if( CoC.player.lust < 90 ) {
			MainView.outputText( '\n\nPanting feverishly, you try to ignore the blush-colored downfall, but it\'s a futile gesture.  It makes your ' + CoC.player.skinFurScales() + ' burn hot, wicking inside you with devilish efficiency to stoke the fires of your lust beyond normal limits.' );
			if( CoC.player.hasCock() ) {
				MainView.outputText( '  Pre begins to dribble from your hot-and-ready cum-slit, eager to pour out in a deluge of sperm.' );
			} else if( CoC.player.hasVagina() ) {
				MainView.outputText( '  A flood of sopping moisture dribbles down your [legs], the proof of your unholy desire to breed.' );
			}
			MainView.outputText( ' You NEED to fuck soon.  You can barely contain yourself!' );
		} else if( CoC.player.lust < 100 ) {
			MainView.outputText( '\n\nMoaning out loud, you smear the stuff across your [chest] as it sprinkles you, the mounting desire almost at your limit.  You want to touch yourself SO BADLY, but you know that if you do, you\'ll wind up a mare to this centaur, perhaps forever.  You have to resist!  You can\'t fall victim to this... alluring creature.' );
		} else {
			MainView.outputText( ' Sinking to your knees, you start trying to tear your way out of your [armor].  You don\'t care about winning anymore - fucking this woman... this beast... that\'s all that matters.  You don\'t care how she takes you, as long as you get to cum all over her!' );
		}

	};
	HermCentaur.prototype.arouseSpellCharge = function() {
		// one turn charge-up, can be interrupted by tease;
		MainView.outputText( 'The centauress closes her eyes for a moment, then opens them.  Her eyes have gone completely, solidly black.  She\'s chanting low, though you see her dick bobbing beneath her in time with the mysterious utterances, leaking pre-cum.  You\'ve got to stop her!' );
		if( CoC.player.inte > 80 ) {
			MainView.outputText( '  A tease attack would likely be the most effective method of attack.' );
		}

		this._chargingArouse = true;
		this._lustAtChargeStart = this.lust;
		this._arouseCooldown = 7;
	};
	HermCentaur.prototype.arouseSpellCast = function() {
		this._chargingArouse = false;
		this._lustAtChargeStart = -1;
		if( this.lust >= this._lustAtChargeStart + 10 ) {
			//(Interrupted);
			MainView.outputText( 'Shuddering, the demoness stumbles over her words, and a flash of ruby light envelops her form!  A low, lurid moan escapes the crimson-fogged outline, echoing with lust beyond measure as its owner\'s spell backfires on her.  Ropes of pre as thick as most men\'s cum-shots splatter into the grass and cobble while the herm\'s balls seem to double in size.  Even then, the heavy male orbs shine dully, absolutely soaked with dripping mare-lube.' );
		} else {
			//(OH SHIT YOU GUNNA GET FUKKED);
			MainView.outputText( 'The chanting reaches a crescendo before you can stop it, and as the nine-foot woman points at you, you barely have time to enunciate a single curse.  Her spell is upon you.  There\'s a flash of crimson light, seemingly as bright as the sun, and then you\'re hit with a wave of lust so strong it might as well be a physical force.  It slaps you hard enough to send you reeling, even while your heart pumps every spare drop of blood south.  You cry out at the forced arousal, blubbering wildly as the pleasure mounts and images of you and your foe locked together in every sexual position imaginable flood your consciousness.' );
			EngineCore.dynStats( 'lus+', 20 + (CoC.player.lib / 6) + (CoC.player.sens / 6) );
		}
	};
	HermCentaur.prototype.hypnoCock = function() {
		this._hypnoCockUses++;
		if( this._hypnoCockUses === 1 ) {
			MainView.outputText( 'THWACK! You start at the odd noise - neither of you were making contact with the other.  THWACKschlorp!  This time a ludicrously wet sound punctuates the noise.  The demonic centaur is smiling widely, her cheeks flushing slightly as the audible noises continue, each time deepening her blush.  What the hell?  TWHACKschhhlick!' );
			MainView.outputText( '\n\nYou glance lower in time to see her member slowly stretching away from her equine underside, seemingly held by thick strands of her heavy pre.  Only when it\'s hanging low enough for the shiny webs to snap does it move, surging upward with fresh lust to slap against her belly, spattering globules of pre-cum over the furry flesh.  There\'s a steady, undeniable tempo to it - every impact seems to follow the same hidden beat as the one before, echoing through the courtyard and into your vulnerable ears.' );
			MainView.outputText( '\n\nOnly after watching spellbound for a few moments do you realize that the demoness has begun to talk, speaking in low whispers, "<i>Hard to look away isn\'t it?  I\'ve been told it can be quite hypnotic... almost... spell-binding.</i>"' );
			MainView.outputText( '\n\nWell, you can see that for yourself.  It\'s easy to watch it slowly lower, then smack up, ejecting a heavy load of pre-orgasmic fuck-juice.  You\'ve got to look at her while you fight her anyway, so you don\'t mind that you\'re looking there.  You can keep an eye where she\'s most vulnerable.' );
		} else {
			MainView.outputText( 'THWACK!  She\'s started thumping her cock against her belly again, and you look for the source of the noise again without thinking, spotting her turgid horse-cock just soon enough to watch it thump into her belly, a drizzle of pre running across its hard underside.  It slowly lowers, then rises again, slamming itself against her jizz-moistened underset with a wet slap.  The tempo is as steady and rhythmic as before, and the demon\'s voice doesn\'t help.' );
			MainView.outputText( '\n\n"<i>Yes, your eyes do seem to lock onto it, don\'t they?  They see my hard cock and they have such a hard time doing anything but watching it, letting it fill their view entirely,</i>" she muses quietly.' );
			MainView.outputText( '\n\nYes... it\'s quite mesmerizing.  You try to look up, but that cock just seems to slap itself right back into your view, the echo of the impact rattling around your skull.  The sultry centaur muses, "<i>I can see you\'re quite taken with it.  Surely there\'s no harm in relaxing to watch it, is there?</i>"' );
		}
		// Resistance-esque check, idk I threw this terrible shit together;
		if( CoC.player.inte * (2 / this._hypnoCockUses) > Utils.rand( (CoC.player.lib / 3) + (CoC.player.sens / 3) + (CoC.player.cor / 3) ) ) {
			EngineCore.dynStats( 'lus+', 2 + Utils.rand( (CoC.player.lib / 20) + (CoC.player.sens / 20) ) );
			if( CoC.player.lust <= 33 ) {
				MainView.outputText( '\n\nA warning thought jars you out of the cock-induced reverie with a start - this demon was going to hypnotize you, likely trying to seduce you into submission.  Not this time!  You tear yourself away and look her in the eye triumphantly.' );
			} else if( CoC.player.lust <= 66 ) {
				MainView.outputText( '\n\nA quiet voice pipes up somewhere inside you and warns that something is amiss.  It\'s enough to stir you from your stupor, kindling your willpower to wrest your view from your foe\'s gently bobbing fuck-log.  You look her in the eye triumphantly.' );
			} else {
				MainView.outputText( '\n\nA simpering voice begs you to look away from the deliciously-throbbing fuck-stick before you, but you nearly ignore it.  That fat cock looks so goddamn good - so hypnotic as it bounces and dances before you, enthralling you.  No!  You jerk your gaze up to look the demon in the eyes and frown when you see her gloating.  You might be primed to fuck, but you won\'t fall for her tricks this time!' );
			}
		} else {
			EngineCore.dynStats( 'lus+', 20 + 2 * this._hypnoCockUses + 2 + Utils.rand( (CoC.player.lib / 10) + (CoC.player.sens / 10) ) );
			MainView.outputText( 'Down it bobs, slowly hanging lower and lower... SMACK!  Up it goes, taking your bedazzled eyes along for the ride.  "<i>That\'s a good ' + CoC.player.mf( 'boy', 'girl' ) + ',</i>" the dick\'s director whispers, "<i>Just follow the tempo and let it fill your mind, oozing inside you with each thump.</i>"' );
			MainView.outputText( '\n\nFuck!  She\'s right, it\'s getting awfully hard to think about anything else.  You fixate further on the cock, unwilling or unable to look away.' );
			MainView.outputText( '\n\n"<i>It\'s so easy to just watch and let your thoughts leak out of your head?</i>" the voice asks.' );
			MainView.outputText( '\n\nYou nod.' );
			MainView.outputText( '\n\n"<i>Each pendulous motion, every movement, it\'s so sexy, isn\'t it?</i>"' );
			MainView.outputText( '\n\nAgain, you nod.' );
			MainView.outputText( '\n\nThe voice continues, "<i>Every pulse, every sloppy discharge, every throb... they\'re all so sexy, so wet and hot.  The harder you watch, the more arousing it gets... the more you want to touch it.</i>"' );
			MainView.outputText( '\n\nGods, you want to touch it.  One of the rigid veins pulsates, and you want to caress it so badly, to feel it twitch in your hand and drip all over you.  It looks so good, so powerful and lusty.  It\'s making you so horny just looking at it.  How would it feel to fuck it?  To ride it?  To bend over and present yourself to be willingly impaled?' );
			if( CoC.player.lust >= 100 ) {
				MainView.outputText( '\n\nYou whimper, too horny to care anymore.  You moan in anticipation when you realize she\'s going to breed you...' );
			} else {
				MainView.outputText( 'You stumble forward, the movement actually startling you from your lusty haze.  It\'s just what you need to free yourself from the unholy compulsion, and you ready yourself anew to take down this troublesome foe.  Still, your gaze keeps flicking down.  You\'ll have a harder time fighting off any similar teases...' );
				MainView.outputText( '\n\n"<i>Let\'s see the mighty \'Champion\' resist me now,</i>" the equine demon taunts, finally stopping her phallus\'s troublesome motion.' );
			}
		}
	};
	HermCentaur.prototype.gottaCum = function() {
		this._usedGottaCum = true;
		MainView.outputText( 'Sighing, the demoness gives you a lust glare and idly stomps at the ground with a hoof.  "<i>Stop turning-unf-on you... you stupid... sexy...ungh, DAMNIT!</i>" she protests, her rigid cock, slapping her belly while streamers of lady-jizz drip down the gleaming orbs that fill her black-skinned ballsack.  The centaur paws at her tits with unrepentant lust, tugging her large, hard nipples mercilessly while her hind legs stutter around, probably only moving in order to grind the thick, female lips together that much harder.' );
		MainView.outputText( '\n\nThe corruption-fouled, fair-skinned creature coos breathily, "<i>Now you\'ve got to watch me cum, Champion.</i>"' );
		MainView.outputText( '\n\nHundreds of pounds of monstrous, equine bulk shift and contort, her body violently clenching with bliss as her cock flares, rigid beneath her belly.  She moans and dribbles pink milk from her hard nipples as her pussy explodes, releasing a torrent of slimy lady-spunk that splashes in the grass between her hooves, flooding the air with her scent.  A second later, her fully-dilated cockhead trembles, the moist cum-slit opening wide.  A surge of white bursts from that narrow hole, spattering over the cobbles in a messy tide, flooding the air with salty jizz-smell.  Quaking, her cum-inflated nuts slowly shrink with each spray of spunk until they\'re barely the size of large apples.' );
		MainView.outputText( '\n\nFlushing, the demoness whimpers, "<i>...don\'t think I can do that again, but I don\'t think you\'ll be able to turn me on like that twice!</i>"' );
		this.lust = 0;
		EngineCore.dynStats( 'lus', 15 );
	};
	HermCentaur.prototype.healUp = function() {
		this._usedHeal = true;
		MainView.outputText( 'Wiping a drop of blood from her wounds, the demon frowns in irritation.  "<i>Do you have any idea how hard healing spells are to pull off when you\'re thinking about plowing a champion from behind?</i>"  Her eyes flutter closed in concentration while sexual fluids run unimpeded from her mixed genitals.  At the same time, her wounds close up, covered with freshly grown horsehair or pale pink skin.  A few moments later, she wobbles slightly and mutters, "<i>All better... hopefully you don\'t manage that twice.  I doubt I could pull it off again.  Then again, you\'ll likely be hilted on my dick or tongue-deep in my snatch by then, won\'t you?</i>"' );
		this.HP = this.eMaxHP();
	};
	return HermCentaur;
} );