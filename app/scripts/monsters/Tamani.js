'use strict';

angular.module( 'cocjs' ).factory( 'Tamani', function( SceneLib, CoC, EngineCore, kFLAGS, Utils, Descriptors, AppearanceDefs, StatusAffects, Monster, WeightedDrop, ConsumableLib, Combat, Appearance, Goblin ) {
	function Tamani() {
		this.init(this, arguments);
	}
	angular.extend(Tamani.prototype, Goblin.prototype);
	Tamani.prototype.Goblin_goblinTeaseAttack = Tamani.prototype.goblinTeaseAttack;
	Tamani.prototype.goblinTeaseAttack = function() {
		if( CoC.flags[ kFLAGS.TAMANI_TIMES_HYPNOTISED ] > 0 ) {
			this.tamaniHypnoTease();
			return;
		}
		this.Goblin_goblinTeaseAttack();
	};
	//New Tease option:
	Tamani.prototype.tamaniHypnoTease = function() {
		var selector = Utils.rand( 3 );
		//Choose 1 of 3 variations
		if( selector === 0 ) {
			EngineCore.outputText( 'Tamani smiles and shifts her leather straps, pulling one into the puffy gash that is her vagina.  She groans out loud, sliding the studded leather band into her outer lips and sawing it along her clit.  Her whole body blushes as she pulls it free, running a fingertip up the now wet strip of leather, "<i>Mmm, can\'t you see how much my pussy needs a man inside it?  Be a good husband and fuck Tamani full!  You know you want to.</i>"\n\n', false );
		}
		if( selector === 1 ) {
			EngineCore.outputText( 'Tamani saunters up to you, sliding her fingers down to each side of her pussy and spreading them.  Your eyes are drawn to her honeyed tunnel, unable to look away she gets closer.  She whispers, "<i>Your cock knows what it needs.  Just be a good husband and obey your dick, it KNOWS how badly you need mistress\'s pussy.</i>"\n\n', false );
		}
		if( selector === 2 ) {
			EngineCore.outputText( 'Tamani turns around and bends down, pressing her hands into the dirt as she kicks her legs apart.  Your stare open-mouthed at her bouncy ass-cheeks and the tantalizingly wet entrance of her slit.  She smirks and offers, "<i>You\'ve cum so many times inside me, why resist when you can give in and feel that pleasure again today?  Come on husband, don\'t make Tamani beg...</i>"\n\n', false );
		}
		//REACTIONS
		//LOW HYPNO VALUE:
		if( CoC.flags[ kFLAGS.TAMANI_TIMES_HYPNOTISED ] < 5 ) {
			selector = Utils.rand( 3 );
			if( selector === 0 ) {
				EngineCore.outputText( 'You reluctantly pull your stare away from the heavenly entrance between her legs.  There\'s an urge to walk over to her and plunge yourself inside her over and over, but you dismiss it.', false );
			}
			if( selector === 1 ) {
				EngineCore.outputText( 'You find it hard to pull your gaze from her inviting twat, but you manage.  You shake your head, clearing away thoughts of fertilizing your wife.  Her rhetoric must be getting to you.', false );
			}
			if( selector === 2 ) {
				EngineCore.outputText( 'No matter the case, her actions shifted a fair bit of your blood-flow to your groin.', false );
			}
		}
		//MEDIUM HYPNO VALUE:
		else if( CoC.flags[ kFLAGS.TAMANI_TIMES_HYPNOTISED ] < 10 ) {
			selector = Utils.rand( 2 );
			if( selector === 0 ) {
				EngineCore.outputText( 'With effort you manage to wrench your eyes away from the inviting folds of Tamani\'s vagina.  ', false );
				if( CoC.player.totalCocks() > 1 ) {
					EngineCore.outputText( 'Each of y', false );
				} else {
					EngineCore.outputText( 'Y', false );
				}
				EngineCore.outputText( 'our ' + Descriptors.multiCockDescriptLight(), false );
				if( CoC.player.lust > 80 ) {
					EngineCore.outputText( ' drips pre-cum', false );
				} else if( CoC.player.lust > 40 ) {
					EngineCore.outputText( ' grows harder', false );
				} else {
					EngineCore.outputText( ' hardens', false );
				}
				EngineCore.outputText( ' from the sexual sight, and you feel a compulsion to rush to your wife and take her on the spot.  Obviously she\'s not really your wife, but after so many fuckings it kind of makes sense to think of her that way.', false );
				if( CoC.player.lust < 70 ) {
					EngineCore.outputText( '  Still, you don\'t want to fuck her right now!', false );
				}
			} else {
				EngineCore.outputText( 'Struggling, you pull your eyes back into your head and away from Tamani\'s gorgeous slit.  You shudder, feeling ', false );
				if( CoC.player.totalCocks() > 1 ) {
					EngineCore.outputText( 'each of ', false );
				}
				EngineCore.outputText( 'your ' + CoC.player.multiCockDescriptLight(), false );
				if( CoC.player.lust <= 41 ) {
					EngineCore.outputText( ' thicken perceptibly', false );
				} else if( CoC.player.lust <= 81 ) {
					EngineCore.outputText( ' twitch eagerly', false );
				} else {
					EngineCore.outputText( 'drip pre-cum', false );
				}
				EngineCore.outputText( ', responding to the overly sensual goblin\'s body.  You start to approach her, but stop yourself, realizing you were about to pick up your wife and fuck her on the spot.  You know she\'s not really your wife, but you have a hard time thinking of her as anything else, save for maybe your mistress.', false );
				if( CoC.player.lust < 70 ) {
					EngineCore.outputText( '  Regardless, you\'re resolute in your desire not to fuck her right now!', false );
				}
			}
		}
		//HIGH HYPNO VALUE
		else {
			selector = Utils.rand( 2 );
			if( selector === 0 ) {
				EngineCore.outputText( 'You barely manage to step yourself from lunging forward to bury your mouth between your mistress\'s legs.  Hard and trembling between your legs, ', false );
				if( CoC.player.totalCocks() > 1 ) {
					EngineCore.outputText( 'each of ', false );
				}
				EngineCore.outputText( 'your ' + CoC.player.multiCockDescriptLight() + ' aches with need.  You battle with the compulsion to kneel before your short, stacked mistress and perform your duties as her breeder husband.', false );
			} else {
				EngineCore.outputText( 'You wrench your gaze from the juicy mound before you with great difficulty.  The desire to submit to your wife and fuck her on the spot rages through your body, melting your resistance into liquid lust and pooling it in your groin.  ', false );
				if( CoC.player.totalCocks() > 1 ) {
					EngineCore.outputText( 'Each of y', false );
				} else {
					EngineCore.outputText( 'Y', false );
				}
				EngineCore.outputText( 'our ' + CoC.player.multiCockDescriptLight() + ' pulses and dribbles pre-cum, aching to do its duty and fire load after load into Tamani\'s perfect pussy.', false );
			}
		}
		EngineCore.dynStats( 'lus', (Utils.rand( CoC.player.lib / 5 ) + 3 + (CoC.flags[ kFLAGS.TAMANI_TIMES_HYPNOTISED ])) );
		Combat.combatRoundOver();
	};
	Tamani.prototype.defeated = function( hpVictory ) {
		if( hpVictory ) {
			EngineCore.outputText( 'Tamani is defeated!', true );
		} else {
			EngineCore.outputText( 'Tamani gives up on defeating you and starts masturbating!', true );
		}
		if( CoC.player.lust >= 33 && CoC.player.totalCocks() > 0 ) {
			EngineCore.outputText( '  You could fuck her, but if that\'s the case why did you bother fighting her?\n\nWhat do you do to her?', false );
			var temp = null;
			var temp2 = null;
			if( CoC.player.hasCock() && CoC.player.cockThatFits( this.analCapacity() ) >= 0 ) {
				temp = SceneLib.tamaniScene.tamaniAnalShits;
			}
			//NOT PREGGERS
			if( !SceneLib.tamaniScene.pregnancy.isPregnant && CoC.player.canOvipositSpider() ) {
				temp2 = SceneLib.tamaniScene.tamaniBeaten;
			}
			EngineCore.choices( 'Fuck', SceneLib.tamaniScene, SceneLib.tamaniScene.tamaniSexWon, 'Buttfuck', SceneLib.tamaniScene, temp, '', null, null, 'Lay Eggs', SceneLib.tamaniScene, temp2, 'Leave', null, Combat.cleanupAfterCombat );
		} else {
			Combat.cleanupAfterCombat();
		}
	};
	Tamani.prototype.won = function( hpVictory ) {
		if( hpVictory ) {
			if( CoC.player.totalCocks() > 0 ) {
				if( Utils.rand( 2 ) === 0 ) {
					SceneLib.tamaniScene.tamaniSexLost();
				} else {
					SceneLib.tamaniScene.tamaniSexLetHer();
				}
			} else {
				EngineCore.outputText( 'Tamani sighs as you begin to lose conscious, "<i>You dummy, why\'d you get rid of the fun parts?</i>"', true );
				Combat.cleanupAfterCombat();
			}
		} else {
			if( CoC.player.totalCocks() > 0 ) {
				//hypnoslut loss scene
				if( CoC.flags[ kFLAGS.TAMANI_TIMES_HYPNOTISED ] > 19 && Utils.rand( 2 ) === 0 ) {
					SceneLib.tamaniScene.getRapedByTamaniYouHypnoSlut();
				} else if( Utils.rand( 2 ) === 0 ) {
					SceneLib.tamaniScene.tamaniSexLost();
				} else {
					SceneLib.tamaniScene.tamaniSexLetHer();
				}
			} else {
				EngineCore.outputText( 'You give into your lusts and masturbate, but Tamani doesn\'t seem to care.  She kicks and punches you over and over, screaming, "<i>You dummy, why\'d you get rid of the fun parts?</i>"', true );
				CoC.player.takeDamage( 10000 );
				Combat.cleanupAfterCombat();
			}
		}
	};
	Tamani.prototype.init = function( that ) {
		Goblin.prototype.init( that, [ false ] );
		that.classNames.push('Tamani');
		that.a = '';
		that.short = 'Tamani';
		that.imageName = 'tamani';
		that.long = 'She keeps her arms folded across her ' + SceneLib.tamaniScene.tamaniChest() + ' and glares at you.  The little thing is only about four feet tall, with pink and black dyed hair cut into a cute little \'do.  The greenish-gray skin of her breasts bulges out around her arms, supported by a few leather straps, amplifying her cleavage.  Her cunt lips are pierced multiple times, inflamed, and slightly parted.  There really isn\'t any clothing on her to hide them, just more of the ever-present straps wrapping around her thighs.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_DROOLING, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 55, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'E' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 40, 0, 0, 0 );
		that.tallness = 40;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'greenish gray';
		that.hairColor = 'pink and black';
		that.hairLength = 16;
		that.initStrTouSpeInte( 32, 43, 55, 62 );
		that.initLibSensCor( 65, 65, 50 );
		that.weaponName = 'fists';
		that.weaponVerb = 'tiny punch';
		that.armorName = 'leather straps';
		that.bonusHP = 40;
		that.lust = 40;
		that.lustVuln = 0.9;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 4;
		that.gems = Utils.rand( 25 ) + 5;
		that.drop = new WeightedDrop().add( ConsumableLib.GOB_ALE, 4 )
			.addMany( 1,
				ConsumableLib.L_DRAFT,
				ConsumableLib.PINKDYE,
				ConsumableLib.BLUEDYE,
				ConsumableLib.ORANGDY,
				ConsumableLib.PURPDYE,
				ConsumableLib.INCUBID,
				ConsumableLib.REDUCTO,
				ConsumableLib.L_BLUEG,
				null );
		that.special1 = that.goblinDrugAttack;
		that.special2 = that.goblinTeaseAttack;
		that.checkMonster();
	};
	return Tamani;
} );