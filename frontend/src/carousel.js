import Splide from '@splidejs/splide';

import { alternate } from './transitioner'

export default function mountCarusels(images) {
	document.getElementsByClassName('splide__slide').showUp()
	const secondarySlider = new Splide('#secondary-slider', {
		fixedWidth: 100,
		fixedHeight: 64,
		isNavigation: true,
		gap: 10,
		focus: 'center',
		pagination: false,
		cover: true,
		breakpoints: {
			'600': {
				fixedWidth: 66,
				fixedHeight: 40,
			}
		}
	}).mount();

	const primarySlider = new Splide('#primary-slider', {
		type: 'fade',
		heightRatio: 0.5,
		pagination: false,
		arrows: false,
		cover: true,
	})	

	primarySlider.sync(secondarySlider).mount()	

	return secondarySlider
}