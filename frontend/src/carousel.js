import Splide from '@splidejs/splide';

(function () {
	document.addEventListener('DOMContentLoaded', function () {
		new Splide('#introduction', {
			autoplay: true,
			// perPage: 3,
			isNavigation: false,
			arrows: false,
		}).mount();
	});
})()

export default function mountCarusels() {
	document.getElementsByClassName('splide__slide').showUp()
	const slider = new Splide('#slider', {
		type: 'loop',
		pagination: false,
		fixedWidth: '120px',
		fixedHeight: '120px',
		heightRatio: 1,
		arrows: true,
		focus: 'center',
		cover: true,
		isNavigation: true,
		padding: 0,
		breakpoints: {
			768: {
				fixedWidth: '70px',
				fixedHeight: '70px',
				arrows: false,
			}
		}
	})

	slider.mount()

	return slider
}

export function showLoader() {
	document.getElementById('loader-wrapper').style.opacity = 1
	document.getElementById('loader-wrapper').style.zIndex = 999999
}

export function hideLoader(init = false) {
	document.getElementById('loader-wrapper').style.opacity = 0
	document.getElementById('loader-wrapper').style.zIndex = -1
}
