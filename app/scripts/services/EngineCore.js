'use strict';

angular.module( 'cocjs' ).factory( 'EngineCore', function( SceneLib, $log, CoC, kFLAGS, MainView, PerkLib, ItemType, StatusAffects, CoC_Settings ) {
	var EngineCore = {};
	EngineCore.silly = function() {
		return CoC.flags[ kFLAGS.SILLY_MODE_ENABLE_FLAG ];
	};
	var gameOverCallback = null;
	EngineCore.registerGameOver = function( callback ) {
		gameOverCallback = callback;
	};
	EngineCore.gameOver = function( clear ) {
		gameOverCallback( clear );
	};
	EngineCore.HPChange = function( changeNum, display ) {
		if( changeNum === 0 ) {
			return;
		}
		if( changeNum > 0 ) {
			//Increase by 20%!
			if( CoC.player.findPerk( PerkLib.HistoryHealer ) >= 0 ) {
				changeNum *= 1.2;
			}
			if( CoC.player.HP + changeNum > CoC.player.maxHP() ) {
				if( CoC.player.HP >= CoC.player.maxHP() ) {
					if( display ) {
						MainView.outputText( 'You\'re as healthy as you can be.\n', false );
					}
					return;
				}
				if( display ) {
					MainView.outputText( 'Your HP maxes out at ' + CoC.player.maxHP() + '.\n', false );
				}
				if(CoC.player.HP < CoC.player.maxHP()) {
					MainView.statsView.showStatUp( 'HP' );
					MainView.statsView.show();
				}
				CoC.player.HP = CoC.player.maxHP();
			} else {
				if( display ) {
					MainView.outputText( 'You gain ' + changeNum + ' HP.\n', false );
				}
				CoC.player.HP += changeNum;
				MainView.statsView.showStatUp( 'HP' );
				MainView.statsView.show();
			}
		} else { //Negative HP
			if( CoC.player.HP + changeNum <= 0 ) {
				if( display ) {
					MainView.outputText( 'You take ' + (-changeNum) + ' damage, dropping your HP to 0.\n', false );
				}
				if(CoC.player.HP > 0) {
					MainView.statsView.showStatDown( 'HP' );
					MainView.statsView.show();
				}
				CoC.player.HP = 0;
			} else {
				if( display ) {
					MainView.outputText( 'You take ' + (-changeNum) + ' damage.\n', false );
				}
				CoC.player.HP += changeNum;
				MainView.statsView.showStatDown( 'HP' );
				MainView.statsView.show();
			}
		}
	};
	
	// Returns a string or undefined.
	var getButtonToolTipText = function( buttonText ) {
		if( buttonText === null ) {
			return '';
		}
		var toolTipText = '';
		if( buttonText.indexOf( ' x' ) !== -1 ) {
			buttonText = buttonText.split( ' x' )[ 0 ];
		}
		var itype = ItemType.lookupItem( buttonText );
		if( itype !== undefined ) {
			return itype.description;
		}
		itype = ItemType.lookupItemByShort( buttonText );
		if( itype !== undefined ) {
			return itype.description;
		}
		return toolTipText;
	};
	// returns a function that takes no arguments, and executes function `func` with argument `arg`
	EngineCore.createCallBackFunction = function( object, func, arg ) {
		if( !_.isFunction( func ) ) {
			CoC_Settings.error( 'createCallBackFunction(' + func + ',' + arg + ')' );
		}
		if( arg === -9000 || arg === null ) {
			return function() {
				return func.call( object );
			};
		} else {
			return function() {
				return func.call( object, arg );
			};
		}
	};
	EngineCore.createCallBackFunction2 = function( object, func ) {
		var args = _.drop(_.drop(Array.from( arguments )));
		if( !_.isFunction( func ) ) {
			CoC_Settings.error( 'createCallBackFunction2(' + func + ', ' + args + ')' );
		}
		return function() {
			return func.apply( object, args );
		};
	};
	EngineCore.addButton = function( pos, text, obj, func1, arg1 ) {
		EngineCore.addButtonWithTooltip(pos, text, getButtonToolTipText(text), obj, func1, arg1);
	};
	EngineCore.addButtonWithTooltip = function( pos, text, toolTipText, obj, func1, arg1 ) {
		if(text === undefined) {
			text = '';
		}
		if(arg1 === undefined) {
			arg1 = -9000;
		}
		if( func1 === null ) {
			return;
		}
		var callback = EngineCore.createCallBackFunction( obj, func1, arg1 );
		MainView.showBottomButton( pos, text, callback, toolTipText );
	};
	EngineCore.choices = function() { //New typesafe version
		MainView.menu();
		var args = Array.from( arguments );
		if(args.length % 3 !== 0) {
			$log.error('Bad arguments number.');
		}
		_.forEach(_.range(0, args.length - 1, 3), function(choice, index) {
			EngineCore.addButton( index, args[choice], args[choice + 1], args[choice + 2] );
		});
	};
	EngineCore.choicesWithTooltip = function() { //New typesafe version
		MainView.menu();
		var args = Array.from( arguments );
		if(args.length % 4 !== 0) {
			$log.error('Bad arguments number.');
		}
		_.forEach(_.range(0, args.length - 1, 4), function(choice, index) {
			EngineCore.addButtonWithTooltip( index, args[choice], args[choice + 1], args[choice + 2], args[choice + 3] );
		});
	};
	EngineCore.doYesNo = function( objYes, eventYes, objNo, eventNo ) {
		EngineCore.choices('Yes', objYes, eventYes, 'No', objNo, eventNo);
	};
	EngineCore.doNext = function( obj, event ) {
		//Prevent new events in combat from automatically overwriting a game over.
		if( MainView.getButtonText( 0 ).indexOf( 'Game Over' ) !== -1 ) {
			$log.debug( 'Do next setup cancelled by game over' );
			return;
		}
		EngineCore.choices('Next', obj, event);
	};
	//Hide the up/down indicators
	EngineCore.hideUpDown = function() {
		MainView.statsView.hideUpDown();
		//Clear storage values so up/down arrows can be properly displayed
		CoC.oldStats.oldStr = 0;
		CoC.oldStats.oldTou = 0;
		CoC.oldStats.oldSpe = 0;
		CoC.oldStats.oldInte = 0;
		CoC.oldStats.oldLib = 0;
		CoC.oldStats.oldSens = 0;
		CoC.oldStats.oldLust = 0;
		CoC.oldStats.oldCor = 0;
	};
	EngineCore.physicalCost = function( mod ) {
		var costPercent = 100;
		if( CoC.player.findPerk( PerkLib.IronMan ) >= 0 ) {
			costPercent -= 50;
		}
		mod *= costPercent / 100;
		return mod;
	};
	EngineCore.spellCost = function( mod ) {
		//Addiditive mods
		var costPercent = 100;
		if( CoC.player.findPerk( PerkLib.SpellcastingAffinity ) >= 0 ) {
			costPercent -= CoC.player.perkv1( PerkLib.SpellcastingAffinity );
		}
		if( CoC.player.findPerk( PerkLib.WizardsEndurance ) >= 0 ) {
			costPercent -= CoC.player.perkv1( PerkLib.WizardsEndurance );
		}
		//Limiting it and multiplicative mods
		if( CoC.player.findPerk( PerkLib.BloodMage ) >= 0 && costPercent < 50 ) {
			costPercent = 50;
		}
		mod *= costPercent / 100;
		if( CoC.player.findPerk( PerkLib.HistoryScholar ) >= 0 && mod > 2) {
			mod *= 0.8;
		}
		if( CoC.player.findPerk( PerkLib.BloodMage ) >= 0 && mod < 5 ) {
			mod = 5;
		} else if( mod < 2 ) {
			mod = 2;
		}
		mod = Math.round( mod * 100 ) / 100;
		return mod;
	};
	//Modify fatigue
	//types:
	//        0 - normal
	//        1 - magic
	EngineCore.fatigue = function( mod, type ) {
		//Spell reductions
		if( type === 1 ) {
			mod = EngineCore.spellCost( mod );
			//Blood mages use HP for spells
			if( CoC.player.findPerk( PerkLib.BloodMage ) >= 0 ) {
				CoC.player.takeDamage( mod );
				MainView.statsView.show();
				return;
			}
		} else if( type === 2 ) { //Physical special reductions
			mod = EngineCore.physicalCost( mod );
		}
		if( (CoC.player.fatigue >= 100 && mod > 0) || ( CoC.player.fatigue <= 0 && mod < 0 ) ) {
			return;
		}
		//Fatigue restoration buffs!
		if( mod < 0 ) {
			var multi = 1;
			if( CoC.player.findPerk( PerkLib.HistorySlacker ) >= 0 ) {
				multi += 0.2;
			}
			if( CoC.player.findPerk( PerkLib.ControlledBreath ) >= 0 && CoC.player.cor < 30 ) {
				multi += 0.1;
			}
			mod *= multi;
		}
		CoC.player.fatigue += mod;
		if( mod > 0 ) {
			MainView.statsView.showStatUp( 'fatigue' );
		} else if( mod < 0 ) {
			MainView.statsView.showStatDown( 'fatigue' );
		}
		if( CoC.player.fatigue > 100 ) {
			CoC.player.fatigue = 100;
		}
		if( CoC.player.fatigue < 0 ) {
			CoC.player.fatigue = 0;
		}
		MainView.statsView.show();
	};
	EngineCore.displayStats = function( ) {
		MainView.spriteSelect( -1 );
		MainView.outputText( '', true );
		// Begin Combat Stats
		var combatStats = '';
		if( CoC.player.hasKeyItem( 'Bow' ) >= 0 ) {
			combatStats += '<b>Bow Skill:</b> ' + Math.round( CoC.player.statusAffectv1( StatusAffects.Kelt ) ) + '\n';
		}
		combatStats += '<b>Lust Resistance:</b> ' + (100 - Math.round( EngineCore.lustPercent() )) + '% (Higher is better.)\n';
		combatStats += '<b>Spell Effect Multiplier:</b> ' + (100 * CoC.player.spellMod()) + '%\n';
		combatStats += '<b>Spell Cost:</b> ' + EngineCore.spellCost( 100 ) + '%\n';
		if( CoC.flags[ kFLAGS.RAPHAEL_RAPIER_TRANING ] > 0 ) {
			combatStats += '<b>Rapier Skill (Out of 4):</b> ' + CoC.flags[ kFLAGS.RAPHAEL_RAPIER_TRANING ] + '\n';
		}
		combatStats += '<b>Tease Skill (Out of 5):</b>  ' + CoC.player.teaseLevel + '\n';
		if( combatStats !== '' ) {
			MainView.outputText( '<b><u>Combat Stats</u></b>\n' + combatStats, false );
		}
		// End Combat Stats
		// Begin Children Stats
		var childStats = '';
		if( CoC.player.statusAffectv1( StatusAffects.Birthed ) > 0 ) {
			childStats += '<b>Times Given Birth:</b> ' + CoC.player.statusAffectv1( StatusAffects.Birthed ) + '\n';
		}
		if( CoC.flags[ kFLAGS.AMILY_MET ] > 0 ) {
			childStats += '<b>Litters With Amily:</b> ' + (CoC.flags[ kFLAGS.AMILY_BIRTH_TOTAL ] + CoC.flags[ kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS ]) + '\n';
		}
		if( CoC.flags[ kFLAGS.BENOIT_EGGS ] > 0 ) {
			childStats += '<b>Benoit Eggs Laid:</b> ' + CoC.flags[ kFLAGS.BENOIT_EGGS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.COTTON_KID_COUNT ] > 0 ) {
			childStats += '<b>Children With Cotton:</b> ' + CoC.flags[ kFLAGS.COTTON_KID_COUNT ] + '\n';
		}
		if( CoC.flags[ kFLAGS.EDRYN_NUMBER_OF_KIDS ] > 0 ) {
			childStats += '<b>Children With Edryn:</b> ' + CoC.flags[ kFLAGS.EDRYN_NUMBER_OF_KIDS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.EMBER_CHILDREN_MALES ] > 0 ) {
			childStats += '<b>Ember Offspring (Males):</b> ' + CoC.flags[ kFLAGS.EMBER_CHILDREN_MALES ] + '\n';
		}
		if( CoC.flags[ kFLAGS.EMBER_CHILDREN_FEMALES ] > 0 ) {
			childStats += '<b>Ember Offspring (Females):</b> ' + CoC.flags[ kFLAGS.EMBER_CHILDREN_FEMALES ] + '\n';
		}
		if( CoC.flags[ kFLAGS.EMBER_CHILDREN_HERMS ] > 0 ) {
			childStats += '<b>Ember Offspring (Herms):</b> ' + CoC.flags[ kFLAGS.EMBER_CHILDREN_HERMS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.EMBER_EGGS ] > 0 ) {
			childStats += '<b>Ember Eggs Produced:</b> ' + CoC.flags[ kFLAGS.EMBER_EGGS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.IZMA_CHILDREN_SHARKGIRLS ] > 0 ) {
			childStats += '<b>Children With Izma (Sharkgirls):</b> ' + CoC.flags[ kFLAGS.IZMA_CHILDREN_SHARKGIRLS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.IZMA_CHILDREN_TIGERSHARKS ] > 0 ) {
			childStats += '<b>Children With Izma (Tigersharks):</b> ' + CoC.flags[ kFLAGS.IZMA_CHILDREN_TIGERSHARKS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.KELLY_KIDS_MALE ] > 0 ) {
			childStats += '<b>Children With Kelly (Males):</b> ' + CoC.flags[ kFLAGS.KELLY_KIDS_MALE ] + '\n';
		}
		if( CoC.flags[ kFLAGS.KELLY_KIDS ] - CoC.flags[ kFLAGS.KELLY_KIDS_MALE ] > 0 ) {
			childStats += '<b>Children With Kelly (Females):</b> ' + (CoC.flags[ kFLAGS.KELLY_KIDS ] - CoC.flags[ kFLAGS.KELLY_KIDS_MALE ]) + '\n';
		}
		if( SceneLib.salon.lynnetteApproval() !== 0 ) {
			childStats += '<b>Lynnette Children:</b> ' + CoC.flags[ kFLAGS.LYNNETTE_BABY_COUNT ] + '\n';
		}
		if( CoC.flags[ kFLAGS.MARBLE_KIDS ] > 0 ) {
			childStats += '<b>Children With Marble:</b> ' + CoC.flags[ kFLAGS.MARBLE_KIDS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.ANT_KIDS ] > 0 ) {
			childStats += '<b>Ant Children With Phylla:</b> ' + CoC.flags[ kFLAGS.ANT_KIDS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.PHYLLA_DRIDER_BABIES_COUNT ] > 0 ) {
			childStats += '<b>Drider Children With Phylla:</b> ' + CoC.flags[ kFLAGS.PHYLLA_DRIDER_BABIES_COUNT ] + '\n';
		}
		if( CoC.flags[ kFLAGS.SHEILA_JOEYS ] > 0 ) {
			childStats += '<b>Children With Sheila (Joeys):</b> ' + CoC.flags[ kFLAGS.SHEILA_JOEYS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.SHEILA_IMPS ] > 0 ) {
			childStats += '<b>Children With Sheila (Imps):</b> ' + CoC.flags[ kFLAGS.SHEILA_IMPS ] + '\n';
		}
		var sophie = 0;
		if( CoC.flags[ kFLAGS.SOPHIE_ADULT_KID_COUNT ] > 0 || CoC.flags[ kFLAGS.SOPHIE_DAUGHTER_MATURITY_COUNTER ] > 0 ) {
			childStats += '<b>Children With Sophie:</b> ';
			if( CoC.flags[ kFLAGS.SOPHIE_DAUGHTER_MATURITY_COUNTER ] > 0 ) {
				sophie++;
			}
			sophie += CoC.flags[ kFLAGS.SOPHIE_ADULT_KID_COUNT ];
			if( CoC.flags[ kFLAGS.SOPHIE_CAMP_EGG_COUNTDOWN ] > 0 ) {
				sophie++;
			}
			childStats += sophie + '\n';
		}
		if( CoC.flags[ kFLAGS.SOPHIE_EGGS_LAID ] > 0 ) {
			childStats += '<b>Eggs Fertilized For Sophie:</b> ' + (CoC.flags[ kFLAGS.SOPHIE_EGGS_LAID ] + sophie) + '\n';
		}
		if( CoC.flags[ kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS ] > 0 ) {
			childStats += '<b>Children With Tamani:</b> ' + CoC.flags[ kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS ] + ' (after all forms of natural selection)\n';
		}
		if( SceneLib.urtaPregs.urtaKids() > 0 ) {
			childStats += '<b>Children With Urta:</b> ' + SceneLib.urtaPregs.urtaKids() + '\n';
		}
		//Mino sons
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00326 ] > 0 ) {
			childStats += '<b>Number of Adult Minotaur Offspring:</b> ' + CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00326 ] + '\n';
		}
		if( childStats !== '' ) {
			MainView.outputText( '\n<b><u>Children</u></b>\n' + childStats, false );
		}
		// End Children Stats
		// Begin Body Stats
		var bodyStats = '';
		bodyStats += '<b>Anal Capacity:</b> ' + Math.round( CoC.player.analCapacity() ) + '\n';
		bodyStats += '<b>Anal Looseness:</b> ' + Math.round( CoC.player.ass.analLooseness ) + '\n';
		bodyStats += '<b>Fertility (Base) Rating:</b> ' + Math.round( CoC.player.fertility ) + '\n';
		bodyStats += '<b>Fertility (With Bonuses) Rating:</b> ' + Math.round( CoC.player.totalFertility() ) + '\n';
		if( CoC.player.cumQ() > 0 ) {
			bodyStats += '<b>Cum Production:</b> ' + Math.round( CoC.player.cumQ() ) + 'mL\n';
		}
		if( CoC.player.lactationQ() > 0 ) {
			bodyStats += '<b>Milk Production:</b> ' + Math.round( CoC.player.lactationQ() ) + 'mL\n';
		}
		if( CoC.player.findStatusAffect( StatusAffects.Feeder ) >= 0 ) {
			bodyStats += '<b>Hours Since Last Time Breastfed Someone:</b>  ' + CoC.player.statusAffectv2( StatusAffects.Feeder );
			if( CoC.player.statusAffectv2( StatusAffects.Feeder ) >= 72 ) {
				bodyStats += ' (Too long! Sensitivity Increasing!)';
			}
			bodyStats += '\n';
		}
		bodyStats += '<b>Pregnancy Speed Multiplier:</b> ';
		var preg = 1;
		if( CoC.player.findPerk( PerkLib.Diapause ) >= 0 ) {
			bodyStats += '? (Variable due to Diapause)\n';
		} else {
			if( CoC.player.findPerk( PerkLib.MaraesGiftFertility ) >= 0 ) {
				preg++;
			}
			if( CoC.player.findPerk( PerkLib.BroodMother ) >= 0 ) {
				preg++;
			}
			if( CoC.player.findPerk( PerkLib.FerasBoonBreedingBitch ) >= 0 ) {
				preg++;
			}
			if( CoC.player.findPerk( PerkLib.MagicalFertility ) >= 0 ) {
				preg++;
			}
			if( CoC.player.findPerk( PerkLib.FerasBoonWideOpen ) >= 0 || CoC.player.findPerk( PerkLib.FerasBoonMilkingTwat ) >= 0 ) {
				preg++;
			}
			bodyStats += preg + '\n';
		}
		if( CoC.player.cocks.length > 0 ) {
			bodyStats += '<b>Total Cocks:</b> ' + CoC.player.cocks.length + '\n';
			var totalCockLength = 0;
			var totalCockGirth  = 0;
			_.forEach(CoC.player.cocks, function(cock) {
				totalCockLength += cock.cockLength;
				totalCockGirth += cock.cockThickness;
			});
			bodyStats += '<b>Total Cock Length:</b> ' + Math.round( totalCockLength ) + ' inches\n';
			bodyStats += '<b>Total Cock Girth:</b> ' + Math.round( totalCockGirth ) + ' inches\n';
		}
		if( CoC.player.vaginas.length > 0 ) {
			bodyStats += '<b>Vaginal Capacity:</b> ' + Math.round( CoC.player.vaginalCapacity() ) + '\n' + '<b>Vaginal Looseness:</b> ' + Math.round( CoC.player.looseness() ) + '\n';
		}
		if( CoC.player.findPerk( PerkLib.SpiderOvipositor ) >= 0 || CoC.player.findPerk( PerkLib.BeeOvipositor ) >= 0 ) {
			bodyStats += '<b>Ovipositor Total Egg Count: ' + CoC.player.eggs() + '\nOvipositor Fertilized Egg Count: ' + CoC.player.fertilizedEggs() + '</b>\n';
		}
		if( CoC.player.findStatusAffect( StatusAffects.SlimeCraving ) >= 0 ) {
			if( CoC.player.statusAffectv1( StatusAffects.SlimeCraving ) >= 18 ) {
				bodyStats += '<b>Slime Craving:</b> Active! You are currently losing strength and speed.  You should find fluids.\n';
			} else {
				if( CoC.player.findPerk( PerkLib.SlimeCore ) >= 0 ) {
					bodyStats += '<b>Slime Stored:</b> ' + ((17 - CoC.player.statusAffectv1( StatusAffects.SlimeCraving )) * 2) + ' hours until you start losing strength.\n';
				} else {
					bodyStats += '<b>Slime Stored:</b> ' + (17 - CoC.player.statusAffectv1( StatusAffects.SlimeCraving )) + ' hours until you start losing strength.\n';
				}
			}
		}
		if( bodyStats !== '' ) {
			MainView.outputText( '\n<b><u>Body Stats</u></b>\n' + bodyStats, false );
		}
		// End Body Stats
		// Begin Misc Stats
		var miscStats = '';
		if( CoC.flags[ kFLAGS.EGGS_BOUGHT ] > 0 ) {
			miscStats += '<b>Eggs Traded For:</b> ' + CoC.flags[ kFLAGS.EGGS_BOUGHT ] + '\n';
		}
		if( CoC.flags[ kFLAGS.TIMES_AUTOFELLATIO_DUE_TO_CAT_FLEXABILITY ] > 0 ) {
			miscStats += '<b>Times Had Fun with Feline Flexibility:</b> ' + CoC.flags[ kFLAGS.TIMES_AUTOFELLATIO_DUE_TO_CAT_FLEXABILITY ] + '\n';
		}
		if( CoC.flags[ kFLAGS.FAP_ARENA_SESSIONS ] > 0 ) {
			miscStats += '<b>Times Circle Jerked in the Arena:</b> ' + CoC.flags[ kFLAGS.FAP_ARENA_SESSIONS ] + '\n<b>Victories in the Arena:</b> ' + CoC.flags[ kFLAGS.FAP_ARENA_VICTORIES ] + '\n';
		}
		if( CoC.flags[ kFLAGS.SPELLS_CAST ] > 0 ) {
			miscStats += '<b>Spells Cast:</b> ' + CoC.flags[ kFLAGS.SPELLS_CAST ] + '\n';
		}
		if( miscStats !== '' ) {
			MainView.outputText( '\n<b><u>Miscellaneous Stats</u></b>\n' + miscStats );
		}
		// End Misc Stats
		// Begin Addition Stats
		var addictStats = '';
		//Marble Milk Addition
		if( CoC.player.statusAffectv3( StatusAffects.Marble ) > 0 ) {
			addictStats += '<b>Marble Milk:</b> ';
			if( CoC.player.findPerk( PerkLib.MarbleResistant ) < 0 && CoC.player.findPerk( PerkLib.MarblesMilk ) < 0 ) {
				addictStats += Math.round( CoC.player.statusAffectv2( StatusAffects.Marble ) ) + '%\n';
			} else if( CoC.player.findPerk( PerkLib.MarbleResistant ) >= 0 ) {
				addictStats += '0%\n';
			} else {
				addictStats += '100%\n';
			}
		}
		// Mino Cum Addiction
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00340 ] > 0 || CoC.flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] > 0 || CoC.player.findPerk( PerkLib.MinotaurCumAddict ) >= 0 ) {
			if( CoC.player.findPerk( PerkLib.MinotaurCumAddict ) < 0 ) {
				addictStats += '<b>Minotaur Cum:</b> ' + Math.round( CoC.flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] * 10 ) / 10 + '%\n';
			} else {
				addictStats += '<b>Minotaur Cum:</b> 100+%\n';
			}
		}
		if( addictStats !== '' ) {
			MainView.outputText( '\n<b><u>Addictions</u></b>\n' + addictStats, false );
		}
		// End Addition Stats
		// Begin Interpersonal Stats
		var interpersonStats = '';
		if( CoC.flags[ kFLAGS.ARIAN_PARK ] > 0 ) {
			interpersonStats += '<b>Arian\'s Health:</b> ' + Math.round( SceneLib.arianScene.arianHealth() ) + '\n';
		}
		if( CoC.flags[ kFLAGS.ARIAN_VIRGIN ] > 0 ) {
			interpersonStats += '<b>Arian Sex Counter:</b> ' + Math.round( CoC.flags[ kFLAGS.ARIAN_VIRGIN ] ) + '\n';
		}
		if( SceneLib.benoit.benoitAffection() > 0 ) {
			interpersonStats += '<b>' + SceneLib.benoit.benoitMF( 'Benoit', 'Benoite' ) + ' Affection:</b> ' + Math.round( SceneLib.benoit.benoitAffection() ) + '%\n';
		}
		if( CoC.flags[ kFLAGS.BROOKE_MET ] > 0 ) {
			interpersonStats += '<b>Brooke Affection:</b> ' + Math.round( SceneLib.brooke.brookeAffection() ) + '\n';
		}
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00218 ] + CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00219 ] + CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00220 ] > 0 ) {
			interpersonStats += '<b>Body Parts Taken By Ceraph:</b> ' + (CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00218 ] + CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00219 ] + CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00220 ]) + '\n';
		}
		if( SceneLib.emberScene.emberAffection() > 0 ) {
			interpersonStats += '<b>Ember Affection:</b> ' + Math.round( SceneLib.emberScene.emberAffection() ) + '%\n';
		}
		if( SceneLib.helFollower.helAffection() > 0 ) {
			interpersonStats += '<b>Helia Affection:</b> ' + Math.round( SceneLib.helFollower.helAffection() ) + '%\n';
		}
		if( SceneLib.helFollower.helAffection() >= 100 ) {
			interpersonStats += '<b>Helia Bonus Points:</b> ' + Math.round( CoC.flags[ kFLAGS.HEL_BONUS_POINTS ] ) + '\n';
		}
		if( CoC.flags[ kFLAGS.ISABELLA_AFFECTION ] > 0 ) {
			interpersonStats += '<b>Isabella Affection:</b> ';
			if( !SceneLib.isabellaFollowerScene.isabellaFollower() ) {
				interpersonStats += Math.round( CoC.flags[ kFLAGS.ISABELLA_AFFECTION ] ) + '%\n';
			} else {
				interpersonStats += '100%\n';
			}
		}
		if( CoC.flags[ kFLAGS.KATHERINE_UNLOCKED ] >= 4 ) {
			interpersonStats += '<b>Katherine Submissiveness:</b> ' + SceneLib.katherine.submissiveness() + '\n';
		}
		if( CoC.player.findStatusAffect( StatusAffects.Kelt ) >= 0 && CoC.flags[ kFLAGS.KELT_BREAK_LEVEL ] === 0 ) {
			if( CoC.player.statusAffectv2( StatusAffects.Kelt ) >= 130 ) {
				interpersonStats += '<b>Submissiveness To Kelt:</b> ' + 100 + '%\n';
			} else {
				interpersonStats += '<b>Submissiveness To Kelt:</b> ' + Math.round( CoC.player.statusAffectv2( StatusAffects.Kelt ) / 130 * 100 ) + '%\n';
			}
		}
		if( CoC.flags[ kFLAGS.ANEMONE_KID ] > 0 ) {
			interpersonStats += '<b>Kid A\'s Confidence:</b> ' + SceneLib.anemoneScene.kidAXP() + '%\n';
		}
		if( CoC.flags[ kFLAGS.KIHA_AFFECTION_LEVEL ] === 2 ) {
			if( SceneLib.kihaFollower.followerKiha() ) {
				interpersonStats += '<b>Kiha Affection:</b> ' + 100 + '%\n';
			} else {
				interpersonStats += '<b>Kiha Affection:</b> ' + Math.round( CoC.flags[ kFLAGS.KIHA_AFFECTION ] ) + '%\n';
			}
		}
		//Lottie stuff
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00281 ] > 0 ) {
			interpersonStats += '<b>Lottie\'s Encouragement:</b> ' + SceneLib.lottie.lottieMorale() + ' (higher is better)\n' + '<b>Lottie\'s Figure:</b> ' + SceneLib.lottie.lottieTone() + ' (higher is better)\n';
		}
		if( SceneLib.salon.lynnetteApproval() !== 0 ) {
			interpersonStats += '<b>Lynnette\'s Approval:</b> ' + SceneLib.salon.lynnetteApproval() + '\n';
		}
		if( CoC.flags[ kFLAGS.OWCAS_ATTITUDE ] > 0 ) {
			interpersonStats += '<b>Owca\'s Attitude:</b> ' + CoC.flags[ kFLAGS.OWCAS_ATTITUDE ] + '\n';
		}
		if( SceneLib.rubi.rubiAffection() > 0 ) {
			interpersonStats += '<b>Rubi\'s Affection:</b> ' + Math.round( SceneLib.rubi.rubiAffection() ) + '%\n' + '<b>Rubi\'s Orifice Capacity:</b> ' + Math.round( SceneLib.rubi.rubiCapacity() ) + '%\n';
		}
		if( CoC.flags[ kFLAGS.SHEILA_XP ] !== 0 ) {
			interpersonStats += '<b>Sheila\'s Corruption:</b> ' + SceneLib.sheilaScene.sheilaCorruption();
			if( SceneLib.sheilaScene.sheilaCorruption() > 100 ) {
				interpersonStats += ' (Yes, it can go above 100)';
			}
			interpersonStats += '\n';
		}
		if( CoC.flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ] !== 0 ) {
			if( SceneLib.urta.urtaLove() ) {
				interpersonStats += '<b>Urta Status:</b> Lover\n';
			} else if( CoC.flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ] === -1 ) {
				interpersonStats += '<b>Urta Status:</b> Ashamed\n';
			} else if( CoC.flags[ kFLAGS.URTA_PC_AFFECTION_COUNTER ] < 30 ) {
				interpersonStats += '<b>Urta\'s Affection:</b> ' + Math.round( CoC.flags[ kFLAGS.URTA_PC_AFFECTION_COUNTER ] * 3.3333 ) + '%\n';
			} else {
				interpersonStats += '<b>Urta Status:</b> Ready To Confess Love\n';
			}
		}
		if( interpersonStats !== '' ) {
			MainView.outputText( '\n<b><u>Interpersonal Stats</u></b>\n' + interpersonStats, false );
		}
		// End Interpersonal Stats
		// Begin Ongoing Stat Effects
		var statEffects = '';
		if( CoC.player.inHeat ) {
			statEffects += 'Heat - ' + Math.round( CoC.player.statusAffectv3( StatusAffects.Heat ) ) + ' hours remaining\n';
		}
		if( CoC.player.inRut ) {
			statEffects += 'Rut - ' + Math.round( CoC.player.statusAffectv3( StatusAffects.Rut ) ) + ' hours remaining\n';
		}
		if( CoC.player.statusAffectv1( StatusAffects.Luststick ) > 0 ) {
			statEffects += 'Luststick - ' + Math.round( CoC.player.statusAffectv1( StatusAffects.Luststick ) ) + ' hours remaining\n';
		}
		if( CoC.player.statusAffectv1( StatusAffects.BlackCatBeer ) > 0 ) {
			statEffects += 'Black Cat Beer - ' + CoC.player.statusAffectv1( StatusAffects.BlackCatBeer ) + ' hours remaining (Lust resistance 20% lower, physical resistance 25% higher.)\n';
		}
		if( statEffects !== '' ) {
			MainView.outputText( '\n<b><u>Ongoing Status Effects</u></b>\n' + statEffects, false );
		}
		// End Ongoing Stat Effects
		EngineCore.doNext( MainView, MainView.playerMenu );
	};
	EngineCore.lustPercent = function() {
		var lust = 100;
		//2.5% lust resistance per level - max 75.
		if( CoC.player.level < 21 ) {
			lust -= (CoC.player.level - 1) * 3;
		} else {
			lust = 40;
		}
		//++++++++++++++++++++++++++++++++++++++++++++++++++
		//ADDITIVE REDUCTIONS
		//THESE ARE FLAT BONUSES WITH LITTLE TO NO DOWNSIDE
		//TOTAL IS LIMITED TO 75%!
		//++++++++++++++++++++++++++++++++++++++++++++++++++
		//Corrupted Libido reduces lust gain by 10%!
		if( CoC.player.findPerk( PerkLib.CorruptedLibido ) >= 0 ) {
			lust -= 10;
		}
		//Acclimation reduces by 15%
		if( CoC.player.findPerk( PerkLib.Acclimation ) >= 0 ) {
			lust -= 15;
		}
		//Purity blessing reduces lust gain
		if( CoC.player.findPerk( PerkLib.PurityBlessing ) >= 0 ) {
			lust -= 5;
		}
		//Resistance = 10%
		if( CoC.player.findPerk( PerkLib.Resistance ) >= 0 ) {
			lust -= 10;
		}
		if( CoC.player.findPerk( PerkLib.ChiReflowLust ) >= 0 ) {
			lust -= SceneLib.umasShop.NEEDLEWORK_LUST_LUST_RESIST;
		}
		if( lust < 25 ) {
			lust = 25;
		}
		if( CoC.player.statusAffectv1( StatusAffects.BlackCatBeer ) > 0 ) {
			if( lust >= 80 ) {
				lust = 100;
			} else {
				lust += 20;
			}
		}
		lust += Math.round( CoC.player.perkv1( PerkLib.PentUp ) / 2 );
		//++++++++++++++++++++++++++++++++++++++++++++++++++
		//MULTIPLICATIVE REDUCTIONS
		//THESE PERKS ALSO RAISE MINIMUM LUST OR HAVE OTHER
		//DRAWBACKS TO JUSTIFY IT.
		//++++++++++++++++++++++++++++++++++++++++++++++++++
		//Bimbo body slows lust gains!
		if( (CoC.player.findStatusAffect( StatusAffects.BimboChampagne ) >= 0 || CoC.player.findPerk( PerkLib.BimboBody ) >= 0) && lust > 0 ) {
			lust *= 0.75;
		}
		if( CoC.player.findPerk( PerkLib.BroBody ) >= 0 && lust > 0 ) {
			lust *= 0.75;
		}
		if( CoC.player.findPerk( PerkLib.FutaForm ) >= 0 && lust > 0 ) {
			lust *= 0.75;
		}
		//Omnibus\' Gift reduces lust gain by 15%
		if( CoC.player.findPerk( PerkLib.OmnibusGift ) >= 0 ) {
			lust *= 0.85;
		}
		//Luststick reduces lust gain by 10% to match increased min lust
		if( CoC.player.findPerk( PerkLib.LuststickAdapted ) >= 0 ) {
			lust *= 0.9;
		}
		if( CoC.player.findStatusAffect( StatusAffects.Berzerking ) >= 0 ) {
			lust *= 0.6;
		}
		if( CoC.player.findPerk( PerkLib.PureAndLoving ) >= 0 ) {
			lust *= 0.95;
		}
		// Lust mods from Uma\'s content -- Given the short duration and the gem cost, I think them being multiplicative is justified.
		// Changing them to an additive bonus should be pretty simple (check the static values in UmasShop.as)
		var statIndex = CoC.player.findStatusAffect( StatusAffects.UmasMassage );
		if( statIndex >= 0 ) {
			if( CoC.player.statusAffect( statIndex ).value1 === SceneLib.umasShop.MASSAGE_RELIEF || CoC.player.statusAffect( statIndex ).value1 === SceneLib.umasShop.MASSAGE_LUST ) {
				lust *= CoC.player.statusAffect( statIndex ).value2;
			}
		}
		lust = Math.round( lust );
		return lust;
	};
	var applyOperator = function( old, op, val ) {
		switch( op ) {
			case '=':
				return val;
			case '+':
				return old + val;
			case '-':
				return old - val;
			case '*':
				return old * val;
			case '/':
				return old / val;
			default:
				$log.debug( 'applyOperator(' + old + ',\'' + op + '\',' + val + ') unknown op' );
				return old;
		}
	};
	/**
	 * Modify stats.
	 *
	 * Arguments should come in pairs nameOp:String, value:Number/Boolean <br/>
	 * where nameOp is ( stat_name + [operator] ) and value is operator argument<br/>
	 * valid operators are '=' (set), '+', '-', '*', '/', add is default.<br/>
	 * valid stat_names are 'str', 'tou', 'spe', 'int', 'lib', 'sen', 'lus', 'cor' or their full names; also 'resisted'/'res' (apply lust resistance, default true) and 'noBimbo'/'bim' (do not apply bimbo int gain reduction, default false)
	 */
	EngineCore.dynStats = function() {
		// Check num of args, we should have a multiple of 2
		var args = Array.from( arguments );
		if( (args.length % 2) !== 0 ) {
			$log.error( 'dynStats aborted. Keys->Arguments could not be matched' );
			return;
		}
		var argNamesFull = [ 'strength', 'toughness', 'speed', 'intellect', 'libido', 'sensitivity', 'lust', 'corruption', 'resisted', 'noBimbo' ]; // In case somebody uses full arg names etc
		var argNamesShort = [ 'str', 'tou', 'spe', 'int', 'lib', 'sen', 'lus', 'cor', 'res', 'bim' ]; // Arg names
		var argVals = [ 0, 0, 0, 0, 0, 0, 0, 0, true, false ]; // Default arg values
		var argOps = [ '+', '+', '+', '+', '+', '+', '+', '+', '=', '=' ];   // Default operators
		_.forEach(_.range(0, args.length - 1, 2), function(i) {
			if( _.isString(args[ i ]) ) {
				// Make sure the next arg has the POSSIBILITY of being correct
				if( !_.isNumber(args[ i + 1 ]) && !_.isBoolean(args[ i + 1 ]) ) {
					$log.error( 'dynStats aborted. Next argument after argName is invalid! arg is type ' + args[ i + 1 ] );
					return;
				}
				// Figure out which array to search
				if( args[ i ] === 'lust' ) {
					args[ i ] = 'lus';
				}
				if( args[ i ] === 'sens' ) {
					args[ i ] = 'sen';
				}
				var op = args[ i ].charAt( args[ i ].length - 1 );
				var stat = args[ i ].substr(0, args[ i ].length - 1);
				if(['+', '-', '*', '/', '='].indexOf(op) === -1) {
					stat = args[ i ];
					op = false;
				}
				var argIndex = argNamesShort.indexOf(stat);
				if(argIndex === -1) {
					argIndex = argNamesFull.indexOf(stat);
				}
				if(argIndex === -1) {
					$log.error( 'Couldn\'t find the arg name ' + args[ i ] + ' in the index arrays. Welp!' );
					return;
				}
				argVals[ argIndex ] = args[ i + 1 ];
				if(op) {
					argOps[ argIndex ] = op;
				}
			} else {
				throw 'dynStats aborted. Expected a key and got SHIT';
			}
		});
		// Got this far, we have values to statsify
		var newStr = applyOperator( CoC.player.str, argOps[ 0 ], argVals[ 0 ] );
		var newTou = applyOperator( CoC.player.tou, argOps[ 1 ], argVals[ 1 ] );
		var newSpe = applyOperator( CoC.player.spe, argOps[ 2 ], argVals[ 2 ] );
		var newInte = applyOperator( CoC.player.inte, argOps[ 3 ], argVals[ 3 ] );
		var newLib = applyOperator( CoC.player.lib, argOps[ 4 ], argVals[ 4 ] );
		var newSens = applyOperator( CoC.player.sens, argOps[ 5 ], argVals[ 5 ] );
		var newLust = applyOperator( CoC.player.lust, argOps[ 6 ], argVals[ 6 ] );
		var newCor = applyOperator( CoC.player.cor, argOps[ 7 ], argVals[ 7 ] );
		// Because lots of checks and mods are made in the stats(), calculate deltas and pass them. However, this means that the \'=\' operator could be resisted
		// In future (as I believe) EngineCore.stats() should be replaced with dynStats(), and checks and mods should be made here
		EngineCore.stats( newStr - CoC.player.str,
			newTou - CoC.player.tou,
			newSpe - CoC.player.spe,
			newInte - CoC.player.inte,
			newLib - CoC.player.lib,
			newSens - CoC.player.sens,
			newLust - CoC.player.lust,
			newCor - CoC.player.cor,
			argVals[ 8 ], argVals[ 9 ] );
	};
	EngineCore.stats = function( stre, toug, spee, intel, libi, sens, lust2, corr, resisted, noBimbo ) {
		if(resisted === undefined) {
			resisted = true;
		}
		//Easy mode cuts lust gains!
		if( CoC.flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] && lust2 > 0 && resisted ) {
			lust2 /= 2;
		}
		//Set original values to begin tracking for up/down values if
		//they aren\'t set yet.
		//These are reset when up/down arrows are hidden with
		//hideUpDown();
		//Just check str because they are either all 0 or real values
		if( CoC.oldStats.oldStr === 0 ) {
			CoC.oldStats.oldStr = CoC.player.str;
			CoC.oldStats.oldTou = CoC.player.tou;
			CoC.oldStats.oldSpe = CoC.player.spe;
			CoC.oldStats.oldInte = CoC.player.inte;
			CoC.oldStats.oldLib = CoC.player.lib;
			CoC.oldStats.oldSens = CoC.player.sens;
			CoC.oldStats.oldLust = CoC.player.lust;
			CoC.oldStats.oldCor = CoC.player.cor;
		}
		//MOD CHANGES FOR PERKS
		//Bimbos learn slower
		if( !noBimbo ) {
			if( CoC.player.findPerk( PerkLib.FutaFaculties ) >= 0 || CoC.player.findPerk( PerkLib.BimboBrains ) >= 0 || CoC.player.findPerk( PerkLib.BroBrains ) >= 0 ) {
				if( intel > 0 ) {
					intel /= 2;
				}
				if( intel < 0 ) {
					intel *= 2;
				}
			}
			if( CoC.player.findPerk( PerkLib.FutaForm ) >= 0 || CoC.player.findPerk( PerkLib.BimboBody ) >= 0 || CoC.player.findPerk( PerkLib.BroBody ) >= 0 ) {
				if( libi > 0 ) {
					libi *= 2;
				}
				if( libi < 0 ) {
					libi /= 2;
				}
			}
		}
		// Uma\'s Perkshit
		if( CoC.player.findPerk( PerkLib.ChiReflowSpeed ) >= 0 && spee < 0 ) {
			spee *= SceneLib.umasShop.NEEDLEWORK_SPEED_SPEED_MULTI;
		}
		if( CoC.player.findPerk( PerkLib.ChiReflowLust ) >= 0 && libi > 0 ) {
			libi *= SceneLib.umasShop.NEEDLEWORK_LUST_LIBSENSE_MULTI;
		}
		if( CoC.player.findPerk( PerkLib.ChiReflowLust ) >= 0 && sens > 0 ) {
			sens *= SceneLib.umasShop.NEEDLEWORK_LUST_LIBSENSE_MULTI;
		}
		//lust resistance
		if( lust2 > 0 && resisted ) {
			lust2 *= EngineCore.lustPercent() / 100;
		}
		if( libi > 0 && CoC.player.findPerk( PerkLib.PurityBlessing ) >= 0 ) {
			libi *= 0.75;
		}
		if( corr > 0 && CoC.player.findPerk( PerkLib.PurityBlessing ) >= 0 ) {
			corr *= 0.5;
		}
		if( corr > 0 && CoC.player.findPerk( PerkLib.PureAndLoving ) >= 0 ) {
			corr *= 0.75;
		}
		//Change original stats
		CoC.player.str += stre;
		CoC.player.tou += toug;
		CoC.player.spe += spee;
		CoC.player.inte += intel;
		CoC.player.lib += libi;
		if( CoC.player.sens > 50 && sens > 0 ) {
			sens /= 2;
		}
		if( CoC.player.sens > 75 && sens > 0 ) {
			sens /= 2;
		}
		if( CoC.player.sens > 90 && sens > 0 ) {
			sens /= 2;
		}
		if( CoC.player.sens > 50 && sens < 0 ) {
			sens *= 2;
		}
		if( CoC.player.sens > 75 && sens < 0 ) {
			sens *= 2;
		}
		if( CoC.player.sens > 90 && sens < 0 ) {
			sens *= 2;
		}
		CoC.player.sens += sens;
		CoC.player.lust += lust2;
		CoC.player.cor += corr;
		//Bonus gain for perks!
		if( CoC.player.findPerk( PerkLib.Strong ) >= 0 && stre >= 0 ) {
			CoC.player.str += stre * CoC.player.perk( CoC.player.findPerk( PerkLib.Strong ) ).value1;
		}
		if( CoC.player.findPerk( PerkLib.Tough ) >= 0 && toug >= 0 ) {
			CoC.player.tou += toug * CoC.player.perk( CoC.player.findPerk( PerkLib.Tough ) ).value1;
		}
		if( CoC.player.findPerk( PerkLib.Fast ) >= 0 && spee >= 0 ) {
			CoC.player.spe += spee * CoC.player.perk( CoC.player.findPerk( PerkLib.Fast ) ).value1;
		}
		if( CoC.player.findPerk( PerkLib.Smart ) >= 0 && intel >= 0 ) {
			CoC.player.inte += intel * CoC.player.perk( CoC.player.findPerk( PerkLib.Smart ) ).value1;
		}
		if( CoC.player.findPerk( PerkLib.Lusty ) >= 0 && libi >= 0 ) {
			CoC.player.lib += libi * CoC.player.perk( CoC.player.findPerk( PerkLib.Lusty ) ).value1;
		}
		if( CoC.player.findPerk( PerkLib.Sensitive ) >= 0 && sens >= 0 ) {
			CoC.player.sens += sens * CoC.player.perk( CoC.player.findPerk( PerkLib.Sensitive ) ).value1;
		}
		// Uma\'s Str Cap from Perks
		if( CoC.player.findPerk( PerkLib.ChiReflowSpeed ) >= 0 ) {
			if( CoC.player.str > SceneLib.umasShop.NEEDLEWORK_SPEED_STRENGTH_CAP ) {
				CoC.player.str = SceneLib.umasShop.NEEDLEWORK_SPEED_STRENGTH_CAP;
			}
		}
		if( CoC.player.findPerk( PerkLib.ChiReflowDefense ) >= 0 ) {
			if( CoC.player.spe > SceneLib.umasShop.NEEDLEWORK_DEFENSE_SPEED_CAP ) {
				CoC.player.spe = SceneLib.umasShop.NEEDLEWORK_DEFENSE_SPEED_CAP;
			}
		}
		//Keep EngineCore.stats in bounds
		if( CoC.player.cor < 0 ) {
			CoC.player.cor = 0;
		}
		if( CoC.player.cor > 100 ) {
			CoC.player.cor = 100;
		}
		if( CoC.player.str > 100 ) {
			CoC.player.str = 100;
		}
		if( CoC.player.str < 1 ) {
			CoC.player.str = 1;
		}
		if( CoC.player.tou > 100 ) {
			CoC.player.tou = 100;
		}
		if( CoC.player.tou < 1 ) {
			CoC.player.tou = 1;
		}
		if( CoC.player.spe > 100 ) {
			CoC.player.spe = 100;
		}
		if( CoC.player.spe < 1 ) {
			CoC.player.spe = 1;
		}
		if( CoC.player.inte > 100 ) {
			CoC.player.inte = 100;
		}
		if( CoC.player.inte < 1 ) {
			CoC.player.inte = 1;
		}
		if( CoC.player.lib > 100 ) {
			CoC.player.lib = 100;
		}
		//Minimum libido = 15.
		if( CoC.player.lib < 50 && CoC.player.armorName === 'lusty maiden\'s armor' ) {
			CoC.player.lib = 50;
		} else if( CoC.player.lib < 15 && CoC.player.gender > 0 ) {
			CoC.player.lib = 15;
		} else if( CoC.player.lib < 10 && CoC.player.gender === 0 ) {
			CoC.player.lib = 10;
		}
		if( CoC.player.lib < CoC.player.minLust() * 2 / 3 ) {
			CoC.player.lib = CoC.player.minLust() * 2 / 3;
		}
		//Minimum sensitivity.
		if( CoC.player.sens > 100 ) {
			CoC.player.sens = 100;
		}
		if( CoC.player.sens < 10 ) {
			CoC.player.sens = 10;
		}
		//Add HP for toughness change.
		EngineCore.HPChange( toug * 2, false );
		//Reduce hp if over max
		if( CoC.player.HP > CoC.player.maxHP() ) {
			CoC.player.HP = CoC.player.maxHP();
		}
		//Combat bounds
		if( CoC.player.lust > 99 ) {
			CoC.player.lust = 100;
		}
		//Update to minimum lust if lust falls below it.
		if( CoC.player.lust < CoC.player.minLust() ) {
			CoC.player.lust = CoC.player.minLust();
		}
		//worms raise min lust!
		if( CoC.player.findStatusAffect( StatusAffects.Infested ) >= 0 ) {
			if( CoC.player.lust < 50 ) {
				CoC.player.lust = 50;
			}
		}
		if( CoC.player.lust > 100 ) {
			CoC.player.lust = 100;
		}
		if( CoC.player.lust < 0 ) {
			CoC.player.lust = 0;
		}
		//Refresh the stat pane with updated values
		MainView.statsView.showUpDown();
		MainView.statsView.show();
	};
	MainView.setMenuButton( MainView.MENU_STATS, 'Stats', null, EngineCore.displayStats );
	return EngineCore;
});
