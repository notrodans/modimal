import Swiper from "swiper";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";

function makeSliderOptions(params) {
	if (!params.paginationElement) throw "Pagination element not defined";

	return {
		modules: [Navigation, Autoplay, EffectFade, Pagination],
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
				spaceBetween: 0,
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

	if (document.querySelector(".modiweek__slider")) {
		new Swiper(".modiweek__slider", {
			...makeSliderOptions({ paginationElement: ".modiweek__pagination" })
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
