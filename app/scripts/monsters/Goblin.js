'use strict';

angular.module( 'cocjs' ).factory( 'Goblin', function( SceneLib, MainView, AppearanceDefs, WeightedDrop, ConsumableLib, Appearance, CoC, EngineCore, Monster, Utils, StatusAffects, Combat, PerkLib ) {
	function Goblin() {
		this.init(this, arguments);
	}
	angular.extend(Goblin.prototype, Monster.prototype);
	Goblin.prototype.goblinDrugAttack = function() {
		var temp2 = Utils.rand( 2 );
		if( this.short === 'Tamani' ) {
			temp2 = Utils.rand( 5 );
		}
		if( this.short === 'Tamani\'s daughters' ) {
			temp2 = Utils.rand( 5 );
		}
		var color = '';
		if( temp2 === 0 ) {
			color = 'red';
		}
		if( temp2 === 1 ) {
			color = 'green';
		}
		if( temp2 === 2 ) {
			color = 'blue';
		}
		if( temp2 === 3 ) {
			color = 'white';
		}
		if( temp2 === 4 ) {
			color = 'black';
		}
		//Throw offensive potions at the player;
		if( color !== 'blue' ) {
			if( this.short === 'Tamani\'s daughters' ) {
				MainView.outputText( 'Tamani uncorks a glass bottle full of ' + color + ' fluid and swings her arm, flinging a wave of fluid at you.', false );
			} else {
				MainView.outputText( this.getCapitalA() + this.short + ' uncorks a glass bottle full of ' + color + ' fluid and swings her arm, flinging a wave of fluid at you.', false );
			}
		}
		//Drink blue pots;
		else {
			if( this.short === 'Tamani\'s daughters' ) {
				MainView.outputText( 'Tamani pulls out a blue vial and uncaps it, then douses the mob with the contents.', false );
				if( this.HPRatio() < 1 ) {
					MainView.outputText( '  Though less effective than ingesting it, the potion looks to have helped the goblins recover from their wounds!\n', false );
					this.addHP( 80 );
				} else {
					MainView.outputText( '  There doesn\'t seem to be any effect.\n', false );
				}
				MainView.outputText( '\n', false );
			} else {
				MainView.outputText( this.getCapitalA() + this.short + ' pulls out a blue vial and uncaps it, swiftly downing its contents.', false );
				if( this.HPRatio() < 1 ) {
					MainView.outputText( '  She looks to have recovered from some of her wounds!\n', false );
					this.addHP( this.eMaxHP() / 4 );
					if( this.short === 'Tamani' ) {
						this.addHP( this.eMaxHP() / 4 );
					}
				} else {
					MainView.outputText( '  There doesn\'t seem to be any effect.\n', false );
				}
				Combat.combatRoundOver();
			}
			return;
		}
		//Dodge chance!;
		if( (CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 10 ) <= 3) || (Utils.rand( 100 ) < CoC.player.spe / 5) ) {
			MainView.outputText( '\nYou narrowly avoid the gush of alchemic fluids!\n', false );
		} else {
			//Get hit!;
			if( color === 'red' ) {
				//Temporary heat;
				MainView.outputText( '\nThe red fluids hit you and instantly soak into your skin, disappearing.  Your skin flushes and you feel warm.  Oh no...\n', false );
				if( CoC.player.findStatusAffect( StatusAffects.TemporaryHeat ) < 0 ) {
					CoC.player.createStatusAffect( StatusAffects.TemporaryHeat, 0, 0, 0, 0 );
				}
			} else if( color === 'green' ) {
				//Green poison;
				MainView.outputText( '\nThe greenish fluids splash over you, making you feel slimy and gross.  Nausea plagues you immediately - you have been poisoned!\n', false );
				if( CoC.player.findStatusAffect( StatusAffects.Poison ) < 0 ) {
					CoC.player.createStatusAffect( StatusAffects.Poison, 0, 0, 0, 0 );
				}
			} else if( color === 'white' ) {
				//sticky flee prevention;
				MainView.outputText( '\nYou try to avoid it, but it splatters the ground around you with very sticky white fluid, making it difficult to run.  You\'ll have a hard time escaping now!\n', false );
				if( CoC.player.findStatusAffect( StatusAffects.NoFlee ) < 0 ) {
					CoC.player.createStatusAffect( StatusAffects.NoFlee, 0, 0, 0, 0 );
				}
			} else if( color === 'black' ) {
				//Increase fatigue;
				MainView.outputText( '\nThe black fluid splashes all over you and wicks into your skin near-instantly.  It makes you feel tired and drowsy.\n', false );
				EngineCore.fatigue( 10 + Utils.rand( 25 ) );
			}
		}
		if( !this.plural ) {
			Combat.combatRoundOver();
		} else {
			MainView.outputText( '\n', false );
		}
	};
	Goblin.prototype.goblinTeaseAttack = function() {
		var det = Utils.rand( 3 );
		if( det === 0 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' runs her hands along her leather-clad body and blows you a kiss. "<i>Why not walk on the wild side?</i>" she asks.', false );
		}
		if( det === 1 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' grabs her heel and lifts it to her head in an amazing display of flexibility.  She caresses her snatch and gives you a come hither look.', false );
		}
		if( det === 2 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' bends over, putting on a show and jiggling her heart-shaped ass at you.  She looks over her shoulder and sucks on her finger, batting her eyelashes.', false );
		}
		EngineCore.dynStats( 'lus', Utils.rand( CoC.player.lib / 10 ) + 8 );
		MainView.outputText( '  The display distracts you long enough to prevent you from taking advantage of her awkward pose, leaving you more than a little flushed.\n\n', false );
		Combat.combatRoundOver();
	};
	Goblin.prototype.defeated = function() {
		SceneLib.goblinScene.gobboRapeIntro();
	};
	/* jshint unused:true */
	Goblin.prototype.won = function( hpVictory, pcCameWorms ) {
		if( CoC.player.gender === 0 ) {
			MainView.outputText( 'You collapse in front of the goblin, too wounded to fight.  She giggles and takes out a tube of lipstick smearing it whorishly on your face.  You pass into unconsciousness immediately.  It must have been drugged.', false );
			Combat.cleanupAfterCombat();
		} else if( pcCameWorms ) {
			MainView.outputText( '\n\nThe goblin\'s eyes go wide and she turns to leave, no longer interested in you.', false );
			CoC.player.orgasm();
			EngineCore.doNext( Combat, Combat.cleanupAfterCombat );
		} else {
			SceneLib.goblinScene.goblinRapesPlayer();
		}
	};
	Goblin.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Goblin');
		if( args[ 0 ] ) {
			return;
		}
		that.a = 'the ';
		that.short = 'goblin';
		that.imageName = 'goblin';
		that.long = 'The goblin before you is a typical example of her species, with dark green skin, pointed ears, and purple hair that would look more at home on a punk-rocker.  She\'s only about three feet tall, but makes up for it with her curvy body, sporting hips and breasts that would entice any of the men in your village were she full-size.  There isn\'t a single scrap of clothing on her, just lewd leather straps and a few clinking pouches.  She does sport quite a lot of piercings – the most noticeable being large studs hanging from her purple nipples.  Her eyes are fiery red, and practically glow with lust.  This one isn\'t going to be satisfied until she has her way with you.  It shouldn\'t be too hard to subdue such a little creature, right?';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_DROOLING, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 40, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'E' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 30, 0, 0, 0 );
		that.tallness = 35 + Utils.rand( 4 );
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'dark green';
		that.hairColor = 'purple';
		that.hairLength = 4;
		that.initStrTouSpeInte( 12, 13, 35, 42 );
		that.initLibSensCor( 45, 45, 60 );
		that.weaponName = 'fists';
		that.weaponVerb = 'tiny punch';
		that.armorName = 'leather straps';
		that.lust = 50;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 1;
		that.gems = Utils.rand( 5 ) + 5;
		that.drop = new WeightedDrop().add( ConsumableLib.GOB_ALE, 5 ).addMany( 1, ConsumableLib.L_DRAFT,
			ConsumableLib.PINKDYE,
			ConsumableLib.BLUEDYE,
			ConsumableLib.ORANGDY,
			ConsumableLib.PURPDYE );
		that.special1 = that.goblinDrugAttack;
		that.special2 = that.goblinTeaseAttack;
		that.checkMonster();
	};
	return Goblin;
} );