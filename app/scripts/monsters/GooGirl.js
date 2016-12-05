'use strict';

angular.module( 'cocjs' ).factory( 'GooGirl', function( MainView, SceneLib, CoC, EngineCore, Monster, Utils, PerkLib, AppearanceDefs, StatusAffects, ChainedDrop, Combat, ConsumableLib, WeaponLib, UsableLib ) {
	function GooGirl() {
		this.init(this, arguments);
	}
	angular.extend(GooGirl.prototype, Monster.prototype);
	/*Fight-
	 You are fighting a goo-girl.
	 The goo-girl has a curious expression on her youthful, shimmering face. Her body is slender and globs of slime regularly drip from her limbs, splattering into the goo puddle pooling beneath her hips. A small, heart-shaped nucleus pulses in her chest with a red glow. [if the player has a c-cup or larger chest has apparently made herself a bit more like you, as her chest appears to be a perfect copy of your ' + biggestBreastSizeDescript()+ '.]
	 */
	//[Goo attacks]
	//Slap – The slime holds its hands up and they morph into a replica of your ' + weaponName + '. Happily, she swings at you, painfully smacking her gooey limbs against your head.  You shake your ' + Descriptors.hairDescript() + ', clearing your head of the dazing slap. (lightly damages hit points)
	//Acid Slap (Only after player's fire attack) – Her body quivering from your flames, the goo-girl delivers a painful slap across your cheek. You gasp when the light stinging becomes a searing burn that seems to get worse as time goes on! (heavily damages hit points and puts Acid Burn on the player)
	GooGirl.prototype.gooGalAttack = function() {
		var damage = 0;
		//return to combat menu when finished
		EngineCore.doNext( MainView.playerMenu );
		if( this.findPerk( PerkLib.Acid ) >= 0 ) {
			EngineCore.outputText( 'Her body quivering from your flames, the goo-girl ', false );
		} else {
			EngineCore.outputText( 'The slime holds its hands up and they morph into a replica of your ' + CoC.player.weaponName + '.  Happily, she swings at you', false );
		}
		//Determine if dodged!
		if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			if( this.findPerk( PerkLib.Acid ) >= 0 ) {
				EngineCore.outputText( 'tries to slap you, but you dodge her attack.', false );
			} else {
				EngineCore.outputText( ', missing as you dodge aside.', false );
			}
			return;
		}
		//Determine if evaded
		if( this.short !== 'Kiha' && CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			if( this.findPerk( PerkLib.Acid ) >= 0 ) {
				EngineCore.outputText( 'tries to slap you, but you evade her attack.', false );
			} else {
				EngineCore.outputText( ', but you evade the clumsy attack.', false );
			}
			return;
		}
		//('Misdirection'
		if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			if( this.findPerk( PerkLib.Acid ) >= 0 ) {
				EngineCore.outputText( 'tries to slap you.  You misdirect her, avoiding the hit.', false );
			} else {
				EngineCore.outputText( ', missing as you misdirect her attentions.', false );
			}
			return;
		}
		//Determine if cat'ed
		if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
			if( this.findPerk( PerkLib.Acid ) >= 0 ) {
				EngineCore.outputText( 'tries to slap you, but misses due to your cat-like evasion.', false );
			} else {
				EngineCore.outputText( ', missing due to your cat-like evasion.', false );
			}
			return;
		}
		//Determine damage - str modified by enemy toughness!
		if( this.findPerk( PerkLib.Acid ) >= 0 ) {
			damage = Math.ceil( (this.str + 10 + this.weaponAttack) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef );
		} else {
			damage = Math.ceil( (this.str + this.weaponAttack) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef );
		}
		if( damage > 0 ) {
			damage = CoC.player.takeDamage( damage );
		}
		if( damage <= 0 ) {
			damage = 0;
			if( this.findPerk( PerkLib.Acid ) >= 0 ) {
				if( Utils.rand( CoC.player.armorDef + CoC.player.tou ) < CoC.player.armorDef ) {
					EngineCore.outputText( 'tries to slap you, but the acid-bearing slap spatters weakly off your ' + CoC.player.armorName + '.', false );
				} else {
					EngineCore.outputText( 'tries to slap you with an acid-loaded hand, but it splatters off you ineffectually.', false );
				}
			} else {
				//Due to toughness or amor...
				if( Utils.rand( CoC.player.armorDef + CoC.player.tou ) < CoC.player.armorDef ) {
					EngineCore.outputText( ', her attack slapping fruitlessly against your ' + CoC.player.armorName + '.', false );
				} else {
					EngineCore.outputText( ', her attack splattering ineffectually against you.', false );
				}
			}
		}
		//everyone else
		else {
			if( this.findPerk( PerkLib.Acid ) >= 0 ) {
				EngineCore.outputText( 'delivers a painful slap across your cheek.  You gasp when the light stinging becomes a searing burn that seems to get worse as time goes on!', false );
				if( CoC.player.findStatusAffect( StatusAffects.AcidSlap ) < 0 ) {
					CoC.player.createStatusAffect( StatusAffects.AcidSlap, 0, 0, 0, 0 );
				}
			} else {
				EngineCore.outputText( ', painfully smacking her gooey limbs against your head.  You shake your ' + CoC.player.hairDescript() + ', clearing your head of the dazing slap.', false );
			}
			EngineCore.outputText( ' (' + damage + ')', false );
		}
		if( damage > 0 ) {
			if( this.lustVuln > 0 && CoC.player.armorName === 'barely-decent bondage straps' ) {
				if( !this.plural ) {
					EngineCore.outputText( '\n' + this.getCapitalA() + this.short + ' brushes against your exposed skin and jerks back in surprise, coloring slightly from seeing so much of you revealed.', false );
				} else {
					EngineCore.outputText( '\n' + this.getCapitalA() + this.short + ' brush against your exposed skin and jerk back in surprise, coloring slightly from seeing so much of you revealed.', false );
				}
				this.lust += 5 * this.lustVuln;
			}
		}
		EngineCore.statScreenRefresh();
		EngineCore.outputText( '\n', false );
		Combat.combatRoundOver();
	};
	//Play –
	GooGirl.prototype.gooPlay = function() {
		EngineCore.outputText( 'The goo-girl lunges, wrapping her slimy arms around your waist in a happy hug, hot muck quivering excitedly against you. She looks up, empty eyes confused by your lack of enthusiasm and forms her mouth into a petulant pout before letting go.  You shiver in the cold air, regretting the loss of her embrace.', false );
		EngineCore.dynStats( 'lus', 3 + Utils.rand( 3 ) + CoC.player.sens / 10 );
		Combat.combatRoundOver();
	};
	//Throw –
	GooGirl.prototype.gooThrow = function() {
		EngineCore.outputText( 'The girl reaches into her torso, pulls a large clump of goo out, and chucks it at you like a child throwing mud. The slime splatters on your chest and creeps under your ' + CoC.player.armorName + ', tickling your skin like fingers dancing across your body.', false );
		var damage = 1;
		CoC.player.takeDamage( damage );
		EngineCore.dynStats( 'lus', 5 + Utils.rand( 3 ) + CoC.player.sens / 10 );
		Combat.combatRoundOver();
	};
	//Engulf –
	GooGirl.prototype.gooEngulph = function() {
		EngineCore.outputText( 'The goo-girl gleefully throws her entire body at you and, before you can get out of the way, she has engulfed you in her oozing form! Tendrils of ' + this.skinTone + ' slime slide up your nostrils and through your lips, filling your lungs with the girl\'s muck. You begin suffocating!', false );
		if( CoC.player.findStatusAffect( StatusAffects.GooBind ) < 0 ) {
			CoC.player.createStatusAffect( StatusAffects.GooBind, 0, 0, 0, 0 );
		}
		Combat.combatRoundOver();
	};
	GooGirl.prototype.performCombatAction = function() {
		//1/3 chance of base attack + bonus if in acid mode
		if( (this.findPerk( PerkLib.Acid ) >= 0 && Utils.rand( 3 ) === 0) || Utils.rand( 3 ) === 0 ) {
			this.gooGalAttack();
		} else if( Utils.rand( 5 ) === 0 ) {
			this.gooEngulph();
		} else if( Utils.rand( 3 ) === 0 ) {
			this.gooPlay();
		} else {
			this.gooThrow();
		}
	};
	GooGirl.prototype.defeated = function() {
		SceneLib.gooGirlScene.beatUpGoo();
	};
	GooGirl.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nThe goo-girl seems confused but doesn\'t mind.' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			SceneLib.gooGirlScene.getBeatByGooGirl();
		}
	};
	GooGirl.prototype.teased = function( lustDelta ) {
		if( this.lust <= 99 ) {
			if( lustDelta <= 0 ) {
				EngineCore.outputText( '\nThe goo-girl looks confused by your actions, as if she\'s trying to understand what you\'re doing.', false );
			} else if( lustDelta < 13 ) {
				EngineCore.outputText( '\nThe curious goo has begun stroking herself openly, trying to understand the meaning of your actions by imitating you.', false );
			} else {
				EngineCore.outputText( '\nThe girl begins to understand your intent. She opens and closes her mouth, as if panting, while she works slimy fingers between her thighs and across her jiggling nipples.', false );
			}
		} else {
			EngineCore.outputText( '\nIt appears the goo-girl has gotten lost in her mimicry, squeezing her breasts and jilling her shiny ' + this.skinTone + ' clit, her desire to investigate you forgotten.', false );
		}
		this.applyTease( lustDelta );
	};
	GooGirl.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('GooGirl');
		if( !args[ 0 ] ) {
			return;
		}
		var playerHasBigBoobs = CoC.player.biggestTitSize() >= 3;
		that.a = 'the ';
		that.short = 'goo-girl';
		that.imageName = 'googirl';
		that.long = 'The goo-girl has a curious expression on her youthful, shimmering face. Her body is slender and globs of slime regularly drip from her limbs, splattering into the goo puddle pooling beneath her hips. A small, heart-shaped nucleus pulses in her chest with a red glow.' + (playerHasBigBoobs ? ('  She has apparently made herself a bit more like you, as her chest appears to be a perfect copy of your ' + CoC.player.chestDesc() + '.') : '');
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLAVERING, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 9001, 0, 0, 0 );
		that.createBreastRow( playerHasBigBoobs ? CoC.player.biggestTitSize() : 3 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_SLIME_DROOLING;
		that.createStatusAffect( StatusAffects.BonusACapacity, 9001, 0, 0, 0 );
		that.tallness = Utils.rand( 8 ) + 70;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_GOO;
		var tone = Utils.randomChoice( 'blue', 'purple', 'crystal' );
		that.skinTone = tone;
		that.skinType = AppearanceDefs.SKIN_TYPE_GOO;
		that.skinAdj = 'goopey';
		that.hairColor = tone;
		that.hairLength = 12 + Utils.rand( 10 );
		that.initStrTouSpeInte( 25, 25, 20, 30 );
		that.initLibSensCor( 50, 40, 10 );
		that.weaponName = 'hands';
		that.weaponVerb = 'slap';
		that.armorName = 'gelatinous skin';
		that.bonusHP = 40;
		that.lust = 45;
		that.lustVuln = 0.75;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 3;
		that.gems = Utils.rand( 5 ) + 1;
		that.drop = new ChainedDrop().add( WeaponLib.PIPE, 1 / 10 )
			.add( ConsumableLib.WETCLTH, 1 / 2 )
			.elseDrop( UsableLib.GREENGL );
		that.checkMonster();
	};
	//Color types are presented as [Blue slimes/Purple Slimes/Clear Slimes]
	GooGirl.prototype.gooColor = function() {
		//blue, purple, or crystal
		return this.skinTone;
	};
	//[azure/plum/crystalline]
	GooGirl.prototype.gooColor2 = function() {
		if( this.skinTone === 'blue' ) {
			return 'azure';
		} else if( this.skinTone === 'purple' ) {
			return 'plum';
		} else {
			return 'crystalline';
		}
	};
	//[cerulean/violet/clear]
	GooGirl.prototype.gooColor3 = function() {
		if( this.skinTone === 'blue' ) {
			return 'cerulean';
		} else if( this.skinTone === 'purple' ) {
			return 'violet';
		} else {
			return 'clear';
		}
	};
	//[teal/lavender/glassy]
	GooGirl.prototype.gooColor4 = function() {
		if( this.skinTone === 'blue' ) {
			return 'teal';
		} else if( this.skinTone === 'purple' ) {
			return 'lavender';
		} else {
			return 'glassy';
		}
	};
	//[sapphire/amethyst/diamond]
	GooGirl.prototype.gooColor5 = function() {
		if( this.skinTone === 'blue' ) {
			return 'sapphire';
		} else if( this.skinTone === 'purple' ) {
			return 'amethyst';
		} else {
			return 'diamond';
		}
	};
	//[lapis/periwinkle/pure]
	GooGirl.prototype.gooColor6 = function() {
		if( this.skinTone === 'blue' ) {
			return 'sapphire';
		} else if( this.skinTone === 'purple' ) {
			return 'amethyst';
		} else {
			return 'diamond';
		}
	};
	//[blue berry/grape/crystal]
	GooGirl.prototype.gooColor7 = function() {
		if( this.skinTone === 'blue' ) {
			return 'blueberry';
		} else if( this.skinTone === 'purple' ) {
			return 'grape';
		} else {
			return 'crystal';
		}
	};
	//[aquamarine/plum/transparent]
	GooGirl.prototype.gooColor8 = function() {
		if( this.skinTone === 'blue' ) {
			return 'aquamarine';
		} else if( this.skinTone === 'purple' ) {
			return 'plum';
		} else {
			return 'transparent';
		}
	};
	//[an aquamarine/a lilac/a translucent]
	GooGirl.prototype.gooColor9 = function() {
		if( this.skinTone === 'blue' ) {
			return 'an aquamarine';
		} else if( this.skinTone === 'purple' ) {
			return 'a plum';
		} else {
			return 'a translucent';
		}
	};
	//[blueberries/grapes/strawberries]
	GooGirl.prototype.gooColor10 = function() {
		if( this.skinTone === 'blue' ) {
			return 'blueberries';
		} else if( this.skinTone === 'purple' ) {
			return 'grapes';
		} else {
			return 'strawberries';
		}
	};
	//[cerulean tint/violet tint/clear body]
	GooGirl.prototype.gooColor11 = function() {
		if( this.skinTone === 'blue' ) {
			return 'cerulean tint';
		} else if( this.skinTone === 'purple' ) {
			return 'violet tint';
		} else {
			return 'clear body';
		}
	};
	return GooGirl;
} );