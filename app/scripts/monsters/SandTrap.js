'use strict';

angular.module( 'cocjs' ).factory( 'SandTrap', function( SceneLib, $log, CoC, Monster, Utils, StatusAffects, Appearance, AppearanceDefs, ConsumableLib, Combat, EngineCore, CockTypesEnum, ChainedDrop ) {
	function SandTrap() {
		this.init(this, arguments);
	}
	angular.extend(SandTrap.prototype, Monster.prototype);
	//Wait:
	SandTrap.prototype.sandTrapWait = function() {
		EngineCore.clearOutput();
		EngineCore.spriteSelect( 97 );
		if( this.findStatusAffect( StatusAffects.Climbed ) < 0 ) {
			this.createStatusAffect( StatusAffects.Climbed, 0, 0, 0, 0 );
		}
		EngineCore.outputText( 'Instead of attacking, you turn away from the monster and doggedly attempt to climb back up the pit, digging all of your limbs into the soft powder as you climb against the sandslide.' );
		if( this.trapLevel() === 4 ) {
			EngineCore.outputText( '\n\nYou eye the ground above you.  The edge of the pit is too sheer, the ground too unstable... although it looks like you can fight against the currents carrying you further down, it seems impossible to gain freedom with the sand under the monster\'s spell.' );
		} else {
			//Strength check success: [Player goes up one level, does not go down a level this turn]
			if( CoC.player.str / 10 + Utils.rand( 20 ) > 10 ) {
				EngineCore.outputText( '\n\nSweat beads your forehead - trying to clamber out of this pit is like running against the softest treadmill imaginable.  Nonetheless, through considerable effort you see you\'ve managed to pull further clear of the sandtrap\'s grasp.  "<i>Watching you squirm around like that gets me so hot,</i>" it calls up to you.  Turning around you see that the creature is rubbing its hands all over its lean body whilst watching you struggle.  "<i>Such an energetic little mating dance, just for me... mmm, prey who do that are always the best!</i>"' );
				this.trapLevel( 2 );
			} else {
				//Strength check fail:  [Player goes down as normal]
				EngineCore.outputText( '\n\nSweat beads your forehead - trying to clamber out of this pit is like running against the softest treadmill imaginable.  You feel like you\'re going to burst and you eventually give up, noting wearily that you\'ve managed to get nowhere. "<i>Watching you squirm around like that gets me so hot,</i>" the sandtrap calls to you.  Turning around you see that the creature is rubbing its hands all over its lean body whilst watching you struggle.  "<i>Such an energetic little mating dance, just for me... mmm, prey who do that are always the best!</i>"' );
				this.trapLevel( 1 );
			}
		}
		EngineCore.outputText( '\n\n' );
		this.doAI();
	};
	SandTrap.prototype.trapLevel = function( adjustment ) {
		if( this.findStatusAffect( StatusAffects.Level ) < 0 ) {
			this.createStatusAffect( StatusAffects.Level, 4, 0, 0, 0 );
		}
		if( adjustment !== undefined && adjustment !== 0 ) {
			this.addStatusValue( StatusAffects.Level, 1, adjustment );
			//Keep in bounds ya lummox
			if( this.statusAffectv1( StatusAffects.Level ) < 1 ) {
				this.changeStatusValue( StatusAffects.Level, 1, 1 );
			}
			if( this.statusAffectv1( StatusAffects.Level ) > 4 ) {
				this.changeStatusValue( StatusAffects.Level, 1, 4 );
			}
		}
		return this.statusAffectv1( StatusAffects.Level );
	};

	//sandtrap pheromone attack:
	SandTrap.prototype.sandTrapPheremones = function() {
		EngineCore.spriteSelect( 97 );
		EngineCore.outputText( 'The sandtrap puckers its lips.  For one crazed moment you think it\'s going to blow you a kiss... but instead it spits clear fluid at you!   You desperately try to avoid it, even as your lower half is mired in sand.' );
		if( CoC.player.spe / 10 + Utils.rand( 20 ) > 10 || Combat.combatEvade() || Combat.combatFlexibility() ) {
			EngineCore.outputText( '  Moving artfully with the flow rather than against it, you are able to avoid the trap\'s fluids, which splash harmlessly into the dune.' );
		} else {
			var damage = (10 + CoC.player.lib / 10);
			EngineCore.outputText( '  Despite ducking away from the jet of fluid as best you can, you cannot avoid some of the stuff splashing upon your arms and face.  The substance feels oddly warm and oily, and though you quickly try to wipe it off it sticks resolutely to your skin and the smell hits your nose.  Your heart begins to beat faster as warmth radiates out from it; you feel languid, light-headed and sensual, eager to be touched and led by the hand to a sandy bed...  Shaking your head, you try to stifle what the foreign pheromones are making you feel.' );
			EngineCore.dynStats( 'lus', damage );
			damage = Math.round( damage * EngineCore.lustPercent() / 10 ) / 10;
			EngineCore.outputText( ' (' + damage + ' lust)' );
		}
	};
	//sandtrap quicksand attack:
	SandTrap.prototype.nestleQuikSandAttack = function() {
		EngineCore.spriteSelect( 97 );
		EngineCore.outputText( 'The sandtrap smiles at you winningly as it thrusts its hands into the sifting granules.  The sand beneath you suddenly seems to lose even more of its density; you\'re sinking up to your thighs!' );
		//Quicksand attack fail:
		if( CoC.player.spe / 10 + Utils.rand( 20 ) > 10 || Combat.combatEvade() || Combat.combatFlexibility() ) {
			EngineCore.outputText( '  Acting with alacrity, you manage to haul yourself free of the area affected by the sandtrap\'s spell, and set yourself anew.' );
		}
		//Quicksand attack success: (Speed and Strength loss, ability to fly free lost)
		else {
			EngineCore.outputText( '  You can\'t get free in time and in a panic you realize you are now practically wading in sand.  Attempting to climb free now is going to be very difficult.' );
			if( CoC.player.canFly() ) {
				EngineCore.outputText( '  You try to wrench yourself free by flapping your wings, but it is hopeless.  You are well and truly snared.' );
			}
			this.trapLevel( -1 );
			if( this.findStatusAffect( StatusAffects.Climbed ) < 0 ) {
				this.createStatusAffect( StatusAffects.Climbed, 0, 0, 0, 0 );
			}
		}
	};
	SandTrap.prototype._superPerformCombatAction = SandTrap.prototype.performCombatAction;
	SandTrap.prototype.performCombatAction = function() {
		if( this.findStatusAffect( StatusAffects.Level ) >= 0 ) {
			if( this.trapLevel() === 4 && this.findStatusAffect( StatusAffects.Climbed ) < 0 ) {
				this.nestleQuikSandAttack();
			} else {
				this.sandTrapPheremones();
			}
			//PC sinks a level (end of any turn in which player didn't successfully "<i>Wait</i>"):
			if( this.findStatusAffect( StatusAffects.Climbed ) < 0 ) {
				EngineCore.outputText( '\n\nRivulets of sand run past you as you continue to sink deeper into both the pit and the sand itself.' );
				this.trapLevel( -1 );
			} else {
				this.removeStatusAffect( StatusAffects.Climbed );
			}
			Combat.combatRoundOver();
		} else {
			this._superPerformCombatAction();
		}
	};
	SandTrap.prototype.defeated = function() {
		SceneLib.sandTrapScene.pcBeatsATrap();
	};
	SandTrap.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nThe sand trap seems bemused by the insects your body houses...' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			SceneLib.sandTrapScene.sandtrapmentLoss( true );
		}
	};
	SandTrap.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		//1/3 have fertilized eggs!
		if( Utils.rand( 3 ) === 0 ) {
			that.createStatusAffect( StatusAffects.Fertilized, 0, 0, 0, 0 );
		}
		that.a = 'the ';
		if( EngineCore.silly() ) {
			that.short = 'sand tarp';
		} else {
			that.short = 'sandtrap';
		}
		that.imageName = 'sandtrap';
		that.long = 'You are fighting the sandtrap.  It sits half buried at the bottom of its huge conical pit, only its lean human anatomy on show, leering at you from beneath its shoulder length black hair with its six equally sable eyes.  You cannot say whether its long, soft face with its pointed chin is very pretty or very handsome - every time the creature\'s face moves, its gender seems to shift.  Its lithe, brown flat-chested body supports four arms, long fingers playing with the rivulets of powder sand surrounding it.  Beneath its belly you occasionally catch glimpses of its insect half massive sand-coloured abdomen which anchors it to the desert, with who knows what kind of anatomy.';
		that.createCock( 10, 2, CockTypesEnum.HUMAN );
		that.balls = 2;
		that.ballSize = 4;
		that.cumMultiplier = 3;
		that.createBreastRow( 0, 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_NORMAL;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.tallness = Utils.rand( 8 ) + 150;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'fair';
		that.hairColor = 'black';
		that.hairLength = 15;
		that.initStrTouSpeInte( 55, 10, 45, 55 );
		that.initLibSensCor( 60, 45, 50 );
		that.weaponName = 'claws';
		that.weaponVerb = 'claw';
		that.weaponAttack = 10;
		that.armorName = 'chitin';
		that.armorDef = 20;
		that.bonusHP = 100;
		that.lust = 20;
		that.lustVuln = 0.55;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 4;
		that.gems = 2 + Utils.rand( 5 );
		that.drop = new ChainedDrop( ConsumableLib.TRAPOIL ).add( ConsumableLib.OVIELIX, 1 / 3 );
		that.tailType = AppearanceDefs.TAIL_TYPE_DEMONIC;
		that.createStatusAffect( StatusAffects.Level, 4, 0, 0, 0 );
		that.checkMonster();
	};
	return SandTrap;
} );