import p5 from 'p5'
import AnimObject, { AnimObjectProps } from '../AnimObject'
import Color from '../helpers/Color'
import TeXToSVG from './../helpers/TexToSVG'
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
    let temp = JSON.stringify(this.latex).split('')
    temp.splice(0, 1)
    temp.splice(-1, 1)
    this.latexSVG = TeXToSVG(temp.join(''))
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
      if (!this.rendered) {
      }
      let div = p.createDiv(this.latexSVG)
      div.position(this.x, this.y)
      div.class(this.id)
      let uses = [...div.elt.getElementsByTagName('use')]
      uses.forEach((u: any) => {
        let el = document.querySelector(u.getAttribute('xlink:href'))
        el.style.fill = 'none'
        el.style.strokeWidth = `1rem`
        el.style.stroke = 'black'
        u.parentNode.prepend(el.cloneNode())
        u.remove()
      })
      div.style('transform', `scale(${this.size / 10})`)
      anime({
        targets: `.${this.id} path`,
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
