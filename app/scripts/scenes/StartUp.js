'use strict';

angular.module('cocjs').run( function (SceneLib, $log, CharCreation, CoC, EngineCore, MainView, CoC_Settings, kFLAGS, ImageManager, InputManager) {
	function StartUp() {}
	//MainMenu - kicks player out to the main menu
	StartUp.prototype.mainMenu = function() {
		if( MainView.aCb.visible ) {
			MainView.aCb.visible = false;
		}
		MainView.statsView.hide();
		//Reset newgame buttons
		MainView.setMenuButton( MainView.MENU_NEW_MAIN, 'New Game', CharCreation, CharCreation.newGameGo );
		MainView.hideAllMenuButtons();
		MainView.showMenuButton( MainView.MENU_NEW_MAIN );
		MainView.showMenuButton( MainView.MENU_DATA );
		//Sets game state to 3, used for determining back functionality of save/load menu.
		CoC.gameState = 3;
		MainView.outputText( '<b>Corruption of Champions (' + CoC.version + ')</b>', true );
		if( CoC_Settings.debugBuild ) {
			MainView.outputText( ' Debug Build.' );
		} else {
			MainView.outputText( ' Release Build' );
		}
		//doThatTestingThang();
		this.startupScreenBody();
		var resume = null;
		if( CoC.player.str > 0 ) { // we're in a game, allow resume.
			resume = MainView.playerMenu;
		}
		// I really wanted to only have the 'imageCreditsScreen' button if images were found, but it turns out
		// that if you check if any images were found immediately when this screen is shown, you get 0
		// since the images haven\'t loaded yet.
		// Therefore, the imageCreditScreen will just have to say 'No image pack' if you don\'t have any images
		EngineCore.choices( '', null, null,
			'Image Credits', this, this.imageCreditsScreen,
			'Credits', this, this.creditsScreen,
			'', null, null,
			'Instructions', this, this.howToPlay,
			'', null, null,
			'', null, null,
			'', null, null,
			'Settings', this, this.settingsScreen,
			'Resume', null, resume );
	};
	StartUp.prototype.startupScreenBody = function() {
		MainView.outputText('<br>(Formerly Unnamed Text Game)<br><br>' + 
			'<u>Created by: Fenoxo</u><br><br>' + 
			'Edited By:<br>' + 
			'&nbsp; &nbsp; &nbsp; Ashi, SoS, Prisoner416, Zeikfried, et al<br><br>' + 
			
			'Open-source contributions by:<br>' + 
			'&nbsp; &nbsp; &nbsp; aimozg, Amygdala, Cmacleod42, Enterprise2001, Fake-Name, Gedan, Yoffy, et al<br><br>' + 
			
			'Source Code: <u><a href=\'https://github.com/adamrpc/cocjs\'>https://github.com/adamrpc/cocjs</a></u><br>' + 
			'Bug Tracker: <u><a href=\'https://github.com/adamrpc/cocjs/issues\'>https://github.com/adamrpc/cocjs/issues</a></u><br>' + 
			'(requires an account, unfortunately)<br><br>' + 
			
			'**<u>DISCLAIMER</u>**<br><br>' + 
			
			'- **There are many strange and odd fetishes contained in this flash.  Peruse at own risk.**' + 
			
			'<br><br>- **Please be 18 or the legal age to view porn before playing.**' + 
			
			'<br><br>- **Try to keep your keyboard clean.  Think of the children!**<br><br><br>' + 
			
			'For more information see Fenoxo\'s Blog at <b><u><a href=\'http://www.fenoxo.com/\'>fenoxo.com</a></u></b>.<br><br>' + 
			
			'Also go play <u><a href=\'http://www.furaffinity.net/view/9830293/\'>Nimin</a></u> by Xadera on furaffinity.', false, true);
		if( !CoC.flags[ kFLAGS.SHOW_SPRITES_FLAG ] ) {
			MainView.outputText( '\n\n<b>Sprites disabled.</b>' );
		}
		if( CoC.flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] ) {
			MainView.outputText( '\n\n<b>Easy Mode On:  Bad-ends can be ignored.</b>' );
		}
		if( CoC.flags[ kFLAGS.SILLY_MODE_ENABLE_FLAG ] ) {
			MainView.outputText( '\n\n<b>SILLY MODE ENGAGED: Crazy, nonsensical, and possibly hilarious things may occur.</b>' );
		}
		if( CoC.isEaster() ) {
			MainView.outputText( '\n\n<b>It\'s Easter!  Enjoy the eggs!</b>' );
		}
		if( SceneLib.valentines.isValentine() ) {
			MainView.outputText( '\n\n<b>It\'s Valentine\'s!</b>' );
		}
		if( SceneLib.helFollower.isHeliaBirthday() ) {
			MainView.outputText( '\n\n<b>It\'s Helia\'s Birthday Month!</b>' );
		}
	};
	StartUp.prototype.settingsScreen = function() {
		MainView.showMenuButton( MainView.MENU_NEW_MAIN );
		MainView.showMenuButton( MainView.MENU_DATA );
		MainView.outputText( '<b>Settings toggles:</b>\n', true );
		MainView.outputText( 'Debug mode enabled: <b>No</b>\n	Items consumption will occur as normal.' );
		MainView.outputText( '\n\n' );
		if( CoC.flags[ kFLAGS.SHOW_SPRITES_FLAG ] ) {
			MainView.outputText( 'Sprites enabled: <b>Yes</b>.\n	You like to look at pretty pictures.' );
		} else {
			MainView.outputText( 'Sprites enabled: <b>No</b>.\n	There are only words. Nothing else.' );
		}
		MainView.outputText( '\n\n' );
		if( CoC.flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] ) {
			MainView.outputText( 'Easy Mode <b>On</b>\n	Bad-ends can be ignored and combat is easier.' );
		} else {
			MainView.outputText( 'Easy Mode <b>Off</b>\n	Bad-ends can ruin your game and combat is challenging.' );
		}
		MainView.outputText( '\n\n' );
		if( CoC.flags[ kFLAGS.SILLY_MODE_ENABLE_FLAG ] ) {
			MainView.outputText( 'Silly Mode <b>On</b>\n	Crazy, nonsensical, and possibly hilarious things may occur.' );
		} else {
			MainView.outputText( 'Silly Mode <b>Off</b>\n	You\'re an incorrigable stick-in-the-mud with no sense of humor.' );
		}
		MainView.outputText( '\n\n' );
		MainView.outputText( '<b>The following flags are not fully implemented yet (e.g. they don\'t apply in <i>all</i> cases where they could be relevant).</b>\n' );
		MainView.outputText( 'Additional note: You <b>must</b> be <i>in a game session</i> (e.g. load your save, hit "Main Menu", change the flag settings, and then hit "Resume") to change these flags. They\'re saved into the saveGame file, so if you load a save, it will clear them to the state in that save.' );
		MainView.outputText( '\n\n' );
		if( CoC.flags[ kFLAGS.LOW_STANDARDS_FOR_ALL ] ) {
			MainView.outputText( 'Low standards Mode <b>On</b>\n	NPCs ignore body type preferences.' );
			MainView.outputText( '\n	(Not gender preferences though. You still need the right hole.)' );
		} else {
			MainView.outputText( 'Low standards Mode <b>Off</b>\n	NPCs have body-type preferences.' );
		}
		MainView.outputText( '\n\n' );
		if( CoC.flags[ kFLAGS.HYPER_HAPPY ] ) {
			MainView.outputText( 'Hyper Happy mode <b>On</b>\n	Only reducto and humus shrink endowments.' );
			MainView.outputText( '\n	Incubus draft doesn\'t affect breasts, and succubi milk doesn\'t affect cocks.' );
		} else {
			MainView.outputText( 'Hyper Happy mode <b>Off</b>\n	Male enhancement potions shrink female endowments, and vice versa.' );
		}
		EngineCore.choices( '', null, null,
			'Sprite Toggle', this, this.toggleSpritesFlag,
			'EZ Mode', this, this.toggleEasyModeFlag,
			'', null, null,
			'Controls', this, this.displayControls,
			'Hyper Happy', this, this.toggleHyperHappy,
			'Low Standards', this, this.toggleStandards,
			'Silly Toggle', this, this.toggleSillyFlag,
			'', null, null,
			'Back', this, this.mainMenu );
	};
	StartUp.prototype.displayControls = function() {
		MainView.hideAllMenuButtons();
		InputManager.DisplayBindingPane();
		EngineCore.choices( 'Reset Ctrls', this, this.resetControls,
			'Clear Ctrls', this, this.clearControls,
			'Null', null, null,
			'Null', null, null,
			'Null', null, null,
			'Null', null, null,
			'Null', null, null,
			'Null', null, null,
			'Null', null, null,
			'Back', this, this.hideControls );
	};
	StartUp.prototype.hideControls = function() {
		InputManager.HideBindingPane();
		this.settingsScreen();
	};
	StartUp.prototype.resetControls = function() {
		InputManager.HideBindingPane();
		MainView.outputText( 'Are you sure you want to reset all of the currently bound controls to their defaults?', true );
		EngineCore.doYesNo( this, this.resetControlsYes, this, this.displayControls );
	};
	StartUp.prototype.resetControlsYes = function() {
		InputManager.ResetToDefaults();
		MainView.outputText( 'Controls have been reset to defaults!\n\n', true );
		EngineCore.doNext( this, this.displayControls );
	};
	StartUp.prototype.clearControls = function() {
		InputManager.HideBindingPane();
		MainView.outputText( 'Are you sure you want to clear all of the currently bound controls?', true );
		EngineCore.doYesNo( this, this.clearControlsYes, this, this.displayControls );
	};
	StartUp.prototype.clearControlsYes = function() {
		InputManager.ClearAllBinds();
		MainView.outputText( 'Controls have been cleared!', true );
		EngineCore.doNext( this, this.displayControls );
	};
	StartUp.prototype.toggleStandards = function() {
		CoC.flags[ kFLAGS.LOW_STANDARDS_FOR_ALL ] = !CoC.flags[ kFLAGS.LOW_STANDARDS_FOR_ALL ];
		this.settingsScreen();
		return;
	};
	StartUp.prototype.toggleHyperHappy = function() {
		CoC.flags[ kFLAGS.HYPER_HAPPY ] = !CoC.flags[ kFLAGS.HYPER_HAPPY ];
		this.settingsScreen();
		return;
	};
	StartUp.prototype.toggleEasyModeFlag = function() {
		CoC.flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] = !CoC.flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ];
		this.settingsScreen();
		MainView.showMenuButton( MainView.MENU_DATA );
		this.settingsScreen();
		return;
	};
	StartUp.prototype.toggleSpritesFlag = function() {
		CoC.flags[ kFLAGS.SHOW_SPRITES_FLAG ] = !CoC.flags[ kFLAGS.SHOW_SPRITES_FLAG ];
		this.settingsScreen();
		return;
	};
	StartUp.prototype.toggleSillyFlag = function() {
		CoC.flags[ kFLAGS.SILLY_MODE_ENABLE_FLAG ] = !CoC.flags[ kFLAGS.SILLY_MODE_ENABLE_FLAG ];
		this.settingsScreen();
		return;
	};
	StartUp.prototype.creditsScreen = function() {
		MainView.outputText( '<b>Coding and Main Events:</b>\n', true );
		MainView.outputText( '<ul>' );
		MainView.outputText( '<li> Fenoxo</li>\n' );
		MainView.outputText( '</ul>' );
		MainView.outputText( '<b>Typo Reporting</b>\n' );
		MainView.outputText( '<ul>' );
		MainView.outputText( '<li> SoS</li>' );
		MainView.outputText( '<li> Prisoner416</li>' );
		MainView.outputText( '<li> Chibodee</li>' );
		MainView.outputText( '</ul>' );
		MainView.outputText( '' );
		MainView.outputText( '<b>Graphical Prettiness:</b>' );
		MainView.outputText( '<ul>' );
		MainView.outputText( '<li> Dasutin (Background Images)</li>' );
		MainView.outputText( '<li> Invader (Button Graphics, Font, and Other Hawtness)</li>' );
		MainView.outputText( '</ul>' );
		MainView.outputText( '<b>Supplementary Events:</b>' );
		MainView.outputText( '<ul>' );
		MainView.outputText( '<li> Dxasmodeus (Tentacles, Worms, Giacomo)</li>' );
		MainView.outputText( '<li> Kirbster (Christmas Bunny Trap)</li>' );
		MainView.outputText( '<li> nRage (Kami the Christmas Roo)</li>' );
		MainView.outputText( '<li> Abraxas (Alternate Naga Scenes w/Various Monsters, Tamani Anal, Female Shouldra Tongue Licking, Chameleon Girl, Christmas Harpy)</li>' );
		MainView.outputText( '<li> Astronomy (Fetish Cultist Centaur Footjob Scene)</li>' );
		MainView.outputText( '<li> Adjatha (Scylla the Cum Addicted Nun, Vala, Goo-girls, Bimbo Sophie Eggs, Ceraph Urta Roleplay, Gnoll with Balls Scene, Kiha futa scene, Goblin Web Fuck Scene, and 69 Bunny Scene)</li>' );
		MainView.outputText( '<li> ComfyCushion (Muff Wrangler)</li>' );
		MainView.outputText( '<li> B (Brooke)</li>' );
		MainView.outputText( '<li> Quiet Browser (Half of Niamh, Ember, Amily The Mouse-girl Breeder, Katherine, Part of Katherine Employment Expansion, Urta\'s in-bar Dialogue Trees, some of Izma, Loppe)</li>' );
		MainView.outputText( '<li> Indirect (Alternate Non-Scylla Katherine Recruitment, Part of Katherine Employment Expansion, Phouka, Coding of Bee Girl Expansion)</li>' );
		MainView.outputText( '<li> Schpadoinkle (Victoria Sex)</li>' );
		MainView.outputText( '<li> Donto (Ro\'gar the Orc, Polar Pete)</li>' );
		MainView.outputText( '<li> Angel (Additional Amily Scenes)</li>' );
		MainView.outputText( '<li> Firedragon (Additional Amily Scenes)</li>' );
		MainView.outputText( '<li> Danaume (Jojo masturbation texts)</li>' );
		MainView.outputText( '<li> LimitLax (Sand-Witch Bad-End)</li>' );
		MainView.outputText( '<li> KLN (Equinum Bad-End)</li>' );
		MainView.outputText( '<li> TheDarkTemplar11111 (Canine Pepper Bad End)</li>' );
		MainView.outputText( '<li> Silmarion (Canine Pepper Bad End)</li>' );
		MainView.outputText( '<li> Soretu (Original Minotaur Rape)</li>' );
		MainView.outputText( '<li> NinjArt (Small Male on Goblin Rape Variant)</li>' );
		MainView.outputText( '<li> DoubleRedd ("Too Big" Corrupt Goblin Fuck)</li>' );
		MainView.outputText( '<li> Nightshade (Additional Minotaur Rape)</li>' );
		MainView.outputText( '<li> JCM (Imp Night Gangbang, Addition Minotaur Loss Rape - Oral)</li>' );
		MainView.outputText( '<li> Xodin (Nipplefucking paragraph of Imp GangBang, Encumbered by Big Genitals Exploration Scene, Big Bits Run Encumbrance, Player Getting Beer Tits, Sand Witch Dungeon Misc Scenes)</li>' );
		MainView.outputText( '<li> Blusox6 (Original Queen Bee Rape)</li>' );
		MainView.outputText( '<li> Thrext (Additional Masturbation Code, Faerie, Ivory Succubus)</li>' );
		MainView.outputText( '<li> XDumort (Genderless Anal Masturbation)</li>' );
		MainView.outputText( '<li> Uldego (Slime Monster)</li>' );
		MainView.outputText( '<li> Noogai, Reaper, and Numbers (Nipple-Fucking Victory vs Imp Rape)</li>' );
		MainView.outputText( '<li> Verse and IAMurow (Bee-Girl MultiCock Rapes)</li>' );
		MainView.outputText( '<li> Sombrero (Additional Imp Lust Loss Scene (Dick insertion ahoy!)</li>' );
		MainView.outputText( '<li> The Dark Master (Marble, Fetish Cultist, Fetish Zealot, Hellhound, Lumi, Some Cat Transformations, LaBova, Ceraph\'s Cat-Slaves, a Cum Witch Scene, Mouse Dreams, Forced Nursing:Imps&Goblins, Bee Girl Expansion)</li>' );
		MainView.outputText( '<li> Mr. Fleshcage (Cat Transformation/Masturbation)</li>' );
		MainView.outputText( '<li> Spy (Cat Masturbation, Forced Nursing: Minotaur, Bee, & Cultist)</li>' );
		MainView.outputText( '<li> PostNuclearMan (Some Cat TF)</li>' );
		MainView.outputText( '<li> MiscChaos (Forced Nursing: Slime Monster)</li>' );
		MainView.outputText( '<li> Ourakun (Kelt the Centaur)</li>' );
		MainView.outputText( '<li> Rika_star25 (Desert Tribe Bad End)</li>' );
		MainView.outputText( '<li> Versesai (Additional Bee Rape)</li>' );
		MainView.outputText( '<li> Mallowman (Additional Bee Rape)</li>' );
		MainView.outputText( '<li> HypnoKitten (Additional Centaur x Imp Rape)</li>' );
		MainView.outputText( '<li> Ari (Minotaur Gloryhole Scene)</li>' );
		MainView.outputText( '<li> SpectralTime (Aunt Nancy)</li>' );
		MainView.outputText( '<li> Foxxling (Akbal)</li>' );
		MainView.outputText( '<li> Elfensyne (Phylla)</li>' );
		MainView.outputText( '<li> Radar (Dominating Sand Witches, Some Phylla)</li>' );
		MainView.outputText( '<li> Jokester (Sharkgirls, Izma, & Additional Amily Scenes)</li>' );
		MainView.outputText( '<li> Lukadoc (Additional Izma, Ceraph Followers Corrupting Gangbang, Satyrs, Ember)</li>' );
		MainView.outputText( '<li> IxFa (Dildo Scene, Virgin Scene for Deluxe Dildo, Naga Tail Masturbation)</li>' );
		MainView.outputText( '<li> Bob (Additional Izma)</li>' );
		MainView.outputText( '<li> lh84 (Various Typos and Code-Suggestions)</li>' );
		MainView.outputText( '<li> Dextersinister (Gnoll girl in the plains)</li>' );
		MainView.outputText( '<li> ElAcechador, Bandichar, TheParanoidOne, Xoeleox (All Things Naga)</li>' );
		MainView.outputText( '<li> Symphonie (Dominika the Fellatrix, Ceraph RPing as Dominika, Tel\'Adre Library)</li>' );
		MainView.outputText( '<li> Soulsemmer (Ifris)</li>' );
		MainView.outputText( '<li> WedgeSkyrocket (Zetsuko, Pure Amily Anal, Kitsunes)</li>' );
		MainView.outputText( '<li> Zeikfried (Anemone, Male Milker Bad End, Kanga TF, Raccoon TF, Minotaur Chef Dialogues, Sheila, and More)</li>' );
		MainView.outputText( '<li> User21 (Additional Centaur/Naga Scenes)</li>' );
		MainView.outputText( '<li> ~M~ (Bimbo + Imp loss scene)</li>' );
		MainView.outputText( '<li> Grype (Raping Hellhounds)</li>' );
		MainView.outputText( '<li> B-Side (Fentendo Entertainment Center Silly-Mode Scene)</li>' );
		MainView.outputText( '<li> Not Important (Face-fucking a defeated minotaur)</li>' );
		MainView.outputText( '<li> Third (Cotton, Rubi, Nieve, Urta Pet-play)</li>' );
		MainView.outputText( '<li> Gurumash (Parts of Nieve)</li>' );
		MainView.outputText( '<li> Kinathis (A Nieve Scene, Sophie Daughter Incest, Minerva)</li>' );
		MainView.outputText( '<li> Jibajabroar (Jasun)</li>' );
		MainView.outputText( '<li> Merauder (Raphael)</li>' );
		MainView.outputText( '<li> EdgeofReality (Gym fucking machine)</li>' );
		MainView.outputText( '<li> Bronycray (Heckel the Hyena)</li>' );
		MainView.outputText( '<li> Sablegryphon (Gnoll spear-thrower)</li>' );
		MainView.outputText( '<li> Nonesuch (Basilisk, Sandtraps, assisted with Owca/Vapula, Whitney Farm Corruption)</li>' );
		MainView.outputText( '<li> Anonymous Individual (Lilium, PC Birthing Driders)</li>' );
		MainView.outputText( '<li> PKD (Owca, Vapula, Fap Arena, Isabella Tentacle Sex, Lottie Tentacle Sex)</li>' );
		MainView.outputText( '<li> Shamblesworth (Half of Niamh, Shouldra the Ghost-Girl, Ceraph Roleplaying As Marble, Yara Sex, Shouldra Follow Expansion)</li>' );
		MainView.outputText( '<li> Kirbu (Exgartuan Expansion, Yara Sex, Shambles\'s Handler, Shouldra Follow Expansion)</li>' );
		MainView.outputText( '<li> 05095 (Shouldra Expansion, Tons of Editing)</li>' );
		MainView.outputText( '<li> Smidgeums (Shouldra + Vala threesome)</li>' );
		MainView.outputText( '<li> FC (Generic Shouldra talk scene)</li>' );
		MainView.outputText( '<li> Oak (Bro + Bimbo TF, Isabella\'s ProBova Burps)</li>' );
		MainView.outputText( '<li> Space (Victory Anal Sex vs Kiha)</li>' );
		MainView.outputText( '<li> Venithil (LippleLock w/Scylla & Additional Urta Scenes)</li>' );
		MainView.outputText( '<li> Butts McGee (Minotaur Hot-dogging PC loss, Tamani Lesbo Face-ride, Bimbo Sophie Mean/Nice Fucks)</li>' );
		MainView.outputText( '<li> Savin (Hel the Salamander, Valeria, Spanking Drunk Urta, Tower of the Phoenix, Drider Anal Victory, Hel x Isabella 3Some, Centaur Sextoys, Thanksgiving Turkey, Uncorrupt Latexy Recruitment, Assert Path for Direct Feeding Latexy, Sanura the Sphinx)</li>' );
		MainView.outputText( '<li> Gats (Lottie, Spirit & Soldier Xmas Event, Kiha forced masturbation, Goblin Doggystyle, Chicken Harpy Egg Vendor)</li>' );
		MainView.outputText( '<li> Aeron the Demoness (Generic Goblin Anal, Disciplining the Eldest Minotaur)</li>' );
		MainView.outputText( '<li> Gats, Shamblesworth, Symphonie, and Fenoxo (Corrupted Drider)</li>' );
		MainView.outputText( '<li> Bagpuss (Female Thanksgiving Event, Harpy Scissoring, Drider Bondage Fuck)</li>' );
		MainView.outputText( '<li> Frogapus (The Wild Hunt)</li>' );
		MainView.outputText( '<li> Fenoxo (Everything Else)</li>' );
		MainView.outputText( '</ul>' );
		MainView.outputText( '<b>Oviposition Update Credits - Names in Order Appearance in Oviposition Document</b>' );
		MainView.outputText( '<ul>' );
		MainView.outputText( '<li> DCR (Idea, Drider Transformation, and Drider Impreg of: Goblins, Beegirls, Nagas, Harpies, and Basilisks)</li>' );
		MainView.outputText( '<li> Fenoxo (Bee Ovipositor Transformation, Bee Oviposition of Nagas and Jojo, Drider Oviposition of Tamani)</li>' );
		MainView.outputText( '<li> Smokescreen (Bee Oviposition of Basilisks)</li>' );
		MainView.outputText( '<li> Radar (Oviposition of Sand Witches)</li>' );
		MainView.outputText( '<li> OutlawVee (Bee Oviposition of Goo-Girls)</li>' );
		MainView.outputText( '<li> Zeikfried (Editing this mess, Oviposition of Anemones)</li>' );
		MainView.outputText( '<li> Woodrobin (Oviposition of Minotaurs)</li>' );
		MainView.outputText( '<li> Posthuman (Oviposition of Ceraph Follower)</li>' );
		MainView.outputText( '<li> Slywyn (Bee Oviposition of Gigantic PC Dick)</li>' );
		MainView.outputText( '<li> Shaxarok (Drider Oviposition of Large Breasted Nipplecunts)</li>' );
		MainView.outputText( '<li> Quiet Browser (Bee Oviposition of Urta)</li>' );
		MainView.outputText( '<li> Bagpuss (Laying Eggs In Pure Amily)</li>' );
		MainView.outputText( '<li> Eliria (Bee Laying Eggs in Bunny-Girls)</li>' );
		MainView.outputText( '<li> Gardeford (Helia x Bimbo Sophie Threesomes)</li>' );
		MainView.outputText( '</ul>' );
		MainView.outputText( '\nIf I\'m missing anyone, please contact me ASAP!  I have done a terrible job keeping the credits up to date!' );
		EngineCore.doNext( this, this.mainMenu );
	};
	StartUp.prototype.imageCreditsScreen = function() {
		if( ImageManager.getLoadedImageCount() > 0 ) {
			MainView.outputText('**Bundled Image Credits:**<br><br>' + 

				'**Yoh-SL**<br><br>' + 

				'* Bee-Girl Monster Image<br>' + 
				'* Goo-Girl Monster Image<br>' + 
				'* Ceraph Monster Image<br>' + 
				'* Sand-Witch (and sandwich)<br>', true, true);
		} else {
			MainView.outputText( '<b>No Image-Pack Found!</b>\n', true );
		}
		EngineCore.doNext( this, this.mainMenu );
	};
	StartUp.prototype.howToPlay = function() {
		MainView.outputText( '', true );
		MainView.outputText( '<b><u>How To Play:</u></b>\nClick the buttons corresponding to the actions you want to take.  Your \'goal\' is to obviously put an end to the demonic corruption around you, but do whatever the hell you want.  There is a story but sometimes it\'s fun to ignore it.\n\n', false );
		MainView.outputText( '<b>Exploration:</b>\nThe lake is a safe zone when you start the game.  It\'s a good place to explore, and Whitney\'s farm can offer some nice stat boosts to help get you on your feet. Once you feel comfortable, the forest is probably the next safest area, but beware of tentacle monsters.  The desert is the next toughest area, and the mountains offer further challenges.  There are more areas beyond that, but that\'s a good way to get started.  You\'ll uncover plenty of new \'places\' exploring, which can be accessed from the <b>Places</b> menu.  You\'ll also find some interesting characters when you try to discover new explorable locations by choosing <b>Explore</b> twice.\n\n', false );
		MainView.outputText( '<b>Combat:</b>\nCombat is won by raising an opponent\'s lust to 100 or taking their HP to 0.  You lose if your enemy does the same to you.  Loss isn\'t game over, but some losses will make it harder in the future by lowering your stats.  Beware.  Don\'t be afraid to spam the <b>Run</b> option when you\'re in over your head.\n\n', false );
		MainView.outputText( '<b>Controls:</b>\nThe game features numerous hot-keys to make playing quicker and easier.\nP key - Perks Menu\nD key - Data Menu\nA key - Appearance Screen\n1 Through 5 - The top row of \'choice\' buttons.\n6 Through 0 - The bottom row of \'choice\' buttons.\nQ through T - Alternative bottom \'choice\' hotkeys.\nSpace Bar - Next/Back/Leave\nHome Key - Toggle text field background.\nS key - Stats Screen\n(Save Hotkeys - May not work in all players)\nF1-F5 - Quicksave to slot 1 through 5.  Only works when Data is visible.\nF6-F0 - Quick Load from slots 1-5.\n\n', false );
		MainView.outputText( '<b>Save often using the Data Menu</b> - you never know when your journey will come to an end!', false );
		EngineCore.doNext( this, this.mainMenu );
	};
	SceneLib.registerScene('startUp', new StartUp());
});