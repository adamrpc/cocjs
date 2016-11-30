﻿'use strict';

angular.module( 'cocjs' ).run( function( $log, ArmorLib, WeaponLib, Combat, PregnancyStore, EncapsulationPod, Appearance, ConsumableLib, ImpHorde, Vala, Utils, PerkLib, StatusAffects, Descriptors, CockTypesEnum, EventParser, OnLoadVariables, AppearanceDefs, kFLAGS, CoC, EngineCore ) {
	function Dungeon2Supplimental() {
	}

	Dungeon2Supplimental.DUNGEON_CAVE_ENTRANCE = 10;
	Dungeon2Supplimental.DUNGEON_CAVE_TUNNEL = 11;
	Dungeon2Supplimental.DUNGEON_CAVE_GATHERING_HALL = 12;
	Dungeon2Supplimental.DUNGEON_CAVE_FUNGUS_CAVERN = 13;
	Dungeon2Supplimental.DUNGEON_CAVE_TORTURE_ROOM = 14;
	Dungeon2Supplimental.DUNGEON_CAVE_SECRET_TUNNEL = 15;
	Dungeon2Supplimental.DUNGEON_CAVE_ZETAZ_CHAMBER = 16;
	//Index:;
	//-Imp Gang;
	//-Plant - 'Encapsulation Start';
	//-Vala - 'OH GOD THE FAERIE STUFF';
	//-Zetaz - 'Zetaz Start';
	//-Items - 'Items Start';
	Dungeon2Supplimental.prototype.enterZetazsLair = function() {
		CoC.getInstance().scenes.dungeonCore.dungeonEnterRoom( Dungeon2Supplimental.DUNGEON_CAVE_ENTRANCE );
	};
	Dungeon2Supplimental.prototype.leaveZetazsLair = function() {
		//	inDungeon = false;;
		OnLoadVariables.dungeonLoc = 0;
		EngineCore.clearOutput();
		EngineCore.outputText( 'You leave the cave behind and take off through the deepwoods back towards camp.' );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	Dungeon2Supplimental.prototype.impHordeStartCombat = function() {
		Combat.startCombat( new ImpHorde(), true );
	};
	Dungeon2Supplimental.prototype.impGangAI = function() {
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.ImpUber ) >= 0 ) {
			this.impGangUber();
		} else if( CoC.getInstance().monster.lust > 50 && Utils.rand( 2 ) === 0 ) {
			this.impGangBukkake();
		} else {
			var choice = Utils.rand( 4 );
			if( choice < 3 ) {
				this.imtacularMultiHitzilla();
			} else {
				this.impGangUber();
			}
		}
		//(½ chance during any round):;
		if( Utils.rand( 2 ) === 0 ) {
			EngineCore.outputText( '\nOne of the tiny demons latches onto one of your ' + CoC.getInstance().player.legs() + ' and starts humping it.  You shake the little bastard off and keep fighting!', false );
			EngineCore.dynStats( 'lus', 1 );
		}
		Combat.combatRoundOver();
	};
	//IMP GANG [ATTACKS!]  ;
	Dungeon2Supplimental.prototype.imtacularMultiHitzilla = function() {
		//Multiattack:;
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.Blind ) < 0 ) {
			EngineCore.outputText( 'The imps come at you in a wave, tearing at you with claws!\n', false );
		}//(ALT BLINDED TEXT);
		else {
			EngineCore.outputText( 'In spite of their blindness, most of them manage to find you, aided by the clutching claws of their brothers.\n', false );
		}
		//(2-6 hits for 10 damage each);
		var hits = Utils.rand( 5 ) + 2;
		//Initial damage variable.;
		var damage = 0;
		//Loop through and apply dodges and whatnot for each hit.;
		while( hits > 0 ) {
			//Clear damage from last loop;
			damage = 0;
			//Blind dodge change;
			if( CoC.getInstance().monster.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
				EngineCore.outputText( CoC.getInstance().monster.getCapitalA() + CoC.getInstance().monster.short + ' completely misses you with a blind attack!\n', false );
			}
			//Determine if dodged!;
			else if( CoC.getInstance().player.spe - CoC.getInstance().monster.spe > 0 && Utils.rand( ((CoC.getInstance().player.spe - CoC.getInstance().monster.spe) / 4) + 90 ) > 80 ) {
				if( CoC.getInstance().player.spe - CoC.getInstance().monster.spe < 8 ) {
					EngineCore.outputText( 'You narrowly avoid ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + '\'s ' + CoC.getInstance().monster.weaponVerb + '!\n', false );
				} else if( CoC.getInstance().player.spe - CoC.getInstance().monster.spe >= 8 && CoC.getInstance().player.spe - CoC.getInstance().monster.spe < 20 ) {
					EngineCore.outputText( 'You dodge ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + '\'s ' + CoC.getInstance().monster.weaponVerb + ' with superior quickness!\n', false );
				} else if( CoC.getInstance().player.spe - CoC.getInstance().monster.spe >= 20 ) {
					EngineCore.outputText( 'You deftly avoid ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + '\'s slow ' + CoC.getInstance().monster.weaponVerb + '.\n', false );
				}
			}
			//Determine if evaded;
			else if( CoC.getInstance().player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
				EngineCore.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + '\'s attack.\n', false );
			} else if( CoC.getInstance().player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.getInstance().player.armorName === 'red, high-society bodysuit' ) {
				EngineCore.outputText( 'With the easy movement afforded by your bodysuit and Raphael\'s teachings, you easily avoid ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + '\'s attack.\n', false );
			}
			//Determine if cat'ed;
			else if( CoC.getInstance().player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
				EngineCore.outputText( 'With your incredible flexibility, you squeeze out of the way of ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + '', false );
				if( CoC.getInstance().monster.plural ) {
					EngineCore.outputText( '\' attacks.\n', false );
				} else {
					EngineCore.outputText( '\'s attack.\n', false );
				}
			}
			//OH SHIT SON YOU GOT REAPED;
			else {
				if( hits === 6 ) {
					EngineCore.outputText( 'You\'re clawed viciously by an imp!', false );
				}
				if( hits === 5 ) {
					EngineCore.outputText( 'One bites your ankle!', false );
				}
				if( hits === 4 ) {
					EngineCore.outputText( 'An imp rakes his claws down your back.', false );
				}
				if( hits === 3 ) {
					EngineCore.outputText( 'One of the little bastards manages to scratch up your legs!', false );
				}
				if( hits === 2 ) {
					EngineCore.outputText( 'Another imp punches you in the gut, hard!', false );
				}
				if( hits === 1 ) {
					EngineCore.outputText( 'Your arm is mauled by the clawing!', false );
				}
				damage = 20 - Utils.rand( CoC.getInstance().player.tou / 10 );
				if( damage <= 0 ) {
					damage = 1;
				}
				damage = CoC.getInstance().player.takeDamage( damage );
				EngineCore.outputText( ' (' + damage + ')\n', false );
			}
			hits--;
		}
	};
	//Bukkake:;
	Dungeon2Supplimental.prototype.impGangBukkake = function() {
		EngineCore.outputText( 'Many of the imps are overcome by the lust you\'ve inspired.  They hover in the air around you, pumping their many varied demonic rods as they bring themselves to orgasm.\n', false );
		//(2-6 hits);
		var hits = Utils.rand( 5 ) + 2;
		//Initial damage variable.;
		var damage = 0;
		//Loop through and apply dodges and whatnot for each hit.;
		while( hits > 0 ) {
			//+30% chance to avoid attack for evade;
			//Clear damage from last loop;
			damage = 0;
			//Blind dodge change;
			if( CoC.getInstance().monster.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
				EngineCore.outputText( CoC.getInstance().monster.getCapitalA() + CoC.getInstance().monster.short + '\' misguided spooge flies everyone.  A few bursts of it don\'t even land anywhere close to you!\n', false );
			}
			//Determine if dodged!;
			else if( CoC.getInstance().player.spe - CoC.getInstance().monster.spe > 0 && Utils.rand( ((CoC.getInstance().player.spe - CoC.getInstance().monster.spe) / 4) + 90 ) > 80 ) {
				damage = Utils.rand( 4 );
				if( damage === 0 ) {
					EngineCore.outputText( 'A wad of cum spatters into the floor as you narrowly sidestep it.\n', false );
				} else if( damage === 1 ) {
					EngineCore.outputText( 'One of the imps launches his seed so hard it passes clean over you, painting the wall white.\n', false );
				} else if( damage === 2 ) {
					EngineCore.outputText( 'You duck a glob of spooge and it passes harmlessly by.  A muffled grunt of disgust can be heard from behind you.\n', false );
				} else if( damage === 3 ) {
					EngineCore.outputText( 'You easily evade a blast of white fluid.\n', false );
				}
			}
			//Determine if evaded;
			else if( CoC.getInstance().player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 30 ) {
				damage = Utils.rand( 4 );
				EngineCore.outputText( '(Evade) ', false );
				if( damage === 0 ) {
					EngineCore.outputText( 'A wad of cum spatters into the floor as you narrowly sidestep it.\n', false );
				} else if( damage === 1 ) {
					EngineCore.outputText( 'One of the imps launches his seed so hard it passes clean over you, painting the wall white.\n', false );
				} else if( damage === 2 ) {
					EngineCore.outputText( 'You duck a glob of spooge and it passes harmlessly by.  A muffled grunt of disgust can be heard from behind you.\n', false );
				} else if( damage === 3 ) {
					EngineCore.outputText( 'You easily evade a blast of white fluid.\n', false );
				}
			} else if( CoC.getInstance().player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.getInstance().player.armorName === 'red, high-society bodysuit' ) {
				EngineCore.outputText( '(Misdirection) ', false );
				if( damage === 0 ) {
					EngineCore.outputText( 'A wad of cum spatters into the floor as you narrowly sidestep it.\n', false );
				} else if( damage === 1 ) {
					EngineCore.outputText( 'One of the imps launches his seed so hard it passes clean over you, painting the wall white.\n', false );
				} else if( damage === 2 ) {
					EngineCore.outputText( 'You duck a glob of spooge and it passes harmlessly by.  A muffled grunt of disgust can be heard from behind you.\n', false );
				} else if( damage === 3 ) {
					EngineCore.outputText( 'You easily evade a blast of white fluid.\n', false );
				}
			}
			//Determine if cat'ed;
			else if( CoC.getInstance().player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 15 ) {
				damage = Utils.rand( 4 );
				EngineCore.outputText( '(Agility) ', false );
				if( damage === 0 ) {
					EngineCore.outputText( 'A wad of cum spatters into the floor as you narrowly sidestep it.\n', false );
				} else if( damage === 1 ) {
					EngineCore.outputText( 'One of the imps launches his seed so hard it passes clean over you, painting the wall white.\n', false );
				} else if( damage === 2 ) {
					EngineCore.outputText( 'You duck a glob of spooge and it passes harmlessly by.  A muffled grunt of disgust can be heard from behind you.\n', false );
				} else if( damage === 3 ) {
					EngineCore.outputText( 'You easily evade a blast of white fluid.\n', false );
				}
			}
			//(2-6 hits for +10 lust each!) (-5 lust per successful hit);
			else {
				damage = Utils.rand( 6 );
				if( damage === 0 ) {
					EngineCore.outputText( 'A squirt of hot demonic cum splatters into your face!\n', false );
				}
				if( damage === 1 ) {
					EngineCore.outputText( 'Your ' + Descriptors.allBreastsDescript() + ' are coated with thick demonic spunk!\n', false );
				}
				if( damage === 2 ) {
					EngineCore.outputText( 'Some of the fluid splatters into your midriff and drools down to your waist, making your ' + CoC.getInstance().player.armorName + ' slimy and wet.\n', false );
				}
				if( damage === 3 ) {
					EngineCore.outputText( 'Seed lands in your ' + Descriptors.hairDescript() + ', slicking you with demonic fluid.\n', false );
				}
				if( damage === 4 ) {
					EngineCore.outputText( 'Another blast of jizz splatters against your face, coating your lips and forcing a slight taste of it into your mouth.\n', false );
				}
				if( damage === 5 ) {
					EngineCore.outputText( 'The last eruption of cum soaks your thighs and the lower portions of your ' + CoC.getInstance().player.armorName + ', turning it a sticky white.\n', false );
				}
				EngineCore.dynStats( 'lus', (7 + Math.ceil( CoC.getInstance().player.lib / 40 + CoC.getInstance().player.cor / 40 )) );
			}
			CoC.getInstance().monster.lust -= 5;
			hits--;
		}
	};
	//Mass Arousal;
	Dungeon2Supplimental.prototype.impGangUber = function() {
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.ImpUber ) < 0 ) {
			EngineCore.outputText( 'Three imps on the far side of the room close their eyes and begin murmuring words of darkness and power.  Your eyes widen, recognizing the spell.  Anything but that!  They\'re building up a massive arousal spell!  They keep muttering and gesturing, and you realize you\'ve got one round to stop them!\n', false );
			CoC.getInstance().monster.createStatusAffect( StatusAffects.ImpUber, 0, 0, 0, 0 );
		} else {
			//(OH SHIT IT GOES OFF) ;
			//+50 lust!;
			EngineCore.dynStats( 'lus', 50 );
			EngineCore.outputText( 'The imps in the back finish their spell-casting, and point at you in unison.  A wave of pure arousal hits you with the force of a freight train.   Your equipment rubs across your suddenly violently sensitive ' + Descriptors.nippleDescript( 0 ), false );
			if( CoC.getInstance().player.biggestLactation() > 1 ) {
				EngineCore.outputText( ' as they begin to drip milk', false );
			}
			EngineCore.outputText( '.  The lower portions of your coverings ', false );
			if( CoC.getInstance().player.cockTotal() > 0 ) {
				EngineCore.outputText( 'are pulled tight by your ' + CoC.getInstance().player.multiCockDescript() + ', ', false );
				if( CoC.getInstance().player.totalCocks() > 1 ) {
					EngineCore.outputText( 'each ', false );
				}
				EngineCore.outputText( 'beading a drop of pre-cum at the tip', false );
				if( CoC.getInstance().player.hasVagina() ) {
					EngineCore.outputText( ', and in addition, the clothes around your groin ', false );
				}
			}
			if( CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( 'become stained with feminine moisture', false );
				if( CoC.getInstance().player.clitLength > 3 ) {
					EngineCore.outputText( ' as your clit swells up in a more sensitive imitation of a cock', false );
				}
			}
			if( CoC.getInstance().player.gender === 0 ) {
				EngineCore.outputText( 'rub the sensitive skin of your thighs and featureless groin in a way that makes you wish you had a sex of some sort', false );
			}
			EngineCore.outputText( '.\n', false );
			CoC.getInstance().monster.removeStatusAffect( StatusAffects.ImpUber );
		}
	};
	Dungeon2Supplimental.prototype.loseToImpMob = function() {
		EngineCore.outputText( '', true );
		//(HP) ;
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'Unable to handle your myriad wounds, you collapse with your strength exhausted.\n\n', false );
		}
		//(LUST);
		else {
			EngineCore.outputText( 'Unable to handle the lust coursing through your body, you give up and collapse, hoping the mob will get you off.\n\n', false );
		}

		EngineCore.outputText( 'In seconds, the squirming red bodies swarm over you, blotting the rest of the room from your vision.  You can feel their scrabbling fingers and hands tearing off your ' + CoC.getInstance().player.armorName + ', exposing your body to their always hungry eyes.   Their loincloths disappear as their growing demonic members make themselves known, pushing the tiny flaps of fabric out of the way or outright tearing through them.   You\'re groped, touched, and licked all over, drowning in a sea of long tongues and small nude bodies.\n\n', false );
		EngineCore.outputText( 'You\'re grabbed by the chin, and your jaw is pried open to make room for a swollen dog-dick.   It\'s shoved in without any warmup or fan-fare, and you\'re forced to taste his pre in the back of your throat.  You don\'t dare bite down or resist in such a compromised position, and you\'re forced to try and suppress your gag reflex and keep your teeth back as he pushes the rest of the way in, burying his knot behind your lips.\n\n', false );
		//(tits);
		if( CoC.getInstance().player.biggestTitSize() > 1 ) {
			EngineCore.outputText( 'A sudden weight drops onto your chest as one of the demons straddles your belly, allowing his thick, tainted fuck-stick to plop down between your ' + Descriptors.allBreastsDescript() + '.  The hot fluid leaking from his nodule-ringed crown  swiftly lubricates your cleavage.  In seconds the little devil is squeezing your ' + Descriptors.breastDescript( 0 ) + ' around himself as he starts pounding his member into your tits.  The purplish tip peeks out between your jiggling flesh mounds, dripping with tainted moisture.', false );
			if( CoC.getInstance().player.biggestLactation() > 1 ) {
				EngineCore.outputText( '  Milk starts to squirt from the pressure being applied to your ' + Descriptors.breastDescript( 0 ) + ', which only encourages the imp to squeeze even harder.', false );
			}
			EngineCore.outputText( '\n\n', false );
		}
		//(NIPPLECUNTS!);
		if( CoC.getInstance().player.hasFuckableNipples() ) {
			EngineCore.outputText( 'A rough tweak on one of your nipples startles you, but your grunt of protest is turned into a muffled moan when one of the imp\'s tiny fingers plunges inside your ' + Descriptors.nippleDescript( 0 ) + '.  He pulls his hand out, marveling at the sticky mess, and wastes no time grabbing the top of your tit with both hands and plunging himself in.', false );
			if( CoC.getInstance().player.biggestTitSize() < 7 ) {
				EngineCore.outputText( '  He can only get partway in, but it doesn\'t seem to deter him.', false );
			} else {
				EngineCore.outputText( '  Thanks to your massive bust, he is able to fit his entire throbbing prick inside you.', false );
			}
			EngineCore.outputText( '  The demon starts pounding your tit with inhuman vigor, making the entire thing wobble enticingly.  The others, seeing their brother\'s good time, pounce on ', false );
			if( CoC.getInstance().player.totalNipples() > 2 ) {
				EngineCore.outputText( 'each of ', false );
			}
			EngineCore.outputText( 'your other ' + Descriptors.nippleDescript( 0 ), false );
			if( CoC.getInstance().player.totalNipples() > 2 ) {
				EngineCore.outputText( 's', false );
			}
			EngineCore.outputText( ', fighting over the opening', false );
			if( CoC.getInstance().player.totalNipples() > 2 ) {
				EngineCore.outputText( 's', false );
			}
			EngineCore.outputText( '.  A victor quickly emerges, and in no time ', false );
			if( CoC.getInstance().player.totalNipples() === 2 ) {
				EngineCore.outputText( 'both', false );
			} else {
				EngineCore.outputText( 'all the', false );
			}
			EngineCore.outputText( ' openings on your chest are plugged with a tumescent demon-cock.\n\n', false );
		}
		//(SINGLE PEN) ;
		if( !CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'Most of the crowd centers itself around your lower body, taking a good long look at your ' + Descriptors.assholeDescript() + '.  An intrepid imp steps forwards and pushes his member into the unfilled orifice.  You\'re stretched wide by the massive and unexpectedly forceful intrusion.  The tiny corrupted nodules stroke every inch of your interior, eliciting uncontrollable spasms from your inner muscles.  The unintentional dick massage gives your rapist a wide smile, and he reaches down to smack your ass over and over again throughout the ordeal.', false );
			CoC.getInstance().player.buttChange( 12, true, true, false );
			EngineCore.outputText( '\n\n', false );
		}
		//(DOUBLE PEN);
		else {
			EngineCore.outputText( 'Most of the crowd centers itself around your lower body, taking a good long look at your pussy and asshole.  Two intrepid imps step forward and push their members into the unplugged orifices.  You\'re stretched wide by the massive, unexpectedly forceful intrusions.  The tiny corrupted nodules stroke every inch of your interiors, eliciting uncontrollable spasms from your inner walls.  The unintentional dick massage gives your rapists knowing smiles, and they go to town on your ass, slapping it repeatedly as they double-penetrate you.', false );
			CoC.getInstance().player.buttChange( 12, true, true, false );
			CoC.getInstance().player.cuntChange( 12, true, true, false );
			EngineCore.outputText( '\n\n', false );
		}
		//(DICK!);
		if( CoC.getInstance().player.totalCocks() > 0 ) {
			EngineCore.outputText( 'Some of the other imps, feeling left out, fish out your ' + CoC.getInstance().player.multiCockDescript() + '.  They pull their own members alongside yours and begin humping against you, frotting as their demonic lubricants coat the bundle of cock with slippery slime.   Tiny hands bundle the dicks together and you find yourself enjoying the stimulation in spite of the brutal fucking you\'re forced to take.  Pre bubbles up, mixing with the demonic seed that leaks from your captors members until your crotch is sticky with frothing pre.\n\n', false );
		}
		//(ORGAZMO);
		EngineCore.outputText( 'As one, the crowd of demons orgasm.  Hot spunk gushes into your ass, filling you with uncomfortable pressure.  ', false );
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'A thick load bastes your pussy with whiteness, and you can feel it seeping deeper inside your fertile womb.  ', false );
		}
		EngineCore.outputText( 'Your mouth is filled with a wave of thick cream.  Plugged as you are by the demon\'s knot, you\'re forced to guzzle down the stuff, lest you choke on his tainted baby-batter.', false );
		if( CoC.getInstance().player.biggestTitSize() > 1 ) {
			EngineCore.outputText( '  More and more hits your chin as the dick sandwiched between your tits unloads, leaving the whitish juice to dribble down to your neck.', false );
			if( CoC.getInstance().player.hasFuckableNipples() ) {
				if( CoC.getInstance().player.totalNipples() === 2 ) {
					EngineCore.outputText( '  The pair', false );
				} else {
					EngineCore.outputText( '  The group', false );
				}
				EngineCore.outputText( ' of cocks buried in your ' + Descriptors.nippleDescript( 0 ) + ' pull free before they cum, dumping the spooge into the gaping holes they\'ve left behind.  It tingles hotly, making you quiver with pleasure.', false );
			}
		}
		EngineCore.outputText( '  Finally, your own orgasm arrives, ', false );
		if( CoC.getInstance().player.cockTotal() === 0 ) {
			EngineCore.outputText( 'and you clench tightly around the uncomfortable intrusion.', false );
		} else {
			EngineCore.outputText( 'and ' + CoC.getInstance().player.sMultiCockDesc() + ' unloads, splattering the many demons with a bit of your own seed.  You\'d smile if your mouth wasn\'t so full of cock.  At least you got to make a mess of them!', false );
		}
		if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '  Your cunt clenches around the invading cock as orgasm takes you, massaging the demonic tool with its instinctual desire to breed.  Somehow you get him off again, and take another squirt of seed into your waiting cunt.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'Powerless and in the throes of post-coital bliss, you don\'t object as you\'re lifted on the table', false );
		if( !CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( ' and forced to start drinking bottle after bottle of succubi milk', false );
		}
		EngineCore.outputText( '.  You pass out just as round two is getting started, but the demons don\'t seem to mind....', false );
		EngineCore.doNext( this.loseToImpMobII );
	};
	//[IMP GANGBANG VOL 2];
	Dungeon2Supplimental.prototype.loseToImpMobII = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You wake up, sore from the previous activity and a bit groggy.  You try to move, but find yourself incapable.  Struggling futilely, you thrash around until you realize your arms and legs are strapped down with heavy iron restraints.  You gasp out loud when you look down and discover your ', false );
		if( CoC.getInstance().player.biggestTitSize() < 1 ) {
			EngineCore.outputText( 'new', false );
		} else {
			EngineCore.outputText( 'much larger', false );
		}
		EngineCore.outputText( ' tits, wobbling with every twist and movement you make.  You\'re stark naked, save for a sheer and somewhat perverse nurse\'s outfit.   The room around you looks to be empty, though you can see a number of blankets piled in the corners and a few cages full of spooge-covered faeries, all snoring contently.\n\n', false );

		EngineCore.outputText( 'Eventually a lone imp enters the room.  It\'s Zetaz!  He looks you up and down and decrees, "<i>You\'re ready.</i>"  You struggle to shout him down, but all that escapes the gag in your mouth is incomprehensible gibberish.  He chuckles and flips a switch on the wall, and suddenly the most heavenly vibration begins within your sopping twat.', false );
		if( !CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( '...Wait, your what?  You have a cunt now!?', false );
		}
		EngineCore.outputText( '  Your eyes cross at the pleasure as your mind struggles to figure out why it feels so good.\n\n', false );
		EngineCore.outputText( 'Zetaz pours a few bottles into a larger container and connects a tube to an opening on the bottom of the bottle.  Your eyes trace the tube back to the gag in your mouth, and after feeling around with your tongue, you realize it\'s been threaded through the gag and down your throat.   Zetaz lifts up the bottle and hangs it from a hook on the ceiling, and you watch in horror as the fluid flows through the tube, helpless to stop it.  You shake your head desperately, furious at having fallen into the little fucker\'s hands at last.\n\n', false );
		EngineCore.outputText( 'Zetaz walks up and paws at your ', false );
		if( CoC.getInstance().player.biggestTitSize() < 1 ) {
			EngineCore.outputText( 'new', false );
		} else {
			EngineCore.outputText( 'larger', false );
		}
		EngineCore.outputText( ' mounds, flitting into the air to bring himself to eye-level.  He rambles, "<i>It\'s so good to see you again, ' + CoC.getInstance().player.short + '.  Because of you, I had to flee from my honored place by Lethice\'s side.  I\'ve had to hide in this fetid forest.  I\'ll admit, it hasn\'t been all bad.  We\'ve caught a few faeries to play with, and with you here, the boys and I will have lots of fun.  We just need to reshape that troubled mind a little bit.</i>"\n\n', false );
		EngineCore.outputText( 'You barely register his monologue.  You\'re far too busy cumming hard on the vibrating intruder that\'s currently giving your stuffed snatch the workout of a lifetime.  Zetaz chuckles at your vacant stare and massages your temples gently, and you feel the touch of his dark magic INSIDE you.  It feels warm and wet, matching the feel of your body\'s other intrusion.   You try to fight it, and for a moment you feel like you might push the demon out of your mind.  Then your body cums, and your resistance melts away.  You violently thrash against your restraints, caving in to the pleasure as the imp rapes your body and mind as one.\n\n', false );
		EngineCore.outputText( 'The desire to protect your village drips out between your legs, and thoughts of your independence are fucked away into nothing.  It feels good to cum, and your eyes cross when you see the bulge at your master\'s crotch, indicative of how well you\'re pleasing him.  It feels so good to obey!  Zetaz suddenly kisses you, and you enthusiastically respond in between orgasms.\n\n', false );
		EngineCore.outputText( 'You gladly live out the rest of your life, fucking and birthing imps over and over as their live-in broodmother.', false );
		CoC.getInstance().player.orgasm();
		CoC.getInstance().player.HP += 100;
		EventParser.gameOver();
	};
	//WIN;
	Dungeon2Supplimental.prototype.impGangVICTORY = function() {
		EngineCore.outputText( '', true );
		//Flag them defeated!;
		CoC.getInstance().flags[ kFLAGS.ZETAZ_IMP_HORDE_DEFEATED ] = 1;
		if( CoC.getInstance().monster.HP < 1 ) {
			EngineCore.outputText( 'The last of the imps collapses into the pile of his defeated comrades.  You\'re not sure how you managed to win a lopsided fight, but it\'s a testament to your new-found prowess that you succeeded at all.', false );
		} else {
			EngineCore.outputText( 'The last of the imps collapses, pulling its demon-prick free from the confines of its loincloth.  Surrounded by masturbating imps, you sigh as you realize how enslaved by their libidos the foul creatures are.', false );
		}
		if( CoC.getInstance().player.lust >= 33 && CoC.getInstance().player.gender > 0 ) {
			EngineCore.outputText( '\n\nFeeling a bit horny, you wonder if you should use them to sate your budding urges before moving on.  Do you rape them?', false );
			if( CoC.getInstance().player.gender === 1 ) {
				EngineCore.choices( 'Rape', this.impGangGetsRapedByMale, '', null, '', null, '', null, 'Leave', Combat.cleanupAfterCombat );
			}
			if( CoC.getInstance().player.gender === 2 ) {
				EngineCore.choices( 'Rape', this.impGangGetsRapedByFemale, '', null, '', null, '', null, 'Leave', Combat.cleanupAfterCombat );
			}
			if( CoC.getInstance().player.gender === 3 ) {
				EngineCore.choices( 'Male Rape', this.impGangGetsRapedByMale, 'Female Rape', this.impGangGetsRapedByFemale, '', null, '', null, 'Leave', Combat.cleanupAfterCombat );
			}
		} else {
			Combat.cleanupAfterCombat();
		}
	};
	//RAEP -M;
	Dungeon2Supplimental.prototype.impGangGetsRapedByMale = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You walk around and pick out three of the demons with the cutest, girliest faces.  You set them on a table and pull aside your ' + CoC.getInstance().player.armorName + ', revealing your ' + CoC.getInstance().player.multiCockDescriptLight() + '.  You say, "<i>Lick,</i>" in a tone that brooks no argument.  The feminine imps nod and open wide, letting their long tongues free.   Narrow and slightly forked at the tips, the slippery tongues wrap around your ' + Descriptors.cockDescript( 0 ) + ', slurping wetly as they pass over each other in their attempts to please you.\n\n', false );
		EngineCore.outputText( 'Grabbing the center one by his horns, you pull him forwards until your shaft is pressed against the back of his throat.  He gags audibly, but you pull him back before it can overwhelm him, only to slam it in deep again.  ', false );
		EngineCore.outputText( 'The girly imp to your left, seeing how occupied your ' + Descriptors.cockDescript( 0 ) + ' is, shifts his attention down to your ', false );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( Descriptors.ballsDescriptLight(), false );
		} else if( CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
		} else {
			EngineCore.outputText( 'ass', false );
		}
		EngineCore.outputText( ', licking with care', false );
		if( CoC.getInstance().player.balls === 0 ) {
			EngineCore.outputText( ' and plunging deep inside', false );
		}
		EngineCore.outputText( '.  The imp to the right wraps his tongue around the base ', false );
		if( CoC.getInstance().player.hasSheath() ) {
			EngineCore.outputText( 'just above your sheath ', false );
		}
		EngineCore.outputText( ' and pulls it tight, acting as an organic cock-ring.\n\n', false );
		EngineCore.outputText( 'Fucking the little bitch of a demon is just too good, and you quickly reach orgasm.  ', false );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( 'Cum boils in your balls, ready to paint your foe white.  ', false );
		}
		EngineCore.outputText( 'With a mighty heave, you yank the imp forward, ramming your cock deep into his throat.  He gurgles noisily as you unload directly into his belly.   Sloshing wet noises echo in the room as his belly bulges slightly from the load, and his nose dribbles cum.   You pull him off and push him away.  He coughs and sputters, but immediately starts stroking himself, too turned on to care.', false );
		if( CoC.getInstance().player.cumQ() > 1000 ) {
			EngineCore.outputText( '  You keep cumming while the other two imps keep licking and servicing you.   By the time you finish, they\'re glazed in spooge and masturbating as well.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'Satisfied, you redress and prepare to continue with your exploration of the cave.', false );
		EngineCore.dynStats( 'cor', 1 );
		CoC.getInstance().player.orgasm();
		Combat.cleanupAfterCombat();
	};
	//RAEP-F;
	Dungeon2Supplimental.prototype.impGangGetsRapedByFemale = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You walk around to one of the demons and push him onto his back.  Your ' + CoC.getInstance().player.armorName + ' falls to the ground around you as you disrobe, looking over your tiny conquest.  A quick ripping motion disposes of his tiny loincloth, leaving his thick demon-tool totally unprotected. You grab and squat down towards it, rubbing the corrupted tool between your legs ', false );
		if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness >= AppearanceDefs.VAGINA_WETNESS_SLICK ) {
			EngineCore.outputText( 'and coating it with feminine drool ', false );
		}
		EngineCore.outputText( 'as you become more and more aroused.  It parts your lips and slowly slides in.  The ring of tainted nodules tickles you just right as you take the oddly textured member further and further into your willing depths.', false );
		CoC.getInstance().player.cuntChange( 15, true, true, false );
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'At last you feel it bottom out, bumping against your cervix with the tiniest amount of pressure.  Grinning like a cat with the cream, you swivel your hips, grinding your ' + Descriptors.clitDescript() + ' against him in triumph.  ', false );
		if( CoC.getInstance().player.clitLength > 3 ) {
			EngineCore.outputText( 'You stroke the cock-like appendage in your hand, trembling with delight.  ', false );
		}
		EngineCore.outputText( 'You begin riding the tiny demon, lifting up, and then dropping down, feeling each of the nodes gliding along your sex-lubed walls.   As time passes and your pleasure mounts, you pick up the pace, until you\'re bouncing happily atop your living demon-dildo.\n\n', false );
		EngineCore.outputText( 'The two of you cum together, though the demon\'s pleasure starts first.  A blast of his tainted seed pushes you over the edge.  You sink the whole way down, feeling him bump your cervix and twitch inside you, the bumps on his dick swelling in a pulsating wave in time with each explosion of fluid.  ', false );
		if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness >= AppearanceDefs.VAGINA_WETNESS_SLAVERING ) {
			EngineCore.outputText( 'Cunt juices splatter him as you squirt explosively, leaving a puddle underneath him.  ', false );
		} else {
			EngineCore.outputText( 'Cunt juices drip down his shaft, oozing off his balls to puddle underneath him.  ', false );
		}
		EngineCore.outputText( 'The two of you lie together, trembling happily as you\'re filled to the brim with tainted fluids.\n\n', false );
		EngineCore.outputText( 'Sated for now, you rise up, your body dripping gooey whiteness.  Though in retrospect it isn\'t nearly as much as was pumped into your womb.', false );
		if( CoC.getInstance().player.pregnancyIncubation === 0 ) {
			EngineCore.outputText( '  You\'ll probably get pregnant.', false );
		}
		EngineCore.dynStats( 'cor', 1 );
		CoC.getInstance().player.orgasm();
		CoC.getInstance().player.knockUp( PregnancyStore.PREGNANCY_IMP, PregnancyStore.INCUBATION_IMP - 14, 50 );
		Combat.cleanupAfterCombat();
	};
	Dungeon2Supplimental.prototype.enterZetazsRoomFromTheSouth = function() {
		if( CoC.getInstance().flags[ kFLAGS.ZETAZ_DOOR_UNLOCKED ] === 0 ) {
			EngineCore.clearOutput();
			EngineCore.outputText( 'The door won\'t budge.' );
			EngineCore.doNext( EventParser.playerMenu );
			return;
		} else {
			CoC.getInstance().scenes.dungeonCore.dungeonEnterRoom( Dungeon2Supplimental.DUNGEON_CAVE_ZETAZ_CHAMBER );
		}
	};
	//Encapsulation Start;
	//[Get it];
	Dungeon2Supplimental.prototype.getSwordAndGetTrapped = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You start to walk over to the corpse and its discarded weapon, but halfway through your journey, the unexpected happens.   The leaf-like petals shift underfoot, snapping up with lightning-quick speed.  You ', false );
		if( CoC.getInstance().player.spe < 50 ) {
			EngineCore.outputText( 'fall flat on your ' + Descriptors.assDescript() + ', slipping on the slick, shifting surface.', false );
		} else {
			EngineCore.outputText( 'stumble and nearly fall, slipping on the shifting, slick surface.', false );
		}
		//[ADD 'CONTINUE' ON];
		this.getTrappedContinuation();
	};
	//[Fly-Get It];
	Dungeon2Supplimental.prototype.flyToSwordAndGetTrapped = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You start to fly over to the corpse and its discarded weapon, but about halfway through your flight, the unexpected happens.  One of the leaf-like petals springs up and slaps into your face with stunning force, dropping you to the ground.  You try to pick yourself up, but slip on the shifting, slick surface of another pad.', false );
		//[ADD 'CONTINUE' ON];
		this.getTrappedContinuation();
	};
	//[CONTINUE ON] ;
	Dungeon2Supplimental.prototype.getTrappedContinuation = function() {
		EngineCore.outputText( '\n\nA loud \'slap\' nearly deafens you, and the visible light instantly diminishes to a barely visible, purple glow.  The fungal \'leaves\' have completely encapsulated you, sealing you inside a fleshy, purple pod.  No light can penetrate the thick sheath surrounding you, but muted illumination pulses from the flexing walls of your new prison, oscillating in strength with the subtle shifts of the organic chamber.\n\n', false );
		EngineCore.outputText( 'The sweet aroma that you smelled before is much, MUCH stronger when enclosed like this.  It\'s strong enough to make you feel a little dizzy and light-headed.  Deciding that you had best escape from this impromptu prison with all possible speed, you try to find a joint to force your way out through, but the pod\'s walls appear completely seamless.  You pound on the mushy surface, but your repeated blows have little effect.  Each impact brings with it a burst of violet radiance, but the fungus seems built to resist such struggles.  Moisture beads on the capsule\'s walls in larger and larger quantities, drooling into a puddle around your feet.\n\n', false );
		EngineCore.outputText( 'Meanwhile, a number of tentacles have sprung up from below, and are crawling up your ' + CoC.getInstance().player.legs() + '.  It\'s becoming fairly clear how the skeleton wound up in this cave...  You\'ve got to escape!', false );
		//[FIGHT];
		Combat.startCombat( new EncapsulationPod(), true );
	};

	Dungeon2Supplimental.prototype.encapsulationPodAI = function() {
		//[Round 1 Action];
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.Round ) < 0 ) {
			EngineCore.outputText( 'You shiver from the feeling of warm wetness crawling up your ' + CoC.getInstance().player.legs() + '.   Tentacles brush against your ', false );
			if( CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( Descriptors.ballsDescriptLight() + ' ', false );
				if( CoC.getInstance().player.hasVagina() ) {
					EngineCore.outputText( 'and ', false );
				}
			}
			if( CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( Descriptors.vaginaDescript( 0 ) + ' ', false );
			} else if( CoC.getInstance().player.balls === 0 ) {
				EngineCore.outputText( 'taint ', false );
			}
			EngineCore.outputText( 'as they climb ever-further up your body.  In spite of yourself, you feel the touch of arousal licking at your thoughts.\n', false );
			if( CoC.getInstance().player.lust < 35 ) {
				EngineCore.dynStats( 'lus', 1 );
				CoC.getInstance().player.lust = 35;
				EngineCore.statScreenRefresh();
			}
		}
		//[Round 2 Action];
		else if( CoC.getInstance().monster.statusAffectv1( StatusAffects.Round ) === 2 ) {
			EngineCore.outputText( 'The tentacles under your ' + CoC.getInstance().player.armorName + ' squirm against you, seeking out openings to penetrate and genitalia to caress.  ', false );
			if( CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( 'One of them wraps itself around the top of your ' + Descriptors.sackDescript() + ' while its tip slithers over your ' + Descriptors.ballsDescriptLight() + '.  Another ', false );
			} else {
				EngineCore.outputText( 'One ', false );
			}
			if( CoC.getInstance().player.cockTotal() > 0 ) {
				EngineCore.outputText( 'prods your ' + Descriptors.cockDescript( 0 ) + ' for a second before it begins slithering around it, snake-like.  Once it has you encircled from ' + CoC.getInstance().player.cockHead() + ' to ', false );
				if( !CoC.getInstance().player.hasSheath() ) {
					EngineCore.outputText( 'base', false );
				} else {
					EngineCore.outputText( 'sheath', false );
				}
				EngineCore.outputText( ', it begins to squeeze and relax to a pleasant tempo.  ', false );
			} else {
				if( CoC.getInstance().player.hasVagina() ) {
					EngineCore.outputText( 'prods at your groin, circling around your ' + Descriptors.vaginaDescript( 0 ) + ' deliberately, as if seeking other toys to play with.  ', false );
					if( CoC.getInstance().player.clitLength > 4 ) {
						EngineCore.outputText( 'It brushes your ' + Descriptors.clitDescript() + ' then curls around it, squeezing and gently caressing it with a slow, pleasing rhythm.  ', false );
					}
				} else {
					EngineCore.outputText( 'prods your groin before curling around to circle your ' + Descriptors.assholeDescript() + ' playfully.  The entire tendril pulses in a pleasant, relaxing way.  ', false );
				}
			}
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 'Your other ', false );
				if( CoC.getInstance().player.cockTotal() === 2 ) {
					EngineCore.outputText( Descriptors.cockDescript( 1 ) + ' gets the same treatment, and soon both of your ' + CoC.getInstance().player.multiCockDescriptLight() + ' are quite happy to be here.  ', false );
				} else {
					EngineCore.outputText( CoC.getInstance().player.multiCockDescriptLight() + ' get the same treatment and soon feel quite happy to be here.  ', false );
				}
			}
			if( CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( 'The violation of your ' + Descriptors.vaginaDescript( 0 ) + ' is swift and painless.  The fungus\' slippery lubricants make it quite easy for it to slip inside, and you find your ' + Descriptors.vaginaDescript( 0 ) + ' engorging with pleasure in spite of your need to escape.  The tentacle folds up so that it can rub its stalk over your ' + Descriptors.clitDescript() + ', ', false );
				if( CoC.getInstance().player.clitLength > 3 ) {
					EngineCore.outputText( 'and once it discovers how large it is, it wraps around it and squeezes.  It feels good!  ', false );
				} else {
					EngineCore.outputText( 'and it has quite an easy time making your bud grow hard and sensitive.  The constant rubbing feels good!  ', false );
				}
			}
			EngineCore.outputText( 'One \'lucky\' stalk manages to find your ' + Descriptors.assholeDescript() + '.  As soon as it touches your rear \'entrance\', it lunges forward to penetrate you.  The fluids coating the tentacle make your muscles relax, allowing it to slide inside you with ease.\n\n', false );
			EngineCore.outputText( 'The rest of the mass continues to crawl up you.  They tickle at your ', false );
			if( CoC.getInstance().player.pregnancyIncubation > 0 && CoC.getInstance().player.pregnancyIncubation < 120 ) {
				EngineCore.outputText( 'pregnant ', false );
			}
			EngineCore.outputText( 'belly as they get closer and closer to ', false );
			if( CoC.getInstance().player.biggestTitSize() < 1 ) {
				EngineCore.outputText( 'your chest', false );
			} else {
				EngineCore.outputText( 'the underside of your ' + Descriptors.allBreastsDescript(), false );
			}
			EngineCore.outputText( '.  Gods above, this is turning you on!  Your lower body is being violated in every conceivable way and it\'s only arousing you more.  Between the mind-numbing smell and the sexual assault you\'re having a hard time focusing.\n', false );
			if( CoC.getInstance().player.lust < 65 ) {
				EngineCore.dynStats( 'lus', 1 );
				CoC.getInstance().player.lust = 65;
				EngineCore.statScreenRefresh();
			}
		}
		//[Round 3 Action];
		else if( CoC.getInstance().monster.statusAffectv1( StatusAffects.Round ) === 3 ) {
			EngineCore.outputText( 'The wet, warm pressure of the fungus\' protrusion working their way up your body feels better than it has any right to be.  It\'s like a combination of a warm bath and a gentle massage, and when combined with the thought-numbing scent in the air, it\'s nigh-impossible to resist relaxing a little.  In seconds the mass of tentacles is underneath your ' + CoC.getInstance().player.armorName + ' and rubbing over your chest and ' + Descriptors.nippleDescript( 0 ) + 's.  You swoon from the sensation and lean back against the wall while they stroke and caress you, teasing your sensitive ' + Descriptors.nippleDescript( 0 ) + '.', false );
			if( CoC.getInstance().player.hasFuckableNipples() ) {
				EngineCore.outputText( '  Proof of your arousal leaks from each ' + Descriptors.nippleDescript( 0 ) + ' as their entrances part for the probing tentacles.  They happily dive inside to begin fucking your breasts, doubling your pleasure.', false );
			}
			EngineCore.outputText( '  Moans escape your mouth as your hips begin to rock in time with the tentacles and the pulsing luminance of your fungus-pod.  It would be easy to lose yourself here.  You groan loudly enough to startle yourself back to attention.  You\'ve got to get out!\n\n', false );
			EngineCore.outputText( 'The tentacles that aren\'t busy with your ' + Descriptors.allBreastsDescript() + ' are already climbing higher, and the slime has reached your waist.  If anything it actually makes the constant violation more intense and relaxing.  You start to sink down into it, but catch yourself and pull yourself back up.  No! You\'ve got to fight!\n', false );
			if( CoC.getInstance().player.lust < 85 ) {
				EngineCore.dynStats( 'lus', 1 );
				CoC.getInstance().player.lust = 85;
				EngineCore.statScreenRefresh();
			}
		}
		//[Round 4 Action];
		else {
			EngineCore.outputText( 'What\'s happening to you definitely isn\'t rape.  Not any more.  You like it too much.  You lean back against a wall of the pod and thrust your ' + Descriptors.hipDescript() + ' pitifully against a phantom lover, moaning lewdly as you\'re forcibly pleasured.  You grab hold of the fleshy walls with your hands and try to hold yourself up, but your ' + CoC.getInstance().player.legs() + ' have the consistency of jello.   They fold neatly underneath you as you slide into the ooze and begin to float inside it.  It\'s comforting in an odd way, and while you\'re gasping in between moans, your balance finally gives out.  You sink deeper into the fluid and lose all sense of direction.  Up and down become meaningless constructs that no longer matter to you.\n\n', false );
			EngineCore.outputText( 'The thick slime passes over your lips and nose as you sink into the rising tide of bliss, and you find yourself wondering how you\'ll breathe.  Instinctively, you hold your breath.  Even riddled with sexual bliss and thought-obliterating drugs, you won\'t let yourself open your mouth when \'underwater\'.  The lack of oxygen makes your heart hammer in your chest', false );
			if( CoC.getInstance().player.totalCocks() > 0 ) {
				EngineCore.outputText( ', and ' + CoC.getInstance().player.sMultiCockDesc() + ' bloats with blood, getting larger than ever', false );
			}
			EngineCore.outputText( '.  Before you can pass out, the constant penetration forces a moan from your lips.\n\n', false );
			EngineCore.outputText( 'A tentacle takes the opportunity to slip into your mouth along with a wave of the slime.  You try to cough out the fluid, but there isn\'t any air left in your lungs to push it out.  The orally-fixated tendril widens and begins to pour more of it inside you, and with nowhere else to go, it packs your goo-filled lungs to the brim before you start to swallow.  You relax and exhale the last of your air from your nose as your body calms itself.  Somehow you can breathe the fungus-pod\'s fluids!\n\n', false );
			EngineCore.outputText( 'You\'re floating in pure liquid bliss.  Thoughts melt away before they can form, and every inch of your body is being caressed, squeezed, or penetrated by the warm, slime-slicked tentacles.  Nearly every muscle in your body goes completely slack as you\'re cradled with bliss.  Without your thoughts or stress bothering you, the pleasure swiftly builds to a crescendo.\n\n', false );
			EngineCore.outputText( 'The wave of need starts out inside your crotch, begging to be let out, but you can\'t even be bothered to move your ' + Descriptors.hipDescript() + ' anymore.  Without your help, release stays just out of reach, but the tentacles working your body seem intent on spurring it on.  The one inside your ' + Descriptors.assholeDescript() + ' begins to pump more quickly, and with the added pressure, you cum quickly.  ', false );
			if( !CoC.getInstance().player.hasVagina() ) {
				EngineCore.outputText( 'Your body twitches weakly, too relaxed to move while it gets off from anal penetration.', false );
			} else {
				EngineCore.outputText( 'Your body twitches weakly, too relaxed to move while it gets off from being double-penetrated.', false );
			}
			if( CoC.getInstance().player.hasFuckableNipples() ) {
				EngineCore.outputText( '  Your ' + Descriptors.nippleDescript( 0 ) + 's squirt around their phallic partners, leaking sexual lubricant ', false );
				if( CoC.getInstance().player.biggestLactation() > 1 ) {
					EngineCore.outputText( 'and milk ', false );
				}
				EngineCore.outputText( 'while the fucking continues.', false );
			}
			if( CoC.getInstance().player.cockTotal() > 0 ) {
				EngineCore.outputText( '  The tentacles around ' + CoC.getInstance().player.sMultiCockDesc() + ' squeeze and rotate, screwing you silly through your orgasm while cum dribbles in a steady stream from your loins.  Normally it would be squirting out in thick ropes, but the muscle-relaxing drugs in your system make the spurts a steady, weak flow.', false );
				if( CoC.getInstance().player.cumQ() > 800 ) {
					EngineCore.outputText( '  Of course with all the semen you produce, the flesh-pod\'s ooze clouds over quite quickly, blocking your vision with a purple-white haze.', false );
				}
			}
			if( CoC.getInstance().player.biggestLactation() > 1 ) {
				EngineCore.outputText( 'Milk leaks out too, ', false );
				if( CoC.getInstance().player.biggestLactation() < 2 ) {
					EngineCore.outputText( 'though the slight dribble is barely noticeable to you.', false );
				} else if( CoC.getInstance().player.biggestLactation() < 3 ) {
					EngineCore.outputText( 'coloring things a little more white.', false );
				} else {
					EngineCore.outputText( 'thickening your fluid-filled prison with nutrients.', false );
				}
			}
			//[NEXT – CHOOSE APPRORIATE];
			EngineCore.doNext( this.loseToThisShitPartII );
			return;
		}
		//Set flags for rounds;
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.Round ) < 0 ) {
			CoC.getInstance().monster.createStatusAffect( StatusAffects.Round, 2, 0, 0, 0 );
		} else {
			CoC.getInstance().monster.addStatusValue( StatusAffects.Round, 1, 1 );
		}
		Combat.combatRoundOver();
	};
	Dungeon2Supplimental.prototype.loseToThisShitPartII = function() {
		EngineCore.hideUpDown();
		EngineCore.outputText( '', true );
		//[OPTIONAL CUM ESCAPE];
		if( CoC.getInstance().player.cumQ() > 3500 ) {
			EngineCore.outputText( 'Your orgasm drags on for so long that you begin to feel pressure from the cum-slime surrounding you.  It doesn\'t seem to matter to ' + CoC.getInstance().player.sMultiCockDesc() + ', which is too busy sending bliss to your brain and squirting cum for the tentacles to care.  It actually kind of hurts.  The oscillating purple ambiance flashes brighter in protest for a second, and then everything releases all at once.  The pressure is gone and you\'re sliding down on a wave of fungal-slime cum, feeling the tentacles being pulled from you by the sudden shift of position.  Moist cave air tickles at your ' + CoC.getInstance().player.skinDesc + ' as you come to rest on another spongy petal and begin to cough out the sludge.\n\n', false );
			EngineCore.outputText( 'Over the next minute your head clears and your strength returns.  You push yourself up on something hard, then glance down and realize you washed up next to the skeleton!  The bleached bone leers up at you knowingly, and everything you can see is covered in a thick layer of your spooge.  ' + CoC.getInstance().player.SMultiCockDesc() + ' is still dripping more spunk.  Clearly your ruined orgasm didn\'t pump it ALL out.  You look down at the rapier and pick it up out of your mess, examining it.  The blade shines keenly, and the sword is balanced to perfection.  Though you succumbed to the same fate as its owner, your warped body saved you from sharing his fate.  Thankfully potential pods that carpet the floor don\'t even twitch at you.  Perhaps your orgasm was enough to sate them all?  Or maybe they\'ve learned their lesson.', false );
			//(switch from loss to victory, sword loot);
			CoC.getInstance().monster.lust = 100;
			CoC.getInstance().player.orgasm();
		}
		//[OPTIONAL MILK ESCAPE];
		else if( CoC.getInstance().player.lactationQ() > 3500 || (CoC.getInstance().player.lactationQ() + CoC.getInstance().player.cumQ() > 4500) ) {
			EngineCore.outputText( 'Your milk-spouting ' + Descriptors.nippleDescript( 0 ) + 's continuously pour your breast-milk into the soupy fluids surrounding you.  Once you let down your milk, there was no stopping it.  Pressure backs up inside the flesh-pod, pressing down on you with near painful intensity, but your ' + Descriptors.allBreastsDescript() + ' refuse to give up or slow down.  Even though each squirt jacks up the force on your body, your unholy milk production will not relent.  The oscillating purple ambience flashes bright in protest, then gives out entirely, along with the pressure.  At once you\'re pulled away by a wave of milk-laced fungus-slime, yanking the tentacles away from your body with the change in position.\n\n', false );
			EngineCore.outputText( 'Over the next minute your head clears and your strength returns.  You push yourself up on something hard, then glance down and realize you washed up next to the skeleton!  The bleached bone leers up at you knowingly, and everything you can see is covered in a thick layer of slime and milk.  Your ' + Descriptors.breastDescript( 0 ) + ' are still pouring out milk.  Clearly you weren\'t even close to done with your pleasure-induced lactation.  You look down at the rapier and pick it up out of your mess, examining it.  The blade shines keenly, and the sword is balanced to perfection.  Though you succumbed to the same fate as its owner, your warped body saved you from sharing his fate.  Thankfully potential pods that carpet the floor don\'t even twitch at you.  Perhaps your milk was enough to sate them all?  Or maybe they\'ve learned their lesson.', false );
			//(switch from loss to victory, sword loot);
			CoC.getInstance().monster.lust = 100;
			CoC.getInstance().player.orgasm();
		}
		//(GENDERLESS);
		else if( CoC.getInstance().player.gender === 0 ) {
			EngineCore.outputText( 'You orgasm around the tentacle in your ' + Descriptors.assholeDescript() + ' for what feels like hours, though some dim, half forgotten whisper of your mind tells you it can\'t possibly have gone on for that long.  It feels so right and so perfect that resistance is almost a foreign concept to you at this point.  How could you have tried to fight off this heaven?  You\'re completely limp, totally helpless, and happier than you ever remember.  The pulsing lights of your womb-like prison continue their steady beat in time with the tentacle buried in your ass, soothing you while your body is played like a violin heading towards its latest crescendo.\n\n', false );
			EngineCore.outputText( 'In spite of the constant stimulation, it unceremoniously comes to a halt.  The tentacle in your ' + Descriptors.assholeDescript() + ' yanks out with near-spiteful force, and the fluid starts to drain from around you.  With so many strange chemicals pumping in your blood, it\'s too hard to stand, so you lie down on the fleshy \'floor\' as the last of the pod\'s ooze empties out.  The petals unfold, returning the view of the outside world to your drug and orgasm riddled mind.  Over the next minute your head clears and your strength slowly returns.\n\n', false );
			EngineCore.outputText( 'You walk over to the skeleton and get a good look at it.  The bleached bone leers up at you knowingly, and its jaw is locked in a rictus grin.  Looking down at the rapier, you decide to pick it up out of your mess and examine it.  The blade shines keenly, and the sword is balanced to perfection.  Though you succumbed to the same fate as its owner, your genderless body must have saved you from sharing his fate.  The potential pods that carpet the floor don\'t even twitch at you, and you breathe a silent prayer of thanks while a dark part of you curses.', false );
			CoC.getInstance().monster.lust = 100;
			CoC.getInstance().monster.XP = 1;
			CoC.getInstance().player.orgasm();
		}
		//Done if escaped;
		if( CoC.getInstance().monster.lust === 100 ) {
			CoC.getInstance().flags[ kFLAGS.ZETAZ_FUNGUS_ROOM_DEFEATED ]++;
			Combat.cleanupAfterCombat();
			return;
		}
		//[BAD-END GO];
		//(MALE)  ;
		if( CoC.getInstance().player.gender === 1 || (CoC.getInstance().player.gender === 3 && Utils.rand( 2 ) === 0) ) {
			EngineCore.outputText( 'The orgasm squirts and drips from ' + CoC.getInstance().player.sMultiCockDesc() + ' for what seems like forever.  It feels so right, so perfect, that you actually whine in disappointment when it finally does end.  You can\'t even be bothered to reach down and stroke yourself.  The softening in your loins is nothing compared to your flaccid, listless muscles.  You couldn\'t make your arms reach down to touch yourself even if you could work up the motivation to try.  Thankfully the slippery tentacles curl back around your ', false );
			if( !CoC.getInstance().player.hasSheath() ) {
				EngineCore.outputText( 'base', false );
			} else {
				EngineCore.outputText( 'sheath', false );
			}
			EngineCore.outputText( ' and squeeze, forcing ' + CoC.getInstance().player.sMultiCockDesc() + ' to inflate to readiness.  Deep inside your ' + Descriptors.assholeDescript() + ', the tentacle starts to rub against your prostate.  It caresses the male organ on each side and pauses to squeeze the center of it, pushing a few drops of sticky cum from your trembling ' + Appearance.cockNoun( CockTypesEnum.HUMAN ) + '.\n\n', false );
			EngineCore.outputText( 'The vine-like stalks currently hugging ' + CoC.getInstance().player.sMultiCockDesc() + ' constrict the base and begin to swirl around it in a circular motion.  Warm fungi-flesh and viscous, drugged ooze work together to send hot spikes of pleasure up your spinal-cord.  Despite your recent orgasm, you aren\'t being given any chance to recover or refill your ', false );
			if( CoC.getInstance().player.balls > 0 ) {
				EngineCore.outputText( 'balls', false );
			} else {
				EngineCore.outputText( 'prostate', false );
			}
			EngineCore.outputText( '.  Things like logic and rest don\'t matter in this warm, soupy environment, at least not to your poor, unthinking mind and erect, sensitive dick', false );
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 's', false );
			}
			EngineCore.outputText( '.  With such stimulation coming so closely on the heels of your last orgasm, [eachCock] is suffering painful levels of pleasure.  Your whole body shakes from the sensory overload; though with your muscles so completely shut down, it\'s more of a shiver.\n\n', false );
			EngineCore.outputText( 'Another wave of sperm begins the slow escape from your helpless, pinned form, drawn out by the fungus\' constant sexual ministrations.  The fluid inside your pod gurgles noisily as the fluids are exchanged, but the sensory input doesn\'t register to your overloaded, drugged-out shell of a mind.  You\'ve lost yourself to mindless pleasure, and repeated, endless orgasms.  The rest of your life is spent floating in an artificial womb, orgasming over and over to feed your fungus prison, and enjoying the pleasure that long ago eroded your ability to reason.', false );
			EventParser.gameOver();
		}
		//(FEM);
		else {
			EngineCore.outputText( 'You orgasm around the tentacles in your ' + Descriptors.vaginaDescript( 0 ) + ' and ' + Descriptors.assholeDescript() + ' for what feels like hours, though some dim, half forgotten whisper of your mind tells you it can\'t possibly have gone on for that long.  It feels so right and so perfect that resistance is almost a foreign concept to you at this point.  How could you have tried to fight off this heaven?  You\'re completely limp, totally helpless, and happier than you ever remember.  The pulsing lights of your womb-like prison continue their steady beat in time with the tentacles buried in your snatch, soothing you while your body is played like a violin heading towards its latest crescendo.\n\n', false );
			EngineCore.outputText( 'The steady rhythm of your penetration sends rockets of bliss-powered pleasure up your spinal cord and straight into your brain, where it explodes in orgasm.  Your body barely twitches, too relaxed to work up any muscle response, involuntary or otherwise.  A moment to rest never presents itself.  The cruel fungus never relents.  It never slows, unless it\'s only the briefest pause to intensify the next thrust.  Were you in the open air, away from the strange fluid you\'re now breathing, you\'d be twisting and screaming with pleasure.  Instead you float and cum in silence.\n\n', false );
			EngineCore.outputText( 'Fluids gurgle and shift inside the pod as they are exchanged.  If you were capable of noticing the sound or change, you might wonder if it\'s harvesting your sexual fluids, but even those thoughts are beyond you now. You\'ve lost yourself to mindless pleasure, and repeated, endless orgasms.  The rest of your life is spent floating in an artificial womb, orgasming over and over to feed your fungus prison, and enjoying the pleasure that long ago eroded your ability to reason.', false );
			EventParser.gameOver();
		}
	};
	Dungeon2Supplimental.prototype.encapsulationVictory = function() {
		if( CoC.getInstance().monster.HP <= 0 ) {
			CoC.getInstance().flags[ kFLAGS.ZETAZ_FUNGUS_ROOM_DEFEATED ]++;
			EngineCore.outputText( '', true );
			EngineCore.outputText( 'The pod\'s wall bursts under your onslaught.  The strength goes out of the tentacles holding you at once, giving them all the power of a limp noodle.  The spongy surface of the pod gives out, and the \'petals\' split apart, falling down to the ground with a heavy \'thwack\'.  You stand there, exulting in your freedom.  You\'ve won!\n\nThe rapier you approached originally still lies there, and you claim your prize.', false );
		}
		Combat.cleanupAfterCombat();
	};

	//OH GOD THE FAERIE STUFF;
	//Vala, the Broken 'Fairy';
	//[Use];
	Dungeon2Supplimental.prototype.useVala = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.dynStats( 'lus', 20 );
		//(Male);
		if( CoC.getInstance().player.gender === 1 ) {
			EngineCore.outputText( 'You shrug. The girl is so hopelessly lost in pleasure that you doubt she could ever return to the real world anyway. There doesn\'t seem to be any demons around, and it\'d be a good idea to relieve the tension that\'s been building in your gut since you stepped into this wretched place. Besides, you chuckle as you strip off your ' + CoC.getInstance().player.armorName + ', you\'ve always wondered what it\'d be like to take a fairy.\n\n', false );
			EngineCore.outputText( 'Since the demons were so kind as to string her up for you, it\'s easy enough to take her rape-broadened hips into your hands and slide your ' + Descriptors.cockDescript( 0 ) + ' up her thin thighs, toward her drooling pussy. The fairy girl has been well used, and recently, you realize, as you guide your cockhead over her pink snatch. Used quite a bit, you realize as you try to slide in and find virtually no resistance. Apparently, the imps couldn\'t decide who\'d go first and settled on penetrating her by two or three dicks at a time. That, or they\'ve got a minotaur-sized imp lurking in the cave somewhere. Either way, the ruined vagina gapes far too widely for enough friction to get you off. It looks like her asshole is in no better shape. Well, you are nothing if not resourceful.\n\n', false );
			EngineCore.outputText( 'You step away from the mind-fucked fairy and examine the potions on the alchemy table. Sifting through the vile concoctions, you find what you were looking for- minotaur blood. Snatching the whole bottle, you step back up to the waiting fairy and wrap a fist in her pink-tinged violet hair, jerking her head backwards. She gasps in ecstatic pleasure, the pain bringing her back in a flash. Her eyes lock onto yours and hot desire curls her face into a wanton, panting grimace. You grab her face and put pressure on her cheeks, forcing her jaw open. The crimson fluid trickles down her throat and her tongue licks her lips with satisfaction, savoring your rough treatment. You cast the empty bottle aside and thrust your cock back into her slit as the walls tighten around you. You begin to rock back and forth, enjoying the feeling of the velvet vice, even groaning as her gash becomes tight enough to begin hurting your ' + Descriptors.cockDescript( 0 ) + '.', false );
		}
		//(Female);
		else if( CoC.getInstance().player.gender === 2 ) {
			EngineCore.outputText( 'You shrug. The girl is so hopelessly lost in pleasure that you doubt she could ever return to the real world anyway. There donesn\'t seem to be any demons around, and it\'d be a good idea to relieve the tension that\'s been building in your gut since you stepped into this wretched place. Besides, you chuckle as you strip off your ' + CoC.getInstance().player.armorName + ', you\'ve always wondered what it\'d be like to take a fairy.\n\n', false );
			EngineCore.outputText( 'The fairy\'s rose-scented honeypot glistens with thick beads of clear liquid that well and dribble down her inner thighs, but you\'re a little too careful to eat out every wet and waiting fairy girl you happen to find in demonic dungeons, so you elect for a safer, less potentially drug-filled route for your carnal satisfaction. Glancing around the room, your eyes settle on the long, wooden pegging table in one corner of the room. You snatch a large, loose stone from the ground as you head over to it and fold your arms under your ' + Descriptors.allBreastsDescript() + ', shopping amongst the lacquered, intensely detailed wooden cocks set into the device. This one is far too small, that one is the wrong shape, one by one, you weed them out until you settle on a huge, minotaur-shaped dildo, over a foot and a half long and nearly six inches wide at the flared head. Grinning, you take the stone and carefully tap the bottom of the board until the peg starts wobbling loose. Using both hands, you yank the fire-hardened wooden dildo from its socket and hold it triumphantly over your head. You swing it in the air, experimentally, but decide that beating demons unconscious with a minotaur\'s dick would just be silly.\n\n', false );
			EngineCore.outputText( 'Heading back to the chained fairy, you rub the head of the wooden dildo between her petal-shaped labia, turning the cock as you do so, to lubricate the whole 18" of the monstrous thing. You stroke her juices into the glistening finish until it\'s difficult to keep your grip. Placing the flared head at the entrance to her rape-worn love box, you squeeze your own legs together in anticipation. With exquisite slowness, you press the dildo against her pussy and apply pressure until it begins to part her lips, pushing her slit wider and wider. The fairy finally seems to come to, under your teasing penetration and she coos at the stimulation, without questioning the source. She wiggles her plump butt and shakes her heaving chest, sending her absurdly large breasts swinging in the air, milk-heavy flesh slapping against each other. You encounter resistance just past her lower lips and you roll the flare in circles, cold wood rubbing hot skin and soaking up the squirting girl\'s natural lubrication. Then, putting your hand on the far end of the dildo, you push as hard as you can, jamming it into the fairy\'s cunt.', false );
		}
		//HERMY WORMY;
		else if( CoC.getInstance().player.gender === 3 ) {
			EngineCore.outputText( 'You shrug. The girl is so hopelessly lost in pleasure that you doubt she could ever return to the real world anyway. There donesn\'t seem to be any demons around, and it\'d be a good idea to relieve the tension that\'s been building in your gut since you stepped into this wretched place. Besides, you chuckle as you strip off your ' + CoC.getInstance().player.armorName + ', you\'ve always wondered what it\'d be like to take a fairy.\n\n', false );
			EngineCore.outputText( 'The fairy\'s rose-scented honeypot glistens with thick beads of clear liquid that well and dribble down her inner thighs, but you\'re too clever to just eat out every wet and waiting fairy girl you happen to find in demonic dungeons, so you elect for a safer, less potentially drug-filled route for your carnal satisfaction. Glancing around the room, your eyes settle on the long, wooden pegging table in one corner of the room. You snatch a large, loose stone from the ground as you head over to it and fold your arms under your ' + Descriptors.allBreastsDescript() + ' as you shop amongst the lacquered, intensely detailed wooden cocks set into the device. This one is far too small, that one is the wrong shape, one by one, you weed them out until you settle on a huge, minotaur-shaped dildo, over a foot and a half long and nearly six inches wide at the flared head. Grinning, you take the stone and carefully tap the bottom of the board until the peg starts wobbling loose. Using both hands, you yank the fire-hardened wooden dildo from its socket and hold it triumphantly over your head. You swing it in the air, experimentally, but decide that beating demons unconscious with a minotaur\'s dick would just be silly.\n\n', false );
			EngineCore.outputText( 'Heading back to the chained fairy, you rub the head of the wooden dildo between her petal-shaped labia, turning the cock as you do so, to lubricate the whole 18" of the monstrous thing. You stroke her juices into the glistening finish until it\'s difficult to keep hold of and then you place the flared head at the entrance to her rape-worn love box. With exquisite slowness, you press the dildo against her pussy and apply pressure until it begins to part her lips, pushing her slit wider and wider. The fairy finally seems to come to under your teasing penetration and she coos at the stimulation, without questioning the source. She wiggles her plump butt and jiggles her chest, sending her absurdly large breasts swinging in the air, milk-heavy flesh slapping together. You encounter resistance just past her vulva and you roll the flared corona in circles, cold wood rubbing hot skin and soaking up the squirting girl\'s natural lubrication. With a wicked grin, you pull it out of her cunt and brace the monster against her puckered rear instead. Then, putting your hand on the far end of the dildo, you push as hard as you can, jamming it into the fairy\'s ass.', false );
		}
		//Go to pt 2;
		EngineCore.dynStats( 'lus', 40 );
		EngineCore.doNext( this.useValaPtII );
	};
	Dungeon2Supplimental.prototype.useValaPtII = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.hideUpDown();
		EngineCore.fatigue( 5, 0 );
		CoC.getInstance().player.orgasm();
		//(Male);
		if( CoC.getInstance().player.gender === 1 ) {
			EngineCore.outputText( 'Before the fairy can get any tighter, you figure it\'s time to loosen her back up. Grabbing fistfuls of her violet hair, you thrust forward, violently, slamming the chained fairy\'s head against the stone wall. "<i>Fuck!</i>" She shrieks in delight. "<i>More, more!</i>" All too happy to comply, you begin screwing her harder, the crushing pressure of her swollen labia milking your cock with every motion. The giant fairy seems to feed on your rough treatment, and begins to slap her ass back into you, in time with your thrusts, giggling aimlessly between her disjointed pleas for your cum. You grab her wobbling chest, figuring it\'ll be the best handhold you\'re going to find on the malnourished girl, and are rewarded with an orgasmic cry from the fairy. She clenches down on your ' + Descriptors.cockDescript( 0 ) + ' as she clasps your hardness, her pulsing depths making you dig your fingers deeper into her supple flesh. Rocking against her at a painful pace, you grit your teeth and tighten your grip on her teats, their fluid depths yielding to your passionate throes. Her nipples swell and burst with milk, white cream spraying at your feet with each thrust, and you slide your hands down to pull at the lactating pink nubs, each burst of pale alabaster filling your lust to bursting.\n\n', false );
			EngineCore.outputText( 'You can\'t keep up your frenzied pace for long, and the fairy\'s drug-tightened cunt finally takes its prize as your climax gushes from your ' + Descriptors.cockDescript( 0 ) + '. You scream in pleasure and slam her body against the wall, lifting her off the ground and holding the side of her face on the molding stone. Every muscle in your body strains as you crush the thin girl\'s frame between your twitching form and the dungeon wall, hips bucking in time to each of your pulsing loads. The girl simply lets her body be used like a cocksleeve, drinking in the abuse as much as your ejaculate. She twitches, limply, against you and spasms in orgasm again, whispering desperate imperatives to fuck her over and over again.\n\n', false );
			EngineCore.outputText( 'Finally spent, you step back and toss the girl off of your dick, letting her fall back into a slump against the wall, dangling from her manacles. A wicked thought crosses your mind and you step back to the Alchemy table. Grabbing armfuls of hexagonal bottles, you flip the girl around, exposing her drooling, empty face and her bruised, sore breasts. You plug a bottle up to her lips and she begins sucking at it automatically, her ravaged mind automatically assuming any phallic object to be another dick to suck. She quaffs the Ovi Elixir gratefully, then a second, then a third. By the time you\'ve finished pouring the stuff down her throat, her body has already begun changing. The elixir has pounced on your seed and forced her ovulation, rapidly accelerating the speed of conception. Her tummy pouts, then bloats as your sperm impregnates the fairy in seconds. Her abdomen swells violently, and you suspect that force-feeding her so much so quickly may have resulted in a far greater pregnancy than she\'s had to endure before. She moans in bliss, her already disproportioned tits gurgling with even greater milky weight. If there was any doubt as to if she could stand under her own power before, it\'s gone now - even your strength wouldn\'t be able to move the breeding cow that you\'ve turned her into. Well, at least she won\'t be able to pump out any more imps for a while, you shrug, redressing. Though, with how many elixirs you gave her, she won\'t be pregnant for too long. Pity you\'ll probably miss it.', false );
		}
		//VAGOOZLES;
		else if( CoC.getInstance().player.gender === 2 ) {
			EngineCore.outputText( 'She squeals in delight and her knees wobble, the force of your thrust almost knocking her head into the wall she\'s shackled next to. You work the frightful dildo further into the girl\'s drooling snatch until a mere 9 inches protrudes from her bright pink cunny. You smear more of the girl\'s lubrication along the exposed shaft and turn your back to the fairy. Bending down, you slowly rub your ' + Descriptors.buttDescript() + ' against the smaller, rounded base of the minotaur cock. Though your end is veiny and sheathed, it lacks the broad flare of the cock head, so you press your ' + Descriptors.vaginaDescript( 0 ) + ' against it and brace your hands on your ' + CoC.getInstance().player.legs() + '. Rolling your ass up and down, you let your own excitement-thick lube smear the rounded end before you take a step backwards, toward the fairy. The bulb slides past your cheeks and presses against your vaginal entrance, its girth as exciting as it is frightening. You take a deep breath, but before you\'re ready, the impaled fairy bucks backward and drives the dildo into your unprepared cunt, provoking a cry of surprise.\n\n', false );
			EngineCore.outputText( 'You quickly recover and thrust backwards, driving more of the dildo inside your clenching walls while also slamming the fairy\'s slick box in lusty punishment for her over-eagerness. She giggles and humps right back, driving another inch into you, your uterus aflame with the delicious stimulation of the bumpy, uneven veins carved into the smooth cock-base. Before long, the two of you have a rhythm, driving the makeshift double-ended dildo into each other until you end up ass-to-ass, your ' + Descriptors.buttDescript() + ' smacking heavily against the fey girl\'s supple rear. A large puddle of girl cum has begun forming on the floor, each wet slap of your cunts splashing more of the warm, clear liquid between the two of you. You can feel your orgasm building a knot in your gut and you bite your lower lip as you ride her more forcefully, slamming yourself down on the veiny cock, driving the flared head deeper into the fairy\'s body. She tries to jackhammer it right back, mind lost in eternal lust, until you can feel the rounded base pushing against your cervix, blissful pain coursing through your lower body.\n\n', false );
			EngineCore.outputText( 'You clutch your ' + Descriptors.allBreastsDescript() + ' and squeeze the ' + Descriptors.nippleDescript( 0 ) + ' until they hurt, the agony giving you strength to drive the dildo back into the fairy. It\'s a losing battle, you realize, when she cums before you do, pulsing walls locking down and squeezing the dildo out, by painful inches, deeper into your ' + Descriptors.vaginaDescript( 0 ) + ' until the base is so far against your gut that it\'s pushed into your womb with a toe-curling, wet pop. You silently scream in ecstasy and agony, unable to believe that the frail fairy managed to fuck your womb with your own toy. Your strength falters and you slump down, sliding off the shaft with soothing regret, your cervix clenching wildly, still spasming from the obscene intruder. You roll onto your back, fairy cum all around you, even now dripping down the lube-slick cock still sticking out of the girl\'s sex, flared glans keeping it locked inside of her. You jill your ' + Descriptors.clitDescript() + ' for a few minutes afterward, just enjoying the afterglow, lapping at the dripping sprite cum that dribbles onto your face from the fairy\'s shivering, dick-stuffed cunt. Gradually, your strength returns and you rise, skin slick from the cum pool you\'ve been basking in. You remind yourself to clean your ' + CoC.getInstance().player.armorName + ' after this is over, sliding into them with damp, squishing noises. Giving your drooling fairy girl\'s ass a slap on the way out, you head back into the dungeon- you\'ve got demons to stomp.\n\n', false );
		}
		//HERPY DERPY HERMY;
		else if( CoC.getInstance().player.gender === 3 ) {
			EngineCore.outputText( 'She squeals in delight and her knees wobble, the force of your thrust almost knocking her head into the wall she\'s shackled next to. You work the frightful dildo further past the girl\'s gaping spincter until a mere 9 inches remains protruding from her bright pink hole. You smear more of the girl\'s lubrication along the exposed shaft and turn your back to the fairy. Bending down, you slowly rub your ' + Descriptors.buttDescript() + ' against the smaller, rounded base of the minotaur cock. Though your end is veiny and sheathed, it lacks the broad flare of the cock head, so you press your ' + Descriptors.vaginaDescript( 0 ) + ' against it and brace your hands on your ', false );
			if( CoC.getInstance().player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_NAGA ) {
				EngineCore.outputText( 'tail', false );
			} else {
				EngineCore.outputText( 'knees', false );
			}
			EngineCore.outputText( '.  Rolling your ass up and down, you let your own excitement-thick lube smear the rounded end before you take a step backwards, toward the fairy. The bulb slides past your ' + Descriptors.buttDescript() + ' and presses against your ' + Descriptors.vaginaDescript( 0 ) + ', its girth exciting and frightening. You take a deep breath, but before you\'re ready, the impaled fairy bucks backward and drives the dildo into your unprepared cunt, provoking a cry of surprise.\n\n', false );
			EngineCore.outputText( 'You quickly recover and prepare your second surprise. Reaching around your ' + Descriptors.hipDescript() + ', you grab your stiffening ' + Descriptors.cockDescript( 0 ) + ' and pull it backwards, until it\'s just under the dildo connecting the two of you. With a thrust backwards, you jam your dick into her drooling pussy, while driving more of the dildo inside your clenching walls, slamming the fairy\'s distended rosette in lusty punishment for her over-eagerness. She giggles and humps right back, driving another inch of your shaft into her rectum and your uterus, your love-canal aflame with the delicious stimulation of the bumpy, uneven veins carved into the smooth cock-base. Before long, the two of you have a rhythm, driving the makeshift double-ended dildo into each other and thrusting your tail-like ' + Descriptors.cockDescript( 0 ) + ' into the fairy until you end up ass-to-ass, your ' + Descriptors.buttDescript() + ' smacking heavily against the fey girl\'s supple rear. A large puddle of girl cum has begins to form on the floor, each wet slap splashing more of the warm, clear liquid between the two of you. You can feel your orgasm building a knot in your gut and you bite your lower lip as you make your thrusts more forceful, slamming yourself into her violated nethers, the fairy\'s body as bloated from the minotaur dildo as from your own girth. She, in turn, is just as consumed by lust and tries to jackhammer right back into you, until you can feel the rounded wooden base pushing against your cervix, the mouth of her own womb slamming against your cockhead, blissful pain coursing through your lower body.\n\n', false );
			EngineCore.outputText( 'You clutch your ' + Descriptors.allBreastsDescript() + ' and squeeze the ' + Descriptors.nippleDescript( 0 ) + ' until they hurt, the agony giving you strength to drive the dildo back into the fairy. She cums before you do, her pulsing walls locking down and driving the dildo out, inch by painful inch, deeper into your body until the base is so far against your gut that it is pushed into your furthest recesses with a toe-curling, wet slap. You silently scream in ecstasy and agony, unable to believe that the frail fairy managed to fuck your womb with your own toy. Your strength redoubles and you thrust back, your ' + Descriptors.cockDescript( 0 ) + ' penetrating her spongy, well-used cervix, her womb sucking you inside it. You release the knotted tension, spraying your spunk deep inside her. You slap your ' + Descriptors.buttDescript() + ' against hers with each pulsing load, your pussy clenching at the dildo stuffing it even as your empty your seed into the chained slave.  You try to go limp, but the double penetrated girl keeps you from pulling out, both holes clenching you against her until every last drop of your sperm has filled her greedy womb. Fairy cum drips down your length, while the flared tip deep inside her large intestine keeps your pussy twitching against her posterior. You jill your ' + Descriptors.clitDescript() + ' for a few minutes afterward, just enjoying the afterglow as your strength returns and the fairy\'s body unclenches, releasing you from your breeder\'s embrace, the minotaur dildo still halfway up her ass. You remind yourself to clean your ' + CoC.getInstance().player.armorName + ' after this is over, sliding into them with wet, squishing noises. Giving your drooling fairy girl\'s rump a slap on the way out, you head back into the dungeon- you\'ve got demons to stomp.', false );
		}
		CoC.getInstance().flags[ kFLAGS.TIMES_FUCKED_VALA_IN_DUNGEON ]++;
		EngineCore.doNext( EventParser.playerMenu );
	};
	//[Free];
	Dungeon2Supplimental.prototype.freeValazLooseCoochie = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You search the room for a way to free the fairy from her shackles and find an ugly, iron key that looks like a promising candidate. Opening the rusted metal with a teeth-clenching screech, the girl slumps to the ground in an ungainly heap. The fall seems to have roused her, at least, because she blinks, slowly, several times before lifting her head to stare blankly at you. You try to explain that she\'s free, but it\'s clear that thoughts are travelling through a pretty thick haze of abuse, so you take a moment to let her gather herself. When she\'s managed to assemble what wits are left to her, she slowly curls her mouth into a hopeful smile. "<i>How can Bitch please Master?</i>" she asks in an innocent voice tainted by husky desire.\n\n', false );
		EngineCore.outputText( 'You bend down to comfort the girl and offer her a shoulder to lean on as you help her to her feet. As you expected, the weight of her milky tits nearly surpasses the rest of her body. She clings to you happily, stroking and rubbing her bare skin against your body. She is adamantly ignoring your efforts to dissuade her amorous advances, merely cooing "<i>master</i>" and "<i>pleasure</i>" over and over again. If you had the right materials, you might be able to mix something to heal the damage her captors have done to the fairy\'s mind.\n\n', false );
		//[Heal (if the player has Pure Honey)] [Sex] [Reject];
		var heal = null;
		if( CoC.getInstance().player.hasItem( ConsumableLib.PURHONY, 1 ) ) {
			heal = this.healVala;
		}
		if( CoC.getInstance().player.hasItem( ConsumableLib.P_PEARL, 1 ) ) {
			heal = this.healVala;
		}
		//Choicez go here.  I can haz fucks?;
		EngineCore.choices( 'Fix Her', heal, 'Sex', (CoC.getInstance().player.gender > 0 ? this.ValaGetsSexed : null), 'Reject', this.rejectFuckingVala, '', null, '', null );
	};
	//[Heal];
	Dungeon2Supplimental.prototype.healVala = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		if( CoC.getInstance().player.hasItem( ConsumableLib.PURHONY, 1 ) ) {
			CoC.getInstance().player.consumeItem( ConsumableLib.PURHONY, 1 );
			CoC.getInstance().flags[ kFLAGS.VALA_HEALED_HONEY ] = 1;
			EngineCore.outputText( 'You\'re not sure if Pure Honey will do the trick, but it seems like the most likely candidate. You set the broken girl down and step over to the alchemy table. She clings onto your ', false );
			if( CoC.getInstance().player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_NAGA ) {
				EngineCore.outputText( 'tail', false );
			} else {
				EngineCore.outputText( CoC.getInstance().player.leg(), false );
			}
			EngineCore.outputText( ' as you walk, and you end up dragging her across the dungeon floor leaving a trail of her cum behind you. Before things can get too out of hand with the needy girl, you pull out the vial of Pure Honey and arrange the equipment in front of you. Using the cleanest of the pipettes, you take a small portion of the honey and mix it with what you hope to be water, diluting the rich mixture to a less viscous state. Working quickly, you manage to produce a draught that the weak girl can tolerate. By now, she\'s managed to work her way to a sitting position and is grinding her dripping sex against your ' + CoC.getInstance().player.foot() + '. You lean down and hold her nose to make her open her mouth. She gleefully opens wide, tongue thrashing about in anticipation. You pour the sweet-smelling concoction down her anxious throat and begin to re-cork the rest of your honey.\n\n', false );
			EngineCore.outputText( 'The effects of your cure are more violent than you expected. The fairy thrashes wildly, causing you to drop your bottle of Pure Honey, sending it spilling over the table, shattering the delicate equipment and ruining the unlabeled concoctions within. Moving to keep the girl from hurting herself in her seizure, you hold her head against your chest and wait out the wild bucking. Gradually, her motions slow and her breath calms to a more normal pace. When she looks back up at you, her eyes are clear at last, the pollution of lust burned away by the honey\'s restorative properties. She gives you a genuine smile and speaks with a voice like the rushing of wind over reeds. "<i>Thank you. I cannot express my gratitude for what you\'ve done. The fate you\'ve saved me from was worse than any death these wretched creatures could have subjected me to.</i>"', false );
			//[Next];
			EngineCore.doNext( this.healValaPartTwoTheHealingHealsOfRevenge );
		}
		//Pearl!;
		else {
			CoC.getInstance().player.consumeItem( ConsumableLib.P_PEARL, 1 );
			EngineCore.outputText( 'A soft, warm breeze rustles your ' + Descriptors.hairDescript() + ' and for a moment the foul stench of the dungeon vanishes, setting your mind at ease and draining the tension that has been building in your gut. In a moment of clarity, you remember the beautiful Pure Pearl that Marae granted you as a reward for shutting down the demons\' factory. It seems only right to use the goddess\' gift to rescue one of her wayward children. Perhaps she gave it to you for this very reason? The oblivious girl has managed to work her way to a sitting position and is grinding her dripping sex against your ' + CoC.getInstance().player.foot() + '. You lean down and gently lift her chin up, bringing her empty, pink eyes to stare into yours. Mistaking the gentle motion for a command, she gleefully opens wide, tongue thrashing about in anticipation. You place the pink pearl at the fairy\'s lips and she wraps her mouth around the pale jewel, trying obediently to swallow it. However, the little fairy\'s mouth is far smaller than you would\'ve thought and it seems to get stuck just behind her teeth, like a pink ball-gag. She coos a muffled moan and begins to masturbate without breaking eye contact with you.\n\n', false );
			EngineCore.outputText( 'Not exactly what you had in mind. It looks like you\'re going to have to be a bit more forceful.  You stoop down and take the fairy\'s head in your arms. Placing your fingers on the drool-soaked orb wrenching her mouth open, you begin to shove the pure pearl into her throat. With ecstatic joy, she swallows as hard as she can, trying to accommodate this new, exciting insertion. The gem squeezes past her tonsils and is forced into her esophagus with an audible \'pop!\' the mass of the pearl leaving an orb-shaped bulge in her throat. Her masturbation becomes frenzied as she begins choking on the gem and you hurry to stroke the girl\'s neck, coaxing the pearl down, out of her windpipe. Finally, it drops into her stomach and the change is immediate. Just as she climaxes, her empty pink eyes focus and sharpen, the lusty haze fading as Marae\'s gift burns away the pollution of the imps\' drugs and rape. She gives you a genuine smile and speaks with a voice like the rushing of wind over reeds. "<i>Thank you. I cannot express my gratitude for what you\'ve done. You are a godsend, hero. I will never forget what you\'ve done for me.</i>"\n\n', false );
			EngineCore.outputText( 'She tries to stand and falls back on her ass, the unbalancing weight of her corrupted breasts more than her atrophied legs can handle. She seems surprised at first, but her laughter is rich and hearing it eases your heart. "<i>Oh my, I have changed a bit, haven\'t I? Still, any deformation is worth restoring my mind. Please, let me introduce myself.</i>" She flaps her thin, fey wings rapidly and their lift is enough to allow her to stand. "<i>I am Vala, and I used to be a fairy, like my sisters. I was captured by the demons of this place and used to amuse them between rutting sessions. The leader of them, however, thought it would be better to use me for sexual release instead. They fed me such terrible drugs, to make me grow and to bind me with these,</i>" she cups her absurdly large tits, "<i>weights. They used me terribly and, in time, I forgot who I was. Pleasure was all that mattered. But you have saved me, and now it is all but a bad dream.</i>" She flutters up to kiss your forehead.\n\n', false );
			EngineCore.outputText( 'Leaving the way you came, Vala makes her exodus from the abyssal cavern. Despite her savagely warped body, you do not doubt that her renewed vigor for life will let her achieve some measure of happiness again. You feel like you\'ve managed to do a truly selfless thing in this den of iniquity. Defeating monsters is satisfying, but it\'s the lives you save that really make you feel like a hero. You sigh contentedly and wonder where she\'ll end up, now that she\'s been given her life back.', false );
			//(Vala unlocked in The Wet Bitch)[End Encounter];
			CoC.getInstance().flags[ kFLAGS.FREED_VALA ] = 1;
			EngineCore.doNext( EventParser.playerMenu );
		}
	};
	Dungeon2Supplimental.prototype.healValaPartTwoTheHealingHealsOfRevenge = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'She tries to stand and falls back on her ass, the unbalancing weight of her corrupted breasts still surprising. She seems surprised at first, but her laughter is rich and eases your heart even just to hear it. "<i>Oh my, I have changed a bit, haven\'t I? Still, any deformity is worth restoring my mind. Please, let me introduce myself.</i>" She flaps her thin, fey wings rapidly and their lift is enough to allow her to stand. "<i>I am Vala, and I used to be a fairy, like my sisters. I was captured by the demons of this place and used to amuse them between sexual releases. The lord of this place, in his dark designs, thought it would be better to use me for sexual release instead. They fed me such terrible drugs, to make me grow to a more pleasing size. They bound me in this room with these,</i>" she cups her absurdly large tits, "<i>weights. When my wings grew strong enough to carry my inflated body, they switched to chains instead. They used me terribly and, in time, I forgot who I was. Pleasure was all that mattered. But you have saved me, and now it is all but a bad dream.</i>" She flutters up to kiss your forehead. "<i>I must taste the sweet open air and return to my sisters, but please try to find me once you are done here. I wish to repay your kindness.</i>"\n\n', false );
		EngineCore.outputText( 'Leaving the way you came, Vala makes her exodus from the abyssal cavern. Despite her savagely warped body, you do not doubt that her renewed vigor for life will let her achieve some measure of happiness again. You feel like you\'ve managed to do a truly selfless thing in this den of iniquity. Defeating monsters is satisfying, but it is the lives you save that really make you feel like a hero. You sigh contentedly and press on. You\'ve got demons to dethrone.', false );
		//[End Encounter];
		CoC.getInstance().flags[ kFLAGS.FREED_VALA ] = 1;
		EngineCore.doNext( EventParser.playerMenu );
	};
	//[Sex];
	Dungeon2Supplimental.prototype.ValaGetsSexed = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		//(Herm/Male);
		if( CoC.getInstance().player.totalCocks() > 0 ) {
			EngineCore.outputText( 'The fairy\'s grinding and the sweet scent leaking out of her honey pot is getting under your skin, irritating an itch that\'s been building for a while now. Surely it wouldn\'t hurt to throw the mind-broken girl a pity fuck? It\'s not like she\'s one of the demons or anything. You push the girl back, gently and nod your head, stripping your ' + CoC.getInstance().player.armorName + ' piece by piece, teasing the fairy with your slowness. As you disrobe, you glance back at the spot she\'d been chained up and see the placard on the wall again. "<i>Vala?</i>" you ask. "<i>Is that your name?</i>" She stares blankly, unresponsive.\n\n', false );
			EngineCore.outputText( 'She points at herself. "<i>Bitch,</i>" she explains. You grab her hands and stare into her pink eyes, holding her in your gaze until the faintest sparkle of light returns to their empty depths.\n\n', false );
			EngineCore.outputText( '"<i>Your name is Vala,</i>" you command, softly. She flinches. "<i>Say it, or I won\'t fuck you.</i>" She squirms, eyes clenched, rubbing her knees together as the heat in her groin battles the conditioned rape the imps used to crush her identity. Just as you knew it would, lust wins out.\n\n', false );
			EngineCore.outputText( '"<i>It is... we are... Vala,</i>" she glances around, looking for imminent punishment. When none is forthcoming, she curls her lips into a wanton smile. "<i>Now fuck Vala!</i>" You chuckle and show your satisfaction at her small rebellion by grabbing one of her supple tits and leaning down to flick your tongue against her milk-bloated nipples. She arches her back under your touch and clenches her muscles, but slowly relaxes when you don\'t bite or tear at her pale skin. Her smile becomes a little more natural and her hands find your genitals, eager fingers sliding across your sensitive ' + CoC.getInstance().player.skinDesc + '. Her hand grabs your ' + Descriptors.cockDescript( 0 ) + ', thumb and pinkie forming a tight circle at your base while her other fingers stroke up and down your shaft. The fairy\'s touch is surprisingly light for the rough treatment she\'s endured, and you\'re quickly brought to hardness under her caresses.\n\n', false );
			EngineCore.outputText( 'Whatever small parts of her mind may be returning, she clearly hasn\'t conquered her sex-madness, because she simply cannot restrain herself any longer. Fluttering her wings rapidly, the girl lifts out of your embrace and rises above you, lining her sex up with yours, thick beads of wetness trickling down from her gaping pussy. With a mad giggle, she stops flapping and drops down, impaling herself on your length.', false );
		} else {
			EngineCore.outputText( 'The fairy\'s incessant groping is maddening and you decide it\'d just be easier to get it over with than have her hanging from your tits for the rest of the day. You select what looks like a reasonably clean spot in the room and carry the girl with you. Sitting down, you let her sit in your lap as you try to pull the clumped hair from her face. Spitting on your hand, you wipe some of the grease, dirt, and dried cum from her face, while she coos at your touch. Under all the grime, she\'s actually quite pretty; an impossibly frail yet timeless sort of beauty that reminds you of snowflakes back home. You smile, despite yourself, and give the girl a little kiss of affection, stroking her tattooed shoulders gently. She returns your kiss with a famished sort of desperation, trying to swallow your tongue in gulping slurps that force you to pull back and wipe the spittle from your face. She\'s just not going to be happy until she gets something inside her.\n\n', false );
			EngineCore.outputText( 'You ask her if she can fly, and she nods, blankly. By way of demonstration, she flutters her dragonfly wings and lifts a couple feet into the air, heavy chest causing her to sway precariously. You stroke your hands up her legs, pulling them around your shoulders and drawing the girl\'s pussy toward your head. The fairy\'s labia is almost artistic- hairless folds like rose petals, her leaking excitement like morning dew. You lean in and lick gently around her slit, the tip of your tongue tracing teasing circles around her small, overstimulated clit. She squeals in a pitch that you thought only dogs could hear and her legs clench around your head. Sliding your tongue into her gash, you are a little surprised that the well-used fairy still tastes sweet. Even mind-breaking imp rape couldn\'t fully pollute the fey girl\'s juicy snatch.', false );
		}
		EngineCore.dynStats( 'lus', 33 );
		//[Next];
		EngineCore.doNext( this.valaGetsSexedPtDuece );
	};
	Dungeon2Supplimental.prototype.valaGetsSexedPtDuece = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.hideUpDown();
		CoC.getInstance().player.orgasm();
		EngineCore.fatigue( 5, 0 );
		if( CoC.getInstance().player.cockTotal() > 0 ) {
			var x = CoC.getInstance().player.cockThatFits( 60 );
			$log.debug( 'X IS MOTHERFUCKER: ' + x );
			//(small-to-medium girth dicks) ;
			if( x >= 0 ) {
				EngineCore.outputText( 'Vala\'s pussy surrounds you like a quivering mouth, but she\'s simply too used for you to get much friction. The fairy barely even notices, grinding her front against you, tits rubbing your chest like a liquid massage, cream leaking down your torso. She hooks her legs around your ' + Descriptors.buttDescript() + ' and, using her wings, lifts up before dropping down again. Although she\'s too loose for your preference, the girl seems to be getting off just fine by using your ' + Descriptors.cockDescript( x ) + ' as a fucking post. You spot the wooden rack to one side of the room and the variety of carved dildos worked into the pegging ladder. A wicked thought crosses your mind, but lacking any other options, you guess you could at least give it a try. Pulling the fairy over to the lacquered bench, you choose one that seems like a likely fit and position your ' + CoC.getInstance().player.assholeOrPussy() + ' over the carved cock. When the fairy drops herself onto you next, she forces you down with her, penetrating you on the peg. It proves to be a bit thicker than you realized, however, and you gasp at the weight that settles into your gut. You try to get up and select a smaller peg, but the fairy\'s jack-hammering flight keeps you rooted on the post. Your ' + Descriptors.cockDescript( x ) + ' swells from the stimulation your ', false );
				if( CoC.getInstance().player.hasVagina() ) {
					EngineCore.outputText( 'cunt', false );
				} else {
					EngineCore.outputText( 'prostate', false );
				}
				EngineCore.outputText( ' is receiving and the fairy\'s frenzied pace becomes your own. You lift off as quickly as possible just so that her descent will shove the full length of the polished wood back inside your clenching ', false );
				if( CoC.getInstance().player.hasVagina() ) {
					EngineCore.outputText( 'slit.\n\n', false );
				} else {
					EngineCore.outputText( 'rectum.\n\n', false );
				}

				EngineCore.outputText( 'You feel your orgasm building and you manage to lift off of the peg entirely, quickly sliding down to the next biggest one, before the fairy begins her decent. This time, she uses her wings to provide additional force and drives you down, impaling you on the foot-long dildo and your cock explodes. The fairy bucks wildly against you, her slavering pussy clenching hard enough to actually squeeze you for once, eagerly sucking up every drop of your seed, her fingers wildly rubbing her clit as she jills herself off in desperate orgasm.\n\n', false );
				EngineCore.outputText( 'When a hot bath of girl cum sprays from her loins, soaking your thighs, she finally collapses against you, hugging your waist and weakly flapping her wings in the afterglow. You gingerly pull yourself off of the pegging board and carry the exhausted slave girl in your arms. Lifting her chin up to look into her face, you sadly find that her vacant expression is still there. Her road to recovery is more than one fuck, it seems. Well, at least you were able to show her a little kindness, you sigh. You set the girl in what looks like the least foul corner of the room and tell her you\'ll return for her after you\'ve finished off the demons, wondering if she\'ll even remember you five minutes from now.', false );
			}
			//(large girth dicks);
			else {
				EngineCore.outputText( 'Vala slides onto your ' + Descriptors.cockDescript( 0 ) + ' with gleeful squeals as you part her rose-petal labia and slide into her well-worn depths. If the marks on her back are any indication, her ability to accommodate your girth is a result of endless sessions with the captors, probably two or more to a hole. However she ended up so stretched, it works for you because her slavering cunt sucks up your titanic dick into her well-lubricated uterus. Her abdomen distorts at your insertion, but instead of pain or fear, her expression is utter bliss, her pink eyes fluttering as she wordlessly mutters sweet nothings into your ', false );
				if( CoC.getInstance().player.biggestTitSize() < 1 ) {
					EngineCore.outputText( 'chest', false );
				} else {
					EngineCore.outputText( 'breasts', false );
				}
				EngineCore.outputText( '. She\'s tight and getting tighter as you pump slowly, working your long inches into the fairy\'s needy hole. Her body is hot around you and her milky tits drool with each thrust, their nectar fragrant like rose water. At this rate, the condom-tight girl is going to make you blow your load before you get a chance to see what a fairy orgasm looks like.\n\n', false );
				EngineCore.outputText( 'You spot an unsecured set of chained manacles on the floor and an idea strikes you. Vala still sliding along your shaft, you bend down and grab the fetters, snapping one around the girl\'s neck like a collar. With a shudder at the cold iron, you lift the fairy up and lock the other end of the shackles around the root of your ' + Descriptors.cockDescript( 0 ) + ', steel snapping around your base tightly. The makeshift cock-ring works perfectly as your hips quiver, your body trying to orgasm but denied release by the metal loop. The fairy, meanwhile, thrashes atop your groin, the chain of her collar swinging between her tits, buffeting them with enough force to spray small white streams as she rides you. Her purple hair glimmers pink in the dull light of the dungeon as it bounces right along with her rocking hips. Even the diminished pulses of sunlight streaming from her stained and tattooed skin seem brighter as she is filled labia to cervix by your straining fuckpole.\n\n', false );
				EngineCore.outputText( 'She moans in a series of small, cute gasps and her pussy clenches your ' + Descriptors.cockDescript( 0 ) + ' as tightly as the makeshift cock-ring. You savor the sweet shivers that run up her spritely body, fingers clenching around your arms and legs wrapping about your ' + Descriptors.hipDescript() + ' to slam deeper, even taking the chained shackle at your base into her gushing slit. It feels like a flood is released from the fairy\'s gaping box, warm fluid splashing around your bulging length and raining down to leave a thin, clear puddle under you. You bite your lip and slide your fingers into her vice-like pussy, trying to unhook the shackle around your cock. The added insertion gives the girl enough to climax again, her body shaking violently against yours, squirting her hot girl cum over your hand, making it difficult to spring the catch. The pressure in your loins is getting painful now, and you lean against a wall, using both hands to try to unclap the fetters around your ' + Descriptors.cockDescript( 0 ) + '. Between her wings and the chain, she manages to stay firmly locked onto your root, grinding orgasmically as you push more fingers past her pulsing vulva and fumble at the cock-ring.\n\n', false );
				EngineCore.outputText( 'When she cums a third time, her rose-smelling lubricant utterly soaks your hands and you nearly wail with frustration. Clenching your teeth, you grunt and grab the fairy\'s cock-widened hips. You jam into her as hard and fast as you can, trying to fuck through the pressure and break your shackles with the force of your cum. The fairy is lost in her lust, her hands rubbing her clit while the other reaches around your back. She slides a finger upward ', false );
				if( CoC.getInstance().player.hasVagina() ) {
					EngineCore.outputText( 'nuzzling your joy buzzer', false );
				} else {
					EngineCore.outputText( 'tickling your prostate', false );
				}
				EngineCore.outputText( ' and you thrust more forcefully than she was braced for, finally lifting the fey cocksleeve off your root. Without wasting a moment, you pull the locking bar out of the shackle and finally allow your orgasm to spew into her waiting womb. You slip in the fairy\'s cum puddle and fall on your ' + Descriptors.buttDescript() + ' as your ' + Descriptors.cockDescript( 0 ) + ' dumps its long-delayed loads inside the distended girl. The feeling of cum filling her pussy drives her to a fourth orgasm, her toes curling and wings flapping wildly. She\'s so tightly clenched around you that there\'s nowhere for your cum to run out, so her womb bloats to a well-feasted fatness and she loses the strength to keep writhing in your lap, simply collapsing into your ', false );
				if( CoC.getInstance().player.biggestTitSize() < 1 ) {
					EngineCore.outputText( 'chest', false );
				} else {
					EngineCore.outputText( 'breasts', false );
				}
				EngineCore.outputText( '.\n\n', false );
				EngineCore.outputText( 'She\'s unconscious by the time you\'re finished seeding the fairy, the girl\'s chest barely rising and falling under her disproportionately huge breasts and massively inflated womb. Even better than a goblin, you reflect, marveling at the fairy\'s ability to take your impossibly huge cock and her resilience, despite the rapid sequence of orgasms. Though, you suppose, once you\'ve already been fucked mindless, there\'s little left to break. You resolve to check back on her after you\'ve dealt with the demons.', false );
			}
		}
		//(female);
		else {
			EngineCore.outputText( 'You close your eyes and run your tongue into her groin with teasing flicks and probing touches, exploring her nethers and lapping up the constant flow of fae cum that dribbles from her perpetually wet body. She shifts in the air, but keeps your head bouncing between her thighs and you can\'t tell what she\'s doing. When a hot, humid panting puffs against your ' + Descriptors.vaginaDescript( 0 ) + ', you realize she must\'ve done a 180 in the air, wings keeping her in a vertical 69. She descends on your pussy with relish, tasting something that isn\'t demon cum for the first time in too long. Her needy tongue is as delicately thin as the rest of her body, but it is LONG. She threads it into your depths and you buck your hips as it just keeps going deeper and deeper. You moan into her abdomen and flatten your own tongue to bring as much roughness against her twitching walls as you can, trying to get the little minx off before she sucks your orgasm from you.\n\n', false );
			EngineCore.outputText( 'It\'s a hopeless race, however, as she quickly zeros in on your g-spot, curling her tongue to coil thickly inside of you. You grab her head by its purple hair and crush it into your crotch, crushing her nose on your ' + Descriptors.clitDescript() + ', momentarily forgetting about the fairy\'s pussy as she tongue-rapes yours. When you cum, your body tenses and you hold your breath as your ' + Descriptors.hipDescript() + ' threaten to draw the small girl\'s whole head into your ' + Descriptors.vaginaDescript( 0 ) + '. You hear a slurping and realize she\'s drinking your girl cum. The thought is enough to remind you about the fairy slit at eye-level just as she climaxes from the taste of your body. She squirts wildly into your face, small jets of hot, sticky liquid spraying into your mouth, over your cheeks, and into your eyes.\n\n', false );
			EngineCore.outputText( 'You blink, and give the little brat a bump on the back of the head for her sneaky facial. She flutters right-side up again and when you see her face, your heart leaps in your chest. Your orgasm has washed her visage clean and you realize she\'s breath-taking. The soft curves of her heart-shaped face, the timeless alabaster of her flawless skin, and most surprisingly, the glimmers in her almond-shaped, pink eyes. She kisses you, softly this time, almost affectionately. Perhaps your exchange unlocked the memory of sweeter days with her fairy sisters? Your heart sinks when you realize she\'ll never be able to recapture those lost days in her state and you resolve to make sure she finds her way out of this place once you\'ve defeated its dark master. You return her kiss and redress as she finally gets some long-delayed, restful sleep.', false );
		}
		//[End Encounter];
		CoC.getInstance().flags[ kFLAGS.TIMES_FUCKED_VALA_IN_DUNGEON ]++;
		EngineCore.doNext( EventParser.playerMenu );
	};
	//[Reject];
	Dungeon2Supplimental.prototype.rejectFuckingVala = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		if( CoC.getInstance().flags[ kFLAGS.TIMES_PC_DEFEATED_VALA ] === 0 ) {
			EngineCore.outputText( 'The fairy\'s weak insistence has begun to get obnoxious. What kind of prisoner dry humps her rescuer? Actually, if the heavy flow of lubricating girl cum dripping out of her pussy is any indication, it\'s the wettest humping you\'ve had with your ' + CoC.getInstance().player.armorName + ' still on. You seize the girl\'s shoulders and hold her up, pushing her away from your goo-stained lower body. You assure the girl that you won\'t be having sex with her here. It\'s far too dangerous, you tell her, to leave yourself vulnerable right now. You\'ll take her to safety when the demons are defeated. You try to impress on her the importance of speed and stealth, but you might as well be talking to a big-breasted brick wall. When she makes a grab at your crotch, you\'ve had enough and throw her back.\n\n', false );
			EngineCore.outputText( 'The fairy gathers herself and raises her eyes to you, mad passion whirling in their pink depths. "<i>But Bitch is horny!</i>" she demands, madly. Her wings gain sudden life, flapping rapidly to pull her frail body off the floor. Hovering before you, she curls her fingers into desperate claws and rakes at you. She\'s too far gone, you realize. You\'re going to have to fight the broken fairy!', false );
		} else {
			EngineCore.outputText( 'What\'s wrong with this fairy? You\'ve already beaten her once, but she\'s still dripping and grinding against you. If anything, it\'s even wetter than the last humping the sex-addicted faerie forced on you. You seize the girl\'s shoulders and hold her up, pushing her away from your goo-stained lower body once again and re-iterate that you won\'t be having sex with her right now – you have other tasks that need your attention.  It doesn\'t work, and once again she makes a move towards your crotch.', false );
			if( CoC.getInstance().flags[ kFLAGS.TIMES_PC_DEFEATED_VALA_AND_RAEPED ] > 0 ) {
				EngineCore.outputText( '  You smirk in wonder at the horny little slut.  You guess you\'ll have to put her back into her place and give her another dose of \'love\'.', false );
			}
			EngineCore.outputText( '\n\n', false );
			EngineCore.outputText( 'The fairy stumbles up and fondles herself madly, already looking close to defeat. "<i>Bitch doesn\'t want to leave masters!  Masters have good cum.  Let bitch show you how wonderful it tastes.</i>" she demands, madly. Her wings gain sudden life, flapping rapidly to pull her frail body off the floor. Hovering before you, she curls her fingers into desperate claws and rakes at you. She\'s too far gone, you realize. You\'re going to have to fight the broken fairy, AGAIN!', false );
		}
		//Initiate fight;
		Combat.startCombat( new Vala(), true );
		EngineCore.doNext( EventParser.playerMenu );
	};

	Dungeon2Supplimental.prototype.loseToVala = function() {
		EngineCore.spriteSelect( 85 );
		if( CoC.getInstance().player.gender === 3 ) {
			this.loseToValaAsHerm();
		}
		if( CoC.getInstance().player.gender === 1 ) {
			this.loseToValaAsMale();
		}
		if( CoC.getInstance().player.gender === 2 ) {
			this.loseToValaFemale();
		}
		if( CoC.getInstance().player.gender === 0 ) {
			EngineCore.outputText( '', true );
			EngineCore.outputText( 'Vala forces a bottle into your throat before your defeated form has a chance to react, and you grunt with pleasure as a new gash opens between your ' + CoC.getInstance().player.legs() + '!', false );
			CoC.getInstance().player.createVagina();
			CoC.getInstance().player.gender = 2;
			EngineCore.doNext( this.loseToValaFemale );
		}
	};
	//Fight Loss-;
	//(Herm);
	Dungeon2Supplimental.prototype.loseToValaAsHerm = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You collapse, no longer able to stand, and gasp weakly. The fairy took entirely too much delight in the fight, and her wet pussy is practically squirting with every heartbeat as she hovers over you, rubbing herself in anticipation. "<i>The masters\' will be happy. They will reward their Bitch with cum.</i>" Her mouth drools as much as her slavering snatch. "<i>Oh so much cum, and all for their good little pet.</i>"\n\n', false );
		EngineCore.outputText( 'With a strength that seems out of place for the girl\'s rail-thin arms, she drags you to the center of the room and lifts your arms into the air. Licking up and down your ' + CoC.getInstance().player.skinDesc + ', she grabs a pair of dangling manacles from the ceiling and claps them around your wrists with a metallic snap that seems horribly final to you. Responding to the sudden weight, the device the manacles are attached to begins to haul upward, pulling your chain into the air and lifting you by your arms into a slouched heap, dangling helplessly. The girl licks down your ribs, over your abdomen, and slathers your ' + Descriptors.hipDescript() + ' in her saliva. More clapping irons puncture your weakened awareness and you jerk your body to find that she\'s bound your ' + CoC.getInstance().player.legs() + ' to the floor. You shiver, hanging in the rusty fetters, fearing what must surely be coming.\n\n', false );
		EngineCore.outputText( 'Expecting her to call for the imps at any moment, you are surprised when the fairy flies up to the ceiling and pulls down a long, cow skin hose. The leather pipe is stained, its stitching is crude at best, and bears a small, twistable spigot, but what worries you are the nozzles. Made of a blackened iron, the head of the hose branches into two, forking protrusions, both shaped like the foul, hooked cocks of imps. She licks the device reverently and lowers it toward her own, dripping pussy, nearly stuffing it inside her body before she remembers the rewards her masters are sure to shower her with, perhaps literally.\n\n', false );
		EngineCore.outputText( 'At least the fairy\'s desire lubricated the thing, you think, giving yourself small comfort before the fairy brings the wicked, two-pronged device to your ' + Descriptors.vaginaDescript( 0 ) + ' and ' + Descriptors.assholeDescript() + '. You tremble at how cold it is, and try to shift away, but the chains and your own weakness leave you at the girl\'s mercies. She slides the dildo into your holes with agonizing slowness, giggling the whole time, until the metal cockheads are fully inside you. "<i>It is good to be a toy,</i>" she coos. "<i>Good toys get used every day.</i>" With a playful kiss on your rump, she gives the spigot the tiniest of turns and you hear a gurgling surge from somewhere above you. The hose comes alive in her hands and begins to twist and writhe in the air as some horrible fluid is pumped through it, toward the iron cocks and your defenseless nethers. You clench as hard as you can, trying to expel the penetrating shafts, but the fairy seems to be getting stronger and more mad the longer this goes on. You moan and try to prepare for the worst.\n\n', false );
		//[Next];
		EngineCore.doNext( this.loseToValaAsHermPartII );
	};
	Dungeon2Supplimental.prototype.loseToValaAsHermPartII = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'It proves to be so much worse than you thought. Even though the nozzle is at its lowest setting, you can feel hot spunk flowing into your cunt and colon, the hose jerking as globs of the jizz begin to ooze into your recesses. The fairy laughs with a voice that is all the more wicked from the pure, clean, crystal tones it carries. "<i>The masters\' love is so sweet inside us. More future masters for us to birth and so many orgasms.</i>" She begins to tweak her clit and turns up the crank a notch, the trickle of slimy goo becoming a regular pumping. If not for the coldness of the metal inside you, the heat of the cum would be unbearable. You have the horrible realization that imps must be filling the hidden reservoir even as their fairy slave guides it into you. You scream in disgust and wriggle your ' + Descriptors.buttDescript() + ', trying to get the cursed toy out of you.\n\n', false );
		EngineCore.outputText( 'The fairy is too aroused by your bondage and she can\'t help herself from joining in. She pulls the cum pump from your sopping holes and flutters against your chest. Slamming herself on your ' + Descriptors.cockDescript( 0 ) + ', she twists the hooking tubes so that one plugs back into your spunk-drooling ' + Descriptors.vaginaDescript( 0 ) + ' and the other into her ass. The girl screams right along with you, her mindless joy drowning out your dismay as she bucks against your ' + Descriptors.hipDescript() + ' in time to the cum flooding the two of you. "<i>We\'re good sluts,</i>" she gurgles. "<i>Maybe- ah- Bitch will keep you secret from t-t-the masters for a while longer. Prepare you- ooo- for them. You will be so o-O-OBEDIENT. You\'ll learn to love Vala,</i>" she whispers, a gleam of intellect shining through her broken mind for an instant. She grips the iron shafts and jams them deeper into your bodies, her bloated labia squeezing your ' + Descriptors.cockDescript( 0 ) + ' all the tighter. The hooked glans at the tip of the pump drive her wild and she begins hard-fucking the two of you with it, parting your cervix even as you slam into hers.\n\n', false );
		EngineCore.outputText( 'She kisses your ' + Descriptors.nippleDescript( 0 ) + ' and your spine shivers as you hear her twisting the spigot off of the base, releasing the flow. You try to scream, but your voice is ripped from your throat as a cascading geyser of fresh imp cum is blasted into your womb with enough force to launch you forward, straining against the mounted fairy, only held aloft by your chains. Your senses are assaulted by the unholy scene, the sound of creaming seed spurting against your womb carries over the pitched voices with a frothing gush. The firehose of jizz inflates your body with the foaming spunk even as it fills the fairy like an overused onahole, her fey waist bloating against your groin as your abdomen swells to meet it. The pressure of the straining cavities squishes some of the cum back out of your ' + Descriptors.vaginaDescript( 0 ) + ', just as you orgasm, splattering your seed into the overstuffed fairy. The mind-erasing cum flood pumping into you feels like it has lit a fire in your body that is searing your womb and working its way up your gut toward your head.\n\n', false );
		EngineCore.outputText( 'You cry out desperately, but the fairy is the only one to hear your pleas and she is lost in her own sea of brainless orgasms. You resist the swarming sensations, trying to avoid the fairy\'s fate, but she\'s got you trapped between her twitching cunt and the jizz-blasting hose. All you can think of is the over-ripe sweetness of the fairy\'s fluids splashing against your thighs and the jack-hammering blasts of seed flooding your blazing cunt. The fire in your gut creeps up to your ' + Descriptors.allBreastsDescript() + ' and your heart pounds with as much force as the foot of cum-fed iron inside your overflowing ' + Descriptors.vaginaDescript( 0 ) + '. You try to promise yourself that you won\'t give in, but your captor twisting on your cumming cock and the barbed dildo inside your spunk-inflated womb drive the words from your mind. The heat in your breast surges into your head and it almost feels as if the seed blasting into your birth canal has made it up to your brain. You try to think, but it\'s too difficult. Thinking brings terrible pain, it\'s so much easier to surrender. To let yourself break. You look into the enslaved fairy\'s empty, pink eyes one more time and whisper a prayer of thanks to your Mistress. She seems started by the title and a slow smile spreads across her heart-shaped face. Then, all thought fades and your world becomes pink.\n\n', false );
		//[Go to Bad End 1];
		EngineCore.doNext( this.badEndValaNumber1 );
	};
	//Fight Loss-;
	Dungeon2Supplimental.prototype.loseToValaAsMale = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( 'You collapse, no longer able to stand, and gasp weakly. The fairy took entirely too much delight in the fight, and her wet pussy is practically squirting with every heartbeat as she hovers over you, rubbing herself in anticipation. "<i>Bitch will show you the masters\' pleasures. They will reward it with cum.</i>" Her mouth drools as much as her slavering snatch. "<i>Oh so much cum, and all for their good little slut.</i>"\n\n', false );
		EngineCore.outputText( 'You are powerless to stop the fairy as she drags you to the south wall and up to the wooden rail secured a couple of feet off the ground. "<i>When she was still growing, Bitch was too small and tight for the masters,</i>" your captor tells you. "<i>They blessed her with this ladder to make us big enough. You will feel their generosity.</i>" Gripping you under the arms, the fairy\'s lust-fuelled strength lifts you off the ground and flies you directly over the bristling peg ladder.\n\n', false );
		//[Next];
		if( CoC.getInstance().player.ass.analLooseness < 2 ) {
			EngineCore.doNext( this.loseToValaAsMaleIITight );
		} else if( CoC.getInstance().player.ass.analLooseness < 3 ) {
			EngineCore.doNext( this.loseToValaMaleIILoose );
		} else if( CoC.getInstance().player.ass.analLooseness < 5 ) {
			EngineCore.doNext( this.loseToValaMaleIIVeryLoose );
		} else {
			EngineCore.doNext( this.loseToValaMaleIIGape );
		}
	};
	Dungeon2Supplimental.prototype.loseToValaAsMaleIITight = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( '"<i>It will never please them like that,</i>" she scolds. "<i>You must be made more to their liking or they will never grant you endless joy.</i>" She grinds her button-stiff clit against your abdomen as she lowers you toward the smallest peg on the rail, an uncarved, lacquered wooden nub an inch wide and three inches long, barely larger than a finger. You try to attack the fairy before she can plug you in, but she simply drops you the rest of the way, and what should\'ve been a relatively painless insertion becomes agonizing as you hit the peg and three inches of hardened wood fill your ' + Descriptors.assholeDescript() + '. You gasp and try to get off the device, but the fairy has already grabbed you again and pulls you back into the air. You clench your muscles as you look at the far end of the ladder in horrified fascination at a wooden carving that would shame a minotaur. The fairy moves up a couple of notches.', false );
		//[Player gets looser ass, and move to next level];
		CoC.getInstance().player.ass.analLooseness = 2;
		//[Next];
		EngineCore.doNext( this.loseToValaMaleIILoose );
	};
	Dungeon2Supplimental.prototype.loseToValaMaleIILoose = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		//(loose ass);
		EngineCore.outputText( '"<i>Sluts are trained well,</i>" she sighs, happily. "<i>This one knows only the pleasures of the masters, now.</i>" The peg under you would be above average on a normal human- easily 7 inches long and two inches wide. Your ' + Descriptors.assholeDescript() + ' clenches and you writhe in the fairy\'s arms, but she lets gravity do her dirty work, lowering you onto the human-sized wooden cock, the varnished surface pulling apart your ' + Descriptors.buttDescript() + ' and sliding into your nethers with an uncomfortable tight sensation. Despite the humiliation of the rape, the pressure on your prostate begins pumping blood into your ' + Descriptors.cockDescript( 0 ) + ', turning your body into a traitor. You don\'t dare try to pull off, for fear of the damage it might do to your anus, and you are forced to sit in shame on the wooden erection. The girl flutters down and laps at your stiffening cock, trying as hard as she can not to mount you then and there. Her hungry tongue takes some of the building pain from you. Finally, she decides you\'ve had enough and lifts you into the air, but to your dismay, she takes you another few notches down the line.', false );
		//[Player's ass widens and go to next];
		CoC.getInstance().player.ass.analLooseness++;
		//[Next];
		EngineCore.doNext( this.loseToValaMaleIIVeryLoose );
	};
	//(Very loose ass);
	Dungeon2Supplimental.prototype.loseToValaMaleIIVeryLoose = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'The fairy suspends you over a bulbous cock, at least a foot long and three inches wide, carved to resemble an imp\'s barbed, demonic shaft. "<i>The masters are very kind,</i>" the girl promises, "<i>They know a slut\'s limits and gladly help it exceed them. They will rebuild you to their liking.</i>" The memory of her own training has overwhelmed her dulled expression and she can\'t help but mount you in the air, swinging her legs around your waist and guiding her slavering pussy to your ' + Descriptors.cockDescript( 0 ) + '. Just as your head slides into her cunt, however, she loses her grip and you fall from her arms, landing atop the imp dick, drawing an agonized scream of pain. The twelve inches of wood worn down to a polished gleam vanish up your ' + Descriptors.assholeDescript() + ' and distort your intestines. You are so full that you feel like you\'ve been speared through the gut, but your prostate does not care about your misery. Full penetration drives your cock wild and it surges to life, pulsing with every heartbeat. You can feel an orgasm building, but all you care about is the crushing pressure in your nethers. Just before you can cum, the fairy lifts you off the terrible prong and you actually sigh in relief, despite being denied release. Your cock twitches in the open air and it feels like a weight has been lifted from your chest. She giggles and flies you all the way to the last prong.\n\n', false );
		//[Player's ass widens and go to last];
		CoC.getInstance().player.ass.analLooseness = 5;
		//[Next];
		EngineCore.doNext( this.loseToValaMaleIIGape );
	};
	//(Gaping asshole);
	Dungeon2Supplimental.prototype.loseToValaMaleIIGape = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'The fairy takes you to the final peg along the rail. It is a nightmarish mix of horse, dog, and minotaur cock. It has a flared head, to make the initial penetration all the more painful, a bulging knot on the end to utterly destroy your spincter, and the whole thing stands a foot and a half tall, nearly five inches wide at the tip. You beg the fairy. You plead. There is no way you can go onto that, you say, it will kill you. All dignity flees as you pitifully sob up to her. You\'ll do whatever the imps want- whatever the Masters want, you correct yourself. You\'ll be their toy and cum dump, you\'ll drink every last bit of your masters\' love until you can\'t taste anything else. You will surrender yourself to them, body and soul. Whatever it takes, you implore, just not that peg! The fairy doesn\'t respond, her pupil-less eyes unchanging and unmoved by your agony, just swirling with pink lust and trained obedience. She lowers you just enough for you to feel the hard, flared tip of the monstrous thing press against your ' + Descriptors.assholeDescript() + ' and your resolve fails you. You promise the fairy everything. She lifts you up off the terrible final peg and you laugh in relief.\n\n', false );
		EngineCore.outputText( 'Turning you around in her arms, the fairy lets you see the full depths of mindless depravity in her empty gaze. She strokes your ' + Descriptors.cockDescript( 0 ) + ', bringing it just shy of climax before mounting you, her sopping cunny softer and warmer than anything you can remember. "<i>Silly toy,</i>" she whispers to you. "<i>It has nothing to give. The masters possess everything already.</i>" She gives you a peck on the cheek and stops flapping her dragon-fly wings, letting the two of you plummet toward the monstrosity. Your world explodes into pain and your cock erupts with a mind-breaking orgasm inside the girl before your vision fails and the merciful oblivion of unconsciousness rushes over you.', false );
		//[Go to Bad End 2];
		EngineCore.doNext( this.badEndValaNumber2 );
	};

	//Fight Loss-;
	//(Female);
	Dungeon2Supplimental.prototype.loseToValaFemale = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You collapse, no longer able to stand, and gasp weakly. The fairy took entirely too much delight in the fight, and her wet pussy is practically squirting with every heartbeat as she hovers over you, rubbing herself in anticipation. "<i>It will show you the masters\' pleasures. They will reward it with cum.</i>" Her mouth drools as much as her slavering snatch. "<i>Oh so much cum, and all for their good little Bitch.</i>"\n\n', false );
		EngineCore.outputText( 'The fairy paces around you, a look of false sympathy running across her face like a mask. "<i>Does it hurt? Come, Bitch will make you feel better.</i>" She loops one of your arms around her slim shoulders and lifts you with an ease that makes you shudder. With surprising strength, she flies you to a corner of the room and carefully sets you down atop a dingy, cum-stained pillow. Despite the disgusting conditions, it is more comfort than you expected at the mad girl\'s hands and you allow yourself a sigh as you gather your thoughts, trying to think of a way out of this predicament. You are startled when a loud clank breaks your reprieve and you try to rise, only to be jerked back down to your ' + Descriptors.buttDescript() + '. You claw at your neck and find that the fairy has slapped a steel collar around you, with barely two feet of chain keeping it off the ground.\n\n', false );
		EngineCore.outputText( '"<i>It is so tired after such a big day, aren\'t you?</i>" she asks, sweetly. "<i>Sluts just need a bath and a warm meal. We will be much happier soon.</i>" The girl lifts her hand to a lever set cleverly into the wall so as to be nearly invisible. You tremble at the implications and are nearly relieved when all it produces is an ice-cold bath from a nozzle in the ceiling above. You gasp at the freezing water and struggle to get out of the downpour, but your collar keeps you under it, the water washing over you and stealing the warmth from your limbs. The cold turns your chest into a crushing weight that squeezes the breath from your lungs. When it finally relents, you pant desperately while the water washes down the drain in the center of the room. You feel like a soggy mess, ' + Descriptors.hairDescript() + ' wet and icy.\n\n', false );
		EngineCore.outputText( 'Trying to regain your composure after nearly being drowned and frozen in one go, you hardly even notice when the fairy places a big bucket in front of you. "<i>All clean? The slut looks so pretty now. But it has to make itself presentable. The masters must enjoy your appearance and smell as much as your flesh. One warm meal for a good pet.</i>" You curse the slave and knock the bucket over, spilling its vile contents onto the floor, seething spunk sliding down to the drain. The girl laughs, spritely voice like shattered crystal. "<i>Bitch remembers when she was as defiant as you. If the sweet slut does not want her meal, perhaps another bath?</i>" She slides her hand to another switch and leans on it, while licking her lips. Instead of rushing water, a curtain of white fills your eyes, nose, and mouth, a rush of seething heat pouring around you. Clawing at your face and the collar, you realize she\'s dumped a shower of splattering cum on you from some recessed reservoir in the ceiling. You scream and thrash, but the goo just keeps coming, burying you in a slimy shell, your defiance only allowing it to roll down your throat with hacking swallows. When you finally slump down and let it run over you, the fairy relents.', false );
		//[Next];
		EngineCore.doNext( this.loseToValueFemalePtII );
	};
	Dungeon2Supplimental.prototype.loseToValueFemalePtII = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You shiver uncontrollably and hug yourself like a wounded animal. Your ' + Descriptors.nippleDescript( 0 ) + ' and ' + Descriptors.clitDescript() + ' burn under the pale goop, rock hard and pulsing with demands for stimulation. The fairy bitch happily places a new bucket next to you, this one fuller than the first. "<i>It wants a meal?</i>" she inquires doubtfully, perhaps hoping to keep it for herself. You reluctantly reach for the bucket, nearly lunging when it looks like the fairy is about to pull the lever again. You look into the bucket and shiver as the stench of the spooge assails your nostrils, even more potent than the jizz bath rolling down your bare skin in cream bulbs. You reluctantly take a glob between your fingers and thumb and with a timid motion, you raise your fistful of the odious syrup and spread it over your lips like a soapy lather. Rubbing the vile goo so close to your nose makes you nearly convulse at the reek and you hug at your slime-soaked body, trying to curl up, away from the reeking bucket. Your lower torso becomes a sloppy mess of pale, nearly clear fluid rolling off of your curves in blobby clumps.', false );
		EngineCore.outputText( 'You catch yourself rubbing the spooge against your ' + CoC.getInstance().player.skinDesc + ' and into your ' + Descriptors.allBreastsDescript() + ' and you shake your head, trying to clear your mind. Remember how horrible it smells, you stress to yourself. It\'s disgusting and you\'re only doing it to please the insane fairy. Still, you shiver when you reach your nipples and find your thumbs applying too much pressure to your yielding softness, rubbing the spunk across your ' + CoC.getInstance().player.skinDesc + ' in tight circles. Your next handful is larger and the next is larger still, until you drag the bucket closer to catch more of its dripping load with your flesh. You rub the warm jizz into your flesh, reveling in the heat it bleeds into your dripping body, the smell curling around your nostrils and filtering into your brain. You slop globs of oily cum across your face and head, rubbing it into your nostrils with your pinkies.\n\n', false );
		EngineCore.outputText( 'You lift the bucket, ready to slurp up the whole pail when the fairy makes an off-handed comment. "<i>The masters mix their love with minotaur beasts, to make it seep into your mind,</i>" she sighs, wistfully, looking terribly envious of your position. The girl seems to regret giving you the addictive cum, her words dulled by your jizz-drunk senses. Dimly, some part of your mind wonders if the minotaurs\' drug-like seed is already working, but it hardly matters anymore. You\'re too far gone by now. You put the bucket in your lap and bend down, into it. Placing the tip of your nose against its lurid surface, you breathe deeply, drinking in the odor as much as savoring the moment. Then, with relish, you submerge your ' + CoC.getInstance().player.face() + ' into the inky abyss of the spunk bucket, inhaling the sweet honey with an open mouth, air escaping your throat and bubbling up as you suck down gulp after gulp from your full-facial meal. The imp juice shower set your skin on fire, but drinking their salty discharge fills your organs with a raging inferno that drives away your memories, one by one. You gulp mouthfuls down, without even pausing to breathe. Every swallow blanks a part of your mind, first your crusade against the demons of the cave, then the friends you\'ve met in this world, and then even your home. The liquid passion fills your mind, burying all else. Every part of your personality is replaced by the need for ejaculate and your vision turns white as, finally, you can\'t seem to recall your name.', false );
		//[Go to Bad End 2];
		EngineCore.doNext( this.badEndValaNumber2 );
	};
	//BAD END 1-;
	//(Fairy);
	Dungeon2Supplimental.prototype.badEndValaNumber1 = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'When you regain your senses, you\'re no longer in the cavernous dungeon you passed out in. You blink, trying to adjust to the bright light around you, but it doesn\'t help. Every sense is aflame and it\'s impossible for you to move without exciting some nerve ending, sending a thrill of pleasure radiating along your sensitive regions. You try to think, to reason out where you are, but holding a thought in your head for longer than a minute is extremely difficult, as if your mind was muffled by thick wool. You try to remember what happened, but that too is just out of your reach. All this mental exercise is giving you a headache, so you give up, and just drink in the sensations around your body. A shimmering, spritely face comes into view and a thought blazes a clear, white-hot path through your groggy brain. Recognition clears all your doubts and worries away. Your Mistress. This is your Mistress.\n\n', false );
		EngineCore.outputText( 'The fairy girl smiles broadly, stroking your face affectionately, her almond-shaped pink eyes full of sweet desire. "<i>How is my Pet this morning?</i>" she inquires, voice like silver chimes ringing in your head. "<i>Aw, are you still waking up with headaches, Pet? Ooo, let your Mistress clear that poor head of yours.</i>" She uncorks a small vial of pink fluid and places it against your lips, but you hardly need the encouragement. You wrap your mouth around the lust draft and drink greedily, sucking down the wine-sweet draught, fiery passion driving the pain from your mind in a second and you reach out to embrace your dear Mistress. She giggles and shoos you back down with a touch. "<i>No no, Pet. It\'s meal time first, remember? Every day I steal more potions from those nasty demons, and we see what they do, don\'t you recall?</i>"\n\n', false );
		EngineCore.outputText( 'Dimly, in some corner of your mind, you seem to recall having this conversation before, perhaps several times. And didn\'t your Mistress use to be the one who had difficulty thinking straight? Back before you were simply Pet, didn\'t people call you something else? A name floats just out of reach, but you shake it away as your Mistress produces a dizzying array of bottles. She feeds you a thick, green beer that fills your tummy with pleasant warmth and makes your head swim. You can feel your body changing, as your ' + Descriptors.vaginaDescript( 0 ) + ' grows deeper and wider and you giggle, flicking your fingers in and out of your pussy, playing with the hot passage. Your Mistress takes a gulp of her own and coos as the thick white fluid rolls down her throat. She raises her voice in a spritely gasp of pleasant surprise and you can see her tiny joy buzzer of a clit growing longer and thicker before your eyes. It swells to six inches, then eight, before finally settling at 10". Gradually, it gains definition and its tip broadens into a head, a small slit opening at the top, a bead of pearly cum rolling out and down the bright pink shaft. She strokes the newly grown dick with slim fingers and trembles in excitement, eyeing your body hungrily.', false );
		EngineCore.outputText( 'You giggle, mindlessly, and let your Mistress sate her unquenchable lust with your yielding body, savoring the submission. She rides you raw, fucking your drug and sex-addled body hard enough to knock the memories of the day out of your head, just as she did yesterday and the day before that. With each passing day, you lose more of yourself to your Mistress and, in time, all that is left is the warped fairy\'s broken Pet.', false );
		EventParser.gameOver();
	};
	//BAD END 2-;
	Dungeon2Supplimental.prototype.badEndValaNumber2 = function() {
		EngineCore.spriteSelect( 85 );
		//(Imp);
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You come to with a splitting headache and the taste of something foul in your mouth. You struggle, but find that your limbs have been chained up and your ' + CoC.getInstance().player.legs() + ' bound by a thick, rubber coating, squeezing your lower body painfully. You\'ve been fitted with several rubber pieces of the same sort, in fact- the most notable is the black corset that makes breathing difficult and binds your waist to a hyper-feminine fantasy. You\'ve also been fitted with large, rubber fairy wings attached by straps around your shoulders that pull your chest forward, painfully. An O-ring gag has been latched around your face, connected to a long, clear tube that\'s been fed a foot or two down your throat. You try to shake it loose, but it\'s far too deep for you to have a hope of removing it without help.\n\n', false );
		EngineCore.outputText( 'Your struggles have alerted your captors that you\'ve awakened. A large imp steps in front of your vision, his arms tucked behind his back, contemplatively, as he admires your predicament. Instead of speaking, he simply produces a bronze placard with your name engraved on it and taps a long finger on the metal plate. Then, he gestures at the contraption you\'ve been hooked to. The tube leading into your mouth winds upward, to a large funnel, with a twistable knob on it. Above the funnel, the four-foot fairy is suspended by new chains, practically covered in a swarm of tiny imps. The demons are barely a foot tall, perhaps immature or half-breeds, and cling onto her skin with a mixture of lust for her flesh and fear of the drop, using any convenient hole both to fuck and keep from falling. Two are using her pussy at once, another at her ass, a fourth on her face, a pair fucking either hand, and half a dozen more, rubbing themselves across her armpits, the back of her knees, even just using her purple hair for added friction as they jerk themselves off. All the spunk from their frantic rutting splashes into a wide basin below, flowing into the funnel connected to your tube.\n\n', false );
		EngineCore.outputText( 'The large imp in front of you gives the knob on the funnel a twist and, to your horror, the sloshing flood of imp seed and fairy jizz comes washing down the winding pipe, sliding right past your undefended lips and down your penetrated gullet. Your stomach recoils at the infernal meal, but it just keeps pouring from the over-fucked fairy girl and her precariously perched offspring. As the cum washes down the hose, the silent imp uncorks a little black vial and pours it into the funnel, mixing it with the seething river running into your belly. You try to close your throat, to vomit, to bite through the gag, anything to keep the concoction from reaching you, but your attempts are in vain, and the sable fluid runs into your body. You shudder, mind racing for ways to escape, but your thoughts are interrupted when the apparent leader of the imps leans down and takes your chin in his hand, smiling a wicked grin of jagged, uneven teeth.', false );
		//[Next];
		EngineCore.doNext( this.badEndValaNumber2Pt2 );
	};
	Dungeon2Supplimental.prototype.badEndValaNumber2Pt2 = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( '"<i>When we captured Vala, I entertained the thought of breaking her on my dick like a crystalline condom, but I\'m rather glad I chose to raise her to be my pet instead.</i>" The imp\'s voice is familiar and your mind lurches to the memory of that first violation you suffered when you stepped through the portal to this world. Zetaz. He said never to forget the name Zetaz. You eyes roll in panic, but he holds your chin, his leering face filling your vision. "<i>As a reward to obedient little Vala, I\'ve decided to remake you in her image. We\'ll crush all that fatty flesh from your waist, keep your torso bound until you\'re too weak to walk, and pump you so full of drugs and cum that even seeing your name will be painful,</i>" he taps the bronze plaque he\'s prepared for you, a mirror to the fairy\'s. "<i>Why, in a few months, we\'ll be hard pressed to tell the two of you apart.</i>" A fresh wave of fairy-lubricated imp-seed pumps into your abdomen and the rubber girdle strains, but holds, washing the spunk back up, into your throat, until it feels like you might drown in the frothing cream.\n\n', false );
		EngineCore.outputText( 'There\'s no time to contemplate your fate, however, as the imp\'s black poison seems to take hold and you feel a burning all along your body. ', false );
		//(No vagina: ;
		if( !CoC.getInstance().player.hasVagina() ) {
			EngineCore.outputText( 'Between your thighs, a wet slurping tears through the air and a sudden seething heat fills your groin as a fresh pussy opens up, just under your dick.  ', false );
		}
		//(No breasts: ;
		if( CoC.getInstance().player.biggestTitSize() < 1 ) {
			EngineCore.outputText( 'You shudder and your chest feels like it\'s being flooded by the spooge floating at your tonsils. Before your eyes, the girdle around your chest is pushed down and a pair of swelling breasts fills your vision, filling heavily with milk just aching to be sucked from your distended nipples.  ', false );
		}
		EngineCore.outputText( 'The space between your shoulder blades feels like it\'s been torn open and your muscles reknit themselves as gossamer wings burst from your skin, thin as a dragonfly\'s and nearly as long as you are tall, settling against their rubber counterparts. Every inch of your skin seems to blister as a feeling of molten glass pouring over you causes you to tremble with agonized shudders, your pores sealing and skin gaining a glossy sheen.\n\n', false );
		EngineCore.outputText( '"<i>You\'re looking more like her by the second,</i>" Zetaz compliments, stroking your now-flawless face. "<i>Don\'t worry about that pesky mind of yours- I don\'t like using drugs to wipe that imperfection away like some of my kin. No, we\'ll just use you until you break. Perhaps I\'ll let Vala have you from time to time, too. Won\'t that be fun? The two of you will grow to be inseparable, I\'m sure.</i>" Zetaz steps back and signals the imps clinging to the fairy to come down. "<i>Why don\'t we get started?</i>"', false );
		EventParser.gameOver();
	};
	//Fight Win-;
	Dungeon2Supplimental.prototype.fightValaVictory = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'The fairy girl collapses, well-drilled obedience robbing her limbs of their fight. She squirms to a crouching bow, fully accepting you as her new ' + CoC.getInstance().player.mf( 'Master', 'Mistress' ) + '. The warped fae\'s empty eyes look up at you, her face a mask of rapture as she anxiously awaits her punishment, wagging her butt in the air as lubrication gushes down her thighs. It seems being defeated has excited the broken creature to a breeding frenzy. Her endurance must be incredible to be this frisky after your battle.', false );
		CoC.getInstance().flags[ kFLAGS.TIMES_PC_DEFEATED_VALA ]++;
		//[Fuck] [Leave];
		if( CoC.getInstance().player.gender > 0 ) {
			EngineCore.outputText( ' What will you do?', false );
			EngineCore.choices( 'Fuck', this.valaFightVictoryFuck, '', null, '', null, '', null, 'Leave', Combat.cleanupAfterCombat );
		} else {
			Combat.cleanupAfterCombat();
		}

	};
	//[Fuck];
	Dungeon2Supplimental.prototype.valaFightVictoryFuck = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		//(Female) ;
		if( CoC.getInstance().player.gender === 2 ) {
			EngineCore.outputText( 'If the girl\'s got energy to spare, you\'d better try to wear her down or she might alert more demons after you leave. Time to see just how strong her drug-fuelled wings have become. Stripping down, you step up to the fairy and present your ' + Descriptors.vaginaDescript( 0 ) + ' to her. She\'s all too happy to lavish kisses on your lower lips, hot tongue sliding along your labia and tip teasing your ' + Descriptors.clitDescript() + ' with lapping flicks. Licking your lips, you bend over and pull her legs up, forcing her into a hand-stand as you raise the girl\'s gushing sex to your head. It\'s startling how light the fairy is; even her flesh-slapping titties are practically weightless as you loop an arm around her impossibly thin waist and bury your face in her groin, breathing in her honey-sweet nectar as she squirts hard enough to splash you with her warm juice. You bear down on her stimulation-swollen clit and suck the joy buzzer hard enough to pull it from the thin skin sheath. Biting lightly on the engorged button, you whisper into the fairy\'s cunt, "<i>Let\'s fly.</i>"\n\n', false );
			EngineCore.outputText( 'She needs no additional urging, and wraps her whip-thin arms around your ' + Descriptors.buttDescript() + ' with a grip like steel. Her corruption-strengthened dragonfly wings flutter uselessly for a moment, but as your excitement begins to drip warm fluid onto her tongue, she flaps like she means it.  ', false );
			//(PC Has Wings: ;
			if( CoC.getInstance().player.wingType > AppearanceDefs.WING_TYPE_NONE ) {
				EngineCore.outputText( 'You decide to give her a hand, and flap your ' + CoC.getInstance().player.wingDesc + ' as hard as you can, the added thrust giving her the start she needs.  ', false );
			}

			EngineCore.outputText( 'Like a hummingbird on coffee, the fairy\'s wings blur as she pulls the two of you into the air and a thrill of glee sends shivers down your spine as the two of you slowly circle the room, clinging to each other in a desperate 69. Under her well-practiced mouth, you can feel your ' + Descriptors.vaginaDescript( 0 ) + ' drooling nearly as much as the fey girl\'s, your utter dominion of the fairy delighting you nearly to the verge of orgasm.\n\n', false );
			EngineCore.outputText( 'Still, she was such a willful creature, attacking you like that. Pets can\'t be allowed to bite their masters without punishment. Spare the rod, spoil the fairy. Lacking a rod, you use the next best thing. Keeping one arm firmly pinning the girl\'s thighs around your head, you reach up with the other and begin to feed fingers into her imp-loose cunt. The first three fingers slide in with practically no resistance, and your pinkie pushes in with only a bit of effort. When you reach your thumb, the girl has begun rocking her hips against your hand, rubbing her clit on your arm like a tiny tongue, smearing her sticky grease along your wrist. You push down and manage to fit your whole hand inside the girl, fingers cupped to a point, thumb tucked in your palm. She gurgles and jams her mouth against your ' + Descriptors.vaginaDescript( 0 ) + ', doing her best to please her Mistress. You savor the wet velvet feel of her depths, sliding in and out for a moment before you decide to begin the punishment.', false );
		}
		//(Male);
		else if( CoC.getInstance().player.gender === 1 ) {
			EngineCore.outputText( 'If the girl\'s got energy to spare, you\'d better try to wear her down or she might alert more demons after you leave. Commanding her to bow before you, the broken fairy is all too happy to comply, falling on her face, her arms spread wide, panting with desire. You circle around her and strip your ' + CoC.getInstance().player.armorName + ' off, admiring her plump little ass, all the plumper for how whip-thin her waist and legs are. You bend down to grab her waist and haul her ass upward, spearing her on your stiffening ' + Descriptors.cockDescript( 0 ) + ' without further ceremony. It\'s important she knows that foreplay is for obedient pets, you note to yourself with a grin. With a vicious thrust, you fill the girl\'s stretched pussy and bend her over at a right angle. Smacking her ass, you command the little bitch to fly and she shivers with delight.\n\n', false );
			EngineCore.outputText( 'She needs no additional urging, and wraps her whip-thin legs around your ' + Descriptors.hipDescript() + ' with a grip like steel. Her corruption-strengthened dragonfly wings flutter uselessly for a moment, but as your excitement begins to leak globs of pre-cum into her sucking box, she flaps like she means it. ', false );
			//(PC Has Wings: ;
			if( CoC.getInstance().player.wingType > AppearanceDefs.WING_TYPE_NONE ) {
				EngineCore.outputText( 'You decide to give her a hand, and flap your ' + CoC.getInstance().player.wingDesc + ' as hard as you can, the added thrust giving her the start she needs.  ', false );
			}
			EngineCore.outputText( 'Like a hummingbird on coffee, the fairy\'s wings blur as she pulls the two of you into the air and a thrill of glee sends shivers down your spine as the two of you slowly circle the room, you mounting her doggy-style, hands gripping her ribs as you lean over her. The tight clenching of her overburdened flight turns her loose pussy into a tight, clenching sphincter that practically milks your shaft with every heartbeat.\n\n', false );
			EngineCore.outputText( 'She makes a short circuit around the room, slowing enough to savor each thrust, your pounding giving her a short burst of speed as you ride the bitch through the air, every muscle in both of your bodies tense with the effort. You\'re still not convinced she\'s been sufficiently humbled, however, so you thread your arms under her wings and loop your hands around the sides of her face. You slide your forefingers into her mouth and hook the fingers to pull her cheeks wide open. Like a horse\'s reins, you jerk the fairy\'s head back and wrap your other fingers under her jaw, fully controlling her head. She tries to speak, but slurs the words, drool gushing from her wrenched mouth. You guide her head up, and she rises, descending when you yank it down. Satisfied that she understands your commands, you decide that it\'s time to take your mare through her paces.', false );
		}
		//[Fuck];
		//(Herm);
		else {
			EngineCore.outputText( 'If the girl\'s got energy to spare, you\'d better make sure she can\'t leave under her own power or she might alert more demons after you leave. You could always chain her back up, but you think you\'ve got a better idea. Scooping her up in your arms, you marvel at the fairy\'s lightness, even her chest-slapping titties are practically weightless to you. Carrying her to the center of the room, you set the girl down and retrieve her large, wooden bowl from a corner of the room. The bowl has the word "<i>Bitch</i>" scratched on it in the ragged style of imps and is large enough to hold perhaps three gallons of food. You plop it down, in front of her, and fish around the tubes and toys hanging from the ceiling, selecting a promising looking one. The pale hose has a large, metal, imp-shaped cock for a tip and a nozzle at the base of the foot-long dildo. You twist the lever an inch and a slow, steady stream of spoo comes leaking out the end, startling you to realize that the hose isn\'t white, but simply full of cum. Grinning, you let the leaking iron dick splash ropey strands of jizz across the fairy\'s tattooed backside, along her impossibly frail dragonfly wings, and into her glimmering purple hair.\n\n', false );
			EngineCore.outputText( 'Finally reaching the bowl, you twist the nozzle all the way and are nearly knocked off your feet by the pressure. The fire hose of sperm blasts into the large wooden bowl and splashes upward, painting the girl\'s face with alabaster cream. Before long, the bowl is full to overflowing and you cut off the flow of cum from the device. Standing over her, you begin shedding your clothing and place the ', false );
			EngineCore.outputText( 'underside of your ' + CoC.getInstance().player.foot() + ' against the back of her head and apply pressure, forcing her face toward the seething meal. "<i>Eat up,</i>" you command the fairy, and her resistance crumbles, allowing her face to be fully submerged in the spunk, bubbles rising from the slimy bowl as she begins to suck it down with mindless obedience.\n\n', false );
			EngineCore.outputText( 'Your own cock is getting hard from the display, and you figure it\'d be easier to stuff the slut if you filled her from multiple holes. Reaching up again, you pull down a different hose, this time selecting a dildo that looks like an amalgam of several dick types. It\'s flared, like a horse\'s, knotted at the base, like a dogs, bulbous in the middle, like a lizard\'s, and barbed all along, like a cat\'s. You have no idea what kind of cum is filling this one, but you kind of want to see what\'ll pop out of the broken fairy. Hauling it down, you get to your knees and slide the hose behind you, threading it over your ' + Descriptors.buttDescript() + ', along your ' + Descriptors.vaginaDescript( 0 ) + ', and under your ' + Descriptors.cockDescript( 0 ) + '. You bring the shaft to her gaping cunt and rub along her oozing labia, the puffy flesh inflamed with her desire. Slowly, you begin to slide your own cock in first, letting her walls adjust to your girth, before feeding the dildo-nozzle into her twitching hole. The pressure of your cock and the strangely warm metal drives the fairy crazy, and her steady guzzle from the bowl becomes frantic gulps, her belly beginning to show a paunch from her meal. You let the girl\'s crystal cum soak the chimera-cock before driving more of it into her slavering pussy, inches at a time. The girl\'s hips have been fucked so wide that you manage to penetrate her recesses with both cocks, though her abdomen stretches violently as the two cocks work their way deeper into her.', false );
		}
		EngineCore.dynStats( 'lus', 99, 'cor', 1 );
		//Next;
		EngineCore.doNext( this.valaFightVictoryFuckPtII );
	};
	//[Fuck];
	Dungeon2Supplimental.prototype.valaFightVictoryFuckPtII = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		//fem2;
		if( CoC.getInstance().player.gender === 2 ) {
			EngineCore.outputText( 'One by one, you curl your fingers into a ball, tightening your hand into a fist within the girl\'s pink tunnel, sensitive walls parting before your hardening grip. The fairy\'s wings spasm as she orgasms under your clenching fist, nearly dropping the two of you back onto the stone floor, before she catches herself and pulls up. You pump your fist into her tunnel, thick as a minotaur\'s cock, and the girl\'s pussy gushes in ecstasy. You can feel her inner walls flexing against your arm, coiled rings of muscle tightening in pinching contractions, actually pulling your arm deeper into her cunt. You pull back, reminding her greedy cunny who the Mistress is, fist stretching her abdomen in a way that brings a shuddering orgasm to your quivering sex. Your own walls tighten around the fairy\'s fair features, trapping her tongue inside you as your ' + Descriptors.vaginaDescript( 0 ) + ' squirts down her lips and across her face. She begins to spin in mid-air and the force of the rotation is nearly enough to shake you off of the oversexed girl\'s body.\n\n', false );
			EngineCore.outputText( 'You\'ll be damned if she\'s going to shake you loose before you break the bitch. You tighten your grip around her waist and jam your fist deep into her cunt, up to your elbow, her spongy cervix posing practically no barrier as your hand punches into her imp-tainted womb, bloating her belly like she\'s been thrust atop a flagpole. The fairy spins out of control, bucking and writhing in clenching frenzy, slamming against the ceiling and walls in wild flight as you unclench your fist, to feel the sucking wet heat of her innermost recesses slurping at your fingers, gushing girl cum spraying in regular gouts, her pussy climaxing like a breached dam. Her blurring wings falter and the two of you begin to tumble to the ground, but the enslaved slut knows her place well enough to make sure that she lands between you and the floor, your bodies slumping together as her back arches in orgasmic grinding. Sufficiently tamed, you brace your free hand against her spasming legs and pull your arm out the girl\'s pussy in one motion, her distorted abdomen collapsing against her overstretched vaginal cavity, the bulging outline of her womb still visible against the thin girl\'s waist.', false );
			EngineCore.outputText( 'Reaching down to grab the fairy\'s exhausted wings, you wipe the cum bath from your arm on the soft dragonfly-like membranes, figuring the slime should keep her from taking flight until it has a chance to dry. Satisfied by the ride, you figure it\'s time to move on to the girl\'s former masters.', false );
			//[End Encounter];
		}
		//male2;
		else if( CoC.getInstance().player.gender === 1 ) {
			EngineCore.outputText( 'You pick up the speed of your animalistic fucking and guide the fairy\'s head on a bobbing path through the air, using short dives to slam your ' + Descriptors.cockDescript( 0 ) + ' deeper into her cunt. She giggles mindlessly at your abuse and her drooling box clenches tighter still, her passage almost virginal from the exertion of the flight. You can feel an orgasm building in your gut and you twist the girl\'s head all the way back until she turns over, flying upside down. Your grip on her head combined with her legs coiled around your ' + Descriptors.buttDescript() + ' keep you locked inside the girl as you command her to \'land\' on the ceiling, her wings reaching a frenzied pace to keep the two of you suspended in the air. When she touches the sulfur-stained stone, you brace yourself against the slut and redouble your pounding, every thrust squirting increasingly larger bulbs of pre-cum into the needy hole. Like a dog, she pounds back, slavering pussy oozing down your groin, along your chest, and sliding into your nose, filling your head with images of blissful rose gardens and the moist smell of fallen leaves after an autumn rain. No longer able to hold back, you empty your load inside the upside down fairy, ropes of gooey spunk filling her cunt even as she rocks back and forth, her intensely clutching tunnel slurping every drop from your suspended body.\n\n', false );
			EngineCore.outputText( 'Her orgasm comes a moment later, and her wings lose their wild pace, sending the two of you tumbling out of the air, toward the ground. You jerk her head back, painfully, but the girl is lost in the depths of her creaming, muscles clenching and unclenching uselessly as her seed-stuffed sex sprays the girl\'s clear cum into the air, crystal bubbles spilling around your falling bodies. She giggles and mumbles something about cushions before giving one last, hard flap, sending your bodies spiraling. The fairy pet\'s wings twists you around so that when the two bodies land, she is under you, her sex-inflated chest cushioning her fall like liquid body pillows. The sudden shock sends her into another wild orgasm, crushing you inside her impossibly tight pussy, her womb bloating from the trapped sperm your panic-fuelled body churns out. You gasp at the descent, just letting the bitch\'s lower lips milk your ' + Descriptors.cockDescript( 0 ) + ', until you gather yourself. Despite your weight, she seems uninjured, her eyes rolling aimlessly in their sockets, a brainless smile plastered across her face. You rise, unsteadily, and leave the fairy lying there, ass in the air, gushing cunt stuffed with your cum all the way to her clit, your exhausting creampie finally satisfying the fey whore. You\'d have to be crazy to try that again, you pant, trying to slow your heartbeat. Next to that wild ride, the demons should be no problem, you sigh, fatigued.', false );
		}
		//herm2;
		else {
			//[2 dicks – ;
			if( CoC.getInstance().player.totalCocks() > 1 ) {
				EngineCore.outputText( 'It\'d be a shame if you didn\'t get a chance to stuff all her holes, so you grab your ' + Descriptors.cockDescript( 1 ) + ' and slide it along her ass cheeks, pulling out just enough to let it rest against her twitching sphincter. With a probing pinkie, you stretch out her rectum, the muscle spongy from the fuckings the demons have tattooed all down her back. You slide in and are pleasantly surprised that her ass is nearly as slick as her pussy, already lubricated by some body-altering drug the imps must\'ve fed her. You make a note to give her a dash on both the ass and pussy columns of her score-card body-tattoo. You grunt in surprise when you feel your two cocks rubbing against each other through the fleshy wall separating her vagina from her ass, and the extra friction nearly makes you blow your load then and there, but by force of will, you hold it back, teeth gritted in the effort.\n\n', false );
			}
			EngineCore.outputText( 'Your pussy needs some loving too, so you grab the imp dildo you filled the fairy\'s bowl with and slide it across your ' + Descriptors.hipDescript() + ', the cold metal exciting your moist sex and driving your ' + Descriptors.cockDescript( 0 ) + ' deeper into the girl. Hesitating at first, your restraint crumbles and you press the steel tip to your ' + Descriptors.vaginaDescript( 0 ) + ', and roll it around your ' + Descriptors.clitDescript() + ', the chill sending electric tingles through your groin and sets a raging fire in your loins as your flesh walls pulse from your racing heart. You guide the imp-shaped dildo to your pussy and feed the demonically sculpted toy into your body, unyielding metal parting your soft, supple skin, folds of pink flesh sucking at the knobby shaft. You gasp and nearly slide out of the tight confines of the fairy\'s double-stuffed cunt, but with a quick thrust, you penetrate yourself and jam more long inches into the cum-enslaved girl.\n\n', false );
			EngineCore.outputText( 'The steel against your cock and inside your cunny gurgle with their restrained payloads and you resist the urge to twist both nozzles until they break, instead beginning a slow bucking ride of the fairy. Sliding the imp cock into your gash on each back-thrust, and stuffing more of the monstrous dildo into her quivering body with every bucking motion, you work your arms as much as your ' + Descriptors.hipDescript() + '. The bulge of your tools inside her nubile body gets deeper with every push, rushing to meet the swell of her cum-stuffed stomach. The girl has already slurped up nearly two of the three gallons you poured for her. As you\'re rocking back, building up to a truly delicious orgasm, the slick girl cum from your ' + Descriptors.vaginaDescript( 0 ) + ' drips between your fingers and you lose your grip momentarily. Trying to regain it, your hand accidentally strokes the nozzle at the base and your eyes go wide as the imp cock unleashes a torrent of seething spunk into your body. Panicking, you try to twist it shut again, but only manage to open the spigot all the way, your abdomen nearly bursting as the firehose blasts your cervix with a gushing pillar of cum.', false );
			EngineCore.outputText( 'Your careful restraint is torn from your body and orgasm overtakes you.  ', false );
			//(2 Dicks-  ;
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 'Your ' + Descriptors.cockDescript( 0 ) + ' inside the fairy girl\'s ass erupts first, pumping your seed into her bowls, her hips distorting with the bursting flow of your cum, sphincter\'s clenching powerless to stop your alabaster flood.  ', false );
			}
			EngineCore.outputText( 'Inside the fairy\'s drooling pussy, your ' + Descriptors.cockDescript( 0 ) + ' twitches as your load rushes over the steel dildo and spurts from your cockhead in hot ropes of gooey love. The suffocating pleasure addling your brain makes you flick the nozzle of the chimera dildo, the tube wrapped around your ' + Descriptors.hipDescript() + ' kicking to life. The monstrous hose vibrates your entire lower body and you pump helplessly as your body is stimulated nearly to breaking. The fairy girl, already broken, merely lets out a stream of mad laughter, cum bubbling over her lips as her cunt is turned into a cornucopia of monster jizz. A cunny-copia, you giggle to yourself, her insane glee infecting your exhausted body. The double-penetrated fae bloats and swells under the pressure of the cum-pump, supplemented your own obscene spunk stuffing.\n\n', false );
			EngineCore.outputText( 'When your orgasm subsides, you finally manage to switch off the imp pump in your ' + Descriptors.vaginaDescript( 0 ) + ' and pull it out, tenderly. Your abdomen has been filled enough to leave a paunch of infernal cream below your belly. You press down on it, demonic ichor spilling out of your swollen vagina and splashing between your thighs. You sigh and hope the seed doesn\'t take hold. Speaking of taking hold, you switch off the gushing monster pump and carefully pull your ' + Descriptors.cockDescript( 0 ) + ' out of the fairy, making sure the metal dildo remains fixed in place to hold the cum inside. You slide out from between her legs and rise unsteadily to look at your handiwork. The fairy has been filled, top to bottom, all three gallons you sprayed in her bowl gone down her thirsty gullet. The jizz you packed into her womb bloats her even further, her belly nearly four times larger than it was when you found her. She wriggles on the ground, lost to the cummy heaven her mindless body has been plunged into. That should keep her occupied while you root out the imps.', false );
		}
		CoC.getInstance().player.orgasm();
		//[End Encounter];
		CoC.getInstance().flags[ kFLAGS.TIMES_FUCKED_VALA_IN_DUNGEON ]++;
		//Mark as defeated in combat;
		CoC.getInstance().flags[ kFLAGS.TIMES_PC_DEFEATED_VALA_AND_RAEPED ]++;
		Combat.cleanupAfterCombat();
	};

	//REPEATABLES;
	//Unpurified Fairy-;
	//(Returning to fairy room for the first time);
	Dungeon2Supplimental.prototype.leftValaAlone = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		//first post meeting;
		if( CoC.getInstance().flags[ kFLAGS.INVESTIGATED_VALA_AFTER_ZETAZ_DEFEATED ] === 0 || CoC.getInstance().flags[ kFLAGS.TIME_SINCE_VALA_ATTEMPTED_RAPE_PC ] === 0 ) {
			EngineCore.outputText( 'Having dispatched the foul master of this cavern, you return to the broken fairy. She is lying as you left her, apparently still as oblivious to the world beyond her pussy and asshole as before. You try to rouse the girl from her near comatose state, but she responds only in terse, disjointed phrases. When you urge her to leave the dungeon, she seems confused and refuses. When you offer to shelter her at your camp, she grows panicked, apparently so inured to her captivity that the thought of freedom frightens her into paralysis. Nothing you say seems to reach her dulled brain and you realize that even if she were willing to come with you, having a broken, drugged, branded fairy at your camp might alienate your friends or send the wrong message to potential allies. There\'s nothing for it- you\'re going to have to leave her here.\n\n', false );
			EngineCore.outputText( 'At the very least, you make sure she\'s provided for. You clear the pollution clogging the natural water source that pours in from one of the ceiling hoses and you gather what untainted food you can. You take a rag to the placard over her chains and clear the imp graffiti from the bronze plate, revealing the name under the muck. As you suspected, the broken fairy was once called \'Vala\' and you make a note of it. Maybe you\'ll visit her again, to give the poor girl some of the pleasure she\'s grown addicted to.', false );
			CoC.getInstance().flags[ kFLAGS.INVESTIGATED_VALA_AFTER_ZETAZ_DEFEATED ]++;
			CoC.getInstance().flags[ kFLAGS.TIME_SINCE_VALA_ATTEMPTED_RAPE_PC ] = 6;
		}
		//Anytime within 6 hours of waking/raping/meeting her;
		else if( CoC.getInstance().flags[ kFLAGS.TIME_SINCE_VALA_ATTEMPTED_RAPE_PC ] > 0 ) {
			EngineCore.outputText( 'Vala is still here, the thought to escape apparently never even crossing her vacant mind. The pale-skinned, whip-thin fairy looks slightly healthier than before, now that you\'ve cleared out the rapists who used her for an hourly cum-dump. Her purple hair even sparkles with pink light regularly. Her pink eyes remain empty, however, her pupils no more than pin-points in lusty oceans. She\'s still senseless from your last encounter, her body smeared with your juices and her sex pulsing, bloated and engorged from the pounding you gave her. Trying to use her again so soon wouldn\'t be terribly pleasant for you, and besides, you\'re better than a pack of filthy imps, right? Better to give her a chance to recover.', false );
		}
		//Anytime meeting her AFTER 6 hours.;
		else if( CoC.getInstance().flags[ kFLAGS.TIME_SINCE_VALA_ATTEMPTED_RAPE_PC ] === 0 ) {
			EngineCore.outputText( 'Vala is still here, the thought to escape apparently never even crossing her vacant mind. The pale-skinned, whip-thin fairy looks slightly healthier than before, now that you\'ve cleared out the rapists who used her for an hourly cum-dump. Her purple hair even sparkles with pink light regularly. Her pink eyes remain empty, however, her pupils no more than pin-points in lusty oceans. Although there\'s no one to lock her manacles, she seems to prefer sleeping in them, and has propped herself up, shackles about her wrists, hanging limply in the air, unaware of your presence. It\'s good to see that she\'s doing well, but you know any attempt at conversation would be about as productive as talking to a fairy-shaped onahole. Her apple-bottomed ass sways with each breath, pussy dripping lube even in her sleep.', false );
		}
		EngineCore.outputText( '\n\nWhat would you like to do to her?', false );
		//[Heal][Use][Wake][Leave];
		EngineCore.menu();
		EngineCore.addButton( 0, 'Fix Her', this.tryToHealVala );
		if( CoC.getInstance().player.gender > 0 ) {
			EngineCore.addButton( 1, 'Use', this.useValaOHYEAHSNAPINTOASLIMJIM );
			EngineCore.addButton( 2, 'Wake', this.wakeValaUpBeforeYouGoGo );
		}
		if( CoC.getInstance().player.lust >= 33 && CoC.getInstance().scenes.shouldraFollower.followerShouldra() ) {
			EngineCore.addButton( 3, 'ShouldraVala', CoC.getInstance().scenes.shouldraFollower.shouldraMeetsCorruptVala );
		}
		EngineCore.addButton( 4, 'Leave', EventParser.playerMenu );
	};
	//[Heal];
	Dungeon2Supplimental.prototype.tryToHealVala = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		//(Without Pure Honey);
		if( !(CoC.getInstance().player.hasItem( ConsumableLib.PURHONY, 1 ) || CoC.getInstance().player.hasItem( ConsumableLib.P_PEARL, 1 )) ) {
			EngineCore.outputText( 'You try your best with what you\'ve got, but nothing seems to restore the broken fairy\'s mind to her sex-addled  body. You\'re going to have to go out and gather more materials. Surely there\'s something that can break the damage the imps have done to Vala.', false );
			EngineCore.doNext( EventParser.playerMenu );
		}
		//(With Pure Honey);
		else if( CoC.getInstance().player.hasItem( ConsumableLib.PURHONY, 1 ) ) {
			CoC.getInstance().player.consumeItem( ConsumableLib.PURHONY, 1 );
			EngineCore.outputText( 'You\'re not sure if Pure Honey will do the trick, but it seems like the most likely candidate. You set the broken girl down and step over to the alchemy table. Vala clings onto your leg as you walk, and you end up dragging her across the dungeon floor. Before things can get too out of hand with the needy girl, you pull out the vial of Pure Honey and arrange the equipment in front of you. Using the cleanest of the pipettes, you take a small portion of the honey and mix it with what you hope to be water, diluting the rich mixture to a more viscous state. Working quickly, you manage to produce a draught that the weak girl can tolerate. By now, she\'s managed to work her way to a sitting position and is grinding her dripping sex against your shin. You lean down and hold her nose to make her open her mouth. She gleefully opens wide, tongue thrashing about in anticipation. You pour the sweet-smelling concoction down her anxious throat and begin to re-cork the rest of your honey.\n\n', false );
			EngineCore.outputText( 'The effects of your cure are more violent than you expected. The fairy thrashes wildly, causing you to drop your bottle of Pure Honey, sending it spilling over the table, shattering the delicate equipment and ruining the unlabeled concoctions within. Moving to keep the girl from hurting herself in her seizure, you hold her head against your chest and wait out the wild bucking. Gradually, her motions slow and her breath calms to a more normal pace. When she looks back up at you, her eyes are clear at last, the pollution of lust burned away by the honey\'s restorative properties. She gives you a genuine smile and speaks with a voice like the rushing of wind over reeds. "<i>Thank you,</i>" she gasps. "<i>Thank you. I cannot express my gratitude for what you\'ve done. The fate you\'ve saved me from was worse than any death those wretched creatures could have subjected me to.</i>"', false );
			//[Next];
			EngineCore.doNext( this.tryToHealValaWHoney2 );
		} else {
			//Pure Pearl;
			CoC.getInstance().player.consumeItem( ConsumableLib.P_PEARL, 1 );
			EngineCore.outputText( 'A soft, warm breeze rustles your ' + Descriptors.hairDescript() + ' and for a moment the foul stench of the dungeon vanishes, setting your mind at ease and draining the tension that has been building in your gut. In a moment of clarity, you remember the beautiful Pure Pearl that Marae granted you as a reward for shutting down the demons\' factory. It seems only right to use the goddess\' gift to rescue one of her wayward children. Perhaps she gave it to you for this very reason? The oblivious girl has managed to work her way to a sitting position and is grinding her dripping sex against your ' + CoC.getInstance().player.foot() + '. You lean down and gently lift her chin up, bringing her empty, pink eyes to stare into yours. Mistaking the gentle motion for a command, she gleefully opens wide, tongue thrashing about in anticipation. You place the pink pearl at the fairy\'s lips and she wraps her mouth around the pale jewel, trying obediently to swallow it. However, the little fairy\'s mouth is far smaller than you would\'ve thought and it seems stuck just behind her teeth, like a pink ball-gag. She coos a muffled moan and begins to masturbate without breaking eye contact with you.\n\n', false );
			EngineCore.outputText( 'Not exactly what you had in mind. It looks like you\'re going to have to be a bit more forceful.  You stoop down and take the fairy\'s head in your arms. Placing your fingers on the drool-soaked orb wrenching her mouth open, you begin to shove the pure pearl into her throat. With ecstatic joy, she swallows as hard as she can, trying to accommodate this new, exciting insertion. The gem squeezes past her tonsils and is forced into her esophagus with an audible \'pop!\' the mass of the pearl leaving an orb-shaped bulge in her throat. Her masturbation becomes frenzied as she begins choking on the gem and you hurry to stroke the girl\'s neck, coaxing the pearl down, out of her windpipe. Finally, it drops into her stomach and the change is immediate. Just as she climaxes, her empty pink eyes focus and sharpen, the lusty haze fading as Marae\'s gift burns away the pollution of the imps\' drugs and rape. She gives you a genuine smile and speaks with a voice like the rushing of wind over reeds. "<i>Thank you. I cannot express my gratitude for what you\'ve done. You are a godsend, hero. I will never forget what you\'ve done for me.</i>"\n\n', false );
			EngineCore.outputText( 'She tries to stand and falls back on her ass, the unbalancing weight of her corrupted breasts more than her atrophied legs can handle. She seems surprised at first, but her laughter is rich and hearing it eases your heart. "<i>Oh my, I have changed a bit, haven\'t I? Still, any deformation is worth restoring my mind. Please, let me introduce myself.</i>" She flaps her thin, fey wings rapidly and their lift is enough to allow her to stand. "<i>I am Vala, and I used to be a fairy, like my sisters. I was captured by the demons of this place and used to amuse them between rutting sessions. The leader of them, however, thought it would be better to use me for sexual release instead. They fed me such terrible drugs, to make me grow and to bind me with these,</i>" she cups her absurdly large tits, "<i>weights. They used me terribly and, in time, I forgot who I was. Pleasure was all that mattered. But you have saved me, and now it is all but a bad dream.</i>" She flutters up to kiss your forehead.\n\n', false );
			EngineCore.outputText( 'Leaving the way you came, Vala makes her exodus from the abyssal cavern. Despite her savagely warped body, you do not doubt that her renewed vigor for life will let her achieve some measure of happiness again. You feel like you\'ve managed to do a truly selfless thing in this den of iniquity. Defeating monsters is satisfying, but it\'s the lives you save that really make you feel like a hero. You sigh contentedly and wonder where she\'ll end up, now that she\'s been given her life back.', false );
			//(Vala unlocked in The Wet Bitch)[End Encounter];
			CoC.getInstance().flags[ kFLAGS.FREED_VALA ] = 1;
			EngineCore.doNext( EventParser.playerMenu );
		}
	};
	Dungeon2Supplimental.prototype.tryToHealValaWHoney2 = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'She tries to stand and falls back on her ass, the unbalancing weight of her corrupted breasts still surprising. She seems surprised at first, but her laughter is rich and eases your heart even just to hear it. "<i>Oh my, I have changed a bit, haven\'t I? Still, any deformation is worth restoring my mind. Please, let me introduce myself.</i>" She flaps her thin, fey wings rapidly and their lift is enough to allow her to stand. "<i>I am Vala, and I used to be a fairy, like my sisters. I was captured by the demons of this place and used to amuse them between sexual releases. The leader of them, however, thought it would be better to use me for sexual release instead. They fed me such terrible drugs, to make me grow and to bind me with these,</i>" she cups her absurdly large tits, "<i>weights. They used me terribly and, in time, I forgot who I was. Pleasure was all that mattered. But you have saved me, and now it is all but a bad dream.</i>" She flutters up to kiss your forehead.\n\n', false );
		EngineCore.outputText( 'Leaving the way you came, Vala makes her exodus from the abyssal cavern. Despite her savagely warped body, you do not doubt that her renewed vigor for life will let her achieve some measure of happiness again. You feel like you\'ve managed to do a truly selfless thing in this den of iniquity. Defeating monsters is satisfying, but it\'s the lives you save that really make you feel like a hero. You sigh contentedly and wonder where she\'ll end up, now that she\'s been given her life back.\n\n', false );
		//(Vala unlocked in The Wet Bitch);
		CoC.getInstance().flags[ kFLAGS.FREED_VALA ] = 1;
		//[End Encounter];
		EngineCore.doNext( EventParser.playerMenu );
	};
	//[Use];
	Dungeon2Supplimental.prototype.useValaOHYEAHSNAPINTOASLIMJIM = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		//(Male);
		if( CoC.getInstance().player.gender === 1 ) {
			EngineCore.outputText( 'You shrug. The girl is so hopelessly lost in pleasure that you doubt she could ever return to the real world anyway. Since Val has been so kind as to string herself up for you, it\'s easy enough to take her rape-broadened hips into your hands and slide your ' + Descriptors.cockDescript( 0 ) + ' up her thin thighs, toward her drooling pussy. The fairy girl has been playing with the toys around her chamber, you realize, and recently at that. You try to slide in and find virtually no resistance. Apparently in the imps\' absence she\'s been simulating their frenzied lusts, penetrating her gash with two or three dildos at a time. That, or maybe she\'s been using the minotaur-sized one. Either way, the ruined vagina gapes far too widely for enough friction to get you off. It looks like her asshole is in no better shape. Well, you are nothing if not resourceful.\n\n', false );
			EngineCore.outputText( 'You step away from the brain-dead fairy and examine the potions on the alchemy table. Sifting through the vile concoctions, you find what you were looking for- minotaur blood. Snatching the whole bottle, you step back up to the waiting fairy and wrap a fist in her pink-tinged violet hair, jerking her head backwards. She gasps in ecstatic pleasure, the pain bringing her mind back in a flash. Vala\'s eyes lock onto yours and hot desire curls her face into a wanton, panting grimace. You grab her face and put pressure on her cheeks, forcing her jaw open. The crimson fluid trickles down her throat and her tongue licks her lips with satisfaction, savoring your rough treatment. You cast the empty bottle aside and thrust your cock back into her slit as the walls tighten around you. You begin to rock back and forth, enjoying the feeling of the velvet vice, even groaning as her gash becomes tight enough to begin hurting your shaft.\n\n', false );
		}
		//(Female);
		else if( CoC.getInstance().player.gender === 2 ) {
			EngineCore.outputText( 'You shrug. The girl is so hopelessly lost in pleasure that you doubt she could ever return to the real world anyway. The fairy\'s rose-scented honeypot glistens with thick beads of clear liquid that well and dribble down her inner thighs, but you\'d like to save that nectar for later. Glancing around the room, your eyes settle on the long, wooden pegging table in one corner of the room. Vala has removed most of the pegs to ram into her lonely snatch while you were away, and a variety of carved dildos lie strewn at the foot of the bench. Shopping amongst the lacquered, intensely detailed wooden cocks, you rule them out, one by one. You settle on a huge, minotaur-shaped dildo, over a foot and a half long and nearly six inches wide at the flared head. Grinning, you take the fire-hardened wooden dildo from the ground and hold it triumphantly over your head. You swing it in the air, experimentally, but decide that beating demons unconscious with a minotaur\'s dick would just be silly.\n\n', false );
			EngineCore.outputText( 'Heading back to the chained fairy, you rub the head of the wooden dildo between her petal-shaped labia, turning the cock as you do so, to lubricate the whole 18" of the monstrous thing. You stroke Vala\'s juices into the glistening finish until it\'s difficult to keep hold of and then you place the flared head at the entrance to her rape-worn love box. With exquisite slowness, you press the dildo against her pussy and apply pressure until it begins to part her lips, pushing her slit wider and wider. The fairy finally seems to come to under your teasing penetration and she coos at the stimulation, without questioning the source. She wiggles her tight little butt and shakes her chest, to set her absurdly large breasts swinging in the air, fluid flesh slapping against each other. You encounter resistance just past her lower lips and you roll the flare in circles, cold wood rubbing hot skin and soaking up the squirting girl\'s natural lubrication. Then, putting your hand on the far end of the dildo, you push as hard as you can, jamming it into the fairy\'s cunt.', false );
		}
		//Herm;
		else {
			EngineCore.outputText( 'You shrug. The girl is so hopelessly lost in pleasure that you doubt she could ever return to the real world anyway. Vala\'s rose-scented honeypot glistens with thick beads of clear liquid that well and dribble down her inner thighs, but you\'re hungry for a different sort of meal. Glancing around the room, your eyes settle on the long, wooden pegging table in one corner of the room. The fairy has removed most of the pegs to ram into her lonely snatch while you were away, and a variety of carved dildos lie strewn at the foot of the bench. Shopping amongst the lacquered, intensely detailed wooden cocks, you rule them out, one by one. You settle on a huge, minotaur-shaped dildo, over a foot and a half long and nearly six inches wide at the flared head. Grinning, you take the fire-hardened wooden dildo from the ground and hold it triumphantly over your head. You swing it in the air, experimentally, but decide that beating demons unconscious with a minotaur\'s dick would just be silly.\n\n', false );
			EngineCore.outputText( 'Heading back to the chained fairy, you rub the head of the wooden dildo between her petal-shaped labia, turning the cock as you do so, to lubricate the whole 18" of the monstrous thing. You stroke her juices into the glistening finish until it\'s difficult to keep hold of and then you place the flared head at the entrance to her rape-worn love box. With exquisite slowness, you press the dildo against her pussy and apply pressure until it begins to part Vala\'s lips, pushing her slit wider and wider. The fairy finally seems to come to, under your teasing penetration and she coos at the stimulation, without questioning the source. She wiggles her tight little butt and shakes her chest, to set her absurdly large breasts swinging in the air, plump flesh slapping togeather. You encounter resistance just past her lower lips and you roll the flare in circles, cold wood rubbing hot skin and soaking up the squirting girl\'s natural lubrication. With a wicked grin, you pull it out of her cunt and brace the monster against her asshole instead. Then, putting your hand on the far end of the dildo, you push as hard as you can, jamming it into the fairy\'s rump.', false );
		}
		//[Next];
		EngineCore.dynStats( 'lus', 80 );
		EngineCore.doNext( this.useValaOHYEAHKOOLAIDPTII );
	};
	Dungeon2Supplimental.prototype.useValaOHYEAHKOOLAIDPTII = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.hideUpDown();
		//m2;
		if( CoC.getInstance().player.gender === 1 ) {
			EngineCore.outputText( 'Before she can get any tighter, you figure it\'s time to loosen her back up. Grabbing fistfuls of her hair, you thrust forward, violently, slamming the Vala\'s head against the stone wall. "<i>Fuck!</i>" She shrieks in delight. "<i>More, more!</i>" All too happy to comply, you begin ramming her harder, the crushing pressure of her swollen labia milking your cock with every motion. The giant fairy is all too happy to help your rough treatment, and begins to slap her ass back into you, in time with your thrusts, giggling aimlessly between her disjointed pleas for you to cum inside her. You grab her wobbling chest, figuring her bloated breasts are the best handholds you\'re going to find on the malnourished girl, and are rewarded with an ecstatic cry from the fairy. She clenches down on your ' + Descriptors.cockDescript( 0 ) + ' as she orgasms, her pulsing depths making you dig your fingers deeper into her supple flesh. Rocking against her at a painful pace, you grit your teeth and begin to dig your fingers into her mounds, their fluid depths yielding to your passionate throes. Her nipples swell and burst with milk, white cream spraying at your feet with each thrust, and you slide your hands down to pull at the lactating pink flesh, each burst of pale alabaster filling your lust to bursting.\n\n', false );
			EngineCore.outputText( 'You cannot keep up your frenzied pace for long, and the fairy\'s drug-tightened cunt finally takes its prize as your orgasm shudders from your loins. You scream in pleasure and slam her whole body against the wall, lifting her off the ground and holding the side of her face on the molding stone. Every muscle in your body strains as you crush the thin girl\'s frame between your twitching form and the dungeon wall, ' + Descriptors.hipDescript() + ' bucking in time to each of your pulsing loads. Vala lets her body be used like a cocksleeve, drinking in the abuse as much as your ejaculate. She twitches, limply, against you and cums again, whispering desperate imperatives to fuck her harder and fill her with your sweet seed.\n\n', false );
			EngineCore.outputText( 'Finally spent, you step back and toss the girl off of your ' + Descriptors.cockDescript( 0 ) + ', letting her fall back into a slump against the wall, dangling from her manacles. A wicked thought crosses your mind and you step back to the alchemy table. Grabbing armfuls of hexagonal bottles, you flip the girl around, exposing her drooling, empty face and her sore, gushing breasts. You plug a bottle up to her lips and she begins sucking at it automatically, perhaps believing it\'s a dick in some corner of her ravaged mind. Vala quaffs the Ovi Elixir gratefully, then a second, then a third. By the time you\'ve finished pouring the stuff down her throat, her body has already begun changing. The elixir has pounced on your seed and forced her ovulation, rapidly accelerating the speed of conception. Her tummy pouts, then bloats as your sperm impregnates the fairy in seconds. Her abdomen swells violently, and you suspect that force-feeding her so much so quickly may have resulted in twins or triplets. She moans in blissful pregnancy, her already disproportioned tits gurgling with even greater milky weight. If there was any doubt as to if she could stand under her own power before, it\'s gone now- even your strength wouldn\'t be able to move the breeding cow that you\'ve turned her into. Knowing your luck, however, she\'ll have given birth by the time you check in next.', false );
		}
		//f2;
		else if( CoC.getInstance().player.gender === 2 ) {
			EngineCore.outputText( 'She squeals in delight and her knees wobble, the force of your thrust almost knocking her head into the wall she\'s shackled next to. You work the huge dildo further into the girl\'s drooling snatch until a mere 9 inches remains protruding from her bright pink cunny. You smear more of the girl\'s lubrication along the exposed shaft and turn your back to the fairy. Bending down, you slowly rub your ' + Descriptors.buttDescript() + ' against the smaller, rounded base of the minotaur cock. Though your end is veiny and sheathed, it lacks the broad flare of the cock head, so you press your ' + Descriptors.vaginaDescript( 0 ) + ' against it and brace your hands on your knees. Rolling your ass up and down, you let your own excitement-thick lube smear the rounded end before you take a step backwards, toward the fairy. The bulb slides past your ' + Descriptors.assholeDescript() + ' and presses against your vaginal entrance, its girth exciting and frightening. You take a deep breath, but before you\'re ready, Vala bucks backward and drives the dildo into your unprepared cunt, provoking a cry of surprise.', false );
			EngineCore.outputText( 'You quickly recover and thrust backwards, driving more of the dildo inside your clenching walls while also slamming the fairy\'s slick box in lusty punishment for her overeagerness. She giggles and humps right back, driving another inch into you, your ' + Descriptors.vaginaDescript( 0 ) + ' aflame with the delicious stimulation of the bumpy, uneven veins carved into the smooth cock-base. Before long, the two of you have a rhythm, driving the makeshift double-ended dildo into each other until you end up ass-to-ass, your ' + Descriptors.buttDescript() + ' smacking heavily against the fey girl\'s supple rear. A large puddle of girl cum has begun forming on the floor, each wet slap of your cunts splashing more of the warm, clear liquid between the two of you. You can feel your orgasm building a knot in your gut and you bite your lower lips as you make your thrusts more forceful, more insistent, slamming yourself down on the veiny cock, driving the flared head deeper into the fairy\'s body. She, in turn, is just as consumed by lust and tries to jackhammer it right back, until you can feel the rounded base pushing against your cervix, blissful pain coursing through your lower body.\n\n', false );
			EngineCore.outputText( 'You clutch your ' + Descriptors.allBreastsDescript() + ' and squeeze your ' + Descriptors.nippleDescript( 0 ) + ' until it hurts, the agony giving you strength to drive the dildo back into the fairy, but it\'s a losing battle. Vala cums before you do, her pulsing walls locking down and driving the dildo out, inch by painful inch, deeper into your body until the base is so far against your gut that it is pushed into your womb with a toe-curling pop. You silently scream in ecstasy and agony, unable to believe that the frail fairy managed to fuck your womb with your own toy. Your strength falters and you slump down, sliding off the shaft with soothing regret, your cervix clenching wildly, still spasming from its penetration. You roll onto your back, fairy cum all around you, even now dripping down the lube-slick cock still sticking out of the girl\'s pussy, flared tip keeping it locked inside of her. You jill your ' + Descriptors.clitDescript() + ' for a few minutes afterward, just enjoying the afterglow, lapping at the dripping sprite cum that dribbles onto your face from the fairy\'s shivering, dick-stuffed cunt. Gradually, your strength returns and you rise, skin slick with the cum pool you\'ve been basking in. You give Vala\'s ass a slap on your way out- a reward for your favorite brainless fairy.', false );
		}
		//h2;
		else {
			EngineCore.outputText( 'She squeals in delight and her knees wobble, the force of your thrust almost knocking her head into the wall she\'s shackled next to. You work the frightful dildo further past the girl\'s gaping spincter until a mere 9 inches remains protruding from Vala\'s bright pink hole. You smear more of the girl\'s lubrication along the exposed shaft and turn your back to the fairy. Bending down, you slowly rub your ' + Descriptors.buttDescript() + ' against the smaller, rounded base of the minotaur cock. Though your end is veiny and sheathed, it lacks the broad flare of the cock head, so you press your own pussy against it and brace your hands on your knees. Rolling your ass up and down, you let your own excitement-thick lube smear the rounded end before you take a step backwards, toward the fairy. The bulb slides past your butt cheeks and presses against your vaginal entrance, its girth exciting and frightening. You take a deep breath, but before you\'re ready, the impaled fairy bucks backward and drives the dildo into your unprepared ' + Descriptors.vaginaDescript( 0 ) + ', provoking a cry of surprise.\n\n', false );
			EngineCore.outputText( 'You quickly recover and prepare your second surprise. Reaching behind you, you grab your stiffening ' + Descriptors.cockDescript( 0 ) + ' and push it backwards, until it\'s just under the dildo connecting the two of you. With a thrust backwards, you punch your dick into her drooling pussy, while driving more of the dildo inside your clenching walls, slamming the fairy\'s colon in lusty punishment for her overeagerness. She giggles and humps right back, driving another inch of your shaft into her cunny, your ' + Descriptors.vaginaDescript( 0 ) + ' aflame with the delicious stimulation of the bumpy, uneven veins carved into the smooth cock-base. Before long, the two of you have a rhythm, driving the makeshift double-ended dildo into each other and thrusting your tail-like cock into Vala until you end up ass-to-ass, your ' + Descriptors.buttDescript() + ' smacking heavily against the fey girl\'s supple rear. A large puddle of girl cum has begun forming on the floor, each wet slap splashing more of the warm, clear liquid between the two of you. You can feel your orgasm building a knot in your gut and you bite your lower lips as you make your thrusts more forceful, more insistent, slamming yourself into her violated nethers, the fairy\'s body as bloated from half of the minotaur dildo as from your own girth. She, in turn, is just as consumed by lust and tries to jackhammer it right back, until you can feel the rounded wooden base pushing against your cervix, her own inner barrier slamming against your cockhead, blissful pain coursing through your lower body.\n\n', false );
			EngineCore.outputText( 'You clutch your ' + Descriptors.allBreastsDescript() + ' and squeeze your ' + Descriptors.nippleDescript( 0 ) + ' until they hurt, the agony giving you strength to drive the dildo back into the fairy, but it\'s a losing battle. Vala cums before you do, her pulsing walls locking down and driving the dildo out, inch by painful inch, deeper into your body until the base is so far against your gut that it is pushed into your womb with a toe-curling pop. You silently scream in ecstasy and agony, unable to believe that the frail fairy managed to fuck your womb with your own toy. Your strength redoubles and you thrust back, your ' + Descriptors.cockDescript( 0 ) + ' penetrating her spongy, well-used cervix, her womb sucking you inside it. You release the knotted tension, spraying your spunk deep inside her. You slap your ' + Descriptors.buttDescript() + ' against hers with each pulsing load, your ' + Descriptors.vaginaDescript( 0 ) + ' clenching at the dildo stuffing it even as your empty your seed into the chained slave.  You try to go limp, but the double penetrated girl keeps you from pulling out, both of Vala\'s milking holes pining you against her until every last drop of your sperm has filled her greedy womb. Fairy cum drips down your length, while the flared tip deep inside her large intestine keeps your pussy twitching against her posterior. You jill your ' + Descriptors.clitDescript() + ' for a few minutes afterward, just enjoying the afterglow as your strength returns and the fairy\'s body unclenches, releasing you from your breeder\'s embrace, the minotaur dildo still halfway up her ass. You give your fairy girl\'s rump a slap on the way out- a reward for her brood mother-sized hips.\n\n', false );
		}
		//DAH END;
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'cor', 1 );
		EngineCore.doNext( EventParser.playerMenu );
	};
	//[Wake];
	Dungeon2Supplimental.prototype.wakeValaUpBeforeYouGoGo = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		//(Male);
		if( CoC.getInstance().player.gender === 1 ) {
			EngineCore.outputText( 'You don\'t bother searching the room for a key to her shackles, knowing she\'s just clapped them over her limbs for the feel of the metal. You pull them open and, predictably, Vala slumps to the ground in an ungainly heap. The fall seems to have roused her, at least, because she blinks, slowly, several times before lifting her head to stare blankly at you. You give her a moment to gather herself but when she\'s managed to assemble what wits she\'s got left, it\'s clear she only recognizes you as her pleasure giver. She slowly curls her mouth into a hopeful smile. "<i>How can Vala please Master?</i>" she asks in an innocent voice tainted by husky desire. It seems she still shows no sign of improvement. Well, at least you can both take some enjoyment from your visit.\n\n', false );
			EngineCore.outputText( 'The fairy\'s grinding and the sweet scent leaking out of her honey pot is as tempting as ever. You push the girl back gently and nod your head, stripping your ' + CoC.getInstance().player.armorName + ' piece by piece, teasing the fairy with your slowness. She curls her lips into a wanton smile. "<i>Now fuck Vala!</i>" she begs. You chuckle and show your satisfaction at the small restoration of her mind by grabbing one of her supple tits and leaning down to suck out some of her chest-bloating milk. She arches her back under your touch and clenches her muscles. Her hands find your genitals, eager fingers sliding across your sensitive ' + CoC.getInstance().player.skinDesc + '. Her hand grabs your ' + Descriptors.cockDescript( 0 ) + ', thumb and pinkie forming a tight circle at your base while her other fingers stroke up and down your shaft. The fairy\'s touch is surprisingly light for the rough treatment she\'s endured, and you\'re quickly brought to hardness under her caresses.\n\n', false );
			EngineCore.outputText( 'Whatever small parts of her mind may be returning, she clearly hasn\'t conquered her sex-madness, because she simply cannot restrain herself any longer. Fluttering her wings rapidly, the girl lifts out of your embrace and rises above you, lining her sex up with yours, thick beads of wetness trickling down from her gaping pussy. With a mad giggle, she stops flapping and drops down, impaling herself on your length.\n\n', false );
			EngineCore.outputText( 'Vala slides onto your cockhead with gleeful squeals as you part her rose-petal labia and slide into her well-worn depths. Her body\'s recovered some of its tightness, and hugs your ' + Descriptors.cockDescript( 0 ) + ' comfortably, walls clenching as her slavering cunt sucks your dick into her well-lubricated passage. Her abdomen distorts at your insertion, but instead of pain or fear, her expression is utter bliss, her pink eyes fluttering as she wordlessly mutters sweet nothings into your chest. She\'s tight and getting tighter as you pump slowly, working your long inches into the fairy\'s needy hole. Her body is hot around you and her milky tits drool with each thrust, their milk fragrant like rose water. At this rate, the condom-tight girl is going to make you blow your load before you get a chance to give her an orgasm of her own.', false );
		}
		//(Female);
		else if( CoC.getInstance().player.gender === 2 ) {
			EngineCore.outputText( 'You don\'t bother searching the room for a key to her shackles, knowing she\'s just clapped them over her limbs for the feel of the metal. You pull them open and, predictably, Vala slumps to the ground in an ungainly heap. The fall seems to have roused her, at least, because she blinks, slowly, several times before lifting her head to stare blankly at you. You give her a moment to gather herself but when she\'s managed to assemble what wits she\'s got left, it\'s clear she only recognizes you as her pleasure giver. She slowly curls her mouth into a hopeful smile. "<i>How can Vala please Mistress?</i>" she asks in an innocent voice tainted by husky desire. It seems she still shows no sign of improvement. Well, at least you can both take some enjoyment from your visit.\n\n', false );
			EngineCore.outputText( 'You select what looks like a reasonably clean spot in the room and carry the girl with you. Sitting cross-legged, you let her sit in your lap as you brush Vala\'s violet hair from her face. Spitting on your hand, you wipe some of the grease and dirt from her face, while she coos at your touch. Under all the grime, she\'s actually quite pretty, an impossibly frail yet timeless sort of beauty that reminds you of snowflakes back home. You smile, despite yourself, and give the girl a little kiss of affection, stroking her tattooed shoulders gently. She returns your kiss with a famished sort of desperation, trying to gobble your face down in gulping slurps that force you to pull back and wipe the spittle from yourself. She\'s just not going to be happy until she gets something inside her.\n\n', false );
			EngineCore.outputText( 'You ask her if she feels up to flying, and she nods, eager to please. By way of demonstration, she flutters her dragonfly wings and lifts a couple feet into the air, heavy chest causing her to sway precariously. You stroke your hands up her legs, pulling them around your shoulders and drawing the girl\'s pussy toward your head. Vala\'s labia is almost artistic- hairless folds like rose petals, her leaking excitement like morning dew. You lean in and lick gently around her slit, the tip of your tongue tracing teasing circles around her small, overstimulated clit. She squeals in a pitch that you thought only dogs could hear and her legs clench around your head. Sliding your tongue into her gash, you savor her sweet warmth.', false );
		}
		//(Herm);
		else if( CoC.getInstance().player.gender === 3 ) {
			EngineCore.outputText( 'You don\'t bother searching the room for a key to her shackles, knowing she\'s just clapped them over her limbs for the feel of the metal. You pull them open and, predictably, Vala slumps to the ground in an ungainly heap. The fall seems to have roused her, at least, because she blinks, slowly, several times before lifting her head to stare blankly at you. You give her a moment to gather herself but when she\'s managed to assemble what wits she\'s got left, it\'s clear she only recognizes you as her pleasure giver. She slowly curls her mouth into a hopeful smile. "<i>How can Vala please Mistress?</i>" she asks in an innocent voice tainted by husky desire. It seems she still shows no sign of improvement. Well, at least you can both take some enjoyment from your visit.\n\n', false );
			EngineCore.outputText( 'Scooping her up in your arms, you marvel at the weightlessness of the fairy, even her chest-slapping titties are nothing to you. Carrying her to the center of the room, you set the girl down and retrieve her large, wooden bowl from a corner of the room. The three-gallon bowl\'s \'Bitch\' title has been scratched out and replaced by a rough \'Vala.\' You plop it down, in front of her, and fish around the tubes and toys hanging from the ceiling, selecting a promising looking one. The pale hose has a large, metal, imp-shaped cock for a tip and a nozzle at the base of the foot-long dildo. You twist the lever an inch and a slow, steady stream of cum comes leaking out the end. Grinning, you let the leaking iron dick splash ropey strands of slime across the fairy\'s tattooed backside, along her impossibly frail dragonfly wings, and into her glimmering purple hair.\n\n', false );
			EngineCore.outputText( 'Finally reaching the bowl, you twist the nozzle all the way and are nearly knocked to the ground by the pressure. The fire hose of sperm blasts into the large wooden bowl and splashes upward, painting the girl\'s face with alabaster cream. Before long, the bowl is full to overflowing and you cut off the flow of cum from the device. Kneeling down next to her, you stroke the back of her head and apply just the slightest bit of pressure toward the seething meal. "<i>Dinner time, Vala,</i>" you offer to the fairy, and her resistance crumbles, burying her face in the spunk, bubbles rising from the frothy bowl as she begins to suck it down with mindless obedience.\n\n', false );
			EngineCore.outputText( 'Your ' + CoC.getInstance().player.multiCockDescriptLight() + ' is getting hard from the display, and you figure it\'d be easier to satisfy the girl if you filled her from multiple holes. Reaching up again, you pull down a different hose, this time selecting a dildo that looks like an amalgam of several dick types. It\'s flared, like a horse\'s, knotted at the base, like a dog\'s, bulbous in the middle, like a lizard\'s, and barbed all along, like a cat\'s. You have no idea what kind of cum is filling this one, but you kind of want to see what\'ll pop out of the broken fairy. Hauling it down, you slide the hose behind you, threading it around your ' + Descriptors.buttDescript() + ', along your ' + Descriptors.vaginaDescript( 0 ) + ', and under your ' + CoC.getInstance().player.multiCockDescriptLight() + '. You bring your shaft to her gaping cunt and rub along her oozing labia, the puffy flesh inflamed with her desire. Slowly, you begin to slide your ' + Descriptors.cockDescript( 0 ) + ' in first, letting her walls adjust to your girth, before pressing the dildo-nozzle into her twitching hole. The pressure of the strangely warm metal drives the fairy crazy, and her steady guzzle from the bowl becomes frantic gulps, her belly beginning to show a paunch from her meal. You let the girl\'s crystal cum soak the chimera-cock before feeding it into her slavering pussy, inches at a time. The girl\'s brood mother hips are so wide that you manage to penetrate her recesses with both cocks, though her abdomen stretches violently as the two cocks work their way deeper into her.', false );
		}
		EngineCore.dynStats( 'lus', 999 );
		//[Next];
		EngineCore.doNext( this.wakeMeUpBeforeValaGoGosPtII );
	};
	Dungeon2Supplimental.prototype.wakeMeUpBeforeValaGoGosPtII = function() {
		EngineCore.spriteSelect( 85 );
		EngineCore.outputText( '', true );
		EngineCore.hideUpDown();
		//m2;
		if( CoC.getInstance().player.gender === 1 ) {
			EngineCore.outputText( '', true );
			EngineCore.outputText( 'You spot an unsecured set of chained manacles on the floor and an idea strikes you. Vala still sliding along your shaft, you bend down and grab the fetters, snapping one around the girl\'s neck like a collar. With a shudder at the cold, you lift the fairy up and lock the other end of the shackles around the root of your ' + Descriptors.cockDescript( 0 ) + ', steel snapping around your base tightly. The makeshift cock-ring works perfectly as your ' + Descriptors.hipDescript() + ' quiver, your body trying to orgasm but denied release by the metal loop. The fairy, meanwhile, thrashes atop your groin, the chain of her collar swinging between her tits, buffeting them with enough force to spray small white streams as she rides you. Her purple hair glimmers pink in the dull light of the dungeon as it bounces right along with her rocking hips. Even the diminished pulses of sunlight streaming from her stained and tattooed skin seems brighter as she is filled labia to cervix by your straining fuckpole.\n\n', false );
			EngineCore.outputText( 'She moans in a series of small, cute gasps and her pussy clenches your ' + Descriptors.cockDescript( 0 ) + ' as tightly as the makeshift cock-ring. You savor the sweet shivers that run up her spritely body, fingers clenching around your arms and legs wrapping about your ' + Descriptors.buttDescript() + ' to slam deeper, even taking the chained shackle at your base into her cumming slit. It feels like a flood is released from the fairy\'s gaping box, warm fluid splashing around your bulging length and raining down to leave a thin, clear puddle under you. You bite your lip and slide your fingers into her vice-like pussy, to unhook the shackle around your cock, and the added insertion gives the girl enough to cum again, her body shaking violently against yours, squirting her hot girl cum over your hand. Vala notices what you\'re trying to do and she slams down onto your hand with added force, making it difficult to spring the catch. The pressure in your loins is getting painful now, and you lean against a wall, using both hands to try to unclap the fetters around your ' + Descriptors.cockDescript( 0 ) + '. Between her wings and the chain, she manages to stay firmly locked onto your root, grinding orgasmically as more fingers push past her pulsing lips and fumble at the cock-ring.\n\n', false );
			EngineCore.outputText( 'She cums a third time, utterly soaking your lower body, and you nearly wail with frustration. Clenching your teeth, you grunt and grab the fairy\'s cock-widened hips. You jam into her as hard and fast as you can, trying to fuck through the pressure and break your shackles with the force of your cum.\n\n', false );
			EngineCore.outputText( 'Vala is enjoying your pulsing erection inside her far too much to make it easy for you. You\'ve seen her tricks, however and you thrust more forcefully than she was braced for, finally pulling the fey cocksleeve off your root. Without wasting a moment, you pull the locking bar out of the shackle and finally allow your orgasm to blast into her waiting womb. You slip in the fairy\'s cum puddle and fall on your ' + Descriptors.buttDescript() + ' as your ' + Descriptors.cockDescript( 0 ) + '  dumps its long-delayed loads inside the distended girl. The feeling of cum filling her pussy drives her to a fourth orgasm, her toes curling and wings flapping wildly. She\'s so tightly clenched around you that there\'s nowhere for your cum to run out, so her womb bloats to a pregnancy-thickness and she loses the strength to keep writhing in your lap, simply collapsing into your chest with a weak cooing.\n\n', false );
			EngineCore.outputText( 'She\'s unconscious by the time you\'re finished seeding the fairy, the girl\'s chest barely rising and falling under her disproportionately huge breasts and massively inflated womb. Even better than a goblin, you reflect, marveling at the fairy\'s resilience to the rapid sequence of orgasms. Though, you suppose, once you\'ve already been fucked mindless, there\'s little left to break. You resolve to check back on her again.', false );
		}
		//f2;
		else if( CoC.getInstance().player.gender === 2 ) {
			EngineCore.outputText( 'You close your eyes and run your tongue into her groin with teasing flicks and probing touches, exploring her nethers and lapping up the constant flow of fae cum that dribbles from her perpetually wet body. She shifts in the air, but her clenching thighs keep you from seeing anything but her juicy snatch. When a hot, humid panting puffs against your ' + Descriptors.vaginaDescript( 0 ) + ', you realize she must\'ve done a 180 in the air, wings keeping her in a vertical 69. She descends on your pussy with relish, savoring the taste of your moist body. Her needy tongue is as delicately thin as the rest of her body, but it is LONG. She threads it into your depths and you buck your hips as it just keeps going deeper and deeper. You moan into her abdomen and flatten your own tongue to bring as much roughness against her twitching walls as you can, trying to get the little minx off before she sucks your orgasm from you.\n\n', false );
			EngineCore.outputText( 'It\'s a hopeless race, however, as she quickly zeros in on your g-spot, curling her tongue to coil thickly inside of you. You grab Vala\'s purple hair and crush her head into your crotch, adorable button nose grinding against your ' + Descriptors.clitDescript() + ', momentarily distracting you from the fairy\'s pussy as she tongue-rapes yours. When you cum, your body tenses and you hold your breath as your ' + Descriptors.hipDescript() + ' threaten to draw the small girl\'s whole head into your ' + Descriptors.vaginaDescript( 0 ) + '. You hear a slurping and realize she\'s drinking your girl cum. The thought is enough to remind you about the fairy slit at eye-level just as she cums from the taste of your body. She squirts wildly into your face, small jets of hot, sticky liquid spraying into your mouth, over your cheeks, and into your eyes.\n\n', false );
			EngineCore.outputText( 'You blink, and give the little brat a bump on the back of the head for her sneaky facial. She flutters right-side up again and when you see her face, your heart leaps in your chest. Your orgasm has washed her visage clean and you realize she\'s breath-taking. The soft curves of her heart-shaped face, the timeless alabaster of her flawless skin, and most surprisingly, the glimmers in her almond-shaped, pink eyes. She kisses you, softly this time, almost affectionately, the taste of your sex still wet on her lips. Perhaps your exchange unlocked the memory of sweeter days with her fairy sisters? She might never be able to recapture those lost days, but in time, perhaps she can forge a new life among larger folk. You return her kiss and redress as she finally gets some restful, if wet, sleep.', false );
		}
		//h2;
		else if( CoC.getInstance().player.gender === 3 ) {
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 'It\'d be a shame if you didn\'t get a chance to stuff all her holes, so you grab your ' + Descriptors.cockDescript( 1 ) + ' and slide it along her ass cheeks, pulling out just enough to let it rest against her twitching sphincter. With a probing pinkie, you stretch out her rectum, the muscle spongy from the endless cavalcade of imp-rape you saved her from. You slide in and are pleasantly surprised that her ass is nearly as slick as her pussy, already lubricated by some body-altering drug the imps must\'ve fed her. You grunt in surprise when you feel your two cocks rubbing against each other through the fleshy wall separating her vagina from her ass, and the extra friction nearly makes you blow your load then and there, but by force of will, you hold it back, teeth gritted in the effort.\n\n', false );
			}
			EngineCore.outputText( 'Your ' + Descriptors.vaginaDescript( 0 ) + ' needs some loving too, so you grab the imp dildo you filled the fairy\'s bowl with and slide it between your ' + Descriptors.hipDescript() + ', the cold metal exciting your moist sex and driving your shaft deeper into the girl. Hesitating at first, your restraint crumbles and you press the steel tip to your wet sex, and roll it around your clit, the chill sending electric tingles through your groin and sets a raging fire in your loins as your flesh walls pulse from your racing heart. You guide the imp-shaped dildo to your pussy and slide the demonically sculpted toy into your body, unyielding metal parting your soft, supple skin, folds of pink flesh sucking at the knobby shaft. You gasp and nearly pull out of the tight confines of the fairy\'s double-stuffed cunt, but with a quick thrust, you penetrate yourself and jam more long inches into Vala.\n\n', false );
			EngineCore.outputText( 'The steel against your ' + Descriptors.cockDescript( 0 ) + ' and inside your cunny gurgle with their restrained payloads and you resist the urge to twist both nozzles until they break, instead beginning a slow bucking ride of the fairy. Sliding the imp cock into your ' + Descriptors.vaginaDescript( 0 ) + ' on each back-thrust, and stuffing more of the monstrous dildo into her quivering body with every bucking motion, you work your arms as much as your hips. The bulge of your tools inside her nubile body gets deeper with every push, rushing to meet the swell of her cum-stuffed stomach, having downed nearly two of the three gallons you poured for her already. As you\'re rocking back, building up to a truly delicious orgasm, the slick girl cum from your pussy drips between your fingers and you lose your grip momentarily. Trying to regain it, your hand accidentally strokes the nozzle at the base and your eyes go wide as the imp cock unleashes a torrent of seething spunk into your body. Panicking, you try to twist it shut again, but only manage to open the spigot all the way, your abdomen nearly bursting as the firehose blasts your cervix with a gushing pillar of cum.\n\n', false );
			EngineCore.outputText( 'Your careful restraint is torn from your body and an orgasm overtakes you.  ', false );
			//(2 Dicks- ;
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 'The ' + Descriptors.cockDescript( 1 ) + ' inside the fairy girl\'s ass erupts first, pumping your seed into her bowels, her hips distorting with the bursting flow of your cum, her sphincters clenching powerless to stop your alabaster flood.  ', false );
			}
			EngineCore.outputText( 'Inside Vala\'s drooling pussy, your ' + Descriptors.cockDescript( 0 ) + ' twitches as your load rushes over the steel dildo and spurts from your cockhead in hot ropes of gooey love. You manage to think through the suffocating pleasure addling your brain and flick the nozzle of the chimera dildo, the tube kicking to life. The monstrous hose vibrates your entire lower body and you tremble helplessly as you\'re stimulated nearly to breaking. The fairy girl, already happily shattered, merely lets out a stream of mad laughter, cum bubbling over her lips as her cunt is turned into a cornucopia of monster jizz. A cunny-copia, you giggle to yourself, her insane glee infecting your exhausted body. The double-penetrated fae bloats and swells under the pressure of the cum-pump, supplemented your own obscene spunk stuffing.\n\n', false );
			EngineCore.outputText( 'When your orgasm subsides, you finally manage to switch off the imp pump in your ' + Descriptors.vaginaDescript( 0 ) + ' and pull it out, tenderly. Your abdomen has been filled enough to leave a paunch of infernal cream below your belly. You press down on it, demonic ichor spilling out of your swollen vagina and splashing between your ' + Descriptors.hipDescript() + '. You sigh and hope the seed doesn\'t take hold. Speaking of taking hold, you switch off the gushing monster pump and carefully pull your ' + CoC.getInstance().player.multiCockDescriptLight() + ' out of the fairy, making sure the metal dildo remains fixed in place to hold the cum inside. You slide out from between her legs and rise unsteadily to look at your handiwork. The fairy has been filled, top to bottom, all three gallons you sprayed in her bowl gone down her thirsty gullet. The jizz you packed into her womb bloats her even further, the girl\'s belly nearly four times larger than it was when you found her. She wriggles on the ground, lost to the cummy heaven her mindless body has been plunged into. You\'re not sure what kind of fucked up child that little exchange would give her, but if anybody had the vagina to pass a monster, it\'d be Vala. You probably won\'t get to find out, though. Who knows what kind of incubation period the chimera-kid will have?', false );
		}
		//[End Encounter];
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'cor', 1 );
		CoC.getInstance().flags[ kFLAGS.TIMES_FUCKED_VALA_IN_DUNGEON ]++;
		EngineCore.doNext( EventParser.playerMenu );
	};
	//Answers the simpler question 'Is Vala at the bar right now' rather than 'can Vala have sex with you right now';
	Dungeon2Supplimental.prototype.isValaAtBar = function() {
		return (CoC.getInstance().flags[ kFLAGS.FREED_VALA ] !== 0 && CoC.getInstance().time.hours >= 12 && CoC.getInstance().time.hours <= 21);
	};
	//Purified Fairy;
	Dungeon2Supplimental.prototype.purifiedFaerieBitchBar = function() {
		if( !this.isValaAtBar() ) {
			return false;
		}
		if( CoC.getInstance().flags[ kFLAGS.FUCKED_VALA_AT_BAR_TODAY ] > 0 ) {
			EngineCore.outputText( '\n\nThe fluttering fairy drops a complimentary drink off at your table with a sly wink.  You can\'t help but notice that she\'s leaving a clear trail of girl cum as she flies past, the cummy trail leaking from between her legs.  Lingering testimony of the break you took with her, no doubt.  She seems a bit busy right now, but maybe if you checked back tomorrow, she\'d be able to take the time to thank you again, tomorrow.' );
			return false;
		}
		EngineCore.outputText( '\n\nA short figure flutters around the bar, a tray of drinks suspended awkwardly by both arms, carefully moving from table to table, dispensing liquor and taking orders for the bartender.  The barmaid appears to be Vala, the fairy you rescued from Zetaz\'s dungeon.  It seems like she\'s found a home in Tel\'Adre.' );
		if( CoC.getInstance().player.gender > 0 ) {
			EngineCore.outputText( '  You could speak with her if you wished to.' );
			return true;
		}
		EngineCore.outputText( '  Speaking to her might be better after you get a gender...' );
		return false;
	};
	//[Vala];
	Dungeon2Supplimental.prototype.chooseValaInBar = function() {
		EngineCore.spriteSelect( 60 );
		var cumBath = null;
		if( CoC.getInstance().player.hasCock() ) {
			cumBath = this.valaCumBath;
		}
		EngineCore.clearOutput();
		EngineCore.menu();
		//(First meeting);
		if( CoC.getInstance().flags[ kFLAGS.ENCOUNTERED_VALA_AT_BAR ] === 0 ) {
			CoC.getInstance().flags[ kFLAGS.ENCOUNTERED_VALA_AT_BAR ]++;
			EngineCore.outputText( 'You take a seat and flag the fairy barmaid over. Vala is dressed in a long, emerald, sleeveless dress that covers her from neck to toe, her fluttering wings keeping the hem from ever touching the ground. She wears thick bracelets around her wrists, has her glittering purple hair done up in a no-nonsense bun, and has a plain white apron over her chest. You realize she\'s intentionally covering up the scars and tattoos from her imprisonment. She doesn\'t seem to notice it\'s you until she gets close enough to touch your shoulder "<i>Oh!</i>" she exclaims. "<i>Why, if it isn\'t my heroic rescuer!</i>" She leans in to give you a kiss on the cheek and places a drink on your table. "<i>From me. It\'s the least I can do. I\'m still new at this, so we\'re a bit slammed right now, but I\'d love a chance to catch up. Can you wait \'til I get a chance to take a break?</i>"\n\n', false );
			//Goto cleansedFirstRemeet();;
			//[Next];
			EngineCore.addButton( 0, 'Next', this.cleansedFirstRemeet );
			return;
		} else if( CoC.getInstance().flags[ kFLAGS.SHOULDRA_MET_VALA ] === 1 ) {
			CoC.getInstance().flags[ kFLAGS.SHOULDRA_MET_VALA ] = 2;
			EngineCore.outputText( 'As soon as you call for Vala, she flutters over with a smile.  Before you even manage a word, she kisses you full on the mouth.  The kiss is a passionate, sloppy mess that has her tongue piercing your lips with reckless abandon, fluttering around your own as she presses her demon-distorted body against you, allowing you to feel just how gigantic her breasts are on her small frame.  It\'s deliciously obscene.' );
			EngineCore.outputText( '\n\nThe human-sized faerie releases you with a high-pitched whimper of excitement, brushing away the strings of saliva that hang between you.  A bit alarmed, you ask what brought on the unusually passionate display.  You\'re still a bit shocked by her attitude - is this a result of the tryst you and Shouldra had?  No, that was almost rape... surely she wouldn\'t be happy about it?' );
			EngineCore.outputText( '\n\nVala pulls back and punches you on the shoulder, just hard enough to leave you wondering if it\'s playful or irritated.  She blurts, "<i>Did you think I wouldn\'t remember last time?  Did you think I couldn\'t feel myself possessed, growing to the size of a building and playing with you like YOU were the faerie?</i>"  Folding her arms behind her nervously, the purple-haired girl unintentionally puts her melons on display as she explains, "<i>What faerie hasn\'t dreamed of getting to be BIG!  There\'s something so... exciting about towering over everyone else and treating them like a little, sexual playtoy.  About the only thing that would make it better would be seeing you stumbling around like a drunk afterward, but I suppose you\'d have to be a proper faerie for that to work...</i>"' );
			EngineCore.outputText( '\n\nYour surprise must be showing, because Vala reaches out a petite finger to catch your chin, slowly pressing your mouth closed.  "<i>I remember it all, and... I wouldn\'t mind being BIG for my... little... hero, again.</i>"' );
			EngineCore.outputText( '\n\nNodding dumbly, you can\'t hide your smile, and you know if you could see inside yourself, Shouldra\'s head would be divided by the world\'s largest grin.' );
			EngineCore.outputText( '\n\n"<i>Now, what did you want today?</i>"' );
			//'Big You' added to menu;
		} else if( CoC.getInstance().time.hours === 20 && Utils.rand( 2 ) === 0 && CoC.getInstance().player.hasCock() ) {
			this.kinathisValaStuff();
			return;
		} else {
			EngineCore.outputText( 'You take a seat and flag the fairy barmaid over. Vala is dressed in her long, emerald, sleeveless dress, the imp tally tattoos on her backside hidden from sight. Her thick bracelets jangle around her wrists, purple hair in its modest bun, plain white apron hiding her swollen chest. She smiles as she approaches and reaches to hug your head into her breast when she reaches you "<i>Why, if it isn\'t my favorite customer.</i>" She gives you a kiss on the cheek and places a drink on your table. "<i>From me, as always. I can never repay my debt to you, but it sure is fun trying. Can I get you anything from the back room?</i>"', false );
			//Once per week special!;
			if( CoC.getInstance().flags[ kFLAGS.WEEKLY_FAIRY_ORGY_COUNTDOWN ] === 0 ) {
				EngineCore.outputText( '\n\nA thought occurs to her and she leans in, conspiratorially. "<i>Actually, some of my sisters are visiting from the forest today. Should we spend some time with them, or do I get you all for myself?</i>"', false );
				//[Fairies][You][Leave];
				EngineCore.choices( 'Faeries', this.faerieOrgyFuck, 'You', this.cleansedValaRepeatBrainFucking, 'Cum Bath', cumBath, '', null, 'Leave', CoC.getInstance().scenes.telAdre.barTelAdre );
			} else {
				EngineCore.choices( 'You', this.cleansedValaRepeatBrainFucking, '', null, 'Cum Bath', cumBath, '', null, 'Leave', CoC.getInstance().scenes.telAdre.barTelAdre );
			}
			if( CoC.getInstance().flags[ kFLAGS.WEEKLY_FAIRY_ORGY_COUNTDOWN ] === 0 ) {
				EngineCore.addButton( 1, 'Faeries', this.faerieOrgyFuck );
			}
		}
		if( CoC.getInstance().flags[ kFLAGS.SHOULDRA_MET_VALA ] > 0 && CoC.getInstance().scenes.shouldraFollower.followerShouldra() ) {
			EngineCore.addButton( 3, 'Big You', this.valaBigYou );
		}
		EngineCore.addButton( 0, 'You', this.cleansedValaRepeatBrainFucking );
		EngineCore.addButton( 2, 'Cum Bath', cumBath );
		EngineCore.addButton( 4, 'Leave', CoC.getInstance().scenes.telAdre.barTelAdre );
	};
	Dungeon2Supplimental.prototype.cleansedFirstRemeet = function() {
		EngineCore.spriteSelect( 60 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'When Vala finishes delivering drinks and making sure everybody is set, she lets the bartender know that she\'ll be taking a break and leaves her apron behind the bar. She leads you to a store room in back and closes the door behind you. Offering you the only chair in the room, a low, wide stool, she seems content to flutter in the air while the two of you talk, her obscene strength making constant flight trivial.  ', false );
		//(NAGA/CENTAUR;
		if( CoC.getInstance().player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR || CoC.getInstance().player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_NAGA ) {
			EngineCore.outputText( 'You eye the stool doubtfully, but she seems insistent, so you lower your body onto the wooden seat and are surprised when it manages to support your upper torso with only a small groan of protest. You fold the rest of your lower body behind you.  ', false );
		}
		EngineCore.outputText( 'She explains how, after coming to, she tried to return to the deepest section of the forest, where her sisters lived. Even though they were willing to take her in, it was clear she no longer belonged amongst them. It was sheer chance that she stumbled upon one of her sisters who was making a trip to Tel\'Adre for unrelated business. When she followed the other girl into the Wet Bitch, the urge to reclaim her life surged in her gut and she asked for a job on the spot. It turned out her wings made the job much easier on packed nights, when the patrons get a little too clingy or the more endowed customers\' engorged organs would trip a less aerial serving girl.\n\n', false );
		EngineCore.outputText( 'In turn, she listens to you relate your latest adventures eagerly, gazing a little too deeply into your eyes and laughing a little too hard at your jokes. Before too long, it\'s clear the girl has one thing on her mind. She reaches a hand out and touches your shoulder gently. "<i>Surely you didn\'t think the drink would be your only reward?</i>" she murmurs, windy voice husky with desire. Her pink eyes stare into yours, no longer lost to mindless lust, but full of want and intellect, a doll no longer.\n\n', false );
		EngineCore.outputText( '"<i>I\'ve been looking forward to this,</i>" she whispers, flying up to steal a kiss from you, her soft, fey lips leaving a taste of pure, spring rain on the tip of your tongue. Piece by piece, she strips the clothes from your shoulders and hips, leaving warm kisses on your exposed skin with every piece she removes. When your body is laid bare before her, the pixie raises her hands to her own dress. She hesitates to expose the permanent scars the imps left on her, but sighing, she laughs and a sweet wind sweeps through the storeroom. "<i>Silly to be bashful around you, of all people,</i>" she chuckles, sliding out of her verdant silk, pulling pins from her bun to let long, violet tresses spill down her shoulders with a shake of her head. She bats her eyes at you over one shoulder and flashes a wry little smile. "<i>If we can replace every hash mark on my back with one of your visits, I\'ll switch to backless dresses,</i>" she teases. Flying over you, she lands her delicate legs and plump, breeder\'s rear in your lap, wrapping her arms around your shoulders and hugging you tightly. "<i>So, what\'s on your mind, hero?</i>"', false );
		//[You][Leave];
		EngineCore.choices( 'You', this.cleansedValaFuckHerBrainsOut, '', null, '', null, '', null, 'Leave', CoC.getInstance().scenes.telAdre.barTelAdre );
	};
	//[You] ;
	Dungeon2Supplimental.prototype.cleansedValaFuckHerBrainsOut = function() {
		EngineCore.spriteSelect( 60 );
		EngineCore.outputText( '', true );
		//[Male/Herm Growth scene];
		if( CoC.getInstance().player.totalCocks() > 0 ) {
			EngineCore.outputText( 'You don\'t even have to speak, she reads your desire as plainly as you can read hers. She flutters her wings in eager anticipation as she slides her hands up your chest and over your arms, thumbs tracing the curve of your muscles while fingertips dance across your ' + CoC.getInstance().player.skinFurScales() + '. With anxious quickness, she gently caresses your body with every breath. Vala leans in to kiss your neck and shoulders while shifting to straddle you, her enormous breasts hotter than her kisses as she presses into you. She savors the nearness for a long moment, just feeling your heartbeat against hers, sighing happily in your arms, before she wraps her legs around your waist and begins to grind her ass into your crotch. Time has not abated the torrential flow of clear lube leaking from her aroused pussy, and your lower body is soaked by her rose-petal labia, her ample rear spreading the warm liquid across your lap and over your stiffening length. You hiss in teased excitement and reach your hands across her broad, breeder\'s hips to clutch her bubble-bottom cheeks. She rocks up and down, her drooling lower lips sucking at your shaft with each motion, heat pouring out of her cunny.\n\n', false );
			EngineCore.outputText( 'Feeling your straining body, hard against hers, she runs a hand through her purple hair, spilling it across half of her face. "<i>I want you to enjoy this as much as I will.</i>" Vala reaches a hand between her legs and slides against your abdomen, guiding your ' + Descriptors.cockDescript( 0 ) + ' into her pussy. The fae\'s labia practically breathes the heat of her uterus across your twitching shaft and you slide through her well-lubricated depths with a moist sigh, her inhuman snatch tight with her passionate yearning. She rocks back and forth barely an inch at a time, but it\'s enough to ignite a manic need in your loins. ', false );
			//[2 dicks-;
			if( CoC.getInstance().player.totalCocks() > 1 ) {
				EngineCore.outputText( '"<i>Fairies don\'t exactly crap rainbows, but we\'re not quite like normal humans either,</i>" she grins, taking your ' + Descriptors.cockDescript( 1 ) + ' and pressing it against her pudgy butt, her pink sphincter loosening just enough to slip your cockhead inside the fairy\'s body before it clenches down. It almost feels like she\'s got a hand inside of her ass; the walls ripple with expert coordination, rings of muscle clenching and loosening with a dexterity that takes the breath from you. Your tip, sealed just inside her posterior, is milked with a tight grace that has your body twitching before you realize it.  ', false );
			}
			//3+ dicks- ;
			if( CoC.getInstance().player.cockTotal() >= 3 ) {
				EngineCore.outputText( 'Vala takes a deep breath, letting the feeling of your meat inside her gut stoke the fires of lust growing in her belly. "<i>I think there\'s a little room left, if you\'re game,</i>" she whispers, moving to your ' + Descriptors.cockDescript( 2 ) + '. She bites her lower lip and forces herself down on it, squeezing your two shafts together in her well-lubed love tunnel. The feeling of your straining lengths inside her triple-stuffed body is an ecstatic agony that robs you of words and your body thrusts helplessly, Vala\'s breeder hips grinding in fleshy ripples, her lower torso swollen with cock.  ', false );
			}
			EngineCore.outputText( 'You try to hold back the orgasm, but it\'s too late and your cock explodes inside the fairy\'s unearthly womanhood.\n\n', false );
			EngineCore.outputText( 'She coos into your ear as her as muscles release her vice-like grip long enough to slam her rump down on the rest of your length, swallowing every inch in the blink of an eye, her body swelling up with your girth. Parked at your base, she clenches again and begins to stroke your cock', false );
			if( CoC.getInstance().player.totalCocks() > 1 ) {
				EngineCore.outputText( 's', false );
			}
			EngineCore.outputText( ' from base to tip with her inner walls. Biting her lower lip, she grinds her pussy against your waist as your seed slowly fills her nethers. Her disproportionately huge tits drool with milk and you take her nipples in each hand, pressing tightly with your forefingers and thumbs until small white streams jet out of her overburdened chest. She leans backward in ecstasy and her arcing spray splatters against your lips, tantalizingly. You open your mouth and begin lapping at the streams, a buttermilk richness sending revitalizing clarity through your body. Fatigue fades, your mind clears, and your blood pumps with renewed vigor, reanimating your flagging erection. Suddenly, the pressure of her cum-drenched, sucking loins becomes a stimulation that grabs your brain through your crotch. You can feel every inch of your prick', false );
			if( CoC.getInstance().player.totalCocks() > 1 ) {
				EngineCore.outputText( 's', false );
			}
			EngineCore.outputText( ' being stroked and suckled by the fey girl\'s muscles and you tighten your grip on her nipples, intending to earn this orgasm.\n\n', false );
		}
		//[Female Growth scene];
		else {
			EngineCore.outputText( 'You run your hands over Vala\'s flawless skin, fingertips tracing the seemingly frail girl\'s bone structure around her shoulders and down her thin arms before your hands circle round her inflated bosom, yielding flesh hot with the thundering heartbeat inside her chest. She gasps at the feel of your hands on her sensitive skin and giggles when you move your fingertips to her areolas, coin-sized pink buttons that shimmer with the strange, otherworldly glow of daylight that her body seems to radiate. Her nipples are already stiff from your teasing and you stroke the hot bulges with your thumbs, moisture bubbling under your touch. She draws in breath between her teeth and squirms in your lap, her rose-petal pussy drooling across your ' + Descriptors.hipDescript() + ' as she runs her hands through your ' + Descriptors.hairDescript() + '. She pushes against you, stroking your ' + Descriptors.nippleDescript( 0 ) + 's with her hard nubs, pressing her wobbling breasts against your ' + Descriptors.allBreastsDescript() + '. The heat pouring off the little fairy girl\'s body is incredible and you can feel a dampness growing in your ' + Descriptors.vaginaDescript( 0 ) + '.\n\n', false );
			EngineCore.outputText( 'Still in your lap, she swings her legs around yours and braces herself with one hand around your neck and the other on your knees. Sliding back and forth, she strokes her pussy against yours, the slick folds of her labia rubbing against your ' + Descriptors.clitDescript() + ' with wet squishing sounds, sending electric shivers up your spine. You begin to rock back, in time with her motions, your stiff clit stroking hers in tight circles that leave the fairy panting, her legs clenching and unclenching around your ' + Descriptors.buttDescript() + '. The two of you jill against the other\'s joy buzzers until your bodies tremble with orgasm, the fairy sliding her hand from your neck to one of your heaving breasts, squeezing a nipple between her second knuckles hard enough to make you squeak with pain.', false );
			//[Lactating- ;
			if( CoC.getInstance().player.biggestLactation() >= 1 ) {
				EngineCore.outputText( '  The pressure is enough to draw your milk to the surface, tiny jets splashing between the two of you as the fairy milks you with two incredibly agile fingers.', false );
			}
			EngineCore.outputText( '\n\n', false );
			//[Short characters- 3'- 4'11"] ;
			if( CoC.getInstance().player.tallness <= 59 ) {
				EngineCore.outputText( 'The fairy, catching her breath between rolling her tender lower lips against yours, gets a wicked grin on her face and leans in with a whisper. "<i>Let\'s do it like they do in the forest,</i>" she suggests, flicking her dragonfly wings to life. With a fluttering motion, she lifts off of you, flips upside down, and buries her head between your ' + Descriptors.hipDescript() + ', pink lips pressed against your ' + Descriptors.vaginaDescript( 0 ) + ' in a shower of warm kisses.' );
				if( CoC.getInstance().flags[ kFLAGS.VALA_HEALED_HONEY ] === 1 ) {
					EngineCore.outputText( '  You, in turn, take her legs around your temples and rub your nose against her juicy snatch, the fragrance of summer as intoxicating as any of the bottles around you. Your mind goes fuzzy for a moment and you suspect that your pure honey cure may have had some lingering effects on the over-grown girl. She wraps her arms around your ' + Descriptors.buttDescript() + ' and you mirror the grip just as she flaps harder, carrying the two of you into the air, locked in each other\'s love tunnels.\n\n', false );
				}

				EngineCore.outputText( 'Her long tongue remembers your body all too well, flicking your tender clit with just enough force to get your walls pulsing before she slides inside of your ' + Descriptors.vaginaDescript( 0 ) + ', lapping up your girl cum, exploring every bumpy recess of your twitching pussy. You are practically inundated by the girl\'s slippery slit, her sweet nectar gushing around your lips and into your nose as she slowly rolls the two of you through the air in an elegant dance, bodies entwined in passionate feasting, losing yourself to a symphony of glistening, pink flesh. After who knows how many climaxes the girl licks out of your sensitive snatch, she gently lands the two of you on the floor, still nuzzling in your coupled embrace. You\'d lost track of how much of her earthy lubrication you\'ve swallowed, but feeling the solid ground beneath you makes you aware that your belly jiggles with a surprising heaviness, like you\'ve spent the night drinking gallons of honey wine. Vala slides her legs down your body, rubbing her still juicy cunny across your ' + CoC.getInstance().player.skinDesc + ' until she has righted herself to give you a big, wet kiss, your clear cream still moist on her lips. "<i>I wish we could do that every night,</i>" she sighs, happily.', false );
			}
			//[Medium characters- 5'- 6'2"];
			else if( CoC.getInstance().player.tallness < 74 ) {
				EngineCore.outputText( 'The fairy, catching her breath between rolling her tender lower lips against yours, adopts a sultry expression and leans in with a whisper. "<i>Kiss me, you sweet girl.</i>" You lean down and press against the small fairy, her desire pouring from her eyes in an ocean of pink lust. You kiss the girl softly, your lips trespassing on hers, panting breaths traded between the two of you as hands seek each other\'s pleasure centers. Yours go to the small girl\'s heavy breasts, wobbling with their unmilked bounty and you stroke their yielding surface, savoring the weight in your palms and the stiff excitement of her nipples between your fingers. Her hands find your ' + Descriptors.vaginaDescript( 0 ) + ' and Vala\'s fingers play across your lower lips, fingertips tracing the curves of your labia\'s plump ruffles, thumbs flicking your ' + Descriptors.clitDescript() + ' to life with a jarring shock that makes you gasp mid-kiss. The fairy pounces on the opening, her tongue tracing the line of your open lips before sliding into your mouth with a fierce boldness, the warm muscle wrapping around your tongue, filling your mouth with the hot moisture of the fairy\'s blossom-sweet breath. You return the force of her caress, one hand seeking her drooling cunt, eager to return in full the trembling climax she\'s coaxing from you.\n\n', false );
				EngineCore.outputText( 'Slipping a few fingers into your ' + Descriptors.vaginaDescript( 0 ) + ' teasingly, she raises her other hand to your ' + Descriptors.allBreastsDescript() + ', fondling your sweating flesh with a practiced skill she definitely didn\'t learn while in the captivity of the imps. She demonstrates a bit more of her Forest knowledge when she squeezes all four thin, warm fingers into your pulsing pussy and, stroking along the top of your love tunnel, she locates your g-spot almost immediately.  You bite your lower lip and send your own fingers into her cunny, your thumb making small circles around her tiny clit while you alternate pumping your fore and middle finger out of her vagina. She\'s simply more experienced, however, and her inner caresses trace patterns of sensations inside your body that you didn\'t realize you could feel and your muscles go weak as you crescendo under the fairy\'s expertise. She breaks your kiss, a long drooping bridge of spittle joining your mouths, and gently shooshes your whimpering by lowering your head to her breast. You meekly take a nipple into her mouth, your climax still sending electric waves of toe-curling tension through your body, and suckle at her bloated mounds, slurping down Vala\'s sweet buttermilk cream. When her fingers finally release you from your mind-blowing orgasm, you find that your ' + Descriptors.vaginaDescript( 0 ) + ' has spilled a large puddle of warm, clear girl lube all over the stockroom floor- far more girl cum than you\'ve ever produced. Vala lifts her jilling hand to her lips and sensually licks one finger after the other, her pink eyes bright with the mischief of the fae.\n\n', false );
			}
			//[Tall characters- 6'3"+];
			else {
				EngineCore.outputText( 'The fairy, catching her breath between rolling her tender lower lips against yours and panting with desire, leans in with a whisper. "<i>I need to taste you,</i>" she confesses, "<i>to know the nourishment of humans.</i>" You nod, wrapping an arm around the girl\'s narrow waist and haul her up to your bosom. She nuzzles against your ' + Descriptors.allBreastsDescript() + ' her purple hair cascading around your ' + CoC.getInstance().player.skinDesc + ' with a glimmering sparkle of pink amid violet. "<i>My chest is so heavy,</i>" she whines softly, her supple breasts pressing against yours. She flutters her wings and lifts out of your embrace just enough to turn upside down in the air, her hair spilling into your lap and her mammoth jugs hanging heavily around her chin. "<i>Please,</i>" she whispers as she strokes your ' + Descriptors.allBreastsDescript() + ' with her tiny nose, delicate lips kissing your ' + Descriptors.nippleDescript( 0 ) + '. You wrap your hands on either side of her breasts and squeeze them together until her stiff, pink nipples touch and you bring your mouth forward, tongue flicking the milky flesh before drawing both into your lips with relish. Her mammaries begin to leak immediately, filling your mouth with the rich, decadent taste of buttermilk, sweet and heavy on your tongue.\n\n', false );
				//[Not lactating – ;
				if( CoC.getInstance().player.biggestLactation() < 1 ) {
					EngineCore.outputText( 'To your surprise, the mere taste of the girl\'s milk sends a fluid pulsing through your chest and you can feel your breasts filling with milk! You have begun to lactate!  ', false );
					CoC.getInstance().player.boostLactation( 3 );
				}
				EngineCore.outputText( 'Vala\'s lips, perhaps trained to please imp cocks, are tighter on your ' + Descriptors.nippleDescript( 0 ) + ' than you would\'ve believed possible, suckling milk from your depths. With a breathtaking mixture of pressure and softness, she nurses your breast more efficiently than any machine, your warm milk filling her hungry maw in short order. She nurses at each breast in turn, bringing each one to frothy lactation faster than the last until your chest is heaving, your breasts jiggling, and your body clenching down in a shivering climax. Your orgasm leaves you unprepared for the fairy girl\'s and when her body starts quivering, her breasts flood your mouth with more milk than you can handle. Even swallowing as quickly as you can, it runs through your lips and even up your nose in two twin jets of pale alabaster that leave your nostrils wet with the lingering scent of honey wine. Sweating and still leaking milk, she rights herself and lands, cupping her breasts with one hand and stroking the paunch of her tiny stomach with the other. "<i>Ooo... so full. I hope I was as good for you as you were for me,</i>" she coos.', false );
			}
		}
		EngineCore.doNext( this.cleansedValaFuckHerBrainsOutPtII );
		CoC.getInstance().player.orgasm();
		CoC.getInstance().flags[ kFLAGS.VALA_TIMES_CONSENSUAL_SEX ]++;
	};
	//Part 2;
	Dungeon2Supplimental.prototype.cleansedValaFuckHerBrainsOutPtII = function() {
		EngineCore.spriteSelect( 60 );
		EngineCore.outputText( '', true );
		//dicks + growth;
		if( CoC.getInstance().player.totalCocks() > 0 ) {
			EngineCore.outputText( 'Vala leans way back and grabs the edge of the stool while she locks her legs behind your waist, the fairy\'s startling strength pinning the two of you together. She slaps her generous butt onto your dick in long, slow motions, making sure you feel every inch of her rippling passage', false );
			if( CoC.getInstance().player.totalCocks() > 0 ) {
				EngineCore.outputText( 's', false );
			}
			EngineCore.outputText( '. You tweak her nipples harder with each thrust, pale cream spurting in increasingly erratic arcs as her heavy breasts grow light pink from the bouncing of her ride. She clenches her eyes shut and wraps her arms under yours, hands clutching your shoulders with desperate rapture.\n\n', false );
			//[Short characters- 3'- 4'11"] ;
			if( CoC.getInstance().player.tallness <= 59 ) {
				EngineCore.outputText( 'If the blissful expression across her face is any indication, the girl has begun to lose herself in the joy of sex again, her wings fluttering on their own. You keep thrusting, but are alarmed when she begins to pull the two of you off the stool and into the air, oblivious to the world beyond the space between her legs. You grab her broad flanks and try to get her attention by calling her name. "<i>Oh yes!</i>" she moans. "<i>Say my name!</i>" Her body seizes in a clenching climax that squeezes your hips into hers and she embraces you with a fiery passion that crushes the breath from your lungs. "<i>Oh, Vala! Yes! I\'m no one\'s Bitch! Vala! Vala!</i>" she screams from the depths of her euphoria, her sex erupting in a cascading torrent of shimmering fairy cum.\n\n', false );
				EngineCore.outputText( 'You\'re helpless in the orgasming fairy\'s arms and just let yourself go, grabbing one of her tits and sucking with all the force your chest can muster. Pain and fear fall away as the silky butter-cream washes down your throat and you cum inside the girl with long, slow thrusts, her iron embrace becoming velvet as your seed soothes the fires burning at the edge of her mind, easing her back from the edge of lusty oblivion. Panting, she slowly lowers the two of you back to the ground, her cheeks red from embarrassment as much as exertion.\n\n', false );
			}
			//[Medium characters- 5'- 6'2"];
			else if( CoC.getInstance().player.tallness < 74 ) {
				EngineCore.outputText( 'If the blissful expression across her face is any indication, the girl has begun to lose herself in the joy of sex again, her wings fluttering on their own. You keep thrusting, but are alarmed when she begins to pull the two of you off the stool and to your feet, oblivious to the world beyond the space between her legs. You grab her broad flanks as aimless wings drag the two of you on a drunken dance around the stockroom, and it\'s all you can do to keep the fairy\'s wild bucking from crashing into the shelves of bottles on the walls. You try to get her attention by calling her name but she just moans, "<i>Oh yes! Say my name!</i>" Her body seizes in a clenching climax that squeezes your hips into hers and she embraces you with a fiery passion that crushes the breath from your lungs. "<i>Oh, ' + CoC.getInstance().player.short + '! Fuck me, hero! Fuck Vala!</i>" she screams, her sex erupting in a cascading torrent of shimmering fairy cum.\n\n', false );
				EngineCore.outputText( 'You drag the orgasming fairy to a sturdy cask of beer and slam her against it, rocking the huge barrel with every thrust until your orgasm erupts with hard, short thrusts, the girl\'s iron embrace becoming velvet as your seed soothes the fires burning at the edge of her mind, easing her back from the edge of lusty oblivion. She moans and pants slowly, delight coloring her cheeks pink at the feeling of your jizz filling her. She pulls your head down to her chest and you nuzzle your face against her sweat-slick breasts, licking and suckling the fae girl\'s nectar from her heaving, overinflated tits. As the silky buttermilk cream washes down your throat, it adds a pleasant tingling to your slow, wet pumping, giving you a gleeful, light-headed satisfaction. Regretfully sliding out of her cum-dripping body, you carry the featherweight girl in your arms, back to the stool, bending to one knee to setting her down, Vala\'s cheeks pink from joy as much as the heart-pounding tryst.\n\n', false );
			}
			//[Tall characters- 6'3"+];
			else {
				EngineCore.outputText( 'If the blissful expression across her face is any indication, the girl has begun to lose herself in the joy of sex again, her wings fluttering on their own. You keep thrusting, but are alarmed when Vala\'s wings, oblivious to the world beyond the space between her legs, begin to overpower her legs, almost pulling the two of you apart. You grab her broad flanks and crush her into your broader hips, muscles straining against her supernatural flight. She wriggles in your embrace joyfully, bouncing harder with each passing second. Your arms begin to tire and you curl your body around her, wide shoulders and massive chest encircling the tiny girl in a bear-hug to keep her orgasmic fluttering in check. Trying to get her attention, you call Vala\'s name, your chest vibrating her head with the sound of your voice. "<i>Yes,</i>" she moans, "<i>say my name...</i>" Her body seizes in a clenching climax that squeezes your hips into hers and she grasps at you with a small, fiery passion that brings a blush to your cheeks. "<i>Vala\'s big, strong hero...</i>" she whimpers from the depths of her euphoria, her sex erupting in a cascading torrent of shimmering fairy cum.\n\n', false );
				EngineCore.outputText( 'Your limbs entwined, you let the helpless, orgasming fairy\'s hands fondle your shoulders and back as you draw your knees up, enveloping Vala in a full body embrace, her loins milking with every ounce of strength left to her. A flush of pride and nurturing compassion fills your heart even as your own crescendo erupts, linking the two of you in a creamy bond of shivering passion. She nestles in the hollow of your lap, panting with every pulse of jizz you pump into her, nuzzling your chest, perfectly at ease in your ', false );
				//;
				if( CoC.getInstance().player.biggestTitSize() < 1 ) {
					EngineCore.outputText( 'chest', false );
				} else {
					EngineCore.outputText( 'bosom', false );
				}
				EngineCore.outputText( '. Your seed soothes the fires burning at the edge of her mind, easing her back from the edge of lusty oblivion. When you finally uncurl from around her, she shivers, missing the blazing body heat and looks up into your eyes, pink irises sparkling. You understand her unspoken request instantly and you bend down to press your lips against her breast, suckling one milk-laden tit, then the other, soothing the girl\'s swollen mammaries, buttermilk cream rich on your tongue. Gradually, the two of you separate.\n\n', false );
			}
			//[All characters];
			EngineCore.outputText( 'Vala\'s irrepressible energy is restored in short order, and she re-dresses swiftly, barely noticing the tiny milk spots staining her green dress or the thin trail of cum leaking between her legs as she flutters a foot off the ground. She gives you a kiss on the cheek and winks affectionately. "<i>Visit me any time, okay ' + CoC.getInstance().player.short + '? For a free drink or... anything else,</i>" she winks. She bundles her hair back up into a sensible bun and flies out of the stockroom, ignoring the curious glances that follow her as she retrieves her plain apron. You sigh appreciatively and retrieve your own clothes only to find that you\'ve grown! Whatever growth drug the imps gave to Vala must not be entirely out of her system, because her milk seems to have added an extra inch to your frame.', false );
			if( CoC.getInstance().player.tallness >= 120 ) {
				EngineCore.outputText( '\n\nOr was that just your imagination?  On closer examination you\'re not any bigger, but you were huge to begin with!', false );
				CoC.getInstance().player.tallness--;
			}
			//[Player grows 1", lust drops to 0, corruption drops by 1];
			CoC.getInstance().player.tallness++;
			if( CoC.getInstance().player.cor > 40 ) {
				EngineCore.dynStats( 'cor', -0.3 );
			}
		}
		//Part 2 - girls;
		else if( CoC.getInstance().player.hasVagina() ) {
			//[All characters];
			EngineCore.outputText( 'Vala\'s irrepressible energy is restored in short order, and she redresses swiftly barely noticing the tiny milk spots staining her green dress or the thin trail of lubrication leaking between her legs as she flutters a foot off the ground. She gives you a kiss on the cheek and winks affectionately. "<i>Visit me anytime, okay ' + CoC.getInstance().player.short + '? For a free drink or... anything else,</i>" she winks. She bundles her hair back up into a sensible bun and flies out of the stockroom, ignoring the curious glances that follow her as she retrieves her plain apron. You sigh appreciatively and retrieve your own clothes only to find that you\'ve grown! Whatever growth drug the imps gave to Vala must not be entirely out of her system, because her milk seems to have added an extra inch to your frame.', false );
			if( CoC.getInstance().player.tallness >= 120 ) {
				EngineCore.outputText( '\n\nOr was that just your imagination?  On closer examination you\'re not any bigger, but you were huge to begin with!', false );
				CoC.getInstance().player.tallness--;
			}
			CoC.getInstance().player.tallness++;
			//[Player grows 1", lust drops to 0, corruption drops by 2];
			if( CoC.getInstance().player.cor > 40 ) {
				EngineCore.dynStats( 'cor', -0.5 );
			}
		}
		//[End Encounter];
		EventParser.cheatTime( 1 );
		EngineCore.doNext( CoC.getInstance().scenes.telAdre.barTelAdre );
	};

	//[You];
	Dungeon2Supplimental.prototype.cleansedValaRepeatBrainFucking = function() {
		EngineCore.spriteSelect( 60 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'She flashes a beautiful smile and tells the bartender that she\'ll be taking her break early. Grabbing you by the hand, she rushes to the stockroom and sheds her dress without any trace of her former shame about her tattooed back. When you\'re too slow taking off your ' + CoC.getInstance().player.armorName + ', she helps, deft hands made all the quicker by eagerness. When the two of you are naked, she pushes you onto the well-worn stool and sits in your lap, staring into your eyes with a small smile.', false );
		//[Next] (go to Growth scene);
		EngineCore.doNext( this.cleansedValaFuckHerBrainsOut );
	};
	//[Fairies];
	Dungeon2Supplimental.prototype.faerieOrgyFuck = function() {
		EngineCore.spriteSelect( 60 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'Vala giggles and nods to the bartender to indicate she\'ll be taking her break. Taking you by the hand, she flutters upstairs to one of the far rooms of the tavern. When she opens the door, you\'re startled to find the room is virtually filled with fairies. Unlike Vala, they\'re the type you\'re more used to seeing- three to four inches tall, the girls are clothed in shiny black leather straps and wear tiny sable stockings tipped with crystalline heels. There\'s quite a variety of them and dozens of eyes settle on you as Vala pulls you into the room, closing the door behind you. "<i>These are my sisters, from the deep forest,</i>" she introduces. "<i>In my state, a monster or other predator of the woods would surely catch me or, worse, use me to lure my sisters to danger. But with a few complimentary bottles of whiskey, the captain of Tel\'Adre\'s city guard was willing to give them passage to visit me in the city once a week, as long as they stay out of mischief.</i>" The fairies lift off and buzz around you, teeny voices introducing themselves, asking your name, marveling at your huge muscles, or otherwise fawning over you. It\'s a bit much, truth be told.\n\n', false );
		EngineCore.outputText( 'You thank Vala for introducing you, but you\'ve really got to be going, you claim. Demons to defeat, maidens to rescue, all that. The large fairy chuckles and gives you a squeeze. "<i>You\'re so cute when you\'re flustered. Don\'t worry, we\'re not going to all jump you at once- you\'d probably end up like I did! No, I asked my sisters here to help me with a little forest magic. Don\'t you want to see how fairies masturbate?</i>" You\'re a little taken aback by the question, but you nod all the same. "<i>All right girls, the petals please.</i>" The cloud of fairies in front of you disperses, each winged vixen scattering to different corners of the room to retrieve hidden flower petals. Each blossom, you note, matches the hair color of the fairy holding it, creating a dizzying array of  hues as they form circles around the two of you. Vala guides you to the bed and gently removes your ' + CoC.getInstance().player.armorName + ' before instructing you to lie down.\n\n', false );
		CoC.getInstance().flags[ kFLAGS.WEEKLY_FAIRY_ORGY_COUNTDOWN ] = 6;
		CoC.getInstance().flags[ kFLAGS.VALA_TIMES_CONSENSUAL_SEX ]++;
		//[Herm];
		if( CoC.getInstance().player.gender === 3 ) {
			EngineCore.outputText( 'Vala folds her arms across her breast. "<i>But which one should we use?</i>" she ponders. "<i>I wouldn\'t advise trying both- your mind wouldn\'t be able to take it. You\'d end up worse than just mind-broken, you\'d be a drooling shell. And I\'d never do that to my hero,</i>" she smiles and gives you a wink. "<i>So, what would you prefer?</i>"\n\n', false );
			EngineCore.choices( 'Male', this.faerieOrgyFuckMaleContinue, 'Female', this.faerieOrgyFuckFemaleContinue, '', null, '', null, '', null );
		} else if( CoC.getInstance().player.gender === 2 ) {
			EngineCore.doNext( this.faerieOrgyFuckFemaleContinue );
		} else if( CoC.getInstance().player.gender === 1 ) {
			EngineCore.doNext( this.faerieOrgyFuckMaleContinue );
		}
	};
	//[Male];
	Dungeon2Supplimental.prototype.faerieOrgyFuckMaleContinue = function() {
		EngineCore.spriteSelect( 60 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'The fairy girl lands at the edge of the bed, settling on her knees and resting her weighty chest on the mattress. Leaning in, she spreads your ' + CoC.getInstance().player.legs() + ' with warm, delicate hands, fingertips stroking the insides of your thighs. You shiver and squeeze the bedspread between your fingers, a little nervous about this \'forest magic.\' One of the fairies flutters down to Vala and hands her a pale white lily petal with a tittering giggle. The larger fairy takes the soft white bloom and, whispering a silken word to it, licks the cream-colored surface. Slithering further between your legs, she reaches your ' + Descriptors.cockDescript( 0 ) + ' and brushes the petal against your throbbing glans with a teasing caress. Then, much to your surprise, she places it on the tip of her forefinger and places it on the base of your cock. You gasp, the petal\'s soft surface rubbing sensitive skin with a warmth you were unprepared for. After the briefest delay, you lose your breath as the tremor of a small, barely contained orgasm rumbles through your gut. Without hesitation, the fairy barmaid takes a rose petal and repeats the process, another almost-orgasm seizing you and leaving you panting. "<i>Normally we only need the one petal, but since you and I are so much larger than the average fairy, I had my sisters bring lots. All for you,</i>" she whispers, coyly.\n\n', false );
		//[If the Player has unlocked Scylla's Addiction Counseling event];
		if( CoC.getInstance().flags[ kFLAGS.TIMES_SCYLLA_ADDICT_GROUP_EXPLOITED ] + CoC.getInstance().flags[ kFLAGS.SCYLLA_TIMES_SHARED_IN_ADDICT_GROUP ] + CoC.getInstance().flags[ kFLAGS.SCYLLA_MILK_THERAPY_TIMES ] + CoC.getInstance().flags[ kFLAGS.SCYLLA_CUM_THERAPY_TIMES ] + CoC.getInstance().flags[ kFLAGS.SCYLLA_SEX_THERAPY_TIMES ] > 0 ) {
			EngineCore.outputText( 'Another fairy flies toward Vala and you blink through the building lusty haze when you recognize the little girl. Wearing a slightly slutty crystalline gown of translucent gossamer, it seems to be Pastie, the fairy from Scylla\'s addiction counseling meeting. When you call out to her, she bashfully waves back. "<i>Hey, uh, ' + CoC.getInstance().player.short + '. It\'s kinda weird seeing you outside of the meetings. How are you? How have things been?</i>" She looks at your naked, reclined form on the bed and blushes. "<i>Oh, right, right. Um. I\'m just helping out Vala, you know. Sisters and all. Uh. I\'m... I\'m going to just give her this petal and get something to drink, okay? All this sobriety is making this really uncomfortable for me.</i>" The other fairies laugh and Pastie hands off her blossom before zipping out of the room, probably to steal someone\'s drink downstairs.\n\n', false );
		}
		EngineCore.outputText( 'One by one, each of the fairies gives her petal to Vala, and one by one, the largest fairy delicately sticks them onto your ' + Descriptors.cockDescript( 0 ) + '. With each bloom that touches your quivering member, your orgasm builds, never quite erupting from your twitching organ, tearing your self-restraint to shreds. Before long, your teeth are gritted in a steely clench and your eyes are dilated to black pools that make every color around you gleam with a too-bright, lurid hue. Your fingers have given up the bedspread in favor of simply balling into white-knuckled fists and your abdomen aches with the effort of trying to push your seething orgasm out before it suffocates you. Just as your vision is about to black out from the denied climax, Vala takes the final petal and places it atop your urethra, fully covering your ' + Descriptors.cockDescript( 0 ) + '. "<i>All done,</i>" her voice cheerful and innocent, like she\'d just finished painting a picture rather than stimulating you just shy of breaking your mind.\n\n', false );
		EngineCore.outputText( 'The pixie girl gives your shaft a little kiss and places her lips on your cockhead. She puffs her cheeks and whispers a string of strange words into your ' + Descriptors.cockDescript( 0 ) + '. All at once, the soft petals around you meld into one warm, hard case, perfectly mirroring your cock like an organic condom. Your mind explodes as your carefully coaxed orgasm is finally released in one body-shaking crescendo. Every muscle in your body clenches, your cock geysering its torrential gouts of seed into the flower petal condom. Rather than bursting apart, the enchanted device merely swells, drinking your seed and slowly lifting off of your shaft. ', false );
		//[Balls- ;
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( 'Vala\'s tongue caresses your ' + Descriptors.ballsDescriptLight() + ', slurping hungrily, eager to get every drop out of your overburdened sac.  ', false );
		}
		EngineCore.outputText( 'You nearly forget to breathe as jizz pours from your body until the dick-shaped shell is entirely forced from your body. Deftly, Vala catches the device before it can spill its load and she pastes her own, much larger, petal on the base, sealing your spunk inside. The verdant shaft, now that it\'s off your cock, seems to be a dildo perfectly molded to resemble your ' + Descriptors.cockDescript( 0 ) + '. It\'s a soft pink color, like engorged genitals, and even gently pulses with your every heartbeat.', false );
		//(Extremely high cum production: ;
		if( CoC.getInstance().player.cumQ() > 2000 ) {
			EngineCore.outputText( '  Even after driving the condom off of you, your cock continues its gushing orgasm, spurting thick bubbles of jizz into the air, raining down in creamy torrents. The small fairies gleefully dive after the cum globs, making a game of it, trying to catch the gooey globs before they splatter on the bed or carpet.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( '"<i>You see?</i>" Vala asks, holding the organic device aloft with a mischievous smile. "<i>They don\'t last forever, but while they do, these little toys give us a very intimate connection to loved ones. This way, I can go all week with a reminder of you inside me.</i>" She gives you a kiss on the lips and the fairies give you a tiny chorus of applause for the entertaining show. It\'s good that her little friends aren\'t around more often, you pant to yourself, or you\'d be a drooling vegetable in no time.\n\n', false );
		EventParser.cheatTime( 1 );
		CoC.getInstance().player.orgasm();
		EngineCore.doNext( CoC.getInstance().scenes.telAdre.barTelAdre );
	};
	//[Female];
	Dungeon2Supplimental.prototype.faerieOrgyFuckFemaleContinue = function() {
		EngineCore.spriteSelect( 60 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'The fairy girl lands at the edge of the bed, settling on her knees and resting her weighty chest on the mattress. Leaning in, she spreads your ' + CoC.getInstance().player.legs() + ' with warm, delicate hands, fingertips stroking the insides of your thighs. You shiver and hug your arms under your breasts, a little nervous about this \'forest magic.\' One of the fairies flutters down to Vala and hands her a pale white lily petal with a tittering giggle. The larger fairy takes the soft white bloom and, whispering a silken word to it, licks the cream-colored surface. Slithering further between your legs, she reaches your ' + Descriptors.vaginaDescript( 0 ) + ' and brushes the petal against your ' + Descriptors.clitDescript() + ' with a teasing caress. Then, much to your surprise, she places it on the tip of her forefinger and slides it into your pussy. You gasp, the petal\'s soft surface rubbing your inner walls with a warmth you were unprepared for. Vala presses lightly on a spot inside your vagina and you lose your breath as the tremor of a small orgasm rumbles through your gut. Without explanation, the fairy barmaid takes a rose petal and repeats the process, another orgasm seizing you and leaving you panting. "<i>Normally we only need the one petal, but since you and I are so much larger than the average fairy, I had my sisters bring lots. All for you,</i>" she whispers, coyly.\n\n', false );
		//[If the Player has unlocked Scylla's Addiction Counseling event] ;
		if( CoC.getInstance().flags[ kFLAGS.TIMES_SCYLLA_ADDICT_GROUP_EXPLOITED ] + CoC.getInstance().flags[ kFLAGS.SCYLLA_TIMES_SHARED_IN_ADDICT_GROUP ] + CoC.getInstance().flags[ kFLAGS.SCYLLA_MILK_THERAPY_TIMES ] + CoC.getInstance().flags[ kFLAGS.SCYLLA_CUM_THERAPY_TIMES ] + CoC.getInstance().flags[ kFLAGS.SCYLLA_SEX_THERAPY_TIMES ] > 0 ) {
			EngineCore.outputText( 'Another fairy flies toward Vala and you blink through the building lusty haze when you recognize the little girl. Wearing a slightly slutty crystalline gown of translucent gossamer, you recognize Pastie, the fairy from Scylla\'s addiction counseling meeting. When you call out to her, she bashfully waves back. "<i>Hey, uh, ' + CoC.getInstance().player.short + '. It\'s kinda weird seeing you outside of the meetings. How are you? How have things been?</i>" She looks at your naked, reclined form on the bed and blushes. "<i>Oh, right, right. Um. I\'m just helping out Vala, you know. Sisters and all. Uh. I\'m... I\'m going to just give her this petal and get something to drink, okay? All this sobriety is making this really uncomfortable for me.</i>" The other fairies laugh and Pastie hands off her blossom before zipping out of the room, probably to steal someone\'s drink downstairs.\n\n', false );
		}

		EngineCore.outputText( 'One by one, each of the fairies gives her petal to Vala and one by one, the largest fairy delicately places them inside your ' + Descriptors.vaginaDescript( 0 ) + '. With each bloom that touches your inner walls, another orgasm tears your self-restraint to shreds, until you\'re drooling onto the bedsheets, tongue lolling out of your mouth, your eyes rolling aimlessly, unable to focus on any one thing for longer than a moment. Your fingers clench the bedspread in white-knuckled bliss and your thighs vibrate around the girl\'s body, squeezing her like you\'re trying to stay on an unsaddled horse. Just as your vision is about to roll into a pink oblivion, Vala withdraws her fingers from your recesses and announces, "<i>All done,</i>" her voice cheerful and innocent, like she\'d just finished painting a picture rather than stimulating you just shy of breaking your mind. You need more than a few minutes to catch your breath, finally coming down from the seeming eternity of rapturous bliss.\n\n', false );
		EngineCore.outputText( 'When you finally calm down enough to swallow your spittle, wipe the slick sweat from your face and body, and release the fairy girl from the death-grip between your ' + Descriptors.hipDescript() + ', you try to ask what happened to the petals inside your body. The fae girl gives your ' + Descriptors.clitDescript() + ' a little kiss and places her lips on your pussy. She puffs her cheeks and whispers a string of strange words into your quivering cunt. All at once, the soft petals inside you meld into one warm, hard shape, perfectly mirroring your pussy, labia to cervix. Very carefully, Vala draws the verdant shaft from your body and produces the most intricately ridged, molded dildo that you\'ve ever seen. It\'s a soft pink color, matching your engorged genitals, and even gently pulses with your every heartbeat.\n\n', false );
		EngineCore.outputText( '"<i>You see?</i>" Vala asks, holding the organic device aloft with a mischievous smile. "<i>They don\'t last forever, but while they do, these little toys give us a very intimate connection to loved ones. This way, I can go about all week with a reminder of you inside me.</i>" She gives you a kiss on the lips and the fairies give you a tiny chorus of applause for the entertaining show. It\'s good that her little friends aren\'t around more often, you gasp to yourself, or you\'d be a drooling vegetable in no time.', false );
		EventParser.cheatTime( 1 );
		CoC.getInstance().player.orgasm();
		EngineCore.doNext( CoC.getInstance().scenes.telAdre.barTelAdre );
	};
	Dungeon2Supplimental.prototype.takeBondageStraps = function() {
		EngineCore.clearOutput();
		CoC.getInstance().flags[ kFLAGS.ZETAZ_LAIR_TOOK_BONDAGE_STRAPS ]++;
		CoC.getInstance().inventory.takeItem( ArmorLib.BONSTRP, EventParser.playerMenu );
	};
	//ZETAZ START;
	Dungeon2Supplimental.prototype.zetazTaunt = function() {
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.round ) < 0 ) {
			CoC.getInstance().monster.createStatusAffect( StatusAffects.round, 1, 0, 0, 0 );
			EngineCore.outputText( 'Zetaz asks, "<i>Do you even realize how badly you fucked up my life, ', false );
			if( CoC.getInstance().player.humanScore() >= 4 ) {
				EngineCore.outputText( 'human', false );
			} else {
				EngineCore.outputText( '\'human\'', false );
			}
			EngineCore.outputText( '?  No, of course not.  That\'s the kind of attitude I\'d expect from one of you!</i>"', false );
		} else {
			CoC.getInstance().monster.addStatusValue( StatusAffects.round, 1, 1 );
			if( CoC.getInstance().monster.statusAffectv1( StatusAffects.round ) === 2 ) {
				EngineCore.outputText( '"<i>I lost my post!  And when you screwed up the factory?  I barely escaped with my life!  You ruined EVERYTHING!</i>" screams Zetaz.', false );
			} else if( CoC.getInstance().monster.statusAffectv1( StatusAffects.round ) === 3 ) {
				EngineCore.outputText( 'Zetaz snarls, "<i>Do you know how hard it is to hide from Lethice?  DO YOU HAVE ANY IDEA!?  I\'ve had to live in this fetid excuse for a jungle, and just when I found some friends and made it livable, you show up and DESTROY EVERYTHING!</i>"', false );
			} else if( CoC.getInstance().monster.statusAffectv1( StatusAffects.round ) === 4 ) {
				EngineCore.outputText( 'Zetaz explains, "<i>I won\'t let you go.  I\'m going to break you.</i>"', false );
			} else if( CoC.getInstance().monster.statusAffectv1( StatusAffects.round ) === 5 ) {
				EngineCore.outputText( '"<i>Would it have been that bad to go along with me?  You\'ve seen the factory.  We would\'ve kept you fed, warm, and provided you with limitless pleasure.  You would\'ve tasted heaven and served a greater purpose.  It\'s not too late.  If you come willingly I can make sure they find a good machine to milk you with,</i>" offers the imp lord.', false );
			} else if( CoC.getInstance().monster.statusAffectv1( StatusAffects.round ) === 6 ) {
				EngineCore.outputText( '"<i>Why won\'t you fall?</i>" questions Zetaz incredulously.', false );
			} else if( CoC.getInstance().monster.statusAffectv1( StatusAffects.round ) === 7 ) {
				EngineCore.outputText( 'The imp lord suggests, "<i>If you give up and let me fuck your ass maybe I\'ll let you go.</i>"', false );
			} else if( CoC.getInstance().monster.statusAffectv1( StatusAffects.round ) === 8 ) {
				EngineCore.outputText( 'Zetaz pants, "<i>Just give up!  I\'m nothing like the weakling you met so long ago!  I\'ve been through hell to get here and I\'m not giving it up just because you\'ve shown up to destroy my hard work!</i>"', false );
			} else {
				EngineCore.outputText( 'He glares at you silently.', false );
			}
		}
	};
	//ZETAZ AI:;
	Dungeon2Supplimental.prototype.zetazAI = function() {
		//Zetaz taunts.;
		this.zetazTaunt();
		EngineCore.outputText( '\n\n', false );
		//If afflicted by blind or whispered and over 50% lust,;
		//burns lust and clears statuses before continuing with ;
		//turn.;
		if( CoC.getInstance().monster.lust > 50 && (CoC.getInstance().monster.findStatusAffect( StatusAffects.Fear ) >= 0 || CoC.getInstance().monster.findStatusAffect( StatusAffects.Blind ) >= 0) ) {
			CoC.getInstance().monster.removeStatusAffect( StatusAffects.Fear );
			CoC.getInstance().monster.removeStatusAffect( StatusAffects.Blind );
			CoC.getInstance().monster.lust -= 10;
			EngineCore.outputText( 'Zetaz blinks and shakes his head while stroking himself.  After a second his turgid member loses some of its rigidity, but his gaze has become clear.  He\'s somehow consumed some of his lust to clear away your magic!', false );
		}
		//STANDARD COMBAT STATUS AFFECTS HERE;
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.Stunned ) >= 0 ) {
			EngineCore.outputText( 'Your foe is too dazed from your last hit to strike back!', false );
			CoC.getInstance().monster.removeStatusAffect( StatusAffects.Stunned );
			Combat.combatRoundOver();
			return;
		}
		//Exgartuan gets to do stuff!;
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.Exgartuan ) >= 0 && CoC.getInstance().player.statusAffectv2( StatusAffects.Exgartuan ) === 0 && Utils.rand( 3 ) === 0 ) {
			CoC.getInstance().exgartuan.exgartuanCombatUpdate();
			EngineCore.outputText( '\n\n', false );
		}
		if( CoC.getInstance().monster.findStatusAffect( StatusAffects.Constricted ) >= 0 ) {
			//Enemy struggles - ;
			EngineCore.outputText( 'Your prey pushes at your tail, twisting and writhing in an effort to escape from your tail\'s tight bonds.', false );
			if( CoC.getInstance().monster.statusAffectv1( StatusAffects.Constricted ) <= 0 ) {
				EngineCore.outputText( '  ' + CoC.getInstance().monster.getCapitalA() + CoC.getInstance().monster.short + ' proves to be too much for your tail to handle, breaking free of your tightly bound coils.', false );
				CoC.getInstance().monster.removeStatusAffect( StatusAffects.Constricted );
			}
			CoC.getInstance().monster.addStatusValue( StatusAffects.Constricted, 1, -1 );
			Combat.combatRoundOver();
			return;
		}
		//STANDARD COMBAT STATUS AFFECTS END HERE;
		//-If over 50 lust and below 50% hp;
		//--burns 20 lust to restore 20% hp. ;
		if( CoC.getInstance().monster.lust > 50 && CoC.getInstance().monster.HPRatio() <= 0.5 ) {
			EngineCore.outputText( 'The imp lord shudders from his wounds and the pulsing member that\'s risen from under his tattered loincloth.  He strokes it and murmurs under his breath for a few moments.  You\'re so busy watching the spectacle of his masturbation that you nearly miss the sight of his bruises and wounds closing!  Zetaz releases his swollen member, and it deflates slightly.  He\'s used some kind of black magic to convert some of his lust into health!', false );
			CoC.getInstance().monster.addHP( 0.25 * CoC.getInstance().monster.eMaxHP() );
			CoC.getInstance().monster.lust -= 20;
			EngineCore.dynStats( 'lus', 2 );
		} else {
			var attackChoice = Utils.rand( 3 );
			if( attackChoice === 0 ) {
				//Chucks faux-heat draft ala goblins. - ;
				EngineCore.outputText( 'Zetaz grabs a bottle from a drawer and hurls it in your direction!  ', false );
				if( (CoC.getInstance().player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 4 ) === 0) ||
					(CoC.getInstance().player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 6 ) === 0) ||
					(CoC.getInstance().player.spe > 65 && Utils.rand( 10 ) === 0) ||
					(CoC.getInstance().player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 20 && CoC.getInstance().player.armorName === 'red, high-society bodysuit') ) {
					EngineCore.outputText( 'You sidestep it a moment before it shatters on the wall, soaking the tapestries with red fluid!', false );
				} else {
					EngineCore.outputText( 'You try to avoid it, but the fragile glass shatters against you, coating you in sticky red liquid.  It seeps into your ' + CoC.getInstance().player.skinDesc + ' and leaves a pleasant, residual tingle in its wake.  Oh no...', false );
					//[Applies: 'Temporary Heat' status];
					if( CoC.getInstance().player.findStatusAffect( StatusAffects.TemporaryHeat ) < 0 ) {
						CoC.getInstance().player.createStatusAffect( StatusAffects.TemporaryHeat, 0, 0, 0, 0 );
					}
				}
			} else if( attackChoice === 1 ) {
				//'Gust' – channels a pidgy's spirit to beat ;
				//his wings and kick up dust, blinding the PC ;
				//next turn and dealing light damage. - ;
				EngineCore.outputText( 'The imp leaps into the air with a powerful spring, beating his wings hard to suspend himself in the center of his bedchamber.  Dust kicks up into the air from the force of his flight and turns the room into a blinding tornado!  Small objects smack off of you, ', false );
				//(causing little damage/;
				if( CoC.getInstance().player.tou > 60 ) {
					EngineCore.outputText( 'causing little damage', false );
				} else {
					var dmg = 1 + Utils.rand( 6 );
					dmg = CoC.getInstance().player.takeDamage( dmg );
					EngineCore.outputText( 'wounding you slightly (' + dmg + ')', false );
				}
				EngineCore.outputText( ' while the dust gets into your eyes, temporarily blinding you!', false );
				CoC.getInstance().player.createStatusAffect( StatusAffects.Blind, 1, 0, 0, 0 );
			}
			//Gigarouse – A stronger version of normal imp's ;
			//'arouse' spell. - copy normal arouse text and ;
			//spice it up with extra wetness!;
			else {
				this.gigaArouse();
			}
		}
		Combat.combatRoundOver();
	};
	Dungeon2Supplimental.prototype.gigaArouse = function() {
		EngineCore.outputText( 'You see ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + ' make familiar arcane gestures at you, but his motions seem a lot more over the top than you\'d expect from an imp.\n\n', false );
		EngineCore.dynStats( 'lus', Utils.rand( CoC.getInstance().player.lib / 10 ) + CoC.getInstance().player.cor / 10 + 15 );
		if( CoC.getInstance().player.lust < 30 ) {
			EngineCore.outputText( 'Your nethers pulse with pleasant warmth that brings to mind pleasant sexual memories.  ', false );
		}
		if( CoC.getInstance().player.lust >= 30 && CoC.getInstance().player.lust < 60 ) {
			EngineCore.outputText( 'Blood rushes to your groin in a rush as your body is hit by a tidal-wave of arousal.  ', false );
		}
		if( CoC.getInstance().player.lust >= 60 ) {
			EngineCore.outputText( 'Your mouth begins to drool as you close your eyes and imagine yourself sucking off Zetaz, then riding him, letting him sate his desires in your inviting flesh.  The unnatural visions send pulses of lust through you so strongly that your body shivers.  ', false );
		}
		if( CoC.getInstance().player.cocks.length > 0 ) {
			if( CoC.getInstance().player.lust >= 60 && CoC.getInstance().player.cocks.length > 0 ) {
				EngineCore.outputText( 'You feel ' + CoC.getInstance().player.sMultiCockDesc() + ' dribble pre-cum, bouncing with each beat of your heart and aching to be touched.  ', false );
			}
			if( CoC.getInstance().player.lust >= 30 && CoC.getInstance().player.lust < 60 && CoC.getInstance().player.cocks.length === 1 ) {
				EngineCore.outputText( CoC.getInstance().player.SMultiCockDesc() + ' hardens and twitches, distracting you further.  ', false );
			}
		}
		if( CoC.getInstance().player.vaginas.length > 0 ) {
			if( CoC.getInstance().player.lust >= 60 && CoC.getInstance().player.vaginas[ 0 ].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_NORMAL && CoC.getInstance().player.vaginas.length === 1 ) {
				EngineCore.outputText( 'Your ' + Descriptors.allVaginaDescript() + ' dampens perceptibly, feeling very empty.  ', false );
			}
			if( CoC.getInstance().player.lust >= 60 && CoC.getInstance().player.vaginas[ 0 ].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_WET && CoC.getInstance().player.vaginas.length > 0 ) {
				EngineCore.outputText( 'Your crotch becomes sticky with girl-lust, making it clear to ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + ' just how welcome your body finds the spell.  ', false );
			}
			if( CoC.getInstance().player.lust >= 60 && CoC.getInstance().player.vaginas[ 0 ].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_SLICK && CoC.getInstance().player.vaginas.length === 1 ) {
				EngineCore.outputText( 'Your ' + Descriptors.allVaginaDescript() + ' becomes sloppy and wet, dribbling with desire to be mounted and fucked.  ', false );
			}
			if( CoC.getInstance().player.lust >= 60 && CoC.getInstance().player.vaginas[ 0 ].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_DROOLING && CoC.getInstance().player.vaginas.length > 0 ) {
				EngineCore.outputText( 'Thick runners of girl-lube stream down the insides of your thighs as your crotch gives into the demonic magics.  You wonder what ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + '\'s cock would feel like inside you?  ', false );
			}
			if( CoC.getInstance().player.lust >= 60 && CoC.getInstance().player.vaginas[ 0 ].vaginalWetness === AppearanceDefs.VAGINA_WETNESS_SLAVERING && CoC.getInstance().player.vaginas.length === 1 ) {
				EngineCore.outputText( 'Your ' + Descriptors.allVaginaDescript() + ' instantly soaks your groin with the heady proof of your need.  You wonder just how slippery you could ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + '\'s dick when it\'s rammed inside you?  ', false );
			}
		}
		if( CoC.getInstance().player.lust >= 100 ) {
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			EngineCore.doNext( EventParser.playerMenu );
		}
	};

	Dungeon2Supplimental.prototype.defeatZetaz = function() {
		CoC.getInstance().flags[ kFLAGS.DEFEATED_ZETAZ ]++;
		EngineCore.outputText( '', true );
		//[VICTORY HP];
		if( CoC.getInstance().monster.HP < 1 ) {
			EngineCore.outputText( 'Zetaz sinks down on his knees, too wounded to continue.  He looks up at you with helpless rage in his eyes and asks, "<i>Are you satisfied now?  Go ahead then, kill me.  My life hasn\'t been worth living since I met you anyway.</i>"\n\n', false );
		}
		//[VICTORY LUST] ;
		else {
			EngineCore.outputText( 'Zetaz sinks down on his knees and fishes his massive, pre-drooling member from under his loincloth.  He looks up at you, nearly crying and moans, "<i>Why? Ruining my life wasn\'t enough?  You had to make me jerk off at your feet too?  Just kill me, I don\'t want to live anymore.</i>"\n\n', false );
		}

		//[Both] ;
		EngineCore.outputText( 'He can\'t die yet.  You need to know where his master, this \'Lethice\', is.  It sounds like she\'s the queen-bitch of the demons, and if you\'re going to break this vicious cycle', false );
		//( or take her place);
		if( CoC.getInstance().player.cor > 66 ) {
			EngineCore.outputText( ' or take her place', false );
		}
		EngineCore.outputText( ', you need to find her and bring her down.  What do you do?', false );
		EngineCore.outputText( '\n\n(Sexually Interrogate, Kill Him, or Offer Safety for Information?)\n', false );
		//[Sexual Interrogation] [Brutal Interrogation] [Release for Info];
		EngineCore.choices( 'Sexual', this.sexualInterrogation, 'End Him', this.endZetaz, 'Safety', this.releaseZForInfo, '', null, '', null );
	};
	//[Release Zetaz 4 Info Win];
	Dungeon2Supplimental.prototype.releaseZForInfo = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You look the pathetic imp up and down and smirk.  He closes his eyes, expecting a summary execution, but you present him with an offer instead.  If he gives you more information on Lethice and where to find her, you\'ll let him go scot-free and avoid him if he doesn\'t make a nuisance of himself.\n\n', false );
		EngineCore.outputText( '"<i>Really?</i>" questions Zetaz in a voice laced with suspicion. "<i>For fuck\'s sake, I\'m already a renegade.  I\'ll take your deal.  It\'s not like it costs me anything I wouldn\'t give away for free anyway.</i>"\n\n', false );
		EngineCore.outputText( 'Invigorated by the promise of safety and freedom, Zetaz pulls himself up and ', false );
		if( CoC.getInstance().monster.HP < 1 ) {
			EngineCore.outputText( 'staggers', false );
		} else {
			EngineCore.outputText( 'nearly stumbles over his lust-filled cock', false );
		}
		EngineCore.outputText( ' towards a desk.  His dextrous fingers twist the knob on the top drawer expertly until a quiet \'click\' comes from the furniture.  He reaches down to the divider between the drawers and pulls on it, revealing a tiny, hidden compartment.  In the center of it is a detailed map of the mountain and its upper reaches.  Though the secret diagram is quite crude, it depicts a winding trail that bypasses numerous harpy nests, minotaur caves, and various unrecognizable pitfalls to reach the cloud-shrouded mountain peak.  The drawing loses much of its detail once it gets to the demon fortifications at the top, but it can\'t be that hard to track down Lethice once you\'ve entered the seat of her power, can it?\n\n', false );
		EngineCore.outputText( 'A loincloth flies across the room and deposits itself on your shoulder, startling you from your planning.  You glance back and see Zetaz tearing through his possessions, tossing his most prized items into a burlap sack with reckless abandon.  His whole body is trembling, as he ties it to a wooden pole, never once looking up at you.  Perhaps he fears you might change your mind?  ', false );
		if( CoC.getInstance().player.cor > 66 ) {
			EngineCore.outputText( 'You smirk down at him and fold your arms over your ', false );
			if( CoC.getInstance().player.biggestTitSize() < 1 ) {
				EngineCore.outputText( 'chest', false );
			} else {
				EngineCore.outputText( Descriptors.breastDescript( 0 ), false );
			}
			EngineCore.outputText( ', relishing his fear while you consider the possibilities', false );
		} else if( CoC.getInstance().player.cor > 33 ) {
			EngineCore.outputText( 'You chuckle with amusement and watch the little bastard scrabble to pack up his life, relishing the chance to pay him back for your previous encounter', false );
		} else {
			EngineCore.outputText( 'You sigh and rub at your temples as the little jerk scrabbles to pack his life away.  In spite of yourself, you actually feel a little bad about the situation', false );
		}
		EngineCore.outputText( '.  Zetaz scrambles out the south door, never once looking back at the tattered remnants of his old home.', false );
		EngineCore.outputText( '\n\n<b>(Key Item Acquired: Zetaz\'s Map!)</b>', false );
		CoC.getInstance().player.createKeyItem( 'Zetaz\'s Map', 0, 0, 0, 0 );
		Combat.cleanupAfterCombat();
	};
	//[Sexual Interrogation];
	Dungeon2Supplimental.prototype.sexualInterrogation = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You lean down until your face hovers over Zetaz, looking him square in the eyes, and explain, "<i>I can\'t have someone who knows the way to the demons\' headquarters dying before they tell me how to get there, can I?</i>"\n\n', false );
		EngineCore.outputText( '"<i>Piss off!  You won\'t get shit from me,</i>" retorts the defeated demon, "<i>You may as well finish me off – I\'ll NEVER help a ' + CoC.getInstance().player.mf( 'jackass', 'bitch' ) + ' like you!</i>"\n\n', false );
		EngineCore.outputText( 'Smirking, you grab a strip of leather from Zetaz\'s dresser and dangle it over his nose.\n\n', false );
		EngineCore.outputText( 'You whisper, "<i>This is all I\'ll need.</i>"\n\n', false );
		EngineCore.outputText( 'The imp looks up with his face shrouded in confusion as he asks, "<i>I don\'t think a string is going to help you much, ' + CoC.getInstance().player.mf( 'dork', 'skank' ) + '.</i>"\n\n', false );
		EngineCore.outputText( '"<i>Give me a moment, my stupid little snitch,</i>" you taunt as you lift his loincloth, exposing the hardness concealed within.  It pulses, growing harder and an inch longer just from your brief touch and exposure to the air.  Perhaps the imp isn\'t as in control of his libido as he\'d like you to think?  You twirl the leather strip around his base and swiftly knot it, getting a tight enough seal to make Zetaz grunt in discomfort. "<i>Ungh! What the fuck!? Ow, goddamnit!</i>"\n\n', false );
		EngineCore.outputText( 'Even with his protests and cries, you watch his cock inflate further, until it looks stuffed far beyond his normal capacity.  It twitches and drools corrupted pre-seed as you slide your finger along his urethra, watching the member bob and twitch from the slight, soft touches.  That must feel quite good.  Zetaz confirms your hunch by lifting his hips off the ground, shaking them lewdly to try to grind against your hand.  You don\'t deny him the friction he craves, wrapping your hand around as much of his meat as your fingers will encircle until steady dribbles of fluid escape from his urethra.  The tainted nodules of his demonic dick begin to flare and pulse, signaling that his orgasm is almost upon him.\n\n', false );
		EngineCore.outputText( 'He\'s NOT allowed to cum – not until you get the information you need!   You slide your fingers down to his base in one fluid stroke, slamming your hand against his crotch as his orgasm starts to bubble up.  Before your opponent can attain release, you squeeze hard with one hand and tighten the leather cord with the other, clamping the base until the imp\'s cum is bottled up in his abdomen.  Zetaz cries, "<i>No-no-no, let me cum, please let me cum, need-ta-cum-nooowwww.</i>"\n\n', false );
		EngineCore.outputText( 'No such luck.  You wait for his body to stop convulsing and return to your task, one hand sealed around his base while the other begins to stroke him with firm, steady motions, sliding over the pebbly surface of his dick\'s nubs.  Your victim continues his begging and crying, but you don\'t let up as you pause to gather his escaped pre-cum and smear it over his tip.  Zetaz pants and groans, trembling and swelling in your hand from your efficient hand-job.   Spitting on your palm, you bump up the tempo and begin to stroke him hard and fast, sliding over his cockring-swollen prick with practiced, deliberate motions.\n\n', false );
		EngineCore.outputText( '"<i>Tell me how to find the head demon and I\'ll let you cum.  Don\'t make this any \'harder\' than it has to be,</i>" you whisper.\n\n', false );
		EngineCore.outputText( 'The demon\'s voice starts to crack in spite of his efforts to remain defiant. "<i>No!  I-uh-won\'t let yo-oooooh-control meeeeee!</i>"\n\n', false );
		EngineCore.outputText( 'His protests trail into incoherent squeals and babbles as you bottle up his second orgasm behind the tightly tied strap.  Again, his body twists and writhes in your grip, tortured with the ever-increasing sexual tension.  Zetaz looks up at you with a pleading, cross-eyed expression as he tries to regain his wits, but you just keep pumping away.  His balls are visibly pulsing and quivering, desperately needing to release the building pressure.  You meet his gaze calmly, your hands continuing their work on the bloated imp-cock, and you break into a knowing smile as he thickens in your grip for the third time.\n\n', false );
		EngineCore.outputText( '"<i>Well Zetaz?  Is three the lucky number, or do I have to switch hands and keep backing you up until you go mad?</i>" you ask.\n\n', false );
		EngineCore.outputText( 'His hands claw the rug underneath him as he gasps, "<i>You win, you win!  The desk has a-ah ah ahh-hidden drawer with a map to Lethice\'s hideout.  Please justletmecomeletmecomeletmecomePLEAAAAASE!</i>"\n\n', false );
		EngineCore.outputText( 'What do you do?', false );
		//['Release' him] [Tighten Strap] [End Him];
		EngineCore.choices( '\'Release\'', this.sexualTortureReleaseZetaz, 'Tighten', this.sexualTortureTightenZetaz, 'End Him', this.endZetaz, '', null, '', null );
	};
	//[Release Him];
	Dungeon2Supplimental.prototype.sexualTortureReleaseZetaz = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'In a moment of kindness', false );
		if( CoC.getInstance().player.lust > 60 || CoC.getInstance().player.lib > 60 || CoC.getInstance().player.cor > 60 ) {
			EngineCore.outputText( ', or perhaps perversion,', false );
		}
		EngineCore.outputText( ' you release the taut cord and allow it to unravel.  It whips off Zetaz\'s prick at once, tossed across the chamber by the pressure boiling forth from the imp\'s shaking hips.   Nodules flare from his prick\'s base to his tip in a wavelike motion, nearly doubling in size by the time the \'wave\' reaches the ring around his crown.  Simultaneously, his urethra parts and unloads the imp\'s pent-up cargo with cannon-like force.  Sticky spoo rockets upwards, splatters against the ceiling, and hangs for a moment as the first \'jet\' glazes the roof.  The eruption slowly peters out, letting the last of the rope fall over Zetaz\'s form.\n\n', false );
		EngineCore.outputText( 'You marvel at the force as you feel the next bulge moving up that demon-dick, squeezing past your gently caressing fingertips.  The next burst doesn\'t surface with the explosive force of its precursor, but what it lacks in speed, it makes up for in raw volume.  Zetaz\'s body arches and twitches with the effort of trying to push out three orgasms worth of backed-up demon jizz, and easily launches a missile-like globule onto his bed, where it splatters to great effect.  The third spout of white lacks the thrust and mass of it\'s predecessors, but easily puts out more love juice than most people\'s entire orgasm.  With a knowing smile on your face, you stroke out the remainder of his seed, keeping count of each rope as it\'s fired – four, five, six, seven, eight, nine, ten... eleven.\n\n', false );
		EngineCore.outputText( 'The imp has managed to soak his body, his nightstand, the bed, one of the walls, and even the ceiling, but all that pleasure came at a cost.  Zetaz\'s eyes have closed – the little guy passed out.  Smirking, you wipe your hand off in his hair and head over to the desk.  Somehow it managed to avoid the great spoogey deluge, and it almost seems to be standing aloof from the depraved scene that\'s devoured the rest of the room.  It has two visible drawers with a divider between them, but at a glance there doesn\'t seem to be enough room in the furniture to contain a hidden drawer or compartment.\n\n', false );
		EngineCore.outputText( 'You poke and prod around the desk\'s circumference, checking for false panels, weak points, or hidden latches inside the woodwork.  It refuses to give up its secrets, and you find yourself wondering for a moment if it\'s somehow capable of such deception before you dismiss the notion as insane.  For all this place\'s craziness, you doubt Zetaz would have a piece of possessed furniture in his bedroom.  Irritated, you yank open each drawer, but nothing seems out of the ordinary.  You grumble and slam them closed, twisting on the knobs with accidental fury.  A barely audible \'click\' reaches your ears, and the divider between the drawers now protrudes ever so slightly forward, far enough to get a good grip on.\n\n', false );
		EngineCore.outputText( 'The unfinished wood behind the divider\'s facade chafes your fingertips as you gently pull on it, revealing a narrow, hidden compartment.  The only object inside is a detailed map of the mountain and its upper reaches.  Though the secret diagram is quite crude, it depicts a winding trail that bypasses numerous harpy nests, minotaur caves, and various unrecognizable pitfalls to reach the cloud-shrouded mountain peak.  The drawing loses much of its detail once it gets to the demon fortifications at the top, but it can\'t be that hard to track down Lethice once you\'ve entered the seat of her power, can it?\n\n', false );
		EngineCore.outputText( 'You hear the faint scrabble of claws on stone and turn around, alarmed, but there\'s nothing there.  Not even Zetaz.  You imagine the cum-slicked imp sprinting from his own cave and into the deep woods, and the absurd image brings a smile to your face.\n\n', false );
		EngineCore.outputText( '<b>(Key Item Acquired: Zetaz\'s Map!)</b>', false );
		CoC.getInstance().player.createKeyItem( 'Zetaz\'s Map', 0, 0, 0, 0 );
		Combat.cleanupAfterCombat();
	};
	//[Tighten Strap] ;
	Dungeon2Supplimental.prototype.sexualTortureTightenZetaz = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( '"<i>Idiot,</i>" you taunt while you tighten the strap further.  Zetaz actually starts to bawl in anguish while another orgasm worth of cum backs up inside him.  You don\'t want him to get out of the binding while you search for his map, so you pull the cord under his leg and use the free end to bind his wrists together behind his back.  Fondling his turgid prick one last time for good luck, you leave him to struggle with his need as you search for your map.  It\'s difficult to blank out all the whines and cries, but you manage.\n\n', false );
		EngineCore.outputText( 'Zetaz\'s desk sits against a wall, just far enough away from the rest of the furniture to give it an aloof appearance.  You get up and walk closer, kicking the imp in the belly on your way in order to get a little peace and quiet.  The desk has two visible drawers with a divider between them, but at a glance there doesn\'t seem to be enough room in the furniture to contain a hidden drawer or compartment. It will take a more careful examination to uncover this \'map\'.\n\n', false );
		EngineCore.outputText( 'You poke and prod around the desk\'s circumference, checking for false panels, weak points, or hidden latches inside the woodwork.  It refuses to give up its secrets, and you find yourself wondering for a moment if it\'s somehow capable of such deception before you dismiss the notion as insane.  For all this place\'s craziness, you doubt Zetaz would have a piece of possessed furniture in his bedroom.  Irritated, you yank open each drawer, but nothing seems out of the ordinary.  You grumble and slam them closed, twisting on the knobs with accidental fury.  A barely audible \'click\' reaches your ears, and the divider between the drawers now protrudes ever so slightly forward, far enough to get a good grip on.\n\n', false );
		EngineCore.outputText( 'The unfinished wood behind the divider\'s facade grates your fingertips as you gently pull on it, revealing a narrow, hidden compartment.  The only object inside is a detailed map of the mountain and its upper reaches.  Though the secret diagram is quite crude, it depicts a winding trail that bypasses numerous harpy nests, minotaur caves, and various unrecognizable pitfalls to reach the cloud-shrouded mountain peak.  The drawing loses much of its detail once it gets to the demon fortifications at the top, but it can\'t be that hard to track down Lethice once you\'ve entered the seat of her power, can it?\n\n', false );
		EngineCore.outputText( 'You hear the faint scrabble of claws on stone and turn around, alarmed, but there\'s nothing there.  Not even Zetaz.  You imagine the partly hog-tied imp sprinting from his own cave and into the deep woods, his bloated cock bobbing dangerously with every step, and the absurd image brings a smile to your face.\n\n', false );
		EngineCore.outputText( '<b>(Key Item Acquired: Zetaz\'s Map!)</b>', false );
		CoC.getInstance().player.createKeyItem( 'Zetaz\'s Map', 0, 0, 0, 0 );
		Combat.cleanupAfterCombat();
	};
	//[END HIM – Ew death!];
	Dungeon2Supplimental.prototype.endZetaz = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You grab his head in both hands and twist violently, popping his neck in an instant.  Glaring down at the corpse of your first demonic foe, you utter, "<i>Wish granted.</i>"\n\n', false );
		EngineCore.outputText( 'With him dead, you\'ll have to see if there\'s anything here that could lead you to this \'Lethice\', so that you can put an end to the ridiculous plague affecting Mareth once and for all.  Perhaps you\'ll even get to go home, see your family, and have a rather violent talk with certain elders?  You tear through every drawer, pack, and chest in the place, but all you find are loincloths, extraordinairily fetishist porn, and junk.  Desperate for any clue, you even search under the bed and move the furniture, but it doesn\'t help.  You take your displeasure out on Zetaz\'s furnishings, slamming them into one another with all your might.\n\n', false );
		EngineCore.outputText( 'The chair in your hands disintegrates, the desk it impacts splinters apart, and you feel a little bit better.  A piece of parchment flutters back and forth in the middle of it all, freed from some hidden compartment and mostly unscathed.  One of the corners is ripped off, and it has a tear half way across, but it\'s still perfectly legible.  It\'s a map!  Though the secret diagram is quite crude, it depicts a winding trail that bypasses numerous harpy nests, minotaur caves, and various unrecognizable pitfalls to reach the cloud-shrouded mountain peak.  The drawing loses much of its detail once it gets to the demon fortifications at the top, but it can\'t be that hard to track down Lethice once you\'ve entered the seat of her power, can it?\n\n', false );
		EngineCore.outputText( '<b>(Key Item Acquired: Zetaz\'s Map!)</b>', false );
		CoC.getInstance().player.createKeyItem( 'Zetaz\'s Map', 0, 0, 0, 0 );
		//(ZETAZ IS DEAD);
		CoC.getInstance().flags[ kFLAGS.ZETAZ_DEFEATED_AND_KILLED ]++;
		Combat.cleanupAfterCombat();
	};
	//[Lose to Zetaz];
	Dungeon2Supplimental.prototype.loseToZetaz = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( '"<i>Well, isn\'t this familiar?</i>" asks Zetaz as he watches your ', false );
		if( CoC.getInstance().player.lust > 99 ) {
			EngineCore.outputText( 'masturbating', false );
		} else {
			EngineCore.outputText( 'prone', false );
		}
		EngineCore.outputText( ' form with an amused expression, "<i>The first champion in ages to retain ' + CoC.getInstance().player.mf( 'his', 'her' ) + ' free will for more than a few minutes, and ' + CoC.getInstance().player.mf( 'he', 'she' ) + '\'s brought to ' + CoC.getInstance().player.mf( 'his', 'her' ) + ' knees by the very imp ' + CoC.getInstance().player.mf( 'he', 'she' ) + ' escaped!  Once you\'ve learned your proper place, you\'ll guarantee my safe return to my rightful station.  Perhaps I\'ll even get a promotion?  After all, you\'ve defeated so many higher ranking demons already.</i>"\n\n', false );
		//'Fix' genderless folks.;
		if( CoC.getInstance().player.gender === 0 ) {
			EngineCore.outputText( 'He squints down at you with a bemused look and laughs, "<i>How did you lose your gender anyhow?  Never mind, we\'ve got to do something about that!</i>"\n\n', false );
			EngineCore.outputText( 'Zetaz grabs a bottle, uncorks it, and crams it against your lips while you\'re still too dazed to resist.  He massages your throat to make you swallow the milk-like fluid, and in seconds the skin of your groin splits to form a new, virgin pussy.\n\n', false );
			CoC.getInstance().player.createVagina();
			CoC.getInstance().player.gender = 2;
		}
		//(fork to male/female/herm);
		if( CoC.getInstance().player.gender === 1 ) {
			this.malesZetazOver();
		}
		if( CoC.getInstance().player.gender === 2 ) {
			this.femaleZetazOver();
		}
		if( CoC.getInstance().player.gender === 3 ) {
			this.hermZetazOver();
		}
	};
	Dungeon2Supplimental.prototype.femaleZetazOver = function() {
		//F-drugged up and tied to the table in the main room.  Cum in by all the imps till pregnant.  Daily fuckings with accompanying mind-fuck.;
		EngineCore.outputText( 'With your resistance ', false );
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'beaten out of you', false );
		} else {
			EngineCore.outputText( 'moistening the delta of your legs', false );
		}
		EngineCore.outputText( ', you don\'t even struggle as Zetaz calls in several friends.   You just lie there, meek and defeated as they carry you through the tunnels towards their dining room, but from the looks in the small demons\' eyes, they aren\'t planning to feed you... not with food, anyway.  The mob you defeated earlier seems to have returned, and gleeful hoots and catcalls ', false );
		if( CoC.getInstance().player.cor < 33 ) {
			EngineCore.outputText( 'shame', false );
		} else if( CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( 'confuse', false );
		} else {
			EngineCore.outputText( 'arouse', false );
		}
		EngineCore.outputText( ' you as you\'re thrown atop one of the tables.   You grunt as leather straps are produced and laid over your form to restrain you.  In the span of a minute you\'re completely immobilized from the neck down, and your ' + CoC.getInstance().player.legs() + ' are kept spread to allow easy access to your ' + Descriptors.vaginaDescript( 0 ) + '.\n\n', false );
		EngineCore.outputText( 'Shuffling as they remove their garments, the entire gang of imps, as well as Zetaz, are completely nude.  They\'ve all grown full and hard from the sight of your nubile, restrained body, and in spite of yourself you get ', false );
		if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness >= AppearanceDefs.VAGINA_WETNESS_DROOLING ) {
			EngineCore.outputText( 'even more wet ', false );
		} else {
			EngineCore.outputText( 'a little wet ', false );
		}
		EngineCore.outputText( 'from the masculine scent the aroused penises are producing.  ', false );
		if( CoC.getInstance().player.cor < 33 ) {
			EngineCore.outputText( 'How could you be turned on by such a repulsive situation?  You\'re going to be raped, brainwashed, and either kept as a pet or tossed in a milking tube for the rest of your life and your body is acting like some horny slut!', false );
		} else if( CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( 'You marvel at just how turned on you\'re getting from the strange situation.  You know you\'ll be raped, drugged, and used as a toy or milk cow, but your loins are thrumming with warm, wet desire.', false );
		} else {
			EngineCore.outputText( 'How did you wind up in such an arousing situation?  You\'re going to be raped, drugged, and probably milked in a factory for the rest of your life.  Your body is so fucking turned on that you know you\'ll love every second of it, but your desire to triumph and dominate mourns the loss of your freedom.', false );
		}
		EngineCore.outputText( '  The crowd draws close, but Zetaz\'s voice rings out, thick with the tone of command, "<i>Not yet, my brothers; this one will be mine first.  I\'ll claim each of her holes, then you may each have your fill of her.</i>"\n\n', false );
		EngineCore.outputText( 'The imps draw back, clearing a path for their leader to emerge, and the new, much more imposing Zetaz climbs atop the table.   He glances at your ' + Descriptors.vaginaDescript( 0 ) + ' with a knowing eye and smiles, walking further forward until he\'s standing next to your face with his tainted, corruption-filled cock dangling overhead.  You\'re so distracted by the purplish-black demon-cock swinging above your lips that the sharp pain takes you completely off-guard. As soon as the discomfort passes you twist your head around to try and find the source of your irritation.\n\n', false );
		EngineCore.outputText( 'Zetaz turns away from you, holding a spent needle in one of his clawed hands as he exchanges it with one of his kin for another injector, only this one is filled with viscous white fluid.  He glances down at you, watching you intently for some kind of reaction, but you won\'t give him the satisfaction!  Even so, the room is getting so bright that your eyes start tearing up, and you blink repeatedly to rid yourself of them before half-closing your eyelids to shield your poor pupils.  Maybe that\'s what he\'s looking for?  The room spins and you find yourself thankful to be strapped down; even if only seated, you would probably tumble from your chair.\n\n', false );
		EngineCore.outputText( 'Your lips start to tingle, and you run your tongue over them reflexively.  A shiver of pleasure worms through your body, and you instinctively press your ' + CoC.getInstance().player.legs() + ' against the straps in an effort to spread them further.  Worse yet, your lips feel much plumper and fuller than a few moments ago.  ', false );
		if( CoC.getInstance().flags[ kFLAGS.NUMBER_OF_TIMES_MET_SCYLLA ] > 0 ) {
			EngineCore.outputText( 'Unbidden, Scylla\'s face comes to mind, and you realize the drugs coursing through your veins must be doing something similar to you!  Her visage changes to your own, though the thick, cock-sucking lips remain behind, eager to be penetrated.', false );
		} else {
			EngineCore.outputText( 'Unbidden, you imagine yourself with thick, cock-sucking lips, so swollen and bloated that they\'re slightly pursed and ready to be penetrated.', false );
		}
		EngineCore.outputText( '  Warm slipperiness slides over your lips again, feeling nearly as good as it would on your lower lips, and you pull your rebellious tongue back into your mouth with a gasp of pleasure.\n\n', false );
		EngineCore.outputText( 'This must be what Zetaz was waiting for, and the imp carefully injects the next chemical cocktail into the other side of your neck while you\'re distracted by orally masturbating your new mouth.  Your ' + Descriptors.vaginaDescript( 0 ) + ' ', false );
		if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness >= AppearanceDefs.VAGINA_WETNESS_DROOLING ) {
			EngineCore.outputText( 'gushes fresh fluids into a puddle on the table', false );
		} else if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness >= AppearanceDefs.VAGINA_WETNESS_WET ) {
			EngineCore.outputText( 'drools a heavy flow of liquid arousal onto the hardwood table', false );
		} else {
			EngineCore.outputText( 'begins to dribble a steady flow of liquid on to the table\'s girl-slicked boards', false );
		}
		EngineCore.outputText( '.  ', false );
		if( CoC.getInstance().player.inHeat ) {
			EngineCore.outputText( 'D', false );
		} else {
			EngineCore.outputText( 'Foreign d', false );
		}
		EngineCore.outputText( 'esires wash through your doped up body, and your hungry slit practically demands to be filled with cock and injected with semen.  It wants to be filled with... with males, and with their hot, sticky cum. No, your hot little pussy doesn\'t want that – you do.  Gods above and below, you want to feel your belly pumped full of imp sperm until their offspring are wriggling in your womb.  And then you want them to come in you some more!\n\n', false );
		EngineCore.outputText( 'That sexy-0... no, that bastard\'s dick is so hard, and he\'s starting to squat down now that you\'re feeling so randy.  The artificial needs coursing through your body make it hard to resist, but you\'ve got to try!  You can\'t open your mouth and... mmm, it feels so good when those nubs touch your bee-stung lips.  Giving in isn\'t an option, even if you can\'t stop him from fucking your mouth, you aren\'t going to curl your tongue around his member and lick it, just like that, sliding it over his bumpy surface until corrupted pre is dripping onto your tongue. Yes, you won\'t let him out of your mouth until you can get his seed inside you, what are the other imps waiting for?  Your other hole is soooo hungry!\n\n', false );
		EngineCore.outputText( 'The mental incongruities in your thoughts are subsumed in a wave of hot, sticky fuck that\'s slowly rising over your thought processes with each lick and suck of Zetaz\'s thick, sexy dick.  He plunges down, stuffing your greedy gullet with the full length of his elephantine member and letting you know just how much he\'s enjoying your oral cum-hole.  You stick your tongue out to slurp at his desire-filled balls, swooning at the feeling of so much cock-flesh and slippery tongue sliding between your sensitive-as-a-pussy lips.  They twitch and pull tightly against his groin as he grabs your ' + Descriptors.hairDescript() + ' and hilts himself, allowing your lips to seal around his base as his urethra rhythmically bulges with orgasm.  A feeling of warm fullness grows in your gut with each pulse of cum, and you work your throat muscles to squeeze his tip of every last drop while you try to get off on the feelings coming from your mouth.\n\n', false );
		EngineCore.outputText( 'Once finished, the imp yanks himself up and pulls his orgasm-distended member from your lips with such force that it feels like each of his nubs is flicking your lips.  The orgy of oral pleasure sets off fireworks in your head strong enough to cross your eyes and make you babble incoherent \'thank-you\'s and moans.  You pant happily and lick the residue of Zetaz\'s love from your lips, shivering from the sensitivity and trying to come to grips with what happened.  It doesn\'t do much good – you\'re already getting horny again, and you still haven\'t been knocked up.  Even though you know something about the situation is deeply wrong, you\'re horny as hell and desperately desire to be a mother.  Maybe it\'s just that there\'s all these strong, handsome males here but none of them are fucking your horny, wet twat.  There\'s something wrong with that!', false );
		//(max libido, lust, and sensitivity);
		EngineCore.dynStats( 'lib', 100, 'sen', 100, 'lus=', 1000, 'cor', 50 );
		//[NEXT];
		EngineCore.doNext( this.femaleZetazOverPtII );
	};
	Dungeon2Supplimental.prototype.femaleZetazOverPtII = function() {
		EngineCore.outputText( '', true );
		EngineCore.hideUpDown();
		EngineCore.outputText( 'While you\'re gathering your thoughts, Zetaz staggers back down the table and accepts a flask from one of his lackeys.  He guzzles down the bubbling pink fluid in seconds, and the effect is immediate and greatly pleasing to your fuck-happy worldview.  The imp\'s cock, which had been slowly retracting, thickens at the base and rapidly fills until it\'s hard and twitching with sexual need.  He glances down at your exposed ' + Descriptors.vaginaDescript( 0 ) + ' with a hungry look and drops to his knees, lining the nodule-ringed crown of his wondrous dick up with your lust-juiced slit.\n\n', false );
		EngineCore.outputText( 'You look down at the male and moan, "<i>Please, hurry up... I need your cum... your babies.  Put your cock inside me!</i>"\n\n', false );
		EngineCore.outputText( 'Zetaz looks surprised at your words, and you start to wonder why, but the heat and pleasure of his long, thick member spearing your love-canal interrupts your thought process.  He reaches up, and begins to ', false );
		if( CoC.getInstance().player.biggestTitSize() < 1 ) {
			EngineCore.outputText( 'tweak your ' + Descriptors.nippleDescript( 0 ) + 's roughly, pulling and yanking on them as', false );
		} else {
			EngineCore.outputText( 'maul at your ' + Descriptors.allBreastsDescript() + ', slapping and squeezing them as', false );
		}
		EngineCore.outputText( ' he begins to repeatedly thrust against your ' + Descriptors.vaginaDescript( 0 ) + ', fucking you in earnest.  The wet slap of his balls on your juice-slimed body fills the chamber and sends ripples of pleasure down your ' + CoC.getInstance().player.legs() + '.  With your eyelids half-closed, your tongue masturbating your lips, and your pussy practically squirting lubricants at the end of each thrust, you must look like every male\'s wet dream.\n\n', false );
		EngineCore.outputText( 'Looking around, you see a large number of the imps are masturbating, and one of the larger ones has the audacity to speak while his boss is plowing your quim with savage strokes. "<i>Since you already got to use her mouth, I\'m going to put that fuck-hole to use.</i>"\n\n', false );
		EngineCore.outputText( 'Zetaz waves his hand, though you aren\'t sure if it\'s meant to be a dismissal or permission.  He\'s far too busy sawing away, sending bliss up your spine that makes you giggle and moan with desire.  You\'re already getting close to cumming!  Before you can vocalize just how great it feels, the imp that spoke is straddling your neck and dangling his own member towards the bloated, bimbo-like cum-receptacle that was once your mouth.\n\n', false );
		EngineCore.outputText( 'The pointed tip of the new imps dick slides through your sensitive orifice with ease, at least until you feel the curvature of his knot pushing apart your jaw.  The utter wrongness of being double-teamed by tiny, huge-cocked demons rears its ugly head, and you knit your brows together as you try to puzzle it out.  What could be wrong?  Your lips feel so good and you\'re about to be pregnant.  Wasn\'t there a reason not to, though?  Something about saving something?  You unconsciously lick at the new invader as his knot finally gets past your lips, humming and sucking while your drug-dulled mind tries to refocus on something other than getting knocked up.\n\n', false );
		EngineCore.outputText( 'Zetaz grunts and bottoms out, punching his tip into your cervix and blasting a thick rope of seed into your empty, ready womb.  You climax immediately from the act, and moan into the dog-cock that fills your mouth, using it like a ballgag.  There wasn\'t any natural buildup, just spunk hitting your womb and then a climax strong enough to make you see white.  Your ' + Descriptors.vaginaDescript( 0 ) + ' clenches tightly, hugging and squeezing Zetaz\'s potent prick as it dumps more and more of his corrupt demon-spoo into your fertile breeding grounds.  The thick goop tingles in a way that makes you sure you\'ll be giving him a litter of horny little sons before long.  Maybe they\'ll fuck you like they do Vala?\n\n', false );
		EngineCore.outputText( 'The knot in your mouth pops out, and your belly gurgles, feeling very full.  The second imp must have come while his master was fertilizing your pussy.  You sigh and sag against your restraints as Zetaz steps away and lines begin to form.  In a few seconds, you\'ve got a rubbery, spined cat-cock twitching inside your cunt, and are wrapping your sensitive lips around a horse-cock.  This must be what nirvana feels like.', false );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'cor', 50 );
		//[Epilogue];
		EngineCore.doNext( this.zetazBadEndEpilogue );
	};
	Dungeon2Supplimental.prototype.zetazBadEndEpilogue = function() {
		EngineCore.outputText( '', true );
		if( CoC.getInstance().player.gender === 2 ) {
			EngineCore.outputText( 'The once-champion, ' + CoC.getInstance().player.short + ' was raped repeatedly by every imp that survived her initial assault.  Her mind never recovered from the initial orgy, and she found herself happy to be named \'Fuck-cow\'.  She quickly became a favorite of Zetaz\'s ever growing brood, and surprised them all with her fertility and rapidly decreasing incubation times.  Within a few months, she was popping out litters of tiny masters even faster than Vala.  Within a year, her body was so well trained and her womb so stretched that she could keep multiple litters growing within at all times.\n\n', false );
			EngineCore.outputText( 'It was rare for Fuck-cow\'s cunt or mouth to be empty, and she delighted in servicing any male she was presented with.  Her masters even captured bee-girls, so that fuck-cow\'s ass could be kept as pregnant as her belly.  Fuck-cow came to love her masters dearly, and with her constantly growing ability to birth imps, she was able to incubate enough troops for Zetaz to challenge Lethice\'s armies.  The imps never managed to overthrow the old demon lord, but the land was eventually divided in half, split between two growing demonic empires.', false );
		} else if( CoC.getInstance().player.gender === 3 ) {
			//[Epilogue];
			EngineCore.outputText( 'The champion was fucked and brainwashed repeatedly for a few more days until Zetaz was sure she understood her place in the world.  Once rendered completely obedient, they released her from her bindings.  It was time she was turned over to Lethice.  ', false );
			if( CoC.getInstance().player.wingType !== AppearanceDefs.WING_TYPE_BAT_LIKE_TINY || CoC.getInstance().player.wingType !== AppearanceDefs.WING_TYPE_BAT_LIKE_LARGE ) {
				EngineCore.outputText( 'Zetaz gave her one of the weaker imps to penetrate and taught her to fly with her new, demonic wings.  ', false );
			} else {
				EngineCore.outputText( 'Zetaz gave her one of the weaker imps to penetrate during the journey.  ', false );
			}
			EngineCore.outputText( 'With preparations complete, Zetaz, the champion, and a few dozen imps flew to the mountain peak.\n\n', false );
			EngineCore.outputText( 'The champion was presented to Lethice, and the demonic mistress was so pleased with Zetaz\'s gift that she gave him a pair of nubile slave-girls and promoted him over a small army of his own kind.  Once the imps departed, Lethice put the champion through her paces, using her as a fucktoy whenever the mood took her.  The rest of the time the champion was kept bound and unable to orgasm, tortured with unholy levels of arousal, but she didn\'t mind.  When Lethice allowed her to cum, the champion\'s orgasms were long and intense enough for her to love her mistress in spite of having to be so pent up.', false );
		} else {
			EngineCore.outputText( 'The imps never released the champion from that chamber after that.  \'He\' gave birth to a healthy litter of imps a few weeks later, and the hormones from the pregnancy ', false );
			if( CoC.getInstance().player.biggestTitSize() < 1 ) {
				EngineCore.outputText( 'created a decent set of chest-bumps.', false );
			} else {
				EngineCore.outputText( 'swelled her already impressive rack with milk.', false );
			}
			EngineCore.outputText( '  After that, the imps really took a liking to her, and she was let down from her restraints.  She never got much chance to get up though; she was well and truly fucked at every opportunity.  She was already hooked.  With her incredible libido and the constant fucking, staying was the easy choice.\n\n', false );
			EngineCore.outputText( 'After a few months the champion started to become acclimated to her new life, and began birthing imps in larger broods with shorter gestations.  She had become the ideal broodmother, and her worldview shrank down to two powerful priorities: acquiring cum, and birthing.', false );
		}
		CoC.getInstance().player.orgasm();
		CoC.getInstance().player.HP += 150;
		EventParser.gameOver();
	};
	//[HERMS];
	Dungeon2Supplimental.prototype.hermZetazOver = function() {
		//H-fed incubi and succubi potions repeatedly until demonic and even more over-endowed, knocked up while dick is milked by factory like milker + MC?;
		EngineCore.outputText( 'With your resistance ', false );
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'beaten out of you', false );
		} else {
			EngineCore.outputText( 'moistening the delta of your legs', false );
		}
		EngineCore.outputText( ', you don\'t even struggle as Zetaz calls in several friends.   You just lie there, meek and defeated as they carry you through the tunnels towards their dining room, but from the looks in the small demons\' eyes, they aren\'t planning to feed you, not food anyway.  The mob you defeated earlier seems to have returned, and gleeful hoots and catcalls ', false );
		if( CoC.getInstance().player.cor < 33 ) {
			EngineCore.outputText( 'shame', false );
		} else if( CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( 'confuse', false );
		} else {
			EngineCore.outputText( 'arouse', false );
		}
		EngineCore.outputText( ' you as you\'re thrown atop one of the tables.   You grunt as leather straps are produced and laid over your form to restrain you.  In the span of a minute you\'re completely immobilized from the neck down, and your ' + CoC.getInstance().player.legs() + ' are kept spread to allow easy access to your ' + Descriptors.vaginaDescript( 0 ) + '.\n\n', false );
		EngineCore.outputText( 'Your willpower starts to come back, and you struggle in vain against the tight leather straps, accomplishing nothing.  Zetaz leers down at your double-sexed form and roughly manhandles both your male and female organs as he taunts, "<i>I don\'t remember ', false );
		if( CoC.getInstance().player.cockTotal() === 1 ) {
			EngineCore.outputText( 'both', false );
		} else {
			EngineCore.outputText( 'all', false );
		}
		EngineCore.outputText( ' of these being here when we met.  Did you sample some incubi draft?  Or did you guzzle some succubi milk?  Perhaps both?  In any event, I think you could do with a little more of each.</i>"\n\n', false );
		EngineCore.outputText( 'Oh no.  Your eyes widen in fear at his bold declaration, but Zetaz only throws back his head and laughs, "<i>Oh yes!</i>"  He turns to the mob and orders something in a tongue you don\'t understand, then returns to fondling your ' + Descriptors.cockDescript( 0 ) + '.  "<i>How perverse.  Why would you have something like this when you have such a beautiful pussy hiding below it?</i>" asks the imp lord.  Despite his questioning words, he doesn\'t stop stroking you until you\'re full, hard and twitching.  Your poor ' + Descriptors.vaginaDescript( 0 ) + ' is aching from being ignored with all this building sexual tension.\n\n', false );
		EngineCore.outputText( 'The sounds of numerous footfalls and clinking glass signal that the mob of imps has returned, bringing what sounds like hundreds of vials worth of their foul concoctions.  Zetaz releases your tumescent member and reaches over for something, then returns to your view bearing a ring gag.  Even turned on, defeated, and immobilized on a table, you try your best to fight him, but all that gets you is slapped.  The imp\'s palm smacks you hard enough to stun you and leave your ears ringing, and when you blink the stars from your eyes, your mouth is forced open with your tongue hanging out lewdly.\n\n', false );
		EngineCore.outputText( 'Another of Zetaz\'s brothers, or perhaps sons, hands him a tube with a funnel, and he easily threads the funnel\'s tube through the ring gag.  Foul remnants of whatever it was used for last leave a sour taste on your tongue, but worse yet is the knowledge that you\'re going to be force-fed tainted, body-altering, mind-melting drugs.  A drop of pre-cum hits your belly and your thighs grow ', false );
		if( CoC.getInstance().player.vaginas[ 0 ].vaginalWetness < AppearanceDefs.VAGINA_WETNESS_DROOLING ) {
			EngineCore.outputText( 'sticky', false );
		} else {
			EngineCore.outputText( 'soaked', false );
		}
		EngineCore.outputText( ' from the thoughts.  ', false );
		if( CoC.getInstance().player.cor < 33 ) {
			EngineCore.outputText( 'Are you really being turned on by such lewd, debased thoughts?', false );
		} else if( CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( 'Are you this much of a pervert?  Yes, it\'ll feel good, but you\'re a little ashamed of your body\'s immediate and lewd reaction.', false );
		} else {
			EngineCore.outputText( 'Are you really this much of a submissive?  Yeah, sucking down drinks like this is hot as hell, but you\'d like to be doing it on your own terms.  At least you\'ll probably start cumming after a few bottles worth of the stuff.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( '"<i>Hey boss!  She\'s already starting to drip!  To think she tried to fight us.  She\'s showing us her true nature – that of a pervert-slut,</i>" raves one of the horde.  You can\'t pick out the source of his voice in the crowd, but the words sting enough to make your whole body blush with ', false );
		if( CoC.getInstance().player.cor < 33 ) {
			EngineCore.outputText( 'shame', false );
		} else if( CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( 'confusion', false );
		} else {
			EngineCore.outputText( 'arousal', false );
		}
		EngineCore.outputText( '.  The imp lord nods in agreement and upends the first bottle over the funnel, channeling fragrant white fluid into your mouth.  It tastes fantastic!  Your throat instinctively gulps down the creamy delight before you can make a conscious decision.  The effect is immediate and strong.  Warmth builds on your chest as weight is added to your ' + Descriptors.allBreastsDescript() + ' while a gush of fluid squirts from your ' + Descriptors.vaginaDescript( 0 ) + '.\n\n', false );
		EngineCore.outputText( 'Zetaz is just getting started.  Before you have time to react to your predicament, the next bottle is empty and thicker cream is flooding your mouth.  You don\'t swallow for a moment, so the imp pours another bottle in, backing up more of the fluid.  Faced with a choice between corruption and drowning, you try to gulp down enough liquid to breathe.  ' + CoC.getInstance().player.SMultiCockDesc() + ' puffs and swells, spurting thick ropes of cum as it adds a half-dozen inches to its length.  Your eyes cross from the sudden change, but you get a fresh breath before the imps begin to pour several bottles in at once.\n\n', false );
		EngineCore.outputText( 'You swallow in loud, greedy gulps as your body is slowly warped by the fluids you\'re consuming.  Though your ' + Descriptors.allBreastsDescript() + ' and ' + CoC.getInstance().player.multiCockDescriptLight() + ' sometimes shrink, they grow far more often, and after a few minutes of force-feeding, you\'re pleading for more each time they stop to let you breath.  You\'re a mess of sexual fluids, your tits are squirting milk, and your pussy squirts from every touch.  Demon horns are swelling from your brow, curling back over your ears', false );
		if( CoC.getInstance().player.horns > 0 ) {
			EngineCore.outputText( ' and adding to your existing pair', false );
		} else {
			EngineCore.outputText( ' and giving you an exotic, tainted appearance', false );
		}
		EngineCore.outputText( '.  ', false );
		if( CoC.getInstance().player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_HIGH_HEELS ) {
			EngineCore.outputText( 'Your ' + CoC.getInstance().player.feet() + ' have been changing throughout the ordeal, but you didn\'t notice your ' + CoC.getInstance().player.legs() + ' becoming such lissom, lengthy legs, or your heels growing long, high-heel-like spikes.  ', false );
		}
		if( CoC.getInstance().player.tailType !== AppearanceDefs.TAIL_TYPE_DEMONIC ) {
			EngineCore.outputText( 'A tail snakes around your leg and begins to caress your ' + Descriptors.vaginaDescript( 0 ) + ', then plunges in to fuck the squirting orifice while you drink.  ', false );
		} else {
			EngineCore.outputText( 'Your tail snakes around your leg and begins to caress your ' + Descriptors.vaginaDescript( 0 ) + ', then plunges in to fuck the squirting orifice while you drink.  ', false );
		}
		EngineCore.outputText( 'The imps start hooting and cat-calling, laughing and prodding your body with their twisted demonic members as your mind starts to come apart in the seething oven of unnatural lust.\n\n', false );
		//NEXT;
		EngineCore.dynStats( 'lib', 100, 'sen', 100, 'lus=', 1000, 'cor', 50 );
		EngineCore.doNext( this.hermZetazOverPtII );
	};
	Dungeon2Supplimental.prototype.hermZetazOverPtII = function() {
		EngineCore.hideUpDown();
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You awaken midway through a loud moan and nearly jump out of your ' + CoC.getInstance().player.skinDesc + ' in surprise, but the fire of your unnaturally stoked libido immediately reasserts yourself.  You twitch your hips to and fro, thrusting against a ', false );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 'number of ', false );
		}
		EngineCore.outputText( 'mechanical milking device', false );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's', false );
		}
		EngineCore.outputText( '.  ' + CoC.getInstance().player.SMultiCockDesc() + ' is sucked rhythmically, producing a loud, wet, slurping noise that echoes around the small room.  You\'re suspended from a set of shackles on the wall, next to Vala.  The sexy faerie is chained up in a similar manner, but she\'s locked in coitus with a well-endowed imp, and making no secret of her enjoyment.  The sexual sight stirs your well-stimulated loins and you groan, filling the milker with what feels like gallons of male cream over the next minute and a half.\n\n', false );
		EngineCore.outputText( 'Slumping forwards, you hang there, but the corruption and lust in your blood refuses to be sated.  ' + CoC.getInstance().player.SMultiCockDesc() + ' is already hard again, and after sucking your cum down some tubes, the milker begins its oh-so-pleasurable work again.  Still, you estimate it will be a few minutes before it gets you off again, so you look around the room.  A platform is set up in front of you, about knee-height and poorly built.  Judging by its height, it\'s probably there so that the imps can use it to fuck you without having to fly.  There\'s also a pair of platforms built into the walls next to each of your shoulders, though their function is less clear.\n\n', false );
		EngineCore.outputText( 'The door to the room bangs open, and Zetaz steps in, followed by two scrawnier-than-usual imps.  He smiles when he sees you awake and flushed, and steps up onto the platform, rubbing his palms together in excitement.\n\n', false );
		EngineCore.outputText( '"<i>You took quite well to our little experiment,</i>" he announces, "<i>In fact, your body is a demonic fucking machine.  I won\'t be transforming you into an actual demon though.  But we\'re going to have to have a little training to get you ready to meet Lethice.  After all the trouble you\'ve caused her, she might want to turn you herself, or maybe hook you up in a factory?  I can\'t say for sure.</i>"\n\n', false );
		EngineCore.outputText( 'With a flourish, the imp lord discards his loincloth, tossing it over his shoulder to reveal his erect demon dick.  He taunts, "<i>Like what you see?</i>" and orders his lackeys, "<i>Go on, you know what to do.</i>"  The pair of scrawny imps flit up to their perches while Zetaz advances and strokes himself, preparing for penetration.  Dozens of unanswered questions swarm through your mind, actually distracting you from your pending orgasm enough to ask, "<i>Wha-what are you going to do to me?</i>"\n\n', false );
		EngineCore.outputText( '"<i>Shhhh, shhh,</i>" responds Zetaz, "<i>just relax my pet.</i>"  He ', false );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( 'gently shifts your ' + Descriptors.ballsDescript() + ' out of the way and ', false );
		}
		EngineCore.outputText( 'lines up with your drooling fuck-hole, and with a long smooth stroke, he\'s inside you.  You cum immediately and hard, barely noticing the chanting that has started up on the adjacent platforms.  Each squirt of cum is accompanied by a thrust from Zetaz, sliding over your lube-leaking walls with ease.  The orgasm lasts nearly twice as long as your last one.  It never seems to end, but when it slowly trails off, you find yourself wondering how soon you can cum again.\n\n', false );
		EngineCore.outputText( 'You envision yourself on all fours, being taken in both openings by a pair of imps while you suck off a shadowy figure that your mind recognizes as your lord and master.  ' + CoC.getInstance().player.SMultiCockDesc() + ' spurts and squirts with each penetration as your twin violators get off and stuff you full of their yummy imp cum, glazing your insides with corrupted white goo.  Maybe you\'ll get pregnant this time?  It\'s been a few weeks since your last litter.  You suck harder on your master\'s penis and caress his balls until he shows his affection by giving you a salty treat.  He pulls out and blasts a few ropes over your face and hair, so you do your best to look slutty to encourage him.  When he finishes, you lick your lips and beam at your master, Zetaz.\n\n', false );
		EngineCore.outputText( 'Wait- what!?  You shake your head and clear away the fantasy, though your sexual organs\' constant delightful throbbings aren\'t doing much to help.  Zetaz is still fucking your pussy, taking it with long slow strokes that would\'ve made your demonic legs give out ages ago if you weren\'t hanging on a wall.  The chanting is so loud, so insidious.  You can feel it snaking through your brain, twisting your thoughts and ideas.  You close your eyes, desperate to fight it, but it only enhances the sensation of dick-milking and being fucked by your- no, by that demon!\n\n', false );
		EngineCore.outputText( 'Glancing down at him, you remark that the little bastard is quite handsome for an imp.  With his perfect jawline and marvelous cock, you find yourself hard-pressed to justify resisting him so long ago.    How did you resist his charms?  His cock feels soooo fucking good inside you.  With an explosive burst, ' + CoC.getInstance().player.sMultiCockDesc() + ' erupts again, squirting thick arousal and submission into the milker while your ' + Descriptors.vaginaDescript( 0 ) + ' wrings Zetaz\'s nodule-ringed cock incessantly.  His turgid member bulges obscenely, and he starts to cum inside you, squirting master\'s thick seed into your breeding hole.  Breeding hole?  Why would you call your slutty fuck-hole a breeding hole?  Something seems off about that last thought, but you can\'t place it.\n\n', false );
		EngineCore.outputText( 'Your master finishes squirting inside you and withdraws, pawing at your milk-leaking teats for a moment as you continue to shudder and cum like a good bitch.  Wow, you really are a good bitch aren\'t you?  Pride wells in your breast as the imp\'s chanting reaches a crescendo and a relaxed smile forms on your ' + CoC.getInstance().player.face() + '.  Yes, you\'re a good, breeding bitch.   Master is smiling up at you and you know you\'ve made him feel very happy.  Hopefully he\'ll come back soon and fuck you some more.  Your pussy feels so empty without him.', false );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'cor', 50 );
		EngineCore.doNext( this.zetazBadEndEpilogue );
	};
	//M-Males – drugged & pegged, slowly have their memories erased/brainwashed.;
	//[Males];
	Dungeon2Supplimental.prototype.malesZetazOver = function() {
		EngineCore.outputText( 'You\'ve been so thoroughly ', false );
		if( CoC.getInstance().player.HP < 1 ) {
			EngineCore.outputText( 'beaten', false );
		} else {
			EngineCore.outputText( 'teased', false );
		}
		EngineCore.outputText( ' that you don\'t even resist as Zetaz calls in several friends.   You just lie there, meek and defeated as they carry you through the tunnels towards their dining room, but from the looks in the small demons\' eyes, they aren\'t planning to feed you... not with food anyway.  The mob you defeated earlier seems to have returned, and gleeful hoots and catcalls ', false );
		if( CoC.getInstance().player.cor < 33 ) {
			EngineCore.outputText( 'shame', false );
		} else if( CoC.getInstance().player.cor < 66 ) {
			EngineCore.outputText( 'confuse', false );
		} else {
			EngineCore.outputText( 'arouse', false );
		}
		EngineCore.outputText( ' you as you\'re thrown atop one of the tables and rolled onto your side.   You grunt as leather straps are produced and laid over your form to restrain you.  In the span of a minute you\'re completely immobilized from the neck down, and your ' + CoC.getInstance().player.legs() + ' are kept spread to allow easy access to ' + CoC.getInstance().player.sMultiCockDesc() + ' and ' + Descriptors.assholeDescript() + '.\n\n', false );
		EngineCore.outputText( 'Zetaz leaps atop the table in a single bound, the barely concealed bulge in his loincloth dangling freely underneath.  You begin to struggle, fearful of the cruel imp\'s intentions and ', false );
		if( CoC.getInstance().player.ass.analLooseness < 4 ) {
			EngineCore.outputText( 'worried he\'ll try to force the mammoth between his thighs into your backdoor', false );
		} else {
			EngineCore.outputText( 'worried he\'ll take advantage of your well-stretched backdoor', false );
		}
		EngineCore.outputText( ', but your feverish efforts are in vain – the restraints are too strong!  The imps start to laugh at your predicament, and Zetaz pushes the humiliation a step further by stepping squarely on your groin, painfully squeezing your ' + Descriptors.cockDescript( 0 ) + ' with his heel.  He throws his arms up in the air and shouts, "<i>I am your champion!  I have brought the scourge of our kind to his knees, and ground him under my heel!</i>"\n\n', false );
		EngineCore.outputText( 'You whine plaintively and squirm under the imp\'s heel, utterly humiliated and helpless.  Zetaz smirks down at your taunts, "<i>What\'s the matter?  Is something bothering you?</i>"  He raises his foot, letting you gasp, "<i>Thank you,</i>" before he delivers a kick to your gut, knocking the wind out of you.  Restrained as you are, your body convulses underneath the leather, trying to curl up while your diaphragm spasms repeatedly.  A strap is fastened around your head, and a ring gag is slipped into your mouth, holding it open and ready for whatever sick plans the imps have devised.\n\n', false );
		EngineCore.outputText( 'The imp lord gestures at his underlings with an irritated scowl while you catch your breath, and the horde scrambles to satisfy him before they can draw his ire.  A funnel with a clear tube suspended from the bottle is passed from the mass of bodies up to Zetaz, along with a few bottles filled with roiling pink and red fluids.   The funnel\'s exit-tube is threaded into your ring gag and there\'s nothing you can do but grunt in wide-eyed panic while it\'s secured in place.  The first bottle of what you assume to be lust-draft is upended into the funnel, and there\'s nothing you can do but drink or drown.\n\n', false );
		EngineCore.outputText( 'It has a bubblegum-like taste that makes your tongue tingle as it passes into your belly, but the more pressing sensation of ' + CoC.getInstance().player.sMultiCockDesc() + ' getting rock-hard lets you know exactly what you just drank.  Even though you just finished chugging down that foul drink, the imps uncork another pair of potions and dump them into the funnel.  The sweet fluids flood your mouth, and once again you swallow and chug rather than drown.   After you finish the last swallow, you pant, completely out of breath and getting hotter by the moment.  Your ' + CoC.getInstance().player.skinDesc + ' tingles and sweats, growing more and more sensitive with every passing second while ' + CoC.getInstance().player.sMultiCockDesc() + ' begins to drip and drool.\n', false );
		EngineCore.outputText( 'Zetaz hands the funnel to an underling with a knowing laugh and repositions himself over your ' + CoC.getInstance().player.legs() + '.  Warm pressure pushes at your ' + Descriptors.assholeDescript() + ', forcing your clenching flesh to yield around the intruder.  Normally such an instant penetration would be irritating, or perhaps painful, but the sudden pressure on your prostate only serves to release a copious squirt of pre-cum.  An unwelcome moan slips past your lips and sends a titter of laughter through the mob.  As if losing wasn\'t bad enough – they all know you\'re getting off on having your ' + Descriptors.assDescript() + ' penetrated.  The worst part is that the humiliation is just making the situation hotter and ' + CoC.getInstance().player.sMultiCockDesc() + ' harder.\n\n', false );
		EngineCore.outputText( 'You nearly choke as an unexpected wave of potions washes through the funnel into your mouth, but you start swallowing and gulp down what feels like a half-dozen lust potions before you can breathe again.  ' + CoC.getInstance().player.SMultiCockDesc() + ' starts squirting and spurting, dumping heavy loads of cum onto the table and your belly from the effects of the potions alone.  Zetaz gathers a massive dollop in his hand and smears it over himself, using it as lubricant to penetrate your poor, beleaguered asshole with savage, rough strokes that smash against your prostate at the apex of each thrust.  You moan loudly and lewdly through the tube in your mouth, wriggling against your restraints and spurting helplessly as you\'re penetrated over and over.\n\n', false );
		EngineCore.outputText( 'As soon as your orgasm concludes, another wave of aphrodisiacs enters your mouth, and you have to drink all over again.  Something warm flashes in your backside, making you feel stuffed and hot, but then Zetaz pulls his cock free and another, slightly different prick is buried in your asshole.  The imps take turns battering your backdoor, force-feeding you potions, and sometimes even jerking you off to see how much you squirt, until your mind shuts down from the constant assault of drugs, sex, and pleasure.\n\n', false );
		EngineCore.dynStats( 'lib', 100, 'sen', 100, 'lus=', 1000, 'cor', 50 );
		EngineCore.doNext( this.malesZetazOverPtII );
	};
	Dungeon2Supplimental.prototype.malesZetazOverPtII = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You wake to a desert-dry, sandpapery feeling in the back of your throat as yet another moan escapes your mouth.   The ring gag is still there, and easily thwarts your tongues attempts to lick at your parched lips, but the jolts of pleasure exploding up your spine make it hard to get upset about it.  Hips rocking, you keep squirting and squirting from your orgasm, feeling each hot blast burst from your manhood until the wave of lust passes and you open your eyes.  You\'re in a dim cave, the one they used to hold Vala, and chained up to the wall in a similar manner.\n\n', false );
		EngineCore.outputText( 'While you observe the room, you realize that the waves of pleasure sliding up your spinal cord haven\'t stopped, and that your entire body is being shaken rhythmically.  You look down with a look of incredible, still-drugged confusion and behold the last thing you expected to see.  Somehow ' + CoC.getInstance().player.sMultiCockDesc() + ' has been shrunk to less than half of its previous size', false );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( ', and your balls have completely vanished', false );
		}
		EngineCore.outputText( '!  Just below your pint-sized shaft, a massive imp-cock is plowing in and out of your new, wet snatch with juicy-sounding slaps.  Y-you\'re a hermaphrodite!?  And what\'s happening to your dick?\n\n', false );
		EngineCore.outputText( 'A nearby imp with a limp dick and a bored-but-tired look on his face steps up after your orgasm and slathers your dick in some strange, pungent cream, chuckling up at you while he does so, "Heh heh, your ', false );
		if( CoC.getInstance().player.cockTotal() === 1 ) {
			EngineCore.outputText( 'cock\'s', false );
		} else {
			EngineCore.outputText( 'cocks\'re', false );
		}
		EngineCore.outputText( ' gonna be so tiny ', false );
		if( CoC.getInstance().player.cockTotal() === 1 ) {
			EngineCore.outputText( 'it', false );
		} else {
			EngineCore.outputText( 'they', false );
		}
		EngineCore.outputText( '\'ll make a baby\'s look huge.  Boss said we need to dose you with Reducto after each orgasm, so try not to cum too much while we gangbang you, okay?  Oh yeah, I almost forgot, I have to inject something too...</i>"\n\n', false );
		EngineCore.outputText( 'The little demon picks an small, glass injector stamped in black ink with the words \'GroPlus\'.  Your eyes go wide at sight of the lettering.  As your maleness dwindles, the imp carelessly flicks it to the side and lines the needle\'s tip up with your tiny bud – they\'re going to shrink your dick to nothing and pump your clit full of growth chemicals!  He plunges it in, lighting your world up with pain, but the bindings around your body prevent you from escaping or injuring yourself in struggle.  Heat erupts inside your clitty, and it visibly swells up until it nearly reaches the size of your shrinking wang.  Your rapist, or \'sexual partner\' with how horny you are, thrusts hard inside you and swells, stroking your walls with the nubby protrusions of a demon\'s cock.  It feels so good that another orgasm builds on the spot.\n\n', false );
		EngineCore.outputText( 'With hot, tainted jism filling your womb, your body starts to spasm and squirt, actually making your increasingly tiny dick shake around from the force of ejaculation.  It splatters off the imp\'s horns and forehead, but he doesn\'t seem to mind much as he slumps down, dragging his still-rigid member from your cock-hungry fem-sex.  You moan wantonly, still spurting as the imp \'medic\' applies another layer of Reducto to ' + CoC.getInstance().player.sMultiCockDesc() + ', rapidly shortening ', false );
		if( CoC.getInstance().player.cockTotal() === 1 ) {
			EngineCore.outputText( 'it until it\'s', false );
		} else {
			EngineCore.outputText( 'them until they\'re', false );
		}
		EngineCore.outputText( ' barely three inches long, even while hard.  He pulls out another plunger and rams the needle into your still-aching clit, making it swell until it\'s almost five inches long and trembling like your manhood used to.\n\n', false );
		EngineCore.outputText( '"<i>Now you\'re starting to look like a proper bitch.  ', false );
		if( CoC.getInstance().player.biggestTitSize() < 2 ) {
			EngineCore.outputText( 'It doesn\'t look right without a decent rack, but boss said no tits for the new breeding bitch.  Sure makes it hard to get excited about fucking that new twat of yours though...', false );
		} else {
			EngineCore.outputText( 'With a rack like that and a nice, wet cunt, you\'ll have the other guys lining up for their turn in no time...', false );
		}
		EngineCore.outputText( '</i>" rambles one of the imps.  You groan and shake your hips lewdly, still turned on after all the fucking, feeling empty without the unholy heat of an imp inside you.  A hunger buzzes away in your womb, demanding you get pregnant, and you\'re thrilled to see Zetaz stride in with a raging, fully erect stiffy.  It throbs hungrily as he smiles up at you and climbs atop the conveniently positioned platform.\n\n', false );
		EngineCore.outputText( '"<i>It looks like you\'re ready now, huh?  Nice, wet cunt, barely discernible dick, and a huge, lewd clit.  I considered getting rid of your dick, but I figured it would be more humiliating to keep that to remind you how far you\'ve fallen.  And with all that cum dripping from that hole above your ' + CoC.getInstance().player.legs() + ', you\'ll probably get pregnant, but I should make sure shouldn\'t I?</i>" questions your old foe.\n\n', false );
		EngineCore.outputText( 'Before he gets started, Zetaz picks up another needle of GroPlus and jams it into your clit, making the love-button swell up to the size of a large, veiny prick.  He strokes it hard and slides himself into you, spearing you while you\'re distracted by the sensations of your over-sized buzzer.   The sudden penetration makes your eyes cross and your tongue loll out from its ring-gag prison.  You moan and pant, shaking against him, still dripping the last of your male orgasms from your tiny, under-sized dick onto your long, thick clit.\n\n', false );
		EngineCore.outputText( 'Zetaz laughs and pumps at the huge button; even though it\'s quite lacking in femininity, it still makes you squeal like a little girl.  Your ' + CoC.getInstance().player.legs() + ' shake wildly, trembling against the wall while your juicy snatch gets fucked good and hard and the mixed jism boils out around the imp lord\'s massive, swollen member.   The fucking is hard, fast, and so brutal that you get off multiple times in the span of a few minutes, though the imps don\'t even try to dose you for each one.  Zetaz slaps your ' + Descriptors.assDescript() + ' a few times before he pushes himself to the hilt, stretching your well-fucked cunt to its limits.  He twitches and grunts, and a blast of gooey heat suffuses your core with corrupt pleasure.  Somehow you know, just know, that you\'ll be pregnant from this, but you have a hard time caring.  It feels too good...\n\n', false );
		EngineCore.dynStats( 'lib', 100, 'sen', 100, 'lus=', 1000, 'cor', 50 );
		EngineCore.doNext( this.zetazBadEndEpilogue );
	};

	Dungeon2Supplimental.prototype.theSeanShopOffer = function() {
		EngineCore.spriteSelect( 52 );
		EngineCore.clearOutput();
		EngineCore.outputText( 'You try to sneak closer to get a closer look at him, but the demon immediately stops what he\'s doing and stares straight at you.  He laughs, "<i>Well now I know what happened to all the demons inside.  I really would\'ve expected a bunch of renegades like them to put up a better fight.</i>"\n\n' );
		EngineCore.outputText( 'Caught, you stand up and ready your ' + CoC.getInstance().player.weaponName + ', taking up a defensive stance to ready yourself for whatever new attacks this demon has.  Strangely, he just starts laughing again, and he has to stop to wipe tears from the corners of his eyes before he talks, "<i>Oh that\'s rich!  I\'m not here to fight you, Champion.  I doubt I\'d stand much of a chance anyways.  I heard there were some renegades around this area, so I thought I\'d show up to offer my services.  You see, I\'m a procurer of strange and rare alchemical solutions.  Of course you beat down everyone before I got here, but I thought I\'d stick around and see if some scouts were still around before I high-tailed it out of here.</i>"\n\n' );
		EngineCore.outputText( 'You stare, blinking your eyes in confusion.  A demon of lust, and he\'s not interested in fighting or raping you?  He laughs again as he reads your expression and calmly states, "<i>No, I\'m far from your average incubus.  To tell the truth I enjoy a spirited debate or the thrill of discovery over sating my sexual appetite, though of course I do indulge that from time to time.</i>"\n\n' );
		EngineCore.outputText( 'The strange incubus flashes you a smile that makes you feel a tad uncomfortable before he finally introduces himself, "<i>The name\'s Sean, and as you seem to be kicking the living shit out of Lethice\'s followers and enemies alike, I\'d like to be on your side.  So I propose a mutually beneficial agreement – I\'ll sell you items you can\'t get anywhere else, and you let me live in this cave.  What do you say?</i>"\n\n' );
		EngineCore.choices( 'Deal', this.incubusDeal, 'No Deal', this.incubusNoDeal, '', null, '', null, '', null );
	};
	Dungeon2Supplimental.prototype.incubusDeal = function() {
		EngineCore.spriteSelect( 52 );
		EngineCore.clearOutput();
		EngineCore.outputText( '"<i>Excellent!  Give me a few moments to gather my things and I\'ll be open for business!</i>" exclaims the strange demon.  If his story is true it\'s no wonder he doesn\'t get along with the rest of his kind.' );
		//[Next – to room];
		CoC.getInstance().flags[ kFLAGS.ZETAZ_LAIR_DEMON_VENDOR_PRESENT ] = 1;
		EngineCore.doNext( EventParser.playerMenu );
	};
	Dungeon2Supplimental.prototype.incubusNoDeal = function() {
		EngineCore.spriteSelect( 52 );
		EngineCore.clearOutput();
		CoC.getInstance().flags[ kFLAGS.ZETAZ_LAIR_DEMON_VENDOR_PRESENT ] = -1;
		EngineCore.outputText( 'Sean nods, grabs a pack, and takes off running before you have a chance to kill him.' );
		EngineCore.doNext( EventParser.playerMenu );
	};
	Dungeon2Supplimental.prototype.incubusShop = function() {
		EngineCore.spriteSelect( 52 );
		if( CoC.getInstance().flags[ kFLAGS.NIAMH_SEAN_BREW_BIMBO_LIQUEUR_COUNTER ] === 1 ) {
			CoC.getInstance().scenes.telAdre.niamh.getBimboozeFromSean();
			return;
		}
		EngineCore.clearOutput();
		EngineCore.outputText( 'Sean nods at you and slicks his hair back into place, threading it carefully around the small nubs of his horns before asking, "<i>What can I do for you?</i>"' );
		EngineCore.menu();
		EngineCore.addButton( 0, ConsumableLib.NUMBROX.shortName, this.incubusBuy, ConsumableLib.NUMBROX );
		EngineCore.addButton( 1, ConsumableLib.SENSDRF.shortName, this.incubusBuy, ConsumableLib.SENSDRF );
		EngineCore.addButton( 2, ConsumableLib.REDUCTO.shortName, this.incubusBuy, ConsumableLib.REDUCTO );
		EngineCore.addButton( 3, WeaponLib.SUCWHIP.shortName, this.incubusBuy, WeaponLib.SUCWHIP );
		if( CoC.getInstance().player.hasItem( ConsumableLib.BIMBOCH ) && CoC.getInstance().flags[ kFLAGS.NIAMH_SEAN_BREW_BIMBO_LIQUEUR_COUNTER ] === 0 ) {
			EngineCore.outputText( '\n\nSean could probably do something with the Bimbo Champagne if you had enough of it...' );
			if( CoC.getInstance().player.hasItem( ConsumableLib.BIMBOCH, 5 ) ) {
				EngineCore.outputText( '  Luckily, you do!' );
				EngineCore.addButton( 4, ConsumableLib.BIMBOLQ.shortName, CoC.getInstance().scenes.telAdre.niamh.seanBimboBrewing );
			}
		}
		EngineCore.addButton( 9, 'Leave', EventParser.playerMenu );
	};
	Dungeon2Supplimental.prototype.incubusBuy = function( itype ) {
		EngineCore.spriteSelect( 52 );
		EngineCore.clearOutput();
		EngineCore.outputText( 'The incubus lifts ' + itype.longName + ' from his shelves and says, "<i>That will be ' + (itype.value * 3) + ' gems.  Are you sure you want to buy it?</i>"' );
		if( CoC.getInstance().player.gems < (itype.value * 3) ) {
			EngineCore.outputText( '\n<b>You don\'t have enough gems...</b>' );
			EngineCore.doNext( this.incubusShop );
			return;
		}
		EngineCore.doYesNo( Utils.curry( this.incubusTransact, itype ), this.incubusShop );
	};
	Dungeon2Supplimental.prototype.incubusTransact = function( itype ) {
		EngineCore.spriteSelect( 52 );
		EngineCore.clearOutput();
		CoC.getInstance().player.gems -= itype.value * 3;
		EngineCore.statScreenRefresh();
		CoC.getInstance().inventory.takeItem( itype, this.incubusShop );
	};
	//[Cum Bath];
	Dungeon2Supplimental.prototype.valaCumBath = function() {
		EngineCore.spriteSelect( 60 );
		EngineCore.clearOutput();
		//FIRST TIME INTRO;
		if( CoC.getInstance().flags[ kFLAGS.VALA_CUMBATH_TIMES ] === 0 ) {
			EngineCore.outputText( 'You chat with Vala for a short while before bringing up a question that\'s been on your mind: if she\'s a fairy, does that mean she gets high off of cum?  The question might offend another woman, but in the overgrown fairy\'s idolizing eyes you can do no wrong.  She doesn\'t even bat an eye.  "<i>Oh, possibly.  I mean, it did before I was captured.  I\'m not sure if it would still work, now that I\'m so much bigger.</i>"  Then, in a lowered voice intended just for you, she murmurs: "<i>Though, I always feel a warm tingle from my hero, even if it\'s just the brush of your fingers on mine.</i>"  She meets your eyes with a smile like a sunrise.' );
			EngineCore.outputText( '[pg]Vala seems to be mulling your question over in her mind, her spritely legs rubbing together as she nibbles her lower lip anxiously.  "<i>Oh, but now that you mention it, I do want to try,</i>" she giggles.  Placing her hand atop yours, she gives you an affectionate squeeze.  "<i>Meet me in the back room,</i>" she whispers, her wings fluttering gleefully as she flies to the bar to put away her apron and let the barkeep know she\'ll be taking a break.  You can see tiny, glistening droplets of excited lubrication leaking down her thighs and leaving a dripping line of glittering fem-cum on the floor.' );
			EngineCore.outputText( '[pg]You follow after, finding your way to the storeroom where Vala is waiting for you.  Embracing you tightly, she plants a spritely kiss on your lips and flutters a foot off the ground, her hands on your shoulders.  "<i>If we\'re going to try this, we\'d better make sure there\'ll be enough!</i>" she laughs.  "<i>After all, I had quite a tolerance built up before you rescued me.</i>"' );
			//[If the player's cum production is under X] ;
			if( CoC.getInstance().player.cumQ() < 2000 ) {
				EngineCore.outputText( '[pg]"<i>I have something that might help,</i>" Vala offers, brightly.  "<i>A gift from the sweetest little bunny girl.</i>"  The fairy turns around to sift through some of the articles in the store room before producing a thin vial of glistening oil that smells faintly of strawberries.  "<i>She mentioned that this batch wasn\'t powerful enough and was just going to throw it out, but I hate to see anybody\'s hard work go to waste, so I offered to pay her for it.</i>"  Vala hands you the oil and clasps her hands to her mouth, blushing faintly.  "<i>Oh my, that little bunny girl was just too cute.  I hope you get a chance to meet her!</i>"' );
				EngineCore.outputText( '[pg]Tilting your head back, you swallow the greasy oil in a single gulp, your belly filling with a wonderful sweetness that flows into your loins.' );
				//IF BALLS: ;
				if( CoC.getInstance().player.balls > 0 ) {
					EngineCore.outputText( '  Your balls react immediately, filling with a cold weight that nearly knocks you to your ass.  Your [armor] bulges obscenely as the sack hanging between your legs fills with liquid pressure that squeezes your bloating flesh.' );
				}
				EngineCore.outputText( '  Your abdomen noisily groans as your prostate churns with an eager fervor that sets your heart racing.  You strip before the pre-cum brimming at the peak of [eachCock] can stain your clothing and you find that Vala\'s already removed and folded her dress, apparently enjoying the sight.  You reach over and tussle her hair playfully, bringing a blush to the fairy\'s grinning cheeks.' );
			}
			//OR [If the player's cum production is over X];
			else {
				EngineCore.outputText( '[pg]In response, you cup the pale girl\'s chin and flash a sly smile of your own.  Arching a ' + CoC.getInstance().player.hairColor + ' eyebrow, you assure her that won\'t be a problem.  Vala\'s hands sink down to your crotch, fey fingers pushing aside your [armor] to encircle your swelling member.  "<i>I don\'t doubt it,</i>" she purrs, lightly tracing the crest of your [cock]\'s head.' );
				//[IF BALLS: ;
				if( CoC.getInstance().player.balls > 0 ) {
					EngineCore.outputText( '  The fairy\'s hands slide a bit further and she turns up her palms to cup your [balls], her thin fingers delicately massaging the heft of your over-burdened sac.  "<i>I don\'t know who\'s more excited, me or these guys,</i>" she teases, drawing you into another passionate embrace.  Grasping your testicles just tightly enough to send a shiver of pleasure across the back of your neck, she wets her lips and whispers, "<i>Who am I kidding?  No one wants this more than me.</i>"' );
				}
				EngineCore.outputText( '[pg]Stripping the [armor] from your body, piece by piece, Vala carefully sets your clothing on a nearby shelf then attends to her own dress.  Unhitching the clasps from her high-necked emerald garment, she turns her back to you, jutting her birthing-heavy rump out just a bit and wriggles her shoulders.  "<i>Would you mind unzipping me?</i>"  You move between the fairy girl\'s wings, pressing your erection against the silk hugging her ass cheeks and begin to pull open the skin-tight, jade raiment.  Gradually, the gossamer cloth parts, baring the silent testimony of Vala\'s imprisonment: thousands of ink hash marks tattooed from the girl\'s shoulders down to the soles of her feet.  The tender mercy of the imps.  She tenses for a moment before turning her head sideways to glance softly at you.  She sighs and her muscles loosen, dark memories melting at the touch of your fingers.  Wordlessly spinning to face you, she cups your cheeks in her warm hands and places a tender kiss on the tip of your nose before slipping out of her dress and folding it next to your clothes.' );
			}
		} else {
			//REPEAT INTRO;
			EngineCore.outputText( 'You give your favorite fairy\'s bottom a squeeze through the silk of her long dress and she returns the affectionate gesture by brushing her fingers down your free arm, lingering atop the tips of your fingers.  Discretely, you ask her if she\'s recovered from the last time the two of you indulged in each other and she giggles in delight.  "<i>I don\'t think anybody would ever be quite the same after that many orgasms,</i>" she whispers.  "<i>If you\'re not careful, I might get addicted to you,</i>" she teases, sliding a hand around your neck and running her fingers through your [hair].  "<i>But how can I say no to all this?</i>" she gestures at your body with a lascivious smile.' );
			EngineCore.outputText( '[pg]She drops off her apron at the bar and guides you to the store room, practically dragging you in her bobbing, exuberant flight.  Stripping the two of you, Vala has to restrain herself from mounting you on the spot, her breaths ragged and husky with desire.  ' );
			//[Low Cum Production: ;
			if( CoC.getInstance().player.cumQ() < 2000 ) {
				EngineCore.outputText( 'Retrieving a vial of glistening oil, she offers the concoction to you with a laugh.  "<i>The gal who makes these is so silly.  She always giggles when I pay her a visit and blushes when I call her \'bunny girl\'.  She\'s so cute I just want to give her a squeeze!</i>" You chuckle and down the draft, a thrill of cold weight filling your gut.  ' );
			}
			EngineCore.outputText( 'The fairy brushes her glittering hair behind her shoulders and sits on her knees in front of you, large pink eyes staring up eagerly.' );
		}
		//[NEXT];
		EngineCore.doNext( this.valaCumBath2 );
	};
	Dungeon2Supplimental.prototype.valaCumBath2 = function() {
		EngineCore.spriteSelect( 60 );
		EngineCore.clearOutput();
		EngineCore.outputText( 'Vala tries to compose herself before you, but the girl is too antsy to go slowly, impatient hands wrapping around your [ass] and pulling you toward her lithe body, her wings aflutter with restless gaiety.  The buoyant pixie leans in to lap at the pout of your cockhead with the tip of her pink tongue while her thumbs work fervently between the junction of her legs, stroking her glistening clit like she were polishing a precious jewel.  Her fingers curl into the slavering depths of her pussy, stroking her fey folds with trembling pleasure.  Leaving one hand to continue jilling herself, Vala takes the other and uses her honey-drenched palm to polish the quivering flesh of your swelling shaft.  She encircles the crest of your fairy-slick cock with her eager pucker, sucking the steady dribble of your pre-cum as she pumps vigorously.  Before long, the twitching bliss rushing to your loins tell you that her voracious efforts have coaxed the thickening semen bubbling inside you to the edge of your restraint.  Gently, you push her off of your member, your urethra dilating as your orgasm gushes forth.' );
		EngineCore.outputText( '[pg]Your cum spurts out in long, drooping ropes of alabaster that splash against Vala\'s face, provoking a startled jolt from the over-grown fairy.  She smiles, blinking the spunk from her eyes just as another stream lances out, pallid jizz catching her on the lips as she opens her mouth to speak.  She gasps in surprise, a curtain of ivory splashing down her chin.  The shuddering pleasure coursing through your body reaches a steady rhythm as you stroke yourself off in the throes of one, long orgasm.  Forcing yourself to breath steadily despite your racing heart, you pump your [cock] with remarkable restraint, holding back your impassioned urges to fill the fairy\'s womb with your virile seed.' );
		EngineCore.outputText( '[pg]Vala raises her hands to gather the seed seeping down her face, guiding your rich cream across her cheek and back into her hair.  Her chest rises and falls a little faster as your keep up the regular pulses of cum, arcing through the air with every heartbeat; semi-clear fluid lacquering her pale skin as layer after layer of your ejaculate forms a slimy pearl mask that seeps down her throat and across her sizable breasts.  The fairy seems a bit flustered, panting as her head rolls on her shoulders, mouth agape and eyes sealed behind the thick, liquid lust spurting from your throbbing shaft.' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( '  Your gut is heavy with the churning weight of your jism, sending tingling waves of cold into your pulsing scrotum, the chill soothing the ardor of your trembling balls.  A manic zeal writhes in your groin, filling your swollen pouch just as quickly as your protracted climax can splatter out your lewd passion across the shuddering girl\'s bare flesh.' );
		}
		EngineCore.outputText( '[pg]The cum-drenched girl runs her hands up and down her torso, rubbing your warm cum against her skin with quivering motions.  Her fingers trace across her lean limbs and up the bust of her tremendous chest, rapidly flicking her nipples with her thumbs as she reaches the peak of her mounds.  Vala\'s breaths become shallow as a flush creeps across her skin, the hot pink hue visible even under the spoo-slick polish you\'re encased the fairy in.  She leans forward, her cum-glistening lips inches from your fountaining cock, and you can feel the boiling heat coursing through her drug-basted body with every panting moan that shudders out of her jizz-filled mouth.  She brushes her slime-coated cheeks across the crown of your turgid cockhead and slides her face over your pulsing glans until her nose is directly over your drooling sperm-slit.  She closes her mouth, takes a long, cooing swallow, and sniffs deeply, drinking in the salty scent of your creamy discharge.  Your next load lurches forward, a tremendous glob of goo bursting directly against her nostrils, suffocating her sense of smell with the possessive urgency of your foaming seed.' );
		EngineCore.outputText( '[pg]The fairy chokes as your jetting spunk fills her world, every pore drinking in the oozing nectar of your fervent masturbation.' );
		//[IF BALLS: ;
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( '  Her head sinks down to rest against your wobbling scrotum, the balls within practically swimming in the oceans of jizz your body is producing to saturate the cum-drunk girl.  Lifting your shaft vertically, your jism rains down on Vala\'s body, blotting out the imp-tattooed hash marks with an ivory cascade that splatters against her narrow shoulders and dribbles down, between her gossamer wings, draping her muscular back with a pearl raiment.' );
		}
		EngineCore.outputText( '  Her face dripping with the milky veil of your spunk, the overwhelmed girl leans back, settling against the floor as the drug-like intoxication of your sperm leaves her incapable of much more than moaning and writhing.  Using both hands, she smears the spattering cum across her lissome frame: tracing the flower-like folds of her labia, pooling it into her belly button, scooping double handfuls to bathe her pink-and-purple hair in your white waterfall.' );
		EngineCore.outputText( '[pg]Her blissful ecstasy fills the cup of your frenzied ardor until it overflows, leaving you unable to keep your steady pace from accelerating.  Gripping the base of your shaft with one hand, you apply steady pressure, cutting off the stream of your cum while the other hand pumps faster and faster.  The squirming fairy at your feet thrashes in rapture, wreathed in the pale luminance of candle light reflecting off the lurid pool that surrounds her spunk-polished body.  Her breasts sway across her chest, heavy with the milk of her many pregnancies, your gooey ejaculate giving the ponderous orbs a glistening sheen that ripples with every wobbling heave of her overwhelmed lungs.  Her mouth moves, whispering your name too softly for anyone but you to hear, and her hands slide down her hips, around her thighs, and past the petals of her pussy.' );
		EngineCore.outputText( '[pg]The sight of Vala, subdued eyes clenched and delirious mouth agape, utterly drenched in your cum, jilling herself off with both hands as she cries out your name is just too much.  You shift the grip on the hand holding your flow back and begin jerking yourself with both fists, bucking in the air as if to add force to your frenzied strokes.  Your body complies immediately, a rush of liquid heat pouring past your hands, torrential loads visibly bulging outward as they gush from your loins.  As the jetting spray bursts from your [cock] in an unbroken stream, you cry out Vala\'s name, rousing her from the drugged stupor.  Your alabaster cream rains down on the fairy\'s face and she screams with pleasure, mouth filling with cum so quickly that it gushes out the sides of her gleeful smile.  Her back arches in euphoria, giddy exhilaration fueling her own gasping, squirming orgasm as her fingers dig joyously into her honey-drooling cunny.  You pump out what feels like gallons of seed, basting Vala head to toe until her semen-lacquered body seems glued to the floor.  She happily scoops your jizz from between her legs and into her pussy before shivering and squeaking, her chest huffing as she cums again.' );
		EngineCore.outputText( '[pg]You keep stroking your [cock] for a minute or two afterwards, feeling utterly drained and begin to reach down to help Vala up when you notice she hasn\'t stopped her quivering, every muscle in the girl\'s body shaking with the trance-like bliss of her climaxes.  It seems the fairy is going through a protracted orgasm to rival your own, swooning in a paradise of her hero\'s sticky passion.  Rather than interrupt the fairy\'s cum-soaked reverie, you opt to let her enjoy every last minute of it.  You leave her with a cheerful kiss on the forehead as you discretely exit the back room.  As you go, the taste of your salty jizz mingles with the girl\'s own sweet flavor to breed waves of tingling euphoria that washes away your weariness.' );
		//[End Encounter][Cum production up, Fatigue removed];
		if( CoC.getInstance().player.cumQ() < 2000 ) {
			CoC.getInstance().player.cumMultiplier += 6;
			if( CoC.getInstance().player.balls > 0 ) {
				CoC.getInstance().player.ballSize += 0.5;
			}
		}
		CoC.getInstance().player.cumMultiplier += 2;
		if( CoC.getInstance().player.balls > 0 ) {
			CoC.getInstance().player.ballSize += 0.3;
		}
		CoC.getInstance().flags[ kFLAGS.VALA_CUMBATH_TIMES ]++;
		CoC.getInstance().flags[ kFLAGS.VALA_TIMES_CONSENSUAL_SEX ]++;
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'lib', -1.5 );
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	//Big Vala Intro;
	Dungeon2Supplimental.prototype.valaBigYou = function() {
		EngineCore.clearOutput();
		CoC.getInstance().flags[ kFLAGS.TIMES_VALA_CONSENSUAL_BIG ]++;
		CoC.getInstance().flags[ kFLAGS.VALA_TIMES_CONSENSUAL_SEX ]++;
		//{FIRST TIME};
		if( CoC.getInstance().flags[ kFLAGS.TIMES_VALA_CONSENSUAL_BIG ] === 1 ) {
			EngineCore.outputText( 'Tilting your head, eyes glowing with ethereal power, you answer, "<i>I want you... big.</i>"' );
			EngineCore.outputText( '\n\n"<i>Smooth one, Champ,</i>" Shouldra chuckles inside you.' );
			EngineCore.outputText( '\n\nVala claps her hands together and cheers, "<i>Awesome!  Just let me get someone to watch my shift for me.  We should probably do this at your camp, so we don\'t destroy half the city!</i>"  She turns away from you and calls, "<i>Hey!  Mary!  Remember the favors you owe me for covering while you hooked up with Chad?  Well, I\'m calling them in now.  I need you to cover my shift while I\'m out with [name].  It\'ll only be an hour!</i>"' );
			EngineCore.outputText( '\n\nThe other girl, who can only be Mary, nods resolutely.  Vala kisses you on the cheek and grabs your hand in a death-grip, pulling you out the door in a rush, her fluttering wings vibrating against your nose and kicking up clouds of faerie dust.  You wind up sneezing a few dozen times from the hurried pace she sets, but before you know it, you\'re at the edge of camp with Vala spinning around, barely containing her excitement.  Her big, pink eyes stare at you as she asks, "<i>So uh, how do we do this?</i>"' );
			EngineCore.outputText( '\n\nSmiling, you lean back and mouth, "<i>Shouldra?</i>"' );
		}
		//{REPEAT};
		else {
			EngineCore.outputText( 'You tell Vala just how HUGE your need for her is, which earns you a blush from the petite faerie\'s fair cheeks.  She calls in a favor from another waitress - looks like Vala covered for this one\'s tryst with Chad as well.  That Chad guy must get around!' );
			EngineCore.outputText( '\n\nIn any event, the two of you leave the city for camp, where a giant, sexually-charged faerie is less likely to damage anything.  ' );
			if( EngineCore.silly() ) {
				EngineCore.outputText( 'The last thing you need is a bunch of winged archers taking potshots at Vala while she clings to a tower with you in her hand...  ' );
			}
			EngineCore.outputText( 'She seems to know the way directly to your camp, and all too soon, you\'ve reached your place of residence.  Vala cheekily pokes your [chest] and asks, "<i>Shouldra?</i>"' );
		}
		//{MERGE};
		EngineCore.outputText( '\n\n"<i>I wondered how long you\'d make me wait...</i>" comes the ghostly answer, fading from your mind even as the ephemeral traces of Shouldra\'s ectoplasmic form slide free of your own.  Vala gasps as the ghost-girl\'s hands wrap around her breasts, whispering words of magic with breathless intonations while she absorbs into Vala\'s pert, fae body.  The bouncing tits before you begin to expand even as Shouldra vanishes.  The newly-possessed woman gasps with unholy pleasure, seizing her nipples in her hands as they expand.  She rhythmically tugs them, almost compulsively.  Her fair skin quickly tints rose, gradually taking on a sweaty gloss as her ardor rises to unmanageable levels thanks to your ghostly friend.' );
		EngineCore.outputText( '\n\nVala\'s eyes glow amber, her mouth muttering more nonsensical words as Shouldra takes full control of her faculties, for now.  The ghost continues her breast assault, even once the faerie\'s taut nipples swell beyond her reach.  Vala\'s clothing tears apart under the strain, her swelling bust splitting the elegant dress at the seams before her body\'s unchecked growth shreds the remaining fabric into silken tatters.' );
		EngineCore.outputText( '\n\nWith her spell complete, Shouldra steps back, the glow fading from the winged slut\'s pink eyes to reveal lust-dilated pupils with droopy, complacent eyelids.  Vala pants with a wet, hot gasp that feels like a gusting wind, growing louder as her mouth - no, her whole head - expands.  Her torso fills out at a matching pace, slowly catching up to her still-engorging boobs, which have long since come to rest upon the ground.  Giant-sized droplets of fluid drip from between Vala\'s thighs as her arousal increases with her.  The trickle of dainty fluids turns into a spattering stream.  Her legs expand out past you on either side as the faerie passes twice your height, finally lifting the heaving globes up from their gravity-forced compression.' );
		EngineCore.outputText( '\n\nThe enhanced faerie giggles down at you from over her plus-sized mammaries in between moans.  "<i>Oh, [name], I feel a bit light-headed,</i>" she giggles, drunk with the empowering sensations.  She\'s already three times your height, with the smooth skin of her thighs thickening to either side of you.  You take a step back when the gushing lube winds a small stream by your [feet].  The cracked earth around you is rapidly turning into mud, and you grab onto Vala\'s knee for support.  Shouldra\'s phantasmal voice chuckles, "<i>I hope you know what you\'re getting into, Champ.  Don\'t think I\'m done when she finishes growing!</i>"' );
		EngineCore.outputText( '\n\nVala reaches down between her legs and begins to piston a finger inside herself, the digit easily as wide as both your arms combined, yet, in her sloppy, oozing cunt, it\'s barely big enough.  Slowly, her growth diminishes, only fading once she\'s tall enough to make you question if you could even measure her height.  Her voice echoes out with enough force to vibrate through you, "<i>Ha!  I\'d like to see the imps try anything now!</i>"  Of course her words still maintain their girlish pitch, something made more clear when she stoops down to circle surprisingly delicate fingers around your waist before lifting you in front her face.  Her glistening lips, cute nose, and big, pink eyes dominate your view.  What do you ask her to do?' );
		//[Dom Me] [Lick Me];
		EngineCore.menu();
		EngineCore.addButton( 0, 'Dom Me', this.bigValaDomsPC );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.addButton( 1, 'Lick Me', this.bigValaLicksOffDudes );
		}
		if( CoC.getInstance().scenes.vapula.vapulaSlave() && CoC.getInstance().player.gender > 0 && (CoC.getInstance().player.hasCock() || (CoC.getInstance().player.hasVagina() && CoC.getInstance().player.hasKeyItem( 'Demonic Strap-On' ) >= 0)) ) {
			EngineCore.addButton( 2, 'Dom Vapula', this.valaDommyVapula3Some );
			EngineCore.addButton( 3, 'Vapula3Some', this.valaLoveyVapula3Some );
		}
	};
	//Big Vala: Dom Me;
	//Put PC on ground to make serve her orally.;
	Dungeon2Supplimental.prototype.bigValaDomsPC = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Vala tilts her head to the side, causing a gust of displaced air to blow your ' + Descriptors.hairDescript() + ' wildly.  "<i>Giving the maiden a chance to lead?  You\'re so sweet!</i>"  She tickles your chin with one immense fingertip.  "<i>But you had better give it your all, you adorable rascal, you.</i>"' );
		EngineCore.outputText( '\n\nYou\'re gently placed on the ground between Vala\'s legs.  Looking back, you see her cross her ankles behind you while her thighs swing closer.  With no escape and the walls of your prison rapidly closing around you, the only way you can go is forward.  You slip and slide on the torrent of girl-cum that drizzles out from the gigantic faerie\'s cave-sized twat, holding onto her thighs to stay upright during your trek, lest you faceplant into cum-mud.' );
		EngineCore.outputText( '\n\n"<i>Better hurry, Hero, if you don\'t want to be crushed!  Your prize is so close!</i>" Vala giggles, eventually pushing your [butt] with a finger to spur you along.  Reaching the ingress of her gushing pussy, you embrace the quivering, puffy edifice, the lurid lubrication slicking you from head to toe, pouring in through every crack and seam in your [armor].  A tremendous clap echoes from behind you, and you turn to see that her thighs have finally scissored closed.  You can feel the pliant flesh pressing in on you from both sides, holding you tight to the inviting lips even as the warm juices run down your [legs].  Beads of her slick moisture roll down your neck and arms, and you\'re forced to breath in nothing but air laced with her scent.' );
		EngineCore.outputText( '\n\n"<i>Lick,</i>" comes the booming command, her voice quivering with delight and embarrassment.' );
		if( CoC.getInstance().flags[ kFLAGS.VALA_HEALED_HONEY ] === 0 ) {
			EngineCore.outputText( '"<i>If you do a good job, I\'ll let you taste a pure pearl of my own,</i>" she giggles.' );
		}

		//{Male:};
		if( CoC.getInstance().player.gender === 1 ) {
			EngineCore.outputText( '\n\nShuddering from the onslaught of female pheromones, you find your body responding without meaning to.  [EachCock]' );
			if( CoC.getInstance().player.lust >= 70 ) {
				EngineCore.outputText( ', already hard, begins to bead with pre-cum, mixing with the slut-leakings that have found their way under your equipment.' );
			} else {
				EngineCore.outputText( ' stiffens immediately to a full, throbbing hardness.' );
			}
			EngineCore.outputText( '  Your body is imminently ready for breeding, erect and wanting so badly to be freed from your constricting garb, but you know that with what you asked, you won\'t get to sate it.' );
			if( CoC.getInstance().player.biggestCockArea() >= 150 ) {
				EngineCore.outputText( '  If only you weren\'t so big - you can\'t expand to your full size, and the tightness is almost emasculating at how it constrains your size, keeping you small enough to fit inside your [armor] but still hard as a stone, only this stone is having the pre squeezed out of it.' );
			}
		}
		//{Female:};
		else if( CoC.getInstance().player.gender === 2 ) {
			EngineCore.outputText( '\n\nShuddering from the onslaught of lusty pheromones and the humiliating situation you\'ve sent yourself into, you find your body beginning to flush in its own arousal.  You inhale deeply of the lusty cunt-scent, letting your own feminine delta begin to moisten in reciprocation.  ' );
			if( CoC.getInstance().player.wetness() >= 3 ) {
				EngineCore.outputText( 'Your [vagina] seems to always be wet, but now, with this sight before you, your girl-cum is running in rivers down your [legs] to mix into the puddling lady-spunk below.  ' );
			}
			EngineCore.outputText( 'Your armor seems tight and constricting against your rock-hard [nipples].  It\'s something you can\'t escape from, and with each passing moment, the sensations coming from your chest seem more and more worrisome, stoking your fiery lust to an incredible degree.' );
		}
		//{Herm:};
		else if( CoC.getInstance().player.gender === 3 ) {
			EngineCore.outputText( '\n\nShuddering from the onslaught of lusty pheromones, you find [eachCock] responding even before you realize what\'s going on.  ' );
			if( CoC.getInstance().player.lust >= 70 ) {
				EngineCore.outputText( 'You may have already been uncomfortably hard, but you start leaking pre-cum all over the inside of your [armor].  Of course, the copious fem-jizz that\'s already seeped inside your gear absorbs the extra fluid with little to no complaint.' );
			} else {
				EngineCore.outputText( 'You get hard with alarming rapidity.  Being so close to such a gloriously large quim seems to overpower your better sense, and you\'re forced to give in to your body\'s imperative.' );
			}
			EngineCore.outputText( '  Inside your undergarments, everything is already turning into a swampy, slimy mess thanks to Vala\'s secretions, and your own feminine drippings don\'t help any.  Your lips and dick' );
			if( CoC.getInstance().player.cockTotal() > 1 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ' are smothered with the stuff, making you moan without meaning to.' );
			if( CoC.getInstance().player.biggestCockArea() >= 150 ) {
				EngineCore.outputText( '  If only you weren\'t so big!  You\'re compressed so tightly by your enclosing [armor], and even though you\'re rock-hard, you\'re a fraction of your full size.  If only you could get out of your gear and fuck her!' );
			}
		}
		//{Genderless};
		else {
			EngineCore.outputText( '\n\nShuddering from the onslaught of lusty pheromones and the humiliating situation you\'ve sent yourself into, you find your body beginning to flush its own arousal.  You take in a breath of the lusty cunt and wish you had one of your own.  Nevertheless, your [asshole] feels noticeably empty, and you wish you had something to slide up inside you so that you could achieve the release you so crave.  Instead, you\'re left to feel the faerie\'s juicy wetness sliding all over you inside your [armor], a soupy lubricant that makes you ache even more.  Instead, you\'ll have to focus on serving her entrance...' );
		}
		//{CONTINUE};
		EngineCore.outputText( '\n\nYou grab hold of the fleshy folds and slowly spread them apart.  They seem like immense, engorged curtains.  A web of lubricant dangles between them, each juicy strand smelling strongly of her imminently feminine scent.  Figuring there\'s nowhere to start but the entrance, you begin to lick up and down her right lip, tasting the tang of her sweat mixed with the sweeter flavor of her sex.  The compressing walls of flesh on either side combine with her relaxing entrance to gently slide your [legs] inside her slippery entrance.  You redouble your efforts in light of that, stuffing a hand inside her and beginning to rub along the almost frictionless walls.  They pulse hungrily at your intrusion, gently undulating around your gently pumping legs.' );
		EngineCore.outputText( '\n\nVala moans, "<i>Oh yeah, keep at it, Hero,</i>" while she presses against your back with a finger, grinding your [face] all over the puffy lip you\'ve been worshipping.  "<i>Right there...</i>" she gasps, trailing off into a hum of bliss.  Your left shoulder slides in before you know, but you suppose that just lets you do your job better.  Her secretions are flooding your mouth with tasty girl-juice, forcing you to swallow in between long laps and sensuous kisses.  She seems to like it, but your size prevents you from polishing every inch with your tongue, so you simply slide your face all over the soft, pillowy pussy-lip, using your nose and facial contours as a ribbed pussy-massager.  You hum while you do it, pressing your [chest] into her sensitively as you start humping her entrance while fully clothed, your [butt] sliding along the interior of her left side.' );
		EngineCore.outputText( '\n\nYour head bumps into something hot, firm, and pulsing, eliciting a gasp of surprised pleasure from the faerie.  You crane your head and realize it\'s Vala\'s plump pleasure-buzzer, thicker than your arm and at least a foot long, protruding out from its clitoral hood.  You grab hold of her mound and lift yourself up to it with her clenching pussy\'s pleased undulations assisting you, just high enough that you could kiss the underside.  Instead, you open wide and suck the tip inside of your mouth.  At first contact with you, the silken tunnel that hugs at everything below your shoulders begins to tremor with spastic delight, muscular contractions wringing you from [legs] to your [hips] and down to your [feet] again and again.  You endure the constriction with frenetic focus, knowing that if you don\'t want that hungry cunt to swallow you whole, you had better set it off fast.' );
		EngineCore.outputText( '\n\nVala gasps, "<i>A-ah!  S-suck on my pearl, tiny fairy!  Take it into your - oh! - mouth and feel the c-c-corr-UP!  UP!  Corruption wash from you!  Bathe in my crystal honey!</i>"  You pull yourself up onto her buzzer with burning arms and swallow it whole, obeying immediately.  You were already aroused at the sight of her immense tunnel, but to be so... intimately engulfed in it and massaged with such dexterous, natural skill is overpoweringly erotic.  You feel her clit bumping against your tonsils at the same time that slick moisture rolls all over you, from shoulders to [feet], inside your [armor] and out.  She\'s gushing all over you, and you\'re wiggling your [hips] senselessly, starting to moan into her clit as she rides you like a living, clit-sucking dildo.' );
		EngineCore.outputText( '\n\nAn ear-splitting shriek of excitement hits you, and the fevered movements of Vala\'s interior redouble, sucking your whole body hard, pulling you deeper and deeper inside, hard enough that her clit almost pulls out of your maw.  You hold for dear life, fiercely afraid of disappearing into her womb and simultaneously aroused enough that your own body is shaking wantonly, lewdly vibrating your own body inside her as you slam your groin against her walls again and again.  Orgasmic pleasure hits you, robbing you of strength.  Your hands lose their grip and suddenly, you feel yourself slipping into her, her plush lips closing around your head so that all you can see is the faint, pink-tinged light that penetrates through you.  It slowly diminishes as you pass deeper, and with strength born of terror, you stretch up to grab her clit, the only hand-hold you can reach.' );
		EngineCore.outputText( '\n\nAs soon as your hands clench onto that rigid little rod, the vaginal walls that surround you go wild, slamming you back and forth for a moment until a wave of girlish lubricant wells up from inside her.  It floods the cavernous twat with moisture, and you\'re actually carried out on the lady-spunk scented tide, riding the clear geyser you wash out onto the ground.  Vala\'s thighs long since spread wide and began to shake and tremble wildly.' );
		EngineCore.outputText( '\n\nShouldra pops out of Vala\'s belly, asking, "<i>Like what I did with her pussy, Champ?  They\'re so much more fun when they\'re pulling you into their welcoming wetness, don\'t you think?</i>"  She smirks at the look in your eyes and flies into you, her comforting, familiar presence reappearing in the back of your mind.  "<i>Oh wow, Champ, did you get off on that?  You did - you horndog you!  I should\'ve rode that one out inside you!</i>"' );
		EngineCore.outputText( '\n\nWhile you stand there, dripping sexual juices, Vala gradually starts to diminish in size.  Sadly, her breasts seem to return to normal faster than the rest, which leaves her disproportional while she journeys towards her normal shape.  She\'s still locked in climax, leaking an ever-shrinking amount of fluid.  The smaller she gets, the faster her change progresses.  Then, with an alarming abruptness, she flops down in the lake of lady-spunk she left behind, moaning pleasantly.' );
		EngineCore.outputText( '\n\nYou lift her up out of the mess and carry her to the stream where you both clean up.  Vala murmurs, "<i>My hero...</i>" as you wash her, too wiped out to do it herself.  Vala recovers by the time you\'re getting re-dressed, and she gives you a surprisingly chaste, blushing kiss before she gets ready to depart.  The faerie seems to have some degree of magical affinity, as she\'s able to knit her dress back together with a bit of mental effort, and then she\'s fluttering away, calling out her goodbyes to you as she journeys back to Tel\'Adre.' );
		CoC.getInstance().player.slimeFeed();
		CoC.getInstance().player.orgasm();
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	//Big Vala: Lick Me (Requires Penor);
	Dungeon2Supplimental.prototype.bigValaLicksOffDudes = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Giant Vala cocks an eyebrow at your request in surprise.  "<i>But, what if I accidentally swallow?  I couldn\'t live with myself if something should happen to my big... er, little Hero.</i>"  She pats you on the head affectionately, unsure of how to handle herself with all of her newfound size.' );
		EngineCore.outputText( '\n\nYou comfortingly stroke her hand and reassure her that you want nothing more than to slide yourself in her mouth and feel her gigantic tongue sliding all over you, licking all of you like a popsicle until you can\'t take it anymore.' );
		EngineCore.outputText( '\n\nVala seems somewhat intrigued by the way you\'re putting it, but her worried brow furrows deeper, fretting about what could go wrong.  The familiar glow of your ectoplasmic friend appears in Vala\'s eyes for a split second, and her lips suddenly begin to inflate, puckering on their own into what can only be described as a cock-sucking \'o\'.  Their surface begins to shine with unnatural lubrication, glossy with slippery promises of sensuous caresses and orgasmic pleasure.' );
		EngineCore.outputText( '\n\n"<i>What did you dtho tho mee?</i>" Vala whines as her tongue pokes out to test the newly swollen flesh, sliding across the immense, pillowy lips on its own.  Her grip on you slackens as she shudders with pleasure, eyes rolling halfway back before she lets out a sugary, pleasure-addled moan.  "<i>Okthay, okthay... jusht... be careful!</i>"  She sets you down before the act of speaking makes her moan any harder, actually pushing you on to your back and fumbling around your [armor] on her own, trying to take it off.  You try to help, but her eager, shaking fingertips keep getting in the way.  You can see she hasn\'t stopped licking her lips or moaning through the puffy maw she calls a mouth, and once she finally gets a fingernail into your equipment, she tears it off you and tosses it aside.' );
		EngineCore.outputText( '\n\nThe mountainous pixie lifts you up to her lips with a smile, or as much of one as she can manage at the moment, with her tongue drooling out the corner of her mouth.  Slowly, almost tentatively, she brings you closer and closer to her open pucker, her movements so slow and deliberate that it seems she\'s both afraid to do it and stubbornly insistent on this course of action at the same time.' );
		EngineCore.outputText( '\n\nYour [foot] hits her plush, lower lip, feeling the warmth of her breath flowing over your body.  Her lust-lidded eyes gaze down at you worshipfully as she moans across you, gingerly slipping your [feet] across her lubricated mouth and into the saliva-filled cavity behind.  They come to rest on her tongue, which eagerly slithers around your [legs] and [hips] before winding to your [chest], flicking each of your [nipples] in turn along the way.' );
		if( CoC.getInstance().player.hasFuckableNipples() ) {
			EngineCore.outputText( '  It even pauses at one to slip a tiny bit inside, too big to penetrate your nipplecunt properly but teasing it all the same.' );
		}
		EngineCore.outputText( '  Finally, it encircles the back of your neck and curls up to slide across your chin.  You greedily slurp the tip of her oral muscle into your own mouth, and the effect is immediate.' );
		EngineCore.outputText( '\n\nVala whimpers around you hard enough to vibrate through your whole body.  Her tongue pulls you partway into the wet heat you\'re feeling down south, still moaning even as her newly hypersensitive oral organ slips around the back of your [legs], curling all the way to the base of your [hips].  [EachCock] presses proudly against her upper lip, and the soft cushion of her flesh smushes comfortingly around ' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 'each' );
		} else {
			EngineCore.outputText( 'your' );
		}
		EngineCore.outputText( ' length, unholy smoothness sliding ever so slowly back and forth as she moans.  The giant faerie drags you further inside, much to your delight.  Agonizingly sensuous pressure mounts all along your length' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 's' );
		}
		EngineCore.outputText( ' until ' );
		if( CoC.getInstance().player.cockTotal() === 1 ) {
			EngineCore.outputText( 'it slides' );
		} else {
			EngineCore.outputText( 'they slide' );
		}
		EngineCore.outputText( ' inside her' );
		if( CoC.getInstance().player.biggestCockArea() >= 200 ) {
			EngineCore.outputText( ', the immense length sucked in by a surprising burst of suction' );
		}
		EngineCore.outputText( '.' );
		EngineCore.outputText( '\n\nExcitedly, the happy slut pulls you the rest of the way inside, leaving nothing exposed save for your head.  Vala takes care to guide you away from her teeth, rolling your body across her sensitive, bimbolicious lips and immensely pleasurable, well-coordinated tongue that even now is wrapping around you again, curling around your body from both sides in a pliant, moist embrace.  The foggy heat of her breath and body washes over your whole form, and combined with the coils sliding over every part of you, ' );
		if( CoC.getInstance().player.biggestCockArea() < 200 ) {
			EngineCore.outputText( 'smothering your relatively tiny pecker' );
		} else {
			EngineCore.outputText( 'wrapping up your immense pecker' );
		}
		if( CoC.getInstance().player.biggestCockArea() >= 400 ) {
			EngineCore.outputText( ', even as it hangs partway down her throat' );
		}
		EngineCore.outputText( ', you begin to moan as well, subsumed in steamy pleasure.' );
		EngineCore.outputText( '\n\nThe tongue surrounding your body begins to twirl faster and faster, pumping at you mercilessly.  Somehow, the tip of the muscled organ finds an opening above your legs and pokes at your [vagOrAss], and it pokes through the tender entrance before you can give voice to a single gasp.  Worming deep inside you, mercilessly licking, and vibrating softly with each exhalation, the mass of muscle has you dripping all over it, [eachCock] a willing participant in bringing you to the very height of pleasure.  You twitch and writhe inside it, [hips] futilely trying to pump and fuck, but there\'s no way you can possibly move.' );
		EngineCore.outputText( '\n\nSuddenly, you\'re unwound and left face down on the flat meat of her tongue' );
		if( CoC.getInstance().player.biggestCockArea() >= 400 ) {
			EngineCore.outputText( ', cock partway down her throat' );
		}
		EngineCore.outputText( '.  Staring down between the canyon of her cleavage, you can see the river of girlcum below and smell the lurid scent that wafts up from it.  Freed from the squishy grip of her oral embrace, you reach out your arms, stretching them to feel Vala\'s lips, rubbing over the smooth, yielding surface.  The massaging stimulation brings a gurgling purr to her throat, so you keep doing it, while you begin to hump her taste buds, the slippery, dimpled texture of her tongue just what you need.  Again and again, you drag [eachCock] over her smooth oral muscle, and soon you know you couldn\'t stop if you wanted to.  You\'re sure you must look a mess, a head hanging out of the giantess\'s lips, moaning like a whore while you try to mate with her tongue.' );
		EngineCore.outputText( '\n\nHer spit froths and bubbles around you, stirred up by your own frenzied motions.  You cry, "<i>Gonna cum!</i>" a moment before the pleasure morphs your voice into a ragged, exultant cry.  Your own liquid heat boils up from within you' );
		if( CoC.getInstance().player.balls > 0 ) {
			EngineCore.outputText( ', [balls] clenching against Vala\'s tongue' );
		}
		EngineCore.outputText( ' as you explode into ecstatic, jerking pumps against her slippery, sensitive tongue.  Vala\'s voice rises with yours the moment the first spurt of seed stains her tongue, and her fem-cum sprays out to soak her thighs with enough force to carry some smaller boulders away in the tide.' );
		if( CoC.getInstance().player.cumQ() < 250 ) {
			EngineCore.outputText( '  She barely notices the spunk you shoot against her tongue, her drooling saliva washing it away almost immediately, but you\'re sure she got a nice, salty thrill from it regardless.' );
		} else if( CoC.getInstance().player.cumQ() < 1000 ) {
			EngineCore.outputText( '  She has to noisily gulp down the liquid deposit you leave in her mouth, but with her enhanced size, it\'s still no more than a creamy morsel.' );
		} else if( CoC.getInstance().player.cumQ() < 4000 ) {
			EngineCore.outputText( '  You slowly flood her mouth with spooge until her cheeks bulge.  The spooge inundates her maw until your lower body floats in it, forcing the girl to swallow hard or risk having the teeming seed spill out around you.' );
		} else {
			EngineCore.outputText( '  You immediately flood her mouth, bulging her cheeks with obscene amounts of spunk.  She noisily gulps, mouth working futilely to handle it all, but it\'s not enough, and jizz begins to burst from the corners of her mouth, almost pushing you out with it.' );
		}
		EngineCore.outputText( '  Her tongue grinds back and forth underneath you, encouraging you to deposit every single drop into her.' );
		EngineCore.outputText( '\n\nOnly after your orgasm has faded and your body is sagging weakly on Vala\'s palette does her own orgasm conclude.  She gingerly extracts you from her mouth, panting as her lips slowly de-puff, returning to normal size (for a giantess).  The faerie leans back, still gasping, dropping you on her tit, which you use to slide down to the ground after catching yourself on her nipple.  The immense form begins to shrink behind you almost as soon as you get off it, the ghost exiting her body and surging into yours in a flash. Shouldra\'s familiar presence gives you a mental wink and a breathless sigh - she clearly enjoyed it as much as you.' );
		EngineCore.outputText( '\n\nWhile you stand there, dripping oral juices, Vala diminishes further.  Sadly, her breasts seem to return to normal faster than the rest, which leaves her disproportional while she journeys towards her normal shape.  The smaller she gets, the faster her change progresses.  Then, with an alarming abruptness, she falls flat in the lake of lady-spunk she left behind, moaning pleasantly.' );
		EngineCore.outputText( '\n\nYou lift her up out of the mess and carry her to the stream where you both clean up.  Vala murmurs, "<i>My hero...</i>" as you wash her, too wiped out to do it herself.  Vala recovers by the time you\'re getting re-dressed, and she gives you a surprisingly chaste, blushing kiss before she gets ready to depart.  The faerie seems to have some degree of magical affinity, as she\'s able to knit her dress and your [armor] back together with a bit of mental effort, and then she\'s fluttering away, calling out her goodbyes to you as she journeys back to Tel\'Adre.' );
		CoC.getInstance().player.orgasm();
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	//Intro to Vala + Vapula Threesomes;
	Dungeon2Supplimental.prototype.valaVapulaThreesome = function() {
		//{First Meeting} ;
		CoC.getInstance().flags[ kFLAGS.TIMES_VAPULA_AND_GIANT_VALA ]++;
		if( CoC.getInstance().flags[ kFLAGS.TIMES_VAPULA_AND_GIANT_VALA ] === 1 ) {
			EngineCore.outputText( 'Crossing your arms, you call out to summon your pet succubus from wherever she\'s lurking at the moment.  Vapula comes frolicking up almost instantaneously before stopping mid-stride, curvy thighs quivering and mouth-gaping.  "<i>T-there\'s a gigantic... faerie?!</i>" she asks incredulously while slowly turning to face you, her [master].' );
			EngineCore.outputText( '\n\nYou cackle gleefully at the sight.  This is perhaps the most anything has ever surprised your violet sex-pet, and you revel in the moment while her brain tries to cope with what she\'s seeing.  Behind you, Vala shrieks, gasping out, "<i>There\'s a demon, here!?</i>"  You spin about in time to see the immense pixie cradling her breasts and vagina, as if she could somehow conceal her modesty or lusty state simply by covering the offending organs with her once-petite palms.  You place a comforting hand on Vala\'s gargantuan thigh to try and comfort her; big as she is, she barely feels it.  Her pink-tinted eyes focus on you as she queries, "<i>What is a demon doing here?!</i>"' );
			EngineCore.outputText( '\n\nPutting on your most charming smile, you tell her that Vapula is YOUR demon.  You broke her of her domineering ways and brought her here to serve you with her numerous skills, and besides, you figured Vala might like the opportunity to take revenge on a demon her way.  During this, Vapula seats herself before you, one hand stroking your thigh encouragingly.  You pat her head and say, "<i>Come on Vala, I\'ll make sure Vapula does whatever you say, won\'t you my little, submissive demon-whore?</i>"' );
			EngineCore.outputText( '\n\nVapula nods eagerly, though she does dare to ask, "<i>How will this feed me?</i>"' );
			EngineCore.outputText( '\n\n"<i>If you ever want to feed again, you had better do whatever my faerie friend wants of you,</i>" you reply.' );
			EngineCore.outputText( '\n\nVala is understandably taken aback by this, but she gradually removes her hands from her erogenous zones.  "<i>I guess if you say it\'s okay...</i>" she mumbles, still a bit worried.' );
		}
		//{Repeat}e;
		else {
			EngineCore.outputText( 'You call for Vapula, which brings an amused smile to your giant faerie\'s face.' );
			EngineCore.outputText( '\n\n"<i>Bringing back my favorite purple dildo?</i>" Vala asks with unmistakable enthusiasm just as Vapula comes up from behind a rock, an unmistakable spring in her step.  As soon as she sees the immense pixie, she stops in her track and growls, "<i>This isn\'t a feeding call, is it?</i>"' );
			EngineCore.outputText( '\n\n"<i>Nope,</i>" you answer, forcing her to her knees next to you.  You both look up at Vala, who\'s smiling eagerly and dripping like a sieve.' );
		}
	};
	//Giant Vala + Vapula Threesome - Vala Dommy;
	Dungeon2Supplimental.prototype.valaDommyVapula3Some = function() {
		EngineCore.clearOutput();
		this.valaVapulaThreesome();
		EngineCore.outputText( '\n\nWith her mind made up, Vala grabs hold of the surly demoness.  Then, leaning over your camp, she grabs a length of rope from your supplies, holding it as you would a length of twine.  She quickly loops it around the demoness, tightly restraining Vapula from her pointed heels up to her big, bouncy succubi-tits.  The tainted tart\'s arms are lashed tightly to her sides before she\'s caught on to what exactly is going on, crude rope compressing her forgiving flesh erotically, setting Vapula\'s glorious, corrupted cunt to dripping.' );
		EngineCore.outputText( '\n\n"<i>Hey, what are you doing?</i>" the smaller woman cries as she struggles against the bonds.' );
		EngineCore.outputText( '\n\nVala lustily replies, "<i>Well, you\'re a succubus, right?  I\'m about to let you feel the <b>biggest</b> orgasm you\'ve ever experienced, but if you\'re left free, you might damage something with those nails or heels of yours!</i>"  She titters at her own awful pun as she ties the knot and finishes restraining your demonic whore, leaving her dangling upside down from a few feet of excess.  Apparently the former sex slave has retained some of the lessons in bondage her captors drilled into her.' );
		EngineCore.outputText( '\n\nVapula cries, "<i>No!  [Master], help!  She\'s... she\'s going to use me like a living dildo!</i>"' );
		EngineCore.outputText( '\n\nYou don\'t even deign to answer her frenetic protests.  Instead, you content yourself with getting naked, giving the faerie a slight nod to indicate you\'re totally fine with how things are progressing.  All the curvy female flesh on display certainly has a pleasant flush spreading across your ' + CoC.getInstance().player.skin() + ', so you seat yourself and tend to your stiffening nipples, slowly tugging and squeezing them while you watch the giantess play with her prey.' );
		EngineCore.outputText( '\n\nVapula swings around like an out-of-control pendulum, eventually slamming face-first into Vala\'s cleavage when the flirtatious pixie lifts her higher.  The cushiony, drug-enlarged breasts squish and jiggle noticeably around the squealing, purple package before closing in around her, compressed into a squeezing vice by Vala\'s elbows.  Vapula\'s heels wiggle above the fair valley before stopping abruptly.  A moment later, a trickle of what can only be feminine moisture begins to trail out from the pixie\'s underboobs.  The pixie gingerly pries her tits apart, just wide enough that you can see the succubi inside making out with Vala\'s supple skin, her whorish, purple lips worshipping at the mammary altar before her.  The demoness\'s juicy cunt is exuding so much moisture that it\'s dripped down her suspended body, slicking her with moisture and turning her hair into a matted, dripping mess.' );
		EngineCore.outputText( '\n\nVala pokes the purple woman\'s bubbly backside to rouse her from her tit-worshipping daze and regretfully separates her from the creamy faerie-tits, dragging her along to one of the torso-sized areolas.  Vapula\'s tail grabs hold of one to arrest her motion, hands digging into the swollen, pebbly nub hard enough to make the larger girl cry out in pleasure.  Getting the idea, the demoness pulls her face down onto it and opens her mouth inhumanly wide, slurping and suckling at the nipple with wanton abandon.  A torrent of creamy faerie-milk fills the corrupted woman\'s maw, a sweet treat for the hungry demon.  The audible slurps intensify until the giant mound is quivering uncontrollably on the squirming fae, trembling so ecstatically that she pulls her taut bud free of the diminutive demon\'s gullet.' );
		EngineCore.outputText( '\n\nVala teases, "<i>Are you ready, little demon?  I like you, so I think I\'ll have to keep you in my cave and fuck you a bunch!</i>"  It\'s a rather familiar sentiment, and before Vapula can complain, gigantic hands wrap around the purple-skinned girl\'s heels, a single finger curling under the smaller woman\'s back to support her.  The captive is almost immediately stuffed into Vala\'s immense, gushing gash, making a high-pitched squeal that\'s almost instantly muffled by the puffy pussy lips that now envelop her head.  She\'s plunged in bodily, only her heels left protruding from the moist entrance.  Vala\'s entrance undulates with slow, pleasant contractions around the intruding form while discharging even greater quantities of lubricant.' );
		EngineCore.outputText( '\n\nThe erotic sight beckons to you, and hearing the ludicrously loud moans coming from Vala\'s throat incites greater levels of excitement from your loins.  Stumbling up, you stagger towards the curtain-like labia with one hand ' );
		if( !CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( 'buckling on your demonic strap-on' );
		} else {
			EngineCore.outputText( 'stroking [oneCock] eagerly' );
		}
		EngineCore.outputText( ', eyes locked on the demoness\'s cum-slicked heiny and wiggling body.  The plush mound is open just wide enough that you\'re sure you could climb right in alongside your pet, which is just what you intend to do.  The closer you get, the more you\'re sure that Vapula IS enjoying herself if the muffled moans are anything to go by.' );
		EngineCore.outputText( '\n\nVala moans when you reach her lust-engorged mound and lean against it, hands sinking into the sensitive quim-skin as you examine just what\'s going on.  Vapula\'s green eyes peer up at you from out of the foggy darkness.  The air itself is so inundated with pussy-musk that it\'s actually creating a sexual fog that\'s so suffused with pheromones that you can\'t help but begin to pant once exposed to it.  Your fuck-pet seems to be begging you with her eyes and her slowly squirming body, seducing you with every erotic undulation to join her in the warm, syrupy love-canal.' );
		EngineCore.outputText( '\n\nYou climb on in with her, aided by the sucking pulsations of Vala\'s cunt.  It pulls you in almost bodily, and you grab hold of Vapula to steady yourself.  The faerie\'s silky-smooth interior squeezes down around you, vibrating with its owner\'s moans as it smushes you against the purple-skinned woman before you, two bodies slipping and sliding against each other in a sea of sloppy, sexual secretions.  Without meaning to, your ' );
		if( !CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( 'dildo' );
		} else {
			EngineCore.outputText( '[cock smallest]' );
		}
		EngineCore.outputText( ' slides into the demoness\'s waiting snatch, which slurps it down with a hungry contraction, slapping your [hips] against hers, the slippery, demonic folds wriggling around you with such insistence that you couldn\'t pull out if you want to.' );
		EngineCore.outputText( '\n\nMeanwhile, Vala\'s furious cunt-contractions are starting to come closer and closer together, each time accompanied by fresh waves of her lubricant.  Blessed warmth rises through your midsection, the familiar, pulsing sensation of an orgasm welling up within you at the same time.  You wrap your arms around Vapula to crush her against yourself, [chest] to fat, purple tits, nipples to nipples, and you kiss her, allowing her probing tongue to slither into your mouth with rapacious eagerness.  The vague, pinkish light that had illuminated the both of you vanishes, and with a glance towards the entrance, you realize Vala has her hand in front of her cunt, fingers pushing and pulling the pair of you through her wiggling cunt, likely toying with her clit as well.' );
		EngineCore.outputText( '\n\nYour [butt] is abruptly slapped by an intense, fleshy contraction, the enveloping walls conforming to your shape as they close tightly around you and Vapula.  There is no air to breath, but there is a tongue, and a pussy, both of which have your full attention.  You mate with your whorish little pet, trying to arch your back but pinned against her regardless, fountaining ' );
		if( CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( 'seed' );
		} else {
			EngineCore.outputText( 'fake seed' );
		}
		EngineCore.outputText( ' without meaning to, the lustiness of the situation just far beyond your ability to bear.' );
		if( CoC.getInstance().player.cumQ() > 500 ) {
			EngineCore.outputText( '  The demon\'s purple belly balloons with cum, swelling against your own' );
		}
		if( CoC.getInstance().player.cumQ() >= 1500 ) {
			EngineCore.outputText( ' as her midriff turns taut and dome-like' );
		}
		if( CoC.getInstance().player.cumQ() > 500 ) {
			EngineCore.outputText( '.' );
		}
		if( CoC.getInstance().player.cumQ() > 1000 ) {
			EngineCore.outputText( '  Waves of spunk pour out from Vapula\'s lust-swollen lips thanks to your exceedingly potent orgasm.' );
		}
		if( CoC.getInstance().player.lactationQ() >= 100 ) {
			EngineCore.outputText( '  Even better, your [fullChest] lets down your milk, letting it run out of you in ' );
			if( CoC.getInstance().player.lactationQ() <= 200 ) {
				EngineCore.outputText( 'thick' );
			} else if( CoC.getInstance().player.lactationQ() <= 2000 ) {
				EngineCore.outputText( 'powerful' );
			} else {
				EngineCore.outputText( 'enormous' );
			}
			EngineCore.outputText( ' streams, tinting Vala\'s secretions white.' );
		}
		EngineCore.outputText( '\n\nVala climaxes, pulling you both out as a river of fem-spunk gushes out behind you, and you and your lust-locked demoness drag across the faerie\'s enhanced pleasure-buzzer, smearing her lusty juices across her pulsating, sensitive organ while you thoroughly feed your demoness\'s insatiable cum-hunger.' );
		EngineCore.outputText( '\n\nEventually, you\'re dropped to the ground, panting for your breath while Vapula\'s tongue slowly withdraws.  You separate, realizing that during the lengthy cum Shouldra returned to you, and Vala is rapidly dwindling behind you.  The three of you have a playful swim in the stream to get cleaned up before Vala mends her clothing and goes on her way, thanking you for having the chance to feel what it\'s like to be in charge.' );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'cor', 1 );
		CoC.getInstance().player.slimeFeed();
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	//Giant Vala + Vapula Threesome - Vala Lovey Dovey;
	Dungeon2Supplimental.prototype.valaLoveyVapula3Some = function() {
		EngineCore.clearOutput();
		this.valaVapulaThreesome();
		EngineCore.outputText( '\n\nVala smiles tenderly and says, "<i>Oh, I\'ll be far gentler than the demons were with me.  Besides, you\'re way prettier than any imp!</i>"  She stretches out to touch Vapula, running a narrow fingertip (for a giantess) around each of the succubus\'s heavy breasts.  "<i>A cutie like you can\'t be nearly that mean...</i>"' );
		EngineCore.outputText( '\n\nVapula affectionately licks the faerie\'s finger, unsure of where this is going but happy to reciprocate when she\'s getting stroked so sensually.  The immense pixie grips the demon gently, lifting her up to her mouth, which even now is engorging, lips puffing out obscenely.  She gasps, "<i>Oh, tho thenthitive!</i>" before running her tongue across the new, puckered bimbo-lips Shouldra\'s chosen to gift her with, shivering from the sensations her plump puckers exude.  Then, she pops the \'small\' demon inside, savoring the unnaturally curvy woman\'s sinfully sumptuous flavor.  The only portion of Vapula still exposed to the air is her face, which even now is spreading into a dopey smile.  She lays down on the plump lower lip like a puffy pillow, cooing lustily.' );
		EngineCore.outputText( '\n\nThe playful faerie smiles down at you around your captive and asks, "<i>Thwuld \'ou wike tho join hermph?</i>"  One of her hands is languidly playing with a torso-sized nipple while she makes her query, and the other has nestled itself firmly between her thighs.  You nod, too turned on by the site and the lurid, sexual scent that hangs in the air to think of anything else.  Your [armor] falls by the wayside in a surprisingly short time' );
		if( !CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( ', and you buckle on your demonic strap-on, just in case' );
		}
		EngineCore.outputText( '.  Holding your arms out to either side, you let Vala\'s cunt-soaked hand come out to lift you, a finger under each armpit and one between your legs, slickly sliding against the sensitive, hard prong there.' );
		EngineCore.outputText( '\n\nYou\'re lifted up high, which only serves to slide ' );
		if( !CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( 'the dildo' );
		} else {
			EngineCore.outputText( '[oneCock]' );
		}
		EngineCore.outputText( ' even harder into your flawless faerie-skin, you moan out loud, matching Vapula\'s lascivious cries as she\'s mercilessly teased.  Your [feet] are brought up against Vala\'s immense lip, quickly sliding over the oral protrusion and into the steamy, warm cavern behind it.  The demon\'s shoulder brushes against your own, enough to rouse her from her sexual stupor and have her turn her head to face you.  Mischief twinkles in her lust-lidded eyes as she asks, "<i>Oh, are you going to feed me, [Master]?</i>"' );
		EngineCore.outputText( '\n\n"<i>Only because Vala\'s gotten me so hard, slut.</i>"' );
		EngineCore.outputText( '\n\nAt first, Vapula looks crestfallen by your declaration, but then her mouth opens wide, slowly exhaling a vibrating, incoherent wail of pleasure, her pupils disappearing into her skull as they roll back.  The owner of this magnificent mouth hooks part of her tongue around your [hips] and pulls you deeper.  At the same time, it rotates you and Vapula to face each other, smearing your bodies against each other in the soupy saliva and sex-juice mix that fills her mouth.  The magnificent muscle is lengthy in the extreme, coiled around both lusty bodies and heedlessly pressing you against each other, leaving you to feel warm skin and smooth tongue, always sliding wetly along your every curve.' );
		EngineCore.outputText( '\n\nThe incredible control the faerie has over her tongue allows her to pin Vapula\'s arms behind her back, twisting her to make her arch her towards you, her taut middle rubbing against your own as a juicy, demonic mound slaps into your crotch.  The purple slut moans at you, drooling over your [face] and Vala\'s lower lip, her eyes absolutely pleading for penetration as she pushes harder at you, immobilized and soaked with lust.' );
		EngineCore.outputText( '\n\nYou lick her neck, sucking hard enough to leave a hickey behind.  The demoness tilts her head back to further expose herself, aching for more.  She pleads, "<i>Fuck me, [Master]!  Feed my naughty cunt!  Use your demon whore!  Please!</i>"  Her eyes open wide as she makes her case, almost panicked in her fervor.  "<i>I NEED it... the faerie has me so close!</i>"' );
		EngineCore.outputText( '\n\nA tremendous vibration ripples through the constricting moistness of Vala\'s mouth, created by a low moan of pleasure that has your whole body vibrating.  You slip inside the demoness\'s molten-hot snatch without meaning to, but instantly, you find yourself glad you did.  The constant suckling, squeezing motions the purple pussy provides are skillful in the extreme, like one thousand tongues, each tickling at the most sensitive parts of ' );
		if( !CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( 'that exotic dildo' );
		} else {
			EngineCore.outputText( 'your [cock smallest]' );
		}
		EngineCore.outputText( '.  You grab hold of her ass and the tongue that\'s slipping through her crack and hammer your hips home, slapping against Vapula so hard that the violet woman\'s cries of bliss are interrupted by the breath-stealing impacts. ' );
		EngineCore.outputText( '\n\nVala\'s purrs come quicker and quicker while you use her mouth as a comfortable bed for your tryst, assisted by a twisting tongue that slides across your [chest], over your [butt], and around your [legs].  It flicks across your [asshole] teasingly, and the way Vapula\'s eyes suddenly pop open, you\'re sure she\'s experiencing the same thing.  You go back to necking with her, pumping her lust-puffed pussy with rough thrusts, frothing the sea of saliva until it\'s dribbling over the lips around you.  The slick bubbles slide over your faces, and you and Vapula begin to make out through them, revelling in the sticky, frictionless feeling of making love inside a giantess\'s mouth.' );
		EngineCore.outputText( '\n\nVapula moans into you, and her cunt goes into overdrive, those thousand tongues that you felt inside her all pulling on you, depositing long, licks that tug you toward her cervix.  She\'s like a starving, sexual animal, rapaciously rutting with you while Vala jills off to the mating frenzy.  Squeezing down, the purple succubus\'s entrance forms a tight ring, her inner tongues vanishing, and it begins to pump up and down so fast that all you feel is a blur of sensation stroking every portion of your pole at once.  You pin her hips against yours, burying yourself as fully inside her as you can, knowing that you\'ll cum from this in seconds, and all you need to do is savor the onrushing bliss before it explodes out of you.' );
		EngineCore.outputText( '\n\nMinutes later, you feel the cresting pleasure hit, smothering everything else in dopey, ecstatic enjoyment, a brainless, sexual climax that leaves your body shaking while you feed your succubus what she so desperately needs.  Vala obviously sees the blissed-out expressions on your faces, because not long after you start filling the demonic snatch, your host\'s heavy breathing peaks into a moan of excitement that coincides with a wave of girl-spunk below.  You\'re dimly aware of Vala creating that small river of lady-lube, but it barely registers next to the pleasant pulsations emanating from your groin, spurt after spurt of happy, nerve-shocking pleasure blasting through your form.  Even after you feel yourself coming down, her twat continues to suckle at your ' );
		if( !CoC.getInstance().player.hasCock() ) {
			EngineCore.outputText( 'spurting dildo' );
		} else {
			EngineCore.outputText( '[cock smallest]' );
		}
		EngineCore.outputText( ', ensuring that every single drop is passed into her ravenous gash.' );
		EngineCore.outputText( '\n\nYou aren\'t sure how long you stay like that, but eventually, Vala finishes with her own pleasure and sets the pair of you down on the ground, still joined together, groin-to-groin.  You\'re so sensitive from your recent orgasm that separation is almost painful.  Only after you\'re free do you realize that Shouldra slipped back into you, and Vala is shrinking down behind you.  The three of you bathe and get dressed together, Vala using some strange magic to repair her dress before she goes.' );
		CoC.getInstance().player.orgasm();
		EngineCore.dynStats( 'cor', 1 );
		CoC.getInstance().player.slimeFeed();
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	Dungeon2Supplimental.prototype.kinathisValaStuff = function() {
		EngineCore.clearOutput();
		var x = CoC.getInstance().player.cockThatFits( 50 );
		if( x < 0 ) {
			x = CoC.getInstance().player.smallestCockIndex();
		}
		EngineCore.outputText( 'With it so late at night, there are barely any patrons at the bar.  It\'s likely the bar will close up soon.  Lounging in one of the empty, comfortable booths off to the side, you wave over the short, busty bar-fairy.  Vala flutters over to you, a frothy mug in hand, smiling brightly at the sight of you.  The lovely fairy girl always seems happy to see you; rescuing her from the caves really did endear you to her a great deal.' );
		EngineCore.outputText( '\n\n"<i>If it isn\'t my favorite customer.</i>" she quips before giving you a kiss on the cheek and placing a drink on your table. "<i>From me, as always.  I can never repay my debt to you, but it sure is fun trying,</i>" she says with a bright smile before looking around the mostly empty bar.' );
		EngineCore.outputText( '\n\n"<i>You know, it’s almost time to close up shop for the night.  If you don\'t mind waiting, we could spend some more quality time together.</i>"  She looks into your eyes, a blush on her fair skin as she brings her now empty tray up to half hide her face.  "<i>You know, if you want to that is.</i>"  Her blush rises, clearly shy about asking you to have a more romantic time and not just fooling around at the bar.  The adorable display she puts on brings a smile to your face, and spending a little extra time with the cute fairy girl sure would be fun.  Nodding at Vala, you raise your mug and tell her you would be more than happy to see her after work.' );
		EngineCore.outputText( '\n\nAt the affirmation of your date, Vala nearly lets out a girly squeal before fluttering off to finish her shift and close up.  As she goes about her job, you lounge in your comfortable seat and nurse your drink, eyes watching the small, stacked woman as she moves around the bar.  You can clearly tell how pleased she is by the way she excitedly flutters around and sways her body.  Her thin hips and round rear sway as she moves, the nipples of her oversized bust pressing against her apron - either she is very excited for later, or she knows you\'re watching her.' );
		EngineCore.outputText( '\n\nFor nearly an hour you\'re there watching her, the sweet fairy refilling your drink even as the last few patrons leave the place for the night.  Finally it’s time for you to go.  You put your mug away for the morning crew to wash, and the two of you lock up and head out.  The small fairy girl smiles to herself as she hangs onto your arm, pressing your hand into her comparable mountain of cleavage.  Surprisingly, you don\'t even leave the Wet Bitch.  You merely walk around the side of the bar and head up a set of stairs to the upper floor of the building.  You had no idea that Vala lived so close by; she\'s actually been living above the bar itself.  "<i>It’s not much, but it\'s nice - not very different from my old home in the forest with the other fairies.  I do miss them, but here I can see you,</i>" she says softly as she unlocks the door and lets you inside.' );
		EngineCore.outputText( '\n\nThe small woman steps to the side and lets you in, allowing you to gaze upon her place of living.  For a relatively new resident of the city, Vala has clearly been hard at work making this place her home.  The walls are lightly decorated.  The shelves hold baubles and other shiny things.  Hoping that you approve of her home, Vala steps in and closes the door behind herself.  "<i>What do you think? I’ve been working on this place since I got here.  It wouldn\'t have been possible if you hadn’t come along and saved me,</i>" she says as she hugs you from behind, holding onto you for a moment before moving around you and taking your hand in hers.' );
		if( CoC.getInstance().player.tallness > 75 ) {
			EngineCore.outputText( '  She looks up at you as you seem to tower over her, a' );
		} else {
			EngineCore.outputText( '  A' );
		}
		EngineCore.outputText( ' faint blush on her cheeks as she smiles and hugs your arm, beckoning you to follow.' );
		EngineCore.outputText( '\n\nIt’s obvious where the sweet fairy is taking you.  The door to her bedroom soon opens at her touch, and she pulls you inside, closing the door behind you.  The small room is like any normal bedroom, a bed, a dresser, a closet.  Though it looks average to you, a bed like this would be huge for a woman like Vala, giving her plenty of room to sleep on or have fun in.  Even as you think this, she bounds up onto the bed and lounges on it.  "<i>Ohhh, I just love this bed, it\'s so soft and nice, so much better than a cold cave floor.</i>"  You snicker at her words and actions; it\'s clear she really enjoys her freedom.' );
		EngineCore.outputText( '\n\nShe looks up at you before reaching forward and pulling you down onto the bed.  "<i>Oh, come here you!</i>" she says as she wraps you up into a passionate kiss and pulls your body over hers.  "<i>You really changed my life you know.  Without you, I would still be locked up in that cave, broken and being fucked by imps all day.  I have to say, I...  umm... I like being fucked by you much more,</i>" she says with an amorous grin spreading over her lips.  Seeing as you\'re already on her bed and that the sweet little woman wants you so badly, there is no reason to hold back.  Your hands grab her roughly, pushing her down against her bed with you above her.' );
		if( CoC.getInstance().player.tallness < 65 ) {
			EngineCore.outputText( '\n\nThe feeling of you pinning her down like this sends a shiver through your fairy lover.  Despite how she was treated before, she clearly loves having you do this to her.  Leaning up, she eagerly presses her oversized breasts against you as she plants kisses on your body.  "<i>Yessss.  Just you, just my hero.  My perfect hero,</i>" she hisses huskily to you as she slips her hands over your body, feeling you up before turning her attention to her clothes.  Desperate to feel your ' + CoC.getInstance().player.skinFurScales() + ' against hers, she strips herself of her dress and slips her hands into your [armor] to get you out of it as well.' );
		}

		//[tallness >65:;
		else {
			EngineCore.outputText( '\n\nThe feeling of you pinning her down like this sends a shiver of delight through your fairy lover.  Having her big strong hero above her like this, dwarfing her short frame, is clearly turning the girl on like nothing else.  Despite how she was treated before, she clearly loves having you do this to her.  Leaning up, she eagerly presses her oversized breasts against you as she plants kisses on every inch of your body she can reach.  "<i>Oh yessss.  My hero, my big strong hero.  So wonderful, so perfect,</i>" she purrs to you as she slips her hands over your body, feeling you up before turning her attention to her clothes.  Desperate to feel your ' + CoC.getInstance().player.skinFurScales() + ' against hers, she strips herself of her dress and slips her hands into your [armor] to get you out of it as well.' );
		}

		EngineCore.outputText( '\n\nYou can\'t help but shiver at her touch.  Now that she has you here, she’s taking her time with you. Here, she can enjoy your company, really get into the intimate nature of having sex with her hero.  Planting delicate kisses along your neck, the fairy girl hooks her legs around you, grinding her body against yours.  The sweet heat of her arousal pours off her as she grows more and more needy for you.  The slick burning wetness of her small tight snatch rubs against you, letting you feel how wet and ready she is for you.' );
		EngineCore.outputText( '\n\nNot wanting to get to the end so quickly, you pull your little lover up and seal her lips with a kiss, your tongue probing her mouth to find her tongue, the lovely fairy leaning in to meet you eagerly.  She lets out a soft tender moan, clearly loving the intimate contact of her lips against yours.  Her arms tighten around you as her tongue rubs and caresses yours, letting you know how much she wants you.  Wanting to take this even further, you roll over, putting Vala on top.  Pulling the sweet fay-girl into your lap, you take her hands and guide them to the throbbing hardness, letting her feel [eachCock].  She blushes and grins, wraps her hands around your ' );
		if( CoC.getInstance().player.cockTotal() > 1 ) {
			EngineCore.outputText( 'most appealing phallus' );
		} else {
			EngineCore.outputText( Descriptors.cockDescript( x ) );
		}
		EngineCore.outputText( ' and starts to stroke it.  Leaning down, she licks her lips and gets down between your legs, her eyes and body set on tasting your hard-on.' );
		//[cock area <17:];
		if( CoC.getInstance().player.cockArea( x ) < 17 ) {
			EngineCore.outputText( '\n\nPlanting a kiss right on the head, she draws her tongue around, slowly teasing and licking you.  "<i>Hehehe, a perfect size for someone like me,</i>" she says in between lips and delicate kisses.  Her soft lips tease you like fluttering butterflies, leaving a gentle tingling across your sensitive flesh.  Closing her eyes, the passionate fairy wraps her lips around you and starts to gently suck, her hands holding your hips as she slowly starts to bob her head up and down your shaft.' );
		}//[cock area >17 <30: ;
		else if( CoC.getInstance().player.cockArea( x ) < 30 ) {
			EngineCore.outputText( '\n\nPlanting a kiss right on the head, she draws her tongue around, slowly teasing you and tasting you.  "<i> Mmmm.  What a nice big dick you have here.  Yesss, so much for little Vala to love.</i>" she says in between lips and delicate kisses.  Her soft lips tease you like fluttering butterflies, leaving a gentle tingling across your sensitive flesh.  Opening wider, the passionate fairy dives headlong into her delicious task, eagerly licking and sucking every inch she can get at to pleasure you.  Her hands gently take a hold of your hips as she bobs her head up and down, wanting nothing more than to taste her hero.' );
		}//[cock area >30:;
		else {
			EngineCore.outputText( '\n\nPlanting a kiss right on the head, she draws her tongue around the thick head, slowly teasing you.  "<i>Ooohhh, so big and strong.  So much of my hero to play with,</i>" she says with a giggle before returning to her teasing task.  Her soft lips tease you like fluttering butterflies, leaving a gentle tingling.  Opening her mouth as wide as she can, the passionate fairy dives headlong into her delicious task, eagerly licking and sucking every inch she can get at to pleasure you.  Her hands gently take hold of your hips as she slowly bobs her head up and down, wanting nothing more than to taste her hero.' );
		}

		EngineCore.outputText( '\n\nHer diminutive tongue sucks around your ' + CoC.getInstance().player.cockHead( x ) + ', teasing and dancing circles around you.  Her silky hair feels good around your fingers, making the perfect hand-hold as you keep her in place as she sucks and plays with you.  Pulling back with a slurp and a gasp, Vala licks her lips before kissing her way down your shaft.  ' );
		if( CoC.getInstance().player.cocks[ x ].cockType === CockTypesEnum.HORSE ) {
			EngineCore.outputText( 'Her tongue licks around the throbbing glands, the heady animal musk filling her nose and mind with sweet lust.  ' );
		} else if( CoC.getInstance().player.cocks[ x ].cockType === CockTypesEnum.DOG ) {
			EngineCore.outputText( 'Her tongue licks around the hot building knot that gently throbs at your base.  ' );
		}
		//[anemone cock:;
		else if( CoC.getInstance().player.cocks[ x ].cockType === CockTypesEnum.ANEMONE ) {
			EngineCore.outputText( 'Her tongue plays with the squirming tentacles that line the drone of your throbbing phallus.  She shivers and groans as the tentacles sting her full of pleasurable aphrodisiac.  ' );
		}
		EngineCore.outputText( 'Playing her way down your cock, the fey-girl gently licks up and down, sucking along your cumvein before coming back to the ' + CoC.getInstance().player.cockHead( x ) + ' of your meaty prick.' );
		EngineCore.outputText( '\n\nHer sweet lips plant a firm kiss right on the tip before pulling back and licking those tender cock-suckers clean of your unique flavor.  The hunger for her lover, the aching desire for her hero to fuck her is too strong to hold back a moment longer.  For once, the busty fairy lays before you instead of jumping you to ride you as she likes to do.  Her soft luscious thighs spread for you, showing off her small soaking mound and dripping snatch.  Her eyes glitter with amorous mischief as she looks you up and down.  "<i>Come on hero, you need to come and claim your spoils.  Little Vala wants it so bad, make her scream your name,</i>" Vala says as she slides a finger along her slippery slit before spreading her quivering nethers open for you.' );
		EngineCore.outputText( '\n\nWith such an initiation and the small stacked woman looking up at you with lust and adoration, how can you say no?  Her body is so open to you, craving your touch and the sexual nirvana she knows you can bring her.  Grabbing her legs, you pull her closer to you and lean down over her, gently pinning her to the bed as you slide between her soft, silky thighs.  Your hands find her bountiful breasts, and your fingers sink into the soft, pliant flesh.  The pale, milky teats are already dripping their sweet fairy cream for you, just begging for your lips to wrap around a nipple and suckle your fill from them.  Licking your lips at the thought of her sweet offerings, you look down to take in the lovely fey-girls appearance, her milky skin, her tender feminine face, her glittering lilac-colored hair.  Vala’s bright eyes look up at you with adoration, a blush on her fair cheeks.  A smile breaks across her lips as she reaches up and slides her arms around your neck.  She leans up and kisses your lips once more.  More than ready for you, Vala REALLY wants you.' );
		EngineCore.outputText( '\n\nNot wanting to wait a moment longer, you surge forward, pushing your ' + Descriptors.cockDescript( x ) + ' between her  thighs, the ' + CoC.getInstance().player.cockHead( x ) + ' gently probing the small tight sex that lay between them, her fey-honey oozing from the womanly flower like sweet nectar from the most exotic of plants.  The touch of your meaty masculinity against her puffy, sensitive nethers draws a gentle gasp from the excited woman.  Taking hold of her hips, you push forward and sink your aching, throbbing spear into her tender, needy body.  ' );
		//[cockarea <17:;
		if( CoC.getInstance().player.cockArea( x ) < 17 ) {
			EngineCore.outputText( 'Despite her size, you slide in easily, her wet, slippery pussy taking you in and squeezing you in a velvety embrace.  "<i>Yessss, it\'s in, it\'s in!  Mmmm, come to me hero, come to Vala,</i>" she croons to you, beckoning  you to take her.' );
		} else if( CoC.getInstance().player.cockArea( x ) < 30 ) {
			EngineCore.outputText( '"<i>Ahhh...  yesss, it\'s in!  Ohh...  come to me hero, come to Vala and fill her with your love!</i>" she croons to you, beckoning  you to take her.' );
		} else {
			EngineCore.outputText( 'Ohhh! Ahhh...  Y-Yessss...  Vala’s big strong hero, oh you feel so good inside me!</i>" she moans and groans as you stretch her tight little fairy cunt with your pulsing prick.  Her stretchy flesh distends as more and more of your cock is fed into her hungry pussy.' );
		}

		EngineCore.outputText( '\n\nDeeper and deeper you delve into Vala’s tight squeezing depths, her silky snatch squeezing down around you, rippling with the earthy delight of her magical body.  Her tender, eager muscles seem to move on their own, squeezing down one after another, working you from base to tip as if to milk you of your virile offerings.  You’re sorely tempted to grab hold of her and have your way with the willing girl, to screw her brains out and make her scream with utter ecstasy.  Managing to keep control of yourself for now, you grab her hips and sink every inch you can into the hot welcoming body of your little lover.' );
		if( CoC.getInstance().player.cockArea( x ) > 17 ) {
			EngineCore.outputText( '  Her hot little body stretches around your girthy prick, distending her belly as you sheath your throbbing arousal into her.' );
		}
		EngineCore.outputText( '\n\nYour hands roam over her as you buck your hips into your fairy lover, your hands groping her round ass, her massive milky mammaries swaying and jiggling from your hard thrusts.  The bounce and ripple of her creamy udders is too much to bear, their hypnotic shakes drawing your hands to them, squeezing and manhandling those luscious orbs.  Spurts of rich milk splash across your ' + CoC.getInstance().player.skinFurScales() + ' as you pinch and squeeze her nipples.  The rough touches, the pinching, the squeezes and gropes draw long moans and groans from the panting, lusty fairy.  Your fey-lover murmurs your name as you take her, beckoning you for more, for you to keep fucking her and to make her scream.  "<i>Haa haa, ohhhh, yessss fuck me, fuck Vala’s tight little cunt!  Give me all your burning love!</i>" she pants and cries out as she bucks her hips up to you, her arms reaching up to hold onto you as you start to speed up your thrusts.' );
		EngineCore.outputText( '\n\nHer passionate cries focus your attention on her, her face the picture of carnal bliss and her eyes murky and unfocused.  They occasionally roll up when a wave of pleasure hits her.  Her tongue lolls from her lips.  Her breath pants hard alongside each cry of delight you pull from her as you plumb her tender depths.' );
		if( CoC.getInstance().player.balls > 0 ) {
			//if ballsize <3:;
			if( CoC.getInstance().player.ballSize < 3 ) {
				EngineCore.outputText( '  With each hard quaking thrust your balls slap against Vala’s expansive ass.  Your nuts ache under their pent up load and demand you to shoot it into the sweet fey-girl soon.' );
			} else if( CoC.getInstance().player.ballSize < 6 ) {
				EngineCore.outputText( '  With each hard quaking thrust, your balls smack against Vala’s cushiony ass.  Your hefty, cum-bloated sack, so full, aches for the sweet release into your tender fairy lover.' );
			} else {
				EngineCore.outputText( '  With each hard quaking thrust, your fat balls slam against Vala’s pale squeezable ass.  The huge, virile spunk-factories go into overtime, their already taut skin growing tighter as they swell and bloat with your pent up load.  Your body\'s natural instincts demand you do your duty as the breeder you are and pack your small lover’s womb full of your spunk until her belly is swollen and seeded with your young.' );
			}
		}
		EngineCore.outputText( '\n\nHotter and hotter your passion flares, your wild bucking thrusts rocking and battering your short curvy lover’s body over and over, your ' + Descriptors.cockDescript( x ) + ' pounding her hungry pussy harder and faster, desperate to reach that peak of pleasure.  Wrapping your arms around Vala’s small body, you squeeze her against you as you finally reach your climactic end.  Gritting your teeth and growling to your tender lover, you ram your hips against her and sink every inch of throbbing cockflesh into her receptice body as you can fit.  The sudden hard thrust combined with the feeling of your aching mast pulsing and swelling inside her at your orgasm makes your sumptuous sweetheart groan and moan as her eyes roll back from the feeling of your hot spunk rushing into her.  The raw, blissful nirvana of the rampant sex and impending creamy injection bring the overexcited fairy to an explosive squirting orgasm.' );
		//[cum volume low: ;
		if( CoC.getInstance().player.cumQ() < 250 ) {
			EngineCore.outputText( '\n\nGasping in pleasure, you keep your hips pressed against Vala’s, your cock crammed deep inside her small body as you squirt your cum into her belly.  Your little lover wraps her legs around you, squeezing herself against you to get as much of your hot seed inside her body as she can.' );
		} else if( CoC.getInstance().player.cumQ() < 1000 ) {
			EngineCore.outputText( '\n\nGrunting hard, you gush over and over into your sweet fey-lover.  You hold yourself tighter against her, making sure you force as much of your spunk into her waiting, hungry womb as you can.  Your little lover wraps her legs around you, squeezing herself against you to get as much of your hot seed inside her body as she can.  Her tight, toned tummy gently pushes out from the creamy cum being pumped into it.' );
		} else if( CoC.getInstance().player.cumQ() < 3000 ) {
			EngineCore.outputText( '\n\nGasping and groaning, you unleash gush after gush of thick, rich cum, basting your fey-lover’s womb with your virile spunk.  Wedging yourself as tightly against her as you can, you make sure that every drop packs into her tender belly.  Your little lover wraps her legs around you, squeezing herself against you to get as much of your hot seed inside her body as she can.  The potent flow of your seed quickly swells her stomach into a cute, cum-bloated paunch.' );
		} else {
			EngineCore.outputText( '\n\nYour eyes roll up, your mouth hangs open, and you grunt long and hard as your seed floods Vala’s tight, squeezing cunt like a frothy flood.  Wave after wave of your thick, creamy spunk forces its way through her convulsing cunt and right into her eager, waiting womb.  Your little lover wraps her legs around you, squeezing herself against you to get as much of your hot seed inside her body as she can.  Geysers of spunk force their way into her womb, filling it fuller and fuller until her belly swells.  Her once tight, flat tummy rounds out into a healthy, round cumbaby, your thick, yogurt-like spunk overflowing from her over-stuffed snatch in sticky streams.' );
		}

		EngineCore.outputText( '\n\nThe sweet relief of your orgasm washes over you, the blissful afterglow turning your arms and [legs] to jelly as you settle over your small panting lover.  Vala’s body is sweaty and hot from the passionate sex.  Her arms wrap around you, hugging her body against yours as she whispers to you and snuggles against you.  "<i>Ohhh... that was... you are amazing...</i>" she says blissfully as she nuzzles her face against your body, her cunt clenching hard around you as she cuddles up against you.  As you lay there holding her, you can hear her whisper softly to herself, muttering sweet nothings into the air to you.  Her fingers run over your [chest], drawing little shapes and hearts over your skin as she hums.  Smiling to yourself, you stroke her head and hold onto her, cuddling up with your tender fairy.  Leaning in, you plant a tender kiss in her hair before you settle in for the night with the oversized fairy.' );
		CoC.getInstance().player.orgasm();
		CoC.getInstance().flags[ kFLAGS.VALA_TIMES_CONSENSUAL_SEX ]++;
		EngineCore.dynStats( 'lib', -1, 'sen', -2 );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Next', this.valaPartIIWaifuLove );
	};
	//[next];
	Dungeon2Supplimental.prototype.valaPartIIWaifuLove = function() {
		EngineCore.clearOutput();
		CoC.getInstance().time.hours = 6;
		CoC.getInstance().time.days++;
		CoC.getInstance().scenes.camp.sleepRecovery( false );
		EngineCore.statScreenRefresh();
		EngineCore.outputText( 'Letting out a yawn, you curl up in the warm covers of the bed.  You sigh and smile as the smell of food wafts over you; it reminds you of your time back home.  The scent of frying meat and eggs soon becomes too much for your sleeping mind and rouses you from your slumber.  Stretching your body out, you look around and remember your night with Vala; you must have fallen asleep in her bed.  Unable to help yourself, you follow the mouth watering aroma to the kitchen and find the loving fairy-girl there.  Her gossamer wings flutter as she hovers at the stove, naked save for the apron she wears.  The sound of grease popping and crackling fills the air along with the smell of a savory, home cooked breakfast.' );
		EngineCore.outputText( '\n\nYou can\'t help but grin, the sweet girl treating you to breakfast after spending the night with her.  Approaching her, you slip your arms around her and hug her gently.  Despite your surprise hug, Vala keeps working, though she is more than happy to press her ass against you.  "<i>Mmmm... good morning, did you sleep well, [name]?</i>" she asks as she looks up at you with a bright smile of her face.  You smile back at her and slide your hands into her apron to grope and fondle her oversized breasts, the rough touch pulling a squeak and a soft moan from her lips.  "<i>H-hey! You\'re supposed to be enjoying my food, not me!</i>" she says with a blush on her cheeks, clearly not really minding your hands on her.  Looking back at the food she is preparing, Vala reluctantly pulls away.  "<i>Breakfast is done - my treat, now let’s eat!</i>" she cheerfully announces as she takes the food off the stove and plates the mouth-watering feast.  Each plate is blessed with a trio of bacon strips, two fried eggs and two plump sausages.  Shivering in delight at the meal ahead of you, you say a heartfelt thanks to Vala before digging in with her.' );
		EngineCore.outputText( '\n\nIt’s a wonderful change of pace from the usual food you have in the morning.  The salty, savory meats and eggs fill you up, spreading a satisfied warmth through you as you eat.  Unfortunately for you, the deliciousness of the filling meal means it’s devoured quickly, leaving you almost uncomfortably full.  Letting out a sigh, you slide an arm around your fairy lover and pull her closer, cuddling with her at the table for a moment before pulling her into your lap.  Your hands run over her body and stroke her softly as you settle into the intimate, post-meal moment.  Vala smiles and presses herself against you, her arms curling around you as she snuggles you.  "<i>My hero...  I wish we could stay like this forever, [name]</i>" she says as she nuzzles her face into your [chest].' );
		EngineCore.outputText( '\n\nWith her being as affectionate she is, you can\'t help but smile and stroke her.  This really was nice; you could see yourself enjoying many more times like this, but unfortunately you do have to get back to your duty.  Pulling Vala into a kiss, you squeeze her and hold her tightly against you for a moment before lifting her off you, telling the girl that you have to go.  She sighs, knowing that you have to get back to being her hero.  "<i>I know, go and be the big strong hero I know you are, just make sure you come and visit me at the bar whenever you want,</i>" she says before kissing you one last time and showing you to the door.  Breathing in the morning air, you head back to camp to check up on the place.' );
		//[return to camp][set clock to 7am];
		EngineCore.doNext( CoC.getInstance().scenes.camp.returnToCampUseOneHour );
	};
	CoC.getInstance().registerScene( 'dungeon2Supplimental', new Dungeon2Supplimental() );
} );