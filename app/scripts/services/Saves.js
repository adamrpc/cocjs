'use strict';

angular.module( 'cocjs' ).factory( 'Saves', function( $log, CoC, Utils, Weapon, Armor, CockTypesEnum, EngineCore, MainView, StartUp, EventParser, kFLAGS, Player, ItemType, DungeonCore, WeaponLib, ArmorLib, AppearanceDefs ) {
	var SAVE_FILE_CURRENT_INTEGER_FORMAT_VERSION = 816;
	//Didn't want to include something like this, but an integer is safer than depending on the text version number from the CoC class.
	//Also, this way the save file version doesn't need updating unless an important structural change happens in the save file.
	function Saves( gameStateDirectGet, gameStateDirectSet ) {
		this.gameStateGet = gameStateDirectGet; //This is so that the save game functions (and nothing else) get direct access to the gameState variable
		this.gameStateSet = gameStateDirectSet;
		this.saveFileNames = [ 'CoC_1', 'CoC_2', 'CoC_3', 'CoC_4', 'CoC_5', 'CoC_6', 'CoC_7', 'CoC_8', 'CoC_9' ];
		this.versionProperties = [ 'legacy', '0.8.3f7', '0.8.3f8', '0.8.4.3', 'latest' ];
		this.savedGameDir = 'data/com.fenoxo.coc';
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
		if( CoC.getInstance().player.slotName !== 'VOID' ) {
			EngineCore.outputText( '<b>Last saved or loaded from : ' + CoC.getInstance().player.slotName + '</b>\r\r', false );
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
		if( CoC.getInstance().player.slotName === 'VOID' ) {
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
			EngineCore.addButton( 4, 'Back', CoC.getInstance().gameOver, true );
			return;
		}
		if( CoC.getInstance().player.str === 0 ) {
			// TODO : Save to file
			EngineCore.choices( '', null, 'Load', this.loadScreen, '', null, 'Delete', this.deleteScreen, 'Back', StartUp.mainMenu );
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
			if( CoC.getInstance().player.autoSave ) {
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
		CoC.getInstance().player.autoSave = !CoC.getInstance().player.autoSave;
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
				CoC.getInstance().flags[ kFLAGS.TEMP_STORAGE_SAVE_DELETION ] = saveFileName;
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
		EngineCore.outputText( 'You are about to delete the following save: <b>' + CoC.getInstance().flags[ kFLAGS.TEMP_STORAGE_SAVE_DELETION ] + '</b>\n\nAre you sure you want to delete it?', true );
		EngineCore.choices( 'No', this.deleteScreen, 'Yes', this.purgeTheMutant, '', null, '', null, '', null );
	};
	Saves.prototype.purgeTheMutant = function() {
		localStorage.removeItem( CoC.getInstance().flags[ kFLAGS.TEMP_STORAGE_SAVE_DELETION ] );
		$log.info( 'DELETING SLOT: ' + CoC.getInstance().flags[ kFLAGS.TEMP_STORAGE_SAVE_DELETION ] );
		var blah = [ 'been virus bombed', 'been purged', 'been vaped', 'been nuked from orbit', 'taken an arrow to the knee', 'fallen on its sword', 'lost its reality matrix cohesion', 'been cleansed', 'suffered the following error) Porn Not Found' ];
		$log.debug( blah.length + ' array slots' );
		var select = Utils.rand( blah.length );
		EngineCore.outputText( CoC.getInstance().flags[ kFLAGS.TEMP_STORAGE_SAVE_DELETION ] + ' has ' + blah[ select ] + '.', true );
		EngineCore.doNext( this.deleteScreen );
	};
	Saves.prototype.saveGame = function( slot ) {
		CoC.getInstance().player.slotName = slot;
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
		if( CoC.getInstance().player.slotName === 'VOID' ) {
			$log.info( 'Setting in-use save slot to: ' + slot );
			CoC.getInstance().player.slotName = slot;
		}
		EngineCore.doNext(  EventParser.playerMenu );
	};
	/*
	 OH GOD SOMEONE FIX THIS DISASTER!!!!111one1ONE!
	 */
	//FURNITURE'S JUNK
	Saves.prototype.saveGameObject = function( slot, isFile ) {
		//Autosave stuff
		if( CoC.getInstance().player.slotName !== 'VOID' ) {
			CoC.getInstance().player.slotName = slot;
		}
		CoC.saveAllAwareClasses( CoC.getInstance() ); //Informs each saveAwareClass that it must save its values in the flags array
		//Initialize the save file
		var saveFile = {data: {}};
		//Set a single variable that tells us if this save exists
		saveFile.data.exists = true;
		saveFile.data.version = CoC.getInstance().ver;
		CoC.getInstance().flags[ kFLAGS.SAVE_FILE_INTEGER_FORMAT_VERSION ] = SAVE_FILE_CURRENT_INTEGER_FORMAT_VERSION;
		//CLEAR OLD ARRAYS
		//Save sum dataz
		$log.debug( 'SAVE DATAZ' );
		saveFile.data.short = CoC.getInstance().player.short;
		saveFile.data.a = CoC.getInstance().player.a;
		//Notes
		if( MainView.nameBox.text !== '' ) {
			saveFile.data.notes = MainView.nameBox.text;
			CoC.getInstance().notes = MainView.nameBox.text;
		} else {
			saveFile.data.notes = CoC.getInstance().notes;
		}
		MainView.nameBox.visible = false;
		var processingError = false;
		var dataError = null;
		try {
			//flags
			saveFile.data.flags = {};
			_.forOwn(CoC.getInstance().flags, function(value, key) {
				if(value !== 0) {
					saveFile.data.flags[key] = value;
				}
			});
			//CLOTHING/ARMOR
			saveFile.data.armorId = CoC.getInstance().player.armor.id;
			saveFile.data.weaponId = CoC.getInstance().player.weapon.id;
			saveFile.data.armorName = CoC.getInstance().player.modArmorName;
			//PIERCINGS
			saveFile.data.nipplesPierced = CoC.getInstance().player.nipplesPierced;
			saveFile.data.nipplesPShort = CoC.getInstance().player.nipplesPShort;
			saveFile.data.nipplesPLong = CoC.getInstance().player.nipplesPLong;
			saveFile.data.lipPierced = CoC.getInstance().player.lipPierced;
			saveFile.data.lipPShort = CoC.getInstance().player.lipPShort;
			saveFile.data.lipPLong = CoC.getInstance().player.lipPLong;
			saveFile.data.tonguePierced = CoC.getInstance().player.tonguePierced;
			saveFile.data.tonguePShort = CoC.getInstance().player.tonguePShort;
			saveFile.data.tonguePLong = CoC.getInstance().player.tonguePLong;
			saveFile.data.eyebrowPierced = CoC.getInstance().player.eyebrowPierced;
			saveFile.data.eyebrowPShort = CoC.getInstance().player.eyebrowPShort;
			saveFile.data.eyebrowPLong = CoC.getInstance().player.eyebrowPLong;
			saveFile.data.earsPierced = CoC.getInstance().player.earsPierced;
			saveFile.data.earsPShort = CoC.getInstance().player.earsPShort;
			saveFile.data.earsPLong = CoC.getInstance().player.earsPLong;
			saveFile.data.nosePierced = CoC.getInstance().player.nosePierced;
			saveFile.data.nosePShort = CoC.getInstance().player.nosePShort;
			saveFile.data.nosePLong = CoC.getInstance().player.nosePLong;
			//MAIN STATS
			saveFile.data.str = CoC.getInstance().player.str;
			saveFile.data.tou = CoC.getInstance().player.tou;
			saveFile.data.spe = CoC.getInstance().player.spe;
			saveFile.data.inte = CoC.getInstance().player.inte;
			saveFile.data.lib = CoC.getInstance().player.lib;
			saveFile.data.sens = CoC.getInstance().player.sens;
			saveFile.data.cor = CoC.getInstance().player.cor;
			saveFile.data.fatigue = CoC.getInstance().player.fatigue;
			//Combat STATS
			saveFile.data.HP = CoC.getInstance().player.HP;
			saveFile.data.lust = CoC.getInstance().player.lust;
			saveFile.data.teaseLevel = CoC.getInstance().player.teaseLevel;
			saveFile.data.teaseXP = CoC.getInstance().player.teaseXP;
			//LEVEL STATS
			saveFile.data.XP = CoC.getInstance().player.XP;
			saveFile.data.level = CoC.getInstance().player.level;
			saveFile.data.gems = CoC.getInstance().player.gems;
			saveFile.data.perkPoints = CoC.getInstance().player.perkPoints;
			//Appearance
			saveFile.data.gender = CoC.getInstance().player.gender;
			saveFile.data.femininity = CoC.getInstance().player.femininity;
			saveFile.data.thickness = CoC.getInstance().player.thickness;
			saveFile.data.tone = CoC.getInstance().player.tone;
			saveFile.data.tallness = CoC.getInstance().player.tallness;
			saveFile.data.hairColor = CoC.getInstance().player.hairColor;
			saveFile.data.hairType = CoC.getInstance().player.hairType;
			saveFile.data.gills = CoC.getInstance().player.gills;
			saveFile.data.armType = CoC.getInstance().player.armType;
			saveFile.data.hairLength = CoC.getInstance().player.hairLength;
			saveFile.data.beardLength = CoC.getInstance().player.beardLength;
			saveFile.data.eyeType = CoC.getInstance().player.eyeType;
			saveFile.data.beardStyle = CoC.getInstance().player.beardStyle;
			saveFile.data.skinType = CoC.getInstance().player.skinType;
			saveFile.data.skinTone = CoC.getInstance().player.skinTone;
			saveFile.data.skinDesc = CoC.getInstance().player.skinDesc;
			saveFile.data.skinAdj = CoC.getInstance().player.skinAdj;
			saveFile.data.faceType = CoC.getInstance().player.faceType;
			saveFile.data.tongueType = CoC.getInstance().player.tongueType;
			saveFile.data.earType = CoC.getInstance().player.earType;
			saveFile.data.earValue = CoC.getInstance().player.earValue;
			saveFile.data.antennae = CoC.getInstance().player.antennae;
			saveFile.data.horns = CoC.getInstance().player.horns;
			saveFile.data.hornType = CoC.getInstance().player.hornType;
			saveFile.data.wingDesc = CoC.getInstance().player.wingDesc;
			saveFile.data.wingType = CoC.getInstance().player.wingType;
			saveFile.data.lowerBody = CoC.getInstance().player.lowerBody;
			saveFile.data.tailType = CoC.getInstance().player.tailType;
			saveFile.data.tailVenum = CoC.getInstance().player.tailVenom;
			saveFile.data.tailRecharge = CoC.getInstance().player.tailRecharge;
			saveFile.data.hipRating = CoC.getInstance().player.hipRating;
			saveFile.data.buttRating = CoC.getInstance().player.buttRating;
			//Sexual Stuff
			saveFile.data.balls = CoC.getInstance().player.balls;
			saveFile.data.cumMultiplier = CoC.getInstance().player.cumMultiplier;
			saveFile.data.ballSize = CoC.getInstance().player.ballSize;
			saveFile.data.hoursSinceCum = CoC.getInstance().player.hoursSinceCum;
			saveFile.data.fertility = CoC.getInstance().player.fertility;
			saveFile.data.clitLength = CoC.getInstance().player.clitLength;
			//Preggo stuff
			saveFile.data.pregnancyIncubation = CoC.getInstance().player.pregnancyIncubation;
			saveFile.data.pregnancyType = CoC.getInstance().player.pregnancyType;
			saveFile.data.buttPregnancyIncubation = CoC.getInstance().player.buttPregnancyIncubation;
			saveFile.data.buttPregnancyType = CoC.getInstance().player.buttPregnancyType;
			saveFile.data.cocks = angular.copy(CoC.getInstance().player.cocks);
			saveFile.data.vaginas = angular.copy(CoC.getInstance().player.vaginas);
			saveFile.data.breastRows = angular.copy(CoC.getInstance().player.breastRows);
			saveFile.data.perks = angular.copy(CoC.getInstance().player.perks);
			saveFile.data.statusAffects = angular.copy(CoC.getInstance().player.statusAffects);
			saveFile.data.ass = angular.copy(CoC.getInstance().player.ass);
			saveFile.data.keyItems = angular.copy(CoC.getInstance().player.keyItems);
			saveFile.data.itemStorage = angular.copy(CoC.getInstance().inventory.itemStorage);
			saveFile.data.gearStorage = angular.copy(CoC.getInstance().inventory.gearStorage);
			//NIPPLES
			saveFile.data.nippleLength = CoC.getInstance().player.nippleLength;
			//EXPLORED
			saveFile.data.exploredLake = CoC.getInstance().player.exploredLake;
			saveFile.data.exploredMountain = CoC.getInstance().player.exploredMountain;
			saveFile.data.exploredForest = CoC.getInstance().player.exploredForest;
			saveFile.data.exploredDesert = CoC.getInstance().player.exploredDesert;
			saveFile.data.explored = CoC.getInstance().player.explored;
			saveFile.data.foundForest = CoC.getInstance().foundForest;
			saveFile.data.foundDesert = CoC.getInstance().foundDesert;
			saveFile.data.foundMountain = CoC.getInstance().foundMountain;
			saveFile.data.foundLake = CoC.getInstance().foundLake;
			saveFile.data.gameState = this.gameStateGet();
			//Time and Items
			saveFile.data.hours = CoC.getInstance().time.hours;
			saveFile.data.days = CoC.getInstance().time.days;
			saveFile.data.autoSave = CoC.getInstance().player.autoSave;
			//PLOTZ
			saveFile.data.whitney = CoC.getInstance().whitney;
			saveFile.data.monk = CoC.getInstance().monk;
			saveFile.data.sand = CoC.getInstance().sand;
			saveFile.data.giacomo = CoC.getInstance().giacomo;
			//ITEMZ. Item1s
			saveFile.data.itemSlot1 = angular.copy(CoC.getInstance().player.itemSlot1);
			saveFile.data.itemSlot2 = angular.copy(CoC.getInstance().player.itemSlot2);
			saveFile.data.itemSlot3 = angular.copy(CoC.getInstance().player.itemSlot3);
			saveFile.data.itemSlot4 = angular.copy(CoC.getInstance().player.itemSlot4);
			saveFile.data.itemSlot5 = angular.copy(CoC.getInstance().player.itemSlot5);
			// Keybinds
			saveFile.data.controls = CoC.getInstance().inputManager.SaveBindsToObj();
		} catch( error ) {
			processingError = true;
			dataError = error;
			$log.error( error.message );
		}
		$log.debug( 'done saving' );
		// Because actionscript is stupid, there is no easy way to block until file operations are done.
		// Therefore, I'm hacking around it for the chaos monkey.
		// Really, something needs to listen for the FileReference.complete event, and re-enable saving/loading then.
		// Something to do in the future
		if( isFile && !processingError ) {
			if( !(CoC.getInstance().monkey.run) ) {
				/*
				TODO : Save to file
				*/
				EngineCore.outputText( 'Attempted to save to file.', true );
			}
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
		var game = CoC.getInstance();
		game.dungeonLoc = 0;
		game.inRoomedDungeon = false;
		game.inRoomedDungeonResume = null;
		//Autosave stuff
		CoC.getInstance().player.slotName = slot;
		$log.info( 'Loading save!' );
		//Initialize the save file
		var saveFile = saveData;
		if( saveFile.data ) {
			//KILL ALL COCKS;
			CoC.getInstance().player = new Player();
			CoC.getInstance().flags = {};
			CoC.getInstance().inventory.clearStorage();
			CoC.getInstance().inventory.clearGearStorage();
			CoC.getInstance().player.short = saveFile.data.short;
			CoC.getInstance().player.a = saveFile.data.a;
			CoC.getInstance().notes = saveFile.data.notes;
			_.forOwn(saveFile.data, function(value, key) {
				if( value !== undefined ) {
					CoC.getInstance().flags[key] = value;
				}
			});
			//PIERCINGS
			CoC.getInstance().player.nipplesPierced = saveFile.data.nipplesPierced;
			CoC.getInstance().player.nipplesPShort = saveFile.data.nipplesPShort;
			CoC.getInstance().player.nipplesPLong = saveFile.data.nipplesPLong;
			CoC.getInstance().player.lipPierced = saveFile.data.lipPierced;
			CoC.getInstance().player.lipPShort = saveFile.data.lipPShort;
			CoC.getInstance().player.lipPLong = saveFile.data.lipPLong;
			CoC.getInstance().player.tonguePierced = saveFile.data.tonguePierced;
			CoC.getInstance().player.tonguePShort = saveFile.data.tonguePShort;
			CoC.getInstance().player.tonguePLong = saveFile.data.tonguePLong;
			CoC.getInstance().player.eyebrowPierced = saveFile.data.eyebrowPierced;
			CoC.getInstance().player.eyebrowPShort = saveFile.data.eyebrowPShort;
			CoC.getInstance().player.eyebrowPLong = saveFile.data.eyebrowPLong;
			CoC.getInstance().player.earsPierced = saveFile.data.earsPierced;
			CoC.getInstance().player.earsPShort = saveFile.data.earsPShort;
			CoC.getInstance().player.earsPLong = saveFile.data.earsPLong;
			CoC.getInstance().player.nosePierced = saveFile.data.nosePierced;
			CoC.getInstance().player.nosePShort = saveFile.data.nosePShort;
			CoC.getInstance().player.nosePLong = saveFile.data.nosePLong;
			//MAIN STATS
			CoC.getInstance().player.str = saveFile.data.str;
			CoC.getInstance().player.tou = saveFile.data.tou;
			CoC.getInstance().player.spe = saveFile.data.spe;
			CoC.getInstance().player.inte = saveFile.data.inte;
			CoC.getInstance().player.lib = saveFile.data.lib;
			CoC.getInstance().player.sens = saveFile.data.sens;
			CoC.getInstance().player.cor = saveFile.data.cor;
			CoC.getInstance().player.fatigue = saveFile.data.fatigue;
			//CLOTHING/ARMOR
			CoC.getInstance().player.setWeaponHiddenField( ItemType.lookupItem( saveFile.data.weaponId ) || WeaponLib.FISTS );
			CoC.getInstance().player.setArmorHiddenField( ItemType.lookupItem( saveFile.data.armorId ) || ArmorLib.COMFORTABLE_UNDERCLOTHES );
			if( CoC.getInstance().player.armor.name !== saveFile.data.armorName ) {
				CoC.getInstance().player.modArmorName = saveFile.data.armorName;
			}
			//Combat STATS
			CoC.getInstance().player.HP = saveFile.data.HP;
			CoC.getInstance().player.lust = saveFile.data.lust;
			CoC.getInstance().player.teaseXP = saveFile.data.teaseXP ? saveFile.data.teaseXP : 0;
			CoC.getInstance().player.teaseLevel = saveFile.data.teaseLevel ? saveFile.data.teaseLevel : 0;
			//LEVEL STATS
			CoC.getInstance().player.XP = saveFile.data.XP;
			CoC.getInstance().player.level = saveFile.data.level;
			CoC.getInstance().player.gems = saveFile.data.gems;
			CoC.getInstance().player.perkPoints = saveFile.data.perkPoints ? saveFile.data.perkPoints : 0;
			//Appearance
			CoC.getInstance().player.gender = saveFile.data.gender;
			CoC.getInstance().player.femininity = saveFile.data.femininity !== undefined ? saveFile.data.femininity : 50;
			CoC.getInstance().player.eyeType = saveFile.data.eyeType !== undefined ? saveFile.data.eyeType : AppearanceDefs.EYES_HUMAN;
			CoC.getInstance().player.beardLength = saveFile.data.beardLength ? saveFile.data.beardLength : 0;
			CoC.getInstance().player.beardStyle = saveFile.data.beardStyle ? saveFile.data.beardStyle : 0;
			CoC.getInstance().player.tone = saveFile.data.tone !== undefined ? saveFile.data.tone : 50;
			CoC.getInstance().player.thickness = saveFile.data.thickness !== undefined ? saveFile.data.thickness : 50;
			CoC.getInstance().player.tallness = saveFile.data.tallness;
			CoC.getInstance().player.hairColor = saveFile.data.hairColor;
			CoC.getInstance().player.hairType = saveFile.data.hairType ? saveFile.data.hairType : 0;
			CoC.getInstance().player.gills = saveFile.data.gills ? saveFile.data.gills : false;
			CoC.getInstance().player.armType = saveFile.data.armType !== undefined ? saveFile.data.armType : AppearanceDefs.ARM_TYPE_HUMAN;
			CoC.getInstance().player.hairLength = saveFile.data.hairLength;
			CoC.getInstance().player.skinType = saveFile.data.skinType;
			CoC.getInstance().player.skinAdj = saveFile.data.skinAdj !== undefined ? saveFile.data.skinAdj : '';
			CoC.getInstance().player.skinTone = saveFile.data.skinTone;
			CoC.getInstance().player.skinDesc = saveFile.data.skinDesc;
			CoC.getInstance().player.faceType = saveFile.data.faceType;
			CoC.getInstance().player.tongueType = saveFile.data.tongueType !== undefined ? saveFile.data.tongueType : AppearanceDefs.TONUGE_HUMAN;
			CoC.getInstance().player.earType = saveFile.data.earType !== undefined ? saveFile.data.earType : AppearanceDefs.EARS_HUMAN;
			CoC.getInstance().player.earValue = saveFile.data.earValue ? saveFile.data.earValue : 0;
			CoC.getInstance().player.antennae = saveFile.data.antennae !== undefined ? saveFile.data.antennae : AppearanceDefs.ANTENNAE_NONE;
			CoC.getInstance().player.horns = saveFile.data.horns;
			CoC.getInstance().player.hornType = saveFile.data.hornType !== undefined ? saveFile.data.hornType : AppearanceDefs.HORNS_NONE;
			CoC.getInstance().player.wingDesc = saveFile.data.wingDesc;
			CoC.getInstance().player.wingType = saveFile.data.wingType;
			CoC.getInstance().player.lowerBody = saveFile.data.lowerBody;
			CoC.getInstance().player.tailType = saveFile.data.tailType;
			CoC.getInstance().player.tailVenom = saveFile.data.tailVenum;
			CoC.getInstance().player.tailRecharge = saveFile.data.tailRecharge;
			CoC.getInstance().player.hipRating = saveFile.data.hipRating;
			CoC.getInstance().player.buttRating = saveFile.data.buttRating;
			//Sexual Stuff
			CoC.getInstance().player.balls = saveFile.data.balls;
			CoC.getInstance().player.cumMultiplier = saveFile.data.cumMultiplier;
			CoC.getInstance().player.ballSize = saveFile.data.ballSize;
			CoC.getInstance().player.hoursSinceCum = saveFile.data.hoursSinceCum;
			CoC.getInstance().player.fertility = saveFile.data.fertility;
			CoC.getInstance().player.clitLength = saveFile.data.clitLength;
			//Preggo stuff
			CoC.getInstance().player.knockUpForce( saveFile.data.pregnancyType, saveFile.data.pregnancyIncubation );
			CoC.getInstance().player.buttKnockUpForce( saveFile.data.buttPregnancyType, saveFile.data.buttPregnancyIncubation );
			CoC.getInstance().player.cocks = angular.copy(saveFile.data.cocks);
			CoC.getInstance().player.vaginas = angular.copy(saveFile.data.vaginas);
			//NIPPLES
			CoC.getInstance().player.nippleLength = saveFile.data.nippleLength !== undefined ? saveFile.data.nippleLength : 0.25;
			CoC.getInstance().player.breastRows = angular.copy(saveFile.data.breastRows);
			CoC.getInstance().player.perks = angular.copy(saveFile.data.perks);
			if( CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_MARBLE ] === 1 ) {
				CoC.getInstance().flags[ kFLAGS.FOLLOWER_AT_FARM_MARBLE ] = 0;
				$log.debug( 'Force-reverting Marble At Farm flag to 0.' );
			}
			CoC.getInstance().player.statusAffects = angular.copy(saveFile.data.statusAffects);
			CoC.getInstance().player.keyItems = angular.copy(saveFile.data.keyItems);
			//Set storage slot array
			//Populate storage slot array
			CoC.getInstance().inventory.itemStorage = angular.copy(saveFile.data.itemStorage);
			CoC.getInstance().inventory.gearStorage = angular.copy(saveFile.data.gearStorage);
			CoC.getInstance().player.ass.analLooseness = saveFile.data.ass.analLooseness;
			CoC.getInstance().player.ass.analWetness = saveFile.data.ass.analWetness;
			CoC.getInstance().player.ass.fullness = saveFile.data.ass.fullness;
			//Shit
			this.gameStateSet( saveFile.data.gameState );
			CoC.getInstance().player.exploredLake = saveFile.data.exploredLake;
			CoC.getInstance().player.exploredMountain = saveFile.data.exploredMountain;
			CoC.getInstance().player.exploredForest = saveFile.data.exploredForest;
			CoC.getInstance().player.exploredDesert = saveFile.data.exploredDesert;
			CoC.getInstance().player.explored = saveFile.data.explored;
			CoC.getInstance().foundForest = saveFile.data.foundForest;
			CoC.getInstance().foundDesert = saveFile.data.foundDesert;
			CoC.getInstance().foundMountain = saveFile.data.foundMountain;
			CoC.getInstance().foundLake = saveFile.data.foundLake;
			//Days
			//Time and Items
			CoC.getInstance().time.hours = saveFile.data.hours;
			CoC.getInstance().time.days = saveFile.data.days;
			CoC.getInstance().player.autoSave = saveFile.data.autoSave !== undefined ? saveFile.data.autoSave : false;
			//PLOTZ
			CoC.getInstance().whitney = saveFile.data.whitney;
			CoC.getInstance().monk = saveFile.data.monk;
			CoC.getInstance().sand = saveFile.data.sand;
			CoC.getInstance().player.giacomo = saveFile.data.giacomo !== undefined ? saveFile.data.giacomo : 0;
			//The flag will be zero for any older save that still uses beeProgress and newer saves always store a zero in beeProgress, so we only need to update the flag on a value of one.
			//ITEMZ. Item1
			CoC.getInstance().player.itemSlot1 = angular.copy(saveFile.data.itemSlot1);
			CoC.getInstance().player.itemSlot2 = angular.copy(saveFile.data.itemSlot2);
			CoC.getInstance().player.itemSlot3 = angular.copy(saveFile.data.itemSlot3);
			CoC.getInstance().player.itemSlot4 = angular.copy(saveFile.data.itemSlot4);
			CoC.getInstance().player.itemSlot5 = angular.copy(saveFile.data.itemSlot5);
			CoC.loadAllAwareClasses( CoC.getInstance() ); //Informs each saveAwareClass that it must load its values from the CoC.getInstance().flags array
			// Control Bindings
			if( saveFile.data.controls !== undefined ) {
				CoC.getInstance().inputManager.LoadBindsFromObj( saveFile.data.controls );
			}
			EngineCore.doNext(  EventParser.playerMenu );
		}
	};
	return Saves;
});