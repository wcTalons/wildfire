define(['exports', 'angular'], function (exports, angular) {
	"use strict";

	exports.main = function ($scope, model_character) {
		$scope.current_character = null;

		function load_character(results) {
			if (!results || !results.data) { return null; }

			$scope.current_character = results.data;
			//-- console.log("character race str value", $scope.current_character.locater("race.abilities.name/strength.value"));
			//-- console.log("character str value", $scope.current_character.locater("abilities.ability.name/strength.value"));
			//-- console.log("character str mod value", $scope.current_character.locater("abilities.mod.name/str.value"));
			//-- console.log("character ability mod values", $scope.current_character.locater("abilities.*.mod.value"));
			//-- console.log("character cha value", $scope.current_character.locater("abilities.ability.name/charisma.value"));
			console.log("character cha mod value", $scope.current_character.locater("abilities.mod.name/cha.value"));
			$scope.$emit("character-details-view-action", { action_type: "init-complete" });
		}

		model_character.get({ _callback: load_character, file_name: "test" });
	};
});