'use strict';

angular.module( 'cocjs' ).factory( 'Sophie', function( SceneLib, MainView, $log, Harpy, PerkLib, CoC, EngineCore, Monster, ArmorLib, Utils, AppearanceDefs, StatusAffects, Appearance, ChainedDrop, ConsumableLib, Combat ) {
	function Sophie() {
		this.init(this, arguments);
	}
	angular.extend(Sophie.prototype, Harpy.prototype);
	//Combat Attacks;
	//ON DICK'ED PCz;
	//Kiss (Only used on males) - +10 lust on kiss.  25% chance;
	//per round of increasing lust by 20.  Repeat kisses add;
	//+20 lust.  Each kiss adds 2 hours to length of status;
	//affect.;
	Sophie.prototype.sophieKissAttack = function() {
		SceneLib.sophieBimbo.sophieSprite();
		MainView.outputText( 'Sophie bobs and weaves as she closes the distance between you in an instant.  ', false );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( this.getCapitalA() + this.short + ' looks like she\'s trying to kiss you, but it\'s easy to avoid the blind harpy!\n', false );
			return;
		}
		//Determine if dodged!;
		if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			MainView.outputText( 'Sophie changes direction in a flash, trying to slip inside your guard, but you manage to sidestep the incredibly fast harpy\'s attack.\n', false );
			return;
		}
		//Determine if evaded;
		if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 10 ) {
			MainView.outputText( 'Using your skills at evading attacks, you anticipate and sidestep ' + this.a + this.short + '\'s attack.\n', false );
			return;
		}
		if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 10 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'Using Raphael\'s teachings and the movement afforded by your bodysuit, you anticipate and sidestep ' + this.a + this.short + '\'s attack.\n', false );
			return;
		}
		//Determine if cat'ed;
		if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 6 ) {
			MainView.outputText( 'With your incredible flexibility, you squeeze out of the way of ' + this.a + this.short + '', false );
			MainView.outputText( '\'s attack.\n', false );
			return;
		}
		//YOU GOT HIT SON;
		MainView.outputText( 'Before you can react, she gives you a chaste peck on the lips.  The harpy pulls back with a sultry smile, watching you expectantly.', false );
		//Already affected by it;
		if( CoC.player.findStatusAffect( StatusAffects.Luststick ) >= 0 ) {
			MainView.outputText( '  Blood rushes to ' + CoC.player.sMultiCockDesc() + ' as you grow so hard so fast that it hurts.  ', false );
			SceneLib.sophieScene.luststickApplication( 2 );
			EngineCore.dynStats( 'lus', (12 + CoC.player.lib / 10) );
			if( CoC.player.lust < 70 ) {
				MainView.outputText( 'The drugged lip-gloss is starting to get to you!\n', false );
			} else if( CoC.player.lust < 80 ) {
				MainView.outputText( 'Her curvy thighs look so inviting.  You barely stop yourself before you climb in between them!\n', false );
			} else if( CoC.player.lust < 90 ) {
				MainView.outputText( 'A trickle of pre-cum leaks from ' + CoC.player.sMultiCockDesc() + '.  Sophie coos, "<i>Why don\'t you give in and let mommy Sophie drain out all that juicy cum?</i>"\n', false );
			} else if( CoC.player.lust < 100 ) {
				MainView.outputText( CoC.player.SMultiCockDesc() + ' twitches and bounces in time with your heartbeat, practically pulling you towards Sophie\'s gaping, pink-linked snatch.\n', false );
			} else {
				MainView.outputText( 'So horny.  You need to copulate - no, fuck - right NOW.  Your hand touches your ' + CoC.player.cockDescript( 0 ) + ' and you swoon, pumping your hips lewdly as you submit.\n', false );
			}
		} else {
			MainView.outputText( '  Your whole body blushes as your lips tingle with some unnatural sensation.  Her lips were drugged!  Your whole body flushes as arousal begins to course through your veins.  ', false );
			SceneLib.sophieScene.luststickApplication( 2 );
			EngineCore.dynStats( 'lus', 8 + CoC.player.lib / 10 );
			if( CoC.player.lust < 70 ) {
				MainView.outputText( 'The drugged lip-gloss is starting to get to you!\n', false );
			} else if( CoC.player.lust < 80 ) {
				MainView.outputText( 'Her curvy thighs look so inviting.  You barely stop yourself before you climb in between them!\n', false );
			} else if( CoC.player.lust < 90 ) {
				MainView.outputText( 'A trickle of pre-cum leaks from ' + CoC.player.sMultiCockDesc() + '.  Sophie coos, "<i>Why don\'t you give in and let mommy Sophie drain out all that juicy cum?</i>"\n', false );
			} else if( CoC.player.lust < 100 ) {
				MainView.outputText( CoC.player.SMultiCockDesc() + ' twitches and bounces in time with your heartbeat, practically pulling you towards Sophie\'s gaping, pink-linked snatch.\n', false );
			} else {
				MainView.outputText( 'So horny.  You need to copulate - no, fuck - right NOW.  Your hand touches your ' + CoC.player.cockDescript( 0 ) + ' and you swoon, pumping your hips lewdly as you submit.\n', false );
			}
		}
	};
	//Harpy-Boating (Only used on males);
	//Takes off and flies directly at PC, locking her hips ;
	//around PC's torso and smothering the PC with breasts ;
	//for a few moments.;
	//Easily dodged with evade or flexibility.;
	Sophie.prototype.sophieHarpyBoatsPC = function() {
		SceneLib.sophieBimbo.sophieSprite();
		MainView.outputText( this.getCapitalA() + this.short + ' flaps her wings and launches herself forwards with her talons up.  ', false );
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( this.getCapitalA() + this.short + '\'s talons are easy to avoid thanks to her blindness!\n', false );
			return;
		}
		//Determine if dodged!;
		if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			MainView.outputText( this.a + this.short + '\'s movements are incredibly fast but you manage to sidestep them.\n', false );
			return;
		}
		//Determine if evaded;
		if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 60 ) {
			MainView.outputText( 'Using your skills at evading attacks, you determine ' + this.a + this.short + ' is aiming for your upper body and slide under the attack.\n', false );
			return;
		}
		if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 40 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'Using Raphael\'s teachings and the movement afforded by your bodysuit, you anticipate and sidestep ' + this.a + this.short + '\'s attack.\n', false );
			return;
		}
		//Determine if cat'ed;
		if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 40 ) {
			MainView.outputText( 'With your incredible flexibility, you squeeze out of the way of ' + this.a + this.short + '', false );
			MainView.outputText( '\'s attack.\n', false );
			return;
		}
		//YOU GOT HIT SON;
		MainView.outputText( 'She hits you hard, nearly bowling you over.  Thankfully, her talons passed to either side of your torso.  They lock together behind your back and your face is pulled tightly into Sophie\'s smotheringly large mounds!', false );
		if( Utils.rand( 2 ) === 0 ) {
			MainView.outputText( '  She jiggles them around you pleasantly and coos, "<i>Don\'t fight it baby.  Just let your body do what comes naturally.</i>"\n', false );
		} else {
			MainView.outputText( '  She runs her long fingernails through your hair as she whispers, "<i>Why fight it?  I\'ll make you feel so good.  Just relax and play with momma Sophie\'s tits.</i>"\n', false );
		}
		EngineCore.dynStats( 'lus', (13 + CoC.player.sens / 10) );
	};
	//Compulsion (Male Only);
	Sophie.prototype.sophieCompulsionAttack = function() {
		SceneLib.sophieBimbo.sophieSprite();
		MainView.outputText( 'Sophie spreads her thick thighs and slips four fingers into her slippery sex.  She commands, "<i>Touch yourself for me.  Be a good pet and masturbate for me.</i>"  ', false );
		//Autosucceeds if player inte < 40;
		//autofails if player inte > 80;
		//Player fails:;
		if( CoC.player.inte < 40 || (CoC.player.inte < 80 && Utils.rand( 40 ) > (CoC.player.inte - 40)) ) {
			MainView.outputText( 'You moan out loud as your arms move of their own volition.  They reach inside your ' + CoC.player.armorName + ' and stroke ' + CoC.player.sMultiCockDesc() + ', caress the tip, and continue to fondle you a few moments.', false );
			MainView.outputText( 'Even after regaining control of your limbs, you\'re left far more turned on by the ordeal.', false );
			EngineCore.dynStats( 'lus', (15 + CoC.player.cor / 20 + CoC.player.lib / 20) );
		}
		//Player resists;
		else {
			MainView.outputText( 'You can feel her words carrying the force of a magical compulsion behind them, but you focus your willpower and overcome it.', false );
		}
	};
	//ON FEMALE PCz;
	//Talons (Female Only);
	//High damage attack easily avoided by evade/flexibility.;
	Sophie.prototype.talonsSophie = function() {
		SceneLib.sophieBimbo.sophieSprite();
		MainView.outputText( 'Sophie pulls her leg up, cocking her thigh dangerously.  Look out!  ', false );
		var damage = 0;
		//Blind dodge change;
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 && Utils.rand( 3 ) < 2 ) {
			MainView.outputText( this.getCapitalA() + this.short + '\'s talons are easy to avoid thanks to her blindness!\n', false );
			return;
		}
		//Determine if dodged!;
		if( CoC.player.spe - this.spe > 0 && Math.ceil( Math.random() * (((CoC.player.spe - this.spe) / 4) + 80) ) > 80 ) {
			MainView.outputText( this.a + this.short + '\'s tears through the air, but you manage to just barely dodge it.\n', false );
			return;
		}
		//Determine if evaded;
		if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 100 ) < 60 ) {
			MainView.outputText( 'Using your skills at evading attacks, you watch ' + this.a + this.short + ' and deftly sidestep her brutal talons.\n', false );
			return;
		}
		if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 30 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			MainView.outputText( 'Using Raphael\'s teachings and the movement afforded by your bodysuit, you anticipate and sidestep ' + this.a + this.short + '\'s attack.\n', false );
			return;
		}
		//Determine if cat'ed;
		if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && Utils.rand( 100 ) < 40 ) {
			MainView.outputText( 'With your incredible flexibility, you squeeze out of the way of ' + this.a + this.short + '', false );
			MainView.outputText( '\'s attack.\n', false );
			return;
		}
		MainView.outputText( 'Her leg lashes forwards, lightning-quick, and tears bloody gashes into your ' + CoC.player.skinDesc + ' with her razor-sharp talons! ', false );
		//Determine damage - str modified by enemy toughness!;
		damage = Math.ceil( (this.str + this.weaponAttack) - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
		if( damage < 0 ) {
			damage = 0;
		}
		damage += 40;
		damage = CoC.player.takeDamage( damage );
		MainView.outputText( '(' + damage + ')\n', false );
	};
	//Batter (Female Only);
	//Batters PC with wings – 4x attack impossible to dodge.*/;
	Sophie.prototype.batterAttackSophie = function() {
		SceneLib.sophieBimbo.sophieSprite();
		var damage = 0;
		MainView.outputText( 'Sophie comes at you in a flurry of beating wings!  There\'s no way to dodge the flurry of strikes!\n', false );
		//Determine damage - str modified by enemy toughness!;
		damage = Math.ceil( this.str - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
		if( damage < 0 ) {
			damage = 0;
		}
		damage = CoC.player.takeDamage( damage );
		MainView.outputText( 'Her left primary wing batters your head! (' + damage + ')\n', false );
		//Determine damage - str modified by enemy toughness!;
		damage = Math.ceil( this.str - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
		if( damage < 0 ) {
			damage = 0;
		}
		damage = CoC.player.takeDamage( damage );
		MainView.outputText( 'Her right, wing-like arm slaps at your torso! (' + damage + ')\n', false );
		//Determine damage - str modified by enemy toughness!;
		damage = Math.ceil( this.str - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
		if( damage < 0 ) {
			damage = 0;
		}
		damage = CoC.player.takeDamage( damage );
		MainView.outputText( 'Her other feathery arm punches at your shoulder! (' + damage + ')\n', false );
		//Determine damage - str modified by enemy toughness!;
		damage = Math.ceil( this.str - Math.random() * (CoC.player.tou) - CoC.player.armorDef );
		if( damage < 0 ) {
			damage = 0;
		}
		damage = CoC.player.takeDamage( damage );
		MainView.outputText( 'Her right wing slams into the other side of your head! (' + damage + ')\n', false );
	};
	Sophie.prototype.performCombatAction = function() {
		//Sophie has special AI in harpySophie.as;
		SceneLib.sophieBimbo.sophieSprite();
		var rando = 1;
		//Update attacks for girls/neuters;
		if( !CoC.player.hasCock() || this.findStatusAffect( StatusAffects.BimboBrawl ) >= 0 ) {
			//Talons;
			this.special1 = this.talonsSophie;
			//Batter;
			this.special2 = this.batterAttackSophie;
			//Clear;
			this.special3 = null;
		}
		//Dicks ahoy;
		else {
			//kiss;
			this.special1 = this.sophieKissAttack;
			//harpy-boating;
			this.special2 = this.sophieHarpyBoatsPC;
			//compulsion;
			this.special3 = this.sophieCompulsionAttack;
		}
		if( CoC.player.hasCock() && this.findStatusAffect( StatusAffects.BimboBrawl ) < 0 ) {
			rando = 1 + Utils.rand( 3 );
		} else {
			rando = 1 + Utils.rand( 2 );
		}
		if( rando === 1 ) {
			this.special1();
		}
		if( rando === 2 ) {
			this.special2();
		}
		if( rando === 3 ) {
			this.special3();
		}
		Combat.combatRoundOver();
	};
	Sophie.prototype.defeated = function() {
		if( this.findStatusAffect( StatusAffects.BimboBrawl ) >= 0 ) {
			SceneLib.sophieFollowerScene.beatUpDebimboSophie();
		} else {
			SceneLib.sophieScene.sophieLostCombat();
		}
	};
	/* jshint unused:true */
	Sophie.prototype.won = function( hpVictory, pcCameWorms ) {
		if( this.findStatusAffect( StatusAffects.BimboBrawl ) >= 0 ) {
			SceneLib.sophieFollowerScene.debimboSophieBeatsYouUp();
		} else if( pcCameWorms ) {
			MainView.outputText( '\n\nYour foe seems disgusted by the display and leaves you to recover alone...' );
			Combat.cleanupAfterCombat();
		} else {
			SceneLib.sophieScene.sophieWonCombat();
		}
	};
	Sophie.prototype.init = function( that ) {
		Harpy.prototype.init( that, [ true ] );
		that.classNames.push('Sophie');
		$log.debug( 'Sophie Constructor!' );
		that.a = '';
		that.short = 'Sophie';
		that.imageName = 'sophie';
		that.long = 'Sophie is approximately the size of a normal human woman, not counting the large feathery wings that sprout from her back.  Her face is gorgeous, with large rounded eyes and glimmering amber lip-gloss painted on her lush, kissable lips.  In spite of her beauty, it\'s clear from the barely discernible laugh lines around her mouth that she\'s been around long to enough to have quite a few children.  Her feathers are light pink, though the downy plumage that comprises her \'hair\' is brighter than the rest.  She moves with practiced grace despite the large, jiggling breasts that hang from her chest.  Judging from her confident movements, she\'s an experienced fighter.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_DROOLING, AppearanceDefs.VAGINA_LOOSENESS_GAPING_WIDE );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 40, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'DD' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 10, 0, 0, 0 );
		that.tallness = 5 * 12 + 5;
		that.hipRating = AppearanceDefs.HIP_RATING_INHUMANLY_WIDE;
		that.buttRating = AppearanceDefs.BUTT_RATING_EXPANSIVE;
		that.skinTone = 'pink';
		that.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		that.skinDesc = 'feathers';
		that.hairColor = 'pink';
		that.hairLength = 16;
		that.initStrTouSpeInte( 55, 40, 110, 60 );
		that.initLibSensCor( 60, 50, 60 );
		that.weaponName = 'talons';
		that.weaponVerb = 'slashing talons';
		that.weaponAttack = 20;
		that.armorName = 'feathers';
		that.armorDef = 5;
		that.bonusHP = 250;
		that.lust = 10;
		that.lustVuln = 0.3;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 11;
		that.gems = 20 + Utils.rand( 25 );
		that.drop = new ChainedDrop().add( ArmorLib.W_ROBES, 1 / 10 )
			.elseDrop( ConsumableLib.GLDSEED );
		that.wingType = AppearanceDefs.WING_TYPE_HARPY;
		that.wingDesc = 'large feathery';
		that.special1 = that.harpyUberCharge;
		that.special2 = that.harpyTease;
		that.checkMonster();
	};
	return Sophie;
} );