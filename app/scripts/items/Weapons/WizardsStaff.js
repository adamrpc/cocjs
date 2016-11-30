'use strict';

angular.module( 'cocjs' ).factory( 'WizardsStaff', function( CoC, Weapon, PerkLib ) {
	var WizardsStaff = angular.copy( Weapon );
	WizardsStaff.prototype.init = function( that ) {
		Weapon.prototype.init( that, [ 'W.Staff', 'W. Staff', 'wizard\'s staff', 'a wizard\'s staff', 'smack', 3, 350, 'This staff is made of very old wood and seems to tingle to the touch.  The top has an odd zig-zag shape to it, and the wood is worn smooth from lots of use.  It probably belonged to a wizard at some point and would aid magic use. (ATK: 3)', 'Wizard\'s Focus' ] );
	};
	WizardsStaff.prototype._superPlayerEquip = WizardsStaff.prototype.playerEquip;
	WizardsStaff.prototype.playerEquip = function() {
		while( CoC.getInstance().player.findPerk( PerkLib.WizardsFocus ) >= 0 ) {
			CoC.getInstance().player.removePerk( PerkLib.WizardsFocus );
		}
		CoC.getInstance().player.createPerk( PerkLib.WizardsFocus, 0.4, 0, 0, 0 );
		return this._superPlayerEquip();
	};
	WizardsStaff.prototype._superPlayerRemove = WizardsStaff.prototype.playerRemove;
	WizardsStaff.prototype.playerRemove = function() {
		while( CoC.getInstance().player.findPerk( PerkLib.WizardsFocus ) >= 0 ) {
			CoC.getInstance().player.removePerk( PerkLib.WizardsFocus );
		}
		return this._superPlayerRemove();
	};
	return WizardsStaff;
} );