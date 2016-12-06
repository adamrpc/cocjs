'use strict';

angular.module('cocjs').factory('Perk', function () {
	function Perk() {
		this.init(this, arguments);
	}
	Perk.prototype.init = function(that, args) {
		that.ptype = args.length > 0 ? args[0] : '';
		that.value1 = args.length > 1 ? args[1] : 0;
		that.value2 = args.length > 2 ? args[2] : 0;
		that.value3 = args.length > 3 ? args[3] : 0;
		that.value4 = args.length > 4 ? args[4] : 0;
	};
	return new Proxy( Perk, {
		construct: function( target ) {
			return new Proxy( new target(), {
				get: function( target, name ) {
					if(_.has(target.prototype, name)) {
						return target.prototype[name];
					}
					if( name === 'perkName' ) {
						return target.ptype.name;
					}
					if( name === 'perkDesc' ) {
						return target.ptype.desc(target);
					}
					if( name === 'perkLongDesc' ) {
						return target.ptype.longDesc;
					}
					return target[ name ];
				},
				set: function( target, name, value ) {
					if( name === 'perkName' || name === 'perkDesc' || name === 'perkLongDesc' ) {
						return true;
					}
					target[ name ] = value;
					return true;
				}
			} );
		}
	} );
});