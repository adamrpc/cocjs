'use strict';

angular.module( 'cocjs' ).factory( 'Clara', function( SceneLib, MainView, Descriptors, $log, PerkLib, CoC, Monster, Utils, StatusAffects, Appearance, AppearanceDefs, Combat, EngineCore ) {
	function Clara() {
		this.init(this, arguments);
	}
	angular.extend(Clara.prototype, Monster.prototype);
	Clara.prototype.notMurbleEnjoysTheLacticAcid = function() {
		//Clara drinks her own milk to recover health and give a minor lust gain to the PC;
		MainView.outputText( 'Clara suddenly starts roughly manhandling her tit, noisily stuffing it into her mouth and starting to suck and slobber. Frothy milk quickly stains her mouth and she releases her breast, letting it fall back down. She belches and takes a stance to defend herself again; you can see the injuries you’ve inflicted actually fading as the healing power of her milk fills her.' );
		this.HP += 45;
		this.lust += 5;
		EngineCore.dynStats( 'lus', (5 + CoC.player.lib / 5) );
		Combat.combatRoundOver();
	};
	//Clara throws a goblin potion, she has the web potion, the lust potion, and the weakening potion;
	//should she try to drug them instead?;
	Clara.prototype.claraDrugAttack = function() {
		var temp2 = Utils.rand( 2 );
		var color = '';
		if( temp2 === 0 ) {
			color = 'red';
		}
		if( temp2 === 1 ) {
			color = 'black';
		}
		//Throw offensive potions at the player;
		MainView.outputText( 'Clara suddenly snatches something from a pouch at her belt. "<i>Try this, little cutie!</i>" She snarls, and throws a vial of potion at you.', false );
		//Dodge chance!;
		if( (CoC.player.findPerk( PerkLib.Evade ) >= 0 && Utils.rand( 10 ) <= 3) || (Utils.rand( 100 ) < CoC.player.spe / 5) ) {
			MainView.outputText( '\nYou narrowly avoid the gush of alchemic fluids!\n', false );
		} else {
			//Get hit!;
			//Temporary heat;
			if( color === 'red' ) {
				MainView.outputText( '\nThe red fluids hit you and instantly soak into your skin, disappearing.  Your skin flushes and you feel warm.  Oh no...\n', false );
				if( CoC.player.findStatusAffect( StatusAffects.TemporaryHeat ) < 0 ) {
					CoC.player.createStatusAffect( StatusAffects.TemporaryHeat, 0, 0, 0, 0 );
				}
			}
			//Increase fatigue;
			if( color === 'black' ) {
				MainView.outputText( '\nThe black fluid splashes all over you and wicks into your skin near-instantly.  It makes you feel tired and drowsy.\n', false );
				EngineCore.fatigue( 10 + Utils.rand( 25 ) );
			}
		}
		Combat.combatRoundOver();
		return;
	};
	//Clara teases the PC, and tries to get them to give up;
	Clara.prototype.claraTeaseAttack = function() {
		//[cocked PCs only] ;
		if( Utils.rand( 3 ) === 0 ) {
			MainView.outputText( 'Clara hesitates, then lifts up her dress and shows you her womanhood.  Then she slowly utters, "<i>You know, I’m still a virgin.  You’d be the first thing to ever enter inside this hole, something that Marble never could have offered you.</i>"  What would it be like, you wonder for a moment, before catching yourself and trying to focus back on the fight.' );
		} else if( Utils.rand( 2 ) === 0 ) {
			MainView.outputText( 'Clara seems to relax for a moment and bounces her breasts in her hands.  "<i>Come on, you know how good it is to drink cow-girl milk, just give up!</i>" she coos.  Despite yourself, you can’t help but remember what it was like, and find yourself becoming aroused.' );
		} else {
			MainView.outputText( 'Instead of attacking, Clara runs her hands up and down her body, emphasizing all the curves it has.  "<i>You were made to be the milk slave of this, stop fighting it!</i>" she says almost exasperated.  Even so, you find your gaze lingering on those curves against your will.' );
		}
		MainView.outputText( '\n' );
		EngineCore.dynStats( 'lus', 5 + CoC.player.lib / 20 );
		Combat.combatRoundOver();
	};
	//Once Clara is at half health or lower, she'll cast blind.;
	Clara.prototype.claraCastsBlind = function() {
		MainView.outputText( 'Clara glares at you, clearly being worn down.  Then strange lights start dancing around her hand and she points it in your direction.' );
		//Successful: ;
		if( CoC.player.inte / 5 + Utils.rand( 20 ) + 1 < 14 ) {
			MainView.outputText( '\nA bright flash of light erupts in your face, blinding you!  You desperately blink and rub your eyes while Clara cackles with glee.' );
			CoC.player.createStatusAffect( StatusAffects.Blind, 1, 0, 0, 0 );
		} else {
			MainView.outputText( '\nYou manage to close your eyes just in time to avoid being blinded by the bright flash of light that erupts in your face!  Clara curses when she see\'s you\'re unaffected by her magic.' );
		}
		Combat.combatRoundOver();
	};
	Clara.prototype.claraGropesBlindPCs = function() {
		//Clara gropes the PC while they're blinded.  Damage is based on corruption + sensitivity.;
		if( CoC.player.hasCock() && (!CoC.player.hasVagina() || Utils.rand( 2 ) === 0) ) {
			MainView.outputText( 'Suddenly Clara wraps an arm around you, and sticks a hand into your ' + CoC.player.armorName + '!  She is able to give your ' + Descriptors.multiCockDescriptLight + ' a good fondle before you can push her away.  "<i>Admit it - I make you soo hard, don\'t I?</i>" she taunts you behind your dazzled vision.' );
		}//Vagina: ;
		else if( CoC.player.hasVagina() ) {
			MainView.outputText( 'A sudden rush of Clara\'s hoofs clopping is the only warning you get before her attack comes, and you try to bring up your guard, only for her to deftly move past your defense and stick a hand into your ' + CoC.player.armorName + '!  She manages to worm her way to your [vagina] and pinches your [clit] before you can push her back out!  "<i>Hmm, yeah, you\'re soo wet for me.</i>" she taunts you behind your dazzled vision.' );
		}//Bum: ;
		else {
			MainView.outputText( 'Thanks to Clara robbing you of your sight, you lose track of her.  She takes advantage of this, and grabs you from behind, and rubs her considerable curvy cans against your undefended back!  You manage to get her off you after a moment, but not before she gives your [ass] a smack.  "<i>Everyone will be soo much happier when yoou finally stop fighting me!</i>" she taunts you behind your dazzled vision.' );
		}
		EngineCore.dynStats( 'lus', 7 + CoC.player.lib / 15 );
		Combat.combatRoundOver();
	};
	//Every round if you're in Clara’s base; the PC’s lust is raised slightly.;
	Clara.prototype.claraBonusBaseLustDamage = function() {
		MainView.outputText( '\nThe early effects of your addiction are making it harder and harder to continue the fight.  You need to end it soon or you’ll give in to those urges.' );
		EngineCore.dynStats( 'lus', 2 + CoC.player.lib / 20 );
		Combat.combatRoundOver();
	};
	Clara.prototype.performCombatAction = function() {
		if( CoC.player.findStatusAffect( StatusAffects.ClaraFoughtInCamp ) >= 0 && CoC.player.statusAffectv1( StatusAffects.ClaraCombatRounds ) >= 10 ) {
			this.HP = 0;
			Combat.combatRoundOver();
		}
		if( this.HP < 50 && Utils.rand( 2 ) === 0 ) {
			this.notMurbleEnjoysTheLacticAcid();
		} else if( CoC.player.findStatusAffect( StatusAffects.Blind ) >= 0 ) {
			this.claraGropesBlindPCs();
		} else {
			var actions = [ this.eAttack, this.claraDrugAttack, this.claraTeaseAttack, this.claraCastsBlind ];
			var action = Utils.rand( actions.length );
			$log.debug( 'ACTION SELECTED: ' + action );
			actions[ action ]();
		}
		if( CoC.player.findStatusAffect( StatusAffects.ClaraCombatRounds ) < 0 ) {
			CoC.player.createStatusAffect( StatusAffects.ClaraCombatRounds, 1, 0, 0, 0 );
		} else {
			CoC.player.addStatusValue( StatusAffects.ClaraCombatRounds, 1, 1 );
		}

		//Bonus damage if not in camp;
		if( this.HP > 0 && this.lust < 100 && CoC.player.findStatusAffect( StatusAffects.ClaraFoughtInCamp ) < 0 ) {
			this.claraBonusBaseLustDamage();
		}
	};
	Clara.prototype.defeated = function() {
		//PC wins via turn count;
		if( CoC.player.findStatusAffect( StatusAffects.ClaraFoughtInCamp ) >= 0 && CoC.player.statusAffectv1( StatusAffects.ClaraCombatRounds ) >= 10 ) {
		} else {
			MainView.clearOutput();
			//PC wins via health;
			if( this.HP <= 0 ) {
				MainView.outputText( 'The pissed off cowgirl finally collapses to the ground.  She tries to stand up again, but finds that she can’t.  "<i>Noo!</i>" she cries out in frustration, "<i>You were the perfect slave!  We were meant to be toogether!</i>"\n\n' );
			}
			//PC wins via lust;
			else {
				MainView.outputText( 'The fury and anger finally give out to the overwhelming lust that you’ve help Clara feel.  She can’t fight anymore, and falls onto her backside.  She starts feeling herself up, and desperately asks you to fuck her.\n\n' );
			}
		}
		SceneLib.marblePurification.defeatClaraCuntInAFight();
	};
	Clara.prototype.won = function() {
		SceneLib.marblePurification.loseToClara();
	};
	Clara.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Clara');
		$log.debug( 'Clara Constructor!' );
		that.a = '';
		that.short = 'Clara';
		that.imageName = 'marble';
		that.long = 'You are fighting Marble’s little sister Clara!  The cow-girl looks spitting mad, determined to steal you from her sister and make you into her milk slave, with her breasts hanging out for all to see.  Fortunately, she doesn’t look as big or strong as her sister, and you don’t think she’s been trained to fight like Marble has either.  Still, there is no telling what tricks she has up her sleeves, and she is holding a very angry looking heavy mace.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_NORMAL, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createBreastRow( Appearance.breastCupInverse( 'F' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_VIRGIN;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.tallness = 6 * 12 + 4;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HOOFED;
		that.skinTone = 'pale';
		that.hairColor = 'brown';
		that.hairLength = 13;
		that.initStrTouSpeInte( 37, 55, 35, 60 );
		that.initLibSensCor( 25, 45, 40 );
		that.weaponName = 'mace';
		that.weaponVerb = 'smack';
		that.weaponAttack = 10;
		that.armorName = 'tough hide';
		that.armorDef = 5;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 5;
		that.bonusHP = 30;
		that.gems = Utils.rand( 5 ) + 25;
		that.drop = Monster.NO_DROP;
		that.tailType = AppearanceDefs.TAIL_TYPE_COW;
		that.checkMonster();
	};
	return Clara;
} );