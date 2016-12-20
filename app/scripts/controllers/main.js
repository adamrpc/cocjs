'use strict';

/**
 * @ngdoc function
 * @name cocjs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocjs
 */
angular.module('cocjs').controller('MainCtrl', function($scope, CoC, MainView, SceneLib, Player, Monster, PlayerEvents) {
	CoC.player = new Player();
	CoC.player2 = new Player();
	CoC.monster = new Monster();
	CoC.playerEvent = new PlayerEvents();
	this.MainView = MainView;
	this.handleNameBoxKey = function() {
		if(MainView.nameBox.KeyHandler) {
			MainView.nameBox.KeyHandler();
		}
	};
	$scope.$watch('main.MainView.aCb.value', SceneLib.perkScene.changeHandler);
	SceneLib.startUp.mainMenu();
});
