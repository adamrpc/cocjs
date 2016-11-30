'use strict';

angular.module( 'cocjs' ).factory( 'ChainedDrop', function( CoC_Settings ) {
	function ChainedDrop( defaultItem ) {
		this.items = [];
		this.probs = [];
		this.defaultItem = defaultItem;
	}

	ChainedDrop.prototype.add = function( item, prob ) {
		if( prob < 0 || prob > 1 ) {
			CoC_Settings.error( 'Invalid probability value ' + prob );
		}
		this.items.push( item );
		this.probs.push( prob );
		return this;
	};
	ChainedDrop.prototype.elseDrop = function( item ) {
		this.defaultItem = item;
		return this;
	};
	ChainedDrop.prototype.roll = function() {
		for( var i = 0; i < this.items.length; i++ ) {
			if( Math.random() < this.probs[ i ] ) {
				return this.items[ i ];
			}
		}
		return this.defaultItem;
	};
	return ChainedDrop;
} );