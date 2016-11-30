'use strict';

angular.module( 'cocjs' ).factory( 'SimpleUseable', function( Useable, EngineCore ) {
	var SimpleUseable = angular.copy( Useable );
	SimpleUseable.prototype.init = function( that, args ) {
		Useable.prototype.init( that, args );
		this.canUseFunction = args.length > 6 ? args[ 6 ] : null;
		this.canUseText = args[ 5 ];
	};
	SimpleUseable.prototype.canUse = function() {
		EngineCore.clearOutput();
		if( this.canUseFunction !== null ) {
			this.canUseFunction();
		} else {
			EngineCore.outputText( this.canUseText );
		}
		return false;
	};
	return SimpleUseable;
} );