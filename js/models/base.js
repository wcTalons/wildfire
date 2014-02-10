define(['exports'], function(exports) {
	"use strict";
	
	exports.model = function(srvc_requester) {
				
		function _BASE() {}
		_BASE.prototype.constructor = _BASE;

		_BASE.prototype._get_calc_value = function get_calc_value(data) {
			if (data === null) { return null; }

			var new_value = 0;

			switch (typeof data) {
				case "object":
					if ("value" in data) {
						new_value = data.value;
					} else if ("field_path" in data) {
						new_value = this.locater.apply(this, [data.field_path]);
					} else if ("func" in data && "values" in data) {
						new_value = this.calc_val.apply(this, [data]);
					} else if ("condition" in data) {
						new_value = this.calc_val_check.apply(this, [data]);
					}
				break;
				case "string":
					new_value = parseInt(data);
				break;
				case "number":
					new_value = data;
				break;
			}

			return new_value;
		};

		_BASE.prototype.calc_val_check = function calc_check(check_obj) {
			if (!check_obj || !"condition" in check_obj || !"check_val" in check_obj || (!"series" in check_obj && !"return_val" in check_obj)) { return null; }

			var self = this,
				value = 0,
				check_val = self._get_calc_value.apply(self, [check_obj.check_val]);

			function checker(val, check) {
				if (val === null || check === null) { return null; }

				var pass = false;

				switch (check_obj.condition) {
					case "LT":
						if (val < check) { pass = true; }
					break;
					case "GT":
						if (val > check) { pass = true; }
					break;
					case "EQ":
						if (val == check) { pass = true; }
					break;
					case "LE":
						if (val <= check) { pass = true; }
					break;
					case "GE":
						if (val >= check) { pass = true; }
					break;
				}

				return pass;
			}

			function pre_check(data) {
				if (!data || !"check_val" in data || !"return_val" in data) { return null; }

				var test_val = self._get_calc_value.apply(self, [data.check_val]);
				return checker(check_val, test_val) ? data.return_val : false;
			}

			if (check_val !== null) {
				var temp_val = null;

				if ("series" in check_obj && Array.isArray(check_obj.series)) {
					for (var i = 0; i < check_obj.series.length; i++) {
						temp_val = pre_check(check_obj.series[i]);
						if (temp_val !== null && temp_val !== false) { break; }
					}
				} else {
					temp_val = pre_check(check_obj);
				}

				if (temp_val !== null && temp_val !== false) { value = temp_val; }
			}

			return value;
		};

		_BASE.prototype.calc_val = function calc_val(calc_obj) {
			if (!calc_obj || !"func" in calc_obj || !"values" in calc_obj || !Array.isArray(calc_obj.values) || !calc_obj.values.length) { return null; }

			var self = this,
				values = calc_obj.values.slice(),
				first_obj = values.splice(0, 1)[0],
				calced_value = self._get_calc_value.apply(self, [first_obj]);

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

			if (values.length) { values.map(function (data) { sum(self._get_calc_value.apply(self, [data])); }); }
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
							data_value = self._get_calc_value.apply(self, [source[field]]);
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

						if (data_value.length == 1) {
							data_value = data_value[0].value;
						} else if (!data_value.length) {
							data_value = null;
						}

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

		base.prototype.get = function model_get(params) {
			if (!params || !params.hasOwnProperty("_callback") || !this.data_type) { return null; }
			
			params.data_type = this.data_type;
			if (!this.is_set) { this._get_queue.push(params); return null; }

			if (params.hasOwnProperty("id") || params.hasOwnProperty("file_name")) {
				srvc_requester.find_file("location", this.set, params);
			}
		};

		base.prototype._init_complete = function model_init_complete() {
			var self = this;

			if (this._get_queue.length) {
				this._get_queue.forEach(function (params, index) { self.get(params); });
				this._get_queue = [];
			}
		};

		base.prototype._define_model = function define_model(results) {
			if (!results || !results.hasOwnProperty("data") || !results.data.hasOwnProperty("properties") || !results.call_info || !results.call_info.params || !results.call_info.params.model_handler) { return null; }

			var _base = new _BASE();

			results.call_info.params.model_handler._set_model(_base, results.data.properties);
			results.call_info.params.model.prototype = _base;
			results.call_info.params.model.prototype.constructor = results.call_info.params.model;
			results.call_info.params.model.prototype.schema = results.data.properties;
			results.call_info.params.model_handler.__proto__.is_set = true;
			results.call_info.params.model_handler._init_complete();
		};

		base.prototype._init = function model_init(params) {
			srvc_requester.find_file("schema", this._define_model, { model_handler: this, data_type: this.data_type, model: params.model });
		};

		return new base();
	};
});