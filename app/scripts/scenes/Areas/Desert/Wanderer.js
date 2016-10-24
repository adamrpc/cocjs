'use strict';

angular.module( 'cocjs' ).run( function( CoC, Utils, StatusAffects, EngineCore, ConsumableLib ) {
	function Wanderer() {
	}

	Wanderer.prototype.wandererRouter = function() {
		EngineCore.spriteSelect( 42 );
		//First meeting...
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.MeetWanderer ) < 0 ) {
			this.wandererFirstMeeting();
			CoC.getInstance().player.createStatusAffect( StatusAffects.MeetWanderer, 0, 0, 0, 0 );
		}
		//Repeat offense!
		else {
			//Chosen demon ending
			if( CoC.getInstance().player.findStatusAffect( StatusAffects.WandererDemon ) >= 0 ) {
				this.wandererDemonEpilogue();
				return;
			}
			//Chosen human ending
			if( CoC.getInstance().player.findStatusAffect( StatusAffects.WandererHuman ) >= 0 ) {
				this.wandererEpilogueHuman();
				return;
			}
			//No choose made repeat meeting
			this.wandererRepeatMeeting();
		}
	};
	//Encounter the wanderer for the first time
	Wanderer.prototype.wandererFirstMeeting = function() {
		//Each outputtext is a paragraph
		EngineCore.outputText( 'A small plume of dust rises in the distance, betraying the position of something else moving amongst the sandy dunes.   It grows larger as it approaches your position, revealing a bulky distorted shape lurking inside the cloud.  You cautiously approach, preparing to face some new demonic monstrosity.   As the sandy cloud parts, the blurred figure resolves itself into two distinct outlines.\n\n', true );
		EngineCore.outputText( 'On the left is a man carrying a heavily loaded wheelbarrow and struggling not to stumble in the sandy desert soil.  Slightly behind and to the right of the man is a shapely woman, her demonic origins plain to anyone who notices the spikes on her head.  As they near the man notices your presence and calls out, "<i>Ho, traveler!  Fine day isn\'t it?</i>"\n\n', false );
		EngineCore.outputText( 'The strange pair close the intervening distance, allowing you to make out more of their forms.  As expected, the succubus is quite a beauty, with curvy flesh in all the right places.  The man introduces himself as he struggles with his heavy load.  "<i>I am Marcus,  former traveler of extraordinary places and seeker of forbidden knowledge!  Though all that was a long time ago; I\'m retired, you see.  I\'ve settled down with my new partner, Lucia.</i>"  Marcus gestures, indicating the bored-looking succubus accompanying him.\n\n', false );
		EngineCore.outputText( 'You start to greet them, but nearly faint in shock – Marcus\' wheelbarrow isn\'t full of cargo.  It\'s the only thing keeping his oversized balls from dragging in the sand!  He smiles at your reaction and winks lewdly, "<i>Why do you think I have to keep a succubus around?  If I don\'t empty these puppies every hour or two I damn near explode!</i>"  Looking thoughtful for a moment, Marcus nods to himself and asks, "<i>I don\'t suppose you have a moment to help me with a quandary I\'ve been having?</i>"', false );
		EngineCore.choices( 'Help Him', this.wandererHelpHim, '', null, '', null, '', null, 'Leave', this.wandererLeave );
	};
	//Leave
	Wanderer.prototype.wandererLeave = function() {
		EngineCore.spriteSelect( 42 );
		EngineCore.outputText( 'Marcus looks disappointed and sighs, hefting his wheelbarrow and waddling away.  Lucia bounces after him, looking like the cat that got the cream.  You wonder what all that was about.   What a strange land.', true );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	//Repeated encounter if he left
	Wanderer.prototype.wandererRepeatMeeting = function() {
		EngineCore.spriteSelect( 42 );
		EngineCore.outputText( 'Marcus waves to you as he crests a nearby dune, yelling a greeting.  "<i>Hey traveler!  Do you have a moment to help a man with a question of theological and moral imperatives?</i>"\n\nHis succubus accomplice, Lucia, snorts in disdain.', true );
		EngineCore.choices( 'Yes', this.wandererHelpHim, '', null, '', null, '', null, 'Leave', this.wandererLeave );
	};
	//Volunteer to help
	Wanderer.prototype.wandererHelpHim = function() {
		EngineCore.spriteSelect( 42 );
		EngineCore.outputText( '"<i>Oh good!</i>" he exclaims as he begins elaborating.  "<i>My dear succubus here is growing tired of our arrangement, and she wants me to give up the last of my humanity and become a demon like her.  I\'m not really sure I want to lose my soul, but at the same time, I know enough about their kind to know I\'d REALLY enjoy being an incubus, if you know what I mean.  Before I make the plunge, I\'d like a second opinion – what do you think?</i>"\n\nHe glances over his shoulder with almost a small measure of fear.', true );
		EngineCore.choices( 'Go Demon', this.wandererGoDemon, 'Stay Human', this.wandererStayHuman, '', null, '', null, '', null );
	};
	//Ask marcus to stay human
	Wanderer.prototype.wandererStayHuman = function() {
		EngineCore.spriteSelect( 42 );
		EngineCore.outputText( '"<i>You little mortal fuckwit!</i>" screams Lucia before turning to her human lover, "<i>Don\'t listen to the foolish mortal, love; think of the fun we could have together!</i>"\n\n', true );
		EngineCore.outputText( 'Marcus shakes his head sadly, "<i>', false );
		if( CoC.getInstance().player.gender <= 1 ) {
			EngineCore.outputText( 'He', false );
		} else {
			EngineCore.outputText( 'She', false );
		}
		EngineCore.outputText( ' is right, my soul is immortal and not to be sacrificed so lightly.  Why don\'t we stick to our original agreement another decade and mull it over then?</i>"\n\n', false );
		EngineCore.outputText( 'Lucia pouts, nearly on the verge of tears, "<i>Fine!  But don\'t expect me to be happy about it.</i>"  She pats his swollen balls roughly, smirking down at him, "<i>and I\'m going to let these swell up nice and tight before I take my next meal!</i>"  ', false );
		EngineCore.outputText( 'Marcus sighs, though you think you spy the hint of a smile on his lips, "<i>As you wish... thanks for your guidance traveler, and may you find what you seek in this strange land.</i>"\n\nAs they turn to leave, Lucia scowls at you over her shoulder...', false );
		EngineCore.dynStats( 'lib', -1, 'lus', 1, 'cor', -5 );
		CoC.getInstance().player.createStatusAffect( StatusAffects.WandererHuman, 0, 0, 0, 0 );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	//Ask marcus to go demon
	Wanderer.prototype.wandererGoDemon = function() {
		EngineCore.spriteSelect( 42 );
		EngineCore.outputText( 'Lucia breaks into a mischievious smile as you suggest taking her up on her offer.  She sashays over to you, flesh jiggling enticingly the whole way.  She leans close, sliding a slender finger down the center of your chest.  "<i>Thank you for this.  Should we meet again, I promise rewards fit to make a whore faint.</i>"\n\n', true );
		EngineCore.outputText( 'Marcus raises an eyebrow at the exchange, but smiles as his demonic lover returns to his side.  Lucia winks again, and huge wings explode from her back.  She grabs Marcus, who bleats in surprise, and lifts off, flying away with her prize to her lair.', false );
		EngineCore.dynStats( 'lus', 5, 'cor', 1 );
		CoC.getInstance().player.createStatusAffect( StatusAffects.WandererDemon, 0, 0, 0, 0 );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	//Demonic epilogue v1
	Wanderer.prototype.wandererDemonEpilogue = function() {
		EngineCore.spriteSelect( 42 );
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.WandererDemon ) >= 0 ) {
			//First time...
			if( CoC.getInstance().player.statusAffectv1( StatusAffects.WandererDemon ) === 0 ) {
				EngineCore.outputText( 'A winged shadow flashes by.  You look up, but can\'t find its source in the searing desert sun.   A tap on your shoulder is all the warning you get before a curvy body is pressed against you, stroking and touching you in all the right ways.\n\n', true );
				EngineCore.outputText( '"<i>I stopped by and I wanted to thank you for this,</i>" Lucia purrs, balancing a purple crystal along her knuckles.  It sparkles and glitters with a light in the sunlight as she speaks, "<i>You see, when a human or other mortal creature finally begins to desire corruption and pleasure more than everything else, they can become a demon.  The process leaves behind a single crystal of lethicite – this crystal.  It\'s a power source beyond anything you can comprehend, and I have you to thank for giving it to me.</i>"\n\n', false );
				EngineCore.outputText( 'Lucia places a small bottle in your hand.  "<i>So thank you, and have this present.  Perhaps you can create some lethicite for us later... oh, and before I forget, Marcus is loving his new existence.</i>"\n\n', false );
				EngineCore.outputText( 'She steps away and blows a kiss as her wings unfurl.  With a powerful downstroke she scatters sand everywhere, forcing you to throw an arm in front of your eyes.  When the debris settles, she\'s gone.\n\n', false );
				EngineCore.dynStats( 'lus', 5 );
				CoC.getInstance().inventory.takeItem( ConsumableLib.SDELITE, CoC.getInstance().scenes.camp.returnToCampUseOneHour );
				CoC.getInstance().player.statusAffect( CoC.getInstance().player.findStatusAffect( StatusAffects.WandererDemon ) ).value1 = 1;
			}
			//Second Encounter
			else if( CoC.getInstance().player.statusAffectv1( StatusAffects.WandererDemon ) === 1 ) {
				EngineCore.outputText( 'Lucia zips by overhead, spreading her legs and openly frigging her moist hairless slit and moaning lustily.  After a few moments she creams herself, dripping her juices over the dunes.  She licks her fingers and waves, unclipping an item from her belt and dropping it down towards you.\n\n', true );
				//Catch it
				if( 50 < (CoC.getInstance().player.spe + Utils.rand( 60 )) ) {
					EngineCore.outputText( 'You handily catch a small potion vial.  When you look up, she\'s gone.\n\n', false );
					CoC.getInstance().inventory.takeItem( ConsumableLib.SDELITE, CoC.getInstance().scenes.camp.returnToCampUseOneHour );
				}
				//Drop it
				else {
					EngineCore.outputText( 'You dive for the falling bottle, but miss, and it shatters into the sands, the fluids wicking away nearly instantaneously.', false );
					EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
				}
			}
		}
	};
	//Human Epilogue 1
	Wanderer.prototype.wandererEpilogueHuman = function() {
		EngineCore.spriteSelect( 42 );
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.WandererHuman ) >= 0 ) {
			//Human Epilogue 1
			if( CoC.getInstance().player.statusAffectv1( StatusAffects.WandererHuman ) === 0 ) {
				EngineCore.outputText( 'As you journey the desert, you see the twin figures of Marcus and his demonic companion, Lucia, in the distance.   Judging by the frantic bobbing of Lucia\'s head in Marcus\'s lap, she\'s just getting ready for a meal.  Closing the distance, you watch curiously as her throat bulges obscenely to keep up with the huge cum-load.  In time she flops back, a few huge globules of cum exploding onto her form like bursting water-balloons as Marcus\' orgasm finishes, leaving her a cum-stained wreck.\n\n', true );
				if( CoC.getInstance().player.cor < 33 ) {
					EngineCore.outputText( 'You duck back behind a dune, blushing furiously.', false );
				} else if( CoC.getInstance().player.cor < 66 ) {
					EngineCore.outputText( 'You blush crimson as you swear you see Lucia look right at you and wink.', false );
				} else {
					EngineCore.outputText( 'You openly leer at the crude display, whistling lewdly at the blissful couple.  Marcus looks up and gives a cocky smile, while Lucia licks her lips and gives you a predatory grin.', false );
				}
				EngineCore.dynStats( 'lus', 10 );
				//Value 1 is used to track the status of the end state.
				CoC.getInstance().player.statusAffect( CoC.getInstance().player.findStatusAffect( StatusAffects.WandererHuman ) ).value1 = 1;
				EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
			}
			//Human Epilogue 2
			else if( CoC.getInstance().player.statusAffectv1( StatusAffects.WandererHuman ) === 1 ) {
				EngineCore.outputText( 'While exploring the desert, you find a strange bottle half-buried in the sand.  A small note is tied to it just knew you\'d find this.  Try this a few times and I think you might change your mind about Marcus\' situation.\n  -Lovely Lucia</i>"\n\n', true );
				CoC.getInstance().inventory.takeItem( ConsumableLib.SDELITE, CoC.getInstance().scenes.camp.returnToCampUseOneHour );
			}
		}
	};
	CoC.getInstance().registerScene( 'wanderer', new Wanderer() );
} );