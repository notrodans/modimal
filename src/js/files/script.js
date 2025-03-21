import { isMobile } from "./functions.js";
import { flsModules } from "./modules.js";
import { Popup } from "../libs/popup.js";

const header = document.querySelector(".header");

function updateHeight() {
	if (header) {
		const headerHeight = header.offsetHeight;
		document.body.style.setProperty("--header-height", `${headerHeight / 16}rem`);
	}
}

document.addEventListener("DOMContentLoaded", updateHeight);

const observer = new ResizeObserver(updateHeight);
if (header) {
	observer.observe(header);
}

const queryParams = new URLSearchParams(location.search);
const searchField = document.querySelector(".search-block__input");

if (searchField) {
	searchField.value = queryParams.get("q") || "";
}

for (const checkbox of document.querySelectorAll(".spollers-filters-form__input")) {
	if (checkbox.name && queryParams.has(checkbox.name)) {
		checkbox.checked = queryParams.getAll(checkbox.name).includes(checkbox.value);
	}
}

document.addEventListener("click", ({ target }) => {
	if (target.matches('[class*="__unhide"]')) {
		const input = target.closest(".password-block").querySelector(".password-block__input");
		input.type = input.type === "password" ? "text" : "password";
	}
});

const welcomePopup = new Popup("welcome-popup", {
	classes: {
		popup: "welcome-popup",
		wrapper: "welcome-popup__wrapper",
		container: "welcome-popup__container",
		content: "welcome-popup__content"
	}
});

const verifyPopup = new Popup("verify-popup", {
	classes: {
		popup: "verify-popup",
		wrapper: "verify-popup__wrapper",
		container: "verify-popup__container",
		content: "verify-popup__content"
	}
});

const sizePopup = new Popup("size-guide", {
	classes: {
		popup: "size-popup",
		wrapper: "size-popup__wrapper",
		container: "size-popup__container",
		content: "size-popup__content"
	}
});
