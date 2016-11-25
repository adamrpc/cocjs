'use strict';

angular.module('cocjs').factory('StartUp', function ($log, CoC, EngineCore, MainView, CoC_Settings, kFLAGS, EventParser, ImageManager, InputManager, Valentines) {
	var StartUp = {};
	//MainMenu - kicks player out to the main menu
	StartUp.mainMenu = function() {
		CoC.getInstance().stage.focus = MainView.mainText;
		if( MainView.aCb.visible ) {
			MainView.aCb.visible = false;
		}
		EngineCore.hideStats();
		//Reset newgame buttons
		MainView.setMenuButton( MainView.MENU_NEW_MAIN, 'New Game', CoC.getInstance().charCreation.newGameGo );
		MainView.hideAllMenuButtons();
		MainView.showMenuButton( MainView.MENU_NEW_MAIN );
		MainView.showMenuButton( MainView.MENU_DATA );
		//Sets game state to 3, used for determining back functionality of save/load menu.
		CoC.getInstance().gameState = 3;
		EngineCore.outputText( '<b>Corruption of Champions (' + CoC.getInstance().version + ')</b>', true );
		if( CoC_Settings.debugBuild ) {
			EngineCore.outputText( ' Debug Build.' );
		} else {
			EngineCore.outputText( ' Release Build' );
		}
		//doThatTestingThang();
		StartUp.startupScreenBody();
		var resume = null;
		if( CoC.getInstance().player.str > 0 ) { // we're in a game, allow resume.
			resume = EventParser.playerMenu;
		}
		// I really wanted to only have the 'imageCreditsScreen' button if images were found, but it turns out
		// that if you check if any images were found immediately when this screen is shown, you get 0
		// since the images haven\'t loaded yet.
		// Therefore, the imageCreditScreen will just have to say 'No image pack' if you don\'t have any images
		EngineCore.choices( '', null,
			'Image Credits', StartUp.imageCreditsScreen,
			'Credits', StartUp.creditsScreen,
			'', null,
			'Instructions', StartUp.howToPlay,
			'', null,
			'', null,
			'', null,
			'Settings', StartUp.settingsScreen,
			'Resume', resume );
	};
	StartUp.startupScreenBody = function() {
		EngineCore.outputText('<br>(Formerly Unnamed Text Game)<br><br>' + 
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
		if( CoC.getInstance().flags[ kFLAGS.SHOW_SPRITES_FLAG ] ) {
			EngineCore.outputText( '\n\n<b>Sprites disabled.</b>' );
		}
		if( CoC.getInstance().flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] ) {
			EngineCore.outputText( '\n\n<b>Easy Mode On:  Bad-ends can be ignored.</b>' );
		}
		if( CoC.getInstance().flags[ kFLAGS.SILLY_MODE_ENABLE_FLAG ] ) {
			EngineCore.outputText( '\n\n<b>SILLY MODE ENGAGED: Crazy, nonsensical, and possibly hilarious things may occur.</b>' );
		}
		if( CoC.getInstance().isEaster() ) {
			EngineCore.outputText( '\n\n<b>It\'s Easter!  Enjoy the eggs!</b>' );
		}
		if( Valentines.isValentine() ) {
			EngineCore.outputText( '\n\n<b>It\'s Valentine\'s!</b>' );
		}
		if( CoC.getInstance().scenes.helFollower.isHeliaBirthday() ) {
			EngineCore.outputText( '\n\n<b>It\'s Helia\'s Birthday Month!</b>' );
		}
	};
	StartUp.settingsScreen = function() {
		MainView.showMenuButton( MainView.MENU_NEW_MAIN );
		MainView.showMenuButton( MainView.MENU_DATA );
		EngineCore.outputText( '<b>Settings toggles:</b>\n', true );
		EngineCore.outputText( 'Debug mode enabled: <b>No</b>\n	Items consumption will occur as normal.' );
		EngineCore.outputText( '\n\n' );
		if( CoC.getInstance().flags[ kFLAGS.SHOW_SPRITES_FLAG ] === 0 ) {
			EngineCore.outputText( 'Sprites enabled: <b>Yes</b>.\n	You like to look at pretty pictures.' );
		} else {
			EngineCore.outputText( 'Sprites enabled: <b>No</b>.\n	There are only words. Nothing else.' );
		}
		EngineCore.outputText( '\n\n' );
		if( CoC.getInstance().flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] ) {
			EngineCore.outputText( 'Easy Mode <b>On</b>\n	Bad-ends can be ignored and combat is easier.' );
		} else {
			EngineCore.outputText( 'Easy Mode <b>Off</b>\n	Bad-ends can ruin your game and combat is challenging.' );
		}
		EngineCore.outputText( '\n\n' );
		if( CoC.getInstance().flags[ kFLAGS.SILLY_MODE_ENABLE_FLAG ] ) {
			EngineCore.outputText( 'Silly Mode <b>On</b>\n	Crazy, nonsensical, and possibly hilarious things may occur.' );
		} else {
			EngineCore.outputText( 'Silly Mode <b>Off</b>\n	You\'re an incorrigable stick-in-the-mud with no sense of humor.' );
		}
		EngineCore.outputText( '\n\n' );
		EngineCore.outputText( '<b>The following flags are not fully implemented yet (e.g. they don\'t apply in <i>all</i> cases where they could be relevant).</b>\n' );
		EngineCore.outputText( 'Additional note: You <b>must</b> be <i>in a game session</i> (e.g. load your save, hit "Main Menu", change the flag settings, and then hit "Resume") to change these flags. They\'re saved into the saveGame file, so if you load a save, it will clear them to the state in that save.' );
		EngineCore.outputText( '\n\n' );
		if( CoC.getInstance().flags[ kFLAGS.LOW_STANDARDS_FOR_ALL ] ) {
			EngineCore.outputText( 'Low standards Mode <b>On</b>\n	NPCs ignore body type preferences.' );
			EngineCore.outputText( '\n	(Not gender preferences though. You still need the right hole.)' );
		} else {
			EngineCore.outputText( 'Low standards Mode <b>Off</b>\n	NPCs have body-type preferences.' );
		}
		EngineCore.outputText( '\n\n' );
		if( CoC.getInstance().flags[ kFLAGS.HYPER_HAPPY ] ) {
			EngineCore.outputText( 'Hyper Happy mode <b>On</b>\n	Only reducto and humus shrink endowments.' );
			EngineCore.outputText( '\n	Incubus draft doesn\'t affect breasts, and succubi milk doesn\'t affect cocks.' );
		} else {
			EngineCore.outputText( 'Hyper Happy mode <b>Off</b>\n	Male enhancement potions shrink female endowments, and vice versa.' );
		}
		EngineCore.choices( '', null,
			'Sprite Toggle', StartUp.toggleSpritesFlag,
			'EZ Mode', StartUp.toggleEasyModeFlag,
			'', null,
			'Controls', StartUp.displayControls,
			'Hyper Happy', StartUp.toggleHyperHappy,
			'Low Standards', StartUp.toggleStandards,
			'Silly Toggle', StartUp.toggleSillyFlag,
			'', null,
			'Back', StartUp.mainMenu );
	};
	StartUp.displayControls = function() {
		MainView.hideAllMenuButtons();
		InputManager.DisplayBindingPane();
		EngineCore.choices( 'Reset Ctrls', StartUp.resetControls,
			'Clear Ctrls', StartUp.clearControls,
			'Null', null,
			'Null', null,
			'Null', null,
			'Null', null,
			'Null', null,
			'Null', null,
			'Null', null,
			'Back', StartUp.hideControls );
	};
	StartUp.hideControls = function() {
		InputManager.HideBindingPane();
		StartUp.settingsScreen();
	};
	StartUp.resetControls = function() {
		InputManager.HideBindingPane();
		EngineCore.outputText( 'Are you sure you want to reset all of the currently bound controls to their defaults?', true );
		EngineCore.doYesNo( StartUp.resetControlsYes, StartUp.displayControls );
	};
	StartUp.resetControlsYes = function() {
		InputManager.ResetToDefaults();
		EngineCore.outputText( 'Controls have been reset to defaults!\n\n', true );
		EngineCore.doNext( StartUp.displayControls );
	};
	StartUp.clearControls = function() {
		InputManager.HideBindingPane();
		EngineCore.outputText( 'Are you sure you want to clear all of the currently bound controls?', true );
		EngineCore.doYesNo( StartUp.clearControlsYes, StartUp.displayControls );
	};
	StartUp.clearControlsYes = function() {
		InputManager.ClearAllBinds();
		EngineCore.outputText( 'Controls have been cleared!', true );
		EngineCore.doNext( StartUp.displayControls );
	};
	StartUp.toggleStandards = function() {
		CoC.getInstance().flags[ kFLAGS.LOW_STANDARDS_FOR_ALL ] = !CoC.getInstance().flags[ kFLAGS.LOW_STANDARDS_FOR_ALL ];
		StartUp.settingsScreen();
		return;
	};
	StartUp.toggleHyperHappy = function() {
		CoC.getInstance().flags[ kFLAGS.HYPER_HAPPY ] = !CoC.getInstance().flags[ kFLAGS.HYPER_HAPPY ];
		StartUp.settingsScreen();
		return;
	};
	StartUp.toggleEasyModeFlag = function() {
		CoC.getInstance().flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] = CoC.getInstance().flags[ kFLAGS.EASY_MODE_ENABLE_FLAG ] === 0 ? 1 : 0;
		StartUp.settingsScreen();
		MainView.showMenuButton( MainView.MENU_DATA );
		StartUp.settingsScreen();
		return;
	};
	StartUp.toggleSpritesFlag = function() {
		CoC.getInstance().flags[ kFLAGS.SHOW_SPRITES_FLAG ] = !CoC.getInstance().flags[ kFLAGS.SHOW_SPRITES_FLAG ];
		StartUp.settingsScreen();
		return;
	};
	StartUp.toggleSillyFlag = function() {
		CoC.getInstance().flags[ kFLAGS.SILLY_MODE_ENABLE_FLAG ] = !CoC.getInstance().flags[ kFLAGS.SILLY_MODE_ENABLE_FLAG ];
		StartUp.settingsScreen();
		return;
	};
	StartUp.creditsScreen = function() {
		EngineCore.outputText( '<b>Coding and Main Events:</b>\n', true );
		EngineCore.outputText( '<ul>' );
		EngineCore.outputText( '<li> Fenoxo</li>\n' );
		EngineCore.outputText( '</ul>' );
		EngineCore.outputText( '<b>Typo Reporting</b>\n' );
		EngineCore.outputText( '<ul>' );
		EngineCore.outputText( '<li> SoS</li>' );
		EngineCore.outputText( '<li> Prisoner416</li>' );
		EngineCore.outputText( '<li> Chibodee</li>' );
		EngineCore.outputText( '</ul>' );
		EngineCore.outputText( '' );
		EngineCore.outputText( '<b>Graphical Prettiness:</b>' );
		EngineCore.outputText( '<ul>' );
		EngineCore.outputText( '<li> Dasutin (Background Images)</li>' );
		EngineCore.outputText( '<li> Invader (Button Graphics, Font, and Other Hawtness)</li>' );
		EngineCore.outputText( '</ul>' );
		EngineCore.outputText( '<b>Supplementary Events:</b>' );
		EngineCore.outputText( '<ul>' );
		EngineCore.outputText( '<li> Dxasmodeus (Tentacles, Worms, Giacomo)</li>' );
		EngineCore.outputText( '<li> Kirbster (Christmas Bunny Trap)</li>' );
		EngineCore.outputText( '<li> nRage (Kami the Christmas Roo)</li>' );
		EngineCore.outputText( '<li> Abraxas (Alternate Naga Scenes w/Various Monsters, Tamani Anal, Female Shouldra Tongue Licking, Chameleon Girl, Christmas Harpy)</li>' );
		EngineCore.outputText( '<li> Astronomy (Fetish Cultist Centaur Footjob Scene)</li>' );
		EngineCore.outputText( '<li> Adjatha (Scylla the Cum Addicted Nun, Vala, Goo-girls, Bimbo Sophie Eggs, Ceraph Urta Roleplay, Gnoll with Balls Scene, Kiha futa scene, Goblin Web Fuck Scene, and 69 Bunny Scene)</li>' );
		EngineCore.outputText( '<li> ComfyCushion (Muff Wrangler)</li>' );
		EngineCore.outputText( '<li> B (Brooke)</li>' );
		EngineCore.outputText( '<li> Quiet Browser (Half of Niamh, Ember, Amily The Mouse-girl Breeder, Katherine, Part of Katherine Employment Expansion, Urta\'s in-bar Dialogue Trees, some of Izma, Loppe)</li>' );
		EngineCore.outputText( '<li> Indirect (Alternate Non-Scylla Katherine Recruitment, Part of Katherine Employment Expansion, Phouka, Coding of Bee Girl Expansion)</li>' );
		EngineCore.outputText( '<li> Schpadoinkle (Victoria Sex)</li>' );
		EngineCore.outputText( '<li> Donto (Ro\'gar the Orc, Polar Pete)</li>' );
		EngineCore.outputText( '<li> Angel (Additional Amily Scenes)</li>' );
		EngineCore.outputText( '<li> Firedragon (Additional Amily Scenes)</li>' );
		EngineCore.outputText( '<li> Danaume (Jojo masturbation texts)</li>' );
		EngineCore.outputText( '<li> LimitLax (Sand-Witch Bad-End)</li>' );
		EngineCore.outputText( '<li> KLN (Equinum Bad-End)</li>' );
		EngineCore.outputText( '<li> TheDarkTemplar11111 (Canine Pepper Bad End)</li>' );
		EngineCore.outputText( '<li> Silmarion (Canine Pepper Bad End)</li>' );
		EngineCore.outputText( '<li> Soretu (Original Minotaur Rape)</li>' );
		EngineCore.outputText( '<li> NinjArt (Small Male on Goblin Rape Variant)</li>' );
		EngineCore.outputText( '<li> DoubleRedd ("Too Big" Corrupt Goblin Fuck)</li>' );
		EngineCore.outputText( '<li> Nightshade (Additional Minotaur Rape)</li>' );
		EngineCore.outputText( '<li> JCM (Imp Night Gangbang, Addition Minotaur Loss Rape - Oral)</li>' );
		EngineCore.outputText( '<li> Xodin (Nipplefucking paragraph of Imp GangBang, Encumbered by Big Genitals Exploration Scene, Big Bits Run Encumbrance, Player Getting Beer Tits, Sand Witch Dungeon Misc Scenes)</li>' );
		EngineCore.outputText( '<li> Blusox6 (Original Queen Bee Rape)</li>' );
		EngineCore.outputText( '<li> Thrext (Additional Masturbation Code, Faerie, Ivory Succubus)</li>' );
		EngineCore.outputText( '<li> XDumort (Genderless Anal Masturbation)</li>' );
		EngineCore.outputText( '<li> Uldego (Slime Monster)</li>' );
		EngineCore.outputText( '<li> Noogai, Reaper, and Numbers (Nipple-Fucking Victory vs Imp Rape)</li>' );
		EngineCore.outputText( '<li> Verse and IAMurow (Bee-Girl MultiCock Rapes)</li>' );
		EngineCore.outputText( '<li> Sombrero (Additional Imp Lust Loss Scene (Dick insertion ahoy!)</li>' );
		EngineCore.outputText( '<li> The Dark Master (Marble, Fetish Cultist, Fetish Zealot, Hellhound, Lumi, Some Cat Transformations, LaBova, Ceraph\'s Cat-Slaves, a Cum Witch Scene, Mouse Dreams, Forced Nursing:Imps&Goblins, Bee Girl Expansion)</li>' );
		EngineCore.outputText( '<li> Mr. Fleshcage (Cat Transformation/Masturbation)</li>' );
		EngineCore.outputText( '<li> Spy (Cat Masturbation, Forced Nursing: Minotaur, Bee, & Cultist)</li>' );
		EngineCore.outputText( '<li> PostNuclearMan (Some Cat TF)</li>' );
		EngineCore.outputText( '<li> MiscChaos (Forced Nursing: Slime Monster)</li>' );
		EngineCore.outputText( '<li> Ourakun (Kelt the Centaur)</li>' );
		EngineCore.outputText( '<li> Rika_star25 (Desert Tribe Bad End)</li>' );
		EngineCore.outputText( '<li> Versesai (Additional Bee Rape)</li>' );
		EngineCore.outputText( '<li> Mallowman (Additional Bee Rape)</li>' );
		EngineCore.outputText( '<li> HypnoKitten (Additional Centaur x Imp Rape)</li>' );
		EngineCore.outputText( '<li> Ari (Minotaur Gloryhole Scene)</li>' );
		EngineCore.outputText( '<li> SpectralTime (Aunt Nancy)</li>' );
		EngineCore.outputText( '<li> Foxxling (Akbal)</li>' );
		EngineCore.outputText( '<li> Elfensyne (Phylla)</li>' );
		EngineCore.outputText( '<li> Radar (Dominating Sand Witches, Some Phylla)</li>' );
		EngineCore.outputText( '<li> Jokester (Sharkgirls, Izma, & Additional Amily Scenes)</li>' );
		EngineCore.outputText( '<li> Lukadoc (Additional Izma, Ceraph Followers Corrupting Gangbang, Satyrs, Ember)</li>' );
		EngineCore.outputText( '<li> IxFa (Dildo Scene, Virgin Scene for Deluxe Dildo, Naga Tail Masturbation)</li>' );
		EngineCore.outputText( '<li> Bob (Additional Izma)</li>' );
		EngineCore.outputText( '<li> lh84 (Various Typos and Code-Suggestions)</li>' );
		EngineCore.outputText( '<li> Dextersinister (Gnoll girl in the plains)</li>' );
		EngineCore.outputText( '<li> ElAcechador, Bandichar, TheParanoidOne, Xoeleox (All Things Naga)</li>' );
		EngineCore.outputText( '<li> Symphonie (Dominika the Fellatrix, Ceraph RPing as Dominika, Tel\'Adre Library)</li>' );
		EngineCore.outputText( '<li> Soulsemmer (Ifris)</li>' );
		EngineCore.outputText( '<li> WedgeSkyrocket (Zetsuko, Pure Amily Anal, Kitsunes)</li>' );
		EngineCore.outputText( '<li> Zeikfried (Anemone, Male Milker Bad End, Kanga TF, Raccoon TF, Minotaur Chef Dialogues, Sheila, and More)</li>' );
		EngineCore.outputText( '<li> User21 (Additional Centaur/Naga Scenes)</li>' );
		EngineCore.outputText( '<li> ~M~ (Bimbo + Imp loss scene)</li>' );
		EngineCore.outputText( '<li> Grype (Raping Hellhounds)</li>' );
		EngineCore.outputText( '<li> B-Side (Fentendo Entertainment Center Silly-Mode Scene)</li>' );
		EngineCore.outputText( '<li> Not Important (Face-fucking a defeated minotaur)</li>' );
		EngineCore.outputText( '<li> Third (Cotton, Rubi, Nieve, Urta Pet-play)</li>' );
		EngineCore.outputText( '<li> Gurumash (Parts of Nieve)</li>' );
		EngineCore.outputText( '<li> Kinathis (A Nieve Scene, Sophie Daughter Incest, Minerva)</li>' );
		EngineCore.outputText( '<li> Jibajabroar (Jasun)</li>' );
		EngineCore.outputText( '<li> Merauder (Raphael)</li>' );
		EngineCore.outputText( '<li> EdgeofReality (Gym fucking machine)</li>' );
		EngineCore.outputText( '<li> Bronycray (Heckel the Hyena)</li>' );
		EngineCore.outputText( '<li> Sablegryphon (Gnoll spear-thrower)</li>' );
		EngineCore.outputText( '<li> Nonesuch (Basilisk, Sandtraps, assisted with Owca/Vapula, Whitney Farm Corruption)</li>' );
		EngineCore.outputText( '<li> Anonymous Individual (Lilium, PC Birthing Driders)</li>' );
		EngineCore.outputText( '<li> PKD (Owca, Vapula, Fap Arena, Isabella Tentacle Sex, Lottie Tentacle Sex)</li>' );
		EngineCore.outputText( '<li> Shamblesworth (Half of Niamh, Shouldra the Ghost-Girl, Ceraph Roleplaying As Marble, Yara Sex, Shouldra Follow Expansion)</li>' );
		EngineCore.outputText( '<li> Kirbu (Exgartuan Expansion, Yara Sex, Shambles\'s Handler, Shouldra Follow Expansion)</li>' );
		EngineCore.outputText( '<li> 05095 (Shouldra Expansion, Tons of Editing)</li>' );
		EngineCore.outputText( '<li> Smidgeums (Shouldra + Vala threesome)</li>' );
		EngineCore.outputText( '<li> FC (Generic Shouldra talk scene)</li>' );
		EngineCore.outputText( '<li> Oak (Bro + Bimbo TF, Isabella\'s ProBova Burps)</li>' );
		EngineCore.outputText( '<li> Space (Victory Anal Sex vs Kiha)</li>' );
		EngineCore.outputText( '<li> Venithil (LippleLock w/Scylla & Additional Urta Scenes)</li>' );
		EngineCore.outputText( '<li> Butts McGee (Minotaur Hot-dogging PC loss, Tamani Lesbo Face-ride, Bimbo Sophie Mean/Nice Fucks)</li>' );
		EngineCore.outputText( '<li> Savin (Hel the Salamander, Valeria, Spanking Drunk Urta, Tower of the Phoenix, Drider Anal Victory, Hel x Isabella 3Some, Centaur Sextoys, Thanksgiving Turkey, Uncorrupt Latexy Recruitment, Assert Path for Direct Feeding Latexy, Sanura the Sphinx)</li>' );
		EngineCore.outputText( '<li> Gats (Lottie, Spirit & Soldier Xmas Event, Kiha forced masturbation, Goblin Doggystyle, Chicken Harpy Egg Vendor)</li>' );
		EngineCore.outputText( '<li> Aeron the Demoness (Generic Goblin Anal, Disciplining the Eldest Minotaur)</li>' );
		EngineCore.outputText( '<li> Gats, Shamblesworth, Symphonie, and Fenoxo (Corrupted Drider)</li>' );
		EngineCore.outputText( '<li> Bagpuss (Female Thanksgiving Event, Harpy Scissoring, Drider Bondage Fuck)</li>' );
		EngineCore.outputText( '<li> Frogapus (The Wild Hunt)</li>' );
		EngineCore.outputText( '<li> Fenoxo (Everything Else)</li>' );
		EngineCore.outputText( '</ul>' );
		EngineCore.outputText( '<b>Oviposition Update Credits - Names in Order Appearance in Oviposition Document</b>' );
		EngineCore.outputText( '<ul>' );
		EngineCore.outputText( '<li> DCR (Idea, Drider Transformation, and Drider Impreg of: Goblins, Beegirls, Nagas, Harpies, and Basilisks)</li>' );
		EngineCore.outputText( '<li> Fenoxo (Bee Ovipositor Transformation, Bee Oviposition of Nagas and Jojo, Drider Oviposition of Tamani)</li>' );
		EngineCore.outputText( '<li> Smokescreen (Bee Oviposition of Basilisks)</li>' );
		EngineCore.outputText( '<li> Radar (Oviposition of Sand Witches)</li>' );
		EngineCore.outputText( '<li> OutlawVee (Bee Oviposition of Goo-Girls)</li>' );
		EngineCore.outputText( '<li> Zeikfried (Editing this mess, Oviposition of Anemones)</li>' );
		EngineCore.outputText( '<li> Woodrobin (Oviposition of Minotaurs)</li>' );
		EngineCore.outputText( '<li> Posthuman (Oviposition of Ceraph Follower)</li>' );
		EngineCore.outputText( '<li> Slywyn (Bee Oviposition of Gigantic PC Dick)</li>' );
		EngineCore.outputText( '<li> Shaxarok (Drider Oviposition of Large Breasted Nipplecunts)</li>' );
		EngineCore.outputText( '<li> Quiet Browser (Bee Oviposition of Urta)</li>' );
		EngineCore.outputText( '<li> Bagpuss (Laying Eggs In Pure Amily)</li>' );
		EngineCore.outputText( '<li> Eliria (Bee Laying Eggs in Bunny-Girls)</li>' );
		EngineCore.outputText( '<li> Gardeford (Helia x Bimbo Sophie Threesomes)</li>' );
		EngineCore.outputText( '</ul>' );
		EngineCore.outputText( '\nIf I\'m missing anyone, please contact me ASAP!  I have done a terrible job keeping the credits up to date!' );
		EngineCore.doNext( StartUp.mainMenu );
	};
	StartUp.imageCreditsScreen = function() {
		if( ImageManager.getLoadedImageCount() > 0 ) {
			EngineCore.outputText('**Bundled Image Credits:**<br><br>' + 

				'**Yoh-SL**<br><br>' + 

				'* Bee-Girl Monster Image<br>' + 
				'* Goo-Girl Monster Image<br>' + 
				'* Ceraph Monster Image<br>' + 
				'* Sand-Witch (and sandwich)<br>', true, true);
		} else {
			EngineCore.outputText( '<b>No Image-Pack Found!</b>\n', true );
		}
		EngineCore.doNext( StartUp.mainMenu );
	};
	StartUp.howToPlay = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( '<b><u>How To Play:</u></b>\nClick the buttons corresponding to the actions you want to take.  Your \'goal\' is to obviously put an end to the demonic corruption around you, but do whatever the hell you want.  There is a story but sometimes it\'s fun to ignore it.\n\n', false );
		EngineCore.outputText( '<b>Exploration:</b>\nThe lake is a safe zone when you start the game.  It\'s a good place to explore, and Whitney\'s farm can offer some nice stat boosts to help get you on your feet. Once you feel comfortable, the forest is probably the next safest area, but beware of tentacle monsters.  The desert is the next toughest area, and the mountains offer further challenges.  There are more areas beyond that, but that\'s a good way to get started.  You\'ll uncover plenty of new \'places\' exploring, which can be accessed from the <b>Places</b> menu.  You\'ll also find some interesting characters when you try to discover new explorable locations by choosing <b>Explore</b> twice.\n\n', false );
		EngineCore.outputText( '<b>Combat:</b>\nCombat is won by raising an opponent\'s lust to 100 or taking their HP to 0.  You lose if your enemy does the same to you.  Loss isn\'t game over, but some losses will make it harder in the future by lowering your stats.  Beware.  Don\'t be afraid to spam the <b>Run</b> option when you\'re in over your head.\n\n', false );
		EngineCore.outputText( '<b>Controls:</b>\nThe game features numerous hot-keys to make playing quicker and easier.\nP key - Perks Menu\nD key - Data Menu\nA key - Appearance Screen\n1 Through 5 - The top row of \'choice\' buttons.\n6 Through 0 - The bottom row of \'choice\' buttons.\nQ through T - Alternative bottom \'choice\' hotkeys.\nSpace Bar - Next/Back/Leave\nHome Key - Toggle text field background.\nS key - Stats Screen\n(Save Hotkeys - May not work in all players)\nF1-F5 - Quicksave to slot 1 through 5.  Only works when Data is visible.\nF6-F0 - Quick Load from slots 1-5.\n\n', false );
		EngineCore.outputText( '<b>Save often using the Data Menu</b> - you never know when your journey will come to an end!', false );
		EngineCore.doNext( StartUp.mainMenu );
	};
	return StartUp;
});