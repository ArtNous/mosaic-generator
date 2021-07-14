import Splide from '@splidejs/splide';

export default function mountCarusels() {
	document.getElementsByClassName('splide__slide').showUp()
	const slider = new Splide('#slider', {
		type: 'slide',
		pagination: true,
		perPage: 5,
		arrows: true,
		focus: 'center',
		isNavigation:true,
	})

	slider.mount()

	return slider
}