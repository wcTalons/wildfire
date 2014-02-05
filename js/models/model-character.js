define(['exports', 'angular'], function(exports) {
	"use strict";
	
	exports.model = function(srvc_requester, model_base) {

		function _CHARACTER() {}
		
		function set_model(results) {
			if (!results || !results.hasOwnProperty("data") || !results.data.hasOwnProperty("properties")) { return null; }
			
			_CHARACTER.prototype = model_character._get_model(results.data.properties);
			_CHARACTER.prototype.constructor = _CHARACTER;
			_CHARACTER.prototype.schema = results.data.properties;
		}

		function character() {}
		character.prototype = model_base;
		character.prototype.constructor = character;
		character.prototype.data_type = "character";

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
		}

		var model_character = new character();
		model_character._init({ _callback: set_model });

		return model_character;
	};
});