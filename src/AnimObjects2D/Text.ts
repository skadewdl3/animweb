import p5 from 'p5'
import AnimObject from '@/core/AnimObject2D'
import { textToSVGPolygons } from '@helpers/TextToSVG'
import { createSVG, removeSVG } from '@helpers/addSVG'
import { TextProps } from '@/interfaces/AnimObjects2D'
import { TextStyle } from '@/enums/AnimObjects2D'

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
    config.text && (this.text = config.text.toString())

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

  draw(p: p5) {
    if (this.transition) this.transition()
  }
}
