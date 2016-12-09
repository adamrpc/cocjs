'use strict';

angular.module( 'cocjs' ).run( function( MainView, SceneLib, $rootScope, UseableLib, $log, PerkLib, Appearance, AppearanceDefs, ArmorLib, CoC, kFLAGS, Utils, StatusAffects, EngineCore, ConsumableLib ) {
	//const RATHAZUL_DEBIMBO_OFFERED:int = 744;;
	//Rathazul the Alchemist;
	//Encounter, random text for potential uses, EngineCore.choices.;
	//After he has crafted 3 things for the player, option to move into camp.;
	function Rathazul() {
		$rootScope.$on( 'time-change', this.timeChange );
		$rootScope.$on( 'time-change-large', this.timeChangeLarge );
	}

	//Implementation of TimeAwareInterface;
	Rathazul.prototype.timeChange = function() {
		if( CoC.flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ] > 1 ) {
			CoC.flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ]--;
			if( CoC.flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ] < 1 ) {
				CoC.flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ] = 1;
			}
			if( CoC.flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ] > 300 ) {
				CoC.flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ] = 24;
			}
		}
		if( CoC.flags[ kFLAGS.RATHAZUL_CAMP_INTERACTION_COUNTDOWN ] > 0 ) {
			CoC.flags[ kFLAGS.RATHAZUL_CAMP_INTERACTION_COUNTDOWN ]--;
			if( CoC.flags[ kFLAGS.RATHAZUL_CAMP_INTERACTION_COUNTDOWN ] < 0 ) {
				CoC.flags[ kFLAGS.RATHAZUL_CAMP_INTERACTION_COUNTDOWN ] = 0;
			}
		}
		return false;
	};
	Rathazul.prototype.timeChangeLarge = function() {
		return false;
	};
	//End of Interface Implementation;
	Rathazul.prototype.returnToRathazulMenu = function() {
		if( CoC.player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 ) {
			this.campRathazul();
		} else {
			this.encounterRathazul();
		}
	};
	Rathazul.prototype.encounterRathazul = function() {
		EngineCore.spriteSelect( 49 );
		if( CoC.flags[ kFLAGS.MARBLE_PURIFICATION_STAGE ] === 2 && CoC.player.findStatusAffect( StatusAffects.MetRathazul ) >= 0 ) {
			SceneLib.marblePurification.visitRathazulToPurifyMarbleAfterLaBovaStopsWorkin();
			return;
		}
		var offered;
		//Rat is definitely not sexy!;
		if( CoC.player.lust > 30 ) {
			EngineCore.dynStats( 'lus', -10 );
		}
		//Introduction;
		if( CoC.player.findStatusAffect( StatusAffects.MetRathazul ) >= 0 ) {
			if( CoC.player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 ) {
				EngineCore.outputText( 'You walk over to Rathazul\'s corner of the camp.  He seems as busy as usual, with his nose buried deep in some tome or alchemical creation, but he turns to face you as soon as you walk within a few paces of him.\n\n', true );
			} else {
				EngineCore.outputText( 'You spy the familiar sight of the alchemist Rathazul\'s camp along the lake.  The elderly rat seems to be oblivious to your presence as he scurries between his equipment, but you know him well enough to bet that he is entirely aware of your presence.\n\n', true );
			}
		} else {
			EngineCore.outputText( 'You encounter a hunched figure working as you come around a large bush.  Clothed in tattered robes that obscure most his figure, you can nontheless see a rat-like muzzle protruding from the shadowy hood that conceals most of his form.  A simple glance behind him confirms your suspicions - this is some kind of rat-person.  He seems oblivious to your presence as he stirs a cauldron of viscous fluid with one hand; a neat stack of beakers and phials sit in the dirt to his left.  You see a smile break across his aged visage, and he says, "<i>Come closer child.  I will not bite.</i>"\n\nApprehensive of the dangers of this unknown land, you cautiously approach.\n\n"<i>I am Rathazul the Alchemist.  Once I was famed for my miracle cures.  Now I idle by this lake, helpless to do anything but measure the increasing amounts of corruption that taint its waters,</i>" he says as he pulls back his hood, revealing the entirety of his very bald and wrinkled head.\n\n', true );
			CoC.player.createStatusAffect( StatusAffects.MetRathazul, 0, 0, 0, 0 );
		}
		//Camp offer!;
		if( CoC.player.statusAffectv2( StatusAffects.MetRathazul ) >= 3 && CoC.player.statusAffectv3( StatusAffects.MetRathazul ) !== 1 && CoC.player.cor < 75 ) {
			EngineCore.outputText( '"<i>You know, I think I might be able to do this worn-out world a lot more good from your camp than by wandering around this lake.  What do you say?</i>" asks the rat.\n\n(Move Rathazul into your camp?)', false );
			EngineCore.doYesNo( this, this.rathazulMoveToCamp, this, this.rathazulMoveDecline );
			//Set rathazul flag that he has offered to move in (1 time offer);
			CoC.player.changeStatusValue( StatusAffects.MetRathazul, 3, 1 );
			return;
		}
		offered = this.rathazulWorkOffer();
		if( !offered ) {
			EngineCore.outputText( 'He sighs dejectedly, "<i>I am not sure what I can do for you, youngling.  This world is fraught with unimaginable dangers, and you\'re just scratching the surface of them.</i>"\n\nYou nod and move on, leaving the depressed alchemist to his sadness.', false );
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		}
	};
	Rathazul.prototype.rathazulMoveToCamp = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Rathazul smiles happily back at you and begins packing up his equipment.  He mutters over his shoulder, "<i>It will take me a while to get my equipment moved over, but you head on back and I\'ll see you within the hour.  Oh my, yes.</i>"\n\nHe has the look of someone experiencing hope for the first time in a long time.' );
		CoC.player.createStatusAffect( StatusAffects.CampRathazul, 0, 0, 0, 0 );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	Rathazul.prototype.rathazulMoveDecline = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Rathazul wheezes out a sigh, and nods.\n\n"<i>Perhaps I\'ll still be of some use out here after all,</i>" he mutters as he packs up his camp and prepares to head to another spot along the lake.' );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	Rathazul.prototype.campRathazul = function() {
		EngineCore.spriteSelect( 49 );
		if( CoC.flags[ kFLAGS.MARBLE_PURIFICATION_STAGE ] === 2 && CoC.player.findStatusAffect( StatusAffects.MetRathazul ) >= 0 ) {
			SceneLib.marblePurification.visitRathazulToPurifyMarbleAfterLaBovaStopsWorkin();
			return;
		}
		if( CoC.flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ] === 1 && CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00275 ] > 0 ) {
			this.collectRathazulArmor();
			return;
		}
		//Special rathazul/follower scenes scenes.;
		if( Utils.rand( 6 ) === 0 && CoC.flags[ kFLAGS.RATHAZUL_CAMP_INTERACTION_COUNTDOWN ] === 0 ) {
			CoC.flags[ kFLAGS.RATHAZUL_CAMP_INTERACTION_COUNTDOWN ] = 3;
			//Pure jojo;
			if( CoC.flags[ kFLAGS.JOJO_RATHAZUL_INTERACTION_COUNTER ] === 0 && CoC.player.findStatusAffect( StatusAffects.PureCampJojo ) >= 0 && CoC.flags[ kFLAGS.JOJO_DEAD_OR_GONE ] === 0 ) {
				SceneLib.followerInteractions.jojoOffersRathazulMeditation();
				return;
			}
			if( CoC.flags[ kFLAGS.AMILY_MET_RATHAZUL ] === 0 && CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 && SceneLib.amilyScene.amilyFollower() ) {
				SceneLib.followerInteractions.AmilyIntroducesSelfToRathazul();
				return;
			}
			if( CoC.flags[ kFLAGS.AMILY_MET_RATHAZUL ] === 1 && CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 && SceneLib.amilyScene.amilyFollower() ) {
				SceneLib.followerInteractions.amilyIngredientDelivery();
				return;
			}
			if( CoC.flags[ kFLAGS.AMILY_MET_RATHAZUL ] === 2 && CoC.flags[ kFLAGS.AMILY_FOLLOWER ] === 1 && SceneLib.amilyScene.amilyFollower() ) {
				SceneLib.followerInteractions.amilyAsksAboutRathazulsVillage();
				return;
			}
		}
		var offered;
		//Rat is definitely not sexy!;
		if( CoC.player.lust > 50 ) {
			EngineCore.dynStats( 'lus', -1 );
		}
		if( CoC.player.lust > 65 ) {
			EngineCore.dynStats( 'lus', -5 );
		}
		if( CoC.player.lust > 80 ) {
			EngineCore.dynStats( 'lus', -5 );
		}
		if( CoC.player.lust > 90 ) {
			EngineCore.dynStats( 'lus', -5 );
		}
		//Introduction;
		EngineCore.outputText( 'Rathazul looks up from his equipment and gives you an uncertain smile.\n\n"<i>Oh, don\'t mind me,</i>" he says, "<i>I\'m just running some tests here.  Was there something you needed, ' + CoC.player.short + '?</i>"\n\n', true );
		//CoC.player.createStatusAffect(StatusAffects.metRathazul,0,0,0,0);;
		offered = this.rathazulWorkOffer();
		if( !offered ) {
			EngineCore.outputText( 'He sighs dejectedly, "<i>I don\'t think there is.  Why don\'t you leave me be for a time, and I will see if I can find something to aid you.</i>"', false );
			if( CoC.player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 ) {
				EngineCore.doNext( SceneLib.camp, SceneLib.camp.campFollowers );
			} else {
				EngineCore.doNext( MainView, MainView.playerMenu );
			}
		}
	};
	Rathazul.prototype.rathazulWorkOffer = function() {
		EngineCore.spriteSelect( 49 );
		var totalOffers = 0;
		var spoken = false;
		var showArmorMenu = false;
		var purify = null;
		var debimbo = 0;
		var reductos = null;
		var lethiciteDefense = null;
		var dyes = null;
		if( CoC.player.hasItem( ConsumableLib.BLACKEG ) || CoC.player.hasItem( ConsumableLib.L_BLKEG ) ) {
			CoC.flags[ kFLAGS.PC_KNOWS_ABOUT_BLACK_EGGS ] = 1;
			spoken = true;
			EngineCore.outputText( 'He eyes the onyx egg in your inventory and offers a little advice.  "<i>Be careful with black eggs.  They can turn your skin to living latex or rubber.  The smaller ones are usually safer, but everyone reacts differently.  I\'d get rid of them, if you want my opinion.</i>"\n\n' );
		}
		//Item crafting offer;
		if( CoC.player.hasItem( UseableLib.GREENGL, 2 ) ) {
			if( CoC.player.findStatusAffect( StatusAffects.RathazulArmor ) < 0 ) {
				EngineCore.outputText( 'He pipes up with a bit of hope in his voice, "<i>I can smell the essence of the tainted lake-slimes you\'ve defeated, and if you\'d let me, I could turn it into something a bit more useful to you.  You see, the slimes are filled with the tainted essence of the world-mother herself, and once the taint is burned away, the remaining substance remains very flexible but becomes nearly impossible to cut through.  With the gel of five defeated slimes I could craft you a durable suit of armor.</i>"\n\n', false );
			} else {
				EngineCore.outputText( 'He pipes up with a bit of excitement in his voice, "<i>With just five pieces of slime-gel I could make another suit of armor...</i>"\n\n', false );
			}
			spoken = true;
			if( CoC.player.hasItem( UseableLib.GREENGL, 5 ) ) {
				showArmorMenu = true;
				totalOffers++;
			} else {
				EngineCore.outputText( 'You realize you\'re still a bit short of gel.\n\n', false );
			}
		}
		//Item crafting offer;
		if( CoC.player.hasItem( UseableLib.B_CHITN ) ) {
			EngineCore.outputText( 'The elderly rat looks at you intently and offers, "<i>I see you\'ve gathered a piece of chitin from the giant bees of the forests.  If you bring me five pieces I could probably craft it into some tough armor.</i>"\n\n', false );
			spoken = true;
			if( CoC.player.hasItem( UseableLib.B_CHITN, 5 ) ) {
				showArmorMenu = true;
				totalOffers++;
			} else {
				EngineCore.outputText( '(You need five pieces of chitin for Rathazul to make you the chitinous armor.)\n\n', false );
			}
		}
		var pCounter = 0;
		//Item purification offer;
		if( CoC.player.hasItem( ConsumableLib.INCUBID ) ) {
			purify = this.purifySomething;
			totalOffers++;
			pCounter++;
		}
		if( CoC.player.hasItem( ConsumableLib.SUCMILK ) ) {
			purify = this.purifySomething;
			totalOffers++;
			pCounter++;
		}
		if( CoC.player.hasItem( ConsumableLib.SDELITE ) ) {
			purify = this.purifySomething;
			totalOffers++;
			pCounter++;
		}
		if( CoC.player.hasItem( ConsumableLib.LABOVA_ ) ) {
			purify = this.purifySomething;
			totalOffers++;
			pCounter++;
		}
		//Single Offer;
		if( pCounter === 1 ) {
			EngineCore.outputText( 'The rat mentions, "<i>I see you have at least one tainted item on you... for 20 gems I could remove most of the taint, making it a good deal safer to use.  Of course, who knows what kind of freakish transformations it would cause...</i>"\n\n', false );
			spoken = true;
			totalOffers++;
		}
		if( pCounter > 1 ) {
			EngineCore.outputText( 'The rat mentions, "<i>I see you have a number of demonic items on your person.  For 20 gems I could attempt to remove the taint from one of them, rendering it a good deal safer for consumption.  Of course it would not remove most of the transformative properties of the item...</i>"\n\n', false );
			spoken = true;
			totalOffers += 2;
		}
		//Offer dyes if offering something else.;
		if( CoC.player.gems >= 50 ) {
			EngineCore.outputText( 'Rathazul offers, "<i>Since you have enough gems to cover the cost of materials for my dyes as well, you could buy one of my dyes for your hair.  I will need 50 gems up-front.</i>"\n\n', false );
			spoken = true;
			totalOffers++;
			dyes = this.buyDyes;
		}
		//Reducto;
		if( CoC.player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 && CoC.player.statusAffectv2( StatusAffects.MetRathazul ) >= 4 ) {
			EngineCore.outputText( 'The rat hurries over to his supplies and produces a container of paste, looking rather proud of himself, "<i>Good news everyone!  I\'ve developed a paste you could use to shrink down any, ah, oversized body parts.  The materials are expensive though, so I\'ll need ' );
			if( CoC.flags[ kFLAGS.AMILY_MET_RATHAZUL ] >= 2 ) {
				EngineCore.outputText( '50' );
			} else {
				EngineCore.outputText( '100' );
			}
			EngineCore.outputText( ' gems for each jar of ointment you want.</i>"\n\n' );
			totalOffers++;
			spoken = true;
			reductos = this.buyReducto;
		}
		//SPOIDAH;
		if( CoC.player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 && CoC.player.hasItem( UseableLib.T_SSILK ) && CoC.flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ] + CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00275 ] === 0 ) {
			showArmorMenu = true;
			spoken = true;
			totalOffers++;
			EngineCore.outputText( '"<i>Oooh, is that some webbing from a giant spider or spider-morph?  Most excellent!  With a little bit of alchemical treatment, it is possible I could loosen the fibers enough to weave them into something truly magnificent - armor, or even a marvelous robe,</i>" offers Rathazul.\n\n', false );
		}
		//Vines;
		if( CoC.player.hasKeyItem( 'Marae\'s Lethicite' ) >= 0 && CoC.player.keyItemv2( 'Marae\'s Lethicite' ) < 3 && CoC.player.findStatusAffect( StatusAffects.DefenseCanopy ) < 0 && CoC.player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 ) {
			EngineCore.outputText( 'His eyes widen in something approaching shock when he sees the Lethicite crystal you took from Marae.  Rathazul stammers, "<i>By the goddess... that\'s the largest piece of lethicite I\'ve ever seen.  I don\'t know how you got it, but there is immense power in those crystals.  If you like, I know a way we could use its power to grow a canopy of thorny vines that would hide the camp and keep away imps.  Growing such a defense would use a third of that lethicite\'s power.</i>"\n\n' );
			totalOffers++;
			spoken = true;
			lethiciteDefense = this.growLethiciteDefense;
		}
		if( CoC.player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 ) {
			if( CoC.flags[ kFLAGS.RATHAZUL_DEBIMBO_OFFERED ] === 0 && (SceneLib.sophieBimbo.bimboSophie() || CoC.player.findPerk( PerkLib.BimboBrains ) >= 0 || CoC.player.findPerk( PerkLib.FutaFaculties ) >= 0) ) {
				this.rathazulDebimboOffer();
				return true;
			} else if( CoC.flags[ kFLAGS.RATHAZUL_DEBIMBO_OFFERED ] > 0 ) {
				EngineCore.outputText( 'You recall that Rathazul is willing to make something to cure bimbo liqueur for 250 gems and five Scholar\'s Teas.' );
				if( CoC.player.hasItem( ConsumableLib.SMART_T, 5 ) && CoC.player.gems >= 250 ) {
					totalOffers++;
					debimbo = 1;
				} else if( !CoC.player.hasItem( ConsumableLib.SMART_T, 5 ) ) {
					EngineCore.outputText( '  You should probably find some if you want that...' );
				} else {
					EngineCore.outputText( '  You need more gems to afford that, though.' );
				}
				EngineCore.outputText( '\n\n' );
			}
		}
		if( totalOffers === 0 && spoken ) {
			EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			return true;
		}
		if( totalOffers > 0 ) {
			EngineCore.outputText( 'Will you take him up on an offer or leave?', false );
			//In camp has no time passage if left.;
			EngineCore.menu();
			if( showArmorMenu ) {
				EngineCore.addButton( 0, 'Armor', this, this.rathazulArmorMenu );
			}
			if( debimbo > 0 ) {
				EngineCore.addButton( 1, 'Debimbo', this, this.makeADeBimboDraft );
			}
			EngineCore.addButton( 2, 'Buy Dye', this, dyes );
			if( lethiciteDefense !== null ) {
				EngineCore.addButton( 3, 'Lethicite', this, lethiciteDefense );
			}
			EngineCore.addButton( 4, 'Purify', this, purify );
			if( reductos !== null ) {
				EngineCore.addButton( 8, 'Reducto', this, reductos );
			}
			if( CoC.player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 ) {
				EngineCore.addButton( 9, 'Leave', SceneLib.camp, SceneLib.camp.campFollowers );
			} else {
				EngineCore.addButton( 9, 'Leave', SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
			}
			return true;
		}
		return false;
	};
	Rathazul.prototype.purifySomething = function() {
		EngineCore.spriteSelect( 49 );
		EngineCore.clearOutput();
		EngineCore.outputText( 'Rathazul asks, "<i>What would you like me to purify?</i>"' );
		EngineCore.menu();
		//Item purification offer;
		if( CoC.player.hasItem( ConsumableLib.INCUBID ) ) {
			EngineCore.addButton( 0, 'Incubi Draft', this, this.rathazulPurifyIncubiDraft );
		}
		if( CoC.player.hasItem( ConsumableLib.SUCMILK ) ) {
			EngineCore.addButton( 1, 'SuccubiMilk', this, this.rathazulPurifySuccubiMilk );
		}
		if( CoC.player.hasItem( ConsumableLib.SDELITE ) ) {
			EngineCore.addButton( 2, 'S. Delight', this, this.rathazulPurifySuccubiDelight );
		}
		if( CoC.player.hasItem( ConsumableLib.LABOVA_ ) ) {
			EngineCore.addButton( 3, 'LaBova', this, this.rathazulPurifyLaBova );
		}
		EngineCore.addButton( 4, 'Back', this, this.rathazulWorkOffer );
	};

	Rathazul.prototype.rathazulPurifyIncubiDraft = function() {
		EngineCore.clearOutput();
		if( CoC.player.gems < 20 ) {
			EngineCore.outputText( 'Rathazul says, "<i>You do not have enough gems for that service.</i>"' );
			EngineCore.doNext( this, this.returnToRathazulMenu );
			return;
		}
		CoC.player.destroyItems( ConsumableLib.INCUBID, 1 );
		SceneLib.inventory.takeItem( ConsumableLib.P_DRAFT, this.returnToRathazulMenu );
		CoC.player.gems -= 20;
		EngineCore.statScreenRefresh();
		CoC.player.addStatusValue( StatusAffects.MetRathazul, 2, 1 );
	};

	Rathazul.prototype.rathazulPurifySuccubiMilk = function() {
		EngineCore.clearOutput();
		if( CoC.player.gems < 20 ) {
			EngineCore.outputText( 'Rathazul says, "<i>You do not have enough gems for that service.</i>"' );
			EngineCore.doNext( this, this.returnToRathazulMenu );
			return;
		}
		CoC.player.destroyItems( ConsumableLib.SUCMILK, 1 );
		SceneLib.inventory.takeItem( ConsumableLib.P_S_MLK, this.returnToRathazulMenu );
		CoC.player.gems -= 20;
		EngineCore.statScreenRefresh();
		CoC.player.addStatusValue( StatusAffects.MetRathazul, 2, 1 );
	};

	Rathazul.prototype.rathazulPurifySuccubiDelight = function() {
		EngineCore.clearOutput();
		if( CoC.player.gems < 20 ) {
			EngineCore.outputText( 'Rathazul says, "<i>You do not have enough gems for that service.</i>"' );
			EngineCore.doNext( this, this.returnToRathazulMenu );
			return;
		}
		CoC.player.destroyItems( ConsumableLib.SDELITE, 1 );
		SceneLib.inventory.takeItem( ConsumableLib.PSDELIT, this.returnToRathazulMenu );
		CoC.player.gems -= 20;
		EngineCore.statScreenRefresh();
		CoC.player.addStatusValue( StatusAffects.MetRathazul, 2, 1 );
	};

	Rathazul.prototype.rathazulPurifyLaBova = function() {
		EngineCore.clearOutput();
		if( CoC.player.gems < 20 ) {
			EngineCore.outputText( 'Rathazul says, "<i>You do not have enough gems for that service.</i>"' );
			EngineCore.doNext( this, this.returnToRathazulMenu );
			return;
		}
		CoC.player.destroyItems( ConsumableLib.LABOVA_, 1 );
		SceneLib.inventory.takeItem( ConsumableLib.P_LBOVA, this.returnToRathazulMenu );
		CoC.player.gems -= 20;
		EngineCore.statScreenRefresh();
		CoC.player.addStatusValue( StatusAffects.MetRathazul, 2, 1 );
	};
	Rathazul.prototype.rathazulDebimboOffer = function() {
		EngineCore.spriteSelect( 49 );
		EngineCore.clearOutput();
		if( CoC.flags[ kFLAGS.RATHAZUL_DEBIMBO_OFFERED ] === 0 ) {
			if( SceneLib.sophieBimbo.bimboSophie() ) {
				EngineCore.outputText( 'Rathazul glances your way as you approach his lab, a thoughtful expression on his age-lined face.  "<i>Tell me, [name], do you truly enjoy having that vacuous idiot around, lusting after you at all hours of the day?</i>" he asks, shaking his head in frustration.  "<i>She\'s clearly been subjected to the effects of Bimbo Liqueur, which as you can plainly see are quite indeed potent.  However, like most things in Mareth, it can be countered - at least partially.</i>"  Rathazul folds his long, clawed fingers together, his tail lashing behind him as he thinks.  "<i>Perhaps with a sufficient quantity of something called Scholar\'s Tea... I could counter the stupefying effects of the elixir... oh my, yes... hmm...</i>"  Rathazul nods, stroking at the few long wisps of fur that hang from his chin.' );
				EngineCore.outputText( '\n\nYou await' );
				if( EngineCore.silly() ) {
					EngineCore.outputText( ' getGoodPost()' );
				} // C# await joke ;_; http://msdn.microsoft.com/en-gb/library/hh156528.aspx
				EngineCore.outputText( ' further clarification, but the old rat just stands there, staring off into space.  Coughing politely, you reacquire his attention, causing him to jump.' );
				EngineCore.outputText( '\n\n"<i>Oh?  Nmm, YES, bimbos, that\'s right!  As I was saying, five Scholar\'s Teas along with 250 gems for other reagents should give me all I need to create a bimbo-beating brew!  Oh my, the alliteration!  How absurd.</i>"  Rathazul chuckles slowly, wiping a drop from his eye before he looks back at you fiercely, "<i>It is a worthwhile goal - no creature should be subjected to a reduced intellect.  Let me know when you have acquired what is needed.</i>"' );
			} else {
				//Notification if the PC is the one bimbo'ed*;
				EngineCore.outputText( '\n\nRathazul glances your way as you approach his lab, a thoughtful expression on his age-lined face.  "<i>Tell me [name], do you truly enjoy living your life under the debilitating effects of that cursed potion?  Even now the spark of intelligence has all but left from your eyes.  Do you even understand what I\'m saying?</i>"' );
				EngineCore.outputText( '\n\nYou twirl a lock of hair around your finger and giggle.  This silly old rat thinks you\'re like, dumb and stuff!  He just doesn\'t know how great it is to have a rocking body and a sex-drive that\'s always ready to suck and fuck.  It\'s so much fun!  You look back at the rat, realizing you haven\'t answered him yet, feeling a bit embarrassed as he sighs in disappointment.' );
				EngineCore.outputText( '\n\n"<i>Child, please... bring me five Scholar\'s Teas and 250 gems for reagents, then I can fix you!  I can help you!  Just... get the tea!</i>" the alchemist pleads, counting off to five on his clawed fingers for extra emphasis while shaking his gem pouch profusely.  You bite your lower lip— he seems really really mad about this or something.  Maybe you should like, get the tea?' );
			}
			CoC.flags[ kFLAGS.RATHAZUL_DEBIMBO_OFFERED ]++;
		}
		//Rath menu;
		EngineCore.menu();
		EngineCore.addButton( 0, 'Next', this, this.campRathazul );
	};
	//Creation Of The Draft:*;
	Rathazul.prototype.makeADeBimboDraft = function() {
		EngineCore.clearOutput();
		EngineCore.spriteSelect( 49 );
		EngineCore.outputText( 'Rathazul takes the teas and the gems into his wizened palms, shuffling the glittering jewels into a pouch and the teas into a large decanter.  He promptly sets the combined brews atop a flame and shuffles over to his workbench, where he picks up numerous pouches and vials of every color and description, adding them to the mix one after the other.  The mixture roils and bubbles atop the open flame like a monstrous, eerie thing, but quickly simmers down to a quiet boil.  Rathazul leaves it going for a while, stirring occasionally as he pulls out a smaller vial.  Once most of the excess liquid has evaporated, he pours the concoction into the glass container and corks it, holding it up to the light to check its coloration.' );
		EngineCore.outputText( '\n\n"<i>That <b>should</b> do,</i>" he mutters to himself.  Rathazul turns, carefully handing you the mixture.  "<i>This should counter the mental-inhibiting effects of the Bimbo Liqueur, but I have no idea to what extent those who imbibe it will retain of their time spent as a bimbo...</i>"\n\n' );
		//Take items;
		CoC.player.gems -= 250;
		CoC.player.consumeItem( ConsumableLib.SMART_T, 5 );
		EngineCore.statScreenRefresh();
		CoC.player.addStatusValue( StatusAffects.MetRathazul, 2, 1 );
		SceneLib.inventory.takeItem( ConsumableLib.DEBIMBO, this.returnToRathazulMenu );
	};

	Rathazul.prototype.rathazulArmorMenu = function() {
		EngineCore.spriteSelect( 49 );
		EngineCore.clearOutput();
		var beeArmor = (CoC.player.hasItem( UseableLib.B_CHITN, 5 ) ? this.craftCarapace : null);
		var gelArmor = (CoC.player.hasItem( UseableLib.GREENGL, 5 ) ? this.craftOozeArmor : null);
		var silk = null;
		EngineCore.outputText( 'Which armor project would you like to pursue with Rathazul?' );
		if( CoC.player.findStatusAffect( StatusAffects.CampRathazul ) >= 0 && CoC.player.hasItem( UseableLib.T_SSILK ) && CoC.flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ] + CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00275 ] === 0 ) {
			silk = this.craftSilkArmor;
		}
		EngineCore.choices( 'BeeArmor', this, beeArmor, 'GelArmor', this, gelArmor, 'SpiderSilk', this, silk, '', null, null, 'Back', this, this.returnToRathazulMenu );
	};
	Rathazul.prototype.craftSilkArmor = function() {
		EngineCore.spriteSelect( 49 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You hand the bundled webbing to Rathazul carefully, lest you damage the elderly mouse.  He gives you a bemused smile and snatches the stuff from your grasp while he mutters, "<i>I\'m not falling apart you know.</i>"\n\n', false );
		//(Not enough webs: ;
		if( !CoC.player.hasItem( UseableLib.T_SSILK, 5 ) ) {
			EngineCore.outputText( 'The rat shakes his head and hands it back to you.  "<i>This isn\'t enough for me to make anything with.  I\'ll need at least five bundles of this stuff total, so you\'ll need to find more,</i>" he explains.\n\n', false );
			//(optional spider bonus: ;
			if( CoC.player.tailType === AppearanceDefs.TAIL_TYPE_SPIDER_ADBOMEN ) {
				EngineCore.outputText( 'You show him your spider-like abdomen in response, offering to produce more webbing for him.  Rathazul chuckles dryly, a sound that reminds you of hot wind rushing through a dead valley.  "<i>Dear child, this would never do.  Silk this tough can only be produced by a true-born spider.  No matter how you change yourself, you\'ll always be a human at heart.</i>"\n\n', false );
				EngineCore.outputText( 'The old rat shakes his head and adds, "<i>Well, now that I think about it, the venom of a red widow might be able to transform you until you are a spider to the core, but I have absolutely no idea what that would do to you.  If you ever try such a dangerous, reckless idea, let me know.  I want to have my notebooks handy, for SCIENCE!</i>"\n\n', false );
			}
			EngineCore.doNext( this, this.returnToRathazulMenu );
			return;
		}
		EngineCore.outputText( 'The rat limps over to his equipment, spider-silk in hand.  With efficient, practiced motions, he runs a few tests.  As he finishes, he sighs and explains, "<i>This will be harder than I thought.  The webbing is highly resistant to most of my alchemic reagents.  To even begin to work with such material I will need a number of rare, expensive elements.  I would need 500 gems to even start such a project.</i>"\n\n', false );
		EngineCore.outputText( 'You can\'t help but sigh when he names such a sizable figure.  Do you give him the 500 gems and spider-silk in order for him to create you a garment?', false );
		if( CoC.player.gems < 500 ) {
			EngineCore.outputText( '  <b>Wait... you don\'t even have 500 gems.  Damn.</b>', false );
			EngineCore.doNext( this, this.returnToRathazulMenu );
			return;
		}
		//[Yes] [No];
		EngineCore.doYesNo( this, this.commissionSilkArmorForReal, this, this.declineSilkArmorCommish );
	};
	Rathazul.prototype.commissionSilkArmorForReal = function() {
		EngineCore.spriteSelect( 49 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You sort 500 gems into a pouch and toss them to Rathazul, along with the rest of the webbing.  The wizened alchemist snaps the items out of the air with lightning-fast movements and goes to work immediately.  He bustles about with enormous energy, invigorated by the challenging task before him.  It seems Rathazul has completely forgotten about you, but as you turn to leave, he calls out, "<i>What did you want me to make?  A mage\'s robe or some nigh-impenetrable armor?</i>"\n\n', false );
		CoC.player.gems -= 500;
		EngineCore.statScreenRefresh();
		CoC.player.destroyItems( UseableLib.T_SSILK, 5 );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Armor', this, this.chooseArmorOrRobes, 1 );
		EngineCore.addButton( 1, 'Robes', this, this.chooseArmorOrRobes, 2 );
	};
	Rathazul.prototype.declineSilkArmorCommish = function() {
		EngineCore.spriteSelect( 49 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You take the silk back from Rathazul and let him know that you can\'t spend 500 gems on a project like that right now.  He sighs, giving you a crestfallen look and a slight nod of his hooded muzzle.', false );
		EngineCore.doNext( this, this.returnToRathazulMenu );
	};
	Rathazul.prototype.chooseArmorOrRobes = function( robeType ) {
		EngineCore.spriteSelect( 49 );
		EngineCore.outputText( 'Rathazul grunts in response and goes back to work.  You turn back to the center of your camp, wondering if the old rodent will actually deliver the wondrous item that he\'s promised you.', true );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00275 ] = robeType;
		CoC.flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ] = 24;
		$log.debug( '274: ' + CoC.flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ] );
	};
	Rathazul.prototype.collectRathazulArmor = function() {
		EngineCore.spriteSelect( 49 );
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'Rathazul beams and ejaculates, "<i>Good news everyone!  Your ', false );
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00275 ] === 1 ) {
			EngineCore.outputText( 'armor', false );
		} else {
			EngineCore.outputText( 'robe', false );
		}
		EngineCore.outputText( ' is finished!</i>"\n\n', false );
		//Robe;
		var itype;
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00275 ] === 2 ) {
			EngineCore.outputText( 'Hanging from a small rack is a long, flowing robe.  It glitters brightly in the light, the pearl-white threads seeming to shimmer and shine with every ripple the breeze blows through the soft fabric.  You run your fingers over the silken garment, feeling the soft material give at your touch.  There\'s a hood with a golden border embroidered around the edge.  For now, it hangs limply down the back, but it would be easy to pull up in order to shield the wearer\'s eyes from harsh sunlight or rainy drizzle.  The sleeves match the cowl, circled with intricate threads laid out in arcane patterns.\n\n', false );
			EngineCore.outputText( 'Rathazul gingerly takes down the garment and hands it to you.  "<i>Don\'t let the softness of the material fool you.  This robe is tougher than many armors, and the spider-silk\'s properties may even help you in your spell-casting as well.</i>"\n\n', false );
			itype = ArmorLib.SS_ROBE;
		}
		//(Armor);
		else {
			EngineCore.outputText( 'A glittering white suit of armor sits atop a crude armor rack, reflecting the light that plays across its surface beautifully.  You definitely didn\'t expect anything like this!  It looks nearly identical to a set of light platemail, though instead of having a cold metal surface, the armor feels slightly spongy, with just a little bit of give in it.\n\n', false );
			EngineCore.outputText( 'While you marvel at the strange equipment, Rathazul explains, "<i>When you said you wanted armor, I realized I could skip a few of the alchemical processes used to soften material.  The savings let me acquire a cheap metal set of armor to use as a base, and I molded half the armor around each piece, then removed it and created the outer, defensive layers with the rest of the webbing.  Unfortunately, I didn\'t have enough silk for a solid codpiece, but I did manage to make a you thin loincloth from the leftover scraps  - for modesty.</i>"\n\n', false );
			itype = ArmorLib.SSARMOR;
		}
		//Reset counters;
		CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00275 ] = 0;
		CoC.flags[ kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN ] = 0;
		SceneLib.inventory.takeItem( itype, this.returnToRathazulMenu );
	};
	Rathazul.prototype.craftOozeArmor = function() {
		EngineCore.spriteSelect( 49 );
		CoC.player.destroyItems( UseableLib.GREENGL, 5 );
		EngineCore.outputText( 'Rathazul takes the green gel from you and drops it into an empty cauldron.  With speed well beyond what you\'d expect from such an elderly creature, he nimbly unstops a number of vials and pours them into the cauldron.  He lets the mixture come to a boil, readying a simple humanoid-shaped mold from what you had thought was piles of junk material.  In no time at all, he has cast the boiling liquid into the mold, and after a few more minutes he cracks it open, revealing a suit of glistening armor.\n\n', true );
		CoC.player.addStatusValue( StatusAffects.MetRathazul, 2, 1 );
		SceneLib.inventory.takeItem( ArmorLib.GELARMR, this.returnToRathazulMenu );
		if( CoC.player.findStatusAffect( StatusAffects.RathazulArmor ) < 0 ) {
			CoC.player.createStatusAffect( StatusAffects.RathazulArmor, 0, 0, 0, 0 );
		}
	};
	Rathazul.prototype.buyDyes = function() {
		EngineCore.spriteSelect( 49 );
		EngineCore.clearOutput();
		EngineCore.outputText( 'Rathazul smiles and pulls forth several vials of colored fluids.  Which type of dye would you like?' );
		EngineCore.outputText( '\n\n<b>(-50 Gems)</b>' );
		CoC.player.gems -= 50;
		EngineCore.statScreenRefresh();
		EngineCore.menu();
		EngineCore.addButton( 0, 'Auburn', this, this.buyDye, ConsumableLib.AUBURND );
		EngineCore.addButton( 1, 'Black', this, this.buyDye, ConsumableLib.BLACK_D );
		EngineCore.addButton( 2, 'Blond', this, this.buyDye, ConsumableLib.BLOND_D );
		EngineCore.addButton( 3, 'Brown', this, this.buyDye, ConsumableLib.BROWN_D );
		EngineCore.addButton( 4, 'Red', this, this.buyDye, ConsumableLib.RED_DYE );
		EngineCore.addButton( 5, 'White', this, this.buyDye, ConsumableLib.WHITEDY );
		EngineCore.addButton( 6, 'Gray', this, this.buyDye, ConsumableLib.GRAYDYE );
		EngineCore.addButton( 9, 'Nevermind', this, this.buyDyeNevermind );
	};
	Rathazul.prototype.buyDye = function( dye ) {
		EngineCore.spriteSelect( 49 );
		EngineCore.clearOutput();
		SceneLib.inventory.takeItem( dye, this.returnToRathazulMenu );
		EngineCore.statScreenRefresh();
		CoC.player.addStatusValue( StatusAffects.MetRathazul, 2, 1 );
	};
	Rathazul.prototype.buyDyeNevermind = function() {
		EngineCore.spriteSelect( 49 );
		EngineCore.clearOutput();
		EngineCore.outputText( 'You change your mind about the dye, and Rathazul returns your gems.\n\n(<b>+50 Gems</b>)' );
		CoC.player.gems += 50;
		EngineCore.statScreenRefresh();
		EngineCore.doNext( this, this.returnToRathazulMenu );
	};
	Rathazul.prototype.buyReducto = function() {
		EngineCore.spriteSelect( 49 );
		EngineCore.clearOutput();
		var cost = (CoC.flags[ kFLAGS.AMILY_MET_RATHAZUL ] >= 2 ? 50 : 100);
		if( CoC.player.gems >= cost ) {
			EngineCore.outputText( 'Rathazul hands you the Reducto with a nod before returning to his work.\n\n' );
			CoC.player.gems -= cost;
			SceneLib.inventory.takeItem( ConsumableLib.REDUCTO, this.returnToRathazulMenu );
			EngineCore.statScreenRefresh();
			CoC.player.addStatusValue( StatusAffects.MetRathazul, 2, 1 );
		} else {
			EngineCore.outputText( '"<i>I\'m sorry, but you lack the gems I need to make the trade,</i>" apologizes Rathazul.' );
			EngineCore.doNext( this, this.returnToRathazulMenu );
		}
	};
	Rathazul.prototype.growLethiciteDefense = function() {
		EngineCore.spriteSelect( 49 );
		EngineCore.clearOutput();
		EngineCore.outputText( 'Rathazul asks, "<i>Are you absolutely sure?  Growing this thorn canopy as a defense will use one third of the crystal\'s power.</i>"\n\n(Do you have Rathazul use the crystal to grow a defensive canopy?)' );
		EngineCore.doYesNo( this, this.growLethiciteDefenseYesYesYes, this, this.growLethiciteDefenseGuessNot );
	};
	Rathazul.prototype.growLethiciteDefenseYesYesYes = function() {
		EngineCore.spriteSelect( 49 );
		EngineCore.clearOutput();
		EngineCore.outputText( 'Rathazul nods and produces a mallet and chisel from his robes.  With surprisingly steady hands for one so old, he holds the chisel against the crystal and taps it, easily cracking off a large shard.  Rathazul gathers it into his hands before slamming it down into the dirt, until only the smallest tip of the crystal is visible.  He produces vials of various substances from his robe, as if by magic, and begins pouring them over the crystal.  In a few seconds, he finishes, and runs back towards his equipment.\n\n"<i>You may want to take a step back,</i>" he warns, but before you have a chance to do anything, a thick trunk covered in thorny vines erupts from the ground.  Thousands of vine-like branches split off the main trunk as it reaches thirty feet in the air, radiating away from the trunk and intertwining with their neighbors as they curve back towards the ground.  In the span of a few minutes, your camp gained a thorn tree and a thick mesh of barbed vines preventing access from above.' );
		CoC.player.createStatusAffect( StatusAffects.DefenseCanopy, 0, 0, 0, 0 );
		CoC.player.addStatusValue( StatusAffects.MaraesLethicite, 2, 1 );
		EngineCore.doNext( MainView, MainView.playerMenu );
	};
	Rathazul.prototype.growLethiciteDefenseGuessNot = function() {
		EngineCore.spriteSelect( 49 );
		EngineCore.clearOutput();
		EngineCore.outputText( 'Rathazul nods sagely, "<i>That may be wise.  Perhaps there will be another use for this power.' );
		EngineCore.doNext( this, this.returnToRathazulMenu );
	};
	Rathazul.prototype.craftCarapace = function() {
		EngineCore.spriteSelect( 49 );
		EngineCore.outputText( 'The rat takes the scales and works on his bench for an hour while you wait.  Once he has finished, Ratzhul is beaming with pride, "<i>I think you\'ll be pleased. Go ahead and take a look.</i>"\n\nHe hands you the armor.  ', true );
		EngineCore.outputText( 'The plates shine and shimmer like black steel.  He has used the yellow chitin to add accents and embroidery to the plates with a level of detail and craftsmanship rarely seen back home. A yellow fur neck lining has been fashioned from hairs found on the pieces.  The armor includes a breastplate, shoulder guards, full arm guards, and knee high boots.  You notice there are no pants.  As you turn to ask him where the pants are, you see him scratching his head and hastily rustling in drawers.  He mutters under his breath, "<i>I\'m sorry, I\'m sorry, I got so focused on working on the pauldrons that I forgot to make any leg coverings!  Here, this should look good with it, and it won\'t restrict your movements.</i>"  He hands you a silken loincloth', false );
		if( CoC.player.gender >= 2 ) {
			EngineCore.outputText( ' with stockings and garters', false );
		}
		EngineCore.outputText( '.  He still manages to look somewhat pleased with himself in spite of the blunder, even bragging a little bit, "<i>Let me show you the different lengths of string I used.</i>"\n\n', false );
		if( CoC.player.cockTotal() > 0 && CoC.player.biggestCockArea() >= 40 ) {
			EngineCore.outputText( 'The silken material does little to hide the bulge of your groin, if anything it looks a little lewd.  Rathazul mumbles and looks away, shaking his head.\n\n', false );
		}
		if( CoC.player.biggestTitSize() >= 8 ) {
			EngineCore.outputText( 'Your ' + Appearance.biggestBreastSizeDescript() + ' barely fit into the breastplate, leaving you displaying a large amount of jiggling cleavage.\n\n', false );
		}
		CoC.player.destroyItems( UseableLib.B_CHITN, 5 );
		CoC.player.addStatusValue( StatusAffects.MetRathazul, 2, 1 );
		SceneLib.inventory.takeItem( ArmorLib.BEEARMR, this.returnToRathazulMenu );
		EngineCore.doNext( SceneLib.camp, SceneLib.camp.returnToCampUseOneHour );
	};
	SceneLib.registerScene( 'rathazul', new Rathazul() );
} );