'use strict';

angular.module( 'cocjs' ).factory( 'ImpGang', function( CockTypesEnum, Monster ) {
	var ImpGang = angular.copy( Monster );
	ImpGang.prototype.getCapitalA = function() {
		return 'gang of imps';
	};
	ImpGang.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.removeStatuses();
		that.removePerks();
		that.removeCock( 0, that.cocks.length );
		that.removeVagina( 0, that.vaginas.length );
		that.removeBreastRow( 0, that.breastRows.length );
		that.createCock( 12, 1.5 );
		that.createCock( 25, 2.5 );
		that.createCock( 25, 2.5 );
		that.cocks[ 2 ].cockType = CockTypesEnum.DOG;
		that.cocks[ 2 ].knotMultiplier = 2;
		that.balls = 2;
		that.ballSize = 3;
		that.a = 'a mob of imps';
		that.short = 'imp gang';
		that.skinTone = 'imp mob';
	};
	return ImpGang;
} );