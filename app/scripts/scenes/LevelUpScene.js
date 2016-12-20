'use strict';

/* jshint latedef:nofunc */
angular.module('cocjs').run( function (SceneLib, $log, CoC, EngineCore, MainView ) {
	function LevelUpScene() {}
	LevelUpScene.prototype.levelUpGo = function() { // TODO : Move this into a new LevelUpScene.
		MainView.clearOutput();
		MainView.hideAllMenuButtons();
		MainView.hideMenuButton( MainView.MENU_NEW_MAIN );
		//Level up
		if( CoC.player.XP >= (CoC.player.level) * 100 ) {
			CoC.player.level++;
			CoC.player.perkPoints++;
			MainView.outputText( '<b>You are now level ' + CoC.player.level + '!</b>\n\nYou may now apply +5 to one attribute.  Which will you choose?' );
			CoC.player.XP -= (CoC.player.level - 1) * 100;
			MainView.menu();
			EngineCore.addButton( 0, 'Strength', null, levelUpStatStrength );
			EngineCore.addButton( 1, 'Toughness', null, levelUpStatToughness );
			EngineCore.addButton( 2, 'Speed', null, levelUpStatSpeed );
			EngineCore.addButton( 3, 'Intelligence', null, levelUpStatIntelligence );
		} else if( CoC.player.perkPoints > 0 ) { //Spend perk points
			SceneLib.perkScene.perkBuyMenu();
		} else {
			MainView.outputText( '<b>ERROR.  LEVEL UP PUSHED WHEN PC CANNOT LEVEL OR GAIN PERKS.  PLEASE REPORT THE STEPS TO REPRODUCE THIS BUG TO FENOXO@GMAIL.COM OR THE FENOXO.COM BUG REPORT FORUM.</b>' );
			EngineCore.doNext( MainView, MainView.playerMenu );
		}
	};
	var levelUpStatStrength = function() { // TODO : Move this into a new LevelUpScene.
		EngineCore.dynStats( 'str', 5 ); //Gain +5 Str due to level
		MainView.clearOutput();
		MainView.outputText( 'Your muscles feel significantly stronger from your time adventuring.' );
		EngineCore.doNext( SceneLib.perkScene, SceneLib.perkScene.perkBuyMenu );
	};
	var levelUpStatToughness = function() { // TODO : Move this into a new LevelUpScene.
		EngineCore.dynStats( 'tou', 5 ); //Gain +5 Toughness due to level
		$log.debug( 'HP: ' + CoC.player.HP + ' MAX HP: ' + CoC.player.maxHP() );
		MainView.statsView.show();
		MainView.clearOutput();
		MainView.outputText( 'You feel tougher from all the fights you have endured.' );
		EngineCore.doNext( SceneLib.perkScene, SceneLib.perkScene.perkBuyMenu );
	};
	var levelUpStatSpeed = function() { // TODO : Move this into a new LevelUpScene.
		EngineCore.dynStats( 'spe', 5 ); //Gain +5 speed due to level
		MainView.clearOutput();
		MainView.outputText( 'Your time in combat has driven you to move faster.' );
		EngineCore.doNext( SceneLib.perkScene, SceneLib.perkScene.perkBuyMenu );
	};
	var levelUpStatIntelligence = function() { // TODO : Move this into a new LevelUpScene.
		EngineCore.dynStats( 'int', 5 ); //Gain +5 Intelligence due to level
		MainView.clearOutput();
		MainView.outputText( 'Your time spent fighting the creatures of this realm has sharpened your wit.' );
		EngineCore.doNext( SceneLib.perkScene, SceneLib.perkScene.perkBuyMenu );
	};

	SceneLib.registerScene('levelUpScene', new LevelUpScene());
	MainView.setMenuButton( MainView.MENU_LEVEL, 'Level', SceneLib.levelUpScene, SceneLib.levelUpScene.levelUpGo );
});