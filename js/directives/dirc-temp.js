define(['exports', 'angular'], function (exports, angular) {
	"use strict";

	function formatUrl(element) { if (!element) { return false; } return "views/"+element+".html"; }

	exports.temp = function() {
		return {
			restrict: "E",
			replace: true,
			template: '<section>TEMP</section>',
			link: function($scope, elem, attrs) {
				
			}
		};
	};

	exports.temp = function() {
		return {
			restrict: "E",
			replace: true,
			scope: {},
			controller: 'ctrl_temp',
			template: '<section>TEMP</section>',
			link: function($scope, elem, attrs) {
				
			}
		};
	};

	exports.temp_url = function() {
		return {
			restrict: "E",
			replace: true,
			templateUrl: formatUrl('temp'),
			link: function($scope, elem, attrs) {
				
			}
		};
	};

});