'use strict';

angular.module( 'cocjs' ).factory( 'LeatherArmorSegments', function( Armor, EngineCore, ArmorLib ) {
	function LeatherArmorSegments() {
		this.init(this, arguments);
	}
	angular.extend(LeatherArmorSegments.prototype, Armor.prototype);
	LeatherArmorSegments.prototype.init = function( that ) {
		Armor.prototype.init( that, [ 'UrtaLta', 'UrtaLta', 'leather armor segments', 'leather armor segments', 5, 76, null, 'Light', true ] );
	};
	LeatherArmorSegments.prototype.removeText = function() {
		EngineCore.outputText( 'You have your old set of ' + ArmorLib.LEATHRA.longName + ' left over.  ' );
	};
	LeatherArmorSegments.prototype._superPlayerRemove = LeatherArmorSegments.prototype.playerRemove;
	LeatherArmorSegments.prototype.playerRemove = function() {
		this._superPlayerRemove();
		return ArmorLib.LEATHRA;
	};
	return LeatherArmorSegments;
} );