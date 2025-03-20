/* Calendar */

// Connecting the list of active modules
import { flsModules } from "../modules.js";

// Connecting the module
import datepicker from "js-datepicker";

if (document.querySelector("[data-datepicker]")) {
	const picker = datepicker("[data-datepicker]", {
		customDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		customMonths: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec"
		],
		overlayButton: "Apply",
		overlayPlaceholder: "Year (4 digits)",
		startDay: 1,
		formatter: (input, date, instance) => {
			const value = date.toLocaleDateString();
			input.value = value;
		},
		onSelect: function (input, instance, date) {}
	});
	flsModules.datepicker = picker;
}
