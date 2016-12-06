'use strict';

angular.module( 'cocjs' ).run( function( WeaponLib, CoC, Weapon, kFLAGS ) {
	function RaphaelsRapier() {
		this.init(this, arguments);
	}
	angular.extend(RaphaelsRapier.prototype, Weapon.prototype);
	RaphaelsRapier.prototype.init = function( that ) {
		Weapon.prototype.init( that, [ 'RRapier', 'RRapier', 'vulpine rapier', 'Raphael\'s vulpine rapier', 'slash', 8, 1000, 'He\'s bound it with his red sash around the length like a ribbon, as though he has now gifted it to you.  Perhaps it is his way of congratulating you.' ] );
		that.classNames.push('RaphaelsRapier');
	};
	var RaphaelsRapierProxy = new Proxy( RaphaelsRapier, {
		construct: function( target ) {
			return new Proxy( new target(), {
				get: function( target, name ) {
					if(_.has(target.prototype, name)) {
						return target.prototype[name];
					}
					if( name === 'attack' ) {
						return 8 + CoC.flags[ kFLAGS.RAPHAEL_RAPIER_TRANING ] * 2;
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
	WeaponLib.registerWeapon( 'RRAPIER', new RaphaelsRapierProxy() );
} );