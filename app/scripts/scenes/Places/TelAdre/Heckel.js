'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, Appearance, CockTypesEnum, kFLAGS, Descriptors, CoC, EngineCore ) {
	function Heckel() {
	}

	//const TIMES_LOST_HECKEL_DOM_CHALLENGE:int = 650;;
	//const TIMES_DOMMED_HECKEL:int = 651;;
	/*By submitting content to Fenoxo for addition to Corruption of Champions, I agree to give up any
	 and all creative and legal control over how the characters and events from my submissions are
	 used within the confines of the game, its character viewer application, and any sequels. I retain
	 all rights to said characters and events outside of their usage in these games. I also agree that
	 Fenoxo will be a rad dude and do his damnedest not to screw me with this legalese.
	 Name: Heckel
	 Requirements to show up between 9 and 14
	 Requirements for initial sex over 60 and fat under 40. Also not a Centaur or
	 genderless, since most of it would make no sense.
	 Requirements for anal 'a little loose'
	 */
	//Intro:;
	Heckel.prototype.heckelAppearance = function() {
		if( CoC.flags[ kFLAGS.MET_HECKEL ] === 0 ) {
			EngineCore.outputText( '\n\nYou can see a brown hyena running around an indoor track, her tongue lolling out of her mouth as she runs. She spares a glance towards you before returning to her workout, her legs a blur of motion beneath her.', false );
		} else {
			EngineCore.outputText( '\n\nYou can see Heckel is here, running laps on an indoor track again.', false );
		}
	};
	//Greeting scene:;
	Heckel.prototype.greetHeckel = function() {
		EngineCore.outputText( '', true );
		if( CoC.flags[ kFLAGS.MET_HECKEL ] === 0 ) {
			EngineCore.outputText( 'As you approach the edge of the track, the hyena comes around the bend towards you.  Her fur is a light brown mottled with spots of dark brown and black, with a thicker and longer black mane passing for hair.  You get a good view of her B-cup breasts bouncing inside her shirt, black workout bra straps sticking out on her shoulders.  She has simple black shorts on that hug her firm ass, and you can\'t help but admire her toned legs as they move beneath her.  As she stops running and turns toward you, you see something else entirely bouncing around in her groin.  Her body reminds you of a coiled spring, too much power and tension in too small a frame.\n\n', false );
			EngineCore.outputText( 'When she draws up to you, she slows down long enough to have a conversation.  She smiles at you with a grin that manages to show every single fang, and you realize she caught you staring.  "<i>Fresh meat, huh? I\'m Heckel, the alpha dog around here.</i>"  She extends a large paw toward you as she wipes her face.  You ignore the sweat as you shake hands and introduce yourself.\n\n', false );
			EngineCore.outputText( '"<i>So, ' + CoC.player.short + ', what can I do for you?  The person working the desk can give you a tour if that\'s what you need... or maybe you were looking for a training partner?  If you can keep up with me, of course.</i>"\n\n', false );
			CoC.flags[ kFLAGS.MET_HECKEL ]++;
		}
		//Brooke + Heckel 3some;
		// Affection = 70, after first-time sex, talk to Heckel between 13 and 15:00, must not be a first-time encounter with Heckel, requires a gender;
		else if( SceneLib.brooke.brookeAffection() >= 70 && CoC.flags[ kFLAGS.BROOKE_MEDIUM_SCENE ] > 0 && CoC.flags[ kFLAGS.MET_HECKEL ] > 0 && CoC.time.hours >= 13 && CoC.time.hours <= 15 && (CoC.player.hasVagina() || CoC.player.cockThatFits( SceneLib.brooke.brookeCapacity() ) >= 0) ) {
			SceneLib.brooke.specialHeckelAndBrookeEncounter();
			return;
		}
		//Repeat post sex;
		else {
			EngineCore.outputText( 'Heckel is checking her pulse between laps when you approach her.  She grins as she catches sight of you, her teeth flashing in the light.  "<i>Back again, fresh meat?  I thought I might have scared you off last time.</i>"  She puts her hands on her hips and very blatantly looks your body up and down.  After a moment she nods to herself, as if making up her mind.  "<i>I guess you can keep up after all.  What do you say to a workout, partner?</i>"\n\n', false );
		}
		EngineCore.choices( 'Training', this.heckelTraining, '', null, '', null, '', null, 'Leave', SceneLib.telAdre.gymDesc );
	};
	//First time Sex;
	Heckel.prototype.heckelTraining = function() {
		EngineCore.clearOutput();
		var dom = null;
		//Rejection;
		//Tone not high enough or fat too high;
		if( CoC.player.tone < 60 ) {
			EngineCore.outputText( 'You tell Heckel that you\'re looking for a training partner, and she makes no attempt to hide her gaze as she looks you up and down.  When she\'s finished, she shakes her head and picks up her pace on the track.  "<i>I don\'t think so, ' + CoC.player.short + '.  Maybe if you spend some more time around here, you\'ll find your own way into the swing of things.  From what I\'m seeing, there\'s no way you can handle what I\'ve got.</i>"\n\n', false );
			EngineCore.outputText( 'You open your mouth to reply, but the hyena has already started another lap.  Deciding it isn\'t worth it, you turn away indignantly.', false );
			EngineCore.doNext( SceneLib.telAdre.gymDesc );
			return;
		}
		//Centaur or Genderless;
		else if( CoC.player.gender === 0 || CoC.player.isTaur() ) {
			EngineCore.outputText( 'You tell Heckel that you\'re looking for a training partner, but she suddenly looks off balance. She shifts from foot to foot as she looks you up and down, head cocked to the side.\n\n', false );
			EngineCore.outputText( '"<i>Err, look ' + CoC.player.short + ', people around here come in all shapes and sizes and use all sorts of... equipment. Maybe you should go find someone more your type to ask, because I honestly don\'t know what to do with yours.</i>"\n\n', false );
			EngineCore.doNext( SceneLib.telAdre.gymDesc );
			return;
		}
		if( CoC.flags[ kFLAGS.TIMES_FUCKED_HECKEL_BLOWJOB ] + CoC.flags[ kFLAGS.TIMES_FUCKED_HECKEL_ANAL ] === 0 ) {
			EngineCore.outputText( 'You tell Heckel that you\'re looking for a training partner, and she makes no attempt to hide her gaze as she looks you up and down.  When she\'s finished, her unsettling grin returns.  "<i>Excellent!  Let me just get cleaned up and we\'ll start with some stretches.</i>"\n\n', false );
			if( CoC.flags[ kFLAGS.LIFETIME_GYM_MEMBER ] === 0 ) {
				EngineCore.outputText( 'The centauress working the door walks up to collect her fee, and you drop 10 gems for an hour workout into her hand.\n\n', false );
				CoC.player.gems -= 10;
				EngineCore.statScreenRefresh();
			}
			EngineCore.outputText( 'You follow her towards the changing rooms, which are built into the wall like large shower stalls near the actual showers.  There is a larger locker room connecting them and the showers, making you pause.  It takes you a moment to realize that in a place where genders are so blurred, separating showers by genitalia is apparently impossible.  The locker room is unisex, and by the time you figure that out and walk in your guide has already disappeared.  A moment later, you hear the sound of a shower from around the corner.\n\n', false );
			EngineCore.outputText( 'You wander down the rows of aisles, but the room appears to be deserted.  Either the gym isn\'t doing as well as you thought, or this isn\'t a popular time to work out in Tel\'Adre.  You barely finish walking into sight of the showers when the nozzle shuts off.  A moment later, Heckel walks out with a towel around her torso, her mouth splitting into a grin at the sight of you.  Her fur is matted down from the shower, and with every step you can see the movement of her toned muscles across her body.  Her fur is so short that it starts springing back to normal even as she approaches you, but you can see her muscles move under her skin even still.\n\n', false );
			EngineCore.outputText( 'She walks past you with a sway in her step and sits on a bench behind you.  With a shrug of her shoulders, she lets the towel fall down and reveal her body fully.  She doesn\'t seem as tall sitting down, but you\'d still guess that she\'s a bit over six feet.  Her brown fur is mottled with black all over her body, except for a white square above and between her breasts.  Her breasts themselves are large B-cups, with black areolas surrounding pert nipples.  She leans back and spreads her legs, revealing her equipment fully.\n\n', false );
			EngineCore.outputText( 'A black cock hangs half erect between her legs, a pair of fist-sized testes underneath.  Fully erect, you estimate her dong would be around ten inches long; large, but fitting for her lithe body.  It grows a little stiffer as you stare down at it, and it isn\'t until Heckel starts cackling that you realize how long you\'ve been staring.\n\n', false );
			EngineCore.outputText( '"<i>Like what you see?</i>" she asks, looking you up and down.  "<i>\'Cause I like what I see.  It\'s not every day I get someone as fit as you brave enough to partner up with me.  Come on then fresh meat, every newbie has to start at the bottom.</i>"  She tilts her head towards her hardening member and raises an eyebrow.', false );
			if( CoC.player.str > 50 && CoC.player.hasCock() ) {
				EngineCore.outputText( '\n\nYou feel pretty strong yourself, and you realize you could probably arm wrestle this hyena-bitch down to size.' );
				dom = this.dominateHeckel;
			}
			//ORAL or LEAVE;
			EngineCore.choices( 'Oral', this.heckelOrallyFixated, 'Anal', null, 'Be Top Dog', dom, '', null, 'Leave', SceneLib.camp.returnToCampUseOneHour );
		}
		//FOLLOWUP SECKZ;
		else {
			if( CoC.flags[ kFLAGS.LIFETIME_GYM_MEMBER ] === 0 ) {
				EngineCore.outputText( 'The centauress working the door walks up to collect her fee, and you drop 10 gems for an hour workout into her hand.\n\n', false );
				CoC.player.gems -= 10;
				EngineCore.statScreenRefresh();
			}
			EngineCore.outputText( 'You know the drill as you follow Heckel into the locker room. You watch her undress before she walks into the shower room, admiring the way her toned ass moves in counterpoint to her tail. She shoots you a fang-filled grin as she disappears around the corner, and you use the opportunity to shed your own clothes.\n\n', false );
			EngineCore.outputText( 'By the time she comes back into the locker room, you\'re completely naked. She doesn\'t bother to cover herself as she towels her fur off, making the coarse hair stand on end in more than a few places. She tosses the towel aside as she passes you, her black cock already bobbing between her legs. She sits down on one of the simple wooden benches and pats the spot next to her, beckoning you over.\n\n', false );
			EngineCore.outputText( '"<i>I\'m not gonna mince words,</i>" she says with a snicker. "<i>I need a good fuck and I need it right now. I promise, this is going to be as much of a workout as hitting the track.</i>" As you sit down next to her, she runs a paw up your back and along your neck, eventually draping it over your shoulders. "<i>Now then partner, how are you gonna take this?</i>"\n\n', false );
			if( CoC.player.str > 50 && CoC.player.hasCock() ) {
				EngineCore.outputText( 'You feel pretty strong yourself, and you realize you could probably arm wrestle this hyena-bitch down to size.' );
				dom = this.dominateHeckel;
			}
			//ORAL or LEAVE;
			EngineCore.choices( 'Oral', this.heckelOrallyFixated, 'Anal', this.heckelLovesDaAnal, 'Be Top Dog', dom, '', null, 'Leave', SceneLib.camp.returnToCampUseOneHour );
		}
	};
	//oral;
	Heckel.prototype.heckelOrallyFixated = function() {
		EngineCore.outputText( '', true );
		if( CoC.flags[ kFLAGS.TIMES_FUCKED_HECKEL_BLOWJOB ] === 0 ) {
			EngineCore.outputText( 'You walk over to Heckel and fall to your knees, already licking your lips. Heckel throws her head back in a barking laugh as she scoots forward, one paw coming around the back of your head. Without needing further encouragement, you grab the flaccid dog cock and give it an experimental pump.\n\n', false );
			EngineCore.outputText( 'You can feel the blood flowing beneath your fingers as your hand works, the black shaft growing firmer and bigger in your grasp. You lean in for a lick from base to tip, and it feels unexpectedly rough on your tongue with the smell of the savanna. Before you can fall into another staring trance with it, you open your mouth and take the head in.\n\n', false );
			EngineCore.outputText( 'Heckel gasps above you in the most feminine sound you\'ve heard from her yet, and you\'re awarded with a salty drop of pre. You start working your tongue around her point immediately, the dog cock becoming fully erect in your mouth. You look down your nose at the furry crotch beneath you and realize that your estimates of ten inches were definitely on the short side, and with a deep breath through your nose you begin to swallow her cock.\n\n', false );
			EngineCore.outputText( 'The first inch hits the back of your throat, but your practiced gag reflex keeps you from reacting. Heckel\'s paw begins moving through your ' + Descriptors.hairDescript() + ', massaging you subconsciously. You force your head down another two inches as your throat opens around her head, but not before it deposits another spurt of pre-cum. Your tongue continues to massage the underside of her cock as you try not to gag, but the paw on the back of your head has already begun pressing you down further.\n\n', false );
			EngineCore.outputText( 'You take another inch into your throat before pulling off. Heckel growls above you until you lower your head again, this time further than before. Her growl becomes a moan instantly as the paw on your head is joined by another, both gripping your hair together. As you raise and lower your head, the furry balls in front of you begin to swing back and forth with Heckel\'s small thrusts, and you reach out a hand to fondle them.\n\n', false );
			EngineCore.outputText( 'As you fondle her balls, your fingers graze over something wet behind them. If you could smile around the mouthful of doggy-dick, you definitely would. You\'ve discovered that Heckel is definitely a herm, and you make sure to give her gash another graze as you bob your head down. The head of her cock pulses as you take her length deeper than you had before, and the hands in your hair tighten their grip as Heckel rises from her seat suddenly. You lose pace at this sudden change, and the position forces you to look up at her face.', false );
			EngineCore.doNext( this.heckelOralFixationII );
		}
		//Repeat;
		else {
			EngineCore.outputText( 'You lick your lips as you eye her swelling member. It pulses softly with her heartbeat, each jump leaving it slightly bigger than it was before. As you watch, it slowly stands to attention at around ten inches in length, Heckel\'s heavy balls drawing up beneath it. Her canine dick almost looks shiny with the skin taut like this, though it might also be the moisture from her shower. You make up your mind when you see a dribble of pre form at the tip, and you bend over to lick it up before it can drip down and escape.\n\n', false );
			EngineCore.outputText( 'Heckel leans back to give you more room, and you wrap your hand around her hardening member. Even with her shower you still catch her light musk coming from her groin.  Whether this is from her workout or her arousal you can\'t tell, but it\'s a scent you are quickly coming to recognize as hers. You inhale deeply through your nose as you lick her cock from base to tip, pausing over her crown before letting your head fall down.\n\n', false );
			EngineCore.outputText( 'Heckel moans as you take a mouthful in, her dick fitting your mouth like a glove. In your first bob you manage to take about a third of it before your gag reflex kicks in, forcing you to back off for a breather. You set your hand to work as you pull away, lowering your head over her thigh as far as you can to suck on her balls. Once you\'ve regained your breath, you stand off the bench and crawl around in front of her, sitting on your knees with her dick throbbing in front of your face.\n\n', false );
			EngineCore.outputText( 'You can see Heckel\'s face around her dick and over her breasts. For once, she isn\'t grinning at you. Instead, her tongue is lolling out of her mouth as she lets her head roll to the side, her eyes glazed and distant. Not giving her any time to recover, you give her sack a final suckle before licking back up the underside of her dong. In seconds, you\'ve taken her as far in as you had before, and you begin to set up a rhythm.\n\n', false );
			EngineCore.outputText( '"<i>I don\'t know if I told you last time,</i>" Heckel pants above you, "<i>but you\'re really good at this.</i>" You take a strange sense of pride in that and eagerly work your throat down to the halfway point on her dick, realizing that it has grown considerably in the last few minutes. What was once ten inches is now closer to thirteen, but it\'s still nothing you can\'t handle. With practiced patience, you take more and more of her dick down your throat with every bob, keeping your hand working in counterpoint on her firm shaft.\n\n', false );
			EngineCore.outputText( 'She grunts above you and you feel one of her paws around the back of your head, pushing you lightly with each of your bobs. Her hips begin thrusting lightly against your lips, and you\'re pretty sure you can feel the tip of her cock pushing against the entrance to your stomach. It isn\'t long before you can feel her balls against your chin, your throat distended and stiff with the length of her member.\n\n', false );
			//[<PC IS MALE OR HERM> ;
			if( CoC.player.hasCock() ) {
				EngineCore.outputText( 'You use one hand to fondle her balls, letting them roll over your fingers and pinching the skin lightly. Your other hand finds its way to your crotch, where you begin stroking your ' + Descriptors.cockDescript( 0 ) + ' in time with her weak thrusts. Within moments you\'ve brought yourself to a stiffening arousal, the cold air making your exposed ' + Descriptors.cockDescript( 0 ) + ' twitch slightly.\n\n', false );
			}//[<PC IS FEMALE>;
			else if( CoC.player.hasVagina() ) {
				EngineCore.outputText( 'You use one hand to fondle her balls, letting them roll over your fingers and pinching the skin lightly. Your other hand finds its way to your crotch, where you roll your ' + Descriptors.clitDescript() + ' between your first two fingers. You let two fingers sink into your ' + Descriptors.vaginaDescript( 0 ) + ', curling them upwards and moaning around the giant dog dick in your mouth.  Your fingers bring you to the edge of orgasm, but you lack the stimulation to send yourself over just yet.\n\n', false );
			}
			EngineCore.outputText( 'As your bobbing head works over her dick, you feel her knot begin to form at its base. At first it\'s just a small bump that you make sure to rub your tongue over, but over the course of a minute it becomes the size of a plum. Before long it becomes too large for you to take into your mouth, but this also gives you some breathing space between Heckel\'s cock head and your stomach. The more the knot inflates however, the more your jaw and cheeks are stretched to just hold her member in your mouth. If you didn\'t know better, it would feel like her dick is slowly growing larger! Your fears are confirmed when, even with several inches outside of you, her cock fully extends down your gullet. It is definitely getting thicker.\n\n', false );
			EngineCore.outputText( 'You look up in growing alarm at Heckel, but her eyes are glazed over again. Despite her vacant stare, her hand is still forcing your head back and forth at the pace of a slow rut.  Deciding that the best way to avoid suffocation is to get her off quickly, you redouble your efforts and twist your head around her cock with each thrust, letting your tongue move in all the space it can to stimulate her as much as possible.\n\n', false );
			EngineCore.outputText( 'You can barely see around her knot - it has grown so large, but at least she isn\'t trying to make you swallow it. Even with all the things you\'ve seen in this realm, you know that some feats of anatomy are simply not possible. The hyena certainly doesn\'t mind trying though, and you repeatedly find your nose and chin squashed up against the growing bulge.\n\n', false );
			//[<PC IS FEMALE>;
			if( CoC.player.gender === 2 ) {
				EngineCore.outputText( 'A growl rises in Heckel\'s throat, and you recognize the sign of her impending orgasm. It\'s all you can do to keep your balance as her thrusts into your throat come more frequently. Although you are barely able to breath between thrusts, your free hand feverishly works at your wet slit, plumbing your depths as your own orgasm builds. Heckel\'s paws grab your head and pull you deeply on to her dick as you feel it spasm, and you begin to moan as you feel her load travelling through her cock and finally spilling directly into your stomach. The warmth of her seed spreads throughout your body until it meets the warmth of your groin, and your cunt begins to spasm around your fingers as it sets you over the edge.\n\n', false );
			}
			//<PC IS MALE OR HERM> ;
			else {
				EngineCore.outputText( 'A growl rises in Heckel\'s throat, and you recognize the sign of her impending orgasm. It\'s all you can do to keep your balance as her thrusts into your throat come more frequently. Although you are barely able to breath between thrusts, your free hand feverishly strokes your ' + Descriptors.cockDescript( 0 ) + ', your hand becoming slippery with pre as your own orgasm builds. Heckel\'s paws grab your head and pull you deeply on to her dick as you feel it spasm, and you begin to moan as you feel her load travelling through her cock and finally spilling directly into your stomach. The warmth of her seed spreads throughout your body until it meets the warmth of your groin, and your cock erupts in your hand as it sets your over the edge.\n\n', false );
			}

			EngineCore.outputText( 'Heckel pulls herself slowly from your throat, her dick finally coming free with a loud POP.  You moan as its girth leaves you, your throat feeling strangely empty without it. A strand of semen drips from her tip as she stands above you, but you greedily move your head to catch it and swallow the salty treat down. Heckel snickers at this before falling down on the bench, looking you over appreciatively.\n\n', false );
			EngineCore.outputText( '"<i>By Marae, ' + CoC.player.short + ', you\'ve got quite the mouth. I\'m impressed, and that doesn\'t happen often.</i>" She brings a paw to her chin as if thinking, before finally reaching it out and ruffling your hair. "<i>You know, you aren\'t half bad to be around, and not just for the sex. Don\'t be a stranger around here, alright?</i>" With that she stands and heads back into the showers, giving you time to clean up and head back to camp.', false );
			CoC.player.orgasm();
			EngineCore.dynStats( 'sen', 4 );
			EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
		}
		//Increment BJ count;
		CoC.flags[ kFLAGS.TIMES_FUCKED_HECKEL_BLOWJOB ]++;
	};
	Heckel.prototype.heckelOralFixationII = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You look up her body at her scowling face, wondering what you did wrong. "<i>None of that, little meat. I\'m top dog here, which means you don\'t go near there. But if you keep sucking this well, I might just let you keep that hand.</i>" Heckel clearly isn\'t amused, but she hasn\'t pulled you away either. Whether from her threat or your lust, you aren\'t about to let this hard cock out of your mouth any time soon anyway. Your next bob is echoed by a thrust from Heckel, as is the next and the next after that. Her thrusts start coming faster than your head can keep up, and then her hands in your ' + Descriptors.hairDescript() + ' tighten their grip to hold your mouth in place. Before you know it she\'s fucking your throat more than you\'re giving her head. All you can do is watch her furry groin and stomach pumping towards you, and you have ample time to watch a knot start forming at the base of her dick. Your eyes begin to tear up as her cock pushes your throat open again and again, her thrusts getting faster and faster. It\'s all you can do to keep one hand stroking her shaft without gagging on her dick.\n\n', false );
		EngineCore.outputText( 'You let your eyes close as you focus on not gagging, but open them wide when something else presses against your lips. It takes you a moment to realize that her knot is pushing at the entrance to your mouth as Heckel grunts above you, her thrusts coming faster and faster. You look up at her in alarm, and she barks out a laugh from above her swaying breasts. "<i>What? What did you think I meant by stretch?</i>" Her voice wavers as her cock spasms, shooting another spurt of pre into your throat.\n\n', false );
		EngineCore.outputText( 'Before you can start thinking of a way out of the situation, she growls loudly above you.  Her hands grip the back of your head and pull you towards her, burying your face in wet fur and her knot in your mouth. You feel her lean over you as your vision goes dark, your entire face buried in the fur of her groin. Her entire cock seems to flex inside you as her hips thrust forward, and a moment later you feel a burning heat travelling down your throat. Your hands go to the ground to steady yourself as she pulls herself suddenly away, her dick pulling out of your gullet with a long slurp and giving you a chance to breathe clearly again. You barely get one breath in before you realize that she\'s still cumming, and a thick stream of jism lands across your face and into your open mouth as she paws herself off the rest of the way. Unable to do anything else at this point, you simply fall back onto your ' + Descriptors.buttDescript() + ' and let her cum across your face two more times, her tongue lolling out of her mouth as she finishes.\n\n', false );
		EngineCore.outputText( 'When she\'s finally emptied herself on your face, she falls down onto the bench in front of you. Before you can say anything, she extends a paw and ruffles your semen-streaked hair. "<i>Heh, not bad fresh meat. If you can learn your place on the food chain here, we might have a beautiful partnership ahead of us. If you still think you can keep up, that is.</i>" She winks at you as she stands again, tossing you her towel from earlier as she heads towards the showers.\n\n', false );
		EngineCore.dynStats( 'lib', 1, 'sen', 4, 'lus', (10 + CoC.player.lib / 10 + CoC.player.sens / 10) );
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
	};
	//anal;
	Heckel.prototype.heckelLovesDaAnal = function( loss ) {
		EngineCore.outputText( '', true );
		//rejection - ass not loose enough;
		if( CoC.player.analCapacity() <= 20 && !loss ) {
			EngineCore.outputText( 'Heckel lets out a barking laugh when you suggest using your ' + Descriptors.assDescript() + ', ruffling your hair playfully. "<i>Know your limits, ' + CoC.player.short + ', I\'d tear you apart down there. I\'m sure there are plenty of others in this realm who can help you out with that.</i>"\n\n', false );
			EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		//success - requires ass to be 'a little loose';
		EngineCore.outputText( 'Heckel\'s eyes flash as her grin splits her face, and for just a moment you wonder if this might have been a bad idea. Before you can object, however, she\'s pushing you down onto your stomach, your arms and ' + CoC.player.legs() + ' draped over either side of the wooden bench.\n\n', false );
		EngineCore.outputText( 'You half expect her to just shove herself in right there, but she thankfully holds off. Instead, you feel her rough paws grab and knead either side of your ' + Descriptors.buttDescript() + ' as she lets out a low growl.', false );
		//[<IF TONE OVER 80>;
		if( CoC.player.tone >= 80 ) {
			EngineCore.outputText( '  "<i>Damn ' + CoC.player.short + ', you\'ve got one hell of an ass. I bet it\'s gonna feel even better than it looks.</i>"', false );
		}
		//[<IF TONE BETWEEN 60-79>;
		else if( CoC.player.tone >= 60 ) {
			EngineCore.outputText( '  "<i>Mmm, not bad ' + CoC.player.short + ', not perfect, but not bad.</i>"', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'One hand releases your ' + Descriptors.buttDescript() + ' and you can hear the sound of her stroking herself. You start to turn your head around to watch, but she firmly presses you back down against the bench. "<i>Now now partner, I told you to stay there. When you\'re the alpha dog around here, then you can make the rules.</i>" Deciding this treatment isn\'t so bad anyway, you relax and let her hand continue to knead your ' + Descriptors.buttDescript() + '.\n\n', false );
		EngineCore.outputText( 'The sound of her stroking stops, and you bite your lower lip. You feel the bench shift beneath you as she changes position, and a moment later she pulls both of your asscheeks apart to expose your ' + Descriptors.assholeDescript() + '. You tense for the inevitable penetration, but instead of a hard cockhead poking at your backdoor you feel something warm and wet. Heckel is licking you!\n\n', false );
		EngineCore.outputText( 'Her large tongue feels like sandpaper as it licks up and down your anus, your spread cheeks exposing you to the world. You can feel her wet nose on your sensitive skin, and the contrast with her warm tongue makes you shiver. Her tongue pokes and prods at your ' + Descriptors.assholeDescript() + ' before slipping painlessly in, swirling expertly around before pulling out and licking some more.\n\n', false );
		//[<IF PC HAS PENIS AND VAGOO> ;
		if( CoC.player.hasCock() && CoC.player.hasVagina() ) {
			EngineCore.outputText( Descriptors.SMultiCockDesc() + ' is trapped between you and the wooden bench, and you know Heckel won\'t let you shift position to free it. Your ' + Descriptors.vaginaDescript( 0 ) + ' is also being ignored, and having so much pleasure with so little stimulation is driving you crazy. You hump weakly up and down, trying to draw some pleasure out of the bench beneath you while simultaneously pushing her rolling and massaging tongue closer to your aching slit, but she ignores you and only licks deeper. She buries her face in your ass entirely, her cold nose and teeth rubbing up against your sensitive skin as her tongue pushes as far inside of you as she can get it.\n\n', false );
		}//[<IF PC HAS PENIS>;
		else if( CoC.player.hasCock() ) {
			EngineCore.outputText( Descriptors.SMultiCockDesc() + ' is trapped between you and the wooden bench, and you know Heckel won\'t let you shift position to free it. You hump weakly at the bench in a desperate attempt to get some stimulation, and you can feel the vibrations of Heckel\'s laugh as she buries her snout in your ass. She doesn\'t stop you, but the polished wood barely gives any pleasure anyway.\n\n', false );
		}//[<IF PC HAS VAGOO>;
		else if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'Your snatch starts to ache while moisture runs down your groin, and you groan at the lack of attention it\'s receiving. If Heckel notices, she doesn\'t react and keeps swirling her tongue around your hole. You push weakly backwards, hoping to make her drop her tongue down a few inches, but she instead takes this as an opportunity to bury her snout fully between your ass cheecks, her tongue slipping inside you deeper than before.\n\n', false );
		}
		EngineCore.outputText( 'Even with only a few inches inside your ass, her tongue makes you moan almost immediately. She rolls in back and forth, then side to side, then pushes it in and out before starting the cycle over. The teasing becomes more and more unbearable until you\'re ready to abandon caution and begin masturbating, but just as you tense to change position she stops and pulls her tongue out suddenly.\n\n', false );
		//NEXT;
		EngineCore.doNext( this.heckelLovesAnal2 );
		//Increment Anal count;
		CoC.flags[ kFLAGS.TIMES_FUCKED_HECKEL_ANAL ]++;
	};
	Heckel.prototype.heckelLovesAnal2 = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'Her legs bump against yours as she pulls herself up, the contact sending shivers through your sensitive body. "<i>Even better than I thought,</i>" she mumbles as you hear the sound of her stroking herself. Before the wetness around your ass can dry up, you feel something hard and slightly pointed poking the entrance of your ' + Descriptors.assholeDescript() + '.\n\n', false );
		EngineCore.outputText( 'You open your mouth to gasp as she slides into you, but no sounds come out. You can feel inch after inch penetrate you, your asshole slowly stretching to accommodate her increasing thickness. She pushes as much as she can into you before pulling back slightly, then humping lightly as she works the rest in little by little.', false );
		CoC.player.buttChange( 28, true, true, false );
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'As more and more doggie dick is pushed into your ass, you find your estimations of her size more and more ridiculous. There has to be an entire foot of cock in you already, but she\'s still going! When she does finally bottom out, your mind reels at the impossibility. Her dick must grow the longer she stays aroused, because she\'s at least 15 inches right now! The base of her dick stretches your ass painfully open, and she gives you a moment to adjust to it.', false );
		CoC.player.buttChange( 35, true, true, false );
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'Just as the sting begins to fade, she draws herself out to the tip in one motion. You bite your lip in anticipation, but you still moan like a whore when she slams all 15 inches back into you. She draws back before pounding your ' + Descriptors.assholeDescript() + ' again, making your ' + Descriptors.buttDescript() + ' shake with the impact.\n\n', false );
		//[<IF PC HAS PENIS AND VAGOO>;
		if( CoC.player.hasCock() && CoC.player.hasVagina() ) {
			EngineCore.outputText( 'Although ' + Descriptors.sMultiCockDesc() + ' is trapped beneath you, Heckel\'s balls slap into your cunt with every one of her quickening thrusts.  Although neither your ' + Descriptors.multiCockDescriptLight() + ' or ' + Descriptors.vaginaDescript( 0 ) + ' are getting much stimulation, your prostate is being milked better than it ever has. One thrust in particular makes you cry out, and Heckel laughs above you as she slams her furry thighs into yours again. "<i>You moan like a whore, ' + CoC.player.short + ', a perfect bitch for me to ride.</i>"\n\n', false );
		}//[<IF PC HAS PENIS AND BALLS> ;
		else if( CoC.player.hasCock() && CoC.player.balls > 0 ) {
			EngineCore.outputText( Descriptors.SMultiCockDesc() + ' pulses beneath you with every thrust, her duo of fist-sized balls slapping into your ' + Descriptors.ballsDescriptLight() + '. You gasp in surprise as one of her thrusts rubs against your prostate, and she barks out a single laugh above you. "<i>You moan like a whore, ' + CoC.player.short + ', a perfect bitch for me to ride.</i>"\n\n', false );
		}//[<IF PC HAS VAGOO>;
		else if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'Heckel\'s fist-sized balls slap against your ass and grind your snatch with every thrust, driving you crazy with the desperate need to be filled. You moan in anguish, pushing yourself towards her with every thrust, desperate to milk as much stimulation out of her as possible. She laughs above you, but rewards you with harder and faster thrusts. "<i>You moan like a whore, ' + CoC.player.short + ', a perfect bitch for me to ride.</i>"\n\n', false );
		}
		EngineCore.outputText( 'You don\'t bother to protest your indignation as she pushes her canine dick into you again, opening your ass farther than you thought possible. You\'re sure you could see the outline of her cock from your stomach if you weren\'t being pinned beneath her. Heckel pauses in her deliberate thrusts to lean over you, mashing her breasts across your back as she brings her mouth to your ear.', false );
		//[<IF PC IS FEMALE>;
		if( CoC.player.gender === 2 ) {
			EngineCore.outputText( '  "<i>I\'m going to fuck your ass like you wish I\'d fuck your cunt,</i>"', false );
		}
		//[<IF PC IS MALE OR HERM >;
		else {
			EngineCore.outputText( '  "<i>I\'m going to ride your ass like you wish you could ride me,</i>"', false );
		}
		EngineCore.outputText( ' she whispers into your ear. You can\'t help but shiver as she adjusts herself before resuming her pounding, drawing small gasps from you with every thrust.\n\n', false );
		EngineCore.outputText( 'Her thrusts become faster and shorter as she leaves more of her cock buried inside of you, jackhammering your hole with her last few inches. Something even bigger begins to press against your ' + Descriptors.assholeDescript() + ' as you hear her breathing become faster, her tongue lolling out of her mouth. You forgot about her knot! She doesn\'t let up her speed as she pushes it a little further with every thrust, and you don\'t want to think of how big it must be by now if it grew along with her dick size. She doesn\'t seem deterred however, and all you can do is grunt in pain as it pushes itself further and further.\n\n', false );
		EngineCore.outputText( 'Heckel suddenly freezes up and bites down on your shoulder, throwing her hips forward. Her knot pushes against your backdoor as she tries to force it in, but your ass just won\'t expand that much. She growls and pushes again, making you yelp as it spreads you even further. It feels like she\'s shoving a melon up there! She growls even louder and bites down harder, and you can feel her dick flare inside you as her knot pushes you further and further apart. You cry out as it passes the midway point, your ass sucking the knot up greedily and contracting around the other side.', false );
		//<ASS BECOMES VERY LOOSE>;
		CoC.player.buttChange( 45, true, true, false );
		EngineCore.outputText( '\n\n', false );
		//[<HERM PC>;
		if( CoC.player.gender === 3 ) {
			EngineCore.outputText( 'Heckel wastes no time before going back to her brutal fucking, though her thrusts are limited to short bursts now. She makes up for this in speed as you lie helplessly below her, the pain of taking her knot slowly turning into intense pleasure. The heat and pleasure spreads from your ass to your entire groin, and the knot pushes against the walls of your vagina hard enough to make them rub against each other. Heckel cries out above you and slams her hips into you as much as she can, and you immediately feel a burning heat shooting up your gut. She pumps again as she seeds your insides with another spurt, and this time you orgasm along with her. Your ' + Descriptors.vaginaDescript( 0 ) + ' spasms and gushes over your soaked ' + CoC.player.legs() + ', your asshole spasming around her cock just as much. Your ' + Descriptors.multiCockDescriptLight() + ' soon follows, shooting your own seed up between your ' + Descriptors.chestDesc() + ' and coating your stomach. Even as your orgasm begins to taper off, you can do little more than lie panting in a pool of your own spunk. Your legs quiver beneath hers as the warmth spreads further up your gut, leading you into a warm and hazy afterglow.\n\n', false );
		}
		//[<MALE PC>;
		else if( CoC.player.hasCock() ) {
			EngineCore.outputText( 'Heckel wastes no time before going back to her brutal fucking, though her thrusts are limited to short bursts now. She makes up for this in speed as you lie helplessly below her, the pain of taking her knot slowly turning into intense pleasure. The heat and pleasure spreads from your ass to your ' + Descriptors.ballsDescriptLight() + ' and cock, making it twitch at your impending orgasm. Heckel cries out above you and slams her hips into you as much as she can, and you immediately feel a burning heat shooting up your gut. She pumps again as she seeds your insides with another spurt, and this time you orgasm along with her.  Your ' + Descriptors.ballsDescriptLight() + ' get tight as your trapped ' + Appearance.cockNoun( CockTypesEnum.HUMAN ) + ' twitches, shooting your cum up between your stomach and chest. Your legs quiver beneath hers as the warmth spread further up your gut, leading you into a warm and hazy afterglow.\n\n', false );
		}//[<FEMALE PC>;
		else if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'Heckel wastes no time before going back to her brutal fucking, though her thrusts are limited to short bursts now. She makes up for this in speed as you lie helplessly below her, the pain of taking her knot slowly turning into intense pleasure. The heat and pleasure spreads from your ass to your entire groin, and the knot pushes against the walls of your ' + Descriptors.vaginaDescript() + ' hard enough to make them rub against each other. Heckel cries out above you and slams her hips into you as much as she can, and you immediately feel a burning heat shooting up your gut. She pumps again as she seeds your insides with another spurt, and this time you orgasm along with her. Your ' + Descriptors.vaginaDescript( 0 ) + ' spasms and gushes over your soaked thighs, your asshole spasming around her cock just as much. Your legs quiver beneath hers as the warmth spread further up your gut, leading you into a warm and hazy afterglow.\n\n', false );
		}
		EngineCore.outputText( 'As your orgasm fades, you turn your head to look at your workout partner. Heckel has completely collapsed across your back, her head leaning against your own. A distinct snore comes from her mouth, and you can\'t help but laugh. For all her bluster, it looks like you worked her harder than she worked you! With her knot stuck in you, it\'s probably going to be awhile before you can go anywhere anyway, so you lay your head down on the bench and enjoy the feeling of fullness her softly pulsing dick gives you.\n\n', false );
		EngineCore.outputText( 'When you awaken, several hours have passed and Heckel is still asleep on top of you.  You\'re sure that someone else must have wandered into the locker room by now, but there doesn\'t seem to be anyone there at the moment. You shake your partner awake and she pulls her now flaccid cock from your ass, no small amount of cum following it out.\n\n', false );
		EngineCore.outputText( 'You lay on the bench for a few moments as Heckel ruffles your hair again. "<i>Not bad, partner. You\'re the best fuck I\'ve had in years, you know that? Not to mention the best workout!</i>"\n\n', false );
		EngineCore.outputText( 'She laughs as she stands and heads for the shower, letting you clean yourself up and head back to camp.', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', 4 );
		EngineCore.doNext( SceneLib.camp.returnToCampUseFourHours );
	};

	Heckel.prototype.dominateHeckel = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Smirking, you fold your arms and tell her to bend over - ' );
		if( CoC.flags[ kFLAGS.TIMES_DOMMED_HECKEL ] === 0 ) {
			EngineCore.outputText( 'there\'s a new top dog just waiting to claim the town bitch' );
		} else {
			EngineCore.outputText( 'you\'re back for a taste of your favorite bitch' );
		}
		EngineCore.outputText( '.  Heckel snorts, "<i>Nice try, fuck-meat, but ' );
		if( CoC.flags[ kFLAGS.TIMES_DOMMED_HECKEL ] > 0 ) {
			EngineCore.outputText( 'last time was a fluke' );
		} else {
			EngineCore.outputText( 'I\'m always on top' );
		}
		EngineCore.outputText( '.  If you want a squealing submissive to ride, the Wet Bitch is that way,</i>" pointing towards the exit.  Her flaccid dog-dong twitches a little but remains defiantly soft.' );
		EngineCore.outputText( '\n\nYou step closer her body, admiring the shapely curve of her muscles beneath her sweat-matted fur.  Heckel\'s nipples perk up at your close proximity and gently come to rest against your [chest] once you invade her personal space.  She doesn\'t take a single step back, and you suggest, "<i>Some top dog.  Wanna bet your ass?</i>"' );
		EngineCore.outputText( '\n\nHeckel retorts, "<i>You gonna bet yours' );
		if( CoC.flags[ kFLAGS.TIMES_LOST_HECKEL_DOM_CHALLENGE ] > 0 ) {
			EngineCore.outputText( ' again' );
		}
		EngineCore.outputText( '?</i>"  Her tough finger-tip slams into your solar plexus for emphasis' );
		if( CoC.player.tou < 60 ) {
			EngineCore.outputText( ', pushing you back a bit' );
		}
		EngineCore.outputText( '.' );
		EngineCore.outputText( '\n\nOf course, with Heckel around you knew you\'d be risking your ass, but at least now you\'re going to get a shot at hers.  You nod at the surprised hyena herm in acceptance of her wager and suggest the most obvious way to settle just who runs this gym - an arm wrestling contest.' );
		EngineCore.outputText( '\n\nThe spotted muscle-girl snarls, "<i>You\'re on!</i>"  She knocks some water bottles off a nearby table and positions herself to one side, slamming her elbow down carelessly.  "<i>This is going to make pounding your ass that much sweeter, [name].</i>"  Breathing heavily now, Heckel looks to you expectantly.  Her mighty she-cock, half-hidden by the table begins to strain upward, hardening with eager anticipation.' );
		EngineCore.outputText( '\n\nYou flash a cocky grin of your own and seat yourself across from her, making sure to flash your ' + Descriptors.multiCockDescriptLight() + ' in her direction as you sit down.  "<i>Just making sure you know what you\'re getting yourself into,</i>" you taunt.  The tabletop is made from thick, lacquered wood that squeaks when your elbow comes to rest on the polished surface.  You clench your fist and flex your arm, displaying your muscles to your foe, and Heckel does likewise, her powerful body rippling beneath her furry skin, tendons taut and visible.  "<i>Is my little bitch afraid?</i>" you ask.' );
		EngineCore.outputText( '\n\n"<i>Never!</i>" the powerful hyena retorts, clasping your palm with hers.  You can feel the barely restrained potential energy in her grip.  She says, "<i>On three.  One, two... THREE!</i>"  An avalanche of tension comes down across your forearm, but you throw your own considerable might into it, stopping your knuckles a half-inch off the table\'s surface.  Matched muscle to muscle, you look the hyena in the eye.  On each side of the table your free hands grab the edge for stability, squeezing so hard you swear you can hear the wood splintering.  ' );
		//{Lose};
		if( CoC.player.str < 75 ) {
			EngineCore.outputText( 'Even with your mighty struggling, you cannot overcome the relentless hyena, and your shaking hand is forced down, eventually pressed flat into the wood.' );
			EngineCore.outputText( '\n\nHeckel proudly declares, "<i>Your ass is mine, bitch.  Bend over.</i>"  You sigh, ashamed to have lost and more than a little emasculated.  Well, you made a wager.  Time to live up to it...' );
			EngineCore.menu();
			EngineCore.addButton( 0, 'Next', this.heckelLovesDaAnal, 1 );
			CoC.flags[ kFLAGS.TIMES_LOST_HECKEL_DOM_CHALLENGE ]++;
		}
		//{Win};
		else {
			EngineCore.outputText( 'Inexorably, you turn the tide, slowly bending Heckel\'s arm back.  Nearly lost, the hyena catches a second wind and holds you there, arm shaking.  Her eyes are desperate and wide, her pupils tiny, focused pinpricks.  She grunts and groans as she struggles as hard she can, but you push harder, and press her knuckles against the woodgrain.' );
			EngineCore.outputText( '\n\nHeckel lets go of your palm, staring at her hand in disbelief.  "<i>You... you beat me' );
			if( CoC.flags[ kFLAGS.TIMES_DOMMED_HECKEL ] > 0 ) {
				EngineCore.outputText( ' AGAIN' );
			}
			EngineCore.outputText( '...</i>"' );
			EngineCore.outputText( '\n\nTime to claim your prize...' );
			EngineCore.dynStats( 'str', 0.5 );
			EngineCore.menu();
			EngineCore.addButton( 0, 'Next', this.dominateHeckelConclusion );
			CoC.flags[ kFLAGS.TIMES_DOMMED_HECKEL ]++;
		}
	};
	//[Fuck Heckel];
	Heckel.prototype.dominateHeckelConclusion = function() {
		EngineCore.clearOutput();
		var x = CoC.player.cockThatFits( 70 );
		if( x < 0 ) {
			x = CoC.player.smallestCockIndex();
		}
		EngineCore.outputText( 'You casually rise and circle round the table.  Before she can react, you dexterously slip your hands down to Heckel\'s sculpted, furry backside and lift her high, easily flipping her up onto the wooden surface.  The muscle-herm grunts softly as she comes to rest upon the polished wood, her flopping dog-cock already starting to thicken with the telltale engorgement of oncoming arousal.  Smirking, you gently prod at the growing knot and tease her - she might be an avowed dom, but her dick seems excited by the prospect of sex on any terms.' );
		EngineCore.outputText( '\n\nHeckel protests, "<i>Please; just because my body is looking for a fuck doesn\'t mean I want to be your bottom bitch.</i>"' );
		EngineCore.outputText( '\n\nYou flick one of her fuzz-shrouded balls and laugh, "<i>You could\'ve fooled me.</i>"  The hyena-girl begins a new protest, but before it can leave her mouth, you dip lower to her lube-moistened cunt and tweak her hidden clit.  Her voice goes from griping to whorish moan in a flash, rising in volume until you\'re sure someone must hear.  ' );
		if( CoC.flags[ kFLAGS.PC_FETISH ] > 0 ) {
			EngineCore.outputText( 'You grin and blush hotly, imagining the whole of the gym watching you fuck this hyena, their watchful eyes exciting you further.' );
		} else if( CoC.player.cor < 33 ) {
			EngineCore.outputText( 'You blush a bit at that, uncomfortable at your sex being so public but unwilling to stop.' );
		} else if( CoC.player.cor < 66 ) {
			EngineCore.outputText( 'You smirk a little at that while barely acknowledge the worry of being caught nagging at your consciousness.' );
		} else {
			EngineCore.outputText( 'You grin widely at that and secretly hope that the whole gym will come in to see their \'alpha\' laid low.' );
		}
		EngineCore.outputText( '  Never stopping their probing motions, your fingertips dance through the hyena\'s sopping passageway, caressing the underswell of her virile nutsack, and occasionally brush the sensitive fur along her inner thighs.  Heckel is squirming and writhing atop the table, dominated by the mere twitches of your digits, a panting bitch in heat just begging for rough impalement on [oneCock].' );
		EngineCore.outputText( '\n\nStepping to the side but never leaving the hyena\'s arousal-engorged box empty, you flop your [cock biggest] across her nose' );
		if( CoC.player.cockTotal() > 2 ) {
			EngineCore.outputText( ', fanning the others across her neck and forehead, burying her in penis.' );
		} else if( CoC.player.cockTotal() === 2 ) {
			EngineCore.outputText( ', dropping your [cock smallest] alongside it over her eyes, burying her in penis.' );
		} else {
			EngineCore.outputText( ', draping her in hard penis.' );
		}
		EngineCore.outputText( '  She whimpers as you rub your sensitive underside across her nose and pouting lips, looking up at you with what you imagine was supposed to be hatred.  It looks like lust instead.  Slowly stroking yourself while you diddle her, your manhood' );
		if( CoC.player.cockTotal() > 1 ) {
			EngineCore.outputText( 's throb and thicken' );
		} else {
			EngineCore.outputText( ' throbs and thickens' );
		}
		EngineCore.outputText( ' further, too turned on to stop even if you wanted to.  You command her to open with a terse word.  She does, and you slide inside.' );
		EngineCore.outputText( '\n\nHeckel\'s mouth is a hot, wet cavern of fleshly delight for your [cock biggest], and an involuntary tremble of bliss travels through your swollen meat, depositing a ' );
		if( CoC.player.cumQ() < 250 ) {
			EngineCore.outputText( 'single drop' );
		} else if( CoC.player.cumQ() < 1000 ) {
			EngineCore.outputText( 'steady drip' );
		} else {
			EngineCore.outputText( 'never-ending flow' );
		}
		EngineCore.outputText( ' of pre-cum onto the muscle-girl\'s tongue.  Her body wriggles happily in acceptance, twitching around your knuckles.  A nice, sticky puddle of her own pre has formed on her well-defined abdominals, still connected to its spigot by a web of glittering, translucent love-juice.  Whimpering, Heckel fairly hums with need, the vibrations of her hungry protests bouncing through your [cock biggest] pleasantly.' );
		EngineCore.outputText( '\n\nPulling your fingers out of her oozing, cock-hungry snatch, you wipe her drippings off on one of her rigid, clenched thighs.  The fur makes her good for a towel, if nothing else.  Her whimpers rise in pitch and frequency, turning her lusty mouth into a snug, cock-sucking vibrator.  You cannot take such pleasure without giving into your own baser instincts.  Grabbing hold of the back of her head in a two-handed grip, you piston your [hips] forward to jam ' );
		if( CoC.player.biggestCockArea() > 40 ) {
			EngineCore.outputText( 'as much of it as possible' );
		} else {
			EngineCore.outputText( 'it' );
		}
		EngineCore.outputText( ' down her throat.  Heckel\'s eyes bulge in disbelief, wildly looking left and right.  Her teeth come down, just barely pricking the skin of your [cock biggest] in warning.  You twist her nipple in a retaliatory strike, opening her throat up with a moaning shriek.' );
		EngineCore.outputText( '\n\nYou savor the sensation a bit, but ultimately withdraw.  Your [cock biggest] glistens with spit and mucus, leaking heady flows of pre-cum on Heckel\'s exhausted muzzle.  She coughs and gasps, whimpering and moaning in between.  You make sure to wipe most of it off on her forehead, smearing the saliva and cock-juice to mark her as your bitch.' );
		EngineCore.outputText( '\n\nThe muscular woman tries to lurch off the table, but you growl and pin her in place with your superior strength.  She fights and snarls, spitting and hissing like a wild snake.  It takes most of your considerable power to hold her still, and only after she discovers her utter helplessness before you does she slump down in acceptance.  Hissing through her teeth, she exhales, "<i>Quit teasing me and fuck me already...</i>"' );
		EngineCore.outputText( '\n\n"<i>What\'s that?  I didn\'t hear you,</i>" you answer, "<i>You\'ll have to speak up.</i>"' );
		EngineCore.outputText( '\n\nHeckel whimpers pleadingly, jostling her hips in your direction, still leaking and dripping all over the strong table.  Gone is the woman obsessed with taking you; in her place is a whiny, sultry bitch begging to be fucked.  You let her go and flick her cock, commenting, "<i>No need for this little puppy-prick to get anything.</i>"  Then, without any further teasing, you mount the table and your new muscle-slut all in one motion.  The heat from her mons washes over [eachCock] like the air from a salacious furnace' );
		if( CoC.player.balls > 0 ) {
			EngineCore.outputText( ', basting your [balls] with her steaming warmth' );
		} else if( CoC.player.hasVagina() ) {
			EngineCore.outputText( ', basting your [vagina] with her steaming warmth' );
		} else {
			EngineCore.outputText( ', basting your ' + CoC.player.skin() + ' with her steaming warmth' );
		}
		EngineCore.outputText( '.  You give her a knowing smile, ' + CoC.player.mf( 'man', '\'woman\'' ) + ' to woman, and rock forward, sliding through her puffy labia and into her silky canal.  Those wet hyena-lips cling to every vein and rigid nook of your ' + Descriptors.cockDescript( x ) + ', slurping your penis down the slick tunnel with hungry undulations.' );
		EngineCore.outputText( '\n\nAs soon as you finish your slow glide into that wondrous passage, you drop forward over your prize to look her in the eyes, admiring the smears of cock-cream you dripped and wiped over her muzzle.  Her pouty black lips are trembling, and inspired by the exquisite sensations migrating through your ' + Descriptors.cockDescript( x ) + ', you kiss her, not as her lover but as her owner.  You ply her mouth with brutal, forceful kisses, raping her lips with your tongue, twining it around her own as you pillage her confused visage with a bruisingly rough french.  Her animal-like ears quickly begin to twitch, and her back arches, pressing her nipples into your [chest] as she sensually writhes beneath you.' );
		EngineCore.outputText( '\n\nYou reach down to crudely grope at her perky tits, squeezing the soft mounds in your fingers as you take her completely, your hips bouncing atop hers hard enough to shake the table.  The whole structure rocks slightly, rattling against the wall with loud knocks.  You pound her pussy hard, her useless balls jostle uncomfortably, passing momentary glimpses of displeasure through her sex-fueled rictus.  Her pre-spunk, which coated her toned abs long ago, has puddled up to such a degree that it\'s rolling down her sides in small rivers, lubricating the wood below enough that she\'s begin to slip and slide across it.  You break the kiss to look her in the eye, and with another squeeze of her enjoyable little titty, you say, "<i>You\'re MY bitch.</i>"' );
		EngineCore.outputText( '\n\nA high-pitched whine escapes from Heckel\'s mouth.  In seconds, it rises to a keening wail, exploding into a full-blown, orgasmic screech a moment later.  Heckel pumps against you, her labia oozing lubricant while her pussy begins to spasm with wild undulations.  A wasted spurt of cum explodes from her oozing cock-slit onto her belly, followed a moment later by a thicker blast that glazes the under-curve of her breasts.  Her knot inflates, ballooning cartoonishly throughout her orgasm as she continues to squirt and splort with reckless abandon.  Jizz splashes across her nipples, puddles in her belly button, and even catches her in the chin.  Her screaming moan dies down as her balls empty, but that doesn\'t stop her cunt from trying to wring you dry, and indeed, your maleness is on the cusp of submitting to that hungry pussy.' );
		EngineCore.outputText( '\n\nYou pump one last time into the hole, mashing your groin into her mons with a tit-shaking thrust, and cum.  Your ' + Descriptors.cockDescript( x ) + ' pulses powerfully, sending jet after jet of your orgasmic bliss deep into your conquest\'s crotch.  She mewls in ecstatic bliss as you fill her, shaking weakly, her orgasm enhanced by the cream filling.  Watching her eyes roll back slightly until they\'re half-hidden behind her lids only excites you further, and like a cat with a mouse, you gloat over your prize.' );
		if( CoC.player.cumQ() > 500 ) {
			EngineCore.outputText( '  Your potent virility does a superb job of seeding Heckel\'s womb, stuffing it nice and full while streamers of white escape around your girth.' );
			if( CoC.player.cumQ() >= 1000 ) {
				EngineCore.outputText( '  Still, you keep blasting wad after wad of spunk inside her, and her belly rounds nicely, puffed up with virile sperm.' );
			}
			if( CoC.player.cumQ() >= 2000 ) {
				EngineCore.outputText( '  Your spooge is seemingly without end, pouring out endlessly long after she\'s spunk-gravid and nearly immobile.  The rivers that run from her abused cunt-lips quickly turn the table into a puddle.' );
			}
			if( CoC.player.cumQ() >= 3000 ) {
				EngineCore.outputText( '  That puddle then drips to the floor to make an alabaster lake' );
				if( CoC.player.cumQ() >= 4000 ) {
					EngineCore.outputText( ' at least ' );
					if( CoC.player.cumQ() < 10000 ) {
						EngineCore.outputText( 'a foot deep' );
					} else if( CoC.player.cumQ() < 15000 ) {
						EngineCore.outputText( 'knee high by most measurements' );
					} else if( CoC.player.cumQ() < 20000 ) {
						EngineCore.outputText( 'waist high' );
					} else {
						EngineCore.outputText( 'as high as the table' );
					}
				}
				EngineCore.outputText( '.  Thank the gods for drains.' );
			}
		}
		if( CoC.player.cockTotal() > 1 ) {
			EngineCore.outputText( '  Your other member' );
			if( CoC.player.cockTotal() > 2 ) {
				EngineCore.outputText( 's contribute' );
			} else {
				EngineCore.outputText( ' contributes' );
			}
			EngineCore.outputText( ' as well, turning her hips and thighs into a wonderland of ivory-soaked fur.' );
		}
		EngineCore.outputText( '\n\nOnly once you have fully sated yourself upon the still-climaxing herm\'s vagina do you pull out.  Her gash gapes in the shape of your maleness as you exit, dribbling sperm and continuing to convulse anew, milking the phantom member she wishes were still inside her.  You plop your ' + Descriptors.cockDescript( x ) + ' into her mouth, and she licks it without thought or question, cleaning the mixed love-juices from you until you shine with her glossy spit.' );
		EngineCore.outputText( '\n\nHeckel moans again when you take your cock away from her lewd licks.  Looking over her, you admire your handiwork and get dressed, feeling utterly satisfied.' );
		if( EngineCore.silly() ) {
			EngineCore.outputText( '  You grab a bacon shake from the shake-cart on your way out' );
			if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00281 ] > 0 ) {
				EngineCore.outputText( ', then give Lottie a high five' );
			}
			EngineCore.outputText( '.  You really love bacon.' );
		}
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -2 );
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
	};
	SceneLib.registerScene( 'heckel', new Heckel() );
} );