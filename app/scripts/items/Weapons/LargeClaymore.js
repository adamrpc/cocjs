'use strict';

angular.module( 'cocjs' ).factory( 'LargeClaymore', function( CoC, Weapon, EngineCore ) {
	function LargeClaymore() {
		this.init(this, arguments);
	}
	angular.extend(LargeClaymore.prototype, Weapon.prototype);
	LargeClaymore.prototype.init = function( that ) {
		Weapon.prototype.init( that, [ 'Claymor', 'L.Claymore', 'large claymore', 'a large claymore', 'cleaving sword-slash', 15, 1000, 'A massive sword that a very strong warrior might use.  Requires 40 strength to use.  (ATK) (Cost: 1000)', 'Large' ] );
	};
	LargeClaymore.prototype.canUse = function() {
		if( CoC.getInstance().player.str >= 40 ) {
			return true;
		}
		EngineCore.outputText( 'You aren\'t strong enough to handle such a heavy weapon!  ' );
		return false;
	};
	return LargeClaymore;
} );