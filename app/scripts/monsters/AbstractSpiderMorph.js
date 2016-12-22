'use strict';

angular.module( 'cocjs' ).factory( 'AbstractSpiderMorph', function( MainView, kFLAGS, WeaponLib, CoC, EngineCore, Monster, Utils, StatusAffects, Combat, PerkLib ) {
	function AbstractSpiderMorph() {
		this.init(this, arguments);
	}
	angular.extend(AbstractSpiderMorph.prototype, Monster.prototype);
	AbstractSpiderMorph.prototype.performCombatAction = function() {
		if( CoC.player.spe >= 2 && Utils.rand( 2 ) === 0 ) {
			this.spiderMorphWebAttack();
		} else if( CoC.player.findStatusAffect( StatusAffects.WebSilence ) < 0 && Utils.rand( 3 ) === 0 ) {
			this.spiderSilence();
		} else if( CoC.player.findStatusAffect( StatusAffects.Disarmed ) < 0 && CoC.player.weaponName !== 'fists' && Utils.rand( 3 ) === 0 ) {
			this.spiderDisarm();
		} else if( Utils.rand( 2 ) === 0 || CoC.player.spe < 2 ) {
			this.getBitten();
		} else {
			this.eAttack();
		}
	};
	/**
	 * -Web - lowers speed by 25 each application and disables
	 * flight once hit.*/
	AbstractSpiderMorph.prototype.spiderMorphWebAttack = function() {
		MainView.outputText( 'Turning to the side, ' + this.a + this.short + ' raises ' + this.mf( 'his', 'her' ) + ' abdomen and unleashes a spray of webbing in your direction!  ', false );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' misses completely due to their blindness.', false );
		}
		//Determine if dodged!;
		else if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			MainView.outputText( 'You dodge away, avoiding the sticky strands!', false );
		}
		//Determine if evaded;
		else if( CoC.player.findPerk( PerkLib.Evade ) && Utils.rand( 100 ) < 10 ) {
			MainView.outputText( 'You evade, avoiding the sticky strands!', false );
		}
		//('Misdirection';
		else if( CoC.player.findPerk( PerkLib.Misdirection ) && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'Your misleading movements allow you to easily sidestep the sticky strands!', false );
		}
		//Determine if cat'ed;
		else if( CoC.player.findPerk( PerkLib.Flexibility ) && Utils.rand( 100 ) < 6 ) {
			MainView.outputText( 'You throw yourself out of the way with cat-like agility at the last moment, avoiding ' + this.mf( 'his', 'her' ) + ' attack.\n', false );
		}
		//Got hit;
		else {
			if( CoC.player.findStatusAffect( StatusAffects.Web ) < 0 ) {
				MainView.outputText( 'The silky strands hit you, webbing around you and making it hard to move with any degree of speed.', false );
				if( CoC.player.canFly() ) {
					MainView.outputText( '  Your wings struggle uselessly in the bindings, no longer able to flap fast enough to aid you.', false );
				}
				MainView.outputText( '\n', false );
				CoC.player.createStatusAffect( StatusAffects.Web, 0, 0, 0, 0 );
			} else {
				MainView.outputText( 'The silky strands hit you, weighing you down and restricting your movement even further.\n', false );
			}
			//Only apply as much speed slow as necessary.;
			var amount = 25;
			if( CoC.player.spe - amount < 1 ) {
				amount = CoC.player.spe - 1;
			}
			//Apply changes, display arrows, and track speed lost;
			CoC.player.spe -= amount;
			MainView.statsView.showStatDown( 'spe' );
			CoC.player.addStatusValue( StatusAffects.Web, 1, amount );
		}
		Combat.combatRoundOver();
	};
	/**-Bite - Raises arousal by 30*/
	AbstractSpiderMorph.prototype.getBitten = function() {
		//-Languid Bite - Inflicted on PC's who have been reduced to 1 speed by webbing, raises arousal by 60.;
		if( CoC.player.spe < 2 && CoC.player.findStatusAffect( StatusAffects.Web ) >= 0 ) {
			MainView.outputText( 'The arachnid aggressor slowly saunters forward while you struggle under the heaps of webbing, gently placing ' + this.mf( 'his', 'her' ) + ' arms around your back in a tender hug.  ' + this.mf( 'His', 'Her' ) + ' fangs slide into your neck with agonizing slowness, immediately setting off a burning heat inside you that makes you dizzy and weak.  ', false );
			if( CoC.player.hasCock() ) {
				MainView.outputText( CoC.player.SMultiCockDesc() + ' turns rock hard and squirts weakly, suddenly so aroused that it starts soaking your ' + CoC.player.armorName, false );
				if( CoC.player.hasVagina() ) {
					MainView.outputText( ' along with your ' + CoC.player.vaginaDescript(), false );
				}
				MainView.outputText( '.  ', false );
			} else if( CoC.player.hasVagina() ) {
				MainView.outputText( 'Your ' + CoC.player.vaginaDescript() + ' grows wet as hell and so sensitive that every step and movement reminds you of the powerful need for something between your sopping nether-lips.  ', false );
			}
			MainView.outputText( 'While ' + this.mf( 'his', 'her' ) + ' venom pours into you, the spider-' + this.mf( 'boy', 'girl' ) + ' reaches into your gear to play with your ' + CoC.player.nippleDescript( 0 ) + ', and you moan like a whore from the dual stimulation of ' + this.mf( 'his', 'her' ) + ' venom and nipple-play.\n\n', false );
			if( this.hasVagina() ) {
				MainView.outputText( 'The saucy dominatrix exhausts her supply of aphrodisiac toxin for the moment and finally steps back, admiring her work and giving you a lewd wink.  You ', false );
			} else {
				MainView.outputText( 'The confident male exhausts his supply of aphrodisiac toxin for the moment and finally steps back, admiring his work and giving you a lewd wink.  You ', false );
			}
			EngineCore.dynStats( 'lus', 60 );
			if( CoC.player.lust > 99 ) {
				MainView.outputText( 'wobble, utterly defeated and about to cave in to your lust.', false );
			} else {
				MainView.outputText( 'struggle not to fall down and start masturbating on the spot.', false );
			}
			MainView.outputText( '\n', false );
			Combat.combatRoundOver();
			return;
		}
		MainView.outputText( 'The spider-' + this.mf( 'boy', 'girl' ) + ' lunges forward with ' + this.mf( 'his', 'her' ) + ' mouth open, ' + this.mf( 'his', 'her' ) + ' two needle-like fangs closing rapidly.  ', false );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' misses completely due to their blindness.', false );
		}
		//Determine if dodged!;
		else if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			MainView.outputText( 'You dodge away, avoiding ' + this.mf( 'his', 'her' ) + ' bite!', false );
		}
		//Determine if evaded;
		else if( CoC.player.findPerk( PerkLib.Evade ) && Utils.rand( 100 ) < 10 ) {
			MainView.outputText( 'You evade, avoiding the bite!', false );
		}
		//('Misdirection';
		else if( CoC.player.findPerk( PerkLib.Misdirection ) && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'Your misleading movements allow you to easily sidestep the spider bite!', false );
		}
		//Determine if cat'ed;
		else if( CoC.player.findPerk( PerkLib.Flexibility ) && Utils.rand( 100 ) < 6 ) {
			MainView.outputText( 'You throw yourself out of the way with cat-like agility at the last moment, avoiding ' + this.mf( 'his', 'her' ) + ' attack.\n', false );
		} else {
			if( Utils.rand( 5 ) === 0 ) {
				MainView.outputText( 'You react far too slowly, and before you can even think to dodge, ' + this.mf( 'he', 'she' ) + '\'s bitten deep into you, pumping large squirts of venom deep into your body.  Unnatural heat rolls through you, pooling in your groin until you\'re lewdly bucking your hips against the spider-morph\'s thigh.  ' + this.mf( 'He', 'She' ) + ' pulls out and steps back, ', false );
				if( this.hasVagina() ) {
					MainView.outputText( 'casually cupping her breasts while you watch with venom-dilated eyes, slowly touching yourself.  Once she stops, you shake your head and master yourself, remembering that you\'re supposed to be fighting this ' + this.mf( 'boy', 'girl' ) + '!\n', false );
				} else {
					MainView.outputText( 'casually tugging on his relatively short, girthy dick as you watch with venom-dilated eyes, slowly touching yourself.  Once he stops, you shake your head and master yourself, remembering that you\'re supposed to be fighting this ' + this.mf( 'boy', 'girl' ) + '!\n', false );
				}
				EngineCore.dynStats( 'lus', 50 );
			} else {
				MainView.outputText( 'You react too slowly, and before you can dodge, ' + this.mf( 'he', 'she' ) + '\'s bitten you, leaving behind a burning venom that warms your blood and stokes your lust.\n', false );
				EngineCore.dynStats( 'lus', 30 );
			}
		}
		Combat.combatRoundOver();
	};
	/**-Disarm - hits the PC's weapon with web and sticks it to a
	 nearby tree, reducing PC's attack to 0 for the rest of the fight.*/
	AbstractSpiderMorph.prototype.spiderDisarm = function() {
		MainView.outputText( this.getCapitalA() + this.short + ' shifts and sprays webbing, aiming a tight strand of it at your ' + CoC.player.weaponName + '.  ', false );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( 'The blind web-shot goes horribly wide, missing you entirely.', false );
		}
		//Determine if dodged!;
		else if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			MainView.outputText( 'You pull your weapon back and the webbing goes wide, missing entirely.', false );
		}
		//Determine if evaded;
		else if( CoC.player.findPerk( PerkLib.Evade ) && Utils.rand( 100 ) < 10 ) {
			MainView.outputText( 'You pull your weapon back evasively and the webbing goes wide, missing entirely!', false );
		}
		//('Misdirection';
		else if( CoC.player.findPerk( PerkLib.Misdirection ) && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'Your misleading movements allow you to easily sidestep the webbing!', false );
		}
		//Determine if cat'ed;
		else if( CoC.player.findPerk( PerkLib.Flexibility ) && Utils.rand( 100 ) < 6 ) {
			MainView.outputText( 'You throw yourself out of the way with cat-like agility at the last moment, avoiding ' + this.mf( 'his', 'her' ) + ' attack.\n', false );
		} else if( CoC.player.weaponName === 'spiked gauntlet' || CoC.player.weaponName === 'hooked gauntlets' ) {
			MainView.outputText( 'The webbing hits your ', false );
			if( CoC.player.weaponName === 'spiked gauntlet' ) {
				MainView.outputText( 'gauntlet, but it\'s so effectively fastened to your hands that the attack fails to disarm you.\n', false );
			} else {
				MainView.outputText( 'gauntlets, but they\'re so effectively fastened to your hands that the attack fails to disarm you.\n', false );
			}
		} else {
			MainView.outputText( 'You don\'t react fast enough and the sticky webbing pulls your ' + CoC.player.weaponName + ' out of your grip, gluing it to a nearby tree.  There\'s no way to get it back right now, you\'ll have to fight bare-handed!', false );
			CoC.flags[ kFLAGS.PLAYER_DISARMED_WEAPON_ID ] = CoC.player.weapon.id;
			CoC.player.setWeapon( WeaponLib.FISTS );
			//No longer appears to be used				flags[kFLAGS.PLAYER_DISARMED_WEAPON_ATTACK] = CoC.player.weaponAttack;;
			//				CoC.player.weapon.unequip(CoC.player,false,true);;
			CoC.player.createStatusAffect( StatusAffects.Disarmed, 0, 0, 0, 0 );
		}
		Combat.combatRoundOver();
	};
	/**-Silence - sprays webs on the PC's mouth, silencing them for 1 to 3 turns.*/
	AbstractSpiderMorph.prototype.spiderSilence = function() {
		MainView.outputText( this.getCapitalA() + this.short + ' squirts a concentrated spray of ' + this.mf( 'his', 'her' ) + ' webs directly at your face!  ', false );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( 'The blind web-shot goes horribly wide, missing you entirely.', false );
		}
		//Determine if dodged!;
		else if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			MainView.outputText( 'You lean back and let them pass harmlessly overhead, avoiding the attack.', false );
		}
		//Determine if evaded;
		else if( CoC.player.findPerk( PerkLib.Evade ) && Utils.rand( 100 ) < 10 ) {
			MainView.outputText( 'You pull your weapon back evasively and the webbing goes wide, missing entirely.', false );
		}
		//('Misdirection';
		else if( CoC.player.findPerk( PerkLib.Misdirection ) && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'Your misleading movements allow you to easily sidestep the webbing!', false );
		}
		//Determine if cat'ed;
		else if( CoC.player.findPerk( PerkLib.Flexibility ) && Utils.rand( 100 ) < 6 ) {
			MainView.outputText( 'You throw yourself out of the way with cat-like agility at the last moment, avoiding ' + this.mf( 'his', 'her' ) + ' attack.\n', false );
		} else {
			MainView.outputText( 'They hit you before you can move, covering most of your nose and mouth and making it hard to breathe.  You\'ll be unable to use your magic while you\'re constantly struggling just to draw air!\n', false );
			CoC.player.createStatusAffect( StatusAffects.WebSilence, 0, 0, 0, 0 );
		}
		Combat.combatRoundOver();
	};
	return AbstractSpiderMorph;
} );