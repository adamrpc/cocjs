﻿'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, MainView, $log, Utils, ItemType, kFLAGS, CoC, EngineCore, ConsumableLib ) {
	function Lumi() {
	}

	Lumi.prototype.lumiEncounter = function() {
		MainView.outputText( '', true );
		//1st time lumi meeting;
		if( CoC.flags[ kFLAGS.LUMI_MET ] === 0 ) {
			//placeholder text for outside the cathedral;
			MainView.outputText( 'You spot an anomaly in the barren wastes; a door that seems to be standing out in the middle of nowhere. Somehow, you figure that it must lead to some other part of the world, and the only reason it\'s here is because you can\'t get to where the door should be right now.\n\n', false );
			MainView.outputText( 'Do you open it?', false );
			EngineCore.doYesNo( this, this.lumiLabChoices, SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		} else {
			//placeholder text for outside the cathedral;
			MainView.outputText( 'You spot the door standing in the middle of nowhere again, and you guess that it will lead you back to Lumi\'s laboratory.  It swings open easily...', false );
			EngineCore.doNext( this, this.lumiLabChoices );
		}
		//end of placeholder text;
	};
	Lumi.prototype.lumiLabChoices = function() {
		MainView.spriteSelect( 37 );
		MainView.outputText( '', true );
		//First time meeting;
		if( CoC.flags[ kFLAGS.LUMI_MET ] === 0 ) {
			//Set Lumi met flag ;
			CoC.flags[ kFLAGS.LUMI_MET ]++;
			MainView.outputText( 'You open the door and carefully check inside for any enemies that may be trying to ambush you. The room seems to be some kind of alchemical lab, with shelves full of apparatuses all along the walls, a desk on one side of the room, and a long table across the room from you that is full of alchemical experiments in progress, many give off lots of smoke, and others are bottles of bubbling fluids.  A goblin wearing an apron and some kind of headband is sitting on a tall, wheeled stool; she is otherwise nude and seems to be watching at least 3 experiments right now. She suddenly turns around and looks straight in your direction.  It\'s hard to tell thanks to the dark goggles that hide her eyes from view, but you\'re fairly certain she\'s watching you.  After a few seconds she yells "<i>Cuths-tohmer!</i>" in a thick lisp. She looks harmless enough, so you step inside while she fiddles with her experiments, reducing the bubbling smoke.  She jumps down from her stool, tears off her apron, bounds over to the desk, and scrambles on top of it.\n\n', false );
			MainView.outputText( 'She\'s about 3 feet tall, with yellow-green skin, and wears her orange hair in a long ponytail that reaches to her knees.  Her breasts are about B cup, with average nipples that have been colored orange. All of her nails have been painted orange to match. She doesn\'t seem to ever stop moving, and while the majority of her face looks cute, it\'s a little hard to be sure while she\'s wearing those thick goggles.  The solid black lenses of her goggles make her look quite unsettling, stifling any appeal her form could inspire in you.\n\n', false );
			MainView.outputText( '"<i>Stho, what can Lumi, Gobin Aochomist Extwaordinaire, do fo you today?</i>" asks the unusual goblin.\n\n', false );
			MainView.outputText( 'You explain that it\'s a little hard to understand her.  She sticks her tongue out at you, showing a VERY large stud in the middle of it, instantly explaining her lisp.  Rather than pushing the point, you ask her what she can do for you.  She pulls open a hatch on the top of the desk and pulls out a bottle of something and shakes it, "<i>Lumi can sell you some of her finely cwafted poetions fo a good pwice, ore, if you\'ve alweady got some nice poetions or reagents, Lumi can make them even bettar. But tha cost a whole lot. If you were one of dee Followers, den maybe Lumi could make a special deal wit you; but the boss don\'t want me playin wit outsiders. Wat will it be?</i>"\n\n', false );
		}
		//Repeat Meetings;
		else {
			MainView.outputText( 'Once more, you step into Lumi\'s lab.  She\'s still working on her experiments. Before you even have a chance to call out to her, she has already pivoted to watch you.  In a flash her apron hits the floor and she is standing on her desk, asking, "<i>Stho, what can Lumi the Aochomist Extwaordinaire do fo you today?</i>"', false );
		}
		var enhance = null;
		if( this.lumiEnhance( true ) ) {
			enhance = this.lumiEnhance;
		}
		EngineCore.choices( 'Shop', this, this.lumiShop, 'Enhance', this, enhance, '', null, null, '', null, null, 'Leave', SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	Lumi.prototype.lumiShop = function() {
		MainView.spriteSelect( 37 );
		//Set item handling to lumi shop;
		MainView.clearOutput();
		MainView.outputText( 'You ask Lumi if you can see her potions.  She smiles at you and pulls out several bottles from her desk and shows them to you.\n\n"<i>Gawantied qwality, made by Lumi herself,</i>" she says proudly.\n\n', false );
		MainView.outputText( 'Lust Draft - 15 gems\nGoblin Ale - 20 gems\nOviposition Elixir - 45 gems\n', false );
		//The player is given a list of choices, clicking on one gives the description and the price, like Giacomo.;
		EngineCore.choices( ConsumableLib.L_DRAFT.shortName, this, this.lumiLustDraftPitch,
			ConsumableLib.GOB_ALE.shortName, this, this.lumiPitchGobboAle,
			ConsumableLib.OVIELIX.shortName, this, this.lumiPitchOviElixer,
			'', null, null, 'Leave', this, this.lumiLabChoices );
	};
	//Lust Draft;
	Lumi.prototype.lumiLustDraftPitch = function() {
		MainView.spriteSelect( 37 );
		MainView.clearOutput();
		MainView.outputText( 'You point at the bottle filled with bubble-gum pink fluid.\n\n"<i>De lust dwaft? Always a favowite, with it you nevar have to worwy about not bein weady for sexy time; one of my fiwst creations. 15 gems each.</i>"\n\n', false );
		MainView.outputText( 'Will you buy the lust draft?', false );
		EngineCore.doYesNo( this, Utils.curry( this, this.lumiPurchase, ConsumableLib.L_DRAFT ), this, this.lumiShop );
	};
	//Goblin Ale;
	Lumi.prototype.lumiPitchGobboAle = function() {
		MainView.spriteSelect( 37 );
		MainView.clearOutput();
		MainView.outputText( 'You point at the flagon. "<i>Oh? Oh thats Lumi\'s... actually no, dat tispsy stuff for 20 gems. You\'ll like if you want to be like Lumi. Do you like it?</i>"\n\n', false );
		MainView.outputText( 'Will you buy the goblin ale?', false );
		EngineCore.doYesNo( this, Utils.curry( this, this.lumiPurchase, ConsumableLib.GOB_ALE ), this, this.lumiShop );
	};
	//Ovi Elixir;
	Lumi.prototype.lumiPitchOviElixer = function() {
		MainView.spriteSelect( 37 );
		MainView.clearOutput();
		MainView.outputText( 'You point at the curious hexagonal bottle. "<i>De Oviposar Elixir? Made baithsed on da giant bee\'s special stuff dey give deir queen. It will help make de burfing go faster, an if you dwink it while you awen pweggy, iw will give you some eggs to burf later. More dwinks, eqwals more and biggar eggs. Lumi charges 45 gems for each dose.</i>"\n\n', false );
		MainView.outputText( 'Will you buy the Ovi Elixir?', false );
		EngineCore.doYesNo( this, Utils.curry( this, this.lumiPurchase, ConsumableLib.OVIELIX ), this, this.lumiShop );
	};

	Lumi.prototype.lumiPurchase = function( itype ) {
		MainView.spriteSelect( 37 );
		MainView.clearOutput();
		//After choosing, and PC has enough gems;
		var cost = 0;
		if( itype === ConsumableLib.OVIELIX ) {
			cost = 45;
		}
		if( itype === ConsumableLib.GOB_ALE ) {
			cost = 20;
		}
		if( itype === ConsumableLib.L_DRAFT ) {
			cost = 15;
		}
		if( CoC.player.gems >= cost ) {
			MainView.outputText( 'You pay Lumi the gems, and she hands you ' + itype.longName + ' saying, "<i>Here ya go!</i>"\n\n', false );
			CoC.player.gems -= cost;
			MainView.statsView.show();
			SceneLib.inventory.takeItem( itype, this.lumiShop, this.lumiLabChoices );
		} else {
			//After choosing, and PC doesn't have enough gems;
			MainView.outputText( 'You go to pay Lumi the gems, but then you realize that you don\'t have enough. Lumi seems to know what happened and tells you "<i>Ok, is dere somefing you want to buy that you can affowd?</i>"\n\n', false );
			//Return to main Lumi menu;
			EngineCore.doNext( this, this.lumiShop );
		}
	};
	Lumi.prototype.lumiEnhance = function( justCheck ) {
		MainView.spriteSelect( 37 );
		var fox = null;
		if( CoC.player.hasItem( ConsumableLib.FOXBERY ) ) {
			fox = this.lumiEnhanceFox;
		}
		var laBova = null;
		if( CoC.player.hasItem( ConsumableLib.LABOVA_ ) ) {
			laBova = this.lumiEnhanceLaBova;
		}
		var succuDelight = null;
		if( CoC.player.hasItem( ConsumableLib.SDELITE ) ) {
			succuDelight = this.lumiEnhanceSDelight;
		}
		var oviElix = null;
		//if(CoC.player.hasItem(ConsumableLib.OVIELIX));
		//	oviElix = this.lumiEnhanceOviElix;;
		var lustDraft = null;
		if( CoC.player.hasItem( ConsumableLib.L_DRAFT ) ) {
			lustDraft = this.lumiEnhanceDraft;
		}
		var seed = null;
		if( CoC.player.hasItem( ConsumableLib.GLDSEED ) ) {
			seed = this.lumiEnhanceGoldenSeed;
		}
		var kanga = null;
		if( CoC.player.hasItem( ConsumableLib.KANGAFT ) ) {
			kanga = this.lumiEnhanceKanga;
		}
		var kitsune = null;
		if( CoC.player.hasItem( ConsumableLib.FOXJEWL ) ) {
			kitsune = this.lumiEnhanceFoxJewel;
		}
		if( justCheck ) {
			return fox !== null || kanga !== null || seed !== null || laBova !== null || succuDelight !== null || oviElix !== null || lustDraft !== null || kitsune !== null;
		}
		MainView.outputText( '', true );
		MainView.outputText( '"<i>Do you have 100 gems for de enhancement?</i>" asks Lumi.\n\n', false );
		//If (CoC.player has less than 100 gems);
		if( CoC.player.gems < 100 ) {
			MainView.outputText( 'You shake your head no, and Lumi gives you a disappointed look and says, "<i>Den Lumi can do no enhancement for you. Anyfing else?</i>"\n\n', false );
			//Return to main Lumi menu;
			EngineCore.doNext( this, this.lumiLabChoices );
			return false;
		} else {
			MainView.outputText( 'You nod and Lumi gives an excited yell, "<i>Yay! Lumi loves to do enhancement, what you want to be bettar?</i>"\n\n', false );
			//The player chooses an item that can be enhanced from a list, regardless of which is chosen, the text for the next part is the same.;
			EngineCore.choices( ConsumableLib.FOXBERY.shortName, this, fox,
				ConsumableLib.FOXJEWL.shortName, this, kitsune,
				ConsumableLib.GLDSEED.shortName, this, seed,
				ConsumableLib.KANGAFT.shortName, this, kanga,
				ConsumableLib.L_DRAFT.shortName, this, lustDraft,
				ConsumableLib.LABOVA_.shortName, this, laBova,
				ConsumableLib.OVIELIX.shortName, this, oviElix,
				ConsumableLib.SDELITE.shortName, this, succuDelight,
				'', null, null, 'Back', this, this.lumiLabChoices );
			return true;
		}
	};
	Lumi.prototype.lumiEnhanceLaBova = function() {
		this.lumiEnhanceGo( ConsumableLib.LABOVA_ );
	};
	Lumi.prototype.lumiEnhanceSDelight = function() {
		this.lumiEnhanceGo( ConsumableLib.SDELITE );
	};
	Lumi.prototype.lumiEnhanceOviElix = function() {
		this.lumiEnhanceGo( ConsumableLib.OVIELIX );
	};
	Lumi.prototype.lumiEnhanceDraft = function() {
		this.lumiEnhanceGo( ConsumableLib.L_DRAFT );
	};
	Lumi.prototype.lumiEnhanceGoldenSeed = function() {
		this.lumiEnhanceGo( ConsumableLib.GLDSEED );
	};
	Lumi.prototype.lumiEnhanceKanga = function() {
		this.lumiEnhanceGo( ConsumableLib.KANGAFT );
	};
	Lumi.prototype.lumiEnhanceFox = function() {
		this.lumiEnhanceGo( ConsumableLib.FOXBERY );
	};
	Lumi.prototype.lumiEnhanceFoxJewel = function() {
		this.lumiEnhanceGo( ConsumableLib.FOXJEWL );
	};
	Lumi.prototype.lumiEnhanceGo = function( itype ) {
		MainView.spriteSelect( 37 );
		$log.debug( 'LUMI ENHANCE' );
		var nextItem = ItemType.NOTHING;
		if( itype === ConsumableLib.LABOVA_ ) {
			nextItem = ConsumableLib.PROBOVA;
		} else if( itype === ConsumableLib.KANGAFT ) {
			nextItem = ConsumableLib.MGHTYVG;
		} else if( itype === ConsumableLib.SDELITE ) {
			nextItem = ConsumableLib.S_DREAM;
		}
		/*else if(itype === ConsumableLib.OVIELIX) {
		 nextItem = ConsumableLib.OVIMAX_;
		 } */
		else if( itype === ConsumableLib.L_DRAFT ) {
			nextItem = ConsumableLib.F_DRAFT;
		} else if( itype === ConsumableLib.GLDSEED ) {
			nextItem = ConsumableLib.MAGSEED;
		} else if( itype === ConsumableLib.FOXBERY ) {
			nextItem = ConsumableLib.VIXVIGR;
		} else if( itype === ConsumableLib.FOXJEWL ) {
			nextItem = ConsumableLib.MYSTJWL;
		}
		CoC.player.gems -= 100;
		MainView.statsView.show();
		CoC.player.consumeItem( itype );
		MainView.outputText( '', true );
		MainView.outputText( 'Lumi grabs the item from you and runs over to her table, stopping for only a second to put her apron on.  ', false );
		//start list of possible enhancement texts;
		var temp = Utils.rand( 3 );
		if( itype === ConsumableLib.GLDSEED ) {
			MainView.outputText( 'She fiddles with it, coating it in exotic powders before she tosses the whole mess onto a hotplate.  It explodes, knocking the goblin flat on her ass.  She sits bolt upright and snatches up the now-glowing seed with a gloved hand.\n\n', false );
		} else if( itype === ConsumableLib.FOXJEWL ) {
			MainView.outputText( 'Lumi stares wide-eyed into the fathoms of its depths.  She remains like that for several moments before you clear your throat, and then hurries off to work.  Flitting back and forth between the various beakers and test tubes that litter the workshop, she mixes chemicals seemingly at random, many of which bubble or explode rather violently.\n\nAfter several minutes of this, she pours all of the reagents into a large beaker over an open flame.  The contents boil up through the neck of the flask and drip slowly down the condenser.  A ponderously large drop of black liquid builds up at the tip of the condenser, wobbling precipitously for a moment before finally falling onto the jewel with a splash.\n\nThe jewel soaks up the black fluid like a sponge, veins of sickening purple spreading across the surface like a spider\'s web.  A few moments later, the jewel is entirely purple, the mystic flames inside glowing a bright violet.\n\nYou reach out hesitantly and place the mystically enhanced teardrop-shaped jewel into your pouch.\n\n' );
		} else if( itype === ConsumableLib.KANGAFT ) {
			MainView.outputText( 'She fiddles with it, coating it in exotic powders before she tosses the whole mess onto a hotplate.  It explodes, knocking the goblin flat on her ass.  She sits bolt upright and snatches up the now-glowing fruit with a gloved hand.\n\n', false );
		} else if( temp === 0 ) {
			MainView.outputText( 'She starts grabbing things from around the table, seemingly at random, and adds them to ' + itype.longName + '.  To your alarm, there is soon a large cloud of smoke coming off it! There is a strong smell to the smoke and it makes it hard to breathe.  Lumi grabs a mask out of a drawer and puts it on, continuing with her work unperturbed.  She suddenly stops and you wonder if she is done, but she takes off her mask and inhales deeply of the smoke, then keels over!  As you go over to help her she suddenly stands up, waves away some of the smoke, and says, "<i>All dun!</i>"\n\n', false );
		} else if( temp === 1 ) {
			MainView.outputText( 'Taking hold of one of the bottles that were sitting where she put the tray, she seems to think for a moment before tossing the bottle into one of the corners of the room.  It shatters just behind the table, and a small puff of smoke goes up into the air.  You\'re a little nervous about that bottle, but before you have a chance to say anything, two more bottles fly off and join it; this time causing a small explosion. You ask her what she is thinking tossing those aside, and she simply responds, "<i>Dey were in my way.</i>"\n\n"<i>What?!  So you just toss things that explode to the side?</i>"\n\n<i>"Don worry, I\'ll put counter agents in dere at de end of de day.  An I never throw stuff da\'ll do any damage.  Done!</i>"\n\n', false );
		} else if( temp === 2 ) {
			MainView.outputText( 'She adds a few things to the tray before moving down the table.  She adds some reagents to a bubbling chemical reaction, and then adds some more ingredients to that.  You wonder why she just left ' + itype.longName + ' there to work on something else.  Then Lumi moves back across the table, past where ' + itype.longName + ' sits, to start adding things to something else.  Before you have a chance to complain, she moves back to ' + itype.longName + ' and continues.  You decide that it\'s probably best not to ask about her work ethic and just let her do her thing; she has more experience than you, after all.\n\nPOP! You look over in surprise as the first thing she worked on makes a small explosion.  POW! Now the second experiment has blown up!  You start to move in alarm, wondering if Lumi really knows what she\'s doing; just before ' + itype.longName + ' seems to explode with an incredible BOOM.  Lumi stops moving for a moment, looking straight ahead before saying, "<i>Dat was a gud one, Lumi dun!</i>"\n\n', false );
		}
		SceneLib.inventory.takeItem( nextItem, this.lumiEnhance, this.lumiLabChoices );
	};
	SceneLib.registerScene( 'lumi', new Lumi() );
} );