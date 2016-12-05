'use strict';

angular.module( 'cocjs' ).factory( 'HellHound', function( MainView, $log, SceneLib, CoC, EngineCore, Monster, CockTypesEnum, Utils, PerkLib, WeightedDrop, AppearanceDefs, StatusAffects, Combat, ConsumableLib ) {
	function HellHound() {
		this.init(this, arguments);
	}
	angular.extend(HellHound.prototype, Monster.prototype);
	HellHound.prototype.hellhoundFire = function() {
		//Blind dodge change
		if( this.findStatusAffect( StatusAffects.Blind ) >= 0 ) {
			EngineCore.outputText( this.getCapitalA() + this.short + ' completely misses you with a wave of dark fire! Thank the gods it\'s blind!', false );
			Combat.combatRoundOver();
			return;
		}
		if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && CoC.player.spe >= 35 && Utils.rand( 3 ) !== 0 ) {
			EngineCore.outputText( 'Both the hellhound\'s heads breathe in deeply before blasting a wave of dark fire at you.  You easily avoid the wave, diving to the side and making the most of your talents at evasion.', false );
		} else if( CoC.player.findPerk( PerkLib.Misdirection ) >= 0 && Utils.rand( 100 ) < 20 && CoC.player.armorName === 'red, high-society bodysuit' ) {
			EngineCore.outputText( 'Using Raphael\'s teachings and the movement afforded by your bodysuit, you anticipate and sidestep ' + this.a + this.short + '\'s fire.\n', false );
		} else if( CoC.player.findPerk( PerkLib.Flexibility ) >= 0 && CoC.player.spe > 30 && Utils.rand( 10 ) !== 0 ) {
			EngineCore.outputText( 'Both the hellhound\'s heads breathe in deeply before blasting a wave of dark fire at you.  You twist and drop with incredible flexibility, watching the fire blow harmlessly overhead.', false );
		} else {
			//Determine the damage to be taken
			var temp = 15 + Utils.rand( 10 );
			temp = CoC.player.takeDamage( temp );
			EngineCore.outputText( 'Both the hellhound\'s heads breathe in deeply before blasting a wave of dark fire at you. While the flames don\'t burn much, the unnatural heat fills your body with arousal. (' + temp + ' damage)', false );
			EngineCore.dynStats( 'lus', 20 - (CoC.player.sens / 10) );
			EngineCore.statScreenRefresh();
			if( CoC.player.HP <= 0 ) {
				EngineCore.doNext( Combat.endHpLoss );
				return;
			}
			if( CoC.player.lust >= 100 ) {
				EngineCore.doNext( Combat.endLustLoss );
				return;
			}
		}
		EngineCore.doNext( MainView.playerMenu );
	};
	HellHound.prototype.hellhoundScent = function() {
		if( CoC.player.findStatusAffect( StatusAffects.NoFlee ) >= 0 ) {
			if( this.spe === 100 ) {
				this.hellhoundFire();
				return;
			} else {
				EngineCore.outputText( 'The hellhound sniffs your scent again, seemingly gaining more and more energy as he circles faster around you.', false );
				this.spe = 100;
			}
		} else {
			this.spe += 40;
			EngineCore.outputText( 'The hellhound keeps his four eyes on you as he sniffs the ground where you were moments ago. He raises his heads back up and gives you a fiery grin - he seems to have acquired your scent!  It\'ll be hard to get away now...', false );
			CoC.player.createStatusAffect( StatusAffects.NoFlee, 0, 0, 0, 0 );
		}
		Combat.combatRoundOver();
	};

	HellHound.prototype.defeated = function( hpVictory ) {
		if( hpVictory ) {
			EngineCore.outputText( 'The hellhound\'s flames dim and the heads let out a whine before the creature slumps down, this.defeated and nearly unconscious.', true );
			//Rape if not naga, turned on, and girl that can fit!
			if( CoC.player.hasVagina() && CoC.player.lust >= 33 && !CoC.player.isNaga() ) {
				EngineCore.outputText( '  You find yourself musing that you could probably take advantage of the poor \'doggy\'.  Do you fuck it?', false );
				EngineCore.choices( 'Fuck it', SceneLib.hellHoundScene.hellHoundPropahRape, '', null, '', null, '', null, 'Leave', Combat.cleanupAfterCombat );
			} else {
				Combat.cleanupAfterCombat();
			}
		} else {
			EngineCore.outputText( 'Unable to bear hurting you anymore, the hellhound\'s flames dim as he stops his attack. The two heads look at you, whining plaintively.  The hellhound slowly pads over to you and nudges its noses at your crotch.  It seems he wishes to pleasure you.\n\n', true );
			var temp2 = null;
			if( CoC.player.gender > 0 && CoC.player.lust >= 33 ) {
				EngineCore.outputText( 'You realize your desires aren\'t quite sated.  You could let it please you', false );
				//Rape if not naga, turned on, and girl that can fit!
				if( CoC.player.hasVagina() && CoC.player.lust >= 33 && !CoC.player.isNaga() ) {
					EngineCore.outputText( ' or make it fuck you', false );
					temp2 = SceneLib.hellHoundScene.hellHoundPropahRape;
				}
				EngineCore.outputText( '.  What do you do?', false );
				EngineCore.choices( 'Lick', SceneLib.hellHoundScene.hellHoundGetsRaped, 'Fuck', temp2, '', null, '', null, 'Leave', Combat.cleanupAfterCombat );
			} else {
				EngineCore.outputText( 'You turn away, not really turned on enough to be interested in such an offer.', false );
				Combat.cleanupAfterCombat();
			}
		}
	};
	HellHound.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nThe hellhound snorts and leaves you to your fate.', false );
			EngineCore.doNext( Combat.cleanupAfterCombat );
		} else {
			SceneLib.hellHoundScene.hellhoundRapesPlayer();
		}
	};
	HellHound.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('HellHound');
		if( !args[ 0 ] ) {
			return;
		}
		$log.debug( 'HellHound Constructor!' );
		that.a = 'the ';
		that.short = 'hellhound';
		that.imageName = 'hellhound';
		that.long = 'It looks like a large demon on all fours with two heads placed side-by-side. The heads are shaped almost like human heads, but they have dog ears on the top and have a long dog snout coming out where their mouths and noses would be.  Its eyes and mouth are filled with flames and its hind legs capped with dog paws, but its front ones almost look like human hands.  Its limbs end in large, menacing claws. A thick layer of dark fur covers his entire body like armor.  Both heads look at you hungrily as the hellhound circles around you. You get the feeling that reasoning with this beast will be impossible.';
		that.createCock( 8, 2, CockTypesEnum.DOG );
		that.createCock( 8, 2, CockTypesEnum.DOG );
		that.balls = 2;
		that.ballSize = 4;
		that.cumMultiplier = 5;
		that.createBreastRow();
		that.createBreastRow();
		that.createBreastRow();
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_NORMAL;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.tallness = 47;
		that.hipRating = AppearanceDefs.HIP_RATING_AVERAGE;
		that.buttRating = AppearanceDefs.BUTT_RATING_AVERAGE + 1;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DOG;
		that.skinTone = 'black';
		that.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		that.hairColor = 'red';
		that.hairLength = 3;
		that.initStrTouSpeInte( 55, 60, 40, 1 );
		that.initLibSensCor( 95, 20, 100 );
		that.weaponName = 'claws';
		that.weaponVerb = 'claw';
		that.weaponAttack = 10;
		that.armorName = 'thick fur';
		that.lust = 25;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 5;
		that.gems = 10 + Utils.rand( 10 );
		that.drop = new WeightedDrop().add( ConsumableLib.CANINEP, 3 )
			.addMany( 1, ConsumableLib.BULBYPP,
				ConsumableLib.KNOTTYP,
				ConsumableLib.BLACKPP,
				ConsumableLib.DBLPEPP,
				ConsumableLib.LARGEPP );
		that.tailType = AppearanceDefs.TAIL_TYPE_DOG;
		that.special1 = that.hellhoundFire;
		that.special2 = that.hellhoundScent;
		that.checkMonster();
	};
	return HellHound;
} );