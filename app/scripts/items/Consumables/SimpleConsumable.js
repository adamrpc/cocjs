'use strict';

angular.module( 'cocjs' ).factory( 'SimpleConsumable', function( CoC, Consumable, EngineCore ) {
	function SimpleConsumable() {
		this.init(this, arguments);
	}
	angular.extend(SimpleConsumable.prototype, Consumable.prototype);
	SimpleConsumable.prototype.init = function( that, args ) {
		Consumable.prototype.init( that, [ args[ 0 ], args[ 1 ], args[ 2 ], args.length > 4 ? args[ 4 ] : 0, args.length > 5 ? args[ 5 ] : null ] );
		this.effect = args[ 3 ];
	};
	SimpleConsumable.prototype.useItem = function() {
		EngineCore.clearOutput();
		this.effect( CoC.getInstance().player );
		return false; //Any normal consumable does not have a sub-EngineCore.menu. Return false so that the inventory runs the itemDoNext function after useItem.
	};
	return SimpleConsumable;
} );