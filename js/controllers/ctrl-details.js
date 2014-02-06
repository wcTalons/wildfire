define(['exports', 'angular'], function (exports, angular) {
	"use strict";

	exports.main = function ($scope, model_character) {
		$scope.current_character = null;

		function load_character(results) {
			if (!results || !results.data) { return null; }

			$scope.current_character = results.data;
			//-- console.log("race strength value", $scope.current_character.locater("race.abilities.name/strength.value"));
			//-- console.log("char strength value", $scope.current_character.locater("abilities.ability.name/strength.value"));
			//-- console.log("char str value", $scope.current_character.locater("abilities.mod.name/str.value"));
			//-- console.log("char str value", $scope.current_character.locater("abilities.*.mod.value"));

			function level_calc(val) {
				var d = 1000, c = 500, b = 250, a = 125, e = 100, t = null;

				//-- ((((2%lvl)+1)*g) + ((lvl-1)*b) - ((lvl-1)*g)) + ((lvl-1)*b) + (((lvl-2)*g)+((2%lvl)*b)) - ((2%lvl)*(lvl*g)) + ((2%lvl)*l);
				console.log("exp for lvl: "+val, t );
				//-- console.log("mod lvl", ((b*lvl)%(lvl*(g+l)))*(3%(lvl-1)));
			}

			level_calc(975);
			level_calc(1768);
			level_calc(3250);
			level_calc(4753);
			level_calc(6015);

			$scope.$emit("character-details-view-action", { action_type: "init-complete" });
		}

		//-- model_character.get({ _callback: load_character, file_name: "test" });
	};
});