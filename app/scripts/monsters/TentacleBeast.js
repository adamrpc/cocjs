'use strict';

angular.module( 'cocjs' ).factory( 'TentacleBeast', function( SceneLib, MainView, $log, CoC, EngineCore, Monster, Utils, AppearanceDefs, StatusAffects, Appearance, WeightedDrop, Combat, PerkLib, Descriptors ) {
	function TentacleBeast() {
		this.init(this, arguments);
	}
	angular.extend(TentacleBeast.prototype, Monster.prototype);
	TentacleBeast.prototype.tentaclePhysicalAttack = function() {
		MainView.outputText( 'The shambling horror throws its tentacles at you with a murderous force.\n', false );
		var temp = Math.ceil( (this.str + this.weaponAttack) - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
		if( temp < 0 ) {
			temp = 0;
		}
		//Miss
		if( temp === 0 || (CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80) ) {
			MainView.outputText( 'However, you quickly evade the clumsy efforts of the abomination to strike you.', false );
		}
		//Hit
		else {
			temp = CoC.player.takeDamage( temp );
			MainView.outputText( 'The tentacles crash upon your body mercilessly for ' + temp + ' damage.', false );
		}
		Combat.combatRoundOver();
	};
	TentacleBeast.prototype.tentacleEntwine = function() {
		MainView.outputText( 'The beast lunges its tentacles at you from all directions in an attempt to immobilize you.\n', false );
		//Not Trapped yet
		if( CoC.player.findStatusAffect( StatusAffects.TentacleBind ) < 0 ) {
			//Success
			if( Math.ceil( Math.random() * (((CoC.player.spe) / 2)) ) > 15 || (CoC.player.findPerk( PerkLib.Evade ) >= 0 && Math.ceil( Math.random() * (((CoC.player.spe) / 2)) ) > 15) ) {
				MainView.outputText( 'In an impressive display of gymnastics, you dodge, duck, dip, dive, and roll away from the shower of grab-happy arms trying to hold you. Your instincts tell you that this was a GOOD thing.\n', false );
			}
			//Fail
			else {
				MainView.outputText( 'While you attempt to avoid the onslaught of pseudopods, one catches you around your ' + CoC.player.foot() + ' and drags you to the ground. You attempt to reach for it to pull it off only to have all of the other tentacles grab you in various places and immobilize you in the air. You are trapped and helpless!!!\n\n', false );
				//Male/Herm Version:
				if( CoC.player.hasCock() ) {
					MainView.outputText( 'The creature, having immobilized you, coils a long tendril about your penis. You shudder as the creature begins stroking your cock like a maid at a dairy farm in an attempt to provoke a response from you. Unable to resist, your ' + CoC.player.cockDescript( 0 ) + ' easily becomes erect, signaling to the creature that you are responsive to harsher stimulation.\n', false );
				}//Female Version:
				else if( CoC.player.hasVagina() ) {
					MainView.outputText( 'The creature quickly positions a long tentacle with a single sucker over your clitoris. You feel the power of the suction on you, and your body quickly heats up.  Your clit engorges, prompting the beast to latch the sucker onto your ' + CoC.player.clitDescript() + '.\n', false );
				}//Genderless
				else {
					MainView.outputText( 'The creature quickly positions a long tentacle against your ' + Descriptors.assholeDescript() + '. It circles your pucker with slow, delicate strokes that bring unexpected warmth to your body.\n', false );
				}
				EngineCore.dynStats( 'lus', (8 + CoC.player.sens / 20) );
				CoC.player.createStatusAffect( StatusAffects.TentacleBind, 0, 0, 0, 0 );
			}
		}
		Combat.combatRoundOver();
	};
	TentacleBeast.prototype.defeated = function( hpVictory ) {
		if( hpVictory ) {
			MainView.outputText( 'The creature lets out an ear-piercing screech as it collapses upon itself. Its green coloring quickly fades to brown as the life drains from it, leaving you victorious.', true );
		} else {
			MainView.outputText( 'The tentacle beast\'s mass begins quivering and sighing, the tentacles wrapping around each other and feverishly caressing each other.  It seems the beast has given up on fighting.', false );
		}
		if( this.findStatusAffect( StatusAffects.PhyllaFight ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.PhyllaFight );
			SceneLib.antsScene.phyllaTentacleDefeat();
		} else {
			if( !hpVictory && CoC.player.gender > 0 ) {
				MainView.outputText( '  Perhaps you could use it to sate yourself?', true );
				EngineCore.doYesNo( SceneLib.tentacleBeastScene, SceneLib.tentacleBeastScene.tentacleVictoryRape, null, Combat.cleanupAfterCombat );
			} else {
				Combat.cleanupAfterCombat();
			}
		}
	};
	TentacleBeast.prototype.won = function( hpVictory ) {
		if( hpVictory ) {
			MainView.outputText( 'Overcome by your wounds, you turn to make a last desperate attempt to run...\n\n' );
			if( this.findStatusAffect( StatusAffects.PhyllaFight ) >= 0 ) {
				this.removeStatusAffect( StatusAffects.PhyllaFight );
				MainView.outputText( '...and make it into the nearby tunnel.  ' );
				SceneLib.antsScene.phyllaTentaclePCLoss();
			} else {
				SceneLib.tentacleBeastScene.tentacleLossRape();
			}
		} else {
			MainView.outputText( 'You give up on fighting, too aroused to resist any longer.  Shrugging, you walk into the writhing mass...\n\n' );
			if( this.findStatusAffect( StatusAffects.PhyllaFight ) >= 0 ) {
				this.removeStatusAffect( StatusAffects.PhyllaFight );
				MainView.outputText( '...but an insistent voice rouses you from your stupor.  You manage to run into a nearby tunnel.  ' );
				SceneLib.antsScene.phyllaTentaclePCLoss();
			} else {
				EngineCore.doNext( SceneLib.tentacleBeastScene, SceneLib.tentacleBeastScene.tentacleLossRape );
			}
		}
	};
	TentacleBeast.prototype.performCombatAction = function() {
		//tentacle beasts have special AI
		if( Utils.rand( 2 ) === 0 || this.findStatusAffect( StatusAffects.TentacleCoolDown ) >= 0 ) {
			this.special1();
		} else {
			this.special2();
		}
	};
	TentacleBeast.prototype.init = function(that, args) {
		Monster.prototype.init(that, args);
		that.classNames.push('TentacleBeast');
		$log.debug( 'TentacleBeast Constructor!' );
		that.a = 'the ';
		that.short = 'tentacle beast';
		that.imageName = 'tentaclebeast';
		that.long = 'You see the massive, shambling form of the tentacle beast before you.  Appearing as a large shrub, it shifts its bulbous mass and reveals a collection of thorny tendrils and cephalopodic limbs.';
		that.createCock( 40, 1.5 );
		that.createCock( 60, 1.5 );
		that.createCock( 50, 1.5 );
		that.createCock( 20, 1.5 );
		that.balls = 0;
		that.ballSize = 0;
		that.cumMultiplier = 3;
		that.pronoun1 = 'it';
		that.pronoun2 = 'it';
		that.pronoun3 = 'its';
		that.createBreastRow( 0, 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_SLIME_DROOLING;
		that.tallness = Utils.rand( 9 ) + 70;
		that.hipRating = AppearanceDefs.HIP_RATING_BOYISH;
		that.buttRating = AppearanceDefs.BUTT_RATING_BUTTLESS;
		that.skinTone = 'green';
		that.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		that.skinDesc = 'bark';
		that.hairColor = 'green';
		that.hairLength = 1;
		that.initStrTouSpeInte( 58, 25, 45, 45 );
		that.initLibSensCor( 90, 20, 100 );
		that.weaponName = 'whip-tendril';
		that.weaponVerb = 'thorny tendril';
		that.weaponAttack = 1;
		that.armorName = 'rubbery skin';
		that.armorDef = 1;
		that.bonusHP = 350;
		that.lust = 10;
		that.lustVuln = 0.8;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 6;
		that.gems = Utils.rand( 15 ) + 5;
		that.drop = new WeightedDrop( null, 1 );
		that.special1 = that.tentaclePhysicalAttack;
		that.special2 = that.tentacleEntwine;
		that.special3 = that.tentaclePhysicalAttack;
		that.tailType = AppearanceDefs.TAIL_TYPE_DEMONIC;
		that.checkMonster();
	};
	return TentacleBeast;
} );