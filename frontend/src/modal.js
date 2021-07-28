import { updateSize } from './transitioner'
const overlay = document.getElementById('overlay')
const tooltip = document.getElementById('tooltip')
const arrow = document.getElementById('arrow')
const btnNext = document.getElementById('tooltipNext')
const btnPrev = document.getElementById('tooltipPrev')


const stages = [{
    title: 'Mosaico',
    description: 'Aquí veras y podrás interactuar con el mosaico. Haz scroll para navegar entre mosaicos.',
    element: 'scene'
}, {
    title: 'Galeria',
    description: 'Aquí puedes navegar entre los distintos mosaicos.',
    element: 'slider-wrapper'
}, {
    title: 'Buscar',
    description: 'Pulsa para descubrir nuevos mosaicos',
    element: 'btnSearch'
}, {
    title: 'ZoomIn',
    description: 'Pulsa para acercar',
    element: 'btnZoomIn'
}, {
    title: 'ZoomOut',
    description: 'Pulsa para alejar',
    element: 'btnZoomOut'
}]

let i = -1

export function hideAndExtend() {
    document.getElementById('tooltip-wrapper').style.display = 'none'
    document.getElementsByTagName('header')[0].style.display = 'flex'
    document.getElementById('carousel').classList.toggle('extended')
    updateSize()
}

export default function placeTooltip(inc, callback = null) {
    i += inc
    if (i === 0) {
        btnPrev.style.visibility = 'hidden'
    } else if (i === (stages.length - 1)) {
        btnNext.textContent = 'Finalizar'
        btnPrev.style.visibility = 'inherit'
    } else if (i === stages.length) {
        hideAndExtend()
        return false
    } else {
        btnNext.textContent = 'SIGUIENTE'
        btnPrev.classList.remove('disabled')
        btnNext.classList.remove('disabled')
        btnPrev.disabled = false
        btnPrev.style.visibility = 'inherit'
    }

    const bullets = document.getElementById('bullets').childNodes
    for (const bullet of bullets) {
        bullet.classList.remove('active')
    }
    if(i < stages.length) bullets[i].classList.add('active')

    const target = document.getElementById(stages[i].element)
    const parametros = target.getBoundingClientRect()
    const position = JSON.parse(target.dataset.position)
    const tooltipProperties = tooltip.getBoundingClientRect()
    const arrowProperties = arrow.getBoundingClientRect()
    document.getElementById('title').textContent = stages[i].title
    document.getElementById('description').textContent = stages[i].description
    let pos = ''
    let offsetX = 0, offsetY = 0
    switch (position.arx) {
        case 'left':
            offsetX = arrowProperties.width + 10
            pos = `translateX(${-arrowProperties.width - 10}px)`
            break;
        case 'left-inner':
            offsetX = 0
            pos = `translateX(0px)`
            break;
        case 'center':
            pos = `translateX(${parametros.left + parametros.width / 2 - arrowProperties.width / 2}px)`
            break;
        case 'right':
            offsetX = -arrowProperties.width - 30
            pos = `translateX(${tooltipProperties.width + 15}px)`
            break;
        case 'right-inner':
            offsetX = 0
            pos = `translateX(${tooltipProperties.width - arrowProperties.width - 20}px)`
            break;

        default:
            break;
    }
    switch (position.ary) {
        case 'top':
            offsetY = arrowProperties.height
            pos += ` translateY(${-arrowProperties.height}px)`
            break;
        case 'top-inner':
            offsetY = 0
            pos += ` translateY(0px)`
            break;
        case 'middle':
            pos += ` translateY(${parametros.top + parametros.height / 2 - arrowProperties.height / 2}px)`
            break;
        case 'bottom':
            offsetY = -arrowProperties.height
            pos += ` translateY(${parametros.height}px)`
            break;
        case 'bottom-inner':
            offsetY = 0
            pos += ` translateY(${parametros.height - arrowProperties.height}px)`
            break;

        default:
            break;
    }

    pos += ` rotate(${position.ard}deg)`

    arrow.style.transform = pos
    pos = ''
    switch (position.y) {
        case 'top':
            pos = `translateY(${parametros.top - tooltipProperties.height + offsetY}px)`
            break;
        case 'top-inner':
            pos = `translateY(${parametros.top + offsetY}px)`
            break;
        case 'middle':
            pos = `translateY(${parametros.top + parametros.height / 2 - tooltipProperties.height / 2}px)`
            break;
        case 'bottom':
            pos = `translateY(${parametros.bottom + 10 + offsetY}px)`
            break;
        case 'bottom-inner':
            pos = `translateY(${parametros.bottom - tooltipProperties.height + offsetY}px)`
            break;

        default:
            break;
    }

    switch (position.x) {
        case 'left':
            pos += ` translateX(${parametros.left - tooltipProperties.width + offsetX}px)`
            break;
        case 'left-inner':
            pos += ` translateX(${parametros.left + offsetX}px)`
            break;
        case 'center':
            pos += ` translateX(${parametros.left + parametros.width / 2 - tooltipProperties.width / 2}px)`
            break;
        case 'right':
            pos += ` translateX(${parametros.right + offsetX}px)`
            break;
        case 'right-inner':
            pos += ` translateX(${parametros.right - tooltipProperties.width + offsetX}px)`
            break;

        default:
            break;
    }
    tooltip.style.transform = pos

    overlay.style.left = `${parametros.left}px`
    overlay.style.top = `${parametros.top}px`
    overlay.style.width = `${parametros.right - parametros.left}px`
    overlay.style.height = `${parametros.bottom - parametros.top}px`
}

btnNext.addEventListener('click', () => placeTooltip(1))

btnPrev.addEventListener('click', () => placeTooltip(-1))
