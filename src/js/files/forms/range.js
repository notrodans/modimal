// Connecting from node_modules
import * as noUiSlider from "nouislider";

// Connecting styles from scss/base/forms/range.scss
// in file scss/forms/forms.scss

// Connecting styles from node_modules
import "nouislider/dist/nouislider.css";

export function rangeInit() {
	const priceSlider = document.querySelector("#range");
	if (priceSlider) {
		let textFrom = priceSlider.getAttribute("data-from");
		let textTo = priceSlider.getAttribute("data-to");
		noUiSlider.create(priceSlider, {
			start: 0, // [0,200000]
			connect: [true, false],
			range: {
				min: [0],
				max: [200000]
			}
			/*
			format: wNumb({
				decimals: 0
			})
			*/
		});
		/*
		const priceStart = document.getElementById('price-start');
		const priceEnd = document.getElementById('price-end');
		priceStart.addEventListener('change', setPriceValues);
		priceEnd.addEventListener('change', setPriceValues);
		*/
		function setPriceValues() {
			let priceStartValue;
			let priceEndValue;
			if (priceStart.value != "") {
				priceStartValue = priceStart.value;
			}
			if (priceEnd.value != "") {
				priceEndValue = priceEnd.value;
			}
			priceSlider.noUiSlider.set([priceStartValue, priceEndValue]);
		}
	}
}
rangeInit();
