'use strict';

angular.module( 'cocjs' ).factory( 'Fists', function( CoC, Weapon ) {
	var Fists = angular.copy( Weapon );
	Fists.prototype.init = function( that ) {
		Weapon.prototype.init( that, [ 'Fists  ', 'Fists', 'fists', 'fists', 'punch', 0 ] );
	};
	Fists.prototype.useText = function() {
	}; //No text for equipping fists
	Fists.prototype.playerRemove = function() {
		return null;
	};
	return Fists;
} );