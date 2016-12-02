'use strict';

angular.module( 'cocjs' ).factory( 'JeweledRapier', function( CoC, Weapon, kFLAGS ) {
	function JeweledRapier() {
		this.init(this, arguments);
	}
	angular.extend(JeweledRapier.prototype, Weapon.prototype);
	JeweledRapier.prototype.init = function( that ) {
		Weapon.prototype.init( that, [ 'JRapier', 'JRapier', 'jeweled rapier', 'a jeweled rapier', 'slash', 13, 1400, 'This jeweled rapier is ancient but untarnished.  The hilt is wonderfully made, and fits your hand like a tailored glove.  The blade is shiny and perfectly designed for stabbing.' ] );
	};
	return new Proxy( JeweledRapier, {
		construct: function( target ) {
			return new Proxy( target, {
				get: function( target, name ) {
					if( name === 'attack' ) {
						return (13 + CoC.flags[ kFLAGS.RAPHAEL_RAPIER_TRANING ] * 2);
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