'use strict';

angular.module( 'cocjs' ).run( function( WeaponLib, CoC, Weapon, PerkLib ) {
	function Spellblade() {
		this.init(this, arguments);
	}
	angular.extend(Spellblade.prototype, Weapon.prototype);
	Spellblade.prototype.init = function( that ) {
		Weapon.prototype.init( that, [ 'S.Blade', 'S.Blade', 'inscribed spellblade', 'a spellblade', 'slash', 8, 500, 'Forged not by a swordsmith but a sorceress, this arcane-infused blade amplifies your magic.  Unlike the wizard staves it is based on, this weapon also has a sharp edge, a technological innovation which has proven historically useful in battle.', 'Wizard\'s Focus' ] );
		that.classNames.push('Spellblade');
	};
	Spellblade.prototype._superPlayerEquip = Spellblade.prototype.playerEquip;
	Spellblade.prototype.playerEquip = function() {
		while( CoC.player.findPerk( PerkLib.WizardsFocus ) ) {
			CoC.player.removePerk( PerkLib.WizardsFocus );
		}
		CoC.player.createPerk( PerkLib.WizardsFocus, 0.5, 0, 0, 0 );
		return this._superPlayerEquip();
	};
	Spellblade.prototype._superPlayerRemove = Spellblade.prototype.playerRemove;
	Spellblade.prototype.playerRemove = function() {
		while( CoC.player.findPerk( PerkLib.WizardsFocus ) ) {
			CoC.player.removePerk( PerkLib.WizardsFocus );
		}
		return this._superPlayerRemove();
	};
	WeaponLib.registerWeapon( 'S_BLADE', new Spellblade() );
} );