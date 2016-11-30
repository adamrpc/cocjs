'use strict';

angular.module( 'cocjs' ).factory( 'WingStick', function( CoC, Utils, Consumable, EngineCore ) {
	var WingStick = angular.copy( Consumable );
	WingStick.prototype.init = function( that ) {
		Consumable.prototype.init( that, [ 'W.Stick', 'Wingstick', 'a wingstick', 16, 'A tri-bladed throwing weapon.  Though good for only a single use, it\'s guaranteed to do high damage if it hits.  (Cost) (DMG: 40-100)' ] );
	};
	WingStick.prototype.canUse = function() {
		if( CoC.getInstance().isInCombat() ) {
			return true;
		}
		EngineCore.outputText( 'There\'s no one to throw it at!' );
		return false;
	};
	WingStick.prototype.useItem = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You toss a wingstick at your foe!  It flies straight and true, almost as if it has a mind of its own as it arcs towards ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + '!\n' );
		if( CoC.getInstance().monster.spe - 80 > Utils.rand( 100 ) + 1 ) { //1% dodge for each point of speed over 80
			EngineCore.outputText( 'Somehow ' + CoC.getInstance().monster.a + CoC.getInstance().monster.short + '\'' );
			if( !CoC.getInstance().monster.plural ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ' incredible speed allows ' + CoC.getInstance().monster.pronoun2 + ' to avoid the spinning blades!  The deadly device shatters when it impacts something in the distance.' );
		} else {
			{ //Not dodged
			}
			var damage = 40 + Utils.rand( 61 );
			EngineCore.outputText( CoC.getInstance().monster.getCapitalA() + CoC.getInstance().monster.short + ' is hit with the wingstick!  It breaks apart as it lacerates ' + CoC.getInstance().monster.pronoun2 + '. (' + damage + ')' );
			CoC.getInstance().monster.HP -= damage;
			if( CoC.getInstance().monster.HP < 0 ) {
				CoC.getInstance().monster.HP = 0;
			}
		}
		return false;
	};
	return WingStick;
} );