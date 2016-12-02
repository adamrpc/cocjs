'use strict';

angular.module('cocjs').factory('Descriptors', function ( Appearance, CoC, Utils, CoC_Settings ) {
	var Descriptors = {};
	Descriptors.sackDescript = function() {
		return Appearance.sackDescript( CoC.player );
	};
	Descriptors.cockClit = function( number ) {
		if(number === undefined) {
			number = 0;
		}
		if( CoC.player.hasCock() && number >= 0 && number < CoC.player.cockTotal() ) {
			return CoC.player.cockDescript( number );
		} else {
			return Descriptors.clitDescript();
		}
	};
	Descriptors.chestDesc = function() {
		return CoC.player.chestDesc();
	};
	Descriptors.tongueDescript = function() {
		return Appearance.tongueDescription( CoC.player );
	};
	Descriptors.wingsDescript = function() {
		return Appearance.wingsDescript( CoC.player );
	};
	Descriptors.tailDescript = function() {
		return Appearance.tailDescript( CoC.player );
	};
	Descriptors.oneTailDescript = function() {
		return Appearance.oneTailDescript( CoC.player );
	};
	Descriptors.ballsDescriptLight = function( forcedSize ) {
		if(forcedSize === undefined) {
			forcedSize = true;
		}
		return Appearance.ballsDescription( forcedSize, true, CoC.player );
	};
	Descriptors.ballDescript = function() {
		return Appearance.ballsDescription( false, false, CoC.player );
	};
	Descriptors.ballsDescript = function() {
		return Appearance.ballsDescription( false, true, CoC.player, true );
	};
	Descriptors.simpleBallsDescript = function() {
		return Appearance.ballsDescription( false, true, CoC.player );
	};
	Descriptors.assholeDescript = function() {
		return Appearance.assholeDescript( CoC.player );
	};
	Descriptors.hipDescript = function() {
		return Appearance.hipDescription( CoC.player );
	};
	Descriptors.buttDescript = function() {
		return Appearance.buttDescription( CoC.player );
	};
	Descriptors.assDescript = Descriptors.buttDescript;
	Descriptors.nippleDescript = function( rowNum ) {
		return Appearance.nippleDescription( CoC.player, rowNum );
	};
	Descriptors.hairDescript = function() {
		return Appearance.hairDescription( CoC.player );
	};
	Descriptors.hairOrFur = function() {
		return Appearance.hairOrFur( CoC.player );
	};
	Descriptors.clitDescript = function() {
		return Appearance.clitDescription( CoC.player );
	};
	//Vaginas + Descript
	Descriptors.vaginaDescript = function( vaginaNum ) {
		if(vaginaNum === undefined) {
			vaginaNum = 0;
		}
		return Appearance.vaginaDescript( CoC.player, vaginaNum );
	};
	//Allvagina descript
	Descriptors.allVaginaDescript = function() {
		if( CoC.player.vaginas.length === 1 ) {
			return Descriptors.vaginaDescript( Utils.rand( CoC.player.vaginas.length - 1 ) );
		}
		if( CoC.player.vaginas.length > 1 ) {
			return Descriptors.vaginaDescript( Utils.rand( CoC.player.vaginas.length - 1 ) ) + 's';
		}
		CoC_Settings.error( 'ERROR called with no vaginas.' );
		return 'ERROR called with no vaginas.';
	};
	Descriptors.cockDescript = CoC.player.cockDescript;
	Descriptors.allBreastsDescript = function() {
		return Appearance.allBreastsDescript( CoC.player );
	};
	Descriptors.breastDescript = CoC.player.breastDescript;
	return Descriptors;
});