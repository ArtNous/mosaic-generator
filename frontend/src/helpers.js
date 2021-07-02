Document.prototype.addSlideToPrimary = function(img) {
    const slide = this.createElement('li')
    slide.style.display = 'none'
    const imgElem = this.createElement('img')
    imgElem.src = img
    slide.classList.add('splide__slide')
    slide.append(imgElem)
    this.getElementById('primary-track').append(slide)
}

HTMLCollection.prototype.showUp = function() {
	for (const item of this) item.style.display = 'block'
}