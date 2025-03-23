import { bodyLock, bodyUnlock } from "../files/functions.js";

class Popup {
	constructor(id, options = {}) {
		this.id = id;
		this.popup = document.querySelector(`#${id}`);
		if (!this.popup) return;

		this.lockBody = options.lockBody ?? true;

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

		this.popupOpenButton = document.querySelector(`[data-open-popup="${this.id}"]`);
		this.popupCloseButton = document.querySelector(`[data-close-popup="${this.id}"]`);
		this.popupWrapper = this.popup.querySelector(`.${this.classes.wrapper}`);
		this.popupContainer = this.popup.querySelector(`.${this.classes.container}`);
		this.popupContent = this.popup.querySelector(`.${this.classes.content}`);

		if (!this.popupOpenButton) {
			throw Error("Doesn't have open button", { cause: `Popup with id: ${this.id}` });
		}

		if (!this.popupCloseButton) {
			throw Error("Doesn't have close button", { cause: `Popup with id: ${this.id}` });
		}

		this.focusableElements =
			'button,[href],input,select,textarea,summary,[tabindex]:not([tabindex="-1"])';
		this.firstFocusableElement = null;
		this.lastFocusableElement = null;

		this.init();
	}

	init() {
		if (!this.popup) return;

		this.setupEventListeners();
		this.setupButtons();
		this.setupFocusableElement();
		this.setupHashHandler();
	}

	setupEventListeners() {
		document.addEventListener("click", e => this.handleClickOutside(e));
		document.addEventListener("keydown", e => this.handleEscapeKey(e));
	}

	handleClickOutside(e) {
		if (e.target !== this.popupOpenButton && !e.target.closest(`.${this.classes.content}`)) {
			this.close();
		}
	}

	handleEscapeKey(e) {
		if (e.key === "Escape" && this.isOpen) {
			this.close();
		}
	}

	setupButtons() {
		this.popupOpenButton.addEventListener("click", () => this.toggle());
		this.popupCloseButton.addEventListener("click", () => this.close());
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

	setupFocusableElement() {
		if (!this.popupContent) return;

		const focusableElements = this.popupContent.querySelector(this.focusableElements);
		this.firstFocusableElement = focusableElements;
	}

	disableFocusOutsidePopup() {
		const focusableElementsOutside = document.querySelectorAll(`body *:not(#${this.id} *)`);

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
		const focusableElementsOutside = document.querySelectorAll(`body *:not(#${this.id} *)`);

		for (const element of focusableElementsOutside) {
			if (!element.matches(this.focusableElements)) continue;

			const originalTabIndex = element.getAttribute("data-original-tabindex");

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
		document.documentElement.classList.remove("menu-open");
		this.isOpen = true;
		this.popup.setAttribute("aria-hidden", "false");

		document.body.classList.add(this.classes.showBody);
		this.popup.classList.add(this.classes.showPopup);
		document.documentElement.classList.add(this.classes.showBody);

		if (this.lockBody) {
			bodyLock(150);
		}

		if (this.firstFocusableElement) {
			this.firstFocusableElement.focus();
		}

		this.disableFocusOutsidePopup();

		const url = new URL(window.location);
		url.hash = this.id;
		history.replaceState(null, null, url);
	}

	close() {
		if (!this.popup || !this.isOpen) return;
		this.isOpen = false;
		this.popup.setAttribute("aria-hidden", "true");

		document.body.classList.remove(this.classes.showBody);
		this.popup.classList.remove(this.classes.showPopup);
		document.documentElement.classList.remove(this.classes.showBody);
		if (this.lockBody) {
			bodyUnlock(150);
		}

		this.enableFocusOutsidePopup();

		if (window.location.hash === `#${this.id}`) {
			const url = new URL(window.location);
			url.hash = "";
			history.replaceState(null, null, url);
		}

		this.popupOpenButton.focus();
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
