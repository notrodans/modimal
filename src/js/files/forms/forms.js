// Connecting the list of active modules
import { flsModules } from "../modules.js";
// Helper functions
import { isMobile, _slideUp, _slideDown, _slideToggle, FLS } from "../functions.js";
// Scroll to block module
import { gotoBlock } from "../scroll/gotoblock.js";
//================================================================================================================================================================================================================================================================================================================================

/*
Documentation: https://template.fls.guru/template-docs/form-work.html
*/

// Working with form fields.
export function formFieldsInit(options = { viewPass: false, autoHeight: false }) {
	document.body.addEventListener("focusin", function (e) {
		const targetElement = e.target;
		if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
			if (!targetElement.hasAttribute("data-no-focus-classes")) {
				targetElement.classList.add("_form-focus");
				targetElement.parentElement.classList.add("_form-focus");
			}
			formValidate.removeError(targetElement);
			targetElement.hasAttribute("data-validate") ? formValidate.removeError(targetElement) : null;
		}
	});
	document.body.addEventListener("focusout", function (e) {
		const targetElement = e.target;
		if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
			if (!targetElement.hasAttribute("data-no-focus-classes")) {
				targetElement.classList.remove("_form-focus");
				targetElement.parentElement.classList.remove("_form-focus");
			}
			// Instant validation
			targetElement.hasAttribute("data-validate")
				? formValidate.validateInput(targetElement)
				: null;
		}
	});
	// If enabled, add 'Show password' functionality
	if (options.viewPass) {
		document.addEventListener("click", function (e) {
			let targetElement = e.target;
			if (targetElement.closest('[class*="__viewpass"]')) {
				let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
				targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
				targetElement.classList.toggle("_viewpass-active");
			}
		});
	}
	// If enabled, add 'Auto height' functionality
	if (options.autoHeight) {
		const textareas = document.querySelectorAll("textarea[data-autoheight]");
		if (textareas.length) {
			textareas.forEach(textarea => {
				const startHeight = textarea.hasAttribute("data-autoheight-min")
					? Number(textarea.dataset.autoheightMin)
					: Number(textarea.offsetHeight);
				const maxHeight = textarea.hasAttribute("data-autoheight-max")
					? Number(textarea.dataset.autoheightMax)
					: Infinity;
				setHeight(textarea, Math.min(startHeight, maxHeight));
				textarea.addEventListener("input", () => {
					if (textarea.scrollHeight > startHeight) {
						textarea.style.height = `auto`;
						setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
					}
				});
			});
			function setHeight(textarea, height) {
				textarea.style.height = `${height}px`;
			}
		}
	}
}
// Form validation
export let formValidate = {
	getErrors(form) {
		let error = 0;
		let formRequiredItems = form.querySelectorAll("*[data-required]");
		if (formRequiredItems.length) {
			formRequiredItems.forEach(formRequiredItem => {
				if (
					(formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") &&
					!formRequiredItem.disabled
				) {
					error += this.validateInput(formRequiredItem);
				}
			});
		}
		return error;
	},
	validateInput(formRequiredItem) {
		let error = 0;
		if (formRequiredItem.dataset.required === "email") {
			formRequiredItem.value = formRequiredItem.value.replace(" ", "");
			if (this.emailTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				this.removeSuccess(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
				this.addSuccess(formRequiredItem);
			}
		} else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
			this.addError(formRequiredItem);
			this.removeSuccess(formRequiredItem);
			error++;
		} else {
			if (!formRequiredItem.value.trim()) {
				this.addError(formRequiredItem);
				this.removeSuccess(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
				this.addSuccess(formRequiredItem);
			}
		}
		return error;
	},
	addError(formRequiredItem) {
		formRequiredItem.classList.add("_form-error");
		formRequiredItem.parentElement.classList.add("_form-error");
		let inputError = formRequiredItem.parentElement.querySelector(".form__error");
		if (inputError) formRequiredItem.parentElement.removeChild(inputError);
		if (formRequiredItem.dataset.error) {
			formRequiredItem.parentElement.insertAdjacentHTML(
				"beforeend",
				`<div class="form__error">${formRequiredItem.dataset.error}</div>`
			);
		}
	},
	removeError(formRequiredItem) {
		formRequiredItem.classList.remove("_form-error");
		formRequiredItem.parentElement.classList.remove("_form-error");
		if (formRequiredItem.parentElement.querySelector(".form__error")) {
			formRequiredItem.parentElement.removeChild(
				formRequiredItem.parentElement.querySelector(".form__error")
			);
		}
	},
	addSuccess(formRequiredItem) {
		formRequiredItem.classList.add("_form-success");
		formRequiredItem.parentElement.classList.add("_form-success");
	},
	removeSuccess(formRequiredItem) {
		formRequiredItem.classList.remove("_form-success");
		formRequiredItem.parentElement.classList.remove("_form-success");
	},
	formClean(form) {
		form.reset();
		setTimeout(() => {
			let inputs = form.querySelectorAll("input,textarea");
			for (let index = 0; index < inputs.length; index++) {
				const el = inputs[index];
				el.parentElement.classList.remove("_form-focus");
				el.classList.remove("_form-focus");
				formValidate.removeError(el);
			}
			let checkboxes = form.querySelectorAll(".checkbox__input");
			if (checkboxes.length > 0) {
				for (let index = 0; index < checkboxes.length; index++) {
					const checkbox = checkboxes[index];
					checkbox.checked = false;
				}
			}
			if (flsModules.select) {
				let selects = form.querySelectorAll("div.select");
				if (selects.length) {
					for (let index = 0; index < selects.length; index++) {
						const select = selects[index].querySelector("select");
						flsModules.select.selectBuild(select);
					}
				}
			}
		}, 0);
	},
	emailTest(formRequiredItem) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
	}
};
/* Form submission */
export function formSubmit() {
	const forms = document.forms;
	if (forms.length) {
		for (const form of forms) {
			form.addEventListener("submit", function (e) {
				const form = e.target;
				formSubmitAction(form, e);
			});
			form.addEventListener("reset", function (e) {
				const form = e.target;
				formValidate.formClean(form);
			});
		}
	}
	async function formSubmitAction(form, e) {
		const error = !form.hasAttribute("data-no-validate") ? formValidate.getErrors(form) : 0;
		if (error === 0) {
			const ajax = form.hasAttribute("data-ajax");
			if (ajax) {
				// If ajax mode
				e.preventDefault();
				const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
				const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
				const formData = new FormData(form);

				form.classList.add("_sending");
				const response = await fetch(formAction, {
					method: formMethod,
					body: formData
				});
				if (response.ok) {
					let responseResult = await response.json();
					form.classList.remove("_sending");
					formSent(form, responseResult);
				} else {
					alert("Error");
					form.classList.remove("_sending");
				}
			} else if (form.hasAttribute("data-dev")) {
				// If development mode
				e.preventDefault();
				formSent(form);
			}
		} else {
			e.preventDefault();
			if (form.querySelector("._form-error") && form.hasAttribute("data-goto-error")) {
				const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : "._form-error";
				gotoBlock(formGoToErrorClass, true, 1000);
			}
		}
	}
	// Actions after form submission
	function formSent(form, responseResult = ``) {
		// Create form submission event
		document.dispatchEvent(
			new CustomEvent("formSent", {
				detail: {
					form: form
				}
			})
		);
		// Show popup if popup module is connected
		// and form has specified settings
		setTimeout(() => {
			if (flsModules.popup) {
				const popup = form.dataset.popupMessage;
				popup ? flsModules.popup.open(popup) : null;
			}
		}, 0);
		// Clear form
		formValidate.formClean(form);
		// Log to console
		formLogging("Form submitted!");
	}
	function formLogging(message) {
		FLS("[Forms]: " + message);
	}
}
/* Quantity form module */
export function formQuantity() {
	document.addEventListener("click", function (e) {
		let targetElement = e.target;
		if (
			targetElement.closest("[data-quantity-plus]") ||
			targetElement.closest("[data-quantity-minus]")
		) {
			const valueElement = targetElement
				.closest("[data-quantity]")
				.querySelector("[data-quantity-value]");
			let value = parseInt(valueElement.value);
			if (targetElement.hasAttribute("data-quantity-plus")) {
				value++;
				if (+valueElement.dataset.quantityMax && +valueElement.dataset.quantityMax < value) {
					value = valueElement.dataset.quantityMax;
				}
			} else {
				--value;
				if (+valueElement.dataset.quantityMin) {
					if (+valueElement.dataset.quantityMin > value) {
						value = valueElement.dataset.quantityMin;
					}
				} else if (value < 1) {
					value = 1;
				}
			}
			targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]").value = value;
		}
	});
}

/*
export function formRating() {
	const ratings = document.querySelectorAll('.rating');
	if (ratings.length > 0) {
		initRatings();
	}
	// Main function
	function initRatings() {
		let ratingActive, ratingValue;
		// Iterate through all ratings on page
		for (let index = 0; index < ratings.length; index++) {
			const rating = ratings[index];
			initRating(rating);
		}
		// Initialize specific rating
		function initRating(rating) {
			initRatingVars(rating);

			setRatingActiveWidth();

			if (rating.classList.contains('rating_set')) {
				setRating(rating);
			}
		}
		// Initialize variables
		function initRatingVars(rating) {
			ratingActive = rating.querySelector('.rating__active');
			ratingValue = rating.querySelector('.rating__value');
		}
		// Update active stars width
		function setRatingActiveWidth(index = ratingValue.innerHTML) {
			const ratingActiveWidth = index / 0.05;
			ratingActive.style.width = `${ratingActiveWidth}%`;
		}
		// Ability to specify rating
		function setRating(rating) {
			const ratingItems = rating.querySelectorAll('.rating__item');
			for (let index = 0; index < ratingItems.length; index++) {
				const ratingItem = ratingItems[index];
				ratingItem.addEventListener("mouseenter", function (e) {
					// Update variables
					initRatingVars(rating);
					// Update active stars
					setRatingActiveWidth(ratingItem.value);
				});
				ratingItem.addEventListener("mouseleave", function (e) {
					// Update active stars
					setRatingActiveWidth();
				});
				ratingItem.addEventListener("click", function (e) {
					// Update variables
					initRatingVars(rating);

					if (rating.dataset.ajax) {
						// 'Submit' to server
						setRatingValue(ratingItem.value, rating);
					} else {
						// Display specified rating
						ratingValue.innerHTML = index + 1;
						setRatingActiveWidth();
					}
				});
			}
		}
		async function setRatingValue(value, rating) {
			if (!rating.classList.contains('rating_sending')) {
				rating.classList.add('rating_sending');

				// Send data (value) to server
				let response = await fetch('rating.json', {
					method: 'GET',

					//body: JSON.stringify({
					//	userRating: value
					//}),
					//headers: {
					//	'content-type': 'application/json'
					//}

				});
				if (response.ok) {
					const result = await response.json();

					// Get new rating
					const newRating = result.newRating;

					// Display new average result
					ratingValue.innerHTML = newRating;

					// Update active stars
					setRatingActiveWidth();

					rating.classList.remove('rating_sending');
				} else {
					alert("Error");

					rating.classList.remove('rating_sending');
				}
			}
		}
	}
}
*/

/* Star rating module */
export function formRating() {
	// Rating
	const ratings = document.querySelectorAll("[data-rating]");
	if (ratings) {
		ratings.forEach(rating => {
			const ratingValue = +rating.dataset.ratingValue;
			const ratingSize = +rating.dataset.ratingSize ? +rating.dataset.ratingSize : 5;
			formRatingInit(rating, ratingSize);
			ratingValue ? formRatingSet(rating, ratingValue) : null;
			document.addEventListener("click", formRatingAction);
		});
	}
	function formRatingAction(e) {
		const targetElement = e.target;
		if (targetElement.closest(".rating__input")) {
			const currentElement = targetElement.closest(".rating__input");
			const ratingValue = +currentElement.value;
			const rating = currentElement.closest(".rating");
			const ratingSet = rating.dataset.rating === "set";
			ratingSet ? formRatingGet(rating, ratingValue) : null;
		}
	}
	function formRatingInit(rating, ratingSize) {
		let ratingItems = ``;
		for (let index = 0; index < ratingSize; index++) {
			index === 0 ? (ratingItems += `<div class="rating__items">`) : null;
			ratingItems += `
				<label class="rating__item">
					<input class="rating__input" type="radio" name="rating" value="${index + 1}">
				</label>`;
			index === ratingSize ? (ratingItems += `</div">`) : null;
		}
		rating.insertAdjacentHTML("beforeend", ratingItems);
	}
	function formRatingGet(rating, ratingValue) {
		// Here rating (ratingValue) is sent to backend...
		// Get new average rating formRatingSend()
		// Or display the one specified by user
		const resultRating = ratingValue;
		formRatingSet(rating, resultRating);
	}
	function formRatingSet(rating, value) {
		const ratingItems = rating.querySelectorAll(".rating__item");
		const resultFullItems = parseInt(value);
		const resultPartItem = value - resultFullItems;

		if (rating.hasAttribute("data-rating-title")) {
			rating.title = value;
		}

		ratingItems.forEach((ratingItem, index) => {
			ratingItem.classList.remove("rating__item--active");
			ratingItem.querySelector("span") ? ratingItems[index].querySelector("span").remove() : null;

			if (index <= resultFullItems - 1) {
				ratingItem.classList.add("rating__item--active");
			}
			if (index === resultFullItems && resultPartItem) {
				ratingItem.insertAdjacentHTML(
					"beforeend",
					`<span style="width:${resultPartItem * 100}%"></span>`
				);
			}
		});
	}
	function formRatingSend() {}
}
