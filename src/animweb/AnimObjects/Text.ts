import p5 from 'p5'
import AnimObject, { AnimObjectProps, Observer } from '../AnimObject'
import Colors from '../helpers/Colors'
import { Observables } from '../AnimObject'
import { roundOff } from '../helpers/miscellaneous'
import Color from '../helpers/Color'
import { textToSVGPolygons } from '../helpers/TextToSVG'
import { createSVG, removeSVG } from '../helpers/addSVG'

interface TextProps extends AnimObjectProps {
  text: string | number
  color?: Color
  size?: number
  x: number
  y: number
  style?: TextStyle
  font?: any
}

export enum TextStyle {
  none,
  italic,
  bold,
  boldItalic,
}

export default class Text extends AnimObject {
  text: string = ''
  size: number = 16
  x: number = this.parentData.origin.x
  y: number = this.parentData.origin.y
  style: TextStyle = TextStyle.none
  font: any = null
  svg?: string
  svgEl?: SVGElement

  constructor(config: TextProps) {
    super(config.scene)
    this.x = config.x
    this.y = config.y
    this.text = config.text.toString()

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
    if (config.font) this.font = config.font
    createSVG(textToSVGPolygons(this.text, { size: this.size }), {
      id: this.id,
      y: this.parentData.origin.x + this.y,
      x: this.parentData.origin.y + this.x,
    }).then((el) => {
      this.svgEl = el
      this.remove = () => removeSVG(this.id)
    })
  }

  link(object: AnimObject, prop: Observables, callback: Function) {
    if (!(prop in object)) return

    let observer = {
      property: prop,
      handler: (text: string) => {
        let value = ''
        switch (prop) {
          case Observables.slope:
          case Observables.x:
          case Observables.y:
            value = roundOff(parseFloat(text), 3).toString()
            break
          default:
            value = text
            break
        }
        callback(value)
      },
    }

    object.addObserver(observer)
  }

  draw(p: p5) {
    if (this.transition) this.transition()
  }
}
