'use strict';

angular.module( 'cocjs' ).factory( 'EldritchStaff', function( CoC, Weapon, WeaponLib, PerkLib ) {
	var EldritchStaff = angular.copy( Weapon );
	EldritchStaff.prototype.init = function( that ) {
		Weapon.prototype.init( that, [ 'E.Staff', 'E.Staff', 'eldritch staff', 'an eldritch staff', 'thwack', 10, WeaponLib.DEFAULT_VALUE, 'This eldritch staff once belonged to the Harpy Queen, who was killed after her defeat at your hands.  It fairly sizzles with magical power.', 'Wizard\'s Focus' ] );
	};
	EldritchStaff.prototype._superPlayerEquip = EldritchStaff.prototype.playerEquip;
	EldritchStaff.prototype.playerEquip = function() {
		while( CoC.getInstance().player.findPerk( PerkLib.WizardsFocus ) >= 0 ) {
			CoC.getInstance().player.removePerk( PerkLib.WizardsFocus );
		}
		CoC.getInstance().player.createPerk( PerkLib.WizardsFocus, 0.6, 0, 0, 0 );
		return this._superPlayerEquip();
	};
	EldritchStaff.prototype._superPlayerRemove = EldritchStaff.prototype.playerRemove;
	EldritchStaff.prototype.playerRemove = function() {
		while( CoC.getInstance().player.findPerk( PerkLib.WizardsFocus ) >= 0 ) {
			CoC.getInstance().player.removePerk( PerkLib.WizardsFocus );
		}
		return this._superPlayerRemove();
	};
	return EldritchStaff;
} );