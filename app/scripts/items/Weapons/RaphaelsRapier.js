'use strict';

angular.module( 'cocjs' ).factory( 'RaphaelsRapier', function( CoC, Weapon, kFLAGS ) {
	var RaphaelsRapier = angular.copy( Weapon );
	RaphaelsRapier.prototype.init = function( that ) {
		Weapon.prototype.init( that, [ 'RRapier', 'RRapier', 'vulpine rapier', 'Raphael\'s vulpine rapier', 'slash', 8, 1000, 'He\'s bound it with his red sash around the length like a ribbon, as though he has now gifted it to you.  Perhaps it is his way of congratulating you.' ] );
	};
	return new Proxy( RaphaelsRapier, {
		construct: function( target ) {
			return new Proxy( target, {
				get: function( target, name ) {
					if( name === 'attack' ) {
						return 8 + CoC.getInstance().flags[ kFLAGS.RAPHAEL_RAPIER_TRANING ] * 2;
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