'use strict';

angular.module( 'cocjs' ).run( function( MainView, ConsumableLib, CoC, Utils, Useable, EngineCore ) {
	function WingStick() {
		this.init(this, arguments);
	}
	angular.extend(WingStick.prototype, Useable.prototype);
	WingStick.prototype.init = function( that ) {
		Useable.prototype.init( that, [ 'W.Stick', 'Wingstick', 'a wingstick', 16, 'A tri-bladed throwing weapon.  Though good for only a single use, it\'s guaranteed to do high damage if it hits.  (Cost) (DMG: 40-100)' ] );
		that.classNames.push('WingStick');
	};
	WingStick.prototype.canUse = function() {
		if( CoC.isInCombat() ) {
			return true;
		}
		EngineCore.outputText( 'There\'s no one to throw it at!' );
		return false;
	};
	WingStick.prototype.useItem = function() {
		MainView.clearOutput();
		EngineCore.outputText( 'You toss a wingstick at your foe!  It flies straight and true, almost as if it has a mind of its own as it arcs towards ' + CoC.monster.a + CoC.monster.short + '!\n' );
		if( CoC.monster.spe - 80 > Utils.rand( 100 ) + 1 ) { //1% dodge for each point of speed over 80
			EngineCore.outputText( 'Somehow ' + CoC.monster.a + CoC.monster.short + '\'' );
			if( !CoC.monster.plural ) {
				EngineCore.outputText( 's' );
			}
			EngineCore.outputText( ' incredible speed allows ' + CoC.monster.pronoun2 + ' to avoid the spinning blades!  The deadly device shatters when it impacts something in the distance.' );
		} else {
			{ //Not dodged
			}
			var damage = 40 + Utils.rand( 61 );
			EngineCore.outputText( CoC.monster.getCapitalA() + CoC.monster.short + ' is hit with the wingstick!  It breaks apart as it lacerates ' + CoC.monster.pronoun2 + '. (' + damage + ')' );
			CoC.monster.HP -= damage;
			if( CoC.monster.HP < 0 ) {
				CoC.monster.HP = 0;
			}
		}
		return false;
	};
	ConsumableLib.registerConsumable( 'W_STICK', new WingStick() );
} );