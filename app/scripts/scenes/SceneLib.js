'use strict';

angular.module('cocjs').factory('SceneLib', function () {
	var scenes = {};
	function SceneLib() {}
	SceneLib.prototype.registerScene = function(name, scene) {
		scenes[name] = scene;
	};
	var SceneLibProxy = new Proxy( SceneLib, {
		construct: function( target ) {
			return new Proxy( target, {
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
					return;
				}
			} );
		}
	} );
	return new SceneLibProxy();
});
