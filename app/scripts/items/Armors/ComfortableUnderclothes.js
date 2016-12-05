'use strict';

angular.module( 'cocjs' ).run( function( Armor, ArmorLib ) {
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
	ArmorLib.registerArmor( 'COMFORTABLE_UNDERCLOTHES', new ComfortableUnderclothes() );
} );