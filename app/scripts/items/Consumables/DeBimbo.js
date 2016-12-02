'use strict';

angular.module( 'cocjs' ).factory( 'DeBimbo', function( CoC, Consumable, PerkLib, EngineCore ) {
	function DeBimbo() {
		this.init(this, arguments);
	}
	angular.extend(DeBimbo.prototype, Consumable.prototype);
	DeBimbo.prototype.init = function( that ) {
		Consumable.prototype.init( that, [ 'Debimbo', 'Debimbo', 'a bottle marked as \'Debimbo\'', 250 ] );
	};
	DeBimbo.prototype.canUse = function() {
		if( CoC.getInstance().player.findPerk( PerkLib.BimboBrains ) >= 0 || CoC.getInstance().player.findPerk( PerkLib.FutaFaculties ) >= 0 ) {
			return true;
		}
		EngineCore.outputText( 'You can\'t use this right now, and it\'s too expensive to waste!\n\n' );
		return false;
	};
	DeBimbo.prototype.useItem = function() {
		if( CoC.getInstance().player.findPerk( PerkLib.BimboBrains ) >= 0 ) {
			EngineCore.outputText( '\n\n(<b>Perk Removed:  Bimbo Brains - Your intelligence and speech patterns are no longer limited to that of a bimbo.</b>)' );
			CoC.getInstance().player.removePerk( PerkLib.BimboBrains );
		} else if( CoC.getInstance().player.findPerk( PerkLib.FutaFaculties ) >= 0 ) {
			EngineCore.outputText( '\n\n(<b>Perk Removed:  Futa Faculties - Your intelligence and speech patterns are no longer limited to that of a futanari bimbo.</b>)' );
			CoC.getInstance().player.removePerk( PerkLib.FutaFaculties );
		}
		return (false);
	};
	DeBimbo.prototype.useText = function() {
		EngineCore.outputText( 'Well, time to see what this smelly, old rat was on about!  You pinch your nose and swallow the foul-tasting mixture with a grimace.  Oh, that\'s just <i>nasty!</i>  You drop the vial, which shatters on the ground, clutching at your head as a wave of nausea rolls over you.  Stumbling back against a rock for support, you close your eyes.  A constant, pounding ache throbs just behind your temples, and for once, you find yourself speechless.  A pained groan slips through your lips as thoughts and memories come rushing back.  One after another, threads of cognizant thought plow through the simple matrices of your bimbo mind, shredding and replacing them.' );
		EngineCore.outputText( '\n\nYou... you were an air-headed ditz!  A vacuous, idiot-girl with nothing between her ears but hunger for dick and pleasure!  You shudder as your faculties return, the pain diminishing with each passing moment.' );
	};
	return new Proxy( DeBimbo, {
		construct: function( target ) {
			return new Proxy( target, {
				get: function( target, name ) {
					if( name === 'description' ) {
						if( CoC.getInstance().player.findPerk( PerkLib.BimboBrains ) >= 0 || CoC.getInstance().player.findPerk( PerkLib.FutaFaculties ) >= 0 ) {
							return 'This should totally like, fix your brain and stuff.  You don\'t really think anything is wrong with your head - it feels all pink and giggly all the time.';
						} else {
							return 'This draft is concocted from five scholar\'s teas and who knows what else.  Supposedly it will correct the stupifying effects of Bimbo Liqueur.';
						}
					}
					return target[ name ];
				},
				set: function( target, name, value ) {
					target[ name ] = value;
				}
			} );
		}
	} );
} );