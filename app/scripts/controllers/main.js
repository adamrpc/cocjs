'use strict';

/**
 * @ngdoc function
 * @name cocjs.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocjs
 */
angular.module('cocjs').controller('MainCtrl', function($log, $scope, EngineCore, MainView) {
	this.statsView = MainView.statsView;
	this.sprite = MainView.sprite;
	this.bottomButtons = MainView.bottomButtons;
	this.menuButtons = MainView.bottomButtons;
	this.nameBox = MainView.nameBox;
	this.aCb = MainView.aCb;
	$scope.$watch('main.aCb.value', EngineCore.changeHandler);
});
