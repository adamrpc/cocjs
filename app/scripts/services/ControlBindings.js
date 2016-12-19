'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, $log, Saves, MainView, InputManager, CoC, EngineCore, Appearance, kFLAGS ) {
	InputManager.AddBindableControl(
		'Show Stats',
		'Show the stats pane when available',
		function() {
			if (MainView.menuButtonIsVisible(MainView.MENU_STATS) && CoC.player.str > 0) {
				CoC.displayStats();
			}
		}
	);
	InputManager.AddBindableControl(
		'Level Up',
		'Show the level up page when available',
		function() {
			if (MainView.menuButtonIsVisible(MainView.MENU_LEVEL) && CoC.player.str > 0) {
				CoC.levelUpGo();
			}
		}
	);
	_.forEach(_.range(5), function(value) {
		InputManager.AddBindableControl(
			'Quicksave ' + (value + 1),
			'Quicksave the current game to slot ' + (value + 1),
			function() {
				if (MainView.menuButtonIsVisible(MainView.MENU_DATA) && CoC.player.str > 0) {
					MainView.nameBox.text = '';
					Saves.saveGame('CoC_' + (value + 1));
					MainView.outputText('Game saved to slot ' + (value + 1) + '!', true);
					EngineCore.doNext( MainView, MainView.playerMenu);
				}
			}
		);
	});
	_.forEach(_.range(5), function(value) {
		InputManager.AddBindableControl(
			'Quickload ' + (value + 1),
			'Quickload the current game from slot ' + (value + 1),
			function() {
				if (MainView.menuButtonIsVisible(MainView.MENU_DATA) && Saves.loadGame('CoC_' + (value + 1))) {
					MainView.statsView.show();
					MainView.statsView.show();
					MainView.outputText('Slot ' + (value + 1) + ' Loaded!', true);
					EngineCore.doNext( MainView, MainView.playerMenu);
				}
			}
		);
	});
	InputManager.AddBindableControl(
		'Show Menu',
		'Show the main menu',
		function() {
			if (MainView.menuButtonIsVisible(MainView.MENU_NEW_MAIN) && MainView.menuButtonHasLabel(MainView.MENU_NEW_MAIN, 'Main Menu')) {
				SceneLib.startUp.mainMenu();
			}
		}
	);
	InputManager.AddBindableControl(
		'Data Menu',
		'Show the save/load menu',
		function() {
			if (MainView.menuButtonIsVisible(MainView.MENU_DATA)) {
				Saves.saveLoad();
			}
		}
	);
	InputManager.AddBindableControl(
		'Appearance Page',
		'Show the appearance page',
		function() {
			if (MainView.menuButtonIsVisible(MainView.MENU_APPEARANCE)) {
				Appearance.appearance();
			}
		}
	);
	InputManager.AddBindableControl(
		'No',
		'Respond no to any available prompt',
		function() {
			if (MainView.getButtonText(1) === 'No' && MainView.buttonIsVisible(1)) {
				MainView.clickButton(1);
			}
		}
	);
	InputManager.AddBindableControl(
		'Yes',
		'Respond yes to any available prompt',
		function() {
			if (MainView.getButtonText(0) === 'Yes' && MainView.buttonIsVisible(0)) {
				MainView.clickButton(0);
			}
		}
	);
	InputManager.AddBindableControl(
		'Show Perks',
		'Show the perks page',
		function() {
			if (MainView.menuButtonIsVisible(MainView.MENU_PERKS)) {
				EngineCore.displayPerks(undefined);
			}
		}
	);
	InputManager.AddBindableControl(
		'Continue',
		'Respond to continue',
		function() {
			// Button 9
			if (MainView.buttonIsVisible(9) && MainView.buttonTextIsOneOf(9, [ 'Nevermind', 'Abandon', 'Next', 'Return', 'Back', 'Leave', 'Resume' ])) {
				MainView.toolTipView.hide();
				MainView.clickButton(9);
				return;
			}
			// Button 0
			if (MainView.buttonIsVisible(0) && MainView.buttonTextIsOneOf(0, [ 'Next', 'Return', 'Back' ])) {
				MainView.toolTipView.hide();
				MainView.clickButton(0);
				return;
			}
			// Button 4
			if (MainView.buttonIsVisible(4) && MainView.buttonTextIsOneOf(4, [ 'Nevermind', 'Next', 'Return', 'Back', 'Leave' ])) {
				MainView.toolTipView.hide();
				MainView.clickButton(4);
				return;
			}
			// Button 5
			if (MainView.buttonIsVisible(5) && MainView.buttonTextIsOneOf(5, [ 'Next', 'Return', 'Back' ])) {
				MainView.toolTipView.hide();
				MainView.clickButton(5);
				return;
			}
		}
	);
	InputManager.AddBindableControl(
		'Cycle Background',
		'Cycle the background fill of the text display area',
		function() {
			if (!MainView.textBGWhite.visible) {
				MainView.textBGWhite.visible = true;
			} else if (!MainView.textBGTan.visible) {
				MainView.textBGTan.visible = true;
			} else {
				MainView.textBGWhite.visible = false;
				MainView.textBGTan.visible = false;
			}
		}
	);
	_.forEach(_.range(10), function(value) {
		InputManager.AddBindableControl(
			'Button ' + (value + 1),
			'Activate button ' + (value + 1),
			function() {
				if (MainView.buttonIsVisible(value)) {
					MainView.toolTipView.hide();
					MainView.clickButton(value);
				}
			}
		);
	});
	InputManager.AddBindableControl(
		'Cheat! Give Hummus',
		'Cheat code to get free hummus',
		function(keyCode) {
			if (CoC.flags[kFLAGS.CHEAT_ENTERING_COUNTER] === 0) {
				if (keyCode === 38) {
					CoC.flags[kFLAGS.CHEAT_ENTERING_COUNTER]++;
				} else {
					CoC.flags[kFLAGS.CHEAT_ENTERING_COUNTER] = 0;
				}
			} else if (CoC.flags[kFLAGS.CHEAT_ENTERING_COUNTER] === 1) {
				if (keyCode === 40) {
					CoC.flags[kFLAGS.CHEAT_ENTERING_COUNTER]++;
				} else {
					CoC.flags[kFLAGS.CHEAT_ENTERING_COUNTER] = 0;
				}
			} else if (CoC.flags[kFLAGS.CHEAT_ENTERING_COUNTER] === 2) {
				if (keyCode === 37) {
					CoC.flags[kFLAGS.CHEAT_ENTERING_COUNTER]++;
				} else {
					CoC.flags[kFLAGS.CHEAT_ENTERING_COUNTER] = 0;
				}
			} else if (CoC.flags[kFLAGS.CHEAT_ENTERING_COUNTER] === 3) {
				if (keyCode === 39) {
					if (CoC.player.str > 0 && MainView.getButtonText(0).indexOf('Game Over') === -1) {
						SceneLib.inventory.giveHumanizer();
					}
				} else {
					CoC.flags[kFLAGS.CHEAT_ENTERING_COUNTER] = 0;
				}
			}
		},
		InputManager.CHEATCONTROL
	);
	// Insert the default bindings
	InputManager.BindKeyToControl(83, 'Show Stats');
	InputManager.BindKeyToControl(76, 'Level Up');
	InputManager.BindKeyToControl(112, 'Quicksave 1');
	InputManager.BindKeyToControl(113, 'Quicksave 2');
	InputManager.BindKeyToControl(114, 'Quicksave 3');
	InputManager.BindKeyToControl(115, 'Quicksave 4');
	InputManager.BindKeyToControl(116, 'Quicksave 5');
	InputManager.BindKeyToControl(117, 'Quickload 1');
	InputManager.BindKeyToControl(118, 'Quickload 2');
	InputManager.BindKeyToControl(119, 'Quickload 3');
	InputManager.BindKeyToControl(120, 'Quickload 4');
	InputManager.BindKeyToControl(121, 'Quickload 5');
	InputManager.BindKeyToControl(8, 'Show Menu');
	InputManager.BindKeyToControl(68, 'Data Menu');
	InputManager.BindKeyToControl(65, 'Appearance Page');
	InputManager.BindKeyToControl(78, 'No');
	InputManager.BindKeyToControl(89, 'Yes');
	InputManager.BindKeyToControl(80, 'Show Perks');
	InputManager.BindKeyToControl(13, 'Continue');
	InputManager.BindKeyToControl(32, 'Continue', InputManager.SECONDARYKEY);
	InputManager.BindKeyToControl(36, 'Cycle Background');
	InputManager.BindKeyToControl(49, 'Button 1');
	InputManager.BindKeyToControl(50, 'Button 2');
	InputManager.BindKeyToControl(51, 'Button 3');
	InputManager.BindKeyToControl(52, 'Button 4');
	InputManager.BindKeyToControl(53, 'Button 5');
	InputManager.BindKeyToControl(54, 'Button 6');
	InputManager.BindKeyToControl(55, 'Button 7');
	InputManager.BindKeyToControl(56, 'Button 8');
	InputManager.BindKeyToControl(57, 'Button 9');
	InputManager.BindKeyToControl(48, 'Button 10');
	InputManager.BindKeyToControl(81, 'Button 6', InputManager.SECONDARYKEY);
	InputManager.BindKeyToControl(87, 'Button 7', InputManager.SECONDARYKEY);
	InputManager.BindKeyToControl(69, 'Button 8', InputManager.SECONDARYKEY);
	InputManager.BindKeyToControl(82, 'Button 9', InputManager.SECONDARYKEY);
	InputManager.BindKeyToControl(84, 'Button 10', InputManager.SECONDARYKEY);
	InputManager.RegisterDefaults();
});