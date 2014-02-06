define(['exports', 'angular'], function (exports, angular) {
	"use strict";

	exports.main = function ($scope) {
		var loaded_list = [],
			failed_list = [];

		$scope.power_list = [
			{
				id: "powerrunepriest1",
				name: "Word of Shielding",
				type: "at-will",
				level: 1,
				action_type: "standard",
				keywords: ["divine", "runic", "weapon"],
				range: "Melee Weapon",
				target: "one creatue",
				attack: { mod: "str", vs: "ac" },
				dmg: { mod: "str", value: { type: "weapon", amount: "1" } },
				hit_details: [
					{
						label: "Rune of Destruction",
						text: "First time target hits or misses you or ally adjacent to you, the target takes CON damage unless the target is attacking a creatue who has marked it. Lasts until end of next."
					},
					{
						label: "Rune of Protection",
						text: "First time target hit or misses you or ally adjacent to you, the target of the attack gain CON temp hp. Lasts until end of next."
					}
				]
			},
			{
				id: "powerrunepriest2",
				name: "Word of Exchange",
				type: "at-will",
				level: 1,
				action_type: "standard",
				keywords: ["divine", "runic", "weapon"],
				range: "Melee Weapon",
				target: "one creatue",
				attack: { mod: "str", vs: "ac" },
				dmg: { mod: "str", value: { type: "weapon", amount: "1" } },
				hit_details: [
					{
						label: "Rune of Destruction",
						text: "Next attack against target from an ally gains +WIS damage bonus and ally gains WIS temp HP. Lasts until end of next."
					},
					{
						label: "Rune of Protection",
						text: "Target takes a -2 penalty to all defenses. Next attack against target from an ally gains +WIS AC bonus. Lasts until end of next."
					}
				]
			},
			{
				id: "powerrunepriest3",
				name: "Flames of Purity",
				type: "encounter",
				level: 1,
				action_type: "standard",
				keywords: ["divine", "fire", "healing", "runic", "weapon"],
				range: "Close Blast 3",
				target: "enemies in blast",
				attack: { mod: "str", vs: "ac" },
				dmg: { mod: "str", value: { type: "weapon", amount: "1" }, keywords: ["fire"] },
				hit_details: [
					{
						label: "Rune of Destruction",
						text: "Each ally in blast gains +3 damage. Lasts until end of next."
					},
					{
						label: "Rune of Protection",
						text: "Each ally in blast gains 3 HP."
					}
				]
			},
			{
				id: "powerrunepriest4",
				name: "Rune of Endless Fire",
				type: "daily",
				level: 1,
				action_type: "standard",
				keywords: ["divine", "fire", "radiant", "weapon"],
				range: "Melee Weapon",
				target: "one creatue",
				attack: { mod: "str", vs: "ac" },
				dmg: { mod: "str", value: { type: "weapon", amount: "2" }, keywords: ["fire", "radiant"] },
				hit_details: [
					{
						text: "Target is blinded. Lasts until end of next."
					},
					{
						label: "Miss",
						text: "Half Damage."
					},
					{
						label: "Effect",
						text: "You gain +2 damage and all attacks deal fire and radiant damage. HP and Temp HP granted by powers gains +4."
					}
				]
			}

		];
	};
});