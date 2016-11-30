'use strict';

angular.module( 'cocjs' ).factory( 'ComfortableUnderclothes', function( Armor ) {
	var ComfortableUnderclothes = angular.copy( Armor );
	ComfortableUnderclothes.prototype.init = function( that ) {
		Armor.prototype.init( that, [ 'c.under', 'c.under', 'comfortable underclothes', 'comfortable underclothes', 0, 0, 'comfortable underclothes', '' ] );
	};
	ComfortableUnderclothes.prototype.playerRemove = function() {
		return null; //Player never picks up their underclothes
	};
	return ComfortableUnderclothes;
} );