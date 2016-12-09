'use strict';

angular.module('cocjs').factory('UseableLib', function (SimpleUseable) {
	var useables = {};
	function UseableLib() {}
	UseableLib.prototype.registerUseable = function(name, useable) {
		useables[name] = useable;
	};
	var UseableLibProxy = new Proxy( UseableLib, {
		construct: function( Target ) {
			return new Proxy( new Target(), {
				get: function( target, name ) {
					if(_.has(target.prototype, name)) {
						return target.prototype[name];
					}
					if(_.has(useables, name) ) {
						return useables[ name ];
					}
					return target[ name ];
				},
				set: function() {
					return true;
				}
			} );
		}
	} );
	var instance = new UseableLibProxy();
	
	instance.registerUseable( 'B_CHITN', new SimpleUseable('B.Chitn', 'B.Chitn', 'a large shard of chitinous plating', 6, 'A perfect piece of black chitin from a bee-girl.  It still has some fuzz on it.', 'You look over the scale carefully but cannot find a use for it.  Maybe someone else will know how to use it.') );
	instance.registerUseable( 'GREENGL', new SimpleUseable('GreenGl', 'GreenGl', 'a clump of green gel', 6, 'This tough substance has no obvious use that you can discern.', 'You examine the gel thoroughly, noting it is tough and resiliant, yet extremely pliable.  Somehow you know eating it would not be a good idea.') );
	instance.registerUseable( 'T_SSILK', new SimpleUseable('T.SSilk', 'T.SSilk', 'a bundle of tough spider-silk', 6, 'This bundle of fibrous silk is incredibly tough and strong, though somehow not sticky in the slightest.  You have no idea how to work these tough little strands into anything usable.  Perhaps one of this land\'s natives might have an idea?', 'You look over the tough webbing, confusion evident in your expression.  There\'s really nothing practical you can do with these yourself.  It might be best to find someone more familiar with the odd materials in this land to see if they can make sense of it.') );
	
	return instance;
});
