import Splide from '@splidejs/splide';

export default function mountCarusels() {
	document.getElementsByClassName('splide__slide').showUp()
	const slider = new Splide('#slider', {
		type: 'slide',
		pagination: true,
		perPage: 5,
		arrows: true,
		focus: 'center',
		isNavigation: true,
	})

	slider.mount()

	return slider
}

export function showLoader() {
	document.getElementById('carousel').style.display = 'none'
    document.getElementById('loader').style.display = 'block'
}

export function hideLoader() {
	document.getElementById('carousel').style.display = 'block'
	document.getElementById('loader').style.display = 'none'
}