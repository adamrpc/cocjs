'use strict';

angular.module( 'cocjs' ).run( function( MainView, SceneLib, CoC, Utils, StatusAffects, EngineCore, AppearanceDefs, FetishCultist, Descriptors, kFLAGS, Combat, CockTypesEnum ) {
	function FetishCultistScene() {
	}

	/*
	 (first draft)
	 Appearance: A large human female who's wearing what looks like a depraved religious outfit while chanting what sounds like random sentences, her outfit sometimes changes into something else, seemingly at random, but only for a short time.  Whatever intelligence she used to have is obviously long gone.
	 Habitat: Could be anywhere, but the lake seems best from the current options.
	 Attacks: Can raise the opponent's lust by posing in outfits that they find attractive; raise her own lust by 'thinking'; or transfer half of her current lust to her opponent via magic.
	 Raped by grabs the player character and their clothing shifts into a submissive costume (with a design that allows them to be raped without taking the outfit off), and then she shifts to one that dominates that one.  She then acts the part of her costume and rapes the player character, without removing the outfits.  The player character's clothes remain unchanged afterwards.  Examples: student and teacher, soldier and officer, or nurse and doctor.  The chosen pairing depends on the gender and structure of the player character, and lots of different scenes could be added.
	 Rape: The cultist's outfit shifts into that of something submissive and helpless and acts the part, but she clearly enjoys what is done to her.
	 Loot: Could drop a random set of clothing or a costume on death.
	 */
	FetishCultistScene.prototype.fetishCultistEncounter = function() {
		MainView.outputText( 'You see a largely human-looking young woman in the distance in a strange, whorish outfit, seemingly lost in prayers that sound like nonsense to you.  Finally noticing your presence, she confronts you with a lewd smile on her face.\n\nShe has clearly lost her grasp on sanity, and filled the void with pure perversion.', true );
		Combat.startCombat( new FetishCultist() );
		EngineCore.spriteSelect( 19 );
		EngineCore.doNext( MainView, MainView.playerMenu );
	};
	FetishCultistScene.prototype.cultistRapesYou = function() {
		CoC.monster.lust = 1;
		CoC.monster.HP = 10;
		var changed = false;
		var changedCock = false;
		var changedBoobs = false;
		var sexed = false;
		MainView.outputText( 'The thoughts of fetishes have become so strong that they override everything else.  You see the cultist moving towards you, but you can\'t possibly fight any more.  She reaches out and touches you, and you fall to the ground as the multitudes of thoughts cascade into one.\n\n', false );
		//ZOOKEEPER RAEPS.  WEIRDOZ
		if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR || CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_NAGA ) {
			//Special centaur version by Astronomy
			if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR && CoC.player.balls > 0 && CoC.player.totalCocks() > 0 && Utils.rand( 4 ) < 3 ) {
				if( CoC.player.cocks[ 0 ].cockType === CockTypesEnum.HORSE ) {
					MainView.outputText( 'The entrance door to the stables swings open. Standing there is the familiar sight of your favorite zookeeper.  She\'s wearing overalls and a plain, dirt marked t-shirt, but you notice the overalls have the familiar logo of the zoo – your home.  You can make out a part of the logo says  "Featsy\'s Slutty Beast Zoo - Zoo Keeper" on it. As she walks into the stables, you see she\'s carrying a small stool with her, a sight that fills you with anticipation. You watch her walk down the aisle in between all the stable stands, glancing between all the zoo\'s pet centaurs, yourself included.  Most of them are male and you can even see the odd herm going by her big pair of tits and large set of balls with a dangling cock. The zookeeper smiles lustfully as she looks from side to side at the different centaurs available. As she slowly walks towards you, you can\'t help but hope that she\'ll choose you for today\'s \'treatment\'.  To your immense delight, you see that the girl has stopped in front of you.  You try to move but the ropes holding you in place arrest your movement.  The omnipresent weight of your cock as it dangles between your legs grows heavier and heavier as your body remembers the zookeeper.  The girl steps into your stand, closing the door behind her.  As you look at her, you can see her face is blushing red, and her eyes are clearly fixated on your ' + Descriptors.cockDescript( 0 ) + ' and ' + Descriptors.ballsDescriptLight() + '.\n\n', false );
					MainView.outputText( 'As she stands there, she sets her stool down beside her. With a hungry grin, she snaps the buttons to her overalls off and lets them fall down around her feet, revealing her cunt. She grips the bottom of her t-shirt and pulls it up and off of her, tossing it to the side. You can see she\'s got a big pair of tits, roughly DD-cup you guess. You feel confused as she walks up to you and starts to stroke her hands along your torso, feeling the shape of your \'human\' upper body with her fingers. You know what she\'s planning and whicker excitedly, eager for her to get on with it. The girl leans her head into your torso and kisses the skin gently, her tongue slipping beyond her lips to taste your skin. You gasp in surprise as you feel the warm tickle of her tongue on your ' + CoC.player.skinDesc + '. Your ' + Descriptors.cockDescript( 0 ) + ' twitches beneath you, surging with blood as it fills to full erectness.  She kisses you again, licking her tongue over more of your body this time. You gasp again, her touches and kisses arousing you as you feel a light sweat break out over your skin. Seeing the beads of moisture beginning to drip from you, she hungrily licks across your skin, tasting you as she closes her eyes and sighs with joy.  An animalistic hunger grows from your crotch as your ' + Descriptors.cockDescript( 0 ) + ' gradually throbs, growing harder and harder. The zoo-keeper presses herself right up against you, her breasts squishing against your skin as she rubs herself over you, clearly getting more and more aroused herself at the feel of your bestial body.\n\n', false );
					MainView.outputText( 'After a few minutes of kissing, licking, and feeling you up, the girl steps back, licking her lips as her own skin drips with sweat. She turns around and grabs the stool she brought with her. Walking up along your side, she slides it under your lower body. Your tail swishes around in excitement as your mind drifts into thoughts of sex, caving in to memories of your training sessions with this woman and your ' + Descriptors.cockDescript( 0 ) + '\'s nigh-constant desire for her cunt.  Just when you think the girl is going to finally fuck you, you find that she has something else entirely in mind.  You moan loudly as you feel her tongue lick across your ' + Descriptors.sackDescript() + ', licking and kissing at the skin as she gently strokes your fully erect cock with her fingertips. You can feel your shaft twitching up against your underbelly, slapping loudly as her fingers tease your sensitive member.  Sticky pre spurts from the tip as it flares repeatedly, desperate for release. You gasp in hot surprise as you feel her suck one of your testicles into her mouth, drooling on it, licking her tongue all over it while her eyes close.  She moans lustfully around it before changing to the other, taking it into her mouth and drooling all over it.  The zoo-keeper licks and sucks, her fingers coaxing more of your pre to drip out from your ' + Descriptors.cockDescript( 0 ) + ' onto the floor.\n\n', false );
					MainView.outputText( 'Just as you think the teasing of her fingers is getting to be too much, she suddenly stops. You take the chance to catch your breath, panting lewdly in your stall. Gasping, you sigh and try to calm yourself down to little avail. You grunt obscenely as you feel something grip your cock and start to pump, but you can\'t tell what is stroking you, as it doesn\'t feel like hands.  It dawns on your dimwitted, animalistic mind when you feel the girl\'s hands reach up and knead your balls. She\'s using her feet! You grunt, moan, and gasp in pleasure, shocked by how pleasurable her feet feel. The silky, soft skin teases and stimulates you in ways that hands can\'t compare to, particularly with how her toes grip tightly as they curl around, massaging you.  You twitch and writhe, your hooves stamping up and down reflexively as the girl foot-fucks your horse-cock and massages your balls. Your pleasure builds higher and higher as you can feel a familiar pressure building within your testicles.  They start to twitch and tense up as orgasm nears. Though you can\'t see it, the girl smiles and grins underneath you, her face flushed red as she gets off on her favorite fetish and watches all the pre drip from the tip of your ' + Descriptors.cockDescript( 0 ) + '.  Her feet slip all over your skin, the sweat on your shaft, letting her slip and slide them with ease over the sensitive flesh of your ' + Descriptors.cockDescript( 0 ) + ', teasing you as you until you\'re flaring and practically squirting out pre-cum.\n\n', false );
					MainView.outputText( 'With a cry that sounds more like a neigh than anything else, your ' + Descriptors.cockDescript( 0 ) + ' explodes, squirting horse-cum as you feel the girl\'s feet slip and slide all over the entire length of your shaft.  The zoo-keeper rubs her feet over the end of it, teasing it with her toes, allowing them to become coated in your musky animal-seed.  It drips down her legs, drooling over her sopping wet pussy.  She moans excitedly as her fingers dart from your balls down to her pussy. She fingers herself as her feet keep fucking your cock, making more of your cum leak and drip down to her cunt.  White-glazed fingers forcibly shovel the beast-cum inside her hungry pussy, and you can actually hear the wet squelches as she forces it inside. It doesn\'t take long before she screams in orgasm, her pussy squirting juices all over the floor. Some of it even sprays up and splashes your cock, setting off a second orgasm that forces glop after glop of your centaur seed to spurts onto the floor into a huge puddle.\n\n', false );
					MainView.outputText( 'As the girl regains her senses, she sighs and licks her lips, then gets up off the stool. With a grin, she watches your cock soften and hang limp in front of her.  The zoo-keeper gets off the stool and pushes it aside. With an eager moan, she kneels into the puddle of horse cum and pussy-juices, clearly loving the feeling of the hot and sticky seed on her skin.  She opens her mouth and sucks the ' + CoC.player.cockHead() + ' of your ' + Descriptors.cockDescript( 0 ) + ', inside, hungrily sucking up any stray sperm, swallowing down all she can drink from your shaft.  The taste obviously arouses her again as she rubs her fingers in the puddle of seed she\'s so happily sitting in. She sucks your cock-head for what seems like ages, gulping down anything she can milk your ' + Descriptors.ballsDescriptLight() + '. Eventually, the girl calms down as she rubs your cum over her body and tits.  She sits there in the puddle of sexual fluids, happily allowing your cock slip out of her mouth with a POP.  It hangs limply over her shoulder while she sighs as she closes her eyes, her mouth coated in her drool and cum.  You gasp and slump in your harness as your exhausted body loses its grip on consciousness, your last memory the taste of your bridle and the feel of your harness binding you as your keeper readies you for the next show...\n\n', false );
					//make sure the PC is properly dressed after such a scene
					if( CoC.player.armorValue === 0 ) {
						CoC.player.modArmorName = 'bridle bit and saddle set';
					}
					//Check for bad-end start!
					if( CoC.player.inte <= 10 ) {
						this.cultistBadEnd();
					}//(ending after all cultist rape scenes)
					else {
						MainView.outputText( 'A few hours later your mind finally returns to reality.  You look around, but can see no sign of the cultist that you saw earlier.  ', false );
						if( CoC.player.armorValue > 0 ) {
							MainView.outputText( 'You find your ' + CoC.player.armorName + ' back on your body with no sign of the strange clothes you were wearing before.  ', false );
						} else {
							MainView.outputText( 'You are still wearing the ' + CoC.player.armorName + ' that she gave you, and there is no sign of your old clothes.  ', false );
						}
						MainView.outputText( 'The ordeal has also left you with a slightly dulled mind, and some of the desire you felt still lingers.', false );
						CoC.player.orgasm();
						EngineCore.dynStats( 'int', -2 );
						EngineCore.dynStats( 'lus', 10 );
						Combat.cleanupAfterCombat();
					}
					return;
				}
			}
			//common opening to all animal forms
			MainView.outputText( 'You look up and find that you\'re behind a set of bars.  You panic for a moment before hearing someone whistling and turn towards the source of the sound, a feeling of dread falling over you as you recognize the tune.  The zoo keeper turns the corner; she is a busty girl wearing a tiny brown tube top with a name tag that says "Featsy\'s Slutty Beast Stables - Stable-Mistress".  She has a similarly colored brown cap, and a belt around her otherwise bare waist and long legs.  She is spinning a keyring around her finger while whistling her tune.  She stops at your cell and turns to look at you with a smile on her face, catching the keys in her hand.\n\n', false );
			//Centaur
			if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
				//The scene for centaurs, greetings
				MainView.outputText( '"<i>Well horsey, ready to entertain the guests?  Opening time is in twenty minutes.</i>"  You shudder and look around for a moment. You\'re inside a square cell fifteen feet across, with a large, durable bed flat in a corner, and a feeding trough on the other side.  It\'s where you entertain your guests, and your keepers.  You are now wearing a saddle, with a bridle and bit.  You shake your head and fidget around on your four legs for a moment, trying to figure out what\'s going on; but you\'re unable to comprehend anything but what you are seeing around you and the thoughts that would be suitable are those of an exotic sex slave.\n\n', false );
				//It's time to bend down for, you're too high up to lick her right now
				MainView.outputText( 'The sound of the door to your cell being unlocked brings you out of your reverie and you remember why you were so worried before; your keeper has come to <i>play</i> with you before you start working.  The magic glyphs around the cell activate, keeping you from doing anything but whimper slightly as she steps inside with a sick grin on her face and calmly tells you "<i>Now ', false );
				//is that centaur worthy of being called mighty, or is he/she a mini?
				if( CoC.player.tallness > 72 ) {
					MainView.outputText( 'mighty', false );
				} else if( CoC.player.tallness < 60 ) {
					MainView.outputText( 'mini', false );
				}
				MainView.outputText( ' centaur, it\'s time to see if you\'re ready to pleasure our guests today.  Bend down and put that tongue of yours where it belongs.</i>" while indicating her bare pussy.\n\n', false );
				MainView.outputText( 'You feel a slight warning-tingle from the arcane runes around you and steady yourself before spreading your front legs and leaning your whole body forward.  ', false );
				//if the player is over 7 feet, they have to bend over quite far
				if( CoC.player.tallness > 84 ) {
					MainView.outputText( 'Even when your human part is even with your horse body, you\'re still over her head.  You shudder as your keeper grins at you and says "<i>Keep going.</i>" while running her finger around inside her slutty hole.  You sigh and continue to lean your body further down, until your head is only a few feet from the ground.  A mighty beast like yourself was never meant to be bent down like this.\n\n', false );
				}
				//between 4.5-7 feet, they don't have to bend quite so far
				else if( CoC.player.tallness > 54 ) {
					MainView.outputText( 'You feel so humiliated, being forced to bend your centaur body to a lowly human like this.  "<i>Don\'t stop now, you only have a little farther to go before you get to where you belong.</i>" she tells you while giving her slutty hole a little caress once you\'re horizontal.  You take a steadying breath and push yourself to be on level with it.\n\n', false );
				}
				//if they are under 4.5 feet, they hardly have to bend over at all
				else {
					MainView.outputText( 'Thanks to your very short stature, you don\'t have to bend all that far before your face is parallel with her slutty hole.  "<i>Now that\'s a good little pony.</i>" your keeper says to you while patting your head.  The sneer in her voice is not lost on you though.\n\n', false );
				}
				//Start licking loser
				MainView.outputText( '"<i>Alright now, you slutty horse,</i>" she says as she removes your mouth bit, "<i>it\'s time to put your tongue to the only use it\'s good for.</i>"  She puts her hands on either side of your head and roughly forces your ' + CoC.player.face() + ' between her legs, stopping you from seeing anything, but the feel and smell of her warm, dripping sex is overpowering.  You open your mouth and, just as you\'ve been trained to do and have done countless times before, you start to lick her needy snatch.  "<i>Oh, good horsey,</i>" she moans as she starts to ride your face, "<i>this is what you were meant to do!</i>"\n\n', false );
				//she likes to ride you, doesn't she?
				MainView.outputText( 'You can\'t do anything but continue to lick and probe her folds while she continues to push you deeper inside her.  At the same time, she pushes herself up onto you more and more, so that her weight pushes your ' + CoC.player.face() + ' deeper into her slobbering depths.  In moments, your keeper is creaming herself all over your face while you simultaneously achieve your own release.  She dismounts from your face and walks back outside the cage, whistling that same tune again while you keep your head bent in shame from having gotten a release from doing something like that; again!  "<i>Don\'t look so sad, horsey, soon more will be here to avail themselves of the pleasures you have to offer.</i>" your keeper says to you with that same, sick grin on her face again before she locks the cage and walks away.\n\n', false );
				//make sure the PC is properly dressed after such a scene
				if( CoC.player.armorValue === 0 ) {
					CoC.player.modArmorName = 'bridle bit and saddle set';
				}
				//Check for bad-end start!
				if( CoC.player.inte <= 10 ) {
					this.cultistBadEnd();
				}//(ending after all cultist rape scenes)
				else {
					MainView.outputText( 'A few hours later your mind finally returns to reality.  You look around, but can see no sign of the cultist that you saw earlier.  ', false );
					if( CoC.player.armorValue > 0 ) {
						MainView.outputText( 'You find your ' + CoC.player.armorName + ' back on your body with no sign of the strange clothes you were wearing before.  ', false );
					} else {
						MainView.outputText( 'You are still wearing the ' + CoC.player.armorName + ' that she gave you, and there is no sign of your old clothes.  ', false );
					}
					MainView.outputText( 'The ordeal has also left you with a slightly dulled mind, and some of the desire you felt still lingers.', false );
					CoC.player.orgasm();
					EngineCore.dynStats( 'int', -2 );
					EngineCore.dynStats( 'lus', 10 );
					Combat.cleanupAfterCombat();
				}
				return;
			}
			//Naga
			else if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_NAGA ) {
				//The scene for naga's getting their tails raped, start with the greetings
				MainView.outputText( '"<i>Slick serpent, are you ready to entertain our guests?  Opening time is in 20 minutes.</i>" You shudder and look around for a moment; you\'re inside a square cell fifteen feet across, with a pile of multi-colored pillows in the middle of the cell and a few hot stones on the sides of the room.  It\'s where you entertain your guests, and your keepers.  You shake your head and steady your headdress while fiddling with the multitudes of necklaces you\'re wearing. You keep trying to figure out what\'s going on; but you\'re unable to comprehend anything but what you are seeing around you, and the thoughts that would be suitable are those of an exotic sex slave...\n\n', false );
				//step inside and hold on for dear life
				MainView.outputText( 'The sound of the door to your cell being unlocked brings you out of your reverie and you remember why you were so worried before; your keeper has come to <i>play</i> with you before you start working.  The magic glyphs around the cell activate, keeping you from doing anything but whimper slightly as she steps inside with a sick grin on her face and calmly tells you "<i>Okay, smooth mover, get up against the wall so I can play with my favorite toy.</i>"  You sigh and back the human part of your mixed body against the wall, leaving the tip of your tail on the pillows; you know what she wants.  "<i>Now that\'s a good snake, you\'d better hold on.</i>" the irony of her words is not lost on you as you feel shackles shoot out from the walls and grab your arms, forcing you to be spread eagle.\n\n', false );
				//Now lets see that girl use your tail for her pleasure.
				MainView.outputText( 'With a cute ah, your keeper plops herself down on the pile of pillows, spreading her legs wide so you can clearly see her wet and ready sex pot.  You can\'t help but feel aroused at the sight, ', false );
				//how does the PC show their arousal?
				//no naughty bits
				if( CoC.player.gender === 0 ) {
					MainView.outputText( 'but there is nothing you can do but wait.\n\n', false );
				}
				//boy's surprise
				else if( CoC.player.gender === 1 ) {
					MainView.outputText( 'and to your shame, you feel ', false );
					if( CoC.player.totalCocks() > 1 ) {
						MainView.outputText( 'each of ', false );
					}
					MainView.outputText( 'your ' + Descriptors.multiCockDescriptLight() + ' poke out of your pelvic slit, growing to full erectness.  You strain against your bonds, desperate to bring release to ', false );
					if( CoC.player.totalCocks() > 1 ) {
						MainView.outputText( 'each of ', false );
					}
					MainView.outputText( 'your ' + Descriptors.multiCockDescriptLight() + ', but there is nothing you can do and you keeper laughs at you.  "<i>Oh so eager to bury that eager cock of yours inside my snatch?  Too bad, I\'m the one who gets to choose what goes in there, and it\'s not your cock.</i>" she says to you, clearly enjoying the frustration you\'re going through.\n\n', false );
				}
				//girl's surprise
				else if( CoC.player.gender === 2 ) {
					MainView.outputText( 'and to your shame, you feel your pelvic slit open up to reveal your ' + Descriptors.vaginaDescript( 0 ) + ', already wet from the sight.  You pull against your bonds a little, hoping to find some way to get some release from your arousal.  "<i>Sorry girly, that slit of yours isn\'t supposed to be filled now,</i>" she says, before pointing at her cunt, "<i>this one is.</i>"  She is clearly enjoying the frustration you\'re going through.\n\n', false );
				}
				//herm's frustrations
				else {
					MainView.outputText( 'and with a shudder you feel your pelvic slit open up so that your ' + Descriptors.vaginaDescript( 0 ) + ' is exposed and ', false );
					if( CoC.player.totalCocks() > 1 ) {
						MainView.outputText( 'each of ', false );
					}
					MainView.outputText( 'your ' + Descriptors.multiCockDescriptLight() + ' can thrust up into the air.  You make a few futile thrusts into the air, desperate to find some way to get release from your mixed genitals.  "<i>Hmm, sorry snakey, but I can\'t pick one of those to play with, maybe if you had only one...</i>" she says to you with a snark, but you know she is lying and is clearly enjoying your frustration.\n\n', false );
				}
				MainView.outputText( '"<i>Now what was I going to fill this needy hole with?</i>" she says, tapping her chin before looking down at the tip of your tail and spreading her arms in mock wonder.  "<i>There we go, this is perfect!</i>" she exclaims before grabbing your tail and pulling on it roughly, stretching your body out uncomfortably before she guides the tip into her waiting snatch.  She sighs and looks up at you before saying "<i>Now THAT\'S a sex toy!</i>" before starting to spin your tail around her depths and pistoning her body back and forth on it.\n\n', false );
				MainView.outputText( 'The feeling of her fluids running all over your tail is such an exotic and arousing feeling, as per usual, but it only leaves you feeling more frustrated that you can\'t get proper release.  Thankfully for you, you don\'t have to wait long for the release to come; as you feel your keeper spray the proof of her release onto your tail, you finally feel your own release.  You can only hang your head in shame from having gotten a release from being used like that, again!  "<i>Don\'t look so bad snaky, the customers like to see someone high and mighty before they come in here and beat you into the ground.</i>" You don\'t bother looking back up at her as she locks the cage and your restraints finally release you.\n\n', false );
				//put them in the right attire after seeing this
				if( CoC.player.armorValue === 0 ) {
					CoC.player.modArmorName = 'headdress, necklaces, and many body-chains';
				}
				//Check for bad-end start!
				if( CoC.player.inte <= 10 ) {
					this.cultistBadEnd();
				}//(ending after all cultist rape scenes)
				else {
					MainView.outputText( 'A few hours later your mind finally returns to reality.  You look around, but can see no sign of the cultist that you saw earlier.  ', false );
					if( CoC.player.armorValue > 0 ) {
						MainView.outputText( 'You find your ' + CoC.player.armorName + ' back on your body with no sign of the strange clothes you were wearing before.  ', false );
					} else {
						MainView.outputText( 'You are still wearing the ' + CoC.player.armorName + ' that she gave you, and there is no sign of your old clothes.  ', false );
					}
					MainView.outputText( 'The ordeal has also left you with a slightly dulled mind, and some of the desire you felt still lingers.', false );
					CoC.player.orgasm();
					EngineCore.dynStats( 'int', -2 );
					EngineCore.dynStats( 'lus', 10 );
					Combat.cleanupAfterCombat();
				}
				return;
			}
		}
		//Nurse raeeeepp
		//if(CoC.monster.armorName === 'naughty nurse\'s uniform' && !sexed) {
		if( Utils.rand( 2 ) === 0 && !sexed ) {
			MainView.outputText( 'You stand up and look over at the cultist. She is now wearing a nurse\'s uniform with bared breasts.  You notice that your ' + CoC.player.armorName + ' changed into a bizarre cross between a patient\'s gown and a collection of black straps with buckles.  While tight in some places, it doesn\'t hinder your movement or hide your more sexual parts at all.', false );
			if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
				MainView.outputText( '  It also dawns to your fogged mind that you now have a human-looking lower body, though your sexual organs are unchanged.', false );
				if( CoC.player.cockTotal() > 0 ) {
					MainView.outputText( '  As you see your ' + Descriptors.multiCockDescriptLight() + ', \'incredibly large\' is the only qualifier you can think of.', false );
				}
			}
			MainView.outputText( '\n\n', false );
			if( CoC.player.armorValue === 0 ) {
				CoC.player.modArmorName = 'bondage patient clothes';
			}
			MainView.outputText( '"<i>Um, ', false );
			if( CoC.player.gender <= 1 ) {
				MainView.outputText( 'sir', false );
			} else {
				MainView.outputText( 'madam', false );
			}
			//GET STRAPPED DAOOOOWN
			MainView.outputText( ' you aren\'t supposed to be out of bed yet,</i>" she says to you.  You\'re almost certain that you are in a hospital room, and the nurse is looking in from the doorway with a cart next to her.  You look over at the bed and a wave of panic washes over you as you see a collection of straps, clearly designed to keep someone restrained there, and you even notice a ball gag on the pillow.  Unable to comprehend anything but what you see in this room, you try to flee, only to be stopped by the nurse.  She pushes you back into the room and tells you that you have to calm down.  Her words have the opposite effect on you and you only feel more panicked.  You start to wrestle with her to get out, but your strength quickly ebbs away, leaving you almost completely helpless before the nurse.  She manages to get you over to the hospital bed, where she pushes you down onto your back and begins strapping you in place, using both the restraints on the bed and some of the ones on your own outfit.  She even gags you with the ball gag before checking every strap to be certain they are secure.  Once the nurse finishes, she straightens up and says to you with a smile, "<i>It\'s okay, you\'re safe now.  Nothing bad will happen to you while I\'m here.</i>" For some reason, her words seem to make the restraints feel safe and comfortable, and you are finally able to calm down.\n\n', false );
			//Five possible variants based on body
			//(1 - if player has nipplecunts)
			if( CoC.player.hasFuckableNipples() ) {
				MainView.outputText( 'Still smiling, the nurse looks closely at your ' + Descriptors.nippleDescript( 0 ) + ' and says, "<i>I see... they really are interesting.  Sorry about tying you down like that.  I know experiments like this can be a little scary, but just remember that you are helping others by agreeing to do this.</i>"  She leaves the room for a moment and comes back with a pair of syringes.  "<i>I hope you are as ready for this as I am,</i>" she says with a look of glee on her face as she climbs on top of you.  She then sticks the syringes into her own nipples simultaneously and injects their contents inside her.  Quivering slightly she sets the empty syringes aside before she starts rubbing her breasts feverishly.  A moment later she stops and pulls her hands away to reveal that her nipples have grown quite long, about four inches from the tops of her mounds.  With a sigh, she lowers herself toward you and pushes her elongated nipples into your ' + Descriptors.nippleDescript( 0 ) + 's.  You feel your breasts seem to eagerly pull the tips inside and begin sucking on the nurse\'s dick-like nipples.  You feel a fluid start to come out of the nurse\'s nipples directly into your own, and the two of you begin moaning in ecstasy.  After a few minutes of your ' + Descriptors.nippleDescript( 0 ) + 's draining the nurse\'s long nipples, you feel them pull out of you.  With a sigh of contentment, the nurse pulls back to reveal that her nipples have returned to normal.  She then puts her hands on your ' + CoC.player.allBreastsDescript() + ' and starts to massage them, occasionally poking her fingers inside.  You find that they feel fuller and healthier than ever, and ', false );
				//[if breasts are not lactating]
				if( CoC.player.biggestLactation() < 1 ) {
					MainView.outputText( 'they have even started to lactate.  ', false );
					CoC.player.boostLactation( 1.5 );
				}
				//[if breasts are already lactating]
				else {
					MainView.outputText( 'they are producing more milk than before.  ', false );
					CoC.player.boostLactation( 0.6 );
				}
				MainView.outputText( 'Satisfied, the nurse rises from you and says, "<i>Wow!  I really hope I get a chance to do that again sometime, but for now I\'ve got to go take care of another patient.  Don\'t do anything too exciting until I get back, all right?  I\'ll check on you again as soon as I\'m able!</i>"  She gives you a wink, and turns to walk out the door.', false );
				EngineCore.dynStats( 'sen', 3 );
				changed = true;
				changedBoobs = true;
			}
			//(2 - if player has a dick)
			if( CoC.player.cocks.length > 0 && !changed ) {
				MainView.outputText( 'The smile disappears from her lips and she says, "<i>Now if I understand it correctly, you are beset by random panic attacks due to unnaturally low levels of cum production.  To address this issue, I will be giving you a special injection at the site.</i>"' );
				MainView.outputText( '\n\nShe briefly steps out of the room before returning with a syringe.  "<i>It\'ll be ok, the good news is that the pain for this injection will quickly subside, just take nice easy breaths and you\'ll be fine.  In fact, you might find this quite enjoyable after the first hurdle.  I\'ll even get to have some fun after.</i>"  Smiling again, she takes hold of your ' + Descriptors.cockDescript( 0 ) + ' and pushes the needle into the base of it.  The nurse starts humming a pleasant tune, while you try to cry out in pain into the gag and struggle against the bindings.  However, they prove to be quite secure, and you can\'t do anything about the pain you feel spreading throughout your ' + Descriptors.multiCockDescriptLight() + '.  Thankfully, it doesn\'t take very long before the nurse pulls the needle out and, to your immense relief, the pain quickly subsides.' );
				MainView.outputText( '\n\nThe nurse stops humming before setting the syringe aside and climbs on top of your legs. She giggles softly before lowering herself and taking your ' + Descriptors.cockDescript( 0 ) + ' between her breasts and starts rubbing and playing with them while running your ' + Descriptors.cockDescript( 0 ) + ' up and down between them.  It is an exquisite experience having her tit fuck you, and you notice that she seems to be enjoying it just as much as you are.  It doesn\'t take long for her ministrations to make you cum between her breasts, and cum you do.  You cum and cum and cum, much more than you usually would.  Satisfied, the nurse rises from you and says, "<i>That should do it, in the future you won\'t produce as much cum when you orgasm as you just did, but you should be producing at a more natural level.  For now, I\'ve got to go take care of another patient. Don\'t you do anymore running about until I get back, ok?  I\'ll be back to check on your progress as soon as I\'m able!</i>"  She gives you a wink, and turns to walk out the door.', false );
				CoC.player.cumMultiplier += 2;
				EngineCore.dynStats( 'sen', 3 );
				changed = true;
				changedCock = true;
			}
			//(3 - if player has regular breasts)
			if( CoC.player.biggestTitSize() > 1 && !changed ) {
				MainView.outputText( 'The smile disappears from her lips and she says, \'Now if I understand it correctly, you are beset by random panic attacks due to unnaturally low levels of lactation.  To address this issue, I will be giving you a special injection at the site.\'  She briefly steps out of the room before returning with a syringe.  \'It\'ll be ok, the good news is that the pain for this injection will quickly subside, just take nice easy breaths and you\'ll be fine.  In fact, you might find this quite enjoyable after the first hurdle.\'  She steps over to you and carefully pushes the syringe into your first breast.  You feel a sharp pain from the needle going in, but after a moment you start to feel a glowing pleasure spread throughout your breast.  ', false );
				//[if player only has one row of breasts]
				if( CoC.player.breastRows.length === 1 ) {
					MainView.outputText( 'Once about half of the fluid has been injected into your first breast, she moves on to the other and you feel a similar sharp pain followed by the glowing pleasure.  ', false );
				}
				//[if the player has two rows of breasts]
				if( CoC.player.breastRows.length === 2 ) {
					MainView.outputText( 'Once about a quarter of the fluid has been injected into the first breast, she moves on to the second and you feel a similar sharp pain followed by the glowing pleasure.  She continues this until all of your ' + CoC.player.allBreastsDescript() + ' have been injected.  ', false );
				}
				//[if the player has three rows of breasts]
				if( CoC.player.breastRows.length > 2 ) {
					MainView.outputText( 'Once about a sixth of the fluid has been injected into the first breast, she moves on to the second and you feel a similar sharp pain followed by the glowing pleasure.  She continues this until all of your ' + CoC.player.allBreastsDescript() + ' have been injected.  ', false );
				}
				MainView.outputText( 'Soon the glowing pleasure fills your breasts completely and you feel an orgasm shoot through your body as your ' + CoC.player.allBreastsDescript(), false );
				//[if breasts are already lactating]
				if( CoC.player.biggestLactation() >= 1 ) {
					MainView.outputText( ' start lactating even more.  ', false );
				}//[if breasts are not lactating]
				else {
					MainView.outputText( ' start lactating.  ', false );
				}
				MainView.outputText( 'Nodding approvingly, the nurse says  "<i>Good, for now I\'ve got to go take care of another patient. Don\'t you do anymore running about until I get back, ok?</i>" as she turns away and goes out the door.', false );
				CoC.player.boostLactation( 1.5 );
				changed = true;
				EngineCore.dynStats( 'sen', 3 );
				changedBoobs = true;
			}
			//(4 - if player has only a vagina and no breasts)
			if( CoC.player.vaginas.length > 0 && !changed ) {
				MainView.outputText( 'The smile disappears from her lips and she says, \'Now if I understand it correctly, you are beset by random panic attacks due to an unusually sized clitoris, coupled with a lack of breasts.  To address this issue, I will be giving you a special injection at the site.\'  She briefly steps out of the room before returning with a syringe.  \'It\'ll be ok, the good news is that the pain for this injection will quickly subside, just take nice easy breaths and you\'ll be fine.  In fact, you might find this quite enjoyable after the first hurdle.\'  She leans down and pushes the needle into your clitoris.  The pain is quite intense, but thankfully it does not last long.  \'This injection will address your unnatural body shape by turning your clitoris into a penis. It even has the added benefit of removing the unneeded vagina.\' she says to you in a pleasant voice while pulling the needle out.  You look down to see that you ' + Descriptors.clitDescript() + ' is indeed growing larger, and you can feel your womb disappearing within you.\n\n', false );
				CoC.player.knockUpForce(); //The only event I can find anywhere that removes a pregnancy
				CoC.player.createCock();
				CoC.player.removeVagina( 0, 1 );
				MainView.outputText( 'Soon you have a fully formed ' + Descriptors.cockDescript( 0 ) + ' standing tall and proud where your old femininity used to lie.  The nurse sets the syringe aside and climbs on top of your legs. She giggles softly before lowering herself and taking your ' + Descriptors.cockDescript( 0 ) + ' between her breasts and starts rubbing and playing with them while running your ' + Descriptors.cockDescript( 0 ) + ' between them.  It is an exquisite experience having her tit fuck your brand new ' + Descriptors.cockDescript( 0 ) + ', and you notice that she seems to be enjoying it just as much as you are.  It doesn\'t take long for her ministrations to make you cum between her breasts, and cum you do.  Satisfied, the nurse rises from you and says "<i>Looks to me like its working properly.  For now, I\'ve got to go take care of another patient. Don\'t you do anymore running about until I get back, ok?  I\'ll be back to check on your progress as soon as I\'m able!</i>"  She gives you a wink, and turns to walk out the door.', false );
				EngineCore.dynStats( 'sen', 3 );
				changed = true;
				CoC.player.genderCheck();
				changedCock = true;
			}
			//(5 - if player has no genitals)
			if( CoC.player.gender === 0 && !changed ) {
				MainView.outputText( 'The smile disappears from her lips and she says, \'Now if I understand it correctly, you are beset by random panic attacks due to a lack of genitals.\'  To address this issue, I will be giving you a special injection at the site.\'  She briefly steps out of the room before returning with a syringe.  \'It\'ll be ok, the good news is that the pain for this injection will quickly subside, just take nice easy breaths and you\'ll be fine.  In fact, you might find this quite enjoyable after the first hurdle.\'  She leans down and pushes the needle into your crotch.  The pain is quite intense, but thankfully it does not last long.  \'This injection will address your unnatural body shape by giving you a penis,\' she says to you, smiling while pulling the needle out, \'and then, I get to be the first to play with it!\'.  You look down to see that the flesh where she injected you is pushing out of your body, becoming larger and more defined as the seconds tick by.\n\n', false );
				CoC.player.createCock();
				MainView.outputText( 'Soon you have a fully formed ' + Descriptors.cockDescript( 0 ) + ' standing tall and proud where your bare crotch used to lie.  The nurse sets the syringe aside and climbs on top of your legs. She giggles softly before lowering herself and taking your ' + Descriptors.cockDescript( 0 ) + ' between her breasts and starts rubbing and playing with them while running your ' + Descriptors.cockDescript( 0 ) + ' between them.  It is an exquisite experience having her tit fuck your brand new ' + Descriptors.cockDescript( 0 ) + ', and you notice that she seems to be enjoying it just as much as you are.  It doesn\'t take long for her ministrations to make you cum between her breasts, and cum you do.  Satisfied, the nurse rises from you and says "<i>That was fun, maybe later we can practice more.  For now, I\'ve got to go take care of another patient. Don\'t you do anymore running about until I get back, ok?  I\'ll be back to check on your progress as soon as I\'m able!</i>"  She gives you a wink, and turns to walk out the door.', false );
				EngineCore.dynStats( 'sen', 3 );
				changed = true;
				CoC.player.genderCheck();
				changedCock = true;
			}
			//Check for bad-end start!
			if( CoC.player.inte <= 10 ) {
				this.cultistBadEnd();
			}//(ending after all cultist rape scenes)
			else {
				MainView.outputText( '\n\nA few hours pass by and your mind finally returns to reality.  You look around, but can see no sign of the cultist that you saw earlier.  ', false );
				if( CoC.player.armorValue > 0 ) {
					MainView.outputText( 'You find your ' + CoC.player.armorName + ' back on your body with no sign of the strange clothes you were wearing before.  ', false );
				} else {
					MainView.outputText( 'You are still wearing the ' + CoC.player.armorName + ' that she gave you, and there is no sign of your old clothes.  ', false );
				}
				MainView.outputText( 'The ordeal has also left you with a slightly dulled mind, and some of the desire you felt still lingers.  ', false );
				CoC.player.orgasm();
				EngineCore.dynStats( 'int', -2 );
				EngineCore.dynStats( 'lus', 10 );
				Combat.cleanupAfterCombat();
				if( changedBoobs ) {
					MainView.outputText( '\n\nYou notice that the changes you experienced to your breasts while in the fantasy are still affecting you.', false );
				}
				if( changedCock ) {
					MainView.outputText( '\n\nYou notice that the changes you experienced to your genitals while in the fantasy are still affecting you.', false );
				}
			}
		} else if( !sexed ) {
			//.Mistress and servant rape
			MainView.outputText( 'Her outfit shifts into that of a noble woman, and she looks down at you.', false );
			if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
				MainView.outputText( '  It dawns to your fogged mind that you now have a human-looking lower body, though your sexual organs are unchanged.', false );
				if( CoC.player.cockTotal() > 0 ) {
					MainView.outputText( '  As you see your ' + Descriptors.multiCockDescriptLight() + ', \'incredibly large\' is the only qualifier you can think of.', false );
				}
			}
			MainView.outputText( '\n\n', false );
			//(variant 3: special toy, requires both dick and vagina)
			if( CoC.player.vaginas.length > 0 && CoC.player.cocks.length > 0 ) {
				MainView.outputText( 'You see your ' + CoC.player.armorName + ' becoming a nice, comfortable outfit of a white shirt and black pants that make you look well-suited to work in a manor... if they didn\'t have an exposed crotch and butt that puts your ' + Descriptors.multiCockDescriptLight() + ', your ' + Descriptors.vaginaDescript( 0 ) + ', and your ' + Descriptors.buttDescript() + ' on full display.  Any undergarments you had are now gone.\n\n', false );
				if( CoC.player.armorValue === 0 ) {
					CoC.player.modArmorName = 'crotch-revealing clothes';
				}
				MainView.outputText( '"<i>Toy, I am feeling aroused,</i>" she says to you in an authoritative voice. "<i>I want you to please me.</i>"\n\n', false );
				MainView.outputText( '"<i>Yes, mistress,</i>" you reply without hesitation, your thoughts unable to comprehend anything besides this \'game\'.  You could swear that you were in the sitting room of a manor.  "<i>How do you wish to be pleased?</i>"\n\n', false );
				MainView.outputText( '"<i>I\'m glad to see you remember your place.  I wish you to first rub my feet, then move up my legs, and finally, start relieving the tension in my lower lips with your capable hands.</i>"\n\n', false );
				MainView.outputText( 'Eager to please your mistress, now reclining on a lovely chair, you crawl to her, remove her shoes, and start to massage her feet.  Your hands seem to move with the will of some outside force and they expertly work to please your mistress.  Pushed on by her approving groans, you work your way up her legs, removing clothing as you go, until you reach her hips.  There, to your mistress\' great delight, you run your hands over her hips and butt, and then start to rub her lower lips and clit.\n\n', false );
				MainView.outputText( 'After a minute of this, she stops you and says, "<i>Good; I am now ready to have you inside of me, toy.  Lie down and start fingering your ' + Descriptors.vaginaDescript( 0 ) + ' while I use the ' + Descriptors.multiCockDescriptLight() + ' that I keep you here for.</i>"\n\n', false );
				MainView.outputText( 'With your hands slightly trembling in anticipation, you lie down and grab at your very erect ' + Descriptors.multiCockDescriptLight() + ' just before you slip your fingers into your ' + Descriptors.vaginaDescript( 0 ) + ', ready to please your mistress the best way you can.  You watch your mistress rise off her chair and slowly lower herself onto your ' + Descriptors.cockDescript( 0 ) + ', moaning in pleasure.  Her interior is so familiar and so wonderful.  You increase the pace that your fingers plunge into your depths, moaning in the way you know your mistress loves. She starts to rock back and forth, your ' + Descriptors.cockDescript( 0 ) + ' bringing her to the height of ecstasy. ', false );
				//[if player has 2 dicks]
				if( CoC.player.cocks.length === 2 ) {
					MainView.outputText( 'Your ' + Descriptors.cockDescript( 1 ) + ' rubs against her skin pleasantly.  ', false );
				}
				//[if player has more than 2 dicks]
				if( CoC.player.cocks.length > 2 ) {
					MainView.outputText( 'The rest of your ' + Descriptors.multiCockDescriptLight() + ' rubs against her skin pleasantly.  ', false );
				}
				MainView.outputText( 'Thanks to your extended foreplay, your mistress quickly comes to a climax that reverberates through both your bodies, causing you to release yourself into your mistress and cover your fingers with your other fluids.', false );
				//[if player has multiple dicks]
				if( CoC.player.cocks.length > 1 ) {
					MainView.outputText( '  You take special care to make sure that the rest of your cum does not get on your mistress in any way.', false );
				}
				MainView.outputText( '\n\nSatisfied, your mistress rises off of you and dresses.  She tells you that she is going for a walk, and that you should continue your duties now.  ', false );
			} else {
				//(variant 1: servant boy, requires dick)
				if( CoC.player.cocks.length > 0 && (CoC.player.vaginas.length === 0 || Utils.rand( 2 ) === 0) ) {
					MainView.outputText( '  You see that your ' + CoC.player.armorName + ' have become a nice looking, if simple, frilled white shirt and bow tie along with black pants and matching shoes.  They make you look like you would be at home in a manor attending the needs of a noble, if it were not for the flaps on the front and back of your pants that give easy access to your ' + Descriptors.multiCockDescriptLight(), false );
					if( CoC.player.vaginas.length ) {
						MainView.outputText( ', your ' + Descriptors.vaginaDescript( 0 ) + ',', false );
					}
					MainView.outputText( ' and your ' + Descriptors.buttDescript() + '.  Any undergarments you had are now gone.\n\n', false );
					if( CoC.player.armorValue === 0 ) {
						CoC.player.modArmorName = 'cute servant\'s clothes';
					}
					MainView.outputText( '"Boy, I am feeling aroused." she says to you in an authoritative voice. "I want you to please me."\n\n', false );
					MainView.outputText( '"Yes, mistress." you reply without hesitation, your thoughts unable to comprehend anything besides this "game". You could swear that you were in the sitting room of a manor.  "How do you wish to be pleased?"\n\n', false );
					MainView.outputText( '"I\'m glad to see you remember your place.  I wish you to first rub my feet, then move up my legs, and finally, start relieving the tension in my lower lips with your capable hands."\n\n', false );
					MainView.outputText( 'Eager to please your mistress, now reclining on a lovely chair, you crawl to her, remove her shoes, and start to massage her feet.  Your hands seem to move with the will of some outside force and they expertly work to please your mistress.  Pushed on by her approving groans, you work your way up her legs, removing clothing as you go, until you reach her hips.  There, to your mistress\' great delight, you run your hands over her hips, butt, and then start to rub her hips, lower lips, and clit.\n\n', false );
					MainView.outputText( 'After a minute of this, she stops you and says, "Good, I am now ready to have you inside of me boy.  Show me your ' + Descriptors.multiCockDescriptLight() + ' that I keep you here for."\n\n', false );
					MainView.outputText( 'With a cry of joy you lift the front flap on your pants revealing your very erect ' + Descriptors.multiCockDescriptLight() + ' and lie on the ground ready to please your mistress the best way you can.  You watch your mistress rise off her chair and slowly lower herself onto your ' + Descriptors.cockDescript( 0 ) + ' moaning in pleasure.  Her interior is so familiar and so wonderful.  ', false );
					if( CoC.player.vaginas.length > 0 ) {
						MainView.outputText( 'You feel desire start to well up in your ' + Descriptors.vaginaDescript( 0 ) + ', but you resist the urge to act on it; that\'s not why your mistress keeps you. ', false );
					}
					MainView.outputText( 'She starts to rock back and forth, your ' + Descriptors.cockDescript( 0 ) + ' bringing her to the height of pleasure. ', false );
					if( CoC.player.cocks.length === 2 ) {
						MainView.outputText( 'Your ' + Descriptors.cockDescript( 1 ) + ' rubs against her skin pleasantly.  ', false );
					}
					if( CoC.player.cocks.length > 2 ) {
						MainView.outputText( 'The rest of your ' + Descriptors.multiCockDescriptLight() + ' rub against her skin pleasantly.  ', false );
					}
					MainView.outputText( 'Thanks to your extended foreplay, your mistress quickly comes to a climax that reverberates through both your bodies, causing you to release yourself into your mistress.  ', false );
					if( CoC.player.cocks.length > 1 ) {
						MainView.outputText( 'You take special care to make sure that the rest of your cum does not get on your mistress in any way.  ', false );
					}
					MainView.outputText( '\n\nSatisfied, your mistress rises off of you and dresses.  She tells you that she is going for a walk, and that you should continue your duties now.  ', false );
				}
				//(variant 2: maid, requires vagina)
				else if( CoC.player.vaginas.length > 0 ) {
					MainView.outputText( 'You see that your ' + CoC.player.armorName + ' have become an apron over a plain dress with high stockings and simple black shoes.  They make you look like you would be at home keeping a manor clean and tidy, if it were not for the rather short skirt and lack of undergarments that give easy access to your ' + Descriptors.vaginaDescript( 0 ), false );
					//[if player has a dick]
					if( CoC.player.cocks.length > 0 ) {
						MainView.outputText( ', your ' + Descriptors.multiCockDescriptLight() + ',', false );
					}
					MainView.outputText( ' and your ' + Descriptors.buttDescript() + '.\n\n', false );
					if( CoC.player.armorValue === 0 ) {
						CoC.player.modArmorName = 'maid\'s clothes';
					}
					MainView.outputText( '"Girl, I am feeling aroused." she says to you in an authoritative voice. \'I want you to please me.\'\n\n', false );
					MainView.outputText( '"Yes, mistress." you reply without hesitation, your thoughts unable to comprehend anything besides this \'game\'.  You could swear that you were in the sitting room of a manor.  "How do you wish to be pleased?"\n\n', false );
					MainView.outputText( '"I\'m glad to see you remember your place.  I wish you to first rub my feet, then move up my legs, and finally, start relieving the tension in my lower lips with your capable hands."\n\n', false );
					MainView.outputText( 'Eager to please your mistress, now reclining on a lovely chair, you crawl to her, remove her shoes, and start to massage her feet.  Your hands seem to move with the will of some outside force and they expertly work to please your mistress.  Pushed on by her approving groans, you work your way up her legs, removing clothing as you go, until you reach her hips.  There, to your mistress\' great delight, you run your hands over her hips, butt, and then start to rub her hips, lower lips, and clit.\n\n', false );
					MainView.outputText( 'After a minute of this, she says, "Good.  Now finger yourself before me, girl.  Show me that ' + Descriptors.vaginaDescript( 0 ) + ' that I keep you here for."\n\n', false );
					MainView.outputText( 'You lay back on the ground and raise your skirt, showing off your engorged ' + Descriptors.clitDescript() + ' and ' + Descriptors.vaginaDescript( 0 ) + '.  With a pleased squeal you plunge your fingers into your waiting ' + Descriptors.vaginaDescript( 0 ) + ' and start wriggling them around in the way that your mistress loves.  ', false );
					//[if player has a dick]
					if( CoC.player.cocks.length > 0 ) {
						MainView.outputText( 'You feel a desire rising in your erect ' + Descriptors.multiCockDescriptLight() + ' but you ignore it; that\'s not what your mistress told you to play with.  ', false );
					}
					MainView.outputText( 'Thanks to the extended foreplay, the sight of you quickly brings your mistress to climax, a climax that quickly fills you as well, causing you to cum all over your fingers.\n\n', false );
					MainView.outputText( 'Satisfied, your mistress rises and dresses,  She tells you that she is going for a walk, and that you should continue your duties now.  ', false );
				}
			}
			//(variant 4: gender-less servant, requires that you have no dick or vagina)
			if( CoC.player.gender === 0 ) {
				MainView.outputText( 'You see that your ' + CoC.player.armorName + ' have become a nice and comfortable outfit of a shirt white and black pants, that make you look well suited to work in a manor.  However, you notice that there is a flap on your pants that gives easy access to your ' + Descriptors.buttDescript() + '.\n\n', false );
				if( CoC.player.armorValue === 0 ) {
					CoC.player.modArmorName = 'servant\'s clothes';
				}
				MainView.outputText( '"Servant, I am feeling aroused." she says to you in an authoritative voice. \'I want you to please me.\'\n\n', false );
				MainView.outputText( '"Yes, mistress." you reply without hesitation, your thoughts unable to comprehend anything besides this \'game\'.  You could swear that you were in the sitting room of a manor.  "How do you wish to be pleased?"\n\n', false );
				MainView.outputText( '"I\'m glad to see you remember your place.  I wish you to first rub my feet, then move up my legs, and finally, start relieving the tension in my lower lips with your capable hands."\n\n', false );
				MainView.outputText( 'Eager to please your mistress, now reclining on a lovely chair, you crawl to her, remove her shoes, and start to massage her feet.  Your hands seem to move with the will of some outside force and they expertly work to please your mistress.  Pushed on by her approving groans, you work your way up her legs, removing clothing as you go, until you reach her hips.  There, to your mistress\' great delight, you run your hands over her butt, and then start to rub her hips, lower lips, and clit, pleasing your mistress in the best way you can.\n\n', false );
				MainView.outputText( 'After a few minute of this, your expert fingers bring your mistress\' body to a full climax.  A climax that you too feel, bringing with it the relief that only your mistress can give you.\n\n', false );
				MainView.outputText( 'Satisfied, your mistress rises and dresses.  She tells you that she is going for a walk, and that you should continue your duties now.  ', false );
			}
			//Check for bad-end start!
			if( CoC.player.inte <= 10 ) {
				this.cultistBadEnd();
			}//(ending after all cultist rape scenes)
			else {
				MainView.outputText( 'A few hours later your mind finally returns to reality.  You look around, but can see no sign of the cultist that you saw earlier.  ', false );
				if( CoC.player.armorValue > 0 ) {
					MainView.outputText( 'You find your ' + CoC.player.armorName + ' back on your body with no sign of the strange clothes you were wearing before.  ', false );
				} else {
					MainView.outputText( 'You are still wearing the ' + CoC.player.armorName + ' that she gave you, and there is no sign of your old clothes.  ', false );
				}
				MainView.outputText( 'The ordeal has also left you with a slightly dulled mind, and some of the desire you felt still lingers.', false );
				CoC.player.orgasm();
				EngineCore.dynStats( 'int', -2 );
				EngineCore.dynStats( 'lus', 10 );
				Combat.cleanupAfterCombat();
			}
		}
	};
	FetishCultistScene.prototype.playerRapesCultist = function() {
		MainView.clearOutput();
		//(nun worship version, this one looks like it will be a little shorter than the other one was, only two variations again)
		if( CoC.monster.armorName === 'pervy nun\'s clothing' ) {
			MainView.outputText( 'You see that the cultist\'s outfit has fixed on a naughty nun outfit with specially placed holes over her sexual parts.  As you get close to her, she goes down on her hands and knees and says to you, "<i>Mighty sex god, who have shown me your power; please, take my body!</i>"\n\n', false );
			if( CoC.player.cor < 40 ) {
				MainView.outputText( 'You are rather taken aback by this odd declaration, but in the end you decide the hell, I\'m horny.</i>\n\n', false );
			} else {
				MainView.outputText( 'You nod to yourself thinking right, I am a sex god.</i>\n\n', false );
			}
			MainView.outputText( 'You stride over to her and loosen your ' + CoC.player.armorName + ' and let them drop to the ground before sitting down in front of her.  "<i>Show me your affections, then maybe I\'ll be willing to take you,</i>" you tell her.  She looks over your naked body with a sort of reverence before bowing her head and saying, "<i>Of course my lord.</i>"  With that, she gets to work on you.\n\n', false );
			MainView.outputText( 'She takes one of your arms and begins kissing it, from your shoulder to your hand.  Each kiss sends a short quiver of pleasure through you, one you could swear the cultist was also feeling.  When she gets to your hands she kisses each of your fingers, then takes each one into her mouth in turn, sucking on them and licking them with passion.  Her lustful acts are intense, and you can feel yourself getting close to your peak, just from her playing with your fingers.  With a shudder from the sensations, you haltingly tell her, "<i>Good, now the other arm.</i>"  With no hesitation, she complies.  Before too long, the fingers on your other hand are being teased and cleaned by her mouth, and again you are brought to the brink.  You shakily pull your hand back and tell her that she has done enough; you are willing to take her now.\n\n', false );
			//(if player has a dick)
			if( CoC.player.cocks.length > 0 && (CoC.player.gender !== 3 || Utils.rand( 2 )) ) {
				MainView.outputText( 'She meekly leans back onto the ground and parts her legs with her hands, giving you a clear view of her needy hole through the large opening in her clothing.  "<i>My lord, please fill me!</i>" she begs you.  You stand and stride over to her.  "<i>Yes little girl, accept my divine rod', false );
				if( CoC.player.cocks.length > 1 ) {
					MainView.outputText( 's', false );
				}
				MainView.outputText( ' in your pussy,</i>" you reply.  ', false );
				if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
					MainView.outputText( 'You command her to get on all fours, then cover her and push ', false );
				} else {
					MainView.outputText( 'You grab hold of and lift her legs, then kneel down and push ', false );
				}
				if( CoC.player.cocks.length > 1 ) {
					MainView.outputText( 'the first of ', false );
				}
				MainView.outputText( 'your ', false );
				MainView.outputText( Descriptors.multiCockDescriptLight() + ' into her waiting love hole.  ', false );
				if( CoC.player.cocks.length > 1 ) {
					MainView.outputText( 'You thrust once, before using one of your hands to guide the second of your ' + Descriptors.multiCockDescriptLight() + ' inside her.  You are rather surprised at how easily she seems to accommodate your size', false );
					if( CoC.player.cocks.length > 2 ) {
						MainView.outputText( ' and decide to push the ', false );
						if( CoC.player.cocks.length === 3 ) {
							MainView.outputText( 'last', false );
						}
						if( CoC.player.cocks.length > 3 ) {
							MainView.outputText( 'rest', false );
						}
						MainView.outputText( ' in the same way.  ', false );
					} else {
						MainView.outputText( '.  ', false );
					}
				}
				MainView.outputText( 'Fully inside her, you begin to fuck her in earnest, and her eager moans soon fill the air.  Within moments the cultist climaxes unexpectedly quickly, and the feeling soon rushes through you as well, culminating in an incredibly huge orgasm that shakes your whole body. You ejaculate deep into her welcoming cunt, filling it up completely', false );
				if( CoC.player.cumQ() < 50 ) {
					MainView.outputText( '.', false );
				}
				if( CoC.player.cumQ() >= 50 && CoC.player.cumQ() < 200 ) {
					MainView.outputText( ' before streams of cum begin to run down her thighs.', false );
				}
				if( CoC.player.cumQ() >= 200 ) {
					MainView.outputText( ' before torrents of cum begin to run down her legs and onto the ground.', false );
				}
				MainView.outputText( '  You pull out and the cultist slumps onto the ground contentedly, massaging her well-fucked, cum-filled pussy.  Looking at the cultist you wonder if she was able to make you spontaneously orgasm just from having an orgasm herself, or if she has the power of a real sex god?\n\n', false );
			}
			//(if player has a vagina)
			else if( CoC.player.vaginas.length > 0 && CoC.player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
				MainView.outputText( 'She meekly lies back on the ground and spreads her legs, one slightly in the air.  You have a clear view of her needy hole through the large opening in her clothing.  "<i>My lord, please scissor me!</i>" she begs you.  You stand and stride over to her. "<i>Yes little girl, accept my divine lips on your pussy,</i>" you reply.  You grab the leg she had in the air and pull yourself between her legs, pressing your ' + Descriptors.vaginaDescript( 0 ) + ' against her own.  With a firm tug on her leg, you begin to push and rub your pussies together in earnest, and her eager moans soon fill the air.  The cultist climaxes unexpectedly quickly, and the feeling soon rushes through you as well.  You pull back and the cultist slumps onto the ground contentedly.  Looking at the cultist you wonder if she was able to make you spontaneously orgasm just from having an orgasm herself, or if she has the power of a real sex god?\n\n', false );
			}
			//Horsey
			if( CoC.player.vaginas.length > 0 && CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
				MainView.outputText( 'She meekly looks at your equine lower body, obviously unused to it, and tentatively asks if she can lick your pussy. Smiling, you present your buttocks to her and say, "<i>Yes little girl, you can pleasure my divine lips with your tongue.</i>" She happily gets to it, and you hear eager licking and sucking sounds as a warmth diffuses in your nether parts. She sure knows how to handle a cunt, and you find yourself cumming very quickly, as an incredibly huge orgasm shakes your whole body, sending girl-cum all over her face. You turn around and see the cultist with a look of utter bliss on her face, as if she\'s just been blessed.  You wonder from the quality of the orgasm she just gave you if she has the power of a real sex god.\n\n', false );
			}
			//(after either)
			MainView.outputText( 'You get dressed and notice that the cultist is still lying on the ground in the perverted nun outfit, with a look of utter bliss on her face.  ', false );
			MainView.outputText( 'Satisfied, you continue on your way.', false );
			CoC.player.orgasm();
		} else if( CoC.monster.armorName === 'swimsuit' ) {
			//(scene requires that the PC not be genderless)
			//foreplay
			MainView.outputText( 'You advance on the defeated cultist, whose outfit seems to have fixated on such a ridiculously skimpy swimming suit that she might as well be naked.  She looks up at you with a worried expression as you take a closer look at her.  The cultist slowly starts to speak, ""<i>Ah, hey there ' + CoC.player.mf( 'mister', 'miss' ) + ', what a surprise to see you here!</i>"  Embarrassed, she tries to make her incredibly revealing swimming suit somewhat less obscene while blushing furiously.  "<i>Oh mercy me, just thinking about how much of me that you can see is turning me on.</i>"  You arch an eyebrow this girl an exhibitionist?\n\n', false );
			MainView.outputText( 'You slowly ask her why, if she likes it so much, is she covering herself up?  She looks around a little nervously for a moment before pulling her hands away and giving you a good look at her body.  You see her breathing becoming more rapid.  "<i>Oh fuck yeah, look at me in this slutty outfit,</i>" she says, starting to shiver.  She giggles and does a stretch while "accidentally" getting part of her suit to slip off.  "<i>Oops, you can totally see my nipple now, can\'t you?</i>" she says breathlessly, her crotch now visibly soaked with her arousal.\n\n', false );
			//if (PC is an exhibitionist)
			if( CoC.flags[ kFLAGS.PC_FETISH ] > 0 ) {
				MainView.outputText( 'Given your experience with Ceraph, you can definitely understand why she is having so much fun showing off her body.  In fact, you think you\'ll start to do the same.', false );
			} else {
				MainView.outputText( 'You don\'t really understand what could be so arousing about showing off your body to others, but you decided you were going to rape her, so you might as well strip down now.', false );
			}
			MainView.outputText( '  At the sight of your nude body, the nearly naked woman gives another shiver.  "<i>Oh sweet cocks, you look so sexy,</i>" she says running her hands over her heaving breasts.  "<i>Please, can we fuck?</i>" she begs you.\n\n', false );
			//corruption check!
			if( CoC.player.cor < 33 ) {
				MainView.outputText( 'Well, she obviously wants this, so you guess there isn\'t anything wrong with enjoying what\'s on offer, is there?\n\n', false );
			} else if( CoC.player.cor < 66 ) {
				MainView.outputText( 'You think to yourself how awesome this is.  It isn\'t often a defeated foe is so eager.\n\n', false );
			} else {
				MainView.outputText( 'You\'re almost disappointed at how easy she is making this; but hey, a fuck is a fuck, so what do you care?\n\n', false );
			}
			//end of the foreplay
			//sex to be written here
			MainView.outputText( 'The cultist turns around, presenting her rear end to you, looking over her shoulder.  ', false );
			if( CoC.player.hasCock() ) {
				MainView.outputText( 'Her eyes lock onto your very erect maleness.  "<i>I got that thing that hard?  Oh fuck yes!</i>"  She wraps her arms around her body and rocks back and forth.  ', false );
				//if (PC has a vagina)
				if( CoC.player.hasVagina() ) {
					MainView.outputText( 'Then, she hesitates for some reason, before saying, "<i>Um, I\'m not sure why I\'m asking this since you\'ve got a good tool there already, but... I\'ve got some vibrators, if you want to play with them instead...</i>"\n\n', false );
				} else {
					MainView.outputText( '"<i>I want this so damn much!</i>"\n\n', false );
				}
			}
			//if you ain't got a cock, break out the vibrators
			else {
				MainView.outputText( '"<i>Uh, hey, I\'ve got some toys that we could play with,</i>" she says a bit nervously.  "<i>Do you want to play with some vibrators?</i>"\n\n', false );
			}
			//increase PC's lust thanks to foreplay
			EngineCore.dynStats( 'lus', 30 );
			//player chooses between; penetrate vagina, vibrator vagina, nevermind.  Options as appropriate.
			var vibe = null;
			var fuckVag = null;
			if( CoC.player.hasVagina() ) {
				vibe = this.swimsuitVibrators;
			}
			if( CoC.player.hasCock() ) {
				fuckVag = this.plugSwimsuitVag;
			}
			EngineCore.choices( 'FuckHerVag', this, fuckVag, 'Vibrator', this, vibe, '', null, null, '', null, null, 'Leave', null, Combat.cleanupAfterCombat );
			return;
		} else {
			MainView.outputText( 'You see that the cultist\'s outfit has fixed on what looks remarkably similar to a farmhand from your village.  Filled with desire, you approach her.  She cries out in fear and says "<i>Please don\'t hurt me!  Even though I knew there were bandits coming, I couldn\'t leave my mother behind.  Take whatever you want, I won\'t get in your way, but please leave us alone!</i>"\n\n', false );
			if( CoC.player.cor < 40 ) {
				MainView.outputText( 'You stop, thinking that maybe you should let her go, but she grabs your hand and gives you a look of desperation.  Deciding to finish the job, you push her to her knees and the look of fear returns to her face.  ', false );
			} else {
				MainView.outputText( 'With a wicked smile, you push her to her knees.  ', false );
			}
			//(if player has a dick)
			if( CoC.player.cocks.length > 0 && (CoC.player.gender !== 3 || Utils.rand( 2 )) ) {
				MainView.outputText( 'Telling her that she is going to please you whether she wants to or not, you reveal your ' + Descriptors.multiCockDescriptLight() + '.  She screams for help and starts struggling against your grip, but you tell her that no one is going to save her now.  Easily overpowering her, you force her to the ground with no care for her comfort and start tearing off her clothes.  Once you have a clear view of her love hole, you look back up at her face and see that she has stopped struggling and is now crying.  ', false );
				//[if not corrupted]
				if( CoC.player.cor < 40 ) {
					MainView.outputText( 'Feeling uncomfortable at this, you start to pull away, but her expression turns instantly into a look of pure horror and her body becomes completely tense.  As you move back to her, her body relaxes and her expression returns to the tear-stricken face.  Obviously this is an act and she would be far more bothered by you if you left her without finishing the job.  ', false );
				}
				MainView.outputText( 'Filled with new determination, you push your ' + Descriptors.cockDescript( 0 ) + ' into her love hole and start to rape her roughly.  Despite the tears, she starts moaning, clearly enjoying the rough treatment.  A little while into the rape, she starts to move against you, almost lovingly.  It is quite clear that she has a lot of experience, but is giving you free reign to do whatever you want.   Feeling in complete control, you decide that this game isn\'t too bad.  Before long you reach your orgasm and you blow your load deep inside her.', false );
				MainView.outputText( '\n\nYou get dressed and notice that the cultist is still lying on the ground with her farm hand outfit torn from her, with a look of utter bliss on her face.  Satisfied, you continue on your way.', false );
				CoC.player.orgasm();
			}
			//(if player has a vagina)
			else if( CoC.player.vaginas.length > 0 ) {
				MainView.outputText( 'Telling her that she is going to please you whether she wants to or not, you reveal your ' + Descriptors.vaginaDescript( 0 ) + '.  Pushing your ' + Descriptors.clitDescript() + ' to her mouth, you order her to lick you if she wants you to leave her mother alone.  ', false );
				MainView.outputText( 'She screams for help and starts struggling against your grip, but you tell her that no one is going to save her now.  You feel her tongue go in, and she hesitantly gives a lick.  You pull her head back by the hair and look into her eyes.  She is crying!  ', false );
				if( CoC.player.cor < 40 ) {
					MainView.outputText( 'Feeling uncomfortable at this, you start to pull away, but her expression turns instantly into a look of pure horror and her body becomes completely tense.  As you move back to her, her body relaxes and her expression returns to the tear stricken face.  Obviously this is an act and she would be far more bothered by you if you left her without finishing the job.  ', false );
				}
				MainView.outputText( 'With new determination, you yell at her to lick harder, and to push in as much as she can, or her mother will die.  This time when she starts licking you, she does it almost lovingly.  It is quite clear that she has a lot of experience and, regardless of her words, she obviously wants this.  Feeling in complete control, you think that this game isn\'t too bad.  Under her expert flicks, you quickly reach a climax.  You pull her head back and tell her that now she has to clean you up.  You specify that she can\'t just lick this time, she has to drink your excretions.\n\n', false );
				MainView.outputText( 'A few minutes later, you close your ' + CoC.player.armorName + ' back up, and look back at the cultist.  She is lying on the ground in her farm hand outfit with a look of utter bliss on her face.  Satisfied, you continue on your way.', false );
				CoC.player.orgasm();
			}
			if( CoC.player.gender === 0 ) {
				MainView.outputText( 'You make her rub your body down, but you don\'t really have a means to rape her.  Afterwards you do feel better, but didn\'t get any real release.  Disappointed, you continue on your way.', false );
			}
		}
		Combat.cleanupAfterCombat();
	};
	//PC goes for the vagina
	FetishCultistScene.prototype.plugSwimsuitVag = function() {
		var x = CoC.player.biggestCockIndex();
		MainView.outputText( '', true );
		if( CoC.player.hasVagina() ) {
			MainView.outputText( 'You decline the vibrators; you\'d much rather take her incredibly wet pussy.  ', false );
		} else {
			MainView.outputText( 'You tell her you\'re gonna fuck her.  ', false );
		}
		MainView.outputText( 'She nods at you and turns around shivering even harder.  You step forward and put your hands on her shoulders, then start to run them over her body, while your ' + Descriptors.multiCockDescriptLight() + ' pokes her in the back.  "<i>Oh fuck me, I need you to fuck me now!</i>" she screams.  Grinning, you push her to the ground and grip her pert, bouncing breasts.  You push her bathing suit to the side so that you have access to her waiting snatch.  You assure her that you\'ll be fucking her all right, all while you tease and play with her exposed body.\n\n', false );
		MainView.outputText( 'When you push your ' + Descriptors.cockDescript( x ) + ' inside her, she goes absolutely insane underneath you.  She squirms and wriggles all over your ' + Descriptors.cockDescript( x ) + ', as you ', false );
		if( CoC.player.cockArea( x ) < 50 ) {
			MainView.outputText( 'push further and further until you\'re all the way inside her.', false );
		} else if( CoC.player.cockArea( x ) < 200 ) {
			MainView.outputText( 'push further and further, until to your great delight, she manages to take all of your massive member without any trouble!', false );
		} else {
			MainView.outputText( 'manage to get your monster cock further and further inside her.  To your immense shock, she manages to take the whole thing, without it seeming to warp her body at all!', false );
		}
		MainView.outputText( '  Her slick interior seems to fit your shaft perfectly, and with the way she is squirming around you, you\'re getting one hell of a ride.\n\n', false );
		MainView.outputText( 'After all the foreplay, the two of you are already reaching your peaks thanks to her incredible, tight cunt and its ministrations to your member.  The cultist is screaming in pleasure, telling you to look at her, to fondle her, and to fuck her; you happily oblige her.  Her interior contracts about your ' + Descriptors.cockDescript( x ) + ' as you loose the proof of your orgasm deep inside her.', false );
		if( CoC.player.cockTotal() > 1 ) {
			MainView.outputText( '  Your remaining cock', false );
			if( CoC.player.cockTotal() === 2 ) {
				MainView.outputText( ' lets loose its load', false );
			} else {
				MainView.outputText( 's let loose their loads', false );
			}
			MainView.outputText( ' onto her back and legs, ', false );
			if( CoC.player.cumQ() < 50 ) {
				MainView.outputText( 'adding a little white decoration', false );
			} else if( CoC.player.cumQ() < 200 ) {
				MainView.outputText( 'adding a liberal coating of white to her body', false );
			} else {
				MainView.outputText( 'drenching her in your cum', false );
			}
			MainView.outputText( '.', false );
		}
		MainView.outputText( '\n\n', false );
		MainView.outputText( 'You stand up and clean yourself off, thoroughly satisfied with the encounter.  The cultist, on the other hand, collapses in a quivering pile of pleasure on the ground.', false );
		//set PC's lust to minimum
		CoC.player.orgasm();
		Combat.cleanupAfterCombat();
	};
	//PC goes for the vagina vibrators
	FetishCultistScene.prototype.swimsuitVibrators = function() {
		MainView.outputText( '', true );
		MainView.outputText( 'You suggest that you\'re interested in trying the vaginal vibrators she offered.  The cultist nods, and turns to face you holding two surprisingly large toys in her hands.  They\'re shaped like a long tube, with a small arm on the side near the handle that points towards the end.  You aren\'t sure where they came from, but you\'d guess she used the same magic that she uses to shift her clothing to get them.\n\n', false );
		if( CoC.player.vaginalCapacity() <= 30 ) {//PC does not have a very loose or looser vagina)
			//painful or not, you're going to try! (separate function)
			MainView.outputText( 'You\'re very intrigued by the presented toys, but you can\'t help but notice that they seem much bigger than what your untrained hole could reasonably take.  You share this bit of insight with the presenter, and she assures you that with the right pressure and effort, it will go in.\n\n', false );
			MainView.outputText( 'You certainly aren\'t going to be the one to saying no to some fun, so you tell the girl to get to it.  She giggles and hands you one of the massive vibrators before stepping away from you and activating her own, sensually rubbing the vibrating instrument against the small strap over her nether lips.  She gives a loud exaggerated moan from the stimulation and smiles at you lewdly.  She then uses her free hand to slip her suit to the side and pushes the oversized toy up to the arm inside her, making sure to put the arm onto her engorged clitoris, continuing to moan the whole way.\n\n', false );
			//end section
			MainView.outputText( 'The cultist lets go of the toy inside her and saunters over to you, her hips swinging, moaning the whole way.  She takes the device she handed you earlier and activates it.  "<i>Here we go!</i>" she says as ', false );
			MainView.outputText( 'she puts the vibrating toy to the entrance to your ' + Descriptors.vaginaDescript( 0 ) + '.  The next instant leaves you on your back as the cultist roughly shoves the thing inside you, forcing you to painfully stretch around the toy.', false );
			//if (PC was a virgin)
			if( CoC.player.vaginas[ 0 ].virgin ) {
				MainView.outputText( '\n\n<b>Hell of a way to lose your virginity.</b>\n\n', false );
				CoC.player.cuntChange( 50, false, false, false );
			} else {
				CoC.player.cuntChange( 50, true, true, false );
				MainView.outputText( '\n\n', false );
			}
			MainView.outputText( 'For hours you\'re left on the ground writhing in pain and pleasure from the cultist roughly forcing the false cock in and out of you while she moans with pleasure around the quivering shaft inside her.  The sensations are too much for you, and you can do nothing but just lie there and take it.  The cultist brings you to multiple orgasms before you finally pass out from the pain and overstimulation.', false );
			//increase libido, decrease sensitivity
			CoC.player.orgasm();
			EngineCore.dynStats( 'lib', 1, 'sen', -3 );
			//victory becomes a defeat, even event
			EngineCore.hideUpDown();
			CoC.monster.lust = 98;
			CoC.monster.HP = 2;
			CoC.player.lust = 100;
			CoC.flags[ kFLAGS.COMBAT_BONUS_XP_VALUE ] = CoC.monster.XP;
			Combat.cleanupAfterCombat();
			CoC.player.orgasm();
			EngineCore.dynStats( 'lib', 1, 'sen', -3 );
		}
		//It fits!
		else {
			MainView.outputText( 'You\'re quite pleased with the size of the toy, it should fit inside your "trained" vagina quite well.  You inform the cultist at your pleasure of the toys she has presented.  She nods to you vigorously and hands you one of them, then she slips the strap that blocks her waiting cunny and moves the toy to the entrance.  She smiles at you and you nod back, putting the tip of the toy she handed to you to your waiting lips as well.\n\n', false );
			MainView.outputText( 'The cultist shows you how to activate the toy and they hum to life.  Quivering slightly, the two of you push the vibrating toys deep inside of yourselves.  The feeling of the toy filling up your ' + Descriptors.vaginaDescript( 0 ) + ' is quite an experience.  ', false );
			if( CoC.player.vaginalCapacity() < 75 ) {
				MainView.outputText( 'It takes some effort to get it inside you, but is well worth the effort.', false );
			} else {
				MainView.outputText( 'It easily slips inside your well-stretched hole.', false );
			}
			MainView.outputText( '  The cultist giggles at you and then starts to moan in an exaggerated manner from the feeling of being filled.  You can\'t help but let out your own (albeit less exaggerated) moan of pleasure when the arm comes into contact with your ' + Descriptors.clitDescript() + '.  If feels so damn good having this massive false cock firmly clamped inside your ' + Descriptors.vaginaDescript( 0 ) + ' as it wriggles and jiggles around inside you, and its arm teases your clit...', false );
			CoC.player.cuntChange( 50, true, true, false );
			MainView.outputText( '\n\n', false );
			MainView.outputText( '"<i>Oh wow, you\'re totally loving this, even though you just put it inside you!</i>" the cultist squeals with glee.  "<i>Just wait, it gets better,</i>" she continues, taking a firm grip on the handle again while playing with her breasts with her free hand.  She starts to twist the toy around a bit, and then starts to pull it in and out.  You mimic her motions, wondering what might make this even better.  You soon realize just what she was getting at, and are surprised when the sensations start to make you squeal with glee as well.\n\n', false );
			MainView.outputText( 'It doesn\'t take much longer for you to let loose the proof of your orgasm onto the magically humming rod between your legs.  At the same time, you suddenly feel a cool liquid spray the inside of the furnace that is your ' + Descriptors.vaginaDescript( 0 ) + ' and the vibrator spills out of you along with ', false );
			if( CoC.player.wetness() < 3 ) {
				MainView.outputText( 'a trickle', false );
			} else if( CoC.player.wetness() <= 4 ) {
				MainView.outputText( 'a wave', false );
			} else {
				MainView.outputText( 'a torrent', false );
			}
			MainView.outputText( ' of your lady juices.  You shudder for a moment and look down at it on the ground.  It seems to have, deflated a bit?  There is a clear fluid flowing out of the top of the toy.  A thump sound brings the cultist back to your attention, but only briefly as you see she is writhing on the ground in pleasure from the toy still inside her.  You shake your head and get dressed again.', false );
			//end scene
			CoC.player.orgasm();
			EngineCore.dynStats( 'lib', 1, 'sen', -3 );
			Combat.cleanupAfterCombat();
		}
	};
	FetishCultistScene.prototype.cultistBadEnd = function() {
		//This ending is caused from having too low of inte when losing to the cultist (say under 15) or it could be after losing too many times to them.  You chose which you would prefer.
		//(after being raped, do not show regular recovery message, skip here)
		MainView.outputText( '\n\nYour mind is not able to recover from the fantasy, and instead moves on to another one, and another, and another...', false );
		EngineCore.doNext( this, this.cultistBadEnd2 );
	};
	FetishCultistScene.prototype.cultistBadEnd2 = function() {
		var genderTag = '';
		MainView.outputText( 'On a hill sits a large cathedral overlooking a river that feeds into a massive lake.  It is a surprisingly grand structure in a land almost devoid of any signs of civilization in any direction.  The design is quite clear; its entrance lined with statues of lewd naked figures and its windows are made of stain glass depicting acts of sexuality.  Even without hearing the sounds of ecstasy that usually emanate from inside, it is quite clear this is a place of debauchery.\n\n', true );
		MainView.outputText( 'Within, a ', false );
		if( CoC.player.gender === 1 ) {
			genderTag = 'man';
		}
		if( CoC.player.gender === 2 || CoC.player.gender === 3 ) {
			genderTag = 'woman';
		}
		if( CoC.player.gender === 0 ) {
			if( CoC.player.biggestTitSize() > 1 ) {
				genderTag = 'woman';
			} else {
				genderTag = 'man';
			}
		}
		MainView.outputText( genderTag + ' sits in the confessional.  It is clear this ' + genderTag + '\'s mind is devoid of conscious thoughts, but they have a clear purpose.  Feelings of anticipation and need surround this person as they open their mouth.  "<i>Holy mother,</i>" they speak to the woman sitting across from them with apprehension,"<i>I have such strange thoughts and needs, they arouse me in ways that they probably shouldn\'t.  Is there anywhere where I can find my place?</i>"\n\n"<i>It\'s quite all right.</i>" she replies.  "<i>This is a sanctuary to those who have desires that others would call strange or bizarre, we welcome any who share our needs.  All that we ask is that you be willing to share those desires with those that you find.</i>"  The other brightens and says, "<i>Of course, I would love nothing more!</i>"  The ' + CoC.player.mf( 'man', 'woman' ) + ' who was once a champion and the fetish cultist who corrupted ' + CoC.player.mf( 'him', 'her' ) + ' step out of the confessional, and soon the sounds of a massive orgy can be heard from the cathedral, as the followers of the fetish welcome their new member.\n\n', false );
		MainView.outputText( 'Your mind has fallen prey to the followers of the fetish, and you are now one yourself.  You have completely forgotten who or what you were, including why you came to this world in the first place.  Perhaps the next champion will not lose their sense of self so easily.', false );
		EngineCore.gameOver();
	};
	FetishCultistScene.prototype.fetishCultistHasAMilkFetish = function() {
		MainView.outputText( '', true );
		MainView.outputText( 'You remove your ' + CoC.player.armorName + ', standing naked in front of the beaten fetish-girl with your lactating ' + Descriptors.breastDescript( 0 ) + ' dripping milk. You pick the cultist up and sit down on the ground with her resting on your lap, her soft warm ass up against your thighs. You hold the nipple up to her mouth; she suckles on it without the slightest sign of rebellion.\n\n', false );
		MainView.outputText( 'Minutes later, the landscape around you slowly changes into a cozy cabin. There\'s a fireplace with a bear rug in front of it and you\'re on a rocking chair in the corner with the Cultist on your lap, still nursing from your breasts. She has a bonnet on with two long black pigtails falling down her milky white body. A black lacy thong is barely covering her pussy with the back string disappearing between her two pleasant cheeks. Black & white striped knee socks cover her legs. Her grateful eyes look up at you, and you notice that they have black eye-liner on that makes her hazel eyes pop like fire.\n\n', false );
		MainView.outputText( '"<i>Thank you ' + CoC.player.mf( 'Master', 'Mistress' ) + ' for letting me have some of your special milk after doing all my chores.</i>"\n\n', false );
		MainView.outputText( 'What is she talking about? ' + CoC.player.mf( 'Master', 'Mistress' ) + '? Chores? What the hell is going on? Your mind races with confusion as you try to figure out what\'s happening. The scene around you then changes back to the lake. The cultist, who looks like she normally would, sees your confusion.\n\n', false );
		MainView.outputText( '"<i>Zee merechaing ong?</i>"\n\n', false );
		MainView.outputText( 'You can\'t understand the gibberish coming out of her mouth.\n\n', false );
		MainView.outputText( '"<i>Ummmmm... no? Please return to your reward.</i>"\n\n', false );
		MainView.outputText( 'The cultist girl continues to nurse; this relaxes your mind a little and everything slowly changes back to the cozy cabin. You look around the cabin; it becomes a transparent mix with the lake whenever you concentrate on a single detail, you can make out a maid outfit thrown on the floor and two milk filled buckets on a table. Your surveying ends when the cultist begins taking deep hard suckles and circles your nipple with her tongue before lightly biting it. Her hand is playing with your other boob, wobbling and squeezing it like it was some toy.\n\n', false );
		MainView.outputText( 'Soon her thong becomes wet with arousal and her mouth comes off your ' + Descriptors.nippleDescript( 0 ) + ' to ask, "<i>Please ' + CoC.player.mf( 'Master', 'Mistress' ) + ', will you fix the aching in my loins?</i>"\n\n', false );
		MainView.outputText( 'With her moving your hand over her large wet spot, she coos this to you and goes back to her nursing. Your hand falls on top of the warm spot and more pussy juice spreads out across the cloth. You lift up your hand with strands of girlcum stretching out like a juicy spiderweb. You pull the cloth covering her pussy to the side, exposing her glistening wet sex to the cold cabin air. She lets out a humming moan of satisfaction, still teasing and playing with your teat. You slip two fingers into her moist cave with squishing sounds as you easily slide in and out. The weight of her head on your arm begins to lift up and soon you\'re able to reach around her back and grab her tits. You give them the same treatment she\'d been giving your chest and treat them like your playthings. The rocking of the chair increases as you two both go at each other, your finger fucking becoming rougher as her suckling ratchets up in intensity.  The sloppy sex causing massive amounts of saliva and milk to coat your chest and belly while pooling on her boobs and chest.\n\n', false );
		//[Cock](this goes for herms too)
		if( CoC.player.hasCock() ) {
			if( CoC.player.cockTotal() > 1 ) {
				MainView.outputText( 'Each of y', false );
			} else {
				MainView.outputText( 'Y', false );
			}
			MainView.outputText( 'our ' + Descriptors.multiCockDescriptLight() + ' becomes fully erect as it rubs up against her warm ass cheeks, which is enough to fulfill its desire.   Her cum bubbles into the palm of your hand while your cum drizzles her ass with sticky whiteness.\n\n', false );
		}
		//[ELSE Pussy]
		else if( CoC.player.hasVagina() ) {
			MainView.outputText( 'Your pussy becomes fully aroused as you continue to play with each other. Her nice, warm ass against it is enough to fulfill its desire as you feel her cum in the palm of your hand.  You get off underneath her, twitching and dripping with release.\n\n', false );
		}
		//[Genderless]
		else {
			MainView.outputText( 'Your entire body tenses up, like you\'re approaching an orgasm. The release of this tension flows through your body as she cums into the palm of your hand. You sigh with relief as the phantom orgasm lingers.\n\n', false );
		}
		MainView.outputText( 'You both keep playing with each other as you moan with ecstasy, having one orgasm after the other. You and the cultist stop after the 10th simultaneous climax, both of you soaked with milk, spit, cum, and sweat. The cultist cuddles up to you and falls asleep, smelling of sex. You sit her down on the rocking chair and make your way out of the fantasy. It\'s difficult, as if each orgasm made the fantasy more and more real to you.  You focus hard... ', false );
		//[Low Int]
		if( CoC.player.inte < 33 ) {
			MainView.outputText( 'but nothing happens. You even try to open the door of the cabin but it\'s locked. You poke around, when a brilliant idea comes to you. You place your hand in your mouth and bite down hard. The intense pain brings you back to reality.  ', false );
			//(Minus 5hp)
			CoC.player.takeDamage( 5 );
		}
		//[Med Int]
		else if( CoC.player.inte < 66 ) {
			MainView.outputText( 'your head turns red, veins bulging. The scenery very slowly turns back to the lake. You maintain your intense concentration, as even one second of slacking would pull you back into the fantasy. Eventually you\'re back in reality.  ', false );
		}
		//[High Int]
		else {
			MainView.outputText( 'and everything goes back to normal.  ', false );
		}
		MainView.outputText( 'You see the cultist is sleeping on the ground, still in the fantasy she created.', false );
		//[You have found 1xBee Honey]
		CoC.flags[ kFLAGS.FORCE_BEE_TO_PRODUCE_HONEY ] = 1;
		//set lust to 0, increase sensitivity slightly
		CoC.player.orgasm();
		EngineCore.dynStats( 'lib', 0.2 );
		//You've now been milked, reset the timer for that
		CoC.player.addStatusValue( StatusAffects.Feeder, 1, 1 );
		CoC.player.changeStatusValue( StatusAffects.Feeder, 2, 0 );
		Combat.cleanupAfterCombat();
	};
	SceneLib.registerScene( 'fetishCultistScene', new FetishCultistScene() );
} );