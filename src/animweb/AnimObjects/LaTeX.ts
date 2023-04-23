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
  size: number = 16
  parentDiv?: p5.Element
  rendered: boolean = false
  position: { x: number; y: number } = { x: 0, y: 0 }

  constructor(config: LaTeXProps) {
    super(config.scene)
    this.latex = config.latex
    let temp = JSON.stringify(this.latex).split('')
    temp.splice(0, 1)
    temp.splice(-1, 1)
    this.latexSVG = TeXToSVG(temp.join(''))
    if (config.color) this.color = config.color
    if (config.size) this.size = config.size
    if (config.parentData) {
      this.parentData = {
        ...this.parentData,
        ...config.parentData,
      }
    }
    if (config.position) {
      this.position = config.position
    }
    this.remove = () => this.parentDiv?.remove()
  }

  draw(p: p5) {
    if (!this.rendered) {
      if (this.transition) this.transition()
      console.log(this.latexSVG)
      let div = p.createDiv(this.latexSVG)
      let { x, y } = this.getAbsolutePosition(this.position)
      div.position(x, y)
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
      this.parentDiv = div

      anime({
        targets: `.${this.id} path`,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1500,
        direction: 'alternate',
        loop: false,
        complete() {
          div.elt
            .getElementsByTagName('path')
            .forEach((c: any) => (c.style.fill = 'black'))
        },
      })
      this.rendered = true
    }
  }
}
