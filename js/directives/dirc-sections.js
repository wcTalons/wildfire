define(['exports', 'angular'], function (exports, angular) {
	"use strict";

	function formatUrl(element) { if (!element) { return false; } return "views/sections/"+element+".html"; }

	exports.platform = function () {
		return {
			restrict: "E",
			replace: true,
			scope: {},
			controller: "ctrl_platform",
			template: '<section id="app-platform"><loader id="platform-loader" class="hide"></loader></section>',
			link: function ($scope, elem, attrs) {
				var loader = angular.element(elem.children("#platform-loader")),
					loaded_content = [];
				
				function render_list() {
					if (!$scope.section_list || !$scope.section_list.length) { return null; }
					$scope.$emit("loader-action", { action_type: "restart", target_id: "platform-loader" });
					loaded_content = [];

					$scope.section_list.forEach(function (data, index) {
						if (data.el_config) {
							var el = $scope.$root.make_angular_element(data.el_config);
							elem.append(el);
							$scope.$root.safe_compile(el, $scope);
						}
					});
				}

				function adjust_dems() {
					var workspace = angular.element("#app-workspace"),
						toolbar = angular.element("#app-toolbar");

					workspace.css("height", "calc(100% - "+toolbar[0].offsetHeight+"px)");
				}

				$scope.$on("platform-view-action", function (event, args) {
					if (!args || !args.action_type) { return null; }

					switch (args.action_type) {
						case "load-complete":
							if (!args.target_id || $scope.section_list._index_of_by_prop("id", args.target_id) == -1) { return null; }

							loaded_content.push(args.target_id);
							if (loaded_content.length == $scope.section_list.length) {
								adjust_dems();
								$scope.$emit("loader-action", { action_type: "pause", target_id: "platform-loader" });
							}
						break;
					}
				});

				if ($scope.section_list && $scope.section_list.length) { render_list(); }
			}
		}
	}

	exports.workspace = function () {
		return {
			restrict: "E",
			replace: true,
			scope: {},
			controller: "ctrl_workspace",
			templateUrl: formatUrl('workspace'),
			link: function($scope, elem, attrs) {
				var sidebar = angular.element(elem.children("#workspace-sidebar")),
					content = angular.element(elem.children("#workspace-content")),
					current_content = null,
					changing_content = null,
					is_trans = false;

				function change_content(content_data) {
					current_content = angular.element(content.children(".content-section"));
					if (is_trans || !content_data || !content_data.id || !content_data.section_data || !content_data.section_data.el_config) { return null; }
					if (current_content && current_content[0] && content_data.id == current_content[0].id.replace("content-", "")) { return null; }

					changing_content = $scope.$root.make_angular_element(content_data.section_data.el_config);
					if (!changing_content) { return null; }

					$scope.$emit("loader-action", { action_type: "restart", target_id: "workspace-loader" });
					is_trans = true;
					if (current_content) { current_content.addClass("fade-out"); }
					content.append(changing_content);
					setTimeout(function() {
						if (current_content) { current_content.remove(); }
						$scope.$root.safe_compile(changing_content, $scope);
					}, 400);
				}

				if ($scope.section_list) {
					$scope.section_list.forEach(function (item, index) {
						if (item.el_config) {
							var section_btn = $scope.$root.make_angular_element(item.el_config);
							if (section_btn) {
								sidebar.append(section_btn);
								section_btn.bind("click", function (event) { change_content(item); });
							}	
						}
					});
				}

				content.css("width", "calc(100% - "+sidebar[0].offsetWidth+"px)");

				$scope.$on("workspace-view-action", function (event, args) {
					if (!args || !args.action_type) { return null; }

					switch (args.action_type) {
						case "load":
							if (!args.content_data) { return null; }
							change_content(args.content_data);
						break;
						case "load-complete":
							if (!args.target_id || !changing_content[0].id || args.target_id != changing_content[0].id) { return null; }

							changing_content.removeClass("fade-out");
							is_trans = false;
							$scope.$emit("loader-action", { action_type: "pause", target_id: "workspace-loader" });
						break;
					}
				});

				if (attrs.loadEvent) { $scope.$emit(attrs.loadEvent, { action_type: "load-complete", target_id: attrs.id }); }
			}
		};
	};

	exports.character_details = function() {
		return {
			restrict: "E",
			replace: true,
			scope: {},
			controller: "ctrl_details",
			templateUrl: formatUrl("character-details"),
			link: function($scope, elem, attrs) {
				var character_str = angular.element(elem.children(".character-strength-mod")),
					str_value = angular.element(character_str.children(".value"));

				function render() {
					str_value.html($scope.current_character.locater("abilities.mod.name/str.value"));
				}

				$scope.$on("character-details-view-action", function (event, args) {
					if (!args || !args.action_type) { return null; }

					switch (args.action_type) {
						case "init-complete":
							render();
							$scope.$emit(attrs.loadEvent, { action_type: "load-complete", target_id: attrs.id });
						break;
					}
				});
			}
		};
	};

	exports.powers = function() {
		return {
			restrict: "E",
			replace: true,
			scope: {},
			controller: "ctrl_powers",
			template: '<section class="content-section vert-content hoz v-top p-10"></section>',
			link: function($scope, elem, attrs) {
				if (!attrs.source || !$scope.hasOwnProperty(attrs.source) || !$scope[attrs.source].length) { return null; elem.remove(); }
				
				var loaded_list = [],
					failed_list = [];

				$scope.$on("character-powers-view-action", function (event, args) {
					if (!args || !args.action_type) { return null; }

					switch (args.action_type) {
						case "load-complete":
							if (args.successful) {
								loaded_list.push(args.id);
							} else {
								if (args.id) {
									loaded_list.push(args.id);
								} else {
									if (args.index) {
										failed_list.push($scope[attrs.source][args.index].id);
									}
								}
							}

							if (loaded_list.length == $scope[attrs.source].length) {
								var successful_list = [];
								loaded_list.forEach(function (id, index) {
									var data_pos = $scope[attrs.source]._index_of_by_prop("id", id);
									if (data_pos != -1) { successful_list.push(id); }
								});

								if (attrs.loadEvent && successful_list.length) {
									$scope.$emit(attrs.loadEvent, { action_type: "load-complete", target_id: attrs.id });
								}
							}
						break;
					}
				});

				$scope[attrs.source].forEach(function (data, index) {
					var card = angular.element('<power-card id="'+data.id+'" data-source="'+attrs.source+'" data-index="'+index+'" data-load-event="character-powers-view-action"></power-card>');
					elem.append(card);
					$scope.$root.safe_compile(card, $scope);
				});
			}
		};
	};

});