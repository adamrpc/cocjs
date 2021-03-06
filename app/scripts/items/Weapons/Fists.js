'use strict';

angular.module( 'cocjs' ).run( function( WeaponLib, CoC, Weapon ) {
	function Fists() {
		this.init(this, arguments);
	}
	angular.extend(Fists.prototype, Weapon.prototype);
	Fists.prototype.init = function( that ) {
		Weapon.prototype.init( that, [ 'Fists  ', 'Fists', 'fists', 'fists', 'punch', 0 ] );
		that.classNames.push('Fists');
	};
	Fists.prototype.useText = function() {
	}; //No text for equipping fists
	Fists.prototype.playerRemove = function() {
		return null;
	};
	WeaponLib.registerWeapon( 'FISTS', new Fists() );
} );