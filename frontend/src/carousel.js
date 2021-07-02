import Splide from '@splidejs/splide';

export default function mountCarusels(images) {
	document.getElementsByClassName('splide__slide').showUp()
	const secondarySlider = new Splide('#secondary-slider', {
		rewind: true,
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

	primarySlider.on('move', (newIndex, oldIndex) => {
		const movedPlaces = newIndex - oldIndex
		const url = new URL(`${SERVER}/carousel-images`)
		const urlParams = new URLSearchParams()
		urlParams.append('indices', [images.length - 1 + 	movedPlaces].join(','))
		url.search = urlParams

		if(movedPlaces > 0) {
			/* const pos = newIndex - 3 - movedPlaces
			images.splice(Math.max(pos, 0), movedPlaces) */
			// Fetch al servidor pidiendo movedPlaces imagenes
			/* fetch(url)
			.then(response => response.json())
			.then(({fetchedImages}) => {
				if (Array.isArray(fetchedImages)) {
					for (const newImage of fetchedImages) {
						this.add(document.addSlideToPrimary(newImage))
					}
				}
			})
			.catch(error => {
				alert('Error obteniendo las imagenes')
			}) */
		} else {

		}
	})

	primarySlider.sync(secondarySlider).mount()

	return primarySlider
}