'use strict';

angular.module( 'cocjs' ).factory( 'CharCreation', function( SceneLib, $log, CoC, kFLAGS, EngineCore, MainView, AppearanceDefs, ArmorLib, WeaponLib, StatusAffects, Player, CockTypesEnum, Descriptors, PerkLib, ConsumableLib, Utils, OnLoadVariables ) {
	function CharCreation() {
		this.customPlayerProfile = null;
	}
	CharCreation.prototype.gameOver = function( clear ) { //Leaves text on screen unless clear is set to true
		if( clear ) {
			EngineCore.clearOutput();
		}
		EngineCore.outputText( '\n\n<b>GAME OVER</b>' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Game Over', this, this.gameOverMenuOverride );
		EngineCore.addButton( 3, 'NewGamePlus', this, this.newGamePlus );
		if( CoC.flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] ) {
			EngineCore.addButton( 4, 'Debug Cheat', null, MainView.playerMenu );
		}
		this.gameOverMenuOverride();
		CoC.setInCombat( false );
		OnLoadVariables.dungeonLoc = 0; //Replaces inDungeon = false;
	};
	CharCreation.prototype.gameOverMenuOverride = function() { //Game over event; override whatever the fuck has been done to the UI up to this point to force display of the data and new game buttons
		MainView.showMenuButton( MainView.MENU_NEW_MAIN );
		MainView.showMenuButton( MainView.MENU_DATA );
		MainView.hideMenuButton( MainView.MENU_APPEARANCE );
		MainView.hideMenuButton( MainView.MENU_LEVEL );
		MainView.hideMenuButton( MainView.MENU_PERKS );
	};
	CharCreation.prototype.newGamePlus = function() {
		CoC.flags[ kFLAGS.NEW_GAME_PLUS_BONUS_STORED_XP ] = CoC.player.XP;
		if( CoC.flags[ kFLAGS.NEW_GAME_PLUS_BONUS_STORED_XP ] === 0 ) {
			CoC.flags[ kFLAGS.NEW_GAME_PLUS_BONUS_STORED_XP ] = 1;
		}
		while( CoC.player.level > 1 ) {
			CoC.flags[ kFLAGS.NEW_GAME_PLUS_BONUS_STORED_XP ] += CoC.player.level * 100;
			CoC.player.level--;
		}
		CoC.flags[ kFLAGS.NEW_GAME_PLUS_BONUS_STORED_ITEMS ] = CoC.player.gems;
		this.newGameGo();
	};
	CharCreation.prototype.newGameGo = function() {
		EngineCore.hideStats();
		EngineCore.hideUpDown();
		MainView.nameBox.visible = true;
		MainView.nameBox.width = 165;
		MainView.hideMenuButton( MainView.MENU_NEW_MAIN );
		MainView.hideMenuButton( MainView.MENU_DATA );
		MainView.hideMenuButton( MainView.MENU_LEVEL );
		MainView.hideMenuButton( MainView.MENU_PERKS );
		//Hide perk boxes
		MainView.aCb.visible = false;
		//If first PC, track status of EZ mode and other such nonsense.
		var silly = CoC.flags[ kFLAGS.SILLY_MODE_ENABLE_FLAG ];
		var easy = CoC.flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ];
		var sprite = CoC.flags[ kFLAGS.SHOW_SPRITES_FLAG ];
		MainView.setButtonText( 0, 'Newgame' );
		EngineCore.clearOutput();
		EngineCore.outputText( 'You grew up in the small village of Ingnam, a remote village with rich traditions, buried deep in the wilds.  Every year for as long as you can remember, your village has chosen a champion to send to the cursed Demon Realm.  Legend has it that in years Ingnam has failed to produce a champion, chaos has reigned over the countryside.  Children disappear, crops wilt, and disease spreads like wildfire.  This year, <b>you</b> have been selected to be the champion.\n\nWhat is your name?' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'OK', this, this.chooseName );
		MainView.nameBox.value = '';
		//Reset autosave
		CoC.player.slotName = 'VOID';
		CoC.player.autoSave = false;
		//RESET DUNGEOn
		//No need, dungeonLoc = 0 does this = false;
		OnLoadVariables.dungeonLoc = 0;
		OnLoadVariables.inRoomedDungeon = false;
		OnLoadVariables.inRoomedDungeonResume = null;
		//Hold onto old data for NG+
		var oldPlayer = angular.copy(CoC.player);
		//Reset all standard stats
		CoC.player = new Player();
		CoC.player.str = 15;
		CoC.player.tou = 15;
		CoC.player.spe = 15;
		CoC.player.inte = 15;
		CoC.player.sens = 15;
		CoC.player.lib = 15;
		CoC.player.cor = 0;
		CoC.player.lust = 15;
		CoC.notes = 'No Notes Available.';
		CoC.player.XP = CoC.flags[ kFLAGS.NEW_GAME_PLUS_BONUS_STORED_XP ];
		CoC.player.level = 1;
		CoC.player.HP = CoC.player.maxHP();
		CoC.player.gems = CoC.flags[ kFLAGS.NEW_GAME_PLUS_BONUS_STORED_ITEMS ];
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		CoC.player.faceType = AppearanceDefs.FACE_HUMAN;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_NONE;
		CoC.player.tongueType = AppearanceDefs.TONUGE_HUMAN;
		CoC.player.beardLength = 0;
		CoC.player.beardStyle = 0;
		CoC.player.skinDesc = 'skin';
		CoC.player.cumMultiplier = 1;
		CoC.player.hoursSinceCum = 0;
		CoC.player.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_VIRGIN;
		CoC.player.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		CoC.player.ass.fullness = 0;
		CoC.player.fatigue = 0;
		CoC.player.horns = 0;
		CoC.player.tailVenom = 0;
		CoC.player.tailRecharge = 0;
		CoC.player.wingType = AppearanceDefs.WING_TYPE_NONE;
		CoC.player.wingDesc = 'non-existant';
		//Exploration
		CoC.player.explored = 0;
		CoC.player.exploredForest = 0;
		CoC.player.exploredDesert = 0;
		CoC.player.exploredMountain = 0;
		CoC.player.exploredLake = 0;
		//Inventory clear
		CoC.player.itemSlot1.unlocked = true;
		CoC.player.itemSlot1.emptySlot();
		CoC.player.itemSlot2.unlocked = true;
		CoC.player.itemSlot2.emptySlot();
		CoC.player.itemSlot3.unlocked = true;
		CoC.player.itemSlot3.emptySlot();
		CoC.player.itemSlot4.unlocked = false;
		CoC.player.itemSlot4.emptySlot();
		CoC.player.itemSlot5.unlocked = false;
		CoC.player.itemSlot5.emptySlot();
		//PIERCINGS
		CoC.player.nipplesPierced = 0;
		CoC.player.nipplesPShort = '';
		CoC.player.nipplesPLong = '';
		CoC.player.lipPierced = 0;
		CoC.player.lipPShort = '';
		CoC.player.lipPLong = '';
		CoC.player.tonguePierced = 0;
		CoC.player.tonguePShort = '';
		CoC.player.tonguePLong = '';
		CoC.player.eyebrowPierced = 0;
		CoC.player.eyebrowPShort = '';
		CoC.player.eyebrowPLong = '';
		CoC.player.earsPierced = 0;
		CoC.player.earsPShort = '';
		CoC.player.earsPLong = '';
		CoC.player.nosePierced = 0;
		CoC.player.nosePShort = '';
		CoC.player.nosePLong = '';
		//PLOTZ
		SceneLib.jojoScene.monk = 0;
		CoC.whitney = 0;
		CoC.sand = 0;
		CoC.giacomo = 0;
		//Lets get this bitch started
		CoC.setInCombat(false);
		//NG+ Clothes reset
		if( CoC.flags[ kFLAGS.NEW_GAME_PLUS_BONUS_STORED_ITEMS ] !== 0 ) {
			//Clear Raphael's training variable so it does not effect
			//Weapon strength post-newgame.
			CoC.flags[ kFLAGS.RAPHAEL_RAPIER_TRANING ] = 0;
			if( oldPlayer.armor.id !== 'GooArmor' ) {
				CoC.player.setArmor( oldPlayer.armor );
			} else {
				CoC.player.setArmor( ArmorLib.C_CLOTH );
			}
			CoC.player.setWeapon( oldPlayer.weapon );
		} else { //Clothes clear
			CoC.player.setArmor( ArmorLib.C_CLOTH );
			CoC.player.setWeapon( WeaponLib.FISTS );
		}
		//Clear plot storage array!
		CoC.flags = {};
		//Remember silly/sprite/etc
		if( sprite ) {
			CoC.flags[ kFLAGS.SHOW_SPRITES_FLAG ] = 1;
		}
		if( easy ) {
			CoC.flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] = 1;
		}
		if( silly ) {
			CoC.flags[ kFLAGS.SILLY_MODE_ENABLE_FLAG ] = 1;
		}
		//Set that jojo debug doesn't need to run
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00102 ] = 1;
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_02999 ] = 3;
		//Time reset
		CoC.time.days = 0;
		CoC.time.hours = 0;
		//Clear cocks
		while( CoC.player.cocks.length > 0 ) {
			CoC.player.removeCock( 0, 1 );
			$log.debug( '1 cock purged.' );
		}
		//Clear vaginas
		while( CoC.player.vaginas.length > 0 ) {
			CoC.player.removeVagina( 0, 1 );
			$log.debug( '1 vagina purged.' );
		}
		//Clear breasts
		CoC.player.breastRows = [];
		//Clear Statuses
		while( CoC.player.statusAffects.length > 0 ) {
			CoC.player.removeStatuses();
		}
		//Clear old camp slots
		SceneLib.inventory.clearStorage();
		SceneLib.inventory.clearGearStorage();
		//Initialize gearStorage
		SceneLib.inventory.initializeGearStorage();
	};
	CharCreation.prototype.chooseName = function() {
		if( MainView.nameBox.value === '' ) {
			//If part of newgame+, don't fully wipe.
			if( CoC.player.XP > 0 && CoC.player.explored === 0 ) {
				CoC.flags[ kFLAGS.NEW_GAME_PLUS_BONUS_STORED_XP ] = CoC.player.XP;
				if( CoC.flags[ kFLAGS.NEW_GAME_PLUS_BONUS_STORED_XP ] === 0 ) {
					CoC.flags[ kFLAGS.NEW_GAME_PLUS_BONUS_STORED_XP ] = 1;
				}
				while( CoC.player.level > 1 ) {
					CoC.flags[ kFLAGS.NEW_GAME_PLUS_BONUS_STORED_XP ] += CoC.player.level * 100;
					CoC.player.level--;
				}
				CoC.flags[ kFLAGS.NEW_GAME_PLUS_BONUS_STORED_ITEMS ] = CoC.player.gems;
			}
			this.newGameGo();
			EngineCore.outputText( '\n\n\n<b>You must select a name.</b>' );
			return;
		}
		EngineCore.clearOutput();
		MainView.nameBox.visible = false;
		CoC.player.short = MainView.nameBox.value;
		this.customPlayerProfile = this.customName( MainView.nameBox.value );
		EngineCore.menu();
		if( this.customPlayerProfile !== null ) {
			EngineCore.outputText( 'This name, like you, is special.  Do you live up to your name or continue on, assuming it to be coincidence?' );
			EngineCore.addButton( 0, 'SpecialName', this, this.useCustomProfile );
			EngineCore.addButton( 1, 'Continue On', this, this.noCustomProfile );
		} else { //Proceed with normal character creation
			EngineCore.outputText( '\n\n\n\nAre you a man or a woman?' );
			EngineCore.addButton( 0, 'Man', this, this.isAMan );
			EngineCore.addButton( 1, 'Woman', this, this.isAWoman );
		}
	};
	CharCreation.prototype.useCustomProfile = function() {
		EngineCore.clearOutput();
		if( this.specialName( MainView.nameBox.value ) !== null ) {
			EngineCore.clearOutput();
			EngineCore.outputText( 'Your name defines everything about you, and as such, it is time to wake...\n\n' );
			CoC.flags[ kFLAGS.HISTORY_PERK_SELECTED ] = 1;
			this.completeCharacterCreation(); //Skip character creation, this.customPlayerProfile will be called in completeCharacterCreation
		} else {
			//After character creation the fact that customPlayerProfile is not null will activate a custom player setup
			EngineCore.outputText( 'There is something different about you, but first, what is your basic gender?  An individual such as you may later overcome this, of course...' );
			EngineCore.outputText( '\n\n\n\nAre you a man or a woman?' );
			EngineCore.menu();
			EngineCore.addButton( 0, 'Man', this, this.isAMan );
			EngineCore.addButton( 1, 'Woman', this, this.isAWoman );
		}
	};
	CharCreation.prototype.noCustomProfile = function() {
		EngineCore.clearOutput();
		this.customPlayerProfile = null;
		EngineCore.outputText( 'Your name carries little significance beyond it being your name.  What is your gender?' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Man', this, this.isAMan );
		EngineCore.addButton( 1, 'Woman', this, this.isAWoman );
	};
	//Determines if has character creation bonuses
	CharCreation.prototype.customName = function( arg ) {
		switch( arg ) {
			case 'Aria' :
				return this.customAria;
			case 'Betram' :
				return this.customBetram;
			case 'Charaun' :
				return this.customCharaun;
			case 'Cody' :
				return this.customCody;
			case 'Galatea' :
				return this.customGalatea;
			case 'Gundam' :
				return this.customGundam;
			case 'Hikari' :
				return this.customHikari;
			case 'Katti' :
				return this.customKatti;
			case 'Lucina' :
				return this.customLucina;
			case 'Navorn' :
				return this.customNavorn;
			case 'Rope' :
				return this.customRope;
			case 'Sora' :
				return this.customSora;
		}
		return this.specialName( arg ); //Must check against the special name list as well
	};
	//Does PC skip creation?
	CharCreation.prototype.specialName = function( arg ) {
		switch( arg ) {
			case 'Annetta' :
				return this.customAnnetta;
			case 'Ceveo' :
				return this.customCeveo;
			case 'Charlie' :
				return this.customCharlie;
			case 'Isaac' :
				return this.customIsaac;
			case 'Leah' :
				return this.customLeah;
			case 'Lukaz' :
				return this.customLukaz;
			case 'Mara' :
				return this.customMara;
			case 'Mihari' :
				return this.customMihari;
			case 'Mirvanna' :
				return this.customMirvanna;
			case 'Nami' :
				return this.customNami;
			case 'Nixi' :
				return this.customNixi;
			case 'Prismere' :
				return this.customPrismere;
			case 'Rann Rayla' :
				return this.customRannRayla;
			case 'Sera' :
				return this.customSera;
			case 'Siveen' :
				return this.customSiveen;
			case 'TestChar' :
				return this.customTestChar;
			case 'Tyriana' :
				return this.customTyriana;
			case 'Vahdunbrii' :
				return this.customVahdunbrii;
		}
		return null;
	};
	CharCreation.prototype.isAMan = function() {
		CoC.player.str += 3;
		CoC.player.tou += 2;
		CoC.player.balls = 2;
		CoC.player.ballSize = 1;
		CoC.player.clitLength = 0;
		CoC.player.fertility = 5;
		CoC.player.hairLength = 1;
		CoC.player.tallness = 71;
		CoC.player.tone = 60;
		CoC.player.createBreastRow();
		CoC.player.createCock();
		CoC.player.cocks[ 0 ].cockLength = 5.5;
		CoC.player.cocks[ 0 ].cockThickness = 1;
		CoC.player.cocks[ 0 ].cockType = CockTypesEnum.HUMAN;
		CoC.player.cocks[ 0 ].knotMultiplier = 1;
		CoC.player.gender = AppearanceDefs.GENDER_MALE;
		EngineCore.clearOutput();
		EngineCore.outputText( 'You are a man.  Your upbringing has provided you an advantage in strength and toughness.\n\nWhat type of build do you have?' );
		EngineCore.choices( 'Lean', this, this.buildLeanMale, 'Average', this, this.buildAverageMale, 'Thick', this, this.buildThickMale, 'Girly', this, this.buildGirlyMale, '', null, null );
	};
	CharCreation.prototype.isAWoman = function() {
		CoC.player.spe += 3;
		CoC.player.inte += 2;
		CoC.player.balls = 0;
		CoC.player.ballSize = 0;
		CoC.player.clitLength = 0.5;
		CoC.player.fertility = 10;
		CoC.player.hairLength = 10;
		CoC.player.tallness = 67;
		CoC.player.tone = 30;
		CoC.player.createBreastRow();
		CoC.player.createVagina();
		CoC.player.gender = AppearanceDefs.GENDER_FEMALE;
		EngineCore.clearOutput();
		EngineCore.outputText( 'You are a woman.  Your upbringing has provided you an advantage in speed and intellect.\n\nWhat type of build do you have?' );
		EngineCore.choices( 'Slender', this, this.buildSlenderFemale, 'Average', this, this.buildAverageFemale, 'Curvy', this, this.buildCurvyFemale, 'Tomboyish', this, this.buildTomboyishFemale, '', null, null );
	};
	CharCreation.prototype.buildLeanMale = function() {
		CoC.player.str -= 1;
		CoC.player.spe += 1;
		CoC.player.femininity = 34;
		CoC.player.thickness = 30;
		CoC.player.tone += 5;
		CoC.player.breastRows[ 0 ].breastRating = AppearanceDefs.BREAST_CUP_FLAT;
		CoC.player.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		CoC.player.hipRating = AppearanceDefs.HIP_RATING_SLENDER;
		this.chooseComplexion();
	};
	CharCreation.prototype.buildSlenderFemale = function() {
		CoC.player.str -= 1;
		CoC.player.spe += 1;
		CoC.player.femininity = 66;
		CoC.player.thickness = 30;
		CoC.player.tone += 5;
		CoC.player.breastRows[ 0 ].breastRating = AppearanceDefs.BREAST_CUP_B;
		CoC.player.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		CoC.player.hipRating = AppearanceDefs.HIP_RATING_AMPLE;
		this.chooseComplexion();
	};
	CharCreation.prototype.buildAverageMale = function() {
		CoC.player.femininity = 30;
		CoC.player.thickness = 50;
		CoC.player.breastRows[ 0 ].breastRating = AppearanceDefs.BREAST_CUP_FLAT;
		CoC.player.buttRating = AppearanceDefs.BUTT_RATING_AVERAGE;
		CoC.player.hipRating = AppearanceDefs.HIP_RATING_AVERAGE;
		this.chooseComplexion();
	};
	CharCreation.prototype.buildAverageFemale = function() {
		CoC.player.femininity = 70;
		CoC.player.thickness = 50;
		CoC.player.breastRows[ 0 ].breastRating = AppearanceDefs.BREAST_CUP_C;
		CoC.player.buttRating = AppearanceDefs.BUTT_RATING_NOTICEABLE;
		CoC.player.hipRating = AppearanceDefs.HIP_RATING_AMPLE;
		this.chooseComplexion();
	};
	CharCreation.prototype.buildThickMale = function() {
		CoC.player.spe -= 4;
		CoC.player.str += 2;
		CoC.player.tou += 2;
		CoC.player.femininity = 29;
		CoC.player.thickness = 70;
		CoC.player.tone -= 5;
		CoC.player.breastRows[ 0 ].breastRating = AppearanceDefs.BREAST_CUP_FLAT;
		CoC.player.buttRating = AppearanceDefs.BUTT_RATING_NOTICEABLE;
		CoC.player.hipRating = AppearanceDefs.HIP_RATING_AVERAGE;
		this.chooseComplexion();
	};
	CharCreation.prototype.buildCurvyFemale = function() {
		CoC.player.spe -= 2;
		CoC.player.str += 1;
		CoC.player.tou += 1;
		CoC.player.femininity = 71;
		CoC.player.thickness = 70;
		CoC.player.breastRows[ 0 ].breastRating = AppearanceDefs.BREAST_CUP_D;
		CoC.player.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		CoC.player.hipRating = AppearanceDefs.HIP_RATING_CURVY;
		this.chooseComplexion();
	};
	CharCreation.prototype.buildGirlyMale = function() {
		CoC.player.str -= 2;
		CoC.player.spe += 2;
		CoC.player.femininity = 50;
		CoC.player.thickness = 50;
		CoC.player.tone = 26;
		CoC.player.breastRows[ 0 ].breastRating = AppearanceDefs.BREAST_CUP_A;
		CoC.player.buttRating = AppearanceDefs.BUTT_RATING_NOTICEABLE;
		CoC.player.hipRating = AppearanceDefs.HIP_RATING_SLENDER;
		this.chooseComplexion();
	};
	CharCreation.prototype.buildTomboyishFemale = function() {
		CoC.player.str += 1;
		CoC.player.spe -= 1;
		CoC.player.femininity = 56;
		CoC.player.thickness = 50;
		CoC.player.tone = 50;
		CoC.player.breastRows[ 0 ].breastRating = AppearanceDefs.BREAST_CUP_A;
		CoC.player.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		CoC.player.hipRating = AppearanceDefs.HIP_RATING_SLENDER;
		this.chooseComplexion();
	};
	CharCreation.prototype.chooseComplexion = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'What is your complexion?' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Light', this, this.setComplexion, 'light' );
		EngineCore.addButton( 1, 'Olive', this, this.setComplexion, 'olive' );
		EngineCore.addButton( 2, 'Dark', this, this.setComplexion, 'dark' );
		EngineCore.addButton( 3, 'Ebony', this, this.setComplexion, 'ebony' );
	};
	CharCreation.prototype.setComplexion = function( choice ) { //And choose hair
		CoC.player.skinTone = choice;
		EngineCore.clearOutput();
		EngineCore.outputText( 'You selected a ' + choice + ' complexion.\n\nWhat color is your hair?' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Blonde', this, this.setHair, 'blonde' );
		EngineCore.addButton( 1, 'Brown', this, this.setHair, 'brown' );
		EngineCore.addButton( 2, 'Black', this, this.setHair, 'black' );
		EngineCore.addButton( 3, 'Red', this, this.setHair, 'red' );
		EngineCore.addButton( 4, 'Gray', this, this.setHair, 'gray' );
		EngineCore.addButton( 5, 'White', this, this.setHair, 'white' );
		EngineCore.addButton( 6, 'Auburn', this, this.setHair, 'auburn' );
	};
	CharCreation.prototype.setHair = function( choice ) {
		CoC.player.hairColor = choice;
		EngineCore.clearOutput();
		EngineCore.outputText( 'You have ' + Descriptors.hairDescript() + '.' );
		this.chooseEndowment( false );
	};
	CharCreation.prototype.chooseEndowment = function( clear ) {
		if( clear ) {
			EngineCore.clearOutput();
		}
		EngineCore.outputText( 'Every person is born with a gift.  What\'s yours?' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Strength', this, this.confirmEndowmentStrength );
		EngineCore.addButton( 1, 'Toughness', this, this.confirmEndowmentThoughness );
		EngineCore.addButton( 2, 'Speed', this, this.confirmEndowmentSpeed );
		EngineCore.addButton( 3, 'Smarts', this, this.confirmEndowmentSmarts );
		EngineCore.addButton( 4, 'Libido', this, this.confirmEndowmentLibido );
		EngineCore.addButton( 5, 'Touch', this, this.confirmEndowmentTouch );
		if( CoC.player.hasCock() ) {
			EngineCore.addButton( 6, 'Big Cock', this, this.confirmEndowmentBigCock );
			EngineCore.addButton( 7, 'Lots of Jizz', this, this.confirmEndowmentMessyOrgasms );
		} else {
			EngineCore.addButton( 6, 'Big Breasts', this, this.confirmEndowmentBigBreasts );
			EngineCore.addButton( 7, 'Big Clit', this, this.confirmEndowmentBigClit );
			EngineCore.addButton( 8, 'Fertile', this, this.confirmEndowmentFertile );
			EngineCore.addButton( 9, 'Wet Vagina', this, this.confirmEndowmentWetVagina );
		}
	};
	CharCreation.prototype.confirmEndowmentStrength = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Are you stronger than normal? (+5 Strength)\n\nStrength increases your combat damage, and your ability to hold on to an enemy or pull yourself away.' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Yes', this, this.setEndowmentStrength );
		EngineCore.addButton( 1, 'No', this, this.chooseEndowment, true );
	};
	CharCreation.prototype.confirmEndowmentThoughness = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Are you unusually tough? (+5 Toughness)\n\nToughness gives you more HP and increases the chances an attack against you will fail to wound you.' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Yes', this, this.setEndowmentToughness );
		EngineCore.addButton( 1, 'No', this, this.chooseEndowment, true );
	};
	CharCreation.prototype.confirmEndowmentSpeed = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Are you very quick?  (+5 Speed)\n\nSpeed makes it easier to escape combat and grapples.  It also boosts your chances of evading an enemy attack and successfully catching up to enemies who try to run.' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Yes', this, this.setEndowmentSpeed );
		EngineCore.addButton( 1, 'No', this, this.chooseEndowment, true );
	};
	CharCreation.prototype.confirmEndowmentSmarts = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Are you a quick learner?  (+5 Intellect)\n\nIntellect can help you avoid dangerous monsters or work with machinery.  It will also boost the power of any spells you may learn in your travels.' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Yes', this, this.setEndowmentSmarts );
		EngineCore.addButton( 1, 'No', this, this.chooseEndowment, true );
	};
	CharCreation.prototype.confirmEndowmentLibido = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Do you have an unusually high sex-drive?  (+5 Libido)\n\nLibido affects how quickly your lust builds over time.  You may find a high libido to be more trouble than it\'s worth...' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Yes', this, this.setEndowmentLibido );
		EngineCore.addButton( 1, 'No', this, this.chooseEndowment, true );
	};
	CharCreation.prototype.confirmEndowmentTouch = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Is your skin unusually sensitive?  (+5 Sensitivity)\n\nSensitivity affects how easily touches and certain magics will raise your lust.  Very low sensitivity will make it difficult to orgasm.' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Yes', this, this.setEndowmentTouch );
		EngineCore.addButton( 1, 'No', this, this.chooseEndowment, true );
	};
	CharCreation.prototype.confirmEndowmentBigCock = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Do you have a big cock?  (+2" Cock Length)\n\nA bigger cock will make it easier to get off any sexual partners, but only if they can take your size.' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Yes', this, this.setEndowmentBigCock );
		EngineCore.addButton( 1, 'No', this, this.chooseEndowment, true );
	};
	CharCreation.prototype.confirmEndowmentMessyOrgasms = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Are your orgasms particularly messy?  (+50% Cum Multiplier)\n\nA higher cum multiplier will cause your orgasms to be messier.' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Yes', this, this.setEndowmentMessyOrgasms );
		EngineCore.addButton( 1, 'No', this, this.chooseEndowment, true );
	};
	CharCreation.prototype.confirmEndowmentBigBreasts = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Are your breasts bigger than average? (DD cups)\n\nLarger breasts will allow you to lactate greater amounts, tit-fuck larger cocks, and generally be a sexy bitch.' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Yes', this, this.setEndowmentBigBreasts );
		EngineCore.addButton( 1, 'No', this, this.chooseEndowment, true );
	};
	CharCreation.prototype.confirmEndowmentBigClit = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Do you have a big clit?  (1" Long)\n\nA large enough clit may eventually become as large as a cock.  It also makes you gain lust much faster during oral or manual stimulation.' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Yes', this, this.setEndowmentBigClit );
		EngineCore.addButton( 1, 'No', this, this.chooseEndowment, true );
	};
	CharCreation.prototype.confirmEndowmentFertile = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Is your family particularly fertile?  (+15% Fertility)\n\nA high fertility will cause you to become pregnant much more easily.  Pregnancy may result in children, larger bust, larger hips, a bigger ass, and other weirdness.' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Yes', this, this.setEndowmentFertile );
		EngineCore.addButton( 1, 'No', this, this.chooseEndowment, true );
	};
	CharCreation.prototype.confirmEndowmentWetVagina = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Does your pussy get particularly wet?  (+1 Vaginal Wetness)\n\nVaginal wetness will make it easier to take larger cocks, in turn helping you bring the well-endowed to orgasm quicker.' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Yes', this, this.setEndowmentWetVagina );
		EngineCore.addButton( 1, 'No', this, this.chooseEndowment, true );
	};
	CharCreation.prototype.setEndowmentStrength = function() {
		CoC.player.str += 5;
		CoC.player.tone += 7;
		CoC.player.thickness += 3;
		//Add bonus +25% strength gain
		CoC.player.createPerk( PerkLib.Strong, 0.25, 0, 0, 0 );
		this.chooseHistory();
	};
	CharCreation.prototype.setEndowmentToughness = function() {
		CoC.player.tou += 5;
		CoC.player.tone += 5;
		CoC.player.thickness += 5;
		CoC.player.createPerk( PerkLib.Tough, 0.25, 0, 0, 0 );
		CoC.player.HP = CoC.maxHP();
		this.chooseHistory();
	};
	CharCreation.prototype.setEndowmentSpeed = function() {
		CoC.player.spe += 5;
		CoC.player.tone += 10;
		CoC.player.createPerk( PerkLib.Fast, 0.25, 0, 0, 0 );
		this.chooseHistory();
	};
	CharCreation.prototype.setEndowmentSmarts = function() {
		CoC.player.inte += 5;
		CoC.player.thickness -= 5;
		CoC.player.createPerk( PerkLib.Smart, 0.25, 0, 0, 0 );
		this.chooseHistory();
	};
	CharCreation.prototype.setEndowmentLibido = function() {
		CoC.player.lib += 5;
		CoC.player.createPerk( PerkLib.Lusty, 0.25, 0, 0, 0 );
		this.chooseHistory();
	};
	CharCreation.prototype.setEndowmentTouch = function() {
		CoC.player.sens += 5;
		CoC.player.createPerk( PerkLib.Sensitive, 0.25, 0, 0, 0 );
		this.chooseHistory();
	};
	CharCreation.prototype.setEndowmentBigCock = function() {
		CoC.player.femininity -= 5;
		CoC.player.cocks[ 0 ].cockLength = 8;
		CoC.player.cocks[ 0 ].cockThickness = 1.5;
		$log.debug( 'Creation - cock modded to 8inches' );
		CoC.player.createPerk( PerkLib.BigCock, 1.25, 0, 0, 0 );
		this.chooseHistory();
	};
	CharCreation.prototype.setEndowmentMessyOrgasms = function() {
		CoC.player.femininity -= 2;
		CoC.player.cumMultiplier = 1.5;
		CoC.player.createPerk( PerkLib.MessyOrgasms, 1.25, 0, 0, 0 );
		this.chooseHistory();
	};
	CharCreation.prototype.setEndowmentBigBreasts = function() {
		CoC.player.femininity += 5;
		CoC.player.breastRows[ 0 ].breastRating += 2;
		CoC.player.createPerk( PerkLib.BigTits, 1.5, 0, 0, 0 );
		this.chooseHistory();
	};
	CharCreation.prototype.setEndowmentBigClit = function() {
		CoC.player.femininity -= 5;
		CoC.player.clitLength = 1;
		CoC.player.createPerk( PerkLib.BigClit, 1.25, 0, 0, 0 );
		this.chooseHistory();
	};
	CharCreation.prototype.setEndowmentFertile = function() {
		CoC.player.femininity += 5;
		CoC.player.fertility += 25;
		CoC.player.hipRating += 2;
		CoC.player.createPerk( PerkLib.Fertile, 1.5, 0, 0, 0 );
		this.chooseHistory();
	};
	CharCreation.prototype.setEndowmentWetVagina = function() {
		CoC.player.femininity += 7;
		CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_WET;
		CoC.player.createPerk( PerkLib.WetPussy, 2, 0, 0, 0 );
		this.chooseHistory();
	};
	CharCreation.prototype.chooseHistory = function() {
		EngineCore.clearOutput();
		if( CoC.flags[ kFLAGS.HISTORY_PERK_SELECTED ] !== 0 ) { //This flag can only be non-zero if chooseHistory is called from camp.as
			EngineCore.outputText( '<b>New history perks are available during creation.  Since this character was created before they were available, you may choose one now!</b>\n\n' );
		}
		EngineCore.outputText( 'Before you became a champion, you had other plans for your life.  What were you doing before?' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Alchemy', this, this.confirmHistory, PerkLib.HistoryAlchemist );
		EngineCore.addButton( 1, 'Fighting', this, this.confirmHistory, PerkLib.HistoryFighter );
		EngineCore.addButton( 2, 'Healing', this, this.confirmHistory, PerkLib.HistoryHealer );
		EngineCore.addButton( 3, 'Religion', this, this.confirmHistory, PerkLib.HistoryReligious );
		EngineCore.addButton( 4, 'Schooling', this, this.confirmHistory, PerkLib.HistoryScholar );
		EngineCore.addButton( 5, 'Slacking', this, this.confirmHistory, PerkLib.HistorySlacker );
		EngineCore.addButton( 6, 'Slutting', this, this.confirmHistory, PerkLib.HistorySlut );
		EngineCore.addButton( 7, 'Smithing', this, this.confirmHistory, PerkLib.HistorySmith );
		EngineCore.addButton( 8, 'Whoring', this, this.confirmHistory, PerkLib.HistoryWhore );
	};
	CharCreation.prototype.confirmHistory = function( choice ) {
		EngineCore.clearOutput();
		switch( choice ) {
			case PerkLib.HistoryAlchemist:
				EngineCore.outputText( 'You spent some time as an alchemist\'s assistant, and alchemical items always seem to be more reactive in your hands.  Is this your history?' );
				break;
			case PerkLib.HistoryFighter:
				EngineCore.outputText( 'You spent much of your time fighting other children, and you had plans to find work as a guard when you grew up.  You do 10% more damage with physical attacks.  Is this your history?' );
				break;
			case PerkLib.HistoryHealer:
				EngineCore.outputText( 'You often spent your free time with the village healer, learning how to tend to wounds.  Healing items and effects are 20% more effective.  Is this your history?' );
				break;
			case PerkLib.HistoryReligious:
				EngineCore.outputText( 'You spent a lot of time at the village temple, and learned how to meditate.  The "masturbation" option is replaced with "meditate" when corruption is at or below 66.  Is this your history?' );
				break;
			case PerkLib.HistoryScholar:
				EngineCore.outputText( 'You spent much of your time in school, and even begged the richest man in town, Mr. Savin, to let you read some of his books.  You are much better at focusing, and spellcasting uses 20% less fatigue.  Is this your history?' );
				break;
			case PerkLib.HistorySlacker:
				EngineCore.outputText( 'You spent a lot of time slacking, avoiding work, and otherwise making a nuisance of yourself.  Your efforts at slacking have made you quite adept at resting, and your fatigue comes back 20% faster.  Is this your history?' );
				break;
			case PerkLib.HistorySlut:
				EngineCore.outputText( 'You managed to spend most of your time having sex.  Quite simply, when it came to sex, you were the village bicycle - everyone got a ride.  Because of this, your body is a bit more resistant to penetrative stretching, and has a higher upper limit on what exactly can be inserted.  Is this your history?' );
				break;
			case PerkLib.HistorySmith:
				EngineCore.outputText( 'You managed to get an apprenticeship with the local blacksmith.  Because of your time spent at the blacksmith\'s side, you\'ve learned how to fit armor for maximum protection.  Is this your history?' );
				break;
			default:
				EngineCore.outputText( 'You managed to find work as a whore.  Because of your time spent trading seduction for profit, you\'re more effective at teasing (+15% tease damage).  Is this your history?' );
		}
		EngineCore.menu();
		EngineCore.addButton( 0, 'Yes', this, this.setHistory, choice );
		EngineCore.addButton( 1, 'No', this, this.chooseHistory );
	};
	CharCreation.prototype.setHistory = function( choice ) {
		CoC.player.createPerk( choice, 0, 0, 0, 0 );
		if( choice === PerkLib.HistorySlut || choice === PerkLib.HistoryWhore ) {
			if( CoC.player.hasVagina() ) {
				CoC.player.vaginas[ 0 ].virgin = false;
				CoC.player.vaginas[ 0 ].vaginalLooseness = AppearanceDefs.VAGINA_LOOSENESS_LOOSE;
			}
			CoC.player.ass.analLooseness = 1;
		}
		if( CoC.flags[ kFLAGS.HISTORY_PERK_SELECTED ] === 0 ) {
			CoC.flags[ kFLAGS.HISTORY_PERK_SELECTED ] = 1;
			this.completeCharacterCreation();
		} else { //Special escape clause for very old saves that do not have a history perk. This is used to allow them the chance to select a perk at camp on load.
			CoC.flags[ kFLAGS.HISTORY_PERK_SELECTED ] = 1;
			MainView.playerMenu();
		}
	};
	CharCreation.prototype.completeCharacterCreation = function() {
		if( this.customPlayerProfile !== null ) {
			this.customPlayerProfile();
			EngineCore.doNext( this, this.arrival );
			return;
		}
		this.arrival();
	};
	CharCreation.prototype.arrival = function() {
		EngineCore.statScreenRefresh();
		CoC.time.hours = 11;
		EngineCore.clearOutput();
		EngineCore.outputText( 'You are prepared for what is to come.  Most of the last year has been spent honing your body and mind to prepare for the challenges ahead.  You are the Champion of Ingnam.  The one who will journey to the demon realm and guarantee the safety of your friends and family, even though you\'ll never see them again.  You wipe away a tear as you enter the courtyard and see Elder Nomur waiting for you.  You are ready.\n\n' );
		EngineCore.outputText( 'The walk to the tainted cave is long and silent.  Elder Nomur does not speak.  There is nothing left to say.  The two of you journey in companionable silence.  Slowly the black rock of Mount Ilgast looms closer and closer, and the temperature of the air drops.   You shiver and glance at the Elder, noticing he doesn\'t betray any sign of the cold.  Despite his age of nearly 80, he maintains the vigor of a man half his age.  You\'re glad for his strength, as assisting him across this distance would be draining, and you must save your energy for the trials ahead.\n\n' );
		EngineCore.outputText( 'The entrance of the cave gapes open, sharp stalactites hanging over the entrance, giving it the appearance of a monstrous mouth.  Elder Nomur stops and nods to you, gesturing for you to proceed alone.\n\n' );
		EngineCore.outputText( 'The cave is unusually warm and damp, ' );
		if( CoC.player.gender === AppearanceDefs.GENDER_FEMALE ) {
			EngineCore.outputText( 'and your body seems to feel the same way, flushing as you feel a warmth and dampness between your thighs. ' );
		} else {
			EngineCore.outputText( 'and your body reacts with a sense of growing warmth focusing in your groin, your manhood hardening for no apparent reason. ' );
		}
		EngineCore.outputText( 'You were warned of this and press forward, ignoring your body\'s growing needs.  A glowing purple-pink portal swirls and flares with demonic light along the back wall.  Cringing, you press forward, keenly aware that your body seems to be anticipating coming in contact with the tainted magical construct.  Closing your eyes, you gather your resolve and leap forwards.  Vertigo overwhelms you and you black out...' );
		EngineCore.showStats();
		EngineCore.dynStats( 'lus', 15 );
		EngineCore.doNext( this, this.arrivalPartTwo );
	};
	CharCreation.prototype.arrivalPartTwo = function() {
		EngineCore.clearOutput();
		EngineCore.hideUpDown();
		EngineCore.dynStats( 'lus', 40, 'cor', 2 );
		CoC.time.hours = 18;
		EngineCore.outputText( 'You wake with a splitting headache and a body full of burning desire.  A shadow darkens your view momentarily and your training kicks in.  You roll to the side across the bare ground and leap to your feet.  A surprised looking imp stands a few feet away, holding an empty vial.  He\'s completely naked, an improbably sized pulsing red cock hanging between his spindly legs.  You flush with desire as a wave of lust washes over you, your mind reeling as you fight ' );
		if( CoC.player.gender === AppearanceDefs.GENDER_FEMALE ) {
			EngineCore.outputText( 'the urge to chase down his rod and impale yourself on it.\n\n' );
		} else {
			EngineCore.outputText( 'the urge to ram your cock down his throat.  The strangeness of the thought surprises you.\n\n' );
		}
		EngineCore.outputText( 'The imp says, "<i>I\'m amazed you aren\'t already chasing down my cock, human.  The last Champion was an eager whore for me by the time she woke up.  This lust draft made sure of it.</i>"' );
		EngineCore.doNext( this, this.arrivalPartThree );
	};
	CharCreation.prototype.arrivalPartThree = function() {
		EngineCore.clearOutput();
		EngineCore.hideUpDown();
		EngineCore.dynStats( 'lus', -30 );
		EngineCore.outputText( 'The imp shakes the empty vial to emphasize his point.  You reel in shock at this revelation - you\'ve just entered the demon realm and you\'ve already been drugged!  You tremble with the aching need in your groin, but resist, righteous anger lending you strength.\n\nIn desperation you leap towards the imp, watching with glee as his cocky smile changes to an expression of sheer terror.  The smaller creature is no match for your brute strength as you pummel him mercilessly.  You pick up the diminutive demon and punt him into the air, frowning grimly as he spreads his wings and begins speeding into the distance.\n\n' );
		EngineCore.outputText( 'The imp says, "<i>FOOL!  You could have had pleasure unending... but should we ever cross paths again you will regret humiliating me!  Remember the name Zetaz, as you\'ll soon face the wrath of my master!</i>"\n\n' );
		EngineCore.outputText( 'Your pleasure at defeating the demon ebbs as you consider how you\'ve already been defiled.  You swear to yourself you will find the demon responsible for doing this to you and the other Champions, and destroy him AND his pet imp.' );
		EngineCore.doNext( this, this.arrivalPartFour );
	};
	CharCreation.prototype.arrivalPartFour = function() {
		EngineCore.clearOutput();
		EngineCore.hideUpDown();
		EngineCore.outputText( 'You look around, surveying the hellish landscape as you plot your next move.  The portal is a few yards away, nestled between a formation of rocks.  It does not seem to exude the arousing influence it had on the other side.  The ground and sky are both tinted different shades of red, though the earth beneath your feet feels as normal as any other lifeless patch of dirt.   You settle on the idea of making a camp here and fortifying this side of the portal.  No demons will ravage your beloved hometown on your watch.\n\nIt does not take long to set up your tent and a few simple traps.  You\'ll need to explore and gather more supplies to fortify it any further.  Perhaps you will even manage to track down the demons who have been abducting the other champions!' );
		EngineCore.doNext( MainView, MainView.playerMenu );
	};
	CharCreation.prototype.customAnnetta = function() {
		EngineCore.outputText( 'You\'re a rather well-endowed hermaphrodite that sports a thick, dog-knotted cock, an unused pussy, and a nice, stretchy butt-hole.  You\'ve also got horns and demonic high-heels on your feet.  It makes you wonder why you would ever get chosen to be champion!' );
		//Specific Character	'Gender
		//Penis inch long 3 inch wide penis, dog shaped, 6.5 inch knot
		//Balls 5 inch wide
		//Vagina, virgin, 0.5 inch clitoris
		CoC.player.createVagina();
		CoC.player.createCock();
		CoC.player.createBreastRow();
		CoC.player.clitLength = 0.5;
		CoC.player.tallness = 67;
		CoC.player.femininity = 90;
		CoC.player.balls = 2;
		CoC.player.ballSize = 5;
		CoC.player.cocks[ 0 ].cockLength = 13;
		CoC.player.cocks[ 0 ].cockThickness = 3;
		CoC.player.cocks[ 0 ].knotMultiplier = 2.2;
		//Butt	'Skin: Purple
		CoC.player.ass.analLooseness = 3;
		CoC.player.skinTone = 'purple';
		//Hair length orange
		CoC.player.hairLength = 30;
		CoC.player.hairColor = 'orange';
		//Face ears, 4x demonic horns
		CoC.player.earType = AppearanceDefs.EARS_ELFIN;
		CoC.player.horns = 4;
		CoC.player.hornType = AppearanceDefs.HORNS_DEMON;
		//Body, no muscle tone, wide thighs, badonkulous ass, demon tail, demonic high heels
		CoC.player.thickness = 75;
		CoC.player.tone = 0;
		CoC.player.hipRating = 17;
		CoC.player.buttRating = 17;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_DEMONIC;
		CoC.player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_HIGH_HEELS;
		//Breasts with 5 inch fuckable nipples, leaking milk
		CoC.player.breastRows[ 0 ].breastRating = 28;
		CoC.player.nippleLength = 5;
		CoC.player.breastRows[ 0 ].lactationMultiplier += 20;
		//Equipment with spiked fist
		CoC.player.setWeapon( WeaponLib.S_GAUNT );
		//Perks and Lotsa Jizz'	Annetta
		CoC.player.createPerk( PerkLib.HistoryFighter, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.MessyOrgasms, 1.25, 0, 0, 0 );
		CoC.player.cumMultiplier = 20;
		CoC.player.gender = 3;
	};
	CharCreation.prototype.customAria = function() {
		EngineCore.outputText( 'It\'s really no surprise that you were sent through the portal to deal with the demons - you look enough like one as-is.  Your numerous fetish-inducing piercings, magical fox-tails, and bimbo-licious personality were all the motivation the elders needed to keep you from corrupting the village youth.' );
		//2/26/2013 8	rdolave@gmail.com	Character Creation	'female DD breasts feminity 100 butt size 5 hip size 5 body thickness 10 clit I would like her nipples pierced with Ceraphs piercing
		//(on a side note how much do you think it would cost to add bell nipple,labia and clit piercings as well as an option for belly button piercings would like to see belly button piecings with a few different options as well.  Also would love to have handcuff ear piercings.)'	Would like the bimbo brain and bimbo body perks as well as the nine tail PerkLib.  demonic high heels, pink skin, obscenely long pink hair  would like her to be a kitsune with the nine tails.  pink fur.  starting equipment would like to be the succubus whip and nurse's outfit.  Also would like the xmas perk and all three Vday perks	Aria
		if( !CoC.player.hasVagina() ) {
			CoC.player.createVagina();
		}
		if( CoC.player.femininity < 80 ) {
			CoC.player.femininity = 80;
		}
		CoC.player.createPerk( PerkLib.BimboBody, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.BimboBrains, 0, 0, 0, 0 );
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_FOX;
		CoC.player.tailVenom = 9;
		CoC.player.createPerk( PerkLib.EnlightenedNinetails, 0, 0, 0, 0 );
		CoC.player.breastRows[ 0 ].breastRating = 5;
		CoC.player.femininity = 100;
		CoC.player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DEMONIC_HIGH_HEELS;
		CoC.player.skinTone = 'pink';
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		CoC.player.skinDesc = 'fur';
		CoC.player.hairColor = 'pink';
		CoC.player.hairLength = 50;
		CoC.player.hipRating = 5;
		CoC.player.buttRating = 5;
		CoC.player.thickness = 10;
		CoC.flags[ kFLAGS.PC_FETISH ] = 2;
		CoC.player.earsPierced = 1;
		CoC.player.earsPShort = 'green gem-stone handcuffs';
		CoC.player.earsPLong = 'Green gem-stone handcuffs';
		CoC.player.nipplesPierced = 1;
		CoC.player.nipplesPShort = 'seamless black nipple-studs';
		CoC.player.nipplesPLong = 'Seamless black nipple-studs';
		CoC.flags[ kFLAGS.PC_FETISH ] = 2;
		CoC.player.vaginas[ 0 ].clitPierced = 1;
		CoC.player.vaginas[ 0 ].clitPShort = 'emerald clit-stud';
		CoC.player.vaginas[ 0 ].clitPLong = 'Emerald clit-stud';
		CoC.player.vaginas[ 0 ].labiaPierced = 2;
		CoC.player.vaginas[ 0 ].labiaPShort = 'ruby labia-rings';
		CoC.player.vaginas[ 0 ].labiaPLong = 'Ruby labia-rings';
		CoC.player.createPerk( PerkLib.ElvenBounty, 0, 15, 0, 0 );
		CoC.player.createPerk( PerkLib.PureAndLoving, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.SensualLover, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.OneTrackMind, 0, 0, 0, 0 );
		CoC.player.setWeapon( WeaponLib.SUCWHIP );
		CoC.player.setArmor( ArmorLib.NURSECL );
	};
	CharCreation.prototype.customBetram = function() {
		//Character Creation
		//herm, canine cock - 8', virgin, tight, wet
		//fox ears, tails, A cup breasts with normal nipples	Betram
		CoC.player.earType = AppearanceDefs.EARS_FOX;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_FOX;
		CoC.player.tailVenom = 1;
		if( CoC.player.biggestTitSize() > 1 ) {
			CoC.player.breastRows[ 0 ].breastRating = 1;
		}
		if( !CoC.player.hasCock() ) {
			CoC.player.createCock();
			CoC.player.cocks[ 0 ].cockType = CockTypesEnum.DOG;
			CoC.player.cocks[ 0 ].cockLength = 8;
			CoC.player.cocks[ 0 ].cockThickness = 1;
			CoC.player.cocks[ 0 ].knotMultiplier = 1.4;
		}
		if( !CoC.player.hasVagina() ) {
			CoC.player.createVagina();
			CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_WET;
			CoC.player.clitLength = 0.25;
		}
		CoC.player.gender = 3;
		EngineCore.outputText( 'You\'re quite the foxy herm, and as different as you were compared to the rest of Ingnam, it\'s no suprise you were sent through first.' );
	};
	CharCreation.prototype.customCeveo = function() {
		//Male. 2 cock. 5.5 average thickness and 12 in with excessive thickness both pierced with silver rings. Balls, large, about the size of a billiard ball, four of them. All humanish, more details on the character.
		CoC.player.createCock();
		CoC.player.createCock();
		CoC.player.balls = 4;
		CoC.player.ballSize = 3;
		CoC.player.cocks[ 0 ].cockThickness = 5.5;
		CoC.player.cocks[ 1 ].cockThickness = 5.5;
		CoC.player.cocks[ 0 ].cockLength = 12;
		CoC.player.cocks[ 1 ].cockLength = 12;
		CoC.player.cocks[ 0 ].pierced = 2;
		CoC.player.cocks[ 1 ].pierced = 2;
		CoC.player.cocks[ 0 ].pShortDesc = 'silver cock-ring';
		CoC.player.cocks[ 1 ].pShortDesc = 'silver cock-ring';
		CoC.player.cocks[ 0 ].pLongDesc = 'Silver cock-ring';
		CoC.player.cocks[ 1 ].pLongDesc = 'Silver cock-ring';
		//'Androgynous face, large brown eyes, long black hair down to about ass level, full lips, pirced with one silver ring ass itself is round and thick, chest is flat, only two nipples, about nickle sized pierced with silver studs, skin of a pale ghostly transparent complexion, rest of the body is not notably muscular or chubby in any definite way, feet seem to taper off into full transparency. Full body housed in the lewd Inquisitor Armor, wielding a Wizard Staff. Starting at level 5 with tank, regeneration, healing, smarts, channeling, mage and incorperability perks, a full knowledge of
		CoC.player.gender = 1;
		CoC.player.tallness = 72;
		CoC.player.femininity = 50;
		CoC.player.hairLength = 35;
		CoC.player.hairColor = 'black';
		CoC.player.lipPierced = 2;
		CoC.player.lipPShort = 'silver lip-ring';
		CoC.player.lipPLong = 'Silver lip-ring';
		CoC.player.buttRating = 8;
		CoC.player.hipRating = 8;
		CoC.player.createBreastRow();
		CoC.player.nipplesPierced = 1;
		CoC.player.nipplesPShort = 'silver studs';
		CoC.player.nipplesPLong = 'Silver studs';
		CoC.player.skinTone = 'ghostly pale';
		CoC.player.createPerk( PerkLib.Incorporeality, 0, 0, 0, 0 );
		CoC.player.setArmor( ArmorLib.I_CORST );
		CoC.player.level = 5;
		CoC.player.setWeapon( WeaponLib.W_STAFF );
		CoC.player.createPerk( PerkLib.Regeneration, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Smart, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Channeling, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Mage, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.HistoryHealer, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Tank, 0, 0, 0, 0 );
		CoC.player.createStatusAffect( StatusAffects.KnowsArouse, 0, 0, 0, 0 );
		CoC.player.createStatusAffect( StatusAffects.KnowsHeal, 0, 0, 0, 0 );
		CoC.player.createStatusAffect( StatusAffects.KnowsMight, 0, 0, 0, 0 );
		CoC.player.createStatusAffect( StatusAffects.KnowsCharge, 0, 0, 0, 0 );
		CoC.player.createStatusAffect( StatusAffects.KnowsBlind, 0, 0, 0, 0 );
		CoC.player.createStatusAffect( StatusAffects.KnowsWhitefire, 0, 0, 0, 0 );
		//magic, 50 Int, 50 tough, Speed 15, Str 10, 30 corruption, 30 libido, 10 sensitivity.
		CoC.player.inte = 50;
		CoC.player.tou = 50;
		CoC.player.spe = 15;
		CoC.player.str = 10;
		CoC.player.cor = 30;
		CoC.player.lib = 30;
		CoC.player.sens = 10;
		EngineCore.outputText( 'As a wandering mage you had found your way into no small amount of trouble in the search for knowledge.  A strange tome here, a ritual there, most people found your pale form unsettling. They would be further troubled if they could see your feet!  Lets not even begin on the blood magic.  Yes, your interest in examining every aspect of magic has run you down a strange path, so when you wandered into Ingram and began to hear of the exile of the Champion, and the superstitions that surrounded it you were intrigued, as every little rumor and ritual often had a grain of truth.  You snuck into the cave prior to the ritual, where the old man supposedly led every Champion, and there you found a strange portal that emanated a certain degree of spacial transparency -  more than the portal\'s own.  Within it must have been a whole new world!  Throwing caution to the wind, your curiosities engulfing you, you dove in with nary a thought for the consequences.' );
	};
	CharCreation.prototype.customCharaun = function() {
		EngineCore.outputText( 'As a gifted fox with a juicy, thick knot, a wet cunt, and magical powers, you have no problems with being chosen as champion.' );
		//Herm, Fox Cock x 1.4'w, knot multiplier 3.6), No Balls, Cum Multiplier,500, Vaginal Wetness, Clit length, Virgin, Fertility	9-tailed 'enlightened' kitsune( a pure-blooded kitsune with the 'Enlightened Nine-tails' perk and magic specials)
		if( !CoC.player.hasCock() ) {
			CoC.player.createCock();
		}
		if( !CoC.player.hasVagina() ) {
			CoC.player.createVagina();
		}
		CoC.player.gender = 3;
		CoC.player.cocks[ 0 ].cockLength = 27;
		CoC.player.cocks[ 0 ].cockThickness = 1.4;
		CoC.player.cocks[ 0 ].knotMultiplier = 3.6;
		CoC.player.cocks[ 0 ].cockType = CockTypesEnum.DOG;
		CoC.player.balls = 0;
		CoC.player.ballSize = 2;
		CoC.player.cumMultiplier = 7500;
		CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_SLAVERING;
		CoC.player.clitLength = 0.5;
		CoC.player.fertility = 15;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_FOX;
		CoC.player.tailVenom = 9;
		CoC.player.createPerk( PerkLib.EnlightenedNinetails, 0, 0, 0, 0 );
		//if possible with fur, Hair color black', Skin/Fur color grayish-blue',  Height, Tone, Thickness, Hip rating, Butt rating,Feminimity: 50,  ( 4 rows of breasts (Descending from the top ones,C,B,A), nipple length, Fuckable, 1 nipple per breast, Tongue type
		CoC.player.hairColor = 'midnight black';
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		CoC.player.skinDesc = 'fur';
		CoC.player.skinTone = 'ashen grayish-blue';
		CoC.player.tallness = 65;
		CoC.player.tone = 100;
		CoC.player.thickness = 0;
		CoC.player.hipRating = 6;
		CoC.player.buttRating = 3;
		CoC.player.femininity = 50;
		CoC.player.createBreastRow();
		CoC.player.createBreastRow();
		CoC.player.createBreastRow();
		CoC.player.breastRows[ 0 ].breastRating = 4;
		CoC.player.breastRows[ 0 ].fuckable = true;
		CoC.player.breastRows[ 1 ].breastRating = 3;
		CoC.player.breastRows[ 1 ].fuckable = true;
		CoC.player.breastRows[ 2 ].breastRating = 2;
		CoC.player.breastRows[ 2 ].fuckable = true;
		CoC.player.breastRows[ 3 ].breastRating = 1;
		CoC.player.breastRows[ 3 ].fuckable = true;
		CoC.player.tongueType = AppearanceDefs.TONUGE_DEMONIC;
		CoC.player.nippleLength = 0.1;
		//Starting with an Inscribed Spellblade and Bondage Straps.	Charaun
		CoC.player.setArmor( ArmorLib.BONSTRP );
		CoC.player.setWeapon( WeaponLib.S_BLADE );
	};
	CharCreation.prototype.customCharlie = function() {
		EngineCore.outputText( 'You\'re strong, smart, fast, and tough.  It also helps that you\'ve got four dongs well beyond what others have lurking in their trousers.  With your wings, bow, weapon, and tough armor, you\'re a natural for protecting the town.' );
		CoC.player.gender = 1;
		CoC.player.tou += 2;
		CoC.player.str += 3;
		CoC.player.fertility = 5;
		CoC.player.hairLength = 26;
		CoC.player.hairColor = 'blond';
		CoC.player.skinTone = 'light';
		CoC.player.nippleLength = 0.2;
		CoC.player.createBreastRow();
		CoC.player.breastRows[ 0 ].breastRating = 0;
		CoC.player.balls = 2;
		CoC.player.ballSize = 3;
		CoC.player.tallness = 113;
		CoC.player.tone = 50;
		CoC.player.thickness = 50;
		CoC.player.femininity = 50;
		CoC.player.hipRating = 5;
		CoC.player.buttRating = 5;
		CoC.player.teaseLevel = 1;
		//Large feathered wings (Any chance in heck I could get 'angel' as the race descriptor? Just asking. I'm fine if the answer is 'no')
		CoC.player.wingType = AppearanceDefs.WING_TYPE_FEATHERED_LARGE;
		CoC.player.wingDesc = 'large, feathered';
		//While we're on the subject, would glowing eyes be possible? I'll take normal eyes if not.
		//Beautiful Sword
		CoC.player.setWeapon( WeaponLib.B_SWORD );
		CoC.player.setArmor( ArmorLib.SSARMOR );
		//Beautiful Armor (Or just Spider Silk Armor)
		//Pure Pearl
		//Tallness 84 (8 feet 0 inches)
		CoC.player.tallness = 84;
		//Femininity 10
		CoC.player.femininity = 10;
		//Thickness 50
		CoC.player.thickness = 50;
		//Tone 90
		CoC.player.tone = 90;
		//Int 50 (if possible)
		CoC.player.inte = 50;
		//Str/Tou/Spd 25 (if possible)
		CoC.player.str = 25;
		CoC.player.tou = 25;
		CoC.player.spe = 25;
		//Bow
		CoC.player.createKeyItem( 'Bow', 0, 0, 0, 0 );
		//Bow skill 100 (Sorry Kelt, I can't hear your insults over my mad Robin Hood skillz)
		CoC.player.createStatusAffect( StatusAffects.Kelt, 100, 0, 0, 0 );
		//Is it possible to get extra starting perks added? If so, I'd like History added to whatever is selected on creation. If not, please ignore this line.
		//Freckled skinAdj
		CoC.player.skinAdj = 'freckled';
		//10 Perk Points (if possible, feel free to make it less if you feel it necessary)
		CoC.player.perkPoints = 10;
		//Male
		CoC.player.gender = 1;
		//Would it be possible to code a cock type that morphs into different cock types? (i.e. it loads a different cock type description each sex scene) If so, I'd like him to have a pair of them, one 24 inches long and 3 inches wide and the second 12-inches long and 2 inches wide. If not, I'll take a dragon and horse cock at 24/3 each as well as a dog and cat cock at 12/2 each.
		CoC.player.createCock();
		CoC.player.createCock();
		CoC.player.createCock();
		CoC.player.createCock();
		CoC.player.cocks[ 0 ].cockLength = 24;
		CoC.player.cocks[ 0 ].cockThickness = 3;
		CoC.player.cocks[ 0 ].cockType = CockTypesEnum.HORSE;
		CoC.player.cocks[ 1 ].cockLength = 24;
		CoC.player.cocks[ 1 ].cockThickness = 3;
		CoC.player.cocks[ 1 ].cockType = CockTypesEnum.DRAGON;
		CoC.player.cocks[ 2 ].cockLength = 12;
		CoC.player.cocks[ 2 ].cockThickness = 2;
		CoC.player.cocks[ 2 ].cockType = CockTypesEnum.DOG;
		CoC.player.cocks[ 3 ].cockLength = 12;
		CoC.player.cocks[ 3 ].cockThickness = 2;
		CoC.player.cocks[ 3 ].cockType = CockTypesEnum.CAT;
		//A pair of 8-inch balls
		CoC.player.balls = 2;
		CoC.player.ballSize = 8;
		//A virility boost would be nice too if possible.
		CoC.player.cumMultiplier = 50;
	};
	CharCreation.prototype.customCody = function() {
		EngineCore.outputText( 'Your orange and black tiger stripes make you cut a more imposing visage than normal, and with your great strength, armor, and claymore, you\'re a natural pick for champion.' );
		//well to start off the name would be Cody
		//-Cat with (black and orange tiger fur if possible) if not just Orange fur
		CoC.player.hairColor = 'black and orange';
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		CoC.player.skinDesc = 'fur';
		//-Chainmail armor
		CoC.player.setArmor( ArmorLib.FULLCHN );
		//-Large Claymore (i understand 40 Strength is need so if he could start with that would be great if not hit the gyms)'
		CoC.player.str = 41;
		CoC.player.setWeapon( WeaponLib.CLAYMOR );
	};
	CharCreation.prototype.customGalatea = function() {
		//'(Dangit Fenoxo!  Stop adding sexy must-have things to the game!  If it's not too late to update it I've added in that sexy new armor.  Thanks!)
		//Other
		if( !CoC.player.hasVagina() ) {
			CoC.player.createVagina();
			if( CoC.player.clitLength === 0 ) {
				CoC.player.clitLength = 0.25;
			}
		}
		CoC.player.genderCheck();
		//Hair length long
		CoC.player.hairLength = 22;
		//Breast size
		CoC.player.breastRows[ 0 ].breastRating = 21;
		//Femininity/Beauty high
		CoC.player.femininity = 90;
		// Height
		CoC.player.tallness = 64;
		//Perks, Strong Back, Strong Back 2
		CoC.player.createStatusAffect( StatusAffects.Feeder, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Feeder, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.StrongBack, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.StrongBack2, 0, 0, 0, 0 );
		//Equipment Warhammer
		CoC.player.setWeapon( WeaponLib.WARHAMR );
		//Armor shit
		CoC.player.setArmor( ArmorLib.LMARMOR );
		//player.createPerk(PerkLib.SluttySeduction, 10 + CoC.flags[kFLAGS.BIKINI_ARMOR_BONUS], 0, 0, 0);
		//Stats possible)
		//Strength
		CoC.player.str = 90;
		//Fertility
		CoC.player.fertility = 100;
		CoC.player.cor = 25;
		//Inventory, GroPlus, BimboLq
		CoC.player.itemSlot1.setItemAndQty( ConsumableLib.LACTAID, 5 );
		CoC.player.itemSlot2.setItemAndQty( ConsumableLib.GROPLUS, 5 );
		CoC.player.itemSlot3.setItemAndQty( ConsumableLib.BIMBOLQ, 1 );
		CoC.player.itemSlot4.unlocked = true;
		CoC.player.itemSlot4.setItemAndQty( ArmorLib.BIMBOSK, 1 );
		CoC.player.itemSlot5.unlocked = true;
		EngineCore.outputText( 'You\'ve got large breasts prone to lactation.  You aren\'t sure WHY you got chosen as a champion, but with your considerable strength, you\'re sure you\'ll do a good job protecting Ingnam.' );
	};
	CharCreation.prototype.customGundam = function() {
		EngineCore.outputText( 'You\'re fabulously rich, thanks to a rather well-placed bet on who would be the champion.  Hopefully you can buy yourself out of any trouble you might get in.' );
		CoC.player.gems = 1500 + Utils.rand( 1000 );
		//for my custom character profile i want the name to be gundam all i want is to start out with around 1000-2500 gems like as a gift from the elder or something to help me out.
	};
	CharCreation.prototype.customHikari = function() {
		//Character Creation	If possible I would like a herm with a cat cock that is 10 inches by 4 inches. Anything else is up to you.	I would like a herm catmorph with two large d breasts and shoulder length hair. Also if possible I would like to start with some gel armor. Everything else is fair game.	Hikari
		EngineCore.outputText( 'As a herm with a super-thick cat-cock, D-cup breasts, and out-of-this-world armor, you\'re a natural pick for champion.' );
		if( !CoC.player.hasCock() ) {
			CoC.player.createCock();
		}
		CoC.player.cocks[ 0 ].cockType = CockTypesEnum.CAT;
		CoC.player.cocks[ 0 ].cockLength = 10;
		CoC.player.cocks[ 0 ].cockThickness = 4;
		if( !CoC.player.hasVagina() ) {
			CoC.player.createVagina();
		}
		CoC.player.breastRows[ 0 ].breastRating = 4;
		CoC.player.hairLength = 10;
		CoC.player.setArmor( ArmorLib.GELARMR );
		CoC.player.gender = 3;
	};
	CharCreation.prototype.customIsaac = function() {
		EngineCore.outputText( 'Born of a disgraced priestess, Isaac was raised alone until she was taken by illness.  He worked a number of odd jobs until he was eventually chosen as champion.' );
		//- gift
		CoC.player.spe += 5;
		CoC.player.tone += 10;
		CoC.player.createPerk( PerkLib.Fast, 0.25, 0, 0, 0 );
		//- history
		CoC.player.createPerk( PerkLib.HistoryReligious, 0, 0, 0, 0 );
		//(and if possible)
		//- history
		CoC.player.createPerk( PerkLib.HistoryFighter, 0, 0, 0, 0 );
		//- history
		CoC.player.createPerk( PerkLib.HistorySmith, 0, 0, 0, 0 );
		//in my ar, Issac was born to a disgraced priestess (she was raped by marauders) and raised by her alone until she died from an illness and was pretty much left to fend for and earn a living for himself (hence the fighter and smith background's too) until, years later he was chosen as 'champion'~
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		//sex - male
		CoC.player.gender = 1;
		CoC.player.balls = 2;
		//- a pair of apple sized balls each measuring three inches across
		CoC.player.ballSize = 3;
		//anatomy - twin dicks
		//the first, a vulpine dick (12 in. long, 2.8 in. thick with a knot roughly 4.5 in. at full size) with a Fertite jacob's ladder piercing
		//and the second, a barbed feline dick (10 in. long and 2.5 in thick) with an Emerald jacob's ladder
		//heh, ribbed for their pleasure ;d lol
		CoC.player.createCock();
		CoC.player.createCock();
		CoC.player.cocks[ 0 ].cockLength = 12;
		CoC.player.cocks[ 0 ].cockThickness = 2.8;
		CoC.player.cocks[ 0 ].cockType = CockTypesEnum.DOG;
		CoC.player.cocks[ 0 ].knotMultiplier = 1.8;
		CoC.player.cocks[ 1 ].cockLength = 10;
		CoC.player.cocks[ 1 ].cockThickness = 2.5;
		CoC.player.cocks[ 1 ].cockType = CockTypesEnum.TENTACLE;
		CoC.player.cocks[ 0 ].pierced = 3;
		CoC.player.cocks[ 0 ].pShortDesc = 'fertite cock-jacob\'s ladder';
		CoC.player.cocks[ 0 ].pLongDesc = 'Fertite cock-jacob\'s ladder';
		CoC.player.createPerk( PerkLib.PiercedFertite, 5, 0, 0, 0 );
		//- and one tight asshole
		CoC.player.ass.analLooseness = 0;
		//- kitsune
		//- moderately long white hair (9 inches)
		CoC.player.hairLength = 9;
		CoC.player.hairColor = 'silver-white';
		//- human face
		//- fox ears
		CoC.player.earType = AppearanceDefs.EARS_FOX;
		//- olive complexion
		CoC.player.skinTone = 'olive';
		//- demon tongue (oral fetish ;d)
		CoC.player.tongueType = AppearanceDefs.TONUGE_DEMONIC;
		//- 5 foot 9 inch tall
		CoC.player.tallness = 69;
		//- average build
		CoC.player.thickness = 50;
		//- body thickness of  around 50
		CoC.player.tone = 70;
		//- 'tone of about 70
		//- two flat breasts each supporting one 0.2-inch nipple
		CoC.player.nippleLength = 0.2;
		CoC.player.createBreastRow();
		//- three fox tails
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_FOX;
		CoC.player.tailVenom = 3;
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		//equipment;
		//- katana (don't suppose you could rename the katana 'Zon'ith' could you? ~.^)
		//Items, Leather Armor
		CoC.player.setWeapon( WeaponLib.KATANA );
		//- robes
		CoC.player.setArmor( ArmorLib.M_ROBES );
	};
	CharCreation.prototype.customKatti = function() {
		EngineCore.outputText( 'You have big breasts with big, fuckable nipples on them, and no matter what, your vagina always seems to be there to keep you company.' );
		//Gender
		if( !CoC.player.hasVagina() ) {
			CoC.player.createVagina();
			CoC.player.genderCheck();
		}
		//'Ears
		CoC.player.earType = AppearanceDefs.EARS_BUNNY;
		//Tail
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_RABBIT;
		//Face
		//Breasts with 4.5 inch fuckable nipples'
		CoC.player.breastRows[ 0 ].breastRating = 19;
		CoC.player.nippleLength = 4.5;
		CoC.player.breastRows[ 0 ].fuckable = true;
	};
	CharCreation.prototype.customLeah = function() {
		CoC.player.setArmor( ArmorLib.LEATHRA );
		CoC.player.setWeapon( WeaponLib.W_STAFF );
		CoC.player.itemSlot1.setItemAndQty( ConsumableLib.B__BOOK, 1 );
		CoC.player.itemSlot2.setItemAndQty( ConsumableLib.W__BOOK, 2 );
		CoC.player.createBreastRow();
		CoC.player.createVagina();
		CoC.player.breastRows[ 0 ].breastRating = 4;
		CoC.player.clitLength = 0.5;
		CoC.player.fertility = 10;
		CoC.player.gender = 2;
		CoC.player.hipRating = 8;
		CoC.player.buttRating = 8;
		CoC.player.str = 15;
		CoC.player.tou = 15;
		CoC.player.spe = 18;
		CoC.player.inte = 17;
		CoC.player.sens = 15;
		CoC.player.lib = 15;
		CoC.player.cor = 0;
		CoC.notes = 'No Notes Available.';
		CoC.player.HP = CoC.maxHP();
		CoC.player.hairLength = 13;
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		CoC.player.faceType = AppearanceDefs.FACE_HUMAN;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_NONE;
		CoC.player.tongueType = AppearanceDefs.TONUGE_HUMAN;
		CoC.player.femininity = 85;
		CoC.player.beardLength = 0;
		CoC.player.beardStyle = 0;
		CoC.player.tone = 30;
		CoC.player.thickness = 50;
		CoC.player.skinDesc = 'skin';
		CoC.player.skinTone = 'olive';
		CoC.player.hairColor = 'black';
		CoC.player.balls = 0;
		CoC.player.cumMultiplier = 1;
		CoC.player.ballSize = 0;
		CoC.player.hoursSinceCum = 0;
		CoC.player.clitLength = 0;
		CoC.player.ass.analLooseness = 0;
		CoC.player.ass.analWetness = 0;
		CoC.player.ass.fullness = 0;
		CoC.player.fertility = 5;
		CoC.player.fatigue = 0;
		CoC.player.horns = 0;
		CoC.player.tallness = 67;
		CoC.player.tailVenom = 0;
		CoC.player.tailRecharge = 0;
		CoC.player.wingType = AppearanceDefs.WING_TYPE_NONE;
		CoC.player.wingDesc = 'non-existant';
		CoC.player.tone = 30;
		CoC.player.thickness = 65;
	};
	CharCreation.prototype.customLucina = function() {
		//428347355782040	Character Creation	Female,wetness=wet, Looseness=normal,not a virgin, Fertility high i guess i dont really care can be up to you.	for her face normal human, ears i want Elvin, no tails, just normal skin, body thickness i want to be slender, body tone kinda athletic but not too much, hair i want really long i think like a 30 on the codex number i think and her hair color light blonde, i want her to have normal D size breast with you can choose how you want them really though i dont think i really care, nipple size i dont care, her skin color a fair light light color but not too pale, for her starting equipment i want im not sure what i want her to wear but basically i want a Elvin archer with a bow. so maybe you can do something about the clothing. i just want a Elvin character in the game since theres goblins plus another archer besides kelt a female one add to that.	Lucina
		EngineCore.outputText( 'You\'re a blond, fair-skinned lass with a well-made bow and the skills to use it.  You have D-cup breasts and a very moist cunt that\'s seen a little action.  You\'re fit and trim, but not too thin, nor too well-muscled.  All in all, you\'re a good fit for championing your village\'s cause.' );
		if( !CoC.player.hasVagina() ) {
			CoC.player.createVagina();
		}
		CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_SLICK;
		CoC.player.vaginas[ 0 ].vaginalLooseness = AppearanceDefs.VAGINA_LOOSENESS_LOOSE;
		CoC.player.vaginas[ 0 ].virgin = false;
		if( CoC.player.femininity < 80 ) {
			CoC.player.femininity = 80;
		}
		CoC.player.fertility = 40;
		CoC.player.earType = AppearanceDefs.EARS_ELFIN;
		CoC.player.thickness = 25;
		CoC.player.tone = 60;
		CoC.player.hairLength = 30;
		CoC.player.hairColor = 'light blonde';
		CoC.player.breastRows[ 0 ].breastRating = 4;
		CoC.player.skinTone = 'light';
		//Bow skill 100 (Sorry Kelt, I can't hear your insults over my mad Robin Hood skillz)
		CoC.player.createStatusAffect( StatusAffects.Kelt, 100, 0, 0, 0 );
		CoC.player.createKeyItem( 'Bow', 0, 0, 0, 0 );
	};
	CharCreation.prototype.customLukaz = function() {
		//Specific Character
		//Male. 11.5 inch dog dick, 4 balls, 2 inches in diameter.
		CoC.player.createCock();
		CoC.player.cocks[ 0 ].cockLength = 11.5;
		CoC.player.cocks[ 0 ].cockThickness = 2;
		CoC.player.cocks[ 0 ].cockType = CockTypesEnum.DOG;
		CoC.player.cocks[ 0 ].knotMultiplier = 1.5;
		CoC.player.createBreastRow();
		CoC.player.breastRows[ 0 ].breastRating = 0;
		CoC.player.gender = 1;
		CoC.player.tallness = 71;
		CoC.player.hipRating = 4;
		CoC.player.buttRating = 4;
		CoC.player.femininity = 30;
		CoC.player.createCock();
		CoC.player.balls = 4;
		CoC.player.cumMultiplier = 4;
		CoC.player.ballSize = 2;
		CoC.player.str = 18;
		CoC.player.tou = 17;
		CoC.player.spe = 15;
		CoC.player.inte = 15;
		CoC.player.sens = 15;
		CoC.player.lib = 15;
		CoC.player.cor = 0;
		CoC.notes = 'No Notes Available.';
		CoC.player.HP = CoC.maxHP();
		CoC.player.hairLength = 1;
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		CoC.player.skinTone = 'light';
		CoC.player.hairColor = 'brown';
		CoC.player.faceType = AppearanceDefs.FACE_HUMAN;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_NONE;
		CoC.player.tongueType = AppearanceDefs.TONUGE_HUMAN;
		CoC.player.femininity = 50;
		CoC.player.beardLength = 0;
		CoC.player.beardStyle = 0;
		CoC.player.thickness = 50;
		CoC.player.skinDesc = 'skin';
		CoC.player.hoursSinceCum = 0;
		CoC.player.clitLength = 0;
		CoC.player.ass.analLooseness = 0;
		CoC.player.ass.analWetness = 0;
		CoC.player.ass.fullness = 0;
		CoC.player.fertility = 5;
		CoC.player.fatigue = 0;
		CoC.player.horns = 0;
		CoC.player.tailVenom = 0;
		CoC.player.tailRecharge = 0;
		CoC.player.wingType = AppearanceDefs.WING_TYPE_NONE;
		CoC.player.wingDesc = 'non-existant';
		//'dog face, dog ears, draconic tail, blue fur.
		CoC.player.faceType = AppearanceDefs.FACE_DOG;
		CoC.player.earType = AppearanceDefs.EARS_DOG;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_DRACONIC;
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		CoC.player.hairColor = 'blue';
		CoC.player.skinDesc = 'fur';
		CoC.player.tone = 88;
		CoC.player.tongueType = AppearanceDefs.TONUGE_DRACONIC;
		//gel plate armor, warhammer, 88 body tone, 1 breast row, flat manly breasts, 0.2 inch nipples, 1 on each breast, draconic tongue, short hair-blue, light skin.'	Lukaz
		CoC.player.createPerk( PerkLib.HistoryFighter, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.MessyOrgasms, 1.25, 0, 0, 0 );
	};
	CharCreation.prototype.customMara = function() {
		//#226096893686530
		//For the custom PC Profile can you make a Bimbo Bunny girl (no bunny feet) (named Mara) dont really care about clothes i can get what i want pretty quickly and I change from time to time.
		EngineCore.outputText( 'You\'re a bunny-girl with bimbo-tier curves, jiggly and soft, a curvy, wet girl with a bit of a flirty past.' );
		CoC.player.gender = 2;
		CoC.player.spe += 3;
		CoC.player.inte += 2;
		CoC.player.clitLength = 0.5;
		CoC.player.tone = 30;
		CoC.player.fertility = 10;
		CoC.player.hairLength = 15;
		CoC.player.createBreastRow();
		CoC.player.createVagina();
		CoC.player.tallness = 67;
		CoC.player.breastRows[ 0 ].breastRating = 7;
		CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_SLICK;
		CoC.player.vaginas[ 0 ].virgin = false;
		CoC.player.tone = 20;
		CoC.player.hipRating = 12;
		CoC.player.buttRating = 12;
		CoC.player.femininity = 100;
		CoC.player.thickness = 33;
		CoC.player.createPerk( PerkLib.HistorySlut, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.BimboBody, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.BimboBrains, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.BigTits, 1.5, 0, 0, 0 );
		CoC.player.earType = AppearanceDefs.EARS_BUNNY;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_RABBIT;
		CoC.player.skinTone = 'tan';
		CoC.player.hairColor = 'platinum blonde';
		CoC.player.teaseLevel = 3;
	};
	CharCreation.prototype.customMihari = function() {
		//[Values will be listed as if taken from Minerva]
		//I'm kinda going under the assumption you are letting us go hog wild if not, take what's allowed and do what you wish out of what's below
		EngineCore.outputText( 'The portal is not something you fear, not with your imposing armor and inscribed spellblade.  You\'re much faster and stronger than every champion that came before you, but will it be enough?' );
		//Core Stats = 40;
		CoC.player.tou = 20;
		CoC.player.spe = 100;
		CoC.player.inte = 80;
		CoC.player.lib = 25;
		CoC.player.sens = 15;
		//Body Values
		CoC.player.createBreastRow();
		//-breastRating
		//-breasts
		//-nipplesPerBreast
		CoC.player.breastRows[ 0 ].breastRating = 5;
		CoC.player.buttRating = 2;
		CoC.player.createVagina();
		CoC.player.vaginas[ 0 ].vaginalLooseness = AppearanceDefs.VAGINA_LOOSENESS_TIGHT;
		CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_SLAVERING;
		CoC.player.vaginas[ 0 ].virgin = true;
		CoC.player.clitLength = 0.2;
		CoC.player.earType = AppearanceDefs.EARS_CAT;
		CoC.player.faceType = AppearanceDefs.FACE_CAT;
		CoC.player.femininity = 100;
		CoC.player.fertility = 85;
		CoC.player.gender = 2;
		CoC.player.hairColor = 'blonde';
		CoC.player.hairLength = 24;
		CoC.player.hipRating = 6;
		CoC.player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_CAT;
		CoC.player.nippleLength = 0.5;
		//perks, 0, 0, 0, 0);
		CoC.player.createPerk( PerkLib.Evade, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Runner, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Fast, 0.25, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Fertile, 1.5, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Flexibility, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.HistoryScholar, 0, 0, 0, 0 );
		CoC.player.skinDesc = 'fur';
		CoC.player.skinTone = 'ashen';
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_CAT;
		CoC.player.tallness = 55;
		CoC.player.teaseLevel = 4;
		CoC.player.thickness = 10;
		CoC.player.tone = 75;
		CoC.player.tongueType = AppearanceDefs.TONUGE_HUMAN;
		//Posted everything above sorry if it wasn't supposed to go there.
		//starting equipment leather armor surrounded by voluminous robes
		//starting weapon if not gamebreaking otherwise spear is fine.
		CoC.player.setArmor( ArmorLib.LTHRROB );
		CoC.player.setWeapon( WeaponLib.S_BLADE );
	};
	CharCreation.prototype.customMirvanna = function() {
		//Any equine or dragonny attributes accompanying it a big plus! As I'm a dragon-unicorn furry (Qilin~). Bonus points if you add a horn type for unicorn horn.
		EngineCore.outputText( 'You\'re an equine dragon-herm with a rather well-proportioned body.  Ingnam is certainly going to miss having you whoring yourself out around town.  You don\'t think they\'ll miss cleaning up all the messy sex, though.' );
		CoC.player.gender = 3;
		CoC.player.spe += 3;
		CoC.player.inte += 2;
		CoC.player.str += 3;
		CoC.player.clitLength = 0.5;
		CoC.player.fertility = 20;
		CoC.player.hairLength = 15;
		CoC.player.createBreastRow();
		CoC.player.createVagina();
		CoC.player.createCock();
		CoC.player.tallness = 73;
		CoC.player.breastRows[ 0 ].breastRating = 5;
		CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_SLICK;
		CoC.player.vaginas[ 0 ].vaginalLooseness = AppearanceDefs.VAGINA_LOOSENESS_LOOSE;
		CoC.player.vaginas[ 0 ].virgin = false;
		CoC.player.tone = 20;
		CoC.player.hipRating = 8;
		CoC.player.buttRating = 8;
		CoC.player.femininity = 75;
		CoC.player.thickness = 33;
		CoC.player.hairColor = 'platinum blonde';
		CoC.player.teaseLevel = 1;
		//Mirvanna;
		//Gender = Herm
		//Ears = Horse
		CoC.player.earType = AppearanceDefs.EARS_HORSE;
		//Horns = Dragon
		CoC.player.hornType = AppearanceDefs.HORNS_DRACONIC_X4_12_INCH_LONG;
		CoC.player.horns = 12;
		//Face = Horse
		CoC.player.faceType = AppearanceDefs.FACE_HORSE;
		//Skin type = Black Fur
		CoC.player.skinTone = 'brown';
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		CoC.player.hairColor = 'black';
		CoC.player.skinDesc = 'fur';
		//Legs/Feet = Digigrade hooved
		CoC.player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HOOFED;
		//Wing type = Dragon
		CoC.player.wingType = AppearanceDefs.WING_TYPE_DRACONIC_LARGE;
		CoC.player.wingDesc = 'large, draconic';
		//Tail type = Dragon
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_DRACONIC;
		//Cock type = Equine
		CoC.player.cocks[ 0 ].cockType = CockTypesEnum.HORSE;
		CoC.player.cocks[ 0 ].cockLength = 14;
		CoC.player.cocks[ 0 ].cockThickness = 2.5;
		//Vulva Type = Equine
		//Beautiful Sword & Wizard Robe
		CoC.player.setWeapon( WeaponLib.B_SWORD );
		CoC.player.setArmor( ArmorLib.W_ROBES );
		//Herm, lots of jizz.
		CoC.player.femininity -= 2;
		CoC.player.cumMultiplier = 5.5;
		CoC.player.createPerk( PerkLib.MessyOrgasms, 1.25, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.HistoryWhore, 0, 0, 0, 0 );
	};
	CharCreation.prototype.customNami = function() {
		//Female with the sand-trap black pussy
		//Non-Virgin
		//Fertility- Normal Starting Value
		//Wetness- Above Average
		//Looseness- Normal Starting Value
		//Clit-size- Normal Value'
		CoC.player.createVagina();
		CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_SLICK;
		CoC.player.clitLength = 0.25;
		CoC.player.vaginas[ 0 ].type = 5;
		CoC.player.vaginas[ 0 ].virgin = false;
		CoC.player.ass.analLooseness = 1;
		//Face- Canine
		CoC.player.faceType = AppearanceDefs.FACE_DOG;
		//Ears- Canine
		CoC.player.earType = AppearanceDefs.EARS_DOG;
		//Tail- Canine
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_DOG;
		//Lower body- Canine
		CoC.player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DOG;
		//White Fur (if possible)
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		CoC.player.hairColor = 'white';
		CoC.player.skinDesc = 'fur';
		//Body Thickness/breastsize/- As if I had selected the ''Average'' body type from the start.
		CoC.player.createBreastRow();
		CoC.player.breastRows[ 0 ].breastRating = 3;
		//Muscle Tone- A bit above average enough to trigger a mention of it in the desc.
		CoC.player.tone = 55;
		//Nipples-  As above on size but the black sand trap nipples.
		CoC.player.createStatusAffect( StatusAffects.BlackNipples, 0, 0, 0, 0 );
		//Hair Length- Long
		CoC.player.hairLength = 16;
		//Hair Color- Black
		//Skin Color- Light
		CoC.player.skinTone = 'light';
		//Starting Equipment Robe, Wizards Staff, and one White and one Black book in inventory.
		//equipArmor('inquisitor\'s corset',false);
		CoC.player.setArmor( ArmorLib.W_ROBES );
		CoC.player.setWeapon( WeaponLib.W_STAFF );
		//Gift Perk- Smarts
		CoC.player.createPerk( PerkLib.Smart, 0, 0, 0, 0 );
		//History- Schooling
		CoC.player.createPerk( PerkLib.HistoryScholar, 0, 0, 0, 0 );
		CoC.player.itemSlot1.setItemAndQty( ConsumableLib.W__BOOK, 1 );
		CoC.player.itemSlot2.setItemAndQty( ConsumableLib.B__BOOK, 1 );
		CoC.player.gender = 2;
		CoC.player.tallness = 64;
		CoC.player.femininity = 75;
		CoC.player.buttRating = 7;
		CoC.player.hipRating = 7;
		CoC.player.inte = 40;
		CoC.player.str = 20;
		CoC.player.spe = 25;
		CoC.player.tou = 15;
		EngineCore.clearOutput();
		EngineCore.outputText( 'Your exotic appearance caused you some trouble growing up, but you buried your nose in books until it came time to go through the portal.' );
	};
	CharCreation.prototype.customNavorn = function() {
		EngineCore.outputText( 'There\'s been something special about you since day one, whether it\'s your numerous sexual endowments or your supernatural abilities.  You\'re a natural pick for champion.' );
		//Character Creation	'Herm same number and types of cocks from email sent earlier.
		//Special abilities breath, fox fire?
		CoC.player.createPerk( PerkLib.Dragonfire, 0, 0, 0, 0 );
		//equipment claymore, and platemail
		//-Chainmail armor
		CoC.player.setArmor( ArmorLib.FULLPLT );
		//-Large Claymore (i understand 40 Strength is need so if he could start with that would be great if not hit the gyms)'
		CoC.player.setWeapon( WeaponLib.CLAYMOR );
		CoC.player.str = 41;
		//femininity
		CoC.player.femininity = 95;
		//(0 lust cum production)
		CoC.player.cumMultiplier += 500;
		//(base fertility 20 if possible?)
		CoC.player.fertility = 20;
		//Appearence 9in tall covered in thick shining silver fur, has a vulpine head and ears, eight breast all the same size at DD, dragon like wings, tail, and legs. With a large mare like pussy, 6 dicks, two equine, two dragon, two vulpine, all 15in long and 3 in wide, and four nuts 5 in across
		CoC.player.tallness = 93;
		CoC.player.skinTone = 'black';
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		CoC.player.skinDesc = 'fur';
		CoC.player.hairColor = 'silver';
		CoC.player.faceType = AppearanceDefs.FACE_FOX;
		CoC.player.earType = AppearanceDefs.EARS_FOX;
		CoC.player.createBreastRow();
		CoC.player.createBreastRow();
		CoC.player.createBreastRow();
		CoC.player.breastRows[ 0 ].breastRating = 5;
		CoC.player.breastRows[ 0 ].nipplesPerBreast = 4;
		CoC.player.breastRows[ 0 ].fuckable = true;
		CoC.player.breastRows[ 1 ].breastRating = 5;
		CoC.player.breastRows[ 1 ].nipplesPerBreast = 4;
		CoC.player.breastRows[ 1 ].fuckable = true;
		CoC.player.breastRows[ 2 ].breastRating = 5;
		CoC.player.breastRows[ 2 ].nipplesPerBreast = 4;
		CoC.player.breastRows[ 2 ].fuckable = true;
		CoC.player.breastRows[ 3 ].breastRating = 5;
		CoC.player.breastRows[ 3 ].nipplesPerBreast = 4;
		CoC.player.breastRows[ 3 ].fuckable = true;
		if( !CoC.player.hasCock() ) {
			CoC.player.createCock();
		}
		CoC.player.createCock();
		CoC.player.createCock();
		CoC.player.createCock();
		CoC.player.createCock();
		CoC.player.createCock();
		CoC.player.cocks[ 0 ].cockType = CockTypesEnum.HORSE;
		CoC.player.cocks[ 0 ].cockLength = 15;
		CoC.player.cocks[ 0 ].cockThickness = 3;
		CoC.player.cocks[ 1 ].cockType = CockTypesEnum.HORSE;
		CoC.player.cocks[ 1 ].cockLength = 15;
		CoC.player.cocks[ 1 ].cockThickness = 3;
		CoC.player.cocks[ 2 ].cockType = CockTypesEnum.DOG;
		CoC.player.cocks[ 2 ].cockLength = 15;
		CoC.player.cocks[ 2 ].cockThickness = 3;
		CoC.player.cocks[ 2 ].knotMultiplier = 2;
		CoC.player.cocks[ 3 ].cockType = CockTypesEnum.DOG;
		CoC.player.cocks[ 3 ].cockLength = 15;
		CoC.player.cocks[ 3 ].cockThickness = 3;
		CoC.player.cocks[ 3 ].knotMultiplier = 2;
		CoC.player.cocks[ 4 ].cockType = CockTypesEnum.DRAGON;
		CoC.player.cocks[ 4 ].cockLength = 15;
		CoC.player.cocks[ 4 ].cockThickness = 3;
		CoC.player.cocks[ 5 ].cockType = CockTypesEnum.DRAGON;
		CoC.player.cocks[ 5 ].cockLength = 15;
		CoC.player.cocks[ 5 ].cockThickness = 3;
		CoC.player.balls = 4;
		CoC.player.ballSize = 5;
		//hair length in
		CoC.player.hairLength = 15;
		//hip size
		CoC.player.hipRating = 15;
		//butt size
		CoC.player.buttRating = 15;
		//body thickness
		CoC.player.thickness = 50;
		//Muscle
		CoC.player.tone = 75;
		//for wetness a squirter, looseness a 2 and capacity at 140.
		if( !CoC.player.hasVagina() ) {
			CoC.player.createVagina();
		}
		CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_SLAVERING;
		CoC.player.createStatusAffect( StatusAffects.BonusVCapacity, 132, 0, 0, 0 );
		//Virgin, high fertility like in the email I sent before.  dragon wings, nine fox tails,  dragon legs, eight DD breasts with four fuckable nipples each, dragon tongue, waist length hair, large dragon wings.
		CoC.player.wingType = AppearanceDefs.WING_TYPE_DRACONIC_LARGE;
		CoC.player.wingDesc = 'large, draconic';
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_FOX;
		CoC.player.tailVenom = 9;
		CoC.player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DRAGON;
		CoC.player.tongueType = AppearanceDefs.TONUGE_DRACONIC;
		CoC.player.hairLength = 45;
		CoC.player.createPerk( PerkLib.EnlightenedNinetails, 0, 0, 0, 0 );
		CoC.player.gender = 3;
	};
	CharCreation.prototype.customNixi = function() {
		//-Perks
		//fertility AND messy orgasm (hope that's not pushing it)
		CoC.player.createPerk( PerkLib.MessyOrgasms, 1.25, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Fertile, 1.5, 0, 0, 0 );
		//fighting history
		CoC.player.createPerk( PerkLib.HistoryFighter, 0, 0, 0, 0 );
		//3 starting perk points
		CoC.player.perkPoints = 3;
		//some starting gems (just go ahead and surprise me on the amount)
		CoC.player.gems = Utils.rand( 800 );
		//Specific Character
		//-Female... with a dog cock
		//11'' long, 2'' wide, 2.4'' knot
		//no balls
		//virgin pussy, 0.2'' clit
		//wetness 2
		//fertility 30
		//virgin bum
		//anal wetness 1
		CoC.player.ass.analWetness = 2;
		CoC.player.gender = 3;
		CoC.player.createCock();
		CoC.player.cocks[ 0 ].cockLength = 11;
		CoC.player.cocks[ 0 ].cockThickness = 2;
		CoC.player.cocks[ 0 ].knotMultiplier = 1.2;
		CoC.player.cocks[ 0 ].cockType = CockTypesEnum.DOG;
		CoC.player.balls = 0;
		CoC.player.createBreastRow();
		CoC.player.createVagina();
		CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_WET;
		//1 pair DD's, 0.5'' nipples'
		CoC.player.breastRows[ 0 ].breastRating = 5;
		CoC.player.nippleLength = 0.5;
		CoC.player.clitLength = 0.5;
		CoC.player.fertility = 30;
		CoC.player.hipRating = 6;
		CoC.player.buttRating = 6;
		CoC.player.str = 15;
		CoC.player.tou = 15;
		CoC.player.spe = 18;
		CoC.player.inte = 17;
		CoC.player.sens = 15;
		CoC.player.lib = 15;
		CoC.player.cor = 0;
		CoC.notes = 'No Notes Available.';
		CoC.player.HP = CoC.maxHP();
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		CoC.player.faceType = AppearanceDefs.FACE_HUMAN;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_NONE;
		CoC.player.tongueType = AppearanceDefs.TONUGE_HUMAN;
		CoC.player.femininity = 85;
		CoC.player.beardLength = 0;
		CoC.player.beardStyle = 0;
		//75 muscle tone
		CoC.player.tone = 75;
		//25 thickness
		CoC.player.thickness = 25;
		CoC.player.skinDesc = 'fur';
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		CoC.player.skinTone = 'light';
		CoC.player.hairColor = 'silver';
		CoC.player.hairLength = 10;
		//shoulder length silver hair
		CoC.player.balls = 0;
		CoC.player.cumMultiplier = 1;
		CoC.player.ballSize = 0;
		CoC.player.hoursSinceCum = 0;
		CoC.player.clitLength = 0;
		CoC.player.ass.analLooseness = 0;
		CoC.player.ass.analWetness = 0;
		CoC.player.ass.fullness = 0;
		CoC.player.fertility = 5;
		CoC.player.fatigue = 0;
		CoC.player.horns = 0;
		CoC.player.tallness = 82;
		CoC.player.tailVenom = 0;
		CoC.player.tailRecharge = 0;
		CoC.player.wingType = AppearanceDefs.WING_TYPE_NONE;
		CoC.player.wingDesc = 'non-existant';
		//6' 10'' german-shepherd morph, face ears hands feet tail, the whole nine yards
		CoC.player.faceType = AppearanceDefs.FACE_DOG;
		CoC.player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_DOG;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_DOG;
		CoC.player.earType = AppearanceDefs.EARS_DOG;
		////'	'I'm picturing a tall, feminine German-Shepherd morph, solid white and gorgeous. She has both sets of genitals, with no balls, and a large set of breasts. She wields a large claymore and is dressed in a full chain vest and pants.
		//large claymore (and the strength to use it)
		CoC.player.setWeapon( WeaponLib.CLAYMOR );
		CoC.player.str = 40;
		//full chain
		CoC.player.setArmor( ArmorLib.FULLCHN );
		EngineCore.outputText( 'As a German-Shepherd morph, the rest of the village never really knew what to do with you... until they sent you through the portal to face whatever\'s on the other side...' );
	};
	CharCreation.prototype.customPrismere = function() {
		//Specific Character	Female, virgin, high fertility, tight with standard wetness and clit.
		CoC.player.createVagina();
		CoC.player.clitLength = 0.25;
		CoC.player.fertility = 4;
		CoC.player.spe += 20;
		EngineCore.outputText( 'You\'re more of a scout than a fighter, but you still feel confident you can handle your responsibilities as champion.  After all, what\'s to worry about when you can outrun everything you encounter?  You have olive skin, deep red hair, and a demonic tail and wings to blend in with the locals.' );
		//Perk is speed, she was a scout, and it'd be neat (if possible) to give her something akin to the Runner perk. She might not start out very strong or tough, but at least she's fast.
		CoC.player.createPerk( PerkLib.Fast, 0.25, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Runner, 0, 0, 0, 0 );
		//In the human world, Prismere began as a scout, helping patrol areas with portals to make sure demonspawn and corruption didn't reach the human homeland. She's gotten herself into a few tight spots because of it, but she's hard to keep pinned down. She has a fiance back in her village whom she fully intends to get back to, so her libido isn't especially high.
		//As of the time the PC takes her on, she has some signs of demonic taint, so Corruption might start at 5 to 10 points.'	'Breasts at E, height at 5'0, a curvy build with a more narrow waist and substantial hips and butt. Skin is olive, like a mocha, hair is long and wildly wavy, a deep red, and eyes are a stormy blue. Muscles are barely visible; what muscle she has is the lean build of a runner, not a fighter. Nipples aren't especially long, but more soft.
		CoC.player.cor = 5;
		CoC.player.createBreastRow();
		CoC.player.breastRows[ 0 ].breastRating = 7;
		CoC.player.tallness = 60;
		CoC.player.hipRating = 8;
		CoC.player.buttRating = 8;
		CoC.player.thickness = 25;
		CoC.player.tone = 40;
		CoC.player.skinTone = 'olive';
		CoC.player.hairLength = 30;
		CoC.player.hairColor = 'deep red';
		CoC.player.femininity = 90;
		//She has a demonic tail and small demonic wings thanks to some encounters early on with succubus milk (that stuff is delicious!) but is otherwise still human.
		CoC.player.wingType = AppearanceDefs.WING_TYPE_BAT_LIKE_LARGE;
		CoC.player.wingDesc = 'large, bat-like';
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_DEMONIC;
		//I feel really weird talking about all this, so if there's anything you need to change or can't do, or if I totally misinterpreted this, just shoot me an email! jordie.wierenga@gmail.com 0. Thanks in advance... I'm a big fan. '	Prismere
	};
	CharCreation.prototype.customRannRayla = function() {
		//Specific Character	Virgin female.	Max femininity. Thin with a little muscle. Size C breasts. Long red hair. Light colored skin. 5'5' tall. 	Rann Rayla
		EngineCore.outputText( 'You\'re a young, fiery redhead who\'s utterly feminine.  You\'ve got C-cup breasts and long red hair.  Being a champion can\'t be that bad, right?' );
		CoC.player.createVagina();
		CoC.player.clitLength = 0.25;
		CoC.player.createBreastRow();
		CoC.player.breastRows[ 0 ].breastRating = 3;
		CoC.player.nippleLength = 0.5;
		CoC.player.hairLength = 22;
		CoC.player.hairColor = 'red';
		CoC.player.skinTone = 'light';
		CoC.player.skinDesc = 'skin';
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		CoC.player.femininity = 100;
		CoC.player.thickness = 25;
		CoC.player.tone = 65;
		CoC.player.tallness = 65;
	};
	CharCreation.prototype.customRope = function() {
		//529315025394020	Character Creation	Neuter (no genitals) '50-50 masculine-feminine ratio. Shark teeth.'	Rope
		EngineCore.outputText( 'Despite outward appearances, you\'re actually something of a neuter, with shark-like teeth, an androgynous face, and a complete lack of genitalia.' );
		if( CoC.player.hasCock() ) {
			CoC.player.removeCock( 0, 1 );
		}
		if( CoC.player.hasVagina() ) {
			CoC.player.removeVagina();
		}
		CoC.player.gender = 0;
		CoC.player.femininity = 50;
		CoC.player.faceType = AppearanceDefs.FACE_SHARK_TEETH;
	};
	CharCreation.prototype.customSera = function() {
		EngineCore.outputText( 'You\'re something of a shemale - three rows of C-cup breasts matched with three, plump, juicy cocks.  Some decent sized balls, bat wings, and cat-like ears round out the package.' );
		CoC.player.gender = 1;
		CoC.player.tou += 2;
		CoC.player.str += 3;
		CoC.player.fertility = 5;
		CoC.player.hairLength = 26;
		CoC.player.hairColor = 'white';
		CoC.player.skinTone = 'light';
		CoC.player.nippleLength = 0.2;
		CoC.player.createBreastRow();
		CoC.player.createBreastRow();
		CoC.player.createBreastRow();
		CoC.player.breastRows[ 0 ].breastRating = 3;
		CoC.player.breastRows[ 1 ].breastRating = 3;
		CoC.player.breastRows[ 2 ].breastRating = 3;
		CoC.player.createCock();
		CoC.player.createCock();
		CoC.player.createCock();
		CoC.player.cocks[ 0 ].cockLength = 8;
		CoC.player.cocks[ 0 ].cockThickness = 1.6;
		CoC.player.cocks[ 1 ].cockLength = 8;
		CoC.player.cocks[ 1 ].cockThickness = 1.6;
		CoC.player.cocks[ 2 ].cockLength = 8;
		CoC.player.cocks[ 2 ].cockThickness = 1.6;
		CoC.player.balls = 2;
		CoC.player.ballSize = 3;
		CoC.player.tallness = 113;
		CoC.player.tone = 50;
		CoC.player.thickness = 50;
		CoC.player.femininity = 50;
		CoC.player.hipRating = 5;
		CoC.player.buttRating = 5;
		CoC.player.teaseLevel = 1;
		//Build
		//Complexion
		//9 foot 5 inches tall
		//Hair long white
		//Gift of Jizz
		//History
		CoC.player.cumMultiplier = 5.5;
		CoC.player.createPerk( PerkLib.MessyOrgasms, 1.25, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.HistoryScholar, 0, 0, 0, 0 );
		//Apperance Ears, Large Bat Like Wings, 3 Rows of breasts (C cub, 0,2 nipples)
		CoC.player.earType = AppearanceDefs.EARS_CAT;
		CoC.player.wingType = AppearanceDefs.WING_TYPE_BAT_LIKE_LARGE;
		CoC.player.wingDesc = 'large, bat-like';
		//Items, Leather Armor
		CoC.player.setWeapon( WeaponLib.KATANA );
		CoC.player.setArmor( ArmorLib.URTALTA );
		//Key Item Dildo
		CoC.player.createKeyItem( 'Deluxe Dildo', 0, 0, 0, 0 );
	};
	CharCreation.prototype.customSiveen = function() {
		//Female
		//Virgin
		CoC.player.gender = 2;
		CoC.player.createVagina();
		CoC.player.clitLength = 0.25;
		//has a self-repairing hymen in her cunt'	'Angel
		//(means feathered wings on her back)
		CoC.player.wingType = AppearanceDefs.WING_TYPE_HARPY;
		//Halo (Flaming)
		//D-cups
		CoC.player.createBreastRow();
		CoC.player.breastRows[ 0 ].breastRating = 4;
		//human skin
		//heart-shaped ass
		CoC.player.buttRating = 9;
		CoC.player.hipRating = 6;
		//Ass-length white and black hair
		CoC.player.hairLength = 30;
		CoC.player.hairColor = 'white and black';
		//heterochromia (one blue eye one red eye)
		//7'' nips
		CoC.player.nippleLength = 7;
		//waif thin body
		CoC.player.thickness = 0;
		//Fallen Angel gear (complete with flaming sword and light arrows)
		//dark skin tone
		CoC.player.skinTone = 'dark';
		CoC.player.setWeapon( WeaponLib.S_BLADE );
		//Elfin ears
		CoC.player.earType = AppearanceDefs.EARS_ELFIN;
		//tight asshole
		//human tongue
		//human face
		//no tail, fur, or scales'
		CoC.flags[ kFLAGS.HISTORY_PERK_SELECTED ] = 0;
		CoC.player.str = 25;
		CoC.player.tou = 25;
		CoC.player.inte = 25;
		CoC.player.spe = 25;
		EngineCore.outputText( 'You are a literal angel from beyond, and you take the place of a vilage\'s champion for your own reasons...' );
	};
	CharCreation.prototype.customSora = function() {
		//Character Creation	Female,virgin	A kitsune with a snake-like tongue	Sora
		if( CoC.player.hasVagina() ) {
			CoC.player.vaginas[ 0 ].virgin = true;
		}
		CoC.player.tongueType = AppearanceDefs.TONUGE_SNAKE;
		CoC.player.earType = AppearanceDefs.EARS_FOX;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_FOX;
		CoC.player.tailVenom = 2;
		CoC.player.inte = 30;
		if( CoC.player.findStatusAffect( StatusAffects.BonusVCapacity ) < 0 ) {
			CoC.player.createStatusAffect( StatusAffects.BonusVCapacity, 0, 0, 0, 0 );
		} else {
			CoC.player.addStatusValue( StatusAffects.BonusVCapacity, 1, 5 + Utils.rand( 10 ) );
		}
		EngineCore.outputText( 'As a Kitsune, you always got weird looks, but none could doubt your affinity for magic...' );
	};
	CharCreation.prototype.customTestChar = function() {
		CoC.player.XP = 500000;
		CoC.player.level = 20;
		CoC.player.createBreastRow();
		CoC.player.createVagina();
		CoC.player.breastRows[ 0 ].breastRating = 5;
		CoC.player.breastRows[ 0 ].lactationMultiplier = 2;
		CoC.player.clitLength = 0.5;
		CoC.player.fertility = 50;
		CoC.player.gender = 2;
		CoC.player.hipRating = 6;
		CoC.player.buttRating = 6;
		CoC.player.str = 100;
		CoC.player.tou = 100;
		CoC.player.spe = 100;
		CoC.player.inte = 100;
		CoC.player.sens = 100;
		CoC.player.lib = 30;
		CoC.player.cor = 71;
		CoC.notes = 'Cheater!';
		CoC.player.HP = CoC.maxHP();
		CoC.player.hairLength = 10;
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		CoC.player.faceType = AppearanceDefs.FACE_HUMAN;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_FOX;
		CoC.player.tailVenom = 4;
		CoC.player.tongueType = AppearanceDefs.TONUGE_HUMAN;
		CoC.player.femininity = 90;
		CoC.player.beardLength = 0;
		CoC.player.beardStyle = 0;
		CoC.player.tone = 0;
		CoC.player.thickness = 100;
		CoC.player.skinDesc = 'skin';
		CoC.player.skinTone = 'pale';
		CoC.player.hairColor = 'black';
		CoC.player.balls = 2;
		CoC.player.cumMultiplier = 1;
		CoC.player.ballSize = 3;
		CoC.player.hoursSinceCum = 0;
		CoC.player.ass.analLooseness = 0;
		CoC.player.ass.analWetness = 0;
		CoC.player.ass.fullness = 0;
		CoC.player.fertility = 50;
		CoC.player.fatigue = 0;
		CoC.player.horns = 0;
		CoC.player.hornType = AppearanceDefs.HORNS_NONE;
		CoC.player.tallness = 109;
		CoC.player.tailVenom = 0;
		CoC.player.tailRecharge = 0;
		CoC.player.wingType = AppearanceDefs.WING_TYPE_DRACONIC_LARGE;
		CoC.player.wingDesc = 'non-existant';
		CoC.player.earType = AppearanceDefs.EARS_HUMAN;
		CoC.player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HUMAN;
		CoC.player.armType = AppearanceDefs.ARM_TYPE_HUMAN;
		CoC.player.hairLength = 69.2;
		CoC.player.hairType = 4;
		//Bow skill 100 (Sorry Kelt, I can't hear your insults over my mad Robin Hood skillz)
		CoC.player.createStatusAffect( StatusAffects.Kelt, 100, 0, 0, 0 );
		CoC.player.createKeyItem( 'Bow', 0, 0, 0, 0 );
		CoC.player.createKeyItem( 'Zetaz\'s Map', 0, 0, 0, 0 );
		SceneLib.inventory.createStorage();
		SceneLib.inventory.createStorage();
		SceneLib.inventory.createStorage();
		SceneLib.inventory.createStorage();
		SceneLib.inventory.createStorage();
		SceneLib.inventory.createStorage();
		CoC.player.createKeyItem( 'Camp - Chest', 0, 0, 0, 0 );
		CoC.player.createKeyItem( 'Equipment Rack - Weapons', 0, 0, 0, 0 );
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00254 ] = 1;
		CoC.player.createKeyItem( 'Equipment Rack - Armor', 0, 0, 0, 0 );
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00255 ] = 1;
		CoC.player.createStatusAffect( StatusAffects.KnowsWhitefire, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.HistoryFighter, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Acclimation, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Berzerker, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.BrutalBlows, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.DoubleAttack, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.ImmovableObject, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.LightningStrikes, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.LungingAttacks, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Precision, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Regeneration, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Regeneration2, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Resistance, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Resolute, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.SpeedyRecovery, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Tactician, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Tank, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Tank2, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.ThunderousStrikes, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.WeaponMastery, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.WellAdjusted, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.SensualLover, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.SensualLover, 0, 0, 0, 0 );
		CoC.flags[ kFLAGS.VALARIA_AT_CAMP ] = 1;
		CoC.player.gems += 30000;
		EngineCore.outputText( 'You\'re something of a powerhouse, and you wager that between your odd mutations, power strong enough to threaten the village order, and talents, you\'re the natural choice to send through the portal.' );
		CoC.player.itemSlot4.unlocked = true;
		CoC.player.itemSlot5.unlocked = true;
		CoC.player.itemSlot1.setItemAndQty( ConsumableLib.P_LBOVA, 5 );
		CoC.player.itemSlot2.setItemAndQty( ConsumableLib.L_PNKEG, 1 );
		CoC.player.itemSlot3.setItemAndQty( ConsumableLib.OVIELIX, 1 );
		CoC.player.itemSlot4.setItemAndQty( ConsumableLib.REPTLUM, 1 );
		CoC.player.createStatusAffect( StatusAffects.TelAdre, 1, 0, 0, 0 );
		//player.createStatusAffect(StatusAffects.MetWhitney, 2, 0, 0, 0);
		// Izma
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00238 ] = 1;
		// Vapula
		CoC.flags[ kFLAGS.VAPULA_FOLLOWER ] = 1;
		// Amily
		CoC.flags[ kFLAGS.AMILY_FOLLOWER ] = 2;
		// Jojo
		SceneLib.jojoScene.monk = 5;
		// Bimbo Sophie
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00282 ] = 1;
		// Isabella
		CoC.flags[ kFLAGS.ISABELLA_FOLLOWER_ACCEPTED ] = 1;
		// Latexy
		CoC.flags[ kFLAGS.GOO_SLAVE_RECRUITED ] = 1;
		CoC.flags[ kFLAGS.GOO_NAME ] = 'Latexy';
		CoC.flags[ kFLAGS.GOO_FLUID_AMOUNT ] = 100;
		CoC.flags[ kFLAGS.GOO_HAPPINESS ] = 100;
		CoC.flags[ kFLAGS.GOO_OBEDIENCE ] = 100;
		// Ceraph
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00286 ] = 1;
		// Holli
		CoC.flags[ kFLAGS.FUCK_FLOWER_LEVEL ] = 4;
		// Milky
		CoC.flags[ kFLAGS.MILK_NAME ] = 'Milky';
		CoC.flags[ kFLAGS.MILK_SIZE ] = 2;
		CoC.flags[ kFLAGS.RUBI_AFFECTION ] = 75;
		CoC.flags[ kFLAGS.RUBI_INTRODUCED ] = 1;
		// Bazaar
		CoC.flags[ kFLAGS.BAZAAR_ENTERED ] = 1;
	};
	CharCreation.prototype.customTyriana = function() {
		EngineCore.outputText( 'Your many, posh tits, incredible fertility, and well-used cunt made you more popular than the village bicycle.  With your cat-like ears, paws, and tail, you certainly had a feline appeal.  It\'s time to see how you fare in the next chapter of your life.' );
		//'Gender
		CoC.player.gender = 2;
		//Vagina loose, 3 inch clitoris, dripping constantly, fertile like a bunny on steroids and non-virgin
		CoC.player.createVagina();
		CoC.player.clitLength = 3;
		CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_DROOLING;
		CoC.player.vaginas[ 0 ].vaginalLooseness = AppearanceDefs.VAGINA_LOOSENESS_LEVEL_CLOWN_CAR;
		CoC.player.vaginas[ 0 ].virgin = false;
		CoC.player.fertility = 50;
		//Butt as loose
		CoC.player.ass.analLooseness = 5;
		//'Skin
		CoC.player.skinTone = 'tan';
		//Hair long red
		CoC.player.hairLength = 80;
		CoC.player.hairColor = 'red';
		//Face Feminine, long demonic tongue, cat ears
		CoC.player.femininity = 100;
		CoC.player.tongueType = AppearanceDefs.TONUGE_DEMONIC;
		CoC.player.earType = AppearanceDefs.EARS_CAT;
		//Body muscular, average weight, plump ass, above average thighs, cat tail and cat paws
		CoC.player.tone = 80;
		CoC.player.thickness = 50;
		CoC.player.buttRating = 12;
		CoC.player.hipRating = 10;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_CAT;
		CoC.player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_CAT;
		//Breasts E-cups on top, 2 DD-cups mid, 2 D-cups bottom, 3.5 inch nipples
		CoC.player.createBreastRow();
		CoC.player.createBreastRow();
		CoC.player.createBreastRow();
		CoC.player.tallness = 67;
		CoC.player.breastRows[ 0 ].breastRating = 7;
		CoC.player.breastRows[ 1 ].breastRating = 5;
		CoC.player.breastRows[ 2 ].breastRating = 4;
		CoC.player.nippleLength = 3.5;
		//Perks and Fertile'
		CoC.player.spe += 3;
		CoC.player.inte += 2;
		CoC.player.createPerk( PerkLib.HistorySlut, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Fertile, 1.5, 0, 0, 0 );
		CoC.player.teaseLevel = 3;
	};
	CharCreation.prototype.customVahdunbrii = function() {
		CoC.player.createBreastRow();
		CoC.player.createVagina();
		CoC.player.breastRows[ 0 ].breastRating = 3;
		CoC.player.clitLength = 0.5;
		CoC.player.fertility = 10;
		CoC.player.gender = 2;
		CoC.player.hipRating = 6;
		CoC.player.buttRating = 6;
		CoC.player.str = 15;
		CoC.player.tou = 15;
		CoC.player.spe = 18;
		CoC.player.inte = 17;
		CoC.player.sens = 15;
		CoC.player.lib = 15;
		CoC.player.cor = 0;
		CoC.notes = 'No Notes Available.';
		CoC.player.HP = CoC.maxHP();
		CoC.player.hairLength = 10;
		CoC.player.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		CoC.player.faceType = AppearanceDefs.FACE_HUMAN;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_NONE;
		CoC.player.tongueType = AppearanceDefs.TONUGE_HUMAN;
		CoC.player.femininity = 70;
		CoC.player.beardLength = 0;
		CoC.player.beardStyle = 0;
		CoC.player.tone = 30;
		CoC.player.thickness = 50;
		CoC.player.skinDesc = 'skin';
		CoC.player.skinTone = 'light';
		CoC.player.hairColor = 'brown';
		CoC.player.balls = 0;
		CoC.player.cumMultiplier = 1;
		CoC.player.ballSize = 0;
		CoC.player.hoursSinceCum = 0;
		CoC.player.clitLength = 0;
		CoC.player.ass.analLooseness = 0;
		CoC.player.ass.analWetness = 0;
		CoC.player.ass.fullness = 0;
		CoC.player.fertility = 5;
		CoC.player.fatigue = 0;
		CoC.player.horns = 0;
		CoC.player.tallness = 67;
		CoC.player.tailVenom = 0;
		CoC.player.tailRecharge = 0;
		CoC.player.wingType = AppearanceDefs.WING_TYPE_NONE;
		CoC.player.wingDesc = 'non-existant';
		CoC.player.earType = AppearanceDefs.EARS_CAT;
		CoC.player.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_CAT;
		CoC.player.tailType = AppearanceDefs.TAIL_TYPE_CAT;
		CoC.player.createPerk( PerkLib.Incorporeality, 0, 0, 0, 0 );
		CoC.player.wingType = AppearanceDefs.WING_TYPE_FEATHERED_LARGE;
		CoC.player.armType = AppearanceDefs.ARM_TYPE_HARPY;
		CoC.player.hornType = AppearanceDefs.HORNS_DRACONIC_X2;
		CoC.player.horns = 4;
		CoC.player.faceType = AppearanceDefs.FACE_SPIDER_FANGS;
		CoC.player.hairLength = 69.2;
		CoC.player.hairColor = 'dark blue';
		CoC.player.hairType = 2;
		CoC.player.skinAdj = 'smooth';
		CoC.player.skinTone = 'sanguine';
		CoC.player.tallness = 68;
		CoC.player.hipRating = 7;
		CoC.player.buttRating = 6;
		CoC.player.thickness = 4;
		CoC.player.tone = 98;
		CoC.player.breastRows[ 0 ].breastRating = 3;
		CoC.player.clitLength = 0.2;
		CoC.player.femininity = 85;
		//Beautiful Sword
		CoC.player.setWeapon( WeaponLib.B_SWORD );
		CoC.player.setArmor( ArmorLib.SSARMOR );
		//Bow skill 100 (Sorry Kelt, I can't hear your insults over my mad Robin Hood skillz)
		CoC.player.createStatusAffect( StatusAffects.Kelt, 100, 0, 0, 0 );
		CoC.player.createKeyItem( 'Bow', 0, 0, 0, 0 );
		SceneLib.inventory.createStorage();
		SceneLib.inventory.createStorage();
		SceneLib.inventory.createStorage();
		SceneLib.inventory.createStorage();
		SceneLib.inventory.createStorage();
		SceneLib.inventory.createStorage();
		CoC.player.createKeyItem( 'Camp - Chest', 0, 0, 0, 0 );
		CoC.player.createKeyItem( 'Equipment Rack - Weapons', 0, 0, 0, 0 );
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00254 ] = 1;
		CoC.player.createKeyItem( 'Equipment Rack - Armor', 0, 0, 0, 0 );
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00255 ] = 1;
		//(Flexibility), (Incorporeality), History, Dragonfire, Brood Mother, Magical Fertility, Wet Pussy, Tough, Strong, Fast, Smart, History, History, Strong Back, Strong Back 2 Harder
		CoC.player.createPerk( PerkLib.Flexibility, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.HistoryReligious, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Dragonfire, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.BroodMother, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Fertile, 1.5, 0, 0, 0 );
		CoC.player.vaginas[ 0 ].vaginalWetness = AppearanceDefs.VAGINA_WETNESS_WET;
		CoC.player.createPerk( PerkLib.WetPussy, 2, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Tough, 0.25, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Strong, 0.25, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Fast, 0.25, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.Smart, 0.25, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.HistoryScholar, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.StrongBack, 0, 0, 0, 0 );
		CoC.player.itemSlot4.unlocked = true;
		CoC.player.itemSlot5.unlocked = true;
		CoC.player.createPerk( PerkLib.StrongBack2, 0, 0, 0, 0 );
		CoC.player.createPerk( PerkLib.HistorySlacker, 0, 0, 0, 0 );
		CoC.player.str += 4;
		CoC.player.tou += 4;
		CoC.player.inte += 2;
		CoC.player.spe += 2;
		CoC.player.gems += 300;
		EngineCore.outputText( 'You\'re something of a powerhouse, and you wager that between your odd mutations, power strong enough to threaten the village order, and talents, you\'re the natural choice to send through the portal.' );
	};
	var charCreationManager = new CharCreation();
	MainView.registerCharCreation( charCreationManager );
	EngineCore.registerGameOver( charCreationManager.gameOver );
	return charCreationManager;
} );