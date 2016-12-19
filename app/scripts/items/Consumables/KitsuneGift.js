'use strict';

angular.module( 'cocjs' ).run( function( $log, MainView, CoC, SceneLib, ConsumableLib, UseableLib, Utils, Useable, EngineCore ) {
	function KitsuneGift() {
		this.init(this, arguments);
	}
	angular.extend(KitsuneGift.prototype, Useable.prototype);
	KitsuneGift.prototype.init = function( that ) {
		Useable.prototype.init( that, [ 'KitGift', 'KitGift', 'a kitsune\'s gift', 0, 'A small square package given to you by a forest kitsune.  It is wrapped up in plain white paper and tied with a string.  Who knows what\'s inside?' ] );
		that.classNames.push('KitsuneGift');
	};
	KitsuneGift.prototype.useItem = function() {
		MainView.clearOutput();
		MainView.outputText( 'Curiosity gets the best of you, and you decide to open the package.  After all, what\'s the worst that could happen?\n\n' );
		//Opening the gift randomly results in one of the following:;
		switch( Utils.rand( 12 ) ) {
			//[Fox Jewel];
			case 0:
				MainView.outputText( 'As the paper falls away, you carefully lift the cover of the box, your hands trembling nervously.  The inside of the box is lined with purple velvet, and to your delight, sitting in the center is a small teardrop-shaped jewel!' );
				MainView.outputText( '\n\n<b>You\'ve received a shining Fox Jewel from the kitsune\'s gift!  How generous!</b>  ' );
				SceneLib.inventory.takeItem( ConsumableLib.FOXJEWL, SceneLib.inventory.inventoryMenu );
				return (true);
			//[Fox Berries];
			case 1:
				MainView.outputText( 'As the paper falls away, you carefully lift the cover of the box, your hands trembling nervously.  The inside of the box is lined with purple velvet, and to your delight, there is a small cluster of orange-colored berries sitting in the center!' );
				MainView.outputText( '\n\n<b>You\'ve received a fox berry from the kitsune\'s gift!  How generous!</b>  ' );
				//add Fox Berries to inventory;
				SceneLib.inventory.takeItem( ConsumableLib.FOXBERY, SceneLib.inventory.inventoryMenu );
				return (true);
			//[Gems];
			case 2:
				MainView.outputText( 'As the paper falls away, you carefully lift the cover of the box, your hands trembling nervously.  The inside of the box is lined with purple velvet, and to your delight, it is filled to the brim with shining gems!' );
				var gems = 2 + Utils.rand( 20 );
				MainView.outputText( '\n\n<b>You\'ve received ' + Utils.num2Text( gems ) + ' shining gems from the kitsune\'s gift!  How generous!</b>' );
				CoC.player.gems += gems;
				//add X gems to inventory;
				MainView.statsView.show();
				break;
			//[Kitsune Tea/Scholar's Tea] //Just use Scholar's Tea and drop the 'trick' effect if you don't want to throw in another new item.;
			case 3:
				MainView.outputText( 'As the paper falls away, you carefully lift the cover of the box, your hands trembling nervously.  The inside of the box is lined with purple velvet, and to your delight, it contains a small bag of dried tea leaves!' );
				MainView.outputText( '\n\n<b>You\'ve received a bag of tea from the kitsune\'s gift!  How thoughtful!</b>  ' );
				//add Kitsune Tea/Scholar's Tea to inventory;
				SceneLib.inventory.takeItem( ConsumableLib.SMART_T, SceneLib.inventory.inventoryMenu );
				return (true);
			//[Hair Dye];
			case 4:
				MainView.outputText( 'As the paper falls away, you carefully lift the cover of the box, your hands trembling nervously.  The inside of the box is lined with purple velvet, and to your delight, it contains a small vial filled with hair dye!' );
				var itype = [
					ConsumableLib.RED_DYE,
					ConsumableLib.BLOND_D,
					ConsumableLib.BLACK_D,
					ConsumableLib.WHITEDY
				][ Utils.rand( 4 ) ];
				MainView.outputText( '\n\n<b>You\'ve received ' + itype.longName + ' from the kitsune\'s gift!  How generous!</b>  ' );
				//add <color> Dye to inventory;
				SceneLib.inventory.takeItem( itype, SceneLib.inventory.inventoryMenu );
				return (true);
			//[Knowledge Spell];
			case 5:
				MainView.outputText( 'As the paper falls away, you carefully lift the cover of the box, your hands trembling nervously.  The inside of the box is lined with purple velvet, but it seems like there\'s nothing else inside.  As you peer into the box, a glowing circle filled with strange symbols suddenly flashes to life!  Light washes over you, and your mind is suddenly assaulted with new knowledge...  and the urge to use that knowledge for mischief!' );
				MainView.outputText( '\n\n<b>The kitsune has shared some of its knowledge with you!</b>  But in the process, you\'ve gained some of the kitsune\'s promiscuous trickster nature...' );
				//Increase INT and Libido, +10 LUST;
				EngineCore.dynStats( 'int', 4, 'sen', 2, 'lus', 10 );
				break;
			//[Thief!];
			case 6:
				MainView.outputText( 'As the paper falls away, you carefully lift the cover of the box, your hands trembling nervously.  The inside of the box is lined with purple velvet, and sitting in the center is an artfully crafted paper doll.  Before your eyes, the doll springs to life, dancing about fancifully.  Without warning, it leaps into your item pouch, then hops away and gallavants into the woods, carting off a small fortune in gems.' );
				MainView.outputText( '\n\n<b>The kitsune\'s familiar has stolen your gems!</b>' );
				// Lose X gems as though losing in battle to a kitsune;
				CoC.player.gems -= 2 + Utils.rand( 15 );
				MainView.statsView.show();
				break;
			//[Prank];
			case 7:
				MainView.outputText( 'As the paper falls away, you carefully lift the cover of the box, your hands trembling nervously.  The inside of the box is lined with purple velvet, and sitting in the center is an artfully crafted paper doll.  Before your eyes, the doll springs to life, dancing about fancifully.  Without warning, it pulls a large calligraphy brush from thin air and leaps up into your face, then hops away and gallavants off into the woods.  Touching your face experimentally, you come away with a fresh coat of black ink on your fingertips.' );
				MainView.outputText( '\n\n<b>The kitsune\'s familiar has drawn all over your face!</b>  The resilient marks take about an hour to completely scrub off in the nearby stream.  You could swear you heard some mirthful snickering among the trees while you were cleaning yourself off.' );
				//Advance time 1 hour, -20 LUST;
				EngineCore.dynStats( 'lus', -20 );
				break;
			//[Aphrodisiac];
			case 8:
				MainView.outputText( 'As the paper falls away, you carefully lift the cover of the box, your hands trembling nervously.  The inside of the box is lined with purple velvet, and sitting in the center is an artfully crafted paper doll.  Before your eyes, the doll springs to life, dancing about fancifully.  Without warning, it tosses a handful of sweet-smelling pink dust into your face, then hops over the rim of the box and gallavants off into the woods.  Before you know what has happened, you feel yourself growing hot and flushed, unable to keep your hands away from your groin.' );
				MainView.outputText( '\n\n<b>Oh no!  The kitsune\'s familiar has hit you with a powerful aphrodisiac!  You are debilitatingly aroused and can think of nothing other than masturbating.</b>' );
				//+100 LUST;
				EngineCore.dynStats( 'lus=', 100, 'resisted', false );
				break;
			//[Wither];
			case 9:
				MainView.outputText( 'As the paper falls away, you carefully lift the cover of the box, your hands trembling nervously.  The inside of the box is lined with purple velvet, and sitting in the center is an artfully crafted paper doll.  Before your eyes, the doll springs to life, dancing about fancifully.  Without warning, it tosses a handful of sour-smelling orange powder into your face, then hops over the rim of the box and gallavants off into the woods.  Before you know what has happened, you feel the strength draining from your muscles, withering away before your eyes.' );
				MainView.outputText( '\n\n<b>Oh no!  The kitsune\'s familiar has hit you with a strength draining spell!  Hopefully it\'s only temporary...</b>' );
				EngineCore.dynStats( 'str', -5, 'tou', -5 );
				break;
			//[Dud];
			case 10:
				MainView.outputText( 'As the paper falls away, you carefully lift the cover of the box, your hands trembling nervously.  The inside of the box is lined with purple velvet, but to your disappointment, the only other contents appear to be nothing more than twigs, leaves, and other forest refuse.' );
				MainView.outputText( '\n\n<b>It seems the kitsune\'s gift was just a pile of useless junk!  What a ripoff!</b>' );
				break;
			//[Dud...  Or is it?];
			case 11:
				MainView.outputText( 'As the paper falls away, you carefully lift the cover of the box, your hands trembling nervously.  The inside of the box is lined with purple velvet, but to your disappointment, the only other contents appear to be nothing more than twigs, leaves, and other forest refuse.  Upon further investigation, though, you find a shard of shiny black chitinous plating mixed in with the other useless junk.' );
				MainView.outputText( '\n\n<b>At least you managed to salvage a shard of black chitin from it...</b>  ' );
				SceneLib.inventory.takeItem( UseableLib.B_CHITN, SceneLib.inventory.inventoryMenu );
				return (true);
			default:
				$log.debug( 'Kitsune\'s gift roll foobar...' );
		}
		return false; //Any other case does not have a sub-EngineCore.menu.
	};
	ConsumableLib.registerConsumable( 'KITGIFT', new KitsuneGift() );
} );