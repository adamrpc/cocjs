'use strict';

angular.module( 'cocjs' ).factory( 'Gnoll', function( MainView, SceneLib, EventParser, ChainedDrop, ConsumableLib, CoC, EngineCore, Monster, Utils, AppearanceDefs, StatusAffects, Appearance, Combat, PerkLib ) {
	function Gnoll() {
		this.init(this, arguments);
	}
	angular.extend(Gnoll.prototype, Monster.prototype);
	//Gnoll Description;
	Gnoll.prototype.gnollAttackText = function() {
		var damage = 0;
		var attack = Utils.rand( 6 );
		//return to combat menu when finished;
		EngineCore.doNext( MainView.playerMenu );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			EngineCore.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind attack!\n', false );
		}
		//Determine if dodged!;
		else if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			if( CoC.player.spe - this.spe < 8 ) {
				EngineCore.outputText( 'You narrowly avoid ' + this.a + this.short + '\'s ' + this.weaponVerb + '!\n', false );
			} else if( CoC.player.spe - this.spe >= 8 && CoC.player.spe - this.spe < 20 ) {
				EngineCore.outputText( 'You dodge ' + this.a + this.short + '\'s ' + this.weaponVerb + ' with superior quickness!\n', false );
			} else if( CoC.player.spe - this.spe >= 20 ) {
				EngineCore.outputText( 'You deftly avoid ' + this.a + this.short + '\'s slow ' + this.weaponVerb + '.\n', false );
			}
		}
		//Determine if evaded;
		else if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			EngineCore.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + this.a + this.short + '\'s attack.\n', false );
		}
		//('Misdirection';
		else if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			EngineCore.outputText( 'Using Raphael\'s teachings, you anticipate and sidestep ' + this.a + this.short + '\' attacks.\n', false );
		}
		//Determine if cat'ed;
		else if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
			EngineCore.outputText( 'With your incredible flexibility, you squeeze out of the way of ' + this.a + this.short + '', false );
			if( this.plural ) {
				EngineCore.outputText( '\' attacks.\n', false );
			} else {
				EngineCore.outputText( '\'s attack.\n', false );
			}
		} else {
			//Determine damage - str modified by enemy toughness!;
			damage = Math.ceil( (this.str + this.weaponAttack) - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
			if( damage <= 0 ) {
				damage = 0;
				//hapies have their own shit;
				if( this.short === 'harpy' ) {
					EngineCore.outputText( 'The harpy dives at you with her foot-talons, but you deflect the attack, grasp onto her leg, and swing her through the air, tossing her away from you before she has a chance to right herself.', false );
				}
				//Due to toughness or amor...;
				else if( Utils.rand( CoC.player.armorDef + CoC.player.tou ) < CoC.player.armorDef ) {
					EngineCore.outputText( 'Your ' + CoC.player.armorName + ' absorb and deflect every ' + this.weaponVerb + ' from ' + this.a + this.short + '.', false );
				} else {
					EngineCore.outputText( 'You deflect and block every ' + this.weaponVerb + ' ' + this.a + this.short + ' throws at you.', false );
				}
			}
			//everyone else;
			else {
				//Gnoll Attack #1;
				if( attack === 0 ) {
					EngineCore.outputText( 'The gnoll leaps forward, her jaws slamming shut across your upper arm.  She twists away before you can touch her, laughing the entire time.', false );
					damage += 10;
				}
				//Gnoll Attack #2;
				else if( attack === 1 ) {
					EngineCore.outputText( 'With a shudder and lurch, the gnoll barrels forward into your gut, the claws of her free hand raking across your belly.', false );
					damage += 3;
				}
				//Gnoll Attack #3;
				else if( attack === 2 ) {
					EngineCore.outputText( 'The gnoll tumbles to the ground, then comes up with a handful of sand.  The sand goes in your face; the club goes into your cheek.  Ow.', false );
					damage += 13;
				}
				//Gnoll Attack #4;
				else if( attack === 3 ) {
					EngineCore.outputText( 'The hyena girl giggles and darts forward, teeth snapping.  Spittle flies everywhere, and the snapping teeth find purchase, drawing red lines across your body.', false );
					damage += 8;
				}
				//Gnoll Attack #5;
				else if( attack === 4 ) {
					EngineCore.outputText( 'With a mocking laugh, the gnoll brings her club high and then down in a savage strike that catches you across the temple.', false );
					damage += 25;
				}
				//Gnoll Attack #6;
				else {
					EngineCore.outputText( 'The gnoll waves her club threateningly, but it\'s her foot that snaps up from the dusty plain to connect with your gut.', false );
				}
				damage = CoC.player.takeDamage( damage );
				EngineCore.outputText( ' (' + damage + ')\n', false );
			}
			EngineCore.statScreenRefresh();
		}
	};
	Gnoll.prototype.gnollTease = function() {
		var tease = Utils.rand( 6 );
		var bonus = 0;
		//Gnoll Tease #1;
		if( tease === 0 ) {
			EngineCore.outputText( 'The gnoll takes a moment to stretch her sleek, athletic body.  Her free hand runs up her side and she leers knowingly at you.', false );
			bonus += 5;
		}
		//Gnoll Tease #2;
		else if( tease === 1 ) {
			EngineCore.outputText( 'With one hand, the hyena girl grasps her eight-inch clitoris and strokes it.  "<i>I know you\'re curious!</i>" she laughs.  "<i>You want to try this.</i>"', false );
			bonus += 5;
		}
		//Gnoll Tease #3;
		else if( tease === 2 ) {
			EngineCore.outputText( 'The gnoll bounds forward, but instead of clobbering you she slides her lithe body against yours.  "<i>We don\'t have to fight,</i>" she titters.  "<i>It\'s lots easier if I just fuck you.</i>"', false );
			bonus += 10;
		}
		//Gnoll Tease #4;
		else if( tease === 3 ) {
			EngineCore.outputText( 'The gnoll slides her fingers down the length of her pseudo-penis and collects the cream that drips from its end.  With two steps, she\'s inside your guard, but all she does is wave her hand in front of your nose.  The reek of sex nearly bowls you over.', false );
			bonus += 12;
		}
		//Gnoll Tease #5;
		else if( tease === 4 ) {
			EngineCore.outputText( '"<i>I love outlanders,</i>" the gnoll confides in you as she circles.  "<i>You have such interesting cries when you get fucked in a new way.</i>"  She laughs, and the sound is far louder than it has any right to be.\n\n', false );
		}
		//Gnoll Tease #6;
		else {
			EngineCore.outputText( 'The gnoll dances forward, then back, her whole body alive with sensual movement.  She catches the way you watch her and smirks, throwing in a hip-shake just for you.', false );
			bonus += 6;
		}
		EngineCore.dynStats( 'lus', (bonus + 10 + CoC.player.lib / 20 + Utils.rand( CoC.player.cor / 20 )) );
		EngineCore.outputText( '\n', false );
	};
	Gnoll.prototype.eAttack = function() {
		var damage = 0;
		var attack = Utils.rand( 6 );
		//return to combat menu when finished;
		EngineCore.doNext( MainView.playerMenu );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			EngineCore.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind attack!\n', false );
		}
		//Determine if dodged!;
		else if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			if( CoC.player.spe - this.spe < 8 ) {
				EngineCore.outputText( 'You narrowly avoid ' + this.a + this.short + '\'s ' + this.weaponVerb + '!\n', false );
			} else if( CoC.player.spe - this.spe >= 8 && CoC.player.spe - this.spe < 20 ) {
				EngineCore.outputText( 'You dodge ' + this.a + this.short + '\'s ' + this.weaponVerb + ' with superior quickness!\n', false );
			} else if( CoC.player.spe - this.spe >= 20 ) {
				EngineCore.outputText( 'You deftly avoid ' + this.a + this.short + '\'s slow ' + this.weaponVerb + '.\n', false );
			}
		}
		//Determine if evaded;
		else if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			EngineCore.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + this.a + this.short + '\'s attack.\n', false );
		}
		//('Misdirection';
		else if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			EngineCore.outputText( 'Using Raphael\'s teachings, you anticipate and sidestep ' + this.a + this.short + '\' attacks.\n', false );
		}
		//Determine if cat'ed;
		else if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
			EngineCore.outputText( 'With your incredible flexibility, you squeeze out of the way of ' + this.a + this.short + '', false );
			if( this.plural ) {
				EngineCore.outputText( '\' attacks.\n', false );
			} else {
				EngineCore.outputText( '\'s attack.\n', false );
			}
		} else {
			//Determine damage - str modified by enemy toughness!;
			damage = Math.ceil( (this.str + this.weaponAttack) - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
			if( damage <= 0 ) {
				damage = 0;
				//hapies have their own shit;
				if( this.short === 'harpy' ) {
					EngineCore.outputText( 'The harpy dives at you with her foot-talons, but you deflect the attack, grasp onto her leg, and swing her through the air, tossing her away from you before she has a chance to right herself.', false );
				}
				//Due to toughness or amor...;
				else if( Utils.rand( CoC.player.armorDef + CoC.player.tou ) < CoC.player.armorDef ) {
					EngineCore.outputText( 'Your ' + CoC.player.armorName + ' absorb and deflect every ' + this.weaponVerb + ' from ' + this.a + this.short + '.', false );
				} else {
					EngineCore.outputText( 'You deflect and block every ' + this.weaponVerb + ' ' + this.a + this.short + ' throws at you.', false );
				}
			}
			//everyone else;
			else {
				//Gnoll Attack #1;
				if( attack === 0 ) {
					EngineCore.outputText( 'The gnoll leaps forward, her jaws slamming shut across your upper arm.  She twists away before you can touch her, laughing the entire time.', false );
					damage += 10;
				}
				//Gnoll Attack #2;
				else if( attack === 1 ) {
					EngineCore.outputText( 'With a shudder and lurch, the gnoll barrels forward into your gut, the claws of her free hand raking across your belly.', false );
					damage += 3;
				}
				//Gnoll Attack #3;
				else if( attack === 2 ) {
					EngineCore.outputText( 'The gnoll tumbles to the ground, then comes up with a handful of sand.  The sand goes in your face; the club goes into your cheek.  Ow.', false );
					damage += 13;
				}
				//Gnoll Attack #4;
				else if( attack === 3 ) {
					EngineCore.outputText( 'The hyena girl giggles and darts forward, teeth snapping.  Spittle flies everywhere, and the snapping teeth find purchase, drawing red lines across your body.', false );
					damage += 8;
				}
				//Gnoll Attack #5;
				else if( attack === 4 ) {
					EngineCore.outputText( 'With a mocking laugh, the gnoll brings her club high and then down in a savage strike that catches you across the temple.', false );
					damage += 25;
				}
				//Gnoll Attack #6;
				else {
					EngineCore.outputText( 'The gnoll waves her club threateningly, but it\'s her foot that snaps up from the dusty plain to connect with your gut.', false );
				}
				damage = CoC.player.takeDamage( damage );
				EngineCore.outputText( ' (' + damage + ')\n', false );
			}
			EngineCore.statScreenRefresh();
		}
	};
	Gnoll.prototype.performCombatAction = function() {
		if( this.findStatusAffect( StatusAffects.Stunned ) >= 0 ) {
			if( this.plural ) {
				EngineCore.outputText( 'Your foes are too dazed from your last hit to strike back!', false );
			} else {
				EngineCore.outputText( 'Your foe is too dazed from your last hit to strike back!', false );
			}
			this.removeStatusAffect( StatusAffects.Stunned );
			Combat.combatRoundOver();
		}
		if( this.findStatusAffect( StatusAffects.Fear ) >= 0 ) {
			if( this.statusAffectv1( StatusAffects.Fear ) === 0 ) {
				if( this.plural ) {
					this.removeStatusAffect( StatusAffects.Fear );
					EngineCore.outputText( 'Your foes shake free of their fear and ready themselves for battle.', false );
				} else {
					this.removeStatusAffect( StatusAffects.Fear );
					EngineCore.outputText( 'Your foe shakes free of its fear and readies itself for battle.', false );
				}
			} else {
				this.addStatusValue( StatusAffects.Fear, 1, -1 );
				if( this.plural ) {
					EngineCore.outputText( this.getCapitalA() + this.short + ' are too busy shivering with fear to fight.', false );
				} else {
					EngineCore.outputText( this.getCapitalA() + this.short + ' is too busy shivering with fear to fight.', false );
				}
			}
			Combat.combatRoundOver();
		}
		//Exgartuan gets to do stuff!;
		if( CoC.player.findStatusAffect( StatusAffects.Exgartuan ) >= 0 && CoC.player.statusAffectv2( StatusAffects.Exgartuan ) === 0 && Utils.rand( 3 ) === 0 ) {
			CoC.exgartuan.exgartuanCombatUpdate();
			EngineCore.outputText( '\n\n', false );
		}
		if( this.findStatusAffect( StatusAffects.Constricted ) >= 0 ) {
			//Enemy struggles -;
			EngineCore.outputText( 'Your prey pushes at your tail, twisting and writhing in an effort to escape from your tail\'s tight bonds.', false );
			if( this.statusAffectv1( StatusAffects.Constricted ) <= 0 ) {
				EngineCore.outputText( '  ' + this.getCapitalA() + this.short + ' proves to be too much for your tail to handle, breaking free of your tightly bound coils.', false );
				this.removeStatusAffect( StatusAffects.Constricted );
			}
			this.addStatusValue( StatusAffects.Constricted, 1, -1 );
			Combat.combatRoundOver();
		}
		if( Utils.rand( 2 ) === 0 ) {
			this.gnollTease();
		} else {
			var damage = 0;
			var attack = Utils.rand( 6 );
			//return to combat menu when finished;
			EngineCore.doNext( MainView.playerMenu );
			//Blind dodge change;
			if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
				EngineCore.outputText( this.getCapitalA() + this.short + ' completely misses you with a blind attack!\n', false );
			}
			//Determine if dodged!;
			else if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
				if( CoC.player.spe - this.spe < 8 ) {
					EngineCore.outputText( 'You narrowly avoid ' + this.a + this.short + '\'s ' + this.weaponVerb + '!\n', false );
				} else if( CoC.player.spe - this.spe >= 8 && CoC.player.spe - this.spe < 20 ) {
					EngineCore.outputText( 'You dodge ' + this.a + this.short + '\'s ' + this.weaponVerb + ' with superior quickness!\n', false );
				} else if( CoC.player.spe - this.spe >= 20 ) {
					EngineCore.outputText( 'You deftly avoid ' + this.a + this.short + '\'s slow ' + this.weaponVerb + '.\n', false );
				}
			}
			//Determine if evaded;
			else if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
				EngineCore.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + this.a + this.short + '\'s attack.\n', false );
			}
			//('Misdirection';
			else if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
				EngineCore.outputText( 'Using Raphael\'s teachings, you anticipate and sidestep ' + this.a + this.short + '\' attacks.\n', false );
			}
			//Determine if cat'ed;
			else if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
				EngineCore.outputText( 'With your incredible flexibility, you squeeze out of the way of ' + this.a + this.short + '', false );
				if( this.plural ) {
					EngineCore.outputText( '\' attacks.\n', false );
				} else {
					EngineCore.outputText( '\'s attack.\n', false );
				}
			} else {
				//Determine damage - str modified by enemy toughness!;
				damage = Math.ceil( (this.str + this.weaponAttack) - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
				if( damage <= 0 ) {
					damage = 0;
					//hapies have their own shit;
					if( this.short === 'harpy' ) {
						EngineCore.outputText( 'The harpy dives at you with her foot-talons, but you deflect the attack, grasp onto her leg, and swing her through the air, tossing her away from you before she has a chance to right herself.', false );
					}
					//Due to toughness or amor...;
					else if( Utils.rand( CoC.player.armorDef + CoC.player.tou ) < CoC.player.armorDef ) {
						EngineCore.outputText( 'Your ' + CoC.player.armorName + ' absorb and deflect every ' + this.weaponVerb + ' from ' + this.a + this.short + '.', false );
					} else {
						EngineCore.outputText( 'You deflect and block every ' + this.weaponVerb + ' ' + this.a + this.short + ' throws at you.', false );
					}
				}
				//everyone else;
				else {
					//Gnoll Attack #1;
					if( attack === 0 ) {
						EngineCore.outputText( 'The gnoll leaps forward, her jaws slamming shut across your upper arm.  She twists away before you can touch her, laughing the entire time.', false );
						damage += 10;
					}
					//Gnoll Attack #2;
					else if( attack === 1 ) {
						EngineCore.outputText( 'With a shudder and lurch, the gnoll barrels forward into your gut, the claws of her free hand raking across your belly.', false );
						damage += 3;
					}
					//Gnoll Attack #3;
					else if( attack === 2 ) {
						EngineCore.outputText( 'The gnoll tumbles to the ground, then comes up with a handful of sand.  The sand goes in your face; the club goes into your cheek.  Ow.', false );
						damage += 13;
					}
					//Gnoll Attack #4;
					else if( attack === 3 ) {
						EngineCore.outputText( 'The hyena girl giggles and darts forward, teeth snapping.  Spittle flies everywhere, and the snapping teeth find purchase, drawing red lines across your body.', false );
						damage += 8;
					}
					//Gnoll Attack #5;
					else if( attack === 4 ) {
						EngineCore.outputText( 'With a mocking laugh, the gnoll brings her club high and then down in a savage strike that catches you across the temple.', false );
						damage += 25;
					}
					//Gnoll Attack #6;
					else {
						EngineCore.outputText( 'The gnoll waves her club threateningly, but it\'s her foot that snaps up from the dusty plain to connect with your gut.', false );
					}
					damage = CoC.player.takeDamage( damage );
					EngineCore.outputText( ' (' + damage + ')\n', false );
				}
				EngineCore.statScreenRefresh();
			}
			this.gnollAttackText();
		}
		Combat.combatRoundOver();
	};

	Gnoll.prototype.defeated = function() {
		if( this.findStatusAffect( StatusAffects.PhyllaFight ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.PhyllaFight );
			SceneLib.antsScene.phyllaPCBeatsGnoll();
			return;
		}
		SceneLib.gnollScene.defeatHyena();
	};
	Gnoll.prototype.won = function( hpVictory, pcCameWorms ) {
		if( this.findStatusAffect( StatusAffects.PhyllaFight ) >= 0 ) {
			this.removeStatusAffect( StatusAffects.PhyllaFight );
			SceneLib.antsScene.phyllaGnollBeatsPC();
		} else if( pcCameWorms ) {
			EngineCore.outputText( '\n\nYour foe doesn\'t seem put off enough to leave...' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			SceneLib.gnollScene.getRapedByGnoll();
		}
	};
	Gnoll.prototype.init = function(that, args) {
		Monster.prototype.init(that, args);
		that.classNames.push('Gnoll');
		that.a = 'the ';
		that.short = 'gnoll';
		that.imageName = 'gnoll';
		that.long = 'This lanky figure is dappled with black spots across rough, tawny fur. Wiry muscle ripples along long legs and arms, all of it seeming in perpetual frenetic motion moment half flinching and half lunging.  The head bears a dark muzzle curled in a perpetual leer and bright orange eyes watching with a savage animal cunning.  Between the legs hang what appears at first to be a long, thin dong; however, on closer inspection it is a fused tube of skin composed of elongated pussy lips and clitoris.  The hyena girl is sporting a pseudo-penis, and judging by the way it bobs higher as she jinks back and forth, she\'s happy to see you!\n\nShe wears torn rags scavenged from some other, somewhat smaller, creature, and in one hand clutches a twisted club.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_DROOLING, AppearanceDefs.VAGINA_LOOSENESS_LOOSE );
		that.createBreastRow( Appearance.breastCupInverse( 'C' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 25, 0, 0, 0 );
		that.tallness = 6 * 12;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE;
		that.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		that.skinTone = 'tawny';
		that.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		that.hairColor = 'black';
		that.hairLength = 22;
		that.initStrTouSpeInte( 80, 70, 75, 60 );
		that.initLibSensCor( 65, 25, 60 );
		that.weaponName = 'twisted club';
		that.weaponVerb = 'smash';
		that.weaponAttack = 0;
		that.weaponPerk = '';
		that.weaponValue = 25;
		that.armorName = 'skin';
		that.armorDef = 2;
		that.bonusHP = 250;
		that.lust = 30;
		that.lustVuln = 0.35;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 14;
		that.gems = 10 + Utils.rand( 5 );
		that.drop = new ChainedDrop().add( ConsumableLib.REDUCTO, 1 / 5 ).add( ConsumableLib.SUCMILK, 1 / 2 ).elseDrop( ConsumableLib.BLACK_D );
		that.checkMonster();
	};
	return Gnoll;
} );