'use strict';

angular.module( 'cocjs' ).factory( 'WeightedDrop', function( ) {
	function WeightedDrop( first, firstWeight ) {
		this.items = [];
		this.sum = 0;
		if( first !== null ) {
			if( firstWeight === undefined ) {
				firstWeight = 0;
			}
			this.items.push( [ first, firstWeight ] );
			this.sum += firstWeight;
		}
	}

	WeightedDrop.prototype.add = function( item, weight ) {
		if( weight === undefined ) {
			weight = 1;
		}
		this.items.push( [ item, weight ] );
		this.sum += weight;
		return this;
	};
	WeightedDrop.prototype.addMany = function() {
		var weight = arguments[ 0 ];
		var that = this;
		_.forEach( _.drop( arguments ), function( item ) {
			that.items.push( [ item, weight ] );
			that.sum += weight;
		} );
		return this;
	};
	// you can pass your own random value from 0 to 1 (so you can use your own RNG);
	WeightedDrop.prototype.roll = function() {
		var random = Math.random() * this.sum;
		var item = null;
		while( random > 0 && this.items.length > 0 ) {
			var pair = this.items.shift();
			item = pair[ 0 ];
			random -= pair[ 1 ];
		}
		return item;
	};
	WeightedDrop.prototype.clone = function() {
		var other = new WeightedDrop();
		other.items = this.items.slice();
		other.sum = this.sum;
		return other;
	};
	return WeightedDrop;
} );