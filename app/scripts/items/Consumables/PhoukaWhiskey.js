'use strict';
/*jshint bitwise: false*/

angular.module( 'cocjs' ).factory( 'PhoukaWhiskey', function( StatusAffects, PregnancyStore, kFLAGS, CoC, Utils, Consumable, EngineCore ) {
	var PhoukaWhiskey = angular.copy( Consumable );
	PhoukaWhiskey.prototype.init = function( that ) {
		Consumable.prototype.init( that, [ 'P_Whsky', 'Ph. Whiskey', 'a small bottle of whiskey', 20, 'A small, corked glass bottle with a dark amber liquid inside.  The whiskey smells strongly of peat.' ] );
	};
	PhoukaWhiskey.prototype.canUse = function() {
		switch( this.phoukaWhiskeyAcceptable( CoC.getInstance().player ) ) {
			case -4:
				EngineCore.outputText( 'You stare at the bottle for a moment, but decide not to risk harming one of the children growing inside you.\n\n' );
				return false;
			case -3:
				EngineCore.outputText( 'You stare at the bottle for a moment, but decide not to risk harming either of the children growing inside you.\n\n' );
				return false;
			case -2:
				EngineCore.outputText( 'You stare at the bottle for a moment, but decide not to risk harming the child growing inside your colon.\n\n' );
				return false;
			case -1:
				EngineCore.outputText( 'You stare at the bottle for a moment, but decide not to risk harming the child growing inside your womb.\n\n' );
				return false;
			default:
		}
		return true; //Zero and up will return true
	};
	PhoukaWhiskey.prototype.useItem = function() {
		CoC.getInstance().player.slimeFeed();
		switch( this.phoukaWhiskeyDrink( CoC.getInstance().player ) ) {
			case 0: //Player isn't pregnant
				EngineCore.outputText( 'You uncork the bottle and drink some whiskey, hoping it will let you relax for a while.\n\nIt\'s strong stuff and afterwards you worry a bit less about the future.  Surely things will right themselves in the end.' );
				EngineCore.dynStats( 'cor', Utils.rand( 2 ) + 1, 'lus', Utils.rand( 8 ) + 1 ); //These gains are permanent
				break;
			case 1: //Child is a phouka or satyr, loves alcohol
				EngineCore.outputText( 'You uncork the bottle and drink some whiskey, hoping it will help with the gnawing hunger for alcohol you\'ve had since this baby started growing inside you.\n\nYou down the booze in one shot and a wave of contentment washes over you.  It seems your passenger enjoyed the meal.' );
				break;
			case 2: //Child is a faerie but will become a phouka with this drink
				EngineCore.outputText( 'At first you feel your baby struggle against the whiskey, then it seems to grow content and enjoy it.' );
				break;
			case 3: //Child is a faerie, hates phouka whiskey
				EngineCore.outputText( 'You feel queasy and want to throw up.  There\'s a pain in your belly and you realize the baby you\'re carrying didn\'t like that at all.' );
		}
		CoC.getInstance().flags[ kFLAGS.PREGNANCY_CORRUPTION ]++; //Faerie or phouka babies become more corrupted, no effect if the player is not pregnant or on other types of babies
		this.phoukaWhiskeyAddStatus( CoC.getInstance().player );
		return (false);
	};
	PhoukaWhiskey.prototype.phoukaWhiskeyAcceptable = function( player ) { //This function provides a single common test that can be used both by this class and the PhoukaScene class
		//Returns:	0 = this.canUse (not pregnant), 1 = this.canUse (single pregnancy, womb), 2 = this.canUse (single pregnancy, colon), 3 = this.canUse (double pregnancy, both OK),;
		//			-1 = No (single pregnancy, womb), -2 = No (single pregnancy, colon), -3 = No (double pregnancy, both not OK), -4 = No (double pregnancy, one OK, one not);
		if( player.pregnancyIncubation === 0 ) {
			if( player.buttPregnancyIncubation === 0 ) {
				return 0; //No baby. Simplest, most common case
			}
			if( player.buttPregnancyType === PregnancyStore.PREGNANCY_SATYR ) {
				return 2;
			}
			return -2;
		}
		if( player.buttPregnancyIncubation === 0 ) {
			{ //Single pregnancy, carried in the womb
			}
			if( player.pregnancyType === PregnancyStore.PREGNANCY_SATYR ) {
				return 1;
			}
			if( player.pregnancyType === PregnancyStore.PREGNANCY_FAERIE ) {
				return 1;
			}
			return -1;
		}
		//Double pregnancy;
		var wombBabyLikesAlcohol = (player.pregnancyType === PregnancyStore.PREGNANCY_SATYR) || (player.pregnancyType === PregnancyStore.PREGNANCY_FAERIE);
		var colonBabyLikesAlcohol = (player.buttPregnancyType === PregnancyStore.PREGNANCY_SATYR);
		if( wombBabyLikesAlcohol && colonBabyLikesAlcohol ) {
			return 3;
		}
		if( !wombBabyLikesAlcohol && !colonBabyLikesAlcohol ) {
			return -3;
		}
		return -4;
	};
	PhoukaWhiskey.prototype.phoukaWhiskeyDrink = function( player ) { //This function provides a single common test that can be used both by this class and the PhoukaScene class
		//Returns:	0 = Player is not pregnant, 1 = Player is pregnant with a satyr or phouka, 2 = Player is pregnant with a faerie that will become a phouka with this drink,;
		//			3 = Player is pregnant with a faerie that will remain a faerie after this drink;
		if( (player.pregnancyIncubation === 0) && (player.buttPregnancyIncubation === 0) ) {
			return 0;
		}
		if( player.pregnancyType === PregnancyStore.PREGNANCY_FAERIE ) {
			if( CoC.getInstance().flags[ kFLAGS.PREGNANCY_CORRUPTION ] === 0 ) {
				return 2;
			}
			if( CoC.getInstance().flags[ kFLAGS.PREGNANCY_CORRUPTION ] < 0 ) {
				return 3;
			}
		}
		return 1; //Pregnancy has to be either a satyr or a phouka
	};
	PhoukaWhiskey.prototype.phoukaWhiskeyAddStatus = function( player ) {
		var libidoChange = (player.lib + 25 > 100 ? 100 - player.lib : 25);
		var sensChange = (player.sens < 10 ? player.sens : 10);
		var speedChange = (player.spe < 20 ? player.spe : 20);
		var intChange = (player.inte < 20 ? player.inte : 20);
		if( player.findStatusAffect( StatusAffects.PhoukaWhiskeyAffect ) >= 0 ) {
			var drinksSoFar = player.statusAffectv2( StatusAffects.PhoukaWhiskeyAffect );
			if( drinksSoFar < 4 ) {
				player.addStatusValue( StatusAffects.PhoukaWhiskeyAffect, 1, 8 - (2 * drinksSoFar) );
			} else {
				player.addStatusValue( StatusAffects.PhoukaWhiskeyAffect, 1, 1 );
			} //Always get at least one more hour of drunkenness
			player.addStatusValue( StatusAffects.PhoukaWhiskeyAffect, 2, 1 );
			player.addStatusValue( StatusAffects.PhoukaWhiskeyAffect, 3, 256 * libidoChange + sensChange );
			player.addStatusValue( StatusAffects.PhoukaWhiskeyAffect, 4, 256 * speedChange + intChange );
			EngineCore.outputText( '\n\nOh, it tastes so good.  This stuff just slides down your throat.' );
			EngineCore.dynStats( 'lib', libidoChange, 'sens', -sensChange, 'spe', -speedChange, 'int', -intChange );
		} else {
			{ //First time
			}
			player.createStatusAffect( StatusAffects.PhoukaWhiskeyAffect, 8, 1, 256 * libidoChange + sensChange, 256 * speedChange + intChange );
			//The four stats we’re affecting get paired together to save space. This way we don’t need a second StatusAffect to store more info.;
			EngineCore.dynStats( 'lib', libidoChange, 'sens', -sensChange, 'spe', -speedChange, 'int', -intChange );
		}
		EngineCore.statScreenRefresh();
	};
	PhoukaWhiskey.prototype.phoukaWhiskeyExpires = function( player ) {
		var numDrunk = player.statusAffectv2( StatusAffects.PhoukaWhiskeyAffect );
		var libidoSensCombined = player.statusAffectv3( StatusAffects.PhoukaWhiskeyAffect );
		var intSpeedCombined = player.statusAffectv4( StatusAffects.PhoukaWhiskeyAffect );
		var sensChange = libidoSensCombined & 255;
		var libidoChange = (libidoSensCombined - sensChange) / 256;
		var intChange = intSpeedCombined & 255;
		var speedChange = (intSpeedCombined - intChange) / 256;
		EngineCore.dynStats( 'lib', -libidoChange, 'sens', sensChange, 'spe', speedChange, 'int', intChange ); //Get back all the stats you lost
		player.removeStatusAffect( StatusAffects.PhoukaWhiskeyAffect );
		if( numDrunk > 3 ) {
			EngineCore.outputText( '\n<b>The dizzy sensation dies away and is replaced by a throbbing pain that starts in your skull and then seems to run all through your body, seizing up your joints and making your stomach turn.  The world feels like it’s off kilter and you aren’t in any shape to face it.  You suppose you could down another whiskey, but right now that doesn’t seem like such a good idea.</b>\n' );
		} else if( numDrunk > 1 ) {
			EngineCore.outputText( '\n<b>The fuzzy, happy feeling ebbs away.  With it goes the warmth and carefree feelings.  Your head aches and you wonder if you should have another whiskey, just to tide you over</b>\n' );
		} else {
			EngineCore.outputText( '\n<b>The fuzzy, happy feeling ebbs away.  The weight of the world’s problems seems to settle on you once more.  It was nice while it lasted and you wouldn’t mind having another whiskey.</b>\n' );
		}
		EngineCore.statScreenRefresh();
	};
	return PhoukaWhiskey;
} );