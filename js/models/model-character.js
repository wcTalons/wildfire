define(['exports', 'angular'], function(exports) {
	"use strict";
	
	exports.model = function(srvc_requester, model_base) {

		function _CHARACTER() {}

		function character() {}
		character.prototype = model_base;
		character.prototype.constructor = character;
		character.prototype.data_type = "character";
		character.prototype.is_set = false;

		
		character.prototype.define_model = function define_character(results) {
			if (!results.model || !results.schema) { return null; }
			
			_CHARACTER.prototype = results.model;
			_CHARACTER.prototype.constructor = _CHARACTER;
			_CHARACTER.prototype.schema = results.schema;
			results._callback();
		};

		character.prototype.set = function set_data(results) {
			if (!results || !results._callback) { return null; }

			var params = { data: null, type: results.type };

			if (results.hasOwnProperty("data")) {

				if (results.data.hasOwnProperty("items") && Array.isArry(results.data.items) && results.data.items.length) {
					params.data = [];
					params.data_type = "character";

					results.data.items.forEach(function (data, index) {
						var new_character = new _CHARACTER();
						new_character.set(data);
						params.data.push(new_character);
					});
				} else if (results.data.hasOwnProperty("id")) {
					var new_character = new _CHARACTER();
					new_character.set(results.data);
					params.data = new_character;
				}

			}

			results._callback(params);
		};

		var model_character = new character();
		model_character._init({ _callback: model_character.define_model });

		return model_character;
	};
});