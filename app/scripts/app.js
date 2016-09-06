'use strict';

/**
 * @ngdoc overview
 * @name cocjs
 * @description
 * # cocjs
 *
 * Main module of the application.
 */
angular
  .module('cocjs', [
    'ngAnimate',
    'ngAria',
    'ngRoute',
    'ngSanitize',
	'chart.js'
  ])
  .constant('_', window._)
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
