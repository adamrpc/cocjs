'use strict';

angular.module( 'cocjs' ).factory( 'PlayerEvents', function(MainView, SceneLib, $rootScope, $log, CoC, PerkLib, kFLAGS, AppearanceDefs, EngineCore, StatusAffects, Descriptors, EventParser, Utils, PregnancyStore, CockTypesEnum ) {
	//Handles all timeChange events for the player. Needed because player is not unique.
	function PlayerEvents() {
		var that = this;
		$rootScope.$on( 'time-change', function() {
			that.timeChange();
		});
		$rootScope.$on( 'time-change-large', function() {
			that.timeChangeLarge();
		});
		this.checkedTurkey = 0; //Make sure we test each of these events just once in timeChangeLarge
		this.checkedDream = 0;
	}
	//Implementation of TimeAwareInterface
	PlayerEvents.prototype.timeChange = function() {
		var needNext = false;
		this.checkedTurkey = 0;
		this.checkedDream = 0;
		if( CoC.player.cumMultiplier > 19999 ) {
			CoC.player.cumMultiplier = 19999;
		}
		if( CoC.player.ballSize > 400 ) {
			CoC.player.ballSize = 400;
		}
		if( CoC.player.findPerk( PerkLib.StrongBack ) && !CoC.player.itemSlot4.unlocked ) {
			CoC.player.itemSlot4.unlocked = true;
		}
		if( CoC.player.findPerk( PerkLib.StrongBack2 ) && !CoC.player.itemSlot5.unlocked ) {
			CoC.player.itemSlot5.unlocked = true;
		}
		if( CoC.flags[ kFLAGS.SOCK_COUNTER ] > 0 ) {
			CoC.flags[ kFLAGS.SOCK_COUNTER ]--;
			if( CoC.flags[ kFLAGS.SOCK_COUNTER ] < 0 ) {
				CoC.flags[ kFLAGS.SOCK_COUNTER ] = 0;
			}
			if( CoC.flags[ kFLAGS.SOCK_COUNTER ] > 24 ) {
				CoC.flags[ kFLAGS.SOCK_COUNTER ] = 24;
			}
		}
		CoC.player.hoursSinceCum++;
		//Super cumbuilding activate!
		if( CoC.player.findPerk( PerkLib.MaraesGiftProfractory ) ) {
			CoC.player.hoursSinceCum += 2;
		}
		if( CoC.player.findPerk( PerkLib.FerasBoonAlpha ) ) {
			CoC.player.hoursSinceCum += 2;
		}
		//Normal
		if( !CoC.player.findPerk( PerkLib.WellAdjusted ) ) {
			EngineCore.dynStats( 'lus', CoC.player.lib * 0.04, 'resisted', false ); //Raise lust
			if( CoC.player.findPerk( PerkLib.Lusty ) ) {
				EngineCore.dynStats( 'lus', CoC.player.lib * 0.02, 'resisted', false );
			} //Double lust rise if lusty.
		} else { //Well adjusted perk
			EngineCore.dynStats( 'lus', CoC.player.lib * 0.02 ); //Raise lust
			if( CoC.player.findPerk( PerkLib.Lusty ) ) {
				EngineCore.dynStats( 'lus', CoC.player.lib * 0.01, 'resisted', false );
			} //Double lust rise if lusty.
		}
		if( CoC.player.tailType === AppearanceDefs.TAIL_TYPE_BEE_ABDOMEN || CoC.player.tailType === AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN ) { //Spider and Bee Sting Recharge
			if( CoC.player.tailRecharge < 5 ) {
				CoC.player.tailRecharge = 5;
			}
			CoC.player.tailVenom += CoC.player.tailRecharge;
			if( CoC.player.tailVenom > 100 ) {
				CoC.player.tailVenom = 100;
			}
		}
		if( CoC.player.tailType === AppearanceDefs.TAIL_TYPE_CAT && CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CAT && CoC.player.earType === AppearanceDefs.EARS_CAT ) { //Check for gain of cat agility - requires legs, tail, and ears
			if( !CoC.player.findPerk( PerkLib.Flexibility ) ) {
				MainView.outputText( '\nWhile stretching, you notice that you\'re much more flexible than you were before.  Perhaps this will make it a bit easier to dodge attacks in battle?\n\n(<b>Gained Perk)\n' );
				CoC.player.createPerk( PerkLib.Flexibility, 0, 0, 0, 0 );
				needNext = true;
			}
		} else if( CoC.player.findPerk( PerkLib.Flexibility ) ) { //Remove flexibility perk if not meeting requirements
			MainView.outputText( '\nYou notice that you aren\'t as flexible as you were when you had a more feline body.  It\'ll probably be harder to avoid your enemies\' attacks now.\n\n(<b>Lost Perk)\n' );
			CoC.player.removePerk( PerkLib.Flexibility );
			needNext = true;
		}
		if( CoC.flags[ kFLAGS.FOX_BAD_END_WARNING ] === 1 ) {
			if( CoC.player.faceType !== AppearanceDefs.FACE_FOX || CoC.player.tailType !== AppearanceDefs.TAIL_TYPE_FOX || CoC.player.earType !== AppearanceDefs.EARS_FOX || CoC.player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_FOX || CoC.player.skinType !== AppearanceDefs.SKIN_TYPE_FUR ) {
				CoC.flags[ kFLAGS.FOX_BAD_END_WARNING ] = 0;
			}
		}
		if( CoC.player.findPerk( PerkLib.EnlightenedNinetails ) || CoC.player.findPerk( PerkLib.CorruptedNinetails ) ) { //Check ninetails perks!
			if( CoC.player.tailType !== AppearanceDefs.TAIL_TYPE_FOX || CoC.player.tailVenom < 9 ) {
				MainView.outputText( '\n<b>Without your tails, the magic power they once granted withers and dies, vanishing completely.</b>\n' );
				CoC.player.removePerk( PerkLib.EnlightenedNinetails );
				CoC.player.removePerk( PerkLib.CorruptedNinetails );
				needNext = true;
			}
		}
		if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_HARPY && CoC.player.tailType === AppearanceDefs.TAIL_TYPE_HARPY && CoC.player.findPerk( PerkLib.HarpyWomb ) ) { //Make eggs big if harpied!
			if( CoC.player.findStatusAffect( StatusAffects.Eggs ) && CoC.player.statusAffectv2( StatusAffects.Eggs ) === 0 ) {
				CoC.player.changeStatusValue( StatusAffects.Eggs, 2, 1 );
				MainView.outputText( '\n<b>A familiar, motherly rumble lets you know that your harpy-like womb is growing your eggs nice and large.</b>\n' );
				needNext = true;
			}
		}
		if( CoC.player.hasCock() && CoC.player.cocks[ 0 ].cockType === CockTypesEnum.BEE ) { //All the hourly bee cock checks except the 'seek out the bee girl' check. That's in timeChangeLarge
			MainView.outputText( '\n' );
			if( CoC.player.cocks.length > 1 ) {
				MainView.outputText( 'You feel a stickiness and some stinging from your cocks.  It seems your bee cock has absorbed your new addition, leaving no trace of it.\n' );
				while( CoC.player.cocks.length > 1 ) {
					CoC.player.removeCock( 1, 1 );
				}
			}
			if( CoC.player.cocks[ 0 ].cockLength < 25 || CoC.player.cocks[ 0 ].cockThickness < 4 ) {
				MainView.outputText( 'Your ' + CoC.player.cockDescript( 0 ) + ' quivers for a moment before growing slightly ' );
				if( CoC.player.cocks[ 0 ].cockLength < 25 && CoC.player.cocks[ 0 ].cockThickness < 4 ) {
					MainView.outputText( 'longer and thicker' );
				} else {
					MainView.outputText( CoC.player.cocks[ 0 ].cockLength < 25 ? 'longer again' : 'wider again' );
				}
				MainView.outputText( ', a bit of pain passing through you at the same time.  It looks like your bee cock won’t get any smaller.\n' );
				CoC.player.cocks[ 0 ].cockLength = Math.max( CoC.player.cocks[ 0 ].cockLength, 25 );
				CoC.player.cocks[ 0 ].cockThickness = Math.max( CoC.player.cocks[ 0 ].cockThickness, 4 );
			}
			MainView.outputText( 'The desire to find the bee girl that gave you this cursed ' + CoC.player.cockDescript( 0 ) + ' and have her spread honey all over it grows with each passing minute\n' );
			EngineCore.dynStats( 'lust', 10 ); //Always gain 10 lust each hour
			needNext = true;
		}
		if( !CoC.player.hasVagina() && CoC.player.findPerk( PerkLib.Diapause ) ) { //Lose diapause
			MainView.outputText( '\n<b>With the loss of your womb, you lose your kangaroo-like diapause ability.</b>\n' );
			CoC.player.removePerk( PerkLib.Diapause );
			needNext = true;
		}
		if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_NAGA ) {
			if( CoC.player.tailType > AppearanceDefs.TAIL_TYPE_NONE ) {
				MainView.outputText( '\nYour tail squirms, wriggling against your larger naga tail as the scales part around it, absorbing it.  <b>Your form is completely scaly and smooth from the waist down.</b>\n' );
				CoC.player.tailType = AppearanceDefs.TAIL_TYPE_NONE;
				needNext = true;
			}
		}
		if( CoC.player.findPerk( PerkLib.WetPussy ) && CoC.player.hasVagina() ) {
			if( CoC.player.vaginas[ 0 ].vaginalWetness < AppearanceDefs.VAGINA_WETNESS_WET ) {
				MainView.outputText( '\n<b>Your ' + CoC.player.vaginaDescript( 0 ) + ' returns to its normal, wet state.</b>\n' );
				CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_WET;
				needNext = true;
			}
		}
		if( CoC.player.findPerk( PerkLib.MaraesGiftButtslut ) && CoC.player.ass.analWetness < 2 ) { //Prevent Buttsluts from getting dry backdoors
			MainView.outputText( '\n<b>Your ' + Descriptors.assholeDescript() + ' quickly re-moistens.  It looks like Marae\'s \'gift\' can\'t be removed.</b>\n' );
			CoC.player.ass.analWetness = 2;
			needNext = true;
		}
		if( CoC.player.pregnancyIncubation <= 0 && CoC.player.pregnancyType === PregnancyStore.PREGNANCY_OVIELIXIR_EGGS ) { //Fixing Egg Preg Preglocked Glitch
			CoC.player.knockUpForce(); //Clear Pregnancy
		}
		if( CoC.player.findStatusAffect( StatusAffects.Uniball ) && CoC.player.ballSize > 1 && CoC.player.balls > 0 ) { //Testicles Normalise feel a deep sensation of release around your genitals.  You sigh with relief and contentment as your testicles drop downwards and bloom outwards, heat throbbing within them as they split and form a proper ballsack.\n');
			CoC.player.removeStatusAffect( StatusAffects.Uniball );
			needNext = true;
		}
		if( !CoC.player.findPerk( PerkLib.Androgyny ) ) { //Fix femininity ratings if out of whack!
			var textHolder = CoC.player.fixFemininity();
			if( textHolder !== '' ) {
				MainView.outputText( textHolder, false );
				needNext = true;
			}
		}
		if( CoC.player.findStatusAffect( StatusAffects.LustStickApplied ) ) { //Lust stick!
			CoC.player.addStatusValue( StatusAffects.LustStickApplied, 1, -1 ); //Decrement!
			if( CoC.player.statusAffectv1( StatusAffects.LustStickApplied ) <= 0 ) {
				CoC.player.removeStatusAffect( StatusAffects.LustStickApplied );
				MainView.outputText( '<b>\nYour drugged lipstick fades away, leaving only the faintest residue on your lips.  You\'ll have to put on more if you want to be able to kiss your foes into submission!</b>\n' );
			}
		}
		if( CoC.player.findStatusAffect( StatusAffects.Luststick ) ) { //Luststic countdown
			CoC.player.addStatusValue( StatusAffects.Luststick, 1, -1 );
			if( Utils.rand( 2 ) === 0 && CoC.player.hasCock() ) { //50% chance to lust spike
				//Display if haven't displayed
				if( CoC.flags[ kFLAGS.PC_CURRENTLY_LUSTSTICK_AFFECTED ] === 0 ) {
					MainView.outputText( '\nYour body tingles, practically a slave to the effects of harpy lipstick.  Blood surges to ' + CoC.player.sMultiCockDesc() + ', making you groan out loud with forced pleasure.  Unasked-for fantasies assault you, and you spend a few moments fantasizing about fucking feathery women before you come to your senses.\n' );
					CoC.flags[ kFLAGS.PC_CURRENTLY_LUSTSTICK_AFFECTED ]++;
					needNext = true;
				}
				EngineCore.dynStats( 'lus', 0.1 );
				CoC.player.lust += 20;
				if( CoC.player.lust > 100 ) {
					CoC.player.lust = 100;
				}
			}
			if( CoC.player.statusAffectv1( StatusAffects.Luststick ) <= 0 ) {
				CoC.player.removeStatusAffect( StatusAffects.Luststick );
				MainView.outputText( '\n<b>The lust-increasing effects of harpy lipstick have worn off!\n</b>' );
				needNext = true;
			}
		}
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00285 ] >= 50 && !CoC.player.findPerk( PerkLib.LuststickAdapted ) ) { //Luststick resistance unlock
			SceneLib.sophieBimbo.unlockResistance();
			if( CoC.player.findStatusAffect( StatusAffects.Luststick ) ) {
				CoC.player.removeStatusAffect( StatusAffects.Luststick );
			}
			needNext = true;
		}
		if( CoC.flags[ kFLAGS.DICK_EGG_INCUBATION ] > 0 ) {
			CoC.flags[ kFLAGS.DICK_EGG_INCUBATION ]--;
			$log.debug( 'DICK BIRTH TIMER:' + CoC.flags[ kFLAGS.DICK_EGG_INCUBATION ] );
			if( CoC.flags[ kFLAGS.DICK_EGG_INCUBATION ] === 1 ) {
				SceneLib.masturbation.birthBeeEggsOutYourWang();
				needNext = true;
			}
		}
		if( CoC.player.findStatusAffect( StatusAffects.Eggchest ) ) { //Eggs in tits!
			CoC.player.addStatusValue( StatusAffects.Eggchest, 1, -1 );
			if( CoC.player.statusAffectv1( StatusAffects.Eggchest ) <= 0 ) {
				MainView.outputText( '\n<b>You feel the rounded eggs within your [fullChest] vanishing, absorbed into your body.  </b>' );
				CoC.player.growTits( CoC.player.statusAffectv2( StatusAffects.Eggchest ), CoC.player.bRows(), true, 2 );
				MainView.outputText( '\n' );
				CoC.player.removeStatusAffect( StatusAffects.Eggchest );
				needNext = true;
			}
		}
		if( CoC.player.findPerk( PerkLib.SpiderOvipositor ) || CoC.player.findPerk( PerkLib.BeeOvipositor ) ) { //Spider and Bee ovipositor updates
			if( CoC.player.findPerk( PerkLib.SpiderOvipositor ) && (!CoC.player.isDrider() || CoC.player.tailType !== AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN) ) { //Remove dat shit!
				MainView.outputText( '\nYour ovipositor (and eggs) vanish since your body has become less spider-like.</b>\n' );
				CoC.player.removePerk( PerkLib.SpiderOvipositor );
				needNext = true;
			} else if( CoC.player.findPerk( PerkLib.BeeOvipositor ) && CoC.player.tailType !== AppearanceDefs.TAIL_TYPE_BEE_ABDOMEN ) { //Remove dat shit!
				MainView.outputText( '\nYour ovipositor (and eggs) vanish since your body has become less bee-like.</b>\n' );
				CoC.player.removePerk( PerkLib.BeeOvipositor );
				needNext = true;
			} else { //Update stuff!
				var prevEggs = CoC.player.eggs();
				if( prevEggs < 10 ) {
					CoC.player.addEggs( 2 );
				} else if( prevEggs < 20 && CoC.time.hours % 2 === 0 ) {
					CoC.player.addEggs( 1 );
				} else if( CoC.time.hours % 4 === 0 ) {
					CoC.player.addEggs( 1 );
				}
				if( prevEggs < 10 && CoC.player.eggs() >= 10 ) { //Stage 1 egg message
					if( CoC.player.findPerk( PerkLib.SpiderOvipositor ) ) {
						MainView.outputText( '\nYou feel a certain fullness building in your spider-half\'s abdomen.' );
					} else {
						MainView.outputText( '\nYou feel a certain fullness building in your insectile abdomen.  You have some eggs ready... and you feel a strange urge to have them fertilized.' );
						if( !CoC.player.hasVagina() ) {
							MainView.outputText( '  Wait, how would you even go about that?' );
						}
					}
					MainView.outputText( '  <b>You have enough eggs to lay!</b>\n' );
					needNext = true;
				} else if( prevEggs < 20 && CoC.player.eggs() >= 20 ) { //Stage 2 egg message
					if( CoC.player.findPerk( PerkLib.SpiderOvipositor ) ) {
						MainView.outputText( '\nYour spider body feels like it\'s stretched taut, and a heavy warmth has spread throughout it.  The sensation of eggs piling up inside you is enough to drive you to distraction.  It would be a good idea to find somewhere to deposit them - but, oh, how great it would feel to get them fertilized by a nice hard cock first!' );
						if( !CoC.player.hasVagina() ) {
							MainView.outputText( '  Wait, that\'s not right...' );
						}
					} else {
						MainView.outputText( '\nYour abdomen feels like it\'s stretched taut, and a heavy warmth has spread throughout it.  It swings pendulously with every movement you make, and the sensation of eggs piling up inside you is enough to drive you to distraction.' );
					}
					MainView.outputText( '\n\n<b>Minimum Lust raised!</b>\n' );
					needNext = true;
				} else if( prevEggs < 40 && CoC.player.eggs() >= 40 ) { //Stage 3 egg message
					if( CoC.player.findPerk( PerkLib.SpiderOvipositor ) ) {
						MainView.outputText( '\nYour lower half has become so heavy that it\'s difficult to move now, the weight of your eggs bearing down on your lust-addled frame.  Your ovipositor pokes from its hiding place, dripping its slick lubrication in anticipation of filling something, anything with its burden.  You\'re going to have to find someone to help relieve you of your load, and soon...\n\n<b>Minimum Lust raised!</b>\n' );
					} else {
						MainView.outputText( '\nYour bee half has become so heavy that it\'s difficult to move now, the weight of your eggs bearing down on your lust-addled frame.  Your ovipositor pokes from its hiding place, dripping its sweet, slick lubrication in anticipation of filling something, anything with its burden.  You\'re going to have to find someone to help relieve you of your load, and soon...\n' );
					}
					EngineCore.dynStats( 'spe', -1 );
					needNext = true;
				}
			}
		}
		if( CoC.player.findPerk( PerkLib.Oviposition ) || CoC.player.findPerk( PerkLib.BunnyEggs ) ) { //Oviposition perk for lizard and bunny folks
			if( (CoC.player.nagaScore() + CoC.player.lizardScore() < 3) && CoC.player.findPerk( PerkLib.Oviposition ) && !CoC.player.findPerk( PerkLib.BasiliskWomb ) ) { //--Lose Oviposition perk if lizard score gets below 3.
				MainView.outputText( '\nAnother change in your uterus ripples through your reproductive systems.  Somehow you know you\'ve lost a little bit of reptilian reproductive ability.\n(<b>Perk Lost)\n' );
				CoC.player.removePerk( PerkLib.Oviposition );
				needNext = true;
			} else if( CoC.player.bunnyScore() < 3 && CoC.player.findPerk( PerkLib.BunnyEggs ) ) { //--Lose Oviposition perk if bunny score gets below 3.
				MainView.outputText( '\nAnother change in your uterus ripples through your reproductive systems.  Somehow you know you\'ve lost your ability to spontaneously lay eggs.\n(<b>Perk Lost Eggs</b>)\n' );
				CoC.player.removePerk( PerkLib.BunnyEggs );
				needNext = true;
			} else if( CoC.player.pregnancyIncubation < 1 && CoC.player.hasVagina() && CoC.time.hours === 1 ) { //Otherwise pregger check, once every morning
				if( (CoC.player.totalFertility() > 50 && CoC.time.days % 15 === 0) || CoC.time.days % 30 === 0 ) { //every 15 days if high fertility get egg preg
					MainView.outputText( '\n<b>Somehow you know that eggs have begun to form inside you.  You wonder how long it will be before they start to show?</b>\n' );
					CoC.player.knockUp( PregnancyStore.PREGNANCY_OVIELIXIR_EGGS, PregnancyStore.INCUBATION_OVIELIXIR_EGGS, 1, 1 );
					CoC.player.createStatusAffect( StatusAffects.Eggs, Utils.rand( 6 ), Utils.rand( 2 ), (5 + Utils.rand( 3 )), 0 ); //v1 is type, v2 is size (1 === large) and v3 is quantity
					CoC.player.addPerkValue( PerkLib.Oviposition, 1, 1 ); //Count times eggpregged this way in perk.
					needNext = true;
				}
			}
		}
		if( CoC.player.isInHeat() ) { //Heats v1 is bonus fertility, v2 is bonus libido, v3 is hours till it's gone
			if( CoC.player.statusAffectv3( StatusAffects.Heat ) <= 1 || CoC.player.vaginas.length === 0 ) { //Remove bonus libido from heat
				EngineCore.dynStats( 'lib', -CoC.player.statusAffect( CoC.player.findStatusAffect( StatusAffects.Heat ) ).value2, 'resisted', false, 'noBimbo', true );
				CoC.player.removeStatusAffect( StatusAffects.Heat ); //remove heat
				if( CoC.player.lib < 1 ) {
					CoC.player.lib = 1;
				}
				MainView.statsView.show();
				MainView.outputText( '\n<b>Your body calms down, at last getting over your heat.</b>\n' );
				needNext = true;
			} else {
				CoC.player.addStatusValue( StatusAffects.Heat, 3, -1 );
			}
		}
		if( CoC.player.isInRut() ) { //Rut v1 is bonus cum, v2 is bonus libido, v3 is hours till it's gone
			$log.debug( 'RUT:' + CoC.player.statusAffectv3( StatusAffects.Rut ) );
			if( CoC.player.statusAffectv3( StatusAffects.Rut ) <= 1 || CoC.player.totalCocks() === 0 ) { //Remove bonus libido from rut
				EngineCore.dynStats( 'lib', -CoC.player.statusAffectv2( StatusAffects.Rut ), 'resisted', false, 'noBimbo', true );
				CoC.player.removeStatusAffect( StatusAffects.Rut ); //remove heat
				if( CoC.player.lib < 10 ) {
					CoC.player.lib = 10;
				}
				MainView.statsView.show();
				MainView.outputText( '\n<b>Your body calms down, at last getting over your rut.</b>\n' );
				needNext = true;
			} else {
				CoC.player.addStatusValue( StatusAffects.Rut, 3, -1 );
			}
		}
		if( CoC.player.findStatusAffect( StatusAffects.LustyTongue ) ) { //Lusty Tongue Check!
			if( Utils.rand( 5 ) === 0 ) {
				MainView.outputText( '\nYou keep licking your lips, blushing with the sexual pleasure it brings you.' );
				EngineCore.dynStats( 'lus', 2 + Utils.rand( 15 ) );
				if( CoC.player.lust >= 100 ) {
					MainView.outputText( '  Your knees lock from the pleasure, and you fall back in pleasure, twisting and moaning like a whore as you somehow orgasm from your mouth.  When it finishes, you realize your mouth feels even more sensitive than before.' );
					CoC.player.orgasm();
					EngineCore.dynStats( 'sen', 2 );
					CoC.player.changeStatusValue( StatusAffects.LustyTongue, 1, CoC.player.statusAffectv1( StatusAffects.LustyTongue ) + 10 ); //Tongue orgasming makes it last longer.
				}
				MainView.outputText( '\n' );
				needNext = true;
			}
			CoC.player.changeStatusValue( StatusAffects.LustyTongue, 1, CoC.player.statusAffectv1( StatusAffects.LustyTongue ) - 1 ); //Decrement
			if( CoC.player.statusAffectv1( StatusAffects.LustyTongue ) <= 0 ) {
				CoC.player.removeStatusAffect( StatusAffects.LustyTongue );
				MainView.outputText( '\nYour mouth and tongue return to normal.\n' );
				needNext = true;
			}
		}
		if( CoC.player.statusAffectv2( StatusAffects.Kelt ) > 0 ) {
			CoC.player.addStatusValue( StatusAffects.Kelt, 2, -0.15 );
		} //Reduce kelt submissiveness by 1 every 5 hours
		//Mino cum update.
		if( SceneLib.minotaurScene.minoCumUpdate() ) {
			needNext = true;
		} else if( CoC.flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_STATE ] >= 2 && CoC.time.hours % 13 === 0 && CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00330 ] === 0 ) { //Repeated warnings!
			if( CoC.flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_STATE ] === 2 ) {
				MainView.outputText( '\n<b>You shiver, feeling a little cold.  Maybe you ought to get some more minotaur cum?  You just don\'t feel right without that pleasant buzz in the back of your mind.</b>\n' );
			} else if( CoC.flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_STATE ] === 3 ) {
				MainView.outputText( '\n<b>The steady fire of lust within you burns hot, making you shiver and grab at your head.  You\'re STILL in withdrawal after having gone so long without a dose of minotaur love.  You just know you\'re going to be horny and achy until you get some.</b>\n' );
			}
			needNext = true;
		}
		//Decrement mino withdrawal symptoms display cooldown
		//flags[kFLAGS.UNKNOWN_FLAG_NUMBER_00330] prevents PC getting two of the same notices overnite
		else if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00330 ] > 0 ) {
			CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00330 ]--;
		}
		if( CoC.player.findPerk( PerkLib.FutaForm ) ) { //Futa checks
			if( !CoC.player.hasCock() ) { //(Dick regrowth)
				CoC.player.createCock();
				CoC.player.cocks[ 0 ].cockLength = 10;
				CoC.player.cocks[ 0 ].cockThickness = 2.75;
				MainView.outputText( '\n<b>As time passes, your loins grow itchy for a moment.  A split-second later, a column of flesh erupts from your crotch.  Your new, 10-inch cock pulses happily.' );
				if( CoC.player.balls === 0 ) {
					MainView.outputText( '  A pair of heavy balls drop into place below it, churning to produce cum.' );
					CoC.player.balls = 2;
					CoC.player.ballSize = 3;
				}
				EngineCore.dynStats( 'int', -1, 'sen', 5, 'lus', 15 );
				MainView.outputText( '</b>\n' );
				needNext = true;
			}
			if( CoC.player.cocks[ 0 ].cockLength < 8 ) { //(Dick rebiggening)
				MainView.outputText( '\n<b>As time passes, your cock engorges, flooding with blood and growing until it\'s at 8 inches long.  You really have no control over your dick.</b>\n' );
				CoC.player.cocks[ 0 ].cockLength = 8;
				if( CoC.player.cocks[ 0 ].cockThickness < 2 ) {
					CoC.player.cocks[ 0 ].cockThickness = 2;
				}
				needNext = true;
			}
			if( CoC.player.balls === 0 ) { //(Balls regrowth)
				MainView.outputText( '\n<b>As time passes, a pressure in your loins intensifies to near painful levels.  The skin beneath ' + CoC.player.sMultiCockDesc() + ' grows loose and floppy, and then two testicles roll down to fill your scrotum.</b>\n' );
				CoC.player.balls = 2;
				CoC.player.ballSize = 3;
				needNext = true;
			}
			if( CoC.player.breastRows[ 0 ].breastRating < 5 ) { //Tits!
				CoC.player.breastRows[ 0 ].breastRating = 5;
				if( CoC.player.findPerk( PerkLib.FutaFaculties ) ) {
					MainView.outputText( '\n<b>Your tits get nice and full again.  You\'ll have lots of fun now that your breasts are back to being big, swollen knockers!</b>\n' );
				} else {
					MainView.outputText( '\n<b>Your ' + Descriptors.breastDescript( 0 ) + ' have regained their former bimbo-like size.  It looks like you\'ll be stuck with large, sensitive breasts forever, but at least it\'ll help you tease your enemies into submission!</b>\n' );
				}
				EngineCore.dynStats( 'int', -1, 'lus', 15 );
				needNext = true;
			}
			if( !CoC.player.hasVagina() ) { //Vagoo
				CoC.player.createVagina();
				if( CoC.player.findPerk( PerkLib.FutaFaculties ) ) {
					MainView.outputText( '\n<b>Your crotch is like, all itchy an\' stuff.  Damn!  There\'s a wet little slit opening up, and it\'s all tingly!  It feels so good, why would you have ever gotten rid of it?</b>\n' );
				} else {
					MainView.outputText( '\n<b>Your crotch tingles for a second, and when you reach down to feel, your ' + CoC.player.legs() + ' fold underneath you, limp.  You\'ve got a vagina - the damned thing won\'t go away and it feels twice as sensitive this time.  Fucking bimbo liquer.</b>\n' );
				}
				EngineCore.dynStats( 'int', -1, 'sen', 10, 'lus', 15 );
				needNext = true;
			}
		}
		if( CoC.player.findPerk( PerkLib.BimboBody ) || CoC.player.findStatusAffect( StatusAffects.BimboChampagne ) ) { //Bimbo checks
			if( CoC.player.breastRows[ 0 ].breastRating < 5 ) { //Tits!
				CoC.player.breastRows[ 0 ].breastRating = 5;
				if( CoC.player.findPerk( PerkLib.BimboBrains ) || CoC.player.findStatusAffect( StatusAffects.BimboChampagne ) ) {
					MainView.outputText( '\n<b>Your boobies like, get all big an\' wobbly again!  You\'ll have lots of fun now that your tits are back to being big, yummy knockers!</b>\n' );
				} else {
					MainView.outputText( '\n<b>Your ' + Descriptors.breastDescript( 0 ) + ' have regained their former bimbo-like size.  It looks like you\'ll be stuck with large, sensitive breasts forever, but at least it\'ll help you tease your enemies into submission!</b>\n' );
				}
				EngineCore.dynStats( 'int', -1, 'lus', 15 );
				needNext = true;
			}
			if( !CoC.player.hasVagina() ) { //Vagoo
				CoC.player.createVagina();
				if( CoC.player.findPerk( PerkLib.BimboBrains ) || CoC.player.findStatusAffect( StatusAffects.BimboChampagne ) ) {
					MainView.outputText( '\n<b>Your crotch is like, all itchy an\' stuff.  Omigawsh!  There\'s a wet little slit opening up, and it\'s all tingly!  It feels so good, maybe like, someone could put something inside there!</b>\n' );
				} else {
					MainView.outputText( '\n<b>Your crotch tingles for a second, and when you reach down to feel, your ' + CoC.player.legs() + ' fold underneath you, limp.  You\'ve got a vagina - the damned thing won\'t go away and it feels twice as sensitive this time.  Fucking bimbo liquer.</b>\n' );
				}
				needNext = true;
			}
			if( CoC.player.hipRating < 12 ) {
				if( CoC.player.findPerk( PerkLib.BimboBrains ) || CoC.player.findPerk( PerkLib.FutaFaculties ) ) {
					MainView.outputText( '\nWhoah!  As you move, your [hips] sway farther and farther to each side, expanding with every step, soft new flesh filling in as your hips spread into something more appropriate on a tittering bimbo.  You giggle when you realize you can\'t walk any other way.  At least it makes you look, like, super sexy!\n' );
				} else {
					MainView.outputText( '\nOh, no!  As you move, your [hips] sway farther and farther to each side, expanding with every step, soft new flesh filling in as your hips spread into something more appropriate for a bimbo.  Once you realize that you can\'t walk any other way, you sigh heavily, your only consolation the fact that your widened hips can be used to tease more effectively.\n' );
				}
				EngineCore.dynStats( 'int', -1 );
				CoC.player.hipRating = 12;
				needNext = true;
			}
			if( CoC.player.buttRating < 12 ) {
				if( CoC.player.findPerk( PerkLib.BimboBrains ) || CoC.player.findPerk( PerkLib.FutaFaculties ) ) {
					MainView.outputText( '\nGradually warming, you find that your [butt] is practically sizzling with erotic energy.  You smile to yourself, imagining how much you wish you had a nice, plump, bimbo-butt again, your hands finding their way to the flesh on their own.  Like, how did they get down there?  You bite your lip when you realize how good your tush feels in your hands, particularly when it starts to get bigger.  Are butts supposed to do that?  Happy pink thoughts wash that concern away - it feels good, and you want a big, sexy butt!  The growth stops eventually, and you pout disconsolately when the lusty warmth\'s last lingering touches dissipate.  Still, you smile when you move and feel your new booty jiggling along behind you.  This will be fun!\n' );
				} else {
					MainView.outputText( '\nGradually warming, you find that your [butt] is practically sizzling with erotic energy.  Oh, no!  You thought that having a big, bloated bimbo-butt was a thing of the past, but with how it\'s tingling under your groping fingertips, you have no doubt that you\'re about to see the second coming of your sexy ass.  Wait, how did your fingers get down there?  You pull your hands away somewhat guiltily as you feel your buttcheeks expanding.  Each time you bounce and shake your new derriere, you moan softly in enjoyment.  Damnit!  You force yourself to stop just as your ass does, but when you set off again, you can feel it bouncing behind you with every step.  At least it\'ll help you tease your foes a little more effectively...\n' );
				}
				EngineCore.dynStats( 'int', -1, 'lus', 10 );
				CoC.player.buttRating = 12;
				needNext = true;
			}
		}
		if( CoC.player.findPerk( PerkLib.BroBody ) ) { //Bro checks
			CoC.player.removeStatusAffect( StatusAffects.Feeder );
			CoC.player.removePerk( PerkLib.Feeder );
			if( !CoC.player.hasCock() ) { //(Dick regrowth)
				CoC.player.createCock();
				CoC.player.cocks[ 0 ].cockLength = 10;
				CoC.player.cocks[ 0 ].cockThickness = 2.75;
				MainView.outputText( '\n<b>As time passes, your loins grow itchy for a moment.  A split-second later, a column of flesh erupts from your crotch.  Your new, 10-inch cock pulses happily.' );
				if( CoC.player.balls === 0 ) {
					MainView.outputText( '  A pair of heavy balls drop into place below it, churning to produce cum.' );
					CoC.player.balls = 2;
					CoC.player.ballSize = 3;
				}
				MainView.outputText( '</b>\n' );
				needNext = true;
			}
			if( CoC.player.cocks[ 0 ].cockLength < 10 ) { //(Dick rebiggening)
				MainView.outputText( '\n<b>As time passes, your cock engorges, flooding with blood and growing until it\'s at 10 inches long.  ' );
				if( CoC.player.findPerk( PerkLib.BroBrains ) ) {
					MainView.outputText( 'Goddamn, that thing is almost as tough as you!  ' );
				}
				MainView.outputText( 'You really have no control over your dick.</b>\n' );
				CoC.player.cocks[ 0 ].cockLength = 10;
				if( CoC.player.cocks[ 0 ].cockThickness < 2 ) {
					CoC.player.cocks[ 0 ].cockThickness = 2;
				}
				needNext = true;
			}
			if( CoC.player.balls === 0 ) { //(Balls regrowth)
				MainView.outputText( '\n<b>As time passes, a pressure in your loins intensifies to near painful levels.  The skin beneath ' + CoC.player.sMultiCockDesc() + ' grows loose and floppy, and then two testicles roll down to fill your scrotum.</b>\n' );
				CoC.player.balls = 2;
				CoC.player.ballSize = 3;
				needNext = true;
			}
		}
		if( CoC.player.findStatusAffect( StatusAffects.Feeder ) ) { //Feeder checks
			if( CoC.player.cor <= 20 ) { //Go away if pure
				MainView.outputText( '\nThe desire to breastfeed fades into the background.  It must have been associated with the corruption inside you.\n\n(<b>You have lost the \'Feeder\' perk.</b>)\n' );
				CoC.player.removeStatusAffect( StatusAffects.Feeder );
				CoC.player.removePerk( PerkLib.Feeder );
				needNext = true;
			} else { //Bigga titayz
				if( CoC.player.breastRows[ 0 ].breastRating < 5 ) {
					MainView.outputText( '\nYour ' + Descriptors.breastDescript( 0 ) + ' start to jiggle and wobble as time passes, seeming to refill with your inexhaustible supply of milk.  It doesn\'t look like you\'ll be able to keep them below a DD cup so long as you\'re so focused on breast-feeding.\n' );
					CoC.player.breastRows[ 0 ].breastRating = 5;
					needNext = true;
				}
				CoC.player.addStatusValue( StatusAffects.Feeder, 2, 1 ); //Increase 'time since breastfed'
				//After 3 days without feeding someone sensitivity jumps.
				if( CoC.player.statusAffectv2( StatusAffects.Feeder ) >= 72 && CoC.time.hours === 14 ) {
					MainView.outputText( '\n<b>After having gone so long without feeding your milk to someone, you\'re starting to feel strange.  Every inch of your skin practically thrums with sensitivity, particularly your sore, dripping nipples.</b>\n' );
					EngineCore.dynStats( 'sen', 2 + (((CoC.player.statusAffectv2( StatusAffects.Feeder )) - 70) / 20) );
					needNext = true;
				}
			}
		}
		if( CoC.player.findStatusAffect( StatusAffects.WormPlugged ) && CoC.flags[ kFLAGS.PLAYER_PREGGO_WITH_WORMS ] === 0 ) { //Update worm drippy-cooch
			if( CoC.player.hasVagina() ) {
				if( Utils.rand( 5 ) === 0 ) {
					CoC.flags[ kFLAGS.PLAYER_PREGGO_WITH_WORMS ] = 1;
					MainView.outputText( '\nA sudden gush of semen-coated worms noisily slurps out of your womb.  It runs down your legs as the worms do their damnedest to escape.  The feeling of so many squiggling forms squirting through your cunt-lips turns you on more than you\'d like to admit.  You wonder why they stayed as long as they did, and some part of you worries that their stay may have reduced your capacity to bear children, though in a place like this that might be a blessing.\n' );
					EngineCore.dynStats( 'lus', 2 + CoC.player.sens / 10 );
					if( CoC.player.fertility > 5 ) {
						CoC.player.fertility -= (1 + Math.round( CoC.player.fertility / 4 ));
					}
					CoC.player.addStatusValue( StatusAffects.WormPlugged, 1, -1 ); //Lower chances
					if( CoC.player.statusAffectv1( StatusAffects.WormPlugged ) <= 0 ) { //Remove if too low
						CoC.player.removeStatusAffect( StatusAffects.WormPlugged );
						CoC.player.knockUpForce(); //Clear worm 'pregnancy'
					}
					needNext = true;
				}
			} else { //Non cunts lose worm plugged
				CoC.player.removeStatusAffect( StatusAffects.WormPlugged );
				CoC.player.knockUpForce(); //Clear worm 'pregnancy'
			}
		}
		if( CoC.player.findStatusAffect( StatusAffects.Milked ) ) { //'Milked'
			CoC.player.addStatusValue( StatusAffects.Milked, 1, -1 );
			if( CoC.player.statusAffectv1( StatusAffects.Milked ) <= 0 ) {
				MainView.outputText( '\n<b>Your ' + Descriptors.nippleDescript( 0 ) + 's are no longer sore from the milking.</b>\n' );
				CoC.player.removeStatusAffect( StatusAffects.Milked );
				needNext = true;
			}
		}
		if( CoC.player.findStatusAffect( StatusAffects.Jizzpants ) ) {
			MainView.outputText( '\nYour ' + CoC.player.armorName + ' squishes wetly with all the semen you unloaded into them, arousing you more and more with every movement.\n' );
			EngineCore.dynStats( 'lus', 10 + CoC.player.sens / 5 );
			CoC.player.removeStatusAffect( StatusAffects.Jizzpants );
			needNext = true;
		}
		if( CoC.player.findStatusAffect( StatusAffects.Dysfunction ) ) {
			if( CoC.player.statusAffectv1( StatusAffects.Dysfunction ) <= 1 ) {
				CoC.player.removeStatusAffect( StatusAffects.Dysfunction );
				MainView.outputText( '\nYou feel a tingling in your nethers... at last full sensation has returned to your groin.  <b>You can masturbate again!</b>\n' );
				needNext = true;
			} else {
				CoC.player.addStatusValue( StatusAffects.Dysfunction, 1, -1 );
			}
		}
		if( !CoC.player.findStatusAffect( StatusAffects.LactationReduction ) ) { //Lactation reduction
			if( CoC.player.biggestLactation() > 0 ) {
				CoC.player.createStatusAffect( StatusAffects.LactationReduction, 0, 0, 0, 0 );
			}
		} else if( CoC.player.biggestLactation() > 0 && !CoC.player.findStatusAffect( StatusAffects.Feeder ) && CoC.player.pregnancyIncubation === 0 ) {
			CoC.player.addStatusValue( StatusAffects.LactationReduction, 1, 1 );
			if( CoC.player.statusAffectv1( StatusAffects.LactationReduction ) >= 48 ) {
				if( !CoC.player.findStatusAffect( StatusAffects.LactationReduc0 ) ) {
					CoC.player.createStatusAffect( StatusAffects.LactationReduc0, 0, 0, 0, 0 );
					if( CoC.player.biggestLactation() >= 1 ) {
						MainView.outputText( '\n<b>Your ' + Descriptors.nippleDescript( 0 ) + 's feel swollen and bloated, needing to be milked.</b>\n' );
					}
					if( CoC.player.biggestLactation() <= 2 ) {
						CoC.player.createStatusAffect( StatusAffects.LactationReduc1, 0, 0, 0, 0 );
					}
					if( CoC.player.biggestLactation() <= 1 ) {
						CoC.player.createStatusAffect( StatusAffects.LactationReduc2, 0, 0, 0, 0 );
					}
					needNext = true;
				}
				CoC.player.boostLactation( -0.5 * CoC.player.breastRows.length / 24 );
				if( CoC.player.biggestLactation() <= 2.5 && !CoC.player.findStatusAffect( StatusAffects.LactationReduc1 ) ) {
					MainView.outputText( '\n<b>Your breasts feel lighter as your body\'s milk production winds down.</b>\n' );
					CoC.player.createStatusAffect( StatusAffects.LactationReduc1, 0, 0, 0, 0 );
					needNext = true;
				} else if( CoC.player.biggestLactation() <= 1.5 && !CoC.player.findStatusAffect( StatusAffects.LactationReduc2 ) ) {
					MainView.outputText( '\n<b>Your body\'s milk output drops down to what would be considered \'normal\' for a pregnant woman.</b>\n' );
					CoC.player.createStatusAffect( StatusAffects.LactationReduc2, 0, 0, 0, 0 );
					needNext = true;
				}
				if( CoC.player.biggestLactation() < 1 && !CoC.player.findStatusAffect( StatusAffects.LactationReduc3 ) ) {
					CoC.player.createStatusAffect( StatusAffects.LactationReduc3, 0, 0, 0, 0 );
					MainView.outputText( '\n<b>Your body no longer produces any milk.</b>\n' );
					CoC.player.removeStatusAffect( StatusAffects.LactationReduction );
					needNext = true;
				}
			}
		}
		if( CoC.player.findStatusAffect( StatusAffects.CuntStretched ) ) { //Cunt stretching stuff
			CoC.player.addStatusValue( StatusAffects.CuntStretched, 1, 1 );
			if( CoC.player.vaginas.length > 0 ) {
				if( !CoC.player.findPerk( PerkLib.FerasBoonWideOpen ) ) {
					if( CoC.player.vaginas[ 0 ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_LOOSE && CoC.player.statusAffectv1( StatusAffects.CuntStretched ) >= 200 ) {
						MainView.outputText( '\nYour ' + Descriptors.vaginaDescript( 0 ) + ' recovers from your ordeals, tightening up a bit.\n' );
						CoC.player.vaginas[ 0 ].vaginalLooseness--;
						CoC.player.changeStatusValue( StatusAffects.CuntStretched, 1, 0 );
						needNext = true;
					}
					if( CoC.player.vaginas[ 0 ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_GAPING && CoC.player.statusAffectv1( StatusAffects.CuntStretched ) >= 100 ) {
						MainView.outputText( '\nYour ' + Descriptors.vaginaDescript( 0 ) + ' recovers from your ordeals, tightening up a bit.\n' );
						CoC.player.vaginas[ 0 ].vaginalLooseness--;
						CoC.player.changeStatusValue( StatusAffects.CuntStretched, 1, 0 );
						needNext = true;
					}
					if( CoC.player.vaginas[ 0 ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_GAPING_WIDE && CoC.player.statusAffectv1( StatusAffects.CuntStretched ) >= 70 ) {
						MainView.outputText( '\nYour ' + Descriptors.vaginaDescript( 0 ) + ' recovers from your ordeals and becomes tighter.\n' );
						CoC.player.vaginas[ 0 ].vaginalLooseness--;
						CoC.player.changeStatusValue( StatusAffects.CuntStretched, 1, 0 );
						needNext = true;
					}
				}
				if( CoC.player.vaginas[ 0 ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_LEVEL_CLOWN_CAR && CoC.player.statusAffectv1( StatusAffects.CuntStretched ) >= 50 ) {
					MainView.outputText( '\nYour ' + Descriptors.vaginaDescript( 0 ) + ' recovers from the brutal stretching it has received and tightens up a little bit, but not much.\n' );
					CoC.player.vaginas[ 0 ].vaginalLooseness--;
					CoC.player.changeStatusValue( StatusAffects.CuntStretched, 1, 0 );
					needNext = true;
				}
			}
		}
		if( CoC.player.findStatusAffect( StatusAffects.ButtStretched ) ) { //Butt stretching stuff
			CoC.player.addStatusValue( StatusAffects.ButtStretched, 1, 1 );
			if( CoC.player.ass.analLooseness === 2 && CoC.player.statusAffectv1( StatusAffects.ButtStretched ) >= 72 ) {
				MainView.outputText( '\n<b>Your ' + Descriptors.assholeDescript() + ' recovers from your ordeals, tightening up a bit.</b>\n' );
				CoC.player.ass.analLooseness--;
				CoC.player.changeStatusValue( StatusAffects.ButtStretched, 1, 0 );
				needNext = true;
			}
			if( CoC.player.ass.analLooseness === 3 && CoC.player.statusAffectv1( StatusAffects.ButtStretched ) >= 48 ) {
				MainView.outputText( '\n<b>Your ' + Descriptors.assholeDescript() + ' recovers from your ordeals, tightening up a bit.</b>\n' );
				CoC.player.ass.analLooseness--;
				CoC.player.changeStatusValue( StatusAffects.ButtStretched, 1, 0 );
				needNext = true;
			}
			if( CoC.player.ass.analLooseness === 4 && CoC.player.statusAffectv1( StatusAffects.ButtStretched ) >= 24 ) {
				MainView.outputText( '\n<b>Your ' + Descriptors.assholeDescript() + ' recovers from your ordeals and becomes tighter.</b>\n' );
				CoC.player.ass.analLooseness--;
				CoC.player.changeStatusValue( StatusAffects.ButtStretched, 1, 0 );
				needNext = true;
			}
			if( CoC.player.ass.analLooseness === 5 && CoC.player.statusAffectv1( StatusAffects.ButtStretched ) >= 12 ) {
				MainView.outputText( '\n<b>Your ' + Descriptors.assholeDescript() + ' recovers from the brutal stretching it has received and tightens up.</b>\n' );
				CoC.player.ass.analLooseness--;
				CoC.player.changeStatusValue( StatusAffects.ButtStretched, 1, 0 );
				needNext = true;
			}
		}
		if( CoC.player.findPerk( PerkLib.SlimeCore ) ) { //Lose slime core perk
			if( CoC.player.vaginalCapacity() < 9000 || CoC.player.skinAdj !== 'slimy' || CoC.player.skinDesc !== 'skin' || CoC.player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_GOO ) {
				MainView.outputText( '\nYour form ripples, as if uncertain at the changes your body is undergoing.  The goo of your flesh cools, its sensitive, responsive membrane thickening into ' + CoC.player.skin() + ' while bones and muscles knit themselves into a cohesive torso, chest and hips gaining definition.  Translucent ooze clouds and the gushing puddle at your feet melts together, splitting into solid trunks as you regain your legs.  Before long, you can no longer see through your own body and, with an unsteady shiver, you pat yourself down, readjusting to solidity.  A lurching heat in your chest suddenly reminds you of the slime core that used to float inside you.  Gingerly touching your ' + Descriptors.chestDesc() + ', you can feel a small, second heartbeat under your ribs that gradually seems to be sinking, past your belly. A lurching wave of warmth sparks through you, knocking you off your fresh legs and onto your ' + Descriptors.buttDescript() + '.  A delicious pressure pulses in your abdomen and you loosen your ' + CoC.player.armorName + ' as sweat beads down your neck.  You clench your eyes, tongue lolling in your mouth, and the pressure builds and builds until, in ecstatic release, your body arches in an orgasmic release.\n\n' );
				MainView.outputText( '\nPanting, you open your eyes and see that, for once, the source of your climax wasn\'t your loins.  Feeling a warm, wetness on your abs, you investigate and find the small, heart-shaped nucleus that used to be inside your body has somehow managed to pass through your belly button. Exposed to the open air, the crimson organ slowly crystallizes, shrinking and hardening into a tiny ruby.  Rubbing the stone with your thumb, you\'re surprised to find that you can still feel a pulse within its glittering facets.  You stow the ruby heart, in case you need it again.\n' );
				CoC.player.createKeyItem( 'Ruby Heart', 0, 0, 0, 0 ); //[Add 'Ruby Heart' to key items. Player regains slime core if returning to goo body]
				CoC.player.removePerk( PerkLib.SlimeCore );
				needNext = true;
			}
		}
		if( CoC.player.hasKeyItem( 'Ruby Heart' ) >= 0 ) { //Regain slime core
			if( CoC.player.findStatusAffect( StatusAffects.SlimeCraving ) && !CoC.player.findPerk( PerkLib.SlimeCore ) && CoC.player.isGoo() && CoC.player.gooScore() >= 4 && CoC.player.vaginalCapacity() >= 9000 && CoC.player.skinAdj === 'slimy' && CoC.player.skinDesc === 'skin' && CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_GOO ) {
				MainView.outputText( '\nAs you adjust to your new, goo-like body, you remember the ruby heart you expelled so long ago.  As you reach to pick it up, it quivers and pulses with a warm, cheerful light.  Your fingers close on it and the nucleus slides through your palm, into your body!\n\n' );
				MainView.outputText( 'There is a momentary pressure in your chest and a few memories that are not your own flicker before your eyes.  The dizzying sight passes and the slime core settles within your body, imprinted with your personality and experiences.  There is a comforting calmness from your new nucleus and you feel as though, with your new memories, you will be better able to manage your body\'s fluid requirements.\n' );
				//(Reduces Fluid Addiction to a 24 hour intake requirement).
				MainView.outputText( '(<b>Gained New Perk Core - Moisture craving builds at a greatly reduced rate.</b>\n)' );
				CoC.player.createPerk( PerkLib.SlimeCore, 0, 0, 0, 0 );
				CoC.player.removeKeyItem( 'Ruby Heart' );
				needNext = true;
			}
		}
		if( CoC.player.findStatusAffect( StatusAffects.SlimeCraving ) ) { //Slime craving stuff
			if( CoC.player.vaginalCapacity() < 9000 || CoC.player.skinAdj !== 'slimy' || CoC.player.skinDesc !== 'skin' || CoC.player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_GOO ) {
				MainView.outputText( '\n<b>You realize you no longer crave fluids like you once did.</b>\n' );
				CoC.player.removeStatusAffect( StatusAffects.SlimeCraving );
				CoC.player.removeStatusAffect( StatusAffects.SlimeCravingFeed );
				needNext = true;
			} else { //Slime core reduces fluid need rate
				if( CoC.player.findPerk( PerkLib.SlimeCore ) ) {
					CoC.player.addStatusValue( StatusAffects.SlimeCraving, 1, 0.5 );
				} else {
					CoC.player.addStatusValue( StatusAffects.SlimeCraving, 1, 1 );
				}
				if( CoC.player.statusAffectv1( StatusAffects.SlimeCraving ) >= 18 ) {
					if( !CoC.player.findStatusAffect( StatusAffects.SlimeCravingOutput ) ) { //Protects against this warning appearing multiple times in the output
						CoC.player.createStatusAffect( StatusAffects.SlimeCravingOutput, 0, 0, 0, 0 );
						MainView.outputText( '\n<b>Your craving for the \'fluids\' of others grows strong, and you feel yourself getting weaker and slower with every passing hour.</b>\n' );
						needNext = true;
					}
					if( CoC.player.spe > 1 ) {
						CoC.player.addStatusValue( StatusAffects.SlimeCraving, 3, 0.1 );
					} //Keep track of how much has been taken from speed
					EngineCore.dynStats( 'str', -0.1, 'spe', -0.1, 'lus', 2 );
					CoC.player.addStatusValue( StatusAffects.SlimeCraving, 2, 0.1 ); //Keep track of how much has been taken from strength
				}
			}
		}
		if( CoC.player.findStatusAffect( StatusAffects.SlimeCravingFeed ) ) { //Slime feeding stuff
			MainView.outputText( '\n<b>You feel revitalized from your recent intake, but soon you\'ll need more...</b>\n' );
			EngineCore.dynStats( 'str', CoC.player.statusAffectv2( StatusAffects.SlimeCraving ) * 0.5, 'spe', CoC.player.statusAffectv3( StatusAffects.SlimeCraving ) ); //Boost speed and restore half the player's lost strength
			CoC.player.removeStatusAffect( StatusAffects.SlimeCravingFeed ); //Remove feed succuss status so it can be reset
			CoC.player.changeStatusValue( StatusAffects.SlimeCraving, 2, 0 ); //Reset stored hp/toughness values
			needNext = true;
		}
		if( CoC.time.hours === 6 && CoC.player.armorName === 'bimbo skirt' && Utils.rand( 10 ) === 0 ) {
			MainView.outputText( '\n<b>As you wake up, you feel a strange tingling starting in your nipples that extends down into your breasts.  After a minute, the tingling dissipates in a soothing wave.  As you cup your tits, you realize they\'ve gotten larger!</b>' );
			CoC.player.growTits( 1, CoC.player.bRows(), false, 2 );
			EngineCore.dynStats( 'lus', 10 );
			needNext = true;
		}
		if( CoC.flags[ kFLAGS.BIKINI_ARMOR_BONUS ] > 0 ) {
			if( CoC.player.armorName === 'lusty maiden\'s armor' ) {
				if( CoC.time.hours === 0 ) {
					CoC.flags[ kFLAGS.BIKINI_ARMOR_BONUS ]--;
				} //Adjust for inflation
				if( CoC.flags[ kFLAGS.BIKINI_ARMOR_BONUS ] < 0 ) {
					CoC.flags[ kFLAGS.BIKINI_ARMOR_BONUS ] = 0;
				} //Keep in bounds.
				if( CoC.flags[ kFLAGS.BIKINI_ARMOR_BONUS ] > 8 ) {
					CoC.flags[ kFLAGS.BIKINI_ARMOR_BONUS ] = 8;
				}
			} else {
				CoC.flags[ kFLAGS.BIKINI_ARMOR_BONUS ] = 0;
			}
		}
		//No better place for these since the code for the event is part of CoC.as or one of its included files
		if( CoC.flags[ kFLAGS.TIME_SINCE_VALA_ATTEMPTED_RAPE_PC ] > 0 ) {
			CoC.flags[ kFLAGS.TIME_SINCE_VALA_ATTEMPTED_RAPE_PC ]--;
		} //Vala post-rape countdown
		if( CoC.flags[ kFLAGS.GATS_ANGEL_TIME_TO_FIND_KEY ] > 0 && CoC.flags[ kFLAGS.GATS_ANGEL_TIME_TO_FIND_KEY ] < 500 ) {
			CoC.flags[ kFLAGS.GATS_ANGEL_TIME_TO_FIND_KEY ]++;
		}
		if( CoC.time.hours > 23 ) { //Once per day
			CoC.flags[ kFLAGS.BROOKE_MET_TODAY ] = 0;
			if( CoC.time.days % 2 === 0 && CoC.flags[ kFLAGS.KAIJU_BAD_END_COUNTER ] > 0 ) {
				CoC.flags[ kFLAGS.KAIJU_BAD_END_COUNTER ]--;
				if( CoC.flags[ kFLAGS.KAIJU_BAD_END_COUNTER ] < 0 ) {
					CoC.flags[ kFLAGS.KAIJU_BAD_END_COUNTER ] = 0;
				}
			}
			if( CoC.flags[ kFLAGS.GILDED_JERKED ] > 0 ) {
				CoC.flags[ kFLAGS.GILDED_JERKED ] = 0;
			}
			if( CoC.flags[ kFLAGS.FED_SCYLLA_TODAY ] === 1 ) {
				CoC.flags[ kFLAGS.FED_SCYLLA_TODAY ] = 0;
			}
			if( CoC.flags[ kFLAGS.NOT_HELPED_ARIAN_TODAY ] !== 0 ) {
				CoC.flags[ kFLAGS.NOT_HELPED_ARIAN_TODAY ] = 0;
			}
			if( CoC.flags[ kFLAGS.RUBI_PROSTITUTION ] > 0 ) {
				CoC.flags[ kFLAGS.RUBI_PROFIT ] += 2 + Utils.rand( 4 );
			}
			CoC.flags[ kFLAGS.BENOIT_TALKED_TODAY ] = 0;
			SceneLib.benoit.updateBenoitInventory();
			CoC.flags[ kFLAGS.ROGAR_FUCKED_TODAY ] = 0;
			if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00285 ] > 0 ) {
				CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00285 ]--;
			} //Reduce lust-stick resistance building
			if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00155 ] > 0 ) { //Dominika fellatrix countdown
				CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00155 ]--;
				if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00155 ] < 0 ) {
					CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00155 ] = 0;
				}
			}
			if( CoC.flags[ kFLAGS.LOPPE_DENIAL_COUNTER ] > 0 ) { //Loppe denial counter
				CoC.flags[ kFLAGS.LOPPE_DENIAL_COUNTER ]--;
				if( CoC.flags[ kFLAGS.LOPPE_DENIAL_COUNTER ] < 0 ) {
					CoC.flags[ kFLAGS.LOPPE_DENIAL_COUNTER ] = 0;
				}
			}
			if( CoC.flags[ kFLAGS.WEEKLY_FAIRY_ORGY_COUNTDOWN ] > 0 ) { //Countdown to next faerie orgy
				CoC.flags[ kFLAGS.WEEKLY_FAIRY_ORGY_COUNTDOWN ]--;
				if( CoC.flags[ kFLAGS.WEEKLY_FAIRY_ORGY_COUNTDOWN ] < 0 ) {
					CoC.flags[ kFLAGS.WEEKLY_FAIRY_ORGY_COUNTDOWN ] = 0;
				}
			}
			if( CoC.time.days % 7 === 0 ) {
				CoC.flags[ kFLAGS.WHITNEY_GEMS_PAID_THIS_WEEK ] = 0;
			} //Clear Whitney's Weekly limit
			if( CoC.flags[ kFLAGS.USED_MILKER_TODAY ] > 0 ) {
				CoC.flags[ kFLAGS.USED_MILKER_TODAY ] = 0;
			} //Clear 'has fucked milker today'
			if( SceneLib.latexGirl.latexGooFollower() ) { //Latex goo follower daily updates
				SceneLib.latexGirl.gooFluid( -2, false );
				if( SceneLib.latexGirl.gooFluid() < 50 ) {
					SceneLib.latexGirl.gooHappiness( -1, false );
				}
				if( SceneLib.latexGirl.gooFluid() < 25 ) {
					SceneLib.latexGirl.gooHappiness( -1, false );
				}
				if( SceneLib.latexGirl.gooHappiness() < 75 ) {
					SceneLib.latexGirl.gooObedience( -1, false );
				}
				if( SceneLib.latexGirl.gooHappiness() >= 90 ) {
					SceneLib.latexGirl.gooObedience( 1, false );
				}
			}
			SceneLib.farmCorruption.updateFarmCorruption(); //Farm Corruption updating
			if( CoC.player.findStatusAffect( StatusAffects.Contraceptives ) ) { // Herbal contraceptives countdown
				if( CoC.player.statusAffectv1( StatusAffects.Contraceptives ) === 1 ) {
					CoC.player.addStatusValue( StatusAffects.Contraceptives, 2, -1 );
					if( CoC.player.statusAffectv1( StatusAffects.Contraceptives ) < 0 ) {
						CoC.player.removeStatusAffect( StatusAffects.Contraceptives );
					}
				}
			}
			if( CoC.player.statusAffectv1( StatusAffects.SharkGirl ) > 0 ) {
				CoC.player.addStatusValue( StatusAffects.SharkGirl, 1, -1 );
			} //Lower shark girl counter
			if( CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_TIME_REMAINING ] > 0 ) {
				switch( CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_SERUM_TIMES_APPLIED ] ) {
					case 1:
						if( !needNext ) {
							needNext = EventParser.growHair( 0.2 );
						} else {
							EventParser.growHair( 0.2 );
						}
						break;
					case 2:
						if( !needNext ) {
							needNext = EventParser.growHair( 0.5 );
						} else {
							EventParser.growHair( 0.5 );
						}
						break;
					case 3:
						if( !needNext ) {
							needNext = EventParser.growHair( 1.1 );
						} else {
							EventParser.growHair( 1.1 );
						}
				}
				CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_TIME_REMAINING ]--;
				//reset hair growth multiplier and timer when
				//expired.
				if( CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_TIME_REMAINING ] <= 0 ) {
					CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_TIME_REMAINING ] = 0;
					CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_SERUM_TIMES_APPLIED ] = 0;
					MainView.outputText( '<b>\nThe tingling on your scalp slowly fades away as the hair extension serum wears off.  Maybe it\'s time to go back to the salon for more?</b>' );
					//Restart hair growth if wuz lizard-stopped
					if( CoC.flags[ kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD ] > 0 ) {
						CoC.flags[ kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD ] = 0;
						MainView.outputText( '  <b>You hair is now growing normally again.</b>' );
					}
					MainView.outputText( '\n' );
					needNext = true;
				}
			}
			//Hair grows if not disabled by lizardness
			if( CoC.flags[ kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD ] === 0 ) {
				if( !needNext ) {
					needNext = EventParser.growHair( 0.1 );
				} else {
					EventParser.growHair( 0.1 );
				}
			}
			//Clear dragon breath cooldown!
			if( CoC.player.findStatusAffect( StatusAffects.DragonBreathCooldown ) ) {
				CoC.player.removeStatusAffect( StatusAffects.DragonBreathCooldown );
			}
		}
		return needNext;
	};
	PlayerEvents.prototype.timeChangeLarge = function() {
		if( Utils.rand( 4 ) === 0 && SceneLib.xmasBitch.isHolidays() && CoC.player.gender > 0 && CoC.time.hours === 6 && CoC.flags[ kFLAGS.XMAS_CHICKEN_YEAR ] < CoC.date.fullYear ) {
			SceneLib.xmasMisc.getAChristmasChicken();
			return true;
		}
		if( CoC.time.hours === 1 && SceneLib.xmasBitch.isHolidays() && CoC.date.fullYear > CoC.flags[ kFLAGS.PC_ENCOUNTERED_CHRISTMAS_ELF_BEFORE ] ) { //XMAS ELF
			SceneLib.xmasMisc.xmasBitchEncounter(); //Set it to remember the last year encountered
			return true;
		}
		if( this.checkedTurkey++ === 0 && (Utils.rand( 5 ) === 0 && (CoC.time.hours === 18 || CoC.time.hours === 19)) && (CoC.date.fullYear > CoC.flags[ kFLAGS.TURKEY_FUCK_YEAR_DONE ] || CoC.flags[ kFLAGS.MORE_TURKEY ] > 0) && SceneLib.thanksgiving.isThanksgiving() && CoC.player.gender > 0 ) {
			SceneLib.thanksgiving.datTurkeyRumpMeeting(); //TURKEY SURPRISE
			return true;
		}
		if( this.checkedDream++ === 0 && CoC.time.hours === 3 ) { //You can only have one dream each night
			if( CoC.player.gender > 0 && CoC.time.days === 10 ) { //Day 10 dream - since this can happen only once it takes priority over all other dreams
				SceneLib.dreams.dayTenDreams();
				return true;
			}
			if( CoC.player.hasCock() && CoC.player.findPerk( PerkLib.BeeOvipositor ) && (CoC.player.eggs() >= 20 && Utils.rand( 6 ) === 0) ) { //Bee dreams proc
				//happens at first sleep after hitting stage 3 unfertilized
				//To Wong Foo, Thanks for Everything, Julie Newmar
				MainView.outputText( '\nYou sit atop your favorite flower, enjoying the smell of verdure and the sounds of the forest.  The sun is shining brightly and it feels wonderful on your chitin.  Your wings twitch happily in the soft breeze, and it feels good to be alive and doing the colony\'s work... the only sour note is your heavy, bloated abdomen, so full of unfertilized eggs that it droops, so full it strains your back and pinches your nerves.  Still, it\'s too nice a day to let that depress you, and you take up your customary song, humming tunelessly but mellifluously as you wait for passers-by.' );
				MainView.outputText( '\n\nYour antennae bob - was that someone?  Peering between the trees from the corner of your eye, you can see the figure of another person, and you intensify your hypnotic buzz, trying to draw it closer.  The figure steps into your clearing and out of the shadow; clad in ' + CoC.player.armorName + ', ' + CoC.player.mf( 'he', 'she' ) + ' is yourself!  Confused, you stop humming and stare into your own face, and the other you takes the opportunity to open ' + CoC.player.mf( 'his', 'her' ) + ' garments, exposing ' + CoC.player.mf( 'his', 'her' ) + ' [cock]!' );
				MainView.outputText( '\n\nStartled, you slip down from your seat and try to run, but the other you has already crossed the clearing and seizes you by the fuzz on your hefty, swollen abdomen; your leg slips, propelling you face-first to the ground.  ' + CoC.player.mf( 'He', 'She' ) + ' pulls you back toward ' + CoC.player.mf( 'his', 'her' ) + 'self and, grabbing one of your chitinous legs, turns you over.  The other you spreads your fuzzed thighs, revealing your soft, wet pussy, and the sweet smell of honey hits your noses.  ' + CoC.player.mf( 'His', 'Her' ) + ' prick hardens intensely and immediately at the aroma of your pheromone-laden nectar, and ' + CoC.player.mf( 'he', 'she' ) + ' pushes it into you without so much as a word of apology, groaning as ' + CoC.player.mf( 'he', 'she' ) + ' begins to rut you mercilessly.  You can feel the sensations of ' + CoC.player.mf( 'his', 'her' ) + ' burning cock as if it were your own, and your legs wrap around your other self instinctively even as your mind recoils in confusion.' );
				MainView.outputText( '\n\nThe other you grunts and locks up as ' + CoC.player.mf( 'his', 'her' ) + '... your [cock] begins to spurt inside your honey-drooling cunt, and ' + CoC.player.mf( 'he', 'she' ) + ' falls onto you, bottoming out inside; your vagina likewise clenches and squirts your sweet juices.  As ' + CoC.player.mf( 'he', 'she' ) + ' ejaculates, thrusting weakly, you can feel something shifting in you, filling you with pins and needles... it feels like the warm cum ' + CoC.player.mf( 'he', 'she' ) + '\'s filling you with is permeating your entire groin, working its way back toward your abdomen.  It edges up to your massive buildup of eggs, and your body tightens in a second climax at the thought of having your children fertilized-' );
				MainView.outputText( '\n\nYou snap awake, sitting bolt upright.  What in the name of... your ' + CoC.player.multiCockDescriptLight() + ' is softening rapidly, and as you shift, you can feel your cum sloshing in your [armor].  For fuck\'s sake.' );
				if( CoC.player.cumQ() >= 1000 ) {
					MainView.outputText( '  It\'s completely soaked your bedroll, too... you won\'t be sleeping on this again until you wash it out.  Grumbling, you roll the soggy, white-stained fabric up and stow it.' );
				}
				MainView.outputText( '  The sensation of wetness inside your own clothes torments you as you try to return to sleep, driving up your lust and making you half-hard once again... the rumbling of eggs in your abdomen, as if they\'re ready to be laid, doesn\'t help either.' );
				CoC.player.fertilizeEggs(); //convert eggs to fertilized based on player cum output, reduce lust by 100 and then add 20 lust
				CoC.player.orgasm(); //reduce lust by 100 and add 20, convert eggs to fertilized depending on cum output
				EngineCore.dynStats( 'lus', 20 );
				EngineCore.doNext( MainView, MainView.playerMenu );
				//Hey Fenoxo - maybe the unsexed characters get a few "cock up the ovipositor" scenes for fertilization with some characters (probably only willing ones)?
				//Hey whoever, maybe you write them? -Z
				return true;
			}
			if( CoC.player.hasCock() && CoC.player.findPerk( PerkLib.SpiderOvipositor ) && (CoC.player.eggs() >= 20 && Utils.rand( 6 ) === 0) ) { //Drider dreams proc
				MainView.outputText( '\nIn a moonlit forest, you hang upside down from a thick tree branch suspended by only a string of webbing.  You watch with rising lust as a hapless traveler strolls along below, utterly unaware of the trap you\'ve set.  Your breath catches as ' + CoC.player.mf( 'he', 'she' ) + ' finally encounters your web, flailing against the sticky strands in a futile attempt to free ' + CoC.player.mf( 'him', 'her' ) + 'self.  Once the traveller\'s struggles slow in fatigue, you descend easily to the forest floor, wrapping ' + CoC.player.mf( 'him', 'her' ) + ' in an elegant silk cocoon before pulling ' + CoC.player.mf( 'him', 'her' ) + ' up into the canopy.  Positioning your catch against the tree\'s trunk, you sink your fangs through the web and into flesh, feeling ' + CoC.player.mf( 'his', 'her' ) + ' body heat with every drop of venom.  Cutting ' + CoC.player.mf( 'his', 'her' ) + ' crotch free of your webbing, you open ' + CoC.player.mf( 'his', 'her' ) + ' [armor] and release the ' );
				if( CoC.player.hasVagina() ) {
					MainView.outputText( Descriptors.vaginaDescript( 0 ) + ' and ' );
				}
				MainView.outputText( Descriptors.cockDescript( 0 ) + ' therein; you lower yourself onto ' + CoC.player.mf( 'him', 'her' ) + ' over and over again, spearing your eager pussy with ' + CoC.player.mf( 'him', 'her' ) + ' prick' );
				if( CoC.player.hasVagina() ) {
					MainView.outputText( ' while you bend and force your own into her cunt' );
				}
				MainView.outputText( '.  It\'s not long until you feel ' );
				if( CoC.player.hasVagina() ) {
					MainView.outputText( 'her pussy clenching around you as you orgasm explosively inside, followed by ' );
				}
				MainView.outputText( 'the sensation of warm wetness in your own vagina.  Your prisoner groans as ' + CoC.player.mf( 'his', 'her' ) + ' cock twitches and spasms inside you, spraying your insides with seed; warm, delicious, sticky seed for your eggs.  You can feel it drawing closer to your unfertilized clutch, and as the gooey heat pushes toward them, your head swims, and you finally look into your prey\'s [face]...' );
				MainView.outputText( '\n\nYour eyes flutter open.  What a strange dream... aw, dammit.  You can feel your [armor] rubbing against your crotch, sodden with cum.  ' );
				if( CoC.player.cumQ() > 1000 ) {
					MainView.outputText( 'It\'s all over your bedroll, too...' );
				}
				MainView.outputText( '  Turning over and trying to find a dry spot, you attempt to return to sleep... the wet pressure against your crotch doesn\'t make it easy, nor do the rumbles in your abdomen, and you\'re already partway erect by the time you drift off into another erotic dream.  Another traveler passes under you, and you prepare to snare her with your web; your ovipositor peeks out eagerly and a bead of slime drips from it, running just ahead of the first fertilized egg you\'ll push into your poor victim...' );
				CoC.player.fertilizeEggs(); //reduce lust by 100 and add 20, convert eggs to fertilized depending on cum output
				CoC.player.orgasm();
				EngineCore.dynStats( 'lus', 20 );
				EngineCore.doNext( MainView, MainView.playerMenu );
				//Hey Fenoxo - maybe the unsexed characters get a few "cock up the ovipositor" scenes for fertilization with some characters (probably only willing ones)?
				//Hey whoever, maybe you write them? -Z
				return true;
			}
			var ceraph; //Ceraph's dreams - overlaps normal night-time dreams.
			switch( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00218 ] + CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00219 ] + CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00220 ] ) {
				case  0:
					ceraph = 0;
					break; //If you've given her no body parts then Ceraph will not cause any dreams
				case  1:
					ceraph = 10;
					break; //Once every 10 days if 1, once every 7 days if 2, once every 5 days if 3
				case  2:
					ceraph = 7;
					break;
				case  3:
					ceraph = 5;
					break;
				case  4:
					ceraph = 4;
					break;
				default:
					ceraph = 3;
			}
			if( ceraph > 0 && CoC.time.days % ceraph === 0 ) {
				SceneLib.ceraphScene.ceraphBodyPartDreams();
				return true;
			}
			if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00157 ] > 0 && CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00157 ] < 4 ) { //Dominika Dream
				MainView.outputText( '\n<b>Your rest is somewhat troubled with odd dreams...</b>\n' );
				SceneLib.dominika.fellatrixDream();
				return true;
			}
			if( SceneLib.anemoneScene.kidAXP() >= 40 && CoC.flags[ kFLAGS.HAD_KID_A_DREAM ] === 0 && CoC.player.gender > 0 ) {
				SceneLib.anemoneScene.kidADreams();
				CoC.flags[ kFLAGS.HAD_KID_A_DREAM ] = 1;
				return true;
			}
			if( CoC.player.viridianChange() ) {
				SceneLib.dreams.fuckedUpCockDreamChange();
				return true;
			}
			if( CoC.player.lib > 50 || CoC.player.lust > 40 ) { //Randomly generated dreams here
				if( SceneLib.dreams.dreamSelect() ) {
					return true;
				}
			}
		}
		if( CoC.player.statusAffectv1( StatusAffects.SlimeCraving ) >= 18 && CoC.player.str <= 1 ) { //Bad end!
			SceneLib.gooGirlScene.slimeBadEnd();
			return true;
		}
		if( CoC.player.hasCock() && CoC.player.cocks[ 0 ].cockType === CockTypesEnum.BEE && CoC.player.lust >= 100 ) {
			MainView.outputText( '\nYou can’t help it anymore, you need to find the bee girl right now.  You rush off to the forest to find the release that you absolutely must have.  Going on instinct you soon find the bee girl\'s clearing and her in it.\n\n' );
			SceneLib.beeGirlScene.beeSexForCocks( false );
			return true;
		}
		return false;
	};
	return PlayerEvents;
} );