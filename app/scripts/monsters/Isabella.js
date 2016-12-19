'use strict';

angular.module( 'cocjs' ).factory( 'Isabella', function( SceneLib, MainView, PerkLib, CoC, Monster, Utils, StatusAffects, Appearance, AppearanceDefs, Combat, EngineCore ) {
	function Isabella() {
		this.init(this, arguments);
	}
	angular.extend(Isabella.prototype, Monster.prototype);
	//IZZY AI:;
	//Isabella Combat texttttttsss;
	Isabella.prototype.isabellaAttack = function() {
		//[Standard attack];
		MainView.outputText( 'Isabella snorts and lowers a shield a moment before she begins to charge towards you. Her hooves tear huge divots out of the ground as she closes the distance with surprising speed!  ', false );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( 'Isabella blindly tries to charge at you, but misses completely.\n', false );
		}
		//Determine if dodged!;
		else if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			MainView.outputText( 'You duck aside at the last moment, relying entirely on your speed.\n', false );
		}
		//Determine if evaded;
		else if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			MainView.outputText( 'You easily evade her incredibly linear attack.\n', false );
		}
		//('Misdirection';
		else if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'You easily misdirect her and step aside at the last moment.\n', false );
		}
		//Determine if cat'ed;
		else if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
			MainView.outputText( 'You throw yourself out of the way with cat-like agility at the last moment, avoiding her attack.\n', false );
		} else {
			var damage;
			damage = Math.round( (this.weaponAttack + this.str + 20) - Utils.rand( CoC.player.tou + CoC.player.armorDef ) );
			if( damage < 0 ) {
				MainView.outputText( 'You brace yourself and catch her shield in both hands, dragging through the dirt as you slow her charge to a stop.  She gapes down, completely awestruck by the show of power.', false );
			} else {
				damage = CoC.player.takeDamage( damage );
				MainView.outputText( 'She\'s coming too fast to dodge, and you\'re forced to try to stop her.  It doesn\'t work.  Isabella\'s shield hits you hard enough to ring your ears and knock you onto your back with bruising force. (' + damage + ')\n', false );
			}
		}
		Combat.combatRoundOver();
	};
	Isabella.prototype.isabellaStun = function() {
		//[Stunning Impact];
		MainView.outputText( 'Isabella spins her shield back at you in a potent, steel-assisted backhand.  ', false );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( 'Isabella blindly tries to charge at you, but misses completely.\n', false );
		}
		//Determine if dodged!;
		else if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			MainView.outputText( 'You duck aside at the last moment, relying entirely on your speed.\n', false );
		}
		//Determine if evaded;
		else if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			MainView.outputText( 'You easily evade her incredibly linear attack.\n', false );
		}
		//('Misdirection';
		else if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'You easily misdirect her and step aside at the last moment.\n', false );
		}
		//Determine if cat'ed;
		else if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
			MainView.outputText( 'You bend backward with cat-like agility to avoid her attack.\n', false );
		} else {
			var damage = 0;
			damage = Math.round( (this.weaponAttack + this.str) - Utils.rand( CoC.player.tou + CoC.player.armorDef ) );
			if( damage < 0 ) {
				MainView.outputText( 'You deflect her blow away, taking no damage.\n', false );
				damage = 0;
			} else if( CoC.player.findPerk( PerkLib.Resolute ) >= 0 && CoC.player.tou >= 75 ) {
				MainView.outputText( 'You resolutely ignore the blow thanks to your immense toughness.\n' );
				damage = 0;
			} else {
				damage = CoC.player.takeDamage( damage );
				MainView.outputText( 'You try to avoid it, but her steely attack connects, rocking you back.  You stagger about while trying to get your bearings, but it\'s all you can do to stay on your feet.  <b>Isabella has stunned you!</b> (' + damage + ')\n', false );
				CoC.player.createStatusAffect( StatusAffects.IsabellaStunned, 0, 0, 0, 0 );
			}
		}
		Combat.combatRoundOver();
	};
	Isabella.prototype.isabellaThroatPunch = function() {
		MainView.outputText( 'Isabella punches out from behind her shield in a punch aimed right at your throat!  ', false );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( 'Isabella blindly tries to charge at you, but misses completely.\n', false );
		}
		//Determine if dodged!;
		else if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			MainView.outputText( 'You duck aside at the last moment, relying entirely on your speed.\n', false );
		}
		//Determine if evaded;
		else if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			MainView.outputText( 'You easily evade her incredibly linear attack.\n', false );
		}
		//('Misdirection';
		else if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'You easily misdirect her and step aside at the last moment.\n', false );
		}
		//Determine if cat'ed;
		else if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
			MainView.outputText( 'You bend backward with cat-like agility to avoid her attack.\n', false );
		} else {
			var damage;
			damage = Math.round( this.str - Utils.rand( CoC.player.tou + CoC.player.armorDef ) );
			if( damage <= 0 ) {
				MainView.outputText( 'You manage to block her with your own fists.\n', false );
			} else if( CoC.player.findPerk( PerkLib.Resolute ) >= 0 && CoC.player.tou >= 75 ) {
				MainView.outputText( 'You resolutely ignore the blow thanks to your immense toughness.\n' );
			} else {
				damage = CoC.player.takeDamage( damage );
				MainView.outputText( 'You try your best to stop the onrushing fist, but it hits you square in the throat, nearly collapsing your windpipe entirely.  Gasping and sputtering, you try to breathe, and while it\'s difficult, you manage enough to prevent suffocation. <b>It will be impossible to focus to cast a spell in this state!</b> (' + damage + ')\n', false );
				CoC.player.createStatusAffect( StatusAffects.ThroatPunch, 2, 0, 0, 0 );
			}
		}
		Combat.combatRoundOver();
	};
	//[Milk Self-Heal];
	Isabella.prototype.drankMalkYaCunt = function() {
		MainView.outputText( 'Isabella pulls one of her breasts out of her low-cut shirt and begins to suckle at one of the many-tipped nipples. Her cheeks fill and hollow a few times while you watch with spellbound intensity.  She finishes and tucks the weighty orb away, blushing furiously.  The quick drink seems to have reinvigorated her, and watching it has definitely aroused you.', false );
		this.HP += 100;
		this.lust += 5;
		EngineCore.dynStats( 'lus', (10 + CoC.player.lib / 20) );
		Combat.combatRoundOver();
	};
	Isabella.prototype.performCombatAction = function() {
		//-If below 70% HP, 50% chance of milk drinking;
		if( this.HPRatio() < 0.7 && Utils.rand( 3 ) === 0 ) {
			this.drankMalkYaCunt();
		}//if PC has spells and isn't silenced, 1/3 chance of silence.;
		else if( CoC.player.hasSpells() && CoC.player.findStatusAffect( StatusAffects.ThroatPunch ) < 0 && Utils.rand( 3 ) === 0 ) {
			this.isabellaThroatPunch();
		}
		//if PC isn't stunned, 1/4 chance of stun;
		else if( CoC.player.findStatusAffect( StatusAffects.IsabellaStunned ) < 0 && Utils.rand( 4 ) === 0 ) {
			this.isabellaStun();
		} else {
			this.isabellaAttack();
		}
	};
	Isabella.prototype.defeated = function() {
		CoC.isabellaScene.defeatIsabella();
	};
	Isabella.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			MainView.outputText( '\n\n"<i>Ick,</i>" Isabella tuts as she turns to leave...' );
			Combat.cleanupAfterCombat();
		} else {
			SceneLib.isabellaScene.isabellaDefeats();
		}
	};
	Isabella.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Isabella');
		that.a = '';
		that.short = 'Isabella';
		that.imageName = 'isabella';
		that.long = 'Isabella is a seven foot tall, red-headed tower of angry cow-girl.  She\'s snarling at you from behind her massive shield, stamping her hooves in irritation as she prepares to lay into you.  Her skin is dusky, nearly chocolate except for a few white spots spattered over her body.  She wears a tight silk shirt and a corset that barely supports her bountiful breasts, but it\'s hard to get a good look at them behind her giant shield.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_DROOLING, AppearanceDefs.VAGINA_LOOSENESS_GAPING );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 45, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'EE+' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_VIRGIN;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 38, 0, 0, 0 );
		that.tallness = 7 * 12 + 6;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE + 1;
		that.skinTone = 'dusky';
		that.hairColor = 'red';
		that.hairLength = 13;
		that.initStrTouSpeInte( 70, 98, 75, 65 );
		that.initLibSensCor( 65, 25, 40 );
		that.weaponName = 'giant shield';
		that.weaponVerb = 'smash';
		that.weaponAttack = 15;
		that.armorName = 'giant shield';
		that.armorDef = 8;
		that.armorPerk = '';
		that.armorValue = 70;
		that.bonusHP = 700;
		that.lust = 30;
		that.lustVuln = 0.35;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 15;
		that.gems = Utils.rand( 5 ) + 20;
		that.tailType = AppearanceDefs.TAIL_TYPE_COW;
		that.tailRecharge = 0;
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return Isabella;
} );