﻿'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, $log, Descriptors, EventParser, ConsumableLib, PerkLib, AppearanceDefs, Appearance, CockTypesEnum, StatusAffects, Utils, CoC, kFLAGS, EngineCore ) {
	function Farm() {
	}

	Farm.prototype.whitneySprite = function() {
		EngineCore.spriteSelect( 62 );
	};
	Farm.prototype.farmExploreEncounter = function() {
		EngineCore.outputText( 'Whitney marches up to you as soon as you approach the farm, a stoic expression plastered across her face.' );
		if( CoC.flags[ kFLAGS.FARM_CORRUPTION_STARTED ] > 0 ) {
			SceneLib.farmCorruption.rootScene();
			return;
		}
		if( SceneLib.farmCorruption.takeoverPrompt() === true ) {
			return;
		}
		if( CoC.flags[ kFLAGS.FARM_DISABLED ] === 1 ) {
			EngineCore.outputText( 'Whitney marches up to you as soon as you approach the farm, a stoic expression plastered across her face.' );
			EngineCore.outputText( '\n\n"<i>What the fuck do you think you\'re doing here [name]? After what you did to Marble you still think you\'re welcome here? Leave. <b>Now</b>.</i>"' );
			EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		//Farm not yet discovered;
		if( CoC.player.statusAffectv1( StatusAffects.MetWhitney ) < 2 ) {
			EngineCore.spriteSelect( 62 );
			if( CoC.player.findStatusAffect( StatusAffects.MetWhitney ) < 0 ) {
				CoC.player.createStatusAffect( StatusAffects.MetWhitney, 0, 0, 0, 0 );
				EngineCore.outputText( 'You find a quaint farmhouse on the far shores of the lake.  Around the homestead are a range of gardens, filled with delicious fruits and vegetables.  Your belly rumbles, aching with hunger, as you approach the dwelling.  A figure in a pepper patch rises up to greet you, waving you over.\n\nYou do your best to conceal your surprise as you realize the farmer is a woman... with fur and canine-like features!  She giggles happily and beckons you over, "<i>Welcome stranger, it sure is pleasant to see a new face \'round here.  My name\'s Whitney, and it\'s mighty fine I don\'t have to pitchfork you like most guests!</i>"  She fills you in about the lake and her farm, telling you how the demons can\'t seem to stay close for long, and monsters always seem weaker the few times they have approached her farm.  Whitney flushes and rapidly changes subject, "<i>I\'ve got to get back to work, but you help yourself to the peppers, hun!</i>"\n\n', true );
			} else {
				EngineCore.outputText( 'You stumble across Whitney\'s farm again.  The anthropomorphic canine woman gives you a friendly wave and tosses you another Canine pepper.\n\n', true );
				CoC.player.addStatusValue( StatusAffects.MetWhitney, 1, 1 );
				if( CoC.player.statusAffectv1( StatusAffects.MetWhitney ) === 2 ) {
					EngineCore.outputText( '<b>You\'ve been to the farm enough to easily find it.  You can return by selecting it from the places menu (and will no longer encounter it during random lake exploration)</b>.\n\n', false );
				}
			}
			SceneLib.inventory.takeItem( ConsumableLib.CANINEP, SceneLib.camp.returnToCampUseOneHour );
		}
		//Repeat Offender;
		else {
			EngineCore.spriteSelect( 62 );

			if( CoC.flags[ kFLAGS.KELT_BREAK_LEVEL ] >= 4 && CoC.flags[ kFLAGS.WHITNEY_FLIPPED_OUT_OVER_KELLY ] === 0 ) {
				EngineCore.clearOutput();
				EngineCore.outputText( 'As soon as you head to the farm, Whitney comes storming up to meet you.  "<i>What in tarnation do you think you\'re pulling?!</i>"' );
				EngineCore.outputText( '\n\nYou hold your hands up, knowing full-well what the angry bitch is on about.  "<i>I didn\'t do anything he wouldn\'t have done to me.</i>"' );
				EngineCore.outputText( '\n\nWhitney fumes, "<i>You might be right on that count, but the difference is that Kelt didn\'t keep coming to you to do it.  I don\'t much like him.</i>"  Whitney spits for emphasis before continuing, "<i>But I felt bad enough for him to let him stick around, so long as he left me an\' everybody else well enough alone.  The boy\'s got... an aura or something, and sure, you likely would\'ve wound up like he is.</i>"  She glares back at the farm for emphasis.  "<i>But only if you enjoyed it enough to keep hanging around the dipstick.  You... you just kept hounding him... drugging him with them demon fluids over and over.  The poor thing can barely sleep without whimpering after your dick.</i>"' );
				EngineCore.outputText( '\n\nWhitney starts to growl before catching herself and folding her arms across her chest.  "<i>I reckon you don\'t need to be nosing around my farm anymore, but since \'Kelly\' seems to need you, I\'ll let her go out to visit you when you come calling.  Just stay away from the rest of us.</i>"' );
				EngineCore.outputText( '\n\nShe spins about and trots back to her farm, picking up a pitchfork as she goes.  It looks like you won\'t have access to the farm any more, at least until you come up with a way to deal with Whitney.' );
				CoC.flags[ kFLAGS.WHITNEY_FLIPPED_OUT_OVER_KELLY ] = 1;
			} else if( CoC.flags[ kFLAGS.WHITNEY_FLIPPED_OUT_OVER_KELLY ] === 1 ) {
				EngineCore.outputText( 'You aren\'t welcome on the farm proper, but you can see Kelly cantering about the fields, looking for you.', true );
			} else {
				EngineCore.outputText( 'Whitney\'s farm is remarkably large for such a humble operation.  What do you want to do?', true );
			}
			EngineCore.menu();
			if( CoC.player.findStatusAffect( StatusAffects.Kelt ) >= 0 && CoC.player.findStatusAffect( StatusAffects.KeltOff ) < 0 ) {
				if( CoC.flags[ kFLAGS.KELT_BREAK_LEVEL ] >= 4 ) {
					EngineCore.addButton( 1, 'Kelly', SceneLib.kelly.kelly.breakingKeltOptions );
				} else {
					EngineCore.addButton( 1, 'Kelt', SceneLib.kelly.breakingKeltOptions );
				}
			}
			if( CoC.player.hasKeyItem( 'Breast Milker - Installed At Whitney\'s Farm' ) >= 0 ) {
				if( CoC.player.findStatusAffect( StatusAffects.Milked ) >= 0 ) {
					EngineCore.outputText( '\n\n<b>Your ' + Descriptors.nippleDescript( 0 ) + 's are currently too sore to be milked.  You\'ll have to wait a while.</b>', false );
				} else if( CoC.flags[ kFLAGS.WHITNEY_FLIPPED_OUT_OVER_KELLY ] === 0 ) {
					EngineCore.addButton( 2, 'Get Milked', this.getMilked );
				}

			}
			if( CoC.player.hasKeyItem( 'Cock Milker - Installed At Whitney\'s Farm' ) >= 0 && CoC.player.cockTotal() > 0 ) {
				if( CoC.flags[ kFLAGS.WHITNEY_FLIPPED_OUT_OVER_KELLY ] === 0 ) {
					EngineCore.addButton( 5, 'Milk Cock', this.cockPumping );
				}
			}
			if( CoC.player.findStatusAffect( StatusAffects.MarbleRapeAttempted ) < 0 && CoC.player.findStatusAffect( StatusAffects.NoMoreMarble ) < 0 && CoC.player.findStatusAffect( StatusAffects.Marble ) >= 0 && CoC.flags[ kFLAGS.MARBLE_WARNING ] === 0 ) {
				if( CoC.flags[ kFLAGS.WHITNEY_FLIPPED_OUT_OVER_KELLY ] === 0 ) {
					EngineCore.addButton( 3, 'Marble', this.meetMarble );
				}
			}
			if( CoC.flags[ kFLAGS.WHITNEY_FLIPPED_OUT_OVER_KELLY ] === 0 ) {
				EngineCore.addButton( 0, 'Explore', this.exploreFarm );
			}
			if( CoC.flags[ kFLAGS.WHITNEY_FLIPPED_OUT_OVER_KELLY ] === 0 ) {
				EngineCore.addButton( 6, 'Talk', this.talkWhitney );
			}
			if( CoC.flags[ kFLAGS.WHITNEY_FLIPPED_OUT_OVER_KELLY ] === 0 ) {
				EngineCore.addButton( 7, 'Work', this.workFarm );
			}
			EngineCore.addButton( 9, 'Leave', SceneLib.camp.returnToCampUseOneHour );
		}
	};
	//[YES];
	Farm.prototype.whitneyMilkerHookup = function( breast ) {
		EngineCore.spriteSelect( 62 );
		EngineCore.outputText( 'Whitney takes the gear back to her farm after promising to have it working within the hour.  She did leave you with a cryptic warning to "<i>leave the milkings to the beasts, lest you become one</i>.</i>"\n\nYou shrug and head back to check up on camp.', true );
		if( breast === undefined || breast ) {
			CoC.player.createKeyItem( 'Breast Milker - Installed At Whitney\'s Farm', 0, 0, 0, 0 );
			CoC.player.removeKeyItem( 'Breast Milker' );
		} else {
			CoC.player.createKeyItem( 'Cock Milker - Installed At Whitney\'s Farm', 0, 0, 0, 0 );
			CoC.player.removeKeyItem( 'Cock Milker' );
		}
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
	};
	//[NO];
	Farm.prototype.whitneyMilkerRefusal = function() {
		EngineCore.spriteSelect( 62 );
		EngineCore.clearOutput();
		EngineCore.outputText( 'Whitney shrugs and the two of you resume your conversation.  But like all good things, it has to come to an end.  The two of you go your separate ways.' );
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
	};
	//TALK;
	Farm.prototype.talkWhitney = function() {
		EngineCore.spriteSelect( 62 );
		//[FIND WHITNEY TXT];
		EngineCore.outputText( '', true );
		//Centaur Hookups!;
		if( CoC.player.hasKeyItem( 'Fake Mare' ) < 0 && CoC.player.isTaur() ) {
			this.centaurToysHoooooo();
			return;
		}
		// Requires: PC has met both Marble and Kelt;
		if( CoC.flags[ kFLAGS.MURBLE_FARM_TALK_LEVELS ] > 0 && CoC.player.findStatusAffect( StatusAffects.Kelt ) >= 0 && CoC.flags[ kFLAGS.WHITNEY_TALK_MURBLE_AND_KELT ] === 0 ) {
			CoC.flags[ kFLAGS.WHITNEY_TALK_MURBLE_AND_KELT ] = 1;
			EngineCore.outputText( 'You find Whitney in her usual spot underneath her tree, nose in book. She smiles at you distractedly as you approach.' );
			EngineCore.outputText( '\n\n“<i>Notice you’ve been nosey-ing around the place,</i>” she says. It’s difficult to tell from her bluff tone whether she’s teasing or accusing you; the dog morph has the mannerisms of a woman who has lived alone for some time. “<i>What do you make of my lil\' place?</i>” You answer truthfully that is very peaceful and pretty, almost incongruously so in this savage and rapacious land. You say it seems like a very well-run operation, given that the only people who seem to be working on it are her, Marble and... your brow clouds. Whitney smiles understandingly.' );
			EngineCore.outputText( '\n\n“<i>Those two are hard workers, in their own different ways. Doubt I’d be able to keep the farm going without them.</i>” She sighs. “<i>When you are out in the sticks like this, you have to make allowances for the people you find yourself lumped together with. Be understanding, and look for the good in everyone. If you set boundaries and stand firm by \'em you can get by with most anyone.</i>” She looks you in the eye. “<i>You should be careful how much time you spend around just anyone, though. Some folks don’t have your best interests at heart. Some others think they do, and they’re even more dangerous. Know what I mean?</i>” Not particularly, but you get the distinct impression you’re being warned about something. Feeling slightly unsettled, you politely take your leave. Whitney nods once and returns to her book, the picture of placidity.' );
			EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		// Requires: PC has entered Tel’Adre;
		if( CoC.player.findStatusAffect( StatusAffects.TelAdre ) >= 0 && CoC.player.statusAffectv1( StatusAffects.TelAdre ) >= 1 && CoC.flags[ kFLAGS.WHITNEY_TALK_TELADRE ] === 0 && CoC.flags[ kFLAGS.WHITNEY_TALK_MURBLE_AND_KELT ] === 1 ) {
			CoC.flags[ kFLAGS.WHITNEY_TALK_TELADRE ] = 1;
			EngineCore.outputText( 'You find the dog woman sitting on a stool, engaged in hand-milking a cow. She looks up sharply at your approach but smiles readily enough when she sees it’s you.' );
			EngineCore.outputText( '\n\n“<i>Hey stranger! How you doin\'?</i>” Feeling slightly strange standing next to her whilst she pulls briskly at the teats of the cow staring dully into your face, you describe the rather incredible city in the desert you stumbled upon recently and ask whether she’s ever visited it. “<i>Heh. Well, of course I have,</i>” says Whitney, not looking up. “<i>Used to live there, back in the day. Urta still around? Went to school with her, and afterwards she persuaded me to join the guard with her. Everydog has a duty! That was her by-word.</i>” The dog morph laughs. “<i>She was just scared of bunking on her own. Silly thing, but a good friend.</i>”' );
			EngineCore.outputText( '\n\nYou ask why she left.' );
			EngineCore.outputText( '\n\n“<i> I had my reasons. I grew up in the country, </i>” she goes on after a short pause, “<i>and never held much with city life. Particularly not hot, dusty, close ‘n stinky city life. Course farm life is stinky too,</i>” she acknowledges as she heaves up the milk pail and starts to walk it towards a barn. You offer to help, but she shakes her head. “<i> But least here it’s stink you’ve created yourself. I moved out here eight years ago, and never regretted it. As for Urta... well, she was finding better friends at the bottom of bottles by then. </i>” She disappears into the barn with the milk, and you decide to leave it at that.' );
			EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		// Requires: PC has found High Mountain;
		if( CoC.flags[ kFLAGS.DISCOVERED_HIGH_MOUNTAIN ] > 0 && CoC.flags[ kFLAGS.WHITNEY_TALK_HIGH_MOUNTAIN ] === 0 && CoC.flags[ kFLAGS.WHITNEY_TALK_TELADRE ] === 1 ) {
			CoC.flags[ kFLAGS.WHITNEY_TALK_HIGH_MOUNTAIN ] = 1;
			EngineCore.outputText( 'You find Whitney outside the milking shed, carefully writing labels at a trestle table and sticking them on large bottles of milk.' );
			//[PC has used milking device:;
			if( CoC.player.findStatusAffect( StatusAffects.BreastsMilked ) >= 0 ) {
				EngineCore.outputText( ' You are uncomfortably aware of the number of them which are labelled ‘[name]’, and a charged memory of strong suction on your [nipples] comes back to you.' );
			}
			if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00331 ] > 0 && CoC.flags[ kFLAGS.ISABELLA_MILKED_YET ] !== -1 ) {
				// Jojo only;
				EngineCore.outputText( ' At the far end there is a small alabaster cluster labelled ‘Jojo’.' );
			} else if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00331 ] === 0 && CoC.flags[ kFLAGS.ISABELLA_MILKED_YET ] === -1 ) {
				// Isabella Only;
				EngineCore.outputText( ' At the far end there is a small alabaster cluster labelled ‘Isabella’.' );
			} else if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00331 ] > 0 && CoC.flags[ kFLAGS.ISABELLA_MILKED_YET ] === -1 ) {
				// Both;
				EngineCore.outputText( ' At the far end there is one alabaster cluster labelled ‘Jojo’, another labelled ‘Isabella’.' );
			}
			EngineCore.outputText( ' You ask her who she sells it all to.' );
			EngineCore.outputText( '\n\n“<i>Centaurs ‘n goblins mainly,</i>” she replies. “<i>Sometimes even get the mountain folk coming down here to trade. Milk’s a rare enough commodity to a harpy or basilisk to get \'em to stop ruttin\' an\' fighting for two minutes and buy some.</i>” She sighs. “<i>Used to be you could talk with em, get news, but they mostly don’t even bother doing that anymore - just point at what they want, throw their gems down and leave. Gnolls and imps like milk too,</i>” she goes on in a harder tone, “<i>but they prefer tryin\' stealin\' it. Marble and Kelt deal with them.</i>”' );
			// [PC has used milking device:;
			if( CoC.player.findStatusAffect( StatusAffects.BreastsMilked ) >= 0 ) {
				EngineCore.outputText( '\n\nShe smiles at you. “<i>I charge top gem for your produce, of course. Human milk is a very rare commodity these days, and it has a powerful calming effect on most anyone. Folks love it for their kids.</i>”' );
			}
			//[PC has used cock milker: ;
			if( CoC.player.findStatusAffect( StatusAffects.CockPumped ) >= 0 ) {
				if( CoC.player.findStatusAffect( StatusAffects.BreastsMilked ) < 0 ) {
					EngineCore.outputText( '\n\n' );
				}
				EngineCore.outputText( 'You notice a number of smaller bottles filled with a creamy fluid on the table, arranged in a cargo container. It takes you a moment to realize what it is. “<i>Why d’you think I pay you for it?</i> ” says Whitney with a laugh, catching your expression. “<i>I kin use some of it for my herd, but it’s just as easy to sell it to goblins ‘n harpies. Much better to buy it from me than to waste energy catching and beating it out of a satyr. \'Sides, how\'d ya think I kept my hair so luxurious? Goblin hairdressers are top notch.</i>”' );
			}
			EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		// Requires: PC cleared Factory;
		if( CoC.player.findStatusAffect( StatusAffects.DungeonShutDown ) >= 0 && CoC.flags[ kFLAGS.WHITNEY_TALK_DUNGEON ] === 0 && CoC.flags[ kFLAGS.WHITNEY_TALK_HIGH_MOUNTAIN ] === 1 ) {
			CoC.flags[ kFLAGS.WHITNEY_TALK_DUNGEON ] = 1;
			EngineCore.outputText( 'Whitney isn’t anywhere around the farm buildings. You take a guess and walk out to the tree in the far field: sure enough you spot a figure in a sunhat sat underneath it as you draw close. Having spent a fair amount of time around the farm you have come to appreciate that this is indeed the best spot on it; it is on a small rise from which the shade of the mighty oak allows a person to see all the farm buildings and the lake, though the latter is beyond the curve of the land, glimmering in the near distance. Whitney looks up at you as you take it in, listening to the wind in the leaves.' );
			EngineCore.outputText( '\n\n“<i>Look like you’ve got a story to tell, [name]. What’s up?</i>” Haltingly at first, you describe your attack on the demon factory, the sexual horrors you found inside, and finally the revelation the overseer gloatingly laid on you: that the elders of Ignam sold your village’s youth into twisted slavery, and how you only narrowly avoided that same fate. Whitney’s eyes are quite round by the time you’ve finished.' );
			EngineCore.outputText( '\n\n“<i>That’s... that’s an amazing tale, [name]. It’s so easy down here to believe that such evil doesn’t exist in this world but it does; oh it does. An\' there\'re people as brave as you that are willing to stand against it. That’s difficult to believe sometimes too.</i>” She looks away and opens her mouth several times, stopping each time, before finally going on in a quieter tone.' );
			EngineCore.outputText( '\n\n“<i>I knew a guy who was like you, once. Met him soon after I joined up with the Tel’Adre guard. Kind ‘n funny in a stupid kinda way, \'an brave. Liked him enough that I married him.</i>” She looks off down to the lake. “<i>You have to be real brave to sign up for desert patrol. It ain’t for your benefit. It ain’t for Tel’Adre’s benefit. It’s just to scout for folks who are in trouble, survivors and runaways. The demons know about the existence of the city, oh they do, and they’re always lookin\' for ways in. I think they\'re mostly lookin\' to poison it like they did with the goblins, but they like informers too - captives. Gods, do they like captives.</i>”' );
			EngineCore.outputText( '\n\nShe stops for such a long while that you wonder whether she’s finished. “<i>Could- could you recognise any of those prisoners? The ones from your town. You said some of em stayed even when you freed em. What did you think about that? I often wonder- is it better never to know what happened to somebody, or find em and discover nothing but a twisted shell of what you remember: a soulless monster who even likes what’s been done to em?</i>” She stops and you think you see tears glittering in eyes still gazing at the lake. You wait a little longer but evidently that’s all you’re getting. You put a hand on her shoulder and then quietly walk away.' );
			EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		// Subsequent visit;
		if( CoC.flags[ kFLAGS.WHITNEY_TALK_DUNGEON_FOLLOWUP ] === 0 && CoC.flags[ kFLAGS.WHITNEY_TALK_DUNGEON ] === 1 ) {
			CoC.flags[ kFLAGS.WHITNEY_TALK_DUNGEON_FOLLOWUP ] = 1;
			EngineCore.outputText( 'You find Whitney hard at work in the pepper patch. You approach her cautiously, but when she sees you she hails you brightly.' );
			EngineCore.outputText( '\n\n“<i>Hey there [name]! I’m afraid I’m almost done here fer the day - can’t get your hands dirty this time, I’m afraid!</i>” You hold the gate open as she hauls a paper bag full of peppers over and plonks it on the ground. As you are closing it again a hand falls on yours.' );
			EngineCore.outputText( '\n\n“<i>Listen [name],</i>” says Whitney hesitantly, “<i>I reckon I might come across as a bit... distant sometimes, but you know I \'preciate you coming down here to talk all the time, right? I like that a lot. Nobody \'round here is exactly a great conversationalist, and it’s nice to have someone who jus\' listens. Particularly if they’re off savin\' the world rest of the time.</i>” Slightly taken aback by her sincerity, you say it’s no big deal; you like hanging around the farm with her, too. She smiles broadly at that, and then with a nod of her head invites you to walk with her down to the storage barn. As delicately as you can, you ask her if she left Tel’Adre because of what happened to her husband.' );
			EngineCore.outputText( '\n\n“<i>Color kinda disappeared from that place for me,</i>” she replies. “<i>Maybe I coulda done what Urta did and used alcohol to make it feel better, but... I dunno. I couldn’t bear the sympathy and I couldn’t bear hanging around the same places he once did. I just wanted to be on my own. So I sold everything I had, used it to buy seed and supplies, then came out here, where I knew there was a ruin of a farm.</i>” She laughs shortly. “<i>\'Course I knew. My family used to live here, \'til the demons came. My ma and pa thought they were so dang lucky to get me to Tel’Adre in one piece, and they thought I was so dang crazy to come out here again. Just told em it was something I had to do.</i>” She shakes her head fondly as she throws a knot in the pepper bag’s mouth and then shoves it into the gloom of the barn. “<i>Pa still sometimes comes out here, try’na persuade me to sell up and move back. Sell to who, I tell him? Anyways I think I’m reasonably safe. Demons have got bigger fish to fry these days.</i>” She looks at you with something different in her expression, and it takes you a while to realize what it is - real belief.' );
			EngineCore.outputText( '\n\nYou say goodbye with a hug and leave with a funny feeling in your gut.' );
			EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		EngineCore.outputText( Utils.randomChoice(
			'It doesn\'t take long to find the independent farmer-girl.\n\n',
			'She\'s patrolling the edges of her farm with a wicked-looking scythe in hand.  She nods to you as you approach and fall in beside her.\n\n',
			'She\'s bent over in the pepper fields, pulling weeds left and right.  She stands up straight to wipe sweat from her fur and muzzle, and she gives you a friendly wave, encouraging you to come over and talk while she works.\n\n',
			'She\'s behind the barn, working a forge and repairing a few damaged farming tools.  Though her attention is focused on the metal on the anvil and the hammer in her hand, Whitney immediately turns and greets you, in between the blows of her hammer.\n\n',
			'She\'s rounding up a small herd of normal-looking cows.  Amazingly she has chosen to do so on foot, but is quick enough to keep up and corral her beasts.  Thankfully she\'s in the process of closing the gate to their pen when you finally catch up to her.  Whitney gives you a friendly smile as you come up to her and the two of you begin chatting immediately.\n\n',
			'She\'s leaning back against a thick tree with a wide-brimmed hat drooped low over her eyes.   You call out to her, thinking the dog-woman has fallen asleep, but her head snaps up and her alert eyes lock on to you immediately.  Maybe she wasn\'t dozing.  She calls out, "<i>Come on over and \'ave a sit, I\'m starved fer company!</i>"  You settle in for a chat.\n\n'
		), false );
		//[HAVE MILKER THAT ISN'T PLUGGED IN];
		if( Utils.rand( 4 ) === 0 && CoC.player.hasKeyItem( 'Breast Milker - Installed At Whitney\'s Farm' ) < 0 ) {
			if( CoC.player.hasKeyItem( 'Breast Milker' ) >= 0 ) {
				EngineCore.outputText( 'Before you can say much of anything, Whitney exclaims, "<i>My stars! Is that one of them demon\'s milking machines?</i>"\n\n', false );
				EngineCore.outputText( 'You nod and tell her how you liberated it from the demonic factory and explain that even though it should be fully functional, it\'ll need to connect to some other machinery to work, and it\'s way more than any one person could handle.\n\n', false );
				EngineCore.outputText( '"<i>Well of course, it needs hooked into a pump system, collection reservoir, and a power source.  It just happens I\'ve got all that equipment set up for my cows in the barn, and I reckon it\'d be easier to plug into than a girl sniffing minotaur musk,</i>" Whitney explains, "<i>If you like I could get it all set up for ya, hell, I might even toss you a few gems if you can produce enough milk.</i>"\n\n', false );
				//(, hell, if you manage to gather large enough quantities with it, I might be able to find a way to inseminate my cattle with it and be able to pay you for it.  Don't you worry none, I know ways to make this kind of thing work).</i>";
				EngineCore.outputText( 'Do you give the breast milker to Whitney for her to hook up?', false );
				EngineCore.doYesNo( this.whitneyMilkerHookup, this.whitneyMilkerRefusal );
				return;
			} else if( CoC.player.biggestLactation() >= 2 ) {
				EngineCore.outputText( 'Whitney gives you a bemused look when you settle down for a chat.\n\n', false );
				EngineCore.outputText( '"<i>Ya might wanna get that looked at darlin\',</i>" she says, gesturing at milky wetness dripping from the front of your ' + CoC.player.armorName + '.\n\n', false );
				if( CoC.player.cor < 33 ) {
					EngineCore.outputText( 'You blush with shame', false );
				} else if( CoC.player.cor <= 66 ) {
					EngineCore.outputText( 'You flush with a touch of exhibitionism', false );
				} else {
					EngineCore.outputText( 'You flush hotly and arch your back, openly displaying your milk to the dog-girl', false );
				}
				EngineCore.outputText( ' as her words sink in.   Runners of milk leak down your ' + Descriptors.allBreastsDescript() + ', released by the stress of being so exposed.   In no time flat you\'re soaked in milk.\n\n', false );
				EngineCore.outputText( 'Whitney starts to giggle, but immediately stifles it, apologizing, "<i>Ah\'m sorry, I didn\'t mean nothing by it.  I know a few folks who LOVE being a walking milk-fountain.  If ya like, I could probably get you set up with your own milking equipment.   You\'d be able to keep up with the... fluid accumulations that seem to be troubling you.   I\'d even be able to toss you a few gems if you produce enough.</i>"\n\n', false );
				EngineCore.outputText( 'It almost sounds too good to be true.   The farmer-girl nods, reading your expression quite clearly, "<i>Yes, there is a bit of a catch.  I\'ll need 250 gems for the parts to get this all set up.   Equipment like this isn\'t cheap.   Whaddya say, hun?   I understand if you don\'t want to – you can always just wait for the milk to stop.</i>"\n\n', false );
				if( CoC.player.gems >= 250 ) {
					EngineCore.outputText( 'Do you purchase a breast-milker from Whitney for 250 gems?', false );
					EngineCore.doYesNo( this.breastMilkerPurchase, this.breastMilkerNoPurchase );
				} else {
					EngineCore.outputText( 'You don\'t have enough money for the milker.  You apologize and head back to camp, maybe you can get one later.', false );
					EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
				}
				return;
			}
		}
		//[HAVE COCK MILKER THAT ISN'T PLUGGED IN];
		if( Utils.rand( 4 ) === 0 && CoC.player.hasKeyItem( 'Cock Milker - Installed At Whitney\'s Farm' ) < 0 && CoC.player.hasKeyItem( 'Cock Milker' ) >= 0 ) {
			EngineCore.outputText( 'Before you can say much of anything, Whitney exclaims, "<i>My stars! Is that one of them demon\'s milking machines?</i>"\n\n', false );
			EngineCore.outputText( 'You nod and tell her how you got it and explain that even though it should be fully functional, it\'ll need to connect to some other machinery to work, and it\'s way more than any one person could handle.\n\n', false );
			EngineCore.outputText( '"<i>Well of course, it needs hooked into a pump system, collection reservoir, and a power source.  It just happens I\'ve got all that equipment set up for my cows in the barn, and I reckon it\'d be easier to plug into than a girl sniffing minotaur musk.</i>" Whitney explains, "<i>If you like I could get it all set up for ya, hell, if you manage to gather large enough quantities with it, I might be able to find a way to inseminate my cattle with it and pay ya for it.  Don\'t you worry none, I know ways to make this kind of thing work.</i>"\n\n', false );
			EngineCore.outputText( 'Do you give the cock milker to Whitney for her to hook up?', false );
			EngineCore.doYesNo( EngineCore.createCallBackFunction( this.whitneyMilkerHookup, false ), this.whitneyMilkerRefusal );
			return;
		}
		//[GENERIC TALK];
		EngineCore.outputText( 'You tell her of your recent trials and tribulations ', false );
		if( CoC.player.cor > 50 ) {
			EngineCore.outputText( 'or at least the parts you think she would want to hear ', false );
		}
		EngineCore.outputText( 'and she listens attentively, chiming in with witty quips and comfort when appropriate.  When you finish she tells you ', false );
		if( CoC.player.findStatusAffect( StatusAffects.FactoryOverload ) < 0 ) {
			EngineCore.outputText( 'how well the farm has been going', false );
		} else {
			EngineCore.outputText( 'how poorly the farm has been going since the lake became tainted.  She has to work three times as hard to keep her livestock and crops from succumbing to the taint, and the demons and monsters of the forest are many times more bold', false );
		}
		EngineCore.outputText( '.  It feels good to get a chance to talk with another sane individual, but before long Whitney has to return to work, and you should check back on your camp.', false );
		//+3 int if less than 15, +2 int if less 20, +1 int if less than 30, +.5 int if less than 40.;
		if( CoC.player.inte < 15 ) {
			EngineCore.dynStats( 'int', 1 );
		}
		if( CoC.player.inte < 20 ) {
			EngineCore.dynStats( 'int', 1 );
		}
		if( CoC.player.inte < 30 ) {
			EngineCore.dynStats( 'int', 0.5 );
		}
		if( CoC.player.inte < 40 ) {
			EngineCore.dynStats( 'int', 0.5 );
		}
		EngineCore.dynStats( 'lus', -5 );
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
		//+3 int if less than 15, +2 int if less 20, +1 int if less than 30, +.5 int if less than 40.;
	};
	Farm.prototype.breastMilkerPurchase = function() {
		EngineCore.outputText( 'Whitney takes the gems and leaves with the promise of having your gear set up within the hour.  She calls back over her shoulder with a cryptic warning, "<i>Watch how much time you spend getting milked like an animal, lest you wind up like one.</i>"', true );
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
		CoC.player.createKeyItem( 'Breast Milker - Installed At Whitney\'s Farm', 0, 0, 0, 0 );
		CoC.player.gems -= 250;
		EngineCore.statScreenRefresh();
	};
	Farm.prototype.breastMilkerNoPurchase = function() {
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
		EngineCore.outputText( 'Whitney shrugs and the two of you chat about other things, just passing the time and enjoying a relatively normal chat.', true );
		//+3 int if less than 15, +2 int if less 20, +1 int if less than 30, +.5 int if less than 40.;
		if( CoC.player.inte < 15 ) {
			EngineCore.dynStats( 'int', 1 );
		}
		if( CoC.player.inte < 20 ) {
			EngineCore.dynStats( 'int', 1 );
		}
		if( CoC.player.inte < 30 ) {
			EngineCore.dynStats( 'int', 0.5 );
		}
		if( CoC.player.inte < 40 ) {
			EngineCore.dynStats( 'int', 0.5 );
		}
	};
	Farm.prototype.workFarm = function() {
		var marbling = 0;
		EngineCore.outputText( '', true );
		//In withdrawl odds are higher.;
		if( CoC.player.findStatusAffect( StatusAffects.NoMoreMarble ) < 0 && CoC.player.findStatusAffect( StatusAffects.MarbleWithdrawl ) >= 0 ) {
			if( CoC.player.statusAffectv3( StatusAffects.Marble ) === 1 ) {
				SceneLib.marbleScene.addictedEncounterHappy();
			} else {
				SceneLib.marbleScene.encounterMarbleAshamedAddiction();
			}
			return;
		}
		//1/3 chance of marblez;
		if( Utils.rand( 3 ) === 0 && CoC.player.findStatusAffect( StatusAffects.NoMoreMarble ) < 0 && CoC.player.findStatusAffect( StatusAffects.Marble ) > 0 ) {
			//Rapez Override normal;
			if( CoC.player.findStatusAffect( StatusAffects.MarbleRapeAttempted ) >= 0 || CoC.flags[ kFLAGS.MARBLE_WARNING ] === 3 ) {
				SceneLib.marbleScene.marbleAfterRapeBattle();
				CoC.player.createStatusAffect( StatusAffects.NoMoreMarble, 0, 0, 0, 0 );
				return;
			}
			//Angry meeting;
			if( CoC.flags[ kFLAGS.MARBLE_WARNING ] === 1 ) {
				SceneLib.marbleScene.marbleWarningStateMeeting();
				return;
			}
			if( CoC.player.findStatusAffect( StatusAffects.Marble ) >= 0 ) {
				//Pre-addiction events(explore events take 1 hour, working ones take 3);
				if( CoC.player.statusAffectv3( StatusAffects.Marble ) === 0 ) {
					marbling = Utils.rand( 2 );
					//Help out Marble, version 1 (can occur anytime before the player becomes addicted):;
					if( marbling === 0 ) {
						SceneLib.marbleScene.helpMarble1();
					}
					//Help out Marble, version 2 (can occur anytime before Marble knows about her milk):;
					if( marbling === 1 ) {
						SceneLib.marbleScene.helpMarble2();
					}
					return;
				} else {
					if( CoC.player.findPerk( PerkLib.MarbleResistant ) >= 0 ) {
						//(work with Marble when helping);
						SceneLib.marbleScene.postAddictionFarmHelpings();
						return;
					}
					if( CoC.player.statusAffectv3( StatusAffects.Marble ) === 1 ) {
						if( CoC.player.findStatusAffect( StatusAffects.MarbleWithdrawl ) >= 0 ) {
							marbling = 0;
						} else {
							marbling = 1;
						}
						//While Addicted Events type 1 (Marble likes her addictive milk):;
						if( marbling === 0 ) {
							SceneLib.marbleScene.addictedEncounterHappy();
						}
						//Exploration event while addicted (event triggered while addicted, but not suffering withdrawal):;
						else {
							SceneLib.marbleScene.marbleEncounterAddictedNonWithdrawl();
						}
						return;
					} else {
						if( CoC.player.findStatusAffect( StatusAffects.MarbleWithdrawl ) >= 0 ) {
							marbling = 0;
						} else {
							marbling = 1;
						}
						//While Addicted Events type 2 (Marble is ashamed):;
						if( marbling === 0 ) {
							SceneLib.marbleScene.encounterMarbleAshamedAddiction();
						}
						//Exploration event while addicted (event triggered while addicted, but not suffering withdrawal):;
						else {
							SceneLib.marbleScene.marbleEncounterAddictedNonWithdrawlAshamed();
						}
						return;
					}
				}
			}
		}
		//25% chance of stable mucking;
		if( Utils.rand( 4 ) === 0 ) {
			EngineCore.spriteSelect( 62 );
			EngineCore.outputText( 'You find Whitney getting a scythe out of her tool shed. "<i>Do you know how to muck out a stable?</i>" she asks when you offer to help. You admit that you did a lot of that while growing up in your village. After passing you a rake, shovel, and pitchfork, she leads you to the milking barn.', true );
			EngineCore.outputText( '  The first thing that hits you is the smell, a mingling of sweat, milk, droppings, and rotting hay. There are also probably some cows in Whitney\'s herd ready for breeding.\n\n', false );
			EngineCore.outputText( 'Opening the door to one of the empty stalls, Whitney says, "<i>I don\'t get to them as often as I should. Anything you can do would help.</i>"\n\n', false );
			EngineCore.outputText( 'You steel yourself, ignore your ', false );
			if( CoC.player.faceType === AppearanceDefs.FACE_DOG ) {
				EngineCore.outputText( 'sensitive ', false );
			}
			EngineCore.outputText( 'nose, and set to work.', false );
			//[Lust increase based on libido, degree of cow/mino features] ;
			EngineCore.dynStats( 'lus', CoC.player.cowScore() + CoC.player.minoScore() );
			EngineCore.outputText( '\n\nAn hour later you can stand it no more and exit the milking barn. Gulping down the fresher air and dragging the tools back to their shed, you admit to yourself that Whitney is a much harder worker and has a stronger constitution than you thought. You promise yourself you\'ll come back and help her out some more -- as soon as your nose recovers.', false );
			//always +1 str till 50, then 50% chance.;
			if( CoC.player.str <= 50 ) {
				EngineCore.dynStats( 'str', 1 );
			} else {
				EngineCore.dynStats( 'str', Utils.rand( 2 ) );
			}
			EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		EngineCore.spriteSelect( 62 );
		EngineCore.outputText( 'You ask Whitney if she could use help with anything and she points towards the pepper fields, "<i>Ya mind gathering up some peppers for an hour or two?  I\'m gonna need a few for supper tonight.  I\'ll even let you keep the best one!</i>"\n\n', false );
		EngineCore.outputText( 'You nod and borrow a basket, and set off towards the fields.  The next two hours are a blur of sweat and hard work as you prowl between the rows of plants, picking as many ripe red peppers as you can find.  When you finish, you drop the basket by Whitney\'s door, but not before taking your pepper.\n', false );
		//(75% chance normal pepper, 25% chance "<i>rare</i>" pepper);
		var pepper = Utils.rand( 4 );
		var itype = pepper <= 2 ? ConsumableLib.CANINEP : Utils.randomChoice( ConsumableLib.LARGEPP, ConsumableLib.DBLPEPP, ConsumableLib.BLACKPP, ConsumableLib.KNOTTYP, ConsumableLib.BULBYPP );
		$log.debug( 'FARM SHIT: ' + itype.shortName );
		SceneLib.inventory.takeItem( itype, SceneLib.camp.returnToCampUseTwoHours );
	};
	Farm.prototype.meetMarble = function() {
		var marbling = 0;
		//Pre-addiction events(explore events take 1 hour, working ones take 3);
		if( CoC.player.statusAffectv3( StatusAffects.Marble ) === 0 ) {
			//Meet Marble while exploring version 1 (can occur anytime before the player becomes addicted):;
			//Higher chance after talk texts have been exhausted;
			if( CoC.flags[ kFLAGS.MURBLE_FARM_TALK_LEVELS ] >= 7 ) {
				SceneLib.marbleScene.encounterMarbleExploring();
			}//Meet Marble while exploring version 2 (can occur anytime before the player becomes addicted):;
			else {
				SceneLib.marbleScene.encounterMarbleExploring2();
			}
		} else {
			if( CoC.player.findPerk( PerkLib.MarbleResistant ) >= 0 ) {
				SceneLib.marbleScene.postAddictionFarmExplorings();
				return;
			}
			//PC Likes it;
			if( CoC.player.statusAffectv3( StatusAffects.Marble ) === 1 ) {
				if( CoC.player.findStatusAffect( StatusAffects.MarbleWithdrawl ) >= 0 ) {
					marbling = 0;
				} else {
					marbling = 1;
				}
				//While Addicted Events type 1 (Marble likes her addictive milk):;
				if( marbling === 0 ) {
					SceneLib.marbleScene.addictedEncounterHappy();
				}
				//Exploration event while addicted (event triggered while addicted, but not suffering withdrawal):;
				else {
					SceneLib.marbleScene.marbleEncounterAddictedNonWithdrawl();
				}
			} else {
				if( CoC.player.findStatusAffect( StatusAffects.MarbleWithdrawl ) >= 0 ) {
					marbling = 0;
				} else {
					marbling = 1;
				}
				//While Addicted Events type 2 (Marble is ashamed):;
				if( marbling === 0 ) {
					SceneLib.marbleScene.encounterMarbleAshamedAddiction();
				}
				//Exploration event while addicted (event triggered while addicted, but not suffering withdrawal):;
				else {
					SceneLib.marbleScene.marbleEncounterAddictedNonWithdrawlAshamed();
				}
			}
		}
	};
	Farm.prototype.exploreFarm = function() {
		var explore = 0;
		//Marble after-rape;
		if( CoC.player.findStatusAffect( StatusAffects.MarbleRapeAttempted ) >= 0 && CoC.player.findStatusAffect( StatusAffects.NoMoreMarble ) < 0 ) {
			SceneLib.marbleScene.marbleAfterRapeBattle();
			CoC.player.createStatusAffect( StatusAffects.NoMoreMarble, 0, 0, 0, 0 );
			return;
		}
		//FIND CARROT!;
		if( SceneLib.xmasMisc.nieveHoliday() && CoC.flags[ kFLAGS.NIEVE_STAGE ] === 3 && CoC.player.hasKeyItem( 'Carrot' ) < 0 ) {
			SceneLib.xmasMisc.findACarrot();
			return;
		}
		//Free Isabella Milkings!;
		if( CoC.player.hasCock() && CoC.flags[ kFLAGS.FOUND_ISABELLA_AT_FARM_TODAY ] === 0 && CoC.flags[ kFLAGS.ISABELLA_MILKED_YET ] < 0 && SceneLib.isabellaFollowerScene.isabellaFollower() && CoC.flags[ kFLAGS.ISABELLA_MILK_COOLDOWN ] === 0 && Utils.rand( 2 ) === 0 ) {
			SceneLib.isabellaFollowerScene.findIzzyMilking();
			return;
		}
		//Meet Marble First Time;
		if( CoC.player.findStatusAffect( StatusAffects.Marble ) < 0 && CoC.player.findStatusAffect( StatusAffects.NoMoreMarble ) < 0 ) {
			EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
			SceneLib.marbleScene.encounterMarbleInitially();
			return;
		}
		//Meet kelt 1st time;
		if( Utils.rand( 2 ) === 0 && CoC.player.findStatusAffect( StatusAffects.Kelt ) < 0 && CoC.player.findStatusAffect( StatusAffects.KeltOff ) < 0 ) {
			EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
			SceneLib.keltScene.keltEncounter();
			return;
		}
		//In withdrawl odds are higher.;
		if( CoC.player.findStatusAffect( StatusAffects.NoMoreMarble ) < 0 && CoC.player.findStatusAffect( StatusAffects.MarbleWithdrawl ) >= 0 ) {
			if( CoC.player.statusAffectv3( StatusAffects.Marble ) === 1 ) {
				SceneLib.marbleScene.addictedEncounterHappy();
			} else {
				SceneLib.marbleScene.encounterMarbleAshamedAddiction();
			}
			return;
		}
		explore = Utils.rand( 3 );
		//[JOG];
		if( explore === 0 ) {
			EngineCore.spriteSelect( 62 );
			EngineCore.outputText( 'You run around the farm, keeping an eye for any monsters or oddities around Whitney\'s property.  Eventually the she-dog joins you, and the two of you have a good time pushing your speed to its limits.  ', true );
			//Less than 30 speed (+2 speed);
			if( CoC.player.spe < 30 ) {
				EngineCore.dynStats( 'spe', 2 );
				EngineCore.outputText( 'Whitney easily outpaces you, leaving you so far behind that she laps around the farm twice for each pass you make.', false );
			}
			//Less than 50 speed (+1 speed);
			else if( CoC.player.spe < 50 ) {
				EngineCore.dynStats( 'spe', 1 );
				EngineCore.outputText( 'Whitney is still faster than you, and manages to get far enough ahead of you to disappear from time to time.', false );
			}
			//Less than 70 speed (+.75 speed);
			else if( CoC.player.spe < 70 ) {
				EngineCore.dynStats( 'spe', 0.75 );
				EngineCore.outputText( 'Whitney and you are evenly matched, and the two of you run together for a while, each pushing yourself harder in an effort to best the other.', false );
			}
			//Else (+.5 speed);
			else {
				EngineCore.dynStats( 'spe', 0.5 );
				EngineCore.outputText( 'Whitney falls behind, unable to cope with your speed as you tear around the farm.', false );
			}
			EngineCore.outputText( '\n\nAfterwards, the both of you lie back against a tree, panting heavily and exchanging pleasantries.  Once you\'ve both had a chance to rest, she bids you farewell and returns to her labors, leaving you to journey home to camp.', false );
			EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		//Other stuff;
		if( explore === 1 ) {
			EngineCore.outputText( 'After wandering around for a while, you find yourself atop a slight rise looking out over the farm and the distant lake. Despite the corruption you know is slowly consuming this land, being here now makes you feel so at peace you wish it could go on forever.', true );
			EngineCore.dynStats( 'cor', -Utils.rand( 3 ) );
			EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		//Cows;
		if( explore === 2 ) {
			EngineCore.outputText( 'Your explorations take you to the cow pasture. There\'s no bull here, so the cows are all placidly grazing, building up milk for Whitney to gather. One turns to face you, and you get the odd feeling that it\'s trying to tell you something.\n\n', true );
			//[if have a horse dick and rape-high Lust] ;
			if( CoC.player.horseCocks() > 0 ) {
				EngineCore.outputText( 'Unbidden, the notion that a cow-slit would probably feel pretty good wrapped around your horse-prick flickers through your mind.  ', false );
				//[if high corruption];
				if( CoC.player.cor > 60 ) {
					EngineCore.outputText( 'It makes you smile.', false );
				}
				if( CoC.player.cor < 30 ) {
					EngineCore.outputText( 'It disgusts you.', false );
				}
				//[else/mid-corruption] ;
				else if( CoC.player.cor <= 60 ) {
					EngineCore.outputText( 'You aren\'t sure how you feel about that.', false );
				}
				//[continue paragraph condition] ;
				EngineCore.outputText( '  It for certain would get Whitney chasing you off with a pitchfork.\n\n', false );
				EngineCore.dynStats( 'lus', 10 );
			}
			//[if no horse dick, a deep cow or horse vag, and in heat];
			else if( CoC.player.inHeat ) {
				EngineCore.outputText( 'Maybe it wants a bull? You do, one with long, thick dick-meat to satisfy your starving fuck-hole...\n\n', false );
				EngineCore.dynStats( 'lus', 15 );
			}
			//- [if no dick, not in heat, but overfull with milk];
			else if( CoC.player.biggestLactation() >= 2 ) {
				EngineCore.outputText( '"<i>Maybe she wants to be milked?</i>" you think. You certainly do.\n\n', false );
				EngineCore.dynStats( 'lus', 3 );
			}
			EngineCore.outputText( 'Shaking your head, you clear your thoughts and turn away from the pasture. Cows don\'t have your problems.', false );
			EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
			return;
		}
		if( explore === 3 ) {

		}
		//[NOTHING];
		else {
			EngineCore.outputText( 'You wander around, unable to find anything entertaining on this patch of rural bliss.', true );
			EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
		}
	};
	Farm.prototype.getMilked = function() {
		/*MILK YOU TIT-PUMPZ ONLY
		 (Milk production TOTAL= breastSize x 10 * lactationMultiplier * breast total * milking-endurance (1- default, maxes at 2.  Builds over time as milking as done)
		 (Small – 0.01 mLs – Size 1 + 1 Multi)
		 (Large – 0.8 - Size 10 + 4 Multi)
		 (HUGE – 2.4 - Size 12 + 5 Multi + 4 tits)*/
		//Lactation * breastSize x 10 (milkPerBreast) determines scene;
		//< 50 small output;
		//< 250 'good' output;
		//< 750 'high' output;
		//ELSE milk overload;
		EngineCore.outputText( '', true );
		//First time barn entrance;
		EngineCore.outputText( 'The barn looms tall ahead of you as you step into its shadow.  ', false );
		if( CoC.player.findStatusAffect( StatusAffects.BreastsMilked ) < 0 ) {
			if( CoC.player.cor < 50 ) {
				EngineCore.outputText( 'You shiver nervously when you step inside.', false );
			} else {
				EngineCore.outputText( 'You smile eagerly as you walk inside.', false );
			}
			EngineCore.outputText( '  The barn is filled with the earthy smells of earth, wood, and grease.  It\'s clean for the most part, though the floor is just packed dirt and the stalls look old and well-used.  A bank of machinery along the wall thrums and pulses as if it\'s a living creature.  Hoses and cables run from it in a dozen places, disappearing into the walls.   There is even a set of stout wooden doorways along the west wall.  That must be where the farm\'s intelligent denizens stay.  You notice each of the stalls have name-plates on them, and there is even one that says ' + CoC.player.short + '.  It must be for you.\n\n', false );
		}
		//Repeat;
		else {
			EngineCore.outputText( 'You walk over to the barn, eagerly anticipating the opportunity to get milked.', false );
			//If ilk withdrawl or high lactation no dicks;
			if( CoC.player.findStatusAffect( StatusAffects.LactationReduction ) >= 0 && CoC.player.totalCocks() === 0 ) {
				EngineCore.outputText( '  Your ' + Descriptors.nippleDescript( 0 ) + 's are engorged and ready to be taken care of.', false );
			}//If cocks;
			else if( CoC.player.totalCocks() > 0 ) {
				EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' erect', false );
				if( CoC.player.totalCocks() > 1 ) {
					EngineCore.outputText( 's', false );
				}
				EngineCore.outputText( ' and throb', false );
				if( CoC.player.totalCocks() === 1 ) {
					EngineCore.outputText( 's', false );
				}
				EngineCore.outputText( ' with desire.', false );
			}
			//If both;
			if( CoC.player.findStatusAffect( StatusAffects.LactationReduction ) >= 0 && CoC.player.cockTotal() > 0 ) {
				EngineCore.outputText( 'Your ' + Descriptors.nippleDescript( 0 ) + 's and ' + Descriptors.multiCockDescriptLight() + ' grow', false );
				EngineCore.outputText( ' hard and ready of ', false );
				EngineCore.outputText( 'their', false );
				EngineCore.outputText( ' own volition.', false );
			}
			EngineCore.outputText( '  The doors part easily, and you breeze into your stall in a rush.\n\n', false );
		}
		//Step into harness – first time only;
		if( CoC.player.findStatusAffect( StatusAffects.BreastsMilked ) < 0 ) {
			EngineCore.outputText( 'A harness hangs limply in the stall, there to hold the occupant in place while they are milked of every last drop.  You exhale slowly and force yourself to step into it.  As you puzzle out the straps, it gets easier and easier to get the rest of the harness into place.  As you snap the last one into position, machinery whirs and pulls it tight, lifting you off the ground and suspending you, facedown.  The breast milk pumps pulse and vibrate on a tray below you, twitching slightly as you hear the machinery activate.\n\n', false );
		}
		//REPEAT;
		else {
			EngineCore.outputText( 'You easily attach the harnesses and lift up into position, hearing the machinery activate automatically. ', false );
		}
		var application = Utils.rand( 3 );
		//Super huge nips scene;
		if( CoC.player.nippleLength === 3 && Utils.rand( 2 ) === 0 ) {
			application = 3;
		}
		//Apply;
		if( CoC.player.findStatusAffect( StatusAffects.BreastsMilked ) < 0 || application === 0 ) {
			if( CoC.player.findStatusAffect( StatusAffects.BreastsMilked ) < 0 ) {
				CoC.player.createStatusAffect( StatusAffects.BreastsMilked, 0, 0, 0, 0 );
			}
			EngineCore.outputText( 'You manage to grab the suction cups in spite of your constrictive bindings and pull them to your ' + Descriptors.nippleDescript( 0 ) + 's.  They latch on immediately, ', false );
			if( CoC.player.nippleLength <= 1.5 ) {
				EngineCore.outputText( 'pulling each of your nipples entirely into the suction-tubes.  ', false );
			} else {
				EngineCore.outputText( 'struggling to fit around each of your nipples as they slide into the suction-tubes.  ', false );
			}
			EngineCore.outputText( 'There is a mechanical lurching noise as the suction builds rapidly.  Your nipple swells out to ' + Math.ceil( CoC.player.nippleLength * 1.5 * 10 ) / 10 + ' inches of length, turning purplish from the strain.   You can feel something welling up inside your ' + Descriptors.allBreastsDescript() + ', building as it moves towards your ' + Descriptors.nippleDescript( 0 ) + 's.\n\n', false );
		}
		//Apply repeat alternate;
		else if( application === 1 ) {
			EngineCore.outputText( 'You stretch down and grab onto the suction cups, pulling them up to your eager nipples.  They latch on, slapping tight against you as the vacuum pressure seals them tightly against your body.  You can feel your ' + Descriptors.nippleDescript( 0 ) + 's pulling tight, nearly doubling in size from the intense pressure.  ', false );
			if( CoC.player.nippleLength >= 3 ) {
				EngineCore.outputText( 'They nearly burst the tubes designed to milk them by virtue of their sheer size.  ', false );
			}
			EngineCore.outputText( 'The sensitive flesh of your ' + Descriptors.allBreastsDescript() + ' fill with a burgeoning pressure that centers around the tubes connected to your nips.\n\n', false );
		}
		//Version 3;
		else if( application === 2 ) {
			EngineCore.outputText( 'Despite the tightness of your harness, you manage to reach down to grab the clear cups of the breast milker.  The cups twitch and move in your hands as you bring them up, ready to milk you.  You begin holding them against your ' + Descriptors.nippleDescript( 0 ) + 's and with a sudden lurch the suction pulls against you, pressing the breast-milker\'s cups tightly against your chest, stretching your ' + Descriptors.nippleDescript( 0 ) + 's to nearly twice their normal length.  You feel a building pressure as the machine sucks you relentlessly, drawing your milk to the surface.\n\n', false );
		}
		//Version 4 huge nips;
		if( application === 3 ) {
			EngineCore.outputText( 'In spite of the tightness of your harness, you collect the suction cups and bring them up to your huge nipples, letting the machine pull them into the tight cups with agonizing slowness.  In spite of the large size of your aureola, the machine slowly sucks you inside, the tightness serving only to arouse you further.  The suction pulls the walls of the nipple-tubes tight against your nipples, turning them purple as they swell up like dicks.  Drops of milk leak from the tips as your body lets your milk down, letting it flow through your imprisoned nipples towards its release.\n\n', false );
			EngineCore.dynStats( 'lus', 10 );
		}
		//Milksplosion Texts;
		//Lactation * breastSize x 10 (milkPerBreast) determines scene;
		//< 50 small output;
		//< 250 'good' output;
		//< 750 'high' output;
		//ELSE milk overload;
		var milksplosion = Utils.rand( 3 );
		//Lightish (+15 lust);
		if( CoC.player.lactationQ() < 50 ) {
			EngineCore.dynStats( 'lus', 15 );
			if( milksplosion === 0 ) {
				EngineCore.outputText( 'A few drops of milk bud on the tips of your ' + Descriptors.nippleDescript( 0 ) + 's, growing larger as they roll down to the edge of the tube.  It feels as if a ', false );
				if( CoC.player.totalBreasts() === 2 ) {
					EngineCore.outputText( 'pair', false );
				} else if( CoC.player.totalBreasts() === 4 ) {
					EngineCore.outputText( 'quartet', false );
				} else {
					EngineCore.outputText( 'group', false );
				}
				EngineCore.outputText( ' of internal floodgates are opening, and thin streams of milk erupt, spraying to the noisy suckling tubes.   The milk is sucked away before it can build up, leaving you to wonder just how much you\'re managing to produce.   The milking goes on for the better part of an hour, though you stop producing long before it\'s over.  By the time the milker shuts off and the harness releases you, your breasts ache terribly.\n\n', false );
			}
			//Lightish2;
			else if( milksplosion === 1 ) {
				EngineCore.outputText( 'A tiny spurt of milk erupts from each of your ' + Descriptors.nippleDescript( 0 ) + 's before the hungry machinery devours it, sucking it down the clear tubes that lead back to the Whitney\'s machinery.  You unconsciously moan from the pleasure, feeling more than a little turned on by the pulsing suckling feeling the devices provide.  You spray your milk out in tiny streams, emptying your ' + Descriptors.allBreastsDescript() + ' off their motherly fluids. An hour later your harness loosens, easing you to the floor as the milking-cups drop off your painfully sensitive ' + Descriptors.nippleDescript( 0 ) + '.\n\n', false );
			}
			//Lightish3;
			else if( milksplosion === 2 ) {
				EngineCore.outputText( 'The tips of your ' + Descriptors.nippleDescript( 0 ) + 's swell for a moment before releasing tiny streams of milk into the suctioning cups.  It rapidly drains away, down the tubes towards the collection device.  The sensation is pleasurable and intense, but long before the machine finishes with you, your milk supply dries up.  The constant pulsing suckling does not abate, stretching and abusing your poor teats for the better part of an hour.  In spite of the pain and sensitivity, you enjoy it, but when the harness finally lowers yourself to the floor, you find yourself already anticipating the next session.\n\n', false );
			}
		}
		//Medium (+30 lust);
		else if( CoC.player.lactationQ() < 250 ) {
			EngineCore.dynStats( 'lus', 30 );
			//MEDIUMLICIOUS;
			if( milksplosion === 0 ) {
				EngineCore.outputText( 'Drops of your milk roll down the edge of the milk-cups as you begin lactating into them.  Milk sprays in solid streams from your nipples, forming a puddle at the bottom of the cup as the machinery siphons it through the clear tube towards the reservoir.   You moan hotly as the milking progresses, emptying your ' + Descriptors.allBreastsDescript() + ' of their creamy cargo.  For an hour your world is reduced to the sensation of suction and release, though towards the end nothing is coming out but tiny milk-drops.  At long last the harness lowers you to the floor, letting the cups pop off your abused ' + Descriptors.nippleDescript( 0 ) + 's.  You feel a little bit sore and sensitive, but overwhelmingly aroused by the experience.\n\n', false );
			}
			////Medium 2;
			if( milksplosion === 1 ) {
				EngineCore.outputText( 'A tight stream of milk erupts from your ' + Descriptors.nippleDescript( 0 ) + 's, pouring into the bottom of the hungry nipple-cups.  It pools there as the tubes work to suction it away.  They turn white and the machinery thrums as it works to keep up with you.  The tugging and releasing of the suction as you squirt out your milk is highly erotic, making you wriggle in the harness with sensual delight.  Unfortunately with all the straps you can\'t do anything about the heat in your groin.  After an hour of milking, when your output has dropped to barely a trickle, you\'re slowly lowered to the floor and released when the milking cycle completes.\n\n', false );
			}
			//Medium 3;
			if( milksplosion === 2 ) {
				EngineCore.outputText( 'Fat drops of milk pour out of your ' + Descriptors.nippleDescript( 0 ) + 's, pooling in the milking-cups as the machine begins to extract your creamy breast-milk.   The milk flow begins streaming out of you it bursts of fluid as the machinery switches to a pulsating suction.  You groan happily as your ' + Descriptors.allBreastsDescript() + ' empty, relieving you of pent up pressure.   The feeling is enjoyable in more than just that way, and you feel yourself getting ', false );
				if( CoC.player.totalCocks() === 0 ) {
					if( CoC.player.hasVagina() ) {
						EngineCore.outputText( 'wet', false );
					} else {
						EngineCore.outputText( 'horny', false );
					}
				} else {
					if( CoC.player.hasVagina() ) {
						EngineCore.outputText( 'wet and ', false );
					}
					EngineCore.outputText( 'hard', false );
				}
				EngineCore.outputText( ' from the sensation.  Over the next hour you\'re drained totally dry, until the only answer to the machine\'s effort is a tiny trickle of whiteness.  The harness gently lowers you to the ground and releases you, leaving you feeling sore.\n\n', false );
			}
		}
		//High Output (+ 40 lust);
		else if( CoC.player.lactationQ() < 750 ) {
			EngineCore.dynStats( 'lus', 40 );
			if( milksplosion === 0 ) {
				EngineCore.outputText( 'An eruption of milk floods the suction-tubes with a vortex of cream.  The machinery chugs loudly, struggling to keep up with the waves of fluid as your nipples continue to fountain into the receptacles.  You squeal in delight as your nipples get red and sensitive, but never slow in their production.  Writhing in the harness, you become more and more aroused by this milk-draining device until you feel as if you can bear it no longer.  When you get out, you\'ll NEED to get off.  After an hour of sexual torture, the suction cuts off and the harness releases.  The nipple-suckers drop off and spill your milk over the floor as droplets continue to leak from your over-productive chest.\n\n', false );
			}
			//High Output2;
			if( milksplosion === 1 ) {
				EngineCore.outputText( 'Your ' + Descriptors.nippleDescript( 0 ) + ' swell up like tiny balloons for a moment before they unleash a torrent of your milk.  The nipple-cylinders instantly flood to capacity, and the milking machinery chugs loudly as it tries to suck it all down the tubes, barely keeping up with you.  You pant and writhe in the harness, each pulse of milk sending a growing sensation of your warmth to your groin that makes you ', false );
				if( CoC.player.totalCocks() === 0 ) {
					if( CoC.player.hasVagina() ) {
						EngineCore.outputText( 'wet', false );
					} else {
						EngineCore.outputText( 'horny', false );
					}
				} else {
					if( CoC.player.hasVagina() ) {
						EngineCore.outputText( 'wet and ', false );
					}
					EngineCore.outputText( 'hard', false );
				}
				EngineCore.outputText( ' with excitement.  The milking drags on for an hour, but your output only slows slightly, forcing the machinery to work at maximum capacity the entire time.  At last it ends, and the harnesses lower you to the ground.  The milk cups pop off, leaving your leaky tits to make a puddle on the floor.\n\n', false );
			}
			//High Output3;
			if( milksplosion === 2 ) {
				EngineCore.outputText( 'Milk floods the milker\'s cups as your breasts respond to the mechanized suckling.   The machinery groans as it kicks into high gear, working hard to keep up with your prodigious production rate.  Your nipples tingle with happy little bursts of pleasure as they continue to pour out ever greater quantities of milk.  Arousal wells up, flushing your body with a reddish tint that\'s difficult to hide.  You wriggle in the harness, sweating profusely and trying to grind against something, anything, whatever it takes to get off.  The milking drags on for an hour, but your breasts keep pouring out milk the entire time.  When it ends, you\'re lowered to the floor and released.  The milk-tubes pop off, leaving you lying in a milk-puddle as your leaky teats continue to drip.\n\n', false );
			}
		}
		//CRAZY OUTPUT1 (+60 lust);
		else {
			EngineCore.dynStats( 'lus', 60 );
			milksplosion = Utils.rand( 2 );
			if( milksplosion === 0 ) {
				EngineCore.outputText( 'Your ' + Descriptors.nippleDescript( 0 ) + 's twitch and pulse for but a moment, then unleash a torrent of milk, totally filling the tubes.  The machinery lurches, struggling to keep up as you flood the tubes.   An alarm starts blaring as milk begins leaking out around the edges – Whitney\'s machinery just can\'t keep up!  You can hear footsteps in the barn, and a pair of soft hands hold the cups against your chest.   The machinery is shut down, but another pair of hands begins massaging your ' + Descriptors.allBreastsDescript() + ', pumping wave after wave of milk through the tubes, unaided by the machinery.  You practically ', false );
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( 'cream yourself', false );
				} else if( CoC.player.cockTotal() ) {
					EngineCore.outputText( 'jizz yourself', false );
				} else {
					EngineCore.outputText( 'orgasm', false );
				}
				EngineCore.outputText( ' from the attentions of your mysterious helper as the milking continues, so hot and horny that you try and wriggle in your harness to press against them.   After an hour of non-stop squeezing and spurting, your milking is over, and the hands release you.  The cups fall to the ground, and the harness lowers you to the ground.  By the time you can crane your head around, your helper has left.\n\n', false );
			}
			//CRAZY OUTPUT2;
			else {
				EngineCore.outputText( 'Your body lets down its milk, flooding the tubes with creamy goodness.  Milk immediately begins leaking from the edges as the machine fails to keep up with the quantity of cream being released.   Alarms blare and soft footfalls fill the barn as help arrives.  You hear the clangs of metal on metal, and then the suction intensifies, nearly doubling, milking you HARD and draining you of your vast reservoir of milk.  Your nipples ache with the strange pleasure of it, leaving you grunting and bucking against your restraints, desperate for release, but you just can\'t get the stimulation you need.  For an hour you\'re teased like that, pumped of your milk until the machinery shuts off and the harness lowers you to the ground, leaving you in a puddle of your own creation when the nipple-cups pop off.\n\n', false );
			}
		}
		//Aftermaths;
		//Set temp to liter amount produced.;
		var liters = 0;
		var payout = 0;
		var cap = 500;
		//Ez mode cap doubles;
		if( CoC.flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] === 1 ) {
			cap *= 2;
		}
		liters = Math.ceil( CoC.player.lactationQ() * (Utils.rand( 10 ) + 90) / 100 ) / 1000;
		if( liters < 0 ) {
			liters = 1337;
		}
		//Pay 4 gem for every half-liter. ;
		payout = Math.ceil( liters * 2 * 4 );
		EngineCore.outputText( 'The machinery displays ' + liters + ' liters of milk', false );
		//If already at cap;
		if( CoC.flags[ kFLAGS.WHITNEY_GEMS_PAID_THIS_WEEK ] >= cap ) {
			EngineCore.outputText( ' and displays a warning that <b>you\'re producing more than Whitney can pay for</b>', false );
			payout = 0;
		}
		if( payout > 0 ) {
			//If over cap reduce payout to the difference;
			if( payout + CoC.flags[ kFLAGS.WHITNEY_GEMS_PAID_THIS_WEEK ] > cap ) {
				payout = cap - CoC.flags[ kFLAGS.WHITNEY_GEMS_PAID_THIS_WEEK ];
			}
			//Keep track of how much is paid;
			CoC.flags[ kFLAGS.WHITNEY_GEMS_PAID_THIS_WEEK ] += payout;
			EngineCore.outputText( ' and automatically dispenses ' + Utils.num2Text( payout ) + ' gem' + (payout === 1 ? '' : 's') + '.  Whitney really went all out with this setup!', false );
			//Display a warning that you've capped out.;
			if( CoC.flags[ kFLAGS.WHITNEY_GEMS_PAID_THIS_WEEK ] >= cap ) {
				EngineCore.outputText( '  <b>The machinery warns you that Whitney can\'t afford any more this week!</b>', false );
			}
			CoC.player.gems += payout;
		} else {
			EngineCore.outputText( '.', false );
		}
		//High production = stupid cow.;
		if( liters > 2 ) {
			EngineCore.outputText( '\n\nYou feel woozy and lightheaded from the intense milking, and have difficulty focusing on anything but the residue of fluids coating your ' + Descriptors.allBreastsDescript() + '.', false );
			//Being a cow makes you less dumb;
			//Somehow;
			if( CoC.player.findStatusAffect( StatusAffects.Feeder ) >= 0 ) {
				EngineCore.dynStats( 'int', -1 );
				if( liters > 5 ) {
					EngineCore.dynStats( 'int', -1 );
				}
				if( liters > 10 ) {
					EngineCore.dynStats( 'int', -1 );
				}
				if( liters > 20 ) {
					EngineCore.dynStats( 'int', -1 );
				}
			}
			//not a cow, bimbotize me!;
			else {
				if( liters / 2 > 10 ) {
					EngineCore.dynStats( 'int', -10 );
				} else {
					EngineCore.dynStats( 'int', -liters / 2 );
				}
				if( liters > 30 ) {
					EngineCore.dynStats( 'int', -2 );
				}
			}
			if( CoC.player.inte < 10 ) {
				EngineCore.doNext( this.cowBadEnd1 );
				return;
			} else if( CoC.player.inte < 15 ) {
				EngineCore.outputText( '  You stretch and let out a contented moo, long and loud.  How silly!', false );
			} else if( CoC.player.inte < 25 ) {
				EngineCore.outputText( '  You quietly moo, then giggle to yourself at how strange you\'re acting.', false );
			}
		}
		EngineCore.outputText( '\n\n', false );
		//Not very horny yet;
		if( CoC.player.lust < 75 ) {
			EngineCore.outputText( 'Feeling sore and VERY hungry, you make yourself decent and stagger back towards camp, ignoring the knowing smile Whitney gives you when you pass by her.', false );
		}
		//Horny;
		else {
			EngineCore.outputText( 'Overwhelmed with your desire, you don\'t even bother to cover up and make yourself decent, you just run out of the barn, ' + Descriptors.allBreastsDescript() + ' jiggling and wet, heading straight for camp.' );
			if( SceneLib.farmCorruption.whitneyCorruption() < 90 ) {
				EngineCore.outputText( ' It isn\'t until you get back that you remember the disapproving look Whitney gave you, but if anything, it only makes you hornier.', false );
			}
			EngineCore.dynStats( 'lus=', 100 );
		}
		//Boost lactation by a tiny bit and prevent lactation reduction;
		CoC.player.boostLactation( 0.05 );
		//Reset 'feeder' status;
		CoC.player.changeStatusValue( StatusAffects.Feeder, 2, 0 );
		//Boost endurance rating (more if low);
		if( CoC.player.statusAffectv1( StatusAffects.LactationEndurance ) < 1.5 ) {
			CoC.player.addStatusValue( StatusAffects.LactationEndurance, 1, 0.05 );
		}
		CoC.player.addStatusValue( StatusAffects.LactationEndurance, 1, 0.05 );
		CoC.player.createStatusAffect( StatusAffects.Milked, 8, 0, 0, 0 );
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
	};
	Farm.prototype.cockPumping = function() {
		var cumQ = CoC.player.cumQ() * (Utils.rand( 10 ) + 90) / 100;
		EngineCore.outputText( '', true );
		//First time barn entrance;
		if( CoC.player.findStatusAffect( StatusAffects.CockPumped ) < 0 ) {
			EngineCore.outputText( 'The barn looms tall ahead of you as you step into its shadow.  ', false );
			if( CoC.player.cor < 50 ) {
				EngineCore.outputText( 'You shiver nervously when you step inside.  ', false );
			} else {
				EngineCore.outputText( 'You smile eagerly as you walk inside.  ', false );
			}
			EngineCore.outputText( 'The barn is filled with the earthy smells of earth, wood, and grease.  It\'s clean for the most part, though the floor is just packed dirt and the stalls look old and well-used.  A bank of machinery along the wall thrums and pulses as if it\'s a living creature.  Hoses and cables run from it in a dozen places, disappearing into the walls.   There is even a set of stout wooden doorways along the west wall.  That must be where the farm\'s intelligent denizens stay.  You notice each of the stalls have name-plates on them, and there is even one that says ' + CoC.player.short + '.  It must be for you.\n\n', false );
		}
		//Repeat;
		else {
			EngineCore.outputText( 'You walk over to the barn, eagerly anticipating your session with the \'milker\'.  ', false );
			EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' erect', false );
			if( CoC.player.cockTotal() === 1 ) {
				EngineCore.outputText( 's', false );
			}
			EngineCore.outputText( ' and throb', false );
			if( CoC.player.cockTotal() === 1 ) {
				EngineCore.outputText( 's', false );
			}
			EngineCore.outputText( ' with building desire.  It\'s as if ', false );
			if( CoC.player.cockTotal() === 1 ) {
				EngineCore.outputText( 'it', false );
			} else {
				EngineCore.outputText( 'they', false );
			}
			EngineCore.outputText( ' know', false );
			if( CoC.player.cockTotal() === 1 ) {
				EngineCore.outputText( 's', false );
			}
			EngineCore.outputText( ' all too well what\'s to come.  The doors part easily, and you breeze into your stall in a rush.\n\n', false );
		}
		//First time using cock milker – factory install;
		if( CoC.player.findStatusAffect( StatusAffects.CockPumped ) < 0 ) {
			EngineCore.outputText( '<b>There is a note tacked to the door from Whitney:</b>\n\n<i>I got your machine all rigged up, and even made a few modifications to bring it up to speed with the machinery I use on the bulls.  Enjoy your \'milkings\', and don\'t overdo it – there are certain messes even a farm-girl like me WON\'T clean up.</i>\n\n', false );
			//Step into harness – first time only;
			EngineCore.outputText( 'A harness hangs limply in the stall, there to hold the occupant in place while they are drained of every ounce of \'milk\'.  You exhale slowly and force yourself to step into it.  As you puzzle out the straps, it gets easier and easier to get the rest into place.  You snap the last one in place, and machinery whirs and pulls them tight, lifting you off the ground and suspending you, facedown.  A hatch in the far wall slides open, revealing a mass of tubes, wires, and machinery.  A ', false );
			if( CoC.player.cockTotal() === 1 ) {
				EngineCore.outputText( 'single hose wriggles out from the hole, squirming across the floor.  It stops and lifts up, slowly homing in your horny shaft.\n\n', false );
			} else if( CoC.player.cockTotal() === 2 ) {
				EngineCore.outputText( 'pair of hoses wriggle out from the hole, squirming across the floor.  They stop and lift up, slowly homing in your horny shafts.\n\n', false );
			} else {
				EngineCore.outputText( 'group of hoses wriggle out from the hole, squirming across the floor.  They stop and lift up, slowly homing in your horny shafts.\n\n', false );
			}
			CoC.player.createStatusAffect( StatusAffects.CockPumped, 1, 0, 0, 0 );
		}
		//REPEAT;
		else {
			EngineCore.outputText( 'You easily attach the harnesses and lift up into position, hearing the machinery activate automatically.  The hungry ', false );
			if( CoC.player.cockTotal() === 1 ) {
				EngineCore.outputText( 'hose wriggles out from the wall, curving up towards your crotch. ', false );
			} else {
				EngineCore.outputText( 'hoses wriggle out from the wall, curving up towards your crotch. ', false );
			}
			//Count repeat milkings! Wootles for arbitrary stats;
			CoC.player.addStatusValue( StatusAffects.CockPumped, 1, 1 );
		}
		//Small/Medium/Large, 2x each;
		if( CoC.player.cockArea( 0 ) < 20 ) {
			//Small 1 ;
			if( Utils.rand( 2 ) === 0 ) {
				if( CoC.player.cockTotal() === 1 ) {
					EngineCore.outputText( 'The hose\'s \'tip\' is many times longer than your member, and about thrice as thick.  The \'opening\' is filled with something wet and pink.  It squirms and wriggles, looking very much alive.  Where did Whitney get this stuff?    It tentatively presses against your ' + Descriptors.cockDescript( 0 ) + ', sucking wetly as the material inside slurps you down.  The feeling is immediate and intense, like being surrounded by hundreds of eager tongues, all writhing together along your length.\n\n', false );
				} else {
					EngineCore.outputText( 'The hoses\' \'tips\' are many times longer than your members, and about thrice as thick.  The openings are each filled with something wet and pink.  They squirm and wriggle, looking very much alive.  Where did Whitney get this stuff?   They tentatively press against your ' + Descriptors.multiCockDescriptLight() + ', sucking wetly as the material inside slurps you down.  The feeling is immediate and intense, like being surrounded by hundreds of eager tongues, all writhing together along your lengths at once.\n\n', false );
				}
			}
			//Small 2;
			else {
				if( CoC.player.cockTotal() === 1 ) {
					EngineCore.outputText( 'The hose\'s opening, while much larger than your ' + Descriptors.cockDescript( 0 ) + ', is packed full of some slimy looking pink flesh.  It wriggles hungrily as it snakes up, noisily slobbering over your tip.  Your body, tired of the foreplay, thrusts forwards, rocking the harness back and forth.  The effort is wasted, as the hose stops and slowly repositions itself under you, having to reset before it can begin \'milking\'.  You sigh and hold perfectly still as it bumps back against you.    Your muscles twitch but you hold steady as it slowly slides forwards, effortlessly taking your ' + Descriptors.cockDescript( 0 ) + ' inside.  The stimulation is intense and immediate.  The suction kicks in, making you swell larger than normal.  You feel like every inch is covered in tiny wet massaging fingers and tongues.\n\n', false );
				} else {
					EngineCore.outputText( 'The hoses\' openings, while much larger than your ' + Descriptors.multiCockDescriptLight() + ', are packed full of some slimy looking pink flesh.  They wriggles hungrily as they snake up, noisily slobbering over your tip.  Your body, tired of the foreplay, thrusts forwards, rocking the harness back and forth.  The effort is wasted, as the hoses stop and slowly reposition themselves under you, having to reset before they can begin \'milking\'.  You sigh and hold perfectly still as they bump back against you.    Your muscles twitch but you hold steady as they slowly slide forward, effortlessly taking your ' + Descriptors.multiCockDescript() + ' inside.  The stimulation is intense and immediate.  The suction kicks in, making you swell larger than normal.  You feel like every inch is covered in tiny wet massaging fingers and tongues.\n\n', false );
				}
			}
		} else if( CoC.player.cockArea( 0 ) < 70 ) {
			//Medium 1;
			if( Utils.rand( 2 ) === 0 ) {
				if( CoC.player.cockTotal() === 1 ) {
					EngineCore.outputText( 'The mechanical snake\'s receptacle yawns open, showing an interior filled with wriggling pink material and dripping mucusy wetness.  It wiggles, closing the distance to your ' + Descriptors.cockDescript( 0 ) + ' in a flash.  Pausing just below your ' + CoC.player.cockHead() + ', it slowly flows upward, engulfing you with slick pleasure.  It sucks hard, sliding up ', false );
					if( CoC.player.hasKnot( 0 ) ) {
						EngineCore.outputText( 'past your knot', false );
					} else {
						EngineCore.outputText( 'to your base', false );
					}
					EngineCore.outputText( ' and massaging you with hundreds of lubricated internal protrusions.\n\n', false );
				} else {
					EngineCore.outputText( 'The mechanical snake\'s receptacles yawn open, showing an interior filled with wriggling pink material and dripping mucusy wetness.  They wiggle, closing the distance to your ' + Descriptors.multiCockDescriptLight() + ' in a flash.  Pausing just below your ' + CoC.player.cockHead() + 's, they slowly flow upward, engulfing you with slick pleasure.  They suck hard, sliding up ', false );
					EngineCore.outputText( 'to your base', false );
					EngineCore.outputText( ' and massage you with hundreds of lubricated internal protrusions.\n\n', false );
				}
			}
			//medium 2;
			else {
				if( CoC.player.cockTotal() === 1 ) {
					EngineCore.outputText( 'The dick-milker\'s opening looks well suited to take your ' + Descriptors.cockDescript( 0 ) + ', just about a perfect match for someone hung like you.  As it closes with your groin, you get a better look at the internals.  It looks... alive.  The inside is filled with slime-slick flesh, pinkish in color and jiggling hungrily.  What the hell did Whitney put inside this thing anyway?  The dripping opening rubs against you tentatively, wetting your ' + Descriptors.cockDescript( 0 ) + ' with slipperiness.  You resist the urge to push forwards, knowing it would be futile with the restraints binding you so tightly.  It sucks your ' + CoC.player.cockHead() + ' inside, making you groan and swell as your maleness is slowly pulled inside the mechanized fuck-hole.   Squelching noises echo through the barn, mixed with pleasured moans.\n\n', false );
				} else {
					EngineCore.outputText( 'The dick-milkers\' openings look well suited to take your ' + Descriptors.multiCockDescriptLight() + ', just about a perfect match for someone hung like you.  As they close with your groin, you get a better look at the internals.  They look... alive.  The inside is filled with slime-slick flesh, pinkish in color and jiggling hungrily.  What the hell did Whitney put inside these things anyway?  The dripping openings rub against you tentatively, wetting your ' + Descriptors.multiCockDescriptLight() + ' with slipperiness.  You resist the urge to push forwards, knowing it would be futile with the restraints binding you so tightly.  They suck your ' + CoC.player.cockHead() + 's inside, making you groan and swell as your multitude of malenesses is slowly pulled inside the mechanized fuck-hole.   Squelching noises echo through the barn, mixed with pleasured moans.\n\n', false );
				}
			}
		} else {
			//large 1;
			if( Utils.rand( 2 ) === 0 ) {
				if( CoC.player.cockTotal() === 1 ) {
					EngineCore.outputText( 'The hose\'s hole spreads wide as it closes in on your crotch, revealing the organic pinkish interior.   Somehow you doubt it\'ll be able to take all of your mammoth member, but the artificial pussy seems intent on trying.   It pushes against your ' + Descriptors.cockDescript( 0 ) + '\'s ' + CoC.player.cockHead() + ', stretching wide and struggling to fit.  The feelings of slippery flesh writhing about you overwhelms your body, making you go limp in the harness.   The suction slowly pulls you inside, an inch at a time, while the soft \'flesh\' of the device hugs your ' + Descriptors.cockDescript( 0 ) + ' with its many wriggling \'tongues\'.\n\n', false );
				} else {
					EngineCore.outputText( 'The hoses\' holes spread wide as they close in on your crotch, revealing their organic pinkish interiors.   Somehow you doubt they\'ll be able to take all of your mammoth members, but the artificial pussies seem intent on trying.   They push against your ' + Descriptors.multiCockDescriptLight() + '\' ' + CoC.player.cockHead() + 's, stretching wide and struggling to fit.  The feelings of slippery flesh writhing about you overwhelms your body, making you go limp in the harness.   The suction slowly pulls you inside, an inch at a time, while the soft \'flesh\' of the devices hugs your ' + Descriptors.multiCockDescript() + ' with its many wriggling \'tongues\'.\n\n', false );
				}
			}
			//large 2;
			else {
				if( CoC.player.cockTotal() === 1 ) {
					EngineCore.outputText( 'The milker\'s opening dilates wide, struggling to spread enough to accommodate your sheer size.  It closes the gap, waving back and forth like a cobra.  It pauses, brushing its squirming interior against your ' + CoC.player.cockHead() + ' experimentally.  You squirm as its lubricants begin coating you, but do your best to hold still for the organic-looking pump mechanism.  It starts pushing against you, almost painfully, as your distended cock resists fitting into the tubular hole.  With a sigh of anguished pleasure you\'re crammed into the tube, squeezed tight by wiggling tendrils. The ever-increasing suction pulls the tube further and further down your length.  It bottoms out, pressing tightly against your crotch and squeezing the entirety of your ' + Descriptors.cockDescript( 0 ) + ' with inhuman flesh.\n\n', false );
				} else {
					EngineCore.outputText( 'The milkers\' openings dilate wide, struggling to spread enough to accommodate your sheer size.  They close the gap, waving back and forth like a cobra.  Pausing, they brush their squirming interiors against your ' + Descriptors.multiCockDescriptLight() + ' experimentally.  You squirm as the lubricants begin coating you, but do your best to hold still for the organic-looking pump mechanisms.  They start pushing against you, almost painfully, as your distended cocks resist fitting into the tubular holes.  With a sigh of anguished pleasure you\'re crammed into the tubes, squeezed tight by wiggling tendrils.  The ever-increasing suction pulls the tubes further and further down your lengths.  They bottom out, pressing tightly against your crotch and squeezing the entirety of your ' + Descriptors.multiCockDescriptLight() + ' with inhuman flesh.\n\n', false );
				}
			}
		}
		//MILKIN ACTION GO;
		if( Utils.rand( 2 ) === 0 ) {
			EngineCore.outputText( 'You squirm against your restraints, openly moaning and twitching your hips, trying to enhance the sensations further.  All you feel is hot wet warmth surrounding and caressing you, stroking you to new heights of pleasure.  Gods above and below, you could lose yourself to this!  You don\'t want to be released, or to orgasm, or even for the machine to slow down.  You only want MORE!   The heat in your groin gets increasingly worse as your pre-cum starts dripping, turning into a steady flow.  Noisy slurping noises greet your ears as the machinery sucks your pre-seed down the tubes.  The machine immediately backs off a notch, keeping you on the edge of release, much to your simultaneous delight and frustration.\n\n', false );
		}
		//Ver2;
		else {
			EngineCore.outputText( 'You moan with lust, pushed beyond the limits of sensation to a mixture of heaven and hell.   Thankfully the harness holds your body still as you writhe inside the straps, utterly restrained but instinctively trying to thrust into the source of your good feelings.  The milking devices suck and stroke with feverish intensity, making you bigger and harder than you\'ve ever been before.  You can practically feel the pre-cum dripping from your urethras, and you can definitely hear it being sucked down the tubes.  You feel release building, but the machinery somehow senses it, and backs off, keeping you on the edge of orgasm for as long as possible.\n\n', false );
		}
		//(OPTIONAL ANAL PROBE);
		if( CoC.player.hasKeyItem( 'Cock Milker: Anal Attachment' ) >= 0 ) {
			if( CoC.player.cockTotal() === 1 ) {
				EngineCore.outputText( 'A sudden splash of wetness hits your backside, instantly soaking your ' + CoC.player.skinDesc + ' with slippery lubricants.  You feel something narrow touch against your ' + Descriptors.assholeDescript() + ', workings its way past the clenching muscles and into your body.  The violation would bother you more if it didn\'t seem to amplify the feelings radiating down your shaft, but then it starts to change.  You feel it swelling up inside, somehow inflating.  It stretches you wide, pressing against the knot of your prostate, milking out a thick flow of cum.   It pushes tighter and tighter, making you drip and drizzle in a steady flow before deflating, allowing your abused body to relax.  You sigh, but are kept rock hard by the feverish milking of your dick.\n\nEventually the probe inflates again, squeezing out another drizzle of thick spooge, the hose on your ' + Descriptors.cockDescript( 0 ) + ' noisily sucking it down.  You\'re kept like that for quite a while – never feeling a true orgasm, but forced to expel cum over and over by always increasing waves of pressure in your ass.  You babble incoherently, pleasure-drunk, not even noticing a green light on the far side of the wall come on.  One thing you do notice is that the cock-tube isn\'t slowing down its ministrations.  You\'re finally allowed to cum!\n\n', false );
			} else {
				EngineCore.outputText( 'A sudden splash of wetness hits your backside, instantly soaking your ' + CoC.player.skinDesc + ' with slippery lubricants.  You feel something narrow touch against your ' + Descriptors.assholeDescript() + ', workings its way past the clenching muscles and into your body.  The violation would bother you more if it didn\'t seem to amplify the feelings radiating down your shafts, but then it starts to change.  You feel it swelling up inside, somehow inflating.  It stretches you wide, pressing against the knot of your prostate, milking out a thick flow of cum.   It pushes tighter and tighter, making you drip and drizzle in a steady flow before deflating, allowing your abused body to relax.  You sigh, but are kept rock hard by the feverish milking of your dicks.\n\nEventually the probe inflates again, squeezing out another drizzle of thick spooge, the hoses on your ' + Descriptors.multiCockDescriptLight() + ' noisily sucking it down.  You\'re kept like that for quite a while – never feeling a true orgasm, but forced to expel cum over and over by always increasing waves of pressure in your ass.  You babble incoherently, pleasure-drunk, not even noticing a green light on the far side of the wall come on.  One thing you do notice is that the cock-tubes are no longer slowing down their ministrations.  You\'re finally allowed to cum!\n\n', false );
			}
		}
		//(ELSE);
		else {
			if( CoC.player.cockTotal() === 1 ) {
				EngineCore.outputText( 'You\'re kept on the edge of orgasm for the better part of an hour.   Rhythmic contractions squeeze through the flesh-tube wrapped around your manhood, keeping it painfully hard and dribbling, always backing off before you can truly cum.  You thrash in your harness wildly, insane with need and nearly frothing at the mouth.  The licking tongues never stop, slithering across you in between every wave of mechanized suction that pulls on your member.   You babble incoherently, pleasure-drunk, not even noticing a green light on the far side of the wall turning on.  One thing you do notice is that the cock-tube isn\'t slowing down its ministrations.  You\'re finally allowed to cum!\n\n', false );
			} else {
				EngineCore.outputText( 'You\'re kept on the edge of orgasm for the better part of an hour.   Rhythmic contractions squeeze through the flesh-tubes wrapped around your manhoods, keeping them painfully hard and dribbling, always backing off before you can truly cum.  You thrash in your harness wildly, insane with need and nearly frothing at the mouth.  The licking tongues never stop, licking between every wave of mechanized suction that pulls on your many malenesses.   You babble incoherently, pleasure-drunk, not even noticing a green light on the far side of the wall turning on.  One thing you do notice is that the cock-tubes aren\'t slowing down their ministrations.  You\'re finally allowed to cum!\n\n', false );
			}
		}
		//BAD END!?;
		if( CoC.player.cumQ() >= 50 && CoC.player.fatigue >= 100 && CoC.flags[ kFLAGS.USED_MILKER_TODAY ] > 0 ) {
			//(small/medium helperless skeet);
			if( cumQ < 1000 ) {
				EngineCore.outputText( 'The orgasm rolls over you, shutting down your thoughts as your body spasms in its straps, boiling out ', false );
				if( cumQ > 500 ) {
					EngineCore.outputText( 'thick ', false );
				}
				EngineCore.outputText( 'spurts of spunk.  Wriggling cilia convulse around you, licking your head as it flares wide, filling with blood and pouring out cum.  You moan and scream with delight, babbling happily as you watch your cum wick up the clear tube and into the machinery in the wall.  All too soon the pleasure comes to an end; the harness lowers you to the ground and releases you, but the squishy walls of your demon machine lover don\'t cease their ministrations on your tender ' + Appearance.cockNoun( CockTypesEnum.HUMAN ), false );
				if( CoC.player.cockTotal() > 1 ) {
					EngineCore.outputText( 's', false );
				}
				EngineCore.outputText( '.\n\n', false );
				EngineCore.outputText( 'A loud \'ding\' sounds ', false );
				//[(if enough for payout);
				if( cumQ > 100 ) {
					EngineCore.outputText( 'and a clatter of gems drop into the plate ', false );
				}
				EngineCore.outputText( 'as the machine measures your contribution, but it barely registers in the back of your mind as your ' + Descriptors.multiCockDescriptLight() + ' harden again from the unending, expertly-given stimulation of the animate tubes.  You try to pull the milker off your ' + Descriptors.multiCockDescriptLight() + ', but with ', false );
				//[(big dix);
				if( CoC.player.biggestCockArea() > 70 ) {
					EngineCore.outputText( 'the end', false );
					if( CoC.player.cockTotal() > 1 ) {
						EngineCore.outputText( 's', false );
					}
					EngineCore.outputText( ' wrapped so snugly around your huge member', false );
					EngineCore.outputText( 's', false );
					EngineCore.outputText( ' and ', false );
				}
				EngineCore.outputText( 'how tired you are, you can\'t break the suction.  Every time you get a good grip and start to pull, the suction shoots a shiver of pleasure down ' + Descriptors.sMultiCockDesc() + ' and robs you of your focus and muscle control.  Practically helpless against the tubes, you feel your ' + Descriptors.multiCockDescriptLight() + ' get harder and harder, leaking out more pre-cum.\n\n', false );
			}
			//(big skeet, ordinarily would be helper-assisted);
			else {
				EngineCore.outputText( 'An eruption of jism boils out, splattering with loud wet noises into the tube.  You can feel the pressure build up, pushing back against your ' + Descriptors.multiCockDescriptLight() + ' as the machinery fails to keep up with the gushes of white fluid erupting inside it.  Your eyes cross from the pleasure and you start drooling all over yourself, not even noticing that you\'re about to blast the milker off your member.  The machinery grinds as it struggles to keep up, then pops off as it overflows with semen.  You don\'t even notice, instead focusing on the feeling of ejecting sticky globs from your ' + Descriptors.multiCockDescriptLight() + '.\n\n', false );
				EngineCore.outputText( 'Jism splatters on the floor below you as you discharge rivers of spunk.  Liters upon liters of the stuff spill out of your throbbing ' + Descriptors.multiCockDescriptLight() + ', coating the outside of the ejected suction tubes to match the inside.  Eventually you spend your reserve and the cum flow reduces to a trickle.  Stupid with pleasure, you don\'t notice the suction tube', false );
				if( CoC.player.cockTotal() > 1 ) {
					EngineCore.outputText( 's', false );
				}
				EngineCore.outputText( ' wriggling back into place on your ' + Descriptors.multiCockDescriptLight() + ' as the harness lets you down into the puddle you made.  Only when the velvet walls of the demon machine resume their caresses do you take something as amiss with the situation.\n\n', false );
				EngineCore.outputText( 'A loud \'ding\' sounds and a clatter of gems drop into the plate as the machine measures your contribution, but it barely registers in the back of your mind as ' + Descriptors.sMultiCockDesc() + ' hardens again from the unending, expertly-given stimulation of the animate tube', false );
				if( CoC.player.cockTotal() > 1 ) {
					EngineCore.outputText( 's', false );
				}
				EngineCore.outputText( '.  You try to pull the milker off your ' + Descriptors.multiCockDescriptLight() + ', but the outside of the tubing is slick with your semen', false );
				//[(big dix);
				if( CoC.player.biggestCockArea() > 70 ) {
					EngineCore.outputText( ', and the end', false );
					if( CoC.player.cockTotal() > 1 ) {
						EngineCore.outputText( 's', false );
					}
					EngineCore.outputText( ' wrap too snugly around your swollen member', false );
					if( CoC.player.cockTotal() > 1 ) {
						EngineCore.outputText( 's', false );
					}
				}
				EngineCore.outputText( '.  Every time you get a good grip and start to pull, a shiver of pleasure shoots down ' + Descriptors.sMultiCockDesc() + ' and robs you of your focus and muscle control.  Practically helpless against the tubes, you feel ' + Descriptors.sMultiCockDesc() + ' get harder and harder as the machine sucks out more pre-cum along with the milky aftershocks of your last massive orgasm.\n\n', false );
			}
			//TO BAD ENDAGE;
			EngineCore.doNext( this.milkerBadEnd1 );
			return;
		}
		CoC.flags[ kFLAGS.USED_MILKER_TODAY ]++;
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00333 ]++;
		//ORGAZMO;
		if( cumQ < 10 ) {
			if( CoC.player.cockTotal() === 1 ) {
				EngineCore.outputText( 'The orgasm rolls over you, shutting down your thoughts as your body spasms in its straps, boiling out tiny squirts of spunk.  Wriggling cilia convulse around you, licking your ' + CoC.player.cockHead() + ' as it flares wide, filling with blood and dripping out a little cum.  You moan and scream with delight, babbling happily as you watch your insignificant amount of cum wick up the clear tube and into the machinery in the wall.  All too soon the pleasure comes to an end, and your cock starts to soften inside its squishy prison.  The harness slowly loosens, lowering you to the ground and releasing you.\n\n', false );
			} else {
				EngineCore.outputText( 'The orgasm rolls over you, shutting down your thoughts as your body spasms in its straps, boiling out tiny squirts of spunk.  Wriggling cilia convulse around you, licking your ' + CoC.player.cockHead() + 's as they flare wide, filling with blood and dripping out a little cum.  You moan and scream with delight, babbling happily as you watch your insignificant amount of cum wick up the clear tube and into the machinery in the wall.  All too soon the pleasure comes to an end, and your cocks start to soften inside their squishy prisons.  The harness slowly loosens, lowering you to the ground and releasing you.\n\n', false );
			}
			EngineCore.fatigue( 5 );
		}
		//Light Scene – output less than 100 mLs;
		else if( cumQ < 100 ) {
			if( CoC.player.cockTotal() === 1 ) {
				EngineCore.outputText( 'The orgasm rolls over you, shutting down your thoughts as your body spasms in its straps, boiling out thick spurts of spunk.  Wriggling cilia convulse around you, licking your ' + CoC.player.cockHead() + ' as it flares wide, filling with blood and pouring out cum.  You moan and scream with delight, babbling happily as you watch your cum wick up the clear tube and into the machinery in the wall.  All too soon the pleasure comes to an end, and your cock starts to soften inside its squishy prison.  The harness slowly loosens, lowering you to the ground and releasing you.\n\n', false );
			} else {
				EngineCore.outputText( 'The orgasm rolls over you, shutting down your thoughts as your body spasms in its straps, boiling out thick spurts of spunk.  Wriggling cilia convulse around you, licking your ' + CoC.player.cockHead() + 's as they flare wide, filling with blood and pouring out cum.  You moan and scream with delight, babbling happily as you watch your cum wick up the clear tube and into the machinery in the wall.  All too soon the pleasure comes to an end, and your cocks start to soften inside their squishy prisons.  The harness slowly loosens, lowering you to the ground and releasing you.\n\n', false );
			}
			EngineCore.fatigue( 10 );
		}
		//Medium Scene – output less than 250 mLs;
		else if( cumQ < 333 ) {
			if( CoC.player.cockTotal() === 1 ) {
				EngineCore.outputText( 'An orgasm hits you like a an ocean wave, shutting down any remaining conscious thoughts and replacing them with one overriding emotion: relief.   You spurt helplessly into the tube, wracked with pleasure as your ', false );
				if( CoC.player.balls > 0 ) {
					EngineCore.outputText( 'bloated ' + Descriptors.ballsDescriptLight() + ' are', false );
				} else {
					EngineCore.outputText( 'sensitive ' + Descriptors.cockDescript( 0 ) + ' is', false );
				}
				EngineCore.outputText( ' finally relieved of ', false );
				if( CoC.player.balls > 0 ) {
					EngineCore.outputText( 'their ', false );
				} else {
					EngineCore.outputText( 'its ', false );
				}
				EngineCore.outputText( 'pent up seed.  The machine suckles noisily, visibly turning some of the tubes in the wall solid white as the machinery works hard to keep up with your impressive output.  Eventually it does come to an end.  Your jets of jism taper off and your dick starts going soft inside the squirming machinery.  In response you feel it slip off you, retracting into the wall as the harness gently drops you back to the ground.\n\n', false );
			} else {
				EngineCore.outputText( 'An orgasm hits you like a an ocean wave, shutting down any remaining conscious thoughts and replacing them with one overriding emotion: relief.   You spurt helplessly into the tube, wracked with pleasure as your ', false );
				if( CoC.player.balls > 0 ) {
					EngineCore.outputText( 'bloated ' + Descriptors.ballsDescriptLight() + ' are', false );
				} else {
					EngineCore.outputText( 'sensitive ' + Descriptors.multiCockDescriptLight() + ' are', false );
				}
				EngineCore.outputText( ' finally relieved of their pent up seed.  The machine suckles noisily, visibly turning some of the tubes in the wall solid white as the cock-pump\'s motors work hard to keep up with your impressive output.  Eventually it does come to an end.  Your jets of jism taper off and your dicks start to go soft inside the squirming machinery.  In response you feel it slip off you, retracting into the wall as the harness gently drops you back to the ground.\n\n', false );
			}
			EngineCore.fatigue( 15 );
		}
		//Heavy Scene – output less than 500 mLs;
		else if( cumQ < 1000 ) {
			if( CoC.player.cockTotal() === 1 ) {
				EngineCore.outputText( 'The force of your orgasm is intense, wracking your body with the effort of it as you push a thick blast of seed into the cum-receptacle you\'re feebly humping against.   Dribbles of seed leak out around the edges of the cock-milker, overflowing the receptacle slightly as you push wave after wave into the machine.  The wet internal nubs keep up their stimulation and combined with the hours of edging, your orgasm just drags on and on, filling the machinery to capacity.  In time, your body is drained of its remaining goo, and slowly lowered to the ground, still twitching weakly as the milker detaches and retracts back into the wall.\n\n', false );
			} else {
				EngineCore.outputText( 'The force of your orgasm is intense, wracking your body with the effort of it as you push a thick blast of seed into the cum-receptacle you\'re feebly humping against.   Dribbles of seed leak out around the edges of the cock-milkers, overflowing the receptacles slightly as you push wave after wave into the machine.  The wet internal nubs keep up their stimulation and combined with the hours of edging, your orgasm just drags on and on, filling the machinery to capacity.  In time, your body is drained of its remaining goo, and slowly lowered to the ground, still twitching weakly as the milkers detach and retract back into the wall.\n\n', false );
			}
			EngineCore.fatigue( 20 );
		}
		//Massive Scene – else;
		else {
			if( CoC.player.cockTotal() === 1 ) {
				EngineCore.outputText( 'An eruption of jism boils out, splattering with loud wet noises into the tube.  You can feel the pressure build up, pressing back against your ' + Descriptors.cockDescript( 0 ) + ' as the machinery fails to keep up with the gushes of white fluid erupting inside it.  Your eyes cross from the pleasure and you start drooling all over yourself, not even noticing that you\'re about to blast the milker off your member.  The machinery grinds as it struggles to keep up, blaring out alarms.  You don\'t even notice, instead focusing on the feeling of depositing sticky globs inside the milker-tube, pushing it halfway off your ' + Descriptors.cockDescript( 0 ) + '.\n\n', false );
				EngineCore.outputText( 'Hurried footsteps enter the barn, and a pair of firm hands grab onto your bouncing ' + Descriptors.multiCockDescriptLight() + ', pulling the milker back against your groin and splattering spunk around the seal from the added pressure.  The machine-suction totally cuts off, but you don\'t even care.  You just keep cumming, pumping the thick white cream down the tubes by the force of your orgasm alone.   Eventually your incredible orgasm winds down, and the hands release you, allowing the tube to pop off.  It slowly retracts to the wall as your harness is lowered, dropping your exhausted body in a wet heap on the ground.  When you regain your senses, your mysterious helper is gone.\n\n', false );
			} else {
				EngineCore.outputText( 'An eruption of jism boils out, splattering with loud wet noises into the tube.  You can feel the pressure build up, pressing back against your ' + Descriptors.multiCockDescriptLight() + ' as the machinery fails to keep up with the gushes of white fluid erupting inside it.  Your eyes cross from the pleasure and you start drooling all over yourself, not even noticing that you\'re about to blast the milkers off your members.  The machinery grinds as it struggles to keep up, blaring out alarms.  You don\'t even notice, instead focusing on the feeling of depositing sticky globs inside the milker-tubes, pushing them halfway off your ' + Descriptors.multiCockDescriptLight() + '.\n\n', false );
				EngineCore.outputText( 'Hurried footsteps enter the barn, and a pair of firm hands grab onto your bouncing ' + Descriptors.multiCockDescriptLight() + ', pulling the milkers back against your groin and splattering spunk around the seal from the added pressure.  The machine-suction totally cuts off, but you don\'t even care.  You just keep cumming, pumping the thick white cream down the tubes by the force of your orgasm alone.   Eventually your incredible orgasm winds down, and the hands release you, allowing the tubes to pop off.  They slowly retracts to the wall as your harness is lowered, dropping your exhausted body in a wet heap on the ground.  When you regain your senses, your mysterious helper is gone.\n\n', false );
			}
			//(+40 fatigue);
			EngineCore.fatigue( 40 );
		}
		//EPILOGUE;
		EngineCore.outputText( 'There\'s a ', false );
		if( CoC.player.cumQ() < 20 ) {
			EngineCore.outputText( 'barely noticeable ', false );
		} else {
			EngineCore.outputText( 'thick ', false );
		}
		EngineCore.outputText( 'trail of your cum along the floor where the hose dragged itself back into the wall, though the machinery has closed back up and is now chugging noisily, clearly doing something.  A loud \'ding\' chimes and a panel displays ', false );
		//Set temp to liter amount produced.;
		var payout = 0;
		var cap = 500;
		//Ez mode cap doubles;
		if( CoC.flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] === 1 ) {
			cap *= 2;
		}
		//Get rid of extra digits;
		cumQ = Math.ceil( cumQ );
		if( cumQ > 100 ) {
			EngineCore.outputText( cumQ / 1000 + ' Ls.  ', false );
		} else {
			EngineCore.outputText( cumQ + ' mLs.  ', false );
		}

		//Calculate payout;
		if( cumQ > 100 ) {
			payout = 2 + Math.ceil( cumQ / 200 ) * 2;
		}
		//If over cap!;
		if( CoC.flags[ kFLAGS.WHITNEY_GEMS_PAID_THIS_WEEK ] >= cap ) {
			payout = 0;
			EngineCore.outputText( 'It also shows a warning: <b>FUNDS EXHAUSTED.</b>  ', false );
		}
		//Reduce payout if it would push past;
		else if( CoC.flags[ kFLAGS.WHITNEY_GEMS_PAID_THIS_WEEK ] + payout >= cap ) {
			payout = cap - CoC.flags[ kFLAGS.WHITNEY_GEMS_PAID_THIS_WEEK ];
			EngineCore.outputText( 'It also shows a warning: <b>Not enough gems for full payment.  GEMS NOW EXHAUSTED.</b>  ', false );
		}
		if( payout > 0 ) {
			if( CoC.player.cumQ() < 1000 ) {
				CoC.player.modCumMultiplier( 1 );
			}
			if( payout === 1 ) {
				EngineCore.outputText( Utils.Num2Text( payout ) + ' gem rolls ', false );
			} else {
				EngineCore.outputText( Utils.Num2Text( payout ) + ' gems roll', false );
			}

			EngineCore.outputText( 'out into a collection plate.  Whitney really put a lot of work into this! ', false );
			CoC.player.gems += payout;
			CoC.flags[ kFLAGS.WHITNEY_GEMS_PAID_THIS_WEEK ] += payout;
			EngineCore.statScreenRefresh();
		}
		if( CoC.player.countCockSocks( 'gilded' ) > 0 ) {
			var gems = Utils.rand( 2 ) + CoC.player.countCockSocks( 'gilded' );
			if( CoC.player.cumQ() > 1000 ) {
				gems *= 1.5;
			}
			if( payout > 0 ) {
				EngineCore.outputText( '\n\nAs you take your payment, <b>y', false );
			} else {
				EngineCore.outputText( '\n\n<b>Y', false );
			}
			EngineCore.outputText( 'ou see a few sparkling gems in your trail of cum on the floor. You reach down and pick up all ' + gems + ' of them</b>, and then you are', false );
			CoC.player.gems += gems;
		} else {
			EngineCore.outputText( '\n\nYou go', false );
		}
		EngineCore.outputText( ' on your way, whistling happily and feeling like taking a nap.', false );
		CoC.player.orgasm();
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
	};
	Farm.prototype.cowBadEnd1 = function() {
		EngineCore.outputText( 'You moo with delight, fondling your dripping ' + Descriptors.allBreastsDescript() + ' as you relax in your stall.   You know there was something uh, important or something that you were going to do - besides getting your udders milked!  Mmmmm, all your worries about that other thing just melt away when you\'re in your harness, spraying out milk...\n\n', true );
		EngineCore.outputText( 'You stop, trying to put your remaining wits to work and remember what you were going to do.   Let\'s see, you were coming here because your tits were so full that they made you ache, and you got hooked up and pumped like a good cow.  Another soft moo escapes your lips.  Now you\'re turned on and masturbating your drippy udders.  So the next step would be...\n\n', false );
		EngineCore.outputText( '...finding someone to fuck you silly while you get something to eat.  It\'s so simple!  You crawl out of your stall, feeling your ponderous breasts jiggle as they drag on the ground.  A trail of white cream clearly marks your passage out into the fields, eventually passing beyond the edges of Whitney\'s farm and into the mountains.', false );
		EngineCore.doNext( this.cowBadEnd2 );
	};
	Farm.prototype.cowBadEnd2 = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'A day later, you slosh back into the barn with your breasts painfully full and ready to be emptied.  Your cum-filled belly joins your tits in dragging on the floor while you daydream about your time in the minotaur caves last night.  The first one claimed your ' + Descriptors.assholeDescript() + ', brutalizing it over and over while the beast emptied his vast reservoirs of seed into your rectum.  Before the beast\'s equine-like cock could be stuffed halfway inside you, a slightly smaller minotaur was in front of your face, smearing your lips with a thick coating of his tasty pre.  Like a good cow, you opened wide for the bull and gratefully accepted his thick loads, feeling the narcotic-like spunk shut down your ability to think about anything but sex.\n\n', false );
		EngineCore.outputText( 'You moo happily, shivering at the intensity of the fond memories and in anticipation of tonight\'s activities.  But first you need to get your swollen nipples emptied!  The straps to the harness hang there in front of you – how do you work them again?  Your happy moos turn to moos of confusion and stress, but thankfully Whitney pads into the barn before you have a chance to panic.  She looks down and sighs, filling you with confusion.  You weren\'t a bad cow, were you?\n\n', false );
		EngineCore.outputText( 'The anthropomorphic country-girl gives you a gentle pat on the head as she works the straps, talking to herself as she does, "<i>Don\'t worry girl, I\'m not mad.  I reckon I should\'ve given you a stronger warning is all.  But now the damage is done – what\'s left of your brains was mushed up by all that milking.  Don\'t worry none honey, there will always be a spot in my stall for you.  I\'ll just have to make sure you don\'t get out with the animals again, won\'t I?</i>"\n\n', false );
		EngineCore.outputText( 'You nod happily, determined to find someone or something that can stuff you as full as your bulls did.  Whitney gives a resigned sigh as she turns the machine on, watching your determined stare melt into a dopey painting of relief...', false );
		EventParser.gameOver();
	};
	Farm.prototype.milkerBadEnd1 = function() {
		var cumQ = CoC.player.cumQ();
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'As you roll onto your back the machine delivers an encore performance on your swollen ' + Descriptors.multiCockDescriptLight() + ', down to the very same orgasm denial.  Wracked by pleasure but now freed to move, you find yourself trying to thrust aganst the tubes, as best as your feeble grip and exhaustion will allow, in order to try to override the machine\'s will and achieve release.  Nevertheless, the suction expertly mainpulates your arousal and you can do little except endure it as another oversized batch of cum wells up', false );
		//[(balls);
		if( CoC.player.balls > 0 ) {
			EngineCore.outputText( ' in your ' + Descriptors.ballsDescriptLight(), false );
		}
		EngineCore.outputText( '.  As before, the machine works you on and off for roughly an hour before the wall light once again turns green and the suction on your ' + Descriptors.multiCockDescriptLight() + ' intensifies.  Your hips take over as you buck against the machine and push out another ', false );
		if( cumQ < 100 ) {
			EngineCore.outputText( 'trickle', false );
		} else if( cumQ < 600 ) {
			EngineCore.outputText( 'stream', false );
		} else {
			EngineCore.outputText( 'torrent', false );
		}
		EngineCore.outputText( ' of jism.', false );
		//[(big skeet);
		if( cumQ > 1000 ) {
			EngineCore.outputText( '  Unlike before, a fleshy valve flap pops open in the rear of the suction cup', false );
			if( CoC.player.cockTotal() > 1 ) {
				EngineCore.outputText( 's', false );
			}
			EngineCore.outputText( ', and the pressure of your ejaculation forces squirts of cum out of the valve with every spasm, dribbling sticky whiteness back onto your crotch.', false );
		}
		EngineCore.outputText( '  The orgasm winds down but still the suction and the massage do not.\n\n', false );
		EngineCore.outputText( 'Another \'ding\'', false );
		//[(payment-worthy skeet);
		if( cumQ > 100 ) {
			EngineCore.outputText( ' and another clatter of gems', false );
		}
		EngineCore.outputText( ' reaches your ears as your second deposit is massed, but your attention is drawn to the new tube', false );
		///(if vag/nipplecunts/lactation);
		var tubes = false;
		if( CoC.player.hasVagina() || CoC.player.hasFuckableNipples() || CoC.player.biggestLactation() > 1 ) {
			EngineCore.outputText( 's', false );
			tubes = true;
		}
		EngineCore.outputText( ' snaking out of the wall toward you.  Spent as you are, you can only manage a token resistance as ', false );
		if( !tubes ) {
			EngineCore.outputText( 'it', false );
		} else {
			EngineCore.outputText( 'one of them', false );
		}
		EngineCore.outputText( ' inserts a rod-like end into your mouth and begins trickling salty fluids down your throat.', false );
		//[(if vag)  ;
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( '  Another tube, likewise capped with a thick, firm end instead of a suction cup, reaches your ' + Descriptors.vaginaDescript( 0 ) + ' and pushes inside, secreting more of the fluid.  ', false );
			CoC.player.cuntChange( 15, true );
			//[(bigclit);
			if( CoC.player.clitLength > 3 ) {
				EngineCore.outputText( 'A smaller suction tube fastens over your ' + Descriptors.clitDescript() + ' as it rouses from the vaginal stimulation.', false );
			}
		}
		//[(lactation, no nipplecunts);
		if( CoC.player.biggestLactation() >= 1 && !CoC.player.hasFuckableNipples() ) {
			EngineCore.outputText( '  Some tubes of the cup-type latch onto your ' + Descriptors.nippleDescript( 0 ) + 's, then begin suction of their own. You feel your breastmilk shift toward the nipples, then begin to dribble into the tubes.', false );
		}
		//[(nipplecunts);
		if( CoC.player.hasFuckableNipples() ) {
			EngineCore.outputText( '  More tubes snake up to your ' + Appearance.biggestBreastSizeDescript() + ' and work their way into your ' + Descriptors.nippleDescript( 0 ) + 's.', false );
		}
		EngineCore.outputText( '  ' + Descriptors.SMultiCockDesc() + ' becomes enormously hard again in a matter of seconds as you absorb the secretions.  You quickly deduce what it is you\'re tasting; the demon-designed tubing is feeding your own semen back into you, laced with some kind of chemical!\n\n', false );
		EngineCore.outputText( 'Under the effects of this new drug, ' + Descriptors.sMultiCockDesc() + ' inflates, engorging with blood until it\'s much larger than usual', false );
		//[(balls);
		if( CoC.player.balls > 0 ) {
			EngineCore.outputText( ' and your ' + Descriptors.sackDescript() + ' stretches as your ' + Descriptors.ballsDescriptLight() + ' nearly double in size', false );
		}
		EngineCore.outputText( '.  Another orgasm passes, this time unhindered as the machine does not slow its efforts in the slightest.  More than twice the previous quantity of semen shoots out of your cock', false );
		if( CoC.player.cockTotal() > 1 ) {
			EngineCore.outputText( 's', false );
		}
		EngineCore.outputText( ', thanks assuredly to the drug', false );
		//[(balls);
		if( CoC.player.balls > 0 ) {
			EngineCore.outputText( ' and the new volume of your monstrous testicles', false );
		}
		//[(big skeet);
		if( cumQ > 1000 ) {
			EngineCore.outputText( ', spraying out of the overflow valve and coating your entire lower body', false );
		}
		EngineCore.outputText( '.', false );
		//[(if vag);
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( '  Your cunt spasms around its invader, milking the pseudo-cock and drawing the tainted semen it emits even deeper into your womb', false );
			//[(big clit);
			if( CoC.player.clitLength > 3 ) {
				EngineCore.outputText( ', and your clitoris twitches under the cup, threatening to black you out from the pleasure', false );
			}
			EngineCore.outputText( '.', false );
		}
		//[(lactation) ;
		if( CoC.player.biggestTitSize() > 1 ) {
			EngineCore.outputText( '  Your milk sprays out of your ' + Descriptors.nippleDescript( 0 ) + 's', false );
			//[(nipplecunts);
			if( CoC.player.hasFuckableNipples() ) {
				EngineCore.outputText( ' and rings raise from the bases of the shafts inside your nipples, forming a seal,', false );
			}
			EngineCore.outputText( ' as suction begins to whisk it away.', false );
		}
		EngineCore.outputText( '  A minute after your release, the flow in the other direction intensifies, pouring more fluid into you than before', false );
		//[(lactation);
		if( CoC.player.biggestLactation() > 1 ) {
			EngineCore.outputText( ', the drug now tasting of the milk mixed in', false );
		}
		EngineCore.outputText( '. Another chorus sounds from the counter and you hear some gems tinkling as they roll off the plate and onto the ground.\n\n', false );
		EngineCore.outputText( 'For several hours this continues, ' + Descriptors.sMultiCockDesc() + ' swelling to nearly twice its previous size and your orgasms coming one after another without a break as you pump your hips, knowing or caring about nothing except getting off on your machine lover and being fed in turn.  Your load each time is increased rather than decreased, with the cups growing multiple fleshy overflow valves and working overtime to vent the excess pressure every time you ejaculate.  ', false );
		//[(corruption > 90, high demonscore);
		if( CoC.player.cor > 90 ) {
			EngineCore.outputText( 'After literally hundreds of orgasms, the machine once again begins carefully regulating its suction, denying your release.  Repeatedly it teases your ' + Descriptors.multiCockDescriptLight(), false );
			//[(vag);
			if( CoC.player.hasVagina() ) {
				EngineCore.outputText( ' and ' + Descriptors.vaginaDescript( 0 ), false );
			}
			EngineCore.outputText( ' to the edge of orgasm and then backs off.  All the pumping in the world can\'t seem to get you over it, and your frustration mounts as the minutes roll by.  A sharper pressure than usual forms at the base of your ' + Descriptors.multiCockDescriptLight() + ' as you fruitlessly grind into the tubes, wishing more than anything to climax; the green light on the wall steadfastedly refuses to light up, mocking your attempts.  From the new pressure an odd strength flows through the rest of your body, increasing your sexual fervor and giving you a second wind, and you finally manage to get a good grip on the tubes, nearly slamming them back and forth on your shaft', false );
			if( CoC.player.cockTotal() > 1 ) {
				EngineCore.outputText( 's', false );
			}
			EngineCore.outputText( '.  This damn demon machine can\'t stop you from getting off anymore; with a violent shove you bury ' + Descriptors.sMultiCockDesc() + ' into the mouth', false );
			if( CoC.player.cockTotal() > 1 ) {
				EngineCore.outputText( 's', false );
			}
			EngineCore.outputText( ' as your orgasm lets fly!  A truly miraculous amount of semen erupts from your ' + Descriptors.multiCockDescriptLight() + ', blowing off the covers of the overflow valves entirely. Jizz shoots across the room as you feel the bulge of pressure slide up your shaft and out of your urethra; a large pink crystal falls out of an open valve-hole and onto the wet floor with a \'plop\'.  ', false );
		}
		EngineCore.outputText( 'It is at this point Whitney walks in.\n\n', false );
		EngineCore.outputText( '"<i>What the FUCK!</i>" the rancher says, her eyes bugging out at the spectacle of you tied to the machine with demonic tubing and the sheer volume of semen you\'ve left in thick ropes all over her barn.', false );
		//[(corruption < 90)  ;
		if( CoC.player.cor < 90 ) {
			EngineCore.outputText( '  You barely take notice of her as another explosive orgasm goes off, your enormously swollen penis', false );
			if( CoC.player.cockTotal() > 1 ) {
				EngineCore.outputText( 'es', false );
			}
			EngineCore.outputText( ' pushing massive loads of semen down the tubes and out of the release valves in a firework pattern. Whitney shrinks back as some of the spooge squirts across the barn and comes to a stop less than a foot from her. The canine woman screams volubly enough to wake the entire farm. "<i>Dammit, ' + CoC.player.short + '; just... DAMMIT!</i>" You spare her not even a thought as you anticipate your next injection of the tainted chemicals and work up another batch of jizz.', false );
			EngineCore.dynStats( 'lib', 20, 'sen', 10, 'lus', 80, 'cor', 20 );
		}
		//[(corruption > 90, high demonscore);
		else {
			EngineCore.outputText( '  Still filled with the residual effects of your sudden burst of energy, you pull off the tubes one by one and, taking a moment to snatch up the pink crystal, saunter over to her. Her eyes widen at the simultaneously horrifying and comical sight of you approaching with lust in your eyes and ', false );
			//[(onecox);
			if( CoC.player.cockTotal() === 1 ) {
				EngineCore.outputText( 'a gigantic, erect penis bobbing in front of you and throwing off your balance', false );
			}//(multi);
			else {
				EngineCore.outputText( 'multiple gigantic, erect penises bobbing in front of you and dragging between your legs, head pinned against the floor', false );
			}
			EngineCore.outputText( '.  Just in time she backs up and pulls a pitchfork down from the wall. "<i>I expect I was wrong about you when we met, ' + CoC.player.short + '.  Get on out of here now and never come back or I\'ll make sure you never go anywhere again.</i>"  Scowling, you break off your advance and head toward the door.  Though you definitely want to fuck her, giving yourself a chance to adjust to your magnificent new body might not be a bad idea either.  After all, no matter what she says you can always come back... meanwhile you vow to find something or someone to rape or turn into your personal cock-milker.  With an amazing ', false );
			if( CoC.player.totalCocks() === 1 ) {
				EngineCore.outputText( 'dick', false );
			} else {
				EngineCore.outputText( 'set of dicks', false );
			}
			EngineCore.outputText( ' like yours, why worry about anything else for the moment?', false );
			EngineCore.dynStats( 'lib', 20, 'sen', 10, 'lus', 80, 'cor', 100 );
		}
		EventParser.gameOver();
	};
	//Introduction: Finding the Toys @ The Farm;
	Farm.prototype.centaurToysHoooooo = function() {
		EngineCore.spriteSelect( 62 );
		EngineCore.outputText( '', true );
		//[Places] - [Farm] - [Talk] If PC = Centaur;
		EngineCore.outputText( 'You find the dog-morph Whitney standing in the entrance to her barn, scratching her head with consternation.  You approach her and ask what\'s up.\n\n', false );
		EngineCore.outputText( '"<i>Oh, hey there, ' + CoC.player.short + ',</i>" Whitney says, leaning heavily on her pitchfork.  "<i>Not much, just trying to figure out... Hey, now!</i>" she says, eying up your powerful centaur frame.  ', false );
		if( CoC.player.cor < 50 ) {
			EngineCore.outputText( 'You shift awkwardly and ask her what\'s wrong.', false );
		} else {
			EngineCore.outputText( 'You strut a bit, showing yourself off in a subtly lewd manner.  When you\'re finished, you ask the dog-girl if she likes what she saw.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'She clears her throat awkwardly.  "<i>Uh, well... A pair of centaurs that lived here the last couple of years ran off, looks like.  Gone to get married or something, by the sound of things.  So, hey, wanna help me solve a little problem I\'m having?</i>"\n\n', false );
		EngineCore.outputText( 'You shrug. Sure.\n\n', false );
		EngineCore.outputText( '"<i>See, the two of them left some rather personal belongings behind,</i>" Whitney says, swinging the barn door open.  Inside, lying in the middle of a stall are what looks like a tall, slender totem with a giant rubber horsecock sticking out of it and a fake mare standing on reinforced wooden legs with a glistening, horsey onahole between its thighs.  Oh, my.  "<i>So, ' + CoC.player.short + ', since you look to have the right build for \'em... they\'re yours.</i>"\n\n', false );
		EngineCore.outputText( 'You tell her sure, and spend the next few minutes loading them onto the back of your horse-body.  Even if you don\'t end up using them yourself, you\'ve got plenty of room in camp for them, unlike Whitney.  Loaded up with centaur-friendly sex toys, you make your way back to camp.\n\n', false );
		EngineCore.outputText( '(<b>Key Items Gained: Fake Mare and Centaur Pole</b>)', false );
		CoC.player.createKeyItem( 'Fake Mare', 0, 0, 0, 0 );
		CoC.player.createKeyItem( 'Centaur Pole', 0, 0, 0, 0 );
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
	};
	SceneLib.registerScene( 'farm', new Farm() );
} );