'use strict';

angular.module( 'cocjs' ).run( function( Armor, ArmorLib, CoC ) {
	function ComfortableClothes() {
		this.init(this, arguments);
	}
	angular.extend(ComfortableClothes.prototype, Armor.prototype);
	ComfortableClothes.prototype.init = function( that ) {
		Armor.prototype.init( that, ['C.Cloth', 'C.Cloth', 'comfortable clothes', 'a set of comfortable clothes', 0, 0, 'These loose fitting and comfortable clothes allow you to move freely while protecting you from the elements.  (DEF) (Cost: 0)', 'Light', true] );
		that.classNames.push('ComfortableClothes');
	};
	ComfortableClothes.prototype.supportsBulge = function() {
		return CoC.player.modArmorName !== 'crotch-hugging clothes';
	};
	ArmorLib.registerArmor( 'C_CLOTH', new ComfortableClothes() );
} );