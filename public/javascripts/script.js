'use strict'

angular.module('XSSAngularApp', [])
	.controller('MainCtrl', function($scope, $http, $compile, $timeout, $templateCache, $sce, $window, ResizeAndScrollService){
		var resizeAndScrollService = new ResizeAndScrollService($scope);
		$window.hackMessage = 'You have been hacked!';

		$scope.hackScriptText = '<script type="text/javascript">alert("You have been hacked!"); document.body.firstElementChild.className = 1;</script>';
		$scope.hackSandBoxText = "{{(_=''.sub).call.call({}[$='constructor'].getOwnPropertyDescriptor(_.__proto__,$).value,0,'alert(hackMessage); document.body.firstElementChild.className = 1')()}}";
		$scope.scrolledToPrevious = false;

		// Shared data between the ng-include which is dynamic
		$scope.sharedDynamicData = {
			interpolationText: '',

			constructionText: '',
			constructCompiled: '',

			ngIncludeText: '',
			ngIncludeCompiled: '',

			ngBindHtmlText: '',
			ngBindHtmlFull: '',

			statusMessage: '',
			isDangerous: false,
			loadedDB: false,
			hacked: false
		};

		$http.get('/getDB').then(function(res){
			var obj = res.data;
			for(var key in obj) {
				$scope.sharedDynamicData[key] = obj[key];
			}
			$templateCache.put('htmlContentUrl', '<div id="' + $scope.sharedDynamicData.ngIncludeText + '"></div>');
			$scope.sharedDynamicData.loadedDB = true;
		});

		$scope.cleanDBPlusRefresh = function(){
			$http.post('/cleanDB').then(function(){
				$window.location.reload();
			});
		};

		$scope.onNgIncludeComplete = function() {
			$scope.sharedDynamicData.ngIncludeCompiled = angular.element('#ng-include-without-interpolation .compiled')[0].innerHTML;
		};
		
		$scope.createElement = function() {
			var element = document.createElement('div');
			element.className = $scope.sharedDynamicData.constructionText;
			angular.element('#construction-text-container').append(element);
			$compile(element)($scope);

			$scope.sharedDynamicData.hacked = $scope.sharedDynamicData.constructionText === $scope.hackSandBoxText;
			$scope.sharedDynamicData.constructCompiled = element.outerHTML;
		};

		$scope.startTimer = function() {
			$timeout(function(){
				$scope.sharedDynamicData.statusMessage = '';
			}, 5000);
		};

		$scope.$watchCollection('sharedDynamicData', function(newVal, oldVal){
			if(newVal.ngBindHtmlText !== oldVal.ngBindHtmlText || !newVal.ngBindHtmlFull) {
				$scope.sharedDynamicData.ngBindHtmlFull = $sce.trustAsHtml('<div id="' + newVal.ngBindHtmlText + '"></div>');
			}

			if(!$scope.scrolledToPrevious) {
				if(newVal.ngIncludeCompiled && newVal.ngBindHtmlFull) {
					$timeout(function(){
						$scope.sharedDynamicData.hacked = document.getElementById('dummy-hacked-indicator').className === '1';
						resizeAndScrollService.scrollToLastScrollTop();
						$scope.scrolledToPrevious = true;
					});
				}
			}
		});

		resizeAndScrollService.bindScrollHander();
		resizeAndScrollService.bindResizeHandlerAndExecute();
	});
	
	