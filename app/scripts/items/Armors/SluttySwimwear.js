'use strict';

angular.module( 'cocjs' ).factory( 'SluttySwimwear', function( CoC, ArmorWithPerk, PerkLib, EngineCore ) {
	function SluttySwimwear() {
		this.init(this, arguments);
	}
	angular.extend(SluttySwimwear.prototype, ArmorWithPerk.prototype);
	SluttySwimwear.prototype.init = function( that ) {
		ArmorWithPerk.prototype.init( that, [ 'S.Swmwr', 'S.Swmwr', 'slutty swimwear', 'a skimpy black bikini', 0, 6, 'An impossibly skimpy black bikini. You feel dirty just looking at it... and a little aroused, actually.', 'Light', PerkLib.SluttySeduction, 6, 0, 0, 0, '', true ] );
	};
	SluttySwimwear.prototype.useText = function() { //Produces any text seen when equipping the armor normally
		EngineCore.dynStats( 'lus', 5 );
		if( CoC.player.biggestTitSize() < 1 ) {
			EngineCore.outputText( 'You feel rather stupid putting the top part on like this, but you\'re willing to bear with it. It could certainly be good for distracting.  ' );
		} else {
			EngineCore.outputText( 'The bikini top clings tightly to your bustline, sending a shiver of pleasure through your body. It serves to turn you on quite nicely.  ' );
			EngineCore.dynStats( 'lus', 5 );
		}
		if( CoC.player.totalCocks() === 0 ) {
			EngineCore.outputText( 'The thong moves over your smooth groin, clinging onto your buttocks nicely.  ' );
			if( CoC.player.balls > 0 ) {
				if( CoC.player.ballSize > 5 ) {
					EngineCore.outputText( 'You do your best to put the thong on, and while the material is very stretchy, it simply can\'t even begin to cover everything, and your ' + CoC.player.ballsDescriptLight() + ' hang on the sides, exposed.  Maybe if you shrunk your male parts down a little...' );
				} else {
					EngineCore.outputText( 'However, your testicles do serve as an area of discomfort, stretching the material and bulging out the sides slightly.  ' );
				}
			}
		} else {
			if( CoC.player.totalCocks() === 1 ) {
				EngineCore.outputText( 'You grunt in discomfort, your ' + CoC.player.cockDescript( 0 ) + ' flopping free from the thong\'s confines. The tight material rubbing against your dick does manage to turn you on slightly.  ' );
			} else {
				EngineCore.outputText( 'You grunt in discomfort, your ' + CoC.player.multiCockDescriptLight() + ' flopping free from the thong\'s confines. The tight material rubbing against your dicks does manage to turn you on slightly.  ' );
			}
			EngineCore.dynStats( 'lus', 5 );
			if( CoC.player.biggestCockArea() >= 20 ) {
				EngineCore.outputText( 'You do your best to put the thong on, and while the material is very stretchy, it simply can\'t even begin to cover everything, and your ' + CoC.player.cockDescript( CoC.player.biggestCockIndex() ) + ' has popped out of the top, completely exposed.  Maybe if you shrunk your male parts down a little...' );
			}//[If dick is 7+ inches OR balls are apple-sized];
			else if( CoC.player.ballSize > 5 ) {
				EngineCore.outputText( 'You do your best to put the thong on, and while the material is very stretchy, it simply can\'t even begin to cover everything, and your ' + CoC.player.ballsDescriptLight() + ' hang on the sides, exposed.  Maybe if you shrunk your male parts down a little...' );
			}
		}
		EngineCore.outputText( '\n\n' );
	};
	return SluttySwimwear;
} );