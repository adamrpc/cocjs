'use strict';

angular.module( 'cocjs' ).factory( 'IncubusMechanic', function( SceneLib, MainView, CockTypesEnum, WeightedDrop, ConsumableLib, kFLAGS, CoC, EngineCore, Utils, AppearanceDefs, Monster, Combat, Descriptors, StatusAffects ) {
	function IncubusMechanic() {
		this.init(this, arguments);
	}
	angular.extend(IncubusMechanic.prototype, Monster.prototype);
	IncubusMechanic.prototype.defeated = function( hpVictory ) {
		if( CoC.flags[ kFLAGS.D3_DISCOVERED ] === 0 ) {
			this.defeatedInDungeon1( hpVictory );
		} else {
			this.defeatedInDungeon3( hpVictory );
		}
	};
	IncubusMechanic.prototype.defeatedInDungeon1 = function( hpVictory ) {
		MainView.clearOutput();
		if( hpVictory ) {
			MainView.outputText( 'You smile in satisfaction as the ' + this.short + ' collapses, unable to continue fighting.' );
		} else {
			MainView.outputText( 'You smile in satisfaction as the ' + this.short + ' collapses, masturbating happily.' );
		}
		if( CoC.player.gender === 0 ) {
			MainView.outputText( '  Now would be the perfect opportunity to test his demonic tool...\n\nHow do you want to handle him?' );
			EngineCore.choices( 'Anally', SceneLib.dungeonCore, SceneLib.dungeonCore.incubusVictoryRapeBackdoor, 'Orally', SceneLib.dungeonCore, SceneLib.dungeonCore.incubusVictoryService, '', null, null, '', null, null, 'Leave', null, Combat.cleanupAfterCombat );
		} else {
			EngineCore.dynStats( 'lus', 1 );
			if( hpVictory ) {
				MainView.outputText( '  Now would be the perfect opportunity to put his tool to use...\n\nWhat do you do, rape him, service him, or let him take you anally?' );
				EngineCore.choices( 'Rape', SceneLib.dungeonCore, SceneLib.dungeonCore.incubusVictoryRapeSex, 'Service Him', SceneLib.dungeonCore, SceneLib.dungeonCore.incubusVictoryService, 'Anal', SceneLib.dungeonCore, SceneLib.dungeonCore.incubusVictoryRapeBackdoor, '', null, null, 'Nothing', null, Combat.cleanupAfterCombat );
			} else {
				MainView.outputText( '  Now would be the perfect opportunity to put his tool to use...\n\nWhat do you do?' );
				var titfuck = null;
				if( CoC.player.hasVagina() && CoC.player.biggestTitSize() >= 4 && CoC.player.armorName === 'lusty maiden\'s armor' ) {
					titfuck = EngineCore.createCallBackFunction( CoC.player.armor, CoC.player.armor.lustyMaidenPaizuri, CoC.player, this );
				}
				EngineCore.choices( 'Rape', SceneLib.dungeonCore, SceneLib.dungeonCore.incubusVictoryRapeSex, 'Service Him', SceneLib.dungeonCore, SceneLib.dungeonCore.incubusVictoryService, 'Anal', SceneLib.dungeonCore, SceneLib.dungeonCore.incubusVictoryRapeBackdoor, 'B.Titfuck', null, titfuck, 'Nothing', null, Combat.cleanupAfterCombat );
			}
		}
	};
	IncubusMechanic.prototype.defeatedInDungeon3 = function( hpVictory ) {
		CoC.incubusMechanicScenes.beatDaMechanic( hpVictory );
	};
	IncubusMechanic.prototype.won = function( hpVictory, pcCameWorms ) {
		if( CoC.flags[ kFLAGS.D3_DISCOVERED ] === 0 ) {
			this.wonInDungeon1( hpVictory, pcCameWorms );
		} else {
			this.wonInDungeon3( hpVictory, pcCameWorms );
		}
	};
	/* jshint unused:true */
	IncubusMechanic.prototype.wonInDungeon1 = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			MainView.outputText( '\n\nYour foe doesn\'t seem to care...' );
			EngineCore.doNext( Combat, Combat.endLustLoss );
		} else {
			SceneLib.dungeonCore.incubusLossRape();
		}
	};
	IncubusMechanic.prototype.wonInDungeon3 = function( hpVictory, pcCameWorms ) {
		CoC.incubusMechanicScenes.mechanicFuckedYouUp( hpVictory, pcCameWorms );
	};
	IncubusMechanic.prototype.cockTripAttack = function() {
		if( this.findStatusAffect( StatusAffects.Blind ) ) { //Blind dodge change
			MainView.outputText( this.getCapitalA() + this.short + ' suddenly grows it\'s dick to obscene lengths and tries to trip you with it.  Thankfully he\'s so blind he wasn\'t aiming anywhere near you!' );
			Combat.combatRoundOver();
			return;
		}
		MainView.outputText( 'The incubus lunges forward in a clumsy attack that you start to side-step, only to feel something grip behind your ' + Descriptors.buttDescript() + ' and pull your ' + CoC.player.legs() + ' out from under you.' );
		if( (CoC.player.spe - 30) > Utils.rand( 60 ) ) {
			MainView.outputText( '  You spin as you fall, twisting your ' + CoC.player.legs() + ' free and springing back to your ' + CoC.player.feet() + ' unharmed.' );
		} else {
			{ //Fall down go boom
			}
			MainView.outputText( '  You land hard on your ass, momentarily stunned as the demonic cock-tentacle curls around your ' + CoC.player.legs() + ', smearing them with oozing demonic fluids.' );
			if( CoC.player.lust >= 80 || CoC.player.cor >= 80 ) {
				MainView.outputText( '  Moaning with desire, you lick your lips as you slide your well-lubricated ' + CoC.player.legs() + ' free.  You gather a dollop of cum and lick it seductively, winking at the incubus and hoping to make him cave into his desire.' );
				EngineCore.dynStats( 'lus', 13, 'cor', 1 );
			} else if( CoC.player.lust >= 50 || CoC.player.cor >= 50 ) {
				MainView.outputText( '  Blushing at the scent and feel of cum on your ' + CoC.player.legs() + ', you twist and pull free.  You find yourself wondering what this demon\'s dick would taste like.' );
				EngineCore.dynStats( 'lus', 8 + CoC.player.cor / 20 );
			} else {
				MainView.outputText( '  Disgusted, you pull away from the purplish monstrosity, the act made easier by your well-slimed ' + CoC.player.legs() + '.' );
				EngineCore.dynStats( 'lus', 5 + CoC.player.cor / 20 );
			}
			CoC.player.takeDamage( 5 );
		}
		MainView.outputText( '\nThe incubus gives an overconfident smile as his cock retracts away from you, returning to its normal size.' );
		Combat.combatRoundOver();
	};
	IncubusMechanic.prototype.spoogeAttack = function() {
		if( this.findStatusAffect( StatusAffects.Blind ) ) { //Blind dodge change
			MainView.outputText( this.getCapitalA() + this.short + ' pumps and thrusts his hips lewdly before cumming with intense force in your direction!  Thankfully his aim was off due to the blindness currently affect him.' );
			Combat.combatRoundOver();
			return;
		}
		MainView.outputText( 'Your demonic foe places his hands behind his head and lewdly pumps and thrusts his hips at you.  Your eyes open wide as a globule of cum erupts from the demon-prick and flies right at you.  ' );
		MainView.outputText( 'You do your best to dodge, but some still lands on your ' );
		switch( Utils.rand( 3 ) ) {
			case 0: //Face
				MainView.outputText( 'face.  The gooey demon-seed oozes and slides over you with a mind of its own, forcing its way into your mouth and nose!  You can feel it moving around inside you, doing its best to prepare you for its master.' );
				EngineCore.dynStats( 'lus', 3 );
				if( !CoC.player.findStatusAffect( StatusAffects.DemonSeed ) ) {
					CoC.player.createStatusAffect( StatusAffects.DemonSeed, 5, 0, 0, 0 );
				} else {
					CoC.player.addStatusValue( StatusAffects.DemonSeed, 1, 7 );
				}
				CoC.player.slimeFeed();
				break;
			case 1: //Chest
				if( CoC.player.hasFuckableNipples() ) {
					MainView.outputText( Descriptors.allBreastsDescript() + '.  The gooey demon-seed oozes and slides over you with a mind of its own, forcing its way into your open nipples.  You can feel it moving around inside you, doing its best to prepare you for its master.' );
					EngineCore.dynStats( 'lus', 3 );
					if( !CoC.player.findStatusAffect( StatusAffects.DemonSeed ) ) {
						CoC.player.createStatusAffect( StatusAffects.DemonSeed, 5, 0, 0, 0 );
					} else {
						CoC.player.addStatusValue( StatusAffects.DemonSeed, 1, 8 );
					}
					CoC.player.slimeFeed();
				} else {
					MainView.outputText( Descriptors.allBreastsDescript() + '.  Thankfully it doesn\'t seem to have much effect.' );
				}
				break;
			default: //Crotch
				if( CoC.player.vaginas.length > 0 ) {
					MainView.outputText( 'crotch.  The gooey demon-seed oozes and slides over you with a mind of its own, forcing its way past your ' + CoC.player.armorName + ' and into your ' + Descriptors.vaginaDescript( 0 ) + '.  You can feel it moving around inside you, doing its best to prepare you for its master.' );
					EngineCore.dynStats( 'lus', 3 );
					if( !CoC.player.findStatusAffect( StatusAffects.DemonSeed ) ) {
						CoC.player.createStatusAffect( StatusAffects.DemonSeed, 5, 0, 0, 0 );
					} else {
						CoC.player.addStatusValue( StatusAffects.DemonSeed, 1, 8 );
					}
					CoC.player.slimeFeed();
				} else {
					MainView.outputText( 'crotch.  Thankfully, it doesn\'t seem to have much effect.' );
				}
		}
		Combat.combatRoundOver();
		this.lust -= 10;
		if( this.lust < 0 ) {
			this.lust = 10;
		}
	};
	IncubusMechanic.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('IncubusMechanic');
		that.a = 'the ';
		that.short = 'incubus mechanic';
		that.imageName = 'incubusmechanic';
		that.long = 'The demon before you is clad only in cut-off denim overalls.  Covered in stains of oil and other strange fluids, they appear to be in pretty rough shape.  There is a large hole ripped in the crotch, allowing the demon\'s foot-long member to hang free.  His skin is light purple and perfect, contrasting with the slovenly appearance of his clothing.  His face is rugged and handsome, topped with a simple black ponytail and two large horns that sprout from his forehead like twisted tree-trunks.  He wears a narrow goatee on his chin that is kept skillfully braided.  A cocky smile always seems to grace his features, giving him an air of supreme confidence.';
		that.createCock( 12, 1.75, CockTypesEnum.DEMON );
		that.balls = 2;
		that.ballSize = 2;
		that.cumMultiplier = 3;
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_SLIME_DROOLING;
		that.tallness = Utils.rand( 9 ) + 70;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE;
		that.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_CLAWS;
		that.skinTone = 'light purple';
		that.hairColor = 'black';
		that.hairLength = 12;
		that.initStrTouSpeInte( 65, 40, 45, 85 );
		that.initLibSensCor( 80, 70, 80 );
		that.weaponName = 'claws';
		that.weaponVerb = 'claw';
		that.weaponAttack = 10;
		that.weaponPerk = '';
		that.weaponValue = 150;
		that.armorName = 'demonic skin';
		that.armorDef = 10;
		that.bonusHP = 150;
		that.lust = 50;
		that.lustVuln = 0.5;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 8;
		that.gems = Utils.rand( 25 ) + 10;
		that.drop = new WeightedDrop( ConsumableLib.GROPLUS, 1 );
		that.special1 = this.cockTripAttack;
		that.special2 = this.spoogeAttack;
		that.tailType = AppearanceDefs.TAIL_TYPE_DEMONIC;
		that.wingType = AppearanceDefs.WING_TYPE_BAT_LIKE_TINY;
		that.wingDesc = 'tiny hidden';
		that.checkMonster();
	};
	return IncubusMechanic;
} );