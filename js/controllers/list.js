define(
	[
		'exports',
		'controllers/ctrl-platform',
		'controllers/ctrl-workspace',
		'controllers/ctrl-powers',
		'controllers/ctrl-details'
	],
	function (exports, platform, workspace, powers, details) {
	"use strict";
	
	exports.list = [
		{ name: "ctrl_platform", ctrl: platform.main },
		{ name: "ctrl_workspace", ctrl: workspace.main },
		{ name: "ctrl_powers", ctrl: powers.main },
		{ name: "ctrl_details", ctrl: details.main }
	];
});