'use strict';

angular.module('cocjs').factory('CoC', function ( Appearance, CoC, Utils, CoC_Settings ) {
	var Descriptors = {};
	Descriptors.sackDescript = function() {
		return Appearance.sackDescript( CoC.getInstance().player );
	};
	Descriptors.cockClit = function( number ) {
		if(number === undefined) {
			number = 0;
		}
		if( CoC.getInstance().player.hasCock() && number >= 0 && number < CoC.getInstance().player.cockTotal() ) {
			return CoC.getInstance().player.cockDescript( number );
		} else {
			return this.clitDescript();
		}
	};
	Descriptors.chestDesc = function() {
		return CoC.getInstance().player.chestDesc();
	};
	Descriptors.tongueDescript = function() {
		return Appearance.tongueDescription( CoC.getInstance().player );
	};
	Descriptors.wingsDescript = function() {
		return Appearance.wingsDescript( CoC.getInstance().player );
	};
	Descriptors.tailDescript = function() {
		return Appearance.tailDescript( CoC.getInstance().player );
	};
	Descriptors.oneTailDescript = function() {
		return Appearance.oneTailDescript( CoC.getInstance().player );
	};
	Descriptors.ballsDescriptLight = function( forcedSize ) {
		if(forcedSize === undefined) {
			forcedSize = true;
		}
		return Appearance.ballsDescription( forcedSize, true, CoC.getInstance().player );
	};
	Descriptors.ballDescript = function() {
		return Appearance.ballsDescription( false, false, CoC.getInstance().player );
	};
	Descriptors.ballsDescript = function() {
		return Appearance.ballsDescription( false, true, CoC.getInstance().player, true );
	};
	Descriptors.simpleBallsDescript = function() {
		return Appearance.ballsDescription( false, true, CoC.getInstance().player );
	};
	Descriptors.assholeDescript = function() {
		return Appearance.assholeDescript( CoC.getInstance().player );
	};
	Descriptors.hipDescript = function() {
		return Appearance.hipDescription( CoC.getInstance().player );
	};
	Descriptors.buttDescript = function() {
		return Appearance.buttDescription( CoC.getInstance().player );
	};
	Descriptors.assDescript = Descriptors.buttDescript;
	Descriptors.nippleDescript = function( rowNum ) {
		return Appearance.nippleDescription( CoC.getInstance().player, rowNum );
	};
	Descriptors.hairDescript = function() {
		return Appearance.hairDescription( CoC.getInstance().player );
	};
	Descriptors.hairOrFur = function() {
		return Appearance.hairOrFur( CoC.getInstance().player );
	};
	Descriptors.clitDescript = function() {
		return Appearance.clitDescription( CoC.getInstance().player );
	};
	//Vaginas + Descript
	Descriptors.vaginaDescript = function( vaginaNum ) {
		if(vaginaNum === undefined) {
			vaginaNum = 0;
		}
		return Appearance.vaginaDescript( CoC.getInstance().player, vaginaNum );
	};
	//Allvagina descript
	Descriptors.allVaginaDescript = function() {
		if( CoC.getInstance().player.vaginas.length === 1 ) {
			return this.vaginaDescript( Utils.rand( CoC.getInstance().player.vaginas.length - 1 ) );
		}
		if( CoC.getInstance().player.vaginas.length > 1 ) {
			return this.vaginaDescript( Utils.rand( CoC.getInstance().player.vaginas.length - 1 ) ) + 's';
		}
		CoC_Settings.error( 'ERROR called with no vaginas.' );
		return 'ERROR called with no vaginas.';
	};
	Descriptors.cockDescript = CoC.getInstance().player.cockDescript;
	Descriptors.allBreastsDescript = function() {
		return Appearance.allBreastsDescript( CoC.getInstance().player );
	};
	Descriptors.breastDescript = CoC.getInstance().player.breastDescript;
	return Descriptors;
});