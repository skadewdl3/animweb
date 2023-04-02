import p5 from 'p5'
import AnimObject, { AnimObjectProps } from '../AnimObject'
import Color from '../helpers/Color'
import TeXToSVG from 'tex-to-svg'
import svg64 from 'svg64'

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

  constructor(config: LaTeXProps) {
    super()
    this.latex = config.latex
    this.latexSVG = TeXToSVG(this.latex)
    this.base64 = svg64(this.latexSVG)
    console.log(this.base64)
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
    // if (this.transition) this.transition()
    // p.fill(this.color.rgba)
    // p.textSize(this.size)
    // p.text(this.latex, this.x, this.y)
    // p.noFill()
    if (this.latexImage) p.image(this.latexImage, this.x, this.y)
  }
}
