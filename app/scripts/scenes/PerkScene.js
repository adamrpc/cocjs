'use strict';

/* jshint latedef:nofunc */
angular.module('cocjs').run( function (SceneLib, PerkLib, Perk, Utils, CoC, EngineCore, MainView, kFLAGS ) {
	function PerkScene() {}
	function doubleAttackOptions() {
		MainView.clearOutput();
		MainView.menu();
		if( CoC.flags[ kFLAGS.DOUBLE_ATTACK_STYLE ] === 0 ) {
			MainView.outputText( 'You will currently always double attack in combat.  If your strength exceeds sixty, your double-attacks will be done at sixty strength in order to double-attack.' );
			MainView.outputText( '\n\nYou can change it to double attack until sixty strength and then dynamicly switch to single attacks.' );
			MainView.outputText( '\nYou can change it to always single attack.' );
			EngineCore.addButton( 1, 'Dynamic', null, doubleAttackDynamic );
			EngineCore.addButton( 2, 'Single', null, doubleAttackOff );
		} else if( CoC.flags[ kFLAGS.DOUBLE_ATTACK_STYLE ] === 1 ) {
			MainView.outputText( 'You will currently double attack until your strength exceeds sixty, and then single attack.' );
			MainView.outputText( '\n\nYou can choose to force double attacks at reduced strength (when over sixty, it makes attacks at a strength of sixty.' );
			MainView.outputText( '\nYou can change it to always single attack.' );
			EngineCore.addButton( 0, 'All Double', null, doubleAttackForce );
			EngineCore.addButton( 2, 'Single', null, doubleAttackOff );
		} else {
			MainView.outputText( 'You will always single attack your foes in combat.' );
			MainView.outputText( '\n\nYou can choose to force double attacks at reduced strength (when over sixty, it makes attacks at a strength of sixty.' );
			MainView.outputText( '\nYou can change it to double attack until sixty strength and then switch to single attacks.' );
			EngineCore.addButton( 0, 'All Double', null, doubleAttackForce );
			EngineCore.addButton( 1, 'Dynamic', null, doubleAttackDynamic );
		}
		EngineCore.addButton( 4, 'Back', SceneLib.perkScene, SceneLib.perkScene.displayPerks );
	}
	function doubleAttackForce() {
		CoC.flags[ kFLAGS.DOUBLE_ATTACK_STYLE ] = 0;
		doubleAttackOptions();
	}
	function doubleAttackDynamic() {
		CoC.flags[ kFLAGS.DOUBLE_ATTACK_STYLE ] = 1;
		doubleAttackOptions();
	}
	function doubleAttackOff() {
		CoC.flags[ kFLAGS.DOUBLE_ATTACK_STYLE ] = 2;
		doubleAttackOptions();
	}
	function perkSelect( selected ) {
		if( MainView.aCb.visible ) {
			MainView.aCb.visible = false;
			applyPerk( selected );
		}
	}
	function perkSkip() {
		if( MainView.aCb.visible ) {
			MainView.aCb.visible = false;
			MainView.playerMenu();
		}
	}
	function buildPerkList() {
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
	}
	function applyPerk( perk ) {
		MainView.clearOutput();
		CoC.player.perkPoints--;
		//Apply perk here.
		MainView.outputText( '<b>' + perk.perkName + '</b> gained!' );
		CoC.player.createPerk( perk.ptype, perk.value1, perk.value2, perk.value3, perk.value4 );
		if( perk.ptype === PerkLib.StrongBack2 ) {
			CoC.player.itemSlot5.unlocked = true;
		}
		if( perk.ptype === PerkLib.StrongBack ) {
			CoC.player.itemSlot4.unlocked = true;
		}
		if( perk.ptype === PerkLib.Tank2 ) {
			EngineCore.HPChange( CoC.player.tou, false );
			MainView.statsView.show();
		}
		EngineCore.doNext( MainView, MainView.playerMenu );
	}

	PerkScene.prototype.perkBuyMenu = function() {
		MainView.clearOutput();
		var perkList = buildPerkList();
		if( perkList.length === 0 ) {
			MainView.outputText( '<b>You do not qualify for any perks at present.  </b>In case you qualify for any in the future, you will keep your ' + Utils.num2Text( CoC.player.perkPoints ) + ' perk point' );
			if( CoC.player.perkPoints > 1 ) {
				MainView.outputText( 's' );
			}
			MainView.outputText( '.' );
			EngineCore.doNext( MainView, MainView.playerMenu );
			return;
		}
		MainView.outputText( 'Please select a perk from the drop-down list, then click \'Okay\'.  You can press \'Skip\' to save your perk point for later.\n\n' );
		MainView.aCb.visible = true;
		MainView.hideMenuButton( MainView.MENU_NEW_MAIN );
		MainView.menu();
		EngineCore.addButton( 1, 'Skip', null, perkSkip );
	};
	PerkScene.prototype.changeHandler = function( selected ) {
		if( selected === null ) {
			return;
		}
		//Store perk name for later addition
		MainView.clearOutput();
		MainView.outputText( 'You have selected the following perk:\n\n' );
		MainView.outputText( '<b>' + selected.perkName + ':</b> ' + selected.perkLongDesc + '\n\nIf you would like to select this perk, click <b>Okay</b>.  Otherwise, select a new perk, or press <b>Skip</b> to make a decision later.' );
		MainView.menu();
		EngineCore.addButton( 0, 'Okay', null, perkSelect, selected );
		EngineCore.addButton( 1, 'Skip', null, perkSkip );
	};
	PerkScene.prototype.displayPerks = function() {
		MainView.outputText( '', true );
		_.forEach(CoC.player.perks, function(perk) {
			MainView.outputText( '<b>' + perk.perkName + '</b> - ' + perk.perkDesc + '\n', false );
		});
		MainView.menu();
		if( CoC.player.perkPoints > 0 ) {
			MainView.outputText( '\n<b>You have ' + Utils.num2Text( CoC.player.perkPoints ) + ' perk point', false );
			if( CoC.player.perkPoints > 1 ) {
				MainView.outputText( 's', false );
			}
			MainView.outputText( ' to spend.</b>', false );
			EngineCore.addButton( 1, 'Perk Up', this, this.perkBuyMenu );
		}
		if( CoC.player.findPerk( PerkLib.DoubleAttack ) >= 0 ) {
			MainView.outputText( '\n<b>You can adjust your double attack settings.</b>' );
			EngineCore.addButton( 2, 'Dbl Options', null, doubleAttackOptions );
		}
		EngineCore.addButton( 0, 'Next', null, MainView.playerMenu );
	};
	SceneLib.registerScene('perkScene', new PerkScene());
	MainView.setMenuButton( MainView.MENU_PERKS, 'Perks', SceneLib.perkScene, SceneLib.perkScene.displayPerks );
});