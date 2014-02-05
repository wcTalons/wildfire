define(['exports', 'angular'], function (exports, angular) {
	"use strict";

	exports.main = function ($scope) {
		$scope.section_list = [
			{
				id: "app-toolbar",
				el_config: {
					id: "app-toolbar",
					dirc: "toolbar",
					classes: [],
					attrs: [
						{ name: "data-load-event", val: "platform-view-action" }
					]
				}
			},
			{
				id: "app-workspace",
				el_config: {
					id: "app-workspace",
					dirc: "workspace",
					classes: [],
					attrs: [
						{ name: "data-load-event", val: "platform-view-action" }
					]
				}
			}
		];
	};
});