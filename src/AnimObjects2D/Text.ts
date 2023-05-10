import p5 from 'p5'
import AnimObject from '@/core/AnimObject2D'
import { roundOff } from '@helpers/miscellaneous'
import { textToSVGPolygons } from '@helpers/TextToSVG'
import { createSVG, removeSVG } from '@helpers/addSVG'
import { TextProps } from '@/interfaces/AnimObjects2D'
import { TextStyle } from '@/enums/AnimObjects2D'
import { Watchables } from '@/enums/auxiliary'

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

  // link(object: AnimObject, prop: Watchables, callback: Function) {
  //   if (!(prop in object)) return

  //   let watcher = {
  //     property: prop,
  //     handler: (text: string) => {
  //       let value = ''
  //       switch (prop) {
  //         case Watchables.slope:
  //         case Watchables.x:
  //         case Watchables.y:
  //           value = roundOff(parseFloat(text), 3).toString()
  //           break
  //         default:
  //           value = text
  //           break
  //       }
  //       callback(value)
  //     },
  //   }

  //   object.addWatcher(watcher)
  // }

  draw(p: p5) {
    if (this.transition) this.transition()
  }
}
