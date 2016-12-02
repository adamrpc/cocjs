'use strict';

angular.module( 'cocjs' ).factory( 'HairExtensionSerum', function( kFLAGS, CoC, Consumable, EngineCore ) {
	function HairExtensionSerum() {
		this.init(this, arguments);
	}
	angular.extend(HairExtensionSerum.prototype, Consumable.prototype);
	HairExtensionSerum.prototype.init = function( that ) {
		Consumable.prototype.init( that, [ 'ExtSerm', 'ExtSerm', 'a bottle of hair extension serum', 6, 'This is a bottle of foamy pink liquid, purported by the label to increase the speed at which the user\'s hair grows.' ] );
	};
	HairExtensionSerum.prototype.canUse = function() {
		if( CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_SERUM_TIMES_APPLIED ] <= 2 ) {
			return true;
		}
		EngineCore.outputText( '<b>No way!</b>  Your head itches like mad from using the rest of these, and you will NOT use another.\n' );
		return false;
	};
	HairExtensionSerum.prototype.useItem = function() {
		EngineCore.outputText( 'You open the bottle of hair extension serum and follow the directions carefully, massaging it into your scalp and being careful to keep it from getting on any other skin.  You wash off your hands with lakewater just to be sure.' );
		if( CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_TIME_REMAINING ] <= 0 ) {
			EngineCore.outputText( '\n\nThe tingling on your head lets you know that it\'s working!' );
			CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_TIME_REMAINING ] = 7;
			CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_SERUM_TIMES_APPLIED ] = 1;
		} else if( CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_SERUM_TIMES_APPLIED ] === 1 ) {
			EngineCore.outputText( '\n\nThe tingling intensifies, nearly making you feel like tiny invisible faeries are massaging your scalp.' );
			CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_SERUM_TIMES_APPLIED ]++;
		} else if( CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_SERUM_TIMES_APPLIED ] === 2 ) {
			EngineCore.outputText( '\n\nThe tingling on your scalp is intolerable!  It\'s like your head is a swarm of angry ants, though you could swear your hair is growing so fast that you can feel it weighing you down more and more!' );
			CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_SERUM_TIMES_APPLIED ]++;
		}
		if( CoC.flags[ kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD ] > 0 && CoC.player.hairType !== 4 ) {
			CoC.flags[ kFLAGS.HAIR_GROWTH_STOPPED_BECAUSE_LIZARD ] = 0;
			EngineCore.outputText( '\n\n<b>Somehow you know that your ' + CoC.player.hairDescript() + ' is growing again.</b>' );
		}
		if( CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_TIME_REMAINING ] < 7 ) {
			CoC.flags[ kFLAGS.INCREASED_HAIR_GROWTH_TIME_REMAINING ] = 7;
		}
		return false;
	};
	return HairExtensionSerum;
} );