import LazyLoad from "vanilla-lazyload";

// Works with objects with ._lazy class
const lazyMedia = new LazyLoad({
	elements_selector: "[data-src],[data-srcset]",
	class_loaded: "_lazy-loaded",
	use_native: true
});

// Update module
//lazyMedia.update();
