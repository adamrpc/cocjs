'use strict';

angular.module( 'cocjs' ).factory( 'ComfortableUnderclothes', function( Armor ) {
	function ComfortableUnderclothes() {
		this.init(this, arguments);
	}
	angular.extend(ComfortableUnderclothes.prototype, Armor.prototype);
	ComfortableUnderclothes.prototype.init = function( that ) {
		Armor.prototype.init( that, [ 'c.under', 'c.under', 'comfortable underclothes', 'comfortable underclothes', 0, 0, 'comfortable underclothes', '' ] );
		that.classNames.push('ComfortableUnderclothes');
	};
	ComfortableUnderclothes.prototype.playerRemove = function() {
		return null; //Player never picks up their underclothes
	};
	return ComfortableUnderclothes;
} );