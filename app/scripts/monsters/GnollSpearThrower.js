'use strict';

angular.module( 'cocjs' ).factory( 'GnollSpearThrower', function( SceneLib, MainView, Descriptors, ChainedDrop, ConsumableLib, CoC, EngineCore, Monster, Utils, AppearanceDefs, StatusAffects, Appearance, Combat, PerkLib ) {
	function GnollSpearThrower() {
		this.init(this, arguments);
	}
	angular.extend(GnollSpearThrower.prototype, Monster.prototype);
	GnollSpearThrower.prototype.hyenaPhysicalAttack = function() {
		var damage = 0;
		//return to combat menu when finished;
		EngineCore.doNext( MainView, MainView.playerMenu );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind attack!\n', false );
			//See below, removes the attack count once it hits rock bottom.;
			if( this.statusAffectv1( StatusAffects.Attacks ) === 0 ) {
				this.removeStatusAffect( StatusAffects.Attacks );
			}
			//Count down 1 attack then recursively call the function, chipping away at it.;
			if( this.statusAffectv1( StatusAffects.Attacks ) - 1 >= 0 ) {
				this.addStatusValue( StatusAffects.Attacks, 1, -1 );
				this.eAttack();
			}
			return;
		}
		//Determine if dodged!;
		if( Combat.combatMiss() ) {
			MainView.outputText( 'You see the gnoll\'s black lips pull back ever so slightly and the powerful muscles in her shapely thighs tense moments before she charges.  With a leap you throw yourself to the side, feeling the wind and fury pass through where you had just been standing.  You gracefully turn to face the hyena as she does the same, knowing that could have been very bad.', false );
			return;
		}
		//Determine if evaded;
		if( Combat.combatEvade() ) {
			MainView.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + this.a + this.short + '\'s attack.\n', false );
			//See below, removes the attack count once it hits rock bottom.;
			if( this.statusAffectv1( StatusAffects.Attacks ) === 0 ) {
				this.removeStatusAffect( StatusAffects.Attacks );
			}
			//Count down 1 attack then recursively call the function, chipping away at it.;
			if( this.statusAffectv1( StatusAffects.Attacks ) - 1 >= 0 ) {
				this.addStatusValue( StatusAffects.Attacks, 1, -1 );
				this.eAttack();
			}
			return;
		}
		//('Misdirection';
		if( Combat.combatMisdirect() ) {
			MainView.outputText( 'Using Raphael\'s teachings, you anticipate and sidestep ' + this.a + this.short + '\' attacks.\n', false );
			//See below, removes the attack count once it hits rock bottom.;
			if( this.statusAffectv1( StatusAffects.Attacks ) === 0 ) {
				this.removeStatusAffect( StatusAffects.Attacks );
			}
			//Count down 1 attack then recursively call the function, chipping away at it.;
			if( this.statusAffectv1( StatusAffects.Attacks ) - 1 >= 0 ) {
				this.addStatusValue( StatusAffects.Attacks, 1, -1 );
				this.eAttack();
			}
			return;
		}
		//Determine if cat'ed;
		if( Combat.combatFlexibility() ) {
			MainView.outputText( 'With your incredible flexibility, you squeeze out of the way of ' + this.a + this.short + '', false );
			if( this.plural ) {
				MainView.outputText( '\' attacks.\n', false );
			} else {
				MainView.outputText( '\'s attack.\n', false );
			}
			//See below, removes the attack count once it hits rock bottom.;
			if( this.statusAffectv1( StatusAffects.Attacks ) === 0 ) {
				this.removeStatusAffect( StatusAffects.Attacks );
			}
			//Count down 1 attack then recursively call the function, chipping away at it.;
			if( this.statusAffectv1( StatusAffects.Attacks ) - 1 >= 0 ) {
				this.addStatusValue( StatusAffects.Attacks, 1, -1 );
				this.eAttack();
			}
			return;
		}
		//Determine damage - str modified by enemy toughness!;
		damage = Math.ceil( (this.str + this.weaponAttack) - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
		if( damage > 0 ) {
			damage = CoC.player.takeDamage( damage );
		}
		if( damage <= 0 ) {
			damage = 0;
			//Due to toughness or amor...;
			if( Utils.rand( CoC.player.armorDef + CoC.player.tou ) < CoC.player.armorDef ) {
				MainView.outputText( 'The gnoll before you suddenly charges, almost too fast to see.  Twin fists slam into your ' + CoC.player.armorName + ' with enough force to stagger you, but the force is absorbed without doing any real damage.  As jaws powerful enough to crush bone flash at your neck, you are able to twist to the side, letting the furious hyena slip by you.', false );
			} else {
				MainView.outputText( 'You deflect and block every ' + this.weaponVerb + ' ' + this.a + this.short + ' throws at you.', false );
			}
		} else {
			if( damage < 10 ) {
				MainView.outputText( 'The gnoll runs forward, fury in her dark eyes as twin fists glance off your chest.  The glancing blow sends her off balance and the flashing ivory jaws barely miss your throat.  You push back, stumbling away from the furious hyena. (' + damage + ')', false );
			} else {
				MainView.outputText( 'The gnoll rushes forward, almost too fast to detect before twin fists slam into your torso.  Before you can recover, ivory jaws flash before your eyes and you feel the sharp teeth start to clamp onto the ' + CoC.player.skinDesc + ' of your neck.  Blinding pain causes you to fling yourself backwards, away from the teeth and drawing angry scrapes as you escape the jaws.  You roll away before picking yourself up, the hyena moving confidently towards you as you try to shake off the pain from the blow. (' + damage + ')', false );
			}
		}
		if( damage > 0 ) {
			if( this.short === 'fetish zealot' ) {
				MainView.outputText( '\nYou notice that some kind of unnatural heat is flowing into your body from the wound', false );
				if( CoC.player.inte > 50 ) {
					MainView.outputText( ', was there some kind of aphrodisiac on the knife?', false );
				} else {
					MainView.outputText( '.', false );
				}
				EngineCore.dynStats( 'lus', (CoC.player.lib / 20 + Utils.rand( 4 ) + 1) );
			}
			if( this.lustVuln > 0 && CoC.player.armorName === 'barely-decent bondage straps' ) {
				if( !this.plural ) {
					MainView.outputText( '\n' + this.getCapitalA() + this.short + ' brushes against your exposed skin and jerks back in surprise, coloring slightly from seeing so much of you revealed.', false );
				} else {
					MainView.outputText( '\n' + this.getCapitalA() + this.short + ' brush against your exposed skin and jerk back in surprise, coloring slightly from seeing so much of you revealed.', false );
				}
				this.lust += 5 * this.lustVuln;
			}
		}
		MainView.statsView.show();
		MainView.outputText( '\n', false );
		SceneLib.combatScene.combatRoundOver();
	};
	//<Writers note: I recommend that the javelin have a chance to greatly decrease speed for the remaining battle.  I am writing the flavor text for this event if you choose to include it>;
	GnollSpearThrower.prototype.hyenaJavelinAttack = function() {
		var damage = 0;
		var slow = 0;
		//<Hyena Attack 2 – Javelin – Unsuccessful – Dodged>;
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( 'The gnoll pulls a javelin from behind her and throws it at you, but blind as she is, it goes wide.', false );
		}
		//Determine if dodged!;
		else if( Combat.combatMiss() ) {
			MainView.outputText( 'The gnoll pulls a long, dark wooden javelin from over her shoulder.  Her spotted arm strikes forward, launching the missile through the air.  The spear flashes through the distance towards your vulnerable form.  Even as you see doom sailing towards you, a primal instinct to duck pulls you down, and you feel the wind from the massive missile as it passes close to your ear.', false );
		}
		//Determine if evaded;
		else if( Combat.combatEvade() ) {
			MainView.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + this.a + this.short + '\'s thrown spear.\n', false );
		}
		//('Misdirection';
		else if( Combat.combatMisdirect() ) {
			MainView.outputText( 'Using Raphael\'s teachings, you anticipate and sidestep ' + this.a + this.short + '\' thrown spear.\n', false );
		}
		//Determine if cat'ed;
		else if( Combat.combatFlexibility() ) {
			MainView.outputText( 'With your incredible flexibility, you squeeze out of the way of ' + this.a + this.short + '\'s thrown spear.', false );
		}
		//<Hyena Attack 2 – Javelin – Unsuccessful – Absorbed>;
		else if( CoC.player.armorDef > 10 && Utils.rand( 2 ) === 0 ) {
			MainView.outputText( 'The gnoll pulls a long, dark wooden javelin from over her shoulder.  Her spotted arm strikes forward, launching the missile through the air.  The spear flashes through the air but hits at an angle, sliding off your ' + CoC.player.armorName + ' without doing any damage.  It disappears into the grass.', false );
		} else if( CoC.player.findPerk( PerkLib.Resolute ) && CoC.player.tou >= 75 ) {
			MainView.outputText( 'You resolutely ignore the spear, brushing the blunted tip away when it hits you.\n' );
		}
		//<Hyena Attack 2 – Javelin – Successful – Player Entangled>;
		else if( Utils.rand( 3 ) >= 1 ) {
			damage = CoC.player.takeDamage( 25 + Utils.rand( 20 ) );
			MainView.outputText( 'The gnoll pulls a long, black javelin from over her shoulder.  Her spotted arm strikes forward, launching the missile through the air.  You attempt to dive to the side, but are too late.  The powerful shaft slams, hard, into your back.  Pain radiates from the powerful impact.  Instead of piercing you, however, the tip seems to explode into a sticky goo that instantly bonds with your ' + CoC.player.armorName + '.  The four foot, heavy shaft pulls down on you awkwardly, catching at things and throwing your balance off.  You try to tug the javelin off of you but find that it has glued itself to you.  It will take time and effort to remove; making it impossible to do while a dominant hyena stalks you. (' + damage + ')', false );
			if( !CoC.player.findStatusAffect( StatusAffects.GnollSpear ) ) {
				CoC.player.createStatusAffect( StatusAffects.GnollSpear, 0, 0, 0, 0 );
			}
			slow = 15;
			while( slow > 0 && CoC.player.spe > 2 ) {
				slow--;
				CoC.player.addStatusValue( StatusAffects.GnollSpear, 1, 1 );
				CoC.player.spe--;
				MainView.statsView.showStatDown( 'spe' );
			}
		}
		//<Hyena Attack 2 – Javelin – Successful – Player Not Entangled>;
		else {
			damage = CoC.player.takeDamage( 25 + Utils.rand( 20 ) );
			MainView.outputText( 'The gnoll pulls a long, dark wooden javelin from over her shoulder.  Her spotted arm strikes forward, launching the missile through the air.  The javelin flashes through the intervening distance, slamming into your chest.  The blunted tip doesn\'t skewer you, but pain radiates from the bruising impact. (' + damage + ')', false );
		}
		SceneLib.combatScene.combatRoundOver();
	};
	//<Writer's Note: With the third attack, I intend that the damage be increased based on the breast size of the player.  Thus, the text will vary if the player is flat-chested as indicated by colored text.>;
	GnollSpearThrower.prototype.hyenaSnapKicku = function() {
		var damage = 0;
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( 'The gnoll tries to catch you with a brutal snap-kick, but blind as she is, she completely misses.', false );
		}
		//Determine if dodged!;
		else if( Combat.combatMiss() ) {
			MainView.outputText( 'The gnoll grins at you before striding forward and pivoting.  A spotted leg snaps up and out, flashing through the air towards your ' + Descriptors.chestDesc() + '.  You step back just in time, robbing the blow of force.  The paw lightly strikes your torso before the female hyena springs back, glaring at you.', false );
		}
		//Determine if evaded;
		else if( Combat.combatEvade() ) {
			MainView.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + this.a + this.short + '\'s snap-kick.\n', false );
		}
		//('Misdirection';
		else if( Combat.combatMisdirect() ) {
			MainView.outputText( 'Using Raphael\'s teachings, you anticipate and sidestep ' + this.a + this.short + '\' snap-kick.\n', false );
		}
		//Determine if cat'ed;
		else if( Combat.combatFlexibility() ) {
			MainView.outputText( 'With your incredible flexibility, you squeeze out of the way of ' + this.a + this.short + '\'s snap-kick.', false );
		}
		//Determine damage - str modified by enemy toughness!;
		else {
			damage = CoC.player.biggestTitSize();
			if( damage > 20 ) {
				damage = 20;
			}
			damage += Math.ceil( this.str - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
			if( damage > 0 ) {
				damage = CoC.player.takeDamage( damage );
			}
			//No damage;
			if( damage <= 0 ) {
				MainView.outputText( 'The gnoll tries to catch your ' + Descriptors.chestDesc() + ' with a snap-kick, but you manage to block the vicious blow.', false );
			}
			//<Hyena Attack 3 – Snap Kick – Successful>;
			else {
				MainView.outputText( 'A glint enters the dark eyes of the gnoll before she strides forward and pivots.  A long, spotted leg snaps up and out to slam against your ' + Descriptors.chestDesc(), false );
				if( CoC.player.biggestTitSize() >= 1 ) {
					MainView.outputText( ', sending a wave of pain through the sensitive flesh', false );
				}
				MainView.outputText( '.  A small, traitorous part of you can\'t help but notice a flash of long, dark flesh beneath her loincloth even as you stagger back from the impact. (' + damage + ')', false );
				EngineCore.dynStats( 'lus', 2 );
			}
		}
		SceneLib.combatScene.combatRoundOver();
	};
	GnollSpearThrower.prototype.hyenaArousalAttack = function() {
		//Success = cor+lib > Utils.rand(150);
		var chance = Utils.rand( 150 );
		//<Hyena Attack 4 – Arousal Attack – Highly Successful>;
		if( CoC.player.cor + CoC.player.lib > chance + 50 ) {
			MainView.outputText( 'A wry grin spreads across the gnoll\'s face before she sprints towards you.  Too fast to follow, she flies forward, and you desperately brace for an impact that doesn\'t come.  Instead of striking you, two spotted paws clamp behind your neck and pull your head down, planting your face against her leather loincloth.  A powerful, musky smell burns in your nose and the feel of firm flesh behind the flimsy leather leaves a tingling sensation along your face.  She holds you there, pressed against her groin for several moments, desire growing deep within your body, before you find the strength and will to pull away.  The amazon grins, letting you stumble back as you try to fight off the feel of her body.\n\n', false );
			EngineCore.dynStats( 'lus', (25 + CoC.player.lib / 20 + CoC.player.sens / 5) );
		}
		//<Hyena Attack 4 – Arousal Attack – Mildly Successful>;
		else if( 20 + CoC.player.cor + CoC.player.lib > chance ) {
			MainView.outputText( 'A lazy grin spreads across the gnoll\'s face before she sprints towards you.  Too fast to follow, she flies forward, and you desperately brace for an impact that doesn\'t come.  Instead of striking you, two spotted paws clamp behind your neck and pull your head down, planting your face against her leather loincloth.  A powerful, musky smell burns in your nose and the feel of firm flesh behind the flimsy leather leaves a tingling sensation along your face.  Instinctively, you tear away from the hold, stumbling away from the sensations filling your mind, though some desire remains kindled within you.', false );
			EngineCore.dynStats( 'lus', (15 + CoC.player.lib / 20 + CoC.player.sens / 5) );
		}
		//<Hyena Attack 4 – Arousal Attack – Unsuccessful>;
		else {
			MainView.outputText( 'A knowing glint fills the dark eyes of the gnoll before she sprints forward.  Your muscles tense as she reaches you and starts to lock two spotted paws behind your neck.  She pulls you down towards her musky crotch, but just as you brush her loincloth, you twist away.  The hyena snarls in frustration, and you\'re left wondering if that was her idea of foreplay.', false );
		}
		SceneLib.combatScene.combatRoundOver();
	};
	GnollSpearThrower.prototype.eAttack = function() {
		var damage = 0;
		//return to combat menu when finished;
		EngineCore.doNext( MainView, MainView.playerMenu );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind attack!\n', false );
			//See below, removes the attack count once it hits rock bottom.;
			if( this.statusAffectv1( StatusAffects.Attacks ) === 0 ) {
				this.removeStatusAffect( StatusAffects.Attacks );
			}
			//Count down 1 attack then recursively call the function, chipping away at it.;
			if( this.statusAffectv1( StatusAffects.Attacks ) - 1 >= 0 ) {
				this.addStatusValue( StatusAffects.Attacks, 1, -1 );
				this.eAttack();
			}
		}
		//Determine if dodged!;
		if( Combat.combatMiss() ) {
			MainView.outputText( 'You see the gnoll\'s black lips pull back ever so slightly and the powerful muscles in her shapely thighs tense moments before she charges.  With a leap you throw yourself to the side, feeling the wind and fury pass through where you had just been standing.  You gracefully turn to face the hyena as she does the same, knowing that could have been very bad.', false );
		}
		//Determine if evaded;
		if( Combat.combatEvade() ) {
			MainView.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + this.a + this.short + '\'s attack.\n', false );
			//See below, removes the attack count once it hits rock bottom.;
			if( this.statusAffectv1( StatusAffects.Attacks ) === 0 ) {
				this.removeStatusAffect( StatusAffects.Attacks );
			}
			//Count down 1 attack then recursively call the function, chipping away at it.;
			if( this.statusAffectv1( StatusAffects.Attacks ) - 1 >= 0 ) {
				this.addStatusValue( StatusAffects.Attacks, 1, -1 );
				this.eAttack();
			}
		}
		//('Misdirection';
		if( Combat.combatMisdirect() ) {
			MainView.outputText( 'Using Raphael\'s teachings, you anticipate and sidestep ' + this.a + this.short + '\' attacks.\n', false );
			//See below, removes the attack count once it hits rock bottom.;
			if( this.statusAffectv1( StatusAffects.Attacks ) === 0 ) {
				this.removeStatusAffect( StatusAffects.Attacks );
			}
			//Count down 1 attack then recursively call the function, chipping away at it.;
			if( this.statusAffectv1( StatusAffects.Attacks ) - 1 >= 0 ) {
				this.addStatusValue( StatusAffects.Attacks, 1, -1 );
				this.eAttack();
			}
		}
		//Determine if cat'ed;
		if( Combat.combatFlexibility() ) {
			MainView.outputText( 'With your incredible flexibility, you squeeze out of the way of ' + this.a + this.short + '', false );
			if( this.plural ) {
				MainView.outputText( '\' attacks.\n', false );
			} else {
				MainView.outputText( '\'s attack.\n', false );
			}
			//See below, removes the attack count once it hits rock bottom.;
			if( this.statusAffectv1( StatusAffects.Attacks ) === 0 ) {
				this.removeStatusAffect( StatusAffects.Attacks );
			}
			//Count down 1 attack then recursively call the function, chipping away at it.;
			if( this.statusAffectv1( StatusAffects.Attacks ) - 1 >= 0 ) {
				this.addStatusValue( StatusAffects.Attacks, 1, -1 );
				this.eAttack();
			}
		}
		//Determine damage - str modified by enemy toughness!;
		damage = Math.ceil( (this.str + this.weaponAttack) - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
		if( damage > 0 ) {
			damage = CoC.player.takeDamage( damage );
		}
		if( damage <= 0 ) {
			damage = 0;
			//Due to toughness or amor...;
			if( Utils.rand( CoC.player.armorDef + CoC.player.tou ) < CoC.player.armorDef ) {
				MainView.outputText( 'The gnoll before you suddenly charges, almost too fast to see.  Twin fists slam into your ' + CoC.player.armorName + ' with enough force to stagger you, but the force is absorbed without doing any real damage.  As jaws powerful enough to crush bone flash at your neck, you are able to twist to the side, letting the furious hyena slip by you.', false );
			} else {
				MainView.outputText( 'You deflect and block every ' + this.weaponVerb + ' ' + this.a + this.short + ' throws at you.', false );
			}
		} else {
			if( damage < 10 ) {
				MainView.outputText( 'The gnoll runs forward, fury in her dark eyes as twin fists glance off your chest.  The glancing blow sends her off balance and the flashing ivory jaws barely miss your throat.  You push back, stumbling away from the furious hyena. (' + damage + ')', false );
			} else {
				MainView.outputText( 'The gnoll rushes forward, almost too fast to detect before twin fists slam into your torso.  Before you can recover, ivory jaws flash before your eyes and you feel the sharp teeth start to clamp onto the ' + CoC.player.skinDesc + ' of your neck.  Blinding pain causes you to fling yourself backwards, away from the teeth and drawing angry scrapes as you escape the jaws.  You roll away before picking yourself up, the hyena moving confidently towards you as you try to shake off the pain from the blow. (' + damage + ')', false );
			}
		}
		if( damage > 0 ) {
			if( this.short === 'fetish zealot' ) {
				MainView.outputText( '\nYou notice that some kind of unnatural heat is flowing into your body from the wound', false );
				if( CoC.player.inte > 50 ) {
					MainView.outputText( ', was there some kind of aphrodisiac on the knife?', false );
				} else {
					MainView.outputText( '.', false );
				}
				EngineCore.dynStats( 'lus', (CoC.player.lib / 20 + Utils.rand( 4 ) + 1) );
			}
			if( this.lustVuln > 0 && CoC.player.armorName === 'barely-decent bondage straps' ) {
				if( !this.plural ) {
					MainView.outputText( '\n' + this.getCapitalA() + this.short + ' brushes against your exposed skin and jerks back in surprise, coloring slightly from seeing so much of you revealed.', false );
				} else {
					MainView.outputText( '\n' + this.getCapitalA() + this.short + ' brush against your exposed skin and jerk back in surprise, coloring slightly from seeing so much of you revealed.', false );
				}
				this.lust += 5 * this.lustVuln;
			}
		}
		MainView.statsView.show();
		MainView.outputText( '\n', false );
		SceneLib.combatScene.combatRoundOver();
	};
	GnollSpearThrower.prototype.defeated = function() {
		if( this.short === 'alpha gnoll' ) {
			MainView.clearOutput();
			MainView.outputText( 'The gnoll alpha is defeated!  You could use her for a quick, willing fuck to sate your lusts before continuing on.  Hell, you could even dose her up with that succubi milk you took from the goblin first - it might make her even hotter.  Do you?' );
			MainView.menu();
			EngineCore.addButton( 0, 'Fuck', SceneLib.urtaQuest, CoC.urtaQuest.winRapeHyenaPrincess );
			EngineCore.addButton( 1, 'Succ Milk', SceneLib.urtaQuest, CoC.urtaQuest.useSuccubiMilkOnGnollPrincesses );
			EngineCore.addButton( 4, 'Leave', SceneLib.urtaQuest, CoC.urtaQuest.urtaNightSleep );
		} else {
			SceneLib.gnollSpearThrowerScene.hyenaVictory();
		}
	};
	/* jshint unused:true */
	GnollSpearThrower.prototype.won = function( hpVictory, pcCameWorms ) {
		if( this.short === 'alpha gnoll' ) {
			CoC.urtaQuest.loseToGnollPrincessAndGetGangBanged();
		} else if( pcCameWorms ) {
			MainView.outputText( '\n\nYour foe doesn\'t seem put off enough to leave...' );
			EngineCore.doNext( SceneLib.combatScene, SceneLib.combatScene.endLustLoss );
		} else {
			SceneLib.gnollSpearThrowerScene.hyenaSpearLossAnal();
		}
	};
	GnollSpearThrower.prototype.init = function(that, args) {
		Monster.prototype.init(that, args);
		that.classNames.push('GnollSpearThrower');
		that.a = 'the ';
		that.short = 'gnoll spear-thrower';
		that.imageName = 'gnollspearthrower';
		that.long = 'You are fighting a gnoll.  An amalgam of voluptuous, sensual lady and snarly, pissed off hyena, she clearly intends to punish you for trespassing.  Her dark-tan, spotted hide blends into a soft cream-colored fur covering her belly and two D-cup breasts, leaving two black nipples poking through the fur.  A crude loincloth is tied around her waist, obscuring her groin from view.  A leather strap cuts between her heavy breasts, holding a basket of javelins on her back.  Large, dish-shaped ears focus on you, leaving no doubt that she can hear every move you make.  Sharp, dark eyes are locked on your body, filled with aggression and a hint of lust.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_DROOLING, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createBreastRow( Appearance.breastCupInverse( 'D' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 25, 0, 0, 0 );
		that.tallness = 72;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE;
		that.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		that.skinTone = 'tawny';
		that.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		that.hairColor = 'black';
		that.hairLength = 22;
		that.initStrTouSpeInte( 85, 60, 100, 50 );
		that.initLibSensCor( 65, 45, 60 );
		that.weaponName = 'teeth';
		that.weaponVerb = 'bite';
		that.weaponAttack = 0;
		that.weaponPerk = '';
		that.weaponValue = 25;
		that.armorName = 'skin';
		that.armorDef = 2;
		that.bonusHP = 250;
		that.lust = 30;
		that.lustVuln = 0.35;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 10;
		that.gems = 10 + Utils.rand( 5 );
		that.drop = new ChainedDrop().add( ConsumableLib.GROPLUS, 1 / 5 ).add( ConsumableLib.INCUBID, 1 / 2 ).elseDrop( ConsumableLib.BROWN_D );
		that.special1 = this.hyenaJavelinAttack;
		that.special2 = this.hyenaSnapKicku;
		that.special3 = this.hyenaArousalAttack;
		that.checkMonster();
	};
	return GnollSpearThrower;
} );