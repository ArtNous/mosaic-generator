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
	document.getElementById('loader').style.display = 'block'
	document.getElementsByClassName('buttons')[0].style.display = 'none'
	document.getElementById('wrapper').style.display = 'none'
	document.getElementById('btnSearch').style.display = 'none'
	document.getElementById('slider-wrapper').style.display = 'none'
}

export function hideLoader(init = false) {
	if(!init) {
		document.getElementById('slider-wrapper').style.display = 'flex'
		document.getElementById('wrapper').style.display = 'block'
		document.getElementsByClassName('buttons')[0].style.display = 'flex'
		document.getElementById('btnSearch').style.display = 'inline-block'
		document.getElementsByTagName('header')[0].style.display = 'flex'
	}
	document.getElementById('loader').style.display = 'none'
}
