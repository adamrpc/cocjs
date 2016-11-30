'use strict';

angular.module( 'cocjs' ).factory( 'ComfortableClothes', function( Armor, CoC ) {
	var ComfortableClothes = angular.copy( Armor );
	ComfortableClothes.prototype.ComfortableClothes = function( that ) {
		Armor.prototype.init( that, ['C.Cloth', 'C.Cloth', 'comfortable clothes', 'a set of comfortable clothes', 0, 0, 'These loose fitting and comfortable clothes allow you to move freely while protecting you from the elements.  (DEF) (Cost: 0)', 'Light', true] );
	};
	ComfortableClothes.prototype.supportsBulge = function() {
		return CoC.getInstance().player.modArmorName !== 'crotch-hugging clothes';
	};

	return ComfortableClothes;
} );