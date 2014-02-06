define(['exports', 'angular'], function (exports, angular) {
	"use strict";
	
	exports.srvc = function($http) {

		var data = {
			base_url: "/data/"
		};

		function create_url(type, call, params) {
			if (!type || !call) { return null; }

			var url = null;

			switch (type) {
				case "location":
					if (!params || (!params.hasOwnProperty("id") && !params.hasOwnProperty("file_name"))) { return null; }
					
					var id = params.id ? params.id : params.file_name;

					switch (call) {
						case "character":
							url = "characters/character-" + id;
						break;
					}

					if (url) { url = data.base_url + url + ".json"; }
				break;
				case "schema":
					switch (call) {
						case "character":
							url = "schema-character";
						break;
					}

					if (url) { url = data.base_url + "schemas/" + url + ".json"; }
				break;
			}

			return url;
		}

		function _requester() {}
		_requester.prototype.constructor = _requester;

		_requester.prototype.find_file = function find_file(call, _callback, params) {
			if (!call || !_callback || !params.hasOwnProperty("data_type")) { return null; }

			var result = { data: null, status: null, headers: null, _callback: params._callback, call_info: { call: call, params: params } };

			var url = create_url(call, params.data_type, params);
			if (!url) { _callback(result); return null; }

			$http({ method: "GET", url: url })
				.success(function (data, status, headers) {
					result.data = data;
					result.status = status;
					result.headers = headers;
					_callback(result);
				})
				.error(function (data, status, headers) {
					result.data = data;
					result.status = status;
					result.headers = headers;
					_callback(result);
				});
		};

		return new _requester();
	};
});