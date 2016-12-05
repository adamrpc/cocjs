'use strict';

angular.module( 'cocjs' ).factory( 'SuccubusGardener', function( MainView, Appearance, AppearanceDefs, kFLAGS, EngineCore, CoC, Monster, StatusAffects, Utils, Combat ) {
	function SuccubusGardener() {
		this.init(this, arguments);
	}
	angular.extend(SuccubusGardener.prototype, Monster.prototype);
	SuccubusGardener.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('SuccubusGardener');
		that.a = 'the ';
		that.short = 'succubus gardener';
		that.long = 'This succubus has everything you would expect from one of her kind bust that would drive women wild with jealousy, hips that could melt a preacher\'s conviction, an ass so perfectly rounded that it seems designed to be cupped, and a smoldering visage that simultaneously entices whilst wearing a domineering grin. Her raven hair cascades around ram horns that gleam like polished ivory, and her red eyes greedily drink in your every motion. What clothing she wears is only designed to enhance her rampant sexuality, somehow making her look more naked than if she actually were.\n\nBehind her, the shrubbery itself has come to life, revealing corded vines with inhuman strength, some capped with oozing, phallus-like tips. A few are as thick as your arm and tipped with gasping, swollen lips or violet, blooming pussies. Others still bear no ornamentation at all. There is little rhyme or reason to the mass of vegetation a theme of rampant, overgrown sexuality encouraged to an obscene degree.';
		that.createVagina( false, 3, 3 );
		that.createBreastRow( Appearance.breastCupInverse( 'FF' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_LOOSE;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.tallness = 8 * 12;
		that.hipRating = AppearanceDefs.HIP_RATING_AVERAGE;
		that.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		that.weaponName = 'tentacles';
		that.weaponVerb = 'lash';
		that.weaponAttack = 22;
		that.armorName = 'tentaclothes';
		that.initStrTouSpeInte( 85, 60, 85, 100 );
		that.initLibSensCor( 85, 60, 100 );
		that.bonusHP = 600;
		that.gems = 50 + Utils.rand( 33 );
		that.level = 20;
		that.lustVuln = 0;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
		that.createStatusAffect( StatusAffects.TentagrappleCooldown, 10, 0, 0, 0 );
	};
	SuccubusGardener.prototype.cleanupEffects = function() {
		if( CoC.player.findStatusAffect( StatusAffects.Tentagrappled ) ) {
			CoC.player.removeStatusAffect( StatusAffects.Tentagrappled );
		}
		if( CoC.player.findStatusAffect( StatusAffects.ShowerDotEffect ) ) {
			CoC.player.removeStatusAffect( StatusAffects.ShowerDotEffect );
		}
	};
	SuccubusGardener.prototype.defeated = function( hpVictory ) {
		this.cleanupEffects();
		CoC.succubusGardenerScenes.fuckUpTheGardener( hpVictory );
	};
	SuccubusGardener.prototype.won = function( hpVictory ) {
		this.cleanupEffects();
		CoC.succubusGardenerScenes.surrenderToTheGardener( hpVictory );
	};
	SuccubusGardener.prototype.performCombatAction = function() {
		// The succubus gardener is a multistage fight. She starts off all but immune to lust damage. She has enough HP not to be one-shot and a heal move that takes priority over any stun. Once she is reduced to 60% HP, she either drinks from her tentacles or is force-fed by them (if stunned). This fully heals her but makes her 15% more vulnerable to lust.;
		// Also, the more turned on she gets, the more aggressive she gets.;
		// Her damage is all lust but in low amounts. This is something of a marathon fight.;
		if( this.findStatusAffect( StatusAffects.TentagrappleCooldown ) >= 0 ) {
			this.addStatusValue( StatusAffects.TentagrappleCooldown, 1, -1 );
			if( this.statusAffectv1( StatusAffects.TentagrappleCooldown ) <= 0 ) {
				this.removeStatusAffect( StatusAffects.TentagrappleCooldown );
			}
		}
		if( CoC.player.findStatusAffect( StatusAffects.ShowerDotEffect ) >= 0 ) {
			this.showerDotEffect();
			if( CoC.player.lust >= 100 ) {
				return;
			}
		}
		if( this.HPRatio() <= 0.6 ) {
			this.vineHeal();
		} else if( this.findStatusAffect( StatusAffects.TentagrappleCooldown ) < 0 ) {
			this.tentagrapple();
		} else if( CoC.player.findStatusAffect( StatusAffects.GardenerSapSpeed ) < 0 && this.findStatusAffect( StatusAffects.VineHealUsed ) >= 0 ) {
			this.sapSpeed();
		} else {
			var opts = [ this.sicem, this.corruptiveShower, this.lustAuraCast ];
			if( this.lust < 40 ) {
				opts.push( this.taunt );
			}
			if( this.lust >= 40 ) {
				opts.push( this.motorboat );
			}
			if( this.lust >= 40 ) {
				opts.push( this.tasteTheEcstasy );
			}

			opts[ Utils.rand( opts.length ) ]();
		}
		EngineCore.statScreenRefresh();
		Combat.combatRoundOver();
	};
	SuccubusGardener.prototype._superHandleStun = SuccubusGardener.prototype.handleStun;
	SuccubusGardener.prototype.handleStun = function() {
		if( this.HPRatio() <= 0.6 ) {
			return true;
		} else {
			return this._superHandleStun();
		}
	};
	SuccubusGardener.prototype.vineHeal = function() {
		if( this.findStatusAffect( StatusAffects.VineHealUsed ) < 0 ) {
			this.createStatusAffect( StatusAffects.VineHealUsed, 0, 0, 0, 0 );
		}
		if( this.findStatusAffect( StatusAffects.Stunned ) < 0 ) {
			EngineCore.outputText( 'Tipping herself backward, the succubus gardener lets herself pitch into the writhing tendrils behind her, her mouth opened welcomingly. The tentacles gently catch her, and rather than ravishing her vulnerable form, they merely gather above her parted lips, dribbling thick flows of pink slime. Her throat bobs as she swallows, her injuries vanishing in seconds. The vines push her back up onto her feet. She\'s smiling a little dopily.' );
			if( this.lustVuln <= 0.15 ) {
				EngineCore.outputText( ' <b>You aren\'t sure, but she seems to be leering at you a little more openly.</b>' );
			} else if( this.lustVuln <= 0.45 ) {
				EngineCore.outputText( ' <b>She\'s definitely leering at you now.</b>' );
			} else {
				EngineCore.outputText( ' <b>There\'s no disguising the lecherous look on her face while she eye-humps you.</b>' );
			}
			if( this.lustVuln <= 0.3 ) {
				EngineCore.outputText( ' Whatever is in that healing nectar must be weakening her self-control.' );
			}
		} else {
			EngineCore.outputText( 'Acting on some unseen signal, the forest of tentacles lurches into action, surrounding its insensate mistress in a veil of wiggling green. A bundle of slime-dripping vines can be spotted through gaps in the verdant veil, hanging over their demonic caretaker with remarkable care, leaking gooey strands of pink into her mouth. Her throat works to swallow it, and when she emerges a second later, her injuries have vanished and her eyes' );
			if( this.lustVuln <= 0.15 ) {
				EngineCore.outputText( ' are slightly glassy.' );
			} else if( this.lustVuln <= 0.45 ) {
				EngineCore.outputText( ' are even glassier.' );
			} else {
				EngineCore.outputText( ' are dilated and a little slow.' );
			}
			if( this.lustVuln <= 0.3 ) {
				EngineCore.outputText( ' Whatever is in that healing nectar must be weakening her self-control.' );
			}
		}
		this.HP = this.eMaxHP();
		this.lustVuln += 0.3;
	};
	SuccubusGardener.prototype.tentagrapple = function() {
		this.createStatusAffect( StatusAffects.TentagrappleCooldown, 10, 0, 0, 0 );
		//Used once every ten rounds;
		EngineCore.outputText( 'A web of interwoven vines lashes out from behind the succubus, somehow leaving her untouched by the wave of advancing greenery. They\'re trying to grab you!' );
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			//Dodge;
			EngineCore.outputText( ' You slip aside at the last moment, barely avoiding being wrapped in the squirming mass. It snaps back, perhaps at the limits of its reach, leaving you once more eye to eye with the alluring gardener.' );
		} else {
			//Do not dodddddddggggeee;
			EngineCore.outputText( ' You twist to the side, but one snags you by the wrist. Another loops around your [leg], and an avalanche of slime-oozing tentacles falls across the rest of you, wrapping you up in snug coils. Their grip is equal parts iron grip and lover\'s caress. You\'d better struggle free before they really start to work on you!' );
			CoC.player.createStatusAffect( StatusAffects.Tentagrappled, 0, 0, 0, 0 );
		}
	};
	SuccubusGardener.prototype.grappleStruggle = function() {
		EngineCore.clearOutput();
		var numRounds = CoC.player.statusAffectv1( StatusAffects.Tentagrappled );
		if( Utils.rand( CoC.player.str ) > this.str / (1 + (numRounds / 2)) ) {
			EngineCore.outputText( 'You scrabble desperately against the tentacles enveloping your body, pulling against the cast-iron grip around your limbs. You tug against them again and again, and with one final mighty heave, you slip free of their grasp!' );
			CoC.player.removeStatusAffect( StatusAffects.Tentagrappled );
			Combat.combatRoundOver();
		} else {
			EngineCore.outputText( 'You scrabble desperately against the tentacles enveloping your body, pulling against the cast-iron grip around your limbs. You tug against them again and again' );
			if( Utils.rand( 2 ) === 0 ) {
				EngineCore.outputText( ', but the vines encircling you squeeze you tighter, twisting and sliding across your [skinFurScales] as they press more tightly around you. It gets hard to breathe, but at the same time, some of them are inside your [armor], gliding across your most sensitive places with oiled ease that\'s made all the more arousing by the force behind it.' );
			} else {
				EngineCore.outputText( '. You\'re intimately aware of the vegetative masses pressing down on you from every angle, lavishing you with attentions so forceful that they threaten to squeeze the very breathe from your body. It\'s impossible to ignore. You do your best to breathe and ignore the undulated affections, but even you can\'t deny the way that it makes your heart beat faster.' );
			}
			CoC.player.addStatusValue( StatusAffects.Tentagrappled, 1, 1 );
			CoC.player.takeDamage( 75 + Utils.rand( 15 ) );
			EngineCore.dynStats( 'lus+', 3 + Utils.rand( 3 ) );
			if( CoC.flags[ kFLAGS.PC_FETISH ] >= 2 ) {
				EngineCore.dynStats( 'lus+', 5 );
			}
			Combat.combatRoundOver();
		}
	};
	SuccubusGardener.prototype.grappleWait = function() {
		EngineCore.clearOutput();
		this.squeeze();
	};
	SuccubusGardener.prototype.squeeze = function() {
		if( Utils.rand( 2 ) === 0 ) {
			EngineCore.outputText( 'The vines encircling you squeeze you tighter, twisting and sliding across your [skinFurScales] as they press more tightly around you. It gets hard to breathe, but at the same time, some of them are inside your [armor], gliding across your most sensitive places with oiled ease that\'s made all the more arousing by the force behind it.' );
		} else {
			EngineCore.outputText( 'You\'re intimately aware of the vegetative masses pressing down on you from every angle, lavishing you with attentions so forceful that they threaten to squeeze the very breathe from your body. It\'s impossible to ignore. You do your best to breathe and ignore the undulated affections, but even you can\'t deny the way that it makes your heart beat faster.' );
		}
		CoC.player.addStatusValue( StatusAffects.Tentagrappled, 1, 1 );
		CoC.player.takeDamage( 75 + Utils.rand( 15 ) );
		EngineCore.dynStats( 'lus+', 3 + Utils.rand( 3 ) );
		Combat.combatRoundOver();
	};
	SuccubusGardener.prototype.sicem = function() {
		EngineCore.outputText( 'Jiggling oh so pleasantly, the gardener twirls and points in your direction. <i>“Sic \'em, pets!”</i> There is no time for a retort, only a wave of unrelenting greenery lashing in your direction!' );
		//Ten very low damage attacks.;
		// Geddynote- opted to convert to a lust-inducing attack, because LITERALLY EVERYTHING ELSE she does is lust-based.;
		var damage = 0;
		for( var i = 0; i < 10; i++ ) {
			if( !(Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect()) ) {
				damage += 2 + Utils.rand( 1 + CoC.player.lib / 20 ) + Utils.rand( 1 + CoC.player.sens / 20 );
			}
		}
		if( damage >= 0 ) {
			var sL = CoC.player.lust;
			EngineCore.dynStats( 'lus+', damage );
			sL = Math.round( CoC.player.lust - sL );
			EngineCore.outputText( ' The sinuous plant-based tentacles lash at you like a dozen tiny whips! Preparing for stinging pain, you\'re somewhat taken aback when they pull back at the last moment, sensually caressing your most sensitive places! (' + sL + ')' );
		} else {
			EngineCore.outputText( ' The sinuous plant-based tentacles strike at you like a dozen tiny whips, but, somehow, you manage to avoid every single one of their lashes!' );
		}
	};
	SuccubusGardener.prototype.corruptiveShower = function() {
		EngineCore.outputText( 'The succubus lifts her hands up in the air, saying, <i>“Why not taste a sampling of the pleasures I offer?”</i> Above her, a canopy of corrupt, snarled greenery forms, oozing unmistakable sexual fluids - both male and female. Splatters of jism and pussy juice fall like curtains of corruptive rain, their scent lacing the air with their heady musk.' );
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			//Dodge;
			EngineCore.outputText( ' Somehow, you manage to twist out from under the organic raincloud without getting stained by a single drop, though your breath has quickened, and not just from the physical effort.' );
		} else {
			//Fail;
			if( CoC.player.findStatusAffect( StatusAffects.ShowerDotEffect ) < 0 ) {
				CoC.player.createStatusAffect( StatusAffects.ShowerDotEffect, 3, 0, 0, 0 );
			} else {
				CoC.player.addStatusValue( StatusAffects.ShowerDotEffect, 1, 3 );
			}
			EngineCore.outputText( ' You try your best to avoid the onslaught of off-white, but your efforts are in vain. Slick wetness splatters into and around you, making the ground itself so slippery that you nearly topple over. Unfortunately, the treacherous footing gives the gardener\'s plants plenty of time to work their foul work, layering you mixed slime until you\'re dripping. You groan in disappointment and building arousal, uncomfortably aware of the way the juices are exciting you as you they soak into your skin.' );
		}
	};
	SuccubusGardener.prototype.showerDotEffect = function() {
		EngineCore.dynStats( 'lus+', 2 + Utils.rand( 2 ) );
		CoC.player.addStatusValue( StatusAffects.ShowerDotEffect, 1, -1 );
		//Dot effect;
		if( CoC.player.lust < 50 ) {
			EngineCore.outputText( 'The tentacles\' sex-juices are still covering you - still slowly arousing you. You\'ve got a good handle on it for now.\n\n' );
		} else if( CoC.player.lust < 60 ) {
			EngineCore.outputText( 'You try to wipe some of the fragrant seed from your palm, but all you succeed in doing is smearing it into your [hips].' );
			if( CoC.player.cor < 50 ) {
				EngineCore.outputText( ' You\'re ashamed to admit' );
			} else {
				EngineCore.outputText( ' You\'re a little irritated to admit' );
			}
			EngineCore.outputText( ' that it\'s starting to feel really good.\n\n' );
		} else if( CoC.player.lust < 70 ) {
			EngineCore.outputText( 'You groan at the warm slipperiness enveloping your [skinFurScales] as the tainted tentacles\' fluids go to work on you. There\'s nothing you can do but try to endure it. If only it didn\'t feel so... hot to be drenched in. If you wind up losing, you hope she\'ll do this again....\n\n' );
		} else if( CoC.player.lust < 80 ) {
			EngineCore.outputText( 'You whimper as the insidious plant-sperm works on your vulnerable ' + CoC.player.skinDesc + ', building pernicious desires in tiny, insistent increments. It\'s getting harder to focus... harder not to think about how good all those tentacles would feel in you and on you, caressing your most intimate places.\n\n' );
		} else if( CoC.player.lust < 90 ) {
			EngineCore.outputText( 'You shudder in place, stumbling dazedly as your ardor rises to a fever pitch. Soon, you\'re going to wind up too turned-on to resist, and when that happens, those tentacles are going to take you. The worst part? It\'s starting to sound really, really... really good to you. Not struggling, no tension... just giving in to what your body craves and loving it.\n\n' );
		} else if( CoC.player.lust < 100 ) {
			EngineCore.outputText( 'Ohhhh, you\'re close now. You can feel the need hammering inside of you, soaking in through your [skinFurScales] to stoke the fires between your [legs] into a blazing inferno, one you couldn\'t resist even if you wanted to. Then... then you\'ll be free to cum. You shake your head. Gotta hold it together' );
			if( CoC.player.hasCock() ) {
				EngineCore.outputText( ', even while your rigid cock' + ((CoC.player.cocks.length > 1) ? 's are' : ' is') + ' drizzling ropes of pre unimpeded.' );
			} else if( CoC.player.hasVagina() ) {
				EngineCore.outputText( ' soaked twat threatens to ' + ((CoC.player.wetness() === 4) ? 'drown' : 'further soak') + ' your [legs].' );
			} else {
				EngineCore.outputText( '.' );
			}
		} else {
			EngineCore.outputText( 'Ohhh fuck, there\'s no holding it back now. You\'re gonna do it, and there\'s nothing you could do it stop it even if you wanted to. You\'re going to drop to your knees and take off your [armor]. You\'re going to give this beautiful demoness what she wants. You\'re going to let her fuck you and use you, just so long as she allows you to cum. You\'ll be fine once you cum, even if it means throwing away a chance to defeat Lethice.\n\n' );
			// I think this will work, but 9999 in case;
			Combat.combatRoundOver();
			return;
		}
		if( CoC.player.statusAffectv1( StatusAffects.ShowerDotEffect ) < 0 ) {
			CoC.player.removeStatusAffect( StatusAffects.ShowerDotEffect );
			EngineCore.outputText( '<b>The lust-inducing effects of the plant-spunk feel like they\'ve dissipated...</b>\n\n' );
		}
	};
	SuccubusGardener.prototype.taunt = function() {
		EngineCore.outputText( '<i>“How do you expect to defeat me, [name],”</i> the green-thumbed temptress asks with a quirk of her head. <i>“You are but one, and we are many. You have the frailties and weaknesses of a soul. I have power and experience beyond your comprehension. What is there for you to do but willingly submit?”</i> She purses her puffy lips, thinking. <i>“If you submit willingly, I\'ll allow you to lay your head between my breasts while my plants feed on you. It\'ll be quite the experience.”</i>' );
	};
	SuccubusGardener.prototype.motorboat = function() {
		EngineCore.outputText( '<i>“Oh fuck it,”</i> the demoness growls, stalking forward. <i>“We both need this, don\'t we, pet?”</i> She slips inside your guard, pressing her pendulous melons against your face' );
		if( CoC.player.tallness <= this.tallness - 6 ) {
			EngineCore.outputText( ', somehow short enough in spite of the height differences.' );
		} else if( CoC.player.tallness >= this.tallness + 6 ) {
			EngineCore.outputText( ', somehow tall enough in spite of the height differences.' );
		}

		EngineCore.outputText( ' They\'re so soft and pillowy that you can\'t help but enjoy the feel of them on your skin, and you take a deep, contented breath before remembering where you are and struggling out of the creamy valley.' );
		EngineCore.outputText( '\n\nYour foe giggles, favoring you with a blown kiss. Her nipples are obviously a little harder, but then again, so are yours.' );
	};
	SuccubusGardener.prototype.sapSpeed = function() {
		//Used once after first orgasm;
		// 9999 wot orgasm -- gonna assume it's used the heal at least once;
		EngineCore.outputText( 'Cupping her breasts under the cover of her tentacular minions, the gardening succubus coos, <i>“Slow down a little and enjoy the sights, why don\'t you?”</i> She squeezes, and arcs of glittering milk (or is that sap?) erupt from her elongated nipples, spraying out in continuous streams towards your [feet]. You try to evade at the last second, but the streams follow you every which way, eventually coating you in a layer amber milk-sap.' );
		EngineCore.outputText( '\n\nThe lactic adhesive effectively slows your movements. You won\'t be dodging around quite so nimbly anymore, but at least you get to watch the succubus moan and twist, kneading the last few golden droplets from her engorged tits. She licks a stray strand from her finger while watching you, smiling. <i>“Ready to give up yet?”</i>' );
		// 20%?;
		var speedSapped = CoC.player.spe * 0.2;
		CoC.player.spe -= speedSapped;
		CoC.player.createStatusAffect( StatusAffects.GardenerSapSpeed, speedSapped, 0, 0, 0 );
		MainView.statsView.showStatDown( 'spe' );
	};
	SuccubusGardener.prototype.lustAuraCast = function() {
		EngineCore.outputText( 'The demoness blinks her eyes closed and knits her eyebrows in concentration.  The red orbs open wide and she smiles, licking her lips.   The air around her grows warmer, and muskier, as if her presence has saturated it with lust.', false );
		if( this.findStatusAffect( StatusAffects.LustAura ) >= 0 ) {
			EngineCore.outputText( '  Your eyes cross with unexpected feelings as the taste of desire in the air worms its way into you.  The intense aura quickly subsides, but it\'s already done its job.', false );
			EngineCore.dynStats( 'lus', (8 + Math.ceil( CoC.player.lib / 20 + CoC.player.cor / 25 )) );
		} else {
			this.createStatusAffect( StatusAffects.LustAura, 0, 0, 0, 0 );
		}
	};
	SuccubusGardener.prototype.tasteTheEcstasy = function() {
		//Strength check based lust damage, used when aroused only.;
		EngineCore.outputText( 'Three tentacles stab out at you like organic spears, but you easily evade them... directly into the succubus\' arms! Too late, you realize that the offensive was a feint! Her tremendous tits are pressing into your back, and you feel a trickle of wetness leaking down your [leg] as she grinds against you. At the same time, she whispers into your ear, <i>“Just have a taste... sample the ecstasy. You\'ll see that indulging is the best thing you could possibly do.”</i>' );
		EngineCore.outputText( '\n\nOne of those tentacles is above you now, and it points down, its phallic shape clear. The slit at the end spreads open, and a blob of whitish goo appears. ' );
		//Fail strength check!;
		if( Utils.rand( CoC.player.str - 30 ) + 30 > this.str ) {
			EngineCore.outputText( '\n\nIt hangs there for a moment while the succubus yanks your mouth open, just in time to receive the undoubtedly drugged jism. It practically sizzles on your tongue, tasting of almonds and walnuts with a distinctly fruity aftertaste. Your mouth gulps it down automatically, and with slow-dawning comprehension, you understand how the succubus could be so obsessed with these plants. Your groin heats eagerly as the plant spunk absorbs into your system. Your pupils dilate. Gods, it feels good!' );
			EngineCore.outputText( '\n\nYou barely even realize that the temptress has stepped away. How can you fight this?' );
			EngineCore.dynStats( 'lus', (8 + Math.ceil( CoC.player.lib / 20 + CoC.player.cor / 25 )), 'cor+', 5 );
		} else {
			//Succeed strength check;
			EngineCore.outputText( '\n\nThat\'s all the warning you need to redouble your efforts. Riding high on a surge of adrenaline, you tear your way out of the temptress\' bonds before she can feed you any more corruption.' );
			EngineCore.outputText( '\n\nShe pouts. <i>“Come on, just a taste!”</i>' );
		}
	};
	return SuccubusGardener;
} );