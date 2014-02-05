define(['exports', 'angular'], function (exports, angular) {
	"use strict";

	function formatUrl(element) { if (!element) { return false; } return "views/docks/"+element+".html"; }

	exports.toolbar = function() {
		return {
			restrict: "E",
			replace: true,
			templateUrl: formatUrl('toolbar'),
			link: function($scope, elem, attrs) {
				if (attrs.loadEvent) { $scope.$emit(attrs.loadEvent, { action_type: "load-complete", target_id: attrs.id }); }
			}
		};
	};

});