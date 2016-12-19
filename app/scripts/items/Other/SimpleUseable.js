'use strict';

angular.module( 'cocjs' ).factory( 'SimpleUseable', function( Useable, MainView ) {
	function SimpleUseable() {
		this.init(this, arguments);
	}
	angular.extend(SimpleUseable.prototype, Useable.prototype);
	SimpleUseable.prototype.init = function( that, args ) {
		Useable.prototype.init( that, args );
		that.classNames.push('SimpleUseable');
		that.canUseFunction = args.length > 6 ? args[ 6 ] : null;
		that.canUseText = args[ 5 ];
	};
	SimpleUseable.prototype.canUse = function() {
		MainView.clearOutput();
		if( this.canUseFunction !== null ) {
			this.canUseFunction();
		} else {
			MainView.outputText( this.canUseText );
		}
		return false;
	};
	return SimpleUseable;
} );