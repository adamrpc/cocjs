﻿'use strict';
/*jshint bitwise: false*/

angular.module( 'cocjs' ).run( function( PregnancyStore, AppearanceDefs, Utils, StatusAffects, kFLAGS, CoC, EngineCore ) {
	function KatherineThreesome() {
	}

	/*
	 Contains the following scenes					Not available if Kath has no cock, Works for all except genderless characters
	 threeSixtyNine
	 roastYou					Not available if Kath has no cock
	 spitroastKath				Works for all except genderless characters
	 pinAndFuck					Not available if Kath has no cock					Kath is sober, Urta is drunk
	 watch																			Kath is sober, Urta is drunk
	 kathLicksOutUrta																Kath is drunk, Urta is sober
	 knothole					Not available if Kath has no cock					Kath is drunk, Urta is sober
	 sandwich					Not available if Kath has no cock					Kath is drunk, Urta is sober
	 orgy																			Both Kath and Urta are drunk
	 doubleStuffKath																	Both Kath and Urta are drunk
	 doublePenetrateKath																Both Kath and Urta are drunk
	 fistKathAndVala
	 doubleStuffVala				Not available if Kath has no cock
	 eatOutVala					Not available if Kath has no cock
	 */
	KatherineThreesome.prototype.circlejerk = function() { //Not available if Kath has no cock
		EngineCore.clearOutput();
		EngineCore.outputText( 'There’s no reason to not have some fun with the two of them... plus you don’t think you’d be able resist the allure of joining two of your favourite girls in their bonding.  Stripping off your ' + CoC.getInstance().player.armorName + ' you step behind the two girls and embrace Urta into a hug, hands wandering her body to loosen the straps of her armor.\n\n' );
		EngineCore.outputText( 'Urta seems to jump at your touch.  “<i>' + CoC.getInstance().player.short + '?  What are you doing, you naughty [boy]?</i>”  She giggles.  Kath looks at you and smirks, “<i>Couldn’t resist getting into this, huh, ' + CoC.getInstance().player.short + '?  Well, why not?  After all, we’re technically a </i>ménage à trois</i>, aren’t we?</i>”\n\n' );
		EngineCore.outputText( 'You give both girls a winning smile and tell them that you’ll be joining in on their fun shortly, but first you have to take care of a problem... Urta here is a bit overdressed... and come to think of it, so is Kath.\n\n' );
		EngineCore.outputText( 'Smirking, the cat begins to remove her shirt, pulling it off and casting it aside.  “<i>How big of a mess are we going to make with just a circlejerk?</i>”\n\n' );
		EngineCore.outputText( '“<i>Kitty, you got no idea who you’re talking about, do you?</i>” Urta says, letting the cat’s dick go to help you remove her clothes and armor as well.\n\n' );
		EngineCore.outputText( 'As soon as Urta’s top is off her, you move your hands to grope at her soft orbs, pinching and twisting her nipples, then pulling her head against your ' + (CoC.getInstance().player.hasBreasts() ? CoC.getInstance().player.breastDescript( 0 ) : 'chest') + ', and finally giving her perky fox-ear a gentle bite' );
		var race = CoC.getInstance().player.race(); //Looks like the best way to be sure you have sharp teeth
		var race3 = race.substr( 0, 3 ); //Tests for cat, dog, fox
		var race6 = race.substr( 0, 6 ); //Tests for dragon, drider, ferret, spider
		if( race3 === 'cat' || race3 === 'dog' || race3 === 'fox' || race6 === 'dragon' || race6 === 'drider' || race6 === 'ferret' || race6 === 'spider' || race === 'naga' || race === 'kitsune' || race === 'demon-morph' || race === 'shark-morph' || race.search( 'lizan' ) > -1 ) {
			EngineCore.outputText( ', careful not to hurt her with your sharp teeth' );
		}
		EngineCore.outputText( '.\n\nUrta giggles.  “<i>Frisky [boy]... mmm, you always did know how to get me ready, didn’t you?</i>” she asks, tail wagging softly behind her, indirectly patting you with its soft, fluffy mass.  Through all this her hand remains firmly attached to Kath’s dick, and she begins to gently slide it up and down, stroking with the ease of someone who has a lot of practice on their own dick.\n\n' );
		EngineCore.outputText( 'Urta’s fluffy tail patting you down is enough to get you in the mood' );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( '; [eachCock] erects, nice and ready for what’s to come' );
		} else if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '; your pussy is drenched with your juices, some of it dripping on Urta’s tail' );
		}
		EngineCore.outputText( '.' );
		EngineCore.outputText( ' Feeling it’s time to join them, you circle around and sit in front of them.  Smiling at both girls, you gently reach out and grip Urta’s cock in your hands, making sure to stroke her sensually over her entire length and smear her pre all over her flared tip.  You look at Kath, smiling seductively, teasing her with your eyes.\n\n' );
		EngineCore.outputText( '“<i>Is that a challenge, ' + CoC.getInstance().player.short + '?  That you can get vixxy here to cum before she gets me to cum, hmm?</i>” Kath asks, grinning and showing needle-like teeth.  “<i>Well, since you went and got so obligingly naked for us, I’m gonna make this a little more challenging...</i>”  She reaches out, her fingers ' );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( 'wrapping around your cock' + (CoC.getInstance().player.hasVagina() ? ' and ' : '') );
		}
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'gently teasing around your cunt' );
		}
		EngineCore.outputText( '.  “<i>Winner is whoever cums last?</i>” she jokes.\n\n' );
		EngineCore.outputText( '“<i>Sounds fine by me, kitty,</i>” Urta says, her breathing already harsh with lustful anticipation.  You join in on the fun, saying that sounds all right for you... then ask the girls what you get after you win?\n\n' );
		EngineCore.outputText( 'The words “<i>what do you want?</i>” pour from both girls simultaneously, each pair of lips curled into its own distinctive half-lustful, half-teasing smile.  They look at each other in surprise at speaking in unison like that, and then manage to give a small, but friendly, smile to each other.  Hmm... there is so much you could ask for... but for now you tell them you just want them to get along, and maybe later... a double service is in order?\n\n' );
		EngineCore.outputText( '“<i>First, you gotta win,</i>” Kath grins, Urta nodding her head in agreement.  “<i>And if we win... hmm... what will you do, vixxy?</i>”\n\n' );
		EngineCore.outputText( '“<i>I don’t know... I’ve never thought about it,</i>” Urta admits.\n\n' );
		EngineCore.outputText( '“<i>Well, I know what I want to do to [him]...</i>” Kath laughs, leering at you, but she doesn’t continue; evidently, she wants to unsettle you by letting your mind fill in the blanks.  Well, you won’t have to worry about that if you just focus on winning!  With that in mind, you redouble your efforts, doing your best to stroke Urta in all the sensitive spots you’ve come to know, ever since you started fooling around with her.\n\n' );
		EngineCore.outputText( 'The vixen yelps in shock, trailing off into a throaty moan of pleasure, but shakes her head, eager to win as well.  Her hand promptly starts sliding up and down Katherine’s prick, but her lack of familiarity with the ' + CoC.getInstance().scenes.katherine.cockType( 'canine shape, especially the swelling knot at its base,', 'feline shape and the swelling knot at its base' ) + ' means it’s not as effective as it might have been.  Still, she struggles admirably, fingers flexing and caressing even as her palm glides up and down, stroking and teasing ' + CoC.getInstance().scenes.katherine.cockType( 'the canine-cocked cat', 'Kath\'s shaft and knot' ) + '.\n\n' );
		EngineCore.outputText( 'You moan yourself as Kath starts struggling through her pleasure haze, not willing to be beaten without a fight.' );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( '   Her hand teases your [cock] with the soft pads on the tips of her fingers; every once in awhile, she reaches up to collect a dollop of pre and smear it along your shaft, making it easier for her to tease you into defeat.' );
		}
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '   Her ' + (CoC.getInstance().player.hasCock() ? 'other ' : '') + 'hand teases your labia by gently circling it, the fur tickling your entrance so deliciously, you can’t help but buck against her wandering finger, trying to capture it within your moist walls.' );
		}
		EngineCore.outputText( '\n\nThe three of you moan, groan, growl, yowl and buck in a chorus of sounds that leaves no doubt about what is taking place within the watch’s safe-house.  For a moment you let the pleasure of the moment overtake you... here you are, pleasuring and being pleasured by two sexy herms... they look so beautiful, moaning in pleasure at your mutual ministrations, naked and exposed, their differences bare before your eyes... as well as their similarities... but that is enough musing for now; you have a contest to win.\n\n' );
		EngineCore.outputText( 'You reach down to fondle Urta’s balls, rubbing and caressing the heavy orbs in your palms, then with a smirk, you extend your middle finger... and suddenly plunge it into Urta’s opening.  The fox lets out a very wolf-like howl of equal parts shock and pleasure at your bold action, her walls eagerly clamping down on the intruding digit and trying to suck you further inside.  “<i>T-that’s cheating, ' + CoC.getInstance().player.short + '!</i>” she whimpers.\n\n' );
		EngineCore.outputText( 'Smiling, you retort that what wouldn’t be fair is stroking only her cock, when she clearly has a sweet, tight honeypot just yearning for some attention.  With that said you wiggle your finger inside her, feeling her walls contract and grasp at your intruding digit.  Wriggling in her seat, femcum now beginning to ooze forth to join the puddle of pre already spreading out from around her balls, she shifts to better face Katherine, her free hand spearing through the space between them and schlicking its way wetly into the kitty-cat’s cunt.  The cat yowls in pleasured shock, and unthinkingly removes her hands from your ' + CoC.getInstance().player.genderText( 'cock', 'cunt', 'cock and cunt' ) + ', apparently so she can brace herself on the floor with greater ease.\n\n' );
		EngineCore.outputText( 'No longer held down by Kath, a devilish plan forms on your mind, and you quickly put it into motion.  Releasing Urta’s cock and pulling your finger out of her pussy, you quickly ' + (CoC.getInstance().scenes.katherine.hasBalls() ? 'reach for Kath’s balls to give them a fondle,' : 'slide the slick digit into Katherine\'s ass, rubbing her prostate') + ' while your femcum-slick hand grabs Urta’s cock, giving it a squeeze and a pump.  Both girls gasp and you brace for the oncoming onslaught.\n\n' );
		EngineCore.outputText( 'Kath cums first; whether because Urta is that good or because she’s just that inexperienced with being masturbated, you can’t say.  She arches her back and lets out a very feline shriek of ecstasy, her body quaking as her feminine orgasm pours onto the floor under her, wetting her ass with her sexual leavings, while gouts of cum spray from her ' + CoC.getInstance().scenes.katherine.cockMultiple( '', 'twin ' ) + CoC.getInstance().scenes.katherine.cockType( 'pointy-tipped', 'barbed' ) + ' prick' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + '.\n\n' );
		EngineCore.outputText( 'Urta, meanwhile, manages to hold it a little longer, but even as the first few splatters of Kath’s kitten-cum land on her black-nippled breasts, the vulpine herm is launching her own assault, great gobbets of jizz belching from her cock-head, spraying right across Kath’s face and breasts and oozing down to paint her stomach.  Meanwhile, Kath ' );
		var kathCumQ = CoC.getInstance().scenes.katherine.cumQ();
		if( kathCumQ < 500 ) {
			EngineCore.outputText( 'stains Urta’s two-toned breasts with her creamy silver jizz' );
		} else if( kathCumQ < 1500 ) {
			EngineCore.outputText( 'soaks Urta from the waist up with her prodigious orgasm' );
		} else {
			EngineCore.outputText( 'utterly covers her from head to toe with her massive eruption of spooge' );
		}
		EngineCore.outputText( ', yowling in pleasure and uncaring of the fact she’s getting Urta’s salty spunk in her mouth.  By sheer coincidence, the bulk of their orgasms land on each other, rather than on you.\n\n' );
		EngineCore.outputText( 'Laughing, you grin at the cum covered beauties in front of you, thankful to have come out of this little show of theirs fairly unscathed.  Gloating and puffing your chest, you proudly declare yourself the winner of this little contest.\n\n' );
		EngineCore.outputText( '“<i>You cheated, ' + CoC.getInstance().player.short + '!</i>” Urta complains.\n\n' );
		EngineCore.outputText( '“<i>Yeah, what she said!</i>” Kath agrees.\n\n' );
		EngineCore.outputText( 'Cheated!?  Feigning hurt, you tell them you would never do something like that!  Especially not when it involves a special prize, such as their undivided attention as they focus on YOUR orgasm... speaking of which...  you will be taking your prize right now if they don’t mind.  Getting up and stepping up towards Urta and Kath you raise a brow as if questioning when they intend to get started.\n\n' );
		EngineCore.outputText( 'They look at each other, look at you, then look at each other again and grin.  “<i>Alright... if you insist...</i>” they say, their tones ringing with blatantly false innocence, before they suddenly get on all fours, slinking towards you.  Uh oh... you barely have time to turn tail and run before you see a pair of blurs, one ' + CoC.getInstance().scenes.katherine.catGirl( 'of pale flesh and ' + CoC.getInstance().scenes.katherine.hairColor + 'hair', 'black' ) + ' and the other ' + CoC.getInstance().scenes.katherine.catGirl( 'gray', 'of gray fur' ) + ', jump right at you; with a scream you’re dragged to the ground in a frenzy of cum-slickened limbs, touched, caressed, and kissed.  You moan as a pair of lips close on your own, so overwhelmed you are that you can’t tell who it is until a canine tongue intrudes upon your mouth.  You kiss Urta back with abandon; moments later she breaks the kiss, only for her lips to be replaced with Kath’s as she kisses and humps you.\n\nYou feel the cum soaking their bodies rubbing off on your own, their breasts massaging your ' + (CoC.getInstance().player.hasBreasts() ? CoC.getInstance().player.breastDescript( 0 ) : 'chest') + '.  For a moment you feel utter bliss, and then ' );
		if( CoC.getInstance().player.hasCock() && CoC.getInstance().player.hasVagina() ) { //Herm
			EngineCore.outputText( 'you\'re overcome.  Your pussy and hips lock up and you dribble femcum as Urta and Kath\'s efforts pay off.  You feel hot liquid rushing up from your ' + (CoC.getInstance().player.balls > 0 ? 'balls' : 'prostate') + ', then an explosion...\n\n' );
		} else if( CoC.getInstance().player.hasVagina() ) { //Female
			EngineCore.outputText( 'you\'re overcome.  Your pussy and hips lock up and you dribble femcum as Urta and Kath\'s efforts pay off.\n\n' );
		} else {
			EngineCore.outputText( 'an explosion...\n\n' );
		}
		if( CoC.getInstance().player.hasCock() ) {
			if( CoC.getInstance().player.cumQ() < 500 ) {
				EngineCore.outputText( 'Rope upon rope of hot, white jism erupts from your [cocks] arching through the air to fall back on the three of you.  Adding another small layer of white to your entwined bodies.  Urta and Kath both look at you with wanton eyes, and you know this isn’t finished yet...' );
			} else if( CoC.getInstance().player.cumQ() < 1500 ) {
				EngineCore.outputText( 'A fountain of cum sprays into the air, raining down upon you and your lovers.  Your [cocks] twich against the lovely ladies, rubbing you all over.  With a groan you force one last spray out of your cock.  You see the white rope of cum arch and fall, heading towards your face only to be stopped by Kath’s head as she kisses you once more; the rope splattering against the back of her head, only to be licked off by Urta, who eyes you with hunger still...' );
			} else {
				EngineCore.outputText( 'A veritable eruption soars forth from your [cocks] spurting so far up, you fear you might end up painting the ceiling; a continuous rope of white spunk falls over you and your lovers, further contributing to the mess and hosing their bodies down with your own orgasm.  You can’t help but look up in bliss, moaning as the girls take turn licking your body and face, until finally, one last spray falls on your chin, only to be licked off by a pair of tongues, who proceed to fight for the last in a kiss, each trying to one-up the other and catch the last drop of cum.  You don’t know who wins... but moments later, they look at you with hunger in their eyes... even after all this, they are not sated yet...' );
			}
		}
		EngineCore.outputText( 'The two morphic herms moan and growl lustily, eagerly rubbing their stiff, mismatched dicks across your stomach, your ' + (CoC.getInstance().player.hasBreasts() ? CoC.getInstance().player.breastDescript( 0 ) : 'chest') + ', your [hips]' );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( ' and especially against your ' + CoC.getInstance().player.cockDescript() );
		}
		EngineCore.outputText( '; pressed up against you like they are, you can feel their cocks pulsing, their balls swelling...\n\n' );
		EngineCore.outputText( 'Urta cums first, giving a lusty howl as she paints you white with her thick, sloppy fox-seed, her apple-sized balls drawing up into her crotch as she does her best to squeeze a nice, big, wet orgasm over you.  Kath throws back her head with a feral yowl as she follows suit, ' );
		if( kathCumQ < 500 ) {
			EngineCore.outputText( 'her contribution lost amidst the cascade of Urta’s fox-jizz' );
		} else if( kathCumQ < 1500 ) {
			EngineCore.outputText( 'her load just as big as Urta’s, ensuring you are utterly soaked in mis-dicked herm spunk' );
		} else {
			EngineCore.outputText( 'her huge balls dredging up a load so massive it washes Urta’s cum right off your body' );
		}
		EngineCore.outputText( '.  With twin moans of tired relief, the two girls flop, none-too-gently, onto your cum-soaked body, splattering jizz everywhere and instinctively snuggling against you, one face cuddling into either crook of your neck.\n\n' );
		EngineCore.outputText( 'You hug the girls close, enjoying your shared afterglow.  Panting as you fight to remain awake.  Looking down, you see the sleeping visage of both Urta and Kath, snuggled tightly against you, and you smile.  Well... it doesn’t seem like you’re going anywhere... so might as well as let go and join them...' );
		CoC.getInstance().player.orgasm();
		CoC.getInstance().scenes.katherine.orgasm();
		CoC.getInstance().scenes.katherine.katherineAndUrtaHadSex( false );
		CoC.getInstance().flags[ kFLAGS.URTA_TIME_SINCE_LAST_CAME ] = 2 + Utils.rand( 2 );
		CoC.getInstance().flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ] += 2;
		CoC.getInstance().scenes.urta.urtaLove( 1 );
		if( CoC.getInstance().flags[ kFLAGS.KATHERINE_UNLOCKED ] !== 3 ) {
			if( CoC.getInstance().time.hours >= 13 ) {
				CoC.getInstance().flags[ kFLAGS.KATHERINE_LOCATION ] = CoC.getInstance().scenes.katherine.KLOC_URTAS_APT; //Katherine.timeChange will sort out whether Kath actually stays with Urta
			}
			EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour ); //An additional scene plays afterward if Kath is still being trained by Urta
		}
	};
	KatherineThreesome.prototype.threeSixtyNine = function() {
		EngineCore.clearOutput();
		if( CoC.getInstance().scenes.katherine.isAt( CoC.getInstance().scenes.katherine.KLOC_BAR ) || CoC.getInstance().scenes.katherine.isAt( CoC.getInstance().scenes.katherine.KLOC_BAR_DRUNK ) ) {
			EngineCore.outputText( 'You drag the ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'eager herms' : 'lusty pair') + ' to one of the backrooms.  Urta locks the door' );
		} else {
			EngineCore.outputText( 'Urta grabs Kath from behind' );
		}
		EngineCore.outputText( ' and gets to work exposing every inch of Kath’s body.  You put on a little show of taking off your clothes, which both Kath and Urta appreciate.\n\n' );
		EngineCore.outputText( 'Once the three of you are naked Kath drops to her knees and sucks Urta’s cock into her mouth.  Urta gives her a pat on the head and starts to scratch Kath’s ears which causes Kath to start teasing the tip with her rough tongue - if Urta’s reaction is anything to go by.\n\n' );
		EngineCore.outputText( 'Urta allows herself to sink to the ground, Kath taking her cock deeper and deeper as she descends.  You move closer and ask Urta if she plans to ‘thank’ Kath.  She gives you a wolfish grin and twists around until she’s lying in the opposite direction.  She grabs ' );
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( CoC.getInstance().scenes.katherine.cockMultiple( 'Katherine’s cock', 'the lower of Katherine’s cocks' ) + ' and rolls her tongue around its head.\n\n' );
		} else {
			EngineCore.outputText( 'Katherine\'s hips and buries her tongue in that wet pussy.\n\n' );
		}
		EngineCore.outputText( 'Kath moans and tries to thrust her hips forward but Urta holds her back.  ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'While she continues to toy with Kath’s cock Urta uses her other hand to slip a couple of fingers into Kath’s pussy.  Not to be outdone Kath returns the favor' : 'While her tongue explores the depths of Kath\'s love tunnel Urta rubs her nose against Kath\'s clit.  Not to be outdone Kath jams her fingers into Urta\'s slick cunt') + '.  In no time it’s like they’re locked in combat - each trying to force the other to lose control' + (CoC.getInstance().scenes.katherine.hasCock() ? '; trying to push their shaft deep down the other’s throat' : '') + '.\n\n' );
		EngineCore.outputText( 'Of course it would be rude of you not to offer some ‘encouragement’.  You get behind Katherine and motion to Urta so she knows what you’re up to.  She grins' );
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( CoC.getInstance().scenes.katherine.cockMultiple( ' and sucks on Kath’s prick', ', switches to Kath’s other cock and sucks on it' ) );
		} else {
			EngineCore.outputText( ' and traps Kath\'s clit between her thumbs, forcing it to stand proud so she can suck on it' );
		}
		EngineCore.outputText( ' like it’s a lollipop.  While Kath is distracted you come from behind and force your shaft between her thighs.  Urta ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'uses her hand to guide' : 'pulls her tongue out at the last second, guiding') + ' you into Kath’s quim and you feel the cat ' + CoC.getInstance().scenes.katherine.catGirl( 'girl', 'morph' ) + ' stiffen up.\n\n' );
		EngineCore.outputText( 'You start to enjoy the feeling of filling Kath while watching her suck on Urta’s shaft.  Kath’s grip on the base of Urta’s shaft starts to weaken and with every thrust her lips go further and further down until she’s able to lick Urta’s balls.\n\n' );
		EngineCore.outputText( 'Looking over Kath’s shoulder you can see that Urta has thrown her head back to moan.  That’s a little inconsiderate given what Katherine is doing for her.  You pull out, swap sides, and before Urta realizes what’s going on you push your cock between her thighs and plunge into her depths.  Urta lets out a little “<i>Ah!</i>” and goes back to licking Kath’s ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'cockhead' : 'pussy') + '.\n\n' );
		EngineCore.outputText( 'With your shaft inside Urta you get to watch and feel the lust overcome her.  The combination of your cock and Kath’s delightful tongue soon drive Urta over the edge and she ' );
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( CoC.getInstance().scenes.katherine.cockMultiple( 'sucks down Kath’s entire cock in one fluid motion', 'surprises you by gobbling both of Kath’s shafts' ) + '.\n\n' );
		} else {
			EngineCore.outputText( 'starts slurping and sucking on Kath\'s pussy like she\'s dying of thirst.\n\n' );
		}
		EngineCore.outputText( 'With all the stimulation Urta is the first to cum, her dick exploding into Kath’s throat.  Kath holds it deep inside and you see her stomach swell with Urta’s spooge.' );
		if( CoC.getInstance().scenes.katherine.pregSize() > 0 ) {
			EngineCore.outputText( ' Even her pregnancy is eclipsed by the volume of cum Urta pumps out.' );
		}
		EngineCore.outputText( '\n\nThe feeling of being filled must have been enough to push her over the edge because Kath ' );
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( 'thrusts forward, nearly driving her knot' + CoC.getInstance().scenes.katherine.cockMultiple( ' past Urta’s lips.  It', 's past Urta’s lips.  With two shafts to carry the load it' ) + ' doesn’t take long before Urta’s belly starts to round as well.  The two herms start to look like a yin and yang symbol, but' );
		} else {
			EngineCore.outputText( 'locks her legs around Urta\'s head.  A vacant, pleased expression crosses Kath\'s face as she tongues Urta\'s balls, coaxing out every last drop.  Now' );
		}
		EngineCore.outputText( ' after that display you’re desperate to add your contribution.\n\n' );
		var canImpregUrta = (CoC.getInstance().flags[ kFLAGS.URTA_FERTILE ] === 1) && (!CoC.getInstance().scenes.urta.pregnancy.isPregnant);
		var doKath;
		if( CoC.getInstance().scenes.katherine.fertile && (CoC.getInstance().scenes.katherine.pregSize() === 0) ) {
			if( canImpregUrta ) {
				doKath = (Utils.rand( 2 ) === 0);
			} else {
				doKath = true;
			}
		} else {
			if( canImpregUrta ) {
				doKath = false;
			} else {
				doKath = (Utils.rand( 2 ) === 0);
			}
		}
		if( doKath ) {
			EngineCore.outputText( 'You pull out and switch back to Kath.  She’s so relaxed and so wet that your cock slides back inside easily.  You only need to give her a few strokes before you feel her tunnel clenching as Katherine starts into a second orgasm.  ' );
		}
		EngineCore.outputText( 'You bury yourself to the root and give ' + (doKath ? 'Kath' : 'Urta') + ' all you’ve got, filling her with your seed.  ' );
		if( CoC.getInstance().player.cumQ() < 1500 ) {
			if( !doKath && !CoC.getInstance().scenes.katherine.hasCock() ) {
				EngineCore.outputText( 'Urta\'s flat belly swells to match Kath\'s.  Your girls start to look like a yin and yang symbol, but your cum went where it counts.' );
			} else {
				EngineCore.outputText( 'It’s barely noticeable compared with the load ' + (doKath ? 'Urta' : 'Kath') + ' pumped into her belly, but your cum went where it counts.' );
			}
		} else {
			EngineCore.outputText( 'Your overpowered ' + (CoC.getInstance().player.balls > 0 ? 'balls produce' : 'prostate produces') + ' jet after boiling jet of cum.  ' );
		}
		if( doKath || CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( 'You feel a bit of resistance - after all there’s little space left for ' + (doKath ? 'Katherine' : 'Urta') + '’s belly to expand.  ' );
		}
		EngineCore.outputText( 'Most of your load ends up shooting back out of ' + (doKath ? 'Kath' : 'Urta') + '’s pussy, covering you, her and the floor with a massive puddle of sperm.' );
		EngineCore.outputText( '  You give ' + (doKath ? 'Kath' : 'Urta') + '’s belly a little pat and she moans appreciatively.\n\n' );
		EngineCore.outputText( 'You pull free and roll away.  It’s not that you want to, but you’ve got things to attend to.  ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'The two herms' : 'Kath and Urta') + ' separate and lie back on the floor exhausted.  As you pass them, heading for the door, you notice they’re holding hands.  It’s actually quite a romantic scene.' );
		if( !doKath ) {
			CoC.getInstance().scenes.urta.knockUpUrtaChance();
		}
		CoC.getInstance().player.orgasm();
		CoC.getInstance().scenes.katherine.orgasm();
		CoC.getInstance().scenes.katherine.katherineAndUrtaHadSex( false );
		CoC.getInstance().flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ]++;
		CoC.getInstance().flags[ kFLAGS.URTA_TIME_SINCE_LAST_CAME ] = 2 + Utils.rand( 2 );
		CoC.getInstance().scenes.urta.urtaLove( 1 );
		if( CoC.getInstance().flags[ kFLAGS.KATHERINE_UNLOCKED ] !== 3 ) {
			if( CoC.getInstance().time.hours >= 13 ) {
				CoC.getInstance().flags[ kFLAGS.KATHERINE_LOCATION ] = CoC.getInstance().scenes.katherine.KLOC_URTAS_APT; //Katherine.timeChange will sort out whether Kath actually stays with Urta
			}
		}
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	KatherineThreesome.prototype.roastYou = function() { //Not available if Kath has no cock
		EngineCore.clearOutput();
		if( CoC.getInstance().scenes.katherine.isAt( CoC.getInstance().scenes.katherine.KLOC_BAR ) || CoC.getInstance().scenes.katherine.isAt( CoC.getInstance().scenes.katherine.KLOC_BAR_DRUNK ) ) {
			EngineCore.outputText( 'You lead the horny herms toward one of the bar’s backrooms.  You get inside and lock the door but as you turn around Urta jumps you from behind, twisting your arm and pulling you to the floor.  Kath laughs and starts helping Urta as she removes your clothes.\n\n“<i>You’re too slow today ' + CoC.getInstance().player.short + '.  I’m horny as anything and I can tell from her scent that Katherine is dying for a good fuck too.  Just relax and we’ll take really good care of you.</i>”' );
		} else {
			EngineCore.outputText( 'You start to move towards the door.  It’s not that you don’t want to help Kath, but you really ought to get back to camp.  You think Urta is still distracted by Kath, who is now running her fingers along her sides seductively.\n\n' );
			EngineCore.outputText( 'Urta spies you edging toward the door and decides to demonstrate the voice of authority to both of you.  “<i>Katherine, ' + CoC.getInstance().player.short + '!  Hold it right there!</i>” she shouts, causing both you and Kath to pause.  Then Urta launches herself your way.  You manage to dodge clear, but Urta slams bodily into the door, blocking it.  She grins like a fox that just woke up inside the henhouse.\n\n' );
			EngineCore.outputText( '“<i>OK, Kath - subdue the perpetrator.</i>”  You look around just in time to get pounced by Kath.  She’s horny too and isn’t pulling her punches.  “<i>Ha ha, yeah, she’s really getting good at catching her prey,</i>” says Urta, standing over the two of you.\n\n' );
			EngineCore.outputText( 'Urta grabs your arms while Kath gets to work removing your clothes.  You’re so close you can see the precum oozing from the tip of Urta’s cock and wetting the lower part of her shirt.  Urta whispers “<i>You come in here, you get us both warmed up and then you try to sneak out?</i>”\n\n' );
			EngineCore.outputText( 'Katherine chimes in with “<i>Yeah, what gives?</i>”  Urta looks you in the eye and says “<i>This is our turn.  I’m going to feed you this monster and Kath is going to fuck ' );
			if( !CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( 'your ass' );
			} else {
				EngineCore.outputText( CoC.getInstance().scenes.katherine.cockMultiple( 'your pussy', 'both your pussy and your ass' ) );
			}
			EngineCore.outputText( '.  May Marae help your innards.</i>”' );
		}
		EngineCore.outputText( '\n\nYou’re not in a position to argue.  Once you’re naked Urta sits on top of you and ' );
		if( CoC.getInstance().player.biggestTitRow() > AppearanceDefs.BREAST_CUP_DD ) {
			EngineCore.outputText( 'massages the sides of your breasts' );
		} else if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( 'massages your nutsack' );
		} else if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'runs her finger up and down your slit' );
		} else {
			EngineCore.outputText( 'plays with your asshole' );
		}
		EngineCore.outputText( ', warming you up.  Soon you see the last of Kath’s clothes hit the wall in front of you and the head' );
		if( CoC.getInstance().scenes.katherine.cockNumber > 1 ) {
			EngineCore.outputText( 's of her cocks press firmly against ' + (CoC.getInstance().player.hasVagina() ? 'both your holes' : 'your ass') );
		} else {
			EngineCore.outputText( ' of her cock presses firmly against your ' + (CoC.getInstance().player.hasVagina() ? 'cunt' : 'ass') );
		}
		EngineCore.outputText( '.\n\nKath pushes your legs apart with her knees and starts to force ' );
		if( CoC.getInstance().scenes.katherine.cockNumber === 1 ) {
			EngineCore.outputText( 'her ' + CoC.getInstance().scenes.katherine.cockLength + ' inch ' + CoC.getInstance().scenes.katherine.cockType( 'doggy dick', 'cat cock' ) + ' into your ' + (CoC.getInstance().player.hasVagina() ? 'pussy' : 'rectum') );
		} else if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'her twin ' + CoC.getInstance().scenes.katherine.cockType() + ' shafts into your body' );
		} else {
			EngineCore.outputText( 'her ' + CoC.getInstance().scenes.katherine.cockType() + '  cocks into your body, caring little that your ass wasn’t built to take her twin ' + CoC.getInstance().scenes.katherine.cockLength + ' inch shafts' );
		}
		EngineCore.outputText( '.  Kath gets a firm grip on your hips and starts to rock gently, slowly opening you up.  From her purring you know she’s enjoying every second.\n\n' );
		EngineCore.outputText( 'Now that Kath has you in hand Urta stands and starts to strip, teasing both you and Kath as she exposes herself.  Even when she’s naked she continues, stroking her cock with one hand and lifting her balls out of the way with the other to give you and Katherine a good look at her soaking wet twat.\n\n' );
		EngineCore.outputText( 'Kath pushes a little deeper before pulling you off the floor and onto your hands and knees.  “<i>Don’t be a tease Urta, give ' + CoC.getInstance().player.mf( 'him', 'her' ) + ' all you’ve got!</i>”  Urta gives you a grin, grips her cock tightly near the base and pulls her fingers up its length slowly, forcing out a hefty supply of pre.  She gets to her knees in front of you and smears the pre up and down the length of her shaft.\n\n' );
		EngineCore.outputText( 'She moves close enough and gestures toward her glistening horsecock.  “<i>Salted enough for your tastes?</i>” she asks.  By now Kath’s ' + CoC.getInstance().scenes.katherine.cockMultiple( 'shaft has done its work', 'twin shafts have done their work' ) + ' and you’re too horny to resist.  You wrap your mouth around Urta’s spooge cannon and suck on it like a hot, meaty saltlick.\n\n' );
		EngineCore.outputText( '“<i>Oh yeah, that’s a good ' + CoC.getInstance().player.mf( 'boy', 'girl' ) + '!</i>” Urta shouts, loud enough for ' + (CoC.getInstance().scenes.katherine.isAt( CoC.getInstance().scenes.katherine.KLOC_BAR ) || CoC.getInstance().scenes.katherine.isAt( CoC.getInstance().scenes.katherine.KLOC_BAR_DRUNK ) ? 'anyone at the bar' : 'people on the street') + ' to hear.  The two herms start to work in tandem - Kath pulling out as Urta shoves her cock deeper and then Urta pulling back far enough for you to tongue the tip of her cock while Kath sinks in up to her knot' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + '.\n\n' );
		EngineCore.outputText( 'They keep up this pace until you decide to push some of Urta’s buttons.  Reaching up blind your hand finds her balls and you begin to rub her sperm filled sack.  Urta shudders, reverses herself and thrusts forward at the same time as Kath.  All of a sudden you’ve got a foot of horsecock down your throat and Katherine’s ' + CoC.getInstance().scenes.katherine.cockType() + CoC.getInstance().scenes.katherine.cockMultiple( ' shlong', ' meatsticks' ) + ' buried knot deep in' );
		if( !CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( ' your ass' );
		} else if( CoC.getInstance().scenes.katherine.cockNumber > 1 ) {
			EngineCore.outputText( ' both your other holes' );
		} else {
			EngineCore.outputText( 'side your cunt' );
		}
		EngineCore.outputText( '.\n\nAfter that it’s a wild ride.  Kath and Urta start hammering in and out, concentrating on cumming.  You get used as a living cocksleeve and you enjoy it.  Urta’s monster cock is so wide and thrusts in and out so quickly that it overwhelms your gag reflex, your throat deciding that it’s normal to be packed full of salami.  Down below, Kath’s ' );
		var wasButtStretched = false;
		if( CoC.getInstance().scenes.katherine.cockNumber > 1 ) {
			if( CoC.getInstance().player.hasVagina() ) {
				wasButtStretched = CoC.getInstance().player.buttChange( CoC.getInstance().scenes.katherine.cockArea(), false );
				EngineCore.outputText( 'knots seat themselves inside both your pussy and ass' );
			} else {
				wasButtStretched = CoC.getInstance().player.buttChange( 2 * CoC.getInstance().scenes.katherine.cockArea(), false );
				EngineCore.outputText( 'twin knots hammer against your sphincter.  At last it gives out and opens wide, allowing first one, then the other inside.  They puff up to full size, stretching your tortured ass ' + (wasButtStretched ? 'even wider' : 'to its limit') );
			}
			EngineCore.outputText( ', sealing you up' );
		} else {
			if( CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( 'knot slides inside your pussy and expands to full size just as nature intended, sealing up your pussy' );
			} else {
				wasButtStretched = CoC.getInstance().player.buttChange( CoC.getInstance().scenes.katherine.cockArea(), false );
				EngineCore.outputText( 'knot squeezes past your sphincter and pops into your rectum.  It quickly expands to full size, sealing up your colon' );
			}
		}
		EngineCore.outputText( ' for her coming deposit' + (CoC.getInstance().player.hasVagina() && !CoC.getInstance().player.isPregnant() ? ' and ensuring your uterus will be awash with her seed' : '') + '.\n\n' );
		if( CoC.getInstance().player.hasVagina() ) {
			if( CoC.getInstance().player.cuntChange( CoC.getInstance().scenes.katherine.cockArea(), true ) ) {
				EngineCore.outputText( '\n\n' );
			}
		}
		if( wasButtStretched ) {
			CoC.getInstance().player.buttChangeDisplay();
			EngineCore.outputText( '\n\n' );
		}
		EngineCore.outputText( 'A little twitch in Urta’s balls tells you she’s ready to fire.  As encouragement you find her pussy by feel and twist her clit between your fingers.  Urta grabs your head in both hands and yanks, pressing your ' + (CoC.getInstance().scenes.urta.pregnancy.isPregnant ? 'forehead against her swollen belly' : 'face against her groin') + '.  The first load creates such a bulge in Urta’s cock that it actually forces your jaws open even wider.  With her cock so far down your throat all her cum shoots straight into your stomach, bloating you until you look ' + (CoC.getInstance().player.isPregnant() ? 'like you’re a few months further along than you are' : 'several months pregnant') + '.\n\n' );
		EngineCore.outputText( 'Urta falls back on the floor, letting you cough up some cum and take a few breaths.  “<i>Whew!</i>” she says, wiping her brow, “<i>that was great.  Looks like we really stuffed you.</i>”  Then her eyes shift upward and she says “<i>Oh. I guess I really stuffed you.  Kath hasn’t cum yet.</i>”\n\n' );
		EngineCore.outputText( 'Kath rocks her knot' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' back and forth and whines.  Urta grins like a wolf and says “<i>You can do it Kath.  ' + CoC.getInstance().player.short + ' asked for it, now give it to ' + CoC.getInstance().player.mf( 'him', 'her' ) + '.</i>”  Urta stands on wobbly legs and moves out of sight.  You’re still so full and out of breath that you can’t do anything to stop her, even if you wanted.\n\n' );
		EngineCore.outputText( 'You hear a surprised “<i>Oh</i>” from Katherine.  Then Urta’s voice, low and sexy, “<i>' );
		if( CoC.getInstance().scenes.katherine.ballSize > 0 ) {
			EngineCore.outputText( 'These balls of yours are so nice and full' );
		} else {
			EngineCore.outputText( 'Mmmm, your prostate is just so hot and swollen' );
		}
		EngineCore.outputText( '.  So much cum, don’t you want to let it all go?</i>”\n\n' );
		EngineCore.outputText( 'Kath whispers, “<i>Please help me,</i>” so quietly that you can barely hear her.\n\n' );
		switch( CoC.getInstance().player.gender ) {
			case  0: //Genderless
				EngineCore.outputText( '“<i>Yes, of course I’ll help you,</i>” says Urta.  You don’t know what she’s doing back there, but you can hear Katherine’s breaths getting faster and sharper.  “<i>Kath, I’m going to keep milking your prostate until you pump every drop inside ' + CoC.getInstance().player.short + '’s ass to remind ' + CoC.getInstance().player.mf( 'him', 'her' ) + ' how much fun genitals can be.</i>”\n\n' );
				EngineCore.outputText( 'Kath’s ' + CoC.getInstance().scenes.katherine.catGirl( 'nails', 'claws' ) + ' dig into your hips and you feel jet after jet of cum filling your colon.  Combined with the load Urta pumped into your belly it bloats you enough to make you feel green.  Yet at the same time the pulsing cock' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' buried in your ass finally grant you release and you cum and cum, your featureless crotch tingling with pleasure.' );
				break;
			case  2: //Female
				EngineCore.outputText( 'You feel Urta’s hand between your legs.  She takes hold of your clit, just as you did to her.  “<i>Yes, of course I’ll help you,</i>” says Urta, gently rolling your clit between her fingers.  “<i>You just need a little something - like ' + CoC.getInstance().player.short + '’s wonderful pussy ' + CoC.getInstance().scenes.katherine.cockMultiple( 'squeezing your cock', 'and tight little bum squeezing your cocks' ) + ' as she cums.</i>”\n\n' );
				EngineCore.outputText( 'Urta’s playful fingers quickly cause you to cum and, as Urta predicted, your orgasm triggers Kath’s.  ' + (CoC.getInstance().player.hasCock() ? 'Your own cock sprays the floor uselessly while Katherine' : 'With one last mighty heave she') + ' buries her cock' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' just a tiny bit deeper.  Then the flood begins.  Already stuffed with Urta’s load your belly expands even further.  Your ' + (CoC.getInstance().player.isPregnant() ? 'birth canal' : 'womb') + CoC.getInstance().scenes.katherine.cockMultiple( ' throbs', ' and colon throb' ) + ' painfully in protest but with Kath’s knot' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' mercilessly blocking the exit' + CoC.getInstance().scenes.katherine.cockMultiple( ' it has', 's they have' ) + ' no choice but to take every drop.' );
				break;
			default: //Male or Herm
				EngineCore.outputText( 'Urta’s fingers wrap around your cock.  Ignored until now it jumps at the attention.  “<i>Yes, of course I’ll help you,</i>” says Urta, softly stroking your member.  “<i>You just need a little something - like ' + CoC.getInstance().player.short + '’s tight little bum squeezing your cock' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' as he cums.</i>”\n\n' );
				EngineCore.outputText( 'Urta’s playful fingers slide up and down your shaft.  You were already on edge and the added pleasure soon causes your ' + (CoC.getInstance().player.ballSize > 0 ? 'balls' : 'prostate') + ' to tighten, spraying your load across the floor uselessly.  As Urta predicted, your orgasm triggers Kath’s.  With one last mighty heave she buries her prick' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' just a tiny bit deeper.  Then the flood begins.  Already stuffed with Urta’s load your belly expands even further.  Your colon throbs painfully, but with Kath’s knot' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' mercilessly blocking the exit it has no choice but to take every drop.' );
		}
		EngineCore.outputText( '\n\nKath collapses on top of you, spent.  Urta twists you around enough to give you and Kath each a kiss.  “<i>Thanks ' + CoC.getInstance().player.short + ', that’s exactly what I needed.</i>”\n\n' );
		EngineCore.outputText( '“<i>Me too,</i>” purrs Kath as she snuggles up against your back for a nap.  You stick around long enough for ' + CoC.getInstance().scenes.katherine.cockMultiple( 'Katherine’s knot', 'Kath’s knots' ) + ' to slide out, then you’re on your way - leaving Kath and Urta to take care of each other.' );
		CoC.getInstance().player.orgasm();
		CoC.getInstance().scenes.katherine.orgasm();
		CoC.getInstance().scenes.katherine.katherineAndUrtaHadSex( false );
		CoC.getInstance().flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ]++;
		CoC.getInstance().flags[ kFLAGS.URTA_TIME_SINCE_LAST_CAME ] = 2 + Utils.rand( 2 );
		CoC.getInstance().scenes.urta.urtaLove( 1 );
		if( CoC.getInstance().flags[ kFLAGS.KATHERINE_UNLOCKED ] !== 3 ) {
			if( CoC.getInstance().time.hours >= 13 ) {
				CoC.getInstance().flags[ kFLAGS.KATHERINE_LOCATION ] = CoC.getInstance().scenes.katherine.KLOC_URTAS_APT; //Katherine.timeChange will sort out whether Kath actually stays with Urta
			}
		}
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	KatherineThreesome.prototype.spitroastKath = function() { //Works for all except genderless characters
		EngineCore.clearOutput();
		var atBar = CoC.getInstance().scenes.katherine.isAt( CoC.getInstance().scenes.katherine.KLOC_BAR ) || CoC.getInstance().scenes.katherine.isAt( CoC.getInstance().scenes.katherine.KLOC_BAR_DRUNK );
		if( atBar ) {
			EngineCore.outputText( 'You lead the ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'horny herms' : 'lusty pair') + ' toward one of the bar’s backrooms.  You get inside, lock the door and when you turn around you see that Urta has grabbed Kath from behind to make sure she couldn’t jump you.' );
		} else {
			EngineCore.outputText( 'Urta grabs Kath from behind, locking her arms so she can’t advance on you.' );
		}
		EngineCore.outputText( '  Never one to look a gift horse in the mouth you start to play with Kath’s nipples ' + CoC.getInstance().scenes.katherine.clothesChoice( 'through her ' + (atBar ? 'blouse' : 'uniform'), 'through the thin fabric of her bodysuit', 'through her top', 'through her silken robe', 'by reaching inside her tube top', 'by reaching inside that sexy nurse’s outfit' ) + '.  Kath\'s ' + (CoC.getInstance().scenes.katherine.breasts.lactating() ? 'teats start leaking cream, her ' : '') + 'knees soon buckle and Urta has to go from holding her back to holding her up.\n\n' );
		EngineCore.outputText( 'Even though you’re only playing with Katherine’s nipples you hear both your girls start to moan.  It seems that Kath’s fine ass is grinding against Urta’s horsecock.  Your fox has probably already started to leak.  When you begin stripping Kath’s clothes off Urta is eager to help and the two of you bare the ' + CoC.getInstance().scenes.katherine.catGirl( 'cat girl', 'feline' ) + ' in record time.\n\n' );
		EngineCore.outputText( 'You put Kath back in the same position as before and Urta ' );
		if( CoC.getInstance().flags[ kFLAGS.KATHERINE_URTA_AFFECTION ] <= 15 ) {
			{ //They’ve had little or no sex together sober
			}
			EngineCore.outputText( 'looks uncomfortable, trying to keep her cock from rubbing against Kath’s ass or pussy.  You give her a smile and place her shaft against Kath’s opening.  Kath lets out a very happy purr and tries to angle her pussy for better access.  Urta gives in, closes her eyes and allows Kath to sink down the length of her shaft' );
		} else if( CoC.getInstance().flags[ kFLAGS.KATHERINE_URTA_AFFECTION ] <= 31 ) {
			{ //They’ve had sex a lot
			}
			EngineCore.outputText( 'allows her cock to slide against Kath’s pussy lips.  With an encouraging nod from you Urta slips it inside and Kath squirms in her arms, trying to pull herself down onto Urta’s massive member' );
		} else {
			{ //They’re lovers
			}
			EngineCore.outputText( 'gives you a big smile as she pulls Kath down onto her shaft, impaling her.  Kath twists around and gives Urta a kiss before looking back to you expectantly.  A giant sized horsecock between her folds just isn’t enough for Kath these days - she wants you both' );
		}
		EngineCore.outputText( '.\n\nSince Kath isn’t going anywhere Urta grabs her ' + CoC.getInstance().scenes.katherine.catGirl( 'smooth', 'fuzzy' ) + ' hips and controls the pace.  Kath starts playing with her own nipples, giving you a show.  In return you tease them both by slowly stripping off your gear.  When you’re completely naked you start to rub Kath’s ears and use them to gently pull her head lower and lower until ' );
		if( CoC.getInstance().player.isTaur() ) {
			EngineCore.outputText( 'her back is horizontal.  You carefully step over her, closing the distance with Urta until you feel your submissive pussy cat ' + (CoC.getInstance().player.hasCock() ? 'swallow the tip of your cock' : 'latch onto your cunt like a remora') + '.  You pull Urta in for a kiss and think to yourself that this is how a centaur was meant to fuck' );
		} else {
			EngineCore.outputText( 'her mouth is lined up with your ' + (CoC.getInstance().player.hasCock() ? 'cock' : 'pussy') + '.  Your submissive pussy cat doesn’t need any instruction to ' + (CoC.getInstance().player.hasCock() ? 'swallow the tip of your cock' : 'slam her tongue into the depths of your pussy') );
		}
		EngineCore.outputText( '.\n\nUrta thrusts and drives Katherine’s ' );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( 'lips down your shaft. ' + (CoC.getInstance().player.longestCock() >= 12 ? ' Despite your length' : '') );
		} else {
			EngineCore.outputText( 'face into your groin. ' );
		}
		EngineCore.outputText( ' Kath takes it without complaint and her rough tongue does wonders for your mood and ' + (CoC.getInstance().player.hasCock() ? 'member' : 'your moist cunt') + '.\n\n' );
		EngineCore.outputText( 'Urta really gets into it - she places your hands on her breasts and starts to fuck Kath as though it’s life or death.  ' + (CoC.getInstance().player.isTaur() ? 'You’re not used to having a lover in front of you anymore and the added stimulation' : 'The rocking motion along with Katherine’s eager tongue') + ' brings your climax more quickly than you thought possible.\n\n' );
		if( !CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( 'Kath laps at your pussy, drinking your juices as fast as you can produce them.  Every time you think your orgasm is over she draws the whole length of her tongue over your clit and gives you another.  She only stops when your legs give out and you collapse' + (CoC.getInstance().player.isTaur() ? ', falling to the side to avoid crushing her' : ' on top of her') );
		} else {
			EngineCore.outputText( 'You pull Urta towards you so that Kath takes your whole length.  ' );
			if( CoC.getInstance().player.cumQ() < 500 ) {
				EngineCore.outputText( 'After a few good squirts you feel like you need a nap to recover.  Kath thanks you by wrapping her skilled tongue halfway around your shaft and licking up every drop' );
			} else if( CoC.getInstance().player.cumQ() < 1500 ) {
				EngineCore.outputText( 'You deliver squirt after squirt of hot cum down Kath’s gullet.  She drinks every drop like a good kitty and you wish you could see the look on her face as she cleans up your cock with that skilled tongue of hers' );
			} else if( CoC.getInstance().player.cumQ() < 3000 ) {
				EngineCore.outputText( 'The firehose of cum you shoot down Kath’s throat would be too much for any normal person to swallow.  Good thing your cockhead is closer to her stomach than to her lips.  You feel backpressure, but Kath’s stomach is no match for your magically enhanced ' + (CoC.getInstance().player.ballSize > 0 ? 'balls' : 'prostate') + '.  When it’s over Kath has to gulp down quite a bit of cum that bubbled back up her throat' );
			} else {
				EngineCore.outputText( 'The torrent of cum that you blast down Kath’s throat is so powerful that you feel panicked scrabbling from beneath you.  It’s too late, the only way it can go is in.  You ' + (CoC.getInstance().player.isTaur() ? 'feel Kath’s ass and back press up against your belly and you realize' : 'watch her belly stretch and stretch until') + ' she’s so full her belly is resting against the floorboards.  When it’s over Kath has to gulp down quite a bit of cum that bubbled back up her throat' );
			}
		}
		EngineCore.outputText( '.\n\nWhen you recover you rub Kath’s thigh appreciatively but your display only drives Urta to fuck her even harder.  Between you Kath’s tail flicks back and forth, so you grab it and start massaging it near the base.  Kath pushes back against Urta and you see Urta’s eyes roll back.  ' );
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( 'A hot spray of cum lands on and around your ' + (CoC.getInstance().player.isTaur() ? 'rear ' : '') + (CoC.getInstance().player.isNaga() ? 'tail' : 'feet') + '.  ' );
		}
		EngineCore.outputText( 'Kath just came and if you had to guess her clenching pussy sent Urta over the edge.\n\n' );
		if( !CoC.getInstance().player.hasCock() || CoC.getInstance().player.cumQ() < 3000 ) {
			EngineCore.outputText( 'Sure enough you ' + (CoC.getInstance().player.isTaur() ? 'feel Kath’s ass and back press against your belly and you realize' : 'watch her belly stretch and stretch until') + ' she’s so full her belly is resting against the floorboards' );
		} else {
			EngineCore.outputText( 'It would be difficult enough for Kath to take Urta’s load but her belly already holds several buckets of your cum.  There’s no escape and you ' + (CoC.getInstance().player.isTaur() ? 'feel' : 'see') + ' her belly expand even further.  Urta pulls back on Kath’s hips hard enough to leave marks, driven by a deep urge to breed Katherine’s velvet pussy.  When her strength fails her Urta falls back and a thick stream of semen erupts from Kath’s cunt' );
		}
		EngineCore.outputText( '.\n\nUrta pants like she’s just run a marathon and Kath' + (CoC.getInstance().player.hasCock() ? ', her mouth still occupied by your shaft,' : '') + ' just moans contentedly.  You’re quite happy yourself and sit down with them for a minute to rest.\n\n' );
		EngineCore.outputText( 'Urta doesn’t say anything but she laces her fingers with yours and rests your entwined hands on top of Kath’s bulging belly.  Kath puts her arms around you both and you soon hear snoring from your exhausted friend.  Urta offers to stay with Kath and clean up the mess so you leave her to it.  You’d love to stay but duty calls.' );
		CoC.getInstance().player.orgasm();
		CoC.getInstance().scenes.katherine.orgasm();
		CoC.getInstance().scenes.katherine.katherineAndUrtaHadSex( false );
		CoC.getInstance().flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ]++;
		CoC.getInstance().flags[ kFLAGS.URTA_TIME_SINCE_LAST_CAME ] = 2 + Utils.rand( 2 );
		CoC.getInstance().scenes.urta.urtaLove( 1 );
		if( CoC.getInstance().flags[ kFLAGS.KATHERINE_UNLOCKED ] !== 3 ) {
			if( CoC.getInstance().time.hours >= 13 ) {
				CoC.getInstance().flags[ kFLAGS.KATHERINE_LOCATION ] = CoC.getInstance().scenes.katherine.KLOC_URTAS_APT; //Katherine.timeChange will sort out whether Kath actually stays with Urta
			}
		}
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	KatherineThreesome.prototype.pinAndFuck = function() { //Kath is sober, Urta is drunk //Not available if Kath has no cock
		EngineCore.clearOutput();
		EngineCore.outputText( 'When you get to Urta’s table she pulls you both in for a hug and takes the opportunity to bury her head between Katherine’s breasts' + (CoC.getInstance().player.hasBreasts() ? ' and then between yours' : '') + '.  Not wanting to fuck your herms at the table you get Urta’s attention by tugging on her ear and motion at one of the vacant backrooms.  The drunken fox herm gets up and wanders toward the door, her arms around you both.  It’s not for support but so that she can grope all your favorite bits.  On Urta’s other side you can see Kath smiling as Urta massages the base of her tail.\n\n' );
		EngineCore.outputText( 'Once the three of you get inside the room together Urta gets aggressive.  She shoves both you and Kath against the wall and starts trying to pull your clothes off.  As she concentrates on ' + CoC.getInstance().scenes.katherine.clothesChoice( 'unbuttoning Kath’s blouse', 'sliding her hands inside Kath’s bodysuit', 'unlacing Kath’s dress', 'pulling the robe off Kath’s shoulders', 'slipping the stretchy tube top over Kath’s head', 'reaching inside the nurse’s top to grope Kath’s breasts' ) + ' you decide that today Urta won’t be setting the pace.\n\n' );
		EngineCore.outputText( 'You sweep her legs out from under her and she falls sideways into your arms.  Twisting her around you push Urta to the floor facedown and ' );
		if( CoC.getInstance().player.isTaur() ) {
			EngineCore.outputText( 'rest your belly on top of' );
		} else {
			EngineCore.outputText( (CoC.getInstance().player.isNaga() ? 'quickly coil your tail over' : 'kneel atop') );
		}
		EngineCore.outputText( ' her prone form.  She growls playfully and squirms, trying to get herself free from your grapple.  You look behind you and see that Kath has been quick to strip off her clothes.  Her throbbing cock' + CoC.getInstance().scenes.katherine.cockMultiple( ' stands', 's stand' ) + ' proud in the cool air.\n\n' );
		EngineCore.outputText( 'You lift Urta’s skirt and tell Kath that her captain needs some help.  She claps her hands together gleefully as you pull aside Urta’s panties.  From beneath you Urta shouts, “<i>No!  It’s my turn.  Present pussy, damn it.</i>”  She shudders as Kath’s cockhead' + CoC.getInstance().scenes.katherine.cockMultiple( ' brushes against her pussy, which is', 's brush against her slit and her tight sphincter.  Kath reaches under Urta, scoops a little pre from the tip of her dripping horsecock and smears it over Urta’s asshole.  Urta’s cunt needs no such attention, it’s' ) + ' already glistening.\n\n' );
		EngineCore.outputText( 'Kath gently turns your head and gives you a kiss before sheathing herself inside her captain.  Urta groans as her body is invaded' + CoC.getInstance().scenes.katherine.cockMultiple( ' by Kath’s ' + CoC.getInstance().scenes.katherine.cockType( 'canine', 'unusual feline' ) + ' member', ', not once but twice' ) + '.  You tweak Katherine’s nipples and tell her that Urta needs a rough ride.  Urta pants and looks up but she doesn’t disagree.  Kath’s fingers wrap around Urta’s waist and she starts to fuck her like a wild stallion.  Some thrusts are hard enough that Urta moves along the floor.\n\n' );
		EngineCore.outputText( 'Before Kath can cum Urta grunts, tenses and a gushing sound tells you she’s just flooded her panties with a massive load of cum.  It seems you were right about prescribing a good dose of hard fucking, Urta must have needed that.  After her orgasm she’s unable to move, let alone escape, so you get up and encourage Kath, telling her to fill this fox slut' );
		if( CoC.getInstance().scenes.urta.pregnancy.isPregnant && CoC.getInstance().scenes.urta.pregnancy.type !== PregnancyStore.PREGNANCY_BEE_EGGS && CoC.getInstance().scenes.urta.pregnancy.type !== PregnancyStore.PREGNANCY_DRIDER_EGGS ) {
			EngineCore.outputText( '.  She’s already carrying a baby in that big belly of hers, so Kath must know how much Urta loves cum.  Urta pats her belly and says, “<i>Maybe there’s room for one more' );
		} else {
			EngineCore.outputText( ' - she needs a womb full of seed.  Urta laughs and says “<i>' + (CoC.getInstance().flags[ kFLAGS.URTA_FERTILE ] > 0 ? 'Yeah, fill me up, maybe you’ll get to be a daddy' : 'Oh please fill me up.  It’s so good') );
		}
		EngineCore.outputText( '.</i>”  Katherine doesn’t take long to give Urta what she wants.  Kath’s knot' + CoC.getInstance().scenes.katherine.cockMultiple( ' swells up and with one last hard thrust she forces it inside Urta’s abused pussy', 's swell up and with one last hard thrust she forces them inside Urta’s stretched holes' ) + '.\n\n' );
		EngineCore.outputText( 'It looks so fucking good as Urta’s belly grows ' + (CoC.getInstance().scenes.urta.pregnancy.isPregnant ? 'even larger than before, her pregnancy eclipsed by' : 'larger and larger, trying to hold back' ) + ' the ocean of cum inside her.  Urta’s whole lower body and her skirt are soaked with her own cum and now an equally large load is sloshing around inside her.  Her ' + (CoC.getInstance().scenes.katherine.hasBalls() ? 'balls drained' : 'prostate empty') + ', Kath collapses on top of Urta and gives her a hug.\n\n' );
		EngineCore.outputText( 'You stroke your fingers up and down ' );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( 'your cock' );
		} else if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'your slit' );
		} else {
			EngineCore.outputText( 'the barren flesh between your legs' );
		}
		EngineCore.outputText( ', looking over your partners.  The sight of Katherine drilling Urta has you ever so horny' + (CoC.getInstance().player.hasCock() && CoC.getInstance().player.hasVagina() ? ', you just have to figure out what you’re going to do about it.  Both your lovers are spent and happy, so it’s a toss up as to which one should receive your attention.' : ' and it’s time for you to take your fill.') );
		CoC.getInstance().scenes.katherine.katherineAndUrtaHadSex( true );
		CoC.getInstance().scenes.katherine.orgasm();
		CoC.getInstance().scenes.urta.urtaLove( 1 );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.choices( 'Stuff Kath', this.pinAndFuckStuffKath, 'Mount Urta', this.pinAndFuckMountUrta, '', null, '', null, '', null );
		} else {
			EngineCore.doNext( this.pinAndFuckMountUrta );
		}
	};
	KatherineThreesome.prototype.pinAndFuckMountUrta = function() { //Plays for anyone without a cock and for herms who select this option
		EngineCore.clearOutput();
		EngineCore.outputText( 'You roll Kath and Urta over so you can get access to Urta’s equine cock.  It’s a little soft but a couple of strokes along its cum slicked length start to change that.  Urta opens her eyes and tries to focus on you but you’re already ' + (CoC.getInstance().player.hasVagina() ? 'sliding your pussy against her shaft' : 'rubbing her horsecock against your anus') + '.  Underneath you both Kath lets out a happy “<i>Oh!</i>”  You’re guessing Urta’s muscles are clamping down on Kath’s cock' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + '.\n\n' );
		EngineCore.outputText( 'As you sink onto Urta’s cock ' );
		if( !CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'you enjoy the sensation of your colon stretching and straightening to take Urta’s enormous girth and length.  You feel a pulse of hot pre soaking into your deepest depths.' );
		} else {
			EngineCore.outputText( 'and it grinds against your cervix you ' );
			if( CoC.getInstance().player.isPregnant() ) {
				if( CoC.getInstance().player.pregnancyType === PregnancyStore.PREGNANCY_GOO_STUFFED ) {
					EngineCore.outputText( 'stroke your goo stuffed belly and hope your passenger enjoys the ride.' );
				} else if( CoC.getInstance().player.pregnancyType === PregnancyStore.PREGNANCY_URTA ) {
					EngineCore.outputText( 'put a hand on your belly and think about the child she’s already planted in your belly.' );
				} else if( CoC.getInstance().flags[ kFLAGS.URTA_FERTILE ] > 0 ) {
					EngineCore.outputText( 'think about the baby inside your belly.  When it’s born you really need to do this again so Urta can knock you up.' );
				} else {
					EngineCore.outputText( 'think about the baby inside your belly and wish there was some way she could have fathered it.' );
				}
			} else if( CoC.getInstance().player.findStatusAffect( StatusAffects.Contraceptives ) >= 0 ) {
				EngineCore.outputText( 'think about your empty womb.  Wouldn’t it feel good if Urta’s cum could impregnate you as nature intended?' );
			} else if( CoC.getInstance().flags[ kFLAGS.URTA_FERTILE ] > 0 ) {
				EngineCore.outputText( 'start to fantasize.  The masses of cum Urta produces stand a good chance of seeding you.' );
			} else {
				EngineCore.outputText( 'lose yourself in the sensation.  You hope her big dick can fill every crevice of your pussy.' );
			}
			EngineCore.outputText( '  You pause and feel just above your pussy where Urta’s girth stretches your flesh into a bulge.' );
		}
		EngineCore.outputText( '  Urta starts to moan; now that her oversensitive dick is buried in your ' + (CoC.getInstance().player.hasVagina() ? 'pussy' : 'rectum') + ' she’s really getting into it.  You flex the muscles of your ' + (CoC.getInstance().player.hasVagina() ? 'vagina' : 'ass') + ' to please her more.  Kath helps out by reaching around Urta and playing with her nipples while you massage her balls and tell her you want to be filled.\n\n' );
		EngineCore.outputText( 'Urta’s legs lock around you and she tries to force her horsecock even deeper.  You feel a bulge moving along the underside and when the hot cum erupts inside you' );
		if( !CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( ', filling your colon like a balloon,' );
		} else if( CoC.getInstance().player.pregnancyType === PregnancyStore.PREGNANCY_GOO_STUFFED ) {
			EngineCore.outputText( 'it forces its way inside your womb.  You hope the goo in you enjoys the bath.  As more of Urta’s seed fills your pussy' );
		} else if( CoC.getInstance().player.isPregnant() ) {
			EngineCore.outputText( ', spattering against your cervix,' );
		} else {
			EngineCore.outputText( 'it forces its way inside your womb.  The feeling is exquisite as your belly expands outward into a pregnant looking dome.  As more of Urta’s seed fills your pussy' );
		}
		EngineCore.outputText( ' you kiss her and give in to your long overdue orgasm.' );
		EngineCore.outputText( '\n\nUrta puts one hand on your stretched stomach and places your hand on her own bloated belly.  She just smiles contentedly, her cock buried in your pussy and Katherine’s dick' + CoC.getInstance().scenes.katherine.cockMultiple( ' knotted inside her pussy', 's knotted inside her pussy and ass' ) + '.  She doesn’t seem to have a care in the world.  Then Kath rocks her hips.  Urta looks over her shoulder and you both see that Kath has a determined look in her eyes.\n\n' );
		EngineCore.outputText( '“<i>Again?</i>” says Urta, “<i>No, no, I can’t do it again!  I’ve already cum twice.</i>”\n\n' );
		EngineCore.outputText( 'Kath laughs and continues to gently fuck Urta.  You pull off Urta’s cock and wait for her massive load to finish gushing from your ' + (CoC.getInstance().player.hasVagina() ? 'pussy' : 'ass') + ' before putting on your clothes.  Before you leave you give Urta a kiss and squeeze her belly a little.  Her only reply is to moan.  You tell Kath to take good care of Urta and then leave.  You know that if you stay much longer their display will get you excited enough that you’d stay around all afternoon and unfortunately you’ve got things you need to do.\n\n' );
		CoC.getInstance().player.orgasm();
		CoC.getInstance().flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ]++;
		CoC.getInstance().flags[ kFLAGS.URTA_TIME_SINCE_LAST_CAME ] = 8 + Utils.rand( 2 );
		if( CoC.getInstance().time.hours >= 13 ) {
			CoC.getInstance().flags[ kFLAGS.KATHERINE_LOCATION ] = CoC.getInstance().scenes.katherine.KLOC_URTAS_APT; //Katherine.timeChange will sort out whether Kath actually stays with Urta
		}
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	KatherineThreesome.prototype.pinAndFuckStuffKath = function() { //Plays for any males and for herms who select this option
		EngineCore.clearOutput();
		EngineCore.outputText( 'When Kath flopped on top of Urta her legs spread apart and gave you a great view of ' + (CoC.getInstance().player.cocks.length > 1 ? 'three' : 'two') + ' things.  Her' + CoC.getInstance().scenes.katherine.cockMultiple( '', ' lower' ) + ' knot, hot and hard, buried in Urta’s pussy' + CoC.getInstance().scenes.katherine.cockMultiple( ' and her dripping slit', ', her dripping slit and her supple sphincter, both' ) + ' waiting for your cock.  ' + (CoC.getInstance().player.cocks.length > 1 ? 'They look' : 'It looks') + ' so wet, so empty.  Neither Katherine nor Urta notice as you ' + (CoC.getInstance().player.isNaga() ? 'slither' : 'step') + ' around them, position yourself behind Kath, line up your dick' + (CoC.getInstance().player.cocks.length > 1 ? 's and feed them' : ' and feed it') + ' into Kath\'s body.\n\n' );
		EngineCore.outputText( 'Kath may be tired but she’s still in the mood.  She clenches her pussy ' + (CoC.getInstance().player.cocks.length > 1 ? 'and ass around your cocks' : 'around your cock') + ' and lets out a low moan.  You ' );
		if( CoC.getInstance().player.cor < 25 ) {
			EngineCore.outputText( 'hold your cock' + (CoC.getInstance().player.cocks.length > 1 ? 's' : '') + ' still for a moment, letting Kath adjust her hips so she’s in a more comfortable position.  You massage the base of her tail which draws even more moans of pleasure from Kath.  When you finally start to thrust again Kath weakly tries to push her hips back toward you and her pussy ' + (CoC.getInstance().player.cocks.length > 1 ? 'and ass do their' : 'does its') + ' best to pull you in deeper.' );
		} else if( CoC.getInstance().player.cor < 75 ) {
			EngineCore.outputText( 'start to fuck her slowly and gently but quickly build to thrusting hard and fast as your base instincts take over.  It doesn’t seem to matter to Kath, she moans and purrs happily as long as your cock' + (CoC.getInstance().player.cocks.length > 1 ? 's are filling her holes.' : ' is filling her pussy.') );
		} else {
			EngineCore.outputText( 'just start pounding in and out.  Kath tends to like it rough and right now you don’t really care if she enjoys it or not.' );
		}
		EngineCore.outputText( '\n\nUnderneath both of you Urta tries to look over her shoulder to see why Kath’s cock' + CoC.getInstance().scenes.katherine.cockMultiple( ' is', 's are' ) + ' rocking back and forth inside her overstuffed belly.  Kath gives her a kiss and says “<i>You like feeling ' + CoC.getInstance().player.short + ' through me?</i>”  Urta’s eyes roll back as she realizes she’s trapped and in for a fucking by proxy.\n\n' );
		EngineCore.outputText( 'Having just watched your girlfriends fuck it’s no surprise that you don’t last very long.  Your ' + (CoC.getInstance().player.balls > 0 ? 'balls ache to add their' : 'prostate aches to add its') + ' contribution to Katherine’s hot pussy' + (CoC.getInstance().player.cocks.length > 1 ? ' and inviting ass' : '') + '.  You grab Kath’s waist and bury yourself inside as that now familiar feeling races from your ' + (CoC.getInstance().player.balls > 0 ? 'balls, through your' : '') + ' prostate and runs along your cock.\n\n' );
		EngineCore.outputText( 'Your cock' + (CoC.getInstance().player.cocks.length > 1 ? 's erupt inside Kath' : ' erupts inside Kath') );
		if( CoC.getInstance().player.cumQ() < 500 ) {
			EngineCore.outputText( ', your load soaking into her ' + (CoC.getInstance().player.cocks.length > 1 ? 'pussy and ass' : 'waiting pussy') + '.  Katherine just purrs and rolls slightly so she can kiss you.' );
		} else if( CoC.getInstance().player.cumQ() < 1500 ) {
			EngineCore.outputText( 'and you feel ' + (CoC.getInstance().player.cocks.length > 1 ? 'little lakes of cum forming around the tips of your cocks' : 'a little lake of cum forming around the tip of your cock') + '.  Her belly swells just a bit and Kath puts her hand on it, a smile on her lips.' );
		} else if( CoC.getInstance().player.cumQ() < 3000 ) {
			EngineCore.outputText( 'and her body is pushed away from Urta by the sheer volume of cum you’re filling her with.  Kath gasps and uses one hand to steady herself while the other clutches her expanding belly.  ' );
			if( CoC.getInstance().scenes.katherine.pregSize() > 0 ) {
				EngineCore.outputText( 'It must be particularly painful since her womb is closed for business.' );
			} else {
				EngineCore.outputText( 'She starts to look a little pregnant as her womb ' + (CoC.getInstance().player.cocks.length > 1 ? ' and colon' : '') + ' fill with your seed.' );
			}
		} else {
			EngineCore.outputText( 'with such force that she has the wind is knocked out of her. ' );
			if( CoC.getInstance().scenes.katherine.pregSize() === 0 ) {
				EngineCore.outputText( 'Even from behind her you can see her womb expanding, filling out as if she were eight months pregnant.' );
			}
			if( CoC.getInstance().scenes.katherine.pregSize() > 0 ) {
				EngineCore.outputText( 'Without an empty womb to take the load from ' );
				if( CoC.getInstance().player.cocks.length > 1 ) {
					EngineCore.outputText( 'your lower shaft Kath’s vagina quickly reaches its limit and you feel all your cum running down your other cock' + (CoC.getInstance().player.cocks.length > 2 ? 's, blasting all over the room.' : ' stuffing her colon with cum.') );
				} else {
					EngineCore.outputText( 'your supercharged ' + (CoC.getInstance().player.balls > 0 ? 'balls' : 'prostate') + ' you quickly fill her cunt to its limit, the rest of your seed blasting back against your groin.' );
				}
			}
			EngineCore.outputText( '  The bulge in Kath’s belly is large enough to lift her off Urta, though not enough to release Katherine’s knot' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + '.  Now that Kath is almost sitting upright above Urta she turns and kisses you.' );
		}
		EngineCore.outputText( '\n\nAt the bottom of the pile you hear Urta say “<i>Oh - ' + CoC.getInstance().scenes.katherine.cockMultiple( 'its', 'they’re' ) + ' getting bigger again!</i>”\n\n' );
		EngineCore.outputText( 'A quick check with your fingers tells you she’s right, Kath’s knot' + CoC.getInstance().scenes.katherine.cockMultiple( ' has', 's have' ) + ' returned to full strength, binding the two herms together.\n\n' );
		EngineCore.outputText( 'You pull out of Kath and give her a pat on the back.  You tell Urta that there are two ways to shrink ' + CoC.getInstance().scenes.katherine.cockMultiple( 'that knot', 'those knots' ) + ' and it’s up to them to decide which to use.  Kath looks tired, but her tail wags back and forth.  Urta just groans and says, “<i>I can’t, I’m so full.</i>”\n\n' );
		EngineCore.outputText( 'You lock the door on the way out, ' + (CoC.getInstance().flags[ kFLAGS.KATHERINE_URTA_AFFECTION ] >= 31 ? 'knowing that with those two the sex option will eventually win out.' : 'hoping your sated girlfriends will bond over this.') );
		CoC.getInstance().flags[ kFLAGS.URTA_TIME_SINCE_LAST_CAME ] = 2 + Utils.rand( 2 );
		if( CoC.getInstance().time.hours >= 13 ) {
			CoC.getInstance().flags[ kFLAGS.KATHERINE_LOCATION ] = CoC.getInstance().scenes.katherine.KLOC_URTAS_APT; //Katherine.timeChange will sort out whether Kath actually stays with Urta
		}
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	KatherineThreesome.prototype.watch = function( urtaIsDrunk ) { //Kath is sober (or drunk), Urta is drunk
		EngineCore.clearOutput();
		EngineCore.outputText( 'By the time you reach Urta’s table she’s downed the last of her beverage.  She stands up and gives both of you big hugs.  You feel her horsecock grind against you and you see Kath looking self-conscious after her hug from Urta.\n\n' );
		this.watchMainBody( urtaIsDrunk );
	};
	KatherineThreesome.prototype.watchNoIntro = function( urtaIsDrunk ) { //Kath is sober (or drunk), Urta is drunk
		EngineCore.clearOutput();
		this.watchMainBody( urtaIsDrunk );
	};
	KatherineThreesome.prototype.watchMainBody = function( urtaIsDrunk ) { //Kath is sober, Urta is drunk
		EngineCore.outputText( 'The three of you quickly commandeer one of the back rooms.  Urta is ' + (urtaIsDrunk ? 'a little unsteady' : 'pretty horny') + ' so she sits down on a spare chair in the corner and yanks off her clothes.  You kiss Kath and concentrate on getting her naked, giving Urta a show as you ' + CoC.getInstance().scenes.katherine.clothesChoice( 'first remove her blouse and then slip off her skirt', 'peel the sheer bodysuit off her lithe form', 'unlace her dress and slide it off her sexy body', 'undo her robe and pull it from her shoulders', 'pull the tube top over her head and then ' + CoC.getInstance().scenes.katherine.clothesLowerChoice( 'peel off her tight shorts', 'slip off her skirt', '', '', '' ), 'unbutton her tight blouse, slip off her skirt and finally pluck the cute white hat from her head' ) + '.  Urta’s interest is obvious from her panting and the throbbing of her horsecock.\n\n' );
		EngineCore.outputText( 'Kath poses for Urta and asks, “<i>Like what you see?</i>”\n\n' );
		EngineCore.outputText( 'Urta strokes her cock, smearing some pre along the shaft and says, “<i>Come over and find out!</i>”  It looks like Urta’s in the mood to put on a show so you give Kath a gentle push toward the fox.  As soon as she comes within arm’s reach Urta grabs her and pulls Katherine into her lap.\n\n' );
		EngineCore.outputText( 'After a short and one sided grappling match Urta has Kath’s arms locked behind her body.  She turns Kath to face you, then pulls the cat ' + CoC.getInstance().scenes.katherine.catGirl( 'girl', 'morph' ) + ' backwards, downwards and onto her lap.  Urta’s cock now juts out from between Kath’s legs, rubbing against ' );
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( 'the underside of Kath’s own ' + CoC.getInstance().scenes.katherine.cockMultiple( '', 'lower ' ) + 'cock.\n\n' );
		} else {
			EngineCore.outputText( 'Kath\'s dripping slit.\n\n' );
		}
		EngineCore.outputText( 'Kath’s a little surprised, but she recovers quickly and calls out to you, “<i>Please save me ' + CoC.getInstance().player.mf( 'mister', 'miss' ) + ', this crazy fox is trying to have her way with me.</i>”  You decide to ‘help’ by giving Kath’s nipples a little tweak.  You laugh and sit down on another chair, thinking that this looks like it’s going to be fun.\n\n' );
		EngineCore.outputText( 'Urta moans and lifts Kath high enough to plant her cockhead against Kath’s pussy.  “<i>You were asking for this all through our last shift,</i>” she growls in Kath’s ear.  Urta roughly yanks Kath back again, this time impaling her on Urta’s massive shaft.  Urta closes her eyes and starts talking to herself as she lifts Kath’s hips up and down.  “<i>Always flicking your thin black tail at me,</i>” she says, “<i>giving me that big toothy smile when you hand in your paperwork' + (CoC.getInstance().flags[ kFLAGS.KATHERINE_URTA_AFFECTION ] > 20 ? ', then ‘I’ll see you at the bar’, and that cute little wave goodbye' : '') + '.  Admit it - you’ve been gagging for a nice fat cock.</i>”\n\n' );
		EngineCore.outputText( 'Kath just bites her lip as Urta’s jackhammering forces her hole open wider and wider.  At last the pain in her face eases up and she gives you a grin before saying, “<i>Maybe.</i>”\n\n' );
		EngineCore.outputText( '“<i>Not maybe!</i>” bellows Urta.  “<i>You’re the sexiest little kitty in the Watch and you spend all day teasing me.  Don’t give me maybe.</i>”\n\n' );
		EngineCore.outputText( 'Kath has started to fuck back and she pulls Urta’s hands away from her hips.  With her cat-like flexibility she manages to turn around and face Urta while still grinding atop her cock.  “<i>Okay,</i>” she says, teasingly, “<i>maybe a lot.</i>”  She takes Urta’s hands and places them against ' + (CoC.getInstance().scenes.katherine.breasts.cupSize > AppearanceDefs.BREAST_CUP_DD ? 'the sides of ' : '') + 'her ' + CoC.getInstance().scenes.katherine.breasts.adj() + ' breasts.\n\n' );
		EngineCore.outputText( 'Urta looks like she’s getting close to blowing her load.  She pants “<i>Does that turn you on?  Getting your captain all hot and bothered?</i>”\n\n' );
		EngineCore.outputText( 'Kath reaches between her legs and you realize she’s rolling Urta’s balls between her fingers.  “<i>Maybe,</i>” she replies again, infuriating Urta, who bites the back of Kath’s neck.  A few more deep thrusts and Urta’s hands go to Kath’s shoulders so she can pull Kath’s whole body down once more.  Her head tips back and bangs the wall.  At the same time Kath puts a hand against her belly and purrs as you watch it bulge with Urta’s copious seed.\n\n' );
		EngineCore.outputText( 'Once Urta is finished Kath gives Urta a poke and says, “<i>Aren’t you going to help me?  I still haven’t got off, you know.</i>”\n\n' );
		EngineCore.outputText( 'Urta raises her head just long enough to grin at Kath and say, “<i>Maybe,</i>” in a mocking tone.\n\n' );
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( 'Kath looks your way and rubs one of her hard cocks but you point out that Urta just offered to help.  Katherine needs no further encouragement.  She stands up, depositing a river of cum on Urta’s lap.  Urta is too tired to resist much, so Katherine picks her up and drapes her over the chair.\n\n' );
			EngineCore.outputText( 'Urta looks up at you just in time to feel Kath slip her ' + CoC.getInstance().scenes.katherine.cockType() + ' shaft' + CoC.getInstance().scenes.katherine.cockMultiple( ' into her pussy', 's into her cunt and rectum' ) + '.\n\n' );
		} else {
			EngineCore.outputText( 'Kath looks your way and runs one of her fingers over her breasts but you point out that Urta just offered to help.  Katherine needs no further encouragement.  She plants her feet and starts to roll her hips, grinding her clit against Urta\'s still hard horsecock.\n\n' );
			EngineCore.outputText( 'Urta\'s head rolls forward again and she rubs Katherine\'s bloated belly.  “<i>Wasting your time kitty,</i>” she says mockingly.\n\n' );
		}
		EngineCore.outputText( 'Kath is already close to cumming but she tries to hold back by taking it slow.  She whispers, “<i>You want it too.  I know cause every time I give you a smile or wiggle my bum you smile back' );
		if( CoC.getInstance().flags[ kFLAGS.KATHERINE_URTA_AFFECTION ] > 20 ) {
			EngineCore.outputText( ' and the tip of your tail does that little wiggle you don’t think anyone notices.  And you rush through all your paperwork once you know I’ll be at the bar because you love staring at my body' + (CoC.getInstance().flags[ kFLAGS.KATHERINE_URTA_DATE ] === CoC.getInstance().scenes.katherine.KDATE_LITTLE ? ' and you’re hoping like crazy ' + CoC.getInstance().player.short + ' will be here so we can fuck all through the night' : '') );
		}
		EngineCore.outputText( '.</i>”\n\nUrta gives you a smirk and says, “<i>Maybe,</i>” once more.  Kath doesn’t like getting a dose of her own medicine, so she grabs ' );
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( 'the chair and pushes hard.  Urta lets out a surprised “<i>Ah!</i>” as Kath’s ' + CoC.getInstance().scenes.katherine.cockMultiple( 'knot forces its', 'twin knots force their' ) + ' way inside.  Then Kath pushes on the chair, yanking ' + CoC.getInstance().scenes.katherine.cockMultiple( 'it', 'them' ) + ' back out.  It doesn’t take long for the knot-fucking to drive Kath over the edge and she slams home one more time.  Urta’s body lifts off the chair as her belly stretches from the heavy load Kath’s pumping into her ' + (CoC.getInstance().scenes.urta.pregnancy.isPregnant ? 'pussy' : 'uterus') + CoC.getInstance().scenes.katherine.cockMultiple( '', 'and colon' ) + '.\n\n' );
		} else {
			EngineCore.outputText( 'Urta\'s balls and strokes them gently with her sharp ' + CoC.getInstance().scenes.katherine.catGirl( 'nails', 'claws' ) + '.  “<i>You don\'t understand, foxy - I\'m not done, so you\'re not done.  It\'s impolite to leave a girl wanting.  So you think about all those times I\'ve wiggled my ass at you or \'accidentally\' let my towel slip.  You\'ve got me here and now, so no excuses, no whiskey dick.  I came here to get fucked.</i>”\n\n' );
			EngineCore.outputText( 'Urta moans, but you can tell Kath\'s words and her clenching pussy have worked their magic.  Urta reaches up with shakey hands and gropes Kath\'s breasts, pulling the stuffed kitty against her.\n\n' );
			EngineCore.outputText( '“<i>That\'s more like it!</i>” cries Kath.  “<i>Now make me pay for being a little tease!</i>”\n\n' );
			EngineCore.outputText( 'Urta shudders and her hands move back to Kath\'s hips.  “<i>Oh, fuck!  You\'re not gonna be able to walk after this.</i>”\n\n' );
			EngineCore.outputText( '“<i>Promises, promises,</i>” Kath says in a dreamy voice.  She holds her already filled belly and lets Urta do most of the work.  Then Katherine\'s legs give out, leaving her totally at Urta\'s mercy as the fox jackhammers her cunt.  You watch Kath cum half a dozen times in a row, her body held in place only by the rock-hard flagpole inside her belly.  With one last burst of energy Urta rams home and you see her balls shrink and pull upward, driving every last drop into Kath\'s cum crammed belly.\n\n' );
		}
		EngineCore.outputText( 'You ' + (CoC.getInstance().player.gender === AppearanceDefs.GENDER_NONE ? 'rub your featureless groin unhappily, wishing you could have been part of this.  Then you' : '') + 'give each of your tired lovers a kiss and tell them to look after each other.  That earns a guilty look from Urta who says, “<i>We can have any kind of sex you want next time ' + CoC.getInstance().player.short + ' - or maybe you want to stick around and have your fill?</i>”\n\n' );
		EngineCore.outputText( 'Much as you’d like to you have to check on the portal once more, so you just tell them you’re going to take them up on that offer, probably sooner rather than later.' );
		CoC.getInstance().scenes.katherine.orgasm();
		CoC.getInstance().scenes.katherine.katherineAndUrtaHadSex( true );
		CoC.getInstance().flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ]++;
		CoC.getInstance().flags[ kFLAGS.URTA_TIME_SINCE_LAST_CAME ] = 2 + Utils.rand( 2 );
		EngineCore.dynStats( 'lus', 20 + CoC.getInstance().player.lib / 20 );
		if( CoC.getInstance().time.hours >= 13 ) {
			CoC.getInstance().flags[ kFLAGS.KATHERINE_LOCATION ] = CoC.getInstance().scenes.katherine.KLOC_URTAS_APT; //Katherine.timeChange will sort out whether Kath actually stays with Urta
		}
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	KatherineThreesome.prototype.kathLicksOutUrta = function() { //Kath is drunk, Urta is sober
		EngineCore.clearOutput();
		EngineCore.outputText( 'Kath begins to twitch and pant as Urta plays with her ears, which leads her to start stroking Urta\'s tail.  Pretty soon a deep \'thunk\' from beneath the table lets you know how much Urta appreciates the attention.  There\'s no need to get involved, so you smile at Urta and lean back.  You can have fun with either of them later and right now you\'re content to watch and see what develops as the ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'herms' : 'girls') + ' get more and more aroused.\n\n' );
		EngineCore.outputText( 'The show gets underway when Urta lets go long enough to shift in her seat.  Apparently her cock was getting stiff enough to make her position uncomfortable.  Kath blinks out of her slightly dazed state and gives you an evil grin.  Before Urta can notice or react Kath ducks under the table and Urta\'s eyes go wide.  Her hands snap to her chair, holding her steady as you hear sounds of wet fabric sliding from below.\n\n' );
		EngineCore.outputText( '"<i>Oh - oh yeah - that\'s a good kitty, you want to take care of my cock?</i>" moans Urta, throwing her head back.\n\n' );
		EngineCore.outputText( 'From under the table you hear Kath\'s reply, "<i>Mmmmm, nope!</i>" and then a snicker.  A thin black tail whips back and forth in front of you, brushing against your waist.  Urta wraps her fingers more tightly around the edge of her chair and bites her lip.  Whatever Kath\'s doing it\'s certainly making Urta feel good.\n\n' );
		EngineCore.outputText( 'You lean down to see for yourself.  Kath is ignoring Urta\'s cock completely.  She\'s pulled Urta\'s panties down and her face is buried in Urta\'s snatch.  Urta\'s horsecock is still covered and is straining against the underside of the table.  You sit back up and meet Urta\'s eyes, now filled with lust, and ask her innocently where all her cum will go when she climaxes.\n\n' );
		EngineCore.outputText( 'Urta shakes her head and tries to clear the lusty haze long enough to do something about it.  She fumbles with a condom, but drops the packet on the ground as Katherine does something naughty.  In an embarrassed whisper Urta tells her, "<i>Just... just put a condom on me.  Please Kath.  I\'ll spray everywhere.</i>"\n\n' );
		EngineCore.outputText( 'The only reply from beneath the table is a long, low, "<i>Mmmmmmmm</i>".  Urta\'s jaw snaps shut and her eyes cross.  She gives up all thoughts of stopping Kath and instead her hands move to her lap, quite obviously pulling the sexy kitten\'s head against her groin.\n\n' );
		EngineCore.outputText( 'Urta lasts longer than you expected, but she can\'t resist Kath\'s silver tongue forever.  She gasps and you hear a wet splattering noise from the table.  It goes on and on as Urta\'s balls release her pent up load.  Most of the bar is looking her way but Urta doesn\'t notice.  She convulses again and again as Kath\'s tongue tries to reach even deeper.  At last it ends and, to the sound of her sperm dripping onto the floor, Urta mumbles, "<i>lovely.</i>"\n\n' );
		EngineCore.outputText( 'Kath snakes back up from under the table, her whole head wet with spunk.  She works quickly to clean herself up using her tongue and some napkins, then looks at Urta.  "<i>Awww, I think I broke her,</i>" she giggles drunkenly.  Say, ' + CoC.getInstance().scenes.katherine.playerText() + ', you wanna have some fun while one-shot here recovers?\n\n' );
		EngineCore.outputText( '"<i>No fair,</i>" Urta mutters weakly.\n\n' );
		EngineCore.dynStats( 'lus', 20 + CoC.getInstance().player.lib / 20 );
		CoC.getInstance().scenes.katherine.katherineAndUrtaHadSex( true );
		CoC.getInstance().flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ]++;
		CoC.getInstance().flags[ kFLAGS.URTA_TIME_SINCE_LAST_CAME ] = 2 + Utils.rand( 2 );
		CoC.getInstance().scenes.urta.drainedByKath = true;
		EngineCore.doNext( CoC.getInstance().scenes.katherine.katherineSex );
	};
	KatherineThreesome.prototype.knothole = function() { //Kath is drunk, Urta is sober //Not available if Kath has no cock
		EngineCore.clearOutput();
		EngineCore.outputText( 'Urta scratches behind Kath’s ear and suggests slipping into one of the back rooms.  As soon as you get her inside Kath strips off her clothes and tackles Urta.  Urta is unprepared, but her combat experience is more than enough to deal with Kath when she’s drunk.  Urta laughs and easily gains control of the horny ' + CoC.getInstance().scenes.katherine.catGirl( 'cat girl', 'feline' ) + '.  Katherine starts to struggle, so Urta sweeps her legs out from under her, presses Kath to the floor and asks if she’s going to be good.\n\n' );
		EngineCore.outputText( 'Kath mutters, “<i>Yes,</i>” but keeps trying to get loose.\n\n' );
		EngineCore.outputText( 'Urta just sighs and looks up at you with an expression that asks ‘will she ever learn?’  She twists Kath’s arms behind her back, but that doesn’t stop her struggling either.  Then Urta snickers to herself.  She hauls Kath along the floor toward a large knothole.  “<i>Gonna cooperate?</i>” she asks the struggling cat ' + CoC.getInstance().scenes.katherine.catGirl( 'girl', 'morph' ) + '.\n\n' );
		EngineCore.outputText( '“<i>No!  Gonna fuck you,</i>” says Kath.\n\n' );
		EngineCore.outputText( 'Urta slides her a little further forward, gets one hand free and uses it to angle Katherine’s ' + CoC.getInstance().scenes.katherine.cockMultiple( '', 'lower ' ) + 'cock into the hole.  Kath is so surprised at suddenly having an opening around ' + CoC.getInstance().scenes.katherine.cockMultiple( 'her prick', 'one of her pricks' ) + ' that she stops struggling for a second.  Urta uses the opportunity to spread Kath’s legs and sink the rest of her length into the hole.\n\n' );
		EngineCore.outputText( '“<i>Not fair,</i>” mumbles Kath, trying and failing to get up.\n\n' );
		EngineCore.outputText( '“<i>You should start behaving,</i>” says Urta.  She sits on top of Kath’s ass, causing her tail to brush against Kath’s.  Kath squirms, but you can see between her legs and that knot is starting to swell.\n\n' );
		EngineCore.outputText( 'Kath’s eyes go wide.  “<i>You wouldn’t!</i>”\n\n' );
		EngineCore.outputText( '“<i>Wouldn’t what?</i>” asks Urta in her most innocent tone.\n\n' );
		EngineCore.outputText( '“<i>Please don’t let me knot!</i>” says Kath, trying to buck hard enough to throw the fox off of her.\n\n' );
		EngineCore.outputText( 'Urta reaches down and rubs ' + (CoC.getInstance().scenes.katherine.hasBalls() ? 'Kath’s balls' : 'the base of Kath’s cock') + '.  “<i>I think it’s a bit late to ask me that,</i>” Urta replies.  Kath groans and thumps her fist against the ground.  With the cat ' + CoC.getInstance().scenes.katherine.catGirl( 'girl', 'morph' ) + ' trapped Urta stands up and takes your hand.  She leads you to the corner opposite the door, where Kath can watch the two of you.\n\n' );
		EngineCore.outputText( 'Urta grins evilly at the captive kitty and then starts to undress herself and you slowly and seductively.  As her fingers slide down your naked back she whispers, “<i>How about we share? There’s enough pussy for both of us.</i>”\n\n' );
		EngineCore.outputText( 'She swings around, her heavy horsecock free to bob side to side in the open air.  She walks behind Kath and inserts a few fingers into Kath’s pussy.  Kath sighs and her tail flicks from side to side.  After a moment Urta pulls her fingers free and licks them.  “<i>Mmmm, you sure taste ready.  So do you want to cum today?</i>”\n\n' );
		EngineCore.outputText( '“<i>Yes.  Yes, please,</i>” begs Kath, spreading her legs wider than anyone but a cat ' + CoC.getInstance().scenes.katherine.catGirl( 'girl', 'morph' ) + ' could manage.  Urta strokes her horsecock a few times, building up a heavy coating of precum, then presses it against Kath’s dripping cunt.  She pushes it in slowly, only an inch at a time, driving Kath wild.\n\n' );
		EngineCore.outputText( 'You can see the lust developing in Urta’s eyes.  The feeling of Kath’s tight passage is going to make her cum sooner rather than later, so you decide it’s time you got involved.  All you have to do is ' );
		if( CoC.getInstance().player.isTaur() ) {
			EngineCore.outputText( 'stand over' );
		} else {
			EngineCore.outputText( CoC.getInstance().player.isNaga() ? 'slither in front of' : 'kneel in front of' );
		}
		EngineCore.outputText( ' Kath and present ' );
		if( CoC.getInstance().player.cocks.length > 0 ) {
			EngineCore.outputText( (CoC.getInstance().player.cocks.length > 1 ? 'one of your cocks' : 'your cock') + '.  Kath sucks on the tip eagerly,' );
		} else {
			EngineCore.outputText( 'your pussy. Kath presses her face to your crotch,' );
		}
		EngineCore.outputText( ' her rough tongue caressing you.\n\n' );
		EngineCore.outputText( 'You start to scratch Kath’s sensitive ears and she goes wild.  She grabs your hips and pulls herself closer, ' + (CoC.getInstance().player.cocks.length > 0 ? 'her teeth locked around the base of your cock' : 'like her tongue is trying to reach your cervix') + '.\n\n' );
		EngineCore.outputText( 'Urta is panting hard and she’s speeding up her strokes.  Every time she buries herself inside Katherine’s pussy ' + (CoC.getInstance().player.cocks.length > 0 ? 'your cock goes a bit further down Kath’s throat' : 'the tongue in yours descends a bit deeper') + '.  Then Urta’s hips stop and she throws back her head as she cums deep inside her mate.  You have to straighten up as Kath’s body is raised off the floor by her expanding belly.\n\n' );
		EngineCore.outputText( 'Urta collapses against Kath’s back and hugs her weakly, her fingers tweaking Kath’s nipples.  Kath’s hungry tongue only stops for a moment.  Her muscles tense up and you suspect the cellar below is getting a thick coating of Kath’s semen.  Then the drunken pussy redoubles her efforts to make you cum.\n\n' );
		EngineCore.outputText( 'You’re already close thanks to the scene before you, so you just rub Kath’s ears a little more forcefully and let it happen.  Kath isn’t surprised by the amount you cum' + (CoC.getInstance().player.cocks.length > 0 ? ', swallowing it all eagerly, despite her swollen belly' : ' and laps eagerly at your pussy, sucking up every drop') + '.  When you finish she pulls back and looks up at you, grinning from ear to ear.\n\n' );
		EngineCore.outputText( 'You all lie there in a tangle, spent and happy.  Urta is the first to recover, gently turning Katherine’s head around so she can give her a long kiss.  She smiles at you and says “<i>Thanks again for introducing the two of us ' + CoC.getInstance().player.short + '.  Now how about you get back to your camp and I take care of this trapped kitty, hmmm?</i>”\n\n' );
		EngineCore.outputText( 'You get dressed, watching the two herms snuggle together.  With Urta stroking Kath’s heavy belly like that you have to wonder if your horny fox is already thinking about a round two.  If she is you know Katherine isn’t about to complain.\n\n' );
		CoC.getInstance().player.orgasm();
		CoC.getInstance().scenes.katherine.orgasm();
		CoC.getInstance().scenes.katherine.katherineAndUrtaHadSex( true );
		CoC.getInstance().flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ]++;
		CoC.getInstance().flags[ kFLAGS.URTA_TIME_SINCE_LAST_CAME ] = 2 + Utils.rand( 2 );
		CoC.getInstance().scenes.urta.urtaLove( 1 );
		if( CoC.getInstance().time.hours >= 13 ) {
			CoC.getInstance().flags[ kFLAGS.KATHERINE_LOCATION ] = CoC.getInstance().scenes.katherine.KLOC_URTAS_APT; //Katherine.timeChange will sort out whether Kath actually stays with Urta
		}
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	KatherineThreesome.prototype.sandwich = function() { //Kath is drunk, Urta is sober //Not available if Kath has no cock
		EngineCore.clearOutput();
		EngineCore.outputText( 'Urta scratches behind Kath’s ear and suggests slipping into one of the back rooms.  As soon as you close the door behind you Kath jumps into Urta’s arms and gives her a long kiss.\n\n' );
		EngineCore.outputText( 'When they come up for air Urta says, “<i>Just a minute Kath, let me get ready,</i>” in a playful tone, trying to push Kath away long enough to get her clothes off.  Kath locks lips with Urta again while her fingers work on the laces of Urta’s clothes.\n\n' );
		EngineCore.outputText( 'When Urta is mostly naked Kath gets behind her and puts her cock' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' between Urta’s thighs.  Taken by surprise Urta closes her legs.  Kath grabs Urta’s hips and purrs in her ear as she starts to slide her member' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' in and out.  You see them start to glisten with Urta’s juices and when Kath next pulls back she winks at you.  Her ' + CoC.getInstance().scenes.katherine.cockMultiple( '', 'upper cock pressing against Urta’s ass and her lower ' ) + 'cock ' + (CoC.getInstance().scenes.katherine.cockNumber === 1 && CoC.getInstance().scenes.urta.pregnancy.isPregnant ? 'pressing against Urta’s ass' : 'slipping between the folds of Urta’s dripping snatch') + '.  Urta’s jaw quivers and she holds her breath, waiting for her fucking to begin.\n\n' );
		EngineCore.outputText( 'You put your hands on Urta’s shoulders, pushing her back towards Katherine.  When Kath sinks her shaft' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' into Urta you comment that they’re really getting along well.  You’re glad to see there isn’t much friction between them.\n\n' );
		EngineCore.outputText( '“<i>How could there be when she’s cumming buckets?</i>” asks Kath, her cock' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' bottoming out inside Urta.  “<i>Now how about you give her something to do?</i>”' );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.choices( 'Mount Urta', this.sandwichGetFucked, 'Get Licked', (CoC.getInstance().player.isTaur() ? this.sandwichMaleCentaurLicked : this.sandwichGetLicked), '', null, '', null, '', null );
		} else {
			EngineCore.doNext( this.sandwichGetFucked );
		}
	};
	KatherineThreesome.prototype.sandwichGetFucked = function() {
		EngineCore.outputText( '\n\nYou look down at Urta’s horse cock.  It bounces with each move Katherine makes - almost like it’s trying to hypnotize you.  Urta moans, “<i>Oh please!</i>” and you see no reason to deny her.  You ' );
		if( CoC.getInstance().player.isTaur() ) {
			EngineCore.outputText( 'turn around and flick your tail at her' );
		} else {
			EngineCore.outputText( CoC.getInstance().player.isNaga() ? 'slide across the floor, tensing your tail so as to bring your [vagOrAss] level with her flared shaft' : 'turn around and bend over, presenting your ass' );
		}
		EngineCore.outputText( '.  Urta, already horny thanks to Kath’s ministrations, wastes no time.\n\n' );
		EngineCore.outputText( 'You feel her hands latch onto your ' + (CoC.getInstance().player.isTaur() ? 'flanks' : 'hips') + ' and her meaty cock presses against your [vagOrAss].  You moan and try to open yourself for this invader, but Urta is in a hurry.  Her fingers dig into your sides and she reels you in, relentlessly feeding you inch after inch of her prick.  When she bottoms out you hear a deep sigh.  It must feel amazing to be both completely filled and completely filling someone at the same time.\n\n' );
		EngineCore.outputText( 'Kath doesn’t wait for you or Urta to adjust.' + (CoC.getInstance().scenes.katherine.cockLength > 14 ? '  You can actually feel a little bump just above Urta’s cock every time Kath thrusts inside her.' : '') + '  She pounds Urta, picking up the pace, and you know it can’t be long before Katherine knots.\n\n' );
		EngineCore.outputText( 'Urta must also know Kath is close as she gets to work on your [vagOrAss], but she’s not quick enough.  You hear a strangled ‘meyowr’ from Kath and you feel Urta’s belly ' );
		if( CoC.getInstance().scenes.katherine.cumQ() <= 1500 ) {
			EngineCore.outputText( 'grow warm as it fills with Katherine\'s seed.  Urta stops for just a moment, sighing contentedly, before she once again grips your ' + (CoC.getInstance().player.isTaur() ? 'flanks' : 'hips') );
		} else {
			EngineCore.outputText( 'expanding against ' + (CoC.getInstance().player.isTaur() ? 'your rump' : 'the small of your back') + '.  The air is forced from Urta’s lungs and you get pushed to the ground as both your lovers collapse against you.\n\nYou smile to yourself and flex ' + (CoC.getInstance().player.hasVagina() ? 'the muscles in your pussy' : 'your sphincter') + ', milking Urta’s cock.  She may be packed with Kath’s sperm but Urta is still Urta.  She responds by gripping your ' + (CoC.getInstance().player.isTaur() ? 'flanks' : 'hips') + ' once more' );
		}
		EngineCore.outputText( '.\n\nDespite her cum-stuffed belly she starts fucking you at a blistering pace, determined to fill you as she has been filled.  The feeling is exquisite and when you look ' + (CoC.getInstance().player.isNaga() ? 'down' : 'back') + ' you see that Kath has taken Urta’s balls in hand.  She grins at you and starts massaging them while she whispers encouragement in Urta’s ear.\n\n' );
		EngineCore.outputText( 'At last you feel the delightful blast of cum inside you.  Urta pulls your body against hers and floods you with her hot, sticky juices.  Your stomach muscles give out, unable to contain the load Urta pumps inside you.  Her throbbing cock brings you release and you cum, joining your lovers in ecstasy.' + (CoC.getInstance().player.hasCock() ? '  Your own cock contributes to the mess by spraying the floorboards with your wasted seed.' : '') );
		this.sandwichCommonEnd(); //Play the common end
	};
	KatherineThreesome.prototype.sandwichGetLicked = function() {
		EngineCore.outputText( '\n\nYou massage Urta’s shoulders and ask if she could help you out.  She’s not sure what you mean until you apply a little pressure, gently angling her head toward your ' + (CoC.getInstance().player.hasCock() ? 'cock' : 'pussy') + '.  Once she gets the idea Urta quickly gets down on all fours.  You have to smile to yourself as Urta ' + (CoC.getInstance().player.hasCock() ? 'licks your cock and sucks out some pre' : 'digs in') + '.  She puts her hands on your hips so that Katherine’s thrusts don’t ' + (CoC.getInstance().player.hasCock() ? 'impale her' : 'force her face into your pussy') + '.\n\n' );
		EngineCore.outputText( 'It’s hard to just stand there.  Before you Kath is lost in pleasure, drunkenly slamming ' );
		if( CoC.getInstance().scenes.katherine.cockNumber > 1 ) {
			EngineCore.outputText( 'both her cocks into Urta’s willing holes' );
		} else {
			EngineCore.outputText( 'her cock into Urta’s willing ' + (CoC.getInstance().scenes.urta.pregnancy.isPregnant ? 'ass' : 'pussy') );
		}
		EngineCore.outputText( '.  Every time she thrusts her rack jiggles delightfully.  At the same time Urta’s expert tongue is ' + (CoC.getInstance().player.hasCock() ? 'sliding around your cockhead' : 'busy teasing your folds') + ', nudging you towards an orgasm.\n\n' );
		EngineCore.outputText( 'With a powerful thrust Kath manages to force her partially inflated knot' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' inside Urta.  Urta gasps, but more importantly she also loses her grip on your hips.  Kath is so lost in pleasure she doesn’t even notice.  She pulls back and you hear her knot' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' pop out.  Then she rams ' + CoC.getInstance().scenes.katherine.cockMultiple( 'it', 'them' ) + ' back in.  Urta is driven forward and ' + (CoC.getInstance().player.hasCock() ? 'she ends up taking your entire cock down her throat in one stroke' : 'her face gets mashed into your pussy') + '.\n\n' );
		EngineCore.outputText( 'It’s the pleading look Urta gives you that sends you over the edge.  That and ' + (CoC.getInstance().player.hasCock() ? 'the feeling of her whole throat clamping down on your member' : 'her nose tickling your clit while her tongue probes your depths.  You cum hard, soaking her face with fem-cum') + '.\n\n' );
		if( CoC.getInstance().player.hasCock() ) {
			if( CoC.getInstance().player.cumQ() < 500 ) {
				EngineCore.outputText( 'You pump a small, hot load of cream down Urta’s throat.  The thick, warm cum must have hit the spot because Urta hums contentedly as the last few spurts dribble into her stomach.\n\n' );
				EngineCore.outputText( 'Urta doesn’t have a chance to recover' );
			} else if( CoC.getInstance().player.cumQ() < 1500 ) {
				EngineCore.outputText( 'You pump shot after shot down Urta’s throat.  With each blast you fire you feel her innards stretch more and more.  By the time your ' + (CoC.getInstance().player.balls > 0 ? 'balls are' : 'prostate is') + ' empty there’s a distinct warmth and wetness in her throat.  Thank goodness she has no gag reflex.\n\n' );
				EngineCore.outputText( 'Urta doesn’t have a chance to recover' );
			} else if( CoC.getInstance().player.cumQ() < 3000 ) {
				EngineCore.outputText( 'Urta tenses up as you release a fountain of cum into her stomach.\n\n' );
				EngineCore.outputText( 'It doesn’t take long before you feel her belly expanding under pressure, making her look three months pregnant, four months, five!  Stuffed like a turkey Urta can do nothing but wait as you expand her stomach and belly beyond their normal limits.\n\n' );
				EngineCore.outputText( 'Urta doesn’t have a chance to get used to the huge load you pumped into her' );
			} else {
				EngineCore.outputText( 'When you release your load your cock expands in girth under the pressure.  You knock the wind out of Urta as you explode inside her throat.  A long stream of cum sprays directly into her stomach.\n\n' );
				EngineCore.outputText( 'The tidal wave of cum inside Urta forces you to take a step back and your cock, despite its stiffness, buckles in the face of the pressure inside Urta.  The pain, combined with the pressure from within your shaft and without, forces you to take another step back and your cock springs out of Urta’s mouth.  While she coughs up the last portion of your contribution your cock continues erupting, coating Urta and even the front of Kath with a tremendous geyser of semen.\n\n' );
				EngineCore.outputText( 'Urta doesn’t have a chance to get used to the huge load you pumped into her' );
			}
		}
		EngineCore.outputText( ' before Kath slams forward once again and knots her.  You see Kath’s tail go rigid and you know Urta is about to receive another contribution.  You get a front row seat as Kath’s hyperactive ' + (CoC.getInstance().scenes.katherine.hasBalls() ? 'balls start' : 'prostate starts') + ' to fill the foxy herm.\n\n' );
		if( CoC.getInstance().scenes.urta.pregnancy.isPregnant ) {
			if( CoC.getInstance().scenes.katherine.cockNumber > 1 ) {
				EngineCore.outputText( 'You watch as a bump forms beneath Urta’s belly.  Her cervix must be blocking Kath’s semen, so it’s pooling at the top of Urta’s birth canal with enough pressure to leave stretch marks on Urta’s skin.  That will probably serve Urta well when the baby is born, but at the moment she’s clutching the bump wordlessly and taking in shallow breaths.\n\n' );
			}
			EngineCore.outputText( 'The cock Katherine has planted in Urta’s ass ' + CoC.getInstance().scenes.katherine.cockMultiple( 'must be pumping in a torrent of cum', 'faces no such restriction' ) + '.  Urta’s belly gets bigger and bigger as her womb and organs are forced forward by the mass of cum bubbling through her colon.\n\n' );
			if( CoC.getInstance().scenes.katherine.cockNumber > 1 ) {
				EngineCore.outputText( 'Suddenly Kath lets out a surprised “<i>Ahhh!</i>” and the hard bulge just above Urta’s cock shrinks quickly while her belly gets even rounder.  “<i>Oh, oh it went backwards.</i>” says Kath, her eyes taking on a glazed look.\n\n' );
			}
			EngineCore.outputText( 'Kath collapses as her ' + (CoC.getInstance().scenes.katherine.hasBalls() ? 'balls channel their' : 'prostate channels its') + ' last few squirts into Urta’s ass.  ' + CoC.getInstance().scenes.katherine.cockMultiple( '', 'Urta has gone from clutching the bulge to rubbing her sides.' ) + '  When it’s over Katherine' );
		} else {
			EngineCore.outputText( CoC.getInstance().scenes.katherine.cockMultiple( 'Sure enough Katherine’s cock starts to release its torrent of cum inside Urta and her', 'Sure enough, the twin shafts inside Urta release a torrent of cum and her' ) + ' belly bulges larger and larger with every squirt.  You have to smile at the look on their faces - Kath focusing intently each time her ' + (CoC.getInstance().scenes.katherine.hasBalls() ? 'balls contract' : 'prostate clenches') + ' and a moment later Urta’s eyes bulging as her belly gets ever rounder.\n\n' );
			EngineCore.outputText( 'Finally Kath runs out of juice and collapses backward.  She' );
		}
		EngineCore.outputText( ' puts a hand on Urta’s belly and moves her belly button back and forth as if she’s playing with a nipple.\n\n' );
		EngineCore.outputText( 'Urta pants, having still not got off.  Kath notices and gives you a wink.  You start rolling Urta’s nipples between your fingers and at the same moment Katherine shifts one hand to Urta’s cock and the other to Urta’s clit.  The stimulation, the fullness, something makes Urta snap and your foxy lover explodes.  She can’t move, but you watch her balls retract almost all the way inside her and the stream of cum she fires reaches the opposite wall.' );
		this.sandwichCommonEnd(); //Play the common end
	};
	KatherineThreesome.prototype.sandwichMaleCentaurLicked = function() {
		EngineCore.outputText( '\n\nYou massage Urta’s shoulders and ask if she could help you out.  She’s not sure what you mean until you apply a little pressure.  Once she gets the idea Urta quickly gets down on all fours.  You give her a big smile and carefully walk over her.\n\n' );
		EngineCore.outputText( 'You wind up in an unusual, but very pleasant situation.  Beneath you Urta is greedily slurping at your cock.  Katherine, who is lodged in Urta’s ' );
		if( CoC.getInstance().scenes.katherine.cockNumber > 1 ) {
			EngineCore.outputText( 'ass and pussy' );
		} else {
			EngineCore.outputText( CoC.getInstance().scenes.urta.pregnancy.isPregnant ? 'ass' : 'pussy' );
		}
		EngineCore.outputText( ', is in just the right position to give you a kiss.  Since your hands are free you embrace her, enjoying the feeling of her breasts rubbing against you while your other partner pleasures your shaft.\n\n' );
		EngineCore.outputText( 'Kath pulls herself free and gives you a wink.  Then she shoves forward, catching Urta by surprise and ramming your cock down Urta’s gullet.  When Urta pulls back Kath grabs her hips and pulls the fox back onto her own cock' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + '.  Urta barely has time to suck in another breath before the drunken pussycat drives her back onto your meatstick.\n\n' );
		EngineCore.outputText( 'You know Urta can’t be that uncomfortable - if she just lowered her head she wouldn’t have to swallow you when Kath shoves her forward.  That and the fox tail that’s wagging between your front legs tells you your favourite fox herm has surrendered herself to being used as a living sex toy.\n\n' );
		EngineCore.outputText( 'Kath really starts to pant and her hips start to jackhammer into Urta.  Looking down you get a front row seat as Kath slams her knot' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' in and out of Urta’s abused hole' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + '.  Then the knots stay in and Kath’s upper body seems to liquify in your arms, an exultant expression on her face.  Urta, still pinned between the two of you, lets out a happy gurgle as her belly is filled with Katherine’s seed and you hear spraying and splashing as her horse cock blows its load all over the floor.\n\n' );
		EngineCore.outputText( 'Since Kath and Urta are now solidly joined you take hold of the exhausted cat ' + CoC.getInstance().scenes.katherine.catGirl( 'girl', 'morph' ) + '’s hips and work her forwards and backwards.  You find it easy to drag Urta back and forth.  Presumably her bloated belly is sliding across the floor on a thick layer of cum.\n\n' );
		EngineCore.outputText( 'Urta slides her tongue around inside her mouth, trying her best to help you cum.  For her part Kath locks her hands around the back of your head and weakly pulls your face down into her breasts.  At last you feel that familiar tensing in your ' + (CoC.getInstance().player.balls > 0 ? 'sac' : 'prostate') + ' and you push as far forward as you can.  Urta’s tongue darts out of her mouth and she’s just able to lick ' + (CoC.getInstance().player.balls > 0 ? 'your balls' : 'the base of your cock') + '.\n\n' );
		EngineCore.outputText( 'All four of your knees go weak as your body devotes all of its energy to filling this foxy lady.  ' );
		if( CoC.getInstance().player.cumQ() < 500 ) {
			EngineCore.outputText( 'You pump a small, hot load of cream down Urta’s throat.  The thick, warm cum must have hit the spot because Urta hums contentedly as the last few spurts dribble into her stomach.' );
		} else if( CoC.getInstance().player.cumQ() < 1500 ) {
			EngineCore.outputText( 'You pump shot after shot down Urta’s throat.  With each blast you fire you feel her innards stretch more and more.   By the time your ' + (CoC.getInstance().player.balls > 0 ? 'balls are' : 'prostate is') + ' empty there’s a distinct warmth and wetness in her throat.  Thank goodness she has no gag reflex.' );
		} else if( CoC.getInstance().player.cumQ() < 3000 ) {
			EngineCore.outputText( 'Urta tenses up as you release a fountain of cum into her stomach.\n\n' );
			EngineCore.outputText( 'It doesn’t take long before you feel her belly expanding under pressure, making her look three months pregnant, four months, five!  There’s serious backpressure, as the cum in her other hole' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' has nowhere to go.  Stuffed like a turkey Urta can do nothing but wait as you expand her stomach and belly beyond their normal limits.' );
		} else {
			EngineCore.outputText( 'When you release your load your cock expands in girth under the pressure.  You knock the wind out of Urta as you explode inside her throat.  A long stream of cum sprays directly into her stomach' + (CoC.getInstance().scenes.katherine.cockNumber > 1 || CoC.getInstance().scenes.urta.pregnancy.isPregnant ? ', seemingly racing to meet the deposit Kath left in Urta’s colon' : '') + '.  Urta’s hands and feet scrabble across the floor, trying to find some escape.  Kath’s deposit' + CoC.getInstance().scenes.katherine.cockMultiple( ' has', 's have' ) + ' nowhere to go so when Urta’s body finally reaches its limit it’s your cock that has to give.\n\n' );
			EngineCore.outputText( 'The tidal wave of cum inside Urta forces you to take a step back and your cock, despite its stiffness, buckles in the face of the pressure inside Urta.  The pain, combined with the pressure from within your shaft and without, forces you to take another step back and your cock springs out of Urta’s mouth.  While she coughs up the last portion of your contribution your cock continues erupting, coating your belly, Urta and even the front of Kath with a tremendous geyser of semen.' );
		}
		this.sandwichCommonEnd(); //Play the common end
	};
	KatherineThreesome.prototype.sandwichCommonEnd = function() {
		EngineCore.outputText( '\n\nYou pull yourself free from your knotted lovers and take in the scene.  The two herms are panting happily.  Urta is stuffed like she’s nine months along and Kath’s tail is flicking from side to side.  Occasionally it lands in a puddle of spunk and flicks a glob of spooge across the room.  It’s going to take a while to clean up, but you have people to see and places to be.\n\n' );
		EngineCore.outputText( 'To ‘make up’ for skipping out on the cleaning you decide to give them a little treat.  ' + (CoC.getInstance().flags[ kFLAGS.URTA_FERTILE ] === 1 && !CoC.getInstance().scenes.urta.pregnancy.isPregnant ? 'First you pat Urta’s belly and ask if she’s trying to get herself knocked up.  She just mumbles something incoherent.  Then you' : 'You') + ' get behind Kath and rub the base of the drunken kitty’s tail.  She purrs appreciatively.  You reach further down and start playing with ' );
		if( CoC.getInstance().scenes.katherine.ballSize > 0 ) {
			EngineCore.outputText( 'her recently drained balls' );
		} else {
			EngineCore.outputText( 'the base of her ' + CoC.getInstance().scenes.katherine.cockMultiple( '', 'lower ' ) + 'cock' );
		}
		EngineCore.outputText( '.\n\n' );
		EngineCore.outputText( '“<i>You’ve got to show the Captain here that you’ve got endurance,</i>” you tell her.\n\n' );
		EngineCore.outputText( 'Kath moans and says, “<i>I just - I’m still knotted.  I can’t.</i>”\n\n' );
		EngineCore.outputText( 'You give her a kiss and say, “<i>Don’t be a quitter.</i>”\n\n' );
		EngineCore.outputText( 'Urta looks up, realizing what you’re trying to do.  “<i>No, no!  I’m still full.  I can’t.</i>”\n\n' );
		EngineCore.outputText( 'You keep rubbing Kath with one hand but you move your other to tease Urta’s clit.  You tell Urta that deep down she knows she can take it.  She tries to fight back, but with her stomach stuffed and Kath already knotted she can’t escape.\n\n' );
		EngineCore.outputText( 'You kiss Kath again and ask her, “<i>Don’t you want to see how big you can make her?</i>”  Despite having just cum you see the drunken lust reignite in Kath’s eyes.  She digs her claws into Urta’s hips and starts gently rocking her shaft in and out.\n\n' );
		EngineCore.outputText( 'Urta clutches her belly and moans, “<i>Oh no,</i>” but you think she’s starting to get into it.  Before you get too turned on you leave your lovers to it.' + (CoC.getInstance().flags[ kFLAGS.KATHERINE_URTA_AFFECTION ] >= 31 ? '  They really need some more time together and you’re sure this qualifies as a ‘bonding experience’.' : '') );
		CoC.getInstance().player.orgasm();
		CoC.getInstance().scenes.katherine.orgasm();
		CoC.getInstance().scenes.katherine.katherineAndUrtaHadSex( true );
		CoC.getInstance().flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ]++;
		CoC.getInstance().flags[ kFLAGS.URTA_TIME_SINCE_LAST_CAME ] = 2 + Utils.rand( 2 );
		CoC.getInstance().scenes.urta.urtaLove( 1 );
		if( CoC.getInstance().time.hours >= 13 ) {
			CoC.getInstance().flags[ kFLAGS.KATHERINE_LOCATION ] = CoC.getInstance().scenes.katherine.KLOC_URTAS_APT; //Katherine.timeChange will sort out whether Kath actually stays with Urta
		}
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	KatherineThreesome.prototype.orgy = function() { //Both Kath and Urta are drunk
		EngineCore.clearOutput();
		EngineCore.outputText( 'Your attempt to draw them off into one of the backrooms comes too late.  Urta kisses Kath and Kath responds by undoing Urta’s belt.  Her massive schlong smacks the underside of the table on its way to freedom.  The deep wooden ‘knock’ silences most of the bar and everyone looks your way to see what’s going on.\n\n' );
		EngineCore.outputText( 'Urta is so drunk that she doesn’t care that her prick is standing erect and waving free in the open air.  Kath cares even less about what people think and slowly draws her hand down Urta’s cock, from the tip to the root.  Urta shudders under the attention and quickly undoes ' + CoC.getInstance().scenes.katherine.clothesLowerChoice( 'Kath’s blouse', 'Kath’s blouse', 'the upper part of Kath’s bodysuit', 'the laces on Kath’s dress', 'the front of Kath’s robe' ) + ', freeing her ' + CoC.getInstance().scenes.katherine.breasts.adj() + ' breasts.\n\n' );
		EngineCore.outputText( 'Urta’s next move is to grab you by the hand and twist your arm, drawing you over to the seat next to the one she and Kath are sharing.  For her part, Kath slides off the rest of her outfit and then starts eagerly groping your ' );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( 'crotch' );
		} else {
			EngineCore.outputText( CoC.getInstance().player.hasBreasts() ? 'breasts' : 'ass' );
		}
		EngineCore.outputText( '.\n\nUrta pulls on your hand again, places it against her moist vagina and growls, “<i>I want you - I want both of you,</i>” before sucking hard on one of Kath’s nipples.\n\n' );
		EngineCore.outputText( 'Kath lets out a sigh and wraps her tail around your leg.  “<i>Yeah, lets give ‘em something to talk about.</i>”\n\n' );
		EngineCore.outputText( 'Urta lifts her head, looks around and realizes how many people are staring at the developing threesome.  For a moment it looks like she’s going to bolt, but then Kath lets out a seductive growl and starts stroking Urta’s shaft once again.  Urta closes her eyes and gives in to this public display of lust and drunkenness.\n\n' );
		EngineCore.outputText( 'All around you there’s the sound of buckles being loosened, laces being undone and fabric sliding off flesh, fur and scale.  There were quite a few patrons around when this started and all but a few are keen to watch - at least.\n\n' );
		var valaHere = CoC.getInstance().flags[ kFLAGS.FREED_VALA ] > 0 && CoC.getInstance().time.hours >= 12 && CoC.getInstance().time.hours <= 21;
		if( valaHere ) {
			EngineCore.outputText( 'You spot Vala, still carrying a tray of drinks from before this started.  Normally she’s fast enough to keep out of this sort of thing, but when she sees you, Kath and Urta together her jaw drops.  Someone bumps into her and she flitters closer, placing the tray on the table. ' );
			if( CoC.getInstance().flags[ kFLAGS.KATHERINE_VALA_TIMES_SEX ] > 0 ) {
				EngineCore.outputText( 'You smile, knowing Vala has nothing against something harmless like an orgy.\n\n' );
			} else {
				EngineCore.outputText( 'You smile weakly, wondering how to explain all this, but Vala just puts down that tray and moves in close.\n\n' );
				EngineCore.outputText( '“<i>Hi ' + CoC.getInstance().player.short + ',</i>” she says cheerfully, “<i>I see you brought a friend.  Did you save her too?</i>”\n\n' );
				EngineCore.outputText( 'Kath stops kissing Urta for a second and says, “<i>Uh... kinda, yeah,</i>” before Urta pulls her back into the kiss.\n\n' );
				EngineCore.outputText( '“<i>That sure sounds like my hero,</i>” says Vala, grinning ear to ear.  “<i>Oh, I’m Vala,</i>” she adds, extending a hand which Kath shakes, looking surprised.\n\n' );
				EngineCore.outputText( 'You tell Vala that this is Katherine.  You hear a muffled “<i>Hi</i>” from the locked lips of your two ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'herms' : 'lovers') + '.\n\n' );
			}
		}
		EngineCore.outputText( 'After that things get out of hand.  You lose track of both time and people.  Certainly you, Katherine' + (valaHere ? ', Urta and Vala' : ' and Urta') + ' tend to be at the center of things, but there’s a mess of other people involved.  You’re sure some extras participants came in from the street.  Over an hour later you find yourself lying in a pool of slowly cooling spunk.\n\n' );
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'You, Kath' + (valaHere ? ', Urta and Vala' : ' and Urta') + ' all' );
		} else {
			EngineCore.outputText( 'Kath' + (valaHere ? ', Urta and Vala all' : ' and Urta both') );
		}
		EngineCore.outputText( ' sport huge, cum-stuffed bellies - as do so many others.\n\n' );
		EngineCore.outputText( 'Too tired to move, you go through some of the highlights in your mind: A huge minotaur in bondage straps eagerly sucking on a bunny morph’s cock, swallowing her entire load' );
		if( valaHere ) {
			EngineCore.outputText( '... Vala surprising Kath by ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'settling on top of her ' + CoC.getInstance().scenes.katherine.cockAdj() + 'shaft and then taking it, knot and all, inside her tiny body' : 'diving between her thighs and sucking on Kath\'s clit while pushing her whole hand inside Kath\'s dripping twat') );
		}
		EngineCore.outputText( '... A heavily pregnant drider fisting a centaur and at the same time forcing her eggs into an eager looking canine-morph... a tiny little spider girl, no more than 4’4" tall, taking three huge horse-morphs in a row, her chitin creaking as her belly expands far past her normal limits... a woman who looked demonic, lost in ecstasy, sucking on a pair of dog cocks and jerking them off onto herself while riding Urta’s monster prick... and of course the moment when Katherine ' );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( 'deepthroated your cock' );
		} else {
			EngineCore.outputText( CoC.getInstance().player.hasVagina() ? 'licked you out' : 'fisted your ass' );
		}
		EngineCore.outputText( ' while she was bent over the table and getting fucked from behind by Urta.\n\n' );
		if( valaHere ) {
			EngineCore.outputText( 'Vala manages to pull herself free from the sticky floor.  Her wings flap wetly, splattering gobs of cum across the bar.  She gives you a kiss and turns to inspect Katherine and Urta.  “<i>You sure know how to start a party,</i>” she says, pressing on her belly to force out some of the cum.\n\n' );
			EngineCore.outputText( 'She looks around the bar at all the collapsed bodies and says, “<i>This is gonna take a long time to clean up, but boy oh boy was it ever worth it.</i>”  She gives each of you a kiss and then wobbles toward the cupboard with the cleaning supplies.\n\n' );
			EngineCore.outputText( 'Kath mumbles, “<i>Worth it,</i>” at the floor, then seems to pass out.\n\n' );
			CoC.getInstance().scenes.katherine.katherineAndValaHadSex();
		}
		EngineCore.outputText( 'Using one of the room’s columns as support Urta pulls herself upright and surveys the damage.  “<i>I’m going to have to sort this out.  Oh yeah, this was worth it, but now I’m going to need to sweep it all under the rug.  Yeesh.</i>”\n\n' );
		EngineCore.outputText( 'She tosses a spermy bit of your clothing to you and says, “<i>You should get out of here ' + CoC.getInstance().player.short + '.  Don’t you worry, I’ll take care of this.</i>”  Poking Katherine with her foot, she adds, “<i>Besides, Kath needs a bit more education on the subject of Watch paperwork.</i>”\n\n' );
		EngineCore.outputText( '“<i>Aw - not paperwork,</i>” groans Kath as you wave and escape out the door.' );
		CoC.getInstance().player.orgasm();
		CoC.getInstance().scenes.katherine.orgasm();
		CoC.getInstance().scenes.katherine.katherineAndUrtaHadSex( true );
		CoC.getInstance().flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ]++;
		CoC.getInstance().flags[ kFLAGS.URTA_TIME_SINCE_LAST_CAME ] = 10 + Utils.rand( 2 );
		CoC.getInstance().scenes.urta.urtaLove( 1 );
		if( CoC.getInstance().time.hours >= 13 ) {
			CoC.getInstance().flags[ kFLAGS.KATHERINE_LOCATION ] = CoC.getInstance().scenes.katherine.KLOC_URTAS_APT; //Katherine.timeChange will sort out whether Kath actually stays with Urta
		}
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseTwoHours );
	};

	KatherineThreesome.prototype.doubleStuffKath = function() { //Both Kath and Urta are drunk
		EngineCore.clearOutput();
		EngineCore.outputText( 'You ask your two ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'herms' : 'lovers') + ' if they want to go somewhere more private.\n\n' );
		var urtaHasHouse = CoC.getInstance().player.hasKeyItem( 'Spare Key to Urta\'s House' ) >= 0;
		EngineCore.outputText( 'Urta ' + CoC.getInstance().scenes.katherine.clothesLowerChoice( 'runs her hand up Kath’s thigh', 'slides her hand under Kath’s skirt', 'rubs the ' + (CoC.getInstance().scenes.katherine.hasCock() ? CoC.getInstance().scenes.katherine.cockAdj() + 'bulge in the ' : '') + 'crotch of Kath’s bodysuit', 'slides her hand under Kath’s dress', 'slides her hand between the folds of Kath’s robe' ) + ' and says, “<i>That’s a good idea.  My ' + (urtaHasHouse ? 'old ' : ' ') + 'apartment’s close enough.</i>”\n\n' );
		CoC.getInstance().flags[ kFLAGS.KATHERINE_LOCATION ] = CoC.getInstance().scenes.katherine.KLOC_URTAS_APT;
		EngineCore.outputText( 'It’s an interesting walk.  Both Urta and Kath need your support and both are horny.  They’re constantly groping and kissing you or each other.  When you get to Urta’s ' + (urtaHasHouse ? 'old ' : ' ') + 'apartment the two ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'herms' : 'girls') + ' don’t even make it to the bed.  They crash to the floor and start tearing each other’s clothes off while you close the door.\n\n' );
		EngineCore.outputText( '“<i>You want to see us fuck?  Is that it?</i>” Kath asks.\n\n' );
		EngineCore.outputText( 'Urta strokes Katherine’s ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'cock' : 'tail') + ' and says, “<i>Yeah, [he] loves ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'herms so much' : 'it when we fuck') + ', let’s give [him] a show!</i>”\n\n' );
		EngineCore.outputText( 'Urta lifts Kath’s leg and presses the flat face of her cock against Kath’s dripping pussy.  Kath distracts her by squeezing Urta’s breasts, then ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'presses her own cock against' : 'slides her finger over') + ' Urta’s sex.\n\n' );
		EngineCore.outputText( 'You’re barely out of your clothes by the time your two vixens slam their hips against each other.  It’s like a small thunderclap' + (CoC.getInstance().scenes.katherine.hasCock() ? '.  Both of them look down at where their respective cocks disappear into each other’s bodies' : ' and they both seem well pleased with the result') + '.\n\n' );
		EngineCore.outputText( 'Kath starts to laugh.  “<i>' + (CoC.getInstance().scenes.katherine.hasCock() ? 'No room left for you' : 'Too slow' + CoC.getInstance().player.short) + ',</i>” she says, “<i>but I bet we can still make you feel good.</i>”\n\n' );
		EngineCore.outputText( 'Urta licks her lips and says, “<i>Oh yeah, we’re gonna make you feel so good.</i>”  She reaches out for your hand and pulls you closer.  She mumbles “<i>If I’m fucking your girl’s pussy this is the least I can do.</i>”  Her tongue licks the ' + (CoC.getInstance().player.hasCock() ? 'tip of your cock before she takes it into her mouth' : 'length of your pussy before she sucks on your clit') + '.\n\n' );
		EngineCore.outputText( 'Urta’s alcohol consumption must have loosened her up.  She sucks ' + (CoC.getInstance().player.hasCock() ? 'your cock right down her throat, barely gagging at all' : 'and rolls her tongue over your clit like a possessed woman') + '.  Kath looks ' + (CoC.getInstance().player.hasCock() ? 'impressed as Urta deepthroats you' : 'a little envious, despite the horse cock that\'s filling her') + '.  When Urta finally pulls back for some air Kath gleefully shouts, “<i>My turn!</i>” and ' + (CoC.getInstance().player.hasCock() ? 'takes your whole length in one gulp' : 'dives in, her rough tongue attacking your clit as she tries to one-up her captain') + '.\n\n' );
		EngineCore.outputText( '“<i>Show off,</i>” says Urta.  She tweaks Katherine’s nipples, causing a low moan that vibrates ' + (CoC.getInstance().player.hasCock() ? 'your dick' : 'through your pussy') + ' in a pleasing way.  Soon Kath ' + (CoC.getInstance().player.hasCock() ? 'has to release' : 'has to release') + ' you and coughs as she sucks in a new breath.\n\n' );
		EngineCore.outputText( 'Before she can ' + (CoC.getInstance().player.hasCock() ? 'swallow your meat' : 'go down on you') + ' again Urta grabs your ' + (CoC.getInstance().player.hasCock() ? 'pole and directs it between her own lips' : 'hips and presses her face against your groin') + '.  “<i>Hey! I wasn’t finished,</i>” says Kath.  She starts to ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'thrust her ' + CoC.getInstance().scenes.katherine.cockType() + ' member into Urta’s hole' : 'rock her hips, her hand rolling Urta\'s balls between her fingers') + '.  Urta’s eyes close and she lets Kath' + (CoC.getInstance().scenes.katherine.hasCock() ? '’s thrusts rock' : 'do as she likes with') + ' her body, ' + (CoC.getInstance().player.hasCock() ? 'sliding her throat up and down your shaft' : 'her tongue burrowing deep inside you') + '.\n\n' );
		EngineCore.outputText( 'You were horny before these insatiable ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'herms' : 'sluts') + ' started fighting over your ' + (CoC.getInstance().player.hasCock() ? 'cock' : 'cunt') + ' and the feeling brings you to your knees.  By the time Urta lets go Kath is ready.  In a single stroke her nose starts rubbing against your belly and you look down to witness her slight smile and horny gaze as her rough tongue starts doing unspeakable things ' + (CoC.getInstance().player.hasCock() ? 'to your cock' : 'deep inside your sex') + '.  Meanwhile Urta is ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'providing the same ‘service’ Kath did,' : '') + ' hammering her cock into Kath’s cunt like it owes her money.\n\n' );
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( 'You hear an “<i>Oh!</i>” from Urta and the long thrusts are reduced to much shorter strokes.  It seems Kath, in all the excitement, has knotted your foxy friend.  Kath doesn’t sound very sincere when she giggles and says, “<i>I am <b>so</b> sorry.</i>”  Urta just grunts and tries to force more of her equine shaft inside Kath.  They both cum and you get to watch as their bellies fill.  The two herms are forced apart by their bulges and have to take a moment to recover from their orgasms.  They both rub their bellies, obviously content with the situation.\n\n' );
		} else {
			EngineCore.outputText( 'You hear an “<i>Oh!</i>” from Urta and she plants her equine shaft as deep as she can inside Kath\'s pussy.  Kath\'s eyes glaze over as Urta grunts and holds Kath in place while her seed flows, filling Katherine\'s belly \'til it takes the shape of a ' + CoC.getInstance().scenes.katherine.catGirl( '', 'fuzzy ' ) + ' watermelon.  The two girls are forced apart by Kath\'s new bulge and have to take a moment to recover from their orgasms.\n\n' );
		}
		EngineCore.outputText( 'Kath regains her strength first and forces herself up onto her elbows.  She smiles at you and simply opens her mouth.  You smile back, ' + (CoC.getInstance().player.hasCock() ? 'feed her your cock' : 'press your crotch against her face') + ' and relax, enjoying the slower pace' + (CoC.getInstance().player.hasCock() ? ', the texture of Kath’s tongue and the inside of her throat' : ' and the texture of Kath’s tongue') + '.\n\n' );
		EngineCore.outputText( 'Your two lovers trade you' + (CoC.getInstance().player.hasCock() ? 'r cock' : '') + ' back and forth a few times until you feel that you’re about to cum.  ' );
		if( !CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( 'There\'s no reason to fight it, you let go and femcum dribbles down ' + (CoC.getInstance().player.isNaga() ? 'the scales of your tail' : 'your legs') + ' and washes over both Kath and Urta.  Your muscles give out and you collapse on the floor next to your panting, sweating lovers.' );
		} else if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 'You put a hand behind each of their heads and pull them both towards your groin.  Kath and Urta hungrily gobble your cocks until their cheeks are pressed together.  That’s when you let loose.  They both feel the first stream hit their throat and the sight of two pairs of eyes looking up at you ensures you’ll provide them both with a good-sized helping.\n\n' );
			if( CoC.getInstance().player.cumQ() < 500 ) {
				EngineCore.outputText( 'They both swallow your additional contribution easily.' + (CoC.getInstance().scenes.katherine.hasCock() ? '  It’s nothing compared to the amount they pumped into each other’s pussies.' : '') );
				if( CoC.getInstance().player.cockTotal() > 2 ) {
					EngineCore.outputText( '  Your other cock' + (CoC.getInstance().player.cockTotal() > 3 ? 's' : '') + ' produce a few squirts which coat both Kath and Urta’s bodies.' );
				}
				EngineCore.outputText( '  As you pull out they give each other a tired hug and giggle drunkenly ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'as they compare their swollen bellies' : 'as Urta rubs Kath\'s swollen belly proudly') + '.' );
			} else if( CoC.getInstance().player.cumQ() < 1500 ) {
				if( CoC.getInstance().scenes.katherine.hasCock() ) {
					EngineCore.outputText( 'Both your lovers have a little difficulty taking your deposit.  Each already has a full tummy thanks to the other’s efforts.  They gulp it all down but afterwards they cradle their full bellies and rub their sides, trying to reduce the pressure.' );
				} else {
					EngineCore.outputText( 'Urta swallows your load with ease; Kath, her tummy already brimming thanks to Urta\'s efforts, has more trouble.  They gulp it all down but afterwards Kath cradles her overstuffed belly and Urta massages her sides, trying to reduce the pressure.' );
				}
				if( CoC.getInstance().player.cockTotal() > 2 ) {
					EngineCore.outputText( '  You realize that your free cock' + (CoC.getInstance().player.cockTotal() > 3 ? 's' : '') + ' fired their streams all over the room, adding to the mess Urta will have to clean up later.' );
				}
				EngineCore.outputText( '  Urta looks at you, then Kath and back at you and just laughs at where her lust has taken her.' );
			} else {
				if( CoC.getInstance().scenes.katherine.hasCock() ) {
					EngineCore.outputText( 'Urta’s gut starts to expand under the added pressure from your contribution.  Kath’s does too, but without a knot in the way quite a bit of Urta’s cum starts to leak out.  Urta makes a worried “<i>Mmph</i>” noise, but you’re too involved in filling them to stop.  She leans back and her stomach grows enough to develop some stretch marks.' );
				} else {
					EngineCore.outputText( 'Urta’s gut starts to expand, your deposit soon rounding her belly just as much as Kath\'s.  Kath’s belly swells a little too, but under the added pressure quite a bit of Urta’s cum starts to leak out.' );
				}
				if( CoC.getInstance().player.cockTotal() > 2 ) {
					EngineCore.outputText( '  Your other cock' + (CoC.getInstance().player.cockTotal() > 3 ? 's' : '') + ' release a torrent of cum, coating Kath, Urta, the floor and a few of the walls.  Though it’s messy you’re sure both your lovers are happy that at least some of your sperm didn’t wind up inside them.' );
				}
				EngineCore.outputText( '\n\nWhen it’s over you pull your cocks free and Kath giggles at Urta’s faux pregnancy.  “<i>Too full,</i>” Urta croaks.' + (CoC.getInstance().scenes.katherine.hasCock() ? '  Kath rubs Urta’s larger belly and then flicks her finger against it, watching the waves ripple across Urta’s skin' : '\n\nKath\'s jaw drops and she point at her own, even larger, belly.  “<i>You do <b>not</b> get to complain,</i>” she says, pressing her hand none too gently against Urta\'s stomach') + '.  “<i>Oh - not fair!</i>” cries Urta, clutching her overstuffed gut.' );
			}
		} else {
			{ //Just one cock
			}
			if( Utils.rand( 2 ) === 0 ) { //Urta takes it
				EngineCore.outputText( 'Urta had just swallowed you again, the ride down her throat setting you off.  You grip the back of her head and your ' + (CoC.getInstance().player.balls > 0 ? 'balls start' : 'prostate starts') + ' pumping.  Her eyes go wide but she accepts her fate, trying to swallow your load as fast as you can produce it.\n\n' );
				EngineCore.outputText( 'Kath realizes what’s happened' + (CoC.getInstance().player.balls > 0 ? ' and rubs your balls' : ', quicky inserts her finger into your ass and starts milking your prostate') + ', trying to coax an even bigger load out of ' + (CoC.getInstance().player.balls > 0 ? 'them' : 'it') + '.  ' );
				if( CoC.getInstance().player.cumQ() < 500 ) {
					EngineCore.outputText( 'Urta swallows all of it easily.  Your contribution does nothing to ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'her expanded' : 'expand her') + ' abdomen, but she rubs your leg and smiles contentedly.' );
				} else if( CoC.getInstance().player.cumQ() < 1500 ) {
					EngineCore.outputText( 'Urta has a little difficulty taking your deposit' + (CoC.getInstance().scenes.katherine.hasCock() ? ' since her belly is already filled with Kath’s seed' : '') + '.  She gulps it all down but rubs her sides afterward, trying to reduce the pressure.' );
				} else {
					EngineCore.outputText( 'Urta’s gut starts to expand ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'under the added' : 'thanks to the') + ' pressure from your contribution.  She makes a worried “<i>Mmph</i>” noise, but you’re busy right now.  She leans back and her stomach grows enough to develop some stretch marks.' );
					EngineCore.outputText( 'When it’s over you pull your cock free and Kath giggles at Urta’s faux pregnancy.  “<i>Too full,</i>” Urta croaks.  Kath rubs Urta’s ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'larger ' : '') + 'belly and then flicks her finger against it, watching the waves ripple across Urta’s skin.  “<i>Oh - not fair!</i>” cries Urta, clutching her overstuffed gut.' );
				}
			} else {
				{ //Kath takes it
				}
				EngineCore.outputText( 'Kath’s licking and humming set you off, so you grip the back of her head.  Your ' + (CoC.getInstance().player.balls > 0 ? 'balls start' : 'prostate starts') + ' pumping.  Her eyes go wide but she accepts her fate, trying to swallow your load as fast as you can produce it.\n\n' );
				EngineCore.outputText( 'Urta realizes what’s happened' + (CoC.getInstance().player.balls > 0 ? ' and rubs your balls' : ', quicky inserts her finger into your ass and starts milking your prostate') + ', trying to coax an even bigger load out of ' + (CoC.getInstance().player.balls > 0 ? 'them' : 'it') + '.  ' );
				if( CoC.getInstance().player.cumQ() < 500 ) {
					EngineCore.outputText( 'Kath swallows all of it easily.  Your contribution does nothing to her expanded abdomen, but she rubs your leg and smiles contentedly.' );
				} else if( CoC.getInstance().player.cumQ() < 1500 ) {
					EngineCore.outputText( 'Kath has a little difficulty taking your deposit since her belly is already filled with Urta’s seed.  She gulps it all down but rubs her sides afterward, trying to reduce the pressure.' );
				} else {
					EngineCore.outputText( 'Kath’s gut starts to expand under the added pressure from your contribution.  She makes a worried “<i>Mmph</i>” noise, but you’re busy right now.  She leans back and her stomach grows enough to develop some stretch marks.  You start to see Urta’s load being forced back out, despite the fact Urta’s huge cock hasn’t started to shrink yet.' );
					EngineCore.outputText( 'When it’s over you pull your cock free and Urta starts to rub Katherine’s ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'larger ' : '') + 'belly.  Kath lies back on the floor and moans, her tail lazily moving from side to side.' );
				}
			}
		}
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( '\n\nYou’re now spent, but the sight of these two cum-stuffed herms knotted together gives you an idea.  You reach down and start rubbing the back end of Kath’s swollen knot.  “<i>Hey.  No no no - please!  If you do that I’ll - Oh! - We’ll be tied for hours.</i>”  You smile and tell her that’s the plan.\n\n' );
			EngineCore.outputText( 'Urta wriggles, trying to pull away from Kath, but you’re too fast.  You feel Kath’s knot engorge again, sealing Kath to her mate.  You give them each a kiss and tell them it’s time they got to know each other better.  Then you pull on your clothes and head back to camp, feeling you’ve already accomplished quite a bit today.\n\n' );
		} else {
			EngineCore.outputText( '\n\nYou’re now spent and unfortunately you have to get back to camp.  You give both Kath and Urta a kiss and wrap Kath\'s arms around Urta and Urta\'s arms around Kath.  The girls sigh and snuggle together' );
			if( CoC.getInstance().player.cor < 33 ) {
				EngineCore.outputText( ', giving you a warm feeling in the bottom of your heart.' );
			} else {
				EngineCore.outputText( CoC.getInstance().player.cor < 66 ? '.  Despite having just cum you feel a little twitch from your cock.' : '.  It\'s sickly sweet, but who cares as long as they keep fucking like that.' );
			}
		}
		CoC.getInstance().player.orgasm();
		CoC.getInstance().scenes.katherine.orgasm();
		CoC.getInstance().scenes.katherine.katherineAndUrtaHadSex( true );
		CoC.getInstance().flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ]++;
		CoC.getInstance().flags[ kFLAGS.URTA_TIME_SINCE_LAST_CAME ] = 2 + Utils.rand( 2 );
		CoC.getInstance().scenes.urta.urtaLove( 1 );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	KatherineThreesome.prototype.doublePenetrateKath = function() { //Both Kath and Urta are drunk
		EngineCore.clearOutput();
		EngineCore.outputText( 'You ask your two ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'herms' : 'sluts') + ' if it’s time to commandeer one of the back rooms.\n\n' );
		EngineCore.outputText( 'Urta ' + CoC.getInstance().scenes.katherine.clothesLowerChoice( 'runs her hand up Kath’s thigh', 'slides her hand under Kath’s skirt', 'rubs the ' + (CoC.getInstance().scenes.katherine.hasCock() ? CoC.getInstance().scenes.katherine.cockAdj() + 'bulge in the ' : '') + 'crotch of Kath’s bodysuit', 'slides her hand under Kath’s dress', 'slides her hand between the folds of Kath’s robe' ) + ' and gives you a wolfish smile.\n\n' );
		EngineCore.outputText( 'You have to help them both to one of the backrooms and you can feel the eyes of many of the bar’s patrons on your back.  As soon as the door is closed and barred Urta presses Kath against the wall and starts giving her tongue.\n\n' );
		EngineCore.outputText( 'You watch the show, your cock beginning to strain against the confines of your clothes' + (CoC.getInstance().player.hasVagina() ? ' as your pussy begins to wet them' : '') + '.  Katherine starts to tug at Urta’s clothes and despite her drunkenness she does a good job of removing them.\n\n' );
		EngineCore.outputText( 'Urta rips off the last few bits of her own clothing and then starts on Kath’s garments.  She looks over at you and says, “<i>Better hurry up ' + CoC.getInstance().player.short + '.  I don’t think you want to get left out of this.</i>”  Just as she says the final word she pulls off the last of Kath’s clothes and cups both Kath’s ' + CoC.getInstance().scenes.katherine.breasts.adj() + ' breasts in her hands.\n\n' );
		EngineCore.outputText( 'Kath lets out a happy moan as her ' );
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( CoC.getInstance().scenes.katherine.cockMultiple( 'cock, now in the open air, rises until it’s', 'twin cocks, now in the open air, rise until they’re' ) + ' poking Urta’s belly.\n\n' );
		} else {
			EngineCore.outputText( 'breasts are manhandled.  You watch as ' + (CoC.getInstance().scenes.katherine.breasts.lactating() ? 'cream runs down her front and' : 'some of her') + ' femcum dribbles down her thigh.\n\n' );
		}
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( 'Urta twists ' + CoC.getInstance().scenes.katherine.cockMultiple( 'it', 'them' ) + ' out of the way, causing Kath to let out a little squeak.  She tells Kath, “<i>Oh, not today cutie.  Today I’m gonna use this.</i>”  Urta props the tip of her huge horsecock against Kath’s clit.  Kath looks down between her breasts and then over at you.\n\n' );
		} else {
			EngineCore.outputText( 'Urta props the tip of her huge horsecock against Kath’s clit and tells her, “<i>No teasing today kitty.  Today I am gonna use this monster on you.</i>”  Kath looks down between her breasts and then over at you.\n\n' );
		}
		EngineCore.outputText( 'By now you’ve undressed and you’re getting hard watching Urta manhandle your pretty kitty.  It would be something to see her massive horsecock buried in Katherine’s tight little snatch.  You decide to give them a ‘helping hand’ by giving Urta’s ass a good hard smack when she’s not looking.\n\n' );
		EngineCore.outputText( 'Urta jerks forward in surprise and then they both let out a little yelp.  Kath’s up on tiptoes with her mouth wide open.  Urta looks over her shoulder like she’s about to complain, but then her brain finally registers the hot, tight passage her cock has just sunk into.  The anger disappears from her face and she puts her hands on Katherine’s shoulders.\n\n' );
		EngineCore.outputText( '“<i>I’m so full,</i>” is all Kath can say.\n\n' );
		EngineCore.outputText( '“<i>Not yet you aren’t,</i>” replies Urta.  She pushes down on Kath’s shoulders and forces another few inches inside.\n\n' );
		EngineCore.outputText( 'Katherine’s tongue lolls out of her mouth as her cunt stretches wider.  When Urta starts to pull back Kath looks at you lustily and asks, “<i>What about you, ' + CoC.getInstance().scenes.katherine.playerText() + '?</i>”\n\n' );
		EngineCore.outputText( 'You pull the joined ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'herms' : 'lovers') + ' away from the wall and tell Kath you’re here to give her support.  She looks a bit confused, so you step behind her and spread her cheeks with your hands.\n\n' );
		EngineCore.outputText( '“<i>Oh, I see,</i>” she pants.\n\n' );
		EngineCore.outputText( 'When Urta pushes forward again you press your cock against Kath’s asshole.  You brace your legs, and as Urta fills Kath from the front your cock begins to fill her behind.  Kath hugs Urta and lets out a deep, long purr of satisfaction.\n\n' );
		EngineCore.outputText( 'Inside her, through your cock, you can feel the large hot intrusion that could only be Urta’s equine member.  You thrust a bit deeper.  The strained membranes between Urta’s cock and yours allow you to feel the bumps of the veins on her cock.  When you both stop you can feel Urta’s pulse.\n\n' );
		EngineCore.outputText( 'Kath is only along for the ride as you and Urta build a rhythm together.  Sometimes she withdraws as you enter, sometimes you both push your cocks in at the same time - all the way to the root.  When you both withdraw you can feel Katherine’s belly pulling inwards from the sudden suction.\n\n' );
		EngineCore.outputText( 'The wet squishing, slapping, dripping, purring, and moaning makes it sound like you’re using Kath as an obscene orchestra, an instrument built for two.  She clearly doesn’t care.  With two cocks in her she cums quickly, her ' );
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( 'cock' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' matting Urta’s furry belly and coating the floor beneath you.\n\n' );
		} else {
			EngineCore.outputText( 'pussy releasing a flood of girl cum that ' + CoC.getInstance().scenes.katherine.catGirl( 'wets her skin', 'mats her fur' ) + ' all the way to her feet and soaks into the floor beneath you.\n\n' );
		}
		EngineCore.outputText( 'You’re getting close to cumming yourself when you feel Katherine’s sphincter beginning to clasp around your cock a second time.  Kath’s hips are trapped but they try to move nonetheless, ' );
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( 'uselessly humping as her dick' + CoC.getInstance().scenes.katherine.cockMultiple( ' sprays', 's spray' ) + ' her seed against Urta once again.\n\n' );
		} else {
			EngineCore.outputText( 'weakly grinding against Urta\'s cock as her body begs for more.\n\n' );
		}
		EngineCore.outputText( 'Now it’s your turn.  You tighten your grip on Kath’s hips and jam your prick all the way in.  You hear a whimpered “<i>Yes</i>” from Kath before your ' + (CoC.getInstance().player.balls > 0 ? 'balls start to empty their' : 'prostate starts to empty its') + ' contents.  ' );
		if( CoC.getInstance().player.cumQ() < 500 ) {
			EngineCore.outputText( 'You pump several rapid-fire shots into Kath’s colon.  The thick, warm cum lubes up her innards.  Kath’s tail wags, both showing you her pleasure and massaging the base of your cock.' );
		} else if( CoC.getInstance().player.cumQ() < 1500 ) {
			EngineCore.outputText( 'You pump several streams of cum into Kath’s rectum.  With each shot you fire you feel her innards stretch more and more.  By the time your ' + (CoC.getInstance().player.balls > 0 ? 'balls are' : 'prostate is') + ' empty you can’t feel the insides of her colon anymore, just an inner sea of your cum.' );
			EngineCore.outputText( 'Looking over her shoulder you can see that Kath’s belly has ballooned slightly.  Kath looks back at you and smiles.' );
		} else if( CoC.getInstance().player.cumQ() < 3000 ) {
			EngineCore.outputText( 'Kath wheezes as you release a fountain of cum into her bowels.\n\n' );
			EngineCore.outputText( 'It doesn’t take long before you feel her belly expanding under pressure, making her look three months pregnant, four months, five!  She lets out a deep, contented moan as your last deposit stretches her waist out another inch and turns her belly button into an outie.' );
		} else {
			EngineCore.outputText( 'You knock the wind out of Kath as your cock explodes inside her anus.  This is not some lightweight supply of sperm, just enough to ensure reproduction.  No, this is a magic fueled tidal wave of cum and it has nowhere to go but in.  Kath’s hands try to pry yours off her hips, but your whole body has locked up, seized with the effort of forcing out such an unnatural volume of cum.\n\n' );
			EngineCore.outputText( 'Her hands get weaker and you can feel the skin of her hips stretching out as her body tries to provide her belly with more.  As the last of your cum is forced inside her she looks positively pregnant.  ' );
			if( CoC.getInstance().player.cor < 25 ) {
				EngineCore.outputText( 'You hope you aren’t doing any permanent damage with such a big load.' );
			} else if( CoC.getInstance().player.cor < 75 ) {
				EngineCore.outputText( 'You hope Kath is enjoying this as much as you are.' );
			} else {
				EngineCore.outputText( 'Secretly you try to force even more sperm from your ' + (CoC.getInstance().player.balls > 0 ? 'heavy balls' : 'monstrous prostate') + '.  You want to see just how far you can stretch out your cat ' + CoC.getInstance().scenes.katherine.catGirl( 'girl', 'morph' ) + '’s belly.  Even more, you want to see if you can get her addicted to the feeling of being overfilled.' );
			}
			EngineCore.outputText( '\n\nKath whimpers at being so completely filled, but her tail is wagging.  You’re pretty sure she’s enjoying herself - and if not, well she can’t do anything about it anyway.' );
		}
		EngineCore.outputText( '\n\nUrta stops moving for a second and takes Katherine’s chin in her hand.  “<i>I see ' + CoC.getInstance().player.short + ' has already cum.  You like it when [he] cums inside you?</i>”  She puts a hand against Kath’s belly and rubs it.  “<i>You like all that warm spunk inside you?</i>”\n\n' );
		EngineCore.outputText( 'Kath nods her head slowly.  It’s almost like she’s under Urta’s spell.\n\n' );
		EngineCore.outputText( '“<i>Don’t worry, cutie.  I’m really close to giving you a big present of my own.</i>”  Urta doesn’t wait for any kind of response.  She just grabs Kath’s hips and starts to ram deeper, harder and faster than before.  Inside Kath you can feel your cum sloshing around, probably frothing as Urta does whatever it takes to blow her load.\n\n' );
		EngineCore.outputText( 'Kath has already cum twice and been filled once.  You have to hold her shoulders to keep her from falling over.  Urta just keeps on fucking like Kath is a big feline onahole.  You can see it in Urta’s eyes - she’s so horny and so drunk that nothing but cumming matters right now.\n\n' );
		EngineCore.outputText( 'At last Urta plants her cock as deep as possible.  You’re sure the tip must be ' + (CoC.getInstance().scenes.katherine.pregSize() > 0 ? 'pressed against Kath’s cervix' : 'inside Kath’s womb') + '.  Urta tilts her head back and cries out.  You can feel the heat from her balls and inside Kath your cock can sense the increasing pressure.\n\n' );
		EngineCore.outputText( 'Luckily for Kath, Urta is off balance.  She falls back towards the floor, her vice-like grip on Kath’s hips dragging her down with Urta.  Your cock gets pulled free and your load begins to spill from Katherine’s ass at the same time Urta begins to inject her own.\n\n' );
		if( CoC.getInstance().player.cumQ() < 500 ) {
			EngineCore.outputText( 'You see dribbles of your sperm leak down Kath’s legs while Urta’s much larger deposit forces its way into Kath’s cunt.  It doesn’t take long before ' + (CoC.getInstance().scenes.katherine.pregSize() > 0 ? 'the puddle of spunk below them starts to grow' : 'Kath looks like she’s with child') + '.\n\n' );
		} else if( CoC.getInstance().player.cumQ() < 1500 ) {
			EngineCore.outputText( 'With each contraction of Urta’s balls a stream of your cum gushes from Kath’s gaping asshole.  Everything you forced in is now forced back out as Urta’s load fills Katherine’s ' + (CoC.getInstance().scenes.katherine.pregSize() > 0 ? 'vagina and then begins to squirt onto the ground below' : 'womb, stretching her belly a little more than you did and making it look like Kath’s ready to deliver') + '.\n\n' );
		} else if( CoC.getInstance().player.cumQ() < 3000 ) {
			EngineCore.outputText( 'A fountain of cum bursts from Kath’s gaping asshole.  Everything you forced in is now forced back out as Urta’s load fills Katherine’s ' + (CoC.getInstance().scenes.katherine.pregSize() > 0 ? 'vagina and then begins to squirt onto the ground below.  Soon the whole floor is coated in cum.  Some yours, some Kath’s, some Urta’s and all slick' : 'womb, making it look like she’s ready to deliver twins') + '.\n\n' );
		} else {
			EngineCore.outputText( 'Your cum erupts from Katherine’s ass like a geyser.  You’re a little bit proud, both of the amount you produced and the fact your favorite kitty managed to hold it all.  But Urta’s balls aren’t waiting.  They pump their own contribution deep inside Kath’s pussy, keeping her belly fully inflated.\n\n' );
			EngineCore.outputText( (CoC.getInstance().scenes.katherine.pregSize() > 0 ? 'The load soon' : 'When her belly is big enough to hold a centaur filly the load') + ' starts to leak out, coating the whole floor in cum.  Some yours, some Kath’s, some Urta’s and all slick.\n\n' );
		}
		CoC.getInstance().scenes.katherine.katherineAndUrtaHadSex( true );
		EngineCore.outputText( 'Urta and Kath both start giggling and Urta starts patting Kath’s belly.  When she sees that you’re still standing Urta traps your feet with her legs and pulls you down into the sticky pile.\n\n' );
		if( CoC.getInstance().flags[ kFLAGS.KATHERINE_URTA_AFFECTION ] === 1 ) {
			{ //First time they’ve ever had sex together
			}
			EngineCore.outputText( '“<i>Wow!</i>” they both say at the same time.  Then they look at each other and laugh like they’ve gone crazy.\n\n' );
			EngineCore.outputText( 'Urta kisses you and says, “<i>I don’t know if I should have... but that was fun.</i>”\n\n' );
			EngineCore.outputText( '“<i>Fun and filling,</i>” says Kath, and they both have another round of drunken giggling.  You take turns rubbing their ears while Kath’s belly deflates.  You make sure to whisper that you might like to do this again sometime.  Both girls are far too tired to argue.' );
		} else if( CoC.getInstance().flags[ kFLAGS.KATHERINE_URTA_AFFECTION ] < 11 ) {
			EngineCore.outputText( 'Urta gives you a big wet kiss and says, “<i>You must really like seeing me fill your friend.' + (CoC.getInstance().flags[ kFLAGS.URTA_FERTILE ] === 1 ? '  Better be careful, I might just knock her up.' : '') + '</i>”\n\n' );
			EngineCore.outputText( 'Rather than answering her you give them both a little scratch behind the ears and then collect your clothes.  You leave your lovers in a puddle of their own spunk, telling them to ‘get to know each other better’.' );
		} else if( CoC.getInstance().flags[ kFLAGS.KATHERINE_URTA_AFFECTION ] < 32 ) {
			{ //Willing to have sober sex
			}
			EngineCore.outputText( 'Kath hugs Urta and then you.  She says, “<i>Don’t worry.  Once we feel better we’ll clean this place up.  Oh, and thanks again for getting me to fuck your foxy girlfriend.</i>”\n\n' );
			EngineCore.outputText( '“<i>Mmmm yes.  I’m always ready to cum inside a hot kitty like you,</i>” says Urta.  “<i>You know ' + CoC.getInstance().player.short + ', you don’t <b>have</b> to get us wasted.  Kath and I are always willing to fuck.</i>”\n\n' );
			EngineCore.outputText( 'You get a dreamy “<i>Yeah</i>” from Kath before she curls up in Urta’s arms and falls asleep.' );
		} else {
			{ //Lovers
			}
			EngineCore.outputText( 'Urta hugs both of you against her body and kisses each of you in turn.  “<i>You two... what would I do without you?  I can still remember the days when I just sat in the bar drinking.  Now I’m spoilt for choice.</i>”\n\n' );
			EngineCore.outputText( 'Kath sniffs and says, “<i>Yeah, before you found me I never got any love.  Now I have to take breaks cause my pussy gets sore.</i>”  She snuggles up to you and Urta and you’re pretty sure she falls asleep right away, secure in the arms of her lovers.' );
		}
		CoC.getInstance().player.orgasm();
		CoC.getInstance().scenes.katherine.orgasm();
		CoC.getInstance().scenes.katherine.katherineAndUrtaHadSex( true );
		CoC.getInstance().flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ]++;
		CoC.getInstance().flags[ kFLAGS.URTA_TIME_SINCE_LAST_CAME ] = 2 + Utils.rand( 2 );
		CoC.getInstance().scenes.urta.urtaLove( 1 );
		if( CoC.getInstance().time.hours >= 13 ) {
			CoC.getInstance().flags[ kFLAGS.KATHERINE_LOCATION ] = CoC.getInstance().scenes.katherine.KLOC_URTAS_APT; //Katherine.timeChange will sort out whether Kath actually stays with Urta
		}
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	KatherineThreesome.prototype.doubleStuffVala = function() { //Not available if Kath has no cock
		this.valaCommonStart();
		EngineCore.outputText( 'When Katherine finally rips off her bra you push her back onto an old table that’s sitting in the corner.  Before she has a chance to react you spin Vala around and place her on top of Kath’s thighs, her pussy close enough to feel the heat from Kath’s shaft' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + '.  The two of them look at each other' + (CoC.getInstance().flags[ kFLAGS.KATHERINE_VALA_AFFECTION ] >= 8 ? ' with lust and try to pull closer together so they can mate' : ', uncertain - but too turned on to turn back') + '.\n\n' );
		EngineCore.outputText( 'You pull apart Vala’s folds, giving her pleasure and Kath a good look.  With your other hand you stroke Kath’s ' + CoC.getInstance().scenes.katherine.cockType() + ' cock' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' and feel Vala wiggle her hips, trying to impale herself.  It’s what you want so you grip Kath’s cock' + CoC.getInstance().scenes.katherine.cockMultiple( ' tightly and guide it', 's tightly, forcing the tips together, and guide them' ) + ' into Vala’s passage.  Both girls moan as the head' + CoC.getInstance().scenes.katherine.cockMultiple( ' sinks', 's sink' ) + ' in.  Then you put your hands on Vala’s ass and push her forward.  You know from experience how elastic she can be and sure enough ' + CoC.getInstance().scenes.katherine.cockMultiple( 'Kath’s cock buries itself', 'both Kath’s cocks bury themselves' ) + ' to the hilt.\n\n' );
		EngineCore.outputText( 'Vala’s head lolls back and you give her another kiss as your hands pull apart her asscheeks.  You certainly don’t intend to miss out on this.  You press your ' );
		if( CoC.getInstance().player.cocks.length === 1 ) {
			EngineCore.outputText( 'cock against Vala’s sphincter and slowly push it inside.' );
		} else if( CoC.getInstance().player.cocks.length === 2 ) {
			EngineCore.outputText( 'twin cocks against Vala’s ass.  Her well trained sphincter relaxes completely and you get both of them inside.' );
		} else if( CoC.getInstance().player.cocks.length === 3 ) {
			EngineCore.outputText( 'triple cocks against Vala’s ass.  Her well trained sphincter relaxes completely and you manage to get all of them inside.' );
		} else {
			EngineCore.outputText( 'three largest cocks against Vala’s ass.  Her well trained sphincter relaxes completely and you manage to get all three of them inside.' );
		}
		EngineCore.outputText( '  It feels wonderful, especially since you can feel ' + CoC.getInstance().scenes.katherine.cockMultiple( 'Kath’s shaft', 'both of Kath’s shafts' ) + ' through Vala’s thin inner walls.\n\n' );
		EngineCore.outputText( 'Katherine has been holding back despite her lust, waiting for you to get your cock' + (CoC.getInstance().player.cocks.length > 1 ? 's' : '') + ' in place.  Now she attacks Vala’s pussy in a frenzy.  Vala’s velvety innards tug and squeeze your cock' + (CoC.getInstance().player.cocks.length > 1 ? 's' : '') + ' in such a wonderful way that you start thrusting as well.\n\n' );
		EngineCore.outputText( 'Between you and Kath Vala has turned into a rag doll.  Her ecstatic screams are the only proof that she loves this as much as either of you.  In fact she cums first.  Her ass starts to milk your shaft' + (CoC.getInstance().player.cocks.length > 1 ? 's' : '') + ' and you can see from the blissful expression on Kath that Vala’s pussy is giving her the same treat.\n\n' );
		EngineCore.outputText( 'You grab Vala’s slender hips and yank her down onto your cock' + (CoC.getInstance().player.cocks.length > 1 ? 's' : '') + '.  Kath’s hands slap down on top of yours and she does exactly the same thing.  Inside you feel Kath’s knot' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' inflate to full size just as the first streams of cum jet down your cock' + (CoC.getInstance().player.cocks.length > 1 ? 's' : '') + '.\n\n' );
		if( CoC.getInstance().player.cumQ() < 1500 ) {
			EngineCore.outputText( 'Your ' + (CoC.getInstance().player.balls > 0 ? 'balls have' : 'prostate has') + ' to work much harder than usual to force your cum past Katherine’s engorged knot' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + '.  It’s somewhat painful, but after a while you can feel a small pool of your seed forming in Vala’s colon.\n\n' );
			EngineCore.outputText( 'Her belly stretches out' + (CoC.getInstance().scenes.katherine.cumQ() > CoC.getInstance().player.cumQ() ? ' - more from Kath’s contribution than yours.  It\'s' : ' - it\'s') + ' incredible that Vala can hold so much.  Even on a normal woman that belly would suggest a baby on the way but on Vala it’s massive.\n\n' );
		} else {
			EngineCore.outputText( 'Despite Katherine’s engorged knot' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' your ' + (CoC.getInstance().player.balls > 0 ? 'balls are' : 'prostate is') + ' more than up to the task of filling Vala’s rear.  You have to fight against backpressure as Kath’s ' + (CoC.getInstance().scenes.katherine.hasBalls() ? 'balls fight' : 'prostate fights') + ' you for the right to fill the faerie waitress.\n\n' );
			EngineCore.outputText( 'You could say that both of you win and Vala loses.  Her belly stretches more than you thought possible.  By the end she looks like she’s carrying a centaur filly.\n\n' );
		}
		EngineCore.outputText( '“<i>Oh yes,</i>” Vala says weakly, “<i>it feels so good.</i>”  She rests her hand on her wobbling belly and rubs her protruding belly button.  “<i>I feel so close to both of you,</i>” she says, looking dreamily over her shoulder.\n\n' );
		this.valaCommonPostSex( CoC.getInstance().scenes.katherine.hasCock() );
		EngineCore.outputText( 'She’s right, of course.  You get dressed and only pause before leaving to take a mental picture of Vala cuddling against Katherine, belly still swollen, your cum dripping from her ass.' );
		CoC.getInstance().player.orgasm();
		CoC.getInstance().scenes.katherine.orgasm();
		CoC.getInstance().scenes.katherine.katherineAndValaHadSex();
		CoC.getInstance().flags[ kFLAGS.VALA_TIMES_CONSENSUAL_SEX ]++;
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	KatherineThreesome.prototype.eatOutVala = function() { //Not available if Kath has no cock
		this.valaCommonStart();
		EngineCore.outputText( 'You pull Vala into your arms and then walk her backwards, toward Kath.  Vala doesn’t notice what you’re doing and Kath backs up into a wall.  You keep moving and press Vala against Kath.  Neither of them have anywhere to go and you feel the tip' + CoC.getInstance().scenes.katherine.cockMultiple( ' of Kath’s cock', 's of Kath’s cocks' ) + ' poking out from between Vala’s legs.\n\n' );
		EngineCore.outputText( 'Perfect!  You give each of them a kiss and then grab Vala’s ass with both hands, lifting her off the ground and spreading her cheeks as far apart as you can manage.  You tell Kath to line her ' + CoC.getInstance().scenes.katherine.cockMultiple( '', 'twin ' ) + CoC.getInstance().scenes.katherine.cockType() + ' member' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' up with Vala’s ass but it’s Vala who reacts first.  With the speed and agility you’d expect from a faerie she takes Kath’s cock' + CoC.getInstance().scenes.katherine.cockMultiple( ', spreads some pre over the shaft and lines it', 's, spreads some pre over the shafts and and lines them' ) + ' up with her butt.\n\n' );
		EngineCore.outputText( 'You lower her and Vala sighs as Kath’s rod' + CoC.getInstance().scenes.katherine.cockMultiple( ' rams', 's ram' ) + ' home.  You take Katherine’s hands and place them on Vala’s tiny waist, telling Kath to give her a good hard fucking, Vala can take it.\n\n' );
		EngineCore.outputText( 'Vala squirms and locks her legs behind Kath.  She starts to beg, “<i>Yes, fill me, use me!  Give me all you’ve got!</i>”  You wait for them to develop a rhythm and then you bend down, sinking your tongue into Vala’s empty pussy.  She cries out as you lap up her sweet nectar.\n\n' );
		EngineCore.outputText( 'When Vala starts to cum you back off, letting her body twist and turn under the effects of her orgasm.  You stand and take Katherine by the shoulders, leading her toward a table.  She’s concentrating so hard on fucking Vala that she just goes along with whatever you want.\n\n' );
		EngineCore.outputText( 'They reach the table and you push them forward.  If you didn’t know how tough Vala is you’d worry that Kath was going to crush her.  Instead you hear moans from beneath the cat ' + CoC.getInstance().scenes.katherine.catGirl( 'girl', 'morph' ) + ' as Vala continues to cum.\n\n' );
		EngineCore.outputText( 'But it’s not Vala you’re interested in.  Instead you stick your tongue into Kath’s pussy, which has been ignored until now.  You find it ripe, her juices dripping out and trailing down her thighs.  Kath is ready for harvest and you’re happy to oblige.\n\n' );
		EngineCore.outputText( 'As you run your tongue across her clit you feel a surge of heat in the knot' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ' just above your head.  Kath slams into Vala and her ' + (CoC.getInstance().scenes.katherine.hasBalls() ? 'balls go' : 'prostate goes') + ' to work, injecting a salty filling into Vala’s ass.  Both of them are lifted away from the table as Vala’s belly grows larger and larger.\n\n' );
		EngineCore.outputText( 'The first to recover is Vala, who says, “<i>that feels so good.</i>”  She rests her hand on her wobbling belly and rubs her protruding belly button.' );
		this.valaCommonPostSex( CoC.getInstance().scenes.katherine.hasCock() );
		EngineCore.outputText( 'Kath flips over so that she’s lying on her back with Vala sitting upright on top of her.  Vala smiles at you and mouths, “<i>thank you,</i>” before collapsing herself, causing an “<i>Oof</i>” from Katherine.  You leave your lovers to it and step out into the bar, only remembering at the last second to wipe their fluids from your chin.' );
		EngineCore.dynStats( 'lus', 10 + CoC.getInstance().player.lib / 20 );
		CoC.getInstance().scenes.katherine.orgasm();
		CoC.getInstance().scenes.katherine.katherineAndValaHadSex();
		CoC.getInstance().flags[ kFLAGS.VALA_TIMES_CONSENSUAL_SEX ]++;
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	KatherineThreesome.prototype.fistKathAndVala = function() {
		this.valaCommonStart();
		EngineCore.outputText( 'You tell Vala to sit down and give you a second.  She pulls out a stool that looks like it has seen better days and sits down, her legs spread wide and her fingers on her nipples to keep the juices flowing.\n\n' );
		EngineCore.outputText( 'Next you deal with the horny kitty.  You get behind Kath and wrap your arms around her naked body, teasing her nipples and putting on a show.  Vala lets out an appreciative, “<i>Mmmm, yeah,</i>” as she watches you bring Kath\'s lust to the boil.  When Kath melts into your arms, giving up any hope of control, you drag her to another battered chair and plop her down.\n\n' );
		EngineCore.outputText( 'You grab Vala\'s seat and drag both it and the lightweight faerie closer, so that she and Kath are sitting side by side.  In their state proximity is enough; the two girls lean in and lock lips.  You wait for them to become distracted by their dueling tongues, then you simultaneously slide your fingers between their hot, wet labia.  Slowly, gently, you slip in more and more fingers on each hand, managing to get everything but your thumbs in before their heads pull apart.\n\n' );
		EngineCore.outputText( '“<i>' + CoC.getInstance().player.short + '?</i>” Vala asks, “<i>aren\'t you going to... to... oh!</i>”  You never learn what she was trying to say.  Your talented fingers keep her busy until Kath decides she\'s tired of waiting.  She grabs Vala\'s head and pulls her in for another kiss.\n\n' );
		EngineCore.outputText( 'Vala gets back to kissing but her hands find Katherine\'s tail.  It\'s been flicking back and forth, sometimes coiling itself around Vala\'s waist, but now the faerie starts using her delicate fingers to tease the tip.  Kath groans and ' + (CoC.getInstance().scenes.katherine.hasCock() ? 'her ignored manhood jiggles in time with her heartbeat' : 'her whole body shakes from the unexpected stimulation') + '.\n\n' );
		EngineCore.outputText( 'Since Vala isn\'t playing fair Kath slides her hands across the faerie\'s sensitive nipples, then reaches around Vala and begins to massage the muscles near the roots of her wings.\n\n' );
		EngineCore.outputText( 'With both girls doing all they can to drive the other mad their pussies are becoming totally drenched.  You think they\'re loose enough, so you bend your fingers and thumbs and push your palm inside each of them.  Their flesh yields just enough and when the girls break their kiss again they look down to see you\'ve worked your hands in up to your wrists.\n\n' );
		EngineCore.outputText( '“<i>Gently,</i>” begs Kath, but you\'re having none of it.  You know what these girls like and you twist your fists back and forth within them, your knuckles sliding past their sensitive nerves.  They stop arguing and throw back their heads.  Only Kath\'s death grip around Vala prevents them both from falling off their chairs.\n\n' );
		EngineCore.outputText( 'Vala releases Kath\'s tail and hugs her back, lost in ecstasy.  You get quite a show as Kath and Vala play with each other\'s bodies, but you concentrate most on the feelings from the digits you\'ve crammed inside them.\n\n' );
		EngineCore.outputText( 'You map out their favorite spots and wait until you belive they\'re both on the edge of cumming.  Then you hit all the good spots one after the other and are rewarded as two pussies clamp down on your fists.  The girls jerk and shake as one orgasm after another slams through their bodies.' );
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( '  Kath\'s cock' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + ', which you\'ve ignored this whole time, ' + CoC.getInstance().scenes.katherine.cockMultiple( 'springs to life and blasts', 'spring to life and blast' ) + ' you and the surrounding area with a hefty load of spooge.' );
		}
		EngineCore.outputText( '\n\nAfter some gasping and panting both girls find the power of speech and thank you profusely for the ride you just took them on.' );
		EngineCore.outputText( 'Vala gets a mischevious gleam in her eye.  ' );
		this.valaCommonPostSex( false );
		EngineCore.outputText( 'After you extract your hands and clean yourself off you notice Kath has pulled Vala into her lap and is just holding her.  Vala smiles at you like all is right with the world and you give each of them a kiss before leaving.' );
		EngineCore.dynStats( 'lus', 10 + CoC.getInstance().player.lib / 20 );
		CoC.getInstance().scenes.katherine.orgasm();
		CoC.getInstance().scenes.katherine.katherineAndValaHadSex();
		CoC.getInstance().flags[ kFLAGS.VALA_TIMES_CONSENSUAL_SEX ]++;
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	KatherineThreesome.prototype.valaCommonStart = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You put your arms around both of them and cop a feel.  From Kath you get a pleased purr and from Vala a contented sigh.  You tell them both that you’ve got an idea and lead them toward the back of the bar.\n\n' );
		EngineCore.outputText( 'As soon as you lock the door you decide to concentrate on Vala.  Pinching her nipples and kissing her deeply gets her in the mood awfully quickly.  Looks like she wasn’t just bored but horny too.\n\n' );
		EngineCore.outputText( 'You turn, expecting ' + (CoC.getInstance().flags[ kFLAGS.KATHERINE_VALA_AFFECTION ] > 5 ? 'Kath to have readied herself.  Sure enough' : 'to have to convince Kath of what you want.  Instead') + ' you find her part way through stripping her clothes off.' );
		if( CoC.getInstance().scenes.katherine.hasCock() ) {
			EngineCore.outputText( '  Her cock' + CoC.getInstance().scenes.katherine.cockMultiple( ' is hard enough that it\'s', 's are hard enough that they\'re' ) + ' jutting out horizontally.' );
		}
		EngineCore.outputText( '\n\n' );
	};
	KatherineThreesome.prototype.valaCommonPostSex = function( theyWereFucking ) { //This bit happens in all three Vala sex scenes
		if( CoC.getInstance().flags[ kFLAGS.KATHERINE_VALA_TIMES_SEX ] === 0 ) {
			EngineCore.outputText( 'She looks back at Kath and says, “<i>Oh - I’m Vala, by the way.</i>”\n\n' );
			EngineCore.outputText( 'Kath’s jaw drops and she stammers, “<i>Hi, I’m Kath, Katherine.  I’m sorry, I don’t usually do stuff like this.</i>”\n\n' );
			if( theyWereFucking ) {
				EngineCore.outputText( 'Vala giggles and puts Kath’s hand on her belly before replying, “<i>You mean like knotting a girl and filling her belly with your seed without even knowing her name?</i>”\n\n' );
				EngineCore.outputText( 'Kath looks totally embarrassed until Vala reaches down and rubs the base of Kath\'s knot' + CoC.getInstance().scenes.katherine.cockMultiple( '', 's' ) + '.  ' );
			}
			EngineCore.outputText( 'She gives Kath a kiss and says, “<i>I don’t do this kind of thing either.  Lets just keep this our little secret, huh?</i>”' );
		} else {
			EngineCore.outputText( 'She gives you and then Kath kisses in turn ' + (theyWereFucking ? 'before patting her massive belly and saying' : 'and says') + ', “<i>This was a lot of fun and I hope it isn’t a one time kind of thing.' + (theyWereFucking ? '  I love feeling full like this.' : '') + '</i>”' );
		}
		EngineCore.outputText( '\n\nKath sighs and rubs Vala’s ' + (theyWereFucking ? 'belly' : 'chest') + '.  She’s so relaxed that she looks half-asleep.  “<i>Mmmm - ' + CoC.getInstance().scenes.katherine.playerText() + (theyWereFucking ? '... I think we’re going to be here together for a while.  Maybe' : '... maybe') + ' you should get going and check up on that portal of yours.  We’ll deal with the mess.</i>”\n\n' );
	};
	CoC.getInstance().registerScene( 'katherineThreesome', new KatherineThreesome() );
} );