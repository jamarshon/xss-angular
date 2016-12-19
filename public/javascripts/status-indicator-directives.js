'use strict';

angular.module('XSSAngularApp')
	.directive('safeCircle', function(){
		return {
			template: '<i class="fa fa-check-circle" aria-hidden="true" style="color: green;"></i>',
			restrict: 'E'
		};
	})
	.directive('dangerCircle', function(){
		return {
			template: '<i class="fa fa-times-circle" aria-hidden="true" style="color: red;"></i>',
			restrict: 'E'
		};
	});