'use strict';

angular.module( 'cocjs' ).run( function( ArmorWithPerk, ArmorLib, PerkLib ) {
	function SkimpyNurseOutfit() {
		this.init(this, arguments);
	}
	angular.extend(SkimpyNurseOutfit.prototype, ArmorWithPerk.prototype);
	SkimpyNurseOutfit.prototype.init = function( that ) {
		ArmorWithPerk.prototype.init( that, [ 'NurseCl','NurseCl','skimpy nurse\'s outfit','a nurse\'s outfit',0,800,'This borderline obscene nurse\'s outfit would barely cover your hips and crotch.  The midriff is totally exposed, and the white top leaves plenty of room for cleavage.  A tiny white hat tops off the whole ensemble.','Light', PerkLib.SluttySeduction,8,0,0,0,'Your fetishy nurse outfit allows you access to an improved form of \'Tease\'.' ] );
		that.classNames.push('SkimpyNurseOutfit');
	};
	SkimpyNurseOutfit.prototype.getHealingPercent = function() {
		return 2;
	};
	ArmorLib.registerArmor( 'NURSECL', new SkimpyNurseOutfit() );
} );