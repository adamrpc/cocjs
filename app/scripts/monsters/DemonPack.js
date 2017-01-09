'use strict';

angular.module( 'cocjs' ).factory( 'DemonPack', function( $log, MainView, SceneLib, CoC, Monster, Utils, StatusAffects, AppearanceDefs, CockTypesEnum, WeightedDrop, ConsumableLib, EngineCore, Descriptors ) {
	function DemonPack() {
		this.init(this, arguments);
	}
	angular.extend(DemonPack.prototype, Monster.prototype);
	DemonPack.prototype.performCombatAction = function() {
		//Demon pack has different AI
		if( Utils.rand( 2 ) === 0 ) {
			this.special1();
		} else {
			this.special2();
		}
	};
	DemonPack.prototype.defeated = function( hpVictory ) {
		if( hpVictory ) {
			MainView.outputText( 'You strike out and the last of the demons tumbles to the ground with a thud. You stand there for a second surrounded by dead or unconscious demons feeling like a god of battle. Then you realize that if a god of battle does exist he lives on a demonic plane like this, so to avoid insulting him you take your hands off your hips and your ' + CoC.player.legs() + ' off the head of the demon leader before you start to search the bodies.', true );
			EngineCore.dynStats( 'lus', 1 );
		} else {
			MainView.outputText( 'The demons stop attacking, and reach out to touch your body. Some are already masturbating like it\'s the only thing in the world and you know that right now, if you wanted to, you could make each and every one of them fuck you.' );
		}
		if( this.findStatusAffect( StatusAffects.phyllafight ) ) {
			EngineCore.doNext( SceneLib.antsScene, SceneLib.antsScene.consolePhylla );
		} else if( hpVictory ) {
			SceneLib.combatScene.cleanupAfterCombat();
		} else {
			MainView.outputText( '  Do you rape them?', true );
			EngineCore.doYesNo( this, this.rapeDemons, SceneLib.combatScene, SceneLib.combatScene.cleanupAfterCombat );
		}
	};
	DemonPack.prototype.rapeDemons = function() {
		MainView.outputText('You open your arms and step into the throng of eager demons. They jump eagerly to touch you, becoming more and more lust-frenzied every second. You take the nearest demon and throw it to the ground and without a moment\'s thought the rest of the group leap to join you in a thoughtless madness of lust...', true);
		EngineCore.doNext( SceneLib.oasis, SceneLib.oasis.oasisSexing);
	};
	DemonPack.prototype.won = function(hpVictory, pcCameWorms) {
		if( CoC.player.gender === 0 ) {
			if( hpVictory ) {
				MainView.outputText( 'You collapse before the demons, who laugh at your utter lack of male or female endowments, beating you until you pass out.', true );
			} else {
				MainView.outputText( 'You offer yourself to the demons, who promptly begin laughing at your lack of endowments.  They fall on you as one, beating you into unconsciousness.', true );
			}
			SceneLib.combatScene.cleanupAfterCombat();
		} else if( hpVictory ) {
			MainView.outputText( 'The demons finally beat you down and you collapse onto the sand of the oasis. Almost immediately you feel demonic hands pressing and probing your prone form. You hear the leader of the group say something in a strange tongue but you have a feeling you know what it means. The demons dive onto your inert body with intent and begin to press themselves against you...', true );
			EngineCore.doNext( SceneLib.oasis, SceneLib.oasis.oasisSexing );
		} else {
			MainView.outputText( 'You struggle to keep your mind on the fight and fail to do so. ', true );
			if( pcCameWorms ) {
				MainView.outputText( '\n\nThe demons joke and smile, obviously unconcerned with your state.\n\n', false );
			}
			if( CoC.player.cocks.length > 0 ) {
				if( CoC.player.cockTotal() > 1 ) {
					MainView.outputText( 'Each of y', false );
				} else {
					MainView.outputText( 'Y', false );
				}
				MainView.outputText( 'our ' + CoC.player.multiCockDescriptLight() + ' throbs ', false );
				if( CoC.player.hasVagina() ) {
					MainView.outputText( ' and your ', false );
				}
			}
			if( CoC.player.vaginas.length > 0 ) {
				if( !CoC.player.hasCock() ) {
					MainView.outputText( 'Your ', false );
				}
				MainView.outputText( Descriptors.vaginaDescript( 0 ) + ' burns ', false );
			}
			MainView.outputText( 'with arousal.  You make a grab for the nearest demon and catch a handful of jiggly breast. You try desperately to use your other arm to pull her closer to slake your thirst but you both go tumbling to the ground. The demonic leader laughs out loud and the rest of the tribe falls on you, grabbing for anything it can find.', false );
			EngineCore.doNext( SceneLib.oasis, SceneLib.oasis.oasisSexing );
		}
	};

	DemonPack.prototype.teased = function( lustDelta ) {
		MainView.outputText( '\n', false );
		if( lustDelta === 0 ) {
			MainView.outputText( '\n' + this.getCapitalA() + this.short + ' seems unimpressed.' );
		} else if( lustDelta > 0 && lustDelta < 5 ) {
			MainView.outputText( 'The demons lessen somewhat in the intensity of their attack, and some even eye up your assets as they strike at you.', false );
		} else if( lustDelta >= 5 && lustDelta < 10 ) {
			MainView.outputText( 'The demons are obviously steering clear from damaging anything you might use to fuck and they\'re starting to leave their hands on you just a little longer after each blow. Some are starting to cop quick feels with their other hands and you can smell the demonic lust of a dozen bodies on the air.', false );
		} else if( lustDelta >= 10 ) {
			MainView.outputText( 'The demons are less and less willing to hit you and more and more willing to just stroke their hands sensuously over you. The smell of demonic lust is thick on the air and part of the group just stands there stroking themselves openly.', false );
		}
		this.applyTease( lustDelta );
	};
	DemonPack.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('DemonPack');
		$log.debug( 'DemonPack Constructor!' );
		that.a = 'the ';
		that.short = 'demons';
		that.imageName = 'demonmob';
		that.long = 'The group is composed of roughly twenty tan-skinned demons, mostly humanoid in shape with many and varied corruptions across the mob. You see demonic high heels, twisting horns and swinging cocks of all shapes and sizes. There even seems to be a bull head in there somewhere. You also make out plenty of breasts ranging from tiny ones to a pair that requires a second person to carry them, and with those breasts a wide range of pussies, dripping and dry, sometimes nestled below some form of demonic dick.  The small tribe carries no weapons and what little clothing they wear is well-shredded, except for one hefty male wearing a cloak of what appears to be snakeskin across his broad shoulders.' + (EngineCore.silly() ? '  You spot an odd patch that reads, "<i>41st Engineer Company: Vaginal Clearance</i>" on his shoulder.' : '');
		that.plural = true;
		that.pronoun1 = 'they';
		that.pronoun2 = 'them';
		that.pronoun3 = 'their';
		that.createCock( 18, 2 );
		that.createCock( 18, 2, CockTypesEnum.DEMON );
		that.balls = 2;
		that.ballSize = 1;
		that.cumMultiplier = 3;
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLICK, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_SLIME_DROOLING;
		that.tallness = Utils.rand( 8 ) + 70;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'red';
		that.hairColor = 'black';
		that.hairLength = 15;
		that.initStrTouSpeInte( 80, 10, 10, 5 );
		that.initLibSensCor( 50, 60, 80 );
		that.weaponName = 'claws';
		that.weaponVerb = 'claw';
		that.armorName = 'demonic skin';
		that.bonusHP = 200;
		that.lust = 30;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 6;
		that.gems = Utils.rand( 25 ) + 10;
		that.drop = new WeightedDrop().addMany( 1,
			ConsumableLib.SUCMILK,
			ConsumableLib.INCUBID,
			ConsumableLib.OVIELIX,
			ConsumableLib.B__BOOK );
		that.special1 = EngineCore.createCallBackFunction( SceneLib.combatScene, SceneLib.combatScene.packAttack );
		that.special2 = EngineCore.createCallBackFunction( SceneLib.combatScene, SceneLib.combatScene.lustAttack );
		that.tailType = AppearanceDefs.TAIL_TYPE_DEMONIC;
		that.hornType = AppearanceDefs.HORNS_DEMON;
		that.horns = 2;
		that.checkMonster();
	};
	return DemonPack;
} );
