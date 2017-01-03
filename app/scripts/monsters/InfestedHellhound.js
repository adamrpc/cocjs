'use strict';

angular.module( 'cocjs' ).factory( 'InfestedHellhound', function( SceneLib, MainView, $log, CoC, EngineCore, Monster, Utils, Descriptors, CoC_Settings, HellHound, WeightedDrop, AppearanceDefs, StatusAffects, Combat, ConsumableLib ) {
	function InfestedHellhound() {
		this.init(this, arguments);
	}
	angular.extend(InfestedHellhound.prototype, HellHound.prototype);
	//[Extra special attack]
	InfestedHellhound.prototype.hellHoundWormCannon = function() {
		MainView.outputText( 'The thing rears up onto its hind legs, revealing its more humanoid stature, and allowing it to use its flexible paws to caress its twinned-penises.  It lurches forwards powerfully, its thickness twitching and flaring as it launches a wave of worm-filled canine cum at you.', false );
		MainView.outputText( '\n', false );
		if( Utils.rand( 2 ) === 0 ) {
			//Get hit – 10+ lust
			EngineCore.dynStats( 'lus', 5 + CoC.player.lib / 20 );
			MainView.outputText( 'Taken off-guard by the unexpected sexual display, you fail to move out of the way, and the wormy jism splatters you from the chest down.', false );
			if( CoC.player.findStatusAffect( StatusAffects.Infested ) && CoC.player.totalCocks() > 0 ) {
				MainView.outputText( '  The worms inside you begin moving and squirming. A few of your cum-soaked parasites crawl out from your shivering ' + Descriptors.multiCockDescriptLight() + ' as if attempting to meet the new arrivals.  You desperately want to brush them away, but the pleasure in your crotch is too good to fight, and you find yourself staying your hand as each and every one of the new worms makes it way into your ' + Descriptors.multiCockDescriptLight() + '.', false );
				if( CoC.player.balls > 0 ) {
					MainView.outputText( '  Your ' + Descriptors.ballsDescriptLight() + ' grow weightier as the worms settle into their new home, arousing you beyond measure.', false );
				} else {
					MainView.outputText( '  You can feel them shifting around inside you as they adjust to their new home, arousing you beyond measure.', false );
				}
				EngineCore.dynStats( 'lus', 10 );
			} else if( CoC.player.totalCocks() > 0 ) {
				MainView.outputText( '  The worms wriggle and squirm all over you, working their way towards your groin.  It tickles pleasantly, but you brush them away before they can get inside you.  The thought of being turned into a worm-dispensing cum fountain is horrifying, but it leaves you hard.', false );
				EngineCore.dynStats( 'lus', (5 + Math.round( CoC.player.cor / 20 )) );
			} else if( CoC.player.hasVagina() ) {
				MainView.outputText( '  Thankfully, the worms don\'t seem to want anything to do with you, and rapidly drop down to the ground.', false );
			}
		}
		//Sidestep
		else {
			MainView.outputText( 'You sidestep the gush of wormy fluid, letting it splatter against the rocks behind you.', false );
			//(If infested +10 lust:
			if( CoC.player.findStatusAffect( StatusAffects.Infested ) && CoC.player.hasCock() ) {
				if( CoC.player.hasCock() ) {
					MainView.outputText( '  Despite avoiding the torrent of infected seed, your own wormy ', false );
					if( CoC.player.balls > 0 ) {
						MainView.outputText( Descriptors.ballsDescriptLight(), false );
					} else {
						MainView.outputText( Descriptors.multiCockDescriptLight(), false );
					}
					MainView.outputText( ' wriggle', false );
					if( CoC.player.balls === 0 && CoC.player.cockTotal() === 1 ) {
						MainView.outputText( 's', false );
					}
					MainView.outputText( ' hotly, expelling a few of your own worms in response along with a dribble of thick pre-cum.   You wonder what it would feel like to let his worms crawl inside you...', false );
					EngineCore.dynStats( 'lus', 10 );
				} else {
					CoC_Settings.error( 'Infested but no cock!' );
					EngineCore.dynStats( 'lus', 5 );
					MainView.outputText( '  The idea of being covered in the beast\'s infested seed arouses you slightly, but you shake your head violently and clear away the unwelcome thought.', false );
				}
			}
			//if aroused by worms +5 lust:
			else if( CoC.player.findStatusAffect( StatusAffects.WormsOn ) && !CoC.player.findStatusAffect( StatusAffects.WormsHalf ) ) {
				EngineCore.dynStats( 'lus', 5 );
				MainView.outputText( '  The idea of being covered in the beast\'s infested seed arouses you slightly, but you shake your head violently and clear away the unwelcome thought.', false );
			}
		}
		this.lust -= 25;
		if( this.lust < 40 ) {
			this.lust = 40;
		}
		Combat.combatRoundOver();
	};
	InfestedHellhound.prototype.defeated = function( hpVictory ) {
		if( hpVictory ) {
			MainView.outputText( 'The hellhound\'s flames dim and the heads let out a whine before the creature slumps down, this.defeated, unconscious, and yet still drooling worms.', true );
			Combat.cleanupAfterCombat();
		} else {
			MainView.outputText( 'Unable to bear its unnatural arousal, the infested hellhound\'s flames dim as he stops his attack. The two heads look at you, whining plaintively.  The hellhound slowly pads over to you and nudges its noses at your crotch.  It seems he wishes to pleasure you.\n\n', true );
			if( CoC.player.gender > 0 && CoC.player.lust >= 33 ) {
				MainView.outputText( 'You realize your desires aren\'t quite sated.  You could let it please you.  Do you?', false );
				EngineCore.choices( 'Fuck it', SceneLib.hellHoundScene, SceneLib.hellHoundScene.hellHoundGetsRaped, '', null, null, '', null, null, '', null, null, 'Leave', null, Combat.cleanupAfterCombat );
			} else {
				MainView.outputText( 'You turn away, not really turned on enough to be interested in such an offer from such a beast.', false );
				Combat.cleanupAfterCombat();
			}
		}
	};
	InfestedHellhound.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			MainView.outputText( '\n\nThe infested hellhound\'s heads both grin happily as it advances towards you...', false );
			EngineCore.doNext( SceneLib.infestedHellhoundScene, SceneLib.infestedHellhoundScene.infestedHellhoundLossRape );
		} else if( hpVictory ) {
			SceneLib.infestedHellhoundScene.infestedHellhoundLossRape();
		} else {
			SceneLib.infestedHellhoundScene.infestedHellhoundLossRape();
		}
	};
	InfestedHellhound.prototype.init = function( that ) {
		HellHound.prototype.init( that, [ true ] );
		that.classNames.push('InfestedHellhound');
		$log.debug( 'InfestedHellhound Constructor!' );
		that.a = 'the ';
		that.short = 'infested hellhound';
		that.imageName = 'infestedhellhound';
		that.long = 'It looks like a large four-legged demon with two heads placed side-by-side. Its eyes and mouth are filled with flames, and covering each of its paws are large and menacing claws. A thick layer of dark fur covers his entire body like armor.  Both heads are looking at you hungrily as the hellhound circles around you.  A pair of black, slightly pointed cocks hang exposed, dripping with cum and worms.  You get the feeling reasoning with this beast will be impossible.';
		that.createCock( 9, 2 );
		that.createCock( 9, 2 );
		that.balls = 2;
		that.ballSize = 5;
		that.cumMultiplier = 8;
		that.createBreastRow();
		that.createBreastRow();
		that.createBreastRow();
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_NORMAL;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.tallness = 47;
		that.hipRating = AppearanceDefs.HIP_RATING_AVERAGE;
		that.buttRating = AppearanceDefs.BUTT_RATING_AVERAGE + 1;
		that.skinTone = 'black';
		that.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		that.hairColor = 'red';
		that.hairLength = 3;
		that.initStrTouSpeInte( 65, 60, 50, 1 );
		that.initLibSensCor( 95, 20, 100 );
		that.weaponName = 'claws';
		that.weaponVerb = 'claw';
		that.weaponAttack = 5;
		that.armorName = 'thick fur';
		that.lust = 50;
		that.lustVuln = 0.87;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 5;
		that.gems = 10 + Utils.rand( 10 );
		that.drop = new WeightedDrop().add( ConsumableLib.CANINEP, 3 )
			.addMany( 1, ConsumableLib.BULBYPP,
				ConsumableLib.KNOTTYP,
				ConsumableLib.BLACKPP,
				ConsumableLib.DBLPEPP,
				ConsumableLib.LARGEPP );
		that.special1 = that.hellhoundFire;
		that.special2 = that.hellhoundScent;
		that.special3 = that.hellHoundWormCannon;
		that.tailType = AppearanceDefs.TAIL_TYPE_DOG;
		that.checkMonster();
	};
	return InfestedHellhound;
} );