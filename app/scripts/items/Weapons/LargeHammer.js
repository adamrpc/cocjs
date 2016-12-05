'use strict';

angular.module( 'cocjs' ).factory( 'LargeHammer', function( CoC, Weapon, EngineCore ) {
	function LargeHammer() {
		this.init(this, arguments);
	}
	angular.extend(LargeHammer.prototype, Weapon.prototype);
	LargeHammer.prototype.init = function( that ) {
		Weapon.prototype.init( that, [ 'L.Hammr', 'L.Hammr', 'large hammer', 'Marble\'s large hammer', 'smash', 16, 90, 'This two-handed warhammer looks pretty devastating.  You took it from Marble after she refused your advances.', 'Large' ] );
		that.classNames.push('LargeHammer');
	};
	LargeHammer.prototype.canUse = function() {
		if( CoC.player.tallness >= 60 ) {
			return true;
		}
		EngineCore.outputText( 'This hammer is too large for you to wield effectively.  ' );
		return false;
	};
	return LargeHammer;
} );