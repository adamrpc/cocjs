'use strict';

angular.module( 'cocjs' ).run( function( MainView, ArmorLib, Armor, kFLAGS, EngineCore, CoC ) {
	function GooArmor() {
		this.init(this, arguments);
	}
	angular.extend(GooArmor.prototype, Armor.prototype);
	GooArmor.prototype.init = function( that ) {
		Armor.prototype.init( that, [ 'GooArmor', 'GooArmor', 'goo armor', 'Valeria, the goo-girl armor', 22, 1, 'This shining suit of platemail is more than just platemail - it houses the goo-girl, Valeria!  Together, they provide one tough defense, but you had better be okay with having goo handling your junk while you fight if you wear this!' ] );
		that.classNames.push('GooArmor');
	};
	GooArmor.prototype.useText = function() { //Produces any text seen when equipping the armor normally
		MainView.outputText( 'With an ecstatic smile, the goo-armor jumps to her feet and throws her arms around your shoulders.  "<i>Oh, this is going to be so much fun!  Thank you thank you thank you!  I promise I\'ll keep you nice and snug and safe, don\'t you worry.  Oooh, a real adventure again!  WHEEE!</i>"' );
		MainView.outputText( '\n\nBefore she can get too excited, you remind the goo that she\'s supposed to be your armor right about now.  Clasping her hands over her mouth in embarrassment, she utters a muted apology and urges you to just "<i>put me on!</i>"  Awkwardly, you strip out of your gear and open up the platemail armor and clamber in.  It\'s wet and squishy, making you shudder and squirm as you squash your new friend flat against the metal armor.' );
		MainView.outputText( '\n\nEventually, the two of you get situated. The goo-girl slips around your body inside the heavy armor, maneuvering so that your face is unobstructed and your joints, not protected by the armor, are soundly clad in squishy goo.  She even forms a gooey beaver on your new helm, allowing you to open and close her like a visor in battle.  Eventually, her goo settles around your ' );
		if( CoC.player.hasVagina() ) {
			MainView.outputText( '[vagina]' );
		}
		if( CoC.player.hasVagina() && CoC.player.hasCock() ) {
			MainView.outputText( ' and ' );
		}
		if( CoC.player.hasCock() ) {
			MainView.outputText( CoC.player.multiCockDescriptLight() );
		}
		if( CoC.player.gender === 0 ) {
			MainView.outputText( 'groin' );
		}
		MainView.outputText( ', encasing your loins in case you need a little mid-battle release, she says.' );
		MainView.outputText( '\n\nAfter a few minutes, you and your armor-friend are settled and ready to go.' );
		if( CoC.flags[ kFLAGS.MET_VALERIA ] === 0 ) {
			MainView.outputText( '  As you ready yourself for the dungeon ahead, the goo giggles into your ear.  "<i>Oh shit, EngineCore.silly me.  I forgot, my name\'s Valeria.  Ser Valeria, if you\'re feeling fancy.</i>"  You introduce yourself, awkwardly shaking your own hand by way of pleasantries.' );
			CoC.flags[ kFLAGS.MET_VALERIA ]++;
		}
		MainView.outputText( '\n\n"<i>Well alright then, [name]!</i>" Valeria says excitedly, "<i>Let\'s go!</i>"\n\n' );
	};
	GooArmor.prototype.removeText = function() { //Produces any text seen when removing the armor normally
		MainView.outputText( 'Valeria picks herself up and huffs, "<i>Maybe we can adventure some more later on?</i>" before undulating off towards your camp.\n\n(<b>Valeria now available in the followers tab!</b>)' );
	};
	GooArmor.prototype._superPlayerEquip = GooArmor.prototype.playerEquip;
	GooArmor.prototype.playerEquip = function() { //This item is being equipped by the player. Add any perks, etc.
		CoC.flags[ kFLAGS.VALARIA_AT_CAMP ] = 0;
		return this._superPlayerEquip();
	};
	GooArmor.prototype.playerRemove = function() { //This item is being removed by the player. Remove any perks, etc.
		CoC.flags[ kFLAGS.VALARIA_AT_CAMP ] = 1;
		return null; //Can't put Valaria in your inventory
	};
	ArmorLib.registerArmor( 'GOOARMR', new GooArmor() );
} );