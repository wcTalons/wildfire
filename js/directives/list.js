define(
	[
		'exports',
		'directives/dirc-docks',
		'directives/dirc-sections',
		'directives/dirc-common'
	],
	function (exports, docks, sections, common) {
	"use strict";

	exports.list = [
		//-- DOCKS
		{ name: "toolbar", dirc: docks.toolbar },
		//-- SECTIONS
		{ name: "platform", dirc: sections.platform },
		{ name: "workspace", dirc: sections.workspace },
		{ name: "powers", dirc: sections.powers },
		{ name: "characterDetails", dirc: sections.character_details },
		//-- COMMON
		{ name: "powerCard", dirc: common.power_card },
		{ name: "loader", dirc: common.loader }
	];
});