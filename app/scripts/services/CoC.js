'use strict';

angular.module('cocjs').factory('CoC', function (UseableLib, CoC_Settings, Mutations, Inventory, PerkLib, StatusAffects, ConsumableLib, WeaponLib, ArmorLib, Appearance, EngineCore, Parser, GameModel, CharCreation, Saves, Player, PlayerEvents, Monster) {
	var instance = null;
	function CoC() {
		this.init(this, arguments);
	}
	CoC.getInstance = function() {
		if(instance === null) {
			instance = new CoC();
		}
		return instance;
	};
	CoC.prototype.init = function(that) {
		CoC_Settings.haltOnErrors = false; // TODO : put it in properties file
		that.parser = new Parser(that, CoC_Settings);
		that.charCreation = new CharCreation();
		that.saves = new Saves(function(){ return that.gameState; }, function(value) { that.gameState = value; }, that);
		/**
		 * Global Variables used across the whole game. I hope to whittle it down slowly.
		 */
		/**
		 * System Variables
		 * Debug, Version, etc
		 */
		//DEBUG, used all over the place
		that.debug = false; // TODO : put it in properties file
		//Version NUMBER
		that.ver = "0.9.4"; // TODO : put it in properties file
		that.version = that.ver + " (<b>Moar Bugfixan</b>)"; // TODO : put it in properties file
		// TODO : Convert include "../../includes/ControlBindings.as"; into HTML
		/**
		 * Player specific variables
		 * The player object and variables associated with the player
		 */
		//The Player object, used everywhere
		that.player = new Player();
		that.player2 = new Player();
		that.playerEvent = new PlayerEvents();
		//Create monster, used all over the place
		that.monster = new Monster();
		/**
		 * State Variables
		 * They hold all the information about item states, menu states, game states, etc
		 */
		//The extreme flag state array. This needs to go. Holds information about everything, whether it be certain attacks for NPCs 
		//or state information to do with the game. 
		that.flags = {};
		// Used everywhere to establish what the current game state is
		// Key system variables
		//0 = normal
		//1 = in combat
		//2 = in combat in grapple
		//3 = at start or game over screen
		that.gameState = 0;
		/**
		 * Display Variables
		 * Variables that hold display information like number of days and all the current displayed text
		 */

		//Holds the date and time display in the bottom left
		that.time = {
			days: 0,
			hours : 0,
			getTotalTime: function() {
				return (that.time.days * 24 + that.time.hours);
			}
		};
		//The string holds all the "story" text, mainly used in engineCore
		that.currentText = '';
		/**
		 * Plot Variables
		 * Booleans and numbers about whether you've found certain places
		 */
		//Plot variables
		that.explored = false;
		that.foundForest = false;
		that.foundDesert = false;
		that.foundMountain = false;
		that.foundLake = false;
		that.whitney = 0;
		that.monk = 0;
		that.sand = 0;
		that.giacomo = 0;
		that.inCombat = false;
		that.scenes = {};
		that.mutations = new Mutations();
		that.consumables = new ConsumableLib();
		that.useables = new UseableLib();
		that.weapons = new WeaponLib();
		that.armors = new ArmorLib();
		that.inventory = new Inventory(that.saves);
		that._perkLib = new PerkLib();// to init the static
		that._statusAffects = new StatusAffects();// to init the static

		// *************************************************************************************
		//Used to set what each action buttons displays and does.
		that.args = [];
		that.funcs = [];

		//Used for stat tracking to keep up/down arrows correct.
		that.oldStats = {};
		that.oldStats.oldStr  = 0;
		that.oldStats.oldTou  = 0;
		that.oldStats.oldSpe  = 0;
		that.oldStats.oldInte = 0;
		that.oldStats.oldSens = 0;
		that.oldStats.oldLib  = 0;
		that.oldStats.oldCor  = 0;
		that.oldStats.oldHP   = 0;
		that.oldStats.oldLust = 0;
		// ******************************************************************************************
		/*
		 * TODO : Replace this by angular events.
		 * that.timeAwareLargeLastEntry = -1;
		 * that._timeAwareClassList = [];
		 * that._saveAwareClassList = [];
		 */
	};
	CoC.prototype.isEaster = function() {
		if(!_.has(this.scenes, 'plains')) {
			return false;
		}
		return this.scenes.plains.bunnyGirl.isItEaster();
	};
	CoC.prototype.isInCombat = function() {
		return this.gameState === 1;
	};
	CoC.prototype.setInCombat = function(value) {
		this.gameState = value ? 1 : 0;
	};
	CoC.prototype.registerScene = function(name, scene) {
		this.scenes[name] = scene;
	};
	/*
	 * TODO : Replace this by angular events.
	 * CoC.prototype.timeAwareClassAdd = function(newEntry) {
	 * 	CoC._timeAwareClassList.push(newEntry);
	 * };
	 * //Any classes that need to be made aware when the game is saved or loaded can add themselves to this array using saveAwareAdd.
	 * //	Once in the array they will be notified by Saves.as whenever the game needs them to write or read their data to the flags array.
	 * CoC.prototype.saveAllAwareClasses = function() {
	 * 	_.forEach(CoC._saveAwareClassList, function(value) {
	 * 		value.updateBeforeSave();
	 * 	});
	 * };
	 * //Called by the loadGameObject function in Saves
	 * //Called by the saveGameObject function in Saves
	 * CoC.prototype.loadAllAwareClasses = function() {
	 * 	_.forEach(CoC._saveAwareClassList, function(value) {
	 * 		value.updateAfterLoad();
	 * 	});
	 * };
	 * CoC.prototype.saveAwareClassAdd = function(newEntry) {
	 * 	CoC._saveAwareClassList.push(newEntry);
	 * };
	 */
	return new CoC();
	/*
	TODO : Convert scences and call CoC.registerScene;
			private static var doCamp:Function; //Set by campInitialize, should only be called by playerMenu
		private static function campInitialize(passDoCamp:Function):void { doCamp = passDoCamp; }
		// Items/
		
		// Scenes/
		public var camp:Camp = new Camp(campInitialize);
		public var exploration:Exploration = new Exploration();
		public var followerInteractions:FollowerInteractions = new FollowerInteractions();
		public var masturbation:Masturbation = new Masturbation();
		// Scenes/Areas/
		public var bog:Bog = new Bog();
		public var desert:Desert = new Desert();
		public var forest:Forest = new Forest();
		public var highMountains:HighMountains = new HighMountains();
		public var lake:Lake = new Lake();
		public var mountain:Mountain = new Mountain();
		public var swamp:Swamp = new Swamp();
		// Scenes/Dungeons
		public var brigidScene:BrigidScene = new BrigidScene();
		public var d3:D3 = new D3();
		// Scenes/Explore/
		public var gargoyle:Gargoyle = new Gargoyle();
		public var lumi:Lumi = new Lumi();
		// Scenes/Monsters/
		public var goblinScene:GoblinScene = new GoblinScene();
		public var impScene:ImpScene = new ImpScene();
		public var goblinAssassinScene:GoblinAssassinScene = new GoblinAssassinScene();
		// Scenes/NPC/
		public var amilyScene:AmilyScene = new AmilyScene();
		public var anemoneScene:AnemoneScene = new AnemoneScene();
		public var arianScene:ArianScene = new ArianScene();
		public var ceraphScene:CeraphScene = new CeraphScene();
		public var ceraphFollowerScene:CeraphFollowerScene = new CeraphFollowerScene();
		public var emberScene:EmberScene = new EmberScene();
		public var exgartuan:Exgartuan = new Exgartuan();
		public var helFollower:HelFollower = new HelFollower();
		public var helScene:HelScene = new HelScene();
		public var helSpawnScene:HelSpawnScene = new HelSpawnScene();
		public var holliScene:HolliScene = new HolliScene();
		public var isabellaScene:IsabellaScene = new IsabellaScene();
		public var isabellaFollowerScene:IsabellaFollowerScene = new IsabellaFollowerScene();
		public var izmaScene:IzmaScene = new IzmaScene();
		public var jojoScene:JojoScene = new JojoScene();
		public var kihaFollower:KihaFollower = new KihaFollower();
		public var kihaScene:KihaScene = new KihaScene();
		public var latexGirl:LatexGirl = new LatexGirl();
		public var marbleScene:MarbleScene = new MarbleScene();
		public var marblePurification:MarblePurification = new MarblePurification();
		public var milkWaifu:MilkWaifu = new MilkWaifu();
		public var raphael:Raphael = new Raphael();
		public var rathazul:Rathazul = new Rathazul();
		public var sheilaScene:SheilaScene = new SheilaScene();
		public var shouldraFollower:ShouldraFollower = new ShouldraFollower();
		public var shouldraScene:ShouldraScene = new ShouldraScene();
		public var sophieBimbo:SophieBimbo = new SophieBimbo();
		public var sophieFollowerScene:SophieFollowerScene = new SophieFollowerScene();
		public var sophieScene:SophieScene = new SophieScene();
		public var urta:Urta = new Urta();
		public var urtaHeatRut:UrtaHeatRut = new UrtaHeatRut();
		public var urtaPregs:UrtaPregs = new UrtaPregs();
		public var valeria:Valeria = new Valeria();
		public var vapula:Vapula = new Vapula();
		// Scenes/Places/
		public var bazaar:Bazaar = new Bazaar();
		public var boat:Boat = new Boat();
		public var farm:Farm = new Farm();
		public var owca:Owca = new Owca();
		public var telAdre:TelAdre = new TelAdre();
		// Scenes/Quests/
		public var urtaQuest:UrtaQuest = new UrtaQuest();
		// Other scenes
		include "../../includes/april_fools.as";
		include "../../includes/dreams.as";
		include "../../includes/dungeon2Supplimental.as";
		include "../../includes/dungeonCore.as";
		include "../../includes/dungeonHelSupplimental.as";
		include "../../includes/dungeonSandwitch.as";
		include "../../includes/fera.as";
		include "../../includes/pregnancy.as";
		include "../../includes/runa.as";
		include "../../includes/symGear.as";
		include "../../includes/tamaniDildo.as";
		include "../../includes/thanksgiving.as";
		include "../../includes/valentines.as";
		include "../../includes/worms.as";
		include "../../includes/xmas_bitch.as";
		include "../../includes/xmas_gats_not_an_angel.as";
		include "../../includes/xmas_jack_frost.as";
		include "../../includes/xmas_misc.as";
		*/
});
