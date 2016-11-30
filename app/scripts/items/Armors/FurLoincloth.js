'use strict';

angular.module( 'cocjs' ).factory( 'FurLoincloth', function( Armor, CoC ) {
	var FurLoincloth = angular.copy( Armor );
	FurLoincloth.prototype.init = function( that ) {
		Armor.prototype.init( that, [ 'FurLoin', 'FurLoin', 'revealing fur loincloths', 'a front and back set of loincloths', 0, 100, 'A pair of loincloths to cover your crotch and butt.  Typically worn by people named \'Conan\'.', 'Light' ] );
	};
	return new Proxy( FurLoincloth, {
		construct: function( target ) {
			return new Proxy( target, {
				get: function( target, name ) {
					if( name === 'description' ) {
						return 'A pair of loincloths to cover your crotch and ' + CoC.getInstance().player.buttDescript() + '.  Typically worn by people named \'Conan\'.';
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