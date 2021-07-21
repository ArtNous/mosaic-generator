import Splide from '@splidejs/splide';

(function () {
	document.addEventListener('DOMContentLoaded', function () {
		new Splide('#introduction', {
			autoplay: true,
			perPage: 3,
			isNavigation: false,
			arrows: false
		}).mount();
	});
})()

export default function mountCarusels() {
	document.getElementsByClassName('splide__slide').showUp()
	const slider = new Splide('#slider', {
		type: 'loop',
		pagination: true,
		fixedWidth: '96px',
		arrows: true,
		focus: 'center',
		isNavigation: true,
	})

	slider.mount()

	return slider
}

export function showLoader() {
	document.getElementById('loader').style.display = 'block'
	document.getElementById('wrapper').style.display = 'none'
}

export function hideLoader() {
	document.getElementById('wrapper').style.display = 'block'
	document.getElementById('loader').style.display = 'none'
}