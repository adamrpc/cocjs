'use strict';

angular.module( 'cocjs' ).run( function( MainView, SceneLib, CoC, Utils, StatusAffects, EngineCore, AppearanceDefs, Descriptors, DemonPack, PregnancyStore, kFLAGS, Combat ) {
	function Oasis() { }
	Oasis.prototype.oasisEncounter = function() {
		MainView.spriteSelect( 46 );
		//Find oasis, sit there.
		MainView.outputText( 'You wander in the desert for what seems like hours, sweating profusely in the sweltering heat. Eventually you come across a small watering hole surrounded by scrappy trees and shrubs. It would be foolish not to take this opportunity to drink, freshen up and paddle your ' + CoC.player.legs() + ' in the cooling water, so you settle into what little shade you can find for a quick break.\n\n', true );
		//Demons approach!
		MainView.outputText( 'After a while sitting in the sparse shade provided by one of the bushes around the oasis you see figures shimmering into view across the desert sands.  As you watch the figures they grow more defined and more numerous until finally a group of vaguely humanoid shapes emerges from the heat haze.  The closer these figures become the more detail they take on, and as they near the edge of your small oasis you are able to make out most of their features.\n\n', false );
		//Describe the demonic group in detail
		MainView.outputText( 'The group is composed of roughly twenty tan skinned demons, mostly humanoid in shape with many and varied corruptions across the group. You see demonic high heels, twisting horns and swinging cocks of all shapes and sizes. There even seems to be a bull head in there somewhere. You also make out plenty of breasts ranging from tiny ones to a pair that require a second person to carry them, and with those breasts a wide range of pussies, dripping and dry, sometimes nestled below some form of demonic dick. The small tribe carry no weapons and what little clothing they wear is well shredded, except for one hefty male wearing a cloak of what appears to be snakeskin across his broad shoulders. You assume from his clothing and the size of his equipment that this male is the leader. He, along with the others, is in good spirits and they all look fairly non-threatening, although you\'ve learned not to trust anything that looks non-threatening in this place. Especially if it can carry its cock over its shoulder.\n\n', false );
		//OH noes! Cheese it!
		MainView.outputText( 'The demons don\'t notice you until they are quite close, the glare of the surrounding sand making you very difficult to see in the shade of your scrappy bush. They ignore you, intent on the refreshing waters of the oasis, but you can\'t stay hidden forever. A small keen eyed demon eventually spots you and lets out a  cry of alarm, pointing you out to the others. More eyes than twenty heads should really possess are now pointed straight at you.\n\n<b>What do you do?</b>', false );
		EngineCore.choices( 'Talk', this, this.oasisTalk, 'Fight', this, this.chooseToFight, '', null, null, '', null, null, 'Leave', this, this.oasisRunAway );
	};
	Oasis.prototype.chooseToFight = function() {
		MainView.spriteSelect( 46 );
		//Run away successfully if fast enough.  80 speed = autosuccess.
		if( CoC.player.spe > 15 && CoC.player.spe / 2 > Utils.rand( 40 ) ) {
			MainView.outputText( 'You bolt out from under your bush and scramble away over the sand. Before long the swishing sounds of pursuit fade away and looking back you see the few demons with the gusto to follow you tramping back to the oasis.', true );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		} else {
			MainView.outputText( 'You scramble away from the demons, but are too late. A swift demon with canine features tackles you to the ground.  Luckily he loses his grip as you tumble onto the sand and you slither free, stand up and wheel to face the host of leering demons which begin to advance with malicious intent.', true );
			Combat.startCombat( new DemonPack() );
			EngineCore.doNext( MainView, MainView.playerMenu );
		}
	};
	Oasis.prototype.oasisTalk = function() {
		MainView.spriteSelect( 46 );
		//Nice weather...
		MainView.outputText( 'You rise cautiously from the shade of your scraggly little bush and look over the demons arrayed before you. Briefly you wonder how exactly conversations start in a desert oasis, before settling on \'nice weather we\'re having.\' The reaction is mixed. Some laugh, some stare in utter confusion. The ludicrously endowed leader in the snakeskin cloak throws his head back and produces a deep, thundering laugh. When he regains his composure he brings his head back around to level a deadly smile full of sharp teeth in your direction. \'Yes,\' he says \'...nice.\'\n\n', true );
		//Offer...
		MainView.outputText( 'At this your repertoire of desert conversation topics is exhausted and it occurs to you that it may be easier to break the ice somewhere it is possible for ice to form. At the edge of slipping over into awkward silence the leader speaks. \'It is quite the strike of fortune that you would come to us just as we were to rest and feast. Perhaps you wish to partake with us?\' A flash of panic runs over your mind, and you turn over the phrase a few times in your head. After a few seconds you conclude that \'partake with us\' really cannot mean \'be a delicious entree\' and entertain the thought of staying to feast.  As if sensing your hesitation the leader speaks again. "<i>We have not feasted in a long time, and we do hunger for it so.  This one promises to be a feast of grand proportions, and it should be a shame for you to miss such an opportunity.</i>"\n\n', false );
		MainView.outputText( '<b>Do you stay or try to leave?</b>', false );
		EngineCore.choices( 'Stay', this, this.oasisTalkAccept, '', null, null, '', null, null, '', null, null, 'Leave', this, this.oasisTalkDecline );
	};
	Oasis.prototype.oasisTalkDecline = function() {
		MainView.spriteSelect( 46 );
		MainView.outputText( 'You consider the invitation, but do your best to politely decline. The little giggle this produces in a small implike creature in the back of the group send chills down your spine and you turn to go, but as you do so you catch the eye of the leader. His grin has widened, as if he knows something that you do not. With a deliberate slowness he starts to chuckle, and your worst fears are confirmed when you hear the words \'Silly creature. The offer to feast is never denied. Take it alive and kicking.\'\n\n', true );
		//MORTAL KOMBAAAAAT
		MainView.outputText( 'The demons begin to circle menacingly, and you can do nothing but prepare to defend yourself.', false );
		Combat.startCombat( new DemonPack() );
		EngineCore.doNext( MainView, MainView.playerMenu );
	};
	Oasis.prototype.oasisTalkAccept = function() {
		MainView.spriteSelect( 46 );
		//You slut!
		MainView.outputText( 'The leader smiles in genuine delight and excited chatter rises up from the group of demons. \'This is excellent. It has been so long since we last had one of your kind join us.\' Behind him the demons begin to slide free of their tattered rags, hardening, dampening and licking their lips. As the leader steps forward to caress the curves and angles of your body you begin to suspect that the hunger this feast is to satisfy is not for food, but all that is forgotten as the demons swarm silently around you and you stumble back onto the hot sand, ', true );
		if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
			MainView.outputText( 'your rear legs losing their balance and sending you crashing on your flank.  ', false );
		} else {
			MainView.outputText( 'legs falling open in the process.  ', false );
		}
		MainView.outputText( 'Suddenly the silence is broken by a shrill screeching laugh, then a howl and the movement of the demons begins to accelerate. The deep bass laugh of the demon leader breaks over you like a crashing wave and the demons shriek with frenzied lust as they take you on the sand of the oasis.', false );
		//Count voluntary submissions
		if( !CoC.player.findStatusAffect( StatusAffects.VoluntaryDemonpack ) ) {
			CoC.player.createStatusAffect( StatusAffects.VoluntaryDemonpack, 0, 0, 0, 0 );
		} else {
			CoC.player.addStatusValue( StatusAffects.VoluntaryDemonpack, 1, 1 );
		}
		//TO THE SECKSIN!
		EngineCore.doNext( this, this.oasisSexing );
	};
	Oasis.prototype.oasisSexing = function() {
		MainView.spriteSelect( 46 );
		CoC.player.slimeFeed();
		//New screen
		MainView.outputText( '', true );
		//For manpartz
		if( CoC.player.cocks.length > 0 ) {
			MainView.outputText( 'You feel clawed hands grasp at ', false );
			if( CoC.player.cockTotal() > 1 ) {
				MainView.outputText( 'each of ', false );
			}
			MainView.outputText( 'your ' + Descriptors.multiCockDescriptLight() + ' and begin to slide up and down before another demon pushes them out of the way and you ', false );
			if( CoC.player.cocks[ 0 ].cockLength > 25 ) {
				MainView.outputText( 'feel your ' + Descriptors.cockDescript( 0 ) + ' slide into a hell-girl\'s sloppy cunt. The demoness moans and pants in pleasure as your ' + Descriptors.cockDescript( 0 ) + ' bottoms out in her gaping pussy and she begins to ride you like the motionless whore you momentarily are, her gigantic breasts threatening to concuss you as she slides the huge distance up and down your cock in her thirst to fill her cavelike cunt.  ', false );
			} else {
				MainView.outputText( 'see a smaller and younger demon lowering her very tight pussy onto your ' + Descriptors.cockDescript( 0 ) + '. It\'s a tight fit, but her almost-virginal pussy is dripping wet. She bottoms her pussy out ', false );
				if( CoC.player.cocks[ 0 ].cockLength > 17 ) {
					MainView.outputText( 'with hardly any of you inside her ', false );
				} else if( CoC.player.cocks[ 0 ].cockLength > 12 ) {
					MainView.outputText( 'about halfway down your ' + Descriptors.cockDescript( 0 ) + ' ', false );
				} else if( CoC.player.cocks[ 0 ].cockLength > 6 ) {
					MainView.outputText( 'with almost all of you inside of her ', false );
				} else if( CoC.player.cocks[ 0 ].cockLength <= 6 ) {
					MainView.outputText( 'as her pussy lips touch the base of your ' + Descriptors.cockDescript( 0 ) + ' ', false );
				}
				MainView.outputText( 'and begins to slide herself up and down your shaft in complete ecstasy, moaning like a cheap whore. She seems relatively uncorrupted for a denizen of this realm and is firm, tight and free of fur. Only a pair of horns betrays her taint. The thought that you are perhaps one of her first cocks sends tingles down your spine.  ', false );
				if( CoC.player.cocks[ 0 ].cockLength > 6 ) {
					MainView.outputText( 'The realisation that her pussy is slowly stretching over your ' + Descriptors.cockDescript( 0 ) + ' gives you a thrill that can only be described as positively evil.  ', false );
					EngineCore.dynStats( 'cor', 1 );
				}
				MainView.outputText( 'Soon the slender cock-whore begins to cum and she starts on what is about to be the first of several shuddering orgasms. You smile evilly as she cums around your ' + Descriptors.cockDescript( 0 ) + ' and when her eyes roll back to the front of her head you know that there is more to come.  ', false );
			}
			//Orgasmzzzzzzz
			MainView.outputText( 'Soon you\'re shaking and pumping your seed deep into her pussy as she screams out one of her many orgasms and you cum deep inside her for the first time.  ', false );
			//Multizz
			if( CoC.player.cocks.length > 1 ) {
				MainView.outputText( 'As you lie there under the needy demon your other ', false );
				if( CoC.player.cocks.length === 2 ) {
					MainView.outputText( Descriptors.cockDescript( 1 ) + ' is', false );
				} else {
					MainView.outputText( 'cocks are', false );
				}
				MainView.outputText( ' taken by other hands and other eager pussies ranging from painfully, childishly tight to freakishly huge!', false );
			}
			//IZ OVER FOR MENZ
			MainView.outputText( '\n\n', false );
		}
		//Girly bitz funtimes!
		if( CoC.player.vaginas.length > 0 ) {
			//Herms only!
			if( CoC.player.gender === 3 ) {
				MainView.outputText( 'From your cock it is only a tiny trip downward between your legs before the demons discover something new to play with.  ', false );
			}//Girlies only!
			else {
				MainView.outputText( 'The demons quickly find your ' + Descriptors.vaginaDescript( 0 ) + ' and tussle eagerly for position at your entrance, first with hands and then with a wide range of demonic dicks.  ', false );
			}
			//gaping cunners!
			if( CoC.player.vaginas[ 0 ].vaginalLooseness >= AppearanceDefs.VAGINA_LOOSENESS_LEVEL_CLOWN_CAR ) {
				MainView.outputText( 'However all of this fighting for place is in vain, as the leader with the huge cock has already marked you for his own. The broad demon shoves the smaller ones roughly to the side at the sight of your freakishly large pussy and carefully lowers his gigantic dick to the entrance of your gargantuan fuck hole. Without pause or ceremony the leader plunges his enormous phallus into you and although it takes all the muscles in his body he begins to drive it back and forth, filling every possible inch of your ' + Descriptors.vaginaDescript( 0 ) + '. You feel a curious pain that you\'ve not felt in a long time and realize that your ' + Descriptors.vaginaDescript( 0 ) + ' is stretching around his frankly frightening tool. As he withdraws the walls spring back with a curious elasticity, and it occurs to you that it may not actually be possible to stretch further with any permanence. Before long the huge demon begins to shudder and shake and he cums. His trio of heavy balls pump load after load into your waiting cunt until your belly bulges and spunk begins to spurt back out of your pussy from the sheer amount of cum being loaded into you.', false );
			}//Not gaping!
			else {
				MainView.outputText( 'Eventually one of the demons wins out and sets the tip of his hefty dog-cock at the entrance to your pussy. He rams his member into your ' + Descriptors.vaginaDescript( 0 ) + ' with one swift thrust and begins to pump himself in and out of your cunt. However, the other demons will not be denied. You feel a pressure at your lips and without warning a second slightly smaller dick shoves itself into your already-stuffed ' + Descriptors.vaginaDescript( 0 ) + '.  ', false );
				//vaginal streeeetch
				CoC.player.cuntChange( 40, true );
				MainView.outputText( 'The two cocks pump you hard until you feel one of them shooting your ' + Descriptors.vaginaDescript( 0 ) + ' full of hot demon cum. Eventually both the dicks release inside you and slip out one after the other, but each time another takes their place so that your pussy is never empty.', false );
			}
			//Orgasmzzzzz
			MainView.outputText( '\n\nThe feeling of immense fullness gets better and better as the cum surging into your ' + Descriptors.vaginaDescript( 0 ) + ' fills any conceivable crevice not taken up by cock. Far beyond your own control now you come a hair\'s breadth from passing out as you feel the muscles of your ' + Descriptors.vaginaDescript( 0 ) + ' begin to clamp down again and again on the mass inside you.  Eventually the world begins to solidify again and it is with a sense of immense delight that upon your return from the borders of unconsciousness you find yourself still completely full of demonic dick, heralding many more orgasms of that quality to come.', false );
			//IZ OVER! NEWLINE BITCH
			MainView.outputText( '\n\n', false );
			//Preggers chance!
			CoC.player.knockUp( PregnancyStore.PREGNANCY_IMP, PregnancyStore.INCUBATION_IMP, 90 );
		}
		//Buttbutt buuuuuttt
		if( CoC.player.gender > 0 ) {
			MainView.outputText( 'However, the demons are interested in every part of you, not just your crotch.  ' );
		}
		MainView.outputText( 'Soon you feel hands and dicks grabbing and jabbing at your ' + Descriptors.buttDescript() + ', edging inwards bit by bit and jostling for position as a slippery cock positions itself at the opening of your ' + Descriptors.assholeDescript() + '. It pauses for a second and then dives straight into your waiting asshole.  ', false );
		if( CoC.player.vaginas.length > 0 ) {
			MainView.outputText( 'You feel the cocks in your ass and pussy rubbing into each other as your lower body becomes a temple of friction. The feeling of so much demon stuffing you as full as possible is almost unbearable, and you are inches away from blacking out as you come again.  ', false );
		}
		MainView.outputText( 'The cock fucks you hard and fast for a dozen strokes and then you feel it begin to pump its cum into your stuffed ass until it can\'t come any more. It slips out of your ' + Descriptors.buttDescript() + ' and is quickly replaced by another which comes and then is itself replaced in what becomes a seemingly endless cycle.  ', false );
		CoC.player.buttChange( CoC.monster.cockArea( 0 ), true );
		//More fucking!
		MainView.outputText( 'Around you you see the demons wrapped up in the frenzy of fucking that they\'ve fallen into. No hole is unfilled and not a single cock isn\'t sunk into some being\'s flesh. The moans and screams are almost contagious and you feel them clouding your brain making you want more, harder.', false );
		EngineCore.dynStats( 'int', -1, 'lib', 1 );
		//Titzen!
		if( CoC.player.breastRows.length > 0 ) {
			if( CoC.player.biggestTitSize() > 1 ) {
				MainView.outputText( '  Demonic hands grab and squeeze at your ' + Descriptors.allBreastsDescript() + ' and lips fasten around your ' + Descriptors.nippleDescript( 0 ) + ' and begin to lick and suck like there\'s no tomorrow.', false );
			}
		}
		//Newline for oral!
		MainView.outputText( '\n\nSoon even your mouth is taken by a demoness lowering her slick honeypot down onto your lips. You lick and suck as she moans like a whore atop your head. It\'s impossible to count how many times she comes and so you just relax into a rhythm of licking and sucking, interrupted only by your own bone-creaking orgasms as the demonic attentions to the rest of your body drive you over the edge time and time again.', false );
		//Non-preggers text!
		if( CoC.player.pregnancyIncubation === 0 && CoC.player.gender > 1 ) {
			//Newline for potential preggers?
			MainView.outputText( '\n\n', false );
			MainView.outputText( 'You do your best to keep a vague mental catalogue of what has been in where, but eventually it becomes impossible to remember the type or number of demonic dicks that have filled you with their cum. The sand below your ass is wet with seed that has spilled out of your overflowing ' + Descriptors.vaginaDescript( 0 ) + ' and there is every indication of more to come.\n\n', false );
		}
		//If you got here by winning combat!
		if( (CoC.monster.HP < 1 || CoC.monster.lust > 99) && CoC.isInCombat() ) {
			MainView.outputText( 'You fuck and fuck until not a single demon is capable of servicing your needs. They lie moaning and panting at the edge of the oasis, unable to move. You survey the fallen fiends with just a touch of pride and a whole lot of satisfaction, your body feeling stronger for the endurance exercise.', false );
			Combat.cleanupAfterCombat();
			CoC.player.orgasm();
			EngineCore.dynStats( 'cor', 1.5 );
			return;
		}
		//If you got here by losing combat!
		else if( (CoC.player.HP < 1 || CoC.player.lust > 99) && CoC.isInCombat() ) {
			//Oasis Demons Defeat PC as part of antm
			//Antmorph stuff
			if( CoC.monster.findStatusAffect( StatusAffects.phyllafight ) ) {
				MainView.outputText( 'You sought to save the ant-girl from being raped, and looking around, you don\'t see her anywhere.  She must have gotten away safely.  Mission... accomplished?  Wait, that ungrateful little bitch just left you to suffer in her place!  Your ass is gonna be sore for a while, but not as sore as your pride...  ' );
				CoC.flags[ kFLAGS.ANTS_PC_FAILED_PHYLLA ] = 1;
			}
			MainView.outputText( 'The demons fuck you like animals until you can\'t come any more. Every one of your orifices is filled and you pump out orgasm after orgasm until you black out from the abuse.', false );
			Combat.cleanupAfterCombat();
			CoC.player.orgasm();
			EngineCore.dynStats( 'tou', 0.5, 'cor', 3 );
			return;
		}
		//If you submitted willingly - chance of bad end
		if( CoC.player.statusAffectv1( StatusAffects.VoluntaryDemonpack ) >= 6 && CoC.player.hasVagina() ) {
			EngineCore.doNext( this, this.oasisBadEnd );
			return;
		}
		MainView.outputText( 'You fuck for hours; \'feasting\' with the demons. Pain, pleasure and exhaustion intermingle and no matter how hard you try to cling to consciousness you are in no state to concentrate. You dangle over the edge for what seems like eternity before another orgasm, stronger than any other, hits you like a solid wall and you black out. For a little while you drift in and out of conscious reality to find your body still the object of demonic attentions until eventually you wake to find that the seemingly endless string of orgasms has stopped. Looking around you see what demons remain awake engaged solely in fucking each other. Tender and sore from the abuse and still finding it hard to concentrate you gather your clothes and steal away, leaving them to the tail end of their orgy. In the aftermath you feel like you\'ve just run an endurance race, but the rubbed raw sensitivity of your brutally fucked body tells another tale.', false );
		CoC.player.orgasm();
		EngineCore.dynStats( 'tou', 0.5, 'sen', 0.5, 'cor', 4 );
		if( CoC.isInCombat() ) {
			Combat.cleanupAfterCombat();
		} else {
			EngineCore.doNext( MainView, MainView.playerMenu );
		}
	};
	//Desert Tribe Bad End
	Oasis.prototype.oasisBadEnd = function() {
		MainView.spriteSelect( 46 );
		//You get this ending if you are a fully corrupt female/herm/centaur with low intelligence and had over 5-10 'Feast' encounters with the Desert Tribe, once the leader starts laying a claim on you because of your large clit
		MainView.outputText( 'You fuck for hours, \'feasting\' with the demons. Pain, pleasure and exhaustion intermingle; no matter how hard you try to cling to consciousness, you are in no state to concentrate enough to succeed. You dangle over the edge for what seems like eternity before an orgasm stronger than any other hits you like a solid wall. You black out...\n\n', true );
		//[If female/herm]
		MainView.outputText( 'After passing out from your latest orgy with the desert tribe, you wake up to find yourself still naked and laying on your back. ', false );
		//[If female/herm]
		if( CoC.player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
			MainView.outputText( 'Your feet are locked up in shackles, though with a chain long enough to leave you room to move or walk without problems. ', false );
		}
		if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
			MainView.outputText( 'Your four legs are locked up in shackles, though with a chain long enough to leave you room to move or walk without problems. ', false );
		}
		MainView.outputText( 'Your arms are also tied up behind your back, resting uncomfortably in the hot desert sand. You can see the tribe is packing up to get ready to move on, and you struggle to sit up against your bindings.\n\n', false );
		MainView.outputText( '"<i>I see that you are awake, slave,</i>" the leader says after watching you get up, walking closer to you with a wicked smirk on his lips. He stares down at you with a look of satisfaction on his face. "<i>Thought you would wake up in time to sneak off on us again, did you? Well, that won\'t be happening anymore.</i>"\n\n', false );
		MainView.outputText( '"<i>What the hell are you talking about? I\'m no one\'s slave!</i>" you yell in indignation, only to cry out in pain as the tribe leader\'s hand comes down and smacks you across the face. Your head jerks back from the force of the blow, successfully silencing you.\n\n', false );
		MainView.outputText( '"<i>There will no longer be any of that back talk, slave. As for what I\'m talking about... After all of our encounters with you, my tribesmen and I have made a decision.</i>" The leader\'s smirk widens as he reaches down and grips your face tightly, forcing you to look up at him. His eyes look you over appraisingly as he pulls out a black collar with a long chain attached and fastens it to your neck. His other hand reaches down to one of your ' + Descriptors.nippleDescript( 0 ) + 's and grabs it roughly, giving it a hard squeeze and causing you to let out a small moan of pain and pleasure. He relinquishes his grip and walks around you, continually looking you over and scrutinizing your body from every angle. "<i>We have decided that you would make an excellent addition to our group, and have laid claim to you as our sex slave... to be used in any way that we want.</i>" He stops in front of you and continues, "<i>We were lucky to catch you while you were still unconscious, before you could sneak off on us. I will personally enjoy using you for my own purposes. Maybe I\'ll even use you to carry my children once you\'re properly broken in.</i>"\n\n', false );
		//[If herm]
		if( CoC.player.gender === 3 ) {
			if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
				MainView.outputText( '"<i>Everyone will have a great time playing with you,</i>" the leader says, smirking wider still as he stares at your centaur body. He reaches out and gives your ' + Descriptors.buttDescript() + ' a hard smack, causing you to yelp and quickly stand to your feet. You stagger a bit as your legs strain against the shackles as you stand. Without warning, he sticks his fingers inside of your ' + Descriptors.assholeDescript() + ' and stretches it out as his free hand reaches between your legs to play with both your ' + Descriptors.vaginaDescript( 0 ) + ' and ' + Descriptors.cockDescript( 0 ) + '. You gasp and moan in pleasure as your cock becomes erect in his hand. He laughs as he lets go and moves back in front of you. "<i>Plus we could use you to carry our heavy loads like a pack animal. You have the perfect body for it.</i>"\n\n', false );
			} else {
				MainView.outputText( 'His smirk widens even more as he stares down at your uncovered ' + Descriptors.cockDescript( 0 ) + ' laying flaccidly between your legs against the hot desert sand. You gasp in surprise as he suddenly reaches down and takes a firm hold of your ' + Descriptors.cockDescript( 0 ) + '. He strokes it and gives it a rough squeeze, making you whimper sensually as it becomes fully erect in his hand. He laughs as he lets it go, "<i>Our girls will definitely be having fun with you, slave.</i>"\n\n', false );
			}
		}
		MainView.outputText( 'You stare up at the leader with dread, realizing that there is nothing you could do for the moment. You cannot run away because you are chained up, and fighting isn\'t possible considering you don\'t see your weapons anywhere in sight. With all of the demons here, you wouldn\'t be able to get very far anyway. But even as you consider your method of escape, a small part of you feels excited about staying with the tribe, being used and abused by them for as long as possible.\n\n', false );
		MainView.outputText( '"<i>Get up and start walking, we\'re leaving now. Don\'t look so unhappy about your situation, slave,</i>" the leader says, deepening his smirk as he stares down at you. ', false );
		//[If female/herm]
		if( CoC.player.gender >= 2 ) {
			MainView.outputText( 'He reaches down to grab a hold of your hair and lifts you to your feet, causing you to yelp out in pain from the sharp pull.  ', false );
		}
		MainView.outputText( 'He gives the chain attached to your neck an extra sharp tug and forces you to start walking behind him. As the tribe starts to move on to their next destination with you in tow, the leader turns to you. "<i>You might just find becoming a slave is better than you think. Why else would you keep returning to us and joining our Feast if you didn\'t crave more of what we had to offer?</i>"\n\n', false );
		MainView.outputText( 'Flushing red in embarrassment at his words, you reluctantly follow after the leader and the rest of the tribe in obedience. You mull over what the leader had just said in your mind, and can\'t help but wonder what your future would be like if you remained with them.', false );
		EngineCore.doNext( this, this.oasisBadEndEpilogue );
	};
	Oasis.prototype.oasisBadEndEpilogue = function() {
		MainView.spriteSelect( 46 );
		MainView.outputText( 'After one year', true );
		if( CoC.player.gender <= 1 ) {
			MainView.outputText( ' and a few doses of fermented succubi milk', false );
		}
		MainView.outputText( '...\n\n', false );
		MainView.outputText( 'A year has gone by since the day you became a slave. You find yourself sitting at the feet of your master wearing nothing but a black collar around your neck. Your belly extends out in front of you, filled to the brim with your master\'s baby. You smile, happy to be here to please your master and carry his young as memories of your past and your mission fade deep into the depths of your mind. Your only mission in life now is to service your master and the other members of the tribe in whatever they ask, without question or hesitation. As the tribe prepares for the next \'Feast\', a commotion at the other side of the encampment catches your attention. The guards bring forth a human captive they found wandering in the oasis, and you smile dimly as you watch master invite the stranger to join them all in the Feast...', false );
		EngineCore.gameOver();
	};
	SceneLib.registerScene( 'oasis', new Oasis() );
} );