'use strict';

angular.module( 'cocjs' ).factory( 'HugeWarhammer', function( CoC, Weapon, EngineCore ) {
	var HugeWarhammer = angular.copy( Weapon );
	HugeWarhammer.prototype.init = function( that ) {
		Weapon.prototype.init( that, [ 'Warhamr', 'Warhammer', 'huge warhammer', 'a huge warhammer', 'smash', 15, 1600, 'A huge war-hammer made almost entirely of steel that only the strongest warriors could use.  Requires 80 strength to use.  Getting hit with this might stun the victim.  (ATK) (Cost: 1600)', 'Large' ] );
	};
	HugeWarhammer.prototype.canUse = function() {
		if( CoC.getInstance().player.str >= 80 ) {
			return true;
		}
		EngineCore.outputText( 'You aren\'t strong enough to handle such a heavy weapon!  ' );
		return false;
	};
	return HugeWarhammer;
} );