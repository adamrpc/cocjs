'use strict';

angular.module( 'cocjs' ).factory( 'Saves', function( $rootScope, $log, Utils, Weapon, Armor, CockTypesEnum, EngineCore, MainView, EventParser, kFLAGS, Player, ItemType, DungeonCore, WeaponLib, ArmorLib, AppearanceDefs, InputManager ) {
	var SAVE_FILE_CURRENT_INTEGER_FORMAT_VERSION = 816;
	//Didn't want to include something like this, but an integer is safer than depending on the text version number from the CoC class.
	//Also, this way the save file version doesn't need updating unless an important structural change happens in the save file.
	function Saves( gameStateDirectGet, gameStateDirectSet, game ) {
		this.gameStateGet = gameStateDirectGet; //This is so that the save game functions (and nothing else) get direct access to the gameState variable
		this.gameStateSet = gameStateDirectSet;
		this.saveFileNames = [ 'CoC_1', 'CoC_2', 'CoC_3', 'CoC_4', 'CoC_5', 'CoC_6', 'CoC_7', 'CoC_8', 'CoC_9' ];
		this.versionProperties = [ 'legacy', '0.8.3f7', '0.8.3f8', '0.8.4.3', 'latest' ];
		this.savedGameDir = 'data/com.fenoxo.coc';
		this.game = game;
	}
	Saves.prototype.loadSaveDisplay = function( saveFile, slotName ) {
		var holding = '';
		if( saveFile.data.exists && saveFile.data.flags[ 2066 ] === undefined ) {
			if( saveFile.data.notes === undefined ) {
				saveFile.data.notes = 'No notes available.';
			}
			holding = slotName;
			holding += ':  <b>';
			holding += saveFile.data.short;
			holding += '</b> - <i>' + saveFile.data.notes + '</i>\r';
			holding += 'Days - ' + saveFile.data.days + '  Gender - ';
			if( saveFile.data.gender === 0 ) {
				holding += 'U';
			}
			if( saveFile.data.gender === 1 ) {
				holding += 'M';
			}
			if( saveFile.data.gender === 2 ) {
				holding += 'F';
			}
			if( saveFile.data.gender === 3 ) {
				holding += 'H';
			}
			holding += '\r';
			return holding;
		} else if( saveFile.data.exists && saveFile.data.flags[ 2066 ] !== undefined ) {
			return slotName + ' is a save file that has been created in a modified version of CoC.\r';
		} else {
			return slotName + '     \r';
		}
	};
	Saves.prototype.loadScreen = function() {
		var slots = [];
		EngineCore.outputText( '<b><u>Slot,  Game Days Played</u></b>\r', true );
		_.forEach( this.saveFileNames, function( saveFileName, index ) {
			var test = localStorage.getItem( saveFileName );
			EngineCore.outputText( this.loadSaveDisplay( test, index + 1 ), false );
			if( test && test.data && test.data.flags[ 2066 ] === undefined ) {
				slots.push( function() {
					$log.info( 'Loading save with name', saveFileName, 'at index', index );
					if( this.loadGame( saveFileName ) ) {
						EngineCore.doNext(  EventParser.playerMenu );
						EngineCore.showStats();
						EngineCore.statScreenRefresh();
						EngineCore.outputText( 'Slot ' + index + ' Loaded!', true );
					}
				} );
			} else {
				slots.push( null );  // You have to set the parameter to 0 to disable the button
			}
		} );
		EngineCore.choices( 'Slot 1', slots[ 0 ],
			'Slot 2', slots[ 1 ],
			'Slot 3', slots[ 2 ],
			'Slot 4', slots[ 3 ],
			'Slot 5', slots[ 4 ],
			'Slot 6', slots[ 5 ],
			'Slot 7', slots[ 6 ],
			'Slot 8', slots[ 7 ],
			'Slot 9', slots[ 8 ],
			'Back', this.returnToSaveMenu );
	};
	Saves.prototype.saveScreen = function() {
		MainView.nameBox.text = '';
		MainView.nameBox.visible = true;
		EngineCore.outputText( '', true );
		if( game.player.slotName !== 'VOID' ) {
			EngineCore.outputText( '<b>Last saved or loaded from : ' + game.player.slotName + '</b>\r\r', false );
		}
		EngineCore.outputText( '<b><u>Slot,  Game Days Played</u></b>\r', false );
		var saveFuncs = [];
		_.forEach( this.saveFileNames, function( saveFileName, index ) {
			var test = localStorage.getItem( saveFileName );
			EngineCore.outputText( this.loadSaveDisplay( test, index + 1 ), false );
			$log.info( 'Creating function with indice = ', index );
			saveFuncs.push( function() {
				$log.info( 'Saving game with name', saveFileName, 'at index', index );
				this.saveGame( saveFileName );
			} );
		} );
		if( game.player.slotName === 'VOID' ) {
			EngineCore.outputText( '\r\r', false );
		}
		EngineCore.outputText( '<b>Leave the notes box blank if you don\'t wish to change notes.\r<u>NOTES:</u></b>', false );
		EngineCore.choices( 'Slot 1', saveFuncs[ 0 ],
			'Slot 2', saveFuncs[ 1 ],
			'Slot 3', saveFuncs[ 2 ],
			'Slot 4', saveFuncs[ 3 ],
			'Slot 5', saveFuncs[ 4 ],
			'Slot 6', saveFuncs[ 5 ],
			'Slot 7', saveFuncs[ 6 ],
			'Slot 8', saveFuncs[ 7 ],
			'Slot 9', saveFuncs[ 8 ],
			'Back', this.returnToSaveMenu );
	};
	Saves.prototype.saveLoad = function( ) {
		//Hide the name box in case of backing up from save
		//screen so it doesnt overlap everything.
		MainView.nameBox.visible = false;
		EngineCore.outputText( '', true );
		// TODO : Change that text
		EngineCore.outputText( '<b>Where are my saves located?</b>\n', false );
		EngineCore.outputText( '<i>In Windows Vista/7 (IE/FireFox/Other) Player/#Shared Objects/{GIBBERISH}/</pre>\n\n', false );
		EngineCore.outputText( 'In Windows Vista/7 (Chrome) Data/Default/Pepper Data/Shockwave Flash/WritableRoot/#SharedObjects/{GIBBERISH}/</pre>\n\n', false );
		EngineCore.outputText( 'Inside that folder it will saved in a folder corresponding to where it was played from.  If you saved the CoC.swf to your HDD, then it will be in a folder called localhost.  If you played from my website, it will be in fenoxo.com.  The save files will be labelled CoC_1.sol, CoC_2.sol, CoC_3.sol, etc.</i>\n\n', false );
		EngineCore.outputText( '<b>Why do my saves disappear all the time?</b>\n<i>There are numerous things that will wipe out flash local shared files.  If your browser or player is set to delete flash cookies or data, that will do it.  CCleaner will also remove them.  CoC or its updates will never remove your savegames - if they disappear something else is wiping them out.</i>\n\n', false );
		EngineCore.outputText( '<b>When I play from my HDD I have one set of saves, and when I play off your site I have a different set of saves.  Why?</b>\n<i>Flash stores saved data relative to where it was accessed from.  Playing from your HDD will store things in a different location than fenoxo.com or FurAffinity.</i>\n', false );
		EngineCore.outputText( '<i>If you want to be absolutely sure you don\'t lose a character, copy the .sol file for that slot out and back it up! <b>For more information, google flash shared objects.</b></i>\n\n', false );
		EngineCore.outputText( '<b>Why does the Save File and Load File option not work?</b>\n' );
		EngineCore.outputText( '<i>Save File and Load File are limited by the security settings imposed upon CoC by Flash. These options will only work if you have downloaded the game from the website, and are running it from your HDD. Additionally, they can only correctly save files to and load files from the directory where you have the game saved.</i>' );
		//This is to clear the 'game over' block from stopping EngineCore.choices from working.  Loading games supercede's game over.
		if( MainView.getButtonText( 0 ) === 'Game Over' ) {
			MainView.setButtonText( 0, 'save/load' );
			EngineCore.menu();
			EngineCore.addButton( 1, 'Load', this.loadScreen );
			EngineCore.addButton( 2, '', null ); // TODO : Save to file
			EngineCore.addButton( 3, 'Delete', this.deleteScreen );
			EngineCore.addButton( 4, 'Back', game.gameOver, true );
			return;
		}
		if( game.player.str === 0 ) {
			// TODO : Save to file
			EngineCore.choices( '', null, 'Load', this.loadScreen, '', null, 'Delete', this.deleteScreen, 'Back', $rootScope.StartUp.mainMenu );
			return;
		}
		if( DungeonCore.isInDungeon() ) {
			// TODO : Save to file
			EngineCore.choices( '', null, 'Load', this.loadScreen, '', null, 'Delete', this.deleteScreen, 'Back', EventParser.playerMenu );
			return;
		}
		if( this.gameStateGet() === 3 ) {
			EngineCore.choices( 'Save', this.saveScreen,
				'Load', this.loadScreen,
				'', null, // TODO : Save to file
				'Delete', this.deleteScreen,
				'Back', null,
				'', null, // TODO : Save to file
				'', null, // TODO : Save to file
				'', null,
				'', null,
				'', null );
		} else {
			if( game.player.autoSave ) {
				EngineCore.choices( 'Save', this.saveScreen,
					'Load', this.loadScreen,
					'AutoSav: ON', this.autosaveToggle,
					'Delete', this.deleteScreen,
					'', null,
					'', null, // TODO : Save to file
					'', null, // TODO : Save to file
					'', null,
					'', null,
					'Back', EventParser.playerMenu );
			} else {
				EngineCore.choices( 'Save', this.saveScreen,
					'Load', this.loadScreen,
					'AutoSav: OFF', this.autosaveToggle,
					'Delete', this.deleteScreen,
					'', null,
					'', null, // TODO : Save to file
					'', null, // TODO : Save to file
					'', null,
					'', null,
					'Back', EventParser.playerMenu );
			}
		}
	};
	Saves.prototype.autosaveToggle = function() {
		game.player.autoSave = !game.player.autoSave;
		this.saveLoad();
	};
	Saves.prototype.deleteScreen = function() {
		EngineCore.outputText( 'Slot,  Race,  Sex,  Game Days Played\n', true );
		var delFuncs = [];
		_.forEach( this.saveFileNames, function( saveFileName, index ) {
			var test = localStorage.getItem( saveFileName );
			EngineCore.outputText( this.loadSaveDisplay( test, index + 1 ), false );
			$log.info( 'Creating function with indice = ', index );
			delFuncs.push( function() {
				game.flags[ kFLAGS.TEMP_STORAGE_SAVE_DELETION ] = saveFileName;
				this.confirmDelete();
			} );
		} );
		EngineCore.outputText( '\n<b>ONCE DELETED, YOUR SAVE IS GONE FOREVER.</b>', false );
		EngineCore.choices( 'Slot 1', delFuncs[ 0 ],
			'Slot 2', delFuncs[ 1 ],
			'Slot 3', delFuncs[ 2 ],
			'Slot 4', delFuncs[ 3 ],
			'Slot 5', delFuncs[ 4 ],
			'Slot 6', delFuncs[ 5 ],
			'Slot 7', delFuncs[ 6 ],
			'Slot 8', delFuncs[ 7 ],
			'Slot 9', delFuncs[ 8 ],
			'Back', this.returnToSaveMenu );
	};
	Saves.prototype.confirmDelete = function() {
		EngineCore.outputText( 'You are about to delete the following save: <b>' + game.flags[ kFLAGS.TEMP_STORAGE_SAVE_DELETION ] + '</b>\n\nAre you sure you want to delete it?', true );
		EngineCore.choices( 'No', this.deleteScreen, 'Yes', this.purgeTheMutant, '', null, '', null, '', null );
	};
	Saves.prototype.purgeTheMutant = function() {
		localStorage.removeItem( game.flags[ kFLAGS.TEMP_STORAGE_SAVE_DELETION ] );
		$log.info( 'DELETING SLOT: ' + game.flags[ kFLAGS.TEMP_STORAGE_SAVE_DELETION ] );
		var blah = [ 'been virus bombed', 'been purged', 'been vaped', 'been nuked from orbit', 'taken an arrow to the knee', 'fallen on its sword', 'lost its reality matrix cohesion', 'been cleansed', 'suffered the following error) Porn Not Found' ];
		$log.debug( blah.length + ' array slots' );
		var select = Utils.rand( blah.length );
		EngineCore.outputText( game.flags[ kFLAGS.TEMP_STORAGE_SAVE_DELETION ] + ' has ' + blah[ select ] + '.', true );
		EngineCore.doNext( this.deleteScreen );
	};
	Saves.prototype.saveGame = function( slot ) {
		game.player.slotName = slot;
		this.saveGameObject( slot, false );
	};
	Saves.prototype.loadGame = function( slot ) {
		var saveFile = localStorage.getItem( slot );
		if(!saveFile) {
			$log.error('Save ' + slot + ' does not exists, unable to load.');
			EngineCore.outputText( '<b>Aborting load. The requested save does not exists.</b>\n\n', true );
			return;
		}
		// I want to be able to write some debug stuff to the GUI during the loading process
		// Therefore, we clear the display *before* calling loadGameObject
		EngineCore.outputText( '', true );
		this.loadGameObject( saveFile, slot );
		EngineCore.outputText( 'Game Loaded' );
		EngineCore.statScreenRefresh();
		if( game.player.slotName === 'VOID' ) {
			$log.info( 'Setting in-use save slot to: ' + slot );
			game.player.slotName = slot;
		}
		EngineCore.doNext(  EventParser.playerMenu );
	};
	/*
	 OH GOD SOMEONE FIX THIS DISASTER!!!!111one1ONE!
	 */
	//FURNITURE'S JUNK
	Saves.prototype.saveGameObject = function( slot, isFile ) {
		//Autosave stuff
		if( game.player.slotName !== 'VOID' ) {
			game.player.slotName = slot;
		}
		CoC.saveAllAwareClasses( game ); //Informs each saveAwareClass that it must save its values in the flags array
		//Initialize the save file
		var saveFile = {data: {}};
		//Set a single variable that tells us if this save exists
		saveFile.data.exists = true;
		saveFile.data.version = game.ver;
		game.flags[ kFLAGS.SAVE_FILE_INTEGER_FORMAT_VERSION ] = SAVE_FILE_CURRENT_INTEGER_FORMAT_VERSION;
		//CLEAR OLD ARRAYS
		//Save sum dataz
		$log.debug( 'SAVE DATAZ' );
		saveFile.data.short = game.player.short;
		saveFile.data.a = game.player.a;
		//Notes
		if( MainView.nameBox.text !== '' ) {
			saveFile.data.notes = MainView.nameBox.text;
			game.notes = MainView.nameBox.text;
		} else {
			saveFile.data.notes = game.notes;
		}
		MainView.nameBox.visible = false;
		var processingError = false;
		var dataError = null;
		try {
			//flags
			saveFile.data.flags = {};
			_.forOwn(game.flags, function(value, key) {
				if(value !== 0) {
					saveFile.data.flags[key] = value;
				}
			});
			//CLOTHING/ARMOR
			saveFile.data.armorId = game.player.armor.id;
			saveFile.data.weaponId = game.player.weapon.id;
			saveFile.data.armorName = game.player.modArmorName;
			//PIERCINGS
			saveFile.data.nipplesPierced = game.player.nipplesPierced;
			saveFile.data.nipplesPShort = game.player.nipplesPShort;
			saveFile.data.nipplesPLong = game.player.nipplesPLong;
			saveFile.data.lipPierced = game.player.lipPierced;
			saveFile.data.lipPShort = game.player.lipPShort;
			saveFile.data.lipPLong = game.player.lipPLong;
			saveFile.data.tonguePierced = game.player.tonguePierced;
			saveFile.data.tonguePShort = game.player.tonguePShort;
			saveFile.data.tonguePLong = game.player.tonguePLong;
			saveFile.data.eyebrowPierced = game.player.eyebrowPierced;
			saveFile.data.eyebrowPShort = game.player.eyebrowPShort;
			saveFile.data.eyebrowPLong = game.player.eyebrowPLong;
			saveFile.data.earsPierced = game.player.earsPierced;
			saveFile.data.earsPShort = game.player.earsPShort;
			saveFile.data.earsPLong = game.player.earsPLong;
			saveFile.data.nosePierced = game.player.nosePierced;
			saveFile.data.nosePShort = game.player.nosePShort;
			saveFile.data.nosePLong = game.player.nosePLong;
			//MAIN STATS
			saveFile.data.str = game.player.str;
			saveFile.data.tou = game.player.tou;
			saveFile.data.spe = game.player.spe;
			saveFile.data.inte = game.player.inte;
			saveFile.data.lib = game.player.lib;
			saveFile.data.sens = game.player.sens;
			saveFile.data.cor = game.player.cor;
			saveFile.data.fatigue = game.player.fatigue;
			//Combat STATS
			saveFile.data.HP = game.player.HP;
			saveFile.data.lust = game.player.lust;
			saveFile.data.teaseLevel = game.player.teaseLevel;
			saveFile.data.teaseXP = game.player.teaseXP;
			//LEVEL STATS
			saveFile.data.XP = game.player.XP;
			saveFile.data.level = game.player.level;
			saveFile.data.gems = game.player.gems;
			saveFile.data.perkPoints = game.player.perkPoints;
			//Appearance
			saveFile.data.gender = game.player.gender;
			saveFile.data.femininity = game.player.femininity;
			saveFile.data.thickness = game.player.thickness;
			saveFile.data.tone = game.player.tone;
			saveFile.data.tallness = game.player.tallness;
			saveFile.data.hairColor = game.player.hairColor;
			saveFile.data.hairType = game.player.hairType;
			saveFile.data.gills = game.player.gills;
			saveFile.data.armType = game.player.armType;
			saveFile.data.hairLength = game.player.hairLength;
			saveFile.data.beardLength = game.player.beardLength;
			saveFile.data.eyeType = game.player.eyeType;
			saveFile.data.beardStyle = game.player.beardStyle;
			saveFile.data.skinType = game.player.skinType;
			saveFile.data.skinTone = game.player.skinTone;
			saveFile.data.skinDesc = game.player.skinDesc;
			saveFile.data.skinAdj = game.player.skinAdj;
			saveFile.data.faceType = game.player.faceType;
			saveFile.data.tongueType = game.player.tongueType;
			saveFile.data.earType = game.player.earType;
			saveFile.data.earValue = game.player.earValue;
			saveFile.data.antennae = game.player.antennae;
			saveFile.data.horns = game.player.horns;
			saveFile.data.hornType = game.player.hornType;
			saveFile.data.wingDesc = game.player.wingDesc;
			saveFile.data.wingType = game.player.wingType;
			saveFile.data.lowerBody = game.player.lowerBody;
			saveFile.data.tailType = game.player.tailType;
			saveFile.data.tailVenum = game.player.tailVenom;
			saveFile.data.tailRecharge = game.player.tailRecharge;
			saveFile.data.hipRating = game.player.hipRating;
			saveFile.data.buttRating = game.player.buttRating;
			//Sexual Stuff
			saveFile.data.balls = game.player.balls;
			saveFile.data.cumMultiplier = game.player.cumMultiplier;
			saveFile.data.ballSize = game.player.ballSize;
			saveFile.data.hoursSinceCum = game.player.hoursSinceCum;
			saveFile.data.fertility = game.player.fertility;
			saveFile.data.clitLength = game.player.clitLength;
			//Preggo stuff
			saveFile.data.pregnancyIncubation = game.player.pregnancyIncubation;
			saveFile.data.pregnancyType = game.player.pregnancyType;
			saveFile.data.buttPregnancyIncubation = game.player.buttPregnancyIncubation;
			saveFile.data.buttPregnancyType = game.player.buttPregnancyType;
			saveFile.data.cocks = angular.copy(game.player.cocks);
			saveFile.data.vaginas = angular.copy(game.player.vaginas);
			saveFile.data.breastRows = angular.copy(game.player.breastRows);
			saveFile.data.perks = angular.copy(game.player.perks);
			saveFile.data.statusAffects = angular.copy(game.player.statusAffects);
			saveFile.data.ass = angular.copy(game.player.ass);
			saveFile.data.keyItems = angular.copy(game.player.keyItems);
			saveFile.data.itemStorage = angular.copy(game.inventory.itemStorage);
			saveFile.data.gearStorage = angular.copy(game.inventory.gearStorage);
			//NIPPLES
			saveFile.data.nippleLength = game.player.nippleLength;
			//EXPLORED
			saveFile.data.exploredLake = game.player.exploredLake;
			saveFile.data.exploredMountain = game.player.exploredMountain;
			saveFile.data.exploredForest = game.player.exploredForest;
			saveFile.data.exploredDesert = game.player.exploredDesert;
			saveFile.data.explored = game.player.explored;
			saveFile.data.foundForest = game.foundForest;
			saveFile.data.foundDesert = game.foundDesert;
			saveFile.data.foundMountain = game.foundMountain;
			saveFile.data.foundLake = game.foundLake;
			saveFile.data.gameState = this.gameStateGet();
			//Time and Items
			saveFile.data.hours = game.time.hours;
			saveFile.data.days = game.time.days;
			saveFile.data.autoSave = game.player.autoSave;
			//PLOTZ
			saveFile.data.whitney = game.whitney;
			saveFile.data.monk = game.monk;
			saveFile.data.sand = game.sand;
			saveFile.data.giacomo = game.giacomo;
			//ITEMZ. Item1s
			saveFile.data.itemSlot1 = angular.copy(game.player.itemSlot1);
			saveFile.data.itemSlot2 = angular.copy(game.player.itemSlot2);
			saveFile.data.itemSlot3 = angular.copy(game.player.itemSlot3);
			saveFile.data.itemSlot4 = angular.copy(game.player.itemSlot4);
			saveFile.data.itemSlot5 = angular.copy(game.player.itemSlot5);
			// Keybinds
			saveFile.data.controls = InputManager.SaveBindsToObj();
		} catch( error ) {
			processingError = true;
			dataError = error;
			$log.error( error.message );
		}
		$log.debug( 'done saving' );
		if( isFile && !processingError ) {
			/*
			TODO : Save to file
			*/
			EngineCore.outputText( 'Attempted to save to file.', true );
		} else if( !processingError ) {
			// Write the file
			localStorage.setItem( slot, JSON.stringify(saveFile) );
			EngineCore.outputText( 'Saved to slot' + slot + '!', true );
		} else {
			EngineCore.outputText( 'There was a processing error during saving. Please report the following message:\n\n' );
			EngineCore.outputText( dataError.message );
			EngineCore.outputText( '\n\n' );
			EngineCore.outputText( dataError.getStackTrace() );
		}
		EngineCore.doNext(  EventParser.playerMenu );
	};
	Saves.prototype.returnToSaveMenu = Saves.prototype.saveLoad;
	Saves.prototype.loadGameObject = function( saveData, slot ) {
		// TODO : We may have to reinstanciate complex objects, this has to be tested
		if( slot === undefined ) {
			slot = 'VOID';
		}
		var game = game;
		game.dungeonLoc = 0;
		game.inRoomedDungeon = false;
		game.inRoomedDungeonResume = null;
		//Autosave stuff
		game.player.slotName = slot;
		$log.info( 'Loading save!' );
		//Initialize the save file
		var saveFile = saveData;
		if( saveFile.data ) {
			//KILL ALL COCKS;
			game.player = new Player();
			game.flags = {};
			game.inventory.clearStorage();
			game.inventory.clearGearStorage();
			game.player.short = saveFile.data.short;
			game.player.a = saveFile.data.a;
			game.notes = saveFile.data.notes;
			_.forOwn(saveFile.data, function(value, key) {
				if( value !== undefined ) {
					game.flags[key] = value;
				}
			});
			//PIERCINGS
			game.player.nipplesPierced = saveFile.data.nipplesPierced;
			game.player.nipplesPShort = saveFile.data.nipplesPShort;
			game.player.nipplesPLong = saveFile.data.nipplesPLong;
			game.player.lipPierced = saveFile.data.lipPierced;
			game.player.lipPShort = saveFile.data.lipPShort;
			game.player.lipPLong = saveFile.data.lipPLong;
			game.player.tonguePierced = saveFile.data.tonguePierced;
			game.player.tonguePShort = saveFile.data.tonguePShort;
			game.player.tonguePLong = saveFile.data.tonguePLong;
			game.player.eyebrowPierced = saveFile.data.eyebrowPierced;
			game.player.eyebrowPShort = saveFile.data.eyebrowPShort;
			game.player.eyebrowPLong = saveFile.data.eyebrowPLong;
			game.player.earsPierced = saveFile.data.earsPierced;
			game.player.earsPShort = saveFile.data.earsPShort;
			game.player.earsPLong = saveFile.data.earsPLong;
			game.player.nosePierced = saveFile.data.nosePierced;
			game.player.nosePShort = saveFile.data.nosePShort;
			game.player.nosePLong = saveFile.data.nosePLong;
			//MAIN STATS
			game.player.str = saveFile.data.str;
			game.player.tou = saveFile.data.tou;
			game.player.spe = saveFile.data.spe;
			game.player.inte = saveFile.data.inte;
			game.player.lib = saveFile.data.lib;
			game.player.sens = saveFile.data.sens;
			game.player.cor = saveFile.data.cor;
			game.player.fatigue = saveFile.data.fatigue;
			//CLOTHING/ARMOR
			game.player.setWeaponHiddenField( ItemType.lookupItem( saveFile.data.weaponId ) || WeaponLib.FISTS );
			game.player.setArmorHiddenField( ItemType.lookupItem( saveFile.data.armorId ) || ArmorLib.COMFORTABLE_UNDERCLOTHES );
			if( game.player.armor.name !== saveFile.data.armorName ) {
				game.player.modArmorName = saveFile.data.armorName;
			}
			//Combat STATS
			game.player.HP = saveFile.data.HP;
			game.player.lust = saveFile.data.lust;
			game.player.teaseXP = saveFile.data.teaseXP ? saveFile.data.teaseXP : 0;
			game.player.teaseLevel = saveFile.data.teaseLevel ? saveFile.data.teaseLevel : 0;
			//LEVEL STATS
			game.player.XP = saveFile.data.XP;
			game.player.level = saveFile.data.level;
			game.player.gems = saveFile.data.gems;
			game.player.perkPoints = saveFile.data.perkPoints ? saveFile.data.perkPoints : 0;
			//Appearance
			game.player.gender = saveFile.data.gender;
			game.player.femininity = saveFile.data.femininity !== undefined ? saveFile.data.femininity : 50;
			game.player.eyeType = saveFile.data.eyeType !== undefined ? saveFile.data.eyeType : AppearanceDefs.EYES_HUMAN;
			game.player.beardLength = saveFile.data.beardLength ? saveFile.data.beardLength : 0;
			game.player.beardStyle = saveFile.data.beardStyle ? saveFile.data.beardStyle : 0;
			game.player.tone = saveFile.data.tone !== undefined ? saveFile.data.tone : 50;
			game.player.thickness = saveFile.data.thickness !== undefined ? saveFile.data.thickness : 50;
			game.player.tallness = saveFile.data.tallness;
			game.player.hairColor = saveFile.data.hairColor;
			game.player.hairType = saveFile.data.hairType ? saveFile.data.hairType : 0;
			game.player.gills = saveFile.data.gills ? saveFile.data.gills : false;
			game.player.armType = saveFile.data.armType !== undefined ? saveFile.data.armType : AppearanceDefs.ARM_TYPE_HUMAN;
			game.player.hairLength = saveFile.data.hairLength;
			game.player.skinType = saveFile.data.skinType;
			game.player.skinAdj = saveFile.data.skinAdj !== undefined ? saveFile.data.skinAdj : '';
			game.player.skinTone = saveFile.data.skinTone;
			game.player.skinDesc = saveFile.data.skinDesc;
			game.player.faceType = saveFile.data.faceType;
			game.player.tongueType = saveFile.data.tongueType !== undefined ? saveFile.data.tongueType : AppearanceDefs.TONUGE_HUMAN;
			game.player.earType = saveFile.data.earType !== undefined ? saveFile.data.earType : AppearanceDefs.EARS_HUMAN;
			game.player.earValue = saveFile.data.earValue ? saveFile.data.earValue : 0;
			game.player.antennae = saveFile.data.antennae !== undefined ? saveFile.data.antennae : AppearanceDefs.ANTENNAE_NONE;
			game.player.horns = saveFile.data.horns;
			game.player.hornType = saveFile.data.hornType !== undefined ? saveFile.data.hornType : AppearanceDefs.HORNS_NONE;
			game.player.wingDesc = saveFile.data.wingDesc;
			game.player.wingType = saveFile.data.wingType;
			game.player.lowerBody = saveFile.data.lowerBody;
			game.player.tailType = saveFile.data.tailType;
			game.player.tailVenom = saveFile.data.tailVenum;
			game.player.tailRecharge = saveFile.data.tailRecharge;
			game.player.hipRating = saveFile.data.hipRating;
			game.player.buttRating = saveFile.data.buttRating;
			//Sexual Stuff
			game.player.balls = saveFile.data.balls;
			game.player.cumMultiplier = saveFile.data.cumMultiplier;
			game.player.ballSize = saveFile.data.ballSize;
			game.player.hoursSinceCum = saveFile.data.hoursSinceCum;
			game.player.fertility = saveFile.data.fertility;
			game.player.clitLength = saveFile.data.clitLength;
			//Preggo stuff
			game.player.knockUpForce( saveFile.data.pregnancyType, saveFile.data.pregnancyIncubation );
			game.player.buttKnockUpForce( saveFile.data.buttPregnancyType, saveFile.data.buttPregnancyIncubation );
			game.player.cocks = angular.copy(saveFile.data.cocks);
			game.player.vaginas = angular.copy(saveFile.data.vaginas);
			//NIPPLES
			game.player.nippleLength = saveFile.data.nippleLength !== undefined ? saveFile.data.nippleLength : 0.25;
			game.player.breastRows = angular.copy(saveFile.data.breastRows);
			game.player.perks = angular.copy(saveFile.data.perks);
			if( game.flags[ kFLAGS.FOLLOWER_AT_FARM_MARBLE ] === 1 ) {
				game.flags[ kFLAGS.FOLLOWER_AT_FARM_MARBLE ] = 0;
				$log.debug( 'Force-reverting Marble At Farm flag to 0.' );
			}
			game.player.statusAffects = angular.copy(saveFile.data.statusAffects);
			game.player.keyItems = angular.copy(saveFile.data.keyItems);
			//Set storage slot array
			//Populate storage slot array
			game.inventory.itemStorage = angular.copy(saveFile.data.itemStorage);
			game.inventory.gearStorage = angular.copy(saveFile.data.gearStorage);
			game.player.ass.analLooseness = saveFile.data.ass.analLooseness;
			game.player.ass.analWetness = saveFile.data.ass.analWetness;
			game.player.ass.fullness = saveFile.data.ass.fullness;
			//Shit
			this.gameStateSet( saveFile.data.gameState );
			game.player.exploredLake = saveFile.data.exploredLake;
			game.player.exploredMountain = saveFile.data.exploredMountain;
			game.player.exploredForest = saveFile.data.exploredForest;
			game.player.exploredDesert = saveFile.data.exploredDesert;
			game.player.explored = saveFile.data.explored;
			game.foundForest = saveFile.data.foundForest;
			game.foundDesert = saveFile.data.foundDesert;
			game.foundMountain = saveFile.data.foundMountain;
			game.foundLake = saveFile.data.foundLake;
			//Days
			//Time and Items
			game.time.hours = saveFile.data.hours;
			game.time.days = saveFile.data.days;
			game.player.autoSave = saveFile.data.autoSave !== undefined ? saveFile.data.autoSave : false;
			//PLOTZ
			game.whitney = saveFile.data.whitney;
			game.monk = saveFile.data.monk;
			game.sand = saveFile.data.sand;
			game.player.giacomo = saveFile.data.giacomo !== undefined ? saveFile.data.giacomo : 0;
			//The flag will be zero for any older save that still uses beeProgress and newer saves always store a zero in beeProgress, so we only need to update the flag on a value of one.
			//ITEMZ. Item1
			game.player.itemSlot1 = angular.copy(saveFile.data.itemSlot1);
			game.player.itemSlot2 = angular.copy(saveFile.data.itemSlot2);
			game.player.itemSlot3 = angular.copy(saveFile.data.itemSlot3);
			game.player.itemSlot4 = angular.copy(saveFile.data.itemSlot4);
			game.player.itemSlot5 = angular.copy(saveFile.data.itemSlot5);
			CoC.loadAllAwareClasses( game ); //Informs each saveAwareClass that it must load its values from the game.flags array
			// Control Bindings
			if( saveFile.data.controls !== undefined ) {
				InputManager.LoadBindsFromObj( saveFile.data.controls );
			}
			EngineCore.doNext(  EventParser.playerMenu );
		}
	};
	return Saves;
});