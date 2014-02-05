define(['exports', 'angular'], function (exports, angular) {
	"use strict";

	function formatUrl(element) { if (!element) { return false; } return "views/common/"+element+".html"; }

	exports.power_card = function() {
		return {
			restrict: "E",
			replace: true,
			scope: {},
			controller: 'ctrl_powers',
			templateUrl: formatUrl('power-card'),
			link: function($scope, elem, attrs) {
				if (!attrs.source || !attrs.index) {
					if (attrs.loadEvent) { $scope.$emit(attrs.loadEvent, { action_type: "load-complete", successful: false, id: attrs.id, index: attrs.index }); }
					elem.remove();
					return null;
				}

				var header = angular.element(elem.children(".header")),
						power_title = angular.element(header.children(".title")),
						power_details = angular.element(header.children(".details")),
							power_details_type = angular.element(power_details.children(".type")),
							power_details_action_type = angular.element(power_details.children(".action-type")),
							power_details_level = angular.element(power_details.children(".level")),
					body = angular.element(elem.children(".body")),
						keywords = angular.element(body.children(".keywords")),
							keywords_label = angular.element(keywords.children(".label")),
							keywords_list = angular.element(keywords.children(".list")),
						range = angular.element(body.children(".range")),
							range_label = angular.element(range.children(".label")),
							range_value = angular.element(range.children(".value")),
						target = angular.element(body.children(".target")),
							target_label = angular.element(target.children(".label")),
							target_value = angular.element(target.children(".value")),
						attack = angular.element(body.children(".attack")),
							attack_label = angular.element(attack.children(".label")),
							attack_value = angular.element(attack.children(".value")),
						hit = angular.element(body.children(".hit")),
							hit_damage = angular.element(hit.children(".damage")),
								hit_damage_label = angular.element(hit_damage.children(".label")),
								hit_damage_value = angular.element(hit_damage.children(".value")),
							hit_details = angular.element(hit.children(".details")),
								hit_details_label = angular.element(hit_details.children(".label")),
								hit_details_list = angular.element(hit_details.children(".list")),
					power_data = $scope[attrs.source][attrs.index];

				if (!power_data) { elem.remove(); return null; }

				var dmg_value = "";

				if (power_data.dmg.value.type == "weapon") {
					dmg_value = "[W]";
				} else {
					dmg_value = power_data.dmg.value;
				}

				power_title.html(power_data.name);
				power_details_type.html(power_data.type);
				power_details_action_type.html(power_data.action_type);
				power_details_level.html("level "+power_data.level);
				keywords_list.html(power_data.keywords.join(", "));
				range_value.html(power_data.range);
				target_value.html(power_data.target);
				attack_value.html('<div class="mod">'+power_data.attack.mod.toUpperCase()+'</div><div class="m-6 m-lr-on">vs</div><div class="defense">'+power_data.attack.vs.toUpperCase()+'</div>');
				hit_damage_value.html('<div class="amount">'+power_data.dmg.value.amount+'</div><div class="type">'+dmg_value+'</div><div class="mod m-4 m-l-on">+ '+power_data.dmg.mod.toUpperCase()+'</div>');

				power_data.hit_details.forEach(function (data, index) {
					var wrapper = angular.element('<section class="hit-detail p-6"></section>'),
						text = angular.element('<div class="text">'+data.text+'</div>');

					if (data.label) {
						var label = angular.element('<div class="label b">'+data.label+'</div>');
						wrapper.append(label);
					}

					wrapper.append(text);
					hit_details_list.append(wrapper);
				});

				elem.addClass(power_data.type);

				switch (power_data.type) {
					case "at-will":
						header.addClass("bg-success bgc");
					break;
					case "encounter":
						header.addClass("bg-alert bgc");
					break;
					case "daily":
						header.addClass("bg-dark bgc");
					break;
				}
				
				if (attrs.loadEvent) { $scope.$emit(attrs.loadEvent, { action_type: "load-complete", successful: true, id: power_data.id, index: attrs.index }); }
			}
		};
	};

	exports.loader = function() {
		return {
			restrict: "E",
			template: '<div class="loader fadable"><i class="icon-spinner text-h2 spin"></i></div>',
			replace: true,
			link: function($scope, elem, attrs) {
				if (!attrs.id) { elem.remove(); return null; }

				var spinner = angular.element(elem.children(".icon-spinner"));

				function pause() {
					spinner.removeClass("spin");
					elem.addClass("fade-out");
					elem.addClass("hide");
				}

				function restart() {
					elem.removeClass("hide");
					spinner.addClass("spin");
					elem.removeClass("fade-out");
				}

				if (attrs.defaultStart) {
					switch (attrs.defaultStart) {
						case "off":
							pause();
						break;
					}
				}

				$scope.$on("loader-action", function (event, args) {
					if (!args || !args.action_type || args.target_id != attrs.id) { return null; }

					switch (args.action_type) {
						case "start":
							spinner.addClass("spin");
						break;
						case "stop":
							spinner.removeClass("spin");
						break;
						case "remove":
							elem.remove();
						break;
						case "pause":
							pause();
						break;
						case "restart":
							restart();
						break;
					}
				})
			}
		};
	};

});