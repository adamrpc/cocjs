'use strict';

angular.module('cocjs').factory('CoC', function (Inventory, CharCreation, Saves, Player, PlayerEvents, Monster) {
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
		that.charCreation = new CharCreation(); // TODO : pu this elsewhere
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
		/**
		 * Player specific variables
		 * The player object and variables associated with the player
		 */
		//The Player object, used everywhere
		that.player = new Player(); // TODO : Store only Object here, extract functions
		that.player2 = new Player(); // TODO : Store only Object here, extract functions
		that.playerEvent = new PlayerEvents(); // TODO : Store only Object here, extract functions
		//Create monster, used all over the place
		that.monster = new Monster(); // TODO : Store only Object here, extract functions
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
		that.sand = 0;
		that.giacomo = 0;
		that.inCombat = false;
		that.scenes = {};
		that.inventory = new Inventory(that.saves); // TODO : Store only Object here, extract functions

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
	};
    // TODO : WTF is it doing here ?
	CoC.prototype.isEaster = function() {
		if(!_.has(this.scenes, 'bunnyGirl')) {
			return false;
		}
		return this.scenes.bunnyGirl.isItEaster();
	};
    // TODO : WTF is it doing here ?
	CoC.prototype.isInCombat = function() {
		return this.gameState === 1;
	};
    // TODO : WTF is it doing here ?
	CoC.prototype.setInCombat = function(value) {
		this.gameState = value ? 1 : 0;
	};
	CoC.prototype.registerScene = function(name, scene) {
		this.scenes[name] = scene;
	};
	return new CoC();
});
