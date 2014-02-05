define(
	[
		'exports',
		'models/base',
		'models/model-character',
		'models/model-temp'
	],
	function (exports, base, character, temp) {
	"use strict";
	
	exports.list = [
		{ name: "model_base", model: base.model },
		{ name: "model_character", model: character.model },
		{ name: "model_temp", model: temp.model }
	];
});