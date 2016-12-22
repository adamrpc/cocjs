'use strict';

angular.module( 'cocjs' ).factory( 'Kiha', function( SceneLib, MainView, StatusAffects, Appearance, PerkLib, CoC, Monster, Utils, AppearanceDefs, Combat, EngineCore ) {
	function Kiha() {
		this.init(this, arguments);
	}
	angular.extend(Kiha.prototype, Monster.prototype);
	Kiha.prototype.kihaTimeWaster = function() {
		MainView.spriteSelect( 72 );
		MainView.outputText( 'She supports the axe on a shoulder, cracking her neck and arching her back to stretch herself, giving you an unintended show.  ', false );
		EngineCore.dynStats( 'lus', 5 );
		Combat.combatRoundOver();
	};
	//This could be silly mode worthy! Should Expand? oh ok;
	Kiha.prototype.sillyModeKihaAttack = function() {
		MainView.spriteSelect( 72 );
		MainView.outputText( 'Before you can stop to think, the dragon-woman steps back - throwing her axe into the air before she starts sprinting towards you. In seconds she\'s reached a hair\'s distance between her lithe form and your own, her fist recoiling and time seemingly stopping to allow you to note the powerful energy seeping from her arms.  ', false );
		//Miss:;
		if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			MainView.outputText( 'You take the opportunity to walk away, watching the slow-motion attack unravel before you; the fire bursts from her knuckle in the shape of a bird in flight, wings unfurled.  ', false );
			if( Utils.rand( 2 ) === 0 ) {
				MainView.outputText( 'You only owned an XJasun back home, so you don\'t really understand the reference.', false );
			} else {
				MainView.outputText( 'You stifle a laugh as your memories turn to many an evening spent with your friends in front of your SharkCube console, contesting each other in games of ridiculous, stylized combat.', false );
			}
		} else {
			//Determine damage - str modified by enemy toughness!;
			var damage = Math.ceil( (this.str + this.weaponAttack) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef );
			damage += 5;
			damage = CoC.player.takeDamage( damage );
			MainView.outputText( 'A torrent of heat bursts from between her fingertips as she thrusts her clenched fist forward, the ball of intense flame writhing and burning with a fury unknown to mankind. With one fell swoop, the combined power of her love, anger, and sorrow pushes you backward, launching you out of the swamp and into Marble\'s pillowy chest. "<i>Ara ara,</i>" she begins, but you\'ve already pushed yourself away from the milky hell-prison as you run back towards ' );
			if( !SceneLib.kihaFollower.followerKiha() ) {
				MainView.outputText( 'the swamp' );
			} else {
				MainView.outputText( 'the fight' );
			}
			MainView.outputText( '. (' + damage + ')\n', false );
			if( CoC.player.HP >= 1 ) {
				MainView.outputText( 'You follow the shrill cry of "<i>B-BAKA!</i>" in the distance until you reach the exact location you were in a few seconds earlier, prepared to fight again.', false );
			}
		}
		Combat.combatRoundOver();
	};
	Kiha.prototype.kihaFirePunch = function() {
		MainView.spriteSelect( 72 );
		MainView.outputText( 'The draconic girl throws her trusty weapon into the sodden ground, using the distraction to build up balls of flame around her fists.  She runs towards you, launching herself in your direction with a flurry of punches.\n', false );
		//Dodged;
		if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			MainView.outputText( 'You manage to jump to the side, intense heat rushing past you as you narrowly avoid her advance.  You twist around, finding that she\'s reunited with her axe and angrier than before.', false );
		}
		//Determine if evaded;
		else if( CoC.player.findPerk( PerkLib.Evade ) && Utils.rand( 100 ) < 10 ) {
			MainView.outputText( 'Using your skills at evasion, you manage to jump to the side, intense heat rushing past you as you narrowly avoid her advance.  You twist around, finding that she\'s reunited with her axe and angrier than before.', false );
		}
		//('Misdirection';
		else if( CoC.player.findPerk( PerkLib.Misdirection ) && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'Using your skills at misdirection, you manage to make Kiha think you\'re going to dodge one way before stepping in the other direction.  You turn back, finding she has her axe in hand and looks rather steamed.', false );
		}
		//Determine if cat'ed;
		else if( CoC.player.findPerk( PerkLib.Flexibility ) && Utils.rand( 100 ) < 6 ) {
			MainView.outputText( 'Using your cat-like reflexes, you manage to jump to the side, intense heat rushing past you as you narrowly avoid her advance.  You twist around, finding that she\'s reunited with her axe and angrier than before.', false );
		}
		//HIT!;
		else {
			var damage = Math.ceil( this.str - (CoC.player.armorDef) );
			damage = CoC.player.takeDamage( damage );
			MainView.outputText( 'Before you can react, you\'re struck by the power of her blows, feeling an intense pain in your chest as each fist makes contact.  With a final thrust, you\'re pushed backwards onto the ground; the dragoness smiles as she pulls her axe out of the ground, her hands still steaming from the fingertips. (' + damage + ')\n', false );
		}
		Combat.combatRoundOver();
	};

	//Fire breath;
	Kiha.prototype.kihaFireBreath = function() {
		MainView.spriteSelect( 72 );
		MainView.outputText( 'Kiha throws her arms back and roars, exhaling a swirling tornado of fire directly at you!\n', false );
		//Miss:;
		//Determine if evaded;
		if( CoC.player.findPerk( PerkLib.Evade ) && Utils.rand( 100 ) < 10 ) {
			MainView.outputText( 'Using your talent for evasion, you manage to sidestep the flames in the nick of time; much to the dragoness\' displeasure.', false );
		}
		//('Misdirection';
		else if( CoC.player.findPerk( PerkLib.Misdirection ) && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'Using your talent for misdirection, you manage to sidestep the flames in the nick of time; much to the dragoness\' displeasure.', false );
		}
		//Determine if cat'ed;
		else if( CoC.player.findPerk( PerkLib.Flexibility ) && Utils.rand( 100 ) < 6 ) {
			MainView.outputText( 'Using your cat-like flexibility, you manage to sidestep the flames in the nick of time; much to the dragoness\' displeasure.', false );
		} else {
			var damage = Math.round( 90 + Utils.rand( 10 ) );
			damage = CoC.player.takeDamage( damage );
			MainView.outputText( 'You try to avoid the flames, but you\'re too slow!  The inferno slams into you, setting you alight!  You drop and roll on the ground, putting out the fires as fast as you can.  As soon as the flames are out, you climb back up, smelling of smoke and soot. (' + damage + ')\n', false );
		}
		Combat.combatRoundOver();
	};
	/*
	 Special 2 lifts her axe overhead and then hurls it at you in a surprising feat of speed and strength. Not keen on getting cleaved in two, you sidestep the jagged metal.
	 Hit: But when your attention refocuses on the dragoness, you realize she's right in front of you! She hits you in the face with a vicious straight punch, knocking you on your back.
	 Miss: When your gaze returns to the dragoness, you realize she's right in front of you! Luckily your reflexes are good enough that you manage to duck under the incoming punch. By the time you've recovered, Kiha is already standing, battle-ready and axe in hand. (uh, no? in the time it takes the PC to unbend from a simple duck, she's already disentangled herself from close quarters, run over to where the axe landed on the opposite side of him, extracted it from whatever it may be stuck in, and toted it back to the player? do it again with sense; she should be stunned or disarmed for at least a turn if she misses -Z)
	 Special 3 suddenly lets out a roar, swings her axe down and then charges headlong at you!
	 Hit: Like a runaway boulder, the dragoness slams into you, brutally propelling you to the ground, jarring bone and leaving you dazed. //Stun effect applies for 2 rounds//
	 Miss: You nimbly turn aside and roll her off your shoulder at the last moment, leaving her ploughing on uncontrollably until she (catches her foot in a sinkhole and twists her ankle painfully, faceplanting in the bog)/(slams headfirst into a half-rotten tree with a shower of mouldering splinters). She quickly rights herself and turns to face you, but it clearly took its toll on her. //Kiha takes damage//
	 */
	Kiha.prototype.handleFear = function() {
		this.removeStatusAffect( StatusAffects.Fear );
		MainView.outputText( 'Kiha shudders for a moment, then looks your way with a clear head.  "<i>Fear was the first thing the demons taught us to overcome.  Do you think it would stay my blade?</i>"\n', false );
		return true;
	};
	Kiha.prototype.handleBlind = function() {
		return true;
	};

	Kiha.prototype._superPostAttack = Kiha.prototype.postAttack;
	Kiha.prototype.postAttack = function( damage ) {
		this._superPostAttack( damage );
		var flame = CoC.player.takeDamage( 15 + Utils.rand( 6 ) );
		MainView.outputText( '\nAn afterwash of flames trails behind her blow, immolating you! (' + flame + ')', false );
	};
	Kiha.prototype.performCombatAction = function() {
		var select = Utils.rand( 5 );
		if( select <= 1 ) {
			this.eAttack();
		} else if( select === 2 ) {
			if( EngineCore.silly() ) {
				this.sillyModeKihaAttack();
			} else {
				this.kihaFirePunch();
			}
		} else if( select === 3 ) {
			this.kihaFireBreath();
		} else {
			this.kihaTimeWaster();
		}
	};
	Kiha.prototype.defeated = function() {
		if( this.findStatusAffect( StatusAffects.spiderfight ) >= 0 ) {
			SceneLib.kihaFollower.playerBeatsUpKihaPreSpiderFight();
		} else if( this.findStatusAffect( StatusAffects.DomFight ) >= 0 ) {
			SceneLib.kihaFollower.pcWinsDomFight();
		} else if( this.findStatusAffect( StatusAffects.Spar ) >= 0 ) {
			SceneLib.kihaFollower.winSparWithKiha();
		} else {
			SceneLib.kihaScene.kihaVictoryIntroduction();
		}
	};

	/* jshint unused:true */
	Kiha.prototype.won = function( hpVictory, pcCameWorms ) {
		if( this.findStatusAffect( StatusAffects.spiderfight ) >= 0 ) {
			SceneLib.kihaFollower.loseKihaPreSpiderFight();
		} else if( this.findStatusAffect( StatusAffects.DomFight ) >= 0 ) {
			SceneLib.kihaFollower.pcLosesDomFight();
		} else if( this.findStatusAffect( StatusAffects.Spar ) >= 0 ) {
			SceneLib.kihaFollower.sparWithFriendlyKihaLose();
		} else if( pcCameWorms ) {
			MainView.outputText( '\n\nKiha seems visibly disturbed by your infection, enough that she turns to leave.' );
			EngineCore.doNext( Combat, Combat.endLustLoss );
		} else {
			SceneLib.kihaScene.kihaLossIntro();
		}
	};
	Kiha.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Kiha');
		that.a = '';
		that.short = 'Kiha';
		that.imageName = 'kiha';
		that.long = 'Kiha is standing across from you, holding a double-bladed axe that\'s nearly as big as she is.  She\'s six feet tall, and her leathery wings span nearly twelve feet extended.  Her eyes are pure crimson, save for a black slit in the center, and a pair of thick draconic horns sprout from her forehead, arcing over her ruby-colored hair to point behind her.  Dim red scales cover her arms, legs, back, and strong-looking tail, providing what protection they might to large areas of her body.  The few glimpses of exposed skin are dark, almost chocolate in color, broken only by a few stray scales on the underside of her bosom and on her cheekbones.  Her vagina constantly glistens with moisture, regardless of her state of arousal.  Despite her nudity, Kiha stands with the confidence and poise of a trained fighter.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_DROOLING, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 40, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'D' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_LOOSE;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 40, 0, 0, 0 );
		that.tallness = 6 * 12 + 1;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE;
		that.buttRating = AppearanceDefs.BUTT_RATING_AVERAGE + 1;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HOOFED;
		that.skinTone = 'dark';
		that.skinType = AppearanceDefs.SKIN_TYPE_SCALES;
		that.skinDesc = 'skin and scales';
		that.hairColor = 'red';
		that.hairLength = 3;
		that.initStrTouSpeInte( 65, 60, 85, 60 );
		that.initLibSensCor( 50, 45, 66 );
		that.weaponName = 'double-bladed axe';
		that.weaponVerb = 'fiery cleave';
		that.weaponAttack = 25;
		that.armorName = 'thick scales';
		that.armorDef = 30;
		that.bonusHP = 430;
		that.lust = 10;
		that.lustVuln = 0.4;
		that.temperment = Monster.TEMPERMENT_LUSTY_GRAPPLES;
		that.level = 16;
		that.gems = Utils.rand( 15 ) + 95;
		that.drop = Monster.NO_DROP;
		that.wingType = AppearanceDefs.WING_TYPE_IMP;
		that.wingDesc = 'huge';
		that.tailType = AppearanceDefs.TAIL_TYPE_LIZARD;
		that.checkMonster();
	};
	return Kiha;
} );