'use strict';

angular.module( 'cocjs' ).factory( 'LustStick', function( CoC, StatusAffects, ConsumableLib, PerkLib, Utils, Consumable, EngineCore ) {
	function LustStick() {
		this.init(this, arguments);
	}
	angular.extend(LustStick.prototype, Consumable.prototype);
	LustStick.prototype.init = function( that ) {
		Consumable.prototype.init( that, [ 'LustStk', 'LustStk', 'a tube of golden lipstick', ConsumableLib.DEFAULT_VALUE, 'This tube of golden lipstick is used by harpies to keep males aroused.  It has aphrodisiac properties on anyone with male genitalia and is most effective when applied to the lips or groin.' ] );
		that.classNames.push('LustStick');
	};
	LustStick.prototype.canUse = function() {
		if( CoC.player.hasCock() && CoC.player.findPerk( PerkLib.LuststickAdapted ) < 0 ) {
			EngineCore.outputText( 'You look at the tube of lipstick, but get the idea it would be a pretty bad idea to smear a thick coating of cock-hardening aphrodisiacs over your own lips.  ' );
			return false;
		}
		return true;
	};
	LustStick.prototype.useItem = function() {
		if( CoC.player.findStatusAffect( StatusAffects.LustStickApplied ) >= 0 ) {
			CoC.player.addStatusValue( StatusAffects.LustStickApplied, 1, Utils.rand( 12 ) + 12 );
			EngineCore.outputText( 'You carefully open the sweet-smelling tube and smear the lipstick over the coat you already have on your lips.  <b>No doubt another layer will make it last even longer!</b>  ' );
			EngineCore.outputText( 'You finish and pucker your lips, feeling fairly sexy with your new, thicker makeup on.\n\n' );
		} else {
			CoC.player.createStatusAffect( StatusAffects.LustStickApplied, 24, 0, 0, 0 );
			EngineCore.outputText( 'You carefully open the sweet-smelling tube and smear the lipstick over your lips.  ' );
			if( CoC.player.hasCock() ) {
				EngineCore.outputText( 'It tingles a little, but the drugs have little to no effect on you now.' );
			} else {
				EngineCore.outputText( 'Honestly, it amazes you that something as little as a kiss can make a man putty in your hands.' );
			}
			EngineCore.outputText( '  You finish and pucker your lips, feeling fairly sexy with your new makeup on.\n\n' );
		}
		EngineCore.dynStats( 'lus', 1 );
		return (false);
	};
	return LustStick;
} );