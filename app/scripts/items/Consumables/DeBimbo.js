'use strict';

angular.module( 'cocjs' ).run( function( MainView, ConsumableLib, CoC, Useable, PerkLib ) {
	function DeBimbo() {
		this.init(this, arguments);
	}
	angular.extend(DeBimbo.prototype, Useable.prototype);
	DeBimbo.prototype.init = function( that ) {
		Useable.prototype.init( that, [ 'Debimbo', 'Debimbo', 'a bottle marked as \'Debimbo\'', 250 ] );
		that.classNames.push('DeBimbo');
	};
	DeBimbo.prototype.canUse = function() {
		if( CoC.player.findPerk( PerkLib.BimboBrains ) >= 0 || CoC.player.findPerk( PerkLib.FutaFaculties ) >= 0 ) {
			return true;
		}
		MainView.outputText( 'You can\'t use this right now, and it\'s too expensive to waste!\n\n' );
		return false;
	};
	DeBimbo.prototype.useItem = function() {
		if( CoC.player.findPerk( PerkLib.BimboBrains ) >= 0 ) {
			MainView.outputText( '\n\n(<b>Perk Removed:  Bimbo Brains - Your intelligence and speech patterns are no longer limited to that of a bimbo.</b>)' );
			CoC.player.removePerk( PerkLib.BimboBrains );
		} else if( CoC.player.findPerk( PerkLib.FutaFaculties ) >= 0 ) {
			MainView.outputText( '\n\n(<b>Perk Removed:  Futa Faculties - Your intelligence and speech patterns are no longer limited to that of a futanari bimbo.</b>)' );
			CoC.player.removePerk( PerkLib.FutaFaculties );
		}
		return (false);
	};
	DeBimbo.prototype.useText = function() {
		MainView.outputText( 'Well, time to see what this smelly, old rat was on about!  You pinch your nose and swallow the foul-tasting mixture with a grimace.  Oh, that\'s just <i>nasty!</i>  You drop the vial, which shatters on the ground, clutching at your head as a wave of nausea rolls over you.  Stumbling back against a rock for support, you close your eyes.  A constant, pounding ache throbs just behind your temples, and for once, you find yourself speechless.  A pained groan slips through your lips as thoughts and memories come rushing back.  One after another, threads of cognizant thought plow through the simple matrices of your bimbo mind, shredding and replacing them.' );
		MainView.outputText( '\n\nYou... you were an air-headed ditz!  A vacuous, idiot-girl with nothing between her ears but hunger for dick and pleasure!  You shudder as your faculties return, the pain diminishing with each passing moment.' );
	};
	var DeBimboProxy = new Proxy( DeBimbo, {
		construct: function( Target ) {
			return new Proxy( new Target(), {
				get: function( target, name ) {
					if(_.has(target.prototype, name)) {
						return target.prototype[name];
					}
					if( name === 'description' ) {
						if( CoC.player.findPerk( PerkLib.BimboBrains ) >= 0 || CoC.player.findPerk( PerkLib.FutaFaculties ) >= 0 ) {
							return 'This should totally like, fix your brain and stuff.  You don\'t really think anything is wrong with your head - it feels all pink and giggly all the time.';
						} else {
							return 'This draft is concocted from five scholar\'s teas and who knows what else.  Supposedly it will correct the stupifying effects of Bimbo Liqueur.';
						}
					}
					return target[ name ];
				},
				set: function( target, name, value ) {
					target[ name ] = value;
					return true;
				}
			} );
		}
	} );
	ConsumableLib.registerConsumable( 'DEBIMBO', new DeBimboProxy() );
} );