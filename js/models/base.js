define(['exports'], function(exports) {
	"use strict";
	
	exports.model = function(srvc_requester) {
				
		function _BASE() {}
		_BASE.prototype.constructor = _BASE;

		_BASE.prototype.calc_val = function calc_val(calc_obj) {
			if (!calc_obj || !"func" in calc_obj || !"values" in calc_obj || !Array.isArray(calc_obj.values) || !calc_obj.values.length) { return null; }

			function get_value(data) {
				var new_value = 0;

				if ("value" in data) {
					new_value = data.value;
				} else if ("field_path" in data) {
					new_value = self.locater(data.field_path);
				} else if ("func" in data && "values" in data) {
					new_value = self.calc_val(data);
				}

				return new_value;
			}

			var self = this,
				values = calc_obj.values.slice(),
				first_obj = values.splice(0, 1)[0],
				calced_value = get_value(first_obj);

			function sum(val) {
				if (val !== null) {
					switch (calc_obj.func) {
						case "+":
							calced_value += parseInt(val);
						break;
						case "-":
							calced_value -= parseInt(val);
						break;
						case "/":
							calced_value /= parseInt(val);
							calced_value = Math.floor(calced_value);
						break;
						case "*":
							calced_value *= parseInt(val);
							calced_value = Math.floor(calced_value);
						break;
						case "%":
							calced_value %= parseInt(val);
						break;
						default:
							console.warn("unkown calc func", calc_obj.func);
						break;
					}
				}
			}

			if (values.length) { values.map(function (data) { sum(get_value(data)); }); }
			return calced_value;
		};

		_BASE.prototype.locater = function locater(field_path) {
			if (!field_path) { return null; }

			var paths = field_path.split(".");
			if (!paths || !paths.length) { return null; }

			var self = this;

			function finder(source, fields, parent_field) {
				if (!source || !fields || !fields.length) { return null; }
				
				var data_value = null,
					path_value = fields.splice(0, 1)[0];

				function pathing_value_check(field) {
					switch (field) {
						case "value":
							if (typeof source[field] === "object" && "func" in source[field] && "values" in source[field] ) {
								data_value = self.calc_val(source[field]);
							} else {
								data_value = source[field];
							}
						break;
						default:
							data_value = source[field];
						break;
					}
				}

				function transverse_source() {
					if (fields.length) {
						data_value = [];
						var d_fields = [path_value].concat(fields);
						source.forEach(function (data, index) {
							var result = finder(data, d_fields.slice(), path_value);
							if (result !== null) { data_value.push({ obj: data, index: index, parent_field: path_value, value: result }); }
						});

						if (data_value.length == 1) { data_value = data_value[0].value; }

					} else {
						data_value = source;
					}
				}

				if (path_value == "*") {
					if (!source.length) { return null; }

					data_value = [];
					source.forEach(function (data, index) { data_value.push({ obj: data, index: index, parent_field: parent_field, value: finder(data, fields.slice(), parent_field) }); });
				} else {
					var pathing = path_value.split("/"),
						path_cnt = pathing.length;

					if (!path_cnt) { return null; }

					if (path_cnt > 1) {
						if (Array.isArray(source)) {
							transverse_source();
						} else {
							if (pathing[0] in source && source[pathing[0]] == pathing[1]) {
								if (fields.length > 1) {
									data_value = finder(source, fields, path_value);
								} else {
									pathing_value_check(fields[0]);
								}
							} else {
								return null;
							}
						}
					} else {
						if (Array.isArray(source)) {
							transverse_source();
						} else {
							if (pathing[0] in source) {
								if (fields.length) {
									data_value = finder(source[pathing[0]], fields, path_value);
								} else {
									pathing_value_check(pathing[0]);
								}
							}
						}

					}
				}

				return data_value;
			}

			return finder(self, paths);
		};

		_BASE.prototype.set = function set_data(data) {
			if (!data) { return null; }
			var self = this;

			Object.keys(data).forEach(function (prop, index) { if (prop in self) { self[prop] = data[prop]; } else { delete self[prop]; } });
		};

		function base() {}
		base.prototype.constructor = base;
		base.prototype._get_queue = [];

		base.prototype._set_model = function set_model(model, schema) {
			if (!model || !schema) { return null; }

			function get_schema_type(data) {
				if (!data || !data.hasOwnProperty("type")) { return null; }

				var type = null;

				switch (data.type) {
					case "string":
						switch (data.format) {
							case "date-time":
								type = new Date();
							break;
							default:
								type = "";
							break;
						}
					break;
					case "number":
						type = 0;
					break;
					case "integer":
						type = 0;
					break;
					case "boolean":
						type = false;
					break;
					case "array":
						type = [];
					break;
					case "object":
						type = {};
						if (data.hasOwnProperty("properties")) { Object.keys(data.properties).forEach(function (prop, index) { type[prop] = get_schema_type(data.properties[prop]); }); }
					break;
				}

				return type;
			}

			Object.keys(schema).forEach(function (prop, index) { model[prop] = get_schema_type(schema[prop]); });
		};

		base.prototype._define_model = function define_model(results) {
			if (!results || !results.hasOwnProperty("data") || !results.data.hasOwnProperty("properties") || !results._callback || !results.call_info || !results.call_info.params || !results.call_info.params._internal_callback || !results.call_info.params._completed_call) { return null; }

			var params = {},
				_base = new _BASE();

			results.call_info.params._internal_callback(_base, results.data.properties);
			params.model = _base;
			params.schema = results.data.properties;
			params._callback = results.call_info.params._completed_call;
			results._callback(params);
		};

		base.prototype._init = function model_init(params) {
			if (!params || !params._callback) { return null; }
			
			params.data_type = this.data_type;
			params._internal_callback = this._set_model;
			params._completed_call = this._init_complete;
			srvc_requester.find_file("schema", this._define_model, params);
		};

		base.prototype._init_complete = function model_init_complete() {
			this.is_set = true;

			if (this._get_queue.length) {
				this._get_queue.forEach(function (params, index) {
					this.get(params);
				});
				this._get_queue = [];
			}
		};

		base.prototype.get = function model_get(params) {
			if (!params || !params.hasOwnProperty("_callback") || !this.data_type) { return null; }
			
			params.data_type = this.data_type;
			if (!this.is_set) { this._get_queue.push(params); return null; }

			if (params.hasOwnProperty("id") || params.hasOwnProperty("file_name")) {
				srvc_requester.find_file("location", this.set, params);
			}
		};

		return new base();
	};
});