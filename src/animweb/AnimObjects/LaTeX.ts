import p5 from 'p5'
import AnimObject, { AnimObjectProps } from '../AnimObject'
import Color from '../helpers/Color'
import TeXToSVG from 'tex-to-svg'
import svg64 from 'svg64'
import anime from 'animejs'

interface LaTeXProps extends AnimObjectProps {
  latex: string
  color?: Color
  size?: number
  position?: {
    x: number
    y: number
  }
  parentData?: {
    origin?: { x: number; y: number }
    stepX?: number
    stepY?: number
  }
}

export default class LaTeX extends AnimObject {
  latex: string = ''
  latexSVG: string = ''
  base64: string = ''
  latexImage: any
  size: number = 16
  x: number
  y: number
  parentData: {
    origin: { x: number; y: number }
    stepX: number
    stepY: number
  } = {
    origin: { x: this.sceneWidth / 2, y: this.sceneHeight / 2 },
    stepX: 1,
    stepY: 1,
  }
  rendered: boolean = false

  constructor(config: LaTeXProps) {
    super()
    this.latex = config.latex
    this.latexSVG = TeXToSVG(this.latex)
    this.base64 = svg64(this.latexSVG)
    // console.log(this.base64)
    if (config.color) this.color = config.color
    if (config.size) this.size = config.size
    if (config.parentData) {
      this.parentData = {
        ...this.parentData,
        ...config.parentData,
      }
    }
    this.x = this.parentData.origin.x
    this.y = this.parentData.origin.y
    if (config.position) {
      this.x += config.position.x * this.parentData.stepX
      this.y -= config.position.y * this.parentData.stepY
    }
  }

  draw(p: p5) {
    if (!this.latexImage) this.latexImage = p.loadImage(this.base64)
    if (this.latexImage && !this.rendered) {
      if (this.transition) this.transition()
      p.image(this.latexImage, this.x, this.y)
      let div = p.createDiv(this.latexSVG)
      div.position(this.x, this.y)
      div.class('bruh')
      let uses = [...div.elt.getElementsByTagName('use')]
      uses.forEach((u: any) => {
        console.log(u)
        let el = document.querySelector(u.getAttribute('xlink:href'))
        el.style.fill = 'none'
        el.style.strokeWidth = '5rem'
        el.style.stroke = 'black'
        u.parentNode.prepend(el)
        u.remove()
      })
      div.style('transform', 'scale(2)')
      anime({
        targets: '.bruh path',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1500,
        direction: 'alternate',
        loop: false,
      })
      this.rendered = true
    }
  }
}
