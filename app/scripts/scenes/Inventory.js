'use strict';

angular.module( 'cocjs' ).run( function( MainView, SceneLib, $log, Useable, Armor, Weapon, CoC_Settings, ConsumableLib, ItemSlot, ItemType, OnLoadVariables, WeaponLib, CoC, EngineCore, kFLAGS, Utils, Combat, StatusAffects ) {
	function Inventory() {
		this.itemStorage = [];
		this.gearStorage = [];
		this.callNext = null;
		this.callOnAbandon = null;
		this.currentItemSlot = null;
	}

	var inventorySlotName = [ 'first', 'second', 'third', 'fourth', 'fifth' ];

	Inventory.prototype.showStash = function() {
		return CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00254 ] > 0 || CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00255 ] > 0 || this.itemStorage.length > 0 || CoC.flags[ kFLAGS.ANEMONE_KID ] > 0;
	};
	Inventory.prototype.itemStorageDirectGet = function() {
		return this.itemStorage;
	};
	Inventory.prototype.gearStorageDirectGet = function() {
		return this.gearStorage;
	};
	Inventory.prototype.itemGoNext = function() {
		if( this.callNext !== null ) {
			EngineCore.doNext( this, this.callNext );
		}
	};
	Inventory.prototype.inventoryMenu = function() {
		var x;
		var foundItem = false;
		if( CoC.isInCombat() ) {
			this.callNext = this.inventoryCombatHandler; //Player will return to combat after item use
		} else {
			EngineCore.spriteSelect( -1 );
			this.callNext = this.inventoryMenu; //In camp or in a dungeon player will return to inventory menu after item use
		}
		MainView.hideAllMenuButtons();
		EngineCore.hideUpDown();
		MainView.clearOutput();
		EngineCore.outputText( '<b><u>Equipment:</u></b>\n' );
		EngineCore.outputText( '<b>Weapon</b>: ' + CoC.player.weaponName + ' (Attack - ' + CoC.player.weaponAttack + ')\n' );
		EngineCore.outputText( '<b>Armor : </b>' + CoC.player.armorName + ' (Defense - ' + CoC.player.armorDef + ')\n' );
		if( CoC.player.keyItems.length > 0 ) {
			EngineCore.outputText( '<b><u>\nKey Items:</u></b>\n' );
		}
		_.forEach(CoC.player.keyItems, function(item) {
			EngineCore.outputText( item.keyName + '\n' );
		});
		EngineCore.menu();
		for( x = 0; x < 5; x++ ) {
			if( CoC.player.itemSlots[ x ].unlocked && CoC.player.itemSlots[ x ].quantity > 0 ) {
				EngineCore.addButton( x, (CoC.player.itemSlots[ x ].itype.shortName + ' x' + CoC.player.itemSlots[ x ].quantity), this.useItemInInventory, x );
				foundItem = true;
			}
		}
		if( CoC.player.weapon !== WeaponLib.FISTS ) {
			EngineCore.addButton( 5, 'Unequip', this, this.unequipWeapon );
		}
		if( !CoC.isInCombat() && OnLoadVariables.dungeonLoc !== 0 && OnLoadVariables.inRoomedDungeon === false ) {
			if( SceneLib.xmasMisc.nieveHoliday() && CoC.flags[ kFLAGS.NIEVE_STAGE ] > 0 && CoC.flags[ kFLAGS.NIEVE_STAGE ] < 5 ) {
				if( CoC.flags[ kFLAGS.NIEVE_STAGE ] === 1 ) {
					EngineCore.outputText( '\nThere\'s some odd snow here that you could do something with...\n' );
				} else {
					EngineCore.outputText( '\nYou have a snow' + SceneLib.xmasMisc.nieveMF( 'man', 'woman' ) + ' here that seems like it could use a little something...\n' );
				}
				EngineCore.addButton( 6, 'Snow', SceneLib.xmasMisc, SceneLib.xmasMisc.nieveBuilding );
				foundItem = true;
			}
			if( CoC.flags[ kFLAGS.FUCK_FLOWER_KILLED ] === 0 && CoC.flags[ kFLAGS.FUCK_FLOWER_LEVEL ] >= 1 ) {
				if( CoC.flags[ kFLAGS.FUCK_FLOWER_LEVEL ] === 4 ) {
					EngineCore.outputText( '\nHolli is in her tree at the edges of your camp.  You could go visit her if you want.\n' );
				}
				EngineCore.addButton( 7, (CoC.flags[ kFLAGS.FUCK_FLOWER_LEVEL ] >= 3 ? 'Tree' : 'Plant'), SceneLib.holliScene.treeMenu );
				foundItem = true;
			}
			if( CoC.player.hasKeyItem( 'Dragon Egg' ) >= 0 ) {
				SceneLib.emberScene.emberCampDesc();
				EngineCore.addButton( 8, 'Egg', SceneLib.emberScene, SceneLib.emberScene.emberEggInteraction );
				foundItem = true;
			}
		}
		if( !foundItem ) {
			EngineCore.outputText( '\nYou have no usable items.' );
			EngineCore.doNext( MainView, MainView.playerMenu );
			return;
		}
		if( CoC.isInCombat() && CoC.player.findStatusAffect( StatusAffects.Sealed ) >= 0 && CoC.player.statusAffectv1( StatusAffects.Sealed ) === 3 ) {
			EngineCore.outputText( '\nYou reach for your items, but you just can\'t get your pouches open.  <b>Your ability to use items was sealed, and now you\'ve wasted a chance to attack!</b>\n\n' );
			Combat.enemyAI();
			return;
		}
		EngineCore.outputText( '\nWhich item will you use?' );
		if( CoC.isInCombat() ) {
			EngineCore.addButton( 9, 'Back', null, Combat.combatMenu, false );
		}//Player returns to the combat menu on cancel
		else {
			EngineCore.addButton( 9, 'Back', null, MainView.playerMenu );
		}
	};
	Inventory.prototype.stash = function() {
		MainView.clearOutput();
		EngineCore.spriteSelect( -1 );
		EngineCore.menu();
		if( CoC.flags[ kFLAGS.ANEMONE_KID ] > 0 ) {
			SceneLib.anemoneScene.anemoneBarrelDescription();
			if( CoC.time.hours >= 6 ) {
				EngineCore.addButton( 4, 'Anemone', SceneLib.anemoneScene, SceneLib.anemoneScene.approachAnemoneBarrel );
			}
		}
		if( CoC.player.hasKeyItem( 'Camp - Chest' ) >= 0 ) {
			EngineCore.outputText( 'You have a large wood and iron chest to help store excess items located near the portal entrance.\n\n' );
			EngineCore.addButton( 0, 'Chest Store', this, this.pickItemToPlaceInCampStorage );
			if( this.hasItemsInStorage() ) {
				EngineCore.addButton( 1, 'Chest Take', this, this.pickItemToTakeFromCampStorage );
			}
		}
		//Weapon Rack;
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00254 ] > 0 ) {
			EngineCore.outputText( 'There\'s a weapon rack set up here, set up to hold up to nine various weapons.' );
			EngineCore.addButton( 2, 'W.Rack Put', this, this.pickItemToPlaceInWeaponRack );
			if( this.weaponRackDescription() ) {
				EngineCore.addButton( 3, 'W.Rack Take', this, this.pickItemToTakeFromWeaponRack );
			}
			EngineCore.outputText( '\n\n' );
		}
		//Armor Rack;
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00255 ] > 0 ) {
			EngineCore.outputText( 'Your camp has an armor rack set up to hold your various sets of gear.  It appears to be able to hold nine different types of armor.' );
			EngineCore.addButton( 5, 'A.Rack Put', this, this.pickItemToPlaceInArmorRack );
			if( this.armorRackDescription() ) {
				EngineCore.addButton( 6, 'A.Rack Take', this, this.pickItemToTakeFromArmorRack );
			}
			EngineCore.outputText( '\n\n' );
		}
		EngineCore.addButton( 9, 'Back', null, MainView.playerMenu );
	};
	Inventory.prototype.takeItem = function( itype, nextAction, overrideAbandon, source ) {
		if( itype === null ) {
			CoC_Settings.error( 'takeItem(null)' );
			return;
		}
		if( itype === ItemType.NOTHING ) {
			return;
		}
		if( nextAction !== null ) {
			this.callNext = nextAction;
		} else {
			this.callNext = MainView.playerMenu;
		}
		//Check for an existing stack with room in the inventory and return the value for it.;
		var temp = CoC.player.roomInExistingStack( itype );
		if( temp >= 0 ) {
			{ //First slot go!
			}
			CoC.player.itemSlots[ temp ].quantity++;
			EngineCore.outputText( 'You place ' + itype.longName + ' in your ' + inventorySlotName[ temp ] + ' pouch, giving you ' + CoC.player.itemSlots[ temp ].quantity + ' of them.' );
			this.itemGoNext();
			return;
		}
		//If not done, then put it in an empty spot!;
		//Throw in slot 1 if there is room;
		temp = CoC.player.emptySlot();
		if( temp >= 0 ) {
			CoC.player.itemSlots[ temp ].setItemAndQty( itype, 1 );
			EngineCore.outputText( 'You place ' + itype.longName + ' in your ' + inventorySlotName[ temp ] + ' pouch.' );
			this.itemGoNext();
			return;
		}
		if( overrideAbandon !== null ) {
			this.callOnAbandon = overrideAbandon;
		} else {
			this.callOnAbandon = this.callNext;
		}
		//OH NOES! No room! Call replacer functions!;
		this.takeItemFull( itype, true, source );
	};
	Inventory.prototype.returnItemToInventory = function( item, showNext ) { //Used only by items that have a sub menu if the player cancels
		if( this.currentItemSlot === null ) {
			this.takeItem( item, this.callNext, this.callNext, null ); //Give player another chance to put item in inventory
		} else if( this.currentItemSlot.quantity > 0 ) {
			this.currentItemSlot.quantity++;
		} else {
			this.currentItemSlot.setItemAndQty( item, 1 );
		}
		if( CoC.isInCombat() ) {
			Combat.enemyAI();
			return;
		}
		if( showNext === undefined || showNext ) {
			EngineCore.doNext( this, this.callNext );
		}//Items with sub menus should return to the inventory screen if the player decides not to use them
		else {
			this.callNext(); //When putting items back in your stash we should skip to the take from stash menu
		}
	};
	//Check to see if anything is stored;
	Inventory.prototype.hasItemsInStorage = function() {
		return this.itemAnyInStorage( this.itemStorage, 0, this.itemStorage.length );
	};
	Inventory.prototype.hasItemInStorage = function( itype ) {
		return this.itemTypeInStorage( this.itemStorage, 0, this.itemStorage.length, itype );
	};
	Inventory.prototype.consumeItemInStorage = function( itype ) {
		var item = _.find( this.itemStorage, function( item ) {
			return item.itype === itype && item.quantity > 0;
		} );
		if( item ) {
			item.quantity--;
			return true;
		}
		return false;
	};
	Inventory.prototype.giveHumanizer = function() {
		if( CoC.flags[ kFLAGS.TIMES_CHEATED_COUNTER ] > 0 ) {
			EngineCore.outputText( '<b>I was a cheater until I took an arrow to the knee...</b>', true );
			EngineCore.gameOver();
			return;
		}
		EngineCore.outputText( 'I AM NOT A CROOK.  BUT YOU ARE!  <b>CHEATER</b>!\n\n', true );
		SceneLib.inventory.takeItem( ConsumableLib.HUMMUS_, MainView.playerMenu );
		CoC.flags[ kFLAGS.TIMES_CHEATED_COUNTER ]++;
	};
	//Create a storage slot;
	Inventory.prototype.createStorage = function() {
		if( this.itemStorage.length >= 16 ) {
			return false;
		}
		var newSlot = new ItemSlot();
		this.itemStorage.push( newSlot );
		return true;
	};
	//Clear storage slots;
	Inventory.prototype.clearStorage = function() {
		//Various Errors preventing action;
		if( this.itemStorage === null ) {
			$log.error( 'ERROR: Cannot clear storage because storage does not exist.' );
		} else {
			$log.debug( 'Attempted to remove ' + this.itemStorage.length + ' storage slots.' );
			this.itemStorage.splice( 0, this.itemStorage.length );
		}
	};
	Inventory.prototype.clearGearStorage = function() {
		//Various Errors preventing action;
		if( this.gearStorage === null ) {
			$log.error( 'ERROR: Cannot clear storage because storage does not exist.' );
		} else {
			$log.debug( 'Attempted to remove ' + this.gearStorage.length + ' storage slots.' );
			this.gearStorage.splice( 0, this.gearStorage.length );
		}
	};
	Inventory.prototype.initializeGearStorage = function() {
		//Completely empty storage array;
		if( this.gearStorage === null ) {
			$log.error( 'ERROR: Cannot clear gearStorage because storage does not exist.' );
		} else {
			$log.debug( 'Attempted to remove ' + this.gearStorage.length + ' gearStorage slots.' );
			this.gearStorage.splice( 0, this.gearStorage.length );
		}
		//Rebuild a new one!;
		var newSlot;
		while( this.gearStorage.length < 18 ) {
			newSlot = new ItemSlot();
			this.gearStorage.push( newSlot );
		}
	};
	Inventory.prototype.useItemInInventory = function( slotNum ) {
		MainView.clearOutput();
		if( CoC.player.itemSlots[ slotNum ].itype instanceof Useable ) {
			var item = CoC.player.itemSlots[ slotNum ].itype;
			if( item.canUse() ) { //If an item cannot be used then canUse should provide a description of why the item cannot be used
				CoC.player.itemSlots[ slotNum ].removeOneItem();
				this.useItem( item, CoC.player.itemSlots[ slotNum ] );
				return;
			}
		} else {
			EngineCore.outputText( 'You cannot use ' + CoC.player.itemSlots[ slotNum ].itype.longName + '!\n\n' );
		}
		this.itemGoNext(); //Normally returns to the inventory menu. In combat it goes to the inventoryCombatHandler function
	};
	Inventory.prototype.inventoryCombatHandler = function() {
		if( !Combat.combatRoundOver() ) { //Check if the battle is over. If not then go to the enemy's action.
			EngineCore.outputText( '\n\n' );
			Combat.enemyAI();
		}
	};
	Inventory.prototype.useItem = function( item, fromSlot ) {
		item.useText();
		if( item instanceof Armor ) {
			CoC.player.armor.removeText();
			item = CoC.player.setArmor( item ); //Item is now the player's old armor
			if( item === null ) {
				this.itemGoNext();
			} else {
				this.takeItem( item, this.callNext );
			}
		} else if( item instanceof Weapon ) {
			CoC.player.weapon.removeText();
			item = CoC.player.setWeapon( item ); //Item is now the player's old weapon
			if( item === null ) {
				this.itemGoNext();
			} else {
				this.takeItem( item, this.callNext );
			}
		} else {
			this.currentItemSlot = fromSlot;
			if( !item.useItem() ) {
				this.itemGoNext();
			} //Items should return true if they have provided some form of sub-EngineCore.menu.
			//This is used for Reducto and GroPlus (which always present the player with a sub-EngineCore.menu);
			//and for the Kitsune Gift (which may show a sub-EngineCore.menu if the player has a full inventory);
			//				if (!item.hasSubMenu()) this.itemGoNext(); //Don't call itemGoNext if there's a sub menu, otherwise it would never be displayed;
		}
	};
	Inventory.prototype.takeItemFull = function( itype, showUseNow, source ) {
		EngineCore.outputText( 'There is no room for ' + itype.longName + ' in your inventory.  You may replace the contents of a pouch with ' + itype.longName + ' or abandon it.' );
		EngineCore.menu();
		for( var x = 0; x < 5; x++ ) {
			if( CoC.player.itemSlots[ x ].unlocked ) {
				EngineCore.addButton( x, (CoC.player.itemSlots[ x ].itype.shortName + ' x' + CoC.player.itemSlots[ x ].quantity), EngineCore.createCallBackFunction2( this, this.replaceItem, itype, x ) );
			}
		}
		if( source !== null ) {
			this.currentItemSlot = source;
			EngineCore.addButton( 7, 'Put Back', null, EngineCore.createCallBackFunction2( this, this.returnItemToInventory, itype, false ) );
		}
		if( showUseNow && itype instanceof Useable ) {
			EngineCore.addButton( 8, 'Use Now', null, EngineCore.createCallBackFunction2( this, this.useItemNow, itype, source ) );
		}
		EngineCore.addButton( 9, 'Abandon', this, this.callOnAbandon ); //Does not doNext - immediately executes the callOnAbandon function
	};
	Inventory.prototype.useItemNow = function( item, source ) {
		MainView.clearOutput();
		if( item.canUse() ) { //If an item cannot be used then canUse should provide a description of why the item cannot be used
			this.useItem( item, source );
		} else {
			this.takeItemFull( item, false, source ); //Give the player another chance to take this item
		}
	};
	Inventory.prototype.replaceItem = function( itype, slotNum ) {
		MainView.clearOutput();
		if( CoC.player.itemSlots[ slotNum ].itype === itype ) {
			EngineCore.outputText( 'You discard ' + itype.longName + ' from the stack to make room for the new one.' );
		} else {
			if( CoC.player.itemSlots[ slotNum ].quantity === 1 ) {
				EngineCore.outputText( 'You throw away ' + CoC.player.itemSlots[ slotNum ].itype.longName + ' and replace it with ' + itype.longName + '.' );
			} else {
				EngineCore.outputText( 'You throw away ' + CoC.player.itemSlots[ slotNum ].itype.longName + '(x' + CoC.player.itemSlots[ slotNum ].quantity + ') and replace it with ' + itype.longName + '.' );
			}
			CoC.player.itemSlots[ slotNum ].setItemAndQty( itype, 1 );
		}
		this.itemGoNext();
	};
	Inventory.prototype.unequipWeapon = function() {
		MainView.clearOutput();
		this.takeItem( CoC.player.setWeapon( WeaponLib.FISTS ), this.inventoryMenu );
	};
	Inventory.prototype.armorRackDescription = function() {
		if( this.itemAnyInStorage( this.gearStorage, 9, 18 ) ) {
			var itemList = [];
			for( var x = 9; x < 18; x++ ) {
				if( this.gearStorage[ x ].quantity > 0 ) {
					itemList[ itemList.length ] = this.gearStorage[ x ].itype.longName;
				}
			}
			EngineCore.outputText( '  It currently holds ' + Utils.formatStringArray( itemList ) + '.' );
			return true;
		}
		return false;
	};
	Inventory.prototype.weaponRackDescription = function() {
		if( this.itemAnyInStorage( this.gearStorage, 0, 9 ) ) {
			var itemList = [];
			for( var x = 0; x < 9; x++ ) {
				if( this.gearStorage[ x ].quantity > 0 ) {
					itemList[ itemList.length ] = this.gearStorage[ x ].itype.longName;
				}
			}
			EngineCore.outputText( '  It currently holds ' + Utils.formatStringArray( itemList ) + '.' );
			return true;
		}
		return false;
	};
	Inventory.prototype.itemAnyInStorage = function( storage, startSlot, endSlot ) {
		for( var x = startSlot; x < endSlot; x++ ) {
			if( storage[ x ].quantity > 0 ) {
				return true;
			}
		}
		return false;
	};
	Inventory.prototype.itemTypeInStorage = function( storage, startSlot, endSlot, itype ) {
		for( var x = startSlot; x < endSlot; x++ ) {
			if( storage[ x ].quantity > 0 && storage[ x ].itype === itype ) {
				return true;
			}
		}
		return false;
	};
	Inventory.prototype.pickItemToTakeFromCampStorage = function() {
		this.callNext = this.pickItemToTakeFromCampStorage;
		this.pickItemToTakeFromStorage( this.itemStorage, 0, this.itemStorage.length, 'storage' );
	};
	Inventory.prototype.pickItemToTakeFromArmorRack = function() {
		this.callNext = this.pickItemToTakeFromArmorRack;
		this.pickItemToTakeFromStorage( this.gearStorage, 9, 18, 'rack' );
	};
	Inventory.prototype.pickItemToTakeFromWeaponRack = function() {
		this.callNext = this.pickItemToTakeFromWeaponRack;
		this.pickItemToTakeFromStorage( this.gearStorage, 0, 9, 'rack' );
	};
	Inventory.prototype.pickItemToTakeFromStorage = function( storage, startSlot, endSlot, text ) {
		MainView.clearOutput(); //Selects an item from a gear slot. Rewritten so that it no longer needs to use numbered events
		EngineCore.hideUpDown();
		if( !this.itemAnyInStorage( storage, startSlot, endSlot ) ) { //If no items are left then return to the camp menu. Can only happen if the player removes the last item.
			MainView.playerMenu();
			return;
		}
		EngineCore.outputText( 'What ' + text + ' slot do you wish to take an item from?' );
		var button = 0;
		EngineCore.menu();
		for( var x = startSlot; x < endSlot; x++, button++ ) {
			if( storage[ x ].quantity > 0 ) {
				EngineCore.addButton( button, (storage[ x ].itype.shortName + ' x' + storage[ x ].quantity), EngineCore.createCallBackFunction2( this, this.pickFrom, storage, x ) );
			}
		}
		EngineCore.addButton( 9, 'Back', this, this.stash );
	};
	Inventory.prototype.pickFrom = function( storage, slotNum ) {
		MainView.clearOutput();
		var itype = storage[ slotNum ].itype;
		storage[ slotNum ].quantity--;
		SceneLib.inventory.takeItem( itype, this.callNext, this.callNext, storage[ slotNum ] );
	};
	Inventory.prototype.pickItemToPlaceInCampStorage = function() {
		this.pickItemToPlaceInStorage( this.placeInCampStorage, this.allAcceptable, 'storage containers', false );
	};
	Inventory.prototype.pickItemToPlaceInArmorRack = function() {
		this.pickItemToPlaceInStorage( this.placeInArmorRack, this.armorAcceptable, 'armor rack', true );
	};
	Inventory.prototype.pickItemToPlaceInWeaponRack = function() {
		this.pickItemToPlaceInStorage( this.placeInWeaponRack, this.weaponAcceptable, 'weapon rack', true );
	};
	Inventory.prototype.allAcceptable = function() {
		return true;
	};
	Inventory.prototype.armorAcceptable = function( itype ) {
		return itype instanceof Armor;
	};
	Inventory.prototype.weaponAcceptable = function( itype ) {
		return itype instanceof Weapon;
	};
	Inventory.prototype.pickItemToPlaceInStorage = function( placeInStorageFunction, typeAcceptableFunction, text, showEmptyWarning ) {
		MainView.clearOutput(); //Selects an item to place in a gear slot. Rewritten so that it no longer needs to use numbered events
		EngineCore.hideUpDown();
		EngineCore.outputText( 'What item slot do you wish to empty into your ' + text + '?' );
		EngineCore.menu();
		var foundItem = false;
		for( var x = 0; x < 5; x++ ) {
			if( CoC.player.itemSlots[ x ].unlocked && CoC.player.itemSlots[ x ].quantity > 0 && typeAcceptableFunction( CoC.player.itemSlots[ x ].itype ) ) {
				EngineCore.addButton( x, (CoC.player.itemSlots[ x ].itype.shortName + ' x' + CoC.player.itemSlots[ x ].quantity), placeInStorageFunction, x );
				foundItem = true;
			}
		}
		if( showEmptyWarning && !foundItem ) {
			EngineCore.outputText( '\n<b>You have no appropriate items to put in this rack.</b>' );
		}
		EngineCore.addButton( 9, 'Back', this, this.stash );
	};
	Inventory.prototype.placeInCampStorage = function( slotNum ) {
		this.placeIn( this.itemStorage, 0, this.itemStorage.length, slotNum );
		EngineCore.doNext( this, this.pickItemToPlaceInCampStorage );
	};
	Inventory.prototype.placeInArmorRack = function( slotNum ) {
		this.placeIn( this.gearStorage, 9, 18, slotNum );
		EngineCore.doNext( this, this.pickItemToPlaceInArmorRack );
	};
	Inventory.prototype.placeInWeaponRack = function( slotNum ) {
		this.placeIn( this.gearStorage, 0, 9, slotNum );
		EngineCore.doNext( this, this.pickItemToPlaceInWeaponRack );
	};
	Inventory.prototype.placeIn = function( storage, startSlot, endSlot, slotNum ) {
		MainView.clearOutput();
		var x;
		var temp;
		var itype = CoC.player.itemSlots[ slotNum ].itype;
		var qty = CoC.player.itemSlots[ slotNum ].quantity;
		var orig = qty;
		CoC.player.itemSlots[ slotNum ].emptySlot();
		for( x = startSlot; x < endSlot && qty > 0; x++ ) { //Find any slots which already hold the item that is being stored
			if( storage[ x ].itype === itype && storage[ x ].quantity < 5 ) {
				temp = 5 - storage[ x ].quantity;
				if( qty < temp ) {
					temp = qty;
				}
				EngineCore.outputText( 'You add ' + temp + 'x ' + itype.shortName + ' into storage slot ' + Utils.num2Text( x + 1 - startSlot ) + '.\n' );
				storage[ x ].quantity += temp;
				qty -= temp;
				if( qty === 0 ) {
					return;
				}
			}
		}
		for( x = startSlot; x < endSlot && qty > 0; x++ ) { //Find any empty slots and put the item(s) there
			if( storage[ x ].quantity === 0 ) {
				storage[ x ].setItemAndQty( itype, qty );
				EngineCore.outputText( 'You place ' + qty + 'x ' + itype.shortName + ' into storage slot ' + Utils.num2Text( x + 1 - startSlot ) + '.\n' );
				qty = 0;
				return;
			}
		}
		EngineCore.outputText( 'There is no room for ' + (orig === qty ? '' : 'the remaining ') + qty + 'x ' + itype.shortName + '.  You leave ' + (qty > 1 ? 'them' : 'it') + ' in your inventory.\n' );
		CoC.player.itemSlots[ slotNum ].setItemAndQty( itype, qty );
	};
	SceneLib.registerScene( 'inventory', new Inventory() );
} );