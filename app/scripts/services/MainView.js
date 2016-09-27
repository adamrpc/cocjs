/****
 coc.view.MainView
 I have no real idea yet what eventTestInput is for,
 but its coordinates get tested for in places, and set in others.
 Perhaps some day I'll ask.
 It's for allowing people to test stuff in the parser. It gets moved into view, and you
 can enter stuff in the text window, which then gets fed through the parser.
 That's good to know.  Cheers.
 ****/
'use strict';

angular.module( 'cocjs' ).factory( 'MainView', function($log, kFLAGS, CoC, StatsView, Appearance, EngineCore, PerkClass, PerkLib) {
	var BOTTOM_BUTTON_COUNT = 10;
	var MainView = {};
	// Menu button names.
	MainView.MENU_NEW_MAIN = 'newGame';
	MainView.MENU_DATA = 'data';
	MainView.MENU_STATS = 'stats';
	MainView.MENU_LEVEL = 'level';
	MainView.MENU_PERKS = 'perks';
	MainView.MENU_APPEARANCE = 'appearance';
	MainView.aCb = {
		value: null,
		dataProvider: [{label:'TEMP',perk:new PerkClass(PerkLib.Acclimation)}],
		visible: false
	};
	MainView.statsView = new StatsView(MainView);
	MainView.bottomButtons = [];
	_.forEach(_.range(BOTTOM_BUTTON_COUNT), function() {
		MainView.bottomButtons.push({labelText:'', callback:function(){}, visible: false, toolTipText:''});
	});
	var currentActiveButtons = [];
	//////// Internal(?) view update methods ////////
	MainView.showBottomButton = function( index, label, callback, toolTipViewText ) {
		var button = MainView.bottomButtons[ index ];
		// Should error.
		if( !button ) {
			return;
		}
		if( toolTipViewText === undefined ) {
			toolTipViewText = '';
		}
		button.labelText = label;
		button.callback = callback;
		button.toolTipText = toolTipViewText;
		button.visible = true;
	};
	MainView.hideBottomButton = function( index ) {
		var button = MainView.bottomButtons[ index ];
		// Should error.
		if( !button ) {
			return;
		}
		button.visible = false;
	};
	MainView.hideCurrentBottomButtons = function() {
		currentActiveButtons = [];
		_.forEach(MainView.bottomButtons, function(button, index) {
			if( button.visible === true ) {
				currentActiveButtons.push( index );
				button.visible = false;
			}
		});
	};
	MainView.showCurrentBottomButtons = function() {
		_.forEach(MainView.currentActiveButtons, function(button) {
				button.visible = true;
		});
	};

	// There was one case where the label needed to be set but I could not determine from context whether the button should be shown or not...
	MainView.setButtonText = function( index, label ) {
		MainView.bottomButtons[ index ].labelText = label;
	};
	MainView.indexOfButtonWithLabel = function( labelText ) {
		return _.findIndexOf(MainView.bottomButtons, function(button) {
			return button.labelText === labelText;
		});
	};
	MainView.clearBottomButtons = function() {
		return _.forEach(MainView.bottomButtons, function(button, index) {
			MainView.setButton( index );
		});
	};
	MainView.getButtonText = function( index ) {
		if( index < 0 || index >= MainView.bottomButtons.length ) {
			return '';
		}
		return MainView.bottomButtons[ index ].labelText;
	};
	MainView.clickButton = function( index ) {
		MainView.bottomButtons[ index ].callback();
	};
	MainView.buttonIsVisible = function( index ) {
		if( index < 0 || index >= MainView.bottomButtons.length ) {
			return null;
		}
		return MainView.bottomButtons[ index ].visible;
	};
	MainView.menuButtons = {
		newGameButton: {visible: false, labelText: '', callback: CoC.getInstance().charCreation.newGameGo, toolTipText:''},
		dataButton: {visible: false, labelText: '', callback: CoC.getInstance().saves.saveLoad, toolTipText:''},
		statsButton: {visible: false, labelText: '', callback: CoC.getInstance().displayStats, toolTipText:''},
		levelButton: {visible: false, labelText: '', callback: CoC.getInstance().levelUpGo, toolTipText:''},
		perksButton: {visible: false, labelText: '', callback: CoC.getInstance().displayPerks, toolTipText:''},
		appearanceButton: {visible: false, labelText: '', callback: Appearance.appearance, toolTipText:''}
	};
	MainView.prototype.showLevelUp = function() {
		MainView.menuButtons.levelButton.visible = true;
	};
	MainView.prototype.hideLevelUp = function() {
		MainView.menuButtons.levelButton.visible = false;
	};
	//////// Bottom Button Methods ////////
	// TODO button set-up code to use callback and toolTipViewText here.
	MainView.setButton = function( index, label, callback, toolTipViewText ) {
		if( label === undefined ) {
			label = '';
		}
		if( toolTipViewText === undefined ) {
			toolTipViewText = '';
		}
		if( index < 0 || index >= BOTTOM_BUTTON_COUNT ) {
			$log.debug( 'MainView.setButton called with out of range index:', index );
			return;
		}
		if( label ) {
			MainView.showBottomButton( index, label, callback, toolTipViewText );
		} else {
			MainView.hideBottomButton( index );
		}
	};
	MainView.hasButton = function( labelText ) {
		return MainView.indexOfButtonWithLabel( labelText ) !== -1;
	};
	// This function checks if the button at index has text
	// that matches at least one of the possible texts passed as an argument.
	MainView.buttonTextIsOneOf = function( index, possibleLabels ) {
		return (possibleLabels.indexOf( MainView.getButtonText( index ) ) !== -1);
	};

	//////// Menu Button Methods ////////
	MainView.getMenuButtonByName = function( name ) {
		if(!MainView.menuButtons[ name + 'Button' ]) {
			$log.error(name + 'Button does not exists');
		}
		return MainView.menuButtons[ name + 'Button' ];
	};
	////////
	MainView.setMenuButton = function( name, label, callback ) {
		if( label === undefined ) {
			label = '';
		}
		var button = MainView.getMenuButtonByName( name );
		if( !button ) {
			throw 'MainView.setMenuButton menu has no button named "' + String( name ) + '"';
		}
		if( label ) {
			button.labelText = label;
		}
		if( callback ) {
			button.callback = callback;
		}
	};
	MainView.showMenuButton = function( name ) {
		MainView.getMenuButtonByName( name ).visible = true;
	};
	MainView.hideMenuButton = function( name ) {
		MainView.getMenuButtonByName( name ).visible = false;
	};
	MainView.showAllMenuButtons = function() {
		MainView.showMenuButton( MainView.MENU_NEW_MAIN );
		MainView.showMenuButton( MainView.MENU_DATA );
		MainView.showMenuButton( MainView.MENU_STATS );
		MainView.showMenuButton( MainView.MENU_LEVEL );
		MainView.showMenuButton( MainView.MENU_PERKS );
		MainView.showMenuButton( MainView.MENU_APPEARANCE );
	};
	MainView.hideAllMenuButtons = function() {
		MainView.hideMenuButton( MainView.MENU_NEW_MAIN );
		MainView.hideMenuButton( MainView.MENU_DATA );
		MainView.hideMenuButton( MainView.MENU_STATS );
		MainView.hideMenuButton( MainView.MENU_LEVEL );
		MainView.hideMenuButton( MainView.MENU_PERKS );
		MainView.hideMenuButton( MainView.MENU_APPEARANCE );
	};
	MainView.menuButtonIsVisible = function( name ) {
		return MainView.getMenuButtonByName( name ).visible;
	};
	MainView.menuButtonHasLabel = function( name, label ) {
		return MainView.getMenuButtonByName( name ).labelText === label;
	};
	MainView.clearOutputText = function() {
		MainView.mainText = '';
	};
	MainView.appendOutputText = function( text ) {
		MainView.mainText += text;
	};
	MainView.setOutputText = function( text ) {
		MainView.mainText = text;
	};
	MainView.sprite = {visible: false, index: -1};
	MainView.selectSprite = function( index ) {
		if(index === undefined) {
			index = 0;
		}
		if( index < 0 || CoC.getInstance().flags[ kFLAGS.SHOW_SPRITES_FLAG ] ) {
			MainView.sprite.visible = false;
		} else {
			MainView.sprite.visible = true;
			MainView.sprite.index = index;
		}
	};
	MainView.hideSprite = function() {
		MainView.selectSprite( -1 );
	};
	return MainView;
});