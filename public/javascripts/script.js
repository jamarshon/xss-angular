angular.module('App', [])
	.controller('Ctrl', function($scope, $http, $compile, $timeout, $templateCache, $sce, $window){
		window.hackMessage = 'You have been hacked!';

		var scrollKey = 'XSSAngularScrollTop';
		var lastScrollTop = $window.sessionStorage.getItem(scrollKey);

		$scope.hackScriptText = '<script type="text/javascript">alert("You have been hacked!")</script>';
		$scope.hackSandBoxText = "{{(_=''.sub).call.call({}[$='constructor'].getOwnPropertyDescriptor(_.__proto__,$).value,0,'alert(hackMessage)')()}}";

		$scope.a1Items = [];

		$scope.submitServerTemplateUnparsed = function() {
			var postData = {key: 'serverTemplateUnparsedText', value: $scope.serverTemplateUnparsedText };
			$http.post('/modifyDB', postData).then(function(){
				$scope.isDangerous = $scope.serverTemplateUnparsedText === $scope.hackScriptText;
				var statusMessage = $scope.isDangerous ? 'Refresh page to see the hacker\'s effect' : 'Refresh page to see input stored in db be rendered in the template';
				$scope.statusMessage = statusMessage;
				$scope.startTimer();
			});
		};

		$scope.submitInterpolationText = function() {
			var postData = {key: 'interpolationText', value: $scope.interpolationText };
			$http.post('/modifyDB', postData).then(function(){
				$scope.isDangerous = false;
				var statusMessage = ($scope.interpolationText === $scope.hackSandBoxText) ? 'Refresh page to see that the JS becomes string and is not executed' : 'Refresh page to see input stored';
				$scope.statusMessage = statusMessage;
				$scope.startTimer();
			});
		};

		$scope.cleanDB = function(){
			$http.post('/cleanDB').then(function(){
				$scope.isDangerous = false;
				$scope.statusMessage = "DB has been cleaned. Refresh page to see a clean page.";
				$scope.startTimer();
			});
		};
		
		$scope.createElement = function() {
			var element = document.createElement('div');
			element.className = $scope.constructionText;
			angular.element('#construction-text-container').append(element);
			$compile(element)($scope);
			$scope.a1Items.push(element.outerHTML);
		};

		$scope.saveNgIncludeText = function() {
			var postData = {key: 'ngIncludeText', value: $scope.ngIncludeText };
			$http.post('/modifyDB', postData).then(function(){
				$scope.isDangerous = ($scope.ngIncludeText === $scope.hackSandBoxText);
				var statusMessage = $scope.isDangerous ? 'Refresh page to see the hacker\'s effect' : 'Refresh page to see input stored';
				$scope.statusMessage = statusMessage;
				$scope.startTimer();
			});
		};

		$scope.saveNgBindHtmlText = function() {
			var postData = {key: 'ngBindHtmlText', value: $scope.ngBindHtmlText };
			$http.post('/modifyDB', postData).then(function(){
				$scope.isDangerous = false;
				var statusMessage = ($scope.ngBindHtmlText === $scope.hackSandBoxText) ? 'Refresh page to see that the JS becomes string and is not executed' : 'Refresh page to see input stored';
				$scope.statusMessage = statusMessage;
				$scope.startTimer();
			});
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

		$http.get('/getDB').then(function(res){
			var obj = res.data;
			$scope.serverTemplateUnparsedText = obj.serverTemplateUnparsedText;
			$scope.interpolationText = obj.interpolationText;
			$scope.ngIncludeText = obj.ngIncludeText;
			$scope.ngBindHtmlText = obj.ngBindHtmlText;
			$templateCache.put('htmlContentUrl', '<div id="' + $scope.ngIncludeText + '"></div>');
			$scope.loadedDB = true;
			$timeout(function() {
				$scope.ngIncludeCompiled = angular.element('#a2 .compiled')[0].innerHTML;
				$scope.ngBindHtmlCompiled = angular.element('#a3 .compiled')[0].innerHTML;
				angular.element('#documentation-container').scrollTop(lastScrollTop);
			});
		});

		angular.element('#documentation-container').bind('scroll', function(){
			$window.sessionStorage.setItem(scrollKey, angular.element('#documentation-container').scrollTop());
		});
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
	