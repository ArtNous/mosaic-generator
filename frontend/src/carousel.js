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
	/* document.getElementById('loader').style.display = 'block'
	document.getElementsByClassName('buttons')[0].style.visibility = 'hidden'
	document.getElementById('wrapper').style.visibility = 'hidden'
	document.getElementById('btnSearch').style.visibility = 'hidden'
	document.getElementById('slider-wrapper').style.visibility = 'hidden' */
}

export function hideLoader(init = false) {
	document.getElementById('loader-wrapper').style.opacity = 0
	document.getElementById('loader-wrapper').style.zIndex = -1
	/* if(!init) {
		document.getElementById('slider-wrapper').style.visibility = 'inherit'
		document.getElementById('wrapper').style.visibility = 'inherit'
		document.getElementsByClassName('buttons')[0].style.visibility = 'inherit'
		document.getElementById('btnSearch').style.visibility = 'inherit'
		document.getElementsByTagName('header')[0].style.visibility = 'inherit'
	}
	document.getElementById('loader').style.display = 'none' */
}
