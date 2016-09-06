'use strict';

/**
 * @ngdoc directive
 * @name cocjs.directive:modal
 * @description
 * # modal
 */
angular.module('cocjs')
  .directive('materialSelect', function ($timeout) {
    return {
      restrict: 'E',
	  templateUrl: 'views/materialSelect.html',
	  scope: {
		  options: '=',
		  multiple: '@',
		  ngTitle: '@',
		  model: '='
	  },
      link: function postLink(scope, element) {
		scope.value = angular.copy(scope.model);
		
		var refresh = function(){
			$timeout(function() {
				element.find('select').val(scope.value);
				element.find('select').material_select();
			});
		};
		scope.change = function() {
			if(_.isArray(scope.model)) {
				_.remove(scope.model);
				_.forEach(element.find('select').val(), function(value){
					scope.model.push(value);
				});
				scope.value = angular.copy(scope.model);
			}
			$timeout(function() {
				element.find('select').val(scope.value);
			});
		};
		scope.$watch('model', function(){
			if(_.isArray(scope.model) && _.intersection(scope.model, scope.value).length === scope.model.length){
				return;
			}
			scope.value = angular.copy(scope.model);
			refresh();
		});
		scope.$watch('options', function() {
			refresh();
		}, true);
		refresh();
      }
    };
  });
