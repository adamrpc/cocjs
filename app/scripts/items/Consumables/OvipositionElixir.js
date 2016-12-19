'use strict';

angular.module( 'cocjs' ).run( function( MainView, ConsumableLib, $log, PregnancyStore, StatusAffects, CoC, Utils, Useable ) {
	function OvipositionElixir() {
		this.init(this, arguments);
	}
	angular.extend(OvipositionElixir.prototype, Useable.prototype);
	OvipositionElixir.prototype.init = function( that ) {
		Useable.prototype.init( that, [ 'OviElix', 'Ovi Elixir', 'a hexagonal crystal bottle tagged with an image of an egg', 30, 'This hexagonal crystal bottle is filled with a strange green fluid.  A tag with a picture of an egg is tied to the neck of the bottle, indicating it is somehow connected to egg-laying.' ] );
		that.classNames.push('OvipositionElixir');
	};
	OvipositionElixir.prototype.canUse = function() {
		if( CoC.player.hasVagina() ) {
			return true;
		}
		MainView.outputText( 'You pop the cork and prepare to drink the stuff, but the smell nearly makes you gag.  You cork it hastily.\n\n' );
		return false;
	};
	//Oviposition Elixer!;
	/* Notes on StatusAffects.Eggs
	 v1 = egg type.
	 v2 = size - 0 for normal, 1 for large
	 v3 = quantity
	 EGG TYPES-
	 0 - brown - ass expansion
	 1 - purple - hip expansion
	 2 - blue - vaginal removal and/or growth of existing maleness
	 3 - pink - dick removal and/or fertility increase.
	 4 - white - breast growth.  If lactating increases lactation.
	 5 - rubbery black
	 */
	OvipositionElixir.prototype.useItem = function() {
		CoC.player.slimeFeed();
		MainView.outputText( 'You pop the cork and gulp down the thick greenish fluid.  The taste is unusual and unlike anything you\'ve tasted before.' );
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_GOO_STUFFED ) {
			MainView.outputText( '\n\nFor a moment you feel even more bloated than you already are.  That feeling is soon replaced by a dull throbbing pain.  It seems that with Valeria\'s goo filling your womb the ovielixir is unable to work its magic on you.' );
			return (false);
		}
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_WORM_STUFFED ) {
			MainView.outputText( '\n\nFor a moment you feel even more bloated than you already are.  That feeling is soon replaced by a dull throbbing pain.  It seems that with the worms filling your womb the ovielixir is unable to work its magic on you.' );
			return (false);
		}
		if( CoC.player.pregnancyIncubation === 0 ) {
			{ //If the player is not pregnant, get preggers with eggs!
			}
			MainView.outputText( '\n\nThe elixir has an immediate effect on your belly, causing it to swell out slightly as if pregnant.  You guess you\'ll be laying eggs sometime soon!' );
			CoC.player.knockUp( PregnancyStore.PREGNANCY_OVIELIXIR_EGGS, PregnancyStore.INCUBATION_OVIELIXIR_EGGS, 1, 1 );
			CoC.player.createStatusAffect( StatusAffects.Eggs, Utils.rand( 6 ), 0, Utils.rand( 3 ) + 5, 0 );
			return (false);
		}
		var changeOccurred = false;
		if( CoC.player.pregnancyType === PregnancyStore.PREGNANCY_OVIELIXIR_EGGS ) {
			{ //If player already has eggs, chance of size increase!
			}
			if( CoC.player.findStatusAffect( StatusAffects.Eggs ) >= 0 ) {
				//If eggs are small, chance of increase!;
				if( CoC.player.statusAffectv2( StatusAffects.Eggs ) === 0 ) {
					//1 in 2 chance!;
					if( Utils.rand( 3 ) === 0 ) {
						CoC.player.addStatusValue( StatusAffects.Eggs, 2, 1 );
						MainView.outputText( '\n\nYour pregnant belly suddenly feels heavier and more bloated than before.  You wonder what the elixir just did.' );
						changeOccurred = true;
					}
				}
				//Chance of quantity increase!;
				if( Utils.rand( 2 ) === 0 ) {
					MainView.outputText( '\n\nA rumble radiates from your uterus as it shifts uncomfortably and your belly gets a bit larger.' );
					CoC.player.addStatusValue( StatusAffects.Eggs, 3, Utils.rand( 4 ) + 1 );
					changeOccurred = true;
				}
			}
		}
		if( !changeOccurred && CoC.player.pregnancyIncubation > 20 && CoC.player.pregnancyType !== PregnancyStore.PREGNANCY_BUNNY ) {
			{ //If no changes, speed up pregnancy.
			}
			MainView.outputText( '\n\nYou gasp as your pregnancy suddenly leaps forwards, your belly bulging outward a few inches as it gets closer to time for birthing.' );
			var newIncubation = CoC.player.pregnancyIncubation - Math.ceil( CoC.player.pregnancyIncubation * 0.3 + 10 );
			if( newIncubation < 2 ) {
				newIncubation = 2;
			}
			CoC.player.knockUpForce( CoC.player.pregnancyType, newIncubation );
			$log.debug( 'Pregger Count New total:' + CoC.player.pregnancyIncubation );
		}
		return (false);
	};
	ConsumableLib.registerConsumable( 'OVIELIX', new OvipositionElixir() );
} );