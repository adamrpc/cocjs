'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, $rootScope, $log, CockTypesEnum, ConsumableLib, AppearanceDefs, Appearance, EventParser, PregnancyStore, Utils, ImageManager, StatusAffects, kFLAGS, Descriptors, CoC, EngineCore ) {
	function Edryn() {
		this.pregnancy = new PregnancyStore( kFLAGS.EDRYN_PREGNANCY_TYPE, kFLAGS.EDRYN_PREGNANCY_INCUBATION, 0, 0 );
		this.edrynHeliaLastThreesomeCheck = 0;
		$rootScope.$on( 'time-change', this.timeChange );
		$rootScope.$on( 'time-change-large', this.timeChangeLarge );
	}

	//Implementation of TimeAwareInterface;
	Edryn.prototype.timeChange = function() {
		this.pregnancy.pregnancyAdvance();
		$log.debug( '\nEdryn time change: Time is ' + CoC.getInstance().time.hours + ', incubation: ' + this.pregnancy.incubation + ', event: ' + this.pregnancy.event );
		if( this.pregnancy.isPregnant && CoC.getInstance().flags[ kFLAGS.EDRYN_PREGNANT_AND_NOT_TOLD_PC_YET ] === 0 && this.pregnancy.type !== PregnancyStore.PREGNANCY_TAOTH ) {
			CoC.getInstance().flags[ kFLAGS.EDRYN_PREGNANCY_INCUBATION ]++; //Pregnancy on hold until the PC discovers it
		}
		return false;
	};
	Edryn.prototype.timeChangeLarge = function() {
		if( this.pregnancy.isPregnant && this.pregnancy.incubation === 0 ) {
			if( this.pregnancy.type === PregnancyStore.PREGNANCY_TAOTH ) {
				SceneLib.urtaQuest.urtaAndEdrynGodChildEpilogue();
				//Since these flag can't be in use prior to Taoth's arrival I abused them to store Edryn's previous pregnancy type and incubation;
				//Did it so that if Edryn is someday made able to carry someone else's baby this will still work properly;
				this.pregnancy.knockUpForce( CoC.getInstance().flags[ kFLAGS.URTA_FERTILE ], CoC.getInstance().flags[ kFLAGS.URTA_PREG_EVERYBODY ] );
				CoC.getInstance().flags[ kFLAGS.URTA_FERTILE ] = 0;
				CoC.getInstance().flags[ kFLAGS.URTA_PREG_EVERYBODY ] = 0;
				return true;
			} else if( this.pregnancy.type === PregnancyStore.PREGNANCY_PLAYER ) {
				CoC.getInstance().flags[ kFLAGS.EDRYN_NUMBER_OF_KIDS ]++; //Add one kid
				CoC.getInstance().flags[ kFLAGS.EDRYN_NEEDS_TO_TALK_ABOUT_KID ] = 1; //Set 'needs to talk to edryn about da kid
				this.pregnancy.knockUpForce(); //Clear Pregnancy
			}
		}
		return false;
	};
	//End of Interface Implementation;
	Edryn.prototype.edrynBarTalk = function() {
		EngineCore.spriteSelect( 14 );
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.Edryn ) < 0 ) {
			CoC.getInstance().player.createStatusAffect( StatusAffects.Edryn, 0, 0, 0, 0 );
		}
		EngineCore.outputText( '', true );
		EngineCore.outputText( ImageManager.showImage( 'edryn-bar-chat' ) );
		//Used for finding what cock to use!;
		var x = CoC.getInstance().player.cockThatFits( 300 );
		//If no cocks fit, set to primary;
		if( x < 0 ) {
			x = 0;
		}

		if( SceneLib.katherineEmployment.canTalkToEdryn() ) { //Katherine training discussion
			SceneLib.katherineEmployment.talkToEdryn();
			return;
		}
		//Talk about latest birth;
		if( CoC.getInstance().flags[ kFLAGS.EDRYN_NEEDS_TO_TALK_ABOUT_KID ] === 1 ) {
			var kidGender = Utils.rand( 2 );
			if( Utils.rand( 10 ) < 2 ) {
				kidGender = 3;
			}
			EngineCore.outputText( 'Edryn cracks into a beautiful smile and gushes, "<i>We had a ', false );
			if( kidGender === 0 ) {
				EngineCore.outputText( 'son', false );
			} else if( kidGender === 1 ) {
				EngineCore.outputText( 'daughter', false );
			} else {
				EngineCore.outputText( 'herm', false );
			}
			EngineCore.outputText( '!  You weren\'t in town, but the birth was easy, so don\'t worry about it.  Labor only lasted like, an hour tops.  You should\'ve seen your ', false );
			if( kidGender === 0 ) {
				EngineCore.outputText( 'son', false );
			} else {
				EngineCore.outputText( 'daughter', false );
			}
			EngineCore.outputText( ' trying to stand up for the first time.  It was incredible!  ', false );
			if( CoC.getInstance().flags[ kFLAGS.EDRYN_NUMBER_OF_KIDS ] === 1 ) {
				EngineCore.outputText( 'I\'m going to have to spend less time around here so I can raise ', false );
				if( kidGender === 0 ) {
					EngineCore.outputText( 'him', false );
				} else {
					EngineCore.outputText( 'her', false );
				}
				EngineCore.outputText( ' right, but I\'d be more than happy to \'help\' you with your needs if you can catch me during a free moment.', false );
			} else {
				EngineCore.outputText( 'I can\'t believe we\'ve had ' + Utils.num2Text( CoC.getInstance().flags[ kFLAGS.EDRYN_NUMBER_OF_KIDS ] ) + ' kids together!  You better come see me later on - ', false );
				if( CoC.getInstance().flags[ kFLAGS.EDRYN_NUMBER_OF_KIDS ] < 3 ) {
					EngineCore.outputText( 'I miss the way you fill me', false );
				} else {
					EngineCore.outputText( 'I want you to make me pregnant again', false );
				}
			}
			EngineCore.outputText( '.</i>"\n\n', false );
			EngineCore.outputText( 'You stay with her and chat, learning more about your newborn child and otherwise having a pleasant time with your quadruped lover.', false );
			EventParser.cheatTime( 1 );
			CoC.getInstance().flags[ kFLAGS.EDRYN_NEEDS_TO_TALK_ABOUT_KID ] = 0;
			EngineCore.doNext( SceneLib.telAdre.barTelAdre );
			return;
		}
		//Mid-this.pregnancy talk;
		else if( this.pregnancy.isPregnant ) {
			EngineCore.outputText( 'Edryn smiles pleasantly as you approach, ', false );
			EngineCore.outputText( 'offering you a spot at the table across from her.  She pushes aside the piled-up dishes and shifts uncomfortably on her pregnant bulk.  You smile at her and enjoy a light chat for a while, until Edryn runs out of food.  She excuses herself, and rises to go to the restroom.\n\n', false );
			//Edryn pregnant offer;
			EngineCore.doNext( this.pregdrynOffer );
			return;
		}
		//Post kids talk;
		else if( CoC.getInstance().flags[ kFLAGS.EDRYN_NUMBER_OF_KIDS ] > 0 ) {
			EngineCore.outputText( 'Edryn gestures for you to take a seat, and motions for a waitress to bring you a drink.  You sit with the busty centaur and chat her up for a little bit, recounting your latest adventures and sexual exploits.  She laughs at some, blushes at others, and comforts you at times, but by the time you\'ve finished her child-birth-enlarged nipples are like two hard bullets under her tunic and her face is flushed.  Edryn picks at her food for a moment and excuses herself, "<i>Sorry dear, but I\'m feeling a little flushed.  I\'m going to head back to my room and lie down a while...</i>"\n\n', false );
			//(NO WANGUUU);
			if( CoC.getInstance().player.totalCocks() === 0 ) {
				EngineCore.outputText( 'She looks down, eyes fixing on your crotch for a moment before she sighs, "<i>Why did you get rid of your dick?  I like you a lot, but I don\'t really want to have sex with you like you are now.</i>"\n\nIt looks like you won\'t get to have any fun with her right now.', false );
				EventParser.cheatTime( 1 );
				EngineCore.doNext( SceneLib.telAdre.barTelAdre );
				return;
			}
			//(WANG FITS);
			if( CoC.getInstance().player.cockArea( x ) < 300 && CoC.getInstance().player.cockArea( x ) > 24 ) {
				EngineCore.outputText( 'She winks at you as she gets up and trots off, giving her butt a sensual sway to draw your eyes.  Her potent scent hangs in the air, and your body reacts immediately and intensely, flooding you with arousal.  ', false );
				EngineCore.outputText( 'You look down at your ' + Descriptors.multiCockDescriptLight() + ' and curse, irritated at how easily she can affect you.  There\'s no way you\'ll be turning her down this time.  You get up and follow her back to her room, intent on taking care of the need between your legs.\n\n', false );
				//Sex;
				EngineCore.doNext( this.pregdrynOffer );
				return;
			}
			//(Too small);
			else if( CoC.getInstance().player.cockArea( x ) <= 24 ) {
				EngineCore.outputText( 'She looks down, eyes fixating on your crotch for a moment.  Edryn asks, "<i>When did you get so small?  We can\'t fuck like this!  ', false );
				//(Chance of equinum,gro+(twice only),minotaur blood, or purified incubus draft);
				var itype;
				if( CoC.getInstance().flags[ kFLAGS.EDRYN_GIFT_COUNTER ] < 2 ) {
					EngineCore.outputText( 'Here, take some of this stuff.  We confiscated it off one of the miscreants we kicked out the other day, and I KNOW it\'ll get you to be big enough for me.  Just don\'t go too nuts with it, okay?</i>"\n\n', false );
					itype = ConsumableLib.GROPLUS;
					CoC.getInstance().flags[ kFLAGS.EDRYN_GIFT_COUNTER ]++;
				} else if( CoC.getInstance().flags[ kFLAGS.EDRYN_GIFT_COUNTER ] < 5 ) {
					EngineCore.outputText( 'Here, take some of this stuff.  We confiscated it off one of the miscreants we kicked out the other day, and I KNOW it\'ll get you to be big enough for me.  Just don\'t go too nuts with it, okay?</i>"\n\n', false );
					CoC.getInstance().flags[ kFLAGS.EDRYN_GIFT_COUNTER ]++;
					if( Utils.rand( 2 ) === 0 ) {
						itype = ConsumableLib.MINOBLO;
					} else {
						itype = ConsumableLib.INCUBID;
					}
				} else {
					EngineCore.outputText( 'I\'d love to help you, but I don\'t have any supplies for you.  I\'m sure you\'ll find a way.</i>"\n\n', false );
					EventParser.cheatTime( 1 );
					EngineCore.doNext( SceneLib.telAdre.barTelAdre );
					return;
				}
				SceneLib.inventory.takeItem( itype, SceneLib.camp.returnToCampUseOneHour );
				return;
			}
			//(Too big);
			else {
				EngineCore.outputText( 'She looks down and gasps, "<i>Holy shit!  Why do you have a monster like that!?  When a centaur is shocked by how big you are it\'s time to go easy on the dick enlargement pills, dear.</i>"\n\n', false );
				if( CoC.getInstance().flags[ kFLAGS.EDRYN_GIFT_COUNTER ] < 2 ) {
					EngineCore.outputText( 'Her eyes light up and she suggests, "<i>Take some of this; it ought to take down some of that swelling.</i>"\n\n', false );
					CoC.getInstance().flags[ kFLAGS.EDRYN_GIFT_COUNTER ]++;
					SceneLib.inventory.takeItem( ConsumableLib.REDUCTO, SceneLib.camp.returnToCampUseOneHour );
					return;
				}
				//(ALT);
				else {
					EngineCore.outputText( 'She says, "<i>You should find some Reducto or something to shrink that down.  I haven\'t come across any more so you\'ll have to get it yourself.</i>"\n\n', false );
					EventParser.cheatTime( 1 );
					EngineCore.doNext( SceneLib.telAdre.barTelAdre );
					return;
				}
			}
		}
		EngineCore.outputText( 'Edryn smiles pleasantly as you approach, ', false );
		if( CoC.getInstance().player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
			EngineCore.outputText( 'offering you a spot at the table across from her.  You realize your companion isn\'t on any kind of seat at all, and is instead \'sitting\' on her lower half.  You do the same, settling down across from her, thankful this bar was made to accommodate centaurs.', false );
		} else {
			EngineCore.outputText( 'gesturing to a nearby stool.  You grab the seat and realize that your centaur companion isn\'t sitting still at all, but is instead \'sitting\' on her lower half, which currently lies on the floor.', false );
		}
		EngineCore.outputText( '  Despite the oddity of the situation, you stay and enjoy a light conversation with her.  You find the conversation to be interesting, and the pair of you stay there to munch on a light meal of breads, cheeses, and a glass of wine.  While you find the time pleasant, you have a feeling that something is \'off\'.\n\n', false );
		//New PG;
		EngineCore.outputText( 'You take a close look at your dinner companion, trying to puzzle out what you\'re picking up on, but you just can\'t place it.  Edryn burps quietly, apologizing for her rudeness, and excuses herself to the girl\'s room.  As she turns away to leave, you get a good look at her backside.  Her horse-like sex is huge and puffy, and glistening with moisture.  The gentle flicking of her tail from side to side pushes her musky scent into you like a wave, ', false );
		if( CoC.getInstance().player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR && CoC.getInstance().player.totalCocks() > 0 ) {
			EngineCore.outputText( 'and the potent female scent works its way into your blood, making you dizzy as your ' + Descriptors.cockDescript( 0 ) + ' ', false );
			if( CoC.getInstance().player.cocks[ 0 ].cockType === CockTypesEnum.HORSE ) {
				EngineCore.outputText( 'pours out of its sheath', false );
			} else {
				EngineCore.outputText( 'fills near instantaneously', false );
			}
			EngineCore.outputText( ', now rock-hard.  You breathe deeply, your mind subsumed in a sea of equine instincts.  The hard floor squeezes your ' + Descriptors.cockDescript( 0 ) + ' painfully underneath you, forcing you to rise up onto your hooves.  You can feel more than a few curious gazes sliding along your now fully exposed maleness, and it twitches as if it were happy for the attention.\n\n', false );
			EngineCore.outputText( 'Swaying back and forth, alternatively snorting and breathing deeply of the female\'s scent, your gaze immediately locks onto the returning mare.  Your ' + Descriptors.cockDescript( 0 ) + ' jumps and bounces underneath you, painfully hard and swollen.  A thick dollop of pre beads on your ' + CoC.getInstance().player.cockHead() + ', as if the bar needed your display to be any more overtly sexual.  Edryn looks you over, walking alongside you she talks, "<i>My my, someone liked what they saw.  Or was it smelled?  I can never tell what it is that gets you ' + CoC.getInstance().player.mf( 'studs', 'hotties' ) + ' so worked up about me.</i>"\n\n', false );
			EngineCore.outputText( 'A soft hand slides under your belly, hefting your ' + Descriptors.cockDescript( 0 ) + ' and smearing the bead of pre over it with long slick strokes.  She coos, "<i>', false );
			EngineCore.dynStats( 'lus', 70 );
			this.edrynOffer();
			return;
		} else if( CoC.getInstance().player.totalCocks() > 0 ) {
			if( CoC.getInstance().player.horseCocks() > 0 ) {
				EngineCore.outputText( 'and the potent female scent makes you feel a bit dizzy and dazed.  ', false );
				if( CoC.getInstance().player.cocks[ 0 ].cockLength > 16 ) {
					EngineCore.outputText( 'You barely register the thump of your hardening ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' as it smacks into the underside of the table.\n\n', false );
				} else {
					EngineCore.outputText( 'You squirm uncomfortably, feeling constrained by your ' + CoC.getInstance().player.armorName + ' as you surge to erectness.\n\n', false );
				}
				EngineCore.outputText( 'Swaying back and forth in a scent induced haze, you fail to notice Edryn\'s return.  She coughs noisily, drawing you back to the real world and pushing away the memory of her glistening snatch.  You start to fumble for words until you realize she\'s smiling knowingly at you.  Unexpectedly, caresses slide against your groin, hefting and measuring you through your ' + CoC.getInstance().player.armorName + '.\n\n', false );
				EngineCore.dynStats( 'lus', 60 );
				this.edrynOffer();
				return;
			}
			//Non horsedick;
			else {
				EngineCore.outputText( 'but the potent musky scent only reminds you of how different things are here.', false );
				if( CoC.getInstance().player.cor > 50 || CoC.getInstance().player.statusAffectv1( StatusAffects.Edryn ) > 0 || CoC.getInstance().flags[ kFLAGS.LOW_STANDARDS_FOR_ALL ] ) {
					EngineCore.outputText( '  Unbidden, your mind wonders what her juicy horse-snatch would feel like, and your ' + Descriptors.cockDescript( 0 ) + ' responds immediately, thickening with readiness.  You squirm uncomfortably from how constricting your ' + CoC.getInstance().player.armorName + ' feels.\n\n', false );
					EngineCore.outputText( 'You give the rapidly dissipating scent a sniff and note that it isn\'t unpleasant, just strong, and once again you find yourself imagining standing ', false );
					if( CoC.getInstance().player.tallness < 60 ) {
						EngineCore.outputText( 'on a stool ', false );
					}
					EngineCore.outputText( 'behind her, fucking her like the beast-woman she is.  Lost in your thoughts, you fail to notice Edryn\'s return.  She coughs noisily, rousing you from the impromptu fantasy as she gives you a knowing smile.  An unexpected caress slides against you groin, rubbing and hefting you carefully.', false );
					if( CoC.getInstance().player.cocks[ 0 ].cockType === CockTypesEnum.TENTACLE ) {
						EngineCore.outputText( '  She smiles coyly when your ' + Descriptors.cockDescript( 0 ) + ' wriggles, wrapping around her arm.', false );
					}
					EngineCore.outputText( '\n\n', false );
					EngineCore.dynStats( 'lus', 40 );
					this.edrynOffer();
					return;
				} else {
					EngineCore.outputText( '\n\nYou wait until she returns, wishing for once that things could be normal.  Though the remaining conversation is pleasant, you have a hard time enjoying yourself, and eventually bid the pretty centaur farewell.', false );
					EventParser.cheatTime( 1 );
					EngineCore.doNext( SceneLib.telAdre.barTelAdre );
				}
			}
		}
		//Catch all;
		else {
			//Turned on chicks can hit on her;
			if( CoC.getInstance().player.hasVagina() && CoC.getInstance().player.lust > 70 ) {
				EngineCore.outputText( 'and as wet as you are right now, you find her scent to be intriguing.  Some part of you is curious what it would taste like.  When the centauress returns you compliment her on her shapely backside, but she only smiles politely and informs you that she "<i>doesn\'t swing for your team,</i>" whatever that means.  The rest of the conversation is quite pleasant, but all good things must come to an end.', false );
				EventParser.cheatTime( 1 );
				EngineCore.doNext( SceneLib.telAdre.barTelAdre );
			}
			//Everybody else is all 'BLEH';
			else {
				EngineCore.outputText( 'but the potent musky scent only reminds you of how different things are here.', false );
				EngineCore.outputText( '\n\nYou wait until she returns, wishing for once that things could be normal.  Though the remaining conversation is pleasant, you have a hard time enjoying yourself, and eventually bid the pretty centaur farewell.', false );
				EventParser.cheatTime( 1 );
				EngineCore.doNext( SceneLib.telAdre.barTelAdre );
			}
		}
	};
	Edryn.prototype.edrynOffer = function() {
		EngineCore.spriteSelect( 14 );
		var cost = 0;
		switch( CoC.getInstance().player.statusAffectv1( StatusAffects.Edryn ) ) {
			case 0:
				cost = 200;
				break;
			case 1:
				cost = 100;
				break;
			case 2:
				cost = 50;
				break;
			case 3:
				cost = 25;
				break;
			case 4:
				cost = 0;
				break;
			default:
				cost = 0;
				break;
		}
		//Pick most appropriate cock;
		var x = CoC.getInstance().player.cockThatFits( 300 );
		//If no cocks fit, set to main.;
		if( x < 0 ) {
			x = 0;
		}

		//(cont centaur);
		if( CoC.getInstance().player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR && CoC.getInstance().player.totalCocks() > 0 ) {
			//Too small;
			if( CoC.getInstance().player.cockArea( x ) < 24 ) {
				EngineCore.outputText( 'Oh my, you\'re a little bit small for my tastes love.  Maybe you should try some of the local delicacies and trot back here so I can help you out, ok?</i>"\n\n', false );
				EngineCore.outputText( 'You\'re a bit disappointed with the outcome. It doesn\'t look like you\'ll be getting any centaur tail tonight.', false );
				EventParser.cheatTime( 1 );
				EngineCore.doNext( SceneLib.telAdre.barTelAdre );
				return;
			}
			//Too big;
			if( CoC.getInstance().player.cockArea( x ) > 300 ) {
				EngineCore.outputText( 'Oh wow, you\'re a little bit too big for me to handle, love.  Maybe you should try to find something to shrink that down a little, not too much, and trot back here so I can help you out, ok?</i>"\n\n', false );
				EngineCore.outputText( 'You\'re a bit disappointed with the outcome. It doesn\'t look like you\'ll be getting any centaur tail tonight.', false );
				EventParser.cheatTime( 1 );
				EngineCore.doNext( SceneLib.telAdre.barTelAdre );
				return;
			}
			//Big enough;
			EngineCore.outputText( 'Oh my, you\'re hot to trot aren\'t you?  I can feel just how tight and full it is, practically ready to explode. Well I\'ve got good news for you ' + CoC.getInstance().player.mf( 'stud', 'Miss Hot-And-Bulgy' ) + ', I\'m the best kind of mercenary – one that does ANYTHING for money, even satisfying horny equine ' + CoC.getInstance().player.mf( 'studs', 'breeders' ) + '.</i>"\n\n', false );
			EngineCore.outputText( 'You groan, more turned on than ever by being fondled openly in public.  The centaur whore winks at you and offers, "<i>So what do you say, is a roll in the hay with me worth ', false );
			if( cost > 0 ) {
				EngineCore.outputText( Utils.num2Text( cost ) + ' gems?', false );
			} else {
				EngineCore.outputText( 'an hour of your time?', false );
			}
			EngineCore.outputText( '</i>"\n\n', false );
			EngineCore.outputText( 'She releases your ' + Descriptors.cockDescript( x ) + ' and looks expectantly at you.  Your body is ready to do anything for a chance to breed her.  What will you do?\n\n', false );
			if( cost > 0 ) {
				EngineCore.outputText( '(Do you pay ' + Utils.num2Text( cost ) + ' gems to fuck her?)', false );
			} else {
				EngineCore.outputText( '(Do you fuck her?)', false );
			}
			EngineCore.doYesNo( this.edrynSexSelecter, SceneLib.telAdre.barTelAdre );
		} else if( CoC.getInstance().player.cockTotal() > 0 ) {
			//(HORSE CONT);
			if( CoC.getInstance().player.horseCocks() > 0 ) {
				//Too bigsies;
				if( CoC.getInstance().player.cockArea( x ) > 300 ) {
					EngineCore.outputText( '"<i>Wow, that\'s huge!  Sweetheart, you\'ll need to be a bit smaller if you want to play with me.  Why not go out and find something to shrink it down to something a horse like me can handle, then maybe we can play, ok?</i>"\n\n', false );
					EngineCore.outputText( 'You\'re a bit disappointed with the outcome. It doesn\'t look like you\'ll be getting any centaur tail tonight.', false );
					EventParser.cheatTime( 1 );
					EngineCore.doNext( SceneLib.telAdre.barTelAdre );
					return;
				}
				if( CoC.getInstance().player.cockArea( x ) >= 24 ) {
					EngineCore.outputText( '"<i>Mmmhmm, just as I thought.  You were daydreaming about my cunt, weren\'t you?</i>" she asks.  Instinctively, you try to shake your head negatively, but she doesn\'t seem fooled.  Edryn releases your crotch and scolds you, "<i>Don\'t lie, you got a whiff of my juicy cunt and all your reserve and fortitude melted into a puddle of fuck and breed.  Believe me, I\'ve seen it happen before.</i>"\n\n', false );
					EngineCore.outputText( 'She doesn\'t seem irritated, instead she seems quite... turned on.  Edryn explains, "<i>' + CoC.getInstance().player.mf( 'Mr.', 'Miss' ) + ' thick and juicy, I\'m more than muscle for hire.  I do a little \'wetwork\' on the side, and I\'ve yet to meet a horse-cock that doesn\'t jump at my scent.  Lucky for you, I think you\'re cute, and I\'m feeling randy.  So, how about ', false );
					if( cost > 0 ) {
						EngineCore.outputText( Utils.num2Text( cost ) + ' gems, ', false );
					} else {
						EngineCore.outputText( 'an hour of your time, ', false );
					}
					EngineCore.outputText( 'and I\'ll let you get nice and personal with my juicy snatch?</i>"\n\n', false );
					EngineCore.outputText( 'She stands up, and the scent returns, making your ', false );
					if( CoC.getInstance().player.balls > 0 ) {
						EngineCore.outputText( 'balls tight and your ', false );
					}
					EngineCore.outputText( Descriptors.cockDescript( x ) + ' twitch.  Will you accept her proposition and give her what she wants?\n\n', false );
					if( cost > 0 ) {
						EngineCore.outputText( '(Do you pay ' + Utils.num2Text( cost ) + ' gems to fuck her?)', false );
					} else {
						EngineCore.outputText( '(Do you fuck her?)', false );
					}
					EngineCore.doYesNo( this.edrynSexSelecter, SceneLib.telAdre.barTelAdre );
				}
				//(HORSE TOO SMALL);
				else {
					EngineCore.outputText( '"<i>Ouch, is that all?  Sweetheart, you\'ll need to be a bit bigger if you want to play with me.  Why not go out and try some of the local delicacies, then maybe we can play, ok?</i>"\n\n', false );
					EngineCore.outputText( 'You\'re a bit disappointed with the outcome. It doesn\'t look like you\'ll be getting any centaur tail tonight.', false );
					EventParser.cheatTime( 1 );
					EngineCore.doNext( SceneLib.telAdre.barTelAdre );
					return;
				}
			}
			//Normal Wingdangdoodle;
			else {
				//Too bigsies;
				if( CoC.getInstance().player.cockArea( x ) > 300 ) {
					EngineCore.outputText( '"<i>Wow, that\'s huge!  Sweetheart, you\'ll need to be a bit smaller if you want to play with me.  Why not go out and find something to shrink it down to something a horse like me can handle, then maybe we can play, ok?</i>"\n\n', false );
					EngineCore.outputText( 'You\'re a bit disappointed with the outcome. It doesn\'t look like you\'ll be getting any centaur tail tonight.', false );
					EventParser.cheatTime( 1 );
					EngineCore.doNext( SceneLib.telAdre.barTelAdre );
					return;
				}
				//(cont Normal);
				if( CoC.getInstance().player.cockArea( x ) >= 24 ) {
					EngineCore.outputText( '"<i>Was the sight of my backside that entrancing to you?</i>" she teases, "<i>Normally only the horsey-boys get this hard for me, but you... you want to take a ride on the wild side, don\'t you?</i>"\n\n', false );
					EngineCore.outputText( 'Her words ring true, and a quick fuck to tamp down your rising lust wouldn\'t hurt would it?\n\n', false );
					EngineCore.outputText( 'Edryn keeps talking, "<i>I do ALL kinds of mercenary work, even the sloppy wet kind, and lucky for you, I\'m more than wet enough to let you satisfy your ' + Descriptors.cockDescript( 0 ) + ' in me.  ', false );
					if( cost > 0 ) {
						EngineCore.outputText( Utils.Num2Text( cost ) + ' gems ', false );
					} else {
						EngineCore.outputText( 'An hour of your time ', false );
					}
					EngineCore.outputText( 'gets you the ride of a lifetime.  So what do you say ' + CoC.getInstance().player.short + '?  Do you want to be my sex-toy?</i>"\n\n', false );
					EngineCore.outputText( 'She stands up and turns, exposing her exotic hind-end to you.  A drop of fluid slips from her folds and splatters under the table, reminding you just how wet this trick would be.  Do you really want to do her?', false );
					if( cost > 0 ) {
						EngineCore.outputText( '\n\n(Do you pay ' + Utils.num2Text( cost ) + ' gems to fuck her?)', false );
					}
					EngineCore.doYesNo( this.edrynSexSelecter, SceneLib.telAdre.barTelAdre );
				}
				//(rejected);
				else {
					EngineCore.outputText( '"<i>Wow, that\'s it?  I\'m sorry but you\'ll have to be a bit bigger before you can play with me.  Why not try some of the local specialties and come back when you\'re a bit bigger?</i>"\n\n', false );
					EngineCore.outputText( 'You\'re a bit disappointed with the outcome. It doesn\'t look like you\'ll be getting any centaur tail tonight.', false );
					EventParser.cheatTime( 1 );
					EngineCore.doNext( SceneLib.telAdre.barTelAdre );
				}
			}
		}
	};
	Edryn.prototype.edrynSexSelecter = function() {
		EngineCore.spriteSelect( 14 );
		var cost = 0;
		switch( CoC.getInstance().player.statusAffectv1( StatusAffects.Edryn ) ) {
			case 0:
				cost = 200;
				break;
			case 1:
				cost = 100;
				break;
			case 2:
				cost = 50;
				break;
			case 3:
				cost = 25;
				break;
			case 4:
				cost = 0;
				break;
			default:
				cost = 0;
				break;
		}
		if( cost > CoC.getInstance().player.gems ) {
			EngineCore.outputText( 'You realize you can\'t afford to stay with the sexy centaur, and leave full of disappointment and arousal.', true );
			EventParser.cheatTime( 1 );
			EngineCore.doNext( SceneLib.telAdre.barTelAdre );
			return;
		}
		//Pay gems and update sidebar;
		CoC.getInstance().player.gems -= cost;
		EngineCore.statScreenRefresh();
		//Actually choose the sex scene;
		this.edrynFucktroduction();
		//Increment sex count;
		CoC.getInstance().player.addStatusValue( StatusAffects.Edryn, 1, 1 );
	};
	Edryn.prototype.fuckEdrynTaur = function() {
		EngineCore.spriteSelect( 14 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( ImageManager.showImage( 'edryn-fuck-as-taur' ) );
		var x = CoC.getInstance().player.cockThatFits( 300 );
		if( x < 0 ) {
			x = 0;
		}
		EngineCore.outputText( 'Your equine body lurches forwards on its own, rearing up on your hind legs and lunging forwards.  Edryn whinnies as she is violently penetrated and forced to support most of your weight.  Her equine pussy is a wonder, able to stretch to a degree that would shame the raunchiest of human and demon sluts.  The velvet walls of her massive equine cunny clench tightly around you, trapping you completely inside her juicy depths.  She wiggles slightly, bending her body, teasing your ' + Descriptors.cockDescript( x ) + ' inside her.\n\n', false );
		EngineCore.outputText( 'Edryn looks over her shoulder at you and winks as she relaxes her internal muscles.  Unprepared for the sudden release, you slide a few inches out of her before your hind-legs can steady you.  The centauress teases, "<i>Are you sure you can handle fucking this way?  Like a rutting beast?  You look like you\'re about to fall over.  Here, grab onto the rings hanging from the ceiling and steady yourself.  You\'ll need all the leverage you can get to satisfy a horny girl like me.</i>"\n\n', false );
		EngineCore.outputText( 'The rings aren\'t too high overhead, and you\'re able to stretch to reach them without much issue.  Grabbing them is easy, and the difference is immediate.  With more of your frontal weight being supported by your arms, controlling your body\'s motions should be much less difficult.  You heave backwards, sliding a bit further out, then thrust forwards with your hind legs, pulling hard with your arms to bury your ' + Descriptors.cockDescript( x ) + ' to the hilt with a wet smack.\n\n', false );
		EngineCore.outputText( 'Edryn moans lewdly, rocking against you as you pull back for another mighty thrust.  You begin pounding in earnest, grunting with the effort of heaving your animal-body into the centaur\'s oozing black-lipped sex.  You marvel at the strange texture and inhuman warmth it gives off, and your body builds up a fine sheen of sweat as do your best to breed the mare underneath you.  ', false );
		if( CoC.getInstance().player.cor < 75 ) {
			EngineCore.outputText( 'You recoil for a second, scolding yourself for the strange thoughts, but you don\'t slow down the fucking in the slightest.', false );
		} else {
			EngineCore.outputText( 'You smile, realizing you hadn\'t meant to think of her as a mare and you as her stud, but that\'s exactly what you are right now.  Your thrusts speed up as you renew your determination to fill this cunt full of fillies.', false );
		}

		EngineCore.outputText( '\n\nShe twists around to look you in the eye as you work her drooling horse-cunt over.  You can hear her copious fluids splattering the floor and feel them dripping down your hind legs as she moans, leaning back into you and planting a sloppy kiss on your lips.  One of her hands ', false );
		if( CoC.getInstance().player.biggestTitSize() <= 1 ) {
			EngineCore.outputText( 'strokes your chest', false );
		} else {
			EngineCore.outputText( 'caresses a breast', false );
		}
		EngineCore.outputText( ' while she caresses the side of your ' + CoC.getInstance().player.face() + ' with the other.  Your body pumps away while your tongues entwine, tracing saliva over each other\'s lips.  She pulls back and moans out again, trailing off into a whinny as she orgasms underneath you.\n\n', false );
		EngineCore.outputText( 'Her cunt locks tightly around you once again, clamping down in a series of rings from the base all the way to your ' + CoC.getInstance().player.cockHead( x ) + '.  At once, they start sliding from the base towards the tip, new ones forming along the bottom of the shaft as her pussy milks your ' + Descriptors.cockDescript( x ) + ' hard.  Trapped inside her, all you can do is groan and cum in response to her climax.  You throw back your head as you feel the warmth of your release building in your ', false );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( Descriptors.ballsDescriptLight(), false );
		} else {
			EngineCore.outputText( 'loins', false );
		}
		EngineCore.outputText( '.\n\n', false );
		EngineCore.outputText( 'The rippling and squeezing of Edryn\'s cunt throws you past the point of no return.  Your eyes roll back as you unload into her musky tunnel, nearly losing your grip as your body gives up wave after wave of seed.  The contractions don\'t let up', false );
		if( CoC.getInstance().player.cumQ() < 100 ) {
			EngineCore.outputText( ' even after you\'ve finished.', false );
		} else {
			EngineCore.outputText( ', squeezing more and more cum into her horse-sized womb.  ', false );
			if( CoC.getInstance().player.cumQ() > 250 ) {
				EngineCore.outputText( 'Her body gurgles noisily from the massive fluid injection it\'s just taken, and her belly expands noticeably.  ', false );
			}
			if( CoC.getInstance().player.cumQ() > 500 ) {
				EngineCore.outputText( 'It keeps going as your body spends the last of its massive reserves, bloating her to the point that she\'ll have trouble walking.  ', false );
			}
			EngineCore.outputText( 'Her cunt keeps milking you even after.', false );
		}
		if( CoC.getInstance().player.statusAffectv1( StatusAffects.Edryn ) <= 1 ) {
			EngineCore.outputText( '\n\nYou pull out with a wet pop, and watch the mixed centaur-cum pour from her puffy lips in a waterfall.  It splatters onto the floor wetly as Edryn at last relaxes, dropping herself heavily onto a pile of pillows.  She shakes her head and puts her palms on the floor alongside her body, steadying herself as she attempts to regain her balance.  Edryn gives you a tired smile and says, "<i>Ohhhh that was nice.  Most of my customers can\'t get me off like that.  Don\'t worry about filling me full of fillies either, I take some herbs to prevent that.  You should come back sometime, okay?</i>"', false );
		} else if( CoC.getInstance().player.statusAffectv1( StatusAffects.Edryn ) <= 3 ) {
			EngineCore.outputText( '\n\nShe sighs happily and looks down at you, "<i>Ooh ' + CoC.getInstance().player.short + ', you\'re the best.  We should do this again soon.  Oh goddess, I can feel my juices starting just thinking about it.</i>"', false );
		} else if( CoC.getInstance().player.statusAffectv1( StatusAffects.Edryn ) === 4 ) {
			EngineCore.outputText( '\n\nShe sighs happily and says, "<i>Oh baby, you know what?  I\'m never charging you again.  Just keep getting me off like that and we can do it anytime.</i>"', false );
		} else {
			EngineCore.outputText( '\n\nShe sighs contentedly and says, "<i>Mmm, never stop visiting, okay?</i>"', false );
		}
		EngineCore.outputText( '\n\nThe two of you wipe up as best you can, redress, and head back out to the bar.  You\'re consciously aware of how strongly your groin reeks of centaur-slut.  Your body, happy with the scent and scrutiny of the bar\'s patrons, refuses to go soft, providing a wonderful view of your cum-slicked member.  Giggles and laughter break out around you as you leave, though more than a few of those taking notice have hard nipples or tents of their own.', false );
		if( CoC.getInstance().player.statusAffectv1( StatusAffects.Edryn ) >= 4 ) {
			this.edrynPregChance();
		}
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'sen', -3 );
		if( CoC.getInstance().player.lust < 30 ) {
			CoC.getInstance().player.lust = 30;
		}
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
	};
	Edryn.prototype.fuckEdrynNonTaur = function() {
		EngineCore.spriteSelect( 14 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( ImageManager.showImage( 'edryn-fuck-as-non-taur' ) );
		var x = CoC.getInstance().player.cockThatFits( 300 );
		if( x < 0 ) {
			x = 0;
		}
		EngineCore.outputText( 'She wiggles her more than ample backside towards you, squelching wetly against your ', false );
		if( CoC.getInstance().player.tallness < 48 ) {
			EngineCore.outputText( 'face', false );
		} else {
			EngineCore.outputText( 'body', false );
		}
		EngineCore.outputText( '.  She looks over her shoulder and says, "<i>If you don\'t want your gear to smell like a horny centaur, you ought to shed it and get me warmed up with your tongue.</i>"  You hastily remove it', false );
		if( CoC.getInstance().player.tallness > 72 ) {
			EngineCore.outputText( ' and drop down to your knees to better level yourself with her', false );
		}
		EngineCore.outputText( ', pressing your ' + CoC.getInstance().player.face() + ' into her slick folds and tasting her flavor.  Your nose easily slips into her gash as your tongue explores it, testing and tasting thick, liquid centaur lust.  It\'s tangy and sweet, surprisingly unlike the scent it gives off.  You easily find her large clit and suckle on it, listening to the wet squelches and whinnies of pleasure.\n\n', false );
		EngineCore.outputText( 'With a gasp you pull back, a thin coating of female slime clinging wetly to your face.  She leans over her hindquarters, her human-half rosy with the heat of her arousal as she hands you a towel.  You wipe off, and listen to the \'splat-splat-splat\' of her animalistic pussy-juice as it drips to the floor.  She\'s completely soaked in a way that you doubt even a succubus could replicate.  She crooks a finger and waggles back and forth, making her puffy, black cunt-lips jiggle ever-so-slightly.  You don\'t need any more encouragement.\n\n', false );
		if( CoC.getInstance().player.tallness < 60 ) {
			EngineCore.outputText( 'You grab a stool so you\'ll be tall enough to fuck her properly and climb onto it.  ', false );
		}
		EngineCore.outputText( 'Supporting your', false );
		if( CoC.getInstance().player.cockArea( x ) > 200 ) {
			EngineCore.outputText( ' hefty package with both hands', false );
		} else {
			EngineCore.outputText( 'self with your hand', false );
		}
		EngineCore.outputText( ', you guide your ' + Descriptors.cockDescript( x ) + ' towards the shining, black horse-cunt in front of you.  It parts easily, like a velvet curtain.  You slowly slide forward into Edryn\'s welcoming nethers, enjoying not having to fight to get your large ' + Appearance.cockNoun( CockTypesEnum.HUMAN ) + ' in for a change.  She trembles as you pass the halfway point, ', false );
		if( CoC.getInstance().player.cocks[ x ].cockType === CockTypesEnum.HORSE ) {
			EngineCore.outputText( 'feeling your ring of prepuce slipping between her lips.  ', false );
		} else {
			EngineCore.outputText( 'squirting a little bit of fluid on the floor.  ', false );
		}
		EngineCore.outputText( 'The further you push inside, the more aware of her warmth you become.  Her body temperature is higher than a human\'s, and it feels almost good enough to make you melt.\n\n', false );
		EngineCore.outputText( 'She whinnies and pushes back against you, forcing your entire ' + Descriptors.cockDescript( x ) + ' to slip up her well-lubed passage.  You slap her ass, watching the furred flanks jiggle slightly.  Edryn looks over her shoulder again to and gives you a sultry look.  Before you can puzzle out what she\'s trying to tell you, her entire cunt contracts tightly, like a silken vise.  It wrings your ' + Descriptors.cockDescript( x ) + ' tightly, immobilizing you inside the powerful centauress and making your ' + CoC.getInstance().player.legs() + ' feel wobbly and weak.\n\n', false );
		EngineCore.outputText( 'Edryn relaxes slightly, enough to allow you movement, and you happily begin fucking her hindquarters, grabbing her tail for leverage as you pound against her.  Her entire body sways with your motions, even jiggling her breasts.  She matches you, pushing back with equal fervor until her copious cunt-juice is all over your belly and thighs as every thrust is announced with a loud SLAP.  She whinnies happily, fucking harder and harder until you\'re struggling not to be knocked over by the overenthusiastic woman.\n\n', false );
		EngineCore.outputText( 'She moans and whinnies while her animal cunt noisily slurps up your ' + Descriptors.cockDescript( x ) + ', rising to a feverish pitch.  Everything suddenly shifts and you\'re knocked off balance. Clutching tightly to her tail, you hang on for dear life as she bears you down onto the floor.  Hundreds of soft pillows cushion the fall, and ensure that you\'re not crushed by Edryn\'s hindquarters, but you are completely pinned under her.\n\n', false );
		EngineCore.outputText( 'You feel like you should be doing something, but there\'s nothing you can do.  She never misses a beat, lifting up her back end until you\'re about to pop free, and then slamming back down, occasionally swatting your face with her uncontrolled tail.  Helpless underneath hundreds of pounds of horse-flesh, you\'re forced to lie there and take it, fucked like a sex toy for who knows how long.\n\n', false );
		EngineCore.outputText( 'When she finally cums, you\'re battered and sore, and she doesn\'t seem to care a bit.  She whinnies and pushes down HARD, making it difficult for you to breathe.  Her pussy spasms and begins milking your dick.  It tightly contracts in a ring around your base that slides up to the tip, but the muscular contractions happen so quickly there are more rings of pleasure squeezing you than you can count.  Your heart beats madly in your chest while you try to breathe and orgasm simultaneously, but your cock is the only one having any luck.\n\n', false );
		EngineCore.outputText( 'Your eyes roll back as you unload into Edryn\'s musky tunnel, giving up on breathing as your body gives up wave after wave of seed.  The contractions don\'t let up, ', false );
		if( CoC.getInstance().player.cumQ() < 100 ) {
			EngineCore.outputText( 'even after you\'ve finished.\n\n', false );
		} else {
			EngineCore.outputText( 'squeezing more and more cum into her horse-sized womb.  ', false );
			if( CoC.getInstance().player.cumQ() >= 250 ) {
				EngineCore.outputText( 'Her body gurgles noisily from the massive fluid injection it\'s just taken, and her belly expands noticeably. ', false );
			}
			if( CoC.getInstance().player.cumQ() >= 500 ) {
				EngineCore.outputText( 'It keeps going as your body spends the last of its massive reserves, bloating her to the point that she\'ll have trouble walking.  ', false );
			}
			EngineCore.outputText( 'Her cunt keeps milking you even after you\'ve finished.\n\n', false );
		}
		EngineCore.outputText( 'As the edges of your vision start blacking out, Edryn ', false );
		if( CoC.getInstance().player.hasKnot( x ) ) {
			EngineCore.outputText( 'tries to rise, lifting up enough for you to get a few good breaths in, but your knot keeps her locked to you, and the two of you are tied together for another minute or two while it deflates, emptying the very last dregs of your spunk into her.  You pop free, ', false );
		} else {
			EngineCore.outputText( 'slowly rises up off of you, ', false );
		}
		EngineCore.outputText( 'and like a dam being broken, a wave of mixed sexual fluids dumps from her puffy lips onto you.  Edryn sighs happily, and you realize her tongue is hanging from her mouth with her eyes slightly rolled back.  You realize that though she endeavors to act restrained, her body is determined to be a wanton slut.\n\n', false );
		if( CoC.getInstance().player.statusAffectv1( StatusAffects.Edryn ) <= 1 ) {
			EngineCore.outputText( 'She sighs happily and looks down at you, "<i>Ohhhh that was nice.  Most of my customers can\'t get me off like that.  I hope you\'re ok!  Don\'t worry about me getting pregnant either, I take some herbs to prevent that sort of thing until I\'m ready for it.</i>"\n\n', false );
		} else if( CoC.getInstance().player.statusAffectv1( StatusAffects.Edryn ) <= 3 ) {
			EngineCore.outputText( 'She sighs happily and looks down at you, "<i>Ooh ' + CoC.getInstance().player.short + ', you\'re the best.  We should do this again soon.  Oh goddess, I can feel my juices starting just thinking about it.</i>"\n\n', false );
		} else if( CoC.getInstance().player.statusAffectv1( StatusAffects.Edryn ) === 4 ) {
			EngineCore.outputText( 'She sighs happily and says, "<i>Oh baby, you know what?  I\'m never charging you again.  Just keep getting me off like that and we can do it anytime.</i>"\n\n', false );
		} else {
			EngineCore.outputText( 'She sighs contentedly and says, "<i>Mmm, never stop visiting ok?</i>"\n\n', false );
		}
		EngineCore.outputText( 'The two of you clean up as best you can, redress, and head back out to the bar.  You\'re consciously aware of how strongly you reek of centaur-slut.  Your body, happy with the scent and the scrutiny of the bar\'s patrons, refuses to go soft, providing a more-than-ample tent.  Giggles and laughter break out around you as you leave, though more than a few of those taking notice have hard nipples or tents of their own.', false );
		if( CoC.getInstance().player.statusAffectv1( StatusAffects.Edryn ) >= 4 ) {
			this.edrynPregChance();
		}
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'sen', -3 );
		if( CoC.getInstance().player.lust < 30 ) {
			CoC.getInstance().player.lust = 30;
		}
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
	};
	Edryn.prototype.edrynBar = function() {
		if( CoC.getInstance().flags[ kFLAGS.EDRYN_NEVER_SEE_AGAIN ] === 0 && CoC.getInstance().time.hours >= 14 && CoC.getInstance().time.hours <= 19 && (CoC.getInstance().time.hours < 17 || CoC.getInstance().flags[ kFLAGS.EDRYN_NUMBER_OF_KIDS ] === 0) ) {
			return true;
		}
		return false;
	};
	//Hel x Edryn Threesome;
	/*Sahvin
	 Requirements is in Fuckbuddy or Follower mode
	 -Edryn is giving herself for free
	 -PC has a cock that fits Edryn's standards
	 -PC must be tall enough so their head is over Edryn's ass -- (ie, 4ft + ?)
	 Scene proc's the first time the PC visits the Wet Bitch after all requirements are met, during Edryn's normal hours. Hel can be found in the Wet Bitch every third day from then on -- this does not disrupt her other functions or appearances.
	 */
	//Introduction -- Hel x Edryn -- Wet Bitch Entrance;
	//(PC goes to the Wet Bitch during Edryn's hours);
	Edryn.prototype.edrynHeliaThreesomePossible = function() {
		if( CoC.getInstance().time.totalTime === this.edrynHeliaLastThreesomeCheck || CoC.getInstance().time.totalTime === -this.edrynHeliaLastThreesomeCheck ) {
			//Only choose action once per visit to the bar
		return this.edrynHeliaLastThreesomeCheck > 0;
		}
		this.edrynHeliaLastThreesomeCheck = CoC.getInstance().time.totalTime;
		if( CoC.getInstance().player.gender === 0 || CoC.getInstance().time.hours < 14 || CoC.getInstance().time.hours >= 20 || Utils.rand( 2 ) === 0 || (CoC.getInstance().flags[ kFLAGS.HEL_FUCKBUDDY ] === 0 && !SceneLib.helFollower.followerHel()) || (CoC.getInstance().flags[ kFLAGS.HEL_FOLLOWER_LEVEL ] === 1 && CoC.getInstance().flags[ kFLAGS.HEL_HARPY_QUEEN_DEFEATED ] === 0) ) {
			this.edrynHeliaLastThreesomeCheck = -this.edrynHeliaLastThreesomeCheck; //Make the saved time negative to indicate Helia is not at the bar right now
			return false;
		}
		return true;
	};
	Edryn.prototype.helAppearance = function() {
		EngineCore.outputText( '\n\nTo your surprise, you see Hel the salamander sitting in a corner table, a pair of foxy fox-morph girls sitting on her lap.  When she sees you enter, the pretty reptile lifts her tankard and shouts, "<i>Hey! ' + CoC.getInstance().player.short + '! Over here!</i>" over the loud noises of the bar.', false );
		//("<i>Hel</i>" button added to the Wet Bitch menu);
	};
	//"<i>Hel</i>" in Wet Bitch Menu (First Time);
	Edryn.prototype.approachHelAtZeBitch = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( ImageManager.showImage( 'hel-chat-at-bar' ) );
		var edryn = null;
		if( this.edrynBar() && CoC.getInstance().player.cockThatFits( 300 ) >= 0 && CoC.getInstance().player.statusAffectv1( StatusAffects.Edryn ) >= 4 ) {
			edryn = this.helEdrynThreeSomeStartYerEngines;
		}
		if( edryn !== null && CoC.getInstance().flags[ kFLAGS.HEL_EDRYN_OFFER ] === 0 ) {
			EngineCore.outputText( '"<i>Hey there, lover mine,</i>" Helia says with a coy grin as you take a seat across from her.  The two fox-girls giggle drunkenly, prompting Hel to give them each a playful slap on the ass and send them on their way.  "<i>Well, fancy meeting you here, ', false );
			if( CoC.getInstance().player.femininity < 49 ) {
				EngineCore.outputText( 'handsome', false );
			} else {
				EngineCore.outputText( 'beautiful', false );
			}
			EngineCore.outputText( '.  In town for business... or pleasure?</i>" she purrs with a little wink.\n\n', false );
			EngineCore.outputText( 'You spend a few minutes talking with the salamander, brushing off her question to ask her what she\'s doing in Tel\'Adre.  With a little laugh, she says "<i>Just found the place a couple of days ago.  How the hell did I not know there was an entire town of people out here?  Anyway, so I get here and this smoking hot centauress starts waving this gem all over me, and--</i>"\n\n', false );
			EngineCore.outputText( '"<i>Centauress? You mean Edryn?</i>"\n\n', false );
			EngineCore.outputText( '"<i>Yeah!  That\'s the one!  Oh man, I\'d pay a pretty gem to stick my tail up her flanks!</i>" she laughs, snaking her tail under the table to tickle your thighs.  You give her prehensile extremity a little slap until it comes to rest in your lap, snuggling up around your ' + Descriptors.hipDescript() + ' as Hel nonchalantly chugs down the rest of her ale.\n\n', false );
			EngineCore.outputText( 'Sitting with the salamander, you notice across the crowded bar that Edryn is sitting at her table, sipping a little glass of wine.  Catching your eye, the centauress gives you a sultry wink.  An idea forms in your mind: you could easily introduce the two girls.  Do you?', false );
			CoC.getInstance().flags[ kFLAGS.HEL_EDRYN_OFFER ]++;
		} else {
			EngineCore.outputText( '"<i>Hey there, lover mine,</i>" Helia says with a coy grin as you take a seat across from her.  The two fox-girls giggle drunkenly, prompting Hel to give them each a playful slap on the ass and send them on their way before swinging over and taking her place on your lap.  "<i>Well, fancy meeting you here, ', false );
			if( CoC.getInstance().player.femininity < 49 ) {
				EngineCore.outputText( 'handsome', false );
			} else {
				EngineCore.outputText( 'beautiful', false );
			}
			EngineCore.outputText( '.  In town for business... or pleasure?</i>" she purrs with a little wink.\n\n', false );
			EngineCore.outputText( 'You spend a few minutes talking with the salamander, joking and laughing with your inebriated lover.  ', false );
			//Eventually, though, Hel gives a nod toward Edryn, sitting a ways away from you, and asks if you'd be up for a little threesome time.  Are you?\n\n", false);;
			EngineCore.outputText( '  Eventually, though, Hel gives you a sultry look and asks if you\'re up for a little group activity.  Are you?\n\n', false );
		}
		//(Display Options: [Threesome] [Leave];
		EngineCore.choices( 'Edryn3Some', edryn, 'Fox Girls', SceneLib.helScene.heliaPlusFoxyFluffs, '', null, '', null, 'Leave', this.leaveHelInZeBitch );
	};
	//First Time - Leave;
	Edryn.prototype.leaveHelInZeBitch = function() {
		EngineCore.outputText( '', true );
		if( CoC.getInstance().flags[ kFLAGS.HEL_EDRYN_OFFER ] === 1 ) {
			EngineCore.outputText( 'You decide against trying to set something up between the girls -- you like your lovers separate for now.  You spend the rest of the hour quietly chatting with Helia before giving her a friendly kiss goodbye and stepping away.', false );
		} else {
			EngineCore.outputText( 'You brush Helia\'s request off, saying you aren\'t much interested in a group right now.  She sighs dejectedly, but quickly recovers and gives you a knowing wink.  "<i>Well, maybe later.  I know you like some group play as much as I do.</i>"\n\n', false );
			EngineCore.outputText( 'You spend the rest of the hour quietly chatting with Helia before giving her a friendly kiss goodbye and stepping away.', false );
		}
		EngineCore.doNext( SceneLib.telAdre.barTelAdre );
	};
	//First Time -- Threesome;
	Edryn.prototype.helEdrynThreeSomeStartYerEngines = function() {
		EngineCore.outputText( '', true );
		if( CoC.getInstance().flags[ kFLAGS.EDRYN_TIMES_HEL_THREESOMED ] === 0 ) {
			EngineCore.outputText( 'Suddenly, an idea forms in your mind.  You ask Hel if she\'d like to meet Edryn.\n\n', false );
			EngineCore.outputText( '"<i>Wh-- Really?</i>" she gasps, eyebrows arching.  Her tail starts wagging excitedly in your lap until you stand, taking Hel\'s hand in yours and leading her over to Edryn\'s table.  The centauress waves amicably as your approach, though she cocks her head to the side as she notices the other girl on your arm.\n\n', false );
			EngineCore.outputText( '"<i>Hey, ' + CoC.getInstance().player.short + ',</i>" Edryn says with a half-smile. "<i>Who\'s your friend?</i>"\n\n', false );
			EngineCore.outputText( 'You introduce the girls, and with a nod from Edryn, you both sit at the centauress\'s table.  You spend a few minutes chatting amicably, and are gratified to see how wonderfully Hel and Edryn are getting on.  Within minutes they\'re comparing stories of Edryn\'s guard duty against Hel\'s adventures as a wandering berzerker.  You let them talk for a little while, but eventually you bring up your reason for bringing Hel over to meet the centauress.\n\n', false );
			EngineCore.outputText( 'Surprisingly for the salamander, Hel blushes brightly when you mention her little crush on Edryn.  The centauress gives a girlish giggle at the sight of Hel turning bright red, but quickly waves it off.  "<i>Don\'t worry about it, cutie,</i>" Edryn says, taking Helia\'s hand in hers.  "<i>Looks like ' + CoC.getInstance().player.short + ' forgot to mention: I do a little \'wet work\' on the side.  ' + CoC.getInstance().player.mf( 'He', 'She' ) + ' and I have a little understanding, and since I\'m horny and you\'re cute... What do you say we make your wish come true?</i>"\n\n', false );
			EngineCore.outputText( 'Hel just about squeals with delight.  She nods her head emphatically, making both you and Edryn laugh.  With a knowing look, Edryn takes you and Hel by the hand and leads you into her private room.', false );
		}
		//Repeat -- Threesome;
		else {
			EngineCore.outputText( 'You take Hel\'s hand and lead her over to Edryn\'s table.  The centauress smiles wide as you approach and invites you to sit.  You spend a few minutes in pleasant conversation before Hel eagerly asks if Edryn\'s in the mood for a little group fun.\n\n', false );
			EngineCore.outputText( '"<i>Well, normally I\'m a twosome sort of girl, but... For you two, I can make an exception.</i>"\n\n', false );
			EngineCore.outputText( 'Grinning, the three of you make your way up to Edryn\'s private chambers.', false );
		}
		EngineCore.doNext( this.threesomeEdrynAndHel );
	};
	//THREESOME SEX;
	Edryn.prototype.threesomeEdrynAndHel = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( ImageManager.showImage( 'edryn-hel-threesome' ) );
		var x = CoC.getInstance().player.cockThatFits( 300 );
		CoC.getInstance().flags[ kFLAGS.EDRYN_TIMES_HEL_THREESOMED ]++;
		EngineCore.outputText( 'You arrive in Edryn\'s private room, a small dark alcove in the bar with a healthy layer of pillows covering the floor.  You start to disrobe, watching as Hel is nearly crushed up against a wall by a sudden butt-bump from Edryn: "<i>You better start warming me up with that long lizard tongue, cutie,</i>" she says, herself yanking off her loose shirt.\n\n', false );
		EngineCore.outputText( 'Hel gets to work without further prompting, grabbing Edryn\'s wide flanks and burying her face into the centauress\'s horse-cunt. You grab your ' + Descriptors.cockDescript( x ) + ', stroking yourself off to the show unfolding before you.  Edryn whinnies happily, wiggling her hips into Hel\'s face, crushing the salamander further and further into the wall.\n\n', false );
		EngineCore.outputText( 'Alright, alright.  You break the girls up before Edryn cums just from the oral assault.  It takes a moment of thought to figure out how to make this threeway work with Edryn\'s massive horse body.  You give Hel a leg up, getting her mounted on Edryn\'s back, and take up position behind the centauress.\n\n', false );
		EngineCore.outputText( 'Hel rolls over on her back, using her legs to steady on Edryn\'s back as you rub your ' + Descriptors.cockDescript( x ) + ' against Edryn\'s gaping horsecunt, making the centauress shudder.  The shudder nearly throws Hel off her back, causing the salamander to dig her claws painfully into Edryn\'s sides.  She bucks back in surprise, impaling herself right on your ' + Descriptors.cockDescript( 0 ) + '.\n\n', false );
		EngineCore.outputText( 'Edryn clops back, forcing you to stumble until Edryn has taken your cock up to the hilt inside her.  Your back slams against the wall and your hips buck into the centauress\'s slick fuckhole.  The horse-girl\'s cunt contracts around your shaft like a hot, silken vice, already starting to milk you.  You start to pump into her, withdrawing until your cock\'s only just parting her vaginal lips before thrusting hard up to the hilt', false );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( ', your sack slapping wetly against the bottom of her cunny', false );
		}
		EngineCore.outputText( '.\n\n', false );
		EngineCore.outputText( 'Atop the centaur, Hel scrambles back until her ample ass is level with Edryn\'s.  Her tail snakes out, wrapping around your waist before its hot, narrow tip pokes up against Edryn\'s tight backdoor.  Now with Helia\'s meaty tail wrapped tight around you, you\'re restricted to shorter thrusts into the centaur, which you make up for by increasing your speed, slamming into her tight depths with enough force to badly bruise any human.  At the height of one of your thrusts, Hel finally gets the tip of her tail through Edryn\'s tight asshole, pushing in just an inch and already making her mount scream in ecstasy.\n\n', false );
		EngineCore.outputText( 'You decide to pull double-duty, and lean forward to bury your face between Hel\'s sexy thighs.  The salamander gasps as your tongue slides out, teasing her outer lips, flicking gently across her little clit before slipping into her boiling-hot slit.  You start to piston your hips and face in and out, picking up an unsteady rhythm as you fuck the centaur and salamander at once, assaulting their gaping cunts to the beat of Hel\'s slithering tail working in and out of Edryn\'s ass.\n\n', false );
		EngineCore.outputText( 'It seems the double-attack is too much for poor Edryn to handle, however, and you grin ear to ear as she grabs her tits and bucks her hips, her forelegs collapsing as pleasure overtakes her.  Hel yelps and tumbles back, right out of your reach until her back slams into Edryn\'s human half.  Not willing to let the salamander go without release, you leap onto Edryn\'s hefty ass and slide down after her, hefting up your ' + Descriptors.cockDescript( x ) + ' like a spear and ramming it right into Hel\'s waiting cunt.  She screams with pleasure and pain as your shaft rams up into her cervix, leaving your face smooshed between her tits.  You\'re about to start fucking her in earnest, but before you can, your ass is suddenly penetrated by Hel\'s long tail.  You yell aloud, suddenly entrapped by the salamander\'s burning cunt and sudden tail-fuck.\n\n', false );
		EngineCore.outputText( 'You cum a moment later, grabbing Hel by the shoulders and thrusting as deep into her as you can.  You unleash the beast, spraying your cum into her womb with your last mighty blow.  Hel\'s head lolls back with the sensation of your cum filling her, and is soon moaning as she cums around you, milking the last of the cum out of your now-sore dick.\n\n', false );
		EngineCore.outputText( 'The three of you lay in a heap, all panting and gasping, engulfed in pleasure and exhaustion.  You lean over to check on the centauress you just used as a bed, and are gratified to see that Edryn looks to have been fucked silly, her eyes crossed and tongue hanging lewdly from her mouth.  Leaning against her back, Hel\'s own mouth is agape as she breathes heavily, slowly fingering a bit of your cum from her stuffed snatch.  You withdraw from her and clamber down from the pile to stick your cock in Edryn\'s open mouth, using her to clean your shaft.\n\n', false );
		EngineCore.outputText( 'When you\'re satisfied, you stumble and collapse against her horsebody, barely fighting off an intense urge to sleep.  The centauress moans contentedly, "<i>Mmm, we should do this again sometime. You two were amazing.</i>"\n\n', false );
		EngineCore.outputText( '"<i>Oh yeah. We... We gotta go again sometime,</i>" Hel agrees, nearly falling off Edryn\'s back.  You give each of the girls a long kiss before collecting your ' + CoC.getInstance().player.armorName + ' and walking off back to camp.\n\n', false );
		CoC.getInstance().player.orgasm();
		SceneLib.helFollower.helAffection( 5 );
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
	};
	//Pregdryn:;
	Edryn.prototype.findOutEdrynIsPregnant = function() {
		EngineCore.spriteSelect( 14 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'Edryn is lying down at her table, pensively circling a finger around a glass of water and poking listlessly at her plate of greens.  Her eyes keep glancing down or to the side every time you meet her gaze.  You\'ve never seen the shameless centaur bothered like this, and you grab her by the shoulders to ask, "<i>What\'s wrong?</i>"\n\n', false );
		EngineCore.outputText( 'She finally looks up at you, her large brown eyes wet with moisture, and explains, "<i>I-I\'m pregnant.  I saw the covenant about it and had them check with their magic.  You\'re the father.</i>"\n\n', false );
		EngineCore.outputText( 'The centaur blushes fiercely, blurting everything out in a rush now that she\'s started to talk, "<i>I don\'t know how it happened!  I\'ve been taking herbs to prevent this kind of thing, and I\'ve NEVER heard of someone getting pregnant while they\'re on these.</i>"  She gives her flank a gentle pat as she keeps speaking, "<i>There\'s just something about your cum I guess!  Our child will be a centaur, just like her mom, and I intend to keep her.</i>"\n\n', false );
		EngineCore.outputText( '<b>How do you react?</b>', false );
		var aroused = (CoC.getInstance().player.totalCocks() > 0 ? this.arousedByPregdryn : null);
		//[Shocked] [Pleased] [Aroused (Requires Wang)];
		EngineCore.choices( 'Shocked', this.shockedByEdrynsPregnancy, 'Pleased', this.pleasedbyPregdryn, 'Aroused', aroused, '', null, '', null );
	};
	//Shocked;
	Edryn.prototype.shockedByEdrynsPregnancy = function() {
		EngineCore.spriteSelect( 14 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You stammer for an answer, unsure of what to say in light of this startling revelation.  Edryn looks on the verge of tears and all you can do is struggle for words.  She grips the table, her knuckles turning white while her eyes flick from side to side in a panic.', false );
		EngineCore.outputText( '\n\n<b>What do you do?</b>', false );
		//[Accept it] [Reject it];
		EngineCore.choices( 'Accept It', this.shockedByPregdrynThenAccept, 'Reject It', this.beAnAssholeToPregdryn, '', null, '', null, '', null );
	};
	//Accept it;
	Edryn.prototype.shockedByPregdrynThenAccept = function() {
		EngineCore.spriteSelect( 14 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'Leaning forward, you grab hold of Edryn\'s hands and cradle them in your grip.  She looks back up at your eyes and reads your expression, breaking into a smile as she reads the feelings on your face.\n\n', false );
		EngineCore.outputText( '"<i>Thank you!  You had me really going for a moment there, you know that?  Wow, that is a weight off my chest,</i>" exhales Edryn.  She climbs up onto her hooves and whispers, "<i>I\'ve got to use the little ponies\' room, I\'ll be right back lover,</i>" before she departs.\n\n', false );
		//[To Pregnant Offer];
		EngineCore.doNext( this.pregdrynOffer );
	};
	//Reject it;
	Edryn.prototype.beAnAssholeToPregdryn = function() {
		EngineCore.spriteSelect( 14 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You look the panicked centauress dead in the eye and explain that what she does with her body is her business, and you want nothing to do with it.  She stares dumbfounded for a split-second before her face colors red with rage.  Edryn screams, "<i>GET THE FUCK AWAY FROM ME THEN!</i>"\n\n', false );
		EngineCore.outputText( 'Everyone in the bar turns to watch the commotion, and with an angry, hormonal centaur and this many eyes on you, it would be best to depart.\n\n', false );
		EngineCore.outputText( '<b>(Edryn will no longer speak with you.)</b>', false );
		CoC.getInstance().flags[ kFLAGS.EDRYN_NEVER_SEE_AGAIN ] = 1;
		//Use the 1 hour cheat thinger;
		EngineCore.doNext( SceneLib.telAdre.barTelAdre );
	};
	//Pleased;
	Edryn.prototype.pleasedbyPregdryn = function() {
		EngineCore.spriteSelect( 14 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You crack into a smile and congratulate the lusty centaur.  She giggles with relief at your words and wipes a bead of sweat from her brow as you finish.  Edryn exclaims, "<i>I\'m so glad you\'re happy about this!  I don\'t expect you to drop your quest and move in with me or anything like that, but it\'ll be wonderful to hear the clipper-clopper of little hooves in this town.</i>"\n\n', false );
		EngineCore.outputText( 'Edryn pulls back from the table and stretches, her muscles visibly loosening as the tension oozes out of her imposing frame.  She whispers, "<i>Be right back lover, I\'ve got to make a stop at the little ponies\' room,</i>" before she departs.\n\n', false );
		//[To Pregger Offer];
		EngineCore.doNext( this.pregdrynOffer );
	};
	//Aroused;
	Edryn.prototype.arousedByPregdryn = function() {
		EngineCore.spriteSelect( 14 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You break into a grin bordering on lecherousness and congratulate the lusty centaur.  Her eyes widen for a moment, shocked from your expression, then narrow into a sultry expression.  Edryn teases, "<i>I think someone has a bit of a pregnancy fetish, hrmm?  Is it the thought of my tits getting swollen with milk or the idea of me being jiggly and randy all the time that does it for you?</i>"  She shivers, the outlines of her prominent nipples straining against her already-tightly-stretched tunic.  Edryn\'s eyes drop down and a rueful smile works its way across her face as she admits, "<i>Great, now I\'m turned on too!  Let me go use the little ponies\' room. Then, MAYBE, we can help take care of each other.</i>"\n\n', false );
		//[To Pregger Offer];
		EngineCore.doNext( this.pregdrynOffer );
	};

	//Pregger Offer;
	Edryn.prototype.pregdrynOffer = function( cs ) {
		EngineCore.spriteSelect( 14 );
		if( cs === undefined || cs ) {
			cs = true;
			EngineCore.outputText( '', true );
		}
		//Used to call post birthing sexings.;
		if( !this.pregnancy.isPregnant ) {
			//Actually choose the sex scene;
			this.edrynSexSelecter();
			return;
		}
		//VERY Pregnant Offer;
		if( this.pregnancy.incubation < 250 ) {
			EngineCore.outputText( 'Edryn struggles to move, practically waddling thanks to her swollen, pregnant belly.  As usual, the glistening black lips of her sex are on display, and with the hormones pouring through her, she\'s leaking a steady trail of slime.  The scent coming off her is unreal!  It\'s like it\'s reaching right into your brain and cranking the \'fuck\' dial up to maximum.  ', false );
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 'All of your ' + Descriptors.multiCockDescriptLight() + ' fill in seconds, growing rock hard and actually aching with their need.  ', false );
			} else if( CoC.getInstance().player.cockTotal() === 1 ) {
				EngineCore.outputText( 'Your ' + Descriptors.cockDescript( 0 ) + ' fills in seconds, growing rock hard and actually aching with need.  ', false );
			}
			EngineCore.outputText( 'You\'re totally dazed by the massive spike in arousal, and ', false );
			if( CoC.getInstance().player.cor + CoC.getInstance().player.lib < 100 || CoC.getInstance().player.cockTotal() < 1 ) {
				EngineCore.outputText( 'you struggle not to reach into your ' + CoC.getInstance().player.armorName + ' to touch yourself.', false );
			} else {
				EngineCore.outputText( 'you can\'t stop yourself from grabbing ', false );
				if( CoC.getInstance().player.cockTotal() === 1 ) {
					EngineCore.outputText( 'your ', false );
				} else {
					EngineCore.outputText( 'a ', false );
				}
				EngineCore.outputText( Descriptors.cockDescript( 0 ) + ' and stroking it under the table.', false );
			}
			EngineCore.outputText( '\n\n', false );
			EngineCore.outputText( 'You wouldn\'t notice her return if it wasn\'t for the increase in potent centaur pheromones hitting your nostrils.  It takes a hand slipping under the table to play with your ', false );
			if( CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( Descriptors.ballsDescriptLight(), false );
			} else if( CoC.getInstance().player.hasSheath() ) {
				EngineCore.outputText( 'sheath', false );
			} else if( CoC.getInstance().player.cockTotal() > 0 ) {
				EngineCore.outputText( Descriptors.cockDescript( 0 ), false );
			} else {
				EngineCore.outputText( 'crotch', false );
			}
			EngineCore.outputText( ' to rouse you from the incredible sexual haze.  ', false );
		}
		//Mildly pregnant offer;
		else {
			EngineCore.outputText( 'As usual, when Edryn pivots to leave, she gives you a perfect view of her unusual vagina.  The glistening black lips of her sex practically ooze moisture, and the scent coming off her seems even more potent than usual, making your head swim.  ', false );
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 'All of your ' + Descriptors.multiCockDescriptLight() + ' fill in seconds, growing rock hard and actually aching with their need.  ', false );
			} else if( CoC.getInstance().player.cockTotal() === 1 ) {
				EngineCore.outputText( 'Your ' + Descriptors.cockDescript( 0 ) + ' fills in seconds, growing rock hard and actually aching with need.  ', false );
			}
			EngineCore.outputText( 'You\'re a little bit dazed by the sudden spike in arousal, and ', false );
			if( CoC.getInstance().player.cor + CoC.getInstance().player.lib < 100 || CoC.getInstance().player.cockTotal() < 1 ) {
				EngineCore.outputText( 'you struggle not to reach into your ' + CoC.getInstance().player.armorName + ' to touch yourself.', false );
			} else {
				EngineCore.outputText( 'you can\'t stop yourself from grabbing ', false );
				if( CoC.getInstance().player.cockTotal() === 1 ) {
					EngineCore.outputText( 'your ', false );
				}
				EngineCore.outputText( 'a ', false );
				EngineCore.outputText( Descriptors.cockDescript( 0 ) + ' and stroking it under the table.', false );
			}
			EngineCore.outputText( '\n\n', false );
			EngineCore.outputText( 'As usual, you\'re barely cognizant of her return.  It isn\'t until a hand sneaks under the table to surreptitiously fondle your ', false );
			if( CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( Descriptors.ballsDescriptLight(), false );
			} else if( CoC.getInstance().player.hasSheath() ) {
				EngineCore.outputText( 'sheath', false );
			} else if( CoC.getInstance().player.cockTotal() > 0 ) {
				EngineCore.outputText( Descriptors.cockDescript( 0 ), false );
			} else {
				EngineCore.outputText( 'crotch', false );
			}
			EngineCore.outputText( ' that you come out of your daze.  ', false );
		}
		//(NO WANGUUU);
		if( CoC.getInstance().player.cockTotal() === 0 ) {
			EngineCore.outputText( 'She looks down, eyes fixing on your crotch for a moment before she sighs, "<i>Why did you get rid of your dick?  I like you a lot, but I don\'t really want to have sex with you like you are now.</i>"\n\nEdryn leaves looking a little depressed.', false );
			//Bar menu?;
			EventParser.cheatTime( 1 );
			EngineCore.doNext( SceneLib.telAdre.barTelAdre );
			return;
		}
		//(MEETS SIZE REQUIREMENTS);
		var x = CoC.getInstance().player.cockThatFits( 300 );
		//-1 = none fit.  Set x to 0 for big boys.;
		if( x < 0 ) {
			x = 0;
		}
		if( CoC.getInstance().player.cockArea( x ) >= 24 && CoC.getInstance().player.cockArea( x ) < 300 ) {
			EngineCore.outputText( 'Edryn is smiling radiantly as she continues to caress you under the table.  She asks, "<i>', false );
			if( CoC.getInstance().flags[ kFLAGS.EDRYN_NUMBER_OF_KIDS ] === 0 ) {
				EngineCore.outputText( 'Does my scent have an even stronger effect on you now', false );
			} else {
				EngineCore.outputText( 'Are you going to cum just from sniffing at my cunt', false );
			}
			EngineCore.outputText( '?</i>"  You try to deny it, but she pumps at your shaft and continues, "<i>Don\'t lie dear, I can feel how hard you are now, and I DEFINITELY saw how dazed you were when I came back out.  Let\'s go back to my room so you can get another whiff, okay?</i>"\n\n', false );
			EngineCore.outputText( 'The centaur doesn\'t wait for a reply, and takes off at a trot towards her quarters.  A few drips have splattered across the floor, leaving a trail for you to follow.  You get up, dazed with arousal and leaking pre-cum, and stagger through the bar to her room, practically lust-drunk.', false );
			EngineCore.dynStats( 'lus', 50 );
			//TO SEX!;
			//EngineCore.doNext(this.fuckPregEdryn);;
			EngineCore.outputText( '\n\nHow do you want to handle this?  ' );
			EngineCore.menu();
			EngineCore.outputText( 'You could have some great, pregnant taur sex.' );
			EngineCore.addButton( 0, 'Preg. Fuck', this.fuckPregEdryn );
			if( CoC.getInstance().player.biggestCockArea() >= 300 ) {
				EngineCore.outputText( '  Since at least part of you isn\'t acceptable to her, you could eat her out until you get off from her pheromones alone.' );
				EngineCore.addButton( 1, 'NoFitEating', this.jizzFromEatingPregdrynOut );
			}
			EngineCore.outputText( '  Or, you could go down on her until you\'re in a frenzy, then fuck her wildly.' );
			EngineCore.addButton( 2, 'Eat,Rut,Fuck', this.eatEdrynPussyLikeABawss );
			return;
		}
		//(PC TOO BIG);
		else if( CoC.getInstance().player.cockArea( x ) > 300 ) {
			EngineCore.outputText( 'Edryn brushes her hand over ALL of your ' + Descriptors.cockDescript( 0 ) + ' then jerks it back, startled.  She sighs, "<i>Dear, that thing is a BEAST.  I mean, there\'s no doubt I\'d love to get it inside me, but I promise it won\'t fit me.</i>"\n\n', false );
			EngineCore.outputText( 'She looks at you pleadingly and practically begs, "<i>Please, find a way to fit me.</i>"  Edryn grabs you by the shoulders and whispers in your ear, "<i>Being pregnant makes me so turned on ALL THE TIME.  I need you inside me.</i>"\n\n', false );
			EngineCore.outputText( 'A thoughtful look crosses the centaur\'s face as she continues to pant in your ear, "<i>Come on, lets go back to my room.  I\'ll find a way to tend to that monster if you\'ll eat me out.  Maybe the pheromones wafting off my cunt will get you off without me even touching you?  I\'ve seen it happen before with some of my clients, and with how strong my scent is now...</i>"\n\n', false );
			EngineCore.outputText( 'Edryn releases you and climbs up on all fours, making her way towards her room in the back of the establishment.  The smell of her need hangs heavy in the air, and you follow it like a lost puppy.  Of course, puppies don\'t have their massive, rock-hard maleness visible to everyone around them.  Thankfully, you reach her door quickly, and bolt inside.', false );
			//Go to 'too big or too small eat out';
			EngineCore.doNext( this.jizzFromEatingPregdrynOut );
			EngineCore.dynStats( 'lus', 50 );
			return;
		}
		//(PC TOO SMALL);
		else {
			EngineCore.outputText( 'Edryn giggles, "<i>When did you get this small?  I\'ve seen ponies with bigger kits!</i>" but her hand continues to stroke you.  You squirm in her grasp, about ready to burst.  The pregnant centaur teases, "<i>Dear, I don\'t think I\'d notice something that small if you stuck it inside me.</i>"\n\n', false );
			EngineCore.outputText( 'She laughs at the expression on your face and continues, "<i>Oh don\'t be like that.  The truth is the truth.  You\'re still the father of my child.  Why don\'t we go back to my room?  You can eat me out till the centaur pheromones overpower your little dick and make it squirt, okay?</i>"\n\n', false );
			EngineCore.outputText( 'The centaur doesn\'t wait for a reply, and takes off at a trot towards her quarters.  A few drips have splattered across the floor, leaving a trail for you to follow.  You get up, dazed with arousal and leaking pre-cum, and stagger through the bar to her room, practically drunk on lust.', false );
			//Go to 'too big or too small eat out';
			EngineCore.doNext( this.jizzFromEatingPregdrynOut );
			EngineCore.dynStats( 'lus', 50 );
			return;
		}
	};

	//Fucking;
	Edryn.prototype.fuckPregEdryn = function() {
		EngineCore.clearOutput();
		EngineCore.spriteSelect( 14 );
		EngineCore.outputText( ImageManager.showImage( 'edryn-preggo-fuck' ) );
		var x = CoC.getInstance().player.cockThatFits( 300 );
		if( x < 0 ) {
			x = 0;
		}
		EngineCore.outputText( '', true );
		//NONTAUR;
		if( CoC.getInstance().player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
			EngineCore.outputText( 'Edryn lurches forwards as soon as the door closes behind you, slamming her powerful frame into you with enough force to propel you several feet back onto a large pile of pillows in the corner.  The feeling of her massive, milk-drooling teats ', false );
			if( CoC.getInstance().player.tallness < 60 ) {
				EngineCore.outputText( 'bouncing against the top of your head', false );
			} else if( CoC.getInstance().player.tallness < 84 ) {
				EngineCore.outputText( 'battering your face', false );
			} else {
				EngineCore.outputText( 'crushed against your chest', false );
			}
			EngineCore.outputText( ' was totally worth the bruise-inducing impact.  Edryn pivots about, her hooves clattering noisily against the room\'s floorboards until she\'s presenting her hind end to you.  Her tail lifts of its own accord and displays the swollen, black lips of her sex.  A potent glaze of centaur-fluid drips from the gash in a steady trickle, splattering over your ' + CoC.getInstance().player.feet() + ' as your equine lover closes in.\n\n', false );
			EngineCore.outputText( 'You tear off your ' + CoC.getInstance().player.armorName + ' in a flash, fully exposing your ', false );
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 'chosen ', false );
			}
			EngineCore.outputText( Descriptors.cockDescript( x ) + '.  It drips with anticipation, leaking drops of pre-cum with each inhalation of your mate\'s over-sexualized slit\'s scent.  Edryn looks over her shoulder to gauge the distance, but when she sees your state her face breaks into a happy smile.  She says, "<i>Steady now, we wouldn\'t want you to miss your target, would we?</i>" as her backside slowly descends, splattering hot sexual fluids over your length.\n\n', false );
			EngineCore.outputText( 'The centaur\'s gash devours your ' + Descriptors.cockDescript( x ) + ' with a long, wet slurping noise.  Her body-heat is much warmer than your own, wrapping slippery heat around every sensitive inch of your fuck-pole.  The flesh around you squeezes and massages instinctively.  It feels so good that it seems as if your ' + Descriptors.cockDescript( x ) + ' is going to melt under the onslaught of pleasure.  Edryn moans loudly and begins to pump her hips atop you, "<i>Oooh yes, thats perfeeeect...</i>"\n\n', false );
			EngineCore.outputText( 'Heavy thuds echo as hundreds of pounds of pregnancy-enhanced centaur backside are slammed into you over and over.  Were it not for the pillows absorbing some of the force, your pelvis would have been crushed with Edryn\'s first movement.  Her juices splatter with each rough fuck, soak your chest, and squirt up to your face.  You lie under her and moan, pumping back against her, but she doesn\'t even notice!  Her motions are backed up with more weight than your entire body, and her rough, pumping fuck only gets more and more intense.\n\n', false );
			EngineCore.outputText( 'You grab hold of her tail and pull yourself against her with all of your strength, slamming your body into her cunt as brutally as possible.  Your own orgasm is just a moment away, and Edryn\'s pleasured moans and whinnies reach an ecstatic crescendo.  Her cunt squeezes you tightly, the hot vice milking you hard, and forcing your climax on the spot.  It squeezes tightly at the base, then ripples pressure to the tip, drawing explosive bursts of cum from your sexually brutalized member.\n\n', false );
			EngineCore.outputText( 'Edryn sinks down, her whole body shaking and shuddering while milk fountains from her swollen breasts.  Her hands reach up to grab her nipples and tug on the milk-spouts.  They look longer now than before her pregnancy.  Her bloated milk-spouts are at least an inch or two long!  ', false );
			if( CoC.getInstance().player.cumQ() < 100 ) {
				EngineCore.outputText( 'Your ' + Descriptors.cockDescript( x ) + ' dumps the last of its seed into her hungry cunt and softens slightly.  Her warm cunt\'s constant milking motions continue, still pleasurable, but they prevent you from going soft until the centaur\'s orgasm has concluded.', false );
			} else if( CoC.getInstance().player.cumQ() < 500 ) {
				EngineCore.outputText( 'Your ' + Descriptors.cockDescript( x ) + ' spurts thick flows of seed into her hungry cunt, flooding her snatch with an abnormally large load of semen.  Her warm cunt\'s constant milking motions continue, forcing more and more of your spunk inside her until her own orgasm has concluded.', false );
			} else {
				EngineCore.outputText( 'Your ' + Descriptors.cockDescript( x ) + ' erupts, pouring a thick wave of seed into the centaur\'s hungry cunt.  The constant milking motions don\'t let up while Edryn\'s orgasm continues, helping you flood her with even more spooge.  Even after your pregnant lover\'s orgasm has concluded, your ' + Descriptors.cockDescript( x ) + ' keeps dumping more cum into her until it\'s soaking and dripping from her huge, furry ass.', false );
			}
			EngineCore.outputText( '\n\n', false );
			EngineCore.outputText( 'You give her over-sized ass a gentle squeeze, massaging it lightly while Edryn comes back down from the wonderful sex.  She looks back at you and pants, "<i>By Marae I needed that.</i>"\n\n', false );
			EngineCore.outputText( 'The centaur raises her back half up with a long wet \'schliiiiick\'.  You pop free with a gasp and are given a perfect view of your work.  Her pussy\'s lips are slightly parted and glazed with a coating of white fluid.  The black-lipped cunt continues to drool sticky, sexual slime, but the color has gotten a bit more opaque thanks to your contributions.  The smell of sex fills the room, making your ' + Descriptors.cockDescript( x ) + ' stiffen again.\n\n', false );
			EngineCore.outputText( 'Edryn leans against the wall, panting and looking back at you.  She gives an exhausted smirk but doesn\'t look like she could handle another round.  You start to shiver; without the warmth of her love-tunnel wrapped around you, the room seems that much colder.  Glancing over, you find your equipment and put it on.  It\'s difficult to dress with an audience\'s rapt attention, but you manage to pull it off.\n\n', false );
			EngineCore.outputText( 'After gathering your pouches, Edryn looks to have recovered.  She advances on you and wraps her arms around you, smashing your face squarely between her milk-filled tits.  You can smell the liquid dripping from her nipples.  It makes you happy to know your daughter will have such a bounty to feed on as she grows.  Edryn thanks you, "<i>That was wonderful dear.  I\'ll probably be horny and soaked again in a few minutes, so please, come back soon.  I\'m going to be a sopping wet mess until our child is born.</i>"', false );
		}
		//TAURZILLA;
		else {
			EngineCore.outputText( 'Edryn smiles at you as you close the door behind you.  She stretches and lays out on a large batch of pillows, using them to help support the added weight of her pregnancy.  Her hindquarters are facing towards you, and she twists back to give you a \'come-hither\' gesture.  You hesitantly climb down into the soft, padded mass with her and align your body behind hers.  Her position is perfect, and you wrap your arms around her \'human\' waist to drag your horse-half into position.  Edryn grabs your face and pulls you into a kiss, her archery-strengthened arms easily maintaining their grip as the two of you get settled into place.\n\n', false );
			EngineCore.outputText( 'You break the kiss and suck the bottom of her earlobe into your mouth, straining to keep your mouth steady as you pull your ' + Descriptors.cockDescript( x ) + ' into position with her needy sex.  The ' + CoC.getInstance().player.cockHead( x ) + ' slips into the hot folds, forcing a gasp from your lips that lets Edryn\'s earlobe escape its oral prison.  She smirks, then nibbles at your shoulder while you slide the rest of the way into her large, slippery channel.  It\'s a near perfect fit thanks to your similar body types, and the both of you sigh out whinnies of pleasure.\n\n', false );
			EngineCore.outputText( 'Edryn bites down harder, sending a jolt of pain through your shoulder.  Her hips wiggle against yours, and she begins rhythmically clenching and relaxing her entrance, squeezing you tightly ', false );
			if( !CoC.getInstance().player.hasSheath() ) {
				EngineCore.outputText( 'by the base', false );
			} else {
				EngineCore.outputText( 'just above your sheath', false );
			}
			EngineCore.outputText( '.  The horse half of your body arches, pulling your ' + Descriptors.cockDescript( x ) + ' partway out, then lurches back forward to bury it deep inside her.  The impact jiggles her flesh from her ass to her shoulders, and you feel it underneath you as an instinctual, barely thought sign of sexual dominance.\n\n', false );
			EngineCore.outputText( 'The centauress pulls back and moans, "<i>Oh gods yes, it feels so much better pregnant!  My pu-pu-ahhhh-ussy is so much WETTER.  It\'s like I\'ve got a faucet back there!  And I\'m soo-ohhhh sensitive!  Ung fuck ' + CoC.getInstance().player.mf( 'stud', 'dear' ) + ' don\'t stop.  Please don\'t stop!</i>"\n\n', false );
			EngineCore.outputText( 'You grunt from the force of your exertions and begin to fuck her a little more roughly.  Your arms squeeze tightly around her midsection with a mixture of affection and need as you fulfill her request.  You pound her swollen, dripping cunt with hard strokes that make your intertwined forms shiver, dislodging a few pillows.  Scrabbling noise fills the air.  Your hooves are scrambling for purchase, but there\'s no traction.  Lying sideways in the pillows with your pregnant lover prevents you from fucking quite as hard as your body would like.\n\n', false );
			EngineCore.outputText( 'Her slippery, silken tunnel feels wonderful as it contracts and squeezes your maleness with vice-like tightness.  Edryn\'s mouth hangs open, and as her eyes start to cross, you can feel the passage intensifying its muscular twitches.  She\'s on the brink of orgasm, but you aren\'t too far behind her.  You pull one arm up to her head and kiss her, running your tongue over her lips before sliding it inside to tangle with hers.  She undulates underneath you, convulsing as she reaches her peak.  Her juices erupt, splattering over your thighs', false );
			if( CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( ' and ' + Descriptors.ballsDescriptLight(), false );
			}
			EngineCore.outputText( '.  Her twat clutches you so tightly that you\'re immobilized for fear of hurting yourself, and the tight seal of her entrance acts as a cock-ring, actually bloating your ' + Descriptors.cockDescript( x ) + ' inside her.\n\n', false );
			EngineCore.outputText( 'Your ' + Descriptors.cockDescript( x ) + ' is milked from ', false );
			if( !CoC.getInstance().player.hasSheath() ) {
				EngineCore.outputText( 'base', false );
			} else {
				EngineCore.outputText( 'sheath', false );
			}
			EngineCore.outputText( ' to ' + CoC.getInstance().player.cockHead( x ) + ', culminating in a tight squeeze at the tip. Then it releases and starts all over again.  Instinctively, you whinny and explode inside the warm, soaking wet tunnel.  The french-kiss turns into a feverish slobber-fest while the two of you mate, lost to orgasm.', false );
			if( CoC.getInstance().player.cumQ() < 300 ) {
			} else if( CoC.getInstance().player.cumQ() < 1000 ) {
				EngineCore.outputText( 'Your prodigious jism output soaks her sloppy tunnel and drips from the entrance with the centauress\' girlcum.', false );
			} else {
				EngineCore.outputText( 'Your body\'s cum-production easily fills her channel to capacity.  Each successive spurt blasts a wave of fluid out from her overstuffed cunt, soaking the pillows, Edryn\'s ass, and your crotch.', false );
				if( CoC.getInstance().player.cumQ() >= 4000 ) {
					EngineCore.outputText( '  By the time you calm down you\'ve soaked all the pillows and spooge is puddling underneath.', false );
				}
			}
			EngineCore.outputText( '\n\n', false );
			EngineCore.outputText( 'Edryn breaks the kiss with a strand of spit hanging in the middle.  She giggles euphorically, "<i>Wow.  Ummm, wow!  That was nice!  Now get off me you ', false );
			if( CoC.getInstance().player.tallness > 74 ) {
				EngineCore.outputText( 'big ', false );
			}
			EngineCore.outputText( 'lug!</i>"  She playfully pushes you back and tries to drag herself out from under you.  You laugh with her and pull back, letting your softening ' + Appearance.cockNoun( CockTypesEnum.HUMAN ) + ' pull free from her cum-glazed twat.  It escapes with a wet squish, releasing a torrent of centaur cum from the unplugged opening.\n\n', false );
			EngineCore.outputText( 'After you both get a chance to stagger up to your feet and get dressed, Edryn thanks you, "<i>That was wonderful dear.  I\'ll probably be horny and dripping again in a few minutes, so please come back soon.  I think I\'m going to be a sopping wet mess until our child is born.</i>"\n\n', false );
		}
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'sen', -0.5 );
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
	};
	//EAT THE BITCH'S CUNT OUT;
	Edryn.prototype.jizzFromEatingPregdrynOut = function() {
		EngineCore.spriteSelect( 14 );
		EngineCore.outputText( '', true );
		var x = CoC.getInstance().player.cockThatFits( 300 );
		if( x < 0 ) {
			x = 0;
		}

		EngineCore.outputText( 'You shut the door behind you and rub your eyes, trying to adjust to the darkness in the room.  All the lights are out, save for a single candle on the far wall.  You peer about uselessly for a few seconds until inspiration strikes.  Her potent scent will lead you to her!  You lean down and start turning from side to side, sniffing about.  You hear a feminine giggle, though with the unfamiliar room you can\'t tell where it\'s originating from.  It\'s fairly easy to scent out your \'prey\', and you\'ve already determined from the strength of pussy-musk which corner of the room Edryn\'s in.\n\n', false );
		EngineCore.outputText( 'The smell is potent, sexual, and thoroughly inhuman.  You take a step closer and continue taking little sniffs, barely noticing as your ', false );
		if( CoC.getInstance().player.cockArea( x ) < 24 ) {
			EngineCore.outputText( 'small dick begins to twitch and leak.', false );
		} else {
			EngineCore.outputText( 'mammoth cock drags the ground, leaking pre-cum.', false );
		}
		EngineCore.outputText( '  The urge to find the juicy, potent pussy at the center of the musk-cloud overrides your thoughts.  Stalking forwards in a haze of desire, you take deeper and deeper breaths, inhaling ever-greater quantities of Edryn\'s heavenly scent.  You know you\'re almost there – you can hear her quiet breathing.\n\n', false );
		EngineCore.outputText( 'You\'re so lost in desperate need that your hurried steps get you in trouble.  Your ' + CoC.getInstance().player.foot() + ' catches on something, and you fall inexorably forwards.  In a panic, you windmill your arms.  One slaps into fur-covered flesh with a loud \'SLAP\', the other disappears into a mass of soft, yielding fabrics.  The pillows catch you, absorbing the fall, but your face splats directly into something warm, wet and aroused.  Edryn gasps and exclaims, "<i>No need to be so rough about it!  I thought you might like some hide and seek... your dick seemed to like it, and I needed a moment to catch my breath.  It\'s not easy carrying your child around!</i>"\n\n', false );
		EngineCore.outputText( 'Her words fall on deaf ears.  You push yourself up onto your elbows and lean forward, feeling strands of female lubricant hanging from your face as you inhale deep lungfuls of her scent.  ', false );
		if( CoC.getInstance().player.totalCocks() > 1 ) {
			EngineCore.outputText( 'Each of y', false );
		} else {
			EngineCore.outputText( 'Y', false );
		}
		EngineCore.outputText( 'our ' + Descriptors.multiCockDescriptLight() + ' ', false );
		if( CoC.getInstance().player.cumQ() < 100 ) {
			EngineCore.outputText( 'drips pre-cum onto the pillows.', false );
		} else if( CoC.getInstance().player.cumQ() < 500 ) {
			EngineCore.outputText( 'leaks pre-cum in a steady stream, quickly soaking a few pillows.', false );
		} else {
			EngineCore.outputText( 'pours out enough pre-cum to soak a pillow, and in no time your overenthusiastic dick is doing its damnedest to dribble over everything.', false );
		}
		EngineCore.outputText( '  It\'s a powerful smell.  The centaur\'s heady musk already has you on the edge, and you haven\'t even tasted her slit yet!  Your heart beats hard, as you grab onto her flanks with each hand and prepare to service your pregnant lover.\n\n', false );
		EngineCore.outputText( 'After being in the dark room for so long, your eyes have adjusted to the dim light.  Mere inches in front of you is Edryn\'s massive slit.  Its black folds are coated in a thick layer of slime that trails down to her bulbous clit, collecting before dripping off.  You lean forward, take a long, deep breath, and then smash your face into the gash.  Your tongue darts out, practically of its own accord, lapping at her inner folds and tasting the sweet, tangy nectar she drips.  The warmth is palpable, and the air is practically steaming with the heat of Edryn\'s desire as  you rub your face up and down the slit.  You lick and slurp at the slippery sweetness of her desire, but it never seems to be enough for you or your drooling ' + Descriptors.multiCockDescriptLight() + '.\n\n', false );
		EngineCore.outputText( 'Squirming and writhing, Edryn moans, "<i>Yessssss... right-ahhh-there.  Mmmm... I think you\'re hooked on my cunt, aren\'t you?</i>"  She stretches back to pat your head and coos, "<i>Yes that\'s a good ' + CoC.getInstance().player.mf( 'boy', 'girl' ) + ', lap it allll up.  Oh my, you\'re dripping like a sieve just from eating me out!  Oooh yeah, lower, lick my cliiiiit-yes yes-ooooh... Mmm I bet the smell is just overwhelming you isn\'t it?  Why don\'t you suckle my clit and take a quick breather.  I bet you\'ll be spurting helplessly in no time.</i>"\n\n', false );
		EngineCore.outputText( 'You tremble as you pull away, licking her lust from your lips and gasping for air as you shift to lick at her clit.', false );
		if( CoC.getInstance().player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
			EngineCore.outputText( '  Your hooves twitch weekly on the floor, forgetten about as you focus entirely on your hands, mouth, and pulsating ' + Appearance.cockNoun( CockTypesEnum.HUMAN ), false );
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 's', false );
			}
			EngineCore.outputText( '.', false );
		}
		EngineCore.outputText( '  Her button, like her pussy, is many sizes larger than a human\'s, and it\'s as big around as a golfball and several inches long.  You suck it into your lips and plunge a hand inside her slippery channel, fisting her while you suckle and bob on her clit.  Edryn whinnies and clenches around the invading fist.  Her cunt erupts and splatters your face with fluid, soaking you with her fragrant scent.\n\n', false );
		EngineCore.outputText( 'Startled from your sexual fog, you jerk back and gasp.  The smell – it\'s like sex distilled into orgasm and fired straight into your brain.  Your ' + Descriptors.hipDescript() + ' shake uncontrollably, spasming wildly as your scent-addled mind sets off a full-body orgasm.  ', false );
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'Your ' + Descriptors.vaginaDescript( 0 ) + ' contracts and spasms with the rest of you, ', false );
			if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_SLAVERING ) {
				EngineCore.outputText( 'squirting', false );
			} else {
				EngineCore.outputText( 'leaking', false );
			}
			EngineCore.outputText( ' in a pale imitation of Edryn\'s box.  ', false );
		}
		EngineCore.outputText( 'Cum begins to ooze from ', false );
		if( CoC.getInstance().player.totalCocks() > 1 ) {
			EngineCore.outputText( 'each of ', false );
		}
		EngineCore.outputText( 'your ' + Descriptors.multiCockDescriptLight() + ' in a steady stream.  Your urethra bulges and flexes, forcing you to waste your seed all over Edryn\'s pillows.', false );
		if( CoC.getInstance().player.cumQ() < 1000 ) {
			EngineCore.outputText( '  The flow gets thicker and thicker.  Edryn even remarks, "<i>Oh my, my baby\'s daddy is just full of cum!  Let it all out for me dear, you did such a good job on my clit that you deserve release.</i>" You squirt and dribble, breathing airborne orgasm and squirting ', false );
			if( CoC.getInstance().player.cumQ() < 3000 ) {
				EngineCore.outputText( 'out the last of your liquid pleasure.', false );
			} else {
				EngineCore.outputText( 'ever greater amounts of liquid peasure.  Jism drips through the floorboards as you create a puddle a few inches deep.', false );
			}
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'Edryn laughs and hauls you up to embrace a tight hug.  She whispers in your ear, "<i>Thank you for being so understanding.  I\'m not normally this... sensitive, or potent.  You can keep doing this while I\'m pregnant, but you\'ll need to fit me if you want any more sex after our child is born.</i>"\n\n', false );
		EngineCore.outputText( 'You nod and give her milk-dripping teat a squeeze.  A squirt of the white stuff escapes before Edryn pushes you away.  You chuckle and get dressed while she does the same, but before you can escape her room, she lifts her shirt, squeezes a teat, and catches you in the face with her milk.\n\n', false );
		EngineCore.outputText( '"<i>Turn-about is fair play!</i>" she exclaims. You leave, unable to dispute the logic.', false );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', 1, 'sen', 2 );
		EngineCore.doNext( SceneLib.camp.returnToCampUseOneHour );
	};
	Edryn.prototype.edrynPregChance = function() {
		//Get out if already pregged.;
		if( this.pregnancy.isPregnant ) {
			return;
		}

		//See if any of the scenarios get her preg;
		var preg = false;
		/*
		 //25% chance if 'stud';
		 if(CoC.getInstance().player.hasPerk('Marae\'s Gift - Stud') >= 0 && Utils.rand(4) === 0) {
		 preg = true;
		 }
		 //10% chance if elf xmas;
		 if(CoC.getInstance().player.hasPerk('Elven Bounty') >= 0 && Utils.rand(10) === 0) {
		 preg = true;
		 }*/
		//1% chance per 500mLs of cum, max 5%;
		var temp = CoC.getInstance().player.cumQ() / 500;
		if( temp > 5 ) {
			temp = 5;
		}
		temp += CoC.getInstance().player.virilityQ() * 200;
		$log.debug( 'Edryn Preg Check Virility Score: ' + temp );
		if( CoC.getInstance().player.cumQ() > 250 && temp >= Utils.rand( 100 ) ) {
			preg = true;
			$log.debug( 'Edryn knocked up!' );
		} else {
			$log.debug( 'Edryn not knocked up!' );
		}
		if( preg ) {
			this.pregnancy.knockUpForce( PregnancyStore.PREGNANCY_PLAYER, PregnancyStore.INCUBATION_CENTAUR + 80 );
			CoC.getInstance().flags[ kFLAGS.EDRYN_PREGNANT_AND_NOT_TOLD_PC_YET ] = 0;
		}
	};

	//Male PC + Edryn, preferred at camp with preggo variance + bonus if some BJ, scent-induced rut;
	//have the Scene taking place in Tel'Adre instead of the PC's Camp.;
	//Cunt tastes tangy and sweat.;
	//Cunt is warmer than human;
	//Strong pussy that can squeeze tight enough to hold you still.;
	//During orgasm contracts into cock-milking rings that happen so fast and so frequently you can't even track them;
	//Intro:;
	Edryn.prototype.edrynFucktroduction = function() {
		EngineCore.clearOutput();
		EngineCore.spriteSelect( 14 );
		EngineCore.outputText( '', true );
		var x = CoC.getInstance().player.cockThatFits( 300 );
		if( x < 0 ) {
			x = 0;
		}
		var cost = 0;
		switch( CoC.getInstance().player.statusAffectv1( StatusAffects.Edryn ) ) {
			case 0:
				cost = 200;
				break;
			case 1:
				cost = 100;
				break;
			case 2:
				cost = 50;
				break;
			case 3:
				cost = 25;
				break;
			case 4:
				cost = 0;
				break;
			default:
				cost = 0;
				break;
		}
		if( !CoC.getInstance().player.isTaur() ) {
			if( cost > 0 ) {
				EngineCore.outputText( 'Coins exchange hands and her arm finds its way back inside your ' + CoC.getInstance().player.armorName + ', pulling you towards a back room.  A round of chuckles chases you through the bar room until they\'re silenced by the heavy thud of a door closing behind you.  You\'re pushed against the wall hard enough to make your teeth click.  The stars gradually clear from your view, revealing a massive gash, drooling with clear feminine slime.  The scent assails you, ', false );
			} else if( CoC.getInstance().flags[ kFLAGS.EDRYN_NUMBER_OF_KIDS ] === 0 ) {
				EngineCore.outputText( 'Her arm finds its way back inside your ' + CoC.getInstance().player.armorName + ', pulling you towards a back room.  A round of chuckles chases you through the bar room until they\'re silenced by the heavy thud of a door closing behind you.  You\'re pushed against the wall hard enough to make your teeth click.  The stars gradually clear from your view, revealing a massive gash, drooling with clear feminine slime.  The scent assails you, ', false );
			} else {
				EngineCore.outputText( 'A round of chuckles chases you through the bar room until they\'re silenced by the heavy thud of a door closing behind you.  You\'re pushed against the wall hard enough to make your teeth click.  The stars gradually clear from your view, revealing a massive gash, drooling with clear feminine slime.  The scent assails you, ', false );
			}
			if( CoC.getInstance().player.cocks[ 0 ].cockType === CockTypesEnum.HORSE ) {
				EngineCore.outputText( 'making your ' + Descriptors.cockDescript( x ) + ' twitch and ache.  It floods your body with animalistic desires, overpowering any sense of propriety you might have once had.', false );
			} else {
				EngineCore.outputText( 'overpowering you with strange lust.  As turned on as you are, it\'s difficult not to enjoy this.', false );
			}
		}
		//TAUR;
		else {
			if( cost > 0 ) {
				EngineCore.outputText( 'Coins exchange hands and she grabs you, pulling you back towards a darkened doorway in the rear of the bar.  A round of chuckles chases you through the bar room until they\'re silenced by the heavy thud of a door closing behind you.  Edryn turns away from you, exposing her massive gash, drooling with clear feminine slime.  The scent assails you, ', false );
			} else {
				EngineCore.outputText( 'She grabs you, pulling you back towards a darkened doorway in the rear of the bar.  A round of chuckles chases you through the bar room until they\'re silenced by the heavy thud of a door closing behind you.  Edryn turns away from you, exposing her massive gash, drooling with clear feminine slime.  The scent assails you, ', false );
			}
			if( CoC.getInstance().player.cocks[ 0 ].cockType === CockTypesEnum.HORSE ) {
				EngineCore.outputText( 'making your ' + Descriptors.cockDescript( x ) + ' twitch and ache.  It floods your body with animalistic desires, overpowering any sense of propriety you might have once had.', false );
			} else {
				EngineCore.outputText( 'overpowering you with strange lust.  As turned on as you are, it\'s difficult not to enjoy this.', false );
			}
		}
		//NEW;
		EngineCore.outputText( '\n\nHow will you have her?  You could fuck her.  Or, you could eat her out until you\'re going crazy with sexual need and completely lose control.' );
		//[Fuck] [Eat Her Out];
		EngineCore.menu();
		EngineCore.addButton( 1, 'Eat Her Out', this.eatEdrynPussyLikeABawss );
		if( CoC.getInstance().player.isTaur() ) {
			EngineCore.addButton( 0, 'Fuck', this.fuckEdrynTaur );
		} else {
			EngineCore.addButton( 0, 'Fuck', this.fuckEdrynNonTaur );
		}
	};
	//Eat Her Out Till Shit Goes Crazy;
	Edryn.prototype.eatEdrynPussyLikeABawss = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( ImageManager.showImage( 'edryn-eat-her-out' ) );
		var x = CoC.getInstance().player.cockThatFits( 300 );
		if( x < 0 ) {
			x = CoC.getInstance().player.smallestCockIndex();
		}
		var y = CoC.getInstance().player.cockThatFits2( 300 );
		EngineCore.outputText( 'Edryn starts to say something, but you strip out of your [armor] before she gets more than a half-dozen words out, your ' + Descriptors.multiCockDescriptLight() + ' jutting proud and erect, leaking clear streams of pre-cum down ' );
		if( CoC.getInstance().player.cockTotal() === 1 ) {
			EngineCore.outputText( 'its underside' );
		} else {
			EngineCore.outputText( 'their underside' );
		}
		EngineCore.outputText( '.  You smile mirthfully when you realize Edryn is actually blushing, and beet red at that!  Her hindlegs prance nervously around as she studies you over her shoulder, and her tail won\'t stop the steady back-and-forth swish that sends more of the boner-fueling musk towards your nose.' );
		if( this.pregnancy.isPregnant ) {
			EngineCore.outputText( '  You can tell that since she\'s gotten pregnant her pheromones have become more potent, but that\'s little more than a dim note on a forgotten chalkboard to your brain.  It\'s impossible to think about measuring the potency of anything that isn\'t your own tool in such a swelteringly hot atmosphere.' );
		} else {
			EngineCore.outputText( '  You note that the smell seems more powerful in an enclosed space, but that\'s little more than a dim note on a forgotten chalkboard to your brain.  It\'s nigh-impossible to think about anything but plunging yourself [sheath] deep inside her when exposed to her scent this strongly.' );
		}

		EngineCore.outputText( '\n\n"<i>Are you going to fuck me, or just stare at my pussy all day?</i>" the blushing centaur teases as she takes mincing steps towards you, back end first.  "<i>I\'m okay with either, provided you let me grind it on you until I\'m satisfied.</i>"' );
		EngineCore.outputText( '\n\nSmirking, you tell her that while you do intend to bury yourself in her massive, swollen gash, you don\'t intend to be a spectator in these sexual proceedings.  Her pussy better be ready for a thick creampie, because you\'re going to drink in her aroma until you can\'t help but pound her raw.  The slutty centauress raises an eyebrow at that suggestion, but you can see a ' );
		if( CoC.getInstance().flags[ kFLAGS.TIMES_EATEN_EDRYN_PUSSY_RUT ] === 0 ) {
			EngineCore.outputText( 'smile tugging at the corners of her mouth at your bravado' );
		} else {
			EngineCore.outputText( 'lecherous grin spreading across her face as she remembers the last time you did this' );
		}
		EngineCore.outputText( '.' );
		EngineCore.outputText( '\n\nEdryn trots closer and says, "<i>Then you\'d best eat up hon, \'cause I got you a four course meal.</i>"  Her swollen pussy is just inches away from you now.  The black lips part slightly before you, winking slowly as moisture begins to run from the bestial entrance, visibly fogging the air before you.  A web of girlish goo hangs across the slightly-spread entrance, and after one last inhalation of her almost sweet scent, you dive on in.  Your nose is the first casualty of your aggressive war on centaur-cunt, slurped down by the hungry folds as soon as you\'re pushing up against them.  You keep pushing until your mouth has slipped through the moist, sticky veil that hangs across her vagina, kissing her fat-lipped horse-pussy with gusto while you let your tongue slither out to play.' );
		EngineCore.outputText( '\n\nAt the first lick, Edryn gets palpably wetter.  Sloppy juice washes out from inside her, covering your cheeks and chin before dripping off onto your [chest], leaving you marked with her feminine odor.  ' );
		if( CoC.getInstance().player.tongueType > AppearanceDefs.TONUGE_HUMAN ) {
			EngineCore.outputText( 'She\'s not even begun to taste the fruits of your talents, and you let your long, long tongue spool out inside her, pressing hard on her walls and tenderly flicking across each sensitive fold inside her.  ' );
		}
		EngineCore.outputText( 'The busty, animalistic woman moans unashamedly, hands going to her breasts to squeeze them, her clit filling up to its full size.  You can feel the sensitive nodule plump up against the top of your mouth, so you open wide enough to give it a quick suck before returning to polishing her innards.  After that the equine pleasure-buzzer gets rock-hard and continues to bulge meaningfully against you, pulsing hotly in your mouth.' );
		EngineCore.outputText( '\n\nYou sway dizzily on your [feet] as you try to focus on just basking in her pussy\'s delicious... potent... sexy aroma.  [EachCock] is lifting needily with every passing second.  ' );
		if( CoC.getInstance().player.cockTotal() === 1 ) {
			EngineCore.outputText( 'It\'s' );
		} else {
			EngineCore.outputText( 'They\'re' );
		}
		EngineCore.outputText( ' so full that your hardness becomes almost painful, and each twitch of your girthy length makes you wish that you could just nestle it inside her - anything to assuage the hurtful levels of desire that have arisen within you.  Breathlessly, you pull back for a gulp of air.  It\'s so full of Edryn\'s scent that it\'s almost choking in strength, so sweet and wet... and utterly feminine.  You put a hand against the wall as you try to stay upright, whimpering with animalistic desire, so perfectly rigid and ready for a cunt.' );
		EngineCore.outputText( '\n\nSmashing right back into her sweet puss, you pull her rubbery horse-lips apart and begin a fresh assault on her pussy.  You\'re munching on her box like a wild' + CoC.getInstance().player.mf( 'man', 'woman' ) + ', utterly without concern for anything beyond your own rapacious and half-forgotten desire to lick her again and again.  She\'s a wet, ready mare, and you\'re a male' );
		if( CoC.getInstance().player.gender !== 1 ) {
			EngineCore.outputText( ', or close enough to it' );
		}
		EngineCore.outputText( '.  A red, lusty haze has started to cling to the edges of your vision even when your eyes are closed, and you swear you can see the outline of her immense, onyx twat through your eyelids.' );
		EngineCore.outputText( '\n\nEdryn abruptly whinnies, and her cunt spasms on your tongue, clenching down with incredible, muscular tightness.  Rings of convulsing muscle run all over it, pulling from her entrance towards what can only be her womb, and as she splatters your face with her musky juices, all you can think about is how wonderful it would feel to have it doing that to your ' + Descriptors.cockDescript( x ) + '.  You lap at the tangy fruit of your labor as a wave of it is washed over your head, drinking as much of her lady-spunk as your throat will allow, so fixated on cunt your brain can do nothing but dumbly force you harder against it, even though it isn\'t your dick doing the penetrating.  You\'ve fallen into a thought-crushing rut, one that\'s steadily erasing every other concern from your consciousness.' );
		EngineCore.outputText( '\n\nEdryn trots away on wobbly legs after her long, wet cum finally finishes, saying, "<i>Mmm, that WAS a good cum, but I thought you were going to-URK!</i>"  She grunts as you slam your ' + Descriptors.cockDescript( x ) + ' straight into her cunt' );
		if( y >= 0 ) {
			EngineCore.outputText( ' and your ' + Descriptors.cockDescript( y ) + ' into her asshole' );
		}
		EngineCore.outputText( '.  Her ' );
		if( this.pregnancy.isPregnant ) {
			EngineCore.outputText( 'milky tits, swollen from her pregnancy,' );
		} else {
			EngineCore.outputText( 'big tits' );
		}
		EngineCore.outputText( ' bounce around ludicrously, their owner too insensate from your forceful insertion to attempt to restrain them' );
		if( this.pregnancy.isPregnant ) {
			EngineCore.outputText( ' as they drip milk everywhere' );
		}
		EngineCore.outputText( '.  You grab hold of her gigantic, equine ass with one hand and her exotic tail with the other and push harder against her until her slick, welcoming moisture is wrapped around you on all sides' );
		if( y >= 0 ) {
			EngineCore.outputText( ' and clenching tightness is wreathing your other erection' );
		}
		EngineCore.outputText( '.  You growl savagely as you feel her inhuman warmth squeezing from all sides.  Flexing tightly, the myriad strong muscles that make up the girl\'s horse-like hindquarters all compress around you at once, utterly immobilizing you.' );
		EngineCore.outputText( '\n\nYou whine piteously - the need to fuck and breed her is overwhelming, but to move now only invites pain.  Edryn chuckles, "<i>Baby, you can\'t surprise a girl like that.  Now, don\'t go too crazy, and I\'ll let you go, okay?</i>"  You lean across her furry back, soaking up her warmth as you nod into her muscular animal-half.  Yes, anything... anything to fuck her again.  "<i>Okay then.</i>"' );
		EngineCore.outputText( '\n\nLike magic, the crushing pressure is gone, and you\'re free to plumb her depths with wanton abandon.  You groan throatily as you begin to hump her again, this time taking it slow enough not to rouse her ire, your hands wrapping halfway around her ' );
		if( this.pregnancy.isPregnant ) {
			EngineCore.outputText( 'baby-filled ' );
		}
		EngineCore.outputText( 'middle for support, [legs] dangling slightly above the ground as you twist to ram your [cocks]' );
		EngineCore.outputText( ' inside.  Slurps and squishes echo through the small room while you work Edryn\'s gushing, well-lubed gash.  Moaning excitedly, the horse-girl is starting to get into it, and you gradually pick up your tempo until your [hips] are clapping wetly against her soaked haunches.  She whickers and glances back over her shoulder, blushing so red you briefly wonder if you\'re fucking a demoness.' );
		EngineCore.outputText( '\n\nWithout warning, her cunt abruptly squeezes down again, not as hard as before, but enough to cause you a modicum of pain as you saw through her drizzling nethers.  The \'splat-splat-splat\' of her lusty moisture falling grows ever louder as you plow through her glittering gates.  She\'s getting wetter and wetter, soaked with girl-cum.  Her secretions combine with the increased tightness to overwhelm your endurance, and with her high body temperature, it feels like your dick is little more than a wax candle, melting into a puddle of white, orgasmic goo.' );
		EngineCore.outputText( '\n\nArching your back, you allow the palpable relief to wash through you, bubbling lust pumping out from your [balls] to flood the poor centaur\'s slippery, equine slit.  You ejaculate with forceful lurches of your [hips], matching each rope of creamy jism by burying your ' + Descriptors.cockDescript( x ) );
		if( y >= 0 ) {
			EngineCore.outputText( ' and ' + Descriptors.cockDescript( y ) );
		}
		EngineCore.outputText( ' to the' );
		if( y >= 0 ) {
			EngineCore.outputText( 'ir' );
		}
		EngineCore.outputText( ' hilt' );
		if( y >= 0 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( '.  The blissful relief that washes through you obliterates conscious thought and replaces it with creamy, placid warmth, causing your eyelids to droop heavily and your tongue to hang limply from your mouth while you pump the squirming centaur full of sperm.  You feel like a happy, bottomless well of semen, with immense, untapped reserves still left to dispense.  Clearly, your rutting body has gone into overdrive, and before long Edryn\'s ebony cunt is drizzling white cream onto the ground.' );
		if( !this.pregnancy.isPregnant ) {
			EngineCore.outputText( '  Her empty womb takes in the spermy deposits with aplomb, though you start to worry when you feel her sides bulge out thanks to her stretching middle.  Edryn\'s legs give out, and her pussy starts to constrict tighter, squeezing into concentric rings that move from her entrance towards her cervix, squeezing hot loads straight into that well-creamed womb.  You keep bouncing on her ass as best you can, too pleasured to care, not stopping until your dick goes dry and the jism is soaking Edryn\'s entire back half.' );
			if( y >= 0 ) {
				EngineCore.outputText( '  Her ass is in a similar state.  It\'s so pressurized with jizz that it squirts out of her with each contraction.' );
			}
		} else {
			EngineCore.outputText( '  With her womb plugged with your offspring, the spermy deposits have nowhere to go.  Even when Edryn\'s cunt squeezes down into a series of concentric rings, all tugging your cum towards her cervix, there\'s nowhere for it to go, and it washes out around you, wasted.  The horse-girl\'s ass-half is soaked with the stuff, alabaster with cum and musky horse-jizz.' );
			if( y >= 0 ) {
				EngineCore.outputText( '  Her butthole gets a similar treatment, filled enough that it\'s squirting your jizz back out with each contraction the centauress makes.' );
			}
			EngineCore.outputText( '  Even after all that, she milks you until you\'re completely dry, and then some.' );
		}
		EngineCore.outputText( '\n\nYou slump down upon her fuzzy back as Edryn rolls sideways onto some nearby cushions, lewdly moaning as her eyes flutter closed, drifting into an exhausted slumber.  Dipping down into closure, your eyelids decide that you should join her.  Her pheromones are still heavy in the air, however, and even in slumber, you feel your [balls] refill and your [hips] begin to pump your cock through that slippery channel once more.' );
		EngineCore.outputText( '\n\n\'<b>Squish-squish-squish-squish-</b>\' can be heard for several hours by anyone lucky enough to hold their ear to the door.' );
		//[Next];
		EngineCore.menu();
		EngineCore.addButton( 0, 'Next', this.postEdrynEatOutRut );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', 0.25, 'sen', -3 );
	};
	Edryn.prototype.postEdrynEatOutRut = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'When Edryn and you wake, your genitals are so sore and sensitive that getting cleaned up is almost painful.  The centauress even goes so far as to comment that she\'ll have to pay someone to mop up the mess, but there\'s a proud twinkle in her eye.  Somehow, your [armor] got splattered with vaginal juices during the sexcapade, and as you put them back on, [eachCock] regains its familiar hardness.  You chew on your lower lip as you slip out after saying goodbye, rock-hard and smelling totally of Edryn\'s lust.  A limited applause goes up at your departure, mixed with hooting and catcalls.  What a fuck!' );
		EngineCore.hideUpDown();
		EngineCore.dynStats( 'lus', 20 + CoC.getInstance().player.lib / 5 );
		this.edrynPregChance();
		this.edrynPregChance();
		this.edrynPregChance();
		CoC.getInstance().flags[ kFLAGS.TIMES_EATEN_EDRYN_PUSSY_RUT ]++;
		EngineCore.doNext( SceneLib.camp.returnToCampUseFourHours );
	};
	SceneLib.registerScene( 'edryn', new Edryn() );
} );