define(
	[
		'exports',
		'services/srvc-requester'
	],
	function (exports, requester) {
	"use strict";
	
	exports.list = [
		{ name: "srvc_requester", srvc: requester.srvc },
	];
});