import Swiper from "swiper";
import {
	Autoplay,
	EffectFade,
	Keyboard,
	Navigation,
	Pagination,
	Scrollbar,
	Thumbs
} from "swiper/modules";

function makeSliderOptions(params) {
	if (!params.paginationElement) throw "Pagination element not defined";

	return {
		modules: [Keyboard, Navigation, Autoplay, EffectFade, Pagination],
		observer: true,
		observeParents: true,
		slidesPerView: 3,
		spaceBetween: 24,
		//simulateTouch: false,
		//autoHeight: true,
		speed: 800,

		//touchRatio: 0,
		//simulateTouch: false,
		//loop: true,
		//preloadImages: false,
		//lazy: true,
		pagination: {
			el: params.paginationElement,
			clickable: true
		},

		keyboard: {
			enabled: true
		},

		//effect: 'fade',
		autoplay: {
			delay: 1000,
			disableOnInteraction: true
		},

		// Scrollbar
		/*
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
    },
    */

		// Buttons "left/right"
		//navigation: {
		//	prevEl: ".swiper-button-prev",
		//	nextEl: ".swiper-button-next"
		//},
		// Breakpoints
		breakpoints: {
			320: {
				slidesPerView: 1,
				spaceBetween: 16,
				autoHeight: true
			},
			490: {
				slidesPerView: 2,
				spaceBetween: 16
			},
			768: {
				slidesPerView: 3,
				spaceBetween: 16
			},
			992: {
				slidesPerView: 3,
				spaceBetween: 20
			},
			1224: {
				slidesPerView: 3,
				spaceBetween: 24
			}
		}
	};
}

function initSliders() {
	if (document.querySelector(".best-sellers__slider")) {
		new Swiper(".best-sellers__slider", {
			...makeSliderOptions({ paginationElement: ".best-sellers__pagination" })
		});
	}

	if (document.querySelector("#also-like")) {
		new Swiper("#also-like", {
			...makeSliderOptions({ paginationElement: ".recommendations__pagination" })
		});
	}

	if (document.querySelector(".modiweek__slider")) {
		new Swiper(".modiweek__slider", {
			...makeSliderOptions({ paginationElement: ".modiweek__pagination" })
		});
	}

	if (document.querySelector("#product-hero-slider")) {
		new Swiper("#product-hero-slider", {
			modules: [Keyboard, Autoplay, EffectFade, Pagination],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			slidesPerGroup: 1,
			spaceBetween: 24,
			speed: 1000,
			effect: "fade",
			fadeEffect: {
				crossFade: true
			},

			keyboard: {
				enabled: true
			},

			pagination: {
				el: ".hero__pagination",
				clickable: true
			},

			//effect: 'fade',
			autoplay: {
				delay: 1000,
				disableOnInteraction: true
			}
		});
	}

	if (
		document.querySelector(".product__thumbnails") &&
		document.querySelector(".product__slider")
	) {
		const productThumbs = new Swiper(".product__thumbnails", {
			modules: [Scrollbar],
			observer: true,
			observeParents: true,
			slidesPerView: 3,
			spaceBetween: 16,
			direction: "vertical",
			speed: 1000,
			autoHeight: true,
			scrollbar: {
				el: ".product__scrollbar",
				draggable: true
			},
			breakpoints: {
				320: {
					enabled: false
				},
				["767.98"]: {
					enabled: true
				}
			}
		});

		new Swiper(".product__slider", {
			modules: [Keyboard, Pagination, EffectFade, Thumbs],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			slidesPerGroup: 1,
			speed: 1000,
			effect: "fade",
			fadeEffect: {
				crossFade: true
			},
			keyboard: {
				enabled: true
			},
			thumbs: {
				swiper: productThumbs
			},
			breakpoints: {
				0: {
					pagination: {
						el: ".product__pagination",
						clickable: true
					}
				},
				["767.98"]: {}
			}
		});
	}
}

// Scroll on the basis of a slider (by class swiper scroll for the slider wrapper)
function initSlidersScroll() {
	let sliderScrollItems = document.querySelectorAll(".swiper_scroll");
	if (sliderScrollItems.length > 0) {
		for (let index = 0; index < sliderScrollItems.length; index++) {
			const sliderScrollItem = sliderScrollItems[index];
			const sliderScrollBar = sliderScrollItem.querySelector(".swiper-scrollbar");
			const sliderScroll = new Swiper(sliderScrollItem, {
				observer: true,
				observeParents: true,
				direction: "vertical",
				slidesPerView: "auto",
				freeMode: {
					enabled: true
				},
				scrollbar: {
					el: sliderScrollBar,
					draggable: true,
					snapOnRelease: false
				},
				mousewheel: {
					releaseOnEdges: true
				}
			});
			sliderScroll.scrollbar.updateSize();
		}
	}
}

window.addEventListener("load", function (e) {
	initSliders();
	//initSlidersScroll();
});
