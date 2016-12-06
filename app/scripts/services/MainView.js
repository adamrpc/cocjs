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

angular.module( 'cocjs' ).factory( 'MainView', function( OnLoadVariables, SceneLib, $log, kFLAGS, CoC, StatsView, Appearance, Perk, PerkLib) {
	var BOTTOM_BUTTON_COUNT = 10;
    var parser = null;
	var sprites = [
		'0-akbal.png',
		'100-rubi_horns.png',
		'101-venus.png',
		'102-kitsune_black.png',
		'103-kitsune_blonde.png',
		'104-kitsune_red.png',
		'10-cotton.png',
		'11-easter bunneh.png',
		'12-edryn.png',
		'13-exgartuan.png',
		'14-factory omnibus.png',
		'15-faerie.png',
		'16-fenimp.png',
		'17-fetish cultist.png',
		'18-fetish zealot.png',
		'1-amily.png',
		'-1-urta.png',
		'21-giacomo.png',
		'22-goblin.png',
		'23-green slime.png',
		'24-harpy.png',
		'25-hellhound.png',
		'26-ifris.png',
		'27-imp.png',
		'28-incubus mechanic.png',
		'29-isabella.png',
		'2-anemone.png',
		'30-izma.png',
		'32-jojo.png',
		'33-kelt.png',
		'34-lottie.png',
		'35-lumi.png',
		'36-lynette.png',
		'37-maddie.png',
		'38-marae.png',
		'39-marble.png',
		'40-markus and lucia.png',
		'42-minotaur.png',
		'43-naga.png',
		'44-oasis demons.png',
		'45-oswald.png',
		'47-rathazul.png',
		'48-sandwich.png',
		'49-scylla.png',
		'4-bee girl.png',
		'50-sean.png',
		'51-sophie.png',
		'52-spear gnoll.png',
		'53-succubus secretary.png',
		'54-tamani.png',
		'55-tamani_s daughters.png',
		'56-uncloaked dominika.png',
		'57-vagrant cats.png',
		'58-vala.png',
		'59-victoria.png',
		'5-ceraph.png',
		'61-yara.png',
		'62-yvonne.png',
		'63-amily_defurr.png',
		'66-hel_sprite.png',
		'67-googirlsprite.png',
		'68-sharkgirl.png',
		'69-kida.png',
		'6-cerulean succubus.png',
		'70-kiha.png',
		'71-spidergirl.png',
		'72-spiderguy.png',
		'73-basilisk.png',
		'74-dickworms.png',
		'75-drider.png',
		'76-poisontail.png',
		'77-valeria.png',
		'78-weaponsmith.png',
		'79-jojoTentacle.png',
		'7-christmas elf.png',
		'80-scyllaAndBear.png',
		'81-sophieBimbo.png',
		'82-urtaDrunk.png',
		'83-valaSlave.png',
		'84-rogar.png',
		'85-ceraphClothed.png',
		'86-ceraphGoblin.png',
		'87-chameleon.png',
		'88-chickenHarpy.png',
		'89-cinnabar.png',
		'8-cloaked dominika.png',
		'90-corruptedGlade.png',
		'91-lilium.png',
		'92-minotaurSons.png',
		'93-minerva.png',
		'94-mrsCoffee.png',
		'95-sandtrap.png',
		'96-satyr.png',
		'97-stuckSatyr.png',
		'98-tentacleMonster.png',
		'99-rubi_hornless.png',
		'9-club gnoll.png'
	];
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
		dataProvider: [{label:'TEMP',perk:new Perk(PerkLib.Acclimation)}],
		visible: false
	};
	MainView.nameBox = {
		visible: false,
		value: ''
	};
	MainView.fontSize = null;
	MainView.bindingPane = {
		visible: false,
		functions: [],
		keyDown: function($event) {
			if(!MainView.bindingPane.currentKey) {
				return;
			}
			MainView.bindingPane.currentKey.temp = $event;
			if($event.code.startsWith('Key')) {
				angular.extend(MainView.bindingPane.currentKey, MainView.bindingPane.currentKey.temp);
				MainView.bindingPane.currentKey.temp = null;
				MainView.bindingPane.currentKey = null;
			}
		},
		currentKey: null,
		listenForKey: function(key) {
			if(MainView.bindingPane.currentKey) {
				MainView.bindingPane.currentKey.temp = null;
			}
			MainView.bindingPane.currentKey = key;
		}
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
		newGameButton: {visible: false, labelText: 'New Game', callback: null, toolTipText:'New Game'},
		dataButton: {visible: false, labelText: 'Data', callback: null, toolTipText:'Data'},
		statsButton: {visible: false, labelText: 'Stats', callback: CoC.displayStats, toolTipText:'Stats'},
		levelButton: {visible: false, labelText: 'Level', callback: CoC.levelUpGo, toolTipText:'Level'},
		perksButton: {visible: false, labelText: 'Perks', callback: CoC.displayPerks, toolTipText:'Perks'},
		appearanceButton: {visible: false, labelText: 'Appearance', callback: Appearance.appearance, toolTipText:'Appearance'}
	};
	MainView.showLevelUp = function() {
		MainView.menuButtons.levelButton.visible = true;
	};
	MainView.hideLevelUp = function() {
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
		var sprite = _.find(sprites, function(img) { return img.startsWith(index + '-'); });
		if( !sprite || CoC.flags[ kFLAGS.SHOW_SPRITES_FLAG ] ) {
			MainView.sprite.visible = false;
		} else {
			MainView.sprite.visible = true;
			MainView.sprite.index = sprite;
		}
	};
	MainView.hideSprite = function() {
		MainView.selectSprite( -1 );
	};
	MainView.registerSave = function( saveManager ) {
		MainView.menuButtons.dataButton.callback = saveManager.saveLoad;
	};
	var _charCreationManager = null;
	MainView.registerCharCreation = function( charCreationManager ) {
		_charCreationManager = charCreationManager;
		MainView.menuButtons.newGameButton.callback = charCreationManager.newGameGo;
	};
	MainView.resetNewGameButton = function( ) {
		MainView.setMenuButton( MainView.MENU_NEW_MAIN, 'New Game', _charCreationManager.newGameGo );
	};
	MainView.spriteSelect = function( choice ) {
		if(choice === undefined) {
			choice = 0;
		}
		if( CoC.flags[ kFLAGS.SHOW_SPRITES_FLAG ] === 0 ) {
			MainView.selectSprite( choice );
		} else if( choice >= 0 ) {
			$log.trace( 'hiding sprite because flags' );
			MainView.selectSprite( -1 );
		}
	};
	MainView.clearOutput = function() {
		MainView.mainText = '';
		MainView.clearOutputText();
		if( CoC.gameState !== 3 ) {
			MainView.hideMenuButton( MainView.MENU_DATA );
		}
		MainView.hideMenuButton( MainView.MENU_APPEARANCE );
		MainView.hideMenuButton( MainView.MENU_LEVEL );
		MainView.hideMenuButton( MainView.MENU_PERKS );
		MainView.hideMenuButton( MainView.MENU_STATS );
	};
	MainView.registerParser = function( _parser ) {
		parser = _parser;
	};
	MainView.outputText = function( output, purgeText, parseAsMarkdown ) {
		// we have to purge the output text BEFORE calling parseText, because if there are scene commands in
		// the parsed text, parseText() will write directly to the output
		if( purgeText ) {
			MainView.clearOutput();
		}
		$log.debug(parser);
		output = parser.recursiveParser( output, parseAsMarkdown );
		//OUTPUT!
		if( purgeText ) {
			MainView.mainText = output;
		} else {
			MainView.mainText += output;
		}
		$log.debug('Text that should display : ', MainView.mainText);
	};
	var combatMenuCallback = null;
	MainView.registerCombatMenu = function( _combatMenuCallback ) {
		combatMenuCallback = _combatMenuCallback;
	};
	MainView.playerMenu = function() {
		if( !CoC.isInCombat() ) {
			MainView.spriteSelect( -1 );
		}
		MainView.resetNewGameButton();
		MainView.nameBox.visible = false;
		if( CoC.gameState === 1 || CoC.gameState === 2 ) {
			combatMenuCallback();
			return;
		}
		//Clear restriction on item overlaps if not in combat
		OnLoadVariables.plotFight = false;
		if( SceneLib.dungeonCore.isInDungeon() ) {
			SceneLib.dungeonCore.dungeonMenu();
			return;
		} else if( OnLoadVariables.inRoomedDungeon ) {
			if( OnLoadVariables.inRoomedDungeonResume !== null ) {
				OnLoadVariables.inRoomedDungeonResume();
			}
			return;
		}
		CoC.flags[ kFLAGS.PLAYER_PREGGO_WITH_WORMS ] = 0;
		SceneLib.camp.doCamp(); // TODO : Put this in camp scene.
	};
	return MainView;
});