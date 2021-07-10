import Splide from '@splidejs/splide';

export default function mountCarusels() {
	document.getElementsByClassName('splide__slide').showUp()
	const slider = new Splide('#slider', {
		fixedWidth: 100,
		height: 60,
		gap: 10,
		cover: true,
		pagination: false,
		isNavigation: true,
		breakpoints: {
			'600': {
				fixedWidth: 66,
				height: 40,
			}
		},
		focus: 'center'
	}).mount();

	return slider
}