'use strict';

angular.module('cocjs').factory('SceneLib', function () {
	var scenes = {};
	function SceneLib() {}
	SceneLib.prototype.registerScene = function(name, scene) {
		scenes[name] = scene;
	};
	var SceneLibProxy = new Proxy( SceneLib, {
		construct: function( Target ) {
			return new Proxy( new Target(), {
				get: function( target, name ) {
					if(_.has(target.prototype, name)) {
						return target.prototype[name];
					}
					if(_.has(scenes, name) ) {
						return scenes[ name ];
					}
					return target[ name ];
				},
				set: function() {
					return true;
				}
			} );
		}
	} );
	return new SceneLibProxy();
});
