'use strict';

angular.module( 'cocjs' ).factory( 'EngineCore', function( SceneLib, $log, CoC, kFLAGS, MainView, PerkLib, ItemType, StatusAffects, CoC_Settings, ArmorLib ) {
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
			if( CoC.player.findPerk( PerkLib.HistoryHealer ) ) {
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
		return buttonText;
	};
	// returns a function that takes no arguments, and executes function `func` with argument `arg`
	EngineCore.createCallBackFunction = function( object, func ) {
		var args = _.drop(_.drop(Array.from( arguments )));
		if( !_.isFunction( func ) ) {
			CoC_Settings.error( 'createCallBackFunction(' + func + ', ' + args + ')' );
			return null;
		}
		return function() {
			return func.apply( object, args );
		};
	};
	EngineCore.addButton = function( pos, text, obj, func1, arg1 ) {
		EngineCore.addButtonWithTooltip(pos, text, getButtonToolTipText(text), obj, func1, arg1);
	};
	EngineCore.addButtonWithTooltip = function( pos, text, toolTipText, obj, func1, arg1 ) {
		if( !text ) {
			text = '';
		}
		if( !arg1 ) {
			arg1 = -9000;
		}
		if( !_.isFunction( func1 ) ) {
			CoC_Settings.error( 'no function passed to EngineCore.addButtonWithTooltip' );
			return;
		}
		var callback = EngineCore.createCallBackFunction( obj, func1, arg1 );
		MainView.showBottomButton( pos, text, callback, toolTipText );
	};
	EngineCore.choices = function() { //New typesafe version
		var args = Array.from( arguments );
		if(args.length % 3 !== 0) {
			$log.error('Bad arguments number.');
			return;
		}
		MainView.menu();
		_.forEach(_.range(0, args.length - 1, 3), function(choice, index) {
			EngineCore.addButton( index, args[choice], args[choice + 1], args[choice + 2] );
		});
	};
	EngineCore.choicesWithTooltip = function() { //New typesafe version
		var args = Array.from( arguments );
		if(args.length % 4 !== 0) {
			$log.error('Bad arguments number.');
			return;
		}
		MainView.menu();
		_.forEach(_.range(0, args.length - 1, 4), function(choice, index) {
			EngineCore.addButtonWithTooltip( index, args[choice], args[choice + 1], args[choice + 2], args[choice + 3] );
		});
	};
	EngineCore.doYesNo = function( objYes, eventYes, objNo, eventNo ) {
		if(!_.isFunction( eventYes ) || !_.isFunction( eventNo ) ) {
			$log.error('EngineCore.doYesNo called with bad arguments', eventYes, eventNo);
			return;
		}
		EngineCore.choices('Yes', objYes, eventYes, 'No', objNo, eventNo);
	};
	EngineCore.doNext = function( obj, event ) {
		//Prevent new events in combat from automatically overwriting a game over.
		if( MainView.getButtonText( 0 ).indexOf( 'Game Over' ) !== -1 ) {
			$log.debug( 'Do next setup cancelled by game over' );
			return;
		}
		if(!_.isFunction( event ) ) {
			$log.error('EngineCore.doNext called with bad arguments', event);
			return;
		}
		EngineCore.choices('Next', obj, event);
	};
	//Hide the up/down indicators
	EngineCore.hideUpDown = function() {
		MainView.statsView.hideUpDown();
		//Clear storage values so up/down arrows can be properly displayed
		/* jshint unused:true */
		_.forOwn(CoC.oldStats, function(value, key) {
			CoC.oldStats[key] = CoC.player[key];
		});
	};
	EngineCore.physicalCost = function( mod ) {
		var costPercent = 100;
		if( CoC.player.findPerk( PerkLib.IronMan ) ) {
			costPercent -= 50;
		}
		mod *= costPercent / 100;
		return mod;
	};
	EngineCore.spellCost = function( mod ) {
		//Addiditive mods
		var costPercent = 100;
		if( CoC.player.findPerk( PerkLib.SpellcastingAffinity ) ) {
			costPercent -= CoC.player.perkv1( PerkLib.SpellcastingAffinity );
		}
		if( CoC.player.findPerk( PerkLib.WizardsEndurance ) ) {
			costPercent -= CoC.player.perkv1( PerkLib.WizardsEndurance );
		}
		//Limiting it and multiplicative mods
		if( CoC.player.findPerk( PerkLib.BloodMage ) && costPercent < 50 ) {
			costPercent = 50;
		}
		mod *= costPercent / 100;
		if( CoC.player.findPerk( PerkLib.HistoryScholar ) && mod > 2) {
			mod *= 0.8;
		}
		if( CoC.player.findPerk( PerkLib.BloodMage ) && mod < 5 ) {
			mod = 5;
		} else if( mod < 2 ) {
			mod = 2;
		}
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
			if( CoC.player.findPerk( PerkLib.BloodMage ) ) {
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
			if( CoC.player.findPerk( PerkLib.HistorySlacker ) ) {
				multi += 0.2;
			}
			if( CoC.player.findPerk( PerkLib.ControlledBreath ) && CoC.player.cor < 30 ) {
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
	EngineCore.lustPercent = function() {
		//3% lust resistance per level - max 60.
		var lust = 100 - Math.min(60, (CoC.player.level - 1) * 3);
		//++++++++++++++++++++++++++++++++++++++++++++++++++
		//ADDITIVE REDUCTIONS
		//THESE ARE FLAT BONUSES WITH LITTLE TO NO DOWNSIDE
		//TOTAL IS LIMITED TO 75%!
		//++++++++++++++++++++++++++++++++++++++++++++++++++
		//Corrupted Libido reduces lust gain by 10%!
		if( CoC.player.findPerk( PerkLib.CorruptedLibido ) ) {
			lust -= 10;
		}
		//Acclimation reduces by 15%
		if( CoC.player.findPerk( PerkLib.Acclimation ) ) {
			lust -= 15;
		}
		//Purity blessing reduces lust gain
		if( CoC.player.findPerk( PerkLib.PurityBlessing ) ) {
			lust -= 5;
		}
		//Resistance = 10%
		if( CoC.player.findPerk( PerkLib.Resistance ) ) {
			lust -= 10;
		}
		if( CoC.player.findPerk( PerkLib.ChiReflowLust ) ) {
			lust -= SceneLib.umasShop.NEEDLEWORK_LUST_LUST_RESIST;
		}
		if( lust < 25 ) {
			lust = 25;
		}
		if( CoC.player.statusAffectv1( StatusAffects.BlackCatBeer ) > 0 ) {
			lust = Math.min(100, lust + 20);
		}
		lust += Math.round( CoC.player.perkv1( PerkLib.PentUp ) / 2 );
		//++++++++++++++++++++++++++++++++++++++++++++++++++
		//MULTIPLICATIVE REDUCTIONS
		//THESE PERKS ALSO RAISE MINIMUM LUST OR HAVE OTHER
		//DRAWBACKS TO JUSTIFY IT.
		//++++++++++++++++++++++++++++++++++++++++++++++++++
		//Bimbo body slows lust gains!
		if( (CoC.player.findStatusAffect( StatusAffects.BimboChampagne ) || CoC.player.findPerk( PerkLib.BimboBody )) && lust > 0 ) {
			lust *= 0.75;
		}
		if( CoC.player.findPerk( PerkLib.BroBody ) && lust > 0 ) {
			lust *= 0.75;
		}
		if( CoC.player.findPerk( PerkLib.FutaForm ) && lust > 0 ) {
			lust *= 0.75;
		}
		//Omnibus\' Gift reduces lust gain by 15%
		if( CoC.player.findPerk( PerkLib.OmnibusGift ) ) {
			lust *= 0.85;
		}
		//Luststick reduces lust gain by 10% to match increased min lust
		if( CoC.player.findPerk( PerkLib.LuststickAdapted ) ) {
			lust *= 0.9;
		}
		if( CoC.player.findStatusAffect( StatusAffects.Berzerking ) ) {
			lust *= 0.6;
		}
		if( CoC.player.findPerk( PerkLib.PureAndLoving ) ) {
			lust *= 0.95;
		}
		// Lust mods from Uma\'s content -- Given the short duration and the gem cost, I think them being multiplicative is justified.
		// Changing them to an additive bonus should be pretty simple (check the static values in UmasShop.as)
		var stat = CoC.player.findStatusAffect( StatusAffects.UmasMassage );
		if( stat ) {
			if( stat.value1 === SceneLib.umasShop.MASSAGE_RELIEF || stat.value1 === SceneLib.umasShop.MASSAGE_LUST ) {
				lust *= stat.value2;
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
		var abort = false;
		_.forEach(_.range(0, args.length - 1, 2), function(i) {
			if( _.isString(args[ i ]) ) {
				// Make sure the next arg has the POSSIBILITY of being correct
				if( !_.isNumber(args[ i + 1 ]) && !_.isBoolean(args[ i + 1 ]) ) {
					$log.error( 'dynStats aborted. Next argument after argName is invalid! arg is type ' + args[ i + 1 ] );
					abort = true;
					return false;
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
					abort = true;
					return false;
				}
				argVals[ argIndex ] = args[ i + 1 ];
				if(op) {
					argOps[ argIndex ] = op;
				}
			} else {
				$log.error('dynStats aborted. Expected a key and got SHIT');
				abort = true;
				return false;
			}
		});
		if(abort) {
			return;
		}
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
	EngineCore._addStr = function(str) {
		CoC.oldStats.str = CoC.player.str;
		CoC.player.str += str;
		if( CoC.player.findPerk( PerkLib.Strong ) && str >= 0 ) {
			CoC.player.str += str * CoC.player.findPerk( PerkLib.Strong ).value1;
		}
		if( CoC.player.findPerk( PerkLib.ChiReflowSpeed ) ) {
			if( CoC.player.str > SceneLib.umasShop.NEEDLEWORK_SPEED_STRENGTH_CAP ) {
				CoC.player.str = SceneLib.umasShop.NEEDLEWORK_SPEED_STRENGTH_CAP;
			}
		}
		if( CoC.player.str > 100 ) {
			CoC.player.str = 100;
		}
		if( CoC.player.str < 1 ) {
			CoC.player.str = 1;
		}
	};
	EngineCore._addTou = function(tou) {
		CoC.oldStats.tou = CoC.player.tou;
		CoC.player.tou += tou;
		if( CoC.player.findPerk( PerkLib.Tough ) && tou >= 0 ) {
			CoC.player.tou += tou * CoC.player.findPerk( PerkLib.Tough ).value1;
		}
		if( CoC.player.tou > 100 ) {
			CoC.player.tou = 100;
		}
		if( CoC.player.tou < 1 ) {
			CoC.player.tou = 1;
		}
		//Add HP for toughness change.
		EngineCore.HPChange( (CoC.player.tou - CoC.oldStats.tou) * 2, false );
	};
	EngineCore._addSpe = function(spe) {
		CoC.oldStats.spe = CoC.player.spe;
		if( CoC.player.findPerk( PerkLib.ChiReflowSpeed ) && spe < 0 ) {
			spe *= SceneLib.umasShop.NEEDLEWORK_SPEED_SPEED_MULTI;
		}
		CoC.player.spe += spe;
		if( CoC.player.findPerk( PerkLib.Fast ) && spe >= 0 ) {
			CoC.player.spe += spe * CoC.player.findPerk( PerkLib.Fast ).value1;
		}
		if( CoC.player.findPerk( PerkLib.ChiReflowDefense ) ) {
			if( CoC.player.spe > SceneLib.umasShop.NEEDLEWORK_DEFENSE_SPEED_CAP ) {
				CoC.player.spe = SceneLib.umasShop.NEEDLEWORK_DEFENSE_SPEED_CAP;
			}
		}
		if( CoC.player.spe > 100 ) {
			CoC.player.spe = 100;
		}
		if( CoC.player.spe < 1 ) {
			CoC.player.spe = 1;
		}
	};
	EngineCore._addIntel = function(intel, noBimbo) {
		CoC.oldStats.inte = CoC.player.inte;
		if( !noBimbo ) {
			if( CoC.player.findPerk( PerkLib.FutaFaculties ) || CoC.player.findPerk( PerkLib.BimboBrains ) || CoC.player.findPerk( PerkLib.BroBrains ) ) {
				if( intel > 0 ) {
					intel /= 2;
				}
				if( intel < 0 ) {
					intel *= 2;
				}
			}
		}
		CoC.player.inte += intel;
		if( CoC.player.findPerk( PerkLib.Smart ) && intel >= 0 ) {
			CoC.player.inte += intel * CoC.player.findPerk( PerkLib.Smart ).value1;
		}
		if( CoC.player.inte > 100 ) {
			CoC.player.inte = 100;
		}
		if( CoC.player.inte < 1 ) {
			CoC.player.inte = 1;
		}
	};
	EngineCore._addLib = function(lib, noBimbo) {
		CoC.oldStats.lib = CoC.player.lib;
		if( !noBimbo ) {
			if( CoC.player.findPerk( PerkLib.FutaForm ) || CoC.player.findPerk( PerkLib.BimboBody ) || CoC.player.findPerk( PerkLib.BroBody ) ) {
				if( lib > 0 ) {
					lib *= 2;
				}
				if( lib < 0 ) {
					lib /= 2;
				}
			}
		}
		if( CoC.player.findPerk( PerkLib.ChiReflowLust ) && lib > 0 ) {
			lib *= SceneLib.umasShop.NEEDLEWORK_LUST_LIBSENSE_MULTI;
		}
		if( lib > 0 && CoC.player.findPerk( PerkLib.PurityBlessing ) ) {
			lib *= 0.75;
		}
		CoC.player.lib += lib;
		if( CoC.player.findPerk( PerkLib.Lusty ) && lib > 0 ) {
			CoC.player.lib += lib * CoC.player.findPerk( PerkLib.Lusty ).value1;
		}
		if( CoC.player.lib > 100 ) {
			CoC.player.lib = 100;
		}
		if( CoC.player.lib < 50 && CoC.player.armor === ArmorLib.LMARMOR ) {
			CoC.player.lib = 50;
		} else if( CoC.player.lib < 15 && CoC.player.gender > 0 ) {
			CoC.player.lib = 15;
		} else if( CoC.player.lib < 10 && CoC.player.gender === 0 ) {
			CoC.player.lib = 10;
		}
		if( CoC.player.lib < CoC.player.minLust() * 2 / 3 ) {
			CoC.player.lib = CoC.player.minLust() * 2 / 3;
		}
	};
	EngineCore._addSens = function(sens) {
		CoC.oldStats.sens = CoC.player.sens;
		if( CoC.player.findPerk( PerkLib.ChiReflowLust ) && sens > 0 ) {
			sens *= SceneLib.umasShop.NEEDLEWORK_LUST_LIBSENSE_MULTI;
		}
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
		if( CoC.player.findPerk( PerkLib.Sensitive ) && sens >= 0 ) {
			CoC.player.sens += sens * CoC.player.findPerk( PerkLib.Sensitive ).value1;
		}
		//Minimum sensitivity.
		if( CoC.player.sens > 100 ) {
			CoC.player.sens = 100;
		}
		if( CoC.player.sens < 10 ) {
			CoC.player.sens = 10;
		}
	};
	EngineCore._addLust = function(lust, resisted) {
		CoC.oldStats.lust = CoC.player.lust;
		if(resisted === undefined) {
			resisted = true;
		}
		if( CoC.flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] && lust > 0 && resisted ) {
			lust /= 2;
		}
		if( lust > 0 && resisted ) {
			lust *= EngineCore.lustPercent() / 100;
		}
		CoC.player.lust += lust;
		
		//Update to minimum lust if lust falls below it.
		//worms raise min lust!
		if( CoC.player.findStatusAffect( StatusAffects.Infested ) && CoC.player.lust < 50 ) {
			CoC.player.lust = 50;
		}
		if( CoC.player.lust > 100 ) {
			CoC.player.lust = 100;
		}
		if( CoC.player.lust < CoC.player.minLust() ) {
			CoC.player.lust = CoC.player.minLust();
		}
	};
	EngineCore._addCor = function(cor) {
		CoC.oldStats.cor = CoC.player.cor;
		if( cor > 0 && CoC.player.findPerk( PerkLib.PurityBlessing ) ) {
			cor *= 0.5;
		}
		if( cor > 0 && CoC.player.findPerk( PerkLib.PureAndLoving ) ) {
			cor *= 0.75;
		}
		CoC.player.cor += cor;
		if( CoC.player.cor < 0 ) {
			CoC.player.cor = 0;
		}
		if( CoC.player.cor > 100 ) {
			CoC.player.cor = 100;
		}
	};
	EngineCore.stats = function( stre, toug, spee, intel, libi, sens, lust2, corr, resisted, noBimbo ) {
		//Easy mode cuts lust gains!
		//Set original values to begin tracking for up/down values if
		//they aren\'t set yet.
		//These are reset when up/down arrows are hidden with
		//hideUpDown();
		//Just check str because they are either all 0 or real values
		EngineCore._addStr( stre );
		EngineCore._addTou( toug );
		EngineCore._addSpe( spee );
		EngineCore._addIntel( intel, noBimbo );
		EngineCore._addLib( libi, noBimbo );
		EngineCore._addSens( sens );
		EngineCore._addLust( lust2, resisted);
		EngineCore._addLust( corr );
		
		//Refresh the stat pane with updated values
		MainView.statsView.showUpDown();
		MainView.statsView.show();
	};
	return EngineCore;
});
