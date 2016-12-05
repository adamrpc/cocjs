'use strict';

angular.module('cocjs').factory('SceneLib', function ( $log ) {
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
				set: function( target, name, value ) {
					return;
				}
			} );
		}
	} );
	return new SceneLibProxy();
});
