'use strict'

angular.module('XSSAngularApp')
	.factory('ResizeAndScrollService', function($window){
		var ResizeAndScrollService = function(scope) {
			this._scope = scope;
		};

		ResizeAndScrollService.prototype = {
			_scrollKey: 'XSSAngularScrollTop',

			_getDynamicAnimatedElements: function() {
				var headerEl = document.getElementById('main-title-header');
				var documentationContainerEl = document.getElementById('documentation-container');
				var elementsToModifyClass = [headerEl, documentationContainerEl];
				return angular.element(elementsToModifyClass);
			},

			// Hide the animatable items if resized to mobile
			_resizeHandler: function() {
				var dummySizeIndicatorEl = document.getElementById('dummy-size-indicator');
				this._scope.isMobile = angular.element(dummySizeIndicatorEl).css('display') === 'none';
				this._getDynamicAnimatedElements().toggleClass('animate-hidden', this._scope.isMobile);
				angular.element('body').toggleClass('is-mobile', this._scope.isMobile);
			},

			// Hide the animatable items when scrolled far enough as well as save it to session storage
			_scrollHandler: function() {
				var scrollTop = angular.element('#documentation-container').scrollTop();
				$window.sessionStorage.setItem(this._scrollKey, scrollTop);

				if(this._scope.isMobile) {
					this._getDynamicAnimatedElements().toggleClass('animate-hidden', scrollTop > 60);
				}
			},

			/** ------------------------------------------ PUBLIC API ------------------------------------------*/

			bindResizeHandlerAndExecute: function() {
				angular.element($window).bind('resize', this._resizeHandler.bind(this));
				this._resizeHandler();
			},

			bindScrollHander: function() {
				angular.element('#documentation-container').bind('scroll', this._scrollHandler.bind(this));
			},

			scrollToLastScrollTop: function() {
				var lastScrollTop = $window.sessionStorage.getItem(this._scrollKey);
				angular.element('#documentation-container').scrollTop(lastScrollTop);
			}
		};

		return ResizeAndScrollService;
	});
	
	