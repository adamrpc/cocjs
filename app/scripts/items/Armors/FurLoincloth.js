'use strict';

angular.module( 'cocjs' ).factory( 'FurLoincloth', function( Armor, CoC ) {
	function FurLoincloth() {
		this.init(this, arguments);
	}
	angular.extend(FurLoincloth.prototype, Armor.prototype);
	FurLoincloth.prototype.init = function( that ) {
		Armor.prototype.init( that, [ 'FurLoin', 'FurLoin', 'revealing fur loincloths', 'a front and back set of loincloths', 0, 100, 'A pair of loincloths to cover your crotch and butt.  Typically worn by people named \'Conan\'.', 'Light' ] );
		that.classNames.push('FurLoincloth');
	};
	return new Proxy( FurLoincloth, {
		construct: function( Target ) {
			return new Proxy( new Target(), {
				get: function( target, name ) {
					if(_.has(target.prototype, name)) {
						return target.prototype[name];
					}
					if( name === 'description' ) {
						return 'A pair of loincloths to cover your crotch and ' + CoC.player.buttDescript() + '.  Typically worn by people named \'Conan\'.';
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
} );