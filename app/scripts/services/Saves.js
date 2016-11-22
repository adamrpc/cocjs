'use strict';

angular.module( 'cocjs' ).factory( 'Saves', function( $rootScope, $log, Utils, Weapon, Armor, CockTypesEnum, EngineCore, MainView, EventParser, kFLAGS, Player, ItemType, WeaponLib, ArmorLib, AppearanceDefs, InputManager, OnLoadVariables ) {
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
		if( this.game.player.slotName !== 'VOID' ) {
			EngineCore.outputText( '<b>Last saved or loaded from : ' + this.game.player.slotName + '</b>\r\r', false );
		}
		EngineCore.outputText( '<b><u>Slot,  Game Days Played</u></b>\r', false );
		var saveFuncs = [];
		_.forEach( this.saveFileNames, function( saveFileName, index ) {
			EngineCore.outputText( this.loadSaveDisplay( localStorage.getItem( saveFileName ), index + 1 ), false );
			$log.info( 'Creating save function with indice = ', index );
			saveFuncs.push( function() {
				$log.info( 'Saving game with name', saveFileName, 'at index', index );
				this.saveGame( saveFileName );
			} );
		} );
		if( this.game.player.slotName === 'VOID' ) {
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
		//This is to clear the 'game over' block from stopping choices from working.  Loading games supercede's game over.
		if( MainView.getButtonText( 0 ) === 'Game Over' ) {
			MainView.setButtonText( 0, 'save/load' );
			EngineCore.menu();
			EngineCore.addButton( 1, 'Load', this.loadScreen );
			EngineCore.addButton( 2, '', null ); // TODO : Save to file
			EngineCore.addButton( 3, 'Delete', this.deleteScreen );
			EngineCore.addButton( 4, 'Back', EventParser.gameOver, true );
			return;
		}
		if( this.game.player.str === 0 ) {
			// TODO : Save to file
			EngineCore.choices( '', null, 'Load', this.loadScreen, '', null, 'Delete', this.deleteScreen, 'Back', $rootScope.StartUp.mainMenu );
			return;
		}
		if( this.game.scenes.dungeonCore.isInDungeon() ) {
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
			if( this.game.player.autoSave ) {
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
		this.game.player.autoSave = !this.game.player.autoSave;
		this.saveLoad();
	};
	Saves.prototype.deleteScreen = function() {
		EngineCore.outputText( 'Slot,  Race,  Sex,  Game Days Played\n', true );
		var delFuncs = [];
		_.forEach( this.saveFileNames, function( saveFileName, index ) {
			EngineCore.outputText( this.loadSaveDisplay( localStorage.getItem( saveFileName ), index + 1 ), false );
			$log.info( 'Creating delete function with indice = ', index );
			delFuncs.push( function() {
				this.game.flags[ kFLAGS.TEMP_STORAGE_SAVE_DELETION ] = saveFileName;
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
		EngineCore.outputText( 'You are about to delete the following save: <b>' + this.game.flags[ kFLAGS.TEMP_STORAGE_SAVE_DELETION ] + '</b>\n\nAre you sure you want to delete it?', true );
		EngineCore.choices( 'No', this.deleteScreen, 'Yes', this.purgeTheMutant, '', null, '', null, '', null );
	};
	Saves.prototype.purgeTheMutant = function() {
		localStorage.removeItem( this.game.flags[ kFLAGS.TEMP_STORAGE_SAVE_DELETION ] );
		$log.info( 'DELETING SLOT: ' + this.game.flags[ kFLAGS.TEMP_STORAGE_SAVE_DELETION ] );
		var blah = [ 'been virus bombed', 'been purged', 'been vaped', 'been nuked from orbit', 'taken an arrow to the knee', 'fallen on its sword', 'lost its reality matrix cohesion', 'been cleansed', 'suffered the following error) Porn Not Found' ];
		$log.debug( blah.length + ' array slots' );
		var select = Utils.rand( blah.length );
		EngineCore.outputText( this.game.flags[ kFLAGS.TEMP_STORAGE_SAVE_DELETION ] + ' has ' + blah[ select ] + '.', true );
		EngineCore.doNext( this.deleteScreen );
	};
	Saves.prototype.saveGame = function( slot ) {
		this.game.player.slotName = slot;
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
		if( this.game.player.slotName === 'VOID' ) {
			$log.info( 'Setting in-use save slot to: ' + slot );
			this.game.player.slotName = slot;
		}
		EngineCore.doNext(  EventParser.playerMenu );
	};
	/*
	 OH GOD SOMEONE FIX THIS DISASTER!!!!111one1ONE!
	 */
	//FURNITURE'S JUNK
	Saves.prototype.saveGameObject = function( slot, isFile ) {
		//Autosave stuff
		if( this.game.player.slotName !== 'VOID' ) {
			this.game.player.slotName = slot;
		}
		$rootScope.$broadcast('before-save');
		//Initialize the save file
		var saveFile = {data: {}};
		//Set a single variable that tells us if this save exists
		saveFile.data.exists = true;
		saveFile.data.version = this.game.ver;
		this.game.flags[ kFLAGS.SAVE_FILE_INTEGER_FORMAT_VERSION ] = SAVE_FILE_CURRENT_INTEGER_FORMAT_VERSION;
		//CLEAR OLD ARRAYS
		//Save sum dataz
		$log.debug( 'SAVE DATAZ' );
		saveFile.data.short = this.game.player.short;
		saveFile.data.a = this.game.player.a;
		//Notes
		if( MainView.nameBox.text !== '' ) {
			saveFile.data.notes = MainView.nameBox.text;
			this.game.notes = MainView.nameBox.text;
		} else {
			saveFile.data.notes = this.game.notes;
		}
		MainView.nameBox.visible = false;
		var processingError = false;
		var dataError = null;
		try {
			//flags
			saveFile.data.flags = {};
			_.forOwn(this.game.flags, function(value, key) {
				if(value !== 0) {
					saveFile.data.flags[key] = value;
				}
			});
			//CLOTHING/ARMOR
			saveFile.data.armorId = this.game.player.armor.id;
			saveFile.data.weaponId = this.game.player.weapon.id;
			saveFile.data.armorName = this.game.player.modArmorName;
			//PIERCINGS
			saveFile.data.nipplesPierced = this.game.player.nipplesPierced;
			saveFile.data.nipplesPShort = this.game.player.nipplesPShort;
			saveFile.data.nipplesPLong = this.game.player.nipplesPLong;
			saveFile.data.lipPierced = this.game.player.lipPierced;
			saveFile.data.lipPShort = this.game.player.lipPShort;
			saveFile.data.lipPLong = this.game.player.lipPLong;
			saveFile.data.tonguePierced = this.game.player.tonguePierced;
			saveFile.data.tonguePShort = this.game.player.tonguePShort;
			saveFile.data.tonguePLong = this.game.player.tonguePLong;
			saveFile.data.eyebrowPierced = this.game.player.eyebrowPierced;
			saveFile.data.eyebrowPShort = this.game.player.eyebrowPShort;
			saveFile.data.eyebrowPLong = this.game.player.eyebrowPLong;
			saveFile.data.earsPierced = this.game.player.earsPierced;
			saveFile.data.earsPShort = this.game.player.earsPShort;
			saveFile.data.earsPLong = this.game.player.earsPLong;
			saveFile.data.nosePierced = this.game.player.nosePierced;
			saveFile.data.nosePShort = this.game.player.nosePShort;
			saveFile.data.nosePLong = this.game.player.nosePLong;
			//MAIN STATS
			saveFile.data.str = this.game.player.str;
			saveFile.data.tou = this.game.player.tou;
			saveFile.data.spe = this.game.player.spe;
			saveFile.data.inte = this.game.player.inte;
			saveFile.data.lib = this.game.player.lib;
			saveFile.data.sens = this.game.player.sens;
			saveFile.data.cor = this.game.player.cor;
			saveFile.data.fatigue = this.game.player.fatigue;
			//Combat STATS
			saveFile.data.HP = this.game.player.HP;
			saveFile.data.lust = this.game.player.lust;
			saveFile.data.teaseLevel = this.game.player.teaseLevel;
			saveFile.data.teaseXP = this.game.player.teaseXP;
			//LEVEL STATS
			saveFile.data.XP = this.game.player.XP;
			saveFile.data.level = this.game.player.level;
			saveFile.data.gems = this.game.player.gems;
			saveFile.data.perkPoints = this.game.player.perkPoints;
			//Appearance
			saveFile.data.gender = this.game.player.gender;
			saveFile.data.femininity = this.game.player.femininity;
			saveFile.data.thickness = this.game.player.thickness;
			saveFile.data.tone = this.game.player.tone;
			saveFile.data.tallness = this.game.player.tallness;
			saveFile.data.hairColor = this.game.player.hairColor;
			saveFile.data.hairType = this.game.player.hairType;
			saveFile.data.gills = this.game.player.gills;
			saveFile.data.armType = this.game.player.armType;
			saveFile.data.hairLength = this.game.player.hairLength;
			saveFile.data.beardLength = this.game.player.beardLength;
			saveFile.data.eyeType = this.game.player.eyeType;
			saveFile.data.beardStyle = this.game.player.beardStyle;
			saveFile.data.skinType = this.game.player.skinType;
			saveFile.data.skinTone = this.game.player.skinTone;
			saveFile.data.skinDesc = this.game.player.skinDesc;
			saveFile.data.skinAdj = this.game.player.skinAdj;
			saveFile.data.faceType = this.game.player.faceType;
			saveFile.data.tongueType = this.game.player.tongueType;
			saveFile.data.earType = this.game.player.earType;
			saveFile.data.earValue = this.game.player.earValue;
			saveFile.data.antennae = this.game.player.antennae;
			saveFile.data.horns = this.game.player.horns;
			saveFile.data.hornType = this.game.player.hornType;
			saveFile.data.wingDesc = this.game.player.wingDesc;
			saveFile.data.wingType = this.game.player.wingType;
			saveFile.data.lowerBody = this.game.player.lowerBody;
			saveFile.data.tailType = this.game.player.tailType;
			saveFile.data.tailVenum = this.game.player.tailVenom;
			saveFile.data.tailRecharge = this.game.player.tailRecharge;
			saveFile.data.hipRating = this.game.player.hipRating;
			saveFile.data.buttRating = this.game.player.buttRating;
			//Sexual Stuff
			saveFile.data.balls = this.game.player.balls;
			saveFile.data.cumMultiplier = this.game.player.cumMultiplier;
			saveFile.data.ballSize = this.game.player.ballSize;
			saveFile.data.hoursSinceCum = this.game.player.hoursSinceCum;
			saveFile.data.fertility = this.game.player.fertility;
			saveFile.data.clitLength = this.game.player.clitLength;
			//Preggo stuff
			saveFile.data.pregnancyIncubation = this.game.player.pregnancyIncubation;
			saveFile.data.pregnancyType = this.game.player.pregnancyType;
			saveFile.data.buttPregnancyIncubation = this.game.player.buttPregnancyIncubation;
			saveFile.data.buttPregnancyType = this.game.player.buttPregnancyType;
			saveFile.data.cocks = angular.copy(this.game.player.cocks);
			saveFile.data.vaginas = angular.copy(this.game.player.vaginas);
			saveFile.data.breastRows = angular.copy(this.game.player.breastRows);
			saveFile.data.perks = angular.copy(this.game.player.perks);
			saveFile.data.statusAffects = angular.copy(this.game.player.statusAffects);
			saveFile.data.ass = angular.copy(this.game.player.ass);
			saveFile.data.keyItems = angular.copy(this.game.player.keyItems);
			saveFile.data.itemStorage = angular.copy(this.game.inventory.itemStorage);
			saveFile.data.gearStorage = angular.copy(this.game.inventory.gearStorage);
			//NIPPLES
			saveFile.data.nippleLength = this.game.player.nippleLength;
			//EXPLORED
			saveFile.data.exploredLake = this.game.player.exploredLake;
			saveFile.data.exploredMountain = this.game.player.exploredMountain;
			saveFile.data.exploredForest = this.game.player.exploredForest;
			saveFile.data.exploredDesert = this.game.player.exploredDesert;
			saveFile.data.explored = this.game.player.explored;
			saveFile.data.foundForest = this.game.foundForest;
			saveFile.data.foundDesert = this.game.foundDesert;
			saveFile.data.foundMountain = this.game.foundMountain;
			saveFile.data.foundLake = this.game.foundLake;
			saveFile.data.gameState = this.gameStateGet();
			//Time and Items
			saveFile.data.hours = this.game.time.hours;
			saveFile.data.days = this.game.time.days;
			saveFile.data.autoSave = this.game.player.autoSave;
			//PLOTZ
			saveFile.data.whitney = this.game.whitney;
			saveFile.data.monk = this.game.scenes.jojoScene.monk;
			saveFile.data.sand = this.game.sand;
			saveFile.data.giacomo = this.game.giacomo;
			//ITEMZ. Item1s
			saveFile.data.itemSlot1 = angular.copy(this.game.player.itemSlot1);
			saveFile.data.itemSlot2 = angular.copy(this.game.player.itemSlot2);
			saveFile.data.itemSlot3 = angular.copy(this.game.player.itemSlot3);
			saveFile.data.itemSlot4 = angular.copy(this.game.player.itemSlot4);
			saveFile.data.itemSlot5 = angular.copy(this.game.player.itemSlot5);
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
		this.game.dungeonLoc = 0;
		OnLoadVariables.inRoomedDungeon = false;
		OnLoadVariables.inRoomedDungeonResume = null;
		//Autosave stuff
		this.game.player.slotName = slot;
		$log.info( 'Loading save!' );
		//Initialize the save file
		var saveFile = saveData;
		if( saveFile.data ) {
			//KILL ALL COCKS;
			this.game.player = new Player();
			this.game.flags = {};
			this.game.inventory.clearStorage();
			this.game.inventory.clearGearStorage();
			this.game.player.short = saveFile.data.short;
			this.game.player.a = saveFile.data.a;
			this.game.notes = saveFile.data.notes;
			_.forOwn(saveFile.data, function(value, key) {
				if( value !== undefined ) {
					this.game.flags[key] = value;
				}
			});
			//PIERCINGS
			this.game.player.nipplesPierced = saveFile.data.nipplesPierced;
			this.game.player.nipplesPShort = saveFile.data.nipplesPShort;
			this.game.player.nipplesPLong = saveFile.data.nipplesPLong;
			this.game.player.lipPierced = saveFile.data.lipPierced;
			this.game.player.lipPShort = saveFile.data.lipPShort;
			this.game.player.lipPLong = saveFile.data.lipPLong;
			this.game.player.tonguePierced = saveFile.data.tonguePierced;
			this.game.player.tonguePShort = saveFile.data.tonguePShort;
			this.game.player.tonguePLong = saveFile.data.tonguePLong;
			this.game.player.eyebrowPierced = saveFile.data.eyebrowPierced;
			this.game.player.eyebrowPShort = saveFile.data.eyebrowPShort;
			this.game.player.eyebrowPLong = saveFile.data.eyebrowPLong;
			this.game.player.earsPierced = saveFile.data.earsPierced;
			this.game.player.earsPShort = saveFile.data.earsPShort;
			this.game.player.earsPLong = saveFile.data.earsPLong;
			this.game.player.nosePierced = saveFile.data.nosePierced;
			this.game.player.nosePShort = saveFile.data.nosePShort;
			this.game.player.nosePLong = saveFile.data.nosePLong;
			//MAIN STATS
			this.game.player.str = saveFile.data.str;
			this.game.player.tou = saveFile.data.tou;
			this.game.player.spe = saveFile.data.spe;
			this.game.player.inte = saveFile.data.inte;
			this.game.player.lib = saveFile.data.lib;
			this.game.player.sens = saveFile.data.sens;
			this.game.player.cor = saveFile.data.cor;
			this.game.player.fatigue = saveFile.data.fatigue;
			//CLOTHING/ARMOR
			this.game.player.setWeaponHiddenField( ItemType.lookupItem( saveFile.data.weaponId ) || WeaponLib.FISTS );
			this.game.player.setArmorHiddenField( ItemType.lookupItem( saveFile.data.armorId ) || ArmorLib.COMFORTABLE_UNDERCLOTHES );
			if( this.game.player.armor.name !== saveFile.data.armorName ) {
				this.game.player.modArmorName = saveFile.data.armorName;
			}
			//Combat STATS
			this.game.player.HP = saveFile.data.HP;
			this.game.player.lust = saveFile.data.lust;
			this.game.player.teaseXP = saveFile.data.teaseXP ? saveFile.data.teaseXP : 0;
			this.game.player.teaseLevel = saveFile.data.teaseLevel ? saveFile.data.teaseLevel : 0;
			//LEVEL STATS
			this.game.player.XP = saveFile.data.XP;
			this.game.player.level = saveFile.data.level;
			this.game.player.gems = saveFile.data.gems;
			this.game.player.perkPoints = saveFile.data.perkPoints ? saveFile.data.perkPoints : 0;
			//Appearance
			this.game.player.gender = saveFile.data.gender;
			this.game.player.femininity = saveFile.data.femininity !== undefined ? saveFile.data.femininity : 50;
			this.game.player.eyeType = saveFile.data.eyeType !== undefined ? saveFile.data.eyeType : AppearanceDefs.EYES_HUMAN;
			this.game.player.beardLength = saveFile.data.beardLength ? saveFile.data.beardLength : 0;
			this.game.player.beardStyle = saveFile.data.beardStyle ? saveFile.data.beardStyle : 0;
			this.game.player.tone = saveFile.data.tone !== undefined ? saveFile.data.tone : 50;
			this.game.player.thickness = saveFile.data.thickness !== undefined ? saveFile.data.thickness : 50;
			this.game.player.tallness = saveFile.data.tallness;
			this.game.player.hairColor = saveFile.data.hairColor;
			this.game.player.hairType = saveFile.data.hairType ? saveFile.data.hairType : 0;
			this.game.player.gills = saveFile.data.gills ? saveFile.data.gills : false;
			this.game.player.armType = saveFile.data.armType !== undefined ? saveFile.data.armType : AppearanceDefs.ARM_TYPE_HUMAN;
			this.game.player.hairLength = saveFile.data.hairLength;
			this.game.player.skinType = saveFile.data.skinType;
			this.game.player.skinAdj = saveFile.data.skinAdj !== undefined ? saveFile.data.skinAdj : '';
			this.game.player.skinTone = saveFile.data.skinTone;
			this.game.player.skinDesc = saveFile.data.skinDesc;
			this.game.player.faceType = saveFile.data.faceType;
			this.game.player.tongueType = saveFile.data.tongueType !== undefined ? saveFile.data.tongueType : AppearanceDefs.TONUGE_HUMAN;
			this.game.player.earType = saveFile.data.earType !== undefined ? saveFile.data.earType : AppearanceDefs.EARS_HUMAN;
			this.game.player.earValue = saveFile.data.earValue ? saveFile.data.earValue : 0;
			this.game.player.antennae = saveFile.data.antennae !== undefined ? saveFile.data.antennae : AppearanceDefs.ANTENNAE_NONE;
			this.game.player.horns = saveFile.data.horns;
			this.game.player.hornType = saveFile.data.hornType !== undefined ? saveFile.data.hornType : AppearanceDefs.HORNS_NONE;
			this.game.player.wingDesc = saveFile.data.wingDesc;
			this.game.player.wingType = saveFile.data.wingType;
			this.game.player.lowerBody = saveFile.data.lowerBody;
			this.game.player.tailType = saveFile.data.tailType;
			this.game.player.tailVenom = saveFile.data.tailVenum;
			this.game.player.tailRecharge = saveFile.data.tailRecharge;
			this.game.player.hipRating = saveFile.data.hipRating;
			this.game.player.buttRating = saveFile.data.buttRating;
			//Sexual Stuff
			this.game.player.balls = saveFile.data.balls;
			this.game.player.cumMultiplier = saveFile.data.cumMultiplier;
			this.game.player.ballSize = saveFile.data.ballSize;
			this.game.player.hoursSinceCum = saveFile.data.hoursSinceCum;
			this.game.player.fertility = saveFile.data.fertility;
			this.game.player.clitLength = saveFile.data.clitLength;
			//Preggo stuff
			this.game.player.knockUpForce( saveFile.data.pregnancyType, saveFile.data.pregnancyIncubation );
			this.game.player.buttKnockUpForce( saveFile.data.buttPregnancyType, saveFile.data.buttPregnancyIncubation );
			this.game.player.cocks = angular.copy(saveFile.data.cocks);
			this.game.player.vaginas = angular.copy(saveFile.data.vaginas);
			//NIPPLES
			this.game.player.nippleLength = saveFile.data.nippleLength !== undefined ? saveFile.data.nippleLength : 0.25;
			this.game.player.breastRows = angular.copy(saveFile.data.breastRows);
			this.game.player.perks = angular.copy(saveFile.data.perks);
			if( this.game.flags[ kFLAGS.FOLLOWER_AT_FARM_MARBLE ] === 1 ) {
				this.game.flags[ kFLAGS.FOLLOWER_AT_FARM_MARBLE ] = 0;
				$log.debug( 'Force-reverting Marble At Farm flag to 0.' );
			}
			this.game.player.statusAffects = angular.copy(saveFile.data.statusAffects);
			this.game.player.keyItems = angular.copy(saveFile.data.keyItems);
			//Set storage slot array
			//Populate storage slot array
			this.game.inventory.itemStorage = angular.copy(saveFile.data.itemStorage);
			this.game.inventory.gearStorage = angular.copy(saveFile.data.gearStorage);
			this.game.player.ass.analLooseness = saveFile.data.ass.analLooseness;
			this.game.player.ass.analWetness = saveFile.data.ass.analWetness;
			this.game.player.ass.fullness = saveFile.data.ass.fullness;
			//Shit
			this.gameStateSet( saveFile.data.gameState );
			this.game.player.exploredLake = saveFile.data.exploredLake;
			this.game.player.exploredMountain = saveFile.data.exploredMountain;
			this.game.player.exploredForest = saveFile.data.exploredForest;
			this.game.player.exploredDesert = saveFile.data.exploredDesert;
			this.game.player.explored = saveFile.data.explored;
			this.game.foundForest = saveFile.data.foundForest;
			this.game.foundDesert = saveFile.data.foundDesert;
			this.game.foundMountain = saveFile.data.foundMountain;
			this.game.foundLake = saveFile.data.foundLake;
			//Days
			//Time and Items
			this.game.time.hours = saveFile.data.hours;
			this.game.time.days = saveFile.data.days;
			this.game.player.autoSave = saveFile.data.autoSave !== undefined ? saveFile.data.autoSave : false;
			//PLOTZ
			this.game.whitney = saveFile.data.whitney;
			this.game.scenes.jojoScene.monk = saveFile.data.monk;
			this.game.sand = saveFile.data.sand;
			this.game.player.giacomo = saveFile.data.giacomo !== undefined ? saveFile.data.giacomo : 0;
			//The flag will be zero for any older save that still uses beeProgress and newer saves always store a zero in beeProgress, so we only need to update the flag on a value of one.
			//ITEMZ. Item1
			this.game.player.itemSlot1 = angular.copy(saveFile.data.itemSlot1);
			this.game.player.itemSlot2 = angular.copy(saveFile.data.itemSlot2);
			this.game.player.itemSlot3 = angular.copy(saveFile.data.itemSlot3);
			this.game.player.itemSlot4 = angular.copy(saveFile.data.itemSlot4);
			this.game.player.itemSlot5 = angular.copy(saveFile.data.itemSlot5);
			$rootScope.$broadcast('after-load');
			// Control Bindings
			if( saveFile.data.controls !== undefined ) {
				InputManager.LoadBindsFromObj( saveFile.data.controls );
			}
			EngineCore.doNext(  EventParser.playerMenu );
		}
	};
	return Saves;
});
