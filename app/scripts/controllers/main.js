'use strict';

/**
 * @ngdoc function
 * @name cocjs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocjs
 */
angular.module('cocjs').controller('MainCtrl', function($log, $rootScope, $scope, CoC, EngineCore, MainView, StartUp) {
	CoC.getInstance().player = new Player();
	CoC.getInstance().player2 = new Player();
	CoC.getInstance().monster = new Monster();
	CoC.getInstance().playerEvent = new PlayerEvents();
	this.statsView = MainView.statsView;
	this.bindingPane = MainView.bindingPane;
	this.sprite = MainView.sprite;
	this.bottomButtons = MainView.bottomButtons;
	this.menuButtons = MainView.bottomButtons;
	this.nameBox = MainView.nameBox;
	this.aCb = MainView.aCb;
	this.handleNameBoxKey = function() {
		if(MainView.nameBox.KeyHandler) {
			MainView.nameBox.KeyHandler();
		}
	};
	$scope.$watch('main.aCb.value', EngineCore.changeHandler);
	$rootScope.StartUp = StartUp; // TODO fix architecture
	StartUp.mainMenu();
});
