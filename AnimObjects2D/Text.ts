import p5 from 'p5'
import AnimObject from '@core/AnimObject2D.ts'
import { textToSVGPolygons } from '@helpers/TextToSVG.ts'
import { createSVG, removeSVG } from '@helpers/addSVG.ts'
import { TextProps } from '@interfaces/AnimObjects2D.ts'
import { TextStyle } from '@enums/AnimObjects2D.ts'

export default class Text extends AnimObject {
  text: string = ''
  size: number = 16
  x: number = this.parentData.origin.x
  y: number = this.parentData.origin.y
  style: TextStyle = TextStyle.none
  font: any = null
  svg?: string
  svgEl?: SVGElement
  animating?: boolean = false

  constructor(config: TextProps) {
    super(config.scene)
    this.x = config.x || 0
    this.y = config.y || 0
    if (config.text != undefined && config.text != null) {
      this.text = config.text.toString()
      console.log(this.text)
    }

    if (config.color) this.color = config.color
    if (config.size) this.size = config.size > 40 ? 40 : config.size
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
    createSVG(
      textToSVGPolygons(this.text, {
        size: this.size,
      }),
      {
        id: this.id,
        y: this.parentData.origin.x + this.y,
        x: this.parentData.origin.y + this.x,
      }
    ).then((el) => {
      this.svgEl = el
      this.remove = () => removeSVG(this.id)
    })
  }

  draw(p: p5) {
    if (this.transition) this.transition()
    if (!this.animating) {
      p.fill(this.color.rgba)
      p.strokeWeight(1)
      p.stroke(this.color.rgba)
      p.textFont('sans-serif')
      p.textSize(this.size)
      p.textAlign(p.LEFT, p.TOP)
      p.text(this.text.toString(), this.x, this.y)
    }
  }
}
