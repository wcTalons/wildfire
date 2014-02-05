define(['exports', 'angular'], function (exports, angular) {
	"use strict";

	exports.main = function ($scope) {
		$scope.section_list = [
			{
				id: "character-details",
				el_config: {
					id: "action-character-section",
					dirc: "i",
					classes: ["icon-user", "section-btn", "action", "bg-std", "p-5", "w-32", "bdr", "bdr-b-on", "center"],
					attrs: [
						{ name: "data-target", val: "content-section-character" }
					]
				},
				section_data: {
					el_config: {
						id: "content-character-details",
						dirc: "character-details",
						classes: ["fadable", "fade-out"],
						attrs: [
							{ name: "data-load-event", val: "workspace-view-action" }
						]
					},
				}
			},
			{
				id: "character-powers",
				el_config: {
					id: "action-powers-section",
					dirc: "i",
					classes: ["icon-bolt", "section-btn", "action", "bg-std", "p-5", "w-32", "bdr", "bdr-b-on", "center"],
					attrs: [
						{ name: "data-target", val: "content-section-powers" }
					]
				},
				section_data: {
					el_config: {
						id: "content-character-powers",
						dirc: "powers",
						classes: ["fadable", "fade-out"],
						attrs: [
							{ name: "data-load-event", val: "workspace-view-action" },
							{ name: "data-source", val: "power_list" }
						]
					},
				}
			}
		];
	};
});