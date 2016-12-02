'use strict';

angular.module('cocjs').factory('SceneLib', function ( ) {
	var scenes = {};
	function SceneLib() {}
	SceneLib.prototype.registerScene = function(name, scene) {
		scenes[name] = scene;
	};
	var SceneLibProxy = new Proxy( SceneLib, {
		construct: function( target ) {
			return new Proxy( target, {
				get: function( target, name ) {
					if(name === 'registerScene') {
						return target[name];
					}
					return scenes[ name ];
				},
				set: function( target, name, value ) {
					return;
				}
			} );
		}
	} );
	return new SceneLibProxy();
});
