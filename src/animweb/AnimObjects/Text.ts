import p5 from 'p5'
import AnimObject, { AnimObjectProps } from '../AnimObject'
import StandardColors from '../helpers/StandardColors'
import { Observables } from '../AnimObject'
import { roundOff } from '../helpers/miscellaneous'
import Color from '../helpers/Color'

interface TextProps extends AnimObjectProps {
  text?: string | number
  color?: Color
  size?: number
  position?: {
    x: number
    y: number
  }
  style?: TextStyle
  parentData?: {
    origin?: { x: number; y: number }
    stepX?: number
    stepY?: number
  }
}

export enum TextStyle {
  none,
  italic,
  bold,
  boldItalic,
}

export default class Text extends AnimObject {
  text: string | number = ''
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
  style: TextStyle = TextStyle.none

  constructor(config: TextProps = {}) {
    super()
    if (config.text) this.text = config.text
    if (config.color) this.color = config.color
    if (config.size) this.size = config.size
    if (config.style) {
      this.style = config.style
    }
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

  link(object: AnimObject, prop: Observables) {
    if (!(prop in object)) return

    let observer = {
      property: prop,
      handler: (text: string) => {
        switch (prop) {
          case Observables.slope:
            this.text = `Slope: ${roundOff(parseFloat(text), 3)}`
            break
          default:
            this.text = text
        }
      },
    }

    object.addObserver(observer)
  }

  draw(p: p5) {
    p.fill(this.color.rgba)
    p.textSize(this.size)
    switch (this.style) {
      case TextStyle.bold:
        p.textStyle(p.BOLD)
        break
      case TextStyle.italic:
        p.textStyle(p.ITALIC)
        break
      case TextStyle.boldItalic:
        p.textStyle(p.BOLDITALIC)
        break
    }
    p.text(this.text, this.x, this.y)
    p.noFill()
  }
}
