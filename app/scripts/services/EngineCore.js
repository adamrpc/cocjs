'use strict';

angular.module( 'cocjs' ).factory( 'EngineCore', function( SceneLib, $log, CoC, kFLAGS, MainView, Perk, PerkLib, ItemType, Utils, StatusAffects, CoC_Settings, Descriptors, AppearanceDefs ) {
	var EngineCore = {};
	EngineCore.silly = function() {
		return CoC.flags[ kFLAGS.SILLY_MODE_ENABLE_FLAG ] === 1;
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
						EngineCore.outputText( 'You\'re as healthy as you can be.\n', false );
					}
					return;
				}
				if( display ) {
					EngineCore.outputText( 'Your HP maxes out at ' + CoC.player.maxHP() + '.\n', false );
				}
				CoC.player.HP = CoC.player.maxHP();
			} else {
				if( display ) {
					EngineCore.outputText( 'You gain ' + changeNum + ' HP.\n', false );
				}
				CoC.player.HP += changeNum;
				MainView.statsView.showStatUp( 'hp' );
			}
		} else { //Negative HP
			if( CoC.player.HP + changeNum <= 0 ) {
				if( display ) {
					EngineCore.outputText( 'You take ' + (-changeNum) + ' damage, dropping your HP to 0.\n', false );
				}
				CoC.player.HP = 0;
			} else {
				if( display ) {
					EngineCore.outputText( 'You take ' + (-changeNum) + ' damage.\n', false );
				}
				CoC.player.HP += changeNum;
			}
		}
		EngineCore.statScreenRefresh();
	};
	EngineCore.clone = angular.copy;
	EngineCore.clearOutput = function() {
		MainView.clearOutput();
	};
	EngineCore.rawOutputText = function( output, purgeText ) {
		//OUTPUT!
		if( purgeText ) {
			EngineCore.clearOutput();
			MainView.setOutputText( output );
		} else {
			MainView.appendOutputText( output );
		}
	};
	EngineCore.outputText = function( output, purgeText, parseAsMarkdown ) {
		MainView.outputText( output, purgeText, parseAsMarkdown );
	};
	EngineCore.flushOutputTextToGUI = function() {
		MainView.fontSize = CoC.flags[ kFLAGS.CUSTOM_FONT_SIZE ];
		MainView.setOutputText( MainView.mainText );
	};
	EngineCore.displayPerks = function() {
		EngineCore.outputText( '', true );
		_.forEach(CoC.player.perks, function(perk) {
			EngineCore.outputText( '<b>' + perk.perkName + '</b> - ' + perk.perkDesc + '\n', false );
		});
		EngineCore.menu();
		if( CoC.player.perkPoints > 0 ) {
			EngineCore.outputText( '\n<b>You have ' + Utils.num2Text( CoC.player.perkPoints ) + ' perk point', false );
			if( CoC.player.perkPoints > 1 ) {
				EngineCore.outputText( 's', false );
			}
			EngineCore.outputText( ' to spend.</b>', false );
			EngineCore.addButton( 1, 'Perk Up', null, EngineCore.perkBuyMenu );
		}
		if( CoC.player.findPerk( PerkLib.DoubleAttack ) >= 0 ) {
			EngineCore.outputText( '\n<b>You can adjust your double attack settings.</b>' );
			EngineCore.addButton( 2, 'Dbl Options', null, EngineCore.doubleAttackOptions );
		}
		EngineCore.addButton( 0, 'Next', null, MainView.playerMenu );
	};
	EngineCore.doubleAttackOptions = function() {
		EngineCore.clearOutput();
		EngineCore.menu();
		if( CoC.flags[ kFLAGS.DOUBLE_ATTACK_STYLE ] === 0 ) {
			EngineCore.outputText( 'You will currently always double attack in combat.  If your strength exceeds sixty, your double-attacks will be done at sixty strength in order to double-attack.' );
			EngineCore.outputText( '\n\nYou can change it to double attack until sixty strength and then dynamicly switch to single attacks.' );
			EngineCore.outputText( '\nYou can change it to always single attack.' );
			EngineCore.addButton( 1, 'Dynamic', null, EngineCore.doubleAttackDynamic );
			EngineCore.addButton( 2, 'Single', null, EngineCore.doubleAttackOff );
		} else if( CoC.flags[ kFLAGS.DOUBLE_ATTACK_STYLE ] === 1 ) {
			EngineCore.outputText( 'You will currently double attack until your strength exceeds sixty, and then single attack.' );
			EngineCore.outputText( '\n\nYou can choose to force double attacks at reduced strength (when over sixty, it makes attacks at a strength of sixty.' );
			EngineCore.outputText( '\nYou can change it to always single attack.' );
			EngineCore.addButton( 0, 'All Double', null, EngineCore.doubleAttackForce );
			EngineCore.addButton( 2, 'Single', null, EngineCore.doubleAttackOff );
		} else {
			EngineCore.outputText( 'You will always single attack your foes in combat.' );
			EngineCore.outputText( '\n\nYou can choose to force double attacks at reduced strength (when over sixty, it makes attacks at a strength of sixty.' );
			EngineCore.outputText( '\nYou can change it to double attack until sixty strength and then switch to single attacks.' );
			EngineCore.addButton( 0, 'All Double', null, EngineCore.doubleAttackForce );
			EngineCore.addButton( 1, 'Dynamic', null, EngineCore.doubleAttackDynamic );
		}
		EngineCore.addButton( 4, 'Back', null, EngineCore.displayPerks );
	};
	EngineCore.doubleAttackForce = function() {
		CoC.flags[ kFLAGS.DOUBLE_ATTACK_STYLE ] = 0;
		EngineCore.doubleAttackOptions();
	};
	EngineCore.doubleAttackDynamic = function() {
		CoC.flags[ kFLAGS.DOUBLE_ATTACK_STYLE ] = 1;
		EngineCore.doubleAttackOptions();
	};
	EngineCore.doubleAttackOff = function() {
		CoC.flags[ kFLAGS.DOUBLE_ATTACK_STYLE ] = 2;
		EngineCore.doubleAttackOptions();
	};
	EngineCore.levelUpGo = function() {
		EngineCore.clearOutput();
		EngineCore.hideMenus();
		MainView.hideMenuButton( MainView.MENU_NEW_MAIN );
		//Level up
		if( CoC.player.XP >= (CoC.player.level) * 100 ) {
			CoC.player.level++;
			CoC.player.perkPoints++;
			EngineCore.outputText( '<b>You are now level ' + CoC.player.level + '!</b>\n\nYou may now apply +5 to one attribute.  Which will you choose?' );
			CoC.player.XP -= (CoC.player.level - 1) * 100;
			EngineCore.menu();
			EngineCore.addButton( 0, 'Strength', null, EngineCore.levelUpStatStrength );
			EngineCore.addButton( 1, 'Toughness', null, EngineCore.levelUpStatToughness );
			EngineCore.addButton( 2, 'Speed', null, EngineCore.levelUpStatSpeed );
			EngineCore.addButton( 3, 'Intelligence', null, EngineCore.levelUpStatIntelligence );
		} else if( CoC.player.perkPoints > 0 ) { //Spend perk points
			EngineCore.perkBuyMenu();
		} else {
			EngineCore.outputText( '<b>ERROR.  LEVEL UP PUSHED WHEN PC CANNOT LEVEL OR GAIN PERKS.  PLEASE REPORT THE STEPS TO REPRODUCE THIS BUG TO FENOXO@GMAIL.COM OR THE FENOXO.COM BUG REPORT FORUM.</b>' );
			EngineCore.doNext( MainView, MainView.playerMenu );
		}
	};
	EngineCore.levelUpStatStrength = function() {
		EngineCore.dynStats( 'str', 5 ); //Gain +5 Str due to level
		EngineCore.clearOutput();
		EngineCore.outputText( 'Your muscles feel significantly stronger from your time adventuring.' );
		EngineCore.doNext( null, EngineCore.perkBuyMenu );
	};
	EngineCore.levelUpStatToughness = function() {
		EngineCore.dynStats( 'tou', 5 ); //Gain +5 Toughness due to level
		$log.trace( 'HP: ' + CoC.player.HP + ' MAX HP: ' + CoC.player.maxHP() );
		EngineCore.statScreenRefresh();
		EngineCore.clearOutput();
		EngineCore.outputText( 'You feel tougher from all the fights you have endured.' );
		EngineCore.doNext( null, EngineCore.perkBuyMenu );
	};
	EngineCore.levelUpStatSpeed = function() {
		EngineCore.dynStats( 'spe', 5 ); //Gain +5 speed due to level
		EngineCore.clearOutput();
		EngineCore.outputText( 'Your time in combat has driven you to move faster.' );
		EngineCore.doNext( null, EngineCore.perkBuyMenu );
	};
	EngineCore.levelUpStatIntelligence = function() {
		EngineCore.dynStats( 'int', 5 ); //Gain +5 Intelligence due to level
		EngineCore.clearOutput();
		EngineCore.outputText( 'Your time spent fighting the creatures of this realm has sharpened your wit.' );
		EngineCore.doNext( null, EngineCore.perkBuyMenu );
	};
	EngineCore.perkBuyMenu = function() {
		EngineCore.clearOutput();
		var perkList = EngineCore.buildPerkList();
		if( perkList.length === 0 ) {
			EngineCore.outputText( '<b>You do not qualify for any perks at present.  </b>In case you qualify for any in the future, you will keep your ' + Utils.num2Text( CoC.player.perkPoints ) + ' perk point' );
			if( CoC.player.perkPoints > 1 ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( '.' );
			EngineCore.doNext( MainView, MainView.playerMenu );
			return;
		}
		EngineCore.outputText( 'Please select a perk from the drop-down list, then click \'Okay\'.  You can press \'Skip\' to save your perk point for later.\n\n' );
		MainView.aCb.visible = true;
		MainView.hideMenuButton( MainView.MENU_NEW_MAIN );
		EngineCore.menu();
		EngineCore.addButton( 1, 'Skip', null, EngineCore.perkSkip );
	};
	EngineCore.perkSelect = function( selected ) {
		if( MainView.aCb.visible ) {
			MainView.aCb.visible = false;
			EngineCore.applyPerk( selected );
		}
	};
	EngineCore.perkSkip = function() {
		if( MainView.aCb.visible ) {
			MainView.aCb.visible = false;
			MainView.playerMenu();
		}
	};
	EngineCore.changeHandler = function( selected ) {
		if( selected === null ) {
			return;
		}
		//Store perk name for later addition
		EngineCore.clearOutput();
		EngineCore.outputText( 'You have selected the following perk:\n\n' );
		EngineCore.outputText( '<b>' + selected.perkName + ':</b> ' + selected.perkLongDesc + '\n\nIf you would like to select this perk, click <b>Okay</b>.  Otherwise, select a new perk, or press <b>Skip</b> to make a decision later.' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Okay', null, EngineCore.perkSelect, selected );
		EngineCore.addButton( 1, 'Skip', null, EngineCore.perkSkip );
	};
	EngineCore.buildPerkList = function() {
		var perkList = [];
		function _add( p ) {
			perkList.push( { label: p.perkName, perk: p } );
		}
		//STRENGTH PERKS
		if( CoC.player.str >= 25 ) {
			_add( new Perk( PerkLib.StrongBack ) );
		}
		if( CoC.player.findPerk( PerkLib.StrongBack ) >= 0 && CoC.player.str >= 50 ) {
			_add( new Perk( PerkLib.StrongBack2 ) );
		}
		//Tier 1 Strength Perks
		if( CoC.player.level >= 6 ) {
			//Thunderous Strikes - +20% basic attack damage while str > 80.
			if( CoC.player.str >= 80 ) {
				_add( new Perk( PerkLib.ThunderousStrikes ) );
			}
			//Weapon Mastery - Doubles weapon damage bonus of \'large\' type weapons. (Minotaur Axe, M. Hammer, etc)
			if( CoC.player.str > 60 ) {
				_add( new Perk( PerkLib.WeaponMastery ) );
			}
			if( CoC.player.str >= 75 ) {
				_add( new Perk( PerkLib.BrutalBlows ) );
			}
		}
		//Tier 2 Strength Perks
		if( CoC.player.level >= 12 ) {
			if( CoC.player.str >= 75 ) {
				_add( new Perk( PerkLib.Berzerker ) );
			}
		}
		//slot 2 - toughness perk 1
		if( CoC.player.findPerk( PerkLib.Tank ) < 0 && CoC.player.tou >= 25 ) {
			_add( new Perk( PerkLib.Tank ) );
		}
		//slot 2 - regeneration perk
		if( CoC.player.findPerk( PerkLib.Tank ) >= 0 && CoC.player.tou >= 50 ) {
			_add( new Perk( PerkLib.Regeneration ) );
		}
		//Tier 1 Toughness Perks
		if( CoC.player.level >= 6 ) {
			if( CoC.player.findPerk( PerkLib.Tank ) >= 0 && CoC.player.tou >= 60 ) {
				_add( new Perk( PerkLib.Tank2 ) );
			}
			if( CoC.player.findPerk( PerkLib.Regeneration ) >= 0 && CoC.player.tou >= 70 ) {
				_add( new Perk( PerkLib.Regeneration2 ) );
			}
			if( CoC.player.tou >= 75 ) {
				_add( new Perk( PerkLib.ImmovableObject ) );
			}
		}
		//Tier 2 Toughness Perks
		if( CoC.player.level >= 12 ) {
			if( CoC.player.tou >= 75 ) {
				_add( new Perk( PerkLib.Resolute ) );
			}
			if( CoC.player.tou >= 60 ) {
				_add( new Perk( PerkLib.IronMan ) );
			}
		}
		//slot 3 - speed perk
		if( CoC.player.spe >= 25 ) {
			_add( new Perk( PerkLib.Evade ) );
		}
		//slot 3 - run perk
		if( CoC.player.spe >= 25 ) {
			_add( new Perk( PerkLib.Runner ) );
		}
		//slot 3 - Double Attack perk
		if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && CoC.player.findPerk( PerkLib.Runner ) >= 0 && CoC.player.spe >= 50 ) {
			_add( new Perk( PerkLib.DoubleAttack ) );
		}
		//Tier 1 Speed Perks
		if( CoC.player.level >= 6 ) {
			//Speedy Recovery - Regain Fatigue 50% faster speed.
			if( CoC.player.findPerk( PerkLib.Evade ) >= 0 && CoC.player.spe >= 60 ) {
				_add( new Perk( PerkLib.SpeedyRecovery ) );
			}
			//Agility - A small portion of your speed is applied to your defense rating when wearing light armors.
			if( CoC.player.spe > 75 && CoC.player.findPerk( PerkLib.Runner ) >= 0 && (CoC.player.armorPerk === 'Light' || CoC.player.armorPerk === 'Medium') ) {
				_add( new Perk( PerkLib.Agility ) );
			}
			if( CoC.player.spe >= 60 ) {
				_add( new Perk( PerkLib.LightningStrikes ) );
			}
		}
		//Tier 2 Speed Perks
		if( CoC.player.level >= 12 ) {
			if( CoC.player.spe >= 75 ) {
				_add( new Perk( PerkLib.LungingAttacks ) );
			}
		}
		//Slot 4 - precision - -10 enemy toughness for damage calc
		if( CoC.player.inte >= 25 ) {
			_add( new Perk( PerkLib.Precision ) );
		}
		//Spellpower - boosts spell power
		if( CoC.player.inte >= 50 ) {
			_add( new Perk( PerkLib.Spellpower ) );
		}
		if( CoC.player.findPerk( PerkLib.Spellpower ) >= 0 && CoC.player.inte >= 50 ) {
			_add( new Perk( PerkLib.Mage ) );
		}
		//Tier 1 Intelligence Perks
		if( CoC.player.level >= 6 ) {
			if( CoC.player.inte >= 50 ) {
				_add( new Perk( PerkLib.Tactician ) );
			}
			if( CoC.player.spellCount() > 0 && CoC.player.findPerk( PerkLib.Spellpower ) >= 0 && CoC.player.findPerk( PerkLib.Mage ) >= 0 && CoC.player.inte >= 60 ) {
				_add( new Perk( PerkLib.Channeling ) );
			}
			if( CoC.player.inte >= 60 ) {
				_add( new Perk( PerkLib.Medicine ) );
			}
		}
		//Tier 2 Intelligence perks
		if( CoC.player.level >= 12 ) {
			if( CoC.player.findPerk( PerkLib.Mage ) >= 0 && CoC.player.inte >= 75 ) {
				_add( new Perk( PerkLib.Archmage ) );
			}
		}
		//LIBIDO PERKZ
		//slot 5 - libido perks
		//Slot 5 - Fertile+ increases cum production and fertility (+15%)
		if( CoC.player.lib >= 25 ) {
			_add( new Perk( PerkLib.FertilityPlus, 15, 1.75, 0, 0 ) );
		}
		//Slot 5 - minimum libido
		if( CoC.player.lib >= 50 ) {
			_add( new Perk( PerkLib.HotBlooded, 20, 0, 0, 0 ) );
		}
		//Tier 1 Libido Perks
		if( CoC.player.level >= 6 ) {
			//Slot 5 - minimum libido
			if( CoC.player.lib >= 60 ) {
				_add( new Perk( PerkLib.WellAdjusted ) );
			}
			//Slot 5 - minimum libido
			if( CoC.player.lib >= 60 && CoC.player.cor >= 50 ) {
				_add( new Perk( PerkLib.Masochist ) );
			}
		}
		//Corruption Perks - slot 7
		//Slot 7 - Corrupted Libido - lust raises 10% slower.
		if( CoC.player.cor >= 25 ) {
			_add( new Perk( PerkLib.CorruptedLibido, 20, 0, 0, 0 ) );
		}
		//Slot 7 - Seduction (Must have seduced Jojo
		if( CoC.player.findPerk( PerkLib.Seduction ) < 0 && CoC.player.cor >= 50 && SceneLib.jojoScene.monk >= 5 ) {
			_add( new Perk( PerkLib.Seduction ) );
		} else if( CoC.player.findPerk( PerkLib.CorruptedLibido ) >= 0 && CoC.player.cor >= 75 ) { //Slot 7 - Nymphomania
			_add( new Perk( PerkLib.Nymphomania ) );
		}
		//Slot 7 - UNFINISHED :3
		if( CoC.player.minLust() >= 20 && CoC.player.findPerk( PerkLib.CorruptedLibido ) >= 0 && CoC.player.cor >= 50 ) {
			_add( new Perk( PerkLib.Acclimation ) );
		}
		//Tier 1 Corruption Perks - acclimation over-rides
		if( CoC.player.level >= 6 ) {
			if( CoC.player.cor >= 60 && CoC.player.findPerk( PerkLib.CorruptedLibido ) >= 0 ) {
				_add( new Perk( PerkLib.Sadist ) );
			}
			if( CoC.player.findPerk( PerkLib.CorruptedLibido ) >= 0 && CoC.player.cor >= 70 ) {
				_add( new Perk( PerkLib.ArousingAura ) );
			}
		}
		//Tier 1 Misc Perks
		if( CoC.player.level >= 6 ) {
			_add( new Perk( PerkLib.Resistance ) );
		}
		// FILTER PERKS
		perkList = _.filter(perkList, function( perk ) {
			return CoC.player.findPerk( perk.perk.ptype ) < 0;
		});
		MainView.aCb.dataProvider = perkList;
		return perkList;
	};
	EngineCore.applyPerk = function( perk ) {
		EngineCore.clearOutput();
		CoC.player.perkPoints--;
		//Apply perk here.
		EngineCore.outputText( '<b>' + perk.perkName + '</b> gained!' );
		CoC.player.createPerk( perk.ptype, perk.value1, perk.value2, perk.value3, perk.value4 );
		if( perk.ptype === PerkLib.StrongBack2 ) {
			CoC.player.itemSlot5.unlocked = true;
		}
		if( perk.ptype === PerkLib.StrongBack ) {
			CoC.player.itemSlot4.unlocked = true;
		}
		if( perk.ptype === PerkLib.Tank2 ) {
			EngineCore.HPChange( CoC.player.tou, false );
			EngineCore.statScreenRefresh();
		}
		EngineCore.doNext( MainView, MainView.playerMenu );
	};
	EngineCore.buttonText = function( buttonName ) {
		var buttonIndex = 0;
		if( _.isString(buttonName) ) {
			var matches = [];
			if( /^buttons\[[0-9]\]/.test( buttonName ) ) {
				matches = /^buttons\[([0-9])\]/.exec( buttonName );
				buttonIndex = parseInt( matches[ 1 ], 10 );
			} else if( /^b[0-9]Text$/.test( buttonName ) ) {
				matches = /^b([0-9])Text$/.exec( buttonName );
				buttonIndex = parseInt( matches[ 1 ], 10 );
				buttonIndex = buttonIndex === 0 ? 9 : buttonIndex - 1;
			}
		}
		return (MainView.getButtonText( buttonIndex ) || 'NULL');
	};
	// Returns a string or undefined.
	EngineCore.getButtonToolTipText = function( buttonText ) {
		var toolTipText = '';
		if( buttonText === null ) {
			buttonText = '';
		}
		if( buttonText.indexOf( ' x' ) !== -1 ) {
			buttonText = buttonText.split( ' x' )[ 0 ];
		}
		var itype = ItemType.lookupItem( buttonText );
		if( itype !== undefined ) {
			toolTipText = itype.description;
		}
		itype = ItemType.lookupItemByShort( buttonText );
		if( itype !== undefined ) {
			toolTipText = itype.description;
		}
		if( buttonText.indexOf( 'Tail Whip' ) !== -1 ) {
			toolTipText = 'Whip your foe with your tail to enrage them and lower their defense!';
		}
		if( buttonText.indexOf( 'Dual Belt' ) !== -1 ) {
			toolTipText = 'This is a strange masturbation device, meant to work every available avenue of stimulation.';
		}
		if( buttonText.indexOf( 'C. Pole' ) !== -1 ) {
			toolTipText = 'This \'centaur pole\' as it\'s called appears to be a sex-toy designed for females of the equine persuasion.  Oddly, it\'s been sculpted to look like a giant imp, with an even bigger horse-cock.';
		}
		if( buttonText.indexOf( 'Fake Mare' ) !== -1 ) {
			toolTipText = 'This fake mare is made of metal and wood, but the anatomically correct vagina looks as soft and wet as any female centaur\'s.';
		}
		//Combat
		//COMBAT
		//combat
		//wombat
		if( buttonText === 'Attack' ) {
			if( !CoC.isInCombat() ) {
				toolTipText = '';
			} else {
				toolTipText = 'Attempt to attack the enemy with your ' + CoC.player.weaponName + '.  Damage done is determined by your strength and weapon.';
			}
		}
		if( buttonText === 'Kiss' ) {
			toolTipText = 'Attempt to kiss your foe on the lips with drugged lipstick.  It has no effect on those without a penis.';
		}
		if( buttonText === 'Tease' ) {
			if( !CoC.isInCombat() ) {
				toolTipText = '';
			} else {
				toolTipText = 'Attempt to make an enemy more aroused by striking a seductive pose and exposing parts of your body.';
			}
		}
		if( buttonText === 'Kick' ) {
			toolTipText = 'Attempt to kick an enemy using your powerful lower body.';
		}
		if( buttonText === 'Combo' ) {
			toolTipText = 'Make a three-hit combo.  Each attack has an extra 33% chance to miss, unless the target is blind. (25 Fatigue)';
		}
		if( buttonText === 'Vault' ) {
			toolTipText = 'Make a vaulting attack for an extra 25% damage.  Automatically crits stunned foes.  (20 Fatigue)';
		}
		if( buttonText === 'Sidewinder' ) {
			toolTipText = 'An attack that hits for reduced damage but has a high chance of stunning. (10 Fatigue)';
		}
		if( buttonText === 'Dirt Kick' ) {
			toolTipText = 'Attempt to blind your foe with a spray of kicked dirt. (5 Fatigue)';
		}
		if( buttonText === 'Metabolize' ) {
			toolTipText = 'Convert 10% of your maximum HP into fatigue.';
		}
		if( buttonText === 'SecondWind' ) {
			toolTipText = 'Regain 50% of your HP, 50 fatigue, and reduce lust by 50 once per fight.';
		}
		if( buttonText.indexOf( 'AnemoneSting' ) !== -1 ) {
			toolTipText = 'Attempt to strike an opponent with the stinging tentacles growing from your scalp.  Reduces enemy speed and increases enemy lust.';
		}
		if( buttonText.indexOf( 'P. Specials' ) !== -1 ) {
			toolTipText = 'Physical special attack menu.';
		}
		if( buttonText.indexOf( 'M. Specials' ) !== -1 ) {
			toolTipText = 'Mental and supernatural special attack menu.';
		}
		if( buttonText === 'Berzerk' ) {
			toolTipText = 'Throw yourself into a rage!  Greatly increases the strength of your weapon and increases lust resistance, but your armor defense is reduced to zero!';
		}
		if( buttonText.indexOf( 'Possess' ) !== -1 ) {
			toolTipText = 'Attempt to temporarily possess a foe and force them to raise their own lusts.';
		}
		if( buttonText.indexOf( 'Constrict' ) !== -1 ) {
			toolTipText = 'Attempt to bind an enemy in your long snake-tail.';
		}
		if( buttonText.indexOf( 'Gore' ) !== -1 ) {
			toolTipText = 'Lower your head and charge your opponent, attempting to gore them on your horns.  This attack is stronger and easier to land with large horns.';
		}
		if( buttonText.indexOf( 'Fantasize' ) !== -1 ) {
			toolTipText = 'Fantasize about your opponent in a sexual way.  It\'s probably a pretty bad idea to do this unless you want to end up getting raped.';
		}
		if( buttonText.indexOf( 'Charge W.' ) !== -1 ) {
			toolTipText = 'The Charge Weapon spell will surround your weapon in electrical energy, causing it to do even more damage.  The effect lasts for the entire combat.  (Fatigue Cost: ' + EngineCore.spellCost( 15 ) + ')';
		}
		if( buttonText.indexOf( 'Blind' ) !== -1 ) {
			toolTipText = 'Blind is a fairly self-explanatory spell.  It will create a bright flash just in front of the victim\'s eyes, blinding them for a time.  However if they blink it will be wasted.  (Fatigue Cost: ' + EngineCore.spellCost( 20 ) + ')';
		}
		if( buttonText.indexOf( 'Whitefire' ) !== -1 ) {
			toolTipText = 'Whitefire is a potent fire based attack that will burn your foe with flickering white flames, ignoring their physical toughness and most armors.  (Fatigue Cost: ' + EngineCore.spellCost( 30 ) + ')';
		}
		if( buttonText.indexOf( 'Aroused' ) !== -1 ) {
		}
		if( buttonText.indexOf( 'Arouse' ) !== -1 ) {
			if( !CoC.isInCombat() ) {
				toolTipText = '';
			} else {
				toolTipText = 'The arouse spell draws on your own inner lust in order to enflame the enemy\'s passions.  (Fatigue Cost: ' + EngineCore.spellCost( 15 ) + ')';
			}
		}
		if( buttonText === 'Heal' ) {
			toolTipText = 'Heal will attempt to use black magic to close your wounds and restore your body, however like all black magic used on yourself, it has a chance of backfiring and greatly arousing you.  (Fatigue Cost: ' + EngineCore.spellCost( 20 ) + ')';
		}
		if( buttonText.indexOf( 'Might' ) !== -1 ) {
			toolTipText = 'The Might spell draws upon your lust and uses it to fuel a temporary increase in muscle size and power.  It does carry the risk of backfiring and raising lust, like all black magic used on oneself.  (Fatigue Cost: ' + EngineCore.spellCost( 25 ) + ')';
		}
		//Wait
		if( buttonText.indexOf( 'Wait' ) !== -1 && CoC.isInCombat() ) {
			toolTipText = 'Take no action for this round.  Why would you do this?  This is a terrible idea.';
		}
		//Sting
		if( buttonText.length === 5 && buttonText.indexOf( 'Sting' ) !== -1 ) {
			toolTipText = 'Attempt to use your venomous bee stinger on an enemy.  Be aware it takes quite a while for your venom to build up, so depending on your abdomen\'s refractory period, you may have to wait quite a while between stings.  Venom: ' + Math.floor( CoC.player.tailVenom ) + '/100';
		}
		//Web
		if( buttonText.indexOf( 'Web' ) !== -1 ) {
			toolTipText = 'Attempt to use your abdomen to spray sticky webs at an enemy and greatly slow them down.  Be aware it takes a while for your webbing to build up.  Web Amount: ' + Math.floor( CoC.player.tailVenom ) + '/100';
		}
		if( buttonText.indexOf( 'Infest' ) !== -1 ) {
			toolTipText = 'The infest attack allows you to cum at will, launching a stream of semen and worms at your opponent in order to infest them.  Unless your foe is very aroused they are likely to simply avoid it.  Only works on males or herms.';
		}
		if( buttonText.indexOf( 'Spells' ) !== -1 ) {
			toolTipText = 'Opens your spells menu, where you can cast any spells you have learned.  Beware, casting spells increases your fatigue, and if you become exhausted you will be easier to defeat.';
		}
		if( buttonText.indexOf( 'Defend' ) !== -1 ) {
			toolTipText = 'Selecting defend will reduce the damage you take by 66 percent, but will not affect any lust incurred by your enemy\'s actions.';
		}
		if( buttonText === 'Run' ) {
			toolTipText = 'Choosing to run will let you try to escape from your enemy. However, it will be hard to escape enemies that are faster than you and if you fail, your enemy will get a free attack.';
		}
		if( buttonText.indexOf( 'Inventory' ) !== -1 ) {
			toolTipText = 'The inventory allows you to use an item.  Be careful as this leaves you open to a counterattack when in combat.';
		}
		if( buttonText.indexOf( 'AutoSav' ) !== -1 ) {
			toolTipText = 'When autosave is on the game will automatically save your character each night at midnight to the last slot it was saved in.';
			if( buttonText.indexOf( 'ON' ) !== -1 ) {
				toolTipText += ' Autosave is currently enabled.  Your game will be saved at midnight.';
			}
			if( buttonText.indexOf( 'OFF' ) !== -1 ) {
				toolTipText += ' Autosave is currently off.  Your game will NOT be saved.';
			}
		}
		if( buttonText.indexOf( 'Retrieve' ) !== -1 ) {
			toolTipText = 'Retrieve allows you to take an item from one of the reserve stacks in your camp\'s additional storage.';
		}
		if( buttonText.indexOf( 'Storage' ) !== -1 ) {
			toolTipText = 'Storage will allow you to dump a stack of items from your inventory into your storage chest.';
		}
		if( buttonText.indexOf( 'Sand Facial' ) !== -1 ) {
			toolTipText = 'The goblins promise this facial will give you a rough, handsome look thanks to their special, timeless sands.';
		}
		if( buttonText.indexOf( 'Mud Facial' ) !== -1 ) {
			toolTipText = 'This facial is supposed to enhance the softness of your face and enhance its femininity greatly.';
		}
		//Masturbation Toys
		if( buttonText === 'Masturbate' ) {
			toolTipText = 'Selecting this option will make you attempt to manually masturbate in order to relieve your lust buildup.';
		}
		if( buttonText === 'Meditate' ) {
			toolTipText = 'Selecting this option will make you attempt to meditate in order to reduce lust and corruption.';
		}
		if( buttonText.indexOf( 'AN Stim-Belt' ) !== -1 ) {
			toolTipText = 'This is an all-natural self-stimulation belt.  The methods used to create such a pleasure device are unknown.  It seems to be organic in nature.';
		}
		if( buttonText.indexOf( 'Stim-Belt' ) !== -1 ) {
			toolTipText = 'This is a self-stimulation belt.  Commonly referred to as stim-belts, these are clockwork devices designed to pleasure the female anatomy.';
		}
		if( buttonText.indexOf( 'AN Onahole' ) !== -1 ) {
			toolTipText = 'An all-natural onahole, this device looks more like a bulbous creature than a sex-toy.  Nevertheless, the slick orifice it presents looks very inviting.';
		}
		if( buttonText.indexOf( 'D Onahole' ) !== -1 ) {
			toolTipText = 'This is a deluxe onahole, made of exceptional materials and with the finest craftsmanship in order to bring its user to the height of pleasure.';
		}
		if( buttonText.indexOf( 'Onahole' ) !== -1 ) {
			toolTipText = 'This is what is called an \'onahole\'.  This device is a simple textured sleeve designed to fit around the male anatomy in a pleasurable way.';
		}
		if( buttonText === 'Jojo' ) {
			if( SceneLib.jojoScene.monk >= 5 ) {
				toolTipText = 'Call your corrupted pet into camp in order to relieve your desires in a variety of sexual positions?  He\'s ever so willing after your last encounter with him.';
			} else {
				toolTipText = 'Go find Jojo around the edges of your camp and meditate with him or talk about watch duty.';
			}
		}
		if( buttonText === 'Marble' ) {
			toolTipText = 'Go to Marble the cowgirl for talk and companionship.';
		}
		//Books
		if( buttonText.indexOf( 'Dangerous Plants' ) !== -1 ) {
			toolTipText = 'This is a book titled \'Dangerous Plants\'.  As explained by the title, this tome is filled with information on all manner of dangerous plants from this realm.';
		}
		if( buttonText.indexOf( 'Traveler\'s Guide' ) !== -1 ) {
			toolTipText = 'This traveler\'s guide is more of a pamphlet than an actual book, but it still contains some useful information on avoiding local pitfalls.';
		}
		if( buttonText.indexOf( 'Yoga Guide' ) !== -1 ) {
			toolTipText = 'This leather-bound book is titled \'Yoga for Non-Humanoids.\' It contains numerous illustrations of centaurs, nagas and various other oddly-shaped beings in a variety of poses.';
		}
		if( buttonText.indexOf( 'Hentai Comic' ) !== -1 ) {
			toolTipText = 'This oddly drawn comic book is filled with images of fornication, sex, and overly large eyeballs.';
		}
		//CAMP STUFF
		if( buttonText.indexOf( 'Followers' ) !== -1 ) {
			toolTipText = 'Check up on any followers or companions who are joining you in or around your camp.  You\'ll probably just end up sleeping with them.';
		}
		//Marble
		if( buttonText.indexOf( 'Marble (Sex)' ) !== -1 ) {
			toolTipText = 'Get with Marble for a quick cuddle and some sex.';
		}
		//Rathazul
		if( buttonText.indexOf( 'Rathazul' ) !== -1 ) {
			toolTipText = 'Visit with Rathazul to see what alchemical supplies and services he has available at the moment.';
		}
		//Title screen
		if( buttonText.indexOf( 'Toggle Debug' ) !== -1 ) {
			toolTipText = 'Turn on debug mode.  Debug mode is intended for testing purposes but can be thought of as a cheat mode.  Items are infinite and combat is easy to escape from.  Weirdness and bugs are to be expected.';
		}
		if( buttonText.indexOf( 'Credits' ) !== -1 ) {
			toolTipText = 'See a list of all the cool people who have contributed to content for this game!';
		}
		if( buttonText.indexOf( 'Instructions' ) !== -1 ) {
			toolTipText = 'How to play.  Starting tips.  And hotkeys for easy left-handed play...';
		}
		if( buttonText.indexOf( 'Settings' ) !== -1 ) {
			toolTipText = 'Configure game settings and enable cheats.';
		}
		if( buttonText.indexOf( 'ASPLODE' ) !== -1 ) {
			toolTipText = 'MAKE SHIT ASPLODE';
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
		var toolTipText = EngineCore.getButtonToolTipText( text );
		MainView.showBottomButton( pos, text, callback, toolTipText );
		EngineCore.flushOutputTextToGUI();
	};
	EngineCore.hasButton = MainView.hasButton;
	EngineCore.removeButton = function( arg ) {
		var buttonToRemove = 0;
		if( _.isString(arg) ) {
			buttonToRemove = MainView.indexOfButtonWithLabel( arg );
		}else if( _.isNumber(arg) ) {
			if( arg < 0 || arg > 9 ) {
				return;
			}
			buttonToRemove = Math.round( arg );
		}
		MainView.hideBottomButton( buttonToRemove );
	};
	EngineCore.menu = function() { //The newer, simpler menu - blanks all buttons so addButton can be used
		MainView.hideBottomButton( 0 );
		MainView.hideBottomButton( 1 );
		MainView.hideBottomButton( 2 );
		MainView.hideBottomButton( 3 );
		MainView.hideBottomButton( 4 );
		MainView.hideBottomButton( 5 );
		MainView.hideBottomButton( 6 );
		MainView.hideBottomButton( 7 );
		MainView.hideBottomButton( 8 );
		MainView.hideBottomButton( 9 );
		EngineCore.flushOutputTextToGUI();
	};
	EngineCore.choices = function() { //New typesafe version
		EngineCore.menu();
		var args = Array.from( arguments );
		if(args.length % 3 !== 0) {
			$log.error('Bad arguments number.');
		}
		_.forEach(_.range(0, args.length - 1, 3), function(choice, index) {
			EngineCore.addButton( index, args[choice], args[choice + 1], args[choice + 2] );
		});
	};
	/****
	 This function is made for multipage menus of unpredictable length,
	 say a collection of items or places or people that can change
	 depending on certain events, past choices, the time of day, or whatever.
	 This is not the best for general menu use.  Use choices() for that.
	 This is a bit confusing, so here\'s usage instructions.
	 Pay attention to all the braces.
	 This is made to be used with an array that you create before calling it,
	 so that you can push as many items on to that array as you like
	 before passing that array off to this function.
	 So you can do something like this:
	 var itemsInStorage :Array = new Array();
	 // The extra square braces are important.
	 itemsInStorage.push( [ 'Doohicky', useDoohickyFunc ] );
	 itemsInStorage.push( [ 'Whatsit', useWhatsitFunc ] );
	 itemsInStorage.push( [ 'BagOfDicks', eatBagOfDicks ] );
	 0...
	 // see notes about cancelFunc
	 EngineCore.multipageChoices( cancelFunc, itemsInStorage );
	 cancelfunc is a function (A button event function, specifically)
	 that exits the menu.  Provide this if you want a Back button to appear
	 in the bottom right.
	 If you do not need a cancel function, perhaps because some or all
	 of the choices will exit the menu, then you can
	 pass null or 0 for the cancelFunction.
	 // This menu shows no Back button.
	 EngineCore.multipageChoices( null, itemsInStorage );
	 You can call it directly if you want, but that\'s ridiculous.
	 EngineCore.multipageChoices( justGoToCamp, [
	 [ 'Do this', doThisEvent ],
	 [ 'Do that', doThatEvent ],
	 [ 'Do something', doSomethingEvent ],
	 [ 'Fap', goFapEvent ],
	 [ 'Rape Jojo', jojoRape ],
	 // 0... more items here...
	 [ 'What', goWhat ],
	 [ 'Margle', gurgleFluidsInMouthEvent ] // no comma on last item.
	 ]);
	 ****/
	EngineCore.multipageChoices = function( cancelFunction, menuItems ) {
		const itemsPerPage = 8;
		var currentPageIndex;
		var pageCount;
		function getPageOfItems( pageIndex ) {
			var startItemIndex = pageIndex * itemsPerPage;
			return menuItems.slice( startItemIndex, startItemIndex + itemsPerPage );
		}
		function showNextPage() {
			showPage(( currentPageIndex + 1 ) % pageCount);
		}
		function showPage( pageIndex ) {
			var currentPageItems; // holds the current page of items.
			if( pageIndex < 0 ) {
				pageIndex = 0;
			}
			if( pageIndex >= pageCount ) {
				pageIndex = pageCount - 1;
			}
			currentPageIndex = pageIndex;
			currentPageItems = getPageOfItems( pageIndex );
			// I did it this way so as to use only one actual menu setting function.
			// I figured it was safer until the menu functions stabilize.
			// insert page functions.
			// First pad out the items so it\'s always in a predictable state.
			while( currentPageItems.length < 8 ) {
				currentPageItems.push( [ '', 0 ] );
			}
			// Insert next button.
			currentPageItems.splice( 4, 0, [ 'See page ' + ( ((currentPageIndex + 1) % pageCount) + 1 ) + '/' + pageCount, pageCount > 1 ? showNextPage : 0 ]);
			// Cancel/Back button always appears in bottom right, like in the inventory.
			currentPageItems.push( [ 'Back', cancelFunction || 0 ] );
			EngineCore.choices.apply( null, _.flatten( currentPageItems ) );
		}
		pageCount = Math.ceil( menuItems.length / itemsPerPage );
		if( !_.isFunction(cancelFunction) ) {
			cancelFunction = 0;
		}
		showPage( 0 );
	};
	// simpleChoices and doYesNo are convenience functions. They shouldn\'t re-implement code from choices()
	EngineCore.simpleChoices = EngineCore.choices;
	EngineCore.doYesNo = function( objYes, eventYes, objNo, eventNo ) {
		EngineCore.choices('Yes', objYes, eventYes, 'No', objNo, eventNo);
	};
	EngineCore.doNext = function( obj, event ) {
		//Prevent new events in combat from automatically overwriting a game over.
		if( MainView.getButtonText( 0 ).indexOf( 'Game Over' ) !== -1 ) {
			$log.trace( 'Do next setup cancelled by game over' );
			return;
		}
		EngineCore.choices('Next', obj, event);
	};
	//Used to update the display of statistics
	EngineCore.statScreenRefresh = function() {
		MainView.statsView.show;
	};
	EngineCore.showStats = function() {
		MainView.statsView.show;
	};
	EngineCore.hideStats = function() {
		MainView.statsView.hide;
	};
	EngineCore.hideMenus = MainView.hideAllMenuButtons;
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
				EngineCore.statScreenRefresh();
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
		EngineCore.statScreenRefresh();
	};
	EngineCore.changeFatigue = EngineCore.fatigue;
	EngineCore.displayStats = function( ) {
		EngineCore.spriteSelect( -1 );
		EngineCore.outputText( '', true );
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
			EngineCore.outputText( '<b><u>Combat Stats</u></b>\n' + combatStats, false );
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
			EngineCore.outputText( '\n<b><u>Children</u></b>\n' + childStats, false );
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
			EngineCore.outputText( '\n<b><u>Body Stats</u></b>\n' + bodyStats, false );
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
			EngineCore.outputText( '\n<b><u>Miscellaneous Stats</u></b>\n' + miscStats );
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
			EngineCore.outputText( '\n<b><u>Addictions</u></b>\n' + addictStats, false );
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
			EngineCore.outputText( '\n<b><u>Interpersonal Stats</u></b>\n' + interpersonStats, false );
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
			EngineCore.outputText( '\n<b><u>Ongoing Status Effects</u></b>\n' + statEffects, false );
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
	// returns OLD OP VAL
	EngineCore.applyOperator = function( old, op, val ) {
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
				$log.trace( 'applyOperator(' + old + ',\'' + op + '\',' + val + ') unknown op' );
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
				if(!_.find(['+', '-', '*', '/', '='], op)) {
					stat = args[ i ];
					op = false;
				}
				var argIndex = _.findIndex(argNamesShort, stat);
				if(argIndex === -1) {
					argIndex = _.findIndex(argNamesFull, stat);
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
		var newStr = EngineCore.applyOperator( CoC.player.str, argOps[ 0 ], argVals[ 0 ] );
		var newTou = EngineCore.applyOperator( CoC.player.tou, argOps[ 1 ], argVals[ 1 ] );
		var newSpe = EngineCore.applyOperator( CoC.player.spe, argOps[ 2 ], argVals[ 2 ] );
		var newInte = EngineCore.applyOperator( CoC.player.inte, argOps[ 3 ], argVals[ 3 ] );
		var newLib = EngineCore.applyOperator( CoC.player.lib, argOps[ 4 ], argVals[ 4 ] );
		var newSens = EngineCore.applyOperator( CoC.player.sens, argOps[ 5 ], argVals[ 5 ] );
		var newLust = EngineCore.applyOperator( CoC.player.lust, argOps[ 6 ], argVals[ 6 ] );
		var newCor = EngineCore.applyOperator( CoC.player.cor, argOps[ 7 ], argVals[ 7 ] );
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
		if( CoC.flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] === 1 && lust2 > 0 && resisted ) {
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
		EngineCore.statScreenRefresh();
	};
	EngineCore.range = function( min, max, round ) {
		var num = (min + Math.random() * (max - min));
		if( round ) {
			return Math.round( num );
		}
		return num;
	};
	EngineCore.cuntChangeOld = function( cIndex, vIndex, display ) {
		//Virginity check
		if( CoC.player.vaginas[ vIndex ].virgin ) {
			if( display ) {
				EngineCore.outputText( '\nYour ' + Descriptors.vaginaDescript( vIndex ) + ' loses its virginity!', false );
			}
			CoC.player.vaginas[ vIndex ].virgin = false;
		}
		//If cock is bigger than unmodified vagina can hold - 100% stretch!
		if( CoC.player.vaginas[ vIndex ].capacity() <= CoC.monster.cocks[ cIndex ].cArea() ) {
			if( CoC.player.vaginas[ vIndex ] < 5 ) {
				$log.trace( 'CUNT STRETCHED: By cock larger than it\'s total capacity.' );
				if( display ) {
					if( CoC.player.vaginas[ vIndex ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_GAPING_WIDE ) {
						EngineCore.outputText( '<b>Your ' + Descriptors.vaginaDescript( 0 ) + ' is stretched even further, capable of taking even the largest of demons and beasts.</b>  ', false );
					}
					if( CoC.player.vaginas[ vIndex ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_GAPING ) {
						EngineCore.outputText( '<b>Your ' + Descriptors.vaginaDescript( 0 ) + ' painfully stretches, gaping wide-open.</b>  ', false );
					}
					if( CoC.player.vaginas[ vIndex ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_LOOSE ) {
						EngineCore.outputText( '<b>Your ' + Descriptors.vaginaDescript( 0 ) + ' is now very loose.</b>  ', false );
					}
					if( CoC.player.vaginas[ vIndex ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_NORMAL ) {
						EngineCore.outputText( '<b>Your ' + Descriptors.vaginaDescript( 0 ) + ' is now loose.</b>  ', false );
					}
					if( CoC.player.vaginas[ vIndex ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_TIGHT ) {
						EngineCore.outputText( '<b>Your ' + Descriptors.vaginaDescript( 0 ) + ' loses its virgin-like tightness.</b>  ', false );
					}
				}
				CoC.player.vaginas[ vIndex ].vaginalLooseness++;
			}
		}
		//If cock is within 75% of max, streeeeetch 33% of the time
		if( CoC.player.vaginas[ vIndex ].capacity() * 0.75 <= CoC.monster.cocks[ cIndex ].cArea() ) {
			if( CoC.player.vaginas[ vIndex ] < 5 ) {
				$log.trace( 'CUNT STRETCHED: By cock @ 75% of capacity.' );
				if( display ) {
					if( CoC.player.vaginas[ vIndex ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_GAPING_WIDE ) {
						EngineCore.outputText( '<b>Your ' + Descriptors.vaginaDescript( 0 ) + ' is stretched even further, capable of taking even the largest of demons and beasts.</b>  ', false );
					}
					if( CoC.player.vaginas[ vIndex ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_GAPING ) {
						EngineCore.outputText( '<b>Your ' + Descriptors.vaginaDescript( 0 ) + ' painfully stretches, gaping wide-open.</b>  ', false );
					}
					if( CoC.player.vaginas[ vIndex ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_LOOSE ) {
						EngineCore.outputText( '<b>Your ' + Descriptors.vaginaDescript( 0 ) + ' is now very loose.</b>  ', false );
					}
					if( CoC.player.vaginas[ vIndex ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_NORMAL ) {
						EngineCore.outputText( '<b>Your ' + Descriptors.vaginaDescript( 0 ) + ' is now loose.</b>  ', false );
					}
					if( CoC.player.vaginas[ vIndex ].vaginalLooseness === AppearanceDefs.VAGINA_LOOSENESS_TIGHT ) {
						EngineCore.outputText( '<b>Your ' + Descriptors.vaginaDescript( 0 ) + ' loses its virgin-like tightness.</b>  ', false );
					}
				}
				CoC.player.vaginas[ vIndex ].vaginalLooseness++;
			}
		}
	};
	EngineCore.spriteSelect = function( choice ) {
		MainView.spriteSelect( choice );
	};
	return EngineCore;
});
