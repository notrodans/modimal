import { bodyLock, bodyUnlock } from "../files/functions.js";

class Popup {
	constructor(id, options = {}) {
		this.id = id;
		this.popup = document.querySelector(`#${id}`);
		if (!this.popup) return;

		this.isOpen = false;

		this.classes = {
			popup: "popup",
			wrapper: "popup__wrapper",
			container: "popup__container",
			content: "popup__content",
			showBody: "_show-body",
			showPopup: "_show",
			...options.classes
		};

		this.popupWrapper = this.popup.querySelector(`.${this.classes.wrapper}`);
		this.popupContainer = this.popup.querySelector(`.${this.classes.container}`);
		this.popupContent = this.popup.querySelector(`.${this.classes.content}`);

		this.focusableElements =
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
		this.firstFocusableElement = null;
		this.lastFocusableElement = null;

		this.init();
	}

	init() {
		if (!this.popup) return;

		this.setupEventListeners();
		this.setupOpenCloseButtons();
		this.setupFocusTrap();
		this.setupHashHandler();
	}

	setupEventListeners() {
		this.popup.addEventListener("click", e => this.handleClickOutside(e));
		document.addEventListener("keydown", e => this.handleEscapeKey(e));
	}

	handleClickOutside(e) {
		if (e.target === this.popup || !e.target.closest(`.${this.classes.content}`)) {
			this.close();
		}
	}

	handleEscapeKey(e) {
		if (e.key === "Escape" && this.isOpen) {
			this.close();
		}
	}

	setupOpenCloseButtons() {
		this.setupButtons(`[data-open-popup="${this.id}"]`, () => this.open());
		this.setupButtons(`[data-close-popup="${this.id}"]`, () => this.close());
	}

	setupButtons(selector, handler) {
		const buttons = document.querySelectorAll(selector);
		if (buttons.length === 0) return;

		for (const button of buttons) {
			button.addEventListener("click", handler);
		}
	}

	setupFocusTrap() {
		if (!this.popupContent) return;

		const focusableElements = this.popupContent.querySelectorAll(this.focusableElements);
		if (focusableElements.length === 0) return;

		this.firstFocusableElement = focusableElements[0];
		this.lastFocusableElement = focusableElements[focusableElements.length - 1];

		this.popupContent.addEventListener("keydown", e => this.handleTabKey(e));
	}

	handleTabKey(e) {
		if (e.key !== "Tab") return;

		if (e.shiftKey && document.activeElement === this.firstFocusableElement) {
			e.preventDefault();
			this.lastFocusableElement.focus();
		} else if (!e.shiftKey && document.activeElement === this.lastFocusableElement) {
			e.preventDefault();
			this.firstFocusableElement.focus();
		}
	}

	disableFocusOutsidePopup() {
		const focusableElementsOutside = document.querySelectorAll(
			`body *:not(#${this.id}):not(#${this.id} *)`
		);

		for (const element of focusableElementsOutside) {
			if (!element.matches(this.focusableElements)) continue;

			const originalTabIndex = element.getAttribute("tabindex");
			element.setAttribute("data-original-tabindex", originalTabIndex || "");

			if (originalTabIndex !== "-1") {
				element.setAttribute("tabindex", "-1");
			}
		}
	}

	enableFocusOutsidePopup() {
		const focusableElementsOutside = document.querySelectorAll(
			`body *:not(#${this.id}):not(#${this.id} *)`
		);

		for (const element of focusableElementsOutside) {
			if (!element.matches(this.focusableElements)) continue;

			const originalTabIndex = element.getAttribute("data-original-tabindex");
			if (originalTabIndex === null) continue;

			if (originalTabIndex === "") {
				element.removeAttribute("tabindex");
			} else {
				element.setAttribute("tabindex", originalTabIndex);
			}
			element.removeAttribute("data-original-tabindex");
		}
	}

	setupHashHandler() {
		window.addEventListener("hashchange", () => this.checkHash());
		this.checkHash();
	}

	checkHash() {
		if (window.location.hash === `#${this.id}`) {
			this.open();
		} else if (this.isOpen) {
			this.close();
		}
	}

	open() {
		if (!this.popup || this.isOpen) return;

		document.body.classList.add(this.classes.showBody);
		this.popup.classList.add(this.classes.showPopup);
		document.documentElement.classList.add(this.classes.showBody);
		bodyLock();
		this.isOpen = true;

		if (this.firstFocusableElement) {
			this.firstFocusableElement.focus();
		}

		this.disableFocusOutsidePopup();
		this.popup.setAttribute("aria-hidden", "false");

		const url = new URL(window.location);
		url.hash = this.id;
		history.replaceState(null, null, url);
	}

	close() {
		if (!this.popup || !this.isOpen) return;

		document.body.classList.remove(this.classes.showBody);
		this.popup.classList.remove(this.classes.showPopup);
		document.documentElement.classList.remove(this.classes.showBody);
		bodyUnlock();
		this.isOpen = false;

		this.enableFocusOutsidePopup();
		this.popup.setAttribute("aria-hidden", "true");

		if (window.location.hash === `#${this.id}`) {
			const url = new URL(window.location);
			url.hash = "";
			history.replaceState(null, null, url);
		}
	}
	toggle() {
		if (this.isOpen) {
			this.close();
		} else {
			this.open();
		}
	}
}

export { Popup };
