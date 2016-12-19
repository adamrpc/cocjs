'use strict';

angular.module( 'cocjs' ).run( function( WeaponLib, MainView, CoC, Weapon ) {
	function HugeWarhammer() {
		this.init(this, arguments);
	}
	angular.extend(HugeWarhammer.prototype, Weapon.prototype);
	HugeWarhammer.prototype.init = function( that ) {
		Weapon.prototype.init( that, [ 'Warhamr', 'Warhammer', 'huge warhammer', 'a huge warhammer', 'smash', 15, 1600, 'A huge war-hammer made almost entirely of steel that only the strongest warriors could use.  Requires 80 strength to use.  Getting hit with this might stun the victim.  (ATK) (Cost: 1600)', 'Large' ] );
		that.classNames.push('HugeWarhammer');
	};
	HugeWarhammer.prototype.canUse = function() {
		if( CoC.player.str >= 80 ) {
			return true;
		}
		MainView.outputText( 'You aren\'t strong enough to handle such a heavy weapon!  ' );
		return false;
	};
	WeaponLib.registerWeapon( 'WARHAMR', new HugeWarhammer() );
} );