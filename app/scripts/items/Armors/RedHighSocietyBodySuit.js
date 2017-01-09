'use strict';

angular.module( 'cocjs' ).run( function( Armor, ArmorLib ) {
	function RedHighSocietyBodySuit() {
		this.init(this, arguments);
	}
	angular.extend(RedHighSocietyBodySuit.prototype, Armor.prototype);
	RedHighSocietyBodySuit.prototype.init = function( that ) {
		Armor.prototype.init( that, [ 'R.BdySt','R.BdySt','red, high-society bodysuit','a red bodysuit for high society',1,1200,'A high society bodysuit. It is as easy to mistake it for ballroom apparel as it is for boudoir lingerie. The thin transparent fabric is so light and airy that it makes avoiding blows a second nature.','Light', true ] );
		that.classNames.push('RedHighSocietyBodySuit');
	};
	RedHighSocietyBodySuit.prototype.makeMisdirect = function() {
		return true;
	};
	ArmorLib.registerArmor( 'R_BDYST', new RedHighSocietyBodySuit() );
} );