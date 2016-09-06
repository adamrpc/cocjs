'use strict';

/**
 * @ngdoc directive
 * @name cocjs.directive:modal
 * @description
 * # modal
 */
angular.module('cocjs')
  .directive('modal', function () {
    return {
      restrict: 'A',
	  scope: {
		  modal: '='
	  },
      link: function postLink(scope, element) {
        scope.$watch('modal.opened', function(newValue) {
			if(newValue) {
				element.openModal({
					complete: function(){
						scope.modal.opened = false;
						scope.$digest();
					}
				});
			}else{
				element.closeModal();
			}
		});
      }
    };
  });
