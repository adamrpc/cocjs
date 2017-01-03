'use strict';

angular.module( 'cocjs' ).run( function( MainView, CoC, StatusAffects, ConsumableLib, PerkLib, Utils, Useable, EngineCore ) {
	function LustStick() {
		this.init(this, arguments);
	}
	angular.extend(LustStick.prototype, Useable.prototype);
	LustStick.prototype.init = function( that ) {
		Useable.prototype.init( that, [ 'LustStk', 'LustStk', 'a tube of golden lipstick', 6, 'This tube of golden lipstick is used by harpies to keep males aroused.  It has aphrodisiac properties on anyone with male genitalia and is most effective when applied to the lips or groin.' ] );
		that.classNames.push('LustStick');
	};
	LustStick.prototype.canUse = function() {
		if( CoC.player.hasCock() && !CoC.player.findPerk( PerkLib.LuststickAdapted ) ) {
			MainView.outputText( 'You look at the tube of lipstick, but get the idea it would be a pretty bad idea to smear a thick coating of cock-hardening aphrodisiacs over your own lips.  ' );
			return false;
		}
		return true;
	};
	LustStick.prototype.useItem = function() {
		if( CoC.player.findStatusAffect( StatusAffects.LustStickApplied ) ) {
			CoC.player.addStatusValue( StatusAffects.LustStickApplied, 1, Utils.rand( 12 ) + 12 );
			MainView.outputText( 'You carefully open the sweet-smelling tube and smear the lipstick over the coat you already have on your lips.  <b>No doubt another layer will make it last even longer!</b>  ' );
			MainView.outputText( 'You finish and pucker your lips, feeling fairly sexy with your new, thicker makeup on.\n\n' );
		} else {
			CoC.player.createStatusAffect( StatusAffects.LustStickApplied, 24, 0, 0, 0 );
			MainView.outputText( 'You carefully open the sweet-smelling tube and smear the lipstick over your lips.  ' );
			if( CoC.player.hasCock() ) {
				MainView.outputText( 'It tingles a little, but the drugs have little to no effect on you now.' );
			} else {
				MainView.outputText( 'Honestly, it amazes you that something as little as a kiss can make a man putty in your hands.' );
			}
			MainView.outputText( '  You finish and pucker your lips, feeling fairly sexy with your new makeup on.\n\n' );
		}
		EngineCore.dynStats( 'lus', 1 );
		return (false);
	};
	ConsumableLib.registerConsumable( 'LUSTSTK', new LustStick() );
} );