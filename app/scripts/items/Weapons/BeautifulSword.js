'use strict';

angular.module( 'cocjs' ).factory( 'BeautifulSword', function( CoC, Weapon, EngineCore ) {
	function BeautifulSword() {
		this.init(this, arguments);
	}
	angular.extend(BeautifulSword.prototype, Weapon.prototype);
	BeautifulSword.prototype.init = function( that ) {
		Weapon.prototype.init( that, [ 'B.Sword', 'B.Sword', 'beautiful sword', 'a beautiful shining sword', 'slash', 7, 400, 'This beautiful sword shines brilliantly in the light, showing the flawless craftsmanship of its blade.  The pommel and guard are heavily decorated in gold and brass.  Some craftsman clearly poured his heart and soul into this blade.  (ATK) (Cost: 400)', 'holySword' ] );
	};
	BeautifulSword.prototype.canUse = function() {
		if( CoC.getInstance().player.cor < 35 ) {
			return true;
		}
		EngineCore.outputText( 'You grab hold of the handle of the sword only to have it grow burning hot.  You\'re forced to let it go lest you burn yourself.  Something within the sword must be displeased.  ' );
		return false;
	};
	return new Proxy( BeautifulSword, {
		construct: function( target ) {
			return new Proxy( target, {
				get: function( target, name ) {
					if( name === 'attack' ) {
						return 7 + Math.ceil( 10 - CoC.getInstance().player.cor / 3 );
					}
					return target[ name ];
				},
				set: function( target, name, value ) {
					target[ name ] = value;
				}
			} );
		}
	} );
} );