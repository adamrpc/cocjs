'use strict';

angular.module('cocjs').factory('OnLoadVariables', function ( ) {
	return {
		notes : '',
		date: new Date(),
		dungeonLoc: 0,
		inRoomedDungeon: false,
		inRoomedDungeonResume: null,
		plotFight: false,
		timeQ: 0
	};
});