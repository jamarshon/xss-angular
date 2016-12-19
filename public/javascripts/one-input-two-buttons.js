'use strict';

angular.module('XSSAngularApp')
	.controller('OneInputTwoButtonsCtrl', ['$scope', '$http', function($scope, $http){
		var submitFn = function() {
			var postData = {key: $scope.inputTextKey, value: $scope.inputTextModel };
			$http.post('/modifyDB', postData).then(function(){
				var isSameText = $scope.inputTextModel === $scope.hackInputText;
				if($scope.isSafe){
					$scope.isDangerous = false;
				} else {
					$scope.isDangerous = isSameText;
				}
				var statusMessage = isSameText ? $scope.textSameHackLabel : $scope.textDifferentHackLabel;
				$scope.statusMessage = statusMessage;
				$scope.startTimer();
			});
		};

		$scope.populateInputText = function() {
			$scope.inputTextModel = $scope.hackInputText;
		};

		$scope.submitTextFields = $scope.isInherited ? $scope.inheritedSubmitFn : submitFn;
	}])
	.directive('oneInputTwoButtons', function(){
		return {
			templateUrl: '/templates/one-input-two-buttons-template.ejs',
			restrict: 'E',
			controller: 'OneInputTwoButtonsCtrl',
			scope: {
				inputTextKey: '@',
				inputTextModel: '=',
				hackInputText: '=',

				populateButtonLabel: '@',
				submitButtonLabel: '@',

				statusMessage: '=',
				isDangerous: '=',

				isSafe: '=',
				textSameHackLabel: '@',
				textDifferentHackLabel: '@',

				isInherited: '=',
				inheritedSubmitFn: '&',

				startTimer: '&'
			}
		};
	})